// ==UserScript==
// @name         bing css
// @description  a
// @match        https://www.bing.com/*
// @version 0.0.1.20250730113421
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/541781/bing%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/541781/bing%20css.meta.js
// ==/UserScript==

(function() {
  const style = document.createElement('style');
  style.textContent = `
:root {
color-scheme: light dark !important;
}

* {
background-color: revert !important;
color: revert !important;
min-width: revert !important;
}

div.b_genserp_citation_hover_md, li.b_ans:has(> div > ul > li > a > div.b_suggestionIcon.sug_sprite), div#inline_rs, footer, aside {
    display: none !important;
}

ol#b_topw {
    width: 290px !important;
}

ol#b_results {
  width: revert !important;
}

input#sb_form_q {
width: revert !important;
}

header#b_header * {
    margin-left: revert !important;
    margin-right: revert !important;
    /* width: revert !important; */
}

#id_h {
    position: revert !important;
    float: revert !important;
    text-align: revert !important;
    margin: revert !important;
}

nav.b_scopebar > ul {
    height: revert !important;
}

.ca_top_sec {
  width: revert !important;
}
  `;
  document.head.appendChild(style);
})();