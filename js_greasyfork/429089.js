// ==UserScript==
// @name               StreetVoiceLoader
// @name:de            StreetVoiceLoader
// @name:en            StreetVoiceLoader
// @namespace          sun/userscripts
// @version            2.1.13
// @description        Enables downloading of tracks and albums from StreetVoice.
// @description:de     Erlaubt das Herunterladen von Liedern und Alben von StreetVoice.
// @description:en     Enables downloading of tracks and albums from StreetVoice.
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
// @include            https://streetvoice.com/*/songs/*
// @match              https://streetvoice.com/*/songs/*
// @connect            streetvoice.com
// @run-at             document-end
// @inject-into        auto
// @grant              GM.xmlHttpRequest
// @grant              GM_xmlhttpRequest
// @noframes
// @require            https://unpkg.com/@zip.js/zip.js/dist/zip.js
// @require            https://unpkg.com/file-saver
// @require            https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/StreetVoiceLoader.ico
// @copyright          2021-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/429089/StreetVoiceLoader.user.js
// @updateURL https://update.greasyfork.org/scripts/429089/StreetVoiceLoader.meta.js
// ==/UserScript==

(() => {
  const wrapper = document.querySelector(
    "#inside_box .col-lg-auto .list-inline",
  );
  const element = `<li class="list-inline-item">
    <button id="btn-svl" class="btn btn-circle btn-outline-white btn-lg">
      ⬇
    </button>
  </li>`;

  if (location.pathname.split("/")[3] === "album") {
    GM.xmlHttpRequest({
      method: "GET",
      url: `https://streetvoice.com/api/v5/album/${location.pathname.split("/")[4]}/songs/?limit=100`,
      onload: (response) => {
        const ids = JSON.parse(response.responseText).results.map(
          (result) => result.id,
        );
        insert(ids);
      },
    });
  } else {
    const ids = [Number(location.pathname.split("/")[3])];
    insert(ids);
  }

  function insert(ids) {
    wrapper.insertAdjacentHTML("afterbegin", element);
    document
      .getElementById("btn-svl")
      .setAttribute("data-svl", JSON.stringify(ids));
    document.getElementById("btn-svl").onclick = (event) => file(event);
  }

  function file(event) {
    event.target.disabled = true;

    const ids = JSON.parse(event.target.getAttribute("data-svl"));
    const urls = [];

    function forSync(i) {
      document.getElementById("btn-svl").innerHTML =
        `<small>${i + 1}/${ids.length}</small>`;

      GM.xmlHttpRequest({
        method: "POST",
        url: `https://streetvoice.com/api/v5/song/${ids[i]}/hls/file/`,
        onload: (response) => {
          urls.push(JSON.parse(response.responseText).file);

          if (ids[i + 1]) {
            forSync(i + 1);
          } else {
            m3u8(urls);
          }
        },
      });
    }

    forSync(0);
  }

  function m3u8(urls) {
    const files = [];

    function forSync(i) {
      document.getElementById("btn-svl").innerHTML =
        `<small>${i + 1}/${urls.length}</small>`;

      const base = `${urls[i].substring(0, urls[i].lastIndexOf("/"))}/`;

      GM.xmlHttpRequest({
        method: "GET",
        url: urls[i],
        onload: (response) => {
          files.push(
            response.responseText.match(/.*\.ts/g).map((match) => base + match),
          );

          if (urls[i + 1]) {
            forSync(i + 1);
          } else {
            ts(files);
          }
        },
      });
    }

    forSync(0);
  }

  function ts(files) {
    const data = [];

    function forSyncX(i) {
      document.getElementById("btn-svl").innerHTML =
        `<small>${i + 1}/${files.length}</small>`;

      let blob = [];

      const blobWriter = new zip.BlobWriter("application/zip");
      const _writer = new zip.ZipWriter(blobWriter);

      function forSyncY(j) {
        GM.xmlHttpRequest({
          method: "GET",
          url: files[i][j],
          responseType: "blob",
          onload: (response) => {
            blob.push(response.response);

            if (files[i][j + 1]) {
              forSyncY(j + 1);
            } else {
              blob = new Blob(blob);
              data.push(blob);

              if (files[i + 1]) {
                forSyncX(i + 1);
              } else {
                download(data);
              }
            }
          },
        });
      }

      forSyncY(0);
    }

    forSyncX(0);
  }

  function download(data) {
    const blobWriter = new zip.BlobWriter("application/zip");
    const writer = new zip.ZipWriter(blobWriter);

    function forSync(i) {
      writer.add(`${i + 1}.ts`, new zip.BlobReader(data[i])).then(() => {
        if (data[i + 1]) {
          forSync(i + 1);
        } else {
          writer.close().then(() => {
            saveAs(
              blobWriter.getData(),
              `${document.getElementsByTagName("h1")[0].textContent.trim()}.zip`,
            );

            document.getElementById("btn-svl").disabled = false;
            document.getElementById("btn-svl").innerText = "⬇";
          });
        }
      });
    }

    forSync(0);
  }
})();
