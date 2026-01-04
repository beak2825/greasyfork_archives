// ==UserScript==
// @name         YouTube - Limit Subtitle Languages
// @description  Restrict YouTube subtitle language menu to only the target language.
// @version      0.2
// @author       to
// @namespace    https://github.com/to
// @license      MIT
//
//
// @noframes
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/528920/YouTube%20-%20Limit%20Subtitle%20Languages.user.js
// @updateURL https://update.greasyfork.org/scripts/528920/YouTube%20-%20Limit%20Subtitle%20Languages.meta.js
// ==/UserScript==

(function () {
	// チェック対象の言語
	const TARGET_LANGUAGE = "日本語";

	// プレーヤーを監視する
	function observePlayer() {
		// 変更を監視する
		const player = document.querySelector('.html5-video-player');
		const observer = new MutationObserver(() => {
			// 翻訳言語メニューか？
			const menu = document.querySelector('.ytp-panel-menu');
			if (!menu || !Array.from(menu.childNodes).some(menuItem =>
				menuItem.textContent.trim() == TARGET_LANGUAGE))
				return;

			// 対象言語以外の言語を削除
			Array.from(menu.childNodes).forEach(menuItem => {
				if (!(menuItem.textContent.trim() == TARGET_LANGUAGE))
					menuItem.remove();
			});
		});
		observer.observe(player, {
			childList: true,
			subtree: true,
		});
	}

	// プレーヤーが見つかるのを待つ
	const intervalId = setInterval(() => {
		const player = document.querySelector('.html5-video-player');
		if (player) {
			clearInterval(intervalId);
			observePlayer();
		}
	}, 500);
})();