// ==UserScript==
// @name        修正浏览器标签标题 - 海角社区
// @namespace   Violentmonkey Scripts
// @include     *://*.hai*.*/*
// @include     *://hai*.*/*
// @include     *://hj*.*/*
// @include     /post/details/
// @match       *://*/homepage/*
// @match       *://*/post/details*
// @match       *://*.haijiao.com/*
// @match       *://*/post/details*
// @grant       none
// @license     MIT
// @version     1.7
// @author      -
// @description 浏览社区的时候浏览器标题显示个人昵称或者帖子名称，浏览器历史记录里面也会同步记录。
// @icon        https://haijiao.com/images/common/project/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/478108/%E4%BF%AE%E6%AD%A3%E6%B5%8F%E8%A7%88%E5%99%A8%E6%A0%87%E7%AD%BE%E6%A0%87%E9%A2%98%20-%20%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/478108/%E4%BF%AE%E6%AD%A3%E6%B5%8F%E8%A7%88%E5%99%A8%E6%A0%87%E7%AD%BE%E6%A0%87%E9%A2%98%20-%20%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==

// 这个脚本由chatgpt3.5协助写出。
var targetNode = document.documentElement;
var config = { attributes: true, childList: true, subtree: true };

var observer = new MutationObserver(function(mutationsList, observer) {
    mutationsList.forEach(function(mutation) {

        if (mutation.target.tagName !== 'TITLE') {
          var divElement = document.querySelector('div.nickname > span:first-child + span');
          if (divElement) {
            // 获取网址
            var currentURL = window.location.href;
            if (currentURL.includes("last")) {
                var minititle = "最新帖子";
            } else if (currentURL.includes("essence")) {
                var minititle = "精华帖子";
            } else if (currentURL.includes("reward")) {
                var minititle = "悬赏帖子";
            } else if (currentURL.includes("sell")) {
                var minititle = "出售帖子";
            } else {
                var minititle = "全部帖子";
            }
            var nickname = divElement.previousElementSibling.textContent;
            var idInfo = divElement.textContent;
            document.title = nickname+"的"+ minititle + "-海角社区";
          }
          //______________________________________________________________

          //帖子的标题修改
          var relativeH2 = document.querySelector('h2 span');
          if (relativeH2) {
            var text = relativeH2.textContent;
            var parentElement = document.querySelector('span a.hjbox-linkcolor').parentNode;
            if (parentElement) {
                var keyword = parentElement.textContent.trim();
                document.title = text + "_" + keyword + "-海角社区";
            }
          }
          //______________________________________________________________

          //首页标题
          var liElements = document.querySelectorAll('li.menu-li.menu-item');
          var keywords = [];
          liElements.forEach(function(liElement) {
              var linkElement = liElement.querySelector('a.menu-link');

              if (linkElement && linkElement.classList.contains("visible")) {
                  var keyword = linkElement.querySelector("span:last-child").textContent;
                  keywords.push(keyword);
              }
          });

          if (keywords.length > 0) {
              document.title = keywords.join(", ") + "-海角社区";


              var visibleKeywordElements = document.querySelectorAll('li div.child_link.lahjyu.visible');
              var visibleKeywords = [];
              visibleKeywordElements.forEach(function(visibleKeywordElement) {
                  var visibleKeyword = visibleKeywordElement.textContent.trim();
                  visibleKeywords.push(visibleKeyword);
              });
              if (visibleKeywords.length > 0) {
                  var cleanedValue = visibleKeywords.join(", ").replace(/\s*VIP\d*\s*/g, '');
                  document.title = keywords.join(", ") + "-" + cleanedValue + "-海角社区";

                  var activeTitle = document.querySelector('.active a');
                  if (activeTitle) {
                    var titleText = activeTitle.textContent.trim();
                    document.title = keywords.join(", ") + "-" + cleanedValue + "-" + titleText + "-海角社区";
                  }
              }

              var activeTitle = document.querySelector('.title.active');
              if (activeTitle) {
                var titleText = activeTitle.textContent.trim();
                document.title = keywords.join(", ") + titleText + "-海角社区";
              }
            }
          //______________________________________________________________


          //发帖时标题
          var hasDraft = document.querySelector('.draft') !== null;
          var hasSubmitBtn = document.querySelector('.common-submitBtn') !== null;
          var hasNotice = document.querySelector('span[style="font-size: 12px; color: rgb(255, 101, 101);"]') !== null;

          var result = "";

          if (hasDraft && hasSubmitBtn && hasNotice) {
            result = "发帖";
            document.title =  result + "-海角社区";
          }
          //______________________________________________________________



        }

      var tidioChatDiv = document.getElementById("tidio-chat");
      if (tidioChatDiv) {
          tidioChatDiv.remove();
      }

    });
});

observer.observe(targetNode, config);


var scriptName = 'mdui.min.js'; // 指定脚本文件名
if (!hasScriptInSourceCode(scriptName)) {
  var cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';

  cssLink.href = 'https://unpkg.com/mdui@1.0.2/dist/css/mdui.min.css';
  var jsScript = document.createElement('script');
  jsScript.src = 'https://unpkg.com/mdui@1.0.2/dist/js/mdui.min.js';

  document.head.appendChild(cssLink);
  document.head.appendChild(jsScript);
}
// 判断网页源代码是否包含指定的脚本文件
function hasScriptInSourceCode(scriptName) {
  var sourceCode = document.documentElement.innerHTML;
  return sourceCode.includes(scriptName);
}


// 创建按钮元素
var buttonElement = document.createElement('button');
buttonElement.className = 'mdui-fab mdui-fab-fixed mdui-ripple mdui-color-pink';
var iconElement = document.createElement('i');
iconElement.className = 'mdui-icon material-icons';
iconElement.textContent = 'arrow_upward';
buttonElement.appendChild(iconElement);
var body = document.body;
body.appendChild(buttonElement);
// 添加按钮点击事件
buttonElement.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});