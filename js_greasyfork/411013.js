// ==UserScript==
// @name               ExpandExpandExpand++
// @name:de            ExpandExpandExpand++
// @name:en            ExpandExpandExpand++
// @namespace          sun/userscripts
// @version            1.0.22
// @description        Modification of "GitHub PR: expand, expand, expand!" with multiple small improvements.
// @description:de     Modifikation von "GitHub PR: expand, expand, expand!" mit mehreren kleinen Verbesserungen.
// @description:en     Modification of "GitHub PR: expand, expand, expand!" with multiple small improvements.
// @compatible         chrome
// @compatible         edge
// @compatible         firefox
// @compatible         opera
// @compatible         safari
// @homepageURL        https://forgejo.sny.sh/sun/userscripts
// @supportURL         https://forgejo.sny.sh/sun/userscripts/issues
// @contributionURL    https://liberapay.com/sun
// @contributionAmount €1.00
// @author             findepi, Sunny <sunny@sny.sh>
// @include            https://github.com/*/*/issues/*
// @include            https://github.com/*/*/pull/*
// @match              https://github.com/*/*/issues/*
// @match              https://github.com/*/*/pull/*
// @run-at             document-end
// @inject-into        auto
// @grant              none
// @noframes
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/ExpandExpandExpand++.png
// @copyright          2020-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/411013/ExpandExpandExpand%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/411013/ExpandExpandExpand%2B%2B.meta.js
// ==/UserScript==

(() => {
  if (document.getElementsByClassName("ajax-pagination-btn").length)
    document
      .getElementsByClassName("pagehead-actions")[0]
      .insertAdjacentHTML(
        "afterbegin",
        "<li><a id='_f_expand_expand' class='btn btn-sm'>Expand all</a></li>",
      );
  document.getElementById("_f_expand_expand").onclick = expand;

  function expand() {
    const btnMeta = document.getElementById("_f_expand_expand");
    const btnLoad = Array.from(
      document.querySelectorAll(".ajax-pagination-btn"),
    ).filter((x) => x.textContent.includes("Load more"))[0];
    const btnWait = Array.from(
      document.querySelectorAll(".ajax-pagination-btn"),
    ).filter((x) => x.textContent.includes("Loading"))[0];

    btnMeta.setAttribute("aria-disabled", "true");

    if (btnLoad) {
      btnMeta.innerHTML = `Expanding ${btnLoad.previousElementSibling.textContent.match(/\d+/).toString()} items...`;
      btnLoad.click();
      setTimeout(expand, 25);
    } else if (btnWait) {
      setTimeout(expand, 25);
    } else {
      btnMeta.parentNode.remove();
    }
  }
})();
