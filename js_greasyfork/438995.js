// ==UserScript==
// @name        Etiketör
// @author      ScriptAdam
// @namespace   ScriptAdam
// @version     1.1
// @description Etiket yardımcısı
// @include     https://tr*.klanlar.org/game.php?*screen=overview_villages*mode=incomings*subtype=all*
// @include     https://tr*.klanlar.org/game.php?*screen=overview_villages*subtype=all*mode=incomings*
// @icon        https://img.icons8.com/cotton/50/000000/price-tag--v1.png
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/438995/Etiket%C3%B6r.user.js
// @updateURL https://update.greasyfork.org/scripts/438995/Etiket%C3%B6r.meta.js
// ==/UserScript==

(() => {
  let labelInterval = localStorage.labelInterval || 15;
  let bar = `
  <span style="float: right">
    <input
      type="number"
      id="labelInterval"
      value="${labelInterval}"
      style="width: 30px" />
    <i>dakikada bir</i>
    <a class="btn" id="labelStart">Etiketle</a>
  </span>
`;

  document.querySelector("[name=label]").insertAdjacentHTML("afterend", bar);
  document.getElementById("labelStart").addEventListener("click", label);

  function label() {
    labelInterval = document.getElementById("labelInterval").value;
    localStorage.labelInterval = labelInterval;
    setTimeout(() => {
      document.getElementById("select_all").click();
      document.querySelector("[name=label]").click();
    }, 1000 * 60 * labelInterval);
  }
  label();
})();
