// ==UserScript==
// @name            PT种子列表无限下拉瀑布流视图
// @name:en         PT_waterfall_torrent
// @namespace       https://github.com/KesaubeEire/PT_TorrentList_Masonry
// @version         0.4.16
// @author          Kesa
// @description     PT种子列表无限下拉瀑布流视图(描述不能与名称相同, 乐)
// @description:en  PT torrent page waterfall view.
// @license         MIT
// @icon            https://kamept.com/favicon.ico
// @match           https://kamept.com/*
// @match           https://kp.m-team.cc/*
// @match           https://pterclub.com/*
// @exclude         */offers.php*
// @exclude         */index.php*
// @exclude         */forums.php*
// @exclude         */viewrequests.php*
// @exclude         */seek.php*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/465249/PT%E7%A7%8D%E5%AD%90%E5%88%97%E8%A1%A8%E6%97%A0%E9%99%90%E4%B8%8B%E6%8B%89%E7%80%91%E5%B8%83%E6%B5%81%E8%A7%86%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/465249/PT%E7%A7%8D%E5%AD%90%E5%88%97%E8%A1%A8%E6%97%A0%E9%99%90%E4%B8%8B%E6%8B%89%E7%80%91%E5%B8%83%E6%B5%81%E8%A7%86%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const _COUNT = {
    // 外部呼叫函数次数
    Call: 0,
    // 函数实际执行次数
    Run: 0
  };
  function debounce(func, delay) {
    let timer;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        func.apply(this, arguments);
      }, delay);
    };
  }
  function throttle(func, delay) {
    let timerId;
    let lastExecTime = 0;
    return function(...args) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastExecTime;
      if (!timerId && elapsedTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = currentTime;
          timerId = null;
        }, delay - elapsedTime);
      }
    };
  }
  const throttleSort = throttle(doSortMasonry, 1500);
  function doSortMasonry() {
    _COUNT.Run++;
    console.log(`呼叫整理次数: ${_COUNT.Call}   实际整理次数: ${_COUNT.Run}`);
    masonry.layout();
  }
  function sortMasonry() {
    _COUNT.Call++;
    if (masonry) {
      throttleSort();
    }
  }
  const CONFIG$2 = {
    torrentListTable: "table.torrents",
    TORRENT_LIST_TO_JSON: TORRENT_LIST_TO_JSON$3,
    RENDER_TORRENT_JSON_IN_MASONRY: RENDER_TORRENT_JSON_IN_MASONRY$3,
    /**如果站点有自定义的icon, 可以用自定义的 */
    ICON: {},
    /**如果站点有必要设置自定义的css, 可以用自定义的 */
    CSS: css$2,
    /**如果站点有必要设置分类颜色, 可以用自定义的 */
    CATEGORY: {}
  };
  function css$2(variable) {
    return ` 

`;
  }
  function TORRENT_LIST_TO_JSON$3(torrent_list_Dom, CARD2) {
    const rows = torrent_list_Dom.querySelectorAll("tbody tr");
    const data = [];
    rows.forEach((row) => {
      const categoryImg = row.querySelector("td:nth-child(1) > a > img");
      const category = categoryImg ? categoryImg.alt : "";
      if (!category)
        return;
      const categoryLinkDOM = categoryImg.parentNode;
      const categoryLink = categoryLinkDOM.href;
      const categoryNumber = categoryLink.slice(-3);
      const _categoryImg = categoryImg.cloneNode(true);
      _categoryImg.className = "card-category-img";
      const torrentIndex = CARD2.CARD_INDEX++;
      const torrentNameLink = row.querySelector(".torrentname a");
      const torrentName = torrentNameLink ? torrentNameLink.textContent.trim() : "";
      const torrentLink = torrentNameLink.href;
      const pattern = /id=(\d+)&hit/;
      const match = torrentLink.match(pattern);
      const torrentId = match ? parseInt(match[1]) : null;
      const picLink = row.querySelector(".torrentname img").getAttribute("data-src");
      const desCell = row.querySelector(".torrentname td:nth-child(2)");
      const length = desCell.childNodes.length - 1;
      const desDom = desCell.childNodes[length];
      const description = desDom.nodeName == "#text" ? desDom.textContent.trim() : "";
      const place_at_the_top = row.querySelectorAll(".torrentname img.sticky");
      const pattMsg = place_at_the_top[0] ? place_at_the_top[0].title : "";
      const tempTagDom = row.querySelectorAll(".torrentname font");
      const freeTypeImg = row.querySelector('img[class^="pro_"]');
      const freeType = freeTypeImg ? "_" + freeTypeImg.alt.replace(/\s+/g, "") : "";
      const freeRemainingTimeSpan = freeType ? Array.from(tempTagDom)[tempTagDom.length - 1] : "";
      const freeRemainingTime = freeRemainingTimeSpan ? freeRemainingTimeSpan.innerText : "";
      const tagSpans = row.querySelectorAll(".torrentname span");
      const tagsDOM = Array.from(tagSpans);
      let tags = tagSpans ? tagsDOM.map((span) => span.textContent.trim()) : [];
      if (freeRemainingTime != "") {
        tags.shift();
        tagsDOM.shift();
      }
      const raw_tags = tagsDOM.map((el) => el.outerHTML).join("");
      const downloadLink = `download.php?id=${torrentId}`;
      const collectLink = `javascript: bookmark(${torrentId},${torrentIndex});`;
      const collectDOM = row.querySelector(".torrentname a[id^='bookmark']");
      const collectState = collectDOM.children[0].alt;
      const commentsLink = row.querySelector("td.rowfollow:nth-child(3) a");
      const comments = commentsLink ? parseInt(commentsLink.textContent) : 0;
      const uploadDateSpan = row.querySelector("td:nth-child(4) span");
      const uploadDate = uploadDateSpan ? uploadDateSpan.title : "";
      const sizeCell = row.querySelector("td:nth-child(5)");
      const size = sizeCell ? sizeCell.textContent.trim() : "";
      const seedersLink = row.querySelector("td:nth-child(6) a");
      const seeders = seedersLink ? parseInt(seedersLink.textContent) : 0;
      const leechersCell = row.querySelector("td:nth-child(7)");
      const leechers = leechersCell ? parseInt(leechersCell.textContent) : 0;
      const snatchedLink = row.querySelector("td:nth-child(8) a");
      const snatched = snatchedLink ? parseInt(snatchedLink.textContent) : 0;
      const rowData = {
        torrentIndex,
        _categoryImg,
        category,
        categoryLink,
        categoryNumber,
        torrent_name: torrentName,
        torrentLink,
        torrentId,
        picLink,
        place_at_the_top,
        pattMsg,
        downloadLink,
        collectLink,
        collectState,
        tempTagDom,
        freeTypeImg,
        free_type: freeType,
        free_remaining_time: freeRemainingTime,
        raw_tags,
        tagsDOM,
        tags,
        description,
        upload_date: uploadDate,
        comments,
        size,
        seeders,
        leechers,
        snatched
      };
      data.push(rowData);
    });
    return data;
  }
  function RENDER_TORRENT_JSON_IN_MASONRY$3(waterfallNode, torrent_json, isFirst = true, masonry2, CARD2, ICON2 = CONFIG$2.ICON) {
    const cardTemplate = (data) => {
      const {
        torrentIndex,
        _categoryImg,
        category,
        categoryLink,
        categoryNumber,
        torrent_name: torrentName,
        torrentLink,
        torrentId,
        picLink,
        place_at_the_top,
        pattMsg,
        downloadLink,
        collectLink,
        collectState,
        tempTagDom,
        freeTypeImg,
        free_type: freeType,
        free_remaining_time: freeRemainingTime,
        raw_tags,
        tagsDOM,
        tags,
        description,
        upload_date: uploadDate,
        comments,
        size,
        seeders,
        leechers,
        snatched
      } = data;
      return `
<div class="card-holder">
  <!-- 分区类别 -->
  <div
    class="card-category"
    href="${categoryLink}"
    <!-- TODO: 颜色这里和龟龟商量怎么搞分类的颜色捏 -->    
    <!-- style="background: ${CONFIG$2.CATEGORY[categoryNumber]};" -->
    >
    <!-- TODO: 图片这里先注释了, 和龟龟商量捏 -->    
    <!-- ${_categoryImg.outerHTML} -->
    ${category}    
  </div>

  <!-- 标题 & 跳转详情链接 -->    
  <div class="card-title">
    <a class="two-lines" src="${torrentLink}" href="${torrentLink}" target="_blank">
      ${tempTagDom ? Array.from(tempTagDom).map((e) => e.outerHTML).join("&nbsp;") : ""}
      <b>${torrentName}</b>
    </a>
  </div>

  <!-- 卡片其他信息 -->    
  <div class="card-body">
    <div class="card-image" onclick="window.open('${torrentLink}')">
      <!-- <img class="card-image--img nexus-lazy-load_Kesa" src="pic/misc/spinner.svg" data-src="${picLink}"  alt="${torrentName}" /> -->
      <!-- NOTE: 加载图片这里换成了logo, 和 MT 一样了捏 -->    
      <img class="card-image--img nexus-lazy-load_Kesa" src="pic/logo2_100.png" data-src="${picLink}"  alt="${torrentName}" />
      <div class="card-index">
        ${torrentIndex + 1}
      </div>  
    </div>

    <!-- 置顶 && 免费类型&剩余时间 -->      
    ${freeType || pattMsg ? `
      <div class="card-alter">          
        <div class="top_and_free ${freeType}">
          <!-- 置顶等级 -->
          ${place_at_the_top.length != 0 ? Array.from(place_at_the_top).map((e) => e.outerHTML) + "&nbsp;" : ""}

          <!-- 免费类型 & 免费剩余时间 -->
          ${freeTypeImg ? freeTypeImg.outerHTML : ""}  <b>${freeRemainingTime ? freeRemainingTime : ""}</b>
        </div>
      </div>
          ` : ``}

    <!-- 置顶等级 -->
    <!--${pattMsg ? `<div><b>置顶等级:</b> ${pattMsg}</div>` : ""}-->

    <!-- 副标题 -->
    ${description ? `<a class="card-description" href='${torrentLink}'> ${description}</a>` : ""}
    

    <!-- 标签 Tags -->
    <div class="cl-tags">
      ${tagsDOM.map((el) => {
      const _tag = document.createElement("div");
      _tag.innerHTML = el.outerHTML;
      return _tag.outerHTML;
    }).join("")}
      <!-- <b>Tags:</b> ${tags.join(", ")} -->
    </div>


    <div class="card-details">  
      <div class="card-line">
        <!-- 大小 -->
        <div class="cl-center">
          ${ICON2.SIZE}&nbsp;${size}
        </div> 

        <!-- 下载 -->
        &nbsp;&nbsp;
        <div class="cl-center">
          ${ICON2.DOWNLOAD}&nbsp;
          <b><a src="${downloadLink}" href="${downloadLink}">下载</a></b>
        </div>

        <!-- 收藏 -->
        &nbsp;&nbsp;
        <div class="cl-center">
          <div class="btnCollet cl-center" id="tI_${torrentIndex}" onclick='COLLET_AND_ICON_CHANGE("${collectLink}", "tI_${torrentIndex}")'>
            ${collectState == "Unbookmarked" ? ICON2.COLLET : ICON2.COLLETED}
            &nbsp;<b>收藏</b>
          </div>
        </div>
      </div>
      
      <!-- 种子id, 默认不显示 -->
      <!--<div class="card-line"><b>Torrent ID:</b> ${torrentId}</div> -->
      
      <!-- 上传时间 -->
      <div class="card-line"><b>上传时间:</b> ${uploadDate}</div>
      
      <div class="card-line">
        ${ICON2.COMMENT}&nbsp;<b>${comments}</b>&nbsp;&nbsp;
        ${ICON2.SEEDERS}&nbsp;<b>${seeders}</b>&nbsp;&nbsp;
        ${ICON2.LEECHERS}&nbsp;<b>${leechers}</b>&nbsp;&nbsp;
        ${ICON2.SNATCHED}&nbsp;<b>${snatched}</b>
      </div>    
    </div>
  </div>
</div>`;
    };
    for (const rowData of torrent_json) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = cardTemplate(rowData);
      card.style.width = `${CARD2.CARD_WIDTH}px`;
      card.style.zIndex = 1e4 - rowData.torrentIndex;
      const card_img = card.querySelector(".card-image--img");
      card_img.onload = function() {
        sortMasonry();
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "attributes" && mutation.attributeName === "src") {
              sortMasonry();
            }
          });
        });
        const config = {
          attributes: true,
          // 监听属性变化
          attributeFilter: ["src"]
          // 只监听 src 属性的变化
        };
        observer.observe(card_img, config);
      };
      card_img.addEventListener("load", () => {
        sortMasonry();
      });
      waterfallNode.appendChild(card);
      if (!isFirst) {
        masonry2.appended(card);
      }
    }
  }
  const CONFIG$1 = {
    torrentListTable: "table.torrents",
    TORRENT_LIST_TO_JSON: TORRENT_LIST_TO_JSON$2,
    RENDER_TORRENT_JSON_IN_MASONRY: RENDER_TORRENT_JSON_IN_MASONRY$2,
    /**如果站点有自定义的icon, 可以用自定义的 */
    ICON: {},
    /**如果站点有必要设置自定义的css, 可以用自定义的 */
    CSS: css$1,
    /**如果站点有必要设置分类颜色, 可以用自定义的 */
    CATEGORY: {
      // 成人分类
      410: "#f52bcb",
      // 有码 HD
      429: "#f52bcb",
      // 无码 HD
      424: "#db55a9",
      // 有码 Xvid
      430: "#db55a9",
      // 无码 Xvid
      437: "#f77afa",
      // 有码 DVD
      426: "#f77afa",
      // 无码 DVD
      431: "#19a7ec",
      // 有码 BluRay
      432: "#19a7ec",
      // 无码 BluRay
      440: "#f52bcb",
      // GAY
      436: "#bb1e9a",
      // 0 day
      425: "#bb1e9a",
      // 写真 video
      433: "#bb1e9a",
      // 写真 pic
      411: "#f49800",
      // H-Game
      412: "#f49800",
      // H-Anime
      413: "#f49800",
      // H-Comic
      // 综合分类
      401: "#c74854",
      // Movie SD
      419: "#c01a20",
      // Movie HD
      420: "#c74854",
      // Movie DVD    
      421: "#00a0e9",
      // Movie BluRay
      439: "#1b2a51",
      // Movie Remux
      403: "#c74854",
      // TV SD
      402: "#276fb8",
      // TV HD
      435: "#4dbebd ",
      // TV DVD
      438: "#1897d6",
      // TV BluRay
      404: "#23ac38",
      // 纪录教育
      405: "#996c34",
      // Anime
      407: "#23ac38",
      // Sport
      422: "#f39800",
      // Software
      423: "#f39800",
      // Game
      427: "#f39800",
      // EBook
      409: "#996c34",
      // Other
      // 音乐分类
      406: "#8a57a1",
      // MV
      408: "#8a57a1",
      // Music AAC/ALAC
      434: "#8a57a1"
      // Music 无损
    }
  };
  function css$1(variable) {
    return `  
/* 卡片种类tag */
.card-category{
  height: 24px;
  padding: 0 6px;
  border: 1px;
  background: black;
  color: white;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  display: flex;
  align-items: center;
}

/* 卡片种类tag预览图 */
.card-category-img
{
  height: 18px;

  background-size: 100% 141%;
  background-position: center top;
  padding-left: 5%;
}
`;
  }
  function TORRENT_LIST_TO_JSON$2(torrent_list_Dom, CARD2) {
    const rows = torrent_list_Dom.querySelectorAll("tbody tr");
    const data = [];
    rows.forEach((row) => {
      const categoryImg = row.querySelector("td:nth-child(1) > a > img");
      const category = categoryImg ? categoryImg.title : "";
      if (!category)
        return;
      const categoryLinkDOM = categoryImg.parentNode;
      const categoryLink = categoryLinkDOM.href;
      const categoryNumber = categoryLink.slice(-3);
      const _categoryImg = categoryImg.cloneNode(true);
      _categoryImg.className = "card-category-img";
      const torrentIndex = CARD2.CARD_INDEX++;
      const torrentNameLink = row.querySelector(".torrentname a");
      const torrentName = torrentNameLink ? torrentNameLink.title.trim() : "";
      const torrentLink = torrentNameLink.href;
      const pattern = /id=(\d+)&hit/;
      const match = torrentLink.match(pattern);
      const torrentId = match ? parseInt(match[1]) : null;
      const imgDom = row.querySelector(".torrentname img");
      const _mouseOver = imgDom.getAttribute("onmouseover");
      const raw1 = _mouseOver ? _mouseOver.split(",")[2].toString() : "";
      const picLink = raw1 ? raw1.slice(raw1.indexOf("'") + 1, raw1.lastIndexOf("'")) : "/pic/nopic.jpg";
      const desCell = row.querySelector(".torrentname td:nth-child(2)");
      const length = desCell.childNodes.length - 1;
      const desDom = desCell.childNodes[length];
      const description = desDom.nodeName == "#text" ? desDom.textContent.trim() : "";
      const place_at_the_top = row.querySelectorAll(".torrentname img.sticky");
      const pattMsg = place_at_the_top[0] ? place_at_the_top[0].title : "";
      const tempTagDom = row.querySelectorAll(".torrentname font");
      const freeTypeImg = row.querySelector('img[class^="pro_"]');
      const freeType = freeTypeImg ? "_" + freeTypeImg.alt.replace(/\s+/g, "") : "";
      const freeRemainingTimeSpan = row.querySelector(".torrentname td:nth-child(2) span");
      const freeRemainingTime = freeRemainingTimeSpan ? freeRemainingTimeSpan.innerText : "";
      const tagSpans = row.querySelectorAll(".torrentname img[class^='label_']");
      const tagsDOM = Array.from(tagSpans);
      let tags = tagSpans ? tagsDOM.map((el) => el.title.trim()) : [];
      const raw_tags = tagsDOM.map((el) => el.outerHTML).join("&nbsp;");
      const downloadLink = `download.php?id=${torrentId}`;
      const collectLink = `javascript: bookmark(${torrentId},${torrentIndex});`;
      const collectDOM = row.querySelector(".torrentname a[id^='bookmark']");
      const collectState = collectDOM.children[0].alt;
      const commentsLink = row.querySelector("td.rowfollow:nth-child(3) a");
      const comments = commentsLink ? parseInt(commentsLink.textContent) : 0;
      const uploadDateSpan = row.querySelector("td:nth-child(4) span");
      const uploadDate = uploadDateSpan ? uploadDateSpan.title : "";
      const sizeCell = row.querySelector("td:nth-child(5)");
      const size = sizeCell ? sizeCell.textContent.trim() : "";
      const seedersLink = row.querySelector("td:nth-child(6) a");
      const seeders = seedersLink ? parseInt(seedersLink.textContent) : 0;
      const leechersCell = row.querySelector("td:nth-child(7)");
      const leechers = leechersCell ? parseInt(leechersCell.textContent) : 0;
      const snatchedLink = row.querySelector("td:nth-child(8) a");
      const snatched = snatchedLink ? parseInt(snatchedLink.textContent) : 0;
      const rowData = {
        torrentIndex,
        _categoryImg,
        category,
        categoryLink,
        categoryNumber,
        torrent_name: torrentName,
        torrentLink,
        torrentId,
        picLink,
        place_at_the_top,
        pattMsg,
        downloadLink,
        collectLink,
        collectState,
        tempTagDom,
        freeTypeImg,
        free_type: freeType,
        free_remaining_time: freeRemainingTime,
        raw_tags,
        tagsDOM,
        tags,
        description,
        comments,
        upload_date: uploadDate,
        size,
        seeders,
        leechers,
        snatched
      };
      data.push(rowData);
    });
    return data;
  }
  function RENDER_TORRENT_JSON_IN_MASONRY$2(waterfallNode, torrent_json, isFirst = true, masonry2, CARD2, ICON2 = CONFIG$1.ICON) {
    const cardTemplate = (data) => {
      const {
        torrentIndex,
        _categoryImg,
        category,
        categoryLink,
        categoryNumber,
        torrent_name: torrentName,
        torrentLink,
        torrentId,
        picLink,
        place_at_the_top,
        pattMsg,
        downloadLink,
        collectLink,
        collectState,
        tempTagDom,
        freeTypeImg,
        free_type: freeType,
        free_remaining_time: freeRemainingTime,
        raw_tags,
        tagsDOM,
        tags,
        description,
        comments,
        upload_date: uploadDate,
        size,
        seeders,
        leechers,
        snatched
      } = data;
      return `

<div class="card-holder">
  <!-- 分区类别 -->
  <div
    class="card-category"
    href="${categoryLink}"
    style="background: ${CONFIG$1.CATEGORY[categoryNumber]};"
    >
    ${_categoryImg.outerHTML}
    ${category}    
  </div>

  <!-- 标题 & 跳转详情链接 -->    
  <div class="card-title">
    <a class="two-lines" src="${torrentLink}" href="${torrentLink}" target="_blank">
      ${tempTagDom ? Array.from(tempTagDom).map((e) => e.outerHTML).join("&nbsp;") : ""}
      <b>${torrentName}</b>
    </a>
  </div>

  <!-- 卡片其他信息 -->    
  <div class="card-body">
    <div class="card-image" onclick="window.open('${torrentLink}')">
      <img  class="card-image--img nexus-lazy-load_Kesa" src="logo.png" data-src="${picLink}" alt="${torrentName}"/>
      <div class="card-index">
        ${torrentIndex + 1}
      </div>  
    </div>

    <!-- 置顶 && 免费类型&剩余时间 -->      
    ${freeType || pattMsg ? `
      <div class="card-alter">          
        <div class="top_and_free ${freeType}">
          <!-- 置顶等级 -->
          ${place_at_the_top.length != 0 ? Array.from(place_at_the_top).map((e) => e.outerHTML) + "&nbsp;" : ""}

          <!-- 免费类型 & 免费剩余时间 -->
          ${freeTypeImg ? freeTypeImg.outerHTML : ""}  <b>${freeRemainingTime ? freeRemainingTime : ""}</b>
        </div>
      </div>
          ` : ``}

    <!-- 置顶等级 -->
    <!--${pattMsg ? `<div><b>置顶等级:</b> ${pattMsg}</div>` : ""}-->

    <!-- 副标题 -->
    ${description ? `<div class="card-description"><a href='${torrentLink}'> ${description}</a></div>` : ""}
    

    <!-- 标签 Tags -->
    <div class="cl-tags">
      <!-- ${tempTagDom ? Array.from(tempTagDom).map((e) => e.outerHTML + "&nbsp;") : ""} -->
      ${tagsDOM.map((el) => {
      const _tag = document.createElement("div");
      _tag.innerHTML = el.outerHTML;
      return _tag.outerHTML;
    }).join("")}
      <!-- <b>Tags:</b> ${tags.join("&nbsp;")} -->
    </div>


    <div class="card-details">  
      <div class="card-line">
        <!-- 大小 -->
        <div class="cl-center">
          ${ICON2.SIZE}&nbsp;${size}
        </div> 

        <!-- 下载 -->
        &nbsp;&nbsp;
        <div class="cl-center">
          ${ICON2.DOWNLOAD}&nbsp;
          <b><a src="${downloadLink}" href="${downloadLink}">下载</a></b>
        </div>

        <!-- 收藏 -->
        &nbsp;&nbsp;
        <div class="cl-center">
          <div class="btnCollet cl-center" id="tI_${torrentIndex}" onclick='COLLET_AND_ICON_CHANGE("${collectLink}", "tI_${torrentIndex}")'>
            ${collectState == "Unbookmarked" ? ICON2.COLLET : ICON2.COLLETED}
            &nbsp;<b>收藏</b>
          </div>
        </div>
      </div>
      
      <!-- 种子id, 默认不显示 -->
      <!--<div class="card-line"><b>Torrent ID:</b> ${torrentId}</div> -->
      
      <!-- 上传时间 -->
      <div class="card-line"><b>上传时间:</b> ${uploadDate}</div>
      
      <div class="card-line">
        ${ICON2.COMMENT}&nbsp;<b>${comments}</b>&nbsp;&nbsp;
        ${ICON2.SEEDERS}&nbsp;<b>${seeders}</b>&nbsp;&nbsp;
        ${ICON2.LEECHERS}&nbsp;<b>${leechers}</b>&nbsp;&nbsp;
        ${ICON2.SNATCHED}&nbsp;<b>${snatched}</b>
      </div>    
    </div>
  </div>
</div>`;
    };
    for (const rowData of torrent_json) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = cardTemplate(rowData);
      card.style.width = `${CARD2.CARD_WIDTH}px`;
      card.style.zIndex = 1e4 - rowData.torrentIndex;
      const card_img = card.querySelector(".card-image--img");
      card_img.onload = function() {
        sortMasonry();
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "attributes" && mutation.attributeName === "src") {
              sortMasonry();
            }
          });
        });
        const config = {
          attributes: true,
          // 监听属性变化
          attributeFilter: ["src"]
          // 只监听 src 属性的变化
        };
        observer.observe(card_img, config);
      };
      card_img.addEventListener("load", () => {
        sortMasonry();
      });
      waterfallNode.appendChild(card);
      if (!isFirst) {
        masonry2.appended(card);
      }
    }
  }
  const CONFIG = {
    torrentListTable: "table.torrents",
    TORRENT_LIST_TO_JSON: TORRENT_LIST_TO_JSON$1,
    RENDER_TORRENT_JSON_IN_MASONRY: RENDER_TORRENT_JSON_IN_MASONRY$1,
    /**如果站点有必要设置分类颜色, 可以用自定义的 */
    LOADING_IMG: "/pic/PTer.Club_Logo_2023.png",
    /**如果站点有自定义的icon, 可以用自定义的 */
    ICON: {},
    /**如果站点有必要设置自定义的css, 可以用自定义的 */
    CSS: css,
    /**如果站点有必要设置分类颜色, 可以用自定义的 */
    CATEGORY: {
      // 分类
      401: "#ca464b",
      // Movie
      404: "#ed8f3b",
      // TV Series
      403: "#729dbf",
      // Anime
      405: "#d97163",
      // TV Show
      413: "#a1dae7",
      // MV
      406: "#2a4f85",
      // Music
      418: "#61281d",
      // Real Show      
      402: "#bb3e6e",
      // 纪录教育
      407: "#275b5c",
      // Sport
      408: "#f6eda2",
      // EBook
      409: "#7a5a5e",
      // Game
      410: "#e5b2af",
      // Software
      411: "#c1aa92",
      // Learn
      412: "#c5c6c8"
      // Other
    }
  };
  function css(variable) {
    return ` 
  /* 卡片种类tag */
  .card-category{
    height: 24px;
    padding: 0 6px;
    border: 1px;
    background: black;
    color: white;
    font-weight: 600;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  
    display: flex;
    align-items: center;
  }
  
  /* 卡片种类tag预览图 */
  .card-category-img
  {
    height: 18px;
  
    background-size: 100% 141%;
    background-position: center top;
    padding-left: 5%;
  }
`;
  }
  function TORRENT_LIST_TO_JSON$1(torrent_list_Dom, CARD2) {
    const rows = torrent_list_Dom.querySelectorAll("tbody tr");
    const data = [];
    rows.forEach((row) => {
      const categoryImg = row.querySelector("td:nth-child(1) > a > img");
      const category = categoryImg ? categoryImg.alt : "";
      if (!category)
        return;
      const DOM_LIST = row.querySelectorAll("td.rowfollow");
      const categoryLinkDOM = categoryImg.parentNode;
      const categoryLink = categoryLinkDOM.href;
      const categoryNumber = categoryLink.slice(-3);
      const _categoryImg = categoryImg.cloneNode(true);
      _categoryImg.className = "card-category-img";
      const torrentIndex = CARD2.CARD_INDEX++;
      const torrentNameLink = row.querySelector(".torrentname a");
      const torrentName = torrentNameLink ? torrentNameLink.textContent.trim() : "";
      const torrentLink = torrentNameLink.href;
      const pattern = /id=(\d+)/;
      const match = torrentLink.match(pattern);
      const torrentId = match ? parseInt(match[1]) : null;
      const picLink = DOM_LIST[1].querySelector(".torrentname img").getAttribute("data-orig");
      const desCell = DOM_LIST[1].querySelector(".torrentname td:nth-child(2) > div > div:nth-child(2)");
      const length = desCell ? desCell.childNodes.length - 1 : null;
      const desDom = desCell ? desCell.childNodes[length] : null;
      const description = desCell ? desDom.nodeName == "SPAN" ? desDom.textContent.trim() : "" : null;
      const place_at_the_top = DOM_LIST[1].querySelectorAll(".torrentname img.sticky");
      const pattMsg = place_at_the_top[0] ? place_at_the_top[0].title : "";
      const tempTagDom = DOM_LIST[1].querySelectorAll(".torrentname td:nth-child(2) font");
      const freeTypeImg = DOM_LIST[1].querySelector('img[class^="pro_"]');
      const freeType = freeTypeImg ? "_" + freeTypeImg.alt.replace(/\s+/g, "") : "";
      const freeRemainingTimeSpan = freeType ? DOM_LIST[1].querySelector(".torrentname td:nth-child(2) > div > div:nth-child(1) span") : "";
      const freeRemainingTime = freeRemainingTimeSpan ? freeRemainingTimeSpan.innerText : "";
      const tagSpans = DOM_LIST[1].querySelectorAll(".torrentname td:nth-child(2) > div > div:nth-child(2) a");
      const tagsDOM = Array.from(tagSpans);
      let tags = tagSpans ? tagsDOM.map((span) => span.textContent.trim()) : [];
      if (freeRemainingTime != "") {
        tags.shift();
        tagsDOM.shift();
      }
      const raw_tags = tagsDOM.map((el) => el.outerHTML).join("");
      const downloadLink = row.querySelector("td:nth-child(5) a").href;
      const collectLink = `javascript: bookmark(${torrentId},${torrentIndex});`;
      const collectDOM = row.querySelector(".torrentname a[id^='bookmark']");
      const collectState = collectDOM.children[0].alt;
      const commentsLink = DOM_LIST[2];
      const comments = commentsLink ? parseInt(commentsLink.textContent) : 0;
      const uploadDateSpan = DOM_LIST[3].childNodes[0];
      const uploadDate = uploadDateSpan ? uploadDateSpan.title : "";
      const sizeCell = DOM_LIST[4];
      const size = sizeCell ? sizeCell.textContent.trim() : "";
      const seedersLink = DOM_LIST[5];
      const seeders = seedersLink ? parseInt(seedersLink.textContent) : 0;
      const leechersCell = DOM_LIST[6];
      const leechers = leechersCell ? parseInt(leechersCell.textContent) : 0;
      const snatchedLink = DOM_LIST[7];
      const snatched = snatchedLink ? parseInt(snatchedLink.textContent) : 0;
      const rowData = {
        torrentIndex,
        _categoryImg,
        category,
        categoryLink,
        categoryNumber,
        torrent_name: torrentName,
        torrentLink,
        torrentId,
        picLink,
        place_at_the_top,
        pattMsg,
        downloadLink,
        collectLink,
        collectState,
        tempTagDom,
        freeTypeImg,
        free_type: freeType,
        free_remaining_time: freeRemainingTime,
        raw_tags,
        tagsDOM,
        tags,
        description,
        upload_date: uploadDate,
        comments,
        size,
        seeders,
        leechers,
        snatched
      };
      data.push(rowData);
    });
    return data;
  }
  function RENDER_TORRENT_JSON_IN_MASONRY$1(waterfallNode, torrent_json, isFirst = true, masonry2, CARD2, ICON2 = CONFIG.ICON) {
    const cardTemplate = (data) => {
      const {
        torrentIndex,
        _categoryImg,
        category,
        categoryLink,
        categoryNumber,
        torrent_name: torrentName,
        torrentLink,
        torrentId,
        picLink,
        place_at_the_top,
        pattMsg,
        downloadLink,
        collectLink,
        collectState,
        tempTagDom,
        freeTypeImg,
        free_type: freeType,
        free_remaining_time: freeRemainingTime,
        raw_tags,
        tagsDOM,
        tags,
        description,
        upload_date: uploadDate,
        comments,
        size,
        seeders,
        leechers,
        snatched
      } = data;
      return `
<div class="card-holder">
  <!-- 分区类别 -->
  <div
    class="card-category"
    href="${categoryLink}"
    style="background: ${CONFIG.CATEGORY[categoryNumber]};"
    >
    <!--${_categoryImg.outerHTML}-->
    ${category}    
  </div>

  <!-- 标题 & 跳转详情链接 -->    
  <div class="card-title">
    <a class="two-lines" src="${torrentLink}" href="${torrentLink}" target="_blank">
      ${tempTagDom ? Array.from(tempTagDom).map((e) => e.outerHTML).join("&nbsp;") : ""}
      <b>${torrentName}</b>
    </a>
  </div>

  <!-- 卡片其他信息 -->    
  <div class="card-body">
    <div class="card-image" onclick="window.open('${torrentLink}')">
      <!-- <img class="card-image--img nexus-lazy-load_Kesa" src="pic/misc/spinner.svg" data-src="${picLink}"  alt="${torrentName}" /> -->
      <!-- NOTE: 加载图片这里换成了logo, 和 MT 一样了捏 -->    
      <img class="card-image--img nexus-lazy-load_Kesa" src="${CONFIG.LOADING_IMG}" data-src="${picLink}"  alt="${torrentName}" />
      <div class="card-index">
        ${torrentIndex + 1}
      </div>  
    </div>

    <!-- 置顶 && 免费类型&剩余时间 -->      
    ${freeType || pattMsg ? `
      <div class="card-alter">          
        <div class="top_and_free ${freeType}">
          <!-- 置顶等级 -->
          ${place_at_the_top.length != 0 ? Array.from(place_at_the_top).map((e) => e.outerHTML) + "&nbsp;" : ""}

          <!-- 免费类型 & 免费剩余时间 -->
          ${freeTypeImg ? freeTypeImg.outerHTML : ""}  <b>${freeRemainingTime ? "&nbsp;" + freeRemainingTime : ""}</b>
        </div>
      </div>
          ` : ``}

    <!-- 置顶等级 -->
    <!--${pattMsg ? `<div><b>置顶等级:</b> ${pattMsg}</div>` : ""}-->

    <!-- 副标题 -->
    ${description ? `<a class="card-description" href='${torrentLink}'> ${description}</a>` : ""}
    

    <!-- 标签 Tags -->
    <div class="cl-tags">
      ${tagsDOM.map((el) => {
      const _tag = document.createElement("div");
      _tag.innerHTML = el.outerHTML;
      return _tag.outerHTML;
    }).join("")}
      <!-- <b>Tags:</b> ${tags.join(", ")} -->
    </div>


    <div class="card-details">  
      <div class="card-line">
        <!-- 大小 -->
        <div class="cl-center">
          ${ICON2.SIZE}&nbsp;${size}
        </div> 

        <!-- 下载 -->
        &nbsp;&nbsp;
        <div class="cl-center">
          ${ICON2.DOWNLOAD}&nbsp;
          <b><a src="${downloadLink}" href="${downloadLink}">下载</a></b>
        </div>

        <!-- 收藏 -->
        &nbsp;&nbsp;
        <div class="cl-center">
          <div class="btnCollet cl-center" id="tI_${torrentIndex}" onclick='COLLET_AND_ICON_CHANGE("${collectLink}", "tI_${torrentIndex}")'>
            ${collectState == "Unbookmarked" ? ICON2.COLLET : ICON2.COLLETED}
            &nbsp;<b>收藏</b>
          </div>
        </div>
      </div>
      
      <!-- 种子id, 默认不显示 -->
      <!--<div class="card-line"><b>Torrent ID:</b> ${torrentId}</div> -->
      
      <!-- 上传时间 -->
      <div class="card-line"><b>上传时间:</b> ${uploadDate}</div>
      
      <div class="card-line">
        ${ICON2.COMMENT}&nbsp;<b>${comments}</b>&nbsp;&nbsp;
        ${ICON2.SEEDERS}&nbsp;<b>${seeders}</b>&nbsp;&nbsp;
        ${ICON2.LEECHERS}&nbsp;<b>${leechers}</b>&nbsp;&nbsp;
        ${ICON2.SNATCHED}&nbsp;<b>${snatched}</b>
      </div>    
    </div>
  </div>
</div>`;
    };
    for (const rowData of torrent_json) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = cardTemplate(rowData);
      card.style.width = `${CARD2.CARD_WIDTH}px`;
      card.style.zIndex = 1e4 - rowData.torrentIndex;
      const card_img = card.querySelector(".card-image--img");
      card_img.onload = function() {
        sortMasonry();
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "attributes" && mutation.attributeName === "src") {
              sortMasonry();
            }
          });
        });
        const config = {
          attributes: true,
          // 监听属性变化
          attributeFilter: ["src"]
          // 只监听 src 属性的变化
        };
        observer.observe(card_img, config);
      };
      card_img.addEventListener("load", () => {
        sortMasonry();
      });
      waterfallNode.appendChild(card);
      if (!isFirst) {
        masonry2.appended(card);
      }
    }
  }
  const SITE = {
    "kp.m-team.cc": CONFIG$1,
    "kamept.com": CONFIG$2,
    "pterclub.com": CONFIG
  };
  function GET_CURRENT_PT_DOMAIN() {
    const domainName = window.location.hostname;
    console.log("当前站点: ", domainName);
    return domainName;
  }
  const SITE_DOMAIN = GET_CURRENT_PT_DOMAIN();
  const CARD = {
    /** 瀑布流卡片宽度 */
    CARD_WIDTH: 200,
    /** 瀑布流卡片边框宽度 -> 这个2是真值, 但是边框好像是会随着分辨率和缩放变化, 给高有利大分辨率, 给低有利于小分辨率 */
    CARD_BORDER: 3,
    /** 瀑布流卡片索引 */
    CARD_INDEX: 0
  };
  const PAGE = {
    /** 翻页: 底部检测时间间隔 */
    GAP: 900,
    /** 翻页: 底部检测视点与底部距离 */
    DISTANCE: 300,
    /** 翻页: 是否为初始跳转页面 */
    IS_ORIGIN: true,
    /** 翻页: 当前页数 */
    PAGE_CURRENT: 0,
    /** 翻页: 下一页数 */
    PAGE_NEXT: 0,
    /** 翻页: 下一页的链接 */
    NEXT_URL: "",
    /** 翻页: 下一页的加载方式: Button | Slip */
    SWITCH_MODE: "Button"
  };
  const ICON = {
    /** 大小图标 */
    SIZE: '<img class="size" src="pic/trans.gif" style=" transform: translateY(-0.4px);" alt="size" title="大小">',
    /** 评论图标 */
    COMMENT: '<img class="comments" src="pic/trans.gif" alt="comments" title="评论数">',
    /** 上传人数图标 */
    SEEDERS: '<img class="seeders" src="pic/trans.gif" alt="seeders" title="种子数">',
    /** 下载人数图标 */
    LEECHERS: '<img class="leechers" src="pic/trans.gif" alt="leechers" title="下载数">',
    /** 已完成人数图标 */
    SNATCHED: '<img class="snatched" src="pic/trans.gif" alt="snatched" title="完成数">',
    /** 下载图标 */
    DOWNLOAD: '<img class="download" src="pic/trans.gif" style=" transform: translateY(1px);" alt="download" title="下载本种">',
    /** 未收藏图标 */
    COLLET: '<img class="delbookmark" src="pic/trans.gif" alt="Unbookmarked" title="收藏">',
    /** 已收藏图标 */
    COLLETED: '<img class="bookmark" src="pic/trans.gif" alt="Bookmarked">'
  };
  function GET_TORRENT_LIST_DOM_FROM_DOMAIN() {
    const selector = SITE[SITE_DOMAIN].torrentListTable;
    return document.querySelector(selector);
  }
  function TORRENT_LIST_TO_JSON(torrent_list_Dom) {
    return SITE[SITE_DOMAIN].TORRENT_LIST_TO_JSON(torrent_list_Dom, CARD);
  }
  function RENDER_TORRENT_JSON_IN_MASONRY(waterfallNode, torrent_json, isFirst = true, masonry2) {
    return SITE[SITE_DOMAIN].RENDER_TORRENT_JSON_IN_MASONRY(
      waterfallNode,
      torrent_json,
      isFirst,
      masonry2,
      CARD,
      ICON
    );
  }
  function PUT_TORRENT_INTO_MASONRY(torrent_list_Dom, waterfallNode, isFirst = true, masonry2) {
    const data = TORRENT_LIST_TO_JSON(torrent_list_Dom);
    console.log(`渲染行数: ${data.length}`);
    RENDER_TORRENT_JSON_IN_MASONRY(waterfallNode, data, isFirst, masonry2);
    NEXUS_TOOLS();
  }
  function GET_CARD_GUTTER(containerDom, card_width) {
    const _width = containerDom.clientWidth;
    const card_real_width = card_width + CARD.CARD_BORDER;
    const columns = Math.floor(_width / card_real_width);
    const gutter = (_width - columns * card_real_width) / (columns - 1);
    return Math.floor(gutter);
  }
  function CHANGE_CARD_WIDTH(targetWidth, containerDom, masonry2) {
    for (const card of containerDom.childNodes) {
      card.style.width = `${targetWidth}px`;
    }
    masonry2.options.gutter = GET_CARD_GUTTER(containerDom, targetWidth);
    sortMasonry();
  }
  function COLLET_AND_ICON_CHANGE(jsCodeLink, card_id) {
    try {
      window.location.href = jsCodeLink;
      const btn = document.querySelector(`div#${card_id}`);
      const img = btn.children[0];
      img.className = img.className == "delbookmark" ? "bookmark" : "delbookmark";
      console.log(`执行脚本${jsCodeLink}成功, 已经收藏或者取消~`);
    } catch (error) {
      console.error(error);
    }
  }
  window.COLLET_AND_ICON_CHANGE = COLLET_AND_ICON_CHANGE;
  function ADD_SITE_EXCLUSIVE_CSS() {
    if (SITE[SITE_DOMAIN].CSS)
      return SITE[SITE_DOMAIN].CSS();
    else
      console.log("本站点无自定义CSS~");
  }
  function NEXUS_TOOLS() {
    jQuery(document).ready(function() {
      function getImgPosition(event, imgEle2) {
        let imgWidth = imgEle2.prop("naturalWidth");
        let imgHeight = imgEle2.prop("naturalHeight");
        let ratio = imgWidth / imgHeight;
        let offsetX = 0;
        let offsetY = 0;
        let width = window.innerWidth - event.clientX;
        let height = window.innerHeight - event.clientY;
        let changeOffsetY = 0;
        let changeOffsetX = false;
        if (event.clientX > window.innerWidth / 2 && event.clientX + imgWidth > window.innerWidth) {
          changeOffsetX = true;
          width = event.clientX;
        }
        if (event.clientY > window.innerHeight / 2) {
          if (event.clientY + imgHeight / 2 > window.innerHeight) {
            changeOffsetY = 1;
            height = event.clientY;
          } else if (event.clientY + imgHeight > window.innerHeight) {
            changeOffsetY = 2;
            height = event.clientY;
          }
        }
        if (imgWidth > width) {
          imgWidth = width;
          imgHeight = imgWidth / ratio;
        }
        if (imgHeight > height) {
          imgHeight = height;
          imgWidth = imgHeight * ratio;
        }
        if (changeOffsetX) {
          offsetX = -imgWidth;
        }
        if (changeOffsetY == 1) {
          offsetY = -(imgHeight - (window.innerHeight - event.clientY));
        } else if (changeOffsetY == 2) {
          offsetY = -imgHeight / 2;
        }
        return { imgWidth, imgHeight, offsetX, offsetY };
      }
      function getMinRatio(pic, container) {
        return Math.min(container.width / pic.width, container.height / pic.height);
      }
      function previewPosition_Kesa(event, imgEle2) {
        let imgWidth = imgEle2.prop("naturalWidth") ?? 0;
        let imgHeight = imgEle2.prop("naturalHeight") ?? 0;
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const distanceToTop = mouseY;
        const distanceToBottom = viewportHeight - mouseY;
        const distanceToLeft = mouseX;
        const distanceToRight = viewportWidth - mouseX;
        const picSize = {
          width: imgWidth,
          height: imgHeight
        };
        const containerSize = {
          bot: {
            width: viewportWidth,
            height: distanceToBottom
          },
          top: {
            width: viewportWidth,
            height: distanceToTop
          },
          right: {
            width: distanceToRight,
            height: viewportHeight
          },
          left: {
            width: distanceToLeft,
            height: viewportHeight
          }
        };
        let maxRatio = 0;
        let maxPosition = "";
        for (const key in containerSize) {
          if (Object.hasOwnProperty.call(containerSize, key)) {
            const element = containerSize[key];
            if (getMinRatio(picSize, element) > maxRatio) {
              maxRatio = getMinRatio(picSize, element);
              maxPosition = key;
            }
          }
        }
        const result = {
          top: {
            left: 0,
            top: 0,
            width: viewportWidth,
            height: distanceToTop
          },
          bot: {
            left: 0,
            top: distanceToTop,
            width: viewportWidth,
            height: distanceToBottom
          },
          left: {
            left: 0,
            top: 0,
            width: distanceToLeft,
            height: viewportHeight
          },
          right: {
            left: distanceToLeft,
            top: 0,
            width: distanceToRight,
            height: viewportHeight
          },
          default: {
            left: 0,
            top: 0,
            width: 0,
            height: 0
          }
        };
        const container = maxPosition != "" ? result[maxPosition] : result["default"];
        return container;
      }
      function getPosition(event, position) {
        return {
          left: event.pageX + position.offsetX,
          top: event.pageY + position.offsetY,
          width: position.imgWidth,
          height: position.imgHeight
        };
      }
      const selector = "img.preview_Kesa";
      let imgEle;
      let imgPosition;
      if (!jQuery("#nexus-preview").length) {
        const _previewDom = document.body.appendChild(document.createElement("img"));
        _previewDom.id = "nexus-preview";
      }
      jQuery("#nexus-preview");
      function createKesaPreview(color) {
        const parent = jQuery("<div>", {
          id: "kp_container",
          css: {
            backgroundColor: color,
            opacity: 1,
            position: "fixed",
            zIndex: 2e4,
            pointerEvents: "none",
            transition: "all .3s"
          }
        });
        parent.append(jQuery("<img>", {
          class: "kp_img",
          css: {
            position: "absolute",
            zIndex: 20002,
            pointerEvents: "none",
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }
        }));
        parent.append(jQuery("<img>", {
          class: "kp_img",
          css: {
            position: "absolute",
            zIndex: 20001,
            pointerEvents: "none",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: `blur(8px)`
          }
        }));
        return parent;
      }
      const kesa_preview = jQuery("#kp_container").length > 0 ? jQuery("#kp_container") : createKesaPreview("");
      jQuery("body").append(kesa_preview);
      jQuery("body").on("mouseover", selector, function(e) {
        imgEle = jQuery(this);
        imgPosition = getImgPosition(e, imgEle);
        getPosition(e, imgPosition);
        let src = imgEle.attr("src");
        if (src) {
          if (kesa_preview)
            kesa_preview.find(".kp_img").attr("src", src);
        }
        kesa_preview.css(previewPosition_Kesa(e, imgEle)).show();
      }).on("mouseout", selector, function(e) {
        kesa_preview.hide();
      }).on("mousemove", selector, function(e) {
        imgPosition = getImgPosition(e, imgEle);
        getPosition(e, imgPosition);
        kesa_preview.css(previewPosition_Kesa(e, imgEle));
      });
      if ("IntersectionObserver" in window) {
        let imgList = [...document.querySelectorAll(".nexus-lazy-load_Kesa")];
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const el = entry.target;
            entry.intersectionRatio;
            el._entry = entry;
            if (entry.isIntersecting && !el.classList.contains("preview_Kesa")) {
              const source = el.dataset.src;
              el.src = source;
              el.classList.add("preview_Kesa");
              sortMasonry();
            }
          });
        });
        imgList.forEach((img) => io.observe(img));
      }
    });
  }
  /*!
   * Masonry PACKAGED v4.2.2
   * Cascading grid layout library
   * https://masonry.desandro.com
   * MIT License
   * by David DeSandro
   */
  (function(window2, factory8) {
    if (typeof define == "function" && define.amd) {
      define("jquery-bridget/jquery-bridget", ["jquery"], function(jQuery2) {
        return factory8(window2, jQuery2);
      });
    } else {
      window2.jQueryBridget = factory8(
        window2,
        window2.jQuery
      );
    }
  })(window, function factory(window2, jQuery2) {
    var arraySlice = Array.prototype.slice;
    var console2 = window2.console;
    var logError = typeof console2 == "undefined" ? function() {
    } : function(message) {
      console2.error(message);
    };
    function jQueryBridget(namespace, PluginClass, $) {
      $ = $ || jQuery2 || window2.jQuery;
      if (!$) {
        return;
      }
      if (!PluginClass.prototype.option) {
        PluginClass.prototype.option = function(opts) {
          if (!$.isPlainObject(opts)) {
            return;
          }
          this.options = $.extend(true, this.options, opts);
        };
      }
      $.fn[namespace] = function(arg0) {
        if (typeof arg0 == "string") {
          var args = arraySlice.call(arguments, 1);
          return methodCall(this, arg0, args);
        }
        plainCall(this, arg0);
        return this;
      };
      function methodCall($elems, methodName, args) {
        var returnValue;
        var pluginMethodStr = "$()." + namespace + '("' + methodName + '")';
        $elems.each(function(i, elem) {
          var instance = $.data(elem, namespace);
          if (!instance) {
            logError(namespace + " not initialized. Cannot call methods, i.e. " + pluginMethodStr);
            return;
          }
          var method = instance[methodName];
          if (!method || methodName.charAt(0) == "_") {
            logError(pluginMethodStr + " is not a valid method");
            return;
          }
          var value = method.apply(instance, args);
          returnValue = returnValue === void 0 ? value : returnValue;
        });
        return returnValue !== void 0 ? returnValue : $elems;
      }
      function plainCall($elems, options) {
        $elems.each(function(i, elem) {
          var instance = $.data(elem, namespace);
          if (instance) {
            instance.option(options);
            instance._init();
          } else {
            instance = new PluginClass(elem, options);
            $.data(elem, namespace, instance);
          }
        });
      }
      updateJQuery($);
    }
    function updateJQuery($) {
      if (!$ || $ && $.bridget) {
        return;
      }
      $.bridget = jQueryBridget;
    }
    updateJQuery(jQuery2 || window2.jQuery);
    return jQueryBridget;
  });
  (function(global, factory8) {
    if (typeof define == "function" && define.amd) {
      define("ev-emitter/ev-emitter", factory8);
    } else {
      global.EvEmitter = factory8();
    }
  })(typeof window != "undefined" ? window : globalThis, function() {
    function EvEmitter() {
    }
    var proto = EvEmitter.prototype;
    proto.on = function(eventName, listener) {
      if (!eventName || !listener) {
        return;
      }
      var events = this._events = this._events || {};
      var listeners = events[eventName] = events[eventName] || [];
      if (listeners.indexOf(listener) == -1) {
        listeners.push(listener);
      }
      return this;
    };
    proto.once = function(eventName, listener) {
      if (!eventName || !listener) {
        return;
      }
      this.on(eventName, listener);
      var onceEvents = this._onceEvents = this._onceEvents || {};
      var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
      onceListeners[listener] = true;
      return this;
    };
    proto.off = function(eventName, listener) {
      var listeners = this._events && this._events[eventName];
      if (!listeners || !listeners.length) {
        return;
      }
      var index = listeners.indexOf(listener);
      if (index != -1) {
        listeners.splice(index, 1);
      }
      return this;
    };
    proto.emitEvent = function(eventName, args) {
      var listeners = this._events && this._events[eventName];
      if (!listeners || !listeners.length) {
        return;
      }
      listeners = listeners.slice(0);
      args = args || [];
      var onceListeners = this._onceEvents && this._onceEvents[eventName];
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        var isOnce = onceListeners && onceListeners[listener];
        if (isOnce) {
          this.off(eventName, listener);
          delete onceListeners[listener];
        }
        listener.apply(this, args);
      }
      return this;
    };
    proto.allOff = function() {
      delete this._events;
      delete this._onceEvents;
    };
    return EvEmitter;
  });
  /*!
   * getSize v2.0.3
   * measure size of elements
   * MIT license
   */
  (function(window2, factory8) {
    if (typeof define == "function" && define.amd) {
      define("get-size/get-size", factory8);
    } else {
      window2.getSize = factory8();
    }
  })(window, function factory2() {
    function getStyleSize(value) {
      var num = parseFloat(value);
      var isValid = value.indexOf("%") == -1 && !isNaN(num);
      return isValid && num;
    }
    function noop() {
    }
    var logError = typeof console == "undefined" ? noop : function(message) {
      console.error(message);
    };
    var measurements = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "marginLeft",
      "marginRight",
      "marginTop",
      "marginBottom",
      "borderLeftWidth",
      "borderRightWidth",
      "borderTopWidth",
      "borderBottomWidth"
    ];
    var measurementsLength = measurements.length;
    function getZeroSize() {
      var size = {
        width: 0,
        height: 0,
        innerWidth: 0,
        innerHeight: 0,
        outerWidth: 0,
        outerHeight: 0
      };
      for (var i = 0; i < measurementsLength; i++) {
        var measurement = measurements[i];
        size[measurement] = 0;
      }
      return size;
    }
    function getStyle(elem) {
      var style = getComputedStyle(elem);
      if (!style) {
        logError("Style returned " + style + ". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1");
      }
      return style;
    }
    var isSetup = false;
    var isBoxSizeOuter;
    function setup() {
      if (isSetup) {
        return;
      }
      isSetup = true;
      var div = document.createElement("div");
      div.style.width = "200px";
      div.style.padding = "1px 2px 3px 4px";
      div.style.borderStyle = "solid";
      div.style.borderWidth = "1px 2px 3px 4px";
      div.style.boxSizing = "border-box";
      var body = document.body || document.documentElement;
      body.appendChild(div);
      var style = getStyle(div);
      isBoxSizeOuter = Math.round(getStyleSize(style.width)) == 200;
      getSize.isBoxSizeOuter = isBoxSizeOuter;
      body.removeChild(div);
    }
    function getSize(elem) {
      setup();
      if (typeof elem == "string") {
        elem = document.querySelector(elem);
      }
      if (!elem || typeof elem != "object" || !elem.nodeType) {
        return;
      }
      var style = getStyle(elem);
      if (style.display == "none") {
        return getZeroSize();
      }
      var size = {};
      size.width = elem.offsetWidth;
      size.height = elem.offsetHeight;
      var isBorderBox = size.isBorderBox = style.boxSizing == "border-box";
      for (var i = 0; i < measurementsLength; i++) {
        var measurement = measurements[i];
        var value = style[measurement];
        var num = parseFloat(value);
        size[measurement] = !isNaN(num) ? num : 0;
      }
      var paddingWidth = size.paddingLeft + size.paddingRight;
      var paddingHeight = size.paddingTop + size.paddingBottom;
      var marginWidth = size.marginLeft + size.marginRight;
      var marginHeight = size.marginTop + size.marginBottom;
      var borderWidth = size.borderLeftWidth + size.borderRightWidth;
      var borderHeight = size.borderTopWidth + size.borderBottomWidth;
      var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;
      var styleWidth = getStyleSize(style.width);
      if (styleWidth !== false) {
        size.width = styleWidth + // add padding and border unless it's already including it
        (isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
      }
      var styleHeight = getStyleSize(style.height);
      if (styleHeight !== false) {
        size.height = styleHeight + // add padding and border unless it's already including it
        (isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
      }
      size.innerWidth = size.width - (paddingWidth + borderWidth);
      size.innerHeight = size.height - (paddingHeight + borderHeight);
      size.outerWidth = size.width + marginWidth;
      size.outerHeight = size.height + marginHeight;
      return size;
    }
    return getSize;
  });
  (function(window2, factory8) {
    if (typeof define == "function" && define.amd) {
      define("desandro-matches-selector/matches-selector", factory8);
    } else {
      window2.matchesSelector = factory8();
    }
  })(window, function factory3() {
    var matchesMethod = function() {
      var ElemProto = window.Element.prototype;
      if (ElemProto.matches) {
        return "matches";
      }
      if (ElemProto.matchesSelector) {
        return "matchesSelector";
      }
      var prefixes = ["webkit", "moz", "ms", "o"];
      for (var i = 0; i < prefixes.length; i++) {
        var prefix = prefixes[i];
        var method = prefix + "MatchesSelector";
        if (ElemProto[method]) {
          return method;
        }
      }
    }();
    return function matchesSelector(elem, selector) {
      return elem[matchesMethod](selector);
    };
  });
  (function(window2, factory8) {
    if (typeof define == "function" && define.amd) {
      define("fizzy-ui-utils/utils", [
        "desandro-matches-selector/matches-selector"
      ], function(matchesSelector) {
        return factory8(window2, matchesSelector);
      });
    } else {
      window2.fizzyUIUtils = factory8(
        window2,
        window2.matchesSelector
      );
    }
  })(window, function factory4(window2, matchesSelector) {
    var utils = {};
    utils.extend = function(a, b) {
      for (var prop in b) {
        a[prop] = b[prop];
      }
      return a;
    };
    utils.modulo = function(num, div) {
      return (num % div + div) % div;
    };
    var arraySlice = Array.prototype.slice;
    utils.makeArray = function(obj) {
      if (Array.isArray(obj)) {
        return obj;
      }
      if (obj === null || obj === void 0) {
        return [];
      }
      var isArrayLike = typeof obj == "object" && typeof obj.length == "number";
      if (isArrayLike) {
        return arraySlice.call(obj);
      }
      return [obj];
    };
    utils.removeFrom = function(ary, obj) {
      var index = ary.indexOf(obj);
      if (index != -1) {
        ary.splice(index, 1);
      }
    };
    utils.getParent = function(elem, selector) {
      while (elem.parentNode && elem != document.body) {
        elem = elem.parentNode;
        if (matchesSelector(elem, selector)) {
          return elem;
        }
      }
    };
    utils.getQueryElement = function(elem) {
      if (typeof elem == "string") {
        return document.querySelector(elem);
      }
      return elem;
    };
    utils.handleEvent = function(event) {
      var method = "on" + event.type;
      if (this[method]) {
        this[method](event);
      }
    };
    utils.filterFindElements = function(elems, selector) {
      elems = utils.makeArray(elems);
      var ffElems = [];
      elems.forEach(function(elem) {
        if (!(elem instanceof HTMLElement)) {
          return;
        }
        if (!selector) {
          ffElems.push(elem);
          return;
        }
        if (matchesSelector(elem, selector)) {
          ffElems.push(elem);
        }
        var childElems = elem.querySelectorAll(selector);
        for (var i = 0; i < childElems.length; i++) {
          ffElems.push(childElems[i]);
        }
      });
      return ffElems;
    };
    utils.debounceMethod = function(_class, methodName, threshold) {
      threshold = threshold || 100;
      var method = _class.prototype[methodName];
      var timeoutName = methodName + "Timeout";
      _class.prototype[methodName] = function() {
        var timeout = this[timeoutName];
        clearTimeout(timeout);
        var args = arguments;
        var _this = this;
        this[timeoutName] = setTimeout(function() {
          method.apply(_this, args);
          delete _this[timeoutName];
        }, threshold);
      };
    };
    utils.docReady = function(callback) {
      var readyState = document.readyState;
      if (readyState == "complete" || readyState == "interactive") {
        setTimeout(callback);
      } else {
        document.addEventListener("DOMContentLoaded", callback);
      }
    };
    utils.toDashed = function(str) {
      return str.replace(/(.)([A-Z])/g, function(match, $1, $2) {
        return $1 + "-" + $2;
      }).toLowerCase();
    };
    var console2 = window2.console;
    utils.htmlInit = function(WidgetClass, namespace) {
      utils.docReady(function() {
        var dashedNamespace = utils.toDashed(namespace);
        var dataAttr = "data-" + dashedNamespace;
        var dataAttrElems = document.querySelectorAll("[" + dataAttr + "]");
        var jsDashElems = document.querySelectorAll(".js-" + dashedNamespace);
        var elems = utils.makeArray(dataAttrElems).concat(utils.makeArray(jsDashElems));
        var dataOptionsAttr = dataAttr + "-options";
        var jQuery2 = window2.jQuery;
        elems.forEach(function(elem) {
          var attr = elem.getAttribute(dataAttr) || elem.getAttribute(dataOptionsAttr);
          var options;
          try {
            options = attr && JSON.parse(attr);
          } catch (error) {
            if (console2) {
              console2.error("Error parsing " + dataAttr + " on " + elem.className + ": " + error);
            }
            return;
          }
          var instance = new WidgetClass(elem, options);
          if (jQuery2) {
            jQuery2.data(elem, namespace, instance);
          }
        });
      });
    };
    return utils;
  });
  (function(window2, factory8) {
    if (typeof define == "function" && define.amd) {
      define(
        "outlayer/item",
        [
          "ev-emitter/ev-emitter",
          "get-size/get-size"
        ],
        factory8
      );
    } else {
      window2.Outlayer = {};
      window2.Outlayer.Item = factory8(
        window2.EvEmitter,
        window2.getSize
      );
    }
  })(window, function factory5(EvEmitter, getSize) {
    function isEmptyObj(obj) {
      for (var prop in obj) {
        return false;
      }
      prop = null;
      return true;
    }
    var docElemStyle = document.documentElement.style;
    var transitionProperty = typeof docElemStyle.transition == "string" ? "transition" : "WebkitTransition";
    var transformProperty = typeof docElemStyle.transform == "string" ? "transform" : "WebkitTransform";
    var transitionEndEvent = {
      WebkitTransition: "webkitTransitionEnd",
      transition: "transitionend"
    }[transitionProperty];
    var vendorProperties = {
      transform: transformProperty,
      transition: transitionProperty,
      transitionDuration: transitionProperty + "Duration",
      transitionProperty: transitionProperty + "Property",
      transitionDelay: transitionProperty + "Delay"
    };
    function Item(element, layout) {
      if (!element) {
        return;
      }
      this.element = element;
      this.layout = layout;
      this.position = {
        x: 0,
        y: 0
      };
      this._create();
    }
    var proto = Item.prototype = Object.create(EvEmitter.prototype);
    proto.constructor = Item;
    proto._create = function() {
      this._transn = {
        ingProperties: {},
        clean: {},
        onEnd: {}
      };
      this.css({
        position: "absolute"
      });
    };
    proto.handleEvent = function(event) {
      var method = "on" + event.type;
      if (this[method]) {
        this[method](event);
      }
    };
    proto.getSize = function() {
      this.size = getSize(this.element);
    };
    proto.css = function(style) {
      var elemStyle = this.element.style;
      for (var prop in style) {
        var supportedProp = vendorProperties[prop] || prop;
        elemStyle[supportedProp] = style[prop];
      }
    };
    proto.getPosition = function() {
      var style = getComputedStyle(this.element);
      var isOriginLeft = this.layout._getOption("originLeft");
      var isOriginTop = this.layout._getOption("originTop");
      var xValue = style[isOriginLeft ? "left" : "right"];
      var yValue = style[isOriginTop ? "top" : "bottom"];
      var x = parseFloat(xValue);
      var y = parseFloat(yValue);
      var layoutSize = this.layout.size;
      if (xValue.indexOf("%") != -1) {
        x = x / 100 * layoutSize.width;
      }
      if (yValue.indexOf("%") != -1) {
        y = y / 100 * layoutSize.height;
      }
      x = isNaN(x) ? 0 : x;
      y = isNaN(y) ? 0 : y;
      x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
      y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;
      this.position.x = x;
      this.position.y = y;
    };
    proto.layoutPosition = function() {
      var layoutSize = this.layout.size;
      var style = {};
      var isOriginLeft = this.layout._getOption("originLeft");
      var isOriginTop = this.layout._getOption("originTop");
      var xPadding = isOriginLeft ? "paddingLeft" : "paddingRight";
      var xProperty = isOriginLeft ? "left" : "right";
      var xResetProperty = isOriginLeft ? "right" : "left";
      var x = this.position.x + layoutSize[xPadding];
      style[xProperty] = this.getXValue(x);
      style[xResetProperty] = "";
      var yPadding = isOriginTop ? "paddingTop" : "paddingBottom";
      var yProperty = isOriginTop ? "top" : "bottom";
      var yResetProperty = isOriginTop ? "bottom" : "top";
      var y = this.position.y + layoutSize[yPadding];
      style[yProperty] = this.getYValue(y);
      style[yResetProperty] = "";
      this.css(style);
      this.emitEvent("layout", [this]);
    };
    proto.getXValue = function(x) {
      var isHorizontal = this.layout._getOption("horizontal");
      return this.layout.options.percentPosition && !isHorizontal ? x / this.layout.size.width * 100 + "%" : x + "px";
    };
    proto.getYValue = function(y) {
      var isHorizontal = this.layout._getOption("horizontal");
      return this.layout.options.percentPosition && isHorizontal ? y / this.layout.size.height * 100 + "%" : y + "px";
    };
    proto._transitionTo = function(x, y) {
      this.getPosition();
      var curX = this.position.x;
      var curY = this.position.y;
      var didNotMove = x == this.position.x && y == this.position.y;
      this.setPosition(x, y);
      if (didNotMove && !this.isTransitioning) {
        this.layoutPosition();
        return;
      }
      var transX = x - curX;
      var transY = y - curY;
      var transitionStyle = {};
      transitionStyle.transform = this.getTranslate(transX, transY);
      this.transition({
        to: transitionStyle,
        onTransitionEnd: {
          transform: this.layoutPosition
        },
        isCleaning: true
      });
    };
    proto.getTranslate = function(x, y) {
      var isOriginLeft = this.layout._getOption("originLeft");
      var isOriginTop = this.layout._getOption("originTop");
      x = isOriginLeft ? x : -x;
      y = isOriginTop ? y : -y;
      return "translate3d(" + x + "px, " + y + "px, 0)";
    };
    proto.goTo = function(x, y) {
      this.setPosition(x, y);
      this.layoutPosition();
    };
    proto.moveTo = proto._transitionTo;
    proto.setPosition = function(x, y) {
      this.position.x = parseFloat(x);
      this.position.y = parseFloat(y);
    };
    proto._nonTransition = function(args) {
      this.css(args.to);
      if (args.isCleaning) {
        this._removeStyles(args.to);
      }
      for (var prop in args.onTransitionEnd) {
        args.onTransitionEnd[prop].call(this);
      }
    };
    proto.transition = function(args) {
      if (!parseFloat(this.layout.options.transitionDuration)) {
        this._nonTransition(args);
        return;
      }
      var _transition = this._transn;
      for (var prop in args.onTransitionEnd) {
        _transition.onEnd[prop] = args.onTransitionEnd[prop];
      }
      for (prop in args.to) {
        _transition.ingProperties[prop] = true;
        if (args.isCleaning) {
          _transition.clean[prop] = true;
        }
      }
      if (args.from) {
        this.css(args.from);
        this.element.offsetHeight;
      }
      this.enableTransition(args.to);
      this.css(args.to);
      this.isTransitioning = true;
    };
    function toDashedAll(str) {
      return str.replace(/([A-Z])/g, function($1) {
        return "-" + $1.toLowerCase();
      });
    }
    var transitionProps = "opacity," + toDashedAll(transformProperty);
    proto.enableTransition = function() {
      if (this.isTransitioning) {
        return;
      }
      var duration = this.layout.options.transitionDuration;
      duration = typeof duration == "number" ? duration + "ms" : duration;
      this.css({
        transitionProperty: transitionProps,
        transitionDuration: duration,
        transitionDelay: this.staggerDelay || 0
      });
      this.element.addEventListener(transitionEndEvent, this, false);
    };
    proto.onwebkitTransitionEnd = function(event) {
      this.ontransitionend(event);
    };
    proto.onotransitionend = function(event) {
      this.ontransitionend(event);
    };
    var dashedVendorProperties = {
      "-webkit-transform": "transform"
    };
    proto.ontransitionend = function(event) {
      if (event.target !== this.element) {
        return;
      }
      var _transition = this._transn;
      var propertyName = dashedVendorProperties[event.propertyName] || event.propertyName;
      delete _transition.ingProperties[propertyName];
      if (isEmptyObj(_transition.ingProperties)) {
        this.disableTransition();
      }
      if (propertyName in _transition.clean) {
        this.element.style[event.propertyName] = "";
        delete _transition.clean[propertyName];
      }
      if (propertyName in _transition.onEnd) {
        var onTransitionEnd = _transition.onEnd[propertyName];
        onTransitionEnd.call(this);
        delete _transition.onEnd[propertyName];
      }
      this.emitEvent("transitionEnd", [this]);
    };
    proto.disableTransition = function() {
      this.removeTransitionStyles();
      this.element.removeEventListener(transitionEndEvent, this, false);
      this.isTransitioning = false;
    };
    proto._removeStyles = function(style) {
      var cleanStyle = {};
      for (var prop in style) {
        cleanStyle[prop] = "";
      }
      this.css(cleanStyle);
    };
    var cleanTransitionStyle = {
      transitionProperty: "",
      transitionDuration: "",
      transitionDelay: ""
    };
    proto.removeTransitionStyles = function() {
      this.css(cleanTransitionStyle);
    };
    proto.stagger = function(delay) {
      delay = isNaN(delay) ? 0 : delay;
      this.staggerDelay = delay + "ms";
    };
    proto.removeElem = function() {
      this.element.parentNode.removeChild(this.element);
      this.css({ display: "" });
      this.emitEvent("remove", [this]);
    };
    proto.remove = function() {
      if (!transitionProperty || !parseFloat(this.layout.options.transitionDuration)) {
        this.removeElem();
        return;
      }
      this.once("transitionEnd", function() {
        this.removeElem();
      });
      this.hide();
    };
    proto.reveal = function() {
      delete this.isHidden;
      this.css({ display: "" });
      var options = this.layout.options;
      var onTransitionEnd = {};
      var transitionEndProperty = this.getHideRevealTransitionEndProperty("visibleStyle");
      onTransitionEnd[transitionEndProperty] = this.onRevealTransitionEnd;
      this.transition({
        from: options.hiddenStyle,
        to: options.visibleStyle,
        isCleaning: true,
        onTransitionEnd
      });
    };
    proto.onRevealTransitionEnd = function() {
      if (!this.isHidden) {
        this.emitEvent("reveal");
      }
    };
    proto.getHideRevealTransitionEndProperty = function(styleProperty) {
      var optionStyle = this.layout.options[styleProperty];
      if (optionStyle.opacity) {
        return "opacity";
      }
      for (var prop in optionStyle) {
        return prop;
      }
    };
    proto.hide = function() {
      this.isHidden = true;
      this.css({ display: "" });
      var options = this.layout.options;
      var onTransitionEnd = {};
      var transitionEndProperty = this.getHideRevealTransitionEndProperty("hiddenStyle");
      onTransitionEnd[transitionEndProperty] = this.onHideTransitionEnd;
      this.transition({
        from: options.visibleStyle,
        to: options.hiddenStyle,
        // keep hidden stuff hidden
        isCleaning: true,
        onTransitionEnd
      });
    };
    proto.onHideTransitionEnd = function() {
      if (this.isHidden) {
        this.css({ display: "none" });
        this.emitEvent("hide");
      }
    };
    proto.destroy = function() {
      this.css({
        position: "",
        left: "",
        right: "",
        top: "",
        bottom: "",
        transition: "",
        transform: ""
      });
    };
    return Item;
  });
  /*!
   * Outlayer v2.1.1
   * the brains and guts of a layout library
   * MIT license
   */
  (function(window2, factory8) {
    if (typeof define == "function" && define.amd) {
      define(
        "outlayer/outlayer",
        [
          "ev-emitter/ev-emitter",
          "get-size/get-size",
          "fizzy-ui-utils/utils",
          "./item"
        ],
        function(EvEmitter, getSize, utils, Item) {
          return factory8(window2, EvEmitter, getSize, utils, Item);
        }
      );
    } else {
      window2.Outlayer = factory8(
        window2,
        window2.EvEmitter,
        window2.getSize,
        window2.fizzyUIUtils,
        window2.Outlayer.Item
      );
    }
  })(window, function factory6(window2, EvEmitter, getSize, utils, Item) {
    var console2 = window2.console;
    var jQuery2 = window2.jQuery;
    var noop = function() {
    };
    var GUID = 0;
    var instances = {};
    function Outlayer(element, options) {
      var queryElement = utils.getQueryElement(element);
      if (!queryElement) {
        if (console2) {
          console2.error("Bad element for " + this.constructor.namespace + ": " + (queryElement || element));
        }
        return;
      }
      this.element = queryElement;
      if (jQuery2) {
        this.$element = jQuery2(this.element);
      }
      this.options = utils.extend({}, this.constructor.defaults);
      this.option(options);
      var id = ++GUID;
      this.element.outlayerGUID = id;
      instances[id] = this;
      this._create();
      var isInitLayout = this._getOption("initLayout");
      if (isInitLayout) {
        this.layout();
      }
    }
    Outlayer.namespace = "outlayer";
    Outlayer.Item = Item;
    Outlayer.defaults = {
      containerStyle: {
        position: "relative"
      },
      initLayout: true,
      originLeft: true,
      originTop: true,
      resize: true,
      resizeContainer: true,
      // item options
      transitionDuration: "0.4s",
      hiddenStyle: {
        opacity: 0,
        transform: "scale(0.001)"
      },
      visibleStyle: {
        opacity: 1,
        transform: "scale(1)"
      }
    };
    var proto = Outlayer.prototype;
    utils.extend(proto, EvEmitter.prototype);
    proto.option = function(opts) {
      utils.extend(this.options, opts);
    };
    proto._getOption = function(option) {
      var oldOption = this.constructor.compatOptions[option];
      return oldOption && this.options[oldOption] !== void 0 ? this.options[oldOption] : this.options[option];
    };
    Outlayer.compatOptions = {
      // currentName: oldName
      initLayout: "isInitLayout",
      horizontal: "isHorizontal",
      layoutInstant: "isLayoutInstant",
      originLeft: "isOriginLeft",
      originTop: "isOriginTop",
      resize: "isResizeBound",
      resizeContainer: "isResizingContainer"
    };
    proto._create = function() {
      this.reloadItems();
      this.stamps = [];
      this.stamp(this.options.stamp);
      utils.extend(this.element.style, this.options.containerStyle);
      var canBindResize = this._getOption("resize");
      if (canBindResize) {
        this.bindResize();
      }
    };
    proto.reloadItems = function() {
      this.items = this._itemize(this.element.children);
    };
    proto._itemize = function(elems) {
      var itemElems = this._filterFindItemElements(elems);
      var Item2 = this.constructor.Item;
      var items = [];
      for (var i = 0; i < itemElems.length; i++) {
        var elem = itemElems[i];
        var item = new Item2(elem, this);
        items.push(item);
      }
      return items;
    };
    proto._filterFindItemElements = function(elems) {
      return utils.filterFindElements(elems, this.options.itemSelector);
    };
    proto.getItemElements = function() {
      return this.items.map(function(item) {
        return item.element;
      });
    };
    proto.layout = function() {
      this._resetLayout();
      this._manageStamps();
      var layoutInstant = this._getOption("layoutInstant");
      var isInstant = layoutInstant !== void 0 ? layoutInstant : !this._isLayoutInited;
      this.layoutItems(this.items, isInstant);
      this._isLayoutInited = true;
    };
    proto._init = proto.layout;
    proto._resetLayout = function() {
      this.getSize();
    };
    proto.getSize = function() {
      this.size = getSize(this.element);
    };
    proto._getMeasurement = function(measurement, size) {
      var option = this.options[measurement];
      var elem;
      if (!option) {
        this[measurement] = 0;
      } else {
        if (typeof option == "string") {
          elem = this.element.querySelector(option);
        } else if (option instanceof HTMLElement) {
          elem = option;
        }
        this[measurement] = elem ? getSize(elem)[size] : option;
      }
    };
    proto.layoutItems = function(items, isInstant) {
      items = this._getItemsForLayout(items);
      this._layoutItems(items, isInstant);
      this._postLayout();
    };
    proto._getItemsForLayout = function(items) {
      return items.filter(function(item) {
        return !item.isIgnored;
      });
    };
    proto._layoutItems = function(items, isInstant) {
      this._emitCompleteOnItems("layout", items);
      if (!items || !items.length) {
        return;
      }
      var queue = [];
      items.forEach(function(item) {
        var position = this._getItemLayoutPosition(item);
        position.item = item;
        position.isInstant = isInstant || item.isLayoutInstant;
        queue.push(position);
      }, this);
      this._processLayoutQueue(queue);
    };
    proto._getItemLayoutPosition = function() {
      return {
        x: 0,
        y: 0
      };
    };
    proto._processLayoutQueue = function(queue) {
      this.updateStagger();
      queue.forEach(function(obj, i) {
        this._positionItem(obj.item, obj.x, obj.y, obj.isInstant, i);
      }, this);
    };
    proto.updateStagger = function() {
      var stagger = this.options.stagger;
      if (stagger === null || stagger === void 0) {
        this.stagger = 0;
        return;
      }
      this.stagger = getMilliseconds(stagger);
      return this.stagger;
    };
    proto._positionItem = function(item, x, y, isInstant, i) {
      if (isInstant) {
        item.goTo(x, y);
      } else {
        item.stagger(i * this.stagger);
        item.moveTo(x, y);
      }
    };
    proto._postLayout = function() {
      this.resizeContainer();
    };
    proto.resizeContainer = function() {
      var isResizingContainer = this._getOption("resizeContainer");
      if (!isResizingContainer) {
        return;
      }
      var size = this._getContainerSize();
      if (size) {
        this._setContainerMeasure(size.width, true);
        this._setContainerMeasure(size.height, false);
      }
    };
    proto._getContainerSize = noop;
    proto._setContainerMeasure = function(measure, isWidth) {
      if (measure === void 0) {
        return;
      }
      var elemSize = this.size;
      if (elemSize.isBorderBox) {
        measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight + elemSize.borderLeftWidth + elemSize.borderRightWidth : elemSize.paddingBottom + elemSize.paddingTop + elemSize.borderTopWidth + elemSize.borderBottomWidth;
      }
      measure = Math.max(measure, 0);
      this.element.style[isWidth ? "width" : "height"] = measure + "px";
    };
    proto._emitCompleteOnItems = function(eventName, items) {
      var _this = this;
      function onComplete() {
        _this.dispatchEvent(eventName + "Complete", null, [items]);
      }
      var count = items.length;
      if (!items || !count) {
        onComplete();
        return;
      }
      var doneCount = 0;
      function tick() {
        doneCount++;
        if (doneCount == count) {
          onComplete();
        }
      }
      items.forEach(function(item) {
        item.once(eventName, tick);
      });
    };
    proto.dispatchEvent = function(type, event, args) {
      var emitArgs = event ? [event].concat(args) : args;
      this.emitEvent(type, emitArgs);
      if (jQuery2) {
        this.$element = this.$element || jQuery2(this.element);
        if (event) {
          var $event = jQuery2.Event(event);
          $event.type = type;
          this.$element.trigger($event, args);
        } else {
          this.$element.trigger(type, args);
        }
      }
    };
    proto.ignore = function(elem) {
      var item = this.getItem(elem);
      if (item) {
        item.isIgnored = true;
      }
    };
    proto.unignore = function(elem) {
      var item = this.getItem(elem);
      if (item) {
        delete item.isIgnored;
      }
    };
    proto.stamp = function(elems) {
      elems = this._find(elems);
      if (!elems) {
        return;
      }
      this.stamps = this.stamps.concat(elems);
      elems.forEach(this.ignore, this);
    };
    proto.unstamp = function(elems) {
      elems = this._find(elems);
      if (!elems) {
        return;
      }
      elems.forEach(function(elem) {
        utils.removeFrom(this.stamps, elem);
        this.unignore(elem);
      }, this);
    };
    proto._find = function(elems) {
      if (!elems) {
        return;
      }
      if (typeof elems == "string") {
        elems = this.element.querySelectorAll(elems);
      }
      elems = utils.makeArray(elems);
      return elems;
    };
    proto._manageStamps = function() {
      if (!this.stamps || !this.stamps.length) {
        return;
      }
      this._getBoundingRect();
      this.stamps.forEach(this._manageStamp, this);
    };
    proto._getBoundingRect = function() {
      var boundingRect = this.element.getBoundingClientRect();
      var size = this.size;
      this._boundingRect = {
        left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
        top: boundingRect.top + size.paddingTop + size.borderTopWidth,
        right: boundingRect.right - (size.paddingRight + size.borderRightWidth),
        bottom: boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth)
      };
    };
    proto._manageStamp = noop;
    proto._getElementOffset = function(elem) {
      var boundingRect = elem.getBoundingClientRect();
      var thisRect = this._boundingRect;
      var size = getSize(elem);
      var offset = {
        left: boundingRect.left - thisRect.left - size.marginLeft,
        top: boundingRect.top - thisRect.top - size.marginTop,
        right: thisRect.right - boundingRect.right - size.marginRight,
        bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
      };
      return offset;
    };
    proto.handleEvent = utils.handleEvent;
    proto.bindResize = function() {
      window2.addEventListener("resize", this);
      this.isResizeBound = true;
    };
    proto.unbindResize = function() {
      window2.removeEventListener("resize", this);
      this.isResizeBound = false;
    };
    proto.onresize = function() {
      this.resize();
    };
    utils.debounceMethod(Outlayer, "onresize", 100);
    proto.resize = function() {
      if (!this.isResizeBound || !this.needsResizeLayout()) {
        return;
      }
      this.layout();
    };
    proto.needsResizeLayout = function() {
      var size = getSize(this.element);
      var hasSizes = this.size && size;
      return hasSizes && size.innerWidth !== this.size.innerWidth;
    };
    proto.addItems = function(elems) {
      var items = this._itemize(elems);
      if (items.length) {
        this.items = this.items.concat(items);
      }
      return items;
    };
    proto.appended = function(elems) {
      var items = this.addItems(elems);
      if (!items.length) {
        return;
      }
      this.layoutItems(items, true);
      this.reveal(items);
    };
    proto.prepended = function(elems) {
      var items = this._itemize(elems);
      if (!items.length) {
        return;
      }
      var previousItems = this.items.slice(0);
      this.items = items.concat(previousItems);
      this._resetLayout();
      this._manageStamps();
      this.layoutItems(items, true);
      this.reveal(items);
      this.layoutItems(previousItems);
    };
    proto.reveal = function(items) {
      this._emitCompleteOnItems("reveal", items);
      if (!items || !items.length) {
        return;
      }
      var stagger = this.updateStagger();
      items.forEach(function(item, i) {
        item.stagger(i * stagger);
        item.reveal();
      });
    };
    proto.hide = function(items) {
      this._emitCompleteOnItems("hide", items);
      if (!items || !items.length) {
        return;
      }
      var stagger = this.updateStagger();
      items.forEach(function(item, i) {
        item.stagger(i * stagger);
        item.hide();
      });
    };
    proto.revealItemElements = function(elems) {
      var items = this.getItems(elems);
      this.reveal(items);
    };
    proto.hideItemElements = function(elems) {
      var items = this.getItems(elems);
      this.hide(items);
    };
    proto.getItem = function(elem) {
      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (item.element == elem) {
          return item;
        }
      }
    };
    proto.getItems = function(elems) {
      elems = utils.makeArray(elems);
      var items = [];
      elems.forEach(function(elem) {
        var item = this.getItem(elem);
        if (item) {
          items.push(item);
        }
      }, this);
      return items;
    };
    proto.remove = function(elems) {
      var removeItems = this.getItems(elems);
      this._emitCompleteOnItems("remove", removeItems);
      if (!removeItems || !removeItems.length) {
        return;
      }
      removeItems.forEach(function(item) {
        item.remove();
        utils.removeFrom(this.items, item);
      }, this);
    };
    proto.destroy = function() {
      var style = this.element.style;
      style.height = "";
      style.position = "";
      style.width = "";
      this.items.forEach(function(item) {
        item.destroy();
      });
      this.unbindResize();
      var id = this.element.outlayerGUID;
      delete instances[id];
      delete this.element.outlayerGUID;
      if (jQuery2) {
        jQuery2.removeData(this.element, this.constructor.namespace);
      }
    };
    Outlayer.data = function(elem) {
      elem = utils.getQueryElement(elem);
      var id = elem && elem.outlayerGUID;
      return id && instances[id];
    };
    Outlayer.create = function(namespace, options) {
      var Layout = subclass(Outlayer);
      Layout.defaults = utils.extend({}, Outlayer.defaults);
      utils.extend(Layout.defaults, options);
      Layout.compatOptions = utils.extend({}, Outlayer.compatOptions);
      Layout.namespace = namespace;
      Layout.data = Outlayer.data;
      Layout.Item = subclass(Item);
      utils.htmlInit(Layout, namespace);
      if (jQuery2 && jQuery2.bridget) {
        jQuery2.bridget(namespace, Layout);
      }
      return Layout;
    };
    function subclass(Parent) {
      function SubClass() {
        Parent.apply(this, arguments);
      }
      SubClass.prototype = Object.create(Parent.prototype);
      SubClass.prototype.constructor = SubClass;
      return SubClass;
    }
    var msUnits = {
      ms: 1,
      s: 1e3
    };
    function getMilliseconds(time) {
      if (typeof time == "number") {
        return time;
      }
      var matches = time.match(/(^\d*\.?\d*)(\w*)/);
      var num = matches && matches[1];
      var unit = matches && matches[2];
      if (!num.length) {
        return 0;
      }
      num = parseFloat(num);
      var mult = msUnits[unit] || 1;
      return num * mult;
    }
    Outlayer.Item = Item;
    return Outlayer;
  });
  /*!
   * Masonry v4.2.2
   * Cascading grid layout library
   * https://masonry.desandro.com
   * MIT License
   * by David DeSandro
   */
  (function(window2, factory8) {
    if (typeof define == "function" && define.amd) {
      define(
        [
          "outlayer/outlayer",
          "get-size/get-size"
        ],
        factory8
      );
    } else {
      window2.Masonry = factory8(
        window2.Outlayer,
        window2.getSize
      );
    }
  })(window, function factory7(Outlayer, getSize) {
    var Masonry2 = Outlayer.create("masonry");
    Masonry2.compatOptions.fitWidth = "isFitWidth";
    var proto = Masonry2.prototype;
    proto._resetLayout = function() {
      this.getSize();
      this._getMeasurement("columnWidth", "outerWidth");
      this._getMeasurement("gutter", "outerWidth");
      this.measureColumns();
      this.colYs = [];
      for (var i = 0; i < this.cols; i++) {
        this.colYs.push(0);
      }
      this.maxY = 0;
      this.horizontalColIndex = 0;
    };
    proto.measureColumns = function() {
      this.getContainerWidth();
      if (!this.columnWidth) {
        var firstItem = this.items[0];
        var firstItemElem = firstItem && firstItem.element;
        this.columnWidth = firstItemElem && getSize(firstItemElem).outerWidth || // if first elem has no width, default to size of container
        this.containerWidth;
      }
      var columnWidth = this.columnWidth += this.gutter;
      var containerWidth = this.containerWidth + this.gutter;
      var cols = containerWidth / columnWidth;
      var excess = columnWidth - containerWidth % columnWidth;
      var mathMethod = excess && excess < 1 ? "round" : "floor";
      cols = Math[mathMethod](cols);
      this.cols = Math.max(cols, 1);
    };
    proto.getContainerWidth = function() {
      var isFitWidth = this._getOption("fitWidth");
      var container = isFitWidth ? this.element.parentNode : this.element;
      var size = getSize(container);
      this.containerWidth = size && size.innerWidth;
    };
    proto._getItemLayoutPosition = function(item) {
      item.getSize();
      var remainder = item.size.outerWidth % this.columnWidth;
      var mathMethod = remainder && remainder < 1 ? "round" : "ceil";
      var colSpan = Math[mathMethod](item.size.outerWidth / this.columnWidth);
      colSpan = Math.min(colSpan, this.cols);
      var colPosMethod = this.options.horizontalOrder ? "_getHorizontalColPosition" : "_getTopColPosition";
      var colPosition = this[colPosMethod](colSpan, item);
      var position = {
        x: this.columnWidth * colPosition.col,
        y: colPosition.y
      };
      var setHeight = colPosition.y + item.size.outerHeight;
      var setMax = colSpan + colPosition.col;
      for (var i = colPosition.col; i < setMax; i++) {
        this.colYs[i] = setHeight;
      }
      return position;
    };
    proto._getTopColPosition = function(colSpan) {
      var colGroup = this._getTopColGroup(colSpan);
      var minimumY = Math.min.apply(Math, colGroup);
      return {
        col: colGroup.indexOf(minimumY),
        y: minimumY
      };
    };
    proto._getTopColGroup = function(colSpan) {
      if (colSpan < 2) {
        return this.colYs;
      }
      var colGroup = [];
      var groupCount = this.cols + 1 - colSpan;
      for (var i = 0; i < groupCount; i++) {
        colGroup[i] = this._getColGroupY(i, colSpan);
      }
      return colGroup;
    };
    proto._getColGroupY = function(col, colSpan) {
      if (colSpan < 2) {
        return this.colYs[col];
      }
      var groupColYs = this.colYs.slice(col, col + colSpan);
      return Math.max.apply(Math, groupColYs);
    };
    proto._getHorizontalColPosition = function(colSpan, item) {
      var col = this.horizontalColIndex % this.cols;
      var isOver = colSpan > 1 && col + colSpan > this.cols;
      col = isOver ? 0 : col;
      var hasSize = item.size.outerWidth && item.size.outerHeight;
      this.horizontalColIndex = hasSize ? col + colSpan : this.horizontalColIndex;
      return {
        col,
        y: this._getColGroupY(col, colSpan)
      };
    };
    proto._manageStamp = function(stamp) {
      var stampSize = getSize(stamp);
      var offset = this._getElementOffset(stamp);
      var isOriginLeft = this._getOption("originLeft");
      var firstX = isOriginLeft ? offset.left : offset.right;
      var lastX = firstX + stampSize.outerWidth;
      var firstCol = Math.floor(firstX / this.columnWidth);
      firstCol = Math.max(0, firstCol);
      var lastCol = Math.floor(lastX / this.columnWidth);
      lastCol -= lastX % this.columnWidth ? 0 : 1;
      lastCol = Math.min(this.cols - 1, lastCol);
      var isOriginTop = this._getOption("originTop");
      var stampMaxY = (isOriginTop ? offset.top : offset.bottom) + stampSize.outerHeight;
      for (var i = firstCol; i <= lastCol; i++) {
        this.colYs[i] = Math.max(stampMaxY, this.colYs[i]);
      }
    };
    proto._getContainerSize = function() {
      this.maxY = Math.max.apply(Math, this.colYs);
      var size = {
        height: this.maxY
      };
      if (this._getOption("fitWidth")) {
        size.width = this._getContainerFitWidth();
      }
      return size;
    };
    proto._getContainerFitWidth = function() {
      var unusedCols = 0;
      var i = this.cols;
      while (--i) {
        if (this.colYs[i] !== 0) {
          break;
        }
        unusedCols++;
      }
      return (this.cols - unusedCols) * this.columnWidth - this.gutter;
    };
    proto.needsResizeLayout = function() {
      var previousWidth = this.containerWidth;
      this.getContainerWidth();
      return previousWidth != this.containerWidth;
    };
    return Masonry2;
  });
  console.log("________PT-TorrentList-Masonry 已启动!________");
  const _ORIGIN_TL_Node = GET_TORRENT_LIST_DOM_FROM_DOMAIN();
  if (!_ORIGIN_TL_Node) {
    console.log("未识别到种子列表捏~");
  } else {
    let scan_and_launch = function() {
      const scrollHeight = document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop + clientHeight >= scrollHeight - PAGE.DISTANCE) {
        if (PAGE.SWITCH_MODE != "Button")
          debounceLoad();
        sortMasonry();
      }
    }, loadNextPage = function() {
      console.log("到页面底部啦!!! Scrolled to bottom!");
      const urlSearchParams = new URLSearchParams(window.location.search);
      PAGE.PAGE_CURRENT = PAGE.IS_ORIGIN ? urlSearchParams.get("page") : PAGE.PAGE_CURRENT;
      if (!PAGE.PAGE_CURRENT) {
        console.log(`网页链接没有page参数, 无法跳转下一页, 生成PAGE.PAGE_CURRENT为0`);
        PAGE.PAGE_CURRENT = 0;
      } else {
        console.log("当前页数: " + PAGE.PAGE_CURRENT);
      }
      PAGE.PAGE_NEXT = parseInt(PAGE.PAGE_CURRENT) + 1;
      urlSearchParams.set("page", PAGE.PAGE_NEXT);
      PAGE.NEXT_URL = window.location.origin + window.location.pathname + "?" + urlSearchParams.toString();
      console.log("New URL:", PAGE.NEXT_URL);
      fetch(PAGE.NEXT_URL).then((response) => response.text()).then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const table = doc.querySelector("table.torrents");
        PUT_TORRENT_INTO_MASONRY(table, waterfallNode, false, masonry2);
        CHANGE_CARD_WIDTH(CARD.CARD_WIDTH, waterfallNode, masonry2);
        PAGE.IS_ORIGIN = false;
        PAGE.PAGE_CURRENT = PAGE.PAGE_NEXT;
      }).catch((error) => {
        console.warn("获取不到下页信息, 可能到头了");
        console.warn(error);
      });
      btnTurnPageDOM.disabled = false;
      btnTurnPageDOM.textContent = "点击加载下一页";
    };
    _ORIGIN_TL_Node.style.display = "none";
    while (!Masonry) {
      console.log("等待初始化......");
    }
    let masonry2;
    window.masonry = masonry2;
    const mainOuterDOM = document.querySelector("table.mainouter");
    const themeColor = window.getComputedStyle(mainOuterDOM)["background-color"];
    console.log("背景颜色:", themeColor);
    const parentNode = _ORIGIN_TL_Node.parentNode;
    const waterfallNode = document.createElement("div");
    waterfallNode.classList.add("waterfall");
    parentNode.insertBefore(waterfallNode, _ORIGIN_TL_Node.nextSibling);
    waterfallNode.addEventListener("click", () => {
      if (masonry2)
        masonry2.layout();
      console.log("Masonry 已整理~");
    });
    document.getElementById("btnViewOrigin");
    const toggleBtn = document.createElement("button");
    toggleBtn.classList.add("debug");
    toggleBtn.setAttribute("id", "toggle_oldTable");
    toggleBtn.innerText = "显示原种子表格";
    toggleBtn.style.zIndex = 10001;
    toggleBtn.addEventListener("click", function() {
      if (_ORIGIN_TL_Node.style.display === "none") {
        _ORIGIN_TL_Node.style.display = "block";
        toggleBtn.innerText = "隐藏原种子表格";
      } else {
        _ORIGIN_TL_Node.style.display = "none";
        toggleBtn.innerText = "显示原种子表格";
      }
    });
    document.body.appendChild(toggleBtn);
    document.getElementById("btnReLayout");
    const reLayoutBtn = document.createElement("button");
    reLayoutBtn.classList.add("debug");
    reLayoutBtn.setAttribute("id", "btnReLayout");
    reLayoutBtn.innerText = "单列宽度切换(200/300)";
    reLayoutBtn.style.zIndex = 10002;
    reLayoutBtn.addEventListener("click", function() {
      sortMasonry();
      CARD.CARD_WIDTH = CARD.CARD_WIDTH == 200 ? 300 : 200;
      CHANGE_CARD_WIDTH(CARD.CARD_WIDTH, waterfallNode, masonry2);
      sortMasonry();
    });
    document.body.appendChild(reLayoutBtn);
    const btnTurnPageDOM = document.createElement("button");
    waterfallNode.insertAdjacentElement("afterend", btnTurnPageDOM);
    btnTurnPageDOM.classList.add("turnPage");
    btnTurnPageDOM.setAttribute("id", "turnPage");
    btnTurnPageDOM.innerText = "点击加载下一页";
    btnTurnPageDOM.addEventListener("click", function(event) {
      event.preventDefault();
      btnTurnPageDOM.disabled = true;
      btnTurnPageDOM.textContent = "正在加载中...";
      debounceLoad();
    });
    document.getElementById("btnSwitchMode");
    const switchModeBtn = document.createElement("button");
    switchModeBtn.classList.add("debug");
    switchModeBtn.setAttribute("id", "btnSwitchMode");
    switchModeBtn.innerText = "当前加载方式: 按钮";
    switchModeBtn.style.zIndex = 10003;
    switchModeBtn.addEventListener("click", function() {
      if (switchModeBtn.innerText == "当前加载方式: 按钮") {
        switchModeBtn.innerText = "当前加载方式: 滑动";
        PAGE.SWITCH_MODE = "Slip";
        btnTurnPageDOM.style.display = "none";
        scan_and_launch();
      } else {
        switchModeBtn.innerText = "当前加载方式: 按钮";
        PAGE.SWITCH_MODE = "Button";
        btnTurnPageDOM.style.display = "block";
      }
    });
    document.body.appendChild(switchModeBtn);
    const sortMasonryBtn = document.createElement("button");
    sortMasonryBtn.classList.add("debug");
    sortMasonryBtn.setAttribute("id", "sort_masonry");
    sortMasonryBtn.innerText = "手动整理布局";
    sortMasonryBtn.style.zIndex = 10004;
    sortMasonryBtn.addEventListener("click", function() {
      if (masonry2)
        masonry2.layout();
    });
    document.body.appendChild(sortMasonryBtn);
    PUT_TORRENT_INTO_MASONRY(_ORIGIN_TL_Node, waterfallNode, true, masonry2);
    const css2 = `

/* 瀑布流主容器 */
div.waterfall{
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  border-radius: 20px;
  height: 100%;

  /* margin: 0 auto; */
  margin: 20px auto;

  transition: height 0.3s;
}

/* 调试按键统一样式 */
button.debug {
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 4px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}  

/* 调试按键1: 显示隐藏原种子列表 */
button#toggle_oldTable {
  top: 10px;
}

/* 调试按键2: Masonry 切换卡片宽度 */
button#btnReLayout {
  top: 40px;
}  

/* 调试按键3: 切换下一页加载方式 */
button#btnSwitchMode {
  top: 70px;
}

/* 调试按键4: Masonry 重新排列 */
button#sort_masonry {
  top: 100px;
}

/* 卡片 */
.card {
  width: ${CARD.CARD_WIDTH}px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  background-color: ${themeColor};
  /* box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); */
  /* margin: 10px; */
  margin: 6px 0;
  
  overflow: hidden;

  cursor: pointer;

  box-shadow: rgba(0, 0, 0, 0.3) 3px 3px 0px, rgba(0, 0, 0, 0.1) -1px -1px 0px;
}
}

.card:hover {
  
}

/* 卡片标题 */
.card-title{
  padding: 2px 0;
}

/* 卡片内部容器 */
.card-holder{
  background-color: rgba(255, 255, 255, 0.5);
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0));
  padding-bottom: 6px;
}

/* 卡片行默认样式 */
.card-line{
  margin-bottom: 1px;

  display: flex;
  justify-content: space-evenly;
  align-items: center;

  height: 20px;
}

/* 卡片标题: 默认两行 */
.two-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  transition: color 0.3s;
}

/* 卡片标题: hover时变为正常 */
.two-lines:hover {
  -webkit-line-clamp: 100;
}

/* 卡片信息: flex 居中 */
.cl-center{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

/* 卡片信息行: 标签行 */
.cl-tags{
  display: flex;
  justify-content: left;
  align-items: center;
  flex-wrap: wrap;

  gap: 2px;
  
  transform: translateX(4px);
  
}

/* 卡片简介总容器 */
.card-details{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  padding-top: 2px;
}

/* 卡片图像div */
.card-image {
  height: 100%;
  position: relative;
  margin-bottom: 2px;
}

/* 卡片图像div -> img标签 */
.card-image img {
  width: 100%;
  object-fit: cover;
}

/* 卡片可选信息 */
.card-alter{
  text-align: center;
  height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
}


/* 置顶 && 免费类型&剩余时间 */
.top_and_free{
  padding: 2px;
  border-radius: 4px;
  margin-bottom: 2px;

  display: flex;
  justify-content: center;
  align-items: center;

  line-height: 11px;
  height: 11px;
  font-size: 10px;
}
._Free{
  color: blue;
  /* background-color: #00e6 */
}

._2XFree{
  color: green;
  /* background-color: #0e0 */
}

/* 卡片索引 */
.card-description{
  padding-left: 4px;
  padding-right: 4px;
}

/* 卡片索引 */
.card-index{
  position: absolute;
  top: 0;
  left: 0;
  padding-right: 9px;
  padding-left: 2px;
  margin: 0;
  height: 20px;
  line-height: 16px;
  font-size: 16px;

  background-color: rgba(0,0,0);
  color: yellow;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;

  display: flex;
  align-items: center;

  pointer-events: none;
}

/* 卡片: 收藏按钮 */
.btnCollet{
  padding: 1px 2px;
  cursor: pointer;
}

/* 卡片: 收藏按钮 */
#turnPage{
  width: 100%;
  height: 32px;
  border-radius: 16px;
  line-height: 20px;
  font-size: 14px;
}

/* 上面是我自己脚本的css */
/* --------------------------------------- */
/* 下面是改进原有的css */

/* 卡片索引 */
#nexus-preview{
  z-index: 20000;
  position: absolute;
  display: none;

  pointer-events: none;
}

/* 临时标签_热门 */
.hot{
  padding: 0 2px;
  border-radius: 8px;
  background: white;
  margin: 2px;
}
/* 临时标签_新 */
.new{
  padding: 0 2px;
  border-radius: 8px;
  background: white;
  margin: 2px;
}
`;
    const style = document.createElement("style");
    style.textContent = css2 + ADD_SITE_EXCLUSIVE_CSS();
    document.head.appendChild(style);
    masonry2 = new Masonry(waterfallNode, {
      itemSelector: ".card",
      columnWidth: ".card",
      gutter: GET_CARD_GUTTER(waterfallNode, CARD.CARD_WIDTH)
    });
    window.addEventListener("resize", function() {
      masonry2.options.gutter = GET_CARD_GUTTER(waterfallNode, CARD.CARD_WIDTH);
      sortMasonry();
    });
    sortMasonry();
    window.masonry = masonry2;
    let debounceLoad;
    window.addEventListener("scroll", function() {
      scan_and_launch();
    });
    debounceLoad = debounce(loadNextPage, PAGE.GAP);
  }

})();
