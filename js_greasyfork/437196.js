// ==UserScript==
// @name         鼠标选中跳转蓝奏云有效链接及自动填写提取码
// @namespace    https://coycs.com/
// @version      1.0.0
// @description  鼠标选中蓝奏云链接时会将链接转化为有效链接并显示跳转按钮，如果选中内容包括提取码则会在对应的网页自动填充。
// @author       coycs
// @match        http://*/*
// @match        https://*/*
// @match       *.lanzoui.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437196/%E9%BC%A0%E6%A0%87%E9%80%89%E4%B8%AD%E8%B7%B3%E8%BD%AC%E8%93%9D%E5%A5%8F%E4%BA%91%E6%9C%89%E6%95%88%E9%93%BE%E6%8E%A5%E5%8F%8A%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8F%90%E5%8F%96%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/437196/%E9%BC%A0%E6%A0%87%E9%80%89%E4%B8%AD%E8%B7%B3%E8%BD%AC%E8%93%9D%E5%A5%8F%E4%BA%91%E6%9C%89%E6%95%88%E9%93%BE%E6%8E%A5%E5%8F%8A%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8F%90%E5%8F%96%E7%A0%81.meta.js
// ==/UserScript==
 
(function () {
  'use strict'


  // 获取鼠标位置
  var movex;
  var movey;
  function mousemove(e) {
      e = e || window.event;
      if (e.clientX || e.clientY) {
          movex = e.clientX;
          movey = e.clientY
      }
  }
  document.onmousemove = mousemove;

  // 展示有效链接及提取码
  function show(href, password) {
      var relay = "";
      if (password != "") {
          relay = href + "coycs" + password + "coycs";
      } else {
          relay = href;
      }
      if (!document.getElementsByClassName("popWindow")[0]) {
          // 创建节点
          var div = document.createElement('div');
          div.setAttribute("style", "background:linear-gradient(#00b09b, #96c93d);position:fixed;padding:20px;z-index:10000;");
          div.setAttribute("class", "popWindow");
          div.setAttribute("color", "#fff");
          div.style.left = movex + 30 + "px";
          div.style.top = movey + 30 + "px";
          document.getElementsByTagName("body")[0].appendChild(div);
          div.innerHTML = `<p padding="5px"  margin-bottom="5px">链接：<span id="hrefText">${href}</span></p>
          <p padding="5px" id="nodePassword" margin-bottom="5px">提取码：<span id="passwordText">${password}</span></p>
          <p id="actionBtns"><a id="hrefBtn" href="${relay}" target="_blank" padding="5px">前往-></a>
          <button id="closeBtn" padding="5px">关闭</button></p>`;
          var actionBtns = document.getElementById("actionBtns");
          actionBtns.setAttribute("style", "display: flex;flex-direction: row;justify-content: space-between;");
          // 前往按钮
          var hrefBtn = document.getElementById("hrefBtn");
          hrefBtn.addEventListener("click", function () {
              window.getSelection().removeAllRanges();
              document.getElementsByClassName("popWindow")[0].remove();
          })
          // 关闭按钮
          var closeBtn = document.getElementById("closeBtn");
          closeBtn.setAttribute("style", "background-color:#96c93d;border-style:none;")
          closeBtn.addEventListener("click", function () {
              window.getSelection().removeAllRanges();
              document.getElementsByClassName("popWindow")[0].remove();
          })
      } else {
          var hrefText = document.getElementById("hrefText");
          var passwordText = document.getElementById("passwordText");
          hrefBtn = document.getElementById("hrefBtn");
          hrefText.innerHTML = href;
          passwordText.innerHTML = password;
          hrefBtn.setAttribute("href", `${relay}`);
      }
  }


  // 选取文字触发
  var select = function () {
      if (window.getSelection && window.getSelection().toString().indexOf("lanzou") != -1) {
          // 字符串初处理
          var string1 = window.getSelection().toString();
          console.log("string1：" + string1);
          var string2 = string1.substring(string1.indexOf("http"), string1.length).replace(/\s*/g, "");
          console.log("string2：" + string2);
          // 获取链接部分
          var href = "";
          // console.log(string2.indexOf(string2.match(/[^\x00-\xff]/g)[0]));
          if (string2.match(/[^\x00-\xff]/g)) {
              href = string2.substring(0, string2.indexOf(string2.match(/[^\x00-\xff]/g)[0]));
          } else {
              href = string2;
          }
          var string3 = href;
          console.log("href：" + href);
          var domin = href.split("/")[2].split('.').slice(-2).join('.');
          var dominR = "lanzoui.com";
          href = href.replace(domin, dominR).replace(/[\x22\x27-\x29\x2c\x3b\x5b-\x5e\x60\x7b-\x7f]/g, "");
          console.log("href：" + href);
          // var selected = window.getSelection().toString().replace(/\s*/g, "").replace("：", ":");
          // var domin = selected.split("/")[2].split('.').slice(-2).join('.')
          // var dominR = "lanzoui.com";
          // var pureSelected = selected.replace(domin, dominR);
          // var href = "";
          // for (var j = 0; j < pureSelected.length; j++) {
          //     if (pureSelected.charCodeAt(j) > 127) {
          //         href = pureSelected.substring(0, j);
          //         break;
          //     }
          // }
          // 获取提取码部分
          var password = string2.replace(string3, "").replace(/[^\x00-\xff]/g, "").replace(":", "");
          console.log("password：" + password);
          show(href, password);
      }
  }
  // 选中链接及提取码部分
  document.addEventListener("mouseup", select);





  // 自动填写提取码部分
  // 获取网页链接
  var url = document.location.href;
  // 定义目标网站
  var urlR = "lanzoui.com"
  if (url.indexOf(urlR) != -1) {
      var pwd = document.getElementById("pwd");
      if (url.indexOf("coycs") != url.lastIndexOf("coycs")) {
          var link = url.substring(0, url.indexOf("coycs"));
          var psw = url.substring(url.indexOf("coycs") + 5, url.lastIndexOf("coycs"));
          localStorage.setItem(link, psw);
          window.location.href = link;
      }
      if (pwd) {
          var passwddiv_btn = document.getElementsByClassName("passwddiv-btn")[0];
          var btnpwd = document.getElementsByClassName("btnpwd")[0];
          // 输入提取码
          pwd.value = localStorage.getItem(url);
          // 确认提取码
          if (passwddiv_btn) {
              passwddiv_btn.click();
          } else if (btnpwd) {
              btnpwd.click();
          }
          // localStorage.removeItem(url);
      }
  }
})();