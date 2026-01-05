// ==UserScript==
// @name          WaniKani Review Item Delay
// @namespace     https://www.wanikani.com
// @description   skip the current item and move it to the end of the queue
// @version       0.1.0
// @include       https://www.wanikani.com/review/session
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/11634/WaniKani%20Review%20Item%20Delay.user.js
// @updateURL https://update.greasyfork.org/scripts/11634/WaniKani%20Review%20Item%20Delay.meta.js
// ==/UserScript==

/*jslint browser: true*/
/*global $, console */

(function () {
    'use strict';

    function askNewQuestion() {
        $('#user-response').prop('disabled', true);
        $('#answer-form button').click();
    }
    function skipPushEnd() {
        var currentItem = $.jStorage.get('currentItem'),
            activeQueue = $.jStorage.get('activeQueue'),
            reviewQueue = $.jStorage.get('reviewQueue'),
            originalLength = activeQueue.length;
        activeQueue = $.grep(activeQueue, function (item) {
            return !(currentItem.id === item.id && (
                (currentItem.rad && item.rad) || (currentItem.kan && item.kan) || (currentItem.voc && item.voc)
            ));
        });
        if (0 < activeQueue.length && activeQueue.length < originalLength) {
            reviewQueue.unshift(currentItem); // add to beginning (last to be removed)
            activeQueue.push(reviewQueue.pop()); // add next item to replace removed
            $.jStorage.set('reviewQueue', reviewQueue);
            $.jStorage.set('activeQueue', activeQueue); // triggers callback (counters)
        }
        askNewQuestion();
    }
    function init() {
        $('footer').prepend('<button id="wkrid_DelayButton" title="skip current item, move to end">Delay</button>');
        $('footer').prepend('<button id="wkrid_SkipButton" title="ask new random question">Skip</button>');
        $('#wkrid_DelayButton').click(skipPushEnd);
        $('#wkrid_SkipButton').click(askNewQuestion);
    }
    // from: https://gist.githubusercontent.com/arantius/3123124/raw/grant-none-shim.js
    function addStyle(aCss) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (head) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    }
    addStyle('\n' +
        '#wkrid_DelayButton, #wkrid_SkipButton {\n' +
        '    background-color: #0000CC;\n' +
        '    color: #FFFFFF;\n' +
        '    border: medium none;\n' +
        '    border-radius: 3px 3px 0 0;\n' +
        '    display: inline-block;\n' +
        '    font-size: 0.8125em;\n' +
        '    padding: 10px;\n' +
        '    margin-right: 2px;\n' +
        '    font-weight: bold;\n' +
        '}\n');
    setTimeout(init, 100); // init after other scripts like WKO
    console.log('WaniKani Review Item Delay: script load end');
}());
