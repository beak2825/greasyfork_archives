// ==UserScript==
// @name         ChatGPT-input-helper
// @name:zh-TW   ChatGPT-input-helper 快速輸入常用咒文
// @namespace    https://github.com/we684123/ChatGPT-input-helper
// @version      0.0.13
// @author       we684123
// @description  Help organize commonly used spells quickly
// @description:zh-TW  幫助快速組織常用咒文
// @license      MIT
// @icon         https://chat.openai.com/favicon.ico
// @match        https://chat.openai.com/chat
// @match        https://chat.openai.com/chat/*
// @match        https://chat.openai.com/chat?*
// @match        https://chat.openai.com/?model=*
// @match        https://chat.openai.com/c/*
// @match        https://chat.openai.com/
// @match        https://chatgpt.com/c/*
// @match        https://chatgpt.com/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/460991/ChatGPT-input-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/460991/ChatGPT-input-helper.meta.js
// ==/UserScript==

(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  const sentinel = (() => {
      const isArray = Array.isArray;
      let selectorToAnimationMap = {};
      let animationCallbacks = {};
      let styleEl;
      let styleSheet;
      let cssRules;
      return {
          // `on` 方法用於添加 CSS 選擇器的監聽器。
          // cssSelectors: 一個字符串或字符串數組，包含要監聽的 CSS 選擇器。
          // callback: 用於處理觸發的事件的回調函數。
          on: function (cssSelectors, callback) {
              // 如果沒有提供回調函數，則直接返回。
              if (!callback)
                  return;
              // 如果 `styleEl` 未定義，創建一個新的 `style` 標籤並將其添加到文檔的 `head` 中。
              // 還會為 `animationstart` 事件添加事件監聽器。
              if (!styleEl) {
                  const doc = document;
                  const head = doc.head;
                  doc.addEventListener("animationstart", function (ev) {
                      const callbacks = animationCallbacks[ev.animationName];
                      if (!callbacks)
                          return;
                      ev.stopImmediatePropagation();
                      for (const cb of callbacks) {
                          cb(ev.target);
                      }
                  }, true);
                  styleEl = doc.createElement("style");
                  // head.insertBefore(styleEl, head.firstChild); // 這個是原版的，改用下面的
                  head.append(styleEl); // 感謝 chatgpt-exporter 搞好久 (┬┬﹏┬┬)
                  styleSheet = styleEl.sheet;
                  cssRules = styleSheet.cssRules;
              }
              // 根據提供的選擇器創建一個新的動畫。
              const selectors = isArray(cssSelectors) ? cssSelectors : [cssSelectors];
              selectors.forEach((selector) => {
                  // 獲取或創建動畫 ID。
                  let animIds = selectorToAnimationMap[selector];
                  if (!animIds) {
                      const isCustomName = selector[0] == "!";
                      const animId = isCustomName
                          ? selector.slice(1)
                          : "sentinel-" + Math.random().toString(16).slice(2);
                      // 創建新的 keyframes 規則。
                      const keyframeRule = cssRules[styleSheet.insertRule("@keyframes " +
                          animId +
                          "{from{transform:none;}to{transform:none;}}", cssRules.length)];
                      keyframeRule._id = selector;
                      // 如果選擇器不是自定義名稱，則為其創建對應的CSS 規則。
                      if (!isCustomName) {
                          const selectorRule = cssRules[styleSheet.insertRule(selector + "{animation-duration:0.0001s;animation-name:" + animId + ";}", cssRules.length)];
                          selectorRule._id = selector;
                      }
                      animIds = [animId];
                      selectorToAnimationMap[selector] = animIds;
                  }
                  // 遍歷動畫 ID，將回調函數添加到動畫回調列表中。
                  animIds.forEach((animId) => {
                      animationCallbacks[animId] = animationCallbacks[animId] || [];
                      animationCallbacks[animId].push(callback);
                  });
              });
          },
          // `off` 方法用於移除 CSS 選擇器的監聽器。
          // cssSelectors: 一個字符串或字符串數組，包含要停止監聽的 CSS 選擇器。
          // callback: 可選的回調函數。如果提供，則僅移除與之匹配的監聽器。
          off: function (cssSelectors, callback) {
              // 將提供的選擇器轉換為數組形式。
              const selectors = isArray(cssSelectors) ? cssSelectors : [cssSelectors];
              // 遍歷選擇器，移除對應的監聽器。
              selectors.forEach((selector) => {
                  const animIds = selectorToAnimationMap[selector];
                  if (!animIds)
                      return;
                  animIds.forEach((animId) => {
                      const callbacks = animationCallbacks[animId];
                      if (!callbacks)
                          return;
                      // 如果提供了回調函數，則僅移除與之匹配的監聽器。
                      if (callback) {
                          const index = callbacks.indexOf(callback);
                          if (index !== -1) {
                              callbacks.splice(index, 1);
                          }
                      }
                      else {
                          delete animationCallbacks[animId];
                      }
                      // 如果該選擇器沒有任何回調函數，則從選擇器映射和 CSS 規則中移除它。
                      if (callbacks.length === 0) {
                          delete selectorToAnimationMap[selector];
                          const rulesToDelete = [];
                          for (let i = 0, len = cssRules.length; i < len; i++) {
                              const rule = cssRules[i];
                              if (rule._id === selector) {
                                  rulesToDelete.push(rule);
                              }
                          }
                          rulesToDelete.forEach((rule) => {
                              const index = Array.prototype.indexOf.call(cssRules, rule);
                              if (index !== -1) {
                                  styleSheet.deleteRule(index);
                              }
                          });
                      }
                  });
              });
          }
      };
  })();

  function onloadSafe(fn) {
      if (document.readyState === "complete") {
          fn();
      }
      else {
          window.addEventListener("load", fn);
      }
  }

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z$2 = ".buttonStyles-module_container__l-r9Y{align-items:center;border:1px solid #fff;border-radius:5px;box-sizing:border-box;display:flex;justify-content:center;position:relative;width:100%}.buttonStyles-module_mainButton__b08pW{border:1px solid #fff;border-radius:5px;margin:0 auto;padding:8px 12px;width:85%}.buttonStyles-module_mainButton__b08pW,.buttonStyles-module_settingButton__-opQi{background-color:#202123;box-sizing:border-box;color:#fff;cursor:pointer;font-size:14px}.buttonStyles-module_settingButton__-opQi{border:none;border-radius:5px;padding:8px 14px;width:15%}.buttonStyles-module_menu__aeYDY{background-color:#202123;border:1px solid #fff;border-radius:15px;display:none;left:14%;max-height:240px;overflow-y:auto;position:absolute;top:0;width:100%;z-index:9999}.buttonStyles-module_menuButton__eg9D8{background-color:#202123;border:1px solid #fff;border-radius:5px;color:#fff;cursor:pointer;display:block;font-size:14px;height:100%;padding:8px 12px;width:100%}.buttonStyles-module_containerNode_class__1rDgQ{position:relative}";
  var styles$2 = {"container":"buttonStyles-module_container__l-r9Y","mainButton":"buttonStyles-module_mainButton__b08pW","settingButton":"buttonStyles-module_settingButton__-opQi","menu":"buttonStyles-module_menu__aeYDY","menuButton":"buttonStyles-module_menuButton__eg9D8","containerNode_class":"buttonStyles-module_containerNode_class__1rDgQ"};
  styleInject(css_248z$2);

  // library.ts
  const config = {
      name: "aims-helper",
      init_customize: [
          {
              name: '繁體中文初始化',
              position: 'start',
              autoEnter: true,
              content: [
                  `以下問答請使用繁體中文，並使用台灣用語。\n`,
              ].join("")
          }, {
              name: '請繼續',
              position: 'start',
              autoEnter: true,
              content: [
                  `請繼續`,
              ].join("")
          }, {
              name: '請從""繼續',
              position: 'start',
              autoEnter: false,
              content: [
                  `請從""繼續`,
              ].join("")
          }
      ],
      // ↓ 左邊選單的定位(上層)
      NAV_MENU: 'nav > div.overflow-y-auto',
      // ↓ 輸入框的定位
      TEXT_INPUTBOX_POSITION: 'textarea.m-0',
      // ↓ 送出按鈕的定位
      SUBMIT_BUTTON_POSITION: 'button.absolute',
      // ↓ 選單按鈕
      MAIN_BUTTON_CLASS: 'main_button',
      // ↓ 控制按鈕
      SETTING_BUTTON_CLASS: 'setting_button',
      // ↓ 選單
      MENU_CLASS: 'main_menu',
      // ↓ 按鈕文字
      HELPER_MENU_TEXT: 'input helper',
      // ↓ 按鈕用容器
      CONTAINER_CLASS: 'helper_textcontainer',
      // ↓ 模擬輸入於輸入框的事件
      INPUT_EVENT: new Event('input', { bubbles: true }),
  };

  // 將自定義內容插入到輸入框中
  const insertCustomize = (customize, name) => {
      const textInputbox = document.querySelector(config.TEXT_INPUTBOX_POSITION);
      const item = customize.find((i) => i.name === name);
      if (item) {
          if (item.position === 'start') {
              textInputbox.value = item.content + textInputbox.value;
          }
          else {
              textInputbox.value += item.content;
          }
          textInputbox.dispatchEvent(config.INPUT_EVENT);
          textInputbox.focus();
          if (item.autoEnter) {
              setTimeout(() => {
                  const submitButton = document.querySelector(config.SUBMIT_BUTTON_POSITION);
                  submitButton.click();
              }, 100);
          }
      }
      else {
          console.error(`找不到名稱為 ${name} 的元素`);
      }
  };

  // 創造主按鈕
  const createMainButton = (buttonText) => {
      const mainButton = document.createElement("button");
      mainButton.innerText = buttonText;
      mainButton.classList.add(styles$2.mainButton);
      mainButton.style.width = "86%";
      return mainButton;
  };
  // 創造設定按鈕
  const createSettingButton = () => {
      const settingButton = document.createElement("button");
      settingButton.innerText = "⚙️";
      settingButton.classList.add(styles$2.settingButton);
      settingButton.style.width = "14%";
      settingButton.id = "settingButton";
      return settingButton;
  };
  // 創造選項
  const createMenuItem = (element, customize) => {
      const menuItem = document.createElement("button");
      menuItem.innerText = element.name;
      menuItem.id = element.name;
      menuItem.classList.add(styles$2.menuButton);
      menuItem.addEventListener("click", (event) => {
          insertCustomize(customize, event.target.id);
      });
      return menuItem;
  };
  // 創造選單(包含多個選項)
  const createMenu = (containerNode, customize) => {
      // 創造選單
      const menu = document.createElement("div");
      menu.id = "helper_menu";
      menu.classList.add(styles$2.menu);
      menu.style.display = "none";
      menu.style.width = `${containerNode.offsetWidth / 100 * 86}px`;
      // 創造選項
      customize.forEach((element) => {
          const menuItem = createMenuItem(element, customize);
          menu.appendChild(menuItem);
      });
      // 設定選單的高度
      const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      const customizeUnitHeight = 39;
      const menuMaxHeight = windowHeight - customizeUnitHeight * 2;
      const MaxCustomizeLen = Number(menuMaxHeight / customizeUnitHeight);
      let customizeLen = customize.length > MaxCustomizeLen ? MaxCustomizeLen : customize.length;
      console.log(`customize.length = ${customize.length}`);
      console.log(`CustomizeLen = ${customizeLen}`);
      console.log(`menuMaxHeight = ${menuMaxHeight}`);
      if (customizeLen > 2) {
          let offset = (customizeLen - 2) * customizeUnitHeight;
          menu.style.top = `-${offset}px`;
          console.log(`offset = ${offset}`);
      }
      // 設定選單最大高度
      menu.style.maxHeight = `${menuMaxHeight}px`;
      return menu;
  };

  const bindElementContainer = (elements, containerClass) => {
      const container = document.createElement("div");
      if (containerClass) {
          container.classList.add(containerClass);
      }
      elements.forEach((element) => {
          container.appendChild(element);
      });
      return container;
  };

  // addMenuBtn 函數用於新增包含主按鈕和設定按鈕的選單按鈕
  function addMenuBtnWrapper(containerNode, customize, buttonText = "Click Me" // 主按鈕的文字，預設值為 "Click Me"
  ) {
      // 創建主按鈕和設定按鈕
      const mainButton = createMainButton(buttonText);
      const settingButton = createSettingButton();
      // 將主按鈕和設定按鈕組合在一個容器中
      const assButton = bindElementContainer([settingButton, mainButton], config.CONTAINER_CLASS);
      // 根據客製化選單項目創建選單
      const menu = createMenu(containerNode, customize);
      // 當滑鼠移到按鈕上時，顯示選單
      assButton.addEventListener("mouseenter", () => {
          menu.style.display = "block";
      });
      // 創建按鈕包裹器，並將組合按鈕和選單加入其中
      const buttonWrapper = document.createElement("div");
      buttonWrapper.style.width = `${containerNode.offsetWidth}px`;
      buttonWrapper.appendChild(assButton);
      buttonWrapper.appendChild(menu);
      // 將按鈕包裹器加入到容器節點中
      containerNode.appendChild(buttonWrapper);
      // 當滑鼠離開按鈕包裹器時，隱藏選單
      buttonWrapper.addEventListener("mouseleave", () => {
          setTimeout(() => {
              menu.style.display = "none";
          }, 300);
      });
      console.log("已新增按鈕");
  }

  var css_248z$1 = ".formPopupStyles-module_form-popup__cpX-x{background-color:#40414f;border:1px solid #000;height:60%;left:50%;max-height:1200px;max-width:800px;padding:30px;position:fixed;top:50%;transform:translate(-50%,-50%);width:80%;z-index:9999}.formPopupStyles-module_form__A8xi3{display:flex;flex-direction:column;gap:15px}.formPopupStyles-module_form-row__sMrG8{display:flex;flex-direction:column;gap:5px}.formPopupStyles-module_input__f-v3V{background-color:#545766;border:1px solid #fff;color:#fff;margin-left:4px;padding:4px 8px}textarea.formPopupStyles-module_input__f-v3V{min-height:100px;width:100%}";
  var styles$1 = {"form-popup":"formPopupStyles-module_form-popup__cpX-x","form":"formPopupStyles-module_form__A8xi3","form-row":"formPopupStyles-module_form-row__sMrG8","input":"formPopupStyles-module_input__f-v3V"};
  styleInject(css_248z$1);

  // createFormPopup.ts
  function createFormPopup(options) {
      // 創建彈出視窗
      const formPopup = document.createElement('div');
      formPopup.className = styles$1['form-popup'];
      // 創建標題
      const titleLabel = document.createElement('h2');
      titleLabel.textContent = options.title;
      formPopup.appendChild(titleLabel);
      // 創建表單
      const form = document.createElement('form');
      formPopup.appendChild(form);
      form.className = styles$1.form;
      // 創建名稱輸入框
      const nameLabel = document.createElement('label');
      nameLabel.textContent = '名稱(name)';
      form.appendChild(nameLabel);
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.className = styles$1.input;
      form.appendChild(nameInput);
      // 創建位置選擇
      const positionLabel = document.createElement('label');
      positionLabel.textContent = '位置(position)';
      form.appendChild(positionLabel);
      const positionSelect = document.createElement('select');
      positionSelect.className = styles$1.input;
      const positionStartOption = document.createElement('option');
      positionStartOption.value = 'start';
      positionStartOption.textContent = 'start';
      const positionEndOption = document.createElement('option');
      positionEndOption.value = 'end';
      positionEndOption.textContent = 'end';
      positionSelect.appendChild(positionStartOption);
      positionSelect.appendChild(positionEndOption);
      form.appendChild(positionSelect);
      // 創建是否自動輸入選擇
      const autoEnterLabel = document.createElement('label');
      autoEnterLabel.textContent = '是否自動輸入(AutoEnter)';
      form.appendChild(autoEnterLabel);
      const autoEnterInput = document.createElement('input');
      autoEnterInput.type = 'checkbox';
      form.appendChild(autoEnterInput);
      // 創建內容輸入框
      const contentLabel = document.createElement('label');
      contentLabel.textContent = '內容(content)';
      form.appendChild(contentLabel);
      const contentTextarea = document.createElement('textarea');
      contentTextarea.className = `${styles$1.input} ${styles$1['textarea-input']}`;
      form.appendChild(contentTextarea);
      // 創建提交按鈕
      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.textContent = '提交';
      form.appendChild(submitButton);
      // 根據編輯模式，填充初始值
      if (options.mode === 'edit' && options.initialValues) {
          nameInput.value = options.initialValues.name;
          positionSelect.value = options.initialValues.position;
          autoEnterInput.checked = options.initialValues.autoEnter;
          contentTextarea.value = options.initialValues.content;
      }
      // 提交表單時的處理
      form.addEventListener('submit', (event) => {
          event.preventDefault();
          const values = {
              name: nameInput.value,
              position: positionSelect.value,
              autoEnter: autoEnterInput.checked,
              content: contentTextarea.value,
          };
          console.log('values', values);
          options.onSubmit(values);
          document.body.removeChild(formPopup);
      });
      // 點擊彈窗外的地方關閉彈窗
      formPopup.addEventListener('click', (event) => {
          if (event.target === formPopup) {
              document.body.removeChild(formPopup);
          }
      });
      // 將彈出視窗加入頁面中
      document.body.appendChild(formPopup);
  }

  var css_248z = ".setCustomizeBtn-module_popup__uF6hF{background:#525467;border:1px solid #000;height:80%;left:50%;max-height:1200px;max-width:800px;padding:30px;position:fixed;top:50%;transform:translate(-50%,-50%);width:80%;z-index:9999}.setCustomizeBtn-module_add-button__IASCv,.setCustomizeBtn-module_delete-button__8I8BH,.setCustomizeBtn-module_edit-button__NqnT6{border:2px solid #fff;margin:10px}.setCustomizeBtn-module_close-button__uw4Q6{position:absolute;right:5px;top:5px}.setCustomizeBtn-module_table-wrapper__LY27P{margin-bottom:20px;max-height:612px;overflow-y:auto}";
  var styles = {"popup":"setCustomizeBtn-module_popup__uF6hF","add-button":"setCustomizeBtn-module_add-button__IASCv","edit-button":"setCustomizeBtn-module_edit-button__NqnT6","delete-button":"setCustomizeBtn-module_delete-button__8I8BH","close-button":"setCustomizeBtn-module_close-button__uw4Q6","table-wrapper":"setCustomizeBtn-module_table-wrapper__LY27P"};
  styleInject(css_248z);

  function setCustomizeBtn(customize) {
      // 找到 settingButton 元素
      const settingButton = document.getElementById('settingButton');
      // 當點擊 settingButton 時觸發事件
      settingButton.addEventListener('click', () => {
          // 創建彈出視窗
          const popup = document.createElement('div');
          popup.classList.add(styles.popup);
          // 創建新增按鈕
          const addButton = document.createElement('button');
          addButton.textContent = '新增(add)';
          addButton.classList.add(styles['add-button']);
          // 當點擊 addButton 時觸發事件
          addButton.addEventListener('click', () => {
              // 使用 createFormPopup 函數
              createFormPopup({
                  title: '新增',
                  mode: 'add',
                  onSubmit: (values) => {
                      const newItem = {
                          name: values.name,
                          position: values.position,
                          autoEnter: values.autoEnter,
                          content: values.content,
                      };
                      customize.push(newItem);
                      renderTable();
                  },
              });
          });
          popup.appendChild(addButton);
          // 創建編輯按鈕
          const editButton = document.createElement('button');
          editButton.textContent = '編輯(edit)';
          editButton.classList.add(styles['edit-button']);
          editButton.addEventListener('click', () => {
              // 編輯一個 item
              const index = prompt('請輸入要編輯的編號(edit index)');
              if (index && Number(index) >= 1 && index <= customize.length) {
                  const item = customize[Number(index) - 1];
                  createFormPopup({
                      title: '編輯',
                      mode: 'edit',
                      initialValues: {
                          name: item.name,
                          position: item.position,
                          autoEnter: item.autoEnter,
                          content: item.content,
                      },
                      onSubmit: (newValues) => {
                          item.name = newValues.name;
                          item.position = newValues.position;
                          item.autoEnter = newValues.autoEnter;
                          item.content = newValues.content;
                          // 重新渲染表格
                          renderTable();
                      },
                  });
              }
              else {
                  alert('輸入的編號不合法');
              }
          });
          popup.appendChild(editButton);
          // 創建刪除按鈕
          const deleteButton = document.createElement('button');
          deleteButton.textContent = '刪除(delete)';
          deleteButton.classList.add(styles['delete-button']);
          deleteButton.addEventListener('click', () => {
              // 刪除一個 item
              const index = prompt('請輸入要刪除的編號(delete index)');
              if (index && Number(index) >= 1 && index <= customize.length) {
                  customize.splice(Number(index) - 1, 1);
                  renderTable();
              }
              else {
                  alert('輸入的編號不合法 (invalid index)');
              }
          });
          popup.appendChild(deleteButton);
          // 創建關閉按鈕
          const closeButton = document.createElement('button');
          closeButton.textContent = '儲存並離開(save&exit)';
          closeButton.classList.add(styles['close-button']);
          closeButton.addEventListener('click', () => {
              console.log(customize);
              // 儲存修改後的 customize 資料
              GM_setValue('customizeData', customize);
              // // 重寫一次 helper_menu
              // const helper_menu = document.getElementById('helper_menu');
              // const menu = createMenu(helper_menu);
              // helper_menu.replaceWith(menu);
              // 上面的做不出來
              // 所以只好重新整理頁面
              location.reload();
              document.body.removeChild(popup);
          });
          popup.appendChild(closeButton);
          // 創建表格
          const table = document.createElement('table');
          const tableWrapper = document.createElement('div');
          tableWrapper.classList.add(styles['table-wrapper']);
          tableWrapper.appendChild(table);
          popup.appendChild(tableWrapper);
          // 創建表頭
          const thead = document.createElement('thead');
          const tr = document.createElement('tr');
          const th1 = document.createElement('th');
          const th2 = document.createElement('th');
          const th3 = document.createElement('th');
          const th4 = document.createElement('th');
          const th5 = document.createElement('th');
          th1.textContent = '編號(index)';
          th2.textContent = '名稱(name)';
          th3.textContent = '位置(position)';
          th4.textContent = '自動輸入(autoEnter)？';
          th5.textContent = '內容(content)';
          tr.appendChild(th1);
          tr.appendChild(th2);
          tr.appendChild(th3);
          tr.appendChild(th4);
          tr.appendChild(th5);
          thead.appendChild(tr);
          table.appendChild(thead);
          // 創建表身
          const tbody = document.createElement('tbody');
          table.appendChild(tbody);
          // 渲染表格
          function renderTable() {
              // 先清空表格內容
              tbody.innerHTML = '';
              // 重新渲染表格
              customize.forEach((item, index) => {
                  const tr = document.createElement('tr');
                  const td1 = document.createElement('td');
                  const td2 = document.createElement('td');
                  const td3 = document.createElement('td');
                  const td4 = document.createElement('td');
                  const td5 = document.createElement('td');
                  td1.textContent = index + 1;
                  td2.textContent = item.name;
                  td3.textContent = item.position;
                  td4.textContent = item.autoEnter;
                  td5.textContent = item.content;
                  tr.appendChild(td1);
                  tr.appendChild(td2);
                  tr.appendChild(td3);
                  tr.appendChild(td4);
                  tr.appendChild(td5);
                  tbody.appendChild(tr);
              });
          }
          // 渲染初始表格
          renderTable();
          // 點擊彈窗外的地方關閉彈窗
          popup.addEventListener('click', (event) => {
              if (event.target === popup) {
                  document.body.removeChild(popup);
              }
          });
          // 將彈出視窗加入頁面中
          document.body.appendChild(popup);
      });
  }

  main();
  function main() {
      // 頁面載入完成後執行
      onloadSafe(() => {
          // 監聽 nav 元素
          console.log("=====監聽 nav 元素=====");
          // 定義常用咒文
          let customize;
          sentinel.on("nav", (nav) => {
              console.log("===== trigger sentinel.on nav =====");
              // 讀取 customize 設定
              let GM_customize = GM_getValue("customizeData", customize);
              // 如果 user 已經有設定了就用 user 的，沒有就用預設值
              if (GM_customize) {
                  customize = GM_customize;
              }
              else {
                  customize = config.init_customize;
                  GM_setValue("customizeData", customize);
              }
              //找不到就新增
              const container = document.getElementById("helper_menu");
              if (!container) {
                  // 獲得目標元素
                  const aimsNode = document.querySelector(config.NAV_MENU);
                  // 新增一個容器
                  const container = document.createElement("div");
                  container.classList.add(styles$2.containerNode_class);
                  container.id = "helper_menu";
                  if (aimsNode) {
                      // 設定 container 寬度為父元素寬度
                      container.style.width = `${aimsNode.offsetWidth}px`; // 設定 container 寬度為父元素寬度
                      // 將容器元素插入到目標元素後面
                      aimsNode.parentNode?.insertBefore(container, aimsNode.nextSibling);
                      // 新增一個按鈕元素
                      addMenuBtnWrapper(container, customize, config.HELPER_MENU_TEXT);
                      // 設定 "設定按鈕"的點擊事件
                      setCustomizeBtn(customize);
                  }
              }
          });
      });
  }

}));
