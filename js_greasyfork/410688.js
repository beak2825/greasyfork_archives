// ==UserScript==
// @name         top.gg emote downloader
// @namespace    https://venipa.net/
// @license      GPL-3.0
// @version      0.2.1
// @description  try to take over the world!
// @author       Venipa <admin@venipa.net>
// @include      /^https?://top\.gg/servers/(\d+)
// @match        https://top.gg/servers/*
// @connect      cdn.discordapp.com
// @require      https://cdn.jsdelivr.net/npm/jszip@3.2.2/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/410688/topgg%20emote%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/410688/topgg%20emote%20downloader.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const sanitizeFilename = (input, options) => {
    var illegalRe = /[\/\?<>\\:\*\|":]/g;
    var controlRe = /[\x00-\x1f\x80-\x9f]/g;
    var reservedRe = /^\.+$/;
    var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;

    function sanitize(input, replacement) {
      var sanitized = input
        .replace(illegalRe, replacement)
        .replace(controlRe, replacement)
        .replace(reservedRe, replacement)
        .replace(windowsReservedRe, replacement);
      return sanitized.split("").splice(0, 255).join("");
    }

    return function (input, options) {
      var replacement = (options && options.replacement) || "";
      var output = sanitize(input, replacement);
      if (replacement === "") {
        return output;
      }
      return sanitize(output, "");
    }(input, options);
  }
  const createButton = (name, icon) => {
    const el = document.createElement("div");
    el.innerHTML = `<a href="javascript:void(0)" class="entity-header__button" rel="nofollow">
    <span class="entity-header__button-icon">
    <i class="${icon} icon"></i>
    </span>
    <span class="entity-header__button-text">
    ${name}
    </span>
  </a>`;
    return el.firstElementChild;
  };
  const downloadStatus = {
    running: false,
    skip: false,
  };
  const queue = [];
  console.log("loaded top.gg emote downloader");
  const buttonContainer = document.querySelector(
    ".entity-content__section.entity-header > .entity-header__actions"
  );
  const TEXTS = {
    DOWNLOAD: "Download Emotes",
    LOADING: "LOADING...",
    /**
     *
     * @param {number} value
     * @param {number} max
     */
    PROGRESS_ITEM(value, max) {
      const maxLength = max.toString().length;
      return (
        "Fetching... (" +
        value.toString().padStart(maxLength) +
        " / " +
        max +
        ")"
      );
    },
  };
  var dlButton = function () {
    var el = document.createElement("button");
    "btn btn-blue btn-2x".split(" ").forEach((cl) => el.classList.add(cl));
    el.innerText = TEXTS.DOWNLOAD;
    return el;
  };
  var dl = createButton(TEXTS.DOWNLOAD, "download");
  dl.id = "TOPGGDownloader";
  var dlText = dl.querySelector(".entity-header__button-text");
  const toggleButtonState = (state) => {
    if (state) dl.classList.add("text-erased");
    else dl.classList.remove("text-erased");
    dl.disable = state === true;
  };

  const get = (url, responseType = "json", retry = 3) =>
    new Promise((resolve, reject) => {
      try {
        GM_xmlhttpRequest({
          method: "GET",
          url,
          responseType,
          onerror: (e) => {
            if (retry === 0) reject(e);
            else {
              console.warn("Network error, retry.");
              if (e.status == 415) {
                url = url.slice(0, url.lastIndexOf(".")) + ".png";
              }
              setTimeout(() => {
                resolve(get(url, responseType, retry - 1));
              }, 1000);
            }
          },
          onload: ({ status, response }) => {
            if (status === 200) resolve(response);
            else if (status === 415)
              setTimeout(() => {
                resolve(
                  get(
                    url.slice(0, url.lastIndexOf(".")) + ".png",
                    responseType,
                    retry - 1
                  )
                );
              }, 500);
            else if (retry === 0) reject(`${status} ${url}`);
            else {
              console.warn(status, url);
              setTimeout(() => {
                resolve(get(url, responseType, retry - 1));
              }, 500);
            }
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  const startQueue = async () => {
    if (!downloadStatus.running && queue.length > 0) {
      const zip = new JSZip();
      let i = 0;
      let l = queue.length;
      downloadStatus.running = true;
      do {
        const { url, data } = await queue[0]();
        if (!data || data.size <= 0) {
          queue.shift();
          dlText.innerText = TEXTS.PROGRESS_ITEM(i++, l);
          continue;
        }
        let fname = url.split("/").reverse()[0];
        fname = fname.slice(0, fname.lastIndexOf("."));
        let fext = "png";
        if (data.type === "image/gif") fext = "gif";
        zip.file(sanitizeFilename(fname + "." + fext), data);
        queue.shift();
        dlText.innerText = TEXTS.PROGRESS_ITEM(i++, l);
      } while (queue.length > 0);
      downloadStatus.running = false;
      return await zip.generateAsync({ type: "blob" });
    }
    return null;
  };
  /**
   *
   * @param ev {{target: HTMLButtonElement}}
   */
  dl.onclick = function (ev) {
    if (ev.target.disabled) return;
    toggleButtonState(true);
    const title = document.querySelector('.entity-header__name').innerText;
    const urls = Array.from(
      document.querySelectorAll(
        ".entity-sidebar__emotes .entity-sidebar__grid-previews img.emote"
      )
    ).map((x) => x.src);
    if (urls.length === 0) {
      toggleButtonState(false);
      return;
    }
    queue.push(
      ...urls
        .map((x) => x.slice(0, x.lastIndexOf(".")) + ".gif")
        .map((x) => {
          return async () => {
            try {
              return { url: x, data: await get(x, "blob", 2) };
            } catch (ex) {
              console.error(ex);
              return { url: x, data: null };
            }
          };
        })
    );
    startQueue().then((data) => {
      toggleButtonState(false);
      if (data) {
        saveAs(
          data,
          sanitizeFilename(title) +
            ".zip" || "emotes.zip"
        );
        dlText.innerText = TEXTS.DOWNLOAD;
      }
    });
  };
  if (buttonContainer) buttonContainer.appendChild(dl);
})();
