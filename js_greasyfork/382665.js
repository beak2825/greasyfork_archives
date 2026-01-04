// ==UserScript==
// @name         Github导航栏加强
// @version      1.0
// @description  导航栏增加主页、仓库、发现、趋势、主题、star、gist
// @author       guanguans
// @include     /^https?://((blog|gist|guides|help|raw|status|developer)\.)?github\.com/((?!generated_pages\/preview).)*$/
// @include     /^https://*.githubusercontent.com/*$/
// @include     /^https://*graphql-explorer.githubapp.com/*$/
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @namespace https://greasyfork.org/users/194666
// @downloadURL https://update.greasyfork.org/scripts/382665/Github%E5%AF%BC%E8%88%AA%E6%A0%8F%E5%8A%A0%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/382665/Github%E5%AF%BC%E8%88%AA%E6%A0%8F%E5%8A%A0%E5%BC%BA.meta.js
// ==/UserScript==

var $ = $ || window.$;

window.jQuery = $;

$(document).ready(function(){
    
    $('.flex-items-center .header-nav-item').remove();
    
    var profile = $('.header-nav-current-user .user-profile-link').attr('href');
    
    $('nav').filter(".d-flex").append(`
        <a class="js-selected-navigation-item Header-link  mr-3" href="`+ profile +`">主页</a>
        <a class="js-selected-navigation-item Header-link  mr-3" href="/guanguans?tab=repositories">仓库</a>
        <a class="js-selected-navigation-item Header-link  mr-3" href="/discover">发现</a>
        <a class="js-selected-navigation-item Header-link  mr-3" href="/trending">趋势</a>
        <a class="js-selected-navigation-item Header-link  mr-3" href="/topics">主题</a>
        <a class="js-selected-navigation-item Header-link  mr-3" href="/guanguans?tab=stars">star</a>
        <a class="js-selected-navigation-item Header-link  mr-3" href="https://gist.github.com">gist</a>
    `);
});