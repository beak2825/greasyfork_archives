// ==UserScript==
// @name         GCBT显示预览图和磁力链接
// @namespace    http://tampermonkey.net/
// @version      2.11
// @description  列表页显示全部预览图和磁力链接
// @author       You
// @match        https://gcbt.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gcbt.net
// @require      https://update.greasyfork.org/scripts/546691/1646687/GM_Preview.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      www.rmdown.com
// @connect      bt.azvmw.com
// @connect      bt.ivcbt.com
// @connect      bt.bxmho.cn
// @connect      www.82bt.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520364/GCBT%E6%98%BE%E7%A4%BA%E9%A2%84%E8%A7%88%E5%9B%BE%E5%92%8C%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/520364/GCBT%E6%98%BE%E7%A4%BA%E9%A2%84%E8%A7%88%E5%9B%BE%E5%92%8C%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 修复夜间模式
  let is_ripro_dark = false;
  const setDarkMode = (bool) => {
    is_ripro_dark = bool;
    document.body.classList.toggle("ripro-dark", is_ripro_dark);
    GM_setValue("is_ripro_dark", is_ripro_dark ? "1" : "0");
  };
  setDarkMode(GM_getValue("is_ripro_dark") === "1");
  document.querySelectorAll(".tap-dark").forEach(($button) => {
    $button.addEventListener("click", (e) => {
      setDarkMode(!is_ripro_dark);
      fetch("https://gcbt.net/wp-admin/admin-ajax.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          is_ripro_dark: is_ripro_dark ? "1" : "0",
          action: "tap_dark",
        }).toString(),
      });
      e.stopPropagation();
    });
  });

  // 列表页
  const $postsWrapper = document.querySelector(".posts-wrapper");
  if ($postsWrapper) {
    const DATA_VERSION = 4;

    const btLinkRules = [
      "//www.rmdown.com/link.php\\?hash=[0-9a-z]+",
      "//bt.azvmw.com/list.php\\?name=[0-9a-z]+",
      "//bt.ivcbt.com/list.php\\?name=[0-9a-z]+",
      "//bt.bxmho.cn/list.php\\?name=[0-9a-z]+",
    ].map((pattern) => new RegExp(pattern, "i"));

    const bt82LinkRule = new RegExp("//www.82bt.com/(?:cao.php|dlink.php)\\?hash=([0-9a-z]+)", "i");

    const preview = new window.GM_Preview();

    // 列表
    const list = Array.from($postsWrapper.querySelectorAll("article"))
      .map(($item) => {
        const $title = $item.querySelector(".entry-title a");
        const $time = $item.querySelector(".entry-footer time");
        return {
          title: $title?.textContent,
          url: $title?.href,
          time: $time?.textContent,
          dateTime: $time?.dateTime,
        };
      })
      .filter((item) => !!item.url);

    const $list = document.createElement("div");
    $list.className = "list";
    $list.innerHTML = list
      .map(({ title, url, time, dateTime }, index) => {
        return `
          <div class="col-lg-12" data-index="${index}">
            <article class="post post-list">
              <div class="entry-wrapper">
                <header class="entry-header">
                  <h2 class="entry-title">
                    <a target="_blank" href="${url}">${title}</a>
                  </h2>
                </header>
                <div class="entry-content">
                  <div class="images"></div>
                </div>
                <div class="entry-footer">
                  <ul class="metas">
                    <li><time datetime="${dateTime}"><i class="fa fa-clock-o"></i> ${time}</time></li>
                  </ul>
                  <ul class="downloads"></ul>
                </div>
              </div>
            </article>
          </div>
        `;
      })
      .join("");
    $postsWrapper.replaceWith($list);

    window.onImgError = (e) => {
      const reload = parseInt(e.target.dataset.reload);
      if (reload < 3) {
        setTimeout(() => {
          e.target.dataset.reload = reload + 1;
          e.target.src = e.target.dataset.src + `?t=${Date.now()}`;
        }, 1000);
      }
    };

    list.forEach(async (item, index) => {
      const $item = $list.querySelector(`[data-index="${index}"]`);
      const $images = $item.querySelector(".images");
      const $metas = $item.querySelector(".metas");
      const $downloads = $item.querySelector(".downloads");

      $images.innerHTML = '<div class="loading">获取详情页数据...</div>';
      const { size, duration, images, magnets, links } = await fetchDetail(item.url);

      // 影片大小
      if (size) $metas.innerHTML += `<li><i class="fa fa-arrow-circle-o-down"></i> ${size}</li>`;

      // 影片时长
      if (duration) $metas.innerHTML += `<li><i class="fa fa-play-circle-o"></i> ${duration}</li>`;

      // 所有图片
      $images.innerHTML =
        images.length > 0
          ? images
              .map((src, index) => {
                return `<img
                  src="${src}"
                  data-index="${index}"
                  data-src="${src}"
                  data-reload="0"
                  referrerpolicy="no-referrer"
                  loading="lazy"
                  onerror="window.onImgError"
                >`;
              })
              .join("")
          : `<div class="empty">无图片</div>`;
      $images.onclick = (e) => {
        const { index } = e.target.dataset;
        if (index) preview.show(images, parseInt(index));
      };

      // 磁力链接
      const $magnets = magnets.map(
        (magnet, i) => `<li><a target="_blank" href="${magnet}" class="magnet"><i class="fa fa-magnet"></i> 磁力${i + 1}</a><li>`
      );

      // 下载链接
      const $links = links.map((link, i) => `<li><a target="_blank" href="${link}" class="link"><i class="fa fa-link"></i> 链接${i + 1}</a><li>`);

      $downloads.innerHTML = `${$magnets.join("")}${$links.join("")}`;
    });

    // 获取详情页
    async function fetchDetail(url) {
      let detail = GM_getValue(url);
      if (detail && detail.version === DATA_VERSION && !location.search.includes("nocache")) return detail;

      const $document = await fetch(url)
        .then((response) => response.text())
        .then((text) => new DOMParser().parseFromString(text, "text/html"));
      $document.querySelectorAll("style, script").forEach(($el) => $el.remove());
      const $content = $document.querySelector(".entry-content, .entry-wrapper, .article-content") || $document;

      // 影片大小
      const size = $content.textContent.match(/【(?:影片|档案|檔案|资源|資源)(?:大小|容量)】\s*(?:：|:)*\s*([0-9.]+\s*(?:MB|GB|M|G|T|TB))/i)?.[1];

      // 影片时长
      const duration = $content.textContent.match(/【(?:影片|资源|資源)(?:时间|時間|时长|時長)】\s*(?:：|:)*\s*(\d+:\d+(:\d+)?)/i)?.[1];

      // 所有图片
      let images = Array.from($content.querySelectorAll("img"))
        .map(($img) => $img.getAttribute("src") || $img.getAttribute("data-src"))
        .filter(Boolean);

      // 磁力链接
      const magnets = [];

      // 下载链接
      const links = [];

      // 有磁力哈希信息，使用磁力哈希
      const hash = $content.textContent.match(/(?:^|：|:|；|;|】|\])\s*([0-9a-z]{40})/i)?.[1];
      if (hash) magnets.push(`magnet:?xt=urn:btih:${hash}`);

      // 明文磁力链接
      const magnet = $content.innerHTML.match(/magnet:\?xt=urn:btih:[0-9a-z]{40}/gi)?.[0];
      if (magnet) magnets.push(magnet);

      // 获取下载链接中转页面，提取磁力哈希
      for (let rule of btLinkRules) {
        const match = $content.innerHTML.match(rule)?.[0];
        if (match) {
          const url = "https:" + match;
          const hash = await getMagnetHash(url);
          if (hash) magnets.push(`magnet:?xt=urn:btih:${hash}`);
          else links.push(url);
        }
      }

      // 82bt特殊处理
      const bt82Code = $content.innerHTML.match(bt82LinkRule)?.[1];
      if (bt82Code) {
        const magnet = await get82btMagnet(bt82Code);
        if (magnet) magnets.push(magnet);
      }

      // 其他链接
      Array.from($content.querySelectorAll("a"))
        .map(($a) => $a.href)
        // 去除无效链接、复制链接和分享链接
        .filter((href) => href.trim().length > 0 && !href.includes("javascript:") && !/\?share=/.test(href))
        .forEach((href) => links.push(href));

      detail = {
        version: DATA_VERSION,
        size,
        duration,
        images: [...new Set(images)],
        magnets: [...new Set(magnets.map((magnet) => magnet.toLowerCase()))],
        links: [...new Set(links.map((link) => link.replace(/^(https|http):/, "")))].map((link) => `https:${link}`),
      };
      GM_setValue(url, detail);
      return detail;
    }

    // 获取下载链接中转页面，提取磁力哈希
    function getMagnetHash(url) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url,
          method: "GET",
          onload: (xhr) => resolve(xhr.responseText.match(/[0-9a-z]{40}/gi)?.[0]),
          onerror: () => resolve(),
        });
      });
    }

    // 获取82bt磁力
    function get82btMagnet(code) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: `https://www.82bt.com/downt-m.php`,
          method: "POST",
          headers: {
            "accept": "*/*",
            "Referer": `https://www.82bt.com/dlink.php?hash=${code}`,
            "Origin": "https://www.82bt.com",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: new URLSearchParams({ code }).toString(),
          onload: (xhr) => resolve(xhr.responseText),
          onerror: () => resolve(),
        });
      });
    }

    GM_addStyle(`
      :root {
        --border-color: #dcdfe6;
      }
      .ripro-dark {
        --border-color: #4c4d4f;
      }

      .post.post-list {
        padding: 0;
        border: 0.5px solid var(--border-color);
        box-shadow: 0px 0px 6px rgba(0, 0, 0, .12);
      }

      .entry-header {
        padding: 15px 10px;
        /*border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-left: 5px solid #67c23a;*/
        border-bottom: 0.5px solid var(--border-color);

        & .entry-title {
          font-size: 16px;
        }
      }

      .entry-content {
        padding: 10px;

        & .images {
          display: flex;
          flex-flow: row wrap;
          gap: 10px;

          & .loading, & .empty {
            flex: auto;
            padding: 30px;
            text-align: center;
            font-size: 14px;
          }

          & img {
            width: 178px;
            min-height: 84px;
            max-height: 178px;
            object-fit: contain;
            border: 0.5px solid var(--border-color);
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              opacity: 0.5;
            }
          }
        }
      }

      .entry-footer {
        display: flex;
        padding: 10px;
        border-top: 0.5px solid var(--border-color);

        & ul {
          margin: 0;
          padding: 0;
          display: flex;
          list-style: none;
          font-size: 12px;

          &.metas li + li {
            margin-left: 10px;
          }
          &.downloads li + li {
            margin-left: 5px;
          }
        }

        & a {
          margin: 0;
          color: #ffffff !important;

          &.magnet {
            background: #67c23a;
            &:hover { background: #95d475; }
            &:active { background: #529b2e; }
          }

          &.link {
            background: #409eff;
            &:hover { background: #79bbff; }
            &:active { background: #337ecc; }
          }
        }

        & .metas {
          flex: auto;
        }
      }
    `);
  }
})();
