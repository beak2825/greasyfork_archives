// ==UserScript==
// @name         一键领种、弃种
// @namespace    方便用户一键领种、弃种
// @version      1.7
// @author       waibuzheng
// @description  努力支持多个站点一键领种、一键放弃本人没在做种的种子（慎用、测试可用）
// @icon         https://lsky.939593.xyz:11111/Y7bbx9.jpg
// @match        http*://*/userdetails.php?id=*
// @match        http*://*/claim.php?uid=*
// @match        http*://pterclub.com/getusertorrentlist.php?*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/478851/%E4%B8%80%E9%94%AE%E9%A2%86%E7%A7%8D%E3%80%81%E5%BC%83%E7%A7%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/478851/%E4%B8%80%E9%94%AE%E9%A2%86%E7%A7%8D%E3%80%81%E5%BC%83%E7%A7%8D.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  class UICreator {
static createPanel() {
      const container = document.createElement("div");
      container.className = "led-box";
      const button = document.createElement("button");
      button.className = "bubbly-button";
      const messageList = document.createElement("ul");
      container.appendChild(button);
      container.appendChild(messageList);
      return { container, button, messageList };
    }
static createMessageItem(text) {
      const li = document.createElement("li");
      li.textContent = text;
      return li;
    }
  }
  class ButtonAnimator {
static animate(event) {
      if (event.target && event.target instanceof Element) {
        const target = event.target;
        target.classList.remove("animate");
        void target.offsetWidth;
        target.classList.add("animate");
        setTimeout(() => {
          target.classList.remove("animate");
        }, 750);
      }
    }
  }
  function checkForNextPage(doc, nextPageLinkSelector) {
    return Boolean(doc.querySelector(nextPageLinkSelector));
  }
  function getLedMsg(msglist) {
    let msgLi = "";
    Object.keys(msglist).forEach((e) => {
      msgLi += `<li>${e}: ${msglist[e]}</li>`;
    });
    return msgLi;
  }
  function getvl(name) {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    return result[name] ?? "";
  }
  const ROUTES = [
    {
      name: "猫站领种",
      pattern: "pterclub.com/getusertorrentlist.php",
      buttonText: "一键认领",
      action: "claimPter",
      userIdParam: "userid"
    },
    {
      name: "春天站领种",
      pattern: "springsunday.net/userdetails.php",
      buttonText: "一键认领",
      action: "claimSpring",
      userIdParam: "id"
    },
    {
      name: "通用站点领种",
      pattern: "userdetails.php",
      buttonText: "一键认领",
      action: "claim",
      userIdParam: "id"
    },
    {
      name: "通用站点弃种",
      pattern: "claim.php",
      buttonText: "一键弃种",
      initMessage: "<li>放弃本人没在做种的种子</li>",
      action: "abandon",
      userIdParam: "uid"
    }
  ];
  class ConcurrentPool {
    maxConcurrency;
    runningCount = 0;
    queue = [];
    constructor(maxConcurrency) {
      this.maxConcurrency = maxConcurrency;
    }
async add(task) {
      return new Promise((resolve, reject) => {
        this.queue.push(async () => {
          try {
            const result = await task();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
        this.runNext();
      });
    }
runNext() {
      if (this.runningCount >= this.maxConcurrency || this.queue.length === 0)
        return;
      this.runningCount++;
      const task = this.queue.shift();
      task().finally(() => {
        this.runningCount--;
        this.runNext();
      });
    }
async waitAll() {
      while (this.runningCount > 0 || this.queue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }
  class RateLimiter {
    minInterval;
    lastRequestTime = 0;
constructor(requestsPerMinute) {
      this.minInterval = 60 * 1e3 / requestsPerMinute;
    }
async wait() {
      const now = Date.now();
      const elapsed = now - this.lastRequestTime;
      if (elapsed < this.minInterval) {
        const waitTime = this.minInterval - elapsed;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
      this.lastRequestTime = Date.now();
    }
reset() {
      this.lastRequestTime = 0;
    }
  }
  class BatchTaskExecutor {
    pool;
    limiter;
    constructor(maxConcurrency, requestsPerMinute) {
      this.pool = new ConcurrentPool(maxConcurrency);
      this.limiter = new RateLimiter(requestsPerMinute);
    }
async executeAll(tasks, onProgress) {
      const results = [];
      let completed = 0;
      const promises = tasks.map(
        (task, index) => this.pool.add(async () => {
          await this.limiter.wait();
          const result = await task();
          results[index] = result;
          completed++;
          if (onProgress) {
            onProgress(completed, tasks.length);
          }
          return result;
        })
      );
      await Promise.all(promises);
      await this.pool.waitAll();
      return results;
    }
async waitAll() {
      await this.pool.waitAll();
    }
  }
  class BaseSiteAdapter {
async loadUserTorrents(userid, allData, ledlist) {
      let page = 0;
      let hasMore = true;
      do {
        const html = await this.fetchPageData(page, userid);
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        this.parsePageData(html, allData, ledlist);
        hasMore = this.hasNextPage(doc, page + 1, userid);
        page++;
      } while (hasMore);
    }
async handleLedTorrent(arr, ui, stats) {
      if (arr.length === 0) {
        ui.addMessage("没有需要操作的种子");
        ui.flush();
        return;
      }
      const executor = new BatchTaskExecutor(5, 35);
      const tasks = arr.map((id) => () => this.claimOneTorrent(id));
      await executor.executeAll(
        tasks,
        (current, total) => {
          ui.updateProgress(current, total);
        }
      );
      const results = await Promise.allSettled(
        arr.map((id) => this.claimOneTorrent(id))
      );
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          const msg = result.value;
          stats[msg] = (stats[msg] || 0) + 1;
        } else {
          stats["操作失败"] = (stats["操作失败"] || 0) + 1;
        }
      });
      ui.showStats(stats);
    }
  }
  class DOMHelper {
static checkNextPage(doc, selector) {
      const nextLink = doc.querySelector(selector);
      return nextLink !== null;
    }
static getAttr(element, attrName, defaultValue = "") {
      return element.getAttribute(attrName) || defaultValue;
    }
static textContains(element, searchText) {
      return element.textContent?.includes(searchText) || false;
    }
static isVisible(element) {
      const style = element.style;
      return style.display !== "none";
    }
  }
  async function fetchWithTimeout(input, init, timeout = 1e5) {
    return Promise.race([
      fetch(input, init),
      new Promise(
        (_, reject) => setTimeout(() => reject(new Error("Request Timeout")), timeout)
      )
    ]);
  }
  function buildURL(url, params) {
    let fullUrl = url;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (params[key] !== void 0 && params[key] !== null) {
          searchParams.append(key, params[key]);
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        fullUrl += (fullUrl.includes("?") ? "&" : "?") + queryString;
      }
    }
    return fullUrl;
  }
  async function request(url, options = {}) {
    const { method = "GET", headers = {}, body, timeout, params } = options;
    try {
      const response = await fetchWithTimeout(
        method === "GET" ? buildURL(url, params) : url,
        {
          method,
          headers,
          body
        },
        timeout
      );
      if (url.includes("viewclaims.php")) {
        try {
          await response.json();
          return Promise.resolve(true);
        } catch {
          return Promise.resolve(false);
        }
      }
      if (url.includes("user-seeding-torrent") && (response.status === 500 || response.status === 404 || response.status === 403 || response.url.includes("/login"))) {
        return Promise.reject(response);
      }
      if (url.includes("getusertorrentlistajax") || url.includes("claim.php") || url.includes("getusertorrentlist.php")) {
        return await response.text();
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch error: ", error);
      return error;
    }
  }
  function getNPHPLedTorrent(id, type) {
    const body = new FormData();
    if (type === "addClaim") {
      body.append("action", "addClaim");
      body.append("params[torrent_id]", `${id}`);
    } else {
      body.append("action", "removeClaim");
      body.append("params[id]", `${id}`);
    }
    return request(`/ajax.php`, {
      method: "POST",
      body
    });
  }
  async function getNPHPUsertorrentlistajax(params) {
    return request(
      "getusertorrentlistajax.php",
      {
        method: "GET",
        params
      }
    );
  }
  async function getNPHPUsertorrentHistory(params) {
    return request("claim.php", {
      method: "GET",
      params
    });
  }
  async function getNPHPPterUsertorrentlistajax(params) {
    return request(
      "getusertorrentlist.php",
      {
        method: "GET",
        params
      }
    );
  }
  function getNPHPPterLedTorrent(id) {
    const body = new FormData();
    return request(id, {
      method: "POST",
      body
    });
  }
  function getSSDLedTorrent(id) {
    const body = new FormData();
    body.append("action", "add");
    body.append("id", `${id}`);
    return request(`/adopt.php`, {
      method: "POST",
      body
    });
  }
  async function handleLedTorrent(arr, button, json, type) {
    for (let i = 0; i < arr.length; i++) {
      button.innerHTML = `努力再努力 ${arr.length} / ${i + 1}`;
      try {
        const data = await getNPHPLedTorrent(arr[i], type);
        const msg = data.msg || "领种接口返回信息错误";
        json[msg] = (json[msg] || 0) + 1;
      } catch (error) {
        console.error("handleLedTorrent error: ", error);
      }
    }
  }
  async function loadUserTorrents(userid, allData, ledlist) {
    let page = 0;
    let hasMore = true;
    do {
      const details = await getNPHPUsertorrentlistajax({
        page,
        userid,
        type: "seeding"
      });
      const parser = new DOMParser();
      const doc = parser.parseFromString(details, "text/html");
      const tdList = doc.querySelectorAll("td");
      tdList.forEach((v) => {
        const buttons = v.querySelectorAll("button");
        if (buttons.length > 0) {
          const {
            textContent: innerText0,
            style: { display: display0 }
          } = buttons[0];
          const torrent_id = buttons[0].getAttribute("data-torrent_id");
          const {
            textContent: innerText1,
            style: { display: display1 }
          } = buttons[1];
          if ((innerText0?.includes("领") || innerText0?.includes("領")) && display1 === "none" && torrent_id && !allData.includes(torrent_id)) {
            allData.push(torrent_id);
          }
          if (display0 === "none" && (innerText1?.includes("弃") || innerText1?.includes("棄")) && !ledlist.includes(torrent_id)) {
            ledlist.push(torrent_id);
          }
        }
      });
      page++;
      hasMore = checkForNextPage(
        doc,
        `a[href*="getusertorrentlistajax.php?page=${page}"]`
      );
    } while (hasMore);
  }
  async function loadUserTorrentsHistory(uid, allData, ledlist) {
    let page = 0;
    let hasMore = true;
    do {
      const details = await getNPHPUsertorrentHistory({
        page,
        uid
      });
      const parser = new DOMParser();
      const doc = parser.parseFromString(details, "text/html");
      const tdList = doc.querySelectorAll("#claim-table td");
      tdList.forEach((v) => {
        const buttons = v.querySelectorAll("button");
        if (buttons.length > 0) {
          const {
            style: { display: display0 }
          } = buttons[0];
          const torrent_id = buttons[1].getAttribute("data-torrent_id");
          const claim_id = buttons[1].getAttribute("data-claim_id");
          const { textContent: innerText1 } = buttons[1];
          if (display0 === "none" && (innerText1?.includes("弃") || innerText1?.includes("棄")) && !ledlist.includes(torrent_id) && !allData.includes(claim_id)) {
            allData.push(claim_id);
          }
        }
      });
      page++;
      hasMore = checkForNextPage(doc, `a[href*="?uid=${uid}&page=${page}"]`);
    } while (hasMore);
  }
  class PterSiteAdapter extends BaseSiteAdapter {
    siteName = "猫站";
    async fetchPageData(page, userid) {
      return getNPHPPterUsertorrentlistajax({
        page,
        userid,
        type: "seeding"
      });
    }
    parsePageData(html, allData, ledlist) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const claimDoms = doc.querySelectorAll(".claim-confirm");
      const removeDoms = doc.querySelectorAll(".remove-confirm");
      claimDoms.forEach((v) => {
        const id = DOMHelper.getAttr(v, "data-url");
        if (id && !allData.includes(id)) {
          allData.push(id);
        }
      });
      removeDoms.forEach((v) => {
        const id = DOMHelper.getAttr(v, "data-url");
        if (id && !ledlist.includes(id)) {
          ledlist.push(id);
        }
      });
    }
    hasNextPage(doc, page, userid) {
      return DOMHelper.checkNextPage(
        doc,
        `a[href*="?userid=${userid}&type=seeding&page=${page}"]`
      );
    }
    async claimOneTorrent(id) {
      try {
        const data = await getNPHPPterLedTorrent(id);
        return data ? "领取成功" : "领取失败";
      } catch {
        console.error("handleLedPterTorrent error: ");
        return "领取失败";
      }
    }
  }
  const pterAdapter = new PterSiteAdapter();
  async function loadPterUserTorrents(userid, allData, ledlist) {
    await pterAdapter.loadUserTorrents(userid, allData, ledlist);
  }
  async function handleLedPterTorrent(arr, button, json) {
    const messageList = button.nextElementSibling;
    const ui = {
      updateButton: (text) => {
        button.textContent = text;
      },
      updateProgress: (current, total) => {
        button.textContent = `努力再努力 ${total} / ${current}`;
      },
      addMessage: (message) => {
        const li = document.createElement("li");
        li.textContent = message;
        messageList.appendChild(li);
      },
      flush: () => {
      },
      clearMessages: () => {
        messageList.innerHTML = "";
      },
      showStats: (stats) => {
        messageList.innerHTML = Object.entries(stats).map(([key, value]) => `<li>${key}: ${value}</li>`).join("");
      },
      setDisabled: (disabled) => {
        button.disabled = disabled;
      }
    };
    await pterAdapter.handleLedTorrent(arr, ui, json);
  }
  class SpringSiteAdapter extends BaseSiteAdapter {
    siteName = "春天站";
    async fetchPageData(page, userid) {
      return getNPHPUsertorrentlistajax({
        page,
        userid,
        type: "seeding"
      });
    }
    parsePageData(html, allData, ledlist) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const claimDoms = doc.querySelectorAll(".btn");
      const removeDoms = doc.querySelectorAll(".nowrap");
      claimDoms.forEach((v) => {
        const id = DOMHelper.getAttr(v, "id", "").replace("btn", "");
        if (id && !allData.includes(id)) {
          allData.push(id);
        }
      });
      removeDoms.forEach((v) => {
        if (v.innerHTML === "已认领") {
          const id = DOMHelper.getAttr(v, "id", "").replace("btn", "");
          if (id && !ledlist.includes(id)) {
            ledlist.push(id);
          }
        }
      });
    }
    hasNextPage(doc, page, userid) {
      return DOMHelper.checkNextPage(
        doc,
        `a[href*="?userid=${userid}&type=seeding&page=${page}"]`
      );
    }
    async claimOneTorrent(id) {
      try {
        const data = await getSSDLedTorrent(id);
        return data && data.ret === 0 ? "领取成功" : "领取失败";
      } catch {
        console.error("handleLedSpringsundayTorrent error: ");
        return "领取失败";
      }
    }
  }
  const springAdapter = new SpringSiteAdapter();
  async function loadSpringsundayUserTorrents(userid, allData, ledlist) {
    await springAdapter.loadUserTorrents(userid, allData, ledlist);
  }
  async function handleLedSpringsundayTorrent(arr, button, json) {
    const messageList = button.nextElementSibling;
    const ui = {
      updateButton: (text) => {
        button.textContent = text;
      },
      updateProgress: (current, total) => {
        button.textContent = `努力再努力 ${total} / ${current}`;
      },
      addMessage: (message) => {
        const li = document.createElement("li");
        li.textContent = message;
        messageList.appendChild(li);
      },
      flush: () => {
      },
      clearMessages: () => {
        messageList.innerHTML = "";
      },
      showStats: (stats) => {
        messageList.innerHTML = Object.entries(stats).map(([key, value]) => `<li>${key}: ${value}</li>`).join("");
      },
      setDisabled: (disabled) => {
        button.disabled = disabled;
      }
    };
    await springAdapter.handleLedTorrent(arr, ui, json);
  }
  let loading = false;
  function setupButtonListener(button, action) {
    button.addEventListener("click", async (e) => {
      if (loading) {
        e.preventDefault();
        return;
      }
      loading = true;
      ButtonAnimator.animate(e);
      button.disabled = true;
      button.textContent = "开始工作，为了网站和你自己的电脑速度调的很慢~~~";
      try {
        await action();
      } catch (error) {
        console.error("Error: ", error);
        button.textContent = error.message;
      } finally {
        loading = false;
        button.disabled = false;
      }
    });
  }
  async function handleTorrentsActions(button, ulbox, userId, action) {
    const msglist = {};
    const ledlist = [];
    const allData = [];
    if (action === "claim" || action === "abandon") {
      await loadUserTorrents(userId, allData, ledlist);
    } else if (action === "claimPter") {
      await loadPterUserTorrents(userId, allData, ledlist);
    } else if (action === "claimSpring") {
      await loadSpringsundayUserTorrents(userId, allData, ledlist);
    }
    if (!allData.length) {
      button.textContent = `该站点可能不支持领种子。`;
    }
    if (ledlist.length > 0) {
      msglist["已经认领过"] = ledlist.length;
    }
    ulbox.innerHTML = getLedMsg(msglist);
    if (action === "claim") {
      await handleLedTorrent(allData, button, msglist, "addClaim");
    } else if (action === "abandon") {
      if (confirm("真的要弃种吗?")) {
        button.textContent = "获取所有数据，请稍等。";
        await loadUserTorrentsHistory(userId, allData, ledlist);
        ulbox.innerHTML += `<li>获取所有没在做种且领取状态的数据一共${allData.length}个</li>`;
        if (allData.length) {
          if (confirm(`目前有${allData.length}个可能不在做种状态，真的要放弃领种吗?`)) {
            await handleLedTorrent(allData, button, msglist, "removeClaim");
          } else {
            loading = false;
          }
        }
      } else {
        loading = false;
      }
    } else if (action === "claimPter") {
      await handleLedPterTorrent(allData, button, msglist);
    } else if (action === "claimSpring") {
      await handleLedSpringsundayTorrent(allData, button, msglist);
    }
    button.textContent = `一键操作完毕，刷新查看。`;
    ulbox.innerHTML = getLedMsg(msglist);
  }
  function matchRoute() {
    const currentUrl = location.href;
    for (const route of ROUTES) {
      const patterns = Array.isArray(route.pattern) ? route.pattern : [route.pattern];
      for (const pattern of patterns) {
        if (currentUrl.includes(pattern)) {
          return route;
        }
      }
    }
    return null;
  }
  function initApp() {
    const { container: div, button, messageList: ulbox } = UICreator.createPanel();
    const route = matchRoute();
    if (route) {
      button.textContent = route.buttonText;
      if (route.initMessage) {
        ulbox.innerHTML = route.initMessage;
      }
      setupButtonListener(button, () => handleTorrentsActions(button, ulbox, getvl(route.userIdParam), route.action));
    } else {
      div.style.display = "none";
    }
    document.body.appendChild(div);
  }
  const ledTorrentScss = '@charset "UTF-8";.led-box{position:fixed;top:80px;left:20px;z-index:9999;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;width:auto;padding:16px;background:#000000d9;border-radius:12px;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 8px 32px #0000004d,0 2px 8px #ff008133;border:1px solid rgba(255,0,129,.15)}.led-box ul{margin:12px 0 0;padding:0;max-height:450px;overflow-y:auto;overflow-x:hidden;width:100%}.led-box ul:empty{display:none}.led-box ul::-webkit-scrollbar{width:6px}.led-box ul::-webkit-scrollbar-track{background:#ff00811a;border-radius:3px}.led-box ul::-webkit-scrollbar-thumb{background:#ff008166;border-radius:3px}.led-box ul::-webkit-scrollbar-thumb:hover{background:#ff008199}.led-box li{color:#fff;background:linear-gradient(135deg,#ff0081,#ff5ebc);padding:12px 16px;list-style:none;line-height:1.6;font-size:14px;font-weight:500;margin:0 0 10px;border-radius:8px;box-shadow:0 4px 12px #ff00814d,0 2px 5px #0003;animation:slideIn .3s ease-out;word-wrap:break-word;word-break:break-all;position:relative;overflow:hidden}.led-box li:before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);transition:left .5s}.led-box li:hover:before{left:100%}.led-box li:last-child{margin-bottom:0}@keyframes slideIn{0%{opacity:0;transform:translate(-20px)}to{opacity:1;transform:translate(0)}}@keyframes topBubbles{0%{background-position:5% 90%,10% 90%,10% 90%,15% 90%,25% 90%,25% 90%,40% 90%,55% 90%,70% 90%}50%{background-position:0% 80%,0% 20%,10% 40%,20% 0%,30% 30%,22% 50%,50% 50%,65% 20%,90% 30%}to{background-position:0% 70%,0% 10%,10% 30%,20% -10%,30% 20%,22% 40%,50% 40%,65% 10%,90% 20%;background-size:0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%}}@keyframes bottomBubbles{0%{background-position:10% -10%,30% 10%,55% -10%,70% -10%,85% -10%,70% -10%,70% 0%}50%{background-position:0% 80%,20% 80%,45% 60%,60% 100%,75% 70%,95% 60%,105% 0%}to{background-position:0% 90%,20% 90%,45% 70%,60% 110%,75% 80%,95% 70%,110% 10%;background-size:0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%}}.led-box .bubbly-button{font-family:Helvetica,Arial,sans-serif;display:inline-block;width:100%;font-size:18px;font-weight:600;padding:12px 24px;appearance:none;background:linear-gradient(135deg,#ff0081,#ff5ebc);color:#fff;border-radius:8px;border:none;cursor:pointer;position:relative;transition:transform ease-in .1s,box-shadow ease-in .25s,background .3s;box-shadow:0 4px 15px #ff008266,0 2px 5px #0003;text-align:center;-webkit-user-select:none;user-select:none}.led-box .bubbly-button:hover{background:linear-gradient(135deg,#e60074,#ff73c8);box-shadow:0 8px 30px #ff008280,0 3px 8px #0000004d;transform:translateY(-1px)}.led-box .bubbly-button:active{transform:translateY(1px)}.led-box .bubbly-button:disabled{opacity:.6;cursor:not-allowed;transform:none}.led-box .bubbly-button:focus{outline:0}.led-box .bubbly-button:before,.led-box .bubbly-button:after{position:absolute;content:"";display:block;width:140%;height:100%;left:-20%;z-index:-1000;transition:all ease-in-out .5s;background-repeat:no-repeat}.led-box .bubbly-button:before{display:none;top:-75%;background-image:radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,transparent 20%,#ff0081 20%,transparent 30%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,transparent 10%,#ff0081 15%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%);background-size:10% 10%,20% 20%,15% 15%,20% 20%,18% 18%,10% 10%,15% 15%,10% 10%,18% 18%}.led-box .bubbly-button:after{display:none;bottom:-75%;background-image:radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,transparent 10%,#ff0081 15%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%);background-size:15% 15%,20% 20%,18% 18%,20% 20%,15% 15%,10% 10%,20% 20%}.led-box .bubbly-button:active{transform:scale(.98) translateY(0);background:linear-gradient(135deg,#cc006a,#e650ad);box-shadow:0 2px 10px #ff00824d,0 2px 5px #0003}.led-box .bubbly-button.animate:before{display:block;animation:topBubbles ease-in-out .75s forwards}.led-box .bubbly-button.animate:after{display:block;animation:bottomBubbles ease-in-out .75s forwards}';
  importCSS(ledTorrentScss);
  initApp();

})();