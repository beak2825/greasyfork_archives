// ==UserScript==
// @name         Автокликер Баллов Twitch
// @name:en      AutoClaim Point Twitch | by MjKey
// @version      0.3
// @description  Автоматически нажимает на сундучёк +50, удобный пасивный абуз (фарм) поинтов (баллов).
// @description:en AutoClaim Point Twitch | +50 Passives 
// @copyright    2019, MjKey | MjKey.ru
// @author       MjKey
// @match        https://www.twitch.tv/*
// @match        *://*.twitch.tv/*
// @match        *://twitch.tv/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @namespace https://greasyfork.org/users/519758
// @downloadURL https://update.greasyfork.org/scripts/401206/%D0%90%D0%B2%D1%82%D0%BE%D0%BA%D0%BB%D0%B8%D0%BA%D0%B5%D1%80%20%D0%91%D0%B0%D0%BB%D0%BB%D0%BE%D0%B2%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/401206/%D0%90%D0%B2%D1%82%D0%BE%D0%BA%D0%BB%D0%B8%D0%BA%D0%B5%D1%80%20%D0%91%D0%B0%D0%BB%D0%BB%D0%BE%D0%B2%20Twitch.meta.js
// ==/UserScript==

//18.03.2020 - фикс для хрома и обход анклика твича.
//19.04.2020 - Добавил рандомное время нажатия 2 - 7 секунд.
//28.11.2021 - Больше не жмёт на другие кнопки (бывал такой баг). Обновил иконку скрипта. (Был изменен селектор нажатия)

(function () {
  'use strict';
  function pressButton() {
    var AutoPoint = document.querySelectorAll(".claimable-bonus__icon");
    if (AutoPoint.length >= 1) {
        console.log("[АвтоКлик] Зафармленно!");
        AutoPoint[0].click();
    }
    timeClick();
  }
  function timeClick() {
    setTimeout(function () {
      pressButton();
    }, Math.random() * 1870 + 7600);
  }
  timeClick();
})();