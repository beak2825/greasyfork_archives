// ==UserScript==
// @name        9DB Raid Finder: Invite 10
// @namespace   k8ihczt9faet9c
// @match       https://9db.jp/pokego/data/62
// @match       https://9db.jp/pokemongo/data/9906
// @grant       none
// @version     1.0
// @description Unlocks the ability to invite 10 people, even if you don't have enough XP
// @run-at      document-end
// @inject-into content
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/439571/9DB%20Raid%20Finder%3A%20Invite%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/439571/9DB%20Raid%20Finder%3A%20Invite%2010.meta.js
// ==/UserScript==

(function () {
	"use strict";


	document.getElementById("wiki_invite")?.addEventListener("click", function inviteClick() {
		const limit = document.getElementById("invite_limit");

		if (limit) {
			this.removeEventListener("click", inviteClick);

			if (limit.children.length === 5) {
				const options = [];

				for (let i = 6; i <= 10; ++i) {
					const option = document.createElement("a");
					option.dataset.val = option.textContent = String(i);
					options.push(option);
				}

				limit.append(...options);
			}
		}
	});
})();
