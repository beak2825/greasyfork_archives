// ==UserScript==
// @name         warframe兑换码优化
// @namespace    https://steve02081504.github.io/
// @version      0.1
// @description  批量兑换，回车分开，来自灰机用户Pa001024
// @author       steve02081504
// @match        https://www.warframe.com/*promocode
// @icon         https://www.google.com/s2/favicons?domain=warframe.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429523/warframe%E5%85%91%E6%8D%A2%E7%A0%81%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/429523/warframe%E5%85%91%E6%8D%A2%E7%A0%81%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    if (Cookies.get("signed-in") !== "1") {
      alert("请先登录");
    }
    // 注入icon
    $("<style>.icon {display: inline-block;width: 1em;height: 1em;stroke-width: 0;stroke: currentColor;fill: currentColor;}</style>").appendTo("body");

    function getIcon(key) {
      var icons = ["M24.96 7.322c0-3.422 0-3.757 0-3.757 0-1.262-4.013-3.565-8.96-3.565-4.949 0-8.96 2.302-8.96 3.565 0 0 0 0.334 0 3.757 0 3.426 6.203 6.253 6.203 8.678 0 2.422-6.203 5.25-6.203 8.675s0 3.76 0 3.76c0 1.261 4.011 3.565 8.96 3.565 4.947 0 8.96-2.304 8.96-3.566 0 0 0-0.334 0-3.76s-6.203-6.253-6.203-8.675c0-2.424 6.203-5.251 6.203-8.677zM9.506 3.725c1.114-0.702 3.2-1.731 6.582-1.731 3.381 0 6.41 1.731 6.41 1.731 0.227 0.138 1.117 0.613 0.507 0.974-1.341 0.795-3.965 1.632-7.005 1.632s-5.574-0.922-6.918-1.718c-0.61-0.36 0.424-0.888 0.424-0.888zM16.802 16c0 1.909 1.594 3.138 3.282 4.778 1.234 1.197 2.922 2.837 2.922 3.896v2.125c-1.552-0.773-6.195-1.528-6.195-4.006 0-1.253-1.621-1.253-1.621 0 0 2.478-4.643 3.234-6.195 4.006v-2.125c0-1.059 1.69-2.701 2.922-3.896 1.688-1.64 3.282-2.869 3.282-4.778s-1.594-3.138-3.282-4.778c-1.234-1.2-2.922-2.84-2.922-3.901l-0.074-1.597c1.642 0.885 4.243 1.725 7.080 1.725 2.835 0 5.45-0.84 7.093-1.725l-0.088 1.597c0 1.059-1.69 2.701-2.922 3.901-1.686 1.64-3.282 2.869-3.282 4.778z", "M13.27 27.197c-0.696 0-1.355-0.325-1.778-0.885l-5.717-7.554c-0.744-0.981-0.55-2.378 0.432-3.122 0.984-0.747 2.381-0.55 3.125 0.432l3.762 4.966 9.458-15.187c0.651-1.043 2.027-1.363 3.074-0.712 1.045 0.65 1.366 2.026 0.714 3.072l-11.174 17.936c-0.387 0.626-1.058 1.016-1.792 1.050-0.035 0.003-0.067 0.003-0.102 0.003z", "M22.957 23.758c-0.75 0.75-1.966 0.75-2.715 0l-4.242-4.848-4.242 4.846c-0.75 0.75-1.966 0.75-2.715 0-0.75-0.75-0.75-1.966 0-2.715l4.413-5.040-4.414-5.043c-0.75-0.75-0.75-1.965 0-2.715s1.965-0.75 2.715 0l4.243 4.85 4.242-4.85c0.75-0.75 1.965-0.75 2.715 0s0.75 1.966 0 2.715l-4.413 5.043 4.413 5.040c0.75 0.75 0.75 1.966 0 2.717z"];
      return '<svg class="icon" viewBox="0 0 32 32"><path d="' + icons[key] + '"></path></svg>';
    }
    // 注入编辑器
    $("#promocode_input").replaceWith('<textarea style="width:100%;height:170px;resize:vertical;" id="promocode_input"/>');
    $("#promocode_input").next().click(function (e) {
      e.preventDefault();
      startActive();
      return false;
    });

    function startActive() {
      function Cosumer(code) {
        this.code = code;
        this.status = 0;
      }

      Cosumer.prototype.start = function (cb) {
        var _this = this;

        activeCode(this.code, function (yes) {
          if (cb) cb();
          return _this.status = yes ? 1 : 2;
        });
      };

      var codeList = $("#promocode_input").val().split("\n").map(function (v) {
        return new Cosumer(v.trim());
      });
      var renderList = [];
      var running = 0;
      var maxRunning = 5;
      var renderTarget = $(".contentHeaderContain + p");

      function rerender() {
        var t = renderList.map(function (v) {
          var icon = getIcon(v.status);
          var color = ["#000", "#1972cb", "#d50000"];
          return '<i style="color:' + color[v.status] + '">' + icon + "</i>" + v.code;
        });
        renderTarget.html("<ul>" + t.join("\n") + "</ul>");
      }

      var timer = setInterval(function () {
        if (codeList.length > 0) {
          if (running >= maxRunning) return;
          var c = codeList.shift();
          // 并行控制
          ++running;
          c.start(function () {
            --running;
          });
          renderList.push(c);
          console.log(c.code);
        } else {
          if (renderList.every(function (v) {
            return v.status > 0;
          })) clearInterval(timer);
        }

        rerender();
      }, 100);
    }

    function activeCode(code, cb) {
      $.post("https://www.warframe.com/promocode", {
        code: code,
        _token: $("#mainPromocodeForm > div > form > input[type=hidden]:nth-child(4)").val()
      }).then(function (v) {
        var rst = $(v).find("#basicTextContain").text().trim();
        cb(rst.length < 80);
      });
    }


})();