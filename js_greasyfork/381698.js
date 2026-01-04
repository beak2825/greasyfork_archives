// ==UserScript==
// @name         mini clock 2025figuccio
// @namespace    https://greasyfork.org/users/237458
// @description  clock 2025 dragabile
// @version      2.3
// @match        *://*/*
// @noframes
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/381698/mini%20clock%202025figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/381698/mini%20clock%202025figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = window.jQuery;

    function savePosition(left, top) {
        GM_setValue('clockPosition', JSON.stringify({ left, top }));
    }

    function loadPosition() {
        let position = GM_getValue('clockPosition');
        return position ? JSON.parse(position) : { left: '900px', top: '0px' };
    }

    var clock = $('<div>', {
        css: {
            position: 'fixed',
            fontSize: '16px',
            background: '#181818',
            cursor: 'pointer',
            padding: '4px',
            color: 'red',
            border: '2px solid green',
            borderRadius: '5px',
            zIndex: '999999',
            textAlign: 'center'
        }
    }).text('00:00:00:000').appendTo(document.body);

    function updateClock() {
        var now = new Date();
        clock.text(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}:${now.getMilliseconds().toString().padStart(3, '0')}`);
    }

    setInterval(updateClock, 90);

    clock.hover(function() {
        let currentDate = new Date();
        clock.attr('title', currentDate.toLocaleDateString('it', { day: '2-digit', month: 'long', weekday: 'long', year: 'numeric' }));
    });

    $(document).ready(function() {
        clock.draggable({
            containment: 'window',
            stop: function(event, ui) {
                savePosition(ui.position.left, ui.position.top);
            }
        });

        let savedPosition = loadPosition();
        clock.css({ left: savedPosition.left, top: savedPosition.top });

        window.addEventListener('beforeunload', function() {
            let currentPosition = clock.position();
            savePosition(currentPosition.left, currentPosition.top);
        });
    });

    GM_registerMenuCommand('Mostra/Nascondi Orologio', function() {
        clock.toggle();
    });

})();
