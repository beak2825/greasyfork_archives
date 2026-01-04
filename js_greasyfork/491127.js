// ==UserScript==
// @name         IntCyoaAutosaver
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Autosaver for IntCyoaCreator
// @author       Name0930
// @match        https://cyoa.ltouroumov.ch/editor/
// @match        https://cyoa.ltouroumov.ch/editor/*
// @match        https://intcyoacreator.onrender.com/
// @icon         https://intcyoacreator.onrender.com/favicon.ico?
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491127/IntCyoaAutosaver.user.js
// @updateURL https://update.greasyfork.org/scripts/491127/IntCyoaAutosaver.meta.js
// ==/UserScript==

(function() {
  'use strict';

    const minutes = 10

      window.setInterval(function() {
          var save = document.querySelector("#app > div > div > nav > div.v-navigation-drawer__content > div > div:nth-child(1) > div:nth-child(7)")

          if (save) {
              save.click()
              setTimeout(function(){
                  var button = document.querySelector("#app > div.v-dialog__content.v-dialog__content--active > div > div > div.v-card__text > div > div > div:nth-child(2) > button > span")
                  var goback = document.querySelector("#app > div.v-dialog__content.v-dialog__content--active > div > div > div.v-card__actions > button > span")

                  if (button) {
                      button.click()
                      setTimeout(function(){goback.click()}, 5)
                  }
              }, 5)
          }
      }, minutes*60000);
})();