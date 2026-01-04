var process = window.process || {};
var globalThis = window.globalThis || {};
var maxUint32 = 4294967295;
var POW32 = 4294967296;
var split64 = {
    mode_1: (buffer, offset, value) => {
        buffer.setUint32(offset, value / POW32);
        buffer.setUint32(offset + 4, value);
    },
    mode_2: (buffer, offset, value) => {
        buffer.setUint32(offset, Math.floor(value / POW32));
        buffer.setUint32(offset + 4, value);
    },
}
function combine64(buffer, offset) {
    return buffer.getInt32(offset) * POW32 + buffer.getUint32(offset + 4);
}
var isTextEncodingSupported = (typeof process === "undefined" || (process == null ? undefined : process.env)?.TEXT_ENCODING !== "never") && typeof TextEncoder !== "undefined" && typeof TextDecoder !== "undefined";
function byteLengthUTF8(str) {
    let len = str.length, byteCount = 0, i = 0;
    while (i < len) {
        let code = str.charCodeAt(i++);
        if (code >= 0xD800 && code <= 0xDBFF && i < len) {
            let nextCode = str.charCodeAt(i);
            if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
                code = (code - 0xD800 << 10) + (nextCode - 0xDC00) + 0x10000;
                i++;
            }
        }
        byteCount += (code <= 0x7F) ? 1 : (code <= 0x7FF) ? 2 : (code <= 0xFFFF) ? 3 : 4;
    }
    return byteCount;
}
function encodeUTF8(str, arr, index) {
    let len = str.length;
    for (let i = 0; i < len; i++) {
        let code = str.charCodeAt(i);
        if (code >= 0xD800 && code <= 0xDBFF && i + 1 < len) {
            let nextCode = str.charCodeAt(i + 1);
            if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
                code = ((code - 0xD800) << 10) + (nextCode - 0xDC00) + 0x10000;
                i++;
            }
        }
        if (code <= 0x7F) {
            arr[index++] = code;
        } else if (code <= 0x7FF) {
            arr[index++] = (code >> 6) | 0xC0;
            arr[index++] = (code & 0x3F) | 0x80;
        } else if (code <= 0xFFFF) {
            arr[index++] = (code >> 12) | 0xE0;
            arr[index++] = ((code >> 6) & 0x3F) | 0x80;
            arr[index++] = (code & 0x3F) | 0x80;
        } else {
            arr[index++] = (code >> 18) | 0xF0;
            arr[index++] = ((code >> 12) & 0x3F) | 0x80;
            arr[index++] = ((code >> 6) & 0x3F) | 0x80;
            arr[index++] = (code & 0x3F) | 0x80;
        }
        if (code > 0x7F) arr[index++] = (code & 0x3F) | 0x80;
    }
}
var textEncoder = isTextEncodingSupported ? new TextEncoder() : undefined;
var encodingLimit = isTextEncodingSupported && (!process?.env?.TEXT_ENCODING === "force") ? 200 : maxUint32;
function encodeTextToArray(str, arr, idx) {
    arr.set(textEncoder.encode(str), idx);
}
function encodeTextToSubarray(str, subarr, idx) {
    textEncoder.encodeInto(str, subarr.subarray(idx));
}
var encodeFunc = textEncoder?.encodeInto ? encodeTextToSubarray : encodeTextToArray;
var bufferSize = 4096;
function decodeBytesToString(bytes, startIdx, length) {
    let endIdx = startIdx + length, buffer = [], result = '';
    while (startIdx < endIdx) {
        let byte = bytes[startIdx++];
        if (byte < 128) {
            buffer.push(byte);
        } else if ((byte & 224) === 192) {
            buffer.push(((byte & 31) << 6) | (bytes[startIdx++] & 63));
        } else if ((byte & 240) === 224) {
            buffer.push(((byte & 31) << 12) | ((bytes[startIdx++] & 63) << 6) | (bytes[startIdx++] & 63));
        } else if ((byte & 248) === 240) {
            let codePoint = ((byte & 7) << 18) | ((bytes[startIdx++] & 63) << 12) | ((bytes[startIdx++] & 63) << 6) | (bytes[startIdx++] & 63);
            if (codePoint > 65535) {
                codePoint -= 65536;
                buffer.push((codePoint >>> 10) & 1023 | 55296);
                codePoint = (codePoint & 1023) | 56320;
            }
            buffer.push(codePoint);
        } else {
            buffer.push(byte);
        }
        if (buffer.length >= bufferSize) {
            result += String.fromCharCode.apply(String, buffer);
            buffer.length = 0;
        }
    }
    if (buffer.length) result += String.fromCharCode.apply(String, buffer);
    return result;
}
var textDecoder = isTextEncodingSupported ? new TextDecoder() : null;
var decodingLimit = isTextEncodingSupported ? typeof process !== "undefined" && (process == null ? undefined : process.env)?.TEXT_DECODER !== "force" ? 200 : 0 : maxUint32;
function decodeSubarray(array, start, length) {
    var subArray = array.subarray(start, start + length);
    return textDecoder.decode(subArray);
}
var TypeDataPair = function () {
    function pair(type, data) {
        this.type = type;
        this.data = data;
    }
    return pair;
}();
var createInheritance = globalThis && globalThis.__extends || function () {
    function setPrototype(child, parent) {
        setPrototype = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function (child, parent) {
            child.__proto__ = parent;
        } || function (child, parent) {
            for (var key in parent) {
                if (Object.prototype.hasOwnProperty.call(parent, key)) {
                    child[key] = parent[key];
                }
            }
        };
        return setPrototype(child, parent);
    }
    return function (ChildClass, ParentClass) {
        if (typeof ParentClass !== "function" && ParentClass !== null) {
            throw new TypeError("Class extends value " + String(ParentClass) + " is not a constructor or null");
        }
        setPrototype(ChildClass, ParentClass);
        function TemporaryConstructor() {
            this.constructor = ChildClass;
        }
        ChildClass.prototype = ParentClass === null ? Object.create(ParentClass) : (TemporaryConstructor.prototype = ParentClass.prototype, new TemporaryConstructor());
    };
}();
var createCustomError = function (BaseClass) {
    createInheritance(CustomError, BaseClass);
    function CustomError(message) {
        var instance = BaseClass.call(this, message) || this;
        var prototype = Object.create(CustomError.prototype);
        Object.setPrototypeOf(instance, prototype);
        Object.defineProperty(instance, "name", {
            configurable: true,
            enumerable: false,
            value: CustomError.name
        });
        return instance;
    }

    return CustomError;
}(Error);
var type_data = -1;
var MAX_UINT32 = 4294967295;
var MAX_SECONDS_64BIT = 17179869183;
function encodeTime(timeObj) {
    let seconds = timeObj.sec;
    let nanoseconds = timeObj.nsec;
    if (seconds >= 0 && nanoseconds >= 0 && seconds <= MAX_SECONDS_64BIT) {
        if (nanoseconds === 0 && seconds <= MAX_UINT32) {
            let result = new Uint8Array(4);
            let view = new DataView(result.buffer);
            view.setUint32(0, seconds);
            return result;
        } else {
            let highBits = seconds / POW32;
            let lowBits = seconds & 4294967295;
            let result = new Uint8Array(8);
            let view = new DataView(result.buffer);
            view.setUint32(0, nanoseconds << 2 | highBits & 3);
            view.setUint32(4, lowBits);
            return result;
        }
    } else {
        let result = new Uint8Array(12);
        let view = new DataView(result.buffer);
        view.setUint32(0, nanoseconds);
        split64.mode_2(view, 4, seconds);
        return result;
    }
}
function dateToTimeObject(date) {
    let milliseconds = date.getTime();
    let seconds = Math.floor(milliseconds / 1000);
    let nanoseconds = (milliseconds - seconds * 1000) * 1000000;

    let overflowSeconds = Math.floor(nanoseconds / 1000000000);
    return {
        sec: seconds + overflowSeconds,
        nsec: nanoseconds - overflowSeconds * 1000000000
    };
}
function encodeDate(date) {
    if (date instanceof Date) {
        const timeObject = dateToTimeObject(date);
        return encodeTime(timeObject);
    } else {
        return null;
    }
}
function decodeTime(buffer) {
    let view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    let seconds, nanoseconds;

    if (buffer.byteLength === 4) {
        seconds = view.getUint32(0);
        nanoseconds = 0;
    } else if (buffer.byteLength === 8) {
        let firstPart = view.getUint32(0);
        let secondPart = view.getUint32(4);
        seconds = (firstPart & 3) * 4294967296 + secondPart;
        nanoseconds = firstPart >>> 2;
    } else if (buffer.byteLength === 12) {
        seconds = combine64(view, 4);
        nanoseconds = view.getUint32(0);
    } else {
        throw new createCustomError("Unrecognized data size for timestamp (expected 4, 8, or 12): " + buffer.length);
    }

    return { sec: seconds, nsec: nanoseconds };
}
function decodeToDate(buffer) {
    let timeObject = decodeTime(buffer);
    return new Date(timeObject.sec * 1000 + timeObject.nsec / 1000000);
}
let timestampCodec = {
    type: type_data,
    encode: encodeDate,
    decode: decodeToDate
};
var CodecRegistry = function () {
    function Codec() {
        this.builtInEncoders = [];
        this.builtInDecoders = [];
        this.encoders = [];
        this.decoders = [];
        this.register(timestampCodec);
    }

    Codec.prototype.register = function (codec) {
        var type = codec.type;
        var encode = codec.encode;
        var decode = codec.decode;

        if (type >= 0) {
            this.encoders[type] = encode;
            this.decoders[type] = decode;
        } else {
            var adjustedType = 1 + type;
            this.builtInEncoders[adjustedType] = encode;
            this.builtInDecoders[adjustedType] = decode;
        }
    };

    Codec.prototype.tryToEncode = function (data, type) {
        for (var i = 0; i < this.builtInEncoders.length; i++) {
            var encoder = this.builtInEncoders[i];
            if (encoder != null) {
                var encodedData = encoder(data, type);
                if (encodedData != null) {
                    var encodedType = -1 - i;
                    return new TypeDataPair(encodedType, encodedData);
                }
            }
        }
        for (var o = 0; i < this.encoders.length; i++) {
            var encoder2 = this.encoders[i];
            if (encoder2 != null) {
                var encodedData2 = encoder2(data, type);
                if (encodedData2 != null) {
                    return new TypeDataPair(i, encodedData2);
                }
            }
        }
        if (data instanceof TypeDataPair) {
            return data;
        } else {
            return null;
        }
    };

    Codec.prototype.decode = function (data, type, additionalData) {
        var decoder = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
        if (decoder) {
            return decoder(data, type, additionalData);
        } else {
            return new TypeDataPair(type, data);
        }
    };

    Codec.defaultCodec = new Codec();
    return Codec;
}();
function toUint8Array(input) {
    if (input instanceof Uint8Array) {
        return input;
    } else if (ArrayBuffer.isView(input)) {
        return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    } else if (input instanceof ArrayBuffer) {
        return new Uint8Array(input);
    } else {
        return Uint8Array.from(input);
    }
}
function toDataView(input) {
    if (input instanceof ArrayBuffer) {
        return new DataView(input);
    }
    var uint8Array = toUint8Array(input);
    return new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
}
var maxDepth = 100;
var initialBufferSize = 2048;
function formatHex(input) {
    return `${input < 0 ? "-" : ""}0x${Math.abs(input).toString(16).padStart(2, "0")}`;
}
var maxKeyL = 16;
var maxKeyP = 16;
var CacheSystem = function () {
    function Cache(maxKeyLength = maxKeyL, maxLengthPerKey = maxKeyP) {
        this.maxKeyLength = maxKeyLength;
        this.maxLengthPerKey = maxLengthPerKey;
        this.hitCount = 0;
        this.missCount = 0;
        this.cacheStorage = [];
        for (let i = 0; i < this.maxKeyLength; i++) {
            this.cacheStorage.push([]);
        }
    }
    Cache.prototype.canBeCached = function (keyLength) {
        return keyLength > 0 && keyLength <= this.maxKeyLength;
    };
    Cache.prototype.find = function (data, startIndex, length) {
        let cacheList = this.cacheStorage[length - 1];
        for (let i = 0; i < cacheList.length; i++) {
            let cachedItem = cacheList[i];
            let cachedBytes = cachedItem.bytes;
            let isMatch = true;

            for (let j = 0; j < length; j++) {
                if (cachedBytes[j] !== data[startIndex + j]) {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                return cachedItem.str;
            }
        }

        return null;
    };
    Cache.prototype.store = function (dataBytes, decodedString) {
        let cacheList = this.cacheStorage[dataBytes.length - 1];
        let cachedItem = {
            bytes: dataBytes,
            str: decodedString
        };

        if (cacheList.length >= this.maxLengthPerKey) {
            cacheList[Math.random() * cacheList.length | 0] = cachedItem;
        } else {
            cacheList.push(cachedItem);
        }
    };
    Cache.prototype.decode = function (data, startIndex, length) {
        let foundString = this.find(data, startIndex, length);

        if (foundString !== null) {
            this.hitCount++;
            return foundString;
        }

        this.missCount++;
        let decodedString = decodeBytesToString(data, startIndex, length);
        let dataBytes = Uint8Array.prototype.slice.call(data, startIndex, startIndex + length);
        this.store(dataBytes, decodedString);
        return decodedString;
    };

    return Cache;
}();
var asyncWrapper = globalThis && globalThis.__awaiter || function (context, args, PromiseConstructor, generator) {
    function ensurePromise(value) {
        if (value instanceof PromiseConstructor) {
            return value;
        } else {
            return new PromiseConstructor(function (resolve) {
                resolve(value);
            });
        }
    }
    return new (PromiseConstructor ||= Promise)(function (resolve, reject) {
        function handleNext(value) {
            try {
                processResult(generator.next(value));
            } catch (error) {
                reject(error);
            }
        }
        function handleThrow(error) {
            try {
                processResult(generator.throw(error));
            } catch (error) {
                reject(error);
            }
        }
        function processResult(result) {
            if (result.done) {
                resolve(result.value);
            } else {
                ensurePromise(result.value).then(handleNext, handleThrow);
            }
        }
        processResult((generator = generator.apply(context, args || [])).next());
    });
};
var generatorFunction = globalThis && globalThis.__generator || function (context, generatorFn) {
    var state = {
        label: 0,
        sent: function () {
            if (executionState[0] & 1) {
                throw executionState[1];
            }
            return executionState[1];
        },
        tryBlocks: [],
        operations: []
    };

    var generator;
    var currentValue;
    var executionState;
    var resultHandler;

    resultHandler = {
        next: step(0),
        throw: step(1),
        return: step(2)
    };

    if (typeof Symbol === "function") {
        resultHandler[Symbol.iterator] = function () {
            return this;
        };
    }

    return resultHandler;

    function step(type) {
        return function (value) {
            return execute([type, value]);
        };
    }

    function execute([type, value]) {
        if (generator) {
            throw new TypeError("Generator is already executing.");
        }
        while (state) {
            try {
                generator = 1;
                if (currentValue && (executionState = type & 2 ? currentValue.return : type ? currentValue.throw || ((executionState = currentValue.return) && executionState.call(currentValue), 0) : currentValue.next) && !(executionState = executionState.call(currentValue, value)).done) {
                    return executionState;
                }
                currentValue = 0;
                if (executionState) {
                    value = [type & 2, executionState.value];
                }
                switch (value[0]) {
                    case 0:
                    case 1:
                        executionState = value;
                        break;
                    case 4:
                        state.label++;
                        return {
                            value: value[1],
                            done: false
                        };
                    case 5:
                        state.label++;
                        currentValue = value[1];
                        value = [0];
                        continue;
                    case 7:
                        value = state.operations.pop();
                        state.tryBlocks.pop();
                        continue;
                    default:
                        executionState = state.tryBlocks;
                        if (!(executionState = executionState.length > 0 && executionState[executionState.length - 1]) && (value[0] === 6 || value[0] === 2)) {
                            state = 0;
                            continue;
                        }

                        if (value[0] === 3 && (!executionState || value[1] > executionState[0] && value[1] < executionState[3])) {
                            state.label = value[1];
                            break;
                        }

                        if (value[0] === 6 && state.label < executionState[1]) {
                            state.label = executionState[1];
                            executionState = value;
                            break;
                        }

                        if (executionState && state.label < executionState[2]) {
                            state.label = executionState[2];
                            state.operations.push(value);
                            break;
                        }

                        if (executionState[2]) {
                            state.operations.pop();
                        }

                        state.tryBlocks.pop();
                        continue;
                }

                value = generatorFn.call(context, state);
            } catch (error) {
                value = [6, error];
                currentValue = 0;
            } finally {
                generator = executionState = 0;
            }
        }

        if (value[0] & 5) {
            throw value[1];
        }

        return {
            value: value[0] ? value[1] : undefined,
            done: true
        };
    }
};
var asyncValues = globalThis && globalThis.__asyncValues || function (iterable) {
    if (!Symbol.asyncIterator) {
        throw new TypeError("Symbol.asyncIterator is not defined.");
    }
    var asyncIterator = iterable[Symbol.asyncIterator];
    var asyncIteratorWrapper;
    if (asyncIterator) {
        return asyncIterator.call(iterable);
    } else {
        iterable = typeof __values === "function" ? __values(iterable) : iterable[Symbol.iterator]();
        asyncIteratorWrapper = {};
        defineAsyncIteratorMethod("next");
        defineAsyncIteratorMethod("throw");
        defineAsyncIteratorMethod("return");

        asyncIteratorWrapper[Symbol.asyncIterator] = function () {
            return this;
        };

        return asyncIteratorWrapper;
    }
    function defineAsyncIteratorMethod(method) {
        asyncIteratorWrapper[method] = iterable[method] && function (argument) {
            return new Promise(function (resolve, reject) {
                var result = iterable[method](argument);
                handlePromise(resolve, reject, result.done, result.value);
            });
        };
    }
    function handlePromise(resolve, reject, done, value) {
        Promise.resolve(value).then(function (resolvedValue) {
            resolve({
                value: resolvedValue,
                done: done
            });
        }, reject);
    }
};
var Await = globalThis && globalThis.__await || function (value) {
    if (this instanceof Await) {
        this.value = value;
        return this;
    } else {
        return new Await(value);
    }
};
var asyncGenerator = globalThis && globalThis.__asyncGenerator || function (context, args, generatorFunction) {
    if (!Symbol.asyncIterator) {
        throw new TypeError("Symbol.asyncIterator is not defined.");
    }
    var generator = generatorFunction.apply(context, args || []);
    var asyncIteratorWrapper;
    var taskQueue = [];
    asyncIteratorWrapper = {};
    defineAsyncIteratorMethod("next");
    defineAsyncIteratorMethod("throw");
    defineAsyncIteratorMethod("return");
    asyncIteratorWrapper[Symbol.asyncIterator] = function () {
        return this;
    };
    return asyncIteratorWrapper;
    function defineAsyncIteratorMethod(method) {
        if (generator[method]) {
            asyncIteratorWrapper[method] = function (arg) {
                return new Promise(function (resolve, reject) {
                    if (!(taskQueue.push([method, arg, resolve, reject]) > 1)) {
                        processTask(method, arg);
                    }
                });
            };
        }
    }
    function processTask(method, arg) {
        try {
            handleGeneratorResult(generator[method](arg));
        } catch (error) {
            handleError(taskQueue[0][3], error);
        }
    }
    function handleGeneratorResult(result) {
        if (result.value instanceof Await) {
            Promise.resolve(result.value.v).then(handleNext, handleThrow);
        } else {
            handleError(taskQueue[0][2], result);
        }
    }

    function handleNext(value) {
        processTask("next", value);
    }

    function handleThrow(error) {
        processTask("throw", error);
    }

    function handleError(resolve, error) {
        resolve(error);
        taskQueue.shift();
        if (taskQueue.length) {
            processTask(taskQueue[0][0], taskQueue[0][1]);
        }
    }
};
function isStringOrNumber(input) {
    var inputType = typeof input;
    return inputType === "string" || inputType === "number";
}
var headbyte = -1;
var emptyBufferView = new DataView(new ArrayBuffer(0));
var byteArray = new Uint8Array(emptyBufferView.buffer);
var errorCon = function () {
    try {
        emptyBufferView.getInt8(0);
    } catch (e) {
        return e.constructor;
    }
    throw new Error("never reached");
}();
var errorIns = new errorCon("Insufficient data");
var cache_sys = new CacheSystem();
var lite_encoder = function () {
    function init(extensionCodec = CodecRegistry.defaultCodec, content = undefined, maxDepths = maxDepth, initialBufferSizes = initialBufferSize, sortKeys = false, forceFloat32 = false, ignoreUndefined = false, forceIntergerToFloat = false) {
        this.extensionCodec = extensionCodec;
        this.context = content;
        this.maxDepth = maxDepths;
        this.initialBufferSize = initialBufferSizes;
        this.sortKeys = sortKeys;
        this.forceFloat32 = forceFloat32;
        this.ignoreUndefined = ignoreUndefined;
        this.forceIntegerToFloat = forceIntergerToFloat;
        this.pos = 0;
        this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
        this.bytes = new Uint8Array(this.view.buffer);
    }
    init.prototype.reinitializeState = function () {
        this.pos = 0;
    };
    init.prototype.encodeSharedRef = function (obj) {
        this.reinitializeState();
        this.doEncode(obj, 1);
        return this.bytes.subarray(0, this.pos);
    };
    init.prototype.encode = function (obj) {
        this.reinitializeState();
        this.doEncode(obj, 1);
        return this.bytes.slice(0, this.pos);
    };
    init.prototype.doEncode = function (obj, depth) {
        if (depth > this.maxDepth) {
            throw new Error(`Object exceeds max depth of ${this.maxDepth}`);
        }
        if (obj == null) {
            this.encodeNil();
        } else if (typeof obj === "boolean") {
            this.encodeBoolean(obj);
        } else if (typeof obj === "number") {
            this.encodeNumber(obj);
        } else if (typeof obj === "string") {
            this.encodeString(obj);
        } else {
            this.encodeObject(obj, depth);
        }
    };
    init.prototype.ensureBufferSizeToWrite = function (size) {
        var req = this.pos + size;
        if (this.view.byteLength < req) {
            this.resizeBuffer(req * 2);
        }
    };
    init.prototype.resizeBuffer = function (newSize) {
        var newBuffer = new ArrayBuffer(newSize);
        var newBytes = new Uint8Array(newBuffer);
        var newView = new DataView(newBuffer);
        newBytes.set(this.bytes);
        this.view = newView;
        this.bytes = newBytes;
    };
    init.prototype.encodeNil = function () {
        this.writeU8(192);
    };
    init.prototype.encodeBoolean = function (value) {
        if (value === false) {
            this.writeU8(194);
        } else {
            this.writeU8(195);
        }
    };
    init.prototype.encodeNumber = function (value) {
        if (Number.isSafeInteger(value) && !this.forceIntegerToFloat) {
            if (value >= 0) {
                if (value < 128) {
                    this.writeU8(value);
                } else if (value < 256) {
                    this.writeU8(204);
                    this.writeU8(value);
                } else if (value < 65536) {
                    this.writeU8(205);
                    this.writeU16(value);
                } else if (value < POW32) {
                    this.writeU8(206);
                    this.writeU32(value);
                } else {
                    this.writeU8(207);
                    this.writeU64(value);
                }
            } else if (value >= -32) {
                this.writeU8(value + 32 | 224);
            } else if (value >= -128) {
                this.writeU8(208);
                this.writeI8(value);
            } else if (value >= -32768) {
                this.writeU8(209);
                this.writeI16(value);
            } else if (value >= -2147483648) {
                this.writeU8(210);
                this.writeI32(value);
            } else {
                this.writeU8(211);
                this.writeI64(value);
            }
        } else if (this.forceFloat32) {
            this.writeU8(202);
            this.writeF32(value);
        } else {
            this.writeU8(203);
            this.writeF64(value);
        }
    };
    init.prototype.writeStringHeader = function (value) {
        if (value < 32) {
            this.writeU8(160 + value);
        } else if (value < 256) {
            this.writeU8(217);
            this.writeU8(value);
        } else if (value < 65536) {
            this.writeU8(218);
            this.writeU16(value);
        } else if (value < POW32) {
            this.writeU8(219);
            this.writeU32(value);
        } else {
            throw new Error(`Too long string: ${value} bytes in UTF-8`);
        }
    };
    init.prototype.encodeString = function (value) {
        var numZ = 5;
        var cope = value.length;
        if (cope > encodingLimit) {
            let resul = byteLengthUTF8(value);
            this.ensureBufferSizeToWrite(numZ + resul);
            this.writeStringHeader(resul);
            encodeFunc(value, this.bytes, this.pos);
            this.pos += resul;
        } else {
            let resul = byteLengthUTF8(value);
            this.ensureBufferSizeToWrite(numZ + resul);
            this.writeStringHeader(resul);
            encodeUTF8(value, this.bytes, this.pos);
            this.pos += resul;
        }
    };
    init.prototype.encodeObject = function (obj, depth) {
        var data = this.extensionCodec.tryToEncode(obj, this.context);
        if (data != null) {
            this.encodeExtension(data);
        } else if (Array.isArray(obj)) {
            this.encodeArray(obj, depth);
        } else if (ArrayBuffer.isView(obj)) {
            this.encodeBinary(obj);
        } else if (typeof obj == "object") {
            this.encodeMap(obj, depth);
        } else {
            throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(obj)}`);
        }
    };
    init.prototype.encodeBinary = function (binaryData) {
        var dataLength = binaryData.byteLength;
        if (dataLength < 256) {
            this.writeU8(196);
            this.writeU8(dataLength);
        } else if (dataLength < 65536) {
            this.writeU8(197);
            this.writeU16(dataLength);
        } else if (dataLength < POW32) {
            this.writeU8(198);
            this.writeU32(dataLength);
        } else {
            throw new Error(`Too large binary: ${dataLength}`);
        }
        var byteArray = toUint8Array(binaryData);
        this.writeU8a(byteArray);
    };

    init.prototype.encodeArray = function (arrayData, depth) {
        var arrayLength = arrayData.length;
        if (arrayLength < 16) {
            this.writeU8(144 + arrayLength);
        } else if (arrayLength < 65536) {
            this.writeU8(220);
            this.writeU16(arrayLength);
        } else if (arrayLength < POW32) {
            this.writeU8(221);
            this.writeU32(arrayLength);
        } else {
            throw new Error(`Too large array: ${arrayLength}`);
        }
        for (var index = 0, array = arrayData; index < array.length; index++) {
            var item = array[index];
            this.doEncode(item, depth + 1);
        }
    };

    init.prototype.countWithoutUndefined = function (obj, keys) {
        var count = 0;
        for (var index = 0, keyArray = keys; index < keyArray.length; index++) {
            var key = keyArray[index];
            if (obj[key] !== undefined) {
                count++;
            }
        }
        return count;
    };

    init.prototype.encodeMap = function (mapData, depth) {
        var keys = Object.keys(mapData);
        if (this.sortKeys) {
            keys.sort();
        }
        var keyCount = this.ignoreUndefined ? this.countWithoutUndefined(mapData, keys) : keys.length;
        if (keyCount < 16) {
            this.writeU8(128 + keyCount);
        } else if (keyCount < 65536) {
            this.writeU8(222);
            this.writeU16(keyCount);
        } else if (keyCount < POW32) {
            this.writeU8(223);
            this.writeU32(keyCount);
        } else {
            throw new Error(`Too large map object: ${keyCount}`);
        }
        for (var index = 0, keyArray = keys; index < keyArray.length; index++) {
            var key = keyArray[index];
            var value = mapData[key];
            if (!this.ignoreUndefined || value !== undefined) {
                this.encodeString(key);
                this.doEncode(value, depth + 1);
            }
        }
    };

    init.prototype.encodeExtension = function (value) {
        var data = value.data.length;
        if (data === 1) {
            this.writeU8(212);
        } else if (data === 2) {
            this.writeU8(213);
        } else if (data === 4) {
            this.writeU8(214);
        } else if (data === 8) {
            this.writeU8(215);
        } else if (data === 16) {
            this.writeU8(216);
        } else if (data < 256) {
            this.writeU8(199);
            this.writeU8(data);
        } else if (data < 65536) {
            this.writeU8(200);
            this.writeU16(data);
        } else if (data < POW32) {
            this.writeU8(201);
            this.writeU32(data);
        } else {
            throw new Error(`Too large extension object: ${data}`);
        }
        this.writeI8(value.type);
        this.writeU8a(value.data);
    };
    init.prototype.writeU8 = function (value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setUint8(this.pos, value);
        this.pos++;
    };
    init.prototype.writeU8a = function (value) {
        var data = value.length;
        this.ensureBufferSizeToWrite(data);
        this.bytes.set(value, this.pos);
        this.pos += data;
    };
    init.prototype.writeI8 = function (value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setInt8(this.pos, value);
        this.pos++;
    };
    init.prototype.writeU16 = function (value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setUint16(this.pos, value);
        this.pos += 2;
    };
    init.prototype.writeI16 = function (value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setInt16(this.pos, value);
        this.pos += 2;
    };
    init.prototype.writeU32 = function (value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setUint32(this.pos, value);
        this.pos += 4;
    };
    init.prototype.writeI32 = function (value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setInt32(this.pos, value);
        this.pos += 4;
    };
    init.prototype.writeF32 = function (value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setFloat32(this.pos, value);
        this.pos += 4;
    };
    init.prototype.writeF64 = function (value) {
        this.ensureBufferSizeToWrite(8);
        this.view.setFloat64(this.pos, value);
        this.pos += 8;
    };
    init.prototype.writeU64 = function (value) {
        this.ensureBufferSizeToWrite(8);
        split64.mode_1(this.view, this.pos, value);
        this.pos += 8;
    };
    init.prototype.writeI64 = function (value) {
        this.ensureBufferSizeToWrite(8);
        split64.mode_2(this.view, this.pos, value);
        this.pos += 8;
    };
    return init;
}();
var lite_decoder = function () {
    function init(codec = CodecRegistry.defaultCodec, context = undefined, maxStrLen = maxUint32, maxBinLen = maxUint32, maxArrayLen = maxUint32, maxMapLen = maxUint32, maxExtLen = maxUint32, keyDecoder = cache_sys) {
        this.extensionCodec = codec;
        this.context = context;
        this.maxStrLength = maxStrLen;
        this.maxBinLength = maxBinLen;
        this.maxArrayLength = maxArrayLen;
        this.maxMapLength = maxMapLen;
        this.maxExtLength = maxExtLen;
        this.keyDecoder = keyDecoder;
        this.totalPos = 0;
        this.pos = 0;
        this.view = emptyBufferView;
        this.bytes = byteArray;
        this.headByte = headbyte;
        this.stack = [];
    }
    init.prototype.reinitializeState = function () {
        this.totalPos = 0;
        this.headByte = headbyte;
        this.stack.length = 0;
    };
    init.prototype.setBuffer = function (buffer) {
        this.bytes = toUint8Array(buffer);
        this.view = toDataView(this.bytes);
        this.pos = 0;
    };
    init.prototype.appendBuffer = function (buffer) {
        if (this.headByte === headbyte && !this.hasRemaining(1)) {
            this.setBuffer(buffer);
        } else {
            var remainingBytes = this.bytes.subarray(this.pos);
            var newBytes = toUint8Array(buffer);
            var combinedBytes = new Uint8Array(remainingBytes.length + newBytes.length);
            combinedBytes.set(remainingBytes);
            combinedBytes.set(newBytes, remainingBytes.length);
            this.setBuffer(combinedBytes);
        }
    };
    init.prototype.hasRemaining = function (lengthsc) {
        return this.view.byteLength - this.pos >= lengthsc;
    };
    init.prototype.createExtraByteError = function (pos) {
        var vThis = this;
        var currV = vThis.view;
        var currP = vThis.pos;
        return new RangeError(`Extra ${currV.byteLength - currP} of ${currV.byteLength} byte(s) found at buffer[${pos}]`);
    };
    init.prototype.decode = function (array) {
        this.reinitializeState();
        this.setBuffer(array);
        var decodedData = this.doDecodeSync();
        if (this.hasRemaining(1)) {
            throw this.createExtraByteError(this.pos);
        }
        return decodedData;
    };
    init.prototype.decodeMulti = function (data) {
        return generatorFunction(this, function (step) {
            if (step.label === 0) {
                this.reinitializeState();
                this.setBuffer(data);
                step.label = 1;
            } else if (step.label === 1) {
                if (this.hasRemaining(1)) {
                    return [4, this.doDecodeSync()];
                } else {
                    return [3, 3];
                }
            } else if (step.label === 2) {
                step.sent();
                return [3, 1];
            } else if (step.label === 3) {
                return [2];
            }
        });
    };
    init.prototype.decodeAsync = function (input) {
        var asyncIterator;
        var currentChunk;
        var decodedValue;
        var decodeResult;
        var decodingFailed;
        var error;
        var result;
        var bufferChunk;
        var finalResult;
        var nextChunk;
        return asyncWrapper(this, undefined, undefined, function () {
            return generatorFunction(this, function (step) {
                if (step.label === 0) {
                    decodingFailed = false;
                    step.label = 1;
                } else if (step.label === 1) {
                    step.trys.push([1, 6, 7, 12]);
                    asyncIterator = asyncValues(input);
                    step.label = 2;
                } else if (step.label === 2) {
                    return [4, asyncIterator.next()];
                } else if (step.label === 3) {
                    currentChunk = step.sent();
                    if (currentChunk.done) {
                        return [3, 5];
                    }
                    bufferChunk = currentChunk.value;
                    if (decodingFailed) {
                        throw this.createExtraByteError(this.totalPos);
                    }
                    this.appendBuffer(bufferChunk);
                    try {
                        decodedValue = this.doDecodeSync();
                        decodingFailed = true;
                    } catch (exception) {
                        if (!(exception instanceof errorCon)) {
                            throw exception;
                        }
                    }
                    this.totalPos += this.pos;
                    step.label = 4;
                } else if (step.label === 4) {
                    return [3, 2];
                } else if (step.label === 5) {
                    return [3, 12];
                } else if (step.label === 6) {
                    error = step.sent();
                    result = {
                        error: error
                    };
                    return [3, 12];
                } else if (step.label === 7) {
                    step.trys.push([7,, 10, 11]);
                    if (currentChunk && !currentChunk.done && (finalResult = asyncIterator.return)) {
                        return [4, finalResult.call(asyncIterator)];
                    } else {
                        return [3, 9];
                    }
                } else if (step.label === 8) {
                    step.sent();
                    step.label = 9;
                } else if (step.label === 9) {
                    return [3, 11];
                } else if (step.label === 10) {
                    if (result) {
                        throw result.error;
                    }
                    return [7];
                } else if (step.label === 11) {
                    return [7];
                } else if (step.label === 12) {
                    if (decodingFailed) {
                        if (this.hasRemaining(1)) {
                            throw this.createExtraByteError(this.totalPos);
                        }
                        return [2, decodedValue];
                    }
                    nextChunk = this;
                    throw new RangeError(`Insufficient data in parsing ${formatHex(nextChunk.headByte)} at ${nextChunk.totalPos} (${nextChunk.pos} in the current buffer)`);
                }
            });
        });
    };

    init.prototype.decodeArrayStream = function (array) {
        return this.decodeMultiAsync(array, true);
    };
    init.prototype.decodeStream = function (stream) {
        return this.decodeMultiAsync(stream, false);
    };
    init.prototype.decodeMultiAsync = function (inputData, hasArraySize) {
        return asyncGenerator(this, arguments, function () {
            var arraySize;
            var currentPos;
            var currentValue;
            var chunk;
            var decodedValue;
            var errorResult;
            var finalResult;
            var bufferChunk;
            return generatorFunction(this, function (step) {
                if (step.label === 0) {
                    arraySize = hasArraySize;
                    currentPos = -1;
                    step.label = 1;
                } else if (step.label === 1) {
                    step.trys.push([1, 13, 14, 19]);
                    currentValue = asyncValues(inputData);
                    step.label = 2;
                } else if (step.label === 2) {
                    return [4, Await(currentValue.next())];
                } else if (step.label === 3) {
                    chunk = step.sent();
                    if (chunk.done) {
                        return [3, 12];
                    }
                    bufferChunk = chunk.value;
                    if (hasArraySize && currentPos === 0) {
                        throw this.createExtraByteError(this.totalPos);
                    }
                    this.appendBuffer(bufferChunk);
                    if (arraySize) {
                        currentPos = this.readArraySize();
                        arraySize = false;
                        this.complete();
                    }
                    step.label = 4;
                } else if (step.label === 4) {
                    step.trys.push([4, 9,, 10]);
                    step.label = 5;
                } else if (step.label === 5) {
                    return [4, Await(this.doDecodeSync())];
                } else if (step.label === 6) {
                    return [4, step.sent()];
                } else if (step.label === 7) {
                    step.sent();
                    if (--currentPos === 0) {
                        return [3, 8];
                    } else {
                        return [3, 5];
                    }
                } else if (step.label === 8) {
                    return [3, 10];
                } else if (step.label === 9) {
                    decodedValue = step.sent();
                    if (!(decodedValue instanceof errorCon)) {
                        throw decodedValue;
                    }
                    return [3, 10];
                } else if (step.label === 10) {
                    this.totalPos += this.pos;
                    step.label = 11;
                } else if (step.label === 11) {
                    return [3, 2];
                } else if (step.label === 12) {
                    return [3, 19];
                } else if (step.label === 13) {
                    errorResult = step.sent();
                    finalResult = {
                        error: errorResult
                    };
                    return [3, 19];
                } else if (step.label === 14) {
                    step.trys.push([14,, 17, 18]);
                    if (chunk && !chunk.done && (bufferChunk = currentValue.return)) {
                        return [4, Await(bufferChunk.call(currentValue))];
                    } else {
                        return [3, 16];
                    }
                } else if (step.label === 15) {
                    step.sent();
                    step.label = 16;
                } else if (step.label === 16) {
                    return [3, 18];
                } else if (step.label === 17) {
                    if (finalResult) {
                        throw finalResult.error;
                    }
                    return [7];
                } else if (step.label === 18) {
                    return [7];
                } else if (step.label === 19) {
                    return [2];
                }
            });
        });
    };

    init.prototype.doDecodeSync = function () {
        e: while (true) {
            var headByte = this.readHeadByte();
            var decodedValue = undefined;
            if (headByte >= 224) {
                decodedValue = headByte - 256;
            } else if (headByte < 192) {
                if (headByte < 128) {
                    decodedValue = headByte;
                } else if (headByte < 144) {
                    var arraySize = headByte - 128;
                    if (arraySize !== 0) {
                        this.pushMapState(arraySize);
                        this.complete();
                        continue e;
                    } else {
                        decodedValue = {};
                    }
                } else if (headByte < 160) {
                    let arraySize = headByte - 144;
                    if (arraySize !== 0) {
                        this.pushArrayState(arraySize);
                        this.complete();
                        continue e;
                    } else {
                        decodedValue = [];
                    }
                } else {
                    var utf8StringLength = headByte - 160;
                    decodedValue = this.decodeUtf8String(utf8StringLength, 0);
                }
            } else if (headByte === 192) {
                decodedValue = null;
            } else if (headByte === 194) {
                decodedValue = false;
            } else if (headByte === 195) {
                decodedValue = true;
            } else if (headByte === 202) {
                decodedValue = this.readF32();
            } else if (headByte === 203) {
                decodedValue = this.readF64();
            } else if (headByte === 204) {
                decodedValue = this.readU8();
            } else if (headByte === 205) {
                decodedValue = this.readU16();
            } else if (headByte === 206) {
                decodedValue = this.readU32();
            } else if (headByte === 207) {
                decodedValue = this.readU64();
            } else if (headByte === 208) {
                decodedValue = this.readI8();
            } else if (headByte === 209) {
                decodedValue = this.readI16();
            } else if (headByte === 210) {
                decodedValue = this.readI32();
            } else if (headByte === 211) {
                decodedValue = this.readI64();
            } else if (headByte === 217) {
                let utf8Length = this.lookU8();
                decodedValue = this.decodeUtf8String(utf8Length, 1);
            } else if (headByte === 218) {
                let utf8Length = this.lookU16();
                decodedValue = this.decodeUtf8String(utf8Length, 2);
            } else if (headByte === 219) {
                var utf8Length = this.lookU32();
                decodedValue = this.decodeUtf8String(utf8Length, 4);
            } else if (headByte === 220) {
                let arraySize = this.readU16();
                if (arraySize !== 0) {
                    this.pushArrayState(arraySize);
                    this.complete();
                    continue e;
                } else {
                    decodedValue = [];
                }
            } else if (headByte === 221) {
                let arraySize = this.readU32();
                if (arraySize !== 0) {
                    this.pushArrayState(arraySize);
                    this.complete();
                    continue e;
                } else {
                    decodedValue = [];
                }
            } else if (headByte === 222) {
                var mapSize = this.readU16();
                if (mapSize !== 0) {
                    this.pushMapState(mapSize);
                    this.complete();
                    continue e;
                } else {
                    decodedValue = {};
                }
            } else if (headByte === 223) {
                let mapSize = this.readU32();
                if (mapSize !== 0) {
                    this.pushMapState(mapSize);
                    this.complete();
                    continue e;
                } else {
                    decodedValue = {};
                }
            } else if (headByte === 196) {
                var binaryLength = this.lookU8();
                decodedValue = this.decodeBinary(binaryLength, 1);
            } else if (headByte === 197) {
                let binaryLength = this.lookU16();
                decodedValue = this.decodeBinary(binaryLength, 2);
            } else if (headByte === 198) {
                let binaryLength = this.lookU32();
                decodedValue = this.decodeBinary(binaryLength, 4);
            } else if (headByte === 212) {
                decodedValue = this.decodeExtension(1, 0);
            } else if (headByte === 213) {
                decodedValue = this.decodeExtension(2, 0);
            } else if (headByte === 214) {
                decodedValue = this.decodeExtension(4, 0);
            } else if (headByte === 215) {
                decodedValue = this.decodeExtension(8, 0);
            } else if (headByte === 216) {
                decodedValue = this.decodeExtension(16, 0);
            } else if (headByte === 199) {
                var extensionLength = this.lookU8();
                decodedValue = this.decodeExtension(extensionLength, 1);
            } else if (headByte === 200) {
                let extensionLength = this.lookU16();
                decodedValue = this.decodeExtension(extensionLength, 2);
            } else if (headByte === 201) {
                let extensionLength = this.lookU32();
                decodedValue = this.decodeExtension(extensionLength, 4);
            } else {
                throw new createCustomError(`Unrecognized type byte: ${formatHex(headByte)}`);
            }
            this.complete();
            for (var state = this.stack; state.length > 0;) {
                var stackState = state[state.length - 1];
                if (stackState.type === 0) {
                    stackState.array[stackState.position] = decodedValue;
                    stackState.position++;
                    if (stackState.position === stackState.size) {
                        state.pop();
                        decodedValue = stackState.array;
                    } else {
                        continue e;
                    }
                } else if (stackState.type === 1) {
                    if (!isStringOrNumber(decodedValue)) {
                        throw new createCustomError("The type of key must be string or number but " + typeof decodedValue);
                    }
                    if (decodedValue === "__proto__") {
                        throw new createCustomError("The key __proto__ is not allowed");
                    }
                    stackState.key = decodedValue;
                    stackState.type = 2;
                    continue e;
                } else {
                    stackState.map[stackState.key] = decodedValue;
                    stackState.readCount++;
                    if (stackState.readCount === stackState.size) {
                        state.pop();
                        decodedValue = stackState.map;
                    } else {
                        stackState.key = null;
                        stackState.type = 1;
                        continue e;
                    }
                }
            }
            return decodedValue;
        }
    };

    init.prototype.readHeadByte = function () {
        if (this.headByte === headbyte) {
            this.headByte = this.readU8();
        }
        return this.headByte;
    };
    init.prototype.complete = function () {
        this.headByte = headbyte;
    };
    init.prototype.readArraySize = function () {
        var byte = this.readHeadByte();
        switch (byte) {
            case 220:
                return this.readU16();
            case 221:
                return this.readU32();
            default:
                {
                    if (byte < 160) {
                        return byte - 144;
                    }
                    throw new createCustomError(`Unrecognized array type byte: ${formatHex(byte)}`);
                }
        }
    };
    init.prototype.pushMapState = function (leap) {
        if (leap > this.maxMapLength) {
            throw new createCustomError(`Max length exceeded: map length (${leap}) > maxMapLengthLength (${this.maxMapLength})`);
        }
        this.stack.push({
            type: 1,
            size: leap,
            key: null,
            readCount: 0,
            map: {}
        });
    };
    init.prototype.pushArrayState = function (arr) {
        if (arr > this.maxArrayLength) {
            throw new createCustomError(`Max length exceeded: array length (${arr}) > maxArrayLength (${this.maxArrayLength})`);
        }
        this.stack.push({
            type: 0,
            size: arr,
            array: new Array(arr),
            position: 0
        });
    };
    init.prototype.decodeUtf8String = function (byteLength, offset) {
        var keyDecoder;
        if (byteLength > this.maxStrLength) {
            throw new createCustomError(`Max length exceeded: UTF-8 byte length (${byteLength}) > maxStrLength (${this.maxStrLength})`);
        }
        if (this.bytes.byteLength < this.pos + offset + byteLength) {
            throw errorIns;
        }
        var startPosition = this.pos + offset;
        var decodedValue;
        if (this.stateIsMapKey() && (keyDecoder = this.keyDecoder) !== null && keyDecoder !== undefined && keyDecoder.canBeCached(byteLength)) {
            decodedValue = keyDecoder.decode(this.bytes, startPosition, byteLength);
        } else if (byteLength > decodingLimit) {
            decodedValue = decodeSubarray(this.bytes, startPosition, byteLength);
        } else {
            decodedValue = decodeBytesToString(this.bytes, startPosition, byteLength);
        }
        this.pos += offset + byteLength;
        return decodedValue;
    };

    init.prototype.stateIsMapKey = function () {
        if (this.stack.length > 0) {
            var satc = this.stack[this.stack.length - 1];
            return satc.type === 1;
        }
        return false;
    };
    init.prototype.decodeBinary = function (bin, offset) {
        if (bin > this.maxBinLength) {
            throw new createCustomError(`Max length exceeded: bin length (${bin}) > maxBinLength (${this.maxBinLength})`);
        }
        if (!this.hasRemaining(bin + offset)) {
            throw errorIns;
        }
        var comb = this.pos + offset;
        var result = this.bytes.subarray(comb, comb + bin);
        this.pos += offset + bin;
        return result;
    };
    init.prototype.decodeExtension = function (ext, offset) {
        if (ext > this.maxExtLength) {
            throw new createCustomError(`Max length exceeded: ext length (${ext}) > maxExtLength (${this.maxExtLength})`);
        }
        var getInt8 = this.view.getInt8(this.pos + offset);
        var decodeBinary = this.decodeBinary(ext, offset + 1);
        return this.extensionCodec.decode(decodeBinary, getInt8, this.context);
    };
    init.prototype.lookU8 = function () {
        return this.view.getUint8(this.pos);
    };
    init.prototype.lookU16 = function () {
        return this.view.getUint16(this.pos);
    };
    init.prototype.lookU32 = function () {
        return this.view.getUint32(this.pos);
    };
    init.prototype.readU8 = function () {
        let data = this.view.getUint8(this.pos);
        this.pos++;
        return data;
    };
    init.prototype.readI8 = function () {
        let data = this.view.getInt8(this.pos);
        this.pos++;
        return data;
    };
    init.prototype.readU16 = function () {
        let data = this.view.getUint16(this.pos);
        this.pos += 2;
        return data;
    };
    init.prototype.readI16 = function () {
        let data = this.view.getInt16(this.pos);;
        this.pos += 2;
        return data;
    };
    init.prototype.readU32 = function () {
        let data = this.view.getUint32(this.pos);
        this.pos += 4;
        return data;
    };
    init.prototype.readI32 = function () {
        let data = this.view.getInt32(this.pos);
        this.pos += 4;
        return data;
    };
    init.prototype.readU64 = function () {
        let data = combine64(this.view, this.pos);
        this.pos += 8;
        return data;
    };
    init.prototype.readI64 = function () {
        let data = combine64(this.view, this.pos);
        this.pos += 8;
        return data;
    };
    init.prototype.readF32 = function () {
        let data = this.view.getFloat32(this.pos);
        this.pos += 4;
        return data;
    };
    init.prototype.readF64 = function () {
        let data = this.view.getFloat64(this.pos);
        this.pos += 8;
        return data;
    };
    return init;
}();
var msgpack = window.msgpack = {
    decode: (array) => new lite_decoder().decode(array),
    encode: (data) => new lite_encoder().encode(data),
}