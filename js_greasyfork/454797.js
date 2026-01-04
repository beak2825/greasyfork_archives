// ==UserScript==
// @name               Teambition
// @name:zh-CN         Teambition
// @description        Beautify the Teambition.
// @description:zh-CN  美化Teambition。
// @namespace          https://github.com/HaleShaw
// @version            1.0.3
// @author             HaleShaw
// @copyright          2022+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-Teambition
// @supportURL         https://github.com/HaleShaw/TM-Teambition/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAA21BMVEUAAAAyr/8bofcSm/dOuv4OnPUWnvZKufwRm/Ugo/cLmPRFtvtVvv0wq/krqfgGlfRPvP1As/sboPcLmPVVvv01rvolpvcFlfRKuv0Rm/ZTvv46sfsGlvROuv1EtfsMl/RUvv4/tf0xrPo7sfs2rvtLuv1AtPwQm/b///9Gt/3j9P9RvP4mpvkdovcaoPf6/f8LmPXD5/1QvP10x/xbvftWu/twxPpHtPksqfkrqfnm9f7T7f664/2S0/16y/2r3fxlwPrp9v7d8f6g2v6z4PyZ1vyCzPw9sPpQtvl1UhomAAAAInRSTlMACJQ/Ghr+/Pz+/vz39/f37Ozs7NfX19eurpWVlZKSkj8/xzBnxQAAAMZJREFUGNMtz0cWgkAQBNAeQMCcc86gAwoCEgWz9z+RPfP4iw61K0BEnPTr9f5EJMAV5u3SGZXa8wL/h+o+pw4xIYIsm6ZhmDhkVSAgtgzX8zLnd00sx2iJIBRpfH9EVuqF2osWBehRP9ZQmKXRhdIe1ALf/bwt7XBdff0gqEF1xVxOGDBV6G4YDBR+dGG8Zm6ng82PMSybO4SBy3ZzCWRW1nXdSZ5HXOUZ1pEGyjanDCRA0rRhH5HdmErAkcWoU6l0RgtW/w98aR8lvTImwwAAAABJRU5ErkJggg==
// @match              https://www.teambition.com/project/*
// @match              https://www.teambition.com/organization/*
// @match              https://apps.teambition.com/work-time-client/*
// @compatible	       Chrome
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/454797/Teambition.user.js
// @updateURL https://update.greasyfork.org/scripts/454797/Teambition.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author             HaleShaw
// @collaborator       HaleShaw
// ==/OpenUserJS==

(function () {
  'use strict';

  let data;

  const mainStyle = `
  /* 任务面板 */

  /* 看板模式下，将任务卡片的任务ID左移，鼠标悬浮时使“…”按钮不覆盖任务ID */
  .task-card .task-content-set .task-card-footer>* {
      margin-right: 25px !important;
  }

  /* 隐藏工作流顶部右侧的“更多”按钮 */
  div.kanban-single-lane-body-wrapper>div.kanban-single-list>div.kanban-single-list-contents>div>div>div:last-child {
    display: none !important;
  }

  /* -------------------------------------------------------------------------- */
  /* 工作流配置页面 */

  /* 将整个页面周围边距清除 */
  .taskflow-config-contents {
      bottom: 0px !important;
      left: 0px !important;
      right: 0px !important;
      top: 60px !important;
  }

  /* 减小行高 */
  .taskflow-config-table-block-item {
      height: 50px !important;
  }

  /* 减小列宽 */
  .taskflow-config-table-status-column {
      width: 110px !important;
  }

  .status-label-with-menu {
      padding: 0 !important;
      width: 110px !important;
  }
  /* -------------------------------------------------------------------------- */
  /* 迭代面板 */
  .sprint-panel-component-title-wrapper {
      padding: 4px 16px !important;
  }
  .sprint-panel-component-sprint-content>.sprint-name {
      padding: 3px 0 !important;
  }
  .sprint-panel-item .sprint-control-option {
      height: 28px !important;
  }

  .sprint-panel-item .sprint-subtitle {
      margin-bottom: 0px !important;
  }
  `;

  const loadAllStyle = `
  .loadAll {
    background-color: #f2fbff!important;
    border-color: transparent!important;
    color: #1b9aee!important;
    font-size: 14px;
    height: 28px;
    line-height: 26px;
    min-width: 52px;
    padding: 0 7px;
    margin-right: 15px;
    border-radius: 4px;
    border-width: 1px;
    box-shadow: none;
    transition: background-color .3s ease,color .3s ease,border-color .3s ease;
  }

  .loadAll:hover{
    color: #ffffff !important;
    background-color: #1b9aee !important;
    border-color: #1b9aee !important;
  }
  `;

  const worktimeStyle = `
    /* 头部标题 */
    #root header h4 {
        display: none !important;
    }
    /* 头部日期选择器 */
    ._18ivZlWaPJH2YVLnpZrb0N>header .LZNYW1Yb6acagP8pDYBcB .vkkNP00hyMhbgKHQS-CCT {
        margin-right: 8px !important;
    }
    ._18ivZlWaPJH2YVLnpZrb0N>header .LZNYW1Yb6acagP8pDYBcB ._2gIxRD0Aw3Wz4V58lFor-k {
        margin-left: 8px !important;
    }

    #root > div > div > header > div:first-child > h4 {
      padding: 0 5px !important;
    }

    #root > div > div > header > div:last-child {
      flex-grow: 0 !important;
      flex-basis: 240px !important;
    }

    /* 表头第一列 */
    ._1a3bcSp1CtO4ejX9ugVzzO._2Q3J8umLBh0SslZCOuVtuw {
      width: 180px !important;
    }

    /* 表体第一列 */
    ._1a3bcSp1CtO4ejX9ugVzzO {
      padding: 0 0px 0 28px !important;
    }

    .rt-table > .rt-tbody > .rt-tr-group > .rt-tr > .rt-td:first-child,
    .rt-table > .rt-thead > .rt-tr > .rt-th:first-child,
    .rt-table > .rt-tfoot > .rt-tr > .rt-td:first-child {
      flex: 180 0 auto !important;
      width: 180px !important;
      max-width: 180px !important;
    }

    .rt-table > .rt-tbody > .rt-tr-group > .rt-tr > .rt-td:not(:first-child),
    .rt-table > .rt-thead > .rt-tr > .rt-th:not(:first-child),
    .rt-table > .rt-tfoot > .rt-tr > .rt-td:not(:first-child) {
      flex: 124 0 auto !important;
      width: 124px !important;
      max-width: 124px !important;
    }

    /* 隐藏悬浮边框 */
    ._1SmlEXYUElETMoqOAF1ym0:hover {
      border: none !important;
    }
    ._3AzO2C7wToS7pqSbOxyEXm {
      border: none !important;
    }

    /* 直接展示实际和计划工时 */
    ._3sRT72VQQvRBhWYMmH0hD2 {
      display: none !important;
    }
    .JqBbgp5bIj-_fWcuSdn8X {
      display: block !important;
    }

    /* footer总计工时 */
    .Z8fZCPB9x3aQBvMMYEzWI {
      padding: 0px 0px !important;
    }

    button.cusBtn {
      outline: none;
      padding: 2px 10px;
      border: none;
      border-radius: 4px;
      color: #595959;
      line-height: 26px;
      background-color: #e5e5e5;
      font-size: 14px;
      cursor: pointer;
      margin-left: 5px;
    }
    button.cusBtn:hover {
      color: #1b9aee;
    }

    button.cusBtn.selected {
      background-color: #888888;
      color: #ffffff;
    }

    select.cusSelect {
      font-size: 14px;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      color: #262626;
      transition: border 218ms;
      padding: 0px 8px;
      margin-left: 10px;
      height: 30px;
    }

    /* 计划时间过大 */
    span.time.plan.greater {
      color: #ff2222;
    }

    /* 计划时间过小 */
    span.time.plan.less {
      color: #f29900;
    }
    `;

  const settingHTML = `
<div id="settingContent">
  <div id="settingTitle">
    <span class="icon"></span><span class="title">Teambition - 工时应用设置</span>
  </div>
  <ol id="settingBody">
    <li>
      <span class="setting title">工时应用URL</span>
      <div class="setting comment">
        <a>a.在左侧边栏上，点击“更多”按钮 -> “全部应用” -> “工时”</a><span class="errMsg url"></span>
        <a>b.页面加载完成后，按F12进入开发者模式，找到第一个iframe的地址，即是工时应用的地址</a>
        <a class="code">document.querySelectorAll('iframe')[0].src</a>
        <button type="button" id="getUrl">一键获取</button>
      </div>
      <input type="text" class="setting text url" placeholder="https://appshell.teambition.com/api/v1/organization/..."></input>
    </li>
    <li>
      <span class="setting title">分组过滤按钮</span>
      <div class="setting comment">
        <a>配置每个按钮过滤部分人员。请使用标准JSON格式，使用英文双引号。</a><span class="errMsg filter"></span>
      </div>
      <textarea
        type="text"
        class="setting text filter"
        placeholder="{
    'button name':['username','username'],
    'button name':['username','username']
}"></textarea>
    </li>
    <li>
      <span class="setting title">移除人员</span>
      <div class="setting comment">
        <a>可将不必要的人员从表格中移除。请使用标准JSON格式，使用英文双引号。</a><span class="errMsg remove"></span>
      </div>
      <input type="text" class="setting text remove" placeholder="['username','username']"></input>
    </li>
  </ol>
  <div id="settingFooter">
    <button type="button" id="settingCancel" class="setting button">取消</button>
    <button type="button" id="settingSave" class="setting button">保存</button>
  </div>
</div>
`;

  const settingStyle = `
#settingPanel {
  display: none;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200000000;
  overflow: auto;
  font-family: arial, sans-serif;
  min-height: 100%;
  font-size: 16px;
  transition: 0.5s;
  opacity: 1;
  user-select: none;
  -moz-user-select: none;
  padding-bottom: 80px;
  box-sizing: border-box;
}

#settingContent {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 4px;
  position: absolute;
  width: 50%;
  transition: 0.5s;
}

#settingTitle {
  width: 100%;
  margin: 15px 0;
}

#settingTitle > span.icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  background-image: url("https://tcs-ga.teambition.net/thumbnail/312ca08e98b657c56f74c8f5eae0b66dd8d2/w/20/h/20");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100%;
  border-radius: 4px;
}

#settingTitle > span.title {
  font-size: 18px;
  vertical-align: top;
  font-weight: 500;
}

#settingBody {
  padding: 20px 20px 20px 40px;
  background-color: #fff;
  border: 1px solid #fff;
  border-radius: 5px;
  width: 100%;
  list-style: decimal;
}

span.setting.title {
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 2rem;
  display: block;
}

span.setting.title:not(:first-child) {
  margin-top: 8px;
}

.setting.comment > a {
  color: #666;
  display: inline-block;
  line-height: 24px;
  text-decoration: none;
  user-select: text;
}

.setting.comment > a.code {
  background: #fafafa;
  line-height: 150%;
  padding-right: 10px;
  padding-left: 10px;
  border-left: 2px solid #6ce26c;
  display: block !important;
}

.setting.text {
  width: 100%;
  margin-top: 5px;
  line-height: 24px;
}

.setting.text.url {
  width: calc(100% - 90px) !important;
}

textarea.setting.text {
  min-height: 126px;
  max-height: 200px;
}

#getUrl {
  position: absolute;
  right: 40px;
  padding: 4px 8px;
  margin-top: 5px;
  cursor: pointer;
  outline-style: none;
  border-radius: 3px;
  color: #fff;
  border: 1px solid #1b9aee;
  background-color: #1b9aee;
}

#settingFooter {
  text-align: center;
  margin: auto;
  margin-top: 15px;
  border-radius: 4px;
}

.setting.button {
  padding: 5px 10px;
  cursor: pointer;
  outline-style: none;
  border-radius: 3px;
}

#settingCancel {
  border: 1px solid #e7e7e7;
  background-color: #e7e7e7;
}

#settingCancel:hover {
  border: 1px solid #979797;
  background-color: #979797;
}

#settingSave {
  margin-left: 20px;
  color: #fff;
  border: 1px solid #1b9aee;
  background-color: #1b9aee;
}

#settingSave:hover,
#getUrl:hover {
  border: 1px solid #0171c2;
  background-color: #0171c2;
}

span.errMsg {
  color: red;
  margin-left: 10px;
}
  `;

  let members = [];

  const planTimeMaximum = 10;
  const planTimeMinimum = 7;

  // The number of times the worktime page was loaded.
  const loadCount = 5;

  main();

  function main() {
    GM_addStyle(mainStyle);
    logInfo(GM_info.script.name, GM_info.script.version);
    data = GM_getValue('worktime');
    GM_registerMenuCommand("设置", () => {
      new Setting();
    });

    if (window.location.href.startsWith('https://apps.teambition.com/work-time-client')) {
      beautifyWorktime();
    } else {
      setTimeout(() => {
        hideAddingStatus();
        listenDom();
        loadAll();
        addSideButton();
      }, 4000);
    }
  }

  function beautifyWorktime() {
    GM_addStyle(worktimeStyle);

    let timeout = 0;
    let table;
    let interval = setInterval(() => {
      timeout += 1;
      table = document.querySelector('.ReactTable > .rt-table');

      // Stop the circulator when the element is found or after 10 seconds(100*100 ms).
      if (timeout == 100 || table) {
        clearInterval(interval);
        loadAllWorktime();
        choosePlanTime();
        addFilterButton();
      }
    }, 100);
  }

  /**
   * Listen the parent DOM. While the children is changing, and the top board is TaskBoard then hide the panel.
   */
  function listenDom() {
    let parentObj = document.querySelector('div#teambition-web-content>div.project-app-view>div.project-app-inner');
    if (!parentObj) {
      return;
    }
    let innerListener = new MutationObserver(() => {
      setTimeout(() => { hideAddingStatus() }, 4000);
    });

    let listener = new MutationObserver((mutationRecords) => {
      top:
      for (let i = 0; i < mutationRecords.length; i++) {
        let addedNodes = mutationRecords[i].addedNodes;
        let removedNodes = mutationRecords[i].removedNodes;
        for (let j = 0; j < addedNodes.length; j++) {
          if (addedNodes[j].className == 'board-view') {
            // When you enter the task panel, start the task listener.
            setTimeout(() => {
              let innerTaskBoard = document.querySelector('div.board-view > div.board-flex-view > div.board-right-view');
              if (!innerTaskBoard) {
                return;
              }
              hideAddingStatus();
              innerListener.observe(innerTaskBoard, {
                childList: true
              });
            }, 4000);
            break top;
          }
        }
        for (let j = 0; j < removedNodes.length; j++) {
          if (removedNodes[j].className == 'board-view') {
            // When you leave the task panel, stop the task listener.
            innerListener.disconnect();
            break top;
          }
        }
      }
    });
    listener.observe(parentObj, {
      childList: true
    });

    listenTaskBoard();
  }

  /**
   * While the content of the task board changing then hide the adding button.
   */
  function listenTaskBoard() {
    let taskListener = new MutationObserver(() => {
      setTimeout(() => { hideAddingStatus() }, 3000);
    });

    let taskBoard = document.querySelector('div.board-view > div.board-flex-view > div.board-right-view');
    if (taskBoard) {
      hideAddingStatus();
      taskListener.observe(taskBoard, {
        childList: true
      });
    }
  }

  function hideAddingStatus() {
    let status = document.querySelector('div.kanban-single-lane-body-wrapper>div.kanban-single-list:last-child');
    if (!status) {
      return;
    }
    let statusText = status.querySelector('div>div>button>span:last-child');
    if (!statusText) {
      return;
    }
    if ('添加状态' == statusText.textContent) {
      status.style.display = 'none';
    }
  }

  /**
   * Add the button of loading all the content.
   */
  function loadAll() {
    GM_addStyle(loadAllStyle);
    let parent = $('nav.project-navigation.sub-nav.sub-navigator > div.row-flex.nav-container > div.nav-footer');
    if (!parent || parent.length == 0) {
      return;
    }
    let loadAllButton = $('<button type="button" class="loadAll" title="表格视图下，加载所有数据">LoadAll</button>');
    loadAllButton.click(function (e) {
      let test = getLoadButton();
      load(test);
    });
    loadAllButton.insertBefore(parent.children().eq(0));
  }

  /**
   * Load content.
   * @param {Object} element The button of loading.
   */
  function load(element) {
    if (element) {
      element.click();
      setTimeout(() => {
        let test = getLoadButton();
        load(test);
        // load(getLoadButton());
      }, 1000);
    }
  }

  /**
   * Get the button of loading.
   * @returns The button of loading.
   */
  function getLoadButton() {
    let button = null;
    $('div').each((index, element) => {
      if (element.textContent.startsWith('加载更多')) {
        button = element;
        return;
      }
    })
    return button;
  }

  /**
   * Add the side button which used for opening the worktime page.
   */
  function addSideButton() {
    let data = GM_getValue('worktime');
    if (!data || !data?.url || data.url.trim() == '') {
      return;
    }

    let parent = $('#nav_bar-apps > div.nav_bar_detail-apps > ul').last();
    let button = $(`
      <li class="nav_bar_detail-app">
        <span class="next-badge nav_bar_detail-badge">
          <span class="nav_bar_detail-app-icon" style="display: inline-block">
            <span
              style="
                width: 100%;
                height: 100%;
                display: inline-block;
                background-image: url('https://tcs-ga.teambition.net/thumbnail/312ca08e98b657c56f74c8f5eae0b66dd8d2/w/20/h/20');
                background-position: center center;
                background-repeat: no-repeat;
                background-size: 100%;
                border-radius: 4px;
              "
            ></span>
          </span>
          <span></span>
        </span>
        <span class="nav_bar_detail-app-text">工时</span>
      </li>
    `);
    button.click(() => {
      window.open(data?.url, "_blank");
    });
    if (parent.length < 1) {
      return;
    }
    parent.append(button);
  }

  /**
   * Load all of the worktime list.
   */
  function loadAllWorktime() {
    let table = document.querySelector('.ReactTable > .rt-table');
    for (var i = 0; i < loadCount; i++) {
      (function (t) {
        setTimeout(function () {
          table.scroll(0, 10000);
        }, 1000 * t);
      })(i)
    }
    setTimeout(() => {
      table.scroll(0, 0);
    }, loadCount * 1000);

    setTimeout(() => {
      simplifyHeader();
      removeWorktime();
      cleanWord();
      AppendMemberNumber();
      addMemberSelect();
      markAbnormalTime();
    }, (loadCount + 1) * 1000);
  }

  /**
   * Simplify header.
   */
  function simplifyHeader() {
    let spanList = document.querySelectorAll('._38MgU8RZnSct2M6Qs3ZR2i');
    for (let i = 0; i < spanList.length; i++) {
      const text = spanList[i].textContent;
      spanList[i].textContent = text.replace('工时', "");
    }
  }

  /**
   * Add a button for clean the unuseful word.
   */
  function cleanWord() {
    let spans = document.querySelectorAll('._3RNDj8L2GanC2QT53PysSS > span');
    for (let i = 0; i < spans.length; i++) {
      spans[i].innerHTML = spans[i].innerHTML.replace('合计 :&nbsp;&nbsp;', '');
    }
    let total = document.querySelector('.rt-tfoot > .rt-tr > .rt-td > div > div');
    if (total) {
      total.innerHTML = total.innerHTML.replace('总计 :&nbsp;&nbsp;', '');
    }

    let values = document.querySelectorAll('.rt-td span.JqBbgp5bIj-_fWcuSdn8X');
    for (let i = 0; i < values.length; i++) {
      const element = values[i];
      let text = values[i].innerText;
      if (text.endsWith(' 小时')) {
        values[i].innerText = text.replace(' 小时', '');
      }
    }

    document.querySelectorAll('span._3sRT72VQQvRBhWYMmH0hD2').forEach((item) => {
      item.remove();
    });
  }

  /**
   * Append the number of members at the 'All' button.
   */
  function AppendMemberNumber() {
    let button = document.querySelector('.team.cusBtn.all');
    let trList = document.querySelectorAll('.rt-table > .rt-tbody > .rt-tr-group');
    if (!button || !trList) {
      return;
    }
    button.textContent += `(${trList.length})`;

    // Collect member list.
    for (let i = 0; i < trList.length; i++) {
      const nameElement = trList[i].querySelector('.rt-tr > .rt-td:first-child > div > div > div');
      const username = nameElement.textContent;
      members.push(username);
    }
    members.sort((a, b) => { return a.localeCompare(b) });
  }

  /**
   * The Plan Time is selected by default.
   */
  function choosePlanTime() {
    let times = document.querySelectorAll('#root header h4 + div > div');
    if (times.length == 2) {
      times[1].click();
    }
  }

  /**
   * Add the buttons for filtering worktime list.
   */
  function addFilterButton() {
    let parent = document.querySelector('#root header > div');
    if (!parent) {
      return;
    }
    let teamMember = data?.filter;
    if (!teamMember) {
      return;
    }
    const teams = Object.keys(teamMember);
    for (let i = 0; i < teams.length; i++) {
      let button = document.createElement('button');
      button.className = 'team cusBtn';
      button.textContent = `${teams[i]}(${teamMember[teams[i]].length})`;
      button.title = teamMember[teams[i]].join(',');
      button.onclick = function () {
        changeButtonStyle(button.textContent);
        let trList = document.querySelectorAll('.rt-table > .rt-tbody > .rt-tr-group');
        for (let j = 0; j < trList.length; j++) {
          const nameElement = trList[j].querySelector('.rt-tr > .rt-td:first-child > div > div > div');
          const username = nameElement.textContent;
          if (teamMember[teams[i]].indexOf(username) != -1) {
            trList[j].style.display = 'flex';
          } else {
            trList[j].style.display = 'none';
          }
        }
        changeSelectStatus();
      };
      parent.append(button);
    }
    parent.append(createAllButton());
  }

  /**
   * Create the button for displaying all the worktime list.
   */
  function createAllButton() {
    let button = document.createElement('button');
    button.className = 'team cusBtn all';
    button.textContent = 'All';
    button.onclick = function () {
      changeButtonStyle(button.textContent);
      let trList = document.querySelectorAll('.rt-table > .rt-tbody > .rt-tr-group');
      for (let j = 0; j < trList.length; j++) {
        trList[j].style.display = 'flex';
      }
      changeSelectStatus();
    };
    return button;
  }

  /**
   * Change the style of the button.
   * @param {String} button The name of the button.
   */
  function changeButtonStyle(button) {
    let buttons = document.querySelectorAll('button.team.cusBtn');
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].textContent == button) {
        addClass(buttons[i], 'selected');
      } else {
        removeClass(buttons[i], 'selected');
      }
    }
  }

  /**
   * Set the first element be selected.
   */
  function changeSelectStatus() {
    let select = document.querySelector('select.cusSelect');
    if (select) {
      select.selectedIndex = 0;
    }
  }

  /**
   * Remove the worktime item in the table.
   */
  function removeWorktime() {
    let removeMembers = data?.remove;
    if (!removeMembers) {
      return;
    }
    let trList = document.querySelectorAll('.rt-table > .rt-tbody > .rt-tr-group');
    for (let i = 0; i < trList.length; i++) {
      const nameElement = trList[i].querySelector('.rt-tr > .rt-td:first-child > div > div > div');
      const username = nameElement.textContent;
      if (removeMembers.indexOf(username) != -1) {
        trList[i].remove();
      }
    }
  }

  /**
   * Add the select element for searching member.
   */
  function addMemberSelect() {
    let parent = document.querySelector('#root header > div');
    if (!parent || members.length == 0) {
      return;
    }
    let select = document.createElement('select');
    select.className = 'cusSelect';

    let hiddenOption = document.createElement('option');
    hiddenOption.style.display = 'none';
    select.append(hiddenOption);

    for (let i = 0; i < members.length; i++) {
      let option = document.createElement('option');
      option.value = members[i];
      option.textContent = members[i];
      select.append(option);
    }
    select.onchange = function () {
      let selectedMember = select.options[select.selectedIndex].value;
      let trList = document.querySelectorAll('.rt-table > .rt-tbody > .rt-tr-group');
      for (let j = 0; j < trList.length; j++) {
        const nameElement = trList[j].querySelector('.rt-tr > .rt-td:first-child > div > div > div');
        const username = nameElement.textContent;
        if (username == selectedMember) {
          trList[j].style.display = 'flex';
        } else {
          trList[j].style.display = 'none';
        }
      }

      // Remove the selected style for all the fileter button.
      let buttons = document.querySelectorAll('button.team.cusBtn');
      for (let i = 0; i < buttons.length; i++) {
        removeClass(buttons[i], 'selected');
      }
    }
    parent.append(select);
  }

  /**
   * Color the abnormal times.
   */
  function markAbnormalTime() {
    let spanList = document.querySelectorAll('.rt-tbody .rt-tr .rt-td:not(:first-child) span.JqBbgp5bIj-_fWcuSdn8X');
    for (let i = 0; i < spanList.length; i++) {
      let timeArr = spanList[i].textContent.split('/');
      const actualTime = new Number(timeArr[0].trim()).toFixed(0);
      const planTime = new Number(timeArr[1].trim()).toFixed(0);
      let innerHTML;
      if (planTime >= planTimeMaximum) {
        innerHTML = `<span>${actualTime}</span><span>&nbsp;/&nbsp;</span><span class="time plan greater">${planTime}</span>`;
      }
      else if (planTime <= planTimeMinimum) {
        innerHTML = `<span>${actualTime}</span><span>&nbsp;/&nbsp;</span><span class="time plan less">${planTime}</span>`;
      }
      else {
        innerHTML = `<span>${actualTime}</span><span>&nbsp;/&nbsp;</span><span class="time plan">${planTime}</span>`;
      }
      spanList[i].innerHTML = innerHTML;
    }
  }
  class Setting {
    constructor() {
      this.init()
    }
    init() {
      let self = this;
      setTimeout(() => {
        if (!document.getElementById('settingPanel')) {
          self.addElement();
          self.addListener();
          GM_addStyle(settingStyle);
        }
        self.loadConfiguration();
        self.show();
      }, 300);
    }

    addElement() {
      let settingPanel = document.createElement('div');
      settingPanel.setAttribute('id', 'settingPanel');
      settingPanel.innerHTML = settingHTML;
      document.body.append(settingPanel);
    }

    addListener() {
      let self = this;
      let panel = document.getElementById('settingPanel');

      document.getElementById('getUrl').onclick = function () {
        let iframes = document.querySelectorAll('iframe');
        if (iframes.length > 0) {
          const url = iframes[0].src;
          if (url.startsWith('https://appshell.teambition.com/api/v1/organization/')) {
            document.querySelector('input.setting.text.url').value = url;
            document.querySelector('span.errMsg.url').textContent = '';
          } else {
            document.querySelector('span.errMsg.url').textContent = '未获取到，请先打开工时应用。';
          }
        } else {
          document.querySelector('span.errMsg.url').textContent = '未检测到iframe，请先打开工时应用。';
        }
      }

      document.getElementById('settingCancel').onclick = function () {
        panel.style.display = 'none';
      }

      document.getElementById('settingSave').onclick = function () {
        if (self.saveConfiguration()) {
          panel.style.display = 'none';
          location.reload();
        }
      }

      document.onkeyup = function (e) {
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        // Escape
        if (code == 27 && panel) {
          panel.style.display = 'none';
        }
      };
    }

    loadConfiguration() {
      let data = GM_getValue('worktime');
      if (!data) {
        return;
      }
      const urlValue = data?.url;
      if (urlValue && urlValue.trim() != '') {
        document.querySelector('.setting.text.url').value = urlValue;
      }
      const filterValue = data?.filter;
      if (filterValue) {
        document.querySelector('.setting.text.filter').value = JSON.stringify(filterValue);
      }
      const removeValue = data?.remove;
      if (removeValue) {
        document.querySelector('.setting.text.remove').value = JSON.stringify(removeValue);
      }
      document.querySelector('span.errMsg.url').textContent = '';
      document.querySelector('span.errMsg.filter').textContent = '';
      document.querySelector('span.errMsg.remove').textContent = '';
    }

    saveConfiguration() {
      let urlEle = document.querySelector('.setting.text.url');
      let filterEle = document.querySelector('.setting.text.filter');
      let filterValue;
      try {
        filterValue = JSON.parse(filterEle.value);
      } catch (error) {
        console.error(error);
        document.querySelector('span.errMsg.filter').textContent = 'JSON格式不正确，请修改后重试！';
        return false;
      }
      document.querySelector('span.errMsg.filter').textContent = '';

      let removeEle = document.querySelector('.setting.text.remove');
      let removeValue;
      try {
        removeValue = JSON.parse(removeEle.value);
      } catch (error) {
        console.error(error);
        document.querySelector('span.errMsg.remove').textContent = '数组格式不正确，请修改后重试！';
        return false;
      }
      document.querySelector('span.errMsg.remove').textContent = '';
      const data = {
        'url': urlEle.value,
        'filter': filterValue,
        'remove': removeValue
      }
      GM_setValue('worktime', data);
      return true;
    }

    show() {
      document.getElementById('settingPanel').style.display = 'flex';
    }
  }

  /**
   * Add class name for the element.
   * @param {Object} element The DOM elment object.
   * @param {String} value the class name of the element.
   */
  function addClass(element, value) {
    if (!element.className) {
      element.className = value;
    } else if (element.className.indexOf(value) == -1) {
      let newClassName = element.className;
      newClassName += " ";
      newClassName += value;
      element.className = newClassName;
    }
  }

  /**
   * Remove class name for the element.
   * @param {Object} element The DOM elment object.
   * @param {String} value the class name of the element.
   */
  function removeClass(element, value) {
    if (element.className) {
      let newClassName = element.className;
      newClassName = newClassName.replace(value, '');
      newClassName = newClassName.trim();
      element.className = newClassName;
    }
  }

  /**
   * Log the title and version at the front of the console.
   * @param {String} title title.
   * @param {String} version script version.
   */
  function logInfo(title, version) {
    console.clear();
    const titleStyle = 'color:white;background-color:#606060';
    const versionStyle = 'color:white;background-color:#1475b2';
    const logTitle = ' ' + title + ' ';
    const logVersion = ' ' + version + ' ';
    console.log('%c' + logTitle + '%c' + logVersion, titleStyle, versionStyle);
  }
})();
