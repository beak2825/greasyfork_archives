// ==UserScript==
// @name         仿酷安回到顶部/底部（增强版）
// @namespace    https://viayoo.com/
// @version      3
// @description  在每个页面添加一个小按钮，一键回到页面顶部/底部，高仿酷安的回到顶部按钮样式。
// @author       You
// @run-at       document-start
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494488/%E4%BB%BF%E9%85%B7%E5%AE%89%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E5%BA%95%E9%83%A8%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/494488/%E4%BB%BF%E9%85%B7%E5%AE%89%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E5%BA%95%E9%83%A8%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

function toTopLikeKuAn() {
		var toTopBtn = document.createElement("div");
		toTopBtn.id = "toTopBtn";
		toTopBtn.setAttribute("style","font-size:25px !important;width:40px !important;height:40px !important;line-height:45px !important;text-align:center !important;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAAAkdJREFUWEftmMtOwkAUhnshRCAs3LvQBB8BheBG36RuDG+AtwDxxhsQF6YLeA7dQEB5BF24cO+ChBiCrf8QhtTamXZmGmRRNkB65pzv/OfSgt7tdl1tDV96AiZYlUQxQcG09VVMNJNV2eurCiQaJwFLFBNVQNQ+6bF/Ucy27Y1UKrVFgs9msw/Lsr5EQfz2yqUkUOl0upzNZu9N09TG4/HJdDodqMIpgVGoXC73MJlMdkjWmUzmHZ+PVeGkwDylK+Tz+TZAth3HmVfDMAwN6r1DuSq+vsmWVhiMquS6bg0lLCLwJoWifULg0HOfUG2k63pLRj0hMAoFkDqCHwDO5DU5oL5h24NtUxQuMpgoFAWWhYsEJgulAhcKpgolC8cFiwtKBo4JFjeUKFwgmGclNNC8Fd70YeJc2PSxNiwSHGvChn0F08hMmgwEbPp4b7Cm9c9hCagRIGokAAEjtyfAthC4qAL3C8wHRfaUwdpTC6VeEPzUmzX1get3OL8XAufAphek3BIsDiiaRBxwczBPozeRKempMKWeocQZb5t74G7hbz9MOVzvI3ad+tQ9SjUXja4MFaBcJLjFQMzh9E6nUwBpG86OwpSCzRA25yL3PZo4kr7B+VKYcrB5hE010l8EpNFloPzKRYFb7ruw/8cIFDIYwOmFiFL+afa0zDV8lnnKkbNcxQCDyrnKUH7l4DMUjgkGKLJjhqpK8ZSD7xKrr3lgT3B6pVI+1nKmZcX1S4AdBtkxwXBgV/Z5nfdU6y0r+ckH1V6D7H8AmH5OOwuD6GkAAAAASUVORK5CYII=') no-repeat center center !important;background-size:12px 12px !important;background-color:rgba(250,250,250,0.9) !important;box-shadow:0px 1px 1px rgba(0,0,0,0.4);color:#000 !important;position:fixed !important;bottom:20px !important;right:45% !important;z-index:99999999999999999 !important;border-radius:100% !important;display:none;");
		document.body.appendChild(toTopBtn);
};
function isScrollToTop() {
	var toTopTimer,mystartY,myendY;
	var topTopBtn = document.getElementById('toTopBtn');
	document.addEventListener('touchstart',function (e) {
		if (toTopTimer) {
			clearTimeout(toTopTimer);
		};
		mystartY = e.changedTouches[0].clientY;
	});
	document.addEventListener('touchmove',function (e) {
		myendY = e.changedTouches[0].clientY;
		var myY = myendY - mystartY;
		if (myY > 0){
			toTopBtn.style.opacity = "1";
			toTopBtn.style.display = "block";
			toTopBtn.style.transform = "rotateZ(0deg)";
			toTopBtn.style.boxShadow = "0px 1px 1px rgba(0,0,0,0.4)";
			toTopBtn.addEventListener('click',function () {
				window.scrollTo(0,0);
				this.style.display = "none";
				toTopBtn.removeEventListener('click',this,false);
			});
		} else if (myY < 0) {
			toTopBtn.style.opacity = "1";
			toTopBtn.style.display = "block";
			toTopBtn.style.transform = "rotateZ(180deg)";
			toTopBtn.style.boxShadow = "0px -1px 1px rgba(0,0,0,0.4)";
			toTopBtn.addEventListener('click',function () {
				window.scrollTo(0,document.documentElement.scrollHeight);
				this.style.display = "none";
				toTopBtn.removeEventListener('click',this,false);
			});
		}else {
			toTopBtn.style.display = "none";
		};
	});
	document.addEventListener('touchend',function (e) {
		toTopTimer = setTimeout(function () {
			toTopBtn.style.transitionProperty="opacity,background-color";
			toTopBtn.style.transitionDuration="500ms";
			toTopBtn.style.transitionTimingFunction = "linear";
			toTopBtn.style.opacity = "0";
			toTopBtn.style.backgroundColor = "rgba(200,200,200,1)";
			setTimeout(function() {
				toTopBtn.style.display = "none";
				toTopBtn.style.backgroundColor = "rgba(250,250,250,0.9)";
			},500);
		},2000);
	});
};
if (!document.getElementById('toTopBtn')) {
	toTopLikeKuAn();
	isScrollToTop();
};

})()