// ==UserScript==
// @name         百度百科 排版优化
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  去掉不必要的元素，加大字体，加宽页面
// @author       Mr.NullNull
// @match        *://baike.baidu.com/item/*
// @downloadURL https://update.greasyfork.org/scripts/385067/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%20%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/385067/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%20%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function () {
	'use strict';

	Main();
	window.onload = deleAD();

	function Main() {
		var styleText = `
            /* 头部导航栏, 人物卡片，其他 */
            body.wiki-lemma .layout, div.poster, div.polysemant-list {
                width: 1400px;
            }
            div.polysemant-list-normal .polysemantList-header {
                width: 1368px;
            }
            div#fc_guess_like_new, div.content {
                width: 1400px !important;
            }
            div.main-content {
                width: 1053px !important;
            }
            .content-wrapper .content {
                font: 12px/1.5 "微软雅黑", sans-serif;
            }
            .body-wrapper div.para {
                font-size: 16px;
            }

            /* 表格 */
            .main-content table > tbody * .para {
                font-size: 14px;
            }

            /* 人物卡片 dl */
            .poster .con {
                width: 1053px;
            }


            /* 右下角目录 */
            .side-catalog {
                height: 521px;
            }
            .side-catalog .side-bar {
                height: 494px;
            }
            .side-catalog .catalog-scroller {
                height: 471px;
            }

            /* 广告 他说侧边栏, 他说底部, 好物种草 */
            .tashuo-right, #tashuo_bottom, #J-declare-wrap + a { display: none !important; }

            /* 智障功能 底部搜索发现 */
            .after-content { display: none !important; }
			`;
		var element = document.createElement('style');
		element.innerHTML = styleText
		document.documentElement.appendChild(element);
	}

	function deleAD() {
		/* 删除广告 */
		var a1 = document.querySelector("div.side-content > div.lemmaWgt-promotion-vbaike");
		var a2 = document.querySelector("div.side-content > div.lemmaWgt-promotion-slide");
		var a3 = document.querySelector("div.side-content > div#side_box_unionAd");
		a1.parentNode.removeChild(a1);
		a2.parentNode.removeChild(a2);
		a3.parentNode.removeChild(a3);

		/* 删除右边分享 */
		var a4 = document.querySelector("div#side-share");
		a4.parentNode.removeChild(a4);
	}

})();