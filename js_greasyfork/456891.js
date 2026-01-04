// ==UserScript==
// @name Yui自用Github 美化
// @description 美化github
// @version 2.3.1
// @license AGPL-3.0
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https?://github\.com/.*)$/
// @namespace https://greasyfork.org/users/1000457
// @downloadURL https://update.greasyfork.org/scripts/456891/Yui%E8%87%AA%E7%94%A8Github%20%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/456891/Yui%E8%87%AA%E7%94%A8Github%20%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
let css = `
    body {
        font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";

    }
    .Header {
        box-shadow: 0 4px 12px #888;
        background: linear-gradient(90deg, #076ad1, #3898fc)
    }
    .header-search-wrapper {
        background: #fff;
        border: none;
    }
    input.form-control.js-site-search-focus.header-search-input.jump-to-field.js-jump-to-field::placeholder {
        color: #888;
    }

    .notification-indicator .mail-status {
        border: none;
        background-image: linear-gradient(90deg, #ef2f6a, #ca003e);
        box-shadow: 0 0 0 4px #888;
        width: 10px;
        height: 10px;
        transition: all 0.3s ease;
    }
    span.mail-status.unread:hover {
        box-shadow: 0 0 0 4px #ebeaea;
    }

    img.avatar {
        transition: all 0.3s ease;
    }
    img.avatar:hover {
        transform: rotate(20deg) scale(1.2) !important;
    }

    .Box.p-3.mt-2 {
        border-style: none;
        background: #f6f8fa;
        box-shadow: 20px 20px 60px #d1d3d5,
        -20px -20px 60px #ffffff00;
        transition: all 0.3s ease;
    }
    .Box.p-3.mt-2:hover {
        box-shadow: 20px 20px 60px #abb1b1,
        -20px -20px 60px #ffffff00;
    }


    button.btn-top {
        transition: all 0.3s ease;

    }
    button.btn-top:hover {
        transform: scale(1.2) !important;
    }

    .btn-primary {
        border: none;
        transition: all 0.3s ease;
        box-shadow: 6px 6px 20px #a5c8ef
    }
    .btn-primary:hover {
        box-shadow: 4px 6px 20px #2c7cdb
    }

    .header-search-wrapper {
        color: #888;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
