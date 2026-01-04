// ==UserScript==
// @name         Multidrop menu
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  nab
// @author       ahhh
// @match        https://agma.io/
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agma.io
// @license MIT
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/498903/Multidrop%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/498903/Multidrop%20menu.meta.js
// ==/UserScript==

window.addEventListener("DOMContentLoaded", function () {

  window.addEventListener("keydown", function (l) {

    if (

      !0 === document.querySelector("#cMultiDrop").checked &&

      !$("input, textarea").is(":focus") &&

      "block" != $("#advert").css("display") &&

      "block" != $("#overlays").css("display")

    ) {

      if (l.repeat) return void l.preventDefault();

      switch (l.keyCode) {

        case k.mMultiPellets:

          e(u, 3);

          break;

        case k.mMultiMothercell:

          t(12, 5), sendPw(8);

          break;

        case k.mMultiVirus:

          sendPw(12),

            sendPw(8),

            setTimeout(() => {

              sendPw(4);

            }, 400);

          break;

        case k.mRecSpeed:

          e(9, 1), e(9, 2);

          break;

        case k.mShieldAntifreeze:

          t(14, 11);

          break;

        case k.mBreakShield:

          if (k.mBreakShield === "mothercell" || k.mBreakShield === "virus") {

            sendPw(6);

            sendPw(12);

            sendPw(8);

            if (k.brshieldpw === "mothercell") {

              sendPw(5);

            } else if (k.brshieldpw === "virus") {

              setTimeout(() => {

                sendPw(4);

              }, 400);

            }

          } else {

            p("Please choose either multi mothercell or virus before drop!");

          }

          break;

        case k.mRec:

          sendPw(1);

          break;

        case k.mSpeed:

          sendPw(2);

          break;

        case k.mGrowth:

          sendPw(3);

          break;

        case k.mVirus:

          sendPw(4);

          break;

        case k.mMothercell:

          sendPw(5);

          break;

        case k.mPortal:

          sendPw(6);

          break;

        case k.mBlock:

          sendPw(9);

          break;

        case k.mFreeze:

          sendPw(8);

          break;

        case k.mAntiFreeze:

          sendPw(11);

          break;

        case k.mAntiRec:

          sendPw(12);

          break;

        case k.mShield:

          sendPw(14);

      }

    }

  });

  const e = (e, t) => {

      for (let l = 0; l < e; l++) sendPw(t);

    },

    t = (e, t) => {

      sendPw(e), sendPw(t);

    };

  !(function (e, t) {

    const l = document.createElement("button");

    (l.id = "settingTab" + e),

      (l.className = "setting-tablink"),

      (l.style.width = "28%"),

      (l.textContent = t),

      (l.onclick = function () {

        !(function (e) {

          const t = document.querySelectorAll(".setting-tabcontent"),

            l = document.querySelectorAll(".setting-tablink");

          t.forEach((e) => {

            e.style.display = "none";

          }),

            l.forEach((e) => {

              e.classList.remove("active");

            });

          const n = document.querySelector("#settingPage" + e),

            i = document.querySelector("#settingTab" + e);

          n && i && ((n.style.display = "block"), i.classList.add("active"));

        })(e);

      }),

      document.querySelector(".setting-tabs").appendChild(l);

    const n = document.createElement("div");

    (n.id = "settingPage" + e),

      (n.className = "setting-tabcontent"),

      (n.style.display = "none"),

      document.querySelector("#setting").appendChild(n),

      document.querySelector("#settingTab4")

        ? (1,

          2)

        : 3,

      (n.innerHTML =

        '\n        <div class="row">\n<div class="col-md-10 col-md-offset-1 stng" style="padding:0px;">\n<div class="row hotkey-row">\n<div class="col-md-4 hotkey-col">\n<p class="hotkey-paragraph">Power</p>\nRec <div id="mRec" class="multi-input"></div><br>\nSpeed <div id="mSpeed" class="multi-input"></div><br>\nGrowth <div id="mGrowth" class="multi-input"></div><br>\nVirus <div id="mVirus" class="multi-input"></div><br>\nMothercell <div id="mMothercell" class="multi-input"></div><br>\nPortal <div id="mPortal" class="multi-input"></div><br>\nBlock <div id="mBlock" class="multi-input"></div><br>\nFreeze <div id="mFreeze" class="multi-input"></div><br>\nAnti Freeze <div id="mAntiFreeze" class="multi-input"></div><br>\nAnti Rec <div id="mAntiRec" class="multi-input"></div><br>\nShield <div id="mShield" class="multi-input"></div><br>\n</div>\n<div class="col-md-4 hotkey-col">\n<p class="hotkey-paragraph">Combo</p>\n9 Rec-Speed <div id="mRecSpeed" class="multi-input"></div><br>\nShield Antfreeze <div id="mShieldAntifreeze" class="multi-input"></div><br>\nMulti Pellets <div id="mMultiPellets" class="multi-input"></div><br>\nMul-virus <div id="mMultiVirus" class="multi-input"></div><br>\nMul-Mothercell <div id="mMultiMothercell" class="multi-input"></div><br>\nBr-shield <div id="mBreakShield" class="multi-input"></div><br>\n<input id="brMulVirus" name = "break" type="checkbox">\n<span id= "brshldvir">MulVirus</span>\n<input id="brMulMtcl" name = "break" type="checkbox">\n<span id= "brshldmtcl">MulMtcl</span>\n</div>\n<div class="row hotkey-row">\n<div class="col-md-4 hotkey-col">\n<p class="hotkey-paragraph">Multi Pellets Amount</p>\n<input id="customMultiPelletsAmount" type="range" min="1" max="30" step="1" value="15" style="display:inline-block; width:150px; height:8px; margin-top:15px; padding:0px; outline:none;">\n<span id="customMultiPelletsAmountValue" style="color:#df901c">15</span>\n</div>\n<div class="col-md-4 hotkey-col">\n<p class="hotkey-paragraph">MultiDrop ON/OFF</p>\n<input id="cMultiDrop" type="checkbox">\n<span id= "mulon">MultiDrop</span>\n</div>\n</div>\n<div class="row" style="padding:5px 10px; white-space:nowrap;">\n</div>\n\n</div>\n</div>\n    ');

  })(5, "Multi");

  const l = document.getElementsByClassName("multi-input");

  for (const e of l)

    (e.style.backgroundColor = "#df901c"),

      (e.style.color = "#fff"),

      (e.style.cursor = "pointer"),

      (e.style.textAlign = "center"),

      (e.style.minWidth = "40px"),

      (e.style.maxWidth = "60px"),

      (e.style.height = "18px"),

      (e.style.lineHeight = "18px"),

      (e.style.verticalAlign = "middle"),

      (e.style.borderRadius = "9px"),

      (e.style.right = "5px"),

      (e.style.position = "absolute"),

      (e.style.display = "inline-block"),

      (e.style.padding = "0 5px"),

      (e.style.overflow = "hidden"),

      (e.style.opacity = "1");

  const n = document

      .getElementById("settingPage5")

      .getElementsByClassName("multi-input"),

    i = "#df901c",

    s = "#fff";

  let o = null,

    r = null;

  const d = JSON.parse(localStorage.getItem("Multikey")) || {};

  for (const e of n) {

    let t = !1;

    e.addEventListener("click", function () {

      null !== o &&

        ((o.style.backgroundColor = i),

        (o.style.color = s),

        document.removeEventListener("keydown", r),

        (o = null),

        (r = null)),

        t

          ? ((e.style.backgroundColor = i), (e.style.color = s), (t = !1))

          : ((e.style.backgroundColor = "#ff4"),

            (e.style.color = "#444"),

            (t = !0),

            (o = e),

            (r = function (l) {

              l.stopPropagation(),

                l.preventDefault(),

                document.removeEventListener("keydown", r);

              const n = c(l.key);

              (e.innerHTML = n),

                p("Hotkey set", "green"),

                (d[e.id] = {

                  ...d[e.id],

                  key: l.key,

                  keyCode: l.keyCode,

                }),

                localStorage.setItem("Multikey", JSON.stringify(d)),

                (e.style.backgroundColor = i),

                (e.style.color = s),

                (t = !1),

                (o = null),

                (r = null);

            }),

            document.addEventListener("keydown", r));

    }),

      e.addEventListener("mouseenter", function () {

        t || (e.style.backgroundColor = "#ffc266");

      }),

      e.addEventListener("contextmenu", function (l) {

        l.preventDefault(),

          o === e &&

            (document.removeEventListener("keydown", r),

            (o = null),

            (r = null),

            (e.style.backgroundColor = i),

            (e.style.color = s),

            (e.innerHTML = ""),

            (t = !1)),

          delete d[e.id],

          "" !== e.innerHTML && p("Hotkey removed", "red"),

          localStorage.setItem("Multikey", JSON.stringify(d)),

          (e.innerHTML = "");

      }),

      e.addEventListener("mouseleave", function () {

        t || (e.style.backgroundColor = "#df901c");

      });

  }



  function c(e) {

    switch (e) {

      case "Control":

        return "CTRL";

      case "Insert":

        return "INS";

      case " ":

        return "SPACE";

      default:

        return e.toUpperCase();

    }

  }

  document.querySelector("#cMultiDrop").addEventListener("change", function () {

    this.checked ? p("Multi: ON", "green") : p("Multi: OFF", "red");

  });

  var u = 15;



  function a(e) {

    (document.querySelector("#customMultiPelletsAmountValue").innerHTML = e),

      (u = Number(e));

  }

  let m;



  function p(e, t, l) {

    "green" == t && (t = "rgb(0, 192, 0)"),

      "red" == t && (t = "rgb(255, 0, 0)"),

      "gray" == t && (t = "rgb(153, 153, 153)"),

      clearTimeout(m),

      $("#curser").text(e).show().css("color", t),

      0 !== l && (m = setTimeout(() => $("#curser").fadeOut(400), l ?? 4e3));

  }

  document

    .querySelector("#customMultiPelletsAmount")

    .addEventListener("input", function () {

      a(this.value),

        (d.multiple = {

          ...d.multiple,

          amount: u.toString(),

        }),

        localStorage.setItem("Multikey", JSON.stringify(d));

    });

  const y = JSON.parse(localStorage.getItem("Multikey")) || {},

    h = () => {

      const e = JSON.parse(localStorage.getItem("Multikey")) || {};

      return {

        mRec: e.mRec?.keyCode || "",

        mSpeed: e.mSpeed?.keyCode || "",

        mGrowth: e.mGrowth?.keyCode || "",

        mVirus: e.mVirus?.keyCode || "",

        mMothercell: e.mMothercell?.keyCode || "",

        mPortal: e.mPortal?.keyCode || "",

        mBlock: e.mBlock?.keyCode || "",

        mFreeze: e.mFreeze?.keyCode || "",

        mAntiFreeze: e.mAntiFreeze?.keyCode || "",

        mAntiRec: e.mAntiRec?.keyCode || "",

        mShield: e.mShield?.keyCode || "",

        mRecSpeed: e.mRecSpeed?.keyCode || "",

        mShieldAntifreeze: e.mShieldAntifreeze?.keyCode || "",

        mMultiPellets: e.mMultiPellets?.keyCode || "",

        mMultiVirus: e.mMultiVirus?.keyCode || "",

        mMultiMothercell: e.mMultiMothercell?.keyCode || "",

        mBreakShield: e.mBreakShield?.keyCode || "",

        brshieldpw: e.brshld?.power || "",

      };

    },

    k = h();

  setInterval(() => {

    const e = h();

    Object.assign(k, e), console.log(k.brshieldpw);

  }, 2e3);

  const b = document.getElementById("brMulVirus"),

    v = document.getElementById("brMulMtcl");

  b.addEventListener("change", () => {

    b.checked

      ? ((v.checked = !1),

        (d.brshld = {

          ...d.brshld,

          power: "virus",

        }),

        localStorage.setItem("Multikey", JSON.stringify(d)))

      : ((v.checked = !0),

        (d.brshld = {

          ...d.brshld,

          power: "mothercell",

        }),

        localStorage.setItem("Multikey", JSON.stringify(d)));

  }),

    v.addEventListener("change", () => {

      v.checked

        ? ((b.checked = !1),

          (d.brshld = {

            ...d.brshld,

            power: "mothercell",

          }),

          localStorage.setItem("Multikey", JSON.stringify(d)))

        : ((b.checked = !0),

          (d.brshld = {

            ...d.brshld,

            power: "virus",

          }),

          localStorage.setItem("Multikey", JSON.stringify(d)));

    }),

    window.addEventListener("load", () => {

      !(function () {

        const e = document

          .getElementById("settingPage5")

          .getElementsByClassName("multi-input");

        for (const t of e) {

          const e = t.id;

          if (y[e]) {

            const l = y[e].key;

            t.innerHTML = c(l);

          }

        }

        if (y.multiple && y.multiple.amount) {

          const e = parseInt(y.multiple.amount);

          a(e), (document.querySelector("#customMultiPelletsAmount").value = e);

        }

        y.brshld &&

          y.brshld.power &&

          ("virus" == y.brshld.power ? (b.checked = !0) : (v.checked = !0));

      })();

    });

});

let send, x, y;

(unsafeWindow.sendPw = (e) => {

  let t = new DataView(new ArrayBuffer(10));

  t.setUint8(0, 72),

    t.setInt32(1, x, !0),

    t.setInt32(5, y, !0),

    t.setUint8(9, e),

    send(t);

}),

  (WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {

    apply(e, t, n) {

      send = (...n) => e.call(t, ...n);

      let a = n[0];

      (a =

        a instanceof ArrayBuffer

          ? new DataView(a)

          : a instanceof DataView

          ? a

          : new DataView(a.buffer)),

        0 === a.getUint8(0, !0) &&

          9 === a.byteLength &&

          ([x, y] = [a.getInt32(1, !0), a.getInt32(5, !0)]),

        e.apply(t, n);

    },

  }));