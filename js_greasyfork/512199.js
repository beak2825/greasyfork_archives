// ==UserScript==
// @name         B站快速搜索框
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在B站页面中弹幕栏添加自定义搜索框，按A键获得焦点，按回车进行搜索，学习搜索两不误。
// @author       尚千
// @match        *://*.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512199/B%E7%AB%99%E5%BF%AB%E9%80%9F%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/512199/B%E7%AB%99%E5%BF%AB%E9%80%9F%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 全局保存搜索框的引用
    var searchBox;
    var previousFocusedElement;
    var inputTab;
var seachPageInput;
    // 创建搜索框和搜索按钮
    function createSearchBox() {
        // 创建包含搜索框和搜索按钮的容器
        var searchContainer = document.createElement('div');
        searchContainer.style.display = 'flex';
        searchContainer.style.alignItems = 'center';

        // 创建搜索框
        searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.placeholder = '输入搜索关键词';
        searchBox.style.padding = '5px';
        searchBox.style.marginLeft  = '5px';
        searchBox.style.width = '200px';
        searchBox.classList.add('custom-search-box'); // 添加类名方便检测
        searchBox.style.borderRadius = '6px';
        searchBox.style.background = '#f1f2f3';
        // searchBox.style.height = '34px';
        searchBox.style.border = 'none';
        searchBox.id = 'searchBox';
        searchBox.style.zIndex = '10'; // 设置 z-index

        // 创建搜索按钮
        var searchButton = document.createElement('button');
        searchButton.innerHTML = '🔍'; // 搜索图标
        searchButton.style.padding = '5px';
        searchButton.style.cursor = 'pointer';
        searchButton.style.marginLeft = '2px';
        searchButton.style.borderRadius = '6px';
        searchButton.style.background = '#e3e5e7';
        searchButton.style.border = 'none';
        searchButton.style.height = '43px';
        searchButton.style.zIndex = '10'; // 设置 z-index
        // searchButton.style.width = '35px';

        // 搜索功能
        function performSearch() {

            var query = searchBox.value;
            if (query) {
                var searchUrl = 'https://search.bilibili.com/all?keyword=' + encodeURIComponent(query);
                window.open(searchUrl, '_blank'); // 打开新窗口
            }
            else{
              var searchUrl = 'https://t.bilibili.com/'
              window.open(searchUrl, '_blank'); // 打开新窗口
            }
        }

        // 点击搜索按钮时触发搜索
        searchButton.addEventListener('click', function(event) {
          event.stopPropagation();  // 阻止事件冒泡
          performSearch();
        });
        // 监听搜索框的点击事件，阻止冒泡
        searchBox.addEventListener('click', function(event) {
            event.stopPropagation();  // 阻止点击事件冒泡
        });

        // 监听搜索框中的回车键
        searchBox.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
            if (event.key === 'Escape') {
                if (previousFocusedElement) {

                inputTab=document.getElementById("searchBox");
                inputTab.blur();

                if(seachPageInput){seachPageInput.blur();}

                  console.log("现在的焦点",document.activeElement);
                } else {
                  document.body.focus();  // 如果没有记录，聚焦到 body
                }
                console.log("exit");
            }

        });

        // 将搜索框和按钮添加到容器中
        searchContainer.appendChild(searchBox);
        searchContainer.appendChild(searchButton);

        return searchContainer;
    }

    // 向目标div中添加搜索框
    function addSearchBoxToDiv() {

        var targetDiv = document.querySelector('.bui-collapse-header');
        if (targetDiv && !targetDiv.querySelector('.custom-search-box')) {
            var searchContainer = createSearchBox();
            targetDiv.appendChild(searchContainer);
        }
        else{
          var targetDiv = document.querySelector('.bui-collapse-header');
          if (targetDiv && !targetDiv.querySelector('.custom-search-box')) {
            var searchContainer = createSearchBox();
            targetDiv.appendChild(searchContainer);
          }
        }
    }

    // 使用MutationObserver监控页面变化
    function observeDomChanges() {
        var targetNode = document.body;
        var config = { childList: true, subtree: true };

        var observer = new MutationObserver(function(mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    addSearchBoxToDiv();
                }
            }
        });

        observer.observe(targetNode, config);
    }

    var hidden, state, visibilityChange;
    if (typeof document.hidden !== "undefined") {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
      state = "visibilityState";
    } else if (typeof document.mozHidden !== "undefined") {
      hidden = "mozHidden";
      visibilityChange = "mozvisibilitychange";
      state = "mozVisibilityState";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
      state = "msVisibilityState";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
      state = "webkitVisibilityState";
    }


    // 等待页面加载完成后启动观察器
    window.addEventListener('load', function() {
        addSearchBoxToDiv(); // 首次加载页面时添加搜索框
        observeDomChanges(); // 启动DOM变化监测
    });
    // 监听按键事件
    window.addEventListener('keydown', function(event) {
        if (event.code === 'KeyA') {

          inputTab=document.getElementById("searchBox");

          seachPageInput = document.querySelector('.search-input-el');

           // 延迟调用 focus
          setTimeout(function() {
            previousFocusedElement = document.activeElement; // 记录当前焦点元素
              if(inputTab){inputTab.focus();}
              else if(seachPageInput){seachPageInput.focus();}
              else{}

            console.log("你好")
          }, 100); // 100ms 的延迟
        }
    });

})();
