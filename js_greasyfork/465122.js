// ==UserScript==
// @name 快乐继续
// @version 1.17
// @description 自动点击继续学习
// @author QingLee
// @match *://*.yunxuetang.cn/*
// @connect CNBruceLee
// @license MIT
// @namespace com.brucelee
// @downloadURL https://update.greasyfork.org/scripts/465122/%E5%BF%AB%E4%B9%90%E7%BB%A7%E7%BB%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/465122/%E5%BF%AB%E4%B9%90%E7%BB%A7%E7%BB%AD.meta.js
// ==/UserScript==

(function() {

	setInterval(autoContinue, 1000);
	function autoContinue() {

		var continueBtn = document.querySelector("#yxtBizNavMain > div > div.yxtbiz-nav-main__stu.yxtbiz-nav-main__stu--buildin.yxtbiz-nav-main__stu--notop > div.yxtulcdsdk-course-page > div.yxtulcdsdk-course-page__top > div > span > div > main > div.yxtulcdsdk-course-player.color-white > div.yxtulcdsdk-course-player__inner.yxtulcdsdk-flex > div.flex-1.p-rlt.yxtulcdsdk-course-player__inner-left > div > div > div.mt16.yxtulcdsdk-flex-center > button");
		if (continueBtn && continueBtn.click) {

			var imitateMousedown = document.createEvent("MouseEvents");
			imitateMousedown.initEvent("mousedown", true, true);
			continueBtn.dispatchEvent(imitateMousedown);
			continueBtn.click();

		}
	}
})();

(function() {

	setInterval(autoContinue, 1000);
	function autoContinue() {

		var continueBtn = document.querySelector("#yxtBizNavMain > div > div.yxtbiz-nav-main__stu.yxtbiz-nav-main__stu--buildin.yxtbiz-nav-main__stu--notop > div.yxtulcdsdk-course-page > div.yxtf-dialog__wrapper > div > div > div > div:nth-child(4) > button");
		if (continueBtn && continueBtn.click) {

			var imitateMousedown = document.createEvent("MouseEvents");
			imitateMousedown.initEvent("mousedown", true, true);
			continueBtn.dispatchEvent(imitateMousedown);
			continueBtn.click();


		}
	}
})();

(function() {

	setInterval(autoContinue, 1000);
	function autoContinue() {

		var continueBtn = document.querySelector("body > div.yxtf-dialog__wrapper > div > div > div > div.text-center.mt26.mb4 > button");
		if (continueBtn && continueBtn.click) {

			var imitateMousedown = document.createEvent("MouseEvents");
			imitateMousedown.initEvent("mousedown", true, true);
			continueBtn.dispatchEvent(imitateMousedown);
			continueBtn.click();


		}
	}
})();

(function() {

	setInterval(autoContinue, 10000);
	function autoContinue() {

		var videos = document.querySelector("#vjs_video_1_html5_api");
		if (videos.paused) {
			videos.play();
		}
	}
})();

(function() {

	setInterval(autoContinue, 1000);
	function autoContinue() {

		var continueBtn = document.querySelector("#yxtBizNavMain > div > div.yxtbiz-nav-main__stu.yxtbiz-nav-main__stu--buildin > div > div > div.clearfix.pr.zi9 > div.yxt-o2o-newpro-remind.pr.zi9.pull-right > div.bg-white.radius8.p24.color-59 > div.o2o-flex-center-center > div > button");
		if (continueBtn && continueBtn.click) {

			var imitateMousedown = document.createEvent("MouseEvents");
			imitateMousedown.initEvent("mousedown", true, true);
			continueBtn.dispatchEvent(imitateMousedown);
			continueBtn.click();
            }
	}
})();

(function() {

	setInterval(autoContinue, 1000);
	function autoContinue() {

		var continueBtn = document.querySelector("#app > div > main > div > div > div.yxtulcdsdk-course-page__top > div > span > div > main > div > div.yxtulcdsdk-course-player__inner.yxtulcdsdk-flex > div.flex-1.p-rlt.yxtulcdsdk-course-player__inner-left.w0 > div > div > div.mt16.yxtulcdsdk-flex-center > button");
		if (continueBtn && continueBtn.click) {

			var imitateMousedown = document.createEvent("MouseEvents");
			imitateMousedown.initEvent("mousedown", true, true);
			continueBtn.dispatchEvent(imitateMousedown);
			continueBtn.click();


		}
	}
})();

(function() {

	setInterval(autoContinue, 1000);
	function autoContinue() {

		var continueBtn = document.querySelector("#app > div > main > div > div > div.yxtf-dialog__wrapper > div > div > div > div:nth-child(4) > button");
		if (continueBtn && continueBtn.click) {

			var imitateMousedown = document.createEvent("MouseEvents");
			imitateMousedown.initEvent("mousedown", true, true);
			continueBtn.dispatchEvent(imitateMousedown);
			continueBtn.click();


		}
	}
})();

(function() {
    setInterval(autoContinue, 2000);
	function autoContinue() {
        var lie_biao = document.querySelector("#app > div > aside > div.hline.layout-flex.layout-flex-vertical > div.pr.mb12.flex-1.h0 > div > div.yxt-scrollbar__wrap > div > div:nth-child(2)");
        var player = document.querySelector("#vjs_video_1_html5_api");
        if(player.paused){
            for(var i = 0;i < lie_biao.children.length;i ++ ){
                var a = document.querySelector("#app > div > aside > div.hline.layout-flex.layout-flex-vertical > div.pr.mb12.flex-1.h0 > div > div.yxt-scrollbar__wrap > div > div:nth-child(2)").children[i].children[0].children[0].children[0].children[0].children[0].children[1].children[0].getAttribute('fill');
                if(a == '#BFBFBF'){
                    lie_biao.children[i].children[0].children[0].children[0].children[0].children[0].click();
                    break;
                }
            }
        }
    }
})();