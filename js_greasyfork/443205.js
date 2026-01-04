// ==UserScript==
// @name         JavDB Toolbox(Revise)
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  JavDB 工具箱：1. 添加搜索在线观看资源按钮 2. 添加到 JavLibrary 等站点跳转按钮 3. 过滤肛交标签中的M男和扶她（未来会添加自定义）；4. 增加免梯子访问JavLibrary；推荐结合 `JavDB 添加跳转在线观看` 食用。此脚本为naughtyEvenstar创作，版权属原作者所有，感谢其作品。本人只是增加了免梯子网址访问JavLibrary自用，如有兴趣者可自行下载。
// @author       testqdg
// @match        https://javdb.com/*
// @include      /^https:\/\/(\w*\.)?javdb(\d)*\.com.*$/
// @icon         https://javdb.com/favicon-32x32.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443205/JavDB%20Toolbox%28Revise%29.user.js
// @updateURL https://update.greasyfork.org/scripts/443205/JavDB%20Toolbox%28Revise%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const openWindowWithPost = (url, data) => {
    var form = document.createElement("form");
    form.target = "_blank";
    form.method = "POST";
    form.action = url;
    form.style.display = "none";

    for (var key in data) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = data[key];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const { pathname, search } = location;

  if (pathname.startsWith("/v/")) {
    const tmpl = `
            <div class="panel-block generated">
                <div class="columns">
                <div class="column">
                    <div class="buttons are-small review-buttons" />
                </div>
                </div>
            </div>`;

    [...document.querySelectorAll(".movie-panel-info div.panel-block")]
      .pop()
      .insertAdjacentHTML("afterend", tmpl);

    const buttonRowEle = document.querySelector(".generated .review-buttons");

    const registerButton = (text, onClick, hint) => {
      const btnEle = document.createElement("a");
      btnEle.className = "button is-info is-outlined";
      btnEle.addEventListener("click", onClick);
      btnEle.textContent = text;
      buttonRowEle.appendChild(btnEle);
      if (hint) btnEle.title = hint;
      return btnEle;
    };

    const movieCode = document.querySelector(
      ".panel-block.first-block > span"
    ).textContent;
    const movieTitle = document.querySelector(
      ".title.is-4 > strong"
    ).textContent;
    const isFC2 = movieCode.startsWith("FC2");
    const isUncensored = isFC2 || movieTitle.includes("無碼");
    const searchType = isUncensored ? "uncensored" : "censored";
    const searchKeyword = isFC2 ? movieCode.slice(4) : movieCode;

    const btn7mmtv = registerButton(
      "🔎 7MMTV",
      () => {
        openWindowWithPost(
          "https://7mmtv.tv/zh/searchform_search/all/index.html",
          {
            search_keyword: searchKeyword,
            search_type: searchType,
            op: "search",
          }
        );
      },
      "适合搜索骑兵和fc2"
    );
    const btnAvgle = registerButton("🔎 Avgle", () =>
      window.open(
        `https://avgle.com/search/videos?search_query=${searchKeyword}&search_type=videos`
      )
    );
    const btnJavBigo = registerButton("🔎 JavBigo", () =>
      window.open(`https://javbigo.com/?s=${searchKeyword}`)
    );
    const btnJavLib = registerButton("🔎 JavLibrary", () =>
      window.open(
        `https://www.javlibrary.com/cn/vl_searchbyid.php?keyword=${searchKeyword}`
      )
    );
    const btnJavLib1 = registerButton("🔎 JavLibNoproxy", () =>
      window.open(
        `https://www.o58c.com/cn/vl_searchbyid.php?keyword=${searchKeyword}`
      )
    );
  } else if (pathname.startsWith("/tags")) {
    if (search.includes(`c5=74`) /* 肛交 */) {
      console.log("tags: anal detected");

      const blockedKeywords = ["男の娘", "雄母", "女装", "前立腺", "M男"];

      const blockedTags = [
        "c1=63", // M男
        "c1=277", // 男同性恋
        "c3=192", // 女装人妖
        "c4=147", // 变性者
      ];

      setTimeout(async () => {
        const items = [...document.querySelectorAll(`.grid-item.column`)];
        for (const item of items) {
          const a = item.children[0];
          const { href, title } = a;
          let shouldBlock = false;

          if (blockedKeywords.some((keyword) => !!title.match(keyword))) {
            shouldBlock = true;
          } else {
            const resp = await fetch(href);
            const text = await resp.text();
            const tags = new Set(text.match(/(?!tags\?)c\d=\d+/g));
            shouldBlock = blockedTags.some((tag) => tags.has(tag));
          }

          if (shouldBlock) {
            console.log(`blocked`, title, href);
            const children = [...a.children];
            children.forEach((ele) => {
              if (ele.classList.contains("uid")) {
                ele.textContent = "BLOCKED";
              } else {
                ele.style.visibility = "hidden";
              }
            });
            item.style.pointerEvents = "none";
          }
          await sleep(2000 + Math.random * 1000);
        }
      });
    }
  }
})();
