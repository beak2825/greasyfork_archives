// ==UserScript==
// @name         fomatWeChatJSON
// @namespace    http://github.com/2943102883
// @version      0.2.0
// @description  在线格式化JSON文件
// @author       SunShineGo
// @license MIT
// @include      *://mp.weixin.qq.com/wxamp/userlog/*
// @include      *://mp.weixin.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @resource          swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450143/fomatWeChatJSON.user.js
// @updateURL https://update.greasyfork.org/scripts/450143/fomatWeChatJSON.meta.js
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
    if (userName === '端校易') {
      if ($('.vc-item-subitem-undefined').length > 0) {
        let JSONList = $('.vc-item-subitem-undefined')
        JSONList.each(function (index, item) {
          if (item.innerHTML.indexOf('<pre id="jsonPre">') < 0 && item.innerHTML.indexOf('UserLog:fail') < 0) {
            let userInfo = getBaseInfo(item.innerHTML)
            // item.innerHTML = '<div>' + (userInfo.studentInfo ? (userInfo.studentInfo === undefined ? '空' : userInfo.studentInfo) : '空') + '(' + (userInfo.mode ? (userInfo.mode === undefined ? '空' : userInfo.mode) : '空') + ')' + '</div><pre id="jsonPre">' + parse(item.innerHTML) + '</pre>'
            item.innerHTML = `
              <div>
                ${(userInfo.studentInfo ? (userInfo.studentInfo === undefined ? '空' : userInfo.studentInfo) : '空')}
                ( ${(userInfo.mode ? (userInfo.mode === undefined ? '空' : userInfo.mode) : '空')} )
              </div>
              </div><pre id="jsonPre">${parse(item.innerHTML)}</pre>
            `
            // 下面这个是最基础的，会将所有的JSON格式化，上面针对自己的项目在格式化的上面添加了提示信息，可以根据自己的项目修改对项目这行进行修改
            // item.innerHTML = '<pre id="jsonPre">' + parse(item.innerHTML) + '</pre>'
          }
        })
      } else {
        Swal.fire({
          position: "left-top", // 出现位置，右下角
          title: "没有可格式化的内容, 请在：微信小程序后台-开发管理-运维中心进行格式化日志",
          showConfirmButton: true, // 不显示确认按钮
          background: "#F4506B",
          toast: true, // toast为false的话是弹窗形式弹出，有遮罩层。默认为false
          width: "300px",
          padding: "10px",
          icon: "error",
          iconColor: "#fff",
          // animation: false, // 弹出的动画
          customClass: {
            title: "title-class", // 自定义样式
          },
        });
        // alert('没有可格式化的内容, 请在：微信小程序后台-开发管理-运维中心进行格式化日志')
      }
    } else {
      if ($('.vc-item-subitem-undefined').length > 0) {
        let JSONList = $('.vc-item-subitem-undefined')
        JSONList.each(function (index, item) {
          if (item.innerHTML.indexOf('<pre id="jsonPre">') < 0 && item.innerHTML.indexOf('UserLog:fail') < 0) {
            let userInfo = getBaseInfoTeacher(item.innerHTML)
            item.innerHTML = `
              <div>
              ${(userInfo.teacherInfo ? (userInfo.teacherInfo === undefined ? '空' : (userInfo.teacherInfo.name + '(' + userInfo.teacherInfo.mobile + ')')) : '空')}
              ( ${(userInfo.mode ? (userInfo.mode === undefined ? '空' : userInfo.mode) : '空')} )
              </div>
              </div><pre id="jsonPre">${parse(item.innerHTML)}</pre>
            `
          }
        })
      }
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
  // style.type = "text/css";//IE需要设置
  if (style.styleSheet) {  //IE
    var ieInsertCSS = function () {
      try {
        style.styleSheet.cssText = html;
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
    style.innerHTML = html
    theHead.appendChild(style);

  }

}
function getBaseInfo(str) { // 格式化数据，获取基本信息
  try {
    // return JSON.parse(str).BaseInfo
    let obj = JSON.parse(str)
    let studentInfo = ''
    let mode = ''
    if (obj.BaseInfo) {
      // 这边要判断是不是undefined, 因为如果未登录，就为空，是undefined
      // 最初的日志系统studentInfo写错了，写成studetnInfo了，兼容一下
      // studentInfo = obj.BaseInfo.studentInfo.studentName + '-' + obj.BaseInfo.studentInfo.classInfo.name + '-' + obj.BaseInfo.studentInfo.schoolInfo.name
      studentInfo = (obj.BaseInfo.studetnInfo ? (obj.BaseInfo.studetnInfo.studentName ? obj.BaseInfo.studetnInfo.studentName : '空') : (obj.BaseInfo.studentInfo.studentName ? obj.BaseInfo.studentInfo.studentName : '空')) + '-' + (obj.BaseInfo.studetnInfo ? (obj.BaseInfo.studetnInfo.classInfo.name ? obj.BaseInfo.studetnInfo.classInfo.name : '空') : (obj.BaseInfo.studentInfo.classInfo.name ? obj.BaseInfo.studentInfo.classInfo.name : '空')) + '-' + (obj.BaseInfo.studetnInfo ? (obj.BaseInfo.studetnInfo.schoolInfo.name ? obj.BaseInfo.studetnInfo.schoolInfo.name : '空') : (obj.BaseInfo.studentInfo.schoolInfo.name ? obj.BaseInfo.studentInfo.schoolInfo.name : '空'))
      mode = obj.BaseInfo.mode
    } else if (obj.studentInfo || obj.studetnInfo) {
      // studentInfo = obj.studentInfo.studentName + '-' + obj.studentInfo.classInfo.name + '-' + obj.studentInfo.schoolInfo.name
      studentInfo = (obj.studetnInfo ? (obj.studetnInfo.studentName ? obj.studetnInfo.studentName : '空') : (obj.studentInfo.studentName ? obj.studentInfo.studentName : '空')) + '-' + (obj.studetnInfo ? (obj.studetnInfo.classInfo.name ? obj.studetnInfo.classInfo.name : '空') : (obj.studentInfo.classInfo.name ? obj.studentInfo.classInfo.name : '空')) + '-' + (obj.studetnInfo ? (obj.studetnInfo.schoolInfo.name ? obj.studetnInfo.schoolInfo.name : '空') : (obj.studentInfo.schoolInfo.name ? obj.studentInfo.schoolInfo.name : '空'))
      mode = obj.mode
    } else {
      console.log('未知');
      studentInfo = '未知'
      mode = '未知'
    }
    return {
      studentInfo,
      mode
    }

  } catch (error) {
    console.log('getBaseInfoError', error);
  }
}
function getBaseInfoTeacher(str) { // 格式化数据，获取基本信息
  try {
    // return JSON.parse(str).BaseInfo
    let obj = JSON.parse(str)
    let teacherInfo = ''
    let mode = ''
    if (obj.BaseInfo) {
      teacherInfo = obj.BaseInfo.teacherInfo
      mode = obj.BaseInfo.mode
    } else if (obj.teacherInfo) {
      teacherInfo = obj.teacherInfo
      mode = obj.mode
    } else {
      console.log('未知');
      teacherInfo = '未知'
      mode = '未知'
    }
    return {
      teacherInfo,
      mode
    }

  } catch (error) {
    console.log('getBaseInfoError', error);
  }
}