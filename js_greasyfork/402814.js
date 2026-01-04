// ==UserScript==
// @name         职培云  助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  “中国职业培训在线”一键完成所有视频 节省宝贵时间
// @author       xhy1994
// @match        *://pxclass.px.xueyanshe.com/index/index/packagestudy?*
// @match        *://px.class.com.cn/index/index/packagestudy?*
// @match        *://pxclass.px.xueyanshe.com/index/index/resourceview?*
// @run-at       document-idle
// @license      MIT License
// @require      https://libs.baidu.com/jquery/2.1.1/jquery.min.js
// @supportURL   x15141132517@126.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402814/%E8%81%8C%E5%9F%B9%E4%BA%91%20%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/402814/%E8%81%8C%E5%9F%B9%E4%BA%91%20%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


"use strict";
var _extends =
  Object.assign ||
  function (a) {
    for (var c, b = 1; b < arguments.length; b++)
      for (var d in ((c = arguments[b]), c))
        Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d]);
    return a;
  };
window.onload = function () {
  setTimeout(function () {
    $("body").append(
      '\n  <div id="hack_btn"\n  style="position: fixed;top: 50px;text-align:center;z-index:9999999999999999; right:40%;padding:20px;width:200px;background: rgba(231, 142, 142, 0.575);border-radius: 15px;cursor: pointer;font-size:30px;color:#fff;font-weight:600;">\n  <p>\u89C6\u9891\u52A0\u8F7D\u5B8C\u6210\u540E\u70B9\u51FB</p>\n  <p>\u70B9\u51FB\u5B8C\u6210\u5F53\u524D\u89C6\u9891\u8BFE<br/>\n  \uFF01\uFF01\uFF01\u4E00\u4E2A\u89C6\u9891\u70B9\u51FB\u4E00\u6B21\u5373\u53EF\uFF01\uFF01\uFF01<br/>\n  \u52FF\u91CD\u590D\u70B9\u51FB\n  </p>\n  <p>-----<a style="color:#f40;" href="https://greasyfork.org/zh-CN/scripts/401475-%E4%B8%AD%E5%9B%BD%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD-%E5%8A%A9%E6%89%8B">C\u9738\u9738\u51FA\u54C1</a>-----</p>\n\n\n  </div>\n  '
    );
    var b = window.location.host,
      c = (function () {
        var j = location.search,
          k = {};
        if (-1 != j.indexOf("?"))
          for (var l = j.substr(1), m = l.split("&"), n = 0; n < m.length; n++)
            k[m[n].split("=")[0]] = unescape(m[n].split("=")[1]);
        return k;
      })(),
      d = c.parent_id,
      e = c.rid,
      f = c.item_id,
      g = c.pid,
      h = function () {
        var k = " http://".concat(
          b,
          "/console/resource/student/authorize/detailProgress"
        );
        $.ajax({
          type: "get",
          url: k,
          async: !1,
          data: { package_id: g, authorize_id: d },
          success: function (m) {
            1e3 === m.code &&
              (function () {
                var n = m.data.length,
                  o = m.data;
                $("#hack_wait").append(
                  "\n          <h4>\u83B7\u53D6\u5230\u5F53\u524D\u9875\u5171".concat(
                    n + 1,
                    "\u4E2A\u89C6\u9891\uFF0C\u6B63\u5728\u8FDB\u884C\u64CD\u4F5C...</h4>\n        "
                  )
                );
                for (
                  var p = {},
                    q = [],
                    r = function (u) {
                      setTimeout(function () {
                        (p.authorize_id = d),
                          (p.list_id = o[u].list_id),
                          (p.material_id = o[u].material_id),
                          (p.position = new Date().getTime()),
                          $.ajax({
                            type: "get",
                            url: "http://".concat(
                              b,
                              "/console/resource/student/authorize/updateDetail"
                            ),
                            data: _extends({}, p),
                            success: function (w) {
                              console.log(w),
                                1e3 === w.code
                                  ? $("#log_text").append(
                                      "\n                    <p>&lt;&nbsp;&nbsp;&nbsp;\u7B2C".concat(
                                        u + 1,
                                        "\u4E2A\u89C6\u9891\u5B8C\u6210&nbsp;&nbsp;&nbsp;&gt;</p>\n                  "
                                      )
                                    )
                                  : $("#log_text").append(
                                      '\n                    <p color="red">&lt;&nbsp;&nbsp;&nbsp;\u7B2C'.concat(
                                        u + 1,
                                        "\u4E2A\u89C6\u9891\u9519\u8BEF&nbsp;&nbsp;&nbsp;&gt;</p>\n                  "
                                      )
                                    ),
                                q.push(u),
                                q.length === n &&
                                  setTimeout(function () {
                                    alert(
                                      "\u64CD\u4F5C\u6210\u529F\uFF0C\u6B63\u5728\u5237\u65B0\u9875\u9762"
                                    ),
                                      location.reload();
                                  }, 500);
                            },
                          });
                      }, 500);
                    },
                    s = 0;
                  s < n;
                  s++
                )
                  r(s);
              })();
          },
        });
      };
    $("#hack_btn").click(function () {
      var j = window.location.href;
      -1 === j.indexOf("resourceview")
        ? ($("body").append(
            '\n  <style>\n  #hack_wait {\n    box-sizing: border-box;\n    z-index:999999999999999999999999999;\n    padding: 100px;\n    position: fixed;\n    background: rgba(0, 0, 0, .9);\n    top: 0;\n    left: 0;\n    width: 100vw;\n    height: 100vh;\n    text-align: center;\n    font-size: 50px;\n    color: #fff;\n  }\n    #log_text{\n      display:flex;\n      display: -webkit-flex;\n      justify-content: start;\n      flex-direction: row;\n      flex-wrap: wrap;\n    }\n  #hack_wait #log_text p{\n    padding:0 10px;\n    text-align: left;\n    margin: 0;\n    padding: 0;\n    font-size: 14px;\n  }\n</style>\n<div id="hack_wait">\n  <h3>\u6B63\u5728\u64CD\u4F5C...</h3>\n  <div id="log_text"></div>\n</div>\n  '
          ),
          setTimeout(function () {
            h();
          }, 1e3))
        : (console.log(j),
          custom_player_stop(),
          setTimeout(function () {
            alert("\u5B8C\u6210"), history.go(0);
          }, 500));
    });
  }, 2e3);
};
