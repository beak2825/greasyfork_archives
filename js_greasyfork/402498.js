// ==UserScript==
// @name         Zap.co.il Highlight diffs in compare window
// @namespace    http://shmulik.flint.org/
// @version      0.1
// @description  Highlight different rows when comparing items
// @author       Shmulik Flint
// @match        https://www.zap.co.il/compare.aspx?*
// @updateUrl    https://gist.github.com/splintor/00b77e6ceefaaa5708bc15546b49aa8c/raw
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/402498/Zapcoil%20Highlight%20diffs%20in%20compare%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/402498/Zapcoil%20Highlight%20diffs%20in%20compare%20window.meta.js
// ==/UserScript==
'use strict';

GM_addStyle(`
  .detailsRow.different * {
    background-color: lemonchiffon !important;
    font-weight: bold;
  }
`);

const rows = [...document.getElementsByClassName('detailsRow')];
rows.forEach(row => {
  const values = [...row.getElementsByClassName('detailsRowTxt')];
  if (values.some(v => v.innerText !== values[0].innerText)) {
    row.classList.add('different');
  }
});