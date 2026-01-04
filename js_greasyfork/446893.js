// ==UserScript==
// @name         2.0boss获取职业，公司名，工资信息获取
// @namespace    建议配合前端阿轩邮编，和企查查插件使用
// @version      2.1
// @description  boss建议配合前端阿轩邮编，和企查查插件使用
// @author       前端阿轩
// @match        https://www.zhipin.com/*
// @license      MIT
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/446893/20boss%E8%8E%B7%E5%8F%96%E8%81%8C%E4%B8%9A%EF%BC%8C%E5%85%AC%E5%8F%B8%E5%90%8D%EF%BC%8C%E5%B7%A5%E8%B5%84%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/446893/20boss%E8%8E%B7%E5%8F%96%E8%81%8C%E4%B8%9A%EF%BC%8C%E5%85%AC%E5%8F%B8%E5%90%8D%EF%BC%8C%E5%B7%A5%E8%B5%84%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 删除
  document.getElementsByClassName("btn btn-startchat")[0].remove();
  // 企业名称
  console.log("加载前端阿轩插件");
  var buttonname = document.createElement("button"); //创建一个input对象（提示框按钮）
  buttonname.className = "btn btn-startchat";
  buttonname.textContent = "获取企业名称";
  buttonname.onclick = function () {
    var name = document.getElementsByClassName("name")[8].textContent;
    GM_setClipboard(name);
    var MyURL = [
      "https://www.qcc.com/web/search?key=" + name + "&isTable=true", "https://www.youbianku.com/SearchResults?address=" + name,
    ];
    for (var i = 0; i < MyURL.length; i++) {
      let url = MyURL[i];
      window.open(MyURL[i]);
    }

    return;
  };

  // 职位
  var buttonzw = document.createElement("button"); //创建一个input对象（提示框按钮）
  buttonzw.className = "btn btn-startchat";
  buttonzw.textContent = "获取职位";
  buttonzw.onclick = function () {
    var zw = document.getElementsByClassName("job-title")[0].textContent;
    GM_setClipboard(zw);
    return;
  };

  // 工资
  var buttongz = document.createElement("button"); //创建一个input对象（提示框按钮）
  buttongz.className = "btn btn-startchat";
  buttongz.textContent = "获取工资";
  buttongz.onclick = function () {
    var gz = document
      .getElementsByClassName("badge")[0]
      .textContent.replace("K", "000元")
      .replace("-", "000-");
    GM_setClipboard(gz);
    return;
  };

  var x = document.getElementsByClassName("btn-container")[0];
  //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
  x.appendChild(buttonname);
  x.appendChild(buttonzw);
  x.appendChild(buttongz);

  //var y = document.getElementById('s_btn_wr');
  //y.appendChild(button);
})();
