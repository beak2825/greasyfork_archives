// ==UserScript==
// @name         bahaGuildV2Toolkit.js
// @namespace    https://silwolf.io/
// @version      0.1
// @description  巴哈公會2.0的插件
// @author       銀狼(silwolf167)
// @include      /guild.gamer.com.tw/guild2.0.php
// @include      /guild.gamer.com.tw/post_detail.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420137/bahaGuildV2Toolkitjs.user.js
// @updateURL https://update.greasyfork.org/scripts/420137/bahaGuildV2Toolkitjs.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Your code here...
	jQuery(document).ready(() => {
		const head = document.getElementsByTagName('head')[0];
		if (head) {
			const style = document.createElement('style');
			style.type = 'text/css';
			style.innerHTML = `
.text_content-hide {
  display: block !important;
}

.more-text {
  display: none;
}

div[data-google-query-id] { display: none; }

.webview_commendlist { display: flex; flex-direction: column-reverse; }
.webview_commendlist > div { display: flex; flex-direction: column-reverse; }
`;

      if (location && location.href.includes('post_detail.php')) {
        style.innerHTML += `
.webview_commendlist .c-reply__editor { position: sticky;
  top: 50px;
  margin-left: -20px;
  margin-right: -20px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
`

      }
			head.appendChild(style);
		}
	});
})();
