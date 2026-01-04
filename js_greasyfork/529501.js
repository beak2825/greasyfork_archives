// ==UserScript==
// @name          Discourse 助手
// @namespace     github.com/hmjz100
// @version       1.0.7.9
// @author        Hmjz100
// @description   重构“linuxdo 增强插件”，再次以脚本方式为您呈现！界面更优美，设计更精髓！
// @license       AGPL-3.0-or-later
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEl0lEQVRYw72Xe0yVZRzHv8SdUhk2FYGOnLwsQKYjZ5epZQPsQirOUWbFvJXmpWmWNXG6rFjkYGVmMkomTkzlAIdL4H3VzHSWy+a0ieQllRREBQ+Xcz79cY5LD+/hqj3bb2d7n+d9Pp/n977neX6v1PkWKClZUp6kE5JaJOEKh6TTknZIel1SsO5ii5C0QdLF24AdRa2kXEnmnsIzJDV3AewerZLWdAdsknSoB2D3OOTKZKfaY5JqOprUS8JbXl2R+FtSTEfwwZKueprk0YD7WRQ8gI39zZSGD6XCNIz8CDMr+g4kPqAP3rqvI4mLksI9wf0kHTe6Mco/kJwBkZw0x3J+ZAw1Y4ZQlxBB/fPhNE4ZhG2imevPRLI/KpQJ/v6deRyGbZ3RDUm9gvltUAzV0cO5kBBJ/dRQGt6OxfbVFFr2LsN+MgtH1Rc4fk+HkvmwMpH04f07kljhDo/xBD8eGUtVXBS1yWHceGMYTcULoGEb8D1QDpS6osx1rQwuZlP4bgL+ngVuShp4u4DFfZDJ14+DpmiqRkRRN2UgDe+Nxn4uG6gAezE0FRhHs8UlVMn7WSntZeHLW/BQSTb3ARn9Iqh+JJZ/XgynYdloHLV5ztV5AruHw0p1az6Bi55tb7N6QJLmuneG+vhy2BTNuacGc2OmGfuptc50dxZ+K7Ay41g6mjDZk8QLklTm3pHSO4TqYbFcTgrFlvuqM+3Nlq4LOErYfCYd5XyCgiONBLLl2iDu6EgLCeNCXBTXUs3Yz24ASroObyoAu5Ujl9ai0lUoJc1I4KiMUrM8JIzLTz5M40fjnS9Ud1bfVACtxfxV9w3e1tlotcVI4LqhQFpIGPXjTDRtSXX+tboDdwmcvJKDtqegTUdRYLCRRFuBJcGh1I8ZROvepT0TsFvZfe5zlJ+MCs6gAUM6JzDGvzcX4iKx717SMwFKyTiWhrZMRwWXUb82L2K9oYC3vNhlCofc17ov0GyBliLiKl5C21ehTZeQf5A761d52qmm+femceHTQBG0FHZr9flVa1DeWFS6B63ea8RZ51EgSF788XgknP8aHMVdfva11/MJK5qEtsxGu0DJ7xhxEj0KRMmHujnjoGVH1zLgsGK7uY0ndqaivHhUcgRtPI+CerkzalyFrrHA9IBAqPzgzneg2WK8JzRboLUYKOXElW+JKX8Z5Y1HlhJUARr/ihEj49ZhZCjw6SgzNOY7099a5Pxt3gpN+eAo+u8YdpRAazGn63KZf2gxvt/Fo82TUeF+tBOU+rHR/Nck9W1X4EDmDGAfYOVP22ZWnsok9oc1DNmXSdLPi5nzyzzmHJxLyo+zGFE+Fe+t8SgvGW1fjyquIito4kJPh9DS22uBNgP6Bvhx8KfPyDiwjrHrP0SL3kRTZ6Gx09BzC1DWNlRciaxlyFqISipR+WG00+YEpxWhoaM8wfe4V0NtBvn4eOMX0gfJx3gS7yA0MglNWobmZaO3ctDMLJQwC5mi2ytCTkl6sEOBexRVkh4yKkb/D/geSf08VcP3EtwgaXlHHyP3AnxWUmZ7q77bAjWSjrj29kRJvp39DvwXHVKWNlLwEiAAAAAASUVORK5CYII=
// @match         *://linux.do/*
// @match         *://cdn.linux.do/*
// @connect       www.bing.com
// @require       https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require       https://unpkg.com/pangu@4.0.7/dist/browser/pangu.js
// @require       https://unpkg.com/marked@15.0.7/marked.min.js
// @require       https://unpkg.com/katex@0.16.21/dist/katex.min.js
// @grant         GM_xmlhttpRequest
// @grant         GM.xmlhttpRequest
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_info
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/529501/Discourse%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529501/Discourse%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function DiscourseHelper() {
	// 严格模式，确保代码安全执行，不越界
	'use strict';

	/*
	防止代码因其他原因被执行多次
	代码出自 “Via 轻插件”，作者谷花泰
	*/
	let key = encodeURIComponent('LinkSwift:主代码');
	if (window[key]) return;
	window[key] = true;

	let mount = idontknow("DiscourseHelper")
	let runtimeInfo = GM_info, meaninglessCache = new Map();

	// 根基函数
	let base = {
		initDefaultConfig() {
			let defaultSettings = {
				addNaviStateTab: "true",
				hideRepliesColumn: "false",
				hideViewsColumn: "false",
				hideActivityColumn: "false",
				showTopicCreatedTime: "true",
				topicNewTab: "false",
				previewTopic: "true",
				topicFloorIndicator: "true",
				autoHeight: "false",
				expandReply: "false",
				foldUselessReply: "true",
				foldUselessReplyOpacity: "true",
				replaceEmoji: "noto",
				replaceTheme: "false",
				replaceBackground: "bing",
				replaceFont: "false",
				replaceFontName: "MiSans",
				replaceFontStyle: "https://unpkg.com/misans@4.0.0/lib/Normal/MiSans-Medium.min.css",
				optimizeBiliPlayer: "true",
				optimizeBiliPlayerMobile: "true",
				optimizePageText: "false",
				newTabIndicator: "true",
				a11yCloseButton: "true",
				optimizeEditorButton: "true",
				japaneseEditorButton: "false",
				filterByOP: "true",
				filterBySelf: "true",
				autoReader: "false",
				autoReaderSpeed: "2",
				autoReaderWait: "3",
				beautifyLoading: "false",
				cdnAvatarReplace: "false",
			};

			for (let key in defaultSettings) {
				if (!GM_getValue(key)) {
					GM_setValue(key, defaultSettings[key].toString());
				}
			}
		},
		displaySettings() {
			let timer = null
			let helperSettings = $(`<div id="dialog-holder" class="dialog-container">
				<style>
					#dialog-holder:not([aria-hidden="true"]){position:fixed;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content{max-height:97%;max-width:95%;min-height:auto;min-width:auto;display:flex;flex-direction:column}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content a{margin:0}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-header{justify-content:space-between}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-header > .title{font-size:var(--font-up-3);font-weight:600}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-header > .date{color:#666;font-family:serif}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body{max-height:none;max-width:none;margin:0;width:calc(100% - 2em)}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body label{display:flex;justify-content:space-between;padding:10px;align-items:center;text-align:left;transition:background 0.2s ease}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body label.button{cursor:pointer;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body label:hover{background:rgba(var(--primary-rgb), 0.1)}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body .controls select,
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body .controls textarea,
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body .controls input[type="text"],
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body .controls input[type="number"] {
						padding: 5px;
						width: 100%;
						min-width: 110px;
						max-width: 220px;
					}

					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-footer{display:flex;justify-content:space-between;bottom:0;background-color:var(--secondary);position:sticky}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-footer .btn{margin:0 0 var(--btn-bottom-margin) 1em}
				</style>
				<div class="dialog-overlay"></div>
				<div class="dialog-content form-vertical">
					<div class="dialog-header">
						<span class="title">设置</span>
						<span class="date">/</span>
					</div>
					<div class="dialog-body control-group">
						<div class="controls">
							<label>
								<span>主页 - 话题导航栏增加状态筛选 Tab<br/><small>可以筛选出被“关注”“追踪”“免打扰”的话题</small></span>
								<input type="checkbox" data-setting="addNaviStateTab">
							</label>
							<label>
								<span>话题 - 列表隐藏“回复”<br/><small>隐藏回复数量</small></span>
								<input type="checkbox" data-setting="hideRepliesColumn">
							</label>
							<label>
								<span>话题 - 列表隐藏“浏览量”<br/><small>隐藏浏览量</small></span>
								<input type="checkbox" data-setting="hideViewsColumn">
							</label>
							<label>
								<span>话题 - 列表隐藏“活动”<br/><small>隐藏时间</small></span>
								<input type="checkbox" data-setting="hideActivityColumn">
							</label>
							<label>
								<span>话题 - 列表“活动”列添加创建时间<br/><small>同时还会标注坟贴</small></span>
								<input type="checkbox" data-parent-setting="hideActivityColumn,false" data-setting="showTopicCreatedTime">
							</label>
							<label>
								<span>帖子 - 在新标签页中打开链接<br/><small>仅适用于站内的“话题”、“类别”链接</small></span>
								<input type="checkbox" data-setting="topicNewTab">
							</label>
							<label>
								<span>帖子 -“预览”按钮<br/><small>通过弹窗预览话题前 20 条帖子<br/>按钮图标为“<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#eye"></use></svg>”，通常出现于话题标题或者链接附近</small></span>
								<input type="checkbox" data-setting="previewTopic">
							</label>
							<label>
								<span>帖子 -“楼层”显示<br/><small>会出现在帖子时间的右侧</small></span>
								<input type="checkbox" data-setting="topicFloorIndicator">
							</label>
							<label>
								<span>帖子 - 限高<br/><small>限制帖子内容的高度，超出则独立显示滚动条</small></span>
								<input type="checkbox" data-setting="autoHeight">
							</label>
							<label>
								<span>帖子 - 展开回复<br/><small>不建议启用，开启后可能会导致无法保存编辑后的评论<br/>自动展开帖子回复列表</small></span>
								<input type="checkbox" data-setting="expandReply">
							</label>
							<label class="checkbox-label">
								<span>帖子 - 折叠无用内容<br/><small>通过正则识别自动折叠缩小无用帖子<br/>正则规则及部分代码来源于“<a href="https://linux.do/t/topic/481756/" target="_blank">LinuxDo 量子速读</a>”</small></span>
								<input type="checkbox" data-setting="foldUselessReply">
							</label>
							<label class="checkbox-label">
								<span>帖子 - 折叠后透明<br/><small>将折叠后的帖子内容变为半透明</small></span>
								<input type="checkbox" data-parent-setting="foldUselessReply,true" data-setting="foldUselessReplyOpacity">
							</label>
							<label>
								<span>页面 - 表情替换<br/><small>切换 Emoji 表情的风格</small></span>
								<select data-setting="replaceEmoji">
									<option value="false">关闭</option>
									<option value="system">替换回字符（不建议）</option>
									<option value="unicode">通用 Unicode</option>
									<option value="noto">谷歌（Noto Emoji）</option>
									<option value="fluentui">微软（FluentUI）</option>
									<option value="twemoji">推特（Twitter Emoji）</option>
									<option value="openmoji">OpenMoji</option>
								</select>
							</label>
							<label>
								<span>页面 - 字体替换<br/><small>替换页面字体，楼层除外</small></span>
								<input type="checkbox" data-setting="replaceFont">
							</label>
							<label>
								<span>功能 - 字体替换 - 样式名称<br/><small>字体名称</small></span>
								<input type="text" data-parent-setting="replaceFont,true" data-setting="replaceFontName">
							</label>
							<label>
								<span>功能 - 字体替换 - 样式地址<br/><small>以 <code>http</code> 开头的样式文件链接</small></span>
								<input type="text" data-parent-setting="replaceFont,true" data-setting="replaceFontStyle">
							</label>
							<label>
								<span>页面 - 主题替换<br/><small>切换论坛界面主题风格<br/>主题均已经过额外的界面优化</small></span>
								<select data-setting="replaceTheme">
									<option value="false">关闭</option>
									<option value="custom">自定义背景</option>
									<option value="discourse">Discourse Meta (meta.discourse.org)</option>
									<option value="openai">OpenAI 开发者社区 (community.openai.com)</option>
									<option value="docker">Docker 社区 (forums.docker.com)</option>
									<option value="huggingface">HuggingFace 社区 (discuss.huggingface.co)</option>
									<option value="ubuntu">Ubuntu 社区 (discourse.ubuntu.com)</option>
									<option value="googleaidevs">Google AI 开发者社区 (discuss.ai.google.dev)</option>
									<option value="googleaidevs_old">Google AI 开发者社区旧版 (discuss.ai.google.dev)</option>
									<option value="unity">Unity 社区 (discussions.unity.com)</option>
									<option value="godot">Godot 社区 (forum.godotengine.org)</option>
									<option value="ksec">KSEC 安全社区 (forum.ksec.co.uk)</option>
								</select>
							</label>
							<label>
								<span>页面 - 背景替换<br/><small>输入 <code>http</code> 或 <code>data</code> 开头的图片链接<br/>或者输入 <code>bing</code> 使用必应每日壁纸</small></span>
								<input type="text" data-parent-setting="replaceTheme,custom" data-setting="replaceBackground">
							</label>
							<label>
								<span>页面 - 优化哔哩内嵌<br/><small>关闭自动播放，隐藏推荐视频</small></span>
								<input type="checkbox" data-setting="optimizeBiliPlayer">
							</label>
							<label>
								<span>功能 - 优化哔哩内嵌 - 替换为移动版播放器<br/><small>播放器更精简，支持触控/字幕，添加跳转原视频按钮<br/>点击播放器还不会跳转到视频页面</small></span>
								<input type="checkbox" data-parent-setting="optimizeBiliPlayer,true" data-setting="optimizeBiliPlayerMobile">
							</label>
							<label>
								<span>页面 - 文本排印优化<br/><small>使用“<a title="又称 Pangu.js" href="https://github.com/vinta/pangu.js/" target="_blank">為什麼你們就是不能加個空格呢？</a>”自动为文本加入空格<br/>不建议启用，可能导致性能问题</small></span>
								<input type="checkbox" data-setting="optimizePageText">
							</label>
							<label>
								<span>页面 -“新标签页”指示<br/><small>为可以于新标签页打开的链接增加箭头指示</small></span>
								<input type="checkbox" data-setting="newTabIndicator">
							</label>
							<label>
								<span>编辑 -“关闭”按钮<br/><small>把关闭的文本变成实体按钮</small></span>
								<input type="checkbox" data-setting="a11yCloseButton">
							</label>
							<label>
								<span>编辑 -“排印优化”按钮<br/><small>部分浏览器优化后会无法撤回</small></span>
								<input type="checkbox" data-setting="optimizeEditorButton">
							</label>
							<label>
								<span>编辑 -“日语优化”按钮<br/><small>部分浏览器优化后会无法撤回</small></span>
								<input type="checkbox" data-setting="japaneseEditorButton">
							</label>
							<label>
								<span>菜单 - 只看题主<br/><small>在浏览帖子时会在右下菜单显示此按钮<br/>如果话题帖子较多，则可能会导致浏览器卡顿</small></span>
								<input type="checkbox" data-setting="filterByOP">
							</label>
							<label>
								<span>菜单 - 只看自己<br/><small>在浏览帖子时会在右下菜单显示此按钮<br/>如果话题帖子较多，则可能会导致浏览器卡顿</small></span>
								<input type="checkbox" data-setting="filterBySelf">
							</label>
							<label>
								<span>菜单 - 自动滚动<br/><small>启用后可通过右下菜单中的按钮控制页面自动滚动状态</small></span>
								<input type="checkbox" data-setting="autoReader">
							</label>
							<label>
								<span>功能 - 自动滚动 - 速度<br/><small>滚动的速度</small></span>
								<input type="number" min="1" step="1" data-parent-setting="autoReader,true" data-setting="autoReaderSpeed">
							</label>
							<label>
								<span>功能 - 自动滚动 - 等待<br/><small>滚动到底部后要等待几秒再停止</small></span>
								<input type="number" min="2" data-parent-setting="autoReader,true" data-setting="autoReaderWait">
							</label>
						</div>
						<hr>
						<blockquote>
						<div>风雨送春归，飞雪迎春到。已是悬崖百丈冰，犹有花枝俏。</div>
						<div>俏也不争春，只把春来报。待到山花烂漫时，她在丛中笑。</div>
						</blockquote>
						<div align="center">
							<label class="button" id="author">
								<span>助手作者<br/><small>${runtimeInfo?.script?.author}</small></span>
							</label>
							<label class="button" id="name">
								<span>助手名称<br/><small>${runtimeInfo?.script?.name}</small></span>
							</label>
							<label class="button" id="version">
								<span>助手版本<br/><small>${runtimeInfo?.script?.version}</small></span>
							</label>
							<label class="button" id="handlerName">
								<span>管理器名称<br/><small>${runtimeInfo?.scriptHandler}</small></span>
							</label>
							<label class="button" id="handlerVersion">
								<span>管理器版本<br/><small>${runtimeInfo?.version}</small></span>
							</label>
						</div>
						<hr class="debug" style="display: none;">
						<div class="controls debug" style="display: none;">
							<label>
								<span><svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#flask"></use></svg> 页面 - 美化加载动画<br/><small>更改加载动画圆点为六个</small></span>
								<input type="checkbox" data-setting="beautifyLoading">
							</label>
							<label>
								<span><svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#flask"></use></svg> 功能 - CDN 头像替换<br/><small>将使用 CDN 的头像链接替换为原站链接<br/>若仍然无法访问，那么将会替换为 OpenAI 风格字符头像</small></span>
								<input type="checkbox" data-setting="cdnAvatarReplace">
							</label>
						</div>
						<div class="debug" align="center" style="display: none;">
							<button id="previewDebug" class="btn btn-icon-text" type="button">
								<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#bug"></use></svg>
								<span class="d-button-label">预览模式</span>
							</button>
							<button id="symbolDebug" class="btn btn-icon-text" type="button">
								<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#bug"></use></svg>
								<span class="d-button-label">符号图标</span>
							</button>
						</div>
					</div>
					<div class="dialog-footer">
						<span style="color: var(--primary-high);">刷新后生效</span>
						<div>
							<button id="refreshButton" class="btn btn-icon-text" type="button">
								<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#arrows-rotate"></use></svg>
								<span class="d-button-label">刷新</span>
							</button>
							<button id="closeButton" class="btn btn-icon-text btn-primary" type="button">
								<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#xmark"></use></svg>
								<span class="d-button-label">关闭</span>
							</button>
						</div>
					</div>
				</div>
			</div>`)
			helperSettings.find("#closeButton").on("click", (event) => {
				if (timer) clearInterval(timer)
				helperSettings.remove()
			})
			helperSettings.find("#refreshButton").on("click", (event) => {
				base.showToast("刷新中...", 10000);
				location.reload();
			})

			let clickCount = 0;
			helperSettings.find("#version").on("click", (event) => {
				let stepsRemaining = 5 - clickCount;
				if (stepsRemaining > 0) {
					base.showToast(`你现在只需再执行 ${stepsRemaining} 步操作即可进入开发者模式。`);
				} else {
					base.showToast("您现在处于开发者模式！");
					helperSettings.find(".debug").show();
				}
				clickCount++;
			});
			helperSettings.find("#symbolDebug").on("click", (event) => {
				let symbols = Array.from(document.querySelectorAll('symbol'));
				if (symbols.length === 0) {
					base.showToast("未找到 Symbol 元素");
					return;
				}
				let seenIds = new Set();
				symbols = symbols.filter(symbol => {
					if (!symbol.id) return true;
					if (seenIds.has(symbol.id)) return false;
					seenIds.add(symbol.id);
					return true;
				});

				let newDoc = document.implementation.createHTMLDocument('Symbol 预览器');
				newDoc.head.innerHTML = document.head.innerHTML;
				newDoc.title = "Symbol 预览器";

				let styleTag = newDoc.createElement('style');
				styleTag.textContent = `
					body {
						margin: 20px;
						padding: 20px;
						background-color: #2d303e;
						font-family: Arial, sans-serif;
						color: #fff;
					}
					.symbol-container {
						display: grid;
						grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
						gap: 40px;
						align-items: center;
						justify-items: center;
					}
					.symbol-wrapper {
						text-align: center;
					}
					.symbol-svg {
						width: 80px;
						height: 80px;
						fill: #2d303e;
						background-color: #bd93f9;
						padding: 10px;
						box-sizing: border-box;
					}
					.symbol-label {
						margin-top: 5px;
						font-size: 12px;
					}
				`;
				newDoc.head.appendChild(styleTag);

				let body = $(newDoc.body);
				let container = $('<div>').addClass('symbol-container');
				symbols.forEach((symbol, index) => {
					let id = symbol.id || `symbol-auto-${index}`;
					symbol.setAttribute('id', id);
					let $svg = $(`<svg id="${id}" class="symbol-svg"></svg>`);
					if (symbol.hasAttribute('viewBox')) {
						$svg.attr('viewBox', symbol.getAttribute('viewBox'));
					}
					let content = symbol.cloneNode(true);
					while (content.firstChild) {
						$svg.append(content.firstChild);
					}
					let $wrapper = $('<div>').addClass('symbol-wrapper');
					let $label = $('<div>').addClass('symbol-label').text(id);
					$wrapper.append($svg).append($label);
					container.append($wrapper);
				});
				body.append(container);

				let previewWindow = window.open('', '_blank');
				previewWindow.document.write(newDoc.documentElement.outerHTML);
				previewWindow.document.close();
			});
			helperSettings.find("#previewDebug").on("click", (event) => {
				base.showToast("进入预览模式！通知类元素将被删除！数字类数据将被替换！");
				setInterval(() => {
					$("[href='#circle']").each(function () {
						$(this).parent().remove()
					})
					$(".chat-channel-unread-indicator, .show-more.has-topics, .topic-post-badges").each(function () {
						$(this).remove()
					})
					$(".nav-item_new > a").text("新")
					$(".nav-item_unread > a").text("未读")
					$(".heatmap-high").text("/").removeClass("heatmap-high")
					$(".heatmap-med").text("/").removeClass("heatmap-med")
					$(".topic-list-data.age").text("/")
					$(".num:not(.sortable)").text("/")
				}, 1000)
				if (timer) clearInterval(timer)
				helperSettings.remove()
			})

			function checkParentSettings() {
				helperSettings.find(".controls [data-parent-setting]").each(function () {
					let parentSetting = $(this).data("parent-setting");
					let [parentKey, expectedValue] = parentSetting.split(",");
					if (GM_getValue(parentKey) === expectedValue) {
						$(this).closest("label").show();
					} else {
						$(this).closest("label").hide();
					}
				});
			}
			checkParentSettings();

			helperSettings.find(".controls input[type='checkbox']").each(function () {
				let settingKey = $(this).data("setting");
				let settingValue = GM_getValue(settingKey);
				$(this).prop("checked", settingValue === true || settingValue === "true");
			});
			helperSettings.find(".controls select").each(function () {
				let settingKey = $(this).data("setting");
				let settingValue = GM_getValue(settingKey);
				$(this).val(settingValue);
			});
			helperSettings.find(".controls input[type='number']").each(function () {
				let settingKey = $(this).data("setting");
				let settingValue = GM_getValue(settingKey);
				if (settingValue !== undefined && settingValue !== null) {
					$(this).val(Number(settingValue));
				}
			});
			helperSettings.find(".controls input[type='text']").each(function () {
				let settingKey = $(this).data("setting");
				let settingValue = GM_getValue(settingKey);
				if (settingValue !== undefined && settingValue !== null) {
					$(this).val(settingValue);
				}
			});

			helperSettings.find(".controls input[type='checkbox']").on("change", function () {
				let settingKey = $(this).data("setting");
				let newValue = $(this).is(":checked");
				console.log(newValue)
				GM_setValue(settingKey, newValue.toString());
				checkParentSettings();
			});
			helperSettings.find(".controls select").on("change", function () {
				let settingKey = $(this).data("setting");
				let newValue = $(this).val();
				GM_setValue(settingKey, newValue.toString());
				checkParentSettings();
			});
			helperSettings.find(".controls input[type='number']").on("change", function () {
				let element = $(this);
				let settingKey = element.data("setting");
				let newValue = parseFloat(element.val());
				let minValue = parseFloat(element.attr("min"));
				let maxValue = parseFloat(element.attr("max"));

				if (!isNaN(newValue)) {
					if (minValue && newValue < minValue) newValue = minValue;
					if (maxValue && newValue > maxValue) newValue = maxValue;

					element.val(newValue);
					GM_setValue(settingKey, newValue.toString());
				} else {
					element.val(GM_getValue(settingKey));
				}
				checkParentSettings();
			});
			helperSettings.find(".controls input[type='text']").on("change", function () {
				let settingKey = $(this).data("setting");
				let newValue = $(this).val();
				GM_setValue(settingKey, newValue.toString());
				checkParentSettings();
			});

			timer = setInterval(() => {
				helperSettings.find(".dialog-content .dialog-header > .date").text(base.formatDate(Date.now()))
			}, 500)
			$(`html > .${mount}`).append(helperSettings)
		},
		xmlHttpRequest(option) {
			let request = (typeof GM_xmlhttpRequest !== "undefined") ? GM_xmlhttpRequest : GM.xmlHttpRequest;
			if (request && typeof request === 'function') {
				return request(option);
			}
		},
		get(url, headers, type, extra, maxRetries = 3, currentRetry = 0) {
			return new Promise((resolve, reject) => {
				let sendRequest = function () {
					let requestObj = base.xmlHttpRequest({
						method: "GET", url, headers,
						responseType: type || 'json',
						onload: function (res) {
							if (res.status === 204) {
								console.log('【DiscourseHelper】Get(load)\n\x1B[31m该请求已被某个下载工具捕获。' + (res.statusText ? ("\n\x1B[0m工具提示：\x1B[31m" + res.statusText) : "") + '\x1B[0m\n请求地址：' + url + '\n请求头部：', headers, '\n请求结果：', res);
								requestObj.abort();
								return;
							}
							if (type === 'blob') {
								console.log('【DiscourseHelper】Get(load) Blob\n请求地址：' + url + '\n请求头部：', headers, '\n请求结果：', res);
								res.status === 200 && base.blobDownload(res.response, extra.filename);
								resolve(res);
							} else {
								if (res.response) {
									try {
										res.decodedResponse = JSON.parse(res.response);
									} catch (e) { }
									try {
										res.decodedResponse = JSON.parse(base.decode(res.response));
									} catch (e) { }
								}
								if (res.responseText) {
									try {
										res.decodedResponseText = JSON.stringify(JSON.parse(res.responseText));
									} catch (e) { }
									try {
										res.decodedResponseText = JSON.stringify(base.decode(res.responseText));
									} catch (e) { }
								}
								console.log('【DiscourseHelper】Get(load)\n请求地址：' + url + '\n请求头部：', headers, '\n请求结果：', res);
								resolve(res.response || res.responseText);
							}
						},
						onerror: function (err) {
							if (currentRetry < maxRetries) {
								currentRetry++;
								console.error(`【DiscourseHelper】Get(error)\n请求出现错误，可能是网络问题\n5秒后将重试 (错误次数：${currentRetry}/${maxRetries})...`, err);
								setTimeout(function () {
									console.log(`【DiscourseHelper】Get(error)\n重新尝试请求...`);
									sendRequest();
								}, 5000)
							} else {
								reject('【DiscourseHelper】Get(error)\n请求出现错误，可能是网络问题\n无法继续请求，达到最大错误次数。', err);
							}
						},
					});
				};

				sendRequest(); // 初始请求
			});
		},
		getFullLink(link) {
			return new URL(link, location.href).href;
		},
		waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
			var targetNodes, btargetsFound;

			if (typeof iframeSelector == "undefined")
				targetNodes = $(selectorTxt);
			else
				targetNodes = $(iframeSelector).contents().find(selectorTxt);

			if (targetNodes && targetNodes.length > 0) {
				btargetsFound = true;
				targetNodes.each(function () {
					var jThis = $(this);
					var alreadyFound = jThis.data('alreadyFound') || false;

					if (!alreadyFound) {
						var cancelFound = actionFunction(jThis);
						if (cancelFound)
							btargetsFound = false;
						else {
							jThis.data('alreadyFound');
						}
					}
				});
			} else {
				btargetsFound = false;
			}

			var controlObj = base.waitForKeyElements.controlObj || {};
			var controlKey = selectorTxt.replace(/[^\w]/g, "_") + actionFunction.toString().replace(/[^\w]/g, "_");
			var timeControl = controlObj[controlKey];

			if (btargetsFound && bWaitOnce && timeControl) {
				clearInterval(timeControl);
				delete controlObj[controlKey]
			} else {
				if (!timeControl) {
					timeControl = setInterval(() => {
						base.waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
					}, 1000);
					controlObj[controlKey] = timeControl;
				}
			}
			base.waitForKeyElements.controlObj = controlObj;
		},
		showToast(htmlContent, duration = 1500) {
			let allToasts = $('.helper-toast');
			let totalToasts = allToasts.length;
			if (totalToasts > 2) {
				for (let i = 0; i < totalToasts - 2; i++) {
					$(allToasts[i]).removeClass('show').on('transitionend', () => {
						$(allToasts[i]).remove();
					});
				}
			}
			/**
			 * 显示一个 Toast 提示
			 * @param {string} htmlContent - 自定义的 HTML 内容
			 * @param {number} duration - 持续时间（毫秒）
			 */
			let toast = $('<div>', {
				class: 'helper-toast',
				html: htmlContent
			});

			$('body').append(toast);
			setTimeout(() => toast.addClass('show'), 10);

			setTimeout(() => {
				toast.removeClass('show').on('transitionend', () => { toast.remove() });
			}, duration);
		},
		previewTopic(id) {
			let preViewer = `<div id="dialog-holder" class="dialog-container">
				<style>
					#dialog-holder:not([aria-hidden="true"]){position:fixed;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content{max-height:97%;max-width:55%;min-height:auto;min-width:auto;display:flex;flex-direction:column}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content a{margin:0}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-header{justify-content:space-between}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-header > .title{font-size:var(--font-up-3);font-weight:600}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-header > .date{color:#666;font-family:serif}

					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body{max-height:none;max-width:none;margin:0;width:calc(100% - 2em)}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body .content {padding:0;margin:0}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body .content > .item:not(:last-child){border-bottom:1px solid var(--primary-low)}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body .content > .item{display:flex;align-items:flex-start}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body .content > .item .floor,#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body .content > .item .avatar img.avatar{width:30px;height:30px;text-align:center;margin-top:15px}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body .content > .item .post{flex:1;padding:15px;word-break:break-all}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body .content > .item .post pre code{max-width:620px}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body .content > .item .post img{max-width:100%;max-height:100%;height:auto}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body .content > .item .post .name{font-size:16px;color:var(--primary-high-or-secondary-low);display:flex;justify-content:space-between;align-items:center}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body .content > .item .post .date{color:#b9b9b9;font-size:16px;margin-left:auto}

					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-footer{display:flex;justify-content:space-between;bottom:0;background-color:var(--secondary);position:sticky}
					#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-footer .btn{margin:0 0 var(--btn-bottom-margin)}

					@media screen and (max-width: 1000px){
						#dialog-holder:not([aria-hidden="true"]) .dialog-content{max-width:95%}
						#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-header{display:grid;justify-content:flex-start;align-items:flex-start;gap:5px}
						#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body .content > .item .post > *{white-space:normal;word-wrap:break-word;overflow-wrap:break-word;word-break:break-word}
					}
				</style>
				<div class="dialog-overlay"></div>
				<div class="dialog-content">
					<div class="dialog-header">
						<span class="title">预览</span><span class="date"></span>
					</div>
					<div class="dialog-body">
						<p style="text-align: center">...</p>
					</div>
					<div class="dialog-footer">
						<button id="showMoreButton" class="btn btn-icon-text btn-primary" type="button">
							<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#discourse-threads"></use></svg>
							<span class="d-button-label">查看更多</span>
						</button>
						<button id="closeButton" class="btn btn-icon-text" type="button">
							<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#xmark"></use></svg>
							<span class="d-button-label">关闭</span>
						</button>
					</div>
				</div>
			</div>`
			let preLoading = `<section class="d-splash">
				<style>
					.d-splash{--dot-color:var(--tertiary);display:grid;place-items:center;height:10vh;background-color:var(--secondary)}
					.d-splash .preloader{--splash-dot-size:max(1vw,25px);--splash-dot-spacing:calc(var(--splash-dot-size) * 1.5);width:calc((var(--splash-dot-size) + var(--splash-dot-spacing)) * 5)}
					.d-splash .preloader .dots{animation-name:d-splash-loader;animation-timing-function:ease-in-out;animation-duration:2s;animation-iteration-count:infinite;animation-delay:calc(var(--n) * 0.15s);position:absolute;top:calc(50% - var(--splash-dot-size) / 1.5);left:calc((50% - var(--splash-dot-size) / 2) + (var(--n) * var(--splash-dot-spacing)));transform-origin:calc((var(--splash-dot-spacing) * var(--n) * -1) + var(--splash-dot-size)/2) center;width:var(--splash-dot-size);height:var(--splash-dot-size);border-radius:50%;background-color:var(--dot-color);filter:saturate(2) opacity(0.85);opacity:0}
					@keyframes d-splash-fade-in{0%{opacity:0}100%{opacity:1}}
					@keyframes d-splash-loader{0%{opacity:0;transform:scale(1)}45%{opacity:1;transform:scale(0.7)}65%{opacity:1;transform:scale(0.7)}100%{opacity:0;transform:scale(1)}}
				</style>
				<div class="preloader" elementtiming="discourse-splash-visible">
					<div class="dots" style="--n:-3;"></div>
					<div class="dots" style="--n:-2;"></div>
					<div class="dots" style="--n:-1;"></div>
					<div class="dots" style="--n:0;"></div>
					<div class="dots" style="--n:1;"></div>
					<div class="dots" style="--n:2;"></div>
					<div class="dots" style="--n:3;"></div>
				</div>
			</section>`
			let viewer = $(preViewer)
			let loading = $(preLoading)
			viewer.find(".dialog-content .dialog-body").html(loading);
			$(`html > .${mount}`).append(viewer)
			viewer.fadeIn()
			viewer.find(".dialog-overlay, #closeButton").on("click", (event) => {
				viewer.find(".dialog-content .dialog-body").html(loading);
				viewer.remove()
			})
			viewer.find("#showMoreButton").on("click", (event) => {
				window.open(base.getFullLink('/t/topic/' + id))
			})
			fetch(`/t/${id}.json`)
				.then((response) => response.json()).then((data) => {
					if (!viewer.length > 0) return;
					viewer.find(".dialog-content .dialog-header").html(`<span class="title">${data.title}</span><span class="date">${base.formatDate(data.created_at)}</span>`)
					viewer.find(".dialog-content .dialog-body").html(`<div class="content"></div>`);
					$.each(data.post_stream.posts, function (index, post) {
						let elempost = $(`<div class="item cooked">
							${post?.avatar_template ? '<div class="avatar"><img class="avatar" src="' + base.getFullLink(post?.avatar_template.replace("{size}", "50")) + '"/></div>' : ""}
							<div class="post">
								<div class="name">
									${post.display_username ? "<span>" + post.display_username + "</span>" : post.username ? "<span>" + post.username + "</span>" : ""}
									<div class="date">${base.formatDate(post.created_at)}</div>
								</div>
								<p>${post.cooked || (post.action_code ? "<i>动作: " + post.action_code + "</i>" : "")}</p>
							</div>
							<span class="floor">L${index + 1}</span>
						</div>`)
						// 这的函数不能用箭头函数，因为箭头函数没有 this。
						elempost.find("a.lightbox").each(function () {
							let content = $(this).html();
							$(this).find("[src]").attr("src", $(this).attr("href"))
							$(this).replaceWith(content);
						});
						elempost.find(".math").each(function () {
							let content = $(this);
							katex.render(content.html(), content[0]);
						});
						elempost.find("a[href]").each(function () {
							let element = $(this)
							element.attr("parenttopic", id)
						});
						viewer.find(".dialog-content .dialog-body .content").append(elempost);
					});
				})
				.catch(error => {
					console.error(error)
					viewer.find(".dialog-content .dialog-body").html(`<p style="text-align: center;">加载失败，错误：${error.message}</p>`);
				})
		},
		themeStyles: [
			{
				label: "discourse",
				content: `
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/color_definitions_default-light_34_331_e309836dfa4c20720db0a7f4ca0523028ff24cb6.css?__ws=meta.discourse.org" media="all" rel="stylesheet" class="light-scheme" data-scheme-id="34"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/desktop_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="desktop"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/automation_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="automation"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/chat_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="chat"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/checklist_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="checklist"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-activity-pub_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-activity-pub"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-ai_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-ai"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-assign_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-assign"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-cakeday_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-cakeday"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-customer-flair-plugin_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-customer-flair-plugin"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-data-explorer_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-data-explorer"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-details_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-details"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-doc-categories_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-doc-categories"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-gamification_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-gamification"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-lazy-videos_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-lazy-videos"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-local-dates_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-local-dates"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-math_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-math"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-narrative-bot_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-narrative-bot"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-new-features-feeds_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-new-features-feeds"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-presence_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-presence"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-reactions_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-reactions"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-saved-searches_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-saved-searches"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-solved_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-solved"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-templates_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-templates"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-theme-install-button_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-theme-install-button"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-topic-voting_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-topic-voting"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-translator_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-translator"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-user-notes_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-user-notes"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-yearly-review_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-yearly-review"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/footnote_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="footnote"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/hosted-site_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="hosted-site"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/poll_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="poll"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/spoiler-alert_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="spoiler-alert"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/chat_desktop_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="chat_desktop"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-ai_desktop_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-ai_desktop"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-gamification_desktop_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-gamification_desktop"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-reactions_desktop_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-reactions_desktop"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/discourse-topic-voting_desktop_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="discourse-topic-voting_desktop"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/poll_desktop_22bd7ca2d54227801f67ee040a8e018994ae2b7a.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="poll_desktop"  />
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_344_bc664756f17e10d0731852855eb4aaebf8bfbda1.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="344" data-theme-name="category banners"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_264_e0c2fa5a3610a27de340909ac2538a5592b9af24.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="264" data-theme-name="custom header links (icons)"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_403_3731f20e5e6a4b89d030cfd7d77302b7f7f1728c.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="403" data-theme-name="density toggle"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_129_5584213a9fa7099a47b9c9544faa717220bcdf57.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="129" data-theme-name="discotoc"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_334_8d6adf8ea8c9a2f376c15eeb638aea0a738d7758.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="334" data-theme-name="discourse experiments"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_195_990953add514fbd5956fed15bddaea65b72047bc.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="195" data-theme-name="discourse gifs"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_171_b5eb9a8e39315cd64a5442c8a9624498f66fe758.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="171" data-theme-name="discourse icon"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_286_8562fc577757d9490a18da6e1e7d09ea3891e988.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="286" data-theme-name="discourse mermaid"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_222_04e6db26bcb56d1c201c4cfe909e73b46c679f7b.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="222" data-theme-name="docs card filter"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_304_b656ef1a51e1ab6c25f27efe4834bd1994789ac6.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="304" data-theme-name="experimental filter component"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_191_ceaaa622ea9248423ab47a0e1f8c096c3f9600ec.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="191" data-theme-name="github status indicators"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_351_469c69432161636ee07cd482c2269b450bd3349c.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="351" data-theme-name="kanban board"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_356_2602965dfc34321ee62da752aa023e353433cb36.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="356" data-theme-name="peek-mode-composer"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_180_474f873c74379375ee6e2289ac38e61dac117ff4.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="180" data-theme-name="placeholder forms"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_347_265e6a38094504286494e5291b0f783793411d15.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="347" data-theme-name="reader mode"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_202_1b4f4dae7574a8438e7498736c083ecabd396c30.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="202" data-theme-name="reply template"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_247_17a24383d1d43fc4ab00bce777ea59a1d1ab9128.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="247" data-theme-name="search banner (meta theme)"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_279_cfa01aae799de2c9b5a7403c5a756db6ab5e81bf.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="279" data-theme-name="sidebar theme toggle"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_343_7d99a44f3282b92950348f219ee5283764cb9d85.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="343" data-theme-name="tag banners"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_155_6870196487a1104952bd595d7691848e98cadc91.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="155" data-theme-name="tag icons"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_208_cf77e5e6f39e61dbb003e5e8864c8acb910ba767.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="208" data-theme-name="team pm likes"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_184_42a7d7a5e83c6d88e959abf0958afa3c94ac4737.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="184" data-theme-name="topic thumbnails"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_230_44013bdcb97e8275a2df5e959766a48e11993423.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="230" data-theme-name="unformatted code detector"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_236_f507adefa36715debb934fb2ff08ae2d22fc5298.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="236" data-theme-name="user card directory"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_309_2179fa5d1c4e8ab78bc107f42963b51fea934330.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="309" data-theme-name="whisper warning"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_331_e8e11b0d0c4dca0511b9065675f16c5baddb073c.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="331" data-theme-name="meta branded"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_320_0a356211c7f526abfcd445a375b9ce9b2a251d65.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="320" data-theme-name="centralhide"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_404_6f1b8b1eb7c0364fe146a5c90360cef3e26541ad.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="404" data-theme-name="collapse ai triage whispers"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_194_b1d9946a90c1987c45ef3f3c0ec18cedd06abd17.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="194" data-theme-name="create-poll-first"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_379_695247c9dd6650ee2f8eadc4417e993231f5f82e.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="379" data-theme-name="developer guides noedit"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_358_3da916139c629b624cae3235295818e16773da99.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="358" data-theme-name="hide &#39;check doc&#39;"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_165_92472b61b3bb329d126e437f5884294ba9fe81c7.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="165" data-theme-name="hide sidebar for anon - hidden whispers for non-staff"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_22_1d553015cb147ab69cbaad0f737dddfdd268f3a0.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="22" data-theme-name="hide team shield"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_298_033ac0f3ea83590fd01e0dd6ed43251bc589d3b7.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="298" data-theme-name="logo avatar exception"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_350_5db8811dc64cfc1a3051f4cf1fec3615c7f0eba4.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="350" data-theme-name="meta branded background adjustment for jobs banner"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_314_61cc7d6e2d6415dd7686bb342a82de8751094891.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="314" data-theme-name="rubik headings"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_267_1fa0b2b543d92da4714ec18615ab72d4e7b710d2.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="267" data-theme-name="tech advocate only group assign header button"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/common_theme_355_0a1b855f7b99f95c56bd8052adb6def2538cd997.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="common_theme" data-theme-id="355" data-theme-name="topic voting customisations"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/desktop_theme_334_f639cebeb472ed166bb8053e2e7f68fb39bf50fe.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="334" data-theme-name="discourse experiments"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/desktop_theme_195_55da6794a00beec518275f3bd3bedee0529ad349.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="195" data-theme-name="discourse gifs"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/desktop_theme_222_5439b3d732d6cd3222b842c6d90ded5c0f6ceb80.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="222" data-theme-name="docs card filter"/>
				<link href="https://d3bpeqsaub0i6y.cloudfront.net/stylesheets/desktop_theme_280_2a5dd0b2644be1a86ef447c0be70d92b592101ef.css?__ws=meta.discourse.org" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="280" data-theme-name="full width"/>
				<script class="themeFix">
				window.onload = document.querySelector("html").classList.add("meta-theme")
				</script>
				<style class="themeFix">
				.alert.alert-info{border:5px solid var(--secondary);border-radius: var(--d-border-radius)}
				.topic-list .num.activity a{padding:0}
				.topic-list-item td.activity .post-activity{justify-content:center}
				.has-sidebar-page .d-header>.wrap .contents{grid-template-columns:minmax(auto, 1fr) auto minmax(0, calc(var(--d-max-width))) auto minmax(auto, 1fr)}
				</style>
				`,
			},
			{
				label: "openai",
				content: `
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/color_definitions_light_4_15_019644e6e6c0aed02eb4bed581641854b6ac7e24.css?__ws=community.openai.com" media="(prefers-color-scheme: light)" rel="stylesheet" class="light-scheme" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/color_definitions_dark-new_9_15_63c7b9dc511c92121bd146dfbaf5957d63d88e41.css?__ws=community.openai.com" media="(prefers-color-scheme: dark)" rel="stylesheet" class="dark-scheme" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/desktop_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="desktop" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/automation_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="automation" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/chat_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="chat" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/checklist_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="checklist" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-adplugin_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-adplugin" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-ai_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-ai" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-akismet_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-akismet" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-cakeday_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-cakeday" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-chat-integration_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-chat-integration" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-data-explorer_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-data-explorer" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-details_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-details" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-lazy-videos_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-lazy-videos" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-local-dates_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-local-dates" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-math_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-math" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-narrative-bot_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-narrative-bot" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-policy_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-policy" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-presence_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-presence" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-reactions_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-reactions" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-solved_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-solved" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-templates_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-templates" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-topic-voting_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-topic-voting" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-user-notes_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-user-notes" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/footnote_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="footnote" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/hosted-site_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="hosted-site" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/poll_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="poll" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/spoiler-alert_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="spoiler-alert" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/chat_desktop_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="chat_desktop" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-ai_desktop_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-ai_desktop" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-reactions_desktop_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-reactions_desktop" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/discourse-topic-voting_desktop_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="discourse-topic-voting_desktop" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/poll_desktop_d1c281e8e371d5a41b74d37901460d8d60a5b31e.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="poll_desktop" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/desktop_theme_10_eb93ffa0317a6deb25d6b8c4a8b26c5484583f57.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="10" data-theme-name="category banners" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/desktop_theme_4_d65384c90c2e1e67f425d57c10cc430175f01be8.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="4" data-theme-name="custom header links" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/desktop_theme_12_daa91c71c8e74fa5d282e6daaf15fa17993f2850.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="12" data-theme-name="discourse-mermaid-theme-component" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/desktop_theme_5_107b21bb017f44ea36395e4e1513d0b007df5b7b.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="5" data-theme-name="easy footer" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/desktop_theme_16_25287a0e5842cf28159abfee0e8826a8dda2279d.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="16" data-theme-name="sidebar theme toggle" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/desktop_theme_13_2209cf1114c3f5c41d2155f6051452062db25a85.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="13" data-theme-name="hide-footer-chat" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/desktop_theme_9_dcf65209978f476fc1dfcf461774e3c6b0ca8d85.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="9" data-theme-name="quickfixes" />
				<link href="https://sea2.discourse-cdn.com/openai1/stylesheets/desktop_theme_15_f44ad566e45f054c5f5f2db09462c6e8df7ed5a3.css?__ws=community.openai.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="15" data-theme-name="light mode" />
				<style class="themeFix">
				:root{--d-selected:var(--tertiary-low);--d-hover:var(--tertiary-low)}
				</style>
				`,
			},
			{
				label: "docker",
				content: `
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/color_definitions_docker-success-center_8_11_54716131c2ce93a3ca21561fc4b93d0c78b81ab0.css?__ws=forums.docker.com" media="all" rel="stylesheet" class="light-scheme" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/desktop_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="desktop" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/chat_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="chat" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/checklist_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="checklist" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-ai_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-ai" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-akismet_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-akismet" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-cakeday_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-cakeday" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-data-explorer_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-data-explorer" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-details_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-details" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-lazy-videos_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-lazy-videos" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-local-dates_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-local-dates" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-policy_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-policy" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-post-voting_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-post-voting" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-presence_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-presence" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-solved_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-solved" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-templates_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-templates" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-topic-voting_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-topic-voting" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/footnote_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="footnote" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/hosted-site_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="hosted-site" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/poll_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="poll" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/spoiler-alert_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="spoiler-alert" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/chat_desktop_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="chat_desktop" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-ai_desktop_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-ai_desktop" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-post-voting_desktop_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-post-voting_desktop" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/discourse-topic-voting_desktop_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="discourse-topic-voting_desktop" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/poll_desktop_256370012eb88843f3450a5cc6947afe75adb3c9.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="poll_desktop" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/desktop_theme_19_64e80778ab66147f7f595055a844770a37e6da6b.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="19" data-theme-name="discotoc" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/desktop_theme_17_4872c40aadd6b77b9bbff52ed0cc2a8472ea8de5.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="17" data-theme-name="icon header links" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/desktop_theme_15_5ccd001eba876cf97cd31556ab5a969ebd0278e5.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="15" data-theme-name="2019 theme fixes" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/desktop_theme_18_6225a4c181d043738cc8b1d7d231ba857ae7d124.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="18" data-theme-name="2021 code block formatting" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/desktop_theme_16_5a884639c9654a291d3463906e4db67fae309da0.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="16" data-theme-name="2021 fixes" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/desktop_theme_53_955d11d42a60acfd2f16b254001594895bb3bad7.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="53" data-theme-name="2023 fixes" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/desktop_theme_10_9b2b608e21c162bc3bae925afbbe9dbc69083795.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="10" data-theme-name="docker www 3.0" />
				<link href="https://sea3.discourse-cdn.com/docker/stylesheets/desktop_theme_11_4b330e6ce617c4a783b326f3a56e8d61f225488c.css?__ws=forums.docker.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="11" data-theme-name="default" />
				<style class="themeFix">
				.d-header{position:sticky}
				.d-header #site-logo{display:block}
				#main-outlet{padding-top:1.5em}
				.custom-search-banner-wrap{padding:2.5em 0 3em}
				.btn-primary{background-color:var(--tertiary);color:var(--secondary)}
				#reply-control.edit-title.open{padding:0}
				#reply-control .toggler{padding:0.4em 0.467em}
				</style>
				`,
			},
			{
				label: "huggingface",
				content: `
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/color_definitions_hf-light_3_4_faec6c9a8f489e8376cee2f300e8bb409e9d92aa.css?__ws=discuss.huggingface.co" media="(prefers-color-scheme: light)" rel="stylesheet" class="light-scheme" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/color_definitions_hf-dark_4_4_87b059be82cecd26a5350181d4cd86518aa9c3ea.css?__ws=discuss.huggingface.co" media="(prefers-color-scheme: dark)" rel="stylesheet" class="dark-scheme" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/desktop_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="desktop" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/automation_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="automation" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/checklist_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="checklist" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-adplugin_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-adplugin" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-ai_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-ai" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-akismet_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-akismet" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-cakeday_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-cakeday" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-details_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-details" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-lazy-videos_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-lazy-videos" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-local-dates_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-local-dates" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-math_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-math" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-narrative-bot_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-narrative-bot" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-policy_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-policy" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-presence_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-presence" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-reactions_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-reactions" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-solved_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-solved" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-templates_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-templates" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-topic-voting_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-topic-voting" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/footnote_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="footnote" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/hosted-site_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="hosted-site" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/poll_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="poll" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/spoiler-alert_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="spoiler-alert" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-ai_desktop_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-ai_desktop" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-reactions_desktop_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-reactions_desktop" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-topic-voting_desktop_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="discourse-topic-voting_desktop" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/poll_desktop_6b796d0a1ddfd255a31d3207e2471022857b942a.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="poll_desktop" />
				<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/desktop_theme_4_798b833d26be9f742a0182ec4b373eff3a774550.css?__ws=discuss.huggingface.co" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="4" data-theme-name="discourse-huggingface-theme" />
				`,
			},
			{
				label: "ubuntu",
				content: `
				<link href="https://discourse.ubuntu.com/stylesheets/color_definitions_base__2_4df0b5b6908053d16d0c877a7fa322b583f4db7f.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" class="light-scheme" />
				<link href="https://discourse.ubuntu.com/stylesheets/desktop_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="desktop" />
				<link href="https://discourse.ubuntu.com/stylesheets/checklist_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="checklist" />
				<link href="https://discourse.ubuntu.com/stylesheets/discourse-calendar_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="discourse-calendar" />
				<link href="https://discourse.ubuntu.com/stylesheets/discourse-data-explorer_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="discourse-data-explorer" />
				<link href="https://discourse.ubuntu.com/stylesheets/discourse-details_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="discourse-details" />
				<link href="https://discourse.ubuntu.com/stylesheets/discourse-gamification_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="discourse-gamification" />
				<link href="https://discourse.ubuntu.com/stylesheets/discourse-lazy-videos_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="discourse-lazy-videos" />
				<link href="https://discourse.ubuntu.com/stylesheets/discourse-local-dates_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="discourse-local-dates" />
				<link href="https://discourse.ubuntu.com/stylesheets/discourse-narrative-bot_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="discourse-narrative-bot" />
				<link href="https://discourse.ubuntu.com/stylesheets/discourse-presence_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="discourse-presence" />
				<link href="https://discourse.ubuntu.com/stylesheets/discourse-solved_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="discourse-solved" />
				<link href="https://discourse.ubuntu.com/stylesheets/discourse-templates_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="discourse-templates" />
				<link href="https://discourse.ubuntu.com/stylesheets/markdown-note_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="markdown-note" />
				<link href="https://discourse.ubuntu.com/stylesheets/poll_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="poll" />
				<link href="https://discourse.ubuntu.com/stylesheets/spoiler-alert_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="spoiler-alert" />
				<link href="https://discourse.ubuntu.com/stylesheets/discourse-calendar_desktop_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="discourse-calendar_desktop" />
				<link href="https://discourse.ubuntu.com/stylesheets/discourse-gamification_desktop_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="discourse-gamification_desktop" />
				<link href="https://discourse.ubuntu.com/stylesheets/poll_desktop_ca0328f3c15e6bdcab41165f40d567681bececef.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="poll_desktop" />
				<link href="https://discourse.ubuntu.com/stylesheets/desktop_theme_51_3618fb4255806e97c9b9e1faa6ccc5d4029f5e5b.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="51" data-theme-name="discotoc" />
				<link href="https://discourse.ubuntu.com/stylesheets/desktop_theme_50_61357ff8a1e12ac7fcad6b74566fe569f67101d5.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="50" data-theme-name="discourse cookie policy" />
				<link href="https://discourse.ubuntu.com/stylesheets/desktop_theme_10_9580173011171922db555275ad11ec5b22663414.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="10" data-theme-name="ubuntu discourse" />
				<link href="https://discourse.ubuntu.com/stylesheets/desktop_theme_2_580b90f56065bcedde51e40cfdc741ff0221c030.css?__ws=discourse.ubuntu.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="2" data-theme-name="default" />
				<style class="themeFix">
				.d-header, .d-header-wrap{position:sticky !important}
				.list-controls{position:unset;width:auto}
				.custom-search-banner-wrap{padding:2.5em 0 3em}
				</style>
				`,
			},
			{
				label: "googleaidevs",
				content: `
				<link class="themeFix" href="https://unpkg.com/material-symbols@0.29.0/index.css" media="all" rel="stylesheet" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/color_definitions_google-ai-for-developers_15_13_af0247c114bff7318144382cdca022cd9c59d3bc.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" class="light-scheme" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/desktop_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="desktop" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/automation_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="automation" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/checklist_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="checklist" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-ai_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-ai" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-cakeday_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-cakeday" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-data-explorer_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-data-explorer" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-details_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-details" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-lazy-videos_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-lazy-videos" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-local-dates_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-local-dates" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-narrative-bot_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-narrative-bot" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-policy_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-policy" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-presence_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-presence" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-reactions_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-reactions" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-solved_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-solved" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-templates_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-templates" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-topic-voting_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-topic-voting" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/footnote_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="footnote" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/hosted-site_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="hosted-site" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/poll_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="poll" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/spoiler-alert_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="spoiler-alert" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-ai_desktop_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-ai_desktop" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-reactions_desktop_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-reactions_desktop" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/discourse-topic-voting_desktop_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="discourse-topic-voting_desktop" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/poll_desktop_4049e6c0cb1d693ba8577642822ea353ac2d93d5.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="poll_desktop" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/desktop_theme_4_ba9964201f529de7d519443b7509431b7b4ff4fd.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="4" data-theme-name="discourse header search" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/desktop_theme_3_1faab6848c9a550804b3d45949afe470cbb80fca.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="3" data-theme-name="discourse-material-icons" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/desktop_theme_13_d08a7c63a1608156c17db3ff2af47643370dae60.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="13" data-theme-name="google ai" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/desktop_theme_9_bb6f26a10ba4889745f52354a4aa9fe8f05e59d9.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="9" data-theme-name="global notice custom css" />
				<link href="https://d1dlmcr85iqnpo.cloudfront.net/stylesheets/desktop_theme_8_ae8fb5da3d87de98751bddc380ec689fb70dbfbf.css?__ws=discuss.ai.google.dev" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="8" data-theme-name="temp nav fixes" />
				<style class="themeFix">
				#main-outlet-wrapper{background:transparent}
				.container.list-container {background:var(--bg-color)}
				</style>
				`,
			},
			{
				label: "googleaidevs_old",
				content: `
				<link class="themeFix" href="https://unpkg.com/material-symbols@0.29.0/index.css" media="all" rel="stylesheet" />
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/color_definitions_google-ai-for-developers_8_2_a146065001d103c6f508d0aecd9795e2b85e0231.css" media="all" rel="stylesheet" class="light-scheme">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="desktop">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/checklist_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="checklist">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-ai_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-ai">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-akismet_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-akismet">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-cakeday_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-cakeday">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-data-explorer_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-data-explorer">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-details_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-details">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-lazy-videos_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-lazy-videos">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-local-dates_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-local-dates">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-narrative-bot_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-narrative-bot">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-policy_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-policy">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-presence_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-presence">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-reactions_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-reactions">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-solved_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-solved">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-templates_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-templates">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-topic-voting_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-topic-voting">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/footnote_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="footnote">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/hosted-site_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="hosted-site">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/poll_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="poll">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/spoiler-alert_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="spoiler-alert">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-ai_desktop_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-ai_desktop">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-reactions_desktop_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-reactions_desktop">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-topic-voting_desktop_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-topic-voting_desktop">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/poll_desktop_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="poll_desktop">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_theme_4_89b44c1aa4a914829f5dab76be36f050017112fd.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="4" data-theme-name="discourse header search">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_theme_3_a8a980bc06c18d3fc858c318921f96f6581459cf.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="3" data-theme-name="discourse-material-icons">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_theme_9_ad782db09c6a21e86f43e7f9fbbaa30324037bf5.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="9" data-theme-name="global notice custom css">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_theme_8_878e84961d78833adf9238d6eda91eb9292d7ed3.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="8" data-theme-name="temp nav fixes">
				<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_theme_2_c35f48dbd27cfaac6e78670aa85b8a0bd9a462fa.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="2" data-theme-name="google ai">
				`,
			},
			{
				label: "unity",
				content: `
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/color_definitions_unity-light-scheme_9_10_4c0f3200fa1f4e23d3c58e1203db22882c615fd1.css?__ws=discussions.unity.com" media="(prefers-color-scheme: light)" rel="stylesheet" class="light-scheme" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/color_definitions_unity-dark-scheme_10_10_dea49c15513e3a5976eb6195cd5867019a8d1217.css?__ws=discussions.unity.com" media="(prefers-color-scheme: dark)" rel="stylesheet" class="dark-scheme" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/automation_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="automation" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/checklist_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="checklist" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-ai_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-ai" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-akismet_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-akismet" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-cakeday_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-cakeday" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-chat-integration_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-chat-integration" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-custom-topic-lists_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-custom-topic-lists" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-data-explorer_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-data-explorer" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-details_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-details" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-lazy-videos_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-lazy-videos" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-local-dates_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-local-dates" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-math_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-math" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-narrative-bot_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-narrative-bot" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-policy_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-policy" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-post-voting_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-post-voting" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-presence_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-presence" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-preset-topic-composer_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-preset-topic-composer" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-reactions_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-reactions" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-rss-polling_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-rss-polling" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-saved-searches_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-saved-searches" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-signatures_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-signatures" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-solved_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-solved" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-templates_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-templates" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-user-notes_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-user-notes" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/footnote_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="footnote" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/hosted-site_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="hosted-site" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/poll_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="poll" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/spoiler-alert_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="spoiler-alert" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-ai_desktop_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-ai_desktop" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-post-voting_desktop_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-post-voting_desktop" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-reactions_desktop_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="discourse-reactions_desktop" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/poll_desktop_3ab875e5dc247156f1e0f74b40c2324bed596e4e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="poll_desktop" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_21_0aef52e1507c364e5b4a38efb4a7747af80e34dd.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="21" data-theme-name="category badge styles" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_43_0f0abc330f1fee80a02faf9533ccdd57e5156295.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="43" data-theme-name="category banners" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_44_90afd1b2afeca839e043931ca2a92670ea58f218.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="44" data-theme-name="category icons" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_41_a46ab19dec44eb8897209583d4c1e2bebcd6b056.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="41" data-theme-name="collapsible category groups" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_14_2ec989b5934f559b3974924748c82cc99e13459d.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="14" data-theme-name="discotoc" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_52_7ab83170c49d024e5f45ab4d9f32a6797f9a1c43.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="52" data-theme-name="discourse notification banners" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_22_335813956672e0f7931b14b12f2fa8c3bf383b66.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="22" data-theme-name="discourse-icon" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_13_89cdd8c07e39ed9716f1dd22149e6aa08ddac333.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="13" data-theme-name="discourse-mermaid-theme-component" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_6_9b7241fef6f7cca010f7100ffa8a0179d281de4b.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="6" data-theme-name="discourse-search-banner" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_45_5f84957c1e58bee4b7c29adfa38d72d42be9e267.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="45" data-theme-name="experimental filter component" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_46_2accdf8b1149da4fd4c0c01dde041bb8e63a96a0.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="46" data-theme-name="full width" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_15_de98df9103a7bd172f942e1cf65f28e29bcb6e9f.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="15" data-theme-name="image comparison slider" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_16_a55090aab48d77a5437b1861ae31b83cfbe8628b.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="16" data-theme-name="pdf previews" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_48_a909e3f322a256a37bf1a96e776c12e99f60438f.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="48" data-theme-name="tag icons" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_17_f27465128027862bf953a6316a66b42027e927fa.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="17" data-theme-name="tiles - gallery component" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_18_e7d3d2e2f1df834a881c7977fec21033b296fc2c.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="18" data-theme-name="topic thumbnails" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_28_f70f13a252aaee09db54bda2c52aaa15365c3d4b.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="28" data-theme-name="unformatted code detector" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_49_117aba71705755363a5bdc140dca2fefd063d22e.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="49" data-theme-name="unity: brand identity" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_25_6e4037e555d042dff90f58f2a836e23c0fc60809.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="25" data-theme-name="unity: dsa" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_12_ed791f42412af1df54faf7fcca1d9dea79f6368c.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="12" data-theme-name="unity: onetrust" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_50_94cf41545197b840d16179dc159164ab329b4260.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="50" data-theme-name="unity: theme extras" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_10_f577ac1095ee1cff6038cf8e30a6fd2e42f7bcbd.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="10" data-theme-name="unity" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_53_f6439cf6886fbca963a4a481eca73913ad57b323.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="53" data-theme-name="hotfix: composer overflow" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_58_8699dbf8b17f3ffa44dc48337fa22bb3e6d72174.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="58" data-theme-name="hotfix: font-size for inline and block code - csd-327" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_55_4a4952ef33b65a1513d1a4674c0118a08c992ec9.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="55" data-theme-name="hotfix: hide suspension message on cards" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_51_1a82c7616e836c87cfb5e913d3324939426a2b64.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="51" data-theme-name="hotfix: restyle experimental topic summary" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_54_8f5fb1a637bc8278d4b12a02aad6b9f2faf3890c.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="54" data-theme-name="hotfix: signatures brake the solved post layout" />
				<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_24_076484b88f0a00ab205271c05953d327236f3fd6.css?__ws=discussions.unity.com" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="24" data-theme-name="override-mermaid-styles" />
				<style class="themeFix">
				[data-section-name=community]{order:0}
				.has-sidebar-page .d-header>.wrap .contents{grid-template-columns:minmax(auto,1fr) auto minmax(0,calc(var(--d-max-width))) auto minmax(auto,1fr)}
				.custom-search-banner-wrap{gap:18px}
				.custom-search-banner-wrap h1,.custom-search-banner-wrap p{display:block;margin:0}
				.wrap article .contents,.signature-img{margin-left:var(--topic-body-width-padding);background-color: var(--d-topic-post-background-color)}
				.header-sidebar-toggle{display:block}
				.d-header .home-logo-wrapper-outlet{margin-left:3.7em}
				#navigation-bar{display:flex}
				</style>
				`,
			},
			{
				label: "godot",
				content: `
				<link href="https://forum.godotengine.org/stylesheets/color_definitions_godot-light_14_5_90f4bf1af7154e6333eb342844c4f0494ccfc932.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" class="light-scheme" />
				<link href="https://forum.godotengine.org/stylesheets/color_definitions_godot-dark_15_5_ac206a2ac9e642eeba474f3205c48584eabffe88.css?__ws=forum.godotengine.org" media="(prefers-color-scheme: dark)" rel="stylesheet" class="dark-scheme" />
				<link href="https://forum.godotengine.org/stylesheets/desktop_1c75e68965ba63c0b63abb10fb2514d72277bff2.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="desktop" />
				<link href="https://forum.godotengine.org/stylesheets/checklist_1c75e68965ba63c0b63abb10fb2514d72277bff2.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="checklist" />
				<link href="https://forum.godotengine.org/stylesheets/discourse-details_1c75e68965ba63c0b63abb10fb2514d72277bff2.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="discourse-details" />
				<link href="https://forum.godotengine.org/stylesheets/discourse-lazy-videos_1c75e68965ba63c0b63abb10fb2514d72277bff2.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="discourse-lazy-videos" />
				<link href="https://forum.godotengine.org/stylesheets/discourse-local-dates_1c75e68965ba63c0b63abb10fb2514d72277bff2.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="discourse-local-dates" />
				<link href="https://forum.godotengine.org/stylesheets/discourse-narrative-bot_1c75e68965ba63c0b63abb10fb2514d72277bff2.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="discourse-narrative-bot" />
				<link href="https://forum.godotengine.org/stylesheets/discourse-presence_1c75e68965ba63c0b63abb10fb2514d72277bff2.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="discourse-presence" />
				<link href="https://forum.godotengine.org/stylesheets/discourse-solved_1c75e68965ba63c0b63abb10fb2514d72277bff2.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="discourse-solved" />
				<link href="https://forum.godotengine.org/stylesheets/docker_manager_1c75e68965ba63c0b63abb10fb2514d72277bff2.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="docker_manager" />
				<link href="https://forum.godotengine.org/stylesheets/footnote_1c75e68965ba63c0b63abb10fb2514d72277bff2.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="footnote" />
				<link href="https://forum.godotengine.org/stylesheets/poll_1c75e68965ba63c0b63abb10fb2514d72277bff2.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="poll" />
				<link href="https://forum.godotengine.org/stylesheets/spoiler-alert_1c75e68965ba63c0b63abb10fb2514d72277bff2.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="spoiler-alert" />
				<link href="https://forum.godotengine.org/stylesheets/poll_desktop_1c75e68965ba63c0b63abb10fb2514d72277bff2.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="poll_desktop" />
				<link href="https://forum.godotengine.org/stylesheets/desktop_theme_9_a23c0d9257e24e19da9539f850fda68cba1f97ee.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="9" data-theme-name="custom header links" />
				<link href="https://forum.godotengine.org/stylesheets/desktop_theme_3_e9aa769da3cbc75c620e27a4d71cba95b61df745.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="3" data-theme-name="godot tweaks" />
				<link href="https://forum.godotengine.org/stylesheets/desktop_theme_12_8497322318172ccaeb4d4528be13bdf32378d137.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="12" data-theme-name="post badges" />
				<link href="https://forum.godotengine.org/stylesheets/desktop_theme_7_3dddee68983edaf20a23ea3e31dec3c0c66a24a7.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="7" data-theme-name="search banner" />
				<link href="https://forum.godotengine.org/stylesheets/desktop_theme_5_13ebfcfad98a540810a59b24fd9d79a75fb70374.css?__ws=forum.godotengine.org" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="5" data-theme-name="godot theme" />
				`,
			},
			{
				label: "ksec",
				content: `
				<link href="https://forum.ksec.co.uk/stylesheets/color_definitions_light_7_2_5186d2d3066aedb3bfcac1027d47b8b0b5350afb.css" media="all" rel="stylesheet" class="light-scheme">
				<link href="https://forum.ksec.co.uk/stylesheets/color_definitions_dark_1_2_a0603164c6b779ba925871d7963187c6a6dfa8d0.css" media="(prefers-color-scheme:dark)" rel="stylesheet" class="dark-scheme">
				<link href="https://forum.ksec.co.uk/stylesheets/desktop_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="desktop">
				<link href="https://forum.ksec.co.uk/stylesheets/checklist_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="checklist">
				<link href="https://forum.ksec.co.uk/stylesheets/discourse-ai_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-ai">
				<link href="https://forum.ksec.co.uk/stylesheets/discourse-akismet_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-akismet">
				<link href="https://forum.ksec.co.uk/stylesheets/discourse-cakeday_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-cakeday">
				<link href="https://forum.ksec.co.uk/stylesheets/discourse-details_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-details">
				<link href="https://forum.ksec.co.uk/stylesheets/discourse-gamification_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-gamification">
				<link href="https://forum.ksec.co.uk/stylesheets/discourse-lazy-videos_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-lazy-videos">
				<link href="https://forum.ksec.co.uk/stylesheets/discourse-local-dates_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-local-dates">
				<link href="https://forum.ksec.co.uk/stylesheets/discourse-narrative-bot_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-narrative-bot">
				<link href="https://forum.ksec.co.uk/stylesheets/discourse-presence_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-presence">
				<link href="https://forum.ksec.co.uk/stylesheets/discourse-reactions_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-reactions">
				<link href="https://forum.ksec.co.uk/stylesheets/discourse-rss-polling_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-rss-polling">
				<link href="https://forum.ksec.co.uk/stylesheets/docker_manager_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="docker_manager">
				<link href="https://forum.ksec.co.uk/stylesheets/footnote_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="footnote">
				<link href="https://forum.ksec.co.uk/stylesheets/poll_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="poll">
				<link href="https://forum.ksec.co.uk/stylesheets/spoiler-alert_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="spoiler-alert">
				<link href="https://forum.ksec.co.uk/stylesheets/discourse-ai_desktop_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-ai_desktop">
				<link href="https://forum.ksec.co.uk/stylesheets/discourse-gamification_desktop_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-gamification_desktop">
				<link href="https://forum.ksec.co.uk/stylesheets/discourse-reactions_desktop_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-reactions_desktop">
				<link href="https://forum.ksec.co.uk/stylesheets/poll_desktop_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="poll_desktop">
				<link href="https://forum.ksec.co.uk/stylesheets/desktop_theme_4_51fe4f92f85e2ddf8cb2ac39b3f18429f14452c8.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="4" data-theme-name="discourse clickable topic">
				<link href="https://forum.ksec.co.uk/stylesheets/desktop_theme_6_003073d7e039da7d37eb1e79b3772306ac8657f4.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="6" data-theme-name="discourse-gifs">
				<link href="https://forum.ksec.co.uk/stylesheets/desktop_theme_5_ce3252be82b7db613c78ea4f283dcf17abe51741.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="5" data-theme-name="discourse-search-banner">
				<link href="https://forum.ksec.co.uk/stylesheets/desktop_theme_9_12b3533905718e859faa16d62a11c119e4d64875.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="9" data-theme-name="icon header links">
				<link href="https://forum.ksec.co.uk/stylesheets/desktop_theme_3_28ffee2ef9ff10c2ad27c49227f68bb1da72a779.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="3" data-theme-name="modern category + group boxes">
				<link href="https://forum.ksec.co.uk/stylesheets/desktop_theme_2_dd1b36aa59bc2c658ff7a7825007d31f580dab8b.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="2" data-theme-name="air theme">
				<link href="https://forum.ksec.co.uk/stylesheets/desktop_theme_11_f4cc23465e9e5bf8d991504b6106825edc03c16a.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="11" data-theme-name="custom css &amp; html">
				<style class="themeFix">
				.full-width .contents .topic-list .topic-list-body .topic-list-item .topic-list-data.age{flex-direction:column}
				</style>
				`,
			},
		],
		getEmoji(emojiName) {
			let emojiReplacements = { "😀": "grinning_face", "😃": "grinning_face_with_big_eyes", "😄": "grinning_face_with_smiling_eyes", "😁": "grin", "😆": "laughing", "😅": "sweat_smile", "🤣": "rofl", "😂": "joy", "🙂": "slightly_smiling_face", "🙃": "upside_down_face", "🫠": "melting_face", "😉": "wink", "😊": "blush", "😇": "innocent", "🥰": "smiling_face_with_three_hearts", "😍": "heart_eyes", "🤩": "star_struck", "😘": "face_blowing_a_kiss", "😗": "kissing_face", "☺": "smiling_face", "😚": "kissing_face_with_closed_eyes", "😙": "kissing_face_with_smiling_eyes", "🥲": "smiling_face_with_tear", "😋": "face_savoring_food", "😛": "face_with_tongue", "😜": "winking_face_with_tongue", "🤪": "zany_face", "😝": "squinting_face_with_tongue", "🤑": "money_mouth_face", "🤗": "hugs", "🤭": "face_with_hand_over_mouth", "🫢": "face_with_open_eyes_and_hand_over_mouth", "🫣": "face_with_peeking_eye", "🤫": "shushing_face", "🤔": "thinking", "🫡": "saluting_face", "🤐": "zipper_mouth_face", "🤨": "face_with_raised_eyebrow", "😐": "neutral_face", "😑": "expressionless_face", "😶": "face_without_mouth", "🫥": "dotted_line_face", "😶‍🌫️": "face_in_clouds", "😏": "smirking_face", "😒": "unamused_face", "🙄": "roll_eyes", "😬": "grimacing", "😮‍💨": "face_exhaling", "🤥": "lying_face", "🫨": "shaking_face", "🙂‍↔️": "head_shaking_horizontally", "🙂‍↕️": "head_shaking_vertically", "😌": "relieved_face", "😔": "pensive_face", "😪": "sleepy_face", "🤤": "drooling_face", "😴": "sleeping_face", "🫩": "face_with_bags_under_eyes", "😷": "face_with_medical_mask", "🤒": "face_with_thermometer", "🤕": "face_with_head_bandage", "🤢": "nauseated_face", "🤮": "face_vomiting", "🤧": "sneezing_face", "🥵": "hot_face", "🥶": "cold_face", "🥴": "woozy_face", "😵": "face_with_crossed_out_eyes", "😵‍💫": "face_with_spiral_eyes", "🤯": "exploding_head", "🤠": "cowboy_hat_face", "🥳": "partying_face", "🥸": "disguised_face", "😎": "smiling_face_with_sunglasses", "🤓": "nerd_face", "🧐": "face_with_monocle", "😕": "confused", "🫤": "face_with_diagonal_mouth", "😟": "worried", "🙁": "slightly_frowning_face", "☹": "frowning", "😮": "open_mouth", "😯": "hushed_face", "😲": "astonished_face", "😳": "flushed_face", "🥺": "pleading_face", "🥹": "face_holding_back_tears", "😦": "frowning_face_with_open_mouth", "😧": "anguished_face", "😨": "fearful", "😰": "anxious_face_with_sweat", "😥": "sad_but_relieved_face", "😢": "cry", "😭": "sob", "😱": "scream", "😖": "confounded_face", "😣": "persevering_face", "😞": "disappointed_face", "😓": "downcast_face_with_sweat", "😩": "weary_face", "😫": "tired_face", "🥱": "yawning_face", "😤": "face_with_steam_from_nose", "😡": "enraged_face", "😠": "angry", "🤬": "face_with_symbols_on_mouth", "😈": "smiling_face_with_horns", "👿": "angry_face_with_horns", "💀": "skull", "☠": "skull_and_crossbones", "💩": "poop", "🤡": "clown_face", "👹": "ogre", "👺": "goblin", "👻": "ghost", "👽": "alien", "👾": "alien_monster", "🤖": "robot", "😺": "grinning_cat", "😸": "grinning_cat_with_smiling_eyes", "😹": "joy_cat", "😻": "smiling_cat_with_heart_eyes", "😼": "cat_with_wry_smile", "😽": "kissing_cat", "🙀": "weary_cat", "😿": "crying_cat", "😾": "pouting_cat", "🙈": "see_no_evil_monkey", "🙉": "hear_no_evil_monkey", "🙊": "speak_no_evil_monkey", "💌": "love_letter", "💘": "heart_with_arrow", "💝": "heart_with_ribbon", "💖": "sparkling_heart", "💗": "growing_heart", "💓": "beating_heart", "💞": "revolving_hearts", "💕": "two_hearts", "💟": "heart_decoration", "❣": "heart_exclamation", "💔": "broken_heart", "❤️‍🔥": "heart_on_fire", "❤️‍🩹": "mending_heart", "❤": "heart", "🩷": "pink_heart", "🧡": "orange_heart", "💛": "yellow_heart", "💚": "green_heart", "💙": "blue_heart", "🩵": "light_blue_heart", "💜": "purple_heart", "🤎": "brown_heart", "🖤": "black_heart", "🩶": "grey_heart", "🤍": "white_heart", "💋": "kiss_mark", "💯": "100", "💢": "anger_symbol", "💥": "collision", "💫": "dizzy", "💦": "sweat_droplets", "💨": "dashing_away", "🕳": "hole", "💬": "speech_balloon", "👁️‍🗨️": "eye_in_speech_bubble", "🗨": "left_speech_bubble", "🗯": "right_anger_bubble", "💭": "thought_balloon", "💤": "zzz", "👋": "waving_hand", "👋🏻": "waving_hand:t2", "👋🏼": "waving_hand:t3", "👋🏽": "waving_hand:t4", "👋🏾": "waving_hand:t5", "👋🏿": "waving_hand:t6", "🤚": "raised_back_of_hand", "🤚🏻": "raised_back_of_hand:t2", "🤚🏼": "raised_back_of_hand:t3", "🤚🏽": "raised_back_of_hand:t4", "🤚🏾": "raised_back_of_hand:t5", "🤚🏿": "raised_back_of_hand:t6", "🖐": "hand_with_fingers_splayed", "🖐🏻": "hand_with_fingers_splayed:t2", "🖐🏼": "hand_with_fingers_splayed:t3", "🖐🏽": "hand_with_fingers_splayed:t4", "🖐🏾": "hand_with_fingers_splayed:t5", "🖐🏿": "hand_with_fingers_splayed:t6", "✋": "raised_hand", "✋🏻": "raised_hand:t2", "✋🏼": "raised_hand:t3", "✋🏽": "raised_hand:t4", "✋🏾": "raised_hand:t5", "✋🏿": "raised_hand:t6", "🖖": "vulcan_salute", "🖖🏻": "vulcan_salute:t2", "🖖🏼": "vulcan_salute:t3", "🖖🏽": "vulcan_salute:t4", "🖖🏾": "vulcan_salute:t5", "🖖🏿": "vulcan_salute:t6", "🫱": "rightwards_hand", "🫱🏻": "rightwards_hand:t2", "🫱🏼": "rightwards_hand:t3", "🫱🏽": "rightwards_hand:t4", "🫱🏾": "rightwards_hand:t5", "🫱🏿": "rightwards_hand:t6", "🫲": "leftwards_hand", "🫲🏻": "leftwards_hand:t2", "🫲🏼": "leftwards_hand:t3", "🫲🏽": "leftwards_hand:t4", "🫲🏾": "leftwards_hand:t5", "🫲🏿": "leftwards_hand:t6", "🫳": "palm_down_hand", "🫳🏻": "palm_down_hand:t2", "🫳🏼": "palm_down_hand:t3", "🫳🏽": "palm_down_hand:t4", "🫳🏾": "palm_down_hand:t5", "🫳🏿": "palm_down_hand:t6", "🫴": "palm_up_hand", "🫴🏻": "palm_up_hand:t2", "🫴🏼": "palm_up_hand:t3", "🫴🏽": "palm_up_hand:t4", "🫴🏾": "palm_up_hand:t5", "🫴🏿": "palm_up_hand:t6", "🫷": "leftwards_pushing_hand", "🫷🏻": "leftwards_pushing_hand:t2", "🫷🏼": "leftwards_pushing_hand:t3", "🫷🏽": "leftwards_pushing_hand:t4", "🫷🏾": "leftwards_pushing_hand:t5", "🫷🏿": "leftwards_pushing_hand:t6", "🫸": "rightwards_pushing_hand", "🫸🏻": "rightwards_pushing_hand:t2", "🫸🏼": "rightwards_pushing_hand:t3", "🫸🏽": "rightwards_pushing_hand:t4", "🫸🏾": "rightwards_pushing_hand:t5", "🫸🏿": "rightwards_pushing_hand:t6", "👌": "ok_hand", "👌🏻": "ok_hand:t2", "👌🏼": "ok_hand:t3", "👌🏽": "ok_hand:t4", "👌🏾": "ok_hand:t5", "👌🏿": "ok_hand:t6", "🤌": "pinched_fingers", "🤌🏻": "pinched_fingers:t2", "🤌🏼": "pinched_fingers:t3", "🤌🏽": "pinched_fingers:t4", "🤌🏾": "pinched_fingers:t5", "🤌🏿": "pinched_fingers:t6", "🤏": "pinching_hand", "🤏🏻": "pinching_hand:t2", "🤏🏼": "pinching_hand:t3", "🤏🏽": "pinching_hand:t4", "🤏🏾": "pinching_hand:t5", "🤏🏿": "pinching_hand:t6", "✌": "victory_hand", "✌🏻": "victory_hand:t2", "✌🏼": "victory_hand:t3", "✌🏽": "victory_hand:t4", "✌🏾": "victory_hand:t5", "✌🏿": "victory_hand:t6", "🤞": "crossed_fingers", "🤞🏻": "crossed_fingers:t2", "🤞🏼": "crossed_fingers:t3", "🤞🏽": "crossed_fingers:t4", "🤞🏾": "crossed_fingers:t5", "🤞🏿": "crossed_fingers:t6", "🫰": "hand_with_index_finger_and_thumb_crossed", "🫰🏻": "hand_with_index_finger_and_thumb_crossed:t2", "🫰🏼": "hand_with_index_finger_and_thumb_crossed:t3", "🫰🏽": "hand_with_index_finger_and_thumb_crossed:t4", "🫰🏾": "hand_with_index_finger_and_thumb_crossed:t5", "🫰🏿": "hand_with_index_finger_and_thumb_crossed:t6", "🤟": "love_you_gesture", "🤟🏻": "love_you_gesture:t2", "🤟🏼": "love_you_gesture:t3", "🤟🏽": "love_you_gesture:t4", "🤟🏾": "love_you_gesture:t5", "🤟🏿": "love_you_gesture:t6", "🤘": "sign_of_the_horns", "🤘🏻": "sign_of_the_horns:t2", "🤘🏼": "sign_of_the_horns:t3", "🤘🏽": "sign_of_the_horns:t4", "🤘🏾": "sign_of_the_horns:t5", "🤘🏿": "sign_of_the_horns:t6", "🤙": "call_me_hand", "🤙🏻": "call_me_hand:t2", "🤙🏼": "call_me_hand:t3", "🤙🏽": "call_me_hand:t4", "🤙🏾": "call_me_hand:t5", "🤙🏿": "call_me_hand:t6", "👈": "backhand_index_pointing_left", "👈🏻": "backhand_index_pointing_left:t2", "👈🏼": "backhand_index_pointing_left:t3", "👈🏽": "backhand_index_pointing_left:t4", "👈🏾": "backhand_index_pointing_left:t5", "👈🏿": "backhand_index_pointing_left:t6", "👉": "backhand_index_pointing_right", "👉🏻": "backhand_index_pointing_right:t2", "👉🏼": "backhand_index_pointing_right:t3", "👉🏽": "backhand_index_pointing_right:t4", "👉🏾": "backhand_index_pointing_right:t5", "👉🏿": "backhand_index_pointing_right:t6", "👆": "backhand_index_pointing_up", "👆🏻": "backhand_index_pointing_up:t2", "👆🏼": "backhand_index_pointing_up:t3", "👆🏽": "backhand_index_pointing_up:t4", "👆🏾": "backhand_index_pointing_up:t5", "👆🏿": "backhand_index_pointing_up:t6", "🖕": "fu", "🖕🏻": "fu:t2", "🖕🏼": "fu:t3", "🖕🏽": "fu:t4", "🖕🏾": "fu:t5", "🖕🏿": "fu:t6", "👇": "backhand_index_pointing_down", "👇🏻": "backhand_index_pointing_down:t2", "👇🏼": "backhand_index_pointing_down:t3", "👇🏽": "backhand_index_pointing_down:t4", "👇🏾": "backhand_index_pointing_down:t5", "👇🏿": "backhand_index_pointing_down:t6", "☝": "index_pointing_up", "☝🏻": "index_pointing_up:t2", "☝🏼": "index_pointing_up:t3", "☝🏽": "index_pointing_up:t4", "☝🏾": "index_pointing_up:t5", "☝🏿": "index_pointing_up:t6", "🫵": "index_pointing_at_the_viewer", "🫵🏻": "index_pointing_at_the_viewer:t2", "🫵🏼": "index_pointing_at_the_viewer:t3", "🫵🏽": "index_pointing_at_the_viewer:t4", "🫵🏾": "index_pointing_at_the_viewer:t5", "🫵🏿": "index_pointing_at_the_viewer:t6", "👍": "+1", "👍🏻": "+1:t2", "👍🏼": "+1:t3", "👍🏽": "+1:t4", "👍🏾": "+1:t5", "👍🏿": "+1:t6", "👎": "-1", "👎🏻": "-1:t2", "👎🏼": "-1:t3", "👎🏽": "-1:t4", "👎🏾": "-1:t5", "👎🏿": "-1:t6", "✊": "raised_fist", "✊🏻": "raised_fist:t2", "✊🏼": "raised_fist:t3", "✊🏽": "raised_fist:t4", "✊🏾": "raised_fist:t5", "✊🏿": "raised_fist:t6", "👊": "oncoming_fist", "👊🏻": "oncoming_fist:t2", "👊🏼": "oncoming_fist:t3", "👊🏽": "oncoming_fist:t4", "👊🏾": "oncoming_fist:t5", "👊🏿": "oncoming_fist:t6", "🤛": "left_facing_fist", "🤛🏻": "left_facing_fist:t2", "🤛🏼": "left_facing_fist:t3", "🤛🏽": "left_facing_fist:t4", "🤛🏾": "left_facing_fist:t5", "🤛🏿": "left_facing_fist:t6", "🤜": "right_facing_fist", "🤜🏻": "right_facing_fist:t2", "🤜🏼": "right_facing_fist:t3", "🤜🏽": "right_facing_fist:t4", "🤜🏾": "right_facing_fist:t5", "🤜🏿": "right_facing_fist:t6", "👏": "clap", "👏🏻": "clap:t2", "👏🏼": "clap:t3", "👏🏽": "clap:t4", "👏🏾": "clap:t5", "👏🏿": "clap:t6", "🙌": "raising_hands", "🙌🏻": "raising_hands:t2", "🙌🏼": "raising_hands:t3", "🙌🏽": "raising_hands:t4", "🙌🏾": "raising_hands:t5", "🙌🏿": "raising_hands:t6", "🫶": "heart_hands", "🫶🏻": "heart_hands:t2", "🫶🏼": "heart_hands:t3", "🫶🏽": "heart_hands:t4", "🫶🏾": "heart_hands:t5", "🫶🏿": "heart_hands:t6", "👐": "open_hands", "👐🏻": "open_hands:t2", "👐🏼": "open_hands:t3", "👐🏽": "open_hands:t4", "👐🏾": "open_hands:t5", "👐🏿": "open_hands:t6", "🤲": "palms_up_together", "🤲🏻": "palms_up_together:t2", "🤲🏼": "palms_up_together:t3", "🤲🏽": "palms_up_together:t4", "🤲🏾": "palms_up_together:t5", "🤲🏿": "palms_up_together:t6", "🤝": "handshake", "🤝🏻": "handshake:t2", "🤝🏼": "handshake:t3", "🤝🏽": "handshake:t4", "🤝🏾": "handshake:t5", "🤝🏿": "handshake:t6", "🙏": "folded_hands", "🙏🏻": "folded_hands:t2", "🙏🏼": "folded_hands:t3", "🙏🏽": "folded_hands:t4", "🙏🏾": "folded_hands:t5", "🙏🏿": "folded_hands:t6", "✍": "writing_hand", "✍🏻": "writing_hand:t2", "✍🏼": "writing_hand:t3", "✍🏽": "writing_hand:t4", "✍🏾": "writing_hand:t5", "✍🏿": "writing_hand:t6", "💅": "nail_polish", "💅🏻": "nail_polish:t2", "💅🏼": "nail_polish:t3", "💅🏽": "nail_polish:t4", "💅🏾": "nail_polish:t5", "💅🏿": "nail_polish:t6", "🤳": "selfie", "🤳🏻": "selfie:t2", "🤳🏼": "selfie:t3", "🤳🏽": "selfie:t4", "🤳🏾": "selfie:t5", "🤳🏿": "selfie:t6", "💪": "flexed_biceps", "💪🏻": "flexed_biceps:t2", "💪🏼": "flexed_biceps:t3", "💪🏽": "flexed_biceps:t4", "💪🏾": "flexed_biceps:t5", "💪🏿": "flexed_biceps:t6", "🦾": "mechanical_arm", "🦿": "mechanical_leg", "🦵": "leg", "🦵🏻": "leg:t2", "🦵🏼": "leg:t3", "🦵🏽": "leg:t4", "🦵🏾": "leg:t5", "🦵🏿": "leg:t6", "🦶": "foot", "🦶🏻": "foot:t2", "🦶🏼": "foot:t3", "🦶🏽": "foot:t4", "🦶🏾": "foot:t5", "🦶🏿": "foot:t6", "👂": "ear", "👂🏻": "ear:t2", "👂🏼": "ear:t3", "👂🏽": "ear:t4", "👂🏾": "ear:t5", "👂🏿": "ear:t6", "🦻": "ear_with_hearing_aid", "🦻🏻": "ear_with_hearing_aid:t2", "🦻🏼": "ear_with_hearing_aid:t3", "🦻🏽": "ear_with_hearing_aid:t4", "🦻🏾": "ear_with_hearing_aid:t5", "🦻🏿": "ear_with_hearing_aid:t6", "👃": "nose", "👃🏻": "nose:t2", "👃🏼": "nose:t3", "👃🏽": "nose:t4", "👃🏾": "nose:t5", "👃🏿": "nose:t6", "🧠": "brain", "🫀": "anatomical_heart", "🫁": "lungs", "🦷": "tooth", "🦴": "bone", "👀": "eyes", "👁": "eye", "👅": "tongue", "👄": "mouth", "🫦": "biting_lip", "👶": "baby", "👶🏻": "baby:t2", "👶🏼": "baby:t3", "👶🏽": "baby:t4", "👶🏾": "baby:t5", "👶🏿": "baby:t6", "🧒": "child", "🧒🏻": "child:t2", "🧒🏼": "child:t3", "🧒🏽": "child:t4", "🧒🏾": "child:t5", "🧒🏿": "child:t6", "👦": "boy", "👦🏻": "boy:t2", "👦🏼": "boy:t3", "👦🏽": "boy:t4", "👦🏾": "boy:t5", "👦🏿": "boy:t6", "👧": "girl", "👧🏻": "girl:t2", "👧🏼": "girl:t3", "👧🏽": "girl:t4", "👧🏾": "girl:t5", "👧🏿": "girl:t6", "🧑": "person", "🧑🏻": "person:t2", "🧑🏼": "person:t3", "🧑🏽": "person:t4", "🧑🏾": "person:t5", "🧑🏿": "person:t6", "👱": "person_blond_hair", "👱🏻": "person_blond_hair:t2", "👱🏼": "person_blond_hair:t3", "👱🏽": "person_blond_hair:t4", "👱🏾": "person_blond_hair:t5", "👱🏿": "person_blond_hair:t6", "👨": "man", "👨🏻": "man:t2", "👨🏼": "man:t3", "👨🏽": "man:t4", "👨🏾": "man:t5", "👨🏿": "man:t6", "🧔": "person_beard", "🧔🏻": "person_beard:t2", "🧔🏼": "person_beard:t3", "🧔🏽": "person_beard:t4", "🧔🏾": "person_beard:t5", "🧔🏿": "person_beard:t6", "🧔‍♂️": "man_beard", "🧔🏻‍♂️": "man_beard:t2", "🧔🏼‍♂️": "man_beard:t3", "🧔🏽‍♂️": "man_beard:t4", "🧔🏾‍♂️": "man_beard:t5", "🧔🏿‍♂️": "man_beard:t6", "🧔‍♀️": "woman_beard", "🧔🏻‍♀️": "woman_beard:t2", "🧔🏼‍♀️": "woman_beard:t3", "🧔🏽‍♀️": "woman_beard:t4", "🧔🏾‍♀️": "woman_beard:t5", "🧔🏿‍♀️": "woman_beard:t6", "👨‍🦰": "man_red_hair", "👨🏻‍🦰": "man_red_hair:t2", "👨🏼‍🦰": "man_red_hair:t3", "👨🏽‍🦰": "man_red_hair:t4", "👨🏾‍🦰": "man_red_hair:t5", "👨🏿‍🦰": "man_red_hair:t6", "👨‍🦱": "man_curly_hair", "👨🏻‍🦱": "man_curly_hair:t2", "👨🏼‍🦱": "man_curly_hair:t3", "👨🏽‍🦱": "man_curly_hair:t4", "👨🏾‍🦱": "man_curly_hair:t5", "👨🏿‍🦱": "man_curly_hair:t6", "👨‍🦳": "man_white_hair", "👨🏻‍🦳": "man_white_hair:t2", "👨🏼‍🦳": "man_white_hair:t3", "👨🏽‍🦳": "man_white_hair:t4", "👨🏾‍🦳": "man_white_hair:t5", "👨🏿‍🦳": "man_white_hair:t6", "👨‍🦲": "man_bald", "👨🏻‍🦲": "man_bald:t2", "👨🏼‍🦲": "man_bald:t3", "👨🏽‍🦲": "man_bald:t4", "👨🏾‍🦲": "man_bald:t5", "👨🏿‍🦲": "man_bald:t6", "👩": "woman", "👩🏻": "woman:t2", "👩🏼": "woman:t3", "👩🏽": "woman:t4", "👩🏾": "woman:t5", "👩🏿": "woman:t6", "👩‍🦰": "woman_red_hair", "👩🏻‍🦰": "woman_red_hair:t2", "👩🏼‍🦰": "woman_red_hair:t3", "👩🏽‍🦰": "woman_red_hair:t4", "👩🏾‍🦰": "woman_red_hair:t5", "👩🏿‍🦰": "woman_red_hair:t6", "🧑‍🦰": "person_red_hair", "🧑🏻‍🦰": "person_red_hair:t2", "🧑🏼‍🦰": "person_red_hair:t3", "🧑🏽‍🦰": "person_red_hair:t4", "🧑🏾‍🦰": "person_red_hair:t5", "🧑🏿‍🦰": "person_red_hair:t6", "👩‍🦱": "woman_curly_hair", "👩🏻‍🦱": "woman_curly_hair:t2", "👩🏼‍🦱": "woman_curly_hair:t3", "👩🏽‍🦱": "woman_curly_hair:t4", "👩🏾‍🦱": "woman_curly_hair:t5", "👩🏿‍🦱": "woman_curly_hair:t6", "🧑‍🦱": "person_curly_hair", "🧑🏻‍🦱": "person_curly_hair:t2", "🧑🏼‍🦱": "person_curly_hair:t3", "🧑🏽‍🦱": "person_curly_hair:t4", "🧑🏾‍🦱": "person_curly_hair:t5", "🧑🏿‍🦱": "person_curly_hair:t6", "👩‍🦳": "woman_white_hair", "👩🏻‍🦳": "woman_white_hair:t2", "👩🏼‍🦳": "woman_white_hair:t3", "👩🏽‍🦳": "woman_white_hair:t4", "👩🏾‍🦳": "woman_white_hair:t5", "👩🏿‍🦳": "woman_white_hair:t6", "🧑‍🦳": "person_white_hair", "🧑🏻‍🦳": "person_white_hair:t2", "🧑🏼‍🦳": "person_white_hair:t3", "🧑🏽‍🦳": "person_white_hair:t4", "🧑🏾‍🦳": "person_white_hair:t5", "🧑🏿‍🦳": "person_white_hair:t6", "👩‍🦲": "woman_bald", "👩🏻‍🦲": "woman_bald:t2", "👩🏼‍🦲": "woman_bald:t3", "👩🏽‍🦲": "woman_bald:t4", "👩🏾‍🦲": "woman_bald:t5", "👩🏿‍🦲": "woman_bald:t6", "🧑‍🦲": "person_bald", "🧑🏻‍🦲": "person_bald:t2", "🧑🏼‍🦲": "person_bald:t3", "🧑🏽‍🦲": "person_bald:t4", "🧑🏾‍🦲": "person_bald:t5", "🧑🏿‍🦲": "person_bald:t6", "👱‍♀️": "blonde_woman", "👱🏻‍♀️": "blonde_woman:t2", "👱🏼‍♀️": "blonde_woman:t3", "👱🏽‍♀️": "blonde_woman:t4", "👱🏾‍♀️": "blonde_woman:t5", "👱🏿‍♀️": "blonde_woman:t6", "👱‍♂️": "blonde_man", "👱🏻‍♂️": "blonde_man:t2", "👱🏼‍♂️": "blonde_man:t3", "👱🏽‍♂️": "blonde_man:t4", "👱🏾‍♂️": "blonde_man:t5", "👱🏿‍♂️": "blonde_man:t6", "🧓": "older_person", "🧓🏻": "older_person:t2", "🧓🏼": "older_person:t3", "🧓🏽": "older_person:t4", "🧓🏾": "older_person:t5", "🧓🏿": "older_person:t6", "👴": "old_man", "👴🏻": "old_man:t2", "👴🏼": "old_man:t3", "👴🏽": "old_man:t4", "👴🏾": "old_man:t5", "👴🏿": "old_man:t6", "👵": "old_woman", "👵🏻": "old_woman:t2", "👵🏼": "old_woman:t3", "👵🏽": "old_woman:t4", "👵🏾": "old_woman:t5", "👵🏿": "old_woman:t6", "🙍": "person_frowning", "🙍🏻": "person_frowning:t2", "🙍🏼": "person_frowning:t3", "🙍🏽": "person_frowning:t4", "🙍🏾": "person_frowning:t5", "🙍🏿": "person_frowning:t6", "🙍‍♂️": "man_frowning", "🙍🏻‍♂️": "man_frowning:t2", "🙍🏼‍♂️": "man_frowning:t3", "🙍🏽‍♂️": "man_frowning:t4", "🙍🏾‍♂️": "man_frowning:t5", "🙍🏿‍♂️": "man_frowning:t6", "🙍‍♀️": "woman_frowning", "🙍🏻‍♀️": "woman_frowning:t2", "🙍🏼‍♀️": "woman_frowning:t3", "🙍🏽‍♀️": "woman_frowning:t4", "🙍🏾‍♀️": "woman_frowning:t5", "🙍🏿‍♀️": "woman_frowning:t6", "🙎": "person_pouting", "🙎🏻": "person_pouting:t2", "🙎🏼": "person_pouting:t3", "🙎🏽": "person_pouting:t4", "🙎🏾": "person_pouting:t5", "🙎🏿": "person_pouting:t6", "🙎‍♂️": "man_pouting", "🙎🏻‍♂️": "man_pouting:t2", "🙎🏼‍♂️": "man_pouting:t3", "🙎🏽‍♂️": "man_pouting:t4", "🙎🏾‍♂️": "man_pouting:t5", "🙎🏿‍♂️": "man_pouting:t6", "🙎‍♀️": "woman_pouting", "🙎🏻‍♀️": "woman_pouting:t2", "🙎🏼‍♀️": "woman_pouting:t3", "🙎🏽‍♀️": "woman_pouting:t4", "🙎🏾‍♀️": "woman_pouting:t5", "🙎🏿‍♀️": "woman_pouting:t6", "🙅": "person_gesturing_no", "🙅🏻": "person_gesturing_no:t2", "🙅🏼": "person_gesturing_no:t3", "🙅🏽": "person_gesturing_no:t4", "🙅🏾": "person_gesturing_no:t5", "🙅🏿": "person_gesturing_no:t6", "🙅‍♂️": "man_gesturing_no", "🙅🏻‍♂️": "man_gesturing_no:t2", "🙅🏼‍♂️": "man_gesturing_no:t3", "🙅🏽‍♂️": "man_gesturing_no:t4", "🙅🏾‍♂️": "man_gesturing_no:t5", "🙅🏿‍♂️": "man_gesturing_no:t6", "🙅‍♀️": "woman_gesturing_no", "🙅🏻‍♀️": "woman_gesturing_no:t2", "🙅🏼‍♀️": "woman_gesturing_no:t3", "🙅🏽‍♀️": "woman_gesturing_no:t4", "🙅🏾‍♀️": "woman_gesturing_no:t5", "🙅🏿‍♀️": "woman_gesturing_no:t6", "🙆": "person_gesturing_ok", "🙆🏻": "person_gesturing_ok:t2", "🙆🏼": "person_gesturing_ok:t3", "🙆🏽": "person_gesturing_ok:t4", "🙆🏾": "person_gesturing_ok:t5", "🙆🏿": "person_gesturing_ok:t6", "🙆‍♂️": "man_gesturing_ok", "🙆🏻‍♂️": "man_gesturing_ok:t2", "🙆🏼‍♂️": "man_gesturing_ok:t3", "🙆🏽‍♂️": "man_gesturing_ok:t4", "🙆🏾‍♂️": "man_gesturing_ok:t5", "🙆🏿‍♂️": "man_gesturing_ok:t6", "🙆‍♀️": "woman_gesturing_ok", "🙆🏻‍♀️": "woman_gesturing_ok:t2", "🙆🏼‍♀️": "woman_gesturing_ok:t3", "🙆🏽‍♀️": "woman_gesturing_ok:t4", "🙆🏾‍♀️": "woman_gesturing_ok:t5", "🙆🏿‍♀️": "woman_gesturing_ok:t6", "💁": "person_tipping_hand", "💁🏻": "person_tipping_hand:t2", "💁🏼": "person_tipping_hand:t3", "💁🏽": "person_tipping_hand:t4", "💁🏾": "person_tipping_hand:t5", "💁🏿": "person_tipping_hand:t6", "💁‍♂️": "man_tipping_hand", "💁🏻‍♂️": "man_tipping_hand:t2", "💁🏼‍♂️": "man_tipping_hand:t3", "💁🏽‍♂️": "man_tipping_hand:t4", "💁🏾‍♂️": "man_tipping_hand:t5", "💁🏿‍♂️": "man_tipping_hand:t6", "💁‍♀️": "woman_tipping_hand", "💁🏻‍♀️": "woman_tipping_hand:t2", "💁🏼‍♀️": "woman_tipping_hand:t3", "💁🏽‍♀️": "woman_tipping_hand:t4", "💁🏾‍♀️": "woman_tipping_hand:t5", "💁🏿‍♀️": "woman_tipping_hand:t6", "🙋": "person_raising_hand", "🙋🏻": "person_raising_hand:t2", "🙋🏼": "person_raising_hand:t3", "🙋🏽": "person_raising_hand:t4", "🙋🏾": "person_raising_hand:t5", "🙋🏿": "person_raising_hand:t6", "🙋‍♂️": "man_raising_hand", "🙋🏻‍♂️": "man_raising_hand:t2", "🙋🏼‍♂️": "man_raising_hand:t3", "🙋🏽‍♂️": "man_raising_hand:t4", "🙋🏾‍♂️": "man_raising_hand:t5", "🙋🏿‍♂️": "man_raising_hand:t6", "🙋‍♀️": "woman_raising_hand", "🙋🏻‍♀️": "woman_raising_hand:t2", "🙋🏼‍♀️": "woman_raising_hand:t3", "🙋🏽‍♀️": "woman_raising_hand:t4", "🙋🏾‍♀️": "woman_raising_hand:t5", "🙋🏿‍♀️": "woman_raising_hand:t6", "🧏": "deaf_person", "🧏🏻": "deaf_person:t2", "🧏🏼": "deaf_person:t3", "🧏🏽": "deaf_person:t4", "🧏🏾": "deaf_person:t5", "🧏🏿": "deaf_person:t6", "🧏‍♂️": "deaf_man", "🧏🏻‍♂️": "deaf_man:t2", "🧏🏼‍♂️": "deaf_man:t3", "🧏🏽‍♂️": "deaf_man:t4", "🧏🏾‍♂️": "deaf_man:t5", "🧏🏿‍♂️": "deaf_man:t6", "🧏‍♀️": "deaf_woman", "🧏🏻‍♀️": "deaf_woman:t2", "🧏🏼‍♀️": "deaf_woman:t3", "🧏🏽‍♀️": "deaf_woman:t4", "🧏🏾‍♀️": "deaf_woman:t5", "🧏🏿‍♀️": "deaf_woman:t6", "🙇": "person_bowing", "🙇🏻": "person_bowing:t2", "🙇🏼": "person_bowing:t3", "🙇🏽": "person_bowing:t4", "🙇🏾": "person_bowing:t5", "🙇🏿": "person_bowing:t6", "🙇‍♂️": "man_bowing", "🙇🏻‍♂️": "man_bowing:t2", "🙇🏼‍♂️": "man_bowing:t3", "🙇🏽‍♂️": "man_bowing:t4", "🙇🏾‍♂️": "man_bowing:t5", "🙇🏿‍♂️": "man_bowing:t6", "🙇‍♀️": "woman_bowing", "🙇🏻‍♀️": "woman_bowing:t2", "🙇🏼‍♀️": "woman_bowing:t3", "🙇🏽‍♀️": "woman_bowing:t4", "🙇🏾‍♀️": "woman_bowing:t5", "🙇🏿‍♀️": "woman_bowing:t6", "🤦": "person_facepalming", "🤦🏻": "person_facepalming:t2", "🤦🏼": "person_facepalming:t3", "🤦🏽": "person_facepalming:t4", "🤦🏾": "person_facepalming:t5", "🤦🏿": "person_facepalming:t6", "🤦‍♂️": "man_facepalming", "🤦🏻‍♂️": "man_facepalming:t2", "🤦🏼‍♂️": "man_facepalming:t3", "🤦🏽‍♂️": "man_facepalming:t4", "🤦🏾‍♂️": "man_facepalming:t5", "🤦🏿‍♂️": "man_facepalming:t6", "🤦‍♀️": "woman_facepalming", "🤦🏻‍♀️": "woman_facepalming:t2", "🤦🏼‍♀️": "woman_facepalming:t3", "🤦🏽‍♀️": "woman_facepalming:t4", "🤦🏾‍♀️": "woman_facepalming:t5", "🤦🏿‍♀️": "woman_facepalming:t6", "🤷": "person_shrugging", "🤷🏻": "person_shrugging:t2", "🤷🏼": "person_shrugging:t3", "🤷🏽": "person_shrugging:t4", "🤷🏾": "person_shrugging:t5", "🤷🏿": "person_shrugging:t6", "🤷‍♂️": "man_shrugging", "🤷🏻‍♂️": "man_shrugging:t2", "🤷🏼‍♂️": "man_shrugging:t3", "🤷🏽‍♂️": "man_shrugging:t4", "🤷🏾‍♂️": "man_shrugging:t5", "🤷🏿‍♂️": "man_shrugging:t6", "🤷‍♀️": "woman_shrugging", "🤷🏻‍♀️": "woman_shrugging:t2", "🤷🏼‍♀️": "woman_shrugging:t3", "🤷🏽‍♀️": "woman_shrugging:t4", "🤷🏾‍♀️": "woman_shrugging:t5", "🤷🏿‍♀️": "woman_shrugging:t6", "🧑‍⚕️": "health_worker", "🧑🏻‍⚕️": "health_worker:t2", "🧑🏼‍⚕️": "health_worker:t3", "🧑🏽‍⚕️": "health_worker:t4", "🧑🏾‍⚕️": "health_worker:t5", "🧑🏿‍⚕️": "health_worker:t6", "👨‍⚕️": "man_health_worker", "👨🏻‍⚕️": "man_health_worker:t2", "👨🏼‍⚕️": "man_health_worker:t3", "👨🏽‍⚕️": "man_health_worker:t4", "👨🏾‍⚕️": "man_health_worker:t5", "👨🏿‍⚕️": "man_health_worker:t6", "👩‍⚕️": "woman_health_worker", "👩🏻‍⚕️": "woman_health_worker:t2", "👩🏼‍⚕️": "woman_health_worker:t3", "👩🏽‍⚕️": "woman_health_worker:t4", "👩🏾‍⚕️": "woman_health_worker:t5", "👩🏿‍⚕️": "woman_health_worker:t6", "🧑‍🎓": "student", "🧑🏻‍🎓": "student:t2", "🧑🏼‍🎓": "student:t3", "🧑🏽‍🎓": "student:t4", "🧑🏾‍🎓": "student:t5", "🧑🏿‍🎓": "student:t6", "👨‍🎓": "man_student", "👨🏻‍🎓": "man_student:t2", "👨🏼‍🎓": "man_student:t3", "👨🏽‍🎓": "man_student:t4", "👨🏾‍🎓": "man_student:t5", "👨🏿‍🎓": "man_student:t6", "👩‍🎓": "woman_student", "👩🏻‍🎓": "woman_student:t2", "👩🏼‍🎓": "woman_student:t3", "👩🏽‍🎓": "woman_student:t4", "👩🏾‍🎓": "woman_student:t5", "👩🏿‍🎓": "woman_student:t6", "🧑‍🏫": "teacher", "🧑🏻‍🏫": "teacher:t2", "🧑🏼‍🏫": "teacher:t3", "🧑🏽‍🏫": "teacher:t4", "🧑🏾‍🏫": "teacher:t5", "🧑🏿‍🏫": "teacher:t6", "👨‍🏫": "man_teacher", "👨🏻‍🏫": "man_teacher:t2", "👨🏼‍🏫": "man_teacher:t3", "👨🏽‍🏫": "man_teacher:t4", "👨🏾‍🏫": "man_teacher:t5", "👨🏿‍🏫": "man_teacher:t6", "👩‍🏫": "woman_teacher", "👩🏻‍🏫": "woman_teacher:t2", "👩🏼‍🏫": "woman_teacher:t3", "👩🏽‍🏫": "woman_teacher:t4", "👩🏾‍🏫": "woman_teacher:t5", "👩🏿‍🏫": "woman_teacher:t6", "🧑‍⚖️": "judge", "🧑🏻‍⚖️": "judge:t2", "🧑🏼‍⚖️": "judge:t3", "🧑🏽‍⚖️": "judge:t4", "🧑🏾‍⚖️": "judge:t5", "🧑🏿‍⚖️": "judge:t6", "👨‍⚖️": "man_judge", "👨🏻‍⚖️": "man_judge:t2", "👨🏼‍⚖️": "man_judge:t3", "👨🏽‍⚖️": "man_judge:t4", "👨🏾‍⚖️": "man_judge:t5", "👨🏿‍⚖️": "man_judge:t6", "👩‍⚖️": "woman_judge", "👩🏻‍⚖️": "woman_judge:t2", "👩🏼‍⚖️": "woman_judge:t3", "👩🏽‍⚖️": "woman_judge:t4", "👩🏾‍⚖️": "woman_judge:t5", "👩🏿‍⚖️": "woman_judge:t6", "🧑‍🌾": "farmer", "🧑🏻‍🌾": "farmer:t2", "🧑🏼‍🌾": "farmer:t3", "🧑🏽‍🌾": "farmer:t4", "🧑🏾‍🌾": "farmer:t5", "🧑🏿‍🌾": "farmer:t6", "👨‍🌾": "man_farmer", "👨🏻‍🌾": "man_farmer:t2", "👨🏼‍🌾": "man_farmer:t3", "👨🏽‍🌾": "man_farmer:t4", "👨🏾‍🌾": "man_farmer:t5", "👨🏿‍🌾": "man_farmer:t6", "👩‍🌾": "woman_farmer", "👩🏻‍🌾": "woman_farmer:t2", "👩🏼‍🌾": "woman_farmer:t3", "👩🏽‍🌾": "woman_farmer:t4", "👩🏾‍🌾": "woman_farmer:t5", "👩🏿‍🌾": "woman_farmer:t6", "🧑‍🍳": "cook", "🧑🏻‍🍳": "cook:t2", "🧑🏼‍🍳": "cook:t3", "🧑🏽‍🍳": "cook:t4", "🧑🏾‍🍳": "cook:t5", "🧑🏿‍🍳": "cook:t6", "👨‍🍳": "man_cook", "👨🏻‍🍳": "man_cook:t2", "👨🏼‍🍳": "man_cook:t3", "👨🏽‍🍳": "man_cook:t4", "👨🏾‍🍳": "man_cook:t5", "👨🏿‍🍳": "man_cook:t6", "👩‍🍳": "woman_cook", "👩🏻‍🍳": "woman_cook:t2", "👩🏼‍🍳": "woman_cook:t3", "👩🏽‍🍳": "woman_cook:t4", "👩🏾‍🍳": "woman_cook:t5", "👩🏿‍🍳": "woman_cook:t6", "🧑‍🔧": "mechanic", "🧑🏻‍🔧": "mechanic:t2", "🧑🏼‍🔧": "mechanic:t3", "🧑🏽‍🔧": "mechanic:t4", "🧑🏾‍🔧": "mechanic:t5", "🧑🏿‍🔧": "mechanic:t6", "👨‍🔧": "man_mechanic", "👨🏻‍🔧": "man_mechanic:t2", "👨🏼‍🔧": "man_mechanic:t3", "👨🏽‍🔧": "man_mechanic:t4", "👨🏾‍🔧": "man_mechanic:t5", "👨🏿‍🔧": "man_mechanic:t6", "👩‍🔧": "woman_mechanic", "👩🏻‍🔧": "woman_mechanic:t2", "👩🏼‍🔧": "woman_mechanic:t3", "👩🏽‍🔧": "woman_mechanic:t4", "👩🏾‍🔧": "woman_mechanic:t5", "👩🏿‍🔧": "woman_mechanic:t6", "🧑‍🏭": "factory_worker", "🧑🏻‍🏭": "factory_worker:t2", "🧑🏼‍🏭": "factory_worker:t3", "🧑🏽‍🏭": "factory_worker:t4", "🧑🏾‍🏭": "factory_worker:t5", "🧑🏿‍🏭": "factory_worker:t6", "👨‍🏭": "man_factory_worker", "👨🏻‍🏭": "man_factory_worker:t2", "👨🏼‍🏭": "man_factory_worker:t3", "👨🏽‍🏭": "man_factory_worker:t4", "👨🏾‍🏭": "man_factory_worker:t5", "👨🏿‍🏭": "man_factory_worker:t6", "👩‍🏭": "woman_factory_worker", "👩🏻‍🏭": "woman_factory_worker:t2", "👩🏼‍🏭": "woman_factory_worker:t3", "👩🏽‍🏭": "woman_factory_worker:t4", "👩🏾‍🏭": "woman_factory_worker:t5", "👩🏿‍🏭": "woman_factory_worker:t6", "🧑‍💼": "office_worker", "🧑🏻‍💼": "office_worker:t2", "🧑🏼‍💼": "office_worker:t3", "🧑🏽‍💼": "office_worker:t4", "🧑🏾‍💼": "office_worker:t5", "🧑🏿‍💼": "office_worker:t6", "👨‍💼": "man_office_worker", "👨🏻‍💼": "man_office_worker:t2", "👨🏼‍💼": "man_office_worker:t3", "👨🏽‍💼": "man_office_worker:t4", "👨🏾‍💼": "man_office_worker:t5", "👨🏿‍💼": "man_office_worker:t6", "👩‍💼": "woman_office_worker", "👩🏻‍💼": "woman_office_worker:t2", "👩🏼‍💼": "woman_office_worker:t3", "👩🏽‍💼": "woman_office_worker:t4", "👩🏾‍💼": "woman_office_worker:t5", "👩🏿‍💼": "woman_office_worker:t6", "🧑‍🔬": "scientist", "🧑🏻‍🔬": "scientist:t2", "🧑🏼‍🔬": "scientist:t3", "🧑🏽‍🔬": "scientist:t4", "🧑🏾‍🔬": "scientist:t5", "🧑🏿‍🔬": "scientist:t6", "👨‍🔬": "man_scientist", "👨🏻‍🔬": "man_scientist:t2", "👨🏼‍🔬": "man_scientist:t3", "👨🏽‍🔬": "man_scientist:t4", "👨🏾‍🔬": "man_scientist:t5", "👨🏿‍🔬": "man_scientist:t6", "👩‍🔬": "woman_scientist", "👩🏻‍🔬": "woman_scientist:t2", "👩🏼‍🔬": "woman_scientist:t3", "👩🏽‍🔬": "woman_scientist:t4", "👩🏾‍🔬": "woman_scientist:t5", "👩🏿‍🔬": "woman_scientist:t6", "🧑‍💻": "technologist", "🧑🏻‍💻": "technologist:t2", "🧑🏼‍💻": "technologist:t3", "🧑🏽‍💻": "technologist:t4", "🧑🏾‍💻": "technologist:t5", "🧑🏿‍💻": "technologist:t6", "👨‍💻": "man_technologist", "👨🏻‍💻": "man_technologist:t2", "👨🏼‍💻": "man_technologist:t3", "👨🏽‍💻": "man_technologist:t4", "👨🏾‍💻": "man_technologist:t5", "👨🏿‍💻": "man_technologist:t6", "👩‍💻": "woman_technologist", "👩🏻‍💻": "woman_technologist:t2", "👩🏼‍💻": "woman_technologist:t3", "👩🏽‍💻": "woman_technologist:t4", "👩🏾‍💻": "woman_technologist:t5", "👩🏿‍💻": "woman_technologist:t6", "🧑‍🎤": "singer", "🧑🏻‍🎤": "singer:t2", "🧑🏼‍🎤": "singer:t3", "🧑🏽‍🎤": "singer:t4", "🧑🏾‍🎤": "singer:t5", "🧑🏿‍🎤": "singer:t6", "👨‍🎤": "man_singer", "👨🏻‍🎤": "man_singer:t2", "👨🏼‍🎤": "man_singer:t3", "👨🏽‍🎤": "man_singer:t4", "👨🏾‍🎤": "man_singer:t5", "👨🏿‍🎤": "man_singer:t6", "👩‍🎤": "woman_singer", "👩🏻‍🎤": "woman_singer:t2", "👩🏼‍🎤": "woman_singer:t3", "👩🏽‍🎤": "woman_singer:t4", "👩🏾‍🎤": "woman_singer:t5", "👩🏿‍🎤": "woman_singer:t6", "🧑‍🎨": "artist", "🧑🏻‍🎨": "artist:t2", "🧑🏼‍🎨": "artist:t3", "🧑🏽‍🎨": "artist:t4", "🧑🏾‍🎨": "artist:t5", "🧑🏿‍🎨": "artist:t6", "👨‍🎨": "man_artist", "👨🏻‍🎨": "man_artist:t2", "👨🏼‍🎨": "man_artist:t3", "👨🏽‍🎨": "man_artist:t4", "👨🏾‍🎨": "man_artist:t5", "👨🏿‍🎨": "man_artist:t6", "👩‍🎨": "woman_artist", "👩🏻‍🎨": "woman_artist:t2", "👩🏼‍🎨": "woman_artist:t3", "👩🏽‍🎨": "woman_artist:t4", "👩🏾‍🎨": "woman_artist:t5", "👩🏿‍🎨": "woman_artist:t6", "🧑‍✈️": "pilot", "🧑🏻‍✈️": "pilot:t2", "🧑🏼‍✈️": "pilot:t3", "🧑🏽‍✈️": "pilot:t4", "🧑🏾‍✈️": "pilot:t5", "🧑🏿‍✈️": "pilot:t6", "👨‍✈️": "man_pilot", "👨🏻‍✈️": "man_pilot:t2", "👨🏼‍✈️": "man_pilot:t3", "👨🏽‍✈️": "man_pilot:t4", "👨🏾‍✈️": "man_pilot:t5", "👨🏿‍✈️": "man_pilot:t6", "👩‍✈️": "woman_pilot", "👩🏻‍✈️": "woman_pilot:t2", "👩🏼‍✈️": "woman_pilot:t3", "👩🏽‍✈️": "woman_pilot:t4", "👩🏾‍✈️": "woman_pilot:t5", "👩🏿‍✈️": "woman_pilot:t6", "🧑‍🚀": "astronaut", "🧑🏻‍🚀": "astronaut:t2", "🧑🏼‍🚀": "astronaut:t3", "🧑🏽‍🚀": "astronaut:t4", "🧑🏾‍🚀": "astronaut:t5", "🧑🏿‍🚀": "astronaut:t6", "👨‍🚀": "man_astronaut", "👨🏻‍🚀": "man_astronaut:t2", "👨🏼‍🚀": "man_astronaut:t3", "👨🏽‍🚀": "man_astronaut:t4", "👨🏾‍🚀": "man_astronaut:t5", "👨🏿‍🚀": "man_astronaut:t6", "👩‍🚀": "woman_astronaut", "👩🏻‍🚀": "woman_astronaut:t2", "👩🏼‍🚀": "woman_astronaut:t3", "👩🏽‍🚀": "woman_astronaut:t4", "👩🏾‍🚀": "woman_astronaut:t5", "👩🏿‍🚀": "woman_astronaut:t6", "🧑‍🚒": "firefighter", "🧑🏻‍🚒": "firefighter:t2", "🧑🏼‍🚒": "firefighter:t3", "🧑🏽‍🚒": "firefighter:t4", "🧑🏾‍🚒": "firefighter:t5", "🧑🏿‍🚒": "firefighter:t6", "👨‍🚒": "man_firefighter", "👨🏻‍🚒": "man_firefighter:t2", "👨🏼‍🚒": "man_firefighter:t3", "👨🏽‍🚒": "man_firefighter:t4", "👨🏾‍🚒": "man_firefighter:t5", "👨🏿‍🚒": "man_firefighter:t6", "👩‍🚒": "woman_firefighter", "👩🏻‍🚒": "woman_firefighter:t2", "👩🏼‍🚒": "woman_firefighter:t3", "👩🏽‍🚒": "woman_firefighter:t4", "👩🏾‍🚒": "woman_firefighter:t5", "👩🏿‍🚒": "woman_firefighter:t6", "👮": "police_officer", "👮🏻": "police_officer:t2", "👮🏼": "police_officer:t3", "👮🏽": "police_officer:t4", "👮🏾": "police_officer:t5", "👮🏿": "police_officer:t6", "👮‍♂️": "man_police_officer", "👮🏻‍♂️": "man_police_officer:t2", "👮🏼‍♂️": "man_police_officer:t3", "👮🏽‍♂️": "man_police_officer:t4", "👮🏾‍♂️": "man_police_officer:t5", "👮🏿‍♂️": "man_police_officer:t6", "👮‍♀️": "woman_police_officer", "👮🏻‍♀️": "woman_police_officer:t2", "👮🏼‍♀️": "woman_police_officer:t3", "👮🏽‍♀️": "woman_police_officer:t4", "👮🏾‍♀️": "woman_police_officer:t5", "👮🏿‍♀️": "woman_police_officer:t6", "🕵": "detective", "🕵🏻": "detective:t2", "🕵🏼": "detective:t3", "🕵🏽": "detective:t4", "🕵🏾": "detective:t5", "🕵🏿": "detective:t6", "🕵️‍♂️": "man_detective", "🕵🏻️‍♂️": "man_detective:t2", "🕵🏼️‍♂️": "man_detective:t3", "🕵🏽️‍♂️": "man_detective:t4", "🕵🏾️‍♂️": "man_detective:t5", "🕵🏿️‍♂️": "man_detective:t6", "🕵️‍♀️": "woman_detective", "🕵🏻️‍♀️": "woman_detective:t2", "🕵🏼️‍♀️": "woman_detective:t3", "🕵🏽️‍♀️": "woman_detective:t4", "🕵🏾️‍♀️": "woman_detective:t5", "🕵🏿️‍♀️": "woman_detective:t6", "💂": "guard", "💂🏻": "guard:t2", "💂🏼": "guard:t3", "💂🏽": "guard:t4", "💂🏾": "guard:t5", "💂🏿": "guard:t6", "💂‍♂️": "man_guard", "💂🏻‍♂️": "man_guard:t2", "💂🏼‍♂️": "man_guard:t3", "💂🏽‍♂️": "man_guard:t4", "💂🏾‍♂️": "man_guard:t5", "💂🏿‍♂️": "man_guard:t6", "💂‍♀️": "woman_guard", "💂🏻‍♀️": "woman_guard:t2", "💂🏼‍♀️": "woman_guard:t3", "💂🏽‍♀️": "woman_guard:t4", "💂🏾‍♀️": "woman_guard:t5", "💂🏿‍♀️": "woman_guard:t6", "🥷": "ninja", "🥷🏻": "ninja:t2", "🥷🏼": "ninja:t3", "🥷🏽": "ninja:t4", "🥷🏾": "ninja:t5", "🥷🏿": "ninja:t6", "👷": "letruction_worker", "👷🏻": "letruction_worker:t2", "👷🏼": "letruction_worker:t3", "👷🏽": "letruction_worker:t4", "👷🏾": "letruction_worker:t5", "👷🏿": "letruction_worker:t6", "👷‍♂️": "letruction_worker_man", "👷🏻‍♂️": "letruction_worker_man:t2", "👷🏼‍♂️": "letruction_worker_man:t3", "👷🏽‍♂️": "letruction_worker_man:t4", "👷🏾‍♂️": "letruction_worker_man:t5", "👷🏿‍♂️": "letruction_worker_man:t6", "👷‍♀️": "letruction_worker_woman", "👷🏻‍♀️": "letruction_worker_woman:t2", "👷🏼‍♀️": "letruction_worker_woman:t3", "👷🏽‍♀️": "letruction_worker_woman:t4", "👷🏾‍♀️": "letruction_worker_woman:t5", "👷🏿‍♀️": "letruction_worker_woman:t6", "🫅": "person_with_crown", "🫅🏻": "person_with_crown:t2", "🫅🏼": "person_with_crown:t3", "🫅🏽": "person_with_crown:t4", "🫅🏾": "person_with_crown:t5", "🫅🏿": "person_with_crown:t6", "🤴": "prince", "🤴🏻": "prince:t2", "🤴🏼": "prince:t3", "🤴🏽": "prince:t4", "🤴🏾": "prince:t5", "🤴🏿": "prince:t6", "👸": "princess", "👸🏻": "princess:t2", "👸🏼": "princess:t3", "👸🏽": "princess:t4", "👸🏾": "princess:t5", "👸🏿": "princess:t6", "👳": "person_wearing_turban", "👳🏻": "person_wearing_turban:t2", "👳🏼": "person_wearing_turban:t3", "👳🏽": "person_wearing_turban:t4", "👳🏾": "person_wearing_turban:t5", "👳🏿": "person_wearing_turban:t6", "👳‍♂️": "man_wearing_turban", "👳🏻‍♂️": "man_wearing_turban:t2", "👳🏼‍♂️": "man_wearing_turban:t3", "👳🏽‍♂️": "man_wearing_turban:t4", "👳🏾‍♂️": "man_wearing_turban:t5", "👳🏿‍♂️": "man_wearing_turban:t6", "👳‍♀️": "woman_wearing_turban", "👳🏻‍♀️": "woman_wearing_turban:t2", "👳🏼‍♀️": "woman_wearing_turban:t3", "👳🏽‍♀️": "woman_wearing_turban:t4", "👳🏾‍♀️": "woman_wearing_turban:t5", "👳🏿‍♀️": "woman_wearing_turban:t6", "👲": "person_with_skullcap", "👲🏻": "person_with_skullcap:t2", "👲🏼": "person_with_skullcap:t3", "👲🏽": "person_with_skullcap:t4", "👲🏾": "person_with_skullcap:t5", "👲🏿": "person_with_skullcap:t6", "🧕": "woman_with_headscarf", "🧕🏻": "woman_with_headscarf:t2", "🧕🏼": "woman_with_headscarf:t3", "🧕🏽": "woman_with_headscarf:t4", "🧕🏾": "woman_with_headscarf:t5", "🧕🏿": "woman_with_headscarf:t6", "🤵": "person_in_tuxedo", "🤵🏻": "person_in_tuxedo:t2", "🤵🏼": "person_in_tuxedo:t3", "🤵🏽": "person_in_tuxedo:t4", "🤵🏾": "person_in_tuxedo:t5", "🤵🏿": "person_in_tuxedo:t6", "🤵‍♂️": "man_in_tuxedo", "🤵🏻‍♂️": "man_in_tuxedo:t2", "🤵🏼‍♂️": "man_in_tuxedo:t3", "🤵🏽‍♂️": "man_in_tuxedo:t4", "🤵🏾‍♂️": "man_in_tuxedo:t5", "🤵🏿‍♂️": "man_in_tuxedo:t6", "🤵‍♀️": "woman_in_tuxedo", "🤵🏻‍♀️": "woman_in_tuxedo:t2", "🤵🏼‍♀️": "woman_in_tuxedo:t3", "🤵🏽‍♀️": "woman_in_tuxedo:t4", "🤵🏾‍♀️": "woman_in_tuxedo:t5", "🤵🏿‍♀️": "woman_in_tuxedo:t6", "👰": "person_with_veil", "👰🏻": "person_with_veil:t2", "👰🏼": "person_with_veil:t3", "👰🏽": "person_with_veil:t4", "👰🏾": "person_with_veil:t5", "👰🏿": "person_with_veil:t6", "👰‍♂️": "man_with_veil", "👰🏻‍♂️": "man_with_veil:t2", "👰🏼‍♂️": "man_with_veil:t3", "👰🏽‍♂️": "man_with_veil:t4", "👰🏾‍♂️": "man_with_veil:t5", "👰🏿‍♂️": "man_with_veil:t6", "👰‍♀️": "woman_with_veil", "👰🏻‍♀️": "woman_with_veil:t2", "👰🏼‍♀️": "woman_with_veil:t3", "👰🏽‍♀️": "woman_with_veil:t4", "👰🏾‍♀️": "woman_with_veil:t5", "👰🏿‍♀️": "woman_with_veil:t6", "🤰": "pregnant_woman", "🤰🏻": "pregnant_woman:t2", "🤰🏼": "pregnant_woman:t3", "🤰🏽": "pregnant_woman:t4", "🤰🏾": "pregnant_woman:t5", "🤰🏿": "pregnant_woman:t6", "🫃": "pregnant_man", "🫃🏻": "pregnant_man:t2", "🫃🏼": "pregnant_man:t3", "🫃🏽": "pregnant_man:t4", "🫃🏾": "pregnant_man:t5", "🫃🏿": "pregnant_man:t6", "🫄": "pregnant_person", "🫄🏻": "pregnant_person:t2", "🫄🏼": "pregnant_person:t3", "🫄🏽": "pregnant_person:t4", "🫄🏾": "pregnant_person:t5", "🫄🏿": "pregnant_person:t6", "🤱": "breast_feeding", "🤱🏻": "breast_feeding:t2", "🤱🏼": "breast_feeding:t3", "🤱🏽": "breast_feeding:t4", "🤱🏾": "breast_feeding:t5", "🤱🏿": "breast_feeding:t6", "👩‍🍼": "woman_feeding_baby", "👩🏻‍🍼": "woman_feeding_baby:t2", "👩🏼‍🍼": "woman_feeding_baby:t3", "👩🏽‍🍼": "woman_feeding_baby:t4", "👩🏾‍🍼": "woman_feeding_baby:t5", "👩🏿‍🍼": "woman_feeding_baby:t6", "👨‍🍼": "man_feeding_baby", "👨🏻‍🍼": "man_feeding_baby:t2", "👨🏼‍🍼": "man_feeding_baby:t3", "👨🏽‍🍼": "man_feeding_baby:t4", "👨🏾‍🍼": "man_feeding_baby:t5", "👨🏿‍🍼": "man_feeding_baby:t6", "🧑‍🍼": "person_feeding_baby", "🧑🏻‍🍼": "person_feeding_baby:t2", "🧑🏼‍🍼": "person_feeding_baby:t3", "🧑🏽‍🍼": "person_feeding_baby:t4", "🧑🏾‍🍼": "person_feeding_baby:t5", "🧑🏿‍🍼": "person_feeding_baby:t6", "👼": "baby_angel", "👼🏻": "baby_angel:t2", "👼🏼": "baby_angel:t3", "👼🏽": "baby_angel:t4", "👼🏾": "baby_angel:t5", "👼🏿": "baby_angel:t6", "🎅": "santa_claus", "🎅🏻": "santa_claus:t2", "🎅🏼": "santa_claus:t3", "🎅🏽": "santa_claus:t4", "🎅🏾": "santa_claus:t5", "🎅🏿": "santa_claus:t6", "🤶": "mrs_claus", "🤶🏻": "mrs_claus:t2", "🤶🏼": "mrs_claus:t3", "🤶🏽": "mrs_claus:t4", "🤶🏾": "mrs_claus:t5", "🤶🏿": "mrs_claus:t6", "🧑‍🎄": "mx_claus", "🧑🏻‍🎄": "mx_claus:t2", "🧑🏼‍🎄": "mx_claus:t3", "🧑🏽‍🎄": "mx_claus:t4", "🧑🏾‍🎄": "mx_claus:t5", "🧑🏿‍🎄": "mx_claus:t6", "🦸": "superhero", "🦸🏻": "superhero:t2", "🦸🏼": "superhero:t3", "🦸🏽": "superhero:t4", "🦸🏾": "superhero:t5", "🦸🏿": "superhero:t6", "🦸‍♂️": "man_superhero", "🦸🏻‍♂️": "man_superhero:t2", "🦸🏼‍♂️": "man_superhero:t3", "🦸🏽‍♂️": "man_superhero:t4", "🦸🏾‍♂️": "man_superhero:t5", "🦸🏿‍♂️": "man_superhero:t6", "🦸‍♀️": "woman_superhero", "🦸🏻‍♀️": "woman_superhero:t2", "🦸🏼‍♀️": "woman_superhero:t3", "🦸🏽‍♀️": "woman_superhero:t4", "🦸🏾‍♀️": "woman_superhero:t5", "🦸🏿‍♀️": "woman_superhero:t6", "🦹": "supervillain", "🦹🏻": "supervillain:t2", "🦹🏼": "supervillain:t3", "🦹🏽": "supervillain:t4", "🦹🏾": "supervillain:t5", "🦹🏿": "supervillain:t6", "🦹‍♂️": "man_supervillain", "🦹🏻‍♂️": "man_supervillain:t2", "🦹🏼‍♂️": "man_supervillain:t3", "🦹🏽‍♂️": "man_supervillain:t4", "🦹🏾‍♂️": "man_supervillain:t5", "🦹🏿‍♂️": "man_supervillain:t6", "🦹‍♀️": "woman_supervillain", "🦹🏻‍♀️": "woman_supervillain:t2", "🦹🏼‍♀️": "woman_supervillain:t3", "🦹🏽‍♀️": "woman_supervillain:t4", "🦹🏾‍♀️": "woman_supervillain:t5", "🦹🏿‍♀️": "woman_supervillain:t6", "🧙": "mage", "🧙🏻": "mage:t2", "🧙🏼": "mage:t3", "🧙🏽": "mage:t4", "🧙🏾": "mage:t5", "🧙🏿": "mage:t6", "🧙‍♂️": "man_mage", "🧙🏻‍♂️": "man_mage:t2", "🧙🏼‍♂️": "man_mage:t3", "🧙🏽‍♂️": "man_mage:t4", "🧙🏾‍♂️": "man_mage:t5", "🧙🏿‍♂️": "man_mage:t6", "🧙‍♀️": "woman_mage", "🧙🏻‍♀️": "woman_mage:t2", "🧙🏼‍♀️": "woman_mage:t3", "🧙🏽‍♀️": "woman_mage:t4", "🧙🏾‍♀️": "woman_mage:t5", "🧙🏿‍♀️": "woman_mage:t6", "🧚": "fairy", "🧚🏻": "fairy:t2", "🧚🏼": "fairy:t3", "🧚🏽": "fairy:t4", "🧚🏾": "fairy:t5", "🧚🏿": "fairy:t6", "🧚‍♂️": "man_fairy", "🧚🏻‍♂️": "man_fairy:t2", "🧚🏼‍♂️": "man_fairy:t3", "🧚🏽‍♂️": "man_fairy:t4", "🧚🏾‍♂️": "man_fairy:t5", "🧚🏿‍♂️": "man_fairy:t6", "🧚‍♀️": "woman_fairy", "🧚🏻‍♀️": "woman_fairy:t2", "🧚🏼‍♀️": "woman_fairy:t3", "🧚🏽‍♀️": "woman_fairy:t4", "🧚🏾‍♀️": "woman_fairy:t5", "🧚🏿‍♀️": "woman_fairy:t6", "🧛": "vampire", "🧛🏻": "vampire:t2", "🧛🏼": "vampire:t3", "🧛🏽": "vampire:t4", "🧛🏾": "vampire:t5", "🧛🏿": "vampire:t6", "🧛‍♂️": "man_vampire", "🧛🏻‍♂️": "man_vampire:t2", "🧛🏼‍♂️": "man_vampire:t3", "🧛🏽‍♂️": "man_vampire:t4", "🧛🏾‍♂️": "man_vampire:t5", "🧛🏿‍♂️": "man_vampire:t6", "🧛‍♀️": "woman_vampire", "🧛🏻‍♀️": "woman_vampire:t2", "🧛🏼‍♀️": "woman_vampire:t3", "🧛🏽‍♀️": "woman_vampire:t4", "🧛🏾‍♀️": "woman_vampire:t5", "🧛🏿‍♀️": "woman_vampire:t6", "🧜": "merperson", "🧜🏻": "merperson:t2", "🧜🏼": "merperson:t3", "🧜🏽": "merperson:t4", "🧜🏾": "merperson:t5", "🧜🏿": "merperson:t6", "🧜‍♂️": "merman", "🧜🏻‍♂️": "merman:t2", "🧜🏼‍♂️": "merman:t3", "🧜🏽‍♂️": "merman:t4", "🧜🏾‍♂️": "merman:t5", "🧜🏿‍♂️": "merman:t6", "🧜‍♀️": "mermaid", "🧜🏻‍♀️": "mermaid:t2", "🧜🏼‍♀️": "mermaid:t3", "🧜🏽‍♀️": "mermaid:t4", "🧜🏾‍♀️": "mermaid:t5", "🧜🏿‍♀️": "mermaid:t6", "🧝": "elf", "🧝🏻": "elf:t2", "🧝🏼": "elf:t3", "🧝🏽": "elf:t4", "🧝🏾": "elf:t5", "🧝🏿": "elf:t6", "🧝‍♂️": "man_elf", "🧝🏻‍♂️": "man_elf:t2", "🧝🏼‍♂️": "man_elf:t3", "🧝🏽‍♂️": "man_elf:t4", "🧝🏾‍♂️": "man_elf:t5", "🧝🏿‍♂️": "man_elf:t6", "🧝‍♀️": "woman_elf", "🧝🏻‍♀️": "woman_elf:t2", "🧝🏼‍♀️": "woman_elf:t3", "🧝🏽‍♀️": "woman_elf:t4", "🧝🏾‍♀️": "woman_elf:t5", "🧝🏿‍♀️": "woman_elf:t6", "🧞": "genie", "🧞‍♂️": "man_genie", "🧞‍♀️": "woman_genie", "🧟": "zombie", "🧟‍♂️": "man_zombie", "🧟‍♀️": "woman_zombie", "🧌": "troll", "💆": "person_getting_massage", "💆🏻": "person_getting_massage:t2", "💆🏼": "person_getting_massage:t3", "💆🏽": "person_getting_massage:t4", "💆🏾": "person_getting_massage:t5", "💆🏿": "person_getting_massage:t6", "💆‍♂️": "man_getting_massage", "💆🏻‍♂️": "man_getting_massage:t2", "💆🏼‍♂️": "man_getting_massage:t3", "💆🏽‍♂️": "man_getting_massage:t4", "💆🏾‍♂️": "man_getting_massage:t5", "💆🏿‍♂️": "man_getting_massage:t6", "💆‍♀️": "woman_getting_massage", "💆🏻‍♀️": "woman_getting_massage:t2", "💆🏼‍♀️": "woman_getting_massage:t3", "💆🏽‍♀️": "woman_getting_massage:t4", "💆🏾‍♀️": "woman_getting_massage:t5", "💆🏿‍♀️": "woman_getting_massage:t6", "💇": "person_getting_haircut", "💇🏻": "person_getting_haircut:t2", "💇🏼": "person_getting_haircut:t3", "💇🏽": "person_getting_haircut:t4", "💇🏾": "person_getting_haircut:t5", "💇🏿": "person_getting_haircut:t6", "💇‍♂️": "man_getting_haircut", "💇🏻‍♂️": "man_getting_haircut:t2", "💇🏼‍♂️": "man_getting_haircut:t3", "💇🏽‍♂️": "man_getting_haircut:t4", "💇🏾‍♂️": "man_getting_haircut:t5", "💇🏿‍♂️": "man_getting_haircut:t6", "💇‍♀️": "woman_getting_haircut", "💇🏻‍♀️": "woman_getting_haircut:t2", "💇🏼‍♀️": "woman_getting_haircut:t3", "💇🏽‍♀️": "woman_getting_haircut:t4", "💇🏾‍♀️": "woman_getting_haircut:t5", "💇🏿‍♀️": "woman_getting_haircut:t6", "🚶": "person_walking", "🚶🏻": "person_walking:t2", "🚶🏼": "person_walking:t3", "🚶🏽": "person_walking:t4", "🚶🏾": "person_walking:t5", "🚶🏿": "person_walking:t6", "🚶‍♂️": "man_walking", "🚶🏻‍♂️": "man_walking:t2", "🚶🏼‍♂️": "man_walking:t3", "🚶🏽‍♂️": "man_walking:t4", "🚶🏾‍♂️": "man_walking:t5", "🚶🏿‍♂️": "man_walking:t6", "🚶‍♀️": "woman_walking", "🚶🏻‍♀️": "woman_walking:t2", "🚶🏼‍♀️": "woman_walking:t3", "🚶🏽‍♀️": "woman_walking:t4", "🚶🏾‍♀️": "woman_walking:t5", "🚶🏿‍♀️": "woman_walking:t6", "🧍": "person_standing", "🧍🏻": "person_standing:t2", "🧍🏼": "person_standing:t3", "🧍🏽": "person_standing:t4", "🧍🏾": "person_standing:t5", "🧍🏿": "person_standing:t6", "🧍‍♂️": "man_standing", "🧍🏻‍♂️": "man_standing:t2", "🧍🏼‍♂️": "man_standing:t3", "🧍🏽‍♂️": "man_standing:t4", "🧍🏾‍♂️": "man_standing:t5", "🧍🏿‍♂️": "man_standing:t6", "🧍‍♀️": "woman_standing", "🧍🏻‍♀️": "woman_standing:t2", "🧍🏼‍♀️": "woman_standing:t3", "🧍🏽‍♀️": "woman_standing:t4", "🧍🏾‍♀️": "woman_standing:t5", "🧍🏿‍♀️": "woman_standing:t6", "🧎": "person_kneeling", "🧎🏻": "person_kneeling:t2", "🧎🏼": "person_kneeling:t3", "🧎🏽": "person_kneeling:t4", "🧎🏾": "person_kneeling:t5", "🧎🏿": "person_kneeling:t6", "🧎‍♂️": "man_kneeling", "🧎🏻‍♂️": "man_kneeling:t2", "🧎🏼‍♂️": "man_kneeling:t3", "🧎🏽‍♂️": "man_kneeling:t4", "🧎🏾‍♂️": "man_kneeling:t5", "🧎🏿‍♂️": "man_kneeling:t6", "🧎‍♀️": "woman_kneeling", "🧎🏻‍♀️": "woman_kneeling:t2", "🧎🏼‍♀️": "woman_kneeling:t3", "🧎🏽‍♀️": "woman_kneeling:t4", "🧎🏾‍♀️": "woman_kneeling:t5", "🧎🏿‍♀️": "woman_kneeling:t6", "🧑‍🦯": "person_with_white_cane", "🧑🏻‍🦯": "person_with_white_cane:t2", "🧑🏼‍🦯": "person_with_white_cane:t3", "🧑🏽‍🦯": "person_with_white_cane:t4", "🧑🏾‍🦯": "person_with_white_cane:t5", "🧑🏿‍🦯": "person_with_white_cane:t6", "👨‍🦯": "man_with_white_cane", "👨🏻‍🦯": "man_with_white_cane:t2", "👨🏼‍🦯": "man_with_white_cane:t3", "👨🏽‍🦯": "man_with_white_cane:t4", "👨🏾‍🦯": "man_with_white_cane:t5", "👨🏿‍🦯": "man_with_white_cane:t6", "👩‍🦯": "woman_with_white_cane", "👩🏻‍🦯": "woman_with_white_cane:t2", "👩🏼‍🦯": "woman_with_white_cane:t3", "👩🏽‍🦯": "woman_with_white_cane:t4", "👩🏾‍🦯": "woman_with_white_cane:t5", "👩🏿‍🦯": "woman_with_white_cane:t6", "🧑‍🦼": "person_in_motorized_wheelchair", "🧑🏻‍🦼": "person_in_motorized_wheelchair:t2", "🧑🏼‍🦼": "person_in_motorized_wheelchair:t3", "🧑🏽‍🦼": "person_in_motorized_wheelchair:t4", "🧑🏾‍🦼": "person_in_motorized_wheelchair:t5", "🧑🏿‍🦼": "person_in_motorized_wheelchair:t6", "👨‍🦼": "man_in_motorized_wheelchair", "👨🏻‍🦼": "man_in_motorized_wheelchair:t2", "👨🏼‍🦼": "man_in_motorized_wheelchair:t3", "👨🏽‍🦼": "man_in_motorized_wheelchair:t4", "👨🏾‍🦼": "man_in_motorized_wheelchair:t5", "👨🏿‍🦼": "man_in_motorized_wheelchair:t6", "👩‍🦼": "woman_in_motorized_wheelchair", "👩🏻‍🦼": "woman_in_motorized_wheelchair:t2", "👩🏼‍🦼": "woman_in_motorized_wheelchair:t3", "👩🏽‍🦼": "woman_in_motorized_wheelchair:t4", "👩🏾‍🦼": "woman_in_motorized_wheelchair:t5", "👩🏿‍🦼": "woman_in_motorized_wheelchair:t6", "🧑‍🦽": "person_in_manual_wheelchair", "🧑🏻‍🦽": "person_in_manual_wheelchair:t2", "🧑🏼‍🦽": "person_in_manual_wheelchair:t3", "🧑🏽‍🦽": "person_in_manual_wheelchair:t4", "🧑🏾‍🦽": "person_in_manual_wheelchair:t5", "🧑🏿‍🦽": "person_in_manual_wheelchair:t6", "👨‍🦽": "man_in_manual_wheelchair", "👨🏻‍🦽": "man_in_manual_wheelchair:t2", "👨🏼‍🦽": "man_in_manual_wheelchair:t3", "👨🏽‍🦽": "man_in_manual_wheelchair:t4", "👨🏾‍🦽": "man_in_manual_wheelchair:t5", "👨🏿‍🦽": "man_in_manual_wheelchair:t6", "👩‍🦽": "woman_in_manual_wheelchair", "👩🏻‍🦽": "woman_in_manual_wheelchair:t2", "👩🏼‍🦽": "woman_in_manual_wheelchair:t3", "👩🏽‍🦽": "woman_in_manual_wheelchair:t4", "👩🏾‍🦽": "woman_in_manual_wheelchair:t5", "👩🏿‍🦽": "woman_in_manual_wheelchair:t6", "🏃": "person_running", "🏃🏻": "person_running:t2", "🏃🏼": "person_running:t3", "🏃🏽": "person_running:t4", "🏃🏾": "person_running:t5", "🏃🏿": "person_running:t6", "🏃‍♂️": "man_running", "🏃🏻‍♂️": "man_running:t2", "🏃🏼‍♂️": "man_running:t3", "🏃🏽‍♂️": "man_running:t4", "🏃🏾‍♂️": "man_running:t5", "🏃🏿‍♂️": "man_running:t6", "🏃‍♀️": "woman_running", "🏃🏻‍♀️": "woman_running:t2", "🏃🏼‍♀️": "woman_running:t3", "🏃🏽‍♀️": "woman_running:t4", "🏃🏾‍♀️": "woman_running:t5", "🏃🏿‍♀️": "woman_running:t6", "💃": "woman_dancing", "💃🏻": "woman_dancing:t2", "💃🏼": "woman_dancing:t3", "💃🏽": "woman_dancing:t4", "💃🏾": "woman_dancing:t5", "💃🏿": "woman_dancing:t6", "🕺": "man_dancing", "🕺🏻": "man_dancing:t2", "🕺🏼": "man_dancing:t3", "🕺🏽": "man_dancing:t4", "🕺🏾": "man_dancing:t5", "🕺🏿": "man_dancing:t6", "🕴": "person_in_suit_levitating", "🕴🏻": "person_in_suit_levitating:t2", "🕴🏼": "person_in_suit_levitating:t3", "🕴🏽": "person_in_suit_levitating:t4", "🕴🏾": "person_in_suit_levitating:t5", "🕴🏿": "person_in_suit_levitating:t6", "👯": "people_with_bunny_ears", "👯‍♂️": "men_with_bunny_ears", "👯‍♀️": "women_with_bunny_ears", "🧖": "person_in_steamy_room", "🧖🏻": "person_in_steamy_room:t2", "🧖🏼": "person_in_steamy_room:t3", "🧖🏽": "person_in_steamy_room:t4", "🧖🏾": "person_in_steamy_room:t5", "🧖🏿": "person_in_steamy_room:t6", "🧖‍♂️": "man_in_steamy_room", "🧖🏻‍♂️": "man_in_steamy_room:t2", "🧖🏼‍♂️": "man_in_steamy_room:t3", "🧖🏽‍♂️": "man_in_steamy_room:t4", "🧖🏾‍♂️": "man_in_steamy_room:t5", "🧖🏿‍♂️": "man_in_steamy_room:t6", "🧖‍♀️": "woman_in_steamy_room", "🧖🏻‍♀️": "woman_in_steamy_room:t2", "🧖🏼‍♀️": "woman_in_steamy_room:t3", "🧖🏽‍♀️": "woman_in_steamy_room:t4", "🧖🏾‍♀️": "woman_in_steamy_room:t5", "🧖🏿‍♀️": "woman_in_steamy_room:t6", "🧗": "person_climbing", "🧗🏻": "person_climbing:t2", "🧗🏼": "person_climbing:t3", "🧗🏽": "person_climbing:t4", "🧗🏾": "person_climbing:t5", "🧗🏿": "person_climbing:t6", "🧗‍♂️": "man_climbing", "🧗🏻‍♂️": "man_climbing:t2", "🧗🏼‍♂️": "man_climbing:t3", "🧗🏽‍♂️": "man_climbing:t4", "🧗🏾‍♂️": "man_climbing:t5", "🧗🏿‍♂️": "man_climbing:t6", "🧗‍♀️": "woman_climbing", "🧗🏻‍♀️": "woman_climbing:t2", "🧗🏼‍♀️": "woman_climbing:t3", "🧗🏽‍♀️": "woman_climbing:t4", "🧗🏾‍♀️": "woman_climbing:t5", "🧗🏿‍♀️": "woman_climbing:t6", "🤺": "person_fencing", "🏇": "horse_racing", "🏇🏻": "horse_racing:t2", "🏇🏼": "horse_racing:t3", "🏇🏽": "horse_racing:t4", "🏇🏾": "horse_racing:t5", "🏇🏿": "horse_racing:t6", "⛷": "skier", "🏂": "snowboarder", "🏂🏻": "snowboarder:t2", "🏂🏼": "snowboarder:t3", "🏂🏽": "snowboarder:t4", "🏂🏾": "snowboarder:t5", "🏂🏿": "snowboarder:t6", "🏌": "person_golfing", "🏌🏻": "person_golfing:t2", "🏌🏼": "person_golfing:t3", "🏌🏽": "person_golfing:t4", "🏌🏾": "person_golfing:t5", "🏌🏿": "person_golfing:t6", "🏌️‍♂️": "man_golfing", "🏌🏻️‍♂️": "man_golfing:t2", "🏌🏼️‍♂️": "man_golfing:t3", "🏌🏽️‍♂️": "man_golfing:t4", "🏌🏾️‍♂️": "man_golfing:t5", "🏌🏿️‍♂️": "man_golfing:t6", "🏌️‍♀️": "woman_golfing", "🏌🏻️‍♀️": "woman_golfing:t2", "🏌🏼️‍♀️": "woman_golfing:t3", "🏌🏽️‍♀️": "woman_golfing:t4", "🏌🏾️‍♀️": "woman_golfing:t5", "🏌🏿️‍♀️": "woman_golfing:t6", "🏄": "person_surfing", "🏄🏻": "person_surfing:t2", "🏄🏼": "person_surfing:t3", "🏄🏽": "person_surfing:t4", "🏄🏾": "person_surfing:t5", "🏄🏿": "person_surfing:t6", "🏄‍♂️": "man_surfing", "🏄🏻‍♂️": "man_surfing:t2", "🏄🏼‍♂️": "man_surfing:t3", "🏄🏽‍♂️": "man_surfing:t4", "🏄🏾‍♂️": "man_surfing:t5", "🏄🏿‍♂️": "man_surfing:t6", "🏄‍♀️": "woman_surfing", "🏄🏻‍♀️": "woman_surfing:t2", "🏄🏼‍♀️": "woman_surfing:t3", "🏄🏽‍♀️": "woman_surfing:t4", "🏄🏾‍♀️": "woman_surfing:t5", "🏄🏿‍♀️": "woman_surfing:t6", "🚣": "person_rowing_boat", "🚣🏻": "person_rowing_boat:t2", "🚣🏼": "person_rowing_boat:t3", "🚣🏽": "person_rowing_boat:t4", "🚣🏾": "person_rowing_boat:t5", "🚣🏿": "person_rowing_boat:t6", "🚣‍♂️": "man_rowing_boat", "🚣🏻‍♂️": "man_rowing_boat:t2", "🚣🏼‍♂️": "man_rowing_boat:t3", "🚣🏽‍♂️": "man_rowing_boat:t4", "🚣🏾‍♂️": "man_rowing_boat:t5", "🚣🏿‍♂️": "man_rowing_boat:t6", "🚣‍♀️": "woman_rowing_boat", "🚣🏻‍♀️": "woman_rowing_boat:t2", "🚣🏼‍♀️": "woman_rowing_boat:t3", "🚣🏽‍♀️": "woman_rowing_boat:t4", "🚣🏾‍♀️": "woman_rowing_boat:t5", "🚣🏿‍♀️": "woman_rowing_boat:t6", "🏊": "person_swimming", "🏊🏻": "person_swimming:t2", "🏊🏼": "person_swimming:t3", "🏊🏽": "person_swimming:t4", "🏊🏾": "person_swimming:t5", "🏊🏿": "person_swimming:t6", "🏊‍♂️": "man_swimming", "🏊🏻‍♂️": "man_swimming:t2", "🏊🏼‍♂️": "man_swimming:t3", "🏊🏽‍♂️": "man_swimming:t4", "🏊🏾‍♂️": "man_swimming:t5", "🏊🏿‍♂️": "man_swimming:t6", "🏊‍♀️": "woman_swimming", "🏊🏻‍♀️": "woman_swimming:t2", "🏊🏼‍♀️": "woman_swimming:t3", "🏊🏽‍♀️": "woman_swimming:t4", "🏊🏾‍♀️": "woman_swimming:t5", "🏊🏿‍♀️": "woman_swimming:t6", "⛹": "person_bouncing_ball", "⛹🏻": "person_bouncing_ball:t2", "⛹🏼": "person_bouncing_ball:t3", "⛹🏽": "person_bouncing_ball:t4", "⛹🏾": "person_bouncing_ball:t5", "⛹🏿": "person_bouncing_ball:t6", "⛹️‍♂️": "man_bouncing_ball", "⛹🏻️‍♂️": "man_bouncing_ball:t2", "⛹🏼️‍♂️": "man_bouncing_ball:t3", "⛹🏽️‍♂️": "man_bouncing_ball:t4", "⛹🏾️‍♂️": "man_bouncing_ball:t5", "⛹🏿️‍♂️": "man_bouncing_ball:t6", "⛹️‍♀️": "woman_bouncing_ball", "⛹🏻️‍♀️": "woman_bouncing_ball:t2", "⛹🏼️‍♀️": "woman_bouncing_ball:t3", "⛹🏽️‍♀️": "woman_bouncing_ball:t4", "⛹🏾️‍♀️": "woman_bouncing_ball:t5", "⛹🏿️‍♀️": "woman_bouncing_ball:t6", "🏋": "person_lifting_weights", "🏋🏻": "person_lifting_weights:t2", "🏋🏼": "person_lifting_weights:t3", "🏋🏽": "person_lifting_weights:t4", "🏋🏾": "person_lifting_weights:t5", "🏋🏿": "person_lifting_weights:t6", "🏋️‍♂️": "man_lifting_weights", "🏋🏻️‍♂️": "man_lifting_weights:t2", "🏋🏼️‍♂️": "man_lifting_weights:t3", "🏋🏽️‍♂️": "man_lifting_weights:t4", "🏋🏾️‍♂️": "man_lifting_weights:t5", "🏋🏿️‍♂️": "man_lifting_weights:t6", "🏋️‍♀️": "woman_lifting_weights", "🏋🏻️‍♀️": "woman_lifting_weights:t2", "🏋🏼️‍♀️": "woman_lifting_weights:t3", "🏋🏽️‍♀️": "woman_lifting_weights:t4", "🏋🏾️‍♀️": "woman_lifting_weights:t5", "🏋🏿️‍♀️": "woman_lifting_weights:t6", "🚴": "person_biking", "🚴🏻": "person_biking:t2", "🚴🏼": "person_biking:t3", "🚴🏽": "person_biking:t4", "🚴🏾": "person_biking:t5", "🚴🏿": "person_biking:t6", "🚴‍♂️": "man_biking", "🚴🏻‍♂️": "man_biking:t2", "🚴🏼‍♂️": "man_biking:t3", "🚴🏽‍♂️": "man_biking:t4", "🚴🏾‍♂️": "man_biking:t5", "🚴🏿‍♂️": "man_biking:t6", "🚴‍♀️": "woman_biking", "🚴🏻‍♀️": "woman_biking:t2", "🚴🏼‍♀️": "woman_biking:t3", "🚴🏽‍♀️": "woman_biking:t4", "🚴🏾‍♀️": "woman_biking:t5", "🚴🏿‍♀️": "woman_biking:t6", "🚵": "person_mountain_biking", "🚵🏻": "person_mountain_biking:t2", "🚵🏼": "person_mountain_biking:t3", "🚵🏽": "person_mountain_biking:t4", "🚵🏾": "person_mountain_biking:t5", "🚵🏿": "person_mountain_biking:t6", "🚵‍♂️": "man_mountain_biking", "🚵🏻‍♂️": "man_mountain_biking:t2", "🚵🏼‍♂️": "man_mountain_biking:t3", "🚵🏽‍♂️": "man_mountain_biking:t4", "🚵🏾‍♂️": "man_mountain_biking:t5", "🚵🏿‍♂️": "man_mountain_biking:t6", "🚵‍♀️": "woman_mountain_biking", "🚵🏻‍♀️": "woman_mountain_biking:t2", "🚵🏼‍♀️": "woman_mountain_biking:t3", "🚵🏽‍♀️": "woman_mountain_biking:t4", "🚵🏾‍♀️": "woman_mountain_biking:t5", "🚵🏿‍♀️": "woman_mountain_biking:t6", "🤸": "person_cartwheeling", "🤸🏻": "person_cartwheeling:t2", "🤸🏼": "person_cartwheeling:t3", "🤸🏽": "person_cartwheeling:t4", "🤸🏾": "person_cartwheeling:t5", "🤸🏿": "person_cartwheeling:t6", "🤸‍♂️": "man_cartwheeling", "🤸🏻‍♂️": "man_cartwheeling:t2", "🤸🏼‍♂️": "man_cartwheeling:t3", "🤸🏽‍♂️": "man_cartwheeling:t4", "🤸🏾‍♂️": "man_cartwheeling:t5", "🤸🏿‍♂️": "man_cartwheeling:t6", "🤸‍♀️": "woman_cartwheeling", "🤸🏻‍♀️": "woman_cartwheeling:t2", "🤸🏼‍♀️": "woman_cartwheeling:t3", "🤸🏽‍♀️": "woman_cartwheeling:t4", "🤸🏾‍♀️": "woman_cartwheeling:t5", "🤸🏿‍♀️": "woman_cartwheeling:t6", "🤼": "people_wrestling", "🤼‍♂️": "men_wrestling", "🤼‍♀️": "women_wrestling", "🤽": "person_playing_water_polo", "🤽🏻": "person_playing_water_polo:t2", "🤽🏼": "person_playing_water_polo:t3", "🤽🏽": "person_playing_water_polo:t4", "🤽🏾": "person_playing_water_polo:t5", "🤽🏿": "person_playing_water_polo:t6", "🤽‍♂️": "man_playing_water_polo", "🤽🏻‍♂️": "man_playing_water_polo:t2", "🤽🏼‍♂️": "man_playing_water_polo:t3", "🤽🏽‍♂️": "man_playing_water_polo:t4", "🤽🏾‍♂️": "man_playing_water_polo:t5", "🤽🏿‍♂️": "man_playing_water_polo:t6", "🤽‍♀️": "woman_playing_water_polo", "🤽🏻‍♀️": "woman_playing_water_polo:t2", "🤽🏼‍♀️": "woman_playing_water_polo:t3", "🤽🏽‍♀️": "woman_playing_water_polo:t4", "🤽🏾‍♀️": "woman_playing_water_polo:t5", "🤽🏿‍♀️": "woman_playing_water_polo:t6", "🤾": "person_playing_handball", "🤾🏻": "person_playing_handball:t2", "🤾🏼": "person_playing_handball:t3", "🤾🏽": "person_playing_handball:t4", "🤾🏾": "person_playing_handball:t5", "🤾🏿": "person_playing_handball:t6", "🤾‍♂️": "man_playing_handball", "🤾🏻‍♂️": "man_playing_handball:t2", "🤾🏼‍♂️": "man_playing_handball:t3", "🤾🏽‍♂️": "man_playing_handball:t4", "🤾🏾‍♂️": "man_playing_handball:t5", "🤾🏿‍♂️": "man_playing_handball:t6", "🤾‍♀️": "woman_playing_handball", "🤾🏻‍♀️": "woman_playing_handball:t2", "🤾🏼‍♀️": "woman_playing_handball:t3", "🤾🏽‍♀️": "woman_playing_handball:t4", "🤾🏾‍♀️": "woman_playing_handball:t5", "🤾🏿‍♀️": "woman_playing_handball:t6", "🤹": "person_juggling", "🤹🏻": "person_juggling:t2", "🤹🏼": "person_juggling:t3", "🤹🏽": "person_juggling:t4", "🤹🏾": "person_juggling:t5", "🤹🏿": "person_juggling:t6", "🤹‍♂️": "man_juggling", "🤹🏻‍♂️": "man_juggling:t2", "🤹🏼‍♂️": "man_juggling:t3", "🤹🏽‍♂️": "man_juggling:t4", "🤹🏾‍♂️": "man_juggling:t5", "🤹🏿‍♂️": "man_juggling:t6", "🤹‍♀️": "woman_juggling", "🤹🏻‍♀️": "woman_juggling:t2", "🤹🏼‍♀️": "woman_juggling:t3", "🤹🏽‍♀️": "woman_juggling:t4", "🤹🏾‍♀️": "woman_juggling:t5", "🤹🏿‍♀️": "woman_juggling:t6", "🧘": "person_in_lotus_position", "🧘🏻": "person_in_lotus_position:t2", "🧘🏼": "person_in_lotus_position:t3", "🧘🏽": "person_in_lotus_position:t4", "🧘🏾": "person_in_lotus_position:t5", "🧘🏿": "person_in_lotus_position:t6", "🧘‍♂️": "man_in_lotus_position", "🧘🏻‍♂️": "man_in_lotus_position:t2", "🧘🏼‍♂️": "man_in_lotus_position:t3", "🧘🏽‍♂️": "man_in_lotus_position:t4", "🧘🏾‍♂️": "man_in_lotus_position:t5", "🧘🏿‍♂️": "man_in_lotus_position:t6", "🧘‍♀️": "woman_in_lotus_position", "🧘🏻‍♀️": "woman_in_lotus_position:t2", "🧘🏼‍♀️": "woman_in_lotus_position:t3", "🧘🏽‍♀️": "woman_in_lotus_position:t4", "🧘🏾‍♀️": "woman_in_lotus_position:t5", "🧘🏿‍♀️": "woman_in_lotus_position:t6", "🛀": "person_taking_bath", "🛀🏻": "person_taking_bath:t2", "🛀🏼": "person_taking_bath:t3", "🛀🏽": "person_taking_bath:t4", "🛀🏾": "person_taking_bath:t5", "🛀🏿": "person_taking_bath:t6", "🛌": "person_in_bed", "🛌🏻": "person_in_bed:t2", "🛌🏼": "person_in_bed:t3", "🛌🏽": "person_in_bed:t4", "🛌🏾": "person_in_bed:t5", "🛌🏿": "person_in_bed:t6", "🧑‍🤝‍🧑": "people_holding_hands", "👭": "women_holding_hands", "👭🏻": "women_holding_hands:t2", "👭🏼": "women_holding_hands:t3", "👭🏽": "women_holding_hands:t4", "👭🏾": "women_holding_hands:t5", "👭🏿": "women_holding_hands:t6", "👫": "woman_and_man_holding_hands", "👫🏻": "woman_and_man_holding_hands:t2", "👫🏼": "woman_and_man_holding_hands:t3", "👫🏽": "woman_and_man_holding_hands:t4", "👫🏾": "woman_and_man_holding_hands:t5", "👫🏿": "woman_and_man_holding_hands:t6", "👬": "men_holding_hands", "👬🏻": "men_holding_hands:t2", "👬🏼": "men_holding_hands:t3", "👬🏽": "men_holding_hands:t4", "👬🏾": "men_holding_hands:t5", "👬🏿": "men_holding_hands:t6", "💏": "kiss", "💏🏻": "kiss:t2", "💏🏼": "kiss:t3", "💏🏽": "kiss:t4", "💏🏾": "kiss:t5", "💏🏿": "kiss:t6", "👩‍❤️‍💋‍👨": "kiss_woman_man", "👩🏻‍❤️‍💋‍👨": "kiss_woman_man:t2", "👩🏼‍❤️‍💋‍👨": "kiss_woman_man:t3", "👩🏽‍❤️‍💋‍👨": "kiss_woman_man:t4", "👩🏾‍❤️‍💋‍👨": "kiss_woman_man:t5", "👩🏿‍❤️‍💋‍👨": "kiss_woman_man:t6", "👨‍❤️‍💋‍👨": "kiss_man_man", "👨🏻‍❤️‍💋‍👨": "kiss_man_man:t2", "👨🏼‍❤️‍💋‍👨": "kiss_man_man:t3", "👨🏽‍❤️‍💋‍👨": "kiss_man_man:t4", "👨🏾‍❤️‍💋‍👨": "kiss_man_man:t5", "👨🏿‍❤️‍💋‍👨": "kiss_man_man:t6", "👩‍❤️‍💋‍👩": "kiss_woman_woman", "👩🏻‍❤️‍💋‍👩": "kiss_woman_woman:t2", "👩🏼‍❤️‍💋‍👩": "kiss_woman_woman:t3", "👩🏽‍❤️‍💋‍👩": "kiss_woman_woman:t4", "👩🏾‍❤️‍💋‍👩": "kiss_woman_woman:t5", "👩🏿‍❤️‍💋‍👩": "kiss_woman_woman:t6", "💑": "couple_with_heart", "💑🏻": "couple_with_heart:t2", "💑🏼": "couple_with_heart:t3", "💑🏽": "couple_with_heart:t4", "💑🏾": "couple_with_heart:t5", "💑🏿": "couple_with_heart:t6", "👩‍❤️‍👨": "couple_with_heart_woman_man", "👩🏻‍❤️‍👨": "couple_with_heart_woman_man:t2", "👩🏼‍❤️‍👨": "couple_with_heart_woman_man:t3", "👩🏽‍❤️‍👨": "couple_with_heart_woman_man:t4", "👩🏾‍❤️‍👨": "couple_with_heart_woman_man:t5", "👩🏿‍❤️‍👨": "couple_with_heart_woman_man:t6", "👨‍❤️‍👨": "couple_with_heart_man_man", "👨🏻‍❤️‍👨": "couple_with_heart_man_man:t2", "👨🏼‍❤️‍👨": "couple_with_heart_man_man:t3", "👨🏽‍❤️‍👨": "couple_with_heart_man_man:t4", "👨🏾‍❤️‍👨": "couple_with_heart_man_man:t5", "👨🏿‍❤️‍👨": "couple_with_heart_man_man:t6", "👩‍❤️‍👩": "couple_with_heart_woman_woman", "👩🏻‍❤️‍👩": "couple_with_heart_woman_woman:t2", "👩🏼‍❤️‍👩": "couple_with_heart_woman_woman:t3", "👩🏽‍❤️‍👩": "couple_with_heart_woman_woman:t4", "👩🏾‍❤️‍👩": "couple_with_heart_woman_woman:t5", "👩🏿‍❤️‍👩": "couple_with_heart_woman_woman:t6", "👨‍👩‍👦": "family_man_woman_boy", "👨‍👩‍👧": "family_man_woman_girl", "👨‍👩‍👧‍👦": "family_man_woman_girl_boy", "👨‍👩‍👦‍👦": "family_man_woman_boy_boy", "👨‍👩‍👧‍👧": "family_man_woman_girl_girl", "👨‍👨‍👦": "family_man_man_boy", "👨‍👨‍👧": "family_man_man_girl", "👨‍👨‍👧‍👦": "family_man_man_girl_boy", "👨‍👨‍👦‍👦": "family_man_man_boy_boy", "👨‍👨‍👧‍👧": "family_man_man_girl_girl", "👩‍👩‍👦": "family_woman_woman_boy", "👩‍👩‍👧": "family_woman_woman_girl", "👩‍👩‍👧‍👦": "family_woman_woman_girl_boy", "👩‍👩‍👦‍👦": "family_woman_woman_boy_boy", "👩‍👩‍👧‍👧": "family_woman_woman_girl_girl", "👨‍👦": "family_man_boy", "👨‍👦‍👦": "family_man_boy_boy", "👨‍👧": "family_man_girl", "👨‍👧‍👦": "family_man_girl_boy", "👨‍👧‍👧": "family_man_girl_girl", "👩‍👦": "family_woman_boy", "👩‍👦‍👦": "family_woman_boy_boy", "👩‍👧": "family_woman_girl", "👩‍👧‍👦": "family_woman_girl_boy", "👩‍👧‍👧": "family_woman_girl_girl", "🗣": "speaking_head", "👤": "bust_in_silhouette", "👥": "busts_in_silhouette", "🫂": "people_hugging", "👪": "family", "🧑‍🧑‍🧒": "family_adult_adult_child", "🧑‍🧑‍🧒‍🧒": "family_adult_adult_child_child", "🧑‍🧒": "family_adult_child", "🧑‍🧒‍🧒": "family_adult_child_child", "👣": "footprints", "🫆": "fingerprint", "🦰": "red_hair", "🦱": "curly_hair", "🦳": "white_hair", "🦲": "bald", "🐵": "monkey_face", "🐒": "monkey", "🦍": "gorilla", "🦧": "orangutan", "🐶": "dog_face", "🐕": "dog", "🦮": "guide_dog", "🐕‍🦺": "service_dog", "🐩": "poodle", "🐺": "wolf", "🦊": "fox", "🦝": "raccoon", "🐱": "cat_face", "🐈": "cat", "🐈‍⬛": "black_cat", "🦁": "lion", "🐯": "tiger_face", "🐅": "tiger", "🐆": "leopard", "🐴": "horse_face", "🫎": "moose", "🫏": "donkey", "🐎": "horse", "🦄": "unicorn", "🦓": "zebra", "🦌": "deer", "🦬": "bison", "🐮": "cow_face", "🐂": "ox", "🐃": "water_buffalo", "🐄": "cow", "🐷": "pig_face", "🐖": "pig", "🐗": "boar", "🐽": "pig_nose", "🐏": "ram", "🐑": "ewe", "🐐": "goat", "🐪": "camel", "🐫": "two_hump_camel", "🦙": "llama", "🦒": "giraffe", "🐘": "elephant", "🦣": "mammoth", "🦏": "rhinoceros", "🦛": "hippopotamus", "🐭": "mouse_face", "🐁": "mouse", "🐀": "rat", "🐹": "hamster", "🐰": "rabbit_face", "🐇": "rabbit", "🐿": "chipmunk", "🦫": "beaver", "🦔": "hedgehog", "🦇": "bat", "🐻": "bear", "🐻‍❄️": "polar_bear", "🐨": "koala", "🐼": "panda", "🦥": "sloth", "🦦": "otter", "🦨": "skunk", "🦘": "kangaroo", "🦡": "badger", "🐾": "paw_prints", "🦃": "turkey", "🐔": "chicken", "🐓": "rooster", "🐣": "hatching_chick", "🐤": "baby_chick", "🐥": "front_facing_baby_chick", "🐦": "bird", "🐧": "penguin", "🕊": "dove", "🦅": "eagle", "🦆": "duck", "🦢": "swan", "🦉": "owl", "🦤": "dodo", "🪶": "feather", "🦩": "flamingo", "🦚": "peacock", "🦜": "parrot", "🪽": "wing", "🐦‍⬛": "black_bird", "🪿": "goose", "🐦‍🔥": "phoenix", "🐸": "frog", "🐊": "crocodile", "🐢": "turtle", "🦎": "lizard", "🐍": "snake", "🐲": "dragon_face", "🐉": "dragon", "🦕": "sauropod", "🦖": "t_rex", "🐳": "spouting_whale", "🐋": "whale", "🐬": "dolphin", "🦭": "seal", "🐟": "fish", "🐠": "tropical_fish", "🐡": "blowfish", "🦈": "shark", "🐙": "octopus", "🐚": "spiral_shell", "🪸": "coral", "🪼": "jellyfish", "🦀": "crab", "🦞": "lobster", "🦐": "shrimp", "🦑": "squid", "🦪": "oyster", "🐌": "snail", "🦋": "butterfly", "🐛": "bug", "🐜": "ant", "🐝": "honeybee", "🪲": "beetle", "🐞": "lady_beetle", "🦗": "cricket", "🪳": "cockroach", "🕷": "spider", "🕸": "spider_web", "🦂": "scorpion", "🦟": "mosquito", "🪰": "fly", "🪱": "worm", "🦠": "microbe", "💐": "bouquet", "🌸": "cherry_blossom", "💮": "white_flower", "🪷": "lotus", "🏵": "rosette", "🌹": "rose", "🥀": "wilted_flower", "🌺": "hibiscus", "🌻": "sunflower", "🌼": "blossom", "🌷": "tulip", "🪻": "hyacinth", "🌱": "seedling", "🪴": "potted_plant", "🌲": "evergreen_tree", "🌳": "deciduous_tree", "🌴": "palm_tree", "🌵": "cactus", "🌾": "sheaf_of_rice", "🌿": "herb", "☘": "shamrock", "🍀": "four_leaf_clover", "🍁": "maple_leaf", "🍂": "fallen_leaf", "🍃": "leaf_fluttering_in_wind", "🪹": "empty_nest", "🪺": "nest_with_eggs", "🍄": "mushroom", "🪾": "leafless_tree", "🍇": "grapes", "🍈": "melon", "🍉": "watermelon", "🍊": "tangerine", "🍋": "lemon", "🍋‍🟩": "lime", "🍌": "banana", "🍍": "pineapple", "🥭": "mango", "🍎": "red_apple", "🍏": "green_apple", "🍐": "pear", "🍑": "peach", "🍒": "cherries", "🍓": "strawberry", "🫐": "blueberries", "🥝": "kiwi_fruit", "🍅": "tomato", "🫒": "olive", "🥥": "coconut", "🥑": "avocado", "🍆": "eggplant", "🥔": "potato", "🥕": "carrot", "🌽": "ear_of_corn", "🌶": "hot_pepper", "🫑": "bell_pepper", "🥒": "cucumber", "🥬": "leafy_green", "🥦": "broccoli", "🧄": "garlic", "🧅": "onion", "🥜": "peanuts", "🫘": "beans", "🌰": "chestnut", "🫚": "ginger_root", "🫛": "pea_pod", "🍄‍🟫": "brown_mushroom", "🫜": "root_vegetable", "🍞": "bread", "🥐": "croissant", "🥖": "baguette_bread", "🫓": "flatbread", "🥨": "pretzel", "🥯": "bagel", "🥞": "pancakes", "🧇": "waffle", "🧀": "cheese_wedge", "🍖": "meat_on_bone", "🍗": "poultry_leg", "🥩": "cut_of_meat", "🥓": "bacon", "🍔": "hamburger", "🍟": "french_fries", "🍕": "pizza", "🌭": "hot_dog", "🥪": "sandwich", "🌮": "taco", "🌯": "burrito", "🫔": "tamale", "🥙": "stuffed_flatbread", "🧆": "falafel", "🥚": "egg", "🍳": "cooking", "🥘": "shallow_pan_of_food", "🍲": "pot_of_food", "🫕": "fondue", "🥣": "bowl_with_spoon", "🥗": "green_salad", "🍿": "popcorn", "🧈": "butter", "🧂": "salt", "🥫": "canned_food", "🍱": "bento_box", "🍘": "rice_cracker", "🍙": "rice_ball", "🍚": "cooked_rice", "🍛": "curry_rice", "🍜": "steaming_bowl", "🍝": "spaghetti", "🍠": "roasted_sweet_potato", "🍢": "oden", "🍣": "sushi", "🍤": "fried_shrimp", "🍥": "fish_cake_with_swirl", "🥮": "moon_cake", "🍡": "dango", "🥟": "dumpling", "🥠": "fortune_cookie", "🥡": "takeout_box", "🍦": "soft_ice_cream", "🍧": "shaved_ice", "🍨": "ice_cream", "🍩": "doughnut", "🍪": "cookie", "🎂": "birthday_cake", "🍰": "shortcake", "🧁": "cupcake", "🥧": "pie", "🍫": "chocolate_bar", "🍬": "candy", "🍭": "lollipop", "🍮": "custard", "🍯": "honey_pot", "🍼": "baby_bottle", "🥛": "glass_of_milk", "☕": "hot_beverage", "🫖": "teapot", "🍵": "teacup_without_handle", "🍶": "sake", "🍾": "bottle_with_popping_cork", "🍷": "wine_glass", "🍸": "cocktail_glass", "🍹": "tropical_drink", "🍺": "beer_mug", "🍻": "clinking_beer_mugs", "🥂": "clinking_glasses", "🥃": "tumbler_glass", "🫗": "pouring_liquid", "🥤": "cup_with_straw", "🧋": "bubble_tea", "🧃": "beverage_box", "🧉": "mate", "🧊": "ice", "🥢": "chopsticks", "🍽": "fork_and_knife_with_plate", "🍴": "fork_and_knife", "🥄": "spoon", "🔪": "kitchen_knife", "🫙": "jar", "🏺": "amphora", "🌍": "globe_showing_europe_africa", "🌎": "globe_showing_americas", "🌏": "globe_showing_asia_australia", "🌐": "globe_with_meridians", "🗺": "world_map", "🗾": "map_of_japan", "🧭": "compass", "🏔": "snow_capped_mountain", "⛰": "mountain", "🌋": "volcano", "🗻": "mount_fuji", "🏕": "camping", "🏖": "beach_with_umbrella", "🏜": "desert", "🏝": "desert_island", "🏞": "national_park", "🏟": "stadium", "🏛": "classical_building", "🏗": "building_letruction", "🧱": "brick", "🪨": "rock", "🪵": "wood", "🛖": "hut", "🏘": "houses", "🏚": "derelict_house", "🏠": "house", "🏡": "house_with_garden", "🏢": "office_building", "🏣": "japanese_post_office", "🏤": "post_office", "🏥": "hospital", "🏦": "bank", "🏨": "hotel", "🏩": "love_hotel", "🏪": "convenience_store", "🏫": "school", "🏬": "department_store", "🏭": "factory", "🏯": "japanese_castle", "🏰": "castle", "💒": "wedding", "🗼": "tokyo_tower", "🗽": "statue_of_liberty", "⛪": "church", "🕌": "mosque", "🛕": "hindu_temple", "🕍": "synagogue", "⛩": "shinto_shrine", "🕋": "kaaba", "⛲": "fountain", "⛺": "tent", "🌁": "foggy", "🌃": "night_with_stars", "🏙": "cityscape", "🌄": "sunrise_over_mountains", "🌅": "sunrise", "🌆": "cityscape_at_dusk", "🌇": "sunset", "🌉": "bridge_at_night", "♨": "hot_springs", "🎠": "carousel_horse", "🛝": "playground_slide", "🎡": "ferris_wheel", "🎢": "roller_coaster", "💈": "barber_pole", "🎪": "circus_tent", "🚂": "locomotive", "🚃": "railway_car", "🚄": "high_speed_train", "🚅": "bullet_train", "🚆": "train", "🚇": "metro", "🚈": "light_rail", "🚉": "station", "🚊": "tram", "🚝": "monorail", "🚞": "mountain_railway", "🚋": "tram_car", "🚌": "bus", "🚍": "oncoming_bus", "🚎": "trolleybus", "🚐": "minibus", "🚑": "ambulance", "🚒": "fire_engine", "🚓": "police_car", "🚔": "oncoming_police_car", "🚕": "taxi", "🚖": "oncoming_taxi", "🚗": "automobile", "🚘": "oncoming_automobile", "🚙": "sport_utility_vehicle", "🛻": "pickup_truck", "🚚": "delivery_truck", "🚛": "articulated_lorry", "🚜": "tractor", "🏎": "racing_car", "🏍": "motorcycle", "🛵": "motor_scooter", "🦽": "manual_wheelchair", "🦼": "motorized_wheelchair", "🛺": "auto_rickshaw", "🚲": "bicycle", "🛴": "kick_scooter", "🛹": "skateboard", "🛼": "roller_skate", "🚏": "bus_stop", "🛣": "motorway", "🛤": "railway_track", "🛢": "oil_drum", "⛽": "fuel_pump", "🛞": "wheel", "🚨": "police_car_light", "🚥": "horizontal_traffic_light", "🚦": "vertical_traffic_light", "🛑": "stop_sign", "🚧": "letruction", "⚓": "anchor", "🛟": "ring_buoy", "⛵": "sailboat", "🛶": "canoe", "🚤": "speedboat", "🛳": "passenger_ship", "⛴": "ferry", "🛥": "motor_boat", "🚢": "ship", "✈": "airplane", "🛩": "small_airplane", "🛫": "airplane_departure", "🛬": "airplane_arrival", "🪂": "parachute", "💺": "seat", "🚁": "helicopter", "🚟": "suspension_railway", "🚠": "mountain_cableway", "🚡": "aerial_tramway", "🛰": "satellite", "🚀": "rocket", "🛸": "flying_saucer", "🛎": "bellhop_bell", "🧳": "luggage", "⌛": "hourglass_done", "⏳": "hourglass_not_done", "⌚": "watch", "⏰": "alarm_clock", "⏱": "stopwatch", "⏲": "timer_clock", "🕰": "mantelpiece_clock", "🕛": "twelve_o_clock", "🕧": "twelve_thirty", "🕐": "one_o_clock", "🕜": "one_thirty", "🕑": "two_o_clock", "🕝": "two_thirty", "🕒": "three_o_clock", "🕞": "three_thirty", "🕓": "four_o_clock", "🕟": "four_thirty", "🕔": "five_o_clock", "🕠": "five_thirty", "🕕": "six_o_clock", "🕡": "six_thirty", "🕖": "seven_o_clock", "🕢": "seven_thirty", "🕗": "eight_o_clock", "🕣": "eight_thirty", "🕘": "nine_o_clock", "🕤": "nine_thirty", "🕙": "ten_o_clock", "🕥": "ten_thirty", "🕚": "eleven_o_clock", "🕦": "eleven_thirty", "🌑": "new_moon", "🌒": "waxing_crescent_moon", "🌓": "first_quarter_moon", "🌔": "waxing_gibbous_moon", "🌕": "full_moon", "🌖": "waning_gibbous_moon", "🌗": "last_quarter_moon", "🌘": "waning_crescent_moon", "🌙": "crescent_moon", "🌚": "new_moon_face", "🌛": "first_quarter_moon_face", "🌜": "last_quarter_moon_face", "🌡": "thermometer", "☀": "sun", "🌝": "full_moon_face", "🌞": "sun_with_face", "🪐": "ringed_planet", "⭐": "star", "🌟": "glowing_star", "🌠": "shooting_star", "🌌": "milky_way", "☁": "cloud", "⛅": "sun_behind_cloud", "⛈": "cloud_with_lightning_and_rain", "🌤": "sun_behind_small_cloud", "🌥": "sun_behind_large_cloud", "🌦": "sun_behind_rain_cloud", "🌧": "cloud_with_rain", "🌨": "cloud_with_snow", "🌩": "cloud_with_lightning", "🌪": "tornado", "🌫": "fog", "🌬": "wind_face", "🌀": "cyclone", "🌈": "rainbow", "🌂": "closed_umbrella", "☂": "umbrella", "☔": "umbrella_with_rain_drops", "⛱": "umbrella_on_ground", "⚡": "high_voltage", "❄": "snowflake", "☃": "snowman", "⛄": "snowman_without_snow", "☄": "comet", "🔥": "fire", "💧": "droplet", "🌊": "ocean", "🎃": "jack_o_lantern", "🎄": "christmas_tree", "🎆": "fireworks", "🎇": "sparkler", "🧨": "firecracker", "✨": "sparkles", "🎈": "balloon", "🎉": "party_popper", "🎊": "confetti_ball", "🎋": "tanabata_tree", "🎍": "pine_decoration", "🎎": "japanese_dolls", "🎏": "carp_streamer", "🎐": "wind_chime", "🎑": "moon_viewing_ceremony", "🧧": "red_envelope", "🎀": "ribbon", "🎁": "wrapped_gift", "🎗": "reminder_ribbon", "🎟": "admission_tickets", "🎫": "ticket", "🎖": "military_medal", "🏆": "trophy", "🏅": "sports_medal", "🥇": "1st_place_medal", "🥈": "2nd_place_medal", "🥉": "3rd_place_medal", "⚽": "soccer_ball", "⚾": "baseball", "🥎": "softball", "🏀": "basketball", "🏐": "volleyball", "🏈": "american_football", "🏉": "rugby_football", "🎾": "tennis", "🥏": "flying_disc", "🎳": "bowling", "🏏": "cricket_game", "🏑": "field_hockey", "🏒": "ice_hockey", "🥍": "lacrosse", "🏓": "ping_pong", "🏸": "badminton", "🥊": "boxing_glove", "🥋": "martial_arts_uniform", "🥅": "goal_net", "⛳": "in_hole", "⛸": "ice_skate", "🎣": "fishing_pole", "🤿": "diving_mask", "🎽": "running_shirt", "🎿": "skis", "🛷": "sled", "🥌": "curling_stone", "🎯": "bullseye", "🪀": "yoyo", "🪁": "kite", "🔫": "water_pistol", "🎱": "pool_8_ball", "🔮": "crystal_ball", "🪄": "magic_wand", "🎮": "video_game", "🕹": "joystick", "🎰": "slot_machine", "🎲": "game_die", "🧩": "puzzle_piece", "🧸": "teddy_bear", "🪅": "piñata", "🪩": "mirror_ball", "🪆": "nesting_dolls", "♠": "spade_suit", "♥": "heart", "♦": "diamond_suit", "♣": "club_suit", "♟": "chess_pawn", "🃏": "joker", "🀄": "mahjong_red_dragon", "🎴": "flower_playing_cards", "🎭": "performing_arts", "🖼": "framed_picture", "🎨": "artist_palette", "🧵": "thread", "🪡": "sewing_needle", "🧶": "yarn", "🪢": "knot", "👓": "glasses", "🕶": "sunglasses", "🥽": "goggles", "🥼": "lab_coat", "🦺": "safety_vest", "👔": "necktie", "👕": "t_shirt", "👖": "jeans", "🧣": "scarf", "🧤": "gloves", "🧥": "coat", "🧦": "socks", "👗": "dress", "👘": "kimono", "🥻": "sari", "🩱": "one_piece_swimsuit", "🩲": "briefs", "🩳": "shorts", "👙": "bikini", "👚": "woman_s_clothes", "🪭": "folding_hand_fan", "👛": "purse", "👜": "handbag", "👝": "clutch_bag", "🛍": "shopping_bags", "🎒": "backpack", "🩴": "thong_sandal", "👞": "man_s_shoe", "👟": "running_shoe", "🥾": "hiking_boot", "🥿": "flat_shoe", "👠": "high_heeled_shoe", "👡": "woman_s_sandal", "🩰": "ballet_shoes", "👢": "woman_s_boot", "🪮": "hair_pick", "👑": "crown", "👒": "woman_s_hat", "🎩": "top_hat", "🎓": "graduation_cap", "🧢": "billed_cap", "🪖": "military_helmet", "⛑": "rescue_worker_s_helmet", "📿": "prayer_beads", "💄": "lipstick", "💍": "ring", "💎": "gem_stone", "🔇": "muted_speaker", "🔈": "speaker_low_volume", "🔉": "speaker_medium_volume", "🔊": "speaker_high_volume", "📢": "loudspeaker", "📣": "megaphone", "📯": "postal_horn", "🔔": "bell", "🔕": "bell_with_slash", "🎼": "musical_score", "🎵": "musical_note", "🎶": "musical_notes", "🎙": "studio_microphone", "🎚": "level_slider", "🎛": "control_knobs", "🎤": "microphone", "🎧": "headphone", "📻": "radio", "🎷": "saxophone", "🪗": "accordion", "🎸": "guitar", "🎹": "musical_keyboard", "🎺": "trumpet", "🎻": "violin", "🪕": "banjo", "🥁": "drum", "🪘": "long_drum", "🪇": "maracas", "🪈": "flute", "🪉": "harp", "📱": "mobile_phone", "📲": "mobile_phone_with_arrow", "☎": "telephone", "📞": "telephone_receiver", "📟": "pager", "📠": "fax_machine", "🔋": "battery", "🪫": "low_battery", "🔌": "electric_plug", "💻": "laptop", "🖥": "desktop_computer", "🖨": "printer", "⌨": "keyboard", "🖱": "computer_mouse", "🖲": "trackball", "💽": "computer_disk", "💾": "floppy_disk", "💿": "optical_disk", "📀": "dvd", "🧮": "abacus", "🎥": "movie_camera", "🎞": "film_frames", "📽": "film_projector", "🎬": "clapper_board", "📺": "television", "📷": "camera", "📸": "camera_with_flash", "📹": "video_camera", "📼": "videocassette", "🔍": "magnifying_glass_tilted_left", "🔎": "magnifying_glass_tilted_right", "🕯": "candle", "💡": "light_bulb", "🔦": "flashlight", "🏮": "red_paper_lantern", "🪔": "diya_lamp", "📔": "notebook_with_decorative_cover", "📕": "closed_book", "📖": "open_book", "📗": "green_book", "📘": "blue_book", "📙": "orange_book", "📚": "books", "📓": "notebook", "📒": "ledger", "📃": "page_with_curl", "📜": "scroll", "📄": "page_facing_up", "📰": "newspaper", "🗞": "rolled_up_newspaper", "📑": "bookmark_tabs", "🔖": "bookmark", "🏷": "label", "💰": "money_bag", "🪙": "coin", "💴": "yen_banknote", "💵": "dollar_banknote", "💶": "euro_banknote", "💷": "pound_banknote", "💸": "money_with_wings", "💳": "credit_card", "🧾": "receipt", "💹": "chart_increasing_with_yen", "✉": "envelope", "📧": "e_mail", "📨": "incoming_envelope", "📩": "envelope_with_arrow", "📤": "outbox_tray", "📥": "inbox_tray", "📦": "package", "📫": "closed_mailbox_with_raised_flag", "📪": "closed_mailbox_with_lowered_flag", "📬": "open_mailbox_with_raised_flag", "📭": "open_mailbox_with_lowered_flag", "📮": "postbox", "🗳": "ballot_box_with_ballot", "✏": "pencil", "✒": "black_nib", "🖋": "fountain_pen", "🖊": "pen", "🖌": "paintbrush", "🖍": "crayon", "📝": "memo", "💼": "briefcase", "📁": "file_folder", "📂": "open_file_folder", "🗂": "card_index_dividers", "📅": "date", "📆": "tear_off_calendar", "🗒": "spiral_notepad", "🗓": "spiral_calendar", "📇": "card_index", "📈": "chart_increasing", "📉": "chart_decreasing", "📊": "bar_chart", "📋": "clipboard", "📌": "pushpin", "📍": "round_pushpin", "📎": "paperclip", "🖇": "linked_paperclips", "📏": "straight_ruler", "📐": "triangular_ruler", "✂": "scissors", "🗃": "card_file_box", "🗄": "file_cabinet", "🗑": "wastebasket", "🔒": "locked", "🔓": "unlocked", "🔏": "locked_with_pen", "🔐": "locked_with_key", "🔑": "key", "🗝": "old_key", "🔨": "hammer", "🪓": "axe", "⛏": "pick", "⚒": "hammer_and_pick", "🛠": "hammer_and_wrench", "🗡": "dagger", "⚔": "crossed_swords", "💣": "bomb", "🪃": "boomerang", "🏹": "bow_and_arrow", "🛡": "shield", "🪚": "carpentry_saw", "🔧": "wrench", "🪛": "screwdriver", "🔩": "nut_and_bolt", "⚙": "gear", "🗜": "clamp", "⚖": "balance_scale", "🦯": "white_cane", "🔗": "link", "⛓️‍💥": "broken_chain", "⛓": "chains", "🪝": "hook", "🧰": "toolbox", "🧲": "magnet", "🪜": "ladder", "🪏": "shovel", "⚗": "alembic", "🧪": "test_tube", "🧫": "petri_dish", "🧬": "dna", "🔬": "microscope", "🔭": "telescope", "📡": "satellite_antenna", "💉": "syringe", "🩸": "drop_of_blood", "💊": "pill", "🩹": "adhesive_bandage", "🩼": "crutch", "🩺": "stethoscope", "🩻": "x_ray", "🚪": "door", "🛗": "elevator", "🪞": "mirror", "🪟": "window", "🛏": "bed", "🛋": "couch_and_lamp", "🪑": "chair", "🚽": "toilet", "🪠": "plunger", "🚿": "shower", "🛁": "bathtub", "🪤": "mouse_trap", "🪒": "razor", "🧴": "lotion_bottle", "🧷": "safety_pin", "🧹": "broom", "🧺": "basket", "🧻": "roll_of_paper", "🪣": "bucket", "🧼": "soap", "🫧": "bubbles", "🪥": "toothbrush", "🧽": "sponge", "🧯": "fire_extinguisher", "🛒": "shopping_cart", "🚬": "cigarette", "⚰": "coffin", "🪦": "headstone", "⚱": "funeral_urn", "🧿": "nazar_amulet", "🪬": "hamsa", "🗿": "moai", "🪧": "placard", "🪪": "identification_card", "🏧": "atm_sign", "🚮": "litter_in_bin_sign", "🚰": "potable_water", "♿": "wheelchair_symbol", "🚹": "men_s_room", "🚺": "women_s_room", "🚻": "restroom", "🚼": "baby_symbol", "🚾": "water_closet", "🛂": "passport_control", "🛃": "customs", "🛄": "baggage_claim", "🛅": "left_luggage", "⚠": "warning", "🚸": "children_crossing", "⛔": "no_entry", "🚫": "prohibited", "🚳": "no_bicycles", "🚭": "no_smoking", "🚯": "no_littering", "🚱": "non_potable_water", "🚷": "no_pedestrians", "📵": "no_mobile_phones", "🔞": "no_one_under_eighteen", "☢": "radioactive", "☣": "biohazard", "⬆": "up_arrow", "↗": "up_right_arrow", "➡": "right_arrow", "↘": "down_right_arrow", "⬇": "down_arrow", "↙": "down_left_arrow", "⬅": "left_arrow", "↖": "up_left_arrow", "↕": "up_down_arrow", "↩": "right_arrow_curving_left", "↪": "left_arrow_curving_right", "⤴": "right_arrow_curving_up", "⤵": "right_arrow_curving_down", "🔃": "clockwise_vertical_arrows", "🔄": "counterclockwise_arrows_button", "🔙": "back_arrow", "🔚": "end_arrow", "🔛": "on_arrow", "🔜": "soon_arrow", "🔝": "top_arrow", "🛐": "place_of_worship", "⚛": "atom_symbol", "🕉": "om", "✡": "star_of_david", "☸": "wheel_of_dharma", "☯": "yin_yang", "✝": "latin_cross", "☦": "orthodox_cross", "☪": "star_and_crescent", "☮": "peace_symbol", "🕎": "menorah", "🔯": "dotted_six_pointed_star", "🪯": "khanda", "♈": "aries", "♉": "taurus", "♊": "gemini", "♋": "cancer", "♌": "leo", "♍": "virgo", "♎": "libra", "♏": "scorpio", "♐": "sagittarius", "♑": "capricorn", "♒": "aquarius", "♓": "pisces", "⛎": "ophiuchus", "🔀": "shuffle_tracks_button", "🔁": "repeat_button", "🔂": "repeat_single_button", "▶": "play_button", "⏩": "fast_forward_button", "⏭": "next_track_button", "⏯": "play_or_pause_button", "◀": "reverse_button", "⏪": "fast_reverse_button", "⏮": "last_track_button", "🔼": "upwards_button", "⏫": "fast_up_button", "🔽": "downwards_button", "⏬": "fast_down_button", "⏸": "pause_button", "⏹": "stop_button", "⏺": "record_button", "⏏": "eject_button", "🎦": "cinema", "🔅": "dim_button", "🔆": "bright_button", "📶": "antenna_bars", "🛜": "wireless", "📳": "vibration_mode", "📴": "mobile_phone_off", "♀": "female_sign", "♂": "male_sign", "⚧": "transgender_symbol", "✖": "multiply", "➕": "plus", "➖": "minus", "➗": "divide", "🟰": "heavy_equals_sign", "♾": "infinity", "‼": "double_exclamation_mark", "⁉": "exclamation_question_mark", "❓": "red_question_mark", "❔": "white_question_mark", "❕": "white_exclamation_mark", "❗": "red_exclamation_mark", "〰": "wavy_dash", "💱": "currency_exchange", "💲": "heavy_dollar_sign", "⚕": "medical_symbol", "♻": "recycling_symbol", "⚜": "fleur_de_lis", "🔱": "trident_emblem", "📛": "name_badge", "🔰": "japanese_symbol_for_beginner", "⭕": "hollow_red_circle", "✅": "white_check_mark", "☑": "check_box_with_check", "✔": "check_mark", "❌": "cross_mark", "❎": "cross_mark_button", "➰": "curly_loop", "➿": "double_curly_loop", "〽": "part_alternation_mark", "✳": "eight_spoked_asterisk", "✴": "eight_pointed_star", "❇": "sparkle", "™": "trade_mark", "🫟": "splatter", "#️⃣": "hash", "*️⃣": "asterisk", "0️⃣": "zero", "1️⃣": "one", "2️⃣": "two", "3️⃣": "three", "4️⃣": "four", "5️⃣": "five", "6️⃣": "six", "7️⃣": "seven", "8️⃣": "eight", "9️⃣": "nine", "🔟": "ten", "🔠": "input_latin_uppercase", "🔡": "input_latin_lowercase", "🔢": "1234", "🔣": "input_symbols", "🔤": "input_latin_letters", "🅰": "a_button_blood_type", "🆎": "ab_button_blood_type", "🅱": "b_button_blood_type", "🆑": "cl_button", "🆒": "cool_button", "🆓": "free_button", ℹ: "information_source", "🆔": "id_button", "Ⓜ": "circled_m", "🆕": "new_button", "🆖": "ng_button", "🅾": "o_button_blood_type", "🆗": "ok_button", "🅿": "p_button", "🆘": "sos_button", "🆙": "up_button", "🆚": "vs_button", "🈁": "japanese_here_button", "🈂": "japanese_service_charge_button", "🈷": "japanese_monthly_amount_button", "🈶": "japanese_not_free_of_charge_button", "🈯": "japanese_reserved_button", "🉐": "japanese_bargain_button", "🈹": "japanese_discount_button", "🈚": "japanese_free_of_charge_button", "🈲": "japanese_prohibited_button", "🉑": "japanese_acceptable_button", "🈸": "japanese_application_button", "🈴": "japanese_passing_grade_button", "🈳": "japanese_vacancy_button", "㊗": "japanese_congratulations_button", "㊙": "japanese_secret_button", "🈺": "japanese_open_for_business_button", "🈵": "japanese_no_vacancy_button", "🔴": "red_circle", "🟠": "orange_circle", "🟡": "yellow_circle", "🟢": "green_circle", "🔵": "blue_circle", "🟣": "purple_circle", "🟤": "brown_circle", "⚫": "black_circle", "⚪": "white_circle", "🟥": "red_square", "🟧": "orange_square", "🟨": "yellow_square", "🟩": "green_square", "🟦": "blue_square", "🟪": "purple_square", "🟫": "brown_square", "⬛": "black_large_square", "⬜": "white_large_square", "◼": "black_medium_square", "◻": "white_medium_square", "◾": "black_medium_small_square", "◽": "white_medium_small_square", "▪": "black_small_square", "▫": "white_small_square", "🔶": "large_orange_diamond", "🔷": "large_blue_diamond", "🔸": "small_orange_diamond", "🔹": "small_blue_diamond", "🔺": "red_triangle_pointed_up", "🔻": "red_triangle_pointed_down", "💠": "diamond_with_a_dot", "🔘": "radio_button", "🔳": "white_square_button", "🔲": "black_square_button", "🏁": "chequered_flag", "🚩": "triangular_flag", "🎌": "crossed_flags", "🏴": "black_flag", "🏳": "white_flag", "🏳️‍🌈": "rainbow_flag", "🏳️‍⚧️": "transgender_flag", "🏴‍☠️": "pirate_flag", "🇦🇨": "ascension_island", "🇦🇩": "andorra", "🇦🇪": "united_arab_emirates", "🇦🇫": "afghanistan", "🇦🇬": "antigua_barbuda", "🇦🇮": "anguilla", "🇦🇱": "albania", "🇦🇲": "armenia", "🇦🇴": "angola", "🇦🇶": "antarctica", "🇦🇷": "argentina", "🇦🇸": "american_samoa", "🇦🇹": "austria", "🇦🇺": "australia", "🇦🇼": "aruba", "🇦🇽": "åland_islands", "🇦🇿": "azerbaijan", "🇧🇦": "bosnia_herzegovina", "🇧🇧": "barbados", "🇧🇩": "bangladesh", "🇧🇪": "belgium", "🇧🇫": "burkina_faso", "🇧🇬": "bulgaria", "🇧🇭": "bahrain", "🇧🇮": "burundi", "🇧🇯": "benin", "🇧🇱": "st_barthelemy", "🇧🇲": "bermuda", "🇧🇳": "brunei", "🇧🇴": "bolivia", "🇧🇶": "caribbean_netherlands", "🇧🇷": "brazil", "🇧🇸": "bahamas", "🇧🇹": "bhutan", "🇧🇻": "bouvet_island", "🇧🇼": "botswana", "🇧🇾": "belarus", "🇧🇿": "belize", "🇨🇦": "canada", "🇨🇨": "cocos_keeling_islands", "🇨🇩": "congo_kinshasa", "🇨🇫": "central_african_republic", "🇨🇬": "congo_brazzaville", "🇨🇭": "switzerland", "🇨🇮": "côte_d_ivoire", "🇨🇰": "cook_islands", "🇨🇱": "chile", "🇨🇲": "cameroon", "🇨🇳": "china", "🇨🇴": "colombia", "🇨🇵": "clipperton_island", "🇨🇷": "costa_rica", "🇨🇺": "cuba", "🇨🇻": "cape_verde", "🇨🇼": "curaçao", "🇨🇽": "christmas_island", "🇨🇾": "cyprus", "🇨🇿": "czechia", "🇩🇪": "germany", "🇩🇬": "diego_garcia", "🇩🇯": "djibouti", "🇩🇰": "denmark", "🇩🇲": "dominica", "🇩🇴": "dominican_republic", "🇩🇿": "algeria", "🇪🇦": "ceuta_melilla", "🇪🇨": "ecuador", "🇪🇪": "estonia", "🇪🇬": "egypt", "🇪🇭": "western_sahara", "🇪🇷": "eritrea", "🇪🇸": "spain", "🇪🇹": "ethiopia", "🇪🇺": "european_union", "🇫🇮": "finland", "🇫🇯": "fiji", "🇫🇰": "falkland_islands", "🇫🇲": "micronesia", "🇫🇴": "faroe_islands", "🇫🇷": "france", "🇬🇦": "gabon", "🇬🇧": "united_kingdom", "🇬🇩": "grenada", "🇬🇪": "georgia", "🇬🇫": "french_guiana", "🇬🇬": "guernsey", "🇬🇭": "ghana", "🇬🇮": "gibraltar", "🇬🇱": "greenland", "🇬🇲": "gambia", "🇬🇳": "guinea", "🇬🇵": "guadeloupe", "🇬🇶": "equatorial_guinea", "🇬🇷": "greece", "🇬🇸": "south_georgia_south_sandwich_islands", "🇬🇹": "guatemala", "🇬🇺": "guam", "🇬🇼": "guinea_bissau", "🇬🇾": "guyana", "🇭🇰": "hong_kong_sar_china", "🇭🇲": "heard_mcdonald_islands", "🇭🇳": "honduras", "🇭🇷": "croatia", "🇭🇹": "haiti", "🇭🇺": "hungary", "🇮🇨": "canary_islands", "🇮🇩": "indonesia", "🇮🇪": "ireland", "🇮🇱": "israel", "🇮🇲": "isle_of_man", "🇮🇳": "india", "🇮🇴": "british_indian_ocean_territory", "🇮🇶": "iraq", "🇮🇷": "iran", "🇮🇸": "iceland", "🇮🇹": "italy", "🇯🇪": "jersey", "🇯🇲": "jamaica", "🇯🇴": "jordan", "🇯🇵": "japan", "🇰🇪": "kenya", "🇰🇬": "kyrgyzstan", "🇰🇭": "cambodia", "🇰🇮": "kiribati", "🇰🇲": "comoros", "🇰🇳": "st_kitts_nevis", "🇰🇵": "north_korea", "🇰🇷": "south_korea", "🇰🇼": "kuwait", "🇰🇾": "cayman_islands", "🇰🇿": "kazakhstan", "🇱🇦": "laos", "🇱🇧": "lebanon", "🇱🇨": "st_lucia", "🇱🇮": "liechtenstein", "🇱🇰": "sri_lanka", "🇱🇷": "liberia", "🇱🇸": "lesotho", "🇱🇹": "lithuania", "🇱🇺": "luxembourg", "🇱🇻": "latvia", "🇱🇾": "libya", "🇲🇦": "morocco", "🇲🇨": "monaco", "🇲🇩": "moldova", "🇲🇪": "montenegro", "🇲🇫": "st_martin", "🇲🇬": "madagascar", "🇲🇭": "marshall_islands", "🇲🇰": "north_macedonia", "🇲🇱": "mali", "🇲🇲": "myanmar_burma", "🇲🇳": "mongolia", "🇲🇴": "macao_sar_china", "🇲🇵": "northern_mariana_islands", "🇲🇶": "martinique", "🇲🇷": "mauritania", "🇲🇸": "montserrat", "🇲🇹": "malta", "🇲🇺": "mauritius", "🇲🇻": "maldives", "🇲🇼": "malawi", "🇲🇽": "mexico", "🇲🇾": "malaysia", "🇲🇿": "mozambique", "🇳🇦": "namibia", "🇳🇨": "new_caledonia", "🇳🇪": "niger", "🇳🇫": "norfolk_island", "🇳🇬": "nigeria", "🇳🇮": "nicaragua", "🇳🇱": "netherlands", "🇳🇴": "norway", "🇳🇵": "nepal", "🇳🇷": "nauru", "🇳🇺": "niue", "🇳🇿": "new_zealand", "🇴🇲": "oman", "🇵🇦": "panama", "🇵🇪": "peru", "🇵🇫": "french_polynesia", "🇵🇬": "papua_new_guinea", "🇵🇭": "philippines", "🇵🇰": "pakistan", "🇵🇱": "poland", "🇵🇲": "st_pierre_miquelon", "🇵🇳": "pitcairn_islands", "🇵🇷": "puerto_rico", "🇵🇸": "palestinian_territories", "🇵🇹": "portugal", "🇵🇼": "palau", "🇵🇾": "paraguay", "🇶🇦": "qatar", "🇷🇪": "reunion", "🇷🇴": "romania", "🇷🇸": "serbia", "🇷🇺": "russia", "🇷🇼": "rwanda", "🇸🇦": "saudi_arabia", "🇸🇧": "solomon_islands", "🇸🇨": "seychelles", "🇸🇩": "sudan", "🇸🇪": "sweden", "🇸🇬": "singapore", "🇸🇭": "st_helena", "🇸🇮": "slovenia", "🇸🇯": "svalbard_jan_mayen", "🇸🇰": "slovakia", "🇸🇱": "sierra_leone", "🇸🇲": "san_marino", "🇸🇳": "senegal", "🇸🇴": "somalia", "🇸🇷": "suriname", "🇸🇸": "south_sudan", "🇸🇹": "sao_tome_principe", "🇸🇻": "el_salvador", "🇸🇽": "sint_maarten", "🇸🇾": "syria", "🇸🇿": "eswatini", "🇹🇦": "tristan_da_cunha", "🇹🇨": "turks_caicos_islands", "🇹🇩": "chad", "🇹🇫": "french_southern_territories", "🇹🇬": "togo", "🇹🇭": "thailand", "🇹🇯": "tajikistan", "🇹🇰": "tokelau", "🇹🇱": "timor_leste", "🇹🇲": "turkmenistan", "🇹🇳": "tunisia", "🇹🇴": "tonga", "🇹🇷": "türkiye", "🇹🇹": "trinidad_tobago", "🇹🇻": "tuvalu", "🇹🇼": "taiwan", "🇹🇿": "tanzania", "🇺🇦": "ukraine", "🇺🇬": "uganda", "🇺🇲": "us_outlying_islands", "🇺🇳": "united_nations", "🇺🇸": "united_states", "🇺🇾": "uruguay", "🇺🇿": "uzbekistan", "🇻🇦": "vatican_city", "🇻🇨": "st_vincent_grenadines", "🇻🇪": "venezuela", "🇻🇬": "british_virgin_islands", "🇻🇮": "us_virgin_islands", "🇻🇳": "vietnam", "🇻🇺": "vanuatu", "🇼🇫": "wallis_futuna", "🇼🇸": "samoa", "🇽🇰": "kosovo", "🇾🇪": "yemen", "🇾🇹": "mayotte", "🇿🇦": "south_africa", "🇿🇲": "zambia", "🇿🇼": "zimbabwe", "🏴󠁧󠁢󠁥󠁮󠁧󠁿": "england", "🏴󠁧󠁢󠁳󠁣󠁴󠁿": "scotland", "🏴󠁧󠁢󠁷󠁬󠁳󠁿": "wales", "☻": "slight_smile", "♡": "heart" };
			let emojiAliases = { st_barthelemy: ["st_barthélemy"], pinata: ["piñata"], reunion: ["réunion"], sao_tome_principe: ["são_tomé_príncipe"], x_ray: ["xray"], right_anger_bubble: ["anger_right"], ballot_box: ["ballot_box_with_ballot"], man_bouncing_ball: ["basketball_man"], person_bouncing_ball: ["person_with_ball", "basketball_player"], bellhop_bell: ["bellhop"], biohazard: ["biohazard_sign"], bow_and_arrow: ["archery"], spiral_calendar: ["calendar_spiral", "spiral_calendar_pad"], card_file_box: ["card_box"], champagne: ["bottle_with_popping_cork"], cheese: ["cheese_wedge"], cityscape_at_dusk: ["city_sunset", "city_dusk"], couch_and_lamp: ["couch"], crayon: ["lower_left_crayon"], cricket_game: ["cricket_bat_and_ball", "cricket_bat_ball"], latin_cross: ["cross"], dagger: ["dagger_knife"], desktop_computer: ["desktop"], card_index_dividers: ["dividers"], dove: ["dove_of_peace"], footprints: ["feet"], fire: ["flame"], black_flag: ["flag_black", "waving_black_flag"], white_flag: ["flag_white", "waving_white_flag"], framed_picture: ["frame_photo", "frame_with_picture"], hammer_and_pick: ["hammer_pick"], houses: ["homes", "house_buildings"], hotdog: ["hot_dog"], derelict_house: ["house_abandoned", "derelict_house_building"], desert_island: ["island"], old_key: ["key2"], person_lifting_weights: ["lifter", "weight_lifter"], military_medal: ["medal_military"], sports_medal: ["medal_sports", "medal"], sign_of_the_horns: ["metal"], fu: ["middle_finger", "reversed_hand_with_middle_finger_extended"], motorcycle: ["racing_motorcycle"], mountain_snow: ["snow_capped_mountain"], spiral_notepad: ["notepad_spiral", "spiral_note_pad"], oil_drum: ["oil"], old_woman: ["grandma", "older_woman"], old_man: ["older_man", "grandpa"], paintbrush: ["lower_left_paintbrush"], paperclips: ["linked_paperclips"], pause_button: ["double_vertical_bar"], peace_symbol: ["peace"], fountain_pen: ["pen_fountain", "lower_left_fountain_pen"], ping_pong: ["table_tennis"], place_of_worship: ["worship_symbol"], poop: ["poo", "shit", "pile_of_poo", "hankey"], radioactive: ["radioactive_sign"], railway_track: ["railroad_track"], robot: ["robot_face"], skull: ["skeleton"], skull_and_crossbones: ["skull_crossbones"], speaking_head: ["speaking_head_in_silhouette"], man_detective: ["spy", "sleuth_or_spy", "male_detective"], thinking: ["thinking_face"], cloud_with_lightning_and_rain: ["thunder_cloud_rain", "thunder_cloud_and_rain",], tickets: ["admission_tickets"], next_track_button: ["track_next", "next_track"], unicorn: ["unicorn_face"], funeral_urn: ["urn"], sun_behind_large_cloud: ["white_sun_cloud", "white_sun_behind_cloud"], sun_behind_rain_cloud: ["white_sun_rain_cloud", "white_sun_behind_cloud_with_rain",], sun_behind_cloud: ["partly_sunny"], sun_behind_small_cloud: ["white_sun_small_cloud", "white_sun_with_small_cloud",], umbrella: ["umbrella2", "open_umbrella"], hammer_and_wrench: ["tools"], face_with_thermometer: ["thermometer_face"], timer_clock: ["timer"], slightly_smiling_face: ["slightly_smiling", "slight_smile"], upside_down_face: ["upside_down"], money_mouth_face: ["money_mouth"], nerd_face: ["nerd"], hugs: ["hugging", "hugging_face", "smiling_face_with_open_hands"], roll_eyes: ["face_with_rolling_eyes", "rolling_eyes"], slightly_frowning_face: ["slight_frown"], frowning: ["frowning_face", "frowning2", "white_frowning_face"], zipper_mouth_face: ["zipper_mouth"], face_with_head_bandage: ["head_bandage"], hand_with_fingers_splayed: ["raised_hand_with_fingers_splayed", "hand_splayed",], raised_hand: ["hand"], vulcan_salute: ["vulcan", "raised_hand_with_part_between_middle_and_ring_fingers",], police_officer: ["policeman", "cop"], man_walking: ["walking_man"], person_walking: ["walking"], man_bowing: ["bow", "bowing_man"], passenger_ship: ["cruise_ship"], motor_boat: ["motorboat", "boat"], flight_arrival: ["airplane_arriving"], flight_departure: ["airplane_departure"], small_airplane: ["airplane_small"], racing_car: ["race_car"], family_man_woman_boy_boy: ["family_man_woman_boys"], family_man_woman_girl_girl: ["family_man_woman_girls"], family_woman_woman_boy: ["family_women_boy"], family_woman_woman_girl: ["family_women_girl"], family_woman_woman_girl_boy: ["family_women_girl_boy"], family_woman_woman_boy_boy: ["family_women_boys"], family_woman_woman_girl_girl: ["family_women_girls"], family_man_man_boy: ["family_men_boy"], family_man_man_girl: ["family_men_girl"], family_man_man_girl_boy: ["family_men_girl_boy"], family_man_man_boy_boy: ["family_men_boys"], family_man_man_girl_girl: ["family_men_girls"], cloud_with_lightning: ["cloud_lightning"], tornado: ["cloud_tornado", "cloud_with_tornado"], cloud_with_rain: ["cloud_rain"], cloud_with_snow: ["cloud_snow"], studio_microphone: ["microphone2"], honeybee: ["bee"], lion: ["lion_face"], satellite: ["artificial_satellite", "satellite_orbital"], computer_mouse: ["mouse_three_button", "three_button_mouse"], wind_face: ["wind_blowing_face"], man_golfing: ["golfer", "golfing_man"], building_letruction: ["letruction_site"], family_man_woman_girl_boy: ["family"], ice_hockey: ["hockey"], play_or_pause_button: ["play_pause"], film_projector: ["projector"], shopping: ["shopping_bags"], open_book: ["book"], national_park: ["park"], world_map: ["map"], pen: ["pen_ballpoint", "lower_left_ballpoint_pen"], e_mail: ["e-mail", "email"], atom_symbol: ["atom"], mantelpiece_clock: ["clock"], camera_flash: ["camera_with_flash"], film_strip: ["film_frames"], balance_scale: ["scales"], person_surfing: ["surfer"], man_surfing: ["surfing_man"], kiss_woman_man: ["kiss", "couplekiss", "couplekiss_man_woman"], kiss_woman_woman: ["couplekiss_woman_woman", "female_couplekiss"], kiss_man_man: ["couplekiss_man_man", "male_couplekiss"], couple_with_heart_man_man: ["male_couple_with_heart"], couple_with_heart: ["couple_with_heart_woman_man"], couple_with_heart_woman_woman: ["female_couple_with_heart"], clamp: ["compression"], person_in_bed: ["sleeping_accommodation", "sleeping_bed"], om: ["om_symbol"], man_rowing_boat: ["rowing_boat", "rowboat", "rowing_man"], new_moon: ["moon"], fleur_de_lis: ["fleur-de-lis"], face_vomiting: ["puke"], smile: ["grinning_face_with_smiling_eyes"], frowning_with_open_mouth: ["frowning_face_with_open_mouth"], grinning_face: ["grinning"], grinning_face_with_big_eyes: ["smiley"], grinning_face_with_smiling_eyes: ["smile"], grin: ["beaming_face_with_smiling_eyes"], laughing: ["grinning_squinting_face", "satisfied"], sweat_smile: ["grinning_face_with_sweat"], rofl: ["rolling_on_the_floor_laughing"], joy: ["face_with_tears_of_joy"], wink: ["winking_face"], blush: ["smiling_face_with_smiling_eyes"], innocent: ["smiling_face_with_halo"], smiling_face_with_three_hearts: ["smiling_face_with_hearts"], heart_eyes: ["smiling_face_with_heart_eyes"], face_blowing_a_kiss: ["kissing_heart"], kissing_face: ["kissing"], kissing_face_with_closed_eyes: ["kissing_closed_eyes"], kissing_face_with_smiling_eyes: ["kissing_smiling_eyes"], face_savoring_food: ["yum"], face_with_tongue: ["stuck_out_tongue"], winking_face_with_tongue: ["stuck_out_tongue_winking_eye"], zany_face: ["crazy_face"], squinting_face_with_tongue: ["stuck_out_tongue_closed_eyes"], expressionless_face: ["expressionless"], face_without_mouth: ["no_mouth"], smirking_face: ["smirk"], unamused_face: ["unamused"], grimacing: ["grimacing_face"], relieved_face: ["relieved", "relaxed"], pensive_face: ["pensive"], sleepy_face: ["sleepy"], sleeping_face: ["sleeping"], face_with_medical_mask: ["mask"], face_with_crossed_out_eyes: ["dizzy_face"], confused: ["confused_face"], worried: ["worried_face"], open_mouth: ["face_with_open_mouth"], hushed_face: ["hushed"], astonished_face: ["astonished"], flushed_face: ["flushed"], frowning_face_with_open_mouth: ["frowning_with_open_mouth"], anguished_face: ["anguished"], fearful: ["fearful_face"], anxious_face_with_sweat: ["cold_sweat"], sad_but_relieved_face: ["disappointed_relieved"], cry: ["crying_face"], sob: ["loudly_crying_face"], scream: ["face_screaming_in_fear"], confounded_face: ["confounded"], persevering_face: ["persevere"], disappointed_face: ["disappointed"], downcast_face_with_sweat: ["sweat"], weary_face: ["weary"], face_with_steam_from_nose: ["triumph"], enraged_face: ["rage"], angry: ["angry_face"], face_with_symbols_on_mouth: ["face_with_symbols_over_mouth"], smiling_face_with_horns: ["smiling_imp"], angry_face_with_horns: ["imp"], ogre: ["japanese_ogre"], goblin: ["japanese_goblin"], alien_monster: ["space_invader"], grinning_cat: ["smiley_cat"], grinning_cat_with_smiling_eyes: ["smile_cat"], joy_cat: ["cat_with_tears_of_joy"], smiling_cat_with_heart_eyes: ["heart_eyes_cat"], cat_with_wry_smile: ["smirk_cat"], weary_cat: ["scream_cat"], crying_cat: ["crying_cat_face"], see_no_evil_monkey: ["see_no_evil"], hear_no_evil_monkey: ["hear_no_evil"], speak_no_evil_monkey: ["speak_no_evil"], heart_with_arrow: ["cupid"], heart_with_ribbon: ["gift_heart"], growing_heart: ["heartpulse"], beating_heart: ["heartbeat"], heart_exclamation: ["heavy_heart_exclamation", "heavy_heart_exclamation_mark_ornament",], heart: ["red_heart"], 100: ["hundred_points"], anger_symbol: ["anger"], collision: ["boom"], sweat_droplets: ["sweat_drops"], dashing_away: ["dash"], waving_hand: ["wave"], victory_hand: ["v"], backhand_index_pointing_left: ["point_left"], backhand_index_pointing_right: ["point_right"], backhand_index_pointing_up: ["point_up_2"], backhand_index_pointing_down: ["point_down"], index_pointing_up: ["point_up"], "+1": ["thumbs_up", "thumbsup"], "-1": ["thumbs_down", "thumbsdown"], raised_fist: ["fist"], oncoming_fist: ["facepunch", "punch"], left_facing_fist: ["fist_left"], right_facing_fist: ["fist_right"], clap: ["clapping_hands"], raising_hands: ["raised_hands"], folded_hands: ["pray"], nail_polish: ["nail_care"], flexed_biceps: ["muscle"], ear_with_hearing_aid: ["hear_with_hearing_aid"], mouth: ["lips"], person: ["adult"], person_blond_hair: ["person_with_blond_hair"], person_beard: ["bearded_person"], man_red_hair: ["man_red_haired"], man_curly_hair: ["man_curly_haired"], man_white_hair: ["man_white_haired"], woman_red_hair: ["woman_red_haired"], woman_curly_hair: ["woman_curly_haired"], woman_white_hair: ["woman_white_haired"], blonde_woman: ["woman_blond_hair"], blonde_man: ["man_blond_hair"], older_person: ["old_person", "older_adult"], man_frowning: ["frowning_man"], woman_frowning: ["frowning_woman"], man_pouting: ["pouting_man"], woman_pouting: ["pouting_woman"], person_pouting: ["person_with_pouting_face"], man_gesturing_no: ["no_good_man"], woman_gesturing_no: ["no_good_woman"], person_gesturing_no: ["no_good"], man_gesturing_ok: ["ok_man"], woman_gesturing_ok: ["ok_woman"], man_tipping_hand: ["tipping_hand_man"], woman_tipping_hand: ["tipping_hand_woman"], person_tipping_hand: ["information_desk_person"], man_raising_hand: ["raising_hand_man"], woman_raising_hand: ["raising_hand_woman"], person_raising_hand: ["raising_hand"], woman_bowing: ["bowing_woman"], woman_police_officer: ["policewoman"], woman_detective: ["female_detective"], guard: ["guardsman"], woman_guard: ["guardswoman"], person_with_skullcap: ["man_with_gua_pi_mao"], letruction_worker_man: ["man_letruction_worker"], letruction_worker_woman: ["woman_letruction_worker"], woman_wearing_turban: ["woman_with_turban"], man_wearing_turban: ["man_with_turban"], person_with_veil: ["bride_with_veil"], baby_angel: ["angel"], santa_claus: ["santa"], merperson: ["mermaid"], man_getting_massage: ["massage_man"], woman_getting_massage: ["massage_woman", "massage"], person_getting_haircut: ["haircut"], man_getting_haircut: ["haircut_man"], woman_getting_haircut: ["haircut_woman"], woman_walking: ["walking_woman"], man_with_white_cane: ["man_with_probing_cane"], woman_with_white_cane: ["woman_with_probing_cane"], woman_running: ["running_woman"], man_running: ["running_man", "runner"], woman_dancing: ["dancer"], people_with_bunny_ears: ["dancing_women", "dancers"], person_in_suit_levitating: ["business_suit_levitating", "man_in_business_suit_levitating", "levitate",], men_with_bunny_ears: ["dancing_men"], woman_golfing: ["golfing_woman"], woman_surfing: ["surfing_woman"], woman_rowing_boat: ["rowing_woman"], woman_swimming: ["swimming_woman"], man_swimming: ["swimming_man", "swimmer"], woman_bouncing_ball: ["basketball_woman"], woman_lifting_weights: ["weight_lifting_woman"], man_lifting_weights: ["weight_lifting_man"], man_biking: ["biking_man", "bicyclist"], woman_biking: ["biking_woman"], woman_mountain_biking: ["mountain_biking_woman"], man_mountain_biking: ["mountain_biking_man", "mountain_bicyclist"], person_taking_bath: ["bath"], women_holding_hands: ["two_women_holding_hands"], woman_and_man_holding_hands: ["couple"], men_holding_hands: ["two_men_holding_hands"], family: ["family_man_woman_boy"], dog: ["dog2"], cat: ["cat2"], tiger: ["tiger2"], horse: ["racehorse"], cow: ["cow2"], pig: ["pig2"], fox: ["fox_face"], ewe: ["sheep"], camel: ["dromedary_camel"], mouse: ["mouse2"], rabbit: ["rabbit2"], panda: ["panda_face"], front_facing_baby_chick: ["hatched_chick"], spouting_whale: ["whale2"], spiral_shell: ["shell"], sheaf_of_rice: ["ear_of_rice"], leaf_fluttering_in_wind: ["leaves"], red_apple: ["apple"], ear_of_corn: ["corn"], cheese_wedge: ["cheese"], french_fries: ["fries"], hot_dog: ["hotdog"], cooking: ["fried_egg"], pot_of_food: ["stew"], bento_box: ["bento"], cooked_rice: ["rice"], curry_rice: ["curry"], steaming_bowl: ["ramen"], roasted_sweet_potato: ["sweet_potato"], fish_cake_with_swirl: ["fish_cake"], soft_ice_cream: ["icecream"], birthday_cake: ["birthday"], shortcake: ["cake"], glass_of_milk: ["milk_glass"], hot_beverage: ["coffee"], teacup_without_handle: ["tea"], bottle_with_popping_cork: ["champagne"], cocktail_glass: ["cocktail"], beer_mug: ["beer"], clinking_beer_mugs: ["beers"], mate: ["maté"], ice: ["ice_cube"], shushing_face: ["sushing_face"], fork_and_knife_with_plate: ["fork_knife_plate", "plate_with_cutlery"], kitchen_knife: ["hocho", "knife"], globe_showing_europe_africa: ["earth_africa"], globe_showing_americas: ["earth_americas"], globe_showing_asia_australia: ["earth_asia"], snow_capped_mountain: ["mountain_snow"], beach_with_umbrella: ["beach_umbrella", "parasol_on_ground", "beach"], office_building: ["office"], post_office: ["european_post_office"], castle: ["european_castle"], sunset: ["city_sunrise"], hot_springs: ["hotsprings"], barber_pole: ["barber"], locomotive: ["steam_locomotive"], high_speed_train: ["bullettrain_side"], bullet_train: ["bullettrain_front"], train: ["train2"], automobile: ["red_car", "car"], sport_utility_vehicle: ["blue_car"], delivery_truck: ["truck"], bicycle: ["bike"], bus_stop: ["busstop"], fuel_pump: ["fuelpump"], police_car_light: ["rotating_light"], horizontal_traffic_light: ["traffic_light"], airplane_departure: ["flight_departure"], airplane_arrival: ["flight_arrival", "airplane_arriving"], hourglass_done: ["hourglass"], hourglass_not_done: ["hourglass_flowing_sand"], twelve_o_clock: ["clock12"], twelve_thirty: ["clock1230"], one_o_clock: ["clock1"], one_thirty: ["clock130"], two_o_clock: ["clock2"], two_thirty: ["clock230"], three_o_clock: ["clock3"], three_thirty: ["clock330"], four_o_clock: ["clock4"], four_thirty: ["clock430"], five_o_clock: ["clock5"], five_thirty: ["clock530"], six_o_clock: ["clock6"], six_thirty: ["clock630"], seven_o_clock: ["clock7"], seven_thirty: ["clock730"], eight_o_clock: ["clock8"], eight_thirty: ["clock830"], nine_o_clock: ["clock9"], nine_thirty: ["clock930"], ten_o_clock: ["clock10"], ten_thirty: ["clock1030"], eleven_o_clock: ["clock11"], eleven_thirty: ["clock1130"], new_moon_face: ["new_moon_with_face"], first_quarter_moon_face: ["first_quarter_moon_with_face"], last_quarter_moon_face: ["last_quarter_moon_with_face"], sun: ["sunny"], full_moon_face: ["full_moon_with_face"], ringed_planet: ["ringer_planet"], glowing_star: ["star2"], shooting_star: ["stars"], high_voltage: ["zap"], snowman: ["snowman_with_snow"], snowman_without_snow: ["snowman2"], ocean: ["water_wave"], party_popper: ["tada"], pine_decoration: ["bamboo"], japanese_dolls: ["dolls"], carp_streamer: ["flags"], moon_viewing_ceremony: ["rice_scene"], red_envelope: ["red_gift_envelope"], wrapped_gift: ["gift"], admission_tickets: ["tickets"], soccer_ball: ["soccer"], american_football: ["football"], in_hole: ["golf"], fishing_pole: ["fishing_pole_and_fish"], running_shirt: ["running_shirt_with_sash"], skis: ["ski"], bullseye: ["dart"], yoyo: ["yo_yo", "yo-yo"], water_pistol: ["gun"], pool_8_ball: ["8ball"], puzzle_piece: ["jigsaw"], spade_suit: ["spades"], heart_suit: ["hearts"], diamond_suit: ["diamonds"], club_suit: ["clubs"], joker: ["black_joker"], mahjong_red_dragon: ["mahjong"], artist_palette: ["art"], glasses: ["eyeglasses"], sunglasses: ["dark_sunglasses"], t_shirt: ["tshirt", "shirt"], woman_s_clothes: ["womans_clothes"], clutch_bag: ["pouch"], shopping_bags: ["shopping"], backpack: ["school_satchel"], man_s_shoe: ["mans_shoe"], running_shoe: ["athletic_shoe"], high_heeled_shoe: ["high_heel"], woman_s_sandal: ["sandal"], woman_s_boot: ["boot"], woman_s_hat: ["womans_hat"], top_hat: ["tophat"], graduation_cap: ["mortar_board"], rescue_worker_s_helmet: ["rescue_worker_helmet", "helmet_with_cross", "helmet_with_white_cross",], gem_stone: ["gem"], muted_speaker: ["mute"], speaker_low_volume: ["speaker"], speaker_medium_volume: ["sound"], speaker_high_volume: ["loud_sound"], megaphone: ["mega"], bell_with_slash: ["no_bell"], musical_notes: ["notes"], headphone: ["headphones"], mobile_phone: ["iphone"], mobile_phone_with_arrow: ["calling"], telephone: ["phone"], fax_machine: ["fax"], laptop: ["computer"], computer_disk: ["minidisc"], optical_disk: ["cd"], film_frames: ["film_strip"], clapper_board: ["clapper"], television: ["tv"], camera_with_flash: ["camera_flash"], videocassette: ["vhs"], magnifying_glass_tilted_left: ["mag"], magnifying_glass_tilted_right: ["mag_right"], light_bulb: ["bulb"], red_paper_lantern: ["izakaya_lantern"], rolled_up_newspaper: ["newspaper_roll", "newspaper2"], money_bag: ["moneybag"], yen_banknote: ["yen"], dollar_banknote: ["dollar"], euro_banknote: ["euro"], pound_banknote: ["pound"], chart_increasing_with_yen: ["chart"], closed_mailbox_with_raised_flag: ["mailbox"], closed_mailbox_with_lowered_flag: ["mailbox_closed"], open_mailbox_with_raised_flag: ["mailbox_with_mail"], open_mailbox_with_lowered_flag: ["mailbox_with_no_mail"], ballot_box_with_ballot: ["ballot_box"], pencil: ["pencil2"], date: ["calendar"], tear_off_calendar: ["calendar"], chart_increasing: ["chart_with_upwards_trend"], chart_decreasing: ["chart_with_downwards_trend"], linked_paperclips: ["paperclips"], locked: ["lock"], unlocked: ["unlock"], locked_with_pen: ["lock_with_ink_pen"], locked_with_key: ["closed_lock_with_key"], white_cane: ["probing_cane"], roll_of_paper: ["roll_of_toilet_paper"], cigarette: ["smoking"], moai: ["moyai"], atm_sign: ["atm"], litter_in_bin_sign: ["put_litter_in_its_place"], wheelchair_symbol: ["wheelchair"], men_s_room: ["mens"], women_s_room: ["womens"], water_closet: ["wc"], prohibited: ["no_entry_sign"], no_littering: ["do_not_litter"], non_potable_water: ["non-potable_water"], no_one_under_eighteen: ["underage"], up_arrow: ["arrow_up"], up_right_arrow: ["arrow_upper_right"], right_arrow: ["arrow_right"], down_right_arrow: ["arrow_lower_right"], down_arrow: ["arrow_down"], down_left_arrow: ["arrow_lower_left"], left_arrow: ["arrow_left"], up_left_arrow: ["arrow_upper_left"], up_down_arrow: ["arrow_up_down"], right_arrow_curving_left: ["leftwards_arrow_with_hook"], left_arrow_curving_right: ["arrow_right_hook"], right_arrow_curving_up: ["arrow_heading_up"], right_arrow_curving_down: ["arrow_heading_down"], clockwise_vertical_arrows: ["arrows_clockwise"], counterclockwise_arrows_button: ["arrows_counterclockwise"], back_arrow: ["back"], end_arrow: ["end"], on_arrow: ["on"], soon_arrow: ["soon"], top_arrow: ["top"], dotted_six_pointed_star: ["six_pointed_star"], scorpio: ["scorpius"], shuffle_tracks_button: ["twisted_rightwards_arrows"], repeat_button: ["repeat"], repeat_single_button: ["repeat_one"], play_button: ["arrow_forward"], fast_forward_button: ["fast_forward"], reverse_button: ["arrow_backward"], fast_reverse_button: ["rewind"], last_track_button: ["previous_track_button", "track_previous", "previous_track",], upwards_button: ["arrow_up_small"], fast_up_button: ["arrow_double_up"], downwards_button: ["arrow_down_small"], fast_down_button: ["arrow_double_down"], dim_button: ["low_brightness"], bright_button: ["high_brightness"], antenna_bars: ["signal_strength"], multiply: ["heavy_multiplication_x"], plus: ["heavy_plus_sign"], minus: ["heavy_minus_sign"], divide: ["heavy_division_sign"], double_exclamation_mark: ["bangbang"], exclamation_question_mark: ["interrobang"], red_question_mark: ["question"], white_question_mark: ["grey_question"], white_exclamation_mark: ["grey_exclamation"], red_exclamation_mark: ["exclamation"], recycling_symbol: ["recycle"], trident_emblem: ["trident"], japanese_symbol_for_beginner: ["beginner"], hollow_red_circle: ["o"], white_check_mark: ["check_mark_button"], check_box_with_check: ["ballot_box_with_check"], check_mark: ["heavy_check_mark"], cross_mark: ["x"], cross_mark_button: ["negative_squared_cross_mark"], double_curly_loop: ["loop"], eight_pointed_star: ["eight_pointed_black_star"], trade_mark: ["tm"], hash: ["keycap_hash", "keycap_#"], asterisk: ["keycap_asterisk", "keycap_*", "keycap_star"], zero: ["keycap_0"], one: ["keycap_1"], two: ["keycap_2"], three: ["keycap_3"], four: ["keycap_4"], five: ["keycap_5"], six: ["keycap_6"], seven: ["keycap_7"], eight: ["keycap_8"], nine: ["keycap_9"], ten: ["keycap_10", "keycap_ten"], input_latin_uppercase: ["capital_abcd"], input_latin_lowercase: ["abcd"], 1234: ["input_numbers"], input_symbols: ["symbols"], input_latin_letters: ["abc"], a_button_blood_type: ["a"], ab_button_blood_type: ["ab"], b_button_blood_type: ["b"], cl_button: ["cl"], cool_button: ["cool"], free_button: ["free"], information_source: ["information"], id_button: ["id"], circled_m: ["m"], new_button: ["new"], ng_button: ["ng"], o_button_blood_type: ["o2"], ok_button: ["ok"], p_button: ["parking"], sos_button: ["sos"], up_button: ["up"], vs_button: ["vs"], japanese_vacancy_button: ["u7a7a"], japanese_discount_button: ["u5272"], japanese_here_button: ["koko"], japanese_not_free_of_charge_button: ["sa", "u6709", "japanese_service_charge_button",], japanese_application_button: ["u7533"], japanese_bargain_button: ["ideograph_advantage"], japanese_prohibited_button: ["u7981"], japanese_acceptable_button: ["accept", "u6709"], japanese_congratulations_button: ["congratulations"], japanese_secret_button: ["secret"], japanese_open_for_business_button: ["u55b6"], japanese_monthly_amount_button: ["u6708"], japanese_passing_grade_button: ["u5408"], japanese_no_vacancy_button: ["u6e80"], japanese_free_of_charge_button: ["u7121"], japanese_reserved_button: ["u6307"], blue_circle: ["large_blue_circle"], red_triangle_pointed_up: ["small_red_triangle"], red_triangle_pointed_down: ["small_red_triangle_down"], diamond_with_a_dot: ["diamond_shape_with_a_dot_inside"], chequered_flag: ["checkered_flag"], triangular_flag: ["triangular_flag_on_post"], åland_islands: ["aland_islands"], cocos_keeling_islands: ["cocos_islands"], cote_d_ivoire: ["cote_divoire"], china: ["cn", "flag_cn"], curaçao: ["curacao"], czechia: ["czech_republic"], germany: ["de", "flag_de"], ceuta_melilla: ["ceuta_and_melilla"], spain: ["es", "flag_es"], european_union: ["eu"], france: ["fr", "flag_fr"], hong_kong_sar_china: ["hong_kong"], heard_mcdonald_islands: ["heard_and_mc_donald_islands"], italy: ["it", "flag_it"], japan: ["jp", "flag_jp"], south_korea: ["kr", "flag_kr"], north_macedonia: ["macedonia"], myanmar_burma: ["myanmar"], macao_sar_china: ["macau"], russia: ["ru", "flag_ru"], svalbard_jan_mayen: ["svalbard_and_jan_mayen"], eswatini: ["swaziland"], turkiye: ["tr"], united_states: ["us", "flag_us"], united_kingdom: ["uk", "gb", "flag_gb"], };
			let resolvedEmojiName = Object.keys(emojiAliases).find((key) =>
				emojiAliases[key].includes(emojiName)
			) || emojiName;
			return Object.keys(emojiReplacements).find(
				(key) => emojiReplacements[key] === resolvedEmojiName
			);
		},
		isMeaninglessReply(content) {
			let cleanContent = content.replace(/\s+/g, '').trim().toLowerCase();

			if (meaninglessCache.has(cleanContent)) {
				return meaninglessCache.get(cleanContent);
			}

			let patterns = [
				// 基础表情和重复字符
				/^[。.…～~]+$/, // 省略号
				/^.*[哈嘿呵h]{2,}$/i, // 笑声
				/^.*[666６]{2,}$/, // 666
				/^.{1,8}[？?!！.。]{2,}$/, // 连续的标点符号
				/^.*[:：][+＋]1[:：]$/, // :+1:
				/^.*(\s*:[\w-]+:\s*){1,}$/, // 纯表情符号
				// 单字重复
				/^.{1,8}(.)\1{1,}$/, // 任何字符重复
				// 感谢类 感谢@hanhai贡献补充规则
				/^[^谢蟹感]*[谢蟹感]谢?(你|您|分享|大佬|楼主|老铁|老哥|佬友?|大神|博主)?[，,\.！!~～。]*[^，,\.！!~～。]*$/i,
				/^.*感恩|感动|感激[！!~～。.]*$/,
				/^.*(thank|thanks|thx|tks)[！!~～。.]*$/i,
				// 支持类 感谢@hanhai贡献补充规则
				/.*期待.*/i,
				/^.*(支持|顶|赞|好评|mark占?位?|收藏|马克|签到|打卡|学习|关注|收藏了|路过|前来|学习了)[！!~～。.]*$/i,
				/^.*(\+1|1\+|加1|[➕＋]1)[！!~～。.]*$/,
				/^.*先赞后看[！!~～。.]*$/,
				/^.*已阅[！!~～。.]*$/,
				/^.*非常好用[！!~～。.]*$/,
				/^.*好用[，,]?爱用[！!~～。.]*$/,
				/^.*爱用[，,]?喜欢[！!~～。.]*$/,
				/^.*火钳威武[！!~～。.]*$/,
				// 称赞类
				/^.*(好|棒|强|厉害|可以|不错|牛|帅|赞|妙|秒|绝|狠|太强|很强|太棒|很棒|牛逼|nb|可以的)[！!~～。.]*$/i,
				/^.*(nice|good|perfect|awesome|ok+)[！!~～。.]*$/i,
				/\b(?:牛|n)[bB]{1,}(?:[呀啊哇]|plus)?\b/i, // 牛b，nbbb，牛逼plus等
				/^.*牛啊?皇[！!~～。.]*$/,
				// 楼层相关
				/^.*[第前后大小]?[1-9一二三四五六七八九十百千]{1,}[楼层名]?[！!~～。.]*$/,
				/^.*(前排|沙发|板凳|地板)[！!~～。.]*$/,
				/^.*[大小]?后排[！!~～。.]*$/,
				/^.*排队[！!~～。.]*$/,
				/^.*[前后][排队][！!~～。.]*$/,
				// 佬相关
				/^.*(佬|大佬|巨佬|巨巨|大神)[！!~～。.]*$/,
				/^.*佬(的)?分享[！!~～。.]*$/,
				/^.*始皇(大佬|陛下|老师|[vV][1-9])?[！!~～。.]*$/,
				/^.*吾皇[万岁]{2,}$/,
				/^.*伟大[～~]*[，,]?无需多[盐言][！!~～。.]*$/,
				// 其他常见短语
				/^.*(顶上去|顶上来|顶一下|帮顶|支持[一二两三四五六七八九十百千]下|学习了|学到了|受益了|get|学习打卡)[！!~～。.]*$/i,
				/^.*(看看|路过|潜水|冒泡|打卡|签到|留念|留名)[！!~～。.]*$/,
				/^.*[1-9一二三四五六七八九十]\s*[份分]到手[！!~～。.]*$/,
				/^.*别说话[！!~～。.]*$/,
				/^.*前排[！!~～。.]*爽[～~]*$/,
				/^.*前排[！!~～。.]*始皇[牛nb逼]{1,}[！!~～。.]*（破音）$/,
				/^.*前排[，,]?[\s\S]*?(瓜子|花生|八宝粥).*$/i,
				// 表情符号组合
				/^.*(:[+＋]1:\s*){1,}$/, // 连续的 :+1: 表情
				/^.*[:：][^\s]{1,10}[:：](\s*[:：][^\s]{1,10}[:：])*$/, // 任意表情符号组合
			];

			let matchedPattern = patterns.find(pattern => {
				if (pattern instanceof RegExp) {
					return pattern.test(cleanContent);
				} else {
					return cleanContent.includes(pattern.toLowerCase());
				}
			});

			let isMeaningless = !!matchedPattern || cleanContent.length <= 15;
			if (isMeaningless === true) {
				console.log(cleanContent, "\n:匹配:\n", matchedPattern ? matchedPattern : "文本长度少于等于 15")
			}
			meaninglessCache.set(cleanContent, isMeaningless);

			return isMeaningless;
		},
		formatDate(isoString) {
			let date = new Date(isoString);
			let fYear = date.getFullYear();
			let fMouth = String(date.getMonth() + 1).padStart(2, "0");
			let fDay = String(date.getDate()).padStart(2, "0");

			let hours = date.getHours();
			let isPM = hours >= 12;
			hours = hours % 12 || 12;

			let fHours = String(hours).padStart(2, "0");
			let fMinutes = String(date.getMinutes()).padStart(2, "0");
			let fSeconds = String(date.getSeconds()).padStart(2, "0");
			let period = isPM ? "下午" : "上午";
			return `${fYear}/${fMouth}/${fDay} ${period} ${fHours}:${fMinutes}:${fSeconds}`;
		},
		formatTimestamp(dateString) {
			if (typeof dateString !== 'string') {
				return null;
			}
			let cDateString = dateString.replace(/\s+/g, '').trim();
			let dateMatch = cDateString.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日(\d{2}):(\d{2})$/);
			if (!dateMatch) {
				return null;
			}
			try {
				let [_, year, month, day, hours, minutes] = dateMatch.map(Number);
				let date = new Date(year, month - 1, day, hours, minutes);
				if (isNaN(date.getTime())) {
					return null;
				}
				return date.getTime();
			} catch (error) {
				return null;
			}
		},
		createFloatingButton(config) {
			let { id, title, icon, onClick, onStart, onCheck, buttons } = config;
			if (!id || !title || !icon) return;
			let button = $(`
				<div id="${id}" data-title="${title}" class="floating-button" style="display: none;">
					<svg><use xlink:href="#${icon}"/></svg>
				</div>
			`);
			if (typeof onStart === "function") {
				onStart({ id, title, icon, button });
			}
			if (typeof onClick === "function") {
				button.on("click", (event) => {
					onClick({ event, button });
				});
			}
			if (typeof onCheck === "function") {
				let observer = new MutationObserver(() => {
					if (onCheck()) {
						button.fadeIn();
					} else {
						button.fadeOut();
					}
				});
				observer.observe(document.body, { childList: true, subtree: true });
				$(window).on('scroll', () => {
					if (onCheck()) {
						button.fadeIn();
					} else {
						button.fadeOut();
					}
				});
				if (onCheck()) {
					button.show();
				}
			} else {
				button.attr("style", "")
			}
			buttons.append(button);
		},
	}

	base.waitForKeyElements(`head:not(:has(${mount}))`, (element) => {
		element.append(`<${mount} class="${mount}" />`)
	}, true)
	base.waitForKeyElements(`html:not(:has(> ${mount})) body`, (element) => {
		element.after(`<${mount} class="${mount}" />`)
	}, true)

	// 功能函数
	let discourse = {
		addMenu() {
			base.waitForKeyElements(`html > .${mount}`, (element) => {
				if ($("#discourseHelper").length > 0) return;
				let nav = $(`<div id="discourseHelper-Nav"></div>`)
				element.append(nav);

				base.createFloatingButton({
					id: 'backToTop',
					title: '回到顶部',
					icon: 'arrow-up',
					buttons: nav,
					onClick: () => {
						$('html, body').animate({ scrollTop: 0 }, 500);
						base.showToast("回顶中...");
					},
					onCheck: () => {
						let scrollTop = $(window).scrollTop();
						if (scrollTop > 500) {
							return true
						} else {
							return false
						}
					}
				});

				base.createFloatingButton({
					id: 'createTopic',
					title: '新建话题',
					icon: 'far-pen-to-square',
					buttons: nav,
					onClick: () => $("#create-topic").click(),
					onCheck: () => $("#create-topic").length > 0
				});

				base.createFloatingButton({
					id: 'replyTopic',
					title: '回复话题',
					icon: 'reply',
					buttons: nav,
					onClick: () => $(".reply-to-post").click(),
					onCheck: () => {
						$(".reply-to-post").hide();
						return $(".reply-to-post").length > 0
					}
				});

				if (GM_getValue("filterByOP") === "true") {
					let styleElement = null;
					let isEnabled = false;
					base.createFloatingButton({
						id: 'filterByOP',
						title: '只看题主',
						icon: 'far-comments',
						buttons: nav,
						onClick: ({ button }) => {
							isEnabled = !isEnabled;
							button.find("use").attr("xlink:href", isEnabled ? "#far-comment" : "#far-comments");
							if (isEnabled && !styleElement) {
								styleElement = $(`<style>
									.post-stream .topic-post { display: none !important; }
									.post-stream .topic-post.topic-owner { display: block !important; }
								</style>`);
								$(`html > .${mount}`).append(styleElement);
								base.showToast("只看题主 - 开");
							} else if (!isEnabled && styleElement) {
								styleElement.remove();
								styleElement = null;
								base.showToast("只看题主 - 关");
							}
						},
						onCheck: () => $(".post-stream").length > 0 && $(".post-stream .topic-post").length > 0
					});
				}

				if (GM_getValue("filterBySelf") === "true") {
					let styleElement = null;
					let isEnabled = false;
					base.createFloatingButton({
						id: 'filterBySelf',
						title: '只看自己',
						icon: 'user-group',
						buttons: nav,
						onClick: ({ button }) => {
							isEnabled = !isEnabled;
							button.find("use").attr("xlink:href", isEnabled ? "#user" : "#user-group");
							if (isEnabled && !styleElement) {
								styleElement = $(`<style>
									.post-stream .topic-post:not(:first-of-type,:last-of-type) { display: none !important; }
									.post-stream .topic-post.current-user-post { display: block !important; }
								</style>`);
								$(`html > .${mount}`).append(styleElement);
								base.showToast("只看自己 - 开");
							} else if (!isEnabled && styleElement) {
								styleElement.remove();
								styleElement = null;
								base.showToast("只看自己 - 关");
							}
						},
						onCheck: () => $(".post-stream").length > 0 && $(".post-stream .topic-post").length > 0
					});
				}

				if (GM_getValue("autoReader") === "true" && GM_getValue("autoReaderWait") && GM_getValue("autoReaderSpeed") && Number(GM_getValue("autoReaderSpeed")) > 0) {
					let isEnabled = false;
					let startTime = null; // 记录进入底部区域的时间

					function autoScroll(button) {
						if (isEnabled) {
							window.scrollBy(0, Number(GM_getValue("autoReaderSpeed")));
							requestAnimationFrame(() => autoScroll(button));
							let scrollTop = $(window).scrollTop();
							let scrollHeight = $(document).height();
							let windowHeight = $(window).height();
							if (scrollTop + windowHeight >= scrollHeight - 100) {
								if (startTime === null) {
									startTime = Date.now();
								}
								if (Date.now() - startTime >= Number(GM_getValue("autoReaderWait")) * 1000) {
									isEnabled = false;
									startTime = null;
									button.find("use").attr("xlink:href", "#play");
								}
							} else {
								startTime = null;
							}
						}
					}

					base.createFloatingButton({
						id: 'autoReader',
						title: '自动滚动',
						icon: 'play',
						buttons: nav,
						onClick: ({ button }) => {
							isEnabled = !isEnabled;
							if (isEnabled) {
								startTime = null; // 重置开始时间
								autoScroll(button);
								button.find("use").attr("xlink:href", "#pause");
							} else {
								startTime = null;
								button.find("use").attr("xlink:href", "#play");
							}
						}
					});
				}

				base.createFloatingButton({
					id: 'helperSettings',
					title: '助手设置',
					icon: 'gear',
					buttons: nav,
					onClick: base.displaySettings,
				});
			}, true);
		},
		addStyle() {
			base.waitForKeyElements(`head > .${mount}`, (element) => {
				if (element.find("discourse-assets").length > 0) return;
				let isMobileView = localStorage.getItem('mobileView') === 'true';
				let deviceSpecificStyle = isMobileView
					? `<link href="https://cdn.linux.do/stylesheets/mobile_b8ce3b74daedf2d600ac3f428905f1cb54848269.css" media="all" rel="stylesheet" data-target="mobile" />`
					: `<link href="https://cdn.linux.do/stylesheets/desktop_b8ce3b74daedf2d600ac3f428905f1cb54848269.css" media="all" rel="stylesheet" data-target="desktop" />`;

				element.append(`<discourse-assets>
					<discourse-assets-icons><div id="svg-sprites"><div class="fontawesome"><!-- Discourse SVG subset of Font Awesome Free by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)--><svg xmlns="http://www.w3.org/2000/svg"style="display: none;"><symbol id="a"viewBox="0 0 384 512"><path d="M221.5 51.7C216.6 39.8 204.9 32 192 32s-24.6 7.8-29.5 19.7l-120 288-40 96c-6.8 16.3 .9 35 17.2 41.8s35-.9 41.8-17.2L93.3 384l197.3 0 31.8 76.3c6.8 16.3 25.5 24 41.8 17.2s24-25.5 17.2-41.8l-40-96-120-288zM264 320l-144 0 72-172.8L264 320z"></path></symbol><symbol id="address-book"viewBox="0 0 512 512"><path d="M96 0C60.7 0 32 28.7 32 64l0 384c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L96 0zM208 288l64 0c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64zM496 192c-8.8 0-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64z"></path></symbol><symbol id="align-left"viewBox="0 0 448 512"><path d="M288 64c0 17.7-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l224 0c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32L32 352c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 224c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"></path></symbol><symbol id="anchor"viewBox="0 0 576 512"><path d="M320 96a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm21.1 80C367 158.8 384 129.4 384 96c0-53-43-96-96-96s-96 43-96 96c0 33.4 17 62.8 42.9 80L224 176c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 0 208-48 0c-53 0-96-43-96-96l0-6.1 7 7c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L97 263c-9.4-9.4-24.6-9.4-33.9 0L7 319c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l7-7 0 6.1c0 88.4 71.6 160 160 160l80 0 80 0c88.4 0 160-71.6 160-160l0-6.1 7 7c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-56-56c-9.4-9.4-24.6-9.4-33.9 0l-56 56c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l7-7 0 6.1c0 53-43 96-96 96l-48 0 0-208 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-10.9 0z"></path></symbol><symbol id="angle-down"viewBox="0 0 448 512"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path></symbol><symbol id="angle-left"viewBox="0 0 320 512"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"></path></symbol><symbol id="angle-right"viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path></symbol><symbol id="angle-up"viewBox="0 0 448 512"><path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"></path></symbol><symbol id="angles-down"viewBox="0 0 448 512"><path d="M246.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 402.7 361.4 265.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-160 160zm160-352l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 210.7 361.4 73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3z"></path></symbol><symbol id="angles-left"viewBox="0 0 512 512"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"></path></symbol><symbol id="angles-right"viewBox="0 0 512 512"><path d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"></path></symbol><symbol id="angles-up"viewBox="0 0 448 512"><path d="M246.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L224 109.3 361.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160zm160 352l-160-160c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L224 301.3 361.4 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3z"></path></symbol><symbol id="arrow-down"viewBox="0 0 384 512"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path></symbol><symbol id="arrow-down-1-9"viewBox="0 0 576 512"><path d="M450.7 38c-8.3-6-19.1-7.7-28.8-4.4l-48 16c-16.8 5.6-25.8 23.7-20.2 40.5s23.7 25.8 40.5 20.2l5.9-2 0 51.6-16 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l48 0 48 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-16 0 0-96c0-10.3-4.9-19.9-13.3-26zM160 480c9 0 17.5-3.8 23.6-10.4l88-96c11.9-13 11.1-33.3-2-45.2s-33.3-11.1-45.2 2L192 365.7 192 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 301.7L95.6 330.4c-11.9-13-32.2-13.9-45.2-2s-13.9 32.2-2 45.2l88 96C142.5 476.2 151 480 160 480zM418.3 307a32 32 0 1 1 27.4 57.9A32 32 0 1 1 418.3 307zM405.1 419.8l-6.8 9.2c-10.5 14.2-7.5 34.2 6.7 44.8s34.2 7.5 44.8-6.7l48.8-65.8c14-18.9 21.5-41.7 21.5-65.2c0-48.6-39.4-88-88-88s-88 39.4-88 88c0 39.2 25.6 72.4 61.1 83.8z"></path></symbol><symbol id="arrow-down-a-z"viewBox="0 0 576 512"><path d="M183.6 469.6C177.5 476.2 169 480 160 480s-17.5-3.8-23.6-10.4l-88-96c-11.9-13-11.1-33.3 2-45.2s33.3-11.1 45.2 2L128 365.7 128 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 301.7 32.4-35.4c11.9-13 32.2-13.9 45.2-2s13.9 32.2 2 45.2l-88 96zM320 320c0-17.7 14.3-32 32-32l128 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9L429.3 416l50.7 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-128 0c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9L402.7 352 352 352c-17.7 0-32-14.3-32-32zM416 32c12.1 0 23.2 6.8 28.6 17.7l64 128 16 32c7.9 15.8 1.5 35-14.3 42.9s-35 1.5-42.9-14.3L460.2 224l-88.4 0-7.2 14.3c-7.9 15.8-27.1 22.2-42.9 14.3s-22.2-27.1-14.3-42.9l16-32 64-128C392.8 38.8 403.9 32 416 32zM395.8 176l40.4 0L416 135.6 395.8 176z"></path></symbol><symbol id="arrow-left"viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"></path></symbol><symbol id="arrow-pointer"viewBox="0 0 320 512"><path d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"></path></symbol><symbol id="arrow-right"viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path></symbol><symbol id="arrow-rotate-left"viewBox="0 0 512 512"><path d="M125.7 160l50.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L48 224c-17.7 0-32-14.3-32-32L16 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z"></path></symbol><symbol id="arrow-rotate-right"viewBox="0 0 512 512"><path d="M386.3 160L336 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"></path></symbol><symbol id="arrow-up"viewBox="0 0 384 512"><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path></symbol><symbol id="arrow-up-1-9"viewBox="0 0 576 512"><path d="M450.7 38c8.3 6 13.3 15.7 13.3 26l0 96 16 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-48 0-48 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l16 0 0-51.6-5.9 2c-16.8 5.6-34.9-3.5-40.5-20.2s3.5-34.9 20.2-40.5l48-16c9.8-3.3 20.5-1.6 28.8 4.4zM160 32c9 0 17.5 3.8 23.6 10.4l88 96c11.9 13 11.1 33.3-2 45.2s-33.3 11.1-45.2-2L192 146.3 192 448c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-301.7L95.6 181.6c-11.9 13-32.2 13.9-45.2 2s-13.9-32.2-2-45.2l88-96C142.5 35.8 151 32 160 32zM445.7 364.9A32 32 0 1 0 418.3 307a32 32 0 1 0 27.4 57.9zm-40.7 54.9C369.6 408.4 344 375.2 344 336c0-48.6 39.4-88 88-88s88 39.4 88 88c0 23.5-7.5 46.3-21.5 65.2L449.7 467c-10.5 14.2-30.6 17.2-44.8 6.7s-17.2-30.6-6.7-44.8l6.8-9.2z"></path></symbol><symbol id="arrow-up-a-z"viewBox="0 0 576 512"><path d="M183.6 42.4C177.5 35.8 169 32 160 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L128 146.3 128 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-301.7 32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 320c0 17.7 14.3 32 32 32l50.7 0-73.4 73.4c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l128 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-50.7 0 73.4-73.4c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8l-128 0c-17.7 0-32 14.3-32 32zM416 32c-12.1 0-23.2 6.8-28.6 17.7l-64 128-16 32c-7.9 15.8-1.5 35 14.3 42.9s35 1.5 42.9-14.3l7.2-14.3 88.4 0 7.2 14.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9l-16-32-64-128C439.2 38.8 428.1 32 416 32zM395.8 176L416 135.6 436.2 176l-40.4 0z"></path></symbol><symbol id="arrows-rotate"viewBox="0 0 512 512"><path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"></path></symbol><symbol id="asterisk"viewBox="0 0 384 512"><path d="M192 32c17.7 0 32 14.3 32 32l0 135.5 111.5-66.9c15.2-9.1 34.8-4.2 43.9 11s4.2 34.8-11 43.9L254.2 256l114.3 68.6c15.2 9.1 20.1 28.7 11 43.9s-28.7 20.1-43.9 11L224 312.5 224 448c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-135.5L48.5 379.4c-15.2 9.1-34.8 4.2-43.9-11s-4.2-34.8 11-43.9L129.8 256 15.5 187.4c-15.2-9.1-20.1-28.7-11-43.9s28.7-20.1 43.9-11L160 199.5 160 64c0-17.7 14.3-32 32-32z"></path></symbol><symbol id="at"viewBox="0 0 512 512"><path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256l0 32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32l0 80 0 32c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"></path></symbol><symbol id="award"viewBox="0 0 384 512"><path d="M173.8 5.5c11-7.3 25.4-7.3 36.4 0L228 17.2c6 3.9 13 5.8 20.1 5.4l21.3-1.3c13.2-.8 25.6 6.4 31.5 18.2l9.6 19.1c3.2 6.4 8.4 11.5 14.7 14.7L344.5 83c11.8 5.9 19 18.3 18.2 31.5l-1.3 21.3c-.4 7.1 1.5 14.2 5.4 20.1l11.8 17.8c7.3 11 7.3 25.4 0 36.4L366.8 228c-3.9 6-5.8 13-5.4 20.1l1.3 21.3c.8 13.2-6.4 25.6-18.2 31.5l-19.1 9.6c-6.4 3.2-11.5 8.4-14.7 14.7L301 344.5c-5.9 11.8-18.3 19-31.5 18.2l-21.3-1.3c-7.1-.4-14.2 1.5-20.1 5.4l-17.8 11.8c-11 7.3-25.4 7.3-36.4 0L156 366.8c-6-3.9-13-5.8-20.1-5.4l-21.3 1.3c-13.2 .8-25.6-6.4-31.5-18.2l-9.6-19.1c-3.2-6.4-8.4-11.5-14.7-14.7L39.5 301c-11.8-5.9-19-18.3-18.2-31.5l1.3-21.3c.4-7.1-1.5-14.2-5.4-20.1L5.5 210.2c-7.3-11-7.3-25.4 0-36.4L17.2 156c3.9-6 5.8-13 5.4-20.1l-1.3-21.3c-.8-13.2 6.4-25.6 18.2-31.5l19.1-9.6C65 70.2 70.2 65 73.4 58.6L83 39.5c5.9-11.8 18.3-19 31.5-18.2l21.3 1.3c7.1 .4 14.2-1.5 20.1-5.4L173.8 5.5zM272 192a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM1.3 441.8L44.4 339.3c.2 .1 .3 .2 .4 .4l9.6 19.1c11.7 23.2 36 37.3 62 35.8l21.3-1.3c.2 0 .5 0 .7 .2l17.8 11.8c5.1 3.3 10.5 5.9 16.1 7.7l-37.6 89.3c-2.3 5.5-7.4 9.2-13.3 9.7s-11.6-2.2-14.8-7.2L74.4 455.5l-56.1 8.3c-5.7 .8-11.4-1.5-15-6s-4.3-10.7-2.1-16zm248 60.4L211.7 413c5.6-1.8 11-4.3 16.1-7.7l17.8-11.8c.2-.1 .4-.2 .7-.2l21.3 1.3c26 1.5 50.3-12.6 62-35.8l9.6-19.1c.1-.2 .2-.3 .4-.4l43.2 102.5c2.2 5.3 1.4 11.4-2.1 16s-9.3 6.9-15 6l-56.1-8.3-32.2 49.2c-3.2 5-8.9 7.7-14.8 7.2s-11-4.3-13.3-9.7z"></path></symbol><symbol id="baby"viewBox="0 0 448 512"><path d="M152 88a72 72 0 1 1 144 0A72 72 0 1 1 152 88zM39.7 144.5c13-17.9 38-21.8 55.9-8.8L131.8 162c26.8 19.5 59.1 30 92.2 30s65.4-10.5 92.2-30l36.2-26.4c17.9-13 42.9-9 55.9 8.8s9 42.9-8.8 55.9l-36.2 26.4c-13.6 9.9-28.1 18.2-43.3 25l0 36.3-192 0 0-36.3c-15.2-6.7-29.7-15.1-43.3-25L48.5 200.3c-17.9-13-21.8-38-8.8-55.9zm89.8 184.8l60.6 53-26 37.2 24.3 24.3c15.6 15.6 15.6 40.9 0 56.6s-40.9 15.6-56.6 0l-48-48C70 438.6 68.1 417 79.2 401.1l50.2-71.8zm128.5 53l60.6-53 50.2 71.8c11.1 15.9 9.2 37.5-4.5 51.2l-48 48c-15.6 15.6-40.9 15.6-56.6 0s-15.6-40.9 0-56.6L284 419.4l-26-37.2z"></path></symbol><symbol id="backward"viewBox="0 0 512 512"><path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29l0-320c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3l0 41.7 0 41.7L459.5 440.6zM256 352l0-96 0-128 0-32c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29l0-64z"></path></symbol><symbol id="backward-fast"viewBox="0 0 512 512"><path d="M493.6 445c-11.2 5.3-24.5 3.6-34.1-4.4L288 297.7 288 416c0 12.4-7.2 23.7-18.4 29s-24.5 3.6-34.1-4.4L64 297.7 64 416c0 17.7-14.3 32-32 32s-32-14.3-32-32L0 96C0 78.3 14.3 64 32 64s32 14.3 32 32l0 118.3L235.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S288 83.6 288 96l0 118.3L459.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S512 83.6 512 96l0 320c0 12.4-7.2 23.7-18.4 29z"></path></symbol><symbol id="backward-step"viewBox="0 0 320 512"><path d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29l0-320c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241 64 96c0-17.7-14.3-32-32-32S0 78.3 0 96L0 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-145 11.5 9.6 192 160z"></path></symbol><symbol id="ban"viewBox="0 0 512 512"><path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"></path></symbol><symbol id="bars"viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"></path></symbol><symbol id="bars-staggered"viewBox="0 0 512 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L96 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"></path></symbol><symbol id="battery-quarter"viewBox="0 0 576 512"><path d="M464 160c8.8 0 16 7.2 16 16l0 160c0 8.8-7.2 16-16 16L80 352c-8.8 0-16-7.2-16-16l0-160c0-8.8 7.2-16 16-16l384 0zM80 96C35.8 96 0 131.8 0 176L0 336c0 44.2 35.8 80 80 80l384 0c44.2 0 80-35.8 80-80l0-16c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l0-16c0-44.2-35.8-80-80-80L80 96zm112 96l-96 0 0 128 96 0 0-128z"></path></symbol><symbol id="bed"viewBox="0 0 640 512"><path d="M32 32c17.7 0 32 14.3 32 32l0 256 224 0 0-160c0-17.7 14.3-32 32-32l224 0c53 0 96 43 96 96l0 224c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-32-224 0-32 0L64 416l0 32c0 17.7-14.3 32-32 32s-32-14.3-32-32L0 64C0 46.3 14.3 32 32 32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"></path></symbol><symbol id="bell"viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"></path></symbol><symbol id="bell-slash"viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-90.2-70.7c.2-.4 .4-.9 .6-1.3c5.2-11.5 3.1-25-5.3-34.4l-7.4-8.3C497.3 319.2 480 273.9 480 226.8l0-18.8c0-77.4-55-142-128-156.8L352 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 19.2c-42.6 8.6-79 34.2-102 69.3L38.8 5.1zM406.2 416L160 222.1l0 4.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S115.4 416 128 416l278.2 0zm-40.9 77.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"></path></symbol><symbol id="blog"viewBox="0 0 512 512"><path d="M192 32c0 17.7 14.3 32 32 32c123.7 0 224 100.3 224 224c0 17.7 14.3 32 32 32s32-14.3 32-32C512 128.9 383.1 0 224 0c-17.7 0-32 14.3-32 32zm0 96c0 17.7 14.3 32 32 32c70.7 0 128 57.3 128 128c0 17.7 14.3 32 32 32s32-14.3 32-32c0-106-86-192-192-192c-17.7 0-32 14.3-32 32zM96 144c0-26.5-21.5-48-48-48S0 117.5 0 144L0 368c0 79.5 64.5 144 144 144s144-64.5 144-144s-64.5-144-144-144l-16 0 0 96 16 0c26.5 0 48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48l0-224z"></path></symbol><symbol id="bold"viewBox="0 0 384 512"><path d="M0 64C0 46.3 14.3 32 32 32l48 0 16 0 128 0c70.7 0 128 57.3 128 128c0 31.3-11.3 60.1-30 82.3c37.1 22.4 62 63.1 62 109.7c0 70.7-57.3 128-128 128L96 480l-16 0-48 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l16 0 0-160L48 96 32 96C14.3 96 0 81.7 0 64zM224 224c35.3 0 64-28.7 64-64s-28.7-64-64-64L112 96l0 128 112 0zM112 288l0 128 144 0c35.3 0 64-28.7 64-64s-28.7-64-64-64l-32 0-112 0z"></path></symbol><symbol id="book"viewBox="0 0 448 512"><path d="M96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96l288 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64c17.7 0 32-14.3 32-32l0-320c0-17.7-14.3-32-32-32L384 0 96 0zm0 384l256 0 0 64L96 448c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16zm16 48l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"></path></symbol><symbol id="book-open-reader"viewBox="0 0 512 512"><path d="M160 96a96 96 0 1 1 192 0A96 96 0 1 1 160 96zm80 152l0 264-48.4-24.2c-20.9-10.4-43.5-17-66.8-19.3l-96-9.6C12.5 457.2 0 443.5 0 427L0 224c0-17.7 14.3-32 32-32l30.3 0c63.6 0 125.6 19.6 177.7 56zm32 264l0-264c52.1-36.4 114.1-56 177.7-56l30.3 0c17.7 0 32 14.3 32 32l0 203c0 16.4-12.5 30.2-28.8 31.8l-96 9.6c-23.2 2.3-45.9 8.9-66.8 19.3L272 512z"></path></symbol><symbol id="bookmark"viewBox="0 0 384 512"><path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"></path></symbol><symbol id="bookmark-delete"viewBox="0 0 16 20"><path id="icon-bookmark__main"d="M0 20V5.5C0 4.6875 0.65625 4 1.5 4H10.5C11.3125 4 12 4.6875 12 5.5V20L6 16.5L0 20Z"fill="var(--tertiary)"></path><circle id="icon-bookmark__delete-x"cx="11.5"cy="6.5"r="3.5"fill="var(--secondary)"></circle><path id="icon-bookmark__delete-bg"d="M11 1.40625C13.6758 1.40625 15.8438 3.57422 15.8438 6.25C15.8438 8.92578 13.6758 11.0938 11 11.0938C8.32422 11.0938 6.15625 8.92578 6.15625 6.25C6.15625 3.57422 8.32422 1.40625 11 1.40625ZM13.3633 7.53906L12.0938 6.25L13.3633 4.98047C13.4609 4.90234 13.4609 4.74609 13.3633 4.64844L12.6016 3.88672C12.5039 3.78906 12.3477 3.78906 12.2695 3.88672L11 5.15625L9.73047 3.88672C9.63281 3.78906 9.47656 3.78906 9.39844 3.88672L8.61719 4.64844C8.51953 4.74609 8.51953 4.90234 8.61719 4.98047L9.90625 6.25L8.61719 7.51953C8.51953 7.61719 8.51953 7.77344 8.61719 7.85156L9.37891 8.63281C9.47656 8.73047 9.63281 8.73047 9.71094 8.63281L11 7.34375L12.2695 8.63281C12.3477 8.73047 12.5039 8.73047 12.6016 8.63281L13.3633 7.87109C13.4609 7.77344 13.4609 7.61719 13.3633 7.53906Z"fill="var(--danger)"></path></symbol><symbol id="box-archive"viewBox="0 0 512 512"><path d="M32 32l448 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96L0 64C0 46.3 14.3 32 32 32zm0 128l448 0 0 256c0 35.3-28.7 64-64 64L96 480c-35.3 0-64-28.7-64-64l0-256zm128 80c0 8.8 7.2 16 16 16l160 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-160 0c-8.8 0-16 7.2-16 16z"></path></symbol><symbol id="brain"viewBox="0 0 512 512"><path d="M184 0c30.9 0 56 25.1 56 56l0 400c0 30.9-25.1 56-56 56c-28.9 0-52.7-21.9-55.7-50.1c-5.2 1.4-10.7 2.1-16.3 2.1c-35.3 0-64-28.7-64-64c0-7.4 1.3-14.6 3.6-21.2C21.4 367.4 0 338.2 0 304c0-31.9 18.7-59.5 45.8-72.3C37.1 220.8 32 207 32 192c0-30.7 21.6-56.3 50.4-62.6C80.8 123.9 80 118 80 112c0-29.9 20.6-55.1 48.3-62.1C131.3 21.9 155.1 0 184 0zM328 0c28.9 0 52.6 21.9 55.7 49.9c27.8 7 48.3 32.1 48.3 62.1c0 6-.8 11.9-2.4 17.4c28.8 6.2 50.4 31.9 50.4 62.6c0 15-5.1 28.8-13.8 39.7C493.3 244.5 512 272.1 512 304c0 34.2-21.4 63.4-51.6 74.8c2.3 6.6 3.6 13.8 3.6 21.2c0 35.3-28.7 64-64 64c-5.6 0-11.1-.7-16.3-2.1c-3 28.2-26.8 50.1-55.7 50.1c-30.9 0-56-25.1-56-56l0-400c0-30.9 25.1-56 56-56z"></path></symbol><symbol id="briefcase"viewBox="0 0 512 512"><path d="M184 48l144 0c4.4 0 8 3.6 8 8l0 40L176 96l0-40c0-4.4 3.6-8 8-8zm-56 8l0 40L64 96C28.7 96 0 124.7 0 160l0 96 192 0 128 0 192 0 0-96c0-35.3-28.7-64-64-64l-64 0 0-40c0-30.9-25.1-56-56-56L184 0c-30.9 0-56 25.1-56 56zM512 288l-192 0 0 32c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-32L0 288 0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-128z"></path></symbol><symbol id="bug"viewBox="0 0 512 512"><path d="M256 0c53 0 96 43 96 96l0 3.6c0 15.7-12.7 28.4-28.4 28.4l-135.1 0c-15.7 0-28.4-12.7-28.4-28.4l0-3.6c0-53 43-96 96-96zM41.4 105.4c12.5-12.5 32.8-12.5 45.3 0l64 64c.7 .7 1.3 1.4 1.9 2.1c14.2-7.3 30.4-11.4 47.5-11.4l112 0c17.1 0 33.2 4.1 47.5 11.4c.6-.7 1.2-1.4 1.9-2.1l64-64c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-64 64c-.7 .7-1.4 1.3-2.1 1.9c6.2 12 10.1 25.3 11.1 39.5l64.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c0 24.6-5.5 47.8-15.4 68.6c2.2 1.3 4.2 2.9 6 4.8l64 64c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-63.1-63.1c-24.5 21.8-55.8 36.2-90.3 39.6L272 240c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 239.2c-34.5-3.4-65.8-17.8-90.3-39.6L86.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l64-64c1.9-1.9 3.9-3.4 6-4.8C101.5 367.8 96 344.6 96 320l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64.3 0c1.1-14.1 5-27.5 11.1-39.5c-.7-.6-1.4-1.2-2.1-1.9l-64-64c-12.5-12.5-12.5-32.8 0-45.3z"></path></symbol><symbol id="bullhorn"viewBox="0 0 512 512"><path d="M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75l-8.7 0-32 0-96 0c-35.3 0-64 28.7-64 64l0 96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-128 8.7 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-147.6c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4L480 32zm-64 76.7L416 240l0 131.3C357.2 317.8 280.5 288 200.7 288l-8.7 0 0-96 8.7 0c79.8 0 156.5-29.8 215.3-83.3z"></path></symbol><symbol id="bullseye"viewBox="0 0 512 512"><path d="M448 256A192 192 0 1 0 64 256a192 192 0 1 0 384 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 80a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm0-224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zM224 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"></path></symbol><symbol id="cake-candles"viewBox="0 0 448 512"><path d="M86.4 5.5L61.8 47.6C58 54.1 56 61.6 56 69.2L56 72c0 22.1 17.9 40 40 40s40-17.9 40-40l0-2.8c0-7.6-2-15-5.8-21.6L105.6 5.5C103.6 2.1 100 0 96 0s-7.6 2.1-9.6 5.5zm128 0L189.8 47.6c-3.8 6.5-5.8 14-5.8 21.6l0 2.8c0 22.1 17.9 40 40 40s40-17.9 40-40l0-2.8c0-7.6-2-15-5.8-21.6L233.6 5.5C231.6 2.1 228 0 224 0s-7.6 2.1-9.6 5.5zM317.8 47.6c-3.8 6.5-5.8 14-5.8 21.6l0 2.8c0 22.1 17.9 40 40 40s40-17.9 40-40l0-2.8c0-7.6-2-15-5.8-21.6L361.6 5.5C359.6 2.1 356 0 352 0s-7.6 2.1-9.6 5.5L317.8 47.6zM128 176c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 48c-35.3 0-64 28.7-64 64l0 71c8.3 5.2 18.1 9 28.8 9c13.5 0 27.2-6.1 38.4-13.4c5.4-3.5 9.9-7.1 13-9.7c1.5-1.3 2.7-2.4 3.5-3.1c.4-.4 .7-.6 .8-.8l.1-.1s0 0 0 0s0 0 0 0s0 0 0 0s0 0 0 0c3.1-3.2 7.4-4.9 11.9-4.8s8.6 2.1 11.6 5.4c0 0 0 0 0 0s0 0 0 0l.1 .1c.1 .1 .4 .4 .7 .7c.7 .7 1.7 1.7 3.1 3c2.8 2.6 6.8 6.1 11.8 9.5c10.2 7.1 23 13.1 36.3 13.1s26.1-6 36.3-13.1c5-3.5 9-6.9 11.8-9.5c1.4-1.3 2.4-2.3 3.1-3c.3-.3 .6-.6 .7-.7l.1-.1c3-3.5 7.4-5.4 12-5.4s9 2 12 5.4l.1 .1c.1 .1 .4 .4 .7 .7c.7 .7 1.7 1.7 3.1 3c2.8 2.6 6.8 6.1 11.8 9.5c10.2 7.1 23 13.1 36.3 13.1s26.1-6 36.3-13.1c5-3.5 9-6.9 11.8-9.5c1.4-1.3 2.4-2.3 3.1-3c.3-.3 .6-.6 .7-.7l.1-.1c2.9-3.4 7.1-5.3 11.6-5.4s8.7 1.6 11.9 4.8c0 0 0 0 0 0s0 0 0 0s0 0 0 0l.1 .1c.2 .2 .4 .4 .8 .8c.8 .7 1.9 1.8 3.5 3.1c3.1 2.6 7.5 6.2 13 9.7c11.2 7.3 24.9 13.4 38.4 13.4c10.7 0 20.5-3.9 28.8-9l0-71c0-35.3-28.7-64-64-64l0-48c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 48-64 0 0-48c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 48-64 0 0-48zM448 394.6c-8.5 3.3-18.2 5.4-28.8 5.4c-22.5 0-42.4-9.9-55.8-18.6c-4.1-2.7-7.8-5.4-10.9-7.8c-2.8 2.4-6.1 5-9.8 7.5C329.8 390 310.6 400 288 400s-41.8-10-54.6-18.9c-3.5-2.4-6.7-4.9-9.4-7.2c-2.7 2.3-5.9 4.7-9.4 7.2C201.8 390 182.6 400 160 400s-41.8-10-54.6-18.9c-3.7-2.6-7-5.2-9.8-7.5c-3.1 2.4-6.8 5.1-10.9 7.8C71.2 390.1 51.3 400 28.8 400c-10.6 0-20.3-2.2-28.8-5.4L0 480c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32l0-85.4z"></path></symbol><symbol id="calculator"viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM96 64l192 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L96 160c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z"></path></symbol><symbol id="calendar-day"viewBox="0 0 448 512"><path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm80 64c-8.8 0-16 7.2-16 16l0 96c0 8.8 7.2 16 16 16l96 0c8.8 0 16-7.2 16-16l0-96c0-8.8-7.2-16-16-16l-96 0z"></path></symbol><symbol id="calendar-days"viewBox="0 0 448 512"><path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z"></path></symbol><symbol id="camera"viewBox="0 0 512 512"><path d="M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"></path></symbol><symbol id="campground"viewBox="0 0 576 512"><path d="M377 52c11-13.8 8.8-33.9-5-45s-33.9-8.8-45 5L288 60.8 249 12c-11-13.8-31.2-16-45-5s-16 31.2-5 45l48 60L12.3 405.4C4.3 415.4 0 427.7 0 440.4L0 464c0 26.5 21.5 48 48 48l240 0 240 0c26.5 0 48-21.5 48-48l0-23.6c0-12.7-4.3-25.1-12.3-35L329 112l48-60zM288 448l-119.5 0L288 291.7 407.5 448 288 448z"></path></symbol><symbol id="car"viewBox="0 0 512 512"><path d="M135.2 117.4L109.1 192l293.8 0-26.1-74.6C372.3 104.6 360.2 96 346.6 96L165.4 96c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32l181.2 0c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2l0 144 0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L96 400l0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L0 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path></symbol><symbol id="caret-down"viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path></symbol><symbol id="caret-left"viewBox="0 0 256 512"><path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z"></path></symbol><symbol id="caret-right"viewBox="0 0 256 512"><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"></path></symbol><symbol id="caret-up"viewBox="0 0 320 512"><path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l256 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"></path></symbol><symbol id="certificate"viewBox="0 0 512 512"><path d="M211 7.3C205 1 196-1.4 187.6 .8s-14.9 8.9-17.1 17.3L154.7 80.6l-62-17.5c-8.4-2.4-17.4 0-23.5 6.1s-8.5 15.1-6.1 23.5l17.5 62L18.1 170.6c-8.4 2.1-15 8.7-17.3 17.1S1 205 7.3 211l46.2 45L7.3 301C1 307-1.4 316 .8 324.4s8.9 14.9 17.3 17.1l62.5 15.8-17.5 62c-2.4 8.4 0 17.4 6.1 23.5s15.1 8.5 23.5 6.1l62-17.5 15.8 62.5c2.1 8.4 8.7 15 17.1 17.3s17.3-.2 23.4-6.4l45-46.2 45 46.2c6.1 6.2 15 8.7 23.4 6.4s14.9-8.9 17.1-17.3l15.8-62.5 62 17.5c8.4 2.4 17.4 0 23.5-6.1s8.5-15.1 6.1-23.5l-17.5-62 62.5-15.8c8.4-2.1 15-8.7 17.3-17.1s-.2-17.4-6.4-23.4l-46.2-45 46.2-45c6.2-6.1 8.7-15 6.4-23.4s-8.9-14.9-17.3-17.1l-62.5-15.8 17.5-62c2.4-8.4 0-17.4-6.1-23.5s-15.1-8.5-23.5-6.1l-62 17.5L341.4 18.1c-2.1-8.4-8.7-15-17.1-17.3S307 1 301 7.3L256 53.5 211 7.3z"></path></symbol><symbol id="chart-bar"viewBox="0 0 512 512"><path d="M32 32c17.7 0 32 14.3 32 32l0 336c0 8.8 7.2 16 16 16l400 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L80 480c-44.2 0-80-35.8-80-80L0 64C0 46.3 14.3 32 32 32zm96 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32zm32 64l128 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 96l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path></symbol><symbol id="chart-column"viewBox="0 0 512 512"><path d="M32 32c17.7 0 32 14.3 32 32l0 336c0 8.8 7.2 16 16 16l400 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L80 480c-44.2 0-80-35.8-80-80L0 64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32zm128-64l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM480 96l0 224c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-224c0-17.7 14.3-32 32-32s32 14.3 32 32z"></path></symbol><symbol id="chart-line"viewBox="0 0 512 512"><path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64L0 400c0 44.2 35.8 80 80 80l400 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 416c-8.8 0-16-7.2-16-16L64 64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"></path></symbol><symbol id="chart-pie"viewBox="0 0 576 512"><path d="M304 240l0-223.4c0-9 7-16.6 16-16.6C443.7 0 544 100.3 544 224c0 9-7.6 16-16.6 16L304 240zM32 272C32 150.7 122.1 50.3 239 34.3c9.2-1.3 17 6.1 17 15.4L256 288 412.5 444.5c6.7 6.7 6.2 17.7-1.5 23.1C371.8 495.6 323.8 512 272 512C139.5 512 32 404.6 32 272zm526.4 16c9.3 0 16.6 7.8 15.4 17c-7.7 55.9-34.6 105.6-73.9 142.3c-6 5.6-15.4 5.2-21.2-.7L320 288l238.4 0z"></path></symbol><symbol id="check"viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></symbol><symbol id="chevron-down"viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></symbol><symbol id="chevron-left"viewBox="0 0 320 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"></path></symbol><symbol id="chevron-right"viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></symbol><symbol id="chevron-up"viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"></path></symbol><symbol id="circle"viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path></symbol><symbol id="circle-check"viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></symbol><symbol id="circle-chevron-down"viewBox="0 0 512 512"><path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM135 241c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l87 87 87-87c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 345c-9.4 9.4-24.6 9.4-33.9 0L135 241z"></path></symbol><symbol id="circle-exclamation"viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"></path></symbol><symbol id="circle-half-stroke"viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192l0 384c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"></path></symbol><symbol id="circle-info"viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></symbol><symbol id="circle-minus"viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"></path></symbol><symbol id="circle-plus"viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path></symbol><symbol id="circle-question"viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"></path></symbol><symbol id="circle-stop"viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM192 160l128 0c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-128 0c-17.7 0-32-14.3-32-32l0-128c0-17.7 14.3-32 32-32z"></path></symbol><symbol id="circle-xmark"viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"></path></symbol><symbol id="clipboard"viewBox="0 0 384 512"><path d="M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"></path></symbol><symbol id="clock"viewBox="0 0 512 512"><path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"></path></symbol><symbol id="clock-rotate-left"viewBox="0 0 512 512"><path d="M75 75L41 41C25.9 25.9 0 36.6 0 57.9L0 168c0 13.3 10.7 24 24 24l110.1 0c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4c-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75zm181 53c-13.3 0-24 10.7-24 24l0 104c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65 0-94.1c0-13.3-10.7-24-24-24z"></path></symbol><symbol id="cloud-arrow-up"viewBox="0 0 640 512"><path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128l-368 0zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39L296 392c0 13.3 10.7 24 24 24s24-10.7 24-24l0-134.1 39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path></symbol><symbol id="code"viewBox="0 0 640 512"><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"></path></symbol><symbol id="coins"viewBox="0 0 512 512"><path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2c0 0 0 0 0 0s0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336l0-35.4c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4l0 3.4 0 5.7 0 26.3zm32 0l0-32 0-25.9c19-4.2 36.5-9.5 52.1-16c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 10.5-5 21-14.9 30.9c-16.3 16.3-45 29.7-81.3 38.4c.1-1.7 .2-3.5 .2-5.3zM192 448c56.2 0 108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 44.2-86 80-192 80S0 476.2 0 432l0-35.4c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448z"></path></symbol><symbol id="comment"viewBox="0 0 512 512"><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"></path></symbol><symbol id="comment-dollar"viewBox="0 0 512 512"><path d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3c0 0 0 0 0 0c0 0 0 0 0 0s0 0 0 0s0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zm20-312l0 13.9c7.5 1.2 14.6 2.9 21.1 4.7c10.7 2.8 17 13.8 14.2 24.5s-13.8 17-24.5 14.2c-11-2.9-21.6-5-31.2-5.2c-7.9-.1-16 1.8-21.5 5c-4.8 2.8-6.2 5.6-6.2 9.3c0 1.8 .1 3.5 5.3 6.7c6.3 3.8 15.5 6.7 28.3 10.5l.7 .2c11.2 3.4 25.6 7.7 37.1 15c12.9 8.1 24.3 21.3 24.6 41.6c.3 20.9-10.5 36.1-24.8 45c-7.2 4.5-15.2 7.3-23.2 9l0 13.8c0 11-9 20-20 20s-20-9-20-20l0-14.6c-10.3-2.2-20-5.5-28.2-8.4c0 0 0 0 0 0s0 0 0 0c-2.1-.7-4.1-1.4-6.1-2.1c-10.5-3.5-16.1-14.8-12.6-25.3s14.8-16.1 25.3-12.6c2.5 .8 4.9 1.7 7.2 2.4c0 0 0 0 0 0c13.6 4.6 24 8.1 35.1 8.5c8.6 .3 16.5-1.6 21.4-4.7c4.1-2.5 6-5.5 5.9-10.5c0-2.9-.8-5-5.9-8.2c-6.3-4-15.4-6.9-28-10.7l-1.7-.5c-10.9-3.3-24.6-7.4-35.6-14c-12.7-7.7-24.6-20.5-24.7-40.7c-.1-21.1 11.8-35.7 25.8-43.9c6.9-4.1 14.5-6.8 22.2-8.5l0-14c0-11 9-20 20-20s20 9 20 20z"></path></symbol><symbol id="comment-dots"viewBox="0 0 512 512"><path d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3c0 0 0 0 0 0c0 0 0 0 0 0s0 0 0 0s0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM128 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm128 0a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm96 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"></path></symbol><symbol id="comment-slash"viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L512.9 376.7C552.2 340.2 576 292.3 576 240C576 125.1 461.4 32 320 32c-67.7 0-129.3 21.4-175.1 56.3L38.8 5.1zm385.2 425L82.9 161.3C70.7 185.6 64 212.2 64 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3c0 0 0 0 0 0c0 0 0 0 0 0s0 0 0 0s0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9c37 0 72.3-6.4 104.1-17.9z"></path></symbol><symbol id="comments"viewBox="0 0 640 512"><path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2s0 0 0 0s0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.2-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9c0 0 0 0 0 0s0 0 0 0l-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z"></path></symbol><symbol id="compress"viewBox="0 0 448 512"><path d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z"></path></symbol><symbol id="copy"viewBox="0 0 448 512"><path d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"></path></symbol><symbol id="crosshairs"viewBox="0 0 512 512"><path d="M256 0c17.7 0 32 14.3 32 32l0 10.4c93.7 13.9 167.7 88 181.6 181.6l10.4 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-10.4 0c-13.9 93.7-88 167.7-181.6 181.6l0 10.4c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-10.4C130.3 455.7 56.3 381.7 42.4 288L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l10.4 0C56.3 130.3 130.3 56.3 224 42.4L224 32c0-17.7 14.3-32 32-32zM107.4 288c12.5 58.3 58.4 104.1 116.6 116.6l0-20.6c0-17.7 14.3-32 32-32s32 14.3 32 32l0 20.6c58.3-12.5 104.1-58.4 116.6-116.6L384 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l20.6 0C392.1 165.7 346.3 119.9 288 107.4l0 20.6c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-20.6C165.7 119.9 119.9 165.7 107.4 224l20.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-20.6 0zM256 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></symbol><symbol id="crown"viewBox="0 0 576 512"><path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6l277.2 0c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z"></path></symbol><symbol id="cube"viewBox="0 0 512 512"><path d="M234.5 5.7c13.9-5 29.1-5 43.1 0l192 68.6C495 83.4 512 107.5 512 134.6l0 242.9c0 27-17 51.2-42.5 60.3l-192 68.6c-13.9 5-29.1 5-43.1 0l-192-68.6C17 428.6 0 404.5 0 377.4L0 134.6c0-27 17-51.2 42.5-60.3l192-68.6zM256 66L82.3 128 256 190l173.7-62L256 66zm32 368.6l160-57.1 0-188L288 246.6l0 188z"></path></symbol><symbol id="database"viewBox="0 0 448 512"><path d="M448 80l0 48c0 44.2-100.3 80-224 80S0 172.2 0 128L0 80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6L448 288c0 44.2-100.3 80-224 80S0 332.2 0 288L0 186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6l0 85.9c0 44.2-100.3 80-224 80S0 476.2 0 432l0-85.9z"></path></symbol><symbol id="desktop"viewBox="0 0 576 512"><path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l176 0-10.7 32L160 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-69.3 0L336 416l176 0c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0zM512 64l0 224L64 288 64 64l448 0z"></path></symbol><symbol id="diagram-project"viewBox="0 0 576 512"><path d="M0 80C0 53.5 21.5 32 48 32l96 0c26.5 0 48 21.5 48 48l0 16 192 0 0-16c0-26.5 21.5-48 48-48l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-16-192 0 0 16c0 1.7-.1 3.4-.3 5L272 288l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-96c0-1.7 .1-3.4 .3-5L144 224l-96 0c-26.5 0-48-21.5-48-48L0 80z"></path></symbol><symbol id="discourse-amazon"viewBox="0 0 291 291"><path style="fill:#ff8a24;"d="M252.089,239.901c-120.033,57.126-194.528,9.331-242.214-19.7c-2.95-1.83-7.966,0.428-3.614,5.426 c15.886,19.263,67.95,65.692,135.909,65.692c68.005,0,108.462-37.107,113.523-43.58 C260.719,241.321,257.169,237.78,252.089,239.901z M285.8,221.284c-3.223-4.197-19.6-4.98-29.906-3.714 c-10.324,1.229-25.818,7.538-24.471,11.325c0.692,1.42,2.103,0.783,9.195,0.146c7.11-0.71,27.029-3.223,31.18,2.203 c4.17,5.462-6.354,31.49-8.275,35.687c-1.857,4.197,0.71,5.28,4.197,2.485c3.441-2.795,9.668-10.032,13.847-20.274 C285.718,238.845,288.249,224.479,285.8,221.284z"></path><path d="M221.71,149.219V53.557C221.71,37.125,205.815,0,148.689,0C91.572,0,61.184,35.696,61.184,67.85 l47.74,4.27c0,0,10.633-32.136,35.313-32.136s22.987,19.992,22.987,24.316v20.784C135.607,86.149,57.096,95.18,57.096,161.382 c0,71.191,89.863,74.177,119.332,28.167c1.138,1.866,2.431,3.696,4.051,5.408c10.843,11.398,25.308,24.981,25.308,24.981 l36.852-36.415C242.658,183.513,221.71,167.071,221.71,149.219z M112.511,152.578c0-30.579,32.764-36.779,54.722-37.507v26.319 C167.224,193.527,112.511,185.634,112.511,152.578z"></path></symbol><symbol id="discourse-bell-exclamation"viewBox="0 0 448 512"><path d="M439.4 362.3c-19.3-20.8-55.5-52-55.5-154.3 0-77.7-54.5-139.9-127.9-155.2V32c0-17.7-14.3-32-32-32s-32 14.3-32 32v20.8C118.6 68.1 64.1 130.3 64.1 208c0 102.3-36.2 133.5-55.5 154.3-6 6.4-8.6 14.1-8.6 21.7.1 16.4 13 32 32.1 32h383.8c19.1 0 32-15.6 32.1-32 .1-7.6-2.6-15.3-8.6-21.7zM201.7 116.6h44.6c6.5 0 11.7 5.5 11.4 12l-6.5 123.8c-.3 6.1-5.3 10.9-11.4 10.9h-31.6c-6.1 0-11.1-4.8-11.4-10.9l-6.5-123.8c-.3-6.6 4.9-12 11.4-12zM224 361.3c-18.6 0-33.7-15.1-33.7-33.7s15.1-33.7 33.7-33.7 33.7 15.1 33.7 33.7-15.1 33.7-33.7 33.7zM224 512c35.3 0 64-28.7 64-64H160c0 35.3 28.7 64 64 64z"></path></symbol><symbol id="discourse-bell-one"viewBox="0 0 448 512"><path d="M224 512c35.3 0 64-28.7 64-64H160c0 35.3 28.7 64 64 64zM439.4 362.3c-19.3-20.8-55.5-52-55.5-154.3 0-77.7-54.5-139.9-127.9-155.2V32c0-17.7-14.3-32-32-32s-32 14.3-32 32v20.8C118.6 68.1 64.1 130.3 64.1 208c0 102.3-36.2 133.5-55.5 154.3-6 6.4-8.6 14.1-8.6 21.7.1 16.4 13 32 32.1 32h383.8c19.1 0 32-15.6 32.1-32 .1-7.6-2.6-15.3-8.6-21.7zm-145.2-28c0 8.6-7 15.5-15.5 15.5h-97c-8.6 0-15.5-7-15.5-15.5v-15.8c0-8.6 7-15.5 15.5-15.5h27.1V192.5l-5.1 3.1c-6 6.1-15.9 6.2-22 .1l-11.2-11.1c-6.1-6-6.2-15.9-.1-22l31.6-31.9c3.2-3.2 7.4-4.7 11.5-4.6h26.6c8.6 0 11.5 7 11.5 15.5v161.3h27.1c8.6 0 15.5 7 15.5 15.5v15.9z"></path></symbol><symbol id="discourse-bell-slash"viewBox="0 0 448 512"><path d="M442.7 396.2L36.5 70.7c-6.9-5.5-17-4.4-22.5 2.5L4 85.6c-5.5 6.9-4.4 17 2.5 22.5l406.2 325.5c6.9 5.5 17 4.4 22.5-2.5l10-12.5c5.5-6.9 3.7-17.7-3.2-23.2l.7.8zM67.5 368c16.7-22 34.5-55.8 41.4-110.6l-45.5-35.6C60.2 312.6 27 342.5 8.6 362.3 2.6 368.7 0 376.4 0 384c.1 16.4 13 32 32.1 32h279.7l-61.4-48H67.5zM224 96c61.9 0 112 50.1 112 112 0 .2-.1.4-.1.6 0 16.8 1.2 31.8 2.8 45.7l59.5 46.5c-8.3-22.1-14.3-51.5-14.3-92.9 0-77.7-54.5-139.9-127.9-155.2V32c0-17.7-14.3-32-32-32s-32 14.3-32 32v20.8c-26 5.4-49.4 16.9-69.1 32.7l38.2 29.8C179 103.2 200.6 96 224 96zm0 416c35.3 0 64-28.6 64-64H160c0 35.4 28.7 64 64 64z"></path></symbol><symbol id="discourse-bookmark-clock"viewBox="0 0 536 512"><path d="M215.86 143.33A168.09 168.09 0 01296 0H48A48 48 0 000 48v464l192-112 192 112V315.53c-94-.04-168.14-79.33-168.14-172.2z M392.45 0a144 144 0 10144 144 143.91 143.91 0 00-144-144zm64 150.3a9.77 9.77 0 01-9.7 9.7h-60.6a9.77 9.77 0 01-9.7-9.7V73.7a9.77 9.77 0 019.7-9.7h12.6a9.77 9.77 0 019.7 9.7V128h38.3a9.77 9.77 0 019.7 9.7z"></path></symbol><symbol id="discourse-chevron-collapse"viewBox="0 0 512 512"><path d="M256.483 296.229C247.794 296.229 240.071 299.122 234.278 304.908L79.8128 459.202C67.2624 470.774 67.2624 491.026 79.8128 502.598C91.3977 515.134 111.671 515.134 123.256 502.598L256.483 370.483L388.744 502.598C400.329 515.134 420.602 515.134 432.187 502.598C444.738 491.026 444.738 470.774 432.187 459.202L277.722 304.908C271.929 299.122 264.206 296.229 256.483 296.229Z"></path><path d="M256.483 215.771C247.794 215.771 240.071 212.878 234.278 207.092L79.8128 52.7977C67.2624 41.2256 67.2624 20.9744 79.8128 9.40233C91.3977 -3.13411 111.671 -3.13411 123.256 9.40233L256.483 141.517L388.744 9.40233C400.329 -3.13411 420.602 -3.13411 432.187 9.40233C444.738 20.9744 444.738 41.2256 432.187 52.7977L277.722 207.092C271.929 212.878 264.206 215.771 256.483 215.771Z"></path></symbol><symbol id="discourse-chevron-expand"viewBox="0 0 512 512"><path d="M256.483 512C247.794 512 240.071 509.107 234.278 503.321L79.8128 349.026C67.2624 337.454 67.2624 317.203 79.8128 305.631C91.3977 293.094 111.671 293.094 123.256 305.631L256.483 437.746L388.744 305.631C400.329 293.094 420.602 293.094 432.187 305.631C444.738 317.203 444.738 337.454 432.187 349.026L277.722 503.321C271.929 509.107 264.206 512 256.483 512Z"></path><path d="M256.483 0C247.794 0 240.071 2.89303 234.278 8.67907L79.8128 162.974C67.2624 174.546 67.2624 194.797 79.8128 206.369C91.3977 218.906 111.671 218.906 123.256 206.369L256.483 74.2543L388.744 206.369C400.329 218.906 420.602 218.906 432.187 206.369C444.738 194.797 444.738 174.546 432.187 162.974L277.722 8.67907C271.929 2.89303 264.206 0 256.483 0Z"></path></symbol><symbol id="discourse-compress"viewBox="0 0 1792 1792"><path d="M896 960v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45zm755-672q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19h-448q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23z"></path></symbol><symbol id="discourse-dnd"viewBox="0 0 52 52"fill-rule="evenodd"clip-rule="evenodd"><path d="M26 46.5156C37.3305 46.5156 46.5156 37.3305 46.5156 26C46.5156 14.6695 37.3305 5.48438 26 5.48438C14.6695 5.48438 5.48438 14.6695 5.48438 26C5.48438 37.3305 14.6695 46.5156 26 46.5156ZM26 52C40.3594 52 52 40.3594 52 26C52 11.6406 40.3594 0 26 0C11.6406 0 0 11.6406 0 26C0 40.3594 11.6406 52 26 52Z"></path><path d="M33.3125 22.75H18.6875C16.8926 22.75 15.4375 24.2051 15.4375 26C15.4375 27.7949 16.8926 29.25 18.6875 29.25H33.3125C35.1074 29.25 36.5625 27.7949 36.5625 26C36.5625 24.2051 35.1074 22.75 33.3125 22.75Z"></path></symbol><symbol id="discourse-emojis"viewBox="0 0 216.3 152.3"><path d="M121.1 70.7c1.9 2 5.1 2.1 7.2.2l.2-.2 31.2-32.2c9.1-9.4 8.6-24.9-1.6-33.5-8.8-7.5-22-6.2-30.1 2.2l-3.2 3.3-3.2-3.3c-8.1-8.4-21.3-9.7-30.1-2.2-10.1 8.6-10.7 24.2-1.6 33.5l31.2 32.2zM53.5 45.3C23.9 45.3 0 69.2 0 98.8s23.9 53.5 53.5 53.5 53.5-24 53.5-53.5-23.9-53.5-53.5-53.5zm18.8 24.6c5.5 0 9.9 4.4 9.9 9.9s-4.4 9.9-9.9 9.9-9.9-4.4-9.9-9.9c-.1-5.5 4.4-9.9 9.9-9.9zm-38.2 0c5.5 0 9.9 4.4 9.9 9.9s-4.4 9.9-9.9 9.9-9.9-4.4-9.9-9.9 4.4-9.9 9.9-9.9zm52.4 45.4c-8.2 9.8-20.2 15.5-33.1 15.5s-24.9-5.6-33.1-15.5c-3.9-4.7 3.2-10.6 7.1-5.9 6.5 7.7 15.9 12.2 26 12.2s19.5-4.4 26-12.2c3.8-4.7 10.9 1.2 7.1 5.9zm129.8-22.5c0-6.4-6.3-9.5-13.3-9.5h-24c1.5-6 10.3-13.8 10.3-22.8 0-15.5-10.1-17.2-15.2-17.2-4.3 0-6.2 8.3-7.2 12.2-1.1 4.6-2.2 9.3-5.4 12.4-6.7 6.8-10.3 15.3-18.4 23.5-.7-1.8-2.6-3.1-4.7-3.1h-10.7c-2.8 0-5.1 2.2-5.1 4.9V142c0 2.7 2.3 4.9 5.1 4.9h10.7c2.8 0 5.1-2.2 5.1-4.9v-.9c.3.1.6.2.9.2 3.3.1 7.8 1.9 11.1 3.4 6.7 3 15.1 6.7 25.3 6.7h.6c9 0 19.7-.1 24-6.3 1.8-2.5 2.7-4.4.5-9.9 5-3 7-10 1-15 8-5 8-13 1-17 6.1-1.9 8.5-6.6 8.4-10.4z"></path></symbol><symbol id="discourse-expand"viewBox="0 0 1792 1792"><path d="M883 1056q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19h-448q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23zm781-864v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45z"></path></symbol><symbol id="discourse-other-tab"viewBox="0 0 114 113"><g clip-path="url(#clip0_2925_742)"><rect x="8"y="8"width="44"height="44"rx="5"></rect><rect x="8"y="61"width="44"height="44"rx="5"></rect><rect x="62"y="61"width="44"height="44"rx="5"></rect><rect width="44"height="43.9967"rx="5"transform="matrix(0.705436 -0.708774 0.705436 0.708774 53 30)"></rect></g><defs><clipPath id="clip0_2925_742"><rect width="114"height="113"></rect></clipPath></defs></symbol><symbol id="discourse-sidebar"viewBox="0 0 513 513"><path fill-rule="evenodd"clip-rule="evenodd"d="M64.125 0C28.0547 0 0 29.0566 0 64.125V399.75C0 435.82 28.0547 463.875 64.125 463.875H448.875C483.943 463.875 513 435.82 513 399.75V64.125C513 29.0566 483.943 0 448.875 0H64.125ZM219.375 407.75H56.125V56.1875H219.375V407.75ZM272.5 56.1875H455.875V407.75H272.5V56.1875ZM96 96C91.5817 96 88 99.5817 88 104V128C88 132.418 91.5817 136 96 136H184C188.418 136 192 132.418 192 128V104C192 99.5817 188.418 96 184 96H96ZM88 184C88 179.582 91.5817 176 96 176H184C188.418 176 192 179.582 192 184V208C192 212.418 188.418 216 184 216H96C91.5817 216 88 212.418 88 208V184ZM96 256C91.5817 256 88 259.582 88 264V288C88 292.418 91.5817 296 96 296H184C188.418 296 192 292.418 192 288V264C192 259.582 188.418 256 184 256H96Z"></path></symbol><symbol id="discourse-sparkles"viewBox="0 0 563 541"><path d="M253.547 16.7474C262.26 -3.29796 290.689 -3.29797 299.402 16.7474L369.756 178.602C372.485 184.88 377.669 189.765 384.099 192.116L545.781 251.23C567.668 259.232 567.668 290.187 545.781 298.19L383.78 357.421C377.538 359.703 372.462 364.377 369.673 370.409L299.167 522.916C290.223 542.261 262.726 542.261 253.783 522.916L183.171 370.181C180.445 364.284 175.53 359.679 169.467 357.343L15.5462 298.038C-5.80267 289.812 -5.80262 259.607 15.5463 251.382L169.153 192.197C175.402 189.79 180.423 184.976 183.093 178.835L253.547 16.7474Z"></path><path d="M76.9415 8.24704C81.0653 -1.54063 94.9348 -1.54061 99.0585 8.24706L116.93 50.6637C118.283 53.8752 120.965 56.3398 124.279 57.4169L167.883 71.5875C178.938 75.1802 178.938 90.8198 167.883 94.4125L124.279 108.583C120.965 109.66 118.283 112.125 116.93 115.336L99.0586 157.753C94.9348 167.541 81.0652 167.541 76.9415 157.753L59.0703 115.336C57.7172 112.125 55.0349 109.66 51.7206 108.583L8.11678 94.4125C-2.93804 90.8198 -2.93804 75.1802 8.11678 71.5875L51.7206 57.4169C55.0348 56.3398 57.7172 53.8752 59.0703 50.6637L76.9415 8.24704Z"></path></symbol><symbol id="discourse-threads"viewBox="0 0 16 17"fill-rule="evenodd"clip-rule="evenodd"><path d="M5 0L4.57143 3H1V5H4.28571L3.71429 9H0V11H3.42857L3 14L4.9799 14.2828L5.44888 11H7V9H5.73459L6.30602 5H11.2857L11 7H13.0203L13.306 5H16V3H13.5917L13.9799 0.282843L12 0L11.5714 3H6.59173L6.9799 0.282843L5 0ZM8 13.5V9C8 8.44772 8.44771 8 9 8H15C15.5523 8 16 8.44771 16 9V13.5C16 14.0523 15.5523 14.5 15 14.5H12.1194C11.5042 15.2014 10.396 16.3544 10.0417 16C9.97944 15.9223 9.99982 15.0667 10.0206 14.5H9C8.44771 14.5 8 14.0523 8 13.5Z"></path></symbol><symbol id="down-left-and-up-right-to-center"viewBox="0 0 512 512"><path d="M439 7c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8l-144 0c-13.3 0-24-10.7-24-24l0-144c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39L439 7zM72 272l144 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39L73 505c-9.4 9.4-24.6 9.4-33.9 0L7 473c-9.4-9.4-9.4-24.6 0-33.9l87-87L55 313c-6.9-6.9-8.9-17.2-5.2-26.2s12.5-14.8 22.2-14.8z"></path></symbol><symbol id="download"viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path></symbol><symbol id="dragon"viewBox="0 0 640 512"><path d="M352 124.5l-51.9-13c-6.5-1.6-11.3-7.1-12-13.8s2.8-13.1 8.7-16.1l40.8-20.4L294.4 28.8c-5.5-4.1-7.8-11.3-5.6-17.9S297.1 0 304 0L416 0l32 0 16 0c30.2 0 58.7 14.2 76.8 38.4l57.6 76.8c6.2 8.3 9.6 18.4 9.6 28.8c0 26.5-21.5 48-48 48l-21.5 0c-17 0-33.3-6.7-45.3-18.7L480 160l-32 0 0 21.5c0 24.8 12.8 47.9 33.8 61.1l106.6 66.6c32.1 20.1 51.6 55.2 51.6 93.1C640 462.9 590.9 512 530.2 512L496 512l-64 0L32.3 512c-3.3 0-6.6-.4-9.6-1.4C13.5 507.8 6 501 2.4 492.1C1 488.7 .2 485.2 0 481.4c-.2-3.7 .3-7.3 1.3-10.7c2.8-9.2 9.6-16.7 18.6-20.4c3-1.2 6.2-2 9.5-2.2L433.3 412c8.3-.7 14.7-7.7 14.7-16.1c0-4.3-1.7-8.4-4.7-11.4l-44.4-44.4c-30-30-46.9-70.7-46.9-113.1l0-45.5 0-57zM512 72.3c0-.1 0-.2 0-.3s0-.2 0-.3l0 .6zm-1.3 7.4L464.3 68.1c-.2 1.3-.3 2.6-.3 3.9c0 13.3 10.7 24 24 24c10.6 0 19.5-6.8 22.7-16.3zM130.9 116.5c16.3-14.5 40.4-16.2 58.5-4.1l130.6 87 0 27.5c0 32.8 8.4 64.8 24 93l-232 0c-6.7 0-12.7-4.2-15-10.4s-.5-13.3 4.6-17.7L171 232.3 18.4 255.8c-7 1.1-13.9-2.6-16.9-9s-1.5-14.1 3.8-18.8L130.9 116.5z"></path></symbol><symbol id="droplet"viewBox="0 0 384 512"><path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0l1.8 0c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"></path></symbol><symbol id="droplet-slash"viewBox="0 0 640 512"><path d="M320 512c53.2 0 101.4-21.6 136.1-56.6l-298.3-235C140 257.1 128 292.3 128 320c0 106 86 192 192 192zM505.2 370.7c4.4-16.2 6.8-33.1 6.8-50.7c0-91.2-130.2-262.3-166.6-308.3C339.4 4.2 330.5 0 320.9 0l-1.8 0c-9.6 0-18.5 4.2-24.5 11.7C277.8 33 240.7 81.3 205.8 136L38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L505.2 370.7zM224 336c0 44.2 35.8 80 80 80c8.8 0 16 7.2 16 16s-7.2 16-16 16c-61.9 0-112-50.1-112-112c0-8.8 7.2-16 16-16s16 7.2 16 16z"></path></symbol><symbol id="earth-americas"viewBox="0 0 512 512"><path d="M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5l0 39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9l0 39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7l0-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1L257 256c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"></path></symbol><symbol id="ellipsis"viewBox="0 0 448 512"><path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"></path></symbol><symbol id="ellipsis-vertical"viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"></path></symbol><symbol id="envelope"viewBox="0 0 512 512"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"></path></symbol><symbol id="envelope-open-text"viewBox="0 0 512 512"><path d="M215.4 96L144 96l-36.2 0L96 96l0 8.8L96 144l0 40.4 0 89L.2 202.5c1.6-18.1 10.9-34.9 25.7-45.8L48 140.3 48 96c0-26.5 21.5-48 48-48l76.6 0 49.9-36.9C232.2 3.9 243.9 0 256 0s23.8 3.9 33.5 11L339.4 48 416 48c26.5 0 48 21.5 48 48l0 44.3 22.1 16.4c14.8 10.9 24.1 27.7 25.7 45.8L416 273.4l0-89 0-40.4 0-39.2 0-8.8-11.8 0L368 96l-71.4 0-81.3 0zM0 448L0 242.1 217.6 403.3c11.1 8.2 24.6 12.7 38.4 12.7s27.3-4.4 38.4-12.7L512 242.1 512 448s0 0 0 0c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64c0 0 0 0 0 0zM176 160l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"></path></symbol><symbol id="ethernet"viewBox="0 0 512 512"><path d="M0 224L0 416c0 17.7 14.3 32 32 32l64 0 0-112c0-8.8 7.2-16 16-16s16 7.2 16 16l0 112 64 0 0-112c0-8.8 7.2-16 16-16s16 7.2 16 16l0 112 64 0 0-112c0-8.8 7.2-16 16-16s16 7.2 16 16l0 112 64 0 0-112c0-8.8 7.2-16 16-16s16 7.2 16 16l0 112 64 0c17.7 0 32-14.3 32-32l0-192c0-17.7-14.3-32-32-32l-32 0 0-32c0-17.7-14.3-32-32-32l-32 0 0-32c0-17.7-14.3-32-32-32L160 64c-17.7 0-32 14.3-32 32l0 32-32 0c-17.7 0-32 14.3-32 32l0 32-32 0c-17.7 0-32 14.3-32 32z"></path></symbol><symbol id="expand"viewBox="0 0 448 512"><path d="M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z"></path></symbol><symbol id="eye"viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path></symbol><symbol id="fab-android"viewBox="0 0 576 512"><path d="M420.55,301.93a24,24,0,1,1,24-24,24,24,0,0,1-24,24m-265.1,0a24,24,0,1,1,24-24,24,24,0,0,1-24,24m273.7-144.48,47.94-83a10,10,0,1,0-17.27-10h0l-48.54,84.07a301.25,301.25,0,0,0-246.56,0L116.18,64.45a10,10,0,1,0-17.27,10h0l47.94,83C64.53,202.22,8.24,285.55,0,384H576c-8.24-98.45-64.54-181.78-146.85-226.55"></path></symbol><symbol id="fab-apple"viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path></symbol><symbol id="fab-chrome"viewBox="0 0 512 512"><path d="M0 256C0 209.4 12.47 165.6 34.27 127.1L144.1 318.3C166 357.5 207.9 384 256 384C270.3 384 283.1 381.7 296.8 377.4L220.5 509.6C95.9 492.3 0 385.3 0 256zM365.1 321.6C377.4 302.4 384 279.1 384 256C384 217.8 367.2 183.5 340.7 160H493.4C505.4 189.6 512 222.1 512 256C512 397.4 397.4 511.1 256 512L365.1 321.6zM477.8 128H256C193.1 128 142.3 172.1 130.5 230.7L54.19 98.47C101 38.53 174 0 256 0C350.8 0 433.5 51.48 477.8 128V128zM168 256C168 207.4 207.4 168 256 168C304.6 168 344 207.4 344 256C344 304.6 304.6 344 256 344C207.4 344 168 304.6 168 256z"></path></symbol><symbol id="fab-discord"viewBox="0 0 640 512"><path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"></path></symbol><symbol id="fab-discourse"viewBox="0 0 448 512"><path d="M225.9 32C103.3 32 0 130.5 0 252.1 0 256 .1 480 .1 480l225.8-.2c122.7 0 222.1-102.3 222.1-223.9C448 134.3 348.6 32 225.9 32zM224 384c-19.4 0-37.9-4.3-54.4-12.1L88.5 392l22.9-75c-9.8-18.1-15.4-38.9-15.4-61 0-70.7 57.3-128 128-128s128 57.3 128 128-57.3 128-128 128z"></path></symbol><symbol id="fab-facebook"viewBox="0 0 512 512"><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"></path></symbol><symbol id="fab-github"viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></symbol><symbol id="fab-instagram"viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></symbol><symbol id="fab-linkedin-in"viewBox="0 0 448 512"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></symbol><symbol id="fab-linux"viewBox="0 0 448 512"><path d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7.1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9.6 7.9 1.2 11.8 1.2 8.1 2.5 15.7.8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1.6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3.4-8.2-4.4-17.3-15.5-29.7zM223.7 87.3c9.8-22.2 34.2-21.8 44-.4 6.5 14.2 3.6 30.9-4.3 40.4-1.6-.8-5.9-2.6-12.6-4.9 1.1-1.2 3.1-2.7 3.9-4.6 4.8-11.8-.2-27-9.1-27.3-7.3-.5-13.9 10.8-11.8 23-4.1-2-9.4-3.5-13-4.4-1-6.9-.3-14.6 2.9-21.8zM183 75.8c10.1 0 20.8 14.2 19.1 33.5-3.5 1-7.1 2.5-10.2 4.6 1.2-8.9-3.3-20.1-9.6-19.6-8.4.7-9.8 21.2-1.8 28.1 1 .8 1.9-.2-5.9 5.5-15.6-14.6-10.5-52.1 8.4-52.1zm-13.6 60.7c6.2-4.6 13.6-10 14.1-10.5 4.7-4.4 13.5-14.2 27.9-14.2 7.1 0 15.6 2.3 25.9 8.9 6.3 4.1 11.3 4.4 22.6 9.3 8.4 3.5 13.7 9.7 10.5 18.2-2.6 7.1-11 14.4-22.7 18.1-11.1 3.6-19.8 16-38.2 14.9-3.9-.2-7-1-9.6-2.1-8-3.5-12.2-10.4-20-15-8.6-4.8-13.2-10.4-14.7-15.3-1.4-4.9 0-9 4.2-12.3zm3.3 334c-2.7 35.1-43.9 34.4-75.3 18-29.9-15.8-68.6-6.5-76.5-21.9-2.4-4.7-2.4-12.7 2.6-26.4v-.2c2.4-7.6.6-16-.6-23.9-1.2-7.8-1.8-15 .9-20 3.5-6.7 8.5-9.1 14.8-11.3 10.3-3.7 11.8-3.4 19.6-9.9 5.5-5.7 9.5-12.9 14.3-18 5.1-5.5 10-8.1 17.7-6.9 8.1 1.2 15.1 6.8 21.9 16l19.6 35.6c9.5 19.9 43.1 48.4 41 68.9zm-1.4-25.9c-4.1-6.6-9.6-13.6-14.4-19.6 7.1 0 14.2-2.2 16.7-8.9 2.3-6.2 0-14.9-7.4-24.9-13.5-18.2-38.3-32.5-38.3-32.5-13.5-8.4-21.1-18.7-24.6-29.9s-3-23.3-.3-35.2c5.2-22.9 18.6-45.2 27.2-59.2 2.3-1.7.8 3.2-8.7 20.8-8.5 16.1-24.4 53.3-2.6 82.4.6-20.7 5.5-41.8 13.8-61.5 12-27.4 37.3-74.9 39.3-112.7 1.1.8 4.6 3.2 6.2 4.1 4.6 2.7 8.1 6.7 12.6 10.3 12.4 10 28.5 9.2 42.4 1.2 6.2-3.5 11.2-7.5 15.9-9 9.9-3.1 17.8-8.6 22.3-15 7.7 30.4 25.7 74.3 37.2 95.7 6.1 11.4 18.3 35.5 23.6 64.6 3.3-.1 7 .4 10.9 1.4 13.8-35.7-11.7-74.2-23.3-84.9-4.7-4.6-4.9-6.6-2.6-6.5 12.6 11.2 29.2 33.7 35.2 59 2.8 11.6 3.3 23.7.4 35.7 16.4 6.8 35.9 17.9 30.7 34.8-2.2-.1-3.2 0-4.2 0 3.2-10.1-3.9-17.6-22.8-26.1-19.6-8.6-36-8.6-38.3 12.5-12.1 4.2-18.3 14.7-21.4 27.3-2.8 11.2-3.6 24.7-4.4 39.9-.5 7.7-3.6 18-6.8 29-32.1 22.9-76.7 32.9-114.3 7.2zm257.4-11.5c-.9 16.8-41.2 19.9-63.2 46.5-13.2 15.7-29.4 24.4-43.6 25.5s-26.5-4.8-33.7-19.3c-4.7-11.1-2.4-23.1 1.1-36.3 3.7-14.2 9.2-28.8 9.9-40.6.8-15.2 1.7-28.5 4.2-38.7 2.6-10.3 6.6-17.2 13.7-21.1.3-.2.7-.3 1-.5.8 13.2 7.3 26.6 18.8 29.5 12.6 3.3 30.7-7.5 38.4-16.3 9-.3 15.7-.9 22.6 5.1 9.9 8.5 7.1 30.3 17.1 41.6 10.6 11.6 14 19.5 13.7 24.6zM173.3 148.7c2 1.9 4.7 4.5 8 7.1 6.6 5.2 15.8 10.6 27.3 10.6 11.6 0 22.5-5.9 31.8-10.8 4.9-2.6 10.9-7 14.8-10.4s5.9-6.3 3.1-6.6-2.6 2.6-6 5.1c-4.4 3.2-9.7 7.4-13.9 9.8-7.4 4.2-19.5 10.2-29.9 10.2s-18.7-4.8-24.9-9.7c-3.1-2.5-5.7-5-7.7-6.9-1.5-1.4-1.9-4.6-4.3-4.9-1.4-.1-1.8 3.7 1.7 6.5z"></path></symbol><symbol id="fab-markdown"viewBox="0 0 640 512"><path d="M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.1-46.1V105.2c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z"></path></symbol><symbol id="fab-threads"viewBox="0 0 448 512"><path d="M331.5 235.7c2.2 .9 4.2 1.9 6.3 2.8c29.2 14.1 50.6 35.2 61.8 61.4c15.7 36.5 17.2 95.8-30.3 143.2c-36.2 36.2-80.3 52.5-142.6 53h-.3c-70.2-.5-124.1-24.1-160.4-70.2c-32.3-41-48.9-98.1-49.5-169.6V256v-.2C17 184.3 33.6 127.2 65.9 86.2C102.2 40.1 156.2 16.5 226.4 16h.3c70.3 .5 124.9 24 162.3 69.9c18.4 22.7 32 50 40.6 81.7l-40.4 10.8c-7.1-25.8-17.8-47.8-32.2-65.4c-29.2-35.8-73-54.2-130.5-54.6c-57 .5-100.1 18.8-128.2 54.4C72.1 146.1 58.5 194.3 58 256c.5 61.7 14.1 109.9 40.3 143.3c28 35.6 71.2 53.9 128.2 54.4c51.4-.4 85.4-12.6 113.7-40.9c32.3-32.2 31.7-71.8 21.4-95.9c-6.1-14.2-17.1-26-31.9-34.9c-3.7 26.9-11.8 48.3-24.7 64.8c-17.1 21.8-41.4 33.6-72.7 35.3c-23.6 1.3-46.3-4.4-63.9-16c-20.8-13.8-33-34.8-34.3-59.3c-2.5-48.3 35.7-83 95.2-86.4c21.1-1.2 40.9-.3 59.2 2.8c-2.4-14.8-7.3-26.6-14.6-35.2c-10-11.7-25.6-17.7-46.2-17.8H227c-16.6 0-39 4.6-53.3 26.3l-34.4-23.6c19.2-29.1 50.3-45.1 87.8-45.1h.8c62.6 .4 99.9 39.5 103.7 107.7l-.2 .2zm-156 68.8c1.3 25.1 28.4 36.8 54.6 35.3c25.6-1.4 54.6-11.4 59.5-73.2c-13.2-2.9-27.8-4.4-43.4-4.4c-4.8 0-9.6 .1-14.4 .4c-42.9 2.4-57.2 23.2-56.2 41.8l-.1 .1z"></path></symbol><symbol id="fab-twitter"viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></symbol><symbol id="fab-wikipedia-w"viewBox="0 0 640 512"><path d="M640 51.2l-.3 12.2c-28.1.8-45 15.8-55.8 40.3-25 57.8-103.3 240-155.3 358.6H415l-81.9-193.1c-32.5 63.6-68.3 130-99.2 193.1-.3.3-15 0-15-.3C172 352.3 122.8 243.4 75.8 133.4 64.4 106.7 26.4 63.4.2 63.7c0-3.1-.3-10-.3-14.2h161.9v13.9c-19.2 1.1-52.8 13.3-43.3 34.2 21.9 49.7 103.6 240.3 125.6 288.6 15-29.7 57.8-109.2 75.3-142.8-13.9-28.3-58.6-133.9-72.8-160-9.7-17.8-36.1-19.4-55.8-19.7V49.8l142.5.3v13.1c-19.4.6-38.1 7.8-29.4 26.1 18.9 40 30.6 68.1 48.1 104.7 5.6-10.8 34.7-69.4 48.1-100.8 8.9-20.6-3.9-28.6-38.6-29.4.3-3.6 0-10.3.3-13.6 44.4-.3 111.1-.3 123.1-.6v13.6c-22.5.8-45.8 12.8-58.1 31.7l-59.2 122.8c6.4 16.1 63.3 142.8 69.2 156.7L559.2 91.8c-8.6-23.1-36.4-28.1-47.2-28.3V49.6l127.8 1.1.2.5z"></path></symbol><symbol id="fab-windows"viewBox="0 0 448 512"><path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"></path></symbol><symbol id="fab-x-twitter"viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></symbol><symbol id="face-angry"viewBox="0 0 512 512"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM338.7 395.9c6.6-5.9 7.1-16 1.2-22.6C323.8 355.4 295.7 336 256 336s-67.8 19.4-83.9 37.3c-5.9 6.6-5.4 16.7 1.2 22.6s16.7 5.4 22.6-1.2c11.7-13 31.6-26.7 60.1-26.7s48.4 13.7 60.1 26.7c5.9 6.6 16 7.1 22.6 1.2zM176.4 272c17.7 0 32-14.3 32-32c0-1.5-.1-3-.3-4.4l10.9 3.6c8.4 2.8 17.4-1.7 20.2-10.1s-1.7-17.4-10.1-20.2l-96-32c-8.4-2.8-17.4 1.7-20.2 10.1s1.7 17.4 10.1 20.2l30.7 10.2c-5.8 5.8-9.3 13.8-9.3 22.6c0 17.7 14.3 32 32 32zm192-32c0-8.9-3.6-17-9.5-22.8l30.2-10.1c8.4-2.8 12.9-11.9 10.1-20.2s-11.9-12.9-20.2-10.1l-96 32c-8.4 2.8-12.9 11.9-10.1 20.2s11.9 12.9 20.2 10.1l11.7-3.9c-.2 1.5-.3 3.1-.3 4.7c0 17.7 14.3 32 32 32s32-14.3 32-32z"></path></symbol><symbol id="face-meh"viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM176.4 176a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm128 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM160 336l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"></path></symbol><symbol id="face-smile"viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM164.1 325.5C182 346.2 212.6 368 256 368s74-21.8 91.9-42.5c5.8-6.7 15.9-7.4 22.6-1.6s7.4 15.9 1.6 22.6C349.8 372.1 311.1 400 256 400s-93.8-27.9-116.1-53.5c-5.8-6.7-5.1-16.8 1.6-22.6s16.8-5.1 22.6 1.6zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></symbol><symbol id="far-bell"viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416l400 0c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4l0-25.4c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112l0 25.4c0 47.9 13.9 94.6 39.7 134.6L72.3 368C98.1 328 112 281.3 112 233.4l0-25.4c0-61.9 50.1-112 112-112zm64 352l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></symbol><symbol id="far-bell-slash"viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L542.6 400c2.7-7.8 1.3-16.5-3.9-23l-14.9-18.6C495.5 322.9 480 278.8 480 233.4l0-33.4c0-75.8-55.5-138.6-128-150.1L352 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 17.9c-43.9 7-81.5 32.7-104.4 68.7L38.8 5.1zM221.7 148.4C239.6 117.1 273.3 96 312 96l8 0 8 0c57.4 0 104 46.6 104 104l0 33.4c0 32.7 6.4 64.8 18.7 94.5L221.7 148.4zM406.2 416l-60.9-48-176.9 0c21.2-32.8 34.4-70.3 38.4-109.1L160 222.1l0 11.4c0 45.4-15.5 89.5-43.8 124.9L101.3 377c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6l286.2 0zM384 448l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></symbol><symbol id="far-calendar-plus"viewBox="0 0 448 512"><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L64 64C28.7 64 0 92.7 0 128l0 16 0 48L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-256 0-48 0-16c0-35.3-28.7-64-64-64l-40 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L152 64l0-40zM48 192l352 0 0 256c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256zm176 40c-13.3 0-24 10.7-24 24l0 48-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l48 0 0 48c0 13.3 10.7 24 24 24s24-10.7 24-24l0-48 48 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-48c0-13.3-10.7-24-24-24z"></path></symbol><symbol id="far-chart-bar"viewBox="0 0 512 512"><path d="M24 32c13.3 0 24 10.7 24 24l0 352c0 13.3 10.7 24 24 24l416 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L72 480c-39.8 0-72-32.2-72-72L0 56C0 42.7 10.7 32 24 32zM128 136c0-13.3 10.7-24 24-24l208 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-208 0c-13.3 0-24-10.7-24-24zm24 72l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 96l272 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-272 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"></path></symbol><symbol id="far-circle"viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"></path></symbol><symbol id="far-circle-dot"viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"></path></symbol><symbol id="far-circle-question"viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"></path></symbol><symbol id="far-clipboard"viewBox="0 0 384 512"><path d="M280 64l40 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l40 0 9.6 0C121 27.5 153.3 0 192 0s71 27.5 78.4 64l9.6 0zM64 112c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16l-16 0 0 24c0 13.3-10.7 24-24 24l-88 0-88 0c-13.3 0-24-10.7-24-24l0-24-16 0zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path></symbol><symbol id="far-clock"viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"></path></symbol><symbol id="far-comment"viewBox="0 0 512 512"><path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9l.3-.5z"></path></symbol><symbol id="far-comments"viewBox="0 0 640 512"><path d="M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.8 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z"></path></symbol><symbol id="far-copy"viewBox="0 0 448 512"><path d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z"></path></symbol><symbol id="far-copyright"viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM199.4 312.6c-31.2-31.2-31.2-81.9 0-113.1s81.9-31.2 113.1 0c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9c-50-50-131-50-181 0s-50 131 0 181s131 50 181 0c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0c-31.2 31.2-81.9 31.2-113.1 0z"></path></symbol><symbol id="far-credit-card"viewBox="0 0 576 512"><path d="M512 80c8.8 0 16 7.2 16 16l0 32L48 128l0-32c0-8.8 7.2-16 16-16l448 0zm16 144l0 192c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16l0-192 480 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24l48 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0z"></path></symbol><symbol id="far-envelope"viewBox="0 0 512 512"><path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z"></path></symbol><symbol id="far-eye"viewBox="0 0 576 512"><path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"></path></symbol><symbol id="far-eye-slash"viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z"></path></symbol><symbol id="far-face-frown"viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM174.6 384.1c-4.5 12.5-18.2 18.9-30.7 14.4s-18.9-18.2-14.4-30.7C146.9 319.4 198.9 288 256 288s109.1 31.4 126.6 79.9c4.5 12.5-2 26.2-14.4 30.7s-26.2-2-30.7-14.4C328.2 358.5 297.2 336 256 336s-72.2 22.5-81.4 48.1zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></symbol><symbol id="far-face-meh"viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM176.4 240a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm192-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM184 328c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"></path></symbol><symbol id="far-face-smile"viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></symbol><symbol id="far-file-lines"viewBox="0 0 384 512"><path d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"></path></symbol><symbol id="far-heart"viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"></path></symbol><symbol id="far-image"viewBox="0 0 512 512"><path d="M448 80c8.8 0 16 7.2 16 16l0 319.8-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3L48 96c0-8.8 7.2-16 16-16l384 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"></path></symbol><symbol id="far-moon"viewBox="0 0 384 512"><path d="M144.7 98.7c-21 34.1-33.1 74.3-33.1 117.3c0 98 62.8 181.4 150.4 211.7c-12.4 2.8-25.3 4.3-38.6 4.3C126.6 432 48 353.3 48 256c0-68.9 39.4-128.4 96.8-157.3zm62.1-66C91.1 41.2 0 137.9 0 256C0 379.7 100 480 223.5 480c47.8 0 92-15 128.4-40.6c1.9-1.3 3.7-2.7 5.5-4c4.8-3.6 9.4-7.4 13.9-11.4c2.7-2.4 5.3-4.8 7.9-7.3c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-3.7 .6-7.4 1.2-11.1 1.6c-5 .5-10.1 .9-15.3 1c-1.2 0-2.5 0-3.7 0l-.3 0c-96.8-.2-175.2-78.9-175.2-176c0-54.8 24.9-103.7 64.1-136c1-.9 2.1-1.7 3.2-2.6c4-3.2 8.2-6.2 12.5-9c3.1-2 6.3-4 9.6-5.8c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-3.6-.3-7.1-.5-10.7-.6c-2.7-.1-5.5-.1-8.2-.1c-3.3 0-6.5 .1-9.8 .2c-2.3 .1-4.6 .2-6.9 .4z"></path></symbol><symbol id="far-pen-to-square"viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"></path></symbol><symbol id="far-rectangle-list"viewBox="0 0 576 512"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l448 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l448 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zm96 64a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm104 0c0-13.3 10.7-24 24-24l224 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-224 0c-13.3 0-24-10.7-24-24zm0 96c0-13.3 10.7-24 24-24l224 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-224 0c-13.3 0-24-10.7-24-24zm0 96c0-13.3 10.7-24 24-24l224 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-224 0c-13.3 0-24-10.7-24-24zm-72-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM96 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"></path></symbol><symbol id="far-square"viewBox="0 0 448 512"><path d="M384 80c8.8 0 16 7.2 16 16l0 320c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16L48 96c0-8.8 7.2-16 16-16l320 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z"></path></symbol><symbol id="far-square-check"viewBox="0 0 448 512"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></symbol><symbol id="far-star"viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"></path></symbol><symbol id="far-sun"viewBox="0 0 512 512"><path d="M375.7 19.7c-1.5-8-6.9-14.7-14.4-17.8s-16.1-2.2-22.8 2.4L256 61.1 173.5 4.2c-6.7-4.6-15.3-5.5-22.8-2.4s-12.9 9.8-14.4 17.8l-18.1 98.5L19.7 136.3c-8 1.5-14.7 6.9-17.8 14.4s-2.2 16.1 2.4 22.8L61.1 256 4.2 338.5c-4.6 6.7-5.5 15.3-2.4 22.8s9.8 13 17.8 14.4l98.5 18.1 18.1 98.5c1.5 8 6.9 14.7 14.4 17.8s16.1 2.2 22.8-2.4L256 450.9l82.5 56.9c6.7 4.6 15.3 5.5 22.8 2.4s12.9-9.8 14.4-17.8l18.1-98.5 98.5-18.1c8-1.5 14.7-6.9 17.8-14.4s2.2-16.1-2.4-22.8L450.9 256l56.9-82.5c4.6-6.7 5.5-15.3 2.4-22.8s-9.8-12.9-17.8-14.4l-98.5-18.1L375.7 19.7zM269.6 110l65.6-45.2 14.4 78.3c1.8 9.8 9.5 17.5 19.3 19.3l78.3 14.4L402 242.4c-5.7 8.2-5.7 19 0 27.2l45.2 65.6-78.3 14.4c-9.8 1.8-17.5 9.5-19.3 19.3l-14.4 78.3L269.6 402c-8.2-5.7-19-5.7-27.2 0l-65.6 45.2-14.4-78.3c-1.8-9.8-9.5-17.5-19.3-19.3L64.8 335.2 110 269.6c5.7-8.2 5.7-19 0-27.2L64.8 176.8l78.3-14.4c9.8-1.8 17.5-9.5 19.3-19.3l14.4-78.3L242.4 110c8.2 5.7 19 5.7 27.2 0zM256 368a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM192 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"></path></symbol><symbol id="far-thumbs-down"viewBox="0 0 512 512"><path d="M323.8 477.2c-38.2 10.9-78.1-11.2-89-49.4l-5.7-20c-3.7-13-10.4-25-19.5-35l-51.3-56.4c-8.9-9.8-8.2-25 1.6-33.9s25-8.2 33.9 1.6l51.3 56.4c14.1 15.5 24.4 34 30.1 54.1l5.7 20c3.6 12.7 16.9 20.1 29.7 16.5s20.1-16.9 16.5-29.7l-5.7-20c-5.7-19.9-14.7-38.7-26.6-55.5c-5.2-7.3-5.8-16.9-1.7-24.9s12.3-13 21.3-13L448 288c8.8 0 16-7.2 16-16c0-6.8-4.3-12.7-10.4-15c-7.4-2.8-13-9-14.9-16.7s.1-15.8 5.3-21.7c2.5-2.8 4-6.5 4-10.6c0-7.8-5.6-14.3-13-15.7c-8.2-1.6-15.1-7.3-18-15.2s-1.6-16.7 3.6-23.3c2.1-2.7 3.4-6.1 3.4-9.9c0-6.7-4.2-12.6-10.2-14.9c-11.5-4.5-17.7-16.9-14.4-28.8c.4-1.3 .6-2.8 .6-4.3c0-8.8-7.2-16-16-16l-97.5 0c-12.6 0-25 3.7-35.5 10.7l-61.7 41.1c-11 7.4-25.9 4.4-33.3-6.7s-4.4-25.9 6.7-33.3l61.7-41.1c18.4-12.3 40-18.8 62.1-18.8L384 32c34.7 0 62.9 27.6 64 62c14.6 11.7 24 29.7 24 50c0 4.5-.5 8.8-1.3 13c15.4 11.7 25.3 30.2 25.3 51c0 6.5-1 12.8-2.8 18.7C504.8 238.3 512 254.3 512 272c0 35.3-28.6 64-64 64l-92.3 0c4.7 10.4 8.7 21.2 11.8 32.2l5.7 20c10.9 38.2-11.2 78.1-49.4 89zM32 384c-17.7 0-32-14.3-32-32L0 128c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0z"></path></symbol><symbol id="far-thumbs-up"viewBox="0 0 512 512"><path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16l-97.5 0c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8l97.5 0c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0z"></path></symbol><symbol id="far-trash-can"viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z"></path></symbol><symbol id="faucet"viewBox="0 0 512 512"><path d="M192 96l0 12L96 96c-17.7 0-32 14.3-32 32s14.3 32 32 32l96-12 31-3.9 1-.1 1 .1 31 3.9 96 12c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 12 0-12c0-17.7-14.3-32-32-32s-32 14.3-32 32zM32 256c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l100.1 0c20.2 29 53.9 48 91.9 48s71.7-19 91.9-48l36.1 0c17.7 0 32 14.3 32 32s14.3 32 32 32l64 0c17.7 0 32-14.3 32-32c0-88.4-71.6-160-160-160l-32 0-22.6-22.6c-6-6-14.1-9.4-22.6-9.4L256 224l0-43.8-32-4-32 4 0 43.8-18.7 0c-8.5 0-16.6 3.4-22.6 9.4L128 256l-96 0z"></path></symbol><symbol id="file"viewBox="0 0 384 512"><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"></path></symbol><symbol id="file-arrow-up"viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM216 408c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-102.1-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31L216 408z"></path></symbol><symbol id="file-audio"viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zm2 226.3c37.1 22.4 62 63.1 62 109.7s-24.9 87.3-62 109.7c-7.6 4.6-17.4 2.1-22-5.4s-2.1-17.4 5.4-22C269.4 401.5 288 370.9 288 336s-18.6-65.5-46.5-82.3c-7.6-4.6-10-14.4-5.4-22s14.4-10 22-5.4zm-91.9 30.9c6 2.5 9.9 8.3 9.9 14.8l0 128c0 6.5-3.9 12.3-9.9 14.8s-12.9 1.1-17.4-3.5L113.4 376 80 376c-8.8 0-16-7.2-16-16l0-48c0-8.8 7.2-16 16-16l33.4 0 35.3-35.3c4.6-4.6 11.5-5.9 17.4-3.5zm51 34.9c6.6-5.9 16.7-5.3 22.6 1.3C249.8 304.6 256 319.6 256 336s-6.2 31.4-16.3 42.7c-5.9 6.6-16 7.1-22.6 1.3s-7.1-16-1.3-22.6c5.1-5.7 8.1-13.1 8.1-21.3s-3.1-15.7-8.1-21.3c-5.9-6.6-5.3-16.7 1.3-22.6z"></path></symbol><symbol id="file-code"viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM153 289l-31 31 31 31c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L71 337c-9.4-9.4-9.4-24.6 0-33.9l48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM265 255l48 48c9.4 9.4 9.4 24.6 0 33.9l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l31-31-31-31c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"></path></symbol><symbol id="file-csv"viewBox="0 0 512 512"><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM200 352l16 0c22.1 0 40 17.9 40 40l0 8c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-8c0-4.4-3.6-8-8-8l-16 0c-4.4 0-8 3.6-8 8l0 80c0 4.4 3.6 8 8 8l16 0c4.4 0 8-3.6 8-8l0-8c0-8.8 7.2-16 16-16s16 7.2 16 16l0 8c0 22.1-17.9 40-40 40l-16 0c-22.1 0-40-17.9-40-40l0-80c0-22.1 17.9-40 40-40zm133.1 0l34.9 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-34.9 0c-7.2 0-13.1 5.9-13.1 13.1c0 5.2 3 9.9 7.8 12l37.4 16.6c16.3 7.2 26.8 23.4 26.8 41.2c0 24.9-20.2 45.1-45.1 45.1L304 512c-8.8 0-16-7.2-16-16s7.2-16 16-16l42.9 0c7.2 0 13.1-5.9 13.1-13.1c0-5.2-3-9.9-7.8-12l-37.4-16.6c-16.3-7.2-26.8-23.4-26.8-41.2c0-24.9 20.2-45.1 45.1-45.1zm98.9 0c8.8 0 16 7.2 16 16l0 31.6c0 23 5.5 45.6 16 66c10.5-20.3 16-42.9 16-66l0-31.6c0-8.8 7.2-16 16-16s16 7.2 16 16l0 31.6c0 34.7-10.3 68.7-29.6 97.6l-5.1 7.7c-3 4.5-8 7.1-13.3 7.1s-10.3-2.7-13.3-7.1l-5.1-7.7c-19.3-28.9-29.6-62.9-29.6-97.6l0-31.6c0-8.8 7.2-16 16-16z"></path></symbol><symbol id="file-image"viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5s-8.2 8.6-14.2 8.6l-88 0-40 0-48 0-48 0c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2 .2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z"></path></symbol><symbol id="file-invoice"viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM80 64l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L80 96c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm16 96l192 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32L96 352c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32zm0 32l0 64 192 0 0-64L96 256zM240 416l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"></path></symbol><symbol id="file-lines"viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"></path></symbol><symbol id="file-signature"viewBox="0 0 576 512"><path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-19.3c-2.7 1.1-5.4 2-8.2 2.7l-60.1 15c-3 .7-6 1.2-9 1.4c-.9 .1-1.8 .2-2.7 .2l-64 0c-6.1 0-11.6-3.4-14.3-8.8l-8.8-17.7c-1.7-3.4-5.1-5.5-8.8-5.5s-7.2 2.1-8.8 5.5l-8.8 17.7c-2.9 5.9-9.2 9.4-15.7 8.8s-12.1-5.1-13.9-11.3L144 381l-9.8 32.8c-6.1 20.3-24.8 34.2-46 34.2L80 448c-8.8 0-16-7.2-16-16s7.2-16 16-16l8.2 0c7.1 0 13.3-4.6 15.3-11.4l14.9-49.5c3.4-11.3 13.8-19.1 25.6-19.1s22.2 7.8 25.6 19.1l11.6 38.6c7.4-6.2 16.8-9.7 26.8-9.7c15.9 0 30.4 9 37.5 23.2l4.4 8.8 8.9 0c-3.1-8.8-3.7-18.4-1.4-27.8l15-60.1c2.8-11.3 8.6-21.5 16.8-29.7L384 203.6l0-43.6-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM549.8 139.7c-15.6-15.6-40.9-15.6-56.6 0l-29.4 29.4 71 71 29.4-29.4c15.6-15.6 15.6-40.9 0-56.6l-14.4-14.4zM311.9 321c-4.1 4.1-7 9.2-8.4 14.9l-15 60.1c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2l60.1-15c5.6-1.4 10.8-4.3 14.9-8.4L512.1 262.7l-71-71L311.9 321z"></path></symbol><symbol id="file-video"viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM64 288c0-17.7 14.3-32 32-32l96 0c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32l0-96zM300.9 397.9L256 368l0-64 44.9-29.9c2-1.3 4.4-2.1 6.8-2.1c6.8 0 12.3 5.5 12.3 12.3l0 103.4c0 6.8-5.5 12.3-12.3 12.3c-2.4 0-4.8-.7-6.8-2.1z"></path></symbol><symbol id="filter"viewBox="0 0 512 512"><path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"></path></symbol><symbol id="flag"viewBox="0 0 448 512"><path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32L0 64 0 368 0 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30l0-247.7c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48l0-16z"></path></symbol><symbol id="flask"viewBox="0 0 448 512"><path d="M288 0L160 0 128 0C110.3 0 96 14.3 96 32s14.3 32 32 32l0 132.8c0 11.8-3.3 23.5-9.5 33.5L10.3 406.2C3.6 417.2 0 429.7 0 442.6C0 480.9 31.1 512 69.4 512l309.2 0c38.3 0 69.4-31.1 69.4-69.4c0-12.8-3.6-25.4-10.3-36.4L329.5 230.4c-6.2-10.1-9.5-21.7-9.5-33.5L320 64c17.7 0 32-14.3 32-32s-14.3-32-32-32L288 0zM192 196.8L192 64l64 0 0 132.8c0 23.7 6.6 46.9 19 67.1L309.5 320l-171 0L173 263.9c12.4-20.2 19-43.4 19-67.1z"></path></symbol><symbol id="floppy-disk"viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm0 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32L96 224c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></symbol><symbol id="folder"viewBox="0 0 512 512"><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z"></path></symbol><symbol id="folder-open"viewBox="0 0 576 512"><path d="M88.7 223.8L0 375.8 0 96C0 60.7 28.7 32 64 32l117.5 0c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7L416 96c35.3 0 64 28.7 64 64l0 32-336 0c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224l400 0c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480L32 480c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z"></path></symbol><symbol id="font"viewBox="0 0 448 512"><path d="M254 52.8C249.3 40.3 237.3 32 224 32s-25.3 8.3-30 20.8L57.8 416 32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-1.8 0 18-48 159.6 0 18 48-1.8 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-25.8 0L254 52.8zM279.8 304l-111.6 0L224 155.1 279.8 304z"></path></symbol><symbol id="forward"viewBox="0 0 512 512"><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416L0 96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3l0 41.7 0 41.7L52.5 440.6zM256 352l0-96 0-128 0-32c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29l0-64z"></path></symbol><symbol id="forward-fast"viewBox="0 0 512 512"><path d="M18.4 445c11.2 5.3 24.5 3.6 34.1-4.4L224 297.7 224 416c0 12.4 7.2 23.7 18.4 29s24.5 3.6 34.1-4.4L448 297.7 448 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 118.3L276.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S224 83.6 224 96l0 118.3L52.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S0 83.6 0 96L0 416c0 12.4 7.2 23.7 18.4 29z"></path></symbol><symbol id="forward-step"viewBox="0 0 320 512"><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416L0 96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241l0-145c0-17.7 14.3-32 32-32s32 14.3 32 32l0 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-145-11.5 9.6-192 160z"></path></symbol><symbol id="gamepad"viewBox="0 0 640 512"><path d="M192 64C86 64 0 150 0 256S86 448 192 448l256 0c106 0 192-86 192-192s-86-192-192-192L192 64zM496 168a40 40 0 1 1 0 80 40 40 0 1 1 0-80zM392 304a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zM168 200c0-13.3 10.7-24 24-24s24 10.7 24 24l0 32 32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0 0 32c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-32-32 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l32 0 0-32z"></path></symbol><symbol id="gavel"viewBox="0 0 512 512"><path d="M318.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-120 120c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l4-4L325.4 293.4l-4 4c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l120-120c12.5-12.5 12.5-32.8 0-45.3l-16-16c-12.5-12.5-32.8-12.5-45.3 0l-4 4L330.6 74.6l4-4c12.5-12.5 12.5-32.8 0-45.3l-16-16zm-152 288c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l48 48c12.5 12.5 32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-1.4-1.4L272 285.3 226.7 240 168 298.7l-1.4-1.4z"></path></symbol><symbol id="gear"viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"></path></symbol><symbol id="gears"viewBox="0 0 640 512"><path d="M308.5 135.3c7.1-6.3 9.9-16.2 6.2-25c-2.3-5.3-4.8-10.5-7.6-15.5L304 89.4c-3-5-6.3-9.9-9.8-14.6c-5.7-7.6-15.7-10.1-24.7-7.1l-28.2 9.3c-10.7-8.8-23-16-36.2-20.9L199 27.1c-1.9-9.3-9.1-16.7-18.5-17.8C173.9 8.4 167.2 8 160.4 8l-.7 0c-6.8 0-13.5 .4-20.1 1.2c-9.4 1.1-16.6 8.6-18.5 17.8L115 56.1c-13.3 5-25.5 12.1-36.2 20.9L50.5 67.8c-9-3-19-.5-24.7 7.1c-3.5 4.7-6.8 9.6-9.9 14.6l-3 5.3c-2.8 5-5.3 10.2-7.6 15.6c-3.7 8.7-.9 18.6 6.2 25l22.2 19.8C32.6 161.9 32 168.9 32 176s.6 14.1 1.7 20.9L11.5 216.7c-7.1 6.3-9.9 16.2-6.2 25c2.3 5.3 4.8 10.5 7.6 15.6l3 5.2c3 5.1 6.3 9.9 9.9 14.6c5.7 7.6 15.7 10.1 24.7 7.1l28.2-9.3c10.7 8.8 23 16 36.2 20.9l6.1 29.1c1.9 9.3 9.1 16.7 18.5 17.8c6.7 .8 13.5 1.2 20.4 1.2s13.7-.4 20.4-1.2c9.4-1.1 16.6-8.6 18.5-17.8l6.1-29.1c13.3-5 25.5-12.1 36.2-20.9l28.2 9.3c9 3 19 .5 24.7-7.1c3.5-4.7 6.8-9.5 9.8-14.6l3.1-5.4c2.8-5 5.3-10.2 7.6-15.5c3.7-8.7 .9-18.6-6.2-25l-22.2-19.8c1.1-6.8 1.7-13.8 1.7-20.9s-.6-14.1-1.7-20.9l22.2-19.8zM112 176a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM504.7 500.5c6.3 7.1 16.2 9.9 25 6.2c5.3-2.3 10.5-4.8 15.5-7.6l5.4-3.1c5-3 9.9-6.3 14.6-9.8c7.6-5.7 10.1-15.7 7.1-24.7l-9.3-28.2c8.8-10.7 16-23 20.9-36.2l29.1-6.1c9.3-1.9 16.7-9.1 17.8-18.5c.8-6.7 1.2-13.5 1.2-20.4s-.4-13.7-1.2-20.4c-1.1-9.4-8.6-16.6-17.8-18.5L583.9 307c-5-13.3-12.1-25.5-20.9-36.2l9.3-28.2c3-9 .5-19-7.1-24.7c-4.7-3.5-9.6-6.8-14.6-9.9l-5.3-3c-5-2.8-10.2-5.3-15.6-7.6c-8.7-3.7-18.6-.9-25 6.2l-19.8 22.2c-6.8-1.1-13.8-1.7-20.9-1.7s-14.1 .6-20.9 1.7l-19.8-22.2c-6.3-7.1-16.2-9.9-25-6.2c-5.3 2.3-10.5 4.8-15.6 7.6l-5.2 3c-5.1 3-9.9 6.3-14.6 9.9c-7.6 5.7-10.1 15.7-7.1 24.7l9.3 28.2c-8.8 10.7-16 23-20.9 36.2L315.1 313c-9.3 1.9-16.7 9.1-17.8 18.5c-.8 6.7-1.2 13.5-1.2 20.4s.4 13.7 1.2 20.4c1.1 9.4 8.6 16.6 17.8 18.5l29.1 6.1c5 13.3 12.1 25.5 20.9 36.2l-9.3 28.2c-3 9-.5 19 7.1 24.7c4.7 3.5 9.5 6.8 14.6 9.8l5.4 3.1c5 2.8 10.2 5.3 15.5 7.6c8.7 3.7 18.6 .9 25-6.2l19.8-22.2c6.8 1.1 13.8 1.7 20.9 1.7s14.1-.6 20.9-1.7l19.8 22.2zM464 304a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path></symbol><symbol id="gift"viewBox="0 0 512 512"><path d="M190.5 68.8L225.3 128l-1.3 0-72 0c-22.1 0-40-17.9-40-40s17.9-40 40-40l2.2 0c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40L32 128c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l448 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-41.6 0c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88l-2.2 0c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0L152 0C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40l-72 0-1.3 0 34.8-59.2C329.1 55.9 342.9 48 357.8 48l2.2 0c22.1 0 40 17.9 40 40zM32 288l0 176c0 26.5 21.5 48 48 48l144 0 0-224L32 288zM288 512l144 0c26.5 0 48-21.5 48-48l0-176-192 0 0 224z"></path></symbol><symbol id="globe"viewBox="0 0 512 512"><path d="M352 256c0 22.2-1.2 43.6-3.3 64l-185.3 0c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64l185.3 0c2.2 20.4 3.3 41.8 3.3 64zm28.8-64l123.1 0c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64l-123.1 0c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32l-116.7 0c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0l-176.6 0c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0L18.6 160C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192l123.1 0c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64L8.1 320C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6l176.6 0c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352l116.7 0zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6l116.7 0z"></path></symbol><symbol id="grip-lines"viewBox="0 0 448 512"><path d="M32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 288zm0-128c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z"></path></symbol><symbol id="hand-holding-dollar"viewBox="0 0 576 512"><path d="M312 24l0 10.5c6.4 1.2 12.6 2.7 18.2 4.2c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17c-10.9-2.9-21.1-4.9-30.2-5c-7.3-.1-14.7 1.7-19.4 4.4c-2.1 1.3-3.1 2.4-3.5 3c-.3 .5-.7 1.2-.7 2.8c0 .3 0 .5 0 .6c.2 .2 .9 1.2 3.3 2.6c5.8 3.5 14.4 6.2 27.4 10.1l.9 .3s0 0 0 0c11.1 3.3 25.9 7.8 37.9 15.3c13.7 8.6 26.1 22.9 26.4 44.9c.3 22.5-11.4 38.9-26.7 48.5c-6.7 4.1-13.9 7-21.3 8.8l0 10.6c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-11.4c-9.5-2.3-18.2-5.3-25.6-7.8c-2.1-.7-4.1-1.4-6-2c-12.6-4.2-19.4-17.8-15.2-30.4s17.8-19.4 30.4-15.2c2.6 .9 5 1.7 7.3 2.5c13.6 4.6 23.4 7.9 33.9 8.3c8 .3 15.1-1.6 19.2-4.1c1.9-1.2 2.8-2.2 3.2-2.9c.4-.6 .9-1.8 .8-4.1l0-.2c0-1 0-2.1-4-4.6c-5.7-3.6-14.3-6.4-27.1-10.3l-1.9-.6c-10.8-3.2-25-7.5-36.4-14.4c-13.5-8.1-26.5-22-26.6-44.1c-.1-22.9 12.9-38.6 27.7-47.4c6.4-3.8 13.3-6.4 20.2-8.2L264 24c0-13.3 10.7-24 24-24s24 10.7 24 24zM568.2 336.3c13.1 17.8 9.3 42.8-8.5 55.9L433.1 485.5c-23.4 17.2-51.6 26.5-80.7 26.5L192 512 32 512c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l36.8 0 44.9-36c22.7-18.2 50.9-28 80-28l78.3 0 16 0 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0-16 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l120.6 0 119.7-88.2c17.8-13.1 42.8-9.3 55.9 8.5zM193.6 384c0 0 0 0 0 0l-.9 0c.3 0 .6 0 .9 0z"></path></symbol><symbol id="hand-point-right"viewBox="0 0 512 512"><path d="M480 96c17.7 0 32 14.3 32 32s-14.3 32-32 32l-208 0 0-64 208 0zM320 288c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0zm64-64c0 17.7-14.3 32-32 32l-48 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l48 0c17.7 0 32 14.3 32 32zM288 384c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0zm-88-96l.6 0c-5.4 9.4-8.6 20.3-8.6 32c0 13.2 4 25.4 10.8 35.6C177.9 364.3 160 388.1 160 416c0 11.7 3.1 22.6 8.6 32l-8.6 0C71.6 448 0 376.4 0 288l0-61.7c0-42.4 16.9-83.1 46.9-113.1l11.6-11.6C82.5 77.5 115.1 64 149 64l27 0c35.3 0 64 28.7 64 64l0 88c0 22.1-17.9 40-40 40s-40-17.9-40-40l0-56c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 56c0 39.8 32.2 72 72 72z"></path></symbol><symbol id="hands-praying"viewBox="0 0 640 512"><path d="M351.2 4.8c3.2-2 6.6-3.3 10-4.1c4.7-1 9.6-.9 14.1 .1c7.7 1.8 14.8 6.5 19.4 13.6L514.6 194.2c8.8 13.1 13.4 28.6 13.4 44.4l0 73.5c0 6.9 4.4 13 10.9 15.2l79.2 26.4C631.2 358 640 370.2 640 384l0 96c0 9.9-4.6 19.3-12.5 25.4s-18.1 8.1-27.7 5.5L431 465.9c-56-14.9-95-65.7-95-123.7L336 224c0-17.7 14.3-32 32-32s32 14.3 32 32l0 80c0 8.8 7.2 16 16 16s16-7.2 16-16l0-84.9c0-7-1.8-13.8-5.3-19.8L340.3 48.1c-1.7-3-2.9-6.1-3.6-9.3c-1-4.7-1-9.6 .1-14.1c1.9-8 6.8-15.2 14.3-19.9zm-62.4 0c7.5 4.6 12.4 11.9 14.3 19.9c1.1 4.6 1.2 9.4 .1 14.1c-.7 3.2-1.9 6.3-3.6 9.3L213.3 199.3c-3.5 6-5.3 12.9-5.3 19.8l0 84.9c0 8.8 7.2 16 16 16s16-7.2 16-16l0-80c0-17.7 14.3-32 32-32s32 14.3 32 32l0 118.2c0 58-39 108.7-95 123.7l-168.7 45c-9.6 2.6-19.9 .5-27.7-5.5S0 490 0 480l0-96c0-13.8 8.8-26 21.9-30.4l79.2-26.4c6.5-2.2 10.9-8.3 10.9-15.2l0-73.5c0-15.8 4.7-31.2 13.4-44.4L245.2 14.5c4.6-7.1 11.7-11.8 19.4-13.6c4.6-1.1 9.4-1.2 14.1-.1c3.5 .8 6.9 2.1 10 4.1z"></path></symbol><symbol id="handshake-angle"viewBox="0 0 640 512"><path d="M544 248l0 3.3 69.7-69.7c21.9-21.9 21.9-57.3 0-79.2L535.6 24.4c-21.9-21.9-57.3-21.9-79.2 0L416.3 64.5c-2.7-.3-5.5-.5-8.3-.5L296 64c-37.1 0-67.6 28-71.6 64l-.4 0 0 120c0 22.1 17.9 40 40 40s40-17.9 40-40l0-72c0 0 0-.1 0-.1l0-15.9 16 0 136 0c0 0 0 0 .1 0l7.9 0c44.2 0 80 35.8 80 80l0 8zM336 192l0 56c0 39.8-32.2 72-72 72s-72-32.2-72-72l0-118.6c-35.9 6.2-65.8 32.3-76 68.2L99.5 255.2 26.3 328.4c-21.9 21.9-21.9 57.3 0 79.2l78.1 78.1c21.9 21.9 57.3 21.9 79.2 0l37.7-37.7c.9 0 1.8 .1 2.7 .1l160 0c26.5 0 48-21.5 48-48c0-5.6-1-11-2.7-16l2.7 0c26.5 0 48-21.5 48-48c0-12.8-5-24.4-13.2-33c25.7-5 45.1-27.6 45.2-54.8l0-.4c-.1-30.8-25.1-55.8-56-55.8c0 0 0 0 0 0l-120 0z"></path></symbol><symbol id="hashtag"viewBox="0 0 448 512"><path d="M181.3 32.4c17.4 2.9 29.2 19.4 26.3 36.8L197.8 128l95.1 0 11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3s29.2 19.4 26.3 36.8L357.8 128l58.2 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-68.9 0L325.8 320l58.2 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-68.9 0-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.8-58.7-95.1 0-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8L90.2 384 32 384c-17.7 0-32-14.3-32-32s14.3-32 32-32l68.9 0 21.3-128L64 192c-17.7 0-32-14.3-32-32s14.3-32 32-32l68.9 0 11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3zM187.1 192L165.8 320l95.1 0 21.3-128-95.1 0z"></path></symbol><symbol id="headset"viewBox="0 0 512 512"><path d="M256 48C141.1 48 48 141.1 48 256l0 40c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-40C0 114.6 114.6 0 256 0S512 114.6 512 256l0 144.1c0 48.6-39.4 88-88.1 88L313.6 488c-8.3 14.3-23.8 24-41.6 24l-32 0c-26.5 0-48-21.5-48-48s21.5-48 48-48l32 0c17.8 0 33.3 9.7 41.6 24l110.4 .1c22.1 0 40-17.9 40-40L464 256c0-114.9-93.1-208-208-208zM144 208l16 0c17.7 0 32 14.3 32 32l0 112c0 17.7-14.3 32-32 32l-16 0c-35.3 0-64-28.7-64-64l0-48c0-35.3 28.7-64 64-64zm224 0c35.3 0 64 28.7 64 64l0 48c0 35.3-28.7 64-64 64l-16 0c-17.7 0-32-14.3-32-32l0-112c0-17.7 14.3-32 32-32l16 0z"></path></symbol><symbol id="heart"viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"></path></symbol><symbol id="heart-pulse"viewBox="0 0 512 512"><path d="M228.3 469.1L47.6 300.4c-4.2-3.9-8.2-8.1-11.9-12.4l87 0c22.6 0 43-13.6 51.7-34.5l10.5-25.2 49.3 109.5c3.8 8.5 12.1 14 21.4 14.1s17.8-5 22-13.3L320 253.7l1.7 3.4c9.5 19 28.9 31 50.1 31l104.5 0c-3.7 4.3-7.7 8.5-11.9 12.4L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9zM503.7 240l-132 0c-3 0-5.8-1.7-7.2-4.4l-23.2-46.3c-4.1-8.1-12.4-13.3-21.5-13.3s-17.4 5.1-21.5 13.3l-41.4 82.8L205.9 158.2c-3.9-8.7-12.7-14.3-22.2-14.1s-18.1 5.9-21.8 14.8l-31.8 76.3c-1.2 3-4.2 4.9-7.4 4.9L16 240c-2.6 0-5 .4-7.3 1.1C3 225.2 0 208.2 0 190.9l0-5.8c0-69.9 50.5-129.5 119.4-141C165 36.5 211.4 51.4 244 84l12 12 12-12c32.6-32.6 79-47.5 124.6-39.9C461.5 55.6 512 115.2 512 185.1l0 5.8c0 16.9-2.8 33.5-8.3 49.1z"></path></symbol><symbol id="hourglass-start"viewBox="0 0 384 512"><path d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64l0 11c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437l0 11c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 256 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-11c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1l0-11c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 0 64 0 32 0zM288 437l0 11L96 448l0-11c0-25.5 10.1-49.9 28.1-67.9L192 301.3l67.9 67.9c18 18 28.1 42.4 28.1 67.9z"></path></symbol><symbol id="house"viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"></path></symbol><symbol id="id-card"viewBox="0 0 576 512"><path d="M0 96l576 0c0-35.3-28.7-64-64-64L64 32C28.7 32 0 60.7 0 96zm0 32L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-288L0 128zM64 405.3c0-29.5 23.9-53.3 53.3-53.3l117.3 0c29.5 0 53.3 23.9 53.3 53.3c0 5.9-4.8 10.7-10.7 10.7L74.7 416c-5.9 0-10.7-4.8-10.7-10.7zM176 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm176 16c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z"></path></symbol><symbol id="image"viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6l96 0 32 0 208 0c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"></path></symbol><symbol id="images"viewBox="0 0 576 512"><path d="M160 32c-35.3 0-64 28.7-64 64l0 224c0 35.3 28.7 64 64 64l352 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L160 32zM396 138.7l96 144c4.9 7.4 5.4 16.8 1.2 24.6S480.9 320 472 320l-144 0-48 0-80 0c-9.2 0-17.6-5.3-21.6-13.6s-2.9-18.2 2.9-25.4l64-80c4.6-5.7 11.4-9 18.7-9s14.2 3.3 18.7 9l17.3 21.6 56-84C360.5 132 368 128 376 128s15.5 4 20 10.7zM192 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120L0 344c0 75.1 60.9 136 136 136l320 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-320 0c-48.6 0-88-39.4-88-88l0-224z"></path></symbol><symbol id="inbox"viewBox="0 0 512 512"><path d="M121 32C91.6 32 66 52 58.9 80.5L1.9 308.4C.6 313.5 0 318.7 0 323.9L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-92.1c0-5.2-.6-10.4-1.9-15.5l-57-227.9C446 52 420.4 32 391 32L121 32zm0 64l270 0 48 192-51.2 0c-12.1 0-23.2 6.8-28.6 17.7l-14.3 28.6c-5.4 10.8-16.5 17.7-28.6 17.7l-120.4 0c-12.1 0-23.2-6.8-28.6-17.7l-14.3-28.6c-5.4-10.8-16.5-17.7-28.6-17.7L73 288 121 96z"></path></symbol><symbol id="info"viewBox="0 0 192 512"><path d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 224 32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0 0-192-32 0c-17.7 0-32-14.3-32-32z"></path></symbol><symbol id="italic"viewBox="0 0 384 512"><path d="M128 64c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-58.7 0L160 416l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l58.7 0L224 96l-64 0c-17.7 0-32-14.3-32-32z"></path></symbol><symbol id="key"viewBox="0 0 512 512"><path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17l0 80c0 13.3 10.7 24 24 24l80 0c13.3 0 24-10.7 24-24l0-40 40 0c13.3 0 24-10.7 24-24l0-40 40 0c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"></path></symbol><symbol id="keyboard"viewBox="0 0 576 512"><path d="M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zm16 64l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm16 80l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80-176c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm16 80l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM160 336c0-8.8 7.2-16 16-16l224 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-224 0c-8.8 0-16-7.2-16-16l0-32zM272 128l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM256 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM368 128l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM352 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM464 128l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM448 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm16 80l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z"></path></symbol><symbol id="language"viewBox="0 0 640 512"><path d="M0 128C0 92.7 28.7 64 64 64l192 0 48 0 16 0 256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64l-256 0-16 0-48 0L64 448c-35.3 0-64-28.7-64-64L0 128zm320 0l0 256 256 0 0-256-256 0zM178.3 175.9c-3.2-7.2-10.4-11.9-18.3-11.9s-15.1 4.7-18.3 11.9l-64 144c-4.5 10.1 .1 21.9 10.2 26.4s21.9-.1 26.4-10.2l8.9-20.1 73.6 0 8.9 20.1c4.5 10.1 16.3 14.6 26.4 10.2s14.6-16.3 10.2-26.4l-64-144zM160 233.2L179 276l-38 0 19-42.8zM448 164c11 0 20 9 20 20l0 4 44 0 16 0c11 0 20 9 20 20s-9 20-20 20l-2 0-1.6 4.5c-8.9 24.4-22.4 46.6-39.6 65.4c.9 .6 1.8 1.1 2.7 1.6l18.9 11.3c9.5 5.7 12.5 18 6.9 27.4s-18 12.5-27.4 6.9l-18.9-11.3c-4.5-2.7-8.8-5.5-13.1-8.5c-10.6 7.5-21.9 14-34 19.4l-3.6 1.6c-10.1 4.5-21.9-.1-26.4-10.2s.1-21.9 10.2-26.4l3.6-1.6c6.4-2.9 12.6-6.1 18.5-9.8l-12.2-12.2c-7.8-7.8-7.8-20.5 0-28.3s20.5-7.8 28.3 0l14.6 14.6 .5 .5c12.4-13.1 22.5-28.3 29.8-45L448 228l-72 0c-11 0-20-9-20-20s9-20 20-20l52 0 0-4c0-11 9-20 20-20z"></path></symbol><symbol id="layer-group"viewBox="0 0 576 512"><path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"></path></symbol><symbol id="left-right"viewBox="0 0 512 512"><path d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22l0 56-192 0 0-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22l0-56 192 0 0 56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"></path></symbol><symbol id="link"viewBox="0 0 640 512"><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"></path></symbol><symbol id="link-slash"viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L489.3 358.2l90.5-90.5c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114l-96 96-31.9-25C430.9 239.6 420.1 175.1 377 132c-52.2-52.3-134.5-56.2-191.3-11.7L38.8 5.1zM239 162c30.1-14.9 67.7-9.9 92.8 15.3c20 20 27.5 48.3 21.7 74.5L239 162zM406.6 416.4L220.9 270c-2.1 39.8 12.2 80.1 42.2 110c38.9 38.9 94.4 51 143.6 36.3zm-290-228.5L60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5l61.8-61.8-50.6-39.9z"></path></symbol><symbol id="list"viewBox="0 0 512 512"><path d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"></path></symbol><symbol id="list-check"viewBox="0 0 512 512"><path d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113C-2.3 103.6-2.3 88.4 7 79s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zM160 416c0-17.7 14.3-32 32-32l288 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-288 0c-17.7 0-32-14.3-32-32zM48 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path></symbol><symbol id="list-ol"viewBox="0 0 512 512"><path d="M24 56c0-13.3 10.7-24 24-24l32 0c13.3 0 24 10.7 24 24l0 120 16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l16 0 0-96-8 0C34.7 80 24 69.3 24 56zM86.7 341.2c-6.5-7.4-18.3-6.9-24 1.2L51.5 357.9c-7.7 10.8-22.7 13.3-33.5 5.6s-13.3-22.7-5.6-33.5l11.1-15.6c23.7-33.2 72.3-35.6 99.2-4.9c21.3 24.4 20.8 60.9-1.1 84.7L86.8 432l33.2 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-88 0c-9.5 0-18.2-5.6-22-14.4s-2.1-18.9 4.3-25.9l72-78c5.3-5.8 5.4-14.6 .3-20.5zM224 64l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path></symbol><symbol id="list-ul"viewBox="0 0 512 512"><path d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"></path></symbol><symbol id="location-dot"viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></symbol><symbol id="lock"viewBox="0 0 448 512"><path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"></path></symbol><symbol id="magnifying-glass"viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></symbol><symbol id="magnifying-glass-minus"viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM136 184c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"></path></symbol><symbol id="magnifying-glass-plus"viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM184 296c0 13.3 10.7 24 24 24s24-10.7 24-24l0-64 64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-64 0 0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64-64 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l64 0 0 64z"></path></symbol><symbol id="mask"viewBox="0 0 576 512"><path d="M288 64C64 64 0 160 0 272S80 448 176 448l8.4 0c24.2 0 46.4-13.7 57.2-35.4l23.2-46.3c4.4-8.8 13.3-14.3 23.2-14.3s18.8 5.5 23.2 14.3l23.2 46.3c10.8 21.7 33 35.4 57.2 35.4l8.4 0c96 0 176-64 176-176s-64-208-288-208zM96 256a64 64 0 1 1 128 0A64 64 0 1 1 96 256zm320-64a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></symbol><symbol id="masks-theater"viewBox="0 0 640 512"><path d="M74.6 373.2c41.7 36.1 108 82.5 166.1 73.7c6.1-.9 12.1-2.5 18-4.5c-9.2-12.3-17.3-24.4-24.2-35.4c-21.9-35-28.8-75.2-25.9-113.6c-20.6 4.1-39.2 13-54.7 25.4c-6.5 5.2-16.3 1.3-14.8-7c6.4-33.5 33-60.9 68.2-66.3c2.6-.4 5.3-.7 7.9-.8l19.4-131.3c2-13.8 8-32.7 25-45.9C278.2 53.2 310.5 37 363.2 32.2c-.8-.7-1.6-1.4-2.4-2.1C340.6 14.5 288.4-11.5 175.7 5.6S20.5 63 5.7 83.9C0 91.9-.8 102 .6 111.8L24.8 276.1c5.5 37.3 21.5 72.6 49.8 97.2zm87.7-219.6c4.4-3.1 10.8-2 11.8 3.3c.1 .5 .2 1.1 .3 1.6c3.2 21.8-11.6 42-33.1 45.3s-41.5-11.8-44.7-33.5c-.1-.5-.1-1.1-.2-1.6c-.6-5.4 5.2-8.4 10.3-6.7c9 3 18.8 3.9 28.7 2.4s19.1-5.3 26.8-10.8zM261.6 390c29.4 46.9 79.5 110.9 137.6 119.7s124.5-37.5 166.1-73.7c28.3-24.5 44.3-59.8 49.8-97.2l24.2-164.3c1.4-9.8 .6-19.9-5.1-27.9c-14.8-20.9-57.3-61.2-170-78.3S299.4 77.2 279.2 92.8c-7.8 6-11.5 15.4-12.9 25.2L242.1 282.3c-5.5 37.3-.4 75.8 19.6 107.7zM404.5 235.3c-7.7-5.5-16.8-9.3-26.8-10.8s-19.8-.6-28.7 2.4c-5.1 1.7-10.9-1.3-10.3-6.7c.1-.5 .1-1.1 .2-1.6c3.2-21.8 23.2-36.8 44.7-33.5s36.3 23.5 33.1 45.3c-.1 .5-.2 1.1-.3 1.6c-1 5.3-7.4 6.4-11.8 3.3zm136.2 15.5c-1 5.3-7.4 6.4-11.8 3.3c-7.7-5.5-16.8-9.3-26.8-10.8s-19.8-.6-28.7 2.4c-5.1 1.7-10.9-1.3-10.3-6.7c.1-.5 .1-1.1 .2-1.6c3.2-21.8 23.2-36.8 44.7-33.5s36.3 23.5 33.1 45.3c-.1 .5-.2 1.1-.3 1.6zM530 350.2c-19.6 44.7-66.8 72.5-116.8 64.9s-87.1-48.2-93-96.7c-1-8.3 8.9-12.1 15.2-6.7c23.9 20.8 53.6 35.3 87 40.3s66.1 .1 94.9-12.8c7.6-3.4 16 3.2 12.6 10.9z"></path></symbol><symbol id="medal"viewBox="0 0 512 512"><path d="M4.1 38.2C1.4 34.2 0 29.4 0 24.6C0 11 11 0 24.6 0L133.9 0c11.2 0 21.7 5.9 27.4 15.5l68.5 114.1c-48.2 6.1-91.3 28.6-123.4 61.9L4.1 38.2zm503.7 0L405.6 191.5c-32.1-33.3-75.2-55.8-123.4-61.9L350.7 15.5C356.5 5.9 366.9 0 378.1 0L487.4 0C501 0 512 11 512 24.6c0 4.8-1.4 9.6-4.1 13.6zM80 336a176 176 0 1 1 352 0A176 176 0 1 1 80 336zm184.4-94.9c-3.4-7-13.3-7-16.8 0l-22.4 45.4c-1.4 2.8-4 4.7-7 5.1L168 298.9c-7.7 1.1-10.7 10.5-5.2 16l36.3 35.4c2.2 2.2 3.2 5.2 2.7 8.3l-8.6 49.9c-1.3 7.6 6.7 13.5 13.6 9.9l44.8-23.6c2.7-1.4 6-1.4 8.7 0l44.8 23.6c6.9 3.6 14.9-2.2 13.6-9.9l-8.6-49.9c-.5-3 .5-6.1 2.7-8.3l36.3-35.4c5.6-5.4 2.5-14.8-5.2-16l-50.1-7.3c-3-.4-5.7-2.4-7-5.1l-22.4-45.4z"></path></symbol><symbol id="microchip"viewBox="0 0 512 512"><path d="M176 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c-35.3 0-64 28.7-64 64l-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0 0 56-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0 0 56-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0c0 35.3 28.7 64 64 64l0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40 56 0 0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40 56 0 0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40c35.3 0 64-28.7 64-64l40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0 0-56 40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0 0-56 40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0c0-35.3-28.7-64-64-64l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40-56 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40-56 0 0-40zM160 128l192 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32l0-192c0-17.7 14.3-32 32-32zm192 32l-192 0 0 192 192 0 0-192z"></path></symbol><symbol id="microphone"viewBox="0 0 384 512"><path d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z"></path></symbol><symbol id="microphone-slash"viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 21.2-5.1 41.1-14.2 58.7L416 300.8 416 96c0-53-43-96-96-96s-96 43-96 96l0 54.3L38.8 5.1zM344 430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128l0-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6z"></path></symbol><symbol id="minus"viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"></path></symbol><symbol id="mobile"viewBox="0 0 384 512"><path d="M80 0C44.7 0 16 28.7 16 64l0 384c0 35.3 28.7 64 64 64l224 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L80 0zm80 432l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"></path></symbol><symbol id="mobile-screen-button"viewBox="0 0 384 512"><path d="M16 64C16 28.7 44.7 0 80 0L304 0c35.3 0 64 28.7 64 64l0 384c0 35.3-28.7 64-64 64L80 512c-35.3 0-64-28.7-64-64L16 64zM224 448a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM304 64L80 64l0 320 224 0 0-320z"></path></symbol><symbol id="moon"viewBox="0 0 384 512"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path></symbol><symbol id="music"viewBox="0 0 512 512"><path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7l0 72 0 264c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L448 147 192 223.8 192 432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L128 200l0-72c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"></path></symbol><symbol id="network-wired"viewBox="0 0 640 512"><path d="M256 64l128 0 0 64-128 0 0-64zM240 0c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48l48 0 0 32L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0 0 32-48 0c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48l160 0c26.5 0 48-21.5 48-48l0-96c0-26.5-21.5-48-48-48l-48 0 0-32 256 0 0 32-48 0c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48l160 0c26.5 0 48-21.5 48-48l0-96c0-26.5-21.5-48-48-48l-48 0 0-32 96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-256 0 0-32 48 0c26.5 0 48-21.5 48-48l0-96c0-26.5-21.5-48-48-48L240 0zM96 448l0-64 128 0 0 64L96 448zm320-64l128 0 0 64-128 0 0-64z"></path></symbol><symbol id="newspaper"viewBox="0 0 512 512"><path d="M96 96c0-35.3 28.7-64 64-64l288 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L80 480c-44.2 0-80-35.8-80-80L0 128c0-17.7 14.3-32 32-32s32 14.3 32 32l0 272c0 8.8 7.2 16 16 16s16-7.2 16-16L96 96zm64 24l0 80c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24l0-80c0-13.3-10.7-24-24-24L184 96c-13.3 0-24 10.7-24 24zm208-8c0 8.8 7.2 16 16 16l48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16l48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0c-8.8 0-16 7.2-16 16zM160 304c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-256 0c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-256 0c-8.8 0-16 7.2-16 16z"></path></symbol><symbol id="paintbrush"viewBox="0 0 576 512"><path d="M339.3 367.1c27.3-3.9 51.9-19.4 67.2-42.9L568.2 74.1c12.6-19.5 9.4-45.3-7.6-61.2S517.7-4.4 499.1 9.6L262.4 187.2c-24 18-38.2 46.1-38.4 76.1L339.3 367.1zm-19.6 25.4l-116-104.4C143.9 290.3 96 339.6 96 400c0 3.9 .2 7.8 .6 11.6C98.4 429.1 86.4 448 68.8 448L64 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0c61.9 0 112-50.1 112-112c0-2.5-.1-5-.2-7.5z"></path></symbol><symbol id="palette"viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3L344 320c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path></symbol><symbol id="paper-plane"viewBox="0 0 512 512"><path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"></path></symbol><symbol id="pause"viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"></path></symbol><symbol id="pen"viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"></path></symbol><symbol id="pen-to-square"viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"></path></symbol><symbol id="pencil"viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></symbol><symbol id="pepper-hot"viewBox="0 0 512 512"><path d="M428.3 3c11.6-6.4 26.2-2.3 32.6 9.3l4.8 8.7c19.3 34.7 19.8 75.7 3.4 110C495.8 159.6 512 197.9 512 240c0 18.5-3.1 36.3-8.9 52.8c-6.1 17.3-28.5 16.3-36.8-.1l-11.7-23.4c-4.1-8.1-12.4-13.3-21.5-13.3L360 256c-13.3 0-24-10.7-24-24l0-80c0-13.3-10.7-24-24-24l-17.1 0c-21.3 0-30-23.9-10.8-32.9C304.7 85.4 327.7 80 352 80c28.3 0 54.8 7.3 77.8 20.2c5.5-18.2 3.7-38.4-6-55.8L419 35.7c-6.4-11.6-2.3-26.2 9.3-32.6zM171.2 345.5L264 160l40 0 0 80c0 26.5 21.5 48 48 48l76.2 0 23.9 47.8C372.3 443.9 244.3 512 103.2 512l-58.8 0C19.9 512 0 492.1 0 467.6c0-20.8 14.5-38.8 34.8-43.3l49.8-11.1c37.6-8.4 69.5-33.2 86.7-67.7z"></path></symbol><symbol id="piggy-bank"viewBox="0 0 576 512"><path d="M400 96l0 .7c-5.3-.4-10.6-.7-16-.7L256 96c-16.5 0-32.5 2.1-47.8 6c-.1-2-.2-4-.2-6c0-53 43-96 96-96s96 43 96 96zm-16 32c3.5 0 7 .1 10.4 .3c4.2 .3 8.4 .7 12.6 1.3C424.6 109.1 450.8 96 480 96l11.5 0c10.4 0 18 9.8 15.5 19.9l-13.8 55.2c15.8 14.8 28.7 32.8 37.5 52.9l13.3 0c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32l-32 0c-9.1 12.1-19.9 22.9-32 32l0 64c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-128 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-64c-34.9-26.2-58.7-66.3-63.2-112L68 304c-37.6 0-68-30.4-68-68s30.4-68 68-68l4 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-4 0c-11 0-20 9-20 20s9 20 20 20l31.2 0c12.1-59.8 57.7-107.5 116.3-122.8c12.9-3.4 26.5-5.2 40.5-5.2l128 0zm64 136a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z"></path></symbol><symbol id="play"viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path></symbol><symbol id="plug"viewBox="0 0 384 512"><path d="M96 0C78.3 0 64 14.3 64 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM288 0c-17.7 0-32 14.3-32 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 32c0 77.4 55 142 128 156.8l0 67.2c0 17.7 14.3 32 32 32s32-14.3 32-32l0-67.2C297 398 352 333.4 352 256l0-32c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z"></path></symbol><symbol id="plus"viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"></path></symbol><symbol id="power-off"viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 224c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"></path></symbol><symbol id="puzzle-piece"viewBox="0 0 512 512"><path d="M192 104.8c0-9.2-5.8-17.3-13.2-22.8C167.2 73.3 160 61.3 160 48c0-26.5 28.7-48 64-48s64 21.5 64 48c0 13.3-7.2 25.3-18.8 34c-7.4 5.5-13.2 13.6-13.2 22.8c0 12.8 10.4 23.2 23.2 23.2l56.8 0c26.5 0 48 21.5 48 48l0 56.8c0 12.8 10.4 23.2 23.2 23.2c9.2 0 17.3-5.8 22.8-13.2c8.7-11.6 20.7-18.8 34-18.8c26.5 0 48 28.7 48 64s-21.5 64-48 64c-13.3 0-25.3-7.2-34-18.8c-5.5-7.4-13.6-13.2-22.8-13.2c-12.8 0-23.2 10.4-23.2 23.2L384 464c0 26.5-21.5 48-48 48l-56.8 0c-12.8 0-23.2-10.4-23.2-23.2c0-9.2 5.8-17.3 13.2-22.8c11.6-8.7 18.8-20.7 18.8-34c0-26.5-28.7-48-64-48s-64 21.5-64 48c0 13.3 7.2 25.3 18.8 34c7.4 5.5 13.2 13.6 13.2 22.8c0 12.8-10.4 23.2-23.2 23.2L48 512c-26.5 0-48-21.5-48-48L0 343.2C0 330.4 10.4 320 23.2 320c9.2 0 17.3 5.8 22.8 13.2C54.7 344.8 66.7 352 80 352c26.5 0 48-28.7 48-64s-21.5-64-48-64c-13.3 0-25.3 7.2-34 18.8C40.5 250.2 32.4 256 23.2 256C10.4 256 0 245.6 0 232.8L0 176c0-26.5 21.5-48 48-48l120.8 0c12.8 0 23.2-10.4 23.2-23.2z"></path></symbol><symbol id="question"viewBox="0 0 320 512"><path d="M80 160c0-35.3 28.7-64 64-64l32 0c35.3 0 64 28.7 64 64l0 3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74l0 1.4c0 17.7 14.3 32 32 32s32-14.3 32-32l0-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7l0-3.6c0-70.7-57.3-128-128-128l-32 0C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"></path></symbol><symbol id="quote-left"viewBox="0 0 448 512"><path d="M0 216C0 149.7 53.7 96 120 96l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72zm256 0c0-66.3 53.7-120 120-120l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72z"></path></symbol><symbol id="quote-right"viewBox="0 0 448 512"><path d="M448 296c0 66.3-53.7 120-120 120l-8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l8 0c30.9 0 56-25.1 56-56l0-8-64 0c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l64 0c35.3 0 64 28.7 64 64l0 32 0 32 0 72zm-256 0c0 66.3-53.7 120-120 120l-8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l8 0c30.9 0 56-25.1 56-56l0-8-64 0c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l64 0c35.3 0 64 28.7 64 64l0 32 0 32 0 72z"></path></symbol><symbol id="radiation"viewBox="0 0 512 512"><path d="M216 186.7c-23.9 13.8-40 39.7-40 69.3L32 256C14.3 256-.2 241.6 2 224.1C10.7 154 47.8 92.7 101.3 52c14.1-10.7 33.8-5.3 42.7 10l72 124.7zM256 336c14.6 0 28.2-3.9 40-10.7l72 124.8c8.8 15.3 3.7 35.1-12.6 41.9c-30.6 12.9-64.2 20-99.4 20s-68.9-7.1-99.4-20c-16.3-6.9-21.4-26.6-12.6-41.9l72-124.8c11.8 6.8 25.4 10.7 40 10.7zm224-80l-144 0c0-29.6-16.1-55.5-40-69.3L368 62c8.8-15.3 28.6-20.7 42.7-10c53.6 40.7 90.6 102 99.4 172.1c2.2 17.5-12.4 31.9-30 31.9zM256 208a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path></symbol><symbol id="receipt"viewBox="0 0 384 512"><path d="M14 2.2C22.5-1.7 32.5-.3 39.6 5.8L80 40.4 120.4 5.8c9-7.7 22.3-7.7 31.2 0L192 40.4 232.4 5.8c9-7.7 22.3-7.7 31.2 0L304 40.4 344.4 5.8c7.1-6.1 17.1-7.5 25.6-3.6s14 12.4 14 21.8l0 464c0 9.4-5.5 17.9-14 21.8s-18.5 2.5-25.6-3.6L304 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L192 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L80 471.6 39.6 506.2c-7.1 6.1-17.1 7.5-25.6 3.6S0 497.4 0 488L0 24C0 14.6 5.5 6.1 14 2.2zM96 144c-8.8 0-16 7.2-16 16s7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 144zM80 352c0 8.8 7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 336c-8.8 0-16 7.2-16 16zM96 240c-8.8 0-16 7.2-16 16s7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 240z"></path></symbol><symbol id="repeat"viewBox="0 0 512 512"><path d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96l160 0 0 32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32l0 32L160 64C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96l-160 0 0-32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-32 160 0c88.4 0 160-71.6 160-160z"></path></symbol><symbol id="reply"viewBox="0 0 512 512"><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2l0 64 112 0c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96l-96 0 0 64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z"></path></symbol><symbol id="right-from-bracket"viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></symbol><symbol id="right-left"viewBox="0 0 512 512"><path d="M32 96l320 0 0-64c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l96 96c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-96 96c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6l0-64L32 160c-17.7 0-32-14.3-32-32s14.3-32 32-32zM480 352c17.7 0 32 14.3 32 32s-14.3 32-32 32l-320 0 0 64c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-96-96c-6-6-9.4-14.1-9.4-22.6s3.4-16.6 9.4-22.6l96-96c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 64 320 0z"></path></symbol><symbol id="right-to-bracket"viewBox="0 0 512 512"><path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path></symbol><symbol id="robot"viewBox="0 0 640 512"><path d="M320 0c17.7 0 32 14.3 32 32l0 64 120 0c39.8 0 72 32.2 72 72l0 272c0 39.8-32.2 72-72 72l-304 0c-39.8 0-72-32.2-72-72l0-272c0-39.8 32.2-72 72-72l120 0 0-64c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224l16 0 0 192-16 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-16 0 0-192 16 0z"></path></symbol><symbol id="rocket"viewBox="0 0 512 512"><path d="M156.6 384.9L125.7 354c-8.5-8.5-11.5-20.8-7.7-32.2c3-8.9 7-20.5 11.8-33.8L24 288c-8.6 0-16.6-4.6-20.9-12.1s-4.2-16.7 .2-24.1l52.5-88.5c13-21.9 36.5-35.3 61.9-35.3l82.3 0c2.4-4 4.8-7.7 7.2-11.3C289.1-4.1 411.1-8.1 483.9 5.3c11.6 2.1 20.6 11.2 22.8 22.8c13.4 72.9 9.3 194.8-111.4 276.7c-3.5 2.4-7.3 4.8-11.3 7.2l0 82.3c0 25.4-13.4 49-35.3 61.9l-88.5 52.5c-7.4 4.4-16.6 4.5-24.1 .2s-12.1-12.2-12.1-20.9l0-107.2c-14.1 4.9-26.4 8.9-35.7 11.9c-11.2 3.6-23.4 .5-31.8-7.8zM384 168a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"></path></symbol><symbol id="rotate"viewBox="0 0 512 512"><path d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z"></path></symbol><symbol id="route"viewBox="0 0 512 512"><path d="M512 96c0 50.2-59.1 125.1-84.6 155c-3.8 4.4-9.4 6.1-14.5 5L320 256c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c53 0 96 43 96 96s-43 96-96 96l-276.4 0c8.7-9.9 19.3-22.6 30-36.8c6.3-8.4 12.8-17.6 19-27.2L416 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-53 0-96-43-96-96s43-96 96-96l39.8 0c-21-31.5-39.8-67.7-39.8-96c0-53 43-96 96-96s96 43 96 96zM117.1 489.1c-3.8 4.3-7.2 8.1-10.1 11.3l-1.8 2-.2-.2c-6 4.6-14.6 4-20-1.8C59.8 473 0 402.5 0 352c0-53 43-96 96-96s96 43 96 96c0 30-21.1 67-43.5 97.9c-10.7 14.7-21.7 28-30.8 38.5l-.6 .7zM128 352a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM416 128a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path></symbol><symbol id="rss"viewBox="0 0 448 512"><path d="M0 64C0 46.3 14.3 32 32 32c229.8 0 416 186.2 416 416c0 17.7-14.3 32-32 32s-32-14.3-32-32C384 253.6 226.4 96 32 96C14.3 96 0 81.7 0 64zM0 416a64 64 0 1 1 128 0A64 64 0 1 1 0 416zM32 160c159.1 0 288 128.9 288 288c0 17.7-14.3 32-32 32s-32-14.3-32-32c0-123.7-100.3-224-224-224c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path></symbol><symbol id="scroll"viewBox="0 0 576 512"><path d="M0 80l0 48c0 17.7 14.3 32 32 32l16 0 48 0 0-80c0-26.5-21.5-48-48-48S0 53.5 0 80zM112 32c10 13.4 16 30 16 48l0 304c0 35.3 28.7 64 64 64s64-28.7 64-64l0-5.3c0-32.4 26.3-58.7 58.7-58.7L480 320l0-192c0-53-43-96-96-96L112 32zM464 480c61.9 0 112-50.1 112-112c0-8.8-7.2-16-16-16l-245.3 0c-14.7 0-26.7 11.9-26.7 26.7l0 5.3c0 53-43 96-96 96l176 0 96 0z"></path></symbol><symbol id="seedling"viewBox="0 0 512 512"><path d="M512 32c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 46.3 364 0 448 0l32 0c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64l32 0c123.7 0 224 100.3 224 224l0 32 0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160C100.3 320 0 219.7 0 96z"></path></symbol><symbol id="server"viewBox="0 0 512 512"><path d="M64 32C28.7 32 0 60.7 0 96l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 32zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm48 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 288zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"></path></symbol><symbol id="share"viewBox="0 0 512 512"><path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2l0 64-112 0C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96l96 0 0 64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"></path></symbol><symbol id="share-nodes"viewBox="0 0 448 512"><path d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z"></path></symbol><symbol id="shield-halved"viewBox="0 0 512 512"><path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8l0 378.1C394 378 431.1 230.1 432 141.4L256 66.8s0 0 0 0z"></path></symbol><symbol id="shuffle"viewBox="0 0 512 512"><path d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6l0-32-32 0c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96l32 0 0-32c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6l0-32-32 0c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8l32 0 0-32c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z"></path></symbol><symbol id="signal"viewBox="0 0 640 512"><path d="M576 0c17.7 0 32 14.3 32 32l0 448c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-448c0-17.7 14.3-32 32-32zM448 96c17.7 0 32 14.3 32 32l0 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-352c0-17.7 14.3-32 32-32zM352 224l0 256c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32s32 14.3 32 32zM192 288c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32zM96 416l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32s32 14.3 32 32z"></path></symbol><symbol id="sliders"viewBox="0 0 512 512"><path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"></path></symbol><symbol id="spell-check"viewBox="0 0 576 512"><path d="M112 0C99.1 0 87.4 7.8 82.5 19.7l-66.7 160-13.3 32c-6.8 16.3 .9 35 17.2 41.8s35-.9 41.8-17.2L66.7 224l90.7 0 5.1 12.3c6.8 16.3 25.5 24 41.8 17.2s24-25.5 17.2-41.8l-13.3-32-66.7-160C136.6 7.8 124.9 0 112 0zm18.7 160l-37.3 0L112 115.2 130.7 160zM256 32l0 96 0 96c0 17.7 14.3 32 32 32l80 0c44.2 0 80-35.8 80-80c0-23.1-9.8-43.8-25.4-58.4c6-11.2 9.4-24 9.4-37.6c0-44.2-35.8-80-80-80L288 0c-17.7 0-32 14.3-32 32zm96 64l-32 0 0-32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16zm-32 64l32 0 16 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-48 0 0-32zM566.6 310.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L352 434.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l192-192z"></path></symbol><symbol id="spider"viewBox="0 0 512 512"><path d="M158.4 32.6c4.8-12.4-1.4-26.3-13.8-31s-26.3 1.4-31 13.8L81.1 100c-7.9 20.7-3 44.1 12.7 59.7l57.4 57.4L70.8 190.3c-2.4-.8-4.3-2.7-5.1-5.1L46.8 128.4C42.6 115.8 29 109 16.4 113.2S-3 131 1.2 143.6l18.9 56.8c5.6 16.7 18.7 29.8 35.4 35.4L116.1 256 55.6 276.2c-16.7 5.6-29.8 18.7-35.4 35.4L1.2 368.4C-3 381 3.8 394.6 16.4 398.8s26.2-2.6 30.4-15.2l18.9-56.8c.8-2.4 2.7-4.3 5.1-5.1l80.4-26.8L93.7 352.3C78.1 368 73.1 391.4 81.1 412l32.5 84.6c4.8 12.4 18.6 18.5 31 13.8s18.5-18.6 13.8-31l-32.5-84.6c-1.1-3-.4-6.3 1.8-8.5L160 353.9c1 52.1 43.6 94.1 96 94.1s95-41.9 96-94.1l32.3 32.3c2.2 2.2 2.9 5.6 1.8 8.5l-32.5 84.6c-4.8 12.4 1.4 26.3 13.8 31s26.3-1.4 31-13.8L430.9 412c7.9-20.7 3-44.1-12.7-59.7l-57.4-57.4 80.4 26.8c2.4 .8 4.3 2.7 5.1 5.1l18.9 56.8c4.2 12.6 17.8 19.4 30.4 15.2s19.4-17.8 15.2-30.4l-18.9-56.8c-5.6-16.7-18.7-29.8-35.4-35.4L395.9 256l60.5-20.2c16.7-5.6 29.8-18.7 35.4-35.4l18.9-56.8c4.2-12.6-2.6-26.2-15.2-30.4s-26.2 2.6-30.4 15.2l-18.9 56.8c-.8 2.4-2.7 4.3-5.1 5.1l-80.4 26.8 57.4-57.4c15.6-15.6 20.6-39 12.7-59.7L398.4 15.4C393.6 3 379.8-3.2 367.4 1.6s-18.5 18.6-13.8 31l32.5 84.6c1.1 3 .4 6.3-1.8 8.5L336 174.1l0-14.1c0-31.8-18.6-59.3-45.5-72.2c-9.1-4.4-18.5 3.3-18.5 13.4l0 10.8c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-10.8c0-10.1-9.4-17.7-18.5-13.4C194.6 100.7 176 128.2 176 160l0 14.1-48.3-48.3c-2.2-2.2-2.9-5.6-1.8-8.5l32.5-84.6z"></path></symbol><symbol id="spinner"viewBox="0 0 512 512"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"></path></symbol><symbol id="square-check"viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></symbol><symbol id="square-envelope"viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM218 271.7L64.2 172.4C66 156.4 79.5 144 96 144l256 0c16.5 0 30 12.4 31.8 28.4L230 271.7c-1.8 1.2-3.9 1.8-6 1.8s-4.2-.6-6-1.8zm29.4 26.9L384 210.4 384 336c0 17.7-14.3 32-32 32L96 368c-17.7 0-32-14.3-32-32l0-125.6 136.6 88.2c7 4.5 15.1 6.9 23.4 6.9s16.4-2.4 23.4-6.9z"></path></symbol><symbol id="square-full"viewBox="0 0 512 512"><path d="M0 0H512V512H0V0z"></path></symbol><symbol id="square-plus"viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path></symbol><symbol id="square-share-nodes"viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM384 160c0 35.3-28.7 64-64 64c-15.4 0-29.5-5.4-40.6-14.5L194.1 256l85.3 46.5c11-9.1 25.2-14.5 40.6-14.5c35.3 0 64 28.7 64 64s-28.7 64-64 64s-64-28.7-64-64c0-2.5 .1-4.9 .4-7.3L174.5 300c-11.7 12.3-28.2 20-46.5 20c-35.3 0-64-28.7-64-64s28.7-64 64-64c18.3 0 34.8 7.7 46.5 20l81.9-44.7c-.3-2.4-.4-4.9-.4-7.3c0-35.3 28.7-64 64-64s64 28.7 64 64z"></path></symbol><symbol id="stamp"viewBox="0 0 512 512"><path d="M312 201.8c0-17.4 9.2-33.2 19.9-47C344.5 138.5 352 118.1 352 96c0-53-43-96-96-96s-96 43-96 96c0 22.1 7.5 42.5 20.1 58.8c10.7 13.8 19.9 29.6 19.9 47c0 29.9-24.3 54.2-54.2 54.2L112 256C50.1 256 0 306.1 0 368c0 20.9 13.4 38.7 32 45.3L32 464c0 26.5 21.5 48 48 48l352 0c26.5 0 48-21.5 48-48l0-50.7c18.6-6.6 32-24.4 32-45.3c0-61.9-50.1-112-112-112l-33.8 0c-29.9 0-54.2-24.3-54.2-54.2zM416 416l0 32L96 448l0-32 320 0z"></path></symbol><symbol id="star"viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></symbol><symbol id="sun"viewBox="0 0 512 512"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"></path></symbol><symbol id="table"viewBox="0 0 512 512"><path d="M64 256l0-96 160 0 0 96L64 256zm0 64l160 0 0 96L64 416l0-96zm224 96l0-96 160 0 0 96-160 0zM448 256l-160 0 0-96 160 0 0 96zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z"></path></symbol><symbol id="table-cells"viewBox="0 0 512 512"><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm88 64l0 64-88 0 0-64 88 0zm56 0l88 0 0 64-88 0 0-64zm240 0l0 64-88 0 0-64 88 0zM64 224l88 0 0 64-88 0 0-64zm232 0l0 64-88 0 0-64 88 0zm64 0l88 0 0 64-88 0 0-64zM152 352l0 64-88 0 0-64 88 0zm56 0l88 0 0 64-88 0 0-64zm240 0l0 64-88 0 0-64 88 0z"></path></symbol><symbol id="table-columns"viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zm64 64l0 256 160 0 0-256L64 160zm384 0l-160 0 0 256 160 0 0-256z"></path></symbol><symbol id="tag"viewBox="0 0 448 512"><path d="M0 80L0 229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7L48 32C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></symbol><symbol id="tags"viewBox="0 0 512 512"><path d="M345 39.1L472.8 168.4c52.4 53 52.4 138.2 0 191.2L360.8 472.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L438.6 325.9c33.9-34.3 33.9-89.4 0-123.7L310.9 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM0 229.5L0 80C0 53.5 21.5 32 48 32l149.5 0c17 0 33.3 6.7 45.3 18.7l168 168c25 25 25 65.5 0 90.5L277.3 442.7c-25 25-65.5 25-90.5 0l-168-168C6.7 262.7 0 246.5 0 229.5zM144 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></symbol><symbol id="temperature-three-quarters"viewBox="0 0 320 512"><path d="M160 64c-26.5 0-48 21.5-48 48l0 164.5c0 17.3-7.1 31.9-15.3 42.5C86.2 332.6 80 349.5 80 368c0 44.2 35.8 80 80 80s80-35.8 80-80c0-18.5-6.2-35.4-16.7-48.9c-8.2-10.6-15.3-25.2-15.3-42.5L208 112c0-26.5-21.5-48-48-48zM48 112C48 50.2 98.1 0 160 0s112 50.1 112 112l0 164.4c0 .1 .1 .3 .2 .6c.2 .6 .8 1.6 1.7 2.8c18.9 24.4 30.1 55 30.1 88.1c0 79.5-64.5 144-144 144S16 447.5 16 368c0-33.2 11.2-63.8 30.1-88.1c.9-1.2 1.5-2.2 1.7-2.8c.1-.3 .2-.5 .2-.6L48 112zM208 368c0 26.5-21.5 48-48 48s-48-21.5-48-48c0-20.9 13.4-38.7 32-45.3L144 144c0-8.8 7.2-16 16-16s16 7.2 16 16l0 178.7c18.6 6.6 32 24.4 32 45.3z"></path></symbol><symbol id="terminal"viewBox="0 0 576 512"><path d="M9.4 86.6C-3.1 74.1-3.1 53.9 9.4 41.4s32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 9.4 86.6zM256 416l288 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-288 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path></symbol><symbol id="thumbs-down"viewBox="0 0 512 512"><path d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2l144 0c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48l-97.5 0c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7l0 38.3 0 48 0 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32L32 96C14.3 96 0 110.3 0 128L0 352c0 17.7 14.3 32 32 32z"></path></symbol><symbol id="thumbs-up"viewBox="0 0 512 512"><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2l144 0c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48l-97.5 0c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3l0-38.3 0-48 0-24.9c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32L0 224c0-17.7 14.3-32 32-32z"></path></symbol><symbol id="thumbtack"viewBox="0 0 384 512"><path d="M32 32C32 14.3 46.3 0 64 0L320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-29.5 0 11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3L32 352c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64 64 64C46.3 64 32 49.7 32 32zM160 384l64 0 0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96z"></path></symbol><symbol id="timeline"viewBox="0 0 640 512"><path d="M128 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm32 97.3c28.3-12.3 48-40.5 48-73.3c0-44.2-35.8-80-80-80S48 51.8 48 96c0 32.8 19.7 61 48 73.3L96 224l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0 0 54.7c-28.3 12.3-48 40.5-48 73.3c0 44.2 35.8 80 80 80s80-35.8 80-80c0-32.8-19.7-61-48-73.3l0-54.7 256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-54.7c28.3-12.3 48-40.5 48-73.3c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 32.8 19.7 61 48 73.3l0 54.7-320 0 0-54.7zM488 96a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM320 392a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path></symbol><symbol id="tippy-rounded-arrow"class="tippy-rounded-arrow"viewBox="0 0 16 6"><path fill="var(--float-kit-arrow-stroke-color)"class="svg-arrow"d="M0 6s1.796-.013 4.67-3.615C5.851.9 6.93.006 8 0c1.07-.006 2.148.887 3.343 2.385C14.233 6.005 16 6 16 6H0z"></path><path fill="var(--float-kit-arrow-fill-color)"class="svg-content"d="m0 7s2 0 5-4c1-1 2-2 3-2 1 0 2 1 3 2 3 4 5 4 5 4h-16z"></path></symbol><symbol id="toggle-off"viewBox="0 0 576 512"><path d="M384 128c70.7 0 128 57.3 128 128s-57.3 128-128 128l-192 0c-70.7 0-128-57.3-128-128s57.3-128 128-128l192 0zM576 256c0-106-86-192-192-192L192 64C86 64 0 150 0 256S86 448 192 448l192 0c106 0 192-86 192-192zM192 352a96 96 0 1 0 0-192 96 96 0 1 0 0 192z"></path></symbol><symbol id="toggle-on"viewBox="0 0 576 512"><path d="M192 64C86 64 0 150 0 256S86 448 192 448l192 0c106 0 192-86 192-192s-86-192-192-192L192 64zm192 96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"></path></symbol><symbol id="trash-can"viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"></path></symbol><symbol id="tree"viewBox="0 0 448 512"><path d="M210.6 5.9L62 169.4c-3.9 4.2-6 9.8-6 15.5C56 197.7 66.3 208 79.1 208l24.9 0L30.6 281.4c-4.2 4.2-6.6 10-6.6 16C24 309.9 34.1 320 46.6 320L80 320 5.4 409.5C1.9 413.7 0 419 0 424.5c0 13 10.5 23.5 23.5 23.5L192 448l0 32c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32 168.5 0c13 0 23.5-10.5 23.5-23.5c0-5.5-1.9-10.8-5.4-15L368 320l33.4 0c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16L344 208l24.9 0c12.7 0 23.1-10.3 23.1-23.1c0-5.7-2.1-11.3-6-15.5L237.4 5.9C234 2.1 229.1 0 224 0s-10 2.1-13.4 5.9z"></path></symbol><symbol id="triangle-exclamation"viewBox="0 0 512 512"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></symbol><symbol id="truck-medical"viewBox="0 0 640 512"><path d="M0 48C0 21.5 21.5 0 48 0L368 0c26.5 0 48 21.5 48 48l0 48 50.7 0c17 0 33.3 6.7 45.3 18.7L589.3 192c12 12 18.7 28.3 18.7 45.3l0 18.7 0 32 0 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0c0 53-43 96-96 96s-96-43-96-96l-128 0c0 53-43 96-96 96s-96-43-96-96l-16 0c-26.5 0-48-21.5-48-48L0 48zM416 256l128 0 0-18.7L466.7 160 416 160l0 96zM160 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm368-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM176 80l0 48-48 0c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l48 0 0 48c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-48 48 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-48 0 0-48c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z"></path></symbol><symbol id="unlock"viewBox="0 0 448 512"><path d="M144 144c0-44.2 35.8-80 80-80c31.9 0 59.4 18.6 72.3 45.7c7.6 16 26.7 22.8 42.6 15.2s22.8-26.7 15.2-42.6C331 33.7 281.5 0 224 0C144.5 0 80 64.5 80 144l0 48-16 0c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64l-240 0 0-48z"></path></symbol><symbol id="unlock-keyhole"viewBox="0 0 448 512"><path d="M224 64c-44.2 0-80 35.8-80 80l0 48 240 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0 0-48C80 64.5 144.5 0 224 0c57.5 0 107 33.7 130.1 82.3c7.6 16 .8 35.1-15.2 42.6s-35.1 .8-42.6-15.2C283.4 82.6 255.9 64 224 64zm32 320c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0z"></path></symbol><symbol id="up-down"viewBox="0 0 256 512"><path d="M145.6 7.7C141 2.8 134.7 0 128 0s-13 2.8-17.6 7.7l-104 112c-6.5 7-8.2 17.2-4.4 25.9S14.5 160 24 160l56 0 0 192-56 0c-9.5 0-18.2 5.7-22 14.4s-2.1 18.9 4.4 25.9l104 112c4.5 4.9 10.9 7.7 17.6 7.7s13-2.8 17.6-7.7l104-112c6.5-7 8.2-17.2 4.4-25.9s-12.5-14.4-22-14.4l-56 0 0-192 56 0c9.5 0 18.2-5.7 22-14.4s2.1-18.9-4.4-25.9l-104-112z"></path></symbol><symbol id="up-right-from-square"viewBox="0 0 512 512"><path d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-128c0-17.7-14.3-32-32-32L352 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></symbol><symbol id="upload"viewBox="0 0 512 512"><path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path></symbol><symbol id="user"viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"></path></symbol><symbol id="user-check"viewBox="0 0 640 512"><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM625 177L497 305c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L591 143c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></symbol><symbol id="user-gear"viewBox="0 0 640 512"><path d="M224 0a128 128 0 1 1 0 256A128 128 0 1 1 224 0zM178.3 304l91.4 0c11.8 0 23.4 1.2 34.5 3.3c-2.1 18.5 7.4 35.6 21.8 44.8c-16.6 10.6-26.7 31.6-20 53.3c4 12.9 9.4 25.5 16.4 37.6s15.2 23.1 24.4 33c15.7 16.9 39.6 18.4 57.2 8.7l0 .9c0 9.2 2.7 18.5 7.9 26.3L29.7 512C13.3 512 0 498.7 0 482.3C0 383.8 79.8 304 178.3 304zM436 218.2c0-7 4.5-13.3 11.3-14.8c10.5-2.4 21.5-3.7 32.7-3.7s22.2 1.3 32.7 3.7c6.8 1.5 11.3 7.8 11.3 14.8l0 30.6c7.9 3.4 15.4 7.7 22.3 12.8l24.9-14.3c6.1-3.5 13.7-2.7 18.5 2.4c7.6 8.1 14.3 17.2 20.1 27.2s10.3 20.4 13.5 31c2.1 6.7-1.1 13.7-7.2 17.2l-25 14.4c.4 4 .7 8.1 .7 12.3s-.2 8.2-.7 12.3l25 14.4c6.1 3.5 9.2 10.5 7.2 17.2c-3.3 10.6-7.8 21-13.5 31s-12.5 19.1-20.1 27.2c-4.8 5.1-12.5 5.9-18.5 2.4l-24.9-14.3c-6.9 5.1-14.3 9.4-22.3 12.8l0 30.6c0 7-4.5 13.3-11.3 14.8c-10.5 2.4-21.5 3.7-32.7 3.7s-22.2-1.3-32.7-3.7c-6.8-1.5-11.3-7.8-11.3-14.8l0-30.5c-8-3.4-15.6-7.7-22.5-12.9l-24.7 14.3c-6.1 3.5-13.7 2.7-18.5-2.4c-7.6-8.1-14.3-17.2-20.1-27.2s-10.3-20.4-13.5-31c-2.1-6.7 1.1-13.7 7.2-17.2l24.8-14.3c-.4-4.1-.7-8.2-.7-12.4s.2-8.3 .7-12.4L343.8 325c-6.1-3.5-9.2-10.5-7.2-17.2c3.3-10.6 7.7-21 13.5-31s12.5-19.1 20.1-27.2c4.8-5.1 12.4-5.9 18.5-2.4l24.8 14.3c6.9-5.1 14.5-9.4 22.5-12.9l0-30.5zm92.1 133.5a48.1 48.1 0 1 0 -96.1 0 48.1 48.1 0 1 0 96.1 0z"></path></symbol><symbol id="user-group"viewBox="0 0 640 512"><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM609.3 512l-137.8 0c5.4-9.4 8.6-20.3 8.6-32l0-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2l61.4 0C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"></path></symbol><symbol id="user-injured"viewBox="0 0 448 512"><path d="M240 80l102.7 0c-7.9-19.5-20.4-36.5-36.2-49.9L240 80zm37.7-68.2C261.3 4.2 243.2 0 224 0c-53.7 0-99.7 33.1-118.7 80l81.4 0 91-68.2zM224 256c70.7 0 128-57.3 128-128c0-5.4-.3-10.8-1-16L97 112c-.7 5.2-1 10.6-1 16c0 70.7 57.3 128 128 128zM124 312.4c-9.7 3.1-19.1 7-28 11.7L96 512l147.7 0L181.5 408.2 124 312.4zm33-7.2L204.3 384l67.7 0c44.2 0 80 35.8 80 80c0 18-6 34.6-16 48l82.3 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0c-7.2 0-14.3 .4-21.3 1.3zM0 482.3C0 498.7 13.3 512 29.7 512L64 512l0-166.6C24.9 378.1 0 427.3 0 482.3zM320 464c0-26.5-21.5-48-48-48l-48.5 0 57.1 95.2C303 507.2 320 487.6 320 464z"></path></symbol><symbol id="user-pen"viewBox="0 0 640 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l293.1 0c-3.1-8.8-3.7-18.4-1.4-27.8l15-60.1c2.8-11.3 8.6-21.5 16.8-29.7l40.3-40.3c-32.1-31-75.7-50.1-123.9-50.1l-91.4 0zm435.5-68.3c-15.6-15.6-40.9-15.6-56.6 0l-29.4 29.4 71 71 29.4-29.4c15.6-15.6 15.6-40.9 0-56.6l-14.4-14.4zM375.9 417c-4.1 4.1-7 9.2-8.4 14.9l-15 60.1c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2l60.1-15c5.6-1.4 10.8-4.3 14.9-8.4L576.1 358.7l-71-71L375.9 417z"></path></symbol><symbol id="user-plus"viewBox="0 0 640 512"><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path></symbol><symbol id="user-secret"viewBox="0 0 448 512"><path d="M224 16c-6.7 0-10.8-2.8-15.5-6.1C201.9 5.4 194 0 176 0c-30.5 0-52 43.7-66 89.4C62.7 98.1 32 112.2 32 128c0 14.3 25 27.1 64.6 35.9c-.4 4-.6 8-.6 12.1c0 17 3.3 33.2 9.3 48l-59.9 0C38 224 32 230 32 237.4c0 1.7 .3 3.4 1 5l38.8 96.9C28.2 371.8 0 423.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7c0-58.5-28.2-110.4-71.7-143L415 242.4c.6-1.6 1-3.3 1-5c0-7.4-6-13.4-13.4-13.4l-59.9 0c6-14.8 9.3-31 9.3-48c0-4.1-.2-8.1-.6-12.1C391 155.1 416 142.3 416 128c0-15.8-30.7-29.9-78-38.6C324 43.7 302.5 0 272 0c-18 0-25.9 5.4-32.5 9.9c-4.8 3.3-8.8 6.1-15.5 6.1zm56 208l-12.4 0c-16.5 0-31.1-10.6-36.3-26.2c-2.3-7-12.2-7-14.5 0c-5.2 15.6-19.9 26.2-36.3 26.2L168 224c-22.1 0-40-17.9-40-40l0-14.4c28.2 4.1 61 6.4 96 6.4s67.8-2.3 96-6.4l0 14.4c0 22.1-17.9 40-40 40zm-88 96l16 32L176 480 128 288l64 32zm128-32L272 480 240 352l16-32 64-32z"></path></symbol><symbol id="user-shield"viewBox="0 0 640 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c1.8 0 3.5-.2 5.3-.5c-76.3-55.1-99.8-141-103.1-200.2c-16.1-4.8-33.1-7.3-50.7-7.3l-91.4 0zm308.8-78.3l-120 48C358 277.4 352 286.2 352 296c0 63.3 25.9 168.8 134.8 214.2c5.9 2.5 12.6 2.5 18.5 0C614.1 464.8 640 359.3 640 296c0-9.8-6-18.6-15.1-22.3l-120-48c-5.7-2.3-12.1-2.3-17.8 0zM591.4 312c-3.9 50.7-27.2 116.7-95.4 149.7l0-187.8L591.4 312z"></path></symbol><symbol id="user-slash"viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L353.3 251.6C407.9 237 448 187.2 448 128C448 57.3 390.7 0 320 0C250.2 0 193.5 55.8 192 125.2L38.8 5.1zM264.3 304.3C170.5 309.4 96 387.2 96 482.3c0 16.4 13.3 29.7 29.7 29.7l388.6 0c3.9 0 7.6-.7 11-2.1l-261-205.6z"></path></symbol><symbol id="user-xmark"viewBox="0 0 640 512"><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM471 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"></path></symbol><symbol id="users"viewBox="0 0 640 512"><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"></path></symbol><symbol id="venus"viewBox="0 0 384 512"><path d="M80 176a112 112 0 1 1 224 0A112 112 0 1 1 80 176zM224 349.1c81.9-15 144-86.8 144-173.1C368 78.8 289.2 0 192 0S16 78.8 16 176c0 86.3 62.1 158.1 144 173.1l0 34.9-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 0 32c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0 0-34.9z"></path></symbol><symbol id="video"viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"></path></symbol><symbol id="wand-magic"viewBox="0 0 512 512"><path d="M14.1 463.3c-18.7-18.7-18.7-49.1 0-67.9L395.4 14.1c18.7-18.7 49.1-18.7 67.9 0l34.6 34.6c18.7 18.7 18.7 49.1 0 67.9L116.5 497.9c-18.7 18.7-49.1 18.7-67.9 0L14.1 463.3zM347.6 187.6l105-105L429.4 59.3l-105 105 23.3 23.3z"></path></symbol><symbol id="water"viewBox="0 0 576 512"><path d="M269.5 69.9c11.1-7.9 25.9-7.9 37 0C329 85.4 356.5 96 384 96c26.9 0 55.4-10.8 77.4-26.1c0 0 0 0 0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 149.7 417 160 384 160c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4C42.8 92.6 61 83.5 75.3 71.6c11.1-9.5 27.3-10.1 39.2-1.7c0 0 0 0 0 0C136.7 85.2 165.1 96 192 96c27.5 0 55-10.6 77.5-26.1zm37 288C329 373.4 356.5 384 384 384c26.9 0 55.4-10.8 77.4-26.1c0 0 0 0 0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 437.7 417 448 384 448c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4c18.1-4.2 36.2-13.3 50.6-25.2c11.1-9.4 27.3-10.1 39.2-1.7c0 0 0 0 0 0C136.7 373.2 165.1 384 192 384c27.5 0 55-10.6 77.5-26.1c11.1-7.9 25.9-7.9 37 0zm0-144C329 229.4 356.5 240 384 240c26.9 0 55.4-10.8 77.4-26.1c0 0 0 0 0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 293.7 417 304 384 304c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4c18.1-4.2 36.2-13.3 50.6-25.2c11.1-9.5 27.3-10.1 39.2-1.7c0 0 0 0 0 0C136.7 229.2 165.1 240 192 240c27.5 0 55-10.6 77.5-26.1c11.1-7.9 25.9-7.9 37 0z"></path></symbol><symbol id="wrench"viewBox="0 0 512 512"><path d="M352 320c88.4 0 160-71.6 160-160c0-15.3-2.2-30.1-6.2-44.2c-3.1-10.8-16.4-13.2-24.3-5.3l-76.8 76.8c-3 3-7.1 4.7-11.3 4.7L336 192c-8.8 0-16-7.2-16-16l0-57.4c0-4.2 1.7-8.3 4.7-11.3l76.8-76.8c7.9-7.9 5.4-21.2-5.3-24.3C382.1 2.2 367.3 0 352 0C263.6 0 192 71.6 192 160c0 19.1 3.4 37.5 9.5 54.5L19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L297.5 310.5c17 6.2 35.4 9.5 54.5 9.5zM80 408a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path></symbol><symbol id="xmark"viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path></symbol><symbol id="discourse-table"viewBox="0 0 512 512"><g><g id="Layer_1"><path d="M0,96C0,60.7,28.7,32,64,32h384c35.3,0,64,28.7,64,64v320c0,35.3-28.7,64-64,64H64c-35.3,0-64-28.7-64-64V96ZM448,96H64v64h384v-64ZM448,224H64v64h384v-64ZM448,352H64v64h384v-64Z"></path></g></g></symbol><symbol id="discourse-table-sparkles"viewBox="0 0 512 512"><path d="M448 309.64V413H64V290h190c12.23 0 18.46-14.71 9.94-23.48-7.56-7.78-14.48-16.2-20.66-25.16-5.36-7.77-14.24-12.36-23.69-12.36H64V93h130c10.65 0 20.14-6.92 23.18-17.12a193.4 193.4 0 0 1 9.74-25.76c4.56-9.86-2.77-21.12-13.63-21.12H64C28.65 29 0 57.65 0 93v320c0 35.35 28.65 64 64 64h384c35.35 0 64-28.65 64-64V263.8c0-9.16-10.7-14.14-17.7-8.25a194.056 194.056 0 0 1-25.76 18.32c-12.66 7.53-20.53 21.05-20.53 35.77Z"></path><path d="M247.46 122.15c-6.45 2.44-10.75 8.6-10.75 15.49s4.3 13.05 10.75 15.49l81.01 30.4 30.4 81.01c2.44 6.45 8.6 10.75 15.49 10.75s13.05-4.3 15.49-10.75l30.4-81.01 81.01-30.4c6.45-2.44 10.75-8.6 10.75-15.49s-4.3-13.05-10.75-15.49l-81.01-30.4-30.4-81.01c-2.44-6.45-8.6-10.75-15.49-10.75s-13.05 4.3-15.49 10.75l-30.4 81.01-81.01 30.4Z"></path></symbol><symbol id="discobot"viewBox="0 0 512 512"><path d="M175.61 481.26H26.03c-6.75 0-13.36-2.67-18.42-7.59-5.06-5.06-7.87-11.81-7.59-18.84V290.76C.3 242.12 19.42 196 54.43 161.28c35.43-35.43 82.67-54.83 132.71-54.83h.56c49.77 0 96.3 19.54 131.17 55.11a187.257 187.257 0 0 1 48.5 88.57c5.06 21.79-6.19 44.14-26.71 53.14-14.62 6.47-69.17 27.7-170.67 37.96 4.5 11.25 16.17 23.34 46.68 29.66 29.8 6.19 64.53 4.22 87.59 2.95 9.84-.56 16.87-.98 21.79-.56 6.33.42 11.81 4.22 14.62 9.98 2.67 5.62 2.25 12.37-1.41 17.57-6.19 9-13.22 17.57-20.95 25.31-33.88 34.44-79.29 53.99-127.79 54.97h-14.76c0 .14-.14.14-.28.14h.14ZM35.17 446.11h154.65c34.87-.7 67.9-13.36 94.19-35.85-22.07.7-49.49.42-74.51-4.78-58.48-12.23-74.23-45.41-77.18-71.28-.7-6.47 1.12-12.79 5.2-17.85s10.12-8.15 16.59-8.72c82.81-7.31 143.26-23.62 172.22-36.27 5.06-2.25 7.87-7.73 6.61-13.07-6.33-27.13-19.82-51.88-39.36-71.84-28.12-28.68-65.8-44.57-106.14-44.57h-.56c-40.91 0-79.15 15.89-107.97 44.57-28.26 28.12-43.86 65.37-43.86 104.6v155.07c-.14 0 0 0 0 0h.14Zm-10.13 0ZM17.87 290.9Z"></path><circle cx="171.11"cy="217.94"r="32.05"></circle><path d="M511.76 293.71c-.7-5.2-3.51-9.84-7.73-12.93s-9.42-4.5-14.62-3.66l-52.3 7.73c-5.2.7-9.84 3.51-12.93 7.73-3.09 4.22-4.5 9.42-3.66 14.62.98 6.61 5.2 12.23 11.39 15.04 2.53 1.12 5.34 1.69 8.01 1.69s1.97 0 2.95-.28l52.3-7.73c5.2-.7 9.84-3.51 12.93-7.73s4.5-9.42 3.66-14.62v.14ZM490.67 388.19l-71.98-36.41c-9.28-5.34-21.37-2.25-26.71 7.03-2.67 4.5-3.37 9.84-2.11 14.9 1.27 5.06 4.5 9.42 9.14 11.95l71.98 36.41c1.27.7 2.53 1.27 3.94 1.69 1.97.56 3.94.84 5.9.84 6.89 0 13.36-3.51 16.87-9.7 5.48-9.42 2.39-21.51-7.03-26.99v.28Z"></path></symbol><symbol id="group-plus"viewBox="0 0 86.62 63.79"><circle cx="37.21"cy="31.89"r="10.63"></circle><path d="M44.65 45.18h-1.39c-1.84.85-3.9 1.33-6.06 1.33s-4.2-.48-6.06-1.33h-1.39c-6.16 0-11.16 5-11.16 11.16v3.46c0 2.2 1.79 3.99 3.99 3.99h29.24c2.2 0 3.99-1.79 3.99-3.99v-3.46c0-6.16-5-11.16-11.16-11.16Z"></path><circle cx="18.61"cy="10.63"r="10.63"></circle><path d="M21.31 25.24c-2.3-.2-4.49-.54-6.48-1.32h-1.64C5.91 23.92 0 28.92 0 35.08v3.46c0 2.2 2.11 3.99 4.71 3.99H24.3s1.3-.24.55-.96c-5.93-5.74-4.61-12-3.56-14.81 0 0 .85-1.45.02-1.52Zm63.14-.74h-8.7v-8.7c0-1.2-.98-2.17-2.17-2.17h-4.35c-1.2 0-2.17.98-2.17 2.17v8.7h-8.7c-1.2 0-2.17.98-2.17 2.17v4.35c0 1.2.98 2.17 2.17 2.17h8.7v8.7c0 1.2.98 2.17 2.17 2.17h4.35c1.2 0 2.17-.98 2.17-2.17v-8.7h8.7c1.2 0 2.17-.98 2.17-2.17v-4.35c0-1.2-.98-2.17-2.17-2.17Z"></path></symbol><symbol id="group-times"viewBox="0 0 84.34 63.79"><circle cx="37.21"cy="31.89"r="10.63"></circle><path d="M44.65 45.18h-1.39c-1.84.85-3.9 1.33-6.06 1.33s-4.2-.48-6.06-1.33h-1.39c-6.16 0-11.16 5-11.16 11.16v3.46c0 2.2 1.79 3.99 3.99 3.99h29.24c2.2 0 3.99-1.79 3.99-3.99v-3.46c0-6.16-5-11.16-11.16-11.16Z"></path><circle cx="18.61"cy="10.63"r="10.63"></circle><path d="M21.31 25.24c-2.3-.2-4.49-.54-6.48-1.32h-1.64C5.91 23.92 0 28.92 0 35.08v3.46c0 2.2 2.11 3.99 4.71 3.99H24.3s1.3-.24.55-.96c-5.93-5.74-4.61-12-3.56-14.81 0 0 .85-1.45.02-1.52ZM83.7 35l-6.15-6.15 6.15-6.15c.85-.85.84-2.23 0-3.07l-3.08-3.08c-.85-.85-2.23-.84-3.07 0L71.4 22.7l-6.15-6.15c-.85-.85-2.23-.84-3.07 0l-3.08 3.08c-.85.85-.84 2.23 0 3.07l6.15 6.15L59.1 35c-.85.85-.84 2.23 0 3.07l3.08 3.08c.85.85 2.23.84 3.07 0L71.4 35l6.15 6.15c.85.85 2.23.84 3.07 0l3.08-3.08c.85-.85.84-2.23 0-3.07Z"></path></symbol><symbol id="discourse-follow-new-reply"viewBox="0 0 33 30"><path d="M15.2 29.3H3.1c-1.7 0-3.1-1.4-3.1-3.1v-1.8C0 20.3 3.3 17 7.4 17h.5c1.3.6 2.8 1 4.4 1 .2 0 .6 0 1.2-.2 0 0 .3 0 .1.3-.8 1.5-1.1 3.2-1.1 4.8 0 2.5 1 4.7 2.7 6.3 0 0 .2.1 0 .1zM12.3 14.3c4 0 7.2-3.2 7.2-7.2S16.3 0 12.3 0 5.1 3.2 5.1 7.2s3.2 7.1 7.2 7.1zM32.4 17.1 26 11.6c-.6-.5-1.5-.1-1.5.7V15.1c-4.8.5-8.4 2.2-8.4 7.6 0 2.6 1.5 5.1 3.2 6.4.5.4 1.3-.1 1.1-.8-1.4-5 .1-7 4.1-7.5v2.4c0 .7.9 1.1 1.5.7l6.4-5.5c.4-.3.4-1 0-1.3z"></path></symbol><symbol id="discourse-follow-new-follower"viewBox="0 0 33 30"><path d="M23.1 29.2h1.5c.8 0 1.5-.7 1.5-1.5v-5.3h5.1c.8 0 1.5-.7 1.5-1.5v-1.5c0-.8-.7-1.5-1.5-1.5h-5.1v-5c0-.8-.7-1.5-1.5-1.5h-1.5c-.8 0-1.5.7-1.5 1.5v5h-4.7c-.8 0-1.5.7-1.5 1.5v1.5c0 .8.7 1.5 1.5 1.5h4.7v5.3c0 .8.6 1.5 1.5 1.5zM18.4 29.1v-3.9c0-.1-.1-.1-.1-.1h-2.5c-2.7 0-3.7-2.1-3.7-4V18c0-.2-.2-.2-.2-.2-1.3 0-2.6-.4-4-1h-.5c-4.1 0-7.4 3.3-7.4 7.4v1.9c0 1.7 1.4 3.1 3.1 3.1h15.2c0 .1.1 0 .1-.1z"></path><circle cx="12.5"cy="7.1"r="7.1"></circle></symbol><symbol id="discourse-follow-new-topic"viewBox="0 0 33 30"><path d="M32.6 21.6c-.6-.7-1.8-1.7-1.8-5 0-2.4-1.6-4.3-3.8-4.9-.3-1.6-2.4-1.6-2.7 0-2.2.6-3.9 2.5-3.9 4.9 0 3.3-1.2 4.3-1.8 5-.2.2-.3.5-.3.7 0 .5.4 1 1 1h12.5c.9 0 1.4-1.1.8-1.7zM20.1 29.2h-17c-1.7 0-3.1-1.4-3.1-3.1v-1.9c0-4.3 3.7-7.7 8-7.4 2.6 1.3 6 1.4 8.6.1 0 0 .1-.1.1 0 0 2.4-.5 2.8-1.2 3.5-2 2.1-.7 5.9 2.4 5.7h.8c.1 0 .1.3.1.4.1 1.1.6 1.8 1.3 2.7M25.6 29.2c1.7 0 3-1.3 3-2.9h-6c0 1.5 1.3 2.9 3 2.9zM12.3 14.2c3.9 0 7.1-3.2 7.1-7.1-.3-9.5-14-9.5-14.3 0 0 3.9 3.2 7.1 7.2 7.1z"></path></symbol><symbol id="downward"viewBox="0 0 512 512"><g><g><path d="M425.199,223.957c-13.303-13.303-34.961-13.303-48.205-0.06l-86.861,85.086V34.133C290.133,15.309,274.824,0,256,0    s-34.133,15.309-34.133,34.133v274.867l-86.801-85.052c-13.312-13.312-34.961-13.312-48.273,0    c-13.312,13.312-13.303,34.97,0,48.273c0.017,0.017,0.034,0.026,0.043,0.043l148.361,146.5c5.726,5.658,13.227,8.482,20.727,8.482    c7.543,0,15.078-2.859,20.787-8.568L425.199,272.23c6.451-6.443,10.001-15.019,10.001-24.132S431.65,230.409,425.199,223.957z"></path></g></g><g><g><path d="M401.067,443.733H110.933c-18.825,0-34.133,15.309-34.133,34.133S92.109,512,110.933,512h290.133    c18.825,0,34.133-15.309,34.133-34.133S419.883,443.733,401.067,443.733z"></path></g></g></symbol><symbol id="timeline"viewBox="0 0 3.24 10.5"><path d="M0 4.26v1.98c0 .74.5 1.34 1.12 1.34h1c.62 0 1.12-.6 1.12-1.34V4.26c0-.74-.5-1.34-1.12-1.34h-1C.5 2.92 0 3.52 0 4.26Z"class="cls-1"></path><rect width="1.08"height="10.5"x="1.08"class="cls-1"rx=".38"ry=".38"></rect></symbol></svg></div></div></discourse-assets-icons>
					<discourse-assets-stylesheets>
						<link href="https://cdn.linux.do/stylesheets/color_definitions_scheme__1_a158138234e187251f5d9b78942cf04237e45f6e.css?__ws=linux.do" media="(prefers-color-scheme: light)" rel="stylesheet" class="light-scheme"/>
						<link href="https://cdn.linux.do/stylesheets/color_definitions_scheme_4_1_71ea4a44cd666b20bcc6e1007d59deba3eb6b0dd.css?__ws=linux.do" media="(prefers-color-scheme: dark)" rel="stylesheet" class="dark-scheme"/>
						${deviceSpecificStyle}
					</discourse-assets-stylesheets>
				</discourse-assets>`);
			}, true)
			base.waitForKeyElements(`html > .${mount}`, (element) => {
				if (element.find("#discourseHelper-Style").length > 0) return;

				element.append(`<link id="katexStyle" href="https://unpkg.com/katex@0.16.21/dist/katex.min.css" media="all" rel="stylesheet">`)
				if (GM_getValue("replaceFont") === "true") {
					if (GM_getValue("replaceFontStyle") && GM_getValue("replaceFontStyle").startsWith("http")) element.append(`<link id="fontStyle" href="${GM_getValue("replaceFontStyle")}" media="all" rel="stylesheet">`)
					if (GM_getValue("replaceFontName")) element.append(`<style>
						* {
							font-family: "${GM_getValue("replaceFontName")}", sans-serif;
						}
					</style>`)
				}
				element.append(`<style id="discourseHelper-Style">
					html:has(#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body){overflow:hidden}
					.dialog-container:not(:last-of-type):has(~ .dialog-container) {display:none!important}
					.post-info.floor{color:var(--primary-med-or-secondary-med);margin-left:1em;font-family:Consolas,Monaco,'Lucida Console','Liberation Mono','DejaVu Sans Mono','Bitstream Vera Sans Mono','Courier New',monospace}
					div.topic-owner .topic-body .contents>.cooked::after{color:var(--tertiary-medium);content:"题主";margin-right:0.5em;position:sticky;bottom:0.5em;font-style:normal}
					a.previewTopic{color:var(--tertiary) !important;padding:0.1em}
					a.expandTopic,a.foldTopic{color:var(--primary-med-or-secondary-med)!important;font-weight:normal!important;margin-left:1em}

					.helper-toast{
						position: fixed;
						bottom: 13%;
						left: 50%;
						transform: translateX(-50%);
						z-index: 9999;
						max-width: 90%;
						padding: 10px 20px;
						border-radius: 50px;
						background-color: rgb(70 70 70 / 90%);
						backdrop-filter: blur(5px);
						color: white;
						box-shadow: 1px 1px 10px 0 #000000;
						font-size: small;
						white-space: nowrap;
						text-align: center;
						opacity: 0;
						pointer-events: none;
						transition: opacity 0.25s ease, transform 0.25s ease;
					}
					.helper-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
					.helper-toast strong{color:#FFD700}

					.folded-post.row{display:flex;flex-direction:row}
					.mobile-view .folded-post.row{display:block;border-top:1px solid var(--primary-low)}
					.mobile-view .topic-post.regular:has(.folded-post.row:not([style*="display: none"])) {position:relative}
					.mobile-view .topic-post.regular:has(.folded-post.row:not([style*="display: none"])) > *:not(.folded-post.row) {position:absolute;top:1px;left:1px}
					.folded-post .topic-avatar,.folded-post .topic-body{padding-top:10px}
					.folded-post .topic-body .cooked{padding:0 var(--topic-body-width-padding) 10px}
					.folded-post .topic-body .cooked > *{padding:0;margin:0}
					.mobile-view .folded-post .topic-body .cooked{padding:0 0 10px}


					#discourseHelper-Nav{position:fixed;bottom:50px;right:20px;display:flex;flex-direction:column;align-items:center;gap:13px;z-index:199}
					.floating-button,.biliButton{background-color:var(--tertiary);color:#fff;cursor:pointer;border:none;padding:0;transition:background-color 0.2s,box-shadow 0.2s,opacity 0.2s;display:flex;align-items:center;justify-content:center;border-radius:4px}
					.floating-button svg,.biliButton svg{fill:#fff}

					.biliButton{position:absolute;top:20px;right:20px;width:24px;height:24px;opacity:0.8}
					.biliButton:hover{opacity:1}
					.biliButton svg{width:12px;height:12px}

					.floating-button{width:40px;height:40px}
					.floating-button:hover,.floating-button.hover{box-shadow:0 0 10px 0px #cccccc66;background-color:var(--tertiary-hover)}
					.floating-button svg{width:24px;height:24px}
					.floating-button:before{transition:all 0.2s;position:absolute;transform:translateY(110%);background-color:rgba(0,0,0,0.8);color:white;padding:5px 10px;border-radius:4px;font-size:12px;white-space:nowrap;pointer-events:none;border-radius:5px;color:#fff;content:attr(data-title);z-index:2;opacity:0}
					.floating-button:hover:before{opacity:1}
				});
				</style>`);
			}, true)
		},
		addNaviStateTab() {
			base.waitForKeyElements(`.navigation-container #navigation-bar .bookmarks`, (element) => {
				if (element.next(".muted").length > 0) return;
				element.after(`<li title="被设置为免打扰的话题" class="muted ember-view nav-item_muted">
					<a href="/latest?state=muted">静音</a>
				</li><li title="被设置为追踪的话题" class="tracking ember-view nav-item_tracking">
					<a href="/latest?state=tracking">追踪</a>
				</li><li title="被设置为关注的话题" class="watching ember-view nav-item_watching">
					<a href="/latest?state=watching">关注</a>
				</li>`);
			});
		},
		hideRepliesColumn() {
			base.waitForKeyElements(`html > .${mount}`, (element) => {
				element.append(`<style>.topic-list .posts {display:none!important}</style>`);
			}, true);
		},
		hideViewsColumn() {
			base.waitForKeyElements(`html > .${mount}`, (element) => {
				element.append(`<style>.topic-list .views{display:none!important}</style>`);
			}, true);
		},
		hideActivityColumn() {
			base.waitForKeyElements(`html > .${mount}`, (element) => {
				element.append(`<style>.topic-list .activity{display:none!important}</style>`);
			}, true);
		},
		showTopicCreatedTime() {
			base.waitForKeyElements(`html > .${mount}`, (element) => {
				element.append(`<style>.topic-list .activity{width: 6em !important}</style>`);
			}, true);
			base.waitForKeyElements(".topic-list .age", (element) => {
				let createTime = element.attr("title")?.match(/创建日期：([\s\S]*?)最新：/)?.[1];
				if (createTime) {
					let timestamp = base.formatTimestamp(createTime)
					if (element.find(".post-activity.create").length > 0) return;
					let now = new Date().getTime();
					let timeDiff = now - timestamp;
					let rtf = new Intl.RelativeTimeFormat("zh-cn", { style: "short" });
					let getContent = (timeDiff) => {
						if (timeDiff < 1e3) {
							return "刚刚"; // 小于1秒显示“刚刚”
						} else if (timeDiff < 1e3 * 60) {
							return rtf.format(-Math.floor(timeDiff / 1e3), "second");
						} else if (timeDiff < 1e3 * 60 * 60) {
							return rtf.format(-Math.floor(timeDiff / (1e3 * 60)), "minute");
						} else if (timeDiff < 1e3 * 60 * 60 * 24) {
							return rtf.format(-Math.floor(timeDiff / (1e3 * 60 * 60)), "hour");
						} else if (timeDiff < 1e3 * 60 * 60 * 24 * 30) { // 小于30天
							return rtf.format(-Math.floor(timeDiff / (1e3 * 60 * 60 * 24)), "day");
						} else if (timeDiff < 1e3 * 60 * 60 * 24 * 365) { // 小于一年
							element.prepend(`<div class="post-activity"><img style="width:20px;vertical-align:middle;" src="https://cdn.ldstatic.com/original/4X/4/0/8/408c29a1d1dfaada3160fb2ae366cf3a7c7c1696.png"></div>`);
							return rtf.format(-Math.floor(timeDiff / (1e3 * 60 * 60 * 24 * 30)), "month");
						} else { // 超过一年
							element.prepend(`<div class="post-activity"><img style="width:20px;vertical-align:middle;" src="https://cdn.ldstatic.com/original/4X/4/0/8/408c29a1d1dfaada3160fb2ae366cf3a7c7c1696.png"></div>`);
							return rtf.format(-Math.floor(timeDiff / (1e3 * 60 * 60 * 24 * 365)), "year");
						}
					};
					element.append(`<div class="post-activity create"><span>${pangu.spacing(getContent(timeDiff))}</span></div>`);
				}
			})
		},
		topicNewTab() {
			// 话题列表中的每个项目
			base.waitForKeyElements('.topic-list-item, tr', (element) => {
				let anchor = element.find('a.title');
				if (!anchor.length > 0 || anchor.attr("target") === "_blank") return;

				let aclones = element.find('a');
				aclones.each((index, element) => {
					element = $(element)
					let elemclone = element.clone();
					if (!element.attr("href") || element.data("user-card")) return;
					elemclone.attr("target", "_blank");
					elemclone.attr("href", base.getFullLink(element.attr('href')));
					elemclone.on("click", (event) => {
						event.stopPropagation();
					});
					element.replaceWith(elemclone);
				})
			});

			// 搜索结果链接
			base.waitForKeyElements('.item > a.search-link', (element) => {
				if (element.attr("target") === "_blank") return;

				let elemclone = element.clone();

				elemclone.attr("target", "_blank");
				elemclone.attr("href", base.getFullLink(elemclone.attr('href')));
				elemclone.on("click", (event) => {
					event.stopPropagation();
				});

				element.replaceWith(elemclone);
			});

			// 其它链接
			base.waitForKeyElements(`
				li.item > a[href*="/t/topic/"],
				li:not([class]) > a[href*="/t/topic/"],
				div > a[href*="/t/topic/"]:not(.arrow, .widget-link, .start-date, .now-date),
				p > a[href*="/t/topic/"],
				.read > a[href*="/t/topic/"],
				div:not(.category-box-heading) > a[href*="/c/"],
				div > a[href*="/tag/"]
			`, (element) => {
				if (element.attr("target") === "_blank") return;

				let elemclone = element.clone();

				elemclone.attr("target", "_blank");
				elemclone.attr("href", base.getFullLink(elemclone.attr('href')));
				elemclone.on("click", (event) => {
					event.stopPropagation();
				});

				element.replaceWith(elemclone);
			});
		},
		topicPreviewer() {
			let preButton = `<a title="预览" class="topic-status previewTopic">
				<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
					<use href="#eye"></use>
				</svg>
			</a>`;
			base.waitForKeyElements("tr[data-topic-id], h1[data-topic-id]", (element) => {
				let topicId = element.data("topic-id") || element.find('aa[href*="/t/topic/"').attr("href").match(/\/t\/topic\/(\d+)/)?.[1]
				if (element.find(".previewTopic").length > 0 || element.prev(".previewTopic").length > 0 || !topicId) return;
				let status = element.find(".topic-statuses");
				let button = $(preButton);
				button.on("click", (event) => {
					event.preventDefault(); // 停止链接冒泡，不映射到复制后的项目自己的点击事件
					event.stopPropagation(); // 停止链接冒泡，不映射到复制后的项目自己的点击事件
					base.previewTopic(topicId)
				})
				button.data("preview", topicId)
				status.prepend(button)
			})
			base.waitForKeyElements(`
				div.topic a[href*="/t/topic/"],
				.cooked div.title a[href*="/t/topic/"],
				.cooked p > a[href*="/t/topic/"],
				.cooked td:not([class]) > a[href*="/t/topic/"],
				li.item > a[href*="/t/topic/"],
				li:not([class]) > a[href*="/t/topic/"]`,
				(element) => {
					if (!element.attr("href") || element.data("preview") || element.is(":hidden") || element.prev(".previewTopic").length > 0 || element.find(".previewTopic").length > 0) return;
					let url = new URL(element.attr("href"), location.href);
					if (url.host !== location.host) return;

					let topicId = element.attr("href").match(/\/t\/topic\/(\d+)/)?.[1];
					let locationTopicId = location.pathname.match(/\/t\/topic\/(\d+)/)?.[1];
					let elemTopicId = element.attr("parenttopic")
					let elemStatus = element.find(".topic-statuses")
					if (!topicId || locationTopicId === topicId || elemTopicId === topicId) return;

					let button = $(preButton);
					button.off("click").on("click", (event) => {
						event.preventDefault();
						event.stopPropagation();
						base.previewTopic(topicId);
					});

					button.attr("preview", topicId)
					if (elemStatus.length > 0) {
						elemStatus.prepend(button);
					} else if (element.parent().prop('tagName') === "LI") {
						element.append(button);
					} else {
						element.before(button);

						// 监听原始元素是否还存在，不在就一起删掉
						let observer = new MutationObserver((mutationsList) => {
							mutationsList.forEach((mutation) => {
								if (!document.contains(element[0])) {
									button.remove();
									observer.disconnect();
								}
							});
						});
						observer.observe(element.parent()[0], { childList: true, subtree: true });
					}
				})
		},
		topicFloorIndicator() {
			base.waitForKeyElements(".topic-post article", (element) => {
				let floor = element.attr("id")?.match(/^post_(\d+)/)?.[1];
				let infos = element.find(".post-infos")
				if (floor && infos.length > 0 && infos.find("floor").length === 0 && !infos.data("floor")) {
					infos.find("floor").remove();
					infos.append(`<span class="post-info floor">L${floor}</span>`);
					infos.data("floor", floor);
				} else {
					return;
				}
			})
		},
		autoHeight() {
			base.waitForKeyElements(`html > .${mount}`, (element) => {
				element.append(`<style>
					.topic-body .cooked {
						max-height:600px!important;
						overflow-y:auto!important;
					}
				</style>`);
			}, true);
		},
		expandReply() {
			base.waitForKeyElements("nav.post-controls > button.show-replies", (element) => {
				if (element.data("checked")) return;
				element.click();
				element.data("checked", "true");
			})
		},
		foldUselessReply() {
			// 部分代码来源于“Linux Do 量子速读”脚本
			// 下面的文章元素非常刁钻，稍有不慎改加载位置就有可能会整体卡住
			base.waitForKeyElements(".post-stream > div.topic-post.clearfix.regular:not(:first-of-type)", (element) => {
				if (element.prev("article").length > 0) return;

				let cooked = element.find(".contents > .cooked");
				let metadata = element.find(".topic-meta-data");
				let infos = element.find(".topic-meta-data .post-infos");
				let floorMatch = element.find("article.boxed").attr("id")?.match(/^post_(\d+)/);
				let floor = floorMatch ? floorMatch[1] : null;

				if (!cooked.length || !metadata.length || element.find(`.folded-post[floor="${floor}"]`).length) return;
				if (!base.isMeaninglessReply(cooked.clone().find('a.lightbox, aside').text('').end().text()) && !element.hasClass("post-hidden")) return;

				let article = $(`<div class="row folded-post" floor="${floor}">
					<div class="topic-avatar">
						<div class="post-avatar">${element.find(".topic-avatar .post-avatar").html()}</div>
					</div>
					<div class="topic-body">
						<div class="topic-meta-data embedded-reply">
							<div class="names trigger-user-card">${metadata.find(".names .first")[0].outerHTML}</div>
							<div class="post-infos" style="display:flex;">
								<a title="展开" class="topic-status expandTopic">
									<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
										<use href="#caret-down"></use>
									</svg>
								</a>
								<span class="post-info floor">${GM_getValue("topicFloorIndicator") === "true" && floor ? `L${floor}` : ""}</span>
							</div>
						</div>
						<div class="cooked"></div>
					</div>
				</div>`);

				let content = cooked.clone();
				if (content.length > 0) {
					content.find("aside.title, .previewTopic").remove();
					content.find(".lightbox").replaceWith("[图片]");
					content.find("iframe").replaceWith("[网页]");
					content.find("aside").replaceWith("[OneBox]");
					content.find("h1, h2, h3, h4, h5, h6").each(function () {
						let $heading = $(this);
						let $paragraph = $("<p>").html($heading.html());
						$heading.replaceWith($paragraph);
					});
					content.find("*").filter(function () {
						return (
							$(this).is(":empty") &&
							$(this).children().length === 0 &&
							Object.keys(this.attributes).length === 0
						);
					}).remove();
					article.find(".cooked").append(content.html());
				}
				let reply = metadata.find(".reply-to-tab").clone();
				if (reply.length > 0) {
					reply.css({ margin: "0", cursor: "auto" }).attr("title", "");
					reply.find("[title]").attr("title", "");
					article.find(".post-infos").prepend(reply);
				}
				let readState = metadata.find(".read-state").clone();
				if (readState.length > 0) {
					let observer = new MutationObserver((mutations) => {
						mutations.forEach((mutation) => {
							if (mutation.type === "attributes") {
								readState.attr(mutation.attributeName, metadata.find(".read-state").attr(mutation.attributeName));
							} else if (mutation.type === "childList") {
								readState.empty().append(metadata.find(".read-state").contents().clone());
							}
						});
					});
					observer.observe(metadata.find(".read-state")[0], { attributes: true, childList: true, subtree: true });
					article.find(".post-infos").prepend(readState);
				}
				article.find(".expandTopic").on("click", () => {
					article.hide();
					article.prevAll().css({
						"height": "",
						"width": "",
						"opacity": "",
						"pointer-events": "",
						"white-space": ""
					});
				});
				let fold = $(`<a title="收起" class="topic-status foldTopic">
					<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
						<use href="#caret-up"></use>
					</svg>
				</a>`);
				fold.on("click", () => {
					article.show();
					article.prevAll().css({
						"height": "0",
						"width": "0",
						"opacity": "0",
						"pointer-events": "none",
						"white-space": "nowrap"
					});
				});
				if (infos.length > 0 && infos.find(".floor").length > 0) {
					infos.find(".floor").before(fold);
				} else if (infos.length > 0) {
					infos.append(fold);
				}
				element.append(article);
				article.prevAll().css({
					"height": "0",
					"width": "0",
					"opacity": "0",
					"pointer-events": "none",
					"white-space": "nowrap"
				});
			});
		},
		foldUselessReplyOpacity() {
			base.waitForKeyElements(`html > .${mount}`, (element) => {
				element.append(`<style>
					.folded-post.row{transition:opacity 0.3s ease;opacity:0.5}
					.folded-post.row:hover{opacity:1}
				</style>`);
			}, true);
		},
		replaceEmoji(style = "fluentui") {
			let emojiStyles = [
				{ value: "unicode", label: "通用 Unicode" },
				{ value: "noto", label: "谷歌（Noto Emoji）" },
				{ value: "fluentui", label: "微软（FluentUI）" },
				{ value: "twemoji", label: "推特（Twitter Emoji）" },
				{ value: "openmoji", label: "OpenMoji" }
			]
			let hasStyle = emojiStyles.some(emojiStyle => emojiStyle.value === style);
			if (hasStyle) {
				// 更换样式
				base.waitForKeyElements('img.emoji:not(.emoji-custom)', (element) => {
					let url = new URL(element.attr('src'), location.href)
					let emojiRegex = /images\/emoji\/([^/]+)\//
					let emojiMatch = url.pathname.match(emojiRegex)
					if (emojiMatch?.[1] && emojiMatch?.[1] !== style) {
						url.pathname = url.pathname.replace(emojiRegex, `images/emoji/${style}/`);
						element.attr('src', url.href)
					}
				})
				base.waitForKeyElements('img.emoji', (element) => {
					let url = new URL(element.attr('src'), location.href)
					if (url.host.includes(".digitaloceanspaces.com")) {
						url.host = "cdn.ldstatic.com";
						element.attr('src', url.href)
					}
				})
			} else {
				// 替换为系统字符
				base.waitForKeyElements('img.emoji:not(.emoji-custom)', (element) => {
					let url = new URL(element.attr('src'), location.href)
					let emojiRegex = /images\/emoji\/[^/]+\/([^/.]+)/;
					let emojiMatch = url.pathname.match(emojiRegex);
					if (emojiMatch?.[1]) {
						let emojiName = emojiMatch[1];
						let emojiChar = base.getEmoji(emojiName)
						if (emojiChar) {
							let elemmoji = $(`<span>${emojiChar}</span>`)
							let newStyles = {};
							Array.from(element[0].attributes).forEach(attr => {
								if (attr.name === "width" || attr.name === "height") {
									newStyles[attr.name] = `${attr.value}px`;
								} else if (attr.name === "style") {
									let existingStyles = attr.value.split(';').reduce((styles, rule) => {
										let [key, value] = rule.split(':').map(part => part.trim());
										if (key && value) styles[key] = value;
										return styles;
									}, {});
									Object.assign(newStyles, existingStyles);
								} else if (attr.name !== "src") {
									elemmoji.attr(attr.name, attr.value);
								}
							});
							if (Object.keys(newStyles).length > 0) {
								elemmoji.css(newStyles);
							}
							element.replaceWith(elemmoji);
						}
					}
				});
			}
		},
		async replaceTheme(style) {
			let hasStyle = base.themeStyles.some(themeStyle => themeStyle.label === style);
			let custom = GM_getValue("replaceBackground");
			if (hasStyle) {
				let themeStyle = base.themeStyles.find(themeStyle => themeStyle.label === style);
				let styles = $(`<discourse-${themeStyle.label}-stylesheets>${themeStyle.content}</discourse-${themeStyle.label}-stylesheets>`)
				styles.attr("themeStyles", themeStyle.label)
				base.waitForKeyElements(`*:not(.${mount}) > discourse-assets`, (element) => {
					if (element.next(`discourse-${themeStyle.label}-stylesheets[themeStyles]`).length > 0) return;
					element.after(styles);
				}, true)
			} else if (style === "custom" && custom && (custom.startsWith("http") || custom.startsWith("data") || custom === "bing")) {
				if (custom === "bing") {
					let bing = await base.get("https://www.bing.com/HPImageArchive.aspx?format=js&n=1&mkt=zh-CN", { "Referer": "https://www.bing.com/" })
					if (!bing?.images[0]?.url) return;
					custom = new URL(bing?.images[0]?.url, "https://www.bing.com/HPImageArchive.aspx").href;
				}
				base.waitForKeyElements(`html > .${mount}:not(:has(#customBg))`, (element) => {
					element.append(`<style id="customBg">
						html {
							background-image: url("${custom.replace(/(["'\\])/g, "\\$1")}");
							background-position: center center;
							background-attachment: fixed;
							background-size: cover;
							position: relative;
						}
						html::before {
							content: "";
							position: fixed;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							background-color: rgba(var(--secondary-rgb), 0.9);
							z-index: -9999;
							pointer-events: none;
						}
						.d-header {
							background-color: rgba(var(--secondary-rgb), 0.6);
							backdrop-filter: blur(10px);
							-webkit-backdrop-filter: blur(10px);
						}
						mobile-view body,
						.user-main .about .details,
						.user-menu .quick-access-panel .read, .user-notifications-list .read,
						.sidebar-wrapper,
						.sidebar-footer-wrapper,
						.sidebar-footer-wrapper .sidebar-footer-container::before,
						.user-content,
						.post-list .post-list-item {
							background: transparent !important;
						}
						aside.onebox {
							background-color: rgba(var(--secondary-rgb), 0.6) !important;
							backdrop-filter: blur(10px);
							-webkit-backdrop-filter: blur(10px);
						}
					</style>`);
				}, true)
			}
		},
		optimizeBiliPlayer() {
			base.waitForKeyElements("iframe", (element) => {
				if (element.data("checked")) return;
				let elemclone = element.clone();
				let url = element.attr("src");
				try { url = new URL(url, location.href) } catch (e) { return }
				if (url.host !== "player.bilibili.com") return;
				let params = url.searchParams;

				if (!params.has("autoplay") || params.get("autoplay") !== "0") {
					params.set("autoplay", "0");
				}
				if (!params.has("hideCoverInfo") || params.get("hideCoverInfo") !== "1") {
					params.set("hideCoverInfo", "1");
				}
				if (!params.has("noEndPanel") || params.get("noEndPanel") !== "0") {
					params.set("noEndPanel", "1");
				}
				if (!params.has("musth5") || params.get("musth5") !== "0") {
					params.set("musth5", "1");
				}
				if (!params.has("crossDomain") || params.get("crossDomain") !== "0") {
					params.set("crossDomain", "1");
				}
				if (!params.has("highQuality") || params.get("highQuality") !== "1" || !params.has("high_quality") || params.get("high_quality") !== "1") {
					params.set("highQuality", "1");
					params.set("high_quality", "1");
				}

				if (!elemclone.attr("referrerpolicy") || elemclone.attr("referrerpolicy") !== "no-referrer") {
					elemclone.attr("referrerpolicy", "no-referrer");
				}

				if (GM_getValue("optimizeBiliPlayerMobile") === "true") {
					url.host = "www.bilibili.com";
					url.pathname = "/blackboard/html5mobileplayer.html";
					params.delete("hideCoverInfo");
					params.delete("autoplay");
					let getVideoId = () => {
						let bvid = params.get('bvid') || params.get('bvid');
						if (bvid) return `BV${bvid.replace('BV', '')}`;
						let aid = params.get('aid') || params.get('aid');
						if (aid) return `av${aid.replace('av', '')}`;
						let pathMatch = url.pathname.match(/(av\d+|BV\w+)/);
						return pathMatch ? pathMatch[0] : null;
					};
					let videoId = getVideoId();
					let jumpBtn = $('<button>')
						.addClass("biliButton")
						.attr("title", "跳转原视频")
						.html('<svg><use xlink:href="#up-right-from-square"></use></svg>')
						.click(() => {
							if (videoId) {
								window.open(`https://www.bilibili.com/video/${videoId}`, '_blank');
							} else {
								alert("错误：未匹配到视频标识符。")
							}
						});

					elemclone.attr("src", url.href);
					elemclone.data("checked", true);
					element.replaceWith($('<div>').css({
						position: 'relative',
						display: 'inline-block'
					}).append(elemclone, jumpBtn));
					return;
				}

				elemclone.attr("src", url.href);
				elemclone.data("checked", true);
				element.replaceWith(elemclone);
			});
		},
		optimizePageText() {
			setInterval(() => {
				pangu.spacingElementById('main');
				pangu.spacingElementByClassName("cooked");
				pangu.spacingElementByTagName("h1");
				pangu.spacingElementByTagName('span');
			}, 2000)
		},
		newTabIndicator() {
			base.waitForKeyElements(`html > .${mount}`, (element) => {
				element.append(`<style>
					a[target="_blank"]:not([data-clicks], [data-user-card], .badge, .badge-posts, .post-activity, .search-link, .lightbox, .topic-excerpt, :has(div, .relative-date)):after,
					a.search-link[target="_blank"] .topic-title:after {
						content: "\u2197\ufe0e";
						margin-left: 0.2em;
						color: var(--primary-medium);
						font-family: sans-serif;
					}
				</style>`);
			}, true)
		},
		a11yCloseButton() {
			base.waitForKeyElements("#reply-control .save-or-cancel .cancel", (element) => {
				if ($("#bigClose").length > 0) return;
				let realCloseButton = element.parent().find(".btn.btn-text.cancel.btn-transparent");
				if (realCloseButton.length) {
					realCloseButton.hide();
					let closeButton = $(`<button id="bigClose" class="btn no-text btn-icon cancel btn-transparent" title="关闭" type="button">
						<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#trash-can"></use></svg>
						<span aria-hidden="true"></span>
					</button>`)
					closeButton.on('click', () => {
						realCloseButton.click();
					});
					element.before(closeButton)
				}
			})
		},
		editor: {
			optimizeInputButton() {
				base.waitForKeyElements("#reply-control .save-or-cancel .create", (element) => {
					if ($("#optimize").length > 0) return;
					element.css({ "margin-right": "0.5em" });
					let optimizeButton = $(`<button id="optimize" style="margin: 0 0.5em;" class="btn btn-icon-text" type="button" title="自动在中英文间添加空格（优化后可能无法撤回）">
						<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#spell-check"></use></svg>
						<span class="d-button-label">排印优化</span>
					</button>`)
					optimizeButton.on('click', () => {
						let editorInput = $(".d-editor-input");
						let originalContent = editorInput.val();
						let content = pangu.spacing(originalContent);
						optimizeButton.prop('disabled', true);
						if (originalContent !== content) {
							editorInput.val("");
							editorInput.focus();
							for (let i = 0; i < content.length > 0; i++) {
								let char = content[i];
								editorInput.val(editorInput.val() + char);

								let inputEvent = new Event("input", { bubbles: true, cancelable: true });
								editorInput[0].dispatchEvent(inputEvent);
								let keyEvent = new KeyboardEvent("keydown", { key: char, char, keyCode: char.charCodeAt(0), which: char.charCodeAt(0), bubbles: true });
								editorInput[0].dispatchEvent(keyEvent);
							}
							optimizeButton.find('.d-button-label').text("优化完成");
						} else {
							optimizeButton.find('.d-button-label').text("无需优化");
						}

						setTimeout(() => {
							optimizeButton.prop('disabled', false);
							optimizeButton.find('.d-button-label').text("排印优化");
							optimizeButton.prop('disabled', false);
						}, 1000);
					});
					element.after(optimizeButton)
				})
			},
			japaneseInputButton() {
				base.waitForKeyElements("#reply-control .save-or-cancel .create", (element) => {
					if ($("#optimizeJP").length > 0) return;
					if ($("#optimize").length > 0) { element = $("#optimize") };
					let japaneseButton = $(`<button id="optimizeJP" style="margin: 0 0.5em;" class="btn btn-icon-text" type="button" title="将内容包裹日文标签，以使系统显示日文字体（优化后可能无法撤回）">
						<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#language"></use></svg>
						<span class="d-button-label">日文优化</span>
					</button>`)
					japaneseButton.click(function () {
						let editorInput = $(".d-editor-textarea-wrapper textarea");
						let currentContent = $(".d-editor-input").val();
						let content = `<div lang="ja">\n\n${currentContent}\n\n</div>`;
						japaneseButton.prop('disabled', true);
						if (currentContent.trim().startsWith("<div lang=\"ja\">") && currentContent.trim().endsWith("</div>")) {
							japaneseButton.find('.d-button-label').text("无需优化");
						} else {
							editorInput.val("");
							editorInput.focus();
							for (let i = 0; i < content.length > 0; i++) {
								let char = content[i];
								editorInput.val(editorInput.val() + char);

								let inputEvent = new Event("input", { bubbles: true, cancelable: true });
								editorInput[0].dispatchEvent(inputEvent);
								let keyEvent = new KeyboardEvent("keydown", { key: char, char, keyCode: char.charCodeAt(0), which: char.charCodeAt(0), bubbles: true });
								editorInput[0].dispatchEvent(keyEvent);

								japaneseButton.find('.d-button-label').text("优化完成");
							}
						}

						setTimeout(() => {
							japaneseButton.prop('disabled', false);
							japaneseButton.find('.d-button-label').text("日文优化");
						}, 1000);
					});
					element.after(japaneseButton)
				})
			},
		},
		cdnAvatarReplace() {
			function errorHandler(event) {
				let element = event.target;
				try {
					let url = new URL(element.src);

					let usernameMatch =
						url.pathname.match(/user_avatar\/[^/]+\/([^/]+)\/[^/]+\/[^/]+\.[^/]+$/i) ||
						url.pathname.match(/letter_avatar\/([^/]+)\/[^/]+\/[^/]+\.[^/]+$/i);

					if (usernameMatch && usernameMatch[1]) {
						let username = usernameMatch[1];
						username = username.replace(/[^a-zA-Z0-9]/g, "");
						let firstTwoChars = username.slice(0, 2).toLowerCase();
						let auth0URL = `https://cdn.auth0.com/avatars/${firstTwoChars}.png`;

						element.src = auth0URL;
						let observer = new MutationObserver((mutationsList) => {
							for (let mutation of mutationsList) {
								if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
									if (element.src !== auth0URL) {
										element.src = auth0URL;
									}
								}
							}
						});
						observer.observe(element, {
							attributes: true,
							attributeFilter: ['src']
						});
					}
				} catch (e) { }
			}
			base.waitForKeyElements("img", (element) => {
				if (element.data("checked")) return;
				let src = element.attr("src");
				try {
					let url = new URL(src, location.href);
					if (url.host === "cdn.linux.do" && !/^\/[^/]*$/.test(url.pathname)) {
						url.host = "linux.do";
						element.attr("src", url.href);
					} else if (url.pathname.startsWith("/uploads/default/original")) {
						url.host = "cdn.ldstatic.com";
						url.pathname = url.pathname.replace("/uploads/default", "");
						element.attr("src", url.href);
					}
					if (element[0].complete && element[0].naturalWidth === 0) {
						errorHandler({ target: element[0] });
					}
					element.off("error", errorHandler).on("error", errorHandler);
				} catch (e) { }
				element.data("checked", true);
			});
		},
	}

	$(document).on('keydown', function (event) {
		if (event.keyCode === 27) {
			let element = $('#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body');
			if (element.length > 0) {
				let lastDialogBody = element.last();
				let elemparent = lastDialogBody.parent().parent();
				elemparent.remove();
			}
		}
	});

	let main = {
		async init() {
			base.initDefaultConfig();

			discourse.addStyle();
			discourse.addMenu();

			if (GM_getValue("beautifyLoading") === "true") {
				let refreshAnimation = $(`<div id="dialog-holder" class="discourseLoading dialog-container">
					<style>
						#d-splash{display:none!important}
						#dialog-holder:not([aria-hidden="true"]){z-index:9999;position:fixed;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center}
						#dialog-holder:not([aria-hidden="true"]) .dialog-content .dialog-body{max-height:none;max-width:none;margin:0;width:calc(100% - 2em)}
						#dialog-holder:not([aria-hidden="true"]) .dialog-content{background-color:transparent;box-shadow:none}
					</style>
					<div class="dialog-content">
						<div class="dialog-body">
							<section class="d-splash">
								<style>
									.d-splash{--dot-color:var(--tertiary);display:grid;place-items:center;background-color:var(--secondary);position:fixed;height:100%;width:100%;top:0;left:0;z-index:9999}
									.d-splash .preloader{--splash-dot-size:max(1vw,25px);--splash-dot-spacing:calc(var(--splash-dot-size) * 1.5);width:calc((var(--splash-dot-size) + var(--splash-dot-spacing)) * 5)}
									.d-splash .preloader .dots{animation-name:d-splash-loader;animation-timing-function:ease-in-out;animation-duration:2s;animation-iteration-count:infinite;animation-delay:calc(var(--n) * 0.15s);position:absolute;top:calc(50% - var(--splash-dot-size) / 2);left:calc((50% - var(--splash-dot-size) / 2) + (var(--n) * var(--splash-dot-spacing)));transform-origin:calc((var(--splash-dot-spacing) * var(--n) * -1) + var(--splash-dot-size)/2) center;width:var(--splash-dot-size);height:var(--splash-dot-size);border-radius:50%;background-color:var(--dot-color);filter:saturate(2) opacity(0.85);opacity:0}
									@keyframes d-splash-fade-in{0%{opacity:0}100%{opacity:1}}
									@keyframes d-splash-loader{0%{opacity:0;transform:scale(1)}45%{opacity:1;transform:scale(0.7)}65%{opacity:1;transform:scale(0.7)}100%{opacity:0;transform:scale(1)}}
								</style>
								<div class="preloader" elementtiming="discourse-splash-visible">
									<div class="dots" style="--n:-3;"></div>
									<div class="dots" style="--n:-2;"></div>
									<div class="dots" style="--n:-1;"></div>
									<div class="dots" style="--n:0;"></div>
									<div class="dots" style="--n:1;"></div>
									<div class="dots" style="--n:2;"></div>
									<div class="dots" style="--n:3;"></div>
								</div>
								<p>Discourse Helper</p>
								<p id="loading">加载中...</p>
							</section>
						</div>
					</div>
				</div>`);
				$("html").append(refreshAnimation);
				setTimeout(() => {
					let loaded = $("<a>卡住了？点我关闭</a>")
					loaded.on("click", () => {
						refreshAnimation.remove();
					})
					refreshAnimation.find("#loading").html(loaded)
				}, 8000)
				window.addEventListener('DOMContentLoaded', () => {
					refreshAnimation.remove();
				});
				window.onload = () => {
					refreshAnimation.remove();
				}
				window.addEventListener('beforeunload', (event) => {
					refreshAnimation.find("#loading").html("加载中...")
					$("html").append(refreshAnimation);
				});
				base.waitForKeyElements(`section.ember-application#main`, () => {
					refreshAnimation.remove();
				}, true)
			}

			if (GM_getValue("addNaviStateTab") === "true") {
				discourse.addNaviStateTab();
			}
			if (GM_getValue("hideRepliesColumn") === "true") {
				discourse.hideRepliesColumn();
			}
			if (GM_getValue("hideViewsColumn") === "true") {
				discourse.hideViewsColumn();
			}
			if (GM_getValue("hideActivityColumn") === "true") {
				discourse.hideActivityColumn();
			}
			if (GM_getValue("showTopicCreatedTime") === "true" && GM_getValue("hideActivityColumn") !== "true") {
				discourse.showTopicCreatedTime();
			}
			if (GM_getValue("topicNewTab") === "true") {
				discourse.topicNewTab();
			}
			if (GM_getValue("previewTopic") === "true") {
				discourse.topicPreviewer();
			}
			if (GM_getValue("topicFloorIndicator") === "true") {
				discourse.topicFloorIndicator();
			}
			if (GM_getValue("autoHeight") === "true") {
				discourse.autoHeight();
			}
			if (GM_getValue("expandReply") === "true") {
				discourse.expandReply();
			}
			if (GM_getValue("foldUselessReply") === "true") {
				discourse.foldUselessReply();
			}
			if (GM_getValue("foldUselessReply") === "true" && GM_getValue("foldUselessReplyOpacity") === "true") {
				discourse.foldUselessReplyOpacity();
			}
			if (GM_getValue("replaceEmoji") !== "false") {
				discourse.replaceEmoji(GM_getValue("replaceEmoji"));
			}
			if (GM_getValue("replaceTheme") !== "false") {
				discourse.replaceTheme(GM_getValue("replaceTheme"));
			}
			if (GM_getValue("optimizeBiliPlayer") === "true") {
				discourse.optimizeBiliPlayer();
			}
			if (GM_getValue("optimizePageText") === "true") {
				discourse.optimizePageText();
			}
			if (GM_getValue("newTabIndicator") === "true") {
				discourse.newTabIndicator();
			}
			if (GM_getValue("a11yCloseButton") === "true") {
				discourse.a11yCloseButton();
			}
			if (GM_getValue("optimizeEditorButton") === "true") {
				discourse.editor.optimizeInputButton();
			}
			if (GM_getValue("japaneseEditorButton") === "true") {
				discourse.editor.japaneseInputButton();
			}
			if (GM_getValue("cdnAvatarReplace") === "true") {
				discourse.cdnAvatarReplace();
			}
		}
	}
	main.init();

	// 这是啥？我不到啊
	function idontknow(input) {
		let charArray = input.split('');
		// Fisher-Yates 洗牌算法
		for (let i = charArray.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[charArray[i], charArray[j]] = [charArray[j], charArray[i]];
		}
		return charArray.join('');
	}
})();