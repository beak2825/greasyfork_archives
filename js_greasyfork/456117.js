// ==UserScript==
// @name               YCKCEO
// @name:zh-CN         源仓库
// @description        Beautify the YCKCEO.
// @description:zh-CN  美化源仓库。
// @namespace          https://github.com/HaleShaw
// @version            1.0.0
// @author             HaleShaw
// @copyright          2022+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-YCKCEO
// @supportURL         https://github.com/HaleShaw/TM-YCKCEO/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               http://www.yckceo.com/favicon.ico
// @match              http://www.yckceo.com/*
// @compatible         Chrome
// @grant              GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/456117/YCKCEO.user.js
// @updateURL https://update.greasyfork.org/scripts/456117/YCKCEO.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author             HaleShaw
// @collaborator       HaleShaw
// ==/OpenUserJS==

(function () {
  'use strict';

  const menuStyle = `
  .layui-layer-dialog .layui-layer-content {
        height: 508px !important;
        overflow-y: hidden !important;
    }

    .layui-layer-dialog {
        height: 600px !important;
    }
  .layui-footer.footer.footer-demo {
    display: none !important;
  }
  `;

  const beautifulStyle = `
    .laytable-cell-1-0-1,
    .laytable-cell-1-0-2 {
      width: 810px !important;
    }

    .layui-btn-group {
        font-size: inherit !important;
    }
    span.head.count {
        display: inline-block;
        width: 3rem;
        text-align: center;
        vertical-align: middle;
        margin-left: 5px;
    }

    div.layui-table-box > div.layui-table-header > table > thead > tr > th:nth-child(4),
    div.layui-table-box > div.layui-table-body.layui-table-main > table > tbody > tr > td:nth-child(4),
    #comments-section {
        display: none !important;
    }

    .layui-table-cell .layui-table-link {
        width: 400px;
        display: inline-block;
    }

    div.layui-table-box > div.layui-table-body.layui-table-main > table > tbody > tr > td:nth-child(3) > div > a:nth-child(1) {
        width: 200px;
        display: inline-block;
    }

    div.layui-body.layui-tab-content.site-demo.site-demo-body > div.layui-main ~div {
        display: none !important;
    }

    body .layui-layout-admin .site-demo {
        bottom: 0 !important;
    }
  `;
  const shuYuanUrl = '/yuedu/shuyuan/index.html';

  main();

  function main() {
    GM_addStyle(menuStyle);
    GM_addStyle(beautifulStyle);
    logInfo(GM_info.script.name, GM_info.script.version);

    if (location.pathname == shuYuanUrl) {
      setTimeout(() => {
        addButton();
      }, 2000);
    }
  }


  function beautifyShuYuan() {
    document.querySelectorAll('div.layui-table-box > div.layui-table-body.layui-table-main > table > tbody > tr > td:nth-child(4)');
    let trList = document.querySelectorAll('div.layui-table-box > div.layui-table-body.layui-table-main > table > tbody > tr');
    let spanList = document.querySelectorAll('div.layui-table-box > div.layui-table-body.layui-table-main > table > tbody > tr > td:nth-child(2) > div > p:nth-child(2) > span');
    let count = 0;
    for (let i = trList.length - 1; i >= 0; i--) {
      let span = trList[i].querySelector('td:nth-child(2) > div > p:nth-child(2) > span');
      let checkBox = trList[i].querySelector('td:nth-child(1) > div > div > i');
      const element = spanList[i];
      if (span.className.indexOf('green') == -1) {
        trList[i].remove();
      } else {
        checkBox.click();
        count++;
      }
    }

    trList = document.querySelectorAll('div.layui-table-box > div.layui-table-body.layui-table-main > table > tbody > tr');
    for (let i = 0; i < trList.length; i++) {
      const element = trList[i];
      let divEle = trList[i].querySelector('td:nth-child(2) > div');
      let htmlStr = divEle.innerHTML;
      let newStr = htmlStr.replaceAll('p>', 'a>');
      divEle.innerHTML = newStr;

      let otherDiv = trList[i].querySelector('td:nth-child(3) > div');
      let otherHTML = otherDiv.innerHTML;
      let otherNew = otherHTML.replaceAll('p>', 'a>');
      otherDiv.innerHTML = otherNew;
    }

    let countSpan = document.querySelector('span.head.count');
    countSpan.textContent = count;
  }

  function addButton() {
    let parent = document.querySelector('div.layui-table-tool > div.layui-table-tool-temp > div.layui-btn-group');
    let button = document.createElement('button');
    button.textContent = '过滤';
    button.title = '过滤绿色可用源';
    button.className = 'layui-btn layui-btn-sm layui-btn-normal';
    button.onclick = function () {
      beautifyShuYuan();
    }

    let countSpan = document.createElement('span')
    countSpan.className = 'head count';
    parent.append(button);
    parent.append(countSpan);
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
