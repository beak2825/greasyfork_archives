// ==UserScript==
// @name         TEMU 下载报名记录
// @namespace    http://tampermonkey.net/
// @version      2025.0.21
// @description  temu
// @author       jerry.qin@youniverse.cc
// @match        https://seller.kuajingmaihuo.com/activity/*
// @match        https://agentseller.temu.com/activity/*
// @require	     http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/dayjs.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kuajingmaihuo.com
// @grant        GM_xmlhttpRequest
// @connect      scm-app-dev.youniverse.cc
// @connect      scm-app-test.youniverse.cc
// @connect      scm-app.youniverse.cc
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531677/TEMU%20%E4%B8%8B%E8%BD%BD%E6%8A%A5%E5%90%8D%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/531677/TEMU%20%E4%B8%8B%E8%BD%BD%E6%8A%A5%E5%90%8D%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function (a, b) {
  if ("function" == typeof define && define.amd) define([], b);
  else if ("undefined" != typeof exports) b();
  else {
    b(), (a.FileSaver = { exports: {} }.exports);
  }
})(this, function () {
  "use strict";
  function b(a, b) {
    return (
      "undefined" == typeof b
        ? (b = { autoBom: !1 })
        : "object" != typeof b &&
          (console.warn("Deprecated: Expected third argument to be a object"),
          (b = { autoBom: !b })),
      b.autoBom &&
      /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(
        a.type
      )
        ? new Blob(["\uFEFF", a], { type: a.type })
        : a
    );
  }
  function c(b, c, d) {
    var e = new XMLHttpRequest();
    e.open("GET", b),
      (e.responseType = "blob"),
      (e.onload = function () {
        a(e.response, c, d);
      }),
      (e.onerror = function () {
        console.error("could not download file");
      }),
      e.send();
  }
  function d(a) {
    var b = new XMLHttpRequest();
    b.open("HEAD", a, !1);
    try {
      b.send();
    } catch (a) {}
    return 200 <= b.status && 299 >= b.status;
  }
  function e(a) {
    try {
      a.dispatchEvent(new MouseEvent("click"));
    } catch (c) {
      var b = document.createEvent("MouseEvents");
      b.initMouseEvent(
        "click",
        !0,
        !0,
        window,
        0,
        0,
        0,
        80,
        20,
        !1,
        !1,
        !1,
        !1,
        0,
        null
      ),
        a.dispatchEvent(b);
    }
  }
  var f =
      "object" == typeof window && window.window === window
        ? window
        : "object" == typeof self && self.self === self
        ? self
        : "object" == typeof global && global.global === global
        ? global
        : void 0,
    a =
      f.saveAs ||
      ("object" != typeof window || window !== f
        ? function () {}
        : "download" in HTMLAnchorElement.prototype
        ? function (b, g, h) {
            var i = f.URL || f.webkitURL,
              j = document.createElement("a");
            (g = g || b.name || "download"),
              (j.download = g),
              (j.rel = "noopener"),
              "string" == typeof b
                ? ((j.href = b),
                  j.origin === location.origin
                    ? e(j)
                    : d(j.href)
                    ? c(b, g, h)
                    : e(j, (j.target = "_blank")))
                : ((j.href = i.createObjectURL(b)),
                  setTimeout(function () {
                    i.revokeObjectURL(j.href);
                  }, 4e4),
                  setTimeout(function () {
                    e(j);
                  }, 0));
          }
        : "msSaveOrOpenBlob" in navigator
        ? function (f, g, h) {
            if (((g = g || f.name || "download"), "string" != typeof f))
              navigator.msSaveOrOpenBlob(b(f, h), g);
            else if (d(f)) c(f, g, h);
            else {
              var i = document.createElement("a");
              (i.href = f),
                (i.target = "_blank"),
                setTimeout(function () {
                  e(i);
                });
            }
          }
        : function (a, b, d, e) {
            if (
              ((e = e || open("", "_blank")),
              e &&
                (e.document.title = e.document.body.innerText =
                  "downloading..."),
              "string" == typeof a)
            )
              return c(a, b, d);
            var g = "application/octet-stream" === a.type,
              h = /constructor/i.test(f.HTMLElement) || f.safari,
              i = /CriOS\/[\d]+/.test(navigator.userAgent);
            if ((i || (g && h)) && "object" == typeof FileReader) {
              var j = new FileReader();
              (j.onloadend = function () {
                var a = j.result;
                (a = i
                  ? a
                  : a.replace(/^data:[^;]*;/, "data:attachment/file;")),
                  e ? (e.location.href = a) : (location = a),
                  (e = null);
              }),
                j.readAsDataURL(a);
            } else {
              var k = f.URL || f.webkitURL,
                l = k.createObjectURL(a);
              e ? (e.location = l) : (location.href = l),
                (e = null),
                setTimeout(function () {
                  k.revokeObjectURL(l);
                }, 4e4);
            }
          });
  (f.saveAs = a.saveAs = a),
    "undefined" != typeof module && (module.exports = a);
});

!(function (e) {
  e(["jquery"], function (e) {
    return (function () {
      function t(e, t, n) {
        return g({
          type: O.error,
          iconClass: m().iconClasses.error,
          message: e,
          optionsOverride: n,
          title: t,
        });
      }
      function n(t, n) {
        return (
          t || (t = m()),
          (v = e("#" + t.containerId)),
          v.length ? v : (n && (v = d(t)), v)
        );
      }
      function o(e, t, n) {
        return g({
          type: O.info,
          iconClass: m().iconClasses.info,
          message: e,
          optionsOverride: n,
          title: t,
        });
      }
      function s(e) {
        C = e;
      }
      function i(e, t, n) {
        return g({
          type: O.success,
          iconClass: m().iconClasses.success,
          message: e,
          optionsOverride: n,
          title: t,
        });
      }
      function a(e, t, n) {
        return g({
          type: O.warning,
          iconClass: m().iconClasses.warning,
          message: e,
          optionsOverride: n,
          title: t,
        });
      }
      function r(e, t) {
        var o = m();
        v || n(o), u(e, o, t) || l(o);
      }
      function c(t) {
        var o = m();
        return (
          v || n(o),
          t && 0 === e(":focus", t).length
            ? void h(t)
            : void (v.children().length && v.remove())
        );
      }
      function l(t) {
        for (var n = v.children(), o = n.length - 1; o >= 0; o--) u(e(n[o]), t);
      }
      function u(t, n, o) {
        var s = !(!o || !o.force) && o.force;
        return (
          !(!t || (!s && 0 !== e(":focus", t).length)) &&
          (t[n.hideMethod]({
            duration: n.hideDuration,
            easing: n.hideEasing,
            complete: function () {
              h(t);
            },
          }),
          !0)
        );
      }
      function d(t) {
        return (
          (v = e("<div/>").attr("id", t.containerId).addClass(t.positionClass)),
          v.appendTo(e(t.target)),
          v
        );
      }
      function p() {
        return {
          tapToDismiss: !0,
          toastClass: "toast",
          containerId: "toast-container",
          debug: !1,
          showMethod: "fadeIn",
          showDuration: 300,
          showEasing: "swing",
          onShown: void 0,
          hideMethod: "fadeOut",
          hideDuration: 1e3,
          hideEasing: "swing",
          onHidden: void 0,
          closeMethod: !1,
          closeDuration: !1,
          closeEasing: !1,
          closeOnHover: !0,
          extendedTimeOut: 1e3,
          iconClasses: {
            error: "toast-error",
            info: "toast-info",
            success: "toast-success",
            warning: "toast-warning",
          },
          iconClass: "toast-info",
          positionClass: "toast-top-right",
          timeOut: 5e3,
          titleClass: "toast-title",
          messageClass: "toast-message",
          escapeHtml: !1,
          target: "body",
          closeHtml: '<button type="button">&times;</button>',
          closeClass: "toast-close-button",
          newestOnTop: !0,
          preventDuplicates: !1,
          progressBar: !1,
          progressClass: "toast-progress",
          rtl: !1,
        };
      }
      function f(e) {
        C && C(e);
      }
      function g(t) {
        function o(e) {
          return (
            null == e && (e = ""),
            e
              .replace(/&/g, "&amp;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#39;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
          );
        }
        function s() {
          c(), u(), d(), p(), g(), C(), l(), i();
        }
        function i() {
          var e = "";
          switch (t.iconClass) {
            case "toast-success":
            case "toast-info":
              e = "polite";
              break;
            default:
              e = "assertive";
          }
          I.attr("aria-live", e);
        }
        function a() {
          E.closeOnHover && I.hover(H, D),
            !E.onclick && E.tapToDismiss && I.click(b),
            E.closeButton &&
              j &&
              j.click(function (e) {
                e.stopPropagation
                  ? e.stopPropagation()
                  : void 0 !== e.cancelBubble &&
                    e.cancelBubble !== !0 &&
                    (e.cancelBubble = !0),
                  E.onCloseClick && E.onCloseClick(e),
                  b(!0);
              }),
            E.onclick &&
              I.click(function (e) {
                E.onclick(e), b();
              });
        }
        function r() {
          I.hide(),
            I[E.showMethod]({
              duration: E.showDuration,
              easing: E.showEasing,
              complete: E.onShown,
            }),
            E.timeOut > 0 &&
              ((k = setTimeout(b, E.timeOut)),
              (F.maxHideTime = parseFloat(E.timeOut)),
              (F.hideEta = new Date().getTime() + F.maxHideTime),
              E.progressBar && (F.intervalId = setInterval(x, 10)));
        }
        function c() {
          t.iconClass && I.addClass(E.toastClass).addClass(y);
        }
        function l() {
          E.newestOnTop ? v.prepend(I) : v.append(I);
        }
        function u() {
          if (t.title) {
            var e = t.title;
            E.escapeHtml && (e = o(t.title)),
              M.append(e).addClass(E.titleClass),
              I.append(M);
          }
        }
        function d() {
          if (t.message) {
            var e = t.message;
            E.escapeHtml && (e = o(t.message)),
              B.append(e).addClass(E.messageClass),
              I.append(B);
          }
        }
        function p() {
          E.closeButton &&
            (j.addClass(E.closeClass).attr("role", "button"), I.prepend(j));
        }
        function g() {
          E.progressBar && (q.addClass(E.progressClass), I.prepend(q));
        }
        function C() {
          E.rtl && I.addClass("rtl");
        }
        function O(e, t) {
          if (e.preventDuplicates) {
            if (t.message === w) return !0;
            w = t.message;
          }
          return !1;
        }
        function b(t) {
          var n = t && E.closeMethod !== !1 ? E.closeMethod : E.hideMethod,
            o = t && E.closeDuration !== !1 ? E.closeDuration : E.hideDuration,
            s = t && E.closeEasing !== !1 ? E.closeEasing : E.hideEasing;
          if (!e(":focus", I).length || t)
            return (
              clearTimeout(F.intervalId),
              I[n]({
                duration: o,
                easing: s,
                complete: function () {
                  h(I),
                    clearTimeout(k),
                    E.onHidden && "hidden" !== P.state && E.onHidden(),
                    (P.state = "hidden"),
                    (P.endTime = new Date()),
                    f(P);
                },
              })
            );
        }
        function D() {
          (E.timeOut > 0 || E.extendedTimeOut > 0) &&
            ((k = setTimeout(b, E.extendedTimeOut)),
            (F.maxHideTime = parseFloat(E.extendedTimeOut)),
            (F.hideEta = new Date().getTime() + F.maxHideTime));
        }
        function H() {
          clearTimeout(k),
            (F.hideEta = 0),
            I.stop(!0, !0)[E.showMethod]({
              duration: E.showDuration,
              easing: E.showEasing,
            });
        }
        function x() {
          var e = ((F.hideEta - new Date().getTime()) / F.maxHideTime) * 100;
          q.width(e + "%");
        }
        var E = m(),
          y = t.iconClass || E.iconClass;
        if (
          ("undefined" != typeof t.optionsOverride &&
            ((E = e.extend(E, t.optionsOverride)),
            (y = t.optionsOverride.iconClass || y)),
          !O(E, t))
        ) {
          T++, (v = n(E, !0));
          var k = null,
            I = e("<div/>"),
            M = e("<div/>"),
            B = e("<div/>"),
            q = e("<div/>"),
            j = e(E.closeHtml),
            F = { intervalId: null, hideEta: null, maxHideTime: null },
            P = {
              toastId: T,
              state: "visible",
              startTime: new Date(),
              options: E,
              map: t,
            };
          return s(), r(), a(), f(P), E.debug && console && console.log(P), I;
        }
      }
      function m() {
        return e.extend({}, p(), b.options);
      }
      function h(e) {
        v || (v = n()),
          e.is(":visible") ||
            (e.remove(),
            (e = null),
            0 === v.children().length && (v.remove(), (w = void 0)));
      }
      var v,
        C,
        w,
        T = 0,
        O = {
          error: "error",
          info: "info",
          success: "success",
          warning: "warning",
        },
        b = {
          clear: r,
          remove: c,
          error: t,
          getContainer: n,
          info: o,
          options: {},
          subscribe: s,
          success: i,
          version: "2.1.3",
          warning: a,
        };
      return b;
    })();
  });
})(
  "function" == typeof define && define.amd
    ? define
    : function (e, t) {
        "undefined" != typeof module && module.exports
          ? (module.exports = t(require("jquery")))
          : (window.toastr = t(window.jQuery));
      }
);

(function ($) {
  console.log("Temu 脚本启动了");

  /**
   * 将对象转换为特定格式的字符串
   * @param obj - 要转换的对象
   * @returns 转换后的字符串
   */
  const convertObjectToString = (obj) => {
    if (typeof obj !== "object" || obj === null) {
      return obj.toString();
    }
    return Object.values(obj).join("-");
  };

  // 从URL获取scm参数
  const urlParams = new URLSearchParams(window.location.search);
  const scmParam = urlParams.get("scm");
  const envParam = urlParams.get("env");

  // 如果scm=1，自动执行下载任务
  if (scmParam === "1") {
    setTimeout(() => {
      $.fetchPostTemuList(true);
    }, 5000); // 延迟5秒执行以确保页面加载完成
  }

  $.extend({ saveAs });

  (function ($) {
    $("body").append(
      `
       <button class="loading-button" id="satisfaction_id" >下载</button>
 
       <style>
        .loading-button {
          position: relative;
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          background-color: #007bff;
          color: #fff;
          cursor: pointer;
          overflow: hidden;
          border-radius: 5px;
        }
 
        .loading-button::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 30px;
          height: 30px;
          border: 4px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s linear infinite;
          transition: opacity 0.3s;
          opacity: 0;
          transform: translate(-50%, -50%);
        }
 
        .loading-button.loading::after {
          opacity: 1;
        }
 
        @keyframes spin {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
       </style>
       `
    );

    const $button = $("#satisfaction_id");
    const XCsrfTokenExp = $("#X-Csrf-exp");
    const XCsrfTokenDate = $("#X-Csrf-Date");
    const XCsrfTokenInput = $("#X-Csrf-Token");
    let loading = false;
    let mallName = "";

    XCsrfTokenExp.css({
      position: "fixed",
      top: "8%",
      right: "30px",
    });
    XCsrfTokenDate.css({
      position: "fixed",
      top: "12%",
      right: "30px",
    });

    XCsrfTokenInput.css({
      position: "fixed",
      top: "16%",
      right: "30px",
    });

    $button.css({
      position: "fixed",
      top: "10%",
      right: "30px",
    });

    $button.hover(
      function () {
        $(this).css({
          "background-color": "#4096ff",
          transition: "0.7s",
        });
      },
      function () {
        $(this).css({
          "background-color": "#1677ff",
          transition: "0.7s",
        });
      }
    );

    $.extend({
      fetchPostTemuList: function (automation) {
        toggleLoading(true);

        postData("https://agentseller.temu.com/api/seller/auth/userInfo").then(
          (res) => {
            const { success, result } = res;
            if (success) {
              const { mallList } = result;

              const mallId = getMallIdByCookie();

              if (mallId) {
                console.log("截取到的 mallid 值:", mallId);
              } else {
                console.log("未找到 mallid 值");
              }

              mallName = mallList.find(
                (malInfo) => malInfo.mallId.toString() === mallId
              )?.mallName;

              if (!mallName) {
                alert("店铺名称不存在");
                return;
              }

              let totalPages = 1000;
              const allResults = [];
              const pageSize = 30;

              postData(
                `https://agentseller.temu.com/api/kiana/gamblers/marketing/enroll/list`,
                { pageNo: 1, pageSize: 10 }
              ).then((res1) => {
                const { result, errorMsg, error_msg, success } = res1;
                if (!success) {
                  toggleLoading(false);
                  alert(
                    errorMsg || error_msg || "未知错误 请带电脑联系开发处理"
                  );
                  return;
                }
                const { total } = result;
                totalPages = Math.ceil(total / pageSize);

                let count = 0;
                const helper = (index) => {
                  if (index === 0) {
                    toggleLoading(true);
                    toexcel(allResults, automation);
                    return;
                  }
                  postData(
                    `https://agentseller.temu.com/api/kiana/gamblers/marketing/enroll/list`,
                    { pageNo: index, pageSize }
                  )
                    .then((res) => {
                      const { result, errorMsg, error_msg, success } = res;

                      let second = 2000;
                      if ((index - 1) % 10 === 0) {
                        second = 40000;
                      }

                      if (!success) {
                        toggleLoading(false);

                        console.log(
                          errorMsg ||
                            error_msg ||
                            "未知错误 请带电脑联系开发处理"
                        );

                        if (count >= 30) {
                          alert(
                            errorMsg ||
                              error_msg ||
                              "未知错误 请带电脑联系开发处理"
                          );
                          return;
                        }

                        setTimeout(() => {
                          count++;
                          helper(index);
                        }, 10 * 1000);

                        return;
                      }

                      const { list } = result;

                      const lastResultList = [];

                      const sortedList = [...list].sort(
                        (a, b) => b.productId - a.productId
                      );

                      sortedList?.forEach((item1) => {
                        const { skcList, assignSessionList, enrollTime } =
                          item1;

                        const sessionStatusMap = {
                          1: "报名成功待开始",
                          2: "进行中",
                          3: "活动已结束",
                          4: "报名失败",
                          5: "已售罄",
                          6: "已退出活动",
                        };

                        const 报名结果 = assignSessionList?.length
                          ? assignSessionList
                              .map(
                                (item) =>
                                  `${item.sessionName}/${
                                    sessionStatusMap[item.sessionStatus] ||
                                    item.sessionStatus
                                  }`
                              )
                              .join(",")
                          : "";

                        // 提交时间
                        item1.enrollTime = enrollTime;
                        item1.enrollTimeStr = dayjs(enrollTime).format(
                          "YYYY-MM-DD HH:mm:ss"
                        );

                        skcList?.forEach((item2) => {
                          const { skuList, extCode } = item2;
                          skuList?.forEach((item3) => {
                            const { sitePriceList, properties } = item3;
                            const propertiesName =
                              convertObjectToString(properties);
                            sitePriceList?.forEach((item4) => {
                              const { activityPrice, dailyPrice } = item4;

                              item4.activityPrice = activityPrice / 100;
                              item4.dailyPrice = dailyPrice / 100;
                              const r = {
                                ...item1,
                                ...item2,
                                ...item3,
                                ...item4,
                                propertiesName,
                                报名结果,
                                SKCExtCode: extCode,
                                经营站点: item4.siteName,
                                报名站点: item4.siteName,
                                saleShop: mallName,
                              };
                              lastResultList.push(r);
                            });
                          });
                        });
                      });

                      allResults.push(...lastResultList);

                      setTimeout(() => {
                        helper(index - 1);
                      }, second);
                    })
                    .catch((err) => {
                      console.log("err:", err);

                      toggleLoading(false);
                    });
                };

                setTimeout(() => {
                  helper(totalPages);
                }, 5000);
              });
            }
          }
        );
      },
    });

    function getMallIdByCookie() {
      const cookies = document.cookie;
      console.log("当前网页的 cookie:", cookies);
      // 截取 mallIdMatch 的值
      const mallIdMatch = cookies.match(/mallid=([^;]+)/);
      const mallId = mallIdMatch ? mallIdMatch[1] : null;

      if (mallId) {
        console.log("截取到的 mallIdMatch 值:", mallId);
      } else {
        console.log("未找到 mallIdMatch 值");
      }

      return mallId;
    }

    async function postData(url = "", data = {}) {
      const cookies = document.cookie;
      console.log("当前网页的 cookie:", cookies);

      const mallId = getMallIdByCookie();

      // Default options are marked with *
      const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=0",
          Mallid: mallId,
          "X-Gorgias-User-Client": "Web",
        },

        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects
    }

    $button.on("click", function () {
      if (loading) return;

      $.fetchPostTemuList();
    });

    function toggleLoading(load, text) {
      loading = load;
      const button = document.querySelector(".loading-button");
      if (load) {
        button.classList.add("loading");
      } else {
        button.classList.remove("loading");
      }
      if (text) {
        button.textContent = text;
      }
    }

    function toexcelScm1(dataSource, headers) {
      // 转换数据为包含表头的格式
      const dataWithHeaders = dataSource.map((item) => {
        const newItem = {};
        Object.keys(headers).forEach((key) => {
          newItem[headers[key]] = item[key];
        });
        return newItem;
      });

      // 替换为您的实际后端API地址
      let backendUrl =
        "https://scm-app.youniverse.cc/yfs-cdm/temuActivity/saveOriginData";

      if (envParam === "test") {
        backendUrl =
          "https://scm-app-test.youniverse.cc/yfs-cdm/temuActivity/saveOriginData";
      }
      if (envParam === "dev") {
        backendUrl =
          "https://scm-app-dev.youniverse.cc/yfs-cdm/temuActivity/saveOriginData";
      }

      console.log("backendUrl:", backendUrl);

      // 替换原来的fetch调用为GM_xmlhttpRequest
      GM_xmlhttpRequest({
        method: "POST",
        url: backendUrl,
        data: JSON.stringify({
          originDataList: dataWithHeaders, // 按照要求使用saleList作为参数名
          saleShop: mallName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        onload: function (response) {
          console.log("上传成功", response);
          try {
            const res = JSON.parse(response.response);
            console.log("res:", res);
            // 等于10000 表示成功
            if (res.code === "10000") {
              toggleLoading(false, res.code);
            }
          } catch (error) {
            console.error("解析响应失败", error);
            toggleLoading(false, "上传失败");
          }
        },
        onerror: function (error) {
          console.error("上传失败", error);
          toggleLoading(false, "上传失败");
        },
      });
    }

    const toexcel = (dataSource, automation) => {
      const fileName = `TEMU 报名记录下载${dayjs().format(
        "YYYY-MM-DD HH-mm-ss"
      )}`;

      const th = [
        "saleShop",
        "productName",
        "SPU ID",
        "经营站点",
        "SKC信息 skcId",
        "SKC信息 货号",
        "SKU属性集 SKU名称",
        "SKU属性集 货号",
        "报名站点",
        "日常申报价",
        "活动申报价",
        "货币单位",
        "提交时间",
        "提交时间(时间戳)",
        "活动类型1",
        "活动类型2",
        "报名结果",
        "场次共用活动库存 提报",
        "场次共用活动库存 剩余",
      ];

      const filterVal = [
        "saleShop",
        "productName",
        "productId",
        "经营站点",
        "skcId",
        "SKCExtCode",
        "propertiesName",
        "extCode",
        "报名站点",
        "dailyPrice",
        "activityPrice",
        "currency",
        "enrollTimeStr",
        "enrollTime",
        "activityTypeName",
        "activityThematicName",
        "报名结果",
        "activityStock",
        "remainingActivityStock",
      ];

      // 后台需要的字段名称
      const scmTh = [
        "saleShop",
        "productName",
        "spuId",
        "manageSite",
        "skcId",
        "skcNumber",
        "skuName",
        "skuNumber",
        "applySite",
        "dailyApplyPrice",
        "taxActivityApplyPrice",
        "currency",
        "submitTime",
        "submitTimestamp",
        "activityType1",
        "activityType2",
        "applyResult",
        "applyStock",
        "remainingStock",
      ];

      if (scmParam === "1" && automation) {
        const headers = {};
        filterVal.forEach((item, index) => {
          headers[item] = scmTh[index];
        });

        toexcelScm1(dataSource, headers);
        return;
      }

      toggleLoading(false);
      var data = formatJson(filterVal, dataSource);
      //data得到的值为[["小绵羊","12","六年级","100"],["小猪猪,"23","五年级","98"]]
      //注意：二维数组里的每一个元素都应是字符串类型，否则导出的表格对应单元格为空
      toExcel({
        th,
        data,
        fileName,
        fileType: "xlsx",
        sheetName: "satisfaction",
      });
    };

    const { saveAs } = $;

    function s2ab(s) {
      let buf = new ArrayBuffer(s.length);
      let view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    }
    function data2ws(data) {
      const ws = {};
      const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
      for (let R = 0; R !== data.length; ++R) {
        for (let C = 0; C !== data[R].length; ++C) {
          if (range.s.r > R) range.s.r = R;
          if (range.s.c > C) range.s.c = C;
          if (range.e.r < R) range.e.r = R;
          if (range.e.c < C) range.e.c = C;
          const cell = { v: data[R][C] };
          if (cell.v == null) continue;
          const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
          if (typeof cell.v === "number") cell.t = "n";
          else if (typeof cell.v === "boolean") cell.t = "b";
          else if (cell.v instanceof Date) {
            cell.t = "n";
            cell.z = XLSX.SSF._table[14];
          } else {
            cell.t = "s";
          }
          ws[cellRef] = cell;
        }
      }
      if (range.s.c < 10000000) {
        ws["!ref"] = XLSX.utils.encode_range(range);
      }
      return ws;
    }
    function Workbook() {
      if (!(this instanceof Workbook)) {
        return new Workbook();
      }
      this.SheetNames = [];
      this.Sheets = {};
    }
    /*
     * th => 表头
     * data => 数据
     * fileName => 文件名
     * fileType => 文件类型
     * sheetName => sheet页名
     */
    //导出封装好的方法
    function toExcel({ th, data, fileName, fileType, sheetName }) {
      data.unshift(th);
      // @ts-ignore
      const wb = new Workbook();
      const ws = data2ws(data);
      sheetName = sheetName || "sheet1";
      wb.SheetNames.push(sheetName);
      wb.Sheets[sheetName] = ws;
      fileType = fileType || "xlsx";
      var wbout = XLSX.write(wb, {
        bookType: fileType,
        bookSST: false,
        type: "binary",
      });
      fileName = fileName || "列表";
      saveAs(
        new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
        `${fileName}.${fileType}`
      );
    }
    function formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    }
  })(jQuery);
})($);

// 去掉弹框
function hideLastTwoElements(count) {
  // 获取body下一层的所有元素
  const bodyChildren = $("body").children();

  // 遍历所有子元素
  // bodyChildren.each(function (index, element) {
  //   console.log(` ${count}: 第${index}个子元素:`, element);
  // });
  // console.log(` ${count}: bodyChildren:`, bodyChildren.length);
  // 移除 id 为 satisfaction_id 的元素
  const filterBodyChildren = bodyChildren.filter(function () {
    return this.id !== "satisfaction_id" && this.id !== "sca-container-root";
  });

  // console.log(` ${count}: filterBodyChildren:`, filterBodyChildren.length);

  // filterBodyChildren.each(function (index, element) {
  //   console.log(` ${count}: 第${index}个子元素:`, element);
  // });

  filterBodyChildren.hide();

  // if (bodyChildren.length > 10) {
  //   bodyChildren.slice(-6).hide();
  // } else if (bodyChildren.length > 7) {
  //   bodyChildren.slice(-4).hide();
  // } else {
  //   bodyChildren.slice(-2).hide();
  // }
}

// 从URL获取scm参数
const urlParams = new URLSearchParams(window.location.search);
const scmParam = urlParams.get("scm");

if (scmParam === "1") {
  // 调用函数
  setTimeout(() => {
    hideLastTwoElements(1);
  }, 2000);
  setTimeout(() => {
    hideLastTwoElements(2);
  }, 5000);
  setTimeout(() => {
    hideLastTwoElements(3);
  }, 8000);
}
