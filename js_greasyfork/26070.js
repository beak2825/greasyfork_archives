// ==UserScript==
// @name         MAM IRC-Style shoutbox
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  reverses shoutbox
// @author       xShirase
// @match        https://www.myanonamouse.net/shoutbox/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26070/MAM%20IRC-Style%20shoutbox.user.js
// @updateURL https://update.greasyfork.org/scripts/26070/MAM%20IRC-Style%20shoutbox.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    var objDiv = document.getElementById("sbf");
    // remove extra box around shoutbox
        var bdy = $('#mainBody').detach();
        $('.blockCon').remove();
        $('.mainRight').append(bdy);
    // add toggle switch
        $('#mainBody .blockHeadCon').append('<span id="hideshowLeftPanel">[+]</span>');
    // move message box to bottom
        var f = $('#shoutbox form').detach();
        $('#shoutbox').append(f);
    // reverse messages order
        var ul = $('#sbf');
        ul.children().each(function(i,li){ul.prepend(li);});
    // handler for new message (append to bottom)
        function handler(e) {
            var target = e.target;
            $('#sbf').off('DOMNodeInserted', 'div', handler);
            $('#sbf').append(target);
            $('#sbf').on('DOMNodeInserted', 'div', handler);
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    // handler for toggle switch
        function hideShowHandler(e){
            $('#mainLeft').toggle();
        }
    // add event listeners
    $('#sbf').on('DOMNodeInserted', 'div', handler);
    $('body').on('click','#hideshowLeftPanel',hideShowHandler);
    // scroll to bottom on load
    setTimeout(function(){
        objDiv.scrollTop = objDiv.scrollHeight;
    },1000);
})();