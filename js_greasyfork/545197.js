// ==UserScript==
// @name:en         hinatazaka46-accordion
// @name:ja         日向坂46 アコーディオン
// @namespace       https://greasyfork.org/ja/users/1328592-naoqv
// @description:en  Accordion library for Hinatazaka46 web site
// @description:ja  日向坂46Webサイト向けアコーディオンライブラリ
// @match           https://www.hinatazaka46.com/s/official/*
// @icon            https://cdn.hinatazaka46.com/files/14/hinata/img/favicons/favicon-32x32.png
// @compatible      chrome
// @compatible      firefox
// @grant           none
// @license         MIT
// ==/UserScript==
"use strict";

const initializeAccordion = (details, opt = {gridTemplateRows: null, gridTemplateColumns: null}) => {
  const summary = details.querySelector('.p-blog-face__title');
  const panel = details.querySelector('.p-blog-face__group');

  if (!(details && summary && panel)) {
    return; // 必要要素が揃ってない場合は処理をやめる
  }
  let isTransitioning = false; // 連打防止フラグ

  const onOpen = () => {
    if (details.classList.contains("open") || isTransitioning) {
      return;
    }
    isTransitioning = true;
    panel.style.gridTemplateRows = "0fr";
    details.classList.add("open");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panel.style.gridTemplateRows = (opt.gridTemplateRows != null) ? opt.gridTemplateRows : "repeat(5, 200px)";
        panel.style.gridTemplateColumns = (opt.gridTemplateColumns != null) ? opt.gridTemplateColumns : "repeat(7, 160px)";
        panel.style.height = "auto";
        panel.style.width = "auto";
      });
    });

    panel.addEventListener(
      "transitionend",
      () => {
        isTransitioning = false;
      },
      { once: true }
    );
  };

  const onClose = () => {
    if (!details.classList.contains("open") || isTransitioning) {
      return;
    }
    isTransitioning = true;

    details.classList.remove("open");
    panel.style.gridTemplateRows = "0fr";
    panel.style.gridTemplateColumns = "0fr";
    panel.style.height = "0";
    panel.style.width = "0";

    panel.addEventListener(
      "transitionend",
      () => {
        panel.style.gridTemplateRows = "";
        isTransitioning = false;
      },
      { once: true }
    );
  };

  summary.addEventListener("click", (event) => {
    event.preventDefault();

    if (details.classList.contains("open")) {
      onClose();
    } else {
      onOpen();
    }
  });
};
