// ==UserScript==
// @name         Saws Auto Answer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  全国安全监管干部网络学院自动答题!
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.js
// @match        http://aj.saws.org.cn/back/train/page/classzone/myclass.shtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375068/Saws%20Auto%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/375068/Saws%20Auto%20Answer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let $injectionPoint = $('#idBoxPost')
    let $crackButton = $('<input type="button" value="解题" id="idBoxCrack">')
    $injectionPoint.parent().append($crackButton)

    $crackButton.on('click', function () {
        let $iframe = $('#tqFrame').contents()
        let $questions = $iframe.find('[baid]')
        $questions.each(function (index, question) {
            let $question = $(question)
            let answer = $iframe.find(`#${$question.attr('baid')}`).html()

            for (let a of answer) {
               $question.find(`input[value=${a}]`).parent().parent().find('label').click()
            }
        })
    })
})();