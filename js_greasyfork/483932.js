// ==UserScript==
// @name         мобильная версия pikabu
// @namespace    https://pikabu.ru/
// @version      0.4
// @description  мобильная версия
// @author       @SpaceRook
// @include      http://pikabu.ru/*
// @include      https://pikabu.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483932/%D0%BC%D0%BE%D0%B1%D0%B8%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F%20pikabu.user.js
// @updateURL https://update.greasyfork.org/scripts/483932/%D0%BC%D0%BE%D0%B1%D0%B8%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F%20pikabu.meta.js
// ==/UserScript==

(function() {
  setTimeout(() => {
  const str1 =
  `
<div class="snow"></div>
  `
  const str =
  `
<style>

.story__collapsed-tags-container {
  font-size: 9px;
}
.tool_donate, .carousel_small, .carousel, a.sidebar-menu__item_main:nth-child(9), a.sidebar-menu__item_main:nth-child(8), a.sidebar-menu__item_main:nth-child(7), .footer, .appstore-link_show, html.mv body div.app.promo-banner-sticky div.app__content div.stories-feed.main__content div.stories-feed__container section.carousel.carousel_small.carousel_short-stories, .m-h-4, .stories-feed__spinner-before, .smartbanner, .promo-banner-sticky .promo-banner {
  display: none;
}
.promo-banner-sticky_visible .pkb-tab-list_visible {
  top: 0px;
  }
html {
  background-size: 100%;
  height: 100%;
  background: #123 ;
}
.story__rating-plus, .story__footer-rating, .story__rating-minus {
  background: #21262a ;
}
.feed-panel_inline .feed-panel__selected-date + .hidden-counter_shown, .feed-panel_inline .hidden-counter_shown {
  margin-left: auto;
  display: block;
  margin-right: auto;
  text-align: center;
  font-weight: 100;
  font-style: normal;
  line-height: -10px;
  margin-bottom: -10px;
  border-bottom-width: 0px;
  border-top-width: 0px;
  margin-top: 5px;
  padding-top: 0px;
}
html.mv body div.app.promo-banner-sticky div.app__content section.feed-panel.feed-panel_inline.main__content {
  margin-bottom: -10px;
}
    html[data-theme-dark] {
  --color-black-300: #131a2152;
  --color-black-300: #0000;
}
* {
margin-bottom: 0px;
  margin-top: 0px;
margin-right: 1.3px;
  margin-left: 1.3px;
}
.story__main {
border-radius:4px;
}
.promo-banner-sticky_visible .header {
  top: 0px;
    .story__rating-count {padding-left: 7px;}
    .story__left_no-padding > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) {color: #fff;}
    .story__rating-down {border: 0px;}
    .comment__content, .app__inner, .story__header, .comment__header {filter:drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.7));}
    .comment__content{background: #9191910f;padding:9px;margin-top:4px;margin-bottom:4px;border-radius:4px;}
    .comment__body{padding:9px;margin-top:4px;margin-bottom:4px;border-radius:4px;}
    .app__inner {width: 2%;}
    * {
    background-repeat: inherit;
    }
html[data-theme-dark] button.button_active, html[data-theme-dark] button:active {
  filter: brightness(70%);
  background-color: #004b0c;
}
</style>
  `;

  // Create an element outside the document to parse the string with
  const head = document.createElement("head");
  const body = document.createElement("body");
  // Parse the string
  head.innerHTML = str;
  body.innerHTML = str1;
  // Copy those nodes to the real `head`, duplicating script elements so
  // they get processed
  let node = head.firstChild;
  let node1 = body.firstChild;

  while (node) {
    const next = node.nextSibling;
    if (node.tagName === "SCRIPT") {
      // Just appending this element wouldn't run it, we have to make a fresh copy
      const newNode = document.createElement("script");
      if (node.src) {
        newNode.src = node.src;
      }
      while (node.firstChild) {
        // Note we have to clone these nodes
        newNode.appendChild(node.firstChild.cloneNode(true));
        node.removeChild(node.firstChild);
      }
      node = newNode;
    }
    document.head.appendChild(node);
    node = next;
  }
 while (node1) {
    const next1 = node1.nextSibling;
    if (node1.tagName === "SCRIPT1") {
      // Just appending this element wouldn't run it, we have to make a fresh copy
      const newNode1 = document.createElement("script1");
      if (node1.src1) {
        newNode1.src1 = node1.src1;
      }
      while (node1.firstChild) {
        // Note we have to clone these nodes
        newNode1.appendChild(node1.firstChild.cloneNode(true));
        node1.removeChild(node1.firstChild);
      }
      node1 = newNode1;
    }
    document.body.appendChild(node1);
    node1 = next1;
  }
}, 0.00001);
})();