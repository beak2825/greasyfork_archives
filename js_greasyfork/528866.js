// ==UserScript==
// @name         链接提示
// @namespace    ttjz_ljts
// @version      0.1
// @description  链接提示【提示链接是什么形式打开】
// @author       tongtianjiaozhu
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @run-at  document-start
// @downloadURL https://update.greasyfork.org/scripts/528866/%E9%93%BE%E6%8E%A5%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/528866/%E9%93%BE%E6%8E%A5%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==
(function () {
  "use strict";
  let css = `
        .tonyu_balabala_03e6ea_02_circle_breath {
            box-shadow: 0 0 0 0 rgb(204, 73, 152);
            height: 36px;
            width: 36px;
            border-radius: 50%;
            animation: tonyu_balabala_03e6ea_02_donghua 0.5s;
            pointer-events:none;
        }

        @keyframes tonyu_balabala_03e6ea_02_donghua {
            0% {
                transform: scale(1);
                /* 注意rgba中的a的设置 */
                /*box-shadow: 0 0 0 0 rgba(204, 204, 152, 60%);*/
            }

            60% {
                transform: scale(1.5);
                /*box-shadow: 0 0 0 16px rgba(204, 204, 152, 0%);*/
            }

            100% {
                transform: scale(1);
                /*box-shadow: 0 0 0 0 rgba(204, 204, 152, 0%);*/
            }
        }
    `;
  css.replace(/;/g, " !important;");
  //GM_addStyle(css)
  var node = document.createElement("style");
  node.type = "text/css";
  node.appendChild(document.createTextNode(css));
  var htmls = document.getElementsByTagName("html");
  if (htmls.length > 0) htmls[0].appendChild(node);
  else document.documentElement.appendChild(node);

  let links = document.links;
  let oldLength = links.length;

  let tip2 = document.createElement("div");
  tip2.className = "tonyu_balabala_03e6ea_02_tip2";
  tip2.setAttribute(
    "style",
    `position: absolute !important;
    width:10px !important;
    height:10px !important;
    box-sizing: content-box !important;
    border-radius:50% !important;
    border: 1px solid #aaaaaadd !important;
    z-index:2147483647 !important;
    pointer-events:none !important;
    animation:tonyu_balabala_03e6ea_02_donghua 0.6s !important;
    `
  );
  // 移除tip2的定时任务
  let myTimer2;
  // tip2是否添加在页面中
  let tip2Flag = false;
  // 鼠标移动
  function mousemoveHandler(e) {
    if (tip2Flag) {
      tip2.style.left = e.pageX - 6 + "px";
      tip2.style.top = e.pageY - 6 + "px";
    }
  }
  // 获取页面中的tip2
  function getMyTip2() {
    let myTip2s = document.getElementsByClassName(
      "tonyu_balabala_03e6ea_02_tip2"
    );
    if (myTip2s.length > 0) return myTip2s[0];
    else return null;
  }
  // 在页面中添加tip2
  function addTip2() {
    tip2Flag = true;
    document.documentElement.appendChild(tip2);
  }
  // 在页面中移除tip2
  function removeTip2() {
    tip2Flag = false;
    document.documentElement.removeChild(tip2);
  }
  // 绑定鼠标移动监听事件
  document.addEventListener("mousemove", mousemoveHandler);
  function showTip2(e, isNewTab) {
    if (isNewTab) tip2.style.backgroundColor = "#7cefaedd";
    else tip2.style.backgroundColor = "#fb7299dd";
    tip2.style.left = e.pageX - 6 + "px";
    tip2.style.top = e.pageY - 6 + "px";
    let myTip2 = getMyTip2();
    if (myTip2) {
      clearTimeout(myTimer2);
      removeTip2();
    }
    addTip2();
    myTimer2 = setTimeout(function () {
      removeTip2();
    }, 800);
  }
  function hideTip2() {
    let myTip2 = getMyTip2();
    if (myTip2) {
      clearTimeout(myTimer2);
      removeTip2();
    }
  }
  // 鼠标进入a标签响应函数
  function linkMouseenterHandler(e) {
    let aTarget = e.target.target;
    let isNewTab = aTarget === "_blank" || aTarget === "view_window";
    //showTip1(e,isNewTab)
    showTip2(e, isNewTab);
  }
  // 鼠标离开a标签响应函数
  function linkMouseleaveHandler(e) {
    hideTip2();
  }
  // 给链接绑定鼠标进入离开函数
  function initLinksHandle() {
    for (let i = 0; i < links.length; i++) {
      links[i].addEventListener("mouseenter", linkMouseenterHandler);
      links[i].addEventListener("mouseleave", linkMouseleaveHandler);
    }
  }
  initLinksHandle();
  // 检查链接数变化的循环任务
  let myInterval;
  // 触发mouseover进行链接数变化检查，若链接变化，重新进行绑定
  document.addEventListener("mouseover", function (e) {
    let count = 0;
    clearInterval(myInterval);
    // 开启循环任务，并立即执行一次
    myInterval = setInterval(
      (function checkLinks() {
        if (count === 5) clearInterval(myInterval);
        if (links.length !== oldLength) {
          initLinksHandle();
          oldLength = links.length;
        }
        count++;
        return checkLinks;
      })(),
      500
    );
  });
})();
