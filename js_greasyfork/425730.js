// ==UserScript==
// @name         figma hack
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  export image base64
// @author       FE-Sakamoto
// @match        http*://www.figma.com/file/*
// @icon         https://www.google.com/s2/favicons?domain=figma.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425730/figma%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/425730/figma%20hack.meta.js
// ==/UserScript==
(function() {
  'use strict';
  let base64BtnWrapper = document.createElement('div');
  let base64Btn = document.createElement('button')
  base64Btn.innerText = 'base64'
  base64Btn.addEventListener('click', function(){
    // 缩放比选择器
    let scaleInputs = Array.apply(null, document.querySelectorAll('input[spellcheck="false"][autocomplete="new-password"][class^=raw_components--textInput]'))
    let scales = Array.from(new Set(scaleInputs.map(ele => ele.value)))
    if (scales.length) {
      const {selection} = figma.currentPage
      if (!selection[0]) {
        alert('请选择要处理的节点')
        return
      }

      Promise.all(scales.map(scale => {
        return selection[0].exportAsync({
          format: 'PNG',
          constraint: getConstraintByScale(scale)
        })
      })).then(u8List => {
        const base64List = u8List.map(u8 => u8ToBase64(u8))
        if (base64List.length === 1) {
          copyContent('data:image/png;base64,' + base64List[0])
        } else {
          let res = {}
          for (let i = 0; i < scales.length; i++) {
            res[scales[i]] = 'data:image/png;base64,' + base64List[i]
          }
          console.log(res, scales)
          copyContent(JSON.stringify(res, null, 2))
        }
      }).then(()=>{
        figma.notify('处理成功, 请查看剪切板')
      })
    }
  })
  base64BtnWrapper.appendChild(base64Btn)

  // 监听export 面板点击监听
  function addExportTabEventListener() {
    const node = document.querySelectorAll('[data-label=export]')[0]
    if (node) {
      node.addEventListener('click', function() {
        setTimeout(()=>{
          insertBase64Btn()
          addAddBtnEventListener()
        }, 100)
      })
    } else {
      setTimeout(()=>{
        addExportTabEventListener()
      }, 500)
    }
  }

  // 给+号按钮添加监听
  function addAddBtnEventListener() {
    document.querySelectorAll('span[aria-label^=Add]')[0]?.addEventListener('click', function(){
      setTimeout(()=>{
        insertBase64Btn()
      }, 100)
    })
  }

  function insertBase64Btn() {
    let exportBtn = document.querySelectorAll('button[class*=export_panel--exportButton]')[0]
    if (exportBtn) {
      !base64Btn.className && base64Btn.classList.add(...exportBtn.className.split(' '))
      !base64BtnWrapper.className && base64BtnWrapper.classList.add(...exportBtn.parentElement.className.split(' '))
      exportBtn.parentElement.parentElement.insertBefore(base64BtnWrapper, exportBtn.parentElement.nextSibling);
    }
  }

  function copyContent(text) {
    if (typeof navigator.clipboard == "undefined") {
      const textarea = window.document.querySelector("#copy-area");
      textarea.value = text;
      textarea.focus();
      textarea.select();
      const successful = window.document.execCommand("copy");
      if (successful) {
        parent.postMessage({ pluginMessage: { type: "success" } }, "*");
      } else {
        parent.postMessage({ pluginMessage: { type: "fail" } }, "*");
      }
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        parent.postMessage({ pluginMessage: { type: "success" } }, "*");
      },
      function (err) {
        parent.postMessage({ pluginMessage: { type: "fail" } }, "*");
      }
    );
  }

  function getConstraintByScale(scale) {
    if (scale === '0.5x') {
      return {
        type: 'SCALE',
        value: 0.5
      }
    } else if (scale === '0.75x') {
      return {
        type: 'SCALE',
        value: 0.75
      }
    } else if (scale === '1x') {
      return {
        type: 'SCALE',
        value: 1
      }
    } else if (scale === '1.5x') {
      return {
        type: 'SCALE',
        value: 1.5
      }
    } else if (scale === '2x') {
      return {
        type: 'SCALE',
        value: 2
      }
    } else if (scale === '3x') {
      return {
        type: 'SCALE',
        value: 3
      }
    } else if (scale === '4x') {
      return {
        type: 'SCALE',
        value: 4
      }
    } else if (scale === '512w') {
      return {
        type: 'WIDTH',
        value: 512
      }
    } else if (scale === '512h') {
      return {
        type: 'HEIGHT',
        value: 512
      }
    }
  }

  function u8ToBase64(u8) {
    let binary = ''
    for (let i = 0; i < u8.length; i++) {
      binary += String.fromCharCode(u8[i])
    }
    return window.btoa(binary)
  }

  addExportTabEventListener()
})();
