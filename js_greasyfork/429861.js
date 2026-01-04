// ==UserScript==
// @name forums.dolphin-emu.org compacter post layout
// @namespace gitlab.com/Neui/userstyles
// @version 1.0.0
// @description Post information is to the left, "unused" features invisible by default
// @author Neui
// @homepageURL https://gitlab.com/Neui/userstyles
// @supportURL https://gitlab.com/Neui/userstyles/issues
// @license CC-BY-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.forums.dolphin-emu.org/*
// @downloadURL https://update.greasyfork.org/scripts/429861/forumsdolphin-emuorg%20compacter%20post%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/429861/forumsdolphin-emuorg%20compacter%20post%20layout.meta.js
// ==/UserScript==

(function() {
let css = `
	#posts > .post {
		display: grid;
		grid-template-columns: 110px auto;
  		grid-template-rows: auto 1fr auto;
		grid-template-areas: 
			"header header"
			"sidebar main"
			"sidebar footer";
	}
	#posts > .post > .post_date {
		grid-area: header;
	}
	#posts > .post > .post_author {
		grid-area: sidebar;
	}
	#posts > .post > .post_content {
		grid-area: main;
	}
	#posts > .post > .post_controls {
		grid-area: footer;
	}
	#posts .post .post_author .author_avatar {
		float: none;
		margin-bottom: 0;
		padding-top: 0;
	}
	#posts .post .post_author .author_avatar img {
		margin-right: 4px;
	}
	#posts > .post > .post_author .smalltext,
	#posts > .post > .post_author div.author_statistics {
		font-size: 80%;
		float: none;
	}
	#posts > .post > .post_author .smalltext,
	#posts > .post > .post_author div.author_statistics,
	#posts > .post > .post_author .author_information {
		padding-left: 0;
		float: none;
	}
	#posts > .post > .post_author .author_information {
		margin-top: 0;
		padding-top: 0;
		padding-bottom: 1px;
	}
	#posts > .post > .post_author div.author_statistics {
		display: block;
		padding-top: 0;
		clear: both;
	}
	#posts > .post > .post_author .smalltext img[alt="*"] {
		max-width: 9px;
	}
	#posts > .post > .post_author div.author_statistics {
		display: none;
	}
	#posts > .post > .post_author:hover div.author_statistics {
		display: block;
	}
	#posts > .post > .post_content img.smilie {
		vertical-align: bottom;
		width: 16px;
	}
	
	#posts > .post > .post_content {
		display: flex;
		flex-direction: column;
		max-width: 100%;
		overflow-wrap: anywhere;
	}
	#posts > .post > .post_content > .post_body {
		flex-grow: 2;
	}
	#posts > .post > .post_content > .signature_diabled {
		margin-bottom: -34px;
		z-index: 100; /* Be on top of the controls div */
	}
	#posts > .post > .post_content > .signature {
		font-size: 80%;
		line-height: 1;
		border-top-color: rgba(1, 1, 1, 0.25);
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
