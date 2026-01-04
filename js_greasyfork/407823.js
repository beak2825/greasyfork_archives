// ==UserScript==
// @name         去csdn广告
// @namespace    fxxxysh
// @version      1.0.2
// @description  去掉csdn上的广告
// @author       fxxxysh
// @include        *csdn.net*
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @copyright    copyright©2020 fxxxysh writer:me17701286529@aliyun.com
// @downloadURL https://update.greasyfork.org/scripts/407823/%E5%8E%BBcsdn%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/407823/%E5%8E%BBcsdn%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

function delete_ad()
{
    var ad=document.getElementsByTagName("iframe");
    if(ad===undefined)
    {
        return;
    }
    var len=ad.length;
    while(len!==0)
    {
        len--;
        ad[len].src="";
    }
}
delete_ad();

