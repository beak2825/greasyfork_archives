// ==UserScript==
// @name TamperMonkey Extension - Dark Green Mode
// @namespace typpi.online
// @version 1.1.2
// @description Dark Green mode theme for Tampermonkey Extension
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @include extension://iikmkjmpaadaobahmlepeloendndfphd*/*
// @downloadURL https://update.greasyfork.org/scripts/523269/TamperMonkey%20Extension%20-%20Dark%20Green%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/523269/TamperMonkey%20Extension%20-%20Dark%20Green%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Start Copying Here  */
	/* Start Copying Here  */
	/* Start Copying Here  */

	:root {
		--background-dark: #000000b0;
		--background-green: #1cbd3fa9;
		--border-green: #1cbd3f54;
		--text-greyed: #f309099c;
		--text-light: #ffffffc5;
		--text-normal: #aaaaaa;
		--text-highlight: #eeeeee;
		--background-hover: #1cbd3fbf;
		--scrollbar-track: #202020;
		--editor-border: #ffffff;
		--submenu-dark: #000000ec;
	}

	.dark .scripttable tr,
	.dark .section,
	.dark .actiontable,
	.dark table:not(.moremenu) {
		background-color: var(--background-dark);
	}

	.dark .head_container {
		background-color: var(--background-green);
	}

	.scripttable tr,
	.section,
	.actiontable,
	.settingstr {
		border-color: var(--border-green) !important;
	}

	.greyed {
		color: var(--text-greyed) !important;
	}

	.dark .enabler.enabler_disabled,
	.dark .not_executed {
		color: var(--text-greyed) !important;
	}

	.dark table {
		color: var(--text-light);
	}

	html.dark,
	html.dark body,
	.tv_tabs_fill {
		background: var(--background-dark);
		scrollbar-color: var(--background-green)
			var(--scrollbar-track);
		color: var(--text-normal);
	}

	.dark .tv_selected {
		border-bottom-color: #2a2a2a !important;
		background-color: var(--background-green) !important;
		color: var(--text-highlight) !important;
	}

	.dark .editormenu {
		background-color: var(--border-green);
		color: var(--text-light);
	}

	.editor_border {
		border: 1px var(--border-green) solid;
		border-radius: 3px;
		background-color: var(--editor-border);
		padding: 0;
	}

	.dark .submenu,
	.dark .submenulist {
		background-color: var(--submenu-dark);
		color: var(--text-light);
	}

	.submenu tr.entry:hover {
		background: var(--border-green) !important;
	}

	.dark .tv_tab {
		border: 1px solid var(--border-green);
		background-color: var(--background-dark);
	}

	input[type='file'i] {
		color: var(--background-green);
	}

	.actiontable .script_name,
	.moremenu
		> tr:not(.script, .moremenu_toggle)
		> td:last-child {
		background-color: var(--background-dark);
	}

	.dark
		.moremenu
		> tr:not(.script, .moremenu_toggle):hover {
		background-color: var(--background-hover) !important;
	}

	.dark .actiontable > tr:hover {
		background: linear-gradient(
			to bottom,
			var(--background-hover) 2.2em,
			#00000000 2.2em
		) !important;
	}

	/* End Copying Here  */
	/* End Copying Here  */
	/* End Copying Here  */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
