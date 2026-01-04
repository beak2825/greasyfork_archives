// ==UserScript==
// @name         SingSnap Chat UI Maximizer
// @namespace    https://greasyfork.org/en/scripts/381872-singsnap-chat-ui-maximizer
// @version      0.4
// @description  Enlarges chat Flash widget, hides extraneous Singsnap UI elements, tweaks styles so the chat UI can take up most of the screen.
// @author       Won Kim
// @match        http://www.singsnap.com/karaoke/chat/main*
// @license      GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html)
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/381872/SingSnap%20Chat%20UI%20Maximizer.user.js
// @updateURL https://update.greasyfork.org/scripts/381872/SingSnap%20Chat%20UI%20Maximizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;

    function onResize() {
        $("object").attr('height', $("body").innerHeight() - $("h2.lg").next().next().outerHeight() - 5 + 'px');
    }

    $(document).ready(function() {
        $("html").css('height', '100%');
        $("body").css('height', '100%');
        $(".container").css('margin', '0').css('width', '100%');//.css('height', '100%');
        $("#top-bar").hide();
        $("#header").hide();
        $("#footer").hide();
        $("h1").hide();
        $("p.lg").hide();
        const whosSingingNextHeader = $("h2.lg");
        whosSingingNextHeader.hide();
        whosSingingNextHeader.next().hide();
        const singingList = whosSingingNextHeader.next().next();
        singingList.css('margin', '0').css('height', 'auto');
        onResize();
    });

    $(window).resize(onResize);
})();