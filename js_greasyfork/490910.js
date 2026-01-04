// ==UserScript==
// @name 女生自用Github 美化
// @namespace https://greasyfork.org/users/959347
// @version 2.3.6.1
// @description 美化github
// @author 幼稚园园长
// @license AGPL-3.0
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https?://github\.com/.*)$/
// @downloadURL https://update.greasyfork.org/scripts/490910/%E5%A5%B3%E7%94%9F%E8%87%AA%E7%94%A8Github%20%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/490910/%E5%A5%B3%E7%94%9F%E8%87%AA%E7%94%A8Github%20%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
let css = `
    @font-face {
        font-family: 'jb';
        src: url('https://cdn.statically.io/gh/yzyyz1387/blogimages/master/JBMr.woff');
    }
    body {
        font-family: 'jb', -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";

    }

    .AppHeader{
        --AppHeader-bg:#3898fc;
        color:#fff
    }

    .AppHeader .AppHeader-globalBar .AppHeader-search .AppHeader-search-visual--leading,.color-fg-subtle,trailing {
        color:#fff}

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

    .Box.p-3 {
        border-style: none;
        background: #f6f8fa;
        box-shadow: 20px 20px 60px #d1d3d5,
        -20px -20px 60px #ffffff00;
        transition: all 0.3s ease;
    }
    .Box.p-3:hover {
        box-shadow: 20px 20px 60px #abb1b1,
        -20px -20px 60px #ffffff00;
    }
    .rounded-2.py-1:hover {
        border-style: none;
        background: #f6f8fa;
        box-shadow: 20px 20px 60px #d1d3d5,
        -20px -20px 60px #ffffff00;
        transition: all 0.3s ease;
    }
    .rounded-2.py-1:hover .flex-justify-between.p-3{
        background: #fff !important;
    }
    .feed-item-content{
        background-color:unset;
        border:unset !important;
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
        box-shadow: 1px 1px 20px #bdd7c4
    }
    .btn-primary:hover {
        box-shadow: 1px 1px 20px #2da44e
    }

    .blob-code-inner {
        font-family: 'jb', ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    }
.header-search-wrapper,
.message-container div,
#copilot-chat-panel-inner.s-snippet-clipboard-copy-unpositioned div,
#copilot-chat-panel-inner.s-snippet-clipboard-copy-unpositioned p {
    color: #888;
}

.copilot-chat-textarea textarea,
.message-container span {
    color: #000;
}

#copilot-chat-panel-inner code {
    color: #9932cb;
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
