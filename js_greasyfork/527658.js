// ==UserScript==
// @name         Linux.do列表页-简洁风格
// @namespace    http://tampermonkey.net/
// @version      20250221
// @description  L站列表页-简洁风格
// @author       Garphy
// @license      MIT
// @match        https://linux.do/
// @match        https://linux.do/latest
// @match        https://linux.do/c/*
// @icon         https://linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527658/Linuxdo%E5%88%97%E8%A1%A8%E9%A1%B5-%E7%AE%80%E6%B4%81%E9%A3%8E%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/527658/Linuxdo%E5%88%97%E8%A1%A8%E9%A1%B5-%E7%AE%80%E6%B4%81%E9%A3%8E%E6%A0%BC.meta.js
// ==/UserScript==
GM_addStyle(`
:root {
  --secondary-text-color: #999;
  --compact-font-size: var(--font-down-2);
}
.topic-list-item:nth-child(even) { background-color: var(--primary-very-low);}
.topic-list .topic-list-data.posters { display:none;}
.topic-list .link-bottom-line { font-size:var(--compact-font-size);}
.topic-list .link-bottom-line .badge-category__name { font-size:var(--compact-font-size);}
.topic-list .link-bottom-line .badge-category__icon { color:var(--secondary-text-color) !important;}
.topic-list .link-bottom-line .badge-category__wrapper .badge-category__name { color:var(--secondary-text-color) !important;}
.topic-list .link-bottom-line .discourse-tags { font-size:var(--compact-font-size);}
.topic-list .link-bottom-line .discourse-tags a:before { content: '/'; margin-right:3px;}
.topic-list .link-bottom-line .discourse-tag.box { margin:0; padding:2px 0; background:none; color:var(--secondary-text-color) !important;}
.topic-list .link-bottom-line .discourse-tags .tag-icon { display:none;}
`);
/* 亮色备选：var(--quaternary) */