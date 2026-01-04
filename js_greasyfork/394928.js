// ==UserScript==
// @name         Github Navigation Bar For Self
// @version      1.0.5
// @description  导航栏增加Home、Repo、Discover、Trending、Topics、Stars
// @author       windnight
// @include     /^https?://((blog|gist|guides|help|raw|status|developer)\.)?github\.com/((?!generated_pages\/preview).)*$/
// @include      /^https://github.com/*$/
// @include     /^https://*.githubusercontent.com/*$/
// @include     /^https://*graphql-explorer.githubapp.com/*$/
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @namespace https://greasyfork.org/users/222560
// @downloadURL https://update.greasyfork.org/scripts/394928/Github%20Navigation%20Bar%20For%20Self.user.js
// @updateURL https://update.greasyfork.org/scripts/394928/Github%20Navigation%20Bar%20For%20Self.meta.js
// ==/UserScript==

var $ = $ || window.$;

window.jQuery = $;

$(document).ready(function(){
    $('.flex-items-center .header-nav-item').remove();
    var profile =document.getElementsByTagName("meta")["user-login"].getAttribute("content");//$("meta[name='user-login']").content;// $('.header-nav-current-user .user-profile-link').attr('href');

    //$('nav').filter(".d-flex .flex-column .flex-lg-row .flex-self-stretch .flex-lg-self-auto").append(`
    //$('nav').append(`
    $('nav').filter(".d-flex").append(`
        <a class="js-selected-navigation-item Header-link flex-auto mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade-15" data-ga-click="Header, click, Nav menu - item:profile" href="https://github.com/`+ profile +`">Home</a>
        <a class="js-selected-navigation-item Header-link flex-auto mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade-15" data-ga-click="Header, click, Nav menu - item:home" href="https://github.com/`+ profile +`?tab=repositories">Repo</a>
        <a class="js-selected-navigation-item Header-link flex-auto mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade-15" data-ga-click="Header, click, Nav menu - item:discover" href="https://github.com/discover">Discover</a>
        <a class="js-selected-navigation-item Header-link flex-auto mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade-15" data-ga-click="Header, click, Nav menu - item:trending" href="https://github.com/trending">Trending</a>
        <a class="js-selected-navigation-item Header-link flex-auto mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade-15" data-ga-click="Header, click, Nav menu - item:topics" href="https://github.com/topics">Topics</a>
        <a class="js-selected-navigation-item Header-link flex-auto mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade-15" data-ga-click="Header, click, Nav menu - item:stars" href="/guanguans?tab=stars">Stars</a>
        <a class="js-selected-navigation-item Header-link flex-auto mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade-15" data-ga-click="Header, click, Nav menu - item:gist" href="https://gist.github.com">Gist</a>
        <a class="js-selected-navigation-item Header-link flex-auto mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade-15" data-ga-click="Header, click, Nav menu - item:gitbook" href="https://app.gitbook.com">Gitbook</a>

    </div>
    `);
});