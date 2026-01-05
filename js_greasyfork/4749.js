// ==UserScript==
// @name          WaniKani Review Wrong Info Click
// @namespace     https://www.wanikani.com
// @description   Automatically click the info button upon wrong review answer.
// @version       0.1.0
// @include       https://www.wanikani.com/review/session
// @include       http://www.wanikani.com/review/session
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/4749/WaniKani%20Review%20Wrong%20Info%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/4749/WaniKani%20Review%20Wrong%20Info%20Click.meta.js
// ==/UserScript==

/*global $, console*/

/*
hook wrongCount jStorage
upon field update with increased value
automatically click the show info button
after a slight delay (to avoid a display glitch)
*/

(function () {
    'use strict';

    var lastWrongCount = 0;
    $.jStorage.listenKeyChange('wrongCount', function (key, action) {
        var wrongCount;
        if (action === 'updated') {
            wrongCount = $.jStorage.get('wrongCount');
            if (wrongCount > lastWrongCount) {
                setTimeout(function () {
                    $('#option-item-info').click();
                }, 100);
            }
            lastWrongCount = wrongCount;
        }
    });
    console.log('WaniKani Review Wrong Info Click: script load end');
}());
