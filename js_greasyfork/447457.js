// ==UserScript==
// @name         OP FPS Counter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simple rainbow FPS counter :D
// @author       You
// @match        *://*/*
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447457/OP%20FPS%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/447457/OP%20FPS%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var fps = 0;
    var el = top.document.createElement('div')
    el.style = "position:fixed;top:0%;left:1%;color:gray;font-family:Arial;font-size:23px;z-index:999999999999999999999;";
    el.innerHTML = "60";
    top.document.body.appendChild(el)
    var i = 0;
    setInterval(()=>{
        el.innerHTML = fps+" FPS";
        fps=0;
    },1000);
    setInterval(()=>{
        el.style.color = "hsl(" + (360 * i / 100) + ",80%,50%)";
        if(i==100){i=0};
        i+=1;
    },10);
    function counter() {
        window.requestAnimationFrame(counter);
        fps += 1;
        
    }
    counter();
    
})();




