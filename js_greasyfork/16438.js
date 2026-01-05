// ==UserScript==
// @name           iterid_buy
// @description    try to buy
// @include        http://zqb.red.xunlei.com/index.php?r=sitev1/list
// @include        https://zqb.red.xunlei.com/index.php?r=sitev1/list
// @author         nemoKing
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_xmlhttpRequest
// @version        2015.7.21.2
// @namespace      https://greasyfork.org/scripts/152
// @downloadURL https://update.greasyfork.org/scripts/16438/iterid_buy.user.js
// @updateURL https://update.greasyfork.org/scripts/16438/iterid_buy.meta.js
// ==/UserScript==


var all_body=document.body.innerHTML;
var all_text=document.body.innerText;

if (document.getElementById('btn_buy') == null || all_text.indexOf("本轮产品已经全部售罄")>0 || all_text.indexOf("恭喜您已完善购买信息，请您耐心等待抢购开启")>0 )
{
   setTimeout('location.href="http://zqb.red.xunlei.com/index.php?r=sitev1/list"',1000);
    console.log("------reload!-----");
}
else if(  all_text.indexOf("无需刷新网页，排队自动进行中")>0 )
{
    console.log("------waiting for dingdan-----");
     setTimeout('location.href="http://zqb.red.xunlei.com/index.php?r=sitev1/list"',15000);
}
else
{

	document.getElementById('btn_buy').click();
    setTimeout('location.href="http://zqb.red.xunlei.com/index.php?r=sitev1/list"',30000);
     console.log("------waiting for yanzhangma-----");


}

