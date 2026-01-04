// ==UserScript==
// @name            auto check close
// @author          wei9133
// @version         2025.04.06
// @description     自動關閉滿18網頁或要求按廣告的X
// @icon         https://pic.superbed.cc/item/67cdec45f688033adb2657ec.jpg
// @license         MIT
// @match           *://*.ettoday.net/*
// @match           *://*.eyny.com/*
// @match           *://ck101.com/*
// @match           *://www.xvideos.com/*
// @match           *://*.blogspot.com/*
// @match           *://t66y.com/
// @match           *://www.jkforum.net/*
// @match           http://*.playno1.com/*
// @match           http://av.movie/*
// @match           http://katproxy.com/*
// @match           http://kickass.socialtorrent.net/*
// @match           http://www.ibeauty.tw/*
// @match           http://www.appledaily.com.tw/*
// @match           http://www.getchu.com/php/attestation.html*
// @match           http://www.storm.mg/*
// @match           https://*.fc2.com/*
// @match           https://news.gamme.com.tw/*
// @match           https://r18.clickme.net/*
// @match           https://v.jav101.com/*
// @match           https://www.dcard.tw/*
// @match           https://www.kocpc.com.tw/*
// @match           https://www.myfreecams.com/*
// @match           https://www.ptt.cc/*
// @match           https://www.4gamers.com.tw/*
// @match           https://www.tiangal.com/*
// @match           https://www.javlibrary.com/*
// @match           https://javdb.com/*
// @match           https://www.xianyudanji.net/*
// @match           https://www.xianyudanji.ai/*
// @match           https://game.udn.com/game/story/*
// @match           https://www.pcolle.com/*
// @match           https://fc2ppvdb.com/*
// @include        /^https://www.gamer520.com/*
// @exclude        /^https://www.gamer520.com/\d*\.html
// 下面這幾個外部腳本是一樣的，只是greasyfork不給從github外部引用，所以傳一份到該網站
//  https://gist.githubusercontent.com/wei9133/73bd21082357c790b60f4d60a6c828c8/raw/e7948b36430c2c8a4c74ec86796d11c76f25fbdb/jquery.min.js
//  https://gist.githubusercontent.com/wei9133/1942075e5f0229abe8bdd82d32152bd9/raw/8b5252372a27010eee7b6b1541e56ed883039625/waitForKeyElements.js
// @require https://update.greasyfork.org/scripts/529224/1550079/jQuery%20JavaScript%20Library%20v1124.js
// @require https://update.greasyfork.org/scripts/529226/1550082/wait_ForKeyElements.js

// @grant           none
// @namespace https://greasyfork.org/users/1006954
// @downloadURL https://update.greasyfork.org/scripts/529337/auto%20check%20close.user.js
// @updateURL https://update.greasyfork.org/scripts/529337/auto%20check%20close.meta.js
// ==/UserScript==

(() => {
	this.$ = this.jQuery = jQuery.noConflict(true);


	const url = window.location.href;

	function clickToContinue(jNodes) {
	/*
		console.log(jNodes);
		console.log(jNodes.context);
		console.log(jNodes.selector);
	*/
		jNodes[0].click();
    }

	// appledaily
	if (url.includes("www.appledaily.com.tw")) {
		waitForKeyElements(
			"#popup_18 a.yes",
			clickToContinue
		);
	}
	//av.movie
    else if (url.includes("av.movie/")){
		waitForKeyElements(
			'button#warning-yes',
			clickToContinue
		);
	}
	// blogspot
	// from https://gist.github.com/obeattie/362589
	else if (url.includes('.blogspot.')) {
		const overlay = document.getElementById('injected-iframe');
		if (overlay) {
			const nextSibling = overlay.nextElementSibling;
			if (nextSibling.tagName == 'STYLE') nextSibling.parentElement.removeChild(nextSibling);
			overlay.parentElement.removeChild(overlay);
		}
	}
	// for ck101
	else if (url.includes("ck101.com")) {
	  document.getElementById('periodaggre18_2015').checked = true;
	  document.getElementById('fwin_dialog_submit').click();
    }
	// clickme.net
	else if (url.includes("r18.clickme.net")) {
		$('button:contains("已滿18歲 進入")').click();
	}
	// dcard
	// <button class="Button_primary_3KkkP Button_button_2uDT-" type="button">是，我已滿 18 歲</button>
	else if (url.includes("www.dcard.tw/")) {
		waitForKeyElements(
			'button:contains("是，我已滿 18 歲")',
			clickToContinue
		);
	}
	// for ettoday
	else if (url.includes(".ettoday.net")) {
	//	document.querySelector('a.enter').click();
		fnHide().click();
	}
	// for eyny
	else if (url.includes(".eyny.com")) {
		document.querySelector("input[value^='是，我已年滿18歲。']").click();
	}
	// <a href="javascript:void(0)" class="c-btn-102 btnSz-2" role="button" aria-label="yes">是（進入）</a>
	else if (url.includes(".fc2.com")) {
		const a = document.querySelector("a.c-btn-102") || document.getElementById("age_ok_btn");
		a.click();
	}
	//news.gamme
	else if (url.includes("news.gamme.com.tw/")){
		document.getElementById('adult_notagain').checked = true;
        	MemberUI.r18WarningClose();
	}
	// getchu.com
	else if (url.includes("www.getchu.com/")) {
		$('a:contains("【は い】")')[0].click();
	}
	// ibeauty
	else if (url.includes("www.ibeauty.tw")) {
		waitForKeyElements(
			".warningWp .warningBtn .btnYes",
			clickToContinue
		);
	}
	// for jav101
	else if (url.includes("v.jav101.com")) {
		document.querySelector("a.agreeBtn").click();
	}
	// jkforum
	else if (url.includes("www.jkforum.net/")){
	    waitForKeyElements(
			'button#fwin_dialog_submit',
			clickToContinue
		);
	}

	// for kickass
	else if (url.includes("kickass.socialtorrent.net") || url.includes("katproxy.com")) {
		$('button:contains("Yes, let me see it")').click();
	}

	// www.kocpc.com.tw
	else if (url.includes("www.kocpc.com.tw")) {
		waitForKeyElements(
			"button.ox18B",
			clickToContinue
		);
	}

	// myfreecams
	else if (url.includes("www.myfreecams.com")) {
		waitForKeyElements(
			"#enter_desktop",
			clickToContinue
		);
	}

	// fc2ppvdb
else if (url.includes("fc2ppvdb.com")) { // <--- 注意，這裡暫時改成 if，因為其他 else if 都註釋掉了
        console.log("[Auto Check Close] Entered fc2ppvdb block for URL:", url);
        console.log("[Auto Check Close] Setting up interval check for fc2ppvdb confirmation link...");

        const targetUrl = "https://fc2ppvdb.com/cookie/setage";
        let checkCount = 0;
        const maxChecks = 40;

        const checkInterval = setInterval(() => {
            checkCount++;
            const linkSelector = '#ageCheck a[href="' + targetUrl + '"]';
            const link = $(linkSelector);
            const modalSelector = '#ageCheck';
            const modal = $(modalSelector);

            if (link.length > 0 && modal.length > 0 && modal.is(':visible')) {
                console.log("[Auto Check Close] Found visible fc2ppvdb confirmation link. Navigating directly to:", targetUrl);
                clearInterval(checkInterval);
                try {
                    window.location.href = targetUrl;
                } catch (e) {
                    console.error("[Auto Check Close] Error navigating directly for fc2ppvdb:", e);
                    clearInterval(checkInterval);
                }
            } else if (checkCount >= maxChecks) {
                 console.log("[Auto Check Close] Interval check timed out after " + (maxChecks * 500 / 1000) + " seconds for fc2ppvdb confirmation link.");
                 clearInterval(checkInterval);
            }
        }, 500);
	}

	// for playno1
	else if (url.includes(".playno1.com")) {
		waitForKeyElements(
			'button:contains("我已滿18歲 進入")',
			clickToContinue
		);
	}

	// for ptt
	else if (url.includes("www.ptt.cc")) {
		$('button:contains("我同意，我已年滿十八歲")').click();
	}

	// storm.mg
	else if (url.includes("www.storm.mg")) {
		waitForKeyElements(
			"button.button18x.yes",
			clickToContinue
		);
	}
	// t66y.com
	else if (url.includes("t66y.com")) {
		waitForKeyElements(
			'a:contains("滿 18 歲,")',
			clickToContinue
		);
	}
	// pcolle.com
		else if (url.includes("pcolle.com")) {
		waitForKeyElements(
			'button.is-yes:contains("はい")', // 精確鎖定按鈕
			function clickOnce(jNode) {
				// 添加防重複機制
				if (!jNode.data('clicked')) {
					jNode[0].click();
					jNode.data('clicked', true); // 標記已點擊
				}
			}
		);
	}
		// 4gamers.com.tw
	else if (url.includes("4gamers.com.tw")) {
		waitForKeyElements(
			'button:contains("是，我已滿十八歲，繼續瀏覽")',
			clickToContinue
		);
	}
	// 天遊二次元 tiangal.com
	else if (url.includes("www.tiangal.com")) {
		waitForKeyElements(
			'button:contains("是的，我已滿18歲")',
			clickToContinue
		);
	}
		// javlibrary.com ;未完整測試，但看起來像是elements裡找到的onclick=""裡的全部
	else if (url.includes(".javlibrary.com")) {
		document.getElementById('adultwarningmask').style.display='none'; setCookie('over18', 18).click();
	}
/*
		// gamer520
	else if (url.includes("gamer520.com")) {
		waitForKeyElements(
			'button:contains("×")',
			clickToContinue
		);
	}

	    // 鹹魚
	if (url.includes("xianyudanji.net")) {
		waitForKeyElements(
			'button:contains("×")',
			clickToContinue
		);
	}
*/
//一樣的按鈕可以用 || 合併
		// gamer520 & 鹹魚
		if (url.includes("gamer520.com") || url.includes("xianyudanji.net") || url.includes("xianyudanji.ai")) {
		waitForKeyElements(
        'button:contains("×")',
        clickToContinue
		);
	}

	        // javdb
    else if (url.includes("javdb.com")) {
     $('a:contains("我已滿18歲")')[0].click();
	}
      // javlibrary.com ;未完整測試，但看起來像是elements裡找到的onclick=""裡的全部
    else if (url.includes(".javlibrary.com")) {
        document.getElementById('adultwarningmask').style.display='none'; setCookie('over18', 18).click();
    }
    	// UDN圖片按鈕網站範例
	// udn的圖片獲取到的值是這樣：<span class="bu-classification bu-passed"></span>
	else if (url.includes("udn.com")) {
		waitForKeyElements(
			'span.bu-classification.bu-passed', // 使用 class 組合選擇器
				clickToContinue
			);
	}


	// for xvideos
	else if (url.includes(".xvideos.com")) {
		document.getElementById('disclaimer_background').click();
	}
})();
