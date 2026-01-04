// ==UserScript==
// @name 长毛象猫耳补丁
// @namespace https://blog.bgme.me
// @version 1.0.0
// @description 为长毛象用户头像添加猫耳效果
// @grant GM_addStyle
// @run-at document-start
// @include https://bgme.bid*/*
// @include https://bgme.me*/*
// @include https://c.bgme.bid*/*
// @downloadURL https://update.greasyfork.org/scripts/407594/%E9%95%BF%E6%AF%9B%E8%B1%A1%E7%8C%AB%E8%80%B3%E8%A1%A5%E4%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/407594/%E9%95%BF%E6%AF%9B%E8%B1%A1%E7%8C%AB%E8%80%B3%E8%A1%A5%E4%B8%81.meta.js
// ==/UserScript==

(function() {
let css = `
.notification .status__avatar::before,
.notification .status__avatar::after {
    display: none !important;
}

.status__wrapper .status:first-child .status__avatar::before,
.status__wrapper .status:first-child .status__avatar::after,
.entry.h-entry .status__avatar div::before,
.entry.h-entry .status__avatar div::after,
.entry.entry-reblog .status__avatar div::before,
.entry.entry-reblog .status__avatar div::after {
    content: "";
    display: inline-block;
    border: 2px solid;
    box-sizing: border-box;
    width: 50%;
    height: 50%;
    background-color: inherit;
    border-color: #F6948E;
    position: absolute;
    z-index: 0;
}

.status__avatar::before,
.entry.h-entry .status__avatar div::before,
.entry.entry-reblog .status__avatar div::before {
    border-radius: 60% 40% 100% 100%;
    transform: rotate(-37.6deg) skew(-30deg);
    right: 0;
}

.status__avatar::after,
.entry.h-entry .status__avatar div::after,
.entry.entry-reblog .status__avatar div::after {
    border-radius: 40% 60% 100% 100%;
    transform: rotate(37.6deg) skew(30deg);
    top: 0;
    left: 0;
}

.detailed-status__display-name {
    overflow: visible !important;
}

.status__avatar .account__avatar {
    background-color: #d9e1e8;
    border-radius: 100%;
    z-index: 1;
}

.status__avatar:hover::before,
.entry.h-entry .status__avatar div:hover::before,
.entry.entry-reblog .status__avatar div:hover::before {
    animation: earwiggleright 1s infinite;
}

.status__avatar:hover::after,
.entry.h-entry .status__avatar div:hover::after,
.entry.entry-reblog .status__avatar div:hover::after {
    animation: earwiggleleft 1s infinite;
}

@keyframes earwiggleleft {
    from {
        transform: rotate(50deg) skew(30deg);
    }
    25% {
        transform: rotate(20deg) skew(30deg);
    }
    50% {
        transform: rotate(30deg) skew(30deg);
    }
    75% {
        transform: rotate(15deg) skew(30deg);
    }
    to {
        transform: rotate(50deg) skew(30deg);
    }
}

@keyframes earwiggleright {
    from {
        transform: rotate(-50deg) skew(-30deg);
    }
    30% {
        transform: rotate(-20deg) skew(-30deg);
    }
    55% {
        transform: rotate(-30deg) skew(-30deg);
    }
    75% {
        transform: rotate(-15deg) skew(-30deg);
    }
    to {
        transform: rotate(-50deg) skew(-30deg);
    }
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
