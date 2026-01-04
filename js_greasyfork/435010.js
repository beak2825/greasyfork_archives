// ==UserScript==
// @name                Wiki to Wikiwand (zh)
// @description         Redirect Wikipedia to Wikiwand for a modern browsing experience.
// @description:zh-CN   重定向 Wikipedia 页面到 Wikiwand 以获得现代的浏览体验
// @version             1.0
// @namespace    http://tampermonkey.net/
// @run-at       document-start
// @include      https://*.wikipedia.*/*
// @include      http://*.wikipedia.*/*
// @exclude      http://*.wikipedia.org/wiki/*?oldformat=true
// @exclude      https://*.wikipedia.org/wiki/*?oldformat=true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435010/Wiki%20to%20Wikiwand%20%28zh%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435010/Wiki%20to%20Wikiwand%20%28zh%29.meta.js
// ==/UserScript==

var url = document.URL;
var regex1 = /^https?:\/\/(\w+)\.wikipedia\.org\/wiki\/([^\?#]+)(\?[^#]+)?(#.+)?/;
var regex2 = /^https?:\/\/\w+\.wikipedia\.org\/([\w-]+)\/([^\?#]+)(\?[^#]+)?(#.+)?/;
if (regex1.test(url)) {
    window.location.replace(url.replace(regex1, 'https://www.wikiwand.com/$1/$2$4'));
} else if (regex2.test(url)) {
    window.location.replace(url.replace(regex2, 'https://www.wikiwand.com/$1/$2$4'));
}