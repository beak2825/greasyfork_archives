// ==UserScript==
// @name         ニコレポ連携（手動）
// @namespace    https://bymnet1845.web.fc2.com/
// @version      1.4
// @description  廃止されてしまったニコレポ連携ツイートを、ボタンをクリックするだけで簡単に再現出来る様になります。
// @author       Bymnet1845
// @match        https://www.nicovideo.jp/watch/*
// @icon         https://nicovideo.cdn.nimg.jp/web/images/favicon/144.png
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471279/%E3%83%8B%E3%82%B3%E3%83%AC%E3%83%9D%E9%80%A3%E6%90%BA%EF%BC%88%E6%89%8B%E5%8B%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/471279/%E3%83%8B%E3%82%B3%E3%83%AC%E3%83%9D%E9%80%A3%E6%90%BA%EF%BC%88%E6%89%8B%E5%8B%95%EF%BC%89.meta.js
// ==/UserScript==

let manualNicorepoVideoID, manualNicorepoVideoTitle;

window.onload = function () {
	manualNicorepoVideoID = document.querySelector("link[rel=\"canonical\"]").getAttribute("href").slice(31);

	const manualNicorepoLoadPlayer = setInterval(function () {
		if (document.querySelector(".VideoTitle")) {
			manualNicorepoVideoTitle = encodeURIComponent(document.querySelector(".VideoTitle").textContent);

			// いいね！ボタン
			/* document.querySelector(".VideoMenuContainer .LikeActionButton").addEventListener("click", function () {
				if (!this.className.match("is-liked")) {
					manualNicorepoOpenWindow("%E3%81%84%E3%81%84%E3%81%AD%EF%BC%81");
				}
			});

			document.querySelector(".ControllerBoxContaine .LikeActionButton").addEventListener("click", function () {
				if (!this.className.match("is-liked")) {
					manualNicorepoOpenWindow("%E3%81%84%E3%81%84%E3%81%AD%EF%BC%81");
				}
			}); */

			// Twitter共有パネル
			document.getElementsByClassName("TwitterShareButton")[0].addEventListener("click", function () {
				const manualNicorepoLoadTwitter = setInterval(function () {
					if (document.querySelector(".TwitterForm") && !document.getElementById("ManualNicorepo")) {
						document.querySelector(".TwitterForm").insertAdjacentHTML("beforeend", "<div id=\"ManualNicorepo\" style=\"margin-top: 14px; padding: 10px; background: #E2F3FF; color: #22A8F9; text-align: center;\"><p style=\"margin-bottom: 8px;\">ニコレポ連携（手動）でツイートする</p><button type=\"button\" id=\"ManualNicorepoMylistButton\" class=\"ActionButton\">マイリスト</button><button type=\"button\" id=\"ManualNicorepoLikeButton\" class=\"ActionButton\">いいね！</button></div><style>#ManualNicorepo button { margin: 0 4px; padding: 8px; border-radius: 4px; background: #22A8F9; font-weight: bold; line-height: 1; color: #FFFFFF; } #ManualNicorepo button:hover { background: #1E96E0; }</style>");

						document.querySelector("#ManualNicorepoMylistButton").addEventListener("click", function () {
							manualNicorepoOpenWindow("%E3%83%9E%E3%82%A4%E3%83%AA%E3%82%B9%E3%83%88");
						});

						document.querySelector("#ManualNicorepoLikeButton").addEventListener("click", function () {
							manualNicorepoOpenWindow("%E3%81%84%E3%81%84%E3%81%AD%EF%BC%81");
						});

						clearInterval(manualNicorepoLoadTwitter);
					}
				}, 100);
			});

			clearInterval(manualNicorepoLoadPlayer);
		}
	}, 100);
}

function manualNicorepoOpenWindow (type) {
	manualNicorepoVideoID = $("link[rel=\"canonical\"]").attr("href").slice(31);
	manualNicorepoVideoTitle = encodeURIComponent($(".VideoTitle").text());
	window.open("https://twitter.com/share?text=%E3%80%90" + type + "%E3%80%91" + manualNicorepoVideoTitle + "+https%3A%2F%2Fwww.nicovideo.jp%2Fwatch%2F" + manualNicorepoVideoID + "%3Fref%3Dtwitter+%23" + manualNicorepoVideoID, null, "top=8, left=8, width=500, height=300");
}