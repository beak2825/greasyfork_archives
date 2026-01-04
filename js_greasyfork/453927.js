// ==UserScript==
// @name         data_tea_helper
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  帮助你快速找到页面上使用data-tea的相关埋点信息。
// @author       You
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @match        127.0.0.1/*
// @match        https://ads.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bytedance.net
// @grant        none
// @license      no
// @downloadURL https://update.greasyfork.org/scripts/453927/data_tea_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/453927/data_tea_helper.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // @noframes : 禁止在iframe内加载
  console.log('data-tea-helper loaded success.');

  const TEA_APP_ID = 1583;
  const DATA_TEA_CONFIG = {
    htmlFlag: '__data_tea_helper_open__',
    baseStyle: '__data_tea_helper_base_style_id__',
    switchId: '__data_tea_helper_switch_id__',
    popoverId: '__data_tea_helper_popover_id__',
  };

  // ===============  工具函数 ========================
  const removeDomById = (id) => {
    let dom = document.getElementById(id);
    if (dom) {
      dom.parentNode.removeChild(dom);
    }
  };
  /**
   * 根据标签名追加DOM节点
   */
  const addDomByTag = (id, tagName = 'div', innerHTML = '') => {
    let dom = document.getElementById(id);
    if (!dom) {
      dom = document.createElement(tagName);
    }
    dom.id = id;
    dom.innerHTML = innerHTML;
    document.body.appendChild(dom);
  };

  // ==================== 逻辑代码 =======================
  // 1. 增加插件开关, 增加样式
  addDomByTag(
    DATA_TEA_CONFIG.baseStyle,
    'style',
    `
  .__data_tea_helper_switch__ {
      user-select: none;
      cursor: pointer;
      position: fixed;
      z-index: 9999;
      top: 100px;
      right: 0px;
      padding: 10px;
      border: 1px solid #eee;
      background: #333366;
      color: #EEE;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }

    .__data_tea_helper_popover__ {
      width: 300px;
      min-height: 100px;
      border: 1px solid #ddd;
      padding: 10px;
      position: fixed;
      z-index: 99999;
      background-color: #FFF;
      color: #000;
      border-radius: 4px;
      line-height: 2;
    }

    .${DATA_TEA_CONFIG.htmlFlag} [data-tea-click],
    .${DATA_TEA_CONFIG.htmlFlag} [data-tea-expose],
    .${DATA_TEA_CONFIG.htmlFlag} [data-tea] {
      pointer-events: none;
      position: relative;
    }
    .${DATA_TEA_CONFIG.htmlFlag} [data-tea-click]::after,
    .${DATA_TEA_CONFIG.htmlFlag} [data-tea-expose]::after,
    .${DATA_TEA_CONFIG.htmlFlag} [data-tea]::after {
      pointer-events: auto;
      opacity: 0.7;
      content: 'Event';
      color: #ffcc99;
      background: #333366;
      border: 1px solid #eee;
      position: absolute;
      z-index: 999;
      left: -15px;
      top: -15px;
      min-width: 30px;
      min-height: 30px;
      padding: 5px 10px;
      border-radius: 4px;
    }

    .${DATA_TEA_CONFIG.htmlFlag} [data-tea-click]::after {
      content: 'Click';
    }
    .${DATA_TEA_CONFIG.htmlFlag} [data-tea-expose]::after {
      content: 'Expose';
    }
  `
  );
  addDomByTag(
    DATA_TEA_CONFIG.switchId,
    'div',
    `
  <label class="__data_tea_helper_switch__">
    <input type="checkbox">
    <span class="round">开启埋点展示</span>
  </label>
`
  );

  const $switch = document.getElementById(DATA_TEA_CONFIG.switchId);
  if ($switch) {
    $switch.addEventListener('click', function (e) {
      let isOpen = e?.currentTarget?.querySelector('input').checked;
      if (isOpen) {
        document.body.parentNode.classList.add(DATA_TEA_CONFIG.htmlFlag);
      } else {
        document.body.parentNode.classList.remove(DATA_TEA_CONFIG.htmlFlag);
      }
    });
  }

  // 2. 点击获取埋点信息
  const getDataTeaAttr = (dom) => {
    const FIXED_ATTR = ['data-tea-click', 'data-tea', 'data-tea-expose'];
    const result = {
      eventType: 'click/focus/blur',
      eventName: '',
      params: {},
    };
    if (dom && dom.attributes) {
      [...dom.attributes].forEach((item) => {
        if (FIXED_ATTR.includes(item.name)) {
          result.eventName = item.value;
          if (item.name !== 'data-tea') {
            result.eventType = item.name.replace('data-tea-', '');
          }
        } else if (item.name.indexOf('data-tea') > -1) {
          let paramName = item.name.replace('data-tea-', '').replaceAll('-', '_');
          result.params[paramName] = item.value;
        }
      });
    }

    return result;
  };

  /**
   * 展示埋点信息
   */
  const showEventInfo = (dom, eventInfo) => {
    // 这几个配置信息，不能上传到外部
    const etPath = `https://io-sg.bytedance.net/byteio/event/schema/${eventInfo.eventName}?subAppId=${TEA_APP_ID}&tabKey=basic`;
    const teaPath = `https://tea-va.bytedance.net/tea/portal/event-analysis/${TEA_APP_ID}/?event_name=${eventInfo.eventName}`;

    let { top, left } = dom.getBoundingClientRect();

    // 简单做一下窗口适配
    if (left + 300 > document.body.clientWidth - 50) {
      left = left - 300;
    }
    if (top + 200 > window.innerHeight - 50) {
      top = top - 200;
    }

    addDomByTag(
      DATA_TEA_CONFIG.popoverId,
      'div',
      `
      <div class="__data_tea_helper_popover__" style="left: ${left + 10}px; top: ${top + 10}px">
        <div style="border-bottom: 1px solid #ddd; font-weight: bold; display:flex;">
          <span>Event Info</span>
          <div style="flex: 1; text-align: right;">
            <a href="${etPath}" target="_blank">ByteIO埋点管理</a>,
            <a href="${teaPath}" target="_blank">TEA分析</a>
          </div>
        </div>
        <div>
          <strong>EventType: </strong>${eventInfo.eventType}
        </div>
        <div>
          <strong>EventName: </strong>${eventInfo.eventName}
        </div>
        <div>
          <strong>EventParams: </strong>
          <ul style="padding-left:20px; line-height: 1.4;">
            ${Object.keys(eventInfo.params)
              .map((key) => {
                return `<li>
                <strong>${key}: </strong>${eventInfo.params[key]}
              </li>`;
              })
              .join('')}
          </ul>
        </div>
      </div>
    `
    );
  };

  let isEnterPopover = false;
  let timer = null;
  // 2. hover展示埋点信息
  $('body').on('mouseenter mouseleave', '[data-tea-click],[data-tea-expose],[data-tea]', (e) => {
    // 没有打开辅助功能时，不做处理
    if (!$('html').hasClass(DATA_TEA_CONFIG.htmlFlag)) {
      return;
    }
    clearTimeout(timer);
    switch (e.type) {
      case 'mouseenter':
        const targetDom = e.target;
        const eventInfo = getDataTeaAttr(targetDom);
        showEventInfo(targetDom, eventInfo);
        break;
      case 'mouseleave':
        timer = setTimeout(() => {
          if (!isEnterPopover) {
            removeDomById(DATA_TEA_CONFIG.popoverId);
          }
        }, 500);
        break;
    }
  });

  // 实现鼠标进入popover弹窗，弹窗不会消失
  $('body').on('mouseenter mouseleave', `#${DATA_TEA_CONFIG.popoverId}`, (e) => {
    clearTimeout(timer);
    switch (e.type) {
      case 'mouseenter':
        isEnterPopover = true;
        break;
      case 'mouseleave':
        isEnterPopover = false;
        timer = setTimeout(() => {
          removeDomById(DATA_TEA_CONFIG.popoverId);
        }, 300);
        break;
    }
  });
})();
