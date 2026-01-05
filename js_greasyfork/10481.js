// ==UserScript==
// @name Embed Me!
// @version 0.4.0
// @description Embed video, images from links.
// @license MIT
// @author eight04 <eight04@gmail.com>
// @homepageURL https://github.com/eight04/embed-me
// @supportURL https://github.com/eight04/embed-me/issues
// @namespace eight04.blogspot.com
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_xmlhttpRequest
// @require https://greasyfork.org/scripts/371339-gm-webextpref/code/GM_webextPref.js?version=705415
// @connect gfycat.com
// @connect soundcloud.com
// @connect www.youtube.com
// @noframes true
// @include *
// @downloadURL https://update.greasyfork.org/scripts/10481/Embed%20Me%21.user.js
// @updateURL https://update.greasyfork.org/scripts/10481/Embed%20Me%21.meta.js
// ==/UserScript==

const _module_exports_$9 = {};
Object.defineProperty(_module_exports_$9, "__esModule", { value: true });
_module_exports_$9.parseRotation = _module_exports_$9.parseRotationName = _module_exports_$9.Rotation = _module_exports_$9.parsePiece = _module_exports_$9.parsePieceName = _module_exports_$9.isMinoPiece = _module_exports_$9.Piece = void 0;
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
})(Piece = _module_exports_$9.Piece || (_module_exports_$9.Piece = {}));
function isMinoPiece(piece) {
    return piece !== Piece.Empty && piece !== Piece.Gray;
}
_module_exports_$9.isMinoPiece = isMinoPiece;
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
_module_exports_$9.parsePieceName = parsePieceName;
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
_module_exports_$9.parsePiece = parsePiece;
var Rotation;
(function (Rotation) {
    Rotation[Rotation["Spawn"] = 0] = "Spawn";
    Rotation[Rotation["Right"] = 1] = "Right";
    Rotation[Rotation["Reverse"] = 2] = "Reverse";
    Rotation[Rotation["Left"] = 3] = "Left";
})(Rotation = _module_exports_$9.Rotation || (_module_exports_$9.Rotation = {}));
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
_module_exports_$9.parseRotationName = parseRotationName;
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
_module_exports_$9.parseRotation = parseRotation;

const _module_exports_$8 = {};
Object.defineProperty(_module_exports_$8, "__esModule", { value: true });
_module_exports_$8.getPieces = _module_exports_$8.getBlocks = _module_exports_$8.getBlockXYs = _module_exports_$8.getBlockPositions = _module_exports_$8.PlayField = _module_exports_$8.InnerField = _module_exports_$8.createInnerField = _module_exports_$8.createNewInnerField = void 0;
var FieldConstants$2 = {
    Width: 10,
    Height: 23,
    PlayBlocks: 23 * 10, // Height * Width
};
function createNewInnerField() {
    return new InnerField({});
}
_module_exports_$8.createNewInnerField = createNewInnerField;
function createInnerField(field) {
    var innerField = new InnerField({});
    for (var y = -1; y < FieldConstants$2.Height; y += 1) {
        for (var x = 0; x < FieldConstants$2.Width; x += 1) {
            var at = field.at(x, y);
            innerField.setNumberAt(x, y, (0, _module_exports_$9.parsePiece)(at));
        }
    }
    return innerField;
}
_module_exports_$8.createInnerField = createInnerField;
var InnerField = /** @class */ (function () {
    function InnerField(_a) {
        var _b = _a.field, field = _b === void 0 ? InnerField.create(FieldConstants$2.PlayBlocks) : _b, _c = _a.garbage, garbage = _c === void 0 ? InnerField.create(FieldConstants$2.Width) : _c;
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
                && 0 <= py && py < FieldConstants$2.Height
                && _this.getNumberAt(px, py) === _module_exports_$9.Piece.Empty;
        });
    };
    InnerField.prototype.canFillAll = function (positions) {
        var _this = this;
        return positions.every(function (_a) {
            var x = _a.x, y = _a.y;
            return 0 <= x && x < 10
                && 0 <= y && y < FieldConstants$2.Height
                && _this.getNumberAt(x, y) === _module_exports_$9.Piece.Empty;
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
_module_exports_$8.InnerField = InnerField;
var PlayField = /** @class */ (function () {
    function PlayField(_a) {
        var pieces = _a.pieces, _b = _a.length, length = _b === void 0 ? FieldConstants$2.PlayBlocks : _b;
        if (pieces !== undefined) {
            this.pieces = pieces;
        }
        else {
            this.pieces = Array.from({ length: length }).map(function () { return _module_exports_$9.Piece.Empty; });
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
            field.set(index % 10, Math.floor((len - index - 1) / 10), (0, _module_exports_$9.parsePiece)(block));
        }
        return field;
    };
    PlayField.prototype.get = function (x, y) {
        return this.pieces[x + y * FieldConstants$2.Width];
    };
    PlayField.prototype.addOffset = function (x, y, value) {
        this.pieces[x + y * FieldConstants$2.Width] += value;
    };
    PlayField.prototype.set = function (x, y, piece) {
        this.setAt(x + y * FieldConstants$2.Width, piece);
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
        var top = this.pieces.length / FieldConstants$2.Width - 1;
        for (var y = top; 0 <= y; y -= 1) {
            var line = this.pieces.slice(y * FieldConstants$2.Width, (y + 1) * FieldConstants$2.Width);
            var isFilled = line.every(function (value) { return value !== _module_exports_$9.Piece.Empty; });
            if (isFilled) {
                var bottom = newField.slice(0, y * FieldConstants$2.Width);
                var over = newField.slice((y + 1) * FieldConstants$2.Width);
                newField = bottom.concat(over, Array.from({ length: FieldConstants$2.Width }).map(function () { return _module_exports_$9.Piece.Empty; }));
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
            var line = this.pieces.slice(y * FieldConstants$2.Width, (y + 1) * FieldConstants$2.Width);
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
            for (var x = 0; x < FieldConstants$2.Width - 1; x += 1) {
                this.pieces[x + y * FieldConstants$2.Width] = this.pieces[x + 1 + y * FieldConstants$2.Width];
            }
            this.pieces[9 + y * FieldConstants$2.Width] = _module_exports_$9.Piece.Empty;
        }
    };
    PlayField.prototype.shiftToRight = function () {
        var height = this.pieces.length / 10;
        for (var y = 0; y < height; y += 1) {
            for (var x = FieldConstants$2.Width - 1; 1 <= x; x -= 1) {
                this.pieces[x + y * FieldConstants$2.Width] = this.pieces[x - 1 + y * FieldConstants$2.Width];
            }
            this.pieces[y * FieldConstants$2.Width] = _module_exports_$9.Piece.Empty;
        }
    };
    PlayField.prototype.shiftToUp = function () {
        var blanks = Array.from({ length: 10 }).map(function () { return _module_exports_$9.Piece.Empty; });
        this.pieces = blanks.concat(this.pieces).slice(0, this.length);
    };
    PlayField.prototype.shiftToBottom = function () {
        var blanks = Array.from({ length: 10 }).map(function () { return _module_exports_$9.Piece.Empty; });
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
        this.pieces = this.pieces.map(function () { return _module_exports_$9.Piece.Empty; });
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
_module_exports_$8.PlayField = PlayField;
function getBlockPositions(piece, rotation, x, y) {
    return getBlocks(piece, rotation).map(function (position) {
        position[0] += x;
        position[1] += y;
        return position;
    });
}
_module_exports_$8.getBlockPositions = getBlockPositions;
function getBlockXYs(piece, rotation, x, y) {
    return getBlocks(piece, rotation).map(function (position) {
        return { x: position[0] + x, y: position[1] + y };
    });
}
_module_exports_$8.getBlockXYs = getBlockXYs;
function getBlocks(piece, rotation) {
    var blocks = getPieces(piece);
    switch (rotation) {
        case _module_exports_$9.Rotation.Spawn:
            return blocks;
        case _module_exports_$9.Rotation.Left:
            return rotateLeft(blocks);
        case _module_exports_$9.Rotation.Reverse:
            return rotateReverse(blocks);
        case _module_exports_$9.Rotation.Right:
            return rotateRight(blocks);
    }
    throw new Error('Unsupported block');
}
_module_exports_$8.getBlocks = getBlocks;
function getPieces(piece) {
    switch (piece) {
        case _module_exports_$9.Piece.I:
            return [[0, 0], [-1, 0], [1, 0], [2, 0]];
        case _module_exports_$9.Piece.T:
            return [[0, 0], [-1, 0], [1, 0], [0, 1]];
        case _module_exports_$9.Piece.O:
            return [[0, 0], [1, 0], [0, 1], [1, 1]];
        case _module_exports_$9.Piece.L:
            return [[0, 0], [-1, 0], [1, 0], [1, 1]];
        case _module_exports_$9.Piece.J:
            return [[0, 0], [-1, 0], [1, 0], [-1, 1]];
        case _module_exports_$9.Piece.S:
            return [[0, 0], [-1, 0], [0, 1], [1, 1]];
        case _module_exports_$9.Piece.Z:
            return [[0, 0], [1, 0], [0, 1], [-1, 1]];
    }
    throw new Error('Unsupported rotation');
}
_module_exports_$8.getPieces = getPieces;
function rotateRight(positions) {
    return positions.map(function (current) { return [current[1], -current[0]]; });
}
function rotateLeft(positions) {
    return positions.map(function (current) { return [-current[1], current[0]]; });
}
function rotateReverse(positions) {
    return positions.map(function (current) { return [-current[0], -current[1]]; });
}

const _module_exports_$7 = {};
Object.defineProperty(_module_exports_$7, "__esModule", { value: true });
_module_exports_$7.Buffer = void 0;
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
_module_exports_$7.Buffer = Buffer;
function decodeToValue(v) {
    return ENCODE_TABLE.indexOf(v);
}
function encodeFromValue(index) {
    return ENCODE_TABLE[index];
}

const _module_exports_$6 = {};
var __assign$2 = (undefined && undefined.__assign) || function () {
    __assign$2 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$2.apply(this, arguments);
};
Object.defineProperty(_module_exports_$6, "__esModule", { value: true });
_module_exports_$6.createActionEncoder = _module_exports_$6.createActionDecoder = void 0;
function decodeBool(n) {
    return n !== 0;
}
var createActionDecoder = function (width, fieldTop, garbageLine) {
    var fieldMaxHeight = fieldTop + garbageLine;
    var numFieldBlocks = fieldMaxHeight * width;
    function decodePiece(n) {
        switch (n) {
            case 0:
                return _module_exports_$9.Piece.Empty;
            case 1:
                return _module_exports_$9.Piece.I;
            case 2:
                return _module_exports_$9.Piece.L;
            case 3:
                return _module_exports_$9.Piece.O;
            case 4:
                return _module_exports_$9.Piece.Z;
            case 5:
                return _module_exports_$9.Piece.T;
            case 6:
                return _module_exports_$9.Piece.J;
            case 7:
                return _module_exports_$9.Piece.S;
            case 8:
                return _module_exports_$9.Piece.Gray;
        }
        throw new Error('Unexpected piece');
    }
    function decodeRotation(n) {
        switch (n) {
            case 0:
                return _module_exports_$9.Rotation.Reverse;
            case 1:
                return _module_exports_$9.Rotation.Right;
            case 2:
                return _module_exports_$9.Rotation.Spawn;
            case 3:
                return _module_exports_$9.Rotation.Left;
        }
        throw new Error('Unexpected rotation');
    }
    function decodeCoordinate(n, piece, rotation) {
        var x = n % width;
        var originY = Math.floor(n / 10);
        var y = fieldTop - originY - 1;
        if (piece === _module_exports_$9.Piece.O && rotation === _module_exports_$9.Rotation.Left) {
            x += 1;
            y -= 1;
        }
        else if (piece === _module_exports_$9.Piece.O && rotation === _module_exports_$9.Rotation.Reverse) {
            x += 1;
        }
        else if (piece === _module_exports_$9.Piece.O && rotation === _module_exports_$9.Rotation.Spawn) {
            y -= 1;
        }
        else if (piece === _module_exports_$9.Piece.I && rotation === _module_exports_$9.Rotation.Reverse) {
            x += 1;
        }
        else if (piece === _module_exports_$9.Piece.I && rotation === _module_exports_$9.Rotation.Left) {
            y -= 1;
        }
        else if (piece === _module_exports_$9.Piece.S && rotation === _module_exports_$9.Rotation.Spawn) {
            y -= 1;
        }
        else if (piece === _module_exports_$9.Piece.S && rotation === _module_exports_$9.Rotation.Right) {
            x -= 1;
        }
        else if (piece === _module_exports_$9.Piece.Z && rotation === _module_exports_$9.Rotation.Spawn) {
            y -= 1;
        }
        else if (piece === _module_exports_$9.Piece.Z && rotation === _module_exports_$9.Rotation.Left) {
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
                piece: __assign$2(__assign$2({}, coordinate), { type: type, rotation: rotation }),
            };
        },
    };
};
_module_exports_$6.createActionDecoder = createActionDecoder;
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
        if (!(0, _module_exports_$9.isMinoPiece)(type)) {
            x = 0;
            y = 22;
        }
        else if (type === _module_exports_$9.Piece.O && rotation === _module_exports_$9.Rotation.Left) {
            x -= 1;
            y += 1;
        }
        else if (type === _module_exports_$9.Piece.O && rotation === _module_exports_$9.Rotation.Reverse) {
            x -= 1;
        }
        else if (type === _module_exports_$9.Piece.O && rotation === _module_exports_$9.Rotation.Spawn) {
            y += 1;
        }
        else if (type === _module_exports_$9.Piece.I && rotation === _module_exports_$9.Rotation.Reverse) {
            x -= 1;
        }
        else if (type === _module_exports_$9.Piece.I && rotation === _module_exports_$9.Rotation.Left) {
            y += 1;
        }
        else if (type === _module_exports_$9.Piece.S && rotation === _module_exports_$9.Rotation.Spawn) {
            y += 1;
        }
        else if (type === _module_exports_$9.Piece.S && rotation === _module_exports_$9.Rotation.Right) {
            x += 1;
        }
        else if (type === _module_exports_$9.Piece.Z && rotation === _module_exports_$9.Rotation.Spawn) {
            y += 1;
        }
        else if (type === _module_exports_$9.Piece.Z && rotation === _module_exports_$9.Rotation.Left) {
            x -= 1;
        }
        return (fieldTop - y - 1) * width + x;
    }
    function encodeRotation(_a) {
        var type = _a.type, rotation = _a.rotation;
        if (!(0, _module_exports_$9.isMinoPiece)(type)) {
            return 0;
        }
        switch (rotation) {
            case _module_exports_$9.Rotation.Reverse:
                return 0;
            case _module_exports_$9.Rotation.Right:
                return 1;
            case _module_exports_$9.Rotation.Spawn:
                return 2;
            case _module_exports_$9.Rotation.Left:
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
_module_exports_$6.createActionEncoder = createActionEncoder;

const _module_exports_$5 = {};
Object.defineProperty(_module_exports_$5, "__esModule", { value: true });
_module_exports_$5.createCommentParser = void 0;
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
_module_exports_$5.createCommentParser = createCommentParser;

const _module_exports_$4 = {};
Object.defineProperty(_module_exports_$4, "__esModule", { value: true });
_module_exports_$4.Quiz = void 0;
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
        var usedName = (0, _module_exports_$9.parsePieceName)(used);
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
            return _module_exports_$9.Piece.Empty;
        }
        var name = this.hold;
        if (name === undefined || name === '' || name === ';') {
            return _module_exports_$9.Piece.Empty;
        }
        return (0, _module_exports_$9.parsePiece)(name);
    };
    Quiz.prototype.getNextPieces = function (max) {
        if (!this.canOperate()) {
            return max !== undefined ? Array.from({ length: max }).map(function () { return _module_exports_$9.Piece.Empty; }) : [];
        }
        var names = (this.current + this.next + this.leastInActiveBag).substr(0, max);
        if (max !== undefined && names.length < max) {
            names += ' '.repeat(max - names.length);
        }
        return names.split('').map(function (name) {
            if (name === undefined || name === ' ' || name === ';') {
                return _module_exports_$9.Piece.Empty;
            }
            return (0, _module_exports_$9.parsePiece)(name);
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
_module_exports_$4.Quiz = Quiz;

const _module_exports_$3 = {};
var __assign$1 = (undefined && undefined.__assign) || function () {
    __assign$1 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};
Object.defineProperty(_module_exports_$3, "__esModule", { value: true });
_module_exports_$3.Mino = _module_exports_$3.Field = void 0;
function toMino(operationOrMino) {
    return operationOrMino instanceof Mino ? operationOrMino.copy() : Mino.from(operationOrMino);
}
var Field = /** @class */ (function () {
    function Field(field) {
        this.field = field;
    }
    Field.create = function (field, garbage) {
        return new Field(new _module_exports_$8.InnerField({
            field: field !== undefined ? _module_exports_$8.PlayField.load(field) : undefined,
            garbage: garbage !== undefined ? _module_exports_$8.PlayField.loadMinify(garbage) : undefined,
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
        return !this.canFill(__assign$1(__assign$1({}, operation), { y: operation.y - 1 }));
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
        this.field.fillAll(mino.positions(), (0, _module_exports_$9.parsePiece)(mino.type));
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
        return (0, _module_exports_$9.parsePieceName)(this.field.getNumberAt(x, y));
    };
    Field.prototype.set = function (x, y, type) {
        this.field.setNumberAt(x, y, (0, _module_exports_$9.parsePiece)(type));
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
_module_exports_$3.Field = Field;
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
        return (0, _module_exports_$8.getBlockXYs)((0, _module_exports_$9.parsePiece)(this.type), (0, _module_exports_$9.parseRotation)(this.rotation), this.x, this.y).sort(function (a, b) {
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
            (0, _module_exports_$9.parsePiece)(this.type);
            (0, _module_exports_$9.parseRotation)(this.rotation);
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
_module_exports_$3.Mino = Mino;

const _module_exports_$2 = {};
Object.defineProperty(_module_exports_$2, "__esModule", { value: true });
_module_exports_$2.decode = _module_exports_$2.extract = _module_exports_$2.Page = void 0;
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
            return new _module_exports_$3.Field(this._field.copy());
        },
        set: function (field) {
            this._field = (0, _module_exports_$8.createInnerField)(field);
        },
        enumerable: false,
        configurable: true
    });
    Page.prototype.mino = function () {
        return _module_exports_$3.Mino.from(this.operation);
    };
    return Page;
}());
_module_exports_$2.Page = Page;
var FieldConstants$1 = {
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
_module_exports_$2.extract = extract;
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
_module_exports_$2.decode = decode;
function innerDecode(data, fieldTop) {
    var fieldMaxHeight = fieldTop + FieldConstants$1.GarbageLine;
    var numFieldBlocks = fieldMaxHeight * FieldConstants$1.Width;
    var buffer = new _module_exports_$7.Buffer(data);
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
                var x = index % FieldConstants$1.Width;
                var y = fieldTop - Math.floor(index / FieldConstants$1.Width) - 1;
                result.field.addNumber(x, y, diff - 8);
                index += 1;
            }
        }
        return result;
    };
    var pageIndex = 0;
    var prevField = (0, _module_exports_$8.createNewInnerField)();
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
    var actionDecoder = (0, _module_exports_$6.createActionDecoder)(FieldConstants$1.Width, fieldTop, FieldConstants$1.GarbageLine);
    var commentDecoder = (0, _module_exports_$5.createCommentParser)();
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
            if (_module_exports_$4.Quiz.isQuizComment(text)) {
                try {
                    store.quiz = new _module_exports_$4.Quiz(text);
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
                if ((0, _module_exports_$9.isMinoPiece)(action.piece.type)) {
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
        if (action.piece.type !== _module_exports_$9.Piece.Empty) {
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
        pages.push(new Page(pageIndex, currentFieldObj.field, currentPiece !== undefined ? _module_exports_$3.Mino.from({
            type: (0, _module_exports_$9.parsePieceName)(currentPiece.type),
            rotation: (0, _module_exports_$9.parseRotationName)(currentPiece.rotation),
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
            if ((0, _module_exports_$9.isMinoPiece)(action.piece.type)) {
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

const _module_exports_$1 = {};
var __assign = (undefined && undefined.__assign) || function () {
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
Object.defineProperty(_module_exports_$1, "__esModule", { value: true });
_module_exports_$1.encode = void 0;
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
        else if (lastRepeatIndex < 0 || buffer.get(lastRepeatIndex) === _module_exports_$7.Buffer.tableLength - 1) {
            // フィールドを記録して、リピートを開始する
            buffer.merge(values);
            buffer.push(0);
            lastRepeatIndex = buffer.length - 1;
        }
        else if (buffer.get(lastRepeatIndex) < (_module_exports_$7.Buffer.tableLength - 1)) {
            // フィールドは記録せず、リピートを進める
            var currentRepeatValue = buffer.get(lastRepeatIndex);
            buffer.set(lastRepeatIndex, currentRepeatValue + 1);
        }
    };
    var lastRepeatIndex = -1;
    var buffer = new _module_exports_$7.Buffer();
    var prevField = (0, _module_exports_$8.createNewInnerField)();
    var actionEncoder = (0, _module_exports_$6.createActionEncoder)(FieldConstants.Width, 23, FieldConstants.GarbageLine);
    var commentParser = (0, _module_exports_$5.createCommentParser)();
    var prevComment = '';
    var prevQuiz = undefined;
    var innerEncode = function (index) {
        var currentPage = pages[index];
        currentPage.flags = currentPage.flags ? currentPage.flags : {};
        var field = currentPage.field;
        var currentField = field !== undefined ? (0, _module_exports_$8.createInnerField)(field) : prevField.copy();
        // フィールドの更新
        updateField(prevField, currentField);
        // アクションの更新
        var currentComment = currentPage.comment !== undefined
            ? ((index !== 0 || currentPage.comment !== '') ? currentPage.comment : undefined)
            : undefined;
        var piece = currentPage.operation !== undefined ? {
            type: (0, _module_exports_$9.parsePiece)(currentPage.operation.type),
            rotation: (0, _module_exports_$9.parseRotation)(currentPage.operation.rotation),
            x: currentPage.operation.x,
            y: currentPage.operation.y,
        } : {
            type: _module_exports_$9.Piece.Empty,
            rotation: _module_exports_$9.Rotation.Reverse,
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
                    prevQuiz = new _module_exports_$4.Quiz(currentComment);
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
            if ((0, _module_exports_$9.isMinoPiece)(piece.type)) {
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
            if ((0, _module_exports_$9.isMinoPiece)(action.piece.type)) {
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
_module_exports_$1.encode = encode;
// フィールドをエンコードする
// 前のフィールドがないときは空のフィールドを指定する
// 入力フィールドの高さは23, 幅は10
function encodeField(prev, current) {
    var FIELD_TOP = 23;
    var FIELD_MAX_HEIGHT = FIELD_TOP + 1;
    var FIELD_BLOCKS = FIELD_MAX_HEIGHT * FieldConstants.Width;
    var buffer = new _module_exports_$7.Buffer();
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

const _module_exports_ = {};
Object.defineProperty(_module_exports_, "__esModule", { value: true });
_module_exports_.encoder = _module_exports_.decoder = _module_exports_.Mino = _module_exports_.Field = void 0;
Object.defineProperty(_module_exports_, "Field", { enumerable: true, get: function () { return _module_exports_$3.Field; } });
Object.defineProperty(_module_exports_, "Mino", { enumerable: true, get: function () { return _module_exports_$3.Mino; } });
_module_exports_.decoder = {
    decode: function (data) {
        return (0, _module_exports_$2.decode)(data);
    },
};
_module_exports_.encoder = {
    encode: function (data) {
        return "v115@".concat((0, _module_exports_$1.encode)(data));
    },
};

/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */


/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;

/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index
    ? html + str.substring(lastIndex, index)
    : html;
}

const {decoder} = _module_exports_;

const tiles = {
  _: "#000",
  X: "#999",
  Xl: "#ccc",
  I: "hsl(180, 100%, 35%)",
  Il: "#0ff",
  L: "hsl(30, 95%, 47%)",
  Ll: "hsl(36, 100%, 55%)",
  O: "hsl(60, 70%, 40%)",
  Ol: "#ff0",
  Z: "hsl(0, 70%, 50%)",
  Zl: "hsl(0, 100%, 63%)",
  T: "hsl(295, 80%, 47%)",
  Tl: "hsl(300, 90%, 57%)",
  J: "hsl(240, 75%, 50%)",
  Jl: "hsl(240, 100%, 60%)",
  S: "hsl(120, 100%, 33%)",
  Sl: "#0f0"
};

function createTile(name, size) {
  const fill = tiles[name];
  const stroke = name === "_" ? ' stroke="rgba(255,255,255,0.05)"' : "";
  return `<rect id="t${name}" fill="${fill}" width="${size}" height="${size}"${stroke}/>`;
}

function pageToFrame(page) {
  const field = page.field.copy();
  const filledMino = page.operation && field.fill(page.operation);
  const output = Array(200);
  const touchedY = new Set;
  
  // extract field data
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 10; x++) {
      output[y * 10 + x] = {
        type: field.at(x, y),
        light: false
      };
    }
  }
  
  // draw active mino
  if (filledMino) {
    for (const {x, y} of filledMino.positions()) {
      touchedY.add(y);
      output[y * 10 + x].light = true;
    }
  }
  
  if (page.flags.lock) {
    // lighten lines which should be cleared
    for (const y of touchedY) {
      if (isLineFilled(field, y)) {
        for (let x = 0; x < 10; x++) {
          output[y * 10 + x].light = true;
        }
      }
    }
  }
  return output;
}

function isLineFilled(field, y) {
  for (let x = 0; x < 10; x++) {
    if (field.at(x, y) === "_") {
      return false;
    }
  }
  return true;
}

function createSVG({
  data,
  pages = decoder.decode(data),
  index,
  delay = 500,
  size = 16,
  commentSize = 16,
  animateType = "css",
  comment = "auto"
}) {
  if (index != null) {
    pages = pages.slice(index, index + 1);
  }
  const frames = pages.map(pageToFrame);
  const drawComment = 
    comment === "always" ? true :
    comment === "none" ? false :
    pages.some(p => p.comment);
  const commentHeight = Math.round(commentSize * 1.6);
  const commentOffset = commentSize * 1.2;
  const commentY = size * 20;
  const width = size * 10;
  const height = size * 20 + (drawComment ? commentHeight : 0);
  
  // diff frames
  for (let i = frames.length - 1; i >= 1; i--) {
    for (let j = 0; j < frames[i].length; j++) {
      if (isTileEqual(frames[i - 1][j], frames[i][j])) {
        frames[i][j] = null;
      }
    }
  }
  
  // diff comment
  for (let i = pages.length - 1; i >= 1; i--) {
    if (pages[i].comment && pages[i].comment === pages[i - 1].comment) {
      pages[i].comment = null;
    }
  }
  
  const layers = [];
  const usedTiles = new Set;
  for (let i = 0; i < frames.length; i++) {
    const layer = createLayer(frames[i], size);
    for (const t of layer.used) {
      usedTiles.add(t);
    }
    const comment = drawComment ?
      createComment({
        text: pages[i].comment,
        width,
        height: commentHeight,
        y: commentY,
        size: commentSize,
        offset: commentOffset,
        index: i
      }) : "";
    layers.push(`
      <svg viewBox="0 0 ${width} ${height}" id="f${i}">
        ${layer.tiles.join("")}
        ${comment}
        ${createAnimate(i, frames.length, delay, animateType)}
      </svg>`);
  }
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="font-family: sans-serif">
      <defs>
        ${createDefs(usedTiles, size)}
      </defs>
      ${layers.join("")}
      ${createProgress(commentY, frames.length, width, delay, animateType)}
    </svg>`.trim().replace(/>\s+</g, ">\n<");
}

function createProgress(y, total, width, delay, type) {
  if (total === 1) {
    return "";
  }
  const attr = `d="M 0,${y} H${width}" stroke="silver" stroke-width="${width / 50}" stroke-dasharray="${width}"`;
  if (type === "css") {
    return `
      <path ${attr} id="p"/>
      <style>
        #p {animation: p ${delay * total}ms steps(${total}, start) infinite}
        @keyframes p {
          from {
            stroke-dashoffset: ${width};
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      </style>`;
  }
  return `
    <path ${attr}>
      <animate attributeName="stroke-dashoffset" values="${createValues()}" calcMode="discrete" dur="${total * delay}ms" repeatCount="indefinite"/>
    </path>`;
    
  function createValues() {
    const values = [];
    for (let i = 0; i < total; i++) {
      values.push((total - i - 1) / total * width);
    }
    return values.join(";");
  }
}

function createComment({text, width, height, y, size, offset, index}) {
  if (!text && index) {
    return "";
  }
  const bg = index === 0 ? 
    `<rect id="cbg" fill="#333" y="${y}" width="${width}" height="${height}"/>` :
    '<use href="#cbg"/>';
  const textEl = text ?
    `<text x="${width / 2}" y="${y + offset}" text-anchor="middle" font-size="${size}" fill="white">${escapeHtml(text)}</text>` : "";
  return bg + textEl;
}

function createAnimate(i, total, delay, type) {
  if (i === 0) {
    return "";
  }
  if (type === "css") {
    return `<style>
      #f${i} {
        animation: a${i} ${total * delay}ms step-end infinite;
      }
      @keyframes a${i} {
        0% {visibility: hidden} ${i * 100 / total}% {visibility: visible}
      }
    </style>`;
  }
  return `<animate attributeName="display" values="none;inline" calcMode="discrete" keyTimes="0;${i/total}" dur="${delay * total}ms" repeatCount="indefinite" />`;
}

function createDefs(include, size) {
  const els = [];
  for (const name of include) {
    els.push(createTile(name, size));
  }
  return els.join("");
}

function createLayer(buffer, size) {
  const bgTiles = [];
  const tiles = [];
  const used = new Set;
  for (let i = 0; i < buffer.length; i++) {
    if (!buffer[i]) {
      continue;
    }
    const name = `${buffer[i].type}${buffer[i].light ? "l" : ""}`;
    used.add(name);
    const y = Math.floor(i / 10);
    const x = i % 10;
    const data = `<use href="#t${name}" x="${x * size}" y="${(20 - y - 1) * size}"/>`;
    if (name === "_") {
      bgTiles.push(data);
    } else {
      tiles.push(data);
    }
  }
  return {
    used,
    tiles: bgTiles.concat(tiles)
  };
}

function isTileEqual(a, b) {
  return a.type === b.type && a.light === b.light;
}

var fumen = {
  name: "Fumen",
  global: true,
  getPatterns: function() {
    return [
      /(?:fumen\.zui\.jp|harddrop\.com\/fumen)[^?]*\?(v115@.*)/i
    ];
  },
  getEmbedFunction: function() {
    return function (data, url, text, node) {
      var image = new Image;
      image.title = text;
      image.className = "embed-me-fumen";
      image.src = `data:image/svg+xml,${encodeURIComponent(createSVG({data}))}`;
      node = node.cloneNode(false);
      node.appendChild(image);
      return node;
    };
  }
};

var image = {
  name: "Image",
  global: true,
  getPatterns: function() {
    return [
      /^[^?#]+\.(?:jpg|png|gif|jpeg)(?:$|[?#])/i
    ];
  },
  getEmbedFunction: function() {
    GM_addStyle(".embed-me-image { max-width: 90%; }");
    return function(url, text, node) {
      var image = new Image;
      image.title = text;
      image.className = "embed-me-image";
      image.src = url;
      node = node.cloneNode(false);
      node.appendChild(image);
      return node;
    };
  }
};

var imgur = {
  name: "Imgur gifv",
  domains: ["i.imgur.com", "imgur.com"],
  getPatterns: function() {
    return [
      /imgur\.com\/(\w+)(\.gifv|$)/i
    ];
  },
  getEmbedFunction: function() {
    GM_addStyle('.imgur-embed-iframe-pub { box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.10); border: 1px solid #ddd; border-radius: 2px; margin: 10px 0; width: 540px; overflow: hidden; }');

    window.addEventListener("message", function(e){
      if (e.origin.indexOf("imgur.com") < 0) {
        return;
      }

      var data = JSON.parse(e.data),
        id = data.href.match(/imgur\.com\/(\w+)\//)[1],
        css = '.imgur-embed-iframe-pub-' + id + '-' + data.context + '-540 { height: ' + data.height + 'px!important; width: 540px!important; }';

      GM_addStyle(css);
    });

    return function(id) {
      var iframe = document.createElement("iframe");
      iframe.className = "imgur-embed-iframe-pub imgur-embed-iframe-pub-" + id + "-true-540";
      iframe.scrolling = "no";
      iframe.src = "//imgur.com/" + id + "/embed?w=540&ref=" + location.href + "#embed-me";
      return iframe;
    };
  }
};

var soundcloud = {
  name: "SoundCloud",
  domains: ["soundcloud.com"],
  getPatterns: function() {
    return [
      /soundcloud\.com\/[\w-]+\/[\w-]+(?:\?|$)/i
    ];
  },
  getEmbedFunction: function(){
    return function(url, text, node, replace) {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://soundcloud.com/oembed?format=json&url=" + url,
        onload: function(response) {
          if (!response.responseText) {
            return;
          }
          var html = JSON.parse(response.responseText).html;
          var container = document.createElement("div");
          container.innerHTML = html;
          replace(container);
        }
      });
    };
  }
};

var twitch = {
  name: "Twitch",
  domains: ["www.twitch.tv"],
  getPatterns: function() {
    return [
      /twitch\.tv\/(\w+)\/(v)\/(\d+)/i,
      /twitch\.tv\/()(videos)\/(\d+)/i,
      /twitch\.tv\/(\w+)\/(clip)\/([^/]+)/i,
    ];
  },
  getEmbedFunction: function() {
    return function (user, type, id) {
      var container = document.createElement("div");
      if (type == "v" || type == "videos") {
        container.innerHTML = `<iframe src="https://player.twitch.tv/?video=${id}&autoplay=false&parent=${location.hostname}" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>`;
      } else if (type == "clip") {
        container.innerHTML = `<iframe src="https://clips.twitch.tv/embed?clip=${id}&autoplay=false&parent=${location.hostname}" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>`;
      }
      return container;
    };
  }
};

var video = {
  name: "Video",
  global: true,
  getPatterns: function() {
    return [
      /^[^?#]+\.(?:mp4|webm|ogv|mov)(?:$|[?#])/i
    ];
  },
  getEmbedFunction: function() {
    return function (url, text) {
      var video = document.createElement("video");
      video.controls = true;
      video.title = text;
      video.src = url;
      return video;
    };
  }
};

var youtube = {
  name: "Youtube",
  domains: [
    "www.youtube.com",
    "youtu.be"
  ],
  getPatterns: function() {
    return [
      /youtube\.com\/watch\?.*?v=([^&]+)/i,
      /youtu\.be\/([^?]+)/i,
      /youtube\.com\/embed\/([^?#]+)/,
      /youtube\.com\/v\/([^?#]+)/
    ];
  },
  getEmbedFunction: function() {
    return function(id, url, text, node, replace) {
      url = "https://www.youtube.com/watch?v=" + id;
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.youtube.com/oembed?format=json&url=" + url,
        onload: function(response) {
          var html = JSON.parse(response.responseText).html,
            container = document.createElement("div");

          container.innerHTML = html;
          replace(container);
        }
      });
    };
  }
};

var modules = [fumen,image,imgur,soundcloud,twitch,video,youtube];

/* global GM_webextPref */


const pref = GM_webextPref({
  default: {
    simple: true,
    excludes: "",
    ...Object.fromEntries(modules.map(m => [m.name, true]))
  },
  body: [
    {
			label: "Ignore complex anchor",
			type: "checkbox",
      key: "simple"
    },
    {
			label: "Excludes these urls (regexp per line)",
			type: "textarea",
      key: "excludes"
    },
    ...modules.map(module => ({
      label: module.name,
      key: module.name,
      type: "checkbox"
    }))
  ],
  getNewScope: () => location.hostname
});
const globalMods = [];
const index = {};
let excludedUrl = null;

pref.ready()
  .then(() => pref.setCurrentScope(location.hostname))
  .then(init);

function init() {
  pref.on("change", change => {
    if (change.excludes != null) {
      updateExclude();
    }
  });
  updateExclude();
  
  for (const mod of modules) {
		if (mod.global) {
			globalMods.push(mod);
		} else {
			var i;
			for (i = 0; i < mod.domains.length; i++) {
				index[mod.domains[i]] = mod;
			}
		}
  }
  
  observeDocument(function(node){
    var links = node.querySelectorAll("a[href]"), i;
    for (i = 0; i < links.length; i++) {
      embed(links[i]);
    }
  });
}

function validParent(node) {
  var cache = node;
  while (node != document.documentElement) {
    if (node.INVALID || node.className.indexOf("embed-me") >= 0) {
      cache.INVALID = true;
      return false;
    }
    if (!node.parentNode) {
      return false;
    }
    if (node.VALID) {
      break;
    }
    node = node.parentNode;
  }
  cache.VALID = true;
  return true;
}

function valid(node) {
  if (!validParent(node)) {
    return false;
  }
  if (node.nodeName != "A" || !node.href) {
    return false;
  }
  if (pref.get("simple") && (node.childNodes.length != 1 || node.childNodes[0].nodeType != 3)) {
    return false;
  }
  if (excludedUrl && excludedUrl.test(node.href)) {
    return false;
  }
  return true;
}

function getPatterns(mod) {
  if (!mod.getPatterns) {
    return [];
  }
  if (!mod.patterns) {
    mod.patterns = mod.getPatterns();
  }
  return mod.patterns;
}

function getEmbedFunction(mod) {
  if (!mod.embedFunction) {
    mod.embedFunction = mod.getEmbedFunction();
  }
  return mod.embedFunction;
}

function callEmbedFunc(node, params, func) {
  var replace = function (newNode) {
    if (!node.parentNode) {
      // The node was detached from DOM tree
      return;
    }
    newNode.classList.add("embed-me");
    node.parentNode.replaceChild(newNode, node);
  };
  params.push(node.href, node.textContent, node, replace);
  var result = func.apply(null, params);
  if (result) {
    replace(result);
  }
}

function embed(node) {
  if (!valid(node)) {
    return;
  }
  // Never process same element twice
  node.INVALID = true;

  var mods = [], mod, patterns, match, i, j;

  if (node.hostname in index) {
    mods.push(index[node.hostname]);
  }

  mods = mods.concat(globalMods).filter(mod => pref.get(mod.name));

  for (j = 0; j < mods.length; j++) {
    mod = mods[j];
    patterns = getPatterns(mod);

    for (i = 0; i < patterns.length; i++) {
      if ((match = patterns[i].exec(node.href))) {
        callEmbedFunc(node, Array.prototype.slice.call(match, 1), getEmbedFunction(mod));
        return;
      }
    }
  }
}

function observeDocument(callback) {

  setTimeout(callback, 0, document.body);

  new MutationObserver(function(mutations){
    var i;
    for (i = 0; i < mutations.length; i++) {
      if (!mutations[i].addedNodes.length) {
        continue;
      }
      callback(mutations[i].target);
    }
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
}

function updateExclude() {
  const excludes = pref.get("excludes").trim();
  excludedUrl = excludes && new RegExp(excludes.split(/\s*\n\s*/).join("|"), "i");
}
