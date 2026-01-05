// ==UserScript==
// @name        扇贝背单词网页版中文释义自动分行
// @namespace    https://git.oschina.net/zhaoji/
// @version      0.21
// @description 扇贝背单词网页版的中文单词释义目前无法自动分行，本油猴（Greasemonkey）脚本可以解决这一问题。
// @author       Frederick Wang
// @include     http://www.shanbay.com/bdc/review/
// @include     http://www.shanbay.com/review/learning/*
// @include     https://www.shanbay.com/bdc/review/
// @include     https://www.shanbay.com/review/learning/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17007/%E6%89%87%E8%B4%9D%E8%83%8C%E5%8D%95%E8%AF%8D%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%AD%E6%96%87%E9%87%8A%E4%B9%89%E8%87%AA%E5%8A%A8%E5%88%86%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/17007/%E6%89%87%E8%B4%9D%E8%83%8C%E5%8D%95%E8%AF%8D%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%AD%E6%96%87%E9%87%8A%E4%B9%89%E8%87%AA%E5%8A%A8%E5%88%86%E8%A1%8C.meta.js
// ==/UserScript==
var t = setInterval((function () {
    if ((Boolean($('#definition-cn-hint > div').length)) && ($('#definition-cn-hint > div').attr('revised') === undefined)) {
        var definition = $('#definition-cn-hint > div > div').html();
        var tempDefinitionArr = definition.split('\n');
        if (tempDefinitionArr.length > 1) {
            $('#definition-cn-hint > div > div').remove();
            for (var i = 0; i < tempDefinitionArr.length; i++) {
                $('#definition-cn-hint > div').append('<div class=\'hint-content\'>' + tempDefinitionArr[i] + '</div>');
            }
            $('#definition-cn-hint > div').attr('revised', true);
        }
    } else if ((Boolean($('.cndf').length)) && ($('.cndf').attr('revised') === undefined)) {
        var definition2 = $('.text').html();
        var tempDefinitionArr2 = definition2.split('\n');
        if (tempDefinitionArr2.length > 1) {
            $('.text').remove();
            for (var j = 0; j < tempDefinitionArr2.length; j++) {
                $('.cndf').append('<p class=\'text\'>' + tempDefinitionArr2[j] + '</p>');
            }
            $('.cndf').attr('revised', true);
        }
    }
}), 10);