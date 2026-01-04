// ==UserScript==
// @name        脚本(修改版)
// @namespace    GaoxiaoBBBB && https://github.com/yuanYue-byte
// @version      0.9
// @description  高校邦刷课脚本，改自高校邦脚本，修改版版号GaoxiaoBBBB
// @author       yuanYue, PY-DNG
// @modifiedfrom https://greasyfork.org/scripts/425374
// @match        *://*.class.gaoxiaobang.com/class/*
// @run-at       document-idle
// @license      MIT
// @icon         https://imooc.gaoxiaobang.com/image/imooc/imooc-logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443246/%E8%84%9A%E6%9C%AC%28%E4%BF%AE%E6%94%B9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/443246/%E8%84%9A%E6%9C%AC%28%E4%BF%AE%E6%94%B9%E7%89%88%29.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    setInterval(function () {
		// Get elements
		const allChapters = Object.values(document.querySelectorAll('i.gxb-icon-begin.student-chapter-status'));
		const unfinished = allChapters.filter((c)=>{return !c.className.includes('gxb-icon-end') && !c.parentElement.querySelector('.quiz-status-ico') && !c.parentElement.querySelector('a>span[style^="color"]')});
		const next = unfinished[0] ? unfinished[0].parentElement.querySelector('a.chapter-info') : {click: () => {}};
		const video = document.querySelector('#video_player_html5_api');
		const videoPercent = document.querySelector('.video-percent');
 
		// Bypass exams and courseware
        try {
            if (document.querySelector(".quiz-item") || document.querySelector('.gxb-courseware-view-content')) {
                next.click();
            }
            if (document.getElementsByClassName("gxb-icon-teacher")[0]) {
                var a = document.getElementById("ueditor_0").contentWindow;
                // 如不需要自动回答请注释或删除(注释)第 33 34 行代码
                var answer = document.getElementsByClassName("reply-content")[0].innerText;
                a.document.getElementsByTagName("p")[0].innerText = answer;
                setTimeout(function () { document.getElementsByClassName("gxb-btn-pri gxb-btn-nav post-submit")[0].click(); }, 3000); //延迟3秒后自动提交
                setTimeout(function () { next.click(); }, 5000); //延迟5秒后自动点击下一章节
            }
        } catch (error) { console.log(error + "此页面为视频页面无需提交答案");}
 
		// Play video in 2x rate
		try {
			video && (video.playbackRate = 2);
			video && video.play();
		} catch (e) {}
 
		// Go to next chapter when finished
		videoPercent && videoPercent.innerText === '100' && next.click();
    }, 1000);
})();