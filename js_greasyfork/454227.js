// ==UserScript==
// @name         DomToLess
// @namespace    http://www.baidu.com/
// @version      3.0.7
// @description  此插件可以一键获取页面的less结构，方便写样式!
// @author       DomToLess Teams
// @match        *://*/*
// @icon         
// @grant        GM.registerMenuCommand
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454227/DomToLess.user.js
// @updateURL https://update.greasyfork.org/scripts/454227/DomToLess.meta.js
// ==/UserScript==
(function () {
  'use strict';


  var _GM_registerMenuCommand;
  if (typeof GM_registerMenuCommand != 'undefined') {
    _GM_registerMenuCommand = GM_registerMenuCommand;
  } else if (typeof GM != 'undefined' && typeof GM.registerMenuCommand != 'undefined') {
    _GM_registerMenuCommand = GM.registerMenuCommand;
  } else {
    _GM_registerMenuCommand = (s, f) => { };
  }
  _GM_registerMenuCommand("DomToLess", () => {
    var DomToLess_box = document.getElementById("DomToLess_box");
    DomToLess_box.classList.add("active");
    setTimeout(() => {
      document.getElementById("dtl_sel").focus();
    }, 100)
  });


  var css_style = document.createElement("style");
  css_style.innerHTML = "div.DomToLess_box{font-family:'weiruanyahei';width:100vw;height:100vh;overflow:hidden;position:fixed;top:0;left:0;z-index:999999999999999999999999;background-color:rgba(0,0,0,0.7);transition:all 0.5s;opacity:0;visibility:hidden;box-sizing:border-box;}div.DomToLess_box *{box-sizing:border-box;}div.DomToLess_box.active{opacity:1;visibility:visible;}div.DomToLess_box div.DomToLess_inner{width:100%;height:100%;max-width:800px;height:600px;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background-color:#fff;padding:30px;}div.DomToLess_box div.DomToLess_inner div.close{width:30px;height:30px;position:absolute;right:0;top:0;color:#000;line-height:30px;text-align:center;user-select:none;cursor:pointer;transition:all 0.5s;}div.DomToLess_box div.DomToLess_inner div.close:hover{background-color:#79b1f5;color:#fff;}div.DomToLess_box div.DomToLess_inner div.topbar{padding:10px 0;border-bottom:1px solid #000;margin-bottom:30px;}div.DomToLess_box div.DomToLess_inner div.line{display:flex;align-items:center;}div.DomToLess_box div.DomToLess_inner div.line div.inps{width:50%;margin-right:20px;}div.DomToLess_box div.DomToLess_inner div.line div.inps input#dtl_sel{border:0;outline:0;padding:0 15px;line-height:40px;border:1px solid #ddd;font-size:16px;width:100%;}div.DomToLess_box div.DomToLess_inner div.line div.right{display:flex;align-items:center;flex:1;}div.DomToLess_box div.DomToLess_inner div.line div.checkboxs{display:flex;flex-direction:column;flex:1;justify-content:space-between;}div.DomToLess_box div.DomToLess_inner div.line div.checkboxs label{display:flex;align-items:center;width:100%;font-size:14px;}div.DomToLess_box div.DomToLess_inner div.line div#dtl_btn{user-select:none;cursor:pointer;line-height:40px;background-color:#79b1f5;min-width:150px;text-align:center;color:#fff;font-size:16px;transition:all 0.5s;margin-left:20px;}div.DomToLess_box div.DomToLess_inner div.line div#dtl_btn:hover{background-color:#79b1f5db;}div.DomToLess_box div.DomToLess_inner div.dtl_textareabox{display:block;width:100%;height:70%;margin-top:30px;}div.DomToLess_box div.DomToLess_inner div.dtl_textareabox textarea#dtl_textarea{width:100%;height:100%;border:0;outline:0;resize:none;border:1px solid #ddd;padding:15px;font-size:16px;}@media screen and (max-width:768px){div.DomToLess_box div.DomToLess_inner div.topbar{margin-bottom:20px;}div.DomToLess_box div.DomToLess_inner div.line{flex-wrap:wrap;}div.DomToLess_box div.DomToLess_inner div.line div.inps{width:100%;margin-right:0;margin-bottom:10px;}div.DomToLess_box div.DomToLess_inner div.line div.right{width:100%;}div.DomToLess_box div.DomToLess_inner div.dtl_textareabox{margin-top:10px;}}@media screen and (max-width:768px){div.DomToLess_box div.DomToLess_inner{padding:20px;width:96vw;}}"
  document.body.appendChild(css_style);


  var pupout_dom = document.createElement("div");
  let _html = '<div class="DomToLess_box"id="DomToLess_box"><div class="DomToLess_inner"><div class="close"id="close">x</div><div class="topbar">DomToLess</div><div class="line"><div class="inps"><input type="text"id="dtl_sel"placeholder="输入css选择器"></div><div class="right"><div class="checkboxs"><label class="hasTag"><input type="checkbox"id="hasTag"><span>使用标签选择器</span></label><label class="ischild_sel"><input type="checkbox"id="ischild_sel"><span>使用子选择器（＞）</span></label></div><div id="dtl_btn">获取</div></div></div><div class="dtl_textareabox"><textarea id="dtl_textarea"></textarea></div></div></div>';
  pupout_dom.innerHTML = _html
  document.body.appendChild(pupout_dom);


  document.addEventListener("click", function (event) {
    // 處理關閉
    if (event.target == document.getElementById("close")) {
      DomToLess_box.classList.remove(`active`);
      document.getElementById("dtl_sel").value = '';
      document.getElementById("dtl_textarea").value = '';
    }

    // 處理獲取
    if (event.target == document.getElementById("dtl_btn")) {
      let selector = document.getElementById("dtl_sel").value;
      let hasTag = document.getElementById("hasTag").checked;
      let ischild_sel = document.getElementById("ischild_sel").checked;

      if (selector.length > 0) {
        DomToLess(selector, hasTag, ischild_sel)
      } else {
        DomToLess("body", hasTag, ischild_sel)
      }

    }
  })
  document.addEventListener("keydown", function (event) {


    // 保存
    // if (event.keyCode == 13 && document.activeElement == document.getElementById("dtl_sel")) {
    if (event.keyCode == 13 && event.target == document.getElementById("dtl_sel")) {

      let selector = document.getElementById("dtl_sel").value;
      let hasTag = document.getElementById("hasTag").checked;
      let ischild_sel = document.getElementById("ischild_sel").checked;

      if (selector.length > 0) {
        DomToLess(selector, hasTag, ischild_sel)
      } else {
        DomToLess("body", hasTag, ischild_sel)
      }
    }

    // 快捷鍵打開
    if (event.ctrlKey == true && event.keyCode == 81) {
      event.preventDefault();
      DomToLess_box.classList.add("active");
      setTimeout(() => {
        document.getElementById("dtl_sel").focus();
      }, 100)
    }

  })





  /**
  * 函數接收三個參數
  * selector：選擇器
  * obj：對象
  * formatchar：.的臨時標識
  * **/

  function findChild({ selector, obj, fchar1, fchar2, hasTag }) {
    let elem = selector;
    if (typeof selector == "string") {
      elem = document.querySelector(selector)
    }

    if (elem != null && elem.children.length > 0) {

      for (let i = 0; i < elem.children.length; i++) {
        let child = elem.children[i];
        let childsel = '';
        let not_tagList = ["STYLE", "SCRIPT", "BR", "HR", "LINK", "NOSCRIPT", "EM", "STRONG", "TITLE", "META"]
        if (not_tagList.indexOf(child.nodeName) < 0) {
          // 判斷是否需要添加“>”
          if (fchar2 != undefined) {
            // 拼接“>”
            childsel += fchar2;
          }
          // 判斷是否需要添加標簽
          if (!hasTag) {
            if (child.classList.length == 0 && child.id == '') {
              // 拼接标签
              childsel += child.localName;
            }
          } else {
            childsel += child.localName;
          }

          // 拼接ID
          if (child.id !== '') {
            childsel += `$${child.id}`;
          }

          // 拼接Class
          if (child.classList.length > 0) {
            let not_classList = ["j-min", "j-100", "z-0", "z-1", "z-2"];
            child.classList.forEach(classname => {
              let re = /[x|s|m|l][s|m|d|g|l][\-]\d{1,3}/g;
              if (not_classList.indexOf(classname) < 0 && !re.test(classname)) {
                childsel += `${fchar1 + classname}`;
              } else {
                if (childsel.length == 0) {
                  childsel += child.localName
                }
              }
            })
          }
          if (obj[childsel] == undefined) {
            obj[childsel] = {};
            findChild({ selector: child, obj: obj[childsel], fchar1, fchar2, hasTag })
          } else {
            findChild({ selector: child, obj: obj[childsel], fchar1, fchar2, hasTag })
          }

        }
      }

      return {
        [selector]: obj
      }
    } else {
      return false
    }
  }

  /**
  * 函數接收一個參數
  * selector：選擇器
  * **/
  function DomToLess(selector, hasTag, ischild_sel) {
    // 两个随机字符串
    let fchar1 = "fchar1" + Date.now()
    let replaceList = ["$", '"', ':', ',', fchar1];

    // 參數列表
    let argument = {
      selector,
      obj: {},
      fchar1,
      hasTag,
    }

    // 如果要使用子選擇器，就執行
    let fchar2 = '';
    if (ischild_sel) {
      fchar2 = "fchar2" + Date.now()
      replaceList.push(fchar2);
      argument['fchar2'] = fchar2;
    }

    let selectorList = findChild(argument);
    if (selectorList) {
      // 转字符串
      let str = JSON.stringify(selectorList)

      // 格式化
      replaceList.forEach(rep => {
        if (rep == '$') {
          str = str.replaceAll(rep, "#")
        } else if (rep == fchar1) {
          str = str.replaceAll(rep, ".")
        } else if (ischild_sel && rep == fchar2) {
          str = str.replaceAll(rep, ">")
        } else {
          str = str.replaceAll(rep, "")
        }
      })
      str = str.substring(1)
      str = str.substring(0, str.length - 1);
      document.getElementById("dtl_textarea").value = str;

      // 对焦及选中
      setTimeout(() => {
        document.getElementById("dtl_textarea").focus();
        document.getElementById("dtl_textarea").select();

        // 复制
        var copy = document.execCommand('copy');
        if (copy) {
          setTimeout(() => {
            //alert("已复制")
            DomToLess_box.classList.remove(`active`);
            document.getElementById("dtl_sel").value = '';
            document.getElementById("dtl_textarea").value = '';
          }, 50)
        } else {
          setTimeout(() => {
            alert("复制失败，请手动复制！")
          }, 50)
        }
      }, 50)

    } else {
      alert("沒找到！");
      document.getElementById("dtl_sel").value = '';
      document.getElementById("dtl_textarea").value = '';
    }

  }

})();