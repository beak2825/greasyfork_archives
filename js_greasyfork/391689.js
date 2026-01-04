// ==UserScript==
// @name         processOn 一键生成历史版本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键生成历史版本
// @author       AT
// @match        https://www.processon.com/mindmap/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391689/processOn%20%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90%E5%8E%86%E5%8F%B2%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/391689/processOn%20%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90%E5%8E%86%E5%8F%B2%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

getLocalTime = () => {
	const date = new Date();
	return 'AT-自动存储-' + date.toLocaleTimeString();
};

setCss = params => {
	params.length &&
		params.map(item => {
			item.css('background', 'pink');
		});
};

autoSaveHistory = () => {
	const more = $("div[tit$='down']"); // 更多按钮
	const history = $("div[tp='history']"); // 历史版本
	const historyAdd = $('#btn-history-add'); // 创建历史版本
	const historyRemark = $('#history_remark'); // 版本标题输入框
	const historySaveBtn = $('#btn-histoty-save'); // 版本标题输入框
	const historyClose = $("span[class='mind-icons close']"); // 关闭历史版本
	setCss([ more, history, historyAdd, historyRemark, historySaveBtn, historyClose ]);

	more.click();
	history.click();
	historyAdd.click();
	historyRemark.val(getLocalTime());
	historySaveBtn.click();
	historyClose.click();
};

(function() {
	'use strict';
	// 删除多余元素
  const saveTip = $('#savetip').parent('.header-item');
  saveTip.remove();
	setCss([ saveTip ]);
	// 找到元素改变背景颜色
	const headerLeft = $('.header-left'); // 顶部左侧导航
	headerLeft.append(
		'<div class="header-item icon margin_l" id="atHistorySave" original-title="一键保存历史版本"><svg style="display:flex" t="1572252983162" class="icon mind-icons va1" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="771" width="20" height="20"><path d="M907.636364 297.890909v512c0 53.527273-44.218182 97.745455-97.745455 97.745455H216.436364C160.581818 907.636364 116.363636 863.418182 116.363636 807.563636V214.109091C116.363636 160.581818 160.581818 116.363636 216.436364 116.363636h523.636363c93.090909 6.981818 167.563636 86.109091 167.563637 181.527273z m-100.072728 323.490909c0-20.945455-16.290909-37.236364-37.236363-37.236363H253.672727c-20.945455 0-37.236364 16.290909-37.236363 37.236363v39.563637h593.454545l-2.327273-39.563637zM216.436364 770.327273c0 20.945455 16.290909 37.236364 37.236363 37.236363h518.981818c20.945455 0 37.236364-16.290909 37.236364-37.236363v-37.236364H216.436364v37.236364z m444.509091-342.109091v-176.872727c0-18.618182-16.290909-34.909091-34.909091-34.909091H251.345455c-9.309091 0-18.618182 4.654545-25.6 9.309091-6.981818 6.981818-9.309091 16.290909-9.309091 25.6v176.872727c0 9.309091 4.654545 18.618182 9.309091 25.6 6.981818 6.981818 16.290909 9.309091 25.6 9.309091h374.690909c18.618182 0 34.909091-16.290909 34.909091-34.909091z m-51.2-39.563637v-97.745454c0-13.963636-11.636364-25.6-25.6-25.6H535.272727c-13.963636 0-25.6 11.636364-25.6 25.6v97.745454c0 13.963636 11.636364 25.6 25.6 25.6h48.872728c16.290909-2.327273 25.6-11.636364 25.6-25.6z m0 0" p-id="772"></path></svg></div><div class="header-item seb"></div>',
	);
	$('#atHistorySave').on('click', () => {
		autoSaveHistory();
	});
})();
