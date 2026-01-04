// ==UserScript==
// @name         sakugabooru to gif
// @namespace    https://github.com/VonXXGhost
// @version      0.1
// @description  在sakugabooru页面添加打开相关稿件微博gif的选项
// @author       VonXXGhost
// @match        https://sakuga.yshi.org/*
// @match        https://www.sakugabooru.com/*
// @downloadURL https://update.greasyfork.org/scripts/370931/sakugabooru%20to%20gif.user.js
// @updateURL https://update.greasyfork.org/scripts/370931/sakugabooru%20to%20gif.meta.js
// ==/UserScript==


function addWiboImgButton(code) {
    var options = jQuery('#post-view > div.sidebar > div:nth-child(5) > ul');
    options.append(code);
}

function getImgUrlSuccess(result) {
    try {
        var img_url = result['weibo']['img_url'];
        console.log(img_url);
        var code = '<li><a href="' + img_url + '" target="_blank">打开微博gif/图片</a></li>';
        addWiboImgButton(code);
    }
    catch(e) {
        console.log(e);
        getImgUrlError(null);
    }
}

function getImgUrlError(result) {
    if (result) {
        console.log(result.responseText);
    }
    var code = '<li><a href="#">暂无微博数据</a></li>';
    addWiboImgButton(code);
}

(function getImgUrl() {
    var re = /(?<=post\/show\/)(\d+)/;
    var id = re.exec(window.location.href)[0];
    jQuery.ajax({
        url: 'https://sakugabot.pw/api/posts/' + id,
        type: 'GET',
        dataType: 'json',
        success: getImgUrlSuccess,
        error: getImgUrlError
    });
})();
