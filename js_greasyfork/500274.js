// ==UserScript==
// @name         JS逆向网站钩子
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Try to take over the world!
// @author       helong
// @match        *
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500274/JS%E9%80%86%E5%90%91%E7%BD%91%E7%AB%99%E9%92%A9%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/500274/JS%E9%80%86%E5%90%91%E7%BD%91%E7%AB%99%E9%92%A9%E5%AD%90.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Hook into a specific object method using Proxy
  const targetObject = {
    method1: function (param) {
      console.log("Original method1 called with param:", param);
    }
  };

  const handler = {
    get: function (target, prop, receiver) {
      if (typeof target[prop] === 'function') {
        return function (...args) {
          console.log(`Method ${prop} called with args:`, args);
          return target[prop].apply(this, args);
        }
      }
      return Reflect.get(target, prop, receiver);
    }
  };

  const proxiedObject = new Proxy(targetObject, handler);
  proxiedObject.method1('test');

  // Override a native method like fetch
  const originalFetch = window.fetch;

  window.fetch = function (...args) {
    console.log('Fetch called with args:', args);
    return originalFetch.apply(this, args);
  };

  // Modify property access using Object.defineProperty
  const obj = {
    _prop: 'value'
  };

  Object.defineProperty(obj, 'prop', {
    get: function () {
      console.log('Getter called');
      return this._prop;
    },
    set: function (newValue) {
      console.log('Setter called with value:', newValue);
      this._prop = newValue;
    }
  });

  console.log(obj.prop);
  obj.prop = 'new value';

  // Fake a function's toString method
  const originalAlert = window.alert;

  window.alert = function (...args) {
    console.log('Alert called with args:', args);
    return originalAlert.apply(this, args);
  };

  window.alert.toString = function () {
    return 'function alert() { [native code] }';
  };

  /* 
    // Hook into a specific function, if known
    const originalSomeFunction = window.someFunction;
  
    window.someFunction = function (...args) {
      console.log('someFunction called with args:', args);
      return originalSomeFunction.apply(this, args);
    };
   */
  var myJsonParse = JSON.parse
  JSON.parse = function (params) {
    console.log('myJsonParse', params)

    return myJsonParse(params);
  }

  var myJSONstringify = JSON.stringify;
  JSON.stringify = function (...args) {

    console.log('myJSONstringify', value);
    return myJSONstringify.apply(this, args);
  };

})();