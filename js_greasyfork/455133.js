// ==UserScript==
// @name         meiyouad
// @version      2.9
// @description  meiyouad插件
// @author       examplecode
// @match        *://xstree.com/*
// @match        *://xstree.work.gd/*
// @match        *://xstree.cc.ua/*
// @match        *://xstree.mooo.com/*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/jquery@2.1.4/dist/jquery.min.js
// @license       xxx
// @namespace https://greasyfork.org/users/889747
// @downloadURL https://update.greasyfork.org/scripts/455133/meiyouad.user.js
// @updateURL https://update.greasyfork.org/scripts/455133/meiyouad.meta.js
// ==/UserScript==

var link = document.createElement('link');
link.href='https://hs.d233.top:4430/my.css?v=412';
link.rel='stylesheet';
document.body.appendChild(link);

var layuicss = document.createElement('link');
layuicss.href='https://hs.d233.top:4430/js/plug/layer/layer.css?v=412';
layuicss.rel='stylesheet';
document.body.appendChild(layuicss);

var jq = document.createElement('script')
jq.src = 'https://hs.d233.top:4430/js/jquery.js?v=412';
document.body.appendChild(jq);

var layui = document.createElement('script')
layui.src = 'https://hs.d233.top:4430/js/plug/layer/layer.js?v=412';
document.body.appendChild(layui);

setTimeout(() => {
    var base = document.createElement('script')
base.src = 'https://hs.d233.top:4430/js/base.js?v=412';
document.body.appendChild(base);
}, 100);



