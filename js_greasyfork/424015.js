// ==UserScript==
// @name               VGMLoaderX
// @name:de            VGMLoaderX
// @name:en            VGMLoaderX
// @namespace          sun/userscripts
// @version            1.1.0
// @description        Automatically downloads albums from KHInsider without an account.
// @description:de     Lädt Alben von KHInsider automatisch und ohne Account herunter.
// @description:en     Automatically downloads albums from KHInsider without an account.
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
// @include            https://downloads.khinsider.com/game-soundtracks/album/*
// @match              https://downloads.khinsider.com/game-soundtracks/album/*
// @connect            vgmdownloads.com
// @connect            vgmsite.com
// @connect            vgmtreasurechest.com
// @run-at             document-end
// @inject-into        page
// @grant              GM.getValue
// @grant              GM_getValue
// @grant              GM.info
// @grant              GM_info
// @grant              GM.setValue
// @grant              GM_setValue
// @grant              GM.xmlHttpRequest
// @grant              GM_xmlhttpRequest
// @noframes
// @require            https://unpkg.com/@zip.js/zip.js/dist/zip.js
// @require            https://unpkg.com/file-saver
// @require            https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/VGMLoaderX.ico
// @copyright          2021-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/424015/VGMLoaderX.user.js
// @updateURL https://update.greasyfork.org/scripts/424015/VGMLoaderX.meta.js
// ==/UserScript==

(() => {
  for (const x of document.querySelectorAll('a[href^="/cp/add_album/"]')) {
    x.addEventListener("click", async (e) => {
      e.preventDefault();

      const format = [
        ...document.querySelectorAll("#songlist_header th[align=right]"),
      ].map((x) => x.textContent);
      if (format.length === 1) {
        download(format[0]);
      } else {
        document.body.insertAdjacentHTML(
          "beforeend",
          `
          <dialog id="vgmloaderx-dialog">
            <p style="margin: auto">
              <b>${GM.info.script.name}</b>
            </p>
            <p>Please select your desired format:</p>
            <form>
              <p>
                <select id="vgmloaderx-select" style="width: 100%"></select>
              </p>
              <p style="display: flex; align-items: center; gap: 1ch">
                <input id="vgmloaderx-input" type="checkbox">
                <label for="vgmloaderx-input">Save as default format</label>
              </p>
              <p style="display: none">
                <i>
                  The selected format will be preselected in any future dialogs,<br>
                  unless the requested album is not available in said format,<br>
                  in which case the first available one will be chosen instead.
                </i>
              </p>
              <p style="float: right; margin: auto">
                <button id="vgmloaderx-confirm">OK</button>
                <button formmethod="dialog">Cancel</button>
              </p>
            </form>
          </dialog>
          <style>
            p:has(> #vgmloaderx-input:checked) + p {
              display: block !important;
            }
          </style>
        `,
        );

        const dialog = document.getElementById("vgmloaderx-dialog");
        const select = document.getElementById("vgmloaderx-select");
        const input = document.getElementById("vgmloaderx-input");
        const confirm = document.getElementById("vgmloaderx-confirm");

        for (const x of format) {
          const parent = document.createElement("option");
          const child = document.createTextNode(x);

          if (x === (await GM.getValue("format")))
            parent.setAttribute("selected", true);

          parent.appendChild(child);
          select.appendChild(parent);
        }

        dialog.addEventListener("close", async () => {
          dialog.remove();

          if (!dialog.returnValue) return;

          if (input.checked) await GM.setValue("format", dialog.returnValue);

          download(dialog.returnValue);
        });

        confirm.addEventListener("click", (event) => {
          event.preventDefault();
          dialog.close(select.value);
        });

        dialog.showModal();
      }

      function download(format) {
        const element = document.getElementsByClassName("albumMassDownload")[0];
        element.style.height = "auto";
        element.style.marginBottom = "2em";

        const input = eval(
          document
            .querySelector("#pageContent script")
            .textContent.slice(5, -3)
            .replace("function", "function x")
            .replace("return p}", "return p}x"),
        );

        const mediaPath = input.match(/mediaPath='(.+?)'/)[1];
        const tracks = JSON.parse(
          input.match(/tracks=(\[.+?,\])/)[1].replace(",]", "]"),
        );
        const output = tracks.map(
          (x) =>
            `${
              mediaPath + x.file.split(".").slice(0, -1).join(".")
            }.${format.toLowerCase()}`,
        );
        const names = tracks.map((x) => x.name);

        const blobWriter = new zip.BlobWriter("application/zip");
        const writer = new zip.ZipWriter(blobWriter);

        function forSync(i) {
          element.innerHTML = `Downloading track ${i + 1} of ${output.length} (${names[i] || `Track ${i + 1}`})...`;
          GM.xmlHttpRequest({
            method: "GET",
            url: output[i],
            responseType: "blob",
            onload: async (response) => {
              await writer.add(
                decodeURIComponent(output[i].split("/").pop()),
                new zip.BlobReader(response.response),
              );

              if (output[i + 1]) {
                forSync(i + 1);
              } else {
                await writer.close();
                const blob = await blobWriter.getData();
                saveAs(
                  blob,
                  `${document.getElementsByTagName("h2")[0].textContent}.zip`,
                );
                element.innerHTML =
                  "Album successfully downloaded. ZIP file has been passed to the browser.";
              }
            },
          });
        }
        forSync(0);
      }
    });
  }
})();
