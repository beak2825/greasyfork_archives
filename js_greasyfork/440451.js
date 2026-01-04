// ==UserScript==
// @name  必应搜索去广告（bing search no ADs)
// @author B站搜：松叶萧落
// @description 必应搜索去广告，改编自作者：大萌主。脚本：搜索引擎去广告
// @version 1
// @match *://cn.bing.com/*
// @match *://www.bing.com/*
// @run-at document-start
// @namespace http://tampermonkey.net/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440451/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%88bing%20search%20no%20ADs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440451/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%88bing%20search%20no%20ADs%29.meta.js
// ==/UserScript==

(function(){
function remove(sel) {
  document.querySelectorAll(sel).forEach( a => a.remove())
                        }
var g_times = 0;
function myfun() {
function removeads() {
remove(".ec_wise_ad");
remove(".se-recommend-word-list-container");
remove("#se-recommend-word-list-container");
remove('[class*="ball-wrapper"]');
remove('[style="position: fixed; bottom: 0px; left: 0px; z-index: 300; width: 100%; height: 52px; background: rgb(255, 255, 255); opacity: 1; border-top: 1px solid rgb(224, 224, 224); display: flex;"]');
remove('[ad_dot_url*="http"]');
remove(".dl-banner-without-logo");
remove(".ad_result");
remove(".ad_sc");
remove('[data-text-ad="1"]');
remove('#content_left > *:not([id]) *');
remove('[class="result c-container new-pmd"][id="1"][tpl="se_com_default"][data-click="{"]');
remove(".biz_sponsor");
remove(".b_algospacing");
remove('div.b_caption > p[class]');
remove('[onmousedown*="ad"][h*="Ads"]');
remove("LI.b_ad.b_adTop");
}
removeads();

//必应搜索优化，原作者去除的不够完全，自己又加了一点

    var a=document.querySelectorAll('.b_caption')
    var i = 0
    while (i<10){
               if (a[i].textContent.length <20)
               {
                   a[i].parentNode.remove()
                   console.log("已移除")
               }
               i++
             }

window.setTimeout(removeads);
 if(g_times >= 10000) {
   window.clearInterval(timer);
 }
 g_times ++;
}
var timer = setInterval(myfun,1);
myfun();
})();