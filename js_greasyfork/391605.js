// ==UserScript==
// @name         Bitly BBT2 Redux State Debugger
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  An Awesome Debugger!
// @author       You
// @match        *://app.bitly.org/*
// @match        *://app.bitly.com/*
// @match        *://app.bitly.net/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/391605/Bitly%20BBT2%20Redux%20State%20Debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/391605/Bitly%20BBT2%20Redux%20State%20Debugger.meta.js
// ==/UserScript==

// Hooks Into Bitly App Code!

var checkAppStateExists = setInterval(function() {
    if(unsafeWindow.App) {
     if (unsafeWindow.App.State) {

         console.debug("%cApp State Exists! Initializing Bitly Dev Tools ... ", "padding: 1rem; background-color: green; color: white; font-size: 20px;");
         clearInterval(checkAppStateExists);

         let cb = (newData, oldData, keyPath) => {
                 let oldDataJS = deepClone(oldData.toJS());
                 let newDataJS = deepClone(newData.toJS());

                 let allDiffs = diff(oldDataJS, newDataJS)

                 // pre-processing
                 var getLeaves = function(tree) {
                     var leaves = [];
                     var walk = function(obj,path){

                         // truncate object if has large property count for rendering optimization
                         if(obj !== null && (typeof obj === "object")) {
                             let maxCount = unsafeWindow.bitlyLogger.state.maxPropertyCount;
                             maxCount = maxCount < 5 ? 5 : maxCount; // fix bug in max property count less than 5 later.
                             if(Object.keys(obj).length > maxCount) {
                                 obj = "[Warning] More Than " + maxCount + " Changes Within This Branch!"
                                 set(allDiffs, path, "[Warning] More Than " + maxCount + " Changes Within This Branch!")
                                 set(oldDataJS, path, "[Warning] More Than " + maxCount + " Changes Within This Branch!")
                                 set(newDataJS, path, "[Warning] More Than " + maxCount + " Changes Within This Branch!")
                                 leaves.push(path);
                                 return;
                             }
                         }

                         for(var n in obj){
                             if (obj.hasOwnProperty(n)) {
                                 // !!! js treats null as typeof "object" ... early exit
                                 if(obj[n] !== null && (typeof obj[n] === "object" || obj[n] instanceof Array) ) {
                                     walk(obj[n], path.concat([n]));
                                 } else {
                                     leaves.push(path.concat([n]));
                                 }
                             }
                         }
                     }
                     walk(tree, []);
                     return leaves;
                 }

                 let css = []
                 let leaves = getLeaves(allDiffs)

                 leaves.forEach( (leaf, idx) => {
                     if (leaf) {

                         let old_data = get( oldDataJS, leaf )
                         let new_data = get( newDataJS, leaf )

                         let oldDataHasLeafNode = hasPath( oldDataJS, leaf )
                         let newDataHasLeafNode = hasPath( newDataJS, leaf )

                         const formatter = (value) => {
                             if (value === null) return "null";
                             if (value === undefined) return "undefined";
                             if (value === "") return '\"\"';
                             return value;
                             //return JSON.stringify(value).replace('%', '')
                         }

                         // THIS PROPERTY DID NOT EXIST IN OLD OBJECT (PROPERTY HAS BEEN ADDED)
                         if (!oldDataHasLeafNode && newDataHasLeafNode) {
                             css.push('font-weight: bold; color: #228B22; text-decoration: none;', '')
                             css.push('background-color: green; color: white; text-decoration: none; padding: 1px;border-radius:5px;', '')
                             set(allDiffs, leaf, "%c" + formatter(new_data) + "%c %c ADDED %c" )
                         }
                         // THIS PROPERTY DOES NOT EXIST IN NEW OBJECT (PROPERTY HAS BEEN DELETED)
                         else if (oldDataHasLeafNode && !newDataHasLeafNode) {
                             css.push('font-weight: bold; color: red; text-decoration: line-through;', '')
                             css.push('background-color: red; color: white; text-decoration: none; padding: 1px;border-radius:5px;', '')
                             set(allDiffs, leaf, "%c" + formatter(old_data) + "%c %c DELETED %c")
                         }
                         // THIS PROPERTY EXISTS IN BOTH OLD AND NEW OBJECT
                         else {
                             // PROPERTY HAS NOT BEEN CHANGED -- USED FOR MANUALLY CHANGED PROPERTIES FOR WARNING MESSAGES
                             if (old_data === new_data) {
                                 css.push('font-weight: bold; color: gray; text-decoration: none;', '')
                                 css.push('background-color: gray; color: white; text-decoration: none; padding: 1px;border-radius:5px;', '')
                                 set(allDiffs, leaf, "%c" + formatter(new_data) + "%c %c WARNING %c")
                             }
                             // PROPERTY HAS BEEN CHANGED
                             else {
                                 css.push('font-weight: bold; color: red; text-decoration: line-through;', '')
                                 css.push('font-weight: bold; color: #228B22; text-decoration: none;', '')
                                 css.push('background-color: purple; color: white; text-decoration: none; padding: 1px;border-radius:5px;', '')
                                 set(allDiffs, leaf, "%c" + formatter(old_data) + "%c %c" + formatter(new_data) + "%c %c UPDATED %c")
                             }
                         }
                     }
                 })

                 var postprocessing = function(tree) {
                     var walk = function(obj){
                         for(var n in obj){
                             if (obj.hasOwnProperty(n)) {
                                 // !!! js treats null as typeof "object" ... early exit
                                 if(obj[n] !== null && typeof obj[n] === "object" ) {
                                     // convert back to list (not quite working for nested yet ...
                                     if ( Object.keys(obj[n]).every( (key, idx) => key == idx) ) {
                                         let result = Object.keys(obj[n]).map(function(key) {
                                             return obj[n][key];
                                         });
                                         obj[n] = result
                                     } else {
                                         walk(obj[n]);
                                     }
                                 }
                             }
                         }
                     }
                     walk(tree);

                     let treeString = JSON.stringify(tree, undefined, 3)
                     let removeCurlyBraces = !unsafeWindow.bitlyLogger.state.curlyBraces;
                     let hasLabel = unsafeWindow.bitlyLogger.state.labels;
                     treeString = removeCurlyBraces ? treeString.replace(/[{}]/g, '').replace(/^\s*\n/gm, '').trim() : treeString;
                     if (unsafeWindow.bitlyLogger.state.logging) {
                         if(treeString.length > 0 && treeString !== '{}') {
                             if (hasLabel) {
                                 console.debug("%c State Change ", "padding: 0.1rem; background-color: gray; color: white; font-size: 10.5px;");
                             }
                             console.debug(treeString, ...css)
                         }
                     }
                 }

                 postprocessing(allDiffs)

         }

      unsafeWindow.App.State.on('swap', cb)
     }
    }
}, 100);

var checkAppActionsExist = setInterval(function() {
    if(unsafeWindow.App) {
     if (unsafeWindow.App.Actions) {
         clearInterval(checkAppActionsExist);
         function logActions(Actions, logger) {
             for (let type of Object.keys(Actions)) {
                 for (let actionName of Object.keys(Actions[type])) {
                     let action = Actions[type][actionName];
                     action.listen((...data) => {
                         if (unsafeWindow.bitlyLogger.actions.logging) {
                             logger('%c Action Fired %c' + `${type}.${actionName} %c`, "padding: 0.1rem; margin-right: 0.75rem; background-color: gray; color: white; font-size: 10.5px;", "padding: 1px; background-color: #2a5bd7; color: white; border-radius: 5px;", "");
                         }
                     });
                 }
             }
         }
         logActions(unsafeWindow.App.Actions, console.debug)
     }
    }
}, 100);

unsafeWindow.bitlyLogger = {
    actions: {
        logging: false
    },
    state: {
        logging: true,
        maxPropertyCount: 5,
        curlyBraces: true,
        labels: true
    },
    getState: () => unsafeWindow.App.State.cursor().deref().toJS(),
    getStateAsCursor: () => unsafeWindow.App.State.cursor(),
    getStateAsImmutable: () => unsafeWindow.App.State.cursor().deref()
}






































// LIBRARY / HELPER FUNCTIONS (deep-object-diff, lodash, stack overflow stuffs)

const isDate = d => d instanceof Date;
const isEmpty = o => Object.keys(o).length === 0;
const isObject = o => o != null && typeof o === 'object';
const properObject = o => isObject(o) && !o.hasOwnProperty ? { ...o } : o;

const addedDiff = (lhs, rhs) => {

  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  const l = properObject(lhs);
  const r = properObject(rhs);

  return Object.keys(r).reduce((acc, key) => {
    if (l.hasOwnProperty(key)) {
      const difference = addedDiff(l[key], r[key]);

      if (isObject(difference) && isEmpty(difference)) return acc;

      return { ...acc, [key]: difference };
    }

    return { ...acc, [key]: r[key] };
  }, {});
};

const deletedDiff = (lhs, rhs) => {
  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  const l = properObject(lhs);
  const r = properObject(rhs);

  return Object.keys(l).reduce((acc, key) => {
    if (r.hasOwnProperty(key)) {
      const difference = deletedDiff(l[key], r[key]);

      if (isObject(difference) && isEmpty(difference)) return acc;

      return { ...acc, [key]: difference };
    }

    return { ...acc, [key]: undefined };
  }, {});
};

const diff = (lhs, rhs) => {
  if (lhs === rhs) return {}; // equal return no diff

  if (!isObject(lhs) || !isObject(rhs)) return rhs; // return updated rhs

  const l = properObject(lhs);
  const r = properObject(rhs);

  const deletedValues = Object.keys(l).reduce((acc, key) => {
    return r.hasOwnProperty(key) ? acc : { ...acc, [key]: undefined };
  }, {});

  if (isDate(l) || isDate(r)) {
    if (l.valueOf() == r.valueOf()) return {};
    return r;
  }

  return Object.keys(r).reduce((acc, key) => {
    if (!l.hasOwnProperty(key)) return { ...acc, [key]: r[key] }; // return added r key

    const difference = diff(l[key], r[key]);

    if (isObject(difference) && isEmpty(difference) && !isDate(difference)) return acc; // return no diff

    return { ...acc, [key]: difference }; // return updated key
  }, deletedValues);
};

const updatedDiff = (lhs, rhs) => {

  if (lhs === rhs) return {};

  if (!isObject(lhs) || !isObject(rhs)) return rhs;

  const l = properObject(lhs);
  const r = properObject(rhs);

  if (isDate(l) || isDate(r)) {
    if (l.valueOf() == r.valueOf()) return {};
    return r;
  }

  return Object.keys(r).reduce((acc, key) => {

    if (l.hasOwnProperty(key)) {
      const difference = updatedDiff(l[key], r[key]);

      if (isObject(difference) && isEmpty(difference) && !isDate(difference)) return acc;

      return { ...acc, [key]: difference };
    }

    return acc;
  }, {});
};

const detailedDiff = (lhs, rhs) => ({
  added: addedDiff(lhs, rhs),
  deleted: deletedDiff(lhs, rhs),
  updated: updatedDiff(lhs, rhs),
});

// LODASH GET

function memoize(func, resolver) {
  if (typeof func !== 'function' || (resolver != null && typeof resolver !== 'function')) {
    throw new TypeError('Expected a function')
  }
  const memoized = function(...args) {
    const key = resolver ? resolver.apply(this, args) : args[0]
    const cache = memoized.cache

    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = func.apply(this, args)
    memoized.cache = cache.set(key, result) || cache
    return result
  }
  memoized.cache = new (memoize.Cache || Map)
  return memoized
}

memoize.Cache = Map

function memoizeCapped(func) {
  const MAX_MEMOIZE_SIZE = 500
  const result = memoize(func, (key) => {
    const { cache } = result
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear()
    }
    return key
  })

  return result
}

const stringToPath = memoizeCapped((string) => {
    const charCodeOfDot = '.'.charCodeAt(0)
    const reEscapeChar = /\\(\\)?/g
    const rePropName = RegExp(
      // Match anything that isn't a dot or bracket.
      '[^.[\\]]+' + '|' +
      // Or match property names within brackets.
      '\\[(?:' +
        // Match a non-string expression.
        '([^"\'][^[]*)' + '|' +
        // Or match strings (supports escaping characters).
        '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
      ')\\]'+ '|' +
      // Or match "" as the space between consecutive dots or empty brackets.
      '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))'
      , 'g')

  const result = []
  if (string.charCodeAt(0) === charCodeOfDot) {
    result.push('')
  }
  string.replace(rePropName, (match, expression, quote, subString) => {
    let key = match
    if (quote) {
      key = subString.replace(reEscapeChar, '$1')
    }
    else if (expression) {
      key = expression.trim()
    }
    result.push(key)
  })
  return result
})

function isKey(value, object) {
  const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/
  const reIsPlainProp = /^\w*$/

  if (Array.isArray(value)) {
    return false
  }
  const type = typeof value
  if (type === 'number' || type === 'boolean' || value == null || isSymbol(value)) {
    return true
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object))
}

function getTag(value) {
  const toString = Object.prototype.toString

  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)
}

function isSymbol(value) {
  const type = typeof value
  return type == 'symbol' || (type === 'object' && value != null && getTag(value) == '[object Symbol]')
}

function toKey(value) {
  const INFINITY = 1 / 0

  if (typeof value === 'string' || isSymbol(value)) {
    return value
  }
  const result = `${value}`
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result
}

function castPath(value, object) {
  if (Array.isArray(value)) {
    return value
  }
  return isKey(value, object) ? [value] : stringToPath(value)
}

function baseGet(object, path) {
  path = castPath(path, object)

  let index = 0
  const length = path.length

  while (object != null && index < length) {
    object = object[toKey(path[index++])]
  }
  return (index && index == length) ? object : undefined
}

function get(object, path, defaultValue) {
  const result = object == null ? undefined : baseGet(object, path)
  return result === undefined ? defaultValue : result
}


// LODASH SET

function eq(value, other) {
  return value === other || (value !== value && other !== other)
}


function baseAssignValue(object, key, value) {
  if (key == '__proto__') {
    Object.defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    })
  } else {
    object[key] = value
  }
}

/** Used as references for various `Number` constants. */
const MAX_SAFE_INTEGER = 9007199254740991

/** Used to detect unsigned integer values. */
const reIsUint = /^(?:0|[1-9]\d*)$/

function isIndex(value, length) {
  const type = typeof value
  length = length == null ? MAX_SAFE_INTEGER : length

  return !!length &&
    (type === 'number' ||
      (type !== 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length)
}

function assignValue(object, key, value) {
  const hasOwnProperty = Object.prototype.hasOwnProperty
  const objValue = object[key]

  if (!(hasOwnProperty.call(object, key) && eq(objValue, value))) {
    if (value !== 0 || (1 / value) === (1 / objValue)) {
      baseAssignValue(object, key, value)
    }
  } else if (value === undefined && !(key in object)) {
    baseAssignValue(object, key, value)
  }
}


function baseSet(object, path, value, customizer) {

  function isObject(value) {
    const type = typeof value
    return value != null && (type === 'object' || type === 'function')
  }

  if (!isObject(object)) {
    return object
  }
  path = castPath(path, object)

  const length = path.length
  const lastIndex = length - 1

  let index = -1
  let nested = object

  while (nested != null && ++index < length) {
    const key = toKey(path[index])
    let newValue = value

    if (index != lastIndex) {
      const objValue = nested[key]
      newValue = customizer ? customizer(objValue, key, nested) : undefined
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {})
      }
    }
    assignValue(nested, key, newValue)
    nested = nested[key]
  }
  return object
}

function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value)
}

// NESTED HAS PROPERTY FUNCTION
function isObjectLike(value) {
  return typeof value === 'object' && value !== null
}

function isLength(value) {
  return typeof value === 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER
}

function isArguments(value) {
  return isObjectLike(value) && getTag(value) == '[object Arguments]'
}

function hasPath(object, path) {
  const hasOwnProperty = Object.prototype.hasOwnProperty

  path = castPath(path, object)

  let index = -1
  let { length } = path
  let result = false
  let key

  while (++index < length) {
    key = toKey(path[index])
    if (!(result = object != null && hasOwnProperty.call(object, key))) {
      break
    }
    object = object[key]
  }
  if (result || ++index != length) {
    return result
  }
  length = object == null ? 0 : object.length
  return !!length && isLength(length) && isIndex(key, length) &&
    (Array.isArray(object) || isArguments(object))
}

// LODASH CLONE DEEP
function deepClone(obj, hash = new WeakMap()) {
    if (Object(obj) !== obj) return obj; // primitives
    if (obj instanceof Set) return new Set(obj); // See note about this!
    if (hash.has(obj)) return hash.get(obj); // cyclic reference
    const result = obj instanceof Date ? new Date(obj)
                 : obj instanceof RegExp ? new RegExp(obj.source, obj.flags)
                 : obj.constructor ? new obj.constructor()
                 : Object.create(null);
    hash.set(obj, result);
    if (obj instanceof Map)
        Array.from(obj, ([key, val]) => result.set(key, deepClone(val, hash)) );
    return Object.assign(result, ...Object.keys(obj).map (
        key => ({ [key]: deepClone(obj[key], hash) }) ));
}