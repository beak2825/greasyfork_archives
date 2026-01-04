// ==UserScript==
// @name         Jira工具
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       Simon
// @match        http://172.26.0.16:8080/*
// @icon         http://172.26.0.16:8080/s/zalxre/78001/1afd8c72ce45b8aa2c620ba8ca484c4f/_/jira-logo-scaled.png
// @grant        none
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487807/Jira%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/487807/Jira%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

const headEl = document.getElementsByTagName('head')[0];
const styleEl = document.createElement('style');
styleEl.innerHTML = `<style>
  .hidden {
    display: none;
  }
  #tool-jira .aui-buttons {
    position: relative;
  }
  #tool-jira .aui-list {
    position: absolute;
    top: 32px;https://www.tampermonkey.net/faq.php#Q404
    left: 0;
    z-index: 9999;
    background-color: #fff;
    color: #333;
    font-size: 12px;
    border-radius: 2px;
    border: solid 1px #ccc;
  }
  #tool-jira .aui-list-item:hover {
    background-color: #f5f7fa;
  }
  #tool-jira .drop-arrow {
    position: relative;
    padding-right: 20px;
  }
  #tool-jira .drop-arrow:after{
    border: 4px solid transparent;
    border-top-color: #111;
    content: "";
    height: 0;
    position: absolute;
    right: 8px;
    top: 13px;
    width: 0;
  }
</style>`;
headEl.append(styleEl);

window.waitFn = function (selector, func, times, interval) {
    let _times = times || 10, // 默认10次
        _interval = interval || 1000, //默认1秒每次
        _selector = selector, //选择器
        _self = document.querySelector(_selector),
        _iIntervalID; //定时器id
    if (_self) {
        //如果已经获取到了，就直接执行函数
        func && func.call(_self);
    } else {
        _iIntervalID = setInterval(function () {
            if (!_times) {
                //是0就退出
                clearInterval(_iIntervalID);
            }
            _times <= 0 || _times--; //如果是正数就 --

            _self = document.querySelector(_selector); //再次选择
            if (_self) {
                //判断是否取到
                func && func.call(_self);
                clearInterval(_iIntervalID);
            }
        }, _interval);
    }
};

//$(function(){
// Bind the event.
//    $(window).on('hashchange',function(){
//      console.log('hash change')
//  });
//});

function insertJiraTool () {
    const oldJiraTool = document.querySelector('#tool-jira');
    if (oldJiraTool) {
        oldJiraTool.remove();
    }
    const breadCrumbEl = document.querySelector('ol.aui-nav.aui-nav-breadcrumbs');
    const liEl = document.createElement('li');
    liEl.setAttribute('id', 'tool-jira');
    liEl.classList.add('aui-item');
    liEl.innerHTML = `<div class="aui-buttons">
    <button class="aui-button aui-button-light drop-arrow" type="button">
      <span>Jira工具</span>
    </button>
    <div class="aui-list hidden">
      <ul class="aui-list-section aui-first aui-last">
        <li class="aui-list-item layout-switcher-item">
          <a href="#" id="copyJiraUrl" class="aui-list-item-link">复制Jira链接</a>
        </li>
        <li class="aui-list-item layout-switcher-item">
          <a href="#" id="copyGitKeywords" class="aui-list-item-link">复制Git提交关键字</a>
        </li>
      </ul>
    </div>
  </div>`;
    breadCrumbEl.append(liEl);

    /**
   * @description: 鼠标事件
   */
    const arrowEl = document.querySelector('#tool-jira .drop-arrow');
    arrowEl.onmouseenter = (e) => {
        showDropdown();
    };

    // 复制Jira链接
    const copyJiraUrlEl = document.querySelector('#copyJiraUrl');
    copyJiraUrlEl.onclick = (e) => {
        const jiraUrl = document.querySelector('#key-val').href;
        copyContent(`${jiraUrl}`);
    };

    // 复制Git提交关键字
    const copyGitKeywordsEl = document.querySelector('#copyGitKeywords');
    copyGitKeywordsEl.onclick = (e) => {
        const jiraKey = document.querySelector('#key-val').innerText;
        const jiraSummary = document.querySelector('#summary-val').innerText;
        // 自定义Git提交关键字
        copyContent(`Issue:${jiraKey};${jiraSummary}`);
    };
}

function initJiraTool () {
    window.waitFn('.issue-container:not(.loading) ol.aui-nav.aui-nav-breadcrumbs', function () {
        insertJiraTool();
    });
}

// main
initJiraTool();

// issue列表的点击事件处理
function initIssueListClicker() {
    const issueListEl = document.querySelector('.list-panel ol.issue-list');
    issueListEl.addEventListener('click', () => {
        setTimeout(() => {
            initJiraTool();
        }, 200)
    });
}

// 添加点击事件
window.waitFn('.list-panel ol.issue-list li', initIssueListClicker);
window.navigation.addEventListener('navigate', () => {
    setTimeout(() => {
        window.waitFn('.list-panel ol.issue-list li', function () {
            initJiraTool();
        });
    }, 200);
});



const bodyEl = document.getElementsByTagName('body')[0];
bodyEl.addEventListener('click', () => {
    hiddenDropdown();
});

function showDropdown () {
    const listEl = document.querySelector('#tool-jira .aui-list');
    listEl.classList.remove('hidden');
}
function hiddenDropdown () {
    const listEl = document.querySelector('#tool-jira .aui-list');
    listEl && listEl.classList.add('hidden');
}

/**
 * 复制内容
 * @param {String} value 需要复制的内容
 * @param {String} type 元素类型 input, textarea
 */
function copyContent (value, type = 'input') {
    const input = document.createElement(type);
    input.setAttribute('readonly', 'readonly'); // 设置为只读, 防止在 ios 下拉起键盘
    // input.setAttribute('value', value); // textarea 不能用此方式赋值, 否则无法复制内容
    input.value = value;
    document.body.appendChild(input);
    input.setSelectionRange(0, 9999); // 防止 ios 下没有全选内容而无法复制
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
}
// Your code here...
// Your code here...

