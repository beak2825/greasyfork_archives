// ==UserScript==
// @name         Parrot_Killer
// @namespace    http://tampermonkey.net/
// @version      0.111
// @description  try to take over the world!
// @author       Life
// @match        https://shikme.ru/
// @icon         https://shikme.ru/default_images/icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413181/Parrot_Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/413181/Parrot_Killer.meta.js
// ==/UserScript==

(function() {
    var a=document.querySelector('.list_element.left_item[onclick*="showParrot();"]');a&&a.remove();
    const l=document.getElementById("chat_logs_container");
    const k=document.getElementById("chat_right_data");
    k.addEventListener("DOMNodeInserted", (e)=>{if(e.target.querySelector){var b=e.target.querySelector('.in_room_element[onclick*="switchRoom(83,"]');b&&b.remove()}}, false);
    l.addEventListener("DOMNodeInserted", (e)=>{if(e.target.getElementsByClassName && e.target.getElementsByClassName("my_text").length){
        var at=e.target.getElementsByClassName("chat_message");if(at.length)at=at[0];at.querySelectorAll('img[src*="parrot"]').forEach(a=>a.setAttribute('src','emoticon/rainbow.png'))}}, false);
console.log(GM_info.script.name+' v'+GM_info.script.version+' run');

})();