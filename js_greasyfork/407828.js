// ==UserScript==
// @name         Github导航栏扩展（添加Discover, Trending, Topics）
// @version      1.0.4
// @description  导航栏增加Discover, Trending, Topics
// @author       Quanzaiyu
// @match        http://*.github.com/*
// @match        https://*.github.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @supportURL https://www.xiaoyulive.top/
// @namespace https://greasyfork.org/users/243830
// @downloadURL https://update.greasyfork.org/scripts/407828/Github%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%89%A9%E5%B1%95%EF%BC%88%E6%B7%BB%E5%8A%A0Discover%2C%20Trending%2C%20Topics%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/407828/Github%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%89%A9%E5%B1%95%EF%BC%88%E6%B7%BB%E5%8A%A0Discover%2C%20Trending%2C%20Topics%EF%BC%89.meta.js
// ==/UserScript==

var $ = $ || window.$;
window.jQuery = $;

$(document).ready(function(){
    $('nav').append(`

<a class="js-selected-navigation-item Header-link mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade-15" data-ga-click="Header, click, Nav menu - item:explore" data-selected-links="/explore /trending /trending/developers /integrations /integrations/feature/code /integrations/feature/collaborate /integrations/feature/ship showcases showcases_search showcases_landing /explore" href="/discover" one-link-mark="yes" target="_blank">
    Discover
</a>

<a class="js-selected-navigation-item Header-link mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade-15" data-ga-click="Header, click, Nav menu - item:explore" data-selected-links="/explore /trending /trending/developers /integrations /integrations/feature/code /integrations/feature/collaborate /integrations/feature/ship showcases showcases_search showcases_landing /explore" href="/trending" one-link-mark="yes" target="_blank">
    Trending
</a>

<a class="js-selected-navigation-item Header-link mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade-15" data-ga-click="Header, click, Nav menu - item:explore" data-selected-links="/explore /trending /trending/developers /integrations /integrations/feature/code /integrations/feature/collaborate /integrations/feature/ship showcases showcases_search showcases_landing /explore" href="/topics" one-link-mark="yes" target="_blank">
    Topics
</a>

    `);
});
