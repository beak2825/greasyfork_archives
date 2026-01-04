// ==UserScript==
// @name         m-team大图浏览
// @namespace    mteam
// @version      0.6.0-beta.10
// @description  种子列表/详情/演员列表 大图浏览，标题翻译，预览视频。
// @author       AfAn
// @license      MIT
// @match        https://*.m-team.cc/*
// @connect      translate.google.com
// @connect      fourhoi.com
// @grant        GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/32651/m-team%E5%A4%A7%E5%9B%BE%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/32651/m-team%E5%A4%A7%E5%9B%BE%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==
!(function () {
  "use strict";
  const e = window.location.host;
  var t, n;
  (t = window.history),
    (n = t.pushState),
    (t.pushState = function (e) {
      return (
        "function" == typeof t.onpushstate && t.onpushstate({ state: e }),
        n.apply(t, arguments)
      );
    }),
    (window.history.onpushstate = function (e) {
      setTimeout(function () {}, 0);
    });
  var o = {
      "/api/torrent/search": function (t) {
        !(async function (t) {
          if (0 !== window.location.href.indexOf(`https://${e}/browse/adult`))
            return;
          let n = JSON.parse(t);
          if (!n || !("code" in n) || "0" != n.code) return !1;
          document.querySelector(".app-content__inner").style.maxWidth =
            "2160px";
          const o = "ob.m-team.cc" === e ? 2 : 1,
            a = window.innerWidth >= 1400 ? "600px" : "500px";
          (document.querySelector(
            `div.ant-spin-container table thead tr th:nth-of-type(${o})`
          ).style.width = a),
            (document.querySelector(
              "div.app-content__inner div.mx-auto"
            ).style.maxWidth = "100%");
          let r = [];
          for (let e = 0; e < 30; e++) {
            await l(1e3),
              (r = document.querySelectorAll(
                "div.ant-spin-container table tbody tr"
              ));
            let e = +n.data.pageSize,
              t = +n.data.total;
            if (r.length == e) break;
            if (t < e && r.length == t) break;
          }
          document
            .querySelectorAll(
              "div.ant-spin-container table div.trans-container"
            )
            .forEach((e) => {
              e.remove();
            }),
            r.forEach(async (t, r) => {
              const c = t.querySelector(
                `td:nth-of-type(${o}) img.torrent-list__thumbnail`
              );
              (c.style.height = "auto"),
                (c.style.maxHeight = "600px"),
                (c.style.width = "100%"),
                (c.style.maxWidth = a),
                c.addEventListener("click", function (t) {
                  t.stopPropagation(),
                    window.open(
                      `https://${e}/detail/${n.data.data[r].id}`,
                      "_blank"
                    );
                }),
                t.querySelector(`td:nth-of-type(${o}) div.ant-image-mask`) &&
                  t
                    .querySelector(`td:nth-of-type(${o}) div.ant-image-mask`)
                    .remove();
              let d = t.querySelector("td:nth-of-type(1)");
              "ob.m-team.cc" === e &&
                (d = t.querySelector("td:nth-of-type(3)"));
              let p = d.querySelectorAll(
                "span.ant-typography-ellipsis-single-line"
              );
              if (
                ((p[0].style.whiteSpace = "normal"),
                (p[0].style.overflow = "unset"),
                (p[0].style.textOverflow = "unset"),
                (p[0].style.display = "block"),
                p.length > 1 &&
                  ((p[1].style.whiteSpace = "normal"),
                  (p[1].style.overflow = "unset"),
                  (p[1].style.textOverflow = "unset"),
                  (p[1].style.display = "block")),
                d.querySelector("br") && d.querySelector("br").remove(),
                "ob.m-team.cc" !== e)
              ) {
                const e = p[0].closest("a");
                e &&
                  e.parentNode.querySelectorAll("a ~ div").forEach((e) => {
                    e.style.display = "block";
                  });
              } else p[0].closest("a > div").style.display = "block";
              async function u(e, t) {
                e.disabled = !0;
                let n = p[0].querySelector("strong").innerText;
                p.length > 1 && (n += " ||| " + p[1].innerText);
                let o = await i(n);
                (o = o.replace("|||", "<br />")), (t.innerHTML = o);
              }
              await s(p[0], c),
                (() => {
                  let e = document.createElement("div"),
                    t = document.createElement("button");
                  (t.innerText = "翻 译"),
                    t.classList.add(
                      "ant-btn",
                      "css-n9csir",
                      "ant-btn-default",
                      "ant-btn-sm"
                    ),
                    (t.onclick = () => {
                      u(t, e);
                    }),
                    (e.style.marginTop = "2rem"),
                    e.appendChild(t),
                    e.classList.add("trans-container"),
                    p[0].closest("a").parentNode.appendChild(e);
                })(),
                30 === r && (await l(1e3));
            });
        })(t);
      },
      "/api/dmm/showcase/fetchList": function (t) {
        !(async function (t) {
          const n = window.location.href;
          if (
            0 !== n.indexOf(`https://${e}/showcaseDetail?id=`) &&
            0 !== n.indexOf(`https://${e}/showcaseDetail?name=`)
          )
            return;
          let o = JSON.parse(t);
          if (!o || !("code" in o) || "0" != o.code) return !1;
          document.querySelector(".app-content__inner").style.maxWidth =
            "2160px";
          const a = 2,
            r = window.innerWidth >= 1400 ? "600px" : "500px";
          (document.querySelector(
            `div.ant-spin-container table thead tr th:nth-of-type(${a})`
          ).style.width = r),
            (document.querySelector(
              "div.app-content__inner div.mx-auto"
            ).style.maxWidth = "100%");
          let c = [];
          for (
            let e = 0;
            e < 30 &&
            (await l(1e3),
            (c = document.querySelectorAll(
              "div.ant-spin-container table tbody tr"
            )),
            c.length != o.data.list.length);
            e++
          );
          c.forEach(async (t, n) => {
            const c = t.querySelector(
              `td:nth-of-type(${a}) img.torrent-list__thumbnail`
            );
            if (
              ((c.style.height = "auto"),
              (c.style.width = "100%"),
              (c.style.maxWidth = r),
              c.addEventListener("click", function (t) {
                t.stopPropagation(),
                  window.open(
                    `https://${e}/detail/${o.data.list[n].id}`,
                    "_blank"
                  );
              }),
              t.querySelector(`td:nth-of-type(${a}) div.ant-image-mask`) &&
                t
                  .querySelector(`td:nth-of-type(${a}) div.ant-image-mask`)
                  .remove(),
              "ob.m-team.cc" !== e)
            ) {
              let e = t.querySelector("td:nth-of-type(2)"),
                o = e.querySelectorAll(
                  "span.ant-typography-ellipsis-single-line"
                );
              (o[0].style.whiteSpace = "normal"),
                (o[0].style.overflow = "unset"),
                (o[0].style.textOverflow = "unset"),
                (o[0].style.display = "block"),
                o.length > 1 &&
                  ((o[1].style.whiteSpace = "normal"),
                  (o[1].style.overflow = "unset"),
                  (o[1].style.textOverflow = "unset"),
                  (o[1].style.display = "block")),
                e.querySelector("br") && e.querySelector("br").remove();
              const a = o[0].closest("a");
              async function r(e, t) {
                e.disabled = !0;
                let n = o[0].querySelector("strong").innerText;
                o.length > 1 && (n += " ||| " + o[1].innerText);
                let a = await i(n);
                (a = a.replace("|||", "<br />")), (t.innerHTML = a);
              }
              a &&
                a.parentNode.querySelectorAll("a ~ div").forEach((e) => {
                  e.style.display = "block";
                }),
                await s(o[0], c),
                (() => {
                  let e = document.createElement("div"),
                    t = document.createElement("button");
                  (t.innerText = "翻 译"),
                    t.classList.add(
                      "ant-btn",
                      "css-n9csir",
                      "ant-btn-default",
                      "ant-btn-sm"
                    ),
                    (t.onclick = () => {
                      r(t, e);
                    }),
                    (e.style.marginTop = "2rem"),
                    e.appendChild(t),
                    e.classList.add("trans-container"),
                    o[0].closest("a").parentNode.appendChild(e);
                })(),
                30 === n && (await l(1e3));
            } else {
              const e = t
                .querySelector("td:nth-of-type(3)")
                .querySelector("div a");
              await s(e, c);
            }
          });
        })(t);
      },
      "/api/dmm/dmmInfo": function (t) {
        !(async function (t) {
          if (0 !== window.location.href.indexOf(`https://${e}/detail/`))
            return;
          let n = JSON.parse(t);
          if (!n || !("code" in n) || "0" != n.code) return !1;
          await l(1e3),
            document
              .querySelectorAll(".ant-image-img.\\!max-w-600")
              .forEach((e) => {
                e.classList.remove("!max-w-600");
              });
          const o =
            "picData" in n.data && n.data.picData
              ? n.data.picData.split(",")
              : [];
          let a = !1;
          function r(e) {
            return e.replace(
              /([^\/]+?)(-)(\d+\.\w+)$/,
              (e, t, n, o) => `${t}jp${n}${o}`
            );
          }
          o.forEach((e) => {
            const t = document.querySelector(`img[src="${e}"]`);
            if (t) {
              a || (t.closest(".grid").classList.remove("grid"), (a = !0)),
                (t.src = r(e)),
                t.parentElement.querySelector(".ant-image-mask").remove();
              t.closest(".ant-image").style.pointerEvents = "none";
            }
          });
        })(t);
      },
    },
    a = XMLHttpRequest.prototype.send,
    r = XMLHttpRequest.prototype.open;
  function i(e) {
    return new Promise((t, n) => {
      (e = e.replace("#", "")),
        GM_xmlhttpRequest({
          method: "GET",
          url:
            "https://translate.google.com/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&source=input&hl=zh-CN&sl=auto&tl=zh-CN&q=" +
            e,
          headers: { cookie: "" },
          onload: function (e) {
            for (
              var n = JSON.parse(e.responseText), o = "", a = 0;
              a < n.sentences.length;
              a++
            )
              o += n.sentences[a].trans;
            t(o);
          },
          onerror: function (e) {
            n();
          },
        });
    });
  }
  async function s(e, t) {
    const n = (function (e) {
        for (
          var t = [
              new RegExp("^([a-zA-Z]{2,11}-[0-9]{2,5}) {0,1}.*"),
              new RegExp("(259LUXU-[0-9]{3,4})", "i"),
              new RegExp("([0-9]{3}[a-zA-Z]{3,4}-[0-9]{3,4})"),
              new RegExp("([0-9]{5,6}[-_]{1}[0-9]{2,3})"),
              new RegExp("^(FC2-PPV-[0-9]{3,8})", "i"),
            ],
            n = 0;
          n < t.length;
          n++
        ) {
          var o = t[n].exec(e);
          if (null != o) return o[1].replace("_", "-").toUpperCase();
        }
        return null;
      })(e.innerText),
      o = t.closest("div");
    let a = !1;
    o.addEventListener("mouseenter", async (e) => {
      if ((e.stopPropagation(), a)) return;
      if (((a = !0), !n)) return;
      const o = await (async function (e) {
        const t = `https://fourhoi.com/${e.toLowerCase()}/preview.mp4`;
        return (await new Promise((e, n) => {
          GM_xmlhttpRequest({
            method: "GET",
            url: t,
            headers: { cookie: "" },
            onload: function (t) {
              if (t.status === 200) {
                e(true);
              } else {
                undefined;
                e(false);
              }
            },
            onerror: function (t) {
              undefined;
              e(false);
            },
          });
        }))
          ? '<video class="preview" muted loop autoplay="" width="100%" height="100%" src="' +
              t +
              '" id="av' +
              e.toUpperCase() +
              '"></video>'
          : null;
      })(n);
      if (!o) return;
      let r = document.querySelector("#prview-" + n.toUpperCase());
      r ||
        ((r = document.createElement("div")),
        (r.id = "prview-" + n.toUpperCase()),
        (r.style.position = "absolute"),
        (r.style.left = "50%"),
        (r.style.top = "50%"),
        (r.style.transform = "translate(-50%, -50%)"),
        (r.style.width = "100%"),
        t.parentNode.appendChild(r)),
        (r.innerHTML = o),
        (r.style.display = "block"),
        (t.style.visibility = "hidden"),
        r
          .querySelector("video")
          .play()
          .catch((e) => {});
    }),
      o.addEventListener("mouseleave", (e) => {
        if ((e.stopPropagation(), (a = !1), !n)) return;
        const o = document.querySelector("#prview-" + n.toUpperCase());
        o && ((o.style.display = "none"), (o.innerHTML = "")),
          (t.style.visibility = "visible");
      });
  }
  function l(e) {
    return new Promise((t) => setTimeout(t, e));
  }
  (XMLHttpRequest.prototype.open = function (e, t) {
    return (this.url = t), r.apply(this, arguments);
  }),
    (XMLHttpRequest.prototype.send = function () {
      return (
        this.addEventListener("load", function () {
          4 === this.readyState &&
            200 === this.status &&
            Object.keys(o).forEach((e) => {
              this.url.includes(e) && o[e](this.response);
            });
        }),
        a.apply(this, arguments)
      );
    });
})();
