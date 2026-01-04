// ==UserScript==
// @name        lngbzx 01
// @namespace   Violentmonkey Scripts
// @match       https://zyjs.lngbzx.gov.cn/study/xml/tss
// @match       https://zyjs.lngbzx.gov.cn/study/xml/video
// @grant       none
// @version     1.0
// @author      vlararara
// @description 2022/5/14 01:03:37
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/451219/lngbzx%2001.user.js
// @updateURL https://update.greasyfork.org/scripts/451219/lngbzx%2001.meta.js
// ==/UserScript==

(function() {
   

var a=document.getElementsByTagName("script");
a=a[a.length-1].innerHTML.replace(/[\"\\\n]/g, '');
a=a.substring(a.indexOf('t(')+2,a.lastIndexOf(';')-1).split(',');
var cid=a[0];
var len=a[4];
var data1={"cid":cid,"source":"10","position":"","percent":"0"};
var historyid;


async function fetchdata(){
	const rdata = await fetch("https://zyjs.lngbzx.gov.cn/study/resource/saveTssView", {
			"credentials": "include",
			"headers": {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0",
			"Accept": "*/*",
			"Accept-Language": "zh,zh-CN;q=0.9,zh-HK;q=0.7,zh-TW;q=0.6,zh-SG;q=0.4,en-US;q=0.3,en;q=0.1",
			"Content-Type": "application/json",
			"Sec-Fetch-Dest": "empty",
			"Sec-Fetch-Mode": "no-cors",
			"Sec-Fetch-Site": "same-origin",
			"Pragma": "no-cache",
			"Cache-Control": "no-cache"
			},
			"referrer": "https://zyjs.lngbzx.gov.cn/study/xml/tss",
			"body": JSON.stringify(data1),
			"method": "POST",
			"mode": "cors"
		});
	const jsonResponse = await rdata.json();
	return jsonResponse;
}
fetchdata().then((jsonResponse)=>{	
	console.log(JSON.stringify(jsonResponse));
	historyid = jsonResponse.id;
	data2={"historyId":historyid,"position":Number(len),"len":len,"cid":cid};
	console.log(JSON.stringify(data2));
  fetch("https://zyjs.lngbzx.gov.cn/study/resource/saveTssView", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "zh,zh-CN;q=0.9,zh-HK;q=0.7,zh-TW;q=0.6,zh-SG;q=0.4,en-US;q=0.3,en;q=0.1",
        "content-type": "application/json;charset=utf-8",
        "x-requested-with": "XMLHttpRequest",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
    },
    "referrer": "https://zyjs.lngbzx.gov.cn/study/xml/tss",
    "body": JSON.stringify(data2),
    "method": "POST",
    "mode": "cors"
});
  alert("完毕");
});
//===================================================================================






})();
