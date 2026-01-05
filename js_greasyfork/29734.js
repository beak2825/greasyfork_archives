// ==UserScript==
// @name           exhentai公共帐号
// @description    小孩子不要看本子。。
// @version        1.0
// @author         糖果君
// @include        *://*.exhentai.org/*
// @include        *://exhentai.org/
// @namespace https://greasyfork.org/users/63579
// @downloadURL https://update.greasyfork.org/scripts/29734/exhentai%E5%85%AC%E5%85%B1%E5%B8%90%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/29734/exhentai%E5%85%AC%E5%85%B1%E5%B8%90%E5%8F%B7.meta.js
// ==/UserScript==
if (location.host == 'exhentai.org' && document.cookie.split(';') .length < 2) {
    window.location = 'http://exxx.ml';
}