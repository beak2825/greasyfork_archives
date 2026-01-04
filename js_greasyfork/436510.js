// ==UserScript==
// @name         book_douban_ChangShaLib
// @name:zh-CN         豆瓣读书-想读-长沙图书馆信息
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为豆瓣读书用户想读页面的图书，添加长沙图书馆馆藏查询结果
// @author       You
// @match        https://book.douban.com/people/*/wish*
// @match        https://book.douban.com/people/*/wish
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436510/book_douban_ChangShaLib.user.js
// @updateURL https://update.greasyfork.org/scripts/436510/book_douban_ChangShaLib.meta.js
// ==/UserScript==

var Debug = true;
var Reset = false;
var I = 0;
var TITLE, Booklist, CardNodes, Nodes, QueryResult, Done;
var UID = document.URL.split("/")[4];
var Total = document
  .getElementsByClassName("subject-num")[0]
  .innerText.split("/")[1];
var DoubanUrl = document.URL;
var OpacUrl = "https://opac.changshalib.cn/opac/search?&q=";
var SearchParam =
  "&searchWay=title&sortWay=title200Weight&sortOrder=desc&scWay=dim&hasholding=1&searchSource=reader";

function log(info) {
  if (Debug) console.log(info);
}

function queryHolding(Title, i) {
  log(i + "查询:" + Title);
  GM_xmlhttpRequest({
    method: "GET",
    url: OpacUrl + Title + SearchParam,
    onload: function (response) {
      var webText = response.responseText;
      QueryResult = webText.substring(
        webText.indexOf("检索到: ") + 5,
        webText.indexOf(" 条结果")
      );

      GM_setValue(UID + Title, QueryResult);

      if (QueryResult == "You ") {
        queryHolding(Title, i);
        return 0;
      }

      if (QueryResult != "0") {
        addLink(QueryResult, i, Title);
        GM_setValue(UID, GM_getValue(UID) + 1);
      }
      showStats(i);
    },
    onerror: function () {
      log("连接失败");
    },
  });
}

function addLink(QueryResult, i, Title) {
  var FontColor = "red";
  Nodes = document.createElement("span");
  Nodes.class = "cart-info";
  Nodes.innerHTML =
    '<span class="cart-info"><span class="add2cartWidget "><a target="_blank" href="' +
    OpacUrl +
    Title +
    SearchParam +
    '"class="j  a_add2cart add2cart"name="4827310"><span>长沙图书馆(<b style="color:' +
    FontColor +
    '">' +
    QueryResult +
    "</b>)</span></a></span></span>";
  CardNodes[i].appendChild(Nodes);
}

function showStats(i) {
  log(i);
  i == Booklist.length - 2 ? (Done = "red") : (Done = "");
  if (document.getElementById("LibStats")) {
    document.getElementById("LibStats").innerHTML =
      "已找到(<span style='color:" +
      Done +
      "'>" +
      GM_getValue(UID) +
      "</span>/" +
      Total +
      ")";
  } else {
    var dot = document.createElement("span");
    dot.className = "gray-dot";
    dot.innerText = ".";

    var span = document.createElement("span");
    span.id = "LibStats";
    span.innerHTML = span.innerHTML =
      "已找到(" + GM_getValue(UID) + "/" + Total + ")";

    document.getElementsByClassName("sort")[0].appendChild(dot);
    document.getElementsByClassName("sort")[0].appendChild(span);
  }
}

function resetCache() {
  for (var i = 0; i < GM_listValues().length; i++) {
    GM_deleteValue(GM_listValues()[0]);
  }
}

(function () {
  Booklist = document.getElementsByTagName("h2");
  CardNodes = document.getElementsByClassName("cart-actions");

  if (Reset) resetCache();
  if (GM_getValue(UID) == undefined) GM_setValue(UID, 0);

  for (var i = I; i < Booklist.length - 1; i++) {
    TITLE = Booklist[i].innerText;
    if ( GM_getValue(UID + TITLE) != undefined && GM_getValue(UID + TITLE) != "You " ) {
      log("缓存:" + TITLE + GM_getValue(UID + TITLE));
      showStats(i);
      if (GM_getValue(UID + TITLE) != "0") {
        addLink(GM_getValue(UID + TITLE), i, TITLE);
      }
    } else {
      (function (t, a) {
        setTimeout(function () {
          queryHolding(t, a);
        }, 500 * a);
      })(TITLE, i);
    }
  }
})();
