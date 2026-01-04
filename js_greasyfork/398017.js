// ==UserScript==
// @name         ZJU Tronclass Helper
// @namespace    ncj.wiki
// @version      2.3.5
// @license      MIT
// @description  Download Tronclass Courseware
// @author       NCJ
// @match        *://courses.zju.edu.cn/course/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/398017/ZJU%20Tronclass%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/398017/ZJU%20Tronclass%20Helper.meta.js
// ==/UserScript==

function nice_comment() {
    var good_words = ['挺好的', '很不错', '技术上还可以完善一下', '挺棒的', '看好你们', '视频还有改进的空间', '点子很赞', '加油'];
    good_words.sort(() => Math.random() - 0.5);
    var cnt = Math.floor(Math.random() * (good_words.length - 1)) + 1;
    return good_words.slice(0, cnt).join(' ') + '!';
}

$(document).bind('DOMSubtreeModified', function() {
    if ($('#Tronclass_Downloader').length == 0 && $('#file-previewer-with-note > div > div > div.header.clearfix').length) {
        $('#file-previewer-with-note > div > div > div.header.clearfix').append('<input type="button" value="Download" id="Tronclass_Downloader">');
        $("#Tronclass_Downloader").css("position", "relative").css("left", 10);
        $('#Tronclass_Downloader').click(function(){
            window.open(decodeURIComponent(document.getElementById('pdf-viewer').src.split("?file=")[1]));
        });
    }

    if ($('#Tronclass_Downloader_video').length == 0 && $('video').length && $('video')[0].children.length == 3 && $('video')[0].children[0].getAttribute('src').indexOf('/api') == 0) {
        var v=$('video')[0];
        for (var i of v.children) {
            $(v.parentNode.parentNode).prepend(`<a href="${i.getAttribute('src')}" id="Tronclass_Downloader_video">\t${i.getAttribute('label')}\t</a>`);
        }
    }

    if ($('#Tronclass_Random_Nice_Comment').length == 0 && $('.comment').length) {
        $('#give-score > div > div.main-area > div.main-content > div.right-section > form > div.form-title.ng-scope').append('<input type="button" value="随机生成" id="Tronclass_Random_Nice_Comment">');
        $('#Tronclass_Random_Nice_Comment').click(function() {
            $('textarea').val(nice_comment());
            angular.element($('textarea')[1]).triggerHandler('input');
            $('input[name="score"]').val(Math.floor(Math.random() * (100 - 85))+ 85);
            angular.element($('input[name="score"]')).triggerHandler('change');
        });
    }
});