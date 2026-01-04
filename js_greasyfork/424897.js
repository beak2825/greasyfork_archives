// ==UserScript==
// @name         query-phoenix-ckv
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  helper for querying phoenix ckv data
// @author       Bruski
// @match        http://musicsrf.isd.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424897/query-phoenix-ckv.user.js
// @updateURL https://update.greasyfork.org/scripts/424897/query-phoenix-ckv.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var globalState = {
    show: true,
  };

  var conf = {
    bid: '101010167',
    modid: '529665',
    cmdid: '262144',
    key: 'AdPutInfo_${id}_1', // 默认查正式环境的投放
  };

  function findDOM(selector, options) {
    var doc = document;
    if (options && options.doc) {
      doc = options.doc;
    }
    if (options && options.delay) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          var result = null;
          result = doc.querySelector(selector);
          if (!result) {
            reject(null);
          } else {
            resolve(result);
          }
        }, options.delay);
      });
    }
    return doc.querySelector(selector);
  }

  function openCkvTabPage() {
    var ckvItem = findDOM('#_easyui_tree_15');
    if (ckvItem) {
      ckvItem.click();
    } else {
      findDOM('#_easyui_tree_15', { delay: 2000 }).then(function (ckvButton) {
        ckvButton.click();
      });
    }
  }

  function getCkvIframe() {
    return findDOM('iframe[src="tools/ckv.html"]');
  }

  function setForm(doc, value) {
    var bidInput = findDOM('#Fbid', { doc: doc });
    var modidInput = findDOM('#Fmodid', { doc: doc });
    var cmdidInput = findDOM('#Fcmdid', { doc: doc });
    var keyInput = findDOM('#Fkey', { doc: doc });

    bidInput.value = conf.bid;
    modidInput.value = conf.modid;
    cmdidInput.value = conf.cmdid;
    keyInput.value = value.type + '_' + value.id + '_' + value.env;
  }

  function clickGet(doc) {
    var getBtn = findDOM('button.w3-button.w3-black', { doc: doc });
    getBtn.click();
  }

  function handleSubmit(formData) {
    var value = {
      env: formData.get('env'),
      type: formData.get('type'),
      id: formData.get('id'),
    }

    var ckvIframe = getCkvIframe();
    if (!ckvIframe) {
      alert('请先打开CKV工具页面');
      return;
    }
    setForm(ckvIframe.contentWindow.document, value);
    clickGet(ckvIframe.contentWindow.document);
  }

  function handleClickActionBar() {
    globalState.show = !globalState.show;
    renderByShow();
  }

  function renderByShow() {
    var mainDom = findDOM('#phx-ckv-helper');
    var container = findDOM('#container');
    var existDom = findDOM('#action-bar');
    if (existDom) {
      existDom.removeEventListener('click', handleClickActionBar);
      container.removeChild(existDom);
      existDom = null;
    }

    // 主体样式切换
    if (globalState.show) {
      mainDom.classList.remove('wrapper--hide');
      mainDom.classList.add('wrapper--show');
    } else {
      mainDom.classList.remove('wrapper--show');
      mainDom.classList.add('wrapper--hide');
    }

    // actionbar切换
    var wrapper = document.createElement('div');
    wrapper.id = 'action-bar'
    wrapper.classList.add('action-bar');
    wrapper.addEventListener('click', handleClickActionBar);

    if (globalState.show) {
      wrapper.innerHTML = '<span>&gt;</span>'
      container.appendChild(wrapper);
    } else {
      wrapper.innerHTML = '<span>&lt;</span>'
      container.insertBefore(wrapper, container.firstChild);
    }
  }

  function renderHelper() {
    var wrapper = document.createElement('div');
    wrapper.id = 'phx-ckv-helper'
    wrapper.classList.add('wrapper');
    wrapper.innerHTML = `
<div id="container" class="flex-row" style="align-items: stretch;">
  <div id="main-panel" class="flex-column" style="flex: 1; padding: 24px 12px;">
    <h3 class="flex-row" style="margin: 0 0 8px;">
      凤凰CKV查询助手
      <img src="http://phoenix-stage.tmeoa.com/favicon.png" alt="logo" style="width: 16px"/>
    </h3>
    <form id="phx-query-ckv-form">
      <div class="flex-column">
        <div class="form-control">
          <label for="#phx-env">发布环境: </label>
          <select id="phx-env" name="env">
            <option value="1">正式</option>
            <option value="0">测试</option>
          </select>
        </div>
        <div class="form-control">
          <label for="#phx-type">查询类型: </label>
          <select id="phx-type" name="type">
          <option value="AdPutInfo">投放</option>
            <option value="AdPosInfo">资源位</option>
            <option value="AdContextInfo">资源内容</option>
          </select>
        </div>
        <div class="form-control">
          <label for="#phx-id">查询ID: </label>
          <input style="width:80px;" id="phx-id" name="id" required placeholder="请输入查询ID" />
        </div>
        <div class="form-control">
          <button id="phx-openCkv">打开CKV工具</button> |
          <button type="submit">查询</button>
        </div>
      </div>
    </form>
  </div>
</div>
`;
    return wrapper;
  }

  function appendFloatWindow(node) {
    if (findDOM('#phx-ckv-helper')) return;

    var wrapperStyle = document.createElement('style');
    var css = `
@keyframes slideIn {
  from {
    right: 0;
  }
  to {
    right: -224px;
  }
}
.wrapper {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  width: 240px;
  min-height: 100px;
  z-index: 999;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.wrapper--hide {
  animation: 0.5s ease-in forwards slideIn;
}
.wrapper--show {
  animation: 0.5s ease-in reverse forwards slideIn;
}
.flex-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.form-control + .form-control {
  margin-top: 8px;
}
.action-bar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20px;
  background: #eee;
  cursor: pointer;
}
.action-bar:hover {
  background: #ddd;
}
`;
    wrapperStyle.appendChild(document.createTextNode(css));
    document.head.appendChild(wrapperStyle);
    node.appendChild(renderHelper());
    renderByShow();  // 首次渲染，默认show为true
  }

  function main() {
    appendFloatWindow(document.body);

    var openCkvBtn = document.querySelector('#phx-openCkv');
    if (openCkvBtn) {
      openCkvBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openCkvTabPage();
      })
    }
    var form = document.querySelector('#phx-query-ckv-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        handleSubmit(new FormData(e.target));
      })
    }
  }

  main();
})();