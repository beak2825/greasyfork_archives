// ==UserScript==
// @name         Chat Timestamps Script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  adds timestamps to all messages
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385644/Chat%20Timestamps%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385644/Chat%20Timestamps%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){


/**************************
   Chat Timestamp Script
**************************/

var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}

var insertChat = ';var s=document.createElement("span");s.style="color:gray";s.innerHTML = "["+new Date().toTimeString().slice(0,8)+"] ";var c=document.getElementsByClassName("chl");c[c.length-1].prepend(s);'

var sicFunc = Live['prototype']['showInChat'].toString()
var paramsChat = getParams(sicFunc)

sicFunc = trim(sicFunc) + insertChat

Live['prototype']["showInChat"] = new Function(...paramsChat, sicFunc);


    });
})();