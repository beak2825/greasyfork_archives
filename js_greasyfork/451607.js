// ==UserScript==
// @name         jstris+
// @namespace    http://tampermonkey.net/
// @version      2.5.8
// @description  3rd party matchmaking, custom skins/sfx/gfx, and many more improvements to jstris!
// @author       orz and frey
// @run-at       document-idle
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451607/jstris%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/451607/jstris%2B.meta.js
// ==/UserScript==


/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 451:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
exports.g7 = exports.xv = __webpack_unused_export__ = exports.gN = void 0;
var decoder_1 = __webpack_require__(154);
var encoder_1 = __webpack_require__(662);
var field_1 = __webpack_require__(389);
Object.defineProperty(exports, "gN", ({ enumerable: true, get: function () { return field_1.Field; } }));
__webpack_unused_export__ = ({ enumerable: true, get: function () { return field_1.Mino; } });
exports.xv = {
    decode: function (data) {
        return (0, decoder_1.decode)(data);
    },
};
exports.g7 = {
    encode: function (data) {
        return "v115@".concat((0, encoder_1.encode)(data));
    },
};


/***/ }),

/***/ 90:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createActionEncoder = exports.createActionDecoder = void 0;
var defines_1 = __webpack_require__(54);
function decodeBool(n) {
    return n !== 0;
}
var createActionDecoder = function (width, fieldTop, garbageLine) {
    var fieldMaxHeight = fieldTop + garbageLine;
    var numFieldBlocks = fieldMaxHeight * width;
    function decodePiece(n) {
        switch (n) {
            case 0:
                return defines_1.Piece.Empty;
            case 1:
                return defines_1.Piece.I;
            case 2:
                return defines_1.Piece.L;
            case 3:
                return defines_1.Piece.O;
            case 4:
                return defines_1.Piece.Z;
            case 5:
                return defines_1.Piece.T;
            case 6:
                return defines_1.Piece.J;
            case 7:
                return defines_1.Piece.S;
            case 8:
                return defines_1.Piece.Gray;
        }
        throw new Error('Unexpected piece');
    }
    function decodeRotation(n) {
        switch (n) {
            case 0:
                return defines_1.Rotation.Reverse;
            case 1:
                return defines_1.Rotation.Right;
            case 2:
                return defines_1.Rotation.Spawn;
            case 3:
                return defines_1.Rotation.Left;
        }
        throw new Error('Unexpected rotation');
    }
    function decodeCoordinate(n, piece, rotation) {
        var x = n % width;
        var originY = Math.floor(n / 10);
        var y = fieldTop - originY - 1;
        if (piece === defines_1.Piece.O && rotation === defines_1.Rotation.Left) {
            x += 1;
            y -= 1;
        }
        else if (piece === defines_1.Piece.O && rotation === defines_1.Rotation.Reverse) {
            x += 1;
        }
        else if (piece === defines_1.Piece.O && rotation === defines_1.Rotation.Spawn) {
            y -= 1;
        }
        else if (piece === defines_1.Piece.I && rotation === defines_1.Rotation.Reverse) {
            x += 1;
        }
        else if (piece === defines_1.Piece.I && rotation === defines_1.Rotation.Left) {
            y -= 1;
        }
        else if (piece === defines_1.Piece.S && rotation === defines_1.Rotation.Spawn) {
            y -= 1;
        }
        else if (piece === defines_1.Piece.S && rotation === defines_1.Rotation.Right) {
            x -= 1;
        }
        else if (piece === defines_1.Piece.Z && rotation === defines_1.Rotation.Spawn) {
            y -= 1;
        }
        else if (piece === defines_1.Piece.Z && rotation === defines_1.Rotation.Left) {
            x += 1;
        }
        return { x: x, y: y };
    }
    return {
        decode: function (v) {
            var value = v;
            var type = decodePiece(value % 8);
            value = Math.floor(value / 8);
            var rotation = decodeRotation(value % 4);
            value = Math.floor(value / 4);
            var coordinate = decodeCoordinate(value % numFieldBlocks, type, rotation);
            value = Math.floor(value / numFieldBlocks);
            var isBlockUp = decodeBool(value % 2);
            value = Math.floor(value / 2);
            var isMirror = decodeBool(value % 2);
            value = Math.floor(value / 2);
            var isColor = decodeBool(value % 2);
            value = Math.floor(value / 2);
            var isComment = decodeBool(value % 2);
            value = Math.floor(value / 2);
            var isLock = !decodeBool(value % 2);
            return {
                rise: isBlockUp,
                mirror: isMirror,
                colorize: isColor,
                comment: isComment,
                lock: isLock,
                piece: __assign(__assign({}, coordinate), { type: type, rotation: rotation }),
            };
        },
    };
};
exports.createActionDecoder = createActionDecoder;
function encodeBool(flag) {
    return flag ? 1 : 0;
}
var createActionEncoder = function (width, fieldTop, garbageLine) {
    var fieldMaxHeight = fieldTop + garbageLine;
    var numFieldBlocks = fieldMaxHeight * width;
    function encodePosition(operation) {
        var type = operation.type, rotation = operation.rotation;
        var x = operation.x;
        var y = operation.y;
        if (!(0, defines_1.isMinoPiece)(type)) {
            x = 0;
            y = 22;
        }
        else if (type === defines_1.Piece.O && rotation === defines_1.Rotation.Left) {
            x -= 1;
            y += 1;
        }
        else if (type === defines_1.Piece.O && rotation === defines_1.Rotation.Reverse) {
            x -= 1;
        }
        else if (type === defines_1.Piece.O && rotation === defines_1.Rotation.Spawn) {
            y += 1;
        }
        else if (type === defines_1.Piece.I && rotation === defines_1.Rotation.Reverse) {
            x -= 1;
        }
        else if (type === defines_1.Piece.I && rotation === defines_1.Rotation.Left) {
            y += 1;
        }
        else if (type === defines_1.Piece.S && rotation === defines_1.Rotation.Spawn) {
            y += 1;
        }
        else if (type === defines_1.Piece.S && rotation === defines_1.Rotation.Right) {
            x += 1;
        }
        else if (type === defines_1.Piece.Z && rotation === defines_1.Rotation.Spawn) {
            y += 1;
        }
        else if (type === defines_1.Piece.Z && rotation === defines_1.Rotation.Left) {
            x -= 1;
        }
        return (fieldTop - y - 1) * width + x;
    }
    function encodeRotation(_a) {
        var type = _a.type, rotation = _a.rotation;
        if (!(0, defines_1.isMinoPiece)(type)) {
            return 0;
        }
        switch (rotation) {
            case defines_1.Rotation.Reverse:
                return 0;
            case defines_1.Rotation.Right:
                return 1;
            case defines_1.Rotation.Spawn:
                return 2;
            case defines_1.Rotation.Left:
                return 3;
        }
        throw new Error('No reachable');
    }
    return {
        encode: function (action) {
            var lock = action.lock, comment = action.comment, colorize = action.colorize, mirror = action.mirror, rise = action.rise, piece = action.piece;
            var value = encodeBool(!lock);
            value *= 2;
            value += encodeBool(comment);
            value *= 2;
            value += (encodeBool(colorize));
            value *= 2;
            value += encodeBool(mirror);
            value *= 2;
            value += encodeBool(rise);
            value *= numFieldBlocks;
            value += encodePosition(piece);
            value *= 4;
            value += encodeRotation(piece);
            value *= 8;
            value += piece.type;
            return value;
        },
    };
};
exports.createActionEncoder = createActionEncoder;


/***/ }),

/***/ 448:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Buffer = void 0;
var ENCODE_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var Buffer = /** @class */ (function () {
    function Buffer(data) {
        if (data === void 0) { data = ''; }
        this.values = data.split('').map(decodeToValue);
    }
    Buffer.prototype.poll = function (max) {
        var value = 0;
        for (var count = 0; count < max; count += 1) {
            var v = this.values.shift();
            if (v === undefined) {
                throw new Error('Unexpected fumen');
            }
            value += v * Math.pow(Buffer.tableLength, count);
        }
        return value;
    };
    Buffer.prototype.push = function (value, splitCount) {
        if (splitCount === void 0) { splitCount = 1; }
        var current = value;
        for (var count = 0; count < splitCount; count += 1) {
            this.values.push(current % Buffer.tableLength);
            current = Math.floor(current / Buffer.tableLength);
        }
    };
    Buffer.prototype.merge = function (postBuffer) {
        for (var _i = 0, _a = postBuffer.values; _i < _a.length; _i++) {
            var value = _a[_i];
            this.values.push(value);
        }
    };
    Buffer.prototype.isEmpty = function () {
        return this.values.length === 0;
    };
    Object.defineProperty(Buffer.prototype, "length", {
        get: function () {
            return this.values.length;
        },
        enumerable: false,
        configurable: true
    });
    Buffer.prototype.get = function (index) {
        return this.values[index];
    };
    Buffer.prototype.set = function (index, value) {
        this.values[index] = value;
    };
    Buffer.prototype.toString = function () {
        return this.values.map(encodeFromValue).join('');
    };
    Buffer.tableLength = ENCODE_TABLE.length;
    return Buffer;
}());
exports.Buffer = Buffer;
function decodeToValue(v) {
    return ENCODE_TABLE.indexOf(v);
}
function encodeFromValue(index) {
    return ENCODE_TABLE[index];
}


/***/ }),

/***/ 941:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createCommentParser = void 0;
var COMMENT_TABLE = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
var MAX_COMMENT_CHAR_VALUE = COMMENT_TABLE.length + 1;
var createCommentParser = function () {
    return {
        decode: function (v) {
            var str = '';
            var value = v;
            for (var count = 0; count < 4; count += 1) {
                var index = value % MAX_COMMENT_CHAR_VALUE;
                str += COMMENT_TABLE[index];
                value = Math.floor(value / MAX_COMMENT_CHAR_VALUE);
            }
            return str;
        },
        encode: function (ch, count) {
            return COMMENT_TABLE.indexOf(ch) * Math.pow(MAX_COMMENT_CHAR_VALUE, count);
        },
    };
};
exports.createCommentParser = createCommentParser;


/***/ }),

/***/ 154:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decode = exports.extract = exports.Page = void 0;
var inner_field_1 = __webpack_require__(778);
var buffer_1 = __webpack_require__(448);
var defines_1 = __webpack_require__(54);
var action_1 = __webpack_require__(90);
var comments_1 = __webpack_require__(941);
var quiz_1 = __webpack_require__(946);
var field_1 = __webpack_require__(389);
var Page = /** @class */ (function () {
    function Page(index, field, operation, comment, flags, refs) {
        this.index = index;
        this.operation = operation;
        this.comment = comment;
        this.flags = flags;
        this.refs = refs;
        this._field = field.copy();
    }
    Object.defineProperty(Page.prototype, "field", {
        get: function () {
            return new field_1.Field(this._field.copy());
        },
        set: function (field) {
            this._field = (0, inner_field_1.createInnerField)(field);
        },
        enumerable: false,
        configurable: true
    });
    Page.prototype.mino = function () {
        return field_1.Mino.from(this.operation);
    };
    return Page;
}());
exports.Page = Page;
var FieldConstants = {
    GarbageLine: 1,
    Width: 10,
};
function extract(str) {
    var format = function (version, data) {
        var trim = data.trim().replace(/[?\s]+/g, '');
        return { version: version, data: trim };
    };
    var data = str;
    // url parameters
    var paramIndex = data.indexOf('&');
    if (0 <= paramIndex) {
        data = data.substring(0, paramIndex);
    }
    // v115@~
    {
        var match = str.match(/[vmd]115@/);
        if (match !== undefined && match !== null && match.index !== undefined) {
            var sub = data.substr(match.index + 5);
            return format('115', sub);
        }
    }
    // v110@~
    {
        var match = str.match(/[vmd]110@/);
        if (match !== undefined && match !== null && match.index !== undefined) {
            var sub = data.substr(match.index + 5);
            return format('110', sub);
        }
    }
    throw new Error('Unsupported fumen version');
}
exports.extract = extract;
function decode(fumen) {
    var _a = extract(fumen), version = _a.version, data = _a.data;
    switch (version) {
        case '115':
            return innerDecode(data, 23);
        case '110':
            return innerDecode(data, 21);
    }
    throw new Error('Unsupported fumen version');
}
exports.decode = decode;
function innerDecode(data, fieldTop) {
    var fieldMaxHeight = fieldTop + FieldConstants.GarbageLine;
    var numFieldBlocks = fieldMaxHeight * FieldConstants.Width;
    var buffer = new buffer_1.Buffer(data);
    var updateField = function (prev) {
        var result = {
            changed: true,
            field: prev,
        };
        var index = 0;
        while (index < numFieldBlocks) {
            var diffBlock = buffer.poll(2);
            var diff = Math.floor(diffBlock / numFieldBlocks);
            var numOfBlocks = diffBlock % numFieldBlocks;
            if (diff === 8 && numOfBlocks === numFieldBlocks - 1) {
                result.changed = false;
            }
            for (var block = 0; block < numOfBlocks + 1; block += 1) {
                var x = index % FieldConstants.Width;
                var y = fieldTop - Math.floor(index / FieldConstants.Width) - 1;
                result.field.addNumber(x, y, diff - 8);
                index += 1;
            }
        }
        return result;
    };
    var pageIndex = 0;
    var prevField = (0, inner_field_1.createNewInnerField)();
    var store = {
        repeatCount: -1,
        refIndex: {
            comment: 0,
            field: 0,
        },
        quiz: undefined,
        lastCommentText: '',
    };
    var pages = [];
    var actionDecoder = (0, action_1.createActionDecoder)(FieldConstants.Width, fieldTop, FieldConstants.GarbageLine);
    var commentDecoder = (0, comments_1.createCommentParser)();
    while (!buffer.isEmpty()) {
        // Parse field
        var currentFieldObj = void 0;
        if (0 < store.repeatCount) {
            currentFieldObj = {
                field: prevField,
                changed: false,
            };
            store.repeatCount -= 1;
        }
        else {
            currentFieldObj = updateField(prevField.copy());
            if (!currentFieldObj.changed) {
                store.repeatCount = buffer.poll(1);
            }
        }
        // Parse action
        var actionValue = buffer.poll(3);
        var action = actionDecoder.decode(actionValue);
        // Parse comment
        var comment = void 0;
        if (action.comment) {
            // コメントに更新があるとき
            var commentValues = [];
            var commentLength = buffer.poll(2);
            for (var commentCounter = 0; commentCounter < Math.floor((commentLength + 3) / 4); commentCounter += 1) {
                var commentValue = buffer.poll(5);
                commentValues.push(commentValue);
            }
            var flatten = '';
            for (var _i = 0, commentValues_1 = commentValues; _i < commentValues_1.length; _i++) {
                var value = commentValues_1[_i];
                flatten += commentDecoder.decode(value);
            }
            var commentText = unescape(flatten.slice(0, commentLength));
            store.lastCommentText = commentText;
            comment = { text: commentText };
            store.refIndex.comment = pageIndex;
            var text = comment.text;
            if (quiz_1.Quiz.isQuizComment(text)) {
                try {
                    store.quiz = new quiz_1.Quiz(text);
                }
                catch (e) {
                    store.quiz = undefined;
                }
            }
            else {
                store.quiz = undefined;
            }
        }
        else if (pageIndex === 0) {
            // コメントに更新がないが、先頭のページのとき
            comment = { text: '' };
        }
        else {
            // コメントに更新がないとき
            comment = {
                text: store.quiz !== undefined ? store.quiz.format().toString() : undefined,
                ref: store.refIndex.comment,
            };
        }
        // Quiz用の操作を取得し、次ページ開始時点のQuizに1手進める
        var quiz = false;
        if (store.quiz !== undefined) {
            quiz = true;
            if (store.quiz.canOperate() && action.lock) {
                if ((0, defines_1.isMinoPiece)(action.piece.type)) {
                    try {
                        var nextQuiz = store.quiz.nextIfEnd();
                        var operation = nextQuiz.getOperation(action.piece.type);
                        store.quiz = nextQuiz.operate(operation);
                    }
                    catch (e) {
                        // console.error(e.message);
                        // Not operate
                        store.quiz = store.quiz.format();
                    }
                }
                else {
                    store.quiz = store.quiz.format();
                }
            }
        }
        // データ処理用に加工する
        var currentPiece = void 0;
        if (action.piece.type !== defines_1.Piece.Empty) {
            currentPiece = action.piece;
        }
        // pageの作成
        var field = void 0;
        if (currentFieldObj.changed || pageIndex === 0) {
            // フィールドに変化があったとき
            // フィールドに変化がなかったが、先頭のページだったとき
            field = {};
            store.refIndex.field = pageIndex;
        }
        else {
            // フィールドに変化がないとき
            field = { ref: store.refIndex.field };
        }
        pages.push(new Page(pageIndex, currentFieldObj.field, currentPiece !== undefined ? field_1.Mino.from({
            type: (0, defines_1.parsePieceName)(currentPiece.type),
            rotation: (0, defines_1.parseRotationName)(currentPiece.rotation),
            x: currentPiece.x,
            y: currentPiece.y,
        }) : undefined, comment.text !== undefined ? comment.text : store.lastCommentText, {
            quiz: quiz,
            lock: action.lock,
            mirror: action.mirror,
            colorize: action.colorize,
            rise: action.rise,
        }, {
            field: field.ref,
            comment: comment.ref,
        }));
        // callback(
        //     currentFieldObj.field.copy()
        //     , currentPiece
        //     , store.quiz !== undefined ? store.quiz.format().toString() : store.lastCommentText,
        // );
        pageIndex += 1;
        if (action.lock) {
            if ((0, defines_1.isMinoPiece)(action.piece.type)) {
                currentFieldObj.field.fill(action.piece);
            }
            currentFieldObj.field.clearLine();
            if (action.rise) {
                currentFieldObj.field.riseGarbage();
            }
            if (action.mirror) {
                currentFieldObj.field.mirror();
            }
        }
        prevField = currentFieldObj.field;
    }
    return pages;
}


/***/ }),

/***/ 54:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseRotation = exports.parseRotationName = exports.Rotation = exports.parsePiece = exports.parsePieceName = exports.isMinoPiece = exports.Piece = void 0;
var Piece;
(function (Piece) {
    Piece[Piece["Empty"] = 0] = "Empty";
    Piece[Piece["I"] = 1] = "I";
    Piece[Piece["L"] = 2] = "L";
    Piece[Piece["O"] = 3] = "O";
    Piece[Piece["Z"] = 4] = "Z";
    Piece[Piece["T"] = 5] = "T";
    Piece[Piece["J"] = 6] = "J";
    Piece[Piece["S"] = 7] = "S";
    Piece[Piece["Gray"] = 8] = "Gray";
})(Piece = exports.Piece || (exports.Piece = {}));
function isMinoPiece(piece) {
    return piece !== Piece.Empty && piece !== Piece.Gray;
}
exports.isMinoPiece = isMinoPiece;
function parsePieceName(piece) {
    switch (piece) {
        case Piece.I:
            return 'I';
        case Piece.L:
            return 'L';
        case Piece.O:
            return 'O';
        case Piece.Z:
            return 'Z';
        case Piece.T:
            return 'T';
        case Piece.J:
            return 'J';
        case Piece.S:
            return 'S';
        case Piece.Gray:
            return 'X';
        case Piece.Empty:
            return '_';
    }
    throw new Error("Unknown piece: ".concat(piece));
}
exports.parsePieceName = parsePieceName;
function parsePiece(piece) {
    switch (piece.toUpperCase()) {
        case 'I':
            return Piece.I;
        case 'L':
            return Piece.L;
        case 'O':
            return Piece.O;
        case 'Z':
            return Piece.Z;
        case 'T':
            return Piece.T;
        case 'J':
            return Piece.J;
        case 'S':
            return Piece.S;
        case 'X':
        case 'GRAY':
            return Piece.Gray;
        case ' ':
        case '_':
        case 'EMPTY':
            return Piece.Empty;
    }
    throw new Error("Unknown piece: ".concat(piece));
}
exports.parsePiece = parsePiece;
var Rotation;
(function (Rotation) {
    Rotation[Rotation["Spawn"] = 0] = "Spawn";
    Rotation[Rotation["Right"] = 1] = "Right";
    Rotation[Rotation["Reverse"] = 2] = "Reverse";
    Rotation[Rotation["Left"] = 3] = "Left";
})(Rotation = exports.Rotation || (exports.Rotation = {}));
function parseRotationName(rotation) {
    switch (rotation) {
        case Rotation.Spawn:
            return 'spawn';
        case Rotation.Left:
            return 'left';
        case Rotation.Right:
            return 'right';
        case Rotation.Reverse:
            return 'reverse';
    }
    throw new Error("Unknown rotation: ".concat(rotation));
}
exports.parseRotationName = parseRotationName;
function parseRotation(rotation) {
    switch (rotation.toLowerCase()) {
        case 'spawn':
            return Rotation.Spawn;
        case 'left':
            return Rotation.Left;
        case 'right':
            return Rotation.Right;
        case 'reverse':
            return Rotation.Reverse;
    }
    throw new Error("Unknown rotation: ".concat(rotation));
}
exports.parseRotation = parseRotation;


/***/ }),

/***/ 662:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.encode = void 0;
var inner_field_1 = __webpack_require__(778);
var buffer_1 = __webpack_require__(448);
var defines_1 = __webpack_require__(54);
var action_1 = __webpack_require__(90);
var comments_1 = __webpack_require__(941);
var quiz_1 = __webpack_require__(946);
var FieldConstants = {
    GarbageLine: 1,
    Width: 10,
};
function encode(pages) {
    var updateField = function (prev, current) {
        var _a = encodeField(prev, current), changed = _a.changed, values = _a.values;
        if (changed) {
            // フィールドを記録して、リピートを終了する
            buffer.merge(values);
            lastRepeatIndex = -1;
        }
        else if (lastRepeatIndex < 0 || buffer.get(lastRepeatIndex) === buffer_1.Buffer.tableLength - 1) {
            // フィールドを記録して、リピートを開始する
            buffer.merge(values);
            buffer.push(0);
            lastRepeatIndex = buffer.length - 1;
        }
        else if (buffer.get(lastRepeatIndex) < (buffer_1.Buffer.tableLength - 1)) {
            // フィールドは記録せず、リピートを進める
            var currentRepeatValue = buffer.get(lastRepeatIndex);
            buffer.set(lastRepeatIndex, currentRepeatValue + 1);
        }
    };
    var lastRepeatIndex = -1;
    var buffer = new buffer_1.Buffer();
    var prevField = (0, inner_field_1.createNewInnerField)();
    var actionEncoder = (0, action_1.createActionEncoder)(FieldConstants.Width, 23, FieldConstants.GarbageLine);
    var commentParser = (0, comments_1.createCommentParser)();
    var prevComment = '';
    var prevQuiz = undefined;
    var innerEncode = function (index) {
        var currentPage = pages[index];
        currentPage.flags = currentPage.flags ? currentPage.flags : {};
        var field = currentPage.field;
        var currentField = field !== undefined ? (0, inner_field_1.createInnerField)(field) : prevField.copy();
        // フィールドの更新
        updateField(prevField, currentField);
        // アクションの更新
        var currentComment = currentPage.comment !== undefined
            ? ((index !== 0 || currentPage.comment !== '') ? currentPage.comment : undefined)
            : undefined;
        var piece = currentPage.operation !== undefined ? {
            type: (0, defines_1.parsePiece)(currentPage.operation.type),
            rotation: (0, defines_1.parseRotation)(currentPage.operation.rotation),
            x: currentPage.operation.x,
            y: currentPage.operation.y,
        } : {
            type: defines_1.Piece.Empty,
            rotation: defines_1.Rotation.Reverse,
            x: 0,
            y: 22,
        };
        var nextComment;
        if (currentComment !== undefined) {
            if (currentComment.startsWith('#Q=')) {
                // Quiz on
                if (prevQuiz !== undefined && prevQuiz.format().toString() === currentComment) {
                    nextComment = undefined;
                }
                else {
                    nextComment = currentComment;
                    prevComment = nextComment;
                    prevQuiz = new quiz_1.Quiz(currentComment);
                }
            }
            else {
                // Quiz off
                if (prevQuiz !== undefined && prevQuiz.format().toString() === currentComment) {
                    nextComment = undefined;
                    prevComment = currentComment;
                    prevQuiz = undefined;
                }
                else {
                    nextComment = prevComment !== currentComment ? currentComment : undefined;
                    prevComment = prevComment !== currentComment ? nextComment : prevComment;
                    prevQuiz = undefined;
                }
            }
        }
        else {
            nextComment = undefined;
            prevQuiz = undefined;
        }
        if (prevQuiz !== undefined && prevQuiz.canOperate() && currentPage.flags.lock) {
            if ((0, defines_1.isMinoPiece)(piece.type)) {
                try {
                    var nextQuiz = prevQuiz.nextIfEnd();
                    var operation = nextQuiz.getOperation(piece.type);
                    prevQuiz = nextQuiz.operate(operation);
                }
                catch (e) {
                    // console.error(e.message);
                    // Not operate
                    prevQuiz = prevQuiz.format();
                }
            }
            else {
                prevQuiz = prevQuiz.format();
            }
        }
        var currentFlags = __assign({ lock: true, colorize: index === 0 }, currentPage.flags);
        var action = {
            piece: piece,
            rise: !!currentFlags.rise,
            mirror: !!currentFlags.mirror,
            colorize: !!currentFlags.colorize,
            lock: !!currentFlags.lock,
            comment: nextComment !== undefined,
        };
        var actionNumber = actionEncoder.encode(action);
        buffer.push(actionNumber, 3);
        // コメントの更新
        if (nextComment !== undefined) {
            var comment = escape(currentPage.comment);
            var commentLength = Math.min(comment.length, 4095);
            buffer.push(commentLength, 2);
            // コメントを符号化
            for (var index_1 = 0; index_1 < commentLength; index_1 += 4) {
                var value = 0;
                for (var count = 0; count < 4; count += 1) {
                    var newIndex = index_1 + count;
                    if (commentLength <= newIndex) {
                        break;
                    }
                    var ch = comment.charAt(newIndex);
                    value += commentParser.encode(ch, count);
                }
                buffer.push(value, 5);
            }
        }
        else if (currentPage.comment === undefined) {
            prevComment = undefined;
        }
        // 地形の更新
        if (action.lock) {
            if ((0, defines_1.isMinoPiece)(action.piece.type)) {
                currentField.fill(action.piece);
            }
            currentField.clearLine();
            if (action.rise) {
                currentField.riseGarbage();
            }
            if (action.mirror) {
                currentField.mirror();
            }
        }
        prevField = currentField;
    };
    for (var index = 0; index < pages.length; index += 1) {
        innerEncode(index);
    }
    // テト譜が短いときはそのまま出力する
    // 47文字ごとに?が挿入されるが、実際は先頭にv115@が入るため、最初の?は42文字後になる
    var data = buffer.toString();
    if (data.length < 41) {
        return data;
    }
    // ?を挿入する
    var head = [data.substr(0, 42)];
    var tails = data.substring(42);
    var split = tails.match(/[\S]{1,47}/g) || [];
    return head.concat(split).join('?');
}
exports.encode = encode;
// フィールドをエンコードする
// 前のフィールドがないときは空のフィールドを指定する
// 入力フィールドの高さは23, 幅は10
function encodeField(prev, current) {
    var FIELD_TOP = 23;
    var FIELD_MAX_HEIGHT = FIELD_TOP + 1;
    var FIELD_BLOCKS = FIELD_MAX_HEIGHT * FieldConstants.Width;
    var buffer = new buffer_1.Buffer();
    // 前のフィールドとの差を計算: 0〜16
    var getDiff = function (xIndex, yIndex) {
        var y = FIELD_TOP - yIndex - 1;
        return current.getNumberAt(xIndex, y) - prev.getNumberAt(xIndex, y) + 8;
    };
    // データの記録
    var recordBlockCounts = function (diff, counter) {
        var value = diff * FIELD_BLOCKS + counter;
        buffer.push(value, 2);
    };
    // フィールド値から連続したブロック数に変換
    var changed = true;
    var prev_diff = getDiff(0, 0);
    var counter = -1;
    for (var yIndex = 0; yIndex < FIELD_MAX_HEIGHT; yIndex += 1) {
        for (var xIndex = 0; xIndex < FieldConstants.Width; xIndex += 1) {
            var diff = getDiff(xIndex, yIndex);
            if (diff !== prev_diff) {
                recordBlockCounts(prev_diff, counter);
                counter = 0;
                prev_diff = diff;
            }
            else {
                counter += 1;
            }
        }
    }
    // 最後の連続ブロックを処理
    recordBlockCounts(prev_diff, counter);
    if (prev_diff === 8 && counter === FIELD_BLOCKS - 1) {
        changed = false;
    }
    return {
        changed: changed,
        values: buffer,
    };
}


/***/ }),

/***/ 389:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Mino = exports.Field = void 0;
var inner_field_1 = __webpack_require__(778);
var defines_1 = __webpack_require__(54);
function toMino(operationOrMino) {
    return operationOrMino instanceof Mino ? operationOrMino.copy() : Mino.from(operationOrMino);
}
var Field = /** @class */ (function () {
    function Field(field) {
        this.field = field;
    }
    Field.create = function (field, garbage) {
        return new Field(new inner_field_1.InnerField({
            field: field !== undefined ? inner_field_1.PlayField.load(field) : undefined,
            garbage: garbage !== undefined ? inner_field_1.PlayField.loadMinify(garbage) : undefined,
        }));
    };
    Field.prototype.canFill = function (operation) {
        if (operation === undefined) {
            return true;
        }
        var mino = toMino(operation);
        return this.field.canFillAll(mino.positions());
    };
    Field.prototype.canLock = function (operation) {
        if (operation === undefined) {
            return true;
        }
        if (!this.canFill(operation)) {
            return false;
        }
        // Check on the ground
        return !this.canFill(__assign(__assign({}, operation), { y: operation.y - 1 }));
    };
    Field.prototype.fill = function (operation, force) {
        if (force === void 0) { force = false; }
        if (operation === undefined) {
            return undefined;
        }
        var mino = toMino(operation);
        if (!force && !this.canFill(mino)) {
            throw Error('Cannot fill piece on field');
        }
        this.field.fillAll(mino.positions(), (0, defines_1.parsePiece)(mino.type));
        return mino;
    };
    Field.prototype.put = function (operation) {
        if (operation === undefined) {
            return undefined;
        }
        var mino = toMino(operation);
        for (; 0 <= mino.y; mino.y -= 1) {
            if (!this.canLock(mino)) {
                continue;
            }
            this.fill(mino);
            return mino;
        }
        throw Error('Cannot put piece on field');
    };
    Field.prototype.clearLine = function () {
        this.field.clearLine();
    };
    Field.prototype.at = function (x, y) {
        return (0, defines_1.parsePieceName)(this.field.getNumberAt(x, y));
    };
    Field.prototype.set = function (x, y, type) {
        this.field.setNumberAt(x, y, (0, defines_1.parsePiece)(type));
    };
    Field.prototype.copy = function () {
        return new Field(this.field.copy());
    };
    Field.prototype.str = function (option) {
        if (option === void 0) { option = {}; }
        var skip = option.reduced !== undefined ? option.reduced : true;
        var separator = option.separator !== undefined ? option.separator : '\n';
        var minY = option.garbage === undefined || option.garbage ? -1 : 0;
        var output = '';
        for (var y = 22; minY <= y; y -= 1) {
            var line = '';
            for (var x = 0; x < 10; x += 1) {
                line += this.at(x, y);
            }
            if (skip && line === '__________') {
                continue;
            }
            skip = false;
            output += line;
            if (y !== minY) {
                output += separator;
            }
        }
        return output;
    };
    return Field;
}());
exports.Field = Field;
var Mino = /** @class */ (function () {
    function Mino(type, rotation, x, y) {
        this.type = type;
        this.rotation = rotation;
        this.x = x;
        this.y = y;
    }
    Mino.from = function (operation) {
        return new Mino(operation.type, operation.rotation, operation.x, operation.y);
    };
    Mino.prototype.positions = function () {
        return (0, inner_field_1.getBlockXYs)((0, defines_1.parsePiece)(this.type), (0, defines_1.parseRotation)(this.rotation), this.x, this.y).sort(function (a, b) {
            if (a.y === b.y) {
                return a.x - b.x;
            }
            return a.y - b.y;
        });
    };
    Mino.prototype.operation = function () {
        return {
            type: this.type,
            rotation: this.rotation,
            x: this.x,
            y: this.y,
        };
    };
    Mino.prototype.isValid = function () {
        try {
            (0, defines_1.parsePiece)(this.type);
            (0, defines_1.parseRotation)(this.rotation);
        }
        catch (e) {
            return false;
        }
        return this.positions().every(function (_a) {
            var x = _a.x, y = _a.y;
            return 0 <= x && x < 10 && 0 <= y && y < 23;
        });
    };
    Mino.prototype.copy = function () {
        return new Mino(this.type, this.rotation, this.x, this.y);
    };
    return Mino;
}());
exports.Mino = Mino;


/***/ }),

/***/ 778:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPieces = exports.getBlocks = exports.getBlockXYs = exports.getBlockPositions = exports.PlayField = exports.InnerField = exports.createInnerField = exports.createNewInnerField = void 0;
var defines_1 = __webpack_require__(54);
var FieldConstants = {
    Width: 10,
    Height: 23,
    PlayBlocks: 23 * 10, // Height * Width
};
function createNewInnerField() {
    return new InnerField({});
}
exports.createNewInnerField = createNewInnerField;
function createInnerField(field) {
    var innerField = new InnerField({});
    for (var y = -1; y < FieldConstants.Height; y += 1) {
        for (var x = 0; x < FieldConstants.Width; x += 1) {
            var at = field.at(x, y);
            innerField.setNumberAt(x, y, (0, defines_1.parsePiece)(at));
        }
    }
    return innerField;
}
exports.createInnerField = createInnerField;
var InnerField = /** @class */ (function () {
    function InnerField(_a) {
        var _b = _a.field, field = _b === void 0 ? InnerField.create(FieldConstants.PlayBlocks) : _b, _c = _a.garbage, garbage = _c === void 0 ? InnerField.create(FieldConstants.Width) : _c;
        this.field = field;
        this.garbage = garbage;
    }
    InnerField.create = function (length) {
        return new PlayField({ length: length });
    };
    InnerField.prototype.fill = function (operation) {
        this.field.fill(operation);
    };
    InnerField.prototype.fillAll = function (positions, type) {
        this.field.fillAll(positions, type);
    };
    InnerField.prototype.canFill = function (piece, rotation, x, y) {
        var _this = this;
        var positions = getBlockPositions(piece, rotation, x, y);
        return positions.every(function (_a) {
            var px = _a[0], py = _a[1];
            return 0 <= px && px < 10
                && 0 <= py && py < FieldConstants.Height
                && _this.getNumberAt(px, py) === defines_1.Piece.Empty;
        });
    };
    InnerField.prototype.canFillAll = function (positions) {
        var _this = this;
        return positions.every(function (_a) {
            var x = _a.x, y = _a.y;
            return 0 <= x && x < 10
                && 0 <= y && y < FieldConstants.Height
                && _this.getNumberAt(x, y) === defines_1.Piece.Empty;
        });
    };
    InnerField.prototype.isOnGround = function (piece, rotation, x, y) {
        return !this.canFill(piece, rotation, x, y - 1);
    };
    InnerField.prototype.clearLine = function () {
        this.field.clearLine();
    };
    InnerField.prototype.riseGarbage = function () {
        this.field.up(this.garbage);
        this.garbage.clearAll();
    };
    InnerField.prototype.mirror = function () {
        this.field.mirror();
    };
    InnerField.prototype.shiftToLeft = function () {
        this.field.shiftToLeft();
    };
    InnerField.prototype.shiftToRight = function () {
        this.field.shiftToRight();
    };
    InnerField.prototype.shiftToUp = function () {
        this.field.shiftToUp();
    };
    InnerField.prototype.shiftToBottom = function () {
        this.field.shiftToBottom();
    };
    InnerField.prototype.copy = function () {
        return new InnerField({ field: this.field.copy(), garbage: this.garbage.copy() });
    };
    InnerField.prototype.equals = function (other) {
        return this.field.equals(other.field) && this.garbage.equals(other.garbage);
    };
    InnerField.prototype.addNumber = function (x, y, value) {
        if (0 <= y) {
            this.field.addOffset(x, y, value);
        }
        else {
            this.garbage.addOffset(x, -(y + 1), value);
        }
    };
    InnerField.prototype.setNumberFieldAt = function (index, value) {
        this.field.setAt(index, value);
    };
    InnerField.prototype.setNumberGarbageAt = function (index, value) {
        this.garbage.setAt(index, value);
    };
    InnerField.prototype.setNumberAt = function (x, y, value) {
        return 0 <= y ? this.field.set(x, y, value) : this.garbage.set(x, -(y + 1), value);
    };
    InnerField.prototype.getNumberAt = function (x, y) {
        return 0 <= y ? this.field.get(x, y) : this.garbage.get(x, -(y + 1));
    };
    InnerField.prototype.getNumberAtIndex = function (index, isField) {
        if (isField) {
            return this.getNumberAt(index % 10, Math.floor(index / 10));
        }
        return this.getNumberAt(index % 10, -(Math.floor(index / 10) + 1));
    };
    InnerField.prototype.toFieldNumberArray = function () {
        return this.field.toArray();
    };
    InnerField.prototype.toGarbageNumberArray = function () {
        return this.garbage.toArray();
    };
    return InnerField;
}());
exports.InnerField = InnerField;
var PlayField = /** @class */ (function () {
    function PlayField(_a) {
        var pieces = _a.pieces, _b = _a.length, length = _b === void 0 ? FieldConstants.PlayBlocks : _b;
        if (pieces !== undefined) {
            this.pieces = pieces;
        }
        else {
            this.pieces = Array.from({ length: length }).map(function () { return defines_1.Piece.Empty; });
        }
        this.length = length;
    }
    PlayField.load = function () {
        var lines = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            lines[_i] = arguments[_i];
        }
        var blocks = lines.join('').trim();
        return PlayField.loadInner(blocks);
    };
    PlayField.loadMinify = function () {
        var lines = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            lines[_i] = arguments[_i];
        }
        var blocks = lines.join('').trim();
        return PlayField.loadInner(blocks, blocks.length);
    };
    PlayField.loadInner = function (blocks, length) {
        var len = length !== undefined ? length : blocks.length;
        if (len % 10 !== 0) {
            throw new Error('Num of blocks in field should be mod 10');
        }
        var field = length !== undefined ? new PlayField({ length: length }) : new PlayField({});
        for (var index = 0; index < len; index += 1) {
            var block = blocks[index];
            field.set(index % 10, Math.floor((len - index - 1) / 10), (0, defines_1.parsePiece)(block));
        }
        return field;
    };
    PlayField.prototype.get = function (x, y) {
        return this.pieces[x + y * FieldConstants.Width];
    };
    PlayField.prototype.addOffset = function (x, y, value) {
        this.pieces[x + y * FieldConstants.Width] += value;
    };
    PlayField.prototype.set = function (x, y, piece) {
        this.setAt(x + y * FieldConstants.Width, piece);
    };
    PlayField.prototype.setAt = function (index, piece) {
        this.pieces[index] = piece;
    };
    PlayField.prototype.fill = function (_a) {
        var type = _a.type, rotation = _a.rotation, x = _a.x, y = _a.y;
        var blocks = getBlocks(type, rotation);
        for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
            var block = blocks_1[_i];
            var _b = [x + block[0], y + block[1]], nx = _b[0], ny = _b[1];
            this.set(nx, ny, type);
        }
    };
    PlayField.prototype.fillAll = function (positions, type) {
        for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
            var _a = positions_1[_i], x = _a.x, y = _a.y;
            this.set(x, y, type);
        }
    };
    PlayField.prototype.clearLine = function () {
        var newField = this.pieces.concat();
        var top = this.pieces.length / FieldConstants.Width - 1;
        for (var y = top; 0 <= y; y -= 1) {
            var line = this.pieces.slice(y * FieldConstants.Width, (y + 1) * FieldConstants.Width);
            var isFilled = line.every(function (value) { return value !== defines_1.Piece.Empty; });
            if (isFilled) {
                var bottom = newField.slice(0, y * FieldConstants.Width);
                var over = newField.slice((y + 1) * FieldConstants.Width);
                newField = bottom.concat(over, Array.from({ length: FieldConstants.Width }).map(function () { return defines_1.Piece.Empty; }));
            }
        }
        this.pieces = newField;
    };
    PlayField.prototype.up = function (blockUp) {
        this.pieces = blockUp.pieces.concat(this.pieces).slice(0, this.length);
    };
    PlayField.prototype.mirror = function () {
        var newField = [];
        for (var y = 0; y < this.pieces.length; y += 1) {
            var line = this.pieces.slice(y * FieldConstants.Width, (y + 1) * FieldConstants.Width);
            line.reverse();
            for (var _i = 0, line_1 = line; _i < line_1.length; _i++) {
                var obj = line_1[_i];
                newField.push(obj);
            }
        }
        this.pieces = newField;
    };
    PlayField.prototype.shiftToLeft = function () {
        var height = this.pieces.length / 10;
        for (var y = 0; y < height; y += 1) {
            for (var x = 0; x < FieldConstants.Width - 1; x += 1) {
                this.pieces[x + y * FieldConstants.Width] = this.pieces[x + 1 + y * FieldConstants.Width];
            }
            this.pieces[9 + y * FieldConstants.Width] = defines_1.Piece.Empty;
        }
    };
    PlayField.prototype.shiftToRight = function () {
        var height = this.pieces.length / 10;
        for (var y = 0; y < height; y += 1) {
            for (var x = FieldConstants.Width - 1; 1 <= x; x -= 1) {
                this.pieces[x + y * FieldConstants.Width] = this.pieces[x - 1 + y * FieldConstants.Width];
            }
            this.pieces[y * FieldConstants.Width] = defines_1.Piece.Empty;
        }
    };
    PlayField.prototype.shiftToUp = function () {
        var blanks = Array.from({ length: 10 }).map(function () { return defines_1.Piece.Empty; });
        this.pieces = blanks.concat(this.pieces).slice(0, this.length);
    };
    PlayField.prototype.shiftToBottom = function () {
        var blanks = Array.from({ length: 10 }).map(function () { return defines_1.Piece.Empty; });
        this.pieces = this.pieces.slice(10, this.length).concat(blanks);
    };
    PlayField.prototype.toArray = function () {
        return this.pieces.concat();
    };
    Object.defineProperty(PlayField.prototype, "numOfBlocks", {
        get: function () {
            return this.pieces.length;
        },
        enumerable: false,
        configurable: true
    });
    PlayField.prototype.copy = function () {
        return new PlayField({ pieces: this.pieces.concat(), length: this.length });
    };
    PlayField.prototype.toShallowArray = function () {
        return this.pieces;
    };
    PlayField.prototype.clearAll = function () {
        this.pieces = this.pieces.map(function () { return defines_1.Piece.Empty; });
    };
    PlayField.prototype.equals = function (other) {
        if (this.pieces.length !== other.pieces.length) {
            return false;
        }
        for (var index = 0; index < this.pieces.length; index += 1) {
            if (this.pieces[index] !== other.pieces[index]) {
                return false;
            }
        }
        return true;
    };
    return PlayField;
}());
exports.PlayField = PlayField;
function getBlockPositions(piece, rotation, x, y) {
    return getBlocks(piece, rotation).map(function (position) {
        position[0] += x;
        position[1] += y;
        return position;
    });
}
exports.getBlockPositions = getBlockPositions;
function getBlockXYs(piece, rotation, x, y) {
    return getBlocks(piece, rotation).map(function (position) {
        return { x: position[0] + x, y: position[1] + y };
    });
}
exports.getBlockXYs = getBlockXYs;
function getBlocks(piece, rotation) {
    var blocks = getPieces(piece);
    switch (rotation) {
        case defines_1.Rotation.Spawn:
            return blocks;
        case defines_1.Rotation.Left:
            return rotateLeft(blocks);
        case defines_1.Rotation.Reverse:
            return rotateReverse(blocks);
        case defines_1.Rotation.Right:
            return rotateRight(blocks);
    }
    throw new Error('Unsupported block');
}
exports.getBlocks = getBlocks;
function getPieces(piece) {
    switch (piece) {
        case defines_1.Piece.I:
            return [[0, 0], [-1, 0], [1, 0], [2, 0]];
        case defines_1.Piece.T:
            return [[0, 0], [-1, 0], [1, 0], [0, 1]];
        case defines_1.Piece.O:
            return [[0, 0], [1, 0], [0, 1], [1, 1]];
        case defines_1.Piece.L:
            return [[0, 0], [-1, 0], [1, 0], [1, 1]];
        case defines_1.Piece.J:
            return [[0, 0], [-1, 0], [1, 0], [-1, 1]];
        case defines_1.Piece.S:
            return [[0, 0], [-1, 0], [0, 1], [1, 1]];
        case defines_1.Piece.Z:
            return [[0, 0], [1, 0], [0, 1], [-1, 1]];
    }
    throw new Error('Unsupported rotation');
}
exports.getPieces = getPieces;
function rotateRight(positions) {
    return positions.map(function (current) { return [current[1], -current[0]]; });
}
function rotateLeft(positions) {
    return positions.map(function (current) { return [-current[1], current[0]]; });
}
function rotateReverse(positions) {
    return positions.map(function (current) { return [-current[0], -current[1]]; });
}


/***/ }),

/***/ 946:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Quiz = void 0;
var defines_1 = __webpack_require__(54);
var Operation;
(function (Operation) {
    Operation["Direct"] = "direct";
    Operation["Swap"] = "swap";
    Operation["Stock"] = "stock";
})(Operation || (Operation = {}));
var Quiz = /** @class */ (function () {
    function Quiz(quiz) {
        this.quiz = Quiz.verify(quiz);
    }
    Object.defineProperty(Quiz.prototype, "next", {
        get: function () {
            var index = this.quiz.indexOf(')') + 1;
            var name = this.quiz[index];
            if (name === undefined || name === ';') {
                return '';
            }
            return name;
        },
        enumerable: false,
        configurable: true
    });
    Quiz.isQuizComment = function (comment) {
        return comment.startsWith('#Q=');
    };
    Quiz.create = function (first, second) {
        var create = function (hold, other) {
            var parse = function (s) { return s ? s : ''; };
            return new Quiz("#Q=[".concat(parse(hold), "](").concat(parse(other[0]), ")").concat(parse(other.substring(1))));
        };
        return second !== undefined ? create(first, second) : create(undefined, first);
    };
    Quiz.trim = function (quiz) {
        return quiz.trim().replace(/\s+/g, '');
    };
    Object.defineProperty(Quiz.prototype, "least", {
        get: function () {
            var index = this.quiz.indexOf(')');
            return this.quiz.substr(index + 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Quiz.prototype, "current", {
        get: function () {
            var index = this.quiz.indexOf('(') + 1;
            var name = this.quiz[index];
            if (name === ')') {
                return '';
            }
            return name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Quiz.prototype, "hold", {
        get: function () {
            var index = this.quiz.indexOf('[') + 1;
            var name = this.quiz[index];
            if (name === ']') {
                return '';
            }
            return name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Quiz.prototype, "leastAfterNext2", {
        get: function () {
            var index = this.quiz.indexOf(')');
            if (this.quiz[index + 1] === ';') {
                return this.quiz.substr(index + 1);
            }
            return this.quiz.substr(index + 2);
        },
        enumerable: false,
        configurable: true
    });
    Quiz.prototype.getOperation = function (used) {
        var usedName = (0, defines_1.parsePieceName)(used);
        var current = this.current;
        if (usedName === current) {
            return Operation.Direct;
        }
        var hold = this.hold;
        if (usedName === hold) {
            return Operation.Swap;
        }
        // 次のミノを利用できる
        if (hold === '') {
            if (usedName === this.next) {
                return Operation.Stock;
            }
        }
        else {
            if (current === '' && usedName === this.next) {
                return Operation.Direct;
            }
        }
        throw new Error("Unexpected hold piece in quiz: ".concat(this.quiz));
    };
    Object.defineProperty(Quiz.prototype, "leastInActiveBag", {
        get: function () {
            var separateIndex = this.quiz.indexOf(';');
            var quiz = 0 <= separateIndex ? this.quiz.substring(0, separateIndex) : this.quiz;
            var index = quiz.indexOf(')');
            if (quiz[index + 1] === ';') {
                return quiz.substr(index + 1);
            }
            return quiz.substr(index + 2);
        },
        enumerable: false,
        configurable: true
    });
    Quiz.verify = function (quiz) {
        var replaced = this.trim(quiz);
        if (replaced.length === 0 || quiz === '#Q=[]()' || !quiz.startsWith('#Q=')) {
            return quiz;
        }
        if (!replaced.match(/^#Q=\[[TIOSZJL]?]\([TIOSZJL]?\)[TIOSZJL]*;?.*$/i)) {
            throw new Error("Current piece doesn't exist, however next pieces exist: ".concat(quiz));
        }
        return replaced;
    };
    Quiz.prototype.direct = function () {
        if (this.current === '') {
            var least = this.leastAfterNext2;
            return new Quiz("#Q=[".concat(this.hold, "](").concat(least[0], ")").concat(least.substr(1)));
        }
        return new Quiz("#Q=[".concat(this.hold, "](").concat(this.next, ")").concat(this.leastAfterNext2));
    };
    Quiz.prototype.swap = function () {
        if (this.hold === '') {
            throw new Error("Cannot find hold piece: ".concat(this.quiz));
        }
        var next = this.next;
        return new Quiz("#Q=[".concat(this.current, "](").concat(next, ")").concat(this.leastAfterNext2));
    };
    Quiz.prototype.stock = function () {
        if (this.hold !== '' || this.next === '') {
            throw new Error("Cannot stock: ".concat(this.quiz));
        }
        var least = this.leastAfterNext2;
        var head = least[0] !== undefined ? least[0] : '';
        if (1 < least.length) {
            return new Quiz("#Q=[".concat(this.current, "](").concat(head, ")").concat(least.substr(1)));
        }
        return new Quiz("#Q=[".concat(this.current, "](").concat(head, ")"));
    };
    Quiz.prototype.operate = function (operation) {
        switch (operation) {
            case Operation.Direct:
                return this.direct();
            case Operation.Swap:
                return this.swap();
            case Operation.Stock:
                return this.stock();
        }
        throw new Error('Unexpected operation');
    };
    Quiz.prototype.format = function () {
        var quiz = this.nextIfEnd();
        if (quiz.quiz === '#Q=[]()') {
            return new Quiz('');
        }
        var current = quiz.current;
        var hold = quiz.hold;
        if (current === '' && hold !== '') {
            return new Quiz("#Q=[](".concat(hold, ")").concat(quiz.least));
        }
        if (current === '') {
            var least = quiz.least;
            var head = least[0];
            if (head === undefined) {
                return new Quiz('');
            }
            if (head === ';') {
                return new Quiz(least.substr(1));
            }
            return new Quiz("#Q=[](".concat(head, ")").concat(least.substr(1)));
        }
        return quiz;
    };
    Quiz.prototype.getHoldPiece = function () {
        if (!this.canOperate()) {
            return defines_1.Piece.Empty;
        }
        var name = this.hold;
        if (name === undefined || name === '' || name === ';') {
            return defines_1.Piece.Empty;
        }
        return (0, defines_1.parsePiece)(name);
    };
    Quiz.prototype.getNextPieces = function (max) {
        if (!this.canOperate()) {
            return max !== undefined ? Array.from({ length: max }).map(function () { return defines_1.Piece.Empty; }) : [];
        }
        var names = (this.current + this.next + this.leastInActiveBag).substr(0, max);
        if (max !== undefined && names.length < max) {
            names += ' '.repeat(max - names.length);
        }
        return names.split('').map(function (name) {
            if (name === undefined || name === ' ' || name === ';') {
                return defines_1.Piece.Empty;
            }
            return (0, defines_1.parsePiece)(name);
        });
    };
    Quiz.prototype.toString = function () {
        return this.quiz;
    };
    Quiz.prototype.canOperate = function () {
        var quiz = this.quiz;
        if (quiz.startsWith('#Q=[]();')) {
            quiz = this.quiz.substr(8);
        }
        return quiz.startsWith('#Q=') && quiz !== '#Q=[]()';
    };
    Quiz.prototype.nextIfEnd = function () {
        if (this.quiz.startsWith('#Q=[]();')) {
            return new Quiz(this.quiz.substr(8));
        }
        return this;
    };
    return Quiz;
}());
exports.Quiz = Quiz;


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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: ./src/config.js
// these are default values
var config = {
  FIRST_OPEN: true,

  ENABLE_LINECLEAR_ANIMATION: true,
  ENABLE_LINECLEAR_SHAKE: true,
  ENABLE_PLACE_BLOCK_ANIMATION: true,
  ENABLE_ACTION_TEXT: true,

  PIECE_FLASH_OPACITY: 0.5,
  PIECE_FLASH_LENGTH: 0.5,
  LINE_CLEAR_LENGTH: 0.5,
  LINE_CLEAR_SHAKE_STRENGTH: 1,
  LINE_CLEAR_SHAKE_LENGTH: 1,

  BACKGROUND_IMAGE_URL: "",
  CUSTOM_SKIN_URL: "",
  CUSTOM_GHOST_SKIN_URL: "",
  ENABLE_REPLAY_SKIN: true,
  ENABLE_KEYBOARD_DISPLAY: false,

  ENABLE_OPPONENT_SFX: true,
  OPPONENT_SFX_VOLUME_MULTPLIER: 0.5,
  ENABLE_CUSTOM_VFX: false,
  ENABLE_CUSTOM_SFX: false,
  CUSTOM_SFX_JSON: "",
  CUSTOM_PLUS_SFX_JSON: "",

  ENABLE_STAT_APP: false,
  ENABLE_STAT_PPD: false,
  ENABLE_STAT_CHEESE_BLOCK_PACE: false,
  ENABLE_STAT_CHEESE_TIME_PACE: false,
  ENABLE_STAT_PPB: false,
  ENABLE_STAT_SCORE_PACE: false,
  ENABLE_STAT_PC_NUMBER: false,

  ENABLE_AUTOMATIC_REPLAY_CODES: false,
  ENABLE_CHAT_TIMESTAMPS: true,
  SHOW_QUEUE_INFO: true,
  SHOW_MM_BUTTON: true,
  TOGGLE_CHAT_KEYCODE: null,
  CLOSE_CHAT_KEYCODE: null,
  SCREENSHOT_KEYCODE: null,

  UNDO_KEYCODE: null,
};

const defaultConfig = { ...config };

var listeners = [];

const initConfig = () => {
  for (var i in config) {
    var val = JSON.parse(localStorage.getItem(i));
    if (val != undefined && val != null) {
      config[i] = val;
    }
  }
}

const set = function (name, val) {
  config[name] = val;
  localStorage.setItem(name, JSON.stringify(val));
  for (var { event, listener } of listeners) {
    if (event == name)
      listener(val);
  }
}

const config_reset = function (name) {
  set(name, defaultConfig[name]);
}

const onChange = (event, listener) => {
  listeners.push({ event, listener });
}

const Config = () => ({ ...config, set, onChange, reset: config_reset });
;// CONCATENATED MODULE: ./src/util.js
const shouldRenderEffectsOnView = (view) => {
  return view.holdCanvas && view.holdCanvas.width >= 70;
}


const lerp = (start, end, amt) => {
  return (1 - amt) * start + amt * end;
}

// https://jsfiddle.net/12aueufy/1/
var shakingElements = [];

const shake = function (element, magnitude = 16, numberOfShakes = 15, angular = false) {
  if (!element) return;

  //First set the initial tilt angle to the right (+1)
  var tiltAngle = 1;

  //A counter to count the number of shakes
  var counter = 1;

  //The total number of shakes (there will be 1 shake per frame)

  //Capture the element's position and angle so you can
  //restore them after the shaking has finished
  var startX = 0,
    startY = 0,
    startAngle = 0;

  // Divide the magnitude into 10 units so that you can
  // reduce the amount of shake by 10 percent each frame
  var magnitudeUnit = magnitude / numberOfShakes;

  //The `randomInt` helper function
  var randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //Add the element to the `shakingElements` array if it
  //isn't already there


  if (shakingElements.indexOf(element) === -1) {
    //console.log("added")
    shakingElements.push(element);

    //Add an `updateShake` method to the element.
    //The `updateShake` method will be called each frame
    //in the game loop. The shake effect type can be either
    //up and down (x/y shaking) or angular (rotational shaking).
    if (angular) {
      angularShake();
    } else {
      upAndDownShake();
    }
  }

  //The `upAndDownShake` function
  function upAndDownShake() {

    //Shake the element while the `counter` is less than
    //the `numberOfShakes`
    if (counter < numberOfShakes) {

      //Reset the element's position at the start of each shake
      element.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)';

      //Reduce the magnitude
      magnitude -= magnitudeUnit;

      //Randomly change the element's position
      var randomX = randomInt(-magnitude, magnitude);
      var randomY = randomInt(-magnitude, magnitude);

      element.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';

      //Add 1 to the counter
      counter += 1;

      requestAnimationFrame(upAndDownShake);
    }

    //When the shaking is finished, restore the element to its original
    //position and remove it from the `shakingElements` array
    if (counter >= numberOfShakes) {
      element.style.transform = 'translate(' + startX + ', ' + startY + ')';
      shakingElements.splice(shakingElements.indexOf(element), 1);
    }
  }

  //The `angularShake` function
  function angularShake() {
    if (counter < numberOfShakes) {

      //Reset the element's rotation
      element.style.transform = 'rotate(' + startAngle + 'deg)';

      //Reduce the magnitude
      magnitude -= magnitudeUnit;

      //Rotate the element left or right, depending on the direction,
      //by an amount in radians that matches the magnitude
      var angle = Number(magnitude * tiltAngle).toFixed(2);

      element.style.transform = 'rotate(' + angle + 'deg)';
      counter += 1;

      //Reverse the tilt angle so that the element is tilted
      //in the opposite direction for the next shake
      tiltAngle *= -1;

      requestAnimationFrame(angularShake);
    }

    //When the shaking is finished, reset the element's angle and
    //remove it from the `shakingElements` array
    if (counter >= numberOfShakes) {
      element.style.transform = 'rotate(' + startAngle + 'deg)';
      shakingElements.splice(shakingElements.indexOf(element), 1);
    }
  }

};


// @params callback: (name: string , loggedIn: boolean) => {}
const getPlayerName = (callback) => {
  fetch("https://jstris.jezevec10.com/profile").then(res => {
    if (res.url.includes("/u/")) {
      let username = res.url.substring(res.url.indexOf("/u/") + 3);
      callback(username, true);
    } else {
      callback("", false)
    }
  }).catch(e => {
    console.log(e);
    callback("", false)
  })
}

let notificationsSupported = false

const authNotification = () => {
  if (!window.Notification) {
    notificationsSupported = false
  } else if (Notification.permission != 'granted') {
    Notification.requestPermission().then((p) => {
      if (p === 'granted') {
        notificationsSupported = true
      } else {
        console.log('User has blocked notifications.')
      }
    }).catch((err) => {
      console.error(err)
    })
  } else {
    notificationsSupported = true
  }
}

const notify = (title, body) => {
  if (notificationsSupported) {
    new Notification(title, {
      body: body,
      icon: 'https://jstrisplus.github.io/jstris-plus-assets/logo.png'
    })
  }
}

let plusSfx = { //fallback
  READY: "https://jstrisplus.github.io/jstris-plus-assets/sfx/ready.wav",
  PB: "https://jstrisplus.github.io/jstris-plus-assets/sfx/personalBest.wav"
}
const setPlusSfx = (sfx) => {
  let d = document.getElementById('custom_plus_sfx_json_err')
  try {
    sfx = JSON.parse(sfx)
  } catch (e) {

    if (d) {
      d.textContent = "SFX json is invalid"
    }
    return
  }
  d.textContent = `Loaded ${sfx.name} Jstris+ SFX`
  plusSfx = sfx
}
const playSound = (id) => {
  if (!plusSfx[id]) {
    return console.error(`unknown sfx ${id}`)
  }
  const audio = new Audio(plusSfx[id]);
  audio.play();
}

;// CONCATENATED MODULE: ./src/actiontext.js



const DELAY = 1500; // ms
const FADEOUT = 0.15; // s
const SPIKE_TIMER = 1000;
const MAX_HEIGHT = 250;

class Displayer {

    constructor(index) {
        this.index = index;
        this.id = 0;
        this.displayedActions = [];
        this.spike = 0;
        this.lastAttack = 0;
        this.lastSpikeAttack = 0;
    }

    displayNewAction(value, atk) {

        if (!Config().ENABLE_ACTION_TEXT)
            return;

        let ctime = (new Date()).getTime();
        let spike_tracker = document.getElementById(`atk_spike_${this.index + 1}`);
        if (ctime - this.lastAttack < SPIKE_TIMER) {
            this.spike += value;
        } else {
            this.spike = value
        }
        if (this.spike >= 10) {
            spike_tracker.classList.remove("fade");
            spike_tracker.classList.add("fade", "in");
            spike_tracker.innerHTML = `${this.spike} SPIKE`;
            this.lastSpikeAttack = ctime;
            setTimeout((time) => {
                if (this.lastSpikeAttack == time) {
                    spike_tracker.classList.remove("in");
                    setTimeout((remove_from) => {
                        remove_from.innerHTML = "";
                    }, FADEOUT * 1000, spike_tracker);
                    this.spike = 0;
                }
            }, SPIKE_TIMER, ctime);
        }
        this.lastAttack = ctime;
        let action = document.createElement("p");
        action.innerHTML = `+${value}<br> ${atk}`;
        action.setAttribute("id", `atk_text_${this.index + 1}_${this.id++}`);
        action.setAttribute("class", "action-text fade in");
        action.style.textAlign = "center";
        if (value >= 5) {
            action.style.fontSize = "large";
            action.style.fontWeight = "bold";
        }
        if (value >= 10) {
            action.style.color = "red";
        }
        document.getElementById(`atk_div_${this.index + 1}`).prepend(action);
        this.displayedActions.splice(0, 0, action.id);
        setTimeout((ind, id) => {
            try {
                let target = document.getElementById(`atk_text_${ind + 1}_${id - 1}`);
                target.classList.remove("in");
                setTimeout((target) => {
                    try {
                        this.displayedActions = this.displayedActions.filter((i) => i != target.id);
                        target.parentNode.removeChild(target);
                    } catch (e) { } // idc
                }, FADEOUT * 1000, target);
            } catch (e) { } // idc
        }, DELAY, this.index, this.id);
    }

    reset() {
        for (let action of this.displayedActions) {
            try {
                action.parentNode.removeChild(action);
            } catch (e) { }
        }
        this.displayedActions = [];
        this.id = 0;
    }

}

class DisplayerManager {
    constructor() {
        this.displayers = [];
    }

    createDisplayer() {
        let a = new Displayer();
        a.index = this.addDisplayer(a);
        return a;
    }

    addDisplayer(displayer) {
        for (let i = 0; i < this.displayers.length; i++) {
            if (this.displayers[i] == null) {
                this.displayers[i] = displayer;
                return i;
            }
        }
        this.displayers.push(displayer);
        return this.displayers.length - 1;
    }

    destroyDisplayer(displayer) {
        for (let i = 0; i < this.displayers.length; i++) {
            if (this.displayers[i] == displayer) {
                this.displayers[i] = null;
                return i;
            }
        }
    }
}

const initActionText = () => {
    'use strict';
    window.displayerManager = new DisplayerManager();
    let lstages = document.getElementsByClassName("lstage");
    if (lstages.length == 0) {
        let canvases = document.querySelectorAll("div#main > canvas"); // who tf uses the same ID for multiple thing smh
        for (let canvas of canvases) {
            let div = document.createElement("div");
            div.setAttribute("class", "lstage");
            canvas.parentNode.insertBefore(div, canvas);
            div.appendChild(canvas);
        }
    }
    lstages = document.getElementsByClassName("lstage");
    for (let i = 1; i <= lstages.length; i++) {
        let lstage = lstages[i - 1];
        let num = window.displayerManager.createDisplayer();
        let spike_tracker = document.createElement("p");
        spike_tracker.setAttribute("id", `atk_spike_${num.index + 1}`);
        spike_tracker.setAttribute("style", `max-width: 96px; color: yellow; font-weight: bold;`);
        spike_tracker.setAttribute("class", "spike-tracker fade in");
        lstage.appendChild(spike_tracker);
        let atkdiv = document.createElement("div");
        atkdiv.setAttribute("style", `max-width: 96px; max-height: ${MAX_HEIGHT}px; overflow: hidden; padding: 5px;`);
        atkdiv.setAttribute("id", `atk_div_${num.index + 1}`);
        lstage.appendChild(atkdiv);
    }
    if (typeof trim != "function") { var trim = a => { a = a.slice(0, -1); a = a.substr(a.indexOf("{") + 1); return a } }
    if (typeof getArgs != "function") {
        var getArgs = a => {
            let args = a.toString().match(/function\s*(?:[_a-zA-Z]\w*\s*)?\(((?:(?:[_a-zA-Z]\w*)\s*,\s*?)*(?:[_a-zA-Z]\w*)?)\)/);
            if (args.length > 1) return args[1].split(/\s*,\s*/g);
            return [];
        }
    }
    let displayActionText = function () {
        try {
            let parseCanvasName = function (name) {
                let number = name.match(/(\d+)$/);
                if (number === null) return 1; // no number, assume is first player
                return parseInt(number[0]);
            }


            let IS_BOT = false;
            let playerNum;
            switch (this.v.constructor.name) {
                case "Ctx2DView":
                case "View":
                    playerNum = parseCanvasName(this.v.ctx.canvas.id) - 1;
                    break;
                case "WebGLView":
                    playerNum = parseCanvasName(this.v.ctxs[0].elem.id) - 1;
                    break;
                case "SlotView":
                    IS_BOT = !!(this.p && this.p.bot && this.p.bot.IS_BOT);
                    playerNum = (this.v.displayer) ? this.v.displayer.index : -1;
                    break;
                default:
                    console.log("Uhoh looks like something unknown happened >.<");
                    break;
            }

            if (IS_BOT || (this.clock !== 0 && playerNum !== -1)) {
                if (!this.displayer) {
                    this.displayer = window.displayerManager.displayers[playerNum];
                }

                // generate clear text string
                let clearText;
                if (type !== this.Scoring.A.PERFECT_CLEAR) {
                    let lcNames = ["", "Single", "Double", "Triple", "Quad", "Multi"];
                    clearText = lcNames[Math.min(linesCleared, 5)];

                    let blockName = this.blockSets[this.activeBlock.set].blocks[this.activeBlock.id].name;
                    if (this.spinPossible) clearText = blockName + "&#x2011;Spin " + clearText; // &#x2011; is non-breaking hyphen, &nbsp; is non-brekaing space
                    else if (this.spinMiniPossible) clearText = blockName + "&#x2011;Spin " + clearText + " Mini";
                }
                else {
                    clearText = "Perfect Clear!";
                }

                if (b2b && this.isBack2Back) clearText = "B2B " + clearText;
                if (cmb > 0) clearText += ` combo${cmb}`;

                this.displayer.displayNewAction(atk, clearText);
            }
        } catch (e) { console.log(e); }
    }
    try {

        let functionStr = trim(GameCore.prototype.checkLineClears.toString());

        const linesClearedPattern = /switch\((_0x[a-f0-9]+)\)/
        const matchLineClearCheck = functionStr.match(linesClearedPattern);
        if (!matchLineClearCheck) {
            console.log("action text injection failed.");
        }

        // find switch(linesCleared) to get linesCleared variable + get a variable down for linesSent before it's incremented
        functionStr = functionStr.replace(linesClearedPattern, (_, p1) => `
            let linesCleared=${p1}; let atkBefore = this.gamedata.linesSent; switch(${p1})
        `);

        // insert displayActionText after the following code:
        // let atkMeta={type:_,b2b:this._,cmb:this._};
        let replacePattern = /let (_0x[a-f0-9]+)=\{'type':_0x[a-f0-9]+,'b2b':this\[.*\],'cmb':this\[.*\]};/;

        const matchCheck = functionStr.match(replacePattern);
        if (!matchCheck) {
            console.log("action text injection failed.");
        }

        let replacer = function (match, atkMeta) {
            console.log('replacing yay')
            return match + `
            let atk = this.gamedata.linesSent - atkBefore;
            let type = ${atkMeta}.type;
            let b2b = ${atkMeta}.b2b;
            let cmb = ${atkMeta}.cmb;
            `
                + trim(displayActionText.toString());
        }
        functionStr = functionStr.replace(replacePattern, replacer);

        GameCore.prototype.checkLineClears = new Function(...getArgs(GameCore.prototype.checkLineClears), functionStr);
        console.log(functionStr);
    } catch (e) {
        console.log(e); 7
        console.log("Could not inject into line clears!");
    }
    try {
        Replayer.prototype.checkLineClears = function (a) {
            GameCore.prototype.checkLineClears.call(this, a);
        }
        const oldInitReplay = Replayer.prototype.initReplay
        Replayer.prototype.initReplay = function () {
            try {
                if (this.v.displayer && this.v.displayer.reset)
                    this.v.displayer.reset()
            } catch (e) {
                console.log(e);
            }
            return oldInitReplay.apply(this, arguments);
        }
    } catch (e) {
        console.log(e);
        console.log("Could not inject into line clears!");
    }
    try {
        SlotView.prototype.onResized = function () {
            this.block_size = this.slot.gs.liveBlockSize;
            this.holdQueueBlockSize = this.slot.gs.holdQueueBlockSize;
            this.drawBgGrid();
            this.clearMainCanvas();
            if (this.slot.gs.isExtended) {
                this.QueueHoldEnabled = true;
                this.holdCanvas.style.display = 'block';
                this.queueCanvas.style.display = 'block';
                if (shouldRenderEffectsOnView(this)) {
                    if (this.displayer === undefined) {
                        this.displayer = window.displayerManager.createDisplayer();
                    }
                    try {
                        let top = this.holdCanvas.height + parseInt(this.holdCanvas.style.top);
                        let left = parseInt(this.holdCanvas.style.left);
                        if (!document.getElementById(`atk_spike_${this.displayer.index + 1}`)) {
                            let spike_tracker = document.createElement("p");
                            spike_tracker.setAttribute("class", "layer fade in");
                            spike_tracker.setAttribute("style", `top: ${top}px; left: ${left}px; width: ${this.holdCanvas.width}px; height: 20px; color: yellow; font-weight: bold;`);
                            spike_tracker.setAttribute("id", `atk_spike_${this.displayer.index + 1}`);
                            this.holdCanvas.parentNode.appendChild(spike_tracker);

                        }
                        if (!document.getElementById(`atk_div_${this.displayer.index + 1}`)) {
                            let atkdiv = document.createElement("div");
                            atkdiv.setAttribute("class", "layer");
                            atkdiv.setAttribute("style", `top: ${top + 40}px; left: ${left}px; width: ${this.holdCanvas.width}px; max-height: ${MAX_HEIGHT}px; overflow: hidden;`);
                            atkdiv.setAttribute("id", `atk_div_${this.displayer.index + 1}`);
                            this.holdCanvas.parentNode.appendChild(atkdiv);
                        }
                    } catch (e) { console.log(e); }
                }
            } else {
                this.QueueHoldEnabled = false;
                this.holdCanvas.style.display = 'none';
                this.queueCanvas.style.display = 'none';
            }
        };
    } catch (e) {
        console.log(e);
        console.log("Could not inject into SlotView!");
    }
};

;// CONCATENATED MODULE: ./src/replayManager.js
let isReplayerReversing = false

const initReplayManager = () => {
    let skipping = false


    let repControls = document.getElementById("repControls")
    let skipButton = document.createElement("button")
    skipButton.textContent = "skip"
    skipButton.onclick = function () {
        if (skipping) {
            skipButton.textContent = "skip"
        } else {
            skipButton.textContent = "step"
        }
        skipping = !skipping
    }
    if (repControls) repControls.appendChild(skipButton)
    let nextFrame = ReplayController.prototype.nextFrame
    ReplayController.prototype.nextFrame = function () {
        if (!skipping) {
            return nextFrame.apply(this, arguments)
        }

        // find the next upcoming hard drop
        let nextHdTime = -1;
        this.g.forEach((r, _) => {
            for (let i = r.ptr; i < r.actions.length; i++) {
                let action = r.actions[i].a;
                let time = r.actions[i].t;

                if (action == Action.HARD_DROP) {
                    if (nextHdTime == -1 || time < nextHdTime)
                        nextHdTime = time;
                    break;
                }
            }
        });

        // play all replayers until that time
        if (nextHdTime < 0) return;
        this.g.forEach((r, _) => r.playUntilTime(nextHdTime));
    }
    let prevFrame = ReplayController.prototype.prevFrame
    ReplayController.prototype.prevFrame = function () {
        isReplayerReversing = true
        if (!skipping) {
            let v = prevFrame.apply(this, arguments)
            isReplayerReversing = false
            return v
        }
        let skipBack = 0
        let passed = false
        this.g.forEach((r, _) => {
            for (let i = r.ptr - 1; i >= 0; i--) {
                let action = r.actions[i].a;
                skipBack += 1

                if (action == Action.HARD_DROP) {
                    if (passed) {
                        skipBack -= 1
                        break
                    }
                    passed = true
                }
            }
        });
        for (let i = 0; i < skipBack; i++) {
            isReplayerReversing = true
            prevFrame.apply(this, arguments)
            isReplayerReversing = false
        }
        isReplayerReversing = false
    }
    let lR = ReplayController.prototype.loadReplay
    ReplayController.prototype.loadReplay = function () {
        let v = lR.apply(this, arguments)
        document.getElementById("next").onclick = this.nextFrame.bind(this)
        document.getElementById("prev").onclick = this.prevFrame.bind(this)
        return v
    }
}
;// CONCATENATED MODULE: ./src/jstris-fx.js



// helper function
const initGFXCanvas = (obj, refCanvas) => {
  obj.GFXCanvas = refCanvas.cloneNode(true);
  /*
  obj.GFXCanvas = document.createElement("canvas");
  obj.GFXCanvas.className = "layer mainLayer gfxLayer";
  obj.GFXCanvas.height = refCanvas.height;
  obj.GFXCanvas.width = refCanvas.width;
  obj.GFXCanvas.style = refCanvas.style;
  */
  obj.GFXCanvas.id = "";
  obj.GFXCanvas.className = "layer mainLayer gfxLayer";
  obj.GFXctx = obj.GFXCanvas.getContext("2d")
  obj.GFXctx.clearRect(0, 0, obj.GFXCanvas.width, obj.GFXCanvas.height);
  refCanvas.parentNode.appendChild(obj.GFXCanvas);
}

const initFX = () => {
  'use strict';
  // where you actually inject things into the settings

  // -- injection below --
  if (window.Game) {
    const oldReadyGo = Game.prototype.readyGo
    Game.prototype.readyGo = function () {
      let val = oldReadyGo.apply(this, arguments)

      if (!this.GFXCanvas || !this.GFXCanvas.parentNode) {
        initGFXCanvas(this, this.canvas);
      }

      this.GFXQueue = [];

      this.GFXLoop = () => {
        if (!this.GFXQueue) this.GFXQueue = [];

        this.GFXctx.clearRect(0, 0, this.GFXCanvas.width, this.GFXCanvas.height);

        this.GFXQueue = this.GFXQueue.filter(e => e.process.call(e, this.GFXctx));

        if (this.GFXQueue.length)
          requestAnimationFrame(this.GFXLoop);
      }
      //  window.game = this;

      return val;
    }
  }

  if (window.SlotView) {
    const oldOnResized = SlotView.prototype.onResized;
    SlotView.prototype.onResized = function () {

      oldOnResized.apply(this, arguments);

      if (this.g && this.g.GFXCanvas && Replayer.prototype.isPrototypeOf(this.g)) {
        this.g.GFXCanvas.width = this.canvas.width;
        this.g.GFXCanvas.height = this.canvas.height;
        this.g.GFXCanvas.style.top = this.canvas.style.top;
        this.g.GFXCanvas.style.left = this.canvas.style.left;
        this.g.block_size = this.g.v.block_size;
      }


    }
  }

  // -- injection below --
  const oldInitReplay = Replayer.prototype.initReplay
  Replayer.prototype.initReplay = function () {
    let val = oldInitReplay.apply(this, arguments)

    // SlotViews have replayers attached to them, don't want to double up on the canvases
    //if (SlotView.prototype.isPrototypeOf(this.v))
    //    return;
    window.replayer = this;


    // always clear and re-init for slotviews
    if (window.SlotView && SlotView.prototype.isPrototypeOf(this.v)) {

      // do not do gfx if the board is too small
      let life = this.v.slot.gs.p.Live
      if (!shouldRenderEffectsOnView(this.v) && life?.roomConfig?.mode !== 2) {
        return val;
      }
      let foundGFXCanvases = this.v.slot.slotDiv.getElementsByClassName("gfxLayer");

      for (var e of foundGFXCanvases) {
        if (e.parentNode) {
          e.parentNode.removeChild(e);
        }
      }
      this.GFXCanvas = null;
    }

    if (!this.GFXCanvas || !this.GFXCanvas.parentNode || !this.GFXCanvas.parentNode == this.v.canvas.parentNode) {
      initGFXCanvas(this, this.v.canvas);
      console.log("replayer initializing gfx canvas");
    }

    this.GFXQueue = [];

    this.block_size = this.v.block_size;

    this.GFXLoop = () => {
      if (!this.GFXQueue) this.GFXQueue = [];

      this.GFXctx.clearRect(0, 0, this.GFXCanvas.width, this.GFXCanvas.height);

      this.GFXQueue = this.GFXQueue.filter(e => e.process.call(e, this.GFXctx));

      if (this.GFXQueue.length)
        requestAnimationFrame(this.GFXLoop);
    }

    this.v.canvas.parentNode.appendChild(this.GFXCanvas);

    return val;
  }

  const oldLineClears = GameCore.prototype.checkLineClears;
  GameCore.prototype.checkLineClears = function () {

    if (!this.GFXCanvas || isReplayerReversing)
      return oldLineClears.apply(this, arguments);

    let oldAttack = this.gamedata.attack;

    let cleared = 0;
    for (var row = 0; row < 20; row++) {
      let blocks = 0;
      for (var col = 0; col < 10; col++) {
        let block = this.matrix[row][col];
        if (9 === block) { // solid garbage
          break;
        };
        if (0 !== block) {
          blocks++
        }
      };
      if (10 === blocks) { // if line is full
        cleared++; // add to cleared

        // send a line clear animation on this line
        if (Config().ENABLE_LINECLEAR_ANIMATION && Config().LINE_CLEAR_LENGTH > 0) {
          this.GFXQueue.push({
            opacity: 1,
            delta: 1 / (Config().LINE_CLEAR_LENGTH * 1000 / 60),
            row,
            blockSize: this.block_size,
            amountParted: 0,
            process: function (ctx) {
              if (this.opacity <= 0)
                return false;

              var x1 = 1;
              var x2 = this.blockSize * 5 + this.amountParted;
              var y = 1 + this.row * this.blockSize;

              // Create gradient
              var leftGradient = ctx.createLinearGradient(0, 0, this.blockSize * 5 - this.amountParted, 0);
              leftGradient.addColorStop(0, `rgba(255,255,255,${this.opacity})`);
              leftGradient.addColorStop(1, `rgba(255,170,0,0)`);
              // Fill with gradient
              ctx.fillStyle = leftGradient;

              ctx.fillRect(x1, y, this.blockSize * 5 - this.amountParted, this.blockSize);

              // Create gradient
              var rightGradient = ctx.createLinearGradient(0, 0, this.blockSize * 5 - this.amountParted, 0);
              rightGradient.addColorStop(0, `rgba(255,170,0,0)`);
              rightGradient.addColorStop(1, `rgba(255,255,255,${this.opacity})`);
              // Fill with gradient
              ctx.fillStyle = rightGradient;
              ctx.fillRect(x2, y, this.blockSize * 5 - this.amountParted, this.blockSize);

              this.amountParted = lerp(this.amountParted, this.blockSize * 5, 0.1);
              this.opacity -= this.delta;
              return true;
            }

          })
        }
      }
    }
    if (cleared > 0) { // if any line was cleared, send a shake
      let attack = this.gamedata.attack - oldAttack;
      if (Config().ENABLE_LINECLEAR_SHAKE)
        shake(
          this.GFXCanvas.parentNode.parentNode,
          Math.min(1 + attack * 5, 50) * Config().LINE_CLEAR_SHAKE_STRENGTH,
          Config().LINE_CLEAR_SHAKE_LENGTH * (1000 / 60)
        );
      if (this.GFXQueue.length)
        requestAnimationFrame(this.GFXLoop);
    }
    return oldLineClears.apply(this, arguments);

  }
  // have to do this so we can properly override ReplayerCore
  Replayer.prototype.checkLineClears = GameCore.prototype.checkLineClears;

  // placement animation
  const oldPlaceBlock = GameCore.prototype.placeBlock
  GameCore.prototype.placeBlock = function (col, row, time) {

    if (!this.GFXCanvas || !Config().ENABLE_PLACE_BLOCK_ANIMATION || isReplayerReversing)
      return oldPlaceBlock.apply(this, arguments);

    const block = this.blockSets[this.activeBlock.set]
      .blocks[this.activeBlock.id]
      .blocks[this.activeBlock.rot];

    let val = oldPlaceBlock.apply(this, arguments);

    // flashes the piece once you place it
    if (Config().PIECE_FLASH_LENGTH > 0) {
      this.GFXQueue.push({
        opacity: Config().PIECE_FLASH_OPACITY,
        delta: Config().PIECE_FLASH_OPACITY / (Config().PIECE_FLASH_LENGTH * 1000 / 60),
        col,
        row,
        blockSize: this.block_size,
        block,
        process: function (ctx) {
          if (this.opacity <= 0)
            return false;


          ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
          this.opacity -= this.delta;

          for (var i = 0; i < this.block.length; i++) {
            for (var j = 0; j < this.block[i].length; j++) {

              if (!this.block[i][j])
                continue;

              var x = 1 + (this.col + j) * this.blockSize
              var y = 1 + (this.row + i) * this.blockSize

              ctx.fillRect(x, y, this.blockSize, this.blockSize);
            }
          }
          return true;
        }
      })
    }

    var trailLeftBorder = 10;
    var trailRightBorder = 0;
    var trailBottom = 0;
    for (var i = 0; i < block.length; i++) {
      for (var j = 0; j < block[i].length; j++) {
        if (!block[i][j])
          continue;
        trailLeftBorder = Math.max(Math.min(trailLeftBorder, j), 0);
        trailRightBorder = Math.min(Math.max(trailRightBorder, j), 10);
        trailBottom = Math.max(trailBottom, i);
      }
    }

    // flashes the piece once you place it
    this.GFXQueue.push({
      opacity: 0.3,
      col,
      row,
      blockSize: this.block_size,
      trailTop: 1,
      block,
      trailLeftBorder,
      trailRightBorder,
      trailBottom,
      process: function (ctx) {
        if (this.opacity <= 0)
          return false;

        var {
          trailLeftBorder,
          trailRightBorder,
          trailBottom
        } = this;

        var row = this.row + trailBottom

        var gradient = ctx.createLinearGradient(0, 0, 0, row * this.blockSize - this.trailTop);
        gradient.addColorStop(0, `rgba(255,255,255,0)`);
        gradient.addColorStop(1, `rgba(255,255,255,${this.opacity})`);

        // Fill with gradient
        ctx.fillStyle = gradient;
        ctx.fillRect((this.col + trailLeftBorder) * this.blockSize, this.trailTop, (trailRightBorder - trailLeftBorder + 1) * this.blockSize, row * this.blockSize - this.trailTop);

        const middle = (trailLeftBorder + trailRightBorder) / 2

        this.trailLeftBorder = lerp(trailLeftBorder, middle, 0.1);
        this.trailRightBorder = lerp(trailRightBorder, middle, 0.1);

        this.opacity -= 0.0125;

        return true;
      }
    })



    requestAnimationFrame(this.GFXLoop);

  }
  // have to do this so we can properly override ReplayerCore
  Replayer.prototype.placeBlock = GameCore.prototype.placeBlock;
};

;// CONCATENATED MODULE: ./src/matchmaking.js




let ROOMBA = "JstrisPlus"


function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}
function addMatchesBtn(name) {
  for (let dropDown of document.getElementsByClassName("dropdown-menu")) {
    let found = false
    let children = dropDown.children
    for (let i = 0; i < children.length; i++) {
      let child = children[i]
      if (!child.children.length > 0) continue
      if (child.children[0].href == "https://jstris.jezevec10.com/profile") {
        found = true
        let li = document.createElement("li")
        let a = document.createElement("a")
        a.style.color = "#ffb700"
        a.href = "https://jstris.jezevec10.com/matches/" + name + "?plus=true"
        a.textContent = "Matchmaking History"
        li.appendChild(a)
        dropDown.insertBefore(li, child.nextSibling)
        break
      }
    }
    if (found) {
      break
    }
  }
}
function createStatBlock(stats) {

  let statInfo = document.createElement("div");
  statInfo.className = "t-main";
  statInfo.style.flexWrap = "wrap"
  // statInfo.style.whiteSpace = "pre-wrap"
  for (const [key, value] of Object.entries(stats)) {
    let stat = document.createElement("div")
    stat.className = "t-itm"
    let desc = document.createElement("div")
    desc.className = "t-desc"
    desc.textContent = key
    let val = document.createElement("div")
    val.className = "t-val"
    val.textContent = value
    stat.appendChild(val)
    stat.appendChild(desc)
    statInfo.append(stat)
  }
  return statInfo
}
const insertChatButtons = (sendMessage) => {
  let chatBox = document.getElementById("chatContent");
  let chatButtons = document.createElement("div");
  chatButtons.className = "mm-chat-buttons-container"
  let readyButton = document.createElement("button")
  readyButton.className = "mm-ready-button"
  readyButton.textContent = "Ready"
  chatButtons.prepend(readyButton)
  chatBox.appendChild(chatButtons);
  readyButton.addEventListener("click", () => {
    readyButton.disabled = true
    setTimeout(() => {
      readyButton.disabled = false
    }, 1000)
    sendMessage("!ready");
  })
  return (function (boundButtonsDiv) {
    return () => {
      try {
        document.getElementById("chatContent").removeChild(boundButtonsDiv);
      } catch (e) {
        //console.log(e);
        console.log("Ready button was already removed.");
      }
    }
  })(chatButtons) // do this to make sure that the returned kill callback is removing the correct div
}

const initMM = () => {
  let HOST = "wss://jeague.tali.software/";
  let APIHOST = "https://jeague.tali.software/api/v1/"
  let readyKiller = null
  // development server
  if (false) {}

  // local server
  if (false) {}


  let p = document.createElement("button");
  p.className = "mmButton";
  p.id = "queueButton";
  p.textContent = "Enter Matchmaking";
  const JEAGUE_VERSION = "UT99";
  let urlParts = window.location.href.split("/");
  if (typeof Live == "function") {
    let chatListener = Live.prototype.showInChat
    let suppressChat = false
    let nameListener = Live.prototype.getName
    Live.prototype.getName = function () {
      if (arguments[0] && this.clients[arguments[0]] && this.clients[arguments[0]].name == ROOMBA) {
        return "[Matchmaking]"
      }
      let v = nameListener.apply(this, arguments)
      return v
    }
    Live.prototype.showInChat = function () {
      if (suppressChat) return
      let val = chatListener.apply(this, arguments)
      return val
    }
    let responseListener = Live.prototype.handleResponse
    Live.prototype.handleResponse = function () {
      let res = arguments[0]
      suppressChat = false
      if (res.t == 6) {
        if (res.m == "<em>Room wins counter set to zero.</em>") {
          for (let client of Object.values(this.clients)) {
            if (client.name == ROOMBA) {
              suppressChat = true
            }
          }
        }
      } else if (res.t == 2) {
        if (res.n == ROOMBA) {
          suppressChat = true
          cc.style.display = "none"
        }
      } else if (res.t == 3) {
        if (this.clients[res.cid] && this.clients[res.cid].name == ROOMBA) {
          suppressChat = true
          cc.style.display = "flex"
          if (readyKiller) {
            readyKiller()
          }
        }
      } else if (res.t == 4) {
        let found = false
        if (res.players) {

          for (let key in res.players) {
            if (res.players[key].n == ROOMBA) {
              found = true
              break
            }
          }
        }
        if (res.spec) {
          for (let key in res.spec) {
            if (res.spec[key].n == ROOMBA) {
              found = true
              break
            }
          }
        }
        if (found) {
          cc.style.display = "none"
        } else {
          cc.style.display = "flex"
        }
      }
      let val = responseListener.apply(this, arguments)
      suppressChat = false
      if (res.t == 12) {
        for (let gs of this.p.GS.slots) {
          gs.v.isKO = false
          gs.v.KOplace = null
        }
      }
      return val
    }


    if (Config().SHOW_QUEUE_INFO) {
      document.body.classList.add("show-queue-info");
    }
    Config().onChange("SHOW_QUEUE_INFO", val => {
      if (val) {
        document.body.classList.add("show-queue-info");
      } else {
        document.body.classList.remove("show-queue-info");
      }
    })
    if (Config().SHOW_MM_BUTTON) {
      document.body.classList.add("show-mm-button");
    }
    Config().onChange("SHOW_MM_BUTTON", val => {
      if (val) {
        document.body.classList.add("show-mm-button");
      } else {
        document.body.classList.remove("show-mm-button");
      }
    })
    let queueinfo = document.createElement("div");
    queueinfo.className = "mmInfoContainer";
    queueinfo.textContent = "not connected to matchmaking";
    let cc = document.createElement("div")
    cc.className = 'mmContainer'
    document.body.appendChild(cc)
    cc.prepend(queueinfo);
    let mmLoaded = false
    let liveObj = null
    let liveListener = Live.prototype.authorize;
    Live.prototype.authorize = function () {
      liveObj = this
      let val = liveListener.apply(this, arguments);
      if (arguments[0] && arguments[0].token) {
        //loadMM(arguments[0].token);
        loadMM();
      }
      return val;
    };

    //function loadMM(token) {
    function loadMM() {
      if (mmLoaded) return
      mmLoaded = true
      document.addEventListener("keyup", (evtobj) => {
        if (0 == liveObj.p.focusState) {
          if (evtobj.keyCode == Config().SCREENSHOT_KEYCODE) {
            liveObj.p.screenshot(APIHOST)
          };
        }

      }, false)
      let name = liveObj.chatName;

      addMatchesBtn(liveObj.chatName)
      let CONNECTED = false;
      let ws = new WebSocket(HOST);
      console.log(`Attempting to connect to matchmaking host: ${HOST}`);

      window.JeagueSocket = ws
      /*     let connectionListener = Live.prototype.onClose
           Live.prototype.onClose = function () {
             let val = connectionListener.apply(this, arguments)
             ws.close()
             status = UI_STATUS.offline
             updateUI()
             return val
           }*/
      let UI_STATUS = {
        idle: 0,
        queueing: 1,
        loading: 2,
        banned: 4,
        offline: 5,
      };
      let status = UI_STATUS.idle;
      let numQueue = 0;
      let numPlaying = 0;
      let numActive = 0
      let HOVERING = false;

      let timeInQueue = 0;
      let timeInc = null;
      let toMMSS = function (sec_num) {
        let minutes = Math.floor(sec_num / 60);
        let seconds = sec_num - minutes * 60;
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        return "" + minutes + ":" + seconds;
      };
      let OFFLINED = false
      function updateUI(msg) {
        if (OFFLINED) return
        switch (status) {
          case UI_STATUS.queueing:
            if (HOVERING) {
              p.textContent = "Exit Matchmaking";
            } else {
              p.textContent = toMMSS(timeInQueue);
            }
            queueinfo.textContent = `[${numPlaying}]${numQueue} in queue\n${numActive} online`;
            break;
          case UI_STATUS.idle:
            p.textContent = "Enter Matchmaking";
            queueinfo.textContent = `[${numPlaying}]${numQueue} in queue\n${numActive} online`;
            break;
          case UI_STATUS.loading:
            p.textContent = "Loading";
            queueinfo.textContent = `[${numPlaying}]${numQueue} in queue\n${numActive} online`;
            break;
          case UI_STATUS.banned:
            queueinfo.style.minWidth = "1000px"
            queueinfo.textContent = "You Are Banned";
            p.remove();
            OFFLINED = true
            break;
          case UI_STATUS.offline:
            OFFLINED = true
            queueinfo.style.color = "#bcc8d4";
            queueinfo.className = "mmInfoContainer";
            queueinfo.textContent = "not connected to matchmaking";
            p.remove();
            break
        }
        if (msg) {
          queueinfo.textContent = msg;
        }
      }

      function ping() {
        ws.send(JSON.stringify({ type: "ping" }));
      }

      function updateClock() {
        timeInQueue += 1;
        updateUI();
      }
      p.onmouseover = function () {
        HOVERING = true;
        p.style.color = "rgba(255,255,255,0.7)";
        updateUI();
      };
      p.onmouseout = function () {
        HOVERING = false;
        p.style.color = "rgba(255,255,255,1)";
        updateUI();
      };

      ws.onmessage = event => {
        let res = JSON.parse(event.data);
        if (res.type == "room") {
          status = UI_STATUS.idle;
          liveObj.p.GS.resetAll()
          liveObj.joinRoom(res.rid)
          console.log("found match at " + res.rid)
          playSound("READY");
          if (readyKiller) {
            readyKiller()
          }
          notify('Jstris+', '🚨Match Starting!')
          document.title = "🚨Match Starting!";
          setTimeout(() => {
            document.title = "Jstris";
          }, 2000);
          updateUI();
        } else if (res.type == "readyStart") {
          cc.style.display = "none"
          readyKiller = insertChatButtons(msg => ws.send(JSON.stringify({ type: "ready", rid: liveObj.rid, cid: liveObj.cid })));

        } else if (res.type == "readyConfirm") {
          if (res.rid == liveObj.rid) {
            if (readyKiller) readyKiller()
          }
        } else if (res.type == "msg") {
          if (res.secret) {
            liveObj.showInChat("", `<em><b>${res.msg}</b></em>`)
          } else { liveObj.showInChat("[Matchmaking]", res.msg) }
        } else if (res.type == "accept") {
          timeInQueue = 0;
          clearInterval(timeInc);
          timeInc = setInterval(updateClock, 1000);
          status = UI_STATUS.queueing;
          updateUI();
        } else if (res.type == "decline") {
          if (res.shutdown) {
            alert("server preparing for an update")
          } else {
            alert("you are already in queue!")
          }
          status = UI_STATUS.idle;
          updateUI();
        } else if (res.type == "bans") {
          status = UI_STATUS.banned;
          let banmsg = "You are banned from matchmaking for:"
          console.log(res.bans)
          for (let ban of res.bans) {
            banmsg += " " + ban.reason + "; Expires: " + new Date(ban.timeout).toLocaleString();
          }
          updateUI(banmsg);
        } else if (res.type == "removed") {
          status = UI_STATUS.idle;
          updateUI();
        } else if (res.type == "ping") {
          if (res.queue > 0) {
            queueinfo.style.color = "#1b998b";
          } else {
            queueinfo.style.color = "#bcc8d4";
          }
          numQueue = res.queue;
          numPlaying = res.playing;
          numActive = res.active
          updateUI();
        } else if (res.type == "init") {
          CONNECTED = true;
          cc.prepend(p);
          status = UI_STATUS.idle;
          updateUI();
          console.log("JEAGUE LEAGUE CONNECTED");
        }
      };
      function powertipCallback(records) {
        records.forEach(function (record) {
          var list = record.addedNodes;
          var i = list.length - 1;

          for (; i > -1; i--) {
            if (list[i].className == "t-ftr" && list[i].firstChild) {
              let name = (list[i].children[0].dataset.name)
              if (name) {
                let powerTipStat = list[i].parentNode
                fetch(APIHOST + "stats/" + name).then((response) => {
                  if (response.status != 200) return
                  response.json().then(res => {
                    let mmHeader = document.createElement("div")
                    mmHeader.className = "t-titles"
                    let span = document.createElement("span")
                    span.textContent = "Matchmaking Stats"
                    mmHeader.appendChild(span)
                    powerTipStat.appendChild(mmHeader)
                    powerTipStat.appendChild(createStatBlock(res))
                  })
                })
              }
            }
          }
        });
      }

      var observer = new MutationObserver(powertipCallback);

      var targetNode = document.body;

      observer.observe(targetNode, { childList: true, subtree: true });

      let WSOPENED = false
      ws.onopen = function (event) {
        WSOPENED = true
        setInterval(ping, 10000);
        ws.send(JSON.stringify({ type: "init", name: name, version: JEAGUE_VERSION }));
        //ws.send(JSON.stringify({ type: "init", token: token, version: JEAGUE_VERSION }));
        p.onclick = function () {
          if (!CONNECTED) {
            return;
          }
          if (status == UI_STATUS.queueing) {
            status = UI_STATUS.loading;
            ws.send(JSON.stringify({ type: "disconnect" }));
          } else if (liveObj.connected) {
            status = UI_STATUS.loading;
            ws.send(JSON.stringify({ type: "connect" }));
          } else {
            alert("you are not connected to jstris")
          }
          updateUI();
        };
      };
      ws.onclose = function () {
        if (WSOPENED) {
          status = UI_STATUS.offline
          updateUI("jstris+ server down")
        }
      }
    }
  } else if (urlParts[3] && urlParts[3] == "u" && urlParts[4]) {

    let nameHolders = document.getElementsByClassName("mainName")
    let mainName = ""
    if (nameHolders[0] && nameHolders[0].firstChild) {
      mainName = nameHolders[0].firstChild.textContent.trim()
    } else {
      return
    }
    addMatchesBtn(mainName)
    let cc = document.getElementsByClassName("col-flex-bio col-flex")[0];
    let cc1 = document.getElementsByClassName("row-flex uProfileTop")[0]
    let a = document.createElement("a")
    a.href = "https://jstris.jezevec10.com/matches/" + mainName + "?plus=true"
    a.textContent = "Matchmaking History"
    a.className = "btn btn-default btn-sm"
    let img = document.createElement("img")
    img.src = "https://s.jezevec10.com/res/list.png"
    img.className = "btnIcn"
    img.style.float = "left"
    a.style.minWidth = "180px"
    a.style.textAlign = "left"
    a.prepend(img)
    a.style.backgroundColor = "#e74c3c"
    cc1.children[0].appendChild(a)
    fetch(APIHOST + "stats/" + mainName).then((response) => {
      if (response.status != 200) return
      response.json().then(res => {

        let playerInfo = document.createElement("div");
        playerInfo.className = "aboutPlayer";
        let statHeader = document.createElement("span");
        statHeader.className = "aboutTitle";
        statHeader.textContent = "Matchmaking Stats";
        playerInfo.appendChild(statHeader);
        playerInfo.appendChild(createStatBlock(res));
        cc.appendChild(playerInfo)

      })
    })
  } else if (urlParts[3] && urlParts[3] == "matches" && urlParts[4]) {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.get("plus")) return

    let cc = document.getElementsByClassName("well")[0].parentNode
    for (let child of cc.children) {
      cc.removeChild(child)
    }
    let loader = document.createElement("div")
    loader.className = "mmLoader"
    cc.prepend(loader)
    document.getElementsByClassName("well")[0].remove()
    let collapsible = document.createElement("button")
    collapsible.className = "mmCollapsible"
    collapsible.textContent = "Jstris+ Matches"
    let collapsibleCarrot = createElementFromHTML("<span class='caret'></span>")
    collapsible.appendChild(collapsibleCarrot)
    let matchView = document.createElement("div")
    matchView.className = "col-sm-12 mmMatches"
    collapsible.onclick = () => {
      if (matchView.style.display == "block") { matchView.style.display = "none" }
      else { matchView.style.display = "block" }
    }
    let name = decodeURI(urlParts[4]).split('?')[0]
    fetch(APIHOST + "matches/" + name).then((response) => {
      if (response.status != 200) {

        response.text().then(res => {
          loader.remove()
          cc.textContent = res
        })
        return
      }
      response.json().then(res => {

        let modal = document.createElement("div");
        let modalContent = document.createElement("div");
        let modalClose = document.createElement("span");
        let modalTable = document.createElement("table");
        modalClose.className = "mmClose";
        modalClose.textContent = "×";
        modalContent.appendChild(modalTable);
        modalContent.appendChild(modalClose);
        modal.className = "mmModal";
        modalContent.className = "mmModal-content";
        modal.append(modalContent);
        modalClose.onclick = function () {
          modal.style.display = "none";
        };

        modalTable.className = "table table-striped table-hover match-list";

        document.body.appendChild(modal);

        function loadGame(game, match) {
          const ALL_STATS = ["apm", "pps", "cheese", "apd", "time"];
          let table = modalContent.firstChild;
          while (table.firstChild) {
            table.removeChild(table.firstChild);
          }
          let aref = document.createElement("a");
          let apic = document.createElement("img");
          aref.style.position = "absolute";
          aref.style.left = "5px";
          aref.style.top = "5px";
          apic.src = "https://jstris.jezevec10.com/res/play.png";
          aref.appendChild(apic);
          aref.href = `/games/${game.gid}`;
          aref.target = "_blank";
          table.appendChild(aref);
          //   console.log(res)
          if (game.stats || game.altStats) {
            let thead = document.createElement("thead");
            let theadtr = document.createElement("tr");
            let spacer = document.createElement("th");
            spacer.colSpan = 1;
            theadtr.appendChild(spacer);
            for (let ss of ALL_STATS) {
              let stat = document.createElement("th");
              stat.className = "apm";
              stat.textContent = ss.toUpperCase();
              theadtr.appendChild(stat);
            }
            let tdate = document.createElement("th");
            thead.appendChild(theadtr);
            table.appendChild(thead);

            let body = document.createElement("tbody");
            table.appendChild(body);
            let winnerName = match.player;
            let loserName = match.player;
            if (!game.win) {
              winnerName = match.opponent
            } else {
              loserName = match.opponent
            }
            let players = [];
            if (game.stats) {
              players.push({ name: winnerName, stats: game.stats });
            }
            if (game.altStats) {
              players.push({ name: loserName, stats: game.altStats });
            }
            for (let match of players) {
              let tr = document.createElement("tr");
              let p1 = document.createElement("td");
              p1.className = "pl1";
              var ap1 = document.createElement("a");
              ap1.textContent = match.name;
              ap1.href = `/u/${match.name}`;
              p1.appendChild(ap1);
              tr.appendChild(p1);
              if (match.stats) {
                let sstats = {};
                for (let ss of ALL_STATS) {
                  sstats[ss] = "-";
                }
                for (const [key, value] of Object.entries(match.stats)) {
                  if (isNaN(parseFloat(value)))
                    continue;
                  if (parseFloat(value) < 0)
                    continue;
                  if (sstats[key]) {
                    sstats[key] = value;
                  }
                }
                for (let ss of ALL_STATS) {
                  let stat = document.createElement("td");
                  stat.className = "apm";
                  stat.textContent = sstats[ss];
                  tr.appendChild(stat);
                }
              } else {
                for (let i = 0; i < ALL_STATS.length; i++) {
                  let stat = document.createElement("td");
                  stat.className = "apm";
                  stat.textContent = "-";
                  tr.appendChild(stat);
                }
              }

              body.appendChild(tr);
            }
          }

          modal.style.display = "block";
        }
        console.log(res)
        const ALL_STATS = ["apm", "pps", "cheese", "apd", "time"];
        //   console.log(res)
        let table = document.createElement("table");
        table.className = "table table-striped table-hover match-list";
        let thead = document.createElement("thead");
        let theadtr = document.createElement("tr");
        let spacer = document.createElement("th");
        spacer.colSpan = 3;
        theadtr.appendChild(spacer);
        for (let ss of ALL_STATS) {
          let stat = document.createElement("th");
          stat.className = "apm";
          stat.textContent = ss.toUpperCase();
          theadtr.appendChild(stat);
        }
        let tdate = document.createElement("th");
        tdate.className = "date";
        tdate.textContent = "Date";
        let tgames = document.createElement("th");
        tgames.className = "date";
        tgames.textContent = "Games";
        theadtr.appendChild(tdate);
        theadtr.appendChild(tgames);
        thead.appendChild(theadtr);
        table.appendChild(thead);

        let body = document.createElement("tbody");
        table.appendChild(body);
        for (let match of res) {
          let tr = document.createElement("tr");
          let p1 = document.createElement("td");
          p1.className = "pl1";
          var ap1 = document.createElement("a");
          ap1.textContent = name;
          ap1.href = `/u/${name}`;
          p1.appendChild(ap1);
          tr.appendChild(p1);
          let sc = document.createElement("td");
          sc.className = "sc";
          let sM = document.createElement("span");
          sM.style.color = "#04AA6D";
          sM.className = "scoreMiddle";
          let switched = match.opponent == name
          if (match.forced) {
            sM.textContent = "default";
            if (switched) {
              sM.textContent = "forfeit";
              sM.style.color = "#A90441";
            }
          } else {
            let wins = 0
            let losses = 0
            for (let game of match.games) {
              if (switched) {
                if (game.win) losses += 1
                else { wins += 1 }
              } else {
                if (!game.win) losses += 1
                else { wins += 1 }
              }
            }
            sM.textContent = `${wins} - ${losses}`;
            if (switched) {
              sM.style.color = "#A90441";
            }
          }
          sc.appendChild(sM);
          tr.appendChild(sc);
          let p2 = document.createElement("td");
          p2.className = "pl2";
          var ap2 = document.createElement("a");
          ap2.textContent = switched ? match.player : match.opponent;
          ap2.href = `/u/${switched ? match.player : match.opponent}`;
          p2.appendChild(ap2);
          tr.appendChild(p2);
          if (switched ? match.opponentStats : match.stats) {
            let sstats = {};
            for (let ss of ALL_STATS) {
              sstats[ss] = "-";
            }
            for (const [key, value] of Object.entries(switched ? match.opponentStats : match.stats)) {
              if (isNaN(parseFloat(value)))
                continue;
              if (parseFloat(value) < 0)
                continue;
              if (sstats[key]) {
                sstats[key] = value;
              }
            }
            for (let ss of ALL_STATS) {
              let stat = document.createElement("td");
              stat.className = "apm";
              stat.textContent = sstats[ss];
              tr.appendChild(stat);
            }
          } else {
            for (let i = 0; i < ALL_STATS.length; i++) {
              let stat = document.createElement("td");
              stat.className = "apm";
              stat.textContent = "-";
              tr.appendChild(stat);
            }
          }
          let date = document.createElement("td");
          date.className = "date";
          date.textContent = new Date(match.date).toLocaleDateString();
          tr.appendChild(date);
          let btns = document.createElement("td");
          if (match.games && match.games.length > 0) {
            btns.style.display = "flex";
            btns.style.justifyContent = "flex-end";
            if (match.games) {
              for (let m of match.games) {
                let btn = document.createElement("button");
                btn.className = "mm-button";
                btns.appendChild(btn);
                if (m.win == switched) {
                  btn.style.backgroundColor = "#A90441";
                }
                btn.onclick = function () {
                  loadGame(m, match);
                };
              }
            }
          } else {
            btns.className = "apm";
          }
          tr.appendChild(btns);
          body.appendChild(tr);
        }
        matchView.appendChild(table);
        let opponentFilter = document.createElement("input")
        opponentFilter.type = "text"
        opponentFilter.name = "opponent"
        opponentFilter.className = "form-control"
        opponentFilter.placeholder = "Username"
        opponentFilter.autocomplete = "off"
        opponentFilter.style.padding = "10px"
        opponentFilter.multiple = true
        opponentFilter.onchange = (event) => {
          let raw_names = opponentFilter.value.split(" ")
          let names = []
          for (let name of raw_names) {
            names.push(name.toLowerCase())
          }
          for (let i = 0; i < body.children.length; i++) {
            let child = body.children[i]
            for (let j = 0; j < child.children.length; j++) {
              let child2 = child.children[j]
              if (child2.className == "pl2") {
                if (child2.firstChild && names.includes(child2.firstChild.textContent.toLowerCase())) child.style.display = ""
                else { child.style.display = "none" }
                break
              }
            }
          }
        }
        matchView.prepend(opponentFilter)
        cc.prepend(matchView)
        loader.remove()
        //              cc.prepend(collapsible)


      })
    })
  }
};
;// CONCATENATED MODULE: ./src/toggleChatKeyInput.js


const createKeyInputElement = (varName, desc) => {
  const TOGGLE_CHAT_KEY_INPUT_ELEMENT = document.createElement("div");
  TOGGLE_CHAT_KEY_INPUT_ELEMENT.className = "settings-inputRow";
  TOGGLE_CHAT_KEY_INPUT_ELEMENT.innerHTML += `<b>${desc}</b>`

  const inputDiv = document.createElement("div");
  const input = document.createElement("input");
  input.value = displayKeyCode(Config().TOGGLE_CHAT_KEYCODE);
  input.id = `${varName}_INPUT_ELEMENT`;

  input.addEventListener("keydown", e => {
    var charCode = (e.which) ? e.which : e.keyCode
    Config().set(varName, charCode);
    input.value = displayKeyCode(charCode);
    e.stopPropagation();
    e.preventDefault();
    return false;
  });
  input.addEventListener("keypress", () => false);
  const clearBtn = document.createElement("button");
  clearBtn.addEventListener("click", e => {
    Config().set(varName, null);
    input.value = displayKeyCode(null);
  })
  clearBtn.innerHTML = "Clear";

  input.style.marginRight = "5px";
  inputDiv.style.display = "flex";
  inputDiv.appendChild(input);
  inputDiv.appendChild(clearBtn);
  TOGGLE_CHAT_KEY_INPUT_ELEMENT.appendChild(inputDiv);

  return TOGGLE_CHAT_KEY_INPUT_ELEMENT;

}


// stolen from https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
function displayKeyCode(charCode) {
  
  if (charCode == null) {
    return "<enter a key>";
  }

  let a = String.fromCharCode(charCode);
  if (charCode == 8) a = "backspace"; //  backspace
  if (charCode == 9) a = "tab"; //  tab
  if (charCode == 13) a = "enter"; //  enter
  if (charCode == 16) a = "shift"; //  shift
  if (charCode == 17) a = "ctrl"; //  ctrl
  if (charCode == 18) a = "alt"; //  alt
  if (charCode == 19) a = "pause/break"; //  pause/break
  if (charCode == 20) a = "caps lock"; //  caps lock
  if (charCode == 27) a = "escape"; //  escape
  if (charCode == 32) a = "space"; // space
  if (charCode == 33) a = "page up"; // page up, to avoid displaying alternate character and confusing people	         
  if (charCode == 34) a = "page down"; // page down
  if (charCode == 35) a = "end"; // end
  if (charCode == 36) a = "home"; // home
  if (charCode == 37) a = "left arrow"; // left arrow
  if (charCode == 38) a = "up arrow"; // up arrow
  if (charCode == 39) a = "right arrow"; // right arrow
  if (charCode == 40) a = "down arrow"; // down arrow
  if (charCode == 45) a = "insert"; // insert
  if (charCode == 46) a = "delete"; // delete
  if (charCode == 91) a = "left window"; // left window
  if (charCode == 92) a = "right window"; // right window
  if (charCode == 93) a = "select key"; // select key
  if (charCode == 96) a = "numpad 0"; // numpad 0
  if (charCode == 97) a = "numpad 1"; // numpad 1
  if (charCode == 98) a = "numpad 2"; // numpad 2
  if (charCode == 99) a = "numpad 3"; // numpad 3
  if (charCode == 100) a = "numpad 4"; // numpad 4
  if (charCode == 101) a = "numpad 5"; // numpad 5
  if (charCode == 102) a = "numpad 6"; // numpad 6
  if (charCode == 103) a = "numpad 7"; // numpad 7
  if (charCode == 104) a = "numpad 8"; // numpad 8
  if (charCode == 105) a = "numpad 9"; // numpad 9
  if (charCode == 106) a = "multiply"; // multiply
  if (charCode == 107) a = "add"; // add
  if (charCode == 109) a = "subtract"; // subtract
  if (charCode == 110) a = "decimal point"; // decimal point
  if (charCode == 111) a = "divide"; // divide
  if (charCode == 112) a = "F1"; // F1
  if (charCode == 113) a = "F2"; // F2
  if (charCode == 114) a = "F3"; // F3
  if (charCode == 115) a = "F4"; // F4
  if (charCode == 116) a = "F5"; // F5
  if (charCode == 117) a = "F6"; // F6
  if (charCode == 118) a = "F7"; // F7
  if (charCode == 119) a = "F8"; // F8
  if (charCode == 120) a = "F9"; // F9
  if (charCode == 121) a = "F10"; // F10
  if (charCode == 122) a = "F11"; // F11
  if (charCode == 123) a = "F12"; // F12
  if (charCode == 144) a = "num lock"; // num lock
  if (charCode == 145) a = "scroll lock"; // scroll lock
  if (charCode == 186) a = ";"; // semi-colon
  if (charCode == 187) a = "="; // equal-sign
  if (charCode == 188) a = ","; // comma
  if (charCode == 189) a = "-"; // dash
  if (charCode == 190) a = "."; // period
  if (charCode == 191) a = "/"; // forward slash
  if (charCode == 192) a = "`"; // grave accent
  if (charCode == 219) a = "["; // open bracket
  if (charCode == 220) a = "\\"; // back slash
  if (charCode == 221) a = "]"; // close bracket
  if (charCode == 222) a = "'"; // single quote
  return a;
}

;// CONCATENATED MODULE: ./src/chat.js





let game = null;

const initChat = () => {
  'use strict';

  // === show or hide chat timestamps code ===
  // showing timestamp logic is in css
  if (Config().ENABLE_CHAT_TIMESTAMPS)
    document.body.classList.add("show-chat-timestamps");
  Config().onChange("ENABLE_CHAT_TIMESTAMPS", val => {
    if (val) {
      document.body.classList.add("show-chat-timestamps");
    } else {
      document.body.classList.remove("show-chat-timestamps");
    }
  })

  const oldReadyGo = Game.prototype.readyGo;
  Game.prototype.readyGo = function () {
    game = this;
    return oldReadyGo.apply(this, arguments);
  }

  // === toggle chat button code ===

  document.getElementById("TOGGLE_CHAT_KEYCODE_INPUT_ELEMENT").value = displayKeyCode(Config().TOGGLE_CHAT_KEYCODE);
  document.getElementById("CLOSE_CHAT_KEYCODE_INPUT_ELEMENT").value = displayKeyCode(Config().CLOSE_CHAT_KEYCODE);

  // thanks justin https://greasyfork.org/en/scripts/423192-change-chat-key
  document.addEventListener("keydown", e => {
    var charCode = (e.which) ? e.which : e.keyCode
    if (charCode == Config().TOGGLE_CHAT_KEYCODE) {
      if (game && game.focusState !== 1) { // game already focused, unfocus
        game.setFocusState(1);
        setTimeout(function () { game.Live.chatInput.focus() }, 0) // setTimeout to prevent the key from being typed

        // if keys are same, should close chat in this case
      } else if (Config().CLOSE_CHAT_KEYCODE == Config().TOGGLE_CHAT_KEYCODE) {
        document.getElementsByClassName("layer mainLayer gfxLayer")[0].click();
        document.getElementsByClassName("layer mainLayer gfxLayer")[0].focus();

      }
    } else if (charCode == Config().CLOSE_CHAT_KEYCODE) { // focus game
      document.getElementsByClassName("layer mainLayer gfxLayer")[0].click();
      document.getElementsByClassName("layer mainLayer gfxLayer")[0].focus();
    }
  });

  // === emote code ===

  let CUSTOM_EMOTES = [
    {
      u: "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/emotes/Cheese.png",
      t: "qep",
      g: "Jstris+",
      n: "MrCheese"
    }, {
      u: "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/emotes/Cat.png",
      t: "jermy",
      g: "Jstris+",
      n: "CatUp"
    }, {
      u: "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/emotes/Freg.png",
      t: "frog",
      g: "Jstris+",
      n: "FrogSad"
    }, {
      u: "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/emotes/freycat.webp",
      t: "frey",
      g: "Jstris+",
      n: "freycat"
    }, {
      u: "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/emotes/Blahaj.png",
      t: "jermy",
      g: "Jstris+",
      n: "StarHaj"
    }
    , {
      u: "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/emotes/ThisIsFine.png",
      t: "jermy",
      g: "Jstris+",
      n: "fine"
    }
  ]
  let chatListener = Live.prototype.showInChat
  Live.prototype.showInChat = function () {
    let zandria = arguments[1]

    if (typeof zandria == "string") {
      zandria = zandria.replace(/:(.*?):/g, function (match) {
        let cEmote = null
        for (let emote of CUSTOM_EMOTES) {
          if (emote.n == match.split(':')[1]) {
            cEmote = emote
            break
          }
        }
        if (cEmote) {
          return `<img src='${cEmote.u}' class='emojiPlus' alt=':${cEmote.n}:'>`
        }
        return match
      });
    }
    arguments[1] = zandria
    let val = chatListener.apply(this, arguments)
    // Add Timestamps
    var s = document.createElement("span");
    s.className = 'chat-timestamp';
    s.innerHTML = "[" + new Date().toTimeString().slice(0, 8) + "] ";
    var c = document.getElementsByClassName("chl");
    c[c.length - 1].prepend(s);

    return val
  }
  ChatAutocomplete.prototype.loadEmotesIndex = function (_0xd06fx4) {
    if (!this.moreEmotesAdded) {
      var brentson = new XMLHttpRequest,
        terrilynne = "/code/emotes?";
      brentson.timeout = 8e3,
        brentson.open("GET", terrilynne, true);
      try {
        brentson.send();
      } catch (bleu) { };
      var areeg = this;
      brentson.ontimeout = function () { },
        brentson.onerror = brentson.onabort = function () { },
        brentson.onload = function () {
          if (200 === brentson.status) {
            let zakeriah = JSON.parse(brentson.responseText);
            for (let emote of CUSTOM_EMOTES) {
              zakeriah.unshift(emote)
            }
            null !== areeg.preProcessEmotes && (zakeriah = areeg.preProcessEmotes(zakeriah)),
              areeg.addEmotes(zakeriah),
              null !== areeg.onEmoteObjectReady && areeg.onEmoteObjectReady(zakeriah);
          }
        };
    }
  }
  EmoteSelect.prototype.initializeContainers = function () {
    console.log(this.groupEmotes["Jstris+"] = "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/emotes/freycat.webp")
    this.searchElem = document.createElement("form"), this.searchElem.classList.add("form-inline", "emoteForm"), this.emoteElem.appendChild(this.searchElem), this.searchBar = document.createElement("input"), this.searchBar.setAttribute("autocomplete", "off"), this.searchBar.classList.add("form-control"), this.searchBar.id = "emoteSearch", this.searchBar.addEventListener("input", () => {
      this.searchFunction(this.emoteList);
    }), this.searchElem.addEventListener("submit", kesean => {
      kesean.preventDefault();
    }), this.searchBar.setAttribute("type", "text"), this.searchBar.setAttribute("placeholder", "Search Emotes"), this.searchElem.appendChild(this.searchBar), this.optionsContainer = document.createElement("div"), this.optionsContainer.classList.add("optionsContainer"), this.emoteElem.appendChild(this.optionsContainer), this.emotesWrapper = document.createElement("div"), this.emotesWrapper.classList.add("emotesWrapper"), this.optionsContainer.appendChild(this.emotesWrapper);
  }
  ChatAutocomplete.prototype.processHint = function (ylario) {

    var maizah = ylario[0].toLowerCase(),
      cahlin = ylario[1];
    if ("" !== this.prfx && (null === maizah || maizah.length < this.minimalLengthForHint || maizah[0] !== this.prfx)) {
      hideElem(this.hintsElem);
    } else {
      bertile = bertile;
      var maiesha = maizah.substring(this.prfx.length),
        bertile = this.prefixInSearch
          ? maizah
          : maiesha,
        cinque = 0,
        dyllan = "function" == typeof this.hints
          ? this.hints()
          : this.hints;
      this.hintsElem.innerHTML = "";
      var roey = [],
        tishie = [];
      for (var cedrik in dyllan) {
        var catenia = (shawnteria = dyllan[cedrik]).toLowerCase();
        catenia.startsWith(bertile)
          ? roey.push(shawnteria)
          : maiesha.length >= 2 && catenia.includes(maiesha) && tishie.push(shawnteria);
      };
      if (roey.sort(), roey.length < this.maxPerHint) {
        tishie.sort();
        for (const ajitesh of tishie) {
          if (-1 === roey.indexOf(ajitesh) && (roey.push(ajitesh), roey.length >= this.maxPerHint)) {
            break;
          }
        }
      };
      for (var shawnteria of roey) {
        var vidhu = document.createElement("div");
        if (this.hintsImg && this.hintsImg[shawnteria]) {
          vidhu.className = "emHint";
          var cebria = document.createElement("img");
          let cEmote = null
          for (let emote of CUSTOM_EMOTES) {
            if (emote.n == shawnteria.split(':')[1]) {
              cEmote = emote
              break
            }
          }
          if (cEmote) {
            cebria.src = cEmote.u
          } else {
            cebria.src = CDN_URL("/" + this.hintsImg[shawnteria])
          }
          vidhu.appendChild(cebria);
          var wael = document.createElement("div");
          wael.textContent = shawnteria,
            vidhu.appendChild(wael);
        } else {
          vidhu.innerHTML = shawnteria;
        };
        vidhu.dataset.pos = cahlin,
          vidhu.dataset.str = shawnteria;
        var yolandi = this;
        if (vidhu.addEventListener("click", function (dennies) {
          for (var ajane = yolandi.inp.value, delanei = parseInt(this.dataset.pos), xila = ajane.substring(0, delanei), neng = xila.indexOf(" "), marshelia = neng + 1; -1 !== neng;) {
            -1 !== (neng = xila.indexOf(" ", neng + 1)) && (marshelia = neng + 1);
          };
          yolandi.prefixInSearch || ++marshelia,
            yolandi.inp.value = ajane.substring(0, marshelia) + this.dataset.str + " " + ajane.substring(delanei),
            yolandi.inp.focus(),
            yolandi.setCaretPosition(delanei + this.dataset.str.length + 1 - (delanei - marshelia)),
            hideElem(yolandi.hintsElem),
            yolandi.wipePrevious && (yolandi.inp.value = this.dataset.str, yolandi.onWiped && yolandi.onWiped(this.dataset.str));
        }, false), this.hintsElem.appendChild(vidhu), ++cinque >= this.maxPerHint) {
          break;
        }
      };
      this.setSelected(0),
        cinque
          ? showElem(this.hintsElem)
          : hideElem(this.hintsElem);
    }
  }
  console.log("JSTRIS+ EMOTES LOADED")
}

;// CONCATENATED MODULE: ./src/style.css
/* harmony default export */ const style = ("@import url('https://fonts.googleapis.com/css2?family=Gugi&display=swap');\r\n\r\n/* =========== settings modal css ============= */\r\n\r\n.settings-modal {\r\n  display: none;\r\n  /* Hidden by default */\r\n  position: fixed;\r\n  /* Stay in place */\r\n  z-index: 99999;\r\n  /* Sit on top */\r\n  left: 0;\r\n  top: 0;\r\n  width: 100%;\r\n  /* Full width */\r\n  height: 100%;\r\n  /* Full height */\r\n  overflow: auto;\r\n  /* Enable scroll if needed */\r\n  background-color: rgb(0, 0, 0);\r\n  /* Fallback color */\r\n  background-color: rgba(0, 0, 0, 0.4);\r\n  /* Black w/ opacity */\r\n  -webkit-animation-name: fadeIn;\r\n  /* Fade in the background */\r\n  -webkit-animation-duration: 0.4s;\r\n  animation-name: fadeIn;\r\n  animation-duration: 0.4s;\r\n}\r\n\r\n.settings-modalCheckbox {\r\n  width: 30px;\r\n  height: 30px;\r\n}\r\n\r\n.settings-text {\r\n  text-align: center;\r\n}\r\n\r\n.settings-modalTextbox {\r\n  height: 30px;\r\n  font-size: 25px;\r\n  border: solid 1px black;\r\n\r\n}\r\n\r\n.settings-modalTextarea {\r\n  height: 60px;\r\n  border: solid 1px black;\r\n  resize: none;\r\n}\r\n\r\n.settings-modalContentTitle {\r\n  text-align: left;\r\n  width: 60%;\r\n  min-width: 300px;\r\n  margin: auto;\r\n  padding: 20px;\r\n}\r\n\r\n.settings-inputRow {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  width: 60%;\r\n  min-width: 300px;\r\n  margin: auto;\r\n  padding: 10px;\r\n  border-bottom: solid 1px #2c2c2c;\r\n  position: relative;\r\n}\r\n\r\n.settings-inputRow select {\r\n  color: black;\r\n}\r\n\r\n.settings-modalOpenButton {\r\n  width: 40px;\r\n  height: 40px;\r\n  cursor: pointer;\r\n  border-radius: 10px;\r\n  position: fixed;\r\n  left: 30px;\r\n  bottom: 30px;\r\n\r\n  transition: 0.5s;\r\n\r\n}\r\n\r\n.settings-modalCloseButton {\r\n  width: 30px;\r\n  height: 30px;\r\n  cursor: pointer;\r\n  transition: 0.5s;\r\n  position: absolute;\r\n  right: 12px;\r\n  top: 12px;\r\n}\r\n\r\n.settings-modalOpenButton:hover {\r\n  transform: rotate(-360deg);\r\n  opacity: 0.3;\r\n}\r\n\r\n.settings-modalClosebutton:hover {\r\n  opacity: 0.3;\r\n}\r\n\r\n/* Modal Content */\r\n.settings-modal-content {\r\n  position: fixed;\r\n  bottom: 0;\r\n  background-color: #fefefe;\r\n  width: 100%;\r\n  height: 75vh;\r\n  -webkit-animation-name: slideIn;\r\n  -webkit-animation-duration: 0.4s;\r\n  animation-name: slideIn;\r\n  display: flex;\r\n  flex-direction: column;\r\n  animation-duration: 0.4s;\r\n}\r\n\r\n.settings-modal-header {\r\n  padding: 16px;\r\n  background-color: #5cb85c;\r\n  color: white;\r\n  text-align: center;\r\n  position: relative;\r\n}\r\n\r\n.settings-modal-header h2 {\r\n  line-height: 16px;\r\n  margin-top: 3px;\r\n  margin-bottom: 3px;\r\n}\r\n\r\n.settings-modal-body {\r\n  padding: 2px 16px;\r\n  color: black;\r\n  flex: 1;\r\n  overflow-y: scroll;\r\n  background-color: #1c1c1c;\r\n  color: white;\r\n}\r\n\r\n.settings-modal-footer {\r\n  padding: 2px 16px;\r\n  background-color: #5cb85c;\r\n  color: white;\r\n}\r\n\r\n.settings-sliderValue {\r\n  position: absolute;\r\n  font-size: 18px;\r\n  right: 330px;\r\n}\r\n\r\n.settings-slider {\r\n  -webkit-appearance: none;\r\n  max-width: 300px;\r\n  height: 15px;\r\n  border-radius: 5px;\r\n  background: #d3d3d3;\r\n  outline: none;\r\n  opacity: 0.7;\r\n  -webkit-transition: .2s;\r\n  transition: opacity .2s;\r\n}\r\n\r\n.settings-slider:hover {\r\n  opacity: 1;\r\n}\r\n\r\n.settings-slider::-webkit-slider-thumb {\r\n  -webkit-appearance: none;\r\n  appearance: none;\r\n  width: 25px;\r\n  height: 25px;\r\n  border-radius: 50%;\r\n  background: #04AA6D;\r\n  cursor: pointer;\r\n}\r\n\r\n.settings-slider::-moz-range-thumb {\r\n  width: 25px;\r\n  height: 25px;\r\n  border-radius: 50%;\r\n  background: #04AA6D;\r\n  cursor: pointer;\r\n}\r\n\r\n/* Add Animation */\r\n@-webkit-keyframes slideIn {\r\n  from {\r\n    bottom: -300px;\r\n    opacity: 0\r\n  }\r\n\r\n  to {\r\n    bottom: 0;\r\n    opacity: 1\r\n  }\r\n}\r\n\r\n@keyframes slideIn {\r\n  from {\r\n    bottom: -300px;\r\n    opacity: 0\r\n  }\r\n\r\n  to {\r\n    bottom: 0;\r\n    opacity: 1\r\n  }\r\n}\r\n\r\n@-webkit-keyframes fadeIn {\r\n  from {\r\n    opacity: 0\r\n  }\r\n\r\n  to {\r\n    opacity: 1\r\n  }\r\n}\r\n\r\n@keyframes fadeIn {\r\n  from {\r\n    opacity: 0\r\n  }\r\n\r\n  to {\r\n    opacity: 1\r\n  }\r\n}\r\n\r\n/* =========== matchmaking css ============= */\r\n.mmMatches {\r\n  padding: 0 18px;\r\n  display: block;\r\n  overflow: hidden;\r\n}\r\n\r\n.mmContainer {\r\n  display: flex;\r\n  flex-direction: row;\r\n  z-index: 50;\r\n  color: white;\r\n  position: absolute;\r\n  left: 100px;\r\n  bottom: 30px;\r\n  color: #999;\r\n  width: 200px;\r\n  position: fixed;\r\n}\r\n\r\n.mmLoader {\r\n  border: 16px solid white;\r\n  border-top: 16px solid #04AA6D;\r\n  border-radius: 50%;\r\n  width: 120px;\r\n  height: 120px;\r\n  animation: mmSpin 2s linear infinite;\r\n  position: absolute;\r\n  top: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  right: 0;\r\n\r\n  margin: auto;\r\n}\r\n\r\n@keyframes mmSpin {\r\n  0% {\r\n    transform: rotate(0deg);\r\n  }\r\n\r\n  100% {\r\n    transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n.mmInfoContainer {\r\n  height: 40px;\r\n  flex-direction: column;\r\n  justify-content: center;\r\n  min-width: 150px;\r\n  align-items: center;\r\n  white-space: pre;\r\n  display: none;\r\n  /* hide unless show-queue-info */\r\n}\r\n\r\n.show-queue-info .mmInfoContainer {\r\n  display: flex !important;\r\n}\r\n\r\n.mmButton {\r\n  color: white;\r\n  height: 40px;\r\n  border: 2px solid white;\r\n  border-radius: 10px;\r\n  background-color: transparent;\r\n  min-width: 200px;\r\n  display: none;\r\n}\r\n\r\n.show-mm-button .mmButton {\r\n  display: block !important;\r\n}\r\n\r\n.mmModal {\r\n  display: none;\r\n  /* Hidden by default */\r\n  position: fixed;\r\n  /* Stay in place */\r\n  z-index: 1;\r\n  /* Sit on top */\r\n  padding-top: 100px;\r\n  /* Location of the box */\r\n  left: 0;\r\n  top: 0;\r\n  width: 100%;\r\n  /* Full width */\r\n  height: 100%;\r\n  /* Full height */\r\n  overflow: auto;\r\n  /* Enable scroll if needed */\r\n  background-color: rgb(0, 0, 0);\r\n  /* Fallback color */\r\n  background-color: rgba(0, 0, 0, 0.4);\r\n  /* Black w/ opacity */\r\n}\r\n\r\n/* Modal Content */\r\n.mmModal-content {\r\n  background-color: #fefefe;\r\n  margin: auto;\r\n  padding: 20px;\r\n  border: 1px solid #888;\r\n  width: 40%;\r\n  height: 40%;\r\n  background-color: #343837;\r\n  position: relative;\r\n}\r\n\r\n/* The Close Button */\r\n.mmClose {\r\n  position: absolute;\r\n  top: 0px;\r\n  right: 5px;\r\n  color: #aaaaaa;\r\n  font-size: 30px;\r\n  font-weight: bold;\r\n}\r\n\r\n.mmClose:hover,\r\n.mmClose:focus {\r\n  color: #000;\r\n  text-decoration: none;\r\n  cursor: pointer;\r\n}\r\n\r\n.mm-button {\r\n  border: none;\r\n  color: white;\r\n  padding: 10px;\r\n  text-align: center;\r\n  text-decoration: none;\r\n  display: inline-block;\r\n  font-size: 0px;\r\n  margin: 2px 2px;\r\n  border-radius: 100%;\r\n  border: 2px solid #222222;\r\n  background-color: #04AA6D;\r\n}\r\n\r\n.mm-button:hover {\r\n  border: 2px solid white;\r\n}\r\n\r\n.mm-chat-buttons-container {\r\n  position: sticky;\r\n  height: 45px;\r\n}\r\n\r\n.mm-ready-button {\r\n  border: none;\r\n  color: white;\r\n  padding: 10px;\r\n  text-align: center;\r\n  text-decoration: none;\r\n  margin: 2px 2px;\r\n  border: 2px solid #222222;\r\n  background-color: #04AA6D;\r\n}\r\n\r\n.mm-ready-button:hover {\r\n  border: 2px solid white;\r\n}\r\n\r\n/* =========== action text css ============= */\r\n\r\n.action-text {\r\n  transition: 1s;\r\n  /*font-family: 'Gugi', sans-serif;*/\r\n  -webkit-animation-name: bounce;\r\n  /* Fade in the background */\r\n  -webkit-animation-duration: 0.4s;\r\n  animation-name: action-text;\r\n  animation-duration: 0.4s;\r\n  animation-fill-mode: forwards;\r\n}\r\n\r\n@keyframes action-text {\r\n  0% {\r\n    transform: translateY(0);\r\n  }\r\n\r\n  30% {\r\n    transform: translateY(-3px);\r\n  }\r\n\r\n  100% {\r\n    transform: translateY(0);\r\n  }\r\n}\r\n\r\n/* Chat timestamp showing logic */\r\n\r\n.chat-timestamp {\r\n  display: none;\r\n  color: grey;\r\n}\r\n\r\n.show-chat-timestamps .chat-timestamp {\r\n  display: inline !important;\r\n}\r\n\r\n\r\n/* ===== stats css ===== */\r\n\r\n.stats-table {\r\n  z-index: 10;\r\n  color: white;\r\n  position: absolute;\r\n  left: -210px;\r\n  bottom: 40px;\r\n  color: #999;\r\n  width: 200px;\r\n}\r\n\r\n/* ===== kbd display css ===== */\r\n\r\n#keyboardHolder {\r\n  position: absolute;\r\n  left: -350px;\r\n  top: 100px;\r\n  transform-origin: top right;\r\n}\r\n\r\n@media screen and (max-width: 1425px) {\r\n  #keyboardHolder {\r\n    transform: scale(75%);\r\n    left: -262px;\r\n  }\r\n\r\n  #kps {\r\n    font-size: 27px !important;\r\n  }\r\n}\r\n\r\n@media screen and (max-width: 1260px) {\r\n  #keyboardHolder {\r\n    transform: scale(50%);\r\n    left: -200px;\r\n  }\r\n\r\n  #kps {\r\n    font-size: 40px !important;\r\n  }\r\n}\r\n\r\n@media screen and (max-width: 900px) {\r\n  #keyboardHolder {\r\n    transform: scale(50%);\r\n    left: 250px;\r\n    top: 500px;\r\n  }\r\n\r\n  #kps {\r\n    font-size: 40px !important;\r\n  }\r\n}\r\n\r\n#kbo {\r\n  text-align: center;\r\n  position: absolute;\r\n  font-size: 15px;\r\n}\r\n\r\n#kps {\r\n  margin-bottom: 10px;\r\n  font-size: 20px;\r\n}\r\n\r\n#kbo .tg {\r\n  border-collapse: collapse;\r\n  border-spacing: 0;\r\n  color: rgba(255, 60, 109);\r\n}\r\n\r\n#kbo .tg td {\r\n  padding: 10px 5px;\r\n  border-style: solid;\r\n  border-width: 2px;\r\n  transition: 0.1s;\r\n}\r\n\r\n#kbo .tg th {\r\n  padding: 10px 5px;\r\n  border-style: solid;\r\n  border-width: 2px;\r\n}\r\n\r\n#kbo .tg .kbnone {\r\n  border-color: #000000;\r\n  border: inherit;\r\n}\r\n\r\n#kbo .tg .kbkey {\r\n  border-color: rgba(130, 220, 94, 1);\r\n  background-color: black;\r\n}\r\n\r\n.hide-kbd-display {\r\n  display: none;\r\n}\r\n\r\n.really-hide-kbd-display {\r\n  /* for when keyboard display really should not be shown, like 1v1 replays (for now) */\r\n  display: none !important;\r\n}\r\n\r\n/* custom emoji */\r\n\r\n.emojiPlus {\r\n  height: 3em;\r\n  pointer-events: none;\r\n}\r\n\r\n\r\n/* practice mode settings */\r\n.show-practice-mode-settings {\r\n  display: block !important;\r\n}\r\n\r\n#customPracticeSettings {\r\n  z-index: 10;\r\n  color: white;\r\n  position: absolute;\r\n  left: -210px;\r\n  bottom: -80px;\r\n  color: #999;\r\n  width: 200px;\r\n  display: none;\r\n}\r\n\r\n#customPracticeSettings div {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  width: 100%;\r\n}\r\n\r\n#customPracticeSettings #customApmSlider {\r\n  width: 100px;\r\n}\r\n\r\n#customPracticeSettings #customApmInput {\r\n  width: 50px;\r\n}\r\n\r\n/* replay addons */\r\n\r\n.replay-btn {\r\n  padding: .25em .5em;\r\n  border: solid 1px white;\r\n  border-radius: 4px;\r\n  display: inline-block;\r\n  text-align: center;\r\n  color: #fff;\r\n  background-color: transparent;\r\n}\r\n\r\n.replay-btn:hover,\r\n.replay-btn:focus {\r\n  cursor: pointer;\r\n  color: #04AA6D;\r\n}\r\n\r\n.replay-btn-group {\r\n  display: inline-flex;\r\n  border: 1px solid white;\r\n  overflow: hidden;\r\n  border-radius: 4px;\r\n}\r\n\r\n.replay-btn-group>.c-btn {\r\n  border-radius: 0;\r\n  border: none;\r\n  border-right: 1px solid white;\r\n}\r\n\r\n.replay-btn-group>.c-btn:last-child {\r\n  border-right: none;\r\n}");
;// CONCATENATED MODULE: ./src/customSkinPresets.js



const FETCH_URL = "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/presets/skinPresets.json";
let CUSTOM_SKIN_PRESETS = [];
const fetchSkinPresets = () => {
  fetch(FETCH_URL, { cache: "reload" })
    .then(e => e.json())
    .then(j => {
      CUSTOM_SKIN_PRESETS = j;
      for (let i of CUSTOM_SKIN_PRESETS) {
        let option = document.createElement("option");
        option.value = JSON.stringify(i);
        option.innerHTML = i.name;
        dropdown.appendChild(option);
      }
    })
}


const CUSTOM_SKIN_PRESET_ELEMENT = document.createElement("div");
CUSTOM_SKIN_PRESET_ELEMENT.className = "settings-inputRow";
CUSTOM_SKIN_PRESET_ELEMENT.innerHTML += "<b>Custom skin presets</b>"

const dropdown = document.createElement("select");
dropdown.innerHTML += "<option>Select...</option>";

dropdown.addEventListener("change", () => {
  var { url, ghostUrl } = JSON.parse(dropdown.value);

  document.getElementById("CUSTOM_SKIN_URL").value = url || "";
  Config().set("CUSTOM_SKIN_URL", url || "");
  document.getElementById("CUSTOM_GHOST_SKIN_URL").value = ghostUrl || "";
  Config().set("CUSTOM_GHOST_SKIN_URL", ghostUrl || "");
  dropdown.selectedIndex = 0;
})

CUSTOM_SKIN_PRESET_ELEMENT.appendChild(dropdown);
;// CONCATENATED MODULE: ./src/customSoundPresets.js


const customSoundPresets_FETCH_URL = "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/presets/soundPresets.json"

let CUSTOM_SOUND_PRESETS = [];
const fetchSoundPresets = () => {
  fetch(customSoundPresets_FETCH_URL, { cache: "reload" })
    .then(e => e.json())
    .then(j => {
      CUSTOM_SOUND_PRESETS = j;
      for (let i of CUSTOM_SOUND_PRESETS) {
        let option = document.createElement("option");
        option.value = JSON.stringify(i);
        option.innerHTML = i.name;
        customSoundPresets_dropdown.appendChild(option);
      }
    })
}

const CUSTOM_SOUND_PRESET_ELEMENT = document.createElement("div");
CUSTOM_SOUND_PRESET_ELEMENT.className = "settings-inputRow";
CUSTOM_SOUND_PRESET_ELEMENT.innerHTML += "<b>Custom sound presets</b>"


const customSoundPresets_dropdown = document.createElement("select");
customSoundPresets_dropdown.innerHTML += "<option>Select...</option>";

customSoundPresets_dropdown.addEventListener("change", () => {
  document.getElementById("CUSTOM_SFX_JSON").value = customSoundPresets_dropdown.value;
  Config().set("CUSTOM_SFX_JSON", customSoundPresets_dropdown.value);

  customSoundPresets_dropdown.selectedIndex = 0;
})

CUSTOM_SOUND_PRESET_ELEMENT.appendChild(customSoundPresets_dropdown);


;// CONCATENATED MODULE: ./src/plusSoundPresets.js



const plusSoundPresets_FETCH_URL = "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/presets/plusSoundPresets.json"

let CUSTOM_PLUS_SOUND_PRESETS = [];
const fetchPlusSoundPresets = () => {
    fetch(plusSoundPresets_FETCH_URL, { cache: "reload" })
        .then(e => e.json())
        .then(j => {
            CUSTOM_PLUS_SOUND_PRESETS = j;
            for (let i of CUSTOM_PLUS_SOUND_PRESETS) {
                let option = document.createElement("option");
                option.value = JSON.stringify(i);
                option.innerHTML = i.name;
                plusSoundPresets_dropdown.appendChild(option);
            }
        })
}

const CUSTOM_PLUS_SOUND_PRESET_ELEMENT = document.createElement("div");
CUSTOM_PLUS_SOUND_PRESET_ELEMENT.className = "settings-inputRow";
CUSTOM_PLUS_SOUND_PRESET_ELEMENT.innerHTML += "<b>Custom Jstris+ sound presets</b>"


const plusSoundPresets_dropdown = document.createElement("select");
plusSoundPresets_dropdown.innerHTML += "<option>Select...</option>";

plusSoundPresets_dropdown.addEventListener("change", () => {
    document.getElementById("CUSTOM_PLUS_SFX_JSON").value = plusSoundPresets_dropdown.value;
    Config().set("CUSTOM_PLUS_SFX_JSON", plusSoundPresets_dropdown.value);
    setPlusSfx(plusSoundPresets_dropdown.value)

    plusSoundPresets_dropdown.selectedIndex = 0;
})

CUSTOM_PLUS_SOUND_PRESET_ELEMENT.appendChild(plusSoundPresets_dropdown);


;// CONCATENATED MODULE: ./src/settingsModal.js






const GEAR_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M7.07.65a.85.85 0 0 0-.828.662l-.238 1.05q-.57.167-1.08.448l-.91-.574a.85.85 0 0 0-1.055.118l-.606.606a.85.85 0 0 0-.118 1.054l.574.912q-.28.509-.447 1.079l-1.05.238a.85.85 0 0 0-.662.829v.857a.85.85 0 0 0 .662.829l1.05.238q.166.57.448 1.08l-.575.91a.85.85 0 0 0 .118 1.055l.607.606a.85.85 0 0 0 1.054.118l.911-.574q.51.28 1.079.447l.238 1.05a.85.85 0 0 0 .829.662h.857a.85.85 0 0 0 .829-.662l.238-1.05q.57-.166 1.08-.447l.911.574a.85.85 0 0 0 1.054-.118l.606-.606a.85.85 0 0 0 .118-1.054l-.574-.911q.282-.51.448-1.08l1.05-.238a.85.85 0 0 0 .662-.829v-.857a.85.85 0 0 0-.662-.83l-1.05-.237q-.166-.57-.447-1.08l.574-.91a.85.85 0 0 0-.118-1.055l-.606-.606a.85.85 0 0 0-1.055-.118l-.91.574a5.3 5.3 0 0 0-1.08-.448l-.239-1.05A.85.85 0 0 0 7.928.65zM4.92 3.813a4.5 4.5 0 0 1 1.795-.745L7.071 1.5h.857l.356 1.568a4.5 4.5 0 0 1 1.795.744l1.36-.857l.607.606l-.858 1.36c.37.527.628 1.136.744 1.795l1.568.356v.857l-1.568.355a4.5 4.5 0 0 1-.744 1.796l.857 1.36l-.606.606l-1.36-.857a4.5 4.5 0 0 1-1.795.743L7.928 13.5h-.857l-.356-1.568a4.5 4.5 0 0 1-1.794-.744l-1.36.858l-.607-.606l.858-1.36a4.5 4.5 0 0 1-.744-1.796L1.5 7.93v-.857l1.568-.356a4.5 4.5 0 0 1 .744-1.794L2.954 3.56l.606-.606zM9.026 7.5a1.525 1.525 0 1 1-3.05 0a1.525 1.525 0 0 1 3.05 0m.9 0a2.425 2.425 0 1 1-4.85 0a2.425 2.425 0 0 1 4.85 0" clip-rule="evenodd"/></svg>
`

const X_SVG = `
<svg fill="#000000" width="30" height="30" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fill="#333" fill-rule="evenodd"/>
</svg>
`

const createTitle = (text, style) => {
  var modalBody = document.getElementById("settingsBody");
  var p = document.createElement("h3");
  p.className = "settings-modalContentTitle";
  p.textContent = text;
  if (style)
    for (var i in style)
      p.style[i] = style[i];
  modalBody.appendChild(p);
}

const createCheckbox = (varName, displayName) => {
  var modalBody = document.getElementById("settingsBody");
  var box = document.createElement("input")
  box.type = "checkbox"
  box.id = varName;
  box.checked = Config()[varName];
  box.className = "settings-modalCheckbox";
  box.addEventListener("change", () => {
    Config().set(varName, box.checked);
  });
  var label = document.createElement("label");
  label.htmlFor = varName;
  label.innerHTML = displayName;

  var div = document.createElement("div");
  div.className = "settings-inputRow";
  div.appendChild(label);
  div.appendChild(box);

  modalBody.appendChild(div);

}

const createTextInput = (varName, displayName) => {
  var modalBody = document.getElementById("settingsBody");
  var box = document.createElement("input")
  box.type = "text"
  box.id = varName;
  box.value = Config()[varName];
  box.className = "settings-modalTextbox";
  box.addEventListener("change", () => {
    Config().set(varName, box.value);
  });
  var label = document.createElement("label");
  label.htmlFor = varName;
  label.innerHTML = displayName;

  var div = document.createElement("div");
  div.className = "settings-inputRow";
  div.appendChild(label);
  div.appendChild(box);

  modalBody.appendChild(div);

}

const createResetButton = (toReset, displayName) => {
  let vars = toReset;
  if (!Array.isArray(toReset))
    vars = [toReset];
  var modalBody = document.getElementById("settingsBody");
  var button = document.createElement("button")
  button.addEventListener("click", () => {
    vars.forEach((varName) => {
      Config().reset(varName);
      let el = document.getElementById(varName);
      if (el.type == "checkbox") {
        el.checked = Config()[varName];
      } else {
        el.value = Config()[varName];
      }
      el.dispatchEvent(new Event('change', { value: el.value }));
    });
  });
  button.textContent = displayName;

  var div = document.createElement("div");
  div.className = "settings-inputRow";
  div.appendChild(button);

  modalBody.appendChild(div);

}

const createTextArea = (varName, displayName) => {
  var modalBody = document.getElementById("settingsBody");
  var box = document.createElement("textarea")
  box.id = varName;
  box.value = Config()[varName];
  box.className = "settings-modalTextarea";
  box.addEventListener("change", () => {
    Config().set(varName, box.value);
  });
  var label = document.createElement("label");
  label.htmlFor = varName;
  label.innerHTML = displayName;

  var div = document.createElement("div");
  div.className = "settings-inputRow";
  div.appendChild(label);
  div.appendChild(box);

  modalBody.appendChild(div);

}


const createHTML = (ele) => {
  var modalBody = document.getElementById("settingsBody");
  var p = document.createElement("div");
  if (typeof ele == "string")
    p.innerHTML = ele;
  else
    p.appendChild(ele);
  modalBody.appendChild(p);
}

const createSliderInput = (varName, displayName, min = 0, max = 1, step = 0.05) => {
  var modalBody = document.getElementById("settingsBody");
  var slider = document.createElement("input")
  slider.type = "range"
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.id = varName;
  slider.value = Config()[varName];
  slider.className = "settings-slider";
  var valueLabel = document.createElement("span");
  valueLabel.className = "settings-sliderValue"
  slider.addEventListener("change", () => {
    Config().set(varName, slider.value);
    valueLabel.innerHTML = Number.parseFloat(slider.value).toFixed(2);
  });
  valueLabel.innerHTML = Number.parseFloat(Config()[varName]).toFixed(2);

  var label = document.createElement("label");
  label.htmlFor = varName;
  label.innerHTML = displayName;

  var div = document.createElement("div");
  div.className = "settings-inputRow";
  div.appendChild(label);
  div.appendChild(slider);
  div.appendChild(valueLabel);

  modalBody.appendChild(div);

}

const generateBody = () => {
  createHTML(`<p class='settings-text'><a href="http://jeague.tali.software" class='settings-text'>About Jstris+</a></p>`)
  createTitle("Visual settings");
  createCheckbox("ENABLE_PLACE_BLOCK_ANIMATION", "Enable place block animation");
  createSliderInput("PIECE_FLASH_LENGTH", "Length of place block animation");
  createSliderInput("PIECE_FLASH_OPACITY", "Initial opacity of place block animation");
  createCheckbox("ENABLE_LINECLEAR_ANIMATION", "Enable line clear animations");
  createSliderInput("LINE_CLEAR_LENGTH", "Length of line clear animation", 0, 2);
  createCheckbox("ENABLE_LINECLEAR_SHAKE", "Enable shake on line clear");
  createSliderInput("LINE_CLEAR_SHAKE_STRENGTH", "Strength of line clear shake", 0, 5);
  createSliderInput("LINE_CLEAR_SHAKE_LENGTH", "Length of line clear shake", 0, 3);
  createCheckbox("ENABLE_ACTION_TEXT", "Enable action text");
  createResetButton([
    "ENABLE_PLACE_BLOCK_ANIMATION", "PIECE_FLASH_LENGTH", "PIECE_FLASH_OPACITY", "ENABLE_LINECLEAR_ANIMATION",
    "LINE_CLEAR_LENGTH", "ENABLE_LINECLEAR_SHAKE", "LINE_CLEAR_SHAKE_STRENGTH", "LINE_CLEAR_SHAKE_LENGTH",
    "ENABLE_ACTION_TEXT"
  ], "Reset Visual Settings to Default")

  createTitle("Customization Settings");

  createHTML(`<p class='settings-text'>Checkout the 
  <a target='_blank' href='https://docs.google.com/spreadsheets/d/1xO8DTORacMmSJAQicpJscob7WUkOVuaNH0wzkR_X194/htmlview#'>Jstris Customization Database</a>
  for a list of skins and backgrounds to use.</p>`)

  createTextInput("BACKGROUND_IMAGE_URL", "Background image url (blank for none)");

  fetchSkinPresets();
  createHTML(CUSTOM_SKIN_PRESET_ELEMENT);
  createTextInput("CUSTOM_SKIN_URL", "Custom block skin url (blank for regular skin)");
  createTextInput("CUSTOM_GHOST_SKIN_URL", "Custom ghost block skin url (blank for default)");
  createHTML(`<p class='settings-text'>(Turning off custom skin may require a refresh)</p>`);
  createCheckbox("ENABLE_REPLAY_SKIN", "Enable custom skins in replays (requires refresh)");
  createCheckbox("ENABLE_KEYBOARD_DISPLAY", "Enable keyboard overlay");

  createTitle("Audio settings");

  fetchPlusSoundPresets();
  createHTML(CUSTOM_PLUS_SOUND_PRESET_ELEMENT)
  createTextArea("CUSTOM_PLUS_SFX_JSON", "Data for custom plus SFX");
  createHTML(`<p class='settings-text' id='custom_plus_sfx_json_err'></p>`);

  createCheckbox("ENABLE_OPPONENT_SFX", "Enable opponent SFX");
  createSliderInput("OPPONENT_SFX_VOLUME_MULTPLIER", "Opponent SFX volume");
  createCheckbox("ENABLE_CUSTOM_SFX", "Enable custom SFX (turning off requires refresh)");
  createHTML(`<p class='settings-text'>(Turning off custom sounds may require a refresh)</p>`)
  createCheckbox("ENABLE_CUSTOM_VFX", "Enable custom spawn SFX (voice annotations)");
  createHTML(`<p class='settings-text'>(Custom SFX must be enabled for spawn SFX)</p>`);

  fetchSoundPresets();
  createHTML(CUSTOM_SOUND_PRESET_ELEMENT);
  createTextArea("CUSTOM_SFX_JSON", "Data for custom SFX");
  createHTML(`<p class='settings-text' id='custom_sfx_json_err'></p>`);

  createHTML(`<p class='settings-text'>Refer to the <a target="_blank" href="https://docs.google.com/document/d/1FaijL-LlBRnSZBbnQ2FUWxF9ktgoAQy0NnoHpjkXadE/edit#">guide</a> and the 
  <a target='_blank' href='https://docs.google.com/spreadsheets/d/1xO8DTORacMmSJAQicpJscob7WUkOVuaNH0wzkR_X194/htmlview#'>Jstris Customization Database</a>
  for custom SFX resources.`)

  createTitle("Custom stats settings");
  createCheckbox("ENABLE_STAT_APP", "Enable attack per piece stat (for all modes)");
  createCheckbox("ENABLE_STAT_PPD", "Enable pieces per downstack stat (100L cheese pace / 100) (for all modes)");
  createCheckbox("ENABLE_STAT_CHEESE_BLOCK_PACE", "Enable block pace stat for cheese race");
  createCheckbox("ENABLE_STAT_CHEESE_TIME_PACE", "Enable time pace stat for cheese race");
  createCheckbox("ENABLE_STAT_PPB", "Enable points per block stat for ultra");
  createCheckbox("ENABLE_STAT_SCORE_PACE", "Enable score pace for ultra");
  createCheckbox("ENABLE_STAT_PC_NUMBER", "Enable pc number indicator for pc mode");

  createTitle("Misc settings");
  createCheckbox("ENABLE_AUTOMATIC_REPLAY_CODES", "Enable automatic replay code saving on reset");
  createHTML(createKeyInputElement("UNDO_KEYCODE", "keybind to undo moves in practice mode"));
  createCheckbox("ENABLE_CHAT_TIMESTAMPS", "Enable chat timestamps");
  createCheckbox("SHOW_MM_BUTTON", "Show matchmaking button");
  createCheckbox("SHOW_QUEUE_INFO", "Show matchmaking queue info");
  createHTML(createKeyInputElement("TOGGLE_CHAT_KEYCODE", "Open chat with this button"));
  createHTML(createKeyInputElement("CLOSE_CHAT_KEYCODE", "Close chat with this button"));
  createHTML(createKeyInputElement("SCREENSHOT_KEYCODE", "Take a screenshot with this button"));
}

const initModal = () => {


  // modal UI inject
  var modalButton = document.createElement("div");
  modalButton.innerHTML = GEAR_SVG;
  modalButton.className = "settings-modalOpenButton";

  var modalCloseButton = document.createElement("div");
  modalCloseButton.innerHTML = X_SVG;
  modalCloseButton.className = "settings-modalCloseButton"

  modalButton.addEventListener("click", () => {
    if (typeof ($) == "function")
      $(window).trigger('modal-opened');
    modal.style.display = "flex";
  });
  modalCloseButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  var modal = document.createElement("div");
  modal.className = "settings-modal";

  var modalContent = document.createElement("div");
  modalContent.className = "settings-modal-content";


  var modalHeader = document.createElement("div");
  modalHeader.className = "settings-modal-header";

  var header = document.createElement("h2");
  header.innerHTML = "Jstris+ Settings";

  modalHeader.appendChild(header);
  modalHeader.appendChild(modalCloseButton)

  var modalBody = document.createElement("div");
  modalBody.id = "settingsBody";
  modalBody.className = "settings-modal-body";

  modal.appendChild(modalContent);
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);

  document.body.appendChild(modal);
  document.body.appendChild(modalButton);


  generateBody();

}
;// CONCATENATED MODULE: ./src/layout.js


const createBGElement = () => {
  const ele = document.createElement("div");
  ele.id = "JS_PLUS_BG_ELEMENT";
  ele.style = "z-index: -100; position: absolute; height: max(100%, 100vh); width: 100%; top: 0px; left: 0px; background-size: cover;";
  document.body.appendChild(ele)
  return ele;
}

const changeBG = link => {
  console.log("Changing BG to " + link);
  document.body.style.position = "relative"
  var app = document.getElementById("JS_PLUS_BG_ELEMENT") ?? createBGElement();
  app.style.backgroundImage = `url(${link})`;
}

const initLayout = () => {
  changeBG(Config().BACKGROUND_IMAGE_URL)
  Config().onChange("BACKGROUND_IMAGE_URL", val => {
    changeBG(val);
  });
  console.log("Layout loaded.");
}
;// CONCATENATED MODULE: ./src/stats.js



const replaceBadValues = (n, defaultValue) => {
  // NaN check
  if (Number.isNaN(n) || !Number.isFinite(n))
    return defaultValue || 0;
  return n;

}

let stats = [];
const updateStats = function () {

  const index = this.ISGAME? 0 : parseInt(this.v.canvas.parentElement.getAttribute("data-index"));
  stats[index].forEach((stat) => {
    if (stat.enabled && stat.row) {
      if (stat.enabledMode && stat.enabledMode != this.pmode) {
        stat.row.style.display = "none";
        return;
      }
      stat.row.style.display = "table-row";
      var val = stat.calc(this);
      stat.row.children[1].innerHTML = val;
    } else {
      stat.row.style.display = "none";
    }
  });
}
const initStat = (index, name, configVar, calc, options = {}) => {
  stats[index].push({
    name,
    calc,
    val: 0,
    enabled: Config()[configVar],
    initialValue: options.initialValue || 0,
    enabledMode: options.enabledMode || 0, // 0 = enabled for all modes 
  });
  Config().onChange(configVar, val => {
    for (var individualStats of stats)
      var stat = individualStats.find(e => e.name == name);
      stat.enabled = val;
  })
}

const initStats = () => {
  const stages = document.querySelectorAll("#stage");
  stages.forEach((stageEle, i) => {
    stageEle.setAttribute("data-index", i); 
    stats.push([]);
    initGameStats(stageEle, i);
  })

}
const initGameStats = (stageEle, index) => {
  // these must be non-arrow functions so they can be bound
  initStat(index,"APP", "ENABLE_STAT_APP", game => replaceBadValues(game.gamedata.attack / game.placedBlocks).toFixed(3));
  initStat(index,"PPD", "ENABLE_STAT_PPD", game => replaceBadValues(game.placedBlocks / game.gamedata.garbageCleared).toFixed(3));

  initStat(index,"Block pace", "ENABLE_STAT_CHEESE_BLOCK_PACE", game => {
    let totalLines = game.ISGAME ? game["cheeseModes"][game["sprintMode"]] : game.initialLines;
    let linesLeft = game.linesRemaining
    let linesCleared = totalLines - linesLeft
    var piecePace = replaceBadValues((linesLeft / linesCleared) * game["placedBlocks"] + game["placedBlocks"])
    return (piecePace * 0 + 1) ? Math.floor(piecePace) : '0'
  }, { enabledMode: 3 });

  initStat(index,"Time pace", "ENABLE_STAT_CHEESE_TIME_PACE", game => {
    let totalLines = game.ISGAME ? game["cheeseModes"][game["sprintMode"]] : game.initialLines;
    let linesLeft = game.linesRemaining
    let linesCleared = totalLines - linesLeft;
    let time = game.ISGAME? game.clock : game.clock / 1000;
    var seconds = replaceBadValues((totalLines / linesCleared) * time);
    let m = Math.floor(seconds / 60)
    let s = Math.floor(seconds % 60)
    let ms = Math.floor((seconds % 1) * 100)
    return (m ? (m + ":") : '') + ("0" + s).slice(-2) + "." + ("0" + ms).slice(-2)
  }, { enabledMode: 3 });

  initStat(index,"PPB", "ENABLE_STAT_PPB", game => {
    var score = game["gamedata"]["score"];
    var placedBlocks = game["placedBlocks"];
    return replaceBadValues(score / placedBlocks).toFixed(2);
  }, { enabledMode: 5 });

  initStat(index,"Score pace", "ENABLE_STAT_SCORE_PACE", game => {
    var score = game["gamedata"]["score"];
    let time = game.ISGAME? game.clock : game.clock / 1000;
    return replaceBadValues(score + score / time * (120 - time)).toFixed(0);
  }, { enabledMode: 5 });

  initStat(index,"PC #", "ENABLE_STAT_PC_NUMBER", game => {
    let suffixes = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th'];
    let pcs = game.gamedata.PCs;
    
    if (!game.PCdata)
      return "1st";
    var blocks = game.placedBlocks - game.PCdata.blocks;
    let pcNumber = ((pcs + 1 + 3 * ((10 * pcs - blocks) / 5)) % 7) || 7;
    pcNumber = replaceBadValues(pcNumber, 1);
    if (!Number.isInteger(pcNumber))
      return "";
    return pcNumber + suffixes[pcNumber];
  }, { enabledMode: 8 });

  const statsTable = document.createElement("TABLE");
  statsTable.className = 'stats-table'
  //document.getElementById("stage").appendChild(statsTable);
  stageEle.appendChild(statsTable);

  stats[index].forEach(stat => {
    const row = document.createElement('tr');
    row.style.display = "none";
    const name = document.createElement('td');
    name.innerHTML = stat.name;
    const val = document.createElement('td');
    val.className = 'val';
    val.id = `${stat.name}-val`;
    val.innerHTML = stat.val;
    row.appendChild(name);
    row.appendChild(val);
    statsTable.appendChild(row);
    stat.row = row;
  })
  if (typeof Game == "function") {
    let oldQueueBoxFunc = Game.prototype.updateQueueBox;
    Game.prototype.updateQueueBox = function () {
      updateStats.call(this)
      return oldQueueBoxFunc.apply(this, arguments);
    }
  }
  if (typeof Replayer == "function" && typeof Game != "function") {
    let oldQueueBoxFunc = Replayer.prototype.updateQueueBox;
    Replayer.prototype.updateQueueBox = function () {
      updateStats.call(this)      
      return oldQueueBoxFunc.apply(this, arguments);
    }

    let oldCheckLineClears = Replayer.prototype.checkLineClears;
    Replayer.prototype.checkLineClears = function() {
      let val = oldCheckLineClears.apply(this, arguments);
      if (this.PCdata) {
        // empty matrix check
        if (this.matrix.every(row => row.every(cell => cell == 0))) {
          this.PCdata.blocks = 0;
        } else {
          this.PCdata.blocks++;
        }

      }
      return val;
    }

    var oldInitReplay = Replayer.prototype.initReplay;
    Replayer.prototype.initReplay = function () {
      let val = oldInitReplay.apply(this, arguments);
      this.initialLines = this.linesRemaining;
      if (this.pmode == 8)
        this.PCdata = { blocks : 0 }

      return val;
    }
  }

}
;// CONCATENATED MODULE: ./src/sfxLoader.js


const attemptLoadSFX = function () {
    if (typeof loadSFX == "function") {
        loadSFX(...arguments);
    } else {
        setTimeout(() => attemptLoadSFX(...arguments), 200);
    }
}
const loadSound = (name, url) => {
    if (!name || !url) {
        return;
    }
    let ishta = url.url
    if (ishta) {

        let enslee = createjs.Sound.registerSound(ishta, name);
        if (!enslee || !createjs.Sound._idHash[name]) {
            return void console.error("loadSounds error: src parse / cannot init plugins, id=" + name + (false === enslee ? ", rs=false" : ", no _idHash"));
        }
        createjs.Sound._idHash[name].sndObj = url;
    }
};

/*
// functionality is now addressed in replayer-sfx.js
const loadReplayerSFX = function (sfx) {
    let SOUNDS = ["hold", "linefall", "lock", "harddrop", "rotate", "success", "garbage", "b2b", "land", "move", "died", "ready", "go", "golive", "ding", "msg", "fault", "item", "pickup"];
    let SErot = localStorage.getItem("SErot")
    if (!SErot) {
        sfx.rotate = { url: "null.wav" }
    }
    if (sfx.scoring) {
        for (var i = 0; i < sfx.scoring.length; ++i) {
            sfx.scoring[i] && loadSound("s" + i, sfx.scoring[i]);
        }
    }
    if (sfx.b2bScoring && Array.isArray(sfx.b2bScoring)) {
        for (i = 0; i < sfx.b2bScoring.length; ++i) {
            sfx.b2bScoring[i] && loadSound("bs" + i, sfx.b2bScoring[i]);
        }
    }
    if (sfx.spawns) {
        for (var talitha in sfx.spawns) {
            loadSound("b_" + talitha, sfx.spawns[talitha]);
        }
    }
    for (i = 0; i < SOUNDS.length; ++i) {
        let kayley = SOUNDS[i];
        loadSound(kayley, sfx[kayley]);
    }
    if (sfx.comboTones && Array.isArray(sfx.comboTones)) {
        for (i = 0; i < sfx.comboTones.length; ++i) {
            var zohet = sfx.comboTones[i];
            zohet && createjs.Sound.registerSound(sfx.getSoundUrlFromObj(zohet), "c" + i);
        }
        sfx.maxCombo = sfx.comboTones.length - 1;
    } else {
        if (sfx.comboTones) {
            var kisa = [];
            for (i = 0; i < sfx.comboTones.cnt; ++i) {
                kisa.push({ id: "c" + i, startTime: i * (sfx.comboTones.duration + sfx.comboTones.spacing), duration: sfx.comboTones.duration });
            }
            sfx.maxCombo = sfx.comboTones.cnt - 1;
            var kaley = [{ src: sfx.getSoundUrl("comboTones"), data: { audioSprite: kisa } }];
            createjs.Sound.registerSounds(kaley, "");
        }
    }
}
*/

const loadDefaultSFX = () => {
    console.log("loading default sfx")
    try {
        loadSFX(new window.SFXsets[localStorage["SFXset"]].data());
    } catch (e) { // just in case
        console.log("failed loading default sfx: " + e);
    }
    return;
}

const changeSFX = () => {
    var json = Config().CUSTOM_SFX_JSON;
    let sfx = null;

    if (json) {
        try {
            sfx = JSON.parse(json);
            document.getElementById("custom_sfx_json_err").innerHTML = "Loaded " + (sfx.name || "custom sounds");
        } catch (e) {
            console.log("SFX json was invalid.");
            document.getElementById("custom_sfx_json_err").innerHTML = "SFX json is invalid.";
        }
    } else {
        document.getElementById("custom_sfx_json_err").innerHTML = "";
    }
    if (typeof Game == "function") {
        if (!Config().ENABLE_CUSTOM_SFX || !sfx) {
            loadDefaultSFX();
        } else {
            console.log("Changing SFX...");
            console.log(sfx);

            let csfx = loadCustomSFX(sfx);
            attemptLoadSFX(csfx)

        }
    }

    /*
    // functionality here now addressed in replayer-sfx.js
    if (typeof window.View == "function" && typeof window.Live != "function") { //force sfx on replayers
        let onready = View.prototype.onReady
        View.prototype.onReady = function () {
            let val = onready.apply(this, arguments);
            let csfx = loadCustomSFX(sfx)
            this.SFXset = csfx
            //   loadReplayerSFX(csfx)
            //   console.log(this.SFXset)
            return val
        }
    }
    */
}

const initCustomSFX = () => {
    if (!createjs) return


    if (typeof Game == "function") {
        let onnextblock = Game.prototype.getNextBlock
        Game.prototype.getNextBlock = function () {

            if (Config().ENABLE_CUSTOM_VFX) {
                this.playCurrentPieceSound()
            }
            let val = onnextblock.apply(this, arguments)
            return val
        }
        let onholdblock = Game.prototype.holdBlock
        Game.prototype.holdBlock = function () {
            if (Config().ENABLE_CUSTOM_VFX) {
                this.playCurrentPieceSound()
            }
            let val = onholdblock.apply(this, arguments)
            return val
        }
    }

    /*   let onPlay = createjs.Sound.play
       createjs.Sound.play = function () {
           console.log(arguments[0])
           let val = onPlay.apply(this, arguments)
           return val
       }*/
    changeSFX(Config().CUSTOM_SFX_JSON)
    Config().onChange("CUSTOM_SFX_JSON", changeSFX);
    Config().onChange("ENABLE_CUSTOM_SFX", changeSFX);
    Config().onChange("ENABLE_CUSTOM_VFX", changeSFX);
    return true
}

const loadCustomSFX = (sfx = {}) => {
    const SOUNDS = ["hold", "linefall", "lock", "harddrop", "rotate", "success", "garbage", "b2b", "land", "move", "died", "ready", "go", "golive", "ding", "msg", "fault", "item", "pickup"]
    let SCORES = [
        "SOFT_DROP",
        "HARD_DROP",
        "CLEAR1",
        "CLEAR2",
        "CLEAR3",
        "CLEAR4",
        "TSPIN_MINI",
        "TSPIN",
        "TSPIN_MINI_SINGLE",
        "TSPIN_SINGLE",
        "TSPIN_DOUBLE",
        "TSPIN_TRIPLE",
        "PERFECT_CLEAR",
        "COMBO",
        "CLEAR5"
    ]
    function CustomSFXset() {
        this.volume = 1
    }
    CustomSFXset.prototype = new BaseSFXset;
    CustomSFXset.prototype.getSoundUrlFromObj = function (obj) {
        return obj.url
    }

    CustomSFXset.prototype.getClearSFX = function (altClearType, clearType, b2b, combo) {
        let sounds = [],
            prefix = '';
        let specialSound = null
        let override = false
        if (this.specialScoring) {
            let scorings = [this.specialScoring[SCORES[clearType]]]
            if ((clearType > 4 && clearType <= 11) || clearType == 14) {
                if (this.specialScoring.TSPINORTETRIS) {
                    scorings.push(this.specialScoring.TSPINORTETRIS)
                }
            } else if (clearType == 127) {
                if (this.specialScoring.ALLSPIN) {
                    scorings.push(this.specialScoring.ALLSPIN)
                }
            }
            for (let scoring of scorings) {
                if (Array.isArray(scoring)) {

                    let bestFit = { score: 0.5, sound: null, combo: -1 }
                    for (let sfx of scoring) {
                        let score = 0
                        if (sfx.hasOwnProperty("b2b") && sfx.b2b == b2b) {
                            score += 1
                        }
                        if (sfx.hasOwnProperty("combo") && sfx.combo <= combo) {
                            score += 1
                        }
                        if (bestFit.score < score) {
                            override = sfx.override
                            bestFit = { score: score, sound: sfx.name, combo: combo }
                        } else if (bestFit.score == score) {
                            if (sfx.combo && combo > bestFit.combo) {
                                override = sfx.override
                                bestFit = { score: score, sound: sfx.name, combo: combo }
                            }
                        }
                    }
                    if (bestFit.sound != null) {
                        specialSound = bestFit.sound
                        sounds.push(specialSound)
                    }
                }
            }

            if (this.specialScoring.ANY) {
                let bestFit = { score: 0, sound: null, combo: -1 }

                for (let sfx of this.specialScoring.ANY) {
                    let score = 0
                    if (sfx.hasOwnProperty("b2b")) {
                        if (sfx.b2b == b2b) score += 1
                        else continue
                    }

                    if (sfx.hasOwnProperty("combo")) {
                        if (sfx.combo <= combo) score += 1
                        else continue
                    }
                    if (bestFit.score < score) {
                        override = sfx.override
                        bestFit = { score: score, sound: sfx.name, combo: combo }
                    } else if (bestFit.score == score) {
                        if (sfx.combo && combo > bestFit.combo) {
                            override = sfx.override
                            bestFit = { score: score, sound: sfx.name, combo: combo }
                        }
                    }
                }
                if (bestFit.sound != null) {
                    specialSound = bestFit.sound
                    sounds.push(specialSound)
                }
            }

        }
        if (sfx.hasOwnProperty("b2b") && b2b) {
            sounds.push('b2b')
        }
        if (combo >= 0) {
            sounds.push(this.getComboSFX(combo))
        }
        if (this.scoring && (!specialSound || override == false)) {
            sounds.push(prefix + this.getScoreSFX(clearType))
        }
        if (altClearType == Score.A.PERFECT_CLEAR) {
            sounds.push(prefix + this.getScoreSFX(altClearType))
        }
        //   console.log(sounds)
        return sounds
    }
    let customSFX = new CustomSFXset

    /*    function CustomVFXset() {
            this.volume = 1
        }
        CustomVFXset.prototype = new NullSFXset
        CustomVFXset.prototype.getSoundUrlFromObj = function (obj) {
            return obj.url
        }
        let customVFX = new CustomVFXset*/

    for (let name of SOUNDS) {
        if (sfx.hasOwnProperty(name)) {
            customSFX[name] = {
                url: sfx[name],
            }
        } else {
            customSFX[name] = {
                url: "null.wav",
            }
        }
    }
    if (sfx.comboTones) {
        if (Array.isArray(sfx.comboTones)) {
            customSFX.comboTones = []
            for (let tone of sfx.comboTones) {
                if (typeof tone === 'string') {
                    customSFX.comboTones.push({ url: tone })
                } else {
                    customSFX.comboTones.push({ url: "null.wav" })
                }
            }
        } else if (typeof sfx.comboTones == "object") {
            if (sfx.comboTones.duration && sfx.comboTones.spacing && sfx.comboTones.cnt) {
                customSFX.comboTones = {
                    url: sfx.comboTones.url,
                    duration: sfx.comboTones.duration,
                    spacing: sfx.comboTones.spacing,
                    cnt: sfx.comboTones.cnt,
                }
            }
        }
    }
    if (sfx.specialScoring && typeof sfx.specialScoring == "object") {
        for (let key in sfx.specialScoring) {
            if (!Array.isArray(sfx.specialScoring[key])) continue
            for (let i in sfx.specialScoring[key]) {
                let sound = sfx.specialScoring[key][i]
                sound.name = "CUSTOMSFX" + key + i
                loadSound(sound.name, sound)
            }
        }
        customSFX.specialScoring = sfx.specialScoring
    }
    if (sfx.scoring && typeof sfx.scoring == "object") {
        customSFX.scoring = Array(15)

        for (let key in sfx.scoring) {
            let i = SCORES.indexOf(key)
            if (i < 0) continue
            customSFX.scoring[i] = { url: sfx.scoring[key] }
        }
    }
    if (sfx.spawns && typeof sfx.spawns == "object") {
        let scores = [
            "I", "O", "T", "L", "J", "S", "Z"
        ]
        for (let key in sfx.spawns) {
            let i = scores.indexOf(key)
            if (i > 0) {
                loadSound("b_" + key, { url: sfx.spawns[key] })
            }

        }
    } else {
        let scores = [
            "I", "O", "T", "L", "J", "S", "Z"
        ]
        for (var key of scores) {
            loadSound("b_" + key, { url: "null.wav" })
        }
    }
    return customSFX
    //    attemptLoadSFX(customSFX);

}

;// CONCATENATED MODULE: ./src/replayer-sfx.js




const initReplayerSFX = () => {
  
  if (typeof View == "function" && typeof window.Live != "function" && !location.href.includes('export'))
    initCustomReplaySFX();
  if (typeof SlotView == "function")
    initOpponentSFX();
}

const initCustomReplaySFX = () => {
  console.log("init replayer sfx")
  var json = Config().CUSTOM_SFX_JSON;
  let sfx = null;
  if (json) {
      try {
          sfx = JSON.parse(json);
          document.getElementById("custom_sfx_json_err").innerHTML = "Loaded " + (sfx.name || "custom sounds");
      } catch (e) {
          console.log("SFX json was invalid.");
          document.getElementById("custom_sfx_json_err").innerHTML = "SFX json is invalid.";
      }
  } else {
      document.getElementById("custom_sfx_json_err").innerHTML = "";
  }
  
  if (!Config().ENABLE_CUSTOM_SFX || !Config().CUSTOM_SFX_JSON) {
    return;
  }

  let customSFXSet = loadCustomSFX(sfx);
  console.log(customSFXSet);
  const oldOnReady = View.prototype.onReady
  View.prototype.onReady = function() {
    this.changeSFX(customSFXSet);
    return oldOnReady.apply(this, arguments);
  }

  // spectator replayer sfx

  View.prototype.onLinesCleared = function(attack, comboAttack, { type, b2b, cmb }) {

    let suhrit = [type, type, b2b && this.g.isBack2Back, cmb];
    var sounds = this.SFXset.getClearSFX(...suhrit);

    if (Array.isArray(sounds))
      sounds.forEach(sound => this.SEenabled && createjs.Sound.play(sound));
    else
      this.playReplayerSound(sounds);

    // --- old onLinesCleared code ---
    
    // don't need this line anymore
    // this.SEenabled && createjs.Sound.play(this.SFXset.getComboSFX(this.g.comboCounter));
    this.g.pmode && (7 === this.g.pmode ? this.lrem.textContent = this.g.gamedata.TSD : 8 === this.g.pmode ? this.lrem.textContent = this.g.gamedata.PCs : 5 !== this.g.pmode && (this.lrem.textContent = this.g.linesRemaining));
  
  }
}
const initOpponentSFX = () => {
  // spectator replayer sfx

  console.log("init opponent sfx");
  SlotView.prototype.playReplayerSound = function(sound) {
    let volume = Config().OPPONENT_SFX_VOLUME_MULTPLIER || 0;

    if (!shouldRenderEffectsOnView(this)) {
      volume /= 4;
    }
    let enabled = !!localStorage.getItem("SE") && Config().ENABLE_OPPONENT_SFX;
    if (enabled) {
      if (Array.isArray(sound)) {
        sound.forEach(e => {
          let instance = createjs.Sound.play(e);
          instance.volume = volume;
        });
      } else {
        var instance = createjs.Sound.play(sound);
        instance.volume = volume;
      }
    }
      
  }
  const onBlockHold = SlotView.prototype.onBlockHold;
  SlotView.prototype.onBlockHold = function() {
    this.playReplayerSound("hold");
    onBlockHold.apply(this, arguments);
  }

  const onBlockMove = SlotView.prototype.onBlockMove;
  SlotView.prototype.onBlockMove = function() {
    this.playReplayerSound("move");
    onBlockMove.apply(this, arguments);
  }
  const onGameOver = SlotView.prototype.onGameOver;
  SlotView.prototype.onGameOver = function() {
    if (this.g.queue.length !== 0) // ignore bugged top outs from static queues ending in map vs. change this when jez fixes that
      this.playReplayerSound("died");
    onGameOver.apply(this, arguments);
  }
  const onBlockLocked = SlotView.prototype.onBlockLocked;
  SlotView.prototype.onBlockLocked = function() {
    this.playReplayerSound("lock");
    onBlockLocked.apply(this, arguments);
  }
  const onLinesCleared = SlotView.prototype.onLinesCleared;
  SlotView.prototype.onLinesCleared = function(attack, comboAttack, { type, b2b, cmb }) {

    let game = this.slot.gs.p;
    let suhrit = [type, type, b2b && this.g.isBack2Back, cmb];
    var sounds = game.SFXset.getClearSFX(...suhrit);

    if (Array.isArray(sounds))
      sounds.forEach(sound => this.playReplayerSound(sound));
    else
      this.playReplayerSound(sounds);

    onLinesCleared.apply(this, arguments);
  }
  if (typeof Game == "function") {
    const oldReadyGo = Game.prototype.readyGo;
    
    // bot sfx
    Game.prototype.readyGo = function() {
      let val = oldReadyGo.apply(this, arguments)
      console.log("injected bot sfx")
      if (this.Bots && this.Bots.bots) {
        this.Bots.bots.forEach(e => {
          if (e.g) {
            e.g.SFXset = this.SFXset;
            e.g.playSound = (a) => {
              if (a) {
                SlotView.prototype.playReplayerSound(a)
              }
            }
            let oldOnBotMove = e.__proto__.onBotMove;
            e.__proto__.onBotMove = function() {
              let val = oldOnBotMove.apply(this, arguments);
              SlotView.prototype.playReplayerSound("harddrop");
              return val;
            }
            let oldOnBotGameOver = e.__proto__.onGameOver;
            e.__proto__.onGameOver = function() {
              let val = oldOnBotGameOver.apply(this, arguments);
              // when you restart the game, all the bots get gameovered
              if (!e.p.p.gameEnded)
                SlotView.prototype.playReplayerSound("died");
              return val;
            }
          }
        });
      }

      return val;
    }

  }

  // replay replayer sfx
  
}
;// CONCATENATED MODULE: ./src/keyboardDisplay.js

const initKeyboardDisplay = () => {
  const isGame = typeof Game != "undefined";
  const isReplayer = typeof Replayer != "undefined";

  if (!isGame && !isReplayer) return;

  const keyConfig = [
    [
      'new',
      null,
      {k: 'reset', l: 'F4'},
    ],
    [
      null
    ],
    [
      '180',
      'ccw',
      'cw',
      null,
      null,
      'hd',
    ],
    [
      null,
      null,
      {k: 'hold', l: 'HLD'},
      null,
      {k: 'left', l: 'L'},
      'sd',
      {k: 'right', l: 'R'}
    ]
  ];

  var kbhold = document.createElement("div");
  kbhold.id = "keyboardHolder";

  if (!Config().ENABLE_KEYBOARD_DISPLAY)
    kbhold.classList.add('hide-kbd-display')
  Config().onChange("ENABLE_KEYBOARD_DISPLAY", val => {
    if (val) {
      kbhold.classList.remove('hide-kbd-display')
    } else {
      kbhold.classList.add('hide-kbd-display')
    }
  })
  document.getElementById("stage").appendChild(kbhold);
  
  

  let keyTable = `
    <div id="kbo">
      <div id="kps"></div>
      <table class="tg">
  `;

  for (const row of keyConfig) {
    keyTable += `<tr>`;

    for (const key of row) {
      let isKey = key != null;
      let label = "";
      let cssClass = "kbnone";

      if (isKey) {
        label = typeof key == 'string'? key.toUpperCase() : key.l;
        cssClass = "kbkey kbd-" + (typeof key == 'string'? key.toLowerCase() : key.k);
      }

      keyTable += `<td class="${cssClass}">${label}</td>`;
    }

    keyTable += `</tr>`;
  }

  keyTable += `
      </table>
    </div>
  `;

  keyboardHolder.innerHTML = keyTable;
  let setKey = function(key, type) {
    for (const td of document.getElementsByClassName(`kbd-${key}`)) {
      td.style.backgroundColor = ["", "lightgoldenrodyellow"][type];
    }
  }

  if (isGame) {
    let oldReadyGo = Game.prototype.readyGo;
    Game.prototype.readyGo = function() {
      Game['set2ings'] = this.Settings.controls;
      return oldReadyGo.apply(this, arguments);
    }

    let oldUpdateTextBar = Game.prototype.updateTextBar;
    Game.prototype.updateTextBar = function() {
      let val = oldUpdateTextBar.apply(this, arguments);
      kps.innerHTML = 'KPS: ' + (this.getKPP() * this.placedBlocks / this.clock).toFixed(2);
      return val;
    }

    let press = function (e) {
      if (typeof Game.set2ings == 'undefined') return;

      let i = Game.set2ings.indexOf(e.keyCode);
      if (i == -1) return;

      let key = ['left', 'right', 'sd', 'hd', 'ccw', 'cw', 'hold', '180', 'reset', 'new'][i];
      setKey(key, +(e.type == "keydown"))
    }

    document.addEventListener('keydown', press);
    document.addEventListener('keyup', press);

  } else if (isReplayer) {
    var url = window.location.href.split("/")

    if (!url[2].endsWith("jstris.jezevec10.com")) return;
    if (url[3] != "replay") return;
    if (url[4] == "1v1") {
      kbhold.classList.add("really-hide-kbd-display");
      return;
    }

    let L;

    let fetchURL = "https://"+url[2]+"/replay/data?id="+url[(L=url[4]=="live")+4]+"&type="+(L?1:0);
    /*
    if(url[4] == "live"){
      fetchURL = "https://"+url[2]+"/replay/data?id=" + url[5] + "&type=1"
    } else {
      fetchURL = "https://"+url[2]+"/replay/data?id=" + url[4] + "&type=0"
    }
    */

    //fetch(`https://${url[2]}/replay/data?id=${url.length == 6? (url[5] + "&live=1") : url[4]}&type=0`)
    fetch(fetchURL)
      .then(res => res.json())
      .then(json => {
        if (!json.c)
          return;
        let das = json.c.das;

        Replayer.setKey = setKey;

        let oldPlayUntilTime = Replayer.prototype.playUntilTime
        Replayer.prototype.playUntilTime = function() {
          
          kps.innerHTML = 'KPS: ' + (this.getKPP() * this.placedBlocks / this.clock * 1000).toFixed(2);

          if (this.ptr == 0) Replayer.lastPtr = -1;

          this.kbdActions = [];

          for (let i = 0; i < this.actions.length; i++) {
            let o = {a: this.actions[i].a, t: this.actions[i].t};

            if (o.a == 2 || o.a == 3) {
              o.a -= 2;
              for (let j = i - 1; j >= 0; j--) {
                if (this.kbdActions[j].a < 2) {
                  this.kbdActions[j].a += 2;
                  break;
                }
              }
            }

            this.kbdActions.push(o);
          }

          let pressKey = function(key, type) {
            Replayer.setKey(key, Math.min(type, 1));

            if (type == 2) {
              setTimeout(x => Replayer.setKey(key, 0), das * 3 / 5)
            }
          };
          
          let val = oldPlayUntilTime.apply(this, arguments);
          
          if (this.ptr != Replayer.lastPtr && this.ptr - 1 < this.kbdActions.length) {
            var highlight = [
              ["left", 2],
              ["right", 2],
              ["left", 1],
              ["right", 1],
              ["ccw", 2],
              ["cw", 2],
              ["180", 2],
              ["hd", 2],
              ["sd", 2],
              null,
              ["hold", 2]
            ][this.kbdActions[this.ptr - 1].a];

            if (highlight) {
              pressKey(...highlight)
            }
          }

          Replayer.lastPtr = this.ptr;

          return val;
        };
      });
  }
}
;// CONCATENATED MODULE: ./src/skin.js

let offscreenCanvas = document.createElement('canvas');
let offscreenContext = offscreenCanvas.getContext("2d");
offscreenCanvas.height = 32;
offscreenCanvas.width = 32;
let customSkinSize = 32
let customGhostSkinSize = 32
let usingConnected = false
let usingGhostConnected = false
function loadCustomSkin(url, ghost = false) {

  // if not allowing force replay skin, don't load custom skin
  if (location.href.includes('replay') && !Config().ENABLE_REPLAY_SKIN) {
    return;
  }

  let img = new Image();
  console.log(url, ghost)
  img.onload = function () {
    var height = img.height;
    var width = img.width;
    if (width / height == 9 && !ghost) {
      customSkinSize = height
      usingConnected = false
      if (window.loadSkin) loadSkin(url, customSkinSize)
    } else if (width / height == 9 / 20 && !ghost) {
      usingConnected = true
      customSkinSize = width / 9
      if (window.loadSkin) loadSkin(url, customSkinSize)
    } else if (width / height == 7 && ghost) {
      usingGhostConnected = false
      customGhostSkinSize = height
      if (window.loadGhostSkin) loadGhostSkin(url, height)
    } else if (width / height == 7 / 20 && ghost) {
      offscreenCanvas.height = width / 7;
      offscreenCanvas.width = width / 7;
      usingGhostConnected = true
      customGhostSkinSize = width / 7
      if (window.loadSkin) loadGhostSkin(url, width / 7)
    }
  }
  img.src = url;

}
window.loadCustomSkin = loadCustomSkin

const initCustomSkin = () => {
  initConnectedSkins()
  let skinLoaded = false
  let game = null
  if (Config().CUSTOM_SKIN_URL)
    loadCustomSkin(Config().CUSTOM_SKIN_URL);

  if (Config().CUSTOM_GHOST_SKIN_URL)
    loadCustomSkin(Config().CUSTOM_GHOST_SKIN_URL, true)
  if (typeof window.Live == "function") {
    Config().onChange("CUSTOM_SKIN_URL", val => {
      if (val)
        loadCustomSkin(val);
      else {
        loadSkin("resetRegular")
      }
    });
    Config().onChange("CUSTOM_GHOST_SKIN_URL", val => {
      if (val) loadCustomSkin(val, true)
      else if (game) {
        game.ghostSkinId = 0
        usingGhostConnected = false
      }
    });
    let onload = Live.prototype.onCIDassigned

    Live.prototype.onCIDassigned = function () {
      let v = onload.apply(this, arguments)

      if (!skinLoaded) {
        game = this.p
        skinLoaded = true
        if (Config().CUSTOM_SKIN_URL)
          loadCustomSkin(Config().CUSTOM_SKIN_URL);

        if (Config().CUSTOM_GHOST_SKIN_URL)
          loadCustomSkin(Config().CUSTOM_GHOST_SKIN_URL, true)
      }

      return v
    }
  }
  if (typeof window.View == "function" && typeof window.Live != "function") { //force skin on replayers
    let onready = View.prototype.onReady
    View.prototype.onReady = function () {
      let val = onready.apply(this, arguments);
      if (Config().ENABLE_REPLAY_SKIN && Config().CUSTOM_SKIN_URL) {
        this.tex.crossOrigin = "anonymous"
        this.skinId = 1
        this.g.skins[1].data = Config().CUSTOM_SKIN_URL
        this.g.skins[1].w = customSkinSize
        this.tex.src = this.g.skins[1].data
      }
      return val
    }
  }
  if (typeof window.Game == "function") {
    let ls = Game.prototype.changeSkin
    Game.prototype.changeSkin = function () {
      let val = ls.apply(this, arguments)
      let url = this.skins[arguments[0]].data
      if (url == "resetRegular") {
        usingConnected = false
        ls.apply(this, [0])
        return val
      }
      if (this.v && this.v.NAME == "webGL") {
        this.v.ai_setBlend()
      }
      return val
    }
  }
  console.log("Custom skin loaded.");

}

const initConnectedSkins = () => {
  const removeDimple = true
  const ghostAlpha = 0.5
  //  const blockConnections = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  const blockConnections = [-1, 1, 1, 1, 1, 1, 1, 1, 2, 3]


  let colors = blockConnections
  function solveConnected(blocks, x, y) {
    let connect_value = 0
    let checks = { N: false, S: false, E: false, W: false }
    let row = y
    let col = x
    if (row != 0 && blocks[row - 1][col] > 0) { connect_value += 1; checks.N = true }
    if (row != blocks.length - 1 && blocks[row + 1][col] > 0) { connect_value += 2; checks.S = true }
    if (blocks[row][col - 1] > 0) { connect_value += 4; checks.W = true; }
    if (blocks[row][col + 1] > 0) { connect_value += 8; checks.E = true; }
    let corners = { a: false, b: false, c: false, d: false }

    if (checks.N && checks.E && row != 0 && blocks[row - 1][col + 1] > 0) corners.a = true
    if (checks.S && checks.E && blocks[row + 1][col + 1] > 0) corners.b = true
    if (checks.S && checks.W && blocks[row + 1][col - 1] > 0) corners.c = true
    if (checks.N && checks.W && row != 0 && blocks[row - 1][col - 1] > 0) corners.d = true
    let overlay = 0
    if (corners.a) overlay = 16
    if (corners.b) overlay = 17
    if (corners.c) overlay = 18
    if (corners.d) overlay = 19
    return { connect_value: connect_value, overlay: overlay }
  }

  let drawCanvas = false

  if (window.WebGLView != undefined) {
    let onRedrawMatrix = WebGLView['prototype']['redrawMatrix']
    WebGLView['prototype']['redrawMatrix'] = function () {
      if (usingConnected) {
        this['clearMainCanvas']();
        if (this['g']['isInvisibleSkin']) {
          return
        };
        this.g.ai_drawMatrix()
        return
      }
      let val = onRedrawMatrix.apply(this, arguments)
      return val
    }
    let onWebglLoad = WebGLView.prototype.initRenderer
    WebGLView.prototype.initRenderer = function () {
      let val = onWebglLoad.apply(this, arguments)
      this.ai_setBlend()
      return val
    }
    WebGLView.prototype.ai_setBlend = function () {
      for (let ctx of this.ctxs) {
        let gl = ctx.gl
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      }
    }
    WebGLView['prototype']['ai_drawBlock'] = function (pos_x, pos_y, block_value, connect_value, main) {
      if (block_value) {
        let skin = this.g.skins[this.g.skinId]
        let scale = this['g']['drawScale'] * this['g']['block_size'];
        let cmain = this['ctxs'][main],
          texture = cmain['textureInfos'][0];

        this['drawImage'](cmain, texture['texture'], texture['width'], texture['height'], this['g']['coffset'][block_value] * skin.w, connect_value * skin.w, skin.w, skin.w, pos_x * this['g']['block_size'], pos_y * this['g']['block_size'], scale, scale)
      }
    };
    WebGLView['prototype']['ai_drawGhostBlock'] = function (pos_x, pos_y, block_value, connect_value) {
      let skinSize = this.g.skins[this.g.skinId].w
      var cmain = this['ctxs'][0];
      if (this['g']['ghostSkinId'] === 0) {
        cmain['gl']['uniform1f'](cmain['globalAlpha'], 0.5);
        this['ai_drawBlock'](pos_x, pos_y, block_value, connect_value, 0);
        cmain['gl']['uniform1f'](cmain['globalAlpha'], 1)
      } else {
        var scale = this['g']['drawScale'] * this['g']['block_size'];
        var texture = cmain['textureInfos'][1];
        this['drawImage'](cmain, texture['texture'], texture['width'], texture['height'], (this['g']['coffset'][block_value] - 2) * skinSize, connect_value * skinSize, skinSize, skinSize, pos_x * this['g']['block_size'], pos_y * this['g']['block_size'], scale, scale)
      }

    };
    WebGLView['prototype']['ai_drawBlockOnCanvas'] = function (a, b, c, d, e) {
      this['ai_drawBlock'](a, b, c, d, e)
    };
  }
  if (window.Ctx2DView != undefined) {
    let onRedrawMatrix = Ctx2DView['prototype']['redrawMatrix']
    Ctx2DView['prototype']['redrawMatrix'] = function () {
      if (usingConnected) {
        this['clearMainCanvas']();
        if (this['g']['isInvisibleSkin']) {
          return
        };
        this.g.ai_drawMatrix()
        return
      }
      let val = onRedrawMatrix.apply(this, arguments)
      return val
    }
    Ctx2DView['prototype']['ai_drawBlock'] = function (pos_x, pos_y, block_value, connect_value) {
      if (block_value && pos_x >= 0 && pos_y >= 0 && pos_x < 10 && pos_y < 20) {
        var scale = this['g']['drawScale'] * this['g']['block_size'];
        if (this['g']['skinId']) {
          this['ctx']['drawImage'](this['g']['tex'], this['g']['coffset'][block_value] * this['g']['skins'][this['g']['skinId']]['w'], connect_value * this['g']['skins'][this['g']['skinId']]['w'], this['g']['skins'][this['g']['skinId']]['w'], this['g']['skins'][this['g']['skinId']]['w'], pos_x * this['g']['block_size'], pos_y * this['g']['block_size'], scale, scale)
        } else {
          var mono = (this['g']['monochromeSkin'] && block_value <= 7) ? this['g']['monochromeSkin'] : this['g']['colors'][block_value];
          this['drawRectangle'](this['ctx'], pos_x * this['g']['block_size'], pos_y * this['g']['block_size'], scale, scale, mono)
        }
      }
    };
    Ctx2DView['prototype']['ai_drawGhostBlock'] = function (pos_x, pos_y, block_value, connect_value) {
      let scale = this['g']['drawScale'] * this['g']['block_size'];
      let skin = this.g.ghostSkins[this.g.ghostSkinId]
      let tex = this.g.ghostTex
      let coffset = this.g.coffset[block_value] - 2
      if (this.g.ghostSkinId === 0) {
        this['ctx']['globalAlpha'] = ghostAlpha;
        skin = this.g.skins[this.g.skinId]
        tex = this.g.tex
        coffset += 2
      }
      offscreenContext.drawImage(tex, coffset * skin.w, connect_value * skin.w, skin.w, skin.w, 0, 0, skin.w, skin.w)

      if (drawCanvas) {
        this.ctx.drawImage(offscreenCanvas, 0, 0, skin.w, skin.w, pos_x * this['g']['block_size'], pos_y * this['g']['block_size'], scale, scale)
      }
      this['ctx']['globalAlpha'] = 1
    }
    Ctx2DView['prototype']['ai_drawBlockOnCanvas'] = function (pos_x, pos_y, block_value, connect_value, render) {
      var renderer = (render === this['HOLD']) ? this['hctx'] : this['qctx'];
      if (this['g']['skinId'] === 0) {
        var mono = (this['g']['monochromeSkin'] && block_value <= 7) ? this['g']['monochromeSkin'] : this['g']['colors'][block_value];
        this['drawRectangle'](renderer, pos_x * this['g']['block_size'], pos_y * this['g']['block_size'], this['g']['block_size'], this['g']['block_size'], mono)
      } else {
        renderer['drawImage'](this['g']['tex'], this['g']['coffset'][block_value] * this['g']['skins'][this['g']['skinId']]['w'], connect_value * this['g']['skins'][this['g']['skinId']]['w'], this['g']['skins'][this['g']['skinId']]['w'], this['g']['skins'][this['g']['skinId']]['w'], pos_x * this['g']['block_size'], pos_y * this['g']['block_size'], this['g']['block_size'], this['g']['block_size'])
      }
    };

  };
  let template1 = function () {
    let blockset = this['blockSets'][this['activeBlock']['set']],
      blocks = (blockset['scale'] === 1) ? blockset['blocks'][this['activeBlock']['id']]['blocks'][this['activeBlock']['rot']] : blockset['previewAs']['blocks'][this['activeBlock']['id']]['blocks'][this['activeBlock']['rot']],
      blocks_length = blocks['length'];
    this['drawScale'] = blockset['scale'];
    if (this['ghostEnabled'] && !this['gameEnded']) {
      for (let y = 0; y < blocks_length; y++) {
        for (let x = 0; x < blocks_length; x++) {
          if (blocks[y][x] > 0) {
            if (!usingGhostConnected && this.ghostSkinId != 0) {
              this.v.drawGhostBlock(this.ghostPiece.pos.x + x * this.drawScale, this.ghostPiece.pos.y + y * this.drawScale, blockset.blocks[this.activeBlock.id].color)
              if (this.activeBlock.item && blocks[y][x] === this.activeBlock.item) {
                this.v.drawBrickOverlay(this.ghostPiece.pos.x + x * this.drawScale, this.ghostPiece.pos.y + y * this.drawScale, true)
              }
              continue
            }
            let solve = solveConnected(blocks, x, y)
            offscreenContext.clearRect(0, 0, this.skins[this.skinId].w, this.skins[this.skinId].w)
            if (solve.overlay > 0 && removeDimple) {
              drawCanvas = false
              this['v']['ai_drawGhostBlock'](this['ghostPiece']['pos']['x'] + x * this['drawScale'], this['ghostPiece']['pos']['y'] + y * this['drawScale'], blockset['blocks'][this['activeBlock']['id']]['color'], solve.connect_value, 0);
              if (this['activeBlock']['item'] && blocks[y][x] === this['activeBlock']['item']) {
                this['v']['drawBrickOverlay'](this['ghostPiece']['pos']['x'] + x * this['drawScale'], this['ghostPiece']['pos']['y'] + y * this['drawScale'], true)
              }
              drawCanvas = true
              this['v']['ai_drawGhostBlock'](this['ghostPiece']['pos']['x'] + x * this['drawScale'], this['ghostPiece']['pos']['y'] + y * this['drawScale'], blockset['blocks'][this['activeBlock']['id']]['color'], solve.overlay, 0)
            }
            else {
              drawCanvas = true
              this['v']['ai_drawGhostBlock'](this['ghostPiece']['pos']['x'] + x * this['drawScale'], this['ghostPiece']['pos']['y'] + y * this['drawScale'], blockset['blocks'][this['activeBlock']['id']]['color'], solve.connect_value, 0);

              if (this['activeBlock']['item'] && blocks[y][x] === this['activeBlock']['item']) {
                this['v']['drawBrickOverlay'](this['ghostPiece']['pos']['x'] + x * this['drawScale'], this['ghostPiece']['pos']['y'] + y * this['drawScale'], true)
              }
            }
          }
        }
      }
    };
    if (!this['gameEnded']) {
      for (let y = 0; y < blocks_length; y++) {
        for (let x = 0; x < blocks_length; x++) {
          if (blocks[y][x] > 0) {

            if (!usingConnected) {
              this.v.drawBlock(this.activeBlock.pos.x + x * this.drawScale, this.activeBlock.pos.y + y * this.drawScale, blockset.blocks[this.activeBlock.id].color, 0)
              if (this['activeBlock']['item'] && blocks[y][x] === this['activeBlock']['item']) {
                this['v']['drawBrickOverlay'](this['activeBlock']['pos']['x'] + x * this['drawScale'], this['activeBlock']['pos']['y'] + y * this['drawScale'], false)
              }
              continue
            }
            let solve = solveConnected(blocks, x, y)
            this['v']['ai_drawBlock'](this['activeBlock']['pos']['x'] + x * this['drawScale'], this['activeBlock']['pos']['y'] + y * this['drawScale'], blockset['blocks'][this['activeBlock']['id']]['color'], solve.connect_value, 0);
            if (this['activeBlock']['item'] && blocks[y][x] === this['activeBlock']['item']) {
              this['v']['drawBrickOverlay'](this['activeBlock']['pos']['x'] + x * this['drawScale'], this['activeBlock']['pos']['y'] + y * this['drawScale'], false)
            }
            if (solve.overlay > 0 && removeDimple) this['v']['ai_drawBlock'](this['activeBlock']['pos']['x'] + x * this['drawScale'], this['activeBlock']['pos']['y'] + y * this['drawScale'], blockset['blocks'][this['activeBlock']['id']]['color'], solve.overlay, 0);
          }
        }
      }
    };
    this['drawScale'] = 1
  };
  let template2 = function () {
    if (this['ISGAME'] && this['redrawBlocked']) {
      return
    };
    if (!this['ISGAME'] && (this['v']['redrawBlocked'] || !this['v']['QueueHoldEnabled'])) {
      return
    };
    this['v']['clearHoldCanvas']();
    if (this['blockInHold'] !== null) {
      var currSet = this['blockSets'][this['blockInHold']['set']]['previewAs'],
        blocks = currSet['blocks'][this['blockInHold']['id']]['blocks'][0],
        currColor = currSet['blocks'][this['blockInHold']['id']]['color'],
        currWeird = (!currSet['equidist']) ? currSet['blocks'][this['blockInHold']['id']]['yp'] : [0, 3],
        blocks_length = blocks['length'],
        something = (currSet['blocks'][this['blockInHold']['id']]['xp']) ? currSet['blocks'][this['blockInHold']['id']]['xp'] : [0, blocks_length - 1];
      for (var y = currWeird[0]; y <= currWeird[1]; y++) {
        for (var x = something[0]; x <= something[1]; x++) {
          if (blocks[y][x] > 0) {
            let solve = solveConnected(blocks, x, y)
            this['v']['ai_drawBlockOnCanvas'](x - something[0], y - currWeird[0], currColor, solve.connect_value, this['v'].HOLD);
            if (this['blockInHold']['item'] && blocks[y][x] === this['blockInHold']['item']) {
              this['v']['drawBrickOverlayOnCanvas'](x - something[0], y - currWeird[0], this['v'].HOLD)
            }
            if (solve.overlay > 0 && removeDimple) this['v']['ai_drawBlockOnCanvas'](x - something[0], y - currWeird[0], currColor, solve.overlay, this['v'].HOLD);
          }
        }
      }
    }
  };
  let template3 = function () {
    for (var row = 0; row < 20; row++) {
      for (var col = 0; col < 10; col++) {
        let block_value = this['matrix'][row][col]
        if (!block_value) continue
        let block_color = block_value

        block_value = colors[block_value]

        let connect_value = 0
        let checks = { N: false, S: false, E: false, W: false }

        if (row == 0) { if (colors[this.deadline[col]] == block_value) { connect_value += 1; checks.N = true } }
        else if (colors[this.matrix[row - 1][col]] == block_value) { connect_value += 1; checks.N = true }
        if (row != 19 && colors[this.matrix[row + 1][col]] == block_value) { connect_value += 2; checks.S = true }
        if (colors[this.matrix[row][col - 1]] == block_value) { connect_value += 4; checks.W = true; }
        if (colors[this.matrix[row][col + 1]] == block_value) { connect_value += 8; checks.E = true; }
        let corners = { a: false, b: false, c: false, d: false }

        if (checks.N && checks.E) { if (row == 0) { if (colors[this.deadline[col + 1]] == block_value) corners.a = true } else if (colors[this.matrix[row - 1][col + 1]] == block_value) corners.a = true }
        if (checks.S && checks.E && colors[this.matrix[row + 1][col + 1]] == block_value) corners.b = true
        if (checks.S && checks.W && colors[this.matrix[row + 1][col - 1]] == block_value) corners.c = true
        if (checks.N && checks.W) { if (row == 0) { if (colors[this.deadline[col - 1]] == block_value) corners.d = true } else if (colors[this.matrix[row - 1][col - 1]] == block_value) corners.d = true }

        this['v']['ai_drawBlock'](col, row, block_color, connect_value, this.v.MAIN)

        if (!removeDimple) continue
        if (corners.a) this['v']['ai_drawBlock'](col, row, block_color, 16, this.v.MAIN)
        if (corners.b) this['v']['ai_drawBlock'](col, row, block_color, 17, this.v.MAIN)
        if (corners.c) this['v']['ai_drawBlock'](col, row, block_color, 18, this.v.MAIN)
        if (corners.d) this['v']['ai_drawBlock'](col, row, block_color, 19, this.v.MAIN)
      }
    }
  }
  let template4 = function () {
    if (this['ISGAME'] && this['redrawBlocked']) {
      return
    } else {
      if (!this['ISGAME'] && (this['v']['redrawBlocked'] || !this['v']['QueueHoldEnabled'])) {
        return
      }
    };
    this['v']['clearQueueCanvas']();
    let plug = 0;
    for (var count = 0; count < this['R']['showPreviews']; count++) {
      if (count >= this['queue']['length']) {
        if (this['pmode'] != 9) {
          break
        };
        if (this['ModeManager']['repeatQueue']) {
          this['ModeManager']['addStaticQueueToQueue']()
        } else {
          break
        }
      };
      var currPiece = this['queue'][count];
      var currSet = this['blockSets'][currPiece['set']]['previewAs'],
        blocks = currSet['blocks'][currPiece['id']]['blocks'][0],
        currColor = currSet['blocks'][currPiece['id']]['color'],
        currWeird = (!currSet['equidist']) ? currSet['blocks'][currPiece['id']]['yp'] : [0, 3],
        blocks_length = blocks['length'],
        something = (currSet['blocks'][currPiece['id']]['xp']) ? currSet['blocks'][currPiece['id']]['xp'] : [0, blocks_length - 1];
      for (var y = currWeird[0]; y <= currWeird[1]; y++) {
        for (var x = something[0]; x <= something[1]; x++) {
          if (blocks[y][x] > 0) {
            let solve = solveConnected(blocks, x, y)
            this['v']['ai_drawBlockOnCanvas'](x - something[0], y - currWeird[0] + plug, currColor, solve.connect_value, this['v'].QUEUE);
            if (currPiece['item'] && blocks[y][x] === currPiece['item']) {
              this['v']['drawBrickOverlayOnCanvas'](x - something[0], y - currWeird[0] + plug, this['v'].QUEUE)
            }
            if (solve.overlay > 0 && removeDimple) this['v']['ai_drawBlockOnCanvas'](x - something[0], y - currWeird[0] + plug, currColor, solve.overlay, this['v'].QUEUE);
          }
        }
      };
      if (currSet['equidist']) {
        plug += 3
      } else {
        plug += currWeird[1] - currWeird[0] + 2
      }
    }
  };
  if (window.Game != undefined) {
    let onG = Game['prototype']['drawGhostAndCurrent']
    Game['prototype']['drawGhostAndCurrent'] = function () {
      if (usingConnected || usingGhostConnected) {
        return template1.call(this)
      }
      let val = onG.apply(this, arguments)
      return val
    }
    let onH = Game['prototype']['redrawHoldBox']
    Game['prototype']['redrawHoldBox'] = function () {
      if (usingConnected) {
        return template2.call(this)
      }
      let val = onH.apply(this, arguments)
      return val
    }
    let onQ = Game['prototype']['updateQueueBox']
    Game['prototype']['updateQueueBox'] = function () {
      if (usingConnected) {
        return template4.call(this)
      }
      let val = onQ.apply(this, arguments)
      return val
    }
    Game.prototype.ai_drawMatrix = template3
  }
  if (window.Replayer != undefined && location.href.includes('replay')) {
    Replayer.prototype.ai_drawMatrix = template3

    let onG = Replayer['prototype']['drawGhostAndCurrent']
    Replayer['prototype']['drawGhostAndCurrent'] = function () {
      if (usingConnected || (usingGhostConnected && this.g.ghostSkinId === 0)) {
        return template1.call(this)
      }
      let val = onG.apply(this, arguments)
      return val
    }
    let onH = Replayer['prototype']['redrawHoldBox']
    Replayer['prototype']['redrawHoldBox'] = function () {
      if (usingConnected) {
        return template2.call(this)
      }
      let val = onH.apply(this, arguments)
      return val
    }
    let onQ = Replayer['prototype']['updateQueueBox']
    Replayer['prototype']['updateQueueBox'] = function () {
      if (usingConnected) {
        return template4.call(this)
      }
      let val = onQ.apply(this, arguments)
      return val
    }
  }
  if (window.View != undefined) {
    if (!location.href.includes('export')) {
      View.prototype.ai_drawBlockOnCanvas = function (t, e, i, c, s) {
        let o = s === this.HOLD ? this.hctx : this.qctx;
        if (0 === this.skinId) {
          var n = this.g.monochromeSkin && i <= 7 ? this.g.monochromeSkin : this.g.colors[i];
          this.drawRectangle(o, t * this.block_size, e * this.block_size, this.block_size, this.block_size, n)
        } else {
          o.drawImage(this.tex, this.g.coffset[i] * this.g.skins[this.skinId].w, c * this.g.skins[this.skinId].w, this.g.skins[this.skinId].w, this.g.skins[this.skinId].w, t * this.block_size, e * this.block_size, this.block_size, this.block_size)
        }
      }
      let redraw = View.prototype.redraw
      View.prototype.redraw = function () {
        if (usingConnected) {
          if (!this.redrawBlocked) {
            if (this.clearMainCanvas(), !this.g.isInvisibleSkin) this.g.ai_drawMatrix()
            this.drawGhostAndCurrent(), this.g.redBar && this.drawRectangle(this.ctx, 240, (20 - this.g.redBar) * this.block_size, 8, this.g.redBar * this.block_size, "#FF270F")
          }
          return
        }

        return redraw.apply(this, arguments)
      }
      View.prototype.ai_drawBlock = function (t, e, i, c) {
        if (i && t >= 0 && e >= 0 && t < 10 && e < 20) {
          var s = this.drawScale * this.block_size;
          this.ctx.drawImage(this.tex, this.g.coffset[i] * this.g.skins[this.skinId].w, c * this.g.skins[this.skinId].w, this.g.skins[this.skinId].w, this.g.skins[this.skinId].w, t * this.block_size, e * this.block_size, s, s);
        }
      }
      View.prototype.ai_drawGhostBlock = function (t, e, i, c) {
        if (t >= 0 && e >= 0 && t < 10 && e < 20) {
          var s = this.drawScale * this.block_size;
          this.ctx.globalAlpha = ghostAlpha
          offscreenContext.drawImage(this.tex, this.g.coffset[i] * this.g.skins[this.skinId].w, c * this.g.skins[this.skinId].w, this.g.skins[this.skinId].w, this.g.skins[this.skinId].w, 0, 0, this.g.skins[this.skinId].w, this.g.skins[this.skinId].w)
          if (drawCanvas) this.ctx.drawImage(offscreenCanvas, 0, 0, this.g.skins[this.skinId].w, this.g.skins[this.skinId].w, t * this.block_size, e * this.block_size, s, s)
          this.ctx.globalAlpha = 1;
        }
      }

      var oldDrawGhostAndCurrent = View.prototype.drawGhostAndCurrent;
      View.prototype.drawGhostAndCurrent = function () {

        if (!usingConnected)
          return oldDrawGhostAndCurrent.apply(this, arguments);

        var t = this.g.blockSets[this.g.activeBlock.set],
          e = 1 === t.scale ? t.blocks[this.g.activeBlock.id].blocks[this.g.activeBlock.rot] : t.previewAs.blocks[this.g.activeBlock.id].blocks[this.g.activeBlock.rot],
          i = e.length;
        if (this.drawScale = t.scale, this.ghostEnabled) {
          for (var s = 0; s < i; s++) {
            for (var o = 0; o < i; o++) {
              if (e[s][o] > 0) {
                let solve = solveConnected(e, o, s)
                offscreenContext.clearRect(0, 0, this.g.skins[this.skinId].w, this.g.skins[this.skinId].w)
                drawCanvas = false
                if (solve.overlay > 0 && removeDimple) {
                  this.ai_drawGhostBlock(this.g.ghostPiece.pos.x + o * this.drawScale, this.g.ghostPiece.pos.y + s * this.drawScale, t.blocks[this.g.activeBlock.id].color, solve.connect_value);
                  drawCanvas = true
                  this.ai_drawGhostBlock(this.g.ghostPiece.pos.x + o * this.drawScale, this.g.ghostPiece.pos.y + s * this.drawScale, t.blocks[this.g.activeBlock.id].color, solve.overlay);
                }
                else {
                  drawCanvas = true
                  this.ai_drawGhostBlock(this.g.ghostPiece.pos.x + o * this.drawScale, this.g.ghostPiece.pos.y + s * this.drawScale, t.blocks[this.g.activeBlock.id].color, solve.connect_value);
                }
              }
            }
          }
        }
        for (s = 0; s < i; s++) {
          for (o = 0; o < i; o++) {
            if (e[s][o] > 0) {
              let solve = solveConnected(e, o, s)
              this.ai_drawBlock(this.g.activeBlock.pos.x + o * this.drawScale, this.g.activeBlock.pos.y + s * this.drawScale, t.blocks[this.g.activeBlock.id].color, solve.connect_value);
              if (solve.overlay > 0 && removeDimple) this.ai_drawBlock(this.g.activeBlock.pos.x + o * this.drawScale, this.g.activeBlock.pos.y + s * this.drawScale, t.blocks[this.g.activeBlock.id].color, solve.overlay);
            }
          }
        }
        this.drawScale = 1
      }
    }
    else {
      View.prototype.ai_drawBlockOnCanvas = function (t, i, s, c, e) {
        let h = this.block_size,
          o = this.ctx;
        if (e === this.HOLD ? (this.drawOffsetTop = this.AP.HLD.T, this.drawOffsetLeft = this.AP.HLD.L, this.block_size = this.AP.HLD.BS) : (this.drawOffsetTop = this.AP.QUE.T, this.drawOffsetLeft = this.AP.QUE.L, this.block_size = this.AP.QUE.BS), 0 === this.skinId) {
          var r = this.g.monochromeSkin && s <= 7 ? this.g.monochromeSkin : this.g.colors[s];
          this.drawRectangle(o, t * this.block_size, i * this.block_size, this.block_size, this.block_size, r)
        } else this.drawImage(o, this.tex, this.g.coffset[s] * this.g.skins[this.skinId].w, c * this.g.skins[this.skinId].w, this.g.skins[this.skinId].w, this.g.skins[this.skinId].w, t * this.block_size, i * this.block_size, this.block_size, this.block_size);
        this.block_size = h
      }
      let redraw = View.prototype.drawMainStage
      View.prototype.drawMainStage = function () {
        if (!usingConnected) {
          return redraw.apply(this, arguments)
        }
        if (this.drawOffsetTop = this.AP.STG.T, this.drawOffsetLeft = this.AP.STG.L, !this.g.isInvisibleSkin) this.g.ai_drawMatrix()
        this.drawGhostAndCurrent()
        if (this.g.redBar) this.drawRectangle(this.ctx, this.AP.STG.W, (20 - this.g.redBar) * this.BS, 8, this.g.redBar * this.BS, "#FF270F")
      }
      View.prototype.ai_drawBlock = function (t, i, s, c) {
        if (s && t >= 0 && i >= 0 && t < 10 && i < 20) {
          var e = this.drawScale * this.BS;
          this.drawImage(this.ctx, this.tex, this.g.coffset[s] * this.g.skins[this.skinId].w, c * this.g.skins[this.skinId].w, this.g.skins[this.skinId].w, this.g.skins[this.skinId].w, t * this.BS, i * this.BS, e, e);
        }
      }
      View.prototype.ai_drawGhostBlock = function (t, i, s, c) {
        if (t >= 0 && i >= 0 && t < 10 && i < 20) {
          var e = this.drawScale * this.BS;
          this.ctx.globalAlpha = ghostAlpha
          offscreenContext.drawImage(this.tex, this.g.coffset[s] * this.g.skins[this.skinId].w, c * this.g.skins[this.skinId].w, this.g.skins[this.skinId].w, this.g.skins[this.skinId].w, 0, 0, this.g.skins[this.skinId].w, this.g.skins[this.skinId].w)
          if (drawCanvas) this.drawImage(this.ctx, offscreenCanvas, 0, 0, this.g.skins[this.skinId].w, this.g.skins[this.skinId].w, t * this.BS, i * this.BS, e, e)
          this.ctx.globalAlpha = 1;
        }
      }
      var oldDrawGhostAndCurrent = View.prototype.drawGhostAndCurrent;
      View.prototype.drawGhostAndCurrent = function () {
        if (!usingConnected)
          return oldDrawGhostAndCurrent.apply(this, arguments);
        var t = this.g.blockSets[this.g.activeBlock.set],
          i = 1 === t.scale ? t.blocks[this.g.activeBlock.id].blocks[this.g.activeBlock.rot] : t.previewAs.blocks[this.g.activeBlock.id].blocks[this.g.activeBlock.rot],
          s = i.length;
        if (this.drawScale = t.scale, this.ghostEnabled) {
          for (var e = 0; e < s; e++) {
            for (var h = 0; h < s; h++) {
              if (i[e][h] > 0) {
                let solve = solveConnected(i, h, e)
                offscreenContext.clearRect(0, 0, this.g.skins[this.skinId].w, this.g.skins[this.skinId].w)
                drawCanvas = false
                if (solve.overlay > 0 && removeDimple) {
                  this.ai_drawGhostBlock(this.g.ghostPiece.pos.x + h * this.drawScale, this.g.ghostPiece.pos.y + e * this.drawScale, t.blocks[this.g.activeBlock.id].color, solve.connect_value);
                  drawCanvas = true
                  this.ai_drawGhostBlock(this.g.ghostPiece.pos.x + h * this.drawScale, this.g.ghostPiece.pos.y + e * this.drawScale, t.blocks[this.g.activeBlock.id].color, solve.overlay);
                }
                else {
                  drawCanvas = true
                  this.ai_drawGhostBlock(this.g.ghostPiece.pos.x + h * this.drawScale, this.g.ghostPiece.pos.y + e * this.drawScale, t.blocks[this.g.activeBlock.id].color, solve.connect_value);
                }
              }
            }
          }
        }
        for (e = 0; e < s; e++) {
          for (h = 0; h < s; h++) {
            if (i[e][h] > 0) {
              let solve = solveConnected(i, h, e)
              this.ai_drawBlock(this.g.activeBlock.pos.x + h * this.drawScale, this.g.activeBlock.pos.y + e * this.drawScale, t.blocks[this.g.activeBlock.id].color, solve.connect_value);
              if (solve.overlay > 0 && removeDimple) this.ai_drawBlock(this.g.activeBlock.pos.x + h * this.drawScale, this.g.activeBlock.pos.y + e * this.drawScale, t.blocks[this.g.activeBlock.id].color, solve.overlay);

            }
          }
        }
        this.drawScale = 1
      }
    }

  }
}
;// CONCATENATED MODULE: ./src/practiceUndo.js

const clone = function (x) { return JSON.parse(JSON.stringify(x)); }
class SaveState {
    /**
     * Creates a SaveState out of the given Game (all attributes are deep copies)
     */
    constructor(game) {
        this.matrix = clone(game.matrix);
        this.deadline = clone(game.deadline);
        this.activeBlock = clone(game.activeBlock);
        this.blockInHold = clone(game.blockInHold);

        this.b2b = game.b2b;
        this.combo = game.comboCounter;

        // save stat-related fields. might need to add a few more?
        this.placedBlocks = game.placedBlocks;
        this.totalFinesse = game.totalFinesse;
        this.totalKeyPresses = game.totalKeyPresses;
        this.incomingGarbage = clone(game.incomingGarbage);
        this.redBar = game.redBar;

        this.gamedata = {};
        for (const [key, value] of Object.entries(game.gamedata)) {
            this.gamedata[key] = value;
        }
    }
}
const initPracticeUndo = () => {
    const MaxSaveStates = 100;
    /**
     * Creates a save state from the current game state and adds it to the stack.
     * If this pushes the stack above MaxSaveStates, delete the least recent save.
     * To be run before each hard drop.
     */
    Game.prototype.addSaveState = function () {
        if (this.pmode !== 2) return;

        this.saveStates.push(new SaveState(this));
        if (this.saveStates.length > MaxSaveStates) this.saveStates.shift();
    }

    /**
     * Rewinds to the last save state and removes it from the stack. If no states available, prints a message to the in-game chat.
     */
    Game.prototype.undoToSaveState = function () {
        if (this.pmode !== 2) return;
        if (this.saveStates.length === 0) {
            this.Live.showInChat("Jstris+", "Can't undo any further!")
            return;
        }
        if (this.fumenPages) {
            this.fumenPages.pop();
        }
        this.Replay.invalidFromUndo = true;
        let lastState = this.saveStates.pop();
        this.loadSaveState(lastState);
    }
    Game.prototype.loadSaveState = function (lastState) {
        this.matrix = lastState.matrix;
        this.deadline = lastState.deadline;
        this.isBack2Back = lastState.b2b;
        this.comboCounter = lastState.combo;

        this.loadSeedAndPieces(
            this.Replay.config.seed,
            this.conf[0].rnd,
            lastState.placedBlocks,
            lastState.activeBlock,
            lastState.blockInHold
        );


        this.placedBlocks = lastState.placedBlocks;
        this.totalFinesse = lastState.totalFinesse;
        this.totalKeyPresses = lastState.totalKeyPresses;
        this.gamedata = lastState.gamedata;
        this.incomingGarbage = lastState.incomingGarbage;
        this.redBar = lastState.redBar;

        this.holdUsedAlready = false;
        this.setCurrentPieceToDefaultPos();
        this.updateGhostPiece(true);
        this.redrawAll();

        // update all stats' text to the new values
        this.GameStats.get("RECV").set(this.gamedata.linesReceived);
        this.GameStats.get("SCORE").set(this.gamedata.score);
        this.GameStats.get("HOLD").set(this.gamedata.holds);
        this.GameStats.get("LINES").set(this.gamedata.lines);
        this.GameStats.get("ATTACK").set(this.gamedata.linesSent)
        this.GameStats.get("BLOCKS").set(this.placedBlocks);
        this.GameStats.get("KPP").set(this.getKPP());
        this.GameStats.get("WASTE").set(this.getWasted());
        this.GameStats.get("FINESSE").set(this.totalFinesse);
        this.updateTextBar(); // updates stats for clock, pps, apm, and vs, and renders the new stats
    }

    /**
     * Sets the seed, queue, active block, and held block based on the parameters
     * @param {int} seed
     * @param {int} rngType
     * @param {int} placedBlockCount
     * @param {Block} activeBlock
     * @param {Block} heldBlock
     */
    Game.prototype.loadSeedAndPieces = function(seed, rngType, placedBlockCount, activeBlock, heldBlock) {
        // recreate rng's state at game start (from seed stored in replay)
        this.Replay.config.seed = seed;
        this.blockRNG = alea(seed);
        this.RNG = alea(seed);
        this.initRandomizer(rngType);

        // to get the rng to the right state, roll for each previously generated block
        // +1 for current piece and +1 for hold, because those are saved separately
        let rollCount = placedBlockCount + 1;
        if (heldBlock != null) rollCount += 1;
        for (let i = 0; i < rollCount; i++) {
            this.getRandomizerBlock(); // result is ignored but rng is adjusted
        }

        // generate queue from new rng, and set active and held block from save state
        this.queue = [];
        this.generateQueue();
        this.activeBlock = activeBlock;
        this.blockInHold = heldBlock;
    }

    /**
     * initializes the save state stack. To be run before a practice mode is a started
     */
    Game.prototype.initSaveStates = function () {
        if (this.pmode !== 2) return;
        this.saveStates = [];
    }

    // call `addSaveState` before each hard drop
    const oldBeforeHardDrop = Game.prototype.beforeHardDrop;
    Game.prototype.beforeHardDrop = function () {
        if (this.pmode === 2) this.addSaveState();

        return oldBeforeHardDrop.apply(this, arguments);
    }

    // add `initSaveStates` to generatePracticeQueue
    let keyListenerInjected = false
    const oldGeneratePracticeQueue = Game.prototype.generatePracticeQueue;
    Game.prototype.generatePracticeQueue = function () {
        if (this.pmode === 2) {
            this.initSaveStates();
            if (!keyListenerInjected) {
                document.addEventListener("keydown", (keyEvent) => {
                    if (this.focusState === 0) {
                        if (keyEvent.keyCode === Config().UNDO_KEYCODE) {
                            this.undoToSaveState()
                        }
                    }

                }, false)
            }
            keyListenerInjected = true
        }


        return oldGeneratePracticeQueue.apply(this, arguments);
    }

    // neatly tell the user that replays don't work with undos or fumen/snapshot imports
    const oldUploadError = Replay.prototype.uploadError;
    Replay.prototype.uploadError = function (LivePtr, err) {
        if (this.invalidFromSnapshot) {
            LivePtr.showInChat("Jstris+", "Can't generate replay for game with fumen or snapshot import!");
            return;
        }
        if (this.invalidFromUndo) {
            LivePtr.showInChat("Jstris+", "Can't generate replay for game with undos!");
            return;
        }
        return oldUploadError.apply(this, arguments);
    }
}
;// CONCATENATED MODULE: ./src/practiceSurvivalMode.js


const initPracticeSurvivalMode = () => {

  // 60 apm cycle from rivi's usermode
  const baseCycle = [
    {time: 4, attack: 4},
    {time: 4, attack: 5},
    {time: 4, attack: 2},
    {time: 3, attack: 1},
    {time: 4, attack: 4},
    {time: 4, attack: 4},
    {time: 3, attack: 5},
    {time: 3, attack: 5}
  ]

  let isCycling = false;
  let shouldStartCycle = false;
  let shouldCancel = true;
  let timeFactor = 1;
  let hangingTimeout = 0;
  
  const INIT_MESS = 20;
  let setMess = m => null;
  const changeAPM = (apm) => timeFactor = 60 / apm;

  let hasInit = false;

  const doCycle = (game, i) => {
    const cycleStep = baseCycle[i];
    if (!isCycling) return;
    if (game.pmode != 2) return stopCycle();
    console.log(game.pmode);
    hangingTimeout = setTimeout(() => {
      if (!isCycling) return;
      if (game.pmode != 2) return stopCycle();
      game.addIntoGarbageQueue(cycleStep.attack);
      doCycle(game, (i+1)%baseCycle.length)
    }, cycleStep.time * timeFactor * 1000);
  }
  const startCycle = (game) => {
    
    if (!isCycling) {
      isCycling = true;
      doCycle(game, 0);
    }
      
  }
  const stopCycle = () => {
    clearTimeout(hangingTimeout);
    isCycling = false;
  }
  if (typeof Game == "function") {

    const oldQueueBoxFunc = Game.prototype.updateQueueBox;
    Game.prototype.updateQueueBox = function () {
      if (this.pmode != 2)
        return oldQueueBoxFunc.apply(this, arguments);
      return oldQueueBoxFunc.apply(this, arguments);
    }
    const oldLineClears = GameCore.prototype.checkLineClears;
    GameCore.prototype.checkLineClears = function (x) {
      let oldAttack = this.gamedata.attack;
      let val = oldLineClears.apply(this, arguments);
      let curAttack = this.gamedata.attack - oldAttack;
      if (this.pmode == 2 && curAttack > 0) {
        this.gamedata.attack -= curAttack; // block or send attack also adds to the attack, so just subtracting to make stat accurate
        if (shouldCancel) {
          this.blockOrSendAttack(curAttack, x);
        }
        
      }
      return val;
    }
      

    const oldReadyGo = Game.prototype.readyGo
    Game.prototype.readyGo = function () {

      if (this.pmode == 2) {
        settingsDiv.classList.add("show-practice-mode-settings");
      } else {
        settingsDiv.classList.remove("show-practice-mode-settings");
      }

      if (shouldStartCycle)
        startCycle(this);

      if (!hasInit) {
        let oldOnGameEnd = Settings.prototype.onGameEnd;
        if (this.pmode == 2) {
          this.R.mess = INIT_MESS;
        }
        window.game = this;
        setMess = m => {
          if (this.pmode == 2) {
            this.R.mess = m;
          }
        }
        this.Settings.onGameEnd = function() {
          if (this.p.pmode == 2) {
            stopCycle();
          }
          return oldOnGameEnd.apply(this, arguments)
        }
        startStopButton.addEventListener("click", () => {
          shouldStartCycle = !shouldStartCycle;
      
          if (shouldStartCycle) {
            startCycle(this);
            startStopButton.innerHTML = "Stop APM Cycle";
          } else {
            stopCycle(this);
            startStopButton.innerHTML = "Start APM Cycle";
          }
    
        })
        startStopButton.disabled = false;
        hasInit = true;
      }
      return oldReadyGo.apply(this, arguments)
    }

  }


  const stage = document.getElementById("stage");
  const settingsDiv = document.createElement("DIV");
  settingsDiv.id = "customPracticeSettings";

  var slider = document.createElement("input")
  slider.type = "range"
  slider.min = 5;
  slider.max = 200;
  slider.step = 5;
  slider.id = "customApmSlider";
  slider.value = 60;
  var valueLabel = document.createElement("input");
  valueLabel.type = "number";
  valueLabel.min = 5;
  valueLabel.max = 200;
  valueLabel.id = "customApmInput";
  slider.addEventListener("mousemove", () => {
    valueLabel.value = Number.parseFloat(slider.value).toFixed(0);
    changeAPM(Number.parseFloat(slider.value));
  });
  valueLabel.value = Number.parseFloat(slider.value).toFixed(0);

  valueLabel.addEventListener("change", () => {
    var num = Number.parseFloat(valueLabel.value);
    num = Math.max(5,Math.min(num, 200));
    slider.value = num.toFixed(0);
    valueLabel.value = num;
    changeAPM(num);
  });

  valueLabel.addEventListener("click", () => {
    $(window).trigger('modal-opened');
  })

  var label = document.createElement("label");
  label.htmlFor = "customApmSlider";
  label.innerHTML = "APM";

  var sliderDiv = document.createElement("div");
  sliderDiv.appendChild(label);
  sliderDiv.appendChild(slider);
  sliderDiv.appendChild(valueLabel);

  var messSlider = document.createElement("input")
  messSlider.type = "range"
  messSlider.min = 0;
  messSlider.max = 100;
  messSlider.step = 1;
  messSlider.id = "customApmSlider";
  messSlider.value = INIT_MESS;
  var messValueLabel = document.createElement("input");
  messValueLabel.type = "number";
  messValueLabel.min = 0;
  messValueLabel.max = 100;
  messValueLabel.id = "customApmInput";
  messSlider.addEventListener("mousemove", () => {
    messValueLabel.value = Number.parseFloat(messSlider.value).toFixed(0);
    setMess(Number.parseFloat(messSlider.value));
  });
  messValueLabel.value = Number.parseFloat(messSlider.value).toFixed(0);

  messValueLabel.addEventListener("change", () => {
    var num = Number.parseFloat(messValueLabel.value);
    num = Math.max(0,Math.min(num, 100));
    messSlider.value = num.toFixed(0);
    messValueLabel.value = num;
    setMess(num);
  });

  messValueLabel.addEventListener("click", () => {
    $(window).trigger('modal-opened');
  })

  var messLabel = document.createElement("label");
  messLabel.htmlFor = "customApmSlider";
  messLabel.innerHTML = "🧀%";

  var messSliderDiv = document.createElement("div");
  messSliderDiv.appendChild(messLabel);
  messSliderDiv.appendChild(messSlider);
  messSliderDiv.appendChild(messValueLabel);

  var cancelLabel = document.createElement("label");
  cancelLabel.htmlFor = "cancelCheckbox";
  cancelLabel.innerHTML = "Allow cancel";

  var cancelCheckbox = document.createElement("input");
  cancelCheckbox.type = "checkbox";
  cancelCheckbox.id = "cancelCheckbox";
  cancelCheckbox.checked = true;

  cancelCheckbox.addEventListener("change", () => {
    shouldCancel = cancelCheckbox.checked
  })

  var cancelDiv = document.createElement("div");
  cancelDiv.appendChild(cancelLabel);
  cancelDiv.appendChild(cancelCheckbox);

  var startStopButton = document.createElement("button");
  startStopButton.innerHTML = "Start APM Cycle";
  startStopButton.disabled = true;
  settingsDiv.innerHTML+="<b>Downstack Practice</b><br/>"
  settingsDiv.appendChild(sliderDiv);
  settingsDiv.appendChild(messSliderDiv);
  settingsDiv.appendChild(cancelDiv);
  settingsDiv.appendChild(startStopButton);
  stage.appendChild(settingsDiv);

}

;// CONCATENATED MODULE: ./src/teamsMode.js
const fixTeamsMode = () => {
    let oldDecode = Live.prototype.decodeActionsAndPlay
    Live.prototype.decodeActionsAndPlay = function () {
        let temp = this.p.GS.extendedAvailable
        if (this.p.GS.teamData) {
            this.p.GS.extendedAvailable = true
            var cid = this.rcS[arguments[0][1]];
            if (cid in this.p.GS.cidSlots && this.clients[cid].rep) {
                this.clients[cid].rep.v.cancelLiveMatrix = true
            }
        }
        let v = oldDecode.apply(this, arguments)
        this.p.GS.extendedAvailable = temp
        return v
    }
    let oldRep = Game.prototype.sendRepFragment
    Game.prototype.sendRepFragment = function () {
        let temp = this.transmitMode
        if (this.GS.teamData) {
            this.transmitMode = 1
        }
        let v = oldRep.apply(this, arguments)
        this.transmitMode = temp
        return v
    }
    let oldUpdate = Game.prototype.update
    Game.prototype.update = function () {
        let temp = this.transmitMode
        if (this.GS.teamData) {
            this.transmitMode = 1
        }
        let v = oldUpdate.apply(this, arguments)
        this.transmitMode = temp
        return v
    }
    let oldFlash = SlotView.prototype.updateLiveMatrix
    SlotView.prototype.updateLiveMatrix = function () {
        if (this.cancelLiveMatrix) {
            this.queueCanvas.style.display = "block"
            this.holdCanvas.style.display = "block"
            return
        }
        this.queueCanvas.style.display = "none"
        this.holdCanvas.style.display = "none"
        return oldFlash.apply(this, arguments)
    }
    let oldHold = Replayer.prototype.redrawHoldBox
    Replayer.prototype.redrawHoldBox = function () {
        this.v.QueueHoldEnabled = true;
        this.v.holdCanvas.style.display = 'block';
        return oldHold.apply(this, arguments)
    }
    let oldQueue = Replayer.prototype.updateQueueBox
    Replayer.prototype.updateQueueBox = function () {
        this.v.QueueHoldEnabled = true;
        this.v.queueCanvas.style.display = 'block';
        return oldQueue.apply(this, arguments)
    }
    let oldSlotInit = Slot.prototype.init
    Slot.prototype.init = function () {
        let life = this.gs.p.Live
        if (life?.roomConfig?.mode != 2) {
            return oldSlotInit.apply(this, arguments)
        }
        this.v.queueCanvas.style.display = "none"
        this.v.holdCanvas.style.display = "none"
        this.gs.holdQueueBlockSize = this.gs.matrixHeight / 20
        //    console.log("hi2", this.gs.holdQueueBlockSize)
        this.v.QueueHoldEnabled = true
        this.v.cancelLiveMatrix = false
        this.slotDiv.className = "slot"
        this.slotDiv.style.left = this.x + "px"
        this.slotDiv.style.top = this.y + "px"
        this.stageDiv.style.position = "relative"
        this.name.style.width = this.gs.matrixWidth + 2 + "px"
        this.name.style.height = this.gs.nameHeight + "px"
        this.name.style.fontSize = this.gs.nameFontSize + "px"
        this.pCan.width = this.bgCan.width = this.gs.matrixWidth
        this.pCan.height = this.bgCan.height = this.gs.matrixHeight
        this.queueCan.width = this.holdCan.width = 4 * this.gs.holdQueueBlockSize
        this.holdCan.height = 4 * this.gs.holdQueueBlockSize
        this.queueCan.height = 15 * this.gs.holdQueueBlockSize
        this.pCan.style.top = this.bgCan.style.top = this.holdCan.style.top = this.queueCan.style.top = this.gs.nameHeight + "px", this.holdCan.style.left = "0px";
        var widad = .8 * this.gs.holdQueueBlockSize
        let keior = 4 * this.gs.holdQueueBlockSize + widad;
        if (this.name.style.left = keior + "px", this.pCan.style.left = this.bgCan.style.left = keior + "px", this.queueCan.style.left = keior + this.pCan.width + widad + "px", this.gs.slotStats && this.gs.matrixWidth >= 50) {
            this.stats.init(), this.stats.statsDiv.style.left = keior + "px", this.slotDiv.appendChild(this.stats.statsDiv);
            let leonilla = 1.1 * this.stats.statsDiv.childNodes[0].clientWidth, thorson = 2 * leonilla < .85 * this.gs.matrixWidth || leonilla > .6 * this.gs.matrixWidth;
            this.stats.winCounter.style.display = thorson ? null : "none";
        } else {
            this.stats.disable();
        }
        ;
        this.slotDiv.appendChild(this.name), this.slotDiv.appendChild(this.stageDiv), this.stageDiv.appendChild(this.bgCan), this.stageDiv.appendChild(this.pCan), this.stageDiv.appendChild(this.holdCan), this.stageDiv.appendChild(this.queueCan), this.slotDiv.style.display = "block", this.gs.gsDiv.appendChild(this.slotDiv), this.v.onResized();

        this.stats.statsDiv.style.width = "250px"
    }
    GameSlots.prototype.tsetup = function (teamLengths) {
        var maxTeamLength = Math.max.apply(null, teamLengths),
            edweina = this.h / 2,
            slotIndex = 0;
        this.isExtended = false, this.nameFontSize = 15, this.nameHeight = 18;
        var shonte = edweina,
            coline = 1 === (curTeamLength = maxTeamLength) ? 0 : (2 === curTeamLength ? 30 : 60) / (curTeamLength - 1),
            cinnamin = this.tagHeight + 2;

        this.slotHeight = this.nmob(shonte - this.nameHeight - 15)

        this.redBarWidth = Math.ceil(this.slotHeight / 55) + 1
        this.slotWidth = this.slotHeight / 2 + this.redBarWidth;

        var janishia = this.slotWidth * curTeamLength + (curTeamLength - 1) * coline;
        janishia > this.w && (this.slotWidth = Math.floor(this.w / curTeamLength) - coline, this.slotHeight = this.nmob(2 * (this.slotWidth - this.redBarWidth)), this.redBarWidth = Math.ceil(this.slotHeight / 55) + 1, this.slotWidth = this.slotHeight / 2 + this.redBarWidth, janishia = this.slotWidth * curTeamLength + (curTeamLength - 1) * coline), this.liveBlockSize = this.slotHeight / 20;

        // OLD
        //var estarlin = this.slotHeight + this.nameHeight + 15 + cinnamin;
        // INJECTED
        var estarlin = this.slotHeight + this.nameHeight * (this.slotStats ? 3 : 1) + 15 + cinnamin;

        this.matrixHeight = this.slotHeight
        this.matrixWidth = this.slotWidth;

        // inject slot width here instead of in Slot.init because tsetup is called first.
        this.slotWidth = this.matrixWidth * 1.7413

        for (var teamIndex = 0; teamIndex < teamLengths.length; teamIndex++) {
            var curTeamLength = teamLengths[teamIndex];

            // begin injected code
            let queueHoldBoxPadding = .8 * this.holdQueueBlockSize
            let queueHoldBoxWidthPlusPadding = 4 * this.holdQueueBlockSize + queueHoldBoxPadding;

            // OLD LINE:
            //janishia = this.slotWidth * letrina + (letrina - 1) * coline;
            // INJECTED LINE:
            janishia = this.slotWidth * curTeamLength + (curTeamLength - 1) * coline + queueHoldBoxWidthPlusPadding;

            // OLD LINE:
            //var baseSlotXCoord = Math.floor((this.w - janishia) / 2);
            // INJECTED LINE (TO PREVENT OVERLAP WITH BOARD)
            var baseSlotXCoord = Math.max(0, Math.floor((this.w - janishia) / 2));

            // end injected code

            curTeamLength > 0 && this.initTeamTag(teamIndex, baseSlotXCoord, estarlin * teamIndex, janishia);
            for (var teamSlot = 0; teamSlot < curTeamLength; teamSlot++) {
                var slotX = baseSlotXCoord + teamSlot * (this.slotWidth + coline),
                    slotY = estarlin * teamIndex + cinnamin;
                slotIndex >= this.slots.length ? this.slots[slotIndex] = new Slot(slotIndex, slotX, slotY, this) : (this.slots[slotIndex].x = slotX, this.slots[slotIndex].y = slotY, this.slots[slotIndex].init()), slotIndex++;
            }
        };
        for (this.shownSlots = slotIndex; slotIndex < this.slots.length;) {
            this.slots[slotIndex].hide(), slotIndex++;
        };
        this.realHeight = estarlin * teamLengths.length - 15, this.resizeElements();
    }
}
// EXTERNAL MODULE: ./node_modules/tetris-fumen/index.js
var tetris_fumen = __webpack_require__(451);
;// CONCATENATED MODULE: ./src/practiceFumen.js


const practiceFumen_clone = function (x) { return JSON.parse(JSON.stringify(x)); }

const reverseMatrix = ['_', 'Z', 'L', 'O', 'S', 'I', 'J', 'T', 'X', 'X', 'I', 'O', 'T', 'L', 'J', 'S', 'Z', 'I', 'O', 'T', 'L', 'J', 'S', 'Z']
const jstrisToCenterX = [[1, 2, 2, 1], [1, 1, 2, 2], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]]
const jstrisToCenterY = [[1, 1, 2, 2], [2, 1, 1, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]]
const pIndex = ['I', 'O', 'T', 'L', 'J', 'S', 'Z']
const rIndex = ["spawn", "right", "reverse", "left"]
const quizFilter = new RegExp('[^' + 'IOTLJSZ' + ']', 'g');

function downloadText(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

const generateFumenQueue = function (lim = null) {
    if (!lim) lim = this.queue.length
    let bs = this.blockSets[this.activeBlock.set]
    lim = Math.min(lim, this.queue.length)
    let r1 = ""
    if (this.activeBlock) {
        r1 = bs.blocks[this.activeBlock.id].name
    }
    let r2 = ""
    if (this.blockInHold) {
        r2 = bs.blocks[this.blockInHold.id].name
    }
    let qq = `#Q=[${r2}](${r1})`
    for (let i = 0; i < lim; i++) {
        qq += bs.blocks[this.queue[i].id].name
    }
    return qq
}
const generateFumenMatrix = function () {
    let fieldStr = ''
    for (let i in this.deadline) {
        fieldStr += reverseMatrix[this.deadline[i]]
    }
    for (let row in this.matrix) {
        for (let col in this.matrix[row]) {
            fieldStr += reverseMatrix[this.matrix[row][col]]
        }
    }
    return fieldStr
}
const initPracticeFumen = () => {
    const oldRestart = Game.prototype.restart;
    Game.prototype.restart = function () {
        const urlParams = new URLSearchParams(window.location.search);
        const snapshot = urlParams.get("snapshotPlus")

        if (this.pmode === 2 && snapshot != null) {
            let val = oldRestart.apply(this, arguments)
            let game = LZString.decompressFromEncodedURIComponent(snapshot)
            game = JSON.parse(game)
            console.log(game)

            let heldBlock = game.holdID == null ? null : new Block(game.holdID);
            this.loadSeedAndPieces(
                game.seed,
                game.rnd,
                game.placedBlocks,
                new Block(game.activeBlockID),
                heldBlock
            )

            this.matrix = practiceFumen_clone(game.matrix)
            this.deadline = practiceFumen_clone(game.deadline)
            this.setCurrentPieceToDefaultPos();
            this.updateGhostPiece(true);
            this.redrawAll();
            this.invalidFromSnapshot = true
            return val
        } else {
            this.fumenPages = null
            if (this.pmode === 2) this.fumenPages = []
            return oldRestart.apply(this, arguments);

        }

    }
    Game.prototype.generateFumenQueue = generateFumenQueue
    Game.prototype.generateFumenMatrix = generateFumenMatrix
    const onGarbageAdded = Game.prototype.addGarbage
    Game.prototype.addGarbage = function () {
        this.fumenMatrixRoll = true //matrix modulated, need to update fumen matrix
        return onGarbageAdded.apply(this, arguments)
    }
    const onHardDrop = Game.prototype.beforeHardDrop

    Game.prototype.beforeHardDrop = function () {
        let val = onHardDrop.apply(this, arguments)
        if (!this.fumenPages) return val
        if (this.altBlocks) {
            this.pages.push({ field: tetris_fumen/* Field.create */.gN.create(this.generateFumenMatrix()) })
            return
        }
        let ss = this.activeBlock

        let x = jstrisToCenterX[ss.id][ss.rot] + this.activeBlock.pos.x
        let y = 19 - (jstrisToCenterY[ss.id][ss.rot] + this.ghostPiece.pos.y)
        let msg = {
            operation: { type: this.blockSets[ss.set].blocks[ss.id].name, rotation: rIndex[ss.rot], x: x, y: y }
        }
        if (this.fumenMatrixRoll) {
            msg.field = tetris_fumen/* Field.create */.gN.create(this.generateFumenMatrix())
            this.fumenMatrixRoll = false
        }
        msg.comment = this.generateFumenQueue()
        msg.flags = { quiz: true }
        this.fumenPages.push(msg)
        //   console.log(encoder.encode(this.fumenPages))
        return val
    }

    const chatListener = Live.prototype.sendChat
    Live.prototype.sendChat = function (rawmsg) {
        var msg = "string" != typeof rawmsg ? this.chatInput.value.replace(/"/g, '\\"') : rawmsg;
        if (msg == "/fumen") {
            if (this.p.pmode != 2) {
                this.showInChat("Jstris+", "Live fumen export only supported in practice mode")
                this.chatInput.value = "";
                return
            }
            if (!this.p.fumenPages) {
                this.showInChat("Jstris+", "No fumen data available")
                this.chatInput.value = "";
                return
            }
            let fumen = tetris_fumen/* encoder.encode */.g7.encode(this.p.fumenPages)
            var coderro = "<span class='wFirstLine'><span class='wTitle'>!" + i18n.warning2 + "!</span> <b>" + i18n.repFail + "</b> (<em>" + "Jstris+ Fumen Export" + "</em>)</span>";

            coderro += "<p>" + "Fumen code dumped into the chat." + "</p>"
            coderro += `<a href="https://harddrop.com/fumen/?${fumen}" target="_blank">Link</a>`
            coderro += '<textarea readonly cols="30" onclick="this.focus();this.select()">'
            coderro += fumen + "</textarea>"
            this.chatMajorWarning(coderro);
            this.chatInput.value = "";
            return
        } else if ("/fumen" === msg.substring(0, 6)) {
            if (this.p.pmode != 2) {
                this.showInChat("Jstris+", "Fumen import only supported in practce mode")
                this.chatInput.value = "";
                return
            }
            let pages = null
            try {
                pages = tetris_fumen/* decoder.decode */.xv.decode(msg.substring(5))
            } catch (error) {
                console.log(error)
                this.showInChat("Jstris+", error.message)
                this.chatInput.value = "";
                return
            }
            let gamestates = loadFumen(pages)
            this.p.loadSaveState(gamestates)
            for (let i = this.p.queue.length; i < 7; i++) {
                this.p.refillQueue()
            }
            this.p.redrawAll();
            this.p.saveStates = []
            this.p.addSaveState()
            this.p.fumenPages = []
            this.chatInput.value = "";
            this.p.invalidFromSnapshot = true
            return
        }
        const val = chatListener.apply(this, [rawmsg])
        return val
    }
}
const initReplayerSnapshot = () => {

    let repControls = document.getElementById("repControls")
    let skipButton = document.createElement("button")
    skipButton.className = "replay-btn"
    skipButton.textContent = "snapshot"
    let fumenButton = document.createElement("button")
    fumenButton.className = "replay-btn"
    fumenButton.textContent = "fumen"
    let pcButton = document.createElement("button")
    pcButton.className = "replay-btn"
    pcButton.textContent = "pc solver"
    let wellRow1 = document.createElement("div")
    wellRow1.className = "replay-btn-group"
    let injected = false
    const lR = ReplayController.prototype.loadReplay
    ReplayController.prototype.loadReplay = function () {
        if (!injected && this.g.length == 1) {
            //  let well = document.createElement("div")
            //  well.className = 'well'


            //    well.appendChild(wellRow1)
            Replayer.prototype.generateFumenQueue = generateFumenQueue.bind(this.g[0])
            Replayer.prototype.generateFumenMatrix = generateFumenMatrix.bind(this.g[0])
            repControls.appendChild(wellRow1)
            wellRow1.appendChild(skipButton)
            wellRow1.appendChild(fumenButton)

            skipButton.onclick = () => {
                let code = this.g[0].snapshotPlus()
                window.open(`https://jstris.jezevec10.com/?play=2&snapshotPlus=${code}`, '_blank')
            }
            pcButton.onclick = () => {
                let code = this.g[0].snapshotFumen()
                window.open(`https://wirelyre.github.io/tetra-tools/pc-solver.html?fumen=${encodeURIComponent(code)}`, '_blank')
            }
            fumenButton.onclick = () => {
                let rep = document.getElementById('rep0').value
                fumenButton.disabled = true
                fumenButton.textContent = "loading"
                fetch(`https://fumen.tstman.net/jstris`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: `replay=${rep}`
                }).then((response) => response.json())
                    .then((data) => {
                        navigator.clipboard.writeText(data.fumen).then(() => {
                            fumenButton.textContent = "copied"
                        }).catch((err) => {
                            fumenButton.textContent = `err ${err}`
                        }).finally(() => {
                            if (data.fumen.length < 8168) {
                                let newWin = window.open(`https://harddrop.com/fumen/?${data.fumen}`, '_blank')
                            }
                            let textArea = document.createElement('textarea')
                            textArea.className = "repArea"
                            textArea.rows = 1
                            textArea.textContent = data.fumen
                            let dlButton = document.createElement("button")
                            dlButton.textContent = "download"
                            dlButton.className = "replay-btn"
                            dlButton.onclick = () => {
                                downloadText('jstrisFumen.txt', data.fumen)
                            }
                            let openButton = document.createElement("button")
                            openButton.textContent = "open"
                            let fumenLink = `https://harddrop.com/fumen/?${data.fumen}`
                            if (data.fumen.length >= 8168) {
                                alert("fumen code too long for url, you'll need to paste the code in manually")
                                fumenLink = `https://harddrop.com/fumen/?`
                            }

                            openButton.className = "replay-btn"
                            openButton.onclick = () => {
                                window.open(fumenLink, '_blank')
                            }
                            repControls.appendChild(textArea)
                            repControls.appendChild(dlButton)
                            repControls.appendChild(openButton)
                        });

                    });
            }
            injected = true
        }
        let val = lR.apply(this, arguments)
        if (this.g[0].pmode == 8) {
            wellRow1.appendChild(pcButton)
        }
        return val
    }
    Replayer.prototype.snapshotFumen = function () {


        /*
        let ss = this.activeBlock
        let x = jstrisToCenterX[ss.id][ss.rot] + this.activeBlock.pos.x
        let y = 19 - (jstrisToCenterY[ss.id][ss.rot] + this.ghostPiece.pos.y)
           let msg = {
               operation: { type: this.blockSets[ss.set].blocks[ss.id].name, rotation: rIndex[ss.rot], x: x, y: y }
           }*/
        let msg = {}
        let fieldStr = this.generateFumenMatrix().substring(170)
        let airCount = fieldStr.split('_').length - 1
        msg.field = tetris_fumen/* Field.create */.gN.create(fieldStr)
        msg.comment = this.generateFumenQueue().replace(quizFilter, '')
        msg.comment = msg.comment.substring(0, Math.floor(airCount / 4) + 1)
        console.log(msg)
        let code = tetris_fumen/* encoder.encode */.g7.encode([msg])
        console.log(code)
        return code
    }
    Replayer.prototype.snapshotPlus = function () {
        let matrix = practiceFumen_clone(this.matrix)
        let deadline = practiceFumen_clone(this.deadline)
        let placedBlocks = this.placedBlocks
        let seed = this.r.c.seed
        let activeBlockID = this.activeBlock.id;
        let holdID = null
        if (this.blockInHold) {
            holdID = this.blockInHold.id
        }
        let rnd = this.R.rnd
        return LZString.compressToEncodedURIComponent(JSON.stringify({
            matrix, deadline, placedBlocks, seed, activeBlockID, holdID, rnd
        }))
    }
}
const loadFumen = (pages) => {

    const page = pages[pages.length - 1]
    const field = page.field
    let matrix = Array(20).fill().map(() => Array(10).fill(0))
    let deadline = Array(10).fill(0)
    let activeBlock = new Block(0)
    let hold = null, queue = []
    if (page.flags.quiz) {
        let match = /^#Q=\[([LOJSTZI]?)\]?\(([LOJSTZI]?)\)([LOJSTZI]*)$/.exec(page.comment);
        console.log(match)
        if (match[1]) {
            hold = new Block(pIndex.indexOf(match[1]))
        }
        if (match[2]) {
            activeBlock = new Block(pIndex.indexOf(match[2]))
        }
        if (match[3]) {
            for (let char of match[3]) {
                queue.push(new Block(pIndex.indexOf(char)))
            }
        }
    }


    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 20; y++) {
            let v = reverseMatrix.indexOf(field.at(x, y))
            if (v > 0) matrix[19 - y][x] = v
        }
    }
    for (let x = 0; x < 10; x++) {
        let v = reverseMatrix.indexOf(field.at(x, 20))
        if (v > 0) deadline[x] = v
    }
    let game = {
        matrix: matrix,
        deadline: deadline,
        activeBlock: activeBlock,
        blockInHold: hold,
        queue: queue,
        b2b: 0,
        combo: 0,
        placedBlocks: 0,
        totalFinesse: 0,
        totalKeyPresses: 0,
        incomingGarbage: [],
        redBar: 0,
        gamedata: {
            "lines": 0,
            "singles": 0,
            "doubles": 0,
            "triples": 0,
            "tetrises": 0,
            "maxCombo": 0,
            "linesSent": 0,
            "linesReceived": 9,
            "PCs": 0,
            "lastPC": 0,
            "TSD": 0,
            "TSD20": 0,
            "B2B": 0,
            "attack": 0,
            "score": 0,
            "holds": 0,
            "garbageCleared": 0,
            "wasted": 1,
            "tpieces": 1,
            "tspins": 0
        }
    }
    return game
}
;// CONCATENATED MODULE: ./src/screenshot.js
const overlayCanvases = (canvases) => {
    let tempCanvas = document.createElement("canvas")
    let ctx = tempCanvas.getContext("2d");
    tempCanvas.width = canvases[0].width
    tempCanvas.height = canvases[0].height
    for (let canvas of canvases) {
        ctx.drawImage(canvas, 0, 0);
    };
    return tempCanvas
}
const combineCanvases = (canvases) => {
    let maxHeight = 0
    let width = 0
    for (let canvas of canvases) {
        if (canvas.height > maxHeight) maxHeight = canvas.height
        width += canvas.width
    }
    let tempCanvas = document.createElement("canvas")
    let ctx = tempCanvas.getContext("2d")

    tempCanvas.width = width //+ 200
    tempCanvas.height = maxHeight
    let dx = 0
    for (let i = 0; i < canvases.length; i++) {
        ctx.drawImage(canvases[i], dx, 0)
        dx += canvases[i].width
    }
    ctx.globalCompositeOperation = 'destination-over'
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, tempCanvas.width + 30, tempCanvas.height);
    ctx.font = "15px serif"
    ctx.fillStyle = "white"
    ctx.globalCompositeOperation = 'source-over'
    /* let dy = 20
     for (let key in gamedata) {
         ctx.fillText(`${key}: ${gamedata[key]}`, width, dy)
         dy += 20
     }*/

    return tempCanvas
}
const downloadUri = (uri) => {
    let link = document.createElement("a");
    link.download = "screenshot";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
const initScreenshot = () => {
    let screenShotting = false
    Game.prototype.screenshot = function (apiLink) {
        if (screenShotting) return
        let oldTitle = document.title
        document.title = "Screenshotting..."
        screenShotting = true
        this.redrawAll()
        let main = overlayCanvases([document.getElementById("bgLayer"), document.getElementById("myCanvas")])
        let queue = overlayCanvases([document.getElementById("queueCanvas")])
        let hold = overlayCanvases([document.getElementById("holdCanvas")])
        let combined = combineCanvases([hold, main, queue])
        this.Replay.getData()
        let rep = this.Replay.string
        const formData = new FormData();
        combined.toBlob((blob) => {
            formData.append('screenshot', blob);
            formData.append('replay', rep)
            const options = {
                method: 'POST',
                body: formData,
                // If you add this, upload won't work
                // headers: {
                //   'Content-Type': 'multipart/form-data',
                // }
            };
            //    console.log(`${apiLink}uploadScreenshot`)
            fetch(`${apiLink}uploadScreenshot`, options).then(response => {
                response.text().then(val => {
                    if (response.status != 200) {
                        return alert(`err: ${val}`)
                    }
                    let dom = new URL(apiLink)
                    window.open(`https://${dom.hostname}/s/${val}.png`, '_blank')
                })
            }).finally(() => {
                screenShotting = false
                document.title = oldTitle
            });
        })

        //  console.log(combined.toDataURL())
        //     downloadUri(combined.toDataURL())
    }
}


;// CONCATENATED MODULE: ./src/automatic_replay_codes.js


const initAutomaticReplayCodes = () => {
    window.copyReplayText = function (number) {
        var copyText = document.getElementById("replay" + number);
        copyText.select();
        document.execCommand("copy");
        document.getElementById("replayButton" + number).innerHTML = "Copied!"
        setTimeout(() => {
            document.getElementById("replayButton" + number).innerHTML = "Copy"
        }, 1000);

    }

    const oldStartPractice = Game.prototype.startPractice;
    
    Game.prototype.startPractice = function() {
      
      //how many pieces should the replay at least have
      let piecesPlacedCutoff = 1

      if (typeof this['replayCounter'] == "undefined") {
          this['replayCounter'] = 1
      }

      this['Replay']['getData']();

      if (this.GameStats.stats.BLOCKS.value > piecesPlacedCutoff && Config().ENABLE_AUTOMATIC_REPLAY_CODES) {
          let replayHTML = "<div style='font-size:14px;'>Userscript Generated Replay <b>#" + this["replayCounter"] + "</b> </div>";
          replayHTML += '<div style="font-size:16px;">Time:  <b>' + this.GameStats.stats.CLOCK.value + '</b> Blocks:  <b>' + this.GameStats.stats.BLOCKS.value + '</b> Waste:  <b>' + this.GameStats.stats.WASTE.value + '</b> </div>'
          replayHTML += '<textarea id=replay' + this["replayCounter"] + ' readonly style="width:75%;" onclick="this.focus();this.select()">' + this['Replay']['string'] + '</textarea>';
          replayHTML += '<button id=replayButton' + this["replayCounter"] + ' onclick=window.copyReplayText(' + this["replayCounter"] + ')>Copy</button>'
          this["Live"]['chatMajorWarning'](replayHTML);
          this["replayCounter"]++;
      }

      let val = oldStartPractice.apply(this, arguments);

      return val;
    }
}
;// CONCATENATED MODULE: ./src/index.js
















//import { initConnectedSkins } from './connectedSkins';








// inject style
var styleSheet = document.createElement("style");
styleSheet.innerText = style;
document.body.appendChild(styleSheet);

initConfig();
initModal();

if (Config().FIRST_OPEN) {
    alert("Hi! Thank you for installing Jstris+! Remember to turn off all other userscripts and refresh the page before trying to play. Enjoy!")
    Config().set("FIRST_OPEN", false);
}

authNotification()

if (typeof ReplayController == "function") {
    initReplayManager()
    initReplayerSnapshot()
}

if (typeof GameCore == "function") {
    initCustomSkin();
    if (!location.href.includes('export')) {
        initActionText();
        initFX();
        initKeyboardDisplay();
    }
    initStats();
    initCustomSFX();

    initPracticeSurvivalMode();
}
if (typeof Game == "function") {
    initLayout();
    initPracticeUndo();
    initPracticeFumen();
    setPlusSfx(Config().CUSTOM_PLUS_SFX_JSON);
    let pbListener = GameCaption.prototype.newPB;
    GameCaption.prototype.newPB = function () {
        playSound("PB");
        let val = pbListener.apply(this, arguments);
        return val;
    }
    let b4Reset = Live.prototype.beforeReset
    Live.prototype.beforeReset = function () {
        if (!this.p.isTabFocused) {
            notify("Jstris", "⚠ New game starting! ⚠");
        }
        return b4Reset.apply(this, arguments);
    }
    initScreenshot();
    fixTeamsMode();
    initAutomaticReplayCodes();
}
if (typeof Live == "function") initChat();
initReplayerSFX();
initMM();
})();

/******/ })()
;