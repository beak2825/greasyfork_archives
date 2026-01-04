// ==UserScript==
// @name         小程序日志JSON格式化
// @namespace    http://github.com/2943102883
// @version      0.1
// @description  在线格式化JSON文件
// @author       SunShineGo
// @license MIT
// @include      *://mp.weixin.qq.com/wxamp/userlog/*
// @include      *://mp.weixin.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450133/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%97%A5%E5%BF%97JSON%E6%A0%BC%E5%BC%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/450133/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%97%A5%E5%BF%97JSON%E6%A0%BC%E5%BC%8F%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';
  insertCSS(`
  #jsonPre {
    float: left;
    /* width: 100%; */
    width: 60vw;
    height: 50vh;
    outline: 1px solid #ccc;
    padding: 5px;
    overflow: scroll;
  }

  .string {
    color: green;
  }

  .number {
    color: darkorange;
  }

  .boolean {
    color: blue;
  }

  .null {
    color: magenta;
  }

  .key {
    color: #a61b8b;
  }
  .formatJSON {
    position: fixed;
    width: 50px;
    height: 50px;
    background-image: linear-gradient(to right,#ff863a, #ff4623);
    top: 30vh;
    right:10px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: medium;
    color: #fff;
    cursor:pointer;
  }
  `)
  insertHTML(`
  <div class="formatJSON">格式化</div>
  `)
  insertHTML(`
    <div class="toastDialog"></div>
  `)
  $('.formatJSON').click(function () {
    let userName = $('.user_name')[0].innerHTML
    console.log('userName', userName)
    if ($('.vc-item-subitem-undefined').length > 0) {
      let JSONList = $('.vc-item-subitem-undefined')
      JSONList.each(function (index, item) {
        if (item.innerHTML.indexOf('<pre id="jsonPre">') < 0 && item.innerHTML.indexOf('UserLog:fail') < 0) {
          item.innerHTML = `
              </div><pre id="jsonPre">${parse(item.innerHTML)}</pre>
            `
        }
      })
    } else {
      alert('没有可格式化的内容, 请在：微信小程序后台-开发管理-运维中心进行格式化日志')
    }

  })

})();


function parse(str) { // 格式化输出json
  // 设置缩进为2个空格
  str = JSON.stringify(JSON.parse(str), null, 2);
  str = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}
function insertCSS(cssStyle) {  // 注入css样式
  var style = document.createElement("style");
  var theHead = document.head || document.getElementsByTagName('head')[0];
  style.type = "text/css";//IE需要设置
  if (style.styleSheet) {  //IE
    var ieInsertCSS = function () {
      try {
        style.styleSheet.cssText = cssStyle;
      } catch (e) {

      }
    };
    //若当前styleSheet不能使用，则放到异步中
    if (style.styleSheet.disable) {
      setTimeout(ieInsertCSS, 10);

    } else {
      ieInsertCSS();
    }
  } else { //W3c浏览器
    style.appendChild(document.createTextNode(cssStyle));
    theHead.appendChild(style);

  }
}

function insertHTML(html) { // 注入html
  var style = document.createElement("div");
  var theHead = document.body || document.getElementsByTagName('body')[0];
  if (style.styleSheet) {  //IE
    var ieInsertCSS = function () {
      try {
        style.styleSheet.cssText = html;
      } catch (e) {

      }
    };
    if (style.styleSheet.disable) {
      setTimeout(ieInsertCSS, 10);
    } else {
      ieInsertCSS();
    }
  } else { //W3c浏览器
    style.innerHTML = html
    theHead.appendChild(style);

  }

}