// ==UserScript==
// @name        khinsider mass downloader
// @description mass downloader for downloads.khinsider.com
// @version     1.1.1
// @namespace   https://venipa.net/
// @license     GPL-3.0
// @author      Venipa <admin@venipa.net>
// @icon        https://www.google.com/s2/favicons?sz=64&domain=downloads.khinsider.com
// @match       https://*.khinsider.com/game-soundtracks/*
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @run-at      document-end
// @require     https://cdn.jsdelivr.net/npm/jszip@3.9.1/dist/jszip.min.js
// @require     https://cdn.jsdelivr.net/npm/file-saver@2.0.4/dist/FileSaver.min.js
// @connect     vgmsite.com
// @connect     vgmtreasurechest.com
// @downloadURL https://update.greasyfork.org/scripts/422490/khinsider%20mass%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/422490/khinsider%20mass%20downloader.meta.js
// ==/UserScript==

(function() {
  "use strict";
  ((e) => {
    if (["interactive", "complete"].indexOf(document.readyState) > -1)
      e();
    else {
      let t = !1;
      document.addEventListener("DOMContentLoaded", () => {
        t || (t = !0, setTimeout(e, 1));
      });
    }
  })(function() {
    function sanitizeFilename(input, options) {
      var illegalRe = /[\/\?<>\\:\*\|":]/g, controlRe = /[\x00-\x1f\x80-\x9f]/g, reservedRe = /^\.+$/, windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
      function sanitize(input2, replacement) {
        var sanitized = input2.replace(illegalRe, replacement).replace(controlRe, replacement).replace(reservedRe, replacement).replace(windowsReservedRe, replacement);
        return sanitized.split("").splice(0, 255).join("");
      }
      return function(input2, options2) {
        var replacement = options2 && options2.replacement || "", output = sanitize(input2, replacement);
        return replacement === "" ? output : sanitize(output, "");
      }(input, options);
    }
    const downloadStatus = {
      running: !1,
      skip: !1
    }, queue = [];
    console.log("loaded mass downloader");
    var btns = document.querySelector('p[align="left"]');
    const TEXTS = {
      /**
       *
       * @param {string} type
       */
      DOWNLOAD(type) {
        return "Download Album (" + type + ")";
      },
      LOADING: "LOADING...",
      /**
       *
       * @param {number} value
       * @param {number} max
       * @param {string} type
       */
      PREPARE(max, type) {
        return "Preparing audio downloads... (Audio Files: " + max + ") (" + type + ")";
      },
      /**
       *
       * @param {number} value
       * @param {number} max
       * @param {string} type
       */
      PROGRESS_ITEM(value, max, type) {
        const maxLength = max.toString().length;
        return "Fetching... (" + value.toString().padStart(maxLength) + " / " + max + ") (" + type + ")";
      },
      ARCHIVE_START(value, type) {
        return "Compressing... " + value + " (" + type + ")";
      }
    }, dlButton = function(type) {
      var el = document.createElement("button");
      return "btn khinsider-massdl".split(" ").forEach((cl) => el.classList.add(cl)), el.innerText = TEXTS.DOWNLOAD(type || "default"), el.dataset.type = type, el;
    }, dlCheck = function() {
      var el = document.createElement("input"), elContainer = document.createElement("label");
      "khinsider-massdl khinsider-massdl-compress-check".split(" ").forEach((cl) => el.classList.add(cl)), el.id = "khmdl-compress-check", el.type = "checkbox", elContainer.setAttribute("for", `#${el.id}`);
      var label = document.createElement("span");
      return label.innerText = "Compress items to zip", elContainer.appendChild(el), elContainer.appendChild(label), { id: el.id, checkbox: el, container: elContainer };
    }, checkFlac = () => Array.from(document.querySelectorAll("#songlist_header th>b")).findIndex(
      (x) => x.innerText.trim() === "FLAC"
    ) !== -1, spacerEl = function(x, y) {
      var el = document.createElement("div");
      return el.style.width = (x || 0) + "px", el.style.height = (y || 0) + "px", el.style.display = "inline-block", el;
    }, mp3DL = dlButton("mp3"), flacDL = dlButton("flac"), compressCheck = dlCheck(), hasFlac = checkFlac(), setDisabledState = function(state) {
      mp3DL.disabled = state, hasFlac && (flacDL.disabled = state);
    }, get = (url, responseType = "json", retry = 3, ext = ".mp3") => new Promise((resolve, reject) => {
      try {
        GM_xmlhttpRequest({
          method: "GET",
          url,
          responseType,
          onerror: (e) => {
            retry === 0 ? reject(e) : (console.warn("Network error, retry."), e.status == 415 && (url = url.slice(0, url.lastIndexOf(".")) + ext), setTimeout(() => {
              resolve(get(url, responseType, retry - 1));
            }, 1e3));
          },
          onload: ({ status, response }) => {
            [200, 206].includes(status) ? resolve(response) : status === 415 ? setTimeout(() => {
              resolve(
                get(
                  url.slice(0, url.lastIndexOf(".")) + ext,
                  responseType,
                  retry - 1
                )
              );
            }, 500) : retry === 0 ? reject(`${status} ${url}`) : (console.warn(status, url), setTimeout(() => {
              resolve(get(url, responseType, retry - 1));
            }, 500));
          }
        });
      } catch (error) {
        reject(error);
      }
    }), requestPage = (url) => new Promise((resolve, reject) => {
      try {
        GM_xmlhttpRequest({
          method: "GET",
          url,
          responseType: "text",
          onerror: reject,
          onload: ({ status, response, error }) => {
            status === 200 && resolve(response), reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    }), startQueue = async (typeOfDL, compress) => {
      if (!downloadStatus.running && queue.length > 0) {
        const dl = typeOfDL === "flac" ? flacDL : mp3DL, zip = compress && new JSZip() || null;
        let i = 0, l = queue.length;
        downloadStatus.running = !0, dl.innerText = TEXTS.PREPARE(l, typeOfDL);
        do {
          const { url: meta, data } = await queue[0](), { url, title } = meta;
          if (!data || data.size <= 0) {
            queue.shift(), dl.innerText = TEXTS.PROGRESS_ITEM(++i, l, typeOfDL);
            continue;
          }
          let fname = url.split("/").reverse()[0];
          fname = fname.slice(0, fname.lastIndexOf("."));
          let fext = typeOfDL === "flac" ? "flac" : "mp3";
          data.type === "audio/mpeg" && (fext = "mp3"), compress ? zip.file(
            sanitizeFilename(title).replace(/\.(mp3|flac)$/g, "") + "." + fext,
            data
          ) : saveAs(
            data,
            sanitizeFilename(title).replace(/\.(mp3|flac)$/g, "") + "." + fext
          ), queue.shift(), dl.innerText = TEXTS.PROGRESS_ITEM(++i, l, typeOfDL);
        } while (queue.length > 0);
        if (downloadStatus.running = !1, compress)
          return dl.innerText = TEXTS.ARCHIVE_START("0%", typeOfDL), await zip.generateAsync({ type: "blob" }, (progress) => {
            dl.innerText = TEXTS.ARCHIVE_START(
              progress.percent.toFixed(2) + "%",
              typeOfDL
            );
          }).catch((err) => (console.error("failed to generate zip", err), Promise.reject(err)));
      }
      return null;
    }, onClick = function(ev) {
      if (ev.preventDefault(), ev.target.disabled)
        return;
      ev.target.disabled = !0, setDisabledState(!0);
      const typeOfDL = ev.target.dataset.type, typeOfExt = typeOfDL === "flac" ? ".flac" : typeOfDL === "mp3" ? ".mp3" : "null", header = Array.from(
        document.querySelectorAll("#songlist #songlist_header > th")
      ), hasCD = !!header.find(
        (x) => x.innerText && x.innerText.trim() === "CD"
      ), hasNumber = !!header.find(
        (x) => x.innerText && x.innerText.trim() === "#"
      ), compressToZip = compressCheck.checkbox.checked, urls = Array.from(
        document.querySelectorAll("#songlist #songlist_header ~ tr")
      ).filter((x) => x.querySelectorAll("td.clickable-row a").length > 0).map((x) => {
        const fields = x.querySelectorAll("td");
        let title = x.querySelectorAll("td.clickable-row a")[0].innerText, url = x.querySelector(".playlistDownloadSong a").href, meta = {
          CD: hasCD ? fields[1].innerText : null,
          PIECE: hasCD ? fields[2].innerText : hasNumber ? fields[1].innerText : null
        };
        return title = title.replace(/\.(mp3|flac)$/g, ""), {
          title: (meta.CD ? meta.CD + "-" : "") + (meta.PIECE ? meta.PIECE.trim().match(/(\d+)/i)[0] + " " : "") + title + typeOfExt,
          ext: typeOfExt,
          url
        };
      });
      if (urls.length === 0) {
        ev.target.disabled = !1, setDisabledState(!1);
        return;
      }
      const pageName = document.querySelector("#pageContent>h2").innerText;
      queue.push(
        ...urls.map((x) => async () => {
          try {
            return {
              url: x,
              data: await requestPage(x.url).then((page) => {
                const container = document.implementation.createHTMLDocument().documentElement;
                container.style.display = "none", container.innerHTML = page;
                const fileUrl = Array.from(
                  container.querySelectorAll(".songDownloadLink")
                ).map(
                  (s) => s.parentElement
                ).find((d) => d.href.endsWith(x.ext)).href;
                return get(fileUrl, "blob", 2, x.ext);
              }).catch((err) => (console.error(err), null))
            };
          } catch (ex) {
            return console.error(ex), { url: x, data: null };
          }
        })
      ), startQueue(typeOfDL, compressToZip).then((data) => {
        ev.target.disabled = !1, setDisabledState(!1), data && saveAs(data, pageName + ` (${String(typeOfDL).toUpperCase()}).zip`), ev.target.innerText = TEXTS.DOWNLOAD(typeOfDL);
      });
    };
    mp3DL.onclick = onClick, compressCheck.checkbox.checked = compressCheck.checkbox.value = !0, hasFlac && (flacDL.onclick = onClick), btns && (btns.appendChild(mp3DL), hasFlac && (btns.appendChild(spacerEl(8, 0)), btns.appendChild(flacDL)), btns.appendChild(spacerEl(8, 0)), btns.appendChild(compressCheck.container)), unsafeWindow.onbeforeunload = (ev) => downloadStatus.running ? "khinsider downloader is still running, do you still want to cancel?" : mp3DL.disabled ? "khinsider downloader is currently compressing, do you still want to cancel?" : null;
  });
})();
