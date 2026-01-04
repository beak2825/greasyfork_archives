// ==UserScript==
// @name         云办编辑器
// @license      BSD
// @namespace    http://tampermonkey.net/
// @version      0.2.9
// @description  优化云办的编辑器功能
// @require      https://cdn.jsdelivr.net/npm/jquery@1.12.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js
// @author       wang.jiping@cestc.cn
// @include      *://172.17.**/*
// @include      *://172.16.**/*
// @include      *://10.255.**/*
// @include      *://10.16.**/*
// @include      *://192.168.3.**/*
// @include      *://106.39.**/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/418311/%E4%BA%91%E5%8A%9E%E7%BC%96%E8%BE%91%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/418311/%E4%BA%91%E5%8A%9E%E7%BC%96%E8%BE%91%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  (function () {
    // 修改编辑器的默认字体
    const style = document.createElement("style");
    style.type = "text/css";
    style.id = "_wjp_";
    const text = document.createTextNode(
      ".ace_editor.ace_editor{font-family: 'Courier New', 'Cascadia Code', Hack, Monaco; font-size: 18px;} #full_screen_watermark_dom{display:none!important;}"
    );
    style.appendChild(text);
    const head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
  })();

  (function () {
    // 点击左右编辑框，自动设置宽度
    const PERCENT = 0.5;
    const WIDE = 100 * PERCENT + "%";
    const NARROW = 100 * (1 - PERCENT) + "%";
    $(document)
      .on("dblclick", ".splitter-paneL .el-tabs__content", function (e) {
        e && e.stopPropagation();
        const width = parseFloat(
          $(e.currentTarget)
            .closest(".splitter-paneL")
            .attr("style")
            .replace(/[A-Za-z:\s%]/g, "")
        );
        if (width > 100 * PERCENT) {
          return;
        }
        $(".splitter-paneL").css("width", WIDE);
        $(".splitter-pane-resizer").css("left", WIDE);
        $(".splitter-paneR").css("width", NARROW);
      })
      .on("dblclick", ".splitter-paneR .el-tabs__content", function (e) {
        e && e.stopPropagation();
        const width = parseFloat(
          $(e.currentTarget)
            .closest(".splitter-paneR")
            .attr("style")
            .replace(/[A-Za-z:\s%]/g, "")
        );
        if (width > 100 * PERCENT) {
          return;
        }
        $(".splitter-paneL").css("width", NARROW);
        $(".splitter-pane-resizer").css("left", NARROW);
        $(".splitter-paneR").css("width", WIDE);
      });
  })();

  function getQuery(name, url) {
    const u = url || window.location.search,
      reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
      r = u.substr(u.indexOf("?") + 1).match(reg);
    return r != null ? r[2] : "";
  }

  (function () {
    // 给页面增加搜索功能

    const dataMap = {};

    function getServiceType() {
      let serviceType = "";
      const path = window.location.pathname;
      if (path.endsWith("backend")) {
        serviceType = "back";
      } else if (path.endsWith("page")) {
        serviceType = "page";
      }
      return serviceType;
    }
    function fetchData(cb) {
      let modelCode = getQuery("funcgroupCode");
      const serviceType = getServiceType();
      const path = window.location.pathname;
      if (path === "/dev/system/page" || path === "/dev/system/backend") {
        modelCode = "SYSTEM";
      }
      if (modelCode && serviceType) {
        const Token = localStorage.getItem("token");
        if (!Token) {
          return;
        }
        GM_xmlhttpRequest({
          method: "get",
          url: "/pkc/" + serviceType + "/all/" + modelCode,
          headers: {
            "Content-Type": "application/json",
            "Token": Token,
          },
          params: {
            // 确保每次请求都是从后端请求，不使用缓存
            t: Math.random(),
          },
          onload: function (resp) {
            if (resp.status === 200 && resp.readyState === 4) {
              const response = JSON.parse(resp.response);
              const { code, data } = response;
              if (code === "200010000") {
                if (data && data.length) {
                  data.map(item => {
                    dataMap[item.id] = item;
                  });
                }
                typeof cb === "function" && cb(data);
              }
            }
          },
        });
      }
    }

    setInterval(() => {
      const len = $("#_wjpSearch_").length;
      if (!len) {
        fetchData(data => {
          const len = $("#_wjpSearch_").length;
          if (data && data.length && !len) {
            $(
              '<div id="_wjpSearch_" class="el-input el-input--medium el-input--suffix" style="width:400px;"><input type="text" autocomplete="off" placeholder="请输入关键字(可搜索组件里面的内容)" class="el-input__inner"></div>'
            ).insertAfter(".topOperate>div:first-child");
          }
        });
      }
    }, 2000);

    $(document)
      .on(
        "input",
        "#_wjpSearch_ input",
        _.debounce(function (e) {
          let value = $(e.currentTarget).val().trim().toLowerCase();
          const serviceType = getServiceType();
          let $rows = $(
            ".el-table__body-wrapper>.el-table__body>tbody>.el-table__row"
          );

          for (let i = 0; i < $rows.length; i++) {
            const $row = $rows.eq(i);
            const $children = $row.children("td");
            // 倒数第二列肯定为ID，取倒数第二列
            let id = $children
              .eq($children.length - 2)
              .text()
              .trim();
            const currentData = dataMap[id];
            if (!currentData) {
              continue;
            }
            if (value) {
              let shouldHidden = true;
              if (serviceType === "page") {
                // 先搜索页面里面的内容
                let html, css, js;
                if (currentData.endType == 2) {
                  html = currentData.moveHtml;
                  css = currentData.moveCss;
                  js = currentData.moveJs;
                } else {
                  html = currentData.pcHtml;
                  css = currentData.pcCss;
                  js = currentData.pcJs;
                }
                html = (html || "").toLowerCase();
                css = (css || "").toLowerCase();
                js = (js || "").toLowerCase();

                if (
                  html.indexOf(value) > -1 ||
                  css.indexOf(value) > -1 ||
                  js.indexOf(value) > -1
                ) {
                  shouldHidden = false;
                }
              } else if (serviceType === "back") {
                let groovyText = currentData.groovyText;
                groovyText = (groovyText || "").toLowerCase();
                if (groovyText.indexOf(value) > -1) {
                  shouldHidden = false;
                }
              }

              // 如果页面里面的内容没有,则搜索当前页面
              if (shouldHidden) {
                const $tds = $row.children("td");
                for (let j = 0; j < $tds.length; j++) {
                  const text = $tds.eq(j).text().trim().toLowerCase();
                  if (text.indexOf(value) > -1) {
                    shouldHidden = false;
                    break;
                  }
                }
              }

              if (shouldHidden) {
                $row.css("display", "none");
              } else {
                $row.css("display", "");
              }
            } else {
              $row.css("display", "");
            }
          }
        }, 600)
      )
      .on("click", ".unsave button", function () {
        // 等待保存成功后，再重新请求
        setTimeout(function () {
          fetchData();
        }, 600);
      })
      .on(
        "keydown",
        "#pane-js,#pane-html,#pane-css",
        _.debounce(function (e) {
          let keyCode = e.keyCode || e.which || e.charCode;
          let ctrlKey = e.ctrlKey || e.metaKey;
          // 监听ctrl+s按键
          if (ctrlKey /* && keyCode === 83 */) {
            // 等待保存成功后，再重新请求
            setTimeout(function () {
              fetchData();
            }, 600);
          }
        }, 100)
      );
  })();
})();
