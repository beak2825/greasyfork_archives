// ==UserScript==
// @name mozz.us Gemini portal - Violet
// @namespace https://greasyfork.org/users/3759
// @version 1.01
// @description A violet-purple theme.
// @license CC-0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.portal.mozz.us/*
// @downloadURL https://update.greasyfork.org/scripts/441298/mozzus%20Gemini%20portal%20-%20Violet.user.js
// @updateURL https://update.greasyfork.org/scripts/441298/mozzus%20Gemini%20portal%20-%20Violet.meta.js
// ==/UserScript==

(function() {
let css = `
body {
    background: #1b0b33;
    color: #fafbf7;
	font-size: 1.1em;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

div {
    background: #2f1f62;
    padding: 1em 0.5em;
    margin: -1em 0;
  }

input {
    background: #715ba5;
    color: #fafbf7;
    border-color: #45396e;
  }

table, td {
    border-color: #45396e;
  }

.gemini blockquote {
	background: #1b0b33;
	border-left: none;
	padding: 5px;
	margin: 5px 1em 0 1em;
	font-style: unset;
}

.gemini h1 {
	margin-bottom: 0.5em;
	color: #dbcffc;
	text-shadow: 2px 2px #1b0b33;
}

.gemini h2 {
	margin-bottom: 0.5em;
	color: #ede6ff;
	text-shadow: 2px 2px #1b0b33;
}

.gemini h3 {
	margin-bottom: 0.5em;
	text-shadow: 2px 2px #1b0b33;
}

.gemini ul {
	margin-left: 1em;
}

a {
    color: #dbcffc;
  }

a:active {
    color: #cffcdb;
  }

a:visited {
    color: #fcdbcf;
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
