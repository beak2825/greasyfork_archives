// ==UserScript==
// @name         Github导航栏扩展
// @version      1.2
// @description  导航栏增加Discover, Trending, Topics
// @author       MyFaith
// @match        http://*.github.com/*
// @match        https://*.github.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @namespace https://greasyfork.org/users/8899
// @downloadURL https://update.greasyfork.org/scripts/374020/Github%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/374020/Github%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

var $ = $ || window.$;
window.jQuery = $;

$(document).ready(function(){
    $('nav').append(`
    <a class="js-selected-navigation-item Header-link  mr-0 mr-lg-3 py-2 py-lg-0 border-top border-lg-top-0 border-white-fade-15" href="/discover">
        Discover
    </a>
    <a class="js-selected-navigation-item Header-link  mr-0 mr-lg-3 py-2 py-lg-0 border-top border-lg-top-0 border-white-fade-15" href="/trending">
        Trending
    </a>
    <a class="js-selected-navigation-item Header-link  mr-0 mr-lg-3 py-2 py-lg-0 border-top border-lg-top-0 border-white-fade-15" href="/topics">
        Topics
    </a>
    `);
});
