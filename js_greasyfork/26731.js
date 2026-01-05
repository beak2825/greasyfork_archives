// ==UserScript==
// @name        twitter-image-new-tab-redirect-original
// @description 2023.08.17.13
// @namespace   https://danor.app/
// @version     2.2.0
// @author      DanoR
// @grant       none
// @run-at      document-start
// @match       *://pbs.twimg.com/media/*
// @downloadURL https://update.greasyfork.org/scripts/26731/twitter-image-new-tab-redirect-original.user.js
// @updateURL https://update.greasyfork.org/scripts/26731/twitter-image-new-tab-redirect-original.meta.js
// ==/UserScript==



(async () => {
	if(/name=/.test(location.href) && !/name=orig/.test(location.href)) {
		let href = location.href.replace(/name=\w+/, 'name=orig');

		if(/format=webp/.test(location.href)) {
			for(const format of ['webp', 'png', 'jpg', 'bmp', 'gif']) {
				const { status } = await fetch(
					href.replace(/format=\w+/, `format=${format}`),
					{ method: 'HEAD' },
				);

				if(status == 200) {
					href = href.replace(/format=\w+/, `format=${format}`);

					break;
				}
			}
		}

		location.href = href;
	}
})();
