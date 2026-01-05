// ==UserScript==
// @name         Y3 Helper
// @namespace    http://choq.co/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://yanyeeyao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24938/Y3%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/24938/Y3%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let getRandomIntInclusive = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var currentChoice;

    setTimeout(function() {
        //$('#profile img').click(removeTarget);
        $('html').on('keypress', function(e) {
            if (e.keyCode == 113) {
                var newChoice = 0;
                if (typeof(currentChoice) !== 'undefined') {
                    do {
                        newChoice = getRandomIntInclusive(0,2);
                    } while (currentChoice == newChoice);
                }
                else {
                    newChoice = getRandomIntInclusive(0,2);
                }

                currentChoice = newChoice;
                $('#feeds-create-normal-game-input-choice .label-choice').removeClass('active');
                $('#feeds-create-normal-game-input-choice .label-choice').eq(currentChoice).addClass('active').click();
            }
        });
    }, 3000);
})();