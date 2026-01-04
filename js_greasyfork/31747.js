// ==UserScript==
// @name         Self Q.O.L
// @namespace    wk_selfQOL
// @version      1.0.2
// @description  Alters WK Lessons for a self-review focused experience
// @author       ccookf
// @match        https://www.wanikani.com/lesson/session
// @license      MIT; http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/31747/Self%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/31747/Self%20QOL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var header = $('#main-info');
    var headerText = header.children('#meaning').first();
    var MAX_CHARS = 20;

    //Remove the prompt for starting the quiz after "finishing" lessons
    $('#screen-quiz-ready').remove();

    //Set up event listeners to update the headers
    $('#prev-btn').click(updateHeader);
    $('#next-btn').click(updateHeader);
    $('#supplement-nav').click(updateHeader);
    $.jStorage.listenKeyChange('l/currentLesson', updateHeader);
    $('body').keyup(function(event) {
        //I don't know where the original handler is working, so this prevents order issues
        //Should only be a single frame delay on most devices
        if (event.key == 'Enter') setTimeout(updateHeader, 10);
    });

    function updateHeader() {
        if ($('#lesson').css("display") === "none") return;
        var currentItem = $.jStorage.get('l/currentLesson');
        var active = $('#supplement-nav').find('.active').attr('data-index');
        var type = $('#main-info').attr('class');
        var out = '';
        switch (active) {
            case '0':
                headerText.text('。。。');
                break;
            case '1':
                currentItem.en.forEach(function(item) {
                    if (out.length + item.length + 2 <= MAX_CHARS) out += (out.length === 0 ? '': ', ') + item;
                });
                headerText.text(out);
                break;
            case '2':
                var data;
                if (type == "kanji") {
                    if (currentItem.emph == "onyomi") data = currentItem.on;
                    else data = currentItem.kun;
                } else data = currentItem.kana;
                data.forEach(function(item) {
                    if (out.length + item.length + 2 <= MAX_CHARS) out += (out.length === 0 ? '': ', ') + item;
                });
                headerText.text(out);
                break;
            default:
                console.warn('Unexpected case in Self Q.O.L script: active item = ' + active);
        }
    }
})();