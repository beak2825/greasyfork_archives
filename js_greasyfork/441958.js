// ==UserScript==
// @name        微信编辑器增强🧬
// @namespace   http://tampermonkey.net/
// @match       *://www.135editor.com/*
// @match       *://bj.96weixin.com/*
// @match       *://www.365editor.com/*
// @match       *://mp.weixin.qq.com/*
// @icon        https://www.135editor.com/img/vip/vip.png
// @require     https://cdn.jsdelivr.net/npm/jscolor-picker@2.0.4/jscolor.min.js
// @grant       GM_addStyle
// @version     2.0.1
// @author      ec50n9
// @description 为135、96、365编辑器去除广告，免vip，增加css样式编辑面板等...
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/441958/%E5%BE%AE%E4%BF%A1%E7%BC%96%E8%BE%91%E5%99%A8%E5%A2%9E%E5%BC%BA%F0%9F%A7%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/441958/%E5%BE%AE%E4%BF%A1%E7%BC%96%E8%BE%91%E5%99%A8%E5%A2%9E%E5%BC%BA%F0%9F%A7%AC.meta.js
// ==/UserScript==
(() => {
  "use strict";
  function e(e, n, t, i) {
    let o,
      d,
      r,
      l,
      a,
      c = 0,
      s = 0,
      f = 0;
    switch (
      (n < 0 && (n = 0),
      n > 1 && (n = 1),
      t < 0 && (t = 0),
      t > 1 && (t = 1),
      (e %= 360) < 0 && (e += 360),
      (e /= 60),
      (o = Math.floor(e)),
      (d = e - o),
      (r = t * (1 - n)),
      (l = t * (1 - n * d)),
      (a = t * (1 - n * (1 - d))),
      o)
    ) {
      case 0:
        (c = t), (s = a), (f = r);
        break;
      case 1:
        (c = l), (s = t), (f = r);
        break;
      case 2:
        (c = r), (s = t), (f = a);
        break;
      case 3:
        (c = r), (s = l), (f = t);
        break;
      case 4:
        (c = a), (s = r), (f = t);
        break;
      case 5:
        (c = t), (s = r), (f = l);
    }
    return i && i < 1
      ? "rgba(" +
          Math.round(255 * c) +
          ", " +
          Math.round(255 * s) +
          ", " +
          Math.round(255 * f) +
          ", " +
          i +
          ")"
      : "rgb(" +
          Math.round(255 * c) +
          ", " +
          Math.round(255 * s) +
          ", " +
          Math.round(255 * f) +
          ")";
  }
  function n(e, n, t, i) {
    (e /= 255), (n /= 255), (t /= 255);
    const o = Math.max(e, n, t),
      d = o - Math.min(e, n, t);
    let r = o,
      l = 0 === r ? 0 : d / r,
      a = 0;
    return (
      e === r && (a = (60 * (n - t)) / d),
      n === r && (a = 120 + (60 * (t - e)) / d),
      t === r && (a = 240 + (60 * (e - n)) / d),
      0 === d && (a = 0),
      a < 0 && (a += 360),
      (a = a / 2 / 180),
      (a = Number(a.toFixed(4))),
      (l = Number(l.toFixed(4))),
      (r = Number(r.toFixed(4))),
      [a, l, r, i]
    );
  }
  const t = function (e, n) {
      (n || $("head")).append($(`<style>${e}</style>`));
    },
    i = function (e, n) {
      const i = $("body"),
        o = $("#ueditor_0");
      if (
        (t(
          ".ective{outline: 1.5px dashed red !important; outline-offset: 2px; position: relative;}",
          o.contents().find("head")
        ),
        i.hasClass("running"))
      )
        if (
          (e.fadeOut(200),
          o.contents().find("body").unbind(),
          i.removeClass("running"),
          o.contents().find("body .ective").removeClass("ective"),
          n)
        )
          n(!1);
        else {
          const e = i.find("#ec-change");
          (e.length ? e : i)
            .css({ "background-color": "#e8b004" })
            .text("编辑进化");
        }
      else if (
        (e.fadeIn(200),
        o
          .contents()
          .find("body")
          .on(
            "click",
            (function (e) {
              const n = e.find("#ec_path_list"),
                t = e.find("#ec_win_style"),
                i = e.find("#ec_win_input_style"),
                o = e.find("#ec_win_add_style"),
                d = e.find("#ec_win_attr"),
                r = e.find("#ec_child_list"),
                l = e.find("#ec_win_html"),
                a = e.find("#ec_win_delete"),
                c = e.find("#ec_win_parent"),
                s = e.find("#ec_win_write");
              return function (e) {
                const f = $(e.target);
                $("#ueditor_0")
                  .contents()
                  .find("body .ective")
                  .removeClass("ective"),
                  f.addClass("ective"),
                  n.html(""),
                  t.html(""),
                  d.html(""),
                  l.val(""),
                  o.unbind(),
                  r.html(""),
                  s.unbind(),
                  c.unbind(),
                  a.unbind(),
                  f.each(function () {
                    f
                      .parents()
                      .filter("body *")
                      .each(function () {
                        let e = $(
                          `<li><a style="color:#ff793f;" href="javascript:;">${this.tagName}</a></li>`
                        );
                        n.prepend(e);
                        let t = $(this);
                        e.find("a").bind("click", function () {
                          t.click();
                        });
                      }),
                      n.append(`<li>[ ${this.tagName} ]</li>`),
                      $.each(this.attributes, function () {
                        if (this.specified)
                          if ("style" === this.name) {
                            let e = this.value.split(";");
                            for (let n = 0; n < e.length; n++) {
                              let i = e[n];
                              if (i) {
                                let e = i.split(":"),
                                  n = i.slice(i.indexOf(":") + 1).trim(),
                                  o = $(
                                    `<tr ec-attr="${e[0]}"><th>${
                                      e[0]
                                    }</th><td><input type="${
                                      (n.match(/^#[a-f0-9]{3,6}$/i), "text")
                                    }" value="${n}" style="border:2px solid #eee;padding:0 8px; border-radius:2px;"></td></tr>`
                                  );
                                t.append(o);
                              }
                            }
                          } else {
                            let e = $(
                              `<tr ec-attr="${this.name}"><th>${this.name}</th><td><input type="text" value="${this.value}" style="border:2px solid #eee;padding:0 8px; border-radius:2px;"></td></tr>`
                            );
                            d.append(e);
                          }
                      });
                  });
                const p = function (e, n, t) {
                  const i = $(
                    '<ul style="list-style-type:circle; margin-left:2em;"></ul>'
                  );
                  n.children().each(function () {
                    let e = $(
                        `<li><a style="color:#ff793f;" href="javascript:;">${this.tagName}</a></li>`
                      ),
                      n = $(this);
                    e.find("a").bind("click", function () {
                      return n.click(), !1;
                    }),
                      i.append(e),
                      p(i, n, e);
                  }),
                    i.html() &&
                      (e.append(i),
                      t &&
                        t
                          .css("list-style-type", "disc")
                          .on("click", function () {
                            i.slideToggle(200);
                          }));
                };
                function u(e) {
                  let n = t.find("tr"),
                    i = "";
                  for (let e = 0; e < n.length; e++) {
                    let t = $(n[e]);
                    t.find("input").val() &&
                      (i =
                        i +
                        t.attr("ec-attr") +
                        ":" +
                        t.find("input").val() +
                        ";");
                  }
                  e.attr("style", i);
                }
                return (
                  p(r, f),
                  l.val(f.html()),
                  o.bind("click", function () {
                    let e = (i.val() || "").toString();
                    if (e) {
                      let n = e.split(":");
                      t.append(
                        `<tr ec-attr="${n[0]}"><th>${
                          n[0]
                        }</th><td><input type="text" value="${
                          n.length > 1 ? n[1].replace(";", "") : ""
                        }" style="border:2px solid #eee;padding:0 8px; border-radius:2px;"></td></tr>`
                      ),
                        i.val("");
                    }
                    u(f);
                  }),
                  s.bind("click", function () {
                    u(f);
                    let e = d.find("tr");
                    for (let n = 0; n < e.length; n++) {
                      let t = $(e[n]);
                      f.attr(t.attr("ec-attr"), t.find("input").val());
                    }
                    f.html((l.val() || "").toString());
                  }),
                  c.on("click", function () {
                    f.parent().click();
                  }),
                  a.on("click", function () {
                    let e = f.parent();
                    f.remove(), e.click();
                  }),
                  !1
                );
              };
            })(e)
          ),
        i.addClass("running"),
        n)
      )
        n(!0);
      else {
        const e = i.find("#ec-change");
        (e.length ? e : i)
          .css({ "background-color": "#20a162" })
          .text("解除进化");
      }
    };
  console.log("--- inject ---"),
    GM_addStyle(
      '#ec_window {\n  display: flex;\n  flex-direction: column;\n  position: fixed;\n  top: 5%;\n  left: 25%;\n  width: 24em;\n  max-height: 90%;\n  background-color: #fff;\n  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,\n    rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;\n  border-radius: 1em;\n  overflow: hidden;\n  z-index: 999;\n  font-family: PingFangSC-Regular, "Georgia Pro", Georgia, Times,\n    "Times New Roman", sans-serif;\n}\n#ec_path_list {\n  list-style: none;\n  display: flex;\n  flex-wrap: wrap;\n  text-transform: lowercase;\n}\n#ec_path_list li:nth-child(n + 2)::before {\n  content: ">";\n  margin: 0 0.5em;\n}\n#ec_win_style th,\n#ec_win_attr th {\n  width: 40%;\n  border-width: 1px;\n  font-weight: 500;\n}\n.header {\n  position: relative;\n  padding: 0.2rem 0;\n  color: #000;\n  font-weight: 700;\n  background-color: #fff;\n  cursor: move;\n  user-select: none;\n}\n.header__title {\n  text-align: center;\n}\n.header__btns-wrapper {\n  position: absolute;\n  top: 50%;\n  left: 0;\n  transform: translateY(-40%);\n}\n.header__btn {\n  display: inline-block;\n  width: 0.9em;\n  height: 0.9em;\n  margin-left: 0.5em;\n  background-color: #fff;\n  border: none;\n  border-radius: 50%;\n  cursor: pointer;\n}\n#ec_win_close {\n  background-color: rgb(239, 68, 68);\n}\n#ec_win_mini {\n  background-color: rgb(245, 158, 11);\n}\n.tab-wrapper {\n  display: flex;\n  flex-direction: row;\n}\n.tab {\n  flex-grow: 1;\n  color: rgb(107, 114, 128);\n  font-size: 0.9rem;\n  padding: 0.2rem 0;\n  margin: 0.3rem;\n  text-align: center;\n  border-radius: 0.5rem;\n  cursor: pointer;\n}\n.tab--active {\n  color: #fff;\n  font-weight: 700;\n  background-color: rgb(16, 185, 129);\n  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;\n}\n#ec_panel_wrapper {\n  display: flex;\n  overflow: hidden;\n}\n#ec_panel_element {\n  display: flex;\n  width: 100%;\n  flex-direction: column;\n  margin: 1em;\n  overflow: hidden;\n}\n#ec_win_html {\n  width: 100%;\n  resize: none;\n  box-sizing: border-box;\n}\n\n#ec_panel_color,\n#ec_panel_template {\n  width: 100%;\n  margin: 2em;\n}\n\n#color_picker {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n}\n#color_color {\n  position: relative;\n  width: 100%;\n  height: 10em;\n  background-color: rgb(255, 0, 0);\n}\n#color_sat {\n  width: 100%;\n  height: 100%;\n  background-image: linear-gradient(to right, #fff, rgba(204, 154, 129, 0));\n}\n#color_val {\n  width: 100%;\n  height: 100%;\n  background-image: linear-gradient(to top, #000, rgba(204, 154, 129, 0));\n}\n#color_dragger {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 1em;\n  height: 1em;\n  transform: translate(-50%, -50%);\n  border-radius: 50%;\n  background-color: #fff;\n  border: 2px solid #000;\n}\n#color_h {\n  position: relative;\n  width: 100%;\n  height: 1em;\n  margin: 0.5em 0;\n  background: -webkit-linear-gradient(\n    left,\n    #ff0000 0%,\n    #ffff00 17%,\n    #00ff00 33%,\n    #00ffff 50%,\n    #0000ff 67%,\n    #ff00ff 83%,\n    #ff0000 100%\n  );\n}\n#color_alpha {\n  position: relative;\n  width: 100%;\n  height: 1em;\n  margin: 0.5em 0;\n  background-image: url(https://s1.ax1x.com/2022/04/17/LN6aCR.png);\n}\n#color_h_dragger,\n#color_alpha_dragger {\n  position: absolute;\n  top: -10%;\n  left: 100%;\n  width: 0.5em;\n  height: 120%;\n  transform: translateX(-50%);\n  background-color: #d1d5db;\n}\n#color_alpha_inner {\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0)\n    linear-gradient(to right, rgba(255, 0, 0, 0), rgb(255, 0, 0)) repeat scroll\n    0% 0%;\n}\n#color_preview_wrapper {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  width: 100%;\n  margin: 1em 0;\n}\n#color_preview {\n  width: 2em;\n  height: 2em;\n  background-color: rgb(0, 0, 0);\n  border: 2px solid #eee;\n}\n#color_preview_text {\n  flex-grow: 1;\n  width: 1em;\n  margin-left: 1em;\n  border: 2px solid #eee;\n  padding: 0.1em 0.5em;\n  border-radius: 0.5em;\n}\n#color_copy {\n  align-self: flex-end;\n  padding: 0.2em 0.8em;\n  border-radius: 0.4em;\n  border: 2px solid #eee;\n  color: #fff;\n  background-color: #3b82f6;\n}\n'
    );
  let o = $(
    '<div id="ec_window">\n  <div id="ec_header" class="header">\n    <div class="header__title truncate">编辑面板</div>\n    <div class="header__btns-wrapper">\n      <div id="ec_win_close" class="header__btn"></div>\n      <div id="ec_win_mini" class="header__btn"></div>\n    </div>\n  </div>\n  <div id="ec_tabs" class="tab-wrapper">\n    <div id="ec_tab_element" class="tab tab--active">元素</div>\n    <div id="ec_tab_color" class="tab">色板</div>\n    <div id="ec_tab_template" class="tab">模板</div>\n  </div>\n  <div id="ec_panel_wrapper">\n    <div id="ec_panel_element" class="ec_panel">\n      <div id="ec_path_list"></div>\n      <div style="display:flex; flex-direction:column; overflow-y:scroll;">\n        <h2 style="margin-top:1em; font-weight:600">当前元素样式</h2>\n        <table id="ec_win_style"></table>\n        <div style="display:flex; align-items:center; margin-top:.5em">\n          <input id="ec_win_input_style" type="text" value="" placeholder="例: color: red;"\n            style="flex-grow:1; border:2px solid #eee;padding:0 8px; border-radius:2px;">\n          <button id="ec_win_add_style"\n            style="min-width:5em; margin-left:1em; padding:.2em .8em; border-radius:.4em; border:2px solid #eee; color:#fff; background-color:#3B82F6;">添加样式</button>\n        </div>\n        <div style="display:none; margin-top:.8em; color:#999; font-size:.8em;">\n          每次只能添加<strong>一条</strong>样式。<br>\n          添加样式后需要点击下方<strong>写入</strong>才可生效。<br>\n          清空编辑框后点击<strong>写入</strong>即可删除该行样式。\n        </div>\n        <h2 style="margin-top:1em; font-weight:600">属性</h2>\n        <table id="ec_win_attr"></table>\n        <h2 style="margin-top:1em; font-weight:600">子元素</h2>\n        <ul id="ec_child_list" style="margin:0;">\n        </ul>\n        <h2 style="margin-top:1em; font-weight:600">内容</h2>\n        <div style="width:100%">\n          <textarea id="ec_win_html" rows="5"\n            style="width:100%; border:2px solid #eee; padding:0 8px; border-radius:2px;">元素文本</textarea>\n        </div>\n      </div>\n      <div style="display:flex; flex-direction: row; align-items: center; justify-content: right;">\n        <button id="ec_win_delete"\n          style="align-self:flex-end; padding:.2em .8em; border-radius:.4em; border:2px solid #eee; color:#fff; background-color:#B91C1C;">删除元素</button>\n        <button id="ec_win_parent"\n          style="align-self:flex-end; padding:.2em .8em; border-radius:.4em; border:2px solid #eee; color:#fff; background-color:#F59E0B;">父容器</button>\n        <button id="ec_win_write"\n          style="align-self:flex-end; padding:.2em .8em; border-radius:.4em; border:2px solid #eee; color:#fff; background-color:#3B82F6;">更新写入</button>\n      </div>\n    </div>\n    <div id="ec_panel_color" class="ec_panel">\n      <h2>调色板</h2>\n      <div id="color_picker">\n        <div id="color_color">\n          <div id="color_sat">\n            <div id="color_val">\n              <div id="color_dragger"></div>\n            </div>\n          </div>\n        </div>\n        <div id="color_h">\n          <div id="color_h_dragger"></div>\n        </div>\n        <div id="color_alpha">\n          <div id="color_alpha_inner">\n            <div id="color_alpha_dragger"></div>\n          </div>\n        </div>\n        <div id="color_preview_wrapper">\n          <div id="color_preview"></div>\n          <input id="color_preview_text" type="text" placeholder="点击色板以选择颜色值">\n        </div>\n        <button id="color_copy">复制颜色值</button>\n      </div>\n    </div>\n    <div id="ec_panel_template" class="ec_panel">\n      <h2>开发中。。。</h2>\n    </div>\n  </div>\n</div>'
  ).hide();
  const d = o.find("#ec_header"),
    r = (o.find("#ec_win_close"), o.find("#ec_win_mini")),
    l = o.find("#ec_tabs"),
    a = o.find("#ec_tab_element"),
    c = o.find("#ec_tab_color"),
    s = o.find("#ec_tab_template"),
    f = o.find("#ec_panel_wrapper"),
    p = o.find("#ec_panel_element"),
    u = o.find("#ec_panel_color").hide(),
    h = o.find("#ec_panel_template").hide();
  r.click(function () {
    l.toggle(), f.toggle();
  }),
    a.click(function () {
      console.log("gogo:", o.find(".tab--active")),
        o.find(".tab--active").removeClass("tab--active"),
        a.addClass("tab--active"),
        o.find(".ec_panel:not(#ec_panel_element)").hide(),
        p.show();
    }),
    c.click(function () {
      o.find(".tab--active").removeClass("tab--active"),
        c.addClass("tab--active"),
        o.find(".ec_panel:not(#ec_panel_color)").hide(),
        u.show();
    }),
    s.click(function () {
      o.find(".tab--active").removeClass("tab--active"),
        s.addClass("tab--active"),
        o.find(".ec_panel:not(#ec_panel_template)").hide(),
        h.show();
    }),
    (function (t) {
      const i = t.find("#color_color"),
        o = t.find("#color_dragger"),
        d = t.find("#color_h"),
        r = t.find("#color_h_dragger"),
        l = t.find("#color_alpha"),
        a = t.find("#color_alpha_dragger"),
        c = t.find("#color_preview"),
        s = t.find("#color_preview_text"),
        f = t.find("#color_copy");
      let p = 0,
        u = 0,
        h = 0,
        g = 1;
      function b() {
        const n = e(p, u, h, g);
        c.css("background-color", n), s.val(n);
      }
      function _(e, n) {
        e.mousedown(function (i) {
          let o = i.pageX - e.offset().left,
            d = i.pageY - e.offset().top;
          return (
            n(o, d),
            t.mousemove(function (t) {
              (o = t.pageX - e.offset().left),
                (d = t.pageY - e.offset().top),
                n(o, d);
            }),
            t.mouseup(function (e) {
              t.off("mousemove"), t.off("mouseup");
            }),
            t.mouseleave(function (e) {
              t.off("mousemove"), t.off("mouseup");
            }),
            !1
          );
        });
      }
      s.change(function () {
        const t = s.val().trim();
        let c;
        if (t.match(/^#[a-f0-9]{3,8}$/i)) {
          const {
            red: e,
            green: i,
            blue: o,
            alpha: d,
          } = (function (e) {
            let n = e.substring(1),
              t = 1;
            return (
              n.length < 6
                ? (n = (function (e, n) {
                    let t = "";
                    for (let n of e) t += i(n, 2);
                    return t;
                  })(n))
                : 8 == n.length &&
                  ((t = ("0x" + n) & "0xff"),
                  (t = Number(((t / 255) * 1).toFixed(2))),
                  (n = n.substring(0, 6))),
              (n = "0x" + n),
              {
                red: n >> 16,
                green: (n >> 8) & "0xff",
                blue: "0xff" & n,
                alpha: t,
              }
            );
            function i(e, n) {
              let t = "";
              for (let i = 0; i < n; i++) t += e;
              return t;
            }
          })(t);
          (c = n(e, i, o, d)), b();
        } else if (t.match(/^rgba\(.+?\)$/i)) {
          const e = t
            .replace(/\s+/g, "")
            .match(/^rgba\(([0-9]+),([0-9]+),([0-9]+),([0-9.]+)\)$/i);
          c = n(e[1], e[2], e[3], e[4]);
        } else {
          if (!t.match(/^rgb\(.+?\)$/i)) return;
          {
            const e = t
              .replace(/\s+/g, "")
              .match(/^rgb\(([0-9]+),([0-9]+),([0-9]+)\)$/i);
            c = n(e[1], e[2], e[3], 1);
          }
        }
        (p = 360 * c[0]),
          (u = c[1]),
          (h = c[2]),
          (g = c[3]),
          i.css("background-color", e(p, 1, 1, 1)),
          o.css({
            left: u * i.width() + "px",
            top: i.height() - h * i.height(),
          }),
          r.css({ left: (p * d.width()) / 360 }),
          a.css({ left: g * l.width() }),
          b();
      }),
        f.click(function (e) {
          console.log("hello"), s.select(), document.execCommand("Copy");
        }),
        _(i, function (e, n) {
          e < 0 && (e = 0),
            e > i.width() && (e = i.width()),
            n < 0 && (n = 0),
            n > i.height() && (n = i.height()),
            o.css({ left: e + "px", top: n + "px" }),
            (u = e / i.width()),
            (h = (i.height() - n) / i.height()),
            b();
        }),
        _(d, function (n) {
          n < 0 && (n = 0),
            n > d.width() && (n = d.width()),
            r.css({ left: n + "px" }),
            (p = ~~((n / d.width()) * 360)),
            i.css("background-color", e(p, 1, 1, 1)),
            b();
        }),
        _(l, function (e) {
          e < 0 && (e = 0),
            e > l.width() && (e = l.width()),
            a.css({ left: e + "px" }),
            (g = Number((e / l.width()).toFixed(2))),
            b();
        });
    })(o),
    $(function () {
      $("body").append(o),
        (function (e, n) {
          e.mousedown(function (e) {
            var t = n.offset(),
              i = e.pageX - t.left,
              o = e.pageY - t.top;
            return (
              $(document).mousemove(function (e) {
                var t = e.pageX - i,
                  d = e.pageY - o;
                t < 0
                  ? (t = 0)
                  : t > $(document).width() - n.outerWidth(!0) &&
                    (t = $(document).width() - n.outerWidth(!0)),
                  d < 0
                    ? (d = 0)
                    : d > $(document).height() - n.outerHeight(!0) &&
                      (d = $(document).height() - n.outerHeight(!0)),
                  n.css({ left: t + "px", top: d + "px" });
              }),
              $(document).mouseup(function () {
                $(document).off("mousemove");
              }),
              !1
            );
          });
        })(d, o),
        t("#ec-change{color:#fff; background-color:#e8b004;}"),
        (function (e) {
          const n = window.location.host;
          n.search(/www.135editor.com/) >= 0
            ? (function (e) {
                setInterval(() => {
                  let e = $("#editor-template-scroll li");
                  for (let n = 0, t = e.length; n < t; n++)
                    e[n].classList.remove("vip-style");
                  $(".vip-flag").remove(), $(".user-unread-msgnum").hide();
                  try {
                    articleManager.setVIP(!0);
                  } catch (e) {}
                }, 1e3),
                  (unsafeWindow.style_click =
                    unsafeWindow.show_role_vip_dialog =
                      function () {
                        console.log("hey!");
                      }),
                  (style_click = show_role_vip_dialog = function () {}),
                  $("#add_xiaoshi").hide(),
                  $(
                    ".category-nav.editor-nav>.nav-item:nth-last-child(-n+2)"
                  ).hide(),
                  $(
                    "#fixed-side-bar li:not(#function-settings), #fixed-bar-pack-up"
                  ).hide();
                let n = $(
                  '<li style="margin-bottom: 20px;"><a href="javascript:;" id="ec-change" class="btn btn-default btn-xs" title="绑定监听器">编辑进化</a></li>'
                ).on("click", () => i(e));
                $("#operate-tool").prepend(n);
                let t = $(
                  '<li><a href="javascript:;" class="btn btn-default btn-xs" title="打开色板">开关色板</a></li>'
                ).on("click", function () {
                  $("#color-plan").fadeToggle(300);
                });
                $("#operate-tool").prepend(t);
              })(e)
            : n.search(/bj.96weixin.com/) >= 0
            ? (function (e) {
                setInterval(() => {
                  $(".rich_media_content").attr("data-vip", 1);
                }, 1e3);
                let n = $(
                  '<button type="button" id="ec-change" class="layui-btn layui-btn-primary">编辑进化</button>'
                ).on("click", () => i(e));
                $(".button-tools").prepend(n);
              })(e)
            : n.search(/www.365editor.com/) >= 0
            ? (function (e) {
                let n = $(
                  '<li id="ec-change" data-act="import"><span>编辑进化</span></li>'
                ).on("click", () => i(e));
                $(".m-tools").prepend(n);
              })(e)
            : n.search(/mp.weixin.qq.com/) >= 0 &&
              (function (e) {
                t("#ec-change {\n  border-radius: 4px;\n}\n");
                const n = $(
                    '<div id="edui201" class="edui-box edui-separator edui-default"></div>'
                  ),
                  o = $(
                    '<div id="ec-change" class="edui-box edui-splitbutton edui-for-inserttable edui-default">\n  <div data-tooltip="编辑进化" id="edui202_state">\n    <div class="edui-splitbutton-body edui-default">\n      <div id="edui202_button_body" class="edui-box edui-button-body edui-default">\n        <div class="edui-box edui-default" style="font-size: 1rem;">🧬</div>\n      </div>\n      <div class="edui-box edui-splitborder edui-default"></div>\n      <div class="edui-box edui-arrow edui-default" onclick="$EDITORUI[&quot;edui202&quot;]._onArrowClick();"></div>\n    </div>\n  </div>\n</div>'
                  ).on("click", () =>
                    i(e, (e) => {
                      e
                        ? o.css({ "background-color": "#20a162" })
                        : o.css({ "background-color": "#e8b004" });
                    })
                  );
                $("#js_toolbar_0").append(n).append(o);
              })(e);
        })(o);
    }),
    console.log("--- inject end ---");
})();
