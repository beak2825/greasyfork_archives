// ==UserScript==
// @name        mini mvvm 
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     0.0.3
// @author      -
// @description 自用，bug较多，if和for指令不能使用
// ==/UserScript==
function* getSequence() {
    let i = 0;
    while (true) {
        yield (i = i + 1);
    }
}
let sequence = getSequence();
function getId(name) {
    return `${name ? name : 'none'}.${new Date().getTime()}.${Math.floor(Math.random() * 10000)}.${sequence.next().value}`;
}
class Dep {
    constructor(name) {
        this.subs = [];
        this.id = getId(name);
    }
    delete() {
        if (this.subs.length < 1)
            return;
        this.notify();
        this.subs.forEach((sub) => {
            sub.removeDep(this);
        });
        this.subs.length = 0;
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    depend() {
        Dep.target.addDep(this);
    }
    notify() {
        this.subs.forEach((sub) => {
            sub.update();
        });
    }
}
Dep.target = null;

const extend = (a, b) => {
    for (const key in b) {
        a[key] = b[key];
    }
    return a;
};
const isFunction = (val) => typeof val === 'function';
const NOOP = () => { };
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const isPlainObject = (val) => toTypeString(val) === '[object Object]';
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
function toArray(nodes) {
    return [].slice.call(nodes);
}
const unique = (arr) => Array.from(new Set(arr));

function observe(value, vm) {
    if (!value || typeof value !== 'object')
        return value;
    if(value.__ob__)
        return value
    return new Observer(value, vm).proxy;
}
class Observer {
    constructor(data, vm) {
        Object.keys(data).forEach((key) => {
            data[key] = observe(data[key], vm);
        });
        this.dep = new Dep('data');
        Object.defineProperty(data, '__ob__', {
            configurable: false,
            enumerable: false,
            value:this
        })
        this.proxy = new Proxy(data, {
            get: (target, key, receiver) => {
                const result = Reflect.get(target, key, receiver)
                if (Dep.target){
                  if(isPlainObject(result) && result.__ob__)
                    result.__ob__.dep.depend()
                  else
                    this.dep.depend()
                }
                return result;
            },
            set: (target, key, newValue, receiver) => {
                const result = Reflect.set(target, key, observe(newValue), receiver);
                this.dep.notify();
                return result;
            },
            deleteProperty: (target, key) => {
                const childObj = target[key];
                let result = false;
                if (isPlainObject(childObj) && hasOwn(childObj, '__ob__')) {
                    let ob = childObj['__ob__'];
                    ob.dep.delete();
                    ob = null;
                    result = Reflect.deleteProperty(target, key);
                    this.dep.notify();
                }
                return result;
            },
        });
    }
}

class EventEmitter {
    constructor(scope) {
        this._events = new Map();
        if (scope)
            this._scope = scope;
    }
    has(eventName){
      return this._events.has(eventName)
    }
    on(eventName, callback) {
        if (!this._events.has(eventName))
            this._events.set(eventName, []);
        this._events.get(eventName).push(callback);
    }
    emit(eventName, value) {
        if (!this._events.has(eventName))
            return;
        this._events.get(eventName).forEach((callback) => {
            if (isFunction(callback))
                    callback(value);
        });
    }
    off(eventName, callback) {
        if (callback) {
            this._events.set(eventName, this._events.get(eventName).filter((cb) => {
                if (cb === callback || cb.originFunction === callback)
                    return false;
            }));
        }
        else {
            this._events.delete(eventName);
        }
    }
    once(eventName, callback) {
        const self = this;
        const onceCallback = function () {
            self.off(eventName, onceCallback);
            callback.apply(self, arguments);
        };
        onceCallback.originFunction = callback;
        this.on(eventName, onceCallback);
    }
}

var EventLoop;
(function (EventLoop) {
    const callbacks = [];
    const p = Promise.resolve();
    let pending = false;
    let useMacroTask = false;
    function flushCallbacks() {
        pending = false;
        const copies = callbacks.slice(0);
        callbacks.length = 0;
        copies.forEach((fn) => fn());
    }
    EventLoop.flushCallbacks = flushCallbacks;
    const macroTimerFunction = () => {
        setTimeout(flushCallbacks, 0);
    };
    const microTimerFunction = () => {
        p.then(flushCallbacks);
    };
    function withMacroTask(fn) {
        return (fn._withTask ||
            (fn._withTask = function () {
                useMacroTask = true;
                const res = fn.apply(null, arguments);
                useMacroTask = false;
                return res;
            }));
    }
    EventLoop.withMacroTask = withMacroTask;
    function nextTick(context, callback) {
        let _resolve;
        callbacks.push(() => {
            if (callback)
                callback.call(context);
            else if (_resolve)
                _resolve(context);
        });
        if (!pending) {
            pending = true;
            if (useMacroTask)
                macroTimerFunction();
            else
                microTimerFunction();
        }
        if (!callback)
            return new Promise((resolve) => {
                _resolve = resolve;
            });
    }
    EventLoop.nextTick = nextTick;
})(EventLoop || (EventLoop = {}));

function getApplyFunction(fn, scope) {
    const func = function () {
        fn.apply(scope, arguments);
    };
    return func;
}
const createVM = (options = {}) => new MVVM(extend(options, {
    element: options.element ? options.element : document.body
}));
class MVVM {
    constructor(options = {}) {
        this.$event = new EventEmitter(this);
        this.$children = {};
        this.$refs = {};
        this.$on = getApplyFunction(this.$event.on, this.$event);
        this.$emit = getApplyFunction(this.$event.emit, this.$event);
        this.$off = getApplyFunction(this.$event.off, this.$event);
        this.$once = getApplyFunction(this.$event.once, this.$event);
        this.$options = options;
        this.components = options.components;
        MVVM.cid += 1;
        this.cid = MVVM.cid;
        this._init();
        if (this.$options.element)
            this.compile(this.$options.element);
    }
    $watch(key, cb) {
        new Watcher(this, key, cb);
    }
    $nextTick(callback) {
        if (callback)
            return EventLoop.nextTick(this, callback);
        return EventLoop.nextTick(this);
    }
    use(fn) {
        fn.call(this, this);
        return this;
    }
    compile(element) {
        this.$compile = new Compile(element, this);
        this.$emit('mounted');
    }
    _init() {
        this._initMethods();
        this._initLifecycle();
        this.$emit('beforeCreate');
        this._initData();
        this._initComputed();
        this._initWatch();
        this.$emit('created');
    }
    _initMethods() {
        let methods = this.$options.methods;
        if (typeof methods !== 'object')
            return;
        Object.keys(methods).forEach((key) => {
            let object = methods[key];
            if (!isFunction(object))
                return;
            if (this[key])
                return;
            this[key] = object;
        });
    }
    _initLifecycle() {
        this.$options.beforeCreate &&
            this.$on('beforeCreate', this.$options.beforeCreate.bind(this));
        this.$options.created && this.$on('created', this.$options.created.bind(this));
        this.$options.beforeMount &&
            this.$on('beforeMount', this.$options.beforeMount);
        this.$options.mounted && this.$on('mounted', this.$options.mounted.bind(this));
        this.$options.beforeUpdate &&
            this.$on('beforeUpdate', this.$options.beforeUpdate);
        this.$options.updated && this.$on('updated', this.$options.updated.bind(this));
    }
    _initData() {
        const data = this.$options.data;
        this.$data = isFunction(data) ? data.call(this) : data;
        Object.keys(this.$data).forEach((key) => Object.defineProperty(this, key, {
            configurable: false,
            enumerable: true,
            get: () => {
                return this.$data[key];
            },
            set: (newVal) => {
                this.$data[key] = newVal;
            },
        }));
        this.$data = observe(this.$data, this);
    }
    _initComputed() {
        let computed = this.$options.computed;
        if (!isPlainObject(computed))
            return;
        Object.keys(computed).forEach((key) => {
            let object = computed[key];
            Object.defineProperty(this, key, {
                get: isFunction(object)
                    ? object
                    : 'get' in object
                        ? object.get
                        : NOOP,
                set: isFunction(object)
                    ? object
                    : 'set' in object
                        ? object.set
                        : NOOP,
            });
        });
    }
    _initWatch() {
        let watch = this.$options.watch;
        if (typeof watch !== 'object')
            return;
        Object.keys(watch).forEach((key) => {
            let object = watch[key];
            if (!isFunction(object))
                return;
            this.$watch(key, object);
        });
    }
}
MVVM.cid = 0;
function getVMVal(vm, exp) {
    let temp;
    exp.split('.').forEach((k, i) => {
        if (i === 0)
            temp = vm[k];
        else
            temp = temp[k];
    });
    return temp;
}
function setVMVal(vm, exp, value) {
    let temp;
    let exps = exp.split('.');
    if (exps.length === 1)
        vm[exps[0]] = value;
    else
        exps.forEach((k, i, exps) => {
            if (i === 0)
                temp = vm[k];
            else if (i < exps.length - 1)
                temp = temp[k];
            else if (i === exps.length - 1)
                temp[k] = value;
        });
}

function parseGetter(exp) {
    return (vm) => getVMVal(vm, exp);
}
class Watcher {
    constructor(vm, expOrFn, callback,deep = false) {
        this.callback = callback;
        this.vm = vm;
        this.deep = deep
        this._depIds = {};
        if (isFunction(expOrFn))
            this._getter = expOrFn;
        else
            this._getter = parseGetter(expOrFn.trim());
        this.value = this.get();
    }
    update() {
        let newVal = this.get();
        let oldVal = this.value;
        if (newVal === oldVal && !(this.deep && isPlainObject(newVal) && isPlainObject(oldVal))) return
        this.value = newVal;
        this.callback.call(this.vm, newVal, oldVal);
    }
    removeDep(dep) {
        delete this._depIds[dep.id];
    }
    addDep(dep) {
        if (!hasOwn(this._depIds, dep.id)) {
            dep.addSub(this);
            this._depIds[dep.id] = dep;
        }
    }
    get() {
        Dep.target = this;
        let value = this._getter.call(this.vm, this.vm);
        Dep.target = null;
        return value;
    }
}

class ElementUtility {
    static fragment(el) {
        let fragment = document.createDocumentFragment(), child;
        while ((child = el.firstChild))
            fragment.appendChild(child);
        return fragment;
    }
    static parseHTML(html) {
        const domParser = new DOMParser();
        let temp = domParser.parseFromString(html, 'text/html');
        return temp.body.children;
    }
    static isElementNode(node) {
        if (node instanceof Element)
            return node.nodeType == 1;
        return false;
    }
    static isTextNode(node) {
        if (node instanceof Text)
            return node.nodeType == 3;
        return false;
    }
    static text(node, value) {
        if (typeof value === 'number')
            value = String(value);
        node.textContent = value ? value : '';
    }
    static html(node, value) {
        if (typeof value === 'number')
            value = String(value);
        node.innerHTML = value ? value : '';
    }
    static class(node, value, oldValue) {
        let className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');
        let space = className && String(value) ? ' ' : '';
        node.className = className + space + value;
    }
    static model(node, newValue) {
        if (typeof newValue === 'number')
            newValue = String(newValue);
        node.value = newValue ? newValue : '';
    }
    static style(node, newValue, oldValue) {
        if (!oldValue)
            oldValue = {};
        if (!newValue)
            newValue = {};
        const keys = Object.keys(oldValue).concat(Object.keys(newValue));
        unique(keys).forEach((key) => {
            if (hasOwn(oldValue, key) && hasOwn(newValue, key)) {
                if (oldValue[key] != newValue[key])
                    node.style.setProperty(key, newValue[key]);
            }
            else if (hasOwn(newValue, key))
                node.style.setProperty(key, newValue[key]);
            else
                node.style.removeProperty(key);
        });
    }
    static display(node, newValue, oldValue) {
        let func = (val) => {
            return {
                display: val ? 'block' : 'none',
            };
        };
        ElementUtility.style(node, func(newValue), null);
    }
}

class MVVMComponent extends MVVM {
    constructor(options) {
        super(options);
        this.$template = options.template || '';
        if (options.parent)
            this.$parent = options.parent;
    }
    $mount(element) {
        this.compile(element);
    }
    
    static mount(component,element) {
        const vm = new MVVMComponent(component)
        vm.$mount(element)
        return vm
    }

    static appendChild(component,element){
        const div = document.createElement('div')
        element.appendChild(div)
        return MVVMComponent.mount(component,div)
    }
}

const parseAnyDirectiveFunction = (parseString) => {
    return (dir) => dir.indexOf(parseString) == 0;
};
const isDirective = parseAnyDirectiveFunction('v-');
const isEventDirective = parseAnyDirectiveFunction('on');
const isTextDirective = parseAnyDirectiveFunction('text');
const isHtmlDirective = parseAnyDirectiveFunction('html');
const isModelDirective = parseAnyDirectiveFunction('model');
const isClassDirective = parseAnyDirectiveFunction('class');
const isStyleDirective = parseAnyDirectiveFunction('style');
const isShowDirective = parseAnyDirectiveFunction('show');
const isRefDirective = parseAnyDirectiveFunction('ref');
const isForDirective = parseAnyDirectiveFunction('for');

function bindWatcher(node, vm, exp, updater) {
    let __for__ = node['__for__'];
    let val;
    if (__for__ && __for__[exp]) 
        val = __for__[exp]
    else
        val = getVMVal(vm, exp);
    updater && updater(node, val);
    new Watcher(vm, exp, (newValue, oldValue) => {
        if (newValue === oldValue)
            return;
        updater && updater(node, newValue, oldValue);
    });
}
function eventHandler(node, vm, exp, eventType) {
    let fn = vm.$options.methods && vm.$options.methods[exp];
    if (eventType && fn) {
        if(node instanceof MVVMComponent)
          node.$on(eventType,fn.bind(vm))
        else
          node.addEventListener(eventType, fn.bind(vm), false);
    }
}
function vFor(node, vm, exp, c) {
    let reg = /\((.*)\)/;
    let item, index, list;
    if (reg.test(exp)) {
        const arr = RegExp.$1.trim().split(',');
        item = arr[0];
        index = arr[1];
        let rightString = RegExp.rightContext.trim();
        let rarr = rightString.split(' ');
        list = rarr[1];
        if (rarr[0] !== 'in')
            return;
        let val = getVMVal(vm, list);
        let children = [];
        toArray(node.children).forEach((element) => {
            children.push(element.cloneNode(true));
            node.removeChild(element);
        });
        for (let i = 0; i < val.length; i++) {
            children.forEach((element) => {
                let newNode = element.cloneNode(true);
                newNode.__for__ = {
                    [item]: val[i],
                    [index]: i
                };
                node.appendChild(newNode);
                c.compileElement(node);
            });
        }
    }
}
function forHandler(node, vm, exp, c) {
    vFor(node, vm, exp, c);
    new Watcher(vm, exp, (newValue, oldValue) => {
        if (newValue === oldValue)
            return;
        vFor(node, vm, exp, c);
    });
}
class Compile {
    constructor(el, vm) {
        this.slotCallback = [];
        this.$vm = vm;
        this.$el = ElementUtility.isElementNode(el)
            ? el
            : document.querySelector(el);
        this._init();
    }
    _init() {
        if (this.$vm instanceof MVVMComponent) {
            this.$slot = ElementUtility.fragment(this.$el);
            this.$fragment = this.parseComponentTemplate(this.$vm.$template);
            this.$vm.$el = this.$el;
            this.$vm.$emit('beforeMount');
            this.compileElement(this.$fragment);
            this.$el.parentNode.replaceChild(this.$fragment, this.$el);
        }
        else {
            this.$fragment = ElementUtility.fragment(this.$el);
            this.$vm.$el = this.$el;
            this.$vm.$emit('beforeMount');
            this.compileElement(this.$fragment);
            this.$el.appendChild(this.$fragment);
        }
        Object.entries(this.$vm.$children).forEach(([key, child]) => {
            const slotCallback = child.$compile.slotCallback;
            if (slotCallback.length < 1)
                return;
            slotCallback.forEach((fn) => {
                fn(this);
            });
        });
    }
    isSlot(node) {
        if (node.tagName === 'SLOT')
            return true;
        return false;
    }
    compileSlotElement(slot) {
        if (!(this.$vm instanceof MVVMComponent))
            return;
        if (this.$slot.children.length === 0) {
            slot.parentNode.removeChild(slot);
            return;
        }
        this.slotCallback.push(c => {
            c.compileElement(this.$slot);
            slot.parentNode.replaceChild(this.$slot, slot);
        });
    }
    parseComponentTemplate(templateHTML) {
        let element = ElementUtility.parseHTML(templateHTML);
        const template = document.createElement('template');
        if (element.length) {
            if (element.length === 1) {
                if (element[0].tagName.toLowerCase() !== 'template')
                    template.appendChild(element[0]);
            }
            else
                toArray(element).forEach((child) => {
                    template.appendChild(child);
                });
        }
        return ElementUtility.fragment(template);
    }
    parseTemplate(leftString, rightString) {
        return (node, newValue, oldValue) => {
            const str = leftString + newValue + rightString;
            ElementUtility.text(node, str);
        };
    }
    compileElement(el) {
        let childNodes = [];
        // slice
        el.childNodes.forEach(node=>{
          childNodes.push(node)
        })
        childNodes.forEach((node) => {
            if (el['__for__'])
                node['__for__'] = el['__for__'];
            let reg = /\{\{(.*)\}\}/;
            if (ElementUtility.isElementNode(node)) {
                if (this.isComponent(node))
                  this.compileComponent(node.tagName.toLowerCase(), node);
                else if (this.isSlot(node)) 
                    this.compileSlotElement(node);
                else
                    this.compile(node);
            }
            else if (ElementUtility.isTextNode(node) &&
                reg.test(node.textContent))
                bindWatcher(node, this.$vm, RegExp.$1.trim(), this.parseTemplate(RegExp.leftContext, RegExp.rightContext));
            if (node.childNodes && node.childNodes.length)
                this.compileElement(node);
        });
    }
    compile(node) {
        let nodeAttrs = node.attributes;
        toArray(nodeAttrs).forEach((attr) => {
            let attrName = attr.name;
            if (!isDirective(attrName)){
              if (attrName.startsWith('[') && attrName.endsWith(']')) {
                node.removeAttribute(attrName)
                let realAttrName = attrName.replace('[','')
                realAttrName = realAttrName.replace(']','')
                bindWatcher(node,this.$vm,attr.value,(node,newVal,oldVal)=>{
                  node.setAttribute(realAttrName,newVal)
                })
              }
              return;
            }
            let dir = attrName.substring(2);
            let suffix = dir.split(':')[1];
            let exp = attr.value || suffix;
            if (isEventDirective(dir))
                eventHandler(node, this.$vm, exp, suffix);
            else if (isTextDirective(dir))
                bindWatcher(node, this.$vm, exp, ElementUtility.text);
            else if (isHtmlDirective(dir))
                bindWatcher(node, this.$vm, exp, ElementUtility.html);
            else if (isClassDirective(dir))
                bindWatcher(node, this.$vm, exp, ElementUtility.class);
            else if (isModelDirective(dir)) {
                bindWatcher(node, this.$vm, exp, ElementUtility.model);
                let val = getVMVal(this.$vm, exp);
                node.addEventListener('input', (e) => {
                    let target = e.target;
                    let newValue = target.value;
                    if (val === newValue)
                        return;
                    setVMVal(this.$vm, exp, newValue);
                    val = newValue;
                });
            }
            else if (isStyleDirective(dir))
                bindWatcher(node, this.$vm, exp, ElementUtility.style);
            else if (isShowDirective(dir))
                bindWatcher(node, this.$vm, exp, ElementUtility.display);
            else if (isRefDirective(dir))
                this.$vm.$refs[exp] = node;
            else if (isForDirective(dir))
                forHandler(node, this.$vm, exp, this);
            node.removeAttribute(attrName);
        });
    }
    isComponent(node) {
        const tagName = node.tagName.toLowerCase();
        if (!/^[(a-zA-Z)-]*$/.test(tagName))
            return false;
        if (this.$vm.components && hasOwn(this.$vm.components, tagName))
            return true;
        return false;
    }
    compileComponent(componentName, node) {
        const attributes = []
        toArray(node.attributes).forEach((attr) => {
          attributes.push(attr)
        })
        const componentOptions = this.$vm.components[componentName];
        const component = new MVVMComponent(extend(componentOptions, {
            parent: this.$vm
        }));
        component.$mount(node);
        this.$vm.$children[componentName] = component;
        attributes.forEach(attr=>{
          let attrName = attr.name;
          if (!isDirective(attrName))
            return;
          let dir = attrName.substring(2);
          let suffix = dir.split(':')[1];
          let exp = attr.value || suffix;
          if (isEventDirective(dir))
            eventHandler(component, this.$vm, exp, suffix);
          else if (isRefDirective(dir))
              this.$vm.$refs[exp] = component;
        })
    }
}