// ==UserScript==
// @name         Axure枚举获取小工具
// @namespace    yixiaoping
// @version      1.0.3
// @license      MIT
// @description  通过获取Axure原型里面的下拉选择获取枚举类型
// @grant        GM_addStyle
// @match        https://*.lanhuapp.com/*
// @match        https://axure-file.lanhuapp.com/*
// @require      https://cdn.jsdelivr.net/npm/@textea/json-viewer@3.0.0
// @downloadURL https://update.greasyfork.org/scripts/465913/Axure%E6%9E%9A%E4%B8%BE%E8%8E%B7%E5%8F%96%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/465913/Axure%E6%9E%9A%E4%B8%BE%E8%8E%B7%E5%8F%96%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // create a div element to hold the user input form
  const formDiv = document.createElement('div');
  formDiv.innerHTML = `
    <div id="header" style="position: fixed;top: 10px;right: 10px;background: #fff;padding: 10px;border: 1px solid #ddd;border-radius: 6px;">
      <div style="border-bottom: 1px solid #eaeaea; margin-bottom: 10px;padding-bottom: 10px;display: flex;justify-content: space-between;">
        <button id="selectAll" style="background-color: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;display:none;">获取所有</button>
        <button id="togglePanel" style="background-color: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; float: right;"><span id="toggleIcon">
           <i class="fa fa-chevron-down"></i>
        </span></button>
      </div>
      <div id="panel" style="display: none;">
        <form>
          <label for="inputField">捕获的标签class名称:</label>
          <input type="text" id="inputField" name="inputField" style="margin-right: 5px; padding: 5px; border: 1px solid #ccc; border-radius: 5px;">
          <button type="submit" style="background-color: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">获取</button>
        </form>
        <div style="border-top: 1px solid #eaeaea; margin-top: 10px;height: 300px;overflow-y: auto;padding-top: 10px;">
          <div id="json-viewer"></div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(formDiv);

  // add a submit event listener to the form
  const form = formDiv.querySelector('form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const input = document.getElementById('inputField');
    const userInput = input.value;

    // get all elements with the class name specified by the user input
    const elements = document.querySelectorAll(`.${userInput}`);
    const arrEnum = [];
    // loop through the elements and add their values to the output div
    elements.forEach((element) => {
      const value = element.value;
      arrEnum.push(value);
    });
    new JsonViewer({
      value: arrEnum,
    }).render();
  });

  const selectAll = document.getElementById('selectAll');
  selectAll.addEventListener('click', function (event) {
    event.preventDefault();
    gengerAll();
  });

  const togglePanel = document.getElementById('togglePanel');
  const panel = document.getElementById('panel');
  const toggleIcon = document.getElementById('toggleIcon');
  togglePanel.addEventListener('click', function (event) {
    event.preventDefault();
    if (panel.style.display === 'none') {
      panel.style.display = 'block';
      toggleIcon.innerHTML = '<i class="fa fa-chevron-up"></i>';
      selectAll.style.display = 'block';
    } else {
      panel.style.display = 'none';
      toggleIcon.innerHTML = '<i class="fa fa-chevron-down"></i>';
      selectAll.style.display = 'none';
    }
  });

  // 获取所有select并生成枚举
  function gengerAll() {
    const allSelect = document.querySelectorAll('select');
    console.log(allSelect,'allSelect---')
    const arrEnum = [];
    // loop through the elements and add their values to the output div
    allSelect.forEach((element) => {
      const options = element.options;
      const _options = [];
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        _options.push(option.value);
      }
      arrEnum.push(_options);
    });
    // 获取所有checkbox
    const allCheckbox = document.querySelectorAll('.checkbox');
    const checkboxEnum = [];
  // allCheckbox.forEach((element) => {
  //   const parentNode = element.parentNode;

  //   const _options = [];
  //   parentNode.querySelectorAll('.text').forEach((item) => {
  //     const text = item.querySelector('span').textContent;
  //     _options.push(text);
  //   });
  //   checkboxEnum.push(_options);
  // });

    // 去重
    let checkboxObj = {};
    checkboxEnum.forEach((item) => (checkboxObj[item] = item));

    new JsonViewer({
      value: [...arrEnum, Object.values(checkboxObj)]
    }).render();
  }

  // load Font Awesome icons
  const fontAwesomeScript = document.createElement('script');
  fontAwesomeScript.src = 'https://kit.fontawesome.com/8b1fa9f7e1.js';
  fontAwesomeScript.crossOrigin = 'anonymous';
  document.head.appendChild(fontAwesomeScript);

  // load JsonViewer script
  const jsonViewerScript = document.createElement('script');
  jsonViewerScript.src = 'https://cdn.jsdelivr.net/npm/json-viewer@2.11.0/dist/json-viewer.min.js';
  jsonViewerScript.crossOrigin = 'anonymous';
  document.head.appendChild(jsonViewerScript);
})();