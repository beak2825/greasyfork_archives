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

  function checkForNextPage(doc, nextPageLinkSelector) {
    return Boolean(doc.querySelector(nextPageLinkSelector));
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
  async function handleLedTorrent(arr, button2, json, type) {
    for (let i = 0; i < arr.length; i++) {
      button2.innerHTML = `努力再努力 ${arr.length} / ${i + 1}`;
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
          if ((innerText0.includes("领") || innerText0.includes("領")) && display1 === "none" && torrent_id && !allData.includes(torrent_id)) {
            allData.push(torrent_id);
          }
          if (display0 === "none" && (innerText1.includes("弃") || innerText1.includes("棄")) && !ledlist.includes(torrent_id)) {
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
          if (display0 === "none" && (innerText1.includes("弃") || innerText1.includes("棄")) && !ledlist.includes(torrent_id) && !allData.includes(claim_id)) {
            allData.push(claim_id);
          }
        }
      });
      page++;
      hasMore = checkForNextPage(doc, `a[href*="?uid=${uid}&page=${page}"]`);
    } while (hasMore);
  }
  async function loadPterUserTorrents(userid, allData, ledlist) {
    let page = 0;
    let hasMore = true;
    do {
      const details = await getNPHPPterUsertorrentlistajax({
        page,
        userid,
        type: "seeding"
      });
      const parser = new DOMParser();
      const doc = parser.parseFromString(details, "text/html");
      const claimDoms = doc.querySelectorAll(".claim-confirm");
      const removeDoms = doc.querySelectorAll(".remove-confirm");
      claimDoms.forEach((v) => {
        const id = v.getAttribute("data-url") || "";
        if (!allData.includes(id)) {
          allData.push(id);
        }
      });
      removeDoms.forEach((v) => {
        const id = v.getAttribute("data-url") || "";
        if (!ledlist.includes(id)) {
          ledlist.push(id);
        }
      });
      page++;
      hasMore = checkForNextPage(
        doc,
        `a[href*="?userid=${userid}&type=seeding&page=${page}"]`
      );
    } while (hasMore);
  }
  async function handleLedPterTorrent(arr, button2, json) {
    for (let i = 0; i < arr.length; i++) {
      button2.innerHTML = `努力再努力 ${arr.length} / ${i + 1}`;
      try {
        const data = await getNPHPPterLedTorrent(arr[i]);
        const msg = data ? "领取成功" : "领取失败";
        json[msg] = (json[msg] || 0) + 1;
      } catch (error) {
        console.error("handleLedPterTorrent error: ", error);
      }
    }
  }
  async function loadSpringsundayUserTorrents(userid, allData, ledlist) {
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
      const claimDoms = doc.querySelectorAll(".btn");
      const removeDoms = doc.querySelectorAll(".nowrap");
      claimDoms.forEach((v) => {
        const id = v.getAttribute("id")?.replace("btn", "") || "";
        if (!allData.includes(id)) {
          allData.push(id);
        }
      });
      removeDoms.forEach((v) => {
        if (v.innerHTML === "已认领") {
          const id = v.getAttribute("id")?.replace("btn", "") || "";
          if (!ledlist.includes(id)) {
            ledlist.push(id);
          }
        }
      });
      page++;
      hasMore = checkForNextPage(
        doc,
        `a[href*="?userid=${userid}&type=seeding&page=${page}"]`
      );
    } while (hasMore);
  }
  async function handleLedSpringsundayTorrent(arr, button2, json) {
    for (let i = 0; i < arr.length; i++) {
      button2.innerHTML = `努力再努力 ${arr.length} / ${i + 1}`;
      try {
        const data = await getSSDLedTorrent(arr[i]);
        const msg = data ? "领取成功" : "领取失败";
        json[msg] = (json[msg] || 0) + 1;
      } catch (error) {
        console.error("handleLedSpringsundayTorrent error: ", error);
      }
    }
  }
  function getvl(name) {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    return result[name] ?? "";
  }
  function animateButton(e) {
    e.preventDefault();
    if (e.target && e.target instanceof Element) {
      const target = e.target;
      target.classList.remove("animate");
      target.classList.add("animate");
      setTimeout(() => {
        target.classList.remove("animate");
      }, 700);
    }
  }
  function getLedMsg(msglist) {
    let msgLi = "";
    Object.keys(msglist).forEach((e) => {
      msgLi += `<li>${e}: ${msglist[e]}</li>`;
    });
    return msgLi;
  }
  const ledTorrentScss = '.led-box{position:fixed;top:80px;left:20px;z-index:9999;display:flex;flex-direction:column;align-items:flex-start;justify-content:center}.led-box ul{margin-left:0;padding-left:0}.led-box li{color:#fff;background-color:#ff0081;list-style:none;line-height:20px;font-size:14px;margin-left:0;padding:8px 10px}.bubbly-button{font-family:Helvetica,Arial,sans-serif;display:inline-block;font-size:20px;padding:8px 10px;appearance:none;background-color:#ff0081;color:#fff;border-radius:4px;border:none;cursor:pointer;position:relative;transition:transform ease-in .1s,box-shadow ease-in .25s;box-shadow:0 2px 25px #ff008280}.bubbly-button:hover{background-color:#ff0081}.bubbly-button:focus{outline:0}.bubbly-button:before,.bubbly-button:after{position:absolute;content:"";display:block;width:140%;height:100%;left:-20%;z-index:-1000;transition:all ease-in-out .5s;background-repeat:no-repeat}.bubbly-button:before{display:none;top:-75%;background-image:radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,transparent 20%,#ff0081 20%,transparent 30%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,transparent 10%,#ff0081 15%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%);background-size:10% 10%,20% 20%,15% 15%,20% 20%,18% 18%,10% 10%,15% 15%,10% 10%,18% 18%}.bubbly-button:after{display:none;bottom:-75%;background-image:radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,transparent 10%,#ff0081 15%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%);background-size:15% 15%,20% 20%,18% 18%,20% 20%,15% 15%,10% 10%,20% 20%}.bubbly-button:active{transform:scale(.9);background-color:#e60074;box-shadow:0 2px 25px #ff008233}.bubbly-button.animate:before{display:block;animation:topBubbles ease-in-out .75s forwards}.bubbly-button.animate:after{display:block;animation:bottomBubbles ease-in-out .75s forwards}@keyframes topBubbles{0%{background-position:5% 90%,10% 90%,10% 90%,15% 90%,25% 90%,25% 90%,40% 90%,55% 90%,70% 90%}50%{background-position:0% 80%,0% 20%,10% 40%,20% 0%,30% 30%,22% 50%,50% 50%,65% 20%,90% 30%}to{background-position:0% 70%,0% 10%,10% 30%,20% -10%,30% 20%,22% 40%,50% 40%,65% 10%,90% 20%;background-size:0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%}}@keyframes bottomBubbles{0%{background-position:10% -10%,30% 10%,55% -10%,70% -10%,85% -10%,70% -10%,70% 0%}50%{background-position:0% 80%,20% 80%,45% 60%,60% 100%,75% 70%,95% 60%,105% 0%}to{background-position:0% 90%,20% 90%,45% 70%,60% 110%,75% 80%,95% 70%,110% 10%;background-size:0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%}}';
  importCSS(ledTorrentScss);
  let loading = false;
  function setupButtonListener(button2, action) {
    button2.addEventListener("click", async (e) => {
      if (loading) {
        e.preventDefault();
        return;
      }
      loading = true;
      animateButton(e);
      button2.disabled = true;
      button2.textContent = "开始工作，为了网站和你自己的电脑速度调的很慢~~~";
      try {
        await action();
      } catch (error) {
        console.error("Error: ", error);
        button2.textContent = error.message;
      } finally {
        loading = false;
        button2.disabled = false;
      }
    });
  }
  const button = document.createElement("button");
  const ulbox = document.createElement("ul");
  button.className = "bubbly-button";
  const div = document.createElement("div");
  div.className = "led-box";
  div.appendChild(button);
  div.appendChild(ulbox);
  if (location.href.includes("claim.php")) {
    button.textContent = "一键弃种";
    ulbox.innerHTML = `<li>放弃本人没在做种的种子</li>`;
    setupButtonListener(button, async () => {
      if (confirm("真的要弃种吗?")) {
        button.textContent = "获取所有数据，请稍等。";
        const msglist = {};
        const uid = getvl("uid");
        const ledlist = [];
        await loadUserTorrents(uid, [], ledlist);
        ulbox.innerHTML += `<li>获取所有在做种且领取状态的数据一共${ledlist.length}个</li>`;
        const allData = [];
        button.textContent = "获取所有领种的数据";
        await loadUserTorrentsHistory(uid, allData, ledlist);
        ulbox.innerHTML += `<li>获取所有没在做种且领取状态的数据一共${allData.length}个</li>`;
        if (allData.length) {
          if (confirm(
            `目前有${allData.length}个可能不在做种状态，真的要放弃领种吗?`
          )) {
            await handleLedTorrent(allData, button, msglist, "removeClaim");
          } else {
            loading = false;
          }
        }
      } else {
        loading = false;
      }
    });
  }
  async function handleTorrentsActions(button2, ulbox2, userId, action) {
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
      button2.textContent = `该站点可能不支持领种子。`;
    }
    if (ledlist.length > 0) {
      msglist["已经认领过"] = ledlist.length;
    }
    ulbox2.innerHTML = getLedMsg(msglist);
    if (action === "claim" || action === "abandon") {
      await handleLedTorrent(
        allData,
        button2,
        msglist,
        action === "claim" ? "addClaim" : "removeClaim"
      );
    } else if (action === "claimPter") {
      await handleLedPterTorrent(allData, button2, msglist);
    } else if (action === "claimSpring") {
      await handleLedSpringsundayTorrent(allData, button2, msglist);
    }
    button2.textContent = `一键操作完毕，刷新查看。`;
    ulbox2.innerHTML = getLedMsg(msglist);
  }
  if (location.href.includes("pterclub.com/getusertorrentlist.php")) {
    button.textContent = "一键认领";
    setupButtonListener(button, () => handleTorrentsActions(button, ulbox, getvl("userid"), "claimPter"));
  } else if (location.href.includes("springsunday.net/userdetails.php")) {
    button.textContent = "一键认领";
    setupButtonListener(button, () => handleTorrentsActions(button, ulbox, getvl("id"), "claimSpring"));
  } else if (location.href.includes("pt.btschool.club/userdetails.php")) {
    button.textContent = "一键认领";
    setupButtonListener(button, () => handleTorrentsActions(button, ulbox, getvl("id"), "claimSCH"));
  } else if (location.href.includes("userdetails.php")) {
    button.textContent = "一键认领";
    setupButtonListener(button, () => handleTorrentsActions(button, ulbox, getvl("id"), "claim"));
  } else if (location.href.includes("claim.php")) {
    button.textContent = "一键弃种";
    ulbox.innerHTML = `<li>放弃本人没在做种的种子</li>`;
    setupButtonListener(button, () => handleTorrentsActions(button, ulbox, getvl("uid"), "abandon"));
  }
  document.body.appendChild(div);

})();