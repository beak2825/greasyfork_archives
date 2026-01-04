// ==UserScript==
// @name        拼夕夕知网屁俩下载 (检索目录批量下载）
// @namespace   Cowvirgina
// @match       *://119.45.237.51/*
// @match       *://119.45.145.238/*
// @match       *://kns.cnki.net/*
// @grant       none
// @version     2.0
// @author      Cowvirgina
// @description 4/22/2023, 1:30:28 AM
// @run-at      document-start
// @license     MIT

// @downloadURL https://update.greasyfork.org/scripts/464605/%E6%8B%BC%E5%A4%95%E5%A4%95%E7%9F%A5%E7%BD%91%E5%B1%81%E4%BF%A9%E4%B8%8B%E8%BD%BD%20%28%E6%A3%80%E7%B4%A2%E7%9B%AE%E5%BD%95%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/464605/%E6%8B%BC%E5%A4%95%E5%A4%95%E7%9F%A5%E7%BD%91%E5%B1%81%E4%BF%A9%E4%B8%8B%E8%BD%BD%20%28%E6%A3%80%E7%B4%A2%E7%9B%AE%E5%BD%95%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%EF%BC%89.meta.js
// ==/UserScript==

// 没用过正经知网，不知道好不好使，反正拼夕夕知网的好使就行

var intervalID = setInterval(() => {
  if (!document.querySelector("#new_downbutton") && document.querySelector("#gridTable")) {
    'use strict';
    // 加个按钮
    const html = document.querySelector("#batchOpsBox");

    const button = document.createElement('a');

    const hello_box = document.createElement('div');

    const hello_p = document.createElement('p');


    button.id = 'new_downbutton';
    button.innerHTML = '屁俩下载';
    button.style = "float: left;height: 22px;padding: 2px 10px;line-height: 22px;white-space: nowrap;border: 1px solid #d6d6d6;background-color: #ff000080;cursor: pointer;"
    button.onmouseover = function () { $("#hello-box").show("fast");};
    button.onmouseout = function () { $("#hello-box").fadeOut(); };


    hello_box.id = "hello-box";
    hello_box.style ="position: absolute; top: 150px; right: 300px; height: 220px; width: 260px; padding: 2px 10px; line-height: 22px; white-space: nowrap; border: 1px solid rgb(214, 214, 214); background-color: rgba(255, 0, 0, 0.5); cursor: pointer";

    hello_p.style = "margin-top:20px;text-align: center; font-size: 20px; overflow-wrap: break-word; white-space: normal"
    hello_p.innerHTML = "注意事项：有一个‘覆水难收’的BUG。首次使用时：1、先允许页面重复弹窗；2、关闭每次下载都要询问。使用说明：点击名为 屁俩下载 的红色按钮，自动下载当前页面的显示的所有文献。别急，让子弹飞会！";

    html.appendChild(hello_box);
    document.querySelector("#hello-box").appendChild(hello_p);
    html.appendChild(button);


    const table = document.querySelector("#gridTable > table > tbody");
    const tr = table.querySelectorAll('tr > td.operat');

    button.addEventListener('click', () => {

      alert("准备开始下载，预计下载文章共" + tr.length + "篇。");
      tr.forEach(
        res => {
          const a = res.querySelector("a.downloadlink.icon-notlogged");
          a.click();

          //加个延迟让网速反应一会
          //主要别让他同时弹好几个窗，就行，太频繁好像会限制访问
          sleep(8000);
        }
      )
      alert("脚本执行已完成！下载有没有完成就不知道了~");
    });
    //简陋的sleep
    function sleep(delay) {
      var start = (new Date()).getTime();
      while ((new Date()).getTime() - start < delay) {
        continue;
      }
    }
  }
}, 3000)
