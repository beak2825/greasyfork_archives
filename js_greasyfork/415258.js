// ==UserScript==
// @name         2ch tree post
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  делает треды древовидными
// @author       You
// @match        http://2ch.hk/*/res/*
// @match        https://2ch.hk/*/res/*
// @match        http://2ch.life/*/res/*
// @match        https://2ch.life/*/res/*
// @grant        none
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/415258/2ch%20tree%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/415258/2ch%20tree%20post.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.time("tree script");

  // Кэшируем часто используемые селекторы
  const SELECTORS = {
    postLink: ".post__message > :nth-child(1)[data-num]",
    thread: ".thread",
  };

  // Регулярные выражения для проверки
  const REGEX = {
    postNumber: /\d+/,
    invalidLinks: /OP|→/,
  };

  // Функция для перемещения поста
  function postMove(linkPost, isNewPost = false) {
    const postContainer = linkPost.closest(".post");
    if (!postContainer) return;

    const postNumber = linkPost.innerText.match(REGEX.postNumber)?.[0];
    if (!postNumber) return;

    const targetPost = document.querySelector(`#post-${postNumber}`);
    if (!targetPost || REGEX.invalidLinks.test(linkPost.innerText)) return;

    targetPost.append(postContainer);

    if (isNewPost) {
      const handleClick = () => {
        postContainer.style.borderLeft = "2px dashed";
      };
      postContainer.addEventListener("click", handleClick, { once: true });
    }
  }

  // Обработка существующих постов
  const posts = document.querySelectorAll(SELECTORS.postLink);
  posts.forEach(postMove);

  // Наблюдение за новыми постами
  const thread = document.querySelector(SELECTORS.thread);
  if (thread) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          const newPost = mutation.addedNodes[0].querySelector(
            SELECTORS.postLink
          );
          if (newPost) postMove(newPost, true);
        }
      }
    });

    observer.observe(thread, { childList: true });
  }

  console.timeEnd("tree script");

  // Оптимизированная функция добавления стилей
  function GM_addStyle(css) {
    const styleId = "GM_addStyleBy8626";
    let style = document.getElementById(styleId);

    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      style.type = "text/css";
      document.head.appendChild(style);
    }

    style.sheet.insertRule(
      css,
      (style.sheet.rules || style.sheet.cssRules || []).length
    );
  }

  GM_addStyle(".post .post_type_reply { border-left-color: white; }");
})();
