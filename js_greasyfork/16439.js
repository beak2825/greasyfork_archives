// ==UserScript==
// @name           jd_force_submit
// @description    try to open tab 
// @include        http://trade.jd.com/shopping/order/getOrderInfo.action?rid=*
// @author         nemoDebug
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_xmlhttpRequest
// @version        2015.7.21.23
// @namespace      https://greasyfork.org/scripts/153
// @downloadURL https://update.greasyfork.org/scripts/16439/jd_force_submit.user.js
// @updateURL https://update.greasyfork.org/scripts/16439/jd_force_submit.meta.js
// ==/UserScript==


if(document.getElementById("order-submit")==null)
{
    console.log("-----------no submit-----------");

    setTimeout('location.href="http://"+location.hostname+location.pathname+location.search',100)
}
else
{

    setTimeout('var result=document.getElementById("shopping-lists").innerText.indexOf("有货");if(result>0){console.log("----goods--have-submit--");javascript:submit_Order();}else{ console.log("--reloading--");location.href="http://"+location.hostname+location.pathname+location.search;}',3000);
    
    setTimeout('location.href="http://"+location.hostname+location.pathname+location.search',7000);

}
	
    





