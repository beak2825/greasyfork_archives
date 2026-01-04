// ==UserScript==
// @name            免费下载文档【应届毕业生网|文小蜜】
// @namespace       http://tampermonkey.net/
// @version         2.0
// @description     免费下载文档，取消微信关注公众号和付费下载的限制。
// @author          Conastin
// @match           *://*.yjbys.com/*
// @match           *://*.wenxm.cn/*
// @icon            https://cdn.icon-icons.com/icons2/1222/PNG/512/1492616984-7-docs-document-file-data-google-suits_83406.png
// @grant           unsafeWindow
// @require         https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @require         https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/445570/%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%E6%96%87%E6%A1%A3%E3%80%90%E5%BA%94%E5%B1%8A%E6%AF%95%E4%B8%9A%E7%94%9F%E7%BD%91%7C%E6%96%87%E5%B0%8F%E8%9C%9C%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/445570/%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%E6%96%87%E6%A1%A3%E3%80%90%E5%BA%94%E5%B1%8A%E6%AF%95%E4%B8%9A%E7%94%9F%E7%BD%91%7C%E6%96%87%E5%B0%8F%E8%9C%9C%E3%80%91.meta.js
// ==/UserScript==
var $ = unsafeWindow.jQuery;

(function () {
    'use strict';
    if (location.host == 'www.yjbys.com') {
        // 应届毕业生网
        var pageSize = 1;
        var pathname = location.href.replaceAll(location.host, '').replaceAll('https://', '');
        $(document).on('click', '.download_card_box', function () {
            location.href = "//" + location.host + "/pic/dldoc/page" + pageSize + pathname;
        });
    } else if (location.host == 'www.wenxm.cn') {
        // 文小蜜
        $('body').on('click', '.gf_xiazai', function () {
            wenxmDownload();
        });
    }
})();

// 文小蜜下载
function wenxmDownload() {
    var arcurl = location.href;
    //判断域名
    var domain = '';
    if (document.domain.indexOf(".com.cn") > -1) {
        domain = document.domain.split('.').slice(-3).join('.');
    }
    else {
        domain = document.domain.split('.').slice(-2).join('.');
    }
    if (arcurl.indexOf(document.domain) == -1) {
        if (arcurl.indexOf('https') > -1 || arcurl.indexOf('5068.com') > -1 || arcurl.indexOf('kuk8.com') > -1) {
            arcurl = arcurl.replace(/https:/g, '');
            arcurl = 'https://' + document.domain + arcurl;
        }
        else {
            arcurl = arcurl.replace(/http:/g, '');
            arcurl = 'http://' + document.domain + arcurl;
        }
    }
    $.ajax({
        url: '//lhpay.gzcl999.com/index.php/index/urldoc/doc',
        data: {
            "appid": 'gzcl2020042616833350688',
            "secret": "Wx20200603ZXFF5068xuedutuikjlpd",
            "domain": domain,
            "url": arcurl,
            "type": 2,
        },
        type: "POST",
        async: true,
        success: function (data) {
            console.log(data);
            if (data.code == 200) {
                location.href = data.path;
            }
        }
    });
}
