// ==UserScript==
// @name         ZXOJ Better!
// @namespace    http://tampermonkey.net/
// @version      2.0.4
// @description  Add a button to redirect to ZXOJ (Partial)
// @author       AntonyD With GPT
// @match        http://www.zxoj.net/*
// @match        http://222.203.110.13/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502690/ZXOJ%20Better%21.user.js
// @updateURL https://update.greasyfork.org/scripts/502690/ZXOJ%20Better%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前 URL 的路径部分
    var path = window.location.pathname;

    // 使用正则表达式检查路径是否匹配 '/d/luogu/p/*'
    var regex = /^\/d\/luogu\/p\/[^\/]+$/;
	// 使用正则表达式检查路径是否匹配 首页
	var regexRoot = /^\/$/;
	// 使用正则表达式检查路径是否匹配 评测页
	var regexTesting = /^.*\/record\/.*$/;

	// console.log("Current URL: ", path);
	// console.log(regexRoot.test(path));

    // 如果路径不匹配，直接返回，不执行后面的代码
    if (regex.test(path)) {
		// console.log("<<<>>>");
		// 创建按键
		var button = document.createElement("button");
		button.innerHTML = "前往洛谷题面";
		var button1 = document.createElement("button");
		button1.innerHTML = "前往洛谷题解";

		// 设置按键的部分基本CSS属性
		button.style.marginLeft = "0px"; // 左边距
		button.style.padding = "5px 10px"; // 按键文字的内边距
		button.style.fontSize = "15px"; // 按键显示的字体大小
		button.style.borderRadius = "5px"; // 设置圆角
		button.style.border = "1px solid #000"; // 设置边框，你可以改变颜色
		button.style.backgroundColor = "#f8f9fa"; // 设置背景颜色，你可以改变颜色
		button.style.display = "inline-block"; // 设置显示模式为 inline-block 以便并列显示

		button1.style.marginLeft = "20px";
		button1.style.padding = "5px 10px";
		button1.style.fontSize = "15px";
		button1.style.borderRadius = "5px";
		button1.style.border = "1px solid #000";
		button1.style.backgroundColor = "#f8f9fa";
		button1.style.display = "inline-block";

		var htmlElement = document.documentElement;
		var hastheme = htmlElement.classList.contains('theme--dark');
		if (hastheme) {
			button.style.border = "1px solid #f8f9fa";
			button.style.backgroundColor = "#000";
			button.style.fontcolor = "#f8f9fa";
			button1.style.border = "1px solid #f8f9fa";
			button1.style.backgroundColor = "#000";
			button1.style.fontcolor = "#f8f9fa";
			// console.log(">>><<<");
		}

		// 获取难度系数
		var difficultyElements = document.querySelectorAll('.bp5-tag.bp5-large.bp5-minimal.problem__tag-item');
		var difficultyElement = difficultyElements.length > 6 ? difficultyElements[6] : null;
		var difficultyValue = difficultyElement ? difficultyElement.textContent.match(/\d+/) : null;
		// console.log(difficultyElements);
		// console.log(difficultyElement);
		// console.log(difficultyValue);

		// 创建一个新的 div 元素作为难度标签
		var Diff = document.createElement('div');
		if (difficultyValue != null) {
			// 匹配难度系数，并加入元素文本，调节文本框颜色
			switch (difficultyValue[0]) {
				case "0" :
					Diff.textContent = "暂无评定";
					Diff.style.backgroundColor = "#bfbfbf";
					break;
				case "1" :
					Diff.textContent = "入门";
					Diff.style.backgroundColor = "#fe4c61";
					break;
				case "2" :
					Diff.textContent = "普及-";
					Diff.style.backgroundColor = "#f39c11";
					break;
				case "3" :
					Diff.textContent = "普及/提高-";
					Diff.style.backgroundColor = "#ffc116";
					break;
				case "4" :
					Diff.textContent = "普及+/提高";
					Diff.style.backgroundColor = "#52c41a";
					break;
				case "5" :
					Diff.textContent = "提高+/省选-";
					Diff.style.backgroundColor = "#3498db";
					break;
				case "6" :
					Diff.textContent = "省选/NOI-";
					Diff.style.backgroundColor = "#9d3dcf";
					break;
				case "7" :
					Diff.textContent = "NOI/NOI+/CTSC";
					Diff.style.backgroundColor = "#0e1d69";
					break;
				default :
					Diff.textContent = "Unknown";
					Diff.style.backgroundColor = "#bfbfbf";
					break;
			}
		}
		else {
			Diff.textContent = "Unknown";
			Diff.style.backgroundColor = "#bfbfbf";
		}

		Diff.style.marginLeft = "20px";
		Diff.style.padding = "5px 10px";
		Diff.style.fontSize = "15px";
		Diff.style.borderRadius = "3px";
		Diff.style.color = "#ffffff";
		Diff.style.display = "inline-block";

		// 寻找标题元素
		var title1Element = document.querySelector('.section__title');

		// 将按键/标签添加至标题元素后面
		title1Element.parentNode.insertBefore(Diff, title1Element.nextSibling);
		title1Element.parentNode.insertBefore(button1,title1Element.nextSibling);
		title1Element.parentNode.insertBefore(button, title1Element.nextSibling);

		// 设置按键点击事件
		button.addEventListener ("click", function() {

			// 将PID从URL路径中分离
			var PID = path.split('/').pop();

			// 跳转至相应PID的洛谷页面
			window.open("https://www.luogu.com.cn/problem/" + PID);
		});

		button1.addEventListener ("click", function() {
			var PID1 = path.split('/').pop();
			window.open("https://www.luogu.com.cn/problem/solution/" + PID1);
		});
	}
	if (regexRoot.test(path)) {
		// console.log(">>><<<");
		// 创建复选框容器
        const container = document.createElement('div');
		container.style.display = 'none';
        container.id = 'checkbox-container';
        container.style.position = 'fixed';
        container.style.top = '55px';
        container.style.right = '10px';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid black';
        container.style.padding = '10px';
        container.style.zIndex = '1000';
		
		var buttonDisplay = document.createElement("button");
		var isDisplay = true;
		buttonDisplay.innerHTML = "展开";
		// 设置基本的按键CSS属性
		buttonDisplay.style.display = "block";
		buttonDisplay.style.position = "fixed"; // 绝对页面位置
		buttonDisplay.style.top = "10px"; // 距离页面顶部的距离
		buttonDisplay.style.right = "10px"; // 距离页面右侧的距离
		buttonDisplay.style.padding = "5px 10px"; // 文字内边距
		buttonDisplay.style.fontSize = "15px"; // 字体大小
		buttonDisplay.style.border = "1px solid #000"; // 边框属性
		buttonDisplay.style.borderRadius = "5px"; // 设置圆角
		
		// 将按键添加至特殊的页面部分(顶部栏)
		var navbarDiv = document.getElementById("menu");
		if (navbarDiv) {
			navbarDiv.appendChild(buttonDisplay);
		} else {
			// 如果没有ID为menu的元素，那么直接添加至body
			document.body.appendChild(buttonDisplay);
		}
		
		buttonDisplay.addEventListener ("click", function() {
			if (isDisplay) {
				container.style.display = 'block';
				buttonDisplay.innerHTML = "收起";
				isDisplay = false;
			}
			else {
				container.style.display = 'none';
				buttonDisplay.innerHTML = "展开";
				isDisplay = true;
			}
		});
		
        // 定义复选框选项
        const options = [
            { id: 'opt1', label: 'AC后显示图片' },
            { id: 'opt2', label: '恭喜AC!' },
            { id: 'opt3', label: '随机PEGI12+' },
			{ id: 'opt4', label: '随机PEGI16+' },
            { id: 'opt5', label: '随机PEGI18+' }
        ];

        // 从 localStorage 加载保存的选项
        const savedOptions = JSON.parse(localStorage.getItem('checkboxOptions')) || {};

		console.log (savedOptions);

        // 创建并添加复选框到容器
        options.forEach(option => {
            const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.id = option.id;
			checkbox.checked = savedOptions[option.id] || false;

			// 设置复选框样式，使其与文字描述并排显示
			checkbox.style.verticalAlign = 'middle';
			checkbox.style.marginRight = '5px'; // 可选：增加一点间距

			const label = document.createElement('label');
			label.htmlFor = option.id;
			label.textContent = option.label;
			label.style.verticalAlign = 'middle'; // 确保文字与复选框在同一行
			label.style.display = 'inline-block'; // 确保标签与复选框并排显示

			const div = document.createElement('div');
			div.style.textAlign = 'left'; // 确保复选框容器中的内容左对齐
			div.appendChild(checkbox);
			div.appendChild(label);

			container.appendChild(div);
        });

        // 将容器添加到页面 body 中
        document.body.appendChild(container);

         // 当任何复选框状态改变时，保存选项到 localStorage 并处理依赖关系
        container.addEventListener('change', () => {

			const targetId = event.target.id;
			const opt2 = document.getElementById('opt2');
			const opt3 = document.getElementById('opt3');
			const opt4 = document.getElementById('opt4');
			const opt5 = document.getElementById('opt5');

            const currentOptions = {};
            options.forEach(option => {
                currentOptions[option.id] = document.getElementById(option.id).checked;
            });

            // 处理 opt1 的取消选中
            if (!currentOptions.opt1) {
                currentOptions.opt2 = false;
                currentOptions.opt3 = false;
                currentOptions.opt4 = false;
				currentOptions.opt5 = false;
                document.getElementById('opt2').checked = false;
                document.getElementById('opt3').checked = false;
                document.getElementById('opt4').checked = false;
				document.getElementById('opt5').checked = false;
                document.getElementById('opt2').disabled = true;
                document.getElementById('opt3').disabled = true;
                document.getElementById('opt4').disabled = true;
				document.getElementById('opt5').disabled = true;
            } else {
                document.getElementById('opt2').disabled = false;
                document.getElementById('opt3').disabled = false;
                document.getElementById('opt4').disabled = false;
				document.getElementById('opt5').disabled = false;
            }
			// 确保 opt2/3/4/5 四选一
			if (targetId === 'opt2' && opt2.checked) {
				opt3.checked = false;
				opt4.checked = false;
				opt5.checked = false;
				currentOptions.opt3 = false;
                currentOptions.opt4 = false;
				currentOptions.opt5 = false;
			} if (targetId === 'opt3' && opt3.checked) {
				opt2.checked = false;
				opt4.checked = false;
				opt5.checked = false;
				currentOptions.opt2 = false;
                currentOptions.opt4 = false;
				currentOptions.opt5 = false;
			} if (targetId === 'opt4' && opt4.checked) {
				opt2.checked = false;
				opt3.checked = false;
				opt5.checked = false;
				currentOptions.opt2 = false;
                currentOptions.opt3 = false;
				currentOptions.opt5 = false;
			} if (targetId === 'opt5' && opt5.checked) {
				opt2.checked = false;
				opt3.checked = false;
				opt4.checked = false;
				currentOptions.opt2 = false;
                currentOptions.opt3 = false;
				currentOptions.opt4 = false;
			}

            localStorage.setItem('checkboxOptions', JSON.stringify(currentOptions));
        });

        // 初始化时处理依赖关系
        if (!document.getElementById('opt1').checked) {
            document.getElementById('opt2').disabled = true;
            document.getElementById('opt3').disabled = true;
            document.getElementById('opt4').disabled = true;
			document.getElementById('opt5').disabled = true;
        }
	}
	if (regexTesting.test(path)) {
        let loginUserLink = document.querySelector('a.nav__item[href*="/user/"]');
        let accpetedUserLink = document.querySelector('a.user-profile-name[href*="/user/"]');
        console.log(loginUserLink, accpetedUserLink);
        let loginUser = loginUserLink ? loginUserLink.getAttribute('href') : null;
        let accpetedUser = accpetedUserLink ? accpetedUserLink.getAttribute('href') : null;
		const checkboxOptions = JSON.parse(localStorage.getItem('checkboxOptions')) || {};
		if (!checkboxOptions.opt1||(!loginUser||!accpetedUser||loginUser!==accpetedUser)) {
			return;
		}
        
		var isFirst = false;
        function waitForTitleChange() {
            return new Promise((resolve) => {
                const intervalId = setInterval(() => {
                    const titleElement = document.querySelector('h1.section__title');
                    if (titleElement) {
                        const titleText = titleElement.textContent;
						if (titleText.includes('Waiting') || titleText.includes('Running') || titleText.includes('Compiling')) isFirst = true;
                        if (!titleText.includes('Waiting') && !titleText.includes('Running') && !titleText.includes('Compiling')) {
                            clearInterval(intervalId);
                            resolve(titleElement); // 解析时返回最新的 titleElement
                        }
                    }
                }, 100); // 每100毫秒检查一次
            });
        }
        
        waitForTitleChange().then((titleElement) => {
            if (titleElement && titleElement.textContent.includes('Accepted') && isFirst) {
                // 创建图片弹窗
                var imgPopup = document.createElement('div');
                imgPopup.style.position = 'fixed';
                imgPopup.style.top = '50%';
                imgPopup.style.left = '50%';
                imgPopup.style.transform = 'translate(-50%, -50%)';
                imgPopup.style.zIndex = '1000';
                imgPopup.style.backgroundColor = 'transparent';
                // imgPopup.style.padding = '10px';
                // imgPopup.style.border = '5px solid black';
                // imgPopup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
                imgPopup.style.maxWidth = '80%'; // 设置最大宽度为页面的75%
                imgPopup.style.maxHeight = '80%'; // 设置最大高度为页面的75%
                // imgPopup.style.overflow = 'auto'; // 如果内容超出容器，显示滚动条

                var img = document.createElement('img');
                // img.src = 'https://moe.jitsu.top/img'; // 替换为你的图片URL
                // console.log(JSON.parse(localStorage.getItem('checkboxOptions')) || {});

                // console.log (checkboxOptions);

                // 检查 opt2 到 opt5 的值，并调用相应的语句
                if (checkboxOptions.opt2) {
                    // 当 opt2 为 true 时执行的语句
                    img.src = 'https://cdn.luogu.com.cn/upload/image_hosting/z52irmkq.png'; // 替换为你的图片URL
                }

                if (!checkboxOptions.opt2) {
                    imgPopup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
                }

                if (checkboxOptions.opt3) {
                    // 当 opt3 为 true 时执行的语句
                    img.src = 'https://moe.jitsu.top/img/?sort=all'; // 替换为你的图片URL
                }

                if (checkboxOptions.opt4) {
                    // 当 opt4 为 true 时执行的语句
                    img.src = 'https://moe.jitsu.top/img/?sort=pixiv'; // 替换为你的图片URL
                }

                if (checkboxOptions.opt5) {
                    // 当 opt5 为 true 时执行的语句
                    img.src = 'https://moe.jitsu.top/img/?sort=r18'; // 替换为你的图片URL
                }

                img.style.display = 'none';
                img.onload = function(){ // 等待图片加载完成
                    var originalWidth = img.width;
                    var originalHeight = img.height;
                    // console.log(originalWidth);
                    // console.log(originalHeight);
                    var ratio = originalHeight / originalWidth;
                    var maxWidth = 0.75 * window.innerWidth;
                    // console.log(img.width);
                    // console.log(originalHeight);
                    var maxHeight = maxWidth * ratio;
                    if (maxHeight > 0.75 * window.innerHeight) {
                        maxHeight = 0.75 * window.innerHeight;
                        maxWidth = maxHeight / ratio;
                        console.log("1");
                    }
                    img.style.width = maxWidth + 'px';
                    img.style.height = maxHeight + 'px';
                    // console.log(maxWidth);
                    // console.log(maxHeight);
                    // console.log(img.style.width);
                    // console.log(img.style.height);
                    // console.log(window.innerWidth);
                    // console.log(window.innerHeight);
                    img.style.display = 'block';
                }


                var closeButton = document.createElement('button');
                closeButton.innerHTML = '×';
                closeButton.style.display = 'block';
                closeButton.style.width = 'auto';
                closeButton.style.height = "auto";
                closeButton.style.fontSize = "20px";
                closeButton.style.position = "fixed"; // 绝对页面位置
                closeButton.style.top = "20px"; // 距离页面顶部的距离
                closeButton.style.right = "17px"; // 距离页面右侧的距离
                closeButton.style.color = "#000";
                closeButton.style.textShadow = `
                        -1px -1px 0 #ffffff,
                        1px -1px 0 #ffffff,
                        -1px 1px 0 #ffffff,
                        1px 1px 0 #ffffff
                `

                closeButton.addEventListener('click', function() {
                    document.body.removeChild(imgPopup);
                });

                imgPopup.appendChild(img);
                imgPopup.appendChild(closeButton);
                document.body.appendChild(imgPopup);
            }
        });
	}
})();