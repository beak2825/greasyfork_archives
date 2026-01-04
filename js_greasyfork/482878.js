// ==UserScript==
// @name         ChatPaper-Click
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  Jump to translation from any arxiv papaers!
// @author       ziuch
// @match        https://arxiv.org/abs/*
// @match        https://arxiv.org/pdf/*
// @match        *://*/*.pdf
// @exclude      https://chatpaper.click/*
// @icon         https://img.ziuch.top/i/2023/12/20/sdrlap-2.webp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482878/ChatPaper-Click.user.js
// @updateURL https://update.greasyfork.org/scripts/482878/ChatPaper-Click.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // Your code here...
  let base_url = 'https://chatpaper.click'
  if (window.top !== window.self) {
    return
  }
  function _appendCss(css, name) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.setAttribute("data-component", name);
    style.innerHTML = css;
    head.appendChild(style);

      // Create a new style element
      var style1 = document.createElement('style');
      style.type = 'text/css';

      // Define your keyframes and other CSS as a string
      var keyFrames = `
@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.125);
        opacity: 0.85;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}`;

      // Set the innerHTML of the style element to your CSS string
      style1.innerHTML = keyFrames;

      // Append the style element to the head of the document
      document.head.appendChild(style1);

  }
  function addStyle() {
    //debugger;
    let via_markdown_css = `.via-markdown-btn{display: inline-block; vertical-align: middle; height: 50px; width:50px; border: 1px solid transparent; padding: 0 18px; background-color: #009688; color: #fff; white-space: nowrap; text-align: center; font-size: 18px; border-radius: 2px; cursor: pointer; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;}.via-markdown-btn-sm{height: 20px; line-height: 20px; padding: 0 6px; font-size: 18px;}`;
    _appendCss(via_markdown_css, "btn");
  }
  //创建解析按钮
  function addAnalysisBtn() {
    var btn = document.createElement('button');
    btn.style = "top: 220px;left:8px; position: fixed;z-index:1000;cursor:pointer;background:rgba(112, 165, 151,0.9);height: 50px;wight:50px;border-radius: 50%; animation: pulse 2s infinite;font-size: 16px;"
    btn.className = "via-markdown-btn via-markdown-btn-sm"
    btn.innerHTML = "解析"
    btn.id = "analysisBtn"
    document.body.appendChild(btn);
  }

  //创建翻译按钮
  function addTranslateBtn() {
    var btn = document.createElement('button');
    btn.style = "top: 280px;left:8px; position: fixed;z-index:1000;cursor:pointer;background:rgba( 15,  43,  70, 0.9);height: 50px;wight:50px;border-radius: 50%; animation: pulse 2s infinite;font-size: 16px;"
    btn.className = "via-markdown-btn via-markdown-btn-sm"
    btn.innerHTML = "翻译"
    btn.id = "translateBtn"
    document.body.appendChild(btn);
  }

  //创建下载按钮
  function addDownloadBtn() {
    var btn = document.createElement('button');
    btn.style = "top: 340px;left:8px; position: fixed;z-index:1000;cursor:pointer;background:rgba(0, 143, 242, 0.9);height: 50px;wight:50px;border-radius: 50%; animation: pulse 2s infinite;font-size: 16px;"
    btn.className = "via-markdown-btn via-markdown-btn-sm"
    btn.innerHTML = "下载"
    btn.id = "downloadBtn"
    // document.body.appendChild(btn);
  }

  addStyle();
  addAnalysisBtn();
  addTranslateBtn();
  addDownloadBtn();

  function adjust(url) {
      // 定义匹配规则的正则表达式
      var regex = /^https:\/\/arxiv\.org\/abs\/(.+)$/;

      // 使用正则表达式进行匹配
      var match = url.match(regex);

      if (match) {
          // 提取匹配到的部分（xxx）
          var identifier = match[1];

          // 构建新的URL
          url = 'https://arxiv.org/pdf/' + identifier + '.pdf';
      }
      return url
  }

  var $analysisBtn = document.getElementById("analysisBtn")
  $analysisBtn.addEventListener("click", Analysis);
  document.addEventListener("dblclick",Analysis);
  function Analysis() {
      //var password = prompt("请输入访问密码");
      var url = `${document.URL}`
      url = adjust(url);
      window.open(base_url + '/analysis?pdf_url=' + url)
  }

  var $translateBtn = document.getElementById("translateBtn")
  $translateBtn.addEventListener("click", Translate);
  document.addEventListener("dblclick",Translate);
  function Translate() {
      var url = `${document.URL}`
      console.log("orgin => " + url);
      if (!url.includes('arxiv')) {
          alert('该功能暂时只能在arxiv上使用！')
          return
      }
      // 使用 replace 方法进行替换
      var target_url = url.replace('arxiv', 'ar5iv');
      console.log("new => " + target_url);
      window.open(target_url);
  }

//   var $downloadBtn = document.getElementById("downloadBtn")
//   $downloadBtn.addEventListener("click", Download);
//   document.addEventListener("dblclick",Download);
  function Download() {
      var password = prompt("请输入访问密码");
      var url = `${document.URL}`
      url = adjust(url)
      // alert(url);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', base_url + '/download', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.responseType = 'blob';

      xhr.onload = function () {
          if (this.status === 200) {
              var url = window.URL.createObjectURL(this.response);
              var a = document.createElement('a');
              a.href = url;
              a.download = 'downloaded_file';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
          } else {
              // document.getElementById('errorMessage').innerText = '文件下载失败。';
              alert('密码错误或文件下载失败。');
          }
      };

      xhr.onerror = function () {
          // document.getElementById('errorMessage').innerText = '网络错误。';
          alert('网络错误。');
      };

      xhr.send(JSON.stringify({url: url, password:password}));
  }
})();