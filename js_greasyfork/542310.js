// ==UserScript==
// @name         picture from tags
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  人気のイラストタグのサムネの作品に直接飛べるようにする
// @author       null
// @match        https://www.pixiv.net/*
// @icon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542310/picture%20from%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/542310/picture%20from%20tags.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function add_link_for_target(a) {
    const span = a.firstChild.children[1].firstChild.firstChild.firstChild;
    if (span.tagName != "SPAN") return;
    const artwork = span.getAttribute('data-gtm-value');
    if (!artwork) return;
    const url = "https://www.pixiv.net/artworks/" + artwork;

    const wrapper = document.createElement('div');
    wrapper.setAttribute("style", "display: flex; flex-direction: column; align-items: center; justify-content: center;");

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("style", "margin-top: 5px; color: gray; text-decoration: underline;");
    link.textContent = "作品を見る";

    const parent = a.parentElement;
    parent.replaceChild(wrapper, a);
    wrapper.appendChild(a);
    wrapper.appendChild(link);
  };

  function add_link() {
    const targetText = "人気のイラストタグ";
    const tag_div = Array.from(document.querySelectorAll("div"))
      .find(div => div.childElementCount === 0 && div.textContent.trim() === targetText);
    if (!tag_div) return;

    const a_wrapper = tag_div.parentElement.nextSibling.nextSibling
      .children[0]
      .children[0]
      .children[0]
      .children[0];
    for (const a of a_wrapper.children) {
      if (a.tagName !== "A") continue;
      add_link_for_target(a);
    }
  };

  window.onload = add_link;

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      add_link();
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
