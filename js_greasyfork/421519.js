// ==UserScript==
// @name               xiurenji 下一页  0.1
// @namespace          caocao2077
// @version            0.1
// @description        增加移动端的放大点击按钮
// @author             caocao2077
// @run-at document-start
// @include            http*://m.xiurenji.*/*
// @include            http*://m.xiurenji.cc/*
// @downloadURL https://update.greasyfork.org/scripts/421519/xiurenji%20%E4%B8%8B%E4%B8%80%E9%A1%B5%20%2001.user.js
// @updateURL https://update.greasyfork.org/scripts/421519/xiurenji%20%E4%B8%8B%E4%B8%80%E9%A1%B5%20%2001.meta.js
// ==/UserScript==

(function() {
  "use strict";
  // add Vconsole debug

  let script = document.createElement("script");
  script.src =
    "https://cdn.bootcdn.net/ajax/libs/vConsole/3.3.4/vconsole.min.js";
  document.head.appendChild(script);
  script.onload = () => {
    var vConsole = new VConsole();
    console.log("0.1");
    console.log("vConsole init:",Date.now());
  };

  const addButton = ({ type, relativeElement }) => {
    let containerBox = document.createElement("div");
    containerBox.style.cssText = `
        position: relative;
        left: 0;
        top: -24px;
        padding: 0 0 0 76px;
    `;

    let aTagFirst = document.createElement("a");
    aTagFirst.href = type.first.exist ? type.first.href : "javascript:;";
    aTagFirst.innerText = type.first.exist ? "上一页" : "空";
    aTagFirst.style.cssText = `
        height: 30px;
        width: 50px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #390;
        margin: 0 20px 10px 0px;
    `;
    containerBox.appendChild(aTagFirst);

    let aTagLast = document.createElement("a");
    aTagLast.href = type.last.exist ? type.last.href : "javascript:;";
    aTagLast.innerText = type.last.exist ? "下一页" : "空";
    aTagLast.style.cssText = `
        height: 30px;
        width: 50px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #390;
        margin: 0 20px 10px 5px;
    `;
    containerBox.appendChild(aTagLast);

    relativeElement.parentNode.insertBefore(containerBox, relativeElement);
  };
  window.addEventListener("DOMContentLoaded", () => {
    try {
      console.log("DOMContentLoaded :", Date.now());
      let pageArr = document.getElementsByClassName("page");

      if (pageArr) {
        let page = pageArr[0];
        let ATagList = page.children;
        let firstChild = ATagList[0];
        let lastChild = ATagList[ATagList.length - 1];

        addButton({
          relativeElement: page,
          type: {
            first: {
              href: firstChild.href,
              exist: firstChild.innerHTML === "前",
            },
            last: {
              href: lastChild.href,
              exist: lastChild.innerHTML === "后",
            },
          },
        });
      } else {
        console.log("error no page container");
      }
    } catch (e) {
      throw new Error(e);
    }
  });
})();
