// ==UserScript==
// @name         Evernote direct link access
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       とげとげ
// @match        https://www.evernote.com/OutboundRedirect.action*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @description  Evernoteのノート上のリンクに直接アクセスします

// @downloadURL https://update.greasyfork.org/scripts/31385/Evernote%20direct%20link%20access.user.js
// @updateURL https://update.greasyfork.org/scripts/31385/Evernote%20direct%20link%20access.meta.js
// ==/UserScript==

$(window).on('load',function(){
    var url    = (location.href).substr(54);
    var result = decodeURIComponent(url);
    window.location.href = result;
})(jQuery);