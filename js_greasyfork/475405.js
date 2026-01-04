// ==UserScript==
// @name         超星学习通搜题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  开摆！
// @author       无产阶级打工人
// @match        http://mooc1.chaoxing.com/mycourse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475405/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%90%9C%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/475405/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%90%9C%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    window.onload = function() {
      // 在此处编写当页面加载完成后要执行的代码
      var token = '55c2db39292d48b48259ad0ef0d1c6a3';
      var answer;
      setTimeout(function() {
        var iframe = document.getElementById("iframe"); // 使用iframe的ID获取引用
        var iframeWindow = iframe.contentWindow;
        var iframeDocument = iframeWindow.document;
        var div_iframe = iframeDocument.getElementsByClassName('ans-attach-ct')[0].firstChild;
        var div_iframe_Window = div_iframe.contentWindow;
        var div_iframe_Document = div_iframe_Window.document;
        var test_iframe = div_iframe_Document.getElementById('frame_content');
        var test_iframe_Window = test_iframe.contentWindow;
        var test_iframe_Document = test_iframe_Window.document;
        var que = test_iframe_Document.getElementsByClassName('clearfix fontLabel');
        var resultDiv = createResultDiv(); // 创建用于显示结果的div
        for (var i = 0; i < que.length; i++) {
          processQuestion(que[i], i);
        }
        // 获取选项
        var xx = test_iframe_Document.getElementsByClassName('fl after')
        console.log(xx)
        function createResultDiv() {
          var div = test_iframe_Document.createElement('div');
          div.id = 'resultDiv';
          // 插入到顶部
          test_iframe_Document.body.insertBefore(div, test_iframe_Document.body.firstChild);
          return div;
        }
        function processQuestion(questionElement, index) {
            var text = questionElement.textContent.replace(/[\t\n]/g, '').replace(/【单选题】/g, '');

            setTimeout(function() {
              // 构建请求参数
              var params = new URLSearchParams();
              params.set('token', token);
              params.set('title', text);

              // 构建请求的URL
              var url = 'https://tk.enncy.cn/query?' + params.toString();

              // 发起请求
              fetch(url)
                .then(function(response) {
                  if (!response.ok) {
                    throw new Error('网络请求失败');
                  }
                  return response.json();
                })
                .then(function(data) {
                  // 在这里处理响应数据
                  var answer = data.data.answer;

                  // 找到que[i]的父元素
                  var questionContainer = questionElement.parentElement;

                  // 创建用于显示answer的新元素
                  var answerElement = document.createElement('span');
                  answerElement.textContent = '答案：' + answer;

                  // 设置答案元素的内联样式，将文本颜色设置为红色
                  answerElement.style.color = 'red';

                  // 将answer元素插入到que[i]的父元素中
                  questionContainer.appendChild(answerElement);
                })
                .catch(function(error) {
                  // 处理错误
                  console.error('发生错误:', error);
                });
            }, 2000);
          }
      }, 1000);
    };
  })();