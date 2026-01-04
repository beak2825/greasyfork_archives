// ==UserScript==
// @name         GreasyFork 增强
// @namespace    https://greasyfork.org/
// @version      2024.12.26
// @description  便捷功能
// @author       Ejin
// @match        https://greasyfork.org/*/users/*
// @match        https://greasyfork.org/*/scripts*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486058/GreasyFork%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/486058/GreasyFork%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

// 2024.08.04 用户自己的脚本列表，讨论提醒：删除已回答过的讨论和更早的讨论
// 2024.01.30 脚本列表、脚本搜索列表，收藏页脚本列表增加快捷进入代码页链接。
// 2024.01.30 用户自己的脚本列表增加快捷进入代码页、更新页的链接。
setTimeout(function() {

	//用户自己的脚本列表，增加快捷进入代码页、更新页的链接。
	if( /users\/\d+/.test(location.href) ){
		// 选择器=(脚本+未上架脚本链接)
        document.querySelectorAll("#user-script-list-section .script-link, #user-unlisted-script-list-section .script-link").forEach(ele => {
			var newspan=document.createElement("span");
			newspan.style.fontSize="0.75em";
			newspan.innerHTML=`
				<a href="${ele.href}/code">code</a>
				&nbsp;
				<a href="${ele.href}/versions/new">edit</a>
			`;
			ele.parentElement.insertBefore(newspan,ele.parentElement.children[2]);
		});
	}

    //用户自己的脚本列表，讨论提醒：删除已回答过的讨论和更早的讨论
	if( /users\/\d+/.test(location.href) ){
		var hide=0;
        document.querySelectorAll(".discussion-list-container").forEach((ele,i)=>{
            if(i==0)return;
            if(hide==1 || ele.querySelectorAll("a[href*='/users/']")[1].href.indexOf("ejin") != -1){
                ele.remove();
                hide=1;
            }
        });
	}

	//脚本列表、脚本搜索列表，收藏页脚本列表增加快捷进入代码页链接。
	if( location.pathname.indexOf("/scripts")!= -1 ){
		document.querySelectorAll(".script-link").forEach(ele => {
			var newspan=document.createElement("span");
			newspan.style.fontSize="0.75em";
			newspan.innerHTML=`
				<a href="${ele.href}/code">code</a>
			`;
			ele.parentElement.insertBefore(newspan,ele.parentElement.children[2]);
		});
	}
},0);