// ==UserScript==
// @name         粉笔网站刷题布局优化
// @namespace    https://www.fenbi.com/
// @version      0.1
// @description  粉笔网站布局优化
// @author       Zhou
// @match        *://www.fenbi.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/462763/%E7%B2%89%E7%AC%94%E7%BD%91%E7%AB%99%E5%88%B7%E9%A2%98%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/462763/%E7%B2%89%E7%AC%94%E7%BD%91%E7%AB%99%E5%88%B7%E9%A2%98%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
// practice-header：试卷名横幅
// div.fb-collpase-header.bg-color-gray-mid.border-gray-mid:first-child：答题卡收缩按钮
// fb-collpase-bottom：答题卡
// exam-content：试卷
// ul：横幅上的推广
// fenbi-web-footer：网站信息

(function() {
    let css=`
    #app-practice > .practice-header{
    visibility: hidden !important;
    }
    #app-report-solution >.practice-header{
    visibility: hidden !important;
    }
    #app-practice > div.fb-collpase-header.bg-color-gray-mid.border-gray-mid:first-child{
    visibility: hidden !important;
    }
    #app-report-solution > div.fb-collpase-header.bg-color-gray-mid.border-gray-mid:first-child{
    visibility: hidden !important;
    }
    #app-practice .fb-collpase-bottom{
    left: 0 !important;
    top: 0px !important;
    max-width: 300px;
    }
    #app-report-solution .fb-collpase-bottom{
    left: 0 !important;
    top: 0px !important;
    max-width: 300px;
    }
    #app-practice .fb-collpase-bottom .fb-collpase-content {
    max-height: 720px;
    }
    #app-report-solution .fb-collpase-bottom .fb-collpase-content {
    max-height: 720px;
    }
    #app-practice .exam-content{
    top: -80px !important;
    left: 110px;
    /* margin: 20px auto 0; */
    }
    #app-report-solution .exam-content{
    top: -80px !important;
    left: 110px;
    /* margin: 20px auto 0; */
    }
    #fb-web-nav-header > div.nav-header-content > nav.fb-web-nav:nth-child(2) > ul > li:last-child{
    visibility: hidden !important;
    }
    #fb-web-nav-header > div.nav-header-content > nav.fb-web-nav:nth-child(2) > ul > div.content-filters:nth-child(6){
    visibility: hidden !important;
    }
    #fenbi-web-footer{
    visibility: hidden !important;
    }
    `
     GM_addStyle(css)
})();