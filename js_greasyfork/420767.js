// ==UserScript==
// @name         M4Sport
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  remove advertising
// @author       Hamid
// @match        https://onlinestream.live/m4-sport/videoplayer/5903-1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420767/M4Sport.user.js
// @updateURL https://update.greasyfork.org/scripts/420767/M4Sport.meta.js
// ==/UserScript==
var list = document.getElementsByTagName("DIV");
for(var i = 0;i<list.length;i++){
    if(list[i].className=="adp-underlay" || list[i].className=="adp") list[i].className="display:none";
}
