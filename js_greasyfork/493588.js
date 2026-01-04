// ==UserScript==
// @name         网页截屏
// @namespace    https://github.com/CListery
// @version      0.9
// @description  将选中元素截屏
// @license      MIT
// @author       CListery
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1/dist/html2canvas.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/luna-dom-highlighter@1.0.2/luna-dom-highlighter.js
// @resource     lunaDomHighlighterCSS  https://cdn.jsdelivr.net/npm/luna-dom-highlighter/luna-dom-highlighter.css
// @match        *://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmZmZmIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMuMiIvPgogICAgPHBhdGggZD0iTTkgMkw3LjE3IDRINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNmMxLjEgMCAyLS45IDItMlY2YzAtMS4xLS45LTItMi0yaC0zLjE3TDE1IDJIOXptMyAxNWMtMi43NiAwLTUtMi4yNC01LTVzMi4yNC01IDUtNSA1IDIuMjQgNSA1LTIuMjQgNS01IDV6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=
// @grant        GM.getResourceUrl
// @grant        GM.getResourceText
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/493588/%E7%BD%91%E9%A1%B5%E6%88%AA%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/493588/%E7%BD%91%E9%A1%B5%E6%88%AA%E5%B1%8F.meta.js
// ==/UserScript==

;(function () {
    'use strict',
      // licia libraries
      // Built by eustia.
      // included: h toBool evalCss root cssSupports $ contain defaults
      (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
          define([], factory)
        } else if (typeof module === 'object' && module.exports) {
          module.exports = factory()
        } else {
          root._licia = factory()
        }
      })(this, function () {
        /* eslint-disable */
  
        var _licia = {}
  
        if (typeof window === 'object' && window._licia) _licia = window._licia
  
        /* ------------------------------ last ------------------------------ */
  
        var last = (_licia.last = (function (exports) {
          /* Get the last element of array.
           *
           * |Name  |Desc                     |
           * |------|-------------------------|
           * |arr   |The array to query       |
           * |return|The last element of array|
           */
  
          /* example
           * last([1, 2]); // -> 2
           */
  
          /* typescript
           * export declare function last(arr: any[]): any;
           */
  
          exports = function (arr) {
            var len = arr ? arr.length : 0
            if (len) return arr[len - 1]
          }
  
          return exports
        })({}))
  
        /* ------------------------------ isUndef ------------------------------ */
  
        var isUndef = (_licia.isUndef = (function (exports) {
          /* Check if value is undefined.
           *
           * |Name  |Desc                      |
           * |------|--------------------------|
           * |val   |Value to check            |
           * |return|True if value is undefined|
           */
  
          /* example
           * isUndef(void 0); // -> true
           * isUndef(null); // -> false
           */
  
          /* typescript
           * export declare function isUndef(val: any): val is undefined;
           */
  
          exports = function (val) {
            return val === void 0
          }
  
          return exports
        })({}))
  
        /* ------------------------------ types ------------------------------ */
  
        var types = (_licia.types = (function (exports) {
          /* Used for typescript definitions only.
           */
  
          /* typescript
           * export declare namespace types {
           *     interface Collection<T> {}
           *     interface List<T> extends Collection<T> {
           *         [index: number]: T;
           *         length: number;
           *     }
           *     interface ListIterator<T, TResult> {
           *         (value: T, index: number, list: List<T>): TResult;
           *     }
           *     interface Dictionary<T> extends Collection<T> {
           *         [index: string]: T;
           *     }
           *     interface ObjectIterator<T, TResult> {
           *         (element: T, key: string, list: Dictionary<T>): TResult;
           *     }
           *     interface MemoIterator<T, TResult> {
           *         (prev: TResult, curr: T, index: number, list: List<T>): TResult;
           *     }
           *     interface MemoObjectIterator<T, TResult> {
           *         (prev: TResult, curr: T, key: string, list: Dictionary<T>): TResult;
           *     }
           *     type Fn<T> = (...args: any[]) => T;
           *     type AnyFn = Fn<any>;
           *     type PlainObj<T> = { [name: string]: T };
           * }
           * export declare const types: {};
           */
  
          exports = {}
  
          return exports
        })({}))
  
        /* ------------------------------ isObj ------------------------------ */
  
        var isObj = (_licia.isObj = (function (exports) {
          /* Check if value is the language type of Object.
           *
           * |Name  |Desc                      |
           * |------|--------------------------|
           * |val   |Value to check            |
           * |return|True if value is an object|
           *
           * [Language Spec](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
           */
  
          /* example
           * isObj({}); // -> true
           * isObj([]); // -> true
           */
  
          /* typescript
           * export declare function isObj(val: any): boolean;
           */
  
          exports = function (val) {
            var type = typeof val
            return !!val && (type === 'function' || type === 'object')
          }
  
          return exports
        })({}))
  
        /* ------------------------------ splitCase ------------------------------ */
  
        var splitCase = (_licia.splitCase = (function (exports) {
          /* Split different string case to an array.
           *
           * |Name  |Desc           |
           * |------|---------------|
           * |str   |String to split|
           * |return|Result array   |
           */
  
          /* example
           * splitCase('foo-bar'); // -> ['foo', 'bar']
           * splitCase('foo bar'); // -> ['foo', 'bar']
           * splitCase('foo_bar'); // -> ['foo', 'bar']
           * splitCase('foo.bar'); // -> ['foo', 'bar']
           * splitCase('fooBar'); // -> ['foo', 'bar']
           * splitCase('foo-Bar'); // -> ['foo', 'bar']
           */
  
          /* typescript
           * export declare function splitCase(str: string): string[];
           */
  
          var regUpperCase = /([A-Z])/g
          var regSeparator = /[_.\- ]+/g
          var regTrim = /(^-)|(-$)/g
          exports = function (str) {
            str = str
              .replace(regUpperCase, '-$1')
              .toLowerCase()
              .replace(regSeparator, '-')
              .replace(regTrim, '')
            return str.split('-')
          }
  
          return exports
        })({}))
  
        /* ------------------------------ camelCase ------------------------------ */
  
        var camelCase = (_licia.camelCase = (function (exports) {
          /* Convert string to "camelCase".
           *
           * |Name  |Desc              |
           * |------|------------------|
           * |str   |String to convert |
           * |return|Camel cased string|
           */
  
          /* example
           * camelCase('foo-bar'); // -> fooBar
           * camelCase('foo bar'); // -> fooBar
           * camelCase('foo_bar'); // -> fooBar
           * camelCase('foo.bar'); // -> fooBar
           */
  
          /* typescript
           * export declare function camelCase(str: string): string;
           */
  
          /* dependencies
           * splitCase
           */
          exports = function (str) {
            var arr = splitCase(str)
            var ret = arr[0]
            arr.shift()
            arr.forEach(capitalize, arr)
            ret += arr.join('')
            return ret
          }
          function capitalize(val, idx) {
            this[idx] = val.replace(/\w/, function (match) {
              return match.toUpperCase()
            })
          }
  
          return exports
        })({}))
  
        /* ------------------------------ kebabCase ------------------------------ */
  
        var kebabCase = (_licia.kebabCase = (function (exports) {
          /* Convert string to "kebabCase".
           *
           * |Name  |Desc              |
           * |------|------------------|
           * |str   |String to convert |
           * |return|Kebab cased string|
           */
  
          /* example
           * kebabCase('fooBar'); // -> foo-bar
           * kebabCase('foo bar'); // -> foo-bar
           * kebabCase('foo_bar'); // -> foo-bar
           * kebabCase('foo.bar'); // -> foo-bar
           */
  
          /* typescript
           * export declare function kebabCase(str: string): string;
           */
  
          /* dependencies
           * splitCase
           */
          exports = function (str) {
            return splitCase(str).join('-')
          }
  
          return exports
        })({}))
  
        /* ------------------------------ has ------------------------------ */
  
        var has = (_licia.has = (function (exports) {
          /* Checks if key is a direct property.
           *
           * |Name  |Desc                            |
           * |------|--------------------------------|
           * |obj   |Object to query                 |
           * |key   |Path to check                   |
           * |return|True if key is a direct property|
           */
  
          /* example
           * has({ one: 1 }, 'one'); // -> true
           */
  
          /* typescript
           * export declare function has(obj: {}, key: string): boolean;
           */
  
          var hasOwnProp = Object.prototype.hasOwnProperty
          exports = function (obj, key) {
            return hasOwnProp.call(obj, key)
          }
  
          return exports
        })({}))
  
        /* ------------------------------ keys ------------------------------ */
  
        var keys = (_licia.keys = (function (exports) {
          /* Create an array of the own enumerable property names of object.
           *
           * |Name  |Desc                   |
           * |------|-----------------------|
           * |obj   |Object to query        |
           * |return|Array of property names|
           */
  
          /* example
           * keys({ a: 1 }); // -> ['a']
           */
  
          /* typescript
           * export declare function keys(obj: any): string[];
           */
  
          /* dependencies
           * has
           */
          if (Object.keys && !false) {
            exports = Object.keys
          } else {
            exports = function (obj) {
              var ret = []
              for (var key in obj) {
                if (has(obj, key)) ret.push(key)
              }
              return ret
            }
          }
  
          return exports
        })({}))
  
        /* ------------------------------ idxOf ------------------------------ */
  
        var idxOf = (_licia.idxOf = (function (exports) {
          /* Get the index at which the first occurrence of value.
           *
           * |Name     |Desc                |
           * |---------|--------------------|
           * |arr      |Array to search     |
           * |val      |Value to search for |
           * |fromIdx=0|Index to search from|
           * |return   |Value index         |
           */
  
          /* example
           * idxOf([1, 2, 1, 2], 2, 2); // -> 3
           */
  
          /* typescript
           * export declare function idxOf(arr: any[], val: any, fromIdx?: number): number;
           */
  
          exports = function (arr, val, fromIdx) {
            return Array.prototype.indexOf.call(arr, val, fromIdx)
          }
  
          return exports
        })({}))
  
        /* ------------------------------ create ------------------------------ */
  
        var create = (_licia.create = (function (exports) {
          /* Create new object using given object as prototype.
           *
           * |Name  |Desc                   |
           * |------|-----------------------|
           * |proto |Prototype of new object|
           * |return|Created object         |
           */
  
          /* example
           * const obj = create({ a: 1 });
           * console.log(obj.a); // -> 1
           */
  
          /* typescript
           * export declare function create(proto?: object): any;
           */
  
          /* dependencies
           * isObj
           */
          exports = function (proto) {
            if (!isObj(proto)) return {}
            if (objCreate && !false) return objCreate(proto)
            function noop() {}
            noop.prototype = proto
            return new noop()
          }
          var objCreate = Object.create
  
          return exports
        })({}))
  
        /* ------------------------------ inherits ------------------------------ */
  
        var inherits = (_licia.inherits = (function (exports) {
          /* Inherit the prototype methods from one constructor into another.
           *
           * |Name      |Desc       |
           * |----------|-----------|
           * |Class     |Child Class|
           * |SuperClass|Super Class|
           */
  
          /* example
           * function People(name) {
           *     this._name = name;
           * }
           * People.prototype = {
           *     getName: function() {
           *         return this._name;
           *     }
           * };
           * function Student(name) {
           *     this._name = name;
           * }
           * inherits(Student, People);
           * const s = new Student('RedHood');
           * s.getName(); // -> 'RedHood'
           */
  
          /* typescript
           * export declare function inherits(
           *     Class: types.AnyFn,
           *     SuperClass: types.AnyFn
           * ): void;
           */
  
          /* dependencies
           * create types
           */
          exports = function (Class, SuperClass) {
            Class.prototype = create(SuperClass.prototype)
          }
  
          return exports
        })({}))
  
        /* ------------------------------ memoize ------------------------------ */
  
        var memoize = (_licia.memoize = (function (exports) {
          /* Memoize a given function by caching the computed result.
           *
           * |Name  |Desc                                |
           * |------|------------------------------------|
           * |fn    |Function to have its output memoized|
           * |hashFn|Function to create cache key        |
           * |return|New memoized function               |
           */
  
          /* example
           * const fibonacci = memoize(function(n) {
           *     return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
           * });
           */
  
          /* typescript
           * export declare function memoize(
           *     fn: types.AnyFn,
           *     hashFn?: types.AnyFn
           * ): types.AnyFn;
           */
  
          /* dependencies
           * has types
           */
          exports = function (fn, hashFn) {
            var memoize = function (key) {
              var cache = memoize.cache
              var address = '' + (hashFn ? hashFn.apply(this, arguments) : key)
              if (!has(cache, address)) cache[address] = fn.apply(this, arguments)
              return cache[address]
            }
            memoize.cache = {}
            return memoize
          }
  
          return exports
        })({}))
  
        /* ------------------------------ cssSupports ------------------------------ */
        _licia.cssSupports = (function (exports) {
          /* Check if browser supports a given CSS feature.
           *
           * |Name  |Desc              |
           * |------|------------------|
           * |name  |Css property name |
           * |val   |Css property value|
           * |return|True if supports  |
           */
  
          /* example
           * cssSupports('display', 'flex'); // -> true
           * cssSupports('display', 'invalid'); // -> false
           * cssSupports('text-decoration-line', 'underline'); // -> true
           * cssSupports('grid'); // -> true
           * cssSupports('invalid'); // -> false
           */
  
          /* typescript
           * export declare function cssSupports(name: string, val?: string): boolean;
           */
  
          /* dependencies
           * memoize isUndef camelCase
           */
          exports = memoize(
            function (name, value) {
              if (isUndef(value)) {
                name = camelCase(name)
                return !isUndef(style[name])
              }
              style.cssText = ''
              style.cssText = name + ':' + value
              return !!style.length
            },
            function (name, value) {
              return name + ' ' + value
            }
          )
          var style = document.createElement('p').style
  
          return exports
        })({})
  
        /* ------------------------------ optimizeCb ------------------------------ */
  
        var optimizeCb = (_licia.optimizeCb = (function (exports) {
          /* Used for function context binding.
           */
  
          /* typescript
           * export declare function optimizeCb(
           *     fn: types.AnyFn,
           *     ctx: any,
           *     argCount?: number
           * ): types.AnyFn;
           */
  
          /* dependencies
           * isUndef types
           */
          exports = function (fn, ctx, argCount) {
            if (isUndef(ctx)) return fn
            switch (argCount == null ? 3 : argCount) {
              case 1:
                return function (val) {
                  return fn.call(ctx, val)
                }
              case 3:
                return function (val, idx, collection) {
                  return fn.call(ctx, val, idx, collection)
                }
              case 4:
                return function (accumulator, val, idx, collection) {
                  return fn.call(ctx, accumulator, val, idx, collection)
                }
            }
            return function () {
              return fn.apply(ctx, arguments)
            }
          }
  
          return exports
        })({}))
  
        /* ------------------------------ evalCss ------------------------------ */
        _licia.evalCss = (function (exports) {
          /* Load css into page.
           *
           * |Name  |Desc         |
           * |------|-------------|
           * |css   |Css code     |
           * |return|Style element|
           */
  
          /* example
           * evalCss('body{background:#08c}');
           */
  
          /* typescript
           * export declare function evalCss(css: string): HTMLStyleElement;
           */
  
          exports = function (css) {
            var style = document.createElement('style')
            style.textContent = css
            style.type = 'text/css'
            document.head.appendChild(style)
            return style
          }
  
          return exports
        })({})
  
        /* ------------------------------ isEl ------------------------------ */
  
        var isEl = (_licia.isEl = (function (exports) {
          /* Check if value is a DOM element.
           *
           * |Name  |Desc                          |
           * |------|------------------------------|
           * |val   |Value to check                |
           * |return|True if value is a DOM element|
           */
  
          /* example
           * isEl(document.body); // -> true
           */
  
          /* typescript
           * export declare function isEl(val: any): val is Element;
           */
  
          exports = function (val) {
            return !!(val && val.nodeType === 1)
          }
  
          return exports
        })({}))
  
        /* ------------------------------ startWith ------------------------------ */
  
        var startWith = (_licia.startWith = (function (exports) {
          /* Check if string starts with the given target string.
           *
           * |Name  |Desc                             |
           * |------|---------------------------------|
           * |str   |String to search                 |
           * |prefix|String prefix                    |
           * |return|True if string starts with prefix|
           */
  
          /* example
           * startWith('ab', 'a'); // -> true
           */
  
          /* typescript
           * export declare function startWith(str: string, prefix: string): boolean;
           */
  
          exports = function (str, prefix) {
            return str.indexOf(prefix) === 0
          }
  
          return exports
        })({}))
  
        /* ------------------------------ identity ------------------------------ */
  
        var identity = (_licia.identity = (function (exports) {
          /* Return the first argument given.
           *
           * |Name  |Desc       |
           * |------|-----------|
           * |val   |Any value  |
           * |return|Given value|
           */
  
          /* example
           * identity('a'); // -> 'a'
           */
  
          /* typescript
           * export declare function identity<T>(val: T): T;
           */
  
          exports = function (val) {
            return val
          }
  
          return exports
        })({}))
  
        /* ------------------------------ objToStr ------------------------------ */
  
        var objToStr = (_licia.objToStr = (function (exports) {
          /* Alias of Object.prototype.toString.
           *
           * |Name  |Desc                                |
           * |------|------------------------------------|
           * |val   |Source value                        |
           * |return|String representation of given value|
           */
  
          /* example
           * objToStr(5); // -> '[object Number]'
           */
  
          /* typescript
           * export declare function objToStr(val: any): string;
           */
  
          var ObjToStr = Object.prototype.toString
          exports = function (val) {
            return ObjToStr.call(val)
          }
  
          return exports
        })({}))
  
        /* ------------------------------ isArr ------------------------------ */
  
        var isArr = (_licia.isArr = (function (exports) {
          /* Check if value is an `Array` object.
           *
           * |Name  |Desc                              |
           * |------|----------------------------------|
           * |val   |Value to check                    |
           * |return|True if value is an `Array` object|
           */
  
          /* example
           * isArr([]); // -> true
           * isArr({}); // -> false
           */
  
          /* typescript
           * export declare function isArr(val: any): val is any[];
           */
  
          /* dependencies
           * objToStr
           */
          if (Array.isArray && !false) {
            exports = Array.isArray
          } else {
            exports = function (val) {
              return objToStr(val) === '[object Array]'
            }
          }
  
          return exports
        })({}))
  
        /* ------------------------------ castPath ------------------------------ */
  
        var castPath = (_licia.castPath = (function (exports) {
          /* Cast value into a property path array.
           *
           * |Name  |Desc               |
           * |------|-------------------|
           * |path  |Value to inspect   |
           * |obj   |Object to query    |
           * |return|Property path array|
           */
  
          /* example
           * castPath('a.b.c'); // -> ['a', 'b', 'c']
           * castPath(['a']); // -> ['a']
           * castPath('a[0].b'); // -> ['a', '0', 'b']
           * castPath('a.b.c', { 'a.b.c': true }); // -> ['a.b.c']
           */
  
          /* typescript
           * export declare function castPath(path: string | string[], obj?: any): string[];
           */
  
          /* dependencies
           * has isArr
           */
          exports = function (str, obj) {
            if (isArr(str)) return str
            if (obj && has(obj, str)) return [str]
            var ret = []
            str.replace(regPropName, function (match, number, quote, str) {
              ret.push(quote ? str.replace(regEscapeChar, '$1') : number || match)
            })
            return ret
          }
  
          // Lodash _stringToPath
          var regPropName =
            /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g
          var regEscapeChar = /\\(\\)?/g
  
          return exports
        })({}))
  
        /* ------------------------------ safeGet ------------------------------ */
  
        var safeGet = (_licia.safeGet = (function (exports) {
          /* Get object property, don't throw undefined error.
           *
           * |Name  |Desc                     |
           * |------|-------------------------|
           * |obj   |Object to query          |
           * |path  |Path of property to get  |
           * |return|Target value or undefined|
           */
  
          /* example
           * const obj = { a: { aa: { aaa: 1 } } };
           * safeGet(obj, 'a.aa.aaa'); // -> 1
           * safeGet(obj, ['a', 'aa']); // -> {aaa: 1}
           * safeGet(obj, 'a.b'); // -> undefined
           */
  
          /* typescript
           * export declare function safeGet(obj: any, path: string | string[]): any;
           */
  
          /* dependencies
           * isUndef castPath
           */
          exports = function (obj, path) {
            path = castPath(path, obj)
            var prop
            prop = path.shift()
            while (!isUndef(prop)) {
              obj = obj[prop]
              if (obj == null) return
              prop = path.shift()
            }
            return obj
          }
  
          return exports
        })({}))
  
        /* ------------------------------ isFn ------------------------------ */
  
        var isFn = (_licia.isFn = (function (exports) {
          /* Check if value is a function.
           *
           * |Name  |Desc                       |
           * |------|---------------------------|
           * |val   |Value to check             |
           * |return|True if value is a function|
           *
           * Generator function is also classified as true.
           */
  
          /* example
           * isFn(function() {}); // -> true
           * isFn(function*() {}); // -> true
           * isFn(async function() {}); // -> true
           */
  
          /* typescript
           * export declare function isFn(val: any): val is Function;
           */
  
          /* dependencies
           * objToStr
           */
          exports = function (val) {
            var objStr = objToStr(val)
            return (
              objStr === '[object Function]' ||
              objStr === '[object GeneratorFunction]' ||
              objStr === '[object AsyncFunction]'
            )
          }
  
          return exports
        })({}))
  
        /* ------------------------------ getProto ------------------------------ */
  
        var getProto = (_licia.getProto = (function (exports) {
          /* Get prototype of an object.
           *
           * |Name  |Desc                                         |
           * |------|---------------------------------------------|
           * |obj   |Target object                                |
           * |return|Prototype of given object, null if not exists|
           */
  
          /* example
           * const a = {};
           * getProto(Object.create(a)); // -> a
           */
  
          /* typescript
           * export declare function getProto(obj: any): any;
           */
  
          /* dependencies
           * isObj isFn
           */
          var getPrototypeOf = Object.getPrototypeOf
          var ObjectCtr = {}.constructor
          exports = function (obj) {
            if (!isObj(obj)) return
            if (getPrototypeOf && !false) return getPrototypeOf(obj)
            var proto = obj.__proto__
            if (proto || proto === null) return proto
            if (isFn(obj.constructor)) return obj.constructor.prototype
            if (obj instanceof ObjectCtr) return ObjectCtr.prototype
          }
  
          return exports
        })({}))
  
        /* ------------------------------ isMiniProgram ------------------------------ */
  
        var isMiniProgram = (_licia.isMiniProgram = (function (exports) {
          /* Check if running in wechat mini program.
           */
  
          /* example
           * console.log(isMiniProgram); // -> true if running in mini program.
           */
  
          /* typescript
           * export declare const isMiniProgram: boolean;
           */
  
          /* dependencies
           * isFn
           */
  
          /* eslint-disable no-undef */
          exports = typeof wx !== 'undefined' && isFn(wx.openLocation)
  
          return exports
        })({}))
  
        /* ------------------------------ isNum ------------------------------ */
  
        var isNum = (_licia.isNum = (function (exports) {
          /* Check if value is classified as a Number primitive or object.
           *
           * |Name  |Desc                                 |
           * |------|-------------------------------------|
           * |val   |Value to check                       |
           * |return|True if value is correctly classified|
           */
  
          /* example
           * isNum(5); // -> true
           * isNum(5.1); // -> true
           * isNum({}); // -> false
           */
  
          /* typescript
           * export declare function isNum(val: any): val is number;
           */
  
          /* dependencies
           * objToStr
           */
          exports = function (val) {
            return objToStr(val) === '[object Number]'
          }
  
          return exports
        })({}))
  
        /* ------------------------------ isArrLike ------------------------------ */
  
        var isArrLike = (_licia.isArrLike = (function (exports) {
          /* Check if value is array-like.
           *
           * |Name  |Desc                       |
           * |------|---------------------------|
           * |val   |Value to check             |
           * |return|True if value is array like|
           *
           * Function returns false.
           */
  
          /* example
           * isArrLike('test'); // -> true
           * isArrLike(document.body.children); // -> true;
           * isArrLike([1, 2, 3]); // -> true
           */
  
          /* typescript
           * export declare function isArrLike(val: any): boolean;
           */
  
          /* dependencies
           * isNum isFn
           */
          var MAX_ARR_IDX = Math.pow(2, 53) - 1
          exports = function (val) {
            if (!val) return false
            var len = val.length
            return isNum(len) && len >= 0 && len <= MAX_ARR_IDX && !isFn(val)
          }
  
          return exports
        })({}))
  
        /* ------------------------------ each ------------------------------ */
  
        var each = (_licia.each = (function (exports) {
          /* Iterate over elements of collection and invokes iterator for each element.
           *
           * |Name    |Desc                          |
           * |--------|------------------------------|
           * |obj     |Collection to iterate over    |
           * |iterator|Function invoked per iteration|
           * |ctx     |Function context              |
           */
  
          /* example
           * each({ a: 1, b: 2 }, function(val, key) {});
           */
  
          /* typescript
           * export declare function each<T>(
           *     list: types.List<T>,
           *     iterator: types.ListIterator<T, void>,
           *     ctx?: any
           * ): types.List<T>;
           * export declare function each<T>(
           *     object: types.Dictionary<T>,
           *     iterator: types.ObjectIterator<T, void>,
           *     ctx?: any
           * ): types.Collection<T>;
           */
  
          /* dependencies
           * isArrLike keys optimizeCb types
           */
          exports = function (obj, iterator, ctx) {
            iterator = optimizeCb(iterator, ctx)
            var i, len
            if (isArrLike(obj)) {
              for (i = 0, len = obj.length; i < len; i++) iterator(obj[i], i, obj)
            } else {
              var _keys = keys(obj)
              for (i = 0, len = _keys.length; i < len; i++) {
                iterator(obj[_keys[i]], _keys[i], obj)
              }
            }
            return obj
          }
  
          return exports
        })({}))
  
        /* ------------------------------ createAssigner ------------------------------ */
  
        var createAssigner = (_licia.createAssigner = (function (exports) {
          /* Used to create extend, extendOwn and defaults.
           *
           * |Name    |Desc                          |
           * |--------|------------------------------|
           * |keysFn  |Function to get object keys   |
           * |defaults|No override when set to true  |
           * |return  |Result function, extend...    |
           */
  
          /* typescript
           * export declare function createAssigner(
           *     keysFn: types.AnyFn,
           *     defaults: boolean
           * ): types.AnyFn;
           */
  
          /* dependencies
           * isUndef each types
           */
          exports = function (keysFn, defaults) {
            return function (obj) {
              each(arguments, function (src, idx) {
                if (idx === 0) return
                var keys = keysFn(src)
                each(keys, function (key) {
                  if (!defaults || isUndef(obj[key])) obj[key] = src[key]
                })
              })
              return obj
            }
          }
  
          return exports
        })({}))
  
        /* ------------------------------ extendOwn ------------------------------ */
  
        var extendOwn = (_licia.extendOwn = (function (exports) {
          /* Like extend, but only copies own properties over to the destination object.
           *
           * |Name       |Desc              |
           * |-----------|------------------|
           * |destination|Destination object|
           * |...sources |Sources objects   |
           * |return     |Destination object|
           */
  
          /* example
           * extendOwn({ name: 'RedHood' }, { age: 24 }); // -> {name: 'RedHood', age: 24}
           */
  
          /* typescript
           * export declare function extendOwn(destination: any, ...sources: any[]): any;
           */
  
          /* dependencies
           * keys createAssigner
           */
          exports = createAssigner(keys)
  
          return exports
        })({}))
  
        /* ------------------------------ values ------------------------------ */
  
        var values = (_licia.values = (function (exports) {
          /* Create an array of the own enumerable property values of object.
           *
           * |Name  |Desc                    |
           * |------|------------------------|
           * |obj   |Object to query         |
           * |return|Array of property values|
           */
  
          /* example
           * values({ one: 1, two: 2 }); // -> [1, 2]
           */
  
          /* typescript
           * export declare function values(obj: any): any[];
           */
  
          /* dependencies
           * each
           */
          exports = function (obj) {
            var ret = []
            each(obj, function (val) {
              ret.push(val)
            })
            return ret
          }
  
          return exports
        })({}))
  
        /* ------------------------------ isStr ------------------------------ */
  
        var isStr = (_licia.isStr = (function (exports) {
          /* Check if value is a string primitive.
           *
           * |Name  |Desc                               |
           * |------|-----------------------------------|
           * |val   |Value to check                     |
           * |return|True if value is a string primitive|
           */
  
          /* example
           * isStr('licia'); // -> true
           */
  
          /* typescript
           * export declare function isStr(val: any): val is string;
           */
  
          /* dependencies
           * objToStr
           */
          exports = function (val) {
            return objToStr(val) === '[object String]'
          }
  
          return exports
        })({}))
  
        /* ------------------------------ contain ------------------------------ */
  
        var contain = (_licia.contain = (function (exports) {
          /* Check if the value is present in the list.
           *
           * |Name  |Desc                                |
           * |------|------------------------------------|
           * |target|Target object                       |
           * |val   |Value to check                      |
           * |return|True if value is present in the list|
           */
  
          /* example
           * contain([1, 2, 3], 1); // -> true
           * contain({ a: 1, b: 2 }, 1); // -> true
           * contain('abc', 'a'); // -> true
           */
  
          /* typescript
           * export declare function contain(arr: any[] | {} | string, val: any): boolean;
           */
  
          /* dependencies
           * idxOf isStr isArrLike values
           */
          exports = function (arr, val) {
            if (isStr(arr)) return arr.indexOf(val) > -1
            if (!isArrLike(arr)) arr = values(arr)
            return idxOf(arr, val) >= 0
          }
  
          return exports
        })({}))
  
        /* ------------------------------ isBrowser ------------------------------ */
  
        var isBrowser = (_licia.isBrowser = (function (exports) {
          /* Check if running in a browser.
           */
  
          /* example
           * console.log(isBrowser); // -> true if running in a browser
           */
  
          /* typescript
           * export declare const isBrowser: boolean;
           */
  
          exports =
            typeof window === 'object' && typeof document === 'object' && document.nodeType === 9
  
          return exports
        })({}))
  
        /* ------------------------------ isMatch ------------------------------ */
  
        var isMatch = (_licia.isMatch = (function (exports) {
          /* Check if keys and values in src are contained in obj.
           *
           * |Name  |Desc                              |
           * |------|----------------------------------|
           * |obj   |Object to inspect                 |
           * |src   |Object of property values to match|
           * |return|True if object is match           |
           */
  
          /* example
           * isMatch({ a: 1, b: 2 }, { a: 1 }); // -> true
           */
  
          /* typescript
           * export declare function isMatch(obj: any, src: any): boolean;
           */
  
          /* dependencies
           * keys
           */
          exports = function (obj, src) {
            var _keys = keys(src)
            var len = _keys.length
            if (obj == null) return !len
            obj = Object(obj)
            for (var i = 0; i < len; i++) {
              var key = _keys[i]
              if (src[key] !== obj[key] || !(key in obj)) return false
            }
            return true
          }
  
          return exports
        })({}))
  
        /* ------------------------------ matcher ------------------------------ */
  
        var matcher = (_licia.matcher = (function (exports) {
          /* Return a predicate function that checks if attrs are contained in an object.
           *
           * |Name  |Desc                              |
           * |------|----------------------------------|
           * |attrs |Object of property values to match|
           * |return|New predicate function            |
           */
  
          /* example
           * const filter = require('licia/filter');
           *
           * const objects = [
           *     { a: 1, b: 2, c: 3 },
           *     { a: 4, b: 5, c: 6 }
           * ];
           * filter(objects, matcher({ a: 4, c: 6 })); // -> [{a: 4, b: 5, c: 6}]
           */
  
          /* typescript
           * export declare function matcher(attrs: any): types.AnyFn;
           */
  
          /* dependencies
           * extendOwn isMatch types
           */
          exports = function (attrs) {
            attrs = extendOwn({}, attrs)
            return function (obj) {
              return isMatch(obj, attrs)
            }
          }
  
          return exports
        })({}))
  
        /* ------------------------------ restArgs ------------------------------ */
  
        var restArgs = (_licia.restArgs = (function (exports) {
          /* This accumulates the arguments passed into an array, after a given index.
           *
           * |Name      |Desc                                   |
           * |----------|---------------------------------------|
           * |function  |Function that needs rest parameters    |
           * |startIndex|The start index to accumulates         |
           * |return    |Generated function with rest parameters|
           */
  
          /* example
           * const paramArr = restArgs(function(rest) {
           *     return rest;
           * });
           * paramArr(1, 2, 3, 4); // -> [1, 2, 3, 4]
           */
  
          /* typescript
           * export declare function restArgs(
           *     fn: types.AnyFn,
           *     startIndex?: number
           * ): types.AnyFn;
           */
  
          /* dependencies
           * types
           */
          exports = function (fn, startIdx) {
            startIdx = startIdx == null ? fn.length - 1 : +startIdx
            return function () {
              var len = Math.max(arguments.length - startIdx, 0)
              var rest = new Array(len)
              var i
              for (i = 0; i < len; i++) rest[i] = arguments[i + startIdx]
  
              // Call runs faster than apply.
              switch (startIdx) {
                case 0:
                  return fn.call(this, rest)
                case 1:
                  return fn.call(this, arguments[0], rest)
                case 2:
                  return fn.call(this, arguments[0], arguments[1], rest)
              }
              var args = new Array(startIdx + 1)
              for (i = 0; i < startIdx; i++) args[i] = arguments[i]
              args[startIdx] = rest
              return fn.apply(this, args)
            }
          }
  
          return exports
        })({}))
  
        /* ------------------------------ mergeArr ------------------------------ */
  
        var mergeArr = (_licia.mergeArr = (function (exports) {
          /* Merge the contents of arrays together into the first array.
           *
           * |Name  |Desc                                |
           * |------|------------------------------------|
           * |first |Array to merge                      |
           * |arrays|Arrays to merge into the first array|
           * |return|First array                         |
           */
  
          /* example
           * const a = [1, 2];
           * mergeArr(a, [3, 4], [5, 6]);
           * console.log(a); // -> [1, 2, 3, 4, 5, 6]
           */
  
          /* typescript
           * export declare function mergeArr<T, U>(
           *     first: ArrayLike<T>,
           *     ...arrays: ArrayLike<U>[]
           * ): ArrayLike<T | U>;
           */
  
          /* dependencies
           * restArgs
           */
          exports = restArgs(function (first, arrays) {
            var end = first.length
            for (var i = 0, len = arrays.length; i < len; i++) {
              var arr = arrays[i]
              for (var j = 0, _len = arr.length; j < _len; j++) {
                first[end++] = arr[j]
              }
            }
            first.length = end
            return first
          })
  
          return exports
        })({}))
  
        /* ------------------------------ upperFirst ------------------------------ */
  
        var upperFirst = (_licia.upperFirst = (function (exports) {
          /* Convert the first character of string to upper case.
           *
           * |Name  |Desc             |
           * |------|-----------------|
           * |str   |String to convert|
           * |return|Converted string |
           */
  
          /* example
           * upperFirst('red'); // -> Red
           */
  
          /* typescript
           * export declare function upperFirst(str: string): string;
           */
  
          exports = function (str) {
            if (str.length < 1) return str
            return str[0].toUpperCase() + str.slice(1)
          }
  
          return exports
        })({}))
  
        /* ------------------------------ prefix ------------------------------ */
  
        var prefix = (_licia.prefix = (function (exports) {
          /* Add vendor prefixes to a CSS attribute.
           *
           * |Name  |Desc                  |
           * |------|----------------------|
           * |name  |Property name         |
           * |return|Prefixed property name|
           *
           * ### dash
           *
           * Create a dasherize version.
           */
  
          /* example
           * prefix('text-emphasis'); // -> 'WebkitTextEmphasis'
           * prefix.dash('text-emphasis'); // -> '-webkit-text-emphasis'
           * prefix('color'); // -> 'color'
           */
  
          /* typescript
           * export declare namespace prefix {
           *     function dash(name: string): string;
           * }
           * export declare function prefix(name: string): string;
           */
  
          /* dependencies
           * memoize camelCase upperFirst has kebabCase
           */
          exports = memoize(function (name) {
            name = name.replace(regPrefixes, '')
            name = camelCase(name)
            if (has(style, name)) return name
            var i = prefixes.length
            while (i--) {
              var prefixName = prefixes[i] + upperFirst(name)
              if (has(style, prefixName)) return prefixName
            }
            return name
          })
          exports.dash = memoize(function (name) {
            var camelCaseResult = exports(name)
            return (regPrefixes.test(camelCaseResult) ? '-' : '') + kebabCase(camelCaseResult)
          })
          var prefixes = ['O', 'ms', 'Moz', 'Webkit']
          var regPrefixes = /^(O)|(ms)|(Moz)|(Webkit)|(-o-)|(-ms-)|(-moz-)|(-webkit-)/g
          var style = document.createElement('p').style
  
          return exports
        })({}))
  
        /* ------------------------------ property ------------------------------ */
  
        var property = (_licia.property = (function (exports) {
          /* Return a function that will itself return the key property of any passed-in object.
           *
           * |Name  |Desc                       |
           * |------|---------------------------|
           * |path  |Path of the property to get|
           * |return|New accessor function      |
           */
  
          /* example
           * const obj = { a: { b: 1 } };
           * property('a')(obj); // -> {b: 1}
           * property(['a', 'b'])(obj); // -> 1
           */
  
          /* typescript
           * export declare function property(path: string | string[]): types.AnyFn;
           */
  
          /* dependencies
           * isArr safeGet types
           */
          exports = function (path) {
            if (!isArr(path)) return shallowProperty(path)
            return function (obj) {
              return safeGet(obj, path)
            }
          }
          function shallowProperty(key) {
            return function (obj) {
              return obj == null ? void 0 : obj[key]
            }
          }
  
          return exports
        })({}))
  
        /* ------------------------------ safeCb ------------------------------ */
  
        var safeCb = (_licia.safeCb = (function (exports) {
          /* Create callback based on input value.
           */
  
          /* typescript
           * export declare function safeCb(
           *     val?: any,
           *     ctx?: any,
           *     argCount?: number
           * ): types.AnyFn;
           */
  
          /* dependencies
           * isFn isObj isArr optimizeCb matcher identity types property
           */
          exports = function (val, ctx, argCount) {
            if (val == null) return identity
            if (isFn(val)) return optimizeCb(val, ctx, argCount)
            if (isObj(val) && !isArr(val)) return matcher(val)
            return property(val)
          }
  
          return exports
        })({}))
  
        /* ------------------------------ filter ------------------------------ */
  
        var filter = (_licia.filter = (function (exports) {
          /* Iterates over elements of collection, returning an array of all the values that pass a truth test.
           *
           * |Name     |Desc                                   |
           * |---------|---------------------------------------|
           * |obj      |Collection to iterate over             |
           * |predicate|Function invoked per iteration         |
           * |ctx      |Predicate context                      |
           * |return   |Array of all values that pass predicate|
           */
  
          /* example
           * filter([1, 2, 3, 4, 5], function(val) {
           *     return val % 2 === 0;
           * }); // -> [2, 4]
           */
  
          /* typescript
           * export declare function filter<T>(
           *     list: types.List<T>,
           *     iterator: types.ListIterator<T, boolean>,
           *     context?: any
           * ): T[];
           * export declare function filter<T>(
           *     object: types.Dictionary<T>,
           *     iterator: types.ObjectIterator<T, boolean>,
           *     context?: any
           * ): T[];
           */
  
          /* dependencies
           * safeCb each types
           */
          exports = function (obj, predicate, ctx) {
            var ret = []
            predicate = safeCb(predicate, ctx)
            each(obj, function (val, idx, list) {
              if (predicate(val, idx, list)) ret.push(val)
            })
            return ret
          }
  
          return exports
        })({}))
  
        /* ------------------------------ unique ------------------------------ */
  
        var unique = (_licia.unique = (function (exports) {
          /* Create duplicate-free version of an array.
           *
           * |Name  |Desc                         |
           * |------|-----------------------------|
           * |arr   |Array to inspect             |
           * |cmp   |Function for comparing values|
           * |return|New duplicate free array     |
           */
  
          /* example
           * unique([1, 2, 3, 1]); // -> [1, 2, 3]
           */
  
          /* typescript
           * export declare function unique(
           *     arr: any[],
           *     cmp?: (a: any, b: any) => boolean | number
           * ): any[];
           */
  
          /* dependencies
           * filter
           */
          exports = function (arr, cmp) {
            cmp = cmp || isEqual
            return filter(arr, function (item, idx, arr) {
              var len = arr.length
              while (++idx < len) {
                if (cmp(item, arr[idx])) return false
              }
              return true
            })
          }
          function isEqual(a, b) {
            return a === b
          }
  
          return exports
        })({}))
  
        /* ------------------------------ allKeys ------------------------------ */
  
        var allKeys = (_licia.allKeys = (function (exports) {
          /* Retrieve all the names of object's own and inherited properties.
           *
           * |Name   |Desc                       |
           * |-------|---------------------------|
           * |obj    |Object to query            |
           * |options|Options                    |
           * |return |Array of all property names|
           *
           * Available options:
           *
           * |Name              |Desc                     |
           * |------------------|-------------------------|
           * |prototype=true    |Include prototype keys   |
           * |unenumerable=false|Include unenumerable keys|
           * |symbol=false      |Include symbol keys      |
           *
           * Members of Object's prototype won't be retrieved.
           */
  
          /* example
           * const obj = Object.create({ zero: 0 });
           * obj.one = 1;
           * allKeys(obj); // -> ['zero', 'one']
           */
  
          /* typescript
           * export declare namespace allKeys {
           *     interface IOptions {
           *         prototype?: boolean;
           *         unenumerable?: boolean;
           *     }
           * }
           * export declare function allKeys(
           *     obj: any,
           *     options: { symbol: true } & allKeys.IOptions
           * ): Array<string | Symbol>;
           * export declare function allKeys(
           *     obj: any,
           *     options?: ({ symbol: false } & allKeys.IOptions) | allKeys.IOptions
           * ): string[];
           */
  
          /* dependencies
           * keys getProto unique
           */
          var getOwnPropertyNames = Object.getOwnPropertyNames
          var getOwnPropertySymbols = Object.getOwnPropertySymbols
          exports = function (obj) {
            var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
              _ref$prototype = _ref.prototype,
              prototype = _ref$prototype === void 0 ? true : _ref$prototype,
              _ref$unenumerable = _ref.unenumerable,
              unenumerable = _ref$unenumerable === void 0 ? false : _ref$unenumerable,
              _ref$symbol = _ref.symbol,
              symbol = _ref$symbol === void 0 ? false : _ref$symbol
            var ret = []
            if ((unenumerable || symbol) && getOwnPropertyNames) {
              var getKeys = keys
              if (unenumerable && getOwnPropertyNames) getKeys = getOwnPropertyNames
              do {
                ret = ret.concat(getKeys(obj))
                if (symbol && getOwnPropertySymbols) {
                  ret = ret.concat(getOwnPropertySymbols(obj))
                }
              } while (prototype && (obj = getProto(obj)) && obj !== Object.prototype)
              ret = unique(ret)
            } else {
              if (prototype) {
                for (var key in obj) ret.push(key)
              } else {
                ret = keys(obj)
              }
            }
            return ret
          }
  
          return exports
        })({}))
  
        /* ------------------------------ defaults ------------------------------ */
        _licia.defaults = (function (exports) {
          /* Fill in undefined properties in object with the first value present in the following list of defaults objects.
           *
           * |Name  |Desc              |
           * |------|------------------|
           * |obj   |Destination object|
           * |...src|Sources objects   |
           * |return|Destination object|
           */
  
          /* example
           * defaults({ name: 'RedHood' }, { name: 'Unknown', age: 24 }); // -> {name: 'RedHood', age: 24}
           */
  
          /* typescript
           * export declare function defaults(obj: any, ...src: any[]): any;
           */
  
          /* dependencies
           * createAssigner allKeys
           */
          exports = createAssigner(allKeys, true)
  
          return exports
        })({})
  
        /* ------------------------------ extend ------------------------------ */
  
        var extend = (_licia.extend = (function (exports) {
          /* Copy all of the properties in the source objects over to the destination object.
           *
           * |Name       |Desc              |
           * |-----------|------------------|
           * |destination|Destination object|
           * |...sources |Sources objects   |
           * |return     |Destination object|
           */
  
          /* example
           * extend({ name: 'RedHood' }, { age: 24 }); // -> {name: 'RedHood', age: 24}
           */
  
          /* typescript
           * export declare function extend(destination: any, ...sources: any[]): any;
           */
  
          /* dependencies
           * createAssigner allKeys
           */
          exports = createAssigner(allKeys)
  
          return exports
        })({}))
  
        /* ------------------------------ map ------------------------------ */
  
        var map = (_licia.map = (function (exports) {
          /* Create an array of values by running each element in collection through iteratee.
           *
           * |Name    |Desc                          |
           * |--------|------------------------------|
           * |object  |Collection to iterate over    |
           * |iterator|Function invoked per iteration|
           * |context |Function context              |
           * |return  |New mapped array              |
           */
  
          /* example
           * map([4, 8], function(n) {
           *     return n * n;
           * }); // -> [16, 64]
           */
  
          /* typescript
           * export declare function map<T, TResult>(
           *     list: types.List<T>,
           *     iterator: types.ListIterator<T, TResult>,
           *     context?: any
           * ): TResult[];
           * export declare function map<T, TResult>(
           *     object: types.Dictionary<T>,
           *     iterator: types.ObjectIterator<T, TResult>,
           *     context?: any
           * ): TResult[];
           */
  
          /* dependencies
           * safeCb keys isArrLike types
           */
          exports = function (obj, iterator, ctx) {
            iterator = safeCb(iterator, ctx)
            var _keys = !isArrLike(obj) && keys(obj)
            var len = (_keys || obj).length
            var results = Array(len)
            for (var i = 0; i < len; i++) {
              var curKey = _keys ? _keys[i] : i
              results[i] = iterator(obj[curKey], curKey, obj)
            }
            return results
          }
  
          return exports
        })({}))
  
        /* ------------------------------ toArr ------------------------------ */
  
        var toArr = (_licia.toArr = (function (exports) {
          /* Convert value to an array.
           *
           * |Name  |Desc            |
           * |------|----------------|
           * |val   |Value to convert|
           * |return|Converted array |
           */
  
          /* example
           * toArr({ a: 1, b: 2 }); // -> [{a: 1, b: 2}]
           * toArr('abc'); // -> ['abc']
           * toArr(1); // -> [1]
           * toArr(null); // -> []
           */
  
          /* typescript
           * export declare function toArr(val: any): any[];
           */
  
          /* dependencies
           * isArrLike map isArr isStr
           */
          exports = function (val) {
            if (!val) return []
            if (isArr(val)) return val
            if (isArrLike(val) && !isStr(val)) return map(val)
            return [val]
          }
  
          return exports
        })({}))
  
        /* ------------------------------ Class ------------------------------ */
  
        var Class = (_licia.Class = (function (exports) {
          /* Create JavaScript class.
           *
           * |Name   |Desc                             |
           * |-------|---------------------------------|
           * |methods|Public methods                   |
           * [statics|Static methods                   |
           * |return |Function used to create instances|
           */
  
          /* example
           * const People = Class({
           *     initialize: function People(name, age) {
           *         this.name = name;
           *         this.age = age;
           *     },
           *     introduce: function() {
           *         return 'I am ' + this.name + ', ' + this.age + ' years old.';
           *     }
           * });
           *
           * const Student = People.extend(
           *     {
           *         initialize: function Student(name, age, school) {
           *             this.callSuper(People, 'initialize', arguments);
           *
           *             this.school = school;
           *         },
           *         introduce: function() {
           *             return (
           *                 this.callSuper(People, 'introduce') +
           *                 '\n I study at ' +
           *                 this.school +
           *                 '.'
           *             );
           *         }
           *     },
           *     {
           *         is: function(obj) {
           *             return obj instanceof Student;
           *         }
           *     }
           * );
           *
           * const a = new Student('allen', 17, 'Hogwarts');
           * a.introduce(); // -> 'I am allen, 17 years old. \n I study at Hogwarts.'
           * Student.is(a); // -> true
           */
  
          /* typescript
           * export declare namespace Class {
           *     class Base {
           *         toString(): string;
           *     }
           *     class IConstructor extends Base {
           *         constructor(...args: any[]);
           *         static extend(methods: any, statics: any): IConstructor;
           *         static inherits(Class: types.AnyFn): void;
           *         static methods(methods: any): IConstructor;
           *         static statics(statics: any): IConstructor;
           *         [method: string]: any;
           *     }
           * }
           * export declare function Class(methods: any, statics?: any): Class.IConstructor;
           */
  
          /* dependencies
           * extend toArr inherits safeGet isMiniProgram types
           */
          exports = function (methods, statics) {
            return Base.extend(methods, statics)
          }
          function makeClass(parent, methods, statics) {
            statics = statics || {}
            var className = methods.className || safeGet(methods, 'initialize.name') || ''
            delete methods.className
            var ctor = function () {
              var args = toArr(arguments)
              return this.initialize ? this.initialize.apply(this, args) || this : this
            }
            if (!isMiniProgram) {
              // unsafe-eval CSP violation
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
                )(toArr)
              } catch (e) {
                /* eslint-disable no-empty */
              }
            }
            inherits(ctor, parent)
            ctor.prototype.constructor = ctor
            ctor.extend = function (methods, statics) {
              return makeClass(ctor, methods, statics)
            }
            ctor.inherits = function (Class) {
              inherits(ctor, Class)
            }
            ctor.methods = function (methods) {
              extend(ctor.prototype, methods)
              return ctor
            }
            ctor.statics = function (statics) {
              extend(ctor, statics)
              return ctor
            }
            ctor.methods(methods).statics(statics)
            return ctor
          }
          var Base = (exports.Base = makeClass(Object, {
            className: 'Base',
            callSuper: function (parent, name, args) {
              var superMethod = parent.prototype[name]
              return superMethod.apply(this, args)
            },
            toString: function () {
              return this.constructor.name
            },
          }))
  
          return exports
        })({}))
  
        /* ------------------------------ Select ------------------------------ */
  
        var Select = (_licia.Select = (function (exports) {
          /* Simple wrapper of querySelectorAll to make dom selection easier.
           *
           * ### constructor
           *
           * |Name    |Desc               |
           * |--------|-------------------|
           * |selector|Dom selector string|
           *
           * ### find
           *
           * Get desdendants of current matched elements.
           *
           * |Name    |Desc               |
           * |--------|-------------------|
           * |selector|Dom selector string|
           *
           * ### each
           *
           * Iterate over matched elements.
           *
           * |Name|Desc                                |
           * |----|------------------------------------|
           * |fn  |Function to execute for each element|
           */
  
          /* example
           * const $test = new Select('#test');
           * $test.find('.test').each(function(idx, element) {
           *     // Manipulate dom nodes
           * });
           */
  
          /* typescript
           * export declare class Select {
           *     constructor(selector: string | Element | Document);
           *     find(selector: string): Select;
           *     each(fn: types.AnyFn): Select;
           * }
           */
  
          /* dependencies
           * Class isStr each types mergeArr
           */
          exports = Class({
            className: 'Select',
            initialize: function (selector) {
              this.length = 0
              if (!selector) return this
              if (isStr(selector)) return rootSelect.find(selector)
              if (selector.nodeType) {
                this[0] = selector
                this.length = 1
              }
            },
            find: function (selector) {
              var ret = new exports()
              this.each(function () {
                mergeArr(ret, this.querySelectorAll(selector))
              })
              return ret
            },
            each: function (fn) {
              each(this, function (element, idx) {
                fn.call(element, idx, element)
              })
              return this
            },
          })
          var rootSelect = new exports(document)
  
          return exports
        })({}))
  
        /* ------------------------------ $safeEls ------------------------------ */
  
        var $safeEls = (_licia.$safeEls = (function (exports) {
          /* Convert value into an array, if it's a string, do querySelector.
           *
           * |Name  |Desc             |
           * |------|-----------------|
           * |val   |Value to convert |
           * |return|Array of elements|
           */
  
          /* example
           * $safeEls(document.querySelector('.test'));
           * $safeEls(document.querySelectorAll('.test'));
           * $safeEls('.test'); // -> Array of elements with test class
           */
  
          /* typescript
           * export declare namespace $safeEls {
           *     type El = Element | Element[] | NodeListOf<Element> | string;
           * }
           * export declare function $safeEls(val: $safeEls.El): Element[];
           */
  
          /* dependencies
           * isStr toArr Select
           */
          exports = function (val) {
            return toArr(isStr(val) ? new Select(val) : val)
          }
  
          return exports
        })({}))
  
        /* ------------------------------ $attr ------------------------------ */
  
        var $attr = (_licia.$attr = (function (exports) {
          /* Element attribute manipulation.
           *
           * Get the value of an attribute for the first element in the set of matched elements.
           *
           * |Name   |Desc                            |
           * |-------|--------------------------------|
           * |element|Elements to manipulate          |
           * |name   |Attribute name                  |
           * |return |Attribute value of first element|
           *
           * Set one or more attributes for the set of matched elements.
           *
           * |Name   |Desc                  |
           * |-------|----------------------|
           * |element|Elements to manipulate|
           * |name   |Attribute name        |
           * |val    |Attribute value       |
           *
           * |Name      |Desc                                  |
           * |----------|--------------------------------------|
           * |element   |Elements to manipulate                |
           * |attributes|Object of attribute-value pairs to set|
           *
           * ### remove
           *
           * Remove an attribute from each element in the set of matched elements.
           *
           * |Name   |Desc                  |
           * |-------|----------------------|
           * |element|Elements to manipulate|
           * |name   |Attribute name        |
           */
  
          /* example
           * $attr('#test', 'attr1', 'test');
           * $attr('#test', 'attr1'); // -> test
           * $attr.remove('#test', 'attr1');
           * $attr('#test', {
           *     attr1: 'test',
           *     attr2: 'test'
           * });
           */
  
          /* typescript
           * export declare namespace $attr {
           *     function remove(element: $safeEls.El, name: string): void;
           * }
           * export declare function $attr(
           *     element: $safeEls.El,
           *     name: string,
           *     value: string
           * ): void;
           * export declare function $attr(
           *     element: $safeEls.El,
           *     attributes: types.PlainObj<string>
           * ): void;
           * export declare function $attr(element: $safeEls.El, name: string): string;
           */
  
          /* dependencies
           * toArr isObj isStr each isUndef $safeEls types
           */
          exports = function (els, name, val) {
            els = $safeEls(els)
            var isGetter = isUndef(val) && isStr(name)
            if (isGetter) return getAttr(els[0], name)
            var attrs = name
            if (!isObj(attrs)) {
              attrs = {}
              attrs[name] = val
            }
            setAttr(els, attrs)
          }
          exports.remove = function (els, names) {
            els = $safeEls(els)
            names = toArr(names)
            each(els, function (node) {
              each(names, function (name) {
                node.removeAttribute(name)
              })
            })
          }
          function getAttr(el, name) {
            return el.getAttribute(name)
          }
          function setAttr(els, attrs) {
            each(els, function (el) {
              each(attrs, function (val, name) {
                el.setAttribute(name, val)
              })
            })
          }
  
          return exports
        })({}))
  
        /* ------------------------------ $css ------------------------------ */
  
        var $css = (_licia.$css = (function (exports) {
          /* Element css manipulation.
           *
           * Get the computed style properties for the first element in the set of matched elements.
           *
           * |Name   |Desc                      |
           * |-------|--------------------------|
           * |element|Elements to manipulate    |
           * |name   |Property name             |
           * |return |Css value of first element|
           *
           * Set one or more CSS properties for the set of matched elements.
           *
           * |Name   |Desc                  |
           * |-------|----------------------|
           * |element|Elements to manipulate|
           * |name   |Property name         |
           * |val    |Css value             |
           *
           * |Name      |Desc                            |
           * |----------|--------------------------------|
           * |element   |Elements to manipulate          |
           * |properties|Object of css-value pairs to set|
           */
  
          /* example
           * $css('#test', {
           *     color: '#fff',
           *     background: 'black',
           *     opacity: 0.5
           * });
           * $css('#test', 'display', 'block');
           * $css('#test', 'color'); // -> #fff
           */
  
          /* typescript
           * export declare function $css(element: $safeEls.El, name: string): string;
           * export declare function $css(
           *     element: $safeEls.El,
           *     name: string,
           *     val: string
           * ): void;
           * export declare function $css(
           *     element: $safeEls.El,
           *     properties: types.PlainObj<string | number>
           * ): void;
           */
  
          /* dependencies
           * isStr isObj kebabCase isUndef contain isNum $safeEls prefix each types
           */
          exports = function (nodes, name, val) {
            nodes = $safeEls(nodes)
            var isGetter = isUndef(val) && isStr(name)
            if (isGetter) return getCss(nodes[0], name)
            var css = name
            if (!isObj(css)) {
              css = {}
              css[name] = val
            }
            setCss(nodes, css)
          }
          function getCss(node, name) {
            return node.style[prefix(name)] || getComputedStyle(node, '').getPropertyValue(name)
          }
          function setCss(nodes, css) {
            each(nodes, function (node) {
              var cssText = ';'
              each(css, function (val, key) {
                key = prefix.dash(key)
                cssText += key + ':' + addPx(key, val) + ';'
              })
              node.style.cssText += cssText
            })
          }
          var cssNumProps = [
            'column-count',
            'columns',
            'font-weight',
            'line-weight',
            'opacity',
            'z-index',
            'zoom',
          ]
          function addPx(key, val) {
            var needPx = isNum(val) && !contain(cssNumProps, kebabCase(key))
            return needPx ? val + 'px' : val
          }
  
          return exports
        })({}))
  
        /* ------------------------------ $data ------------------------------ */
  
        var $data = (_licia.$data = (function (exports) {
          /* Wrapper of $attr, adds data- prefix to keys.
           */
  
          /* example
           * $data('#test', 'attr1', 'eustia');
           */
  
          /* typescript
           * export declare function $data(
           *     element: $safeEls.El,
           *     name: string,
           *     value: string
           * ): void;
           * export declare function $data(
           *     element: $safeEls.El,
           *     attributes: types.PlainObj<string>
           * ): void;
           * export declare function $data(element: $safeEls.El, name: string): string;
           */
  
          /* eslint-disable no-unused-vars */
  
          /* dependencies
           * $attr isStr isObj each $safeEls types
           */
          exports = function (nodes, name, val) {
            var dataName = name
            if (isStr(name)) dataName = 'data-' + name
            if (isObj(name)) {
              dataName = {}
              each(name, function (val, key) {
                dataName['data-' + key] = val
              })
            }
            return $attr(nodes, dataName, val)
          }
  
          return exports
        })({}))
  
        /* ------------------------------ $insert ------------------------------ */
  
        var $insert = (_licia.$insert = (function (exports) {
          /* Insert html on different position.
           *
           * ### before
           *
           * Insert content before elements.
           *
           * ### after
           *
           * Insert content after elements.
           *
           * ### prepend
           *
           * Insert content to the beginning of elements.
           *
           * ### append
           *
           * Insert content to the end of elements.
           *
           * |Name   |Desc                   |
           * |-------|-----------------------|
           * |element|Elements to manipulate |
           * |content|Html strings or element|
           */
  
          /* example
           * // <div id="test"><div class="mark"></div></div>
           * $insert.before('#test', '<div>licia</div>');
           * // -> <div>licia</div><div id="test"><div class="mark"></div></div>
           * $insert.after('#test', '<div>licia</div>');
           * // -> <div id="test"><div class="mark"></div></div><div>licia</div>
           * $insert.prepend('#test', '<div>licia</div>');
           * // -> <div id="test"><div>licia</div><div class="mark"></div></div>
           * $insert.append('#test', '<div>licia</div>');
           * // -> <div id="test"><div class="mark"></div><div>licia</div></div>
           */
  
          /* typescript
           * export declare namespace $insert {
           *     type IInsert = (element: $safeEls.El, content: string | Element) => void;
           * }
           * export declare const $insert: {
           *     before: $insert.IInsert;
           *     after: $insert.IInsert;
           *     append: $insert.IInsert;
           *     prepend: $insert.IInsert;
           * };
           */
  
          /* dependencies
           * each $safeEls isStr
           */
          exports = {
            before: insertFactory('beforebegin'),
            after: insertFactory('afterend'),
            append: insertFactory('beforeend'),
            prepend: insertFactory('afterbegin'),
          }
          function insertFactory(type) {
            return function (nodes, val) {
              nodes = $safeEls(nodes)
              each(nodes, function (node) {
                if (isStr(val)) {
                  node.insertAdjacentHTML(type, val)
                } else {
                  var parentNode = node.parentNode
                  switch (type) {
                    case 'beforebegin':
                      if (parentNode) {
                        parentNode.insertBefore(val, node)
                      }
                      break
                    case 'afterend':
                      if (parentNode) {
                        parentNode.insertBefore(val, node.nextSibling)
                      }
                      break
                    case 'beforeend':
                      node.appendChild(val)
                      break
                    case 'afterbegin':
                      node.prepend(val)
                      break
                  }
                }
              })
            }
          }
  
          return exports
        })({}))
  
        /* ------------------------------ $offset ------------------------------ */
  
        var $offset = (_licia.$offset = (function (exports) {
          /* Get the position of the element in document.
           *
           * |Name   |Desc                  |
           * |-------|----------------------|
           * |element|Elements to get offset|
           * |return |Element position      |
           */
  
          /* example
           * $offset('#test'); // -> {left: 0, top: 0, width: 0, height: 0}
           */
  
          /* typescript
           * export declare namespace $offset {
           *     interface IOffset {
           *         left: number;
           *         top: number;
           *         width: number;
           *         height: number;
           *     }
           * }
           * export declare function $offset(element: $safeEls.El): $offset.IOffset;
           */
  
          /* dependencies
           * $safeEls
           */
          exports = function (els) {
            els = $safeEls(els)
            var el = els[0]
            var clientRect = el.getBoundingClientRect()
            return {
              left: clientRect.left + window.pageXOffset,
              top: clientRect.top + window.pageYOffset,
              width: Math.round(clientRect.width),
              height: Math.round(clientRect.height),
            }
          }
  
          return exports
        })({}))
  
        /* ------------------------------ $property ------------------------------ */
  
        var $property = (_licia.$property = (function (exports) {
          /* Element property html, text, val getter and setter.
           *
           * ### html
           *
           * Get the HTML contents of the first element in the set of matched elements or
           * set the HTML contents of every matched element.
           *
           * ### text
           *
           * Get the combined text contents of each element in the set of matched
           * elements, including their descendants, or set the text contents of the
           * matched elements.
           *
           * ### val
           *
           * Get the current value of the first element in the set of matched elements or
           * set the value of every matched element.
           */
  
          /* example
           * $property.html('#test', 'licia');
           * $property.html('#test'); // -> licia
           */
  
          /* typescript
           * export declare namespace $property {
           *     interface IProperty {
           *         (element: $safeEls.El, value: string): void;
           *         (element: $safeEls.El): string;
           *     }
           * }
           * export declare const $property: {
           *     html: $property.IProperty;
           *     val: $property.IProperty;
           *     text: $property.IProperty;
           * };
           */
  
          /* dependencies
           * isUndef each $safeEls
           */
          exports = {
            html: propFactory('innerHTML'),
            text: propFactory('textContent'),
            val: propFactory('value'),
          }
          function propFactory(name) {
            return function (nodes, val) {
              nodes = $safeEls(nodes)
              var node = nodes[0]
              if (isUndef(val)) {
                return node ? node[name] : ''
              }
              if (!node) return
              each(nodes, function (node) {
                node[name] = val
              })
            }
          }
  
          return exports
        })({}))
  
        /* ------------------------------ $remove ------------------------------ */
  
        var $remove = (_licia.$remove = (function (exports) {
          /* Remove the set of matched elements from the DOM.
           *
           * |Name   |Desc              |
           * |-------|------------------|
           * |element|Elements to delete|
           */
  
          /* example
           * $remove('#test');
           */
  
          /* typescript
           * export declare function $remove(element: $safeEls.El);
           */
  
          /* dependencies
           * each $safeEls
           */
          exports = function (els) {
            els = $safeEls(els)
            each(els, function (el) {
              var parent = el.parentNode
              if (parent) parent.removeChild(el)
            })
          }
  
          return exports
        })({}))
  
        /* ------------------------------ $show ------------------------------ */
  
        var $show = (_licia.$show = (function (exports) {
          /* Show elements.
           *
           * |Name   |Desc            |
           * |-------|----------------|
           * |element|Elements to show|
           */
  
          /* example
           * $show('#test');
           */
  
          /* typescript
           * export declare function $show(element: $safeEls.El): void;
           */
  
          /* dependencies
           * each $safeEls
           */
          exports = function (els) {
            els = $safeEls(els)
            each(els, function (el) {
              if (isHidden(el)) {
                el.style.display = getDefDisplay(el.nodeName)
              }
            })
          }
          function isHidden(el) {
            return getComputedStyle(el, '').getPropertyValue('display') == 'none'
          }
          var elDisplay = {}
          function getDefDisplay(elName) {
            var el, display
            if (!elDisplay[elName]) {
              el = document.createElement(elName)
              document.documentElement.appendChild(el)
              display = getComputedStyle(el, '').getPropertyValue('display')
              el.parentNode.removeChild(el)
              display == 'none' && (display = 'block')
              elDisplay[elName] = display
            }
            return elDisplay[elName]
          }
  
          return exports
        })({}))
  
        /* ------------------------------ delegate ------------------------------ */
  
        var delegate = (_licia.delegate = (function (exports) {
          /* Event delegation.
           *
           * ### add
           *
           * Add event delegation.
           *
           * |Name    |Desc          |
           * |--------|--------------|
           * |el      |Parent element|
           * |type    |Event type    |
           * |selector|Match selector|
           * |cb      |Event callback|
           *
           * ### remove
           *
           * Remove event delegation.
           */
  
          /* example
           * const container = document.getElementById('container');
           * function clickHandler() {
           *     // Do something...
           * }
           * delegate.add(container, 'click', '.children', clickHandler);
           * delegate.remove(container, 'click', '.children', clickHandler);
           */
  
          /* typescript
           * export declare const delegate: {
           *     add(el: Element, type: string, selector: string, cb: types.AnyFn): void;
           *     remove(el: Element, type: string, selector: string, cb: types.AnyFn): void;
           * };
           */
  
          /* dependencies
           * Class contain types
           */
          function retTrue() {
            return true
          }
          function retFalse() {
            return false
          }
          function trigger(e) {
            var handlers = this.events[e.type]
            var handler
            var handlerQueue = formatHandlers.call(this, e, handlers)
            e = new exports.Event(e)
            var i = 0,
              j,
              matched,
              ret
            while ((matched = handlerQueue[i++]) && !e.isPropagationStopped()) {
              e.curTarget = matched.el
              j = 0
              while ((handler = matched.handlers[j++]) && !e.isImmediatePropagationStopped()) {
                ret = handler.handler.apply(matched.el, [e])
                if (ret === false) {
                  e.preventDefault()
                  e.stopPropagation()
                }
              }
            }
          }
          function formatHandlers(e, handlers) {
            var current = e.target
            var ret = []
            var delegateCount = handlers.delegateCount
            var selector
            var matches
            var handler
            var i
            if (current.nodeType) {
              for (; current !== this; current = current.parentNode || this) {
                matches = []
                for (i = 0; i < delegateCount; i++) {
                  handler = handlers[i]
                  selector = handler.selector + ' '
                  if (matches[selector] === undefined) {
                    matches[selector] = contain(this.querySelectorAll(selector), current)
                  }
                  if (matches[selector]) matches.push(handler)
                }
                if (matches.length)
                  ret.push({
                    el: current,
                    handlers: matches,
                  })
              }
            }
            if (delegateCount < handlers.length) {
              ret.push({
                el: this,
                handlers: handlers.slice(delegateCount),
              })
            }
            return ret
          }
          exports = {
            add: function (el, type, selector, fn) {
              var handler = {
                selector: selector,
                handler: fn,
              }
              var handlers
              if (!el.events) el.events = {}
              if (!(handlers = el.events[type])) {
                handlers = el.events[type] = []
                handlers.delegateCount = 0
                el.addEventListener(
                  type,
                  function () {
                    trigger.apply(el, arguments)
                  },
                  false
                )
              }
              selector
                ? handlers.splice(handlers.delegateCount++, 0, handler)
                : handlers.push(handler)
            },
            remove: function (el, type, selector, fn) {
              var events = el.events
              if (!events || !events[type]) return
              var handlers = events[type]
              var i = handlers.length
              var handler
              while (i--) {
                handler = handlers[i]
                if ((!selector || handler.selector == selector) && handler.handler == fn) {
                  handlers.splice(i, 1)
                  if (handler.selector) {
                    handlers.delegateCount--
                  }
                }
              }
            },
            Event: Class({
              className: 'Event',
              initialize: function Event(e) {
                this.origEvent = e
              },
              isDefaultPrevented: retFalse,
              isPropagationStopped: retFalse,
              isImmediatePropagationStopped: retFalse,
              preventDefault: function () {
                var e = this.origEvent
                this.isDefaultPrevented = retTrue
                if (e && e.preventDefault) e.preventDefault()
              },
              stopPropagation: function () {
                var e = this.origEvent
                this.isPropagationStopped = retTrue
                if (e && e.stopPropagation) e.stopPropagation()
              },
              stopImmediatePropagation: function () {
                var e = this.origEvent
                this.isImmediatePropagationStopped = retTrue
                if (e && e.stopImmediatePropagation) e.stopImmediatePropagation()
                this.stopPropagation()
              },
            }),
          }
  
          return exports
        })({}))
  
        /* ------------------------------ $event ------------------------------ */
  
        var $event = (_licia.$event = (function (exports) {
          /* bind events to certain dom elements.
           */
  
          /* example
           * function clickHandler() {
           *     // Do something...
           * }
           * $event.on('#test', 'click', clickHandler);
           * $event.off('#test', 'click', clickHandler);
           */
  
          /* typescript
           * export declare const $event: {
           *     on(
           *         element: $safeEls.El,
           *         event: string,
           *         selector: string,
           *         handler: types.AnyFn
           *     ): void;
           *     on(element: $safeEls.El, event: string, handler: types.AnyFn): void;
           *     off(
           *         element: $safeEls.El,
           *         event: string,
           *         selector: string,
           *         handler: types.AnyFn
           *     ): void;
           *     off(element: $safeEls.El, event: string, handler: types.AnyFn): void;
           * };
           */
  
          /* dependencies
           * delegate isUndef $safeEls each types
           */
          exports = {
            on: eventFactory('add'),
            off: eventFactory('remove'),
          }
          function eventFactory(type) {
            return function (nodes, event, selector, handler) {
              nodes = $safeEls(nodes)
              if (isUndef(handler)) {
                handler = selector
                selector = undefined
              }
              each(nodes, function (node) {
                delegate[type](node, event, selector, handler)
              })
            }
          }
  
          return exports
        })({}))
  
        /* ------------------------------ some ------------------------------ */
  
        var some = (_licia.some = (function (exports) {
          /* Check if predicate return truthy for any element.
           *
           * |Name     |Desc                                          |
           * |---------|----------------------------------------------|
           * |obj      |Collection to iterate over                    |
           * |predicate|Function to invoked per iteration             |
           * |ctx      |Predicate context                             |
           * |return   |True if any element passes the predicate check|
           */
  
          /* example
           * some([2, 5], function(val) {
           *     return val % 2 === 0;
           * }); // -> true
           */
  
          /* typescript
           * export declare function some<T>(
           *     list: types.List<T>,
           *     iterator?: types.ListIterator<T, boolean>,
           *     context?: any
           * ): boolean;
           * export declare function some<T>(
           *     object: types.Dictionary<T>,
           *     iterator?: types.ObjectIterator<T, boolean>,
           *     context?: any
           * ): boolean;
           */
  
          /* dependencies
           * safeCb isArrLike keys types
           */
          exports = function (obj, predicate, ctx) {
            predicate = safeCb(predicate, ctx)
            var _keys = !isArrLike(obj) && keys(obj)
            var len = (_keys || obj).length
            for (var i = 0; i < len; i++) {
              var key = _keys ? _keys[i] : i
              if (predicate(obj[key], key, obj)) return true
            }
            return false
          }
  
          return exports
        })({}))
  
        /* ------------------------------ $class ------------------------------ */
  
        var $class = (_licia.$class = (function (exports) {
          /* Element class manipulations.
           *
           * ### add
           *
           * Add the specified class(es) to each element in the set of matched elements.
           *
           * |Name   |Desc                  |
           * |-------|----------------------|
           * |element|Elements to manipulate|
           * |names  |Classes to add        |
           *
           * ### has
           *
           * Determine whether any of the matched elements are assigned the given class.
           *
           * |Name   |Desc                                 |
           * |-------|-------------------------------------|
           * |element|Elements to manipulate               |
           * |name   |Class name                           |
           * |return |True if elements has given class name|
           *
           * ### toggle
           *
           * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the state argument.
           *
           * |Name   |Desc                  |
           * |-------|----------------------|
           * |element|Elements to manipulate|
           * |name   |Class name to toggle  |
           *
           * ### remove
           *
           * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
           *
           * |Name   |Desc                  |
           * |-------|----------------------|
           * |element|Elements to manipulate|
           * |name   |Class names to remove |
           */
  
          /* example
           * $class.add('#test', 'class1');
           * $class.add('#test', ['class1', 'class2']);
           * $class.has('#test', 'class1'); // -> true
           * $class.remove('#test', 'class1');
           * $class.has('#test', 'class1'); // -> false
           * $class.toggle('#test', 'class1');
           * $class.has('#test', 'class1'); // -> true
           */
  
          /* typescript
           * export declare const $class: {
           *     add(element: $safeEls.El, name: string | string[]): void;
           *     has(element: $safeEls.El, name: string): boolean;
           *     toggle(element: $safeEls.El, name: string): void;
           *     remove(element: $safeEls.El, name: string): void;
           * };
           */
  
          /* dependencies
           * toArr some $safeEls isStr each
           */
          exports = {
            add: function (els, name) {
              els = $safeEls(els)
              var names = safeName(name)
              each(els, function (el) {
                var classList = []
                each(names, function (name) {
                  if (!exports.has(el, name)) classList.push(name)
                })
                if (classList.length !== 0) {
                  el.className += (el.className ? ' ' : '') + classList.join(' ')
                }
              })
            },
            has: function (els, name) {
              els = $safeEls(els)
              var regName = new RegExp('(^|\\s)' + name + '(\\s|$)')
              return some(els, function (el) {
                return regName.test(el.className)
              })
            },
            toggle: function (els, name) {
              els = $safeEls(els)
              each(els, function (el) {
                if (!exports.has(el, name)) return exports.add(el, name)
                exports.remove(el, name)
              })
            },
            remove: function (els, name) {
              els = $safeEls(els)
              var names = safeName(name)
              each(els, function (el) {
                each(names, function (name) {
                  el.classList.remove(name)
                })
              })
            },
          }
          function safeName(name) {
            return isStr(name) ? name.split(/\s+/) : toArr(name)
          }
  
          return exports
        })({}))
  
        /* ------------------------------ $ ------------------------------ */
        _licia.$ = (function (exports) {
          /* jQuery like style dom manipulator.
           *
           * ### Available methods
           *
           * offset, hide, show, first, last, get, eq, on, off, html, text, val, css, attr,
           * data, rmAttr, remove, addClass, rmClass, toggleClass, hasClass, append, prepend,
           * before, after
           */
  
          /* example
           * const $btn = $('#btn');
           * $btn.html('eustia');
           * $btn.addClass('btn');
           * $btn.show();
           * $btn.on('click', function() {
           *     // Do something...
           * });
           */
  
          /* typescript
           * export declare namespace $ {
           *     class $ extends Select {
           *         find(selector: string): $;
           *         each(fn: types.AnyFn): $;
           *         offset(): $offset.IOffset;
           *         hide(): $;
           *         show(): $;
           *         first(): $;
           *         last(): $;
           *         get(index: number): Element;
           *         eq(index: number): $;
           *         on(event: string, selector: string, handler: types.AnyFn): $;
           *         on(event: string, handler: types.AnyFn): $;
           *         off(event: string, selector: string, handler: types.AnyFn): $;
           *         off(event: string, handler: types.AnyFn): $;
           *         html(): string;
           *         html(value: string): $;
           *         text(): string;
           *         text(value: string): $;
           *         val(): string;
           *         val(value: string): $;
           *         css(name: string): string;
           *         css(name: string, value: string): $;
           *         css(properties: types.PlainObj<string | number>): $;
           *         attr(name: string): string;
           *         attr(name: string, value: string): $;
           *         attr(attributes: types.PlainObj<string>): $;
           *         data(name: string): string;
           *         data(name: string, value: string): $;
           *         data(attributes: types.PlainObj<string>): $;
           *         rmAttr(name: string): $;
           *         remove(): $;
           *         addClass(name: string | string[]): $;
           *         rmClass(name: string): $;
           *         toggleClass(name: string): $;
           *         hasClass(name: string): boolean;
           *         parent(): $;
           *         append(content: string | Element): $;
           *         prepend(content: string | Element): $;
           *         before(content: string | Element): $;
           *         after(content: string | Element): $;
           *     }
           * }
           * declare function $(selector: string | Element | Document): $.$;
           */
  
          /* dependencies
           * Select $offset $show $css $attr $property last $remove $data $event $class $insert isUndef isStr types
           */
          exports = function (selector) {
            return new Select(selector)
          }
          Select.methods({
            offset: function () {
              return $offset(this)
            },
            hide: function () {
              return this.css('display', 'none')
            },
            show: function () {
              $show(this)
              return this
            },
            first: function () {
              return exports(this[0])
            },
            last: function () {
              return exports(last(this))
            },
            get: function (idx) {
              return this[idx]
            },
            eq: function (idx) {
              return exports(this[idx])
            },
            on: function (event, selector, handler) {
              $event.on(this, event, selector, handler)
              return this
            },
            off: function (event, selector, handler) {
              $event.off(this, event, selector, handler)
              return this
            },
            html: function (val) {
              var result = $property.html(this, val)
              if (isUndef(val)) return result
              return this
            },
            text: function (val) {
              var result = $property.text(this, val)
              if (isUndef(val)) return result
              return this
            },
            val: function (val) {
              var result = $property.val(this, val)
              if (isUndef(val)) return result
              return this
            },
            css: function (name, val) {
              var result = $css(this, name, val)
              if (isGetter(name, val)) return result
              return this
            },
            attr: function (name, val) {
              var result = $attr(this, name, val)
              if (isGetter(name, val)) return result
              return this
            },
            data: function (name, val) {
              var result = $data(this, name, val)
              if (isGetter(name, val)) return result
              return this
            },
            rmAttr: function (name) {
              $attr.remove(this, name)
              return this
            },
            remove: function () {
              $remove(this)
              return this
            },
            addClass: function (name) {
              $class.add(this, name)
              return this
            },
            rmClass: function (name) {
              $class.remove(this, name)
              return this
            },
            toggleClass: function (name) {
              $class.toggle(this, name)
              return this
            },
            hasClass: function (name) {
              return $class.has(this, name)
            },
            parent: function () {
              return exports(this[0].parentNode)
            },
            append: function (val) {
              $insert.append(this, val)
              return this
            },
            prepend: function (val) {
              $insert.prepend(this, val)
              return this
            },
            before: function (val) {
              $insert.before(this, val)
              return this
            },
            after: function (val) {
              $insert.after(this, val)
              return this
            },
          })
          var isGetter = function (name, val) {
            return isUndef(val) && isStr(name)
          }
  
          return exports
        })({})
  
        /* ------------------------------ h ------------------------------ */
        _licia.h = (function (exports) {
          /* Create html with JavaScript.
           *
           * |Name    |Desc           |
           * |--------|---------------|
           * |tag     |Tag name       |
           * |attrs   |Attributes     |
           * |...child|Children       |
           * |return  |Created element|
           */
  
          /* example
           * const el = h(
           *     'div#test.title',
           *     {
           *         onclick: function() {},
           *         title: 'test'
           *     },
           *     'inner text'
           * );
           * document.body.appendChild(el);
           */
  
          /* typescript
           * export declare function h(
           *     tag: string,
           *     attrs?: types.PlainObj<any>,
           *     ...child: Array<string | HTMLElement>
           * ): HTMLElement;
           */
  
          /* dependencies
           * isEl isStr startWith $class $css each isFn types
           */
          exports = function (tag, attrs) {
            for (
              var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2;
              _key < _len;
              _key++
            ) {
              children[_key - 2] = arguments[_key]
            }
            if (isEl(attrs) || isStr(attrs)) {
              children.unshift(attrs)
              attrs = null
            }
            if (!attrs) attrs = {}
            var _parseTag = parseTag(tag),
              tagName = _parseTag.tagName,
              id = _parseTag.id,
              classes = _parseTag.classes
            var el = document.createElement(tagName)
            if (id) el.setAttribute('id', id)
            $class.add(el, classes)
            each(children, function (child) {
              if (isStr(child)) {
                el.appendChild(document.createTextNode(child))
              } else if (isEl(child)) {
                el.appendChild(child)
              }
            })
            each(attrs, function (val, key) {
              if (isStr(val)) {
                el.setAttribute(key, val)
              } else if (isFn(val) && startWith(key, 'on')) {
                el.addEventListener(key.slice(2), val, false)
              } else if (key === 'style') {
                $css(el, val)
              }
            })
            return el
          }
          function parseTag(tag) {
            var tagName = 'div'
            var id = ''
            var classes = []
            var words = []
            var word = ''
            for (var i = 0, len = tag.length; i < len; i++) {
              var c = tag[i]
              if (c === '#' || c === '.') {
                words.push(word)
                word = c
              } else {
                word += c
              }
            }
            words.push(word)
            for (var _i = 0, _len2 = words.length; _i < _len2; _i++) {
              word = words[_i]
              if (!word) continue
              if (startWith(word, '#')) {
                id = word.slice(1)
              } else if (startWith(word, '.')) {
                classes.push(word.slice(1))
              } else {
                tagName = word
              }
            }
            return {
              tagName: tagName,
              id: id,
              classes: classes,
            }
          }
  
          return exports
        })({})
  
        /* ------------------------------ root ------------------------------ */
        _licia.root = (function (exports) {
          /* Root object reference, `global` in nodeJs, `window` in browser. */
  
          /* typescript
           * export declare const root: any;
           */
  
          /* dependencies
           * isBrowser
           */
          exports = isBrowser ? window : global
  
          return exports
        })({})
  
        /* ------------------------------ toBool ------------------------------ */
        _licia.toBool = (function (exports) {
          /* Convert value to a boolean.
           *
           * |Name  |Desc             |
           * |------|-----------------|
           * |val   |Value to convert |
           * |return|Converted boolean|
           */
  
          /* example
           * toBool(true); // -> true
           * toBool(null); // -> false
           * toBool(1); // -> true
           * toBool(0); // -> false
           * toBool('0'); // -> false
           * toBool('1'); // -> true
           * toBool('false'); // -> false
           */
  
          /* typescript
           * export declare function toBool(val: any): boolean;
           */
  
          /* dependencies
           * isStr
           */
          exports = function (val) {
            if (isStr(val)) {
              val = val.toLowerCase()
              return val !== '0' && val !== '' && val !== 'false'
            }
            return !!val
          }
  
          return exports
        })({})
  
        return _licia
      })
  
    let domHighlighter
    let highlightConfig
    let isCssLoaded = false
    let $container
    let isHighlighterInited = false
    const showInfo = _licia.cssSupports('clip-path', 'polygon(50% 0px, 0px 100%, 100% 100%)')
    const hasTouchSupport = 'ontouchstart' in _licia.root
  
    function initDomHighlighter() {
      if (isHighlighterInited) {
        return
      }
      let container = _licia.h('div', {
        class: '__chobitsu-hide__',
        style: {
          all: 'initial',
        },
      })
      $container = _licia.$(container)
      document.documentElement.appendChild(container)
  
      let domHighlighterContainer = null
      let shadowRoot = null
      if (container.attachShadow) {
        shadowRoot = container.attachShadow({ mode: 'open' })
      } else if (container.createShadowRoot) {
        shadowRoot = container.createShadowRoot()
      }
      if (shadowRoot) {
        if (typeof GM_getResourceText == 'undefined') {
          GM.getResourceText = GM_getResourceText = async function (aResourceName) {
            let res = await (await fetch(await GM.getResourceUrl(aResourceName))).text()
            let saveRes = await GM.getValue(aResourceName)
            if (typeof saveRes === 'undefined') {
              GM.setValue(aResourceName, res)
            } else {
              return saveRes
            }
            return res
          }
        }
  
        // console.log('111111111', GM.getResourceText);
        // console.log('222222222', GM_getResourceText);
  
        const css = GM_getResourceText('lunaDomHighlighterCSS').replace(
          '/*# sourceMappingURL=luna-dom-highlighter.css.map*/',
          ''
        )
  
        // console.log(css);
  
        const style = document.createElement('style')
        style.textContent = css
        style.type = 'text/css'
        shadowRoot.appendChild(style)
        domHighlighterContainer = document.createElement('div')
        shadowRoot.appendChild(domHighlighterContainer)
      } else {
        domHighlighterContainer = document.createElement('div')
        container.appendChild(domHighlighterContainer)
        if (!isCssLoaded) {
          _licia.evalCss(css)
          isCssLoaded = true
        }
      }
  
      highlightConfig = {
        showRulers: false,
        showExtensionLines: false,
        contrastAlgorithm: 'aa',
        showInfo: showInfo,
        showStyles: true,
        showAccessibilityInfo: false,
        colorFormat: 'hex',
        contentColor: 'rgba(111, 168, 220, .66)',
        paddingColor: 'rgba(147, 196, 125, .55)',
        borderColor: 'rgba(255, 229, 153, .66)',
        marginColor: 'rgba(246, 178, 107, .66)',
        monitorResize: _licia.toBool(_licia.root.ResizeObserver),
      }
      console.log(highlightConfig)
      domHighlighter = new LunaDomHighlighter(domHighlighterContainer, highlightConfig)
  
      window.addEventListener('resize', resizeHandler)
  
      isHighlighterInited = true
    }
  
    const viewportSize = _licia.h('div', {
      class: '__chobitsu-hide__',
      style: {
        position: 'fixed',
        right: 0,
        top: 0,
        background: '#fff',
        fontSize: 13,
        opacity: 0.5,
        padding: '4px 6px',
      },
    })
    let showViewportSizeOnResize = false
  
    function resizeHandler() {
      if (!showViewportSizeOnResize) return
  
      $viewportSize.text(`${window.innerWidth}px × ${window.innerHeight}px`)
      if (viewportSizeTimer) {
        clearTimeout(viewportSizeTimer)
      } else {
        document.documentElement.appendChild(viewportSize)
      }
      viewportSizeTimer = setTimeout(() => {
        $viewportSize.remove()
        viewportSizeTimer = null
      }, 1000)
    }
    const $viewportSize = _licia.$(viewportSize)
    let viewportSizeTimer
  
    function getElementFromPoint(e) {
      if (hasTouchSupport) {
        const touch = e.touches[0] || e.changedTouches[0]
        return document.elementFromPoint(touch.clientX, touch.clientY)
      }
  
      return document.elementFromPoint(e.clientX, e.clientY)
    }
  
    function isValidNode(node) {
      if (node.nodeType === 1) {
        const className = node.getAttribute('class') || ''
        if (
          _licia.contain(className, '__chobitsu-hide__') ||
          _licia.contain(className, 'html2canvas-container')
        ) {
          return false
        }
      }
  
      const isValid = !(node.nodeType === 3 && trim(node.nodeValue || '') === '')
      if (isValid && node.parentNode) {
        return isValidNode(node.parentNode)
      }
  
      return isValid
    }
  
    function moveListener(e) {
      const node = getElementFromPoint(e)
      if (!node || !isValidNode(node)) {
        return
      }
      if (node.nodeType !== 1 && node.nodeType !== 3) return
  
      _licia.defaults(highlightConfig, {
        contentColor: 'transparent',
        paddingColor: 'transparent',
        borderColor: 'transparent',
        marginColor: 'transparent',
      })
      if (!showInfo) {
        _licia.extend(highlightConfig, {
          showInfo: false,
        })
      }
      domHighlighter.highlight(node, highlightConfig)
    }
  
    function outListener() {
      domHighlighter.hide()
    }
  
    function clicklistener(event) {
      console.log(event.target)
  
      window.disableHighlight()
  
      $('#cancelhtml2canvas').text('正在生成截图...')
  
      html2canvas(event.target, { scale: 3, allowTaint: true, useCORS: true }).then((canvas) => {
        canvas.toBlob(function (blob) {
          let url = window.URL.createObjectURL(blob)
          window.open(url)
          setTimeout(() => {
            document.onkeydown = window.keydown_listener
          }, 0);
          $('#tryhtml2canvas').show()
          $('#cancelhtml2canvas').hide()
        })
      })
    }
  
    function addEvent(type, listener) {
      document.documentElement.addEventListener(type, listener, true)
    }
  
    function removeEvent(type, listener) {
      document.documentElement.removeEventListener(type, listener, true)
    }
  
    window.enableHighlight = function () {
      initDomHighlighter()
      addEvent('mousemove', moveListener)
      addEvent('mouseout', outListener)
      addEvent('click', clicklistener)
    }
  
    window.disableHighlight = function () {
      if (isHighlighterInited) {
        domHighlighter.destroy()
        $container.remove()
        window.removeEventListener('resize', resizeHandler)
        removeEvent('mousemove', moveListener)
        removeEvent('mouseout', outListener)
        removeEvent('click', clicklistener)
        isHighlighterInited = false
      }
    }
  
    window.captureHTML = () => {
      console.log('captureHTML...')
  
      // let handle = (event) => {
      //   document.querySelector('html').removeEventListener('click', handle)
      //   console.log(event.target)
  
      //   html2canvas(event.target, { scale: 3, allowTaint: true, useCORS: true }).then((canvas) => {
      //     canvas.toBlob(function (blob) {
      //       let url = window.URL.createObjectURL(blob)
      //       window.open(url)
  
      //       $('#tryhtml2canvas').show()
      //     })
      //   })
      // }
  
      // setTimeout(() => {
      //   document.querySelector('html').addEventListener('click', handle)
      // }, 0)
  
      setTimeout(() => {
        window.keydown_listener = document.onkeydown
        document.onkeydown = (e) => {
          let keyNum = window.event ? e.keyCode : e.which
          console.log('按键:', keyNum)
          if (keyNum === 27) {
            window.disableHighlight()
            setTimeout(() => {
              document.onkeydown = window.keydown_listener
            }, 0);
            $('#tryhtml2canvas').show()
            $('#cancelhtml2canvas').hide()
          }
        }
        window.enableHighlight()
      }, 0)
  
      $('#cancelhtml2canvas').text('按 ESC 取消截图')
      $('#cancelhtml2canvas').show()
      $('#tryhtml2canvas').hide()
    }
  
    let capturediv = document.createElement('div')
    capturediv.innerHTML = `
    <div id="tryhtml2canvas"
      style="background-image: linear-gradient(0deg, #558b2f, #7cb342);cursor: pointer; opacity: 0.7; position: fixed;display: flex;bottom: 40px;right: 40px;z-index: 100001;width: 50px;height: 50px;border-radius: 50%;box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);-webkit-box-pack: center;-webkit-justify-content: center;-webkit-box-align: center;-webkit-align-items: center;">
      <div style="overflow: hidden;">
        <img
          src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmZmZmIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMuMiIvPgogICAgPHBhdGggZD0iTTkgMkw3LjE3IDRINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNmMxLjEgMCAyLS45IDItMlY2YzAtMS4xLS45LTItMi0yaC0zLjE3TDE1IDJIOXptMyAxNWMtMi43NiAwLTUtMi4yNC01LTVzMi4yNC01IDUtNSA1IDIuMjQgNSA1LTIuMjQgNS01IDV6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo="
          alt="Try html2canvas" style="transform: translateX(-210px); filter: drop-shadow(210px 0 0 black);">
      </div>
    </div>
    `
    document.body.appendChild(capturediv)
  
    let canceldiv = document.createElement('div')
    canceldiv.innerHTML = `
    <div id="cancelhtml2canvas"
      style="background-color: rgba(170, 170, 170, 0.8); cursor: pointer; position: fixed; display: none; bottom: 40px; right: 40px; z-index: 100001; padding: 10px; font-size: 20px; color: darkred; box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px, rgba(0, 0, 0, 0.2) 0px 3px 1px -2px; -webkit-box-pack: center; justify-content: center; -webkit-box-align: center; align-items: center;">
      <div style="overflow: hidden;">按 ESC 取消截图</div>
    </div>
    `
    document.body.appendChild(canceldiv)
  
    let tryhtml2canvasE = capturediv.querySelector('#tryhtml2canvas')
    tryhtml2canvasE.onmouseenter = () => {
      tryhtml2canvasE.style.opacity = 1
    }
    tryhtml2canvasE.onmouseleave = () => {
      tryhtml2canvasE.style.opacity = 0.7
    }
  
    let isDragging = false
    let startX, startY, offsetX, offsetY
  
    const onMouseMove = (event) => {
      if (!isDragging) return
      console.log("onMouseMove")
      const currentX = event.clientX
      const currentY = event.clientY
      const dx = currentX - startX
      const dy = currentY - startY
  
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        tryhtml2canvasE.style.left = `${currentX - offsetX}px`
        tryhtml2canvasE.style.top = `${currentY - offsetY}px`
        tryhtml2canvasE.removeEventListener('click', window.captureHTML)
      }
    }
  
    const onMouseDown = (event) => {
      console.log("onMouseDown")
      isDragging = true
      startX = event.clientX
      startY = event.clientY
      offsetX = startX - tryhtml2canvasE.getBoundingClientRect().left
      offsetY = startY - tryhtml2canvasE.getBoundingClientRect().top
      tryhtml2canvasE.style.cursor = 'grabbing'
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
  
    const onMouseUp = (event) => {
      if (isDragging) {
        console.log("onMouseUp")
        isDragging = false
        tryhtml2canvasE.style.cursor = 'pointer'
        setTimeout(() => {
          tryhtml2canvasE.addEventListener('click', window.captureHTML)
        }, 0);
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }
    }
  
    tryhtml2canvasE.addEventListener('mousedown', onMouseDown)
    tryhtml2canvasE.addEventListener('click', window.captureHTML)
  })()
  