// ==UserScript==
// @name            wnacg 優化
// @name:zh-TW      wnacg 優化
// @name:zh-CN      wnacg 优化
// @name:ja         wnacg 最適化
// @name:en         wnacg Optimization
// @version         0.0.15
// @author          Canaan HS
// @description         電腦版頁面支持切換自動翻頁或手動按鍵翻頁，並可自定背景顏色及圖像大小。電腦開啟的手機頁面 (移動端不適用)，則可自定背景顏色及圖像大小。
// @description:zh-TW   電腦版頁面支持切換自動翻頁或手動按鍵翻頁，並可自定背景顏色及圖像大小。電腦開啟的手機頁面 (移動端不適用)，則可自定背景顏色及圖像大小。
// @description:zh-CN   电脑版页面支持切换自动翻页或手动按键翻页，并可自定背景颜色及图像大小。电脑开启的手机页面（移动端不适用），则可自定背景颜色及图像大小。
// @description:ja      デスクトップ版ページでは、自動ページ送りと手動キー操作によるページ送りの切り替えができ、背景色と画像サイズをカスタマイズできます。デスクトップで開いたモバイルページ（モバイル端末では適用されません）では、背景色と画像サイズをカスタマイズできます。
// @description:en      The desktop version supports switching between automatic page turning and manual key press page turning, with customizable background color and image size. The mobile version opened on a desktop (not applicable on mobile devices) allows for customizing the background color and image size.

// @match       *://*.wnacg.com/photos-view-id-*.html
// @match       *://*.wnacg01.ru/photos-view-id-*.html
// @match       *://*.wnacg02.ru/photos-view-id-*.html
// @match       *://*.wnacg03.ru/photos-view-id-*.html

// @match       *://*.wnacg.com/photos-slist-aid-*.html
// @match       *://*.wnacg01.ru/photos-slist-aid-*.html
// @match       *://*.wnacg02.ru/photos-slist-aid-*.html
// @match       *://*.wnacg03.ru/photos-slist-aid-*.html

// @icon        https://www.wnacg.com/favicon.ico

// @license     MIT
// @namespace   https://greasyfork.org/users/989635

// @run-at      document-start
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand

// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.0/jquery-ui.min.js
// @require     https://update.greasyfork.org/scripts/495339/1456526/ObjectSyntax_min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js
// @downloadURL https://update.greasyfork.org/scripts/472726/wnacg%20%E5%84%AA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/472726/wnacg%20%E5%84%AA%E5%8C%96.meta.js
// ==/UserScript==

(async () => {
  async function x(a, e) {
      document.title = document.title.split(" - ")[1];
      const f = Syn.$$("a", { root: a }).href,
          r = Syn.$$("img", { root: a }).src;
      if (h.SwitchStatus) {
          let q = Syn.$$("select option", { all: !0 }).length - e;
          const p = new IntersectionObserver(
              (c) => {
                  c.forEach((b) => {
                      b.isIntersecting &&
                          (history.pushState(null, null, b.target.alt),
                              p.unobserve(b.target));
                  });
              },
              { threshold: 0.3 }
          );
          function m({ OLink: c, src: b }) {
              return React.createElement("img", {
                  src: b,
                  alt: c,
                  loading: "lazy",
                  className: "ImageOptimization",
                  ref: function (g) {
                      g && p.observe(g);
                  },
              });
          }
          async function n(c) {
              0 < q &&
                  fetch(c)
                      .then((b) => b.text())
                      .then((b) => {
                          b = Syn.$$("#photo_body", { root: Syn.DomParse(b) });
                          const g = Syn.$$("a", { root: b }).href;
                          b = Syn.$$("img", { root: b }).src;
                          ReactDOM.render(
                              React.createElement(m, { OLink: c, src: b }),
                              a.appendChild(document.createElement("div"))
                          );
                          setTimeout(() => {
                              q--;
                              n(g);
                          }, 500);
                      })
                      .catch((b) => {
                          n(c);
                      });
          }
          ReactDOM.render(
              React.createElement(m, { OLink: Syn.Device.Url, src: r }),
              a
          );
          Syn.$$("#header").scrollIntoView();
          n(f);
      } else {
          function q({ number: c, src: b }) {
              return React.createElement("img", {
                  src: b,
                  "data-number": c,
                  className: "ImageOptimization",
              });
          }
          async function p(c) {
              fetch(c)
                  .then((b) => b.text())
                  .then((b) => {
                      b = Syn.DomParse(b);
                      var g = Syn.$$("#photo_body", { root: b });
                      g = Syn.$$("img", { root: g }).src;
                      ReactDOM.render(React.createElement(q, { number: m, src: g }), a);
                      b = Syn.$$(".newpage .btntuzao", { all: !0, root: b });
                      n.set(m, { PrevLink: b[0].href, NextLink: b[1].href });
                      history.pushState(null, null, c);
                      window.scrollTo(0, 0);
                  });
          }
          let m = e;
          const n = new Map();
          e = Syn.$$(".newpage .btntuzao", { all: !0 });
          n.set(m, { PrevLink: e[0].href, NextLink: e[1].href });
          ReactDOM.render(
              React.createElement(q, { number: m, NLink: f, src: r }),
              a
          );
          document.onkeydown = void 0;
          u(window, "keydown", (c) => {
              var b = c.key;
              if ("ArrowLeft" == b || "4" == b)
                  c.stopImmediatePropagation(),
                      --m,
                      (c = +Syn.$$("img", { root: a }).getAttribute("data-number")),
                      (b = n.get(c - 1)) ? p(b.PrevLink) : p(n.get(c).PrevLink);
              else if ("ArrowRight" == b || "6" == b)
                  c.stopImmediatePropagation(),
                      ++m,
                      (c = +Syn.$$("img", { root: a }).getAttribute("data-number")),
                      (c = n.get(c).NextLink),
                      p(c);
          });
      }
  }
  async function u(a, e, f) {
      $(a).on(e, f);
  }
  async function w(a = !1) {
      if (Syn.$$(".modal-background")) a && Syn.$$(".modal-background").remove();
      else {
          var {
              SwitchStatus: e,
              ImageBasicWidth: f,
              ImageMaxWidth: r,
              ImageBasicHight: q,
              ImageMaxHight: p,
              ImageSpacing: m,
              BackgroundColor: n,
          } = h.LoadingConfig();
          a = [];
          for (var c of [m, f, r, q, p, n]) a.push(h.ConfigAnalyze(c));
          c = h.IsMobile
              ? ""
              : `
          <div class="DMS">
              <input type="checkbox" class="DMS-checkbox" id="SwitchMode" ${e ? "checked" : ""
              }>
              <label class="DMS-label" for="SwitchMode">
                  <span class="DMS-inner"></span>
                  <span class="DMS-switch"></span>
              </label>
          </div>
      `;
          a = `
          <div class="modal-background">
              <div class="modal-interface">
                  <div style="display: flex; justify-content: space-between;">
                      <h1 style="margin-bottom: 1rem; font-size: 1.3rem;">${h.Transl(
              "\u5716\u50cf\u8a2d\u7f6e"
          )}</h1>${c}
                  </div>
                  <p>
                      <Cins>${h.Transl(
              "\u5716\u50cf\u9593\u8ddd"
          )}</Cins><input type="range" id="ImageSpacing" class="slider" min="0" max="100" step="1" value="${a[0].RangeValue
              }">
                      <span class="Cshow">${a[0].DisplayText}</span>
                  </p>
                  <br>
                  <p>
                      <Cins>${h.Transl(
                  "\u57fa\u672c\u5bec\u5ea6"
              )}</Cins><input type="range" id="ImageBasicWidth" class="slider" min="9" max="100" step="1" value="${a[1].RangeValue
              }">
                      <span class="Cshow">${a[1].DisplayText}</span>
                  </p>
                  <br>
                  <p>
                      <Cins>${h.Transl(
                  "\u6700\u5927\u5bec\u5ea6"
              )}</Cins><input type="range" id="ImageMaxWidth" class="slider" min="9" max="100" step="1" value="${a[2].RangeValue
              }">
                      <span class="Cshow">${a[2].DisplayText}</span>
                  </p>
                  <br>
                  <p>
                      <Cins>${h.Transl(
                  "\u57fa\u672c\u9ad8\u5ea6"
              )}</Cins><input type="range" id="ImageBasicHight" class="slider" min="9" max="100" step="1" value="${a[3].RangeValue
              }">
                      <span class="Cshow">${a[3].DisplayText}</span>
                  </p>
                  <br>
                  <p>
                      <Cins>${h.Transl(
                  "\u6700\u5927\u9ad8\u5ea6"
              )}</Cins><input type="range" id="ImageMaxHight" class="slider" min="9" max="100" step="1" value="${a[4].RangeValue
              }">
                      <span class="Cshow">${a[4].DisplayText}</span>
                  </p>
                  <br>
                  <p>
                      <Cins>${h.Transl(
                  "\u80cc\u666f\u984f\u8272"
              )}</Cins><input type="color" id="BackgroundColor" class="color" value="${a[5].RangeValue
              }">
                      <span style="margin-right: 17.9rem;"></span><button id="SaveConfig" class="button-sty">${h.Transl(
                  "\u4fdd\u5b58\u8a2d\u7f6e"
              )}</button>
                  </p>
              </div>
          </div>
      `;
          var b = document.body;
          $(b).append(a);
          $(".modal-interface").draggable({
              scroll: !0,
              opacity: 0.8,
              cursor: "grabbing",
          });
          var g, k, t;
          u("#BackgroundColor", "input", (l) => {
              g = l.target.id;
              k = $(l.target).val();
              h.StylePointer[g](b, k);
          });
          u("#ImageSpacing", "input", (l) => {
              t = $(l.target).next(".Cshow");
              g = l.target.id;
              k = $(l.target).val();
              h.StylePointer[g](`${k}rem`);
              t.text(`${k}rem`);
          });
          u("#ImageBasicWidth, #ImageMaxWidth", "input", (l) => {
              t = $(l.target).next(".Cshow");
              g = l.target.id;
              k = $(l.target).val();
              "9" === k
                  ? (h.StylePointer[g]("auto"), t.text("auto"))
                  : (h.StylePointer[g](`${k}%`), t.text(`${k}%`));
          });
          u("#ImageBasicHight, #ImageMaxHight", "input", (l) => {
              t = $(l.target).next(".Cshow");
              g = l.target.id;
              k = $(l.target).val();
              "9" === k
                  ? (h.StylePointer[g]("auto"), t.text("auto"))
                  : (h.StylePointer[g](`${k}rem`), t.text(`${k}rem`));
          });
          u("#SaveConfig", "click", function () {
              const l = {};
              l.SwitchStatus = $("#SwitchMode").prop("checked") ? !0 : !1;
              var d = $(".modal-interface");
              const v = d.css("top");
              d = d.css("left");
              l.MenuTop = v;
              l.MenuLeft = d;
              h.StylePointer.MenuTop(v);
              h.StylePointer.MenuLeft(d);
              $(".modal-interface")
                  .find("input")
                  .not("#SwitchMode")
                  .each(function () {
                      g = $(this).attr("id");
                      k = $(this).val();
                      l[g] =
                          "ImageSpacing" === g
                              ? `${k}rem`
                              : "ImageBasicWidth" === g || "ImageMaxWidth" === g
                                  ? "9" === k
                                      ? "auto"
                                      : `${k}%`
                                  : "ImageBasicHight" === g || "ImageMaxHight" === g
                                      ? "9" === k
                                          ? "auto"
                                          : `${k}rem`
                                      : k;
                  });
              Syn.Store("s", "Config", l);
              $(".modal-background").remove();
          });
      }
  }
  (async () => {
      Syn.Store("g", "Mode_V2", !1) && Syn.Store("d", "Mode_V2");
      const a = Syn.Store("g", "Settings");
      if (a) {
          Syn.Store("d", "Settings");
          const { ULS: e, BW: f, MW: r, BH: q, MH: p, BC: m, MT: n, ML: c } = a[0];
          Syn.Store("s", "Config", {
              SwitchStatus: !0,
              MenuTop: n,
              MenuLeft: c,
              ImageBasicWidth: f,
              ImageMaxWidth: r,
              ImageBasicHight: q,
              ImageMaxHight: p,
              ImageSpacing: e,
              BackgroundColor: m,
          });
      }
  })();
  const h = (() => {
      const a = () =>
          Syn.Store("g", "Config", null) ?? {
              SwitchStatus: !0,
              MenuTop: "auto",
              MenuLeft: "auto",
              ImageSpacing: "0rem",
              ImageBasicWidth: "100%",
              ImageMaxWidth: "60%",
              ImageBasicHight: "auto",
              ImageMaxHight: "auto",
              BackgroundColor: "#000",
          };
      let e;
      var f = {},
          r = {
              "\u5716\u50cf\u8a2d\u7f6e": "\u56fe\u50cf\u8bbe\u7f6e",
              "\u5716\u50cf\u9593\u8ddd": "\u56fe\u50cf\u95f4\u8ddd",
              "\u57fa\u672c\u5bec\u5ea6": "\u57fa\u672c\u5bbd\u5ea6",
              "\u6700\u5927\u5bec\u5ea6": "\u6700\u5927\u5bbd\u5ea6",
              "\u57fa\u672c\u9ad8\u5ea6": "\u57fa\u672c\u9ad8\u5ea6",
              "\u6700\u5927\u9ad8\u5ea6": "\u6700\u5927\u9ad8\u5ea6",
              "\u80cc\u666f\u984f\u8272": "\u80cc\u666f\u989c\u8272",
              "\u4fdd\u5b58\u8a2d\u7f6e": "\u4fdd\u5b58\u8bbe\u7f6e",
              "\u6efe\u52d5\u95b1\u8b80": "\u6eda\u52a8\u9605\u8bfb",
              "\u7ffb\u9801\u95b1\u8b80": "\u7ffb\u9875\u9605\u8bfb",
              "\ud83d\udd32 \u958b\u95dc\u83dc\u55ae": "\u5f00\u5173\u83dc\u5355",
          };
      f = {
          "zh-TW": f,
          "zh-HK": f,
          "zh-MO": f,
          "zh-CN": r,
          "zh-SG": r,
          "en-US": {
              "\u5716\u50cf\u8a2d\u7f6e": "Image Settings",
              "\u5716\u50cf\u9593\u8ddd": "Image ImageSpacing",
              "\u57fa\u672c\u5bec\u5ea6": "Base Width",
              "\u6700\u5927\u5bec\u5ea6": "Max Width",
              "\u57fa\u672c\u9ad8\u5ea6": "Base Height",
              "\u6700\u5927\u9ad8\u5ea6": "Max Height",
              "\u80cc\u666f\u984f\u8272": "BackgroundColor Color",
              "\u4fdd\u5b58\u8a2d\u7f6e": "Save Settings",
              "\u6efe\u52d5\u95b1\u8b80": "Scroll Read",
              "\u7ffb\u9801\u95b1\u8b80": "TurnPage Read",
              "\ud83d\udd32 \u958b\u95dc\u83dc\u55ae": "Toggle Menu",
          },
          ja: {
              "\u5716\u50cf\u8a2d\u7f6e": "\u753b\u50cf\u8a2d\u5b9a",
              "\u5716\u50cf\u9593\u8ddd": "\u753b\u50cf\u9593\u9694",
              "\u57fa\u672c\u5bec\u5ea6": "\u57fa\u672c\u5e45",
              "\u6700\u5927\u5bec\u5ea6": "\u6700\u5927\u5e45",
              "\u57fa\u672c\u9ad8\u5ea6": "\u57fa\u672c\u9ad8\u3055",
              "\u6700\u5927\u9ad8\u5ea6": "\u6700\u5927\u9ad8\u3055",
              "\u80cc\u666f\u984f\u8272": "\u80cc\u666f\u8272",
              "\u4fdd\u5b58\u8a2d\u7f6e": "\u8a2d\u5b9a\u306e\u4fdd\u5b58",
              "\u6efe\u52d5\u95b1\u8b80":
                  "\u30b9\u30af\u30ed\u30fc\u30eb\u8aad\u307f\u53d6\u308a",
              "\u7ffb\u9801\u95b1\u8b80":
                  "\u30da\u30fc\u30b8\u8aad\u307f\u53d6\u308a",
              "\ud83d\udd32 \u958b\u95dc\u83dc\u55ae":
                  "\u30e1\u30cb\u30e5\u30fc\u306e\u5207\u308a\u66ff\u3048",
          },
      };
      const q = f[Syn.Device.Lang] ?? f["en-US"];
      f = (d) => q[d] ?? d;
      const {
          SwitchStatus: p,
          MenuTop: m,
          MenuLeft: n,
          ImageBasicWidth: c,
          ImageMaxWidth: b,
          ImageBasicHight: g,
          ImageMaxHight: k,
          ImageSpacing: t,
          BackgroundColor: l,
      } = a();
      Syn.AddStyle(`
          .ImageOptimization {
              display: block;
              margin: ${t} auto;
              width: ${c};
              height: ${g};
              max-width: ${b};
              max-height: ${k};
          }
          body {
              overflow-x: visible !important;
              background-color: ${l} !important;
          }
          a, em {
              color: #fff !important;
          }
          .nav li a {
              float: left;
              line-height: 40px;
              height: 40px;
              width: 85px;
              font-size: 14px;
              color: #fff !important;
              text-decoration: none;
              text-align: center;
              font-weight: bold;
              text-align: center;
              background: #5F5F5F !important;
          }
          .tocaowrap {
              width: 100%;
              margin: 0 auto;
              padding: 0.1rem;
              max-width: ${b};
          }
          .btntuzao {
              margin: 0 5px;
              background-color: #5F5F5F;
          }
          #header {
              background: #5F5F5F;
              border-bottom: 1px solid #dfe1e1;
              transform: translateY(-1.6rem);
              opacity: 0;
              transition: 0.8s;
          }
          #header:hover {
              opacity: 1;
              transform: translateY(0rem);
          }
          .modal-background {
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              display: flex;
              z-index: 9999;
              position: fixed;
              overflow: auto;
              pointer-events: none;
          }
          .modal-interface {
              top: ${m};
              left: ${n};
              margin: auto;
              color: #3d8fe7;
              padding: 1% 2%;
              border-radius: 5px;
              background-color: #f3f3f3;
              border: 2px solid #c0d8fc;
              pointer-events: auto;
          }
          .slider {
              width: 21rem;
              cursor: pointer;
          }
          .color {
              width: 4rem;
              cursor: pointer;
          }
          .Cshow {
              font-size: 1.25rem;
              margin: auto 1rem;
              font-weight: bold;
          }
          .button-sty {
              color: #ffffff;
              font-size: 1rem;
              padding: 0.3rem;
              font-weight: bold;
              border-radius: 5px;
              background-color: #3d8fe7;
              border: 2px solid #f3f3f3;
          }
          .button-sty:hover,
          .button-sty:focus {
              color: #c0d8fc;
              cursor: pointer;
              text-decoration: none;
          }
          p {
              display: flex;
              align-items: center;
              white-space: nowrap;
          }
          Cins {
              font-size: 1.2rem;
              font-weight: bold;
              padding: 1rem;
              margin-right: 1rem;
          }
          /*--------------------*/
          .DMS {
              position: absolute;
              width: 8.2rem;
              margin-left: 27rem;
          }
          .DMS-checkbox {
              display: none;
          }
          .DMS-label {
              display: block;
              overflow: hidden;
              cursor: pointer;
              border: 2px solid #c0d8fc;
              border-radius: 20px;
          }
          .DMS-inner {
              display: block;
              width: 200%;
              margin-left: -100%;
              transition: margin 0.3s ease-in 0s;
          }
          .DMS-inner:before,
          .DMS-inner:after {
              display: block;
              float: left;
              width: 50%;
              height: 30px;
              padding: 0;
              line-height: 30px;
              font-size: 14px;
              font-family: Trebuchet, Arial, sans-serif;
              font-weight: bold;
              box-sizing: border-box;
          }
          .DMS-inner:before {
              content: "${f("\u6efe\u52d5\u95b1\u8b80")}";
              padding-left: 1.7rem;
              background-color: #3d8fe7;
              color: #FFFFFF;
          }
          .DMS-inner:after {
              content: "${f("\u7ffb\u9801\u95b1\u8b80")}";
              padding-right: 1.5rem;
              background-color: #FFFFFF;
              color: #3d8fe7;
              text-align: right;
          }
          .DMS-switch {
              display: block;
              width: 18px;
              margin: 6px;
              background: #FFFFFF;
              position: absolute;
              top: 0;
              bottom: 0;
              right: 96px;
              border: 2px solid #999999;
              border-radius: 20px;
              transition: all 0.3s ease-in 0s;
          }
          .DMS-checkbox:checked+.DMS-label .DMS-inner {
              margin-left: 0;
          }
          .DMS-checkbox:checked+.DMS-label .DMS-switch {
              right: 0px;
          }
      `);
      setTimeout(() => {
          e = Syn.$$("#New-Style").sheet.cssRules;
      }, 1300);
      return {
          IsMobile: Syn.Device.Url.includes("photos-slist-aid"),
          LoadingConfig: a,
          SwitchStatus: p,
          ConfigAnalyze: (d) =>
              "auto" === d
                  ? { RangeValue: 9, DisplayText: "auto" }
                  : d.endsWith("rem") || d.endsWith("%")
                      ? { RangeValue: parseInt(d), DisplayText: d }
                      : { RangeValue: d, DisplayText: "color" },
          StylePointer: {
              MenuTop: (d) => (e[9].style.top = d),
              MenuLeft: (d) => (e[9].style.left = d),
              ImageSpacing: (d) => (e[0].style.margin = `${d} auto`),
              ImageBasicWidth: (d) => (e[0].style.width = d),
              ImageMaxWidth: (d) => {
                  e[0].style.maxWidth = d;
                  e[2].style.maxWidth = d;
              },
              ImageBasicHight: (d) => (e[0].style.height = d),
              ImageMaxHight: (d) => (e[0].style.maxHeight = d),
              BackgroundColor: (d, v) => {
                  d.style.setProperty("background-color", v, "important");
              },
          },
          Transl: f,
      };
  })();
  (async () => {
      if ("Mobile" != Syn.Device.Type())
          if (
              (GM_registerMenuCommand(
                  h.Transl("\ud83d\udd32 \u958b\u95dc\u83dc\u55ae"),
                  () => w(!0)
              ),
                  Syn.AddListener(
                      window,
                      "keydown",
                      (a) => {
                          const e = a.key;
                          "Shift" === e
                              ? (a.preventDefault(), w())
                              : "Escape" === e &&
                              (a.preventDefault(), Syn.$$(".modal-background")?.remove());
                      },
                      { capture: !0 }
                  ),
                  h.IsMobile)
          ) {
              const a = new Map();
              Syn.WaitElem(
                  "#img_list",
                  (e) => {
                      Syn.Observer(
                          e,
                          () => {
                              Syn.$$("div", { root: e, all: !0 }).forEach((f) => {
                                  a.has(f) ||
                                      (a.set(f, !0),
                                          (f.style.cssText = "text-align: center"),
                                          (f = Syn.$$("img", { root: f })),
                                          f.removeAttribute("width"),
                                          f.classList.add("ImageOptimization"));
                              });
                          },
                          { throttle: 1500 }
                      );
                  },
                  { raf: !0, timeout: 10 }
              );
          } else
              Syn.WaitMap(
                  ".png.bread;#bread;#photo_body;span.newpagelabel b;#bodywrap;.newpagewrap;.footer.wrap".split(
                      ";"
                  ),
                  (a) => {
                      const [e, f, r, q, p, m, n] = a;
                      ReactDOM.render(
                          React.createElement("div", {
                              dangerouslySetInnerHTML: { __html: e.innerHTML },
                          }),
                          f
                      );
                      r.classList.remove("photo_body");
                      [p, m, n].forEach((c) => {
                          c.style.display = "none";
                      });
                      x(r, +q.textContent);
                  },
                  { raf: !0, timeout: 10 }
              );
  })();
})();