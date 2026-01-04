// ==UserScript==
// @name               InvidiousNewPipeExport
// @name:de            InvidiousNewPipeExport
// @name:en            InvidiousNewPipeExport
// @namespace          sun/userscripts
// @version            1.0.12
// @description        Allows exporting Invidious subscriptions to NewPipe's new JSON format.
// @description:de     Ermöglicht den Export von Invidious-Abonnements in NewPipe's neues JSON-Format.
// @description:en     Allows exporting Invidious subscriptions to NewPipe's new JSON format.
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
// @include            *://*/data_control
// @include            *://*/data_control?*
// @match              *://*/data_control
// @match              *://*/data_control?*
// @connect            newpipe.net
// @run-at             document-end
// @inject-into        auto
// @grant              GM.xmlHttpRequest
// @grant              GM_xmlhttpRequest
// @noframes
// @require            https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/InvidiousNewPipeExport.png
// @copyright          2022-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/445279/InvidiousNewPipeExport.user.js
// @updateURL https://update.greasyfork.org/scripts/445279/InvidiousNewPipeExport.meta.js
// ==/UserScript==

(() => {
  document
    .querySelector(
      "[href='/subscription_manager?action_takeout=1&format=newpipe']",
    )
    .parentElement.insertAdjacentHTML(
      "afterend",
      "<div class='pure-control-group'><a id='inpe-export' href='#'>Export subscriptions as JSON (for NewPipe)</a></div>",
    );

  document.getElementById("inpe-export").onclick = () => {
    const newpipe_subscriptions = {};

    GM.xmlHttpRequest({
      url: "https://newpipe.net/api/data.json",
      onload: (response) => {
        const data = JSON.parse(response.responseText);

        newpipe_subscriptions.app_version = data.flavors.fdroid.stable.version;
        newpipe_subscriptions.app_version_int =
          data.flavors.fdroid.stable.version_code;

        GM.xmlHttpRequest({
          url: `${document.location.origin}/subscription_manager`,
          onload: (response) => {
            let data = response.responseText;
            data = new DOMParser().parseFromString(data, "text/html");
            data = Array.from(data.querySelectorAll("a"))
              .filter((x) => x.getAttribute("href").startsWith("/channel/"))
              .map((x) => {
                return {
                  service_id: 0,
                  url: `https://www.youtube.com${x.getAttribute("href")}`,
                  name: x.textContent,
                };
              });

            newpipe_subscriptions.subscriptions = data;

            const download = document.createElement("a");
            download.setAttribute(
              "href",
              `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(newpipe_subscriptions))}`,
            );
            download.setAttribute("download", "newpipe_subscriptions.json");
            download.click();
          },
        });
      },
    });
  };
})();
