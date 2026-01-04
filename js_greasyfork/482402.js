// ==UserScript==
// @name        煎蛋树洞屏蔽用户
// @namespace   Violentmonkey Scripts
// @match       https://*.jandan.net/treehole*
// @grant       none
// @version     1.0
// @author      wekbiu
// @description 根据用户名屏蔽洞主和吐槽
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/482402/%E7%85%8E%E8%9B%8B%E6%A0%91%E6%B4%9E%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/482402/%E7%85%8E%E8%9B%8B%E6%A0%91%E6%B4%9E%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

const blockUsers = ["xxx"]; // 要屏蔽的用户名，格式：["a","b","c"]

// 屏蔽洞主
const commentNodes = document.querySelectorAll("li[id^=comment]");
const commentAuthorNode = location.host === "i.jandan.net" ? "b" : "strong";
let author = "";
commentNodes.forEach((v) => {
  author = v.querySelector(commentAuthorNode).textContent;
  if (blockUsers.includes(author)) {
    v.remove();
  }
});

// 屏蔽吐槽
// 方法：改写 ajax 请求，过滤获取的数据。
// 缺点：吐槽中若有 @被屏蔽用户，点击 @被屏蔽用户 不显示内容；吐槽数量与按钮显示的不符合。
window.addEventListener("load", () => {
  window.tucao_load_content = function (e, d, c) {
    var a = $(
      '<div class="jandan-tucao" id="jandan-tucao-' + d + '">数据加载中....biubiubiu....</div>',
    );
    e.append(a);
    var b = "/api/tucao/list/" + d;
    if (c) {
      b = "/api/tucao/all/" + d;
    }
    $.ajax({
      url: b,
      method: "GET",
      dataType: "json",
      success: function (h) {
        if (h.code != 0) {
          alert(h.msg);
          return;
        }
        a.empty();
        h.hot_tucao = h.hot_tucao.filter((v) => !blockUsers.includes(v.comment_author));
        h.tucao = h.tucao.filter((v) => !blockUsers.includes(v.comment_author));
        if (h.hot_tucao && h.hot_tucao.length) {
          console.log("debug", h.hot_tucao);
          tucao_show_hot(a, h.hot_tucao);
        }
        tucao_show_list(a, h.tucao);
        if (!c && h.tucao && h.tucao.length >= 10) {
          console.log("debug", h.tucao);
          tucao_show_more_btn(a, d);
        }
        if (!c) {
          tucao_show_close_btn(a, d);
        }
        tucao_show_form(a, d);
        var f = $("#tucao-gg");
        f.css({ left: 0, position: "static", display: "block" });
        f.appendTo(a);
        if (window.location.hash && window.location.hash == "#more") {
          var g = $(".tucao-list .tucao-row");
          if (g.length > 10) {
            $("body").velocity("scroll", { offset: $(g[14]).offset().top });
          }
        }
      },
      error: function (f) {
        a.html("hmm....something wrong...");
      },
    });
  };
});
