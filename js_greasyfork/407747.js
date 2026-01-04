// ==UserScript==
// @name         删除百度搜索上的广告
// @namespace    fxxxysh
// @version      1.1.4
// @description  删除百度搜索上的所有广告
// @author       fxxxysh
// @include       *://www.baidu.com/*?*=*
// @copyright    copyright©2020 fxxxysh writer:me17701286529@aliyun.com
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/407747/%E5%88%A0%E9%99%A4%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E4%B8%8A%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/407747/%E5%88%A0%E9%99%A4%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E4%B8%8A%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


function delete_ad()
{
    var ad=document.getElementsByTagName("span");
    var len=ad.length;
    while(len !== 0)
    {
        len--;
        if(ad[len].innerText==="广告")
        {
            var use=ad[len];
            while(use.parentElement.id==="")
            {
                use=use.parentElement;
            }
            use.parentElement.innerHTML="";
        }
    }
}
var t1=window.setInterval(delete_ad,1000);