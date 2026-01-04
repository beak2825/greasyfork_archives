// ==UserScript==
// @name        易搭云交互优化
// @namespace   交互优化，让工作更高效！
// @version     1.14.0
// @match       https://web.yidayun.com/*
// @icon        https://www.yidayun.com/images/favicon.png
// @grant       none
// @author       Jack.Chan (971546@qq.com)
// @namespace    http://fulicat.com
// @url          https://greasyfork.org/zh-CN/scripts/477594
// @license MIT
// @description 2023/10/18 22:31:24
// @downloadURL https://update.greasyfork.org/scripts/477594/%E6%98%93%E6%90%AD%E4%BA%91%E4%BA%A4%E4%BA%92%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/477594/%E6%98%93%E6%90%AD%E4%BA%91%E4%BA%A4%E4%BA%92%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function(){

  function $fetch(url, data, options) {
    options = { method: 'POST', mode: 'cors', credentials: 'omit', ...options };
    options.headers = { 'content-type': 'application/json', ...options.headers };
    options.headers['Accept'] = 'application/json, text/plain, */*';
    options.headers['X-Session'] = document.cookie;

    if (data) {
      if (options.method.toUpperCase() === 'GET' || options.method.toUpperCase() === 'HEAD') {
        url+= (url.indexOf('?') > -1 ? '&' : '?') + (new URLSearchParams(data)).toString();
      } else {
        options.body = typeof data === 'object' ? JSON.stringify(data) : data;
      }
    }

    return new Promise((resolve, reject) => {
      fetch(url, options).then((res) => res.json()).then((res) => {
        if (res.errorCode === 0 && res.success) {
          resolve(res);
        } else {
          console.error('[ERR]', url, options, res);
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }

  function doCopy(text) {
    return new Promise((resolve, reject) => {
      if (!text) {
        return resolve('');
      }
      var $text = document.createElement('textarea');
      $text.setAttribute('readonly', 'readonly');
      $text.style.cssText = 'width: 10px;height: 10px;position: fixed;top:-999px;left:-999px;';
      $text.value = text;
      document.body.appendChild($text);
      $text.select();
      setTimeout(() => {
        if (document.execCommand('copy')) {
          resolve(text);
        } else {
          reject(text);
        }
      }, 250);
    });
  }

  function WorkingHours(options) {
        var defaultOptions = {
            interval: 0,
            selector: undefined,
            prefix: undefined,
            before() {},
            after() {}
        }
        options = Object.assign({}, defaultOptions, options);

        var base = new Date();
        base.setHours(9);
        base.setMinutes(0);
        base.setSeconds(0);
        base.setMilliseconds(0);

        var getNow = () => {
          return new Date();
          // return new Date('2023/10/19 13:10:12');
          // return new Date('2023/10/19 12:30:12');
        }

        var current = new Date();
        if (base.getHours() - current.getHours() > 2) {
            base.setDate(base.getDate()-1);
        }

        var calc = function() {
            if (typeof options.before === 'function') {
              options.before.apply(this, [options]);
            }
            var now = getNow();
            var start = new Date(base.getTime());
            // reset start time
            start.setMinutes(0);
            start.setSeconds(0);
            start.setMilliseconds(0);

            // 9点 上班
            if (options.start == '9:00') {
              start.setMinutes(0);
            }

            // 9点30分 上班
            if (options.start == '9:30') {
              start.setMinutes(30);
            }

            // 午餐时间 不计时
            if (now.getHours() == 12) {
              now.setHours(12);
              now.setMinutes(0);
              now.setSeconds(0);
              now.setMilliseconds(0);
            }

            // 13点开始上班，减去 午餐时间 1小时
            if (now.getHours() > 12) {
              now.setMinutes(now.getMinutes() - 60);
            }

            var diffText = [];
            if (start < now) {
                var diff = now.getTime() - start.getTime();
                var days = Math.floor(diff / (24 * 3600 * 1000));

                diff = diff % (24 * 3600 * 1000);
                var hours = Math.floor(diff / (3600 * 1000));

                diff = diff % (3600 * 1000);
                var minutes = Math.floor(diff / (60 * 1000));

                // 秒数
                diff = diff % (60*1000);
                var seconds = Math.round(diff / 1000);

                diffText.push(hours +'小时');
                diffText.push(minutes +'分钟');
                diffText.push(seconds +'秒');
                diffText = `${ (options.prefix || '') }${ diffText.join(' ') }`;
            } else {
                diffText = '上班时间：'+ start.toLocaleTimeString();
            }
            if (options.selector) {
                var $el = document.querySelector(options.selector);
                if ($el) {
                    $el.innerText = diffText;
                }
            }
            if (typeof options.after === 'function') {
              options.after.apply(this, [options]);
            }
        }

        calc();
        if (options.interval) {
            setInterval(function() {
                calc();
            }, options.interval);
        }
    }

  function getCuttentTab() {
    var tabId = window.sessionStorage.getItem(KEYS.current);
    return getTabInfo(tabId);
  }

  function getTabInfo(tabId) {
    if (!tabId) {
      return console.error('[ERR]', `tabId is ${ tabId }`);
    }
    var tabs = JSON.parse(window.sessionStorage.getItem(KEYS.tabs));
    if (tabs && tabs.length) {
      tabs = tabs.filter((item) => item.id === tabId);
      if (tabs.length) {
        return tabs[0];
      }
    }
    return null;
  }


  // styles
  function initStyle() {
    const cssRules = `
  /* 重置按钮文字 字重 */
  .ant-btn{
    font-weight: 500 !important;
  }

  /* 重置详情页 当前激活标签样式 */
  .eb-view-toolbar-tabs.ant-tabs>.ant-tabs-nav .ant-tabs-ink-bar{
    bottom: 4px !important;
  }

  .ant-pro-sider-logo{
    align-items: start !important;
  }
  /* 重置详情页表单label */
  .eb-view-form .ant-formily-item-layout-vertical .ant-formily-item-label{
    color: #666 !important;
    margin-bottom:1px !important;
  }
  /* 详情页富文本内容预览/编辑器行高 */
  .form-html-editor-preview p,
  .form-html-editor.form-html-editor-edit .w-e-text-container>.w-e-scroll>div>p{
    margin: 0 0 2px 0 !important;
    line-height: 1.5;
  }
  /* 详情页右侧流程 标题文字大小调整 */
  .eb-flow-item-node-title .ant-typography-ellipsis,
  .eb-flow-item-node-title-assign{
    font-size: inherit !important;
  }
  /* 评论和日志字重调整 */
  .eb-comment-list-item-content,
  .eb-form-sider-log-item-time,
  .eb-form-sider-log-item-content{
    font-weight: inherit !important;
  }
  /* 日志 */
  .eb-form-sider-log-item{
    padding-top: 5px !important;
    padding-bottom: 5px !important;
  }
  .eb-form-sider-log-item-time{
    padding-bottom: 0 !important;
  }
  .eb-form-sider-log-item-content{
    margin-bottom: 0 !important;
  }

  /* textarea 最小高度调整 */
  .ant-formily-item textarea.ant-input{
    min-height: 180px;
  }


  /* 重置详情页底部操作按钮位置，改到左边展示 */
  .eb-view-toolbar--bottom .eb-view-toolbar-group{
      direction: ltr !important;
  }
  .eb-view-toolbar--bottom .eb-view-toolbar-group .eb-view-toolbar-overflow-right{
      justify-content: left !important;
  }

  /* 左上角LOGO 位置注入 工时状态 */
  .ant-layout-header.eb-share-form-header>.ydy{
    position: absolute;
    left: 200px;
    top: 0;
    line-height: 20px;
  }

  /* 消息列表样式 */
  .eb-message-center-list-item .ant-list-item-meta-title{
    margin-bottom: 0 !important;
  }
  .eb-message-center-list-item-time{
    margin-bottom: 0 !important;
    margin-top: 0 !important;
    font-weight: inherit !important;
  }
  .eb-message-center-list-item .ant-list-item-meta-description .ant-typography{
    font-weight: inherit !important;
  }

  /* 员工选择器 */
  .eb-selector-modal .eb-selector-modal-content{
    min-height: 668px !important;

    /* 字母索引表列 */
    .eb-index-list{
      border-top: 1px solid #eee;
    }
    /* 字母索引表列 隐藏字母索引
    .eb-index-list-bar{
      display: none !important;
    }
    */

    /* 员工 item */
    .eb-selector-modal-person-item{
      cursor: pointer !important;

      &:hover{
        background: #f5f5f5;
      }
      &:active{
        background: #e5e5e5;
      }
    }

  }

  /* 移除 联系人左边的小图标 */
  .eb-perview-option-tag>.ant-typography-ellipsis{
    max-width: none !important;
    margin-left: auto !important;
  }
  .eb-perview-option-tag>.anticon{
    display: none !important;
  }

  /* 需求详情 限定最大宽度 */
  .eb-view-wrapper>.eb-view-form-wrapper>.eb-view-form>.eb-view-content{
    /* max-width: 1000px; */
  }


  /* 右侧主体 */
  #root > div > section > div.ant-layout{
    margin-top: 15px;
  }




  .ydy{

  }
  .ydy-highlight{
    color: red;
  }
  .ydy-global{
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9999;
    padding-top: 5px;
    padding-right: 10px;
  }

  .ydy-view{
    color: #fff;
    padding: 10px;
    background: #001529;
    position: absolute;
    top: 0;
    z-index: 999;
    min-width: 200px;
  }
  .ydy-view:hover{
    background: rgb(44 52 65);
    position: fixed;
    top: 0;
  }

  .ydy-list{
    white-space: nowrap;
    list-style: none;
  }
  .ydy-list,
  .ydy-list>li,
  .ydy-list>dd{
    padding: 0;
    margin: 0;
  }
  .ydy-list + .ydy-list{
    margin-top: 10px;
  }

  .ydy-hover-show-root .ydy-hover-show-item,
  .ydy-hover-show-parent>.ydy-hover-show-item{
    display: none;
  }
  .ydy-hover-show-root:hover .ydy-hover-show-item,
  .ydy-hover-show-parent:hover>.ydy-hover-show-item{
    display: block;
  }

  .ydy-emp{
    &>.ant-space{
      width: 100%;
    }

    .ydy-emp-editor{
      display: none;
    }
    .ydy-emp-selector{

    }

    &.ydy-emp__editing{
      .ydy-emp-editor{
        display: flex;
      }
      .ydy-emp-selector{
        display: none;
      }
    }

    .ydy-emp-list,
    .ydy-emp-actions{
      padding-top: 3px;
      padding-bottom: 3px;
    }
    .ydy-emp-list{
      flex: 1;
    }
    .ydy-emp-item,
    .ydy-emp-placeholder,
    .ydy-emp-btn{
      display: inline-block;
    }
    .ydy-emp-btn,
    .ydy-emp-item{
      min-width: 30px;
      text-align: center;
      padding: 2px 6px;
      border-radius: 3px;

      &:hover{
        background: #f5f5f5;
      }
      &:active{
        background: #e5e5e5;
      }
    }
    .ydy-emp-item{
      margin-right: 5px;
      margin-bottom: 4px;
    }
    .ydy-emp-item__selected{
      color: #fff;
      background: #247fff;

      &:hover{
        background: #4b96ff;
      }
      &:active{
        background: #146eed;
      }
    }

    .ydy-emp-placeholder{
      color: #999;
      padding: 2px 6px;
    }
    .ydy-emp-btn-clear{
      color: red;
    }
  }
  `;
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = cssRules;
    document.head.appendChild(style);
  }

  function getUserInfo() {
    return $fetch('https://api.yidayun.com/account/get-session-info', {
      context: {},
      params: {}
    }).then((res) => {
      // console.log('RES', res);
      return res;
    }).catch((err) => {
      console.warn('[WARN]', err);
      return err;
    });
  }

  // backup & restore tabs
  function initBackupRestore(info) {
    if (info.account && info.workspace) {
      KEYS.userId = info.account.id;
      KEYS.userKey = `${ info.workspace.number }-${ info.account.id }`;
      KEYS.userTabs = `${ KEYS.userKey }-TABS`;
      KEYS.userCurrent = `${ KEYS.userKey }-CUR_TAB`;
      KEYS.key = `${ info.workspace.number }-${ info.token }`;
      KEYS.tabs = `${ KEYS.key }-TABS`;
      KEYS.current = `${ KEYS.key }-CUR_TAB`;
    }

    // restore
    if (KEYS.tabs && !window.sessionStorage.getItem(KEYS.tabs) && window.localStorage.getItem(KEYS.userTabs)) {
      window.sessionStorage.setItem(KEYS.tabs, window.localStorage.getItem(KEYS.userTabs));
    }
    if (KEYS.current && !window.sessionStorage.getItem(KEYS.current) && window.localStorage.getItem(KEYS.userCurrent)) {
      window.sessionStorage.setItem(KEYS.current, window.localStorage.getItem(KEYS.userCurrent));
    }

    // backup
    setInterval(()=>{
      if (KEYS.tabs && window.sessionStorage.getItem(KEYS.tabs)) {
        window.localStorage.setItem(KEYS.userTabs, window.sessionStorage.getItem(KEYS.tabs));
        // console.log('backup success');
      }
      if (KEYS.current && window.sessionStorage.getItem(KEYS.current)) {
        window.localStorage.setItem(KEYS.userCurrent, window.sessionStorage.getItem(KEYS.current));
      }
    }, 1000);
  }


  // 注入到 当前 tab
  function injectPanel($tabItem, count) {
    count = count || 1;
    if (!$tabItem || !$tabItem.id) {
      return console.error(`$tabItem or $tabItem.id is undefined`);
    }
    var panelId = $tabItem.id.replace('-tab-', '-panel-');
    var tabId = $tabItem.id.split('-tab-').pop();
    // console.log({ tabId });
    var tabInfo = getTabInfo(tabId);
    if (!tabInfo) {
      return console.warn(`找不到 对应的 tab`, tabInfo);
    }
    // console.log('tabInfo:', tabInfo);

    var $panel = document.querySelector(`#${ panelId }`);
    var fields = getDetailfields($panel);

    var $global = document.querySelector(`#ydy-global`);
    $global.innerHTML = '';
    if (tabInfo.viewNumber) {
       var params = {"type":"windowAction","target":"tab","object":""};
      params.object = tabInfo.object;
      if (tabInfo.name) params.name = fields.title || tabInfo.name;
      // if (tabInfo.prefix) params.prefix = tabInfo.prefix;
      if (tabInfo.resId) params.resId = tabInfo.resId;
      if (tabInfo.viewNumber) params.viewNumber = tabInfo.viewNumber;
      if (tabInfo.name !== 'detail' && tabInfo.views && tabInfo.views.length) {
        params.views = tabInfo.views;
      }
      // params.permissionFlag = 3;
      // params.mode = 'readonly';
      params.context = {flowFlag: true};
      tabInfo.url = `https://web.yidayun.com/home?view=${ encodeURIComponent(JSON.stringify(params)) }`;
      // console.log('tabParams:', params);
      // console.log('tabURL:', tabInfo.url);
      $global.appendChild(createBtnCopy({ project: fields.project, title: fields.title || tabInfo.prefix || tabInfo.name, url: tabInfo.url }));
    }


    if (!$panel) {
      return console.warn(`未找到 panel 元素`, $panel);
    }

    if ($ydy.looperInject) {
      clearTimeout($ydy.looperInject);
      $ydy.looperInject = null;
    }

    // console.log('inject', $tabItem.dataset.inject);
    if ($tabItem.dataset.injected === false) {
      return false;
    }

    if (!$panel.querySelector('.ant-formily-grid-layout') && count < 4) {
      count++;
      console.warn(`未找到 panel 元素，1.8秒后重试, count: ${ count }`);
      $ydy.looperInject = setTimeout(() => {
        console.warn('重试 injectPanel');
        injectPanel($tabItem, count);
      }, 1800);
      if (count > 5) {
        $tabItem.dataset.injected = false;
      }
      return false;
    }

    $panel.$btngroup = $panel.querySelector('.ant-space.ant-formily-button-group');

    if (!$panel.$btngroup) {
      return console.warn(`$panel.$btngroup 未找到`);
    }

    /*console.log('tabInfo', tabInfo)
    if (tabInfo.name !== 'detail' && tabInfo.name !== '需求') {
      return console.warn(`不支持 非详情 tab`, tabInfo);
    }*/

    // 分享链接
    if ($panel.querySelector('.ydy-link-copy-share')) {
      return console.warn('已注入 "分享复制按钮"');
    }
    if ($tabItem.loading) {
      return console.warn('$tabItem.loading');
    }

    $tabItem.loading = true;
    $fetch('https://api.yidayun.com/share/getShareLink', {
      context: {},
      params: {objectNumber: tabInfo.object, dataId: tabInfo.resId}
    }).then((res) => {
      // console.log('RES', res);

      fields.url = res.data;
      // console.log('fields', fields);

      // $panel.$btngroup = $panel.querySelector('.ant-space.ant-formily-button-group');
      $panel.$btnCopyShare = createBtnCopyShare(fields);
      $panel.$btngroup.insertBefore($panel.$btnCopyShare, $panel.$btngroup.childNodes[0]);
      $tabItem.loading = false;
    }).catch((err) => {
      console.warn('[WARN]', err);
    }).finally(() => {
      $tabItem.loading = false;
    })
  }

  // 获取详情页字段信息
  function getDetailfields($container) {
    var fields = {};
    if ($container) {
      var $gridItems = $container.querySelectorAll('.ant-formily-grid-layout>.ant-formily-item');
      $gridItems.forEach((item) => {
        var text = item.innerText.replace(/\n/g, '');
        if (text.startsWith('标题:') || text.startsWith('需求标题:')) {
          fields.title = text.split(':').pop();
        }
        if (text.startsWith('所属项目:')) {
          fields.project = text.split(':').pop();
        }
      });
    }
    return fields;
  }

  // 创建 复制按钮
  function createBtnCopyShare(data) {
    var $btnCopy = document.createElement('div');
    $btnCopy.className = 'ant-space-item';
    $btnCopy.innerHTML = `<a class="ydy-link-copy-share" target="_blank" rel="opener" href="${ data.url }" title="注意链接有时效，&#13;&#13;左键复制链接，右键新开查看&#13;&#13;${ (data.project ? `【${ data.project }】` : '') } ${ data.title }">复制</a>`;
    $btnCopy.$link = $btnCopy.querySelector('.ydy-link-copy-share');
    $btnCopy.$link.addEventListener('click', function(event) {
      event.stopPropagation();
      if (!event.ctrlKey) {
        event.preventDefault();
        doCopy(`${ (data.project ? `【${ data.project }】 ` : '') }${ data.title } \n${ data.url }`).then(() => {
          $btnCopy.$link.innerText = '复制成功';
        }).finally(() => {
          setTimeout(() => {
            $btnCopy.$link.innerText = '复制';
          }, 3000);
        });
        return false;
      }
    });
    return $btnCopy;
  }

  // 创建 复制页面链接 按钮
  function createBtnCopy(data) {
    var $btnCopy = document.createElement('div');
    $btnCopy.className = 'ant-space-item';
    $btnCopy.innerHTML = `<a class="ydy-link-copy" target="_blank" rel="opener" href="${ data.url }" title="左键复制链接，右键新开查看&#13;&#13;${ (data.project ? `【${ data.project }】` : '') } ${ data.title }">复制</a>`;
    $btnCopy.$link = $btnCopy.querySelector('.ydy-link-copy');
    $btnCopy.$link.addEventListener('click', function(event) {
      event.stopPropagation();
      if (!event.ctrlKey) {
        event.preventDefault();
        doCopy(`${ (data.project ? `【${ data.project }】 ` : '') }${ data.title } \n${ data.url }`).then(() => {
          $btnCopy.$link.innerText = '复制成功';
        }).finally(() => {
          setTimeout(() => {
            $btnCopy.$link.innerText = '复制';
          }, 3000);
        });
        return false;
      }
    });
    return $btnCopy;
  }

  // 注入到详情页
  function injectDetailView() {
    if (!location.href.startsWith('https://web.yidayun.com/share/form?number=')) {
      return false;
    }
    var $panel = document.querySelector('.eb-share-form-view');
    if ($panel && !$panel.querySelector('.ydy-link-copy')) {
      var fields = getDetailfields($panel);
      fields.url = location.href.split('&callback')[0];
      // console.log('fields', fields);
      $panel.$btngroup = $panel.querySelector('.ant-space.ant-formily-button-group');
      var $btnCopy = createBtnCopyShare(fields);
      $panel.$btngroup.insertBefore($btnCopy, $panel.$btngroup.childNodes[0]);
    }
  }

  // 绑定 注入事件
  function bindInjectEvent() {
    // 绑定 tab 点击事件
    var $navList = document.querySelector('.ant-tabs-nav-list');
    // console.log($navList);
    if ($navList) {
      $navList.addEventListener('click', function(e) {
        if ($navList.timer_click) {
          clearTimeout($navList.timer_click);
          $navList.timer_click = null;
        }
        $navList.timer_click = setTimeout(() => {
          $navList.timer_click = null;
          var $item = e.target.tagName == 'SPAN' ? e.target.parentNode : e.target;
          if ($item && $item.id && $item.id.startsWith('rc-tabs-')) {
            return injectPanel($item);
          }
        }, 350);
      });
    }

    // Tab内容
    var $tabHolder = document.body; //document.querySelector('.ant-tabs-content-holder');
    if ($tabHolder) {

      // 找激活的tab >>>
      var findActivedTab = (next) => {
        var $currentTabItem = document.querySelector('.ant-tabs-nav-list>.ant-tabs-tab.ant-tabs-tab-active>.ant-tabs-tab-btn');
        if (!$currentTabItem) {
          console.warn(`未找到 激活的 tab 元素`);
          return;
        }
        if (typeof next === 'function') {
          next($currentTabItem);
        }
        return $currentTabItem;
      }

      // 注入 员工选择器
      var injectEmployeeSelector = ($el) => {
        if (!$el) return false;

        var parserArray = (str) => {
          str = (str || '').toString().trim();
          str = str.replace(/(，|,|;|\s)+/ig, ',');
          str = str.split(',');
          str = str.filter(function(item, index, array) {
            return array.indexOf(item) === index;
          });
          return str;
        }

        var render = (data, defaultValue) => {
          var html = [];
          var hasSelected = false;
          var selectedList = $el.getSelectedList();
          // console.log(selectedList);
          if (Array.isArray(data) && data.length) {
            data.forEach((item, index) => {
              // hasSelected = selectedList.includes(item);
              hasSelected = selectedList.filter((dd) => dd == item).length;
              html.push(`<a class="ydy-emp-item${ hasSelected ? ' ydy-emp-item__selected' : '' }" title="左键单击：选择&#13;右键单击：排序&#13;左键长按：移除" data-index="${ index }">${ item }</a>`);
            });
          } else {
            defaultValue = defaultValue || `<span class="ydy-emp-placeholder">常联系的</span>`;
            if (defaultValue) {
              html.push(defaultValue);
            }
          }
          return html.join('');
        }

        // 获取已选择的
        $el.getSelectedList = () => {
          var ret = $el.$selectedList ? $el.$selectedList.innerText : '';
          ret = ret.split('\n');
          ret = ret.filter((item) => item.trim());
          return ret;
        }
        // 自动选择
        $el.autoSelect = (next) => {
          if ($el.timer_search) {
            clearTimeout($el.timer_search);
            $el.timer_search = null;
          }
          if ($el.timer_search_render) {
            clearTimeout($el.timer_search_render);
            $el.timer_search_render = null;
          }
          $el.timer_search = setTimeout(() => {
            $el.$results = $el.$content.querySelectorAll('.eb-selector-modal-person-item');

            // 有搜索结果时，保存数据、更新视图
            if ($el.$results.length) {
               // 只有一个结果时自动选中
              if ($el.$results.length === 1) {
                $el.$results[0].click();
              }

              $el.timer_search_render = setTimeout(() => {
                if (typeof next === 'function') {
                  next($el.$results);
                }

                // 保存数据
                window.localStorage.setItem('ydy-data-emps', $el.data.join(','));
                // 更新视图
                $el.$emp.$list.innerHTML = render($el.data);

              }, 200);
            }
          }, 500);
        }


        $el.$content = $el.parentNode.parentNode.parentNode.parentNode;
        $el.$body = $el.$content.parentNode;
        // 展开已选择
        $el.$btnHasSelected = $el.$content.querySelector('a.ant-typography[direction="ltr"]');
        if ($el.$btnHasSelected) {
          $el.$btnHasSelected.click();
          setTimeout(() => {
            $el.$emp.$list.innerHTML = render($el.data);
          }, 1200);
        }
        if ($el.$body) {
          $el.$selectedList = $el.$body.querySelector('.eb-selector-modal-drawer-content>.eb-menu-sm');
          $el.$selectedList.addEventListener('click', function() {
            if ($el.$selectedList.timer_click) {
              clearTimeout($el.$selectedList.timer_click);
              $el.$selectedList.timer_click = null;
            }
            $el.$selectedList.timer_click = setTimeout(() => {
              $el.$emp.$list.innerHTML = render($el.data);
            }, 300);
          })
        }

        // console.log('b:', $el.$body, $el.$selectedList);
        $el.$tree = $el.querySelector('.eb-selector-modal-tree');
        $el.$input = $el.querySelector('input.ant-input[type="text"]');
        $el.data = parserArray(window.localStorage.getItem('ydy-data-emps'));
        $el.$emp = document.createElement('div');
        $el.$emp.className = 'ant-space-item ydy-emp';
        var html = `
<div class="ant-space ydy-emp-selector">
    <div class="ant-space-item ydy-emp-list"></div>
    <div class="ant-space-item ydy-emp-actions">
    <a class="ydy-emp-btn ydy-emp-btn-clear" title="三思 ！！！&#13;&#13;清空保存的历史&#13;&#13;左键长按姓名也可删除">清空</a>
  </div>
</div>
`.trim();
        $el.$emp.innerHTML = html;
        $el.$emp.$input = $el.$emp.querySelector('.ydy-emp-editor-input');
        $el.$emp.$list = $el.$emp.querySelector('.ydy-emp-list');
        $el.$emp.$list.innerHTML = render($el.data);

        // 双击 复制全部常联系的
        $el.$emp.$list.addEventListener('dblclick', (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (event.target.tagName === 'A') {
            return false;
          }
          var value = $el.data.join(' ');
          doCopy(value).then(() => {
            console.log(`常联系的 复制成功`);
            console.log(value);
          });
        });
        // 右键 排序
        $el.$emp.$list.addEventListener('contextmenu', (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (event.target.tagName !== 'A' && event.target.dataset.index === undefined) {
            return false;
          }
          var index = Number(event.target.dataset.index);
          if (isNaN(index)) {
            // console.warn(`index isNaN`, event.target.dataset.index);
            return false;
          }
          // 移动至第一
          value = $el.data.splice(index, 1);
          $el.data.unshift(value);
          window.localStorage.setItem('ydy-data-emps', $el.data.join(','));
          $el.$emp.$list.innerHTML = render($el.data);

        });
        // 长按2秒 移除
        $el.$emp.$list.addEventListener('mousedown', (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (event.target.tagName !== 'A' && event.target.dataset.index === undefined) {
            return false;
          }
          if (event.button !== 0) {
            return false;
          }
          var index = Number(event.target.dataset.index);
          if (isNaN(index)) {
            // console.warn(`index isNaN`, event.target.dataset.index);
            return false;
          }
          var value = $el.data[index];
          if (!value) {
            return false;
          }
          if ($el.$emp.$list.timer_mousedown) {
            clearTimeout($el.$emp.$list.timer_mousedown);
            $el.$emp.$list.timer_mousedown = null;
          }
          $el.$emp.$list.dataset.mousedowned = true;
          $el.$emp.$list.timer_mousedown = setTimeout(() => {
            // 移除
            $el.data.splice(index, 1);
            window.localStorage.setItem('ydy-data-emps', $el.data.join(','));
            $el.$emp.$list.innerHTML = render($el.data);
          }, 1000);
        });
        $el.$emp.$list.addEventListener('mouseup', (event) => {
          if ($el.$emp.$list.timer_mousedown) {
            clearTimeout($el.$emp.$list.timer_mousedown);
            $el.$emp.$list.timer_mousedown = null;
          }
        });

        // 左键 选择
        $el.$emp.$list.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (event.target.tagName !== 'A' && event.target.dataset.index === undefined) {
            return false;
          }
          if (event.button !== 0) {
            return false;
          }
          var index = Number(event.target.dataset.index);
          if (isNaN(index)) {
            // console.warn(`index isNaN`, event.target.dataset.index);
            return false;
          }
          var value = $el.data[index];
          if (!value) {
            return false;
          }

          // 赋值给输入框
          var lastValue = $el.$input.value;
          $el.$input.value = value;
          $el.$input.setAttribute('value', value);
          var eventInput = new Event('input', { target: $el.$input, bubbles: true });
          event.simulated = true;
          var tracker = $el.$input._valueTracker;
          if (tracker) {
            tracker.setValue(lastValue);
          }
          $el.$input.dispatchEvent(eventInput);

          // 执行搜索
          var eventEnter = new KeyboardEvent('keydown', {
            code: 'Enter',
            key: 'Enter',
            charCode: 13,
            keyCode: 13,
            view: window,
            bubbles: true
          });
          $el.$input.dispatchEvent(eventEnter);

          // 自动选择
          $el.autoSelect(() => {
            // 最近点击的插入到最前排
            // value = $el.data.splice(index, 1);
            // $el.data.unshift(value);
          });

        });

        // 清空 按钮
        $el.$emp.$clear = $el.$emp.querySelector('.ydy-emp-btn-clear');
        $el.$emp.$clear.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          $el.data = [];
          window.localStorage.removeItem('ydy-data-emps');
          $el.$emp.$list.innerHTML = render($el.data);
        });
        $el.$tree.insertBefore($el.$emp, $el.$tree.childNodes[0]);

        // 搜索框 事件
        $el.$input.addEventListener('keyup', (event) => {
          if (event.key !== 'Enter') {
            return false;
          }
          var value = $el.$input.value.trim();
          if (!value) {
            return false;
          }
          var currentValue = value;
          value = parserArray(value);
          value = value.concat($el.data);
          value = parserArray(value.join(','));
          $el.data = value;
          $el.$emp.$list.innerHTML = render(value);
          window.localStorage.setItem('ydy-data-emps', $el.data.join(','));

          // 自动选择
          $el.autoSelect();

        });
        $el.dataset.injected = true;
        return $el;
      }

      // 查找选择员工弹框
      var findEmployeeSelectModal = (next) => {
        var $el = document.querySelector('div.ant-tabs-tabpane-active[id$="-panel-person"]');
        if (!$el) {
          return false;
        }
        if ($el.querySelector('.ydy-emp')) {
          return console.warn(`已注入创建员工选择器`);
        }
        injectEmployeeSelector($el);
        if (typeof next === 'function') {
          next($el);
        }
        return $el;
      }

      // 标签页 点击事件
      $tabHolder.addEventListener('click', function() {

        // 查找激活的tab >>>
        if ($tabHolder.timer_findActivedTab) {
          clearTimeout($tabHolder.timer_findActivedTab);
          $tabHolder.timer_findActivedTab = null;
        }
        $tabHolder.timer_findActivedTab = setTimeout(() => {
          findActivedTab(injectPanel);
          $tabHolder.timer_findActivedTab = null;
        }, 800);

        // 监听员工弹窗 >>>
        if ($tabHolder.timer_findEmployeeSelectModal) {
          clearTimeout($tabHolder.timer_findEmployeeSelectModal);
          $tabHolder.timer_findEmployeeSelectModal = null;
        }
        $tabHolder.timer_findEmployeeSelectModal = setTimeout(() => {
          findEmployeeSelectModal(($el) => {
            if ($el && $el.dataset.injected !== 'true') {
              $tabHolder.timer_findEmployeeSelectModal = setTimeout(() => {
                $tabHolder.timer_findEmployeeSelectModal = null;
                findEmployeeSelectModal();
              }, 600);
            }
          });
          $tabHolder.timer_findEmployeeSelectModal = null;
        }, 600);

      });
    }



  }

  // 注入 复制 需求/任务 详情链接 getShareLink
  function injectCurrentTab() {
    // 页面打开后 查找当前 tab
    var currentTab = getCuttentTab();
    if (currentTab) {
      var $currentTab = document.querySelector(`#rc-tabs-0-tab-${ currentTab.id }`);
      // console.log('currentTab:', currentTab, $currentTab);
      if ($currentTab) {
        injectPanel($currentTab);
      }
    }
  }

  // 查询工时
  function getManhourByName(userName) {
    if (!userName && document.querySelector('.eb-sider-avatar .ant-menu-title-content')) {
      userName = document.querySelector('.eb-sider-avatar .ant-menu-title-content').innerText;
    }
    if (!userName && document.querySelector('.eb-share-form-user') && document.querySelector('.eb-share-form-user').childNodes.length > 1) {
      userName = document.querySelector('.eb-share-form-user').childNodes[1].textContent;
    }

    if (!userName) {
      return console.warn('[WARN]', '无法获取当前用户姓名');
    }

    var now = new Date();
    var manhour = {
      userName,
      today: 0,
      yestoday: 0
    }
    manhour.todayTime = `${ now.getFullYear() }${ (now.getMonth()+1).toString().padStart(2, 0) }${ now.getDate().toString().padStart(2, 0) }`;
    now.setDate(now.getDate()-1);
    manhour.yestodayTime = `${ now.getFullYear() }${ (now.getMonth()+1).toString().padStart(2, 0) }${ now.getDate().toString().padStart(2, 0) }`;

    var key = 'wttvmb5t6ajHeader';

    return new Promise((resolve, reject) => {
      var data = {
        "params": {
            "object": "wttvmb5t6aj",
            "viewType": "viewList",
            "size": 50,
            "page": 1,
            "search": {
                "type": "every",
                "fields": [
                    "dpz01mdgyt0"
                ],
                "value": userName
            },
            "fields": [
                key+"Number",
                "s3yq11rqfg8",
            ],
            "filter": {
                "rel": "and",
                "rules": []
            },
            "sort": [
                {
                    "field": "s3yq11rqfg8",
                    "number": "umcedfwmj0k",
                    "order": "descend",
                    "orderType": "DESC"
                }
            ],
        }
      };

      $fetch('https://api.yidayun.com/runtime/getList', data).then((res) => {
        var records = res.data.records;
        // console.log('records:', records);
        var workdate = '';
        records.forEach((item) => {
          // workdate = item[key +'_number']; // use startsWith
          workdate = new Date(item[key +'_f_g29exe']).toLocaleString('zh-CN', {hour12: false}).replace(/\//g,'').split(' ')[0];
          if (workdate === manhour.todayTime) {
            // console.log('today', workdate, item[key +'_f_nssifb'], item[key +'_f_yfnrv6Name'], item[key +'_f_j5uc3d']);
            manhour.today = parseFloat(manhour.today) + parseFloat(item[key +'_f_nssifb']);
          }
          if (workdate === manhour.yestodayTime) {
            // console.log('yestoday', workdate, item[key +'_f_nssifb'], item[key +'_f_yfnrv6Name'], item[key +'_f_j5uc3d']);
            manhour.yestoday = parseFloat(manhour.yestoday) + parseFloat(item[key +'_f_nssifb']);
          }
        });
        // console.log('manhour:', manhour);
        resolve(manhour);
      })
    }).catch((error) => {
      console.error('[ERR]', error);
      reject(manhour);
    });
  }

  // 调整LOGO点击回首页，注入工时状态
  function initLogoLink() {
    var $logo = document.querySelector('#logo') || document.querySelector('header.ant-layout-header.eb-share-form-header');
    if (!$logo) {
      return console.error('logo not found');
    }
    var $logoLink = $logo.querySelector('a');
    if (!$logoLink) {
      return false;
    }
    $logoLink.removeAttribute('target');
    $logoLink.setAttribute('href', '/home?tab=tabhome');
    $logoLink.addEventListener('click', function() {
      window.sessionStorage.setItem(KEYS.current, 'tabhome');
      window.localStorage.setItem(KEYS.userCurrent, 'tabhome');
      window.location.href = '/home?tab=tabhome';
    });

    $ydyView = document.createElement('div');
    $ydyView.className = 'ydy';
    var html = `
<div class="ydy-view ydy-hover-show-root">
  <ul class="ydy-list">
    <li title="今日登记工时" id="ydy-manhour-today">今日：</li>
    <li title="昨日登记工时" id="ydy-manhour-yestoday">昨日：</li>
    <li title="当前上班时长" id="ydy-manhour-working">时长：...</li>
    <li title="当前时间" id="ydy-manhour-now" class="ydy-hover-show-item">时间：...</li>
  </ul>
  <dl class="ydy-list ydy-setting ydy-hover-show-item">
    <dt>设置</dt>
    <dd class="ydy-options-time">上班时间：
      <label title="上午 9点"><input type="radio" name="ydy-options-time" value="9:00">9:00</label>
      <label title="上午 9点30分" style="margin-left: 20px;"><input type="radio" name="ydy-options-time" value="9:30" checked="checked">9:30</label>
    </dd>
  </dl>
  <dl class="ydy-list ydy-hover-show-item ydy-highlight">
    <dd>时长计算说明</dd>
    <dd id="ydy-manhour-working-tip">13点后 减去午餐时间 1小时</dd>
  </dl>
</div>
<div class="ydy-global" id="ydy-global"></div>
`.trim();
      $ydyView.innerHTML = html;
      $logo.appendChild($ydyView);
      $ydyView.$optionsTime = $ydyView.querySelector('.ydy-options-time');
      $ydyView.$optionsTimeItems = $ydyView.$optionsTime.querySelectorAll('input[name="ydy-options-time"]');
      $ydyView.$optionsTimeTip = $ydyView.querySelector('#ydy-manhour-working-tip');

      $ydyView.addEventListener('click', function(event) {
        event.stopPropagation();
        updateManhour();
        return false;
      });

      $ydyView.$optionsTime.addEventListener('click', function(evenet) {
        event.stopPropagation();
        if ($ydyView.$optionsTime.querySelector('input[name="ydy-options-time"]:checked')) {
          window.localStorage.setItem('ydy-options-time', $ydyView.$optionsTime.querySelector('input[name="ydy-options-time"]:checked').value)
        }
        return false;
      });

      var updateManhour = () => {
        getManhourByName().then((res) => {
          // console.log('manhour:', res);
          $ydyView.querySelector('#ydy-manhour-today').innerHTML = `今日：${ res.today }小时 <a style="margin-left: 20px;" href="javascript:void(0)" title="刷新登记工时">刷新</a>`;
          $ydyView.querySelector('#ydy-manhour-yestoday').innerText = `昨日：${ res.yestoday }小时`;
        });
      }

      WorkingHours({
        interval: 1000,
        selector: '#ydy-manhour-working',
        prefix: '时长：',
        before(options) {
          options.start = window.localStorage.getItem('ydy-options-time') || '9:30';
          if ($ydyView.$optionsTimeItems && options.start) {
            if (options.start == '9:00') {
              $ydyView.$optionsTimeItems[0].click();
            }
            if (options.start == '9:30') {
              $ydyView.$optionsTimeItems[1].click();
            }
          }
          $ydyView.querySelector('#ydy-manhour-now').innerText = `时间：${ (new Date()).toLocaleString('zh-CN', { hour12: false }) }`;
        }
      });

      setInterval(() => {
        updateManhour();
      }, 1000 * 6);

      updateManhour();

  }


  // 屏蔽日志监控&垃圾
  function block_something_bad() {
    var block_it = function() {
      // baidu
      window._agl = undefined;
      if (window._agl && window._agl.stop) {
        window._agl.stop();
      }

      // aliyun
      if (window.__bl && window.__bl.removeHook) {
        window.__bl.removeHook();
        if (window.__bl._conf && window.__bl._conf.imgUrl) {
          window.__bl._conf.imgUrl = '';
          window.__bl._conf.debug = false;
        }
      }
    }

    setInterval(() => {
      block_it();
    }, 1000);
    block_it();

    var clean_it = function() {
      for (var key in localStorage) {
        if (key && key.startsWith('fclog_')) {
          localStorage.removeItem(key);
        }
      }
    }

    setInterval(() => {
      clean_it();
    }, 1000 * 6);
    clean_it();
  }


  // ======================================================================================================
  var $ydyView = null;
  var KEYS = {
    key: '',
    tabs: '',
    current: ''
  }
  var COOKIE = {};
  // ======================================================================================================

  function init() {
    initStyle();

    block_something_bad();

    getUserInfo().then((res) => {
      res = res.data ? res.data : res;
      if (res && res.account) {
        initBackupRestore(res);
      } else {
        console.error(`account info error`, res);
      }
    });

    setTimeout(() => {
      initLogoLink();
      injectCurrentTab();
      injectDetailView();
      bindInjectEvent();
    }, 2000);
  }

  init();

  window.$ydy = {
    KEYS,
    $fetch,
    getManhourByName,
    getTabInfo,
    getCuttentTab,
    injectCurrentTab,
    getUserInfo,
    initBackupRestore
  }

})();