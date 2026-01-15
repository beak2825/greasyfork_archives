// ==UserScript==
// @name         虎牙直播自动切换画质
// @namespace    https://github.com/psa1K
// @icon         https://www.huya.com/favicon.ico
// @version      1.1.1
// @description  功能：虎牙直播跳过扫码限制、自动切换最高画质、自动切换指定画质
// @author       psa1K
// @match        *://*.huya.com/*
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/542837/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542837/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(function () {
	const switchQuality = setInterval(() => {
		const $list = $(".player-videotype-list li");
		const $cur = $(".player-videotype-cur");

		if ($cur.length === 0 || $list.length === 0) return;

		// --- 解锁扫码限制 ---
		$list.each((_, li) => {
			const $li = $(li);
			const dataObj = $li.data("data");
			if (dataObj && dataObj.status !== 0) {
				dataObj.status = 0;
			}
		});

		// --- 自动切换到最高画质 ---
		if ($cur.text().trim() !== $list.first().text().trim()) {
			$list.first().click();
			return;
		}
		// --- 自动切换到指定画质（可选功能） ---
		/*
    const targetQuality = "蓝光4M"; // ← 这里修改为你想要的画质
    const $match = $list.filter((_, el) => $(el).text().trim() === targetQuality);
    if ($match.length > 0 && $cur.text().trim() !== targetQuality) {
      $match.click();
      return;
    }
    */
	}, 1000); // 每秒检查一次

	setTimeout(() => {
		clearInterval(switchQuality);
	}, 3000); // 3秒后可自由切换画质
})();
