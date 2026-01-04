// ==UserScript==
// @name         bilibili muzic
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  download bilibili music collection to zip.
// @author       jeffwong
// @match        https://www.bilibili.com/audio/am*
// @require https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454362/bilibili%20muzic.user.js
// @updateURL https://update.greasyfork.org/scripts/454362/bilibili%20muzic.meta.js
// ==/UserScript==

(async () => {
  const getInfo = async (sid = 31471700) => {
    const { code, data } = await fetch(
      `https://www.bilibili.com/audio/music-service-c/web/menu/info?sid=${sid}`
    ).then((res) => res.json());

    return data;
  };

  const getList = async (sid = 31471700) => {
    const {
      code,
      data: { data },
    } = await fetch(
      `https://www.bilibili.com/audio/music-service-c/web/song/of-menu?sid=${sid}&pn=1&ps=100`
    ).then((res) => res.json());

    return data;
  };

  const getUrl = async (sid = 1904315) => {
    const {
      code,
      data: {
        cdns: [url],
      },
    } = await fetch(
      `https://www.bilibili.com/audio/music-service-c/web/url?sid=${sid}&privilege=2&quality=2`
    ).then((res) => res.json());

    return url;
  };

  const getBlob = (index, url) =>
    fetch(url).then(
      (res) =>
        new Promise(async (resolve) => {
          const reader = res.body.getReader();
          const contentLength = +res.headers.get("Content-Length");
          let receivedLength = 0; // received that many bytes at the moment
          let chunks = []; // array of received binary chunks (comprises the body)
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            chunks.push(value);
            receivedLength += value.length;

            const percentEl = document.querySelectorAll(".song-title")[index];
            const percent = Math.round((receivedLength / contentLength) * 100);

            percentEl.style.backgroundImage = `linear-gradient(90deg, rgba(1, 161, 214, 0.30) ${percent}%, transparent 0px)`;
          }

          resolve(new Blob(chunks));
        })
    );

  const muzic = async () => {
    const sid = /^https:\/\/www\.bilibili\.com\/audio\/am(\d+)/.test(
      location.href
    )
      ? RegExp.$1
      : null;
    const info = await getInfo(sid);
    const list = await getList(sid);
    const blobs = await Promise.all(
      list.map(({ id }, index) =>
        getUrl(id).then((url) =>
          getBlob(index, url).then((blob) => {
            list.find((item) => item.id === id).downloaded = true;
            return [id, blob];
          })
        )
      )
    );

    const zip = new JSZip();
    for (const [id, blob] of blobs) {
      const media = list.find((item) => item.id === id);
      zip.file(media.title + ".m4a", blob, { binary: true });
    }

    saveAs(await zip.generateAsync({ type: "blob" }), `${info.title}.zip`);
  };

  const waitElement = async (selector) =>
    new Promise((resolve) => {
      const timer = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(timer);
          resolve();
        }
      }, 1000);
    });

  const selector = ".share-board";
  await waitElement(selector);

  const btn = document.createElement("span");
  btn.innerHTML = `下载<span class="download-process"></span>`;
  btn.style = `
  cursor: pointer;
  margin-left: 20px;
  font-size: 18px;
  font-weight: bold;
  background-color: #00a1d6;
  padding: 10px;
  border-radius: 5px;
  color: white;
  `;
  document.querySelector(selector).appendChild(btn);
  btn.addEventListener("click", muzic);
})();
