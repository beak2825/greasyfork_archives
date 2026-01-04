// ==UserScript==
// @name         JIRA看板快速标签功能
// @namespace    https://ysslang.com
// @version      1.0.0
// @description  在JIRA看板页下拉框中快速添加RDC相关标签
// @author       ysslang
// @license      CC-BY-NC-SA-4.0
// @match        https://work.fineres.com/*
// @icon         https://work.fineres.com/s/3e84z9/805005/12f785fd3d3d0d63b7c21a41e0d048b2/_/jira-favicon-hires.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539803/JIRA%E7%9C%8B%E6%9D%BF%E5%BF%AB%E9%80%9F%E6%A0%87%E7%AD%BE%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/539803/JIRA%E7%9C%8B%E6%9D%BF%E5%BF%AB%E9%80%9F%E6%A0%87%E7%AD%BE%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
  'use strict';
  console.warn('------------------------- quick labels script start -------------------------')
  
  var AJS = window.AJS || {};

  // ----------------------------------------------------------------------------------------------------
  // # 配置和常量定义
  
  // ### RDC标签列表
  const RDC_LABELS = [
    { name: '本周复盘', value: 'rdc:本周复盘', color: '#ff6b6b' },
    { name: '遗留待办', value: 'rdc:遗留待办', color: '#28f53b' },
    { name: '补充信息', value: 'rdc:补充信息', color: '#74c0fc' },
    { name: '完成复盘', value: 'rdc:完成复盘', color: '#51cf66' },
    { name: '无需复盘', value: 'rdc:无需复盘', color: '#868e96' }
  ];

  // ### HTML内容模板
  const HTMLCONTENT = {
    quickLabelsDropdownPanel: (issuekey) => `
      <ul class="aui-list-section quick-labels-ul">
        ${RDC_LABELS.map(label => `
          <li class="aui-list-item quick-labels-li">
            <a class="aui-list-item-link quick-labels-item" 
               role="menuitem" 
               data-location="dashboardDropdownPanel" 
               data-label="${label.value}" 
               data-issuekey="${issuekey}"
               style="border-left: 12px solid ${label.color};">
              📌 ${label.name.replace('rdc:','').trim()}
            </a>
          </li>
        `).join('')}
      </ul>
    `,
  };

  // ### 消息文本
  const TEXTMSG = {
    successMsg4AddLabel: (label) => `标签添加成功: "${label}"`,
    errMsg4AddLabel: (label) => `标签添加失败: "${label}", 请联系脚本维护者处理`,
    errMsg4GetToken: '获取token失败，请刷新页面重试',
    errMsg4GetIssueId: '获取issue ID失败',
  };

  // ----------------------------------------------------------------------------------------------------
  // # 核心功能方法
  
  // ### 获取atlassian token
  window.getAtlToken = function() {
    const tokenElement = document.querySelector('meta[name="atlassian-token"]');
    return tokenElement ? tokenElement.getAttribute('content') : null;
  };

  // ### 从URL或元素中提取issue ID
  window.extractIssueId = function(issuekey) {
    // 可以通过API获取，或者从下拉框的其他属性中提取
    // 这里需要根据实际情况调整
    const dropdown = document.querySelector(`[data-issuekey="${issuekey}"]`);
    if (dropdown && dropdown.closest('[data-issue-id]')) {
      return dropdown.closest('[data-issue-id]').getAttribute('data-issue-id');
    }
    
    // 备选方案：通过REST API获取
    return window.getIssueIdByKey(issuekey);
  };

  // ### 通过REST API获取issue ID
  window.getIssueIdByKey = function(issuekey) {
    return new Promise((resolve, reject) => {
      AJS.$.ajax({
        url: `https://work.fineres.com/rest/api/2/issue/${issuekey}`,
        type: 'GET',
        success: function(data) {
          resolve(data.id);
        },
        error: function() {
          reject('Failed to get issue ID');
        }
      });
    });
  };

  // ### 快速添加标签的核心方法
  window.quickAddLabel = function(issuekey, labelValue) {
    const atlToken = window.getAtlToken();
    if (!atlToken) {
      JIRA.Messages.showErrorMsg(TEXTMSG.errMsg4GetToken);
      return;
    }

    // 首先获取当前标签，然后添加新标签
    window.getCurrentLabelsAndAdd(issuekey, labelValue, atlToken);
  };

  // ### 获取当前标签并添加新标签
  window.getCurrentLabelsAndAdd = function(issuekey, newLabel, atlToken) {
    AJS.$.ajax({
      url: `https://work.fineres.com/rest/api/2/issue/${issuekey}`,
      type: 'GET',
      data: { fields: 'labels' },
      success: function(data) {
        const currentLabels = data.fields.labels || [];
        const currentLabelNames = currentLabels.map(label => label);
        
        // 检查是否已存在该标签
        if (currentLabelNames.includes(newLabel)) {
          JIRA.Messages.showWarningMsg(`标签 "${newLabel}" 已存在`);
          return;
        }

        // 移除其他RDC标签，只保留当前要添加的
        const filteredLabels = currentLabelNames.filter(label => !label.startsWith(`rdc:`));
        
        // 添加新标签
        filteredLabels.push(newLabel);
        
        // 执行标签更新
        window.executeAddLabel(issuekey, filteredLabels, atlToken);
      },
      error: function() {
        JIRA.Messages.showErrorMsg('获取当前标签失败');
      }
    });
  };

  // ### 执行标签添加请求
  window.executeAddLabel = function(issuekey, labelsArray, atlToken) {
    // 获取issue ID
    AJS.$.ajax({
      url: `https://work.fineres.com/rest/api/2/issue/${issuekey}`,
      type: 'GET',
      data: { fields: 'id' },
      success: function(data) {
        const issueId = data.id;

        // 构建请求数据，每个标签作为单独的labels参数
        const formData = new URLSearchParams();
        labelsArray.forEach(label => {
          formData.append('labels', label);
        });
        formData.append('inline', true);
        formData.append('noLink', true);
        formData.append('decorator', 'dialog');
        formData.append('id', issueId);
        formData.append('atl_token', atlToken);

        // 执行标签编辑请求
        AJS.$.ajax({
          url: `https://work.fineres.com/secure/EditLabels.jspa?atl_token=${atlToken}`,
          type: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: formData.toString(),
          success: function() {
            const addedLabel = labelsArray[labelsArray.length - 1]; // 获取最后添加的标签
            JIRA.Messages.showSuccessMsg(TEXTMSG.successMsg4AddLabel(addedLabel));

            // 可选：刷新页面或特定区域
            document.querySelectorAll('button.qrf-filter-item.aui-button-link.qrf-refresh-filters').forEach(button => button.click());
          },
          error: function() {
            console.error('标签添加失败:', xhr.responseText || error);
            JIRA.Messages.showErrorMsg(TEXTMSG.errMsg4AddLabel(labelsArray.join(', ')));
          }
        });
      },
      error: function() {
        JIRA.Messages.showErrorMsg(TEXTMSG.errMsg4GetIssueId);
      }
    });
  };

  // ### 标签点击事件处理器
  window.quickLabelClickHandler = function(event) {
    event.preventDefault();
    const issuekey = event.target.getAttribute('data-issuekey');
    const labelValue = event.target.getAttribute('data-label');
    
    if (!issuekey || !labelValue) {
      JIRA.Messages.showErrorMsg('缺少必要参数');
      return;
    }
    
    window.quickAddLabel(issuekey, labelValue);
  };

  // ### 往页面插入自定义CSS的方法
  window.addCss = function(cssString) {
    const head = document.getElementsByTagName('head')[0];
    const newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
  };

  // ### 全局的监听方法
  window.waitForAddedNode = function(params) {
    if(params.immediate) {
      const matched = [];
      matched.push(...document.querySelectorAll(params.selector));
      const smatched = [...new Set(matched)]
      if(!params.urlmatcher || location.href.includes(params.urlmatcher)) {
        for (const el of smatched) {
          params.done(el);
        }
      }
    }
    const observer = new MutationObserver(mutations => {
      const matched = [];
      for (const { addedNodes } of mutations) {
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
      if(!params.urlmatcher || location.href.includes(params.urlmatcher)) {
        for (const el of smatched) {
          params.done(el);
        }
      }
    });
    observer.observe(document.querySelector(params.parent) || document.body, {
      subtree: !!params.recursive || !params.parent,
      childList: true,
    });
  };

  // ----------------------------------------------------------------------------------------------------
  // # 主代码执行部分

  // ### 在看板页下拉框添加快速标签按钮
  window.waitForAddedNode({
    selector: '.aui-list-item-link.qrf-ia-comment-issue',
    recursive: true,
    done: function(el) {
      const issuekey = el.getAttribute("data-issuekey");
      if (!issuekey) return;
      
      // 在评论选项前插入标签选项
      el.closest('.aui-list').insertAdjacentHTML('afterbegin', HTMLCONTENT.quickLabelsDropdownPanel(issuekey));
      
      // 绑定点击事件
      const labelItems = document.querySelectorAll('.quick-labels-ul .quick-labels-li .quick-labels-item');
      labelItems.forEach(item => {
        item.removeEventListener('click', window.quickLabelClickHandler);
        item.addEventListener('click', window.quickLabelClickHandler);
      });
    }
  });

  // ### 注入CSS样式
  window.addCss(`
    /* 快速标签样式 */
    .aui-list-section.quick-labels-ul {
      border-top: 1px solid #ddd;
      margin: 5px 0;
    }
    
    .aui-list-section.quick-labels-ul .quick-labels-li {
      margin: 0;
    }
    
    .aui-list-section.quick-labels-ul .quick-labels-item {
      color: #172b4d !important;
      padding: 6px 20px;
      font-size: 13px;
      font-weight: 500;
    }
    
    .aui-list-section.quick-labels-ul .quick-labels-item:hover {
      background-color: #0052cc !important;
      color: white !important;
    }
    
    .aui-list-section.quick-labels-ul .quick-labels-item:before {
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 8px;
    }
    
  `);

  console.warn('------------------------- quick labels script loaded -------------------------');

})();