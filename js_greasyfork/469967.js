// ==UserScript==
// @name         批量修改dns
// @namespace    http://tampermonkey.net/
// @version      2.1.2
// @description  auto change domain dns!
// @author       lmlife
// @match        https://www.onamae.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469967/%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9dns.user.js
// @updateURL https://update.greasyfork.org/scripts/469967/%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9dns.meta.js
// ==/UserScript==
var customDataKey = 'custom_auto--data';
var customStatusKey = 'custom_auto--status';
var customLogKey = 'custom_auto--log';
var currentDatetime = new Date().toLocaleString()
var customData = JSON.parse(sessionStorage.getItem(customDataKey) || '{ "data": [] }');
var { data } = customData;
var customStatus = JSON.parse(sessionStorage.getItem(customStatusKey) || '{ "index": -1, "data": [] }');
var { index } = customStatus

  ; (function () {
    $(document).ready(
      () => {
        (async () => {
          if (window.location.href.indexOf('ns_update/input') > -1) {
            inputPageEntry();
          } else if (window.location.href.indexOf('ns_update/confirm') > -1) {
            confirmPageEntry();
          } else if (window.location.href.indexOf('ns_update/result') > -1) {
            resultPageEntry();
          }
        })();
      }
    )
  })();

function inputPageEntry() {
  console.log(`进入 [ ns_update/input ], 第${index + 1}组`);
  var dom = ''
  if (index === -1) {
    dom = generateStartDom()
    setTimeout(() => {
      initFileHandler()
    })
  } else if (index < data.length) {
    dom = generateUploadingDom(index)
    const { domains, dns } = data[index]

    const observer1 = new MutationObserver(async () => {
      submitHandler(dns);

      const pagination = $('#rpp')
      if (pagination) {
        const options = pagination[0]
        const option = options[options.length - 1]
        onChangeRpp(option.value)
      }

      observer1.disconnect();
    });

    observer1.observe($('#domaininput_view')[0], { childList: true });

    $('#domain').val(domains.join('\n'));
    $('#btnSearch a')[0].click();
  } else {
    dom = generateDoneDom(index);
    clearCache();
  }

  var container = $("<div style='position: fixed; bottom: 0; left:0; right: 0; padding: 8px; background: #fff;'></div>");
  container.append(dom);
  $("body").append(container);
  $("body").css({ marginBottom: `${container.clientHeight}px` })
}

function submitHandler(dns) {
  const observer2 = new MutationObserver(async () => {
    // 判断当前数据和实际数据是否匹配
    if (!dataIsEuqalUserData()) {
      console.error('数据不匹配');
      observer2.disconnect();
      submitHandler(dns);
      $('#btnSearch a')[0].click();
      return
    }

    console.log('数据匹配成功');
    $('#paradigm_all')[0].click();
    $('#name_s_tab02 label')[0].click();
    await nextTick();
    $('#txtDomain1').val(dns[0]);
    $('#txtDomain2').val(dns[1]);
    $('#idSubmit')[0].click();
    observer2.disconnect();

    const observer3 = new MutationObserver(async () => {
      $('#myBtnCancel')[0].click();
      observer3.disconnect();
    });
    observer3.observe($('#domainProtectModelForm')[0], { childList: true });
  });
  observer2.observe($('#domaininput_view')[0], { childList: true });
}

async function confirmPageEntry() {
  console.log('进入ns_update/confirm');
  await pollGetElement('[href="javascript:submitconfirmForm()"]', (dom) => dom.click());
}

async function resultPageEntry() {
  console.log('进入ns_update/result');
  const doneData = getDoneData();
  sessionStorage.setItem(customStatusKey, JSON.stringify({ index: index + 1, data: doneData }));
  setLog('done', doneData);
  await pollGetElement('.btn_bg a', (dom) => dom.click());
}

function nextTick() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    })
  })
}

function pollGetElement(selector, cb) {
  return new Promise((resolve) => {
    var timer = setInterval(() => {
      var dom = $(selector)[0]
      if (dom) {
        clearInterval(timer)
        cb(dom)
        resolve()
      }
    }, 1000)
  })
}

if (!window.loadStatusDomain) {
  window.loadStatusDomain = () => { }
}

function generateStartDom() {
  // 创建动态生成的 HTML
  var dynamicHTML = `<input type="file" id="fileInput">
  <button id="startButton">开始</button>
  <button id="endButton">出错了？清理缓存</button>`;

  // 创建一个 <div> 元素，并将动态 HTML 内容追加到其中
  var divElement = document.createElement('div');
  divElement.innerHTML = dynamicHTML;

  return divElement
}

function generateUploadingDom(i) {
  return `<div>正在上传第${i + 1}组</div>`;
}

function generateDoneDom(i) {
  return `<div>已完成，共操作${i}组数据</div>`;
}

function parseInputString(inputString) {
  var lines = inputString.split('\n').filter((line) => line.trim());
  var result = [];

  var currentGroup = {
    domains: [],
    dns: []
  };

  lines.forEach(function (line) {
    var lineParts = line.trim().split(/\s+/);
    const [domain, ...dns] = lineParts

    if (dns.length) {
      currentGroup = {
        domains: [],
        dns,
      };
      result.push(currentGroup);
      currentGroup.domains.push(domain);
    } else {
      if (currentGroup.domains.length === 100) {
        currentGroup = {
          domains: [],
          dns: currentGroup.dns,
        };
        result.push(currentGroup);
        currentGroup.domains.push(domain);
      } else {
        currentGroup.domains.push(domain);
      }
    }
  });

  return result;
}

function initFileHandler() {
  $('#startButton').click(function () {
    var fileInput = $('#fileInput')[0];
    var file = fileInput.files[0]; // 获取上传的文件

    var reader = new FileReader();
    reader.onload = function (event) {
      var contents = event.target.result; // 获取文件内容
      // 在这里对文件内容进行解析和处理
      const data = parseInputString(contents);
      console.log(data); // 输出文件内容到控制台
      sessionStorage.setItem(customDataKey, JSON.stringify({ data }));
      sessionStorage.setItem(customStatusKey, JSON.stringify({
        index: index + 1,
        data: [],
      }));

      setLog('start', { raw_data: contents, parse_data: data });
      window.location.reload();
    };

    reader.readAsText(file); // 以文本形式读取文件内容
  });
  $('#endButton').click(function () {
    clearCache(true);
  });
}

function clearCache(manual) {
  sessionStorage.setItem(customDataKey, JSON.stringify({ data: [] }));
  sessionStorage.setItem(customStatusKey, JSON.stringify({ index: -1, data: [] }));
  if (manual) {
    setLog('error');
  }
}

function dataIsEuqalUserData() {
  const actualData = Array.from($('#domaininput_view table tr').slice(1)).map((tr) => tr.querySelector('td + td').textContent);
  const userData = data[index].domains;

  const lengthEqual = actualData.length === userData.length;
  const firstDomainIn = userData.includes(actualData[0]);
  const lastDomainIn = userData.includes(actualData[actualData.length - 1]);
  console.log('lengthEqual', actualData.length, userData.length);
  console.log('firstDomainIn', firstDomainIn);
  console.log('lastDomainIn', lastDomainIn);
  return lengthEqual && firstDomainIn && lastDomainIn;
}

function getDoneData() {
  const { data = [] } = JSON.parse(sessionStorage.getItem(customStatusKey));
  const indexData = Array.from($('#main table tr').slice(1)).map((tr) => Array.from(tr.querySelectorAll('td')).map((td) => td.textContent));
  data[index] = indexData;
  return data;
}

function setLog(stage, data) {
  const { logs } = JSON.parse(localStorage.getItem(customLogKey) || JSON.stringify({ logs: [] }));
  if (stage === 'start') {
    const { raw_data, parse_data } = data
    logs.push({
      date: currentDatetime,
      user: $('#header .name')[0].textContent,
      raw_data,
      parse_data,
      result_data: []
    });
  } else if (stage === 'done') {
    const currentLog = logs[logs.length - 1];
    currentLog.result_data = data;
  } else if (stage === 'error') {
    const currentLog = logs[logs.length - 1];
    currentLog.error = '用户清理了缓存';
  }

  logs.splice(100)

  localStorage.setItem(customLogKey, JSON.stringify({ logs }));
}
