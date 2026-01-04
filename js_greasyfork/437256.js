// ==UserScript==
// @icon         https://finder.susy.mdpi.com/dist/images/ico/apple-touch-icon-57-precomposed.png
// @name         Susy-Find-Reviewer
// @namespace    rachpt.cn
// @version      1.0.1
// @description  mdpi finder 邀请审稿人过滤工具
// @author       rachpt
// @license      MIT License
// @connect      finder.susy.mdpi.com
// @match        https://finder.susy.mdpi.com/reviewer/?*
// @require      https://cdn.staticfile.org/jquery/1.9.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/437256/Susy-Find-Reviewer.user.js
// @updateURL https://update.greasyfork.org/scripts/437256/Susy-Find-Reviewer.meta.js
// ==/UserScript==

(async function () {
  ("use strict");
  console.log("---UserScript-loaded---");

  // 全局状态机
  const STATUS = {
    ok: 0,
    next: 0,
    page: 0,
    match: 0,
    loading: false,
  };

  // 配置信息, 持久化存储
  const OPTIONS = [
    { id: "offset", title: "夏令时/冬令时(小时)", value: 6, max: 12 },
    { id: "duration", title: "最近N天可邀请", value: 5, max: 20 }, // 过滤 5 天内
    { id: "minCount", title: "一次最少过滤条数", value: 10, min: 3 },
    // { id: "minHIndex", title: "最小 HIndex 值", value: 3, min: 1, max: 50 },
  ];

  // 获取配置项
  const getOption = (id) => {
    const f = OPTIONS.filter((o) => o.id.toLowerCase() === id.toLowerCase());
    if (f.length) return f[0].value;
    return null;
  };

  // 设置配置项
  const setOption = (id, value) => {
    const f = OPTIONS.filter((o) => o.id.toLowerCase() === id.toLowerCase());
    if (f.length) return (f[0].value = value);
    return null;
  };

  // 加载持久化数据
  const loadStoreValue = async () => {
    for (const o of OPTIONS) {
      const value = await GM_getValue(o.id, null);
      if (value) setOption(o.id, value);
    }
  };

  // 菜单设置展示区
  const addSettingMenu = (html) => {
    const nav = $("body > section > div > div.breadcrumb-section > ol");
    if ($("li#my-menu-group").length === 0)
      nav.append(`<li id="my-menu-group">${html}</li>`);
    else {
      $("li#my-menu-group").remove();
      nav.append(`<li id="my-menu-group">${html}</li>`);
    }
  };

  // 页面添加过滤按钮
  const addFilterBtn = () => {
    const btn = `<button id="my-filter" disabled class="btn btn-lg btn-outline-success" type="button">过滤</button>`;
    const btnPos = `#search-section-form > div:last-child > div:last-child > div:last-child`;
    if ($(btnPos).find("button").length === 2) {
      $(btnPos).prepend(btn);
      return true;
    }
    return false;
  };

  // 页面添加状态展示
  const addStatusDisplay = () => {
    const span = `\
<span
  id="my-status"
  style="display: block;color: white;background-color: #007bff;font-size: 10px;line-height: 14px;border: 1px solid #ed1c24;border-radius: 4px;margin-top: 10px;"
>
  <ul>
    可邀请<li id="my-status-ok">0</li>
    <hr style="margin:0;border-top: 1px solid white" />
    非现在<li id="my-status-next">0</li>
    <hr style="margin:0;border-top: 1px solid white" />
    <li id="my-status-loading">稍等</li>
  </ul>
</span>`;

    if (!$("div.common-right-button").find("span").length) {
      $("div#scrolltop").after(span);
      return true;
    }
    return false;
  };

  // 更新渲染设置菜单
  const updateSettingMenu = async () => {
    let html = `<i style="display: inline-block; min-width: 100px"></i>`;
    await loadStoreValue();
    for (const { id, title, value, min = 0, max = 100 } of OPTIONS) {
      html += `\
<label for="my-menu-${id}" style="margin-right: 2px">${title}</label
><input
  id="my-value-${id}"
  name="my-menu-${id}"
  type="number"
  min="${min}"
  max="${max}"
  step="1"
  value="${value}"
  style="
    line-height: 10px;
    margin-right: 10px;
    width: 48px;
    height: 14px;
    border: 1px solid #004dff9c;
    color: black;
  "
/>`;
    }
    addSettingMenu(html);

    for (const { id } of OPTIONS) {
      $(`input#my-value-${id}`).change(function () {
        const value = +$(this).val();
        GM_setValue(id, value);
        setOption(id, value);
        return null;
      });
    }
  };

  // 过滤 html 中的外部资源
  const htmlDeleteLink = (html) => {
    return html.replaceAll(/src=".*?"/gi, "");
  };

  // 抓取页面信息
  const grabNextPageItems = (url) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url,
        method: "GET",
        onerror: (error) => {
          console.log(url);
          console.log("page have error:", error);
          reject(error);
        },
        onload: ({ responseText }) => {
          const html = htmlDeleteLink(responseText);
          resolve($(html).find("div.col-md-8.col-lg-9 div.job-ad-item"));
        },
      });
    });
  };

  // 计算下一页的链接
  const calcCurrentUrl = (page) => {
    const url = window.location.href;
    if (url.match(/page=(\d+)/)) return url.replace(/page=\d+/, `page=${page}`);

    return `${url}&page=${page}`;
  };

  // 通过Susy查询一个 hashKey, 用于后续查询 审稿人邀请频率
  const queryHashKey = () =>
    new Promise((resolve, reject) => {
      const url =
        "https://susy.mdpi.com/user/managing/status/submitted?form[status_ids][]=8";
      GM_xmlhttpRequest({
        url,
        method: "GET",
        onerror: (error) => {
          console.error("have error:", error);
          reject(error);
        },
        onload: ({ status, responseText }) => {
          if (status !== 200) {
            $("li#my-status-loading").text("异常!!!");
            $("span#my-status").css("background-color", "red");
            const loginUrl =
              "https://login.mdpi.com/login?_target_path=https://susy.mdpi.com/user/login?authAll=true";
            window.open(loginUrl, "_blank").focus();
            return null;
          }
          const doc = new DOMParser().parseFromString(
            htmlDeleteLink(responseText),
            "text/html"
          );
          const hashUrl = doc.querySelector(
            "#manuscripts-list > div > div.content > table > tbody > tr:nth-child(1) > td:nth-child(4) > span > a"
          ).href;
          resolve(hashUrl.split("/").pop().toString());
          $("li#my-status-loading").text("初始化");
        },
      });
    });

  // 查询默认的邀请周期(15, 30, 90)
  const queryDefaultDelta = (email, hashKey) => {
    const url = `https://susy.mdpi.com/user/reviewer/checking/${hashKey}?email=${email}`;
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url,
        method: "GET",
        onerror: (error) => {
          console.error("have error:", error);
          reject({ email: email, error: error });
        },
        onload: ({ responseText: html }) => {
          if (html.search("Up to one per month") > 0) resolve(30); // 一个月一次
          else if (html.search("Up to one every three months") > 0)
            resolve(90); // 三个月一次
          else resolve(15); // 半个月一次
        },
      });
    });
  };

  // 提取节点文本内容
  const getTextContent = (n) => (n.length ? n[0].innerText.trim() : "");
  // 判断上次邀请时间

  const getLastDate = (add, iDate) => {
    if (!iDate) return null; // 无邀请记录, 设置下次邀请时间为null
    // if (iDate.search("reminded") > -1) return new Date(add);  // 暂时不考虑
    return new Date(iDate.match(/\d+ \w+ \d+ \d+:\d+:\d+/i)[0]);
  };

  const getThisDelta = async (s, email) => {
    if (s.search("Declined") > -1) {
      const expText = "The paper is not in my area of expertise";
      if (s.search("conflicts") > -1) return 10;
      else if (s.search(expText) > -1) return 10;
    }
    // 查询默认频率间隔
    return await queryDefaultDelta(email, hashKey);
  };

  // 查询上次邀请时间与状态
  const queryEmailInviteHst = (node) => {
    const emailPos = `div > span > small.clipboard`;
    const email = node.querySelector(emailPos).dataset.clipboardText;

    const sAdd = `table > tbody > tr:nth-child(1) > td:nth-child(4)`; //添加
    const sDate = `table > tbody > tr:nth-child(1) > td:nth-child(5)`; //邀请
    const sStatus = `table > tbody > tr:nth-child(1) > td:nth-child(3)`; //状态
    const url = `https://finder.susy.mdpi.com/reviewer/susy_invitation_history/${email}`;
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url,
        method: "GET",
        onerror: (error) => {
          console.log(url);
          console.log("page have error:", error);
          reject(error);
        },
        onload: async ({ responseText }) => {
          const html = `<!DOCTYPE html><html><body>${htmlDeleteLink(
            responseText
          )}</body></html> `;
          const textAdd = getTextContent($(html).find(sAdd));
          const textDate = getTextContent($(html).find(sDate));
          const textStatus = getTextContent($(html).find(sStatus));
          const delta = await getThisDelta(textStatus, email);
          resolve({
            lastDate: getLastDate(textAdd, textDate),
            email,
            delta,
            node,
          });
        },
      });
    });
  };

  // 当前页面节点
  const grabCurrentPageItems = () => $('div[class^="job-ad-item reviewer_"]');

  // 计算时间是否符合要求
  const calcSatisfy = (lastDate, delta) => {
    if (!lastDate) return { isNow: false, isNext: false, inviteTime: "-" };
    const next = new Date();
    next.setDate(next.getDate() + (getOption("duration") || 0)); // 偏移天数
    const now = new Date();
    const iTime = new Date(lastDate);
    iTime.setDate(iTime.getDate() + delta); // 日期偏移(天)
    iTime.setHours(iTime.getHours() + (getOption("offset") || 0)); // 时间偏移(小时)
    return {
      isNow: now >= iTime, // 现在可以邀请
      isNext: next >= iTime, // 未来几天可以邀请
      inviteTime: `${iTime.toLocaleDateString()} ${iTime.toLocaleTimeString()}`,
    };
  };

  const calcEmailParentNode = (selector) => {
    const node = document.querySelector(selector);
    try {
      const oNode = node.parentNode.parentNode.parentNode;
      // 大傻叉, job-ad-item 里面内嵌有 job-ad-item
      if (oNode.parentNode.childElementCount === 1) return oNode.parentNode;
      else return oNode;
    } catch (e) {
      console.log(selector, e);
    }
    return null;
  };

  // 处理后续新加载页面符合要求节点的样式
  const dealNextNode = (isNow, isNext, inHtml, selector, node) => {
    if (isNow) {
      STATUS.ok++;
      $(node)
        .find(selector)
        .parent()
        .css("backgroundColor", "lightgreen")
        .append(inHtml);
      return true;
    } else if (isNext) {
      STATUS.next++;
      $(node)
        .find(selector)
        .parent()
        .css("backgroundColor", "pink")
        .append(inHtml);
      return true;
    }
    return null;
  };
  // 处理当前页符合要求节点的样式
  const dealCurrentNode = (isNow, isNext, inHtml, selector) => {
    if (isNow) {
      STATUS.ok++;
      $(selector).parent().css("backgroundColor", "lightgreen").append(inHtml);
    } else if (isNext) {
      STATUS.next++;
      $(selector).parent().css("backgroundColor", "pink").append(inHtml);
    } else {
      calcEmailParentNode(selector)?.remove();
    }
  };

  // 处理一页, 返回符合要求条数
  const handleOnePage = async (page, nextPage = true) => {
    const count = STATUS.ok + STATUS.next;
    STATUS.page = page;
    const url = calcCurrentUrl(page);
    const resItems = nextPage
      ? await grabNextPageItems(url)
      : grabCurrentPageItems();
    const tasks = Array.from(resItems).map((node) => queryEmailInviteHst(node));
    const results = await Promise.allSettled(tasks); // 使用并行任务
    const docEnd = nextPage
      ? $("div.category-info div.col-md-8.col-lg-9 div.text-center")
      : null;
    for (const i of results) {
      if (i.status !== "fulfilled") {
        console.error("异常: ", i);
        continue;
      }
      // prettier-ignore
      const { value: { email, lastDate, delta, node }} = i
      const { isNow, isNext, inviteTime } = calcSatisfy(lastDate, delta);
      const selector = `small.clipboard[data-clipboard-text='${email}']`;
      const inHtml = `&ensp;|&ensp;<small>${inviteTime}</small>`;
      if (nextPage) {
        // 后续页面
        const isMatch = dealNextNode(isNow, isNext, inHtml, selector, node);
        if (isMatch) docEnd.before(node);
      } else {
        // 第一页
        dealCurrentNode(isNow, isNext, inHtml, selector);
      }
    }
    // 本次匹配条数
    const matchCount = STATUS.ok + STATUS.next - count;
    STATUS.match += matchCount;
    return matchCount;
  };

  const updateStatusBar = () => {
    $("li#my-status-ok").text(STATUS.ok);
    $("li#my-status-next").text(STATUS.next);
    const lStr = STATUS.loading
      ? `加载${STATUS.page}页`
      : `完成${STATUS.page}页`;
    $("li#my-status-loading").text(lStr);
  };

  const initFunc = async () => {
    console.log("---init---");
    updateSettingMenu(); // 加载配置项, 渲染设置菜单
    addStatusDisplay();
    addFilterBtn();
    addSettingMenu();
    $("button#my-filter").click(function (e) {
      e.stopPropagation();
      $("button#my-filter").text("过滤中...");
      $("li#my-status-loading").text("加载中...");
    });
    $("button#my-filter").click(async () => {
      if (STATUS.page === 0) await handleOnePage(1, false); // 第一页
      await checker();
      $("button#my-filter").text("过滤");
    });
  };

  // 滚动回调函数
  const checker = async () => {
    if (!STATUS.loading) {
      STATUS.loading = true;
      const target = STATUS.page + 1; // 翻页
      console.log(`start fetch page=${target} data ...`);
      updateStatusBar(); // 更新状态
      const minCount = getOption("minCount") || 5;
      await handleOnePage(target, true); // 非第一页
      STATUS.loading = false;
      updateStatusBar(); // 更新状态
      if (STATUS.match < minCount) {
        console.log("sleep 0.5s");
        setTimeout(checker, 500);
      } else STATUS.match = 0;
    } else {
      console.log("running...", STATUS);
    }
  };

  window.addEventListener("load", initFunc); // 自动加载

  // 监听 浏览器 滚动条是否到底部
  $(window).scroll(() => {
    // 当滚动到最底部以上n像素时, 加载新内容
    if ($(document).height() - $(this).scrollTop() - $(this).height() < 1) {
      checker();
    }
  });

  // 查询获取一篇处理中的文章ID
  const hashKey = await queryHashKey();
  $("button#my-filter").removeAttr("disabled");
})();
