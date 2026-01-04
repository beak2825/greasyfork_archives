// ==UserScript==
// @name         推特快捷按键
// @namespace    http://121.4.126.142/
// @version      1.1
// @description  设置返回顶部、返回上一页、刷新页面三个按钮
// @author       You
// @match        https://twitter.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455775/%E6%8E%A8%E7%89%B9%E5%BF%AB%E6%8D%B7%E6%8C%89%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/455775/%E6%8E%A8%E7%89%B9%E5%BF%AB%E6%8D%B7%E6%8C%89%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    var btn = document.createElement("button");
    // 按钮文字
    btn.innerText = "⇦";
    // 添加按钮的样式类名class值为back
    btn.setAttribute("class", "back");
    // 生成style标签
    var style = document.createElement("style");
    // 把样式写进去
    style.innerText = `.back{position: fixed;
              top: 380px;
              right:35%;
              width: 50px;
              height: 50px;
              padding: 0px 0px;
              border: 0px solid #0d6efd;
              cursor: pointer;
              color: #0d6efd;
              font-size: 40px;
              background-color: transparent;
              border-radius: 5px;
              transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
              z-index: 9999999999999;
            }
            .back:hover {
              background-color: #0d6efd;
              color: rgb(255, 255, 255);}`;
    // 在head中添加style标签
    document.head.appendChild(style);
    // 在body中添加button按钮
    document.body.appendChild(btn);
    //给btn添加title
    btn.setAttribute("title", "返回返回上一页");
    // 点击按钮去执行回到顶部函数
    document.querySelector(".back").addEventListener("click", function () {
        history.go(-1);
    });
    //以下为返回顶部按键
    var btn1 = document.createElement("button");
    // 按钮文字
    btn1.innerText = "⇧";
    // 添加按钮的样式类名class值为back
    btn1.setAttribute("class", "bakcTop");
    // 生成style标签
    var style1 = document.createElement("style");
    // 把样式写进去
    style1.innerText = `.bakcTop{position: fixed;
            top: 340px;
            right:35%;
            width: 50px;
            height: 50px;
            padding: 0px 0px;
            border: 0px solid #0d6efd;
            cursor: pointer;
            color: #0d6efd;
            font-size: 40px;
            background-color: transparent;
            border-radius: 5px;
            transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
            z-index: 9999999999999;
          }
          .bakcTop:hover {
            background-color: #0d6efd;
            color: rgb(255, 255, 255);}`;
    // 在head中添加style标签
    document.head.appendChild(style1);
    // 在body中添加button按钮
    document.body.appendChild(btn1);
    //给btn添加title
    btn1.setAttribute("title", "返回顶部");
    // 点击按钮去执行回到顶部函数
    document.querySelector(".bakcTop").addEventListener("click", function () {
        window.scrollTo(0, 0);
    });
    //以下为刷新页面按键
    var btn2 = document.createElement("button");
    // 按钮文字
    btn2.innerText = "↻";
    // 添加按钮的样式类名class值为back
    btn2.setAttribute("class", "reload");
    // 生成style标签
    var style2 = document.createElement("style");
    // 把样式写进去
    style2.innerText = `.reload{position: fixed;
            top: 420px;
            right:35%;
            width: 50px;
            height: 50px;
            padding: 0px 0px;
            border: 0px solid #0d6efd;
            cursor: pointer;
            color: #0d6efd;
            font-size: 40px;
            background-color: transparent;
            border-radius: 5px;
            transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
            z-index: 9999999999999;
          }
          .reload:hover {
            background-color: #0d6efd;
            color: rgb(255, 255, 255);}`;
    // 在head中添加style标签
    document.head.appendChild(style2);
    // 在body中添加button按钮
    document.body.appendChild(btn2);
    //给btn添加title
    btn2.setAttribute("title", "刷新页面");
    // 点击按钮去执行回到顶部函数
    document.querySelector(".reload").addEventListener("click", function () {
        location.reload();
    });
    //以下为展开回复
      window.addEventListener("scroll", function () {
        var zhongjian = document.getElementsByTagName("span");
        for (let i = 0; i < zhongjian.length; i++) {
          if (
            // zhongjian[i].innerHTML === "显示回复" ||
            // zhongjian[i].innerHTML === "显示更多回复" ||
            zhongjian[i].innerHTML === "显示"
          ) {
            zhongjian[i].click();
          } else {
            continue;
          }
        }
      });

})();