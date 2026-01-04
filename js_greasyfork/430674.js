// ==UserScript==
// @name         粉笔美化
// @namespace    https://www.fenbi.com
// @version      1.0.1
// @description  粉笔界面优化
// @author       xx
// @connect    www.fenbi.com
// @include    *://www.fenbi.com/*
// @grant        GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/430674/%E7%B2%89%E7%AC%94%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/430674/%E7%B2%89%E7%AC%94%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

!(function() {
    let isdebug = true;
    let debug = isdebug ? console.log.bind(console) : function () {};
    debug('程序开始');
    let css=`
    #app-report-solution .exam-content {
        width: 800px;
        margin: 20px 0px 10px 330px !important;
    }

    #app-report-solution .fb-collpase-bottom {
    left: 0 !important;
    top: 50px !important;
    bottom: 10px !important;
    }

    #app-report-solution .fb-collpase-bottom {
        width: 320px !important;
    }
    `
    GM_addStyle(css)
})();