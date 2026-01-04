// ==UserScript==
// @name         领空投啦
// @namespace    ljybill
// @version      1.0.1
// @description  自动填表格
// @author       ljybill
// @match        https://docs.google.com/forms/*
// @downloadURL https://update.greasyfork.org/scripts/434065/%E9%A2%86%E7%A9%BA%E6%8A%95%E5%95%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/434065/%E9%A2%86%E7%A9%BA%E6%8A%95%E5%95%A6.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
  'use strict';

  const isDebuggerMode = false; // 开发模式下此值改成true。

  const STAGE_1 = 1;
  const STAGE_2 = 2;
  const STAGE_3 = 3;

  // localStorage中的key
  const LocalStorageAddressKey = '__address__';
  const LocalStorageStatusKey = '__status__';
  const LocalStorageAnswerKey = '__answer__';

  let showedAddressInput = false;

  /**
   * @link https://stackoverflow.com/questions/22125865/wait-until-flag-true
   */
  function waitFor(condition, callback) {
    if (!condition()) {
      window.setTimeout(waitFor.bind(null, condition, callback), 500); /* this checks the flag every 100 milliseconds*/
    } else {
      callback();
    }
  }

  // ------------ ui --------------
  function injectUi() {
    const leftDiv = document.createElement('div');
    document.body.appendChild(leftDiv);
    const status = localStorage.getItem(LocalStorageStatusKey);
    leftDiv.outerHTML = `
<div style="position: fixed;background-color: #747474;width: 100px;left: 0;top: 50%;">
<p><button id="btn_play">${status === 'play' ? '停止' : '开始'}</button></p>
<p><button id="btn_address">插入地址</button></p>
<p><button id="btn_capture">捕捉正确答案</button></p>
<p><button id="btn_clear_status">清空状态（保留钱包地址）</button></p>
<p><button id="btn_clear">清空数据（不保留）</button></p>
</div>
`;

    const rightDiv = document.createElement('div');
    document.body.appendChild(rightDiv);
    const list = JSON.parse(localStorage.getItem(LocalStorageAddressKey));
    let textDomHtml = '';
    if (Array.isArray(list)) {
      textDomHtml = list
        .map(item => {
          return `<p style="color: #FFF;"><span style="color: ${item.isComplete ? '#5afd3c' : '#ede611'}">${item.isComplete ? 'Finish' : 'Wait'}</span> --- ${item.content}</p>`
        }).join('');
    }
    rightDiv.outerHTML = `
<div style="position: fixed; background: rgba(0,0,0,0.6); width: 400px; height: 600px; right: 0; top: 20%; overflow-y: auto;">${textDomHtml}</div>
`;

    // bind listener
    document.getElementById('btn_play').addEventListener('click', () => {
      const status = localStorage.getItem(LocalStorageStatusKey);
      const isPlaying = status === 'play';

      if (isPlaying) {
        // 目前在执行
        localStorage.setItem(LocalStorageStatusKey, 'stop');
        document.getElementById('btn_play').innerText = '开始';
      } else {
        // 目前在暂停
        localStorage.setItem(LocalStorageStatusKey, 'play');
        document.getElementById('btn_play').innerText = '停止';
        alert('启动成功，请刷新页面');
      }
    });

    document.getElementById('btn_address').addEventListener('click', () => {
      if (showedAddressInput) {
        return;
      }
      inputAddress();
    });

    document.getElementById('btn_capture').addEventListener('click', () => {
      if (judgeCurrentStage() !== STAGE_1) {
        return;
      }

      const labels = findLabels();
      let answerIdx = -1;
      for (let i = 0, len = labels.length; i < len; i++) {
        const forId = labels[i].getAttribute('for');
        const radio = document.getElementById(forId);
        const isChecked = radio.classList.contains('isChecked');
        if (isChecked) {
          answerIdx = i;
          break;
        }
      }
      const answerLabel = labels[answerIdx];
      const answerImgUrl = answerLabel.querySelector('img').getAttribute('src');

      localStorage.setItem(LocalStorageAnswerKey, answerImgUrl);
      alert('记录成功');
    });

    document.getElementById('btn_clear_status').addEventListener('click', () => {
      clearAllData(true);
    });

    document.getElementById('btn_clear').addEventListener('click', () => {
      clearAllData(false);
    });
  }

  function inputAddress() {
    showedAddressInput = true;
    const div = document.createElement('div');
    document.body.appendChild(div);
    div.outerHTML = `
<div id="address_modal" style="position: fixed;left: 50%;top: 50%;width: 400px;height: 400px;background-color: gainsboro;margin-left: -200px;margin-top: -200px;">
<textarea id="address_textarea" style="width: 394px; margin: 0px; height: 355px;" placeholder="地址之间用英文逗号分割"></textarea>
<button id="address_button_submit">确认</button>
<button id="address_button_cancel">取消</button>
</div>
`;

    document.getElementById('address_button_submit').addEventListener('click', () => {
      const address = document.getElementById('address_textarea').value;
      processAddressText(address);
      alert('保存成功');
      document.body.removeChild(document.getElementById('address_modal'));
      showedAddressInput = false;
    });

    document.getElementById('address_button_cancel').addEventListener('click', () => {
      document.body.removeChild(document.getElementById('address_modal'));
      showedAddressInput = false;
    });
  }
  // ------------ global --------------
  /**
   * @description 判断当前页面是第几页
   */
  function judgeCurrentStage() {
    const labels = findLabels();
    if (labels.length === 4) {
      return STAGE_1;
    }
    const input = findInput();
    if (input) {
      return STAGE_2;
    }
    return STAGE_3;
  }

  function processAddressText(address) {
    const list = address.split(',').map(add => {
      return {
        content: add,
        isComplete: false,
      }
    });
    saveAddressConfig(list);
  }

  function saveAddressConfig(list) {
    localStorage.setItem(LocalStorageAddressKey, JSON.stringify(list))
  }

  function clearAllData(saveAddressKey) {
    if (!saveAddressKey) {
      [LocalStorageAddressKey, LocalStorageStatusKey, LocalStorageAnswerKey].forEach((key) => {
        localStorage.removeItem(key);
      })
    } else {
      [LocalStorageStatusKey, LocalStorageAnswerKey].forEach((key) => {
        localStorage.removeItem(key);
      })
      const list = JSON.parse(localStorage.getItem(LocalStorageAddressKey))
      list.forEach(item => item.isComplete = false);
      localStorage.setItem(LocalStorageAddressKey, JSON.stringify(list));
    }
  }

  // ------------ stage 1 --------------
  function findLabels() {
    return document.getElementsByTagName('label');
  }

  function getAnswerIdx() {
    const answerImgUrl = localStorage.getItem(LocalStorageAnswerKey);
    const imgs = document.getElementsByTagName('img');
    for (let i = 0, len = imgs.length; i < len; i++) {
      if (imgs[i].getAttribute('src') === answerImgUrl) {
        return i;
      }
    }
  }

  function stage1_to_stage2() {
    const divs = document.getElementsByTagName('div');
    for (let i = 0, len = divs.length; i < len; i++) {
      if (divs[i].getAttribute('role') === 'button') {
        // 第一个
        divs[i].click();
        break;
      }
    }
  }

  // ------------ stage 2 --------------
  function findInput() {
    return document.querySelector('input.quantumWizTextinputPaperinputInput.exportInput');
  }

  function getWalletAddress() {
    // getAddressFromLocalStorage
    const list = JSON.parse(localStorage.getItem(LocalStorageAddressKey));
    const idx = list.findIndex((item) => !item.isComplete);
    list[idx].isComplete = true;
    localStorage.setItem(LocalStorageAddressKey, JSON.stringify(list));
    return list[idx].content;
  }

  function fillInput(input, content) {
    if (input && content) {
      input.value = content;
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('input', true, true);
      input.dispatchEvent(evt);
    }
  }

  function stage2_to_stage3() {
    const divs = document.getElementsByTagName('div');
    const list = [];
    for (let i = 0, len = divs.length; i < len; i++) {
      if (divs[i].getAttribute('role') === 'button') {
        list.push(i);
      }
    }

    if (isDebuggerMode) {
      console.log(divs[list[1]]);
    } else {
      divs[list[1]].click();
    }
  }

  // ------------ stage 3 --------------

  function start_1() {
    const labels = findLabels();
    const answerIdx = getAnswerIdx();

    const inputId = labels[answerIdx].getAttribute('for');
    const inputEl = document.getElementById(inputId);
    inputEl.click();

    setTimeout(() => {
      stage1_to_stage2();
    }, 500);
  }

  function start_2() {
    const input = findInput();
    fillInput(input, getWalletAddress());

    stage2_to_stage3();
  }

  function start_3() {
    // record success
    location.reload();
  }

  function start() {
    // 先判断是否有地址
    const answerUrl = localStorage.getItem(LocalStorageAnswerKey);
    if (!answerUrl) {
      // 没有记录正确答案
      alert('请先捕获正确答案');
      return;
    }
    const list = JSON.parse(localStorage.getItem(LocalStorageAddressKey));
    if (!Array.isArray(list) || list.length === 0) {
      // 没有数据
      alert('请先保存地址数据');
      return;
    }

    // 真正开始
    const stage = judgeCurrentStage();
    switch (stage) {
      case STAGE_1: {
        start_1();
        break;
      }
      case STAGE_2: {
        start_2();
        break;
      }
      case STAGE_3: {
        start_3();
        break;
      }
      default: {
        console.log('xxx');
      }
    }
  }

  waitFor(() => {
    return !!document.body;
  }, () => {
    injectUi();

    if (localStorage.getItem(LocalStorageStatusKey) === 'play') {
      setTimeout(() => {
        start();
      }, 1000);
    }
  })
})();
