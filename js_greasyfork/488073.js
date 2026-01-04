// ==UserScript==
// @name         炉石卡组代码获取工具
// @namespace    https://greasyfork.org/zh-CN/scripts/488073/
// @version      0.5
// @description  搜索页面中的所有像是炉石卡组代码的东西，显示搜索结果。
// @author       beibeibeibei
// @license      MIT
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/488073/%E7%82%89%E7%9F%B3%E5%8D%A1%E7%BB%84%E4%BB%A3%E7%A0%81%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/488073/%E7%82%89%E7%9F%B3%E5%8D%A1%E7%BB%84%E4%BB%A3%E7%A0%81%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function() {
	'use strict';

	// Your code here...
	GM_registerMenuCommand('🎮 显示页面中的炉石卡组代码',
	function() {
		searchMatchedContent();
	});

	function searchMatchedContent() {
        // 这个正则说人话就是连续68多个字母加数字
		var regex = /[A-Za-z\d\/\=\+]{68,}/g;
		var matchedContents = document.body.innerText.match(regex);

		if (matchedContents) {
			// 创建一个dialog元素
            let dialog = document.createElement('dialog');
			dialog.setAttribute('id', 'HearthstoneCardsDialog');
            dialog.style.width = "40%";
            dialog.style.height = "30%";
            dialog.style.backgroundColor = "#f9f9f9";
            dialog.style.color = "#333";
            dialog.style.border = "1px solid #ccc";
            dialog.style.padding = "20px";
            dialog.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
            dialog.style.fontFamily = "Arial, sans-serif";
            dialog.style.fontSize = "14px";
            dialog.style.borderRadius = "10px";

			// 遍历matchedContents数组
			for (let i = 0; i < matchedContents.length; i++) {
				// 创建一个新的p标签
				var p = document.createElement("p");
                // 设置宽度,让背景颜色的宽度显示正常
                p.style.width = "fit-content";
				// 将当前元素设置为p标签的文本内容
				p.textContent = matchedContents[i];
				// 创建一个按钮用于复制文本
                var addBtn = document.createElement("button");
                addBtn.innerHTML = "复制到剪贴板";
                addBtn.style.marginBottom = "10px";
                addBtn.style.padding = "4px 10px";
                addBtn.style.userSelect = "none";
                addBtn.addEventListener('click', function(e) {
                    let text = this.previousElementSibling.textContent;
                    navigator.clipboard.writeText(text).then(function() {
                        alert('已复制到剪贴板');
                    }).catch(function(err) {
                        alert("复制的值:"+text+'。复制失败:'+err);
                    });
                });
                // 将p标签和button添加到dialog标签中
				dialog.append(p,addBtn);
			}

            var closeBtn = document.createElement("button");
            closeBtn.innerHTML = "关闭";
            closeBtn.style.padding = "10px 20px";
            closeBtn.style.backgroundColor = "#CCC";
            closeBtn.style.color = "#000";
            closeBtn.style.borderRadius = "4px";
            closeBtn.style.border = "0";
            closeBtn.style.userSelect = "none";
            closeBtn.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
            closeBtn.addEventListener("click",()=>{
                dialog.close();
                dialog.parentElement.removeChild(dialog);
            });
            closeBtn.addEventListener('mouseover', function() {
                this.style.backgroundColor = "#888";
            });
            closeBtn.addEventListener('mouseout', function() {
                this.style.backgroundColor = "#CCC";
            });
            closeBtn.addEventListener('mousedown', function(event) {
                this.style.backgroundColor = "#666";
                this.style.scale = "0.98";
            });
            closeBtn.addEventListener('mouseup', function() {
                this.style.backgroundColor = "#CCC";
                this.style.scale = "1";
            });
            dialog.append(document.createElement("br"),closeBtn);

			// 将dialog元素添加到页面中
            document.body.appendChild(dialog);

			// 打开dialog
			dialog.showModal();

            // 向dialog添加一个长条撑开dialog, 以免最长的p标签右侧紧挨着dialog窗口
            let space = document.createElement("div");
            space.style.width = parseFloat(window.getComputedStyle(dialog).width) + 200 + "px";
            space.style.height = "1px";
            dialog.append(space);

            // 以AAE打头的结果会突出显示
            dialog.querySelectorAll("p").forEach((p)=>{
                if (p.textContent.startsWith("AAE")) {
                    p.style.backgroundColor = "antiquewhite";
                }
            });
		} else {
			alert('未找到匹配内容');
		}
	}

	// Your code here...
})();