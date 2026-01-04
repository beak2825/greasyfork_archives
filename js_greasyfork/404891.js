// ==UserScript==
// @name         Hyper FaceIt
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://*.faceit.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/khaimovmr/wshook@0.1.2/wsHook.js
// @downloadURL https://update.greasyfork.org/scripts/404891/Hyper%20FaceIt.user.js
// @updateURL https://update.greasyfork.org/scripts/404891/Hyper%20FaceIt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.wsHook.after = function(messageEvent, url, wsObject) {
        if (typeof(messageEvent.data) != 'string') {
            return messageEvent;
        }

        var bodyStart = messageEvent.data.search('<body>');
        var bodyEnd = messageEvent.data.search('</body>');

        if (bodyStart > -1 && bodyEnd > -1) {
            let message = messageEvent.data.slice(bodyStart + 6, bodyEnd);
            console.log(message);
        }

        return messageEvent;
    }

    $(document).ready(function() {
        let styleElement = document.createElement('style');
        styleElement.innerHTML = '.sc-jjOAeO.hbbTPq:hover {cursor: pointer;}';
        styleElement.type = 'text/css';
        document.head.insertBefore(styleElement, document.head.firstChild);
        //$('head').append('<style>.sc-jjOAeO.hbbTPq:hover {cursor: pointer;}</style>');
        $(document).on('click', '.sc-jjOAeO.hbbTPq', function(){
            var parent = $(this).parent();
            parent.parent().find('input[type=radio]').prop('checked', false);
            parent.find('input[type=radio]').parent().click();
        });
    });
})();
