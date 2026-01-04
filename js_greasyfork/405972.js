// ==UserScript==
// @name         Get Discord Token
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Allows you to retrieve your user token for reference.
// @author       iHavoc101#6156
// @match        https://discordapp.com/activ*
// @match        https://discordapp.com/channel*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/405972/Get%20Discord%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/405972/Get%20Discord%20Token.meta.js
// ==/UserScript==

// Cuz some ppl dont understand, tokens are for bots to remote login. Dumbheads\\

// Please no feedback on how does it work, if you don't know what it does, don't install\\


(function () {
   'use strict';

   // impliment localstorage behavior using cookie
   //---------------------------------------------
   if(!window.localStorage) {
      Object.defineProperty(window, "localStorage", new(function () {
         var aKeys = [],
            oStorage = {};
         Object.defineProperty(oStorage, "getItem", {
            value: function (sKey) {
               return this[sKey] ? this[sKey] : null;
            },
            writable: false,
            configurable: false,
            enumerable: false
         });
         Object.defineProperty(oStorage, "key", {
            value: function (nKeyId) {
               return aKeys[nKeyId];
            },
            writable: false,
            configurable: false,
            enumerable: false
         });
         Object.defineProperty(oStorage, "setItem", {
            value: function (sKey, sValue) {
               if(!sKey) {
                  return;
               }
               document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
            },
            writable: false,
            configurable: false,
            enumerable: false
         });
         Object.defineProperty(oStorage, "length", {
            get: function () {
               return aKeys.length;
            },
            configurable: false,
            enumerable: false
         });
         Object.defineProperty(oStorage, "removeItem", {
            value: function (sKey) {
               if(!sKey) {
                  return;
               }
               document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            },
            writable: false,
            configurable: false,
            enumerable: false
         });
         Object.defineProperty(oStorage, "clear", {
            value: function () {
               if(!aKeys.length) {
                  return;
               }
               for(var sKey in aKeys) {
                  document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
               }
            },
            writable: false,
            configurable: false,
            enumerable: false
         });
         this.get = function () {
            var iThisIndx;
            for(var sKey in oStorage) {
               iThisIndx = aKeys.indexOf(sKey);
               if(iThisIndx === -1) {
                  oStorage.setItem(sKey, oStorage[sKey]);
               } else {
                  aKeys.splice(iThisIndx, 1);
               }
               delete oStorage[sKey];
            }
            for(aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
               oStorage.removeItem(aKeys[0]);
            }
            for(var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
               aCouple = aCouples[nIdx].split(/\s*=\s*/);
               if(aCouple.length > 1) {
                  oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
                  aKeys.push(iKey);
               }
            }
            return oStorage;
         };
         this.configurable = false;
         this.enumerable = true;
      })());
   }
   //---------------------------------------------------

   var userToken = localStorage.getItem('token');

   var warn = "Got API Token for Sigma Bot!"

   // show warning, if accepted show token
   document.addEventListener('readystatechange', event => {
      if(event.target.readyState === "interactive") {} else if(event.target.readyState === "complete") {
         setTimeout(function () {
            if(confirm(warn)) {
               prompt("Your token:", userToken)
            }
         }, 3000);
      }
   });
})();
