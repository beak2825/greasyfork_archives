// ==UserScript==
// @name         萌娘百科增强
// @namespace    github.com/hmjz100
// @author       hmjz100
// @version      0.6
// @description  自用脚本，萌娘百科更换主题为紫色，黑幕转淡紫幕，链接与选中文本变紫色
// @license      MIT
// @match        http*://*.moegirl.org/*
// @match        http*://*.moegirl.org/*
// @match        http*://*.moegirl.org.cn/*
// @match        http*://*.moegirl.org.cn/*
// @grant        GM_addStyle
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFaIVgxWhFdgAAAAAAAAAAAAAAAAAgAACFKEU4BWhFXcAAAAAAAAAAAAAAAAAAAAAFKMUMheiFzcAmQAFAAAAABWhFbUVoRXuAAAAAAAAAAAAAAAAAAAAABWhFd4VoRXLAAAAAAAAAAAUoRQmFaEV8Bi5GP8YuBj/FaIV/xSgFDMVoRWdFaEV7AAAAAAAAAAAAAAAAAAAAAAWoRaYFqEW+QCqAAMA/wABFaIV3RalFv8UnxRaFqAWUxWhFekVoRXvFaEVnhWhFf4VoBWEFqEWghWhFYcWoRZ1FKIUiRWiFf8UpxQaFKAUMxezF/8WoBZTAAAAAAAAAAAUoxQyF60X/xWhFdcVoxX/F64X/xeuF/8Xshf/FaUV/xWhFZIVoxX/FKIUNBWgFWEWqxb/EqASKyCfIAgAAAAAIJ8gCBWhFfgVoRX+FaEV+g+lDxEAAAAAAAAAAAAAAAATnxM1F60X/xSiFE0UoRRkFqYW/xWhFf8WqBb/FaEV6RWfFRgVoRXcFaEV/hWhFf0VoRViFKMUThWhFVcToRM2GZwZHxanFv8UoxRkFaEVYhaoFv8VoBWcFaAVkxShFH8QnxAQFaAV6BWhFdsVoRX7FqsW/xarFv8XtRf/FaEV3xWfFRgVoRX9FaEVbRajFkUXshf/EpoSKwAAAAAAAAAAGpkaChWlFf8VoBWyFqcW/xagFlMNoQ0TF6IXFgCqAAMUoxQZF60X/xWgFWEasxoKFqoW/hanFtAXlxcWEI8QEBWgFYMXsRf/FqIWXRarFv8UohRYAAAAAAAAAAAPpQ8RFaEVtRevF/8WoBYjAAAAABe5F1cazBr/GcAZ/xeyF/8Xsxf/FaEVkACqAAMWpxb/F7AX/xWhFeYVoRXrF7AX/xi8GP8UoRR/AAAAAAAAAAAAAAAAF8EXIRm5GXEXsxeDF7MX8ROzExsAAAAAFaAVVhWgFZMVoRX/FaAV5RagFnYTnxMoAAAAAAAAAAAAAAAAAKoAAwAAAAAAAAAAG9IbOR3hHf8XvBdMAEAABAAAAAAAAAAAFqkWxxanFtoAAAAAAAAAAACAAAIAAAABH/gfsyD7IP8f7h//Huke+x3hHfYe5h7/HNgc/hvQG/0ayxr9GsUa+hnEGf8Ytxj/F7IX9BeuF/0WqRb/FqUW+SD/IGcg/CCmIPkgoSD1IKEh/CH/H/Af5B/lH54d3h2hHdkdoBvRG6EbzhuoHNoc/xnDGdAYuhigGLMYoRauFpoAAAAAAAAAAAAAAAAAAAAAIf4hyyD/IG4AAAAAAAAAAAAAAAAAAAAAAAAAABzcHOAd3x1HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @require      https://unpkg.com/jquery@3.6.3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/458894/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/458894/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function moegirl() {
	let colored = false
	var base = {
		// 动态添加样式
		addStyle(id, tag, css, element, position) {
			tag = tag || 'style';
			element = element || 'body';
			let styleDom = document.getElementById(id);
			if (styleDom) styleDom.remove();
			let style = document.createElement(tag);
			style.rel = 'stylesheet';
			style.id = id;
			tag === 'style' ? style.innerHTML = css : style.href = css;
			if (position === "before") {
				$(element).prepend($(style));
			} else {
				$(element).append($(style));
			}
		},

		hexToRgba(hex) {
			// 去掉 # 号
			hex = hex.replace(/^#/, '');
			// 如果是四位十六进制颜色值，转换为八位
			if (hex.length === 4) {
				hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
			}
			// 解析 RGB 分量
			var r = parseInt(hex.substring(0, 2), 16);
			var g = parseInt(hex.substring(2, 4), 16);
			var b = parseInt(hex.substring(4, 6), 16);
			var a = '';
			// 如果是八位十六进制颜色值，解析 alpha 通道
			if (hex.length === 8) {
				var a = 1;
				a = parseInt(hex.substring(6, 8), 16) / 255; // 将 alpha 值转换为 0 到 1 之间的小数
				a = ',' + a
			}
			// 返回 rgba 格式字符串
			return r + ', ' + g + ', ' + b + a;
		},

		replaceColors(cssText, baseURI, type, colorMap) {
			if (!cssText) return '';
			if (type === 'other') {
				// 遍历颜色映射数组，将旧颜色替换为新颜色，并添加过渡效果
				colorMap.forEach(function (colorPair) {
					var oldColor = colorPair[0];
					var newColor = colorPair[1];
					// 判断新颜色是否为 color
					cssText = cssText.replace(new RegExp(oldColor, 'ig'), newColor);
				});
				return cssText;
			}
			if (colorMap) {
				// 遍历颜色映射数组，将旧颜色替换为新颜色，并添加过渡效果
				colorMap.forEach(function (colorPair) {
					var oldColor = colorPair[0];
					var newColor = colorPair[1];
					// 判断新颜色是否为 color
					if (oldColor.includes("#")) {
						cssText = cssText.replace(new RegExp(oldColor + '(.*?)}', 'ig'), newColor + '$1; ' + 'transition: all 0.1s ease;}');
					} else {
						cssText = cssText.replace(new RegExp(oldColor, 'ig'), newColor);
					}
				});
			};
			if (baseURI) {
				// 替换相对路径资源为绝对路径
				cssText = cssText.replace(/url\((?!['"]?(?:data|https?):)['"]?([^'"\)]*)['"]?\)/ig, function (match, p1) {
					// 如果URL是相对路径，则将其转换为绝对路径
					var absoluteURL = new URL(p1, baseURI).href;
					return 'url(' + absoluteURL + ')';
				});
			};
			return cssText;
		},

		setColors(colorMap, type) {
			let cssText
			document.querySelectorAll('link[rel="stylesheet"]').forEach(function (tag) {
				if (!tag.parentElement) return;
				// 对于link标签，异步获取其CSS内容
				fetch(tag.href)
					.then(response => response.text())
					.then(responseText => {
						let id = 'Moegirl-Replace-Color-' + tag.href
						// 替换颜色并添加样式
						cssText = base.replaceColors(responseText, tag.href, type, colorMap);
						if (responseText === base.replaceColors(responseText, '', type, colorMap)) return;
						let newStyle = document.createElement('style');
						newStyle.id = id;
						newStyle.textContent = responseText;
						if (location.pathname.includes("youth/pan")) {
							base.addStyle(id, 'style', cssText, 'body', "before");
							tag.remove()
						} else {
							base.addStyle(id, 'style', cssText, tag.parentElement.tagName || 'body');
						}
						console.log(`【（改）网盘直链下载助手】UI\n修改 <link> 元素 转 <style> 元素 样式\n元素：`, tag, `\n样式：`, newStyle);
					});
			})
			document.querySelectorAll('[id^="Moegirl-Replace-Color-"]').forEach(function (tag) {
				if (!tag.parentElement) return;
				let id = tag.id;
				let parent = tag.parentElement;
				let element = parent.tagName || 'head';
				// 替换颜色并添加样式
				if (
					tag.innerText === base.replaceColors(tag.innerText, '', type, colorMap)
				) return;
				cssText = base.replaceColors(tag.innerText, '', type, colorMap);
				let newStyle = document.createElement('style');
				newStyle.id = id;
				newStyle.textContent = cssText;
				base.addStyle(id, 'style', cssText, element);
				console.log(`【（改）网盘直链下载助手】UI\n修改 Moegirl-Replace-Color <style> 元素 样式\n元素：`, tag, `\n样式：`, newStyle);
			});
			let count = 0;
			if (!colored) {
				base.waitForKeyElements('style', function (tag) {
					tag = tag[0]
					if (!tag.parentElement) return;
					let id = tag.id;
					let parent = tag.parentElement;
					let element = parent.tagName || 'head';
					// 替换颜色并添加样式
					if (
						id.includes('Moegirl-Replace-Color') ||
						id.includes('swal-pub') ||
						tag.innerText === base.replaceColors(tag.innerText, '', type, colorMap)
					) return;
					id = id ? id : `Moegirl-Replace-Color-${count++}`
					cssText = base.replaceColors(tag.innerText, '', type, colorMap);
					tag.id = id;
					tag.textContent = cssText;
					console.log(`【（改）网盘直链下载助手】UI\n修改 <style> 元素 样式\n元素：`, tag/*, `\n样式：`, newStyle*/);
				})
				colored = true;
			}
		},
		waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
			var targetbadges, btargetsFound;

			if (typeof iframeSelector == "undefined")
				targetbadges = $(selectorTxt);
			else
				targetbadges = $(iframeSelector).contents().find(selectorTxt);

			if (targetbadges && targetbadges.length > 0) {
				btargetsFound = true;
				targetbadges.each(function () {
					var jThis = $(this);
					var alreadyFound = jThis.data('alreadyFound') || false;
					if (!alreadyFound) {
						var cancelFound = actionFunction(jThis);
						if (cancelFound) {
							btargetsFound = false;
						} else {
							jThis.data('alreadyFound', true);
						}
					}
				});
			} else {
				btargetsFound = false;
			}

			var controlObj = base.waitForKeyElements.controlObj || {};
			var controlKey = selectorTxt.replace(/[^\w]/g, "_");
			var timeControl = controlObj[controlKey];

			if (btargetsFound && bWaitOnce && timeControl) {
				clearInterval(timeControl);
				delete controlObj[controlKey];
			} else {
				if (!timeControl) {
					timeControl = setInterval(function () {
						base.waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
					}, 1);
					controlObj[controlKey] = timeControl;
				}
			}

			base.waitForKeyElements.controlObj = controlObj;
		}
	}
	base.setColors([
		['#0645ad', `#574AB8`],
		['#228B22', `#574AB8`],
		['#23a55e', `#574AB8`],
		['#0c0', `#574AB8`],
		['#DEEDE0', `#DDDCEF`],
		['#73B839', `#574AB8D0`],
		['#0b0080', `#7367F0`],
		['#252525', `#ffffff`],
		['#0074F9', `#574AB8`],
		['#2bd155', `#7367F0`],
		['#18a058', `#574AB8`],
		['#36ad6a', `#574AB8`],
		['#a7d7f9', `#574AB8D0`],
		['#219e40', `#574AB8D0`],
		['lightblue', `#ffffffD0`],
		['MediumSeaGreen', `#574AB8D0`],
		['green', `#574AB8`],
		['#36c', `#574AB8`],
		['#447ff5', `#7367F0`],
		['#2a4b8d', `#574AB8D0`],
		['#eaf3ff', `#DDDCEF`],
		['37, 180, 73', base.hexToRgba(`#574AB8`)],
		['62, 201, 97', base.hexToRgba(`#7367F0`)],
		['70, 179, 84', base.hexToRgba(`#574AB8D0`)],
		['35, 165, 94', base.hexToRgba(`#574AB8`)],
		['167 215 249', base.hexToRgba(`#574AB8D0`)],
		['235,249,234', base.hexToRgba(`#DDDCEF`)],
		['225, 240, 230', base.hexToRgba(`#DDDCEF`)],
		['0,200,0,0.1', base.hexToRgba(`#DDDCEF`)],
		['163,270,71,0.1', base.hexToRgba(`#574AB81A`)],
		['24, 160, 88, .16', base.hexToRgba(`#574AB830`)],
	], 'other')
	base.waitForKeyElements('a[href]', function (element) {
		element.off('mousemove');
		element.off('mouseover');
		element[0].removeEventListener('mousemove');
		element[0].removeEventListener('mouseover');
	})
	base.waitForKeyElements('[data-name="legacy"]', function (element) {
		element.click()
	})
	base.waitForKeyElements('body.sideBarPic-executed.show-logo:not(.DeceasedPerson) #mw-panel #p-logo .mw-wiki-logo', function (element) {
		element.removeAttr("style")
	})
	base.waitForKeyElements('[title*="你知道的太多了"][class]', function (element) {
		element.removeAttr("title")
	})
	base.waitForKeyElements('del, [style="text-decoration: line-through;"], .just-kidding-text', function (element) {
		element.css({ "text-decoration-thickness": "0.1px" })
	})
	base.waitForKeyElements('span[style*="background:"][style*="color:"]', function (element) {
		element.addClass("heibox")
	})
	base.waitForKeyElements('.hover-change', function (element) {
		element.attr("style", "padding-bottom:10px")
		element.children().attr("class", "")
		element.children().attr("style", "")
	})
	base.waitForKeyElements('.n-message-container.n-message-container--top .n-message-wrapper .n-message', function (element) {
		if (element.find('.n-message__content .items-center').text().includes("订阅萌娘百科推送服务")) {
			element.parent().toggle()
			element.find('button.n-base-close[aria-label="close"]').click()
		}
	})
	base.waitForKeyElements('aside#moe-global-siderail div.inner-wrapper div.moe-siderail-sticky', function (element) {
		var timebar = $(`
		<div class="moe-card" id="moe-siderail-sitenotice">
		<div class="moe-wikitext-output"><h3 id="moegirlGreeting" style="margin-top: 0px;">你好呀</h3></div>
			<ul style="text-align:center">
				<li>感谢您使用本脚本，现在是</li>
				<li><a id="moegirlTime"></a></li>
			</ul>
		</div>`);
		element.prepend(timebar)
		window.setInterval(function () {
			timebar.find("#moegirlTime").text(Time());
			timebar.find("#moegirlGreeting").text(Greeting());
		}, 500);
	})
	base.waitForKeyElements('#localNotice[lang="zh"] .mw-parser-output', function (element) {
		var timebar = $(`<div><a id="moegirlGreeting"></a> ，现在是 <a id="moegirlTime"></a> 感谢您使用本脚本~</div>`);
		element.prepend(timebar)
		window.setInterval(function () {
			timebar.find("#moegirlTime").text(Time());
			timebar.find("#moegirlGreeting").text(Greeting());
		}, 500);
	})
	let heimu = `
	.heibox {
		background-color: #574AB8D0;
		color: #fffffff0;
		padding: 0 5px;
		margin: 0 5px;
		cursor: default;
		border-radius: 5px;
		transition: all 0.13s linear;
	}
	.heimu, .heimu rt {
		background-color: #574AB8D0;
		color: #fffffff0;
		padding: 0 5px;
		margin: 0 5px;
		cursor: default;
		border-radius: 5px;
		transition: all 0.13s linear;
	}
	span.heimu:hover, span.heimu:active {
		background-color: #7367F0;
		color: #ffffff;
	}
		
	.mw-parser-output .hovers-blur {
		filter: blur(0.5px);
	}
	`;
	base.addStyle("Moegirl-Replace-Color", "style", heimu)

	function Time() {
		function repair(i) {
			if (i >= 0 && i <= 9) {
				return "0" + i;
			} else {
				return i;
			}
		}
		var date = new Date();
		var year = date.getFullYear();
		var month = repair(date.getMonth() + 1);
		var day = repair(date.getDate());
		var hours = repair(date.getHours() >= 12 ? date.getHours() - 12 : date.getHours());
		var apm = date.getHours() >= 12 ? "下午 " : "上午 ";
		var minute = repair(date.getMinutes());
		var second = repair(date.getSeconds());

		var curTime = year + "年 " + month + "月 " + day + "日 " + apm + hours + "时 : " + minute + "分 : " + second + "秒";
		return curTime;
	}

	function Greeting() {
		var date = new Date();
		var hour = date.getHours();
		var greeting = '';

		if (hour >= 0 && hour <= 10) {
			greeting = '早上好';
		} else if (hour > 10 && hour <= 14) {
			greeting = '中午好';
		} else if (hour > 14 && hour <= 18) {
			greeting = '下午好';
		} else if (hour > 18 && hour <= 24) {
			greeting = '晚上好';
		}
		return greeting;
	}
})();