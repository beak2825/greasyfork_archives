// ==UserScript==
// @name         删除谷歌广告
// @namespace    fxxxysh
// @version      1.0.6
// @description  删除谷歌推广的所有广告
// @author       fxxxysh
// @include       *
// @copyright    copyright©2020 fxxxysh writer:me17701286529@aliyun.com
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/408101/%E5%88%A0%E9%99%A4%E8%B0%B7%E6%AD%8C%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/408101/%E5%88%A0%E9%99%A4%E8%B0%B7%E6%AD%8C%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


function delete_ad()
{
    var ad=document.getElementsByTagName("iframe");
    var len=ad.length;
    while(len !== 0)
    {
        len--;
        var url=ad[len].src;
        var str="https:\/\/googleads.g.doubleclick.net\/pagead\/ads";
        url=url.substr(0,str.length);
        //var pattern=/https:\/\/googleads.g.doubleclick.net\/pagead\/ads\?\*/;
        if(url===str)
        {
            ad[len].src="";
            ad[len].width=1;
            ad[len].height=1;
        }
    }
}
var t1=window.setInterval(delete_ad,1000);