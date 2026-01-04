// ==UserScript==
// @name         抖极电商获取定容需求列表
// @namespace    https://imnerd.org
// @version      0.1
// @description  抖极电商获取定容需求列表的快捷脚本
// @author       lizheming
// @match        meego.feishu.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460384/%E6%8A%96%E6%9E%81%E7%94%B5%E5%95%86%E8%8E%B7%E5%8F%96%E5%AE%9A%E5%AE%B9%E9%9C%80%E6%B1%82%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/460384/%E6%8A%96%E6%9E%81%E7%94%B5%E5%95%86%E8%8E%B7%E5%8F%96%E5%AE%9A%E5%AE%B9%E9%9C%80%E6%B1%82%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

function copyFormatted (html) {
  // Create container for the HTML
  // [1]
  var container = document.createElement('div')
  container.innerHTML = html

  // Hide element
  // [2]
  container.style.position = 'fixed'
  container.style.pointerEvents = 'none'
  container.style.opacity = 0

  // Detect all style sheets of the page
  var activeSheets = Array.prototype.slice.call(document.styleSheets)
    .filter(function (sheet) {
      return !sheet.disabled
    })

  // Mount the container to the DOM to make `contentWindow` available
  // [3]
  document.body.appendChild(container)

  // Copy to clipboard
  // [4]
  window.getSelection().removeAllRanges()

  var range = document.createRange()
  range.selectNode(container)
  window.getSelection().addRange(range)

  // [5.1]
  document.execCommand('copy')

  // [5.2]
  for (var i = 0; i < activeSheets.length; i++) activeSheets[i].disabled = true

  // [5.3]
  document.execCommand('copy')

  // [5.4]
  for (var j = 0; j < activeSheets.length; j++) activeSheets[j].disabled = false

  // Remove the container
  // [6]
  document.body.removeChild(container)
}

async function main() {
    const cookies = (new Map(document.cookie.split(';').map(text => {
      const idx = text.indexOf('=');
      if (idx === -1) return [];
      return [ text.slice(0, idx).trim(), text.slice(idx + 1).trim() ];
    }).filter(v => v.length)))

    const csrfToken = cookies.get('meego_csrf_token');
    if (!csrfToken) {
      return alert('没有 CSRF Token');
    }

    const resp = await fetch("https://meego.feishu.cn/goapi/v3/search/group_info", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,da;q=0.6,de;q=0.5",
        "content-type": "application/json",
        "locale": "zh",
        "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-content-language": "zh",
        "x-lark-gw": "1",
        "x-meego-csrf-token": csrfToken,
        "x-meego-source": "web/release_train_hotfix_101267-3.2.2.4015"
      },
      "referrer": "https://meego.feishu.cn/e-commerce/storyView/PlzyWgg4g",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"QueryString\":\"{\\\"options\\\":{\\\"pagination\\\":{\\\"page_num\\\":1,\\\"page_size\\\":2000},\\\"facet\\\":{\\\"fields\\\":[],\\\"update_one\\\":true,\\\"need_check_dirty_fields\\\":true,\\\"type\\\":0},\\\"condition_group\\\":{\\\"conjunction\\\":\\\"AND\\\",\\\"groups\\\":[{\\\"conjunction\\\":\\\"AND\\\",\\\"conditions\\\":[{\\\"field_type\\\":\\\"_business\\\",\\\"field\\\":\\\"business\\\",\\\"storage_key\\\":\\\"business\\\",\\\"value_list\\\":[\\\"62cbed29d2912e5177e9ec9b\\\"],\\\"originalValue\\\":\\\"[\\\\\\\"62cbed29d2912e5177e9ec9b\\\\\\\"]\\\",\\\"operator\\\":\\\"In\\\"},{\\\"field_type\\\":\\\"_sub-stage\\\",\\\"field\\\":\\\"sub_stage\\\",\\\"storage_key\\\":\\\"sub_stage\\\",\\\"value_list\\\":[\\\"LgrmUOCRq\\\"],\\\"originalValue\\\":\\\"[\\\\\\\"LgrmUOCRq\\\\\\\"]\\\",\\\"operator\\\":\\\"Eq\\\"}],\\\"groups\\\":[]}]},\\\"groups_new\\\":[{\\\"field\\\":\\\"sub_stage\\\",\\\"field_type\\\":\\\"_sub-stage\\\"}],\\\"sorts\\\":[]},\\\"search_type\\\":4,\\\"project_id_list\\\":[\\\"5ef9a35f0565db908bb32459\\\"],\\\"user_key\\\":\\\"lizheming\\\",\\\"search_types\\\":[],\\\"work_item_type_key\\\":\\\"story\\\"}\",\"SearchType\":4}",
      //"body": "{\"QueryString\":\"{\\\"options\\\":{\\\"pagination\\\":{\\\"page_num\\\":1,\\\"page_size\\\":2000},\\\"facet\\\":{\\\"fields\\\":[],\\\"update_one\\\":false,\\\"need_check_dirty_fields\\\":true,\\\"type\\\":0},\\\"condition_group\\\":{\\\"conjunction\\\":\\\"AND\\\",\\\"groups\\\":[{\\\"conjunction\\\":\\\"AND\\\",\\\"conditions\\\":[{\\\"field_type\\\":\\\"_business\\\",\\\"field\\\":\\\"business\\\",\\\"storage_key\\\":\\\"business\\\",\\\"value_list\\\":[\\\"62cbed29d2912e5177e9ec9b\\\"],\\\"originalValue\\\":\\\"[\\\\\\\"62cbed29d2912e5177e9ec9b\\\\\\\"]\\\",\\\"operator\\\":\\\"In\\\"},{\\\"field_type\\\":\\\"_sub-stage\\\",\\\"field\\\":\\\"sub_stage\\\",\\\"storage_key\\\":\\\"sub_stage\\\",\\\"value_list\\\":[\\\"closed\\\",\\\"end\\\"],\\\"originalValue\\\":\\\"[\\\\\\\"closed\\\\\\\",\\\\\\\"end\\\\\\\"]\\\",\\\"operator\\\":\\\"Nin\\\"},{\\\"field_type\\\":\\\"quick_complete\\\",\\\"field\\\":\\\"quick_complete\\\",\\\"storage_key\\\":\\\"states\\\",\\\"value_list\\\":[\\\"需求初评\\\"],\\\"originalValue\\\":\\\"[\\\\\\\"需求初评\\\\\\\"]\\\",\\\"operator\\\":\\\"In\\\"},{\\\"field_type\\\":\\\"select\\\",\\\"field\\\":\\\"field_eedbe5\\\",\\\"storage_key\\\":\\\"field_eedbe5\\\",\\\"value_list\\\":[\\\"JgZditxM9\\\"],\\\"originalValue\\\":\\\"[\\\\\\\"JgZditxM9\\\\\\\"]\\\",\\\"operator\\\":\\\"In\\\"}],\\\"groups\\\":[]}]},\\\"groups_new\\\":[{\\\"field\\\":\\\"sub_stage\\\",\\\"field_type\\\":\\\"_sub-stage\\\"},{\\\"field\\\":\\\"business\\\",\\\"field_type\\\":\\\"_business\\\"}],\\\"sorts\\\":[{\\\"field\\\":\\\"field_cd0d96\\\",\\\"field_type\\\":\\\"number\\\",\\\"order\\\":\\\"ASC\\\"},{\\\"field\\\":\\\"priority\\\",\\\"field_type\\\":\\\"select\\\",\\\"order\\\":\\\"ASC\\\"}]},\\\"search_type\\\":4,\\\"project_id_list\\\":[\\\"5ef9a35f0565db908bb32459\\\"],\\\"user_key\\\":\\\"lizheming\\\",\\\"search_types\\\":[],\\\"work_item_type_key\\\":\\\"story\\\"}\",\"SearchType\":4}",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    }).then(resp => resp.json());

    const resp2 = await fetch("https://meego.feishu.cn/goapi/v2/search/work_items_by_id", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,da;q=0.6,de;q=0.5",
        "content-type": "application/json",
        "locale": "zh",
        "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-content-language": "zh",
        "x-lark-gw": "1",
        "x-meego-csrf-token": csrfToken,
        "x-meego-source": "web/release_train_hotfix_101267-3.2.2.4015"
      },
      "referrer": "https://meego.feishu.cn/e-commerce/storyView/PlzyWgg4g",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"search_type\":0,\"project_key\":\"5ef9a35f0565db908bb32459\",\"ids\":"+JSON.stringify(resp.data.list[0].work_items.map(({work_item_id}) => work_item_id))+",\"related_project_list\":[],\"need_dirty_fields\":true}",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    }).then(resp => resp.json());

    const result = resp2.data.work_items.map(item => `<tr><td style="font-size:11px;">${item.name}</td><td style="font-size:11px;">${item.owner.nickname}</td><td style="font-size:11px;">${item.wiki}</td><td style="font-size:11px;">https://meego.feishu.cn/e-commerce/story/detail/${item.id}</td></tr>`).join('');
    copyFormatted(`<table>${result}</table>`);
    alert('复制成功请到对应表格粘贴');
}

(function() {
    'use strict';

    const $btn = document.createElement('button');
    $btn.innerText = '抖极电商';
    $btn.style = `position: fixed;
    bottom: 5px;
    left: 80px;
    z-index: 10000000000000000;
    width: 40px;
    height: 40px;
    font-size: 14px;
    line-height: 1em;
    word-break: break-all;
    border-radius: 50%;
    border: 1px solid green;
    background: green;
    color: #FFF;
    font-weight: bold;
    padding: 5px;
    box-sizing: content-box;
    cursor: pointer;`;

    const $style = document.createElement('style');
    $style.innerHTML = `.rotate {
      animation: rotate 3s linear infinite;
    };
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
      }`;

    document.body.appendChild($btn);
    document.body.appendChild($style);
    document.addEventListener('click', async e => {
        if (e.target !== $btn) return;
        $btn.classList.add('rotate');
        await main();
        $btn.classList.remove('rotate');
    });
})();