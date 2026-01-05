// ==UserScript==
// @name          WaniKani Shake Flash Yellow
// @namespace     https://www.wanikani.com
// @description   override shake effect to instead flash yellow
// @version       0.1.3
// @include       https://www.wanikani.com/review/session
// @include       https://www.wanikani.com/lesson/session
// @include       http://www.wanikani.com/review/session
// @include       http://www.wanikani.com/lesson/session
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/4370/WaniKani%20Shake%20Flash%20Yellow.user.js
// @updateURL https://update.greasyfork.org/scripts/4370/WaniKani%20Shake%20Flash%20Yellow.meta.js
// ==/UserScript==

/*global $, console*/

(function () {
    'use strict';

    // fix missing symbol error
    $.curCSS = $.css;

    // override jQuery shake function
    $.effects.shake = function (o) {
        // no matter what object is called upon, actually flash '#answer-form input'
        // record the original 'this' for callback use.
        var elem = $('#answer-form input'),
            thisCalled = this;

        // make the button background transparent so it flashes too
        $('#answer-form button').css('background-color', 'rgba(0,0,0,0)');

        return elem.queue(function () {
            var props = ['backgroundImage', 'backgroundColor', 'opacity'],
                animation = {
                    backgroundColor: elem.css('backgroundColor')
                };
            $.effects.save(elem, props);
            elem
                .show()
                .css({
                    backgroundImage: 'none',
                    backgroundColor: '#ffff00'
                })
                .animate(animation, {
                    queue: false,
                    duration: 1000,
                    easing: 'easeInExpo',
                    complete: function () {
                        $.effects.restore(elem, props);
                        if (o.callback) {
                            o.callback.apply(thisCalled, arguments);
                        }
                        elem.dequeue();
                    }
                });
        });
    };
    console.log('WaniKani Shake Flash Yellow: script load end');
}());
