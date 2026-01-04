// ==UserScript==
// @name               T3Xtend
// @name:de            T3Xtend
// @name:en            T3Xtend
// @namespace          sun/userscripts
// @version            1.4.13
// @description        Adds T3X buttons as well as download links to old versions of TYPO3 extensions.
// @description:de     Zeigt sowohl T3X- als auch Download-Links zu alten Versionen von TYPO3-Extensions.
// @description:en     Adds T3X buttons as well as download links to old versions of TYPO3 extensions.
// @compatible         chrome
// @compatible         edge
// @compatible         firefox
// @compatible         opera
// @compatible         safari
// @homepageURL        https://forgejo.sny.sh/sun/userscripts
// @supportURL         https://forgejo.sny.sh/sun/userscripts/issues
// @contributionURL    https://liberapay.com/sun
// @contributionAmount €1.00
// @author             Sunny <sunny@sny.sh>
// @include            https://extensions.typo3.org/extension/*
// @match              https://extensions.typo3.org/extension/*
// @connect            repo.packagist.org
// @connect            ia801807.us.archive.org
// @run-at             document-end
// @inject-into        auto
// @grant              GM.xmlHttpRequest
// @grant              GM_xmlhttpRequest
// @noframes
// @require            https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/T3Xtend.ico
// @copyright          2020-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/411016/T3Xtend.user.js
// @updateURL https://update.greasyfork.org/scripts/411016/T3Xtend.meta.js
// ==/UserScript==

(() => {
  // Shorten button text

  for (const x of document.querySelectorAll(
    ".ter-ext-single-versionhistory .btn-primary",
  ))
    x.textContent = x.textContent.replace("Download", "ZIP");

  // Add buttons to old versions

  for (const x of document.querySelectorAll(
    ".ter-ext-single-versionhistory tr.table-danger td:first-child strong",
  ))
    x.parentNode.parentNode
      .querySelectorAll("td:last-child")[0]
      .insertAdjacentHTML(
        "beforeend",
        `<a class='btn btn-primary' href='/extension/download/${window.location.pathname.split("/")[2]}/${x.textContent}/zip'>ZIP</a>`,
      );

  // Add entries for Packagist-only versions

  if (document.getElementById("install-composer")) {
    const input = document
      .querySelector("#install-composer kbd")
      .innerText.replace("composer req ", "");
    GM.xmlHttpRequest({
      method: "GET",
      url: `https://repo.packagist.org/p2/${input}.json`,
      onload: (response) => {
        for (const x of JSON.parse(response.responseText).packages[input].slice(
          1,
        )) {
          if (
            !document.getElementById(x.version) &&
            !document.getElementById(`v${x.version}`)
          ) {
            let inserted = false;
            const input = x.version.replace(/^v/, "");
            const element = `<tr data-versions=""><td class="align-middle" colspan="2"><strong>${x.version.replace(/^v/, "")}</strong> / <span>composer</span><br><small>${new Date(
              x.time,
            ).toLocaleString([], {
              month: "long",
              day: "2-digit",
              year: "numeric",
            })}</small></td><td class="align-middle"><strong>${
              x.require?.["typo3/cms-core"]
                ?.replaceAll(",", ", ")
                .replace(/((?<!\.))(\d)/g, "$1 $2") || ""
            }</strong></td><td class="align-middle composer"><a class="btn btn-primary" href="${x.dist.url}"><strong>ZIP</strong></a></td></tr>`;

            for (const y of document.querySelectorAll("tbody tr")) {
              if (
                input.localeCompare(
                  y.getElementsByTagName("strong")[0].innerText,
                  undefined,
                  { numeric: true },
                ) === 1
              ) {
                y.insertAdjacentHTML("beforebegin", element);
                inserted = true;
                break;
              }
            }

            if (!inserted)
              document
                .getElementsByTagName("tbody")[0]
                .insertAdjacentHTML("beforeend", element);
          }
        }

        update();
      },
    });
  } else {
    update();
  }

  function update() {
    // Add T3X download buttons

    for (const x of document.querySelectorAll(
      ".ter-ext-single-versionhistory .btn-primary:first-child",
    )) {
      const button = x.cloneNode(true);
      button.setAttribute(
        "href",
        x.getAttribute("href").replace("/zip", "/t3x"),
      );
      button.setAttribute("title", "");
      if (x.parentNode.classList.contains("composer"))
        button.classList.add("disabled");
      button.textContent = "T3X";
      x.insertAdjacentElement("afterend", button);
    }

    // Add Composer command buttons

    if (document.getElementById("install-composer")) {
      for (const x of document.querySelectorAll(
        ".ter-ext-single-versionhistory .btn-primary:first-child",
      )) {
        const button = x.cloneNode(true);
        button.setAttribute("href", "javascript:void(0)");
        button.setAttribute("onclick", "copyToClipboard(this)");
        button.setAttribute("title", "");
        button.setAttribute(
          "data-message",
          "Composer require command is in your clipboard now",
        );
        button.innerHTML = `<svg style="width:18px;height:18px;position:relative;top:-1px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" /></svg><span style="display:none">${document.querySelectorAll("#install-composer kbd")[0].textContent}:${
          x.parentNode.parentNode.firstElementChild.firstElementChild
            .textContent
        }</span>`;
        x.insertAdjacentElement("afterend", button);
      }
    }

    // Improve button styles

    for (const x of document.querySelectorAll(
      ".ter-ext-single-versionhistory .btn-primary",
    )) {
      x.style.paddingLeft = "1rem";
      x.style.paddingRight = "1rem";
      x.parentNode.style.display = "flex";
      x.parentNode.style.justifyContent = "space-around";
      x.parentNode.style.position = "relative";
      x.parentNode.style.top = "-1px";
    }

    // Replace to-be-deleted documentation links

    const x = document
      .getElementsByClassName("btn-info")[0]
      .getAttribute("href")
      .split("/");
    const y = `https://ia801807.us.archive.org/view_archive.php?archive=/12/items/ter-archive/docs.zip&file=${x[5]}%20${x[6]}.html`;
    if (x.length !== 7) return;
    GM.xmlHttpRequest({
      method: "GET",
      url: y,
      onload: (response) =>
        response.responseText
          ? document
              .getElementsByClassName("btn-info")[0]
              .setAttribute("href", y)
          : "",
    });
  }
})();
