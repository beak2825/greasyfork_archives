// ==UserScript==
// @name         meiyouad-tv
// @version      1.5
// @description  meiyouad（电视）插件
// @author       examplecode
// @match        www.meiyouad.com/*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/jquery@2.1.4/dist/jquery.min.js

// @namespace https://greasyfork.org/users/889747
// @downloadURL https://update.greasyfork.org/scripts/441847/meiyouad-tv.user.js
// @updateURL https://update.greasyfork.org/scripts/441847/meiyouad-tv.meta.js
// ==/UserScript==
var link = document.createElement('link');
link.href='https://hs.d233.top/js/myTV.css?t=3';
link.rel='stylesheet';
document.body.appendChild(link);

var jq = document.createElement('script')
jq.src = 'https://hs.d233.top/js/jquery.js';
document.body.appendChild(jq);
setTimeout(() => {
    var base = document.createElement('script')
base.src = 'https://hs.d233.top/js/baseTV.js?t=3';
document.body.appendChild(base);

var ev = document.createElement('script')
ev.src = 'https://hs.d233.top/js/event.js?t=3';
document.body.appendChild(ev);
}, 100);


