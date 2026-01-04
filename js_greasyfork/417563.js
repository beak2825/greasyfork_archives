// ==UserScript==
// @name AniList Darker
// @namespace github.com/DishankJ/AniList-Darker
// @version 1.0.9
// @description Dark theme with red accent for AniList.
// @author Dishank Jaiswal
// @homepageURL https://github.com/DishankJ/AniList-Darker
// @supportURL https://github.com/DishankJ/AniList-Darker/issues
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:^https://anilist.co/anime/.*/.*/watch)$/
// @include /^(?:^https://anilist.co/manga/.*/.*/stats)$/
// @include https://anilist.co*/*
// @downloadURL https://update.greasyfork.org/scripts/417563/AniList%20Darker.user.js
// @updateURL https://update.greasyfork.org/scripts/417563/AniList%20Darker.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://anilist.co")) {
  css += `

  .site-theme-dark {
      --color-background: 28,31,34;
      --color-foreground: 25, 27, 30;
      --color-blue: 255,105,97;
      --color-foreground-blue: 25, 27, 30;
      --color-background-100: 20,22,24;
      --color-background-200: 17,19,20;
      --color-gray-100: 20,22,24;
      --color-foreground-grey: 20,22,24;
      --color-foreground-grey-dark: 17,19,20;
  }

  .banner[data-v-b5c85c0a] {
      height: 260px;
  }

  .behind-accent[data-v-16d5094e] {
      background: #ff8e88;
      height: .9px;
  }

  @media (max-width: 760px) {
      .banner[data-v-b5c85c0a] {
          height: 135px;
      }
  }

  .small .cover .image-text[data-v-4b71d7c6] {
      background: linear-gradient(to top, rgba(0,0,0,.85), rgba(0,0,0,.1));
  }

  .footer[data-v-6f9ee47f] {
      background: rgb(20,22,24);
  }

  .hamburger[data-v-8aeb5e9a], .menu[data-v-8aeb5e9a] {
      box-shadow: 0 1px 20px rgba(0,0,8,.2);
  }

  .site-theme-dark .nav-unscoped {
      background: #16191b;
  }

  .site-theme-dark .nav-unscoped.transparent {
      background: rgba(22,25,27,.5);
  }

  .site-theme-dark .nav-unscoped.transparent:hover {
      background: #16191b;
  }

  .site-theme-dark .quick-search {
      background: rgba(17,19,20,.9);
  }

  h2[data-v-6f9ee47f] {
      color: #ff6961;
  }

  .banner .shadow[data-v-b5c85c0a] {
      background: rgba(20,22,24,.7);
  }

  .user-page-unscoped.red .progress .bar {
      background: linear-gradient(270deg,#ff8e88,#f78c9b);
  }

  .feed-type-toggle>div.active[data-v-7b8d25f2] {
      color: #ff8e88;
  }

  .progress[data-v-5d42c114] {
      background-color: #ff8e88;
  }

  .el-message--success {
      background-color: rgba(16,16,16,.85);
      border: 0px solid black;
  }

  .el-icon-success:before {
      color: #ff8e88;
  }

  .el-message--success .el-message__content {
      color: #ff8e88;
  }

  h1 {
      font-weight: 500;
  }

  `;
}
if (new RegExp("^(?:^https://anilist.co/anime/.*/.*/watch)\$").test(location.href)) {
  css += `

  @media screen and (max-width: 760px) {
      .external-links[data-v-da429fba] {
          display: inline;
      }
  }

  @media (max-width: 1040px) {
      .watch[data-v-7e52d138] {
      margin-top: 20px;
      }
  }

  @media (max-width: 760px) {
      .data[data-v-c657baee] {
      display: none;
      }
  }

  .content[data-v-da429fba] {
      margin-top: 18.5px;
  }

  `;
}
if (new RegExp("^(?:^https://anilist.co/manga/.*/.*/stats)\$").test(location.href)) {
  css += `

  @media screen and (max-width: 760px) {
      .external-links[data-v-da429fba] {
          display: inline;
      }
  }

  @media screen and (max-width: 760px) {
      .data[data-v-c657baee] {
          display: none;
      }
  }

  .content[data-v-da429fba] {
      margin-top: 18.5px;
  }

  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
