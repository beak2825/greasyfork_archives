// ==UserScript==
// @name               T3ResizableConsole
// @name:de            T3ResizableConsole
// @name:en            T3ResizableConsole
// @namespace          sun/userscripts
// @version            1.0.20
// @description        Makes TYPO3's debug console resizable.
// @description:de     Erlaubt die Höhenänderung der TYPO3-Debug-Konsole.
// @description:en     Makes TYPO3's debug console resizable.
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
// @include            *://*/typo3/index.php*
// @match              *://*/typo3/index.php*
// @run-at             document-end
// @inject-into        auto
// @grant              none
// @noframes
// @require            https://unpkg.com/interactjs
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/T3ResizableConsole.png
// @copyright          2020-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/411015/T3ResizableConsole.user.js
// @updateURL https://update.greasyfork.org/scripts/411015/T3ResizableConsole.meta.js
// ==/UserScript==

(() => {
  interact("#typo3-debug-console")
    .resizable({
      edges: {
        top: true,
      },
    })
    .on("resizemove", (event) => {
      document.querySelectorAll(".t3js-messages.messages")[0].style.height =
        `${event.rect.height - 77}px`;
    })
    .on("resizestart", () => {
      document.querySelectorAll("#typo3-contentIframe")[0].style.pointerEvents =
        "none";
    })
    .on("resizeend", () => {
      document.querySelectorAll("#typo3-contentIframe")[0].style.pointerEvents =
        "initial";
    });

  // resizestart and resizeend events are required due to the iframe displayed above the console.
  // See https://github.com/taye/interact.js/issues/200 for details.
})();
