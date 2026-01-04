// ==UserScript==
// @name Goatlings Minimal / Darker Theme
// @namespace luckydevil.nz
// @version 1.6
// @description A higher-contrast, darker theme for Goatlings.com.
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.goatlings.com/*
// @downloadURL https://update.greasyfork.org/scripts/504572/Goatlings%20Minimal%20%20Darker%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/504572/Goatlings%20Minimal%20%20Darker%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
    body {
        background: #2c2c2c;
        color: #000;
    }

    #header,
    #sidebar > a,
    .search-top,
    .search-bot {
        display: none;
    }
    #content,
    b {
        color: #000 !IMPORTANT;
    }
    .search-mid {
        background: none;
    }
    .navlink {
        filter: grayscale(100%) brightness(60%) contrast(500%);
    }
    .navlink img {
        border-radius: 25px;
        padding-bottom: 3px;
    }
    #user-info-wrap img {
        filter: grayscale(100%) invert(100%) contrast(90%) brightness(300%);
    }
    #m,
    #n {
        border: 6px solid #2c2c2c !IMPORTANT;
        color: #000 !IMPORTANT;
    }
    #wrapper,
    h1,
    h2,
    h3,
    .table-header,
    .table-header b {
        background: #2c2c2c !IMPORTANT;
        color: #fff !IMPORTANT;
    }
    h1 {
        border-bottom: 10px solid #000 !IMPORTANT;
    }

    .forum-post,
    .news-post,
    .devLog,
    .profile-info,
    .table,
    .button,
    .mypets-pet,
    .like-button,
    .doll-info,
    .battle-grid {
        border: 1px solid #000;
    }

    .base_area,
    .item_area {
        border: 2px solid #000;
    }

    .button {
        background: #2c2c2c;
    }
    .button:hover {
        background: #000;
    }

    .forum-post-info {
        border-right: 1px solid #2c2c2c;
    }

    .like-button {
        background: linear-gradient(to bottom, #2c2c2c 5%, #000 100%);
        text-shadow: 0px 1px 0px #2c2c2c;
        box-shadow: inset 0px 1px 0px 0px #2c2c2c;
    }

    .like-button:hover {
        background: linear-gradient(to bottom, #000 5%, #2c2c2c 100%);
        text-shadow: 0px 1px 0px #2c2c2c;
        box-shadow: inset 0px 1px 0px 0px #2c2c2c;
    }

    hr {
        border-top: 1px solid #000;
    }

    h3 li {
        background: #fff;
        color: #000;
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
