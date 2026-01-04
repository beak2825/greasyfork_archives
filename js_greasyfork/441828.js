// ==UserScript==
// @name          MooMoo Starter for your script
// @namespace    whatever you want to put here
// @version      1.0
// @description  This is a script that modifies MooMoo.io!
// @author       Your name here
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://*.moomoo.io/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441828/MooMoo%20Starter%20for%20your%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/441828/MooMoo%20Starter%20for%20your%20script.meta.js
// ==/UserScript==
 
setInterval(() => window.follmoo && follmoo(), 10);//Starter resources
document.querySelector("#pre-content-container").remove(); //No Ads
document.getElementById("storeHolder").style = "height: 1000px; width: 480px;"; //Bigger Store
document.querySelector("#pre-content-container").remove();
document.getElementById("enterGame").addEventListener('click', autohide);
function autohide(){
    $("#ot-sdk-btn-floating").hide();
}