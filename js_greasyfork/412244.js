// ==UserScript==
// @name         监听dom
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://gu.qq.com/i/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412244/%E7%9B%91%E5%90%ACdom.user.js
// @updateURL https://update.greasyfork.org/scripts/412244/%E7%9B%91%E5%90%ACdom.meta.js
// ==/UserScript==


(function() {
    'use strict';

    (function() {

        /* eslint-disable */

let alreadyExists = !1;
try {
  const {
    Slim: e,
  } = window;
  e && e.plugins && e.asap && ((console.error || console.warn || console.log)('Warning: slim.js already initialized on window'), alreadyExists = !0);
} catch (e) {}
Symbol.Slim = Symbol('@SlimInternals');
const _$ = Symbol.Slim;
const isReadOnly = (e, t) => {
  const i = Object.getOwnPropertyDescriptor(e, t);
  return i && !1 === i.writable;
};
const __flags = {

  isIE11: !!window.MSInputMethodContext && !!document.documentMode,
  isChrome: void 0,
  isEdge: void 0,
  isSafari: void 0,
  isFirefox: void 0,
};
try {
  __flags.isChrome = /Chrome/.test(navigator.userAgent), __flags.isEdge = /Edge/.test(navigator.userAgent), __flags.isSafari = /Safari/.test(navigator.userAgent), __flags.isFirefox = /Firefox/.test(navigator.userAgent), (__flags.isIE11 || __flags.isEdge) && (__flags.isChrome = !1, Object.defineProperty(Node.prototype, 'children', function() {
    return this.childNodes;
  }));
} catch (e) {}
class Internals {
  constructor() {
    this.boundParent = null, this.repeater = {}, this.bindings = {}, this.inbounds = {}, this.eventHandlers = {}, this.rootElement = null, this.createdCallbackInvoked = !1, this.sourceText = null, this.excluded = !1, this.autoBoundAttributes = [];
  }
}
class Slim extends HTMLElement {
  static get dashToCamel() {
    return e => (e.indexOf('-') < 0 ? e : e.replace(/-[a-z]/g, e => e[1].toUpperCase()));
  }
  static get camelToDash() {
    return e => e.replace(/([A-Z])/g, '-$1').toLowerCase();
  }
  static get rxProp() {
    return /(.+[^(\((.+)\))])/;
  }
  static get rxMethod() {
    return /(.+)(\((.+)\)){1}/;
  }
  static lookup(e, t, i) {
    const n = t.split('.');
    let s;
    s = i && i[_$].repeater[n[0]] ? i[_$].repeater : e;
    let o = 0;
    for (; s && o < n.length;) s = s[n[o++]];
    return s;
  }
  static _$(e) {
    return e[_$] = e[_$] || new Internals(), e[_$];
  }
  static tag(e, t, i) {
    void 0 === i ? i = t : Object.defineProperty(i.prototype, 'template', {
      value: t,
    }), this.classToTagDict.set(i, e), customElements.define(e, i);
  }
  static tagOf(e) {
    return this.classToTagDict.get(e);
  }
  static plugin(e, t) {
    const i = this.plugins[e];
    if (!i) throw new Error(`Cannot attach plugin: ${e} is not a supported phase`);
    return i.add(t), () => i.delete(t);
  }
  static checkCreationBlocking(e) {
    if (e.attributes) {
      for (let t = 0, i = e.attributes.length; t < i; t++) {
        const i = e.attributes[t];
        for (const [ e, t ] of Slim[_$].customDirectives) { if (t.isBlocking && e(i)) return !0; }
      }
    }
    return !1;
  }
  static customDirective(e, t, i) {
    if (this[_$].customDirectives.has(e)) throw new Error(`Cannot register custom directive: ${e} already registered`);
    t.isBlocking = i, this[_$].customDirectives.set(e, t);
  }
  static executePlugins(e, t) {
    this.plugins[e].forEach(e => {
      e(t);
    });
  }
  static qSelectAll(e, t) {
    return [ ...e.querySelectorAll(t) ];
  }
  static unbind(e, t) {
    const i = e[_$].bindings;
    Object.keys(i).forEach(e => {
      const n = i[e].chain;
      n.has(t) && n.delete(t);
    });
  }
  static root(e) {
    return e.__isSlim && e.useShadow ? e[_$].rootElement || e : e;
  }
  static removeChild(e) {
    typeof e.remove === 'function' && e.remove(), e.parentNode && e.parentNode.removeChild(e), this._$(e).internetExploderClone && this.removeChild(this._$(e).internetExploderClone);
  }
  static wrapGetterSetter(e, t) {
    const i = t.split('.')[0];
    const n = e.__lookupSetter__(i);
    if (n && n[_$]) return i;
    const s = e[i],
      {
        bindings: o,
      } = this._$(e);
    o[i] = {
      chain: new Set(),
      value: s,
    }, o[i].value = s;
    const r = t => {
      n && n.call(e, t), o[i].value = t, e._executeBindings(i);
    };
    return r[_$] = !0, e.__defineGetter__(i, () => e[_$].bindings[i].value), e.__defineSetter__(i, r), i;
  }
  static bindOwn(e, t, i) {
    return Slim.bind(e, e, t, i);
  }
  static bind(e, t, i, n) {
    if (Slim._$(e), Slim._$(t), t[_$].excluded) return;
    n.source = e, n.target = t;
    const s = this.wrapGetterSetter(e, i);
    return t[_$].repeater[s] || e[_$].bindings[s].chain.add(t), t[_$].inbounds[s] = t[_$].inbounds[s] || new Set(), t[_$].inbounds[s].add(n),
    function() {
      const t = e[_$].bindings;
      t[s] && t[s].chain && t[s].chain.delete(n);
    };
  }
  static update(e, ...t) {
    if (t.length === 0) return Slim.commit(e);
    for (const i of t) Slim.commit(e, i);
  }
  static commit(e, t) {
    const i = Slim._$(e);
    const n = t ? [ t ] : Object.keys(i.bindings);
    for (const e of n) {
      const t = i.inbounds[e];
      if (t) { for (const e of t) e(); }
      const n = i.bindings[e];
      if (n) {
        const t = n.chain;
        for (const i of t) Slim.commit(i, e);
      }
    }
  }
  constructor() {
    super(), Slim._$(this), this.__isSlim = !0;
    const e = () => {
      Slim.checkCreationBlocking(this) || this.createdCallback();
    };
    __flags.isSafari ? Slim.asap(e) : e();
  }
  createdCallback() {
    this[_$] && this[_$].createdCallbackInvoked || (this._initialize(), this[_$].createdCallbackInvoked = !0, this.onBeforeCreated(), Slim.executePlugins('create', this), this.render(), this.onCreated());
  }
  connectedCallback() {
    super.connectedCallback && super.connectedCallback(), Slim.checkCreationBlocking(this) || this.createdCallback(), this.onAdded(), Slim.executePlugins('added', this);
  }
  disconnectedCallback() {
    this.onRemoved(), Slim.executePlugins('removed', this);
  }
  attributeChangedCallback(e, t, i) {
    i !== t && this.autoBoundAttributes.includes[e] && (this[Slim.dashToCamel(e)] = i);
  }
  _executeBindings(e) {
    Slim.debug('_executeBindings', this.localName, this), Slim.commit(this, e);
  }
  _bindChildren(e) {
    Slim.debug('_bindChildren', this.localName), e || (e = Slim.qSelectAll(this, '*'));
    for (const t of e) {
      if (Slim._$(t), t[_$].boundParent !== this) {
        if (t[_$].boundParent = t[_$].boundParent || this, t.attributes.length) {
          const e = Array.from(t.attributes);
          let i = 0,
            n = t.attributes.length;
          for (; i < n;) {
            const n = this,
              s = e[i];
            if (!t[_$].excluded) {
              for (const [ e, i ] of Slim[_$].customDirectives) {
                const o = e(s);
                o && i(n, t, s, o);
              }
            }
            i++;
          }
        }
        t[_$].excluded || scanNode(this, t);
      }
    }
  }
  _resetBindings() {
    Slim.debug('_resetBindings', this.localName), this[_$].bindings = {};
  }
  _render(e) {
    Slim.debug('_render', this.localName), Slim.executePlugins('beforeRender', this), this._resetBindings(), [ ...this.children ].forEach(e => {
      e.localName === 'style' && (this[_$].externalStyle = document.importNode(e).cloneNode());
    }), Slim.root(this).innerHTML = '';
    const t = e || this.template,
      i = document.createElement('template');
    i.innerHTML = t;
    const n = i.content.cloneNode(!0),
      {
        externalStyle: s,
      } = this[_$];
    s && n.appendChild(this[_$]);
    const o = Slim.qSelectAll(n, '*'),
      r = () => {
        (this[_$].rootElement || this).appendChild(n), this._bindChildren(o), this._executeBindings(), this.onRender(), Slim.executePlugins('afterRender', this);
      };
    this.useShadow ? r() : Slim.asap(r);
  }
  _initialize() {
    Slim.debug('_initialize', this.localName), this.useShadow ? void 0 === HTMLElement.prototype.attachShadow ? this[_$].rootElement = this.createShadowRoot() : this[_$].rootElement = this.attachShadow({
      mode: 'open',
    }) : this[_$].rootElement = this;
    const e = this.constructor.observedAttributes;
    e && e.forEach(e => {
      this[Slim.dashToCamel(e)] = this.getAttribute(e);
    });
  }
  get autoBoundAttributes() {
    return [];
  }
  commit(...e) {
    Slim.commit(this, ...e);
  }
  update(...e) {
    Slim.update(this, ...e);
  }
  render(e) {
    this._render(e);
  }
  onRender() {}
  onBeforeCreated() {}
  onCreated() {}
  onAdded() {}
  onRemoved() {}
  find(e) {
    return this[_$].rootElement.querySelector(e);
  }
  findAll(e) {
    return Slim.qSelectAll(this[_$].rootElement, e);
  }
  callAttribute(e, t) {
    const i = this.getAttribute(e);
    if (i) return this[_$].boundParent[i](t);
  }
  get useShadow() {
    return !1;
  }
  get template() {
    return '';
  }
}
Slim.classToTagDict = new Map(), Slim.plugins = {
  create: new Set(),
  added: new Set(),
  beforeRender: new Set(),
  afterRender: new Set(),
  removed: new Set(),
}, Slim.debug = () => {}, Slim.asap = window && window.requestAnimationFrame ? e => window.requestAnimationFrame(e) : typeof setImmediate !== 'undefined' ? setImmediate : e => setTimeout(e, 0), Slim[_$] = {
  customDirectives: new Map(),
  uniqueCounter: 0,
  supportedNativeEvents: Object.keys(HTMLElement.prototype).filter(e => e.startsWith('on')),
}, Slim.isReadOnly = isReadOnly, Slim.customDirective(e => Slim[_$].supportedNativeEvents.indexOf(e.nodeName.slice(2)), (e, t, i) => {
  const n = i.nodeName,
    s = i.value;
  Slim._$(t).eventHandlers = t[_$].eventHandlers || {};
  const o = t[_$].eventHandlers;
  o[n] = o[n] || new WeakSet();
  let r = i => {
    try {
      e[s].call(e, i);
    } catch (i) {
      i.message = `Could not respond to event "${n}" on ${t.localName} -> "${s}" on ${e.localName} ... ${i.message}`, console.warn(i);
    }
  };
  o[n].add(r), t.addEventListener(n, r), r = null;
});
const scanNode = (e, t) => {
  const i = Array.from(t.childNodes).filter(e => e.nodeType === Node.TEXT_NODE),
    n = t,
    s = Slim._$(t).repeater;
  i.forEach(t => {
    let i = '';
    const o = t.nodeValue.match(/\{\{([^\}\}]+)+\}\}/g),
      r = {},
      l = {};
    if (o) {
      Slim._$(t).sourceText = t.nodeValue, t[_$].repeater = s, o.forEach(t => {
        const s = /\{\{(.+)(\((.+)\)){1}\}\}/.exec(t);
        if (s) {
          const n = s[1],
            o = s[3].split(' ').join('').split(',');
          return o.map(e => e.split('.')[0]).forEach(e => r[e] = !0), void (l[t] = s => {
            const r = o.map(t => Slim.lookup(e, t, s)),
              l = e[n],
              a = l ? l.apply(e, r) : void 0;
            void 0 !== a && (i = i.split(t).join(a || ''));
          });
        }
        const o = /\{\{(.+[^(\((.+)\))])\}\}/.exec(t);
        if (o) {
          const s = o[1];
          r[s] = !0, l[t] = o => {
            const r = Slim.lookup(e, s, n);
            void 0 !== r && (i = i.split(t).join(r || ''));
          };
        }
      });
      const a = () => {
        i = t[_$].sourceText, Object.keys(l).forEach(e => {
          l[e](t);
        }), t.nodeValue = i;
      };
      Object.keys(r).forEach(t => {
        Slim.bind(e, n, t, a);
      });
    }
  });
};
Slim.customDirective(e => e.nodeName === 's:id', (e, t, i) => {
  Slim._$(t).boundParent[i.value] = t;
}), Slim.customDirective(e => /^(bind):(\S+)/.exec(e.nodeName), (e, t, i, n) => {
  const s = n[2],
    o = Slim.dashToCamel(s),
    r = i.value;
  const l = Slim.rxMethod.exec(r);
  if (l) {
    const i = l[3].split(' ').join('').split(',');
    return void i.forEach(n => {
      Slim.bind(e, t, n, () => {
        const n = Slim.lookup(e, l[1], t),
          r = i.map(i => Slim.lookup(e, i, t)),
          a = n.apply(e, r);
        void 0 !== a && (isReadOnly(t, o) || (t[o] = a), t.setAttribute(s, a));
      });
    });
  }
  const a = Slim.rxProp.exec(r);
  if (a) {
    const i = a[1];
    Slim.bind(e, t, i, () => {
      const i = Slim.lookup(e, r, t);
      void 0 !== i && (t.setAttribute(s, i), isReadOnly(t, o) || (t[o] = i));
    });
  }
}), !alreadyExists && window && (window.Slim = Slim);


})()

function debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function later() {
    // 据上一次触发时间间隔
    var last = +new Date() - timestamp; // 上次被包装函数被调用时间间隔last小于设定时间间隔wait

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null; // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用

      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    context = this;
    timestamp = +new Date();
    var callNow = immediate && !timeout; // 如果延时不存在，重新设定延时

    if (!timeout) timeout = setTimeout(later, wait);

    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}


    function isFunction(functionToCheck) {
 return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

       function safeCalc(v1, v2, { symbol = '+', fixed = 2 } = {}) {
      return parseFloat( eval(`${v1} ${symbol} ${v2}`).toFixed(fixed))
   }


function getPriceDom(symbolName) {
return document.querySelector('[data-symbol="'+symbolName+'"]').children[0].children[2]
}

    window.getPriceDom = getPriceDom

    function obervePriceDOM(targetNode, onChange) {
        const config = { attributes: true, subtree: true, characterData: true };

    // 当观察到变动时执行的回调函数
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
//     console.log(mutationsList)
//     for(let mutation of mutationsList) {
//         if (mutation.type === 'attributes') {
//             console.log('The ' + mutation.attributeName + ' attribute was modified.');
//         }
//     }
    if (onChange) {
        onChange(mutationsList, observer)
    }
};

    // 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(targetNode, config);

        return observer
    }

    window.obervePriceDOM = obervePriceDOM

    window.createObserveFac = function(symbolID = '600487', options = {
       prefix:"sh"
    }) {
        let dom = getPriceDom(options.prefix + symbolID)
        let parentNode = dom.parentNode
        let observer = obervePriceDOM(dom, function() {
            let curPrice = parseFloat(dom.children[0].innerText)
            let curChangePrice = parseFloat(parentNode.children[3].children[0].innerText)
            if (options && options.onChange) {
                options.onChange(curPrice, curChangePrice, parentNode)
            }
        })
        return { observer }
    }

    window.showNotification = debounce(function(title = 'title', body = 'notification body') {
        Notification.requestPermission( function(status) {
            console.log(status); // 仅当值为 "granted" 时显示通知
            var n = new Notification(title, {body}); // 显示通知
        });
    }, 3500, true)

    let allTasks = {}

    window._allTasks = allTasks

    window.defObserveFac = function(symbolID, priceTop = Number.MAX_SAFE_INTEGER, priceEnd = Number.MIN_SAFE_INTEGER, options = {}) {
        window.delObserveFac(symbolID)
        allTasks[symbolID]  =  window.createObserveFac(symbolID, {
            onChange(curPrice, curChangePrice, parentNode) {
//                console.log('onChange', curPrice)
                let name = parentNode.children[1].children[1].children[0].innerText
                          console.log(symbolID, curPrice, curChangePrice)

                let curFirstPrice = safeCalc(curPrice, curChangePrice, { symbol: '-' })
                if (isFunction(priceTop)) {
                  let _fun = priceTop
                  priceTop = _fun(curFirstPrice)
                }

                if (curPrice > priceTop) {
                    showNotification(`${name} ` + symbolID, `价格 ${curPrice} 高于 ${priceTop}`)
                }

                if (isFunction(priceEnd)) {
                  let _fun = priceEnd
                  priceEnd = _fun(curFirstPrice)
                }

                if (curPrice < priceEnd) {
                    showNotification(`${name} ` + symbolID, `价格 ${curPrice} 低于${priceEnd}`)
                }
            },
            ...options
        })
        return allTasks[symbolID]
    }

    window.delObserveFac = function(symbolID) {
        if (allTasks[symbolID] && allTasks[symbolID].observer) {
            allTasks[symbolID].observer.disconnect()
            delete allTasks[symbolID]
        }
    }

    window.onload = function() {

    setTimeout(() => {
        let watchObj = {
            // 南方航空
            ['600029']: {
               min(curPrice) {
                 return safeCalc(curPrice, -.05)
               },
                max(curPrice) {
                 return safeCalc(curPrice, +.05)
               },
               options: {
                 prefix:"sh"
               }
            },
            // 东方航空
            ['600115']: {
                min(curPrice) {
                   return safeCalc(curPrice, .99, { symbol: "*" } )
               },
                max(curPrice) {
                   return safeCalc(curPrice, 1.02, { symbol: "*" } )
               },
                options: {
                 prefix:"sh"
               }
            },
            // 上海莱士
            ['002252']: {
               min(curPrice) {
                return safeCalc(curPrice, .1, { symbol: "*" } )
               },
                max(curPrice) {
                    return safeCalc(curPrice, 1.01, { symbol: "*" } )
               },
                options: {
                 prefix:"sz"
               }
            }
        }
        for (let key in watchObj) {
            window.defObserveFac(key, watchObj[key].max, watchObj[key].min, watchObj[key].options)
        }
        console.log('started')
    }, 6000)
    }
})();