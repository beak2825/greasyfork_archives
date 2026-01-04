// ==UserScript==
// @name         bitbucket-global-search
// @version      0.0.8
// @author       alan
// @include      https://code.fineres.com/*
// @noframes
// @description  bitbucket全局搜索
// @namespace bitbucket-global-search
// @license MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource css https://code.fineres.com/download/resources/com.atlassian.bitbucket.server.bitbucket-frontend:split_dashboard/dashboard.bundle.css
// @downloadURL https://update.greasyfork.org/scripts/454806/bitbucket-global-search.user.js
// @updateURL https://update.greasyfork.org/scripts/454806/bitbucket-global-search.meta.js
// ==/UserScript==
(() => {
  "use strict";
  var __webpack_exports__ = {};
  ;
  function getLastReps() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://code.fineres.com/rest/api/latest/profile/recent/repos?avatarSize=64&limit=10",
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Accept-Language": "zh,zh-CN;q=0.9,en-US;q=0.8,en;q=0.7",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          cookie: document.cookie
        },
        data: ``,
        onload(response) {
          const result = JSON.parse(response.responseText);
          resolve(result);
        },
        onerror(response) {
          console.error("\u8BF7\u6C42\u5931\u8D25:");
          console.error(response);
          reject(response);
        }
      });
    });
  }
  function getAllPorjects() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://code.fineres.com/rest/categories/latest/projects?start=0&limit=5000&project=",
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Accept-Language": "zh,zh-CN;q=0.9,en-US;q=0.8,en;q=0.7",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          cookie: document.cookie
        },
        data: ``,
        onload(response) {
          const result = JSON.parse(response.responseText);
          resolve(result);
        },
        onerror(response) {
          console.error("\u8BF7\u6C42\u5931\u8D25:");
          console.error(response);
          reject(response);
        }
      });
    });
  }
  function getReposByProject(project) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://code.fineres.com/rest/api/latest/projects/${project}/repos?avatarSize=64&limit=5000`,
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Accept-Language": "zh,zh-CN;q=0.9,en-US;q=0.8,en;q=0.7",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          cookie: document.cookie
        },
        data: ``,
        onload(response) {
          const result = JSON.parse(response.responseText);
          resolve(result);
        },
        onerror(response) {
          console.error("\u8BF7\u6C42\u5931\u8D25:");
          console.error(response);
          reject(response);
        }
      });
    });
  }
  ;
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  let cacheResult = [];
  function appendEntryButton() {
    const nav = document.querySelector(".aui-nav");
    const a = document.createElement("a");
    a.innerText = "\u5168\u5C40\u641C\u7D22";
    a.style.cursor = "pointer";
    const li = document.createElement("li");
    li.appendChild(a);
    nav == null ? void 0 : nav.appendChild(li);
    return a;
  }
  function init() {
    appendDialog();
  }
  function appendDialog() {
    const dialog = document.createElement("div");
    dialog.innerHTML = `
    <div class="aui-dialog2 aui-dialog2-large aui-dialog2-current aui-layer" id="aui-dialog2-1" role="dialog" aria-labelledby="aui-dialog2-1-heading" aria-hidden="true">
      <div class="aui-dialog2-header">
        <h2 class="aui-dialog2-header-main" id="aui-dialog2-1-heading">\u5168\u5C40\u641C\u7D22</h2>
        <a class="aui-dialog2-header-close">
          <span class="aui-icon aui-icon-small aui-iconfont-close-dialog">Close</span>
        </a>
      </div>
      <div class="aui-dialog2-content" style="height: 500px;">
        <div class="aui-field-group">
          <div class="aui-field">
            <form class="aui" onsubmit="return false">
                <input placeholder="\u8BF7\u8F93\u5165\u5173\u952E\u5B57" id="search" class="text" type="search" name="search">
                <input type="button" value="\u5168\u5C40\u641C\u7D22" id="search-button" class="aui-button"></input>
            </form>
          </div>
        </div>
        <div class="search-result-repositories">
          <ol id="search-result-repositories" class="dashboard-repositories-list"></ol>
        </div>
      </div>
      <div class="aui-dialog2-footer">
        <div id="search-progress" style="display: inline-flex;align-items: center;height: 100%;">
        </div>
        <div class="aui-dialog2-footer-actions">
          <button class="aui-button" id="close-btn">\u5173\u95ED</button>
        </div>
      </div>
    </div>
  `;
    document.body.appendChild(dialog);
    AJS.$("#close-btn").click(() => {
      AJS.dialog2("#aui-dialog2-1").hide();
    });
    AJS.$(".aui-iconfont-close-dialog").click(() => {
      AJS.dialog2("#aui-dialog2-1").hide();
    });
    return dialog;
  }
  function renderSearchResult(items) {
    const repositories = document.querySelector("#search-result-repositories");
    if (repositories) {
      repositories;
      repositories.innerHTML = `${items.map((item) => `<li><a href="/projects/${item.project.key}/repos/${item.name}/browse" aria-label="${item.project.name} / ${item.name}"><div class="project-avatar"><div style="display: inline-block; position: relative; outline: 0px;"><span class="css-50fm9s"><span class="css-1gv8fjs" role="img" aria-label="" style="background-image: url('${item.project.avatarUrl}');height: 40px;background-size: contain;"></span></span></div></div><div class="repository-details"><div class="repository-name">${item.name}</div><div class="project-name">${item.project.name}</div></div></a></li>`).join("")}`;
    }
  }
  function renderLoading() {
    const repositories = document.querySelector("#search-result-repositories");
    if (repositories) {
      repositories.innerHTML = `<div class="loading"><div class="loading-spinner" style="height: 100px;width: 100%;display: flex;justify-content: center;align-items: center;"><aui-spinner></aui-spinner></div></div>`;
    }
  }
  function renderEmpty() {
    const repositories = document.querySelector("#search-result-repositories");
    if (repositories) {
      repositories.innerHTML = `<div style="height: 100px;width: 100%;display: flex;justify-content: center;align-items: center;" class="empty">\u6682\u65E0\u6570\u636E</div>`;
    }
  }
  function filterReps(keyWord, render) {
    return __async(this, null, function* () {
      let searchResult = cacheResult;
      if (searchResult.length === 0) {
        const result2 = yield getAllPorjects();
        const projects = result2.result;
        for (let index = 0; index < projects.length; index++) {
          const project = projects[index];
          AJS.$("#search-progress").text(`\u6B63\u5728\u641C\u7D22${project.projectName}\u7684\u4ED3\u5E93`);
          const repo = yield getReposByProject(project.projectKey);
          searchResult = [...searchResult, ...repo.values];
        }
        cacheResult = searchResult;
      }
      const result = searchResult.filter((v) => {
        return v.name.toLowerCase().includes(keyWord.toLowerCase());
      });
      if (result.length > 0) {
        render(result);
      } else {
        renderEmpty();
      }
    });
  }
  function debounce(fn, wait) {
    let timeout = null;
    return function() {
      if (timeout !== null)
        clearTimeout(timeout);
      timeout = window.setTimeout(fn, wait);
    };
  }
  function main() {
    return __async(this, null, function* () {
      appendStyle();
      cacheResult = JSON.parse(localStorage.getItem("bitbucket-search-result") || "[]");
      init();
      appendEntryButton().addEventListener("click", () => __async(this, null, function* () {
        var _a;
        const search = document.getElementById("search");
        search.value = "";
        search.focus();
        const inputAction = debounce(() => {
          if (cacheResult.length === 0)
            return;
          const { value } = search;
          if (value) {
            filterReps(value, renderSearchResult);
          } else {
            renderEmpty();
          }
        }, 500);
        search.addEventListener("input", inputAction);
        AJS.dialog2("#aui-dialog2-1").show();
        (_a = document.getElementById("search")) == null ? void 0 : _a.addEventListener("keydown", (e) => {
          if (e.keyCode === 13) {
            AJS.$("#search-button").click();
          }
        });
        AJS.$("#search-button").click(() => __async(this, null, function* () {
          cacheResult = [];
          const { values } = yield getLastReps();
          const searchText = search.value;
          renderLoading();
          if (!searchText) {
            renderSearchResult(values);
          }
          yield filterReps(searchText, renderSearchResult);
          AJS.$("#search-progress").text("");
          localStorage.setItem("bitbucket-search-result", JSON.stringify(cacheResult));
        }));
      }));
    });
  }
  function appendStyle() {
    GM_addStyle(GM_getResourceText("css"));
    GM_addStyle(`
    .css-50fm9s {
      height: 40px;
      width: 40px;
      -webkit-box-align: stretch;
      align-items: stretch;
      background-color: rgb(255, 255, 255);
      border-radius: 3px;
      box-sizing: content-box;
      cursor: inherit;
      display: flex;
      flex-direction: column;
      -webkit-box-pack: center;
      justify-content: center;
      outline: none;
      overflow: hidden;
      position: static;
      transform: translateZ(0px);
      transition: transform 200ms ease 0s, opacity 200ms ease 0s;
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px;
      border: none;
      margin: 2px;
      padding: 0px;
      font-size: inherit;
      font-family: inherit;
    }
  `);
  }
  setTimeout(() => {
    main();
  }, 500);
})();
