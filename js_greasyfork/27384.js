// ==UserScript==
// @name                MDN 首选中文
// @description         在 developer.mozilla.org 阅读文档时，自动首选中文版本，避免手动切换。

// @author              Moshel
// @namespace           https://hzy.pw
// @homepageURL         https://hzy.pw/
// @supportURL          https://github.com/h2y/link-fix
// @icon                https://blog.mozilla.com.tw/wp-content/uploads/mdn_logo_only_color.png
// @license             GPL-3.0

// @include             https://developer.mozilla.org/en-US/*
// @grant               none
// @run-at              document-start

// @version             1.0.2
// @modified            05/03/2017
// @downloadURL https://update.greasyfork.org/scripts/27384/MDN%20%E9%A6%96%E9%80%89%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/27384/MDN%20%E9%A6%96%E9%80%89%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==



!function() {


const allowLang = 'zh-CN',
      nowLang   = 'en-US';


//check conditions
if(document.referrer) {
    let splitRet = location.pathname.split(nowLang+'/', 2);
    if(splitRet.length!==2)
        return; // unknown location 
    const nowPath = splitRet[1];

    let regRet = document.referrer.match(/mozilla\.org\/(.+?)\/(.*)$/);
    if(regRet.length==3) {
        let lastLang = regRet[1],
            lastPath = regRet[2];

        if(lastPath==nowPath)
            return; // user choose the English version manually
    }
}


location.pathname = location.pathname.replace(nowLang, allowLang);


}();
