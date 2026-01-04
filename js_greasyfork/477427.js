// ==UserScript==
// @name         布米米优化
// @copyright    2023, hlight
// @namespace    http://xxxxx.hihihihihihihi.com
// @version      0.1
// @description  布米米优化，去广告，下一集
// @author       hlight
// @include      /^http:\/\/m\.bumimi\d+\.com\/.*/
// @grant        GM_addStyle
// @grant        GM_addScript
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_log
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/477427/%E5%B8%83%E7%B1%B3%E7%B1%B3%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/477427/%E5%B8%83%E7%B1%B3%E7%B1%B3%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function () {
  "use strict";
  let URL = window.location.href;
  var pt_vedio = /^http:\/\/m\.bumimi\d+\.com\/acg\/\d+\/\d+\.html(\?.*)?$/; //动漫播放页正则表达式

  //一共有多少集
  function getEpSum() {
    let $eplist = $(".main").children().eq(6).find(".tabCon");
    let sum = $eplist.find("ul[style!='display: none;']").find("li").length;
    return sum;
  }
  //这集是第几集，-1表示没有
  function getEpNum() {
    let num = -1;
    let p = URL.lastIndexOf("/"),
      q = URL.lastIndexOf(".");
    if (p !== -1 && q !== -1 && p < q) {
      num = parseInt(URL.substring(p + 1, q));
    }
    return num;
  }
  //当前是否是最后一集
  function isLastEp() {
    if (getEpNum() == getEpSum()) {
      return true;
    }
    return false;
  }
  //当前是否是第一集
  function isFirstEp() {
    if (getEpNum() == 1) {
      return true;
    }
    return false;
  }
  function getURLInfo() {
    return URL.slice(URL.lastIndexOf("/") + 1);
  }
  function modifyURLInfo(text, num) {
    return text.replace(/^\d+/, num);
  }

  //如果是动漫播放页
  if (pt_vedio.test(URL)) {
    //删除丑陋的界面
    let $disc = $(".main").children().eq(3);
    $disc.hide();
    let $tab = $(".main").children().eq(2).find("p");
    $tab.children().eq(2).children("a").text("  刷新");
    //上下一集
    console.log("插入按钮");
    let $btn_prev = $tab.children().eq(0).clone(),
      $btn_next = $tab.children().eq(0).clone();
    let link = getURLInfo();
    if (!isFirstEp()) {
      $btn_prev.children("a").text("  上一集");
      $btn_prev.find("a").attr("href", modifyURLInfo(link, getEpNum() - 1));
      $btn_prev.insertAfter($tab.children().eq(2));
    }
    if (!isLastEp()) {
      $btn_next.children("a").text("  下一集");
      $btn_next.find("a").attr("href", modifyURLInfo(link, getEpNum() + 1));
      $btn_next.insertAfter($tab.children().eq(3));
    }
  } else {
  }

  //删除广告
  //bumimi的广告依据某个标签是否存在实时刷新，所以我们找到那个标签并删除即可，那个标签名是随机的。但是它的位置在id为uiad的标签上面。
  let $u = $("#uiad");
  $u.nextAll("br").remove();
  $u.prev("div").remove();
  console.log("开始清除广告");
  let keep = true;
  function checkAD() {
    $u.next().filter("div").remove();
    $u.prev().filter("div").remove();
    $u.next().remove().next().remove();
    if (keep) {
      setTimeout(checkAD, 1);
    }
  }
  checkAD();
})();
