// ==UserScript==
// @name         Hotcord for Discord
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Login to a token
// @author       DwifteJB & CrafterPika
// @match        http*://discord.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/414991/Hotcord%20for%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/414991/Hotcord%20for%20Discord.meta.js
// ==/UserScript==
var url = window.location.href;

if(url.indexOf("discord.com/login") != -1) {
    var x = document.getElementsByClassName("block-egJnc0");

    var item = '<div class="marginTop20-3TxNs6 marginBottom20-32qID7"><h5 class="colorStandard-2KCXvj size14-e6ZScH h5-18_1nd title-3sZWYQ defaultMarginh5-2mL-bP">Token</h5><div class="inputWrapper-31_8H8"><input id="tokenin" class="inputDefault-_djjkz input-cIJ7To" name="token" type="token" placeholder="Token Here.." aria-label="Token" autocomplete="off" maxlength="999" spellcheck="false" value="" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAAAXNSR0IArs4c6QAAAZ9JREFUOBGVU7uKwkAUPXmID5AttNyFYBGwsLGwFBUFF/wOhfyE5jPcxkZt/IHFxg+wsZJtrFwS8NWIohZm545xNkp8XcjMnbnnnJk790YyTfPTcZwm+z7whEmSNGWwaqPR+Ca4/AqZCO5BX+STkcBTJ5/gp9HLkb2BR34kEoGu6xewlwQ0TUOxWPQXCIVCIhAMBsEeS6y9MbHpOirNlUoF6XQanU4Hq9UKhmHAsiy0Wq2L2DWZ1i+l4Ccg1et1hwJ0zd1uxzGUwn6/98OLPZbiL1vUxA3OZEI8IhOGlfKdTU3+BrThZ5lMBoVCAev1Gr1eD7PZDIFAALIs80NIRNzAT4DIw+EQm80G2WyWQ1KpFHK5nICr1NvezhIR5iyXSyQSCUSjUSiKgnK5jGQyCVVVEYvF0O12oeTz+R+GJfk3L5n8yWTC+yEej3OxwWCA4/GI7XaLfr/P0/jvlis2VadUKvH+IFK73YZt2yCxcDiM6ZR+SuDuI45GI4zHY8zncxwOB05YLBZ8Pg83BajOjEilummEuVeFmtssvgJurPYHGEKbZ/T0eqIAAAAASUVORK5CYII=&quot;); background-repeat: no-repeat; background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%;"></div></div><button type="button" id="tlogin" class="marginBottom20-32qID7 button-3k0cO7 button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeLarge-1vSeWK fullWidth-1orjjo grow-q77ONN"><div class="contents-18-Yxp">Login With Token</div></button>'

    x[0].innerHTML = item + x[0].innerHTML;
    var result = [];

    document.getElementById("tlogin").addEventListener("click", function(){
    var token = document.getElementById("tokenin").value;
    window.localStorage = document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage;
    window.setInterval(() => window.localStorage.token = `"${token}"`);
    window.location.reload();
    });
} else if(url.indexOf("discord.com/channels") != -1) {
    (function () {
       'use strict';
       var result = [];

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
   
 
       var userToken = localStorage.getItem('token');
       var y = document.getElementsByClassName("colorMuted-HdFt4q")
       y[1].innerHTML = y[1].innerHTML + "<br><br>Your token:<br>" + userToken;
    })();
} else {
    result = [];
    alert("Discord not found, aborting.")
 
} 