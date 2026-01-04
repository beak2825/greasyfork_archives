// ==UserScript==
// @name       LinuxDo@真假始皇
// @namespace  bmqy.net
// @version    1.1.0
// @author     bmqy
// @icon       https://cdn.linux.do/uploads/default/original/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b.png
// @match      https://linux.do/*
// @connect    cfw.887776.xyz
// @grant      GM_addStyle
// @grant      GM_getValue
// @grant      GM_setValue
// @grant      GM_xmlhttpRequest
// @description 看着坛子里的始皇头像无处不在，还有始皇两个字的名字左一个、右一个的出现，让你有点分不清楚谁是真正的始皇了么？那么就用上这个脚本吧。
// @downloadURL https://update.greasyfork.org/scripts/492899/LinuxDo%40%E7%9C%9F%E5%81%87%E5%A7%8B%E7%9A%87.user.js
// @updateURL https://update.greasyfork.org/scripts/492899/LinuxDo%40%E7%9C%9F%E5%81%87%E5%A7%8B%E7%9A%87.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const api = "https://cfw.887776.xyz/linuxdo-tf-shihuang";
  let blacklist = [];
  let update = 0;
  let current = "";
  let storeKey = "TFShiHuangBlacklist";
  let panelTimer = null;
  let disableBlacklist = false;
  let noShihuang = false;
  let copyShihuang = false;
  function init() {
    getCurrent();
    getBlacklist();
    onMutationObserver();
    notShihuang();
    copyingShihuang();
    disBlacklist();
  }
  function getCurrent() {
    let $current = document.querySelector("#current-user>button");
    if ($current && $current.getAttribute("href")) {
      current = $current.getAttribute("href").replace("/u/", "");
      setStoreValue("current", current);
    }
  }
  function setStoreValue(key, value) {
    let storeVal = GM_getValue(storeKey) || {
      blacklist: [],
      update: 0,
      current: "",
      disableBlacklist: false,
      noShihuang: false,
      copyShihuang: false
    };
    storeVal[key] = value;
    GM_setValue(storeKey, storeVal);
  }
  function getBlacklist() {
    let storeVal = GM_getValue(storeKey) || {
      blacklist: [],
      update: 0,
      current: "",
      disableBlacklist: false,
      noShihuang: false,
      copyShihuang: false
    };
    blacklist = storeVal.blacklist;
    disableBlacklist = storeVal.disableBlacklist;
    noShihuang = storeVal.noShihuang;
    copyShihuang = storeVal.copyShihuang;
    update = storeVal.update;
    update = parseInt(update);
  }
  function syncBlacklist() {
    if (disableBlacklist)
      return false;
    let $syncBtn = document.querySelector(".sync-blacklist-btn");
    $syncBtn.innerText = "上次同步：同步中...";
    GM_xmlhttpRequest({
      method: "get",
      url: api,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      responseType: "json",
      onload: function(xhr) {
        if (xhr.status == 200) {
          blacklist = xhr.response.blacklist;
          update = xhr.response.update;
          update = parseInt(update);
        } else {
          blacklist = [];
        }
        setStoreValue("blacklist", blacklist);
        setStoreValue("update", update);
        $syncBtn.innerText = "上次同步：" + new Date(update).toLocaleString();
      },
      onerror: function(xhr) {
        console.log("获取黑名单错误：" + xhr.responseText);
      }
    });
  }
  function getRandomString() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let random = "";
    for (var i = 0; i < 18; i++) {
      random += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return random;
  }
  function insertAddBlacklistBtn(element, cardName) {
    if (disableBlacklist)
      return false;
    let $addBtn = document.createElement("button");
    $addBtn.type = "button";
    $addBtn.title = "LinuxDo@真假始皇 - 标记按钮，如无效，请刷新页面";
    $addBtn.setAttribute("class", "add-blacklist-btn widget-button btn-flat post-action-menu__copy-link no-text btn-icon");
    $addBtn.setAttribute("cardName", cardName);
    if (!blacklist.includes(cardName)) {
      $addBtn.innerText = "+ 标记他 +";
      $addBtn.addEventListener("click", function() {
        updateBlacklist(element, cardName, "add");
      });
    } else {
      $addBtn.innerText = "- 标错了 -";
      $addBtn.addEventListener("click", function() {
        updateBlacklist(element, cardName, "remove");
      });
    }
    let parent = element.querySelector(".actions");
    parent.insertBefore($addBtn, parent.firstChild);
  }
  function insertSyncBlacklistBtn() {
    let $syncBtnBox = document.createElement("div");
    $syncBtnBox.setAttribute("style", "position:relative;top: 80px;margin-top: 1em;display: flex;gap: .5em;flex-wrap:wrap;transition: opacity .2s ease-in;");
    let $settingPanel = document.createElement("div");
    $settingPanel.id = "setting-blacklist-panel";
    $settingPanel.style.display = "none";
    $settingPanel.innerHTML = `
  <div style="height:auto;padding:15px;background-color:#e9e9e9;color:#666;position:absolute;left:7px;right: 0px;bottom: 45px;z-index:1;border-radius: 5px;">
    <label title="为始皇增加特殊效果，开启后将禁用黑名单的标记和同步功能"><input type="checkbox" value="1" id="disableBlacklist" ${disableBlacklist ? "checked" : ""} /> 保护始皇（禁用天子庶民）</label>
    <label title="拒绝特殊化，清除始皇头像的特殊样式"><input type="checkbox" value="1" id="noShihuang" ${noShihuang ? "checked" : ""} /> 天子庶民（禁用保护始皇）</label>
    <label title="打不过就加入，借用始皇头像的特殊样式"><input type="checkbox" value="1" id="copyShihuang" ${copyShihuang ? "checked" : ""} /> 王侯将相</label>
  </div>
  `;
    $settingPanel.addEventListener("mouseover", function() {
      if (panelTimer) {
        clearTimeout(panelTimer);
        panelTimer = null;
      }
    });
    $settingPanel.addEventListener("mouseleave", function() {
      panelTimer = setTimeout(() => {
        $settingPanel.style.display = "none";
      }, 500);
    });
    $syncBtnBox.appendChild($settingPanel);
    let $settingBtn = document.createElement("button");
    $settingBtn.type = "button";
    $settingBtn.setAttribute("class", "setting-blacklist-btn btn btn-default create reply-to-post no-text btn-icon");
    $settingBtn.innerHTML = '<svg class="fa d-icon d-icon-ellipsis-v svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#ellipsis-v"></use></svg>';
    $settingBtn.addEventListener("mouseover", function() {
      if (panelTimer) {
        clearTimeout(panelTimer);
        panelTimer = null;
      }
      $settingPanel.style.display = "";
    });
    $settingBtn.addEventListener("mouseleave", function() {
      panelTimer = setTimeout(() => {
        $settingPanel.style.display = "none";
      }, 500);
    });
    $syncBtnBox.appendChild($settingBtn);
    let $syncBtn = document.createElement("button");
    $syncBtn.type = "button";
    $syncBtn.title = "LinuxDo@真假始皇 - 同步按钮，如无效，请刷新页面";
    $syncBtn.setAttribute("class", "sync-blacklist-btn show-summary btn btn-small");
    $syncBtn.setAttribute("style", "white-space: nowrap;");
    $syncBtn.innerText = "上次同步：" + (!update ? "从未" : new Date(update).toLocaleString());
    $syncBtn.addEventListener("click", function() {
      syncBlacklist();
    });
    $syncBtnBox.appendChild($syncBtn);
    let parent = document.querySelector(".topic-timeline");
    if (parent && !parent.querySelector(".sync-blacklist-btn")) {
      parent.appendChild($syncBtnBox);
      bindSettingsBtn();
    }
  }
  function updateBlacklist(element, cardName, action) {
    if (disableBlacklist)
      return false;
    if (cardName === "neo" || !cardName) {
      return false;
    }
    let $addBtn = element.querySelector(".add-blacklist-btn");
    $addBtn.innerText = action === "add" ? "· 标记中... ·" : "· 移除中... ·";
    GM_xmlhttpRequest({
      method: "post",
      url: api,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      data: JSON.stringify({ cardName, action }),
      responseType: "json",
      onload: function(xhr) {
        if (xhr.status == 200) {
          blacklist.push(cardName);
          changeFakeAvatar(element, action);
          $addBtn.innerText = action === "add" ? "- 标错了 -" : "+ 标记他 +";
          $addBtn.removeEventListener("click", updateBlacklist);
          $addBtn.addEventListener("click", function() {
            updateBlacklist(element, cardName, action);
          });
          syncBlacklist();
        } else {
          console.log("标记失败：" + xhr.responseText);
        }
      },
      onerror: function(xhr) {
        console.log("标记失败：" + xhr.responseText);
      }
    });
  }
  function changeFakeAvatar(element, action) {
    let $fullName = element.querySelector(".names .first a");
    let $avatar = element.querySelector(".post-avatar .avatar");
    if (action === "add") {
      $fullName.setAttribute("style", "border:1px dotted red;padding:0px 5px;border-radius:5px;");
      let randomAvatar = `https://api.multiavatar.com/${getRandomString()}.png`;
      if ($avatar.getAttribute("src").indexOf("api.multiavatar.com") == -1) {
        $avatar.setAttribute("src", randomAvatar);
      }
    } else {
      $fullName.setAttribute("style", "");
    }
  }
  function bindSettingsBtn() {
    document.querySelector("#disableBlacklist").addEventListener("click", function(e) {
      disableBlacklist = e.target.checked;
      if (disableBlacklist && noShihuang) {
        noShihuang = false;
      }
      setStoreValue("noShihuang", false);
      setStoreValue("disableBlacklist", disableBlacklist);
      location.reload();
    });
    document.querySelector("#noShihuang").addEventListener("click", function(e) {
      noShihuang = e.target.checked;
      if (noShihuang && disableBlacklist) {
        disableBlacklist = false;
      }
      setStoreValue("disableBlacklist", false);
      setStoreValue("noShihuang", noShihuang);
      location.reload();
    });
    document.querySelector("#copyShihuang").addEventListener("click", function(e) {
      copyShihuang = e.target.checked;
      setStoreValue("copyShihuang", copyShihuang);
      location.reload();
    });
  }
  function disBlacklist() {
    if (disableBlacklist) {
      GM_addStyle(`
      .topic-post article[data-user-id="1"]:before{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url(https://cdn.linux.do/user_avatar/linux.do/neo/48/12_2.png);
        background-repeat: no-repeat;
        background-size: 100%;
        background-position: center bottom;
        opacity: 0.1;
      }
    `);
    }
  }
  function notShihuang() {
    if (noShihuang) {
      GM_addStyle(`
      .topic-post article[data-user-id="1"] img.avatar{
        border-radius: 50% !important;
      }
      .topic-post article[data-user-id="1"] .avatar-flair-admins{
        display: none !important;
      }
    `);
    }
  }
  function copyingShihuang() {
    if (copyShihuang) {
      GM_addStyle(`
      .topic-post .first a[data-user-card="${current}"]{
        color: #00aeff !important;
      }
      .topic-post a[data-user-card="${current}"] img.avatar{
        border-radius: 10% !important;
      }
    `);
    }
  }
  function onMutationObserver() {
    let mos = new MutationObserver(function(mutations, observer) {
      for (const mutation in mutations) {
        if (Object.hasOwnProperty.call(mutations, mutation)) {
          const element = mutations[mutation];
          if (element.target.nodeName == "DIV") {
            if (element.target.classList.contains("topic-post")) {
              insertSyncBlacklistBtn();
              if (disableBlacklist)
                return false;
              let $fullName = element.target.querySelector(".names .first a");
              let cardName = $fullName.getAttribute("data-user-card");
              cardName = cardName.toLowerCase();
              if (cardName != "neo") {
                if (!element.target.querySelector(".add-blacklist-btn")) {
                  insertAddBlacklistBtn(element.target, cardName);
                }
                if (blacklist.includes(cardName)) {
                  changeFakeAvatar(element.target, "add");
                }
              } else {
                if (noShihuang) {
                  element.target.querySelector("img.avatar").style.borderRadius = "50% !important";
                }
              }
            }
          }
        }
      }
    });
    if (document.querySelector("#main")) {
      mos.observe(document.querySelector("#main"), {
        attributes: true,
        childList: true,
        subtree: true
      });
    }
  }
  init();

})();