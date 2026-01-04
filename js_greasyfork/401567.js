// ==UserScript==
// @name         PTA Random Peer Review
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       NCJ
// @match        https://pintia.cn/problem-sets/*/peer-review-task/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/401567/PTA%20Random%20Peer%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/401567/PTA%20Random%20Peer%20Review.meta.js
// ==/UserScript==

function nice_comment() {
    var good_words = ['挺好的', '很不错', '技术上还可以完善一下', '挺棒的', '看好你们', '加油', 'Nice Job'];
    good_words.sort(() => Math.random() - 0.5);
    var cnt = Math.floor(Math.random() * (good_words.length - 1)) + 1;
    return good_words.slice(0, cnt).join(' ') + '!';
}

$(document).bind('DOMSubtreeModified', function() {
    'use strict';
    if ($('#PTA_Random').length == 0 && $('#sparkling-daydream > div.container_3h6sJ > div.main_2of8X > div > div.card-body > form > div.d-flex.justify-content-center.align-items-center.mt-2').length) {
        $('#sparkling-daydream > div.container_3h6sJ > div.main_2of8X > div > div.card-body > form > div.d-flex.justify-content-center.align-items-center.mt-2').
        append(`<button type="button" class="btn btn-primary" id="PTA_Random"> Random</button>`);
        $("#PTA_Random").css("position", "relative").css("left", 10);
        $('#PTA_Random').click(function(){
            var max = parseInt($('.ques-score')[0].textContent.replace(/[^0-9]/ig,""));
            $('input[name="score"]')[0].value = (Math.floor(Math.random() * 25)+ 75) * max / 100;
            $('textarea')[1].value = nice_comment();
        });
    }
});