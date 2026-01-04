// ==UserScript==
// @name         jira日志记录功能增强-upgrade
// @namespace    armstrong@fanruan.com
// @version      4.4.13.4
// @description  一些技术支持需要用到的辅助功能, 目前包括: 日志快捷记录, 自动暂存文本框内容
// @author       Albert.Lu
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @match        https://work.fineres.com/browse/*
// @include      /^https?://work\.fineres\.com.*
// @icon         https://work.fineres.com/s/3e84z9/805005/12f785fd3d3d0d63b7c21a41e0d048b2/_/jira-favicon-hires.png
// @supportURL   https://greasyfork.org/en/scripts/415068
// @require      https://greasyfork.org/scripts/455782-fork-of-gm-config/code/fork%20of%20GM_config.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537278/jira%E6%97%A5%E5%BF%97%E8%AE%B0%E5%BD%95%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA-upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/537278/jira%E6%97%A5%E5%BF%97%E8%AE%B0%E5%BD%95%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA-upgrade.meta.js
// ==/UserScript==

/* DONE:
- fix: 并没有修复看板上的记录日志也能打开日志效果
*/

/* TODO:
- 优化埋点: 本地汇总后定期发送, 减少请求量;
- 冲突检测: 同时启用了多个这个插件的话, 进行提示;
- 主动升级提醒;
*/



(function() {
  'use strict';
  console.warn('------------------------- script start -------------------------')
  var JIRA = window.JIRA || {};
  var AJS = window.AJS || {};

  // ----------------------------------------------------------------------------------------------------
  // # 一些变量
  // ### 可配置选项;
  const configOptionsFrame = document.createElement('div')
  document.body.appendChild(configOptionsFrame);
  const CONFIG = {
    "id": "JIRA_USERSCRIPT_OPTIONS",
    "title": "jira日志记录功能增强脚本 配置界面",
    "frame": configOptionsFrame,
    "fields": {
      "localization": { "type": "checkbox", "label": "自动翻译部分英文标签", "default": true, "section": ['通用'], },
      "WORKLOGOBSTACLES_type": { "type": "radio", "label": "日志记录-障碍点类型", "options": ["默认", "融合区测试1"], "default": "默认", "section": ['日志记录助手'], },
      "WORKLOGOBSTACLEHINTS_show": { "type": "checkbox", "label": "日志记录-显示障碍点参考方案提示", "default": true, },
    },
  };


  // ### 自定义日志快捷记录, 每条一个数组, 数组第一项是记录名称字符串, 第二项是时长字符串, 第三项是内容字符串. (注意需要带标签, 有人要审核标签)
  // *** (注意此配置暂时无法保存, 每次重新安装或更新后都要重新定义) ***
  const WORKLOGS = {
    ALL: [
      {name: '1m_待发布', duration: '1m', state: '修复待发布', obstacles: [], extra: '', location: ['right-panel', 'dropdown-panel']},
      {name: '我未跟进', duration: '1m', state: '', obstacles: ['未跟进'], extra: '', location: ['right-panel', 'dropdown-panel']},
      {name: '关问题', duration: '5m', state: '实施后观察效果', obstacles: [], extra: '关问题', location: ['right-panel', 'dropdown-panel']},
    ],
    filter: (location) => WORKLOGS.ALL.filter(log => log.location.includes(location)),
    content: (log) => `${TEMPLATES.status(log.state)}\n${TEMPLATES.obstacle(log.obstacles)}\n${log.extra}`,
    filterByName: (name) => WORKLOGS.ALL.filter(log => log.name.includes(name))[0] || {},
  };

  // ### 重构后的问题状态日志记录字段.  请勿随意修改! 无效的字段或格式是无法被crm处理统计的!! 事关个人绩效.请勿随意修改!
  const WORKLOGSTATES = [ '沟通和定位', '方案准备和交付', '__SPACE__', '方案待实施', '实施后观察效果', '__SPACE__', '研发处理', '修复待发布', '二开沟通阶段','前期沟通','部署阶段','测试升级','测试升级后问题处理','正式升级','正式升级后问题处理', ];
  const WORKLOGOBSTACLES = () => {return [ '一线给了错误信息', '文档找不到或缺失', '文档错误', '流程不清晰', '__SPACE__', '环境特殊', '内网', '需搭建环境', '__SPACE__', '未到约定沟通日期', '客户无响应', '客户配合意愿较低', '__SPACE__', '未跟进', '反复修改需求', '难还原待复现', '不知道找谁/找了进度慢', ].concat(GM_config.get("WORKLOGOBSTACLES_type")=="融合区测试1" ? ["专家处理慢", "三线处理慢"] : []) };
  const WORKLOGOBSTACLEHINTS = {
    '三线处理慢': '1、高频率催促2、识别到客户的紧急情绪或问题本身重要紧急，且自行推进不动时，反馈至组长',
    '专家处理慢': '1、专家节点停留超过24h，主动询问是否转三线处理2、专家未处理满24h，主动研究问题或寻找其他内部资源',
    '内网': '理清思路（如本地复现找到日志报错关键字），整理一份清单，一次性发给客户来获取信息。',
    '反复修改需求': '按照自己的理解，使用专业术语，复述客户的需求，让客户确认',
    '客户配合度差且无法延长确诊': '1、电话沟通，以期高效配合2、若问题不严重、不紧急，则可与客户协商有空的时间再处理',
    '文档找不到或缺失': '1、帮助文档问题，提交文档demo任务2、内部文档问题，联系专家确认；或反馈至学习委员',
    '文档错误': '1、帮助文档问题，提交文档demo任务2、内部文档问题，联系专家确认；或反馈至学习委员',
    '未跟进': '评估是否需要交接给他人处理',
    '流程不清晰': '及时反馈至师傅>组长>学习委员。',
    '环境特殊': '待补充。拨开云雾见青天，透过现象看本质。',
    '难还原待复现': '专家是否确认难还原',
    '需搭建环境': '若客户问题提出已超过24h，则先转专家协助，或组内询问是否有现成环境，后本地搭建，复盘问题',
  }
  // #### 以下两个变量用来根据问题状态/类别隐藏不需要的问题状态选项的. 逻辑是HIDEITEMRULES中的键对应html元素会带有一个"_标识_"的属性标记, 然后hideUnnecessaryItem()方法会根据问题实际的状态/类别和ISSUEINFODICT定义的状态进行"_标识_"的剔除, 剩下来的没剔除掉的, 都会设置隐藏;
  const HIDEITEMRULES = {
    '研发处理': ['_研发处理中_'],
    '修复待发布': ['_待发布_'],
    '二开沟通阶段': ['_二开中_'],
    '沟通和定位': ['_SLA待确诊_'],
    '方案准备和交付': ['_SLA待确诊_'],
    '方案待实施': ['_SLA已确诊_'],
    '实施后观察效果': ['_SLA已确诊_'],
    '一线给了错误信息': ['_SLA待确诊_', '_SLA已确诊_'],
	'前期沟通': ['_升级流程_'],
	'部署阶段': ['_升级流程_'],
	'测试升级': ['_升级流程_'],
	'测试升级后问题处理': ['_升级流程_'],
	'正式升级': ['_升级流程_'],
	'正式升级后问题处理': ['_升级流程_'],
  };
  const ISSUEINFODICT = {
    PROJECT: {
      '三线': ['REPORT', 'BI', 'DEC', 'MOBILE', 'CHART', ],
      '二开': ['JSD', 'TM', 'SLN'],
    },
    STATUS: {
      'SLA待确诊': ['技术支持小组长', '组长分配', '待恢复', '待确诊', '转研发审核'],
      'SLA已确诊': ['待观察', '组长审核', '已解决', 'bug已解决', '协商关闭'],
      '三线处理中': ['测试处理', '研发组员问题解决中', '测试组员测试验收中', '研发组长验收', '产品确认'].concat(['待分配', '组长分配', '子模块组长分配', '测试组长分配', '架构组分配']).concat(['重复BUG待解决']),
      '三线待发布': ['验收通过待发布'].concat(['重复BUG待解决']),
      '三线已解决': ['被否决', '已解决', '创建者确认', '创建者验收'].concat(['产品确认']),
      '二开中': [''],
	  '升级流程': ['组员处理'],
    }
  };

  // ### 一些预定义的html内容, 请勿随意修改! 会影响脚本正常运行!
  const HTMLCONTENT = {
    logWorkRightPanel: (issuekey) => `<tr class="quick-work-log-tr"><td class="quick-work-log-td">${WORKLOGS.filter('right-panel').map(log => `<div class="quick-work-log-btn" data-location="issueRightPanel" data-log="${log.name}" data-issuekey="${issuekey}">${log.name}</div>`).join('')}</td></tr>`,
    logWorkDropdownPanel: (issuekey) => `<ul class="aui-list-section quick-work-log-ul">${WORKLOGS.filter('dropdown-panel').map(log => {return `<li class="aui-list-item quick-work-log-li"><a class="aui-list-item-link quick-work-log-item" role="menuitem" data-location="dashboardDropdownPanel" data-log="${log.name}" data-issuekey="${issuekey}">${log.name}</a></li> \n `}).join('') }</ul> \n `,
    logWorkDialog: (issuekey) => `<div class="quick-work-log-dialog-div">${WORKLOGS.filter('log-work-dialog').map(log => {return `<div class="quick-work-log-btn" data-location="logWorkDialog" data-log="${log.name}" data-issuekey="${issuekey}">${log.name}</div>`}).join('') }</div>`,

    fieldGroup: (inner) => `<div class="field-group" id="wp-fg-status"><label for="log-work-status">Issue Status<span class="aui-icon icon-required"> Required</span></label><div class="log-work-status-pick-box">${inner}</div></div>`,
    statePanelBox: () => `<div class="log-work-status-panel state-panel" id="log-work-status-state-panel">${HTMLCONTENT.stateListHeader}<div class="log-work-status-list-scroll"><div class="aui-list log-work-status-list state-ul">${WORKLOGSTATES.map(stt => stt == '__SPACE__' ? HTMLCONTENT.spacerItem.repeat(2) : HTMLCONTENT.stateItem(stt)).join('')}</div></div></div>`,
    stateListHeader: `<div class="log-work-status-list-header list-header">当前问题状态*</div>`,
    stateItem: (state) => `<div class="log-work-status-list-item state-item" state="${state}" ${HIDEITEMRULES[state] && HIDEITEMRULES[state].join(' ') || ''} ><p class="aui-list-item-link"><span>${state}</span></p></div>`,
    obstaclePanelBox: () => `<div class="log-work-status-panel obstacle-panel" id="log-work-status-obstacle-panel">${HTMLCONTENT.obstacleListHeader}<div class="log-work-status-list-scroll"><div class="aui-list log-work-status-list obstacle-ul">${WORKLOGOBSTACLES().map(obs => obs == '__SPACE__' ? HTMLCONTENT.spacerItem : HTMLCONTENT.obstacleItem(obs)).join('')}</div></div></div>`,
    obstacleListHeader: `<div class="log-work-obstacle-list-header list-header">当前障碍点<span class="list-header-tip">(可多选)</span></div>`,
    obstacleItem: (obstacle) => `<div class="log-work-status-list-item obstacle-item" obstacle="${obstacle}" ${HIDEITEMRULES[obstacle] && HIDEITEMRULES[obstacle].join(' ') || ''} ><p class="aui-list-item-link"><span>${obstacle}</span></p></div>`,
    spacerItem: `<div  class="log-work-status-list-item spacer-item">&nbsp;</div>`,

    solutionTip: `<div class="description">没有定位到问题原因的可以写能帮助判断所属模块的原因</div>`,
    outerSolutionInvalidTip: `<div class="description" id="outerSolutionInvalidTip">对外解决方案请不要包含【原因】字段</div>`,
    autoStorageTip: (msg) => `<div class="auto-saved-tip" title="内容缓存到本地session啦,  找回内容请找 LeoYuan">~~~${msg || '内容已自动缓存'}~~~</div>`,
    fieldCompanyInfo: (el) => `${el.innerText}<a class="added-field-button" href="https://crm.finereporthelp.com/WebReport/decision/view/report?reportlet=customer/company_view.cpt&op=view&comid=${el.innerText.trim()}" target="_blank">crm客户信息</a>`,
    fieldCompanyName: (el) => `${el.innerText}<a class="added-field-button" href="https://crm.finereporthelp.com/WebReport/decision/view/report?autoQuery=true&viewlet=customer/contact_list.cpt&op=write&COMNAME=${encodeURIComponent(el.innerText.trim())}" target="_blank">crm查客户</a>`,
    fieldCustomerAcitivities: (el) => `<a class="added-field-button" href="${el.href}" target="_blank">crm客户活动</a>`,
    fieldChatWithQQ: (el) => `${el.innerText}<a class="added-field-button" href="tencent://message/?uin=${el.innerText}&Site=qq&Menu=yes" target="_blank">发起聊天</a>`,
    ModuleExpertFeedback: (el) => `${el.innerText}<a class="added-field-button" href="https://t6ixa9nyl6.jiandaoyun.com/f/624274c82280110008d32e36?ext=sla" target="_blank">意见反馈</a>`,
    fieldModuleExpert: (name, sameUser) => `<dl><dt title="专家">专家:</dt><dd><span class="user-hover" rel="${name}" id="user_cf_${name}">${name}</span>${sameUser ? '' : HTMLCONTENT.MESupportButton}${sameUser ? HTMLCONTENT.MECreateTESTaskButton : ''}</dd></dl>`,
    MESupportType: (list) => ['<div class="mesupporttype-button-list">', list.map( type => `<a href="javascript:quickFieldEdit('customfield_19449', '${type[0]}', 3)" class="added-field-button">${type[1]}</a>`).join(''), '</div>'].join(''),
    MESupportButton: `<a href="javascript:handleModuleExpertButton()" class="added-field-button">支撑</a>`,
    MECreateTESTaskButton: `<a href="javascript:createTESTask()" class="added-field-button">建学习任务</a>`,
    fieldResponsibleModuleExpert: (name) => `<dl><dt title="责任专家">责任专家:</dt><dd><span class="user-hover" rel="${name}" id="user_cf_${name}">${name}</span></dd></dl>`,
    reportSensitiveWordsButton: `<a href="https://www.jiandaoyun.com/app/59f96c4ae1ddba302aaa624a/entry/619eeea6dd59100007fc5d08" id="reportSensitiveWords" class="aui-button" target="_blank">反馈敏感词</a>`,
    diagnoseReportButton: (issuekey) => `<a href="https://report.fineres.com/webroot/decision/view/report?viewlet=%25E5%2585%25AC%25E5%2585%25B1%252Fsupport%252F%25E4%25B8%2593%25E5%25AE%25B6%252FDiagnose.cpt&op=write&工单=${issuekey}&ly=jira0" id="diagnoseReport" class="aui-button" target="_blank">诊断书</a>`,
    custRiskEvaluateButton: (mobile) => `<a href="https://crm.finereporthelp.com/WebReport/decision/view/report?viewlet=support_success%252Fcust_risk_evaluate.cpt&op=view&mobile=${mobile}" id="custRiskEvaluate" class="aui-button" target="_blank">风险评估书</a>`,
    custNLPButton: () => `<a href="javascript:handleNLPstuff();" id="NLPbutton" class="aui-button">NLP</a>`,
    configOptionLI: `<li> <a id="config_options" class="config_options" title="配置jira脚本的功能" tabindex="-1">设置jira脚本</a> </li>`,
  }

  // ### 一些文本格式模板, 请勿随意修改!
  const TEMPLATES = {
    status: (inner) => inner ? `【[-${inner}-]】` : '',
    statusRegex: /【\[-[^】]{2,20}-\]】/g,
    statusRegexMatch: /【\[-([^】]{2,30})-\]】/,
    obstacle: (inner) => inner.length ? `当前障碍点: ${JSON.stringify(inner)}` : '',
    obstacleRegex: /当前障碍点:\s*\["[^\]]{2,256}\"]/g,
    solutionRegex: /^[\s\S]*【问题原因】([\s\S]*?)【解决方案】([\s\S]*?)(?:【操作手册】([\s\S]*?))?(?:【风险规避】([\s\S]*?))?$/,
    descPrefixes: [/遇到的异常：/, /想实现的效果：/, /【原始需求】/, /问题描述-?:?/, /【现象】/],
    outerSolutionInvalidRegex: /【原因】|【问题原因】/,
  }

  // ### 一些文本性内容
  const TEXTMSG = {
    template4InnerSolution: (cause, solution) => `【问题原因】${cause || ""}\n【解决方案】${solution || ""}\n【操作手册】\n【风险规避】`,
    template4OuterSolution: (cause, solution) => `【解决方案】${solution || ""}`,
    tipOnSolution4Customer: `请注意文明用语，内容客户可见！\n请勿泄露公司内部信息，人员姓名等！\n请谨慎使用“BUG”来描述问题，以免客户误解`,
    errMsg4IssueInfo: '工单信息获取出现问题, 请联系LeoYuan或Armstrong处理',
    errMsg4logWork: (inner) => `记录失败"${inner}", 请联系LeoYuan或Armstrong处理`,
    errMsg4FindIssueInfo: () => `获取issue信息失败了, 请联系LeoYuan处理`,
    errMsg4FieldEdit: (f,v) => ` ${f} 字段设置为 ${v} 失败, 请联系LeoYuan处理`,
    successMsg4FieldEdit: (f,v) => ` ${f} 字段设置为 ${v} 成功`,
    successMsg4logWork: (inner) => `记录成功"${inner}"`,
  }

  // ### 预定义的翻译国际化, 可根据自身需求修改. lang是匹配的浏览器语言. trans是自定义的内容.
  // * selector注意尽可能唯一确定, 范围过大的话所有匹配到的内容都会翻译掉;
  // * from为空时整个元素的innerText替换为to, from不为空时执行replace操作, 元素中匹配到from的内容替换为to;
  // * 支持添加callback方法自定义翻译, 比如有些元素的文本不在innerText中, 可以自定义方法进行修改. 方法默认接受三个参数, 单个的元素, from文本, to文本;
  const LOCALIZATION = [{
    lang: ['zh', 'zh-CN'],
    trans: [
      {selector: 'label[for="log-work-issue-picker-field"]', from: '', to: '任务'},
      {selector: 'label[for="log-work-worklog-author-field"]', from: '', to: '用户'},
      {selector: 'label[for="log-work-period"]', from: '', to: '阶段'},
      {selector: 'label[for="log-work-status"]', from: '', to: '阶段'},
      {selector: 'label[for="log-work-time-logged"]', from: '', to: '花费时间'},
      {selector: 'label[for="log-work-date-logged"]', from: '', to: '工时开始时间'},
      {selector: 'label[for="wp-copy-to-issue-comments"]', from: '', to: '复制到任务的评论中'},
      {selector: 'label[for="comment"]', from: '', to: '进展'},
      {selector: '#wp-fg-estimates label', from: '', to: '剩余工作时间'},
      {selector: '[class="aui-form example"]', from: '', to: '(例如 3d 12h 30m,单位需小写)'},
      {selector: 'div#WorklogByUserPanel a#add-worklog-issue-right-panel-link', from: '', to: 'Log Work(其他情况点我记录)'},
      {selector: '#worklogpro-log-work-submit', from: '', to: '确认记录工时', callback: (el, from, to) => {el.value = to}},
    ]
  }]

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
      const smatched = [...new Set(matched)]
      if(!params.urlmatcher || location.href.includes(params.urlmatcher)) {
        for (const el of smatched) {
          params.done(el);
        }
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
  }
  // ### 功能埋点方法, 记录使用情况
  window.eventTracker = {
    log: (event, text, storage) => {
      const data = window.eventTracker.__prepareData(event, text);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
          //          console.log('-------------------------\n', event, data, storage, this.responseText);
          if(typeof(storage) == 'object' && storage.k && storage.v) localStorage.setItem(storage.k,storage.v)

        }
      });
      xhr.open("POST", "https://fr-support.fineres.com:60083/c447bb0737483295a34e14ec74c61589");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(data);
    },
    __prepareData: (event, data) => JSON.stringify({
      t: 'JIRA',
      c: AJS.params.loggedInUser || 'unknown',
      e: event || 'none',
      i: JSON.stringify(data || {}),
    }),
    __installedNotify: () => {
      if(localStorage.getItem('__scriptInstalled') && localStorage.getItem('__scriptInstalled') == GM_info.script.version) return;
      const data = {
        version: GM_info.script.version,
        browser: navigator.userAgent,
        languare: navigator.language,
        time: +new Date(),
      };
      return window.eventTracker.log('scriptInstalled', data, {k:'__scriptInstalled', v:GM_info.script.version});
    },
  }
  window.et = window.eventTracker;
  // ### 自动暂存填写内容
  window.tipTimer = 0;
  window.autoSaveKeyGenerator = function (el) {
    return ['__autoSave', location.pathname, el.parentNode.attributes && el.parentNode.attributes.id && el.parentNode.attributes.id.value || '', el.attributes && el.attributes.id && el.attributes.id.value || ''].join('__');
  }
  window.autoSave = function(el) {
    const keyName = window.autoSaveKeyGenerator(el);
    el.addEventListener('keyup', function(e){
      //      var msg = '内容已自动缓存';
      clearTimeout(window.tipTimer);
      const data = {
        value: event.target.value,
        timestamp: + new Date(),
      };
      if(data.value){
        localStorage.setItem(keyName, JSON.stringify(data));
      } else {
        localStorage.removeItem(keyName);
        //        msg = '缓存内容已清除';
      }
      //      window.tipTimer = setTimeout(function(){
      //        if(!el.parentNode.querySelector('.auto-saved-tip')) el.insertAdjacentHTML('afterend', HTMLCONTENT.autoStorageTip(msg));
      //        setTimeout(function(){el.parentNode.querySelectorAll('.auto-saved-tip').forEach(el => el.remove()); }, 10000);
      //      }, 500)
    })
  };
  // ### 恢复自动暂存的内容
  window.restoreSavedValue = function(el) {
    const keyName = window.autoSaveKeyGenerator(el);
    const data = JSON.parse(localStorage.getItem(keyName));
    if(!data || !data.timestamp || !data.value) return;
    if(data.timestamp < (new Date() - 60*60*1000)) return;
    if(el.value && el.value != '无') return;
    el.value = data.value;
    el.insertAdjacentHTML('afterend', HTMLCONTENT.autoStorageTip('已恢复缓存内容. 无需恢复请清空该控件内容后刷新页面. 详询 LeoYuan'))
  };
  // ### 自动清理过早的记录
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
  window.quickWorkLog = function(duration, message, key, target){
    window.et.log('quickWorkLog', {target: target});
    if(!duration) JIRA.Messages.showErrorMsg('未提供日志时长');
    if(!message) JIRA.Messages.showErrorMsg('未提供日志内容');

    const user = AJS.params.loggedInUser;
    const issuekey = key || document.querySelector('meta[name="ajs-issue-key"]').attributes.content.value;
    const atltoken = document.querySelector('meta[name="atlassian-token"]').attributes.content.value;
    const startDate = window.moment(new Date).format(JIRA.translateSimpleDateFormat('yyyy-MM-dd HH:mm'));
    const endDate = window.moment(new Date).format(JIRA.translateSimpleDateFormat('yyyy-MM-dd'));

    return AJS.$.post({
      url:'https://work.fineres.com/secure/WPCreateWorklogOnIssueWithWorkLogAction.jspa?atl_token=' + atltoken,
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        inline: true,
        decorator: 'dialog',
        jql: '',
        navFilter: '',
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
        comment: message,
        commentLevel: ''
      },
      success: function(){
        JIRA.Messages.showSuccessMsg(TEXTMSG.successMsg4logWork(message));
        if(document.querySelector('div#worklog-tabpanel')){
          document.querySelector('a#comment-tabpanel').click();
          document.querySelector('a#worklog-tabpanel').click();
        }
      },
      fail: function(){
        JIRA.Messages.showErrorMsg(TEXTMSG.errMsg4logWork(message));
        window.et.log('quickWorkLogFailed', {target: target, duration: duration, message: message, key: key, location: location.href});
      }
    })
  }

  // ### 快捷设置issue指定单个字段值的方法
  window.quickFieldEdit = function(field, value, refresh) {
    window.et.log('quickFieldEdit', {field: field, value: value});
    if(!field) JIRA.Messages.showErrorMsg('未提供字段名');
    if(!value) JIRA.Messages.showErrorMsg('未提供字段值');

    const user = AJS.params.loggedInUser;
    const issueId = window.findIssueId();
    const atltoken = document.querySelector('meta[name="atlassian-token"]').attributes.content.value;

    var data = {
      issueId: issueId,
      atl_token: atltoken,
      singleFieldEdit: true,
      fieldsToForcePresent: field
    }
    data[field] = value;

    AJS.$.post({
      url:'https://work.fineres.com/secure/AjaxIssueAction.jspa',
      header: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      data: data,
      success: function(res){
        let label = field;
        if(res && res.fields) res.fields.filter(f=> f.id === field).forEach(f => label = f.label);
        JIRA.Messages.showSuccessMsg(TEXTMSG.successMsg4FieldEdit(label, value));
        if(refresh) setTimeout(function(){window.location.reload()}, Number.isInteger(refresh) ? refresh * 1000 : 2000);
      },
      fail: function(){
        JIRA.Messages.showErrorMsg(TEXTMSG.errMsg4FieldEdit(field, value));
        window.et.log('quickFieldEditFailed', {field: field, value: value});
      }
    });
    return ;
  }

  // ### 获取issue信息的方法
  window.getIssueFields = function(key, fields, successCallback) {
    if(!fields) fields = 'status,customfield_14301,issuelinks';
    return AJS.$.get({
      url: 'https://work.fineres.com/rest/api/2/issue/' + key,
      data: {fields: fields},
      success: function(res){
        if(typeof(successCallback) == 'function') successCallback(res);
        return res;
      },
      fail: function(res){
        JIRA.Messages.showErrorMsg(TEXTMSG.errMsg4IssueInfo);
        window.et.log('getIssueFieldsFailed', {key: key, fields: fields, location: location.href});
      }
    })
  }

  // ### 查找当前页面的issuekey
  window.findIssuekey = function() {
    const elMetaIssueKey = document.querySelector('meta[name="ajs-issue-key"]');
    const elDockLink = document.querySelector('#worklog-issue-dock-link');
    const elTitle = document.querySelector('a#key-val');
    const issuekey = elTitle ? elTitle.innerText : (elDockLink ? elDockLink.textContent : (elMetaIssueKey ? elMetaIssueKey.attributes.content.value : ''));
    if(!issuekey) JIRA.Messages.showErrorMsg(TEXTMSG.errMsg4FindIssueInfo);
    return issuekey;
  }

  // ### 查找当前页面的issueId
  window.findIssueId = function() {
    const elNavLink = document.querySelector('div.issue-header-content a#key-val.issue-link');
    const issueId = elNavLink ? elNavLink.attributes.rel.value : '';
    if(!issueId) JIRA.Messages.showErrorMsg(TEXTMSG.errMsg4FindIssueInfo);
    return issueId;
  }

  // ----------------------------------------------------------------------------------------------------
  // ## 一些适用于issue页面的组件用的小方法
  // ### 处理日志记录的state字段的方法
  window.stateClicked = function (event){
    window.et.log('statusClicked');
    const state = (event.target.querySelector('span') || event.target.closest('span')).innerText;
    window.prependStateContent(state);
    document.querySelectorAll('div.log-work-status-list-item.state-item').forEach(li => li.classList.remove('active'));
    (event.target.querySelector('div.log-work-status-list-item') || event.target.closest('div.log-work-status-list-item')).classList.add('active');
  }
  window.obstacleClicked = function (event){
    window.et.log('obstacleClicked');
    const el = event.target.querySelector('div.log-work-status-list-item') || event.target.closest('div.log-work-status-list-item');
    const isActivated = el.classList.contains('active');
    const obstacle = el.attributes.obstacle.value;
    if(isActivated) {
      el.classList.remove('active')
    } else {
      el.classList.add('active');
      if(GM_config.get('WORKLOGOBSTACLEHINTS_show') && WORKLOGOBSTACLEHINTS[obstacle] ) AJS.messages.hint("#wp-fg-status", { title: `"${obstacle}" 参考方案`, body: `${WORKLOGOBSTACLEHINTS[obstacle]}` });
    }
    const activeObstacles = document.querySelectorAll('div.log-work-status-list-item.obstacle-item.active');
    window.prependObstacleContent([...activeObstacles].map(obs => obs.innerText));
  }
  window.prependStateContent = function(state) {
    const commentElement = document.querySelector('div.field-group#wp-fg-comment textarea#comment');
    const newComment = `${TEMPLATES.status(state)}\n${window.purgeStateText(commentElement.value)[0]}`;
    commentElement.value = newComment;
    commentElement.dispatchEvent(new Event('input'));
  }
  window.prependObstacleContent = function(obstacles) {
    const commentElement = document.querySelector('div.field-group#wp-fg-comment textarea#comment');
    const statePurged = window.purgeStateText(commentElement.value);
    const obstaclePurged = window.purgeObstacleText(statePurged[0]);
    const obstaclesText = TEMPLATES.obstacle(obstacles);
    const newComment = [...statePurged[1], obstaclesText, obstaclePurged[0]].join('\n');
    commentElement.value = newComment;
    commentElement.dispatchEvent(new Event('input'));
  }
  window.purgeStateText = function(text) {
    const matched = (text.match(TEMPLATES.statusRegex) || []).filter(m => {
      const s = m.match(TEMPLATES.statusRegexMatch);
      return s && s[1] && WORKLOGSTATES.filter(st => st == s[1]).length > 0;
    });
    matched.forEach(m => (text = text.replace(m, '')) == '');
    return [text.trim(), matched];
  }
  window.purgeObstacleText = function(text) {
    let matched = (text.match(TEMPLATES.obstacleRegex) || [])
    matched.forEach(m => (text = text.replace(m, '')) == '');
    return [text.trim(), matched];
  }
  window.translatePage = function(lang) {
    if(!GM_config.get("localization")) return;
    lang = lang || navigator.language;
    LOCALIZATION.filter(lcl => lcl.lang.includes(lang))
      .forEach(lcl => {
      lcl.trans.forEach(trs => {
        document.querySelectorAll(trs.selector).forEach(el => {
          typeof(trs.callback) == 'function' ? trs.callback(el, trs.from, trs.to) : (el.innerText = trs.from ? el.innerText.replace(trs.from, trs.to) : trs.to);
        })
      })
    })
  }
  window.determineSubmitButton = function() {
    const textarea = document.querySelector('form#log-work-lean div#wp-fg-comment textarea');
    const btn = document.querySelector('form#log-work-lean div.form-footer input#worklogpro-log-work-submit');
    textarea.addEventListener('input', event => {
      const match = window.purgeStateText(event.target.value);
      if(match[1][0]) {
        textarea.setAttribute('hasStatus','');
        btn.removeAttribute('disabled');
        btn.value = '确认记录工时';
      } else {
        textarea.removeAttribute('hasStatus');
        btn.setAttribute('disabled','');
        btn.value = '选择问题状态后才能提交';
      }
    });
    textarea.addEventListener('keydown', window.preventKeyboardSubmit);
    setTimeout(function(){textarea.dispatchEvent(new Event('input'))}, 100);
  }
  window.preventKeyboardSubmit = function(event) {
    if(event.target.hasAttribute('hasStatus')) return;
    if(!event.ctrlKey || 13 !== event.keyCode) return;
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
  window.hideUnnecessaryItem = function(issuekey) {
    return window.getIssueFields(issuekey, '', function(res) {
      if(!res || !res.fields) return;
      const info = {
        key: res.key,
        project: res.key.split('-')[0],
        status: res.fields.status.name,
        links: res.fields.issuelinks.map(linking => {
          const link = linking.inwardIssue ? linking.inwardIssue : linking.outwardIssue ? linking.outwardIssue : {key:'ERROR', status:{name:'ERROR'}};
          return {
            key: link.key,
            project: link.key.split('-')[0],
            status: link.fields.status.name,
          }}),
      };
      //获取所有的隐藏属性标签, 在下面进行排除, 剩下的标签都会隐藏掉;
      const attributes = [...new Set([].concat(...Object.values(HIDEITEMRULES)))];
      if(info.links.filter(link => ISSUEINFODICT.PROJECT['三线'].includes(link.project)).filter(link => ISSUEINFODICT.STATUS['三线待发布'].includes(link.status)).length) attributes.splice(attributes.indexOf('_待发布_'), 1) && document.querySelectorAll(`div[_待发布_]`).forEach(el => (el.classList.add('_unhide_')));
      if(info.links.filter(link => ISSUEINFODICT.PROJECT['三线'].includes(link.project)).filter(link => ISSUEINFODICT.STATUS['三线处理中'].includes(link.status)).length) attributes.splice(attributes.indexOf('_研发处理中_'), 1) && document.querySelectorAll(`div[_研发处理中_]`).forEach(el => (el.classList.add('_unhide_')));
      if(info.links.filter(link => ISSUEINFODICT.PROJECT['二开'].includes(link.project)).length) attributes.splice(attributes.indexOf('_二开中_'), 1) && document.querySelectorAll(`div[_二开中_]`).forEach(el => (el.classList.add('_unhide_')));
      if(ISSUEINFODICT.STATUS['SLA已确诊'].includes(info.status)) attributes.splice(attributes.indexOf('_SLA已确诊_'), 1) && document.querySelectorAll(`div[_SLA已确诊_]`).forEach(el => (el.classList.add('_unhide_')));
      if(ISSUEINFODICT.STATUS['SLA待确诊'].includes(info.status)) attributes.splice(attributes.indexOf('_SLA待确诊_'), 1) && document.querySelectorAll(`div[_SLA待确诊_]`).forEach(el => (el.classList.add('_unhide_')));
	  if(ISSUEINFODICT.STATUS['升级流程'].includes(info.status)) attributes.splice(attributes.indexOf('_升级流程_'), 1) && document.querySelectorAll(`div[_升级流程_]`).forEach(el => (el.classList.add('_unhide_')));

      attributes.forEach(attr => (document.querySelectorAll(`div[${attr}]:not(._unhide_)`).forEach(el => (el.style.display = 'none')) == '') == '');
    })
  }
  window.quickWorkLogClickHandler = function(event) {
    const location = event.target.attributes['data-location'].value;
    const logName = event.target.attributes['data-log'].value;
    const issuekey = event.target.attributes['data-issuekey'].value;
    const log = WORKLOGS.filterByName(logName);
    if(!log.name) return JIRA.Messages.showErrorMsg(TEXTMSG.errMsg4logWork(' 未能获取到对应日志记录, '));
    const content = WORKLOGS.content(log);
    return window.quickWorkLog(log.duration, content, issuekey, location);
  }
  window.zhinengtuijianclicked = function(event){
    const data = {
      user: AJS.params.loggedInUser,
      title: event.target.innerText,
      href: event.target.href,
      issuekey: document.querySelector('#issue-content #key-val').innerText,
      issuestatus: document.querySelector('#issue-content #status-val').innerText,
    }
    window.et.log('zhinengtuijian', data);
  }

  window.parseDescriptionContent = function(text) {
    function parseSentence(s){
      const matchN = TEMPLATES.descPrefixes.find(reg => s.match(reg));
      if(!matchN) return false;
      return s.replace(matchN, '');
    }
    return text.split('\n').map(e => e.trim()).filter(parseSentence).map(parseSentence).join('\n');
  }
  window.parseSolutionContent = function(text) {
    const res = text.match(TEMPLATES.solutionRegex);
    if(!res || res.length < 3) return '';
    return TEXTMSG.template4OuterSolution('', res[2]);
  }

  window.validateOuterSolution = function() {
    const textarea = document.querySelector('textarea#customfield_16005[name="customfield_16005"]');
    textarea.addEventListener('input', event => {
      const match = event.target.value.match(TEMPLATES.outerSolutionInvalidRegex);
      if(match) {
        textarea.parentElement.setAttribute('invalid','');
      } else {
        textarea.parentElement.removeAttribute('invalid');
      }
    });
    textarea.addEventListener('keydown', window.preventKeyboardSubmit);
    setTimeout(function(){textarea.dispatchEvent(new Event('input'))}, 1000);
  }

  window.handleNLPstuff = function(){
    window.getIssueFields(window.findIssuekey(), 'summary,description', res => {
      const text = res && res.fields && `${res.fields.summary}\n${res.fields.description}` || '';
      navigator.clipboard.writeText(text);
      setTimeout(function(){window.open(`https://tsjupyter.ysslang.com:60443/doc/tree/0prod/_issueAsiggnAPI.ipynb`)});
    });
  }

  window.createTESTask = function(){
    const issuekey = window.findIssuekey();
    window.getIssueFields(issuekey, 'summary,customfield_10518,customfield_16601', res => {
      setTimeout(function(){window.open(`https://tss.frts.y30.xyz:54443/webroot/decision/view/report?op=write&viewlet=JIRA-TES.cpt&jirakey=${issuekey}&summary=${res.fields.summary}&assignee=${res.fields.customfield_10518.name}&reporter=${res.fields.customfield_16601.name}`)});
    });
  }

  window.isModuleExpert = function(){
    const MEList = ['Albert.Lu', 'Dolores', 'caster', 'Chenxing.Yu', 'Daisy.Zhang', 'Johnny.Xue', 'kaimi', 'Kivia', 'Larry', 'LeoYuan', 'Leslie.Zhang', 'Phyli.Zhou', 'XuYeqiang','Alyssa']
    return MEList.includes(AJS.params.loggedInUser) ? true : false
  }

  window.handleModuleExpertButton = function(){
    const user = AJS.params.loggedInUser;
    quickFieldEdit('customfield_16601', user);
    window.getIssueFields(window.findIssuekey(), 'customfield_13202', res => {
      const expert = res && res.fields && res.fields.customfield_13202 && res.fields.customfield_13202.name || '';
      if(expert != user) quickFieldEdit('customfield_13202', user);
    });
  }


  // ----------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------
  // # 主代码部分
  // ### 初始化配置页面, 并在用户头像下面绑定配置按钮
  GM_config.init(CONFIG);
  window.waitForAddedNode({
    selector: '#header #user-options-content #personal',
    immediate: true,
    recursive: true,
    done: function(el) {
      el.insertAdjacentHTML('beforeend', HTMLCONTENT.configOptionLI);
      AJS.$('#config_options').on('mouseup', () => GM_config.open());
    }});

  // ### bug页侧边栏添加记录日志按钮
  window.waitForAddedNode({
    selector: '#add-worklog-issue-right-panel-link',
    immediate: true,
    recursive: true,
    done: function(el) {
      const issuekey = window.findIssuekey();
      el.closest('tbody').insertAdjacentHTML('beforeend', HTMLCONTENT.logWorkRightPanel(issuekey));
      AJS.$('.quick-work-log-tr .quick-work-log-btn').off('mouseup');
      AJS.$('.quick-work-log-tr .quick-work-log-btn').on('mouseup', window.quickWorkLogClickHandler);
    }});

  // ### 看板页下拉框添加记录日志按钮
  window.waitForAddedNode({
    selector: '.aui-list-item-link.issueaction-comment-issue',
    recursive: true,
    done: function(el) {
      const issuekey = el.attributes["data-issuekey"].value;
      el.closest('.aui-last').insertAdjacentHTML('beforebegin', HTMLCONTENT.logWorkDropdownPanel(issuekey));
      AJS.$('.quick-work-log-ul .quick-work-log-li .quick-work-log-item').off('mouseup');
      AJS.$('.quick-work-log-ul .quick-work-log-li .quick-work-log-item').on('mouseup', window.quickWorkLogClickHandler);
    }});

  // ### 关bug弹窗添加记录日志按钮
  window.waitForAddedNode({
    selector: '[for="customfield_10528"]',
    recursive: true,
    done: function(el) {
      const issuekey = el.closest('.jira-dialog-content').querySelector('.dialog-title').textContent.match(/SLA-\d{1,10}/)[0];
      el.closest('form').querySelector('.buttons-container.form-footer').insertAdjacentHTML('afterbegin', HTMLCONTENT.logWorkDialog(issuekey));
      AJS.$('.quick-work-log-dialog-div .quick-work-log-btn').off('mouseup');
      AJS.$('.quick-work-log-dialog-div .quick-work-log-btn').on('mouseup', window.quickWorkLogClickHandler);
    }});

  // ### 记录日志弹窗添加状态内容
  window.waitForAddedNode({
    selector: 'div.field-group#wp-fg-comment',
    recursive: true,
    done: function(el) {
      if(!el.querySelector('textarea#comment').attributes['data-issuekey'].value.includes('SLA-')) return;
      el.insertAdjacentHTML('beforebegin', HTMLCONTENT.fieldGroup(HTMLCONTENT.statePanelBox() + HTMLCONTENT.obstaclePanelBox()));
      AJS.$('.log-work-status-list-item.state-item').on('mouseup', window.stateClicked);
      AJS.$('.log-work-status-list-item.obstacle-item').on('mouseup', window.obstacleClicked);
      window.translatePage();
      window.determineSubmitButton();
      window.hideUnnecessaryItem(el.querySelector('textarea#comment').attributes['data-issuekey'].value);
    }});
	
	
  // ### 记录日志弹窗添加状态内容-UPGRADE-AddBy-Albert.Lu
  window.waitForAddedNode({
    selector: 'div.field-group#wp-fg-comment',
    recursive: true,
    done: function(el) {
      if(!el.querySelector('textarea#comment').attributes['data-issuekey'].value.includes('UPGRADE-')) return;
      el.insertAdjacentHTML('beforebegin', HTMLCONTENT.fieldGroup(HTMLCONTENT.statePanelBox() + HTMLCONTENT.obstaclePanelBox()));
      AJS.$('.log-work-status-list-item.state-item').on('mouseup', window.stateClicked);
      AJS.$('.log-work-status-list-item.obstacle-item').on('mouseup', window.obstacleClicked);
      window.translatePage();
      window.determineSubmitButton();
      window.hideUnnecessaryItem(el.querySelector('textarea#comment').attributes['data-issuekey'].value);
    }});
	
	

  // ### 专家字段添加展示和快捷设置按钮
  window.waitForAddedNode({
    selector: 'div#peoplemodule div#peopledetails',
    immediate: true,
    recursive: true,
    done: function(el) {
      if(!window.findIssuekey().includes('SLA-')) return;
      if(!window.isModuleExpert()) return;
      window.getIssueFields(window.findIssuekey(), 'customfield_16601,customfield_13202', res => {
        const name = res.fields.customfield_16601 ? res.fields.customfield_16601.name : '无';
        const rname = res.fields.customfield_13202 ? res.fields.customfield_13202.name : '无';
        el.insertAdjacentHTML('beforeend', HTMLCONTENT.fieldModuleExpert(name, AJS.params.loggedInUser == name));
        el.insertAdjacentHTML('beforeend', HTMLCONTENT.fieldResponsibleModuleExpert(rname));
      });
    }})
  // ### 专家合理协助选择按钮
  window.waitForAddedNode({
    selector: 'div#customfield_19449-val',
    immediate: true,
    recursive: true,
    done: function(el) {
      if(!window.findIssuekey().includes('SLA-')) return;
      if(!window.isModuleExpert()) return;
      const MESupportTypeList = [[34755, "合理协助"], [34760, "紧急支撑"], [35751, "信息缺失"], [35752, "简单咨询"], [35753, "未按路径排查"], [35754, "未做基础排查"]]
      el.insertAdjacentHTML('afterend', HTMLCONTENT.MESupportType(MESupportTypeList));
    }})

  // ### 转专家协助预填充标识文本
  window.waitForAddedNode({
    selector: 'form#issue-workflow-transition',
    immediate: true,
    recursive: true,
    done: function(el) {
      if(!el.querySelector('input[name="action"][value="781"]')) return;
      setTimeout(function(){ el.querySelector('rich-editor')._setRawContent(`【[----专家协助信息---]】\n`) }, 1000);
    }});


  // ### 解决方案字段添加方案模板
  window.waitForAddedNode({
    selector: 'textarea#customfield_10528',
    immediate: true,
    recursive: true,
    done: function(el) {
      el.insertAdjacentHTML('afterend', HTMLCONTENT.solutionTip);
      if(el.value && el.value != '无') return;
      const issuekey = el.closest('form#issue-workflow-transition').querySelector('#comment-wiki-edit [data-issuekey]').attributes['data-issuekey'].value;
      el.value = TEXTMSG.template4InnerSolution();
    }});
  // ### 对外解决方案字段添加方案模板
  window.waitForAddedNode({
    selector: 'textarea#customfield_16005',
    immediate: true,
    recursive: true,
    done: function(el) {
      window.validateOuterSolution();
      el.placeholder = TEXTMSG.tipOnSolution4Customer;
      const innerSolution = el.closest('div.form-body').querySelector('textarea#customfield_10528').value;
      const outerSolution = window.parseSolutionContent(innerSolution)
      if(!el.value) el.value = outerSolution;
      el.insertAdjacentHTML('afterend', HTMLCONTENT.outerSolutionInvalidTip);
    }});



  // ### 公司ID添加打开客户名片按钮
  window.waitForAddedNode({
    selector: 'div#customfield_10504-val',
    immediate: true,
    recursive: true,
    done: function(el) { el.innerHTML = HTMLCONTENT.fieldCompanyInfo(el); }});
  // ### 公司名称添加crm查客户按钮
  window.waitForAddedNode({
    selector: 'div#customfield_10527-val',
    immediate: true,
    recursive: true,
    done: function(el) { el.innerHTML = HTMLCONTENT.fieldCompanyName(el); }});
  // ### 客户活动链接文本替换
  window.waitForAddedNode({
    selector: 'div#customfield_11706-val',
    immediate: true,
    recursive: true,
    done: function(el) { el.innerHTML = HTMLCONTENT.fieldCustomerAcitivities(el.querySelector('a')); }});
  // ### QQ号添加直接发起聊天按钮
  window.waitForAddedNode({
    selector: 'div#customfield_10522-val',
    immediate: true,
    recursive: true,
    done: function(el) { el.innerHTML = HTMLCONTENT.fieldChatWithQQ(el); }});
  // ### 专家是否协助添加反馈按钮
  window.waitForAddedNode({
    selector: 'div#customfield_17813-val',
    immediate: true,
    recursive: true,
    done: function(el) {
      el.innerHTML = HTMLCONTENT.ModuleExpertFeedback(el);
    }});

  // ### 文档智能推荐自动点开
  window.waitForAddedNode({
    selector: 'div#customfield_18201-val div.nfeed-field[data-field-id="customfield_18201"]',
    immediate: true,
    recursive: true,
    done: function(el) { if(el.closest('div#customfield_18201-val').innerText.includes('请点击描述以获取推荐文档')) el.click(); }});
  // ### 文档智能推荐自动点关
  window.waitForAddedNode({
    selector: 'div#customfield_18201-val div.inline-edit-fields a[name="zhinengtuijian"], div#customfield_18201-val div.inline-edit-fields span.no-value-container',
    immediate: true,
    recursive: true,
    done: function(el) { el.closest('div#customfield_18201-val').querySelector('div.save-options button.submit').click(); }});
  // ### 文档智能推荐添加埋点
  window.waitForAddedNode({
    selector: 'a[name="zhinengtuijian"]',
    immediate: true,
    recursive: true,
    done: function(el) {
      el.closest('a[name="zhinengtuijian"]') && el.closest('a[name="zhinengtuijian"]').addEventListener('mouseup', window.zhinengtuijianclicked);
      el.querySelectorAll('a[name="zhinengtuijian"]').forEach(a => a.addEventListener('mouseup', window.zhinengtuijianclicked));
    }});
  // ### FR专家推荐自动点开
  window.waitForAddedNode({
    selector: 'div#customfield_18406-val span.aui-iconfont-edit',
    immediate: true,
    recursive: true,
    done: function(el) { if(el.closest('div#customfield_18406-val').innerText.includes('该问题有专家的解决思路参考,请点我获取~')) el.click(); }});
  // ### FR专家推荐自动点关
  window.waitForAddedNode({
    selector: 'div#customfield_18406-val div.inline-edit-fields .read-only-component ',
    immediate: true,
    recursive: true,
    done: function(el) { el.closest('div#customfield_18406-val').querySelector('div.save-options button.submit').click(); }});
  // ### 添加敏感词反馈按钮
  window.waitForAddedNode({
    selector: '#opsbar-jira\\.issue\\.tools',
    immediate: true,
    recursive: true,
    done: function(el) { el.insertAdjacentHTML('beforeend', HTMLCONTENT.reportSensitiveWordsButton); }});
  // ### 修改确诊参考项样式
  window.waitForAddedNode({
    selector: 'label[for^="customfield_18405"]',
    immediate: true,
    recursive: true,
    done: function(el) { el.setAttribute('v', el.innerText); }});

  // ### 添加诊断书快捷按钮
  window.waitForAddedNode({
    selector: '#opsbar-jira\\.issue\\.tools',
    immediate: true,
    recursive: true,
    done: function(el) { el.insertAdjacentHTML('beforeend', HTMLCONTENT.diagnoseReportButton(window.findIssuekey())); }});

  // ### 添加风险评估书快捷按钮
  window.waitForAddedNode({
    selector: '#opsbar-jira\\.issue\\.tools',
    immediate: true,
    recursive: true,
    done: function(el) {
      window.getIssueFields(window.findIssuekey(), 'customfield_10523', res => {
        const mobile = res && res.fields && res.fields.customfield_10523 || '';
        el.insertAdjacentHTML('beforeend', HTMLCONTENT.custRiskEvaluateButton(mobile));
      });
    }});

  // ### 添加NLP快捷按钮
  window.waitForAddedNode({
    selector: '#opsbar-jira\\.issue\\.tools',
    immediate: true,
    recursive: true,
    done: function(el) {
      if(AJS.params.loggedInUser !== 'LeoYuan') return;
      el.insertAdjacentHTML('beforeend', HTMLCONTENT.custNLPButton());
    }});

  // ### 出现textarea的时候恢复最后值并绑定自动保存
  window.waitForAddedNode({
    selector: 'textarea',
    immediate: true,
    recursive: true,
    done: function(el) {
      //      window.restoreSavedValue(el);
      window.autoSave(el);
    }});
  // ### 清理很久之前的的自动暂存的内容
  window.cleanEarlySavedValue();
  window.et.__installedNotify();
  window.translatePage();

  // ### 页面注入css样式
  window.addCss ( `
/* ### 快捷日志log work部分 */
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

tr.quick-work-log-subtitle-tr td {
    padding-bottom: 0;
}

tr.quick-work-log-subtitle-tr h6 {
    text-align: left;
}

div.quick-work-log-btn {
    font-size: 14px;
    border-radius: 3px;
    cursor: pointer;
    background-image: none;
    background-color: rgba(9,30,66,.08);
    border: 1px solid transparent;
    color: #344563;
    text-decoration: none;
    display: inline-block;
    padding: 4px 10px;
    margin: 5px;
    white-space: nowrap;
}

div.quick-work-log-btn:hover {
    background-color: rgba(9,30,66,.2)
}

a.aui-list-item-link.quick-work-log-item {
    color: #172b4d;
}

a.aui-list-item-link.quick-work-log-item:hover {
    color: #42526e;
    background-color: #007fde;
}



/* ### 日志状态记录部分 */
div#wp-fg-estimates.field-group.wp-remaining-estimate-group label {
    display: block !important;
}

div.log-work-status-pick-box {
    border: 2px solid #dfe1e6;
    border-radius: 3px;
}

div.log-work-status-panel {
    vertical-align: top;
}

div.state-panel {
    width: 200px;
    float: left;
}

div.obstacle-panel {
    width: 100%;
    flex-wrap: wrap;
}

div.list-header {
    text-align: center;
    padding: 5px 0;
    font-weight: bold;
    overflow-y: scroll;
    border-bottom: 2px solid lightgrey;
    pointer-events: none;
    user-select: none;
}

div.log-work-status-list.obstacle-ul {
  padding-left: 5px;
}

div.log-work-status-list-scroll {
    overflow-y: scroll;
    height: 160px;
}

div.log-work-status-pick-box:hover div.log-work-status-list-scroll {
    height: 160px !important;
}

div.log-work-status-list {
    padding: 0;
    list-style-type: none;
}

div.log-work-status-list-item {
    padding: 2px 3px;
}

div.log-work-status-list-item.state-item:nth-child(even) {
    background: #f0f0ff;
}

div.log-work-status-list-item.state-item.active,
div.log-work-status-list-item.obstacle-item.active {
    background: #007fde;
    color: white;
}

div.log-work-status-list-item.state-item:hover,
div.log-work-status-list-item.obstacle-item:hover {
    background: #007fde;
    color: white;
    font-weight: bold;
    cursor: pointer;
}

div.obstacle-panel div.log-work-status-list-item {
    display: inline-block;
    white-space: nowrap;
    border: 1px solid lightgrey;
    border-radius: 5px;
    padding: 1px;
    margin: 2px;
}

div.obstacle-panel div.log-work-status-list-item span {
    white-space: normal;
    word-wrap: break-word;
}

div.state-panel div.log-work-status-list-item.spacer-item {
    height: 1px;
}
div.state-panel div.log-work-status-list-item.spacer-item:nth-child(odd) {
    border-bottom: 2px dashed lightgrey;
}

div.obstacle-panel div.log-work-status-list-item.spacer-item {
    border: 0;
    width: 10px;
}

div#wp-fg-status div {
    scrollbar-width: thin;
    scrollbar-color: darkblue lightgrey;
}

div#wp-fg-status div::-webkit-scrollbar {
    width: 10px;
}

div#wp-fg-status div::-webkit-scrollbar-track {
    background: lightgrey;
}

div#wp-fg-status div::-webkit-scrollbar-thumb {
    background-color: darkblue;
    border-radius: 20px;
    border: 3px solid lightgrey;
}

span.list-header-tip {
    font-size: x-small;
}

input#worklogpro-log-work-submit[disabled] {
    color: red;
    font-weight: bold;
}


div#outerSolutionInvalidTip.description {
    font-size: 16px;
    font-weight: bold;
    color: red;
    background: lightyellow;
}

div div#outerSolutionInvalidTip.description {
    display: none;
}

div[invalid] div#outerSolutionInvalidTip.description {
    display: block;
}


a.added-field-button {
    box-sizing: border-box;
    border-radius: 3.01px;
    cursor: pointer;
    font-size: 12px;
    background-color: lightgray;
    border: 1px solid transparent;
    color: green;
    display: inline;
    margin: 0px 10px;
    padding: 2px 4px;
    white-space: nowrap;
}

a#reportSensitiveWords,
a#diagnoseReport,
a#custRiskEvaluate {
    background: green;
    color: lightyellow;
}

label[for^="customfield_18405"][v^="报错库-"] {
    color: darkblue !important;
}
label[for^="customfield_18405"][v^="智能推荐-"] {
    color: darkred !important;
}
label[for^="customfield_18405"] {
    color: darkgreen !important;
}


/* ### 自动暂存的提示 */
div.auto-saved-tip {
    color: grey;
    font-size: 9pt;
    background: lightblue;
    display: table-row;
}


/* ### 以下内容是对原有样式的美化 */
div#wp-fg-comment textarea#comment {
    max-width: 655px;
    height: 8rem;
}

div#WorklogByUserPanel a#add-worklog-issue-right-panel-link {
    background: lightblue;
    border-radius: 8px;
    padding: 12px 24px;
    margin-left: 23px;
    display: inline-block;
}
div#WorklogByUserPanel a#add-worklog-issue-right-panel-link:hover {
    background: lightsteelblue;
}

/* 其他 */
.jira-dialog-content .form-body::-webkit-scrollbar { width: 10px; }
.jira-dialog-content .form-body::-webkit-scrollbar-track { background: lightgrey; }
.jira-dialog-content .form-body::-webkit-scrollbar-thumb { background-color: darkblue; border-radius: 20px; border: 3px solid lightgrey; }


/*配置界面*/
#JIRA_USERSCRIPT_OPTIONS {
  width: 600px !important;
  height: unset !important;
  inset: 100px 100px auto auto !important;
  padding: 20px !important;
  box-shadow: 5px 5px 20px black !important;
 }
#JIRA_USERSCRIPT_OPTIONS_wrapper {}

#JIRA_USERSCRIPT_OPTIONS .field_label{
  position: unset !important;
}

.mesupporttype-button-list {display: inline;}
.mesupporttype-button-list > .added-field-button { margin: 0 5px;}


` );


})();