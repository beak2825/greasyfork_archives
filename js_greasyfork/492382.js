// ==UserScript==
// @name 方便S1爬楼
// @namespace https://greasyfork.org/users/207890
// @version 1.3
// @description 缩短帖子高度
// @author Ts8zs
// @license GPL
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https://bbs.saraba1st.com/2b/thread-.*.html)$/
// @downloadURL https://update.greasyfork.org/scripts/492382/%E6%96%B9%E4%BE%BFS1%E7%88%AC%E6%A5%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/492382/%E6%96%B9%E4%BE%BFS1%E7%88%AC%E6%A5%BC.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Hide content after the avatar element */
	.favatar *:nth-child(n+4) {
		display: none;
	}
	.favatar:hover *:nth-child(n+4) {
		display: block;
	}
	.favatar :has(.avatar) {
		display: block;
	}

	.favatar *:nth-child(3) img:nth-child(2) {
		display: none;
	}
	.favatar img[title="已绑定手机"] {
		display: none;
	}
	.t_fsz {
		min-height: 0;
	}

	.t_f img {
		max-height: 500px;
		max-width: 100%;
		height: auto;
		width: auto;
	}
	.avatar img {
		height: 30px;
		width: auto !important;
	}
	.pls .avtm {
		background: none;
		box-shadow: none;
		border: none;
	}
	.pls .avatar {
		margin: 15px 0 0 15px;
	}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
