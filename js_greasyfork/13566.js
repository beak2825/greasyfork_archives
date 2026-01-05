// ==UserScript==
// @name       Soundcloud hide reposts
// @namespace  m36
// @version    0.2
// @description  hides reposts in stream
// @match      http://soundcloud.com/stream
// @match      https://soundcloud.com/stream
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @copyright  2013
// @downloadURL https://update.greasyfork.org/scripts/13566/Soundcloud%20hide%20reposts.user.js
// @updateURL https://update.greasyfork.org/scripts/13566/Soundcloud%20hide%20reposts.meta.js
// ==/UserScript==
(function () {
    function norepost() { $(".soundList__item:has('.actorUser')").remove(); }
    window.addEventListener("DOMNodeInserted",norepost, false);
})() 
