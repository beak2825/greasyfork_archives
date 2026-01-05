// ==UserScript==
// @name        etransfarorderdiner
// @namespace   https://greasyfork.org/zh-CN/scripts/23876-etransfarorderdiner
// @description etransfar内网订餐
// @author      涛声依旧
// @version     1.7.1
// @include     *
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue

// @downloadURL https://update.greasyfork.org/scripts/23876/etransfarorderdiner.user.js
// @updateURL https://update.greasyfork.org/scripts/23876/etransfarorderdiner.meta.js
// ==/UserScript==

//window.document.addEventListener("DOMContentLoaded", judgeTime, false);
var myDate = new Date();
var worknum= [15583,014658,14737,11092,13049,16090,15859,14050,910276,15808];
judgeTime();
function judgeTime(){
			if(myDate.getHours()>=13 && myDate.getHours()<15){
				 for (var i = 0; i < worknum.length; i++) {
					 Order(worknum[i]);
					 }
				}
}
function getOrderResult(content){
	var Data = eval('(' + content + ')');
	var result = Data.result; // error表示订餐失败
	var message = Data.msg; // 反馈消息
	var num = Data.count; // 订餐用户数量
	orderuser=num;
	if(result=="error")
	{
		console.log(message);
	}
	else{
		GM_setValue("date", myDate.toLocaleDateString());
		console.log(message+"  当前订餐人数:"+orderuser);
	}
 }
 function Order(num) {
    var reqUrl = "http://10.7.13.130/dingcan/bookdinnercs/AddBookDinner?numorname="+num+"&dinnertype=1-餐票";
    var ret = GM_xmlhttpRequest({
      method: "POST",
      url: reqUrl,
      headers: {"Accept": "application/json"},
      onreadystatechange: function(res) {
      },
      onload: function(res) {
        var retContent = res.response;
        getOrderResult(retContent);
      },
      onerror: function(res) {
        console.log("error");
      }
    });
	
}
