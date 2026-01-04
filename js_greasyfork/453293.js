// ==UserScript==
// @name         Stratums proe anti-POTATO (v 228)
// @namespace    http://tampermonkey.net/
// @version      228
// @description  potatoe
// @author       Pulsar
// @match        *://*.stratums.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/453293/Stratums%20proe%20anti-POTATO%20%28v%20228%29.user.js
// @updateURL https://update.greasyfork.org/scripts/453293/Stratums%20proe%20anti-POTATO%20%28v%20228%29.meta.js
// ==/UserScript==

(function() { 
    
    CanvasRenderingContext2D.prototype.moveTo=function(){}
    CanvasRenderingContext2D.prototype.stroke=function(){}
    CanvasRenderingContext2D.prototype._rotate = CanvasRenderingContext2D.prototype.rotate;
    CanvasRenderingContext2D.prototype.rotate=function(){
        if (arguments[0] > Math.PI*2) {
            return 0;
        }
        arguments[0] += arguments[0] * 1e4;
        this._rotate.call(this,...arguments);
    }
   
})();





