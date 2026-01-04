// ==UserScript==
// @name         犀流堂
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  溪流堂下一课按钮
// @author       Ycz
// @match        https://www.rhinostudio.cn/*
// @match        http://www.rhinostudio.cn/*
// @icon         https://www.google.com/s2/favicons?domain=rhinostudio.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430127/%E7%8A%80%E6%B5%81%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/430127/%E7%8A%80%E6%B5%81%E5%A0%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
    var a=document.getElementsByClassName("dashboard-header")[0]
var nowid=document.getElementsByClassName("dashboard-header")[0].innerText.split("：")[0].split("任务")[1]
document.getElementsByClassName("mbs es-icon es-icon-menu")[0].click()
document.getElementsByClassName("mbs es-icon es-icon-menu")[0].click()

var gou=function(){
var courseids=document.getElementsByClassName("task-list task-show infinite-container")[0].children
for (var i = 0; i < courseids.length; i++) {
	var aaa = 1;
	for (var j = 3; j < nowid.length + 3; j++) {
		if ((courseids[i].innerText)[j] != nowid[j - 3]) {
			aaa *= 0;
		}
	}
	if (aaa == 1)
                 { nowid = i;
	break;}

}
var next=courseids[Number(nowid)+1]
if(next.innerText[0]!="课"&&next.innerText[1]!="时"){next=courseids[Number(nowid)+2]}
var nextname=next.innerText.split(":")[1]
var nexturl=next.children[1].href
//  window.location.replace(nexturl);
var newNode = document.createElement("a");
        // 给新插入的节点添加文本内容
        newNode.innerText = nextname+"\n";
       newNode.addEventListener('click', function()
            {window.location.replace(nexturl);});

a.appendChild(newNode)
}

setTimeout(gou,1000);
    }
    // Your code here...
})();