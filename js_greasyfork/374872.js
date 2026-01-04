// ==UserScript==
// @name         Free Süddeutsche ~ Adblock-Blocker-Block
// @namespace    https://greasyfork.org/de/users/228374-lynx
// @version      0.5beta
// @description  Blendet die bereits im Browser geladenen, aber versteckten Inhalte / Artikel der sueddeutsche.de nach kleiner Verzögerung ein.
// @author       LYNX
//               Verbesserung von / Dank an GreasyROB
// @match        https://www.sueddeutsche.de/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/374872/Free%20S%C3%BCddeutsche%20~%20Adblock-Blocker-Block.user.js
// @updateURL https://update.greasyfork.org/scripts/374872/Free%20S%C3%BCddeutsche%20~%20Adblock-Blocker-Block.meta.js
// ==/UserScript==
/*global $: false */

(function() {
    function clientHeight() {
        return window.innerWidth && document.documentElement.clientWidth ?
        Math.min(window.innerWidth, document.documentElement.clientWidth) :
        window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
    // soure / from: https://stackoverflow.com/questions/6942785/window-innerwidth-vs-document-documentelement-clientwidth
    }
    setTimeout(function(){
        $("div[class^='sp_message_']").remove();
        document.getElementById("sueddeutsche").style.display = "block";
        document.body.style = "overflow-y: scroll; height: " + clientHeight() + "px;";
    }, 1000);
})();
