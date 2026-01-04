var $Config;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ts/consts.ts":
/*!**********************!*\
  !*** ./ts/consts.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SOCKET_ID: () => (/* binding */ SOCKET_ID)
/* harmony export */ });
const SOCKET_ID = 'tree-frame';


/***/ }),

/***/ "./ts/library/index.ts":
/*!*****************************!*\
  !*** ./ts/library/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   edit: () => (/* binding */ edit),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   reset: () => (/* reexport safe */ _modal_body__WEBPACK_IMPORTED_MODULE_4__.reset)
/* harmony export */ });
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validation */ "./ts/library/validation/index.ts");
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modal */ "./ts/modal/index.ts");
/* harmony import */ var _modal_body_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modal/body/data */ "./ts/modal/body/data/index.ts");
/* harmony import */ var _modal_header_actions_close__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../modal/header/actions/close */ "./ts/modal/header/actions/close/index.ts");
/* harmony import */ var _modal_body__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../modal/body */ "./ts/modal/body/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





function init(page, socket, targetWindow = window) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = {};
        try {
            yield (0,_validation__WEBPACK_IMPORTED_MODULE_0__["default"])(page);
            (0,_modal__WEBPACK_IMPORTED_MODULE_1__["default"])(page, socket, targetWindow);
            // Config is valid
            response.requireReset = false;
        }
        catch (error) {
            if (typeof page !== 'object' || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.hasOwnProperty)(page, 'userTree')) {
                throw error;
            }
            delete page.userTree;
            // Test validity after reset
            yield (0,_validation__WEBPACK_IMPORTED_MODULE_0__["default"])(page);
            (0,_modal__WEBPACK_IMPORTED_MODULE_1__["default"])(page, socket, targetWindow);
            response.requireReset = true;
            response.error = error;
        }
        return Object.assign(Object.assign({}, response), (0,_modal_body_data__WEBPACK_IMPORTED_MODULE_2__.getSaveData)());
    });
}
function edit() {
    (0,_modal__WEBPACK_IMPORTED_MODULE_1__.getSocket)().focus();
    return new Promise((resolve) => {
        (0,_modal_header_actions_close__WEBPACK_IMPORTED_MODULE_3__.setCallback)(resolve);
    });
}


/***/ }),

/***/ "./ts/library/validation/errors.ts":
/*!*****************************************!*\
  !*** ./ts/library/validation/errors.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DeactivatedError: () => (/* binding */ DeactivatedError),
/* harmony export */   DependenceError: () => (/* binding */ DependenceError),
/* harmony export */   EmptyArrayError: () => (/* binding */ EmptyArrayError),
/* harmony export */   EmptyStringError: () => (/* binding */ EmptyStringError),
/* harmony export */   FunctionMatchError: () => (/* binding */ FunctionMatchError),
/* harmony export */   JoinedError: () => (/* binding */ JoinedError),
/* harmony export */   NonPosIntError: () => (/* binding */ NonPosIntError),
/* harmony export */   OptionError: () => (/* binding */ OptionError),
/* harmony export */   OptionMatchError: () => (/* binding */ OptionMatchError),
/* harmony export */   PoolBranchError: () => (/* binding */ PoolBranchError),
/* harmony export */   PoolSizeError: () => (/* binding */ PoolSizeError),
/* harmony export */   PredicateError: () => (/* binding */ PredicateError),
/* harmony export */   PropertyError: () => (/* binding */ PropertyError),
/* harmony export */   SeedMatchError: () => (/* binding */ SeedMatchError),
/* harmony export */   TypeError: () => (/* binding */ TypeError),
/* harmony export */   UnexpectedStateError: () => (/* binding */ UnexpectedStateError),
/* harmony export */   ValueError: () => (/* binding */ ValueError)
/* harmony export */ });
// Helpers
function getOptionString(array) {
    if (array.length === 0) {
        throw new Error('No valid options.');
    }
    if (array.length === 1) {
        return `"${array[0]}"`;
    }
    return `"${array.slice(0, -1).join('", "')}" or "${array[array.length - 1]}"`;
}
function getPath(breadcrumbs) {
    return `/${breadcrumbs.join('/')}`;
}
// Errors
class JoinedError extends Error {
    constructor(...errors) {
        super(errors.map(({ message }) => message).join(JoinedError.separator));
    }
}
JoinedError.separator = '\n\n';
class UnexpectedStateError extends Error {
    constructor() {
        super('Unexpected state reached.');
    }
}
class TypeError extends Error {
    constructor(breadcrumbs, found, expected) {
        super(`Found a value of type "${found}" at ${getPath(breadcrumbs)}. Expected ${getOptionString(expected)}.`);
    }
}
class PropertyError extends Error {
    constructor(breadcrumbs, property, shouldExist) {
        super(`${shouldExist ? 'Missing' : 'Unexpected'} property "${property}" found at ${getPath(breadcrumbs)}.`);
    }
}
class ValueError extends Error {
    constructor(breadcrumbs, found, expected) {
        super(`Found a value of "${found}" at ${getPath(breadcrumbs)}. Expected ${getOptionString(expected)}.`);
    }
}
class NonPosIntError extends Error {
    constructor(breadcrumbs, value) {
        super(`Found a value of "${value}" at ${getPath(breadcrumbs)}. Expected a positive integer.`);
    }
}
class EmptyStringError extends Error {
    constructor(breadcrumbs) {
        super(`Found illegal empty string at ${getPath(breadcrumbs)}.`);
    }
}
class EmptyArrayError extends Error {
    constructor(breadcrumbs) {
        super(`Found illegal empty array at ${getPath(breadcrumbs)}.`);
    }
}
class PredicateError extends Error {
    constructor(breadcrumbs) {
        super(`Predicate failed at ${getPath(breadcrumbs)}. Predicates must succeed.`);
    }
}
class OptionError extends Error {
    constructor() {
        super('Node value not found in its options.');
    }
}
class SeedMatchError extends Error {
    constructor() {
        super('All children must be structurally similar to their parent\'s seed.');
    }
}
class PoolBranchError extends Error {
    constructor(ancestorBreadcrumbs, descendantBreadcrumbs, poolId) {
        super('No node may share a poolId value with its ancestor.' + JoinedError.separator
            + `Found poolId value ${poolId} at ${getPath(ancestorBreadcrumbs)} and ${getPath(descendantBreadcrumbs)}.`);
    }
}
class PoolSizeError extends Error {
    constructor(poolId, found, expected) {
        super('Corresponding pools in the default & candidate trees must be the same size unless a pool parent or ancestor has a seed value.' + JoinedError.separator
            + `Found a size of ${found} at pool ${poolId}. Expected a size of ${expected}.`);
    }
}
class FunctionMatchError extends Error {
    constructor() {
        super('Corresponding function values in seed & non-seed branches must be the same pointer.');
    }
}
class OptionMatchError extends Error {
    constructor() {
        super('Options must have the same type as their node\'s value.');
    }
}
class DependenceError extends Error {
    constructor(found, missing) {
        super(`Nodes with a "${found}" entry must have a "${missing}" property.`);
    }
}
class DeactivatedError extends Error {
    constructor() {
        super('Nodes can\'t be deactivated unless their parent has a seed.');
    }
}


/***/ }),

/***/ "./ts/library/validation/index.ts":
/*!****************************************!*\
  !*** ./ts/library/validation/index.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   hasOwnProperty: () => (/* binding */ hasOwnProperty),
/* harmony export */   validateUnexpectedKeys: () => (/* binding */ validateUnexpectedKeys)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./ts/library/validation/types.ts");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errors */ "./ts/library/validation/errors.ts");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles */ "./ts/library/validation/styles.ts");
/* harmony import */ var _trees_pools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./trees/pools */ "./ts/library/validation/trees/pools.ts");
/* harmony import */ var _trees_guards__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./trees/guards */ "./ts/library/validation/trees/guards.ts");
/* harmony import */ var _trees_match__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./trees/match */ "./ts/library/validation/trees/match.ts");
/* harmony import */ var _trees_predicates__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./trees/predicates */ "./ts/library/validation/trees/predicates.ts");







// Helpers
// Credit to https://fettblog.eu/typescript-hasownproperty/
function hasOwnProperty(object, property) {
    return Object.hasOwnProperty.call(object, property);
}
function validateUnexpectedKeys(breadcrumbs, object, expected) {
    for (const key of Object.keys(object)) {
        if (!expected.includes(key))
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.PropertyError(breadcrumbs, key, false);
    }
}
// Guard
function isPage(candidate) {
    if (typeof candidate !== 'object')
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([], typeof candidate, ['object']);
    validateUnexpectedKeys([], candidate, _types__WEBPACK_IMPORTED_MODULE_0__.PAGE_KEYS);
    // title
    if (!hasOwnProperty(candidate, 'title'))
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.PropertyError([], 'title', true);
    if (typeof candidate.title !== 'string')
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError(['title'], typeof candidate.title, ['string']);
    // defaultStyle
    if (hasOwnProperty(candidate, 'defaultStyle')) {
        if (!(0,_styles__WEBPACK_IMPORTED_MODULE_2__.isStyles)(['defaultStyle'], candidate.defaultStyle))
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.UnexpectedStateError();
        if (hasOwnProperty(candidate.defaultStyle, 'name'))
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.PropertyError(['defaultStyle'], 'name', false);
        if (hasOwnProperty(candidate.defaultStyle, 'isActive'))
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.PropertyError(['defaultStyle'], 'isActive', false);
    }
    // userStyles
    if (!hasOwnProperty(candidate, 'userStyles'))
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.PropertyError([], 'userStyles', true);
    if (!Array.isArray(candidate.userStyles))
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError(['userStyles'], typeof candidate.userStyles, ['array']);
    for (const [i, style] of candidate.userStyles.entries()) {
        if (!(0,_styles__WEBPACK_IMPORTED_MODULE_2__.isStyles)(['userStyles', i.toString()], style))
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.UnexpectedStateError();
        if (!hasOwnProperty(style, 'name'))
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.PropertyError(['userStyles', i.toString()], 'name', true);
        if (typeof style.name !== 'string')
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError(['userStyles', i.toString(), 'name'], typeof style.name, ['string']);
        if (hasOwnProperty(style, 'isActive') && typeof style.isActive !== 'boolean')
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError(['userStyles', i.toString(), 'isActive'], typeof style.isActive, ['boolean']);
    }
    // defaultTree
    if (!hasOwnProperty(candidate, 'defaultTree') || !(0,_trees_guards__WEBPACK_IMPORTED_MODULE_4__.isRoot)(['defaultTree'], candidate.defaultTree))
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.PropertyError([], 'defaultTree', true);
    // userTree
    if (hasOwnProperty(candidate, 'userTree') && !(0,_trees_guards__WEBPACK_IMPORTED_MODULE_4__.isRoot)(['userTree'], candidate.userTree, true))
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.UnexpectedStateError();
    return true;
}
// Validator
function validatePage({ title, defaultTree, userTree }) {
    // title
    if (title.length === 0)
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.EmptyStringError(['title']);
    // trees
    (0,_trees_match__WEBPACK_IMPORTED_MODULE_5__.validateSeeds)(['defaultTree'], defaultTree);
    (0,_trees_pools__WEBPACK_IMPORTED_MODULE_3__.validatePools)(['defaultTree'], defaultTree);
    if (!userTree) {
        return Promise.all((0,_trees_predicates__WEBPACK_IMPORTED_MODULE_6__.validateParent)(['defaultTree'], defaultTree));
    }
    (0,_trees_match__WEBPACK_IMPORTED_MODULE_5__.matchUserTreeParent)(['defaultTree'], defaultTree, ['userTree'], userTree);
    // Has to be done after mutations since new pools may be created
    (0,_trees_match__WEBPACK_IMPORTED_MODULE_5__.validatePoolSizeMatch)(defaultTree, userTree);
    return Promise.all([
        ...(0,_trees_predicates__WEBPACK_IMPORTED_MODULE_6__.validateParent)(['defaultTree'], defaultTree),
        ...(0,_trees_predicates__WEBPACK_IMPORTED_MODULE_6__.validateParent)(['userTree'], userTree),
    ]);
}
// API
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(candidate) {
    if (!isPage(candidate))
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.UnexpectedStateError();
    return validatePage(candidate);
}


/***/ }),

/***/ "./ts/library/validation/styles.ts":
/*!*****************************************!*\
  !*** ./ts/library/validation/styles.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isStyles: () => (/* binding */ isStyles)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors */ "./ts/library/validation/errors.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./ts/library/validation/types.ts");


function isStyles(breadcrumbs, candidate) {
    if (typeof candidate !== 'object')
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.TypeError(breadcrumbs, typeof candidate, ['object']);
    if (Array.isArray(candidate))
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.TypeError(breadcrumbs, 'array', ['object']);
    for (const [key, value] of Object.entries(candidate)) {
        switch (key) {
            // Colours
            case 'modalOutline':
            case 'headBase':
            case 'headButtonExit':
            case 'headButtonLabel':
            case 'headButtonStyle':
            case 'headButtonSticky':
            case 'nodeHeaderBase':
            case 'nodeBlendBase':
            case 'nodeValueBase':
            case 'nodeButtonRemove':
            case 'nodeButtonCreate':
            case 'nodeButtonMove':
            case 'nodeButtonDisable':
            case 'validBackground':
            case 'invalidBackground':
            case 'focusBackground':
            case 'tooltipOutline':
                if (typeof value !== 'string')
                    throw new _errors__WEBPACK_IMPORTED_MODULE_0__.TypeError([...breadcrumbs, key], typeof value, ['string']);
                break;
            // Numbers
            case 'fontSize':
            case 'width':
            case 'height':
                if (typeof value !== 'number')
                    throw new _errors__WEBPACK_IMPORTED_MODULE_0__.TypeError([...breadcrumbs, key], typeof value, ['number']);
                break;
            // Contrast methods
            case 'headContrast':
            case 'nodeContrast':
                if (typeof value !== 'string')
                    throw new _errors__WEBPACK_IMPORTED_MODULE_0__.TypeError([...breadcrumbs, key], typeof value, ['string']);
                if (!_types__WEBPACK_IMPORTED_MODULE_1__.CONTRAST_METHODS.includes(value))
                    throw new _errors__WEBPACK_IMPORTED_MODULE_0__.ValueError([...breadcrumbs, key], value, _types__WEBPACK_IMPORTED_MODULE_1__.CONTRAST_METHODS);
                break;
            // Booleans
            case 'isActive':
            case 'borderLeaf':
            case 'borderNode':
                if (typeof value !== 'boolean')
                    throw new _errors__WEBPACK_IMPORTED_MODULE_0__.TypeError([...breadcrumbs, key], typeof value, ['boolean']);
                break;
        }
    }
    return true;
}


/***/ }),

/***/ "./ts/library/validation/trees/guards.ts":
/*!***********************************************!*\
  !*** ./ts/library/validation/trees/guards.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isParent: () => (/* binding */ isParent),
/* harmony export */   isRoot: () => (/* binding */ isRoot)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types */ "./ts/library/validation/types.ts");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../errors */ "./ts/library/validation/errors.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../index */ "./ts/library/validation/index.ts");



function hasDependee(breadcrumbs, candidate, property, dependence) {
    if (!(0,_index__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(candidate, property)) {
        return false;
    }
    if ((0,_index__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(candidate, dependence))
        return true;
    throw new _errors__WEBPACK_IMPORTED_MODULE_1__.JoinedError(new _errors__WEBPACK_IMPORTED_MODULE_1__.DependenceError(property, dependence), new _errors__WEBPACK_IMPORTED_MODULE_1__.PropertyError(breadcrumbs, dependence, true));
}
function hasId(breadcrumbs, candidate, property) {
    if (!(0,_index__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(candidate, property)) {
        return false;
    }
    if (typeof candidate[property] !== 'number')
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, property], typeof candidate[property], ['number']);
    if (Object.is(candidate[property] % 1, 0))
        return true;
    throw new _errors__WEBPACK_IMPORTED_MODULE_1__.NonPosIntError([...breadcrumbs, property], candidate[property]);
}
// Type predicates
function isChild(breadcrumbs, candidate, isUserTree = false) {
    if (typeof candidate !== 'object')
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs], typeof candidate, ['object']);
    if (isUserTree) {
        (0,_index__WEBPACK_IMPORTED_MODULE_2__.validateUnexpectedKeys)(breadcrumbs, candidate, _types__WEBPACK_IMPORTED_MODULE_0__.SAVED_KEYS);
    }
    else {
        (0,_index__WEBPACK_IMPORTED_MODULE_2__.validateUnexpectedKeys)(breadcrumbs, candidate, 'children' in candidate ? _types__WEBPACK_IMPORTED_MODULE_0__.MIDDLE_KEYS : _types__WEBPACK_IMPORTED_MODULE_0__.LEAF_KEYS);
    }
    if ((0,_index__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(candidate, 'label') && typeof candidate.label !== 'string')
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'label'], typeof candidate.label, ['string']);
    if ((0,_index__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(candidate, 'value') && !_types__WEBPACK_IMPORTED_MODULE_0__.VALUE_TYPES.includes(typeof candidate.value))
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'value'], typeof candidate.value, _types__WEBPACK_IMPORTED_MODULE_0__.VALUE_TYPES);
    if (hasDependee(breadcrumbs, candidate, 'options', 'value')) {
        if (!Array.isArray(candidate.options))
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'options'], typeof candidate.options, ['array']);
        for (const [i, option] of candidate.options.entries()) {
            if (!_types__WEBPACK_IMPORTED_MODULE_0__.VALUE_TYPES.includes(typeof option))
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'options', i.toString()], typeof option, _types__WEBPACK_IMPORTED_MODULE_0__.VALUE_TYPES);
        }
    }
    if (hasDependee(breadcrumbs, candidate, 'predicate', 'value') && typeof candidate.predicate !== 'function')
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'predicate'], typeof candidate.predicate, ['function']);
    if (hasDependee(breadcrumbs, candidate, 'onUpdate', 'value') && typeof candidate.onUpdate !== 'function')
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'onUpdate'], typeof candidate.onUpdate, ['function']);
    if (hasDependee(breadcrumbs, candidate, 'listeners', 'value')) {
        if (typeof candidate.listeners !== 'object')
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'listeners'], typeof candidate.listeners, ['object']);
        for (const [event, callback] of Object.entries(candidate.listeners)) {
            if (typeof callback !== 'function')
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'listeners', event], typeof callback, ['function']);
        }
    }
    if (hasDependee(breadcrumbs, candidate, 'input', 'value')) {
        if (typeof candidate.input !== 'string')
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'input'], typeof candidate.input, ['string']);
        if (!_types__WEBPACK_IMPORTED_MODULE_0__.INPUT_FORMATS.includes(candidate.input))
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.ValueError([...breadcrumbs, 'input'], candidate.input, _types__WEBPACK_IMPORTED_MODULE_0__.INPUT_FORMATS);
    }
    if (hasDependee(breadcrumbs, candidate, 'inputAttributes', 'value') && typeof candidate.inputAttributes !== 'object')
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'inputAttributes'], typeof candidate.inputAttributes, ['object']);
    if ((0,_index__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(candidate, 'get') && typeof candidate.get !== 'function')
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'get'], typeof candidate.get, ['function']);
    hasId(breadcrumbs, candidate, 'hideId');
    if ((0,_index__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(candidate, 'isActive') && typeof candidate.isActive !== 'boolean')
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'isActive'], typeof candidate.isActive, ['boolean']);
    if ((0,_index__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(candidate, 'children') && !isParent(breadcrumbs, candidate, isUserTree))
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.UnexpectedStateError();
    return true;
}
function isParent(breadcrumbs, candidate, isUserTree = false) {
    if (!(0,_index__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(candidate, 'children'))
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.PropertyError(breadcrumbs, 'children', true);
    if (!Array.isArray(candidate.children))
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'children'], typeof candidate.children, ['array']);
    if ((0,_index__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(candidate, 'seed') && !isChild([...breadcrumbs, 'seed'], candidate.seed))
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.UnexpectedStateError();
    hasId(breadcrumbs, candidate, 'poolId');
    if ((0,_index__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(candidate, 'childPredicate') && typeof candidate.childPredicate !== 'function')
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'childPredicate'], typeof candidate.childPredicate, ['function']);
    if ((0,_index__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(candidate, 'descendantPredicate') && typeof candidate.descendantPredicate !== 'function')
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'descendantPredicate'], typeof candidate.descendantPredicate, ['function']);
    if ((0,_index__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(candidate, 'onChildUpdate') && typeof candidate.onChildUpdate !== 'function')
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'onChildUpdate'], typeof candidate.onChildUpdate, ['function']);
    if ((0,_index__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(candidate, 'onDescendantUpdate') && typeof candidate.onDescendantUpdate !== 'function')
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError([...breadcrumbs, 'onDescendantUpdate'], typeof candidate.onDescendantUpdate, ['function']);
    for (const [i, child] of candidate.children.entries()) {
        if (!isChild([...breadcrumbs, 'children', i.toString()], child, isUserTree))
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.UnexpectedStateError();
    }
    return true;
}
function isRoot(breadcrumbs, candidate, isUserTree = false) {
    if (typeof candidate !== 'object')
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TypeError(breadcrumbs, typeof candidate, ['object']);
    if (!isParent(breadcrumbs, candidate, isUserTree))
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.UnexpectedStateError();
    (0,_index__WEBPACK_IMPORTED_MODULE_2__.validateUnexpectedKeys)(breadcrumbs, candidate, _types__WEBPACK_IMPORTED_MODULE_0__.ROOT_KEYS);
    return true;
}


/***/ }),

/***/ "./ts/library/validation/trees/match.ts":
/*!**********************************************!*\
  !*** ./ts/library/validation/trees/match.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   matchUserTreeParent: () => (/* binding */ matchUserTreeParent),
/* harmony export */   validatePoolSizeMatch: () => (/* binding */ validatePoolSizeMatch),
/* harmony export */   validateSeeds: () => (/* binding */ validateSeeds)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../errors */ "./ts/library/validation/errors.ts");

// Helpers
function validateOptionMatch(modelBreadcrumbs, model, candidateBreadcrumbs, candidate) {
    if ('options' in model !== 'options' in candidate)
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.PropertyError(candidateBreadcrumbs, 'options', 'options' in model);
    if ('options' in model) {
        if (model.options.length !== candidate.options.length)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__.ValueError([...candidateBreadcrumbs, 'options', 'length'], candidate.options.length, [model.options.length]);
        for (const [i, option] of model.options.entries()) {
            if (candidate.options[i] !== option)
                throw new _errors__WEBPACK_IMPORTED_MODULE_0__.ValueError([...candidateBreadcrumbs, 'options', i.toString()], candidate.options[i], [option]);
        }
    }
}
function validateValueMatch(property, modelBreadcrumbs, model, candidateBreadcrumbs, candidate) {
    if (property in model !== property in candidate)
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.PropertyError(candidateBreadcrumbs, property, property in model);
    if (model[property] !== candidate[property])
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.ValueError([...candidateBreadcrumbs, property], candidate[property], [model[property]]);
}
function assignKeys(from, to) {
    for (const key of Object.keys(from)) {
        if (!(key in to)) {
            to[key] = from[key];
        }
    }
}
// Consistent userTree validators/enforcers
function matchUserTreeChild(modelBreadcrumbs, model, candidateBreadcrumbs, candidate) {
    if ('value' in model !== 'value' in candidate) {
        if ('value' in candidate)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__.PropertyError(candidateBreadcrumbs, 'value', false);
        candidate.value = model.value;
    }
    else if (typeof model.value !== typeof candidate.value) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.TypeError([...candidateBreadcrumbs, 'value'], typeof candidate.value, [typeof model.value]);
    }
    if ('label' in model) {
        candidate.label = model.label;
    }
    else {
        delete candidate.label;
    }
    if ('children' in model !== 'children' in candidate)
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.PropertyError(candidateBreadcrumbs, 'children', 'children' in model);
    if ('children' in model) {
        matchUserTreeParent(modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
    }
    else {
        assignKeys(model, candidate);
    }
}
function matchUserTreeParent(modelBreadcrumbs, model, candidateBreadcrumbs, candidate) {
    assignKeys(model, candidate);
    if ('seed' in model) {
        for (const [i, child] of candidate.children.entries()) {
            matchUserTreeChild([...modelBreadcrumbs, 'seed'], model.seed, [...candidateBreadcrumbs, 'children', i.toString()], child);
        }
        return;
    }
    if ('poolId' in model) {
        return;
    }
    if (model.children.length !== candidate.children.length)
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.ValueError([...candidateBreadcrumbs, 'children', 'length'], candidate.children.length, [model.children.length]);
    for (const [i, child] of candidate.children.entries()) {
        matchUserTreeChild([...modelBreadcrumbs, 'children', i.toString()], model.children[i], [...candidateBreadcrumbs, 'children', i.toString()], child);
    }
    // Done after validation to avoid validating certain matches
    if (model.children.length > candidate.children.length) {
        candidate.children.push(...model.children.slice(candidate.children.length));
    }
}
// defaultTree internal consistency validators
function validateChildMatch(modelBreadcrumbs, model, candidateBreadcrumbs, candidate) {
    if ('value' in model !== 'value' in candidate)
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.PropertyError(candidateBreadcrumbs, 'value', 'value' in model);
    if (typeof model.value !== typeof candidate.value)
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.TypeError([...candidateBreadcrumbs, 'value'], typeof candidate.value, [typeof model.value]);
    validateValueMatch('label', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
    validateValueMatch('input', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
    validateOptionMatch(modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
    try {
        validateValueMatch('predicate', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
        validateValueMatch('onUpdate', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
    }
    catch (error) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.JoinedError(new _errors__WEBPACK_IMPORTED_MODULE_0__.FunctionMatchError(), error);
    }
    if ('children' in model !== 'children' in candidate)
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.PropertyError(candidateBreadcrumbs, 'children', 'children' in model);
    if ('children' in model) {
        validateParentMatch(modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
    }
}
function validateParentMatch(modelBreadcrumbs, model, candidateBreadcrumbs, candidate) {
    validateValueMatch('poolId', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
    try {
        validateValueMatch('childPredicate', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
        validateValueMatch('onChildUpdate', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
        validateValueMatch('descendantPredicate', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
        validateValueMatch('onDescendantUpdate', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
    }
    catch (error) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.JoinedError(new _errors__WEBPACK_IMPORTED_MODULE_0__.FunctionMatchError(), error);
    }
    if ('seed' in model) {
        validateChildMatch([...modelBreadcrumbs, 'seed'], model.seed, [...candidateBreadcrumbs, 'seed'], candidate.seed);
        for (const [i, child] of candidate.children.entries()) {
            validateChildMatch([...modelBreadcrumbs, 'seed'], model.seed, [...candidateBreadcrumbs, 'children', i.toString()], child);
        }
    }
    else if (!('poolId' in model)) {
        if (model.children.length !== candidate.children.length)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__.ValueError([...candidateBreadcrumbs, 'children', 'length'], candidate.children.length, [model.children.length]);
        for (const [i, child] of candidate.children.entries()) {
            validateChildMatch([...modelBreadcrumbs, 'children', i.toString()], model.children[i], [...candidateBreadcrumbs, 'children', i.toString()], child);
        }
        if (model.children.length > candidate.children.length) {
            candidate.children.push(...model.children.slice(candidate.children.length));
        }
    }
}
// Other validators
function validateSeeds(breadcrumbs, node) {
    if ('children' in node) {
        if ('seed' in node) {
            try {
                for (const [i, child] of node.children.entries()) {
                    validateChildMatch([...breadcrumbs, 'seed'], node.seed, [...breadcrumbs, 'children', i.toString()], child);
                }
            }
            catch (error) {
                throw new _errors__WEBPACK_IMPORTED_MODULE_0__.JoinedError(new _errors__WEBPACK_IMPORTED_MODULE_0__.SeedMatchError(), error);
            }
            validateSeeds([...breadcrumbs, 'seed'], node.seed);
        }
        else {
            for (const [i, child] of node.children.entries()) {
                if ('isActive' in child && !child.isActive) {
                    throw new _errors__WEBPACK_IMPORTED_MODULE_0__.JoinedError(new _errors__WEBPACK_IMPORTED_MODULE_0__.DeactivatedError(), new _errors__WEBPACK_IMPORTED_MODULE_0__.ValueError([...breadcrumbs, 'children', i.toString(), 'isActive'], false, [true]));
                }
            }
        }
        for (const [i, child] of node.children.entries()) {
            validateSeeds([...breadcrumbs, 'children', i.toString()], child);
        }
    }
}
function getPoolSizes(node, uncapped = false) {
    const poolSizes = [];
    uncapped = uncapped || 'seed' in node;
    if ('poolId' in node) {
        poolSizes[node.poolId] = uncapped ? -1 : node.children.length;
    }
    if ('children' in node) {
        for (const child of node.children) {
            const subPoolSizes = getPoolSizes(child, uncapped);
            for (const id in subPoolSizes) {
                if (subPoolSizes[id] < 0) {
                    poolSizes[id] = -1;
                }
                else if (id in poolSizes) {
                    poolSizes[id] += subPoolSizes[id];
                }
                else {
                    poolSizes[id] = subPoolSizes[id];
                }
            }
        }
    }
    return poolSizes;
}
function validatePoolSizeMatch(model, candidate) {
    const modelSizes = getPoolSizes(model);
    const candidateSizes = getPoolSizes(candidate);
    for (const id in modelSizes) {
        if (modelSizes[id] !== candidateSizes[id])
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__.PoolSizeError(Number.parseInt(id), candidateSizes[id], modelSizes[id]);
    }
}


/***/ }),

/***/ "./ts/library/validation/trees/pools.ts":
/*!**********************************************!*\
  !*** ./ts/library/validation/trees/pools.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   validatePools: () => (/* binding */ validatePools)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../errors */ "./ts/library/validation/errors.ts");

function validatePools(breadcrumbs, node, ancestorPools = []) {
    if ('poolId' in node) {
        if (node.poolId in ancestorPools)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__.PoolBranchError(ancestorPools[node.poolId], breadcrumbs, node.poolId);
        // Slice maintains empty entries, so the 'in' operator still works
        ancestorPools = ancestorPools.slice();
        ancestorPools[node.poolId] = breadcrumbs;
    }
    if ('children' in node) {
        // Recurse
        for (const [i, child] of node.children.entries()) {
            validatePools([...breadcrumbs, 'children', i.toString()], child, ancestorPools);
        }
    }
}


/***/ }),

/***/ "./ts/library/validation/trees/predicates.ts":
/*!***************************************************!*\
  !*** ./ts/library/validation/trees/predicates.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   validateParent: () => (/* binding */ validateParent)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../errors */ "./ts/library/validation/errors.ts");
/* harmony import */ var _predicate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../predicate */ "./ts/predicate.ts");


function getBoundPredicatePromise(response, error) {
    return (0,_predicate__WEBPACK_IMPORTED_MODULE_1__.getPredicatePromise)(response)
        .catch(() => Promise.reject(error));
}
function validateChild(breadcrumbs, child) {
    if (!('options' in child) && !('predicate' in child))
        return Promise.resolve();
    if ('options' in child) {
        const type = typeof child.value;
        let valueFound = false;
        for (const [i, option] of child.options.entries()) {
            if (typeof option !== type) {
                throw new _errors__WEBPACK_IMPORTED_MODULE_0__.JoinedError(new _errors__WEBPACK_IMPORTED_MODULE_0__.OptionMatchError(), new _errors__WEBPACK_IMPORTED_MODULE_0__.TypeError([...breadcrumbs, 'options', i.toString()], typeof option, [type]));
            }
            valueFound || (valueFound = child.value === option);
        }
        if (valueFound)
            return Promise.resolve();
    }
    if ('predicate' in child)
        return getBoundPredicatePromise(child.predicate(child.value), new _errors__WEBPACK_IMPORTED_MODULE_0__.PredicateError([...breadcrumbs, 'predicate']));
    throw new _errors__WEBPACK_IMPORTED_MODULE_0__.JoinedError(new _errors__WEBPACK_IMPORTED_MODULE_0__.OptionError(), new _errors__WEBPACK_IMPORTED_MODULE_0__.ValueError([...breadcrumbs, 'value'], child.value, child.options));
}
function validateParent(breadcrumbs, parent) {
    const promises = [];
    if ('seed' in parent) {
        const { seed } = parent;
        promises.push(validateChild([...breadcrumbs, 'seed'], seed));
        if ('children' in seed) {
            promises.push(...validateParent([...breadcrumbs, 'seed'], seed));
        }
    }
    const { children } = parent;
    if ('childPredicate' in parent) {
        promises.push(getBoundPredicatePromise(parent.childPredicate(children), new _errors__WEBPACK_IMPORTED_MODULE_0__.PredicateError([...breadcrumbs, 'childPredicate'])));
    }
    if ('descendantPredicate' in parent) {
        promises.push(getBoundPredicatePromise(parent.descendantPredicate(children), new _errors__WEBPACK_IMPORTED_MODULE_0__.PredicateError([...breadcrumbs, 'descendantPredicate'])));
    }
    for (const [i, child] of children.entries()) {
        const childBreadcrumbs = [...breadcrumbs, 'children', i.toString()];
        promises.push(validateChild(childBreadcrumbs, child));
        if ('children' in child) {
            promises.push(...validateParent(childBreadcrumbs, child));
        }
    }
    return promises;
}


/***/ }),

/***/ "./ts/library/validation/types.ts":
/*!****************************************!*\
  !*** ./ts/library/validation/types.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONTRAST_METHODS: () => (/* binding */ CONTRAST_METHODS),
/* harmony export */   INPUT_FORMATS: () => (/* binding */ INPUT_FORMATS),
/* harmony export */   LEAF_KEYS: () => (/* binding */ LEAF_KEYS),
/* harmony export */   MIDDLE_KEYS: () => (/* binding */ MIDDLE_KEYS),
/* harmony export */   PAGE_KEYS: () => (/* binding */ PAGE_KEYS),
/* harmony export */   ROOT_KEYS: () => (/* binding */ ROOT_KEYS),
/* harmony export */   ROOT_OTHER_KEYS: () => (/* binding */ ROOT_OTHER_KEYS),
/* harmony export */   ROOT_PREDICATE_KEYS: () => (/* binding */ ROOT_PREDICATE_KEYS),
/* harmony export */   ROOT_UPDATE_KEYS: () => (/* binding */ ROOT_UPDATE_KEYS),
/* harmony export */   SAVED_KEYS: () => (/* binding */ SAVED_KEYS),
/* harmony export */   VALUE_TYPES: () => (/* binding */ VALUE_TYPES)
/* harmony export */ });
// Basic types
const VALUE_TYPES = ['boolean', 'number', 'string'];
const INPUT_FORMATS = ['color', 'date', 'datetime-local', 'email', 'month', 'password', 'search', 'tel', 'text', 'time', 'url', 'week'];
const CONTRAST_METHODS = ['Black / White', 'Invert'];
// Key categories
const SAVED_KEYS = ['label', 'value', 'isActive', 'children'];
const ROOT_PREDICATE_KEYS = ['childPredicate', 'descendantPredicate'];
const ROOT_UPDATE_KEYS = ['onChildUpdate', 'onDescendantUpdate'];
const ROOT_OTHER_KEYS = ['children', 'seed', 'poolId', 'get'];
// Node types
// hacky code to avoid a duplicate "get" in MIDDLE_KEYS
const _LEAF_KEYS = ['label', 'value', 'predicate', 'options', 'input', 'isActive', 'onUpdate', 'listeners', 'hideId', 'inputAttributes'];
const LEAF_KEYS = [..._LEAF_KEYS, 'get'];
const ROOT_KEYS = [...ROOT_PREDICATE_KEYS, ...ROOT_UPDATE_KEYS, ...ROOT_OTHER_KEYS];
const MIDDLE_KEYS = [..._LEAF_KEYS, ...ROOT_KEYS];
// Config type
const PAGE_KEYS = ['title', 'defaultTree', 'userTree', 'defaultStyle', 'userStyles'];


/***/ }),

/***/ "./ts/modal/body/consts.ts":
/*!*********************************!*\
  !*** ./ts/modal/body/consts.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MODAL_BODY_ID: () => (/* binding */ MODAL_BODY_ID)
/* harmony export */ });
const MODAL_BODY_ID = 'modal-body';


/***/ }),

/***/ "./ts/modal/body/css.ts":
/*!******************************!*\
  !*** ./ts/modal/body/css.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/consts.ts");
/* harmony import */ var _nodes_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nodes/css */ "./ts/modal/body/nodes/css.ts");
/* harmony import */ var _nodes_actions_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nodes/actions/css */ "./ts/modal/body/nodes/actions/css.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../css */ "./ts/modal/css.ts");




function generate() {
    (0,_nodes_css__WEBPACK_IMPORTED_MODULE_1__["default"])();
    (0,_nodes_actions_css__WEBPACK_IMPORTED_MODULE_2__["default"])();
    (0,_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`#${_consts__WEBPACK_IMPORTED_MODULE_0__.MODAL_BODY_ID}`, [
        ['overflow-y', 'auto'],
        ['overflow-x', 'hidden'],
        ['overscroll-behavior', 'contain'],
        ['background-color', 'var(--nodeValueBase)'],
        ['flex-grow', '1'],
    ]);
}


/***/ }),

/***/ "./ts/modal/body/data/consts.ts":
/*!**************************************!*\
  !*** ./ts/modal/body/data/consts.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ROOT_ID: () => (/* binding */ ROOT_ID)
/* harmony export */ });
const ROOT_ID = 'root-data';


/***/ }),

/***/ "./ts/modal/body/data/index.ts":
/*!*************************************!*\
  !*** ./ts/modal/body/data/index.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate),
/* harmony export */   getRoot: () => (/* binding */ getRoot),
/* harmony export */   getSaveData: () => (/* binding */ getSaveData),
/* harmony export */   setTree: () => (/* binding */ setTree)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/data/consts.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../index */ "./ts/modal/body/index.ts");


function getRoot() {
    return _index__WEBPACK_IMPORTED_MODULE_1__.ROOTS[_consts__WEBPACK_IMPORTED_MODULE_0__.ROOT_ID];
}
function getSaveData() {
    const { tree, config } = getRoot().getSaveData();
    return { tree, config };
}
function setTree(data) {
    const root = getRoot();
    // Spread avoids looping on a shrinking array
    for (const child of [...root.children]) {
        child.disconnect();
    }
    root.addChildren(data.children);
}
function generate(data) {
    return (0,_index__WEBPACK_IMPORTED_MODULE_1__.generateTree)(data, _consts__WEBPACK_IMPORTED_MODULE_0__.ROOT_ID);
}


/***/ }),

/***/ "./ts/modal/body/index.ts":
/*!********************************!*\
  !*** ./ts/modal/body/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ROOTS: () => (/* binding */ ROOTS),
/* harmony export */   "default": () => (/* binding */ generate),
/* harmony export */   element: () => (/* binding */ element),
/* harmony export */   generateTree: () => (/* binding */ generateTree),
/* harmony export */   reset: () => (/* binding */ reset),
/* harmony export */   setActive: () => (/* binding */ setActive)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./css */ "./ts/modal/body/css.ts");
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style */ "./ts/modal/body/style/index.ts");
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./data */ "./ts/modal/body/data/index.ts");
/* harmony import */ var _nodes_actions_highlight__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nodes/actions/highlight */ "./ts/modal/body/nodes/actions/highlight/index.ts");
/* harmony import */ var _nodes_actions_active__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./nodes/actions/active */ "./ts/modal/body/nodes/actions/active.ts");
/* harmony import */ var _nodes_actions_history__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./nodes/actions/history */ "./ts/modal/body/nodes/actions/history.ts");
/* harmony import */ var _nodes_root__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./nodes/root */ "./ts/modal/body/nodes/root.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../consts */ "./ts/modal/consts.ts");
/* harmony import */ var _modal_header_actions_sticky_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/modal/header/actions/sticky/css */ "./ts/modal/header/actions/sticky/css.ts");










const ROOTS = {};
const element = document.createElement('div');
let resetTree;
function setActive(button, actionId, doActivate = true) {
    if (doActivate) {
        button.classList.add(_consts__WEBPACK_IMPORTED_MODULE_8__.BUTTON_ACTIVE_CLASS);
        element.classList.add(actionId);
    }
    else {
        button.classList.remove(_consts__WEBPACK_IMPORTED_MODULE_8__.BUTTON_ACTIVE_CLASS);
        element.classList.remove(actionId);
    }
}
function generateTree(data, id) {
    if (ROOTS[id]) {
        throw new Error(`Attempted to instantiate second tree with id '${id}'.`);
    }
    const root = new _nodes_root__WEBPACK_IMPORTED_MODULE_7__["default"](data);
    root.element.elementContainer.id = id;
    ROOTS[id] = root;
    return root.element.elementContainer;
}
function generate({ userTree, defaultTree, userStyles, defaultStyle }) {
    resetTree = defaultTree;
    (0,_css__WEBPACK_IMPORTED_MODULE_1__["default"])();
    element.id = _consts__WEBPACK_IMPORTED_MODULE_0__.MODAL_BODY_ID;
    // avoid blurring an input when dragging the scrollbar
    element.addEventListener('mousedown', (event) => {
        event.stopPropagation();
        event.preventDefault();
    });
    element.append((0,_style__WEBPACK_IMPORTED_MODULE_2__["default"])(userStyles, defaultStyle), (0,_data__WEBPACK_IMPORTED_MODULE_3__["default"])(userTree !== null && userTree !== void 0 ? userTree : defaultTree));
    (0,_nodes_actions_highlight__WEBPACK_IMPORTED_MODULE_4__.onMount)();
    (0,_nodes_actions_active__WEBPACK_IMPORTED_MODULE_5__.onMount)();
    (0,_nodes_actions_history__WEBPACK_IMPORTED_MODULE_6__.onMount)();
    (0,_modal_header_actions_sticky_css__WEBPACK_IMPORTED_MODULE_9__["default"])(ROOTS);
    return element;
}
function reset() {
    (0,_data__WEBPACK_IMPORTED_MODULE_3__.setTree)(resetTree);
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/active.ts":
/*!***********************************************!*\
  !*** ./ts/modal/body/nodes/actions/active.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   onMount: () => (/* binding */ onMount),
/* harmony export */   reset: () => (/* binding */ reset)
/* harmony export */ });
/* harmony import */ var _highlight__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./highlight */ "./ts/modal/body/nodes/actions/highlight/index.ts");
/* harmony import */ var _focus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./focus */ "./ts/modal/body/nodes/actions/focus/index.ts");
/* harmony import */ var _buttons_position__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./buttons/position */ "./ts/modal/body/nodes/actions/buttons/position/index.ts");
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modal */ "./ts/modal/index.ts");




function reset() {
    for (const action of [_buttons_position__WEBPACK_IMPORTED_MODULE_2__, _focus__WEBPACK_IMPORTED_MODULE_1__, _highlight__WEBPACK_IMPORTED_MODULE_0__]) {
        if (action.isActive()) {
            action.reset();
            return true;
        }
    }
    return false;
}
function onMount() {
    (0,_modal__WEBPACK_IMPORTED_MODULE_3__.getSocket)().addEventListener('keydown', (event) => {
        if ((event.key === 'Escape' || event.key === 'Backspace') && reset()) {
            event.stopImmediatePropagation();
        }
    });
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/button.ts":
/*!*******************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/button.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addActionButton: () => (/* binding */ addActionButton),
/* harmony export */   getNewButton: () => (/* binding */ getNewButton)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/consts.ts");
/* harmony import */ var _overlays_tooltip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../overlays/tooltip */ "./ts/modal/body/nodes/actions/overlays/tooltip/index.ts");
/* harmony import */ var _overlays__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../overlays */ "./ts/modal/body/nodes/actions/overlays/index.ts");
/* harmony import */ var _overlays_tooltip_consts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../overlays/tooltip/consts */ "./ts/modal/body/nodes/actions/overlays/tooltip/consts.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");
/* harmony import */ var _modal_header_actions_alternate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/modal/header/actions/alternate */ "./ts/modal/header/actions/alternate/index.ts");
/* harmony import */ var _predicate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/predicate */ "./ts/predicate.ts");







// Creates an instantiation & adds it to the DOM
function addActionButton(template, onClick, node) {
    const button = template.cloneNode(true);
    button.addEventListener('click', (event) => {
        event.stopPropagation();
        if ((0,_predicate__WEBPACK_IMPORTED_MODULE_6__.isUnresolved)()) {
            (0,_overlays__WEBPACK_IMPORTED_MODULE_2__.showTooltip)(_overlays_tooltip_consts__WEBPACK_IMPORTED_MODULE_3__.MESSAGE_UNRESOLVED, node, button.querySelector('circle'));
            return;
        }
        (0,_overlays_tooltip__WEBPACK_IMPORTED_MODULE_1__.kill)();
        if (event.ctrlKey) {
            (0,_modal_header_actions_alternate__WEBPACK_IMPORTED_MODULE_5__.doAction)(true);
            onClick(node, button, (0,_modal_header_actions_alternate__WEBPACK_IMPORTED_MODULE_5__.isActive)());
        }
        else {
            onClick(node, button, (0,_modal_header_actions_alternate__WEBPACK_IMPORTED_MODULE_5__.isActive)());
        }
    });
    button.addEventListener('keydown', (event) => {
        // Prevent button presses via the Enter key from triggering actions
        if (event.key === 'Enter') {
            event.stopPropagation();
        }
    });
    button.addEventListener('mouseleave', () => {
        button.blur();
    });
    node.element.addButton(button);
    return button;
}
// Creates a template
const getNewButton = (function () {
    const buttonTemplate = document.createElement('button');
    buttonTemplate.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS);
    // Prevent tabbing to buttons until node is focused
    buttonTemplate.setAttribute('tabindex', '-1');
    const svgTemplate = (() => {
        const circle = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_4__.SVG_NAMESPACE, 'circle');
        circle.setAttribute('r', '50');
        circle.setAttribute('stroke-width', '10');
        const svg = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_4__.SVG_NAMESPACE, 'svg');
        svg.setAttribute('viewBox', '-70 -70 140 140');
        svg.append(circle);
        return svg;
    })();
    return function (group, actionId, description) {
        const button = buttonTemplate.cloneNode(true);
        const svg = svgTemplate.cloneNode(true);
        button.classList.add(actionId);
        button.title = description;
        svg.append(group);
        button.append(svg);
        return button;
    };
})();


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/consts.ts":
/*!*******************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/consts.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALT_CLASS: () => (/* binding */ ALT_CLASS),
/* harmony export */   BUTTON_CLASS: () => (/* binding */ BUTTON_CLASS),
/* harmony export */   TEST_ADD_CLASS: () => (/* binding */ TEST_ADD_CLASS),
/* harmony export */   TEST_REMOVE_CLASS: () => (/* binding */ TEST_REMOVE_CLASS)
/* harmony export */ });
const BUTTON_CLASS = 'node-button';
const ALT_CLASS = 'node-icon-alt';
const TEST_ADD_CLASS = 'node-test-add';
const TEST_REMOVE_CLASS = 'node-test-remove';


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/create/button.ts":
/*!**************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/create/button.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/create/consts.ts");
/* harmony import */ var _position_button_alt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../position/button/alt */ "./ts/modal/body/nodes/actions/buttons/position/button/alt.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");



const lineHorizontal = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'line');
lineHorizontal.setAttribute('stroke-linecap', 'round');
lineHorizontal.setAttribute('stroke-width', '12');
lineHorizontal.setAttribute('x1', '-25');
lineHorizontal.setAttribute('x2', '25');
const lineVertical = lineHorizontal.cloneNode(true);
lineVertical.setAttribute('transform', 'rotate(90)');
const g = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'g');
g.append(lineHorizontal, lineVertical);
const BUTTON = (0,_position_button_alt__WEBPACK_IMPORTED_MODULE_1__.getPositionedButton)(g, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, 'Create', { scale: '1 1.15' });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BUTTON);


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/create/consts.ts":
/*!**************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/create/consts.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTION_ID: () => (/* binding */ ACTION_ID)
/* harmony export */ });
const ACTION_ID = 'node-create';


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/create/css.ts":
/*!***********************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/create/css.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/create/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css */ "./ts/modal/body/nodes/actions/buttons/css.ts");


function generate() {
    (0,_css__WEBPACK_IMPORTED_MODULE_1__.addColourRule)(_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, '--nodeButtonCreate');
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/create/index.ts":
/*!*************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/create/index.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mount: () => (/* binding */ mount),
/* harmony export */   shouldMount: () => (/* binding */ shouldMount)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/create/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./button */ "./ts/modal/body/nodes/actions/buttons/create/button.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../consts */ "./ts/modal/body/nodes/actions/buttons/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../button */ "./ts/modal/body/nodes/actions/buttons/button.ts");
/* harmony import */ var _position__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../position */ "./ts/modal/body/nodes/actions/buttons/position/index.ts");
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../history */ "./ts/modal/body/nodes/actions/history.ts");
/* harmony import */ var _callbacks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../callbacks */ "./ts/modal/body/nodes/actions/callbacks/index.ts");
/* harmony import */ var _overlays__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../overlays */ "./ts/modal/body/nodes/actions/overlays/index.ts");
/* harmony import */ var _nodes_child__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @nodes/child */ "./ts/modal/body/nodes/child.ts");
/* harmony import */ var _nodes_middle__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @nodes/middle */ "./ts/modal/body/nodes/middle.ts");










function getChild(node) {
    const { seed } = node;
    const child = 'children' in seed ? new _nodes_middle__WEBPACK_IMPORTED_MODULE_9__["default"](seed, node, 0) : new _nodes_child__WEBPACK_IMPORTED_MODULE_8__["default"](seed, node, 0);
    child.element.addClass(_consts__WEBPACK_IMPORTED_MODULE_2__.TEST_ADD_CLASS);
    return child;
}
function redo(child, ancestors) {
    child.disconnect();
    _callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].update.triggerSub(ancestors);
}
function undo(child, parent, index, ancestors) {
    child.attach(child, parent, index);
    _callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].update.triggerSub(ancestors);
}
function validate(child, target, button, index) {
    const ancestors = child.getAncestors();
    return Promise.all(_callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].predicate.getSub(ancestors))
        .then(() => {
        _history__WEBPACK_IMPORTED_MODULE_5__.register(child, redo.bind(null, child, ancestors), undo.bind(null, child, child.parent, index, ancestors), false, true);
        child.element.removeClass(_consts__WEBPACK_IMPORTED_MODULE_2__.TEST_ADD_CLASS);
        _callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].update.triggerSub(ancestors);
        return child;
    })
        .catch((reason) => {
        child.disconnect();
        if (reason) {
            (0,_overlays__WEBPACK_IMPORTED_MODULE_7__.showTooltip)(reason, target, button.querySelector('circle'));
        }
    });
}
function doAction(source, target, button, index) {
    const child = getChild(source);
    child.move(index === 0 ? target : target.parent, index);
    return validate(child, target, button, index);
}
function onClick(node, button, isAlt) {
    if (_position__WEBPACK_IMPORTED_MODULE_4__.isToggle(node, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID)) {
        _position__WEBPACK_IMPORTED_MODULE_4__.reset(node);
        return;
    }
    if (isAlt) {
        _position__WEBPACK_IMPORTED_MODULE_4__.mount(node, node.seed, node, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, button, doAction);
        return;
    }
    validate(getChild(node), node, button, 0);
}
function mount(node) {
    (0,_button__WEBPACK_IMPORTED_MODULE_3__.addActionButton)(_button__WEBPACK_IMPORTED_MODULE_1__["default"], onClick, node);
}
function shouldMount(node) {
    return 'seed' in node;
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/css.ts":
/*!****************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/css.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addColourRule: () => (/* binding */ addColourRule),
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/consts.ts");
/* harmony import */ var _create_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./create/css */ "./ts/modal/body/nodes/actions/buttons/create/css.ts");
/* harmony import */ var _move_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./move/css */ "./ts/modal/body/nodes/actions/buttons/move/css.ts");
/* harmony import */ var _disable_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./disable/css */ "./ts/modal/body/nodes/actions/buttons/disable/css.ts");
/* harmony import */ var _duplicate_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./duplicate/css */ "./ts/modal/body/nodes/actions/buttons/duplicate/css.ts");
/* harmony import */ var _position_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./position/css */ "./ts/modal/body/nodes/actions/buttons/position/css.ts");
/* harmony import */ var _highlight_consts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../highlight/consts */ "./ts/modal/body/nodes/actions/highlight/consts.ts");
/* harmony import */ var _nodes_consts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @nodes/consts */ "./ts/modal/body/nodes/consts.ts");
/* harmony import */ var _modal_header_actions_alternate_consts__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/modal/header/actions/alternate/consts */ "./ts/modal/header/actions/alternate/consts.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");











function addColourRule(actionId, strokeVar) {
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_10__.addRule)([
        `.${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${_highlight_consts__WEBPACK_IMPORTED_MODULE_6__.HIGHLIGHT_CLASS}) > `
            + `.${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.HEAD_CONTAINER} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.BUTTON_CONTAINER} > `
            + `.${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}.${actionId} > svg`,
    ], ['fill', `var(${strokeVar})`]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_10__.addRule)(`.${_highlight_consts__WEBPACK_IMPORTED_MODULE_6__.HIGHLIGHT_CLASS} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.HEAD_CONTAINER} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.BUTTON_CONTAINER} > `
        + `.${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}.${actionId}.${_modal_consts__WEBPACK_IMPORTED_MODULE_9__.BUTTON_ACTIVE_CLASS} > svg > g`, ['stroke', `var(${strokeVar})`]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_10__.addRule)([
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}.${actionId}.${_modal_consts__WEBPACK_IMPORTED_MODULE_9__.BUTTON_ACTIVE_CLASS}:hover > svg > circle`,
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}.${actionId}.${_modal_consts__WEBPACK_IMPORTED_MODULE_9__.BUTTON_ACTIVE_CLASS}:focus > svg > circle`,
    ], ['stroke', `var(${strokeVar})`]);
}
function generate() {
    (0,_create_css__WEBPACK_IMPORTED_MODULE_1__["default"])();
    (0,_move_css__WEBPACK_IMPORTED_MODULE_2__["default"])();
    (0,_disable_css__WEBPACK_IMPORTED_MODULE_3__["default"])();
    (0,_duplicate_css__WEBPACK_IMPORTED_MODULE_4__["default"])();
    (0,_position_css__WEBPACK_IMPORTED_MODULE_5__["default"])();
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_10__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}`, [
        ['height', '100%'],
        ['position', 'relative'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_10__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS} > svg`, [
        ['height', '100%'],
        ['transform', 'scale(1.05)'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_10__.addRule)(`.${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.BUTTON_CONTAINER}`, [
        ['white-space', 'nowrap'],
        ['z-index', '1'],
    ]);
    // Hide prospective nodes
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_10__.addRule)([
        `.${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.ELEMENT_CONTAINER}.${_consts__WEBPACK_IMPORTED_MODULE_0__.TEST_ADD_CLASS}`,
        `.${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.ELEMENT_CONTAINER}.${_consts__WEBPACK_IMPORTED_MODULE_0__.TEST_REMOVE_CLASS}`,
    ], [['pointer-events', 'none']]);
    // Hide alt icon components
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_10__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ALT_CLASS}:not(.${_modal_header_actions_alternate_consts__WEBPACK_IMPORTED_MODULE_8__.ACTION_ID} *)`, ['display', 'none']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_10__.addRule)(`.${_modal_header_actions_alternate_consts__WEBPACK_IMPORTED_MODULE_8__.ACTION_ID} button.${_consts__WEBPACK_IMPORTED_MODULE_0__.ALT_CLASS} + *`, ['display', 'none']);
    for (const [selector, base, contrast] of _nodes_consts__WEBPACK_IMPORTED_MODULE_7__.NODE_COLOURS) {
        const buttonSelector = `${selector} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.HEAD_CONTAINER} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.BUTTON_CONTAINER}`;
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_10__.addRule)(`.${_highlight_consts__WEBPACK_IMPORTED_MODULE_6__.HIGHLIGHT_CLASS}${buttonSelector} > .${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}:not(.${_modal_consts__WEBPACK_IMPORTED_MODULE_9__.BUTTON_ACTIVE_CLASS}):not(:focus):not(:hover) > svg > g`, ['stroke', base]);
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_10__.addRule)(`${buttonSelector} > .${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}:not(.${_modal_consts__WEBPACK_IMPORTED_MODULE_9__.BUTTON_ACTIVE_CLASS}:hover):not(.${_modal_consts__WEBPACK_IMPORTED_MODULE_9__.BUTTON_ACTIVE_CLASS}:focus) > svg > circle`, ['stroke', base]);
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_10__.addRule)([
            // Not active, focused
            `${buttonSelector} > .${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}:focus > svg > g`,
            `${buttonSelector} > .${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}:hover > svg > g`,
        ], [['stroke', contrast]]);
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_10__.addRule)([`${buttonSelector} > .${_modal_consts__WEBPACK_IMPORTED_MODULE_9__.BUTTON_ACTIVE_CLASS} > svg`], [['stroke', base]]);
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_10__.addRule)([
            // Not active, focused
            `${buttonSelector} > .${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}:focus > svg`,
            `${buttonSelector} > .${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}:hover > svg`,
            `.${_highlight_consts__WEBPACK_IMPORTED_MODULE_6__.HIGHLIGHT_CLASS}${buttonSelector} > .${_modal_consts__WEBPACK_IMPORTED_MODULE_9__.BUTTON_ACTIVE_CLASS} > svg`,
        ], [['fill', base]]);
    }
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/disable/button.ts":
/*!***************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/disable/button.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUTTON_ALT: () => (/* binding */ BUTTON_ALT),
/* harmony export */   BUTTON_DEFAULT: () => (/* binding */ BUTTON_DEFAULT)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/disable/consts.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../consts */ "./ts/modal/body/nodes/actions/buttons/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../button */ "./ts/modal/body/nodes/actions/buttons/button.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");




const gDefault = (() => {
    const circle = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_3__.SVG_NAMESPACE, 'circle');
    circle.setAttribute('r', '30');
    circle.setAttribute('stroke-width', '10');
    const line = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_3__.SVG_NAMESPACE, 'line');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('stroke-width', '10');
    line.setAttribute('x1', '-30');
    line.setAttribute('x2', '30');
    line.setAttribute('transform', 'rotate(45)');
    const g = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_3__.SVG_NAMESPACE, 'g');
    g.append(circle, line);
    return g;
})();
const BUTTON_DEFAULT = (0,_button__WEBPACK_IMPORTED_MODULE_2__.getNewButton)(gDefault, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID_DEFAULT, 'Toggle Enabled');
const gAlt = (() => {
    const line0 = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_3__.SVG_NAMESPACE, 'line');
    line0.setAttribute('stroke-linecap', 'round');
    line0.setAttribute('stroke-width', '12');
    line0.setAttribute('x1', '-20');
    line0.setAttribute('x2', '20');
    line0.setAttribute('y1', '-20');
    line0.setAttribute('y2', '20');
    const line1 = line0.cloneNode(true);
    line1.setAttribute('transform', 'rotate(90)');
    const g = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_3__.SVG_NAMESPACE, 'g');
    g.append(line0, line1);
    return g;
})();
const BUTTON_ALT = (0,_button__WEBPACK_IMPORTED_MODULE_2__.getNewButton)(gAlt, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID_ALT, 'Delete');
BUTTON_ALT.classList.add(_consts__WEBPACK_IMPORTED_MODULE_1__.ALT_CLASS);


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/disable/consts.ts":
/*!***************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/disable/consts.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTION_ID_ALT: () => (/* binding */ ACTION_ID_ALT),
/* harmony export */   ACTION_ID_DEFAULT: () => (/* binding */ ACTION_ID_DEFAULT),
/* harmony export */   DISABLED_CLASS: () => (/* binding */ DISABLED_CLASS)
/* harmony export */ });
const ACTION_ID_DEFAULT = 'node-active';
const ACTION_ID_ALT = 'node-delete';
const DISABLED_CLASS = 'node-disable';


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/disable/css.ts":
/*!************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/disable/css.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/disable/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css */ "./ts/modal/body/nodes/actions/buttons/css.ts");
/* harmony import */ var _nodes_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nodes/consts */ "./ts/modal/body/nodes/consts.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");




function generate() {
    (0,_css__WEBPACK_IMPORTED_MODULE_1__.addColourRule)(_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID_DEFAULT, '--nodeButtonDisable');
    (0,_css__WEBPACK_IMPORTED_MODULE_1__.addColourRule)(_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID_ALT, '--nodeButtonDelete');
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)([
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.DISABLED_CLASS} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.BASE_CLASS} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.VALUE}`,
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.DISABLED_CLASS} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.BASE_CLASS} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.LABEL}`,
    ], ['opacity', '0.5']);
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/disable/index.ts":
/*!**************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/disable/index.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mount: () => (/* binding */ mount),
/* harmony export */   shouldMount: () => (/* binding */ shouldMount)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/disable/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./button */ "./ts/modal/body/nodes/actions/buttons/disable/button.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../button */ "./ts/modal/body/nodes/actions/buttons/button.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../consts */ "./ts/modal/body/nodes/actions/buttons/consts.ts");
/* harmony import */ var _position__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../position */ "./ts/modal/body/nodes/actions/buttons/position/index.ts");
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../history */ "./ts/modal/body/nodes/actions/history.ts");
/* harmony import */ var _callbacks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../callbacks */ "./ts/modal/body/nodes/actions/callbacks/index.ts");
/* harmony import */ var _overlays__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../overlays */ "./ts/modal/body/nodes/actions/overlays/index.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");









function updateButton(button, isActive) {
    button.classList[isActive ? 'remove' : 'add'](_modal_consts__WEBPACK_IMPORTED_MODULE_8__.BUTTON_ACTIVE_CLASS);
}
function toggle(node) {
    node.element[`${node.isActive ? 'add' : 'remove'}Class`](_consts__WEBPACK_IMPORTED_MODULE_0__.DISABLED_CLASS);
    node.isActive = !node.isActive;
}
function undo(node, parent, index, ancestors) {
    node.attach(parent, index);
    _callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].update.triggerSub(ancestors);
}
function redo(node, ancestors) {
    node.disconnect();
    _callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].update.triggerSub(ancestors);
}
function onClick(node, button, isAlt) {
    if (isAlt) {
        node.element.addClass(_consts__WEBPACK_IMPORTED_MODULE_3__.TEST_REMOVE_CLASS);
        _position__WEBPACK_IMPORTED_MODULE_4__.reset(node);
    }
    else {
        toggle(node);
    }
    const ancestors = node.getAncestors();
    Promise.all(_callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].predicate.getSub(ancestors))
        .then(() => {
        node.element.removeClass(_consts__WEBPACK_IMPORTED_MODULE_3__.TEST_REMOVE_CLASS);
        if (isAlt) {
            _history__WEBPACK_IMPORTED_MODULE_5__.register(node, undo.bind(null, node, node.parent, node.getIndex(), ancestors), redo.bind(null, node, ancestors), true, false, true);
        }
        else {
            const act = () => {
                toggle(node);
                updateButton(button, node.isActive);
                _callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].update.triggerSub(ancestors);
            };
            _history__WEBPACK_IMPORTED_MODULE_5__.register(node, act, act, false);
            updateButton(button, node.isActive);
        }
        _callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].update.triggerSub(ancestors);
    })
        .catch((reason) => {
        if (isAlt) {
            node.element.removeClass(_consts__WEBPACK_IMPORTED_MODULE_3__.TEST_REMOVE_CLASS);
        }
        else {
            toggle(node);
        }
        if (typeof reason === 'string') {
            (0,_overlays__WEBPACK_IMPORTED_MODULE_7__.showTooltip)(reason, node, button.querySelector('circle'));
        }
    });
}
function mount(node) {
    (0,_button__WEBPACK_IMPORTED_MODULE_2__.addActionButton)(_button__WEBPACK_IMPORTED_MODULE_1__.BUTTON_ALT, onClick, node);
    const defaultButton = (0,_button__WEBPACK_IMPORTED_MODULE_2__.addActionButton)(_button__WEBPACK_IMPORTED_MODULE_1__.BUTTON_DEFAULT, onClick, node);
    if (!node.isActive) {
        node.element.addClass(_consts__WEBPACK_IMPORTED_MODULE_0__.DISABLED_CLASS);
        updateButton(defaultButton, false);
    }
}
function shouldMount(node) {
    return 'seed' in node.parent;
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/duplicate/button.ts":
/*!*****************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/duplicate/button.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/duplicate/consts.ts");
/* harmony import */ var _position_button_alt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../position/button/alt */ "./ts/modal/body/nodes/actions/buttons/position/button/alt.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");



const RADIUS = 15;
const HEIGHT = 25;
const WIDTH = 10;
const outline0 = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'path');
outline0.setAttribute('stroke-linecap', 'round');
outline0.setAttribute('stroke-width', '8');
outline0.setAttribute('fill', 'none');
outline0.setAttribute('d', `M ${WIDTH / 2 + RADIUS} ${-HEIGHT / 2}`
    + `q 0 -${RADIUS} -${RADIUS} -${RADIUS}`
    + `h -${WIDTH}`
    + `q -${RADIUS} 0 -${RADIUS} ${RADIUS}`
    + `v ${HEIGHT}`
    + `q 0 ${RADIUS} ${RADIUS} ${RADIUS}`);
outline0.setAttribute('transform', `translate(-${RADIUS / 2}, -${RADIUS / 2})`);
const outline1 = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'path');
outline1.setAttribute('stroke-linecap', 'round');
outline1.setAttribute('stroke-width', '8');
outline1.setAttribute('fill', 'none');
outline1.setAttribute('d', `M ${WIDTH / 2 + RADIUS} ${-HEIGHT / 2}`
    + `q 0 -${RADIUS} -${RADIUS} -${RADIUS}`
    + `h -${WIDTH}`
    + `q -${RADIUS} 0 -${RADIUS} ${RADIUS}`
    + `v ${HEIGHT}`
    + `q 0 ${RADIUS} ${RADIUS} ${RADIUS}`
    + `h ${WIDTH}`
    + `q ${RADIUS} 0 ${RADIUS} -${RADIUS}`
    + `v -${HEIGHT}`);
outline1.setAttribute('transform', `translate(${RADIUS / 2}, ${RADIUS / 2})`);
const g = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'g');
g.setAttribute('transform', `rotate(10)`);
g.append(outline0, outline1);
const BUTTON = (0,_position_button_alt__WEBPACK_IMPORTED_MODULE_1__.getPositionedButton)(g, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, 'Duplicate', { scale: 0.6, translate: '10 16', rotate: 10 });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BUTTON);


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/duplicate/consts.ts":
/*!*****************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/duplicate/consts.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTION_ID: () => (/* binding */ ACTION_ID)
/* harmony export */ });
const ACTION_ID = 'node-copy';


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/duplicate/css.ts":
/*!**************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/duplicate/css.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/duplicate/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css */ "./ts/modal/body/nodes/actions/buttons/css.ts");


function generate() {
    (0,_css__WEBPACK_IMPORTED_MODULE_1__.addColourRule)(_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, '--nodeButtonDuplicate');
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/duplicate/index.ts":
/*!****************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/duplicate/index.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mount: () => (/* binding */ mount),
/* harmony export */   shouldMount: () => (/* binding */ shouldMount)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/duplicate/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./button */ "./ts/modal/body/nodes/actions/buttons/duplicate/button.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../consts */ "./ts/modal/body/nodes/actions/buttons/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../button */ "./ts/modal/body/nodes/actions/buttons/button.ts");
/* harmony import */ var _position__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../position */ "./ts/modal/body/nodes/actions/buttons/position/index.ts");
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../history */ "./ts/modal/body/nodes/actions/history.ts");
/* harmony import */ var _callbacks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../callbacks */ "./ts/modal/body/nodes/actions/callbacks/index.ts");
/* harmony import */ var _overlays__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../overlays */ "./ts/modal/body/nodes/actions/overlays/index.ts");








function undo(node, ancestors) {
    node.disconnect();
    _callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].update.triggerSub(ancestors);
}
function redo(node, parent, index, ancestors) {
    node.attach(parent, index);
    _callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].update.triggerSub(ancestors);
}
function validate(copy, target, button, index) {
    const ancestors = copy.getAncestors();
    return Promise.all(_callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].predicate.getSub(ancestors))
        .then(() => {
        _history__WEBPACK_IMPORTED_MODULE_5__.register(copy, undo.bind(null, copy, ancestors), redo.bind(null, copy, copy.parent, index, ancestors), false, true);
        copy.element.removeClass(_consts__WEBPACK_IMPORTED_MODULE_2__.TEST_ADD_CLASS);
        _callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].update.triggerSub(ancestors);
        return copy;
    })
        .catch((reason) => {
        copy.disconnect();
        if (reason) {
            (0,_overlays__WEBPACK_IMPORTED_MODULE_7__.showTooltip)(reason, target, button.querySelector('circle'));
        }
    });
}
function getCopy(node) {
    const copy = node.duplicate();
    copy.element.addClass(_consts__WEBPACK_IMPORTED_MODULE_2__.TEST_ADD_CLASS);
    return copy;
}
function doAction(source, target, button, index) {
    const copy = getCopy(source);
    copy.move(index === 0 ? target : target.parent, index);
    return validate(copy, target, button, index);
}
function onClick(node, button, isAlt) {
    if (_position__WEBPACK_IMPORTED_MODULE_4__.isToggle(node, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID)) {
        _position__WEBPACK_IMPORTED_MODULE_4__.reset(node);
        return;
    }
    if (isAlt) {
        _position__WEBPACK_IMPORTED_MODULE_4__.mount(node, node, node.parent, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, button, doAction);
        return;
    }
    const copy = getCopy(node);
    validate(copy, node, button, copy.getIndex());
}
function mount(node) {
    (0,_button__WEBPACK_IMPORTED_MODULE_3__.addActionButton)(_button__WEBPACK_IMPORTED_MODULE_1__["default"], onClick, node);
}
function shouldMount(node) {
    return 'seed' in node.parent;
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/move/button.ts":
/*!************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/move/button.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/move/consts.ts");
/* harmony import */ var _position_button_alt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../position/button/alt */ "./ts/modal/body/nodes/actions/buttons/position/button/alt.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");



const arrowTrunk = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'line');
arrowTrunk.setAttribute('stroke-linecap', 'round');
arrowTrunk.setAttribute('stroke-width', '10');
arrowTrunk.setAttribute('y1', '-30');
arrowTrunk.setAttribute('y2', '30');
const arrowBottomLeft = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'line');
arrowBottomLeft.setAttribute('stroke-linecap', 'round');
arrowBottomLeft.setAttribute('stroke-width', '10');
arrowBottomLeft.setAttribute('x2', '-12');
arrowBottomLeft.setAttribute('y1', '27');
arrowBottomLeft.setAttribute('y2', '15');
const arrowBottomRight = arrowBottomLeft.cloneNode(true);
arrowBottomRight.setAttribute('x2', '12');
const g = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'g');
g.append(arrowTrunk, arrowBottomLeft, arrowBottomRight);
const BUTTON = (0,_position_button_alt__WEBPACK_IMPORTED_MODULE_1__.getPositionedButton)(g, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, 'Move');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BUTTON);


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/move/consts.ts":
/*!************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/move/consts.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTION_ID: () => (/* binding */ ACTION_ID)
/* harmony export */ });
const ACTION_ID = 'node-move';


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/move/css.ts":
/*!*********************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/move/css.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/move/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css */ "./ts/modal/body/nodes/actions/buttons/css.ts");


function generate() {
    (0,_css__WEBPACK_IMPORTED_MODULE_1__.addColourRule)(_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, '--nodeButtonMove');
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/move/index.ts":
/*!***********************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/move/index.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mount: () => (/* binding */ mount),
/* harmony export */   shouldMount: () => (/* binding */ shouldMount)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/move/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./button */ "./ts/modal/body/nodes/actions/buttons/move/button.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../consts */ "./ts/modal/body/nodes/actions/buttons/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../button */ "./ts/modal/body/nodes/actions/buttons/button.ts");
/* harmony import */ var _position__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../position */ "./ts/modal/body/nodes/actions/buttons/position/index.ts");
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../history */ "./ts/modal/body/nodes/actions/history.ts");
/* harmony import */ var _callbacks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../callbacks */ "./ts/modal/body/nodes/actions/callbacks/index.ts");
/* harmony import */ var _overlays__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../overlays */ "./ts/modal/body/nodes/actions/overlays/index.ts");
/* harmony import */ var _nodes_pools__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @nodes/pools */ "./ts/modal/body/nodes/pools.ts");









function getAncestorBranches(node, temp) {
    if (node.parent === temp.parent) {
        return [node.getAncestors()];
    }
    const oldAncestors = node.getAncestors();
    const newAncestors = temp.getAncestors();
    for (let i = Math.min(oldAncestors.length, newAncestors.length) - 1; i > 1; --i) {
        if (oldAncestors[oldAncestors.length - i] === newAncestors[newAncestors.length - i]) {
            return [oldAncestors.slice(0, -i), newAncestors];
        }
    }
    // Branch is from the root
    return [oldAncestors.slice(0, -1), newAncestors];
}
function act(node, to, index, ancestorBranches) {
    node.move(to, index);
    for (const branch of ancestorBranches) {
        _callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].update.triggerSub(branch);
    }
}
function doAction(source, target, button, index) {
    const priorIndex = source.getIndex();
    if (index === priorIndex) {
        return source;
    }
    const temp = source.duplicate();
    source.element.addClass(_consts__WEBPACK_IMPORTED_MODULE_2__.TEST_REMOVE_CLASS);
    temp.element.addClass(_consts__WEBPACK_IMPORTED_MODULE_2__.TEST_ADD_CLASS);
    temp.move(index === 0 ? target : target.parent, index);
    const ancestorBranches = getAncestorBranches(source, temp);
    return Promise.all(ancestorBranches.map((branch) => Promise.all(_callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].predicate.getSub(branch))))
        .then(() => {
        const priorParent = source.parent;
        source.move(index === 0 ? target : target.parent, index);
        _history__WEBPACK_IMPORTED_MODULE_5__.register(source, act.bind(null, source, priorParent, priorIndex, ancestorBranches), act.bind(null, source, source.parent, index, ancestorBranches));
        for (const branch of ancestorBranches) {
            _callbacks__WEBPACK_IMPORTED_MODULE_6__["default"].update.triggerSub(branch);
        }
        return source;
    })
        .catch((reason) => {
        if (reason) {
            (0,_overlays__WEBPACK_IMPORTED_MODULE_7__.showTooltip)(reason, source, button.querySelector('circle'));
        }
    })
        .finally(() => {
        temp.disconnect();
        source.element.removeClass(_consts__WEBPACK_IMPORTED_MODULE_2__.TEST_REMOVE_CLASS);
    });
}
function hasDestinations(node) {
    return node.parent.children.length > 1 || (0,_nodes_pools__WEBPACK_IMPORTED_MODULE_8__.get)(node.parent).length > 1;
}
function onClick(node, button, isAlt) {
    if (_position__WEBPACK_IMPORTED_MODULE_4__.isToggle(node, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID)) {
        _position__WEBPACK_IMPORTED_MODULE_4__.reset(node);
        return;
    }
    if (isAlt) {
        if (hasDestinations(node)) {
            _position__WEBPACK_IMPORTED_MODULE_4__.mount(node, node, node.parent, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, button, doAction);
        }
        else {
            (0,_overlays__WEBPACK_IMPORTED_MODULE_7__.showTooltip)('No other valid locations found.', node, button.querySelector('circle'));
        }
        return;
    }
    const newIndex = node.getIndex() + 2;
    if (newIndex < node.parent.children.length + 1) {
        doAction(node, node, button, newIndex);
    }
    else {
        (0,_overlays__WEBPACK_IMPORTED_MODULE_7__.showTooltip)('Node can not be moved down.', node, button.querySelector('circle'));
    }
}
function mount(node) {
    (0,_button__WEBPACK_IMPORTED_MODULE_3__.addActionButton)(_button__WEBPACK_IMPORTED_MODULE_1__["default"], onClick, node);
}
function shouldMount(node) {
    return Boolean(node.parent.seed) || ('poolId' in node.parent);
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/position/button/alt.ts":
/*!********************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/position/button/alt.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getPositionedButton: () => (/* binding */ getPositionedButton)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../consts */ "./ts/modal/body/nodes/actions/buttons/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../button */ "./ts/modal/body/nodes/actions/buttons/button.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");



const G_ALT = (() => {
    const arrowTrunk = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'line');
    arrowTrunk.setAttribute('stroke-linecap', 'round');
    arrowTrunk.setAttribute('stroke-width', '10');
    arrowTrunk.setAttribute('y1', '-30');
    arrowTrunk.setAttribute('y2', '30');
    const arrowBottomLeft = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'line');
    arrowBottomLeft.setAttribute('stroke-linecap', 'round');
    arrowBottomLeft.setAttribute('stroke-width', '10');
    arrowBottomLeft.setAttribute('x2', '-12');
    arrowBottomLeft.setAttribute('y1', '27');
    arrowBottomLeft.setAttribute('y2', '15');
    const arrowBottomRight = arrowBottomLeft.cloneNode(true);
    arrowBottomRight.setAttribute('x2', '12');
    const arrowTopRight = arrowBottomLeft.cloneNode(true);
    arrowTopRight.setAttribute('transform', 'rotate(180)');
    const arrowTopLeft = arrowBottomRight.cloneNode(true);
    arrowTopLeft.setAttribute('transform', 'rotate(180)');
    const g = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'g');
    g.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.ALT_CLASS);
    g.append(arrowTrunk, arrowBottomLeft, arrowBottomRight, arrowTopRight, arrowTopLeft);
    return g;
})();
function getPositionedButton(gDefault, actionId, description, transform = {}) {
    const g = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'g');
    const gAlt = G_ALT.cloneNode(true);
    gAlt.setAttribute('transform', Object.entries(transform).map(([key, value]) => `${key}(${value})`).join(' '));
    g.append(gAlt, gDefault);
    return (0,_button__WEBPACK_IMPORTED_MODULE_1__.getNewButton)(g, actionId, description);
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/position/button/index.ts":
/*!**********************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/position/button/index.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUTTON_PARENT: () => (/* binding */ BUTTON_PARENT),
/* harmony export */   BUTTON_SIBLING: () => (/* binding */ BUTTON_SIBLING)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../consts */ "./ts/modal/body/nodes/actions/buttons/position/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../button */ "./ts/modal/body/nodes/actions/buttons/button.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");



const arrowTrunk = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'line');
arrowTrunk.setAttribute('stroke-linecap', 'round');
arrowTrunk.setAttribute('stroke-width', '10');
arrowTrunk.setAttribute('y1', '-30');
arrowTrunk.setAttribute('y2', '30');
const arrowBottomLeft = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'line');
arrowBottomLeft.setAttribute('stroke-linecap', 'round');
arrowBottomLeft.setAttribute('stroke-width', '10');
arrowBottomLeft.setAttribute('x2', '-12');
arrowBottomLeft.setAttribute('y1', '27');
arrowBottomLeft.setAttribute('y2', '15');
const arrowBottomRight = arrowBottomLeft.cloneNode(true);
arrowBottomRight.setAttribute('x2', '12');
const gMain = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'g');
gMain.append(arrowTrunk, arrowBottomLeft, arrowBottomRight);
const gSibling = gMain.cloneNode(true);
const BUTTON_SIBLING = (0,_button__WEBPACK_IMPORTED_MODULE_1__.getNewButton)(gSibling, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, 'Select After');
const gParent = gMain.cloneNode(true);
gParent.setAttribute('transform', 'rotate(-45)');
const BUTTON_PARENT = (0,_button__WEBPACK_IMPORTED_MODULE_1__.getNewButton)(gParent, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, 'Select Into');


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/position/consts.ts":
/*!****************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/position/consts.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTION_ID: () => (/* binding */ ACTION_ID)
/* harmony export */ });
const ACTION_ID = 'node-position';


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/position/css.ts":
/*!*************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/position/css.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/position/consts.ts");
/* harmony import */ var _focus_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../focus/consts */ "./ts/modal/body/nodes/actions/focus/consts.ts");
/* harmony import */ var _nodes_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nodes/consts */ "./ts/modal/body/nodes/consts.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");





function generate() {
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_4__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ROOT_CLASS}.${_focus_consts__WEBPACK_IMPORTED_MODULE_1__.FOCUS_CLASS} `
        + `.${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${_focus_consts__WEBPACK_IMPORTED_MODULE_1__.FOCUS_CLASS})`, ['display', 'none']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_4__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID} button:not(.${_modal_consts__WEBPACK_IMPORTED_MODULE_3__.BUTTON_ACTIVE_CLASS})`, ['display', 'none']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_4__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID} .${_modal_consts__WEBPACK_IMPORTED_MODULE_3__.BUTTON_ACTIVE_CLASS}:not(:has(~ .${_modal_consts__WEBPACK_IMPORTED_MODULE_3__.BUTTON_ACTIVE_CLASS}))`, [
        ['border-top-right-radius', '0.8em'],
        ['border-bottom-right-radius', '0.8em'],
    ]);
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/buttons/position/index.ts":
/*!***************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/buttons/position/index.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getButton: () => (/* binding */ getButton),
/* harmony export */   isActive: () => (/* binding */ isActive),
/* harmony export */   isToggle: () => (/* binding */ isToggle),
/* harmony export */   mount: () => (/* binding */ mount),
/* harmony export */   reset: () => (/* binding */ reset)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/buttons/position/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./button */ "./ts/modal/body/nodes/actions/buttons/position/button/index.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../button */ "./ts/modal/body/nodes/actions/buttons/button.ts");
/* harmony import */ var _focus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../focus */ "./ts/modal/body/nodes/actions/focus/index.ts");
/* harmony import */ var _highlight__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../highlight */ "./ts/modal/body/nodes/actions/highlight/index.ts");
/* harmony import */ var _scroll__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../scroll */ "./ts/modal/body/nodes/actions/scroll.ts");
/* harmony import */ var _nodes_pools__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nodes/pools */ "./ts/modal/body/nodes/pools.ts");
/* harmony import */ var _modal_body__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/modal/body */ "./ts/modal/body/index.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};









const destinations = [];
let origin;
function isActive() {
    return Boolean(origin);
}
function isToggle(source, id) {
    return isActive() && origin.source === source && origin.actionId === id;
}
function setActive(doActivate = true) {
    (0,_modal_body__WEBPACK_IMPORTED_MODULE_7__.setActive)(origin.button, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, doActivate);
    (0,_focus__WEBPACK_IMPORTED_MODULE_3__.reset)();
    (0,_focus__WEBPACK_IMPORTED_MODULE_3__.focus)(doActivate, origin.source, false);
    (0,_focus__WEBPACK_IMPORTED_MODULE_3__.focusBranch)(doActivate, origin.source, doActivate);
    origin.button.setAttribute('tabindex', doActivate ? '0' : '-1');
}
function reset(scrollTarget) {
    if (!origin) {
        return;
    }
    for (const { node, isParent, button } of destinations) {
        (0,_focus__WEBPACK_IMPORTED_MODULE_3__.focusBranch)(false, node, isParent);
        button.remove();
    }
    destinations.length = 0;
    (0,_highlight__WEBPACK_IMPORTED_MODULE_4__.removeSustained)(origin.source);
    setActive(false);
    (0,_scroll__WEBPACK_IMPORTED_MODULE_5__.scroll)(scrollTarget !== null && scrollTarget !== void 0 ? scrollTarget : origin.source);
    (0,_highlight__WEBPACK_IMPORTED_MODULE_4__.setActive)(scrollTarget !== null && scrollTarget !== void 0 ? scrollTarget : origin.source, true);
    origin = undefined;
}
function getButton(node, actionId, onClick, isParent) {
    const button = (0,_button__WEBPACK_IMPORTED_MODULE_2__.addActionButton)(isParent ? _button__WEBPACK_IMPORTED_MODULE_1__.BUTTON_PARENT : _button__WEBPACK_IMPORTED_MODULE_1__.BUTTON_SIBLING, onClick, node);
    button.classList.add(actionId, _modal_consts__WEBPACK_IMPORTED_MODULE_8__.BUTTON_ACTIVE_CLASS);
    button.setAttribute('tabindex', '0');
    return button;
}
function getBoundCallback(callback, target, index) {
    return (_, button) => __awaiter(this, void 0, void 0, function* () {
        const node = yield callback(origin.source, target, button, index);
        if (node) {
            reset(node);
        }
    });
}
function addButtons(parent, actionId, callback) {
    (0,_focus__WEBPACK_IMPORTED_MODULE_3__.focusBranch)(true, parent);
    destinations.push({
        node: parent,
        isParent: true,
        button: getButton(parent, actionId, getBoundCallback(callback, parent, 0), true),
    });
    for (const [i, target] of parent.children.entries()) {
        if (target === origin.source) {
            continue;
        }
        (0,_focus__WEBPACK_IMPORTED_MODULE_3__.focusBranch)(true, target, false);
        destinations.push({
            node: target,
            isParent: false,
            button: getButton(target, actionId, getBoundCallback(callback, target, i + 1), false),
        });
    }
}
function mount(source, child, parent, actionId, button, callback) {
    reset();
    origin = {
        source,
        child,
        parent,
        button,
        actionId,
    };
    setActive();
    for (const pool of (0,_nodes_pools__WEBPACK_IMPORTED_MODULE_6__.get)(parent)) {
        addButtons(pool, actionId, callback);
    }
    (0,_highlight__WEBPACK_IMPORTED_MODULE_4__.addSustained)(source);
    return destinations.length;
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/callbacks/index.ts":
/*!********************************************************!*\
  !*** ./ts/modal/body/nodes/actions/callbacks/index.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _update__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./update */ "./ts/modal/body/nodes/actions/callbacks/update.ts");
/* harmony import */ var _predicate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./predicate */ "./ts/modal/body/nodes/actions/callbacks/predicate.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ update: _update__WEBPACK_IMPORTED_MODULE_0__, predicate: _predicate__WEBPACK_IMPORTED_MODULE_1__ });


/***/ }),

/***/ "./ts/modal/body/nodes/actions/callbacks/predicate.ts":
/*!************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/callbacks/predicate.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAll: () => (/* binding */ getAll),
/* harmony export */   getSub: () => (/* binding */ getSub)
/* harmony export */ });
/* harmony import */ var _predicate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/predicate */ "./ts/predicate.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

let ongoing;
function handle(promises) {
    return __awaiter(this, void 0, void 0, function* () {
        ongoing === null || ongoing === void 0 ? void 0 : ongoing(true);
        const callback = new Promise((resolve) => {
            ongoing = resolve;
        });
        const response = Promise.all(promises);
        if (yield Promise.any([
            callback,
            // result of Promise.prototype.finally() gets ignored unless it's a rejection sigh
            response
                .then(() => false)
                .catch(() => false),
        ])) {
            return false;
        }
        return yield response;
    });
}
function getSub(ancestors) {
    const responses = [];
    if ('childPredicate' in ancestors[0]) {
        responses.push((0,_predicate__WEBPACK_IMPORTED_MODULE_0__.getPredicatePromise)(ancestors[0].childPredicate()));
    }
    for (const ancestor of ancestors) {
        if ('descendantPredicate' in ancestor) {
            responses.push((0,_predicate__WEBPACK_IMPORTED_MODULE_0__.getPredicatePromise)(ancestor.descendantPredicate()));
        }
    }
    return responses;
}
function getAll(node) {
    if (node.forceValid || ('options' in node && node.options.includes(node.value))) {
        return handle(getSub(node.getAncestors()));
    }
    if ('predicate' in node) {
        return handle([(0,_predicate__WEBPACK_IMPORTED_MODULE_0__.getPredicatePromise)(node.predicate()), ...getSub(node.getAncestors())]);
    }
    throw undefined;
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/callbacks/update.ts":
/*!*********************************************************!*\
  !*** ./ts/modal/body/nodes/actions/callbacks/update.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handle: () => (/* binding */ handle),
/* harmony export */   triggerAll: () => (/* binding */ triggerAll),
/* harmony export */   triggerSub: () => (/* binding */ triggerSub)
/* harmony export */ });
/* harmony import */ var _hide__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../hide */ "./ts/modal/body/nodes/actions/hide/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const maps = {
    onUpdate: new Map(),
    onChildUpdate: new Map(),
    onDescendantUpdate: new Map(),
};
function isOutdated(response, map, node) {
    return __awaiter(this, void 0, void 0, function* () {
        if (map.has(node)) {
            map.get(node)(false);
        }
        const callback = new Promise((resolve) => {
            map.set(node, resolve);
        });
        if (yield Promise.any([
            callback,
            Promise.resolve(response)
                .then(() => true)
                .catch(() => true),
        ])) {
            map.delete(node);
            return false;
        }
        return true;
    });
}
function handle(_response, property, node) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield isOutdated(_response, maps[property], node)) {
            return;
        }
        const response = yield _response;
        if (typeof response !== 'object') {
            return;
        }
        if ('hide' in response && typeof response.hide === 'object') {
            for (const [id, doHide] of Object.entries(response.hide)) {
                if (typeof doHide === 'boolean') {
                    (0,_hide__WEBPACK_IMPORTED_MODULE_0__["default"])(node, id, doHide);
                }
            }
        }
    });
}
function trigger(node, property) {
    if (property in node) {
        handle(node[property](), property, node);
    }
}
function triggerSub(ancestors) {
    trigger(ancestors[0], 'onChildUpdate');
    for (const ancestor of ancestors) {
        trigger(ancestor, 'onDescendantUpdate');
    }
}
function triggerAll(node) {
    trigger(node, 'onUpdate');
    triggerSub(node.getAncestors());
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/css.ts":
/*!********************************************!*\
  !*** ./ts/modal/body/nodes/actions/css.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _edit_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./edit/css */ "./ts/modal/body/nodes/actions/edit/css.ts");
/* harmony import */ var _highlight_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./highlight/css */ "./ts/modal/body/nodes/actions/highlight/css.ts");
/* harmony import */ var _focus_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./focus/css */ "./ts/modal/body/nodes/actions/focus/css.ts");
/* harmony import */ var _overlays_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./overlays/css */ "./ts/modal/body/nodes/actions/overlays/css.ts");
/* harmony import */ var _buttons_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./buttons/css */ "./ts/modal/body/nodes/actions/buttons/css.ts");





function generate() {
    (0,_edit_css__WEBPACK_IMPORTED_MODULE_0__["default"])();
    (0,_highlight_css__WEBPACK_IMPORTED_MODULE_1__["default"])();
    (0,_focus_css__WEBPACK_IMPORTED_MODULE_2__["default"])();
    (0,_overlays_css__WEBPACK_IMPORTED_MODULE_3__["default"])();
    (0,_buttons_css__WEBPACK_IMPORTED_MODULE_4__["default"])();
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/edit/consts.ts":
/*!****************************************************!*\
  !*** ./ts/modal/body/nodes/actions/edit/consts.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTIVE_CLASS: () => (/* binding */ ACTIVE_CLASS),
/* harmony export */   INVALID_BACKGROUND_CLASS: () => (/* binding */ INVALID_BACKGROUND_CLASS),
/* harmony export */   INVALID_CLASS: () => (/* binding */ INVALID_CLASS),
/* harmony export */   VALID_BACKGROUND_CLASS: () => (/* binding */ VALID_BACKGROUND_CLASS),
/* harmony export */   VALID_CLASS: () => (/* binding */ VALID_CLASS)
/* harmony export */ });
const ACTIVE_CLASS = 'edit-active';
const VALID_CLASS = 'edit-valid';
const INVALID_CLASS = 'edit-invalid';
const VALID_BACKGROUND_CLASS = 'background-valid';
const INVALID_BACKGROUND_CLASS = 'background-invalid';


/***/ }),

/***/ "./ts/modal/body/nodes/actions/edit/css.ts":
/*!*************************************************!*\
  !*** ./ts/modal/body/nodes/actions/edit/css.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/edit/consts.ts");
/* harmony import */ var _nodes_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nodes/consts */ "./ts/modal/body/nodes/consts.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");



function generate() {
    // Use pointer when the node has a value and isn't being edited
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_nodes_consts__WEBPACK_IMPORTED_MODULE_1__.EDITABLE_CLASS} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_1__.ELEMENT_CLASSES.HEAD_CONTAINER}`, ['cursor', 'pointer']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`:not(.${_consts__WEBPACK_IMPORTED_MODULE_0__.ACTIVE_CLASS}) > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_1__.ELEMENT_CLASSES.HEAD_CONTAINER} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_1__.ELEMENT_CLASSES.INFO_CONTAINER}`, ['pointer-events', 'none']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_nodes_consts__WEBPACK_IMPORTED_MODULE_1__.ELEMENT_CLASSES.VALUE}`, [
        ['flex-grow', '1'],
        ['outline', 'none'],
        ['min-width', '0'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_nodes_consts__WEBPACK_IMPORTED_MODULE_1__.ELEMENT_CLASSES.VALUE}[type="checkbox"]`, [
        ['min-height', '1em'],
        ['min-width', '1em'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_nodes_consts__WEBPACK_IMPORTED_MODULE_1__.ELEMENT_CLASSES.VALUE}[type="color"]`, [
        ['height', '1.3em'],
        ['cursor', 'pointer'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.VALID_BACKGROUND_CLASS}`, ['background-color', 'var(--validBackground)']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.INVALID_BACKGROUND_CLASS}`, ['background-color', 'var(--invalidBackground)']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([`.${_consts__WEBPACK_IMPORTED_MODULE_0__.VALID_BACKGROUND_CLASS}`, `.${_consts__WEBPACK_IMPORTED_MODULE_0__.INVALID_BACKGROUND_CLASS}`], [
        ['transition-property', 'width, padding-left'],
        ['transition-duration', '500ms'],
        ['right', '0'],
        ['width', '0'],
        ['padding-left', '0'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.VALID_CLASS} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_1__.ELEMENT_CLASSES.HEAD_CONTAINER} .${_consts__WEBPACK_IMPORTED_MODULE_0__.VALID_BACKGROUND_CLASS}`,
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.INVALID_CLASS} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_1__.ELEMENT_CLASSES.HEAD_CONTAINER} .${_consts__WEBPACK_IMPORTED_MODULE_0__.INVALID_BACKGROUND_CLASS}`,
    ], ['width', '100%']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.VALID_CLASS} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_1__.ELEMENT_CLASSES.HEAD_CONTAINER} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_1__.ELEMENT_CLASSES.BUTTON_CONTAINER}:not(:empty) + * .${_consts__WEBPACK_IMPORTED_MODULE_0__.VALID_BACKGROUND_CLASS}`,
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.INVALID_CLASS} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_1__.ELEMENT_CLASSES.HEAD_CONTAINER} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_1__.ELEMENT_CLASSES.BUTTON_CONTAINER}:not(:empty) + * .${_consts__WEBPACK_IMPORTED_MODULE_0__.INVALID_BACKGROUND_CLASS}`,
    ], ['padding-left', '0.8em']);
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/edit/index.ts":
/*!***************************************************!*\
  !*** ./ts/modal/body/nodes/actions/edit/index.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   doAction: () => (/* binding */ doAction),
/* harmony export */   isActive: () => (/* binding */ isActive),
/* harmony export */   mount: () => (/* binding */ mount),
/* harmony export */   reset: () => (/* binding */ reset),
/* harmony export */   shouldMount: () => (/* binding */ shouldMount),
/* harmony export */   unmount: () => (/* binding */ unmount),
/* harmony export */   update: () => (/* binding */ update)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/edit/consts.ts");
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../history */ "./ts/modal/body/nodes/actions/history.ts");
/* harmony import */ var _overlays__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../overlays */ "./ts/modal/body/nodes/actions/overlays/index.ts");
/* harmony import */ var _highlight__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../highlight */ "./ts/modal/body/nodes/actions/highlight/index.ts");
/* harmony import */ var _callbacks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../callbacks */ "./ts/modal/body/nodes/actions/callbacks/index.ts");
/* harmony import */ var _overlays_tooltip_consts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../overlays/tooltip/consts */ "./ts/modal/body/nodes/actions/overlays/tooltip/consts.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../consts */ "./ts/modal/body/nodes/consts.ts");
/* harmony import */ var _predicate__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/predicate */ "./ts/predicate.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};








let activeNode;
let priorValue;
function isActive() {
    return Boolean(activeNode);
}
function addInputListeners(node = activeNode) {
    const { headContainer, contrast: { valueElement } } = node.element;
    if ('listeners' in node) {
        for (const [event, callback] of Object.entries(node.listeners)) {
            valueElement.addEventListener(event, callback);
        }
    }
    if (typeof node.value === 'boolean') {
        valueElement.addEventListener('click', (event) => {
            event.stopPropagation();
            update();
        });
    }
    else {
        valueElement.addEventListener('input', (event) => {
            event.stopPropagation();
            update();
        });
    }
    valueElement.addEventListener('focusin', (event) => {
        event.stopPropagation();
        if (event.relatedTarget) {
            doAction(node);
        }
    });
    valueElement.addEventListener('blur', (event) => {
        event.stopPropagation();
        if ((0,_predicate__WEBPACK_IMPORTED_MODULE_7__.isUnresolved)()) {
            valueElement.focus();
            return;
        }
        reset();
    });
    valueElement.addEventListener('keydown', (event) => {
        switch (event.key) {
            // see socket keydown listener in history
            case 'z':
            case 'Z':
            case 'y':
            case 'Y':
                if (event.ctrlKey && !event.shiftKey) {
                    event.stopPropagation();
                }
                return;
            case 'Enter':
            case 'Escape':
                if ((0,_predicate__WEBPACK_IMPORTED_MODULE_7__.isUnresolved)()) {
                    event.preventDefault();
                }
                else {
                    headContainer.focus();
                }
            // eslint-disable-next-line no-fallthrough
            case 'Undo':
            case 'Redo':
            // see socket keydown listener in highlight
            // eslint-disable-next-line no-fallthrough
            case 'Home':
            case 'End':
            case 'Backspace':
                event.stopPropagation();
        }
    });
}
function clearUndoStack() {
    const elements = activeNode.element.contrast;
    const copy = elements.valueElement.cloneNode(true);
    elements.valueElement.replaceWith(copy);
    elements.valueElement = copy;
    addInputListeners();
}
function setValue(node, value) {
    node.value = value;
    node.element.render(value);
    _callbacks__WEBPACK_IMPORTED_MODULE_4__["default"].update.triggerAll(node);
}
function reset() {
    if (!activeNode) {
        return;
    }
    const { element } = activeNode;
    clearUndoStack();
    if (priorValue === activeNode.lastAcceptedValue) {
        activeNode.value = activeNode.lastAcceptedValue;
        activeNode.element.render(activeNode.lastAcceptedValue);
    }
    else {
        _history__WEBPACK_IMPORTED_MODULE_1__.register(activeNode, setValue.bind(null, activeNode, priorValue), setValue.bind(null, activeNode, activeNode.lastAcceptedValue));
    }
    element.removeClass(_consts__WEBPACK_IMPORTED_MODULE_0__.VALID_CLASS);
    element.removeClass(_consts__WEBPACK_IMPORTED_MODULE_0__.INVALID_CLASS);
    element.removeClass(_consts__WEBPACK_IMPORTED_MODULE_0__.ACTIVE_CLASS);
    _overlays__WEBPACK_IMPORTED_MODULE_2__.reset();
    (0,_highlight__WEBPACK_IMPORTED_MODULE_3__.removeSustained)(activeNode);
    activeNode = undefined;
    priorValue = undefined;
}
function getValue(node) {
    switch (typeof node.value) {
        case 'boolean':
            return Boolean(node.element.contrast.valueElement.checked);
        case 'number':
            return Number(node.element.contrast.valueElement.value);
        default:
            return node.element.contrast.valueElement.value;
    }
}
function update() {
    return __awaiter(this, void 0, void 0, function* () {
        const value = getValue(activeNode);
        activeNode.value = value;
        activeNode.element.removeClass(_consts__WEBPACK_IMPORTED_MODULE_0__.INVALID_CLASS);
        activeNode.element.removeClass(_consts__WEBPACK_IMPORTED_MODULE_0__.VALID_CLASS);
        _overlays__WEBPACK_IMPORTED_MODULE_2__.update();
        try {
            if (!(yield _callbacks__WEBPACK_IMPORTED_MODULE_4__["default"].predicate.getAll(activeNode))) {
                return;
            }
        }
        catch (reason) {
            activeNode.element.addClass(_consts__WEBPACK_IMPORTED_MODULE_0__.INVALID_CLASS);
            if (reason) {
                _overlays__WEBPACK_IMPORTED_MODULE_2__.tooltip.kill();
                _overlays__WEBPACK_IMPORTED_MODULE_2__.showTooltip(reason, activeNode);
            }
            return;
        }
        activeNode.lastAcceptedValue = value;
        activeNode.element.addClass(_consts__WEBPACK_IMPORTED_MODULE_0__.VALID_CLASS);
        _overlays__WEBPACK_IMPORTED_MODULE_2__.hideTooltip();
        _callbacks__WEBPACK_IMPORTED_MODULE_4__["default"].update.triggerAll(activeNode);
    });
}
function unmount(node) {
    if (node === activeNode) {
        reset();
    }
}
function doAction(node) {
    if ((0,_predicate__WEBPACK_IMPORTED_MODULE_7__.isUnresolved)()) {
        _overlays__WEBPACK_IMPORTED_MODULE_2__.showTooltip(_overlays_tooltip_consts__WEBPACK_IMPORTED_MODULE_5__.MESSAGE_UNRESOLVED, node, node.element.contrast.valueContainer);
        node.element.headContainer.focus();
        return;
    }
    reset();
    _overlays__WEBPACK_IMPORTED_MODULE_2__.tooltip.kill();
    activeNode = node;
    priorValue = node.value;
    node.element.addClass(_consts__WEBPACK_IMPORTED_MODULE_0__.ACTIVE_CLASS);
    node.element.addClass(_consts__WEBPACK_IMPORTED_MODULE_0__.VALID_CLASS);
    _overlays__WEBPACK_IMPORTED_MODULE_2__.setNode(node);
    if (node.input === 'color') {
        node.element.contrast.valueElement.click();
    }
    else if (typeof node.value !== 'boolean') {
        const input = node.element.contrast.valueElement;
        input.select();
        input.scrollLeft = input.scrollWidth;
    }
    (0,_highlight__WEBPACK_IMPORTED_MODULE_3__.addSustained)(node);
}
function mount(node) {
    const { backgroundContainer, contrast, headContainer } = node.element;
    node.lastAcceptedValue = node.value;
    node.element.addClass(_consts__WEBPACK_IMPORTED_MODULE_6__.EDITABLE_CLASS);
    backgroundContainer.append(...(() => {
        const valid = document.createElement('div');
        const invalid = document.createElement('div');
        valid.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.VALID_BACKGROUND_CLASS);
        invalid.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.INVALID_BACKGROUND_CLASS);
        return [valid, invalid];
    })());
    // Start
    headContainer.addEventListener('click', (event) => {
        event.stopPropagation();
        contrast.valueElement.focus();
    });
    // Process new value
    if (typeof node.value === 'boolean') {
        headContainer.addEventListener('mousedown', (event) => {
            event.stopPropagation();
            event.preventDefault();
        });
        headContainer.addEventListener('click', () => {
            contrast.valueElement.checked = !contrast.valueElement.checked;
            update();
        });
        contrast.valueContainer.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }
    addInputListeners(node);
}
function shouldMount(node) {
    return 'value' in node;
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/focus/consts.ts":
/*!*****************************************************!*\
  !*** ./ts/modal/body/nodes/actions/focus/consts.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BACKGROUND_CLASS: () => (/* binding */ BACKGROUND_CLASS),
/* harmony export */   FOCUS_CLASS: () => (/* binding */ FOCUS_CLASS),
/* harmony export */   FOCUS_SOURCE_CLASS: () => (/* binding */ FOCUS_SOURCE_CLASS)
/* harmony export */ });
const FOCUS_CLASS = 'node-focus';
const FOCUS_SOURCE_CLASS = 'node-focus-source';
const BACKGROUND_CLASS = 'background-focus';


/***/ }),

/***/ "./ts/modal/body/nodes/actions/focus/css.ts":
/*!**************************************************!*\
  !*** ./ts/modal/body/nodes/actions/focus/css.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/focus/consts.ts");
/* harmony import */ var _highlight_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../highlight/consts */ "./ts/modal/body/nodes/actions/highlight/consts.ts");
/* harmony import */ var _nodes_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nodes/consts */ "./ts/modal/body/nodes/consts.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");




function generate() {
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`.${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.ELEMENT_CONTAINER}`, ['cursor', 'zoom-in']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`.${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.ELEMENT_CONTAINER}.${_consts__WEBPACK_IMPORTED_MODULE_0__.FOCUS_SOURCE_CLASS}`, ['cursor', 'zoom-out']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`.${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ROOT_CLASS}.${_consts__WEBPACK_IMPORTED_MODULE_0__.FOCUS_CLASS} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${_consts__WEBPACK_IMPORTED_MODULE_0__.FOCUS_CLASS}):not(.${_consts__WEBPACK_IMPORTED_MODULE_0__.FOCUS_SOURCE_CLASS} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.CHILD_CONTAINER} > *)`, ['display', 'none']);
    // Makes it easy to focus down the tree
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.FOCUS_SOURCE_CLASS} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.MIDDLE_CLASS} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.HEAD_CONTAINER}`, [['margin-left', '1.8em']]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.BACKGROUND_CLASS}`, ['background-color', 'var(--focusBackground)']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.BACKGROUND_CLASS}`, [
        ['transition-property', 'width, padding-left'],
        ['transition-duration', '500ms'],
        ['right', '0'],
        ['width', '0'],
        ['padding-left', '0'],
    ]);
    const headSelector = `.${_consts__WEBPACK_IMPORTED_MODULE_0__.FOCUS_SOURCE_CLASS}:not(:hover:not(:has(> .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.CHILD_CONTAINER}:hover))) > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.HEAD_CONTAINER}:not(.${_highlight_consts__WEBPACK_IMPORTED_MODULE_1__.TAB_CLASS} :focus):not(:hover)`;
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`${headSelector} .${_consts__WEBPACK_IMPORTED_MODULE_0__.BACKGROUND_CLASS}`, ['width', '100%']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`${headSelector} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.BUTTON_CONTAINER}:not(:empty) + * .${_consts__WEBPACK_IMPORTED_MODULE_0__.BACKGROUND_CLASS}`, ['padding-left', '0.8em']);
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/focus/index.ts":
/*!****************************************************!*\
  !*** ./ts/modal/body/nodes/actions/focus/index.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   doAction: () => (/* binding */ doAction),
/* harmony export */   focus: () => (/* binding */ focus),
/* harmony export */   focusBranch: () => (/* binding */ focusBranch),
/* harmony export */   isActive: () => (/* binding */ isActive),
/* harmony export */   mount: () => (/* binding */ mount),
/* harmony export */   reset: () => (/* binding */ reset),
/* harmony export */   setTabIndexes: () => (/* binding */ setTabIndexes),
/* harmony export */   shouldMount: () => (/* binding */ shouldMount),
/* harmony export */   unmount: () => (/* binding */ unmount)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/focus/consts.ts");
/* harmony import */ var _overlays_tooltip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../overlays/tooltip */ "./ts/modal/body/nodes/actions/overlays/tooltip/index.ts");
/* harmony import */ var _buttons_position__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../buttons/position */ "./ts/modal/body/nodes/actions/buttons/position/index.ts");
/* harmony import */ var _highlight__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../highlight */ "./ts/modal/body/nodes/actions/highlight/index.ts");
/* harmony import */ var _scroll__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../scroll */ "./ts/modal/body/nodes/actions/scroll.ts");





let candidateNode;
let activeNode;
function isActive() {
    return Boolean(activeNode);
}
function setTabIndexes(doAdd = true, node = activeNode) {
    const { 'buttonContainer': { 'children': buttons }, contrast: { valueElement } } = node.element;
    for (let i = buttons.length - 1; i >= 0; --i) {
        buttons[i].setAttribute('tabindex', doAdd ? '0' : '-1');
    }
    if (valueElement) {
        valueElement.setAttribute('tabindex', doAdd ? '0' : '-1');
    }
}
function focus(doFocus = true, node = activeNode, doForce = true) {
    // Avoid unfocusing the active node if not forced
    if (doForce || node !== activeNode) {
        node.element[`${doFocus ? 'add' : 'remove'}Class`](_consts__WEBPACK_IMPORTED_MODULE_0__.FOCUS_SOURCE_CLASS);
    }
    if (!('children' in node)) {
        return;
    }
}
function focusBranch(doFocus = true, node = activeNode, focusAncestors = true) {
    node.element[`${doFocus ? 'add' : 'remove'}Class`](_consts__WEBPACK_IMPORTED_MODULE_0__.FOCUS_CLASS);
    if (focusAncestors && 'parent' in node) {
        focusBranch(doFocus, node.parent);
    }
}
function reset(doScroll = true) {
    if (!activeNode) {
        return;
    }
    focus(false);
    focusBranch(false);
    (0,_highlight__WEBPACK_IMPORTED_MODULE_3__.removeSustained)(activeNode);
    setTabIndexes(false);
    if (doScroll) {
        (0,_scroll__WEBPACK_IMPORTED_MODULE_4__.stickyScroll)(activeNode);
    }
    activeNode = undefined;
}
function doAction(node, doForce = false) {
    const toggleOn = node !== activeNode;
    (0,_overlays_tooltip__WEBPACK_IMPORTED_MODULE_1__.kill)();
    if ((0,_buttons_position__WEBPACK_IMPORTED_MODULE_2__.isActive)() || (doForce && !toggleOn)) {
        return;
    }
    reset(!toggleOn);
    if (toggleOn) {
        activeNode = node;
        node.element.headContainer.focus();
        focus();
        focusBranch();
        node.element.scrollIntoView(false);
        (0,_highlight__WEBPACK_IMPORTED_MODULE_3__.addSustained)(node);
        setTabIndexes();
    }
}
function unmount(node) {
    if (node === activeNode) {
        reset();
    }
}
function mount(node) {
    const { elementContainer, headContainer, backgroundContainer } = node.element;
    backgroundContainer.append((() => {
        const background = document.createElement('div');
        background.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.BACKGROUND_CLASS);
        return background;
    })());
    // Handle keyboard input
    elementContainer.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.stopPropagation();
            doAction(node);
        }
    });
    // Handle side click
    elementContainer.addEventListener('mousedown', (event) => {
        event.stopPropagation();
        candidateNode = node;
    });
    elementContainer.addEventListener('mouseup', (event) => {
        event.stopPropagation();
        if (node === candidateNode) {
            doAction(node);
        }
        candidateNode = undefined;
    });
    if ('value' in node) {
        headContainer.addEventListener('mousedown', (event) => {
            event.stopPropagation();
            candidateNode = undefined;
        });
        headContainer.addEventListener('mouseup', (event) => {
            event.stopPropagation();
            candidateNode = undefined;
        });
        return;
    }
    // Handle head click
    headContainer.addEventListener('mousedown', (event) => {
        event.stopPropagation();
        candidateNode = node;
    });
    headContainer.addEventListener('mouseup', (event) => {
        event.stopPropagation();
        if (node === candidateNode && headContainer.isSameNode(event.target)) {
            doAction(node);
        }
        candidateNode = undefined;
    });
}
function shouldMount() {
    return true;
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/hide/consts.ts":
/*!****************************************************!*\
  !*** ./ts/modal/body/nodes/actions/hide/consts.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CLASS_PREFIX_READ: () => (/* binding */ CLASS_PREFIX_READ),
/* harmony export */   CLASS_PREFIX_WRITE: () => (/* binding */ CLASS_PREFIX_WRITE)
/* harmony export */ });
const CLASS_PREFIX_WRITE = 'node-hide-write-';
const CLASS_PREFIX_READ = 'node-hide-read-';


/***/ }),

/***/ "./ts/modal/body/nodes/actions/hide/index.ts":
/*!***************************************************!*\
  !*** ./ts/modal/body/nodes/actions/hide/index.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ hide),
/* harmony export */   mount: () => (/* binding */ mount),
/* harmony export */   shouldMount: () => (/* binding */ shouldMount)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/hide/consts.ts");
/* harmony import */ var _nodes_pools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nodes/pools */ "./ts/modal/body/nodes/pools.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");



const ids = [];
function setWriteClass(node, id, doHide) {
    node.element[`${doHide ? 'add' : 'remove'}Class`](`${_consts__WEBPACK_IMPORTED_MODULE_0__.CLASS_PREFIX_WRITE}${id}`);
}
function hide(node, id, doHide = true) {
    if (!('parent' in node) || 'seed' in node.parent) {
        setWriteClass(node, id, doHide);
        return;
    }
    for (const parent of (0,_nodes_pools__WEBPACK_IMPORTED_MODULE_1__.get)(node.parent)) {
        hide(parent, id, doHide);
    }
}
function mount(node) {
    node.element.addClass(`${_consts__WEBPACK_IMPORTED_MODULE_0__.CLASS_PREFIX_READ}${node.hideId}`);
    if (!ids[node.hideId]) {
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.CLASS_PREFIX_WRITE}${node.hideId} .${_consts__WEBPACK_IMPORTED_MODULE_0__.CLASS_PREFIX_READ}${node.hideId}`, ['display', 'none']);
        ids[node.hideId] = true;
    }
}
function shouldMount(node) {
    return 'hideId' in node;
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/highlight/consts.ts":
/*!*********************************************************!*\
  !*** ./ts/modal/body/nodes/actions/highlight/consts.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EAVE_ID: () => (/* binding */ EAVE_ID),
/* harmony export */   HIGHLIGHT_BACKGROUND_CLASS: () => (/* binding */ HIGHLIGHT_BACKGROUND_CLASS),
/* harmony export */   HIGHLIGHT_CLASS: () => (/* binding */ HIGHLIGHT_CLASS),
/* harmony export */   TAB_CLASS: () => (/* binding */ TAB_CLASS)
/* harmony export */ });
const HIGHLIGHT_CLASS = 'highlight';
const HIGHLIGHT_BACKGROUND_CLASS = 'background-highlight';
const TAB_CLASS = 'tab-naving';
const EAVE_ID = 'tree-eave';


/***/ }),

/***/ "./ts/modal/body/nodes/actions/highlight/css.ts":
/*!******************************************************!*\
  !*** ./ts/modal/body/nodes/actions/highlight/css.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/highlight/consts.ts");
/* harmony import */ var _buttons_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../buttons/consts */ "./ts/modal/body/nodes/actions/buttons/consts.ts");
/* harmony import */ var _nodes_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nodes/consts */ "./ts/modal/body/nodes/consts.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");




function generate() {
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`.${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.LABEL_CONTAINER}`, [
        ['padding-right', '0.4em'],
        // Extend the background further into the value
        ['padding-left', '4em'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`.${_buttons_consts__WEBPACK_IMPORTED_MODULE_1__.BUTTON_CLASS}:last-child`, [
        ['border-top-right-radius', '0.8em'],
        ['border-bottom-right-radius', '0.8em'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)([`.${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.BASE_CLASS}`], [
        ['transition-property', 'width'],
        ['transition-duration', '500ms'],
        ['overflow', 'hidden'],
        ['right', '0'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)([
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_CLASS} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.HEAD_CONTAINER} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.BASE_CLASS}`,
        `.${_buttons_consts__WEBPACK_IMPORTED_MODULE_1__.TEST_ADD_CLASS} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.BASE_CLASS}`,
        `.${_buttons_consts__WEBPACK_IMPORTED_MODULE_1__.TEST_REMOVE_CLASS} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.BASE_CLASS}`,
    ], [['width', '0']]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`.${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.BUTTON_CONTAINER}:not(:empty) + * .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.BACKGROUND_CONTAINER} > *`, [['margin-left', '-0.8em']]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_BACKGROUND_CLASS}`, [
        ['transition-property', 'width, padding-left'],
        ['transition-duration', '500ms'],
        ['width', '100%'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`:not(.${_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_CLASS}) > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.HEAD_CONTAINER} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.BUTTON_CONTAINER}:not(:empty):not(.${_buttons_consts__WEBPACK_IMPORTED_MODULE_1__.TEST_ADD_CLASS} *):not(.${_buttons_consts__WEBPACK_IMPORTED_MODULE_1__.TEST_REMOVE_CLASS} *) + * .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.BACKGROUND_CONTAINER} > .${_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_BACKGROUND_CLASS}`, [['width', '0']]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)([
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_CLASS} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.HEAD_CONTAINER} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.BUTTON_CONTAINER}:not(:empty) + * .${_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_BACKGROUND_CLASS}`,
        `.${_buttons_consts__WEBPACK_IMPORTED_MODULE_1__.TEST_ADD_CLASS} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.BUTTON_CONTAINER}:not(:empty) + * .${_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_BACKGROUND_CLASS}`,
        `.${_buttons_consts__WEBPACK_IMPORTED_MODULE_1__.TEST_REMOVE_CLASS} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.BUTTON_CONTAINER}:not(:empty) + * .${_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_BACKGROUND_CLASS}`,
    ], [['padding-left', '0.8em']]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_BACKGROUND_CLASS}`, [
        ['height', '100%'],
        ['width', '100%'],
        ['padding-left', '0'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`.${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.HEAD_CONTAINER}`, ['position', 'relative']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`:not(.${_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_CLASS}) > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.HEAD_CONTAINER}:focus::after`, [
        ['content', '\'\''],
        ['position', 'absolute'],
        ['right', '0'],
        ['height', '100%'],
        ['width', '4px'],
    ]);
    for (const [selector, base, contrast] of _nodes_consts__WEBPACK_IMPORTED_MODULE_2__.NODE_COLOURS) {
        const headSelector = `${selector} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.HEAD_CONTAINER}`;
        // focus indicator
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`:not(.${_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_CLASS})${headSelector}:focus::after`, ['background-color', contrast]);
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`${headSelector} .${_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_BACKGROUND_CLASS}`, ['background-color', contrast]);
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`${headSelector} .${_buttons_consts__WEBPACK_IMPORTED_MODULE_1__.BUTTON_CLASS}`, ['background-color', contrast]);
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)([`${headSelector} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.BASE_CLASS}`], [
            ['color', contrast],
            ['background-color', base],
        ]);
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)([`${headSelector} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.CONTRAST_CLASS}`], ['color', base]);
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`${headSelector} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.BASE_CLASS} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.LABEL_CONTAINER}`, ['background-image', `linear-gradient(to right, transparent, 1.9em, ${base} 3.8em)`]);
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`${headSelector} .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.CONTRAST_CLASS} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_CLASSES.LABEL_CONTAINER}`, ['background-image', `linear-gradient(to right, transparent, 1.9em, ${contrast} 3.8em)`]);
    }
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`#${_consts__WEBPACK_IMPORTED_MODULE_0__.EAVE_ID}`, [
        ['position', 'absolute'],
        ['bottom', '0'],
        ['width', '100%'],
        // Prevents zipping to the end of the tree when mousing over the bottom pixel
        ['height', '1px'],
        ['z-index', 'var(--overlayIndex)'],
    ]);
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/highlight/index.ts":
/*!********************************************************!*\
  !*** ./ts/modal/body/nodes/actions/highlight/index.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addSustained: () => (/* binding */ addSustained),
/* harmony export */   generateEave: () => (/* binding */ generateEave),
/* harmony export */   isActive: () => (/* binding */ isActive),
/* harmony export */   mount: () => (/* binding */ mount),
/* harmony export */   onMount: () => (/* binding */ onMount),
/* harmony export */   removeSustained: () => (/* binding */ removeSustained),
/* harmony export */   reset: () => (/* binding */ reset),
/* harmony export */   setActive: () => (/* binding */ setActive),
/* harmony export */   shouldMount: () => (/* binding */ shouldMount),
/* harmony export */   unmount: () => (/* binding */ unmount)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/highlight/consts.ts");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../edit */ "./ts/modal/body/nodes/actions/edit/index.ts");
/* harmony import */ var _scroll__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scroll */ "./ts/modal/body/nodes/actions/scroll.ts");
/* harmony import */ var _modal_header_actions_sticky__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modal/header/actions/sticky */ "./ts/modal/header/actions/sticky/index.ts");
/* harmony import */ var _modal_body__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/modal/body */ "./ts/modal/body/index.ts");
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/modal */ "./ts/modal/index.ts");






let sustainedNodes = [];
let activeNode;
function isActive() {
    return Boolean(activeNode);
}
function removeSustained(node) {
    sustainedNodes.splice(sustainedNodes.indexOf(node), 1);
    // Avoid unhighlighting if it's still sustained by another action
    if (node !== activeNode && !sustainedNodes.includes(node)) {
        node.element.removeClass(_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_CLASS);
    }
}
function addSustained(node) {
    node.element.addClass(_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_CLASS);
    sustainedNodes.push(node);
}
function setActive(node, doFocus = false) {
    if (activeNode && !sustainedNodes.includes(activeNode)) {
        activeNode.element.removeClass(_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_CLASS);
    }
    activeNode = node;
    if (!node) {
        return;
    }
    node.element.addClass(_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_CLASS);
    if (doFocus) {
        node.element.headContainer.focus();
        // focus listeners don't seem to trigger if the document isn't focused
        if ((0,_modal_header_actions_sticky__WEBPACK_IMPORTED_MODULE_3__.isActive)() && !document.hasFocus()) {
            (0,_scroll__WEBPACK_IMPORTED_MODULE_2__.stickyScroll)(node, false, false);
        }
    }
}
function unmount(node) {
    if (node === activeNode) {
        node.element.headContainer.blur();
    }
}
let isTab = false;
let isListening = false;
function setTab(value = true) {
    isTab = value;
    _modal_body__WEBPACK_IMPORTED_MODULE_4__.element.classList[isTab ? 'add' : 'remove'](_consts__WEBPACK_IMPORTED_MODULE_0__.TAB_CLASS);
}
function mount(node) {
    const { backgroundContainer, headContainer, elementContainer, infoContainer, base } = node.element;
    if (base.valueContainer) {
        (new ResizeObserver(() => {
            if (infoContainer.clientWidth > 0) {
                base.valueContainer.style.setProperty('width', `${infoContainer.clientWidth}px`);
            }
        })).observe(infoContainer);
    }
    backgroundContainer.appendChild((() => {
        const background = document.createElement('div');
        background.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_BACKGROUND_CLASS);
        return background;
    })());
    headContainer.setAttribute('tabindex', '0');
    headContainer.addEventListener('focusin', (event) => {
        event.stopPropagation();
        if ((0,_modal_header_actions_sticky__WEBPACK_IMPORTED_MODULE_3__.isActive)()) {
            (0,_scroll__WEBPACK_IMPORTED_MODULE_2__.stickyScroll)(node, false, isTab);
        }
        else if (isTab) {
            node.element.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
        if (isTab && !isListening) {
            isListening = true;
            (0,_modal__WEBPACK_IMPORTED_MODULE_5__.getDocument)().addEventListener('mousemove', () => {
                setTab(false);
                isListening = false;
            }, { capture: true, once: true });
        }
        // Filters out events fired from re-focusing the window
        if (event.relatedTarget) {
            setActive(node);
        }
    });
    headContainer.addEventListener('mouseover', (event) => {
        event.stopPropagation();
        if (!isTab) {
            setActive(node, !(0,_edit__WEBPACK_IMPORTED_MODULE_1__.isActive)());
        }
    });
    elementContainer.addEventListener('mouseover', (event) => {
        event.stopPropagation();
        if (!isTab) {
            setActive(node);
        }
    });
    elementContainer.addEventListener('mouseout', (event) => {
        event.stopPropagation();
        if (!isTab) {
            setActive();
        }
    });
}
function shouldMount() {
    return true;
}
function setEdge(element, isStart) {
    element.setAttribute('tabindex', '0');
    // Prevent tabbing away from the modal
    element.addEventListener('keydown', (event) => {
        if (event.key === 'Tab' && (event.shiftKey === isStart) && element.isSameNode(event.target)) {
            event.preventDefault();
        }
    });
    element.addEventListener('focusin', () => {
        setActive();
    });
}
function generateEave(socket) {
    const element = document.createElement('div');
    element.id = _consts__WEBPACK_IMPORTED_MODULE_0__.EAVE_ID;
    setEdge(socket, true);
    setEdge(element, false);
    socket.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'Home':
                socket.focus();
                _modal_body__WEBPACK_IMPORTED_MODULE_4__.element.scrollTop = 0;
                break;
            case 'End':
                element.focus();
                _modal_body__WEBPACK_IMPORTED_MODULE_4__.element.scrollTop = _modal_body__WEBPACK_IMPORTED_MODULE_4__.element.scrollHeight;
                break;
            case 'Backspace':
                setActive();
                break;
            default:
                return;
        }
        event.preventDefault();
    });
    return element;
}
// Blur focused node & reset focus index
function reset() {
    setActive();
}
function onMount() {
    const socket = (0,_modal__WEBPACK_IMPORTED_MODULE_5__.getSocket)();
    socket.setAttribute('tabindex', '0');
    // Prevent tabbing away from the modal
    socket.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') {
            return;
        }
        setTab();
        if (event.shiftKey && socket.isSameNode(event.target)) {
            event.preventDefault();
        }
    });
    (0,_modal__WEBPACK_IMPORTED_MODULE_5__.getWindow)().addEventListener('blur', () => {
        setActive();
    });
    _modal_body__WEBPACK_IMPORTED_MODULE_4__.element.addEventListener('wheel', () => {
        setActive();
    });
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/history.ts":
/*!************************************************!*\
  !*** ./ts/modal/body/nodes/actions/history.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   onMount: () => (/* binding */ onMount),
/* harmony export */   register: () => (/* binding */ register)
/* harmony export */ });
/* harmony import */ var _scroll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scroll */ "./ts/modal/body/nodes/actions/scroll.ts");
/* harmony import */ var _focus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./focus */ "./ts/modal/body/nodes/actions/focus/index.ts");
/* harmony import */ var _highlight__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./highlight */ "./ts/modal/body/nodes/actions/highlight/index.ts");
/* harmony import */ var _modal_body__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modal/body */ "./ts/modal/body/index.ts");
/* harmony import */ var _modal_header_actions_sticky__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/modal/header/actions/sticky */ "./ts/modal/header/actions/sticky/index.ts");
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/modal */ "./ts/modal/index.ts");






const undoStack = [];
const redoStack = [];
function register(target, undo, redo, doAct = true, isUndoDeletion = false, isRedoDeletion = false) {
    if (doAct) {
        redo();
    }
    redoStack.length = 0;
    undoStack.push({ target, undo: { act: undo, isDeletion: isUndoDeletion }, redo: { act: redo, isDeletion: isRedoDeletion } });
}
function show(node) {
    const target = node.element.headContainer;
    if (!target.isSameNode((0,_modal__WEBPACK_IMPORTED_MODULE_5__.getDocument)().activeElement)) {
        target.addEventListener('focusin', (event) => {
            event.stopImmediatePropagation();
        }, { capture: true, once: true });
    }
    target.focus({ preventScroll: true });
    const targetRect = target.getBoundingClientRect();
    const scrollRect = _modal_body__WEBPACK_IMPORTED_MODULE_3__.element.getBoundingClientRect();
    const top = (0,_modal_header_actions_sticky__WEBPACK_IMPORTED_MODULE_4__.isActive)() ? (0,_scroll__WEBPACK_IMPORTED_MODULE_0__.getStickyScroll)(node) : (targetRect.top - scrollRect.top + _modal_body__WEBPACK_IMPORTED_MODULE_3__.element.scrollTop);
    if (top < _modal_body__WEBPACK_IMPORTED_MODULE_3__.element.scrollTop) {
        _modal_body__WEBPACK_IMPORTED_MODULE_3__.element.scrollTo({ top: top });
        return;
    }
    const bottom = targetRect.top - scrollRect.top + _modal_body__WEBPACK_IMPORTED_MODULE_3__.element.scrollTop + targetRect.height - _modal_body__WEBPACK_IMPORTED_MODULE_3__.element.clientHeight;
    if (bottom > _modal_body__WEBPACK_IMPORTED_MODULE_3__.element.scrollTop) {
        _modal_body__WEBPACK_IMPORTED_MODULE_3__.element.scrollTo({ top: bottom });
    }
}
function act(from, to, property) {
    if (from.length === 0) {
        return;
    }
    const action = from.pop();
    (0,_focus__WEBPACK_IMPORTED_MODULE_1__.reset)();
    if (action[property].isDeletion) {
        const index = action.target.getIndex();
        const target = index === 0 ? action.target.parent : action.target.parent.children[index - 1];
        action[property].act();
        show(target);
    }
    else {
        action[property].act();
        (0,_highlight__WEBPACK_IMPORTED_MODULE_2__.setActive)(action.target);
        show(action.target);
    }
    to.push(action);
}
function onMount() {
    (0,_modal__WEBPACK_IMPORTED_MODULE_5__.getSocket)().addEventListener('keydown', (event) => {
        if (event.key === 'Undo' || (event.key.toLowerCase() === 'z' && event.ctrlKey && !event.shiftKey)) {
            act(undoStack, redoStack, 'undo');
        }
        else if (event.key === 'Redo' || (event.key.toLowerCase() === 'y' && event.ctrlKey && !event.shiftKey)) {
            act(redoStack, undoStack, 'redo');
        }
    });
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/overlays/consts.ts":
/*!********************************************************!*\
  !*** ./ts/modal/body/nodes/actions/overlays/consts.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONTAINER_CLASS: () => (/* binding */ CONTAINER_CLASS)
/* harmony export */ });
const CONTAINER_CLASS = 'overlay-container';


/***/ }),

/***/ "./ts/modal/body/nodes/actions/overlays/css.ts":
/*!*****************************************************!*\
  !*** ./ts/modal/body/nodes/actions/overlays/css.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _tooltip_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tooltip/css */ "./ts/modal/body/nodes/actions/overlays/tooltip/css.ts");
/* harmony import */ var _dropdown_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dropdown/css */ "./ts/modal/body/nodes/actions/overlays/dropdown/css.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/overlays/consts.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");




function generate() {
    (0,_tooltip_css__WEBPACK_IMPORTED_MODULE_0__["default"])();
    (0,_dropdown_css__WEBPACK_IMPORTED_MODULE_1__["default"])();
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_2__.CONTAINER_CLASS}`, [
        ['z-index', 'var(--overlayIndex)'],
        ['position', 'absolute'],
        ['top', '0'],
        ['pointer-events', 'none'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_2__.CONTAINER_CLASS} > *`, [
        ['position', 'absolute'],
        ['width', 'inherit'],
        ['display', 'flex'],
        ['flex-direction', 'column'],
        ['align-items', 'center'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_2__.CONTAINER_CLASS} > :empty`, ['display', 'none']);
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/overlays/dropdown/consts.ts":
/*!*****************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/overlays/dropdown/consts.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DROPDOWN_ACTIVE_CLASS: () => (/* binding */ DROPDOWN_ACTIVE_CLASS),
/* harmony export */   DROPDOWN_BACKGROUND_CLASS: () => (/* binding */ DROPDOWN_BACKGROUND_CLASS),
/* harmony export */   DROPDOWN_CLASS: () => (/* binding */ DROPDOWN_CLASS),
/* harmony export */   DROPDOWN_CONTAINER_CLASS: () => (/* binding */ DROPDOWN_CONTAINER_CLASS),
/* harmony export */   DROPDOWN_PARENT_CLASS: () => (/* binding */ DROPDOWN_PARENT_CLASS),
/* harmony export */   DROPDOWN_SHOW_CLASS: () => (/* binding */ DROPDOWN_SHOW_CLASS),
/* harmony export */   DROPDOWN_WRAPPER_CLASS: () => (/* binding */ DROPDOWN_WRAPPER_CLASS)
/* harmony export */ });
const DROPDOWN_CLASS = 'option';
const DROPDOWN_CONTAINER_CLASS = 'option-container';
const DROPDOWN_PARENT_CLASS = 'option-parent';
const DROPDOWN_WRAPPER_CLASS = 'option-wrapper';
const DROPDOWN_BACKGROUND_CLASS = 'option-background';
const DROPDOWN_SHOW_CLASS = 'option-show';
const DROPDOWN_ACTIVE_CLASS = 'option-active';


/***/ }),

/***/ "./ts/modal/body/nodes/actions/overlays/dropdown/css.ts":
/*!**************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/overlays/dropdown/css.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/overlays/dropdown/consts.ts");
/* harmony import */ var _nodes_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nodes/consts */ "./ts/modal/body/nodes/consts.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");



function generate() {
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_WRAPPER_CLASS}`, [
        ['z-index', 'var(--overlayIndex)'],
        ['position', 'sticky'],
        ['display', 'flex'],
        ['width', '100%'],
        ['pointer-events', 'initial'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_PARENT_CLASS}`, [
        ['position', 'absolute'],
        ['display', 'flex'],
        ['flex-direction', 'column'],
        ['width', '100%'],
        ['margin-left', '-1px'],
        ['max-height', 'calc(4.2em + 5px)'],
        ['overflow-y', 'auto'],
        ['border-bottom-left-radius', '12px'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_CONTAINER_CLASS}`, [['position', 'relative']]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_CONTAINER_CLASS} > *`, [['height', '1.4em']]);
    const [, base, contrast] = _nodes_consts__WEBPACK_IMPORTED_MODULE_1__.NODE_COLOURS[1];
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_PARENT_CLASS}`, ['border', `1px solid ${base}`]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_CONTAINER_CLASS}`, [
        ['background-color', contrast],
        ['color', base],
        ['border', `1px solid ${base}`],
        ['cursor', 'pointer'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_BACKGROUND_CLASS}`, [['background-color', base]]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_ACTIVE_CLASS} .${_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_CLASS}`, [['color', contrast]]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_ACTIVE_CLASS} .${_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_BACKGROUND_CLASS}`, [['width', '100%']]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_CLASS}`, [
        ['position', 'relative'],
        ['transition-property', 'all'],
        ['transition-duration', '500ms'],
        ['padding', '0 0.6rem'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_BACKGROUND_CLASS}`, [
        ['position', 'absolute'],
        ['width', '0'],
        ['transition', 'width 500ms ease 0s'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_CONTAINER_CLASS}:not(.${_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_SHOW_CLASS})`, [['display', 'none']]);
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/overlays/dropdown/index.ts":
/*!****************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/overlays/dropdown/index.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generate: () => (/* binding */ generate),
/* harmony export */   reset: () => (/* binding */ reset),
/* harmony export */   update: () => (/* binding */ update)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/overlays/dropdown/consts.ts");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../edit */ "./ts/modal/body/nodes/actions/edit/index.ts");
/* harmony import */ var _modal_body__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/body */ "./ts/modal/body/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



const activeOptions = [];
const resetCallbacks = [];
let activeIndex = -1;
function getTop(target, includeHeight = true) {
    const scrollRect = _modal_body__WEBPACK_IMPORTED_MODULE_2__.element.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    // todo this had a `+2` before; may be necessary
    return targetRect.top - scrollRect.top + _modal_body__WEBPACK_IMPORTED_MODULE_2__.element.scrollTop + (includeHeight ? targetRect.height : 0);
}
// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#escaping
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function setActive(option, isActive = true) {
    option.classList[isActive ? 'add' : 'remove'](_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_ACTIVE_CLASS);
}
function deselect() {
    if (activeIndex === -1) {
        return;
    }
    setActive(activeOptions[activeIndex].parentElement, false);
    activeIndex = -1;
}
function update(value) {
    // equivalent to `if (!('options' in node))`
    if (activeOptions.length === 0) {
        return;
    }
    const stringValue = `${value}`;
    const regExp = new RegExp(escapeRegExp(stringValue), 'i');
    for (const { parentElement, innerText } of activeOptions) {
        if (stringValue.length <= innerText.length && regExp.test(innerText)) {
            parentElement.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_SHOW_CLASS);
        }
        else {
            parentElement.classList.remove(_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_SHOW_CLASS);
        }
    }
    const [{ parentElement: { parentElement: wrapper } }] = activeOptions;
    const top = getTop(wrapper);
    // todo remove? seems pointless
    if (_modal_body__WEBPACK_IMPORTED_MODULE_2__.element.scrollTop + _modal_body__WEBPACK_IMPORTED_MODULE_2__.element.clientHeight < top) {
        _modal_body__WEBPACK_IMPORTED_MODULE_2__.element.scrollTop = top - _modal_body__WEBPACK_IMPORTED_MODULE_2__.element.clientHeight;
    }
    deselect();
}
function setValue(node, value) {
    return __awaiter(this, void 0, void 0, function* () {
        node.element.contrast.valueElement.value = value;
        deselect();
        yield (0,_edit__WEBPACK_IMPORTED_MODULE_1__.update)();
    });
}
function reset() {
    while (resetCallbacks.length > 0) {
        resetCallbacks.pop()();
    }
    activeOptions.length = 0;
}
function addListener(target, type, listener, useCapture = false) {
    target.addEventListener(type, listener, useCapture);
    resetCallbacks.push(() => target.removeEventListener(type, listener, useCapture));
}
function generate(node) {
    const wrapper = document.createElement('div');
    const parent = document.createElement('div');
    wrapper.style.width = `${node.element.contrast.valueContainer.clientWidth}px`;
    // avoid blurring an input when dragging the scrollbar
    addListener(wrapper, 'mousedown', (event) => {
        event.stopPropagation();
        event.preventDefault();
    });
    for (const type of ['mouseover', 'mouseout', 'mouseup']) {
        addListener(wrapper, type, (event) => {
            event.stopPropagation();
        });
    }
    for (const value of node.options) {
        const container = document.createElement('div');
        const background = document.createElement('div');
        const option = document.createElement('div');
        option.innerText = value;
        container.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_CONTAINER_CLASS);
        option.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_CLASS);
        background.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_BACKGROUND_CLASS);
        container.append(background, option);
        parent.appendChild(container);
        activeOptions.push(option);
        addListener(container, 'mousedown', (event) => {
            event.stopPropagation();
            event.preventDefault();
        });
        addListener(container, 'click', (event) => __awaiter(this, void 0, void 0, function* () {
            event.stopPropagation();
            yield setValue(node, value);
            node.element.headContainer.focus();
        }));
        addListener(container, 'mouseenter', (event) => {
            event.stopPropagation();
            setActive(container);
        });
        addListener(container, 'mouseleave', (event) => {
            event.stopPropagation();
            setActive(container, false);
        });
    }
    addListener(node.element.contrast.valueElement, 'keydown', (event) => {
        const priorIndex = activeIndex;
        let hasChanged = false;
        switch (event.key) {
            case 'Tab':
            case 'Enter':
                if (activeIndex >= 0) {
                    event.stopPropagation();
                    event.preventDefault();
                    setValue(node, activeOptions[activeIndex].innerText)
                        .then(() => node.element.headContainer.focus());
                }
                return;
            case 'ArrowDown':
                for (let i = activeIndex + 1; i < activeOptions.length; ++i) {
                    const { parentElement } = activeOptions[i];
                    if (parentElement.classList.contains(_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_SHOW_CLASS)) {
                        activeIndex = i;
                        hasChanged = true;
                        const optionBottom = parentElement.offsetTop + parentElement.clientHeight;
                        if (parentElement.parentElement.scrollTop < optionBottom) {
                            parentElement.parentElement.scrollTop = optionBottom - parentElement.parentElement.clientHeight;
                        }
                        const top = getTop(parentElement);
                        if (_modal_body__WEBPACK_IMPORTED_MODULE_2__.element.scrollTop + _modal_body__WEBPACK_IMPORTED_MODULE_2__.element.clientHeight < top - parentElement.parentElement.scrollTop) {
                            _modal_body__WEBPACK_IMPORTED_MODULE_2__.element.scrollTop = top - _modal_body__WEBPACK_IMPORTED_MODULE_2__.element.clientHeight - parentElement.parentElement.scrollTop;
                        }
                        break;
                    }
                }
                break;
            case 'ArrowUp':
                for (let i = activeIndex - 1; i >= 0; --i) {
                    const { parentElement } = activeOptions[i];
                    if (parentElement.classList.contains(_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_SHOW_CLASS)) {
                        activeIndex = i;
                        hasChanged = true;
                        // Scroll option list if necessary
                        if (parentElement.parentElement.scrollTop > parentElement.offsetTop) {
                            parentElement.parentElement.scrollTop = parentElement.offsetTop;
                        }
                        const top = getTop(parentElement, false);
                        // Scroll modal body if necessary
                        if (_modal_body__WEBPACK_IMPORTED_MODULE_2__.element.scrollTop > top - parentElement.parentElement.scrollTop) {
                            _modal_body__WEBPACK_IMPORTED_MODULE_2__.element.scrollTop = top - parentElement.parentElement.scrollTop;
                        }
                        break;
                    }
                }
                if (hasChanged) {
                    break;
                }
            // eslint-disable-next-line no-fallthrough
            default:
                if (activeIndex >= 0) {
                    setActive(activeOptions[activeIndex].parentElement, false);
                }
                activeIndex = -1;
                return;
        }
        if (!hasChanged) {
            return;
        }
        if (priorIndex >= 0) {
            setActive(activeOptions[priorIndex].parentElement, false);
        }
        const { parentElement } = activeOptions[activeIndex];
        setActive(parentElement);
    }, true);
    wrapper.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_WRAPPER_CLASS);
    parent.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.DROPDOWN_PARENT_CLASS);
    wrapper.appendChild(parent);
    return wrapper;
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/overlays/index.ts":
/*!*******************************************************!*\
  !*** ./ts/modal/body/nodes/actions/overlays/index.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dropdown: () => (/* reexport module object */ _dropdown__WEBPACK_IMPORTED_MODULE_3__),
/* harmony export */   hideTooltip: () => (/* binding */ hideTooltip),
/* harmony export */   reset: () => (/* binding */ reset),
/* harmony export */   setNode: () => (/* binding */ setNode),
/* harmony export */   showTooltip: () => (/* binding */ showTooltip),
/* harmony export */   tooltip: () => (/* reexport module object */ _tooltip__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   update: () => (/* binding */ update)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/overlays/consts.ts");
/* harmony import */ var _tooltip_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tooltip/consts */ "./ts/modal/body/nodes/actions/overlays/tooltip/consts.ts");
/* harmony import */ var _tooltip__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tooltip */ "./ts/modal/body/nodes/actions/overlays/tooltip/index.ts");
/* harmony import */ var _dropdown__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dropdown */ "./ts/modal/body/nodes/actions/overlays/dropdown/index.ts");
/* harmony import */ var _scroll__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../scroll */ "./ts/modal/body/nodes/actions/scroll.ts");
/* harmony import */ var _modal_body__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/modal/body */ "./ts/modal/body/index.ts");
/* harmony import */ var _modal_header_actions_sticky__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/modal/header/actions/sticky */ "./ts/modal/header/actions/sticky/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







let activeContainer;
let activeTooltip;
let activeDropdown;
let activeNode;
let activeListener;

function reset() {
    _dropdown__WEBPACK_IMPORTED_MODULE_3__.reset();
    _modal_body__WEBPACK_IMPORTED_MODULE_5__.element.removeEventListener('scroll', activeListener);
    activeContainer.remove();
    activeContainer = undefined;
    activeTooltip = undefined;
    activeDropdown = undefined;
    activeNode = undefined;
    activeListener = undefined;
}
function hideTooltip() {
    _tooltip__WEBPACK_IMPORTED_MODULE_2__.hide(activeTooltip);
}
function getStickyPositions(parent, space, targetMinTop, targetHeight, nodeHeight, node) {
    const targetTop = (0,_scroll__WEBPACK_IMPORTED_MODULE_4__.getStickyScroll)(node);
    const ancestors = node.getAncestors();
    const offset = 'children' in node ? 0 : nodeHeight;
    return [
        () => targetMinTop - _modal_body__WEBPACK_IMPORTED_MODULE_5__.element.clientHeight / 2 > _modal_body__WEBPACK_IMPORTED_MODULE_5__.element.scrollTop, [
            [targetMinTop + targetHeight, targetMinTop - targetTop + targetHeight - offset, 0], ...[node, ...ancestors]
                .map((node) => (0,_scroll__WEBPACK_IMPORTED_MODULE_4__.getStickyScroll)(node, false))
                .map((height, index, { length }) => ([
                height + (length - index) * nodeHeight,
                (length - index - 1) * nodeHeight,
                height,
            ])),
        ].map(([height, top, start]) => ({
            container: (() => {
                const container = document.createElement('div');
                container.style.height = `${space - height}px`;
                container.style.top = `${height}px`;
                container.classList.add(_tooltip_consts__WEBPACK_IMPORTED_MODULE_1__.TOOLTIP_BOTTOM_CLASS);
                parent.appendChild(container);
                return container;
            })(),
            top,
            start,
        })),
    ];
}
function getBasicPosition(parent, space, targetMinTop, targetHeight) {
    return [
        () => targetMinTop - _modal_body__WEBPACK_IMPORTED_MODULE_5__.element.clientHeight / 2 > _modal_body__WEBPACK_IMPORTED_MODULE_5__.element.scrollTop,
        [
            {
                container: (() => {
                    const container = document.createElement('div');
                    container.style.height = `${targetMinTop}px`;
                    container.style.top = '0';
                    container.classList.add(_tooltip_consts__WEBPACK_IMPORTED_MODULE_1__.TOOLTIP_TOP_CLASS);
                    parent.appendChild(container);
                    return container;
                })(),
            }, {
                container: (() => {
                    const container = document.createElement('div');
                    container.style.position = 'absolute';
                    container.style.height = `${space - targetMinTop - targetHeight}px`;
                    container.style.top = '0';
                    container.classList.add(_tooltip_consts__WEBPACK_IMPORTED_MODULE_1__.TOOLTIP_BOTTOM_CLASS);
                    parent.appendChild(container);
                    return container;
                })(),
                top: targetMinTop + targetHeight,
            },
        ],
    ];
}
function applyPosition(basicPositions, stickyPositions, nodeHeight, isAbove, container, tooltipElement, dropdownElement) {
    const containers = [];
    let target;
    tooltipElement.style.removeProperty('transform');
    if (isAbove) {
        tooltipElement.style.top = `${_modal_body__WEBPACK_IMPORTED_MODULE_5__.element.clientHeight - tooltipElement.clientHeight}px`;
        basicPositions[0].container.appendChild(tooltipElement);
        containers.push(basicPositions[0].container);
        if (!dropdownElement) {
            return containers;
        }
        target = dropdownElement;
    }
    else {
        target = tooltipElement;
    }
    if (!(0,_modal_header_actions_sticky__WEBPACK_IMPORTED_MODULE_6__.isActive)()) {
        target.style.top = '0';
        basicPositions[1].container.appendChild(target);
        return [basicPositions[1].container, ...containers];
    }
    let index = 0;
    for (; index < stickyPositions.length - 1; ++index) {
        if (_modal_body__WEBPACK_IMPORTED_MODULE_5__.element.scrollTop < stickyPositions[index + 1].start) {
            break;
        }
    }
    target.style.top = `${stickyPositions[index].top}px`;
    if (stickyPositions[1].start + nodeHeight < _modal_body__WEBPACK_IMPORTED_MODULE_5__.element.scrollTop) {
        tooltipElement.style.top = `${stickyPositions[index].top}px`;
        stickyPositions[index].container.append(target, tooltipElement);
        return [stickyPositions[index].container];
    }
    if (dropdownElement && stickyPositions[1].start < _modal_body__WEBPACK_IMPORTED_MODULE_5__.element.scrollTop) {
        tooltipElement.style.transform = `translateY(${(_modal_body__WEBPACK_IMPORTED_MODULE_5__.element.scrollTop - stickyPositions[1].start)}px)`;
    }
    stickyPositions[index].container.appendChild(target);
    return [stickyPositions[index].container, ...containers];
}
function setPosition(node, container, target, tooltipElement, dropdownElement) {
    const scrollRect = _modal_body__WEBPACK_IMPORTED_MODULE_5__.element.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const nodeRect = node.element.headContainer.getBoundingClientRect();
    const containerLeft = targetRect.left - scrollRect.left;
    container.style.width = `${targetRect.width}px`;
    container.style.left = `${containerLeft}px`;
    const targetMinTop = targetRect.top - scrollRect.top + _modal_body__WEBPACK_IMPORTED_MODULE_5__.element.scrollTop;
    const space = _modal_body__WEBPACK_IMPORTED_MODULE_5__.element.scrollHeight;
    const [isUpBasic, basicPositions] = getBasicPosition(container, space, targetMinTop, targetRect.height);
    const [isUpSticky, stickyPositions] = getStickyPositions(container, space, targetMinTop, targetRect.height, nodeRect.height, node);
    let isAbove;
    const listener = () => {
        isAbove = dropdownElement || ((0,_modal_header_actions_sticky__WEBPACK_IMPORTED_MODULE_6__.isActive)() ? isUpSticky() : isUpBasic());
        applyPosition(basicPositions, stickyPositions, nodeRect.height, isAbove, container, tooltipElement, dropdownElement);
    };
    listener();
    // todo stop using scroll listeners;
    //  use intersection observers to detect specific scrollTops & act accordingly
    //  try using a branch of divs instead of manually changing styles
    _modal_body__WEBPACK_IMPORTED_MODULE_5__.element.addEventListener('scroll', listener);
    return listener;
}
function generate(node, target, tooltipElement, dropdownElement) {
    const container = document.createElement('div');
    const { elementContainer: parent } = node.getRoot().element;
    container.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.CONTAINER_CLASS);
    parent.appendChild(container, parent.firstChild);
    return [container, setPosition(node, container, target, tooltipElement, dropdownElement)];
}
function update() {
    _dropdown__WEBPACK_IMPORTED_MODULE_3__.update(activeNode.value);
    _tooltip__WEBPACK_IMPORTED_MODULE_2__.fade(activeTooltip);
    // handle possible dropdown height change
    activeListener();
}
function setTooltipMessage(message, tooltipElement = activeTooltip, container = activeContainer, isRight = true) {
    const box = tooltipElement.querySelector(`.${_tooltip_consts__WEBPACK_IMPORTED_MODULE_1__.TOOLTIP_BOX_CLASS}`);
    box.innerText = message;
    if (isRight) {
        box.style.right = `${Math.max(0, box.offsetWidth / 2 - _modal_body__WEBPACK_IMPORTED_MODULE_5__.element.clientWidth + container.offsetLeft + container.clientWidth / 2)}px`;
    }
    else {
        box.style.left = `${Math.max(0, box.offsetWidth / 2 - container.offsetLeft - container.clientWidth / 2)}px`;
    }
}
function showTooltip(message, node, target) {
    return __awaiter(this, void 0, void 0, function* () {
        if (node === activeNode) {
            // handle possible tooltip height change
            activeListener();
            // handle possible width change
            setTooltipMessage(message);
            return;
        }
        const tooltipElement = _tooltip__WEBPACK_IMPORTED_MODULE_2__.getAnimated();
        const [container, listener] = generate(node, target, tooltipElement);
        setTooltipMessage(message, tooltipElement, container, false);
        yield _tooltip__WEBPACK_IMPORTED_MODULE_2__.animationEnd();
        _modal_body__WEBPACK_IMPORTED_MODULE_5__.element.removeEventListener('scroll', listener);
        container.remove();
    });
}
function setNode(node) {
    activeNode = node;
    activeTooltip = _tooltip__WEBPACK_IMPORTED_MODULE_2__.generate(node.element.contrast.valueElement.type === 'color');
    if ('options' in node) {
        activeDropdown = _dropdown__WEBPACK_IMPORTED_MODULE_3__.generate(node);
        _dropdown__WEBPACK_IMPORTED_MODULE_3__.update(node.value);
    }
    [activeContainer, activeListener] = generate(activeNode, node.element.contrast.valueContainer, activeTooltip, activeDropdown);
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/overlays/tooltip/consts.ts":
/*!****************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/overlays/tooltip/consts.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MESSAGE_UNRESOLVED: () => (/* binding */ MESSAGE_UNRESOLVED),
/* harmony export */   TOOLTIP_ANIMATION: () => (/* binding */ TOOLTIP_ANIMATION),
/* harmony export */   TOOLTIP_ANIMATION_FAST: () => (/* binding */ TOOLTIP_ANIMATION_FAST),
/* harmony export */   TOOLTIP_ARROW_CLASS: () => (/* binding */ TOOLTIP_ARROW_CLASS),
/* harmony export */   TOOLTIP_BOTTOM_CLASS: () => (/* binding */ TOOLTIP_BOTTOM_CLASS),
/* harmony export */   TOOLTIP_BOX_CLASS: () => (/* binding */ TOOLTIP_BOX_CLASS),
/* harmony export */   TOOLTIP_CONTAINER_CLASS: () => (/* binding */ TOOLTIP_CONTAINER_CLASS),
/* harmony export */   TOOLTIP_REVERSE_CLASS: () => (/* binding */ TOOLTIP_REVERSE_CLASS),
/* harmony export */   TOOLTIP_TOP_CLASS: () => (/* binding */ TOOLTIP_TOP_CLASS)
/* harmony export */ });
const TOOLTIP_CONTAINER_CLASS = 'tooltip-container';
const TOOLTIP_ARROW_CLASS = 'modal-arrow-wrapper';
const TOOLTIP_BOX_CLASS = 'tooltip';
const TOOLTIP_TOP_CLASS = 'tooltip-above';
const TOOLTIP_BOTTOM_CLASS = 'tooltip-below';
const TOOLTIP_REVERSE_CLASS = 'tooltip-reverse';
const TOOLTIP_ANIMATION = [
    [
        // keyframes
        { opacity: 1 },
        { opacity: 1 },
        { opacity: 0 },
    ], { duration: 2000 },
];
const TOOLTIP_ANIMATION_FAST = [
    [
        // keyframes
        { opacity: 1 },
        { opacity: 0 },
    ], { duration: 1000 },
];
const MESSAGE_UNRESOLVED = 'Please wait for validation';


/***/ }),

/***/ "./ts/modal/body/nodes/actions/overlays/tooltip/css.ts":
/*!*************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/overlays/tooltip/css.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/overlays/tooltip/consts.ts");
/* harmony import */ var _nodes_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nodes/consts */ "./ts/modal/body/nodes/consts.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");
/* harmony import */ var _dropdown_consts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dropdown/consts */ "./ts/modal/body/nodes/actions/overlays/dropdown/consts.ts");




function generate() {
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_CONTAINER_CLASS}`, [
        ['position', 'sticky'],
        ['text-align', 'center'],
        ['display', 'flex'],
        ['flex-direction', 'column'],
        ['align-items', 'center'],
        ['width', '10em'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_TOP_CLASS}:not(.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_REVERSE_CLASS}) .${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_ARROW_CLASS}`,
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_BOTTOM_CLASS}.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_REVERSE_CLASS} .${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_ARROW_CLASS}`,
        `.${_dropdown_consts__WEBPACK_IMPORTED_MODULE_3__.DROPDOWN_WRAPPER_CLASS} + * > .${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_ARROW_CLASS}`,
    ], [
        ['top', '100%'],
        ['border-color', 'var(--borderTooltip) transparent transparent transparent'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_BOTTOM_CLASS}:not(.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_REVERSE_CLASS}):not(:has(.${_dropdown_consts__WEBPACK_IMPORTED_MODULE_3__.DROPDOWN_WRAPPER_CLASS})) .${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_ARROW_CLASS}`,
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_TOP_CLASS}.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_REVERSE_CLASS}:not(:has(.${_dropdown_consts__WEBPACK_IMPORTED_MODULE_3__.DROPDOWN_WRAPPER_CLASS})) .${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_ARROW_CLASS}`,
    ], [
        ['bottom', '100%'],
        ['border-color', 'transparent transparent var(--borderTooltip) transparent'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_TOP_CLASS}:not(.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_REVERSE_CLASS}) .${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_CONTAINER_CLASS}`,
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_BOTTOM_CLASS}.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_REVERSE_CLASS} .${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_CONTAINER_CLASS}`,
    ], ['translate', '0 -0.5em']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([`.${_dropdown_consts__WEBPACK_IMPORTED_MODULE_3__.DROPDOWN_WRAPPER_CLASS} + .${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_CONTAINER_CLASS}`], ['translate', '0px calc(-100% - 0.5em)']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_BOTTOM_CLASS}:not(.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_REVERSE_CLASS}):not(:has(.${_dropdown_consts__WEBPACK_IMPORTED_MODULE_3__.DROPDOWN_WRAPPER_CLASS})) .${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_CONTAINER_CLASS}`,
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_TOP_CLASS}.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_REVERSE_CLASS}:not(:has(.${_dropdown_consts__WEBPACK_IMPORTED_MODULE_3__.DROPDOWN_WRAPPER_CLASS})) .${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_CONTAINER_CLASS}`,
    ], [['translate', '0 0.5em']]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_BOX_CLASS}`, [
        ['font-size', '0.9em'],
        ['padding', '3px 15px'],
        ['border-radius', '1em'],
        ['border', 'solid 3px var(--borderTooltip)'],
        ['background-color', _nodes_consts__WEBPACK_IMPORTED_MODULE_1__.NODE_COLOURS[1][1]],
        ['color', _nodes_consts__WEBPACK_IMPORTED_MODULE_1__.NODE_COLOURS[1][2]],
        ['position', 'relative'],
    ]);
    // Don't show when there's no hint to give
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([`:has(> .${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_BOX_CLASS}:empty)`], ['display', 'none']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_ARROW_CLASS}`, [
        ['position', 'absolute'],
        ['left', '50%'],
        ['margin-left', '-0.5em'],
        ['border-width', '0.5em'],
        ['border-style', 'solid'],
    ]);
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/overlays/tooltip/index.ts":
/*!***************************************************************!*\
  !*** ./ts/modal/body/nodes/actions/overlays/tooltip/index.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   animationEnd: () => (/* binding */ animationEnd),
/* harmony export */   fade: () => (/* binding */ fade),
/* harmony export */   generate: () => (/* binding */ generate),
/* harmony export */   getAnimated: () => (/* binding */ getAnimated),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   kill: () => (/* binding */ kill)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/actions/overlays/tooltip/consts.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

let animation;
function animationEnd() {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            animation.addEventListener('finish', resolve);
        });
    });
}
function kill() {
    animation === null || animation === void 0 ? void 0 : animation.finish();
}
function generate(doReverse = false) {
    const container = document.createElement('div');
    const arrow = document.createElement('div');
    const box = document.createElement('div');
    container.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_CONTAINER_CLASS);
    arrow.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_ARROW_CLASS);
    box.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_BOX_CLASS);
    if (doReverse) {
        arrow.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_REVERSE_CLASS);
    }
    container.append(arrow, box);
    return container;
}
function getAnimated() {
    const element = generate();
    animation = element.animate(..._consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_ANIMATION);
    animation.onfinish = ({ target }) => {
        element.remove();
        if (target === animation) {
            animation = undefined;
        }
    };
    return element;
}
function fade(container) {
    if (container.querySelector(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_BOX_CLASS}`).matches(':empty')) {
        return;
    }
    kill();
    animation = container.animate(..._consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_ANIMATION_FAST);
    animation.onfinish = ({ target }) => {
        if (target === animation) {
            animation = undefined;
        }
    };
}
function hide(element) {
    element.querySelector(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_BOX_CLASS}`).innerText = '';
}


/***/ }),

/***/ "./ts/modal/body/nodes/actions/scroll.ts":
/*!***********************************************!*\
  !*** ./ts/modal/body/nodes/actions/scroll.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   basicScroll: () => (/* binding */ basicScroll),
/* harmony export */   getStickyScroll: () => (/* binding */ getStickyScroll),
/* harmony export */   scroll: () => (/* binding */ scroll),
/* harmony export */   stickyScroll: () => (/* binding */ stickyScroll)
/* harmony export */ });
/* harmony import */ var _focus_consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./focus/consts */ "./ts/modal/body/nodes/actions/focus/consts.ts");
/* harmony import */ var _focus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./focus */ "./ts/modal/body/nodes/actions/focus/index.ts");
/* harmony import */ var _modal_body__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/body */ "./ts/modal/body/index.ts");
/* harmony import */ var _modal_header_actions_sticky__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modal/header/actions/sticky */ "./ts/modal/header/actions/sticky/index.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");





// specifically returns the last *visible* descendant
function getLastDescendant(node, isFocus = (0,_focus__WEBPACK_IMPORTED_MODULE_1__.isActive)()) {
    if ('children' in node && node.children.length > 0 && (!isFocus || node.element.hasClass(_focus_consts__WEBPACK_IMPORTED_MODULE_0__.FOCUS_CLASS))) {
        for (let i = node.children.length - 1; i >= 0; --i) {
            if (node.children[i].element.elementContainer.clientHeight > 0) {
                return getLastDescendant(node.children[i], isFocus);
            }
        }
    }
    return node;
}
// a scrollIntoView replacement for sticky positioning
function getStickyScroll(node, alignToTop = true) {
    const firstChild = alignToTop ? node : getLastDescendant(node);
    const { height } = node.element.headContainer.getBoundingClientRect();
    let depth = 0;
    for (let root = node; 'parent' in root; root = root.parent) {
        depth++;
    }
    return Math.ceil(firstChild.element.headContainer.getBoundingClientRect().top
        - _modal_body__WEBPACK_IMPORTED_MODULE_2__.element.getBoundingClientRect().top
        + _modal_body__WEBPACK_IMPORTED_MODULE_2__.element.scrollTop
        - (height + _modal_consts__WEBPACK_IMPORTED_MODULE_4__.SUB_PIXEL_BS) * depth);
}
function stickyScroll(node, doSnap = true, alignToTop = true) {
    const scroll = getStickyScroll(node, alignToTop);
    if (alignToTop) {
        _modal_body__WEBPACK_IMPORTED_MODULE_2__.element.scrollTo({ top: scroll, behavior: doSnap ? 'auto' : 'smooth' });
    }
    else if (_modal_body__WEBPACK_IMPORTED_MODULE_2__.element.scrollTop > scroll) {
        _modal_body__WEBPACK_IMPORTED_MODULE_2__.element.scrollTop = scroll;
    }
}
function basicScroll(node) {
    node.element.scrollIntoView({ block: 'center' });
}
function scroll(node) {
    if ((0,_modal_header_actions_sticky__WEBPACK_IMPORTED_MODULE_3__.isActive)()) {
        stickyScroll(node);
    }
    else {
        basicScroll(node);
    }
}


/***/ }),

/***/ "./ts/modal/body/nodes/child.ts":
/*!**************************************!*\
  !*** ./ts/modal/body/nodes/child.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Child)
/* harmony export */ });
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ "./ts/modal/body/nodes/element.ts");
/* harmony import */ var _queue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./queue */ "./ts/modal/body/nodes/queue.ts");
/* harmony import */ var _actions_highlight__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./actions/highlight */ "./ts/modal/body/nodes/actions/highlight/index.ts");
/* harmony import */ var _actions_edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actions/edit */ "./ts/modal/body/nodes/actions/edit/index.ts");
/* harmony import */ var _actions_focus__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./actions/focus */ "./ts/modal/body/nodes/actions/focus/index.ts");
/* harmony import */ var _actions_hide__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./actions/hide */ "./ts/modal/body/nodes/actions/hide/index.ts");
/* harmony import */ var _actions_callbacks_update__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./actions/callbacks/update */ "./ts/modal/body/nodes/actions/callbacks/update.ts");
/* harmony import */ var _actions_buttons_disable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./actions/buttons/disable */ "./ts/modal/body/nodes/actions/buttons/disable/index.ts");
/* harmony import */ var _actions_buttons_move__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./actions/buttons/move */ "./ts/modal/body/nodes/actions/buttons/move/index.ts");
/* harmony import */ var _actions_buttons_duplicate__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./actions/buttons/duplicate */ "./ts/modal/body/nodes/actions/buttons/duplicate/index.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @types */ "./ts/library/validation/types.ts");











const actions = [
    // No button
    _actions_highlight__WEBPACK_IMPORTED_MODULE_2__,
    _actions_focus__WEBPACK_IMPORTED_MODULE_4__,
    _actions_edit__WEBPACK_IMPORTED_MODULE_3__,
    _actions_hide__WEBPACK_IMPORTED_MODULE_5__,
    // Button
    _actions_buttons_disable__WEBPACK_IMPORTED_MODULE_7__,
    _actions_buttons_move__WEBPACK_IMPORTED_MODULE_8__,
    _actions_buttons_duplicate__WEBPACK_IMPORTED_MODULE_9__,
];
class Child {
    constructor(data, parent, index) {
        this.isActive = true;
        this.element = new _element__WEBPACK_IMPORTED_MODULE_0__["default"](data);
        for (const key of _types__WEBPACK_IMPORTED_MODULE_10__.LEAF_KEYS) {
            if (key in data) {
                this[key] = data[key];
            }
        }
        this.forceValid = !('predicate' in data) && !('options' in data);
        this.attach(parent, index);
        for (const { shouldMount, mount } of actions) {
            if (shouldMount(this)) {
                mount(this);
            }
        }
        if ('predicate' in data) {
            this.predicate = () => data.predicate(this.value);
        }
        if ('onUpdate' in data) {
            this.onUpdate = () => (0,_queue__WEBPACK_IMPORTED_MODULE_1__.onceVisualsUpdate)(() => data.onUpdate(this.value));
            (0,_actions_callbacks_update__WEBPACK_IMPORTED_MODULE_6__.handle)(this.onUpdate(), 'onUpdate', this);
        }
    }
    getRoot() {
        return this.parent.getRoot();
    }
    getAncestors() {
        return [this.parent, ...this.parent.getAncestors()];
    }
    getIndex() {
        return this.parent.children.indexOf(this);
    }
    detach() {
        this.parent.children.splice(this.getIndex(), 1);
        this.element.remove();
        this.parent = undefined;
    }
    attach(parent, index = parent.children.length) {
        parent.children.splice(index, 0, this);
        parent.element.addChild(this.element, index);
        this.parent = parent;
    }
    move(parent, to) {
        this.detach();
        this.attach(parent, typeof to === 'number' ? to : to.getIndex() + 1);
    }
    duplicate() {
        return new Child(this.getSeedData(), this.parent, this.getIndex() + 1);
    }
    unmount() {
        for (const action of actions) {
            if ('unmount' in action) {
                action.unmount(this);
            }
        }
    }
    disconnect() {
        this.unmount();
        this.detach();
    }
    getSeedData() {
        const data = {};
        for (const key of _types__WEBPACK_IMPORTED_MODULE_10__.LEAF_KEYS) {
            if (key in this) {
                data[key] = this[key];
            }
        }
        return data;
    }
    getPredicateData() {
        const data = {};
        for (const key of _types__WEBPACK_IMPORTED_MODULE_10__.SAVED_KEYS) {
            if (key in this) {
                data[key] = this[key];
            }
        }
        if (data.isActive) {
            delete data.isActive;
        }
        return data;
    }
    getSaveData(isActiveBranch) {
        const tree = this.getPredicateData();
        if (isActiveBranch) {
            return {
                tree,
                activeTree: tree,
                configs: 'get' in this ? [this.get(tree, [])] : [],
            };
        }
        return { tree };
    }
}


/***/ }),

/***/ "./ts/modal/body/nodes/consts.ts":
/*!***************************************!*\
  !*** ./ts/modal/body/nodes/consts.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BASE_CLASS: () => (/* binding */ BASE_CLASS),
/* harmony export */   CHECKBOX_WRAPPER_CLASS: () => (/* binding */ CHECKBOX_WRAPPER_CLASS),
/* harmony export */   CONTRAST_CLASS: () => (/* binding */ CONTRAST_CLASS),
/* harmony export */   EDITABLE_CLASS: () => (/* binding */ EDITABLE_CLASS),
/* harmony export */   ELEMENT_CLASSES: () => (/* binding */ ELEMENT_CLASSES),
/* harmony export */   MIDDLE_CLASS: () => (/* binding */ MIDDLE_CLASS),
/* harmony export */   NODE_COLOURS: () => (/* binding */ NODE_COLOURS),
/* harmony export */   ROOT_CLASS: () => (/* binding */ ROOT_CLASS)
/* harmony export */ });
const ROOT_CLASS = 'root';
const MIDDLE_CLASS = 'middle';
const ELEMENT_CLASSES = {
    ELEMENT_CONTAINER: 'node',
    BACKGROUND_CONTAINER: 'node-background-container',
    CHILD_CONTAINER: 'node-child-container',
    BUTTON_CONTAINER: 'node-button-container',
    INFO_CONTAINER: 'node-info-container',
    HEAD_CONTAINER: 'node-head-container',
    VALUE_CONTAINER: 'node-value-container',
    VALUE: 'node-value',
    LABEL_CONTAINER: 'node-label-container',
    LABEL: 'node-label',
};
const BASE_CLASS = 'node-base';
const CONTRAST_CLASS = 'node-contrast';
const CHECKBOX_WRAPPER_CLASS = 'checkbox-wrapper';
const EDITABLE_CLASS = 'editable';
const NODE_COLOURS = [
    [`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${EDITABLE_CLASS})`, 'var(--nodeHeaderBase)', 'var(--nodeHeaderContrast)'],
    [`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}.${MIDDLE_CLASS}.${EDITABLE_CLASS}`, 'var(--nodeBlendBase)', 'var(--nodeBlendContrast)'],
    [`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${MIDDLE_CLASS}).${EDITABLE_CLASS}`, 'var(--nodeValueBase)', 'var(--nodeValueContrast)'],
];


/***/ }),

/***/ "./ts/modal/body/nodes/css.ts":
/*!************************************!*\
  !*** ./ts/modal/body/nodes/css.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/consts.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");



function generate() {
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ROOT_CLASS}`, [
        ['flex-grow', '1'],
        // Apparently it has min-height 100% without a content-related height value
        ['height', 'fit-content'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.CHILD_CONTAINER}:empty`, ['display', 'none']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`:not(.${_consts__WEBPACK_IMPORTED_MODULE_0__.ROOT_CLASS}) > .${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.CHILD_CONTAINER}`, ['margin-left', '1.8em']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.ELEMENT_CONTAINER}`, [
        ['user-select', 'none'],
        ['position', 'relative'],
        ['border-width', `${_modal_consts__WEBPACK_IMPORTED_MODULE_1__.SUB_PIXEL_BS}px`],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.INFO_CONTAINER} > *`], [
        ['position', 'absolute'],
        ['width', '100%'],
        ['height', '100%'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.VALUE_CONTAINER}`, `.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.LABEL_CONTAINER}`], [
        ['position', 'absolute'],
        ['white-space', 'nowrap'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.INFO_CONTAINER}`, ['position', 'relative']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([`.${_consts__WEBPACK_IMPORTED_MODULE_0__.BASE_CLASS} > .${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.VALUE_CONTAINER}`], [
        ['position', 'absolute'],
        ['right', '0'],
        ['overflow', 'hidden'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.HEAD_CONTAINER}`,
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.VALUE_CONTAINER}`,
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.LABEL_CONTAINER}`,
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.BACKGROUND_CONTAINER}`,
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.INFO_CONTAINER}`,
    ], [
        ['flex-grow', '1'],
        ['display', 'flex'],
        ['align-items', 'center'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.BACKGROUND_CONTAINER}`], [['position', 'absolute']]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.LABEL_CONTAINER}`, [
        ['right', '0'],
        ['pointer-events', 'none'],
        ['height', '100%'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.VALUE_CONTAINER}`, [
        ['user-select', 'none'],
        ['height', '100%'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.BACKGROUND_CONTAINER}`, `.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.VALUE_CONTAINER}`], [['width', '100%']]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.BACKGROUND_CONTAINER} > *`, [
        ['height', '100%'],
        ['position', 'absolute'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.VALUE}`, `.${_consts__WEBPACK_IMPORTED_MODULE_0__.CHECKBOX_WRAPPER_CLASS}`], [
        ['padding-right', '0.6em'],
        ['padding-left', '0.6em'],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.HEAD_CONTAINER}`, [
        ['background-color', 'inherit'],
        ['user-select', 'none'],
        ['height', `${_modal_consts__WEBPACK_IMPORTED_MODULE_1__.NODE_HEIGHT}em`],
    ]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.HEAD_CONTAINER} > *`, ['height', '100%']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${_consts__WEBPACK_IMPORTED_MODULE_0__.ROOT_CLASS})`, ['border-top-style', 'solid']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.MIDDLE_CLASS} .${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.ELEMENT_CONTAINER}`, ['border-left-style', 'solid']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.ROOT_CLASS}`, ['border-bottom-style', 'solid']);
    for (const [selector, base, contrast] of _consts__WEBPACK_IMPORTED_MODULE_0__.NODE_COLOURS) {
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(selector, [
            ['background-color', base],
            ['color', contrast],
        ]);
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`${selector}`, ['border-color', contrast]);
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`${selector} > .${_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.HEAD_CONTAINER}`, ['outline', `1px solid ${contrast}`]);
    }
}


/***/ }),

/***/ "./ts/modal/body/nodes/element.ts":
/*!****************************************!*\
  !*** ./ts/modal/body/nodes/element.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Element)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/consts.ts");

class Element {
    constructor(data) {
        this.elementContainer = document.createElement('div');
        this.backgroundContainer = document.createElement('div');
        this.headContainer = document.createElement('span');
        this.buttonContainer = document.createElement('span');
        this.infoContainer = document.createElement('span');
        this.base = { container: document.createElement('span') };
        this.contrast = { container: document.createElement('span') };
        this.childContainer = document.createElement('div');
        this.elementContainer.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.ELEMENT_CONTAINER);
        this.backgroundContainer.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.BACKGROUND_CONTAINER);
        this.childContainer.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.CHILD_CONTAINER);
        this.infoContainer.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.INFO_CONTAINER);
        this.headContainer.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.HEAD_CONTAINER);
        this.buttonContainer.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.BUTTON_CONTAINER);
        this.base.container.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.BASE_CLASS);
        this.contrast.container.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.CONTRAST_CLASS);
        if ('value' in data) {
            this.addValueContainer(this.contrast, data);
            this.addValueContainer(this.base, data);
            this.render(data.value);
        }
        if ('label' in data) {
            this.addLabelContainer(this.contrast, data.label);
            this.addLabelContainer(this.base, data.label);
        }
        this.infoContainer.append(this.backgroundContainer, this.contrast.container, this.base.container);
        this.headContainer.append(this.buttonContainer, this.infoContainer);
        this.elementContainer.appendChild(this.headContainer);
        this.elementContainer.appendChild(this.childContainer);
    }
    addLabelContainer({ container }, label) {
        const labelContainer = document.createElement('div');
        const labelElement = document.createElement('span');
        labelContainer.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.LABEL_CONTAINER);
        labelElement.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.LABEL);
        labelElement.innerText = label;
        labelContainer.appendChild(labelElement);
        container.appendChild(labelContainer);
    }
    addValueContainer(field, data) {
        field.valueContainer = document.createElement('label');
        field.valueContainer.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.VALUE_CONTAINER);
        if ('value' in data) {
            field.valueElement = document.createElement('input');
            field.valueElement.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CLASSES.VALUE);
            if ('inputAttributes' in data) {
                for (const [key, value] of Object.entries(data.inputAttributes)) {
                    field.valueElement.setAttribute(key, value);
                }
            }
            field.valueElement.setAttribute('tabindex', '-1');
            if (typeof data.value === 'boolean') {
                field.valueElement.type = 'checkbox';
                // Positions tooltips below checkboxes
                const valueWrapper = document.createElement('span');
                valueWrapper.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.CHECKBOX_WRAPPER_CLASS);
                valueWrapper.appendChild(field.valueElement);
                field.valueContainer.appendChild(valueWrapper);
            }
            else {
                if (typeof data.value === 'number') {
                    field.valueElement.type = 'number';
                    // Disables a tooltip implying that decimal values are invalid
                    field.valueElement.step = 'any';
                }
                else if ('input' in data) {
                    field.valueElement.type = data.input;
                }
                field.valueContainer.appendChild(field.valueElement);
            }
        }
        field.container.appendChild(field.valueContainer);
    }
    render(value) {
        if (typeof value === 'boolean') {
            this.base.valueElement.checked = value;
            this.contrast.valueElement.checked = value;
        }
        else {
            this.base.valueElement.value = value.toString();
            this.contrast.valueElement.value = value.toString();
        }
    }
    hasClass(...names) {
        for (const name of names) {
            if (this.elementContainer.classList.contains(name)) {
                return true;
            }
        }
        return false;
    }
    addClass(...names) {
        for (const name of names) {
            this.elementContainer.classList.add(name);
        }
    }
    removeClass(...names) {
        for (const name of names) {
            this.elementContainer.classList.remove(name);
        }
    }
    addChild(child, index) {
        var _a;
        this.childContainer.insertBefore(child.elementContainer, (_a = this.childContainer.children[index]) !== null && _a !== void 0 ? _a : null);
    }
    addButton(button) {
        this.buttonContainer.appendChild(button);
    }
    remove() {
        this.elementContainer.remove();
    }
    scrollIntoView(options) {
        this.backgroundContainer.scrollIntoView(typeof options === 'object' ? Object.assign({ block: 'center' }, options) : options);
    }
}


/***/ }),

/***/ "./ts/modal/body/nodes/middle.ts":
/*!***************************************!*\
  !*** ./ts/modal/body/nodes/middle.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Middle)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/consts.ts");
/* harmony import */ var _root__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./root */ "./ts/modal/body/nodes/root.ts");
/* harmony import */ var _child__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./child */ "./ts/modal/body/nodes/child.ts");
/* harmony import */ var _pools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pools */ "./ts/modal/body/nodes/pools.ts");
/* harmony import */ var _actions_buttons_create__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./actions/buttons/create */ "./ts/modal/body/nodes/actions/buttons/create/index.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @types */ "./ts/library/validation/types.ts");






const MIDDLE_KEYS = _types__WEBPACK_IMPORTED_MODULE_5__.MIDDLE_KEYS.filter((key) => key !== 'children');
const actions = [_actions_buttons_create__WEBPACK_IMPORTED_MODULE_4__];
class Middle extends _child__WEBPACK_IMPORTED_MODULE_2__["default"] {
    constructor(data, parent, index) {
        super(data, parent, index);
        this.children = [];
        _root__WEBPACK_IMPORTED_MODULE_1__.setup.call(this, data);
        this.element.addClass(_consts__WEBPACK_IMPORTED_MODULE_0__.MIDDLE_CLASS);
        for (const { shouldMount, mount } of actions) {
            if (shouldMount(this)) {
                mount(this);
            }
        }
    }
    duplicate() {
        return new Middle(this.getSeedData(), this.parent, this.getIndex() + 1);
    }
    unmount() {
        super.unmount();
        for (const action of actions) {
            if ('unmount' in action) {
                action.unmount(this);
            }
        }
        if ('poolId' in this) {
            (0,_pools__WEBPACK_IMPORTED_MODULE_3__.remove)(this.poolId, this);
        }
        for (const child of this.children) {
            child.unmount();
        }
    }
    disconnect() {
        this.unmount();
        this.detach();
    }
    // for duplication
    getSeedData() {
        const data = {};
        for (const key of MIDDLE_KEYS) {
            if (key in this) {
                data[key] = this[key];
            }
        }
        return Object.assign(Object.assign(Object.assign({}, super.getSeedData()), data), { children: this.children.map((child) => child.getSeedData()) });
    }
    getPredicateData() {
        return Object.assign(Object.assign({}, super.getPredicateData()), _root__WEBPACK_IMPORTED_MODULE_1__.getPredicateData.call(this));
    }
    getSaveData(isActiveBranch) {
        const data = _root__WEBPACK_IMPORTED_MODULE_1__.getSaveData.call(this, isActiveBranch);
        const tree = Object.assign(Object.assign({}, super.getPredicateData()), data.tree);
        if (isActiveBranch) {
            const activeTree = Object.assign(Object.assign({}, tree), data.activeTree);
            return {
                tree,
                activeTree,
                configs: 'get' in this ? [this.get(activeTree, data.configs)] : data.configs,
            };
        }
        return { tree };
    }
}


/***/ }),

/***/ "./ts/modal/body/nodes/pools.ts":
/*!**************************************!*\
  !*** ./ts/modal/body/nodes/pools.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   get: () => (/* binding */ get),
/* harmony export */   remove: () => (/* binding */ remove)
/* harmony export */ });
const pools = [];
function get(node) {
    var _a;
    return [...((_a = pools[node.poolId]) !== null && _a !== void 0 ? _a : [node])];
}
function add(id, node) {
    var _a;
    (_a = pools[id]) !== null && _a !== void 0 ? _a : (pools[id] = []);
    pools[id].push(node);
}
function remove(id, node) {
    pools[id].splice(pools[id].indexOf(node), 1);
}


/***/ }),

/***/ "./ts/modal/body/nodes/queue.ts":
/*!**************************************!*\
  !*** ./ts/modal/body/nodes/queue.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   onceVisualsUpdate: () => (/* binding */ onceVisualsUpdate)
/* harmony export */ });
const queue = [];
// No idea if this works on all machines/browsers
function onceVisualsUpdate(_callback) {
    return new Promise((resolve) => {
        const callback = () => resolve(_callback());
        if (queue.push(callback) > 1) {
            return;
        }
        // Wait for update to start
        requestAnimationFrame(() => {
            // Wait for everything else to update
            window.setTimeout(() => {
                for (const callback of queue) {
                    callback();
                }
                queue.length = 0;
            }, 0);
        });
    });
}


/***/ }),

/***/ "./ts/modal/body/nodes/root.ts":
/*!*************************************!*\
  !*** ./ts/modal/body/nodes/root.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Root),
/* harmony export */   getPredicateData: () => (/* binding */ getPredicateData),
/* harmony export */   getSaveData: () => (/* binding */ getSaveData),
/* harmony export */   setup: () => (/* binding */ setup)
/* harmony export */ });
/* harmony import */ var _middle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./middle */ "./ts/modal/body/nodes/middle.ts");
/* harmony import */ var _child__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./child */ "./ts/modal/body/nodes/child.ts");
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./element */ "./ts/modal/body/nodes/element.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/nodes/consts.ts");
/* harmony import */ var _queue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./queue */ "./ts/modal/body/nodes/queue.ts");
/* harmony import */ var _pools__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pools */ "./ts/modal/body/nodes/pools.ts");
/* harmony import */ var _actions_highlight__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./actions/highlight */ "./ts/modal/body/nodes/actions/highlight/index.ts");
/* harmony import */ var _actions_focus__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./actions/focus */ "./ts/modal/body/nodes/actions/focus/index.ts");
/* harmony import */ var _actions_buttons_create__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./actions/buttons/create */ "./ts/modal/body/nodes/actions/buttons/create/index.ts");
/* harmony import */ var _actions_callbacks_update__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./actions/callbacks/update */ "./ts/modal/body/nodes/actions/callbacks/update.ts");
/* harmony import */ var _actions_buttons_consts__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./actions/buttons/consts */ "./ts/modal/body/nodes/actions/buttons/consts.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @types */ "./ts/library/validation/types.ts");
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};












const actions = [_actions_highlight__WEBPACK_IMPORTED_MODULE_6__, _actions_focus__WEBPACK_IMPORTED_MODULE_7__, _actions_buttons_create__WEBPACK_IMPORTED_MODULE_8__];
function isActive(child) {
    return !('isActive' in child) || child.isActive;
}
function getChildPredicateData({ children }) {
    return children
        .filter((child) => isActive(child) && !child.element.hasClass(_actions_buttons_consts__WEBPACK_IMPORTED_MODULE_10__.TEST_REMOVE_CLASS))
        .map((child) => child.getPredicateData());
}
function getChildSaveData({ children }, isActiveBranch = true) {
    return children
        .filter((child) => !child.element.hasClass(_actions_buttons_consts__WEBPACK_IMPORTED_MODULE_10__.TEST_ADD_CLASS))
        .map((child) => child.getSaveData(isActive(child) && isActiveBranch));
}
function addChildren(children) {
    for (const child of children) {
        if ('children' in child) {
            new _middle__WEBPACK_IMPORTED_MODULE_0__["default"](child, this);
        }
        else {
            new _child__WEBPACK_IMPORTED_MODULE_1__["default"](child, this);
        }
    }
}
function setup(_a) {
    var { children } = _a, data = __rest(_a, ["children"]);
    for (const key of _types__WEBPACK_IMPORTED_MODULE_11__.ROOT_OTHER_KEYS) {
        if (key in data) {
            this[key] = data[key];
        }
    }
    addChildren.call(this, children);
    for (const key of _types__WEBPACK_IMPORTED_MODULE_11__.ROOT_PREDICATE_KEYS) {
        if (key in data) {
            this[key] = () => data[key](getChildPredicateData(this));
        }
    }
    for (const key of _types__WEBPACK_IMPORTED_MODULE_11__.ROOT_UPDATE_KEYS) {
        if (key in data) {
            this[key] = () => (0,_queue__WEBPACK_IMPORTED_MODULE_4__.onceVisualsUpdate)(() => data[key](getChildPredicateData(this)));
            (0,_actions_callbacks_update__WEBPACK_IMPORTED_MODULE_9__.handle)(this[key](), key, this);
        }
    }
    if ('poolId' in data) {
        (0,_pools__WEBPACK_IMPORTED_MODULE_5__.add)(data.poolId, this);
    }
}
function getPredicateData() {
    return { children: getChildPredicateData(this) };
}
function getSaveData(isActiveBranch) {
    const activeChildren = [];
    const children = [];
    const configs = [];
    for (const child of getChildSaveData(this, isActiveBranch)) {
        children.push(child.tree);
        if ('activeTree' in child) {
            activeChildren.push(child.activeTree);
            configs.push(...child.configs);
        }
    }
    return { tree: { children }, activeTree: { children: activeChildren }, configs };
}
class Root {
    constructor(data) {
        this.children = [];
        this.addChildren = addChildren;
        this.getPredicateData = getPredicateData;
        this.element = new _element__WEBPACK_IMPORTED_MODULE_2__["default"]({});
        this.element.addClass(_consts__WEBPACK_IMPORTED_MODULE_3__.ROOT_CLASS);
        setup.call(this, data);
        for (const { shouldMount, mount } of actions) {
            if (shouldMount(this)) {
                mount(this);
            }
        }
    }
    getRoot() {
        return this;
    }
    getAncestors() {
        return [];
    }
    getSaveData() {
        const { tree, activeTree, configs } = getSaveData.call(this);
        if ('get' in this) {
            return { tree, config: this.get(activeTree, configs) };
        }
        return { tree, config: configs.length === 1 ? configs[0] : configs };
    }
}


/***/ }),

/***/ "./ts/modal/body/style/consts.ts":
/*!***************************************!*\
  !*** ./ts/modal/body/style/consts.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_STYLE: () => (/* binding */ DEFAULT_STYLE),
/* harmony export */   ROOT_ID: () => (/* binding */ ROOT_ID)
/* harmony export */ });
const ROOT_ID = 'root-style';
const DEFAULT_STYLE = {
    width: 80,
    height: 80,
    fontSize: 18,
    borderTooltip: '#570000',
    borderModal: '#ffffff',
    headBase: '#000000',
    headContrast: 'Black / White',
    headButtonExit: '#f10000',
    headButtonLabel: '#906300',
    headButtonSticky: '#199a00',
    headButtonStyle: '#900091',
    headButtonHide: '#00749a',
    headButtonAlt: '#838f00',
    nodeHeaderBase: '#101010',
    nodeBlendBase: '#101010',
    nodeValueBase: '#303030',
    nodeContrast: 'Black / White',
    nodeButtonCreate: '#40ff40',
    nodeButtonDuplicate: '#40ffff',
    nodeButtonMove: '#ac60ff',
    nodeButtonDisable: '#ffd000',
    nodeButtonDelete: '#ff1111',
    validBackground: '#d9ffc0',
    invalidBackground: '#ffb4be',
    focusBackground: '#e8e8e8',
};


/***/ }),

/***/ "./ts/modal/body/style/css.ts":
/*!************************************!*\
  !*** ./ts/modal/body/style/css.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/style/consts.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../consts */ "./ts/modal/body/consts.ts");
/* harmony import */ var _data_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../data/consts */ "./ts/modal/body/data/consts.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");
/* harmony import */ var _modal_header_actions_style_consts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/modal/header/actions/style/consts */ "./ts/modal/header/actions/style/consts.ts");





function generate() {
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`#${_consts__WEBPACK_IMPORTED_MODULE_1__.MODAL_BODY_ID}.${_modal_header_actions_style_consts__WEBPACK_IMPORTED_MODULE_4__.ACTION_ID} > #${_data_consts__WEBPACK_IMPORTED_MODULE_2__.ROOT_ID}`, ['display', 'none']);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`#${_consts__WEBPACK_IMPORTED_MODULE_1__.MODAL_BODY_ID}:not(.${_modal_header_actions_style_consts__WEBPACK_IMPORTED_MODULE_4__.ACTION_ID}) > #${_consts__WEBPACK_IMPORTED_MODULE_0__.ROOT_ID}`, ['display', 'none']);
}


/***/ }),

/***/ "./ts/modal/body/style/index.ts":
/*!**************************************!*\
  !*** ./ts/modal/body/style/index.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate),
/* harmony export */   getRoot: () => (/* binding */ getRoot),
/* harmony export */   getUserStyles: () => (/* binding */ getUserStyles),
/* harmony export */   toJSON: () => (/* binding */ toJSON),
/* harmony export */   toRawStyle: () => (/* binding */ toRawStyle)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/body/style/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./css */ "./ts/modal/body/style/css.ts");
/* harmony import */ var _update__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./update */ "./ts/modal/body/style/update.ts");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! .. */ "./ts/modal/body/index.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @types */ "./ts/library/validation/types.ts");





function getRoot() {
    return ___WEBPACK_IMPORTED_MODULE_3__.ROOTS[_consts__WEBPACK_IMPORTED_MODULE_0__.ROOT_ID];
}
// Fill any missing entries
function getFilledStyle(style = {}) {
    return Object.assign(Object.assign({}, _consts__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_STYLE), style);
}
function toJSON(style) {
    var _a;
    const filledStyle = Object.assign(Object.assign({}, _consts__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_STYLE), style);
    return {
        label: 'Name',
        value: filledStyle.name,
        isActive: (_a = filledStyle.isActive) !== null && _a !== void 0 ? _a : true,
        children: [
            {
                label: 'Modal',
                children: [
                    {
                        label: 'Width (%)',
                        value: filledStyle.width,
                        predicate: (value) => value > 0 || 'Width must be greater than zero',
                    },
                    {
                        label: 'Height (%)',
                        value: filledStyle.height,
                        predicate: (value) => value > 0 || 'Height must be greater than zero',
                    },
                    {
                        label: 'Font Size (px)',
                        value: filledStyle.fontSize,
                        predicate: (value) => value > 0 || 'Font size must be greater than zero',
                    },
                    {
                        label: 'Border Color',
                        value: filledStyle.borderModal,
                        input: 'color',
                    },
                ],
            },
            {
                label: 'Header',
                children: [
                    {
                        label: 'General',
                        children: [
                            {
                                label: 'Base Color',
                                value: filledStyle.headBase,
                                input: 'color',
                            },
                            {
                                label: 'Contrast Method',
                                value: filledStyle.headContrast,
                                options: [..._types__WEBPACK_IMPORTED_MODULE_4__.CONTRAST_METHODS],
                            },
                        ],
                    },
                    {
                        label: 'Buttons',
                        children: [
                            {
                                label: 'Exit Color',
                                value: filledStyle.headButtonExit,
                                input: 'color',
                            },
                            {
                                label: 'Label Color',
                                value: filledStyle.headButtonLabel,
                                input: 'color',
                            },
                            {
                                label: 'Sticky Color',
                                value: filledStyle.headButtonSticky,
                                input: 'color',
                            },
                            {
                                label: 'Style Color',
                                value: filledStyle.headButtonStyle,
                                input: 'color',
                            },
                            {
                                label: 'Hide Color',
                                value: filledStyle.headButtonHide,
                                input: 'color',
                            },
                            {
                                label: 'Alt Buttons Color',
                                value: filledStyle.headButtonAlt,
                                input: 'color',
                            },
                        ],
                    },
                ],
            },
            {
                label: 'Body',
                children: [
                    {
                        label: 'General',
                        children: [
                            {
                                label: 'Header Node Color',
                                value: _consts__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_STYLE.nodeHeaderBase,
                                input: 'color',
                            },
                            {
                                label: 'Blend Node Color',
                                value: _consts__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_STYLE.nodeBlendBase,
                                input: 'color',
                            },
                            {
                                label: 'Value Node Color',
                                value: _consts__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_STYLE.nodeValueBase,
                                input: 'color',
                            },
                            {
                                label: 'Contrast Method',
                                value: filledStyle.nodeContrast,
                                options: [..._types__WEBPACK_IMPORTED_MODULE_4__.CONTRAST_METHODS],
                            },
                        ],
                    },
                    {
                        label: 'Buttons',
                        children: [
                            {
                                label: 'Create Color',
                                value: filledStyle.nodeButtonCreate,
                                input: 'color',
                            },
                            {
                                label: 'Duplicate Color',
                                value: filledStyle.nodeButtonDuplicate,
                                input: 'color',
                            },
                            {
                                label: 'Move Color',
                                value: filledStyle.nodeButtonMove,
                                input: 'color',
                            },
                            {
                                label: 'Disable Color',
                                value: filledStyle.nodeButtonDisable,
                                input: 'color',
                            },
                            {
                                label: 'Delete Color',
                                value: filledStyle.nodeButtonDelete,
                                input: 'color',
                            },
                        ],
                    },
                    {
                        label: 'Miscellaneous',
                        children: [
                            {
                                label: 'Valid Color',
                                value: filledStyle.validBackground,
                                input: 'color',
                            },
                            {
                                label: 'Invalid Color',
                                value: filledStyle.invalidBackground,
                                input: 'color',
                            },
                            {
                                label: 'Focus Color',
                                value: filledStyle.focusBackground,
                                input: 'color',
                            },
                            {
                                label: 'Tooltip Color',
                                value: filledStyle.borderTooltip,
                                input: 'color',
                            },
                        ],
                    },
                ],
            },
        ],
    };
}
function toRawStyle(json) {
    const [modal, header, body] = json.children.map(({ children }) => children);
    const [headerGeneral, headerButtons] = header.map(({ children }) => children);
    const [bodyGeneral, bodyButtons, bodyMisc] = body.map(({ children }) => children);
    return {
        width: modal[0].value,
        height: modal[1].value,
        fontSize: modal[2].value,
        borderModal: modal[3].value,
        headBase: headerGeneral[0].value,
        headContrast: headerGeneral[1].value,
        headButtonExit: headerButtons[0].value,
        headButtonLabel: headerButtons[1].value,
        headButtonSticky: headerButtons[2].value,
        headButtonStyle: headerButtons[3].value,
        headButtonHide: headerButtons[4].value,
        headButtonAlt: headerButtons[5].value,
        nodeHeaderBase: bodyGeneral[0].value,
        nodeBlendBase: bodyGeneral[1].value,
        nodeValueBase: bodyGeneral[2].value,
        nodeContrast: bodyGeneral[3].value,
        nodeButtonCreate: bodyButtons[0].value,
        nodeButtonDuplicate: bodyButtons[1].value,
        nodeButtonMove: bodyButtons[2].value,
        nodeButtonDisable: bodyButtons[3].value,
        nodeButtonDelete: bodyButtons[4].value,
        validBackground: bodyMisc[0].value,
        invalidBackground: bodyMisc[1].value,
        focusBackground: bodyMisc[2].value,
        borderTooltip: bodyMisc[3].value,
    };
}
// For returning updated styles to the userscript
function getUserStyles() {
    const { tree: { 'children': styleNodes } } = getRoot().getSaveData();
    return styleNodes.map((json) => {
        var _a;
        return (Object.assign(Object.assign({ name: json.value }, (((_a = json.isActive) !== null && _a !== void 0 ? _a : true) ? {} : { isActive: false })), toRawStyle(json)));
    });
}
function generate(userStyles, devStyle) {
    (0,_css__WEBPACK_IMPORTED_MODULE_1__["default"])();
    const defaultStyle = getFilledStyle(devStyle);
    return (0,___WEBPACK_IMPORTED_MODULE_3__.generateTree)({
        children: userStyles.map(toJSON),
        seed: toJSON(Object.assign({ name: 'New Style', isActive: false }, defaultStyle)),
        descendantPredicate: (styles) => styles.length <= 1 || 'Only one style may be active at a time.',
        onDescendantUpdate: (styles) => {
            (0,_update__WEBPACK_IMPORTED_MODULE_2__["default"])(styles.length === 0 ? defaultStyle : toRawStyle(styles[0]));
        },
    }, _consts__WEBPACK_IMPORTED_MODULE_0__.ROOT_ID);
}


/***/ }),

/***/ "./ts/modal/body/style/update.ts":
/*!***************************************!*\
  !*** ./ts/modal/body/style/update.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ updateStylesheet)
/* harmony export */ });
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};

const styleNode = document.createElement('style');
(0,_modal_css__WEBPACK_IMPORTED_MODULE_0__.registerStyleNode)(styleNode);
function getContrast(hex, method) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    switch (method) {
        case 'Black / White': {
            // https://stackoverflow.com/a/3943023/112731
            const luminosity = r * 0.299 + g * 0.587 + b * 0.114;
            return luminosity > 145 ? 'black' : 'white';
        }
    }
    const toHexPart = (rgb) => {
        const x = (255 - rgb).toString(16);
        return x.length === 2 ? x : `0${x}`;
    };
    return `#${toHexPart(r)}${toHexPart((g))}${toHexPart(b)}`;
}
function updateStylesheet(_a) {
    var { fontSize, width, height, headContrast, nodeContrast } = _a, colours = __rest(_a, ["fontSize", "width", "height", "headContrast", "nodeContrast"]);
    for (let i = styleNode.sheet.cssRules.length - 1; i >= 0; --i) {
        styleNode.sheet.deleteRule(i);
    }
    const variables = Object.entries(colours).map(([property, value]) => [`--${property}`, value]);
    variables.push(['--fontSize', `${fontSize}px`], ['--width', `${width}%`], ['--height', `${height}%`]);
    variables.push(['--nodeHeaderContrast', getContrast(colours.nodeHeaderBase, nodeContrast)]);
    variables.push(['--nodeBlendContrast', getContrast(colours.nodeBlendBase, nodeContrast)]);
    variables.push(['--nodeValueContrast', getContrast(colours.nodeValueBase, nodeContrast)]);
    variables.push(['--headContrast', getContrast(colours.headBase, headContrast)]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_0__.addVariables)(variables, styleNode);
}


/***/ }),

/***/ "./ts/modal/consts.ts":
/*!****************************!*\
  !*** ./ts/modal/consts.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUTTON_ACTIVE_CLASS: () => (/* binding */ BUTTON_ACTIVE_CLASS),
/* harmony export */   MODAL_BACKGROUND_ID: () => (/* binding */ MODAL_BACKGROUND_ID),
/* harmony export */   MODAL_ID: () => (/* binding */ MODAL_ID),
/* harmony export */   NODE_HEIGHT: () => (/* binding */ NODE_HEIGHT),
/* harmony export */   SUB_PIXEL_BS: () => (/* binding */ SUB_PIXEL_BS),
/* harmony export */   SVG_NAMESPACE: () => (/* binding */ SVG_NAMESPACE)
/* harmony export */ });
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
// Indicates 'on' state for actions that can be turned on and off
const BUTTON_ACTIVE_CLASS = 'active';
const MODAL_BACKGROUND_ID = 'modal-background';
const MODAL_ID = 'modal-content';
const SUB_PIXEL_BS = 1 / window.devicePixelRatio;
const NODE_HEIGHT = 1.6;


/***/ }),

/***/ "./ts/modal/css.ts":
/*!*************************!*\
  !*** ./ts/modal/css.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addRule: () => (/* binding */ addRule),
/* harmony export */   addVariables: () => (/* binding */ addVariables),
/* harmony export */   "default": () => (/* binding */ generate),
/* harmony export */   getRuleString: () => (/* binding */ getRuleString),
/* harmony export */   registerStyleNode: () => (/* binding */ registerStyleNode)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/consts.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index */ "./ts/modal/index.ts");


const styleNode = document.createElement('style');
const undockedStyleNodes = [styleNode];
function registerStyleNode(node) {
    undockedStyleNodes.push(node);
}
function mountStyleNodes() {
    const { head } = (0,_index__WEBPACK_IMPORTED_MODULE_1__.getDocument)();
    for (const node of undockedStyleNodes) {
        head.appendChild(node);
    }
}
function isStyle(candidate) {
    return candidate.length > 0 && typeof candidate[0] === 'string';
}
function getStyleString([property, value]) {
    return `${property}:${value};`;
}
function getRuleStrings(styles) {
    return isStyle(styles) ? getStyleString(styles) : styles.map(getStyleString).join('');
}
function getRuleString(selectors, styles) {
    const styleString = getRuleStrings(styles);
    const selectorString = typeof selectors === 'string' ? selectors : selectors.join(',');
    return `${selectorString}{${styleString}}`;
}
function addRule(selectors, styles, { sheet } = styleNode) {
    sheet.insertRule(getRuleString(selectors, styles));
}
function addVariables(rules, { sheet } = styleNode) {
    const styleString = rules.map(getStyleString).join('');
    sheet.insertRule(`:root{${styleString}}`);
}
function generate() {
    mountStyleNodes();
    addRule(`#${_consts__WEBPACK_IMPORTED_MODULE_0__.MODAL_BACKGROUND_ID}`, [
        ['position', 'fixed'],
        ['left', '0'],
        ['top', '0'],
        ['width', '100%'],
        ['height', '100%'],
        ['background-color', '#0003'],
        ['display', 'flex'],
        ['align-content', 'center'],
        ['flex-wrap', 'wrap'],
        ['justify-content', 'center'],
    ]);
    addRule(`#${_consts__WEBPACK_IMPORTED_MODULE_0__.MODAL_ID}`, [
        ['width', 'var(--width)'],
        ['height', 'var(--height)'],
        ['font-size', 'var(--fontSize)'],
        ['font-family', 'Tahoma, Geneva, sans-serif'],
        ['outline', 'var(--borderModal) solid 2px'],
        ['box-shadow', '1px 1px 10px 4px #00000015, 0 0 30px 10px #00000065'],
        ['display', 'flex'],
        ['flex-direction', 'column'],
        ['position', 'relative'],
    ]);
    addRule('button', [
        ['display', 'inline-flex'],
        ['cursor', 'pointer'],
        ['background', 'none'],
        ['font-size', 'inherit'],
        ['padding', '0'],
        ['margin', '0'],
        ['border', 'none'],
        ['outline-offset', '-2px'],
    ]);
    addRule('button *', [['pointer-events', 'none']]);
    addRule('svg', [['fill', 'none']]);
    addRule('input', [
        ['font', 'inherit'],
        ['background', 'inherit'],
        ['color', 'inherit'],
        ['border', 'none'],
    ]);
    addRule(':focus-visible:not(button):not(input)', [['outline', 'none']]);
    addRule('label', [['cursor', 'inherit']]);
}


/***/ }),

/***/ "./ts/modal/header/actions/alternate/button.ts":
/*!*****************************************************!*\
  !*** ./ts/modal/header/actions/alternate/button.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/alternate/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../button */ "./ts/modal/header/actions/button.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");



const ALPHA = Math.PI / 5;
const RADIUS = 46;
const points = [];
// https://stackoverflow.com/questions/14580033/algorithm-for-drawing-a-5-point-star
for (let i = 0; i < 12; ++i) {
    const r = RADIUS * (i % 2 + 1) / 2;
    const omega = ALPHA * i;
    points.push([r * Math.sin(omega), r * Math.cos(omega)]);
}
const outline = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'path');
outline.setAttribute('stroke-linecap', 'round');
outline.setAttribute('stroke-width', '7');
outline.setAttribute('d', points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' '));
const g = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'g');
g.append(outline);
const BUTTON = (0,_button__WEBPACK_IMPORTED_MODULE_1__.getNewButton)(g, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, 'Toggle Special Buttons');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BUTTON);


/***/ }),

/***/ "./ts/modal/header/actions/alternate/consts.ts":
/*!*****************************************************!*\
  !*** ./ts/modal/header/actions/alternate/consts.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTION_ID: () => (/* binding */ ACTION_ID)
/* harmony export */ });
const ACTION_ID = 'modal-alt';


/***/ }),

/***/ "./ts/modal/header/actions/alternate/css.ts":
/*!**************************************************!*\
  !*** ./ts/modal/header/actions/alternate/css.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/alternate/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css */ "./ts/modal/header/actions/css.ts");


function generate() {
    (0,_css__WEBPACK_IMPORTED_MODULE_1__.addColourRule)(_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, '--headButtonAlt');
}


/***/ }),

/***/ "./ts/modal/header/actions/alternate/index.ts":
/*!****************************************************!*\
  !*** ./ts/modal/header/actions/alternate/index.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate),
/* harmony export */   doAction: () => (/* binding */ doAction),
/* harmony export */   isActive: () => (/* binding */ isActive)
/* harmony export */ });
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./button */ "./ts/modal/header/actions/alternate/button.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/alternate/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./css */ "./ts/modal/header/actions/alternate/css.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../button */ "./ts/modal/header/actions/button.ts");
/* harmony import */ var _modal_body__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/modal/body */ "./ts/modal/body/index.ts");
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/modal */ "./ts/modal/index.ts");






let _isActive = false;
let toggledOn = false;
function isActive() {
    return _isActive;
}
function doAction(doActivate = !_isActive) {
    (0,_modal_body__WEBPACK_IMPORTED_MODULE_4__.setActive)(_button__WEBPACK_IMPORTED_MODULE_0__["default"], _consts__WEBPACK_IMPORTED_MODULE_1__.ACTION_ID, doActivate);
    _isActive = doActivate;
}
function generate() {
    (0,_css__WEBPACK_IMPORTED_MODULE_2__["default"])();
    (0,_button__WEBPACK_IMPORTED_MODULE_3__.bindAction)(_button__WEBPACK_IMPORTED_MODULE_0__["default"], () => {
        toggledOn = !toggledOn;
        doAction(toggledOn);
    });
    _button__WEBPACK_IMPORTED_MODULE_0__["default"].title += ' (Ctrl)';
    const target = (0,_modal__WEBPACK_IMPORTED_MODULE_5__.getDocument)();
    target.addEventListener('keydown', (event) => {
        if (event.key === 'Control' && !toggledOn) {
            doAction(true);
        }
    });
    target.addEventListener('keyup', (event) => {
        if (event.key === 'Control' && !toggledOn) {
            doAction(false);
        }
    });
    (0,_modal__WEBPACK_IMPORTED_MODULE_5__.getWindow)().addEventListener('blur', () => {
        if (!toggledOn) {
            doAction(false);
        }
    });
    return _button__WEBPACK_IMPORTED_MODULE_0__["default"];
}


/***/ }),

/***/ "./ts/modal/header/actions/button.ts":
/*!*******************************************!*\
  !*** ./ts/modal/header/actions/button.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindAction: () => (/* binding */ bindAction),
/* harmony export */   getNewButton: () => (/* binding */ getNewButton)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/consts.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../consts */ "./ts/modal/consts.ts");
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal */ "./ts/modal/index.ts");



// Adds the template to the DOM
function bindAction(button, doAction, hotkey) {
    const bound = (event) => {
        event.stopPropagation();
        button.blur();
        doAction();
    };
    button.addEventListener('click', bound);
    if (hotkey) {
        button.title += ` (Alt+${hotkey})`;
        (0,_modal__WEBPACK_IMPORTED_MODULE_2__.getDocument)().addEventListener('keydown', (event) => {
            if (event.altKey && event.key.toUpperCase() === hotkey) {
                bound(event);
            }
        });
    }
    return bound;
}
// Creates a template
const getNewButton = (function () {
    const buttonTemplate = document.createElement('button');
    const svgTemplate = document.createElementNS(_consts__WEBPACK_IMPORTED_MODULE_1__.SVG_NAMESPACE, 'svg');
    buttonTemplate.classList.add(_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS);
    buttonTemplate.setAttribute('tabindex', '-1');
    svgTemplate.setAttribute('viewBox', `-70 -70 140 140`);
    return function (group, actionId, description) {
        const button = buttonTemplate.cloneNode(true);
        const svg = svgTemplate.cloneNode(true);
        button.id = actionId;
        button.title = description;
        svg.append(group);
        button.append(svg);
        return button;
    };
})();


/***/ }),

/***/ "./ts/modal/header/actions/close/button.ts":
/*!*************************************************!*\
  !*** ./ts/modal/header/actions/close/button.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/close/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../button */ "./ts/modal/header/actions/button.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");



const line0 = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'line');
line0.setAttribute('stroke-linecap', 'round');
line0.setAttribute('stroke-width', '12');
line0.setAttribute('x1', '-30');
line0.setAttribute('x2', '30');
line0.setAttribute('y1', '-30');
line0.setAttribute('y2', '30');
const line1 = line0.cloneNode(true);
line1.setAttribute('transform', 'rotate(90 0 0)');
const g = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'g');
g.append(line0, line1);
const BUTTON = (0,_button__WEBPACK_IMPORTED_MODULE_1__.getNewButton)(g, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, 'Save & Exit');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BUTTON);


/***/ }),

/***/ "./ts/modal/header/actions/close/consts.ts":
/*!*************************************************!*\
  !*** ./ts/modal/header/actions/close/consts.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTION_ID: () => (/* binding */ ACTION_ID),
/* harmony export */   HOTKEY: () => (/* binding */ HOTKEY)
/* harmony export */ });
const ACTION_ID = 'modal-close';
const HOTKEY = 'X';


/***/ }),

/***/ "./ts/modal/header/actions/close/css.ts":
/*!**********************************************!*\
  !*** ./ts/modal/header/actions/close/css.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/close/consts.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");


function generate() {
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_1__.addRule)([
        `#${_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID}:focus > svg`,
        `#${_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID}:hover > svg`,
    ], ['background-color', 'var(--headButtonExit)']);
}


/***/ }),

/***/ "./ts/modal/header/actions/close/index.ts":
/*!************************************************!*\
  !*** ./ts/modal/header/actions/close/index.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate),
/* harmony export */   setCallback: () => (/* binding */ setCallback)
/* harmony export */ });
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./button */ "./ts/modal/header/actions/close/button.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/close/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./css */ "./ts/modal/header/actions/close/css.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../button */ "./ts/modal/header/actions/button.ts");
/* harmony import */ var _modal_body_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/modal/body/data */ "./ts/modal/body/data/index.ts");
/* harmony import */ var _modal_body_style__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/modal/body/style */ "./ts/modal/body/style/index.ts");
/* harmony import */ var _nodes_actions_buttons_position__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nodes/actions/buttons/position */ "./ts/modal/body/nodes/actions/buttons/position/index.ts");
/* harmony import */ var _nodes_actions_highlight__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @nodes/actions/highlight */ "./ts/modal/body/nodes/actions/highlight/index.ts");








let callback;
function setCallback(_callback) {
    callback = _callback;
}
// TODO Maybe add a white, 0.5 opacity foreground over everything with a loading symbol.
//  Do the same when waiting for a config.
//  Prevent interaction during loading by adding a stopPropagation click listener to the foreground.
function doAction() {
    (0,_nodes_actions_buttons_position__WEBPACK_IMPORTED_MODULE_6__.reset)();
    (0,_nodes_actions_highlight__WEBPACK_IMPORTED_MODULE_7__.reset)();
    callback === null || callback === void 0 ? void 0 : callback(Object.assign(Object.assign({}, (0,_modal_body_data__WEBPACK_IMPORTED_MODULE_4__.getSaveData)()), { styles: (0,_modal_body_style__WEBPACK_IMPORTED_MODULE_5__.getUserStyles)() }));
    callback = undefined;
}
function generate(background) {
    (0,_css__WEBPACK_IMPORTED_MODULE_2__["default"])();
    (0,_button__WEBPACK_IMPORTED_MODULE_3__.bindAction)(_button__WEBPACK_IMPORTED_MODULE_0__["default"], doAction, _consts__WEBPACK_IMPORTED_MODULE_1__.HOTKEY);
    background.addEventListener('click', (event) => {
        if (background.isSameNode(event.target)) {
            doAction();
        }
    });
    return _button__WEBPACK_IMPORTED_MODULE_0__["default"];
}


/***/ }),

/***/ "./ts/modal/header/actions/consts.ts":
/*!*******************************************!*\
  !*** ./ts/modal/header/actions/consts.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUTTON_CLASS: () => (/* binding */ BUTTON_CLASS),
/* harmony export */   BUTTON_CONTAINER_ID: () => (/* binding */ BUTTON_CONTAINER_ID)
/* harmony export */ });
const BUTTON_CLASS = 'modal-button';
const BUTTON_CONTAINER_ID = 'modal-button-container';


/***/ }),

/***/ "./ts/modal/header/actions/css.ts":
/*!****************************************!*\
  !*** ./ts/modal/header/actions/css.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addColourRule: () => (/* binding */ addColourRule),
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/consts.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../consts */ "./ts/modal/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../css */ "./ts/modal/css.ts");



const ACTIVE_SELECTOR = `.${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}.${_consts__WEBPACK_IMPORTED_MODULE_1__.BUTTON_ACTIVE_CLASS}`;
function addColourRule(actionId, colour) {
    (0,_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`#${actionId}${ACTIVE_SELECTOR} > svg`, [['fill', `var(${colour})`]]);
    (0,_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([`#${actionId}${ACTIVE_SELECTOR}:not(:hover):not(:focus) > svg`], [['stroke', `var(${colour})`]]);
}
function generate() {
    (0,_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`#${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CONTAINER_ID}`, [
        ['display', 'inline-flex'],
        ['flex-direction', 'row-reverse'],
        ['max-width', '80%'],
        ['overflow-x', 'scroll'],
        ['scrollbar-width', 'none'],
        ['overscroll-behavior', 'contain'],
        ['border-left', '2px solid var(--headContrast)'],
    ]);
    (0,_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}:focus > svg`,
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}:hover > svg`,
        `${ACTIVE_SELECTOR} > svg`,
    ], ['background-color', `var(--headContrast)`]);
    (0,_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}:not(:last-child)`, ['border-left', '2px solid var(--headContrast)']);
    (0,_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}:not(:first-child):focus`,
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}:not(:first-child):hover`,
        `${ACTIVE_SELECTOR}:not(:first-child)`,
    ], ['border-color', 'var(--headBase)']);
    (0,_css__WEBPACK_IMPORTED_MODULE_2__.addRule)([
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}:focus > svg`,
        `.${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS}:hover > svg`,
    ], ['stroke', `var(--headBase)`]);
    (0,_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`.${_consts__WEBPACK_IMPORTED_MODULE_0__.BUTTON_CLASS} > svg`, [
        ['width', '1.7em'],
        ['stroke', 'var(--headContrast)'],
        ['fill', `var(--headContrast)`],
        // Fixes pixel gap between button border & svg
        ['margin-left', '-0.5px'],
    ]);
}


/***/ }),

/***/ "./ts/modal/header/actions/hide/button.ts":
/*!************************************************!*\
  !*** ./ts/modal/header/actions/hide/button.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/hide/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../button */ "./ts/modal/header/actions/button.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");



const edgeTop = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'path');
edgeTop.setAttribute('stroke-linecap', 'round');
edgeTop.setAttribute('stroke-width', '7');
edgeTop.setAttribute('d', 'M -55 0'
    + ' Q 0 60 55 0');
edgeTop.setAttribute('fill', 'none');
const edgeBottom = edgeTop.cloneNode(true);
edgeBottom.setAttribute('transform', 'scale(1,-1)');
const circle = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'circle');
circle.setAttribute('cx', '0');
circle.setAttribute('cy', '0');
circle.setAttribute('r', '26');
circle.setAttribute('stroke-width', '6');
const g = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'g');
g.append(edgeTop, edgeBottom, circle);
const BUTTON = (0,_button__WEBPACK_IMPORTED_MODULE_1__.getNewButton)(g, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, 'Toggle Disabled Node Visibility');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BUTTON);


/***/ }),

/***/ "./ts/modal/header/actions/hide/consts.ts":
/*!************************************************!*\
  !*** ./ts/modal/header/actions/hide/consts.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTION_ID: () => (/* binding */ ACTION_ID),
/* harmony export */   HOTKEY: () => (/* binding */ HOTKEY)
/* harmony export */ });
const ACTION_ID = 'modal-hide';
const HOTKEY = 'H';


/***/ }),

/***/ "./ts/modal/header/actions/hide/css.ts":
/*!*********************************************!*\
  !*** ./ts/modal/header/actions/hide/css.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/hide/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css */ "./ts/modal/header/actions/css.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");
/* harmony import */ var _modal_body_consts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modal/body/consts */ "./ts/modal/body/consts.ts");
/* harmony import */ var _nodes_actions_buttons_disable_consts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nodes/actions/buttons/disable/consts */ "./ts/modal/body/nodes/actions/buttons/disable/consts.ts");





function generate() {
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`#${_modal_body_consts__WEBPACK_IMPORTED_MODULE_3__.MODAL_BODY_ID}:not(.${_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID}) .${_nodes_actions_buttons_disable_consts__WEBPACK_IMPORTED_MODULE_4__.DISABLED_CLASS}`, ['display', 'none']);
    (0,_css__WEBPACK_IMPORTED_MODULE_1__.addColourRule)(_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, '--headButtonHide');
}


/***/ }),

/***/ "./ts/modal/header/actions/hide/index.ts":
/*!***********************************************!*\
  !*** ./ts/modal/header/actions/hide/index.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./button */ "./ts/modal/header/actions/hide/button.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/hide/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./css */ "./ts/modal/header/actions/hide/css.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../button */ "./ts/modal/header/actions/button.ts");
/* harmony import */ var _modal_body__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/modal/body */ "./ts/modal/body/index.ts");





let isActive = false;
function doAction() {
    isActive = !isActive;
    (0,_modal_body__WEBPACK_IMPORTED_MODULE_4__.setActive)(_button__WEBPACK_IMPORTED_MODULE_0__["default"], _consts__WEBPACK_IMPORTED_MODULE_1__.ACTION_ID, isActive);
}
function generate() {
    (0,_css__WEBPACK_IMPORTED_MODULE_2__["default"])();
    (0,_button__WEBPACK_IMPORTED_MODULE_3__.bindAction)(_button__WEBPACK_IMPORTED_MODULE_0__["default"], doAction, _consts__WEBPACK_IMPORTED_MODULE_1__.HOTKEY);
    _button__WEBPACK_IMPORTED_MODULE_0__["default"].click();
    return _button__WEBPACK_IMPORTED_MODULE_0__["default"];
}


/***/ }),

/***/ "./ts/modal/header/actions/index.ts":
/*!******************************************!*\
  !*** ./ts/modal/header/actions/index.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _close__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./close */ "./ts/modal/header/actions/close/index.ts");
/* harmony import */ var _sticky__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sticky */ "./ts/modal/header/actions/sticky/index.ts");
/* harmony import */ var _labels__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./labels */ "./ts/modal/header/actions/labels/index.ts");
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style */ "./ts/modal/header/actions/style/index.ts");
/* harmony import */ var _hide__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./hide */ "./ts/modal/header/actions/hide/index.ts");
/* harmony import */ var _alternate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./alternate */ "./ts/modal/header/actions/alternate/index.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./css */ "./ts/modal/header/actions/css.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/consts.ts");








function generate(background) {
    (0,_css__WEBPACK_IMPORTED_MODULE_6__["default"])();
    const element = document.createElement('span');
    element.id = _consts__WEBPACK_IMPORTED_MODULE_7__.BUTTON_CONTAINER_ID;
    element.setAttribute('tabindex', '-1');
    element.append((0,_close__WEBPACK_IMPORTED_MODULE_0__["default"])(background), (0,_style__WEBPACK_IMPORTED_MODULE_3__["default"])(), (0,_sticky__WEBPACK_IMPORTED_MODULE_1__["default"])(), (0,_labels__WEBPACK_IMPORTED_MODULE_2__["default"])(), (0,_hide__WEBPACK_IMPORTED_MODULE_4__["default"])(), (0,_alternate__WEBPACK_IMPORTED_MODULE_5__["default"])());
    return element;
}


/***/ }),

/***/ "./ts/modal/header/actions/labels/button.ts":
/*!**************************************************!*\
  !*** ./ts/modal/header/actions/labels/button.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/labels/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../button */ "./ts/modal/header/actions/button.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");



const outline = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'path');
outline.setAttribute('stroke-linecap', 'round');
outline.setAttribute('stroke-width', '7');
outline.setAttribute('d', 'M 20 -30'
    + ' L -40 -30'
    + ' L -40 30'
    + ' L 20 30'
    + ' L 50 0'
    + ' L 20 -30');
const circle = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'circle');
circle.setAttribute('stroke-width', '5');
circle.setAttribute('r', '5');
circle.setAttribute('cx', '20');
circle.setAttribute('cy', '0');
const loop = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'path');
loop.setAttribute('fill', 'none');
loop.setAttribute('stroke-linecap', 'round');
loop.setAttribute('stroke-width', '6');
loop.setAttribute('d', 'M 20 0'
    + ' C -70 50 -30 50 15 30');
const g = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'g');
g.setAttribute('transform', 'rotate(-60 0 0)');
g.append(outline, circle, loop);
const BUTTON = (0,_button__WEBPACK_IMPORTED_MODULE_1__.getNewButton)(g, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, 'Toggle Labels');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BUTTON);


/***/ }),

/***/ "./ts/modal/header/actions/labels/consts.ts":
/*!**************************************************!*\
  !*** ./ts/modal/header/actions/labels/consts.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTION_ID: () => (/* binding */ ACTION_ID),
/* harmony export */   HOTKEY: () => (/* binding */ HOTKEY)
/* harmony export */ });
const ACTION_ID = 'modal-labels';
const HOTKEY = 'N';


/***/ }),

/***/ "./ts/modal/header/actions/labels/css.ts":
/*!***********************************************!*\
  !*** ./ts/modal/header/actions/labels/css.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/labels/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css */ "./ts/modal/header/actions/css.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");
/* harmony import */ var _modal_body_consts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modal/body/consts */ "./ts/modal/body/consts.ts");
/* harmony import */ var _nodes_consts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nodes/consts */ "./ts/modal/body/nodes/consts.ts");





function generate() {
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_2__.addRule)(`#${_modal_body_consts__WEBPACK_IMPORTED_MODULE_3__.MODAL_BODY_ID}:not(.${_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID}) .${_nodes_consts__WEBPACK_IMPORTED_MODULE_4__.ELEMENT_CLASSES.LABEL_CONTAINER}`, ['display', 'none']);
    (0,_css__WEBPACK_IMPORTED_MODULE_1__.addColourRule)(_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, '--headButtonLabel');
}


/***/ }),

/***/ "./ts/modal/header/actions/labels/index.ts":
/*!*************************************************!*\
  !*** ./ts/modal/header/actions/labels/index.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./button */ "./ts/modal/header/actions/labels/button.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/labels/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./css */ "./ts/modal/header/actions/labels/css.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../button */ "./ts/modal/header/actions/button.ts");
/* harmony import */ var _modal_body__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/modal/body */ "./ts/modal/body/index.ts");





let isActive = false;
function doAction() {
    isActive = !isActive;
    (0,_modal_body__WEBPACK_IMPORTED_MODULE_4__.setActive)(_button__WEBPACK_IMPORTED_MODULE_0__["default"], _consts__WEBPACK_IMPORTED_MODULE_1__.ACTION_ID, isActive);
}
function generate() {
    (0,_css__WEBPACK_IMPORTED_MODULE_2__["default"])();
    (0,_button__WEBPACK_IMPORTED_MODULE_3__.bindAction)(_button__WEBPACK_IMPORTED_MODULE_0__["default"], doAction, _consts__WEBPACK_IMPORTED_MODULE_1__.HOTKEY);
    _button__WEBPACK_IMPORTED_MODULE_0__["default"].click();
    return _button__WEBPACK_IMPORTED_MODULE_0__["default"];
}


/***/ }),

/***/ "./ts/modal/header/actions/sticky/button.ts":
/*!**************************************************!*\
  !*** ./ts/modal/header/actions/sticky/button.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/sticky/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../button */ "./ts/modal/header/actions/button.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");



const handle = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'path');
const HANDLE_WIDTH = 50;
const CURVE_RADIUS = 10;
handle.setAttribute('stroke-width', '7');
handle.setAttribute('d', `M ${-HANDLE_WIDTH / 2} -40`
    + ` q 0 ${CURVE_RADIUS} ${CURVE_RADIUS} ${CURVE_RADIUS}`
    + ` q ${CURVE_RADIUS / 2} ${CURVE_RADIUS * 1.5} 0 ${CURVE_RADIUS * 3}`
    + ` q ${-CURVE_RADIUS} 0 ${-CURVE_RADIUS} ${CURVE_RADIUS}`
    + ` l ${HANDLE_WIDTH} 0`
    + ` q 0 ${-CURVE_RADIUS} ${-CURVE_RADIUS} ${-CURVE_RADIUS}`
    + ` q ${-CURVE_RADIUS / 2} ${-CURVE_RADIUS * 1.5} 0 ${-CURVE_RADIUS * 3}`
    + ` q ${CURVE_RADIUS} 0 ${CURVE_RADIUS} ${-CURVE_RADIUS}`
    + ' Z');
const point = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'path');
point.setAttribute('fill', 'none');
point.setAttribute('stroke-width', '4');
point.setAttribute('d', 'M -2 -20'
    + ' l 0 50'
    + ' l 2 20'
    + ' l 2 -20'
    + ' l 0 -50'
    + ' Z');
const g = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'g');
g.append(point, handle);
const BUTTON = (0,_button__WEBPACK_IMPORTED_MODULE_1__.getNewButton)(g, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, 'Toggle Sticky');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BUTTON);


/***/ }),

/***/ "./ts/modal/header/actions/sticky/consts.ts":
/*!**************************************************!*\
  !*** ./ts/modal/header/actions/sticky/consts.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTION_ID: () => (/* binding */ ACTION_ID),
/* harmony export */   HOTKEY: () => (/* binding */ HOTKEY)
/* harmony export */ });
const ACTION_ID = 'modal-sticky';
const HOTKEY = 'S';


/***/ }),

/***/ "./ts/modal/header/actions/sticky/css.ts":
/*!***********************************************!*\
  !*** ./ts/modal/header/actions/sticky/css.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/sticky/consts.ts");
/* harmony import */ var _style_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../style/consts */ "./ts/modal/header/actions/style/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../css */ "./ts/modal/header/actions/css.ts");
/* harmony import */ var _modal_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modal/css */ "./ts/modal/css.ts");
/* harmony import */ var _modal_body_data_consts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/modal/body/data/consts */ "./ts/modal/body/data/consts.ts");
/* harmony import */ var _modal_body_style_consts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/modal/body/style/consts */ "./ts/modal/body/style/consts.ts");
/* harmony import */ var _modal_body_consts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/modal/body/consts */ "./ts/modal/body/consts.ts");
/* harmony import */ var _nodes_consts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @nodes/consts */ "./ts/modal/body/nodes/consts.ts");
/* harmony import */ var _nodes_actions_focus_consts__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @nodes/actions/focus/consts */ "./ts/modal/body/nodes/actions/focus/consts.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");










function _getHeight(node, pools, depth = 0) {
    if ('poolId' in node) {
        if (!pools[node.poolId]) {
            pools[node.poolId] = [depth, 1];
        }
        else {
            pools[node.poolId][0] = Math.max(pools[node.poolId][0], depth);
        }
        pools[node.poolId][1] = [...node.children, ...('seed' in node ? [node.seed] : [])]
            .reduce((height, child) => Math.max(_getHeight(child, pools, 1), height), pools[node.poolId][1]);
        return 0;
    }
    if ('seed' in node) {
        return _getHeight(node.seed, pools, depth + 1);
    }
    if ('children' in node) {
        return node.children.reduce((height, child) => Math.max(_getHeight(child, pools, depth + 1), height), depth + 1);
    }
    return depth;
}
function getHeight(node) {
    const pools = [];
    const height = _getHeight(node, pools);
    return pools.reduce((max, [poolDepth, poolHeight]) => Math.max(max, poolDepth + poolHeight), height);
}
function generate(roots) {
    const heights = {
        [_modal_body_data_consts__WEBPACK_IMPORTED_MODULE_4__.ROOT_ID]: getHeight(roots[_modal_body_data_consts__WEBPACK_IMPORTED_MODULE_4__.ROOT_ID]),
        [_modal_body_style_consts__WEBPACK_IMPORTED_MODULE_5__.ROOT_ID]: getHeight(roots[_modal_body_style_consts__WEBPACK_IMPORTED_MODULE_5__.ROOT_ID]),
    };
    const maxHeight = Math.max(heights[_modal_body_data_consts__WEBPACK_IMPORTED_MODULE_4__.ROOT_ID], heights[_modal_body_style_consts__WEBPACK_IMPORTED_MODULE_5__.ROOT_ID]);
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addVariables)([['--overlayIndex', `${maxHeight + 1}`]]);
    (0,_css__WEBPACK_IMPORTED_MODULE_2__.addColourRule)(_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, '--headButtonSticky');
    let nodeSelector = `#${_modal_body_consts__WEBPACK_IMPORTED_MODULE_6__.MODAL_BODY_ID}.${_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.ELEMENT_CONTAINER}`;
    for (let depth = 0; depth <= maxHeight; ++depth) {
        (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`${nodeSelector} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.HEAD_CONTAINER}`, [
            ['position', 'sticky'],
            ['top', `calc(${depth * _modal_consts__WEBPACK_IMPORTED_MODULE_9__.NODE_HEIGHT}em + ${depth * _modal_consts__WEBPACK_IMPORTED_MODULE_9__.SUB_PIXEL_BS}px)`],
            ['z-index', `${maxHeight - depth}`],
        ]);
        nodeSelector += ` > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.CHILD_CONTAINER} > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.ELEMENT_CONTAINER}`;
    }
    (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`#${_modal_body_consts__WEBPACK_IMPORTED_MODULE_6__.MODAL_BODY_ID}.${_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID}::after`, [
        ['content', '\'\''],
        ['display', 'block'],
        ['visibility', 'hidden'],
    ]);
    const selectors = {
        basic: {
            [_modal_body_data_consts__WEBPACK_IMPORTED_MODULE_4__.ROOT_ID]: `#${_modal_body_consts__WEBPACK_IMPORTED_MODULE_6__.MODAL_BODY_ID}.${_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID}:has(> #${_modal_body_data_consts__WEBPACK_IMPORTED_MODULE_4__.ROOT_ID}:not(.${_nodes_actions_focus_consts__WEBPACK_IMPORTED_MODULE_8__.FOCUS_CLASS}) > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.CHILD_CONTAINER}`,
            [_modal_body_style_consts__WEBPACK_IMPORTED_MODULE_5__.ROOT_ID]: `#${_modal_body_consts__WEBPACK_IMPORTED_MODULE_6__.MODAL_BODY_ID}.${_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID}.${_style_consts__WEBPACK_IMPORTED_MODULE_1__.ACTION_ID}:has(> #${_modal_body_style_consts__WEBPACK_IMPORTED_MODULE_5__.ROOT_ID}:not(.${_nodes_actions_focus_consts__WEBPACK_IMPORTED_MODULE_8__.FOCUS_CLASS}) > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.CHILD_CONTAINER}`,
        },
        focus: {
            [_modal_body_data_consts__WEBPACK_IMPORTED_MODULE_4__.ROOT_ID]: `#${_modal_body_consts__WEBPACK_IMPORTED_MODULE_6__.MODAL_BODY_ID}.${_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID}:has(> #${_modal_body_data_consts__WEBPACK_IMPORTED_MODULE_4__.ROOT_ID}.${_nodes_actions_focus_consts__WEBPACK_IMPORTED_MODULE_8__.FOCUS_CLASS}`,
            [_modal_body_style_consts__WEBPACK_IMPORTED_MODULE_5__.ROOT_ID]: `#${_modal_body_consts__WEBPACK_IMPORTED_MODULE_6__.MODAL_BODY_ID}.${_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID}.${_style_consts__WEBPACK_IMPORTED_MODULE_1__.ACTION_ID}:has(> #${_modal_body_style_consts__WEBPACK_IMPORTED_MODULE_5__.ROOT_ID}.${_nodes_actions_focus_consts__WEBPACK_IMPORTED_MODULE_8__.FOCUS_CLASS}`,
        },
    };
    for (const [id, height] of Object.entries(heights)) {
        for (let depth = 1; depth <= height + 1; ++depth) {
            (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`${selectors.basic[id]}:empty)::after`, ['height', `calc(100% - ${(depth) * _modal_consts__WEBPACK_IMPORTED_MODULE_9__.SUB_PIXEL_BS}px - ${depth * _modal_consts__WEBPACK_IMPORTED_MODULE_9__.NODE_HEIGHT}em)`]);
            (0,_modal_css__WEBPACK_IMPORTED_MODULE_3__.addRule)(`${selectors.focus[id]}.${_nodes_actions_focus_consts__WEBPACK_IMPORTED_MODULE_8__.FOCUS_SOURCE_CLASS})::after`, ['height', `calc(100% - ${(depth + 1) * _modal_consts__WEBPACK_IMPORTED_MODULE_9__.SUB_PIXEL_BS}px - ${(depth + 1) * _modal_consts__WEBPACK_IMPORTED_MODULE_9__.NODE_HEIGHT}em)`]);
            selectors.basic[id] += ` > :last-child > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.CHILD_CONTAINER}`;
            selectors.focus[id] += ` > .${_nodes_consts__WEBPACK_IMPORTED_MODULE_7__.ELEMENT_CLASSES.CHILD_CONTAINER} > *`;
        }
    }
}


/***/ }),

/***/ "./ts/modal/header/actions/sticky/index.ts":
/*!*************************************************!*\
  !*** ./ts/modal/header/actions/sticky/index.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate),
/* harmony export */   isActive: () => (/* binding */ isActive)
/* harmony export */ });
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./button */ "./ts/modal/header/actions/sticky/button.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/sticky/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../button */ "./ts/modal/header/actions/button.ts");
/* harmony import */ var _modal_body__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/modal/body */ "./ts/modal/body/index.ts");




let _isActive = false;
function isActive() {
    return _isActive;
}
function doAction() {
    _isActive = !_isActive;
    (0,_modal_body__WEBPACK_IMPORTED_MODULE_3__.setActive)(_button__WEBPACK_IMPORTED_MODULE_0__["default"], _consts__WEBPACK_IMPORTED_MODULE_1__.ACTION_ID, _isActive);
}
function generate() {
    (0,_button__WEBPACK_IMPORTED_MODULE_2__.bindAction)(_button__WEBPACK_IMPORTED_MODULE_0__["default"], doAction, _consts__WEBPACK_IMPORTED_MODULE_1__.HOTKEY);
    _button__WEBPACK_IMPORTED_MODULE_0__["default"].click();
    return _button__WEBPACK_IMPORTED_MODULE_0__["default"];
}


/***/ }),

/***/ "./ts/modal/header/actions/style/button.ts":
/*!*************************************************!*\
  !*** ./ts/modal/header/actions/style/button.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/style/consts.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../button */ "./ts/modal/header/actions/button.ts");
/* harmony import */ var _modal_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/modal/consts */ "./ts/modal/consts.ts");



const handle = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'rect');
handle.setAttribute('stroke-linecap', 'round');
handle.setAttribute('stroke-width', '6');
handle.setAttribute('x', '-5');
handle.setAttribute('y', '15');
handle.setAttribute('width', '15');
handle.setAttribute('height', '40');
handle.setAttribute('rx', '5');
const frame = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'path');
frame.setAttribute('fill', 'none');
frame.setAttribute('stroke-linecap', 'round');
frame.setAttribute('stroke-width', '3');
frame.setAttribute('d', 'M 2.5 15'
    + ' L 2.5 0'
    + ' L -36 -15'
    + ' L -36 -35'
    + ' L -30 -35');
const curveLeft = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'path');
curveLeft.setAttribute('fill', 'none');
curveLeft.setAttribute('stroke-linecap', 'round');
curveLeft.setAttribute('stroke-width', '6');
curveLeft.setAttribute('d', 'M -25 -30'
    + ' Q -30 -35 -25 -40');
const curveRight = curveLeft.cloneNode(true);
curveRight.setAttribute('transform', 'scale(-1,1) translate(-10,0)');
const roller = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'rect');
roller.setAttribute('stroke-linecap', 'round');
roller.setAttribute('stroke-width', '6');
roller.setAttribute('x', '-22.5');
roller.setAttribute('y', '-47.5');
roller.setAttribute('width', '55');
roller.setAttribute('height', '25');
roller.setAttribute('rx', '1');
const g = document.createElementNS(_modal_consts__WEBPACK_IMPORTED_MODULE_2__.SVG_NAMESPACE, 'g');
g.append(handle, frame, curveLeft, curveRight, roller);
const BUTTON = (0,_button__WEBPACK_IMPORTED_MODULE_1__.getNewButton)(g, _consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, 'Toggle Style Editor');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BUTTON);


/***/ }),

/***/ "./ts/modal/header/actions/style/consts.ts":
/*!*************************************************!*\
  !*** ./ts/modal/header/actions/style/consts.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTION_ID: () => (/* binding */ ACTION_ID),
/* harmony export */   HOTKEY: () => (/* binding */ HOTKEY)
/* harmony export */ });
const ACTION_ID = 'modal-style';
const HOTKEY = 'C';


/***/ }),

/***/ "./ts/modal/header/actions/style/css.ts":
/*!**********************************************!*\
  !*** ./ts/modal/header/actions/style/css.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/style/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css */ "./ts/modal/header/actions/css.ts");


function generate() {
    (0,_css__WEBPACK_IMPORTED_MODULE_1__.addColourRule)(_consts__WEBPACK_IMPORTED_MODULE_0__.ACTION_ID, '--headButtonStyle');
}


/***/ }),

/***/ "./ts/modal/header/actions/style/index.ts":
/*!************************************************!*\
  !*** ./ts/modal/header/actions/style/index.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./button */ "./ts/modal/header/actions/style/button.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/actions/style/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./css */ "./ts/modal/header/actions/style/css.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../button */ "./ts/modal/header/actions/button.ts");
/* harmony import */ var _modal_body__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/modal/body */ "./ts/modal/body/index.ts");
/* harmony import */ var _nodes_actions_focus__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nodes/actions/focus */ "./ts/modal/body/nodes/actions/focus/index.ts");
/* harmony import */ var _nodes_actions_buttons_position__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nodes/actions/buttons/position */ "./ts/modal/body/nodes/actions/buttons/position/index.ts");







let isActive = false;
function doAction() {
    isActive = !isActive;
    (0,_modal_body__WEBPACK_IMPORTED_MODULE_4__.setActive)(_button__WEBPACK_IMPORTED_MODULE_0__["default"], _consts__WEBPACK_IMPORTED_MODULE_1__.ACTION_ID, isActive);
    _modal_body__WEBPACK_IMPORTED_MODULE_4__.element.scrollTop = 0;
    (0,_nodes_actions_focus__WEBPACK_IMPORTED_MODULE_5__.reset)();
    (0,_nodes_actions_buttons_position__WEBPACK_IMPORTED_MODULE_6__.reset)();
    // Reset tab index & highlight
    _modal_body__WEBPACK_IMPORTED_MODULE_4__.element.focus();
}
function generate() {
    (0,_css__WEBPACK_IMPORTED_MODULE_2__["default"])();
    (0,_button__WEBPACK_IMPORTED_MODULE_3__.bindAction)(_button__WEBPACK_IMPORTED_MODULE_0__["default"], doAction, _consts__WEBPACK_IMPORTED_MODULE_1__.HOTKEY);
    return _button__WEBPACK_IMPORTED_MODULE_0__["default"];
}


/***/ }),

/***/ "./ts/modal/header/consts.ts":
/*!***********************************!*\
  !*** ./ts/modal/header/consts.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HEADER_ID: () => (/* binding */ HEADER_ID)
/* harmony export */ });
const HEADER_ID = 'modal-header';


/***/ }),

/***/ "./ts/modal/header/css.ts":
/*!********************************!*\
  !*** ./ts/modal/header/css.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css */ "./ts/modal/css.ts");


function generate() {
    (0,_css__WEBPACK_IMPORTED_MODULE_1__.addRule)(`#${_consts__WEBPACK_IMPORTED_MODULE_0__.HEADER_ID}`, [
        ['display', 'flex'],
        ['align-items', 'center'],
        ['background-color', 'var(--headBase)'],
        ['color', 'var(--headContrast)'],
        ['border-bottom', '2px solid var(--borderModal)'],
        ['font-size', '1.5em'],
        ['text-align', 'center'],
    ]);
}


/***/ }),

/***/ "./ts/modal/header/index.ts":
/*!**********************************!*\
  !*** ./ts/modal/header/index.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/consts.ts");
/* harmony import */ var _title__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./title */ "./ts/modal/header/title/index.ts");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./actions */ "./ts/modal/header/actions/index.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./css */ "./ts/modal/header/css.ts");




function generate({ title }, background) {
    (0,_css__WEBPACK_IMPORTED_MODULE_3__["default"])();
    const element = document.createElement('div');
    element.id = _consts__WEBPACK_IMPORTED_MODULE_0__.HEADER_ID;
    element.append((0,_title__WEBPACK_IMPORTED_MODULE_1__["default"])(title), (0,_actions__WEBPACK_IMPORTED_MODULE_2__["default"])(background));
    return element;
}


/***/ }),

/***/ "./ts/modal/header/title/consts.ts":
/*!*****************************************!*\
  !*** ./ts/modal/header/title/consts.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TITLE_CONTAINER_ID: () => (/* binding */ TITLE_CONTAINER_ID),
/* harmony export */   TITLE_ID: () => (/* binding */ TITLE_ID)
/* harmony export */ });
const TITLE_CONTAINER_ID = 'title-container';
const TITLE_ID = 'title';


/***/ }),

/***/ "./ts/modal/header/title/css.ts":
/*!**************************************!*\
  !*** ./ts/modal/header/title/css.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/title/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../css */ "./ts/modal/css.ts");


function generate() {
    (0,_css__WEBPACK_IMPORTED_MODULE_1__.addRule)(`#${_consts__WEBPACK_IMPORTED_MODULE_0__.TITLE_CONTAINER_ID}`, [
        ['flex-grow', '1'],
        ['white-space', 'nowrap'],
        ['overflow', 'hidden'],
        ['text-overflow', 'ellipsis'],
        ['padding', '0 0.5em'],
    ]);
}


/***/ }),

/***/ "./ts/modal/header/title/index.ts":
/*!****************************************!*\
  !*** ./ts/modal/header/title/index.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/header/title/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./css */ "./ts/modal/header/title/css.ts");


function generate(title) {
    (0,_css__WEBPACK_IMPORTED_MODULE_1__["default"])();
    const titleContainer = document.createElement('span');
    const titleElement = document.createElement('span');
    titleContainer.id = _consts__WEBPACK_IMPORTED_MODULE_0__.TITLE_CONTAINER_ID;
    titleElement.id = _consts__WEBPACK_IMPORTED_MODULE_0__.TITLE_ID;
    titleElement.innerText = title;
    // In case the text is too long to fit
    titleElement.title = title;
    titleContainer.append(titleElement);
    return titleContainer;
}


/***/ }),

/***/ "./ts/modal/index.ts":
/*!***************************!*\
  !*** ./ts/modal/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate),
/* harmony export */   getDocument: () => (/* binding */ getDocument),
/* harmony export */   getSocket: () => (/* binding */ getSocket),
/* harmony export */   getWindow: () => (/* binding */ getWindow)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./ts/modal/consts.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./css */ "./ts/modal/css.ts");
/* harmony import */ var _header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./header */ "./ts/modal/header/index.ts");
/* harmony import */ var _body__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./body */ "./ts/modal/body/index.ts");
/* harmony import */ var _nodes_actions_highlight__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nodes/actions/highlight */ "./ts/modal/body/nodes/actions/highlight/index.ts");





let socket;
let ownerDocument;
let ownerWindow;
function getSocket() {
    return socket;
}
function getDocument() {
    return ownerDocument;
}
function getWindow() {
    return ownerWindow;
}
function generate(config, _socket, _window) {
    socket = _socket;
    ownerDocument = socket.ownerDocument;
    ownerWindow = _window;
    (0,_css__WEBPACK_IMPORTED_MODULE_1__["default"])();
    const background = document.createElement('div');
    const foreground = document.createElement('div');
    background.id = _consts__WEBPACK_IMPORTED_MODULE_0__.MODAL_BACKGROUND_ID;
    foreground.id = _consts__WEBPACK_IMPORTED_MODULE_0__.MODAL_ID;
    background.append(foreground);
    socket.append(background);
    foreground.append((0,_header__WEBPACK_IMPORTED_MODULE_2__["default"])(config, background), (0,_body__WEBPACK_IMPORTED_MODULE_3__["default"])(config), (0,_nodes_actions_highlight__WEBPACK_IMPORTED_MODULE_4__.generateEave)(socket));
}


/***/ }),

/***/ "./ts/predicate.ts":
/*!*************************!*\
  !*** ./ts/predicate.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getPredicatePromise: () => (/* binding */ getPredicatePromise),
/* harmony export */   isUnresolved: () => (/* binding */ isUnresolved)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let count = 0;
function isUnresolved() {
    return count > 0;
}
function getPredicatePromise(_response) {
    return __awaiter(this, void 0, void 0, function* () {
        count++;
        try {
            const response = yield _response;
            count--;
            return typeof response === 'string' ? Promise.reject(response) : Promise[response ? 'resolve' : 'reject']();
        }
        catch (response) {
            count--;
            if (response instanceof Error) {
                return Promise.reject(response.message);
            }
            return Promise.reject(typeof response === 'string' ? response : undefined);
        }
    });
}


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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./ts/library/$Config.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ $Config)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../consts */ "./ts/consts.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index */ "./ts/library/index.ts");
/* harmony import */ var _modal_body__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modal/body */ "./ts/modal/body/index.ts");





const PATCHES = [
	(node) => {
		delete node.predicate;
		delete node.childPredicate;
		delete node.descendantPredicate;
		delete node.seed;
	},
	(node) => {
		delete node.input;
	},
];

const KEY_VERSION_CONFIG = 'TREE_FRAME_VERSION';
const KEY_VERSION_SCRIPT = 'SCRIPT_VERSION';
const KEY_STYLES = 'TREE_FRAME_USER_STYLES';

const STYLE_OUTER_DEFAULTS = {
	position: 'fixed',
	top: '0',
	height: '100vh',
	width: '100vw',
};

class $Config {
	constructor(treeKey, defaultTree, {defaultStyle = {}, outerStyle = {}, patches = []} = {}) {
		// PERMISSION CHECKS
		
		const getError = (reason, error) => {
			const message = `[${GM.info.script.name}]${reason.includes('\n') ? '\n\n' : ' '}${reason}`;
			
			if (error) {
				error.message = message;
				
				return error;
			}
			
			return new Error(message);
		};
		
		if (typeof GM.getValue !== 'function') {
			throw getError('Missing GM.getValue permission.');
		}
		
		if (typeof GM.setValue !== 'function') {
			throw getError('Missing GM.setValue permission.');
		}
		
		if (typeof treeKey !== 'string' || !(/^[a-z_][a-z0-9_]*$/i.test(treeKey))) {
			throw getError(`'${treeKey}' is not a valid storage key.`);
		}
		
		// PRIVATE
		
		const displayStyle = outerStyle.display ?? 'initial';
		
		const [target, targetLoad] = (() => {
			let targetWindow = window;
			
			while (targetWindow.frameElement) {
				targetWindow = window.parent;
			}
			
			const id = `${_consts__WEBPACK_IMPORTED_MODULE_0__.SOCKET_ID}-${treeKey}`;
			
			for (const child of targetWindow.document.body.children) {
				if (child.id === id) {
					child.remove();
					
					break;
				}
			}
			
			const target = document.createElement('iframe');
			
			const load = new Promise((resolve) => target.addEventListener('load', resolve, {once: true}));
			
			target.id = id;
			
			for (const [property, value] of Object.entries({...STYLE_OUTER_DEFAULTS, ...outerStyle})) {
				target.style[property] = value;
			}
			
			target.style.display = 'none';
			
			targetWindow.document.body.appendChild(target);
			
			return [target, load];
		})();
		
		let isOpen = false;
		
		const open = (doOpen = true) => new Promise((resolve) => {
			isOpen = doOpen;
			
			target.style.display = doOpen ? displayStyle : 'none';
			
			// Delay script execution until visual update
			setTimeout(resolve, 0);
		});
		
		const disconnect = () => new Promise((resolve) => {
			isOpen = false;
			
			target.remove();
			
			// Delay script execution until visual update
			setTimeout(resolve, 0);
		});
		
		// PUBLIC
		
		this.ready = Promise.all([
			GM.getValue(treeKey),
			GM.getValue(KEY_STYLES, []),
			GM.getValue(KEY_VERSION_CONFIG, -1),
			GM.getValue(KEY_VERSION_SCRIPT, 0),
			targetLoad,
		])
			// Retrieve data
			.then(([userTree, userStyles, configVersion, scriptVersion]) => {
				// Patch to current version
				
				(() => {
					if (!userTree) {
						return;
					}
					
					// patch to make configVersion start from 0 instead of -1
					if (configVersion < 2) {
						configVersion++;
					}
					
					if (configVersion < PATCHES.length) {
						const patchAllNodes = (doPatch, node = userTree) => {
							doPatch(node);
							
							if ('children' in node) {
								for (const child of node.children) {
									patchAllNodes(doPatch, child);
								}
							}
						};
						
						for (let i = configVersion; i < PATCHES.length; ++i) {
							patchAllNodes(PATCHES[i]);
						}
					}
					
					for (let i = scriptVersion; i < patches.length; ++i) {
						patches[i](userTree);
					}
				})();
				
				/**
			 * @name $Config#reset
			 * @description Deletes the user's data.
			 * @returns {Promise<void>} Resolves upon completing the deletion.
			 */
				this.reset = async () => {
					if (isOpen) {
						throw getError('Cannot reset while the UI is open.');
					}
					
					if (typeof GM.deleteValue !== 'function') {
						throw getError('Missing GM.deleteValue permission.');
					}
					
					await GM.deleteValue(treeKey);
					
					// It may have previously been a rejected promise
					this.ready = () => Promise.resolve();
					
					(0,_modal_body__WEBPACK_IMPORTED_MODULE_2__.reset)();
				};
				
				/**
			 * @name $Config#edit
			 * @description Allows the user to edit the active config.
			 * @returns {Promise<void>} Resolves when the user closes the config editor.
			 */
				this.edit = async () => {
					if (isOpen) {
						throw getError('A config editor is already open.');
					}
					
					open();
					
					const {tree, config, styles} = await (0,_index__WEBPACK_IMPORTED_MODULE_1__.edit)();
					
					GM.setValue(treeKey, tree);
					GM.setValue(KEY_STYLES, styles);
					GM.setValue(KEY_VERSION_CONFIG, PATCHES.length);
					GM.setValue(KEY_VERSION_SCRIPT, patches.length);
					
					this.get = ((config) => config).bind(null, Object.freeze(config));
					
					await open(false);
				};
				
				// Pass data
				
				return (0,_index__WEBPACK_IMPORTED_MODULE_1__.init)({
					userStyles,
					defaultTree,
					title: GM.info.script.name,
					defaultStyle,
					...(userTree ? {userTree} : {}),
				}, target.contentDocument.body, target.contentWindow);
			})
			.catch(async (error) => {
				delete this.reset;
				
				await disconnect();
				
				throw getError(
					'Your config is invalid.'
					+ '\nThis could be due to a script update or your data being corrupted.'
					+ `\n\nReason:\n${error.message.replaceAll(/\n+/g, '\n')}`,
					error,
				);
			})
			.then((response) => {
				this.get = ((config) => config).bind(null, Object.freeze(response.config));
				
				if (response.requireReset) {
					throw getError(
						'Your config is invalid.'
						+ '\nThis could be due to a script update or your data being corrupted.'
						+ `\n\nReason:\n${response.error.message.replaceAll(/\n+/g, '\n')}`,
						response.error,
					);
				}
			});
	}
}

})();

$Config = __webpack_exports__["default"];
/******/ })()
;