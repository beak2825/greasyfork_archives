// ==UserScript==
// @name         網站禁止複製腳本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  網站禁止複製
// @author       Kenny526
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459067/%E7%B6%B2%E7%AB%99%E7%A6%81%E6%AD%A2%E8%A4%87%E8%A3%BD%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/459067/%E7%B6%B2%E7%AB%99%E7%A6%81%E6%AD%A2%E8%A4%87%E8%A3%BD%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.oncontextmenu = function(){
        window.event.returnValue=false;
    }
    document.body.oncopy = function(){
        event.returnValue=false;
    }
})();