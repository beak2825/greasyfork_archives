// ==UserScript==
// @name         禅道优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  优化禅道的一些功能
// @author       jackma
// @match        http://zentao.77hub.com/*
// @icon         https://wss.cool/icons/android-chrome-192x192.png
// @license      GNU GPLv3 
// @grant        GM_addStyle
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/480656/%E7%A6%85%E9%81%93%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/480656/%E7%A6%85%E9%81%93%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";
  GM_addStyle(
    `
    body .container{
      max-width: 18000px !important;
    }

    table thead tr th.zentao_column_hidden {
      width: 1px !important;
    }
    `
  );

  switch (location.pathname) {
    case "/zentao/report-tasktime.html":
      findElement('form[action*="report-tasktime"]').then((form) => {
        form.querySelector("#users").value = "shushuo.wang";
        console.log("user is set");
      });
      break;
    case "/zentao/my-work-bug.html":
      enhanceTitle();
      // c-product w-120px
      Promise.all([
        findElement(".c-product"),
        findElement(".c-type"),
        findElement(".c-date"),
        findElement(".c-user"),
        findElement(".c-resolution"),
        findElement(".c-confirm"),
      ]).then((elements) => {
        elements.forEach((el) => {
          el.classList.add("zentao_column_hidden");
          el.style.width = "1px";
        });
      });
      break;
    default:
      console.log(location.pathname);
      break;
  }

  const t = run(document);
  console.log(-1, t);
  if (!t) {
    console.log(0, document, document.title);
    return;
  }
})();

function enhanceTitle() {
  GM_addStyle(
    `
    .button {
      background: transparent;
      padding: 3px 6px;
      background-image: linear-gradient(90deg, white, white),
         linear-gradient(166deg, #ff507a, #7d51df 33%, #2265de 66%, #0bc786);
      background-clip: padding-box, border-box;
      background-origin: border-box;
      border: 2px solid transparent;
      border-radius: 1.75rem;
    }
    
    .button__label {
      background-image: linear-gradient(166deg, #ff507a, #7d51df 33%, #2265de 66%, #0bc786);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      font-weight: 600;
    }
    `
  );
  findElement("body").then(() => {
    const all = document.querySelectorAll("a");
    all.forEach((i) => {
      if (!i) {
        return;
      }
      i.setAttribute("target", "_blank");
      // i.style.color = "red";
      // i.classList.add('text111')
      const text = i.innerText;
      // 用正则提取【】之中的文字，可能有多个
      const match = text.match(/\【(.*?)\】/g);
      if (match) {
        let text_ = text;
        let spans = [];
        for (let index = 0; index < match.length; index++) {
          const span = document.createElement("span");
          const t = match[index];
          text_ = text_.replace(t, "");
          span.innerText = t.replaceAll(/[【】]/g, "");
          // span.classList.add("text111");
          span.classList.add("button__label");
          spans.push(span);
        }
        i.innerText = text_;
        spans.forEach((j) => {
          const span = document.createElement("span");
          span.classList.add("button");
          span.appendChild(j);
          i.appendChild(span);
        });
      }
    });
  });
}

function run(a) {
  const b = a.querySelector("#main .container");
  if (!b) {
    console.log(a.title, "not found");
    return "error";
  }
  setTimeout(() => {
    width(a);
  }, 0);
  setTimeout(() => {
    currentConsumed(a);
    resolution(a);
    buginsource(a);
  }, 0);

  return "ok";
}

// 修正宽度
function width(a) {
  const c = a.querySelector(".main-col.col-8");
  const d = a.querySelector(".side-col.col-4");
  if (!c || !d) {
    return "error";
  }
  console.log(c, d);

  var style = a.createElement("style");
  var styleContent = ".container { max-width: 100% !important; }";
  style.textContent = styleContent;
  a.head.appendChild(style);
  replaceClass(c, "col-8", "col-10");
  replaceClass(d, "col-4", "col-2");
}

function replaceClass(ele, oldClass, newClass) {
  // remove 'col-8' class
  if (ele.classList.contains(oldClass)) {
    ele.classList.remove(oldClass);
  }

  // add 'col-10' class
  ele.classList.add(newClass);
}

// 当前消耗
function currentConsumed(doc) {
  const target = doc.querySelector('[name="currentConsumed"]'); // 当前消耗
  if (!target) {
    return;
  }

  const values = [0.01, 0.5, 1, 2, 3, 4].map((count) => {
    return {
      text: count,
      value: count,
      effect: function (v) {
        const consumed = doc.querySelector('[name="consumed"]'); // 总消耗
        consumed.value = consumed.value - 0 + v;
      },
    }
  });
  makeBt(doc, target, values);
}

// 解决方案
function resolution(doc) {
  const target = doc.querySelector('[name="resolution"]'); // 当前消耗
  if (!target) {
    return;
  }
  makeBt(doc, target, [{ value: "fixed", text: "已解决" }]);
}

// buginsource bug引入阶段
function buginsource(doc) {
  const target = doc.querySelector('[name="buginsource"]'); // 当前消耗
  if (!target) {
    return;
  }
  makeBt(doc, target, [{ value: "dev", text: "开发阶段" }]);
}

/**
 * Creates and returns an array of buttons based on the given values, and attaches them to a container element.
 *
 * @param {object} doc - The document object used to create elements.
 * @param {HTMLElement} target - The target element where the buttons' values will be assigned.
 * @param {Array} values - An array of objects containing the text and value properties for each button.
 * @param {Array} value.effect - An optional array of functions to be executed when a button is clicked.
 * @return {Array} - An array of button elements.
 */
function makeBt(doc, target, values) {
  const bts = values.map((value) => {
    const bt = doc.createElement("button");
    bt.innerText = `${value.text}`;
    bt.style.width = "auto";
    bt.style.height = "31px";
    bt.style.lineHeight = "1";
    bt.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      target.value = value.value;
      if (value.effect) {
        value.effect.forEach((item) => {
          item && item(value.value);
        });
      }
    });
    return bt;
  });

  const container = doc.createElement("div");
  container.style.position = "absolute";
  container.style.width = "200px";
  container.style.height = "32px";
  container.style.display = "flex";
  container.style.left = "100%";
  container.style.top = "7px";
  bts.forEach((bt) => {
    container.appendChild(bt);
  })
  target.parentElement.appendChild(container);

  return bts;
}

///////////////////////////// common code -- start /////////////////////////////
function debounce(func, timeout = 1000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

async function findElement(selector, all) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const el = all
        ? document.querySelectorAll(selector)
        : document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      }
    }, 1000);
  });
}

///////////////////////////// common code -- end /////////////////////////////
