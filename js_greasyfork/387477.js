// ==UserScript==
// @name         Hide Review Progress
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Hides review progress while reviewing
// @author       Iaro
// @match        https://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387477/Hide%20Review%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/387477/Hide%20Review%20Progress.meta.js
// ==/UserScript==

var hiding = false;

function addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (head) {
        style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = css;
        head.appendChild(style);
        return style;
    }
    return null;
}

(function() {
    //Does the thing!
    addStyle('#hiding-mode.active {color:#00f; opacity:1.0;}');
    hiding = localStorage.getItem('hiding');
    hiding = (hiding !== 'false');
    $('#summary-button').append('<a id="hiding-mode" href="#"' + (hiding ? ' class="active"' : '') + '><i class="icon-eye-open"></i></a>');
    $('#hiding-mode').click(function() {
        hiding = !hiding;
        console.log('Hiding mode ' + (hiding ? 'en' : 'dis') + 'abled!');
        localStorage.setItem('hiding', hiding);
        $(this).toggleClass('active', hiding);

        if (hiding) {
            $('#progress-bar').css('visibility', 'hidden');
            $('#stats').css('visibility', 'hidden');
        } else {
            $('#progress-bar').css('visibility', 'visible');
            $('#stats').css('visibility', 'visible');
        }
        return false;
    });

    if (hiding) {
        $('#progress-bar').css('visibility', 'hidden');
        $('#stats').css('visibility', 'hidden');
    } else {
        $('#progress-bar').css('visibility', 'visible');
        $('#stats').css('visibility', 'visible');
    }
})();