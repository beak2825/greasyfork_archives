// ==UserScript==
// @name         生成mge.js 代码, lx-v4
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  try to take over the world!
// @author       liujun30
// @match        http*://ocean.sankuai.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/374396/%E7%94%9F%E6%88%90mgejs%20%E4%BB%A3%E7%A0%81%2C%20lx-v4.user.js
// @updateURL https://update.greasyfork.org/scripts/374396/%E7%94%9F%E6%88%90mgejs%20%E4%BB%A3%E7%A0%81%2C%20lx-v4.meta.js
// ==/UserScript==

// 插件使用文档：https://wiki.sankuai.com/pages/viewpage.action?pageId=1167972957
// copy改源码至tampermonkey插件内

function xhrGet(url) {
  return new Promise((resolve, reject) => {
    /* eslint-disable no-undef */
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'JSON',
      onload: res => {
        if (res.status !== 200) {
          reject(res);
        } else {
          resolve(res.response.data);
        }
      },
    });
  });
}

(function() {
  const d = document.createElement('div');
  d.innerHTML = `<button style="position: fixed; right: 40px; bottom: 150px" class="ant-btn ant-btn-danger"><span>生成mge</span></button>`;

  d.addEventListener('click', genCode);
  document.body.appendChild(d);
})();

function genCode() {
  const pageRegx = /#\/event-traffic-config.+[?&]pageId=(\d+)&?/;
  const channelRegx = /[?&]channelId=(\d+)&?/;

  if (!pageRegx.test(window.location.href) || !channelRegx.test(window.location.href)) {
    successTip('请先访问事件详情页，再点击【生成mge】', 'error');
    return;
  }

  const pageId = pageRegx.exec(window.location.href)[1];

  xhrGet(`https://ocean.sankuai.com/config/api/pages/${pageId}/module-event-id-name`).then(
    ({ items }) =>
      Promise.all(
        items.map(({ id }) => xhrGet(`https://ocean.sankuai.com/config/api/event_modules/${id}`))
      )
  )
  .then((events) => {
    const mgeObj = events
      .map(evt => Object.assign(evt, { elementName: evt.element.name }))
      .map(evt => Object.assign(evt, { businessData: getCustomField(evt) }))
      .map(evt => genMgeData(evt))
      .reduce((sum, v) => Object.assign({}, sum, v), {});

    const rsStr = `// 埋点信息url：${
      window.location.href
    } \n// 生成mge代码操作文档：https://wiki.sankuai.com/pages/viewpage.action?pageId=1167972957 \n/* eslint-disable */\nmodule.exports = ${JSON.stringify(
      mgeObj,
      null,
      2
    )}`.replace(/['"]?##['"]?/g, '');

    GM_setClipboard(rsStr, { type: 'text' });
    successTip('已复制代码到剪切板，command+v可粘贴到编辑器', 'success');
  })
  .catch(err => {
    console.error('接口请求失败', err);
    successTip('请求埋点详情接口失败，请稍后再试 或联系【liujun30】', 'error');
  });
}

function successTip(msg, type) {
  const m = document.createElement('div');
  m.innerHTML = `<div data-reactroot="" class="ant-message"><span><div class="ant-message-notice"><div class="ant-message-notice-content"><div class="ant-message-custom-content ant-message-${type}"><i class="anticon anticon-check-circle"></i><span>${msg}</span></div></div></div></span></div>`;
  document.body.appendChild(m);
  setTimeout(() => {
    m.remove();
  }, 3000);
}

function getCustomField(event) {
  try {
    // {title: "title_value", custom: { position_id: 'xxx', click_city_id: 'xxx' } }
    const businessData = JSON.parse(event.pages[0].platforms.find(({ name }) => name === 'web').moduleSampleCode.report_json).evs[0].val_lab
    if (Object.keys(businessData.custom).length === 0) {
      delete businessData.custom
    }

    let params = Object.keys(businessData)
    if (businessData.custom) {
      params = params.concat(Object.keys(businessData.custom))
    }
    params.splice(params.indexOf('custom'), 1)

    return {
      // ['title', 'position_id', 'click_city_id']
      params,
      // {title,custom:{position_id,click_city_id}}
      customStruct: JSON.stringify(businessData).replace(/:".+?"(?=[,}])/g, '').replace(/"/g, '')
    };
  } catch (e) {
    console.error("can't get custom field in event:", event.eventName, e);
    return {
      params: [],
      customStruct: '{}'
    };
  }
}

function genMgeData({ bid, eventName, elementName, eventType, businessData }) {
  // 避免曝光、点击事件的业务参数顺序不同
  const sortedCustomParams = businessData.params.sort();
  return {
    // 以 ## 为锚点，方便替换成函数
    [bid]: `##(${sortedCustomParams.join(', ')}) => ({ bid: '${bid}', elementName: '${elementName}', eventName: '${eventName}', eventType: '${eventType}', businessData: ${businessData.customStruct}})##`,
  };
}
