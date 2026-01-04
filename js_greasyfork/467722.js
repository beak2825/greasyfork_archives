// ==UserScript==
// @name         GEEHelper
// @namespace    NJFU
// @version      0.2
// @description  This plugin can help developers leverage VScode's powerful code customization and prompt functions to synchronize code written in VScode with Google Earth engine.
// @author       FJC
// @match        https://code.earthengine.google.com/
// @icon         https://code.earthengine.google.com/images/bigicon.png
// @connect      localhost
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467722/GEEHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/467722/GEEHelper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  //清除行数，可自己定义
  var lineNumber = 5000;
  var fileName = null
  var web_server = 'http://localhost:8887'

  // 添加事件监听器，当用户选择文件时触发
  function inputListener(fileInput, span) {
    fileInput.addEventListener('change', function (event) {
      var file = event.target.files[0];
      fileName = file.name
      span.textContent = fileName
      span.style.opacity = '1'
      readFileContent(file)
      storeFileName(fileName)
    });
  }

  // 存储文件名
  function storeFileName(fileName) {
    localStorage.setItem('fileName', fileName);
  }

  // 读取文件名
  function getStoredFileName() {
    return localStorage.getItem('fileName');
  }

  function selectButton(selectFile, fileInput) {
    selectFile.addEventListener('click', function () {
      fileInput.click()
    })
  }

  function buttonListener(readFileButton) {
    readFileButton.addEventListener('click', function () {

      var storedFileName = getStoredFileName();
      fileName=storedFileName?storedFileName:fileName
      if (!fileName){
        alert('Please select a folder first!')
      }else{
        var url = web_server + '/' + fileName.toString()
      }

      GM_xmlhttpRequest({
        method: 'GET',
        url: url, // 替换为本地 JS 文件的 URL
        headers: { "Content-Type": "text/javascript,charset=utf-8" },
        onload: function (response) {
          var fileContent = response.responseText;
          processFileContent(fileContent)
        }
      });
    });
  }

  function readFileContent(file) {
    var reader = new FileReader();

    // 读取文件完成后的回调函数
    reader.onload = function (event) {
      var fileContent = event.target.result;
      // 去除末尾的空行
      fileContent = fileContent.replace(/\s+$/, '');

      processFileContent(fileContent)

    };

    // 读取文件内容
    reader.readAsText(file);
  }

  // 处理文件内容的函数
  function processFileContent(fileContent) {
    for (var i = 0; i <= lineNumber; i++) {
      unsafeWindow.editor.removeLines()
    }
    unsafeWindow.editor.insert(fileContent);
  }


  // 创建一个文件选择器的HTML元素
  function cssStyle() {

    if (unsafeWindow.editor) {
      var div = document.createElement('div');
      div.className = 'read-update'
      var fileInput = document.createElement('input');
      fileInput.type = 'file';
      var readFileButton = document.createElement('button');
      readFileButton.textContent = 'Update';
      readFileButton.classList.add('goog-button', 'update-button')
      var selectFile = document.createElement('button')
      selectFile.textContent = 'Select File'
      var span = document.createElement('span')

      var storedFileName = getStoredFileName();
      if (storedFileName) {
        // 如果有存储的文件名，则将其设置为文件输入元素的值
        span.textContent = storedFileName;
      } else {
        span.textContent = 'File Name'
      }


      var gm_style = document.querySelector('.gm-style')
      var run_button = document.querySelector('.run-button')
      var header_div = document.querySelector('.panel .header div')

      gm_style.appendChild(div)
      div.appendChild(fileInput);
      div.appendChild(selectFile);
      div.appendChild(span);
      header_div.insertBefore(readFileButton, run_button)

      div.style.position = 'absolute'
      div.style.zIndex = '9999999'
      div.style.top = '90px'
      div.style.right = '10px'
      div.style.display = 'flex'
      div.style.justifyContent = 'center'
      div.style.alignItems = 'center'
      fileInput.style.display = 'none'
      selectFile.style.width = '80px'
      selectFile.style.lineHeight = '20px'
      selectFile.style.backgroundColor = '#FFFFFF'
      selectFile.style.cursor = 'pointer'
      selectFile.style.border = '0'
      selectFile.style.borderRadius = '3px'
      span.style.display = 'inline-block'
      span.style.paddingLeft = '3px'
      span.style.overflow = 'hidden'
      span.style.marginLeft = '10px'
      span.style.textOverflow = 'ellipsis'
      span.style.borderRadius = '3px'
      span.style.width = '80px'
      span.style.lineHeight = '20px'
      span.style.border = '1px solid #EBEBEB'
      span.style.backgroundColor = '#FFFFFF'
      readFileButton.style.width = '55px'

      selectFile.onmouseenter = function () {
        selectFile.style.backgroundColor = '#EBEBEB'
      }
      selectFile.onmouseleave = function () {
        selectFile.style.backgroundColor = '#FFFFFF'
      }

      buttonListener(readFileButton)
      selectButton(selectFile, fileInput, span)
      inputListener(fileInput, span)
      return true
    }

  }

  var timer = setInterval(() => {
    var result = cssStyle()
    if (result) {
      clearInterval(timer);
    }
  }, 5000);
})();
