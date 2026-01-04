// ==UserScript==
// @name         58同城获取职业，公司名，工资信息获取
// @namespace    建议配合前端阿轩邮编，和企查查插件使用
// @version      1.4.2
// @description   建议配合前端阿轩邮编，和企查查插件使用，优化了邮编查询地址，修复了薪资面议的工资情况
// @author       前端阿轩
// @match        https://*.58.com/*
// @license MIT
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/446907/58%E5%90%8C%E5%9F%8E%E8%8E%B7%E5%8F%96%E8%81%8C%E4%B8%9A%EF%BC%8C%E5%85%AC%E5%8F%B8%E5%90%8D%EF%BC%8C%E5%B7%A5%E8%B5%84%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/446907/58%E5%90%8C%E5%9F%8E%E8%8E%B7%E5%8F%96%E8%81%8C%E4%B8%9A%EF%BC%8C%E5%85%AC%E5%8F%B8%E5%90%8D%EF%BC%8C%E5%B7%A5%E8%B5%84%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 删除
  document
    .getElementsByClassName("btn btn-orange btn-large applyJobBtn")[0]
    .remove();
  document.getElementsByClassName("pos_operate_list")[0].remove();
  document.getElementsByClassName('recjob_layer').remove;
  // 企业名称
  console.log("加载前端阿轩插件");
  var dz = document.getElementsByClassName('pos-area')[0].textContent;
  var buttonname = document.createElement("button"); //创建一个input对象（提示框按钮）
  buttonname.textContent = "获取企业名称";
  buttonname.style.height = "50px";
  buttonname.style.marginRight = "10px";
  buttonname.style.padding = "5px";
  buttonname.style.background = "#ff552e";
  buttonname.style.color = "#fff";
  buttonname.style.border = "#fff";
  buttonname.style.align = "center";
  buttonname.onclick = function () {
    var name = document.getElementsByClassName("baseInfo_link")[0].textContent;
    GM_setClipboard(name);
    var MyURL = [
      "https://www.qcc.com/web/search?key=" + name + "&isTable=true",
      "https://www.youbianku.com/SearchResults?address=" + dz,
    ];
    for (var i = 0; i < MyURL.length; i++) {
      let url = MyURL[i];
      window.open(MyURL[i]);
    }
    return;
  };

  // 职位
  var buttonzw = document.createElement("button"); //创建一个input对象（提示框按钮）
  buttonzw.textContent = "获取职位";
  buttonzw.style.width = "80px";
  buttonzw.style.height = "50px";
  buttonzw.style.marginRight = "10px";
  buttonzw.style.align = "center";
  buttonzw.onclick = function () {
    var zw = document.getElementsByClassName("pos_title")[0].textContent;
    GM_setClipboard(zw);
    return;
  };

  // 工资
  var buttongz = document.createElement("button"); //创建一个input对象（提示框按钮）
  buttongz.textContent = "获取工资";
  buttongz.style.width = "80px";
  buttongz.style.height = "50px";
  buttongz.style.marginRight = "10px";
  buttongz.style.align = "center";
  buttongz.onclick = function () {
    var gz = document.getElementsByClassName("pos_salary")[0].textContent;
    if(gz === "薪资面议"){
      gz = "3000-5000元"
    }
    GM_setClipboard(gz);
    return;
  };

  // 招生人数
  var buttonrs = document.createElement("button"); //创建一个input对象（提示框按钮）
  buttonrs.textContent = "获取人数";
  buttonrs.style.width = "80px";
  buttonrs.style.height = "50px";
  buttonrs.style.marginRight = "10px";
  buttonrs.style.align = "center";
  buttonrs.onclick = function () {
    var rs = parseInt(
      document
        .getElementsByClassName("item_condition pad_left_none")[0]
        .textContent.substring(3)
    );
    if(!rs){
      var rs = 50;
    }
    GM_setClipboard(rs);
    return;
  };

  var x = document.getElementsByClassName("pos_operate")[0];
  //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
  x.appendChild(buttonname);
  x.appendChild(buttonzw);
  x.appendChild(buttonrs);
  x.appendChild(buttongz);


  //var y = document.getElementById('s_btn_wr');
  //y.appendChild(button);
})();
