// ==UserScript==
// @name         cookie clicker
// @namespace    https://github.com/Khdoop
// @version      0.6
// @description  delicious cookies
// @author       Khdoop
// @match        http://orteil.dashnet.org/cookieclicker/
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/16899/cookie%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/16899/cookie%20clicker.meta.js
// ==/UserScript==

$(function() {
    var html = '<div id="auto-clicker">clicker</div>';
    $('#links').before(html);

    var button = $('#auto-clicker');
    var interval;
    var flag = false;

    button
        .css({
            cursor: 'pointer',
            width: '50px',
            border: 'none',
            'text-align': 'center',
            'background-color': 'rgba(255, 0, 0, 0.2)'
        });

    button.on('click', function() {
        if (flag) {
            flag = false;
            $(this).css('background-color', 'rgba(255, 0, 0, 0.2)');
            window.clearInterval(interval);
        } else {
            flag = true;
            $(this).css('background-color', 'rgba(0, 255, 0, 0.2)');
            interval = setInterval(function() {
                $('#bigCookie').trigger('click');
                $('#goldenCookie').trigger('click');
                $('#seasonPopup').trigger('click');
            }, 1);
        }
    });
});