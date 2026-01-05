// ==UserScript==
// @name            object-utils
// @name:de         object-utils
// @namespace       dannysaurus.camamba
// @version         0.1
// @license         MIT License
// @description     inheritance, mixins and other stuff, mainly to encapsulate objects
// @description:de  inheritance, mixins and other stuff, mainly to encapsulate objects
// ==/UserScript==

var LIB = LIB || {};
/**
 *
 * @type {{mixin, extend, TruthyFalsy, Truthy, Falsy, Keeper, BackingData, emptyFunction, emptyDate}}
 */
LIB.objectUtils = (function() {
    'use strict';
    /**
     * Extends an object from another object through the prototype chain
     * @param {Object} superObj - The object to be extended
     * @param {Object} obj - The object extending the superObj
     * @return {boolean} true, if executed successfully
     */
    function _extend(superObj, obj){
        if (typeof superObj === 'undefined') return false;
        if (typeof obj === 'undefined') return false;
        // save properties of prototype of the obj
        var descriptors = {};
        Object.getOwnPropertyNames(obj.prototype).forEach(function(propName) {
            descriptors[propName] = Object.getOwnPropertyDescriptor(obj.prototype, propName);
        });
        // create a new extended prototype
        obj.prototype = Object.create(superObj.prototype, descriptors);
        obj.prototype.constructor = obj;
        return true;
    }
    /**
     * Clones properties from one object to another.
     * A property only gets cloned if it does not yet exist in the target object.
     * @param {Object} receiver - the target object receiver the properties
     * @param {Object} supplier - the source object supplying the properties
     * @param {Array} [props] - names of the relevant properties
     * @return {boolean} true, if executed successfully
     */
    function _mixin(receiver, supplier, props) {
        if (typeof supplier !== 'object' || typeof receiver !== 'object') {
            return false;
        }
        var propNames = Array.isArray(props) ? props : Object.getOwnPropertyNames(supplier);
        propNames.forEach(function(propName) {
            if (!Object.prototype.hasOwnProperty.call(receiver, propName)) {
                var desc = Object.getOwnPropertyDescriptor(supplier, propName);
                if (typeof desc !== 'undefined') {
                    Object.defineProperty(receiver, propName, desc);
                }
            }
        });
        return true;
    }

    /**
     * Has an object extending a super object by their prototype objects.
     * @param {Object} obj - The extending object
     * @return {{from: extendFrom, mixWith: mixWith}}
     */
    var extend = function(obj) {
        /**
         * Clones the prototype properties of the super object in the target object if the property does not yet exist there.
         * @param {Object} superObj - the source object supplying the properties
         * @param {Array} [props] - names of the relevant properties
         * @return {{thenWith: mixWith}}
         */
        var mixWith = function(superObj, props) {
            if (_mixin(obj.prototype, superObj.prototype, props)){
                return {
                    thenWith : mixWith
                };
            }
        };
        /**
         * Extends the super object from the prototype chain
         * @param superObj The super object to be extended
         * @return {{mixWith: mixWith}}
         */
        var extendFrom = function (superObj) {
            if (_extend(superObj, obj)) {
                return {
                    mixWith : mixWith
                };
            }
        };

        return {
            from : extendFrom,
            mixWith : mixWith
        };
    };

    /**
     * Defines an object that holds a value and specific values.
     * In case the value is a Truthy, Falsy or undefined it is overwritten with specific values.
     * @param value The common value.
     * @param [ifTruthy] if not undefined it overwrites value when it is a Truthy
     * @param [ifFalsy] if not undefined it overwrites value when it is a Falsy
     * @param [ifUndefined] if not undefined it overwrites value when it is undefined
     * @returns {TruthyFalsy}
     * @constructor
     */
    function TruthyFalsy(value, ifTruthy, ifFalsy, ifUndefined) {
        if (!this instanceof TruthyFalsy) {
            return new TruthyFalsy(value, ifTruthy, ifFalsy, ifUndefined);
        }
        this.value = value;
        if (ifTruthy !== 'undefined') { this.ifTruthy = ifTruthy; }
        if (ifFalsy !== 'undefined') { this.ifFalsy = ifFalsy; }
        if (ifUndefined !== 'undefined') { this.ifUndefined = ifUndefined; }
    }
    TruthyFalsy.prototype = {
        constructor : TruthyFalsy,
        valueOf: function() {
            var result = this.value;
            if (typeof this.ifUndefined !== "undefined" && typeof result === "undefined") {
                result = this.ifUndefined;
            } else if (typeof this.ifTruthy !== "undefined" && result) {
                result = this.ifTruthy;
            } else if (typeof this.ifFalsy !== "undefined" && result) {
                result = this.ifFalsy;
            }
            return result;
        },
        toString: function() {
            return String(this.valueOf());
        }
    };

    function Falsy(value, ifFalsy, ifUndefined) {
        if (!(this instanceof Falsy)) {
            return new Falsy(value, ifFalsy, ifUndefined);
        }
        TruthyFalsy.call(this, value, undefined, ifFalsy, ifUndefined);
    }
    extend(Falsy).from(TruthyFalsy);

    function Truthy(value, ifTruthy, ifUndefined) {
        if (!(this instanceof Truthy)) {
            return new Truthy(value, ifTruthy, ifUndefined);
        }
        TruthyFalsy.call(this, value, ifTruthy, undefined, ifUndefined);
    }
    extend(Truthy).from(TruthyFalsy);

    /**
     * Keeps elements assigned by an index
     * @param {number} [initialCapacity] - initial size of the array used to store the elements
     * @constructor
     */
    function Keeper(initialCapacity) {
        if (!(this instanceof Keeper)) {
            return new Keeper(initialCapacity);
        }
        var _store = new Array(initialCapacity || 16);
        var _pointer = 0;
        Object.defineProperties(this, {
            store: {
                get: function() { return _store },
                configurable: false, enumerable: false
            },
            pointer: {
                get: function() { return _pointer },
                configurable: false, enumerable: false
            }
        })
    }
    Keeper.prototype = {
        constructor: Keeper,
        /**
         * Adds a new element
         * @param {*|Object} item - The element to keep. Must not be type of <code>undefined</code>.
         * @return {number} The index (key) of the added element.<br>
         *                  <code>-1</code> if the element could not be added.
         */
        push: function(item) {
            if (typeof item !== 'undefined') {
                var index = this.pointer;
                this.store[index] = item;
                for (this.pointer = index + 1; this.pointer <= this.store.length; this.pointer++) {
                    if (typeof this.store[pointer] === 'undefined') { break; }
                }
                if (this.pointer === this.store.length) {
                    this.store.length *= 2;
                }
                return index;
            }
            return -1;
        },
        /**
         * Removes an element.
         * @param index The index (key) of the element to be removed.
         * @return {boolean} <code>true</code> if the element could be removed successfully
         */
        remove: function(index) {
            if (index + 1 >= this.store.length) {
                this.store[index] = undefined;
                this.pointer = index;
                return true;
            }
            return false;
        },
        /**
         * Gets the element with the specified index
         * @param {number} index - Index (key) of the element
         * @return {*|Object} the element with the specified index or <code>undefined</code>
         */
        get: function (index) {
            if (index + 1 <= this.store.length) {
                return this.store[index];
            }
            return undefined;
        }
    };

    /**
     * This callback is displayed as part of the Requester class.
     * @callback OnSetCallback
     * @param {*} oldValue - old value
     * @param {*} newValue - new value to be set
     */

    /**
     * Defines an accessor properties
     * @param {Object} sourceNode - the source object with the defining property
     * @param {Object} targetNode - the target object to define the accessor property
     * @param {string} propertyName - the name of the property which must exist on the <code>sourceNode</code>
     * @param {OnSetCallback} [onSetCallback] - called when the property gets assigned a value on the <code>targetNode</code>
     */
    var definePropRecursive = function(sourceNode, targetNode, propertyName, onSetCallback) {
        if (typeof onSetCallback !== "function") {
            onSetCallback = emptyFunction;
        }
        var srcProperty = sourceNode[propertyName];
        var isNode = (srcProperty !== null && typeof srcProperty === 'object' && Object.getPrototypeOf(srcProperty) === Object.prototype);
        if (isNode) {
            var childrenPropertyNames = Object.keys(srcProperty);
            var targetProperty = targetNode[propertyName] = {};
            childrenPropertyNames.forEach(function(childPropName) {
                definePropRecursive(srcProperty, targetProperty, childPropName, onSetCallback);
            });
        } else {
            Object.defineProperty(targetNode, propertyName, {
                enumerable: true,
                configurable: true,
                get: function() { return sourceNode[propertyName]; },
                set: function(value) {
                    onSetCallback(sourceNode[propertyName], value);
                    sourceNode[propertyName] = value;
                }
            });
        }
    };

    /**
     * Backing data that can be stored in the userscript database.
     * intially defines getter and setter on the front
     * @param {Object} frontObject - the object to define the properties on according to <code>dataObject</code>
     * @param {Object} dataObject - the Object defining the backing data structure and initial values
     * @param {string} dbKey - key for storing the data in the userscript db
     * @param {OnSetCallback} [onSet] - function called when a property of <code>dataObject</code> gets assigned a value through the <code>frontObject</code>
     * @returns {BackingData}
     * @constructor
     */
    function BackingData(frontObject, dataObject, dbKey, onSet) {
        if (!(this instanceof BackingData)) {
            return new BackingData(frontObject, dataObject, dbKey, onSet);
        }
        _mixin(this, dataObject);
        Object.defineProperties(this, {
            dbKey: { enumerable: false, configurable: true, writable: true, value: dbKey },
            frontObject: { enumerable: false, configurable: true, writable: true, value: frontObject },
            onSet: { enumerable: false, configurable: true, writable: true, value: onSet }
        });
        Object.keys(this).forEach(function(propName) {
            definePropRecursive(this, frontObject, propName, onSet);
        }, this);
    }
    BackingData.prototype = {
        constructor: BackingData,
        load: function() {
            var loadedObjSerialized = GM_getValue(this.dbKey);
            if (typeof loadedObjSerialized === "undefined") {
                return false;
            }

            var loadedObj = JSON.parse(loadedObjSerialized);
            Object.keys(this).forEach(function(propName) {
                var prop = loadedObj[propName];
                if (typeof prop !== "undefined") {
                    this[propName] = prop;
                }
            }, this);
            Object.keys(this).forEach(function(propName) {
                definePropRecursive(this, this.frontObject, propName, this.onSet);
            }, this);
            return true;
        },
        save: function() {
            var savingObj = {};
            _mixin(savingObj, this);
            var savingObjSerialized = JSON.stringify(savingObj);
            GM_setValue(this.dbKey, savingObjSerialized);
        },
        remove: function() {
            GM_deleteValue(this.dbKey);
        }
    };

    /** placeholder for empty callbacks */
    function emptyFunction() {}
    /** placeholder for an undefined date */
    var emptyDate = new Date('invalid');

    return {
        mixin: _mixin,
        extend: extend,
        TruthyFalsy: TruthyFalsy,
        Truthy: Truthy,
        Falsy: Falsy,
        Keeper: Keeper,
        BackingData: BackingData,
        get emptyFunction() { return emptyFunction },
        get emptyDate() { return emptyDate }
    };
})();
