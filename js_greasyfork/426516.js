// ==UserScript==
// @name         bilibili in pbb
// @namespace    https://greasyfork.org/zh-CN/users/772347
// @version      1.1
// @description  快捷切换是否渲染bilibili视频
// @author       WYXkk
// @match        https://pbb.akioi.ml/*
// @downloadURL https://update.greasyfork.org/scripts/426516/bilibili%20in%20pbb.user.js
// @updateURL https://update.greasyfork.org/scripts/426516/bilibili%20in%20pbb.meta.js
// ==/UserScript==

(function() {
    var defaultRender = mdRenderer.renderer.rules.image;
    var s='body > div.ui.tab.active.wide.container > div > div > div > div > div > div.four.wide.column > div:nth-child(9)';
    var a=$(s);
    var b=$(s+' > div:nth-child('+a.children().length+')');
    b[0].style.cssText='display: block;margin-bottom: 20px;';
    a[0].innerHTML+="<div class=\"ui toggle checkbox\" style=\"display: block;\"id=\"display-bilibili-videos\">\
<input type=\"checkbox\" tabindex=\"0\"><label>加载 bilibili 视频</label></div>";
    (function(){var el=$('#display-bilibili-videos'),name='displayBilibiliVideos';
    window[name] = localStorage.getItem(name) === 'true';
	el.checkbox({onChange: function () {
		const value = $(this).parent().checkbox('is checked');
        if(value) mdRenderer.use(bilibili_plugin);
        else mdRenderer.renderer.rules.image=defaultRender;
		localStorage.setItem(name, window[name] = value);
	}});
	el.checkbox(window[name] ? 'set checked' : 'set unchecked');
    if(window[name]) mdRenderer.use(bilibili_plugin);})();
    loadOption('ctrlEnterEnabled', $('#ctrlenter-enabled'));
    loadOption('ctrlShiftEnterEnabled', $('#ctrlshiftenter-enabled'));
    loadOption('displayPMToastAfterSub', $('#display-pm-toast-after-sub'));
})();