// ==UserScript==
// @name         2022京东淘宝自动领红包
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  自动领取618红包
// @author       You
// @match        https://prodev.jd.com/mall/active/3RiABUPHkTTz7sGcEFowgMMytyc1/index.html?*
// @match        https://prodev.m.jd.com/mall/active/31e6keDr2FdaUEVSvNZM2kjD7QVx/index.html?*
// @match        https://pages.tmall.com/wow/z/lianmeng/default/route-lianmeng-index?*
// @license      MIT License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445742/2022%E4%BA%AC%E4%B8%9C%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E9%A2%86%E7%BA%A2%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/445742/2022%E4%BA%AC%E4%B8%9C%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E9%A2%86%E7%BA%A2%E5%8C%85.meta.js
// ==/UserScript==

window.onload = function() {
    setTimeout(function() {
        try {
            if(location.href.substr(8,6) == 'prodev') window.open('https://s.click.taobao.com/VOVhAXu');
            if(location.href.substr(15,1) != 'm') location.href = "https://u.jd.com/ldgSxVn";       
            document.getElementsByClassName("index-module__union-coupon-button___1grbK union-main-receive-btn index-module__animate-pulse___YnSfN")[0].click();
        } catch(err){
            document.getElementsByClassName("mm_wf_scale J_click_proxy")[0].click();
            setTimeout(function() {window.close()}, 1000);
        }
    }, 1000)
}