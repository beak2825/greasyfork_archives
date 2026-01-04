// ==UserScript==
// @name         Twitter Floating Streamer Mode Checkbox
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Floating Streamer Mode toggle (checkbox) for Twitter/X with colored button effect
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540365/Twitter%20Floating%20Streamer%20Mode%20Checkbox.user.js
// @updateURL https://update.greasyfork.org/scripts/540365/Twitter%20Floating%20Streamer%20Mode%20Checkbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const streamerModeKey = "streamer-mode";

    // 1. Streamer mode CSS (scoped)
    const customCSS = `
body:is(.streamer-mode) .css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-b88u0q.r-1awozwy.r-6koalj.r-1udh08x.r-3s2u2q .css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3 { display: none; }
[data-testid="SideNav_AccountSwitcher_Button"] .css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-b88u0q.r-1awozwy.r-6koalj.r-1udh08x.r-3s2u2q .css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3 { display: block !important; }
body:is(.streamer-mode) .css-175oi2r.r-18u37iz.r-1wbh5a2.r-1ez5h0i [role="link"] :is(.css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-b88u0q.r-1awozwy.r-6koalj.r-1udh08x.r-3s2u2q, .css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3) { display: none; }
body:is(.streamer-mode) .r-1p0dtai.r-1pi2tsx.r-1d2f490.r-u8s1d.r-ipm5af.r-13qz1uu a.css-175oi2r.r-1pi2tsx.r-13qz1uu.r-o7ynqc.r-6416eg.r-1ny4l3l.r-1loqt21 { opacity: 0; }
body:is(.streamer-mode) .css-175oi2r.r-adacv.r-1udh08x.r-1kqtdi0.r-1867qdf.r-rs99b7.r-o7ynqc.r-6416eg.r-1ny4l3l.r-1loqt21[role="link"] .css-175oi2r.r-1pi2tsx.r-13qz1uu.r-1ny4l3l { opacity: 0; pointer-events: none !important; }
body:is(.streamer-mode) .css-175oi2r.r-1habvwh.r-1wbh5a2.r-1777fci [role="link"] .css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3 > .css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3{ opacity: 0; pointer-events: none !important; }
body:is(.streamer-mode) [role="link"].css-175oi2r.r-1wbh5a2.r-dnmrzs.r-1ny4l3l.r-1loqt21 .css-146c3p1.r-dnmrzs.r-1udh08x.r-1udbk01.r-3s2u2q.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-16dba41.r-18u37iz.r-1wvb978 > .css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3 { display: none; }
body:is(.streamer-mode) [role="link"].css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3.r-b88u0q.r-xoduu5.r-1w6e6rj.r-1rozpwm.r-1loqt21 > .css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3 { opacity: 0; pointer-events: none; }
body:is(.streamer-mode) [role="link"].css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3.r-1loqt21 > .css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3,
body:is(.streamer-mode) .css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-16dba41.r-bnwqim[data-testid="tweetText"] [role="link"].css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3.r-1loqt21 { filter: blur(4px); }
body:is(.streamer-mode) article.css-175oi2r.r-1mmae3n.r-3pj75a.r-o7ynqc.r-6416eg.r-1ny4l3l.r-1loqt21 .css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3.r-b88u0q > .css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3 { opacity: 0; }
[role="link"]:has(> time) {display: block !important;}
`;

    // 2. Inject style tag once
    const styleTag = document.createElement('style');
    styleTag.textContent = customCSS;
    document.head.appendChild(styleTag);

    // 3. Create floating button UI (custom styled as outline or filled)
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'streamer-mode-toggle-btn';
    button.innerHTML = `<svg width="22" height="22" viewBox="0 0 22 22" style="vertical-align:middle;margin-right:7px;" aria-hidden="true"><circle cx="11" cy="11" r="10" stroke-width="2" fill="none" stroke="#1DA1F2"/></svg><span style="vertical-align:middle;font-weight:bold;">Streamer Mode</span>`;
    button.style.position = 'fixed';
    button.style.left = '20px';
    button.style.bottom = '20px';
    button.style.zIndex = '99999';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.padding = '10px 20px';
    button.style.border = '2px solid #1DA1F2';
    button.style.borderRadius = '999px';
    button.style.background = 'transparent';
    button.style.color = '#1DA1F2';
    button.style.cursor = 'pointer';
    button.style.transition = 'all 0.25s';
    button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.18)';
    button.style.fontSize = '15px';

    // 4. 버튼 색상 및 아이콘 채우기 동기화 함수
    function syncButtonStyle() {
        const isActive = document.body.classList.contains('streamer-mode');
        if (isActive) {
            button.style.background = '#1DA1F2';
            button.style.color = '#fff';
            button.style.border = '2px solid #1DA1F2';
            button.querySelector('circle').setAttribute('fill', 'red');
            button.querySelector('circle').setAttribute('stroke', '#1DA1F2');
        } else {
            button.style.background = 'transparent';
            button.style.color = '#1DA1F2';
            button.style.border = '2px solid #1DA1F2';
            button.querySelector('circle').setAttribute('fill', 'none');
            button.querySelector('circle').setAttribute('stroke', 'red');
        }
    }

    // 5. 버튼 클릭 이벤트: streamer-mode toggle
    button.onclick = function() {
        document.body.classList.toggle('streamer-mode');
        localStorage.setItem(streamerModeKey, document.body.classList.contains('streamer-mode'));
        syncButtonStyle();
    };

    // 6. body class 변경 시에도 버튼 상태 유지
    const observer = new MutationObserver(() => syncButtonStyle());
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // 7. DOM에 추가 및 초기화
    if ([true, "true"].includes(localStorage.getItem(streamerModeKey))) document.body.classList.add('streamer-mode');
    document.body.appendChild(button);
    syncButtonStyle();
})();
