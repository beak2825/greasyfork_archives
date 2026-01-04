// ==UserScript==
// @name         Form Blocks SpecialForce
// @version      1.0
// @description  ...
// @author       L
// @match        https://taximeter-admin.taxi.yandex-team.ru/blacklist/item/addBulk
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/450349/Form%20Blocks%20SpecialForce.user.js
// @updateURL https://update.greasyfork.org/scripts/450349/Form%20Blocks%20SpecialForce.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 1512:
/***/ ((module, exports, __webpack_require__) => {

var Select = __webpack_require__(3244);
var $offset = __webpack_require__(6906);
var $show = __webpack_require__(7665);
var $css = __webpack_require__(975);
var $attr = __webpack_require__(4991);
var $property = __webpack_require__(4209);
var last = __webpack_require__(9702);
var $remove = __webpack_require__(6757);
var $data = __webpack_require__(8381);
var $event = __webpack_require__(5543);
var $class = __webpack_require__(7781);
var $insert = __webpack_require__(8908);
var isUndef = __webpack_require__(1286);
var isStr = __webpack_require__(6768);

exports = function(selector) {
    return new Select(selector);
};

Select.methods({
    offset: function() {
        return $offset(this);
    },
    hide: function() {
        return this.css('display', 'none');
    },
    show: function() {
        $show(this);
        return this;
    },
    first: function() {
        return exports(this[0]);
    },
    last: function() {
        return exports(last(this));
    },
    get: function(idx) {
        return this[idx];
    },
    eq: function(idx) {
        return exports(this[idx]);
    },
    on: function(event, selector, handler) {
        $event.on(this, event, selector, handler);
        return this;
    },
    off: function(event, selector, handler) {
        $event.off(this, event, selector, handler);
        return this;
    },
    html: function(val) {
        var result = $property.html(this, val);
        if (isUndef(val)) return result;
        return this;
    },
    text: function(val) {
        var result = $property.text(this, val);
        if (isUndef(val)) return result;
        return this;
    },
    val: function(val) {
        var result = $property.val(this, val);
        if (isUndef(val)) return result;
        return this;
    },
    css: function(name, val) {
        var result = $css(this, name, val);
        if (isGetter(name, val)) return result;
        return this;
    },
    attr: function(name, val) {
        var result = $attr(this, name, val);
        if (isGetter(name, val)) return result;
        return this;
    },
    data: function(name, val) {
        var result = $data(this, name, val);
        if (isGetter(name, val)) return result;
        return this;
    },
    rmAttr: function(name) {
        $attr.remove(this, name);
        return this;
    },
    remove: function() {
        $remove(this);
        return this;
    },
    addClass: function(name) {
        $class.add(this, name);
        return this;
    },
    rmClass: function(name) {
        $class.remove(this, name);
        return this;
    },
    toggleClass: function(name) {
        $class.toggle(this, name);
        return this;
    },
    hasClass: function(name) {
        return $class.has(this, name);
    },
    parent: function() {
        return exports(this[0].parentNode);
    },
    append: function(val) {
        $insert.append(this, val);
        return this;
    },
    prepend: function(val) {
        $insert.prepend(this, val);
        return this;
    },
    before: function(val) {
        $insert.before(this, val);
        return this;
    },
    after: function(val) {
        $insert.after(this, val);
        return this;
    }
});

var isGetter = function(name, val) {
    return isUndef(val) && isStr(name);
};

module.exports = exports;


/***/ }),

/***/ 4991:
/***/ ((module, exports, __webpack_require__) => {

var toArr = __webpack_require__(1352);
var isObj = __webpack_require__(5166);
var isStr = __webpack_require__(6768);
var each = __webpack_require__(3783);
var isUndef = __webpack_require__(1286);
var $safeEls = __webpack_require__(2341);

exports = function(els, name, val) {
    els = $safeEls(els);
    var isGetter = isUndef(val) && isStr(name);
    if (isGetter) return getAttr(els[0], name);
    var attrs = name;

    if (!isObj(attrs)) {
        attrs = {};
        attrs[name] = val;
    }

    setAttr(els, attrs);
};

exports.remove = function(els, names) {
    els = $safeEls(els);
    names = toArr(names);
    each(els, function(node) {
        each(names, function(name) {
            node.removeAttribute(name);
        });
    });
};

function getAttr(el, name) {
    return el.getAttribute(name);
}

function setAttr(els, attrs) {
    each(els, function(el) {
        each(attrs, function(val, name) {
            el.setAttribute(name, val);
        });
    });
}

module.exports = exports;


/***/ }),

/***/ 7781:
/***/ ((module, exports, __webpack_require__) => {

var toArr = __webpack_require__(1352);
var some = __webpack_require__(6053);
var $safeEls = __webpack_require__(2341);
var isStr = __webpack_require__(6768);
var each = __webpack_require__(3783);

exports = {
    add: function(els, name) {
        els = $safeEls(els);
        var names = safeName(name);
        each(els, function(el) {
            var classList = [];
            each(names, function(name) {
                if (!exports.has(el, name)) classList.push(name);
            });

            if (classList.length !== 0) {
                el.className += (el.className ? ' ' : '') + classList.join(' ');
            }
        });
    },
    has: function(els, name) {
        els = $safeEls(els);
        var regName = new RegExp('(^|\\s)' + name + '(\\s|$)');
        return some(els, function(el) {
            return regName.test(el.className);
        });
    },
    toggle: function(els, name) {
        els = $safeEls(els);
        each(els, function(el) {
            if (!exports.has(el, name)) return exports.add(el, name);
            exports.remove(el, name);
        });
    },
    remove: function(els, name) {
        els = $safeEls(els);
        var names = safeName(name);
        each(els, function(el) {
            each(names, function(name) {
                el.classList.remove(name);
            });
        });
    }
};

function safeName(name) {
    return isStr(name) ? name.split(/\s+/) : toArr(name);
}

module.exports = exports;


/***/ }),

/***/ 975:
/***/ ((module, exports, __webpack_require__) => {

var isStr = __webpack_require__(6768);
var isObj = __webpack_require__(5166);
var kebabCase = __webpack_require__(7622);
var isUndef = __webpack_require__(1286);
var contain = __webpack_require__(6341);
var isNum = __webpack_require__(3990);
var $safeEls = __webpack_require__(2341);
var prefix = __webpack_require__(747);
var each = __webpack_require__(3783);

exports = function(nodes, name, val) {
    nodes = $safeEls(nodes);
    var isGetter = isUndef(val) && isStr(name);
    if (isGetter) return getCss(nodes[0], name);
    var css = name;

    if (!isObj(css)) {
        css = {};
        css[name] = val;
    }

    setCss(nodes, css);
};

function getCss(node, name) {
    return (
        node.style[prefix(name)] ||
        getComputedStyle(node, '').getPropertyValue(name)
    );
}

function setCss(nodes, css) {
    each(nodes, function(node) {
        var cssText = ';';
        each(css, function(val, key) {
            key = prefix.dash(key);
            cssText += key + ':' + addPx(key, val) + ';';
        });
        node.style.cssText += cssText;
    });
}

var cssNumProps = [
    'column-count',
    'columns',
    'font-weight',
    'line-weight',
    'opacity',
    'z-index',
    'zoom'
];

function addPx(key, val) {
    var needPx = isNum(val) && !contain(cssNumProps, kebabCase(key));
    return needPx ? val + 'px' : val;
}

module.exports = exports;


/***/ }),

/***/ 8381:
/***/ ((module, exports, __webpack_require__) => {

var $attr = __webpack_require__(4991);
var isStr = __webpack_require__(6768);
var isObj = __webpack_require__(5166);
var each = __webpack_require__(3783);
var $safeEls = __webpack_require__(2341);

exports = function(nodes, name, val) {
    var dataName = name;
    if (isStr(name)) dataName = 'data-' + name;

    if (isObj(name)) {
        dataName = {};
        each(name, function(val, key) {
            dataName['data-' + key] = val;
        });
    }

    return $attr(nodes, dataName, val);
};

module.exports = exports;


/***/ }),

/***/ 5543:
/***/ ((module, exports, __webpack_require__) => {

var delegate = __webpack_require__(2443);
var isUndef = __webpack_require__(1286);
var $safeEls = __webpack_require__(2341);
var each = __webpack_require__(3783);

exports = {
    on: eventFactory('add'),
    off: eventFactory('remove')
};

function eventFactory(type) {
    return function(nodes, event, selector, handler) {
        nodes = $safeEls(nodes);

        if (isUndef(handler)) {
            handler = selector;
            selector = undefined;
        }

        each(nodes, function(node) {
            delegate[type](node, event, selector, handler);
        });
    };
}

module.exports = exports;


/***/ }),

/***/ 8908:
/***/ ((module, exports, __webpack_require__) => {

var each = __webpack_require__(3783);
var $safeEls = __webpack_require__(2341);
var isStr = __webpack_require__(6768);

exports = {
    before: insertFactory('beforebegin'),
    after: insertFactory('afterend'),
    append: insertFactory('beforeend'),
    prepend: insertFactory('afterbegin')
};

function insertFactory(type) {
    return function(nodes, val) {
        nodes = $safeEls(nodes);
        each(nodes, function(node) {
            if (isStr(val)) {
                node.insertAdjacentHTML(type, val);
            } else {
                var parentNode = node.parentNode;

                switch (type) {
                    case 'beforebegin':
                        if (parentNode) {
                            parentNode.insertBefore(val, node);
                        }

                        break;

                    case 'afterend':
                        if (parentNode) {
                            parentNode.insertBefore(val, node.nextSibling);
                        }

                        break;

                    case 'beforeend':
                        node.appendChild(val);
                        break;

                    case 'afterbegin':
                        node.prepend(val);
                        break;
                }
            }
        });
    };
}

module.exports = exports;


/***/ }),

/***/ 6906:
/***/ ((module, exports, __webpack_require__) => {

var $safeEls = __webpack_require__(2341);

exports = function(els) {
    els = $safeEls(els);
    var el = els[0];
    var clientRect = el.getBoundingClientRect();
    return {
        left: clientRect.left + window.pageXOffset,
        top: clientRect.top + window.pageYOffset,
        width: Math.round(clientRect.width),
        height: Math.round(clientRect.height)
    };
};

module.exports = exports;


/***/ }),

/***/ 4209:
/***/ ((module, exports, __webpack_require__) => {

var isUndef = __webpack_require__(1286);
var each = __webpack_require__(3783);
var $safeEls = __webpack_require__(2341);

exports = {
    html: propFactory('innerHTML'),
    text: propFactory('textContent'),
    val: propFactory('value')
};

function propFactory(name) {
    return function(nodes, val) {
        nodes = $safeEls(nodes);
        var node = nodes[0];

        if (isUndef(val)) {
            return node ? node[name] : '';
        }

        if (!node) return;
        each(nodes, function(node) {
            node[name] = val;
        });
    };
}

module.exports = exports;


/***/ }),

/***/ 6757:
/***/ ((module, exports, __webpack_require__) => {

var each = __webpack_require__(3783);
var $safeEls = __webpack_require__(2341);

exports = function(els) {
    els = $safeEls(els);
    each(els, function(el) {
        var parent = el.parentNode;
        if (parent) parent.removeChild(el);
    });
};

module.exports = exports;


/***/ }),

/***/ 2341:
/***/ ((module, exports, __webpack_require__) => {

var isStr = __webpack_require__(6768);
var toArr = __webpack_require__(1352);
var Select = __webpack_require__(3244);

exports = function(val) {
    return toArr(isStr(val) ? new Select(val) : val);
};

module.exports = exports;


/***/ }),

/***/ 7665:
/***/ ((module, exports, __webpack_require__) => {

var each = __webpack_require__(3783);
var $safeEls = __webpack_require__(2341);

exports = function(els) {
    els = $safeEls(els);
    each(els, function(el) {
        if (isHidden(el)) {
            el.style.display = getDefDisplay(el.nodeName);
        }
    });
};

function isHidden(el) {
    return getComputedStyle(el, '').getPropertyValue('display') == 'none';
}

var elDisplay = {};

function getDefDisplay(elName) {
    var el, display;

    if (!elDisplay[elName]) {
        el = document.createElement(elName);
        document.documentElement.appendChild(el);
        display = getComputedStyle(el, '').getPropertyValue('display');
        el.parentNode.removeChild(el);
        display == 'none' && (display = 'block');
        elDisplay[elName] = display;
    }

    return elDisplay[elName];
}

module.exports = exports;


/***/ }),

/***/ 7496:
/***/ ((module, exports, __webpack_require__) => {

var extend = __webpack_require__(6329);
var toArr = __webpack_require__(1352);
var inherits = __webpack_require__(5022);
var safeGet = __webpack_require__(7653);
var isMiniProgram = __webpack_require__(9537);

exports = function(methods, statics) {
    return Base.extend(methods, statics);
};

function makeClass(parent, methods, statics) {
    statics = statics || {};
    var className =
        methods.className || safeGet(methods, 'initialize.name') || '';
    delete methods.className;

    var ctor = function() {
        var args = toArr(arguments);
        return this.initialize
            ? this.initialize.apply(this, args) || this
            : this;
    };

    if (!isMiniProgram) {
        try {
            ctor = new Function(
                'toArr',
                'return function ' +
                    className +
                    '()' +
                    '{' +
                    'var args = toArr(arguments);' +
                    'return this.initialize ? this.initialize.apply(this, args) || this : this;' +
                    '};'
            )(toArr);
        } catch (e) {}
    }

    inherits(ctor, parent);
    ctor.prototype.constructor = ctor;

    ctor.extend = function(methods, statics) {
        return makeClass(ctor, methods, statics);
    };

    ctor.inherits = function(Class) {
        inherits(ctor, Class);
    };

    ctor.methods = function(methods) {
        extend(ctor.prototype, methods);
        return ctor;
    };

    ctor.statics = function(statics) {
        extend(ctor, statics);
        return ctor;
    };

    ctor.methods(methods).statics(statics);
    return ctor;
}

var Base = (exports.Base = makeClass(Object, {
    className: 'Base',
    callSuper: function(parent, name, args) {
        var superMethod = parent.prototype[name];
        return superMethod.apply(this, args);
    },
    toString: function() {
        return this.constructor.name;
    }
}));

module.exports = exports;


/***/ }),

/***/ 1443:
/***/ ((module, exports, __webpack_require__) => {

var Class = __webpack_require__(7496);
var has = __webpack_require__(6257);
var each = __webpack_require__(3783);
var slice = __webpack_require__(9677);
var once = __webpack_require__(8763);
var clone = __webpack_require__(4675);

exports = Class(
    {
        initialize: function Emitter() {
            this._events = this._events || {};
        },
        on: function(event, listener) {
            this._events[event] = this._events[event] || [];

            this._events[event].push(listener);

            return this;
        },
        off: function(event, listener) {
            var events = this._events;
            if (!has(events, event)) return;
            var idx = events[event].indexOf(listener);

            if (idx > -1) {
                events[event].splice(idx, 1);
            }

            return this;
        },
        once: function(event, listener) {
            this.on(event, once(listener));
            return this;
        },
        emit: function(event) {
            var _this = this;

            if (!has(this._events, event)) return;
            var args = slice(arguments, 1);
            var events = clone(this._events[event]);
            each(
                events,
                function(val) {
                    return val.apply(_this, args);
                },
                this
            );
            return this;
        },
        removeAllListeners: function(event) {
            if (!event) {
                this._events = {};
            } else {
                delete this._events[event];
            }

            return this;
        }
    },
    {
        mixin: function(obj) {
            each(['on', 'off', 'once', 'emit', 'removeAllListeners'], function(
                val
            ) {
                obj[val] = exports.prototype[val];
            });
            obj._events = obj._events || {};
        }
    }
);

module.exports = exports;


/***/ }),

/***/ 3244:
/***/ ((module, exports, __webpack_require__) => {

var Class = __webpack_require__(7496);
var isStr = __webpack_require__(6768);
var each = __webpack_require__(3783);
var mergeArr = __webpack_require__(9971);

exports = Class({
    className: 'Select',
    initialize: function(selector) {
        this.length = 0;
        if (!selector) return this;
        if (isStr(selector)) return rootSelect.find(selector);

        if (selector.nodeType) {
            this[0] = selector;
            this.length = 1;
        }
    },
    find: function(selector) {
        var ret = new exports();
        this.each(function() {
            mergeArr(ret, this.querySelectorAll(selector));
        });
        return ret;
    },
    each: function(fn) {
        each(this, function(element, idx) {
            fn.call(element, idx, element);
        });
        return this;
    }
});
var rootSelect = new exports(document);

module.exports = exports;


/***/ }),

/***/ 9001:
/***/ ((module, exports, __webpack_require__) => {

var Class = __webpack_require__(7496);
var reverse = __webpack_require__(1527);

exports = Class({
    initialize: function Stack() {
        this.clear();
    },
    clear: function() {
        this._items = [];
        this.size = 0;
    },
    push: function(item) {
        this._items.push(item);

        return ++this.size;
    },
    pop: function() {
        if (!this.size) return;
        this.size--;
        return this._items.pop();
    },
    peek: function() {
        return this._items[this.size - 1];
    },
    forEach: function(iterator, ctx) {
        ctx = arguments.length > 1 ? ctx : this;
        var items = this._items;

        for (var i = this.size - 1, j = 0; i >= 0; i--, j++) {
            iterator.call(ctx, items[i], j, this);
        }
    },
    toArr: function() {
        return reverse(this._items);
    }
});

module.exports = exports;


/***/ }),

/***/ 1116:
/***/ ((module, exports, __webpack_require__) => {

var keys = __webpack_require__(2533);
var getProto = __webpack_require__(415);
var unique = __webpack_require__(42);

var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;

exports = function(obj) {
    var _ref =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {},
        _ref$prototype = _ref.prototype,
        prototype = _ref$prototype === void 0 ? true : _ref$prototype,
        _ref$unenumerable = _ref.unenumerable,
        unenumerable = _ref$unenumerable === void 0 ? false : _ref$unenumerable,
        _ref$symbol = _ref.symbol,
        symbol = _ref$symbol === void 0 ? false : _ref$symbol;

    var ret = [];

    if ((unenumerable || symbol) && getOwnPropertyNames) {
        var getKeys = keys;
        if (unenumerable && getOwnPropertyNames) getKeys = getOwnPropertyNames;

        do {
            ret = ret.concat(getKeys(obj));

            if (symbol && getOwnPropertySymbols) {
                ret = ret.concat(getOwnPropertySymbols(obj));
            }
        } while (
            prototype &&
            (obj = getProto(obj)) &&
            obj !== Object.prototype
        );

        ret = unique(ret);
    } else {
        if (prototype) {
            for (var key in obj) {
                ret.push(key);
            }
        } else {
            ret = keys(obj);
        }
    }

    return ret;
};

module.exports = exports;


/***/ }),

/***/ 7913:
/***/ ((module, exports, __webpack_require__) => {

var each = __webpack_require__(3783);
var isUndef = __webpack_require__(1286);
var isFn = __webpack_require__(4777);

exports = function(arr, val) {
    if (isUndef(val)) val = true;

    var _isFn = isFn(val);

    var ret = {};
    each(arr, function(key) {
        ret[key] = _isFn ? val(key) : val;
    });
    return ret;
};

module.exports = exports;


/***/ }),

/***/ 5637:
/***/ ((module, exports) => {

exports = function(n, fn) {
    var memo;
    return function() {
        if (--n > 0) memo = fn.apply(this, arguments);
        if (n <= 1) fn = null;
        return memo;
    };
};

module.exports = exports;


/***/ }),

/***/ 7494:
/***/ ((module, exports, __webpack_require__) => {

var splitCase = __webpack_require__(8935);

exports = function(str) {
    var arr = splitCase(str);
    var ret = arr[0];
    arr.shift();
    arr.forEach(capitalize, arr);
    ret += arr.join('');
    return ret;
};

function capitalize(val, idx) {
    this[idx] = val.replace(/\w/, function(match) {
        return match.toUpperCase();
    });
}

module.exports = exports;


/***/ }),

/***/ 1694:
/***/ ((module, exports, __webpack_require__) => {

var has = __webpack_require__(6257);
var isArr = __webpack_require__(6472);

exports = function(str, obj) {
    if (isArr(str)) return str;
    if (obj && has(obj, str)) return [str];
    var ret = [];
    str.replace(regPropName, function(match, number, quote, str) {
        ret.push(quote ? str.replace(regEscapeChar, '$1') : number || match);
    });
    return ret;
};

var regPropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var regEscapeChar = /\\(\\)?/g;

module.exports = exports;


/***/ }),

/***/ 996:
/***/ ((module, exports) => {

exports = function(arr, size) {
    var ret = [];
    size = size || 1;

    for (var i = 0, len = Math.ceil(arr.length / size); i < len; i++) {
        var start = i * size;
        var end = start + size;
        ret.push(arr.slice(start, end));
    }

    return ret;
};

module.exports = exports;


/***/ }),

/***/ 4675:
/***/ ((module, exports, __webpack_require__) => {

var isObj = __webpack_require__(5166);
var isArr = __webpack_require__(6472);
var extend = __webpack_require__(6329);

exports = function(obj) {
    if (!isObj(obj)) return obj;
    return isArr(obj) ? obj.slice() : extend({}, obj);
};

module.exports = exports;


/***/ }),

/***/ 6341:
/***/ ((module, exports, __webpack_require__) => {

var idxOf = __webpack_require__(496);
var isStr = __webpack_require__(6768);
var isArrLike = __webpack_require__(1369);
var values = __webpack_require__(2578);

exports = function(arr, val) {
    if (isStr(arr)) return arr.indexOf(val) > -1;
    if (!isArrLike(arr)) arr = values(arr);
    return idxOf(arr, val) >= 0;
};

module.exports = exports;


/***/ }),

/***/ 1662:
/***/ ((module, exports, __webpack_require__) => {

var isObj = __webpack_require__(5166);

exports = function(proto) {
    if (!isObj(proto)) return {};
    if (objCreate && !false) return objCreate(proto);

    function noop() {}

    noop.prototype = proto;
    return new noop();
};

var objCreate = Object.create;

module.exports = exports;


/***/ }),

/***/ 4427:
/***/ ((module, exports, __webpack_require__) => {

var isUndef = __webpack_require__(1286);
var each = __webpack_require__(3783);

exports = function(keysFn, defaults) {
    return function(obj) {
        each(arguments, function(src, idx) {
            if (idx === 0) return;
            var keys = keysFn(src);
            each(keys, function(key) {
                if (!defaults || isUndef(obj[key])) obj[key] = src[key];
            });
        });
        return obj;
    };
};

module.exports = exports;


/***/ }),

/***/ 4193:
/***/ ((module, exports, __webpack_require__) => {

var createAssigner = __webpack_require__(4427);
var allKeys = __webpack_require__(1116);

exports = createAssigner(allKeys, true);

module.exports = exports;


/***/ }),

/***/ 2443:
/***/ ((module, exports, __webpack_require__) => {

var Class = __webpack_require__(7496);
var contain = __webpack_require__(6341);

function retTrue() {
    return true;
}

function retFalse() {
    return false;
}

function trigger(e) {
    var handlers = this.events[e.type];
    var handler;
    var handlerQueue = formatHandlers.call(this, e, handlers);
    e = new exports.Event(e);
    var i = 0,
        j,
        matched,
        ret;

    while ((matched = handlerQueue[i++]) && !e.isPropagationStopped()) {
        e.curTarget = matched.el;
        j = 0;

        while (
            (handler = matched.handlers[j++]) &&
            !e.isImmediatePropagationStopped()
        ) {
            ret = handler.handler.apply(matched.el, [e]);

            if (ret === false) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }
}

function formatHandlers(e, handlers) {
    var current = e.target;
    var ret = [];
    var delegateCount = handlers.delegateCount;
    var selector;
    var matches;
    var handler;
    var i;

    if (current.nodeType) {
        for (; current !== this; current = current.parentNode || this) {
            matches = [];

            for (i = 0; i < delegateCount; i++) {
                handler = handlers[i];
                selector = handler.selector + ' ';

                if (matches[selector] === undefined) {
                    matches[selector] = contain(
                        this.querySelectorAll(selector),
                        current
                    );
                }

                if (matches[selector]) matches.push(handler);
            }

            if (matches.length)
                ret.push({
                    el: current,
                    handlers: matches
                });
        }
    }

    if (delegateCount < handlers.length) {
        ret.push({
            el: this,
            handlers: handlers.slice(delegateCount)
        });
    }

    return ret;
}

exports = {
    add: function(el, type, selector, fn) {
        var handler = {
            selector: selector,
            handler: fn
        };
        var handlers;
        if (!el.events) el.events = {};

        if (!(handlers = el.events[type])) {
            handlers = el.events[type] = [];
            handlers.delegateCount = 0;
            el.addEventListener(
                type,
                function() {
                    trigger.apply(el, arguments);
                },
                false
            );
        }

        selector
            ? handlers.splice(handlers.delegateCount++, 0, handler)
            : handlers.push(handler);
    },
    remove: function(el, type, selector, fn) {
        var events = el.events;
        if (!events || !events[type]) return;
        var handlers = events[type];
        var i = handlers.length;
        var handler;

        while (i--) {
            handler = handlers[i];

            if (
                (!selector || handler.selector == selector) &&
                handler.handler == fn
            ) {
                handlers.splice(i, 1);

                if (handler.selector) {
                    handlers.delegateCount--;
                }
            }
        }
    },
    Event: Class({
        className: 'Event',
        initialize: function Event(e) {
            this.origEvent = e;
        },
        isDefaultPrevented: retFalse,
        isPropagationStopped: retFalse,
        isImmediatePropagationStopped: retFalse,
        preventDefault: function() {
            var e = this.origEvent;
            this.isDefaultPrevented = retTrue;
            if (e && e.preventDefault) e.preventDefault();
        },
        stopPropagation: function() {
            var e = this.origEvent;
            this.isPropagationStopped = retTrue;
            if (e && e.stopPropagation) e.stopPropagation();
        },
        stopImmediatePropagation: function() {
            var e = this.origEvent;
            this.isImmediatePropagationStopped = retTrue;
            if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();
            this.stopPropagation();
        }
    })
};

module.exports = exports;


/***/ }),

/***/ 6954:
/***/ ((module, exports, __webpack_require__) => {

var isBrowser = __webpack_require__(2727);

exports = function(ua) {
    ua = ua || (isBrowser ? navigator.userAgent : '');
    ua = ua.toLowerCase();
    if (detect('windows phone')) return 'windows phone';
    if (detect('win')) return 'windows';
    if (detect('android')) return 'android';
    if (detect('ipad') || detect('iphone') || detect('ipod')) return 'ios';
    if (detect('mac')) return 'os x';
    if (detect('linux')) return 'linux';

    function detect(keyword) {
        return ua.indexOf(keyword) > -1;
    }

    return 'unknown';
};

module.exports = exports;


/***/ }),

/***/ 801:
/***/ ((module, exports, __webpack_require__) => {

var restArgs = __webpack_require__(1137);
var flatten = __webpack_require__(288);
var filter = __webpack_require__(5972);
var contain = __webpack_require__(6341);

exports = restArgs(function(arr, args) {
    args = flatten(args);
    return filter(arr, function(val) {
        return !contain(args, val);
    });
});

module.exports = exports;


/***/ }),

/***/ 3783:
/***/ ((module, exports, __webpack_require__) => {

var isArrLike = __webpack_require__(1369);
var keys = __webpack_require__(2533);
var optimizeCb = __webpack_require__(3955);

exports = function(obj, iterator, ctx) {
    iterator = optimizeCb(iterator, ctx);
    var i, len;

    if (isArrLike(obj)) {
        for (i = 0, len = obj.length; i < len; i++) {
            iterator(obj[i], i, obj);
        }
    } else {
        var _keys = keys(obj);

        for (i = 0, len = _keys.length; i < len; i++) {
            iterator(obj[_keys[i]], _keys[i], obj);
        }
    }

    return obj;
};

module.exports = exports;


/***/ }),

/***/ 8901:
/***/ ((module, exports, __webpack_require__) => {

var keys = __webpack_require__(2533);

exports = function(str) {
    return regTest.test(str) ? str.replace(regReplace, replaceFn) : str;
};

var map = (exports.map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
});
var regSrc = '(?:' + keys(map).join('|') + ')';
var regTest = new RegExp(regSrc);
var regReplace = new RegExp(regSrc, 'g');

var replaceFn = function(match) {
    return map[match];
};

module.exports = exports;


/***/ }),

/***/ 6329:
/***/ ((module, exports, __webpack_require__) => {

var createAssigner = __webpack_require__(4427);
var allKeys = __webpack_require__(1116);

exports = createAssigner(allKeys);

module.exports = exports;


/***/ }),

/***/ 3021:
/***/ ((module, exports, __webpack_require__) => {

var keys = __webpack_require__(2533);
var createAssigner = __webpack_require__(4427);

exports = createAssigner(keys);

module.exports = exports;


/***/ }),

/***/ 5972:
/***/ ((module, exports, __webpack_require__) => {

var safeCb = __webpack_require__(2838);
var each = __webpack_require__(3783);

exports = function(obj, predicate, ctx) {
    var ret = [];
    predicate = safeCb(predicate, ctx);
    each(obj, function(val, idx, list) {
        if (predicate(val, idx, list)) ret.push(val);
    });
    return ret;
};

module.exports = exports;


/***/ }),

/***/ 288:
/***/ ((module, exports, __webpack_require__) => {

var isArr = __webpack_require__(6472);

exports = function(arr) {
    return flat(arr, []);
};

function flat(arr, res) {
    var len = arr.length,
        i = -1,
        cur;

    while (len--) {
        cur = arr[++i];
        isArr(cur) ? flat(cur, res) : res.push(cur);
    }

    return res;
}

module.exports = exports;


/***/ }),

/***/ 415:
/***/ ((module, exports, __webpack_require__) => {

var isObj = __webpack_require__(5166);
var isFn = __webpack_require__(4777);

var getPrototypeOf = Object.getPrototypeOf;
var ObjectCtr = {}.constructor;

exports = function(obj) {
    if (!isObj(obj)) return;
    if (getPrototypeOf && !false) return getPrototypeOf(obj);
    var proto = obj.__proto__;
    if (proto || proto === null) return proto;
    if (isFn(obj.constructor)) return obj.constructor.prototype;
    if (obj instanceof ObjectCtr) return ObjectCtr.prototype;
};

module.exports = exports;


/***/ }),

/***/ 6257:
/***/ ((module, exports) => {

var hasOwnProp = Object.prototype.hasOwnProperty;

exports = function(obj, key) {
    return hasOwnProp.call(obj, key);
};

module.exports = exports;


/***/ }),

/***/ 7483:
/***/ ((module, exports, __webpack_require__) => {

var parseHtml = __webpack_require__(8702);
var Stack = __webpack_require__(9001);
var isArr = __webpack_require__(6472);
var each = __webpack_require__(3783);
var isStr = __webpack_require__(6768);
var mapObj = __webpack_require__(8820);

function parse(html) {
    var ret = [];
    var stack = new Stack();
    parseHtml(html, {
        start: function(tag, attrs) {
            attrs = mapObj(attrs, function(val) {
                return unescapeQuote(val);
            });
            stack.push({
                tag: tag,
                attrs: attrs
            });
        },
        end: function() {
            var node = stack.pop();

            if (!stack.size) {
                ret.push(node);
                return;
            }

            var lastNode = stack.peek();

            if (!isArr(lastNode.content)) {
                lastNode.content = [];
            }

            lastNode.content.push(node);
        },
        comment: function(text) {
            var comment = '<!--'.concat(text, '-->');
            var lastNode = stack.peek();

            if (!lastNode) {
                ret.push(comment);
                return;
            }

            if (!lastNode.content) lastNode.content = [];
            lastNode.content.push(comment);
        },
        text: function(text) {
            var lastNode = stack.peek();

            if (!lastNode) {
                ret.push(text);
                return;
            }

            if (!lastNode.content) lastNode.content = [];
            lastNode.content.push(text);
        }
    });
    return ret;
}

function stringify(tree) {
    var ret = '';

    if (isArr(tree)) {
        each(tree, function(node) {
            return (ret += stringify(node));
        });
    } else if (isStr(tree)) {
        ret = tree;
    } else {
        ret += '<'.concat(tree.tag);
        each(tree.attrs, function(val, key) {
            return (ret += ' '.concat(key, '="').concat(escapeQuote(val), '"'));
        });
        ret += '>';
        if (tree.content) ret += stringify(tree.content);
        ret += '</'.concat(tree.tag, '>');
    }

    return ret;
}

var unescapeQuote = function(str) {
    return str.replace(/&quot;/g, '"');
};

var escapeQuote = function(str) {
    return str.replace(/"/g, '&quot;');
};

exports = {
    parse: parse,
    stringify: stringify
};

module.exports = exports;


/***/ }),

/***/ 6362:
/***/ ((module, exports) => {

exports = function(val) {
    return val;
};

module.exports = exports;


/***/ }),

/***/ 496:
/***/ ((module, exports) => {

exports = function(arr, val, fromIdx) {
    return Array.prototype.indexOf.call(arr, val, fromIdx);
};

module.exports = exports;


/***/ }),

/***/ 5022:
/***/ ((module, exports, __webpack_require__) => {

var create = __webpack_require__(1662);

exports = function(Class, SuperClass) {
    Class.prototype = create(SuperClass.prototype);
};

module.exports = exports;


/***/ }),

/***/ 6472:
/***/ ((module, exports, __webpack_require__) => {

var objToStr = __webpack_require__(106);

if (Array.isArray && !false) {
    exports = Array.isArray;
} else {
    exports = function(val) {
        return objToStr(val) === '[object Array]';
    };
}

module.exports = exports;


/***/ }),

/***/ 1369:
/***/ ((module, exports, __webpack_require__) => {

var isNum = __webpack_require__(3990);
var isFn = __webpack_require__(4777);

var MAX_ARR_IDX = Math.pow(2, 53) - 1;

exports = function(val) {
    if (!val) return false;
    var len = val.length;
    return isNum(len) && len >= 0 && len <= MAX_ARR_IDX && !isFn(val);
};

module.exports = exports;


/***/ }),

/***/ 4696:
/***/ ((module, exports) => {

exports = function(val) {
    return val === true || val === false;
};

module.exports = exports;


/***/ }),

/***/ 2727:
/***/ ((module, exports) => {

exports =
    typeof window === 'object' &&
    typeof document === 'object' &&
    document.nodeType === 9;

module.exports = exports;


/***/ }),

/***/ 2349:
/***/ ((module, exports, __webpack_require__) => {

var isFn = __webpack_require__(4777);

exports = function(val) {
    if (val == null) return false;
    if (val._isBuffer) return true;
    return (
        val.constructor &&
        isFn(val.constructor.isBuffer) &&
        val.constructor.isBuffer(val)
    );
};

module.exports = exports;


/***/ }),

/***/ 4777:
/***/ ((module, exports, __webpack_require__) => {

var objToStr = __webpack_require__(106);

exports = function(val) {
    var objStr = objToStr(val);
    return (
        objStr === '[object Function]' ||
        objStr === '[object GeneratorFunction]' ||
        objStr === '[object AsyncFunction]'
    );
};

module.exports = exports;


/***/ }),

/***/ 9585:
/***/ ((module, exports, __webpack_require__) => {

var root = __webpack_require__(5610);

var getComputedStyle = root.getComputedStyle;
var document = root.document;

exports = function(el) {
    var _ref =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {},
        _ref$display = _ref.display,
        display = _ref$display === void 0 ? true : _ref$display,
        _ref$visibility = _ref.visibility,
        visibility = _ref$visibility === void 0 ? false : _ref$visibility,
        _ref$opacity = _ref.opacity,
        opacity = _ref$opacity === void 0 ? false : _ref$opacity,
        _ref$size = _ref.size,
        size = _ref$size === void 0 ? false : _ref$size,
        _ref$viewport = _ref.viewport,
        viewport = _ref$viewport === void 0 ? false : _ref$viewport,
        _ref$overflow = _ref.overflow,
        overflow = _ref$overflow === void 0 ? false : _ref$overflow;

    if (display) {
        return el.offsetParent === null;
    }

    var computedStyle = getComputedStyle(el);

    if (visibility && computedStyle.visibility === 'hidden') {
        return true;
    }

    if (opacity) {
        if (computedStyle.opacity === '0') {
            return true;
        } else {
            var cur = el;

            while ((cur = cur.parentElement)) {
                var _computedStyle = getComputedStyle(cur);

                if (_computedStyle.opacity === '0') {
                    return true;
                }
            }
        }
    }

    var clientRect = el.getBoundingClientRect();

    if (size && (clientRect.width === 0 || clientRect.height === 0)) {
        return true;
    }

    if (viewport) {
        var containerRect = {
            top: 0,
            left: 0,
            right: document.documentElement.clientWidth,
            bottom: document.documentElement.clientHeight
        };
        return isOutside(clientRect, containerRect);
    }

    if (overflow) {
        var _cur = el;

        while ((_cur = _cur.parentElement)) {
            var _computedStyle2 = getComputedStyle(_cur);

            var _overflow = _computedStyle2.overflow;

            if (_overflow === 'scroll' || _overflow === 'hidden') {
                var curRect = _cur.getBoundingClientRect();

                if (isOutside(clientRect, curRect)) return true;
            }
        }
    }

    return false;
};

function isOutside(clientRect, containerRect) {
    return (
        clientRect.right < containerRect.left ||
        clientRect.left > containerRect.right ||
        clientRect.bottom < containerRect.top ||
        clientRect.top > containerRect.bottom
    );
}

module.exports = exports;


/***/ }),

/***/ 7949:
/***/ ((module, exports, __webpack_require__) => {

var keys = __webpack_require__(2533);

exports = function(obj, src) {
    var _keys = keys(src);

    var len = _keys.length;
    if (obj == null) return !len;
    obj = Object(obj);

    for (var i = 0; i < len; i++) {
        var key = _keys[i];
        if (src[key] !== obj[key] || !(key in obj)) return false;
    }

    return true;
};

module.exports = exports;


/***/ }),

/***/ 9537:
/***/ ((module, exports, __webpack_require__) => {

var isFn = __webpack_require__(4777);

exports = typeof wx !== 'undefined' && isFn(wx.openLocation);

module.exports = exports;


/***/ }),

/***/ 9433:
/***/ ((module, exports, __webpack_require__) => {

var isNum = __webpack_require__(3990);

exports = function(val) {
    return isNum(val) && val !== +val;
};

module.exports = exports;


/***/ }),

/***/ 2763:
/***/ ((module, exports) => {

exports = function(val) {
    return val == null;
};

module.exports = exports;


/***/ }),

/***/ 3990:
/***/ ((module, exports, __webpack_require__) => {

var objToStr = __webpack_require__(106);

exports = function(val) {
    return objToStr(val) === '[object Number]';
};

module.exports = exports;


/***/ }),

/***/ 5166:
/***/ ((module, exports) => {

exports = function(val) {
    var type = typeof val;
    return !!val && (type === 'function' || type === 'object');
};

module.exports = exports;


/***/ }),

/***/ 4321:
/***/ ((module, exports, __webpack_require__) => {

var isObj = __webpack_require__(5166);
var isFn = __webpack_require__(4777);

exports = function(val) {
    return isObj(val) && isFn(val.then) && isFn(val.catch);
};

module.exports = exports;


/***/ }),

/***/ 6768:
/***/ ((module, exports, __webpack_require__) => {

var objToStr = __webpack_require__(106);

exports = function(val) {
    return objToStr(val) === '[object String]';
};

module.exports = exports;


/***/ }),

/***/ 1286:
/***/ ((module, exports) => {

exports = function(val) {
    return val === void 0;
};

module.exports = exports;


/***/ }),

/***/ 7622:
/***/ ((module, exports, __webpack_require__) => {

var splitCase = __webpack_require__(8935);

exports = function(str) {
    return splitCase(str).join('-');
};

module.exports = exports;


/***/ }),

/***/ 2533:
/***/ ((module, exports, __webpack_require__) => {

var has = __webpack_require__(6257);

if (Object.keys && !false) {
    exports = Object.keys;
} else {
    exports = function(obj) {
        var ret = [];

        for (var key in obj) {
            if (has(obj, key)) ret.push(key);
        }

        return ret;
    };
}

module.exports = exports;


/***/ }),

/***/ 9702:
/***/ ((module, exports) => {

exports = function(arr) {
    var len = arr ? arr.length : 0;
    if (len) return arr[len - 1];
};

module.exports = exports;


/***/ }),

/***/ 3063:
/***/ ((module, exports, __webpack_require__) => {

var toStr = __webpack_require__(3367);

exports = function(str) {
    return toStr(str).toLocaleLowerCase();
};

module.exports = exports;


/***/ }),

/***/ 7767:
/***/ ((module, exports) => {

var regSpace = /^\s+/;

exports = function(str, chars) {
    if (chars == null) {
        if (str.trimLeft) {
            return str.trimLeft();
        }

        return str.replace(regSpace, '');
    }

    var start = 0;
    var len = str.length;
    var charLen = chars.length;
    var found = true;
    var i;
    var c;

    while (found && start < len) {
        found = false;
        i = -1;
        c = str.charAt(start);

        while (++i < charLen) {
            if (c === chars[i]) {
                found = true;
                start++;
                break;
            }
        }
    }

    return start >= len ? '' : str.substr(start, len);
};

module.exports = exports;


/***/ }),

/***/ 2461:
/***/ ((module, exports, __webpack_require__) => {

var safeCb = __webpack_require__(2838);
var keys = __webpack_require__(2533);
var isArrLike = __webpack_require__(1369);

exports = function(obj, iterator, ctx) {
    iterator = safeCb(iterator, ctx);

    var _keys = !isArrLike(obj) && keys(obj);

    var len = (_keys || obj).length;
    var results = Array(len);

    for (var i = 0; i < len; i++) {
        var curKey = _keys ? _keys[i] : i;
        results[i] = iterator(obj[curKey], curKey, obj);
    }

    return results;
};

module.exports = exports;


/***/ }),

/***/ 8820:
/***/ ((module, exports, __webpack_require__) => {

var safeCb = __webpack_require__(2838);
var keys = __webpack_require__(2533);

exports = function(obj, iterator, ctx) {
    iterator = safeCb(iterator, ctx);

    var _keys = keys(obj);

    var len = _keys.length;
    var ret = {};

    for (var i = 0; i < len; i++) {
        var curKey = _keys[i];
        ret[curKey] = iterator(obj[curKey], curKey, obj);
    }

    return ret;
};

module.exports = exports;


/***/ }),

/***/ 4491:
/***/ ((module, exports, __webpack_require__) => {

var extendOwn = __webpack_require__(3021);
var isMatch = __webpack_require__(7949);

exports = function(attrs) {
    attrs = extendOwn({}, attrs);
    return function(obj) {
        return isMatch(obj, attrs);
    };
};

module.exports = exports;


/***/ }),

/***/ 1475:
/***/ ((module, exports, __webpack_require__) => {

var has = __webpack_require__(6257);

exports = function(fn, hashFn) {
    var memoize = function(key) {
        var cache = memoize.cache;
        var address = '' + (hashFn ? hashFn.apply(this, arguments) : key);
        if (!has(cache, address)) cache[address] = fn.apply(this, arguments);
        return cache[address];
    };

    memoize.cache = {};
    return memoize;
};

module.exports = exports;


/***/ }),

/***/ 9971:
/***/ ((module, exports, __webpack_require__) => {

var restArgs = __webpack_require__(1137);

exports = restArgs(function(first, arrays) {
    var end = first.length;

    for (var i = 0, len = arrays.length; i < len; i++) {
        var arr = arrays[i];

        for (var j = 0, _len = arr.length; j < _len; j++) {
            first[end++] = arr[j];
        }
    }

    first.length = end;
    return first;
});

module.exports = exports;


/***/ }),

/***/ 6339:
/***/ ((module, exports, __webpack_require__) => {

var startWith = __webpack_require__(6930);
var root = __webpack_require__(5610);
var toStr = __webpack_require__(3367);

exports = function(arr) {
    return arr.sort(naturalOrderComparator);
};

function naturalOrderComparator(a, b) {
    a = toStr(a);
    b = toStr(b);

    if (startWith(a, '_') && !startWith(b, '_')) {
        return 1;
    }

    if (startWith(b, '_') && !startWith(a, '_')) {
        return -1;
    }

    var chunk = /^\d+|^\D+/;
    var chunka, chunkb, anum, bnum;

    while (true) {
        if (a) {
            if (!b) {
                return 1;
            }
        } else {
            if (b) {
                return -1;
            }

            return 0;
        }

        chunka = a.match(chunk)[0];
        chunkb = b.match(chunk)[0];
        anum = !root.isNaN(chunka);
        bnum = !root.isNaN(chunkb);

        if (anum && !bnum) {
            return -1;
        }

        if (bnum && !anum) {
            return 1;
        }

        if (anum && bnum) {
            var diff = chunka - chunkb;

            if (diff) {
                return diff;
            }

            if (chunka.length !== chunkb.length) {
                if (!+chunka && !+chunkb) {
                    return chunka.length - chunkb.length;
                }

                return chunkb.length - chunka.length;
            }
        } else if (chunka !== chunkb) {
            return chunka < chunkb ? -1 : 1;
        }

        a = a.substring(chunka.length);
        b = b.substring(chunkb.length);
    }
}

module.exports = exports;


/***/ }),

/***/ 1214:
/***/ ((module, exports) => {

exports = function() {};

module.exports = exports;


/***/ }),

/***/ 106:
/***/ ((module, exports) => {

var ObjToStr = Object.prototype.toString;

exports = function(val) {
    return ObjToStr.call(val);
};

module.exports = exports;


/***/ }),

/***/ 8763:
/***/ ((module, exports, __webpack_require__) => {

var partial = __webpack_require__(4198);
var before = __webpack_require__(5637);

exports = partial(before, 2);

module.exports = exports;


/***/ }),

/***/ 3955:
/***/ ((module, exports, __webpack_require__) => {

var isUndef = __webpack_require__(1286);

exports = function(fn, ctx, argCount) {
    if (isUndef(ctx)) return fn;

    switch (argCount == null ? 3 : argCount) {
        case 1:
            return function(val) {
                return fn.call(ctx, val);
            };

        case 3:
            return function(val, idx, collection) {
                return fn.call(ctx, val, idx, collection);
            };

        case 4:
            return function(accumulator, val, idx, collection) {
                return fn.call(ctx, accumulator, val, idx, collection);
            };
    }

    return function() {
        return fn.apply(ctx, arguments);
    };
};

module.exports = exports;


/***/ }),

/***/ 8702:
/***/ ((module, exports, __webpack_require__) => {

var last = __webpack_require__(9702);
var arrToMap = __webpack_require__(7913);
var startWith = __webpack_require__(6930);
var lowerCase = __webpack_require__(3063);

exports = function(html, handler) {
    var stack = [];
    var text;
    var lastHtml = html;

    while (html) {
        text = true;

        if (!last(stack) || !SPECIAL[last(stack)]) {
            if (startWith(html, '<!--')) {
                var endIdx = html.indexOf('-->');

                if (endIdx >= 0) {
                    if (handler.comment) {
                        handler.comment(html.substring(4, endIdx));
                    }

                    html = html.substring(endIdx + 3);
                    text = false;
                }
            } else if (startWith(html, '<!')) {
                var match = html.match(regDoctype);

                if (match) {
                    if (handler.text)
                        handler.text(html.substring(0, match[0].length));
                    html = html.substring(match[0].length);
                    text = false;
                }
            } else if (startWith(html, '</')) {
                var _match = html.match(regEndTag);

                if (_match) {
                    html = html.substring(_match[0].length);

                    _match[0].replace(regEndTag, parseEndTag);

                    text = false;
                }
            } else if (startWith(html, '<')) {
                var _match2 = html.match(regStartTag);

                if (_match2) {
                    html = html.substring(_match2[0].length);

                    _match2[0].replace(regStartTag, parseStartTag);

                    text = false;
                }
            }

            if (text) {
                var _endIdx = html.indexOf('<');

                var _text = _endIdx < 0 ? html : html.substring(0, _endIdx);

                html = _endIdx < 0 ? '' : html.substring(_endIdx);
                if (handler.text) handler.text(_text);
            }
        } else {
            var execRes = new RegExp('</'.concat(last(stack), '[^>]*>')).exec(
                html
            );

            if (execRes) {
                var _text2 = html.substring(0, execRes.index);

                html = html.substring(execRes.index + execRes[0].length);
                if (_text2 && handler.text) handler.text(_text2);
            }

            parseEndTag('', last(stack));
        }

        if (lastHtml === html) {
            throw Error('Parse Error: ' + html);
        }

        lastHtml = html;
    }

    parseEndTag();

    function parseStartTag(tag, tagName, rest, unary) {
        tagName = lowerCase(tagName);
        unary = !!unary;
        if (!unary) stack.push(tagName);

        if (handler.start) {
            var attrs = {};
            rest.replace(regAttr, function(all, $1, $2, $3, $4) {
                attrs[$1] = $2 || $3 || $4 || '';
            });
            handler.start(tagName, attrs, unary);
        }
    }

    function parseEndTag(tag, tagName) {
        tagName = lowerCase(tagName);
        var pos;

        if (!tagName) {
            pos = 0;
        } else {
            for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos] === tagName) break;
            }
        }

        if (pos >= 0) {
            for (var i = stack.length - 1; i >= pos; i--) {
                if (handler.end) handler.end(stack[i]);
            }

            stack.length = pos;
        }
    }
};

var regDoctype = /^<!\s*doctype((?:\s+[\w:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/i;
var regEndTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
var regStartTag = /^<([-A-Za-z0-9_]+)((?:\s+[-A-Za-z0-9_:@.]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/i;
var regAttr = /([-A-Za-z0-9_:@.]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

var SPECIAL = arrToMap('script,style'.split(','));

module.exports = exports;


/***/ }),

/***/ 4198:
/***/ ((module, exports, __webpack_require__) => {

var restArgs = __webpack_require__(1137);
var toArr = __webpack_require__(1352);

exports = restArgs(function(fn, partials) {
    return function() {
        var args = [];
        args = args.concat(partials);
        args = args.concat(toArr(arguments));
        return fn.apply(this, args);
    };
});

module.exports = exports;


/***/ }),

/***/ 747:
/***/ ((module, exports, __webpack_require__) => {

var memoize = __webpack_require__(1475);
var camelCase = __webpack_require__(7494);
var upperFirst = __webpack_require__(3023);
var has = __webpack_require__(6257);
var kebabCase = __webpack_require__(7622);

exports = memoize(function(name) {
    name = name.replace(regPrefixes, '');
    name = camelCase(name);
    if (has(style, name)) return name;
    var i = prefixes.length;

    while (i--) {
        var prefixName = prefixes[i] + upperFirst(name);
        if (has(style, prefixName)) return prefixName;
    }

    return name;
});
exports.dash = memoize(function(name) {
    var camelCaseResult = exports(name);
    return (
        (regPrefixes.test(camelCaseResult) ? '-' : '') +
        kebabCase(camelCaseResult)
    );
});
var prefixes = ['O', 'ms', 'Moz', 'Webkit'];
var regPrefixes = /^(O)|(ms)|(Moz)|(Webkit)|(-o-)|(-ms-)|(-moz-)|(-webkit-)/g;
var style = document.createElement('p').style;

module.exports = exports;


/***/ }),

/***/ 2994:
/***/ ((module, exports, __webpack_require__) => {

var isArr = __webpack_require__(6472);
var safeGet = __webpack_require__(7653);

exports = function(path) {
    if (!isArr(path)) return shallowProperty(path);
    return function(obj) {
        return safeGet(obj, path);
    };
};

function shallowProperty(key) {
    return function(obj) {
        return obj == null ? void 0 : obj[key];
    };
}

module.exports = exports;


/***/ }),

/***/ 5852:
/***/ ((module, exports, __webpack_require__) => {

var safeCb = __webpack_require__(2838);

exports = function(arr, iterator, ctx) {
    var ret = [];
    iterator = safeCb(iterator, ctx);
    var i = -1;
    var len = arr.length;

    while (++i < len) {
        var val = arr[i];

        if (iterator(val, i, arr)) {
            ret.push(val);
            arr.splice(i, 1);
        }
    }

    return ret;
};

module.exports = exports;


/***/ }),

/***/ 1137:
/***/ ((module, exports) => {

exports = function(fn, startIdx) {
    startIdx = startIdx == null ? fn.length - 1 : +startIdx;
    return function() {
        var len = Math.max(arguments.length - startIdx, 0);
        var rest = new Array(len);
        var i;

        for (i = 0; i < len; i++) {
            rest[i] = arguments[i + startIdx];
        }

        switch (startIdx) {
            case 0:
                return fn.call(this, rest);

            case 1:
                return fn.call(this, arguments[0], rest);

            case 2:
                return fn.call(this, arguments[0], arguments[1], rest);
        }

        var args = new Array(startIdx + 1);

        for (i = 0; i < startIdx; i++) {
            args[i] = arguments[i];
        }

        args[startIdx] = rest;
        return fn.apply(this, args);
    };
};

module.exports = exports;


/***/ }),

/***/ 1527:
/***/ ((module, exports) => {

exports = function(arr) {
    var len = arr.length;
    var ret = Array(len);
    len--;

    for (var i = 0; i <= len; i++) {
        ret[len - i] = arr[i];
    }

    return ret;
};

module.exports = exports;


/***/ }),

/***/ 5610:
/***/ ((module, exports, __webpack_require__) => {

var isBrowser = __webpack_require__(2727);

exports = isBrowser ? window : __webpack_require__.g;

module.exports = exports;


/***/ }),

/***/ 3597:
/***/ ((module, exports) => {

exports = function(str, chars) {
    if (chars == null) {
        if (str.trimRight) {
            return str.trimRight();
        }

        chars = ' \r\n\t\f\v';
    }

    var end = str.length - 1;
    var charLen = chars.length;
    var found = true;
    var i;
    var c;

    while (found && end >= 0) {
        found = false;
        i = -1;
        c = str.charAt(end);

        while (++i < charLen) {
            if (c === chars[i]) {
                found = true;
                end--;
                break;
            }
        }
    }

    return end >= 0 ? str.substring(0, end + 1) : '';
};

module.exports = exports;


/***/ }),

/***/ 2838:
/***/ ((module, exports, __webpack_require__) => {

var isFn = __webpack_require__(4777);
var isObj = __webpack_require__(5166);
var isArr = __webpack_require__(6472);
var optimizeCb = __webpack_require__(3955);
var matcher = __webpack_require__(4491);
var identity = __webpack_require__(6362);
var property = __webpack_require__(2994);

exports = function(val, ctx, argCount) {
    if (val == null) return identity;
    if (isFn(val)) return optimizeCb(val, ctx, argCount);
    if (isObj(val) && !isArr(val)) return matcher(val);
    return property(val);
};

module.exports = exports;


/***/ }),

/***/ 7653:
/***/ ((module, exports, __webpack_require__) => {

var isUndef = __webpack_require__(1286);
var castPath = __webpack_require__(1694);

exports = function(obj, path) {
    path = castPath(path, obj);
    var prop;
    prop = path.shift();

    while (!isUndef(prop)) {
        obj = obj[prop];
        if (obj == null) return;
        prop = path.shift();
    }

    return obj;
};

module.exports = exports;


/***/ }),

/***/ 9677:
/***/ ((module, exports) => {

exports = function(arr, start, end) {
    var len = arr.length;

    if (start == null) {
        start = 0;
    } else if (start < 0) {
        start = Math.max(len + start, 0);
    } else {
        start = Math.min(start, len);
    }

    if (end == null) {
        end = len;
    } else if (end < 0) {
        end = Math.max(len + end, 0);
    } else {
        end = Math.min(end, len);
    }

    var ret = [];

    while (start < end) {
        ret.push(arr[start++]);
    }

    return ret;
};

module.exports = exports;


/***/ }),

/***/ 6053:
/***/ ((module, exports, __webpack_require__) => {

var safeCb = __webpack_require__(2838);
var isArrLike = __webpack_require__(1369);
var keys = __webpack_require__(2533);

exports = function(obj, predicate, ctx) {
    predicate = safeCb(predicate, ctx);

    var _keys = !isArrLike(obj) && keys(obj);

    var len = (_keys || obj).length;

    for (var i = 0; i < len; i++) {
        var key = _keys ? _keys[i] : i;
        if (predicate(obj[key], key, obj)) return true;
    }

    return false;
};

module.exports = exports;


/***/ }),

/***/ 8935:
/***/ ((module, exports) => {

var regUpperCase = /([A-Z])/g;
var regSeparator = /[_.\- ]+/g;
var regTrim = /(^-)|(-$)/g;

exports = function(str) {
    str = str
        .replace(regUpperCase, '-$1')
        .toLowerCase()
        .replace(regSeparator, '-')
        .replace(regTrim, '');
    return str.split('-');
};

module.exports = exports;


/***/ }),

/***/ 6930:
/***/ ((module, exports) => {

exports = function(str, prefix) {
    return str.indexOf(prefix) === 0;
};

module.exports = exports;


/***/ }),

/***/ 1352:
/***/ ((module, exports, __webpack_require__) => {

var isArrLike = __webpack_require__(1369);
var map = __webpack_require__(2461);
var isArr = __webpack_require__(6472);
var isStr = __webpack_require__(6768);

exports = function(val) {
    if (!val) return [];
    if (isArr(val)) return val;
    if (isArrLike(val) && !isStr(val)) return map(val);
    return [val];
};

module.exports = exports;


/***/ }),

/***/ 3875:
/***/ ((module, exports, __webpack_require__) => {

var isNum = __webpack_require__(3990);
var isObj = __webpack_require__(5166);
var isFn = __webpack_require__(4777);
var isStr = __webpack_require__(6768);

exports = function(val) {
    if (isNum(val)) return val;

    if (isObj(val)) {
        var temp = isFn(val.valueOf) ? val.valueOf() : val;
        val = isObj(temp) ? temp + '' : temp;
    }

    if (!isStr(val)) return val === 0 ? val : +val;
    return +val;
};

module.exports = exports;


/***/ }),

/***/ 300:
/***/ ((module, exports, __webpack_require__) => {

var isNil = __webpack_require__(2763);

exports = function(fn) {
    if (isNil(fn)) return '';

    try {
        return fnToStr.call(fn);
    } catch (e) {}

    try {
        return fn + '';
    } catch (e) {}

    return '';
};

var fnToStr = Function.prototype.toString;

module.exports = exports;


/***/ }),

/***/ 3367:
/***/ ((module, exports) => {

exports = function(val) {
    return val == null ? '' : val.toString();
};

module.exports = exports;


/***/ }),

/***/ 4331:
/***/ ((module, exports, __webpack_require__) => {

var ltrim = __webpack_require__(7767);
var rtrim = __webpack_require__(3597);

exports = function(str, chars) {
    if (chars == null && str.trim) {
        return str.trim();
    }

    return ltrim(rtrim(str, chars), chars);
};

module.exports = exports;


/***/ }),

/***/ 3085:
/***/ ((module, exports, __webpack_require__) => {

var objToStr = __webpack_require__(106);
var isNaN = __webpack_require__(9433);
var lowerCase = __webpack_require__(3063);
var isBuffer = __webpack_require__(2349);

exports = function(val) {
    var lower =
        arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : true;
    var ret;
    if (val === null) ret = 'Null';
    if (val === undefined) ret = 'Undefined';
    if (isNaN(val)) ret = 'NaN';
    if (isBuffer(val)) ret = 'Buffer';

    if (!ret) {
        ret = objToStr(val).match(regObj);
        if (ret) ret = ret[1];
    }

    if (!ret) return '';
    return lower ? lowerCase(ret) : ret;
};

var regObj = /^\[object\s+(.*?)]$/;

module.exports = exports;


/***/ }),

/***/ 5229:
/***/ ((module, exports) => {

var idCounter = 0;

exports = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
};

module.exports = exports;


/***/ }),

/***/ 42:
/***/ ((module, exports, __webpack_require__) => {

var filter = __webpack_require__(5972);

exports = function(arr, cmp) {
    cmp = cmp || isEqual;
    return filter(arr, function(item, idx, arr) {
        var len = arr.length;

        while (++idx < len) {
            if (cmp(item, arr[idx])) return false;
        }

        return true;
    });
};

function isEqual(a, b) {
    return a === b;
}

module.exports = exports;


/***/ }),

/***/ 3023:
/***/ ((module, exports) => {

exports = function(str) {
    if (str.length < 1) return str;
    return str[0].toUpperCase() + str.slice(1);
};

module.exports = exports;


/***/ }),

/***/ 2578:
/***/ ((module, exports, __webpack_require__) => {

var each = __webpack_require__(3783);

exports = function(obj) {
    var ret = [];
    each(obj, function(val) {
        ret.push(val);
    });
    return ret;
};

module.exports = exports;


/***/ }),

/***/ 1717:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getObjAbstract = void 0;
var _1 = __importDefault(__webpack_require__(1512));
var startWith_1 = __importDefault(__webpack_require__(6930));
var isObj_1 = __importDefault(__webpack_require__(5166));
var uniqId_1 = __importDefault(__webpack_require__(5229));
var upperFirst_1 = __importDefault(__webpack_require__(3023));
var toNum_1 = __importDefault(__webpack_require__(3875));
var chunk_1 = __importDefault(__webpack_require__(996));
var each_1 = __importDefault(__webpack_require__(3783));
var isNaN_1 = __importDefault(__webpack_require__(9433));
var isNum_1 = __importDefault(__webpack_require__(3990));
var isBool_1 = __importDefault(__webpack_require__(4696));
var isStr_1 = __importDefault(__webpack_require__(6768));
var keys_1 = __importDefault(__webpack_require__(2533));
var lowerCase_1 = __importDefault(__webpack_require__(3063));
var naturalSort_1 = __importDefault(__webpack_require__(6339));
var util_1 = __webpack_require__(8629);
var Component_1 = __importDefault(__webpack_require__(5198));
var JsonViewer = (function (_super) {
    __extends(JsonViewer, _super);
    function JsonViewer(container) {
        var _this = _super.call(this, container, { compName: 'object-viewer' }) || this;
        _this.onItemClick = function (e) {
            var _a = _this, map = _a.map, c = _a.c;
            var $this = (0, _1.default)(e.curTarget);
            var circularId = $this.data('object-id');
            var $firstSpan = $this.find('span').eq(0);
            if ($this.data('first-level'))
                return;
            if (circularId) {
                $this.find('ul').html(_this.objToHtml(map[circularId], false));
                $this.rmAttr('data-object-id');
            }
            e.stopImmediatePropagation();
            if (!$firstSpan.hasClass(c('expanded')))
                return;
            var $ul = $this.find('ul').eq(0);
            if ($firstSpan.hasClass(c('collapsed'))) {
                $firstSpan.rmClass(c('collapsed'));
                $ul.show();
            }
            else {
                $firstSpan.addClass(c('collapsed'));
                $ul.hide();
            }
            _this.emit('change');
        };
        _this.bindEvent();
        return _this;
    }
    JsonViewer.prototype.set = function (data) {
        if ((0, isStr_1.default)(data))
            data = JSON.parse(data);
        this.data = {
            id: (0, uniqId_1.default)('json'),
            enumerable: {
                0: data,
            },
        };
        this.map = {};
        createMap(this.map, this.data);
        this.render();
    };
    JsonViewer.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.$container.off('click', 'li', this.onItemClick);
    };
    JsonViewer.prototype.objToHtml = function (data, firstLevel) {
        var _this = this;
        var ret = '';
        (0, each_1.default)(['enumerable', 'unenumerable', 'symbol'], function (type) {
            if (!data[type])
                return;
            var typeKeys = (0, keys_1.default)(data[type]);
            (0, naturalSort_1.default)(typeKeys);
            for (var i = 0, len = typeKeys.length; i < len; i++) {
                var key = typeKeys[i];
                ret += _this.createEl(key, data[type][key], type, firstLevel);
            }
        });
        if (data.proto) {
            if (ret === '') {
                ret = this.objToHtml(data.proto);
            }
            else {
                ret += this.createEl('__proto__', data.proto, 'proto');
            }
        }
        return ret;
    };
    JsonViewer.prototype.createEl = function (key, val, keyType, firstLevel) {
        if (firstLevel === void 0) { firstLevel = false; }
        var c = this.c;
        var type = typeof val;
        if (val === null) {
            return "<li>".concat(wrapKey(key), "<span class=\"").concat(c('null'), "\">null</span></li>");
        }
        else if ((0, isNum_1.default)(val) || (0, isBool_1.default)(val)) {
            return "<li>".concat(wrapKey(key), "<span class=\"").concat(c(type), "\">").concat((0, util_1.encode)(val), "</span></li>");
        }
        if (val.type === 'RegExp')
            type = 'regexp';
        if (val.type === 'Number')
            type = 'number';
        if (val.type === 'Number' || val.type === 'RegExp') {
            return "<li>".concat(wrapKey(key), "<span class=\"").concat(c(type), "\">").concat((0, util_1.encode)(val.value), "</span></li>");
        }
        else if (val.type === 'Undefined' || val.type === 'Symbol') {
            return "<li>".concat(wrapKey(key), "<span class=\"").concat(c('special'), "\">").concat((0, lowerCase_1.default)(val.type), "</span></li>");
        }
        else if (val === '(...)') {
            return "<li>".concat(wrapKey(key), "<span class=\"").concat(c('special'), "\">").concat(val, "</span></li>");
        }
        else if ((0, isObj_1.default)(val)) {
            var id = val.id;
            var referenceId = val.reference;
            var objAbstract = getObjAbstract(val) || (0, upperFirst_1.default)(type);
            var icon = firstLevel
                ? ''
                : "<span class=\"".concat(c('expanded collapsed'), "\"><span class=\"").concat(c('icon icon-caret-right'), "\"></span><span class=\"").concat(c('icon icon-caret-down'), "\"></span></span>");
            var obj = "<li ".concat(firstLevel ? 'data-first-level="true"' : '', " ").concat('data-object-id="' + (referenceId || id) + '"', ">").concat(icon).concat(wrapKey(key), "<span class=\"").concat(c('open'), "\">").concat(firstLevel ? '' : objAbstract, "</span><ul class=\"").concat(c(type), "\" ").concat(firstLevel ? '' : 'style="display:none"', ">");
            if (firstLevel)
                obj += this.objToHtml(this.map[id]);
            return obj + "</ul><span class=\"".concat(c('close'), "\"></span></li>");
        }
        function wrapKey(key) {
            if (firstLevel)
                return '';
            if ((0, isObj_1.default)(val) && val.jsonSplitArr)
                return '';
            var keyClass = c('key');
            if (keyType === 'unenumerable' ||
                keyType === 'proto' ||
                keyType === 'symbol') {
                keyClass = c('key-lighter');
            }
            return "<span class=\"".concat(keyClass, "\">").concat((0, util_1.encode)(key), "</span>: ");
        }
        return "<li>".concat(wrapKey(key), "<span class=\"").concat(c(typeof val), "\">\"").concat((0, util_1.encode)(val), "\"</span></li>");
    };
    JsonViewer.prototype.render = function () {
        var data = this.map[this.data.id];
        this.$container.html(this.objToHtml(data, true));
    };
    JsonViewer.prototype.bindEvent = function () {
        this.$container.on('click', 'li', this.onItemClick);
    };
    return JsonViewer;
}(Component_1.default));
exports["default"] = JsonViewer;
function createMap(map, data) {
    var id = data.id;
    if (!id && id !== 0)
        return;
    var isArr = data.type && (0, startWith_1.default)(data.type, 'Array');
    if (isArr && data.enumerable) {
        var arr = objToArr(data, id, data.type);
        if (arr.length > 100)
            data = splitBigArr(arr);
    }
    map[id] = data;
    var values = [];
    (0, each_1.default)(['enumerable', 'unenumerable', 'symbol'], function (type) {
        if (!data[type])
            return;
        for (var key in data[type]) {
            values.push(data[type][key]);
        }
    });
    if (data.proto) {
        values.push(data.proto);
    }
    for (var i = 0, len = values.length; i < len; i++) {
        var val = values[i];
        if ((0, isObj_1.default)(val))
            createMap(map, val);
    }
}
function splitBigArr(data) {
    var idx = 0;
    var enumerable = {};
    (0, each_1.default)((0, chunk_1.default)(data, 100), function (val) {
        var obj = {};
        var startIdx = idx;
        obj.type = '[' + startIdx;
        obj.enumerable = {};
        (0, each_1.default)(val, function (val) {
            obj.enumerable[idx] = val;
            idx += 1;
        });
        var endIdx = idx - 1;
        obj.type += (endIdx - startIdx > 0 ? ' … ' + endIdx : '') + ']';
        obj.id = (0, uniqId_1.default)('json');
        obj.jsonSplitArr = true;
        enumerable[idx] = obj;
    });
    var ret = {};
    ret.enumerable = enumerable;
    ret.id = data.id;
    ret.type = data.type;
    if (data.unenumerable)
        ret.unenumerable = data.unenumerable;
    if (data.symbol)
        ret.symbol = data.symbol;
    if (data.proto)
        ret.proto = data.proto;
    return ret;
}
function objToArr(data, id, type) {
    var ret = [];
    var enumerable = {};
    (0, each_1.default)(data.enumerable, function (val, key) {
        var idx = (0, toNum_1.default)(key);
        if (!(0, isNaN_1.default)(idx)) {
            ret[idx] = val;
        }
        else {
            enumerable[key] = val;
        }
    });
    ret.enumerable = enumerable;
    ret.type = type;
    ret.id = id;
    if (data.unenumerable)
        ret.unenumerable = data.unenumerable;
    if (data.symbol)
        ret.symbol = data.symbol;
    if (data.proto)
        ret.proto = data.proto;
    return ret;
}
function getObjAbstract(data) {
    var type = data.type, value = data.value;
    if (!type)
        return;
    if (type === 'Function') {
        return (0, util_1.getFnAbstract)(value);
    }
    if (type === 'Array' && data.unenumerable) {
        return "Array(".concat(data.unenumerable.length, ")");
    }
    return data.type;
}
exports.getObjAbstract = getObjAbstract;


/***/ }),

/***/ 3465:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var extend_1 = __importDefault(__webpack_require__(6329));
var Visitor = (function () {
    function Visitor() {
        this.id = 0;
        this.visited = [];
    }
    Visitor.prototype.set = function (val, extra) {
        var _a = this, visited = _a.visited, id = _a.id;
        var obj = {
            id: id,
            val: val,
        };
        (0, extend_1.default)(obj, extra);
        visited.push(obj);
        this.id++;
        return id;
    };
    Visitor.prototype.get = function (val) {
        var visited = this.visited;
        for (var i = 0, len = visited.length; i < len; i++) {
            var obj = visited[i];
            if (val === obj.val)
                return obj;
        }
        return false;
    };
    return Visitor;
}());
exports["default"] = Visitor;


/***/ }),

/***/ 4030:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Static = void 0;
var getProto_1 = __importDefault(__webpack_require__(415));
var isNum_1 = __importDefault(__webpack_require__(3990));
var isBool_1 = __importDefault(__webpack_require__(4696));
var lowerCase_1 = __importDefault(__webpack_require__(3063));
var isObj_1 = __importDefault(__webpack_require__(5166));
var isArr_1 = __importDefault(__webpack_require__(6472));
var upperFirst_1 = __importDefault(__webpack_require__(3023));
var keys_1 = __importDefault(__webpack_require__(2533));
var each_1 = __importDefault(__webpack_require__(3783));
var toSrc_1 = __importDefault(__webpack_require__(300));
var isPromise_1 = __importDefault(__webpack_require__(4321));
var type_1 = __importDefault(__webpack_require__(3085));
var _1 = __importDefault(__webpack_require__(1512));
var difference_1 = __importDefault(__webpack_require__(801));
var allKeys_1 = __importDefault(__webpack_require__(1116));
var filter_1 = __importDefault(__webpack_require__(5972));
var chunk_1 = __importDefault(__webpack_require__(996));
var toStr_1 = __importDefault(__webpack_require__(3367));
var noop_1 = __importDefault(__webpack_require__(1214));
var extend_1 = __importDefault(__webpack_require__(6329));
var naturalSort_1 = __importDefault(__webpack_require__(6339));
var Visitor_1 = __importDefault(__webpack_require__(3465));
var util_1 = __webpack_require__(8629);
var Static_1 = __importDefault(__webpack_require__(1717));
exports.Static = Static_1.default;
var Component_1 = __importDefault(__webpack_require__(5198));
var ObjectViewer = (function (_super) {
    __extends(ObjectViewer, _super);
    function ObjectViewer(container, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, container, { compName: 'object-viewer' }) || this;
        _this.onItemClick = function (e) {
            var _a = _this, map = _a.map, c = _a.c;
            var $this = (0, _1.default)(e.curTarget);
            var circularId = $this.data('object-id');
            var $firstSpan = $this.find('span').eq(0);
            if ($this.data('first-level'))
                return;
            if (circularId) {
                $this.find('ul').html(_this.objToHtml(map[circularId], false));
                $this.rmAttr('data-object-id');
            }
            e.stopImmediatePropagation();
            if (!$firstSpan.hasClass(c('expanded')))
                return;
            var $ul = $this.find('ul').eq(0);
            if ($firstSpan.hasClass(c('collapsed'))) {
                $firstSpan.rmClass(c('collapsed'));
                $ul.show();
            }
            else {
                $firstSpan.addClass(c('collapsed'));
                $ul.hide();
            }
            _this.emit('change');
        };
        _this.initOptions(options, {
            unenumerable: false,
            accessGetter: false,
        });
        _this.bindEvent();
        return _this;
    }
    ObjectViewer.prototype.set = function (data) {
        this.data = [data];
        this.visitor = new Visitor_1.default();
        this.map = {};
        this.render();
    };
    ObjectViewer.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.$container.off('click', 'li', this.onItemClick);
    };
    ObjectViewer.prototype.objToHtml = function (data, firstLevel) {
        var _this = this;
        var visitor = this.visitor;
        var self = data;
        var isBigArr = false;
        var visitedObj = visitor.get(data);
        if (visitedObj && visitedObj.self) {
            self = visitedObj.self;
        }
        var ret = '';
        var types = ['enumerable'];
        var enumerableKeys = (0, keys_1.default)(data);
        var unenumerableKeys = [];
        var symbolKeys = [];
        var virtualKeys = [];
        var virtualData = {};
        if (this.options.unenumerable && !firstLevel) {
            types.push('unenumerable');
            types.push('symbol');
            unenumerableKeys = (0, difference_1.default)((0, allKeys_1.default)(data, {
                prototype: false,
                unenumerable: true,
            }), enumerableKeys);
            symbolKeys = (0, filter_1.default)((0, allKeys_1.default)(data, {
                prototype: false,
                symbol: true,
            }), function (key) {
                return typeof key === 'symbol';
            });
        }
        if ((0, isArr_1.default)(data) && data.length > 100) {
            types.unshift('virtual');
            isBigArr = true;
            var idx_1 = 0;
            var map_1 = {};
            (0, each_1.default)((0, chunk_1.default)(data, 100), function (val) {
                var obj = Object.create(null);
                var startIdx = idx_1;
                var key = '[' + startIdx;
                (0, each_1.default)(val, function (val) {
                    obj[idx_1] = val;
                    map_1[idx_1] = true;
                    idx_1++;
                });
                var endIdx = idx_1 - 1;
                key += (endIdx - startIdx > 0 ? ' … ' + endIdx : '') + ']';
                virtualData[key] = obj;
            });
            virtualKeys = (0, keys_1.default)(virtualData);
            enumerableKeys = (0, filter_1.default)(enumerableKeys, function (val) { return !map_1[val]; });
        }
        (0, each_1.default)(types, function (type) {
            var typeKeys = [];
            if (type === 'symbol') {
                typeKeys = symbolKeys;
            }
            else if (type === 'unenumerable') {
                typeKeys = unenumerableKeys;
            }
            else if (type === 'virtual') {
                typeKeys = virtualKeys;
            }
            else {
                typeKeys = enumerableKeys;
            }
            if (!isBigArr) {
                (0, naturalSort_1.default)(typeKeys);
            }
            for (var i = 0, len = typeKeys.length; i < len; i++) {
                var key = (0, toStr_1.default)(typeKeys[i]);
                var val = '';
                var descriptor = Object.getOwnPropertyDescriptor(data, key);
                var hasGetter = descriptor && descriptor.get;
                var hasSetter = descriptor && descriptor.set;
                if (hasGetter && !_this.options.accessGetter) {
                    val = '(...)';
                }
                else {
                    try {
                        if (type === 'virtual') {
                            val = virtualData[key];
                        }
                        else {
                            val = self[key];
                        }
                        if ((0, isPromise_1.default)(val)) {
                            ;
                            val.catch(noop_1.default);
                        }
                    }
                    catch (e) {
                        if (e instanceof Error) {
                            val = e.message;
                        }
                        else {
                            val = (0, toStr_1.default)(e);
                        }
                    }
                }
                ret += _this.createEl(key, data, val, type, firstLevel);
                if (hasGetter) {
                    ret += _this.createEl("get ".concat(key), data, descriptor.get, type, firstLevel);
                }
                if (hasSetter) {
                    ret += _this.createEl("set ".concat(key), data, descriptor.set, type, firstLevel);
                }
            }
        });
        var proto = (0, getProto_1.default)(data);
        if (!firstLevel && proto) {
            if (ret === '') {
                var id = visitor.set(proto, {
                    self: data,
                });
                this.map[id] = proto;
                ret = this.objToHtml(proto);
            }
            else {
                ret += this.createEl('__proto__', self || data, proto, 'proto');
            }
        }
        return ret;
    };
    ObjectViewer.prototype.createEl = function (key, self, val, keyType, firstLevel) {
        if (firstLevel === void 0) { firstLevel = false; }
        var _a = this, visitor = _a.visitor, c = _a.c;
        var t = typeof val;
        var valType = (0, type_1.default)(val, false);
        if (keyType === 'virtual')
            valType = key;
        if (val === null) {
            return "<li>".concat(wrapKey(key), "<span class=\"").concat(c('null'), "\">null</span></li>");
        }
        else if ((0, isNum_1.default)(val) || (0, isBool_1.default)(val)) {
            return "<li>".concat(wrapKey(key), "<span class=\"").concat(c(t), "\">").concat((0, util_1.encode)(val), "</span></li>");
        }
        if (valType === 'RegExp')
            t = 'regexp';
        if (valType === 'Number')
            t = 'number';
        if (valType === 'Number' || valType === 'RegExp') {
            return "<li>".concat(wrapKey(key), "<span class=\"").concat(c(t), "\">").concat((0, util_1.encode)(val.value), "</span></li>");
        }
        else if (valType === 'Undefined' || valType === 'Symbol') {
            return "<li>".concat(wrapKey(key), "<span class=\"").concat(c('special'), "\">").concat((0, lowerCase_1.default)(valType), "</span></li>");
        }
        else if (val === '(...)') {
            return "<li>".concat(wrapKey(key), "<span class=\"").concat(c('special'), "\">").concat(val, "</span></li>");
        }
        else if ((0, isObj_1.default)(val)) {
            var visitedObj = visitor.get(val);
            var id = void 0;
            if (visitedObj) {
                id = visitedObj.id;
            }
            else {
                var extra = {};
                if (keyType === 'proto') {
                    extra.self = self;
                }
                id = visitor.set(val, extra);
                this.map[id] = val;
            }
            var objAbstract = getObjAbstract(val, valType) || (0, upperFirst_1.default)(t);
            var icon = firstLevel
                ? ''
                : "<span class=\"".concat(c('expanded collapsed'), "\"><span class=\"").concat(c('icon icon-caret-right'), "\"></span><span class=\"").concat(c('icon icon-caret-down'), "\"></span></span>");
            var obj = "<li ".concat(firstLevel ? 'data-first-level="true"' : '', " ").concat('data-object-id="' + id + '"', ">").concat(icon).concat(wrapKey(key), "<span class=\"").concat(c('open'), "\">").concat(firstLevel ? '' : objAbstract, "</span><ul class=\"").concat(c(t), "\" ").concat(firstLevel ? '' : 'style="display:none"', ">");
            if (firstLevel)
                obj += this.objToHtml(val);
            return obj + "</ul><span class=\"".concat(c('close'), "\"></span></li>");
        }
        function wrapKey(key) {
            if (firstLevel)
                return '';
            if ((0, isObj_1.default)(val) && keyType === 'virtual')
                return '';
            var keyClass = c('key');
            if (keyType === 'unenumerable' ||
                keyType === 'proto' ||
                keyType === 'symbol') {
                keyClass = c('key-lighter');
            }
            return "<span class=\"".concat(keyClass, "\">").concat((0, util_1.encode)(key), "</span>: ");
        }
        return "<li>".concat(wrapKey(key), "<span class=\"").concat(c(typeof val), "\">\"").concat((0, util_1.encode)(val), "\"</span></li>");
    };
    ObjectViewer.prototype.render = function () {
        this.$container.html(this.objToHtml(this.data, true));
    };
    ObjectViewer.prototype.bindEvent = function () {
        this.$container.on('click', 'li', this.onItemClick);
    };
    return ObjectViewer;
}(Component_1.default));
exports["default"] = ObjectViewer;
module.exports = (0, extend_1.default)(ObjectViewer, exports);
module.exports["default"] = ObjectViewer;
function getObjAbstract(data, type) {
    if (!type)
        return;
    if (type === 'Function') {
        return (0, util_1.getFnAbstract)((0, toSrc_1.default)(data));
    }
    if (type === 'Array') {
        return "Array(".concat(data.length, ")");
    }
    return type;
}


/***/ }),

/***/ 8629:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getFnAbstract = exports.encode = void 0;
var toStr_1 = __importDefault(__webpack_require__(3367));
var trim_1 = __importDefault(__webpack_require__(4331));
var escape_1 = __importDefault(__webpack_require__(8901));
var encode = function (str) {
    return (0, escape_1.default)((0, toStr_1.default)(str))
        .replace(/\n/g, '↵')
        .replace(/\f|\r|\t/g, '');
};
exports.encode = encode;
function getFnAbstract(str) {
    if (str.length > 500)
        str = str.slice(0, 500) + '...';
    return 'ƒ ' + (0, trim_1.default)(extractFnHead(str).replace('function', ''));
}
exports.getFnAbstract = getFnAbstract;
var regFnHead = /function(.*?)\((.*?)\)/;
function extractFnHead(str) {
    var fnHead = str.match(regFnHead);
    if (fnHead)
        return fnHead[0];
    return str;
}


/***/ }),

/***/ 5198:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Emitter_1 = __importDefault(__webpack_require__(1443));
var _1 = __importDefault(__webpack_require__(1512));
var util_1 = __webpack_require__(2702);
var each_1 = __importDefault(__webpack_require__(3783));
var extend_1 = __importDefault(__webpack_require__(6329));
var defaults_1 = __importDefault(__webpack_require__(4193));
var remove_1 = __importDefault(__webpack_require__(5852));
var Component = (function (_super) {
    __extends(Component, _super);
    function Component(container, _a, _b) {
        var compName = _a.compName;
        var _c = _b === void 0 ? {} : _b, _d = _c.theme, theme = _d === void 0 ? 'light' : _d;
        var _this = _super.call(this) || this;
        _this.subComponents = [];
        _this.compName = compName;
        _this.c = (0, util_1.classPrefix)(compName);
        _this.options = {};
        _this.container = container;
        _this.$container = (0, _1.default)(container);
        _this.$container.addClass([
            "luna-".concat(compName),
            _this.c("platform-".concat((0, util_1.getPlatform)())),
        ]);
        _this.on('optionChange', function (name, val, oldVal) {
            var c = _this.c;
            if (name === 'theme') {
                _this.$container
                    .rmClass(c("theme-".concat(oldVal)))
                    .addClass(c("theme-".concat(val)));
                (0, each_1.default)(_this.subComponents, function (component) {
                    return component.setOption('theme', val);
                });
            }
        });
        _this.setOption('theme', theme);
        return _this;
    }
    Component.prototype.destroy = function () {
        this.destroySubComponents();
        var c = this.c;
        this.$container
            .rmClass("luna-".concat(this.compName))
            .rmClass(c("platform-".concat((0, util_1.getPlatform)())))
            .rmClass(c("theme-".concat(this.options.theme)));
        this.$container.html('');
        this.emit('destroy');
        this.removeAllListeners();
    };
    Component.prototype.setOption = function (name, val) {
        var _this = this;
        var options = this.options;
        var newOptions = {};
        if (typeof name === 'string') {
            newOptions[name] = val;
        }
        else {
            newOptions = name;
        }
        (0, each_1.default)(newOptions, function (val, name) {
            var oldVal = options[name];
            options[name] = val;
            _this.emit('optionChange', name, val, oldVal);
        });
    };
    Component.prototype.getOption = function (name) {
        return this.options[name];
    };
    Component.prototype.addSubComponent = function (component) {
        component.setOption('theme', this.options.theme);
        this.subComponents.push(component);
    };
    Component.prototype.removeSubComponent = function (component) {
        (0, remove_1.default)(this.subComponents, function (com) { return com === component; });
    };
    Component.prototype.destroySubComponents = function () {
        (0, each_1.default)(this.subComponents, function (component) { return component.destroy(); });
        this.subComponents = [];
    };
    Component.prototype.initOptions = function (options, defs) {
        if (defs === void 0) { defs = {}; }
        (0, defaults_1.default)(options, defs);
        (0, extend_1.default)(this.options, options);
    };
    Component.prototype.find = function (selector) {
        return this.$container.find(this.c(selector));
    };
    return Component;
}(Emitter_1.default));
exports["default"] = Component;


/***/ }),

/***/ 2702:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resetCanvasSize = exports.getPlatform = exports.pxToNum = exports.executeAfterTransition = exports.hasVerticalScrollbar = exports.measuredScrollbarWidth = exports.eventClient = exports.drag = exports.classPrefix = void 0;
var map_1 = __importDefault(__webpack_require__(2461));
var trim_1 = __importDefault(__webpack_require__(4331));
var root_1 = __importDefault(__webpack_require__(5610));
var html_1 = __importDefault(__webpack_require__(7483));
var isNum_1 = __importDefault(__webpack_require__(3990));
var contain_1 = __importDefault(__webpack_require__(6341));
var toNum_1 = __importDefault(__webpack_require__(3875));
var detectOs_1 = __importDefault(__webpack_require__(6954));
var isHidden_1 = __importDefault(__webpack_require__(9585));
function classPrefix(name) {
    var prefix = "luna-".concat(name, "-");
    function processClass(str) {
        return (0, map_1.default)((0, trim_1.default)(str).split(/\s+/), function (singleClass) {
            if ((0, contain_1.default)(singleClass, prefix)) {
                return singleClass;
            }
            return singleClass.replace(/[\w-]+/, function (match) { return "".concat(prefix).concat(match); });
        }).join(' ');
    }
    return function (str) {
        if (/<[^>]*>/g.test(str)) {
            try {
                var tree = html_1.default.parse(str);
                traverseTree(tree, function (node) {
                    if (node.attrs && node.attrs.class) {
                        node.attrs.class = processClass(node.attrs.class);
                    }
                });
                return html_1.default.stringify(tree);
            }
            catch (e) {
                return processClass(str);
            }
        }
        return processClass(str);
    };
}
exports.classPrefix = classPrefix;
function traverseTree(tree, handler) {
    for (var i = 0, len = tree.length; i < len; i++) {
        var node = tree[i];
        handler(node);
        if (node.content) {
            traverseTree(node.content, handler);
        }
    }
}
var hasTouchSupport = 'ontouchstart' in root_1.default;
var touchEvents = {
    start: 'touchstart',
    move: 'touchmove',
    end: 'touchend',
};
var mouseEvents = {
    start: 'mousedown',
    move: 'mousemove',
    end: 'mouseup',
};
function drag(name) {
    return hasTouchSupport ? touchEvents[name] : mouseEvents[name];
}
exports.drag = drag;
function eventClient(type, e) {
    var name = type === 'x' ? 'clientX' : 'clientY';
    if (e[name]) {
        return e[name];
    }
    if (e.changedTouches) {
        return e.changedTouches[0][name];
    }
    return 0;
}
exports.eventClient = eventClient;
var scrollbarWidth;
function measuredScrollbarWidth() {
    if ((0, isNum_1.default)(scrollbarWidth)) {
        return scrollbarWidth;
    }
    if (!document) {
        return 16;
    }
    var scrollDiv = document.createElement('div');
    var innerDiv = document.createElement('div');
    scrollDiv.setAttribute('style', 'display: block; width: 100px; height: 100px; overflow: scroll;');
    innerDiv.setAttribute('style', 'height: 200px');
    scrollDiv.appendChild(innerDiv);
    document.body.appendChild(scrollDiv);
    scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
}
exports.measuredScrollbarWidth = measuredScrollbarWidth;
function hasVerticalScrollbar(el) {
    return el.scrollHeight > el.offsetHeight;
}
exports.hasVerticalScrollbar = hasVerticalScrollbar;
function executeAfterTransition(el, callback) {
    if ((0, isHidden_1.default)(el)) {
        return callback();
    }
    var handler = function (e) {
        var target = e.target;
        if (target !== el) {
            return;
        }
        el.removeEventListener('transitionend', handler);
        callback();
    };
    el.addEventListener('transitionend', handler);
}
exports.executeAfterTransition = executeAfterTransition;
function pxToNum(str) {
    return (0, toNum_1.default)(str.replace('px', ''));
}
exports.pxToNum = pxToNum;
function getPlatform() {
    var os = (0, detectOs_1.default)();
    if (os === 'os x') {
        return 'mac';
    }
    return os;
}
exports.getPlatform = getPlatform;
function resetCanvasSize(canvas) {
    canvas.width = Math.round(canvas.offsetWidth * window.devicePixelRatio);
    canvas.height = Math.round(canvas.offsetHeight * window.devicePixelRatio);
}
exports.resetCanvasSize = resetCanvasSize;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./node_modules/luna-object-viewer/cjs/object-viewer/index.js
var object_viewer = __webpack_require__(4030);
var object_viewer_default = /*#__PURE__*/__webpack_require__.n(object_viewer);
;// CONCATENATED MODULE: ./src/SpecialForce/MassBlocksForm/MassBlocksForm.js
/*eslint-disable */



const DELAY_BLOCK = 10; // s
let result = [];
const API_KEY = '';
const CHAT_ID = '';
const controllerAbort = new AbortController();

const htmlElements = {
  user: document.querySelector('img.avatar'),
  root: document.querySelector('#addBlocking'),
  select: document.querySelector('select.form-control'),
  license: document.querySelector('textarea#keyField'),
  description: document.querySelector('textarea[name="description"]'),
  ticket: document.querySelector('input[name="ticket"]'),
  tillDate: document.querySelector('input[name="tillDate"]'),
  btnSubmit: document.querySelector('button[type="submit"]')
};

function CreateElement({ name, options, contents, events }) {
  const element = document.createElement(name);
  if (options !== undefined) {
    Object.keys(options).forEach((keyOption) => {
      element.setAttribute(keyOption, options[keyOption]);
    });
  }
  if (contents !== undefined) {
    Object.keys(contents).forEach((keyContent) => {
      element[keyContent] = contents[keyContent];
    });
  }
  if (events !== undefined) {
    Object.keys(events).forEach((keyEvent) => {
      element.addEventListener(keyEvent, events[keyEvent]);
    });
  }
  return element;
}

function CreatePromise(callback, { signal = controllerAbort.signal, delay = 1 }) {
  if (signal.aborted) {
    console.error('Abort');
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }

  return new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => {
      reject(new DOMException('Aborted', 'AbortError'));
    });
    setTimeout(() => {
      const condition = callback();
      if (condition === true) {
        resolve(condition);
      }
      reject(condition);
    }, delay * 1000);
  });
}

function formatFileInArray(str) {
  return str
    .split('@')
    .filter((el) => el !== '')
    .map((el) => el.split(';'))
    .map((el) => ({
      license: el[0].replace('\r', '').replace('\n', '').trim(),
      resolution: el[1].replace(/^\"/g, '').replace(/\"$/g, '').replace(/\"\"/g, '"').trim()
    }));
}

function formatDataInMassBlock(data) {
  return data.reduce((prev, next) => {
    /*
    {
      title: '',
      numbers: []
    }
     */
    if (prev.some((item) => item.title === next.resolution)) {
      const item = prev.find((i) => i.title === next.resolution);
      const r = item.numbers.push(next.license);
      if (typeof r !== 'object') {
        return prev;
      }
      return [...prev, r];
    }
    prev.push({
      title: next.resolution,
      numbers: [next.license]
    });
    return prev;
  }, []);
}

function formatDateInLocale() {
  return new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow' });
}

function postMessageInTelegram(message = []) {
  const user = htmlElements.user.getAttribute('src').match(/.+\/user\/(.+)\/avatar/)[1];
  window.open(
    `https://api.telegram.org/bot${API_KEY}/sendMessage?chat_id=${CHAT_ID}&text=\`WEB\` \*${user}\* ${message.join(
      `${'%0A'}`
    )}&parse_mode=Markdown`,
    '_blank',
    'resizable=no,top=10,left=300,width=100,height=100'
  );
}

function switchMessageInLogger({ status, title = '', numbers = [] }) {
  switch (status) {
    case 'message':
      return {
        style: 'color: black',
        message: `[${formatDateInLocale()}] ${title}`
      };
    case 'error':
      return {
        style: 'color: red;',
        message: `[${formatDateInLocale()}] Total numbers: ${
          numbers.length
        } Template: ${title} error. `
      };
    case 'block':
      return {
        style: 'color: black;',
        message: `[${formatDateInLocale()}] Total numbers: ${
          numbers.length
        } block. Template: ${title} `
      };
    case 'start':
      return {
        style: 'color: black;',
        message: `[${formatDateInLocale()}] start blocks. Total blocks: ${title}`
      };
    case 'finish':
      return {
        style: 'color: green;',
        message: `[${formatDateInLocale()}] finish blocks.`
      };
    case 'abort':
      return {
        style: 'color: red;',
        message: `[${formatDateInLocale()}] abort blocks.`
      };
    default:
      return {
        style: 'color: black;',
        message: 'Impossible'
      };
  }
}

function calcLengthBlocks(array = []) {
  return array.reduce((prev, next) => {
    return prev + Number(next.numbers.length);
  }, 0);
}

function handlerUploadFile() {
  if (this.files.length > 1) {
    window.alert('Требуется один файл');
    return;
  }
  const file = this.files[0];
  const reader = new FileReader();
  reader.readAsText(file);
  reader.addEventListener('load', () => {
    const fileResponse = reader.result;
    result = formatDataInMassBlock(formatFileInArray(fileResponse));
    console.log(result);
    objectViewer.set(result);
    postMessageInLogger({ status: 'message', title: `Total blocks: ${calcLengthBlocks(result)}` });
    postMessageInLogger({ status: 'message', title: `Total space: ${result.length}` });
  });
  reader.addEventListener('error', () => window.alert('Ошибка при загрузке файла'));
}

async function handlerStartBlock({ result, inputTicket, inputDate }) {
  const { description, ticket, tillDate, btnSubmit, license, select } = htmlElements;
  const errors = [];
  const blocks = [];
  if (result.length < 1) {
    return;
  }
  postMessageInTelegram([
    `\*start\* \_block\_`,
    `\`Tickets:\` ${inputTicket.value}`,
    `\`Date:\` ${inputDate.value}`,
    `\`Summary:\` ${calcLengthBlocks(result)}`
  ]);
  postMessageInLogger({ status: 'start', title: calcLengthBlocks(result) });

  for (let i = 0; i < result.length; i++) {
    try {
      console.log(i);
      await CreatePromise(() => {
        select.value = 'Driver';
        select.dispatchEvent(new Event('change'));
        return true;
      }, {});
      await CreatePromise(() => {
        if (getComputedStyle(license).display === 'block') {
          return true;
        }
        return {
          title: 'display error'
        };
      }, {});
      await CreatePromise(() => {
        license.value = result[i].numbers.join('\n');
        return true;
      }, {});
      await CreatePromise(() => {
        description.value = result[i].title;
        return true;
      }, {});
      await CreatePromise(() => {
        ticket.value = inputTicket.value;
        return true;
      }, {});
      await CreatePromise(() => {
        tillDate.value = inputDate.value;
        return true;
      }, {});
      await CreatePromise(() => {
        btnSubmit.click();
        return true;
      }, {});
      await CreatePromise(
        () => {
          if (select.value === '') {
            postMessageInLogger({
              status: 'block',
              numbers: result[i].numbers,
              title: result[i].title
            });
            console.log(`Total numbers: ${result[i].numbers.length} Template: ${result[i].title}`);
            blocks.push(result[i]);
            return true;
          }
          return {
            title: result[i].title,
            numbers: result[i].numbers
          };
        },
        { delay: DELAY_BLOCK }
      );
    } catch (e) {
      if (e.name === 'AbortError') {
        console.error('Abort catch');
        postMessageInLogger({ status: 'abort' });
        postMessageInTelegram([`\*abort\* \_block\_`]);
        return;
      }
      postMessageInLogger({ status: 'error', title: result[i].title, numbers: result[i].numbers });
      console.error(e);
      errors.push(result[i]);
    }
  }
  postMessageInTelegram([
    `\*end\* \_block\_`,
    `\`Stats:\``,
    `\`- Total: ${calcLengthBlocks(result)}\``,
    `\`- Blocks: ${calcLengthBlocks(blocks)}\``,
    `\`- Errors: ${calcLengthBlocks(errors)}\``
  ]);
  postMessageInLogger({ status: 'finish' });
  console.log('finish blocks');
}

function createUpload(root) {
  const spanElement = CreateElement({
    name: 'span',
    options: {
      style: 'margin: 15px 0; display: flex; align-items: center; justify-content: end;'
    }
  });
  const inputFile = CreateElement({
    name: 'input',
    options: {
      type: 'file',
      accept: '.csv',
      id: 'upload-block-file'
    },
    events: {
      change: handlerUploadFile
    }
  });
  const inputTicket = CreateElement({
    name: 'input',
    options: {
      style: 'margin: 0 15px; width: 30%;',
      placeholder: 'ticket'
    }
  });
  const inputDate = CreateElement({
    name: 'input',
    options: {
      style: 'margin: 0 15px',
      type: 'date'
    }
  });
  const buttonElementStart = CreateElement({
    name: 'button',
    contents: {
      className: 'btn btn-primary',
      textContent: 'Start'
    },
    events: {
      click: () => handlerStartBlock({ result, inputTicket, inputDate })
    }
  });
  const buttonElementAbort = CreateElement({
    name: 'button',
    options: {
      style: 'margin-left: 10px;'
    },
    contents: {
      className: 'btn btn-default',
      textContent: 'Abort'
    },
    events: {
      click: (e) => {
        e.preventDefault();
        controllerAbort.abort();
      }
    }
  });
  root.before(spanElement);
  spanElement.append(inputFile, inputTicket, inputDate, buttonElementStart, buttonElementAbort);
}

function createLogger(root) {
  const wrapper = CreateElement({
    name: 'div',
    options: {
      style:
        'height: 400px; display: flex; flex-direction: column; box-shadow: black 0px 6px 12px; margin: 0; border-radius: 5px 5px 0 0; overflow-y: scroll; background-color: #fff; padding: 20px;'
    }
  });
  const logger = CreateElement({ name: 'div' });
  const viewer = CreateElement({
    name: 'div',
    options: {
      id: 'object-viewer'
    }
  });
  wrapper.append(logger, viewer);
  root.after(wrapper);

  return ({ status, title, numbers }) => {
    const { style, message } = switchMessageInLogger({ status, title, numbers });
    const p = CreateElement({
      name: 'p',
      options: {
        style
      }
    });
    const small = CreateElement({
      name: 'small',
      contents: {
        textContent: message
      }
    });
    p.append(small);
    logger.append(p);
  };
}

const style = document.createElement('style');
const postMessageInLogger = createLogger(htmlElements.root);
const container = document.querySelector('#object-viewer');
const objectViewer = new (object_viewer_default())(container, {
  unenumerable: false,
  accessGetter: true
});

style.textContent = `.luna-object-viewer{overflow-x:auto;-webkit-overflow-scrolling:touch;overflow-y:auto;cursor:default;font-family:Menlo,Consolas,Lucida Console,Courier New,monospace;font-size:12px;line-height:1.2;min-height:100%;color:#333;list-style:none!important}.luna-object-viewer ul{list-style:none!important;padding:0!important;padding-left:12px!important;margin:0!important}.luna-object-viewer li{cursor: pointer; position:relative;white-space:nowrap;line-height:16px;min-height:16px}.luna-object-viewer>li>.luna-object-viewer-key{display:none}.luna-object-viewer span{position:static!important}.luna-object-viewer li .luna-object-viewer-collapsed~.luna-object-viewer-close:before{color:#999}.luna-object-viewer-array .luna-object-viewer-object .luna-object-viewer-key{display:inline}.luna-object-viewer-null{color:#5e5e5e}.luna-object-viewer-regexp,.luna-object-viewer-string{color:#c41a16}.luna-object-viewer-number{color:#1c00cf}.luna-object-viewer-boolean{color:#0d22aa}.luna-object-viewer-special{color:#5e5e5e}.luna-object-viewer-key,.luna-object-viewer-key-lighter{color:#881391}.luna-object-viewer-key-lighter{opacity:.6}.luna-object-viewer-collapsed .luna-object-viewer-icon,.luna-object-viewer-expanded .luna-object-viewer-icon{position:absolute!important;left:-12px;color:#727272;font-size:12px}.luna-object-viewer-icon-caret-right{top:1px}.luna-object-viewer-icon-caret-down{top:2px}.luna-object-viewer-expanded>.luna-object-viewer-icon-caret-down{display:inline}.luna-object-viewer-expanded>.luna-object-viewer-icon-caret-right{display:none}.luna-object-viewer-collapsed>.luna-object-viewer-icon-caret-down{display:none}.luna-object-viewer-collapsed>.luna-object-viewer-icon-caret-right{display:inline}.luna-object-viewer-hidden~ul{display:none}.luna-object-viewer-theme-dark{color:#fff}.luna-object-viewer-theme-dark .luna-object-viewer-null,.luna-object-viewer-theme-dark .luna-object-viewer-special{color:#a1a1a1}.luna-object-viewer-theme-dark .luna-object-viewer-regexp,.luna-object-viewer-theme-dark .luna-object-viewer-string{color:#f28b54}.luna-object-viewer-theme-dark .luna-object-viewer-boolean,.luna-object-viewer-theme-dark .luna-object-viewer-number{color:#9980ff}.luna-object-viewer-theme-dark .luna-object-viewer-key,.luna-object-viewer-theme-dark .luna-object-viewer-key-lighter{color:#5db0d7}`;
document.head.append(style);

if (API_KEY || CHAT_ID) {
  createUpload(htmlElements.root);
}

;// CONCATENATED MODULE: ./src/Directions/specialForce/index.ts


})();

/******/ })()
;