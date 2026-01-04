// ==UserScript==
// @name                Github/Gitlab nav enhance
// @name:zh-CN          Github/Gitlab 导航栏增强
// @description         Added link button for quick jump to personal repository list in Github/Gitlab
// @description:zh-CN   Github/Gitlab 导航增加快速跳转到个人仓库列表的链接按钮

// @author              GallenHu
// @namespace           https://hgl2.com
// @license             MIT
// @icon                https://github.githubassets.com/favicons/favicon.png

// @grant               none
// @run-at              document-end
// @include             *://github.com/*
// @include             *://gitlab.com/*

// @date                03/22/2021
// @modified            01/21/2022
// @version             0.2
// @require             https://cdn.staticfile.org/jquery/1.12.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/423759/GithubGitlab%20nav%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/423759/GithubGitlab%20nav%20enhance.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const host = window.location.host;
    const pathname = window.location.pathname;
    const isGithub = host.endsWith('github.com');
    const isGitlab = host.endsWith('gitlab.com');

    if (isGithub) {
        const userName = document.querySelector('meta[name="user-login"]').content;

        const nav = document.querySelector('nav.d-flex');
        const html = `<a class="js-selected-navigation-item Header-link flex-auto mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade-15" data-ga-click="Header, click, Nav menu - item:marketplace context:user" data-octo-click="marketplace_click" data-octo-dimensions="location:nav_bar" data-selected-links="/${userName}?tab=repositories" href="/${userName}?tab=repositories">Repositories</a>
        <a class="js-selected-navigation-item Header-link flex-auto mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade-15" data-ga-click="Header, click, Nav menu - item:marketplace context:user" data-octo-click="marketplace_click" data-octo-dimensions="location:nav_bar" data-selected-links="/${userName}?tab=repositories" href="/${userName}?tab=stars">Stars</a>
       `
        $(nav).append(html);
    }

    if (isGitlab) {
        const userName = window.gon.current_username;
        const nav = document.querySelector('ul.navbar-sub-nav');
        const html = `<ul class="nav navbar-sub-nav">
        <li class="nav-item">
            <a href="/">Repositories</a>
        </li>
        <li class="nav-item">
            <a href="/users/${userName}/starred">Stars</a>
        </li>
        </ul>
        `
        $(document).ready(() => {
            $('.title-container').append(html);
        });

    }
})();
