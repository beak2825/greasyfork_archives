// ==UserScript==
// @name Bilibili 20-21年旧版
// @namespace Ceale2021OldBili
// @version 0.1.7
// @description 还原20-21年时期bilibili旧版界面
// @author XiaohuangCeale
// @homepageURL https://github.com/XiaohCeale/go-back-bilibili-20-21-by-css
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/474444/Bilibili%2020-21%E5%B9%B4%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/474444/Bilibili%2020-21%E5%B9%B4%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==

(function() {
let css = `
.bili-header__bar {
    font-family: Microsoft YaHei;
    }
    .bili-video-card.is-rcmd {
        display: block!important;
    }
    .recommended-swipe {
        display: none!important;
    }

    .mini-header svg {
    display: none!important;
    }

    .bili-header .bili-header__bar {
    height: 55px!important;
    }
    .header-upload-entry {
    border-radius: 2px!important;
    width: 100px!important;
    }
    .header-upload-entry svg {
    display: none
    }
    .v-popover.is-bottom-start svg, .nav-search-btn svg {
    display: unset!important;
    }
    .nav-search-btn svg {
    width: 14px;
    margin-bottom: 2px;
    }
    .bili-header .center-search-container {
    height: 35px!important;
}

.bili-header .center-search-container .center-search__bar #nav-searchform {
    line-height: 35px!important;
    height: 35px!important;
    border-radius: 2px!important;
}
.bili-header .center-search-container .center-search__bar .nav-search-btn {
    right: 0!important;
    top: 0!important;
    width: 48px!important;
    height: 35px!important;
    background: #e7e7e7;
    border-radius: 0!important;
}

a.entry-title {
    margin-right: -10px!important;
}
a.entry-title {
    visibility: hidden;
}
a.entry-title::after {
    content: "主站";
    visibility: visible;
    position: absolute;

}
.bili-header .left-entry a.default-entry {

    margin-right: 12px!important;
}
.bili-header .right-entry__outside .right-entry-icon {

    display: none !important;
}
.bili-header .left-entry .download-client-trigger {
display: none}

.bili-header .red-num--message, .bili-header .red-num--dynamic {
    top: -9px !important;
    right: -4px !important;
    left: unset !important;
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
