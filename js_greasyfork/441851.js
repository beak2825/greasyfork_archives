// ==UserScript==
// @name Rename Merge Request Title Automatically
// @name:es Rename Merge Request Title Automatically
// @description Compatible gitlab
// @description:es Compatible gitlab
// @date 2022-03-21
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @license CC BY-NC-ND 4.0 International. https://creativecommons.org/licenses/by-nc-nd/4.0/
// @match *://*.gitlab.com/*
// @match *://gitlab.*.com.*/*
// @version 0.1
// @namespace https://greasyfork.org/en/users/314553-stefango
// @downloadURL https://update.greasyfork.org/scripts/441851/Rename%20Merge%20Request%20Title%20Automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/441851/Rename%20Merge%20Request%20Title%20Automatically.meta.js
// ==/UserScript==
(() => {
  if (window.location.href.includes('cherry-pick')) {
    const branchSelector = document.getElementsByClassName("branch-selector");
    const texto = branchSelector[0].innerText;
    const textoToInput = texto.split(' ');
    const source = textoToInput[1];
    const target = textoToInput[3];
    const url = window.location.href;
    const originalTitle = document.getElementById("merge_request_title").value;

    if (originalTitle.startsWith('Merge branch')) {
      let titleArr = document.getElementById("merge_request_title").value.split(' ');
      titleArr.splice(-1, 1, `'${target}'`);
      document.getElementById("merge_request_title").value = titleArr.join(' ');
    } else {
      // rename manually when code conflicted
    }
  }
})();