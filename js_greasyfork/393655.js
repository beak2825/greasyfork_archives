// ==UserScript==
// @name         _简道云小助手
// @namespace    https://greasyfork.org/en/scripts/393655
// @version      2.4.0
// @description  全新简道云技术支持录问题题小助手, 支持基于React的简道云, 提供一些小功能
// @author       LeoYuan
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @match        https://www.jiandaoyun.com/dashboard
// @include      /^https?://www\.jiandaoyun\.com/dashboard/.*
// @grant        none
// @icon         https://assets.jiandaoyun.com/v2270/resources/images/jdy_icon.png
// @note         脚本地址：https://greasyfork.org/en/scripts/393655
// @downloadURL https://update.greasyfork.org/scripts/393655/_%E7%AE%80%E9%81%93%E4%BA%91%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/393655/_%E7%AE%80%E9%81%93%E4%BA%91%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/* changelog:
- 支持专人一线问题录入页面;
*/

(function() {
  'use strict';


  // ----------------------------------------------------------------------------------------------------
  // # 一些变量
  // ### 自定义按钮, 可以按照格式自定义
  const ACTIONS = [
    { name: '需求未参考', enable: 1, shortname: '需求未', class: 'style-normal', icon: 'icon-workbench', label: 'fr需求方案类问题', question: '', solution: '', status: '已解决', reference: '未参考且无需文档' },
    { name: '异常未参考', enable: 1, shortname: '异常未', class: 'style-normal', icon: 'icon-warning-circle', label: 'fr报错异常类问题', question: '', solution: '', status: '已解决', reference: '未参考且无需文档' },
    { name: '需求参考', enable: 1, shortname: '需求参', class: 'style-primary', icon: 'icon-workbench', label: 'fr需求方案类问题', question: '', solution: '', status: '已解决', reference: '文档协助' },
    { name: '异常参考', enable: 1, shortname: '异常参', class: 'style-primary', icon: 'icon-warning-circle', label: 'fr需求方案类问题', question: '', solution: '', status: '已解决', reference: '文档协助' },
    { name: '授权', enable: 1, shortname: '授权', class: 'style-negative', icon: 'icon-business-licence', label: '授权申请', question: '申请临时授权', solution: '销售同意已发', status: '', reference: '' },    { name: '', enable: 1, shortname: '未', class: 'style-danger', icon: 'icon-close-circle', label: '', question: '', solution: '', status: '', reference: '' },
    { name: '过期', enable: 1, shortname: '过期', class: 'style-negative', icon: 'icon-out-link', label: '过期无效客户问题', question: '', solution: '', status: '未解决', reference: '' },
    { name: '需求待补充', enable: 1, shortname: '需求补', class: 'style-danger', icon: 'icon-workbench', label: '', question: 'fr需求方案类问题', solution: '', status: '已解决', reference: '需补充/优化文档' },
    { name: '异常待补充', enable: 1, shortname: '异常补', class: 'style-danger', icon: 'icon-warning-circle', label: 'fr报错异常类问题', question: '', solution: '', status: '已解决', reference: '需补充/优化文档' },
  ];
  const ACTIONS2 = [
    { name: '2fr需求方案类', enable: 1, shortname: '需求方案类', class: 'style-normal',label: 'fr需求方案类问题', error:'', question: '', solution: '', status: '已解决'},
    { name: '2fr报错类已参考', enable: 1, shortname: '参考解决', class: 'style-primary', label: 'fr异常报错类问题', error:'报错类 参考解决', question: '', solution: '', status: '已解决'},
    { name: '2fr报错类无需参考', enable: 1, shortname: '无需参考', class: 'style-primary',label: 'fr异常报错类问题', error:'报错类 无需参考/不是报错', question: '', solution: '', status: '已解决'},
    { name: '2fr报错类需补充', enable: 1, shortname: '待补充', class: 'style-primary',label: 'fr异常报错类问题', error:'报错类 库待补充', question: '', solution: '', status: '已解决'},
    { name: '2fr报错类个人认领', enable: 1, shortname: '个人认领', class: 'style-primary',label: 'fr异常报错类问题', error:'个人认领', question: '', solution: '', status: '已解决'},
    { name: '2过期客户', enable: 1, shortname: '过期', class: 'style-normal', label: '过期无效客户问题记录', error:'', question: '', solution: '', status: '未解决'},
    { name: '2授权申请', enable: 1, shortname: '授权', class: 'style-normal',label: '授权申请', error:'', question: '申请临时授权', solution: '销售同意已发', status: '已解决'},
  ];
  // ### 一些预定义的html内容
  const HTMLCONTENT = {
    pasteQQButton: '<button class="x-button style-primary size-normal x-qq-button" onclick=pasteQQorPhoneNumber(true)><i class="x-icon iconfont-fx-pc icon-qq"></i><span>粘贴QQ</span><font class="x-shortcut">q</font></button>',
    quickButtonsRow: '<div class="x-button-row"></div>',
    quickButton: (action, index) => {return `<button class="x-button x-quick-button ${action.class}" title="${action.name}" onclick=appendRecord("${action.name}")><i class="x-icon iconfont-fx-pc ${action.icon}"></i><span>${action.shortname}</span><font class="x-shortcut">${index+1}</font></button>`; },
    shortcutTip: letter => `<font class="x-shortcut">${letter}</font>`
      };
  // ### 高亮色
  const HIGHTLIGHTCOLOR = {
    mouseenter: 'lightblue',
    mouseleave: '',
  };
  // ### 可以自定义的一些消息内容
  const MSG = {
    feedbackPrefix: '您好，这边对您之前咨询的问题做个回访，如果存在咨询过但是没有得到解决且没有同事在跟进的问题麻烦如实在链接里填写一下，谢谢您~\n'
  }
  // ### 复制内容自动处理的删除规则
  const DELETERULES = [
    // 删除空行
    /^\s*$/,
    // 删除企点的用户名行
    /^.*  [0-2][0-9]:[0-6][0-9]:[0-6][0-9]$/,
    /^.* \d{4}\/\d?\d\/\d?\d [0-2][0-9]:[0-6][0-9]:[0-6][0-9]$/,
    /^[自动回复].*$/,
    // 删除企业微信的用户名行
    /^.*-.* \d?\d-\d?\d [0-2][0-9]:[0-6][0-9]:[0-6][0-9]$/,
  ];
  // ### 表单字段ID, 勿轻易修改
  const FIELDID = {
    '客户qq': '_widget_1584336630853',
    '备注': '_widget_1586235470408',
    'qq/手机对应的公司名称': '_widget_1624633552416',
    '云端运维': '_widget_1584336630980',
    '是否项目运维客户': '_widget_1602655598339',
    '客户是否愿意提供': '_widget_1591921993497',
    '本次沟通云端运维耗时': '_widget_1591921993567',
    '无法提供的原因': '_widget_1591921993592',
    '流水号': '_widget_1584512771774',
    '一线问题记录': '_widget_1584335876535',
    '标签': '_widget_1584335876655',
    '报错检索': '_widget_1584339612229',
    '问题情况': '_widget_1584335876599',
    '解决方案': '_widget_1586501239817',
    '解决状态': '_widget_1584335876631',
    '文档': '_widget_1584339612229',
    '主键数据': '_widget_1589939826592',
    '输入联系人qq/手机进行查询': '_widget_1623206800287',
    '回访客户qq': '_widget_1584338243457',
    selector: name => {return Object.keys(FIELDID).includes(name) ? `[data-widgetname="${FIELDID[name]}"]` : ''}
  };
  // ### 简道云app或表单ID, 勿轻易修改, 获取可通过post该接口 _/app/59f96c4ae1ddba302aaa624a
  const FORMID = {
    '技术支持-carlos' : '59f96c4ae1ddba302aaa624a',
    '新一线问题录入' : '621c32eb5e44ee0007ca5828',
    '客户需求-新': '60c02b8ec142e30008145153',
    '回访调研表': '5e6f15334d21be00063865df',
    '新一线问题录入_NEO': '61396fc76baa9b0008de34ad',
    '专人一线问题录入': '654207dac1032171654f97e8',
  };
  window.loadInterceptions = [];

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
    this.addEventListener('loadend', e => {
      window.loadInterceptions.filter(i => typeof(i.match) == 'function' && typeof(i.handler) == 'function').forEach((intercept) => {
        if(intercept.match(e)) intercept.handler(e);
      });
      //console.log('intercepted', e);
    }, { once: true });
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
  // ### 根据DOM查找React对象
  window.FindReact = function(dom, nonrecursive) {
    if(!dom) return null;
    const key = Object.keys(dom).find(key => key.startsWith("__reactInternalInstance$"));
    const internalInstance = dom[key];
    if (internalInstance == null) return null;
    const root = internalInstance.memoizedProps;
    if(nonrecursive) return root;
    let iterate = root;
    while (!iterate.value && iterate.children) { iterate = iterate.children.length ? iterate.children[0].props : iterate.children.props; }
    return iterate.value || null;
  }
  // ### 根据简道云的表单对象和组件id获取指定组件的react对象
  window.getFormField = function(dom, widgetId) {
    dom = typeof(dom) === 'string' ? document.querySelector(dom) : dom;
    const form = window.FindReact(dom);
    const fields = form.fieldMap;
    const fieldKeys = Object.keys(fields);
    const pattern = new RegExp(widgetId + '$')
    const result = fieldKeys.filter(key => key.match(pattern)).map(key => fields[key]);
    return result.length > 0 ? result.length > 1 ? result : result[0] : null;
  }
  // ### 处理粘贴内容中的无效文本
  window.parsePasteContent = function(text) {
    const lines = text.split(/[\r\n]/);
    const validLines = lines.filter(line => {
      return DELETERULES.filter(rule => {
        return line.match(rule);
      }).length < 1;
    });
    return validLines.join('，');
  }
  // ### 模拟点击按钮
  window.simulateClickButton = function(element) {
    if(!element) return;
    const button = element.tagName == 'BUTTON' ? element : element.parentNode.tagName == 'BUTTON' ? element.parentNode : element.parentNode.parentNode.tagName == 'BUTTON' ? element.parentNode.parentNode : null;
    if(!button) return;
    button.classList.add('is-active');
    button.click();
    setTimeout(function(){button.classList.remove('is-active');}, 250);
  }

  // -------------------------------------------------
  // ## 一些适用于录一线页面的方法
  // ### 获取子表单的最后一行
  window.getLastRowDOM = function () {
    return document.querySelector(FIELDID.selector('一线问题记录')).querySelector('.fx-subform-row:last-child')
  }
  // ### 在子表单录入指定name对应的数据
  window.appendRecord = function(name) {
    window.addNewRecordIfNeed();
    const lastRow = window.getLastRowDOM();
    const action = ACTIONS.concat(ACTIONS2).filter(act => act.name == name)[0] || {};
    window.setFieldValue(window.FindReact(lastRow.querySelector(FIELDID.selector('标签'))), action.label);
    setTimeout(function(){ window.setFieldValue(window.FindReact(lastRow.querySelector(FIELDID.selector('报错检索'))), action.error); });
    window.setFieldValue(window.FindReact(lastRow.querySelector(FIELDID.selector('问题情况'))), action.question);
    window.setFieldValue(window.FindReact(lastRow.querySelector(FIELDID.selector('解决方案'))), action.solution);
    window.setFieldValue(window.FindReact(lastRow.querySelector(FIELDID.selector('解决状态'))), action.status);
    window.setFieldValue(window.FindReact(lastRow.querySelector(FIELDID.selector('文档'))), action.reference);
    window.FindReact(window.getLastRowDOM().querySelector(FIELDID.selector('问题情况'))).ref.current.querySelector('input').focus();
  }
  // ### 给子表单指定栏插入指定值, 会判断是否为空
  window.setFieldValue = function(obj, val) {
    if(!obj || !val) return;
    obj.setValue(val || '');
    obj.fireLink();
  }
  // ### 给子表单新增行, 会判断当前最后一行是否为空
  window.addNewRecordIfNeed = function(fields) {
    const targets = typeof(fields)==='undefined' ? ['问题情况', '解决方案'] : fields;
    const lastRow = window.getLastRowDOM();
    if(!lastRow) return window.simulateClickButton(document.querySelector(FIELDID.selector('一线问题记录')).querySelector('button.btn-add'));
    const isNotEmpty = targets.map(target => window.FindReact(lastRow.querySelector(FIELDID.selector(target))).linkValue.length).reduce((a, b) => a + b, 0);
    if (isNotEmpty > 0) return window.simulateClickButton(document.querySelector(FIELDID.selector('一线问题记录')).querySelector('button.btn-add'));
  }
  // ### 粘贴QQ号或手机号
  window.pasteQQorPhoneNumber = function(force) {
    navigator.clipboard.readText().then(text => {
      if (!force && !text.match(/^[\d\s]+$/)) return;
      const widgetQQ = window.getFormField('.fx-form', FIELDID['客户qq']) || window.getFormField('.fx-form', FIELDID['回访客户qq']) || window.getFormField('.fx-form', FIELDID['输入联系人qq/手机进行查询']);
      window.setFieldValue(widgetQQ, text.trim());
    });
  }
  // ### 高亮匹配剪贴板中qq的记录
  window.mouseOverHightHandler = function(zEvent) {
    [...document.querySelectorAll('td')].forEach(el => el.style.background = '');
    navigator.clipboard.readText().then(text => {
      if (!text.match(/^[\d\s]+$/)) return;
      const qq = text.trim();
      const tds = [...document.querySelectorAll(`td[title="${qq}"]`)];
      const rowIds = tds.map(td => td.parentNode.attributes["data-row-id"].value);
      rowIds.forEach(id => {
        [...document.querySelectorAll(`tr[data-row-id="${id}"] td`)].forEach(el => el.style.background = HIGHTLIGHTCOLOR[zEvent.type] || '');
      });
    });
  }
  // ### 拷贝回访调研表链接
  window.copyFeedbackURL = function(id){
    const shareFormID = '' + FORMID['回访调研表'].slice(0,-8) + (parseInt(FORMID['回访调研表'].slice(-8),16)+1).toString(16).padStart(8,0);
    const url = `https://www.jiandaoyun.com/l/${shareFormID}/d/${id}`;
    navigator.clipboard.writeText(MSG.feedbackPrefix + url);
    var notyf = new Notyf({position: {x: 'right', y: 'top'}});
    notyf.success('回访链接已复制到剪贴板');
  }

  // ### 处理快捷键事件
  window.shortcutsHandler = function(zEvent) {
    // Alt+回车 直接提交
    if (zEvent.altKey && zEvent.key === 'Enter') {
      window.simulateClickButton([...document.querySelectorAll('button.op-forward')].pop());
    }
    // Alt+i 点击添加/新建按钮
    else if (zEvent.altKey && 'iI'.includes(zEvent.key)) {
      window.simulateClickButton([...document.querySelectorAll('i.icon-plus')].pop());
    }

    // Alt+q 点击粘贴qq按钮
    else if (zEvent.altKey && 'qQ'.includes(zEvent.key)) {
      window.pasteQQorPhoneNumber(true);
      window.simulateClickButton([...document.querySelectorAll('button.x-qq-button')].pop());
    }
    // Alt+a或Alt+w 粘贴客户问题情况
    else if (zEvent.altKey && 'aAwW'.includes(zEvent.key)) {
      window.addNewRecordIfNeed(['问题情况']);
      navigator.clipboard.readText().then(text => {
        window.FindReact(window.getLastRowDOM().querySelector(FIELDID.selector('问题情况'))).setValue(window.parsePasteContent(text));
        window.FindReact(window.getLastRowDOM().querySelector(FIELDID.selector('解决方案'))).ref.current.querySelector('input').focus();
      });
    }
    // Alt+z或Alt+j 粘贴解决方案
    else if (zEvent.altKey && 'zZjJ'.includes(zEvent.key)) {
      window.addNewRecordIfNeed(['解决方案']);
      navigator.clipboard.readText().then(text => {
        window.FindReact(window.getLastRowDOM().querySelector(FIELDID.selector('解决方案'))).setValue(window.parsePasteContent(text));
        window.FindReact(window.getLastRowDOM().querySelector(FIELDID.selector('问题情况'))).ref.current.querySelector('input').focus();
      });
    }
    // Alt+x 切换问题状态
    else if (zEvent.altKey && 'xX'.includes(zEvent.key)) {
      const targetWidget = window.FindReact(window.getLastRowDOM().querySelector(FIELDID.selector('解决状态')));
      targetWidget.setValue(targetWidget.linkValue == '未解决' ? '已解决' : '未解决');
    }
    // Alt+y 切换云端运状态
    else if (zEvent.altKey && 'yY'.includes(zEvent.key)) {
      const targetWidget = window.FindReact(document.querySelector(FIELDID.selector('云端运维')));
      targetWidget.setValue(targetWidget.linkValue == '否' ? '是' : '否');
      targetWidget.fireLink()
    }
    // Alt+m 切换项目运维状态
    else if (zEvent.altKey && 'mM'.includes(zEvent.key)) {
      const targetWidget = window.FindReact(document.querySelector(FIELDID.selector('是否项目运维客户')));
      targetWidget.setValue(targetWidget.linkValue == '否' ? '是' : '否');
      targetWidget.fireLink()
    }

    // Alt+s 点击分享按钮
    else if (zEvent.altKey && 'sS'.includes(zEvent.key)) {
      window.simulateClickButton([...document.querySelectorAll('i.icon-share')].pop());
    }
    // Alt+p 点击打印按钮
    else if (zEvent.altKey && 'pP'.includes(zEvent.key)) {
      window.simulateClickButton([...document.querySelectorAll('i.icon-print')].pop());
    }
    // Alt+e 点击编辑按钮
    else if (zEvent.altKey && 'eE'.includes(zEvent.key)) {
      window.simulateClickButton([...document.querySelectorAll('i.icon-edit')].pop());
    }
    // Alt+d 点击删除按钮
    else if (zEvent.altKey && 'dD'.includes(zEvent.key)) {
      window.simulateClickButton([...document.querySelectorAll('i.icon-trash')].pop());
    }
    // Alt+数字 点击快捷按钮
    else if (zEvent.altKey && '1234567890'.includes(zEvent.key)) {
      window.simulateClickButton(document.querySelectorAll('button.x-quick-button')[zEvent.key]);
    }
  }
  // ### 自定义js样式
  const customCss =`
  .x-qq-button {
    margin: 20px 120px;
  }
  .x-button-row {
    font-size: 8px
    display: flex;
    padding: 10px;
  }
  .x-quick-button {
    border-color: grey;
    padding: 5px;
\  }
  .x-quick-button .x-icon {
    font-size: 16px;
  }
  .x-shortcut {
    color: blue;
    font-size: 8px;
    margin: 0px 1px;
  }
    `;


  // ----------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------
  // # 主代码部分
  // ### 因为简道云react化, 没法直接调用内置toast方法了, 于是从外部引了个toast库用来显示消息.
  var toastjs = document.createElement("script");
  toastjs.src = "https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js";
  document.getElementsByTagName("head")[0].appendChild(toastjs);
  var toastcss = document.createElement("link");
  toastcss.rel  = 'stylesheet';
  toastcss.type = 'text/css';
  toastcss.href = "https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css";
  document.getElementsByTagName("head")[0].appendChild(toastcss);

  // ### 监听页面, 加载表单的时候执行
  window.waitForAddedNode({
    selector: 'div.fx-form.form-modal',
    recursive: false,
    done: function(el) {
      el.querySelector('button.op-forward').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('↵'));
      if(window.FindReact(document.querySelector('.fx-form')).formId != FORMID['新一线问题录入']) return;
      //console.log(el);
    }
  });
  // ### 监听页面, 出现"客户qq"组件的时候执行, 添加粘贴qq按钮, 并触发首次粘贴, 并添加快捷键提示
  window.waitForAddedNode({
    selector: FIELDID.selector('客户qq'),
    recursive: false,
    done: function(el) {
      window.getFormField('.fx-form', FIELDID['客户qq']).ref.current.insertAdjacentHTML('beforeend', HTMLCONTENT.pasteQQButton);
      window.pasteQQorPhoneNumber();
      el.querySelector('div.field-label').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('q'));
    }
  });
  // ### 监听页面, 出现"云端运维"组件的时候执行, 添加快捷键提示
  window.waitForAddedNode({
    selector: FIELDID.selector('云端运维'),
    urlmatcher: FORMID['新一线问题录入'],
    recursive: false,
    done: function(el) {
      el.querySelector('div.field-label').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('y'));
    }
  });
  // ### 监听页面, 出现"项目运维"组件的时候执行, 添加快捷键提示
  window.waitForAddedNode({
    selector: FIELDID.selector('是否项目运维客户'),
    urlmatcher: FORMID['新一线问题录入'],
    recursive: false,
    done: function(el) {
      el.querySelector('div.field-label').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('m'));
    }
  });
  // ### 监听新一线问题录入页面, 出现"一线问题记录"子表单的时候, 添加快捷按钮
  window.waitForAddedNode({
    selector: FIELDID.selector('一线问题记录'),
    urlmatcher: FORMID['新一线问题录入'],
    recursive: false,
    done: function(el) {
      el.querySelector('.field-label').insertAdjacentHTML('afterend', HTMLCONTENT.quickButtonsRow);
      el.querySelector('div.x-button-row').insertAdjacentHTML('beforeend', ACTIONS.filter(a => a.name).filter(a => a.enable).map(HTMLCONTENT.quickButton).join(''))
      el.querySelector('button.btn-add').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('i'));
      //      el.querySelector('div[title="标签"]').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('t'));
      //      el.querySelector('div[title="报错检索"]').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('e'));
      el.querySelector('div[title="问题情况"]').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('w'));
      el.querySelector('div[title="解决方案"]').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('z'));
      el.querySelector('div[title="解决状态"]').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('x'));
    }
  });
  // ### 监听新一线问题录入_NEO页面, 出现"一线问题记录"子表单的时候, 添加快捷按钮
  window.waitForAddedNode({
    selector: FIELDID.selector('一线问题记录'),
    urlmatcher: FORMID['新一线问题录入_NEO'],
    recursive: false,
    done: function(el) {
      el.querySelector('.field-label').insertAdjacentHTML('afterend', HTMLCONTENT.quickButtonsRow);
      el.querySelector('div.x-button-row').insertAdjacentHTML('beforeend', ACTIONS2.filter(a => a.name).filter(a => a.enable).map(HTMLCONTENT.quickButton).join(''))
      el.querySelector('button.btn-add').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('i'));
      el.querySelector('div[title="问题情况"]').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('w'));
      el.querySelector('div[title="解决方案"]').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('z'));
      el.querySelector('div[title="解决状态"]').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('x'));
    }
  });
  // ### 监听页面, 出现"输入联系人qq/手机进行查询"组件的时候执行, 添加粘贴qq按钮, 并触发首次粘贴, 并添加快捷键提示
  window.waitForAddedNode({
    selector: FIELDID.selector('输入联系人qq/手机进行查询'),
    urlmatcher: FORMID['客户需求-新'],
    recursive: false,
    done: function(el) {
      //window.getFormField('.fx-form', FIELDID['输入联系人qq/手机进行查询']).ref.current.insertAdjacentHTML('beforeend', HTMLCONTENT.pasteQQButton);
      el.addEventListener('click', function(){window.pasteQQorPhoneNumber(true)});
      window.pasteQQorPhoneNumber();
      el.querySelector('div.field-label').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('q'));
    }
  });
  // ### 监听页面, 出现"回访客户qq"组件的时候执行, 添加粘贴qq按钮, 并触发首次粘贴, 并添加快捷键提示
  window.waitForAddedNode({
    selector: FIELDID.selector('回访客户qq'),
    urlmatcher: FORMID['回访调研表'],
    recursive: false,
    done: function(el) {
      //window.getFormField('.fx-form', FIELDID['输入联系人qq/手机进行查询']).ref.current.insertAdjacentHTML('beforeend', HTMLCONTENT.pasteQQButton);
      el.addEventListener('click', function(){window.pasteQQorPhoneNumber(true)});
      window.pasteQQorPhoneNumber();
      el.querySelector('div.field-label').insertAdjacentHTML('beforeend', HTMLCONTENT.shortcutTip('q'));
    }
  });

  // ### 监听请求, 用来复制回访调研链接
  window.loadInterceptions.push({
    match: function(e){ return e.target.responseURL.includes('_/data/create');},
    handler: function(e) {
      const response = JSON.parse(e.target.response);
      if(!(response.data)) return;
      if(response.data.entryId == FORMID['回访调研表']) return copyFeedbackURL(response.data._id);
    }
  });

  // ### 添加快捷键操作
  document.addEventListener ("keydown", window.shortcutsHandler);
  // ### 添加鼠标悬浮事件, 用来高亮记录
  document.addEventListener("mouseenter", window.mouseOverHightHandler);
  document.addEventListener("mouseleave", window.mouseOverHightHandler);
  // ### 往页面注入自定义js
  window.addCss(customCss);

  // ----------------------------------------------------------------------------------------------------

})();