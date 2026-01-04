// ==UserScript==
// @name         ieltsonlinetests 打印助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使ieltsonlinetests的考试页面适合打印
// @author       You
// @match        https://ieltsonlinetests.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419586/ieltsonlinetests%20%E6%89%93%E5%8D%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/419586/ieltsonlinetests%20%E6%89%93%E5%8D%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    var $ = window.$;

    let printButton = `
        <button id="print-btn" style="position: fixed;bottom: 1rem; left: 1rem; z-index: 9999;">
            Print
        </button>`;

    $('body').append(printButton);

    $('#print-btn').click(() => {

        let prevHtml = $('body')[0].outerHTML,
            testPaper = $(`.testing.listening-page>.lp-left>.split-left.cyan`)[0];

        ['.player.player-fixed', '.question-board', '.end-the-test', '.player-loading', '.box-ad728'].forEach(el => {
            $(testPaper).find(el).remove();
        });

        $('.listening-test-page').css({'padding-top': '0px'});

        $('body').empty().append(testPaper);

        window.print();

        $('body').empty().append(prevHtml);
    });
})();