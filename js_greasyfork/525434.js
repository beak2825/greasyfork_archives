// ==UserScript==
// @name		1_CBS-Sports
// @description		hide ads & fix layour
// @match		https://*.cbssports.com/*
// @grant		GM_addStyle
// @namespace		https://greasyfork.org/en/scripts/525434-1-cbs-sports
// @author		sports_wook
// @version		2025.05.15
// @downloadURL https://update.greasyfork.org/scripts/525434/1_CBS-Sports.user.js
// @updateURL https://update.greasyfork.org/scripts/525434/1_CBS-Sports.meta.js
// ==/UserScript==


GM_addStyle (`

@media (min-width: 800px) {
  .Skybox--minHeight, .Skybox--minHeightBoth {
    --global-nav-v2-offset: 0px !important;
  }
}

@media (min-width: 800px) {
  .Article {
    margin-top: 25px !important;

  }
}

@media (min-width: 800px) {
  .data-reading-list-item {
    margin-bottom: 25px !important;
  }
}

@media (min-width: 1280px) {
  .Article-bodyContent {
    margin: 25px 25px !important;

  }
}

@media (min-width: 800px) {
  .Footer {
    padding-bottom: 75px !important;

  }
}

.Article {
  display: flex !important;
}

.Article-head {
  margin-bottom: 25px !important;

}

a:has(>.ArticleShortcode-container), section.Article-rail, #LatestNewsBox, .LatestNewsBox, .FooterLogoGroup-secondary, .Footer-links, .Footer-copyright {
  display: none !important;
}

`);