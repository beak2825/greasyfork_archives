// ==UserScript==
// @name         Minimum Grade Finder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Finds the lowest score you can get and still have a 90.
// @author       Ben
// @match        https://lgsuhsd.instructure.com/courses/*/grades
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/391868/Minimum%20Grade%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/391868/Minimum%20Grade%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let button = document.createElement('button');
    button.id = 'startMinGrade';
    $(button).css('position', 'fixed');
    $(button).css('bottom', '10px');
    $(button).css('right', '10px');
    $(button).css('z-index', '9999');
    $(button).text('Find Minimum Grade');
    $(button).click(start);
    $('body').append(button);

    function start() {
        let selectButton;
        button.disabled = true;

        $('#grades_summary .editable .details').each(function(k, v) {
            selectButton = document.createElement('button');
            $(selectButton).text('Select');
            $(selectButton).addClass('minGradeSelect');
            $(selectButton).click(select);
            $(v).empty();
            v.append(selectButton);
        });
    }

    function select() {
        let scoreEle = $($($($(this).parent()).parent()).find('.grade'));
        let max_points = parseInt($($($($(this).parent()).parent()).find('.points_possible')).text());

        for(let i=1;i<max_points;i++) {
            changeScore(scoreEle, max_points - i);

            let final_grade = parseInt($('#submission_final-grade .grade').text().slice(0,2));
            if (final_grade < 90) {
                let minimum = max_points - i + 1;
                changeScore(scoreEle, minimum);
                alert('The minimum is ' + minimum);
                break;
            }
        }
    }

    function changeScore(scoreEle, score) {
        scoreEle.click();
        $('#grade_entry').val(score);
        $('#grade_entry')[0].blur();
    }
})();