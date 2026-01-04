// ==UserScript==
// @name         google翻译格式化插件
// @namespace    1028939831@qq.om
// @version      1.0.0
// @description  谷歌翻译去除多余的换行，提升翻译结果准确性,根据"	翻译插件——去除换行（改）by caiguang1997"项目修改，由于时间关系，仅保留了google翻译插件的适配，感谢caiguang1997的贡献！
// @author       Jiatao
// @match        https://translate.google.com/*
// @icon         https://translate.google.cn/favicon.ico
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476102/google%E7%BF%BB%E8%AF%91%E6%A0%BC%E5%BC%8F%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/476102/google%E7%BF%BB%E8%AF%91%E6%A0%BC%E5%BC%8F%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

const GOOGLE_TRANSLATE = "translate.google.com";

const FORMAT_CN = "格式化";

// Get source input element
function getInputElement(host) {
  return document.querySelector("#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > div.OlSOob > c-wiz > div > div.AxqVh > div.OPPzxe > c-wiz.rm1UF.YYaoY > span > span > div > textarea")
}

// Format code
function format(elemnt) {
  var txt = elemnt.value;

  //第一步：连字符与换行连用表示单词拼接
  txt = txt.replace(/-\n/g,"");

  //第二步：将(前面一个符号为非句号、问号、感叹号、分号、冒号、换行的)换行符替换为空格
  txt = txt.replace(/(?<![\.?!;:\n])\n/g," ");

  //第三步：上一步可能会增添多余空格，因此，多空格替换为单空格
  txt = txt.replace(/ +/g," ");

  //第四步：将(前面一个符号为句号、问号、感叹号、分号、冒号、换行的)换行符替换为双回车
  txt = txt.replace(/(?<=[\.?!;:])\n+/g,"\n\n");

  elemnt.value = txt;
}

// Create new button
function createButton(host) {
  var new_button = null;
  switch(host) {
      case GOOGLE_TRANSLATE:
          var FORMAT = "格式化";
          var container = Array.from(document.querySelectorAll('nav')).filter(v => v.innerHTML.indexOf('翻译类型') !== -1)[0]
          new_button = container.children[2].cloneNode(true);
          new_button.querySelector('svg').remove();
          new_button.querySelector('button').innerText = FORMAT;
          container.appendChild(new_button);
          new_button.onclick = function() {
              var textarea = document.querySelector("#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > div.OlSOob > c-wiz > div > div.AxqVh > div.OPPzxe > c-wiz.rm1UF.YYaoY > span > span > div > textarea")
              format(textarea)
              // Trigger translate event
              var event = new Event('input', { bubbles: true })
              textarea.dispatchEvent(event)
              var blurEvent = new Event('blur', { bubbles: true })
              textarea.dispatchEvent(blurEvent)
          };
          break;
      default: break;
  }
}

// Run from this
(function() {
  var host = window.location.host;
  createButton(host);
})();