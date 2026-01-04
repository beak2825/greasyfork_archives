// SPDX-License-Identifier: MIT
// ==UserScript==
// @name      Mastodonに引用ボタンを追加する
// @name:en      Add button to copy toot's url
// @name:ja      Mastodonに引用ボタンを追加する
// @namespace    http://www.eniehack.net/~eniehack/works/firefox-userscripts
// @version      0.2.1
// @description:en  Add button to copy toot's url for quote toot on Mastodon's deck UI
// @description:ja  MastodonのDeck UIにtootを引用するためのURLコピーボタンをboostボタンの隣に追加します。
// @author       eniehack
// @license      MIT
// @match        https://fedibird.com/deck/*
// @match        https://best-friends.chat/deck/*
// @match        https://mstdn.jp/deck/*
// @match        https://pawoo.net/deck/*
// @grant        GM.setValue
// @grant        GM.getValue
// @description MastodonのDeck UIにtootを引用するためのURLコピーボタンをboostボタンの隣に追加します。
// @downloadURL https://update.greasyfork.org/scripts/496161/Mastodon%E3%81%AB%E5%BC%95%E7%94%A8%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/496161/Mastodon%E3%81%AB%E5%BC%95%E7%94%A8%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

(async () => {
  const insertBefore = (newNode, existingNode) => {
    existingNode.parentNode.insertBefore(newNode, existingNode.previousSibling);
  };

  const createQuoteButtonElement = () => {
    const qtBtn = document.createElement("button");
    qtBtn.setAttribute(
      "class",
      "status__action-bar__button icon-button quote-icon",
    );
    qtBtn.setAttribute("type", "button");
    qtBtn.setAttribute(
      "style",
      "font-size: 18px; width: 23.1429px; height: 23.1429px; line-height: 18px;",
    );
    qtBtn.setAttribute("aria-label", "quote");
    qtBtn.setAttribute("aria-hidden", "false");
    qtBtn.setAttribute("title", "quote");
    qtBtn.setAttribute("tabindex", "0");
    const quoteIcon = document.createElement("i");
    quoteIcon.setAttribute("class", "fa fa-quote-left");
    quoteIcon.setAttribute("aria-hidden", "true");
    qtBtn.appendChild(quoteIcon);
    return qtBtn;
  };

  const fetchPostId = (target) => {
    return target
      .querySelector("a.status__relative-time")
      .href.match(/\/[0-9]+$/)[0]
      .substring(1);
  };

  const generateText = async (url) => {
    const tmpl = await GM.getValue("template", `{{url}}`);
    return tmpl.replace("{{url}}", url);
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  const insertQuoteButton = (targetArticle) => {
    const target = targetArticle.querySelector(
      ".status__action-bar__button.star-icon.icon-button",
    );
    const qtbtn = createQuoteButtonElement();
    // console.log(targetArticle)
    const postId = fetchPostId(targetArticle);
    const textareaElem = document.querySelector(
      "textarea.autosuggest-textarea__textarea",
    );
    qtbtn.onclick = () => {
      fetch(`https://${location.host}/api/v1/statuses/${postId}`)
        .then((res) => res.json())
        .then((json) => json.url)
        .then((url) => generateText(url))
        .then((txt) => copyText(txt));
    };
    insertBefore(qtbtn, target);
  };

  const callback = (entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        insertQuoteButton(entry.target);
      } else {
        const quotebtn = entry.target.querySelector(".quote-icon");
        if (quotebtn === null) continue;
        quotebtn.remove();
      }
    }
  };

  const mutationObservers = [];

  setTimeout(
    () => {
      //console.debug(target);
      const mutationObserverTargets = document.querySelectorAll(
        "div.column > div.scrollable > div.item-list",
      );

      const io = new IntersectionObserver(callback);

      const mutationObserverConfig = {
        attributes: false,
        childList: true,
        subtree: false,
      };
      mutationObserverTargets.forEach((target) => {
        const mo = new MutationObserver((mutations, observer) => {
          for (const mutation of mutations) {
            if (0 < mutation.addedNodes.length) {
              for (const node of mutation.addedNodes) {
                if (node.tagName !== "ARTICLE") continue;
                io.observe(node);
              }
            }
            if (0 < mutation.removedNodes.length) {
              mutation.removedNodes.forEach((node) => {
                io.unobserve(node);
              });
            }
            //console.log(mutation);
          }
        });
        mo.observe(target, mutationObserverConfig);
        mutationObservers.push(mo);
      });

      //console.debug(articles.length);
      const articles = document.querySelectorAll("article");
      articles.forEach((article) => {
        io.observe(article);
      });
    },
    await GM.getValue("insert_before_second", 3000),
  );

  document.addEventListener("unload", () => {
    mutationObservers.forEach((mo) => mo.disconnect());
  });
})();
