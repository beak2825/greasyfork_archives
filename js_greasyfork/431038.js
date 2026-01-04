// ==UserScript==
// @name               MSGPIntegration
// @name:de            MSGPIntegration
// @name:en            MSGPIntegration
// @namespace          sun/userscripts
// @version            2.0.12
// @description        Allows access to the Microsoft Store Generation Project from within Microsoft Store itself.
// @description:de     Integriert das Microsoft Store Generation Project in den Microsoft Store selbst.
// @description:en     Allows access to the Microsoft Store Generation Project from within Microsoft Store itself.
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
// @include            https://apps.microsoft.com/store/detail/*/*
// @match              https://apps.microsoft.com/store/detail/*/*
// @connect            store.rg-adguard.net
// @run-at             document-end
// @inject-into        auto
// @grant              GM.addStyle
// @grant              GM_addStyle
// @grant              GM.xmlHttpRequest
// @grant              GM_xmlhttpRequest
// @noframes
// @require            https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/MSGPIntegration.ico
// @copyright          2021-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/431038/MSGPIntegration.user.js
// @updateURL https://update.greasyfork.org/scripts/431038/MSGPIntegration.meta.js
// ==/UserScript==

(() => {
  const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (
        Array.from(mutation.addedNodes).filter((node) =>
          node.classList.contains("c013"),
        ).length
      ) {
        observer.disconnect();

        document
          .querySelector("[id^=getOrRemoveButton]")
          .insertAdjacentHTML(
            "afterend",
            "<button id='msgpintegration-button' class='c0151 c0158' style='border-radius: 4px; padding: 0 20px; margin-bottom: 4px' disabled><span id='msgpintegration-text'>Loading...</span></button>",
          );
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  const url = location.pathname.split("/")[4];

  GM.xmlHttpRequest({
    method: "POST",
    url: "https://store.rg-adguard.net/api/GetFiles",
    data: `type=ProductId&url=${url}&lang=en_US`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    onload: (response) => {
      const element = document.createElement("html");
      element.innerHTML = response.responseText;

      if (
        element.getElementsByTagName("p")[0].innerText !==
        "The links were successfully received from the Microsoft Store server."
      ) {
        document.getElementById("msgpintegration-text").innerText =
          "No links found.";
        return;
      }

      document
        .getElementById("msgpintegration-button")
        .classList.remove("c0158");
      document
        .getElementById("msgpintegration-button")
        .removeAttribute("disabled");
      document.getElementById("msgpintegration-text").innerText = `${
        element.getElementsByClassName("tftable")[0].rows.length - 1
      } links found.`;

      document.body.insertAdjacentHTML(
        "beforeend",
        "<div id='msgpintegration-background'></div>",
      );
      document
        .getElementById("msgpintegration-background")
        .insertAdjacentElement(
          "beforeend",
          element.getElementsByClassName("tftable")[0],
        );
      GM.addStyle(`
        #msgpintegration-background {
          position: fixed;
          top: 0;
          width: 100vw;
          height: 100vh;
          z-index: 701;
          background-color: white;
          overflow-y: auto;
          display: none;
        }
        .tftable {
          margin: 3em auto;
        }
        @media (min-width: 1035px) {
          .tftable {
            margin-top: calc(3em + 54px);
          }
        }
      `);

      document
        .getElementById("msgpintegration-button")
        .addEventListener("click", () => {
          document.getElementById("msgpintegration-background").style.display =
            "initial";
        });

      document
        .getElementById("msgpintegration-background")
        .addEventListener("click", (e) => {
          if (
            e.target === document.getElementById("msgpintegration-background")
          )
            document.getElementById(
              "msgpintegration-background",
            ).style.display = "none";
        });
    },
  });
})();
