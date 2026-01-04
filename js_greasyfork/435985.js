// ==UserScript==
// @name         V2EX快捷查看回复
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  V2EX快捷查看回复对象
// @author       xiyue
// @license      MIT
// @match        https://v2ex.com/t/*
// @match        https://www.v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?domain=v2ex.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435985/V2EX%E5%BF%AB%E6%8D%B7%E6%9F%A5%E7%9C%8B%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/435985/V2EX%E5%BF%AB%E6%8D%B7%E6%9F%A5%E7%9C%8B%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const replyWidth = 772;
  const svgIcon = `<svg t="1637731023724" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7157" width="16" height="16"><path d="M438.43 536.09m-41.15 0a41.15 41.15 0 1 0 82.3 0 41.15 41.15 0 1 0-82.3 0Z" p-id="7158" fill="#778087"></path><path d="M258.58 536.09m-41.15 0a41.15 41.15 0 1 0 82.3 0 41.15 41.15 0 1 0-82.3 0Z" p-id="7159" fill="#778087"></path><path d="M618.28 536.09m-41.15 0a41.15 41.15 0 1 0 82.3 0 41.15 41.15 0 1 0-82.3 0Z" p-id="7160" fill="#778087"></path><path d="M747.58 742.48c-0.17 0-1.07 0.67-3.09 2.82l0.32-0.2c0.61-0.53 1.24-1.05 1.8-1.6 0.33-0.33 0.65-0.68 0.97-1.02zM132.38 327l-0.32 0.21c-0.61 0.53-1.25 1-1.8 1.59-0.34 0.33-0.66 0.68-1 1 0.2 0.03 1.09-0.66 3.12-2.8zM279.54 171.77l-0.32 0.2c-0.61 0.53-1.24 1-1.8 1.59-0.34 0.33-0.65 0.68-1 1 0.2 0.05 1.1-0.64 3.12-2.79z" p-id="7161" fill="#778087"></path><path d="M955.14 161.78c-11.46-31.23-38.45-50.89-71.43-53.59-7.3-0.6-14.78-0.18-22.09-0.18H293.89c-10.3 0-20.75 1.35-30.33 5.2-30.19 12.13-50.92 39.18-51.37 72.32-0.31 23.6 0 47.23 0 70.84v6.86H152.5c-10.46 0-20.87 0.21-31 3.33C88 276.85 65.12 307.11 65 342.2c-0.07 24.74 0 49.48 0 74.22V720c0 11.47-0.28 23 3.43 34.09 8 24.05 25.75 41.29 49.18 50.33 10.13 3.91 21.11 4.68 31.88 4.68h88.23c16.82 22.9 33.62 45.81 50.14 68.92l16.68 23.32c6.31 8.82 14.56 14.84 25.88 14.84s19.57-6 25.88-14.84c20.52-28.7 41.19-57.18 62.32-85.42 1.49-2 3-4 4.46-6l89.39-0.83c25.54-0.24 51.09 0 76.63 0h141.45a88 88 0 0 0 39.52-9.34c26.66-13.2 41.76-41.75 41.76-70.75v-75.17h39c9.5 0 19 0.11 28.51 0 28.56-0.31 57.57-15.7 70.67-41.8a84.73 84.73 0 0 0 9-38.66V189.52c-0.01-9.34-0.64-18.91-3.87-27.74zM745.55 744.62c-0.24 0.17-0.5 0.32-0.74 0.48a12.36 12.36 0 0 0-1.11 1l0.79-0.85c-1.22 0.77-2.47 1.48-3.75 2.14A54.14 54.14 0 0 1 735 749c-8 0.54-16.09 0.08-24 0.08H534.32c-22.78 0-45.55 0.25-68.32 0.46l-54.45 0.51h-3.31c-11.55 0.66-19.13 5.89-25.88 14.85l-0.17 0.22c-0.52 0.68-1 1.37-1.53 2.05l-15.22 20.33q-17.69 23.63-35 47.49-18.23-25.26-36.65-50.38L278.61 764q-1.32-1.82-2.7-3.45a30.17 30.17 0 0 0-7.09-6.58l-0.44-0.3-0.29-0.18a27.08 27.08 0 0 0-7.4-3.27c-0.51-0.14-1-0.26-1.56-0.37a29.81 29.81 0 0 0-6.4-0.7h-97.27c-4.56 0-9.17 0.14-13.73-0.11a57.12 57.12 0 0 1-5.63-1.55q-2.06-1.07-4-2.32c-0.62-0.54-1.26-1-1.83-1.62s-1.2-1.24-1.78-1.87c-0.8-1.3-1.56-2.6-2.28-3.92-0.43-1.34-0.81-2.68-1.13-4.05-0.19-3.74-0.09-7.52-0.09-11.26V387c0-15.33-0.15-30.66 0-46 0-0.79 0-1.57 0.08-2.35 0.31-1.38 0.7-2.73 1.13-4.07 0.71-1.32 1.47-2.6 2.24-3.91 0.28-0.3 0.57-0.6 0.85-0.91-0.23 0 0.73-1.27 2-2.14l0.75-0.47c0.39-0.34 0.77-0.69 1.11-1.05l-0.79 0.84c1.22-0.77 2.47-1.48 3.74-2.14a57.12 57.12 0 0 1 5.63-1.55c5.74-0.35 11.57-0.11 17.28-0.11h502.66c23.34 0 46.68-0.11 70 0 1.14 0 2.28 0.05 3.42 0.11a55.61 55.61 0 0 1 5.65 1.56c1.37 0.71 2.71 1.47 4 2.31 0.61 0.54 1.26 1.06 1.83 1.62s1.19 1.24 1.77 1.87c0.8 1.3 1.57 2.6 2.29 3.93 0.42 1.33 0.81 2.67 1.12 4 0.19 3.75 0.09 7.52 0.09 11.26v335.46c0 15.32 0.16 30.66 0 46 0 0.79 0 1.57-0.07 2.36-0.32 1.37-0.7 2.73-1.13 4.07-0.72 1.31-1.47 2.6-2.25 3.9-0.28 0.31-0.56 0.61-0.85 0.91 0.27 0.02-0.69 1.25-1.99 2.12zM892.72 589.4c-0.25 0.17-0.5 0.32-0.75 0.48a13.87 13.87 0 0 0-1.11 1l0.79-0.85c-1.22 0.77-2.47 1.48-3.74 2.14a55.68 55.68 0 0 1-5.95 1.63c-11.38 0.88-23.14 0-34.45 0h-35.68v-244c0-16.06-1.72-31.4-9.56-46-14-26.11-42.76-40.59-71.74-40.65H272.14v-68.41c0-3.77-0.09-7.57 0.1-11.34a50.4 50.4 0 0 1 1.11-4c0.72-1.32 1.47-2.6 2.25-3.91l0.85-0.91c-0.23 0 0.73-1.27 2-2.14l0.75-0.47a14 14 0 0 0 1.11-1.05l-0.79 0.85c1.22-0.77 2.47-1.49 3.75-2.15a57.12 57.12 0 0 1 5.63-1.55c5.73-0.35 11.57-0.11 17.28-0.11h502.66c23.34 0 46.68-0.11 70 0 1.14 0 2.28 0 3.41 0.11a55.08 55.08 0 0 1 5.66 1.56c1.37 0.71 2.71 1.47 4 2.31 0.62 0.54 1.26 1.06 1.83 1.62s1.2 1.24 1.78 1.88c0.8 1.29 1.56 2.59 2.28 3.92 0.43 1.33 0.81 2.68 1.13 4 0.19 3.75 0.09 7.52 0.09 11.26V530c0 15.32 0.15 30.66 0 46 0 0.79 0 1.58-0.08 2.36-0.31 1.37-0.7 2.73-1.13 4.07-0.71 1.31-1.47 2.6-2.24 3.9-0.28 0.31-0.57 0.61-0.85 0.91 0.28 0.06-0.72 1.29-2 2.16z" p-id="7162" fill="#778087"></path><path d="M894.75 587.26c-0.18 0-1.08 0.67-3.1 2.82l0.32-0.2c0.61-0.53 1.25-1 1.8-1.6 0.34-0.28 0.66-0.67 0.98-1.02z" p-id="7163" fill="#778087"></path></svg>`;
  const bgColor = window.getComputedStyle(document.querySelector("#Main .box"), null).backgroundColor;
  const borderColor = window.getComputedStyle(document.querySelector(".cell"), null).borderBottomColor;

  initStyle();
  // 自动加载回复
  async function autoLoadPage() {
    const replyBox = document.querySelector(".reply_content")?.closest(".box");
    if (!replyBox) {
      return;
    }
    const allPage = Array.from(
      document.querySelectorAll(".cell.ps_container:last-child table tr:first-child td a")
    ).map((item) => ({
      index: parseInt(item.innerText),
      url: item.href,
    }));
    document.querySelectorAll(".page_input").forEach((el) => {
      el.removeAttribute("onkeydown");
      el.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          gotoPage(el.value);
        }
      });
    });
    const index =
      parseInt(document.querySelector(".cell.ps_container table tr:first-child td a.page_current")?.innerText) || 1;
    console.log(allPage, index);

    if (!document.querySelector(".cell-page")) {
      const psContainer = replyBox.querySelector(".ps_container:last-child");
      const currentPage = createReplyCell(document, index);
      replyBox.insertBefore(currentPage, psContainer);
    }

    // 加载其他页面
    const promises = [];
    allPage
      .filter((item) => item.index !== index)
      .forEach((item) => {
        promises.push(loadOtherPage(item));
      });
    await Promise.all(promises);

    // 链接回复
    linkReply();
  }
  window.autoLoadPage = autoLoadPage;
  autoLoadPage();

  // 过滤回复元素
  function createReplyCell(target, index) {
    const replyBox = target.querySelector(".reply_content").closest(".box");
    if (replyBox) {
      const currentPageCells = replyBox.querySelectorAll(".cell:not(.ps_container):not(:first-child)");
      const currentPage = document.createElement("div");
      currentPage.classList.add(`cell-page`);
      currentPage.insertAdjacentHTML(
        "afterbegin",
        `<div style="padding:0; border-bottom: 1px solid var(--box-border-color);"></div>`
      );
      currentPage.setAttribute("data-page", index);
      currentPage.append(...currentPageCells);
      return currentPage;
    } else {
      return target;
    }
  }
  // 加载其他页面
  async function loadOtherPage(item) {
    if (document.querySelector(`[data-page="${item.index}"]:not(.page-error)`)) {
      console.log(`页面 ${item.index} 已加载`);
      return;
    }
    if (document.querySelector(`.page-error[data-page="${item.index}"]`)) {
      document.querySelector(
        `.page-error[data-page="${item.index}"] .reply_content`
      ).innerText = `第 ${item.index} 页重新加载中...`;
    }
    const dom = await fetchPage(item.url, item.index);
    const replyPage = createReplyCell(dom, item.index);
    let allPage = Array.from(document.querySelectorAll(".cell-page"));
    let insert = false;
    document.querySelector(`.page-error[data-page="${item.index}"]`)?.remove();
    for (let index = 0; index < allPage.length; index++) {
      const el = allPage[index];
      if (item.index < parseInt(el.getAttribute("data-page"))) {
        el.insertAdjacentElement("beforebegin", replyPage);
        insert = true;
        break;
      }
    }
    if (!insert) {
      allPage = allPage.reverse();
      for (let index = 0; index < allPage.length; index++) {
        const el = allPage[index];
        if (item.index > parseInt(el.getAttribute("data-page"))) {
          el.insertAdjacentElement("afterend", replyPage);
          break;
        }
      }
    }
  }
  // 请求页面
  async function fetchPage(url, index) {
    const domparse = new DOMParser();
    try {
      const html = await (await fetch(url)).text();
      return domparse.parseFromString(html, "text/html");
    } catch (err) {
      console.error("请求页面出错");
      console.error(err);
      return domparse
        .parseFromString(
          `<div class="cell page-error" data-page="${index}">
  <div class="reply_content" style="text-align: center;">
    第 ${index} 页加载失败 <a href="javascript:void(0)" class="re_try" onclick="window.autoLoadPage()">重新加载</a>
  </div>
</div>`,
          "text/html"
        )
        .querySelector(".cell");
    }
  }
  // 链接回复
  function linkReply() {
    const links = Array.from(document.querySelectorAll(".cell-page .reply_content a"));
    links
      .filter((el) => el.getAttribute("href").startsWith("/member/"))
      .forEach((el) => {
        const curCell = el.closest(".cell");
        const no = parseInt(curCell.querySelector(".no").innerText);
        const memberLink = el.getAttribute("href");
        const memberId = memberLink.split("/")[2];
        const quoteIndex = getIndex(curCell, memberId);
        const floors = Array.from(document.querySelectorAll(".cell-page .cell")).filter((el) => {
          return parseInt(el.querySelector(".no").innerText) < no;
        });
        const quoteCell = floors[quoteIndex];
        let cell;
        if (quoteCell && quoteCell.querySelector("table tbody td strong a").innerText === el.innerText) {
          cell = quoteCell;
        } else {
          cell = floors
            .reverse()
            .find((item) => item.querySelector("table tbody td strong a").innerText === el.innerText);
        }
        if (cell) {
          const floor = createFloor(cell);
          const replyContent = curCell.querySelector(".reply_content");
          replyContent.childNodes.forEach((node) => {
            if (node.nodeType === 3 && node.nodeValue === "@") {
              node.remove();
            }
          });
          const tempNode = document.createElement("div");
          tempNode.className = "show-reply";
          tempNode.setAttribute("onclick", `fixedReply(event, this)`);
          tempNode.appendChild(floor);
          tempNode.appendChild(document.createRange().createContextualFragment(svgIcon));
          el.href = `javascript:void(0)`;
          el.insertAdjacentText("afterbegin", "@");
          replyContent.insertBefore(tempNode, el);
          tempNode.insertAdjacentElement("afterbegin", el);
          const idWidth = tempNode.getBoundingClientRect().width;
          floor.style.setProperty("--offset", `${idWidth / 2}px`);
        }
      });
  }
  // 创建楼层
  function createFloor(cell) {
    const cloneCell = cell.cloneNode(true);
    const tempNode = document.createElement("div");
    tempNode.className = "fixed-reply";
    tempNode.setAttribute("onclick", `fixedReply(event, this)`);
    tempNode.appendChild(cloneCell);
    return tempNode;
  }

  window.fixedReply = (event, target) => {
    event.stopPropagation();
    const targetElement = target.classList.contains("fixed-reply") ? target : target.querySelector(".fixed-reply");
    clearFixed(targetElement);
    recursionAddClass(targetElement);
  };

  function clearFixed(excludeElement = null) {
    document.querySelectorAll(".fixed-reply.fixed").forEach((el) => {
      if (el !== excludeElement) {
        el.classList.remove("fixed");
      }
    });
  }

  function recursionAddClass(el) {
    el.classList.add("fixed");
    const closest = el.parentNode.closest(".fixed-reply");
    if (closest) {
      recursionAddClass(closest);
    }
  }

  globalClick();
  function globalClick() {
    document.addEventListener("click", function (event) {
      if (event.target.classList.contains("no")) {
        gotoReply(event.target.innerText);
      }
      clearFixed();
    });
  }

  function getIndex(floor, memberId) {
    const replyContent = floor.querySelector(".reply_content").innerHTML;
    const newReg = new RegExp(`@<a href="/member/${memberId}">${memberId}</a>\\s+#\\d+`);
    const regMatch = newReg.exec(replyContent);
    if (regMatch) {
      return parseInt(regMatch[0].split("#")[1]) - 1;
    } else {
      return -1;
    }
  }

  function initStyle() {
    const style = document.createElement("style");
    style.innerHTML = `.fixed-reply {
  transition: all 300ms;
  transform: translateY(-10px);
  pointer-events: none;
  opacity: 0;
  width: ${replyWidth}px;
  box-sizing: border-box;
  position: absolute;
  bottom: 30px;
  left: 0px;
  background: ${bgColor};
  border-radius: 8px;
  box-shadow: 0 0 18px rgb(0 0 0 / 10%);
  border: solid 1px ${borderColor};
  user-select: auto;
  z-index: 1;
  --offset: 30px;
}
  .fixed-reply .cell{
  border-radius: 10px;
  background: ${bgColor};
}
  .fixed-reply::after{
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid ${borderColor};
  border-left-color: transparent;
  border-top-color: transparent;
  left: var(--offset);
  bottom: -6px;
  background: ${bgColor};
  transform: rotate(45deg);
  z-index: -1;
  box-shadow: 0 0 18px rgb(0 0 0 / 10%);
}
  .show-reply {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
}
  .show-reply .fixed {
    transform: translateY(0);
    pointer-events: auto;
    opacity: 1;
  }
  .show-reply:hover>.fixed-reply{
  transform: translateY(0);
  pointer-events: auto;
  opacity: 1;
}
  .show-reply:hover:before {
  content: "";
  position: absolute;
  width: 160px;
  height: 10px;
  left: 0;
  bottom: 100%;
}
  .cell {
  transition:background-color 0.5s;
}
  .cell.highlight {
  background-color: #FFE97F;
}`;
    document.head.appendChild(style);
  }

  // 增加每日自动签到
  async function autoSign() {
    const singin = document.querySelector(`[href="/mission/daily"]`);
    if (singin) {
      try {
        const res = await fetch("/mission/daily");
        if (res.status === 200) {
          const domparse = new DOMParser();
          const doc = domparse.parseFromString(await res.text(), "text/html");
          const url = doc.querySelector(`[value="领取 X 铜币"]`).getAttribute("onclick");
          const regex = /location\.href\s*=\s*['"]([^'"]+)['"]/;
          const match = url.match(regex);
          const extractedUrl = match ? match[1] : null;
          if (extractedUrl) {
            const res = await fetch(extractedUrl);
            if (res.status === 200) {
              singin.innerText = "已签到";
            } else {
              console.log(`签到失败,状态码:${res.status}`);
              console.error(res);
              throw new Error("签到失败");
            }
          }
        } else {
          throw new Error("签到失败");
        }
      } catch (err) {
        console.log("签到失败");
        console.log(err);
        singin.innerText = "签到失败";
      }
    }
  }

  // 增加处理图床url的逻辑
  function replaceImageBed() {
    const imgBedList = ["https://imgur.com", "https://i.imgur.com"];
    const findImgBed = (item) => {
      for (let i = 0; i < imgBedList.length; i++) {
        if (item.href.startsWith(imgBedList[i])) {
          return true;
        }
      }
      return false;
    };

    document.querySelectorAll("a").forEach((item) => {
      if (findImgBed(item) && item.href === item.innerText) {
        console.log(item);
        const a = document.createElement("a");
        a.href = item.href;
        const img = document.createElement("img");
        img.classList.add("imgbed");
        img.style.maxWidth = "100%";
        img.src = item.href + ".png";
        a.appendChild(img);
        item.replaceWith(a);
      }
    });
  }

  // 跳转到对应楼层
  async function gotoReply(index) {
    const find = Array.from(document.querySelectorAll(".cell-page .cell .no")).find((item) => item.innerText === index);
    if (find) {
      const cell = find.closest(".cell");
      const floorTop = cell.getBoundingClientRect().top;
      cell.addEventListener("transitionend", () => {
        setTimeout(() => {
          cell.classList.remove("highlight");
        }, 1000);
      });
      await scrollToAndWait(window.scrollY + floorTop - 140);
      cell.classList.add("highlight");
    }
  }

  function scrollToAndWait(top) {
    return new Promise((res) => {
      const tolerance = 4;
      window.scrollTo({ top: top, behavior: "smooth" });
      const check = () => {
        const current = window.scrollY;
        if (Math.abs(current - top) <= tolerance) {
          res();
        } else {
          requestAnimationFrame(check);
        }
      };
      requestAnimationFrame(check);
    });
  }

  autoSign();
  replaceImageBed();
})();
