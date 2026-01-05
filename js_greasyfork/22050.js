// ==UserScript==
// @name        Forzar HTML5 en AnimeFLV.net
// @description Obliga a la página a que utilice el reproductor nativo, incluso con Flash activado. Petición de https://greasyfork.org/users/3118-roxz, ¡que lo disfrutes!
// @match       *://animeflv.net/*
// @version     1
// @grant       none
// @namespace https://greasyfork.org/users/4813
// @downloadURL https://update.greasyfork.org/scripts/22050/Forzar%20HTML5%20en%20AnimeFLVnet.user.js
// @updateURL https://update.greasyfork.org/scripts/22050/Forzar%20HTML5%20en%20AnimeFLVnet.meta.js
// ==/UserScript==


console.log("finmcaosdfñpas");

Object.defineProperty(window, 'mobileAndTabletcheck',
{
    configurable: false,
    writable: false,
    value: function()
    {
      console.info("check overriden!", arguments);
      return true;
    }
});

RegExp.prototype.match = function(){ console.log("match",arguments) }
String.prototype.match = function(){ console.log("match",arguments) }