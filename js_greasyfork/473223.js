// ==UserScript==
// @name mozz.us Gemini portal - Pink
// @namespace https://greasyfork.org/users/3759
// @version 1.00
// @description A bright pink theme.
// @license CC-0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.portal.mozz.us/*
// @downloadURL https://update.greasyfork.org/scripts/473223/mozzus%20Gemini%20portal%20-%20Pink.user.js
// @updateURL https://update.greasyfork.org/scripts/473223/mozzus%20Gemini%20portal%20-%20Pink.meta.js
// ==/UserScript==

(function() {
let css = `
body {
    background: #ff2472;
    color: #000;
	font-size: 1.1em;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

div {
    background: #ffdef7;
    padding: 1em 0.5em;
    margin: -1em 0;
  }

input {
    background: #f3eaf1;
    color: #000;
    border-color: #ff85b0;
  }

table, td {
    border-color: #ff85b0;
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
	color: #000;
	text-shadow: 2px 2px #ff85b0;
}

.gemini h2 {
	margin-bottom: 0.5em;
	color: #000;
	text-shadow: 2px 2px #ff85b0;
}

.gemini h3 {
	margin-bottom: 0.5em;
	text-shadow: 2px 2px #ff85b0;
}

.gemini ul {
	margin-left: 1em;
}

a {
    color: #3500c7;
  }

a:active {
    color: #ff2472;
  }

a:visited {
    color: #a5013b;
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
