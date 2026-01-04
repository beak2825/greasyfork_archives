/* eslint-disable indent */
/* eslint-disable no-use-before-define */
/* eslint-disable max-lines */
/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

// ==UserScript==
// @namespace   ysys
// @name        Jenkins Helper
// @version     1.0.0
// @description assistant tool of jenkins
// @author      K.Arthur
// @grant       none
// @license     MIT
// @include     https://jenkins.yishifuwu.cn 
// @downloadURL https://update.greasyfork.org/scripts/464865/Jenkins%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/464865/Jenkins%20Helper.meta.js
// ==/UserScript==

(function () {
  if (location.host !== "jenkins.yishifuwu.cn") {
    return;
  }

  // ---------------------------------------------------- CONSTANT ----------------------------------------------------
  const DB_NAME = "https://jenkins.yishifuwu.cn";
  const DB_VERSION = 1;
  const STORE_NAME = "history";
  const MAX_HISTORY_TAB = 5;
  const MAX_HISTORY_LIST = 32;
  const ENABLE_AUTO_DETECT = true;
  const ENABLE_AUTO_COMPLETE = true;
  const ENABLE_AUTO_ROUTE = true;
  const ENABLE_FAST_ROUTE = true;
  const ENABLE_SCROLL_VIEW = true;
  const ENABLE_AUTO_SUBMIT = true;
  const ENABLE_CLEAN_VIEW = true;
  const ENABLE_PRECISE_SOURCE = true;
  const ENABLE_CUTE_GREETING = true;
  const ENABLE_COMPACT_MODE = true;
  const INPUT_SPACE_PERCENT = "75%";
  const AUTO_BUILD_DELAY = 300;
  const DOM_OPERATE_DELAY = 0;
  let DEV_ROLE = "frontend";
  let ENABLE_SHOW = true;

  // ------------------------------------------------------ UTILS ------------------------------------------------------
  const getTestInputs = () => {
    let jenkinsInputs = document.getElementsByClassName("jenkins-input");

    // compatible to frontend
    if (DEV_ROLE === "frontend" && jenkinsInputs.length < 4) {
      const dummyInput = document.createElement("input");
      dummyInput.className = "jenkins-input";
      dummyInput.style.display = "none";
      document.getElementById("side-panel").appendChild(dummyInput);
      jenkinsInputs = document.getElementsByClassName("jenkins-input");
    }

    return jenkinsInputs;
  };
  const getNonTestInputs = () => {
    return document.getElementsByClassName("jenkins-input");
  };
  const parseQueryParams = (qs) => {
    if (!qs) {
      qs = location.search.length > 0 ? location.search.substring(1) : "";
    } else {
      qs = qs.substring(qs.indexOf("?") + 1);
    }
    const items = qs.length ? qs.split("&") : [];

    const params = {};
    let name = null;
    let value = null;
    items.forEach((item) => {
      const itemPair = item.split("=");
      name = decodeURIComponent(itemPair[0]);
      value = decodeURIComponent(itemPair[1]);

      if (name) {
        params[name] = value;
      }
    });

    return params;
  };

  // ---------------------------------------------------- FEATURES ----------------------------------------------------
  // greeting
  (function () {
    if (!ENABLE_CUTE_GREETING) {
      return;
    }

    const greetings = [
      "夜深了，请早点休息~",
      "咦，在做什么呢?",
      "新的一天，加油吧，少年！",
      "工作之余，请注意休息~",
      "工作之余，请注意休息~",
      "工作之余，请注意休息~",
      "快下班啦，请坚持，少年！",
      "夜深了，请早点休息~",
    ];
    if (
      location.href === "https://jenkins.yishifuwu.cn" ||
      location.href === "https://jenkins.yishifuwu.cn/"
    ) {
      const envElement = document.createElement("div");
      envElement.innerHTML = greetings[Math.floor(new Date().getHours() / 3)];
      envElement.style.position = "absolute";
      envElement.style.right = ".5rem";
      document.getElementById("breadcrumbs").appendChild(envElement);
    }
  })();

  // auto-detect
  (function () {
    if (!ENABLE_AUTO_DETECT) {
      return;
    }

    if (location.pathname.indexOf("backend") > -1) {
      DEV_ROLE = "backend";
    }

    if (location.pathname.indexOf("frontend") > -1) {
      DEV_ROLE = "frontend";
    }
  })();

  // auto-complete
  (function autoComplete() {
    const queryParams = parseQueryParams();

    // backend
    if (location.href.indexOf(`all-general-${DEV_ROLE}-test/build`) > -1) {
      const jenkinsInputs = getTestInputs();
      if (queryParams.init) {
        const initValue = JSON.parse(decodeURIComponent(queryParams.init));
        jenkinsInputs[0].value = initValue.gitlab_code_dir;
        jenkinsInputs[1].value = initValue.gitlab_code_repo_url;
        jenkinsInputs[2].value = initValue.gitlab_code_repo_branch;
        jenkinsInputs[3].value = initValue.gitlab_config_repo_url;
      } else {
        jenkinsInputs[0].value = ".";
        jenkinsInputs[1].value = "";
        jenkinsInputs[2].value = "feature-canary";
        jenkinsInputs[3].value = "";
      }
      // jenkinsInputs[0].name = "value-0";
      // jenkinsInputs[1].name = "value-1";
      // jenkinsInputs[2].name = "value-2";
      // jenkinsInputs[3].name = "value";
      jenkinsInputs[1].focus();
      for (const jenkinsInput of jenkinsInputs) {
        jenkinsInput.style.width = INPUT_SPACE_PERCENT;
      }
      if (ENABLE_AUTO_COMPLETE) {
        document.getElementsByTagName("form")[1].autocomplete = "on";
        jenkinsInputs[0].autocomplete = "on";
        jenkinsInputs[1].autocomplete = "url";
        jenkinsInputs[2].autocomplete = "on";
        jenkinsInputs[3].autocomplete = "url";
      }

      if (ENABLE_AUTO_SUBMIT) {
        if (parseInt(queryParams.submit) === 1) {
          setTimeout(() => {
            document.getElementById("yui-gen1-button").click();
          }, AUTO_BUILD_DELAY);
        }
      }
    }

    // frontend
    if (
      location.href.indexOf(`all-general-${DEV_ROLE}-pre/build`) > -1 ||
      location.href.indexOf(`all-general-${DEV_ROLE}-pro/build`) > -1
    ) {
      const jenkinsInputs = getNonTestInputs();
      jenkinsInputs[0].value = "";
      jenkinsInputs[0].focus();
      jenkinsInputs[0].style.width = INPUT_SPACE_PERCENT;
      if (ENABLE_AUTO_COMPLETE) {
        document.getElementsByTagName("form")[1].autocomplete = "url";
      }

      if (ENABLE_AUTO_SUBMIT) {
        if (parseInt(queryParams.submit) === 1) {
          setTimeout(() => {
            document.getElementById("yui-gen1-button").click();
          }, AUTO_BUILD_DELAY);
        }
      }
    }

    // golang - template resolution
    if (location.href.indexOf("golang-two-port-pipline/build") > -1) {
      const jenkinsInputs = getTestInputs();
      jenkinsInputs[0].value = ".";
      jenkinsInputs[1].value = "";
      jenkinsInputs[2].value = "feature-canary";
      jenkinsInputs[3].value = "";
      jenkinsInputs[1].focus();

      document.getElementsByTagName("form")[1].autocomplete = "on";
      jenkinsInputs[0].autocomplete = "on";
      jenkinsInputs[1].autocomplete = "url";
      jenkinsInputs[2].autocomplete = "on";
      jenkinsInputs[3].autocomplete = "url";
    }
  })();

  // auto-route
  (function autoRoute() {
    if (!ENABLE_AUTO_ROUTE) {
      return;
    }

    if (
      location.href === `https://jenkins.yishifuwu.cn/view/test-${DEV_ROLE}/`
    ) {
      location.href += `job/all-general-${DEV_ROLE}-test/`;
    }
    if (
      location.href === `https://jenkins.yishifuwu.cn/view/pre-${DEV_ROLE}/`
    ) {
      location.href += `job/all-general-${DEV_ROLE}-pre/`;
    }
    if (
      location.href === `https://jenkins.yishifuwu.cn/view/master-${DEV_ROLE}/`
    ) {
      location.href += `job/all-general-${DEV_ROLE}-pro/`;
    }
  })();

  // fast-route
  (function fastRoute() {
    if (!ENABLE_FAST_ROUTE) {
      return;
    }

    if (location.href.indexOf(`/job/all-general-${DEV_ROLE}`) > -1) {
      const envElement = document.createElement("div");
      const suffix = location.pathname.endsWith("/build") ? "build" : "";
      envElement.innerHTML = `
      <a href="https://jenkins.yishifuwu.cn/">Home</>&nbsp;|&nbsp;
      <a href="https://jenkins.yishifuwu.cn/view/test-${DEV_ROLE}/job/all-general-${DEV_ROLE}-test/${suffix}">Test</>&nbsp;|&nbsp;
        <a href="https://jenkins.yishifuwu.cn/view/pre-${DEV_ROLE}/job/all-general-${DEV_ROLE}-pre/${suffix}">Pre</>&nbsp;|&nbsp;
        <a href="https://jenkins.yishifuwu.cn/view/master-${DEV_ROLE}/job/all-general-${DEV_ROLE}-pro/${suffix}">Pro</>
      `;
      envElement.style.position = "absolute";
      envElement.style.right = ".5rem";
      document.getElementById("breadcrumbs").appendChild(envElement);
    }
  })();

  // scroll-view
  (function () {
    if (!ENABLE_SCROLL_VIEW) {
      return;
    }

    if (location.pathname.endsWith("/console")) {
      const scrollTab = document.createElement("div");
      scrollTab.id = "console-scroll-tab";
      scrollTab.style.position = "absolute";
      scrollTab.style.right = ".5rem";
      scrollTab.style.top = "40px";
      scrollTab.innerHTML = `<button id="console-top">&uarr;</button><button id="console-bottom">&darr;</button>`;
      document.getElementById("breadcrumbs").appendChild(scrollTab);

      document
        .getElementById("console-top")
        .addEventListener("click", (event) => {
          window.scrollTo(0, 0);
        });
      document
        .getElementById("console-bottom")
        .addEventListener("click", (event) => {
          window.scrollTo(0, document.documentElement.scrollHeight);
        });
    }
  })();

  // recent-history
  (function recentHistory() {
    // render test-build view
    function renderTestView() {
      if (location.pathname.endsWith(`/all-general-${DEV_ROLE}-test/`)) {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, {
              keyPath: "gitlab_config_repo_url",
            });
          }
        };

        const renderList = (event) => {
          const db = request.result;
          console.log("open history db success");
          readTestBuildHistory(db, (results) => {
            // remove current project history list
            const oldHistoryPanel = document.getElementById(
              "build-project-history",
            );
            if (oldHistoryPanel) {
              oldHistoryPanel.remove();
            }

            // append new project history list
            const historyPanel = document.createElement("div");
            historyPanel.id = "build-project-history";
            historyPanel.style.position = "absolute";
            historyPanel.style.right = ".5rem";
            historyPanel.style.top = ENABLE_CLEAN_VIEW ? "7rem" : "16rem";
            historyPanel.innerHTML = `<h4 style="display: inline;">Project History:</h4>&nbsp;
            <button id="build-show">${ENABLE_SHOW ? "Hide" : "Show"}</button>`;
            const historyList = document.createElement("ul");
            historyList.style.paddingLeft = "1rem";
            historyList.hidden = !ENABLE_SHOW;
            let innerHTML = "";
            for (const result of results) {
              const url = result.gitlab_code_repo_url;
              const urlSegments = url.split("/");
              const projectName = urlSegments[urlSegments.length - 1];
              const subProjectName =
                result.gitlab_code_dir.length > 1
                  ? `:${result.gitlab_code_dir}`
                  : "";
              const data = `${url}___${result.gitlab_config_repo_url}___${result.gitlab_code_dir}___${result.gitlab_code_repo_branch}___${result.dev_role}`;
              innerHTML += `<li>
                ${projectName.replace(".git", "") + subProjectName}@${
                result.gitlab_code_repo_branch
              }&nbsp;|&nbsp;
                <button class="build-build" data="${data}" data-submit="0">Check</button>&nbsp;|&nbsp;
                <button class="build-build" data="${data}" data-submit="1">Build</button>
              </li>`;
            }
            historyList.innerHTML = innerHTML;
            historyPanel.appendChild(historyList);
            document.getElementById("main-panel").appendChild(historyPanel);

            // add show-button listener
            const buildShowButton = document.getElementById("build-show");
            buildShowButton.onclick = function () {
              ENABLE_SHOW = !ENABLE_SHOW;
              buildShowButton.innerHTML = ENABLE_SHOW ? "Hide" : "Show";
              historyList.hidden = !ENABLE_SHOW;
            };

            // add build-button listener
            const buildRemoveButtons =
              document.getElementsByClassName("build-build");
            for (const buildRemoveButton of buildRemoveButtons) {
              buildRemoveButton.onclick = function () {
                const dataAttributes = this.getAttribute("data").split("___");
                const result = {
                  gitlab_config_repo_url: dataAttributes[1],
                  gitlab_code_repo_url: dataAttributes[0],
                  gitlab_code_dir: dataAttributes[2],
                  gitlab_code_repo_branch: dataAttributes[3],
                  dev_role: dataAttributes[4],
                  version: null,
                };
                const data = encodeURIComponent(JSON.stringify(result));
                location.href = `https://jenkins.yishifuwu.cn/view/test-${
                  result.dev_role
                }/job/all-general-${
                  result.dev_role
                }-test/build?delay=0sec&submit=${this.getAttribute(
                  "data-submit",
                )}&init=${data}`;
              };
            }
          });
        };
        request.onsuccess = renderList;
      }
    }

    // render test-build view
    function renderTestBuildView() {
      if (location.href.indexOf(`/all-general-${DEV_ROLE}-test/build`) > -1) {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, {
              keyPath: "gitlab_config_repo_url",
            });
          }
        };

        const renderList = (event) => {
          const db = request.result;
          console.log("open history db success");
          readTestBuildHistory(db, (results) => {
            // remove current project history list
            const oldHistoryPanel = document.getElementById(
              "build-project-history",
            );
            if (oldHistoryPanel) {
              oldHistoryPanel.remove();
            }

            // append new project history list
            const historyPanel = document.createElement("div");
            historyPanel.id = "build-project-history";
            historyPanel.style.position = "absolute";
            historyPanel.style.right = ".5rem";
            historyPanel.style.top = "7rem";
            historyPanel.innerHTML = `<h4 style="display: inline;">Project History:</h4>&nbsp;
            <button id="build-show">${ENABLE_SHOW ? "Hide" : "Show"}</button>`;
            const historyList = document.createElement("ul");
            historyList.style.paddingLeft = "1rem";
            historyList.hidden = !ENABLE_SHOW;
            let innerHTML = "";
            for (const result of results) {
              const key = result.gitlab_config_repo_url;
              const url = result.gitlab_code_repo_url;
              const urlSegments = url.split("/");
              const projectName = urlSegments[urlSegments.length - 1];
              const subProjectName =
                result.gitlab_code_dir.length > 1
                  ? `:${result.gitlab_code_dir}`
                  : "";
              const data = `${url}___${result.gitlab_config_repo_url}___${result.gitlab_code_dir}___${result.gitlab_code_repo_branch}`;
              innerHTML += `<li>
                ${projectName.replace(".git", "") + subProjectName}&nbsp;|&nbsp;
                <a href="${
                  ENABLE_PRECISE_SOURCE
                    ? url.replace(
                        ".git",
                        `/-/tree/${result.gitlab_code_repo_branch}`,
                      )
                    : url
                }" target="_blank">Code</a>&nbsp;|&nbsp;
                <a href="${key.replace(
                  ".git",
                  "/-/tree/test",
                )}" target="_blank">Config</a>&nbsp;|&nbsp;
                <button class="build-fill" data="${data}">Fill</button>&nbsp;|&nbsp;
                <button class="build-remove" data="${key}">Remove</button>
              </li>`;
            }
            innerHTML += `<hr/><button id="build-refresh">Refresh</button>&nbsp;|&nbsp;
            <button id="build-export">Export</button>&nbsp;|&nbsp;
            <button id="build-import">Import</button>`;
            historyList.innerHTML = innerHTML;
            historyPanel.appendChild(historyList);
            document.getElementById("main-panel").appendChild(historyPanel);

            // add show-button listener
            const buildShowButton = document.getElementById("build-show");
            buildShowButton.onclick = function () {
              ENABLE_SHOW = !ENABLE_SHOW;
              buildShowButton.innerHTML = ENABLE_SHOW ? "Hide" : "Show";
              historyList.hidden = !ENABLE_SHOW;
            };

            // add fill-button listener
            const buildFillButtons =
              document.getElementsByClassName("build-fill");
            for (const buildFillButton of buildFillButtons) {
              buildFillButton.onclick = function () {
                const dataAttributes = this.getAttribute("data").split("___");
                const jenkinsInputs = getTestInputs();
                jenkinsInputs[0].value = dataAttributes[2];
                jenkinsInputs[1].value = dataAttributes[0];
                jenkinsInputs[2].value = dataAttributes[3];
                jenkinsInputs[3].value = dataAttributes[1];
              };
            }

            // add remove-button listener
            const buildRemoveButtons =
              document.getElementsByClassName("build-remove");
            for (const buildRemoveButton of buildRemoveButtons) {
              buildRemoveButton.onclick = function () {
                const data = this.getAttribute("data");
                removeTestBuildHistory(db, data);
                renderList();
              };
            }

            // add refresh/export/import button listener
            const buildRefreshButton = document.getElementById("build-refresh");
            buildRefreshButton.onclick = function () {
              writeTestBuildHistory(db);
              renderList();
            };
            const buildExportButton = document.getElementById("build-export");
            buildExportButton.onclick = function () {
              navigator.clipboard.writeText(JSON.stringify(results));
              alert("project history copied");
            };
            const buildImportButton = document.getElementById("build-import");
            buildImportButton.onclick = function () {
              const histories = JSON.parse(
                window.prompt("please paste project history", "[]"),
              );
              for (const history of histories) {
                writeTestBuildHistory(db, history);
              }
              renderList();
            };
          });

          // add submit listener
          window.addEventListener("submit", (event) => {
            writeTestBuildHistory(db);
          });
        };
        request.onsuccess = renderList;
      }
    }

    // render pre/pro-build view
    function renderNonTestBuildView() {
      if (
        location.href.indexOf(`/all-general-${DEV_ROLE}-pre/build`) > -1 ||
        location.href.indexOf(`/all-general-${DEV_ROLE}-pro/build`) > -1
      ) {
        const isPre =
          location.href.indexOf(`/all-general-${DEV_ROLE}-pre/build`) > -1;
        const request = window.indexedDB.open(
          "https://jenkins.yishifuwu.cn",
          DB_VERSION,
        );
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, {
              keyPath: "gitlab_config_repo_url",
            });
          }
        };

        request.onsuccess = (event) => {
          const db = request.result;
          console.log("open history db success");
          readTestBuildHistory(db, (results) => {
            // remove current project history list
            const oldHistoryList = document.getElementById(
              "build-project-history",
            );
            if (oldHistoryList) {
              oldHistoryList.remove();
            }

            // append new project history list
            const historyPanel = document.createElement("div");
            historyPanel.id = "build-project-history";
            historyPanel.style.position = "absolute";
            historyPanel.style.right = ".5rem";
            historyPanel.style.top = "7rem";
            historyPanel.innerHTML = `<h4 style="display: inline;">Project History:</h4>&nbsp;
            <button id="build-show">${ENABLE_SHOW ? "Hide" : "Show"}</button>`;
            const historyList = document.createElement("ul");
            historyList.style.paddingLeft = "1rem";
            historyList.hidden = !ENABLE_SHOW;
            let innerHTML = "";

            if (results.length > 0) {
              for (const result of results) {
                const key = result.gitlab_config_repo_url;
                const url = result.gitlab_code_repo_url;
                const urlSegments = url.split("/");
                const projectName = urlSegments[urlSegments.length - 1];
                const subProjectName =
                  result.gitlab_code_dir.length > 1
                    ? `:${result.gitlab_code_dir}`
                    : "";
                innerHTML += `<li>
                  ${
                    projectName.replace(".git", "") + subProjectName
                  }&nbsp;|&nbsp;
                  <a href="${key.replace(
                    ".git",
                    isPre ? "/-/tree/pre" : "/-/tree/master",
                  )}" target="_blank">Config</a>&nbsp;|&nbsp;
                  <button class="build-fill" data="${key}">Fill</button>
                </li>`;
              }
            } else {
              innerHTML += "<hr/>No History Exists Yet!";
            }
            historyList.innerHTML = innerHTML;
            historyPanel.appendChild(historyList);
            document.getElementById("main-panel").appendChild(historyPanel);

            // add show-button listener
            const buildShowButton = document.getElementById("build-show");
            buildShowButton.onclick = function () {
              ENABLE_SHOW = !ENABLE_SHOW;
              buildShowButton.innerHTML = ENABLE_SHOW ? "Hide" : "Show";
              historyList.hidden = !ENABLE_SHOW;
            };

            // add fill-button listener
            const buildFillButtons =
              document.getElementsByClassName("build-fill");
            for (const buildFillButton of buildFillButtons) {
              buildFillButton.onclick = function () {
                const jenkinsInputs = getNonTestInputs();
                jenkinsInputs[0].value = this.getAttribute("data");
              };
            }
          });
        };
      }
    }

    // render home view
    function renderHomeView() {
      if (
        location.href === "https://jenkins.yishifuwu.cn" ||
        location.href === "https://jenkins.yishifuwu.cn/"
      ) {
        const request = window.indexedDB.open(
          "https://jenkins.yishifuwu.cn",
          DB_VERSION,
        );
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, {
              keyPath: "gitlab_config_repo_url",
            });
          }
        };

        request.onsuccess = (event) => {
          const db = request.result;
          console.log("open history db success");
          readTestBuildHistory(
            db,
            (results) => {
              if (results.length < 1) {
                return;
              }
              results = results.slice(0, MAX_HISTORY_TAB);

              // remove current project history list
              const oldHistoryList = document.getElementById(
                "build-project-history",
              );
              if (oldHistoryList) {
                oldHistoryList.remove();
              }

              // append new project history list
              const historyTab = document.createElement("p");
              historyTab.id = "build-project-history";
              historyTab.style.position = "absolute";
              historyTab.style.right = ".5rem";
              historyTab.style.top = "5rem";
              let innerHTML = "";
              if (results.length > 0) {
                results = results.slice(0, MAX_HISTORY_TAB);
                innerHTML += `Recent:&nbsp;`;
                for (const result of results) {
                  const url = result.gitlab_code_repo_url;
                  const urlSegments = url.split("/");
                  const projectName = urlSegments[urlSegments.length - 1];
                  const subProjectName =
                    result.gitlab_code_dir.length > 1
                      ? `:${result.gitlab_code_dir}`
                      : "";
                  const data = encodeURIComponent(JSON.stringify(result));
                  innerHTML += `&nbsp;<a href="https://jenkins.yishifuwu.cn/view/test-${
                    result.dev_role
                  }/job/all-general-${
                    result.dev_role
                  }-test/build?delay=0sec&init=${data}">${
                    projectName.replace(".git", "") + subProjectName
                  }</a>&nbsp;|`;
                }
              }
              innerHTML += `&nbsp;<a href="https://jenkins.yishifuwu.cn/view/test-backend/job/all-general-backend-test/build">B</a>/<a href="https://jenkins.yishifuwu.cn/view/test-frontend/job/all-general-frontend-test/build">F</a>/<a href="https://jenkins.yishifuwu.cn/view/other/job/golang-two-port-pipline/build">G</a>`;
              historyTab.innerHTML = innerHTML;
              document.getElementById("main-panel").appendChild(historyTab);
            },
            true,
          );
        };
      }
    }

    function readTestBuildHistory(db, renderFunction, ignoreDevRole) {
      const objectStore = db.transaction(STORE_NAME).objectStore(STORE_NAME);
      const results = [];

      objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (ignoreDevRole || cursor.value.dev_role === DEV_ROLE) {
            results.push({
              gitlab_config_repo_url: cursor.key,
              gitlab_code_repo_url: cursor.value.gitlab_code_repo_url,
              gitlab_code_dir: cursor.value.gitlab_code_dir,
              gitlab_code_repo_branch: cursor.value.gitlab_code_repo_branch,
              dev_role: cursor.value.dev_role,
              version: cursor.value.version,
            });
          }
          cursor.continue();
        } else {
          results
            .sort((a1, a2) => a2.version - a1.version)
            .slice(0, MAX_HISTORY_LIST);
          renderFunction(results);
          console.log("no more project history");
        }
      };
    }

    function writeTestBuildHistory(db, history) {
      let request = null;

      if (!history) {
        const jenkinsInputs = getTestInputs();
        if (
          !jenkinsInputs[1].value.startsWith(
            "http://gitlab-ysys.yishifuwu.cn/",
          ) ||
          !jenkinsInputs[3].value.startsWith("http://gitlab.yishifuwu.cn/")
        ) {
          return;
        }

        request = db
          .transaction([STORE_NAME], "readwrite")
          .objectStore(STORE_NAME)
          .put({
            gitlab_code_dir: jenkinsInputs[0].value,
            gitlab_code_repo_branch: jenkinsInputs[2].value,
            gitlab_code_repo_url: jenkinsInputs[1].value,
            gitlab_config_repo_url: jenkinsInputs[3].value,
            dev_role: DEV_ROLE,
            version: Date.now(),
          });
      } else {
        request = db
          .transaction([STORE_NAME], "readwrite")
          .objectStore(STORE_NAME)
          .put(history);
      }

      request.onsuccess = (event) => {
        console.log("update project history success");
      };

      request.onerror = (event) => {
        console.error("update project history fail");
      };
    }

    function removeTestBuildHistory(db, keyPath) {
      const request = db
        .transaction([STORE_NAME], "readwrite")
        .objectStore(STORE_NAME)
        .delete(keyPath);

      request.onsuccess = (event) => {
        console.log("delete project history success");
      };
    }

    // execute view render
    renderTestView();
    renderTestBuildView();
    renderNonTestBuildView();
    renderHomeView();
  })();

  // clean view
  (function () {
    if (!ENABLE_CLEAN_VIEW) {
      return;
    }

    function hideBySelector(selector) {
      setTimeout(() => {
        try {
          document.querySelector(selector).style.display = "none";
        } catch (error) {
          console.warn(`clean view-${selector} fail`, error);
        }
      }, DOM_OPERATE_DELAY);
    }

    hideBySelector("#main-panel>a[name='skip2content']");
    hideBySelector("#main-panel>.job-index-headline");
    hideBySelector("#main-panel>#description");
    hideBySelector("#disable-project");
  })();

  // compact mode
  (function () {
    if (!ENABLE_COMPACT_MODE) {
      return;
    }

    setTimeout(() => {
      document.getElementById("side-panel").style.width = "320px";
    }, DOM_OPERATE_DELAY);
  })();
})();

// ----------------------------------------------------- FILE END -----------------------------------------------------
