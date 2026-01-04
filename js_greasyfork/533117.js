// ==UserScript==
// @name        妖火复读机(兼容分屏)
// @namespace   http://yaohuo.me/
// @supportURL  http://yaohuo.me/
// @version     20250225.02
// @description 妖火论坛每个回复后面加个复读按钮。
// @author      我黄某与赌毒不两立
// @match       *://yaohuo.me/bbs*
// @match       *://www.yaohuo.me/bbs*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/533117/%E5%A6%96%E7%81%AB%E5%A4%8D%E8%AF%BB%E6%9C%BA%28%E5%85%BC%E5%AE%B9%E5%88%86%E5%B1%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533117/%E5%A6%96%E7%81%AB%E5%A4%8D%E8%AF%BB%E6%9C%BA%28%E5%85%BC%E5%AE%B9%E5%88%86%E5%B1%8F%29.meta.js
// ==/UserScript==

(function () {
  let domTextarea = document.querySelector('textarea');
  //发表回复
  window.reply = function (txt, face) {
    //填写内容
    domTextarea.value += txt;
    //选择表情
    for (let i = 0; i < document.forms.length; i++) {
      const form = document.forms[i];
      if (form.name == 'f') {
        form.face.value = face;
        break;
      }
    }
    //点击回复按钮
    let domInput = document.querySelectorAll('input');
    for (let i = domInput.length - 1; i > 0; i--) {
      const btn = domInput[i];
      if (btn.value == '快速回复' || btn.value == '发表回复') {
        btn.click();
        break;
      }
    }
    return false; // 阻止默认行为和冒泡
  }
  //注入更多按钮
  let moreButn = [
    { css: 'background:#937a3e;color:#fff', showText: '吃', text: '吃', face: '', },
    { css: 'background:#937a3e;color:#fff', showText: '过', text: '过', face: '', },
    { css: 'background:#a7588d;color:#fffa28', showText: '感谢分享', text: '感谢分享', face: '谢谢.gif' },
    { css: 'background:#3e933e;color:#fff', showText: '哈哈', text: '哈哈', face: '哈哈.gif' },
    { css: 'background:#3e933e;color:#fff', showText: '恭喜', text: '恭喜', face: '么么哒.gif' },
    { css: 'background:#3e933e;color:#fff', showText: '大佬带带', text: '大佬带带', face: '耶耶.gif' },
    { css: 'background:#3e933e;color:#fff', showText: '大水比', text: '大水比', face: '被揍.gif' },
  ];
  let domForm = document.querySelector('.recontent');
  window.moreReplyBtn = function () {
    if (domForm != null) {
      //注入按钮
      let className = 'moreReplyButn';
      let isAddBtn = domForm.querySelector(`.${className}`);
      if (isAddBtn == null) {
        let btnHtml = '';
        let btnStyle = 'padding:5px;border-radius:5px;font-size:14px;cursor:pointer;';
        moreButn.forEach(f => {
          btnHtml += ` <span class='${className}' style='${btnStyle}${f.css}' onclick='return window.reply("${generateFontUBB(f.text)}","${f.face}")'>${f.showText}</span>`;
        });
        domForm.innerHTML = `<div style='margin:0 10px 7px;'>${btnHtml}</div>` + domForm.innerHTML;
      }
    }
  }
  //注入复读按钮
  let isNewLayout = false;
  let getNewLayout = localStorage.getItem('customLayoutEnabled');
  if (getNewLayout !== null) isNewLayout = JSON.parse(getNewLayout);
  window.repeatBotBtn = function () {
    //获取当前主题版本
    let domTxt = {};
    if (isNewLayout) domTxt = document.querySelectorAll('.forum-post');//新主题
    else domTxt = document.querySelectorAll('.list-reply'); //旧主题
    //注入按钮
    let className = 'repeatBotButn';
    domTxt.forEach(f => {
      let domSpan = f.querySelector('.retext');
      let isAddBtn = domSpan.querySelector(`.${className}`);
      if (isAddBtn == null) {
        let txt = generateHtmlUbb(domSpan.innerHTML);
        let btnHtml = ` <span class='${className}' style='cursor:pointer;' onclick='return window.reply(\`${txt}\`)'>+1</span>`;
        domSpan.innerHTML += btnHtml;
      }
    });
  }
  //检查页面
  if (domTextarea != null) {
    //注入更多按钮
    window.moreReplyBtn();
    //注入复读按钮
    window.repeatBotBtn();
    //元素监视（减少性能损耗）
    const callback = function (mutationsList, observer) {
      //隐藏提示
      var showTipe = document.querySelector('#retip');
      if (showTipe != null) showTipe.style.display = 'none';
      //注入更多按钮
      window.moreReplyBtn();
      //注入复读按钮
      window.repeatBotBtn();
    };
    const observer = new MutationObserver(callback);
    observer.observe(domForm, { childList: true, subtree: true });
  }
  //HTML转UBB
  function generateHtmlUbb(html) {
    //创建一个临时 DOM 元素来解析 HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    //获取所有的 img 元素并替换为 UBB 格式
    const imgElements = tempDiv.getElementsByTagName('img');
    for (let i = imgElements.length - 1; i >= 0; i--) {
      const img = imgElements[i];
      const ubbImage = `[img]${img.src}[/img]`;
      //用 UBB 格式替换 img 元素
      img.replaceWith(ubbImage);
    }
    //获取所有的 br 元素并替换为换行符
    const brElements = tempDiv.getElementsByTagName('br');
    for (let i = brElements.length - 1; i >= 0; i--) {
        const br = brElements[i];
        const newLine = document.createTextNode('\n');
        //用换行符替换 br 元素
        br.replaceWith(newLine);
    }
    //返回处理后的文本
    return tempDiv.innerText || tempDiv.textContent;
  }
  //生成彩色文字UBB
  function generateFontUBB(input) {
    let ubbString = '';
    for (const char of input) {
      const color = getRandomColor();
      ubbString += `[forecolor=${color}]${char}[/forecolor]`;
    }
    return ubbString;
  }
  //获取随机颜色
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
})();