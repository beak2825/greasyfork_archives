// ==UserScript==
// @name             强制萌娘百科桌面版
// @namespace        https://github.com/qwq233/force-moegirl-desktop-view
// @description      强制萌娘百科桌面版 Google搜出来的全是手机版页面 萌娘那边也不会自动给跳转orz
// @version          1.0.3
// @match            *zh.moegirl.org/*
// @match            *mzh.moegirl.org/*
// @match            *zh.moegirl.org.cn/*
// @match            *mzh.moegirl.org.cn/*
// @author           qwq233 <qwq233@qwq2333.top>
// @license          AGPL
// @supportURL       https://github.com/qwq233/force-moegirl-desktop-view/issues
// @contributionURL  https://afdian.net/@gao_cai_sheng
// @downloadURL https://update.greasyfork.org/scripts/429027/%E5%BC%BA%E5%88%B6%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E6%A1%8C%E9%9D%A2%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/429027/%E5%BC%BA%E5%88%B6%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E6%A1%8C%E9%9D%A2%E7%89%88.meta.js
// ==/UserScript==

(function () {
    function replace_url(url){
        if (url.match('mzh.moegirl.org')){
            url = url.replace('mzh.moegirl.org','zh.moegirl.org');
        }
        console.log(url)
        return url;
    }
    var url = window.location.host;
    var newUrl = replace_url(url);
    if (url != newUrl) {
        window.location.host = newUrl;
    }
})();
