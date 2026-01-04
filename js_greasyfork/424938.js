// ==UserScript==
// @name         _jira小助手
// @namespace    https://kms.fineres.com/pages/viewpage.action?pageId=218670035
// @version      3.1.9
// @description  一些技术支持需要用到的辅助功能, 目前包括: 日志快捷记录, 自动暂存文本框内容
// @author       LeoYuan
// @match        https://work.fineres.com/browse/*
// @include      /^https?://work\.fineres\.com.*
// @icon         https://work.fineres.com/s/3e84z9/805005/12f785fd3d3d0d63b7c21a41e0d048b2/_/jira-favicon-hires.png
// @note         https://greasyfork.org/en/scripts/424938
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424938/_jira%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/424938/_jira%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  'use strict';


  // ----------------------------------------------------------------------------------------------------
  // # 一些变量
  // ### 自定义日志快捷记录, 每条一个数组, 数组第一项是记录名称字符串, 第二项是时长字符串, 第三项是内容字符串. (注意需要带标签, 有人要审核标签) 
  // *** (注意此配置暂时无法保存, 每次重新安装或更新后都要重新定义) ***
  const WORKLOGS = [
    ['5m_关问题',   '5m',    '(定位问题)-【已定位到原因,提供解决方案】关闭问题'],
    ['5m_未回复',   '5m',    '(无实质进展)-【客户无响应或暂且搁置问题】客户未回复'],
    ['1m_无进展',   '1m',    '(无实质进展)-【客户无响应或暂且搁置问题】今日无进展'],
    ['1m_观察中',   '1m',    '(无实质进展)-【观察现象中】观察中'],
    ['1m_待发布',   '1m',    '(无实质进展)-【观察现象中】等待新jar/插件发布'],
  ];


  // ### 一些预定义的html内容
  const HTMLCONTENT = {
    logWorkRightPanel: (issuekey) => `<tr class="quick-work-log-tr"><td class="quick-work-log-td">${WORKLOGS.map(log => {return `<button class="quick-work-log-btn" onclick=quickWorkLog("${log[1]}","${log[2]}","${issuekey}")>${log[0]}</button>`}).join('') }</td></tr>`,
    logWorkDropdownPanel: (issuekey) => `<ul class="aui-list-section">${ WORKLOGS.map(log => {return `<li class="aui-list-item"><a onclick=quickWorkLog("${log[1]}","${log[2]}","${issuekey}") class="aui-list-item-link quick-work-log-item" data-issuekey="${issuekey}" role="menuitem">${log[0]}</a></li> \n `}).join('') }</ul> \n `,
    logWorkDialog: (issuekey) => `<div class="quick-work-log-dialog-div">${WORKLOGS.map(log => {return `<button class="quick-work-log-btn" onclick=quickWorkLog("${log[1]}","${log[2]}","${issuekey}")>${log[0]}</button>`}).join('') }</div>`,
  }


  // ----------------------------------------------------------------------------------------------------
  // # 一些预定义的常用方法
  // ## 通用的一些方法
  // ### 往页面插入自定义js的方法
  window.addCss = function(cssString) {
    const head = document.getElementsByTagName('head')[0];
    const newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
  }
  // ### 修改xhr方法, 用来拦截请求, 在请求加载后执行操作
  const __send = window.XMLHttpRequest.prototype.send;
  window.XMLHttpRequest.prototype.send = function() {
    if(window.loadInterceptions) {
      this.addEventListener('loadend', e => {
        window.loadInterceptions.filter(i => typeof(i.match) == 'function' && typeof(i.handler) == 'function').forEach((intercept) => {
          if(intercept.match(e)) intercept.handler(e);
        });
        //console.log('intercepted', e);
      }, { once: true });
    }
    __send.apply(this, arguments);
  };
  // ### 全局的监听方法, 包装了一下MutationObserver, 当监听到指定选择器的元素被加载时, 执行回调
  window.waitForAddedNode = function(params) {
    if(params.immediate) {
      const matched = [];
      matched.push(...document.querySelectorAll(params.selector));
      const smatched = [...new Set(matched)];
      for (const el of smatched) {
        params.done(el);
      }
    }
    const observer = new MutationObserver(mutations => {
      const matched = [];
      for (const { addedNodes }
           of mutations) {
        for (const n of addedNodes) {
          if (!n.tagName) continue;
          if (n.matches(params.selector)) {
            matched.push(n);
          } else if (n.firstElementChild) {
            matched.push(...n.querySelectorAll(params.selector));
          }
        }
      }
      const smatched = [...new Set(matched)]
      if (smatched && params.once) this.disconnect();
      for (const el of smatched) {
        params.done(el);
      }
    });
    observer.observe(document.querySelector(params.parent) || document.body, {
      subtree: !!params.recursive || !params.parent,
      childList: true,
    });
  }
  // ### 自动暂存填写内容
  window.tipTimer = 0;
  window.autoSave = function(el) {
    const keyName = ['__autoSave', location.pathname, el.attributes.id.value].join('__')
    el.addEventListener('keyup', function(e){
      var msg = '内容已自动缓存';
      clearTimeout(window.tipTimer);
      const data = {
        value: event.target.value,
        timestamp: + new Date(),
      };
      if(data.value){
        localStorage.setItem(keyName, JSON.stringify(data));
      } else {
        localStorage.removeItem(keyName);
        msg = '缓存内容已清除';
      }
      window.tipTimer = setTimeout(function(){
        if(!el.parentNode.querySelector('.auto-saved-tip')) el.insertAdjacentHTML('afterend',`<div class="auto-saved-tip">~~~${msg}~~~</div>`);
        setTimeout(function(){el.parentNode.querySelectorAll('.auto-saved-tip').forEach(el => el.remove()); }, 5000);
      }, 1000)
      
    })
  };

  // ### 恢复自动暂存的内容
  window.restoreSavedValue = function(el) {
    const keyName = ['__autoSave', location.pathname, el.attributes.id.value].join('__')
    const data = JSON.parse(localStorage.getItem(keyName));
    if(data && data.value && !el.value) el.value = data.value;
  };
  // ### 自动清理过早的日志
  window.cleanEarlySavedValue = function(days) {
    if(localStorage.getItem('__autoSaveLastCleanTime__') > (new Date() - 24*60*60*1000)) return ;
    const timepoint = new Date() - (days || 7)*24*60*60*1000;
    Object.keys(localStorage).filter(keyName => keyName.match(/^__autoSave__/))
      .filter(keyName => JSON.parse(localStorage.getItem(keyName)).timestamp < timepoint)
      .forEach(keyName => localStorage.removeItem(keyName));
    localStorage.setItem('__autoSaveLastCleanTime__', + new Date());
  }


  // -------------------------------------------------
  // ## 一些适用于jira页面的方法
  // ### 快捷写日志方法
  window.quickWorkLog = function(duration, message, key){
    if(!duration) JIRA.Messages.showErrorMsg('未提供日志时长');
    if(!message) JIRA.Messages.showErrorMsg('未提供日志内容');

    const user = AJS.params.loggedInUser;
    const issuekey = key || document.querySelector('meta[name="ajs-issue-key"]').attributes['content'].value;
    const atltoken = document.querySelector('meta[name="atlassian-token"]').attributes['content'].value;
    const startDate = moment(new Date).format(JIRA.translateSimpleDateFormat('yyyy-MM-dd HH:mm'));
    const endDate = moment(new Date).format(JIRA.translateSimpleDateFormat('yyyy-MM-dd'));

    return AJS.$.post({
      url:'https://work.fineres.com/secure/WPCreateWorklogOnIssueWithWorkLogAction.jspa?atl_token=' + atltoken,
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        inline: true,
        decorator: 'dialog',
        issueKey: issuekey,
        worklogAuthorUsername: user,
        period: 'none',
        timeLogged: duration,
        startDateJS: startDate,
        startDate: startDate,
        endDateJS: endDate,
        endDate: endDate,
        adjustEstimate: 'auto',
        remainingEstimateOptionsExpanded: false,
        comment: message
      },
      success: function(){
        JIRA.Messages.showSuccessMsg('记录成功"' + message + '"');
        if(document.querySelector('li#worklog-tabpanel')){
          document.querySelector('a#comment-tabpanel').click();
          document.querySelector('a#worklog-tabpanel').click();

        }
      }
    })
  }




  // ----------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------
  // # 主代码部分
  // ### bug页侧边栏添加记录日志按钮
  window.waitForAddedNode({
    selector: '#add-worklog-issue-right-panel-link',
    immediate: true,
    recursive: true,
    done: function(el) {
      const elMetaIssueKey = document.querySelector('meta[name="ajs-issue-key"]');
      const elDockLink = document.querySelector('#worklog-issue-dock-link');
      const elTitle = document.querySelector('a#key-val');
      const issuekey = elTitle ? elTitle.innerText : (elDockLink ? elDockLink.textContent : (elMetaIssueKey ? elMetaIssueKey.attributes['content'].value : ''));
      el.closest('tbody').insertAdjacentHTML('beforeend', HTMLCONTENT.logWorkRightPanel(issuekey));
    }
  });

  // ### 看板页下拉框添加记录日志按钮
  window.waitForAddedNode({
    selector: '.aui-list-item-link.issueaction-comment-issue',
    recursive: true,
    done: function(el) {
      const issuekey = el.attributes["data-issuekey"].value;
      el.closest('.aui-last').insertAdjacentHTML('beforebegin', HTMLCONTENT.logWorkDropdownPanel(issuekey));
    }
  });

  // ### 关bug弹窗添加记录日志按钮
  window.waitForAddedNode({
    selector: '[for="customfield_10528"]',
    recursive: true,
    done: function(el) {
      const issuekey = el.closest('.jira-dialog-content').querySelector('.dialog-title').textContent.match(/SLA-\d{1,10}/)[0];
      el.closest('form').querySelector('.buttons-container.form-footer').insertAdjacentHTML('afterbegin', HTMLCONTENT.logWorkDialog(issuekey));
    }
  });
  // ### 出现textarea的时候恢复最后值并绑定自动保存
  window.waitForAddedNode({
    selector: 'textarea',
    immediate: true,
    recursive: true,
    done: function(el) {
      window.restoreSavedValue(el);
      window.autoSave(el);
    }
  });
  // ### 清理很久之前的的自动暂存的内容
  window.cleanEarlySavedValue();


  // ### 页面注入css样式
  addCss ( `
td.quick-work-log-td {
  padding: 0;
  text-align: left;
  display: flex;
  flex-wrap: wrap;
}
div.buttons-container.form-footer {
  text-align: left;
}
div.quick-work-log-dialog-div {
  display: inline;
}
button.quick-work-log-btn {
  font-size: 14px;
  border-radius: 3px;
  cursor: pointer;
  background-image: none;
  background-color: rgba(9,30,66,.08);
  border: 1px solid transparent;
  color: #344563;
  text-decoration: none;
  display: inline-block;
  height: 2.14285714em;
  padding: 4px 10px;
  white-space: nowrap;
}
button.quick-work-log-btn:hover {
  background-color: rgba(9,30,66,.2)
}
td.quick-work-log-td button.quick-work-log-btn {
  margin: 5px 5px;
}
div.quick-work-log-dialog-div button.quick-work-log-btn {
  margin: auto 5px;
}
a.aui-list-item-link.quick-work-log-item {
  color: #172b4d;
}
a.aui-list-item-link.quick-work-log-item:hover {
  color: #42526e;
  background-color: #007fde;
}
div.auto-saved-tip {
    color: grey;
    font-size: 9pt;
    background: lightblue;
    display: table-row;
}

` );


})();