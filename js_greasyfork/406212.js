// ==UserScript==
// @name         天津TJU自动评教
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  for auto commenting
// @author       Zrzz
// @match        *classes.tju.edu.cn/eams/quality/stdEvaluate!answer.action*
// @grant        none
// @lisense      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/406212/%E5%A4%A9%E6%B4%A5TJU%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/406212/%E5%A4%A9%E6%B4%A5TJU%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

var setting = {
    isauto: true,
    // 开始时的自动秒数 5E3为5000ms
    autopj: 5E3
}

function pj(b) {
    if (!(b || setting.isauto)) {
        return;
    }
    const level = b ? $('#level').val() : 4;
    const content = b ? $('input#ansContent').val() : '好';
    $("input.option-radio[value=" + level + "]").attr("checked", "true");
    $("textarea.answer").text(content);
    $("input#sub").click();
}

function show_board() {
    $(
        '<div style="border: 1px double rgb(71, 71, 71); width: 420px; position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(216, 255, 184, 0.486); overflow-x: auto; padding: 10px;">' +
 '   <div style="font-size: medium;">TJU一键评教 By Zrzz</div>' +
 '   <div>' +
 '       <input type="checkbox" id="isManual"></input>' +
 '       <span style="margin-right: 10px;">不使用默认参数</span>' +
 '   </div>' +
 '   <div style="margin-bottom: 20px;" id="manual-setting">' +
 '       <span>满意度: </span>' +
 '       <input type="number" id="level" placeholder="0~5" min="0" max="5" style="width: 50px"/>' +
 '       <span>建议: </span>' +
 '       <input type="text" id="ansContent"/>' +
 '   </div>' +
 '   <div style="text-align: center;">' +
 '       <button style="margin: 0 auto; ">一键评教</button>' +
 '   </div>' +
 '</div>'
    )
        .appendTo("body")
        .on('change', '#isManual', function() {
        if($('#isManual').is(':checked')) {
            setting.isauto = false;
            $('#manual-setting').show();
           } else {
            setting.isauto = true;
            $('#manual-setting').hide();
           }
    })
        .on('click', 'button', function() {
        if (!setting.isauto) {
            pj(true)
        } else {
            pj();
        }
    })
        .find("table, td, th")
        .css("border", "1px solid")
        .end();
    // 隐藏
    $('#manual-setting').hide()
}


(function() {
    'use strict';
    show_board();
    setTimeout(pj, setting.autopj);
})();