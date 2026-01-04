// ==UserScript==
// @name         아프리카TV 도우미
// @name:ko      아프리카TV 도우미
// @namespace
// @description  광고 숨김 & 광고 음소거 & 자동 스킵 & 자동 스크린 모드 & VOD 최고화질
// @version      0.6
// @match        *://vod.afreecatv.com/player/*
// @match        *://play.afreecatv.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=afreecatv.com
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/1044223
// @downloadURL https://update.greasyfork.org/scripts/462078/%EC%95%84%ED%94%84%EB%A6%AC%EC%B9%B4TV%20%EB%8F%84%EC%9A%B0%EB%AF%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/462078/%EC%95%84%ED%94%84%EB%A6%AC%EC%B9%B4TV%20%EB%8F%84%EC%9A%B0%EB%AF%B8.meta.js
// ==/UserScript==
(function () {
	var $ = window.jQuery;
	function waitForElement(elementPath, callBack) {
		window.setTimeout(function () {
			if ($(elementPath).length) {
				callBack(elementPath, $(elementPath));
			} else {
				waitForElement(elementPath, callBack);
			}
		}, 500);
	}
	waitForElement("button.da_area_right", function () {
		var myInterval = setInterval(function () {
			if ($("button.da_area_right").is(":visible")) {
				if (isNaN(Number($("button.da_area_right").find("em")[0].innerText))) {
					$("button.da_area_right").click();
					setTimeout(function () {
						if ($("#btn_sound").hasClass("mute")) {
							$("#btn_sound").click();
							$(".ti_in").remove();
                            $(".thumb").remove();
						}s
					}, 500);
					clearInterval(myInterval);
				} else if (!$("#btn_sound").hasClass("mute")) {
					$("#btn_sound").click();
				}
			}
			if ($(".btn_smode").find("span")[0].innerText !== "스크린모드 종료(S)") {
				$(".btn_smode").click();
			}
			if ($(".ti_in")) {
				$(".ti_in").remove();
            }
            $('#da_video.af_video').css('display', 'none');
		}, 500);
	});
	if (window.location.hostname == "vod.afreecatv.com") {
		waitForElement("#afreecatv_player", function () {
			$('button[name="play"]').each(function () {
				$(this).click();
			});
			$("span.bg").each(function () {
				$(this).click();
			});
		});
		waitForElement("#quality_levels > li:nth-child(2) > button", function () {
			setTimeout(function () {
				$("#quality_levels > li:nth-child(2) > button").click();
			}, 500);
		});
	}
	$("#header_ad").remove();
})();