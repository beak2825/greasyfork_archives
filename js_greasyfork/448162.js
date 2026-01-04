// ==UserScript==
// @name         BOSS 直聘 跨境黑名单
// @namespace    https://github.com/iibeibei
// @version      0.3.3
// @description  可以在 BOSS 直聘、智联招聘、前程无忧 上 显示 若比邻的 黑名单，应 Facebook 群友要求，分享一下 祝大家早日找到好工作
// @author       Beibei
// @license      GPLv3

// @match        https://*.zhipin.com/*
// @match        https://*.zhaopin.com/*
// @match        https://*.51job.com/*

// @connect      kjrate.com
// @connect      kjxb.org

// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        unsafeWindow

// @compatible   firefox Tampermonkey
// @compatible   chrome Tampermonkey
// @compatible   edge Tampermonkey

// @require      https://unpkg.com/jquery
// @require      https://unpkg.com/moment
// @require      https://unpkg.com/sweetalert2
// @require      https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @require      https://update.greasyfork.org/scripts/448161/1362731/Beibeijs.js

// @resource     element-plus    https://unpkg.com/element-plus/dist/index.css

// @note         0.3.3 修复 BOSS直聘 修复首页不显示黑名单标签的BUG
// @note         0.3.2 修复 BOSS直聘 修复首页不显示黑名单的BUG
// @note         0.3.1 新加 BOSS直聘 搜索页面添加若比邻黑名单属性标签
// @note         0.3.0 新加 BOSS直聘 岗位最近编辑时间更换成新版若比邻黑名单最后更新时间
// @note         0.2.9 移除 BOSS直聘 岗位最近编辑时间失效了，移除相关代码
// @note         0.2.9 新加 BOSS直聘 刨了小红书tzy大佬的, 添加岗位最近编辑时间
// @note         0.2.8 修复 BOSS直聘 更新新的若比邻网站
// @note         0.2.7 修复 BOSS直聘 职位页面错误显示的问题
// @note         0.2.6 修复 BOSS直聘 所有页面都在新标签打开
// @note         0.2.0 修复 BOSS直聘 聊天页改版不显示的问题
// @note         0.1.5 修复 BOSS直聘 搜索页改版不显示的问题
// @note         0.1.4 修复 BOSS直聘 详情页改版不显示的问题
// @downloadURL https://update.greasyfork.org/scripts/448162/BOSS%20%E7%9B%B4%E8%81%98%20%E8%B7%A8%E5%A2%83%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/448162/BOSS%20%E7%9B%B4%E8%81%98%20%E8%B7%A8%E5%A2%83%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

// append() - 在被选元素的结尾插入内容（内容的结尾，比如说有个a标签，则是在</a>这个标签之前添加东西） <a>    [append]</a>
// prepend() - 在被选元素的开头插入内容（内容的开始，比如说有个a标签，则是在<a>这个标签之后添加东西） <a>[prepend]   </a>
// after() - 在被选元素之后插入内容（元素的结尾，比如说有个a标签，则是在</a>这个标签之后添加东西）    <a>    </a>[after]
// before() - 在被选元素之前插入内容（内容的开始，比如说有个a标签，则是在<a>这个标签之前添加东西）    [before]<a>    </a>

// 初始化脚本
var version_url = 'https://greasyfork.org/zh-CN/scripts/448162';
var menu_ALL = [['menu_amazon', 'Amazon', 'Amazon', true]];
// initializationScript()
loadMenu(menu_ALL, version_url);

// BOSS 直聘
waitForKeyElements('.boss-name', 'zhipin.com', ['/web/geek'], false, false, 'node.after($(insert_html))', actionFunction);
waitForKeyElements('.level-list > .company-name', 'zhipin.com', ['/job_detail'], false, false, 'node.append($(insert_html))', actionFunction);
waitForKeyElements('a[ka="job-detail-company_custompage"]', 'zhipin.com', ['/job_detail'], false, false, 'node.append($(insert_html))', actionFunction);
waitForKeyElements('.base-info.fl > span:nth-child(2)', 'zhipin.com', ['/web/geek'], false, false, 'node.append($(insert_html))', actionFunction);
waitForKeyElements('.name-box > span:nth-child(2)', 'zhipin.com', ['/web/geek'], false, false, 'node.append($(insert_html))', actionFunction);
waitForKeyElements('.info-primary > .info > .name', 'zhipin.com', ['/gongsi'], false, false, 'node.append($(insert_html))', actionFunction);
waitForKeyElements('.business-detail-name', 'zhipin.com', ['/gongsi'], false, false, 'node.append($(insert_html))', actionFunction);
// 智联招聘
waitForKeyElements('.iteminfo__line1__compname__name', 'zhaopin.com', ['/'], false, false, 'node.after($(insert_html))', actionFunction);
waitForKeyElements('.company__title', 'zhaopin.com', ['/'], false, false, 'node.after($(insert_html))', actionFunction);
waitForKeyElements('.base-info__title > H1', 'zhaopin.com', ['/companydetail'], false, false, 'node.append($(insert_html))', actionFunction);
// 全程无忧
waitForKeyElements('.cname.at', '51job.com', ['/pc/search'], false, false, 'node.prepend($(insert_html))', actionFunction);
waitForKeyElements('.compName > a', '51job.com', ['/pc/my/myjob'], false, false, 'node.prepend($(insert_html))', actionFunction);
waitForKeyElements('.tHCopName > H1', '51job.com', ['/all'], false, false, 'node.append($(insert_html))', actionFunction);
waitForKeyElements('.com_name  > p', '51job.com', ['/'], false, false, 'node.append($(insert_html))', actionFunction);

function actionFunction(node, selector_txt, active_host, active_url, js_code) {
	if (GM_getValue('menu_amazon')) {
		(async () => {
			var node_class = node.attr('class');
			if (node_class == undefined || (node_class.indexOf('beibei') == -1 && node_class.indexOf('base-title') == -1)) {
				var company_replace = ['\n', '\r', '...', '公司名称', '企业名称：'];
				var company_name = node.text();
				for (x in company_replace) {
					company_name = company_name.replace(company_replace[x], '').trim();
				}
				var blacklist_search = `https://kjxb.org/?s=${company_name}&post_type=question`;
				// var blacklist_search = `https://kjrate.com/?s=${company_name}&post_type=question`;
				var response = await makeGetRequest(blacklist_search);
				var response_text = $(response.responseText);

				// boss直聘的搜索页面添加若比邻黑名单标签
				var hyperlink = response_text.find('.ap-questions-hyperlink').attr('href');
				var result = hyperlink == undefined ? ['#00F', blacklist_search, '去搜索一下'] : ['#F00', hyperlink, '若比邻黑名单'];
				var insert_html = `<a class="beibei" target="_blank" style="color:${result[0]}" href='${result[1]}'>&nbsp ${result[2]} &nbsp</a>`;
				eval(js_code);

				// boss直聘的搜索页面添加若比邻黑名单的属性标签
				if (selector_txt == '.boss-name') {
					var tag_list = node.parent().parent().parent().find('.job-info > .tag-list');
					var question_tags_list = response_text.find('.question-tags > a');
					if (question_tags_list.length > 0) {
						for (var i = 0; i < question_tags_list.length; i++) {
							question_tags = question_tags_list[i].innerText;
							question_tags = question_tags.replace(/,/g, '|').replace(/，/g, '|');
							question_tags = question_tags.trim().replace(/^[|]|^[#]|[|]$/g, '');
							question_tags = question_tags.replace(/\|/g, '<span style="color: blue">│</span>');
							tags_html = $(`<li><span style="color: red">${question_tags}</span></li>`);
							tag_list.prepend(tags_html);
						}
					}
				}
			}
		})();
	}
}
