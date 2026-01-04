// ==UserScript==
// @name          cypress-visibility
// @namespace     flomk.userscripts
// @version       1.4
// @description   Code - github/cypress-io/cypress - to check if an element is visible
// @author        flomk
// @grant         none
// @include       *
// @connect       unpkg.com
// ==/UserScript==

((global, factory) => {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    factory(global.cypressVisibility={});
})(this, exports => {
    const _ = function (exports) {
        'use strict';

        function isObject(value) {
            var type = typeof value;
            return value != null && (type == 'object' || type == 'function');
        }
        var objectCreate = Object.create;
        var baseCreate = function () {
            function object() {}
            return function (proto) {
                if (!isObject(proto)) {
                    return {};
                }
                if (objectCreate) {
                    return objectCreate(proto);
                }
                object.prototype = proto;
                var result = new object();
                object.prototype = undefined;
                return result;
            };
        }();
        function baseLodash() {}
        var MAX_ARRAY_LENGTH = 4294967295;
        function LazyWrapper(value) {
            this.__wrapped__ = value;
            this.__actions__ = [];
            this.__dir__ = 1;
            this.__filtered__ = false;
            this.__iteratees__ = [];
            this.__takeCount__ = MAX_ARRAY_LENGTH;
            this.__views__ = [];
        }
        LazyWrapper.prototype = baseCreate(baseLodash.prototype);
        LazyWrapper.prototype.constructor = LazyWrapper;
        function LodashWrapper(value, chainAll) {
            this.__wrapped__ = value;
            this.__actions__ = [];
            this.__chain__ = !!chainAll;
            this.__index__ = 0;
            this.__values__ = undefined;
        }
        LodashWrapper.prototype = baseCreate(baseLodash.prototype);
        LodashWrapper.prototype.constructor = LodashWrapper;
        var isArray = Array.isArray;
        function isObjectLike(value) {
            return value != null && typeof value == 'object';
        }
        function copyArray(source, array) {
            var index = -1,
                length = source.length;
            array || (array = Array(length));
            while (++index < length) {
                array[index] = source[index];
            }
            return array;
        }
        function wrapperClone(wrapper) {
            if (wrapper instanceof LazyWrapper) {
                return wrapper.clone();
            }
            var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
            result.__actions__ = copyArray(wrapper.__actions__);
            result.__index__ = wrapper.__index__;
            result.__values__ = wrapper.__values__;
            return result;
        }
        var objectProto$e = Object.prototype;
        var hasOwnProperty$b = objectProto$e.hasOwnProperty;
        function lodash(value) {
            if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
                if (value instanceof LodashWrapper) {
                    return value;
                }
                if (hasOwnProperty$b.call(value, '__wrapped__')) {
                    return wrapperClone(value);
                }
            }
            return new LodashWrapper(value);
        }
        lodash.prototype = baseLodash.prototype;
        lodash.prototype.constructor = lodash;
        function chain(value) {
            var result = lodash(value);
            result.__chain__ = true;
            return result;
        }
        function listCacheClear() {
            this.__data__ = [];
            this.size = 0;
        }
        function eq(value, other) {
            return value === other || value !== value && other !== other;
        }
        function assocIndexOf(array, key) {
            var length = array.length;
            while (length--) {
                if (eq(array[length][0], key)) {
                    return length;
                }
            }
            return -1;
        }
        var arrayProto = Array.prototype;
        var splice = arrayProto.splice;
        function listCacheDelete(key) {
            var data = this.__data__,
                index = assocIndexOf(data, key);
            if (index < 0) {
                return false;
            }
            var lastIndex = data.length - 1;
            if (index == lastIndex) {
                data.pop();
            } else {
                splice.call(data, index, 1);
            }
            --this.size;
            return true;
        }
        function listCacheGet(key) {
            var data = this.__data__,
                index = assocIndexOf(data, key);
            return index < 0 ? undefined : data[index][1];
        }
        function listCacheHas(key) {
            return assocIndexOf(this.__data__, key) > -1;
        }
        function listCacheSet(key, value) {
            var data = this.__data__,
                index = assocIndexOf(data, key);
            if (index < 0) {
                ++this.size;
                data.push([key, value]);
            } else {
                data[index][1] = value;
            }
            return this;
        }
        function ListCache(entries) {
            var index = -1,
                length = entries == null ? 0 : entries.length;
            this.clear();
            while (++index < length) {
                var entry = entries[index];
                this.set(entry[0], entry[1]);
            }
        }
        ListCache.prototype.clear = listCacheClear;
        ListCache.prototype['delete'] = listCacheDelete;
        ListCache.prototype.get = listCacheGet;
        ListCache.prototype.has = listCacheHas;
        ListCache.prototype.set = listCacheSet;
        function stackClear() {
            this.__data__ = new ListCache();
            this.size = 0;
        }
        function stackDelete(key) {
            var data = this.__data__,
                result = data['delete'](key);
            this.size = data.size;
            return result;
        }
        function stackGet(key) {
            return this.__data__.get(key);
        }
        function stackHas(key) {
            return this.__data__.has(key);
        }
        var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
        var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
        var root = freeGlobal || freeSelf || Function('return this')();
        var Symbol = root.Symbol;
        var objectProto$d = Object.prototype;
        var hasOwnProperty$a = objectProto$d.hasOwnProperty;
        var nativeObjectToString$1 = objectProto$d.toString;
        var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;
        function getRawTag(value) {
            var isOwn = hasOwnProperty$a.call(value, symToStringTag$1),
                tag = value[symToStringTag$1];
            try {
                value[symToStringTag$1] = undefined;
                var unmasked = true;
            } catch (e) {}
            var result = nativeObjectToString$1.call(value);
            if (unmasked) {
                if (isOwn) {
                    value[symToStringTag$1] = tag;
                } else {
                    delete value[symToStringTag$1];
                }
            }
            return result;
        }
        var objectProto$c = Object.prototype;
        var nativeObjectToString = objectProto$c.toString;
        function objectToString(value) {
            return nativeObjectToString.call(value);
        }
        var nullTag = '[object Null]',
            undefinedTag = '[object Undefined]';
        var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
        function baseGetTag(value) {
            if (value == null) {
                return value === undefined ? undefinedTag : nullTag;
            }
            return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
        }
        var asyncTag = '[object AsyncFunction]',
            funcTag$1 = '[object Function]',
            genTag = '[object GeneratorFunction]',
            proxyTag = '[object Proxy]';
        function isFunction(value) {
            if (!isObject(value)) {
                return false;
            }
            var tag = baseGetTag(value);
            return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
        }
        var coreJsData = root['__core-js_shared__'];
        var maskSrcKey = function () {
            var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
            return uid ? 'Symbol(src)_1.' + uid : '';
        }();
        function isMasked(func) {
            return !!maskSrcKey && maskSrcKey in func;
        }
        var funcProto$2 = Function.prototype;
        var funcToString$2 = funcProto$2.toString;
        function toSource(func) {
            if (func != null) {
                try {
                    return funcToString$2.call(func);
                } catch (e) {}
                try {
                    return func + '';
                } catch (e) {}
            }
            return '';
        }
        var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
        var reIsHostCtor = /^\[object .+?Constructor\]$/;
        var funcProto$1 = Function.prototype,
            objectProto$b = Object.prototype;
        var funcToString$1 = funcProto$1.toString;
        var hasOwnProperty$9 = objectProto$b.hasOwnProperty;
        var reIsNative = RegExp('^' + funcToString$1.call(hasOwnProperty$9).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
        function baseIsNative(value) {
            if (!isObject(value) || isMasked(value)) {
                return false;
            }
            var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
            return pattern.test(toSource(value));
        }
        function getValue(object, key) {
            return object == null ? undefined : object[key];
        }
        function getNative(object, key) {
            var value = getValue(object, key);
            return baseIsNative(value) ? value : undefined;
        }
        var Map = getNative(root, 'Map');
        var nativeCreate = getNative(Object, 'create');
        function hashClear() {
            this.__data__ = nativeCreate ? nativeCreate(null) : {};
            this.size = 0;
        }
        function hashDelete(key) {
            var result = this.has(key) && delete this.__data__[key];
            this.size -= result ? 1 : 0;
            return result;
        }
        var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';
        var objectProto$a = Object.prototype;
        var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
        function hashGet(key) {
            var data = this.__data__;
            if (nativeCreate) {
                var result = data[key];
                return result === HASH_UNDEFINED$2 ? undefined : result;
            }
            return hasOwnProperty$8.call(data, key) ? data[key] : undefined;
        }
        var objectProto$9 = Object.prototype;
        var hasOwnProperty$7 = objectProto$9.hasOwnProperty;
        function hashHas(key) {
            var data = this.__data__;
            return nativeCreate ? data[key] !== undefined : hasOwnProperty$7.call(data, key);
        }
        var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';
        function hashSet(key, value) {
            var data = this.__data__;
            this.size += this.has(key) ? 0 : 1;
            data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED$1 : value;
            return this;
        }
        function Hash(entries) {
            var index = -1,
                length = entries == null ? 0 : entries.length;
            this.clear();
            while (++index < length) {
                var entry = entries[index];
                this.set(entry[0], entry[1]);
            }
        }
        Hash.prototype.clear = hashClear;
        Hash.prototype['delete'] = hashDelete;
        Hash.prototype.get = hashGet;
        Hash.prototype.has = hashHas;
        Hash.prototype.set = hashSet;
        function mapCacheClear() {
            this.size = 0;
            this.__data__ = {
                'hash': new Hash(),
                'map': new (Map || ListCache)(),
                'string': new Hash()
            };
        }
        function isKeyable(value) {
            var type = typeof value;
            return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
        }
        function getMapData(map, key) {
            var data = map.__data__;
            return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
        }
        function mapCacheDelete(key) {
            var result = getMapData(this, key)['delete'](key);
            this.size -= result ? 1 : 0;
            return result;
        }
        function mapCacheGet(key) {
            return getMapData(this, key).get(key);
        }
        function mapCacheHas(key) {
            return getMapData(this, key).has(key);
        }
        function mapCacheSet(key, value) {
            var data = getMapData(this, key),
                size = data.size;
            data.set(key, value);
            this.size += data.size == size ? 0 : 1;
            return this;
        }
        function MapCache(entries) {
            var index = -1,
                length = entries == null ? 0 : entries.length;
            this.clear();
            while (++index < length) {
                var entry = entries[index];
                this.set(entry[0], entry[1]);
            }
        }
        MapCache.prototype.clear = mapCacheClear;
        MapCache.prototype['delete'] = mapCacheDelete;
        MapCache.prototype.get = mapCacheGet;
        MapCache.prototype.has = mapCacheHas;
        MapCache.prototype.set = mapCacheSet;
        var LARGE_ARRAY_SIZE = 200;
        function stackSet(key, value) {
            var data = this.__data__;
            if (data instanceof ListCache) {
                var pairs = data.__data__;
                if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
                    pairs.push([key, value]);
                    this.size = ++data.size;
                    return this;
                }
                data = this.__data__ = new MapCache(pairs);
            }
            data.set(key, value);
            this.size = data.size;
            return this;
        }
        function Stack(entries) {
            var data = this.__data__ = new ListCache(entries);
            this.size = data.size;
        }
        Stack.prototype.clear = stackClear;
        Stack.prototype['delete'] = stackDelete;
        Stack.prototype.get = stackGet;
        Stack.prototype.has = stackHas;
        Stack.prototype.set = stackSet;
        var HASH_UNDEFINED = '__lodash_hash_undefined__';
        function setCacheAdd(value) {
            this.__data__.set(value, HASH_UNDEFINED);
            return this;
        }
        function setCacheHas(value) {
            return this.__data__.has(value);
        }
        function SetCache(values) {
            var index = -1,
                length = values == null ? 0 : values.length;
            this.__data__ = new MapCache();
            while (++index < length) {
                this.add(values[index]);
            }
        }
        SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
        SetCache.prototype.has = setCacheHas;
        function arraySome(array, predicate) {
            var index = -1,
                length = array == null ? 0 : array.length;
            while (++index < length) {
                if (predicate(array[index], index, array)) {
                    return true;
                }
            }
            return false;
        }
        function cacheHas(cache, key) {
            return cache.has(key);
        }
        var COMPARE_PARTIAL_FLAG$5 = 1,
            COMPARE_UNORDERED_FLAG$3 = 2;
        function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5,
                arrLength = array.length,
                othLength = other.length;
            if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
                return false;
            }
            var arrStacked = stack.get(array);
            var othStacked = stack.get(other);
            if (arrStacked && othStacked) {
                return arrStacked == other && othStacked == array;
            }
            var index = -1,
                result = true,
                seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : undefined;
            stack.set(array, other);
            stack.set(other, array);
            while (++index < arrLength) {
                var arrValue = array[index],
                    othValue = other[index];
                if (customizer) {
                    var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
                }
                if (compared !== undefined) {
                    if (compared) {
                        continue;
                    }
                    result = false;
                    break;
                }
                if (seen) {
                    if (!arraySome(other, function (othValue, othIndex) {
                        if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                            return seen.push(othIndex);
                        }
                    })) {
                        result = false;
                        break;
                    }
                } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                    result = false;
                    break;
                }
            }
            stack['delete'](array);
            stack['delete'](other);
            return result;
        }
        var Uint8Array = root.Uint8Array;
        function mapToArray(map) {
            var index = -1,
                result = Array(map.size);
            map.forEach(function (value, key) {
                result[++index] = [key, value];
            });
            return result;
        }
        function setToArray(set) {
            var index = -1,
                result = Array(set.size);
            set.forEach(function (value) {
                result[++index] = value;
            });
            return result;
        }
        var COMPARE_PARTIAL_FLAG$4 = 1,
            COMPARE_UNORDERED_FLAG$2 = 2;
        var boolTag$1 = '[object Boolean]',
            dateTag$1 = '[object Date]',
            errorTag$1 = '[object Error]',
            mapTag$2 = '[object Map]',
            numberTag$1 = '[object Number]',
            regexpTag$1 = '[object RegExp]',
            setTag$2 = '[object Set]',
            stringTag$2 = '[object String]',
            symbolTag$1 = '[object Symbol]';
        var arrayBufferTag$1 = '[object ArrayBuffer]',
            dataViewTag$2 = '[object DataView]';
        var symbolProto$1 = Symbol ? Symbol.prototype : undefined,
            symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;
        function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
            switch (tag) {
                case dataViewTag$2:
                    if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
                        return false;
                    }
                    object = object.buffer;
                    other = other.buffer;
                case arrayBufferTag$1:
                    if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
                        return false;
                    }
                    return true;
                case boolTag$1:
                case dateTag$1:
                case numberTag$1:
                    return eq(+object, +other);
                case errorTag$1:
                    return object.name == other.name && object.message == other.message;
                case regexpTag$1:
                case stringTag$2:
                    return object == other + '';
                case mapTag$2:
                    var convert = mapToArray;
                case setTag$2:
                    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
                    convert || (convert = setToArray);
                    if (object.size != other.size && !isPartial) {
                        return false;
                    }
                    var stacked = stack.get(object);
                    if (stacked) {
                        return stacked == other;
                    }
                    bitmask |= COMPARE_UNORDERED_FLAG$2;
                    stack.set(object, other);
                    var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
                    stack['delete'](object);
                    return result;
                case symbolTag$1:
                    if (symbolValueOf) {
                        return symbolValueOf.call(object) == symbolValueOf.call(other);
                    }
            }
            return false;
        }
        function arrayPush(array, values) {
            var index = -1,
                length = values.length,
                offset = array.length;
            while (++index < length) {
                array[offset + index] = values[index];
            }
            return array;
        }
        function baseGetAllKeys(object, keysFunc, symbolsFunc) {
            var result = keysFunc(object);
            return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
        }
        function arrayFilter(array, predicate) {
            var index = -1,
                length = array == null ? 0 : array.length,
                resIndex = 0,
                result = [];
            while (++index < length) {
                var value = array[index];
                if (predicate(value, index, array)) {
                    result[resIndex++] = value;
                }
            }
            return result;
        }
        function stubArray() {
            return [];
        }
        var objectProto$8 = Object.prototype;
        var propertyIsEnumerable$1 = objectProto$8.propertyIsEnumerable;
        var nativeGetSymbols = Object.getOwnPropertySymbols;
        var getSymbols = !nativeGetSymbols ? stubArray : function (object) {
            if (object == null) {
                return [];
            }
            object = Object(object);
            return arrayFilter(nativeGetSymbols(object), function (symbol) {
                return propertyIsEnumerable$1.call(object, symbol);
            });
        };
        function baseTimes(n, iteratee) {
            var index = -1,
                result = Array(n);
            while (++index < n) {
                result[index] = iteratee(index);
            }
            return result;
        }
        var argsTag$2 = '[object Arguments]';
        function baseIsArguments(value) {
            return isObjectLike(value) && baseGetTag(value) == argsTag$2;
        }
        var objectProto$7 = Object.prototype;
        var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
        var propertyIsEnumerable = objectProto$7.propertyIsEnumerable;
        var isArguments = baseIsArguments(function () {
            return arguments;
        }()) ? baseIsArguments : function (value) {
            return isObjectLike(value) && hasOwnProperty$6.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
        };
        function stubFalse() {
            return false;
        }
        var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;
        var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;
        var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
        var Buffer = moduleExports$1 ? root.Buffer : undefined;
        var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
        var isBuffer = nativeIsBuffer || stubFalse;
        var MAX_SAFE_INTEGER$1 = 9007199254740991;
        var reIsUint = /^(?:0|[1-9]\d*)$/;
        function isIndex(value, length) {
            var type = typeof value;
            length = length == null ? MAX_SAFE_INTEGER$1 : length;
            return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
        }
        var MAX_SAFE_INTEGER = 9007199254740991;
        function isLength(value) {
            return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
        }
        var argsTag$1 = '[object Arguments]',
            arrayTag$1 = '[object Array]',
            boolTag = '[object Boolean]',
            dateTag = '[object Date]',
            errorTag = '[object Error]',
            funcTag = '[object Function]',
            mapTag$1 = '[object Map]',
            numberTag = '[object Number]',
            objectTag$3 = '[object Object]',
            regexpTag = '[object RegExp]',
            setTag$1 = '[object Set]',
            stringTag$1 = '[object String]',
            weakMapTag$1 = '[object WeakMap]';
        var arrayBufferTag = '[object ArrayBuffer]',
            dataViewTag$1 = '[object DataView]',
            float32Tag = '[object Float32Array]',
            float64Tag = '[object Float64Array]',
            int8Tag = '[object Int8Array]',
            int16Tag = '[object Int16Array]',
            int32Tag = '[object Int32Array]',
            uint8Tag = '[object Uint8Array]',
            uint8ClampedTag = '[object Uint8ClampedArray]',
            uint16Tag = '[object Uint16Array]',
            uint32Tag = '[object Uint32Array]';
        var typedArrayTags = {};
        typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
        typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag$1] = typedArrayTags[numberTag] = typedArrayTags[objectTag$3] = typedArrayTags[regexpTag] = typedArrayTags[setTag$1] = typedArrayTags[stringTag$1] = typedArrayTags[weakMapTag$1] = false;
        function baseIsTypedArray(value) {
            return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
        }
        function baseUnary(func) {
            return function (value) {
                return func(value);
            };
        }
        var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
        var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
        var moduleExports = freeModule && freeModule.exports === freeExports;
        var freeProcess = moduleExports && freeGlobal.process;
        var nodeUtil = function () {
            try {
                var types = freeModule && freeModule.require && freeModule.require('util').types;
                if (types) {
                    return types;
                }
                return freeProcess && freeProcess.binding && freeProcess.binding('util');
            } catch (e) {}
        }();
        var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
        var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
        var objectProto$6 = Object.prototype;
        var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
        function arrayLikeKeys(value, inherited) {
            var isArr = isArray(value),
                isArg = !isArr && isArguments(value),
                isBuff = !isArr && !isArg && isBuffer(value),
                isType = !isArr && !isArg && !isBuff && isTypedArray(value),
                skipIndexes = isArr || isArg || isBuff || isType,
                result = skipIndexes ? baseTimes(value.length, String) : [],
                length = result.length;
            for (var key in value) {
                if ((inherited || hasOwnProperty$5.call(value, key)) && !(skipIndexes && (key == 'length' || isBuff && (key == 'offset' || key == 'parent') || isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || isIndex(key, length)))) {
                    result.push(key);
                }
            }
            return result;
        }
        var objectProto$5 = Object.prototype;
        function isPrototype(value) {
            var Ctor = value && value.constructor,
                proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$5;
            return value === proto;
        }
        function overArg(func, transform) {
            return function (arg) {
                return func(transform(arg));
            };
        }
        var nativeKeys = overArg(Object.keys, Object);
        var objectProto$4 = Object.prototype;
        var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
        function baseKeys(object) {
            if (!isPrototype(object)) {
                return nativeKeys(object);
            }
            var result = [];
            for (var key in Object(object)) {
                if (hasOwnProperty$4.call(object, key) && key != 'constructor') {
                    result.push(key);
                }
            }
            return result;
        }
        function isArrayLike(value) {
            return value != null && isLength(value.length) && !isFunction(value);
        }
        function keys(object) {
            return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
        }
        function getAllKeys(object) {
            return baseGetAllKeys(object, keys, getSymbols);
        }
        var COMPARE_PARTIAL_FLAG$3 = 1;
        var objectProto$3 = Object.prototype;
        var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
        function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3,
                objProps = getAllKeys(object),
                objLength = objProps.length,
                othProps = getAllKeys(other),
                othLength = othProps.length;
            if (objLength != othLength && !isPartial) {
                return false;
            }
            var index = objLength;
            while (index--) {
                var key = objProps[index];
                if (!(isPartial ? key in other : hasOwnProperty$3.call(other, key))) {
                    return false;
                }
            }
            var objStacked = stack.get(object);
            var othStacked = stack.get(other);
            if (objStacked && othStacked) {
                return objStacked == other && othStacked == object;
            }
            var result = true;
            stack.set(object, other);
            stack.set(other, object);
            var skipCtor = isPartial;
            while (++index < objLength) {
                key = objProps[index];
                var objValue = object[key],
                    othValue = other[key];
                if (customizer) {
                    var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
                }
                if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
                    result = false;
                    break;
                }
                skipCtor || (skipCtor = key == 'constructor');
            }
            if (result && !skipCtor) {
                var objCtor = object.constructor,
                    othCtor = other.constructor;
                if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
                    result = false;
                }
            }
            stack['delete'](object);
            stack['delete'](other);
            return result;
        }
        var DataView = getNative(root, 'DataView');
        var Promise$1 = getNative(root, 'Promise');
        var Set = getNative(root, 'Set');
        var WeakMap = getNative(root, 'WeakMap');
        var mapTag = '[object Map]',
            objectTag$2 = '[object Object]',
            promiseTag = '[object Promise]',
            setTag = '[object Set]',
            weakMapTag = '[object WeakMap]';
        var dataViewTag = '[object DataView]';
        var dataViewCtorString = toSource(DataView),
            mapCtorString = toSource(Map),
            promiseCtorString = toSource(Promise$1),
            setCtorString = toSource(Set),
            weakMapCtorString = toSource(WeakMap);
        var getTag = baseGetTag;
        if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
            getTag = function (value) {
                var result = baseGetTag(value),
                    Ctor = result == objectTag$2 ? value.constructor : undefined,
                    ctorString = Ctor ? toSource(Ctor) : '';
                if (ctorString) {
                    switch (ctorString) {
                        case dataViewCtorString:
                            return dataViewTag;
                        case mapCtorString:
                            return mapTag;
                        case promiseCtorString:
                            return promiseTag;
                        case setCtorString:
                            return setTag;
                        case weakMapCtorString:
                            return weakMapTag;
                    }
                }
                return result;
            };
        }
        var getTag$1 = getTag;
        var COMPARE_PARTIAL_FLAG$2 = 1;
        var argsTag = '[object Arguments]',
            arrayTag = '[object Array]',
            objectTag$1 = '[object Object]';
        var objectProto$2 = Object.prototype;
        var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
        function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
            var objIsArr = isArray(object),
                othIsArr = isArray(other),
                objTag = objIsArr ? arrayTag : getTag$1(object),
                othTag = othIsArr ? arrayTag : getTag$1(other);
            objTag = objTag == argsTag ? objectTag$1 : objTag;
            othTag = othTag == argsTag ? objectTag$1 : othTag;
            var objIsObj = objTag == objectTag$1,
                othIsObj = othTag == objectTag$1,
                isSameTag = objTag == othTag;
            if (isSameTag && isBuffer(object)) {
                if (!isBuffer(other)) {
                    return false;
                }
                objIsArr = true;
                objIsObj = false;
            }
            if (isSameTag && !objIsObj) {
                stack || (stack = new Stack());
                return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
            }
            if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
                var objIsWrapped = objIsObj && hasOwnProperty$2.call(object, '__wrapped__'),
                    othIsWrapped = othIsObj && hasOwnProperty$2.call(other, '__wrapped__');
                if (objIsWrapped || othIsWrapped) {
                    var objUnwrapped = objIsWrapped ? object.value() : object,
                        othUnwrapped = othIsWrapped ? other.value() : other;
                    stack || (stack = new Stack());
                    return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
                }
            }
            if (!isSameTag) {
                return false;
            }
            stack || (stack = new Stack());
            return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
        }
        function baseIsEqual(value, other, bitmask, customizer, stack) {
            if (value === other) {
                return true;
            }
            if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
                return value !== value && other !== other;
            }
            return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
        }
        var COMPARE_PARTIAL_FLAG$1 = 1,
            COMPARE_UNORDERED_FLAG$1 = 2;
        function baseIsMatch(object, source, matchData, customizer) {
            var index = matchData.length,
                length = index,
                noCustomizer = !customizer;
            if (object == null) {
                return !length;
            }
            object = Object(object);
            while (index--) {
                var data = matchData[index];
                if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
                    return false;
                }
            }
            while (++index < length) {
                data = matchData[index];
                var key = data[0],
                    objValue = object[key],
                    srcValue = data[1];
                if (noCustomizer && data[2]) {
                    if (objValue === undefined && !(key in object)) {
                        return false;
                    }
                } else {
                    var stack = new Stack();
                    if (customizer) {
                        var result = customizer(objValue, srcValue, key, object, source, stack);
                    }
                    if (!(result === undefined ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) {
                        return false;
                    }
                }
            }
            return true;
        }
        function isStrictComparable(value) {
            return value === value && !isObject(value);
        }
        function getMatchData(object) {
            var result = keys(object),
                length = result.length;
            while (length--) {
                var key = result[length],
                    value = object[key];
                result[length] = [key, value, isStrictComparable(value)];
            }
            return result;
        }
        function matchesStrictComparable(key, srcValue) {
            return function (object) {
                if (object == null) {
                    return false;
                }
                return object[key] === srcValue && (srcValue !== undefined || key in Object(object));
            };
        }
        function baseMatches(source) {
            var matchData = getMatchData(source);
            if (matchData.length == 1 && matchData[0][2]) {
                return matchesStrictComparable(matchData[0][0], matchData[0][1]);
            }
            return function (object) {
                return object === source || baseIsMatch(object, source, matchData);
            };
        }
        var symbolTag = '[object Symbol]';
        function isSymbol(value) {
            return typeof value == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
        }
        var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
            reIsPlainProp = /^\w*$/;
        function isKey(value, object) {
            if (isArray(value)) {
                return false;
            }
            var type = typeof value;
            if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol(value)) {
                return true;
            }
            return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
        }
        var FUNC_ERROR_TEXT = 'Expected a function';
        function memoize(func, resolver) {
            if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
                throw new TypeError(FUNC_ERROR_TEXT);
            }
            var memoized = function () {
                var args = arguments,
                    key = resolver ? resolver.apply(this, args) : args[0],
                    cache = memoized.cache;
                if (cache.has(key)) {
                    return cache.get(key);
                }
                var result = func.apply(this, args);
                memoized.cache = cache.set(key, result) || cache;
                return result;
            };
            memoized.cache = new (memoize.Cache || MapCache)();
            return memoized;
        }
        memoize.Cache = MapCache;
        var MAX_MEMOIZE_SIZE = 500;
        function memoizeCapped(func) {
            var result = memoize(func, function (key) {
                if (cache.size === MAX_MEMOIZE_SIZE) {
                    cache.clear();
                }
                return key;
            });
            var cache = result.cache;
            return result;
        }
        var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
        var reEscapeChar = /\\(\\)?/g;
        var stringToPath = memoizeCapped(function (string) {
            var result = [];
            if (string.charCodeAt(0) === 46) {
                result.push('');
            }
            string.replace(rePropName, function (match, number, quote, subString) {
                result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match);
            });
            return result;
        });
        function arrayMap(array, iteratee) {
            var index = -1,
                length = array == null ? 0 : array.length,
                result = Array(length);
            while (++index < length) {
                result[index] = iteratee(array[index], index, array);
            }
            return result;
        }
        var INFINITY$2 = 1 / 0;
        var symbolProto = Symbol ? Symbol.prototype : undefined,
            symbolToString = symbolProto ? symbolProto.toString : undefined;
        function baseToString(value) {
            if (typeof value == 'string') {
                return value;
            }
            if (isArray(value)) {
                return arrayMap(value, baseToString) + '';
            }
            if (isSymbol(value)) {
                return symbolToString ? symbolToString.call(value) : '';
            }
            var result = value + '';
            return result == '0' && 1 / value == -INFINITY$2 ? '-0' : result;
        }
        function toString(value) {
            return value == null ? '' : baseToString(value);
        }
        function castPath(value, object) {
            if (isArray(value)) {
                return value;
            }
            return isKey(value, object) ? [value] : stringToPath(toString(value));
        }
        var INFINITY$1 = 1 / 0;
        function toKey(value) {
            if (typeof value == 'string' || isSymbol(value)) {
                return value;
            }
            var result = value + '';
            return result == '0' && 1 / value == -INFINITY$1 ? '-0' : result;
        }
        function baseGet(object, path) {
            path = castPath(path, object);
            var index = 0,
                length = path.length;
            while (object != null && index < length) {
                object = object[toKey(path[index++])];
            }
            return index && index == length ? object : undefined;
        }
        function get(object, path, defaultValue) {
            var result = object == null ? undefined : baseGet(object, path);
            return result === undefined ? defaultValue : result;
        }
        function baseHasIn(object, key) {
            return object != null && key in Object(object);
        }
        function hasPath(object, path, hasFunc) {
            path = castPath(path, object);
            var index = -1,
                length = path.length,
                result = false;
            while (++index < length) {
                var key = toKey(path[index]);
                if (!(result = object != null && hasFunc(object, key))) {
                    break;
                }
                object = object[key];
            }
            if (result || ++index != length) {
                return result;
            }
            length = object == null ? 0 : object.length;
            return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
        }
        function hasIn(object, path) {
            return object != null && hasPath(object, path, baseHasIn);
        }
        var COMPARE_PARTIAL_FLAG = 1,
            COMPARE_UNORDERED_FLAG = 2;
        function baseMatchesProperty(path, srcValue) {
            if (isKey(path) && isStrictComparable(srcValue)) {
                return matchesStrictComparable(toKey(path), srcValue);
            }
            return function (object) {
                var objValue = get(object, path);
                return objValue === undefined && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
            };
        }
        function identity(value) {
            return value;
        }
        function baseProperty(key) {
            return function (object) {
                return object == null ? undefined : object[key];
            };
        }
        function basePropertyDeep(path) {
            return function (object) {
                return baseGet(object, path);
            };
        }
        function property(path) {
            return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
        }
        function baseIteratee(value) {
            if (typeof value == 'function') {
                return value;
            }
            if (value == null) {
                return identity;
            }
            if (typeof value == 'object') {
                return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
            }
            return property(value);
        }
        function createFind(findIndexFunc) {
            return function (collection, predicate, fromIndex) {
                var iterable = Object(collection);
                if (!isArrayLike(collection)) {
                    var iteratee = baseIteratee(predicate);
                    collection = keys(collection);
                    predicate = function (key) {
                        return iteratee(iterable[key], key, iterable);
                    };
                }
                var index = findIndexFunc(collection, predicate, fromIndex);
                return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
            };
        }
        function baseFindIndex(array, predicate, fromIndex, fromRight) {
            var length = array.length,
                index = fromIndex + (fromRight ? 1 : -1);
            while (fromRight ? index-- : ++index < length) {
                if (predicate(array[index], index, array)) {
                    return index;
                }
            }
            return -1;
        }
        var reWhitespace = /\s/;
        function trimmedEndIndex(string) {
            var index = string.length;
            while (index-- && reWhitespace.test(string.charAt(index))) {}
            return index;
        }
        var reTrimStart = /^\s+/;
        function baseTrim(string) {
            return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '') : string;
        }
        var NAN = 0 / 0;
        var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
        var reIsBinary = /^0b[01]+$/i;
        var reIsOctal = /^0o[0-7]+$/i;
        var freeParseInt = parseInt;
        function toNumber(value) {
            if (typeof value == 'number') {
                return value;
            }
            if (isSymbol(value)) {
                return NAN;
            }
            if (isObject(value)) {
                var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
                value = isObject(other) ? other + '' : other;
            }
            if (typeof value != 'string') {
                return value === 0 ? value : +value;
            }
            value = baseTrim(value);
            var isBinary = reIsBinary.test(value);
            return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
        }
        var INFINITY = 1 / 0,
            MAX_INTEGER = 1.7976931348623157e+308;
        function toFinite(value) {
            if (!value) {
                return value === 0 ? value : 0;
            }
            value = toNumber(value);
            if (value === INFINITY || value === -INFINITY) {
                var sign = value < 0 ? -1 : 1;
                return sign * MAX_INTEGER;
            }
            return value === value ? value : 0;
        }
        function toInteger(value) {
            var result = toFinite(value),
                remainder = result % 1;
            return result === result ? remainder ? result - remainder : result : 0;
        }
        var nativeMax = Math.max;
        function findIndex(array, predicate, fromIndex) {
            var length = array == null ? 0 : array.length;
            if (!length) {
                return -1;
            }
            var index = fromIndex == null ? 0 : toInteger(fromIndex);
            if (index < 0) {
                index = nativeMax(length + index, 0);
            }
            return baseFindIndex(array, baseIteratee(predicate), index);
        }
        var find = createFind(findIndex);
        var objectProto$1 = Object.prototype;
        var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
        function baseHas(object, key) {
            return object != null && hasOwnProperty$1.call(object, key);
        }
        function has(object, path) {
            return object != null && hasPath(object, path, baseHas);
        }
        var getPrototype = overArg(Object.getPrototypeOf, Object);
        var objectTag = '[object Object]';
        var funcProto = Function.prototype,
            objectProto = Object.prototype;
        var funcToString = funcProto.toString;
        var hasOwnProperty = objectProto.hasOwnProperty;
        var objectCtorString = funcToString.call(Object);
        function isPlainObject(value) {
            if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
                return false;
            }
            var proto = getPrototype(value);
            if (proto === null) {
                return true;
            }
            var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
            return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
        }
        function isElement(value) {
            return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
        }
        var stringTag = '[object String]';
        function isString(value) {
            return typeof value == 'string' || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
        }
        function result(object, path, defaultValue) {
            path = castPath(path, object);
            var index = -1,
                length = path.length;
            if (!length) {
                length = 1;
                object = undefined;
            }
            while (++index < length) {
                var value = object == null ? undefined : object[toKey(path[index])];
                if (value === undefined) {
                    index = length;
                    value = defaultValue;
                }
                object = isFunction(value) ? value.call(object) : value;
            }
            return object;
        }
        exports.chain = chain;
        exports.find = find;
        exports.has = has;
        exports.isElement = isElement;
        exports.isFunction = isFunction;
        exports.isString = isString;
        exports.keys = keys;
        exports.result = result;
        return exports;
    }({});
    const $document = (() => {
        const docNode = Node.DOCUMENT_NODE;
        const docFragmentNode = Node.DOCUMENT_FRAGMENT_NODE;
        const isDocument = (obj) => {
            try {
                let node = obj;
                return (node === null || node === void 0 ? void 0 : node.nodeType) === docNode || (node === null || node === void 0 ? void 0 : node.nodeType) === docFragmentNode;
            }
            catch (error) {
                return false;
            }
        };
        const hasActiveWindow = (doc) => {
            if (navigator.appCodeName === 'Mozilla' && !doc.location) return false;
            return !!doc.defaultView;
        };
        const getDocumentFromElement = (el) => {
            if (isDocument(el)) return el;
            return el.ownerDocument;
        };
        return {
            isDocument,
            hasActiveWindow,
            getDocumentFromElement
        }
    })();


    const $window = (() => {
        const isWindow = function (obj) {
            try {
                return Boolean(obj && obj.window === obj);
            }
            catch (error) {
                return false;
            }
        };
        const getWindowByDocument = (doc) => {
            // parentWindow for IE
            return doc.defaultView || doc.parentWindow
        }
        const getWindowByElement = function (el) {
            if ($window.isWindow(el)) {
                return el
            }

            const doc = $document.getDocumentFromElement(el)

            return getWindowByDocument(doc)
        }
        return {
            isWindow,
            getWindowByElement
        }
    })();

    const $detached = (() => {

        const isAttached = function (elem) {
            if ($window.isWindow(elem)) return true;

            const nodes = [];
            if (elem) nodes.push(elem);
            if (nodes.length === 0) return false;

            return nodes.every((node) => {
                const doc = $document.getDocumentFromElement(node);
                if (!$document.hasActiveWindow(doc)) return false;
                return node.isConnected;
            });
        };

        const isDetached = elem => !isAttached(elem)

        return {
            isDetached
        }
    })();

    const $utils = (() => {
        function switchCase(value, casesObj, defaultKey = 'default') {
            if (_.has(casesObj, value)) return _.result(casesObj, value);
            if (_.has(casesObj, defaultKey)) return _.result(casesObj, defaultKey);
            const keys = _.keys(casesObj);
            throw new Error(`The switch/case value: '${value}' did not match any cases: ${keys.join(', ')}.`);
        }

        const stringify = (el, form = 'long') => {
            // if we are formatting the window object
            if ($window.isWindow(el)) return '<window>';

            // if we are formatting the document object
            if ($document.isDocument(el)) return '<document>';

            // convert this to jquery if its not already one
            // const $el = $jquery.wrap(el);

            const long = () => {
                const str = el.cloneNode().outerHTML

                const text = _.chain(el.textContent).clean().truncate({ length: 10 }).value();
                const children = el.children.length;

                if (children) return str.replace('></', '>...</');

                if (text) return str.replace('></', `>${text}</`);

                return str;
            };

            const short = () => {
                const id = el.id;
                const klass = el.getAttribute('class');
                let str = el.tagName.toLowerCase();

                if (id) str += `#${id}`;

                // using attr here instead of class because
                // svg's return an SVGAnimatedString object
                // instead of a normal string when calling
                // the property 'class'
                if (klass) str += `.${klass.split(/\s+/).join('.')}`;

                // if we have more than one element,
                // format it so that the user can see there's more
                // if ($el.length > 1) {
                //     return `[ <${str}>, ${$el.length - 1} more... ]`;
                // }

                return `<${str}>`;
            };

            return switchCase(form, {
                long,
                short
            });
        };
        return { stringify }
    })();

    const $contenteditable = (() => {
        const isContentEditable = (el) => {
            return $nativeProps.getNativeProp(el, 'isContentEditable') || $document.getDocumentFromElement(el).designMode === 'on';
        };

        const isDesignModeDocumentElement = el => {
            return isElement(el) && $elementHelpers.getTagName(el) === 'html' && isContentEditable(el)
        }

        return {
            isDesignModeDocumentElement
        }
    })();

    const $complexElements = (() => {
        const fixedOrStickyRe = /(fixed|sticky)/;

        const focusableSelectors = [
            'a[href]',
            'area[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'button:not([disabled])',
            'iframe',
            '[tabindex]',
            '[contenteditable]'
        ];
        const isFocusable = elem => focusableSelectors.some(sel => elem.matches(sel)) || $contenteditable.isDesignModeDocumentElement(elem);

        const getFirstFixedOrStickyPositionParent = elem => {
            if (isUndefinedOrHTMLBodyDoc(elem)) return null;

            if (fixedOrStickyRe.test(getComputedStyle(elem).position)) return elem;

            /* walk up the tree until we find an element with a fixed/sticky position */
            return $find.findParent(elem, node => {

                if (node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) return null
                else if (fixedOrStickyRe.test(getComputedStyle(node).position)) return node;

                return null;
            });
        };

        const elOrAncestorIsFixedOrSticky = elem => {
            return !!getFirstFixedOrStickyPositionParent(elem);
        };
        return {
            isFocusable,
            elOrAncestorIsFixedOrSticky
        }
    })();


    const $shadow = (() => {
        const isShadowRoot = (maybeRoot) => {
            return (maybeRoot === null || maybeRoot === void 0 ? void 0 : maybeRoot.toString()) === '[object ShadowRoot]';
        };
        const isWithinShadowRoot = (node) => {
            return isShadowRoot(node.getRootNode());
        };
        const getShadowElementFromPoint = (node, x, y) => {
            var _a;
            const nodeFromPoint = (_a = node === null || node === void 0 ? void 0 : node.shadowRoot) === null || _a === void 0 ? void 0 : _a.elementFromPoint(x, y);
            if (!nodeFromPoint || nodeFromPoint === node)
                return node;
            return getShadowElementFromPoint(nodeFromPoint, x, y);
        };

        return {
            isWithinShadowRoot,
            getShadowElementFromPoint
        }
    })();


    const $find = (() => {
        const getParentNode = el => {
            // if the element has a direct parent element,
            // simply return it.
            if (el.parentElement) return el.parentElement;

            const root = el.getRootNode();

            // if the element is inside a shadow root,
            // return the host of the root.
            if (root && $shadow.isWithinShadowRoot(el)) return root.host;

            return null;
        };

        const getParent = elem => getParentNode(elem);

        const findParent = (el, condition) => {
            const collectParent = node => {
                const parent = getParentNode(node);

                if (!parent) return null;

                const parentMatchingCondition = condition(parent, node);

                if (parentMatchingCondition) return parentMatchingCondition;

                return collectParent(parent);
            };

            return collectParent(el);
        };
        const isUndefinedOrHTMLBodyDoc = elem => {
            return !elem || elem.matches('body,html') || $document.isDocument(elem);
        };

        const getAllParents = (el, untilSelectorOrEl) => {
            const collectParents = (parents, node) => {
                const parent = getParentNode(node);
                const selOrElemMatch = _.isString(untilSelectorOrEl) ? parent.matches(untilSelectorOrEl) : parent === untilSelectorOrEl;
                // if (!parent || (untilSelectorOrEl && parent.matches(untilSelectorOrEl))) return parents;
                if (!parent || (untilSelectorOrEl && selOrElemMatch)) return parents;
                return collectParents(parents.concat(parent), parent);
            };
            return collectParents([], el);
        };
        const isAncestor = (elem, maybeAncestor) => {
            return getAllParents(elem).indexOf(maybeAncestor) >= 0;
        };
        const isChild = (elem, maybeChild) => {
            return Array.from(elem.children).indexOf(maybeChild) >= 0;
        };
        const isDescendent = (elem1, elem2) => {
            if (!elem2) return false;
            if (elem1 === elem2) return true;
            return (findParent(elem2, node => {
                if (node === elem1) return node;
            }) === elem1);
        };

        const getTagName = el => {
            const tagName = el.tagName || '';
            return tagName.toLowerCase();
        };
        const getFirstParentWithTagName = (elem, tagName) => {
            if (isUndefinedOrHTMLBodyDoc(elem) || !tagName) return null;
            if (getTagName(elem) === tagName) return elem;
            return findParent(elem, node => {
                if (getTagName(node) === tagName) return node;
                return null;
            });
        };

        const elementFromPoint = (doc, x, y) => {
            let elFromPoint = doc.elementFromPoint(x, y);
            return $shadow.getShadowElementFromPoint(elFromPoint, x, y);
        };
        
        
        return {
            isAncestor,
            isChild,
            isDescendent,
            isUndefinedOrHTMLBodyDoc,
            getParent,
            findParent,
            elementFromPoint,
            getFirstParentWithTagName,
            getAllParents
        }
    })();


    const $elementHelpers = (() => {
        const getTagName = el => {
            const tagName = el.tagName || '';
            return tagName.toLowerCase();
        };
        const isElement = function (obj) {
            try {
                return Boolean(obj && _.isElement(obj));
            }
            catch (error) {
                return false;
            }
        };
        const isInput = (el) => getTagName(el) === 'input';
        const isTextarea = (el) => getTagName(el) === 'textarea';
        const isSelect = (el) => getTagName(el) === 'select';
        const isButton = (el) => getTagName(el) === 'button';
        const isBody = (el) => getTagName(el) === 'body';
        const isHTML = el => getTagName(el) === 'html';
        const isOption = el => getTagName(el) === 'option';
        const isOptgroup = el => getTagName(el) === 'optgroup';
        const isSvg = function (el) {
            try {
                return 'ownerSVGElement' in el;
            }
            catch (error) {
                return false;
            }
        };
        return {
            isSvg,
            isBody,
            isHTML,
            isOption,
            isElement,
            isOptgroup,
            isButton,
            isSelect,
            isTextarea,
            isInput
        }
    })();


    const $nativeProps = (() => {
        const descriptor = (klass, prop) => {
            const desc = Object.getOwnPropertyDescriptor(window[klass].prototype, prop);
            if (desc === undefined) {
                throw new Error(`Error, could not get property descriptor for ${klass}  ${prop}. This should never happen`);
            }
            return desc;
        };
        const _isContentEditable = function () {
            if ($elementHelpers.isSvg(this)) return false;
            return descriptor('HTMLElement', 'isContentEditable').get;
        };
        const _getValue = function () {
            if ($elementHelpers.isInput(this)) return descriptor('HTMLInputElement', 'value').get;
            if ($elementHelpers.isTextarea(this)) return descriptor('HTMLTextAreaElement', 'value').get;
            if ($elementHelpers.isSelect(this)) return descriptor('HTMLSelectElement', 'value').get;
            if ($elementHelpers.isButton(this)) return descriptor('HTMLButtonElement', 'value').get;
            return descriptor('HTMLOptionElement', 'value').get;
        };
        const _getSelectionStart = function () {
            if ($elementHelpers.isInput(this)) return descriptor('HTMLInputElement', 'selectionStart').get;
            if ($elementHelpers.isTextarea(this)) return descriptor('HTMLTextAreaElement', 'selectionStart').get;
            throw new Error('this should never happen, cannot get selectionStart');
        };
        const _getSelectionEnd = function () {
            if ($elementHelpers.isInput(this)) return descriptor('HTMLInputElement', 'selectionEnd').get;
            if ($elementHelpers.isTextarea(this)) return descriptor('HTMLTextAreaElement', 'selectionEnd').get;
            throw new Error('this should never happen, cannot get selectionEnd');
        };
        const _getType = function () {
            if ($elementHelpers.isInput(this)) return descriptor('HTMLInputElement', 'type').get;
            if ($elementHelpers.isButton(this)) return descriptor('HTMLButtonElement', 'type').get;
            throw new Error('this should never happen, cannot get type');
        };
        const _getMaxLength = function () {
            if ($elementHelpers.isInput(this)) return descriptor('HTMLInputElement', 'maxLength').get;
            if ($elementHelpers.isTextarea(this)) return descriptor('HTMLTextAreaElement', 'maxLength').get;
            throw new Error('this should never happen, cannot get maxLength');
        };
        const nativeGetters = {
            value: _getValue,
            isContentEditable: _isContentEditable,
            isCollapsed: descriptor('Selection', 'isCollapsed').get,
            selectionStart: _getSelectionStart,
            selectionEnd: _getSelectionEnd,
            type: _getType,
            activeElement: descriptor('Document', 'activeElement').get,
            body: descriptor('Document', 'body').get,
            frameElement: Object.getOwnPropertyDescriptor(window, 'frameElement').get,
            maxLength: _getMaxLength,
        };
        const getNativeProp = function (obj, prop) {
            const nativeProp = nativeGetters[prop];
            if (!nativeProp) {
                const props = _.keys(nativeGetters).join(', ');
                throw new Error(`attempted to use a native getter prop called: ${prop}. Available props are: ${props}`);
            }
            let retProp = nativeProp.call(obj, prop);
            if (_.isFunction(retProp)) {
                retProp = retProp.call(obj, prop);
            }
            return retProp;
        };

        return {
            getNativeProp
        }
    })();


    const $elements = {
        ...$find,
        ...$elementHelpers,
        ...$complexElements,
        ...$detached,
        ...$utils,
        ...$nativeProps
    };

    const $transform = (() => {
        const existsInvisibleBackface = (list) => {
            return !!_.find(list, { backfaceVisibility: 'hidden' });
        };
        
        const extractTransformInfo = (el) => {
            const style = getComputedStyle(el);
            const backfaceVisibility = style.getPropertyValue('backface-visibility');
            if (backfaceVisibility === '') return null;
            return {
                backfaceVisibility,
                transformStyle: style.getPropertyValue('transform-style'),
                transform: style.getPropertyValue('transform'),
            };
        };
        
        const numberRegex = /-?[0-9]+(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/g;
        const defaultNormal = [0, 0, 1];
        const viewVector = [0, 0, -1];
        const identityMatrix3D = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
        const TINY_NUMBER = 1e-5;
        
        const toMatrix3d = (m2d) => {
            return [
                m2d[0], m2d[1], 0, 0,
                m2d[2], m2d[3], 0, 0,
                0, 0, 1, 0,
                m2d[4], m2d[5], 0, 1,
            ];
        };
        
        const parseMatrix3D = (transform) => {
            if (transform === 'none') return identityMatrix3D;
            if (transform.startsWith('matrix3d')) {
                const matrix = transform.substring(8).match(numberRegex).map((n) => {
                    return parseFloat(n);
                });
                return matrix;
            }
            return toMatrix3d(transform.match(numberRegex).map((n) => parseFloat(n)));
        };
        
        const nextPreserve3d = (i, list) => {
            return i + 1 < list.length && list[i + 1].transformStyle === 'preserve-3d';
        };
        const finalNormal = (startIndex, list) => {
            let i = startIndex;
            let normal = findNormal(parseMatrix3D(list[i].transform));
            while (nextPreserve3d(i, list)) {
                i++;
                normal = findNormal(parseMatrix3D(list[i].transform), normal);
            }
            return normal;
        };
        
        
        const checkBackface = (normal) => {
            let dot = viewVector[2] * normal[2];
            if (Math.abs(dot) < TINY_NUMBER) {
                dot = 0;
            }
            return dot >= 0;
        };
        const elIsBackface = (list) => {
            if (list.length > 1 && list[1].transformStyle === 'preserve-3d') {
                if (list[0].backfaceVisibility === 'hidden') {
                    let normal = finalNormal(0, list);
                    if (checkBackface(normal)) return true;
                }
                else {
                    if (list[1].backfaceVisibility === 'hidden') {
                        if (list[0].transform === 'none') {
                            let normal = finalNormal(1, list);
                            if (checkBackface(normal)) return true;
                        }
                    }
                    let normal = finalNormal(0, list);
                    return isElementOrthogonalWithView(normal);
                }
            }
            else {
                for (let i = 0; i < list.length; i++) {
                    if (i > 0 && list[i].transformStyle === 'preserve-3d') {
                        continue;
                    }
                    if (list[i].backfaceVisibility === 'hidden' && list[i].transform.startsWith('matrix3d')) {
                        let normal = findNormal(parseMatrix3D(list[i].transform));
                        if (checkBackface(normal)) return true;
                    }
                }
            }
            return false;
        };
        
        const extractTransformInfoFromElements = (elem, list = []) => {
            const info = extractTransformInfo(elem);
            if (info) {
                list.push(info);
            }
            const parent = $elements.getParent(elem);
            if ($document.isDocument(parent) || parent === null) return list;
            return extractTransformInfoFromElements(parent, list);
        };
        
        const isElementOrthogonalWithView = (normal) => {
            const dot = viewVector[2] * normal[2];
            return Math.abs(dot) < TINY_NUMBER;
        };
        
        const toUnitVector = (v) => {
            const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
            return [v[0] / length, v[1] / length, v[2] / length];
        };
        
        const findNormal = (matrix, normal = defaultNormal) => {
            const m = matrix;
            const v = normal;
            const computedNormal = [
                m[0] * v[0] + m[4] * v[1] + m[8] * v[2],
                m[1] * v[0] + m[5] * v[1] + m[9] * v[2],
                m[2] * v[0] + m[6] * v[1] + m[10] * v[2],
            ];
            return toUnitVector(computedNormal);
        };
        
        const is3DMatrixScaledTo0 = (m3d) => {
            const xAxisScaledTo0 = m3d[0] === 0 && m3d[4] === 0 && m3d[8] === 0;
            const yAxisScaledTo0 = m3d[1] === 0 && m3d[5] === 0 && m3d[9] === 0;
            const zAxisScaledTo0 = m3d[2] === 0 && m3d[6] === 0 && m3d[10] === 0;
            if (xAxisScaledTo0 || yAxisScaledTo0 || zAxisScaledTo0) return true;
            return false;
        };
        
        const isTransformedToZero = ({ transform }) => {
            if (transform === 'none') return false;
            if (transform.startsWith('matrix3d')) {
                const matrix3d = parseMatrix3D(transform);
                if (is3DMatrixScaledTo0(matrix3d)) return true;
                const normal = findNormal(matrix3d);
                return isElementOrthogonalWithView(normal);
            }
            const m = parseMatrix2D(transform);
            if (is2DMatrixScaledTo0(m)) return true;
            return false;
        };
        
        const parseMatrix2D = (transform) => {
            return transform.match(numberRegex).map((n) => parseFloat(n));
        };
        
        const is2DMatrixScaledTo0 = (m) => {
            const xAxisScaledTo0 = m[0] === 0 && m[2] === 0;
            const yAxisScaledTo0 = m[1] === 0 && m[3] === 0;
            if (xAxisScaledTo0 || yAxisScaledTo0) return true;
            return false;
        };
        
        const elIsTransformedToZero = (list) => {
            if (list.some((info) => info.transformStyle === 'preserve-3d')) {
                const normal = finalNormal(0, list);
                return isElementOrthogonalWithView(normal);
            }
            return !!_.find(list, (info) => isTransformedToZero(info));
        };
        
        const detectVisibility = (elem) => {
            const list = extractTransformInfoFromElements(elem);
            if (existsInvisibleBackface(list)) return elIsBackface(list) ? 'backface' : 'visible';
            return elIsTransformedToZero(list) ? 'transformed' : 'visible';
        };
        return {
            detectVisibility
        }
    })();

    const $coordinates = (() => {
        const getElementAtPointFromViewport = (doc, x, y) => $elements.elementFromPoint(doc, x, y);
        const isAutIframe = (win) => {
            const parent = win.parent;
            return $window.isWindow(parent) && !$elements.getNativeProp(parent, 'frameElement');
        };
        const getFirstValidSizedRect = (el) => {
            return _.find(el.getClientRects(), (rect) => rect.width && rect.height) || el.getBoundingClientRect();
        };

        const getCoordsByPosition = (left, top, xPosition = 'center', yPosition = 'center') => {
            const getLeft = () => {
                switch (xPosition) {
                    case 'left': return Math.ceil(left);
                    case 'center': return Math.floor(left);
                    case 'right': return Math.floor(left) - 1;
                }
            };
            const getTop = () => {
                switch (yPosition) {
                    case 'top': return Math.ceil(top);
                    case 'center': return Math.floor(top);
                    case 'bottom': return Math.floor(top) - 1;
                }
            };
            return {
                x: getLeft(),
                y: getTop(),
            };
        };

        const getCenterCoordinates = (rect) => {
            const x = rect.left + (rect.width / 2);
            const y = rect.top + (rect.height / 2);
            return getCoordsByPosition(x, y, 'center', 'center');
        };

        const getElementPositioning = (el) => {
            let autFrame;
            const win = $window.getWindowByElement(el);
            const rect = getFirstValidSizedRect(el);
            const getRectFromAutIframe = (rect) => {
                let x = 0;
                let y = 0;
                let curWindow = win;
                let frame;
                while ($window.isWindow(curWindow) && !isAutIframe(curWindow) && curWindow.parent !== curWindow) {
                    frame = $elements.getNativeProp(curWindow, 'frameElement');
                    if (curWindow && frame) {
                        const frameRect = frame.getBoundingClientRect();
                        x += frameRect.left;
                        y += frameRect.top;
                    }
                    curWindow = curWindow.parent;
                }
                autFrame = curWindow;
                return {
                    left: x + rect.left,
                    top: y + rect.top,
                    right: x + rect.right,
                    bottom: y + rect.top,
                    width: rect.width,
                    height: rect.height,
                };
            };
            const rectFromAut = getRectFromAutIframe(rect);
            const rectFromAutCenter = getCenterCoordinates(rectFromAut);
            const rectCenter = getCenterCoordinates(rect);
            const topCenter = Math.ceil(rectCenter.y);
            const leftCenter = Math.ceil(rectCenter.x);
            return {
                scrollTop: el.scrollTop,
                scrollLeft: el.scrollLeft,
                width: rect.width,
                height: rect.height,
                fromElViewport: {
                    doc: win.document,
                    top: rect.top,
                    left: rect.left,
                    right: rect.right,
                    bottom: rect.bottom,
                    topCenter,
                    leftCenter,
                },
                fromElWindow: {
                    top: Math.ceil(rect.top + win.scrollY),
                    left: rect.left + win.scrollX,
                    topCenter: Math.ceil(topCenter + win.scrollY),
                    leftCenter: leftCenter + win.scrollX,
                },
                fromAutWindow: {
                    top: Math.ceil(rectFromAut.top + autFrame.scrollY),
                    left: rectFromAut.left + autFrame.scrollX,
                    topCenter: Math.ceil(rectFromAutCenter.y + autFrame.scrollY),
                    leftCenter: rectFromAutCenter.x + autFrame.scrollX,
                },
            };
        };
        return {
            getElementPositioning,
            getElementAtPointFromViewport
        }
    })();
    const {
        // find
        isAncestor,
        isChild,
        isDescendent,
        isUndefinedOrHTMLBodyDoc,
        getParent,
        getFirstParentWithTagName,
        getAllParents,

        // elementHelpers
        isElement,
        isBody,
        isHTML,
        isOption,
        isOptgroup,

        // complexElements
        elOrAncestorIsFixedOrSticky,
        isFocusable,

        // detached
        isDetached,


        // utils
        stringify: stringifyElement
    } = $elements;


    const isZeroLengthAndTransformNone = (width, height, transform) => (width <= 0 && transform === 'none') || (height <= 0 && transform === 'none');
    const isZeroLengthAndOverflowHidden = (width, height, overflowHidden) => (width <= 0 && overflowHidden) || (height <= 0 && overflowHidden);
    const elOffsetWidth = elem => elem.offsetWidth;

    const elOffsetHeight = elem => elem.offsetHeight;

    const elHasNoOffsetWidthOrHeight = elem => (elOffsetWidth(elem) <= 0) || (elOffsetHeight(elem) <= 0);
    const elHasVisibilityHidden = elem => getComputedStyle(elem).getPropertyValue('visibility') === 'hidden';
    const elHasVisibilityCollapse = elem => getComputedStyle(elem).getPropertyValue('visibility') === 'collapse';
    const elHasVisibilityHiddenOrCollapse = ($el) => elHasVisibilityHidden($el) || elHasVisibilityCollapse($el);
    const elHasOpacityZero = elem => getComputedStyle(elem).getPropertyValue('opacity') === '0';
    const elHasDisplayNone = elem => getComputedStyle(elem).getPropertyValue('display') === 'none';
    const elHasDisplayInline = elem => getComputedStyle(elem).getPropertyValue('display') === 'inline';
    const elHasOverflowHidden = elem => {
        const style = getComputedStyle(elem);
        const cssOverflow = [
            style.getPropertyValue('overflow'),
            style.getPropertyValue('overflow-y'),
            style.getPropertyValue('overflow-x')
        ];
        return cssOverflow.includes('hidden');
    };
    const elHasPositionRelative = elem => getComputedStyle(elem).getPropertyValue('position') === 'relative';
    const elHasPositionAbsolute = elem => getComputedStyle(elem).getPropertyValue('position') === 'absolute';
    const ensureEl = (el, methodName) => {
        if (!isElement(el)) {
            throw new Error(`\`${methodName}\` failed because it requires a DOM element. The subject received was: \`${el}\``);
        }
    };
    const elHasNoEffectiveWidthOrHeight = (el) => {
        const style = getComputedStyle(el);
        const transform = style.getPropertyValue('transform');
        const width = elOffsetWidth(el);
        const height = elOffsetHeight(el);
        const overflowHidden = elHasOverflowHidden(el);
        return isZeroLengthAndTransformNone(width, height, transform) || isZeroLengthAndOverflowHidden(width, height, overflowHidden) || (el.getClientRects().length <= 0);
    };
    const elDescendentsHavePositionFixedOrAbsolute = function (parent, child) {
        const parents = getAllParents(child, parent);
        const arr = [...parents, child];
        return arr.some(elem => fixedOrAbsoluteRe.test(getComputedStyle(elem).getPropertyValue('position')))
        // const $els = $jquery.wrap(parents).add(child);
        // return _.some($els.get(), (el) => {
        //     return fixedOrAbsoluteRe.test($jquery.wrap(el).css('position'));
        // });
    };
    const elIsHiddenByAncestors = (elem, checkOpacity, origEl = elem) => {
        const parent = getParent(elem);
        if (isUndefinedOrHTMLBodyDoc(parent)) return false;
        if (elHasOpacityZero(parent) && checkOpacity) return true;
        if (elHasOverflowHidden(parent) && elHasNoEffectiveWidthOrHeight(parent)) return !elDescendentsHavePositionFixedOrAbsolute(parent, origEl);
        return elIsHiddenByAncestors(parent, checkOpacity, origEl);
    };
    const elAtCenterPoint = elem => {
        const doc = $document.getDocumentFromElement(elem);
        const elProps = $coordinates.getElementPositioning(elem);
        const { topCenter, leftCenter } = elProps.fromElViewport;
        const el = $coordinates.getElementAtPointFromViewport(doc, leftCenter, topCenter);
        if (el) return el
    };
    const elIsNotElementFromPoint = elem => {
        const elAtPoint = elAtCenterPoint(elem);
        if (isDescendent(elem, elAtPoint)) return false;
        if ((getComputedStyle(elem).getPropertyValue('pointer-events') === 'none' || getComputedStyle(elem.parentElement).getPropertyValue('pointer-events') === 'none') &&
            (elAtPoint && isAncestor(elem, elAtPoint))) return false;
        return true;
    };
    const elHasClippableOverflow = elem => {
        const style = getComputedStyle(elem)
        return OVERFLOW_PROPS.includes(style.getPropertyValue('overflow')) || OVERFLOW_PROPS.includes(style.getPropertyValue('overflow-y')) || OVERFLOW_PROPS.includes(style.getPropertyValue('overflow-x'));
    };
    const canClipContent = (elem, ancestor) => {
        if (!elHasClippableOverflow(ancestor)) return false;
        const offsetParent = elem.offsetParent;
        if (!elHasPositionRelative(elem) && isAncestor(ancestor, offsetParent)) return false;
        if (elHasPositionAbsolute(offsetParent) && isChild(ancestor, offsetParent)) return false;
        return true;
    };
    const elIsOutOfBoundsOfAncestorsOverflow = (elem, ancestor = getParent(elem)) => {
        if (isUndefinedOrHTMLBodyDoc(ancestor)) return false;
        const elProps = $coordinates.getElementPositioning(elem);
        if (canClipContent(elem, ancestor)) {
            const ancestorProps = $coordinates.getElementPositioning(ancestor);
            if ((elProps.fromElWindow.left > (ancestorProps.width + ancestorProps.fromElWindow.left)) ||
                ((elProps.fromElWindow.left + elProps.width) < ancestorProps.fromElWindow.left) ||
                (elProps.fromElWindow.top > (ancestorProps.height + ancestorProps.fromElWindow.top)) ||
                ((elProps.fromElWindow.top + elProps.height) < ancestorProps.fromElWindow.top)) return true;
        }
        return elIsOutOfBoundsOfAncestorsOverflow(elem, getParent(ancestor));
    };
    const isHiddenByAncestors = (elem, methodName = 'isHiddenByAncestors()', options = { checkOpacity: true }) => {
        ensureEl(elem, methodName);
        if (elIsHiddenByAncestors(elem, options.checkOpacity)) return true;

        // removed because I am just trying to find out if the element is "visible" outside the viewport
        // if (elOrAncestorIsFixedOrSticky(elem)) return elIsNotElementFromPoint(elem);
        return elIsOutOfBoundsOfAncestorsOverflow(elem);
    };
    const fixedOrAbsoluteRe = /(fixed|absolute)/;
    const OVERFLOW_PROPS = ['hidden', 'scroll', 'auto'];
    const isVisible = elem => !isHidden(elem, 'isVisible()');
    const isHidden = (el, methodName = 'isHidden()', options = { checkOpacity: true }) => {
        if (isStrictlyHidden(el, methodName, options, isHidden)) return true;
        return isHiddenByAncestors(el, methodName, options);
    };
    const isStrictlyHidden = (elem, methodName = 'isStrictlyHidden()', options = { checkOpacity: true }, recurse) => {
        ensureEl(elem, methodName);

        if (isBody(elem) || isHTML(elem)) return false;
        if (isOption(elem) || isOptgroup(elem)) {
            if (elHasDisplayNone(elem)) return true;
            const select = getFirstParentWithTagName(elem, 'select');
            if (select) return recurse ? recurse(select, methodName, options) : isStrictlyHidden(select, methodName, options);
        }
        if (elHasNoEffectiveWidthOrHeight(elem)) {
            if (elHasDisplayInline(elem)) return !elHasVisibleChild(elem);
            return true;
        }
        if (elHasVisibilityHiddenOrCollapse(elem)) return true;
        // try {
        if ($transform.detectVisibility(elem) !== 'visible') return true;
        // } catch(err){}
        if (elHasOpacityZero(elem) && options.checkOpacity) return true;
        return false;
    };
    const isW3CRendered = elem => !(parentHasDisplayNone(elem) || getComputedStyle(elem).getPropertyValue('visibility') === 'hidden');
    const isW3CFocusable = elem => isFocusable(elem) && isW3CRendered(elem);
    const elHasVisibleChild = elem => Array.from(elem.children).some(child => isVisible(child));
    const parentHasNoOffsetWidthOrHeightAndOverflowHidden = function ($el) {
        if (isUndefinedOrHTMLBodyDoc($el)) return false;
        if (elHasOverflowHidden($el) && elHasNoEffectiveWidthOrHeight($el)) return $el;
        return parentHasNoOffsetWidthOrHeightAndOverflowHidden(getParent($el));
    };
    const parentHasDisplayNone = elem =>  {
        if ($document.isDocument(elem) || elem === null) return false;
        if (elHasDisplayNone(elem)) return elem;
        return parentHasDisplayNone(getParent(elem));
    };
    const parentHasVisibilityHidden = elem => {
        if ($document.isDocument(elem) || elem === null) return false;
        if (elHasVisibilityHidden(elem)) return elem;
        return parentHasVisibilityHidden(getParent(elem));
    };
    const parentHasVisibilityCollapse = elem => {
        if ($document.isDocument(elem) || elem === null) return false;
        if (elHasVisibilityCollapse(elem)) return elem;
        return parentHasVisibilityCollapse(getParent(elem));
    };
    const parentHasOpacityZero = elem => {
        if ($document.isDocument(elem) || elem === null) return false;
        if (elHasOpacityZero(elem)) return elem;
        return parentHasOpacityZero(getParent(elem));
    };
    const getReasonIsHidden = (elem, options = { checkOpacity: true }) => {
        const node = stringifyElement(elem, 'short');
        let width = elOffsetWidth(elem);
        let height = elOffsetHeight(elem);
        let $parent;
        let parentNode;
        if (elHasDisplayNone(elem)) return `This element \`${node}\` is not visible because it has CSS property: \`display: none\``;
        if ($parent = parentHasDisplayNone(getParent(elem))) {
            parentNode = stringifyElement($parent, 'short');
            return `This element \`${node}\` is not visible because its parent \`${parentNode}\` has CSS property: \`display: none\``;
        }
        if ($parent = parentHasVisibilityHidden(getParent(elem))) {
            parentNode = stringifyElement($parent, 'short');
            return `This element \`${node}\` is not visible because its parent \`${parentNode}\` has CSS property: \`visibility: hidden\``;
        }
        if ($parent = parentHasVisibilityCollapse(getParent(elem))) {
            parentNode = stringifyElement($parent, 'short');
            return `This element \`${node}\` is not visible because its parent \`${parentNode}\` has CSS property: \`visibility: collapse\``;
        }
        if (isDetached(elem)) return `This element \`${node}\` is not visible because it is detached from the DOM`;
        if (elHasVisibilityHidden(elem)) return `This element \`${node}\` is not visible because it has CSS property: \`visibility: hidden\``;
        if (elHasVisibilityCollapse(elem)) return `This element \`${node}\` is not visible because it has CSS property: \`visibility: collapse\``;
        if (elHasOpacityZero(elem) && options.checkOpacity) return `This element \`${node}\` is not visible because it has CSS property: \`opacity: 0\``;

        if (($parent = parentHasOpacityZero(getParent(elem))) && options.checkOpacity) {
            parentNode = stringifyElement($parent, 'short');
            return `This element \`${node}\` is not visible because its parent \`${parentNode}\` has CSS property: \`opacity: 0\``;
        }
        if (elHasNoOffsetWidthOrHeight(elem)) return `This element \`${node}\` is not visible because it has an effective width and height of: \`${width} x ${height}\` pixels.`;
        const transformResult = $transform.detectVisibility(elem);
        if (transformResult === 'transformed') return `This element \`${node}\` is not visible because it is hidden by transform.`;
        if (transformResult === 'backface') return `This element \`${node}\` is not visible because it is rotated and its backface is hidden.`;
        if ($parent = parentHasNoOffsetWidthOrHeightAndOverflowHidden(getParent(elem))) {
            parentNode = stringifyElement($parent, 'short');
            width = elOffsetWidth($parent);
            height = elOffsetHeight($parent);
            return `This element \`${node}\` is not visible because its parent \`${parentNode}\` has CSS property: \`overflow: hidden\` and an effective width and height of: \`${width} x ${height}\` pixels.`;
        }
        if (elOrAncestorIsFixedOrSticky(elem)) {
            if (elIsNotElementFromPoint(elem)) {
                const covered = stringifyElement(elAtCenterPoint(elem));
                if (covered) return `This element \`${node}\` is not visible because it has CSS property: \`position: fixed\` and it's being covered by another element:\n\n\`${covered}\``;
                return `This element \`${node}\` is not visible because its ancestor has \`position: fixed\` CSS property and it is overflowed by other elements. How about scrolling to the element with \`cy.scrollIntoView()\`?`;
            }
        }
        else {
            if (elIsOutOfBoundsOfAncestorsOverflow(elem)) return `This element \`${node}\` is not visible because its content is being clipped by one of its parent elements, which has a CSS property of overflow: \`hidden\`, \`scroll\` or \`auto\``;
        }
        return `This element \`${node}\` is not visible.`;
    };

    Object.assign(exports, {
        isVisible,
        isHidden,
        isStrictlyHidden,
        isHiddenByAncestors,
        getReasonIsHidden,
        isW3CFocusable,
        isW3CRendered
    })
})