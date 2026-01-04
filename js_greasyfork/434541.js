// ==UserScript==
// @name         码头快捷上线工具
// @namespace    http://vear.vip/
// @version      0.0.5
// @description  干掉烦人的上线流程
// @author       北仓拳王
// @match        https://wharf.alibaba-inc.com/*
// @icon         https://gw.alicdn.com/tfs/TB1utiXJfb2gK0jSZK9XXaEgFXa-200-200.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434541/%E7%A0%81%E5%A4%B4%E5%BF%AB%E6%8D%B7%E4%B8%8A%E7%BA%BF%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/434541/%E7%A0%81%E5%A4%B4%E5%BF%AB%E6%8D%B7%E4%B8%8A%E7%BA%BF%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

function prependChild(parent, newChild) {
  if (parent.firstChild) {
    parent.insertBefore(newChild, parent.firstChild);
  } else {
    parent.appendChild(newChild);
  }
  return parent;
}

function rightAll() {
  Array.from(document.getElementsByClassName("next-radio-wrapper"))
    .filter((ele, index) => index % 2 === 0)
    .forEach((ele) => {
      ele.click();
    });
}
const delay = (timeout) =>
  new Promise((resolve) => setTimeout(() => resolve(), timeout));

function autoNext() {
  let intervalId = setInterval(async () => {
    if (
      document.getElementsByClassName("ContentWidthGated--info--1VnIMug")
        .length == 1 ||
      Number(
        document
          .getElementsByClassName("ContentWidthGated--info--1VnIMug")[1]
          .innerText.split("：")[1]
          .substring(0, 1)
      ) > 5
    ) {
      document
        .getElementsByClassName("next-btn next-medium next-btn-primary")[6]
        .click();
      await delay(300);
      document
        .getElementsByClassName(
          "next-btn next-medium next-btn-primary next-dialog-btn"
        )[0]
        .click();
    }
  }, 3000);
}

(function () {
  "use strict";
  // console.log("成功注入码头快捷上线工具脚本");
  setTimeout(async () => {
    console.log(
      `%c `,
      ` padding: 35px 200px;
    width: 90px;
    height: 90px;
    background-image: url(http://img.doutula.com/production/uploads/image/2020/04/10/20200410452864_AYwgHM.gif);
    background-size: contain;
    background-repeat: no-repeat;
    color: transparent;
    margin-bottom: 10px;`
    );
    console.log(
      `%c码头快捷上线工具%cby北仓拳王`,
      "background: #35495e; padding: 4px; border-radius: 3px 0 0 3px; color: #fff",
      "background: #41b883; padding: 4px; border-radius: 0 3px 3px 0; color: #fff"
    );

    const content = document.querySelectorAll("header")[0].children[2];

    const warp = document.createElement("div");
    warp.style.display = "flex";
    warp.style.justifyContent = "flex-end";
    warp.style.alignItems = "center";
    // warp.style.border = "1px solid red";
    // warp.style.width = "100%";
    // 全勾按钮
    const allRightBtn = document.createElement("button");
    allRightBtn.innerText = "一键 ✅";
    allRightBtn.className = "next-btn next-small next-btn-normal";
    allRightBtn.style.marginRight = "5px";
    allRightBtn.onclick = function () {
      document.getElementsByClassName('next-btn next-small next-btn-normal')[7].click()
      setTimeout(async () => {
        rightAll();
        await delay(200);
        document.getElementsByClassName('next-btn next-medium next-btn-primary next-dialog-btn')[0].click()
      }, 400)
    };

    // 跳过按钮
    const nextBtn = document.createElement("button");
    nextBtn.innerText = "自动 ⏩";
    nextBtn.className = "next-btn next-small next-btn-normal";
    nextBtn.style.marginRight = "5px";
    nextBtn.onclick = function () {
      autoNext();
    };

    warp.appendChild(allRightBtn);
    warp.appendChild(nextBtn);
    // content.appendChild(warp);
    prependChild(content, warp);
  }, 1200);

  (()=> {
    const btnText = document.querySelectorAll('.next-btn-helper')[12].innerText;
    if (btnText === '审批中') {
      console.log('是在审批中');
      const approveTimer = setInterval(()=> {
        const text = document.querySelectorAll('.next-btn-helper')[12].innerText;
        if (text !== '审批中') {
          flicker();
          clearInterval(approveTimer);
        }
      }, 2000);
    }

    function flicker() {
      const title = document.title;
      let count = 1;
      setInterval(()=> {
        document.title = count % 2 ? title : '审批完成啦';
        count++;
      }, 500)
    }
  })()
})();
