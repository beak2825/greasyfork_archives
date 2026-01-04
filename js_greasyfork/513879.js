// ==UserScript==
// @name klimat.app - Dark Mode
// @namespace klimat.app
// @version 20241018.02.50
// @description Klimat.app Dark Mode
// @author Nick2bad4u@hotmail.com
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/513879/klimatapp%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/513879/klimatapp%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `@ - moz - document domain("klimat.app") {
    /* Dark Mode Theme for Klimat Weather Page */
    body {
        background - color: #121212;

	color: # e0e0e0;
    }

    header,
    footer,
    .sidebar,
    .content {
        background - color: #1e1e1e;

	color: # e0e0e0;
    }

    a {
        color: #bb86fc;
    }

    a: hover {
        color: #3700b3;

}



table {

	background-color: # 1e1 e1e;
        color: #e0e0e0;
    }

    table th,
    table td {
        border: 1 px solid #333;

}



button,

input,

select,

textarea {

	background-color: # 333;
        color: #e0e0e0;
        border: 1 px solid #444;

}



button:hover,

input:hover,

select:hover,

textarea:hover {

	background-color: # 444;
    }

    ::selection {
        background - color: #bb86fc;
        color: #121212;

}



span {

	color: # BB86FC;
    }

    #content_wrapper {
        filter: invert(1)
    }
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
