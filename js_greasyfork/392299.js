// ==UserScript==
// @name         新·真·洛谷屏蔽功能
// @namespace    https://github.com/Virtual-Dimension/TrulyShield/blob/master/TrulyLuoguShield.js
// @version	     2.45
// @description  拉低质量小学生？仗势怼人大佬佬？不存在的！
// @author       ArachnidaKing
// @license      GPL-3.0
// @match       https://www.luogu.org/discuss/*
// @match	http://www.luogu.org/discuss/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392299/%E6%96%B0%C2%B7%E7%9C%9F%C2%B7%E6%B4%9B%E8%B0%B7%E5%B1%8F%E8%94%BD%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/392299/%E6%96%B0%C2%B7%E7%9C%9F%C2%B7%E6%B4%9B%E8%B0%B7%E5%B1%8F%E8%94%BD%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function()
{
	'use strict';
	//
	var makeGetCommands=(toGetUrl,completedTodo,elementTodo)=>
	{
		let dq_request=new window.XMLHttpRequest();
		dq_request.open("GET",toGetUrl,1);
		dq_request.onreadystatechange=()=>
		{
			if((dq_request.readyState===4)&&(dq_request.status===200))
			{
				completedTodo(dq_request.responseText,elementTodo);
			}
		}
		dq_request.send();
	}
	//
	var ifGiveBigCleanForLajis=(lawForJudgement,elementToJudge)=>
	{
		let pre_p=lawForJudgement.search("JSON.parse\(.*?(?=\);)");
		let nxt_p=lawForJudgement.search("(?<=JSON.parse\().*?(?=\);)");
		let key=lawForJudgement.substr(pre_p,nxt_p-pre_p);
		let judgementResult=(window.eval(key).currentData.user.userRelationship==2);
		// 
		if(judgementResult==1)
		{
			elementToJudge.parentNode.removeChild(elementToJudge);
		}
	}
	////
	var urlElements=document.querySelectorAll("a[class=center]");
	//
	var urlElement_num=urlElements.length;
	let dq_element;
	for(let i=0;i<urlElement_num;++i)
	{
		dq_element=urlElements[i];
		while((dq_element.parentNode.className!="lg-content-table-left")&&(dq_element.parentNode.className!="lg-content-left"))
		{
			dq_element=dq_element.parentNode;
		}
		//
		makeGetCommands(urlElements[i].href,ifGiveBigCleanForLajis,dq_element);
	}
})();