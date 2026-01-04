// ==UserScript==
// @name         sciencedirect+ieeexplore+tandfonline+springer跳转CUMT_按钮
// @license Apache
// @namespace    hanzhang
// @version      1.0.1
// @description  sciencedirect+ieeexplore+tandfonline跳转 CUMT
// @author       hanzhang
// @match        https://www.sciencedirect.com/science/*
// @match        https://ieeexplore.ieee.org/*
// @match        https://www.tandfonline.com/doi/*
// @match        https://link.springer.com/article/*
// @match        https://www.springer.com/*
// @match        https://pubsonline.informs.org/doi/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sciencedirect.com
// @grant        GM_openInTab

// @downloadURL https://update.greasyfork.org/scripts/512396/sciencedirect%2Bieeexplore%2Btandfonline%2Bspringer%E8%B7%B3%E8%BD%ACCUMT_%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/512396/sciencedirect%2Bieeexplore%2Btandfonline%2Bspringer%E8%B7%B3%E8%BD%ACCUMT_%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var html_title=new Array()
	html_title[0]= "www.sciencedirect.com"
	html_title[1]= "ieeexplore.ieee.org"
	html_title[2]= "www.tandfonline.com"
	html_title[3]= "www.springer.com"
	html_title[4]= "link.springer.com"
	html_title[5]="pubsonline.informs.org"
	//html_title[6]="onlinelibrary.wiley.com"
	//let link = location.href;
    function addButton() {
		let link = window.location.host
		if(link==html_title[0])
		{
			// 找到目标元素
			let targetElement = document.querySelector("#popover-trigger-export-citation-popover");

			if (targetElement && !document.getElementById("other-button")) {
				// 创建新的按钮元素
				let newButton = document.createElement("button");
				newButton.id = "other-button";  // 给按钮添加一个ID，避免重复添加
				newButton.className = "button-link button-link-secondary button-link-icon-left button-link-has-colored-icon";
				newButton.type = "button";
				newButton.innerHTML = `
					<svg focusable="false" viewBox="0 0 104 128" height="20" class="icon icon-cited-by-66">
						<path d="M50 10L90 50L50 90L10 50Z"></path>
					</svg>
					<span class="button-link-text-container">
						<span class="button-link-text">跳转CUMT</span>
					</span>
				`;
                // 设置按钮的颜色样式
                newButton.style.backgroundColor = "#007BFF";  // 设置背景颜色为蓝色
                newButton.style.color = "white";  // 设置文字颜色为白色
                newButton.style.border = "none";  // 移除按钮边框
                newButton.style.padding = "6px 8px";  // 设置按钮的内边距
                newButton.style.borderRadius = "5px";  // 设置圆角
				// 为新按钮添加点击事件
				newButton.addEventListener("click", function() {
					//alert("新按钮被点击了!");
					// 在此处添加你想执行的代码
					//debugger;
					link = location.href;
					link = link.replace('www.sciencedirect.com','www-sciencedirect-com-s.webvpn.cumt.edu.cn:8118');
					GM_openInTab(link, { active: true });
				});

				// 将新按钮添加到目标元素中
				targetElement.appendChild(newButton);
			}
		}
		else if(link==html_title[1])
		{
			// 找到目标元素
			let targetElement = document.querySelector(".xpl-btn-secondary");

			if (targetElement && !document.getElementById("other-button")) {
				// 创建新的按钮元素
				let newButton = document.createElement("button");
				newButton.id = "other-button";  // 给按钮添加一个ID，避免重复添加
				newButton.className = "layout-btn-white cite-this-btn";  // 复制原按钮的样式，或使用新的样式
				newButton.type = "button";
				newButton.innerHTML = "跳转CUMT";  // 按钮的文本内容
                // 设置按钮的颜色样式
                newButton.style.backgroundColor = "#007BFF";  // 设置背景颜色为蓝色
                newButton.style.color = "white";  // 设置文字颜色为白色
                newButton.style.border = "none";  // 移除按钮边框
                newButton.style.padding = "10px 15px";  // 设置按钮的内边距
                newButton.style.borderRadius = "5px";  // 设置圆角
				// 为新按钮添加点击事件
				newButton.addEventListener("click", function() {
					link = location.href;
                    var regex1 = 'https://ieeexplore.ieee.org/abstract/';
                    var flag1 =link.search(regex1);
                    if(flag1!=-1)
                    {
                        link = link.replace('ieeexplore.ieee.org/abstract/','ieeexplore-ieee-org-s.webvpn.cumt.edu.cn:8118/');
                    }
                    var regex2 = 'https://ieeexplore.ieee.org/';
                    var flag2 =link.search(regex2);
                    if(flag2!=-1)
                    {
                        link = link.replace('ieeexplore.ieee.org/','ieeexplore-ieee-org-s.webvpn.cumt.edu.cn:8118/');
                    }

                    GM_openInTab(link, { active: true });




				});

				// 将新按钮插入到目标元素的旁边
				targetElement.parentNode.insertBefore(newButton, targetElement.nextSibling);
                //newButton.parentNode.appendChild(newButton);
                // 将新按钮插入到DOI元素之后
			}
		}
        else if(link==html_title[2])
        {
            // 找到目标元素
            let doiElement = document.querySelector(".dx-doi");

            if (doiElement && !document.getElementById("other-button")) {
                // 创建新的按钮元素
                let newButton = document.createElement("button");
                newButton.id = "other-button";  // 给按钮添加一个ID，避免重复添加
                newButton.className = "button-link button-link-secondary button-link-icon-left button-link-has-colored-icon";
                newButton.type = "button";
                newButton.innerHTML = `
                <span class="button-link-text-container">
                    <span class="button-link-text">跳转CUMT</span>
                </span>
            `;
                // 设置按钮的颜色样式
                newButton.style.backgroundColor = "#007BFF";  // 设置背景颜色为蓝色
                newButton.style.color = "white";  // 设置文字颜色为白色
                newButton.style.border = "none";  // 移除按钮边框
                newButton.style.padding = "10px 15px";  // 设置按钮的内边距
                newButton.style.borderRadius = "5px";  // 设置圆角
                // 为新按钮添加点击事件
                newButton.addEventListener("click", function() {
					link = location.href;
                    link = link.replace('www.tandfonline.com','www-tandfonline-com-s.webvpn.cumt.edu.cn:8118');

                    GM_openInTab(link, { active: true });
                });
                doiElement.insertAdjacentElement('afterend', newButton);
            }
        }
        else if(link==html_title[4])
        {
            // 找到目标元素
            let targetElement = document.querySelector(".c-article-identifiers__item time");

            if (targetElement && !document.getElementById("other-button")) {
                // 创建新的按钮元素
                let newButton = document.createElement("button");
                newButton.id = "other-button";  // 给按钮添加一个ID，避免重复添加
                newButton.className = "button-link button-link-secondary";
                newButton.type = "button";
                newButton.innerText = "跳转CUMT";
                // 设置按钮的颜色样式
                newButton.style.backgroundColor = "#007BFF";  // 设置背景颜色为蓝色
                newButton.style.color = "white";  // 设置文字颜色为白色
                newButton.style.border = "none";  // 移除按钮边框
                newButton.style.padding = "10px 15px";  // 设置按钮的内边距
                newButton.style.borderRadius = "5px";  // 设置圆角
                // 为新按钮添加点击事件
                newButton.addEventListener("click", function() {
                    link = location.href;
                    link = link.replace('link.springer.com','link-springer-com-s.webvpn.cumt.edu.cn:8118');
                    GM_openInTab(link, { active: true });
                });

                // 将新按钮插入到目标元素后面
                targetElement.parentNode.insertBefore(newButton, targetElement.nextSibling);
            }
        }
        else if(link==html_title[5])
        {
            // 找到目标元素
            let targetElement = document.querySelector(".epub-section__item");

            if (targetElement && !document.getElementById("other-button")) {
                // 创建新的按钮元素
                let newButton = document.createElement("button");
                newButton.id = "other-button";  // 给按钮添加一个ID，避免重复添加
                newButton.className = "button-link";
                newButton.type = "button";
                newButton.style.marginLeft = "10px";  // 设置按钮与前面元素的间距
                newButton.textContent = "跳转CUMT";
                // 设置按钮的颜色样式
                newButton.style.backgroundColor = "#007BFF";  // 设置背景颜色为蓝色
                newButton.style.color = "white";  // 设置文字颜色为白色
                newButton.style.border = "none";  // 移除按钮边框
                newButton.style.padding = "10px 15px";  // 设置按钮的内边距
                newButton.style.borderRadius = "5px";  // 设置圆角
                // 为新按钮添加点击事件
                newButton.addEventListener("click", function() {
                    link = location.href;
                    link = link.replace('pubsonline.informs.org','pubsonline-informs-org-s.webvpn.cumt.edu.cn:8118');
                    GM_openInTab(link, { active: true });
                });

                // 将新按钮插入到目标元素的后面
                targetElement.insertAdjacentElement('afterend', newButton);
            }
        }
    }





    // 首次调用以添加按钮
    addButton();
    // 使用setTimeout延迟添加按钮
    setTimeout(addButton, 500);  // 0.5秒后尝试添加按钮
    // 监控DOM变化，确保按钮不会被移除
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            addButton();  // 在DOM发生变化时重新尝试添加按钮
        });
    });

    // 开始监控目标节点的子树变化
    observer.observe(document.body, { childList: true, subtree: true });

})();