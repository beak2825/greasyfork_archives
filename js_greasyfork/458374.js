// ==UserScript==
// @name         移除百度翻译烦人广告
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  A tampermonkey script for Baidu Fanyi for better using experience
// @author       HowardZhangdqs
// @match        *://fanyi.baidu.com/*
// @icon         https://fanyi-cdn.cdn.bcebos.com/static/translation/img/favicon/favicon_d87cd2a.ico
// @grant        none
// @license      GLWTpl
// @downloadURL https://update.greasyfork.org/scripts/458374/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E7%83%A6%E4%BA%BA%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/458374/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E7%83%A6%E4%BA%BA%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    let config = {
        display: { // 是否显示以下内容（false不显示 true显示）
            footer:    false, // 底部产品推荐  按钮
            ad_right:  false, // 右部产品推荐  按钮
            copyright: false, // 底部copyright 链接
            share:     false, // 底部分享      按钮
            feedback:  false, // 问题反馈      按钮
            manual:    false, // 人工翻译      按钮
            readtest:  false, // 发音评测      按钮
			header: { // 顶部菜单栏
				display:    false, // 若为false则隐藏整个菜单栏
				icon:       false, // 百度翻译图标
				navigation: false, // 菜单栏上的其他功能
				vip:        false, // 翻译VIP
				user:       true , // 用户信息
			}
        }
    };

    let DN = " {display: none !important}";
    let VH = " {visibility: hidden}";

    let reload = function() {
        let S = document.createElement('style'), ttarget = "";
        S.setAttribute('id', "BaidufanyiPlugin"); S.innerHTML = "";

        if (! config.display.footer)    S.innerHTML += "body > div.container > div.footer.cleafix > div.inner.clearfix" + DN;
        if (! config.display.ad_right)  S.innerHTML += "#transOtherRight" + DN;
        if (! config.display.copyright) S.innerHTML += "body > div.container > div.footer.cleafix > div.inner.clearfix > div.copyright" + DN;
        if (! config.display.share)     S.innerHTML += "body > div.container > div.footer.cleafix > div.inner.clearfix > div.follow-wrapper" + DN;
        if (! config.display.feedback)  S.innerHTML += "body > div.container > div.footer.cleafix > div.extra-wrap" + DN;
        if (! config.display.manual)    S.innerHTML += "#main-outer > div > div > div.translate-wrap > div.trans-operation-wrapper.clearfix > div.trans-operation.clearfix > a.manual-trans-btn" + DN;
        if (! config.display.readtest)  S.innerHTML += "#app-read" + DN;
		if (! config.display.header.display) S.innerHTML += "#header" + DN;
		if (! config.display.header.icon)    S.innerHTML += "#header > div > div > img" + VH;
		if (! config.display.header.vip)     S.innerHTML += "#header > div > div > div > div.vip-btn" + VH;
		if (! config.display.header.user)    S.innerHTML += "#header > div > div > div > div.user-info-wrapper" + VH;
		if (! config.display.header.navigation)
			ttarget = (n) => ("#header > div > div > div > div.normal-navigation > span:nth-child(" + n + ")" + VH),
			S.innerHTML += ttarget(3) + ttarget(4) + ttarget(5) + ttarget(6) + ttarget(7);

        try {
            document.getElementById("BaidufanyiPlugin").remove();
        } catch {}
        document.head.appendChild(S);
    };

	var init = function() {
		let PluginStyle = document.createElement('style');
        PluginStyle.setAttribute('id', "BaidufanyiPlugin2");
		PluginStyle.innerHTML = `
        .plugin-switch { white-space: nowrap; height: 30px; line-height: 30px; color: #666; }
		.plugin-items { display: inline-block; margin-left: 8px; }
		.plugin-trigger { display: inline-block; height: 30px; line-height: 30px; padding-left: 32px; cursor: pointer; position: relative; }
		.plugin-btn { position: absolute; left: 8px; top: 50%; margin-top: -8px; }
		.plugin-trigger .plugin-btn { background-repeat: no-repeat; background-image: url(https://fanyi-cdn.cdn.bcebos.com/static/translation/sprite/images/normal/index-sc413d90635_1fb6d1d.png); background-position: 0 -813px; height: 16px; width: 16px; }
        .plugin-trigger-checked .plugin-btn { background-repeat: no-repeat; background-image: url(https://fanyi-cdn.cdn.bcebos.com/static/translation/sprite/images/normal/index-sc413d90635_1fb6d1d.png); background-position: 0 -839px; height: 16px; width: 16px; }`;
        document.head.appendChild(PluginStyle);
	};

    reload();
	init();
})();