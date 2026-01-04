// ==UserScript==
// @name Instiz iOS Zoom Blocker (Safe)
// @namespace http://tampermonkey.net/
// @version 1.3
// @description Prevent iOS Safari auto zoom on input focus by enforcing font-size 16px, without hiding content
// @author San
// @match *://*.instiz.net/*
// @match *://instiz.net/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/535732/Instiz%20iOS%20Zoom%20Blocker%20%28Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535732/Instiz%20iOS%20Zoom%20Blocker%20%28Safe%29.meta.js
// ==/UserScript==

(function () {
'use strict';

// Viewport meta 태그: 확대 방지
function addViewportMetaTag() {
if (!document.querySelector('meta[name=viewport]')) {
const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
document.head.appendChild(meta);
}
}

// 폰트 크기를 16px로 강제 설정
function applyFontFix() {
const elements = document.querySelectorAll('input, textarea, select');
elements.forEach(el => {
if (parseInt(window.getComputedStyle(el).fontSize) < 16) {
el.style.fontSize = '16px';
}
});
}

// transform이나 overflow는 제거 (Instiz에서 콘텐츠 사라지는 문제 방지)
function cleanUpBodyStyle() {
document.body.style.transform = '';
document.body.style.transformOrigin = '';
document.body.style.overflow = '';
document.body.style.touchAction = 'manipulation'; // 확대 방지만 남김
}

// 초기 실행
addViewportMetaTag();
applyFontFix();
cleanUpBodyStyle();

// 주기적으로 다시 적용
setInterval(() => {
applyFontFix();
}, 1000);

// DOM 변화 감지하여 재적용
const observer = new MutationObserver(() => {
applyFontFix();
});

observer.observe(document.body, { childList: true, subtree: true });
})();