// ==UserScript==
// @name        ctrl+enter
// @namespace   made for soyjak.party
// @match       http*://soyjak.party/*
// @match       http*://soyak.party/*
// @match       http*://soyjak.st/*
// @match       http*://theribbitrally.org/*
// @match       http*://frogbbs.moot.es/*
// @match       http*://sturdychan.help/*
// @match       http*://swedishwin.com/*
// @match       http*://soygem.party/*
// @match       http*://crystal.cafe/*
// @match       http*://lolcow.farm/*
// @match       http*://*.soyja.cc/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     *
// @license MIT
// @version     1.001
// @author      Glisterald and Xyl
// @description only works with vichan imageboards
// @downloadURL https://update.greasyfork.org/scripts/508498/ctrl%2Benter.user.js
// @updateURL https://update.greasyfork.org/scripts/508498/ctrl%2Benter.meta.js
// ==/UserScript==

// ctrl + enter to post
window.addEventListener("keydown", e => {
  if (e.key == "Enter" && (e.ctrlKey || e.metaKey)) {
    if (form = e.target.closest("form[name=post]")) {
      form.querySelector("input[type=submit]").click();
    }
  }
});
