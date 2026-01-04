// ==UserScript==
// @name         企查查企业信息获取
// @namespace    前端阿轩
// @version      0.1.2
// @description  用来直接获取企查查企业信息，新增有效性
// @author       前端阿轩
// @match        https://www.qcc.com/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446894/%E4%BC%81%E6%9F%A5%E6%9F%A5%E4%BC%81%E4%B8%9A%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/446894/%E4%BC%81%E6%9F%A5%E6%9F%A5%E4%BC%81%E4%B8%9A%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("加载前端阿轩企查查插件");
  var buttonxm = document.createElement("button"); //创建一个input对象（提示框按钮）
  buttonxm.id = "id001";
  buttonxm.textContent = "获取姓名";
  buttonxm.style.width = "80px";
  buttonxm.style.height = "50px";
  buttonxm.style.align = "center";
  var phon = document
    .getElementsByClassName(
      "ant-table-row-cell-ellipsis ant-table-row-cell-break-word"
    )[5]
    .textContent.split(" ")[1];
  buttonxm.onclick = function () {
    if (phon.length > 11) {
      var name =
        document.getElementsByClassName(
          "ant-table-row-cell-ellipsis ant-table-row-cell-break-word"
        )[1].textContent + "(人事部门)";
      GM_setClipboard(name);
      return;
    }
    var name = document.getElementsByClassName(
      "ant-table-row-cell-ellipsis ant-table-row-cell-break-word"
    )[1].textContent;
    GM_setClipboard(name);
    return;
  };
  // 电话
  var buttondh = document.createElement("button"); //创建一个input对象（提示框按钮）
  buttondh.id = "id001";
  buttondh.textContent = "获取电话";
  buttondh.style.width = "80px";
  buttondh.style.height = "50px";
  buttondh.style.align = "center";
  buttondh.onclick = function () {
    GM_setClipboard(phon);
    return;
  };
  //   地址
  var buttondz = document.createElement("button"); //创建一个input对象（提示框按钮）
  buttondz.id = "id001";
  buttondz.textContent = "获取地址";
  buttondz.style.width = "80px";
  buttondz.style.height = "50px";
  buttondz.style.align = "center";
  buttondz.onclick = function () {
    var dz = document.getElementsByClassName(
      "ant-table-row-cell-ellipsis ant-table-row-cell-break-word"
    )[8].textContent;
    GM_setClipboard(dz);
    return;
  };

// 企业有效性
   var buttonyxx = document.createElement("button"); //创建一个input对象（提示框按钮）
  buttonyxx.id = "id001";
  buttonyxx.textContent = "有效性";
  buttonyxx.style.width = "80px";
  buttonyxx.style.height = "50px";
  buttonyxx.style.marginRight = "5px";
  buttonyxx.style.align = "center";
  buttonyxx.onclick = function () {
    var yxx = document
    .getElementsByClassName(
      "ant-table-row-cell-ellipsis ant-table-row-cell-break-word"
    )[4].textContent;
    GM_setClipboard(yxx);
    return;
  };

  var x = document.getElementsByClassName("npanel-heading")[1];
  //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
  x.appendChild(buttondz);
  x.appendChild(buttonxm);
  x.appendChild(buttondh);
  x.appendChild(buttonyxx);

  //var y = document.getElementById('s_btn_wr');
  //y.appendChild(button);
})();
