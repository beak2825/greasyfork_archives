// ==UserScript==
// @name            JavList
// @version         1.0.6
// @namespace       naniJavdb
// @author          ishawnx
// @include         http*://*javdb*.com/v/*
// @include         http*://*javdb*.com/*
// @include         http*://*javlibrary.com/*?v=*
// @description     list movie path in goindex
// @grant           GM_xmlhttpRequest
// @connect         workers.dev
// @connect         dmm.co.jp
// @connect         r18.com
// @downloadURL https://update.greasyfork.org/scripts/426416/JavList.user.js
// @updateURL https://update.greasyfork.org/scripts/426416/JavList.meta.js
// ==/UserScript==
(async () => {
  // 配置参数
  const CONFIG = {};
  const MOVIE = {};
  CONFIG.origin = "https://goindex.leejs.workers.dev";
  CONFIG.drivesCount = 5;
  CONFIG.folderMimeType = "application/vnd.google-apps.folder";
  CONFIG.r18 = "https://www.r18.com/common/search/order=match/searchword=";
  CONFIG.dmm = "https://dmm.rion.workers.dev/digital/videoa/-/detail/=/cid=";
  // 插入页面的结果列表
  const oFilesList = document.createElement("ul");

  // GM_xmlhttpRequest wrapper
  const gmFetch = (url, { method = "GET", headers, anonymous } = {}) =>
    new Promise((onload, onerror) => {
      GM_xmlhttpRequest({ url, method, headers, anonymous, onload, onerror });
    });

  // 插入函数
  const insertItem = (fileName, filePath) => {

    if(filePath.indexOf(".mp4") > -1 || filePath.indexOf(".mkv") > -1){
      oFilesList.innerHTML += `<li><a href="${filePath}" target="_blank">${fileName}</a>`;
      oFilesList.innerHTML += `<li><button class="btn" data-clipboard-text="${filePath}">复制</button>
      <a href="potplayer://${filePath}" target="_blank" style="margin-left:10px;"><button>potplayer</button></a>
      <a href="vlc://${filePath}" target="_blank" style="margin-left:10px;"><button>vlc</button></a>
      <a href="nplayer-${filePath}" target="_blank" style="margin-left:10px;"><button>nplayer</button></a>
      </li>`;

    }

  };

  // 在goindex中查找影片，添加至页面
  const getFiles = async (keyword) => {
    if (!keyword) return;
    console.log(`在goindex中搜索${keyword}...`);
    // 配置formData;
    //let formData = new FormData();
    //formData.append("q", keyword);
    //formData.append("page_token", "");
    //formData.append("page_index", 0);

    for (let order = 0; order < CONFIG.drivesCount; order++) {
      let response = fetch(`${CONFIG.origin}/${order}:search`, {
        method: "POST",
        body: JSON.stringify({ q: keyword }),
      });
      let data = await response
        .then((r) => {
          if (r.status == 200) return r.json();
          console.log(
            `请求goindex失败，网盘索引：${order}，状态码：${r.status}`
          );
        })
        .then((json) => json.data);
      if (!data) {
        console.log(`在网盘${order}中搜索${keyword}没有符合的结果！`);
        return;
      }
      for (let file of data.files) {
        let path = await getPathById(file.id, order);
        let filePath = `${CONFIG.origin}/${order}:${path}`;
        // filePath += file.mimeType === CONFIG.folderMimeType ? "" : "?a=view";
        insertItem(file.name, filePath);
      }
    }
  };

  // 通过文件id获取文件路径
  const getPathById = async (id, order) => {
    // 配置formData;
    // let formData = new FormData();
    // formData.append("id", id);

    let response = fetch(`${CONFIG.origin}/${order}:id2path`, {
      method: "POST",
      body: JSON.stringify({ id: id }),
    });
    return await response.then((r) => r.text());
  };

  // 从r18获取影片cid
  const getCid = async (avid) => {
    if (!avid) return;
    console.log(`发起请求：${CONFIG.r18}${avid}`);
    try {
      const r = await gmFetch(`${CONFIG.r18}${avid}`).then(
        (r) => r.responseText
      );
      const aLinksList = parseHTML(r).querySelectorAll("li.item-list");
      // 从获取的多个影片中获取匹配avid的影片,如果没有结果直接返回
      if (aLinksList.length == 0) {
        console.log(`r18没有找到与${avid}相关的影片`);
        return;
      }
      for (let oLink of aLinksList) {
        if (
          MOVIE.avid == oLink.getElementsByTagName("img")[0].getAttribute("alt")
        ) {
          MOVIE.cid = oLink.getAttribute("data-content_id");
          break;
        }
      }
      if (!MOVIE.cid) {
        console.log(`r18返回的影片中，没有和${avid}一致的番号`);
      }
    } catch (_) {
      console.log("从r18获取cid时出错：", _);
    }
    console.log(`作品cid：${MOVIE.cid}`);
    return MOVIE.cid;
  };

  // 从dmm获取pid
  const getPid = async (cid) => {
    if (!cid) return;
    console.log(`发起请求：${CONFIG.dmm}${cid}`);
    try {
      const r = await gmFetch(`${CONFIG.dmm}${cid}`, {
        headers: { cookie: "age_check_done=1;" },
      }).then((r) => r.responseText);
      if (r.includes("このページはお住まいの地域からご利用になれません")) {
        console.log("访问dmm需要日本ip或者将浏览器语言设置为日语");
        return;
      }
      let aTds = parseHTML(r).querySelectorAll("table.mg-b20 td.nw");
      for (let td of aTds) {
        if (td.textContent.includes("品番")) {
          MOVIE.pid = td.nextElementSibling.textContent;
        }
      }
    } catch (_) {
      console.log("从DMM获取pid时出错：", _);
    }
    console.log(`作品pid: ${MOVIE.pid}`);
    if (MOVIE.pid != MOVIE.cid) return MOVIE.pid;
  };

  // 解析获取的html页面
  const parseHTML = (str) => {
    const tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = str;
    return tmp;
  };
  // 异步执行函数提升运行效率
  const asyncTask = async (...tasks) => {
    for (let task of tasks) {
      await task;
    }
  };
  // 程序入口
  (async () => {
    var script=document.createElement("script");
    script.type="text/javascript";
    script.src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    const oDiv = document.createElement("div");
    const oMovieCid = document.createElement("div");
    const oMoviePid = document.createElement("div");
    // 在不同域添加获取的文件列表
    if (location.host.includes("javdb")) {
      const footer = document.querySelector("nav#footer");
      if(footer){
        footer.style.display = "none";
      }
      const magnet_link = document.querySelector("article#magnet-links.message.video-panel");
      if(magnet_link){
        magnet_link.parentElement.parentElement.parentElement.style.display = "none";
      }
      const banner = document.querySelector("nav.app-desktop-banner");
      if(banner){
        banner.style.display = "none";
      }
      const sub_header = document.querySelector("nav.sub-header");
      if(sub_header){
        sub_header.style.display = "none";
      }
      const oMoviePanel = document.querySelector(
        'div[class="video-meta-panel"]'
      );
      if (!oMoviePanel) return;
      oMoviePanel.parentElement.insertBefore(oDiv, oMoviePanel.nextSibling);
      const oMovieId = document.querySelector(
        'div[class="panel-block first-block"]'
       );
      oMovieId.parentElement.insertBefore(oMoviePid, oMovieId.nextSibling);
      oMovieId.parentElement.insertBefore(oMovieCid, oMoviePid);
    } else if (location.host.includes("javlibrary.com")) {
      const oMovieFavEdit = document.querySelector("#video_favorite_edit");
      if (!oMovieFavEdit) return;
      oMovieFavEdit.parentElement.insertBefore(oDiv, oMovieFavEdit.nextSibling);
      const oMovieId = document.querySelector("div#video_id");
      oMovieId.parentElement.insertBefore(oMoviePid, oMovieId.nextSibling);
      oMovieId.parentElement.insertBefore(oMovieCid, oMoviePid);
    } else {
      return;
    }
    // 调整列表样式
    oDiv.appendChild(oFilesList);
    oDiv.style.backgroundColor = "white";
    oFilesList.innerHTML = "<li>查找中...</li>";
    oFilesList.style.padding = location.host.includes("javdb") ? "20px" : "";
    MOVIE.avid = document.title.replace(/([0-9A-Za-z]+)(-(\S+))? .*/, "$1$2");
    await asyncTask(getCid(MOVIE.avid), getFiles(MOVIE.avid));
    // 为影片详情添加cid
    if (MOVIE.cid) {
      if (location.host.includes("javdb")) {
        oMovieCid.innerHTML = `<strong>CID: &nbsp</strong><span>${MOVIE.cid}</span>`;
        oMovieCid.setAttribute("class", "panel-block");
      } else {
        oMovieCid.innerHTML = `<table><tr><td class="header">CID:</td><td class="text">${MOVIE.cid}<td></tr></table>`;
      }
    }
    await asyncTask(getFiles(MOVIE.cid), getPid(MOVIE.cid).then(getFiles));
    // 为影片详情添加pid
    if (MOVIE.pid) {
      if (location.host.includes("javdb")) {
        oMoviePid.innerHTML = `<strong>PID: &nbsp</strong><span>${MOVIE.pid}</span>`;
        oMoviePid.setAttribute("class", "panel-block");
      } else {
        oMoviePid.innerHTML = `<table><tr><td class="header">PID:</td><td class="text">${MOVIE.pid}<td></tr></table>`;
      }
    }
    oFilesList.firstElementChild.innerHTML = "";
    new ClipboardJS('.btn');
    console.log("JavList loaded.");
  })();
})();