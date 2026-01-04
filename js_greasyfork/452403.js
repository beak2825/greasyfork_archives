// ==UserScript==
// @name         免登录城通网盘直链快速下载 精简页面
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  全网首发城通网盘免登录直链快速下载插件 痴痴资源网www.chichisvip.com发布
// @author       ddpp
// @match        *://*/*
// @icon         https://webapi.ctfile.com/assets/img/favicons/mstile-150x150.png
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/452403/%E5%85%8D%E7%99%BB%E5%BD%95%E5%9F%8E%E9%80%9A%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD%20%E7%B2%BE%E7%AE%80%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/452403/%E5%85%8D%E7%99%BB%E5%BD%95%E5%9F%8E%E9%80%9A%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD%20%E7%B2%BE%E7%AE%80%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
/* globals file_id */
(function () {
  "use strict";

  function Download(content) {
    var eleLink = document.createElement("a");
    eleLink.style.display = "none";
    eleLink.href = content;
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
  }
  //等待元素加载完毕
  function waitForKeyElements(
    selectorOrFunction,
    callback,
    waitOnce,
    interval,
    maxIntervals
  ) {
    if (typeof waitOnce === "undefined") {
      waitOnce = true;
    }
    if (typeof interval === "undefined") {
      interval = 300;
    }
    if (typeof maxIntervals === "undefined") {
      maxIntervals = -1;
    }
    var targetNodes =
      typeof selectorOrFunction === "function"
        ? selectorOrFunction()
        : document.querySelectorAll(selectorOrFunction);

    var targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
      targetNodes.forEach(function (targetNode) {
        var attrAlreadyFound = "data-userscript-alreadyFound";
        var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
        if (!alreadyFound) {
          var cancelFound = callback(targetNode);
          if (cancelFound) {
            targetsFound = false;
          } else {
            targetNode.setAttribute(attrAlreadyFound, true);
          }
        }
      });
    }

    if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
      maxIntervals -= 1;
      setTimeout(function () {
        waitForKeyElements(
          selectorOrFunction,
          callback,
          waitOnce,
          interval,
          maxIntervals
        );
      }, interval);
    }
  }

  //判断是否为手机页面
  function mobile() {
    //判断数值是否存在
    if (typeof GM_getValue("mobile") === "undefined") {
      var mode = {
        mode: "1"
      };
      GM_setValue("mobile", mode);
      location.reload();
    }
    //一般用不到 防止用户切换界面
    if (GM_getValue("mobile").mode === "0") {
      var error;
      var r = confirm(
        "使用的是手机版网页吗？ 如果是请点击确定 手机版如果不能使用请及时更新脚本 确认后大约需要加载2秒 请耐心等待"
      );
      if (r == true) {
        GM_setValue("mobile", mode);
        location.reload();
      } else {
        error =
          "很抱歉 不开启会影响脚本使用 如果判断错误请联系作者恢复 如果是直接进入此网页 请尝试刷新网页";
        document.write(error);
      }
    }
  }
  waitForKeyElements(' [class="alert alert-light mb-0"]', mobile);
  //判断是否为电脑界面
  function pc() {
    //判断数值是否存在
    if (typeof GM_getValue("mobile") === "undefined") {
      var mode = {
        mode: "0"
      };
      GM_setValue("mobile", mode);
      location.reload();
    }
    //一般用不到 防止用户切换界面
    if (GM_getValue("mobile").mode === "1") {
      var error;
      var r = confirm(
        "使用的是电脑网页吗？如果是请点击确定 确认后大约需要加载2秒 请耐心等待"
      );
      if (r == true) {
        GM_setValue("mobile", mode);
        location.reload();
      } else {
        error =
          "很抱歉 不开启会影响脚本使用 如果判断错误请联系作者恢复 如果直接进入此网页 请尝试刷新网页";
        document.write(error);
      }
    }
  }
  waitForKeyElements(' [class="btn btn-warning ml-3"]', pc);
  //当检测为下载界面时执行的代码
  if (window.location.pathname.split("/")[1].indexOf("f") == 0) {
    //判断是否为电脑界面
    if (GM_getValue("mobile").mode === "0") {
      //显示VIP下载
      function vipdown() {
        document.getElementsByClassName("card-deck")[0].style.display = "block";
        document.getElementsByClassName("card-deck")[1].style.display = "none";
      }
      //隐藏购买VIP
      waitForKeyElements(' [class="card-deck"]', vipdown);
      function buyvip() {
        document.getElementsByClassName("row no-gutters")[1].style.display =
          "none";
      }
      waitForKeyElements(' [class="row no-gutters"]', buyvip);
      //隐藏广告
      function webad() {
        document.getElementsByClassName("card bg-light mb-3")[2].style.display =
          "none";
      }
      waitForKeyElements(' [class="card bg-light mb-3"]', webad);
      //对于一些不支持的功能进行隐藏
      function notsupport() {
        document.getElementsByClassName("mb-3")[1].style.display = "none";
      }
      waitForKeyElements(' [class="mb-3"]', notsupport);
      //重写下载按钮
      function dxdown() {
        document.getElementsByClassName(
          "btn btn-outline-secondary fs-1 mt-3"
        )[0].onclick = function dxdown() {
          var downurl =
            "https://apid1.ctfile.workers.dev/电信/?file=" + file_id;
          Download(downurl);
        };
      }
      waitForKeyElements(
        ' [class="btn btn-outline-secondary fs-1 mt-3"]',
        dxdown
      );
      function ltdown() {
        document.getElementsByClassName(
          "btn btn-outline-info fs-1 mt-3"
        )[0].onclick = function ltdown() {
          var downurl =
            "https://apid1.ctfile.workers.dev/联通/?file=" + file_id;
          Download(downurl);
        };
      }
      waitForKeyElements(' [class="btn btn-outline-info fs-1 mt-3"]', ltdown);
      function yddown() {
        document.getElementsByClassName(
          "btn btn-outline-dark fs-1 mt-3"
        )[0].onclick = function yddown() {
          var downurl =
            "https://apid1.ctfile.workers.dev/移动/?file=" + file_id;
          Download(downurl);
        };
      }
      waitForKeyElements(' [class="btn btn-outline-dark fs-1 mt-3"]', yddown);
      //隐藏推广搜索按钮
      function searchad() {
        document.getElementsByClassName("nav-item")[0].style.display = "none";
      }
      waitForKeyElements(' [class="nav-item"]', searchad);
    }
  }
  //判断是否为手机界面
  if (GM_getValue("mobile").mode === "1") {
    //显示VIP下载
    function vipdown() {
      document.getElementsByClassName("card-deck")[0].style.display = "block";
      document.getElementsByClassName("card-deck")[1].style.display = "none";
    }
    waitForKeyElements(' [class="card-deck"]', vipdown);
    //隐藏广告
    function webad() {
      document.getElementById("mobile-500x200").style.display = "none";
    }
    waitForKeyElements(' [id="mobile-500x200"]', webad);
    //重写下载按钮
    function down() {
      document.getElementsByClassName(
        "btn btn-outline-secondary fs-1 mt-3"
      )[0].innerText = "电信下载";
      document.getElementsByClassName(
        "btn btn-outline-secondary fs-1 mt-3"
      )[0].onclick = function () {
        var downurl = "https://apid1.ctfile.workers.dev/电信/?file=" + file_id;
        Download(downurl);
      };
      let lt = document.createElement("a");
      lt.innerText = "联通下载";
      lt.className = "btn btn-outline-secondary fs-1 mt-3";
      lt.onclick = function () {
        var downurl = "https://apid1.ctfile.workers.dev/联通/?file=" + file_id;
        Download(downurl);
      };
      document
        .getElementsByClassName("card-body position-relative")[0]
        .append(lt);
      let yd = document.createElement("a");
      yd.innerText = "移动下载";
      yd.className = "btn btn-outline-secondary fs-1 mt-3";
      yd.onclick = function () {
        var downurl = "https://apid1.ctfile.workers.dev/移动/?file=" + file_id;
        Download(downurl);
      };
      document
        .getElementsByClassName("card-body position-relative")[0]
        .append(yd);
    }
    waitForKeyElements(' [class="btn btn-outline-secondary fs-1 mt-3"]', down);
  }

  //当检测为目录界面时执行的代码
  if (window.location.pathname.split("/")[1].indexOf("d") == 0) {
    //判断是否为电脑节目
    if (GM_getValue("mobile").mode === "0") {
      //隐藏网站广告
      function webad() {
        document.getElementsByClassName("card bg-light mb-3")[1].style.display =
          "none";
      }
      waitForKeyElements(' [class="card bg-light mb-3"]', webad);
      //对于一些不支持的功能进行隐藏或提示
      function notsupport() {
        document.getElementsByClassName(
          "btn btn-falcon-default mr-2"
        )[2].style.display = "none";
        document.getElementsByClassName(
          "btn btn-falcon-default mr-2"
        )[3].style.display = "none";
        document.getElementsByClassName(
          "btn btn-falcon-default mr-2"
        )[5].style.display = "none";
        document.getElementsByClassName(
          "btn btn-falcon-default mr-2"
        )[4].onclick = function down() {
          alert(
            "很抱歉 此功能暂时无法实现 因为本脚本使用的是cloudflare workers进行解析 访问较慢且较难实现"
          );
        };
      }
      waitForKeyElements(' [id="dashboard-actions"]', notsupport);
      //隐藏推广搜索按钮
      function searchad() {
        document.getElementsByClassName("nav-item")[0].style.display = "none";
      }
      waitForKeyElements(' [class="nav-item"]', searchad);
    }
    //判断是否为手机界面
    if (GM_getValue("mobile").mode === "1") {
      //去除搜索广告
      function searchad() {
        document.getElementsByClassName(
          "btn btn-warning btn-sm"
        )[0].style.display = "none";
        document.getElementsByClassName("btn btn-info btn-sm")[0].style =
          "position: absolute;bottom: 0px;right: 0px;";
      }
      waitForKeyElements(' [class="btn btn-warning btn-sm"]', searchad);
    }
  }
})();