// ==UserScript==
// @name        提取bilibili视频下载地址 - 12redcircle
// @namespace   cyou.12redcircle.bilibili-video-download-extractor
// @match       https://www.bilibili.com/video/*
// @grant       none
// @version     20221015.1
// @author      12redcircle
// @description 给bilibili视频添加直链下载功能。
// @license     MIT
// @require     https://cdn.jsdelivr.net/npm/sweetalert2@11.4.33/dist/sweetalert2.all.min.js
//
// @downloadURL https://update.greasyfork.org/scripts/452060/%E6%8F%90%E5%8F%96bilibili%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%20-%2012redcircle.user.js
// @updateURL https://update.greasyfork.org/scripts/452060/%E6%8F%90%E5%8F%96bilibili%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%20-%2012redcircle.meta.js
// ==/UserScript==
/**
 * 获取bvid
 * @returns
 */
function getBvid() {
  return location.href.match(/www.bilibili.com\/video\/(BV[A-Za-z0-9]*)/)?.[1];
}

/**
 * 获取视频标题
 * @returns
 */
function getTitle() {
  return document.querySelector(`h1.video-title`)?.title;
}

/**
 * 获取每条视频信息
 * @returns
 */
async function getPages(bvid) {
  const res = await fetch(
    `https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`
  ).then((res) => res.json());
  const data = res?.data || [];
  return data.map((d) => ({
    name: d.part,
    cid: d.cid,
  }));
}

/**
 * bvid换avid
 * @returns
 */
async function getAvidByBvid(bvid) {
  const res = await fetch(
    `https://api.bilibili.com/x/web-interface/archive/stat?bvid=${bvid}`
  ).then((res) => res.json());
  const avid = res?.data?.aid;
  return avid;
}

/**
 * 获取下载链接
 * @returns
 */
async function getDownloadURL(avid, cid) {
  const res = await fetch(
    `https://api.bilibili.com/x/player/playurl?avid=${avid}&cid=${cid}&qn=112`
  ).then((res) => res.json());
  const url = res?.data?.durl?.[0]?.url;
  return url;
}

function appendDOM(anchor) {
  const id = `acev_bilivideo_down_${Math.random().toString().substring(2, 10)}`;

  const downloadId = `${id}_download_btn`;
  const tooltipId = `${id}_tooltip`;

  const style = createCss();
  const html = createHTML();

  document.body.appendChild(style);
  anchor.insertAdjacentHTML(`beforeend`, html);

  bindTip();

  function createHTML() {
    const icon = `
              <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1427" width="32" height="32"><path d="M768 768q0-14.857143-10.857143-25.714286t-25.714286-10.857143-25.714286 10.857143-10.857143 25.714286 10.857143 25.714286 25.714286 10.857143 25.714286-10.857143 10.857143-25.714286zm146.285714 0q0-14.857143-10.857143-25.714286t-25.714286-10.857143-25.714286 10.857143-10.857143 25.714286 10.857143 25.714286 25.714286 10.857143 25.714286-10.857143 10.857143-25.714286zm73.142857-128l0 182.857143q0 22.857143-16 38.857143t-38.857143 16l-841.142857 0q-22.857143 0-38.857143-16t-16-38.857143l0-182.857143q0-22.857143 16-38.857143t38.857143-16l265.714286 0 77.142857 77.714286q33.142857 32 77.714286 32t77.714286-32l77.714286-77.714286 265.142857 0q22.857143 0 38.857143 16t16 38.857143zm-185.714286-325.142857q9.714286 23.428571-8 40l-256 256q-10.285714 10.857143-25.714286 10.857143t-25.714286-10.857143l-256-256q-17.714286-16.571429-8-40 9.714286-22.285714 33.714286-22.285714l146.285714 0 0-256q0-14.857143 10.857143-25.714286t25.714286-10.857143l146.285714 0q14.857143 0 25.714286 10.857143t10.857143 25.714286l0 256 146.285714 0q24 0 33.714286 22.285714z" p-id="1428"></path></svg>
             `;

    const html = `
              <button id="${downloadId}" class="acev_bilivideo_down_download_btn">
              ${icon}
              <span>下载高清视频</span>
              <span data-status></span>
              </button>
              <div id="${tooltipId}"></div>
             `;
    return html;
  }

  function createTipHTML(data = {}) {
    const { urls = [] } = data;
    const tipHtml = `
    <fieldset>
      <legend>点击以下链接下载高清视频</legend>
      <table class="acev_bilivideo_down_tooltip">
          <tr>
              <th>序号</th>
              <th>下载链接</th>
          </tr>
          ${urls.map(({ name, url }, $index) =>
          `
          <tr>
              <td class="index">${$index + 1}</td>
              <td>
                  <a href="${url}" target="_blank">${name}</a>
              </td>
          </tr>
          `
          )
          .join("\n")}
      </table>
    </div>
  </fieldset>
    `
    return tipHtml;
  }

  function createCss() {
    const css = `
        .acev_bilivideo_down_download_btn {
            display: flex;
            border: none;
            padding: .2em 1em;
            border-radius: 2px;
            margin: 0 1em;
            background: #dcdcdc;
            color: #333;
            white-space: nowrap;
            cursor: pointer;
        }

        .acev_bilivideo_down_download_btn:hover {
            background-color: pink;
        }

        .acev_bilivideo_down_download_btn .icon {
            fill: currentColor;
            width: 1.6em;
            height: 1.6em;
            margin-right: 4px;
        }

        .acev_bilivideo_down_tooltip {
            font-size: 1rem;
            text-align: left;
            margin-top: 6px;
        }

        .acev_bilivideo_down_tooltip .index {
            min-width: 4rem;
        }

        .acev_bilivideo_down_tooltip td,
        .acev_bilivideo_down_tooltip th {
            border: #333 2px solid;
            padding: 6px;
        }

        .acev_bilivideo_down_tooltip a:hover {
            border-bottom: 2px currentColor solid;
            color: blue;
        }
  `;

    const style = document.createElement("style");
    style.insertAdjacentHTML(`beforeend`, css);
    return style;
  }


  async function toggleTip(tip) {
      updateLoadingStatus("正在获取资源");
      const metadata = await getMetadatas();
      const tipHtml = createTipHTML({ urls: metadata.urls });

      Swal.fire({
        html: tipHtml,
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      })

      updateLoadingStatus();
  }

  function bindTip() {
    const downloadBtn = document.getElementById(downloadId);
    downloadBtn.onclick = () => toggleTip();
  }

  function updateLoadingStatus(text) {
    const downloadBtn = document.getElementById(downloadId);
    if (downloadBtn) {
      const status = downloadBtn.querySelector("[data-status]");
      status.textContent = text ? `（${text}）` : "";
    }
  }
}

async function getMetadatas() {
  const bvid = getBvid();
  const pages = await getPages(bvid);
  const avid = await getAvidByBvid(bvid);

  const title = getTitle();
  const urls = await Promise.all(
    pages.map(({ name, cid }) =>
      getDownloadURL(avid, cid).then((url) => ({
        name: `${title}_${name}`,
        url,
      }))
    )
  );
  return {
    title,
    urls,
  };
}

(async () => {
  const DELAY = 2500; //偷个懒，anchor 这里的 DOM 加载会有延迟，添加 DELAY 可以绕过这个问题。
  setTimeout(() => {
    const anchor =
      document.querySelector(`#viewbox_report div.video-data`) ||
      document.querySelector(`#viewbox_report div.video-info-desc`);

    appendDOM(anchor);
  }, DELAY);
})();


/**
 * 打开文件句柄
 */
async function getNewFileHandle() {
  const options = {
    startIn: 'downloads',
    suggestedName: 'Untitled Text.flv',
    types: [
      {
        description: 'Text Files',
        accept: {
          'text/plain': ['.flv'],
        },
      },
    ],
  };
  const handle = await window.showSaveFilePicker(options);
  return handle;
}


/**
 * 将接口返回的文件流写入文件
 */
async function writeURLToFile(fileHandle, url) {
  const writable = await fileHandle.createWritable();
  const response = await fetch(url);

  const reader = response.body.getReader();
  const writer = writable.getWriter();

  const contentLength = +response.headers.get('Content-Length');
  let loadedContentLength = 0;

  while(true) {
    const {done, value} = await reader.read(); //读取数据流
    const chunkLength = value.length;

    await writer.write(value); //写入到文件
    loadedContentLength += chunkLength;//将写入到文件的大小记录下来

    console.log(`Received ${value.length} bytes, total: ${loadedContentLength}, `)

    if (done || contentLength === loadedContentLength) { //如果接收到的数据长度和 ContentLength 相同，主动关闭可读流
      await writer.close();
      break;
    }
  }
}
