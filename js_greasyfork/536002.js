// ==UserScript==
// @name        欧路词典移动视图优化及按键触发
// @namespace   67373net
// @description 欧路词典自用脚本
// @version     0.888
// @author      67373net
// @match       https://dict.eudic.net/areas/recite/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/536002/%E6%AC%A7%E8%B7%AF%E8%AF%8D%E5%85%B8%E7%A7%BB%E5%8A%A8%E8%A7%86%E5%9B%BE%E4%BC%98%E5%8C%96%E5%8F%8A%E6%8C%89%E9%94%AE%E8%A7%A6%E5%8F%91.user.js
// @updateURL https://update.greasyfork.org/scripts/536002/%E6%AC%A7%E8%B7%AF%E8%AF%8D%E5%85%B8%E7%A7%BB%E5%8A%A8%E8%A7%86%E5%9B%BE%E4%BC%98%E5%8C%96%E5%8F%8A%E6%8C%89%E9%94%AE%E8%A7%A6%E5%8F%91.meta.js
// ==/UserScript==

// 原生按键：
// ⭠ 不认识
// ⭢ 认识
// ⭡ 已掌握（部分生效）
// ⭣ 模糊（部分生效）
// abcd 选项
// enter 下一题

const style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = `
    .nz-resizable.explain-container.ng-star-inserted {
        animation: none !important;
        transition: none !important;
        opacity: 1 !important;
        visibility: visible !important;
        display: none !important;
    }
    /* 如果有限制时间的父容器，也可以添加相应规则 */
    .nz-resizable.explain-container.ng-star-inserted * {
        animation: none !important;
        transition: none !important;
    }
    .card-container.full {
      margin-left: 0px !important;
      margin-right: 0px !important;
    }
`;

function clickButton(str) {
  document.querySelectorAll('button').forEach(button => {
    if (button.textContent.trim() === str) button.click();
  });
}

function liju() {
  const ele = document.querySelector('.liju-trans');
  ele.click();
  ele.classList.remove('liju-trans-blur')
}

const keyFuncs = {
  G: () => {
    document.querySelector('[nztype="rollback"]').click(); // 撤销
  },
  H: () => {
    document.querySelectorAll('.phon-inner')[0].click(); // 英音
  },
  I: () => {
    document.querySelectorAll('.phon-inner')[1].click(); // 美音
  },
  J: () => {
    liju(); // 查看例句中文及读音
  },
  K: () => {
    document.querySelector('.prev-button').click(); // 上一个例句
    liju();
  },
  L: () => {
    document.querySelector('.next-button').click(); // 下一个例句
    liju();
  },
  M: () => {
    clickButton('已掌握'); // 已掌握
  },
  N: () => {
    clickButton('模糊'); // 模糊
  },
}

setTimeout(() => {
  document.head.appendChild(style);
  document.addEventListener('keydown', event => {
    const func = keyFuncs[event.key];
    func && func();
  });
}, 1288)

