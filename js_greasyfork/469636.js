// ==UserScript==
// @name         强制页面在新标签页打开
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  强制链接在新标签页打开，脚本采用白名单的模式，在油猴自带的菜单里面控制开关
// @author       You
// @match        http://*/*
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @grant unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469636/%E5%BC%BA%E5%88%B6%E9%A1%B5%E9%9D%A2%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/469636/%E5%BC%BA%E5%88%B6%E9%A1%B5%E9%9D%A2%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

;(function () {
  "use strict"

  //网页白名单管理
  function whiteListManage() {
    let menuId
    //开启
    function open() {
      GM_unregisterMenuCommand(menuId)
      hookPageWhenDomChange()
      hookPage()
      localStorage.setItem("whiteList_a5c9f2b1", "true")
      GM_registerMenuCommand("关闭", function () {
        close()
      })
    }
    //关闭
    function close() {
      GM_unregisterMenuCommand(menuId)
      localStorage.setItem("whiteList_a5c9f2b1", "false")
      location.reload()
    }

    let whiteList = localStorage.getItem("whiteList_a5c9f2b1")
    if (!whiteList || whiteList === "false") {
      menuId = GM_registerMenuCommand("开启", open)
    } else if (whiteList === "true") {
      hookPageWhenDomChange()
      hookPage()
      menuId = GM_registerMenuCommand("关闭", close)
    }
  }

  //修改页面以实现链接在新标签页打开
  function hookPage() {
    hookWindowOpen()
    hookATag()
  }

  function hookATag() {
    // 获取页面上的所有链接元素
    let links = document.getElementsByTagName("a")
    for (let i = 0; i < links.length; i++) {
      //如果标签的href属性为空或者是javascript:开头的则跳过
      if (
        !links[i].href ||
        links[i].href.startsWith("javascript:") ||
        links[i].href.endsWith("#") ||
        links[i].href.endsWith("#;")
      ) {
        continue
      }
      // 遍历每个链接元素并添加目标属性
      links[i].setAttribute("target", "_blank")
      //给标签添加点击事件，点击后标红
      links[i].addEventListener("click", function () {
        this.style.color = "darkred"
      })
    }
  }

  function hookWindowOpen() {
    // 保存原始的 window.open 方法的引用
    let originalOpen = unsafeWindow.open
    // 重写 window.open 方法
    unsafeWindow.open = function (url, target, features) {
      // 在新标签页中打开链接
      originalOpen.call(this, url, "_blank", features)
    }
  }

  //监听dom节点变化以应对异步刷新的场景，一旦dom节点发生变化则重新执行hookPage
  function hookPageWhenDomChange() {
    let MutationObserver =
      window.MutationObserver || window.WebKitMutationObserver
    let observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        hookATag()
      })
    })
    observer.observe(document.body, {
      childList: true, // 观察目标子节点的变化，是否有添加或者删除
      subtree: true, // 观察后代节点，默认为 false
      attributes: false, // 观察属性变动
    })
  }

  function init() {
    whiteListManage()
  }
  init()
})()
