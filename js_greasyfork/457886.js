// ==UserScript==
// @name         搜索引擎去广告
// @namespace    joyber
// @version      0.5
// @description  搜索引擎去除广告信息，干净无其它任何功能
// @author       joyber
// @match        https://*.bing.com/*
// @match        https://*.baidu.com/s*
// @match        https://*.google.com/search*
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457886/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/457886/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // bing.com
    let cssText = '.b_ad{display:none;}#taw{display:none}';
    let styleDom = document.createElement('style'), head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
    styleDom.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css
    let textNode = document.createTextNode(cssText);
    styleDom.appendChild(textNode);
    head.appendChild(styleDom); //把创建的style元素插入到head中

    //baidu.com
    if (location.host.indexOf('baidu.com') > -1) {
        let adremove = function(){$('._2z1q32z').remove();$(".result.c-container.new-pmd:contains('广告')").remove();}
        $(function(){
            setInterval(adremove, 100)
            adremove()
        })
    }

    //google.com
    if (location.host.indexOf('google') > -1) {
        let dom = document.getElementById("taw")
        if (dom) dom.remove()
    }
})();