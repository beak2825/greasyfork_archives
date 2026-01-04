// ==UserScript==
// @name         touhou introquiz cheat
// @namespace    code
// @version      0.1
// @description  touhou introquiz cheating script
// @author       Code
// @include      https://nerewid.github.io/introquiz.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420511/touhou%20introquiz%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/420511/touhou%20introquiz%20cheat.meta.js
// ==/UserScript==

let prev_id;

function showList(game, id) {
    const $game = $(`#${game}`).parent();

    $game.siblings().find("ul").hide();
    $game.children().slideDown(150);

    const $a = $(`#${id}`).find('a');
    if(prev_id) {
        prev_id.css('background-color', '');
        prev_id = undefined;
    }

    prev_id = $a;
    $a.css('background-color', '#008888');
}

function reset() {
    $('.game').find('ul').hide();
    if(prev_id) {
        prev_id.css('background-color', '');
        prev_id = undefined;
    }
}

(function() {
    'use strict';
    const $startButton = $('#button');
    const $resetButton = $('.quiz_restart');

    const $ddmenu = $('.ddmenu');

    let d;
    let prev_cnt = -1;

    function daemon(){
        if(d) {
            clearInterval(d);
            prev_cnt = -1;
            d = undefined;
            reset();
        }

        d = setInterval(function(){
            if(prev_cnt != quiz_cnt) {
                prev_cnt = quiz_cnt;
                const game = aryQuiz[quiz_cnt]["game"];
                const ans = aryQuiz[quiz_cnt]["answer"];

                $('.quiz_question').append(`<div>${game} - ${aryQuiz[quiz_cnt]["answer_display"]}</div>`);

                showList(game, ans);
            }

            if(quiz_cnt >= quiz_fin_cnt) {
                setTimeout(function() {
                    if(quiz_cnt >= quiz_fin_cnt) {
                        clearInterval(d);
                        d = undefined;
                        prev_cnt = -1;
                        reset();
                    }
                }, 1500);
            }
        }, 1000);
    }

    $startButton.on('click', function(){
        daemon();
    });

    $resetButton.on('click', function(){
        daemon();
    });


    // Your code here...
})();