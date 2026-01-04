// ==UserScript==
// @name         bilibili.proto.js
// @version      0.1
// @description  完全由pbjs生成的bilibili分段弹幕处理库
// @author       You
// @match        https://bilibili.com/video/*
// @match        https://bilibili.com/bangumi/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function ($protobuf) {
    // Common aliases
    var $Reader = $protobuf.Reader,
        $Writer = $protobuf.Writer,
        $util = $protobuf.util;

    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

    $root.DanmakuElem = (function () {

        /**
         * Properties of a DanmakuElem.
         * @exports IDanmakuElem
         * @interface IDanmakuElem
         * @property {number|Long|null} [id] DanmakuElem id
         * @property {number|null} [progress] DanmakuElem progress
         * @property {number|null} [mode] DanmakuElem mode
         * @property {number|null} [fontsize] DanmakuElem fontsize
         * @property {number|null} [color] DanmakuElem color
         * @property {string|null} [midHash] DanmakuElem midHash
         * @property {string|null} [content] DanmakuElem content
         * @property {number|Long|null} [ctime] DanmakuElem ctime
         * @property {number|null} [weight] DanmakuElem weight
         * @property {string|null} [action] DanmakuElem action
         * @property {number|null} [pool] DanmakuElem pool
         * @property {string|null} [idStr] DanmakuElem idStr
         */

        /**
         * Constructs a new DanmakuElem.
         * @exports DanmakuElem
         * @classdesc Represents a DanmakuElem.
         * @implements IDanmakuElem
         * @constructor
         * @param {IDanmakuElem=} [properties] Properties to set
         */
        function DanmakuElem(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DanmakuElem id.
         * @member {number|Long} id
         * @memberof DanmakuElem
         * @instance
         */
        DanmakuElem.prototype.id = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * DanmakuElem progress.
         * @member {number} progress
         * @memberof DanmakuElem
         * @instance
         */
        DanmakuElem.prototype.progress = 0;

        /**
         * DanmakuElem mode.
         * @member {number} mode
         * @memberof DanmakuElem
         * @instance
         */
        DanmakuElem.prototype.mode = 0;

        /**
         * DanmakuElem fontsize.
         * @member {number} fontsize
         * @memberof DanmakuElem
         * @instance
         */
        DanmakuElem.prototype.fontsize = 0;

        /**
         * DanmakuElem color.
         * @member {number} color
         * @memberof DanmakuElem
         * @instance
         */
        DanmakuElem.prototype.color = 0;

        /**
         * DanmakuElem midHash.
         * @member {string} midHash
         * @memberof DanmakuElem
         * @instance
         */
        DanmakuElem.prototype.midHash = "";

        /**
         * DanmakuElem content.
         * @member {string} content
         * @memberof DanmakuElem
         * @instance
         */
        DanmakuElem.prototype.content = "";

        /**
         * DanmakuElem ctime.
         * @member {number|Long} ctime
         * @memberof DanmakuElem
         * @instance
         */
        DanmakuElem.prototype.ctime = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * DanmakuElem weight.
         * @member {number} weight
         * @memberof DanmakuElem
         * @instance
         */
        DanmakuElem.prototype.weight = 0;

        /**
         * DanmakuElem action.
         * @member {string} action
         * @memberof DanmakuElem
         * @instance
         */
        DanmakuElem.prototype.action = "";

        /**
         * DanmakuElem pool.
         * @member {number} pool
         * @memberof DanmakuElem
         * @instance
         */
        DanmakuElem.prototype.pool = 0;

        /**
         * DanmakuElem idStr.
         * @member {string} idStr
         * @memberof DanmakuElem
         * @instance
         */
        DanmakuElem.prototype.idStr = "";

        /**
         * Creates a new DanmakuElem instance using the specified properties.
         * @function create
         * @memberof DanmakuElem
         * @static
         * @param {IDanmakuElem=} [properties] Properties to set
         * @returns {DanmakuElem} DanmakuElem instance
         */
        DanmakuElem.create = function create(properties) {
            return new DanmakuElem(properties);
        };

        /**
         * Encodes the specified DanmakuElem message. Does not implicitly {@link DanmakuElem.verify|verify} messages.
         * @function encode
         * @memberof DanmakuElem
         * @static
         * @param {IDanmakuElem} message DanmakuElem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DanmakuElem.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32( /* id 1, wireType 0 =*/ 8).int64(message.id);
            if (message.progress != null && Object.hasOwnProperty.call(message, "progress"))
                writer.uint32( /* id 2, wireType 0 =*/ 16).int32(message.progress);
            if (message.mode != null && Object.hasOwnProperty.call(message, "mode"))
                writer.uint32( /* id 3, wireType 0 =*/ 24).int32(message.mode);
            if (message.fontsize != null && Object.hasOwnProperty.call(message, "fontsize"))
                writer.uint32( /* id 4, wireType 0 =*/ 32).int32(message.fontsize);
            if (message.color != null && Object.hasOwnProperty.call(message, "color"))
                writer.uint32( /* id 5, wireType 0 =*/ 40).uint32(message.color);
            if (message.midHash != null && Object.hasOwnProperty.call(message, "midHash"))
                writer.uint32( /* id 6, wireType 2 =*/ 50).string(message.midHash);
            if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                writer.uint32( /* id 7, wireType 2 =*/ 58).string(message.content);
            if (message.ctime != null && Object.hasOwnProperty.call(message, "ctime"))
                writer.uint32( /* id 8, wireType 0 =*/ 64).int64(message.ctime);
            if (message.weight != null && Object.hasOwnProperty.call(message, "weight"))
                writer.uint32( /* id 9, wireType 0 =*/ 72).int32(message.weight);
            if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                writer.uint32( /* id 10, wireType 2 =*/ 82).string(message.action);
            if (message.pool != null && Object.hasOwnProperty.call(message, "pool"))
                writer.uint32( /* id 11, wireType 0 =*/ 88).int32(message.pool);
            if (message.idStr != null && Object.hasOwnProperty.call(message, "idStr"))
                writer.uint32( /* id 12, wireType 2 =*/ 98).string(message.idStr);
            return writer;
        };

        /**
         * Encodes the specified DanmakuElem message, length delimited. Does not implicitly {@link DanmakuElem.verify|verify} messages.
         * @function encodeDelimited
         * @memberof DanmakuElem
         * @static
         * @param {IDanmakuElem} message DanmakuElem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DanmakuElem.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DanmakuElem message from the specified reader or buffer.
         * @function decode
         * @memberof DanmakuElem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {DanmakuElem} DanmakuElem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DanmakuElem.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length,
                message = new $root.DanmakuElem();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1:
                        message.id = reader.int64();
                        break;
                    case 2:
                        message.progress = reader.int32();
                        break;
                    case 3:
                        message.mode = reader.int32();
                        break;
                    case 4:
                        message.fontsize = reader.int32();
                        break;
                    case 5:
                        message.color = reader.uint32();
                        break;
                    case 6:
                        message.midHash = reader.string();
                        break;
                    case 7:
                        message.content = reader.string();
                        break;
                    case 8:
                        message.ctime = reader.int64();
                        break;
                    case 9:
                        message.weight = reader.int32();
                        break;
                    case 10:
                        message.action = reader.string();
                        break;
                    case 11:
                        message.pool = reader.int32();
                        break;
                    case 12:
                        message.idStr = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a DanmakuElem message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof DanmakuElem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {DanmakuElem} DanmakuElem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DanmakuElem.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DanmakuElem message.
         * @function verify
         * @memberof DanmakuElem
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DanmakuElem.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                    return "id: integer|Long expected";
            if (message.progress != null && message.hasOwnProperty("progress"))
                if (!$util.isInteger(message.progress))
                    return "progress: integer expected";
            if (message.mode != null && message.hasOwnProperty("mode"))
                if (!$util.isInteger(message.mode))
                    return "mode: integer expected";
            if (message.fontsize != null && message.hasOwnProperty("fontsize"))
                if (!$util.isInteger(message.fontsize))
                    return "fontsize: integer expected";
            if (message.color != null && message.hasOwnProperty("color"))
                if (!$util.isInteger(message.color))
                    return "color: integer expected";
            if (message.midHash != null && message.hasOwnProperty("midHash"))
                if (!$util.isString(message.midHash))
                    return "midHash: string expected";
            if (message.content != null && message.hasOwnProperty("content"))
                if (!$util.isString(message.content))
                    return "content: string expected";
            if (message.ctime != null && message.hasOwnProperty("ctime"))
                if (!$util.isInteger(message.ctime) && !(message.ctime && $util.isInteger(message.ctime.low) && $util.isInteger(message.ctime.high)))
                    return "ctime: integer|Long expected";
            if (message.weight != null && message.hasOwnProperty("weight"))
                if (!$util.isInteger(message.weight))
                    return "weight: integer expected";
            if (message.action != null && message.hasOwnProperty("action"))
                if (!$util.isString(message.action))
                    return "action: string expected";
            if (message.pool != null && message.hasOwnProperty("pool"))
                if (!$util.isInteger(message.pool))
                    return "pool: integer expected";
            if (message.idStr != null && message.hasOwnProperty("idStr"))
                if (!$util.isString(message.idStr))
                    return "idStr: string expected";
            return null;
        };

        /**
         * Creates a DanmakuElem message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof DanmakuElem
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {DanmakuElem} DanmakuElem
         */
        DanmakuElem.fromObject = function fromObject(object) {
            if (object instanceof $root.DanmakuElem)
                return object;
            var message = new $root.DanmakuElem();
            if (object.id != null)
                if ($util.Long)
                    (message.id = $util.Long.fromValue(object.id)).unsigned = false;
                else if (typeof object.id === "string")
                message.id = parseInt(object.id, 10);
            else if (typeof object.id === "number")
                message.id = object.id;
            else if (typeof object.id === "object")
                message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber();
            if (object.progress != null)
                message.progress = object.progress | 0;
            if (object.mode != null)
                message.mode = object.mode | 0;
            if (object.fontsize != null)
                message.fontsize = object.fontsize | 0;
            if (object.color != null)
                message.color = object.color >>> 0;
            if (object.midHash != null)
                message.midHash = String(object.midHash);
            if (object.content != null)
                message.content = String(object.content);
            if (object.ctime != null)
                if ($util.Long)
                    (message.ctime = $util.Long.fromValue(object.ctime)).unsigned = false;
                else if (typeof object.ctime === "string")
                message.ctime = parseInt(object.ctime, 10);
            else if (typeof object.ctime === "number")
                message.ctime = object.ctime;
            else if (typeof object.ctime === "object")
                message.ctime = new $util.LongBits(object.ctime.low >>> 0, object.ctime.high >>> 0).toNumber();
            if (object.weight != null)
                message.weight = object.weight | 0;
            if (object.action != null)
                message.action = String(object.action);
            if (object.pool != null)
                message.pool = object.pool | 0;
            if (object.idStr != null)
                message.idStr = String(object.idStr);
            return message;
        };

        /**
         * Creates a plain object from a DanmakuElem message. Also converts values to other types if specified.
         * @function toObject
         * @memberof DanmakuElem
         * @static
         * @param {DanmakuElem} message DanmakuElem
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DanmakuElem.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.id = options.longs === String ? "0" : 0;
                object.progress = 0;
                object.mode = 0;
                object.fontsize = 0;
                object.color = 0;
                object.midHash = "";
                object.content = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.ctime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.ctime = options.longs === String ? "0" : 0;
                object.weight = 0;
                object.action = "";
                object.pool = 0;
                object.idStr = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                if (typeof message.id === "number")
                    object.id = options.longs === String ? String(message.id) : message.id;
                else
                    object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber() : message.id;
            if (message.progress != null && message.hasOwnProperty("progress"))
                object.progress = message.progress;
            if (message.mode != null && message.hasOwnProperty("mode"))
                object.mode = message.mode;
            if (message.fontsize != null && message.hasOwnProperty("fontsize"))
                object.fontsize = message.fontsize;
            if (message.color != null && message.hasOwnProperty("color"))
                object.color = message.color;
            if (message.midHash != null && message.hasOwnProperty("midHash"))
                object.midHash = message.midHash;
            if (message.content != null && message.hasOwnProperty("content"))
                object.content = message.content;
            if (message.ctime != null && message.hasOwnProperty("ctime"))
                if (typeof message.ctime === "number")
                    object.ctime = options.longs === String ? String(message.ctime) : message.ctime;
                else
                    object.ctime = options.longs === String ? $util.Long.prototype.toString.call(message.ctime) : options.longs === Number ? new $util.LongBits(message.ctime.low >>> 0, message.ctime.high >>> 0).toNumber() : message.ctime;
            if (message.weight != null && message.hasOwnProperty("weight"))
                object.weight = message.weight;
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = message.action;
            if (message.pool != null && message.hasOwnProperty("pool"))
                object.pool = message.pool;
            if (message.idStr != null && message.hasOwnProperty("idStr"))
                object.idStr = message.idStr;
            return object;
        };

        /**
         * Converts this DanmakuElem to JSON.
         * @function toJSON
         * @memberof DanmakuElem
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DanmakuElem.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DanmakuElem;
    })();

    $root.DmSegMobileReply = (function () {

        /**
         * Properties of a DmSegMobileReply.
         * @exports IDmSegMobileReply
         * @interface IDmSegMobileReply
         * @property {Array.<IDanmakuElem>|null} [elems] DmSegMobileReply elems
         */

        /**
         * Constructs a new DmSegMobileReply.
         * @exports DmSegMobileReply
         * @classdesc Represents a DmSegMobileReply.
         * @implements IDmSegMobileReply
         * @constructor
         * @param {IDmSegMobileReply=} [properties] Properties to set
         */
        function DmSegMobileReply(properties) {
            this.elems = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DmSegMobileReply elems.
         * @member {Array.<IDanmakuElem>} elems
         * @memberof DmSegMobileReply
         * @instance
         */
        DmSegMobileReply.prototype.elems = $util.emptyArray;

        /**
         * Creates a new DmSegMobileReply instance using the specified properties.
         * @function create
         * @memberof DmSegMobileReply
         * @static
         * @param {IDmSegMobileReply=} [properties] Properties to set
         * @returns {DmSegMobileReply} DmSegMobileReply instance
         */
        DmSegMobileReply.create = function create(properties) {
            return new DmSegMobileReply(properties);
        };

        /**
         * Encodes the specified DmSegMobileReply message. Does not implicitly {@link DmSegMobileReply.verify|verify} messages.
         * @function encode
         * @memberof DmSegMobileReply
         * @static
         * @param {IDmSegMobileReply} message DmSegMobileReply message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DmSegMobileReply.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.elems != null && message.elems.length)
                for (var i = 0; i < message.elems.length; ++i)
                    $root.DanmakuElem.encode(message.elems[i], writer.uint32( /* id 1, wireType 2 =*/ 10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DmSegMobileReply message, length delimited. Does not implicitly {@link DmSegMobileReply.verify|verify} messages.
         * @function encodeDelimited
         * @memberof DmSegMobileReply
         * @static
         * @param {IDmSegMobileReply} message DmSegMobileReply message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DmSegMobileReply.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DmSegMobileReply message from the specified reader or buffer.
         * @function decode
         * @memberof DmSegMobileReply
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {DmSegMobileReply} DmSegMobileReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DmSegMobileReply.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length,
                message = new $root.DmSegMobileReply();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1:
                        if (!(message.elems && message.elems.length))
                            message.elems = [];
                        message.elems.push($root.DanmakuElem.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a DmSegMobileReply message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof DmSegMobileReply
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {DmSegMobileReply} DmSegMobileReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DmSegMobileReply.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DmSegMobileReply message.
         * @function verify
         * @memberof DmSegMobileReply
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DmSegMobileReply.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.elems != null && message.hasOwnProperty("elems")) {
                if (!Array.isArray(message.elems))
                    return "elems: array expected";
                for (var i = 0; i < message.elems.length; ++i) {
                    var error = $root.DanmakuElem.verify(message.elems[i]);
                    if (error)
                        return "elems." + error;
                }
            }
            return null;
        };

        /**
         * Creates a DmSegMobileReply message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof DmSegMobileReply
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {DmSegMobileReply} DmSegMobileReply
         */
        DmSegMobileReply.fromObject = function fromObject(object) {
            if (object instanceof $root.DmSegMobileReply)
                return object;
            var message = new $root.DmSegMobileReply();
            if (object.elems) {
                if (!Array.isArray(object.elems))
                    throw TypeError(".DmSegMobileReply.elems: array expected");
                message.elems = [];
                for (var i = 0; i < object.elems.length; ++i) {
                    if (typeof object.elems[i] !== "object")
                        throw TypeError(".DmSegMobileReply.elems: object expected");
                    message.elems[i] = $root.DanmakuElem.fromObject(object.elems[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a DmSegMobileReply message. Also converts values to other types if specified.
         * @function toObject
         * @memberof DmSegMobileReply
         * @static
         * @param {DmSegMobileReply} message DmSegMobileReply
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DmSegMobileReply.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.elems = [];
            if (message.elems && message.elems.length) {
                object.elems = [];
                for (var j = 0; j < message.elems.length; ++j)
                    object.elems[j] = $root.DanmakuElem.toObject(message.elems[j], options);
            }
            return object;
        };

        /**
         * Converts this DmSegMobileReply to JSON.
         * @function toJSON
         * @memberof DmSegMobileReply
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DmSegMobileReply.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DmSegMobileReply;
    })();
})(protobuf);