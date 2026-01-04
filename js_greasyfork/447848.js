// ==UserScript==
// @name         跳转海外知网融合版！
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将知网空间、国内知网详情页、手机知网全部跳到海外，方便下载pdf和在线看。感谢“知网空间跳转知网页面”与“中国知网（CNKI）硕博论文跳转至‘海外版’下载 pdf 文件”提供的转换方法。注：前两者会在页面的超链接被点击时修改，体验更佳；手机知网由于url中拿不到dbcode，只能在加载完成后跳转。
// @author       dabble
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @match        http://*/*
// @match        https://*/*
// @run-at       document-idle
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447848/%E8%B7%B3%E8%BD%AC%E6%B5%B7%E5%A4%96%E7%9F%A5%E7%BD%91%E8%9E%8D%E5%90%88%E7%89%88%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/447848/%E8%B7%B3%E8%BD%AC%E6%B5%B7%E5%A4%96%E7%9F%A5%E7%BD%91%E8%9E%8D%E5%90%88%E7%89%88%EF%BC%81.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let changeLink = function (e) {
        let target = e.target;
        while (target.tagName.toLowerCase() != "a") {
            if (target.tagName.toLowerCase() == "body") {
                return;
            }
            target = target.parentNode;
        }
        if (target.href) {
            if (target.href.match(/cnki\.com\.cn\/Article\/.*\.htm/)) {
                var new_base_url = 'https://chn.oversea.cnki.net/KCMS/detail/detail.aspx?dbcode='
                let filename = target.href.split('-').slice(-1)[0].split('.ht')[0];
                let dbcode = target.href.split('-')[0].split('/').slice(-1)[0].slice(0, 4);
                if (dbcode == 'CDMD' || dbcode == 'cdmd') {
                    target.href = new_base_url + 'CDMD&filename=' + filename + '.nh';
                } else {
                    target.href = new_base_url + dbcode + '&filename=' + filename;
                }
            }else if(target.href.match(/^https?:\/\/kns\.cnki\.net\/.*\/[Dd]etail.*/)) {
                target.href=target.href.replace(/^https?:\/\/kns\.cnki\.net\/(.*)$/, "https://chn.oversea.cnki.net/$1");
            }else{
                return;
            }
        }
    };
    if(window.location.href.match(/^https?:\/\/wap\.cnki\.net\/touch\/web\/.*\/Article.*/)){
        console.log("手机版知网，引文信息为"+yinwenData)
        window.location.href = "https://chn.oversea.cnki.net/KCMS/detail/detail.aspx?dbcode=" + yinwenData.type + "&filename=" + yinwenData.filename;
    }
    document.body.addEventListener("mousedown", changeLink);
    document.body.addEventListener("click", changeLink);
})();