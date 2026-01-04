// ==UserScript==
// @license      GPL License
// @name         请求mock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  mock请求
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @require
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/454461/%E8%AF%B7%E6%B1%82mock.user.js
// @updateURL https://update.greasyfork.org/scripts/454461/%E8%AF%B7%E6%B1%82mock.meta.js
// ==/UserScript==

(function () {
  startMockOnreadystatechange();
  document.addEventListener('DOMContentLoaded', function () {
    addClass();
    createInitButton();
    createModal();
    createToast();
  });

  function addClass() {
    const style = document.createElement('style');
    style.innerHTML = `
      .m_modal {
        display: none;
        background: #fff;
        width: 800px;
        height: 600px;
        border: 1px solid #ccc;
        border-radius: 2px;
        flex-direction: column;
        position: fixed;
        left: 50%;
        top: 50%;
        box-shadow: 0px 0px 10px #bcc;
        transform: translate(-50%, -55%);
        z-index: 9999;
      }
      .m_div {
        padding: 10px 16px;
      }
      .m_headRow {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #eee;
      }
      .m_button {
        cursor: pointer;
        height: 30px;
        min-width: 60px;
        background: #fff;
        color: #1890ff;
        border: 1px solid #1890ff;
        border-radius: 4px;
        margin-left: 5px;
      }
      .m_toast {
        position: fixed;
        top: 20px;
        left: 50%;
        font-size: 14px;
        color: #fff;
        background: #000b;
        padding: 6px 10px;
        transform: translate(-50%, -100px);
        border-radius: 2px;
        transition: transform 0.25s ease 0s;
        z-index: 9999;
      }
      .m_svg {
        margin-right: 10px;
        cursor: pointer;
        font-size: 12px;
        transition: transform 0.25s;
      }
      .m_label {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: #444;
        font-size: 14px;
        width: 100px;
        text-align: right;
      }
      .m_url {
        display: flex;
        align-items: flex-end;
        padding: 10px 0;
      }
      .m_url .m_input {
        border: none;
        border-bottom: 1px solid #ccc;
        flex: 1;
        margin-right: 10px;
      }
      .m_url .m_input:focus {
        outline: none;
      }
      .m_data {
        display: flex;
        align-items: center;
        overflow: hidden;
        height: 0px;
        transition: height 0.4s;
      }
      .m_data textarea {
        border: none;
        border-radius: 5px;
        background-color: rgba(241,241,241,.98);
        flex: 1;
        height: 150px;
        padding: 10px;
        resize: none;
        margin-right: 10px;
      }
      .m_data textarea:focus {
        outline: none;
      }
      .m_switch {
        font-size: 30px;
        position: relative;
        display: inline-block;
        width: 1em;
        height: 0.5em;
      }
      .m_switch input {
        display:none;
      }
      .m_switch .m_slider {
        border-radius: 0.25em;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background-color: #ccc;
        transition: transform 0.25s;
      }
      .m_switch .m_slider:before {
        border-radius: 50%;
        position: absolute;
        content: "";
        height: 0.36em;
        width: 0.36em;
        left: 0.07em;
        bottom: 0.07em;
        background-color: white;
        transition: all, .4s;
      }
      input:checked + .m_slider {
        background-color: #2196F3;
      }

      input:checked + .m_slider:before {
        transform: translateX(0.5em);
      }
   `;
    document.head.append(style);
  }

  function createInitButton() {
    const div = document.createElement('div');
    div.innerHTML = 'M';
    div.style.cssText = `
      cursor: pointer;
      user-select: none;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      background-color: #22bb6d;
      border-radius: 50%;
      box-shadow: 0px 0px 6px #858585;
      position: fixed;
      left: -15px;
      top: 10px;
      z-index: 9999;
    `;
    div.style.transition = 'transform 0.25s ease 0s';
    div.onmouseover = function () {
      div.style.transform = 'translateX(20px)';
    };
    div.onmouseleave = function () {
      div.style.transform = 'translateX(0px)';
    };
    div.ondrag = function () {
      console.log('start');
    };
    div.onclick = function () {
      document.querySelector('.m_modal').style.display = 'flex';
    };
    document.body.appendChild(div);
  }

  function createModal() {
    let sectionIndex = 0;
    function getSection(inputVal = '', textareaVal = '', checkedVal = false, wrapper) {
      sectionIndex++;
      const checkbox = checkedVal
        ? `<input type="checkbox" class="m_checkbox" checked />`
        : `<input type="checkbox" class="m_checkbox" />`;
      const child = `
        <div class="m_url">
          <span class="m_label">
            <svg id="m_svg${sectionIndex}" onclick="m_clickSvg(${sectionIndex})" class="m_svg" viewBox="64 64 896 896" focusable="false" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true" style=""><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path></svg>
            URL：
          </span>
          <input class="m_input" value="${inputVal}" />
          <label class="m_switch">
            ${checkbox}
            <div class="m_slider"></div>
          </label>
          <span onclick="m_buttonRemove(${sectionIndex})" style="cursor: pointer; font-size: 12px; color: #1890ff; margin-left: 10px">
            删除
          </span>
        </div>
        <div id="m_data${sectionIndex}" class="m_data">
          <span class="m_label">mock数据：</span>
          <textarea>${textareaVal}</textarea>
        </div>
      `;
      return wrapper ? `<section>${child}</section>` : child;
    }

    // 拼sections
    const localDataStr = localStorage.getItem('m_mock_data');
    const localData = JSON.parse(localDataStr);
    const sectionsDom = localData?.map(item => getSection(item.url, item.data, item.checked, true)).join('') ?? '';
    // 按钮事件
    unsafeWindow.m_buttonRemove = function (sectionIndex) {
      const dataDiv = document.querySelector('#m_data' + sectionIndex);
      const section = dataDiv.parentElement;
      section.parentElement.removeChild(section);
    }
    unsafeWindow.m_clickSvg = function (index) {
      const svg = document.querySelector('#m_svg' + index);
      const dataDiv = document.querySelector('#m_data' + index);
      if (svg.style.transform === 'rotate(0deg)' || svg.style.transform === '') {
        svg.style.transform = 'rotate(90deg)';
        dataDiv.style.height = '200px';
      } else {
        svg.style.transform = 'rotate(0deg)';
        dataDiv.style.height = '0';
      }
    }
    unsafeWindow.m_buttonFormat = function () {
      const textareas = document.querySelectorAll('textarea');
      for (let i = 0; i < textareas.length; i++) {
        const data = textareas[i].value;
        try {
          const formattedData = JSON.stringify(JSON.parse(data), null, 2);
          textareas[i].value = formattedData;
        } catch (e) {
          if (e instanceof SyntaxError) {
            toast(`第${i + 1}个JSON格式错误，无法格式化`);
          }
          console.error(e);
        }
      }
    }
    unsafeWindow.m_buttonAdd = function () {
      const sections = document.querySelector('#sections');
      const newSection = document.createElement('section');
      newSection.innerHTML = getSection();
      sections.append(newSection);
      m_clickSvg(sectionIndex);
    }
    unsafeWindow.m_buttonCancel = function () {
      document.querySelector('.m_modal').style.display = 'none';
    };
    unsafeWindow.m_buttonConfirm = function () {
      const rows = document.querySelectorAll('#sections section');
      const params = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const url = row.querySelector('.m_input').value;
        if (url.trim() === '') {
          toast('URL不能为空');
          return;
        }
        const checked = row.querySelector('.m_checkbox').checked;
        const data = row.querySelector('textarea').value;
        params.push({ url, checked, data });
      }
      localStorage.setItem('m_mock_data', JSON.stringify(params));
      toast('修改成功，请刷新页面');
      unsafeWindow.m_buttonCancel();
    };
    // modal
    const div = document.createElement('div');
    div.className = 'm_modal';
    div.innerHTML = `
      <div class="m_div m_headRow">
        <span style="flex: 1">Mock接口</span>
        <svg onclick="m_buttonCancel()" style="cursor: pointer; font-size: 14px;" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
      </div>
      <div class="m_div" style="flex: 1; overflow-y: scroll">
        <div id="sections">
          ${sectionsDom}
        </div>
        <div class="m_div">
          <button class="m_button" onclick="m_buttonFormat()">格式化</button>
          <button class="m_button" onclick="m_buttonAdd()">添加</button>
        </div>
      </div>
      <div id="buttonRow" class="m_div" style="text-align: right; border-top: 1px solid #eee">
        <button class="m_button" onclick="m_buttonCancel()">取消</button>
        <button class="m_button" onclick="m_buttonConfirm()" style="background: #1890ff; color: #fff">确定</button>
      </div>
    `;
    document.body.appendChild(div);
  }

  function createToast() {
    const div = document.createElement('div');
    div.className = 'm_toast';
    div.id = 'toast';
    div.innerHTML = '12345';
    document.body.appendChild(div);
  }

  function toast(text) {
    const toast = document.querySelector('#toast');
    toast.innerHTML = text;
    toast.style.transform = 'translate(-50%, 0)';
    setTimeout(() => {
      toast.style.transform = 'translate(-50%, -100px)';
    }, 2000);
  }

  function startMockOnreadystatechange() {
    const localDataStr = localStorage.getItem('m_mock_data');
    const localData = JSON.parse(localDataStr);
    const originOpen = XMLHttpRequest.prototype.open;
    const setWriteKeys = ['status', 'statusText', 'response', 'responseText', 'readyState'];
    XMLHttpRequest.prototype.open = function (_, url) {
      originOpen.apply(this, arguments);
      const find = localData?.find(item => url.includes(item.url));
      if (find && find.checked) {
        // 把这堆属性改为可写
        setWriteKeys.forEach(key => {
          const props = Object.getOwnPropertyDescriptor(this, key);
          Object.defineProperty(this, key, {
            ...props,
            writable: true
          });
        });
        setTimeout(() => {
          // 手动改变响应状态和值
          this.status = 200;
          this.readyState = 4; // 原生xhr中该值改变，会触发onreadystatechange方法
          this.statusText = 'OK';
          this.response = find.data;
          this.responseText = find.data;
          // 手动触发会onreadystatechange方法
          this.dispatchEvent(new Event('readystatechange'));
        });
      }
    };
  }
})();