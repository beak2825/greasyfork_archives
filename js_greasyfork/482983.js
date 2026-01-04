// ==UserScript==
// @name         notion auto expend
// @namespace    http://tampermonkey.net/
// @version      2023-12-24
// @author       You
// @match        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notion.so
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @description  display  to the current (nested) page in the sidebar
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482983/notion%20auto%20expend.user.js
// @updateURL https://update.greasyfork.org/scripts/482983/notion%20auto%20expend.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Your code here...
  let currentPagePath = "";

  // 检测路径变化
  const checkPathChange = () => {
    const allpathstr = $("div.shadow-cursor-breadcrumb").text()
    if (allpathstr !== currentPagePath) {
      // 执行路径变化后的操作
      console.log('Path has changed!', currentPagePath, "=>", allpathstr);
      // 这里可以添加你想要执行的代码

      // 更新当前页面路径
      currentPagePath = allpathstr;
      const allpath = allpathstr.split("/")
      const s = ".notion-outliner-private:nth-child(1) > div "
      const level1p = ".notion-outliner-private:nth-child(1) > div > .notion-selectable > a > div"
      let levelP = ""
      for (let i = 1; i < allpath.length; i++) {
        const path = allpath[i - 1]
        console.log(i, path)
        if (i === 1) {
          const level1 = $(level1p)
          //
          for (let j = 1; j <= level1.length; j++) {
            let rootitem = level1[j - 1]
            if (rootitem.innerText === path) {
              console.log("find!", path)
              const buttonpath = s + `> .notion-selectable:nth-child(${j})` + `> a > div > div:nth-child(1)>div`
              levelP = s + `> .notion-selectable:nth-child(${j})`
              // 判断attr
              const b = $(buttonpath)
              const attr = b.attr("aria-expanded")
              console.log("attr", attr)
              if (attr === "false") {
                console.log("click")
                b.click()
              }
            }
          }
          // console.log("xxxx",level1[0].innerText)
        } else {
          const level = $(levelP + ">div > div> " + ".notion-selectable" + ">a >div")
          console.log(levelP)
          for (let j = 1; j <= level.length; j++) {
            let rootitem = level[j - 1]
            if (rootitem.innerText === path) {
              console.log("find 2!", path, j)
              const buttonpath = levelP + `>div > div> .notion-selectable:nth-child(${j})` + ">a >div" + "> div:nth-child(1)>div"
              levelP = levelP + `>div > div> .notion-selectable:nth-child(${j})`
              // 判断attr
              console.log("path is ", buttonpath)
              const b = $(buttonpath)
              const attr = b.attr("aria-expanded")
              console.log("attr", i, attr)
              if (attr === "false") {
                console.log("click")
                b.click()
              }
            }
          }
        }
      }
    }
    setTimeout(checkPathChange, 1000);
  };

  // 定时检测路径变化
  setTimeout(checkPathChange, 1000); // 每秒检测一次，可以根据需要调整间隔时间
})();