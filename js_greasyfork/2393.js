// ==UserScript==
// @name        tsdm no Popups
// @author         Ted423
// @description 天使动漫论坛签到点击表情防弹窗处理
// @namespace   https://github.com/ted423
// @include     https://www.tsdm.love/*
// @include     http://www.tsdm.love/*
// @version     1.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2393/tsdm%20no%20Popups.user.js
// @updateURL https://update.greasyfork.org/scripts/2393/tsdm%20no%20Popups.meta.js
// ==/UserScript==
var temp=document.getElementById("inner_stat");
if(temp!==null){temp=temp.childNodes;
	for(i=0;i<temp.length;i++)
	{
		if(temp[i].href==="javascript:;")
		temp=temp[i];
	}
	temp.childNodes[0].textContent="签到";
	var tempOnclick=temp.onclick;
}
else temp =document.getElementsByTagName("font")[0];
temp.textContent="签到";
temp.onclick = function(){
	if(window.navigator.userAgent.indexOf("Chrome")===-1){
		var temp2;
		temp1=temp.attributes;
		for(i=0;i<temp1.length;i++)
			if(temp1[i].value.indexOf("showWindow")!=-1){
				console.log(i);
				console.log(temp1[i].value);
				temp2=temp1[i].value;
				break;
			}
			eval(temp2);
		}
		var callback = function(records){
			records.map(function(record){
				if((record.target.id==='fwin_content_dsu_paulsign')&&(record.target.nextElementSibling)){
					var script = document.createElement('script');
					script.type = 'text/javascript';
					fn="function openTsRecommend(sId){};";
					script.textContent = fn.toString();

					var de = document.documentElement;
					de.appendChild(script);
					Icon_selected("ng");
					mo.disconnect();
				}
			});
		};

		var mo = new MutationObserver(callback);

		var option = {
			'childList': true, 
			'subtree': true,
			'characterData' : true
		};
		var element = document.getElementById("fwin_content_dsu_paulsign");
		mo.observe(document.body, option);
		tempOnclick();
	}