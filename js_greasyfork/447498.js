
// ==UserScript==
// @name         Digworm.IO iPad Fix?
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world
// @author       You
// @match        *://digworm.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=digworm.io
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/447498/DigwormIO%20iPad%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/447498/DigwormIO%20iPad%20Fix.meta.js
// ==/UserScript==

CanvasRenderingContext2D.prototype.fill = new Proxy(CanvasRenderingContext2D.prototype.fill,{
    apply(target,thisArgs,args){
        if(thisArgs.fillStyle==='#222222')return;
        return Reflect.apply(...arguments);
    }
});