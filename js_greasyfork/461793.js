// ==UserScript==
// @name               Jira-BKEX
// @name:zh-CN         Jira-BKEX
// @description        Beautify the Jira.
// @description:zh-CN  美化Jira。
// @namespace          https://github.com/HaleShaw
// @version            1.1.1
// @author             HaleShaw
// @copyright          2022+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-Jira
// @supportURL         https://github.com/HaleShaw/TM-Jira/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               data:image/svg+xml;base64,PHN2ZyBpZD0iTG9nb3MiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzI2ODRmZjt9LmNscy0ye2ZpbGw6dXJsKCNsaW5lYXItZ3JhZGllbnQpO30uY2xzLTN7ZmlsbDp1cmwoI2xpbmVhci1ncmFkaWVudC0yKTt9PC9zdHlsZT48bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudCIgeDE9IjM4LjExIiB5MT0iMTguNTQiIHgyPSIyMy4xNyIgeTI9IjMzLjQ4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwLjE4IiBzdG9wLWNvbG9yPSIjMDA1MmNjIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMjY4NGZmIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudC0yIiB4MT0iNDIuMDciIHkxPSI2MS40NyIgeDI9IjU2Ljk4IiB5Mj0iNDYuNTUiIHhsaW5rOmhyZWY9IiNsaW5lYXItZ3JhZGllbnQiLz48L2RlZnM+PHRpdGxlPmppcmEgc29mdHdhcmUtaWNvbi1ncmFkaWVudC1ibHVlPC90aXRsZT48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik03NC4xOCwzOCw0Myw2LjlsLTMtM2gwTDE2LjU4LDI3LjMyaDBMNS44NiwzOGEyLjg2LDIuODYsMCwwLDAsMCw0LjA1TDI3LjI4LDYzLjUxLDQwLDc2LjI1LDYzLjQ3LDUyLjgxbC4zNi0uMzZMNzQuMTgsNDIuMDlBMi44NiwyLjg2LDAsMCwwLDc0LjE4LDM4Wk00MCw1MC43N2wtMTAuNy0xMC43TDQwLDI5LjM3bDEwLjcsMTAuN1oiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik00MCwyOS4zN0ExOCwxOCwwLDAsMSw0MCw0TDE2LjU0LDI3LjM3LDI5LjI4LDQwLjExLDQwLDI5LjM3WiIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTUwLjc1LDQwLDQwLDUwLjc3YTE4LDE4LDAsMCwxLDAsMjUuNDhoMEw2My41LDUyLjc4WiIvPjwvc3ZnPg==
// @match              https://jira.leeoom.com/*
// @compatible         Chrome
// @grant              GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/461793/Jira-BKEX.user.js
// @updateURL https://update.greasyfork.org/scripts/461793/Jira-BKEX.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author             HaleShaw
// @collaborator       HaleShaw
// ==/OpenUserJS==

(function () {
  "use strict";

  const menuStyle = `
  a.menuButton {
    background-color: #0065ff !important;
    color: var(--aui-btn-text) !important;
    margin: 0 5px 0 1px !important;
    border: 1px solid #0065ff !important;
    border-radius: 3px !important;
    height: 2.14285714em !important;
    cursor: pointer;
  }

  a.menuButton:hover{
    filter: brightness(1.2) !important;
  }

  span.username {
    margin: 0 5px 0 10px;
  }
  `;

  const boardStyle = `
  #greenhopper_menu_dropdown_recent {
    max-height: 500px !important;
    overflow-y: scroll;
  }

  span.separator {
    border-top: 1px solid var(--aui-dropdown-border-color);
    padding-top: 3px;
    margin-top: 3px;
    display: block;
  }
  `;

  const mainStyle = `
  .ghx-issue .ghx-extra-fields .ghx-extra-field-row {
    float: left !important;
    margin-right: 10px !important;
  }

  /* Hide some unnecessary elements. */
  #header .aui-banner,
  #header .aui-message,
  #jira-header-feedback-link,
  #gh_view_help,
  #view_core_help,
  #rm-roadmaps-webitem-docs,
  #view_about,
  #view_credits,
  .aui-dropdown2-section > strong,
  #admin_pulp_menu,
  #admin_plugins_menu,
  #upm-requests-link,
  #footer {
    display: none !important;
  }
  `;

  // Quick filter class name.
  const ACTIVE_CLASSNAME = "ghx-active";

  // The username array of manager.
  const USERNAME_ARR = ["xiaohongliang", "Hale-Local", "hale"];

  const PROJECT_TOC = `
  <li id="proj_lnk_10009"><a href="/browse/TOC" id="proj_lnk_10009_lnk" class="aui-icon-container" iconurl="/secure/projectavatar?pid=10009&avatarId=10612&size=small" target="_blank"><img class="icon" src="/secure/projectavatar?pid=10009&avatarId=10612&size=small"/>ToC(TOC)</a></li>
  `;
  const PROJECT_TOB = `
  <li id="proj_lnk_10003"><a href="/browse/FK" id="proj_lnk_10003_lnk" class="aui-icon-container" iconurl="/secure/projectavatar?pid=10003&avatarId=10602&size=small" target="_blank"><img class="icon" src="/secure/projectavatar?pid=10003&avatarId=10602&size=small"/>风控系统(FK)</a></li>
  <li id="proj_lnk_10004"><a href="/browse/SH" id="proj_lnk_10004_lnk" class="aui-icon-container" iconurl="/secure/projectavatar?pid=10004&avatarId=10603&size=small" target="_blank"><img class="icon" src="/secure/projectavatar?pid=10004&avatarId=10603&size=small"/>审核系统(SH)</a></li>
  <li id="proj_lnk_10005"><a href="/browse/CW" id="proj_lnk_10005_lnk" class="aui-icon-container" iconurl="/secure/projectavatar?pid=10005&avatarId=10604&size=small" target="_blank"><img class="icon" src="/secure/projectavatar?pid=10005&avatarId=10604&size=small"/>财务系统(CW)</a></li>
  <li id="proj_lnk_10006"><a href="/browse/HHR" id="proj_lnk_10006_lnk" class="aui-icon-container" iconurl="/secure/projectavatar?pid=10006&avatarId=10605&size=small" target="_blank"><img class="icon" src="/secure/projectavatar?pid=10006&avatarId=10605&size=small"/>合伙人系统(HHR)</a></li>
  `;

  const PROJECT_REQ = `
  <li id="proj_lnk_10002"><a href="/browse/REQ" id="proj_lnk_10002_lnk" class="aui-icon-container" iconurl="/secure/projectavatar?pid=10002&avatarId=10601&size=small" target="_blank"><img class="icon" src="/secure/projectavatar?pid=10002&avatarId=10601&size=small"/>需求池(REQ)</a></li>
  <li id="proj_lnk_10001"><a href="/browse/TE" id="proj_lnk_10001_lnk" class="aui-icon-container" iconurl="/secure/projectavatar?pid=10001&avatarId=10324&size=small" target="_blank"><img class="icon" src="/secure/projectavatar?pid=10001&avatarId=10324&size=small"/>测试系统(TE)</a></li>
  `;
  const PROJECT_DATA = `
  <li id="proj_lnk_10008"><a href="/browse/SJ" id="proj_lnk_10008_lnk" class="aui-icon-container" iconurl="/secure/projectavatar?pid=10008&avatarId=10611&size=small" target="_blank"><img class="icon" src="/secure/projectavatar?pid=10008&avatarId=10611&size=small"/>数据中心(SJ)</a></li>
  <li id="proj_lnk_10007"><a href="/browse/SZ" id="proj_lnk_10007_lnk" class="aui-icon-container" iconurl="/secure/projectavatar?pid=10007&avatarId=10608&size=small" target="_blank"><img class="icon" src="/secure/projectavatar?pid=10007&avatarId=10608&size=small"/>市值系统(SZ)</a></li>
  `;
  const BOARDS = `
  <li id="rapidb_lnk_11"><a href="/secure/RapidBoard.jspa?rapidView=11&useStoredSettings=true" id="rapidb_lnk_11_lnk" target="_blank">TOC Board</a></li>
  <li id="rapidb_lnk_29"><a href="/secure/RapidBoard.jspa?rapidView=29&useStoredSettings=true" id="rapidb_lnk_29_lnk" target="_blank">TOC Board - Bug</a></li>
  <li id="rapidb_lnk_30"><a href="/secure/RapidBoard.jspa?rapidView=30&useStoredSettings=true" id="rapidb_lnk_30_lnk" target="_blank">TOC Board - Story</a></li>
  <li id="rapidb_lnk_31"><a href="/secure/RapidBoard.jspa?rapidView=31&useStoredSettings=true" id="rapidb_lnk_31_lnk" target="_blank">TOC-APP Board</a></li>
  <li id="rapidb_lnk_37"><a href="/secure/RapidBoard.jspa?rapidView=37&useStoredSettings=true" id="rapidb_lnk_37_lnk" target="_blank">TOC-APP Board - Bug</a></li>
  <li id="rapidb_lnk_32"><a href="/secure/RapidBoard.jspa?rapidView=32&useStoredSettings=true" id="rapidb_lnk_32_lnk" target="_blank">TOC-Web Board</a></li>
  <li id="rapidb_lnk_38"><a href="/secure/RapidBoard.jspa?rapidView=38&useStoredSettings=true" id="rapidb_lnk_38_lnk" target="_blank">TOC-Web Board - Bug</a></li>
  <li id="rapidb_lnk_33"><a href="/secure/RapidBoard.jspa?rapidView=33&useStoredSettings=true" id="rapidb_lnk_33_lnk" target="_blank">TOC-HY Board</a></li>
  <li id="rapidb_lnk_39"><a href="/secure/RapidBoard.jspa?rapidView=39&useStoredSettings=true" id="rapidb_lnk_39_lnk" target="_blank">TOC-HY Board - Bug</a></li>
  <li id="rapidb_lnk_36"><a href="/secure/RapidBoard.jspa?rapidView=36&useStoredSettings=true" id="rapidb_lnk_36_lnk" target="_blank">TOC-GD Board</a></li>
  <li id="rapidb_lnk_40"><a href="/secure/RapidBoard.jspa?rapidView=40&useStoredSettings=true" id="rapidb_lnk_40_lnk" target="_blank">TOC-GD Board - Bug</a></li>
  <li id="rapidb_lnk_34"><a href="/secure/RapidBoard.jspa?rapidView=34&useStoredSettings=true" id="rapidb_lnk_34_lnk" target="_blank">TOC-XH Board</a></li>
  <li id="rapidb_lnk_41"><a href="/secure/RapidBoard.jspa?rapidView=41&useStoredSettings=true" id="rapidb_lnk_41_lnk" target="_blank">TOC-XH Board - Bug</a></li>
  <li id="rapidb_lnk_35"><a href="/secure/RapidBoard.jspa?rapidView=35&useStoredSettings=true" id="rapidb_lnk_35_lnk" target="_blank">TOC-YY Board</a></li>
  <li id="rapidb_lnk_42"><a href="/secure/RapidBoard.jspa?rapidView=42&useStoredSettings=true" id="rapidb_lnk_42_lnk" target="_blank">TOC-YY Board - Bug</a></li>
  <span class="separator"></span>
  <li id="rapidb_lnk_3"><a href="/secure/RapidBoard.jspa?rapidView=3&useStoredSettings=true" id="rapidb_lnk_3_lnk" target="_blank">FK Board</a></li>
  <li id="rapidb_lnk_13"><a href="/secure/RapidBoard.jspa?rapidView=13&useStoredSettings=true" id="rapidb_lnk_13_lnk" target="_blank">FK Board - Bug</a></li>
  <li id="rapidb_lnk_16"><a href="/secure/RapidBoard.jspa?rapidView=16&useStoredSettings=true" id="rapidb_lnk_16_lnk" target="_blank">FK Board - Story</a></li>
  <li id="rapidb_lnk_4"><a href="/secure/RapidBoard.jspa?rapidView=4&useStoredSettings=true" id="rapidb_lnk_4_lnk" target="_blank">SH Board</a></li>
  <li id="rapidb_lnk_14"><a href="/secure/RapidBoard.jspa?rapidView=14&useStoredSettings=true" id="rapidb_lnk_14_lnk" target="_blank">SH Board - Bug</a></li>
  <li id="rapidb_lnk_17"><a href="/secure/RapidBoard.jspa?rapidView=17&useStoredSettings=true" id="rapidb_lnk_17_lnk" target="_blank">SH Board - Story</a></li>
  <li id="rapidb_lnk_5"><a href="/secure/RapidBoard.jspa?rapidView=5&useStoredSettings=true" id="rapidb_lnk_5_lnk" target="_blank">CW Board</a></li>
  <li id="rapidb_lnk_15"><a href="/secure/RapidBoard.jspa?rapidView=15&useStoredSettings=true" id="rapidb_lnk_15_lnk" target="_blank">CW Board - Bug</a></li>
  <li id="rapidb_lnk_18"><a href="/secure/RapidBoard.jspa?rapidView=18&useStoredSettings=true" id="rapidb_lnk_18_lnk" target="_blank">CW Board - Story</a></li>
  <li id="rapidb_lnk_6"><a href="/secure/RapidBoard.jspa?rapidView=6&useStoredSettings=true" id="rapidb_lnk_6_lnk" target="_blank">HHR Board</a></li>
  <li id="rapidb_lnk_7"><a href="/secure/RapidBoard.jspa?rapidView=7&useStoredSettings=true" id="rapidb_lnk_7_lnk" target="_blank">HHR Board - Bug</a></li>
  <li id="rapidb_lnk_19"><a href="/secure/RapidBoard.jspa?rapidView=19&useStoredSettings=true" id="rapidb_lnk_19_lnk" target="_blank">HHR Board - Story</a></li>
  <span class="separator"></span>
  <li id="rapidb_lnk_10"><a href="/secure/RapidBoard.jspa?rapidView=10&useStoredSettings=true" id="rapidb_lnk_10_lnk" target="_blank">SJ Board</a></li>
  <li id="rapidb_lnk_25"><a href="/secure/RapidBoard.jspa?rapidView=25&useStoredSettings=true" id="rapidb_lnk_25_lnk" target="_blank">SJ Board - Bug</a></li>
  <li id="rapidb_lnk_27"><a href="/secure/RapidBoard.jspa?rapidView=27&useStoredSettings=true" id="rapidb_lnk_27_lnk" target="_blank">SJ Board - Story</a></li>
  <li id="rapidb_lnk_9"><a href="/secure/RapidBoard.jspa?rapidView=9&useStoredSettings=true" id="rapidb_lnk_9_lnk" target="_blank">SZ Board</a></li>
  <li id="rapidb_lnk_26"><a href="/secure/RapidBoard.jspa?rapidView=26&useStoredSettings=true" id="rapidb_lnk_26_lnk" target="_blank">SZ Board - Bug</a></li>
  <li id="rapidb_lnk_28"><a href="/secure/RapidBoard.jspa?rapidView=28&useStoredSettings=true" id="rapidb_lnk_28_lnk" target="_blank">SZ Board - Story</a></li>
  <span class="separator"></span>
  <li id="rapidb_lnk_2"><a href="/secure/RapidBoard.jspa?rapidView=2&useStoredSettings=true" id="rapidb_lnk_2_lnk" target="_blank">REQ Board</a></li>
  <li id="rapidb_lnk_1"><a href="/secure/RapidBoard.jspa?rapidView=1&useStoredSettings=true" id="rapidb_lnk_1_lnk" target="_blank">TE Board</a></li>
  <li id="rapidb_lnk_12"><a href="/secure/RapidBoard.jspa?rapidView=12&useStoredSettings=true" id="rapidb_lnk_12_lnk" target="_blank">TE Board - Bug</a></li>
  <li id="rapidb_lnk_8"><a href="/secure/RapidBoard.jspa?rapidView=8&useStoredSettings=true" id="rapidb_lnk_8_lnk" target="_blank">TE Board - Story</a></li>
  `;

  main();

  function main() {
    GM_addStyle(mainStyle);
    GM_addStyle(boardStyle);
    GM_addStyle(menuStyle);
    logInfo(GM_info.script.name, GM_info.script.version);
    findFilter();
    if (isManager()) {
      customizeProjectsBoards();
    }
    addShowNameButton();
  }

  function findFilter() {
    let timeout = 0;
    let interval = setInterval(() => {
      timeout++;
      let filterList = document.querySelectorAll("dd > a.js-quickfilter-button");

      // Stop the circulator when the element is found or after 10 seconds(100*100 ms).
      if (filterList.length > 0 || timeout == 100) {
        clearInterval(interval);
        if (timeout == 100) {
          console.warn("There is no filter button on this page.");
          return;
        }
        updateFilter();
      }
    }, 100);
  }

  function updateFilter() {
    let filterList = document.querySelectorAll("dd > a.js-quickfilter-button");
    filterList.forEach(filter => {
      filter.onclick = function () {
        for (let i = 0; i < filterList.length; i++) {
          const element = filterList[i];
          if (element.className.indexOf(ACTIVE_CLASSNAME) != -1) {
            element.click();
          }
        }
        filter.click();
      };
    });
  }

  function isManager() {
    let user = document.querySelector("#header-details-user-fullname");
    return (
      user &&
      user.getAttribute("data-displayname") &&
      USERNAME_ARR.indexOf(user.getAttribute("data-displayname")) != -1
    );
  }

  function customizeProjectsBoards() {
    let projects = document.querySelector("#browse_link");
    if (!projects) {
      return;
    }
    projects.onclick = function () {
      let timeout = 0;
      let interval = setInterval(() => {
        timeout++;
        let projectCurrent = document.querySelector("#project_current");
        if (projectCurrent || timeout == 100) {
          clearInterval(interval);
        }
        if (projectCurrent) {
          projectCurrent.innerHTML = PROJECT_TOC;
          document.querySelector("#project_history_main > ul.aui-list-truncate").innerHTML =
            PROJECT_TOB;
          document.querySelector("#project_types_main > ul.aui-list-truncate").innerHTML =
            PROJECT_REQ;
          document.querySelector("#project_view_all > ul.aui-list-truncate").innerHTML =
            PROJECT_DATA;
        }
      }, 50);
    };
    document.querySelector("#greenhopper_menu").onclick = function () {
      let timeout = 0;
      let interval = setInterval(() => {
        timeout++;
        let boardList = document.querySelector("#greenhopper_menu_dropdown_recent");
        if (boardList || timeout == 100) {
          clearInterval(interval);
        }
        if (boardList) {
          boardList.innerHTML = BOARDS;
        }
      }, 50);
    };
  }

  /**
   * Add a button to show or hide the account name on the menu bar.
   */
  function addShowNameButton() {
    let parentObj = document.querySelector("div.aui-header-secondary>ul.aui-nav");
    if (!parentObj) {
      return;
    }
    let treeButton = $(
      '<li><a id="showName" class="aui-button aui-button-primary menuButton" title="Show or hide the username before the avatar icon.">ShowName</a></li>'
    );
    parentObj.insertBefore(treeButton[0], parentObj.children[0]);
    $("#showName").click(function () {
      showName();
    });
  }

  /**
   * Show or hide the username before the avatar icon.
   */
  function showName() {
    let imgs = document.querySelectorAll("img.ghx-avatar-img");
    imgs.forEach(img => {
      let pre = img.previousElementSibling;
      if (pre != img && pre && pre.className == "username") {
        pre.remove();
        return;
      }
      let altStr = img.getAttribute("alt");
      let name = getNameByAlt(altStr);
      if (!name || name == "") {
        return;
      }

      let span = document.createElement("span");
      span.className = "username";
      span.textContent = name;
      img.parentElement.insertBefore(span, img);
    });
  }

  /**
   * Get the account name by the prompt string.
   * @param {String} altStr The prompt string.
   * @returns name.
   */
  function getNameByAlt(altStr) {
    if (!altStr || altStr.trim() == "") {
      return "";
    }
    const KEY1 = ": ";
    const KEY2 = "'s avatar";
    const KEY3 = "的头像";
    altStr = altStr.trim();
    let name = "";
    if (altStr.indexOf(KEY1) != -1) {
      name = altStr.split(KEY1)[1];
    } else if (altStr.indexOf(KEY2) != -1) {
      name = altStr.split(KEY2)[0];
    } else if (altStr.indexOf(KEY3) != -1) {
      name = altStr.split(KEY3)[0];
    }
    if (name) {
      name = name.trim();
    }
    return name;
  }

  /**
   * Log the title and version at the front of the console.
   * @param {String} title title.
   * @param {String} version script version.
   */
  function logInfo(title, version) {
    console.clear();
    const titleStyle = "color:white;background-color:#606060";
    const versionStyle = "color:white;background-color:#1475b2";
    const logTitle = " " + title + " ";
    const logVersion = " " + version + " ";
    console.log("%c" + logTitle + "%c" + logVersion, titleStyle, versionStyle);
  }
})();