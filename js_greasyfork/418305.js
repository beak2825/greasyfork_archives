// ==UserScript==
// @name         Twitter Fakher
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418305/Twitter%20Fakher.user.js
// @updateURL https://update.greasyfork.org/scripts/418305/Twitter%20Fakher.meta.js
// ==/UserScript==
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('.css-1dbjc4n.r-1d09ksm.r-18u37iz.r-1wbh5a2 {display: none !important;}');
addGlobalStyle('.css-901oao.r-m0bqgq.r-1qd0xha.r-n6v787.r-16dba41.r-1sf4r6n.r-1g94qm0.r-bcqeeo.r-qvutc0 {display: none !important;}');
addGlobalStyle('.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-m611by {display: none !important;}');
addGlobalStyle('.css-901oao.r-m0bqgq.r-1qd0xha.r-a023e6.r-16dba41.r-ad9z0x.r-zso239.r-bcqeeo.r-qvutc0 {display: none !important;}');
addGlobalStyle('.css-1dbjc4n.r-xoduu5.r-1udh08x {display: none !important;}');
//addGlobalStyle('.css-1dbjc4n.r-1niwhzg.r-vvn4in.r-u6sd8q.r-4gszlv.r-1p0dtai.r-1pi2tsx.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af.r-13qz1uu.r-1wyyakw {background-image: none !important;background-color:black;}');
addGlobalStyle('span.css-901oao.css-16my406.r-18jsvk2.r-1qd0xha.r-b88u0q.r-ad9z0x.r-bcqeeo.r-qvutc0 {display: none !important;}');
addGlobalStyle('.css-901oao.css-bfa6kz.r-m0bqgq.r-18u37iz.r-1qd0xha.r-a023e6.r-16dba41.r-ad9z0x.r-bcqeeo.r-qvutc0 {display: none !important;}');
addGlobalStyle('.css-901oao.css-bfa6kz.r-18jsvk2.r-1qd0xha.r-a023e6.r-b88u0q.r-ad9z0x.r-bcqeeo.r-3s2u2q.r-qvutc0 {display: none !important;}');
addGlobalStyle('.css-1dbjc4n.r-18u37iz.r-1wbh5a2.r-1f6r7vd {display: none !important;}');
addGlobalStyle('span.css-901oao.css-16my406.r-m0bqgq.r-1q142lx.r-1qd0xha.r-ad9z0x.r-bcqeeo.r-3s2u2q.r-qvutc0 {display: none !important;}');
addGlobalStyle('.css-1dbjc4n.r-1habvwh.r-1wbh5a2.r-1777fci {display: none !important;}');
addGlobalStyle('.css-901oao.r-m0bqgq.r-1q142lx.r-1qd0xha.r-a023e6.r-16dba41.r-ad9z0x.r-bcqeeo.r-yrgyi6.r-qvutc0 {display: none !important;}');




