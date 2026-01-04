// ==UserScript==
// @name         【通用自动版】哔哩哔哩(bilibili.com)屏蔽删除广告动态
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  关注的up主经常发布动态广告,又舍不得取关,实在受够了电动牙刷按摩枕眼罩杯子零食水果还有游戏机,没办法写了这个脚本.屏蔽关键词可自定义
// @author       redbubble
// @match        https://t.bilibili.com/*
// @match        http://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        http://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/475122/%E3%80%90%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E7%89%88%E3%80%91%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28bilibilicom%29%E5%B1%8F%E8%94%BD%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A%E5%8A%A8%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/475122/%E3%80%90%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E7%89%88%E3%80%91%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28bilibilicom%29%E5%B1%8F%E8%94%BD%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A%E5%8A%A8%E6%80%81.meta.js
// ==/UserScript==

//主函数setInterval方法
(function() {
    setTimeout(function() {monitor();}, 1000);//等待网页加载完成
    setInterval(monitor,5000);//此后每5秒监听一次
})();

//监听
function monitor() {
    //更新当前视频属性
    text_remove();
}



function text_remove() {
	let keyword = Array.from([
        '券后价格',
        '手机京东',
        '手淘',
        '领券',
        '优惠券',
        '长按Fu制',
        '推广',
        '淘宝',
        '全网zui低',
        '全网最低',
        '长按copy',
        '长按复制',
        '百亿补贴',
        '拼多多',
        '热卖',
        '满减',
        '清仓',
        '按摩仪',
        '下单'
    ]); // 替换为你想要去除的关键字
	var elements = document.querySelectorAll('.bili-dyn-item__main');
    //alert(elements.length);
	for (var i = 0; i < elements.length; i++) {
		var element = elements[i];
		var textContent = element.textContent;
        //alert(textContent);
        for (let i = 0; i < keyword.length; i++) {
		    if (textContent.includes(keyword[i])) {
                //alert(textContent);
			    element.remove(); // 移除包含关键字的节
            }
		}
	}
}

