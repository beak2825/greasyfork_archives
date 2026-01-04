// ==UserScript==
// @name         SMTH Script 
// @namespace    SMTH
// @version      3.1.10
// @description  Watch what you want through the API interface anytime, anywhere！
// @author       bingri[1523812] kaeru[1769499] htys[1545351] mirrorhye[2564936] tobytorn[1617955] Microdust[2587304]
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.staticfile.org/xlsx/0.17.5/xlsx.min.js
// @require      https://www.torn.com/js/script/lib/jquery-1.8.2.js
// @require      https://www.torn.com/js/script/lib/jquery.ui.widget.js
// @require      https://www.torn.com/js/script/lib/jquery.ui.selectmenu.js
// @require      https://www.torn.com/js/script/lib/jquery-ui-1.9.1.custom.min.js
// @downloadURL https://update.greasyfork.org/scripts/473424/SMTH%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/473424/SMTH%20Script.meta.js
// ==/UserScript==

function bingwaMain() {
  "use strict";
  if (!window.BINGWA) {
    (window.BINGWA = !0), console.log("Ice Frog Boot");
    const We = window.jQuery,
      Le = Object.freeze({ GM: "gm", PDA: "pda", OTHER: "other" });
    let i = Le.OTHER;
    try {
      GM_xmlhttpRequest, (i = Le.GM);
    } catch {
      try {
        PDA_httpGet, (i = Le.PDA);
      } catch {}
    }
    let p = !1;
    switch (i) {
      case Le.GM:
      case Le.OTHER:
        p = !0;
        break;
      case Le.PDA:
        try {
          PDA_evaluateJavascript, (p = !0);
        } catch {}
    }
    const Ge = [
      {
        name: "foo",
        title: "parade assistant",
        desc: "Display the military parade button on some pages to quickly obtain player information",
        default: !1,
      },
      {
        name: "noAssisting",
        title: "Anti heavy",
        desc: "Disable the JOIN button if someone else has already entered the battle",
        default: !1,
      },
      {
        name: "mugoo",
        title: "bandit helper",
        desc: "Display user status and attack links on the market list interface",
        default: !0,
      },
      {
        name: "chatTimestamp",
        title: "chat timestamp",
        desc: "Chat channels show when each content has been sent",
        default: !0,
      },
      {
        name: "chatQuickWithdraw",
        title: "Quickly withdraw money by chatting",
        desc: "Display quick cash withdrawal button in the chat channel",
        default: !1,
      },
      {
        name: "travelFilter",
        title: "Fly filter",
        desc: "Block unimportant items on the overseas market page",
        default: !0,
      },
      {
        name: "jailView",
        title: "prison assistant",
        desc: "Block targets with a score greater than 10,000 on the prison page, and the members of the gang will highlight them at the top",
        default: !0,
      },
      {
        name: "stockexchange_show_abbr",
        title: "stock assistant",
        desc: "Display initials before stock names on stock exchange market pages",
        default: !0,
      },
      {
        name: "gym_show_ratio",
        title: "gym assistant",
        desc: "Show recommended attribute ratio on gym page",
        default: !0,
      },
      {
        name: "common_modify_header_links",
        title: "Quick access at the top",
        desc: "Add links to some commonly used pages at the top of the page",
        default: !0,
      },
      {
        name: "hide_cloud_while_flying",
        title: "flying cloudless",
        desc: "Hide planes and clouds in the flight interface",
        default: !0,
      },
      {
        name: "withdrawal_helper",
        title: "money assistant",
        desc: "The chat people box in the lower right corner highlights the list of gangs that can withdraw money",
        default: !0,
      },
      {
        name: "bigger_screen_on_laptop",
        title: "laptop big screen",
        desc: "Full screen display when using a laptop in flight",
        default: !0,
      },
      {
        name: "taking_off_reminder",
        title: "take off medicine reminder",
        desc: "Remind meds and OC according to CD before take off",
        default: !0,
      },
      {
        name: "bounty_parade",
        title: "bounty parade",
        desc: "Newspaper - The reward page shows the target BS",
        default: !1,
      },
      {
        name: "nurse_suggestion",
        title: "nurse advice",
        desc: "Smart reminder to take medicine after leaving the hospital",
        default: !0,
      },
      {
        name: "extra_recent_attacks",
        title: "More recent attacks (gangs)",
        desc: "The gang chain page shows more attack records within 5 minutes (reducing missed revenge)",
        default: !1,
      },
    ];
    Ge.forEach((t) => {
      var e = le("BWM_SETTINGS", t.name);
      null == e && ce("BWM_SETTINGS", t.name, String(t.default)),
        (window[t.name] = "true" == le("BWM_SETTINGS", t.name));
    });
    let x = localStorage.getItem("APIKey");
    const qe = {
        20465: "SMTH - Main",
        36134: "SMTH - Silver Hand",
        10741: "SMTH - Trisolary",
        16335: "SMTH - November Chopin",
        16424: "SMTH - HoYoverse",
        9356: "SMTH - Party Animals",
        27902: "SMTH - Concord",
        11428: "Swiss Squad"
      },
      He = {
        8836: "Vinerri",
        2095: "Guerrilla Warfare",
        11356: "-UGK-",
        31312: "TORNado",
        8255: "Scream Silence",
        26312: "The Avengers",
        28205: "Invictus",
        10913: "Unbroken Warriors",
        8510: "Ara Pacis",
        5113: "ThugLife",
        13343: "The Defiant",
        39756: "Abusement Park",
        38761: "Shadow Healers",
        42125: "Octogenarian DirtyBombers",
        35739: "Kingsmen",
        14820: "Unbroken Legion",
        10140: "In Memory of the Fallen",
        9405: "Lake Of Lerna",
        30085: "Rampage Total Destruction",
      },
      Xe = {
        gray: "#adadad",
        red: "#ff7373",
        green: "#8fbc8f",
        blue: "#65a5d1",
        purple: "#8d6dd7",
        yellow: "#f39826",
        yellowgreen: "#83a000",
        pink: "#e467b3",
        salmon: "#F9CDAD",
        orange: "#FFDEAD",
      };
    if (
      (Kt(".bw-hidden { display: none !important }"),
      Kt(`.bw-no-select {
-webkit-user-select: none;
-khtml-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
-o-user-select: none;
user-select: none;
}`),
      (Date.prototype.format = function (t) {
        var e,
          a = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            S: this.getMilliseconds(),
          };
        for (e in (/(y+)/.test(t) &&
          (t = t.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          )),
        a))
          new RegExp("(" + e + ")").test(t) &&
            (t = t.replace(
              RegExp.$1,
              1 == RegExp.$1.length
                ? a[e]
                : ("00" + a[e]).substr(("" + a[e]).length)
            ));
        return t;
      }),
      De(),
      travelFilter && Ae(),
      common_modify_header_links && Fe(),
      Oe(),
      chatQuickWithdraw)
    ) {
      Ce();
      const Ue = window.location.href;
      if (0 <= Ue.indexOf("wdname") && 0 <= Ue.indexOf("wdmoney")) {
        let a = decodeURI(Ue.split("wdname=")[1].split("&")[0]),
          n = decodeURI(Ue.split("wdmoney=")[1]),
          t = new MutationObserver(function (t, e) {
            0 < We(".money-wrap").children(".give-block").length &&
              (Me(a, n), e.disconnect());
          });
        t.observe(document.getElementById("faction-controls"), {
          childList: !0,
          subtree: !0,
        });
      }
    }
    if (
      (Te(),
      withdrawal_helper && Pe(),
      hide_cloud_while_flying && Ee(),
      bigger_screen_on_laptop && Ne(),
      0 <= window.location.href.indexOf("loader.php?sid=racing") &&
        setInterval(function () {
          We(".bar-tpl-wrap:not([show-value])").each(function (t, e) {
            let a = 0,
              n = 0,
              i = 0;
            (i = We(e).hasClass("negative")
              ? ((a = parseFloat(
                  We(e).find(".progress-light-gray")[0].style.width
                )),
                (n = parseFloat(We(e).find(".progress-red")[0].style.width)),
                (a = parseFloat((a * n) / 100)),
                a - n)
              : We(e).hasClass("positive")
              ? ((n = parseFloat(
                  We(e).find(".progress-light-gray")[0].style.width
                )),
                (a = parseFloat(
                  We(e).find(".progress-light-green")[0].style.width
                )),
                (n = parseFloat((a * n) / 100)),
                a - n)
              : ((n = parseFloat(We(e).find(".progress-")[0].style.width)), 0)),
              We(e)
                .css("line-height", "17px")
                .css("margin-top", "0px")
                .css("width", "88px")
                .html(
                  "<span style='color: gray'>" +
                    n.toFixed(2) +
                    "</span>" +
                    (0 <= i ? " + " : " - ") +
                    Math.abs(i).toFixed(2)
                ),
              We(e).css("color", 0 <= i ? "green" : "red"),
              We(e).attr("show-value", "show-value");
          });
        }, 500),
      0 <= window.location.href.indexOf("shops.php?step=bitsnbobs") &&
        We(".buy-flexslider").find(":input").val("100"),
      0 <= window.location.href.indexOf("factions.php?step=your"))
    ) {
      function s(t) {
        return parseInt(
          We("ul.money-depositors")
            .children("li.depositor")
            .find("span[title='" + t + "']")
            .parent()
            .siblings("div.amount")
            .children()
            .children()
            .attr("data-value")
        );
      }
      function e() {
        var t = JSON.parse(We("#websocketConnectionData").text());
        return t.playername + " [" + t.userID + "]";
      }
      function a(e, a) {
        const n = s(a);
        if (void 0 === n || isNaN(n))
          e.text("").append(
            `<span>${a}</span><span class ='right'>error</span>`
          );
        else {
          let t = "$" + n;
          0 != n &&
            (t = n
              .toString()
              .replace(/\d{1,3}(?=(\d{3})+$)/g, function (t) {
                return t + ",";
              })
              .replace(/^[^\$]\S+/, function (t) {
                return "$" + t;
              })),
            t.includes("-")
              ? e
                  .text("")
                  .append(
                    `<span>${a}</span><span class ='t-red right'>${t}</span>`
                  )
              : e
                  .text("")
                  .append(`<span>${a}</span><span class ='right'>${t}</span>`);
        }
      }
      function n() {
        const t = We("div#money-user-cont").find("li.ui-custom-item");
        !We("input#money-user") ||
          ("." != We("input#money-user").val() &&
            " " != We("input#money-user").val()) ||
          (We("input#money-user").val(e()).addClass("chosen"),
          console.log(e()),
          a(t.children(), e())),
          0 < t.length &&
            !t.children().text().includes("$") &&
            !t.hasClass("empty") &&
            t.each(function () {
              var t = We(this).children().text();
              a(We(this).children(), t);
            });
      }
      function o() {
        const a = We(".money-wrap").children(".give-block"),
          i = "give-money",
          o = "array";
        function r() {
          We(".button-wrap").remove(), t();
        }
        function t() {
          const n = le(i, o);
          var t = (function () {
            let a = `<div class="button-wrap" style="margin:2px;">
<span id="deposit-self" class="border-round" style="display:inline-block; cursor:pointer; margin:2px; padding:3px; color:white; background-color:${Xe.purple};">给自己</span>`;
            return (
              n.forEach((t, e) => {
                a +=
                  ((t = t),
                  `<span id="deposit${e}" class="deposit-money-btn border-round" style="display:inline-block; cursor:pointer; margin:2px; padding:3px; color:white; background-color:${Xe.blue};">${t.button_name}</span>`);
              }),
              (a += `<span id="deposit-add" class="border-round" style="display:inline-block; cursor:pointer; margin:2px; padding:3px; color:white; background-color:${Xe.green};">+</span>
<span id="deposit-all" class="border-round" style="display:inline-block; cursor:pointer; margin:2px; padding:3px; color:white; background-color:${Xe.blue};">全取</span>
<span id="deposit-remove" class="border-round" style="display:inline-block; cursor:pointer; margin:2px; padding:3px; color:white; background-color:${Xe.red};">x</span>
</div>`),
              a
            );
          })();
          a.before(t),
            We("#deposit-add").click(() => {
              0 < We("#deposit-input").length ||
                (We("#deposit-add").html(
                  '<span style="display: inline-block;"><input id="deposit-input" type="text" class="border-round"></input>'
                ),
                We("#deposit-input").tornInputMoney({ groupMoneyClass: null }),
                We("#deposit-input").focus(),
                We("#deposit-input").blur(() => {
                  var t = We("#deposit-input").val();
                  let e = n;
                  e.push({
                    button_name: `Pick ${Zt(Yt("$" + t))}`,
                    "button-value": t,
                  }),
                    ce(i, o, e),
                    r();
                }));
            }),
            We("#deposit-remove").click(() => {
              We("#deposit-remove").hasClass("deposit-removing")
                ? (We(".deposit-money-btn").css("background-color", Xe.blue),
                  We(".deposit-money-btn").removeClass("deposit-removing"),
                  We("#deposit-remove").css("background-color", Xe.red),
                  We("#deposit-remove").removeClass("deposit-removing"))
                : (We(".deposit-money-btn").css("background-color", Xe.red),
                  We(".deposit-money-btn").addClass("deposit-removing"),
                  We("#deposit-remove").css("background-color", Xe.salmon),
                  We("#deposit-remove").addClass("deposit-removing"));
            }),
            We("#deposit-self").click(() => {
              We("input#money-user").val(e()).addClass("chosen");
            }),
            n.forEach((t, e) => {
              We(`#deposit${e}`).click(() => {
                if (We(`#deposit${e}`).hasClass("deposit-removing")) {
                  let t = n;
                  return t.splice(e, 1), ce(i, o, t), void r();
                }
                a
                  .children(".inputs-wrap")
                  .children(".input-money-group")
                  .addClass("success")
                  .children("input")
                  .attr("value", t["button-value"]),
                  a
                    .children(".inputs-wrap")
                    .children(".radio-wp")
                    .children(".btn-wrap")
                    .children(".btn")
                    .children()
                    .attr("disabled", !1)
                    .removeClass("disabled");
              });
            }),
            We("#deposit-all").click(() => {
              var e = We("#money-user").val();
              if ("" === e) alert("Please enter the player ID first");
              else {
                let t = s(e);
                void 0 === t ||
                  isNaN(t) ||
                  (t <= 0 && -1e9 < t
                    ? (t += 1e9)
                    : t <= -1e9 && -2e9 < t && (t += 2e9),
                  a
                    .children(".inputs-wrap")
                    .children(".input-money-group")
                    .addClass("success")
                    .children("input")
                    .attr("value", Vt(t)),
                  a
                    .children(".inputs-wrap")
                    .children(".radio-wp")
                    .children(".btn-wrap")
                    .children(".btn")
                    .children()
                    .attr("disabled", !1)
                    .removeClass("disabled"));
              }
            });
        }
        le(i, o) ||
          ce(i, o, [
            { button_name: "Take 1m", "button-value": "1,000,000" },
            { button_name: "Take 5m", "button-value": "5,000,000" },
            { button_name: "Take 10m", "button-value": "10,000,000" },
            { button_name: "Take 25m", "button-value": "25,000,000" },
          ]),
          We(".button-wrap").length < 1 && t();
      }
      function r() {
        const t = We(".money-wrap").children(".give-block");
        0 < t.length &&
          We(".rest-money-wrap").length < 1 &&
          t.after(`
<div class= "rest-money-wrap" style="width:290px; border:4px solid gray; padding:5px 2px; margin:0px 0px 5px 5px; background-image: linear-gradient(rgba(209,73,78,0.2),rgba(209,73,78,0.1));">
<div style="overflow:hidden; margin:7px; border:1px solid gray;">
<div id="username-title" style="width:87px; height:22px; float:left; color: var(--default-blue-color); background-color: var(--default-bg-panel-color); text-align:center;"><div style="padding: 3px 0px;">收款人</div></div>
<div id="username-value" style="width:187px; height:22px; float:left; color: var(--default-bg-panel-color); background-color: var(--default-blue-color); text-align:center;"></div>
</div>
<div style="overflow:hidden; margin:7px; border:1px solid gray;">
<div id="before-title" style="width:137px; height:22px; float:left; color: var(--default-green-color); background-color: var(--default-bg-panel-color); text-align:center;"><div style="padding: 3px 0px;">取款前余额</div></div>
<div id="before-value" style="width:137px; height:22px; float:left; color: var(--default-bg-panel-color); background-color: var(--default-green-color); text-align:center;"></div>
</div>
<div style="overflow:hidden; margin:7px; border:1px solid gray;">
<div id="after-title" style="width:137px; height:22px; float:left; color: var(--default-green-color); background-color: var(--default-bg-panel-color); text-align:center;"><div style="padding: 3px 0px;">取款后余额</div></div>
<div id="after-value" style="width:137px; height:22px; float:left; color: var(--default-bg-panel-color); background-color: var(--default-green-color); text-align:center;"><div style="padding: 3px 0px;"></div></div>
</div>
</div>`);
      }
      const Ke = setInterval(l, 1e3);
      function l() {
        var t;
        0 < We("#money-user").length &&
          0 <= We("#money-user").val().indexOf("]") &&
          0 < We("#before-value").length &&
          (We("#username-value").html(
            `<div style="padding: 3px 0px;">${We("#money-user").val()}</div>`
          ),
          0 <= (t = s(We("#money-user").val()))
            ? (We("#before-value")
                .css("background-color", "var(--default-green-color)")
                .html(`<div style="padding: 3px 0px;">${Yt(t)}</div>`),
              We("#before-title").css("color", "var(--default-green-color)"))
            : (We("#before-value")
                .css("background-color", "var(--default-red-color)")
                .html(`<div style="padding: 3px 0px;">${Yt(t)}</div>`),
              We("#before-title").css("color", "var(--default-red-color)")),
          0 <=
          (t =
            t - Vt(We(".money-wrap").find(".count.input-money").first().val()))
            ? (We("#after-value")
                .css("background-color", "var(--default-green-color)")
                .html(`<div style="padding: 3px 0px;">${Yt(t)}</div>`),
              We("#after-title").css("color", "var(--default-green-color)"))
            : (We("#after-value")
                .css("background-color", "var(--default-red-color)")
                .html(`<div style="padding: 3px 0px;">${Yt(t)}</div>`),
              We("#after-title").css("color", "var(--default-red-color)")));
      }
      function d() {
        We("div.input-money-group").attr(
          "class",
          "input-money-group no-max-value"
        );
        const t = We("ul.money-depositors").children("li.depositor");
        if (
          0 < We("div.give-block").length &&
          We("#faction_balance_li").length <= 0 &&
          0 < t.length
        ) {
          var e = Vt(
              We(".money-wrap")
                .children(".balance-message")
                .children(".sum-of-deposit")
                .text()
            ),
            i = Vt(
              We(".money-wrap")
                .children(".balance-message")
                .children(".faction-balance")
                .text()
            );
          let a = 0,
            n = 0;
          t.each((t, e) => {
            e = parseInt(We(e).find("span.money").attr("data-value"));
            0 < e ? (a += e) : (n += e);
          });
          var o = parseInt(i) + parseInt(e),
            r = Math.max(
              Math.abs(e),
              Math.abs(i),
              Math.abs(a),
              Math.abs(n),
              Math.abs(o)
            );
          We("#money").children(".balance-message").after(`
<div id="faction_balance_li" style="width:290px; border:4px solid gray; padding:5px 2px; margin:0px 0px 5px 5px; background-image: linear-gradient(rgba(209,73,78,0.2),rgba(209,73,78,0.1));"></div>
`),
            c("gang balance", o, r),
            c("sum of all deposits", e, r),
            c("gang public money", i, r),
            c("sum of positive deposits", a, r),
            c("sum of negative deposits", n, r),
            c("reserve ratio", parseFloat(o / a), r);
        }
      }
      function c(e, a, n) {
        let i = Yt(a);
        if (0 <= a) {
          let t = (100 * a) / n;
          "reserve ratio" == e &&
            ((t = Math.min(100 * a, 100)), (i = (100 * a).toFixed(2) + "%")),
            We("#faction_balance_li").append(`
<div style="overflow:hidden; margin:7px; border:1px solid gray;">
<div style="width:137px; height:22px; float:left; text-align:center; overflow:hidden;">${fe(
              22,
              0,
              "var(--default-green-color)",
              "var(--default-bg-panel-color)",
              e
            )}</div>
<div style="width:137px; height:22px; float:left; text-align:center; overflow:hidden;">${fe(
              22,
              t,
              "var(--default-green-color)",
              "var(--default-bg-panel-color)",
              i
            )}</div>
</div>`);
        } else {
          n = (100 * a) / n + 100;
          We("#faction_balance_li").append(`
<div style="overflow:hidden; margin:7px; border:1px solid gray;">
<div style="width:137px; height:22px; float:left; text-align:center; overflow:hidden;">${fe(
            22,
            n,
            "var(--default-bg-panel-color)",
            "var(--default-red-color)",
            e
          )}</div>
<div style="width:137px; height:22px; float:left; text-align:center; overflow:hidden;">${fe(
            22,
            0,
            "var(--default-red-color)",
            "var(--default-bg-panel-color)",
            i
          )}</div>
</div>`);
        }
      }
      let t = new MutationObserver(function (t, e) {
        console.log("changed"), n(), o(), d(), r();
      });
      t.observe(document.getElementById("faction-controls"), {
        childList: !0,
        subtree: !0,
      });
    }
    if (jailView && 0 <= window.location.href.indexOf("jailview.php")) {
      const Ve = "3.0.5",
        Ye = "bingwa_bust",
        Qe = 60;
      class t {
        constructor(t) {
          this.refresh_callback = t;
          t = se(Ye);
          t && t.version === Ve
            ? ((this.info = t.info), (this.conf = t.conf))
            : ((this.info = { timestamp: 0 }),
              (this.conf = {
                hidden: !1,
                prob_min: null,
                prob_max: null,
                order: "ASC",
                friend: "PIN",
                quick_bust: "ON",
              })),
            this.refreshInfo();
        }
        getBustSkill() {
          return (
            this.info.level *
            (1 + this.info.faction_perk / 100) *
            (1 + this.info.edu_perk / 100)
          );
        }
        getBustProb(t) {
          let e = this.info.penalty;
          return (
            this.info.job_perk && (e /= 2),
            276.536 - (0.73643 * t + 5309.59 * e) / this.getBustSkill()
          );
        }
        save() {
          de(Ye, { info: this.info, conf: this.conf, version: Ve });
        }
        refreshInfo() {
          var t = Math.floor(new Date().getTime() / 1e3),
            e = this.info.error ? 5 : Qe;
          t - this.info.timestamp < e ||
            ((this.info = { timestamp: t, error: "loading" }),
            this.save(),
            new Promise(async () => {
              await this.fetchInfo(),
                this.save(),
                this.refresh_callback && this.refresh_callback();
            }));
        }
        increasePenalty() {
          "penalty" in this.info && ((this.info.penalty += 1), this.save());
        }
        async fetchInfo() {
          var t = Math.floor(new Date().getTime() / 1e3),
            e = `https://api.torn.com/user/?selections=basic,perks,log&log=5360&to=${
              t + 10
            }&key=${x}`;
          const a = await fetch(e);
          if (a.ok) {
            const n = await a.json();
            if ("error" in n)
              this.info = { timestamp: t, error: n.error.error };
            else {
              (this.info = { timestamp: t }), (this.info.level = n.level);
              const i = n.faction_perks.find((t) =>
                t.match(/bust success chance/i)
              );
              (this.info.faction_perk = i ? parseInt(i.match(/\d+/)[0]) : 0),
                (this.info.job_perk =
                  0 <=
                  n.job_perks.indexOf("+ Easier to bust more people at once"));
              const o = n.education_perks.find((t) =>
                t.match(/Busting skill/i)
              );
              (this.info.edu_perk = o ? parseInt(o.match(/\d+/)[0]) : 0),
                (this.info.penalty = 0);
              for (const r of Object.values(n.log))
                t - r.timestamp <= 259200 &&
                  (this.info.penalty += 1 / (1 + (t - r.timestamp) / 36e3));
            }
          } else this.info = { timestamp: t, error: a.statusText };
        }
      }
      const Ze = new t(m),
        ta = new MutationObserver(async function (t) {
          let e = !1;
          for (const a of t)
            for (const n of a.addedNodes)
              "LI" === n.tagName
                ? (e = u(n) || e)
                : We(n)
                    .text()
                    .match(/You busted .* out of jail/i) &&
                  ((e = !0), Ze.increasePenalty());
          e && m();
        });
      function h(t) {
        const e = t.find("a.faction").attr("href");
        return e ? e.substring(30) : 0;
      }
      function g(t) {
        t = t.find("span.level").text().match(/\d+/g);
        return t ? parseInt(t[0]) : 0;
      }
      function f(t) {
        (t = t.find("span.time").text().match(/\d+/g)), (t = t || [0]);
        return t[1] ? 60 * parseInt(t[0]) + parseInt(t[1]) : parseInt(t[0]);
      }
      function u(t) {
        if (We(t).find("b.bust-score").attr("bust-score")) return !1;
        var e = (f(We(t)) + 180) * g(We(t));
        if (0 == e) return !1;
        e = `<b class="bust-score t-red" style="margin-left: 0em" bust-score=${e}></b>`;
        return (
          We(t).find("span.reason").append(e), We(t).removeClass("gray"), !0
        );
      }
      function b() {
        const t = We("ul.user-info-list-wrap").children("li");
        t.each(function () {
          if (0 !== We(this).find("b.bust-score").length) {
            var e = parseFloat(We(this).find("b.bust-score").attr("bust-prob"));
            let t = !1;
            isNaN(e) ||
              (null !== Ze.conf.prob_min && e < Ze.conf.prob_min && (t = !0),
              null !== Ze.conf.prob_max && e > Ze.conf.prob_max && (t = !0));
            e = h(We(this)) in qe;
            "PIN" === Ze.conf.friend && e && (t = !1),
              t
                ? We(this).addClass("bw-hidden")
                : We(this).removeClass("bw-hidden"),
              Ze.conf.friend && e
                ? We(this).css("background-color", "rgba(110, 160, 55, 0.15)")
                : We(this).css("background-color", "");
            const a = We(this).children("a.bust");
            "ON" === Ze.conf.quick_bust
              ? a.attr(
                  "href",
                  a.attr("href").replace(/\bbreakout\b/, "breakout1")
                )
              : a.attr(
                  "href",
                  a.attr("href").replace(/\bbreakout1\b/, "breakout")
                );
          }
        }),
          Ze.conf.order &&
            (t.sort(function (t, e) {
              var a = parseInt(We(t).find("b.bust-score").attr("bust-score")),
                n = parseInt(We(e).find("b.bust-score").attr("bust-score")),
                t = h(We(t)) in qe,
                e = h(We(e)) in qe;
              return "PIN" === Ze.conf.friend && t != e
                ? Number(e) - Number(t)
                : "ASC" === Ze.conf.order
                ? a - n
                : n - a;
            }),
            t.detach().appendTo("ul.user-info-list-wrap"));
      }
      function m() {
        const n = Ze.info,
          t = We(".info-msg-cont").first();
        var e;
        t.css("background", "var(--default-bg-panel-color)"),
          t.css("font-size", "12px"),
          t.html(`
<div id="bust-info" style="display: flex; flex-wrap: wrap; gap: 10px 20px; padding: 10px;"></div>
<div id="bust-conf" class="small-select-menu-wrap">
<hr />
<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px 20px; padding: 10px;">
<label style="width: 10em; display: flex; gap: 4px">
<b style="margin: auto 0">Min Success Rate</b>
<input id="bust-conf-prob-min" type="text" inputmode="numeric" maxlength="3" placeholder="-"
style="width: 3em; flex-grow: 1; border: 1px solid #ccc; border-radius: 4px; padding: 2px; text-align: center;">
</label>
<label style="width: 10em; display: flex; gap: 4px">
<b style="margin: auto 0">highest success rate</b>
<input id="bust-conf-prob-max" type="text" inputmode="numeric" maxlength="3" placeholder="-"
style="width: 3em; flex-grow: 1; border: 1px solid #ccc; border-radius: 4px; padding: 2px; text-align: center;">
</label>
<label style="width: 10em; display: flex; gap: 4px">
<b style="margin: auto 0">to sort</b>
<div class="select-wrap dropdown-new dropdown-default" style="flex-grow: 1">
<select id="bust-conf-order">
<option value="ASC">from easy to difficult</option>
<option value="DESC">from difficult to easy</option>
<option value="">system order</option>
</select>
<div id="bust-conf-order-list" class="select-list dropdown-content"></div>
</div>
</label>
<label style="width: 10em; display: flex; gap: 4px">
<b style="margin: auto 0">Allies</b>
<div class="select-wrap dropdown-new dropdown-default" style="flex-grow: 1">
<select id="bust-conf-friend">
<option value="PIN">Highlight top</option>
<option value="HIGHLIGHT">highlight</option>
<option value="">not highlighted</option>
</select>
<div id="bust-conf-friend-list" class="select-list dropdown-content"></div>
</div>
</label>
<label style="width: 10em; display: flex; gap: 4px">
<b style="margin: auto 0">Fast Bust</b>
<div class="select-wrap dropdown-new dropdown-default" style="flex-grow: 1">
<select id="bust-conf-quick-bust">
<option value="ON">turn on</option>
<option value="">closure</option>
</select>
<div id="bust-conf-quick-bust-list" class="select-list dropdown-content"></div>
</div>
</label>
</div>
</div>
`),
          null !== Ze.conf.prob_min &&
            We("#bust-conf-prob-min").val(Ze.conf.prob_min),
          null !== Ze.conf.prob_max &&
            We("#bust-conf-prob-max").val(Ze.conf.prob_max),
          We("#bust-conf-order").val(Ze.conf.order),
          We("#bust-conf-friend").val(Ze.conf.friend),
          We("#bust-conf-quick-bust").val(Ze.conf.quick_bust),
          ue(We("#bust-conf-prob-min"), (t) => /^\d*$/.test(t)),
          ue(We("#bust-conf-prob-max"), (t) => /^\d*$/.test(t)),
          We("#bust-conf select").each(function () {
            We(this).selectmenu({
              appendTo: `#${We(this).attr("id")}-list`,
              open: function () {
                We(this).closest(".select-wrap").addClass("s-open");
              },
              close: function () {
                We(this).closest(".select-wrap").removeClass("s-open");
              },
            });
          }),
          We("#bust-conf input").change(v),
          We("#bust-conf select").change(v),
          "loading" === n.error
            ? We("#bust-info").html(
                "<span>Please wait while the Bust history is read. If there is no result within 5 seconds, please refresh the page and try again. </span>"
              )
            : "Access level of this key is not high enough" === n.error
            ? We("#bust-info").html(`
<span class="t-red">权限不足，无法读取 Bust Punishment！</span>
<a href="/preferences.php#tab=api">Please use an API Key of type Full Access</a>
`)
            : n.error
            ? We("#bust-info").html(
                `<span class="t-red">something went wrong！${n.error}</span>`
              )
            : ((e = n.job_perk ? "Punishment effect is halved" : "none"),
              We("#bust-info").html(`
<span style="width: 10em"><b>Bust Punishment</b>: ${n.penalty.toFixed(2)}</span>
<span style="width: 10em" title><b>Bust skills</b>: ${Ze.getBustSkill().toFixed(
                2
              )}</span>
<span style="width: 10em"><b>Work Stunt</b>: ${e}</span>
`),
              We("#bust-info").tooltip({
                tooltipClass: "white-tooltip",
                content: function () {
                  var t =
                      50 === n.faction_perk
                        ? "50%"
                        : `<span class="t-red">${n.faction_perk}%</span>`,
                    e =
                      65 === n.edu_perk
                        ? "65%"
                        : `<span class="t-red">${n.edu_perk}%</span>`;
                  return `personal level: ${n.level}<br>gang bonus: ${t}<br>Education bonus: ${e}`;
                },
              })),
          We("#bust-info").append(
            '<a id="bust-info-toggle-conf" style="margin-left: auto" href="javascript: void">display options</a>'
          ),
          y(Ze.conf.hidden),
          We("#bust-info-toggle-conf").click(function () {
            (Ze.conf.hidden = !Ze.conf.hidden), Ze.save(), y(Ze.conf.hidden);
          }),
          We("b.bust-score").each(function () {
            var e = We(this).attr("bust-score");
            if (e) {
              let t = "t-red";
              if (n.error)
                We(this).text(` ${e}`), We(this).removeAttr("bust-prob");
              else {
                const a = Ze.getBustProb(e);
                (t =
                  120 <= a
                    ? "t-gray-9"
                    : 100 <= a
                    ? "t-green"
                    : 80 <= a
                    ? "t-yellow"
                    : 0 <= a
                    ? "t-red"
                    : "t-red bg-red active"),
                  We(this).html(` ${e}&nbsp;&nbsp;${a.toFixed(1)}%`),
                  We(this).attr("bust-prob", a.toFixed(1));
              }
              We(this).attr("class", `bust-score ${t}`);
            }
          }),
          b();
      }
      function y(t) {
        t
          ? (We("#bust-info-toggle-conf").text("display options"),
            We("#bust-conf").hide())
          : (We("#bust-info-toggle-conf").text("hide option"),
            We("#bust-conf").show());
      }
      function v() {
        var t = We("#bust-conf-prob-min").val();
        Ze.conf.prob_min = t ? parseInt(t) : null;
        t = We("#bust-conf-prob-max").val();
        (Ze.conf.prob_max = t ? parseInt(t) : null),
          (Ze.conf.order = We("#bust-conf-order").val()),
          (Ze.conf.friend = We("#bust-conf-friend").val()),
          (Ze.conf.quick_bust = We("#bust-conf-quick-bust").val()),
          Ze.save(),
          b();
      }
      ta.observe(document.getElementsByClassName("userlist-wrapper")[0], {
        childList: !0,
        characterData: !0,
        subtree: !0,
      });
    }
    if (gym_show_ratio && 0 <= window.location.href.indexOf("gym.php")) {
      const ea = {
          0: {
            name: "balanced",
            description: "Balance Ratio",
            str: 100,
            def: 100,
            spd: 100,
            dex: 100,
          },
          1: {
            name: "hank-str",
            description: "Hank Scale - Str Highest",
            str: 100,
            def: 80,
            spd: 28,
            dex: 80,
          },
          2: {
            name: "hank-def",
            description: "Hank Scale - Def Highest",
            str: 80,
            def: 100,
            spd: 80,
            dex: 28,
          },
          3: {
            name: "hank-spd",
            description: "Hank Scale - Highest Spd",
            str: 28,
            def: 80,
            spd: 100,
            dex: 80,
          },
          4: {
            name: "hank-dex",
            description: "Hank Ratio - Dex Highest",
            str: 80,
            def: 28,
            spd: 80,
            dex: 100,
          },
          5: {
            name: "baldr-str",
            description: "Baldr Scale - Str Highest",
            str: 100,
            def: 72,
            spd: 80,
            dex: 72,
          },
          6: {
            name: "baldr-def",
            description: "Baldr Scale - Def Highest",
            str: 72,
            def: 100,
            spd: 72,
            dex: 80,
          },
          7: {
            name: "baldr-spd",
            description: "Baldr Scale - Spd Highest",
            str: 80,
            def: 72,
            spd: 100,
            dex: 72,
          },
          8: {
            name: "baldr-dex",
            description: "Baldr Scale - Dex Highest",
            str: 72,
            def: 80,
            spd: 72,
            dex: 100,
          },
        },
        aa = {
          1: {
            name: "Premier Fitness",
            stage: 1,
            cost: 10,
            energy: 5,
            strength: 20,
            speed: 20,
            defense: 20,
            dexterity: 20,
            note: "",
          },
          2: {
            name: "Average Joes",
            stage: 1,
            cost: 100,
            energy: 5,
            strength: 24,
            speed: 24,
            defense: 27,
            dexterity: 24,
            note: "",
          },
          3: {
            name: "Woody's Workout Club",
            stage: 1,
            cost: 250,
            energy: 5,
            strength: 27,
            speed: 32,
            defense: 30,
            dexterity: 27,
            note: "",
          },
          4: {
            name: "Beach Bods",
            stage: 1,
            cost: 500,
            energy: 5,
            strength: 32,
            speed: 32,
            defense: 32,
            dexterity: 0,
            note: "",
          },
          5: {
            name: "Silver Gym",
            stage: 1,
            cost: 1e3,
            energy: 5,
            strength: 34,
            speed: 36,
            defense: 34,
            dexterity: 32,
            note: "",
          },
          6: {
            name: "Pour Femme",
            stage: 1,
            cost: 2500,
            energy: 5,
            strength: 34,
            speed: 36,
            defense: 36,
            dexterity: 38,
            note: "",
          },
          7: {
            name: "Davies Den",
            stage: 1,
            cost: 5e3,
            energy: 5,
            strength: 37,
            speed: 0,
            defense: 37,
            dexterity: 37,
            note: "",
          },
          8: {
            name: "Global Gym",
            stage: 1,
            cost: 1e4,
            energy: 5,
            strength: 40,
            speed: 40,
            defense: 40,
            dexterity: 40,
            note: "",
          },
          9: {
            name: "Knuckle Heads",
            stage: 2,
            cost: 5e4,
            energy: 10,
            strength: 48,
            speed: 44,
            defense: 40,
            dexterity: 42,
            note: "",
          },
          10: {
            name: "Pioneer Fitness",
            stage: 2,
            cost: 1e5,
            energy: 10,
            strength: 44,
            speed: 46,
            defense: 48,
            dexterity: 44,
            note: "",
          },
          11: {
            name: "Anabolic Anomalies",
            stage: 2,
            cost: 25e4,
            energy: 10,
            strength: 50,
            speed: 46,
            defense: 52,
            dexterity: 46,
            note: "",
          },
          12: {
            name: "Core",
            stage: 2,
            cost: 5e5,
            energy: 10,
            strength: 50,
            speed: 52,
            defense: 50,
            dexterity: 50,
            note: "",
          },
          13: {
            name: "Racing Fitness",
            stage: 2,
            cost: 1e6,
            energy: 10,
            strength: 50,
            speed: 54,
            defense: 48,
            dexterity: 52,
            note: "",
          },
          14: {
            name: "Complete Cardio",
            stage: 2,
            cost: 2e6,
            energy: 10,
            strength: 55,
            speed: 57,
            defense: 55,
            dexterity: 52,
            note: "",
          },
          15: {
            name: "Legs, Bums and Tums",
            stage: 2,
            cost: 3e6,
            energy: 10,
            strength: 0,
            speed: 55,
            defense: 55,
            dexterity: 57,
            note: "",
          },
          16: {
            name: "Deep Burn",
            stage: 2,
            cost: 5e6,
            energy: 10,
            strength: 60,
            speed: 60,
            defense: 60,
            dexterity: 60,
            note: "",
          },
          17: {
            name: "Apollo Gym",
            stage: 3,
            cost: 75e5,
            energy: 10,
            strength: 60,
            speed: 62,
            defense: 64,
            dexterity: 62,
            note: "",
          },
          18: {
            name: "Gun Shop",
            stage: 3,
            cost: 1e7,
            energy: 10,
            strength: 65,
            speed: 64,
            defense: 62,
            dexterity: 62,
            note: "",
          },
          19: {
            name: "Force Training",
            stage: 3,
            cost: 15e6,
            energy: 10,
            strength: 64,
            speed: 65,
            defense: 64,
            dexterity: 68,
            note: "",
          },
          20: {
            name: "Cha Cha's",
            stage: 3,
            cost: 2e7,
            energy: 10,
            strength: 64,
            speed: 64,
            defense: 68,
            dexterity: 70,
            note: "",
          },
          21: {
            name: "Atlas",
            stage: 3,
            cost: 3e7,
            energy: 10,
            strength: 70,
            speed: 64,
            defense: 64,
            dexterity: 65,
            note: "",
          },
          22: {
            name: "Last Round",
            stage: 3,
            cost: 5e7,
            energy: 10,
            strength: 68,
            speed: 65,
            defense: 70,
            dexterity: 65,
            note: "",
          },
          23: {
            name: "The Edge",
            stage: 3,
            cost: 75e6,
            energy: 10,
            strength: 68,
            speed: 70,
            defense: 70,
            dexterity: 68,
            note: "",
          },
          24: {
            name: "George's",
            stage: 3,
            cost: 1e8,
            energy: 10,
            strength: 73,
            speed: 73,
            defense: 73,
            dexterity: 73,
            note: "",
          },
          25: {
            name: "Balboas Gym",
            stage: 4,
            cost: 5e7,
            energy: 25,
            strength: 0,
            speed: 0,
            defense: 75,
            dexterity: 75,
            note: "Requirements must be maintained to preserve access to this gym",
          },
          26: {
            name: "Frontline Fitness",
            stage: 4,
            cost: 5e7,
            energy: 25,
            strength: 75,
            speed: 75,
            defense: 0,
            dexterity: 0,
            note: "Requirements must be maintained to preserve access to this gym",
          },
          27: {
            name: "Gym 3000",
            stage: 4,
            cost: 1e8,
            energy: 50,
            strength: 80,
            speed: 0,
            defense: 0,
            dexterity: 0,
            note: "Requirements must be maintained to preserve access to this gym",
          },
          28: {
            name: "Mr. Isoyamas",
            stage: 4,
            cost: 1e8,
            energy: 50,
            strength: 0,
            speed: 0,
            defense: 80,
            dexterity: 0,
            note: "Requirements must be maintained to preserve access to this gym",
          },
          29: {
            name: "Total Rebound",
            stage: 4,
            cost: 1e8,
            energy: 50,
            strength: 0,
            speed: 80,
            defense: 0,
            dexterity: 0,
            note: "Requirements must be maintained to preserve access to this gym",
          },
          30: {
            name: "Elites",
            stage: 4,
            cost: 1e8,
            energy: 50,
            strength: 0,
            speed: 0,
            defense: 0,
            dexterity: 80,
            note: "Requirements must be maintained to preserve access to this gym",
          },
          31: {
            name: "The Sports Science Lab",
            stage: 4,
            cost: 5e8,
            energy: 25,
            strength: 90,
            speed: 90,
            defense: 90,
            dexterity: 90,
            note: "The use of drugs may result in the loss of membership without refunds",
          },
          32: {
            name: "Unknown",
            stage: 4,
            cost: 2147483647,
            energy: 10,
            strength: 100,
            speed: 100,
            defense: 100,
            dexterity: 100,
            note: "Membership by invite only",
          },
          33: {
            name: "The Jail Gym",
            stage: 0,
            cost: 0,
            energy: 5,
            strength: 34,
            speed: 34,
            defense: 46,
            dexterity: 0,
            note: "",
          },
        };
      for (var t in (We("#gymroot").children().append(`
<div>
<div class="title-black m-top10 title-toggle tablet top-round faction-title active title" data-title="description" role="heading" aria-level="5">
Recommended exercise ratio
</div>
<div class="cont-gray bottom-rounded content" style="overflow:hidden; margin-bottom:10px;">
<div class="select-wrap" style="margin:5px; float:left">
<select id="gym-ratio" style="height:24px">
</select>
</div>
<div class="select-wrap" style="margin:5px 1px; float:left">
<p id="gym-ratio-info" style="height:12px; padding:6px 1px;">
</p>
</div>
</div>
<div class="title-black m-top10 title-toggle tablet top-round faction-title active title" data-title="description" role="heading" aria-level="5">According to the current gym effect, how much is more than 25E per shot? You can give up GYM and eat SE
</div>
<div class="cont-gray bottom-rounded content" style="margin-bottom:10px;padding:4px;">
<table id="se-table" style="">
<tr><td>Strength</td><td class="value">$0</td></tr>
<tr><td>Defense</td><td class="value">$0</td></tr>
<tr><td>Speed</td><td class="value">$0</td></tr>
<tr><td>Dexterity</td><td class="value">$0</td></tr>
</table>
</div>
</div>`),
      We("#se-table")
        .find("td")
        .attr(
          "style",
          "font-size: 18px; border: 4px solid darkgray; padding:6px; text-align:center;"
        ),
      ea))
        We("#gym-ratio").append(
          `<option value="${t}">${ea[t].description}</option>`
        );
      function w(t, e, a, n) {
        const i = We("[class^='gymContent___']")
          .children("[class^='properties___']")
          .children("li");
        var o = We("#strength-val").text().split(",").join(""),
          r = We("#defense-val").text().split(",").join(""),
          s = We("#speed-val").text().split(",").join(""),
          l = We("#dexterity-val").text().split(",").join(""),
          d = Math.max(o / t, r / e, s / a, l / n),
          t = Math.abs(d * t - o) <= 1 ? o : parseInt(d * t),
          e = Math.abs(d * e - r) <= 1 ? r : parseInt(d * e),
          a = Math.abs(d * a - s) <= 1 ? s : parseInt(d * a),
          n = Math.abs(d * n - l) <= 1 ? l : parseInt(d * n);
        const c = [t, e, a, n],
          p = [t - o, e - r, a - s, n - l];
        let h = 0;
        We(".gym-goal").remove(),
          i.each(function () {
            const t = We(this)
              .children("[class^='propertyContent___']")
              .children("[class^=description___]")
              .children("p:first");
            0 == t.children(".gym-perks").length
              ? t.html(
                  `<span class="t-red gym-goal" title="目标:${Vt(
                    c[h]
                  )}">still worse:${Qt(p[h])} </span>`
                )
              : t.prepend(
                  `<span class="t-red gym-goal" title="目标:${Vt(
                    c[h]
                  )}">still worse:${Qt(p[h])} </span>`
                ),
              h++;
          });
      }
      function _() {
        return new Promise((d, a) => {
          var t = `https://api.torn.com/user/?selections=perks&key=${x}`;
          fetch(t)
            .then(
              (t) => (t.ok ? t.json() : void console.log("---Probe failed---")),
              (t) => {
                console.log("---network anomaly---");
              }
            )
            .then((t) => {
              if (null != t)
                if ("error" in t) a(t.error);
                else {
                  let a = [{}, {}, {}, {}];
                  for (var e in t) {
                    const l = t[e];
                    var n,
                      i,
                      o,
                      r = e.split("_")[0];
                    for (let t = 0; t < l.length; t++)
                      0 <= l[t].search(/strength gym gains/i)
                        ? ((n = parseInt(
                            /\d+%/.exec(l[t])[0].replace("%", "")
                          )),
                          (a[0][r] = a[0].hasOwnProperty(r) ? a[0][r] + n : n))
                        : 0 <= l[t].search(/defense gym gains/i)
                        ? ((i = parseInt(
                            /\d+%/.exec(l[t])[0].replace("%", "")
                          )),
                          (a[1][r] = a[1].hasOwnProperty(r) ? a[1][r] + i : i))
                        : 0 <= l[t].search(/speed gym gains/i)
                        ? ((i = parseInt(
                            /\d+%/.exec(l[t])[0].replace("%", "")
                          )),
                          (a[2][r] = a[2].hasOwnProperty(r) ? a[2][r] + i : i))
                        : 0 <= l[t].search(/dexterity gym gains/i)
                        ? ((o = parseInt(
                            /\d+%/.exec(l[t])[0].replace("%", "")
                          )),
                          (a[3][r] = a[3].hasOwnProperty(r) ? a[3][r] + o : o))
                        : 0 <= l[t].search(/gym gains/i) &&
                          ((o = parseInt(
                            /\d+%/.exec(l[t])[0].replace("%", "")
                          )),
                          (a[0][r] = a[0].hasOwnProperty(r) ? a[0][r] + o : o),
                          (a[1][r] = a[1].hasOwnProperty(r) ? a[1][r] + o : o),
                          (a[2][r] = a[2].hasOwnProperty(r) ? a[2][r] + o : o),
                          (a[3][r] = a[3].hasOwnProperty(r) ? a[3][r] + o : o));
                  }
                  for (let e = 0; e < a.length; e++) {
                    let t = 1;
                    for (var s in a[e]) t *= (a[e][s] + 100) / 100;
                    a[e].total = t;
                  }
                  d(a), console.log("perks API fetched");
                }
              else a();
            })
            .catch((t) => a(t));
        });
      }
      const na = setInterval(k, 2e3);
      function k() {
        const e = We("[class^='gymContent___']")
          .children("[class^='properties___']")
          .children("li");
        "1" == e.first().attr("hasdone") ||
          (0 < e.length &&
            (e.first().attr("hasdone", "1"),
            _()
              .then(function (i) {
                console.log(i);
                var t = aa[$()];
                const o = [
                  (t.strength / 10).toFixed(1),
                  (t.defense / 10).toFixed(1),
                  (t.speed / 10).toFixed(1),
                  (t.dexterity / 10).toFixed(1),
                ];
                console.log(o);
                let r = 0;
                e.each(function () {
                  var t,
                    e = (100 * (i[r].total - 1)).toFixed(2),
                    a = (i[r].total * o[r]).toFixed(3);
                  let n = "<strong>gym factor:</strong> +" + o[r];
                  for (t in ((n +=
                    "<br><strong>The total bonus outside the coefficient:</strong> +" + e + "%"),
                  i[r]))
                    "total" != t &&
                      (n +=
                        "<br><strong>" + t + ":</strong> +" + i[r][t] + "%");
                  We(this)
                    .children("[class^='propertyContent___']")
                    .children("[class^=description___]")
                    .children("p:first")
                    .append(
                      `<span class="t-green gym-perks" title="${n}"> actual coefficient: ${a} </span>`
                    );
                  a = I(
                    We(this)
                      .children("[class^='propertyTitle___']")
                      .children("[class^='propertyValue___']")
                      .text()
                      .split(",")
                      .join(""),
                    45e7,
                    a,
                    5025,
                    25
                  );
                  We("#se-table")
                    .children()
                    .children(":eq(" + r + ")")
                    .children(".value")
                    .text(Yt(parseInt(a))),
                    r++;
                });
              })
              .catch((t) => console.log("getGymPerks " + t))));
      }
      function $() {
        for (let t = 1; t < 32; t++) {
          const e = We("#gym-" + t).attr("class");
          if (void 0 === e) return 33;
          if (0 <= e.indexOf("active")) return t;
        }
      }
      function I(t, e, a, n, i) {
        let o = 5e7;
        t < 5e7 && (o = t);
        return (
          (e / (0.01 * t)) *
          (a *
            i *
            ((3.480061091e-7 * Math.log(n + 250) + 3091619094e-15) * o +
              682775184551527e-19 * (n + 250) -
              0.0301431777))
        );
      }
      const ia = le("gym-ratio", "ratio_number");
      if (null !== ia && void 0 !== ia) {
        We("#gym-ratio")
          .children("[value=" + ia + "]")
          .attr("selected", "true"),
          We("#gym-ratio-info").text(
            `Str : Def : Spd : Dex = ${ea[ia].str} : ${ea[ia].def} : ${ea[ia].spd} : ${ea[ia].dex}`
          );
        const oa = setInterval(() => {
          0 < We("[class^='gymContent___']").length &&
            w(ea[ia].str, ea[ia].def, ea[ia].spd, ea[ia].dex);
        }, 2e3);
      }
      We("#gym-ratio").change(function () {
        console.log("ratio changed");
        var t = We("#gym-ratio").val();
        ce("gym-ratio", "ratio_number", t),
          We("#gym-ratio-info").text(
            `Str : Def : Spd : Dex = ${ea[t].str} : ${ea[t].def} : ${ea[t].spd} : ${ea[t].dex}`
          ),
          w(ea[t].str, ea[t].def, ea[t].spd, ea[t].dex);
      });
    }
    if (
      noAssisting &&
      0 <= window.location.href.indexOf("loader.php?sid=attack&user2ID")
    ) {
      let e = Math.floor(30 * Math.random() + 1),
        a = 300;
      const ra = setInterval(S, 100),
        sa = setInterval(D, 100);
      function S() {
        const t = We("[class^='btn_']");
        t.text().includes("Start fight") &&
          (t.prop("hidden", !0),
          t
            .parent()
            .parent()
            .children(":first")
            .text("Wait (" + (e / 10).toFixed(1) + ")s To Start fight"),
          0 == e &&
            (clearInterval(ra),
            t.parent().parent().children(":first").text(""),
            t.removeAttr("hidden")),
          e--);
      }
      function D() {
        const t = We("[class^='btn_']");
        t.text().includes("Join fight") &&
          (t.prop("hidden", !0),
          t
            .parent()
            .parent()
            .children(":first")
            .text(
              "Wait (" +
                (a / 10).toFixed(1) +
                ")s To Join fight Someone else has entered this battle"
            ),
          0 == a &&
            (clearInterval(sa),
            t.parent().parent().children(":first").text(""),
            t.removeAttr("hidden")),
          a--);
      }
    }
    if (0 <= window.location.href.indexOf("loader.php?sid=attack&user2ID")) {
      let i = 100;
      const la = setInterval(A, 500);
      function A() {
        var t, e, a, n;
        0 < We("[class^=level]").length &&
          0 < We("#log-header").length &&
          ((n = We("[class^=level]")
            .attr("style")
            .replace("height: ", "")
            .replace("%", "")),
          (t = parseFloat(n)) > i ||
            ((e = 66 <= (i = t) ? "green" : "red"),
            (a = 66 <= t ? "high" : "Low"),
            We("#stealth-value").remove(),
            (n = We("#log-header").children(":first").attr("class")),
            We("#log-header").children(":first").after(`
<span id="stealth-value" class="${n}">stealth chance:&nbsp;
<span class="t-${e}">${a}</span>
&nbsp;Stealth:&nbsp;
<span class="t-${e}">${t}%</span>
</span>`)));
      }
    }
    if (0 <= window.location.href.indexOf("loader.php?sid=attack&user2ID")) {
      const da = setInterval(F, 1e3);
      function F() {
        const t = We("#defender_Primary").siblings().last(),
          e = We("#defender_Secondary").siblings().last(),
          a = We("#defender_Melee").siblings().last();
        0 < t.length && (clearInterval(da), O(t, 0), O(e, 100), O(a, 200));
      }
      function O(e, a) {
        const t = e.children().children();
        t.each(function () {
          var t = We(this).attr("title");
          0 < t.length &&
            e.parent().parent().parent().parent().append(`
<div style="position: absolute; z-index: 1; top: ${a}px; right: -420px; width: 400px; height: 42px; margin: 2px; border: 2px solid #000; background-color: ${Xe.purple}; color: #eee; text-align: center;line-height: 20px;">${t}</div>`),
            (a += 50);
        });
      }
    }
    if (0 <= window.location.href.indexOf("loader.php?sid=attack&user2ID")) {
      const ca = setInterval(F, 1e3),
        pa = setInterval(C, 1e3);
      function F() {
        const t = We("[class^='playersModelWrap___']").find(
          "[class^='topWrap___']"
        );
        2 == t.length &&
          (clearInterval(ca),
          t.each(function () {
            We(this)
              .children(":first")
              .after('<span class="bw-hp-percent"></span>');
          }));
      }
      function C() {
        const t = We(".bw-hp-percent");
        2 == t.length &&
          t.each(function () {
            var t = We(this).siblings("span[class^='userName___']").text();
            const e = We(this)
              .siblings("div[class^='textEntries___']")
              .find("[id^='player-health-value_']")
              .text();
            var a = (
              (e.split("/")[0].replace(",", "").trim() /
                e.split("/")[1].replace(",", "").trim()) *
              100
            ).toFixed(2);
            t && a && We(this).text(` (${a}%)`);
          });
      }
    }
    if (0 <= window.location.href.indexOf("loader.php?sid=attack&user2ID")) {
      const ha = setInterval(M, 500);
      function M() {
        0 < We("[class^=modal___]").length && We("#upper-layer").length < 1
          ? T(We("[class^=modal___]"), "upper-layer")
          : 0 < We("[class^=playerWindow___]").length &&
            We("#lower-layer").length < 1 &&
            T(We("[class^=playerWindow___]"), "lower-layer");
      }
      function T(t, a) {
        const e = window.location.href.substring(51);
        var n = We("[class^=modal___]").css("background-color");
        t.last().append(`
<div id="${a}" class="border-round" style="overflow: hidden; width:228px; height:26px; position: absolute; right: 0px; top: -2px; z-index: 1; color: #fff ;background-image: linear-gradient(${n},#888 25%,${n}); border: 1px solid #000; margin: 5px; text-align: center;">
<div id="${a}-online" style="float: left; width:44px; height:16px; background-color: ${Xe.blue}; border: 1px solid #000; margin: 4px 2px 4px 4px; text-align: center;"><div style="padding: 2px 0px">checking</div></div>
<div id="${a}-last" style="float: left; width:126px; height:16px; background-color: ${Xe.blue}; border: 1px solid #000; margin: 4px 2px; text-align: center;"><div style="padding: 2px 0px">checking</div></div>
<div id="${a}-refresh-btn" style="cursor: pointer; float: left; width:36px; height:16px; background-color: ${Xe.red}; border: 1px solid #000; margin: 4px 4px 4px 2px; text-align: center;"><div style="padding: 2px 0px">to refresh</div></div>
</div>`),
          We("#" + a + "-refresh-btn").click(() => {
            location.reload();
          }),
          be(
            e,
            function (t) {
              var e;
              null != t && "last_action" in t
                ? ("Online" == (e = t.last_action.status)
                    ? We("#" + a + "-online").css("background-color", Xe.green)
                    : "Idle" == e
                    ? We("#" + a + "-online").css("background-color", Xe.yellow)
                    : We("#" + a + "-online").css("background-color", Xe.gray),
                  We("#" + a + "-online")
                    .children()
                    .text(e),
                  We("#" + a + "-last")
                    .children()
                    .text(t.last_action_details),
                  console.log(a))
                : "error" in t &&
                  We("#" + a + "-last")
                    .children()
                    .text("API read failed");
            },
            function (t) {
              We("#" + a + "-last")
                .children()
                .text("frog detection " + e + "fail " + t);
            }
          );
      }
    }
    if (
      (nurse_suggestion &&
        0 <= window.location.href.indexOf("item.php") &&
        ze(".tutorial-cont"),
      0 <= window.location.href.indexOf("factions.php?step=your"))
    ) {
      let t = new MutationObserver(function (t, e) {
        console.log("changed"), ze("#faction-armoury-tabs");
      });
      t.observe(document.getElementById("faction-armoury"), {
        childList: !0,
        subtree: !0,
      });
    }
    if (
      (taking_off_reminder &&
        0 <= window.location.href.indexOf("travelagency.php") &&
        (0 < We("#icon86-sidebar").length &&
          (We("#tab-menu4")
            .after(`<div><div id='oc-btn' type='button' style='cursor:pointer;width:inherit;font-size:24px;margin:auto;padding:10px;border:5px solid gray;
background-color:NavajoWhite;text-align:center;'>OC is ready Click to execute</div></div>`),
          We("#oc-btn").click(function () {
            We(this).text("Frog is going……"),
              (window.location.href =
                "https://www.torn.com/factions.php?step=your#/tab=crimes");
          })),
        0 < We("#icon49-sidebar").length
          ? We("#tab-menu4")
              .after(`<div><div id='drug-btn' type='button' style='cursor:pointer;width:inherit;font-size:24px;margin:auto;padding:10px;border:5px solid gray;
background-color:#c0542f;text-align:center;'>DRUG CD is less than 10 minutes, don’t fly now</div></div>`)
          : 0 < We("#icon50-sidebar").length
          ? We("#tab-menu4")
              .after(`<div><div id='drug-btn' type='button' style='cursor:pointer;width:inherit;font-size:24px;margin:auto;padding:10px;border:5px solid gray;
background-color:#DAA520;text-align:center;'>DRUG CD less than 1 hour, don't fly now</div></div>`)
          : 0 < We("#icon51-sidebar").length
          ? We("#tab-menu4")
              .after(`<div><div id='drug-btn' type='button' style='cursor:pointer;width:inherit;font-size:24px;margin:auto;padding:10px;border:5px solid gray;
background-color:#5d9525;text-align:center;'>DRUG CD is between 1-2 hours, you can fly SHORT flights</div></div>`)
          : 0 < We("#icon52-sidebar").length
          ? We("#tab-menu4")
              .after(`<div><div id='drug-btn' type='button' style='cursor:pointer;width:inherit;font-size:24px;margin:auto;padding:10px;border:5px solid gray;
background-color:#5d9525;text-align:center;'>DRUG CD is between 2-5 hours, you can fly MEDIUM flights</div></div>`)
          : 0 < We("#icon53-sidebar").length
          ? We("#tab-menu4")
              .after(`<div><div id='drug-btn' type='button' style='cursor:pointer;width:inherit;font-size:24px;margin:auto;padding:10px;border:5px solid gray;
background-color:#5d9525;text-align:center;'>DRUG CD is more than 5 hours, you can fly LONG flights</div></div>`)
          : We("#tab-menu4")
              .after(`<div><div id='drug-btn' type='button' style='cursor:pointer;width:inherit;font-size:24px;margin:auto;padding:10px;border:5px solid gray;
background-color:#5d9525;text-align:center;'>DRUG CD is zero, did you forget to take your medicine?</div></div>`),
        Be()),
      0 <= window.location.href.indexOf("factions.php?step="))
    ) {
      const ga = setInterval(P, 3e3);
      class t {
        constructor() {
          this.wawa_cache = se("battlestats") || {};
          const t = se("BINGWA_TARGET") || [];
          this.bw_target_cache = Object.assign(
            {},
            ...t.map((t) => ({ [parseInt(t.ID)]: t.TOTAL }))
          );
        }
        get(t) {
          return this.bw_target_cache[t] || this.wawa_cache[t];
        }
      }
      const fa = new t();
      function P() {
        We("div.title").children("div.id").text("BS");
        const t = We("li.enemy,li.your").children("div.id");
        0 < t.length &&
          t.each(function (t, e) {
            const a = We(this)
                .siblings("span")
                .children("div.member")
                .children("a.user.name"),
              n = a ? a.attr("href") : void 0;
            var i = n ? n.substr(18) : void 0;
            i && ((i = fa.get(i)) ? We(this).text(z(i)) : We(this).text("nil"));
          });
        const e = We("li[class^='enemy enemy___']").parent(),
          a = We("li[class^='enemy enemy___']")
            .children("div.attack")
            .children();
        0 < a.length &&
          a.each(function () {
            if ("1" != We(this).attr("detected")) {
              const e = We(this)
                  .parent()
                  .siblings("div.member")
                  .children()
                  .children("[class^=userWrap___]")
                  .children(),
                a = e ? e.attr("href") : void 0;
              var t = a ? a.substr(18) : void 0;
              console.log(t),
                t &&
                  ((t = fa.get(t))
                    ? (We(this).text(z(t)), We(this).attr("bs", t))
                    : We(this).attr("bs", 0));
            }
            We(this).attr("detected", "1");
          }),
          0 < e.length &&
            "1" != e.attr("hasdone") &&
            (e.attr("hasdone", "1"),
            N(e.siblings().children("div[class^='attack left attack___']"), E));
      }
      function E(t) {
        return We(t).find("[bs]").attr("bs");
      }
      function N(t, a) {
        const e = t.parent().siblings(),
          n = t.parent().siblings().children();
        t.click(function () {
          "decend" == We(this).attr("sort")
            ? (n.sort(function (t, e) {
                return a(t) - a(e);
              }),
              n.detach().appendTo(e),
              We(this).attr("sort", "ascend"))
            : (n.sort(function (t, e) {
                return a(e) - a(t);
              }),
              n.detach().appendTo(e),
              We(this).attr("sort", "decend"));
        });
      }
      function z(t) {
        return 1e15 <= t
          ? "max"
          : 1e13 <= t
          ? parseInt(t / 1e12) + "t"
          : 1e12 <= t
          ? (t / 1e12).toFixed(1) + "t"
          : 1e10 <= t
          ? parseInt(t / 1e9) + "b"
          : 1e9 <= t
          ? (t / 1e9).toFixed(1) + "b"
          : 1e7 <= t
          ? parseInt(t / 1e6) + "m"
          : 1e6 <= t
          ? (t / 1e6).toFixed(1) + "m"
          : 1e4 <= t
          ? parseInt(t / 1e3) + "k"
          : 1e3 <= t
          ? (t / 1e3).toFixed(1) + "k"
          : t;
      }
      let a = setInterval(R, 3e3),
        e = setInterval(B, 1e3),
        n = 0;
      function R() {
        const t = We("[class^='status-wrap territoryBoxWp___']");
        if (0 < t.length) {
          console.log("war page detected"),
            clearInterval(a),
            (n = setInterval(j, 3e3));
          const e = t.width() - 6;
          t.each(function () {
            0 < We(this).parent("[class~='red']").length
              ? We(this)
                  .append(`<div class="ttwar-time border-round" style="width:${e}px; height:18px; position: relative; left: 2px; top: -8px; z-index: 1;
color: #fff ;background-image: linear-gradient(#ff7373,#fda8a8 25%,#ff7373); border: 1px solid #000; overflow: hidden;"></div>`)
              : We(this)
                  .append(`<div class="ttwar-time border-round" style="width:${e}px; height:18px; position: relative; left: 2px; top: -8px; z-index: 1;
color: #fff ;background-image: linear-gradient(#83a000,#abc170 25%,#83a000); border: 1px solid #000; overflow: hidden;"></div>`);
          });
        } else console.log("ttwartime heartbeat");
      }
      function j() {
        0 < We("[class^='status-wrap territoryBoxWp___']").length
          ? console.log("ttwartime heartbeat")
          : (console.log("war page closed"),
            clearInterval(n),
            (a = setInterval(R, 3e3)));
      }
      function B() {
        const t = We("[class^='status-wrap territoryBoxWp___']");
        var e = t.children(".ttwar-time");
        0 < t.length &&
          0 < e.length &&
          t.each(function () {
            var t = We(this).find(".timer").text(),
              e = parseInt(We(this).find(".swords-icon").parent().text()),
              a = parseInt(We(this).find(".shield-icon").parent().text());
            const n = We(this).find(".score").text();
            var i = Vt(n.split("/")[1]) - Vt(n.split("/")[0]),
              o = parseInt(new Date().getTime() / 1e3);
            let r = L(W(t)),
              s = o + W(t);
            a < e &&
              (l = parseInt(i / (e - a))) < W(t) &&
              ((r = L(l)), (s = o + l));
            var l = new Date(1e3 * s).toLocaleString("zh-CN", { hour12: !1 });
            We(this).children(".ttwar-time").html(`
<div style="float: left; padding: 4px 0px; margin-left: 4px;">left: ${r}</div>
<div style="float: right; padding: 4px 0px; margin-right: 4px;">ends at: ${l}</div>`);
          });
      }
      function W(t) {
        return (
          86400 * parseInt(t.split(":")[0]) +
          3600 * parseInt(t.split(":")[1]) +
          60 * parseInt(t.split(":")[2]) +
          parseInt(t.split(":")[3])
        );
      }
      function L(t) {
        var e = parseInt(t / 86400),
          a = e ? e + "days" : "",
          n = parseInt((t % 86400) / 3600),
          e = parseInt((t % 3600) / 60),
          t = t % 60;
        return a + G(n, 2) + ":" + G(e, 2) + ":" + G(t, 2);
      }
      function G(t, e) {
        return t.toString().length >= e ? t.toString() : G((t = "0" + t), e);
      }
    }
    if (
      extra_recent_attacks &&
      0 <= window.location.href.indexOf("factions.php?step=")
    ) {
      function q(t, e) {
        const a = t.split(" ");
        let n = 0;
        return (
          "s" == a[1]
            ? (n = e - parseInt(a[0]))
            : "m" == a[1]
            ? (n = e - parseInt(60 * a[0]))
            : "h" == a[1] && (n = e - parseInt(3600 * a[0])),
          n
        );
      }
      function H(t, e) {
        t = e - t;
        let a = "";
        return (
          (a =
            t < 60
              ? t + " s*"
              : t < 3600
              ? parseInt(t / 60) + " m*"
              : t < 86400
              ? parseInt(t / 3600) + " h*"
              : "Inf"),
          a
        );
      }
      let s = [],
        l = [];
      const ua = setInterval(X, 6e3);
      function X() {
        const n = We(".recent-attacks"),
          i = parseInt(new Date().getTime() / 1e3);
        if (0 < n.length) {
          const r = Array.from(n.children("li")).slice(0, 10);
          let e = [];
          for (let t = 9; 0 <= t; t--) s.indexOf(r[t]) < 0 && e.push(r[t]);
          e.forEach(function (t, e) {
            const a = We(t).children(".time").text();
            var n;
            (0 < a.indexOf("s") ||
              "1 m" == a ||
              "2 m" == a ||
              "3 m" == a ||
              "4 m" == a) &&
              ((n = q(a, i)), l.push(n), s.push(t));
          });
          let a = 0;
          l.forEach(function (t, e) {
            300 < i - t && (a = e + 1);
          }),
            (l = l.slice(a, l.length)),
            (s = s.slice(a, s.length)),
            We(".extra-attacks").remove();
          for (let t = s.length - 1; 0 <= t; t--) {
            var o;
            r.indexOf(s[t]) < 0 &&
              (We(s[t]).addClass("extra-attacks"),
              (o = H(l[t], i)),
              We(s[t]).children(".time").text(o),
              n.append(s[t]));
          }
        } else (s = []), (l = []);
      }
    }
    if (0 <= window.location.href.indexOf("page.php?sid=log")) {
      const ba = setInterval(J, 1e3);
      function J() {
        const t = We(".panel > div[class^=title]");
        0 !== t.length &&
          (clearInterval(ba),
          t.prepend(
            '<button id="log-export-btn" class="torn-btn" style="margin:5px;">Export selected logs</button>'
          ),
          We("#log-export-btn").click(async function () {
            const t = new Proxy(new URLSearchParams(window.location.search), {
              get: (t, e) => t.get(e),
            });
            var a = t.cat ? t.cat.split(",") : [];
            const n = t.log && 0 === a.length ? t.log.split(",") : [];
            if (0 !== a.length || 0 !== n.length) {
              alert(
                "Note:\n* Do not use other features that frequently request API at the same time (eg: Ice Frog Target, Parade, Criminal Experience)\n* Export takes a long time, please be patient\n* To cancel, please refresh or close page\n"
              );
              try {
                We(this).prop("disabled", !0),
                  We(this).text("Exporting, please be patient");
                var e = await (
                  await fetch(
                    `https://api.torn.com/user/?selections=basic&key=${x}`
                  )
                ).json();
                if ("error" in e) throw new Error(e.error.error);
                const s = Math.max(Math.ceil(n.length / 10), 1),
                  l = [];
                for (let e = 0; e < s; e++) {
                  var i = (t) => {
                    We(this).text(
                      `Exporting, please be patient (p. ${e + 1}/${s} batch ${new Date(
                        1e3 * t
                      ).format("yyyy-MM-dd")})`
                    );
                  };
                  for await (const d of ve(
                    a,
                    n.slice(10 * e, 10 * (e + 1)),
                    t.from,
                    t.to,
                    i
                  ))
                    l.push(d);
                }
                l.sort((t, e) => e.timestamp - t.timestamp);
                var o = {
                    user_id: e.player_id,
                    user_name: e.name,
                    timestamp: Math.floor(new Date().getTime() / 1e3),
                    categories: a,
                    types: n,
                    logs: l,
                  },
                  r = `data:application/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify(o)
                  )}`;
                We(this)
                  .replaceWith(`<a download="torn-log-${o.user_id}-${o.timestamp}.json" href="${r}"
class="torn-btn" style="color: #333; margin:5px; display:inline-block;">After the export is complete, click Save</a>`);
              } catch (t) {
                console.trace(t),
                  "Access level of this key is not high enough" === t.message
                    ? We(this).replaceWith(
                        '<a href="/preferences.php#tab=api">Insufficient permissions! Please use an API Key of type Full Access</a>'
                      )
                    : (We(this).text("Something went wrong! Please refresh and try again"),
                      alert(`something went wrong！${t}`));
              }
            } else alert("Please select a log type");
          }));
      }
    }
    if (0 <= window.location.href.indexOf("preferences.php")) {
      let i = setInterval(K, 2e3),
        o = 0;
      function U() {
        var t = We("[class^=api___]"),
          e = We("#name").attr("aria-expanded"),
          a = We("#name").attr("aria-hidden");
        0 < t.length && "false" == e && "false" == a
          ? console.log("apikey node heartbeat")
          : (console.log("apikey node closed"),
            clearInterval(o),
            We("#bingwa-apikey-setting").remove(),
            (i = setInterval(K, 2e3)));
      }
      function K() {
        var t = We("[class^=api___]"),
          e = We("#name").attr("aria-expanded"),
          a = We("#name").attr("aria-hidden");
        if (0 < t.length && "false" == e && "false" == a) {
          console.log("apikey node detected"),
            clearInterval(i),
            (o = setInterval(U, 2e3)),
            We(".content-title").after(`
<div id="bingwa-apikey-setting">
<div class="title-black m-top10 title-toggle tablet top-round faction-title active title" data-title="description" role="heading" aria-level="5">Ice Frog APIKey Settings</div>
<div id="bingwa-apikey-setting-wrapper" class="cont-gray bottom-rounded content" style="overflow:hidden; margin-bottom:10px;">
<div style="margin:5px;padding:5px;">The number of APIKeys you have is <span id="apikey-number" style="padding:3px;color:${Xe.yellowgreen};font-size:18px;"></span> indivual</div>
<div style="margin:5px;padding:5px;">The APIKey currently used by Icefrog is <span id="apikey-current" style="padding:3px;color:${Xe.yellowgreen};font-size:18px;"></span></div>
<div id= "apikey-wrapper"style="margin:5px;padding:5px;text-align:center;"></div>
</div>
</div>`);
          const n = We("[class^=keyRow]");
          We("#apikey-number").text(`${n.length}`),
            We("#apikey-current").text(
              `${window.localStorage.getItem("APIKey")}`
            ),
            0 < n.length
              ? (n.each(function () {
                  var t = We(this).children("[class^=key]").val(),
                    e = We(this)
                      .children("[class^=blockTablet]")
                      .children("[class^=type]")
                      .val();
                  We("#apikey-wrapper").append(`
<div id="${t}" style="overflow:hidden;color:white;margin-top:5px;">
<button class="key-btn torn-btn" style="float: left; line-height: 22px;">use</button>
<div class="key-level border-round" style="float: left; width: 50px; height: 30px; margin: 0px 5px; background-color: #333; border: 1px solid #fff"></div>
<div class="key-value border-round" style="float: left; width: 180px; height: 30px; background-color: #333; border: 1px solid #fff"></div>
</div>
`),
                    t == window.localStorage.getItem("APIKey")
                      ? (We("#" + t)
                          .children("button")
                          .text("Used")
                          .attr("disabled", "true"),
                        We("#" + t)
                          .children(".key-level")
                          .html(`<div style="padding: 3px 0px;">${e}</div>`)
                          .css("background-color", Xe.red),
                        We("#" + t)
                          .children(".key-value")
                          .html(
                            `<div style="padding: 6px 0px; font-size: 18px;">${t}</div>`
                          )
                          .css("background-color", Xe.red))
                      : (We("#" + t)
                          .children(".key-level")
                          .html(`<div style="padding: 3px;">${e}</div>`),
                        We("#" + t)
                          .children(".key-value")
                          .html(
                            `<div style="padding: 6px; font-size: 18px;">${t}</div>`
                          ));
                }),
                We(".key-btn").click(function () {
                  We(".key-btn").each(function () {
                    We(this).text("Unused").removeAttr("disabled"),
                      We(this).siblings().css("background-color", "#333");
                  }),
                    window.localStorage.setItem(
                      "APIKey",
                      We(this).parent().attr("id")
                    ),
                    We(this).text("Used").attr("disabled", "true"),
                    We(this).siblings().css("background-color", Xe.red),
                    We("#apikey-current").text(
                      `${window.localStorage.getItem("APIKey")}`
                    );
                }))
              : We("#apikey-wrapper").text(
                  "There is no existing APIKEY, please create one and refresh the page"
                );
        } else console.log("apikey node heartbeat");
      }
    } else if (null == x || "" == x)
      We("body")
        .prepend(`<div style="position: relative; z-index: 999; font-size: 16px; line-height: 1.6; padding: 10px; text-align: center; background: lightyellow;">
<a href="/preferences.php#tab=api">Baojian requires a valid APIKey<br/>Click to go to the settings page to choose</a>
</div>`);
    else {
      const ma = We("#sidebarroot").find("[class^='status-icons___']"),
        xa = We("#top-page-links-list").children("a");
      if (0 < xa.length || 0 < ma.length) {
        console.log("There are buttons on the current page, you can treasure");
        let n = {
            user: [
              "ammo",
              "attacks",
              "attacksfull",
              "bars",
              "basic",
              "battlestats",
              "bazaar",
              "cooldowns",
              "crimes",
              "discord",
              "display",
              "education",
              "events",
              "gym",
              "hof",
              "honors",
              "icons",
              "inventory",
              "jobpoints",
              "log",
              "medals",
              "merits",
              "messages",
              "missions",
              "money",
              "networth",
              "newevents",
              "newmessages",
              "notifications",
              "perks",
              "personalstats",
              "profile",
              "properties",
              "receivedevents",
              "refills",
              "reports",
              "revives",
              "revivesfull",
              "skills",
              "stocks",
              "timestamp",
              "travel",
              "weaponexp",
              "workstats",
            ],
            property: ["property", "timestamp"],
            faction: [
              "applications",
              "armor",
              "armorynews",
              "attacknews",
              "attacks",
              "attacksfull",
              "basic",
              "boosters",
              "cesium",
              "chain",
              "chainreport",
              "chains",
              "contributors",
              "crimenews",
              "crimes",
              "currency",
              "donations",
              "drugs",
              "fundsnews",
              "mainnews",
              "medical",
              "membershipnews",
              "positions",
              "reports",
              "revives",
              "revivesfull",
              "stats",
              "temporary",
              "territory",
              "territorynews",
              "timestamp",
              "upgrades",
              "weapons",
            ],
            company: [
              "applications",
              "companies",
              "detailed",
              "employees",
              "news",
              "newsfull",
              "profile",
              "stock",
              "timestamp",
            ],
            market: ["bazaar", "itemmarket", "pointsmarket", "timestamp"],
            torn: [
              "bank",
              "cards",
              "chainreport",
              "companies",
              "competition",
              "education",
              "factiontree",
              "gyms",
              "honors",
              "items",
              "logcategories",
              "logtypes",
              "medals",
              "organisedcrimes",
              "pawnshop",
              "pokertables",
              "properties",
              "rackets",
              "raids",
              "rankedwarreport",
              "rankedwars",
              "stats",
              "stocks",
              "territory",
              "territorywars",
              "timestamp",
            ],
            key: ["info"],
          },
          s = "",
          l = "",
          d = "";
        const va =
          '<li class="a_click_view_api_info icon6___XChW2" title="Ice Frog Treasure Book" style="cursor: pointer; background-image:url(/images/v2/editor/emoticons.svg); background-position: -470px -42px;"></li>';
        ma.prepend(va);
        const wa =
          '<a role="button" style="cursor: pointer" aria-labelledby="events" class="a_click_view_api_info events t-clear h c-pointer  m-icon line-h24 right last"><span class="icon-wrap svg-icon-wrap"><span class="link-icon-svg events "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 17"><defs><style>.cls-1{opacity:0.35;}.cls-2{fill:#fff;}.cls-3{fill:#777;}</style></defs><g id="Ð¡Ð»Ð¾Ð¹_2" data-name="Ð¡Ð»Ð¾Ð¹ 2"><g id="icons"><g class="cls-1"><path class="cls-2" d="M8,1a8,8,0,1,0,8,8A8,8,0,0,0,8,1ZM6.47,3.87H9.53l-.77,7.18H7.24ZM8,14.55A1.15,1.15,0,1,1,9.15,13.4,1.14,1.14,0,0,1,8,14.55Z"></path></g><path class="cls-3" d="M8,0a8,8,0,1,0,8,8A8,8,0,0,0,8,0ZM6.47,2.87H9.53l-.77,7.18H7.24ZM8,13.55A1.15,1.15,0,1,1,9.15,12.4,1.14,1.14,0,0,1,8,13.55Z"></path></g></g></svg></span></span><span id="a_click_view_api_info_text">Baojian</span></a>';
        xa.last().after(wa),
          We(".a_click_view_api_info").click(function () {
            if (We("#bwm").length < 1) {
              var e = We("#mainContainer")[0].clientWidth;
              let t = 985;
              e < 985 && (t = e);
              e = `
<div id="bwm" style="width:${t}px; margin: auto;">
<div id="bwm-nav">
<ul style="list-style-type: none;margin: 10px 0px;padding: 0;overflow: hidden;background-color: #333;">
<li style="float: left">
<a id="bwm-version" role="button" style="cursor: pointer;display: block;color: black;background-color: #4CAF50;text-align: center;padding: 14px 16px;text-decoration: none;" >Version Record</a>
</li>
<li style="float: left">
<a id="bwm-api" role="button" style="cursor: pointer;display: block;color: white;text-align: center;padding: 14px 16px;text-decoration: none;" >View APIs</a>
</li>
<li style="float: left">
<a id="bwm-company" role="button" style="cursor: pointer;display: block;color: white;text-align: center;padding: 14px 16px;text-decoration: none;" >Company</a>
</li>
<li style="float: left">
<a id="bwm-faction" role="button" style="cursor: pointer;display: block;color: white;text-align: center;padding: 14px 16px;text-decoration: none;" >Faction</a>
</li>
<li style="float: left">
<a id="bwm-target" role="button" style="cursor: pointer;display: block;color: white;text-align: center;padding: 14px 16px;text-decoration: none;" >Targets</a>
</li>
<li style="float: left">
<a id="bwm-chatlog" role="button" style="cursor: pointer;display: block;color: white;text-align: center;padding: 14px 16px;text-decoration: none;" >Chat Vault</a>
</li>
<li style="float: left">
<a id="bwm-revive" role="button" style="cursor: pointer;display: block;color: white;text-align: center;padding: 14px 16px;text-decoration: none;" >resurrection assistant</a>
</li>
<li style="float: left">
<a id="bwm-crimeexp" role="button" style="cursor: pointer;display: block;color: white;text-align: center;padding: 14px 16px;text-decoration: none;" >criminal experience</a>
</li>
<li style="float: left">
<a id="bwm-addiction" role="button" style="cursor: pointer;display: block;color: white;text-align: center;padding: 14px 16px;text-decoration: none;" >drug addiction</a>
</li>
${
  i != Le.other
    ? `
<li style="float: left">
<a id="bwm-extcenter" role="button" style="cursor: pointer;display: block;color: white;text-align: center;padding: 14px 16px;text-decoration: none;" >plug-in</a>
</li>`
    : ""
}
<li style="float: left">
<a id="bwm-settings" role="button" style="cursor: pointer;display: block;color: white;text-align: center;padding: 14px 16px;text-decoration: none;" >set up</a>
</li>
<li style="float: right">
<a id="bwm-return" role="button" style="cursor: pointer;display: block;color: white;text-align: center;padding: 14px 16px;text-decoration: none;" >return</a>
</li>
</ul>
</div>
</div>`;
              We("#sidebarroot").hide(),
                We(".content-wrapper").hide(),
                We("#mainContainer").prepend(e);
              function b(t) {
                const e = We("#bwm-nav [id^=bwm-]");
                e.attr(
                  "style",
                  "cursor: pointer; display: block; color: white; text-align: center; padding: 14px 16px; text-decoration: none;"
                ),
                  We(t).attr(
                    "style",
                    "cursor: pointer; display: block; color: black; background-color: #4CAF50; text-align: center; padding: 14px 16px; text-decoration: none;"
                  );
              }
              function a() {
                var t = getVersion();
                return `
<div id="version_container" style="width: inherit">
<div style="text-align:center; margin-bottom: 10px;">
<a role="button" style="cursor: pointer; font-size: large; color: #777;">The current version of Ice Frog is ${t[0]}</a>
</div>
<div style="text-align:center;">
<textarea  style="height:800px;width:100%;background-color: lightgray; font-family:\'Lucida Console\', Monaco, monospace; font-size: 0.8rem;line-height: 1.3;" readonly="readonly">${t[1]}</textarea>
</div>
</div>`;
              }
              We("#bwm").append(a()),
                We("#bwm-version").click(function () {
                  We("#bwm").children(":last").remove(),
                    We("#bwm").append(a()),
                    b("#bwm-version");
                }),
                We("#bwm-api").click(function () {
                  We("#bwm").children(":last").remove(),
                    We("#bwm").append(
                      (function () {
                        let t = "";
                        for (var e in n)
                          t +=
                            '<a role="button" style="cursor: pointer; font-size: large; color: #777;" class="a_click_api_type">' +
                            e +
                            "</a>&nbsp;&nbsp;";
                        t +=
                          '<br /><br /><input type="text" id="api_input_id" name="api_input_id" placeholder="ID (the current user does not need to fill in)" size="25" style="font-size: larger; padding: 3px;" />&nbsp;&nbsp;<input type="text" id="api_input_from_time" name="api_input_from_time" placeholder="From (Eg: 2019/10/25 23:00:00)" size="29" style="font-size: larger; padding: 3px;" />&nbsp;&nbsp;<input type="text" id="api_input_to_time" name="api_input_to_time" placeholder="To (Eg: 2019/10/26 08:00:00)" size="28" style="font-size: larger; padding: 3px;" />';
                        let a =
                          '<div id="api_container"><div id="api_types_container" style="text-align:center; margin-bottom: 10px;">' +
                          t +
                          '</div><div id="api_fields_container" style="text-align:center; margin-bottom: 10px;"></div><div id="api_result_header" style="text-align:center; margin-bottom: 3px; font-size: large;"></div><div style="text-align:center;"><textarea id="api_result_container" rows="40" style="width:100%; background-color: lightgray; font-family:\'Lucida Console\', Monaco, monospace; font-size: 0.8rem;line-height: 1.3;" readonly="readonly" /><br /><a id="api_result_download_csv" role="button" style="cursor: pointer; font-size: large; color: #777;">Export as CSV file</a>';
                        return (
                          foo
                            ? (a +=
                                '&nbsp;&nbsp;&nbsp;&nbsp;<a id="a_faction_parade" role="button" style="cursor: pointer; font-size: large; color: #777;">gang parade</a><a id="a_faction_parade_download" role="button" style="display:none">gang parade download</a>&nbsp;&nbsp;&nbsp;&nbsp;<a id="a_faction_attacks" role="button" style="cursor: pointer; font-size: large; color: #777;">Help statistics</a><a id="a_faction_attacks_download" role="button" style="display:none">Help war statistics download</a></div></div>')
                            : (a += "</div></div>"),
                          a
                        );
                      })()
                    ),
                    b("#bwm-api"),
                    We(".a_click_api_type").click(function () {
                      We("#api_fields_container").empty(),
                        (s = We(this).text()),
                        console.log("click: " + s);
                      var t,
                        e = n[s].sort();
                      for (t in e) {
                        var a = e[t];
                        We("#api_fields_container").append(
                          '<a role="button" style="cursor: pointer; font-size: large; color: #777;" class="a_click_api_field">' +
                            a +
                            "</a>&nbsp;&nbsp;"
                        ),
                          t % 10 == 8 &&
                            We("#api_fields_container").append("<br />");
                      }
                      We(".a_click_api_field").click(function () {
                        We("#api_result_container").val("");
                        var t = We(this).text(),
                          e = We("#api_input_id").val(),
                          a = We("#api_input_from_time").val(),
                          n = new Date(a).getTime() / 1e3,
                          i = We("#api_input_to_time").val(),
                          o = new Date(i).getTime() / 1e3;
                        let r = `https://api.torn.com/${s}/${e}?selections=${t}&key=${x}&from=${n}&to=${o}`;
                        (isNaN(n) || isNaN(o)) &&
                          (r = `https://api.torn.com/${s}/${e}?selections=${t}&key=${x}`),
                          console.log(`Request: ${r}`),
                          (d =
                            s + " - " + e + " - " + t + " - " + a + " - " + i),
                          We("#api_result_header").text(`detection: ${d}`),
                          We("#api_result_download_csv").removeAttr("href"),
                          We("#api_result_download_csv").removeAttr("download"),
                          (l = ""),
                          fetch(r)
                            .then(
                              (t) =>
                                t.ok
                                  ? t.json()
                                  : void We("#api_result_header").text(
                                      `probe failed: ${d}`
                                    ),
                              (t) => {
                                We("#api_result_header").text(`network anomaly: ${d}`);
                              }
                            )
                            .then((t) => {
                              console.log(`Response: ${r}`),
                                console.log(t),
                                void 0 !== t &&
                                  (We("#api_result_header").text(
                                    `detection complete: ${d}`
                                  ),
                                  (l = t),
                                  We("#api_result_container").val(
                                    JSON.stringify(t, null, 4)
                                  ));
                            });
                      });
                    }),
                    We("#api_result_download_csv").click(function () {
                      var t;
                      null == l ||
                      "" == l ||
                      null == d ||
                      "" == d ||
                      "object" != typeof l ||
                      l.length < 1
                        ? alert("no data to export")
                        : null != (t = ne(l))
                        ? ((t = re(t)),
                          We(this).attr(
                            "href",
                            "data:text/csv;charset=utf-8,\ufeff" + t
                          ),
                          We(this).attr("download", d + ".csv"))
                        : alert("No valid dataset found");
                    }),
                    We("#a_faction_parade").click(function () {
                      We("#api_result_container").val("");
                      const l = We("#api_input_id").val();
                      _e(
                        "When the gang parade starts, the list of gang members will be pulled, and then the detailed information of each member will be queried one by one, and then the analysis results will be added using the frog detector, and finally exported to a csv file. "
                      ),
                        _e("Please note："),
                        _e(
                          "1. This function will call the API interface many times, so don't use it too frequently."
                        ),
                        _e(
                          "2. In order to avoid being blocked too frequently, each query is delayed, so the running time is longer, please wait patiently."
                        ),
                        _e("3. If you want to give up halfway, please close the window of this webpage directly.");
                      let a = `https://api.torn.com/faction/${l}?selections=basic&key=${x}`;
                      We("#api_result_header").text(`gang parade ${l}`),
                        console.log(`Request: ${a}`),
                        _e("\nStart getting gang member list"),
                        fetch(a)
                          .then(
                            (t) => (t.ok ? t.json() : void _e("parade failure")),
                            (t) => {
                              _e("The military parade failed and the network was abnormal");
                            }
                          )
                          .then((t) => {
                            console.log(`Response: ${a}`), console.log(t);
                            const n = Object.keys(t.members),
                              e = n.length;
                            _e(`Get gang member list completed, there are ${e} members in total`);
                            let i = new Array(),
                              o = 0;
                            function r() {
                              const e = n[o];
                              let a = t.members[e];
                              (a.userId = e),
                                i.push(a),
                                be(
                                  e,
                                  function (t) {
                                    _e(`Frog probe userId: ${e} succeeded`),
                                      Object.assign(a, t),
                                      s();
                                  },
                                  function (t) {
                                    _e(`Frog probe userId: ${e} failed`), s();
                                }
                              );
                          }
                          function s() {
                            if (o < e - 1) ++o, setTimeout(r, 1e3);
                            else {
                              _e("Frog detection completed"),
                                _e("\nStart converting to csv format...");
                                var a = re(i);
                                const n = We("#a_faction_parade_download");
                                n.attr(
                                  "href",
                                  "data:text/csv;charset=utf-8,\ufeff" + a
                                );
                                let t = new Date();
                                n.attr(
                                  "download",
                                  `FactionParade_${l}_${t.format(
                                    "yyyyMMdd_hhmm"
                                  )}.csv`
                                ),
                                  _e("Convert to csv format complete"),
                                  _e("\n开始下载");
                                let e = document.createEvent("MouseEvents");
                                e.initEvent("click", !0, !0),
                                  document
                                    .getElementById("a_faction_parade_download")
                                    .dispatchEvent(e);
                              }
                            }
                            _e("\nStart Frog Detection..."), r();
                          });
                    }),
                    We("#a_faction_attacks").click(function () {
                      var t = We("#api_input_from_time").val();
                      const d = new Date(t);
                      let c = d.getTime() / 1e3;
                      var e = We("#api_input_to_time").val();
                      const p = new Date(e),
                        h = p.getTime() / 1e3;
                      if (isNaN(c) || isNaN(c))
                        alert(
                          "This function must enter the start and end time (your computer local time, do not convert to TCT) "
                        );
                      else {
                        We("#api_result_container").val(""),
                          _e(
                            "Start gang battle statistics, it will automatically divide the time period, pull gang attacks records (up to 100 each time), then splicing, and finally export it as a csv file. "
                          ),
                          _e("Please note:"),
                          _e("1. This function requires gang API permission."),
                          _e(
                            "2. This function will call the API interface many times, so don't use it too frequently."
                          ),
                          _e(
                            "3. It is only accessed once every 30 seconds (because the test found that the data is cached), so it takes a long time to run, please wait patiently."
                          ),
                          _e("4. If you want to give up halfway, please close the window of this webpage directly."),
                          _e(
                            `\nStart time: ${t} timestamp ${c}, end time: ${e} timestamp ${h} \n`
                          );
                        let l = new Object();
                        !(function r() {
                          const s = `https://api.torn.com/faction/?selections=attacks&key=${x}&from=${c}&to=${h}`;
                          console.log(`Request: ${s}`),
                            We("#api_result_header").text("Help Battle Statistics"),
                            fetch(s)
                              .then(
                                (t) =>
                                  t.ok
                                    ?t.json()
                                    : (_e("Crawl failed, will try again in 1 second"),
                                      void setTimeout(r, 1e3)),
                                (t) => {
                                  _e("Crawl failed, will try again after 1 second"),
                                    setTimeout(r, 1e3);
                                }
                              )
                              .then((t) => {
                                function e() {
                                  _e(
                                    "\nThe capture of attack records is complete, and the conversion to csv format begins..."
                                    );
                                    var t = re(ee(l));
                                    const e = We("#a_faction_attacks_download");
                                    e.attr(
                                      "href",
                                      "data:text/csv;charset=utf-8,\ufeff" + t
                                    ),
                                      e.attr(
                                        "download",
                                        `FactionAttacks_${d. format(
                                          "yyyyMMddhhmmss"
                                        )}_${p.format("yyyyMMddhhmmss")}.csv`
                                      ),
                                      _e("Conversion to csv format completed"),
                                    _e("\nstart download");
                                  let a = document.createEvent("MouseEvents");
                                  a.initEvent("click", !0, !0),
                                    document
                                      .getElementById(
                                        "a_faction_attacks_download"
                                      )
                                      .dispatchEvent(a);
                                }
                                console.log(`Response: ${s}`),
                                  console.log(t),
                                  Object.assign(l, t.attacks);
                                var a = ee(t.attacks);
                                if (0 < a.length) {
                                  var n = a[0].timestamp_started;
                                  const i = new Date(1e3 * n);
                                  t = a[a.length - 1].timestamp_started;
                                  const o = new Date(1e3 * t);
                                  _e(
                                    `Grab ${c} - ${h} with ${
                                        a. length
                                      }, the first ${n} ${i.format(
                                        "yyyy/MM/dd hh:mm:ss"
                                      )}, the last ${t} ${o.format(
                                        "yyyy/MM/dd hh:mm:ss"
                                      )}, accumulated ${Object.keys(l).length} items`
                                  ),
                                    t < c || t > h
                                      ? 1 < a.length
                                        ? (_e("The fetched data is not updated, ready to try again"),
                                        setTimeout(r, 1e4))
                                      : (_e(
                                          "The system will somehow get stuck on the last item, just complete it"
                                          ),
                                          e())
                                      : ((c = t + 2), setTimeout(r, 30500));
                                } else e();
                              });
                        })();
                      }
                    });
                }),
                We("#bwm-company").click(function () {
                  We("#bwm").children(":last").remove(),
                    We("#bwm").append(`
<div id="mycompany_container" style="width: inherit">
<div id="mycompany-head" style="margin:10px 0px; border:1px solid darkgray; text-align:center;">
<span id="companyname" role="button" style="font-size: large; color:#777;" >Company</span>
</div>
<div id="tips-view-company" style="text-align:center; margin-bottom: 3px; font-size: 4px;"></div>
<div id="mycompany-content" style="min-height:400px;margin:10px 0px; border:1px solid darkgray;  text-align:center;overflow:hidden; overflow-x: auto;"></div>
</div>`),
                    b("#bwm-company");
                  var t = Se();
                  console.log("userId " + t),
                    zt(t)
                      .then(function (t) {
                        console.log(t);
                        t = t[3];
                        "Employee" == t
                          ? yt(We("#mycompany-content"))
                          : "Director" == t && vt(We("#mycompany-content"));
                      })
                      .catch((t) => console.log("userId2otherIds " + t));
                }),
                We("#bwm-faction").click(function () {
                  function r() {
                    var t = window.localStorage.getItem(
                      "faction_compare_history"
                    );
                    if (null != t) {
                      var e,
                        a = JSON.parse(t);
                      for (e in a)
                        We("#bwm_faction_history").append(`
<div class="wrapper-history" style="width:135px;float:left;border:1px solid darkgray;margin:5px 10px;">
<div class="head-history" style="background-color:black;color:white;padding:5px;overflow:hidden;">
<div class="id-history" style="width:30%;float:left;margin-left:50%;position:relative;left:-15%;">${e}</div>
<div style="float:right;cursor:pointer;background-color:white;color:black;padding:0px 2px;">
<a class="delete-history" role="button" >X</a>
</div>
</div>
<div class="content-history" style="background-color:var(--default-bg-panel-color);padding:5px;">
<a style="width:100%;overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" class="user faction" href="/factions.php?step=profile&amp;ID=${e}" target="_blank">${a[e]}</a>
</div>
</div>`);
                      We(".delete-history").click(function () {
                        var t = We(this)
                          .parent()
                          .parent()
                          .children(".id-history")
                          .text();
                        pe("faction_compare_history", t),
                          We(this).parent().parent().parent().remove(),
                          console.log("successfully deleted: " + t);
                      }),
                        We(".head-history").click(function () {
                          const t = We(this).siblings(".content-history");
                          var e;
                          "selected" == t.attr("selected")
                            ? (t.css("background-color", "white"),
                              t.removeAttr("selected"),
                              We("#faction-input-id").val(""))
                            : (We(".content-history").css(
                                "background-color",
                                "white"
                              ),
                              We(".content-history").removeAttr("selected"),
                              t.css(
                                "background-color",
                                "var(--default-bg-red-hover-color)"
                              ),
                              t.attr("selected", "selected"),
                              (e = We(this).children(".id-history").text()),
                              We("#faction-input-id").val(e));
                        });
                    }
                  }
                  We("#bwm").children(":last").remove(),
                    We("#bwm").append(`
<div id="bwm_faction_container" style="width: inherit">
<div id="bwm_faction_header" style="margin:10px 0px; border:1px solid darkgray; text-align:center;">
<input type="text" id="faction-input-id" name="faction-input-id" placeholder="Faction ID" size="10" style="font-size: larger; padding: 5px; margin: 5px;" />
<button id="faction-load-btn" class="torn-btn" style="margin:5px;">Load Faction</button>
<button id="faction-parade-start-btn" class="torn-btn" style="margin:5px;">Start the Parade</button>
<button id="faction-parade-stop-btn" class="torn-btn" style="margin:5px;" disabled>Stop the parade</button>
</div>
<div id="bmw_faction_tips" style="text-align:center; margin-bottom: 3px; font-size: 4px;"></div>
<div id="bwm_faction_history" style="margin:10px 0px; border:1px solid darkgray;  text-align:center;overflow:hidden;"></div>
<div id="bmw_faction_wrapper" style="min-height:700px;margin:10px 0px; border:1px solid darkgray;  text-align:center;overflow:hidden; overflow-x: auto;"></div>
</div>`),
                    b("#bwm-faction"),
                    r();
                  let t = window.localStorage.getItem("MY_FACTION_ID");
                  (void 0 !== t && null !== t) || (t = "11428"),
                    We("#faction-load-btn").click(function () {
                      We("#faction-input-id").val() ||
                        We("#faction-input-id").val(t),
                        (function (i, t) {
                          t.empty(),
                            t.append(`
<div id="name-faction" style="font-size: 20px; margin: 4px;"><img id="tag-faction" style="margin-right: 4px;"><span></span></div>
<div id="rank-faction" style="margin: 2px;"></div>
<div id="detail-faction" style="margin: 2px;"></div>
<div id="table-faction">
<table class="table-faction-table" style="margin:auto;background-color:var(--default-bg-panel-color);font-size:12px;">
<tr class="head">
<th class="table-online">Online</th>
<th class="table-level">Lvl</th>
<th>Name</th>
<th>ID</th>
<th class="table-last">Last</th>
<th class="table-status">Status</th>
<th class="table-position">Position</th>
<th class="table-days">Days</th>
<th>Attack</th>
<th class="table-bs">BS</th>
<th class="table-revivable">Revivable</th>
<th>Description</th>
</tr>
</table>
</div>`),
                            We("#table-faction")
                              .find(".table-faction-table")
                              .find("th")
                              .attr(
                                "style",
                                "border: 1px solid darkgray;padding: 5px;background-color: black;color: white;font-weight: bold;text-align:center;"
                              ),
                            (t = `https://api.torn.com/faction/${i}?selections=basic&key=${x}`);
                          const o = We("#bmw_faction_tips");
                          o.text("---探测中 " + i + "---"),
                            fetch(t)
                              .then(
                                (t) =>
                                  t.ok
                                    ? t.json()
                                    : void o.text("---Probe failed " + i + "---"),
                                    (t) => {
                                      o.text("---Network exception " + i + "---");
                                    }
                                  )
                                  .then((t) => {
                                    console.log("API fetched: " + i),
                                      null != t &&
                                        o.text("---detection completed " + i + "---"),
                                  We("#name-faction")
                                    .children("span")
                                    .text(`${t.name} - ${i}`),
                                  We("#tag-faction").attr(
                                    "src",
                                    `https://factiontags.torn.com/${t.tag_image}`
                                  ),
                                  We("#rank-faction").text(
                                    `Rank: ${t.rank.name} - ${t.rank.division}`
                                  ),
                                  ce("faction_compare_history", i, t.name),
                                  We("#bwm_faction_history").empty(),
                                  r(),
                                  We(".id-history").each(function () {
                                    We(this).text() == i &&
                                      We(this)
                                        .parent()
                                        .parent()
                                        .children(".content-history")
                                        .css(
                                          "background-color",
                                          "var(--default-bg-red-hover-color)"
                                        );
                                  });
                                var e = Object.keys(t.members).length;
                                const a = t.respect;
                                var n = a
                                  .toString()
                                  .replace(
                                    /\d{1,3}(?=(\d{3})+$)/g,
                                    function (t) {
                                      return t + ",";
                                    }
                                  );
                                We("#detail-faction").text(
                                  `Members: ${e} | Resp: ${n} | Best Chain: ${t.best_chain}`
                                ),
                                  We.each(t.members, function (t, e) {
                                    var a = t,
                                      n = pt(a),
                                      i = ft(e.last_action.timestamp),
                                      o = e.status.state,
                                      r = e.status.description,
                                      s = e.status.until,
                                      t = e.status.color,
                                      o = ut(r, o, s),
                                      s = gt(a);
                                    let l = "var(--default-color)";
                                    ("Leader" != e.position &&
                                      "Co-leader" != e.position) ||
                                      (l = "var(--default-red-color)");
                                    let d = "grey",
                                      c = 1;
                                    "Online" == e.last_action.status
                                      ? ((d = "DarkSeaGreen"), (c = 3))
                                      : "Idle" == e.last_action.status &&
                                        ((d = "Orange"), (c = 2));
                                    e = `
<tr class="content">
<td class="table-online" code="${c}" style="border: 1px solid darkgray;padding:5px;color:white;background-color:${d}">${e.last_action.status}</td>
<td class="table-level" style="border: 1px solid darkgray;padding:5px;color:var(--default-color);">${e.level}</td>
<td style="border: 1px solid darkgray;padding:5px;"><a class="user name" href="/profiles.php?XID=${a}" target="_blank">${e.name}</a></td>
<td style="border: 1px solid darkgray;padding:5px;text-align:right;color:var(--default-color);">${a}</td>
<td class="table-last" style="border: 1px solid darkgray;padding:5px;color:var(--default-color);" last-action-minutes="${i[0]}">${i[1]}</td>
<td class="table-status t-${t}" style="border: 1px solid darkgray;padding:5px;" hospital-minutes="${o[1]}">${o[0]}</td>
<td class="table-position" style="border:1px solid darkgray;padding:5px;color:${l};">${e.position}</td>
<td class="table-days" style="border: 1px solid darkgray;padding:5px;color:var(--default-color);">${e.days_in_faction}</td>
<td class="t-blue" style="border: 1px solid darkgray;padding:5px;"><a style="text-decoration:none;" href="/loader.php?sid=attack&user2ID=${a}" target="_blank">Attack</a></td>
<td class="table-bs" style="border: 1px solid darkgray;padding:5px;color:var(--default-color);" estimate-bs="${n[0]}">${n[2]}</td>
<td class="table-revivable" style="border: 1px solid darkgray;padding:5px;color:var(--default-color);">${s}</td>
<td style="border: 1px solid darkgray;padding:5px;color:var(--default-color);">${e.status.details}</td>
</tr>`;
                                    We("#table-faction")
                                      .children(".table-faction-table")
                                      .children()
                                      .append(e);
                                  });
                              })
                              .catch((t) => console.log("fetch error", t));
                        })(
                          We("#faction-input-id").val(),
                          We("#bmw_faction_wrapper")
                        ),
                        ge(We("th.table-bs"), ct),
                        ge(We("th.table-last"), lt),
                        ge(We("th.table-status"), dt),
                        ge(We("th.table-online"), it),
                        ge(We("th.table-level"), nt),
                        ge(We("th.table-position"), rt),
                        ge(We("th.table-days"), st),
                        ge(We("th.table-revivable"), ot);
                    });
                  let i = !0;
                  We("#faction-parade-start-btn").click(function () {
                    (i = !0),
                      We("#faction-load-btn").prop("disabled", !0),
                      We("#faction-parade-start-btn").prop("disabled", !0),
                      We("#faction-parade-stop-btn").removeAttr("disabled"),
                      We("tr.head").attr("style", "pointer-events: none;");
                    const t = We(".table-faction-table")
                      .children()
                      .children("tr.content")
                      .first();
                    t.length <= 0
                      ? (We("#bmw_faction_tips").text("User list not found"),
                        We("#faction-load-btn").removeAttr("disabled"),
                        We("#faction-parade-start-btn").removeAttr("disabled"),
                        We("#faction-parade-stop-btn").prop("disabled", !0),
                        We("tr.head").removeAttr("style"))
                      : (We("#bmw_faction_tips").text("parade begins"),
                        setTimeout(() => {
                          !(function e(a) {
                            if ("1" == a.attr("detected"))
                              We("#bmw_faction_tips").text("user completed"),
                              setTimeout(() => {
                                e(a. next());
                              }, 0);
                          else if (a.length <= 0 || 0 == i)
                            We("#bmw_faction_tips").text("The military parade is over"),
                                We("#faction-load-btn").removeAttr("disabled"),
                                We("#faction-parade-start-btn").removeAttr(
                                  "disabled"
                                ),
                                We("#faction-parade-stop-btn").prop(
                                  "disabled",
                                  !0
                                ),
                                We("tr.head").removeAttr("style");
                            else {
                              a.attr("detected", "1");
                              const n = a
                                .find("a.user.name")
                                .attr("href")
                                .replace(/[^0-9|-]/gi, "");
                              We("#bmw_faction_tips").text("is parading: " + n),
                                be(
                                  n,
                                  function (t) {
                                    a
                                      .children("td.table-bs")
                                      .text(Qt(t.estimate_bs)),
                                      a
                                        .children("td.table-bs")
                                        .attr("estimate-bs", t.estimate_bs),
                                      ce("battlestats", n, t.estimate_bs),
                                      a
                                        .children("td.table-revivable")
                                        .text(t.revivable),
                                      ce("revivable", n, t.revivable),
                                      setTimeout(() => {
                                        e(a.next());
                                      }, 1e3);
                                  },
                                  function (t) {
                                    We("#bmw_faction_tips").text(
                                      "Frog probe " + n + " failed " + t
                                    ),
                                      setTimeout(() => {
                                        e(a.next());
                                      }, 1e3);
                                  }
                                );
                            }
                          })(t);
                        }, 1e3));
                  }),
                    We("#faction-parade-stop-btn").click(function () {
                      i = !1;
                    });
                }),
                We("#bwm-target").click(function () {
                  We("#bwm").children(":last").remove(),
                    We("#bwm").append(`
<div id="bwm_target_container" style="width: inherit">
<div id="bwm_target_header" style="margin:10px 0px; border:1px solid darkgray; text-align:center;">
<button id="target-load-excel" class="torn-btn" style="margin:5px;">Load local excel file</button>
<button id="target-clear-cache" class="torn-btn" style="margin:5px;" disabled>clear cache</button>
</div>
<input type="file" id="file" style="display: none;" accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
<div id="bmw_target_tips" style="text-align:center; margin-bottom: 3px; font-size: 4px;">Please follow the template below to import the form xlsx or csv format only</div>
<div id="bmw_target_wrapper" style="min-height:700px;margin:10px 0px; border:1px solid darkgray;  text-align:center;overflow:hidden; overflow-x: auto;">
<table style="margin: auto;">
<tr>
<th style="border: 1px solid darkgray; padding: 5px; background-color: white;"></th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: gray; color: green; font-weight: bold; text-align: center;">A</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: gray; color: green; font-weight: bold; text-align: center;">B</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: gray; color: green; font-weight: bold; text-align: center;">C</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: gray; color: green; font-weight: bold; text-align: center;">D</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: gray; color: green; font-weight: bold; text-align: center;">E</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: gray; color: green; font-weight: bold; text-align: center;">F</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: gray; color: green; font-weight: bold; text-align: center;">G</th>
</tr>
<tr>
<td style="border: 1px solid darkgray; padding: 5px; background-color: gray; color: green; font-weight: bold; text-align: center;">1</td>
<td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">Name</td>
<td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">ID</td>
<td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">STR</td>
<td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">DEF</td>
<td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">SPD</td>
<td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">DEX</td>
<td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">TOTAL</td>
</tr>
<tr>
<td style="border: 1px solid darkgray; padding: 5px; background-color: gray; color: green; font-weight: bold; text-align: center;">2</td>
<td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">GoodLuck</td>
<td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">2356929</td>
<td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">200,000,000</td>
<td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">200,000,000</td>
<td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">200,000,000</td>
<td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">200,000,000</td>
<td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">800,000,000</td>
</tr>
</table>
</div>

</div>`),
                    b("#bwm-target");
                  let n = 0;
                  window.localStorage.setItem("BINGWA_TARGET_FLAG", "");
                  var t = window.localStorage.getItem("BINGWA_TARGET");
                  let i = t ? JSON.parse(t) : {};
                  function e(t, e) {
                    function a(t, e) {
                      "off" == e
                        ? t.parent().addClass("hide")
                        : "on" == e && t.parent().removeClass("hide");
                    }
                    We(
                      "." +
                        {
                          Online: "target-online",
                          Idle: "target-online",
                          Offline: "target-online",
                          在城内: "target-status",
                          在城外: "target-status",
                          "Hospitalization time<=5m": "target-status",
                          "Hospital time>5m": "target-status",
                          "FF>=2.0": "target-fairfight",
                          "FF<2.0": "target-fairfight",
                        }[t]
                    ).each(function () {
                      We(this).text() == t
                        ? a(We(this), e)
                        : "in town" == t
                        ? "town" == We(this).attr("hospital-location") &&
                          a(We(this), e)
                        : "Outside the city" == t
                        ? "oversea" == We(this).attr("hospital-location") &&
                          a(We(this), e)
                        : "Hospitalization time<=5m" == t
                        ?We(this).attr("hospital-seconds") <= 300 &&
                          a(We(this), e)
                        : "Hospitalization time>5m" == t
                        ? 300 < We(this).attr("hospital-seconds") &&
                          a(We(this), e)
                        : "FF>=2.0" == t
                        ? 2 <= We(this).text() && a(We(this), e)
                        : "FF<2.0" == t &&
                          We(this).text() < 2 &&
                          a(We(this), e);
                    });
                  }
                  function o(t) {
                    0 == t.length ||
                      ("ID" in (t = Object.values(t)[0]) &&
                        ((t = t.ID),
                        console.log(t),
                        zt(t)
                          .then(function (t) {
                            console.log("arr " + t),
                              (n = setInterval(() => {
                                !(function (e) {
                                  if (
                                    i.length <= 0 ||
                                    We(".target-id").length <= 0
                                  )
                                    window.localStorage.setItem(
                                      "BINGWA_TARGET_FLAG",
                                      ""
                                    ),
                                      clearInterval(n),
                                      console.log(
                                        "faction api refreshing ended"
                                      );
                                  else {
                                    window.localStorage.setItem(
                                      "BINGWA_TARGET_FLAG",
                                      "refreshing"
                                    );
                                    var t = `https://api.torn.com/faction/${e}?selections=basic&key=${x}`;
                                    const a = We("#bmw_target_tips");
                                    a.text("---Refreshing---"),
                                    fetch(t)
                                      .then(
                                        (t) =>
                                          t.ok
                                            ?t.json()
                                            : void a.text(
                                                "---Probe failed " + e + "---"
                                              ),
                                        (t) => {
                                          a.text("---Network exception " + e + "---");
                                          }
                                        )
                                        .then((t) => {
                                          console.log("faction api refreshed"),
                                            We.each(t.members, function (t, l) {
                                              We(".target-id").each(
                                                function () {
                                                  if (t == We(this).text()) {
                                                    var n =
                                                      l.last_action.status;
                                                    let t = Xe.yellow;
                                                    "Online" == n
                                                      ? (t = Xe.yellowgreen)
                                                      : "Offline" == n &&
                                                        (t = Xe.gray),
                                                      We(this)
                                                        .siblings(
                                                          ".target-online"
                                                        )
                                                        .css({
                                                          "background-color": t,
                                                          color: "white",
                                                        })
                                                        .text(n);
                                                    var i = ft(
                                                      l.last_action.timestamp
                                                    );
                                                    We(this)
                                                      .siblings(".target-last")
                                                      .attr(
                                                        "last-action-seconds",
                                                        i[0]
                                                      )
                                                      .attr(
                                                        "timestamp",
                                                        l.last_action.timestamp
                                                      )
                                                      .text(i[1]);
                                                    var o = ut(
                                                      l.status.description,
                                                      l.status.state,
                                                      l.status.until
                                                    );
                                                    let e =
                                                      "var(--default-bg-green-hover-color)";
                                                    "red" == l.status.color
                                                      ? (e =
                                                          "var(--default-bg-red-hover-color)")
                                                      : "blue" ==
                                                          l.status.color &&
                                                        (e =
                                                          "var(--default-bg-blue-hover-color)"),
                                                      We(this)
                                                        .siblings(
                                                          ".target-status"
                                                        )
                                                        .attr(
                                                          "hospital-seconds",
                                                          o[1]
                                                        )
                                                        .attr(
                                                          "hospital-location",
                                                          o[2]
                                                        )
                                                        .attr(
                                                          "description",
                                                          l.status.description
                                                        )
                                                        .attr(
                                                          "state",
                                                          l.status.state
                                                        )
                                                        .attr(
                                                          "until",
                                                          l.status.until
                                                        )
                                                        .css({
                                                          "background-color": e,
                                                          color:
                                                            "var(--default-color)",
                                                        })
                                                        .text(o[0]),
                                                      We(this)
                                                        .siblings(
                                                          ".target-level"
                                                        )
                                                        .text(l.level);
                                                    i = We(this)
                                                      .siblings(
                                                        ".target-fairfight"
                                                      )
                                                      .text();
                                                    if (i != isNaN) {
                                                      const s =
                                                        0.25 *
                                                        i *
                                                        (Math.log(l.level) + 1);
                                                      We(this)
                                                        .siblings(
                                                          ".target-flatrespect"
                                                        )
                                                        .text(s.toFixed(2));
                                                    }
                                                    let a = [];
                                                    const r =
                                                      We("#filters").find(
                                                        "[status='on']"
                                                      );
                                                    r.each(function () {
                                                      a.push(We(this).text());
                                                    });
                                                    i = (function (
                                                      t,
                                                      e,
                                                      a,
                                                      n,
                                                      i
                                                    ) {
                                                      let o = 1,
                                                        r = 1,
                                                        s = 1,
                                                        l = 1;
                                                      o = t.includes(e) ? 1 : 0;
                                                      r =
                                                        (t.includes("In town") &&
                                                        "town" == a) ||
                                                      (t.includes("Outside the city") &&
                                                          "oversea" == a)
                                                          ? 1
                                                          : 0;
                                                      s =
                                                        (t.includes(
                                                          "Hospitalization time<=5m"
                                                          ) &&
                                                            n <= 300) ||
                                                          (t. includes(
                                                            "Hospital time>5m"
                                                        ) &&
                                                          300 < n)
                                                          ? 1
                                                          : 0;
                                                      l =
                                                        (t.includes(
                                                          "FF>=2.0"
                                                        ) &&
                                                          2 <= i) ||
                                                        (t.includes("FF<2.0") &&
                                                          i < 2)
                                                          ? 1
                                                          : 0;
                                                      return o * r * s * l;
                                                    })(a, n, o[2], o[1], i);
                                                    0 == i
                                                      ? We(this)
                                                          .parent()
                                                          .addClass("hide")
                                                      : 1 == i &&
                                                        We(this)
                                                          .parent()
                                                          .removeClass("hide");
                                                  }
                                                }
                                              );
                                            });
                                        })
                                        .then(function () {
                                          return new Promise(function (t, e) {
                                            setTimeout(function () {
                                              t();
                                            }, 1e3);
                                          });
                                        })
                                        .then(function () {
                                          0 < We(".target-last").length &&
                                            (console.log("fake refresh 1"),
                                            We(".target-last").each(
                                              function () {
                                                var t =
                                                  We(this).attr("timestamp");
                                                if (null == t) return !0;
                                                t = ft(t);
                                                We(this)
                                                  .attr(
                                                    "last-action-seconds",
                                                    t[0]
                                                  )
                                                  .text(t[1]);
                                                t = ut(
                                                  We(this)
                                                    .siblings(".target-status")
                                                    .attr("description"),
                                                  We(this)
                                                    .siblings(".target-status")
                                                    .attr("state"),
                                                  We(this)
                                                    .siblings(".target-status")
                                                    .attr("until")
                                                );
                                                We(this)
                                                  .siblings(".target-status")
                                                  .attr(
                                                    "hospital-seconds",
                                                    t[1]
                                                  )
                                                  .text(t[0]);
                                              }
                                            ));
                                        })
                                        .then(function () {
                                          return new Promise(function (t, e) {
                                            setTimeout(function () {
                                              t();
                                            }, 1e3);
                                          });
                                        })
                                        .then(function () {
                                          0 < We(".target-last").length &&
                                            (console.log("fake refresh 2"),
                                            We(".target-last").each(
                                              function () {
                                                var t =
                                                  We(this).attr("timestamp");
                                                if (null == t) return !0;
                                                t = ft(t);
                                                We(this)
                                                  .attr(
                                                    "last-action-seconds",
                                                    t[0]
                                                  )
                                                  .text(t[1]);
                                                t = ut(
                                                  We(this)
                                                    .siblings(".target-status")
                                                    .attr("description"),
                                                  We(this)
                                                    .siblings(".target-status")
                                                    .attr("state"),
                                                  We(this)
                                                    .siblings(".target-status")
                                                    .attr("until")
                                                );
                                                We(this)
                                                  .siblings(".target-status")
                                                  .attr(
                                                    "hospital-seconds",
                                                    t[1]
                                                  )
                                                  .text(t[0]);
                                              }
                                            ));
                                        })
                                        .catch((t) =>
                                          console.log("fetch error", t)
                                        );
                                  }
                                })(t[0]);
                              }, 3e3));
                          })
                          .catch((t) => console.log("startRefreshing " + t))));
                  }
                  function r() {
                    var t = `https://api.torn.com/user/?selections=battlestats&key=${x}`;
                    const e = We("#bmw_target_tips");
                    e.text("---BS detection ---"),
                    fetch(t)
                      .then(
                        (t) =>
                          t.ok ? t.json() : void e.text("---BS detection failed---"),
                        (t) => {
                          e.text("---BS network exception---");
                          }
                        )
                        .then((l) => {
                          if (null != l)
                            if ("error" in l) e.text(l.error);
                            else {
                              const d =
                                Math.sqrt(l.strength) +
                                Math.sqrt(l.defense) +
                                Math.sqrt(l.speed) +
                                Math.sqrt(l.dexterity);
                              console.log("My score:" + d),
                                We(".target-fairfight").each(function () {
                                  var t = Vt(
                                      We(this).siblings(".target-str").text()
                                    ),
                                    e = Vt(
                                      We(this).siblings(".target-def").text()
                                    ),
                                    a = Vt(
                                      We(this).siblings(".target-spd").text()
                                    ),
                                    n = Vt(
                                      We(this).siblings(".target-dex").text()
                                    ),
                                    i = Vt(
                                      We(this).siblings(".target-total").text()
                                    );
                                  let o = (
                                    (((Math.sqrt(t) +
                                      Math.sqrt(e) +
                                      Math.sqrt(a) +
                                      Math.sqrt(n)) /
                                      d) *
                                      8) /
                                      3 +
                                    1
                                  ).toFixed(2);
                                  3 <= o && (o = (3).toFixed(2)),
                                    We(this).text(o);
                                  const r = i / l.total;
                                  i = r.toFixed(2);
                                  const s = We(this).siblings(".target-total");
                                  (1.3 <= r
                                    ? s.css(
                                        "color",
                                        "var(--default-base-important-color)"
                                      )
                                    : 1.1 <= r
                                    ? s.css("color", "var(--default-red-color)")
                                    : 0.9 <= r
                                    ? s.css(
                                        "color",
                                        "var(--default-base-brown-color)"
                                      )
                                    : 0.7 <= r
                                    ? s.css(
                                        "color",
                                        "var(--default-base-gold-color)"
                                      )
                                    : 0.5 <= r
                                    ? s.css(
                                        "color",
                                        "var(--default-base-green-color)"
                                      )
                                    : 0.3 <= r
                                    ? s.css(
                                        "color",
                                        "var(--default-green-color)"
                                      )
                                    : s.css(
                                        "color",
                                        "var(--default-base-grey1-color)"
                                      )
                                  ).attr("title", "is " + i + " times your attribute");
                                });
                            }
                          else e.text("error");
                        })
                        .catch((t) => console.log("fetch error", t));
                  }
                  function s(t) {
                    let e = `
<div id="filters" style="overflow:hidden;">
<div status="on" class="filter-button" style="cursor:pointer; margin:5px 0px 5px 20px; padding:6px; border:6px double #CFCFCF; float:left; background-color: #83a000; color: white; font-weight: bold;">Online</div>
<div status="on" class="filter-button" style="cursor:pointer; margin:5px 0px 5px 20px; padding:6px; border:6px double #CFCFCF; float:left; background-color: #F39826; color: white; font-weight: bold;">Idle</div>
<div status="on" class="filter-button" style="cursor:pointer; margin:5px 0px 5px 20px; padding:6px; border:6px double #CFCFCF; float:left; background-color: #ADADAD; color: white; font-weight: bold;">Offline</div>
<div status="on" class="filter-button" style="cursor:pointer; margin:5px 0px 5px 20px; padding:6px; border:6px double #CFCFCF; float:left; background-color: #8FBC8F; color: white; font-weight: bold;">in the city</div>
<div status="on" class="filter-button" style="cursor:pointer; margin:5px 0px 5px 20px; padding:6px; border:6px double #CFCFCF; float:left; background-color: #65A5D1; color: white; font-weight: bold;">outside the city</div>
<div status="on" class="filter-button" style="cursor:pointer; margin:5px 0px 5px 20px; padding:6px; border:6px double #CFCFCF; float:left; background-color: #8FBC8F; color: white; font-weight: bold;">hospital stay<=5m</div>
<div status="on" class="filter-button" style="cursor:pointer; margin:5px 0px 5px 20px; padding:6px; border:6px double #CFCFCF; float:left; background-color: #FF7373; color: white; font-weight: bold;">hospital stay>5m</div>
<div status="on" class="filter-button" style="cursor:pointer; margin:5px 0px 5px 20px; padding:6px; border:6px double #CFCFCF; float:left; background-color: #8FBC8F; color: white; font-weight: bold;">FF>=2.0</div>
<div status="on" class="filter-button" style="cursor:pointer; margin:5px 0px 5px 20px; padding:6px; border:6px double #CFCFCF; float:left; background-color: #FF7373; color: white; font-weight: bold;">FF<2.0</div>
</div>
<table style="margin: auto; background-color: var(--default-bg-panel-color)">
<tr>
<th style="border: 1px solid darkgray; padding: 5px; background-color: #725334; color: white; font-weight: bold; text-align: center;">Online</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: #725334; color: white; font-weight: bold; text-align: center;">Name</th>
<th class="head-last" style="border: 1px solid darkgray; padding: 5px; background-color: #725334; color: white; font-weight: bold; text-align: center;">Last</th>
<th class="head-status" style="border: 1px solid darkgray; padding: 5px; background-color: #725334; color: white; font-weight: bold; text-align: center;">Status</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: #033649; color: white; font-weight: bold; text-align: center;">Attack</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: #033649; color: white; font-weight: bold; text-align: center;" title="Fair fight factor">FF</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: #033649; color: white; font-weight: bold; text-align: center;">TOTAL</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: #033649; color: white; font-weight: bold; text-align: center;">ID</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: #033649; color: white; font-weight: bold; text-align: center;">Lvl</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: #033649; color: white; font-weight: bold; text-align: center;" title="basic face factor">FR</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: #033649; color: white; font-weight: bold; text-align: center;">Hint</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: #757947; color: white; font-weight: bold; text-align: center;">STR</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: #757947; color: white; font-weight: bold; text-align: center;">DEF</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: #757947; color: white; font-weight: bold; text-align: center;">SPD</th>
<th style="border: 1px solid darkgray; padding: 5px; background-color: #757947; color: white; font-weight: bold; text-align: center;">DEX</th>
</tr>
`;
                    for (var a in t) {
                      var n = (function (t, e, a) {
                        var n = [
                            "var(--default-bg-panel-color)",
                            "var(--default-color)",
                          ],
                          i = ["#008196", "#eee"];
                        let o = "",
                          r = [n, n, n, n];
                        return (
                          e + a < 0.33 * t
                            ? ((o = "Strength"), (r[0] = i), (r[2] = i))
                            : 0.15 * t < e - a
                            ? ((o = "Defense"), (r[1] = i))
                            : 0.15 * t < a - e
                            ? ((o = "Speed"), (r[3] = i))
                            : 0.67 * t < e + a &&
                              ((o = "Dexterity"), (r[1] = i), (r[3] = i)),
                          [o].concat(r)
                        );
                      })(t[a].TOTAL, t[a].DEF, t[a].DEX);
                      e += `
<tr>
<td class="target-online" style="border: 1px solid darkgray; padding: 5px; text-align: center;"></td>
<td class="target-name" style="border: 1px solid darkgray; padding: 5px; text-align: center;">
<a class="user name" href="/profiles.php?XID=${t[a].ID}" target="_blank">${
                        t[a].Name
                      }</a>
</td>
<td class="target-last" style="border: 1px solid darkgray; padding: 5px; color: var(--default-color); text-align: center;"></td>
<td class="target-status" style="border: 1px solid darkgray; padding: 5px; color: black; text-align: center;"></td>
<td class="target-attack t-blue" style="border: 1px solid darkgray; padding: 5px; color: black; text-align: center;">
<a href="/loader.php?sid=attack&user2ID=${
                        t[a].ID
                      }" style="text-decoration: none;" target="_blank">Attack</a>
</td>
<td class="target-fairfight" style="border: 1px solid darkgray; padding: 5px; color: var(--default-color); text-align: center;"></td>
<td class="target-total" style="border: 1px solid darkgray; padding: 5px; color: var(--default-color); text-align: center;">${
                        Vt(t[a].TOTAL) || 0
                      }</td>
<td class="target-id" style="border: 1px solid darkgray; padding: 5px; color: var(--default-color); text-align: right;">${
                        t[a].ID || ""
                      }</td>
<td class="target-level" style="border: 1px solid darkgray; padding: 5px; color: var(--default-color); text-align: center;"></td>
<td class="target-flatrespect" style="border: 1px solid darkgray; padding: 5px; color: var(--default-color); text-align: center;"></td>
<td class="target-hint" style="border: 1px solid darkgray; padding: 5px; color: var(--default-color); text-align: center;">${
                        n[0]
                      }</td>
<td class="target-str" style="border: 1px solid darkgray; padding: 5px; background-color: ${
                        n[1][0]
                      }; color: ${n[1][1]}; text-align: center;">${
                        Vt(t[a].STR) || 0
                      }</td>
<td class="target-def" style="border: 1px solid darkgray; padding: 5px; background-color: ${
                        n[2][0]
                      }; color: ${n[2][1]}; text-align: center;">${
                        Vt(t[a].DEF) || 0
                      }</td>
<td class="target-spd" style="border: 1px solid darkgray; padding: 5px; background-color: ${
                        n[3][0]
                      }; color: ${n[3][1]}; text-align: center;">${
                        Vt(t[a].SPD) || 0
                      }</td>
<td class="target-dex" style="border: 1px solid darkgray; padding: 5px; background-color: ${
                        n[4][0]
                      }; color: ${n[4][1]}; text-align: center;">${
                        Vt(t[a].DEX) || 0
                      }</td>
</tr>
`;
                    }
                    return (e += "</table>"), e;
                  }
                  0 < i.length
                    ? (console.log("target cache detected"),
                      We("#target-load-excel").prop("disabled", !0),
                      We("#file").prop("disabled", !0),
                      We("#target-clear-cache").removeAttr("disabled"),
                      We("#bmw_target_tips").text("loaded successfully"),
                      We("#bmw_target_wrapper").html(s(i)),
                      new Promise(function (t, e) {
                        setTimeout(function () {
                          console.log("3 Seconds"), t();
                        }, 3100);
                      })
                        .then(function () {
                          r(),
                            "refreshing" !=
                            window.localStorage.getItem("BINGWA_TARGET_FLAG")
                              ? o(i)
                              : alert("Another Ice Frog target page exists and is being refreshed");
                        })
                        .catch((t) => console.log("First Refresh " + t)))
                    : console.log("target cache not available"),
                    We(".filter-button").click(function () {
                      "on" == We(this).attr("status")
                        ? (We(this)
                            .css({
                              border: "6px solid #CFCFCF",
                              "font-weight": "normal",
                            })
                            .attr("status", "off"),
                          e(We(this).text(), "off"))
                        : (We(this)
                            .css({
                              border: "6px double #CFCFCF",
                              "font-weight": "bold",
                            })
                            .attr("status", "on"),
                          e(We(this).text(), "on"));
                    }),
                    We("#target-load-excel").click(function () {
                      "undefined" != typeof XLSX ||
                      1 ==
                        confirm(
                          "The xlsx support component is not detected, only csv format is supported, continue?"
                        )
                        ? document.getElementById("file").click()
                        : console.log("load cancelled");
                    }),
                    We("#file").change(function (a) {
                      var t,
                        e = a.target.files;
                      0 != e.length &&
                        ((t = e[0]),
                        (e = /\.(xlsx|csv)$/g.exec(t.name))
                          ? (function (t, o, r) {
                              const e = new FileReader();
                              (e.onload = function (t) {
                                var e,
                                  a = t.target.result;
                                let n;
                                if ("xlsx" === o) {
                                  if ("undefined" == typeof XLSX)
                                    return void alert("Does not support importing xlsx format files");
                                  n =
                                    ((e = (t = XLSX.read((e = a), {
                                      type: "binary",
                                    })).SheetNames),
                                    (e = t.Sheets[e[0]]),
                                    XLSX.utils.sheet_to_json(e));
                                } else {
                                  function i(t) {
                                    return "string" == typeof t ? Vt(t) : t;
                                  }
                                  "csv" === o &&
                                    (n = (function (t, e) {
                                      function a(t) {
                                        let e = 0,
                                          a = "";
                                        for (const n of t)
                                          '"' === n && 0 === e
                                            ? (e = 1)
                                            : '"' === n && 1 == e && (e = 0),
                                            "," === n && 0 === e
                                              ? (a += "|")
                                              : '"' !== n && (a += n);
                                        return a.split("|");
                                      }
                                      const n = t.split(/\r?\n/),
                                        i = a(n[0]),
                                        o = [];
                                      for (let t = 1; t < n.length - 1; t++) {
                                        var r = a(n[t]);
                                        const l = {};
                                        for (const d in i) {
                                          var s = i[d];
                                          e[s]
                                            ? (l[s] = e[s].call(null, r[d]))
                                            : (l[s] = r[d]);
                                        }
                                        o.push(l);
                                      }
                                      return o;
                                    })(a, {
                                      STR: i,
                                      DEF: i,
                                      SPD: i,
                                      DEX: i,
                                      TOTAL: i,
                                    }));
                                }
                                r && r(n);
                              }),
                                e.readAsBinaryString(t);
                            })(t, e[1], function (t) {
                              if (0 < t.length)
                                if (t[0].hasOwnProperty("Name"))
                                  if (t[0].hasOwnProperty("ID"))
                                    if (t[0].hasOwnProperty("STR"))
                                      if (t[0].hasOwnProperty("SPD"))
                                        if (t[0].hasOwnProperty("DEF"))
                                          if (t[0].hasOwnProperty("DEX"))
                                            if (t[0].hasOwnProperty("TOTAL")) {
                                              for (var e in t)
                                                t[e].Name &&
                                                  "string" !=
                                                    typeof t[e].Name &&
                                                  (t[e].Name =
                                                    t[e].Name.toString());
                                              We("#target-load-excel").prop(
                                                "disabled",
                                                !0
                                              ),
                                                We("#file").prop(
                                                  "disabled",
                                                  !0
                                                ),
                                                We(
                                                  "#target-clear-cache"
                                                ).removeAttr("disabled"),
                                                console.log(t),
                                                (a.target.value = ""),
                                                We("#bmw_target_tips").text(
                                                  "loaded successfully"
                                                ),
                                                We("#bmw_target_wrapper").html(
                                                  s(t)
                                                ),
                                                window.localStorage.setItem(
                                                  "BINGWA_TARGET",
                                                  JSON.stringify(t)
                                                ),
                                                new Promise(function (t, e) {
                                                  setTimeout(function () {
                                                    console.log("3 Seconds"),
                                                      t();
                                                  }, 3100);
                                                })
                                                  .then(function () {
                                                    r(),
                                                      "refreshing" !=
                                                      window.localStorage.getItem(
                                                        "BINGWA_TARGET_FLAG"
                                                      )
                                                        ? o(t)
                                                        : alert(
                                                            "Another Ice Frog target page exists and is being refreshed"
                                                            );
                                                    })
                                                    .catch((t) =>
                                                      console. log(
                                                        "First Refresh " + t
                                                      )
                                                    );
                                              } else
                                                alert(
                                                  "There is no TOTAL in the table, modify the table and refresh the page and try again"
                                              );
                                          else
                                            alert(
                                              "There is no DEX in the table, modify the table and refresh the page and try again"
                                              );
                                          else
                                            alert(
                                              "There is no DEF in the table, modify the table and refresh the page and try again"
                                          );
                                      else
                                        alert(
                                          "There is no SPD in the table, modify the table and refresh the page and try again"
                                          );
                                      else
                                        alert(
                                          "There is no STR in the table, modify the table and refresh the page and try again"
                                        );
                                    else
                                      alert(
                                        "There is no ID in the table, modify the table and refresh the page and try again"
                                    );
                                else
                                  alert(
                                    "There is no Name in the table, modify the table and refresh the page and try again"
                                    );
                                else
                                  alert(
                                    "There is no data in the table, modify the table and refresh the page and try again"
                                  );
                              })
                            : alert("Only supports reading xlsx or csv format!"));
                    }),
                    We("#target-clear-cache").click(function () {
                      1 == confirm("Are you sure to clear cache? ")
                        ? (We("#target-load-excel").removeAttr("disabled"),
                          We("#file").removeAttr("disabled"),
                          We("#target-clear-cache").prop("disabled", !0),
                          We("#bmw_target_wrapper").empty(),
                          We("#bmw_target_tips").text("no data"),
                          window.localStorage.removeItem("BINGWA_TARGET"),
                          (i = {}),
                          window.localStorage.setItem("BINGWA_TARGET_FLAG", ""),
                          clearInterval(n),
                          console.log("faction api refreshing ended"))
                        : console.log("clear cancelled");
                    });
                }),
                We("#bwm-settings").click(function () {
                  We("#bwm").children(":last").remove(),
                    We("#bwm").append(
                      (function () {
                        let e = "";
                        return (
                          Ge.forEach((t) => {
                            e += `
<tr style="height: 32px;">
<td style="border:3px solid darkgray;padding:10px;color:#333;background-color:#ccc">${t.title}</td>
<td style="border:3px solid darkgray;padding:10px;color:#333;background-color:#ccc">${t.desc}</td>
<td style="border:3px solid darkgray;padding:10px;color:#333;background-color:#ccc">
<select id="bwm_settings_${t.name}">
<option value="false">False</option>
<option value="true">True</option>
</select>
</td>
</tr>
`;
                          }),
                          `
<div id="bwm_settings_container" style="width: inherit">
<div id="bwm_settings_header" style="text-align:center; margin-bottom: 10px;">
<table style="margin: auto">
<tr>
<td style="padding: 10px;">
<span class="border-round" style="font-size: large; color: #333; background-color:#ccc; padding:5px;border:3px solid #333;">set up</span>
</td>
</tr>
</table>
</div>
<div id="bwm_settings_table" style="text-align:center; margin-bottom: 10px;">
<table style="border:1px solid darkgray; padding: 5px; margin: auto">
<tr style="height: 32px;">
<th style="border:3px solid darkgray;padding:10px;color:#ccc;background-color:#111;">function name</th>
<th style="border:3px solid darkgray;padding:10px;color:#ccc;background-color:#111;">description</th>
<th style="border:3px solid darkgray;padding:10px;color:#ccc;background-color:#111;">status</th>
</tr>
${e}
</table>
</div>
</div>
`
                        );
                      })()
                    ),
                    b("#bwm-settings"),
                    Ge.forEach((t) => {
                      We(`#bwm_settings_${t.name}`).val(
                        le("BWM_SETTINGS", t.name)
                      ),
                        We(`#bwm_settings_${t.name}`).change(function () {
                          ce("BWM_SETTINGS", t.name, We(this).val());
                        }),
                        (window[t.name] = "true" == le("BWM_SETTINGS", t.name));
                    });
                }),
                We("#bwm-chatlog").click(function () {
                  We("#bwm").children(":last").remove(),
                    We("#bwm").append(`
<div id="chatlog_container" style="width: inherit">
<div id="chatlog_header" style="margin: 10px 0px; border: 1px solid darkgray; text-align: center;">
<span style="font-size: large;">Chat Vault</span>
</div>
<div id="chatlog" style="min-height:400px;margin:10px 0px; border:1px solid darkgray;  text-align:center;overflow:hidden; overflow-x: auto;"></div>
</div>`),
                    b("#bwm-chatlog");
                  const t = (function () {
                    var t = window.localStorage.getItem("CHAT_LAST_MESSAGE");
                    if (null != t) {
                      var o = JSON.parse(t);
                      let i = [];
                      for (const d in o) {
                        const c = o[d];
                        let t = "",
                          e = "";
                        0 <= c.indexOf("|||")
                          ? ((t = c.split("|||")[0]), (e = c.split("|||")[1]))
                          : (t = c);
                        var r = ke(t),
                          s = new Date(1e3 * r).toLocaleString(),
                          l = parseInt(new Date().getTime() / 1e3) - r;
                        let a = "",
                          n = "";
                        l < 3600
                          ? ((a = parseInt(l / 60) + "m"), (n = "#5d9525"))
                          : 3600 <= l && l < 86400
                          ? ((a = parseInt(l / 3600) + "h"), (n = "#DAA520"))
                          : 86400 <= l && l < 3024e3
                          ? ((a = parseInt(l / 86400) + "d"), (n = "#c0542f"))
                          : 3024e3 <= l &&
                            ((a = parseInt(l / 86400) + "d"), (n = "#777")),
                          i.push({
                            chat_ts: r,
                            chat_beijing: s,
                            username: d,
                            diff_ts_format: a,
                            diff_ts_color: n,
                            last_message: e,
                          });
                      }
                      return i;
                    }
                  })();
                  if (void 0 !== t) {
                    var e = t.sort(function (t, e) {
                      return e.chat_ts - t.chat_ts;
                    });
                    let a = `
<table id="chatlog-table" style=" background-color: white; font-size:12px; margin: auto;">
<tr class=chatlog-table-head">
<th class="chatlog-time">last chat time</th>
<th class="chatlog-name">player</th>
<th class="chatlog-last">Time</th>
<th class="chatlog-message">last 5 messages</th>
</tr>`;
                    We.each(e, function (t, e) {
                      a += `
<tr class=chatlog-table-content">
<td class="chatlog-time">${e.chat_beijing}</td>
<td class="chatlog-name">${e.username}</td>
<td class="chatlog-last" style="color:white;background-color:${e.diff_ts_color}">${e.diff_ts_format}</td>
<td class="chatlog-message">${e.last_message}</td>
</tr>`;
                    }),
                      (a += "</table>"),
                      We("#chatlog").append(a),
                      We("#chatlog-table")
                        .find("th")
                        .attr(
                          "style",
                          "border: 1px solid darkgray;padding: 5px;background-color: black;color: white;font-weight: bold;text-align:center;"
                        ),
                      We("#chatlog-table")
                        .find("td")
                        .css({
                          border: "1px solid darkgray",
                          padding: "5px",
                          "text-align": "center",
                        });
                  }
                }),
                We("#bwm-mug").click(function () {
                  We("#bwm").children(":last").remove(),
                    We("#bwm").append(`
<div id="mug_container" style="width: inherit">
<div id="mug-head" style="margin:10px 0px; border:1px solid darkgray; text-align:center;">
<input type="text" id="mug-watchlist-id-input" placeholder="Sheep ID" size="10" style="font-size: larger; padding: 5px; margin: 5px;" />
<button id="mug-watchlist-add-input" class="torn-btn" style="margin: 5px;">join watch</button>
</div>
<div id="mug-watchlist" style="margin:10px 0px; border:1px solid darkgray;  text-align:center;overflow:hidden;"></div>
<div id="mug-loglist" style="min-height:400px;margin:10px 0px; border:1px solid darkgray;  text-align:center;overflow:hidden; overflow-x: auto;"></div>
</div>`),
                    b("#bwm-mug");
                  let o = {};
                  function a() {
                    var t = window.localStorage.getItem("muglog-watchlist");
                    if (null != t) {
                      var a,
                        n = JSON.parse(t);
                      let e = `
<table id="mug-watchlist-table" style=" background-color: white; font-size:12px; margin:auto;"><tr class="mug-watchlist-table-head"><th>Victim ID</th><th>Victim Name</th><th>Total Mugged</th><th>delete</th></tr>`;
                      for (a in n) {
                        let t = "$0";
                        a in o && (t = Yt(o[a].amount)),
                          (e += `
<tr class="mug-watchlist-table-content">
<td class="mug-watchlsit-victimid">${a}</td>
<td><a class="user name" href="/profiles.php?XID=${a}" target="_blank">${n[a].name}</a></td>
<td>${t}</td>
<td><a class="mug-watchlist-delete" role="button" style="cursor: pointer; color: darkblue;">delete</a></td>
</tr>`);
                      }
                      (e += "</table>"),
                        We("#mug-watchlist").append(e),
                        We("#mug-watchlist-table")
                          .find("th")
                          .attr(
                            "style",
                            "border: 1px solid darkgray;padding: 5px;background-color: black;color: white;font-weight: bold;text-align:center;"
                          ),
                        We("#mug-watchlist-table")
                          .find("td")
                          .attr(
                            "style",
                            "border: 1px solid darkgray;padding:5px;text-align:center;"
                          );
                    }
                    We(".mug-watchlist-delete").click(function () {
                      var t = We(this)
                        .parent()
                        .parent()
                        .children(".mug-watchlsit-victimid")
                        .text();
                      pe("muglog-watchlist", t),
                        We(this).parent().parent().remove(),
                        console.log("successfully deleted " + t);
                    });
                  }
                  !(function () {
                    var e = window.localStorage.getItem("muglog");
                    if (null != e) {
                      var a,
                        n = JSON.parse(e);
                      let t = "</table>";
                      for (a in n) {
                        var i = n[a].victim_id;
                        i in o
                          ? (o[i].amount += Yt(n[a].money_mugged))
                          : (o[i] = {
                              name: n[a].victim_name,
                              amount: Yt(n[a].money_mugged),
                            }),
                          (t =
                            `
<tr class="mug-loglist-table-content">
<td class="mug-loglist-ts">${a}</td>
<td class="mug-loglist-time">${n[a].timestring}</td>
<td class="mug-loglist-victimid">${n[a].victim_id}</td>
<td class="mug-loglist-victimname"><a class="user name" href="/profiles.php?XID=${n[a].victim_id}" target="_blank">${n[a].victim_name}</a></td>
<td class="mug-loglist-amount" title="${n[a].timestring}">${n[a].money_mugged}</td>
<td><a class="mug-loglist-watch" role="button" style="cursor: pointer; color: darkblue;">Monitor</a></td>
<td><a class="mug-loglist-delete" role="button" style="cursor: pointer; color: darkblue;">Delete</a></td>
</tr>` + t);
                      }
                      (t =
                        `
<table id="mug-loglist-table" style=" background-color: white; font-size:12px; margin: auto;">
<tr class="mug-loglist-table-head">
<th class="mug-loglist-ts">Timestamp</th>
<th class="mug-loglist-time">Time</th>
<th class="mug-loglist-victimid">Victim ID</th>
<th class="mug-loglist-victimname">Victim Name</th>
<th class="mug-loglist-amount">Money Mugged</th>
<th>monitor</th><th>delete</th>
</tr>` + t),
                        We("#mug-loglist").append(t);
                    }
                    We("#mug-loglist-table")
                      .find("th")
                      .attr(
                        "style",
                        "border: 1px solid darkgray;padding: 5px;background-color: black;color: white;font-weight: bold;text-align:center;"
                      ),
                      We("#mug-loglist-table")
                        .find("td")
                        .attr(
                          "style",
                          "border: 1px solid darkgray;padding:5px;text-align:center;"
                        ),
                      We("#mug_container")[0].clientWidth < 400 &&
                        (We(".mug-loglist-ts").hide(),
                        We(".mug-loglist-victimid").hide(),
                        We(".mug-loglist-time").hide());
                  })(),
                    a(),
                    We(".mug-loglist-delete").click(function () {
                      var t = We(this)
                        .parent()
                        .parent()
                        .children(".mug-loglist-ts")
                        .text();
                      pe("muglog", t),
                        We(this).parent().parent().remove(),
                        console.log("successfully deleted " + t);
                    }),
                    We(".mug-loglist-watch").click(function () {
                      var t = We(this)
                        .parent()
                        .parent()
                        .children(".mug-loglist-victimid")
                        .text();
                      ce("muglog-watchlist", t, {
                        name: We(this)
                          .parent()
                          .parent()
                          .children(".mug-loglist-victimname")
                          .text(),
                      }),
                        We("#mug-watchlist-table").remove(),
                        a(),
                        console.log("monitoring success " + t);
                    }),
                    We("#mug-watchlist-add-input").click(function () {
                      const e = We("#mug-watchlist-id-input").val();
                      var t;
                      isNaN(e) || 0 == e || "" == e
                        ? alert("invalid ID")
                        : ((t = `https://api.torn.com/user/${e}?selections=profile&key=${x}`),
                          fetch(t)
                            .then((t) => t.json())
                            .then((t) => {
                              if (
                                (console.log("API fetched"),
                                null != t.error && 6 == t.error.code)
                              )
                                throw (
                                  (alert("invalid ID " + e),
                                  new Error("Incorrect ID"))
                                );
                              ce("muglog-watchlist", e, { name: t.name }),
                                We("#mug-watchlist-table").remove(),
                                a(),
                                alert("Monitoring succeeded " + t.name + "[" + e + "]"),
                                console. log(
                                  "Surveillance successful " + t.name + "[" + e + "]"
                                );
                            })
                            .catch((t) =>
                              console.log("fetch error: ", t.message)
                            ));
                    });
                }),
                We("#bwm-return").click(function () {
                  We("#bwm").remove(),
                    We("#sidebarroot").show(),
                    We(".content-wrapper").show();
                }),
                We("#bwm-revive").click(function () {
                  We("#bwm").children(":last").remove(),
                    We("#bwm").append(`
<div id="bwm_revive_container" style="width: inherit">
<div id="bwm_revive_header" style="margin:10px 0px; border:1px solid darkgray; text-align:center;">
<input type="text" id="faction-input-id" name="faction-input-id" placeholder="faction separated by commas" size="30" style="font-size: larger; padding: 5px; margin: 5px;" />
<button id="revive-start-btn" class="torn-btn" style="margin:5px;">start to resurrect</button>
<button id="revive-stop-btn" class="torn-btn" style="margin:5px;" disabled>stop resurrection</button>
</div>
<div id="bwm_revive_filter" style="margin:10px 0px; border:1px solid darkgray; text-align:center; overflow: hidden;">
<div style="display: inline; margin:0px 15px;">
<span>every refresh interval</span>
<select id="bwm_revive_delay" style="padding:1px 0px;margin:8px 3px;">
<option value="1" selected>1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="5">5</option>
<option value="10">10</option>
</select>
<span>Second</span>
</div>
<div style="display: inline; margin:0px 15px;">
<span>Only show Online</span>
<select id="bwm_revive_online_only" style="padding:1px 0px;margin:8px 3px;">
<option value="false" selected>no</option>
<option value="true">yes</option>
</select>
</div>
<div style="display: inline; margin:0px 15px;">
<span>Only show Hospitalized</span>
<select id="bwm_revive_hosp_only" style="padding:1px 0px;margin:8px 3px;">
<option value="false" selected>No</option>
<option value="true">Yes</option>
</select>
</div>
<div style="display: inline; margin:0px 15px;">
<span>Only displayed in the city</span>
<select id="bwm_revive_town_only" style="padding:1px 0px;margin:8px 3px;">
<option value="false">No</option>
<option value="true" selected>Yes</option>
</select>
</div>
</div>
<div id="bmw_revive_tips" style="text-align:center; margin-bottom: 3px; font-size: 4px;"></div>
<div id="bmw_revive_wrapper" style="min-height:700px;margin:10px 0px; border:1px solid darkgray;  text-align:center;overflow:hidden;">
</div>
</div>`),
                    b("#bwm-revive");
                  let d = !0,
                    c = 0,
                    m = 1;
                  We("#revive-start-btn").click(function () {
                    We("#bmw_revive_wrapper").empty(),
                      We("#revive-start-btn").prop("disabled", !0),
                      We("#revive-stop-btn").removeAttr("disabled"),
                      We("#faction-input-id").prop("disabled", !0),
                      We("#bwm_revive_delay").prop("disabled", !0),
                      We("#bwm_revive_online_only").prop("disabled", !0),
                      We("#bwm_revive_hosp_only").prop("disabled", !0),
                      We("#bwm_revive_town_only").prop("disabled", !0),
                      We("#bmw_revive_tips").text("About to start refreshing......"),
                      (d = !0),
                      (m = 1);
                    const t = We("#faction-input-id")
                        .val()
                        .trim()
                        .split(/,|，/)
                        .map(function (t, e, a) {
                          return t.trim();
                        }),
                      s = t.length || 1;
                    let e = new Array(s).fill(null);
                    const l = 1e3 * We("#bwm_revive_delay").val();
                    let f = "";
                    "true" == We("#bwm_revive_online_only").val() &&
                      (f = "Online");
                    let u = "";
                    "true" == We("#bwm_revive_hosp_only").val() &&
                      (u = "Hospitalized");
                    let b = "";
                    "true" == We("#bwm_revive_town_only").val() && (b = "town"),
                      (c = setTimeout(() => {
                        !(function e(a, n, i) {
                          if (0 == d || 0 == We("#bmw_revive_wrapper").length)
                            We("#bmw_revive_wrapper")
                              .children(":last")
                              .remove(),
                              We("#bmw_revive_wrapper").append(
                                `<div style="overflow: hidden;"><div class="border-round" style="float: left; width:200px; padding: 2px 4px; margin: 2px 4px; background-color: ${
                                  Xe.purple
                                }; color: white;">Refresh is complete ${
                                  m - 1
                                } refres</div></div>`
                              );
                          else {
                            const h = a[i];
                            let t = 0;
                            i < a.length - 1 && (t = i + 1);
                            const g = n[i];
                            var o = `https://api.torn.com/faction/${h}?selections=basic&key=${x}`;
                            const r = We("#bmw_revive_tips");
                            r.text("---detection " + h + "---"),
                              fetch(o)
                                .then(
                                  (t) =>
                                    t.ok
                                      ? t.json()
                                      : void r.text("---probe failed " + h + "---"),
                                      (t) => {
                                        r.text("---Network exception " + h + "---");
                                  }
                                )
                                .then((p) => {
                                  console.log(
                                    `faction: ${h} | delay: ${
                                      l / 1e3
                                    }s | online: ${We(
                                      "#bwm_revive_online_only"
                                    ).val()} | hosp: ${We(
                                      "#bwm_revive_hosp_only"
                                    ).val()} | town: ${We(
                                      "#bwm_revive_town_only"
                                    ).val()}`
                                  ),
                                    (n[i] = p),
                                    We("#bmw_revive_wrapper")
                                      .children(":last")
                                      .remove(),
                                    We.each(p.members, function (t, e) {
                                      const a = e.last_action.status;
                                      let n = Xe.yellow;
                                      "Online" == a
                                        ? (n = Xe.green)
                                        : "Offline" == a && (n = Xe.gray);
                                      var i = ft(e.last_action.timestamp),
                                        o = e.status.description;
                                      const r = e.status.details,
                                        s = e.status.state;
                                      var l = e.status.until,
                                        d = e.status.color;
                                      const c = ut(o, s, l);
                                      var i = `
<div style="overflow: hidden;">
<div class="border-round" style="float: left; width:80px; padding: 2px 4px; margin: 2px 4px; background-color: ${Xe.purple}; color: white;">Refresh ${m}</div>
<div class="border-round" style="float: left; width:35px; padding: 2px 4px; margin: 2px 4px; background-color: ${n}; color: white;">${a}</div>
<div class="border-round" style="float: left; width:35px; padding: 2px 4px; margin: 2px 4px; background-color: ${Xe.pink};">
<a href="/factions.php?step=profile&ID=${h}" style="text-decoration: none; color: white;" target="_blank">${p.tag}</a>
</div>
<div class="border-round" style="float: left; width:90px; padding: 2px 4px; margin: 2px 4px; background-color: ${Xe.blue};">
<a href="/profiles.php?XID=${t}" style="text-decoration: none; color: white;" target="_blank">${e.name}</a>
</div>
<div class="border-round" style="float: left; width:100px; padding: 2px 4px; margin: 2px 4px; background-color: ${Xe.green}; color: white;">Last Online ${i[1]}</div>
<div class="border-round" style="float: left; width:100px; padding: 2px 4px; margin: 2px 4px; background-color: ${Xe.red}; color: white;">Admission time ${c[0]}</div>
<div class="border-round" style="float: left; width:300px; padding: 2px 4px; margin: 2px 4px; color:#ccc;background-color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${r}</div>
</div>`;
                                      0 == s.indexOf("Hospital") &&
                                        (0 != a.indexOf(f) ||
                                          0 != r.indexOf(u) ||
                                          0 != c[2].indexOf(b) ||
                                          (null != g &&
                                            g.members[t].status.until == l) ||
                                          We("#bmw_revive_wrapper").append(i));
                                    }),
                                    (m += 1),
                                    We("#bmw_revive_wrapper").append(
                                      `<div style="overflow: hidden;"><div class="border-round" style="float: left; width:80px; padding: 2px 4px; margin: 2px 4px; background-color: ${Xe.purple}; color: white;">Refresh ${m}</div></div>`
                                    ),
                                    (c = setTimeout(() => {
                                      e(a, n, t);
                                    }, l * s));
                                })
                                .catch((t) => console.log("fetch error", t));
                          }
                        })(t, e, 0);
                      }, l * s));
                  }),
                    We("#revive-stop-btn").click(function () {
                      (d = !1),
                        clearTimeout(c),
                        We("#revive-stop-btn").prop("disabled", !0),
                        setTimeout(() => {
                          We("#revive-start-btn").removeAttr("disabled"),
                            We("#faction-input-id").removeAttr("disabled"),
                            We("#bwm_revive_delay").removeAttr("disabled"),
                            We("#bwm_revive_online_only").removeAttr(
                              "disabled"
                            ),
                            We("#bwm_revive_hosp_only").removeAttr("disabled"),
                            We("#bwm_revive_town_only").removeAttr("disabled"),
                            We("#bmw_revive_wrapper")
                              .children(":last")
                              .remove(),
                            We("#bmw_revive_wrapper").append(
                              `<div style="overflow: hidden;"><div class="border-round" style="float: left; width:200px; padding: 2px 4px; margin: 2px 4px; background-color: ${
                                Xe.purple
                              }; color: white;">Refresh is complete ${
                                m - 1
                              } refresh</div></div>`
                            );
                        }, 1e3);
                    });
                }),
                We("#bwm-crimeexp").click(function () {
                  function d(t, e) {
                    We("#crimeexp-status").text(t),
                      We("#crimeexp-status").css("color", e ? "red" : "");
                  }
                  We("#bwm").children(":last").remove(),
                    We("#bwm").append(`
<div style="width: inherit">
<div style="margin:10px 0px; border:1px solid darkgray; text-align:center;">
<button id="crimeexp-start-btn" class="torn-btn" style="margin:5px;">Read logs (very slow, please be patient)</button>
</div>
<div style="min-height: 300px; margin:10px 0px; border:1px solid darkgray; text-align:center; overflow:hidden; overflow-x: auto;">
<table id="crimeexp-table" style="margin: 5px auto; background-color: white; font-size: 12px; text-align: right;">
</table>
<div id="crimeexp-status" style="text-align: center; margin: 5px;"></div>
</div>
<div style="margin:10px 0px; padding: 10px; font-size: 100%; line-height: 1.6; color: #333; border:1px solid darkgray; overflow:hidden; overflow-x: auto;">
<p style="font-size: larger"><b>Help Ice Frog Improve Criminal Experience Algorithm</b></p>
<p>1. <a href="/page.php?sid=log&log=5700,5710,5705,5715,5735,5725,5720,5730,6791,5360,5362,8965,6531,8842,8843,6253 ,6720,6722,6723,6243,6260,6262,6275,5100,4955">Click here to jump to the log page</a></p>
<p>2. Click the "<b>Export Selected Log</b>" button on the log page, and wait patiently. After completion, click the button again to save the data to a file</p>
<p>3. Send the exported file to tobytorn via QQ [1617955]</p>
<br />
<p style="font-size: larger"><b>What data is included in this log? </b></p>
<p title="Log Type: 5700, 5710, 5705, 5715, 5735, 5725, 5720, 5730">* Criminal Record</p>
<p title="Log Type: 6791">* OC Log</p>
<p title="Log Type: 5360, 5362">* Bust Log</p>
<p title="Log type: 8965">* Black egg pickup record in Easter egg hunting event</p>
<p title="Log type: 6531">* Work stunts to obtain criminal experience records</p>
<p title="Log type: 8842, 8843">* Nerve Bar upper limit change record</p>
<p title="Log type: 6253, 6720, 6722, 6723">* Gang entry and exit records</p>
<p title="Log type: 6243, 6260, 6262, 6275">* Company entry and exit records</p>
<p title="Log type: 5100, 4955">* Merit usage and reset</p>
</div>
</div>`),
                    b("#bwm-crimeexp"),
                    We("#crimeexp-start-btn").click(async function () {
                      We("#crimeexp-start-btn").prop("disabled", !0),
                        We("#crimeexp-table").html(`<tbody>
<tr><th>Current NNB</th><td id="crimeexp-curr-nnb">-</td></tr>
<tr><th>Current experience</th><td id="crimeexp-curr-ce">-</td></tr>
<tr><th>Current Time</th><td id="crimeexp-curr-time">-</td></tr>
<tr><th>Last <span class="crimeexp-last-upgrade-type">upgrade</span> time</th><td id="crimeexp-last-upgrade-time">-</td ></tr>
<tr><th>Upgrade progress</th><td id="crimeexp-upgrade-progress">-</td></tr>
<tr title="The average of the last three days, except OC"><th>Daily experience</th><td id="crimeexp-daily-ce">-</td></tr>
<tr><th>Estimated <span class="crimeexp-next-upgrade-type">upgrade</span> days</th><td id="crimeexp-upgrade-est">-</td>< /tr>
<tr><th>formula version</th><td>3.0.9</td></tr>
</tbody>`),
                        We("#crimeexp-table").tooltip({
                          tooltipClass: "white-tooltip",
                        }),
                        We("#crimeexp-table th").attr(
                          "style",
                          "border: 1px solid darkgray; padding: 5px; font-weight: bold;"
                        ),
                        We("#crimeexp-table td").attr(
                          "style",
                          "border: 1px solid darkgray; padding: 5px; min-width: 6em"
                        );
                      try {
                        var e = Math.floor(new Date().getTime() / 1e3);
                        We("#crimeexp-curr-time").text(
                          new Date(1e3 * e).format("yyyy-MM-dd")
                        ),
                          d("Reading current NNB");
                        var a = await (async function () {
                          var t = await (
                            await fetch(
                              `https://api.torn.com/user/?selections=perks&key=${x}`
                            )
                          ).json();
                          if ("error" in t) throw new Error(t.error.error);
                          var e = Object.values(t)
                              .flat()
                              .filter((t) => t.match(/Maximum nerve/i))
                              .map((t) => parseInt(t.match(/\d+/)[0]))
                              .reduce((t, e) => t + e, 0),
                            t = await (
                              await fetch(
                                `https://api.torn.com/user/?selections=bars&key=${x}`
                              )
                            ).json();
                          if ("error" in t) throw new Error(t.error.error);
                          t = t.nerve.maximum;
                          return t - e;
                        })();
                        We("#crimeexp-curr-nnb").text(a);
                        var n,
                          i,
                          o = await (async function (t) {
                            const e = await we(
                                [],
                                [8842, 8843, 4955],
                                null,
                                null,
                                t
                              ),
                              a = new Set(
                                e
                                  .filter((t) => 4955 === t.log)
                                  .map((t) => t.timestamp)
                              ),
                              n = [];
                            for (let t = 0; t < e.length; t++) {
                              var i,
                                o,
                                r,
                                s = e[t].timestamp;
                              a.has(s) ||
                                ((i =
                                  e[t].data.maximum_nerve_after -
                                  e[t].data.maximum_nerve_before),
                                5 === Math.abs(i) &&
                                  ((o =
                                    0 < t
                                      ? Math.abs(e[t - 1].timestamp - s)
                                      : 600),
                                  (r =
                                    t < e.length - 1
                                      ? Math.abs(e[t + 1].timestamp - s)
                                      : 600),
                                  o < 600 ||
                                    r < 600 ||
                                    n.push({ timestamp: s, diff: i })));
                            }
                            return n;
                          })((t) => {
                            d(
                              `Reading NNB changelog (${new Date(
                                1e3 * t
                              ).format("yyyy-MM-dd")})`
                            );
                          }),
                          r = await (async function (a, t, e) {
                            const n = new Set([5720, 5725, 5730, 5735]),
                              i = [],
                              o = ve(
                                [],
                                [
                                  5700, 5705, 5710, 5715, 5720, 5725, 5730,
                                  5735, 6791,
                                ],
                                null,
                                t,
                                e
                              );
                            for await (const l of o) {
                              let t = "unknown";
                              if (6791 === l.log)
                                t = {
                                  1: "OC-Blackmail",
                                  2: "OC-Kidnapping",
                                  3: "OC-Bomb",
                                  4: "OC-PR",
                                  5: "OC-MT",
                                  6: "OC-CL",
                                  7: "OC-PH",
                                  8: "OC-PA",
                                }[l.data.crime];
                              else {
                                const d = [
                                  1, 7, 17, 29, 34, 39, 47, 53, 58, 62, 69, 72,
                                  74, 77, 81, 83, 85,
                                ];
                                var r =
                                    d.findIndex((t) => t > l.data.crime) + 1,
                                  s = l.data.crime - d[r - 2] + 1;
                                t = `${r}-${s}`;
                              }
                              let e = "unknown";
                              5700 === l.log
                                ? (e = "fail")
                                : 5705 === l.log
                                ? (e = "jail")
                                : 5710 === l.log
                                ? (e = "hospital")
                                : 5715 === l.log
                                ? (e = "money_loss")
                                : n.has(l.log)
                                ? (e = "success")
                                : 6791 === l.log &&
                                  (e =
                                    "success" === l.data.result
                                      ? "success"
                                      : "fail");
                              s = {
                                timestamp: l.timestamp,
                                crime_name: t,
                                result: e,
                              };
                              if ((i.push(s), l.timestamp <= a[0].timestamp))
                                break;
                              for (
                                ;
                                0 < a.length &&
                                l.timestamp < a[0].timestamp - 1;

                              )
                                a.shift();
                            }
                            return i;
                          })(o, e, (t) => {
                            d(
                              `Reading crime log (${new Date(1e3 * t).format(
                                "yyyy-MM-dd"
                              )})`
                            );
                          });
                        if (0 === o.length)
                          return void d(
                            "Oops! Can't find the time of the last NNB change, can't calculate current experience",
                            !0
                          );
                        We("#crimeexp-last-upgrade-time").text(
                          new Date(1e3 * o[0].timestamp).format("yyyy-MM-dd")
                        );
                        let t = c[a];
                        o[0].diff < 0 &&
                          ((t = c[a + 5]),
                          We(".crimeexp-last-upgrade-type").text("downgrade"),
                          We(".crimeexp-last-upgrade-type").css(
                            "color",
                            "red"
                          ));
                        const { ce: s, daily_ce: l } = (function (t, e, a) {
                          let n = t,
                            i = 0;
                          for (const o of e) {
                            let t = (function (t) {
                              let e = 0;
                              const { crime_name: a, result: n } = t;
                              e = a.startsWith("OC")
                                ? {
                                    "OC-PR": 4,
                                    "OC-MT": 12,
                                    "OC-CL": 73,
                                    "OC-PH": 144,
                                    "OC-PA": 652,
                                  }[a] || 0
                                : a.startsWith("2-")
                                ? 0.025
                                : a.startsWith("3-")
                                ? 0.05
                                : a.startsWith("4-")
                                ? 0.111
                                : ((e = {
                                    "7-2": 0.333,
                                    "8-1": 0.2,
                                    "8-2": 0.3,
                                    "8-3": 0.3,
                                    "8-4": 0.3,
                                    "8-5": 0.2,
                                    "8-6": 0.3,
                                    "9-5": 0.5,
                                    "10-4": 0.666,
                                    "11-5": 1,
                                    "11-6": 1,
                                    "12-1": 0.666,
                                    "12-2": 0.3,
                                    "12-3": 0.3,
                                    "13-1": 0.6,
                                    "13-2": 0.7,
                                    "14-1": 0.6,
                                    "14-2": 0.8,
                                    "14-3": 0.7,
                                    "15-1": 1.7,
                                    "15-2": 2,
                                    "15-3": 1.9,
                                    "15-4": 1.9,
                                    "16-1": 1.7,
                                    "16-2": 2.6,
                                    "17-1": 2.8,
                                    "17-2": 2.9,
                                    "18-1": 0.7,
                                    "18-2": 1.9,
                                  }[a]),
                                  void 0 === e ? 0.2 : e);
                              return "success" === n
                                ? e
                                : "jail" === n ||
                                  ("hospital" === n && a.startsWith("15-"))
                                ? -20 * e
                                : 0;
                            })(o);
                            t < 0 &&
                              (t =
                                o.timestamp <= 1603152e3
                                  ? -0.01 * n
                                  : Math.max(t, -0.01 * n)),
                              (n += t),
                              o.timestamp >= a - 259200 &&
                                !o.crime_name.startsWith("OC") &&
                                (i += t);
                          }
                          return { ce: n, daily_ce: i / 3 };
                        })(t, r, e);
                        We("#crimeexp-curr-ce").text(Math.floor(s)),
                          a < 60 &&
                            ((n = (s - c[a]) / (c[a + 5] - c[a])),
                            (i = c[a + 5] - s),
                            We("#crimeexp-upgrade-progress").text(
                              `${Math.floor(100 * n)}%`
                            ),
                            We("#crimeexp-upgrade-progress").attr(
                              "title",
                              `Still ${Math.floor(i)} experience`
                            )),
                          We("#crimeexp-daily-ce").text(l.toFixed(1)),
                          0 <= l
                            ? a < 60 &&
                              We("#crimeexp-upgrade-est").text(
                                Math.floor((c[a + 5] - s) / l)
                              )
                            : (We("#crimeexp-daily-ce").css("color", "red"),
                              10 < a &&
                                (We(".crimeexp-next-upgrade-type").text("downgrade"),
                                We(".crimeexp-next-upgrade-type").css(
                                  "color",
                                  "red"
                                ),
                                We("#crimeexp-upgrade-est").text(
                                  Math.floor((c[a] - s) / l)
                                ))),
                          d("Finish! ");
                      } catch (t) {
                        console.trace(t),
                          "Access level of this key is not high enough" ===
                          t.message
                            ? (d("Insufficient permissions! ", !0),
                            We("#crimeexp-status").append(
                              '<a href="/preferences.php#tab=api">Please use API Key of Full Access type</a>'
                              ))
                            : d(`something went wrong！${t}`, !0);
                      } finally {
                        We("#crimeexp-start-btn").prop("disabled", !1);
                      }
                    });
                  const c = {
                    10: 0,
                    15: 150,
                    20: 500,
                    25: 900,
                    30: 1500,
                    35: 2300,
                    40: 3500,
                    45: 5e3,
                    50: 6666,
                    55: 1e4,
                    60: 15e3,
                  };
                }),
                We("#bwm-addiction").click(function () {
                  We("#bwm").children(":last").remove(),
                    We("#bwm").append(
                      (function () {
                        const t = We(`
<div style="width: inherit">
<div style="margin:10px 0px; border:1px solid darkgray; text-align:center;">
<button id="addiction-fast-btn" class="torn-btn addiction-analyze-btn" style="margin:5px;">quick analysis</button>
<button id="addiction-full-btn" class="torn-btn addiction-analyze-btn" style="margin:5px;">complete analysis</button>
<button id="addiction-faq-btn" class="torn-btn" style="margin:5px;">Show FAQs</button>
</div>
<div id="addiction-faq" style="display: none; margin:10px 0px; padding: 10px; font-size: 100%; line-height: 1.6; color: #333; border:1px solid darkgray; overflow:hidden; overflow-x: auto;">
<p style="font-size: larger"><b>"What is "Auto Decay"?</b></p>
<p>Addiction will automatically decrease by 20 points every day around 3:32 TCT. When detoxification is approaching this time point, or when you cannot take medicine for a long time, it is best to set aside a certain amount of drug addiction to avoid wasting the daily automatic decay effect. </p>
<br />
<p style="font-size: larger"><b>What are "error corrections"? </b></p>
<p>Due to various reasons, Ice Frog may have errors in the calculation of drug addiction. The percentages in the detox log can help correct these errors, thereby ensuring the correctness of subsequent drug addiction data. If you see multiple detox logs with error corrections in a row, it means that the errors have not been fully corrected. Here are some possible reasons for the error:</p>
<ul style="list-style: decimal inside">
<li>You took medicine when there was no gang bonus (such as when changing gangs or RW cutting skills). </li>
<li>The time of your detoxification is relatively close to the natural decay of the day. </li>
<li><s>The Ice Frog code has bugs. </s></li>
</ul>
<br />
<p style="font-size: larger"><b>What are the "Integer solution not found" and "Calculation origin not found" errors? </b></p>
<p>Ice Frog will calculate drug addiction based on some historical detoxification logs, but this process may fail. Here are some possible reasons:</p>
<ul style="list-style: decimal inside">
<li>You are often maxed out to 100% on detox. Please detox at least 1 square each time, and this error can be fixed by repeated detoxification. </li>
<li>You haven't quit drugs for a long time. If so, there is a chance that "Quick Analysis" will fail, try "Full Analysis". </li>
<li>You are still young. Ice Frog needs multiple detox records to calculate addiction. </li>
<li><s>Ice Frog code has a bug.</s></li>
</ul>
<br />
<p style="font-size: larger"><b>How to help Icefrog improve drug addiction algorithm? </b></p>
<ul style="list-style: decimal inside">
<li><a href="/page.php?sid=log&log=2200,2210,2220,2230,2240,2250,2260,2270,2280,2290,2295,2201,2211,2221,2231,2241,2251 ,2261,2271,2281,2291,6005,6504,6253,6720,6722,6723">Click here to jump to the log page</a></li>
<li>Click the "<b>Export Selected Log</b>" button on the log page, and wait patiently, and then click the button again to save the data to a file</li>
<li>Send the exported file to tobytorn via QQ [1617955]</li>
</ul>
<br />
<p style="font-size: larger"><b>What data is contained in this log? </b></p>
<ul style="list-style: decimal inside">
<li title="Log type: 2200, 2210, 2220, 2230, 2240, 2250, 2260, 2270, 2280, 2290, 2295, 2201, 2211, 2221, 2231, 2241, 2251, 2261, 2271 , 2281, 2291" >Medication record</li>
<li title="Log Type: 6005">Drug Rehab Record</li>
<li title="Log type: 6504">A record of using jp to reduce drug addiction</li>
<li title="Log type: 6253, 6720, 6722, 6723">Gang entry and exit records</li>
</ul>
</div>
<div style="margin:10px 0px; border:1px solid darkgray; text-align:center;">
<table style="margin: 5px auto; max-width: 380px; background-color: white; font-size: 12px; line-height: 1.6; text-align: right;">
<tr><th>current drug addiction</th><td id="addiction-curr-ap" style="text-align: left"></td></tr>
<tr><th style="white-space:nowrap">Recent detoxification efficiency</th><td id="addiction-efficiency" style="text-align: left"></td></tr>
<tr><th>drug addiction advice</th><td style="text-align: left"><ul id="addiction-suggestion" style="list-style: decimal inside"></ul></td></tr>
</table>
<div id="addiction-status" style="text-align: center; margin: 5px;"></div>
</div>
<div style="min-height:700px;margin:10px 0px; border:1px solid darkgray; text-align:center; overflow:hidden; overflow-x: auto;">
<table id="addiction-ap-records" style="margin: 5px auto; background-color: white; font-size:12px;">
<tr class="head">
<th>time</th>
<th>operate</th>
<th>Variety</th>
<th>post op drug addiction</th>
<th>detoxification efficiency</th>
</tr>
</table>
</div>
</div>`);
                        return (
                          t
                            .find("th")
                            .css({
                              border: "1px solid darkgray",
                              padding: "2px 5px",
                              "font-weight": "bold",
                            }),
                          t
                            .find("td")
                            .css({
                              border: "1px solid darkgray",
                              padding: "2px 5px",
                              "min-width": "6em",
                            }),
                          t[0]
                        );
                      })()
                    ),
                    b("#bwm-addiction");
                  const c = 6005,
                    d = "error correction",
                    s = "auto attenuation",
                    e = 12720,
                    p = 20;
                  function h(t, e) {
                    We("#addiction-status").text(t),
                      We("#addiction-status").css("color", e ? "red" : "");
                  }
                  function g(t) {
                    return 86400 * Math.ceil((t - e) / 86400) + e;
                  }
                  function f(t, e, a) {
                    let n = g(e);
                    const i = [];
                    for (; n < a && 0 < t; ) {
                      var o = n < 1618963200 ? 21 : p,
                        o = Math.max(t - o, 0);
                      i.push({
                        timestamp: n,
                        title: s,
                        ap_before: t,
                        ap_after: o,
                      }),
                        (t = o),
                        (n += 86400);
                    }
                    return i;
                  }
                  function u(t, e, a, n) {
                    let i = e,
                      o = a;
                    const r = [];
                    for (const l of t.slice().reverse()) {
                      var s = f(i, o, l.timestamp);
                      0 < s.length &&
                        (r.push(...s), (i = r[r.length - 1].ap_after)),
                        (o = l.timestamp);
                      let t = [];
                      (t = (
                        l.log === c
                          ? function (t, e) {
                              const a = [],
                                n = [e];
                              for (let t = 1; t < 100; t++) n.push(e + t);
                              20 < e && n.push(e - 20);
                              let i;
                              for (const s of n) {
                                var o = Math.round(
                                  (s * t.data.addiction) / 100
                                );
                                if (
                                  Math.abs(
                                    Math.round((1e4 * o) / s) -
                                      Math.round(100 * t.data.addiction)
                                  ) <= 1
                                ) {
                                  i = s;
                                  break;
                                }
                              }
                              if (!i)
                                throw new Error("no integer solution found");
                              i !== e &&
                                (a.push({
                                  timestamp: t.timestamp,
                                  title: d,
                                  ap_before: e,
                                  ap_after: i,
                                }),
                                (e = i));
                              var r =
                                e - Math.round((e * t.data.addiction) / 100);
                              return (
                                a.push({
                                  timestamp: t.timestamp,
                                  title: "Rehab",
                                  ap_before: e,
                                  ap_after: r,
                                  times: t.data.rehab_times,
                                  cost: t.data.cost,
                                }),
                                a
                              );
                            }
                          : function (t, e) {
                              var a = {
                                2200: 1,
                                2210: 10,
                                2220: 4,
                                2230: 10,
                                2240: 5,
                                2250: 13,
                                2260: 3,
                                2270: 7,
                                2280: 7,
                                2290: 18,
                                2295: 25,
                                2201: 2,
                                2211: 10,
                                2221: 25,
                                2231: 25,
                                2241: 14,
                                2251: 25,
                                2261: 25,
                                2271: 25,
                                2281: 25,
                                2291: 50,
                              };
                              const n = [];
                              return (
                                6504 === t.log
                                  ? (t.data.new_addiction !==
                                      e - t.data.job_points_used &&
                                      n.push({
                                        timestamp: t.timestamp,
                                        title: d,
                                        ap_before: e,
                                        ap_after:
                                          t.data.new_addiction +
                                          t.data.job_points_used,
                                      }),
                                    n.push({
                                      timestamp: t.timestamp,
                                      title: t.title,
                                      ap_before:
                                        t.data.new_addiction +
                                        t.data.job_points_used,
                                      ap_after: t.data.new_addiction,
                                    }))
                                  : t.log in a
                                  ? n.push({
                                      timestamp: t.timestamp,
                                      title: t.title,
                                      ap_before: e,
                                      ap_after: e + a[t.log],
                                    })
                                  : console.warn("Unknown Addiction Log", t),
                                n
                              );
                            }
                      )(l, i)),
                        0 < t.length &&
                          (r.push(...t), (i = r[r.length - 1].ap_after));
                    }
                    return r.push(...f(i, o, n)), r.reverse();
                  }
                  async function a(t) {
                    const e = [];
                    let a = null,
                      n = null,
                      i = null,
                      o = null,
                      r = 0;
                    for await (const d of ve([126], [], null, null, (t) =>
                      h(
                        `Analyzing logs (${new Date(1e3 * t).format(
                          "yyyy-MM-dd"
                        )})`
                      )
                    )) {
                      if ((e.push(d), d.log === c)) {
                        r++;
                        var s = (function (t) {
                          if (t[0].log !== c || t[t.length - 1].log != c)
                            return null;
                          if (
                            100 === t[0].data.addiction ||
                            100 === t[t.length - 1].data.addiction
                          )
                            return null;
                          var e =
                            0 ===
                            (n = u(
                              t.slice(1, -1),
                              1e4,
                              t[t.length - 1].timestamp,
                              t[0].timestamp
                            )).length
                              ? 0
                              : n[0].ap_after - 1e4;
                          if (e <= 0) return null;
                          var a = t[t.length - 1].data.rehab_times,
                            n = t[t.length - 1].data.addiction / 100;
                          return (
                            e /
                            (t[0].data.rehab_times /
                              (t[0].data.addiction / 100) -
                              a / n +
                              a)
                          );
                        })(e.slice(n));
                        if (a && s && Math.abs(s - a) / s < 0.01) {
                          if (
                            ((i = Math.round(
                              (s * d.data.rehab_times * 100) / d.data.addiction
                            )),
                            (o = e.length),
                            t)
                          )
                            break;
                        } else if (
                          100 === d.data.addiction &&
                          2 < r &&
                          ((i = d.data.rehab_times), (o = e.length), t)
                        )
                          break;
                        (a = s), (n = e.length - 1);
                      }
                      if (t && 450 <= e.length) break;
                      if (d.timestamp < 1577836800) break;
                    }
                    if (!o)
                      throw new Error(
                        "Could not find the calculation starting point"
                      );
                    e.length = o;
                    var l = Math.floor(new Date().getTime() / 1e3),
                      l = u(e, i, e[e.length - 1].timestamp, l);
                    return [e, l];
                  }
                  function n(t, e) {
                    const a = { ap: "", efficiency: "", suggestions: [] };
                    if (0 === t.length) return a;
                    const n = t[0].ap_after;
                    a.ap = n.toString();
                    var i = t.find((t) => "Rehab" === t.title),
                      o = t
                        .slice(t.indexOf(i) + 1)
                        .find((t) => "Rehab" === t.title);
                    let r = (i.ap_before - i.ap_after) / i.times,
                      s = r;
                    Math.abs(o.ap_before - o.ap_after - r * o.times) < 1
                      ? (a.efficiency = r.toPrecision(3))
                      : ((s = (o.ap_before - o.ap_after) / o.times),
                        s < r && ([r, s] = [s, r]),
                        (a.efficiency = `${r.toPrecision(3)} ~ ${s.toPrecision(
                          3
                        )}`));
                    let l = n;
                    var d = Math.floor(new Date().getTime() / 1e3),
                      o = g(d);
                    o < e || o < d + 21600
                      ? ((l -= p),
                        a.suggestions.push(
                          `<li>There is a high probability that there will be no chance to continue taking medicine before the next automatic decay. It is recommended to leave at least ${p} points of addiction after detoxification. If you plan to continue taking medicine before detoxification, please recalculate the addiction after eating</li>`
                        ))
                      : o < Math.max(e, d) + 28800 &&
                        ((l -= p - 18),
                        a.suggestions.push(
                          `<li>I can only take one more xan before the next automatic decay, it is recommended to leave at least ${
                            p - 18
                          } drug addiction after detoxification</li>`
                        )),
                      l <= r
                        ? a.suggestions.push(
                            "<li>The drug addiction is less than one block of drug detoxification amount, and detoxification is not recommended</li>"
                          )
                        : r === s
                        ? ((o = Math.floor(l / r)),
                          (e = ((i.cost / i.times) * o) / 1e6),
                          (i = Math.floor(r * o)),
                          a.suggestions.push(
                            `<li>It is recommended to detox for ${o} squares, spend $${e}m, and it is expected to quit ${(
                              (i / n) *
                              100
                            ).toFixed(2)}%, leaving ${
                              n - i
                            } points of addiction</li>`
                          ))
                        : a.suggestions.push(
                            "<li>There is a large difference in the efficiency of the last two detoxifications, and it is impossible to estimate the number of detoxifications next time</li>"
                          ),
                      a.suggestions.push(
                        "<li>Current calculations on drug addiction are not accurate and the above recommendations may be subject to error</li>"
                      );
                    const c = t.find((t) => t.title.startsWith("Item use"));
                    return (
                      (!c ||
                        c.title.indexOf("xanax") < 0 ||
                        c.timestamp < d - 86400) &&
                        a.suggestions.push(
                          "<li>You don't seem to be sticking to xan recently, the above advice may not be accurate</li>"
                        ),
                      a
                    );
                  }
                  function i(t, e) {
                    We("#addiction-curr-ap").text(e.ap),
                      We("#addiction-efficiency").text(e.efficiency);
                    const a = We("#addiction-suggestion");
                    a.find("li").remove(), a.append(e.suggestions);
                    const n = We("#addiction-ap-records");
                    if ((n.find("tr").slice(1).remove(), 0 !== t.length)) {
                      for (const r of t) {
                        let t = r.title,
                          e = "";
                        "Rehab" === t
                          ? (t = `Rehab ${r.times} grid`)
                          : t === s
                          ? r.ap_before - r.ap_after < 20 && (e = "t-red")
                          : t === d
                          ? (e = "t-red")
                          : t.startsWith("Item use") &&
                            ((t = t.slice("Item use ".length)),
                            (t = t[0].toUpperCase() + t.slice(1)));
                        var i = r.ap_after - r.ap_before,
                          o = 0 <= i ? "t-red" : "t-green",
                          i = We(`<tr>
<td>${new Date(1e3 * r.timestamp).format("yyyy-MM-dd hh:mm")}</td>
<td class="${e}">${t}</td>
<td class="${o}">${0 <= i ? "+" : ""}${i}</td>
<td>${r.ap_after}</td>
<td>${"Rehab" === r.title ? (-i / r.times).toPrecision(3) : ""}</td>
</tr>`);
                        n.append(i);
                      }
                      n.find("td").attr(
                        "style",
                        "border: 1px solid darkgray; padding: 5px"
                      );
                    }
                  }
                  async function t(t) {
                    We(".addiction-analyze-btn").prop("disabled", !0);
                    try {
                      i([], n([], 0));
                      var [, e] = await a(t);
                      i(
                        e,
                        n(
                          e,
                          await (async function () {
                            var t = Math.floor(new Date().getTime() / 1e3),
                              e = await (
                                await fetch(
                                  `https://api.torn.com/user/?selections=cooldowns&key=${x}`
                                )
                              ).json();
                            if ("error" in e) throw new Error(e.error.error);
                            return t + e.cooldowns.drug;
                          })()
                        )
                      ),
                        h("Finish！");
                    } catch (t) {
                      console.trace(t),
                        "Access level of this key is not high enough" ===
                        t.message
                          ? (h("Insufficient permissions！", !0),
                            We("#addiction-status").append(
                              '<a href="/preferences.php#tab=api">Please use an API Key of type Full Access</a>'
                            ))
                          : h(`something went wrong！${t}`, !0);
                    }
                    We(".addiction-analyze-btn").prop("disabled", !1);
                  }
                  We("#addiction-fast-btn").click(() => t(!0)),
                    We("#addiction-full-btn").click(() => t(!1)),
                    We("#addiction-faq-btn").click(function () {
                      We(this).prop("disabled", !0),
                        We("#addiction-faq").show();
                    });
                }),
                We("#bwm-extcenter").click(function () {
                  function l(t) {
                    console.log(t),
                      We("#extcenter-status").prepend(
                        `<span style="display:block; margin:2px">${t}</span>`
                      );
                  }
                  function d(t) {
                    console.log(t),
                      We("#extcenter-status").prepend(
                        `<span style="display:block; color:red; margin:2px">${t}</span>`
                      );
                  }
                  function c() {
                    function o(e, a) {
                      for (let t = 0; t < e.length; t++)
                        if (a === e[t].name) return t;
                      return -1;
                    }
                    let r = le("extcenter", "installedSpecs") || [],
                      s = le("extcenter", "specs") ?? [],
                      a = "";
                    r.forEach((t) => {
                      var e = o(s, t.name);
                      0 <= e && t.version !== s[e].version
                        ? (a += `<tr><td class="extcenter-name">${
                            s[e].name
                          }</td>
<td>${s[e].author}</td><td>${t.version}(<span style="color:red">${
                            s[e].version
                          }</span>)</td>
<td${s[e].detail ? ` title="${s[e].detail}"` : ""}>${s[e].description}</td>
<td><button class="extcenter-update-source" spec="${
                            s[e].name
                          }" style="margin:5px;">renew</button></td>
</tr>`)
                        : (a += `<tr><td class="extcenter-name">${t.name}</td>
<td>${t.author}</td><td>${t.version}</td>
<td${t.detail ? ` title="${t.detail}"` : ""}>${t.description}</td>
<td><button class="extcenter-uninstall" spec="${
                            t.name
                          }" style="margin:5px;">uninstall</button></td>
</tr>`);
                    }),
                      s.forEach((t) => {
                        0 <= o(r, t.name) ||
                          (a += `<tr><td class="extcenter-name">${t.name}</td>
<td>${t.author}</td><td>${t.version}</td>
<td${t.detail ? ` title="${t.detail}"` : ""}>${t.description}</td>
<td><button class="extcenter-install" spec="${
                            t.name
                          }" style="margin:5px;">Install</button></td>
</tr>`);
                      }),
                      We("#extcenter-table").html(a),
                      We("#extcenter-table td").attr(
                        "style",
                        "border: 1px solid darkgray;padding: 5px"
                      ),
                      We(".extcenter-install").attr(
                        "style",
                        `background-color: ${Xe.blue}; color: white; border-radius:5px; cursor:pointer; padding:3px;`
                      ),
                      We(".extcenter-update-source").attr(
                        "style",
                        `background-color: ${Xe.green}; color: white; border-radius:5px; cursor:pointer; padding:3px;`
                      ),
                      We(".extcenter-uninstall").attr(
                        "style",
                        `background-color: ${Xe.orange}; color: #002152; border-radius:5px; cursor:pointer; padding:3px;`
                      ),
                      We("#extcenter-table .extcenter-name").css(
                        "font-weight",
                        "bold"
                      ),
                      We("#extcenter-table .extcenter-desc").css(
                        "min-width",
                        "200px"
                      ),
                      We(".extcenter-install").click(async function () {
                        try {
                          var t = s[o(s, We(this).attr("spec"))],
                            e = `https://gitee.com/ameto_kasao/BWExtensions/raw/master/extensions/${
                              t.file
                            }?${new Date().getTime()}`;
                          l(`${t.name} - ${t.version} start download`);
                          var a = await xe(e);
                          if (
                            (console. log(a),
                            l(`${t.name} - ${t.version} download completed`),
                            !p)
                          )
                            return (
                              await navigator.clipboard.writeText(a),
                              void l(
                                `${t.name} - ${t.version} The source code has been copied to the clipboard, please manually add`
                                )
                              );
                            t.match &&
                            !window.location.href.match(new RegExp(t.match))
                              ? l(
                                  `${t.name} - ${t.version} will be automatically loaded next time you enter the specified page`
                              )
                            : l(
                                me(t.name, t.version, a)
                                  ? `${t.name} - ${t.version} Loaded successfully`
                                  : `${t.name} - ${t.version} already loaded`
                              ),
                            ce("extcenter-source", t.name, a),
                            r.push(t),
                            ce("extcenter", "installedSpecs", r),
                            c();
                        } catch (t) {
                          d(t);
                        }
                      }),
                      We(".extcenter-update-source").click(async function () {
                        try {
                          var t = o(r, We(this).attr("spec")),
                            e = r[t],
                            a = s[o(s, We(this).attr("spec"))],
                            n = `https://gitee.com/ameto_kasao/BWExtensions/raw/master/extensions/${
                              a.file
                            }?${new Date().getTime()}`;
                          l(`${a.name} - ${a.version} start download`);
                          var i = await xe(n);
                          console. log(i),
                            l(
                              `${a.name} - ${e.version} => ${a.version} updated, load after refresh`
                            ),
                            ce("extcenter-source", a.name, i),
                            (r[t] = a),
                            ce("extcenter", "installedSpecs", r),
                            c();
                        } catch (t) {
                          d(t);
                        }
                      }),
                      We(".extcenter-uninstall").click(async function () {
                        try {
                          var t = o(r, We(this).attr("spec")),
                            e = r[t];
                          r.splice(t, 1),
                            pe("extcenter-source", e.name),
                            ce("extcenter", "installedSpecs", r),
                            c(),
                            l(`${e.name} - ${e.version} deleted`);
                        } catch (t) {
                          d(t);
                        }
                      });
                  }
                  We("#bwm").children(":last").remove(),
                    We("#bwm").append(`
<div style="width: inherit">
<div style="margin:10px 0px; border:1px solid darkgray; text-align:center;">
<button id="extcenter-update" class="torn-btn" style="margin:5px;">Check for updates</button>
<button id="extcenter-clear" class="torn-btn" style="margin:5px;">clear cache</button>
<a href="https://github.com/mirrorsysu/BWExtensions"><button id="extcenter-submit-code" class="torn-btn" style="margin:5px; float:right;">submit code</button></a>
</div>
<div style="height:400px; margin:10px 0px; border:1px solid darkgray; text-align:center; overflow:hidden;">
<div style="height:300px; overflow:auto;">
<table id="extcenter-table" style="width:95%; margin: 5px auto; background-color: white; text-align: center;"></table>
</div>
<div id="extcenter-status" style="border-top:1px solid darkgray; text-align:center; margin:5px; padding:5px; max-height:100px; overflow:auto"></div>
</div>
</div>`),
                    b("#bwm-extcenter"),
                    c(),
                    We("#extcenter-update").click(function () {
                      l("Start Update"),
                        xe(
                          `https://gitee.com/ameto_kasao/BWExtensions/raw/master/specs_escape.json?${new Date().getTime()}`
                        )
                          .then((t) => {
                            (t = decodeURI(t)), console.log(t), l("update completed");
                            try {
                              ce("extcenter", "specs", JSON.parse(t)), c();
                            } catch (t) {
                              d(t);
                            }
                          })
                          .catch((t) => {
                            d(t);
                          });
                    }),
                    We("#extcenter-clear").click(function () {
                      l("Start clearing cache"),
                      he("extcenter"),
                      l("extcenter cleared"),
                      he("extcenter-source"),
                      l("extcenter-source has been cleared"),
                        c();
                    });
                });
            }
          });
      }
      if (0 <= window.location.href.indexOf("profiles.php")) {
        const ba = setInterval(V, 500);
        function V() {
          const c = We(
            "div.profile-buttons div.profile-container div.empty-block"
          );
          if (0 < c.length) {
            c.hasClass("profile-container-description") ||
              c.addClass("profile-container-description"),
              clearInterval(ba),
              c.css({
                height: "75",
                "padding-top": "5px",
                "overflow-x": "auto",
              }),
              c.siblings(".buttons-wrap").css("padding", "0px"),
              c.html("The Frog Detector is working...");
            const t = We(".basic-information")
              .find(".info-table")
              .children(":first")
              .children(".user-info-value")
              .children()
              .text();
            console.log(`user: ${t}`);
            const e = t ? t.split("[")[0].trim() : "",
              a = t ? t.split("[")[1].replace("]", "").trim() : "",
              n = `/loader.php?sid=attack&user2ID=${a}`;
            We(".profile-status").children().children(".title-black").empty()
              .append(`
<span class="border-round" style="color:white;background-color:#DAA520;padding:3px;text-shadow:none;">
<a href="${n}" style="color: white; text-decoration: none;">attack</a></span>`);
            const i = $e(e);
            i
              ? We(".profile-status").children().children(".title-black")
                  .append(`
<span class="border-round" style="color:white;background-color:${i[0]};padding:3px;margin-left:5px;">last chat: ${i[1]}</span>`)
              : console.log("never chatted");
            const o = Ie(a);
            if ((console.log("mug_display_arr " + o), o)) {
              const r = o.split(",")[0],
                s = o.split(",")[1],
                l = o.split(",")[2];
              We(".profile-status").children().children(".title-black").append(`
<span class="border-round" style="color:white;background-color:${r};padding:3px;margin-left:5px;">last mug: ${l} - ${s}</span>`);
            } else console.log("没mug过");
            be(
              a,
              function (t) {
                let e = parseInt((100 * t.life.current) / t.life.maximum);
                const a =
                  t.life.current + "/" + t.life.maximum + " (" + e + "%)";
                let n = "";
                (n =
                  e <= 66
                    ? `
<div style="height:20px; overflow:hidden;">
${fe(20, e, "#c0542f", "#FFF5F7", a)}
</div>`
                    : (100 < e && (e = 100),
                      `
<div style="height:20px; overflow:hidden;">
${fe(20, e, "#5d9525", "#FFF5F7", a)}
</div>`)),
                  c.html(`
<table style="width:100%; background-color: #FFF5F7;">
<tr>
<td class="bw-bs">Stats</td>
<td colspan="3">${t.estimate_bs_display}</td>
<td class="bw-stat">XAN</td>
<td>${t.personalstats.xantaken || 0}</td>
<td class="bw-other">active days</td>
<td>${parseInt(t.estimate_active_days) || 0}</td>
</tr>
<tr>
<td class="bw-bs">HP</td>
<td class="bw-hp" colspan="3">${n}</td>
<td class="bw-stat">LSD</td>
<td>${t.personalstats.lsdtaken || 0}</td>
<td class="bw-other">Estimate WS</td>
<td>${Qt(t.estimate_ws) || 0}</td>
</tr>
<tr>
<td class="bw-nw">Net</td>
<td>${Qt(t.personalstats.networth)}</td>
<td class="bw-nw">Estimate NNB</td>
<td>${t.estimate_nnb || 10}</td>
<td class="bw-stat">SE</td>
<td>${t.personalstats.statenhancersused || 0}</td>
<td colspan="2"><a class="t-blue" role="button" id="a_click_start_wawa" style="cursor: pointer">more&gt;&gt;</a></td>
</tr>
</table>
`),
                  c
                    .find("td")
                    .attr(
                      "style",
                      "border: 2px solid darkgray; padding:2px; text-align:center;"
                    ),
                  c
                    .find(".bw-bs")
                    .attr(
                      "style",
                      "border: 2px solid darkgray; padding:2px; text-align:center;background-color: #033649;color: white;font-weight: bold;"
                    ),
                  c
                    .find(".bw-nw")
                    .attr(
                      "style",
                      "border: 2px solid darkgray; padding:2px; text-align:center;background-color: #757947;color: white;font-weight: bold;"
                    ),
                  c
                    .find(".bw-other")
                    .attr(
                      "style",
                      "border: 2px solid darkgray; padding:2px; text-align:center;background-color: #725334;color: white;font-weight: bold;"
                    ),
                  c
                    .find(".bw-stat")
                    .attr(
                      "style",
                      "border: 2px solid darkgray; padding:2px; text-align:center;background-color: #458994;color: white;font-weight: bold;"
                    ),
                  c
                    .find(".bw-hp")
                    .attr(
                      "style",
                      "border: 2px solid darkgray; text-align:center;"
                    ),
                  We("div.user-information-section:contains('Last action')")
                    .next()
                    .children("span")
                    .text(t.last_action_details);
                const i = We("div.profile-buttons.profile-action").html(),
                  o = `
<div>
<div class="title-black top-round">Frog Detector&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a class="t-white" role="button" id="a_click_start_wawa_back" style="cursor: pointer">return</a>
</div>
<div class="cont bottom-round ">
<div class="profile-container basic-info bottom-round">
<table style="width:100%; min-height: 320px;">
<tr>
<td style="vertical-align:middle"><span class="bold">Estimate combat power</span></td>
<td style="vertical-align:middle"><span class="bold">${
                    t.estimate_bs_display
                  }</span></td>
<td style="vertical-align:middle"><span class="bold">Xanax quantity</span></td>
<td style="vertical-align:middle"><span class="bold">${
                    t.personalstats.xantaken || 0
                  }</span></td>
<td style="vertical-align:middle"><span class="bold">Number of SEs</span></td>
<td style="vertical-align:middle"><span class="bold">${
                    t.personalstats.statenhancersused || 0
                  }</span></td>
</tr>
<tr>
<td style="vertical-align:middle"><span class="bold">Attack win rate</span></td>
<td style="vertical-align:middle"><span class="bold">${
                    Qt(t. attackWinRatio) || 0
                  }</span></td>
<td style="vertical-align:middle"><span class="bold">Defensive win percentage</td>
<td style="vertical-align:middle"><span class="bold">${
                    Qt(t.defendWinRatio) || 0
                  }</span></td>
<td style="vertical-align:middle"><span class="bold">Defensive win</span></td>
<td style="vertical-align:middle"><span class="bold">${
                    t.personalstats.defendswon || 0
                  }</span></td>
</tr>
<tr>
<td style="vertical-align:middle"><span class="bold">Energy refill</span></td>
<td style="vertical-align:middle"><span class="bold">${
                    t.personalstats.refills || 0
                  }</span></td>
<td style="vertical-align:middle"><span class="bold">Amount of LSD</span></td>
<td style="vertical-align:middle"><span class="bold">${
                    t.personalstats.lsdtaken || 0
                  }</span></td>
<td style="vertical-align:middle"><span class="bold">DP ratio</span></td>
<td style="vertical-align:middle"><span class="bold">${Qt(
                    t.donator_percent
                  )}</span></td>
</tr>
<tr>
<td style="vertical-align:middle"><span class="bold">Active Days</span></td>
<td style="vertical-align:middle"><span class="bold">${
                    t.estimate_active_days
                  }</span></td>
<td style="vertical-align:middle"><span class="bold">Daily drug use</span></td>
<td style="vertical-align:middle"><span class="bold">${
                    t.average_drugs
                  }</span></td>
<td style="vertical-align:middle"><span class="bold">Booster</span></td>
<td style="vertical-align:middle"><span class="bold">${Qt(
                    t.personalstats.boostersused
                  )}</span></td>
</tr>
<tr>
<td style="vertical-align:middle"><span class="bold">Estimate ACE</span></td>
<td style="vertical-align:middle"><span class="bold">${
                    t.estimate_ace
                  }</span></td>
<td style="vertical-align:middle"><span class="bold">Estimate NNB</span></td>
<td style="vertical-align:middle"><span class="bold">${
                    t.estimate_nnb
                  }</span></td>
<td style="vertical-align:middle"><span class="bold">Total assets</span></td>
<td style="vertical-align:middle"><span class="bold">${Qt(
                    t.personalstats.networth
                  )}</span></td>
</tr>
</table>
</div>
</div>`,
                  r = function () {
                    We("div.profile-buttons.profile-action").html(o),
                      We("div.profile-status").hide(),
                      We("#a_click_start_wawa_back").click(function () {
                        We("div.profile-buttons.profile-action").html(i),
                          We("div.profile-status").show(),
                          We("#a_click_start_wawa").click(r);
                      });
                  };
                We("#a_click_start_wawa").click(r);
                let s = 0;
                (s += t.enemies / 10),
                  (s -= t.friends / 20),
                  (s += t.personalstats.moneymugged / 2e8),
                  (s += t.personalstats.bountiesreceived / 50),
                  (s = parseInt(s));
                let l = "",
                  d = "";
                (d =
                  s <= 0
                    ? ((l = "Great Good Guy"), Xe.yellowgreen)
                    : s <= 10
                    ? ((l = "Good Guy"), Xe.blue)
                    : s <= 100
                    ? ((l = "bad guy"), Xe.yellow)
                    : ((l = "Great Evil Guy"), Xe.red)),
                  We("div.basic-information")
                    .find("ul.info-table")
                    .children("li:eq(9)")
                    .children("div.user-info-value").append(`
&nbsp;<span class="border-round" style="padding:2px;background-color:${d};color:white;" title="0 points and below: good people<br>1-10 points: Good guy<br>11-100 points: bad guy<br>100 points and above: great villain">${l}</span>
&nbsp;<span title="1 point for every 10 enemies<br>1 point for every 20 friends<br>1 point for every mug200m<br>1 point for every 50 bounties received"><b >bad ratio index: ${s}</b></span>
`);
              },
              function (t) {
                c.html(t);
              }
            );
          }
        }
      }
      function Y(n, t) {
        let i = !0;
        if (We("#parade_filter").length <= 0) {
          We(n).before(
            '<div class="title-black m-top10 title-toggle tablet top-round faction-title active title" data-title="description" role="heading" aria-level="5">parade</div><div id="parade_filter" class="cont-gray bottom-rounded content" style="overflow:hidden"><div class="checkboxset-wrap" style="margin:5px 10px; float:left"><div class="checkbox-wrap" style="margin:5px 10px;"><input type="checkbox" style="margin:1px 5px;" value="Level" checked="checked">Level</div><div class="checkbox-wrap" style="margin:5px 10px;"><input type="checkbox" style="margin:1px 5px;" value="BS" checked="checked">BS</div><div class="checkbox-wrap" style="margin:5px 10px;"><input type="checkbox" style="margin:1px 5px;" value="Mugged" checked="checked">Mugged</div></div><div class="checkboxset-wrap" style="margin:5px 10px; float:left"><div class="checkbox-wrap" style="margin:5px 10px;"><input type="checkbox" style="margin:1px 5px;" value="Rehab" checked="checked">Rehab</div><div class="checkbox-wrap" style="margin:5px 10px;"><input type="checkbox" style="margin:1px 5px;" value="Rank" checked="checked">Rank</div><div class="checkbox-wrap" style="margin:5px 10px;"><input type="checkbox" style="margin:1px 5px;" value="Job" checked="checked">Job</div></div><div class="checkboxset-wrap" style="margin:5px 10px; float:left"><div class="checkbox-wrap" style="margin:5px 10px;"><input type="checkbox" style="margin:1px 5px;" value="Networth" checked="checked">Networth</div><div class="checkbox-wrap" style="margin:5px 10px;"><input type="checkbox" style="margin:1px 5px;" value="Bazaar">Bazaar</div><div class="checkbox-wrap" style="margin:5px 10px;"><input type="checkbox" style="margin:1px 5px;" value="Defendslost">Defendslost</div></div><div class="checkboxset-wrap" style="margin:5px 10px; float:left"><div class="checkbox-wrap" style="margin:5px 10px;"><input type="checkbox" style="margin:1px 5px;" value="Property">Property</div><div class="checkbox-wrap" style="margin:5px 10px;"><input type="checkbox" style="margin:1px 5px;" value="Elimination">Elimination</div><div class="checkbox-wrap" style="margin:5px 10px;"><input type="checkbox" style="margin:1px 5px;" value="Signup">Signup</div></div><div class="checkboxset-wrap" style="margin:5px 10px; float:left"><div class="checkbox-wrap" style="margin:5px 10px;"><input type="checkbox" style="margin:1px 5px;" value="Last" checked="checked">Last</div><div class="checkbox-wrap" style="margin:5px 10px;"><input type="checkbox" style="margin:1px 5px;" value="Status" checked="checked">Status</div><div class="checkbox-wrap" style="margin:5px 10px;"><input type="checkbox" style="margin:1px 5px;" value="Life">Life</div></div><div class="checkboxset-wrap" style="margin:5px 10px; float:left"><div class="input-wrap" style="margin:5px 10px;"><label for="nw">Bazaar value greater than </label><input id="parade_bazaar_value" type="text" style="margin:1px 5px; width:50px" value="10">M</div><div class="btn-wrap" style="margin:5px 10px;"><span class="btn"><button id="parade_start" class="torn-btn" style="margin:1px 5px;">start the parade</button></span><span class="btn"><button id="parade_stop" class="torn-btn" style="margin:1px 5px;">suspend military parade</button></span></div></div></div>'
          ),
            We("#parade_stop").prop("disabled", !0);
          const a = le("parade_option", "checkbox_vals");
          var e = le("parade_option", "text_vals");
          null != a &&
            null != a &&
            (We("#parade_bazaar_value").val(e),
            We("#parade_filter input:checkbox").removeAttr("checked"),
            We("#parade_filter input:checkbox").each(function (t, e) {
              0 <= a.indexOf(We(this).val()) &&
                We(this).attr("checked", "checked");
            }));
        }
        We("#parade_start").click(function () {
          i = !0;
          let e = We(t).children("li").first();
          if (e.length <= 0) alert("User list not found");
          else {
            const h = We("#parade_bazaar_value").val().replace(/[^\d]/g, "");
            let c = [];
            We("#parade_filter input:checkbox:checked").each(function (t, e) {
              c.push(We(this).val());
            }),
              console.log(c),
              We("#parade_filter input[type='checkbox']").prop("disabled", !0),
              We("#parade_filter input[type='text']").prop("disabled", !0),
              We(this).prop("disabled", !0),
              We("#parade_stop").removeAttr("disabled"),
              We("#parade_filter").css("background-color", Xe.blue);
            let t = {};
            if (
              ((t.checkbox_vals = c),
              (t.text_vals = h),
              window.localStorage.setItem("parade_option", JSON.stringify(t)),
              We("#search_parade_table").length < 1)
            ) {
              let e =
                '<p id="search_parade_progress">parade progress</p><table id="search_parade_table" style="width:100%;background-color: white;font-size:12px;"><tr><th>Name</th>';
              for (let t = 0; t < c.length; t++) e += `<th>${c[t]}</th>`;
              (e += "<th>Attack</th></tr></table>"),
                We(n).before(e),
                We("#search_parade_table")
                  .find("th")
                  .attr(
                    "style",
                    "border: 1px solid darkgray;padding: 5px;background-color: black;color: white;font-weight: bold;text-align:center;"
                  );
            }
            function a() {
              if ("1" == e.attr("detected")) console.log("user detected"), p(0);
              else {
                e.attr("detected", "1");
                const d = e
                  .find("a[href^='/profiles.php?XID=']")
                  .attr("href")
                  .replace(/[^0-9|-]/gi, "");
                We("#search_parade_progress").text(`is parading：${d}`),
                  be(
                    d,
                    function (t) {
                      let n = "Closed",
                        i = 0,
                        o = 0;
                      if (t.basicicons.icon35) {
                        n = "Opened";
                        const e = t.bazaar;
                        null != e &&
                          e.map(function (t, e, a) {
                            (i += t.quantity * t.market_price),
                              (o += t.quantity * t.price);
                          });
                      }
                      if (
                        "Federal" == t.status.state ||
                        "Fallen" == t.status.state
                      )
                        console.log("Banned/dead, skip"),
                        We("#search_parade_progress").text(
                          `Parade: ${d} is banned/dead, skipping`
                        ),
                        p(1e3);
                    else if (h && i < 1e6 * h)
                      console.log("too poor, skip"),
                        We("#search_parade_progress").text(
                          `parade: ${d} too poor, skip`
                          ),
                          ce("battlestats", d, t.estimate_bs),
                          p(1e3);
                      else {
                        let e = {};
                        (e.Level = t.level),
                          (e.BS = Qt(t.estimate_bs)),
                          (e.Mugged = Qt(t.personalstats.moneymugged)),
                          (e.Rehab = Qt(t.personalstats.rehabcost || 0)),
                          (e.Rank = t.rank_title),
                          (e.Networth = Qt(t.personalstats.networth)),
                          (e.Defendslost = t.personalstats.defendslost),
                          (e.Property = t.property),
                          (e.Signup = t.signup),
                          (e.Last = t.last_action_brief),
                          (e.Status = t.status.state),
                          (e.Elimination =
                            null == t.competition ? "" : t.competition.team);
                        const l = t.job.company_type;
                        var r,
                          s = t.job.position;
                        0 == l
                          ? (e.Job = s)
                          : null !=
                              (r = le("APICache_companies", "companies")) &&
                            null != r
                          ? ((e.Job = r[l.toString()].name),
                            (e.Job += "Director" == s ? "(D)" : "(E)"))
                          : (e.Job = l),
                          (e.Life =
                            parseInt((t.life.current / t.life.maximum) * 100) +
                            "%"),
                          (e.Bazaar = '<span class="t-red">Closed</span>'),
                          "Opened" == n &&
                            (e.Bazaar = `<a href="/bazaar.php?userId=${d}"><span class="t-green">${Qt(
                              i
                            )}</span><span class="t-red">/${Qt(o)}</span></a>`);
                        let a = `<tr><td><a class="user name" href="/profiles.php?XID=${d}" target="_blank">${t.name}</a></td>`;
                        for (let t = 0; t < c.length; t++)
                          a += `<td>${e[c[t]]}</td>`;
                        (a += `<td><a class="t-blue c-pointer h attack-act" href="/loader2.php?sid=getInAttack&user2ID=${d}" target="_blank">Attack</a></td></tr>`),
                          console.log(`frog detection userId ${d} success: ${a}`),
                          We("#search_parade_table").append(a),
                          We("#search_parade_table")
                            .find("td")
                            .attr(
                              "style",
                              "border: 1px solid darkgray;padding:5px;text-align:center;"
                            ),
                          ce("battlestats", d, t.estimate_bs),
                          p(1e3);
                      }
                    },
                    function (t) {
                      console.log(`Frog probe userId: ${d} failed`), p(1e3);
                    }
                  );
              }
            }
            function p(t) {
              (e = We(e.nextAll(e[0].tagName)[0])),
                0 < e.length && 1 == i
                  ? (console.log(i), setTimeout(a, t))
                  : (console.log("Parade complete"),
                  We("#search_parade_progress").text("Parade completed"),
                  We("#parade_filter input[type='checkbox']").removeAttr(
                    "disabled"
                  ),
                  We("#parade_filter input[type='text']").removeAttr(
                    "disabled"
                  ),
                  We("#parade_start"). removeAttr("disabled"),
                  We("#parade_stop").prop("disabled", !0),
                  We("#parade_start").text("Continue the parade"),
                    We("#parade_filter").css("background-color", "#f2f2f2"));
            }
            console.log("parade begins"), a();
          }
        }),
          We("#parade_stop").click(function () {
            (i = !1),
              console.log("Parade suspended"),
              We("#search_parade_progress").text("The parade is suspended"),
              We("#parade_filter input[type='checkbox']").removeAttr(
                "disabled"
              ),
              We("#parade_filter input[type='text']").removeAttr("disabled"),
              We("#parade_start").removeAttr("disabled"),
              We("#parade_filter").css("background-color", "#f2f2f2");
          });
      }
      if (0 <= window.location.href.indexOf("page.php?sid=UserList")) {
        Y("div.userlist-wrapper", "ul.user-info-list-wrap");
        const _a = setInterval(Q, 1e3);
        function Q() {
          const t = We(".user-info-list-wrap").find(".expander");
          0 < t.length &&
            t.each(function () {
              if ("1" != We(this).attr("hasdone")) {
                We(this).attr("hasdone", "1");
                const e = We(this)
                  .children(".user.name")
                  .find("[title]")
                  .attr("title");
                var t = $e(e.split("[")[0].trim());
                t &&
                  (console.log(t),
                  We(this).children(".user.name").append(`
<div class= "border-round" title="<strong>last chat: </strong>${t[1]}"
style="position: absolute; z-index: 1; top: 0px; right: 30px; width: 44px; height: 20px; margin: 3px; border: 3px solid #000; background-color: ${t[0]}; color: #eee; text-align: center;line-height: 20px;">${t[1]}
</div>`));
              }
            });
        }
      }
      if (foo && 0 <= window.location.href.indexOf("index.php?page=people")) {
        Y("div.travel-people", "ul.users-list");
        let i = {};
        const ka = window.localStorage.getItem("muglog-watchlist");
        function h(t) {
          const e = t.find("a.faction").attr("href");
          return e ? e.substring(30) : 0;
        }
        null !== ka && void 0 !== ka && (i = JSON.parse(ka));
        const ba = setInterval(V, 1e3);
        function V() {
          const t = We("ul.users-list").children("li");
          0 < t.length &&
            t.each(function (t, e) {
              if ("1" != We(this).attr("oversea")) {
                const a = h(We(this)),
                  n = We(this).find("a.name").attr("href").substring(18).trim();
                a in He && We(this).css("background-color", "NavajoWhite"),
                  a in qe && We(this).css("background-color", "DarkSeaGreen"),
                  n in i && We(this).css("background-color", Xe.purple),
                  We(this).attr("oversea", "1");
              }
            });
        }
      }
      const ya = {
        Mexico: { name: "Mexico", time: 18 },
        Cayman: { name: "Cayman", time: 25 },
        Canada: { name: "Canada", time: 29 },
        Hawaii: { name: "Hawaii", time: 94 },
        Argentina: { name: "Argentina", time: 117 },
        United: { name: "United Kingdom", time: 111 },
        Switzerland: { name: "Switzerland", time: 123 },
        Japan: { name: "Japan", time: 158 },
        China: { name: "China", time: 169 },
        UAE: { name: "Dubai", time: 190 },
        South: { name: "South Africa", time: 208 },
      };
      function Z(t) {
        return We(t).find("div.days").attr("last-action-minutes");
      }
      function tt(t) {
        return We(t).find("div.status").attr("sort_score");
      }
      function et(t) {
        return We(t).find("div.position").attr("estimate-bs");
      }
      function at(t) {
        return We(t).find("div.lvl").text();
      }
      function nt(t) {
        return We(t).find("td.table-level").text();
      }
      function it(t) {
        return We(t).find("td.table-online").attr("code");
      }
      function ot(t) {
        return We(t).find("td.table-revivable").text();
      }
      function rt(t) {
        return We(t).find("td.table-position").text();
      }
      function st(t) {
        return We(t).find("td.table-days").text();
      }
      function lt(t) {
        return We(t).find("td.table-last").attr("last-action-minutes");
      }
      function dt(t) {
        return We(t).find("td.table-status").attr("hospital-minutes");
      }
      function ct(t) {
        return We(t).find("td.table-bs").attr("estimate-bs");
      }
      function pt(t) {
        let e = le("battlestats", t),
          a = "",
          n = "";
        return (
          null != e && null != e ? ((a = Vt(e)), (n = Qt(e))) : (e = 0),
          [e, a, n]
        );
      }
      function ht(t) {
        let e = le("networths", t),
          a = "";
        return null != e && null != e ? (a = Qt(e)) : (e = 0), e, a, 1;
      }
      function gt(t) {
        t = le("revivable", t);
        let e = null != t && null != t ? t : "unknown";
        return e;
      }
      function ft(t) {
        const e = new Date();
        t = parseInt(parseInt(e.getTime() / 1e3) - t);
        let a = "";
        return (
          (a =
            60 <= t && t < 3600
              ? parseInt(t / 60) + "m"
              : 3600 <= t && t < 86400
              ? parseInt(t / 3600) + "h"
              : 86400 <= t
              ? parseInt(t / 86400) + "d"
              : t + "s"),
          [t, a]
        );
      }
      function ut(i, o, r) {
        let s = 0,
          l = "town";
        const d = new Date();
        i = i.split(" ");
        if ("Abroad" == o)
          (o = "=" + ya[i[1]].name), (s = 0 - ya[i[1]].time), (l = "oversea");
        else if ("Traveling" == o)
          1 < i.length
            ? "Traveling" == i[0]
              ? ((o = ">" + ya[i[2]].name), (s = 0 - ya[i[2]].time))
              : "Returning" == i[0] &&
                ((o = "<" + ya[i[4]].name), (s = 0 - ya[i[4]].time))
            : ((o = "theater"), (s = -1)),
            (l = "oversea");
        else if ("Hospital" == o) {
          let t = parseInt(r - parseInt(d.getTime() / 1e3));
          t < 0 && (t = 0);
          let e = parseInt(t / 3600);
          e = e < 10 ? "0" + e : e;
          let a = parseInt((t % 3600) / 60);
          a = a < 10 ? "0" + a : a;
          let n = t % 60;
          (n = n < 10 ? "0" + n : n),
            (l =
              "hospital" == i[1]
                ? ((o = e + ":" + a + ":" + n), "town")
                : ((o = "海" + e + ":" + a + ":" + n), "oversea")),
            (s = t);
        }
        return [o, s, l];
      }
      function bt(t) {
        We("li.days").text("Last"), We("li.position").text("BattleStats");
        let o = 200;
        0 < We("li.position").length &&
          ((o = window
            .getComputedStyle(We("li.position")[0])
            .width.replace(/px$/g, "")),
          console.log(o));
        var e = `https://api.torn.com/faction/${t}?selections=basic&key=${x}`;
        fetch(e)
          .then((t) => t.json())
          .then((i) => {
            console.log("facPageEnhanced " + t),
              We("li.table-row").each(function () {
                var t = We(We(this).find("[class^=userWrap]"))
                    .children()
                    .attr("href")
                    .substring(18),
                  e = pt(t);
                100 < Number(o)
                  ? We(We(this).find("div.position"))
                      .attr("estimate-bs", e[0])
                      .children(":first")
                      .text(e[1])
                  : We(We(this).find("div.position"))
                      .attr("estimate-bs", e[0])
                      .children(":first")
                      .text(e[2]);
                var a = ft(i.members[t].last_action.timestamp);
                We(We(this).find("div.days"))
                  .attr("last-action-minutes", a[0])
                  .text(a[1]);
                var n = i.members[t].status.state,
                  e = i.members[t].status.description,
                  a = i.members[t].status.until,
                  t = i.members[t].status.color,
                  a = ut(e, n, a);
                We(We(this).find("div.status"))
                  .attr("sort_score", a[1])
                  .html(`<span class="t-${t}">${a[0]}</span>`);
              });
          })
          .catch((t) => console.log("fetch error", t));
      }
      function mt(t, e, a) {
        let n = [0, 0, 0];
        var i = le("APICache_companies", "companies");
        function o(t) {
          return t[0] + t[1] < t[2] ? 2 : t[0] > t[1] ? 0 : 1;
        }
        function r(t) {
          return 0 < (t[0] - t[1]) * (t[1] - t[2])
            ? 1
            : 0 < (t[0] - t[2]) * (t[2] - t[1])
            ? 2
            : 0;
        }
        function s(t, e) {
          return e / t <= 1 ? e / t : 1 + ((e - t) / t) * 0.5;
        }
        function l(t, e) {
          if (0 == t) return "";
          t = (1.2 * e) / t;
          return t < 1 ? "eff-red" : t < 2 ? "eff-yellow" : "eff-green";
        }
        "unassigned" != e &&
          null != i &&
          null != i &&
          ((c = i[t].positions[e].man_required),
          (p = i[t].positions[e].int_required),
          (h = i[t].positions[e].end_required),
          (n = [c, p, h]));
        var d,
          e = n[o(n)],
          c = a[o(n)],
          p = n[r(n)],
          h = a[r(n)];
        const g = 0.67 * s(e, c) + 0.33 * s(p, h),
          f = (d = g) < 1 ? "eff-red" : d < 1.5 ? "eff-yellow" : "eff-green",
          u = l(n[0], a[0]),
          b = l(n[1], a[1]),
          m = l(n[2], a[2]);
        p = Math.floor(
          Math.min(45, (c / e) * 45 * 1.2) +
            Math.floor(
              Math.min(45, (h / p) * 45 * 1.2) +
                Math.floor(Math.max(0, 5 * Math.log2((1.2 * c) / e))) +
                Math.floor(Math.max(0, 5 * Math.log2((1.2 * h) / p)))
            )
        );
        return [g, f, u, b, m].concat(n).concat(p);
      }
      function xt(t) {
        let e = 0;
        t = le("EMPLOYEE_RANK", t);
        return null != t && null != t && (e = t), e;
      }
      function yt(t) {
        var e = `https://api.torn.com/company/?selections=profile,employees&key=${x}`;
        const a = We("#tips-view-company");
        a.text("---Detection---"),
        fetch(e)
          .then(
            (t) => (t.ok ? t.json() : void a.text("---detection failure---")),
            (t) => {
              a.text("---Network exception---");
              }
            )
            .then((c) => {
              if ((a.text("---Probe complete---"), "error" in c))
              a.text(
                `--- Error code: ${c.error.code} error：${c.error.error}---`
                );
              else if ("company_employees" in c) {
                We("#companyname").text(c.company.name),
                  t.prepend(`
<table class="company-effectiveness" style="background-color: #FFF5F7;font-size:12px;margin:auto;">
<tr class="head">
<th class="employee-basic table-position">post</th>
<th class="employee-basic table-days">Days</th>
<th class="employee-ws table-man">MAN</th>
<th class="employee-ws table-int">INT</th>
<th class="employee-ws table-end">END</th>
<th class="employee-effectiveness table-ws" title="Working Stats">Work Stats</th>
<th class="employee-effectiveness table-ep" title="Effectiveness Prediction">Eff</th>
<th class="employee-basic table-last">Last Active</th>
<th class="employee-basic table-username">Name</th>
<th class="employee-effectiveness table-settled" title="Settled In">Settled</th>
<th class="employee-effectiveness table-merits" title="Merits">Merits</th>
<th class="employee-effectiveness table-education" title="Director Education">EDU</th>
<th class="employee-effectiveness table-management" title="Management">Management</th>
<th class="employee-effectiveness table-addiction" title="Addiction">Addiction</th>
<th class="employee-effectiveness table-total" title="Total">Total</th>
<th class="employee-status table-tornstats">TS</th>
</tr>
</table>`);
                const p = t.children(".company-effectiveness");
                p
                  .find("th.employee-basic")
                  .attr(
                    "style",
                    "border: 1px solid darkgray;padding: 5px;background-color: #033649;color: white;font-weight: bold;text-align:center;"
                  ),
                  p
                    .find("th.employee-ws")
                    .attr(
                      "style",
                      "border: 1px solid darkgray;padding: 5px;background-color: #458994;color: white;font-weight: bold;text-align:center;"
                    ),
                  p
                    .find("th.employee-effectiveness")
                    .attr(
                      "style",
                      "border: 1px solid darkgray;padding: 5px;background-color: #757947;color: white;font-weight: bold;text-align:center;"
                    ),
                  p
                    .find("th.employee-status")
                    .attr(
                      "style",
                      "border: 1px solid darkgray;padding: 5px;background-color: #725334;color: white;font-weight: bold;text-align:center;"
                    );
                let a = [];
                We.each(c.company_employees, function (t, e) {
                  (e.userid = t), (e.position_rank = xt(t)), a.push(e);
                }),
                  a.sort(function (t, e) {
                    return t.position_rank - e.position_rank;
                  });
                const h = { 0: "", 1: "eff-yellow", 3: "eff-red" };
                We.each(a, function (t, e) {
                  var a = ft(e.last_action.timestamp),
                    n = 172800 <= a[0] ? 3 : 86400 <= a[0] ? 1 : 0,
                    i = e.effectiveness.addiction || 0,
                    o = i <= -10 ? 3 : i <= -5 ? 1 : 0,
                    r = e.effectiveness.merits || 0,
                    s = r <= 2 ? 3 : r <= 4 ? 1 : 0,
                    l = n + o + s,
                    d = 3 <= l ? 3 : 1 <= l ? 1 : 0,
                    l = mt(c.company.company_type, e.position, [
                      e.manual_labor,
                      e.intelligence,
                      e.endurance,
                    ]);
                  p.children().append(`
<tr class="content">
<td class="table-position tleft" position-value="${
                    e.position_rank
                  }">${e.position}</td>
<td class="table-days">${e.days_in_company}</td>
<td class="table-man tright ${
                    l[2]
                  }" man="${e.manual_labor}" title="MAN Required: ${Vt(l[5])}">${Nt(e.manual_labor)}</td>
<td class="table-int tright ${
                    l[3]
                  }" int="${e.intelligence}" title="INT Required: ${Vt(l[6])}">${Nt(e.intelligence)}</td>
<td class="table-end tright ${
                    l[4]
                  }" end="${e.endurance}" title="END Required: ${Vt(l[7])}">${Nt(e.endurance)}</td>
<td class="table-ws">${e.effectiveness.working_stats || 0}</td>
<td class="table-ep">${l[8]}</td>
<td class="table-last ${h[n]}" last-action-minutes="${a[0]}">${a[1]}</td>
<td class="table-username ${
                    h[d]
                  }"><a class="user name" href="/profiles.php?XID=${e.userid}" target="_blank">${e.name}</a></td>
<td class="table-settled">${e.effectiveness.settled_in || 0}</td>
<td class="table-merits ${h[s]}">${r}</td>
<td class="table-education">${e.effectiveness.director_education || 0}</td>
<td class="table-management">${e.effectiveness.management || 0}</td>
<td class="table-addiction ${h[o]}">${i}</td>
<td class="table-total"><b>${e.effectiveness.total || 0}</b></td>
<td class="table-tornstats tright ${
                    l[1]
                  }" effectiveness="${l[0]}"><span>${(100 * l[0]).toFixed(0)}%</span></td>
</tr>`);
                }),
                  p.find("th").css("cursor", "pointer"),
                  p
                    .find("td")
                    .attr(
                      "style",
                      "border: 1px solid darkgray;padding:5px;text-align:center;"
                    ),
                  p.find("td.tright").css("text-align", "right"),
                  p.find("td.tleft").css("text-align", "left"),
                  p.find("td.eff-green").css("background-color", "#D0E9C6"),
                  p.find("td.eff-yellow").css("background-color", "#FAF2CC"),
                  p.find("td.eff-red").css("background-color", "#EBCCCC"),
                  ge(p.find("th.table-position"), wt),
                  ge(p.find("th.table-days"), _t),
                  ge(p.find("th.table-man"), kt),
                  ge(p.find("th.table-int"), $t),
                  ge(p.find("th.table-end"), It),
                  ge(p.find("th.table-ws"), St),
                  ge(p.find("th.table-settled"), Dt),
                  ge(p.find("th.table-merits"), At),
                  ge(p.find("th.table-education"), Ft),
                  ge(p.find("th.table-management"), Ot),
                  ge(p.find("th.table-addiction"), Ct),
                  ge(p.find("th.table-total"), Tt),
                  ge(p.find("th.table-last"), lt),
                  ge(p.find("th.table-tornstats"), Et);
              }
            })
            .catch((t) => console.log("fetch error", t));
      }
      function vt(M) {
        let T = se("company-history-items"),
          P = 0;
        T && (P = Object.keys(T).length);
        const t = new Date(),
          E = new Date(
            new Date(t.setDate(t.getDate() - 1)).setHours(t.getHours() - 2)
          ).format("yyyy-MM-dd"),
          N = le("company-history-items", E);
        const z = le(
          "company-history-items",
          new Date(t.setDate(t.getDate() - 1)).format("yyyy-MM-dd")
        );
        if (null === M) {
          if (P <= 0)
            return void console.log("No historical data, skip automatically obtaining company output data");
            if (N)
              return void console.log(
                "This output data has already been saved, skip the automatic acquisition of company output data"
              );
            console.log("The production data of this time has not been saved yet, and the company's production data will be automatically obtained");
        }
        var e = `https://api.torn.com/company/?selections=profile,employees,stock,detailed,news&key=${x}`;
        const R = We("#tips-view-company");
        R.text("---Detection---"),
        fetch(e)
          .then(
            (t) => (t.ok ? t.json() : void R.text("---detection failure---")),
            (t) => {
              R.text("---Network exception---");
              }
            )
            .then((g) => {
              console.log(g);
              var t = g.company_detailed.trains_available,
                { rating: e, company_type: a } = g.company;
              let n = 0;
              var i = le("APICache_companies", "companies");
              if (i && i[a] && i[a].positions)
                for (const O in g.company_employees) {
                  var o = g.company_employees[O];
                  "Trainer" === i[a].positions[o.position].special_ability &&
                    n++;
                }
              var r = t + e + 3 * n;
              let s = `${t}(current)+${e}(star)`;
              if (
                (0 < n && (s += `+0~${3 * n}(Trainer)`),
                20 < r &&
                  We("#bingwa-top-warn").append(`
<div class="info-msg border-round">
<i class="info-icon"></i>
<div class="delimiter">
<div class="msg right-round" tabindex="0" role="alert">
The trains are about to overflow.
${s}
</div>
</div>
</div>`),
                M)
              ) {
                if (null != g.error && 7 == g.error.code)
                  throw (
                    (R.text("---Employees have no permission to view---"),
                    new Error("not a director"))
                  );
                null != g && R.text("---detection completed---"),
                  We("#companyname").text(g.company.name),
                  M.append(`
<table class="company-effectiveness" style="width:100%;background-color: #FFF5F7;font-size:12px;">
<tr class="head">
<th class="employee-basic table-position">post</th>
<th class="employee-basic table-days">days</th>
<th class="employee-ws table-man">MAN</th>
<th class="employee-ws table-int">INT</th>
<th class="employee-ws table-end">END</th>
<th class="employee-effectiveness table-ws" title="Working Stats">Stats</th>
<th class="employee-effectiveness table-ep" title="Effectiveness Prediction">Eff Est</th>
<th class="employee-basic table-last">last</th>
<th class="employee-basic table-username">name</th>
<th class="employee-effectiveness table-settled" title="Settled In">settled</th>
<th class="employee-effectiveness table-merits" title="Merits">merits</th>
<th class="employee-effectiveness table-education" title="Director Education">edu</th>
<th class="employee-effectiveness table-management" title="Management">management</th>
<th class="employee-effectiveness table-addiction" title="Addiction">addiction</th>
<th class="employee-effectiveness table-inactivity" title="Inactivity">inactivity</th>
<th class="employee-effectiveness table-total" title="Total">total</th>
<th class="employee-effectiveness table-wage" title="Wage">wage</th>
<th class="employee-status table-tornstats">TS</th>
</tr>
</table><br /><br />
<table class="company-history" style="width:100%;background-color: #FFF5F7;font-size:12px;">
<tr class="head">
<th colspan=2>Production Date</th>
<th>Revenue</th>
<th>Salary</th>
<th>Advertising fee</th>
<th>Profit</th>
<th>Total efficiency</th>
<th>Yield</th>
<th>Sales</th>
<th>Inventory</th>
<th>unit price</th>
<th>Cost</th>
<th> record time</th>
</tr>
</table>`);
                const $ = M.find(".company-effectiveness");
                $.find("th.employee-basic").attr(
                  "style",
                  "border: 1px solid darkgray;padding: 5px;background-color: #033649;color: white;font-weight: bold;text-align:center;"
                ),
                  $.find("th.employee-ws").attr(
                    "style",
                    "border: 1px solid darkgray;padding: 5px;background-color: #458994;color: white;font-weight: bold;text-align:center;"
                  ),
                  $.find("th.employee-effectiveness").attr(
                    "style",
                    "border: 1px solid darkgray;padding: 5px;background-color: #757947;color: white;font-weight: bold;text-align:center;"
                  ),
                  $.find("th.employee-status").attr(
                    "style",
                    "border: 1px solid darkgray;padding: 5px;background-color: #725334;color: white;font-weight: bold;text-align:center;"
                  );
              }
              let l =
                '<br /><table class="company-stock" style="width:100%;background-color: #FFF5F7;font-size:12px;"><tr class="head"><th>Stock type</th>';
              We.each(g.company_stock, function (t, e) {
                l += `<th>${t}</th>`;
              }),
                (l +=
                  '</tr><tr class="content"><td class="stock-title">unit price</td>'),
                We.each(g.company_stock, function (t, e) {
                  l += `<td class="stock-content">${Vt(e.price)}</td>`;
                }),
                (l +=
                  '</tr><tr class="content"><td class="stock-title">SOLD WORTH</td>'),
                We.each(g.company_stock, function (t, e) {
                  l += `<td class="stock-content">${Vt(e.sold_worth)}</td>`;
                }),
                (l +=
                  '</tr><tr class="content"><td class="stock-title">SOLD AMOUNT</td>'),
                We.each(g.company_stock, function (t, e) {
                  l += `<td class="stock-content">${Vt(e.sold_amount)}</td>`;
                }),
                (l += "</tr></table>"),
                We(".company-effectiveness").after(l),
                We(".company-stock")
                  .find("th")
                  .attr(
                    "style",
                    "border: 1px solid darkgray;padding: 5px;background-color: #033649;color: white;font-weight: bold;text-align:center;"
                  ),
                We(".company-stock")
                  .find("td.stock-content")
                  .attr(
                    "style",
                    "border: 1px solid darkgray;padding:5px;text-align:center;"
                  ),
                We(".company-stock")
                  .find("td.stock-title")
                  .attr(
                    "style",
                    "border: 1px solid darkgray;padding: 5px;background-color: #458994;color: white;font-weight: bold;text-align:center;"
                  );
              let d = [];
              We.each(g.company_employees, function (t, e) {
                (e.userid = t), (e.position_rank = xt(t)), d.push(e);
              }),
                d.sort(function (t, e) {
                  return t.position_rank - e.position_rank;
                });
              const f = { 0: "", 1: "eff-yellow", 3: "eff-red" };
              let u = 0,
                b = 0;
              We.each(d, function (t, e) {
                if (
                  ((u += e.wage || 0),
                  (b += e.effectiveness.total || 0),
                  null === M)
                )
                  return !0;
                var a = ft(e.last_action.timestamp),
                  n = 172800 <= a[0] ? 3 : 86400 <= a[0] ? 1 : 0,
                  i = e.effectiveness.addiction || 0,
                  o = i <= -10 ? 3 : i <= -5 ? 1 : 0,
                  r = e.effectiveness.inactivity || 0,
                  s = r < 0 ? 3 : 0,
                  l = e.effectiveness.merits || 0,
                  d = l <= 2 ? 3 : l <= 4 ? 1 : 0,
                  c = n + o + d,
                  p = 3 <= c ? 3 : 1 <= c ? 1 : 0,
                  c = mt(g.company.company_type, e.position, [
                    e.manual_labor,
                    e.intelligence,
                    e.endurance,
                  ]),
                  c = `
<tr class="content">
<td class="table-position tleft" position-value="${e.position_rank}">${
                    e.position
                  }</td>
<td class="table-days">${e.days_in_company}</td>
<td class="table-man tright ${c[2]}" man="${
                    e.manual_labor
                  }" title="MAN Required: ${Vt(c[5])}">${Nt(
                    e.manual_labor
                  )}</td>
<td class="table-int tright ${c[3]}" int="${
                    e.intelligence
                  }" title="INT Required: ${Vt(c[6])}">${Nt(
                    e.intelligence
                  )}</td>
<td class="table-end tright ${c[4]}" end="${
                    e.endurance
                  }" title="END Required: ${Vt(c[7])}">${Nt(e.endurance)}</td>
<td class="table-ws">${e.effectiveness.working_stats || 0}</td>
<td class="table-ep">${c[8]}</td>
<td class="table-last ${f[n]}" last-action-minutes="${a[0]}">${a[1]}</td>
<td class="table-username ${
                    f[p]
                  }"><a class="user name" href="/profiles.php?XID=${
                    e.userid
                  }" target="_blank">${e.name}</a></td>
<td class="table-settled">${e.effectiveness.settled_in || 0}</td>
<td class="table-merits ${f[d]}">${l}</td>
<td class="table-education">${e.effectiveness.director_education || 0}</td>
<td class="table-management">${e.effectiveness.management || 0}</td>
<td class="table-addiction ${f[o]}">${i}</td>
<td class="table-inactivity ${f[s]}">${r}</td>
<td class="table-total"><b>${e.effectiveness.total || 0}</b></td>
<td class="table-wage" wage="${e.wage}"><b>$${Vt(e.wage || 0)}</b></td>
<td class="table-tornstats tright ${c[1]}" effectiveness="${c[0]}"><span>${(
                    100 * c[0]
                  ).toFixed(0)}%</span></td>
</tr>`;
                const h = M.find(".company-effectiveness");
                h.children().append(c);
              });
              var c = parseInt(g.company.daily_income || 0),
                t = parseInt(g.company_detailed.advertising_budget || 0);
              let p = 0,
                h = 0,
                m = 0,
                x = 0,
                y = 0;
              We.each(g.company_stock, function (t, e) {
                (p += e.sold_amount * e.cost),
                  (h += e.sold_amount),
                  (m += e.in_stock),
                  (x += e.sold_worth);
              }),
                0 < h && (y = parseInt(x / h));
              let v = m;
              z
                ? (console.log("There is the last output data"),
                console. log(z),
                (v = z.Stock || m))
              : console.log(
                  "There is no previous production data, this time the production will be set equal to the sales volume"
                  );
              (e = m + h - v),
                (r = c - u - t - p),
                (e = {
                  Date: E,
                  Income: c,
                  Wages: u,
                  Ad: t,
                  Profit: r,
                  Effectiveness: b,
                  Produced: e,
                  Sold: h,
                  Stock: m,
                  Price: y,
                  Cost: p,
                  RecordTime: new Date().format("MM-dd hh:mm:ss"),
                });
              console.log(e);
              let w = !1;
              var _,
                k = g.news;
              for (_ in k) {
                const C = k[_];
                if (0 <= C.news.indexOf("report"))
                  if (
                    new Date(1e3 * (C.timestamp - 86400)).format(
                      "yyyy-MM-dd"
                    ) == E
                  ) {
                    w = !0;
                    break;
                  }
              }
              if (
                (N || !w
                  ? console.log("This output data has already been saved and will not be overwritten")
                  : (console.log("This output data has not been saved, save it now"),
                    ce("company-history-items", E, e),
                    (T = se("company-history-items"))),
                console.log(T),
                null === M)
              )
                return !0;
              const $ = M.find(".company-effectiveness");
              $.find("th").css("cursor", "pointer"),
                $.find("td").attr(
                  "style",
                  "border: 1px solid darkgray;padding:5px;text-align:center;"
                ),
                $.find("td.tright").css("text-align", "right"),
                $.find("td.tleft").css("text-align", "left"),
                $.find("td.eff-green").css("background-color", "#D0E9C6"),
                $.find("td.eff-yellow").css("background-color", "#FAF2CC"),
                $.find("td.eff-red").css("background-color", "#EBCCCC"),
                ge($.find("th.table-position"), wt),
                ge($.find("th.table-days"), _t),
                ge($.find("th.table-man"), kt),
                ge($.find("th.table-int"), $t),
                ge($.find("th.table-end"), It),
                ge($.find("th.table-ws"), St),
                ge($.find("th.table-si"), Dt),
                ge($.find("th.table-me"), At),
                ge($.find("th.table-de"), Ft),
                ge($.find("th.table-ma"), Ot),
                ge($.find("th.table-ad"), Ct),
                ge($.find("th.table-ia"), Mt),
                ge($.find("th.table-to"), Tt),
                ge($.find("th.table-wg"), Pt),
                ge($.find("th.table-last"), lt),
                ge($.find("th.table-tornstats"), Et),
                $.after(
                  `<br /><b>Real-time number of people: ${
                    Object.keys(g.company_employees).length
                  }, total wages: $${Vt(e.Wages)}, advertising costs：$${Vt(
                    e.Ad
                  )}，weekly sales：$${Vt(g.company.weekly_income)}</b><br />`
                );
              let I = {
                Income: 0,
                Wages: 0,
                Ad: 0,
                Profit: 0,
                Effectiveness: 0,
                Produced: 0,
                Sold: 0,
                Stock: 0,
                Price: 0,
                Cost: 0,
              };
              const S = M.find(".company-history");
              let D = 0,
                A = 0,
                F = 0;
              We.each(T, function (t, e) {
                var a = parseInt(
                  (new Date().getTime() - new Date(t).getTime()) / 864e5
                );
                if (31 < a)
                  return (
                    console.log(`delete expired data：${t}`),
                    pe("company-history-items", t),
                    delete T[t],
                    !0
                  );
                F++;
                t = `
<tr class="content">
<td>${F}</td>
<td>${t}</td>
<td>$${Vt(e.Income)}</td>
<td>$${Vt(e.Wages)}</td>
<td>$${Vt(e.Ad)}</td>
<td>$${Vt(e.Profit)}</td>
<td>${Vt(e.Effectiveness)}</td>
<td>${Vt(e.Produced)}</td>
<td>${Vt(e.Sold)}</td>
<td>${Vt(e.Stock)}</td>
<td>$${Vt(e.Price)}</td>
<td>$${Vt(e.Cost)}</td>
<td>${e.RecordTime || "-"}</td>
</tr>`;
                S.children().append(t),
                  (I.Income += parseInt(e.Income)),
                  (I.Wages += parseInt(e.Wages)),
                  (I.Ad += parseInt(e.Ad)),
                  (I.Profit += parseInt(e.Profit)),
                  (I.Effectiveness += parseInt(e.Effectiveness)),
                  (I.Produced += parseInt(e.Produced)),
                  (I.Sold += parseInt(e.Sold)),
                  (I.Stock += parseInt(e.Stock)),
                  (I.Price += parseInt(e.Price)),
                  (I.Cost += parseInt(e.Cost || 0)),
                  a <= 7 && ((D += parseInt(e.Profit)), A++);
              }),
                (P = Object.keys(T).length);
              e = `
<tr class="content">
<td colspan=2><b>average value</b></td>
<td>$${Vt((I.Income / P).toFixed(0))}</td>
<td>$${Vt((I.Wages / P).toFixed(0))}</td>
<td>$${Vt((I.Ad / P).toFixed(0))}</td>
<td>$${Vt((I.Profit / P).toFixed(0))}</td>
<td>${Vt((I.Effectiveness / P).toFixed(0))}</td>
<td>${Vt((I.Produced / P).toFixed(0))}</td>
<td>${Vt((I.Sold / P).toFixed(0))}</td>
<td>${Vt((I.Stock / P).toFixed(0))}</td>
<td>$${Vt((I.Price / P).toFixed(0))}</td>
<td>$${Vt((I.Cost / P).toFixed(0))}</td>
<td>${new Date().format("MM-dd hh:mm:ss")}</td>
</tr>`;
              S.children().append(e),
                S.find("th").attr(
                  "style",
                  "border: 1px solid darkgray;padding: 5px;background-color: #033649;color: white;font-weight: bold;text-align:center;"
                ),
                S.find("td").attr(
                  "style",
                  "border: 1px solid darkgray;padding:5px;text-align:center;"
                ),
                S.after(
                  `<br /><b>common ${P} Day data, total profit: $${Vt(
                    I. Profit
                  )}, profit for the past week (${A} days)：$${Vt(D)}</b>`
                );
            })
            .catch((t) => console.log("fetch error: ", t.message));
      }
      function wt(t) {
        return We(t).find("td.table-position").attr("position-value");
      }
      function _t(t) {
        return We(t).find("td.table-days").text();
      }
      function kt(t) {
        return We(t).find("td.table-man").attr("man");
      }
      function $t(t) {
        return We(t).find("td.table-int").attr("int");
      }
      function It(t) {
        return We(t).find("td.table-end").attr("end");
      }
      function St(t) {
        return We(t).find("td.table-ws").text();
      }
      function Dt(t) {
        return We(t).find("td.table-settled").text();
      }
      function At(t) {
        return We(t).find("td.table-merits").text();
      }
      function Ft(t) {
        return We(t).find("td.table-education").text();
      }
      function Ot(t) {
        return We(t).find("td.table-management").text();
      }
      function Ct(t) {
        return We(t).find("td.table-addiction").text();
      }
      function Mt(t) {
        return We(t).find("td.table-inactivity").text();
      }
      function Tt(t) {
        return We(t).find("td.table-total").text();
      }
      function Pt(t) {
        return We(t).find("td.table-wage").attr("wage");
      }
      function Et(t) {
        return We(t).find("td.table-tornstats").attr("effectiveness");
      }
      function Nt(t) {
        return t < 1e4
          ? t.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, function (t) {
              return t + ",";
            })
          : parseInt(t / 1e3) + "k";
      }
      function zt(n) {
        return new Promise((e, a) => {
          var t = `https://api.torn.com/user/${n}?selections=profile&key=${x}`;
          fetch(t)
            .then(
              (t) =>
                t.ok ? t.json() : void console.log("---probe failed " + n + "---"),
                (t) => {
                  console.log("---Network exception " + n + "---");
              }
            )
            .then((t) => {
              null != t
                ? "error" in t
                  ? a(t.error)
                  : (console.log(
                      `userId2otherIds: ${n} => (${t.faction.faction_id} - ${t.faction.position}) (${t.job.company_id} - ${t.job.position})`
                    ),
                    e([
                      t.faction.faction_id,
                      t.faction.position,
                      t.job.company_id,
                      t.job.position,
                    ]))
                : a();
            })
            .catch((t) => a(t));
        });
      }
      function Rt(o) {
        return new Promise((e, n) => {
          const i = We("#mainContainer")
            .find("div:contains('unavailable')")
            .last();
          i.text("The Frog Detector is working...");
          var t = `https://api.torn.com/faction/${o}?selections=basic,chain&key=${x}`;
          fetch(t)
            .then(
              (t) =>
                t.ok ? t.json() : void i.text("---probe failed " + o + "---"),
                (t) => {
                  i.text("---Network exception " + o + "---");
              }
            )
            .then((t) => {
              if (null != t)
                if ("error" in t) n(t.error);
                else {
                  We("#skip-to-content").text(`gang: ${t.name}`),
                  i.html(
                    `<b>Reputation:</b> ${Vt(
                      t. respect
                    )}&nbsp;&nbsp;&nbsp;&nbsp;<b>Number of days:</b> ${Vt(
                      t. age
                    )}&nbsp;&nbsp;&nbsp;&nbsp;<b>Maximum Combo:</b> ${Vt(
                      t.best_chain
                    )}&nbsp;&nbsp;&nbsp;&nbsp;<b>Members:</b> ${
                        Object.keys(t.members).length
                      }`
                    ),
                    0 < t.chain.current &&
                      i.append(
                        `</br /></br /><b>Combo:</b> ${Vt(
                            t.chain.current
                          )}/${Vt(
                            t.chain.max
                          )}&nbsp;&nbsp;&nbsp;&nbsp;<b>Start time:</b> ${new Date(
                            1e3 * t.chain.start
                          ).format(
                            "yyyy-MM-dd hh:mm:ss"
                          )}&nbsp;&nbsp;&nbsp;&nbsp;<b>Click timeout:</b> ${
                            t.chain.timeout
                          }(seconds)&nbsp;&nbsp;&nbsp;&nbsp;<b>Reputation Coefficient:</b> ${
                            t.chain.modifier
                          }&nbsp;&nbsp;&nbsp;&nbsp;<b>Cooldown time:</b> ${
                          t.chain.cooldown
                        }`
                      ),
                    t.territory_wars &&
                      0 < Object.keys(t.territory_wars).length &&
                      (i.append("</br />"),
                      We.each(t.territory_wars, function (t, e) {
                        e.assaulting_faction == o
                          ? i.append(
                              `</br /><b>Attacking territory:</b> ${e.territory}&nbsp;&nbsp;&nbsp;&nbsp;<b>Defending side:</b> <a href='/factions.php?step=profile&ID=${e. defending_faction}' target='_blank'>${e.defending_faction}</a>`
                              )
                            : i.append(
                                `</br /><b>Defending territory:</b> ${e.territory}&nbsp;&nbsp;&nbsp;&nbsp;<b>进攻方:</b> <a href='/factions.php?step=profile&ID=${e.assaulting_faction}' target='_blank'>${e.assaulting_faction}</a>`
                            ),
                          i.append(
                            `&nbsp;&nbsp;&nbsp;&nbsp;<b>Wall pushing progress:</b> ${Vt(
                                e.score
                              )}/${Vt(
                                e.required_score
                              )}&nbsp;&nbsp;&nbsp;&nbsp;<b>latest end time:</b> ${new Date(
                              1e3 * e.end_time
                            ).format("yyyy-MM-dd hh:mm:ss")}`
                          );
                      })),
                    t.peace &&
                      0 < Object.keys(t.peace).length &&
                      (i.append("</br />"),
                      We.each(t.peace, function (t, e) {
                        i.append(
                          `</br /><b>Peace Treaty:</b> <a href='/factions.php?step=profile&ID=${t}' target='_blank'>${t}</a>&nbsp;&nbsp;&nbsp;&nbsp;<b > Expiration time:</b> ${new Date(
                            1e3 * e
                          ).format("yyyy-MM-dd hh:mm:ss")}`
                        );
                      })),
                    t.raid_wars &&
                      0 < Object.keys(t.raid_wars).length &&
                      (i.append("</br />"),
                      We.each(t.raid_wars, function (t, e) {
                        e.raiding_faction == o
                          ? i.append(
                              `</br /><b>Assaulting:</b> <a href='/factions.php?step=profile&ID=${e.defending_faction}' target='_blank'>${e.defending_faction}</a>`
                              )
                            : i.append(
                                `</br /><b>Being</b> <a href='/factions.php?step=profile&ID=${e.raiding_faction}' target='_blank'>${e.raiding_faction}</b> a> Assault`
                              ),
                            i.append(
                              `&nbsp;&nbsp;&nbsp;&nbsp;<b>Assault progress (attack/defense):</b> ${
                              e.raider_score
                            }/${
                              e.defender_score
                            }&nbsp;&nbsp;&nbsp;&nbsp;<b>Starting time:</b> ${new Date(
                              1e3 * e.start_time
                            ).format("yyyy-MM-dd hh:mm:ss")}`
                          );
                      })),
                    We(".content-wrapper").last().append(`
<table id="faction-members" style="width:100%;background-color: #FFF5F7;font-size:12px;">
<tr class="head">
<th>first name</th>
<th>days</th>
<th>Last activity</th>
<th>Status</th>
<th>role</th>
</tr>
</table>`);
                  const a = We("#faction-members");
                  We.each(t.members, function (t, e) {
                    e = `
<tr class="content">
<td><a href='/profiles.php?XID=${t}' target='_blank'>${e.name}</a></td>
<td>${e.days_in_faction}</td>
<td>${e.last_action.relative}</td>
<td>${e.status.description}</td>
<td>${e.position}</td>
</tr>`;
                    a.children().append(e);
                  }),
                    a
                      .find("th")
                      .attr(
                        "style",
                        "border: 1px solid darkgray;padding: 5px;background-color: #033649;color: white;font-weight: bold;text-align:center;"
                      ),
                    a
                      .find("td")
                      .attr(
                        "style",
                        "border: 1px solid darkgray;padding:5px;text-align:center;"
                      ),
                    e();
                }
              else n();
            })
            .catch((t) => i.text(t));
        });
      }
      function jt(r) {
        return new Promise((t, i) => {
          if (
            0 <=
            We("div.company-details")
              .children("div.title-black")
              .text()
              .indexOf("Oil Rig")
          ) {
            var e,
              a = We("div.company-details")
                .find("li:contains('Daily income')")
                .text()
                .replace(/[^\d]/g, "");
            for (let t = 250; 120 <= t; --t)
              a % t == 0 &&
                ((e = parseInt(a / t)),
                We("div.company-details")
                  .children("div.title-black")
                  .append(
                    `<span class="m-hide"> - Estimated Sales: ${t} x ${Vt(e)} </span>`
                    ));
            }
            const o = We("#mainContainer")
              .find("div:contains('unavailable')")
              .last();
            o.text("The frog detector is working...");
            var n = `https://api.torn.com/company/${r}?selections=profile&key=${x}`;
            fetch(n)
              .then(
                (t) =>
                  t.ok ? t.json() : void o.text("---Detection failed " + r + "---"),
                (t) => {
                  o.text("---Network exception " + r + "---");
              }
            )
            .then((e) => {
              if (null != e)
                if ("error" in e) i(e.error);
                else {
                  var a,
                    t = {
                      1: "Hair Salon",
                      2: "Law Firm",
                      3: "Flower Shop",
                      4: "Car Dealership",
                      5: "Clothing Store",
                      6: "Gun Shop",
                      7: "Game Shop",
                      8: "Candle Shop",
                      9: "Toy Shop",
                      10: "Adult Novelties",
                      11: "Cyber Cafe",
                      12: "Grocery Store",
                      13: "Theater",
                      14: "Sweet Shop",
                      15: "Cruise Line",
                      16: "Television Network",
                      18: "Zoo",
                      19: "Firework Stand",
                      20: "Property Broker",
                      21: "Furniture Store",
                      22: "Gas Station",
                      23: "Music Store",
                      24: "Nightclub",
                      25: "Pub",
                      26: "Gents Strip Club",
                      27: "Restaurant",
                      28: "Oil Rig",
                      29: "Fitness Center",
                      30: "Mechanic Shop",
                      31: "Amusement Park",
                      32: "Lingerie Store",
                      33: "Meat Warehouse",
                      34: "Farm",
                      35: "Software Corporation",
                      36: "Ladies Strip Club",
                      37: "Private Security Firm",
                      38: "Mining Corporation",
                      39: "Detective Agency",
                      40: "Logistics Management",
                    };
                  if (
                    (We("#skip-to-content").html(`Company: ${e.company.name}`),
                    o.html(
                      `<b>Type:</b> ${
                        t[e.company.company_type]
                      }&nbsp;&nbsp;&nbsp;&nbsp;<b>star rating:</b> ${
                        e.company.rating
                      }&nbsp;&nbsp;&nbsp;&nbsp;<b>Number of employees:</b> ${
                        e.company.employees_hired
                      }/${
                        e.company.employees_capacity
                      }&nbsp;&nbsp;&nbsp;&nbsp;<b>Daily Sales:</b> $${Vt(
                        e.company.daily_income
                      )}&nbsp;&nbsp;&nbsp;&nbsp;<b>Weekly Sales:</b> $${Vt(
                        e.company.weekly_income
                      )}&nbsp;&nbsp;&nbsp;&nbsp;<b>Number of days:</b> ${Vt(
                        e.company.days_old
                      )}`
                    ),
                    28 == e.company.company_type)
                  ) {
                    o.append("&nbsp;&nbsp;&nbsp;&nbsp;<b>Estimated unit price x sales volume:</b>");
                    for (let t = 200; 120 <= t; --t)
                      e.company.daily_income % t == 0 &&
                        ((a = parseInt(e.company.daily_income / t)),
                        o.append(` ${t}x${Vt(a)}`));
                  } else
                    16 == e.company.company_type &&
                      ((t = parseInt(
                        e.company.daily_income / e.company.daily_customers
                      )),
                      o.append(
                        `&nbsp;&nbsp;&nbsp;&nbsp;<b>Unit price x sales volume:</b> ${Vt(
                            t
                          )}x${Vt(e.company.daily_customers)}`
                        ));
                    We(".content-wrapper").last().append(`
  <table id="company-members" style="width:100%;background-color: #FFF5F7;font-size:12px;">
  <tr class="head">
  <th>Name</th>
  <th>days</th>
  <th>Last activity</th>
  <th>Status</th>
  <th>job</th>
</tr>
</table>`);
                  const n = We("#company-members");
                  We.each(e.company.employees, function (t, e) {
                    e = `
<tr class="content">
<td><a href='/profiles.php?XID=${t}' target='_blank'>${e.name}</a></td>
<td>${e.days_in_company}</td>
<td>${e.last_action.relative}</td>
<td>${e.status.description}</td>
<td>${e.position}</td>
</tr>`;
                    n.children().append(e);
                  }),
                    n
                      .find("th")
                      .attr(
                        "style",
                        "border: 1px solid darkgray;padding: 5px;background-color: #033649;color: white;font-weight: bold;text-align:center;"
                      ),
                    n
                      .find("td")
                      .attr(
                        "style",
                        "border: 1px solid darkgray;padding:5px;text-align:center;"
                      );
                }
              else i();
            })
            .catch((t) => o.text(t));
        });
      }
      if (0 <= window.location.href.indexOf("factions.php?step=your")) {
        const $a = We("[href^='/forums.php#!p=forums&f=999&b=1&a=']").attr(
          "href"
        );
        let t = 0;
        if (
          (null != $a &&
            ((t = $a.substring(34)),
            window.localStorage.setItem("MY_FACTION_ID", t)),
          foo)
        ) {
          let e = setInterval(Bt, 1e3),
            a = 0;
          function Bt() {
            if (
              0 <=
                window.location.href.indexOf(
                  "factions.php?step=your#/tab=info"
                ) &&
              0 < We("li.position").length
            ) {
              clearInterval(e),
                (a = setInterval(Wt, 1e3)),
                console.log("li position"),
                Y("div.f-war-list", "ul.table-body");
              const t = We("div[data-faction]").attr("data-faction");
              bt(t);
            }
          }
          function Wt() {
            console.log("faction info"),
              window.location.href.indexOf("factions.php?step=your#/tab=info") <
                0 && (clearInterval(a), (e = setInterval(Bt, 1e3)));
          }
        }
      }
      if (0 <= window.location.href.indexOf("factions.php?step=profile&")) {
        const Ia = We("#mainContainer")
          .find("div:contains('unavailable')")
          .last();
        if (0 < Ia.length) {
          if (0 <= window.location.href.indexOf("profile&ID=")) {
            const fID = /profile&ID=(\d+)/.exec(window.location.href)[1];
            console.log("fID " + fID),
              Rt(fID).catch((t) => console.log("factionPageRedraw " + t));
          } else if (0 <= window.location.href.indexOf("profile&userID=")) {
            const Sa = /userID=(\d+)/.exec(window.location.href)[1];
            console.log("userId " + Sa),
              zt(Sa)
                .then(function (t) {
                  console.log(t),
                    Rt(t[0]).catch((t) =>
                      console.log("factionPageRedraw " + t)
                    );
                })
                .catch((t) => console.log("userId2otherIds " + t));
          }
        } else if (foo) {
          const Da = setInterval(Bt, 1e3);
          function Bt() {
            if (0 < We("li.position").length) {
              clearInterval(Da),
                console.log("li position"),
                Y("div.f-war-list", "ul.table-body");
              const t = We("div[data-faction]").attr("data-faction");
              bt(t);
            }
          }
        }
      }
      if (0 <= window.location.href.indexOf("p=corpinfo&"))
        if (0 <= window.location.href.indexOf("corpinfo&ID=")) {
          const Aa = /corpinfo&ID=(\d+)/.exec(window.location.href)[1];
          console.log("companyID " + Aa),
            new Promise(function (t, e) {
              setTimeout(function () {
                console.log("2 Seconds"), t();
              }, 2e3);
            })
              .then(function () {
                jt(Aa).catch((t) => console.log("companyPageRedraw " + t));
              })
              .catch((t) => console.log("companyPageRedraw " + t));
        } else if (0 <= window.location.href.indexOf("corpinfo&userID=")) {
          const Sa = /userID=(\d+)/.exec(window.location.href)[1];
          console.log("userId " + Sa),
            zt(Sa)
              .then(function (a) {
                return new Promise(function (t, e) {
                  setTimeout(function () {
                    console.log("2 Seconds"), t(a);
                  }, 2e3);
                });
              })
              .then(function (t) {
                console.log(t),
                  jt(t[2]).catch((t) => console.log("companyPageRedraw " + t));
              })
              .catch((t) => console.log("userId2otherIds " + t));
        }
      if (
        "https://www.torn.com/competition.php" == window.location.href ||
        "https://www.torn.com/competition.php#/p=main" == window.location.href
      ) {
        const Ia = We("#mainContainer").find("div:contains('access')").last();
        if (0 < Ia.length) {
          Ia.text("Frog detector working...");
          const Fa = `https://api.torn.com/torn/?selections=competition&key=${x}`;
          fetch (Fa)
            .then(
              (t) => (t.ok ? t.json() : void Ia.text("---Detection failed ---")),
              (t) => {
                Ia.text("---Network exception ---");
              }
            )
            .then((t) => {
              We(".content-wrapper").last().append(`
<table id="elim-teams" style="margin-top:10px;width:100%;background-color: #FFF5F7;font-size:12px;">
<tr class="head">
<th>rank</th>
<th>team</th>
<th>Status</th>
<th>Score</th>
<th>life</th>
<th>Number of participants</th>
<th>Attack wins</th>
<th> was attacked</th>
</tr>
</table>`);
              const e = We("#elim-teams"),
                a = t.competition.teams;
              a.forEach(function (t) {
                t = `
<tr class="content">
<td>${t.position}</td>
<td>${t.name}</td>
<td>${t.status}</td>
<td>${t.score}</td>
<td>${t.lives}</td>
<td>${t.participants}</td>
<td>${t.wins}</td>
<td>${t.losses}</td>
</tr>`;
                e.children().append(t);
              }),
                e
                  .find("th")
                  .attr(
                    "style",
                    "border: 1px solid darkgray;padding: 5px;background-color: #033649;color: white;font-weight: bold;text-align:center;"
                  ),
                e
                  .find("td")
                  .attr(
                    "style",
                    "border: 1px solid darkgray;padding:5px;text-align:center;"
                  );
            })
            .catch((t) => Ia.text(t));
        }
      }
      if (0 <= window.location.href.indexOf("competition.php")) {
        const Oa = setInterval(Lt, 500);
        function Lt() {
          We(".description").next().remove(), We(".description").remove();
          const t = We("#e-showAvailable-targets").parent();
          if (0 < t.length && "1" != t.attr("hasdone")) {
            t.after(`
<div id="elim-parade">
<div class="title-black m-top10 title-toggle tablet top-round faction-title active title" data-title="description" role="heading" aria-level="5">Elimination Parade
</div>
<div class="cont-gray bottom-rounded content" style="overflow:hidden; margin-bottom:10px;">
<div class="button-wrap" style="margin:5px; float:left">
<button id="elim-parade-start-btn" class="torn-btn" style="margin:5px;">Start the parade</button>
<button id="elim-parade-stop-btn" class="torn-btn" style="margin:5px;">Pause the parade</button>
<p id="elim-parade-status" style="height:12px; padding:6px 1px;"></p>
</div>
</div>
</div>`),
              t.attr("hasdone", "1");
            const e = We("#competition-wrap")
              .children(".team-list-wrap")
              .children(".competition-list")
              .children("li");
            e.each(function () {
              var t = pt(
                We(this)
                  .find("a.user.name")
                  .attr("href")
                  .replace(/[^0-9|-]/gi, "")
              );
              0 != t[0] &&
                We(this)
                  .children("ul.list-cols")
                  .children("li.attack")
                  .children("a")
                  .text(t[2]);
            });
            let i = !0;
            We("#elim-parade-start-btn").click(function () {
              (i = !0),
                We("#elim-parade-start-btn").prop("disabled", !0),
                We("#elim-parade-stop-btn").removeAttr("disabled");
              const t = e.first();
              t.length <= 0
                ? (We("#elim-parade-status").text("No user list found"),
                We("#elim-parade-start-btn"). removeAttr("disabled"))
              : (We("#elim-parade-status").text("The parade begins"),
                setTimeout(() => {
                  !(function e(a) {
                    if ("1" == a.attr("detected"))
                      We("#elim-parade-status").text("The user has completed"),
                        setTimeout(() => {
                          e(a. next());
                        }, 0);
                    else if (a.length <= 0 || 0 == i)
                      We("#elim-parade-status").text("The military parade has ended"),
                          We("#elim-parade-start-btn").removeAttr("disabled"),
                          We("#elim-parade-stop-btn").prop("disabled", !0);
                      else {
                        a.attr("detected", "1");
                        const n = a
                          .find("a.user.name")
                          .attr("href")
                          .replace(/[^0-9|-]/gi, "");
                        We("#elim-parade-status").text("is parading: " + n),
                          be(
                            n,
                            function (t) {
                              a
                                .children("ul.list-cols")
                                .children("li.attack")
                                .children("a")
                                .text(Qt(t.estimate_bs)),
                                ce("battlestats", n, t.estimate_bs),
                                ce("networths", n, t.personalstats.networth),
                                setTimeout(() => {
                                  e(a.next());
                                }, 1e3);
                            },
                            function (t) {
                              We("#elim-parade-status").text(
                                "Frog probe " + n + " failed " + t
                              ),
                                setTimeout(() => {
                                  e(a.next());
                                }, 1e3);
                            }
                          );
                      }
                    })(t);
                  }, 1e3));
            }),
              We("#elim-parade-stop-btn").click(function () {
                i = !1;
              });
          }
        }
      }
      if (
        bounty_parade &&
        window.location.href.indexOf("bounties.php#!p=main")
      ) {
        const Ca = setInterval(Gt, 2e3);
        function Gt() {
          const t = We("ul.bounties-list").children(),
            e = t.first();
          e.length <= 0
            ? We("div.bounties-total").text("No user list found")
            : "1" == e.attr("detected") ||
              (We("div.bounties-total").text("Parade begins"),
              setTimeout(() => {
                !(function e(a) {
                  a.attr("detected", "1");
                  const n = a. find("div. status");
                  if (0 < n. children(".t-red"). length)
                    We("div.bounties-total").text("This item has been paraded"),
                      setTimeout(() => {
                        e(a. next());
                      }, 0);
                  else if (null == a.attr("data-id"))
                    We("div.bounties-total").text("The military parade on this page is over");
                  else {
                    const i = a. find("div. target"). children("a"),
                      o = i.attr("href").replace(/[^0-9]/gi, "");
                    var t = i. text();
                    We("div.bounties-total").text("A military parade: " + o + " " + t),
                      be(
                        o,
                        function (t) {
                          n.children(".t-green").text(Qt(t.estimate_bs)),
                            ce("battlestats", o, t.estimate_bs),
                            setTimeout(() => {
                              e(a.next());
                            }, 0);
                        },
                        function (t) {
                          We("div.bounties-total").text(
                            "Frog probe " + o + " failed " + t
                          ),
                            setTimeout(() => {
                              e(a.next());
                            }, 0);
                        }
                      );
                  }
                })(e);
              }, 0));
        }
      }
      if (mugoo && 0 <= window.location.href.indexOf("imarket.php")) {
        let d = window.location.href,
          c = setInterval(V, 500),
          f = 0;
        const Ma = [
            "Donator Pack",
            "Xanax",
            "Erotic DVD",
            "Drug Pack",
            "Feathery Hotel Coupon",
            "Anti Tank",
            "Large Suitcase",
            "Wind Proof Lighter",
            "Six Pack of Energy Drink",
            "Sierra Cosworth",
          ],
          Ta = [
            "Tribulus Omanense",
            "Peony",
            "African Violet",
            "Cherry Blossom",
            "Heather",
            "Ceibo Flower",
            "Edelweiss",
          ],
          Pa = [
            "Camel Plushie",
            "Lion Plushie",
            "Panda Plushie",
            "Monkey Plushie",
            "Chamois Plushie",
            "Red Fox Plushie",
            "Nessie Plushie",
          ],
          Ea = [
            "Can of X-MASS",
            "Can of Taurine Elite",
            "Can of Rockstar Rudolph",
            "Can of Red Cow",
            "Can of Munster",
            "Can of Santa Shooters",
          ];
        function V() {
          const t = We(".guns-list.cont-gray");
          if (t && 0 < t.length) {
            clearInterval(c),
              clearInterval(f),
              (d = window.location.href),
              (f = setInterval(qt, 500));
            const a = We(".msg.right-round");
            a.html(`
<div id="important" style="margin:6px 0px; overflow:hidden;"><div style="float:left; padding:2px; margin:3px; background-color:${Xe.gray}; color:white;">important</div></div>
<div id="flower" style="margin:6px 0px; overflow:hidden;"><div style="float:left; padding:2px; margin:3px; background-color:${Xe.gray}; color:white;">flowers</div></div>
<div id="plushie" style="margin:6px 0px; overflow:hidden;"><div style="float:left; padding:2px; margin:3px; background-color:${Xe.gray}; color:white;">doll</div></div>
<div id="can" style="margin:6px 0px; overflow:hidden;"><div style="float:left; padding:2px; margin:3px; background-color:${Xe.gray}; color:white;">able to drink</div></div>
`);
            for (let t = 0; t < Ma.length; t++) {
              const o = Ma[t].split(" ")[0];
              We("#important").append(
                `<div class="border-round header-link" style="float:left; cursor:pointer; padding:2px; margin:3px; background-color:${Xe.yellowgreen}; color:white;" name="${Ma[t]}">${o}</div>`
              );
            }
            for (let t = 0; t < Ta.length; t++) {
              const r = Ta[t].split(" ")[0];
              We("#flower").append(
                `<div class="border-round header-link" style="float:left; cursor:pointer; padding:2px; margin:3px; background-color:${Xe.pink}; color:white;" name="${Ta[t]}">${r}</div>`
              );
            }
            for (let t = 0; t < Pa.length; t++) {
              const s = Pa[t].replace(/ Plushie/g, "");
              We("#plushie").append(
                `<div class="border-round header-link" style="float:left; cursor:pointer; padding:2px; margin:3px; background-color:${Xe.blue}; color:white;" name="${Pa[t]}">${s}</div>`
              );
            }
            for (let t = 0; t < Ea.length; t++) {
              const l = Ea[t].replace(/Can of /g, "");
              We("#can").append(
                `<div class="border-round header-link" style="float:left; cursor:pointer; padding:2px; margin:3px; background-color:${Xe.yellow}; color:white;" name="${Ea[t]}">${l}</div>`
              );
            }
            We(".header-link").click(function () {
              const t = We(this).attr("name"),
                e =
                  "/imarket.php#/p=shop&step=shop&type=&searchname=" +
                  t.replace(/ /g, "+");
              console.log(e), (window.location.href = e);
            });
            let I = We(".items")
              .children(":first")
              .find("[itemid]")
              .attr("itemid");
            I =
              I ||
              t
                .children(":first")
                .find("img.torn-item.item-plate")
                .attr("src")
                .replace(/[^\d]/g, "");
            const n = t.children(":first").find(".name.t-gray-6").text();
            if (
              0 <= Ma.indexOf(n) ||
              0 <= Ta.indexOf(n) ||
              0 <= Pa.indexOf(n) ||
              0 <= Ea.indexOf(n)
            ) {
              let d = {};
              const p = le("bazaar_cache", n);
              let c = 0;
              const h = We(".desc.t-blue-cont.t-overflow");
              if (
                (h.each(function (t, e) {
                  const a = We(this).find(".price.t-gray-6"),
                    n = We(this).find(".user.t-overflow").children("a"),
                    i = n.attr("href"),
                    o = i ? i.replace(/[^\d]/g, "") : 0,
                    r = a.text().split("(")[0].trim(),
                    s = Yt(r),
                    l = a.text().split("(")[1].replace(/\)/g, "").trim();
                  (d[o] = { price: s, price_formal: r, amount: l }),
                    s > c && (c = s);
                }),
                !We.isEmptyObject(p))
              )
                for (var e in p)
                  if (null == d[e] && p[e].price >= c) {
                    const g = `
<li>
<span class="item-desc">
<span class="item">
<img class="img___3jDmV" src="/images/items/${I}/large.png?v=1528808940574" alt="${n}">
<a class="item-hover" href="/bazaar.php?userID=${e}"></a>
</span>
<span class="desc t-blue-cont t-overflow">
<span class="user t-overflow">
<a href="/bazaar.php?userID=${e}">Pampa's bazaar</a>
</span>
<span class="name t-gray-6">${n}</span>
<span class="price t-gray-6"> ${p[e].price_formal}
<span class="stock t-gray-9">(${p[e].amount})</span>
</span>
</span>
</span>
</li>`;
                    t.children(":last").before(g);
                  }
              Ht(I, n, d, p);
            }
            const i = We(".desc.t-blue-cont.t-overflow");
            i.each(function (t, e) {
              const v = We(this).find(".price.t-gray-6"),
                w = We(this).find(".user.t-overflow").children("a"),
                a = w.attr("href"),
                _ = a ? a.replace(/[^\d]/g, "") : 0;
              v.prev().remove();
              const n = v.text().split("(")[0].trim(),
                k = Yt(n),
                $ = v.text().split("(")[1].replace(/\)/g, "").trim();
              be(_, function (t) {
                const e = ft(t.last_action.timestamp),
                  a = t.status.color,
                  n = ut(t.status.description, t.status.state, t.status.until),
                  i = t.job.company_type,
                  o = t.basicicons.icon72,
                  r = t.last_action.status,
                  s = t.bazaar,
                  l = t.faction.faction_id;
                let d = {};
                if (
                  (s.map(function (t, e, a) {
                    d[t.ID] = {
                      name: t.name,
                      quantity: t.quantity,
                      price: t.price,
                    };
                  }),
                  !(I in d))
                )
                  return v.parent().parent().parent().remove(), !0;
                {
                  const x = d[I].quantity,
                    y = d[I].price;
                  (x == $ && y == k) ||
                    v.html(
                      `${Yt(y)} <span class="stock t-gray-9">(${x})</span>`
                    );
                }
                l in qe &&
                  w.parent().parent().css("background-color", Xe.green);
                let c = "";
                c =
                  "Online" == r
                    ? '<span title="<b>Online</b>" style="width:16px;height:16px;margin:0px 2px;vertical-align:bottom; display:inline-block; background-position:0px 0; background-image:url(/images/v2/svg_icons/sprites/user_status_icons_sprite.svg)"></span>'
                    : "Offline" == r
                    ? '<span title="<b>Offline</b>" style="width:16px;height:16px;margin:0px 2px;vertical-align:bottom; display:inline-block; background-position:-18px 0;   background-image:url(/images/v2/svg_icons/sprites/user_status_icons_sprite.svg)"></span>'
                    : '<span title="<b>Idle</b>" style="width:16px;height:16px;margin:0px 2px;vertical-align:bottom; display:inline-block; background-position:-1098px 0;  background-image:url(/images/v2/svg_icons/sprites/user_status_icons_sprite.svg)"></span>';
                let p = "beat",
                h = Xe.purple;
              5 == i && ((p = "clothes"), (h = Xe.gray)),
                null != o && ((p = "new"), (h = Xe.gray)),
                  w.text("");
                const g = `${c}<a href="/profiles.php?XID=${_}">${t.name}</a>`,
                  f = `<a class= "border-round" style="padding:1px 2px;background-color:${h};color:white;" href="/loader.php?sid=attack&user2ID=${_}">${p}</a>`;
                w.before(f), w.after(g);
                let u = 0;
                null != s &&
                  s.map(function (t, e, a) {
                    u += t.quantity * t.market_price;
                  }),
                  v.parent().siblings(".item").css("margin", "2px 10px"),
                  v
                    .parent()
                    .siblings(".item")
                    .append(
                      `<div style="font-size: 13px; line-height: 17px; text-align: center;"><span class="border-round" style="background-color: ${
                        Xe.purple
                      }; color: white; padding: 1px 3px;">All stores ${Qt(
                        u
                      )}</span></div>`
                    );
                let b = "";
                "blue" == a && (b = Xe.blue),
                  "green" == a && (b = Xe.green),
                  "red" == a && (b = Xe.red);
                let m = `
<span class="left" style="">
<span class= "border-round" style="padding: 1px 3px; background-color: ${b}; color: white;" title="Status: ${
                  t.status.description
                }">${n[0]}</span>
<span style="padding: 1px 3px;" title="Last Action: ${
                  t.last_action.relative
                }">${e[1]}</span>
<span style="padding: 1px 3px;" title="BattleStats: ${Qt(t.estimate_bs)}">${Qt(
                  t.estimate_bs
                )}</span>
</span>`;
                v.after(m);
              });
            });
          }
        }
        function qt() {
          d != window.location.href &&
            (clearInterval(c),
            clearInterval(f),
            (d = window.location.href),
            (c = setInterval(V, 500)));
        }
        function Ht(o, r, s, l) {
          var t = `https://api.torn.com/market/${o}?selections=bazaar&key=${x}`;
          fetch(t)
            .then((t) => t.json())
            .then((t) => {
              console.log(o + " bazaar API fetched");
              var e = t.bazaar;
              let a = {};
              for (let t = 0; t < e.length; t++) {
                if (!We.isEmptyObject(l))
                  for (var n in l)
                    l[n].apiid == e[t].ID &&
                      (a[n] = {
                        apiid: e[t].ID,
                        price: e[t].cost,
                        price_formal: Yt(e[t].cost),
                        amount: e[t].quantity,
                      });
                if (!We.isEmptyObject(s))
                  for (var i in s)
                    s[i].price == e[t].cost &&
                      s[i].amount == e[t].quantity &&
                      (a[i] = {
                        apiid: e[t].ID,
                        price: e[t].cost,
                        price_formal: Yt(e[t].cost),
                        amount: e[t].quantity,
                      });
              }
              ce("bazaar_cache", r, a);
            })
            .catch((t) => console.log("fetch error", t));
        }
      }
      if (mugoo && 0 <= window.location.href.indexOf("pmarket.php")) {
        const ba = setInterval(V, 500);
        function V() {
          const t = We(".users-point-sell").children("li");
          if (t && 0 < t.length) {
            clearInterval(ba);
            let r = [];
            We("li.total-price").attr("id", "total-price");
            const e = document.getElementById("total-price"),
              s = window.getComputedStyle(e).width.replace(/px$/g, "");
            t.each(function (t, e) {
              const c = We(this).find(".total-price"),
                a = We(this).find(".user.name").attr("href"),
                n = a ? a.replace(/[^\d]/g, "") : 0,
                i = We(this).find(".user.faction").attr("href"),
                o = i ? i.replace(/[^\d]/g, "") : 0;
              o in qe && We(this).css("background-color", Xe.green),
                -1 == r.indexOf(n) &&
                  (r.push(n),
                  Number(s) < 200 && c.text(""),
                  be(n, function (t) {
                    const e = ft(t.last_action.timestamp),
                      a = t.status.color,
                      n = ut(
                        t.status.description,
                        t.status.state,
                        t.status.until
                      ),
                      i = t.job.company_type,
                      o = t.basicicons.icon72;
                    let r = "beat",
                    s = Xe.purple;
                  5 == i && ((r = "clothes"), (s = Xe.gray)),
                    null != o && ((r = "new"), (s = Xe.gray));
                    let l = "";
                    "blue" == a && (l = Xe.blue),
                      "green" == a && (l = Xe.green),
                      "red" == a && (l = Xe.red);
                    let d = "<span class='left'>";
                    (d += `<span style="padding:1px;margin:1px;background-color:${s};color:white;">${r}</span>`),
                      (d += `<span style="padding:1px;margin:1px;background-color:${l};color:white;" title="Status: ${t.status.description}">${n[0]}</span>`),
                      (d += `<span style="padding:1px;margin:1px;background-color:${Xe.gray};color:white;" title="Last Action: ${t.last_action.relative}">${e[1]}</span>`),
                      (d += `<span style="padding:1px;margin:1px;background-color:${
                        Xe.blue
                      };color:white;" title="BattleStats: ${Qt(
                        t.estimate_bs
                      )}">${Qt(t.estimate_bs)}</span></span>`),
                      c.prepend(d);
                  }));
            });
          }
        }
      }
      if (mugoo && 0 <= window.location.href.indexOf("bazaar.php")) {
        let f = {};
        const Ia = We("#mainContainer")
          .find("div:contains('unavailable')")
          .last();
        if (0 < Ia.length) {
          const Na = window.location.href.replace(/[^\d]/g, "");
          Ia.text("The Frog Detector is working...");
          const Fa = `https://api.torn.com/user/${Na}?selections=basic,bazaar&key=${x}`;
          fetch(Fa)
            .then(
              (t) =>
                t.ok ? t.json() : void Ia.text("---probe failed " + fID + "---"),
                (t) => {
                  Ia.text("---Network exception " + fID + "---");
              }
            )
            .then((a) => {
              if (
                (Ia.html(
                  `Frog detected successfully ^_^ [ <a class="t-blue" href="/profiles.php?XID=${a.player_id}">${a.name}</a> shop ]`
                  ),
                  null == a. bazaar)
                )
                  Ia.html(
                    `The goods are sold out :( [ <a class="t-blue" href="/profiles.php?XID=${a.player_id}">${a.name}</a>'s shop ]`
                ),
                  console.log("no item in bazaar");
              else {
                We(".content-wrapper")
                  .last()
                  .append(
                    '<div class="bazaar-wrapper" style="margin-top:10px;"><div class="bazaar-content" style="width:inherit; overflow:hidden; background-color:white;"></div></div>'
                  );
                for (let e = 0; e < a.bazaar.length; e++) {
                  var n = (
                    ((a.bazaar[e].price - a.bazaar[e].market_price) /
                      a.bazaar[e].market_price) *
                    100
                  ).toFixed(2);
                  let t = "";
                  (t =
                    0 < n
                      ? `&nbsp;&nbsp;<span class="change up"><i class="arrow-change-icon" role="img" aria-label="stock price is up"></i><span class="t-green">${n}%</span></span>`
                      : `&nbsp;&nbsp;<span class="change down"><i class="arrow-change-icon" role="img" aria-label="stock price is down"></i><span class="t-red">${n}%</span></span>`),
                    We(".bazaar-content").append(`
<div class="item-wrapper" style="width:288px; float:left; overflow:hidden;">
<div style="width:100px; height:50px; margin:7px; padding:3px; float:left; border:1px solid darkgray;">
<img src="/images/items/${a.bazaar[e].ID}/large.png">
</div>
<div class="item-description" style="width:150px; margin:7px; float:left; border:1px solid darkgray;overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
<p class="item-name" style="margin:5px">${a.bazaar[e].name}</p>
<p class="item-price" style="margin:5px">${Yt(a.bazaar[e].price)}${t}</p>
<p class="item-quantity" style="margin:5px">(${a.bazaar[e].quantity} in stock)
<span class="t-blue">&nbsp;&nbsp;${Qt(
                      a.bazaar[e].price * a.bazaar[e].quantity
                    )}</span>
</p>
</div>
</div>`);
                }
              }
            })
            .catch((t) => Ia.text(t));
        } else {
          q();
          const ba = setInterval(V, 500);
        }
        function q() {
          const e = le("ITEMS", "last-updated");
          if (null != e && null != e) {
            const a = new Date();
            let t = new Date(e);
            t.setDate(t.getDate() + 1), t < a && Xt();
          } else Xt();
        }
        function Xt() {
          var t = `https://api.torn.com/torn/?selections=items&key=${x}`;
          fetch(t)
            .then((t) => t.json())
            .then((t) => {
              console.log("API fetched");
              let e = {};
              const a = new Date();
              for (var n in ((e["last-updated"] = a.toString()), t.items))
                e[n] = t.items[n].market_value;
              window.localStorage.setItem("ITEMS", JSON.stringify(e));
            })
            .catch((t) => console.log("fetch error", t));
        }
        function V() {
          const g = We("[class*='messageContent___']");
          if ("1" != g.attr("hasdone")) {
            g.attr("hasdone", "1"), We("#sum").remove();
            let t = '<div id="sum">',
              e = 0;
            for (var a in f)
              (t +=
                " (<span class='t-green'> " +
                f[a].name +
                " " +
                f[a].total_formal +
                " </span>) "),
                (e += f[a].total);
            (t +=
              "<span class='t-red'><b> Total Selected: " +
              Qt(e) +
              " </b></span></div>"),
              g.append(t);
          }
          const t = le("ITEMS", "last-updated"),
            e = We("[class^='rowItems___']").children();
          t &&
            e &&
            0 < e.length &&
            e.each(function (t, e) {
              const a = We(this).find("[class^='name___']").text(),
                n = We(this).find("[class^='price___']");
              let i = 0;
              "" != n.text() && (i = n.text().replace(/[^\d]/g, ""));
              const o = We(this).find("img").attr("src");
              let r = 0,
                s = 0;
              null != o &&
                ((s = o.split("/")[3]), 0 < s && (r = le("ITEMS", s)));
              const l = We(this).find("[class^='amount___']");
              let d = 0;
              if (
                ("" != l.text() && (d = l.text().replace(/[^\d]/g, "")),
                0 < r && 0 < i && 0 < d && "1" != We(this).attr("hasdone"))
              ) {
                We(this).attr("hasdone", "1");
                const c = (((i - r) / r) * 100).toFixed(1),
                  p = Qt(i * d);
                l.append(
                  `&nbsp;&nbsp;<span><span class="t-blue">${p}</span></span>`
                ),
                  0 <= c
                    ? n.append(
                        `&nbsp;&nbsp;<span class="change up"><i class="arrow-change-icon" role="img" aria-label="stock price is up"></i><span class="t-green">${c}%</span></span>`
                      )
                    : n.append(
                        `&nbsp;&nbsp;<span class="change down"><i class="arrow-change-icon" role="img" aria-label="stock price is down"></i><span class="t-red">${c}%</span></span>`
                      );
                const h = We(this).find("[class^='description___']");
                null != f[s] && h.css("background-color", "NavajoWhite"),
                  h.click(function () {
                    We(this).attr("selected")
                      ? (delete f[s],
                        We(this).removeAttr("selected"),
                        g.removeAttr("hasdone"),
                        We(this).css("background-color", ""))
                      : ((f[s] = {
                          name: a,
                          price: i,
                          amount: d,
                          total: i * d,
                          total_formal: Qt(i * d),
                        }),
                        We(this).attr("selected", "selected"),
                        g.removeAttr("hasdone"),
                        We(this).css("background-color", "NavajoWhite"));
                  });
              }
            });
        }
      }
      if (mugoo && 0 <= window.location.href.indexOf("imarket.php")) {
        const ba = setInterval(V, 500);
        function V() {
          const i = We(".buy-item-info").find(".private-bazaar");
          0 < i.length &&
            i.each(function (t, e) {
              if ("1" != We(this).attr("hasdone")) {
                We(this).attr("hasdone", "1");
                const a = We(this)
                    .find('[href^="bazaar"]')
                    .attr("href")
                    .replace(/[^\d]/g, ""),
                  n = We(this);
                be(a, function (t) {
                  n.attr("user_id", a),
                    n.attr("user_name", t.name),
                    n.attr("user_level", t.level),
                    n.attr("user_bs", Qt(t.estimate_bs)),
                    n.attr("user_last", t.last_action.relative),
                    n.attr("user_stat", t.status.description),
                    n.attr("user_job_type", t.job.company_type),
                    n.attr("newbie", t.basicicons.icon72);
                });
              }
            });
          const t = We(".buy-item-info-wrap").find(".private-bazaar");
          0 < t.length &&
            t.each(function (t, e) {
              if ("1" != We(this).attr("hasdone")) {
                const c = We(this)
                    .find('[href^="bazaar"]')
                    .attr("href")
                    .replace(/[^\d]/g, ""),
                  a = We(this).find(".user.faction").attr("href"),
                  n = a ? a.replace(/[^\d]/g, "") : 0;
                n in qe && We(this).css("background-color", Xe.green);
                const p = We(this);
                i.each(function (t, e) {
                  if (We(this).attr("user_id") == c) {
                    console.log(We(this).attr("user_name"));
                    const a = We(this).attr("user_name"),
                      n = We(this).attr("user_level"),
                      i = We(this).attr("user_bs"),
                      o = We(this).attr("user_last"),
                      r = We(this).attr("user_stat"),
                      s = We(this).attr("user_job_type"),
                      l = We(this).attr("newbie");
                    let t = "beat";
                    5 == s ? (t = "clothes") : null != l && (t = "new");
                    const d = `
<li class="private-bazaar wawa-bazaar" hasdone="1">
<ul class="item t-blue-cont h">
<li class="item-name">
<div class="item-t right t-gray-9">${r}</div>
<div class="name-t icons left">
<span class="t-gray-9">Lv:${n}</span>
<a class="user name" href="/profiles.php?XID=${c} ">
<span title="${a} [${c}]"><b>BS: ${i}</b><span></span></span>
</a>
</div>
<div class="name-t name-mobile left">
<span class="t-gray-9 italic">sold by</span>
<a class="t-blue" href="profiles.php?XID=${c}">BS: ${i}</a>
</div>
<div class="clear"></div>
</li>
<li class="cost">
<span class="t-gray-9" title="${r}">${o}</span>
</li>
<li class="view">
<a href="/loader.php?sid=attack&user2ID=${c}"><b>${t}</b></a>
</li>
<li class="clear"></li>
</ul>
</li>`;
                    return p.after(d), p.attr("hasdone", "1"), !1;
                  }
                });
              }
            });
        }
      }
      if (0 <= window.location.href.indexOf("loader.php?sid=attack&user2ID")) {
        const za = window.location.href.match(
            /loader\.php\?sid=attack\&user2ID=(\d+)/
          )[1],
          ba = setInterval(V, 300);
        function V() {
          const t = We("[class^='btn___']");
          if (0 < t.length) {
            const e = t[0];
            if (We(e).text().includes("CONTINUE")) {
              const a = We(e)
                .parent()
                .parent()
                .children(":first")
                .text()
                .split(" ");
              clearInterval(ba), console.log(a);
              const n = a[2],
                i = a[1],
                o = new Date(),
                r = parseInt(o.getTime() / 1e3),
                s = o.format("yyyy-MM-dd hh:mm:ss");
              if ("mugged" == i) {
                let t = a[5];
                console.log(t), "wallet" == t && (t = "$0");
                const l = {
                  timestring: s,
                  victim_id: za,
                  victim_name: n,
                  money_mugged: t,
                };
                ce("muglog", r, l);
              }
            }
          }
        }
      }
      if (0 <= window.location.href.indexOf("companies.php")) {
        We(".info-msg-cont").after(
          "<div id='effectiveness-wrap' style='margin-top:10px; overflow-x: auto;'></div>"
        ),
          We(".info-msg-cont").after(
            '<div id="bingwa-top-warn" class="info-msg-cont red border-round m-top10">'
          );
        const Sa = Se();
        console.log("userId " + Sa),
          zt(Sa)
            .then(function (t) {
              console.log(t);
              t = t[3];
              "Employee" == t
                ? yt(We("#effectiveness-wrap"))
                : "Director" == t && vt(We("#effectiveness-wrap"));
            })
            .catch((t) => console.log("userId2otherIds " + t));
        const Ra = setInterval(Jt, 1e3);
        function Jt() {
          const t = We(".employee-list-wrap")
            .children("ul.employee-list")
            .children("li");
          if (0 < t.length) {
            clearInterval(Ra);
            let n = {},
              i = 0;
            t.each(function (t, e) {
              var a = We(this).attr("data-user");
              (n[a] = i), (i += 1);
            }),
              window.localStorage.setItem("EMPLOYEE_RANK", JSON.stringify(n));
          }
        }
      } else vt(null);
      if (0 <= window.location.href.indexOf("joblist.php")) {
        const ja = setInterval(Ut, 500);
        function Ut() {
          const t = We("ul.rank-list");
          if (0 < t.length && "1" != t.attr("hasdone")) {
            t.attr("hasdone", "1");
            t.after(`
<div id="company_parade">
<div class="title-black m-top10 title-toggle tablet top-round faction-title active title" data-title="description" role="heading" aria-level="5">Company Parade</div>
<div class="cont-gray bottom-rounded content" style="overflow:hidden; margin-bottom:10px;">
<button id="company_parade_start_btn" class="torn-btn" style="margin:5px;">Start military parade</button>
<button id="company_parade_stop_btn" class="torn-btn" style="margin:5px;">Suspend military parade</button>
<span id="company_parade_tip" style="margin:5px;"></span>
</div>
</div>`);
            let a = !0;
            We("#company_parade_start_btn").click(function () {
              (a = !0),
                We("#company_parade_start_btn").prop("disabled", !0),
                We("#company_parade_stop_btn").removeAttr("disabled");
              const t = We("ul.company-list").children().first();
              t.length <= 0
                ? (We("#company_parade_tip").text("Company list not found"),
                We("#company_parade_start_btn"). removeAttr("disabled"),
                We("#company_parade_stop_btn").prop("disabled", !0))
              : (We("#company_parade_tip").text("The parade begins"),
                  We("#company_parade_table").length <= 0 &&
                    (We("#company_parade").after(`
<div id="company_parade_table">
<table style="margin:auto;background-color:white;font-size:12px;">
<tr class="head">
<th>Star </th>
<th>name</th>
<th>Boss</th>
<th>days</th>
<th>Number of employees</th>
<th title="24h not online">Inactive</th>
<th title="Less than 10 days on the job">New Employee</th>
<th>Daily Income</th>
<th>Daily unit price</th>
<th>weekly income</th>
<th> weekly unit price</th>
</tr>
</table>
</div>`),
                    We("#company_parade_table")
                      .find("th")
                      .attr(
                        "style",
                        "border: 1px solid darkgray;padding: 5px;background-color: black;color: white;font-weight: bold;text-align:center;"
                      )),
                  setTimeout(() => {
                    !(function d(c) {
                      if ("1" == c.attr("detected"))
                        We("#company_parade_tip").text("company completed"),
                        setTimeout(() => {
                          d(c. next());
                        }, 0);
                    else if (c.length <= 0 || 0 == a)
                      We("#company_parade_tip").text("The military parade is over"),
                          We("#company_parade_start_btn").removeAttr(
                            "disabled"
                          ),
                          We("#company_parade_stop_btn").prop("disabled", !0);
                      else {
                        c.attr("detected", "1");
                        const e = c
                            .children()
                            .children("li.view")
                            .children()
                            .attr("href"),
                          p = e ? e.replace(/[^\d]/g, "") : 0,
                          h = c.children().children("li.company").text();
                        var t = `https://api.torn.com/company/${p}?selections=profile&key=${x}`;
                        We("#company_parade_tip").text(`is parading：${p} ${h}`),
                          fetch(t)
                            .then((t) => t.json())
                            .then((a) => {
                              if ("company" in a) {
                                var n = a.company.director,
                                  i = a.company.employees[n].name;
                                let t = 0,
                                  e = 0;
                                var o,
                                  r = parseInt(new Date().getTime() / 1e3);
                                for (o in a.company.employees) {
                                  var s =
                                    a.company.employees[o].last_action
                                      .timestamp;
                                  86400 <= r - s && (t += 1);
                                  var l =
                                    a.company.employees[o].days_in_company;
                                  l < 10 && (e += 1);
                                }
                                We("#company_parade_table").children().append(`
<tr class="content">
<td>${a.company.rating}</td>
<td><a href="#!p=corpinfo&ID=${p}" target="_blank">${a.company.name}</a></td>
<td><a class="user name" href="/profiles.php?XID=${n}" target="_blank">${i}</a></td>
<td>${a.company.days_old}</td>
<td>${a.company.employees_hired}/${a.company.employees_capacity}</td>
<td>${t}</td>
<td>${e}</td>
<td>${Qt(a.company.daily_income)}</td>
<td>${Qt(a.company.daily_income / a.company.daily_customers)}</td>
<td>${Qt(a.company.weekly_income)}</td>
<td>${Qt(a.company.weekly_income / a.company.weekly_customers)}</td>
</tr>`),
                                  We("#company_parade_table")
                                    .find("td")
                                    .attr(
                                      "style",
                                      "border: 1px solid darkgray;padding:5px;text-align:center;"
                                    ),
                                  setTimeout(() => {
                                    d(c.next());
                                  }, 1e3);
                              } else
                                "error" in a &&
                                  We("#company_parade_tip").text(
                                    `Frog detection failed：${p} ${h} ${a.error.error}`
                                  );
                            })
                            .catch((t) => console.log(t));
                      }
                    })(t);
                  }, 1e3));
            }),
              We("#company_parade_stop_btn").click(function () {
                a = !1;
              });
          }
        }
      }
    }
    const Je = le("extcenter", "installedSpecs") || [];
    function Kt(t) {
      const e =
        document.getElementById("BINGWA-GLOBAL-STYLE") ||
        (function () {
          const t = document.createElement("style");
          return (
            (t.type = "text/css"),
            (t.id = "BINGWA-GLOBAL-STYLE"),
            document.head.appendChild(t),
            t
          );
        })();
      e.sheet.insertRule(t);
    }
    function Vt(t) {
      return 0 <= t.toString().indexOf(",")
        ? Number(t.replace(/,/g, ""))
        : Number.isNaN(Number(t))
        ? 0
        : t.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, function (t) {
            return t + ",";
          });
    }
    function Yt(t) {
      return 0 <= t.toString().indexOf("$")
        ? Number(t.replace(/\$|,/g, ""))
        : Number.isNaN(Number(t))
        ? 0
        : t
            .toString()
            .replace(/\d{1,3}(?=(\d{3})+$)/g, function (t) {
              return t + ",";
            })
            .replace(/^[^\$]\S+/, function (t) {
              return "$" + t;
            });
    }
    function Qt(t) {
      return t < 0
        ? "-" + Qt(-t)
        : 0 == t
        ? "0"
        : t <= 1
        ? (100 * t).toFixed(2) + "%"
        : t < 1e3
        ? "" + parseInt(t)
        : 1e3 <= t && t < 1e6
        ? (t / 1e3).toFixed(2) + "k"
        : 1e6 <= t && t < 1e9
        ? (t / 1e6).toFixed(2) + "m"
        : 1e9 <= t && t < 1e12
        ? (t / 1e9).toFixed(2) + "b"
        : 1e12 <= t && t < 1e15
        ? (t / 1e12).toFixed(2) + "t"
        : 1e15 <= t
        ? "MAX"
        : void 0;
    }
    function Zt(t) {
      return t < 0
        ? "-" + Zt(-t)
        : 0 == t
        ? "0"
        : t <= 1
        ? parseFloat((100 * t).toFixed(2)) + "%"
        : t < 1e3
        ? "" + parseInt(t)
        : 1e3 <= t && t < 1e6
        ? parseFloat((t / 1e3).toFixed(2)) + "k"
        : 1e6 <= t && t < 1e9
        ? parseFloat((t / 1e6).toFixed(2)) + "m"
        : 1e9 <= t && t < 1e12
        ? parseFloat((t / 1e9).toFixed(2)) + "b"
        : 1e12 <= t && t < 1e15
        ? parseFloat((t / 1e12).toFixed(2)) + "t"
        : 1e15 <= t
        ? "MAX"
        : "error";
    }
    function te(t) {
      return (t / 86400).toFixed(2), 1;
    }
    function ee(t) {
      return "[object Array]" === Object.prototype.toString.call(t)
        ? t
        : "[object Object]" === Object.prototype.toString.call(t)
        ? Object.values(t)
        : null;
    }
    function ae(t) {
      return (
        "[object Array]" === Object.prototype.toString.call(t) &&
        !(t.length <= 1) &&
        "[object Object]" === Object.prototype.toString.call(t[0]) &&
        0 < Object.keys(t[0]).length
      );
    }
    function ne(t) {
      var e = ee(t);
      if (null == e || e.length <= 0) return null;
      if (ae(e)) return e;
      for (let t = 0; t < e.length; ++t) {
        var a = ne(e[t]);
        if (null != a) return console.log(`Valid dataset found at node ${t}`), a;
      }
      return null;
    }
    function ie(t, e) {
      var a = t[e];
      if ("object" == typeof a) {
        for (var n in a) {
          var i = a[n];
          "object" == typeof i ? oe(a, n) : (t[n + "_" + e] = i);
        }
        delete t[e];
      }
    }
    function oe(t) {
      for (var e in t) ie(t, e);
    }
    function re(e) {
      var t = e[0];
      oe(t);
      let a = Object.keys(t);
      console.log(`item_keys: ${a}`);
      for (let t = 1; t < e.length; ++t) {
        var n = e[t];
        oe(n);
        var i = Object.keys(n);
        for (let t = 0; t < i.length; t++) {
          var o = i[t];
          console.log(`add item_key: ${o}`), -1 == a.indexOf(o) && a.push(o);
        }
      }
      let r = a.sort().join(",");
      for (let t = 0; t < e.length; ++t) {
        r += "\n";
        var s = e[t];
        oe(s);
        for (let e = 0; e < a.length; ++e) {
          let t = s[a[e]] + "";
          "object" == typeof t && (t = JSON.stringify(t)),
            (t =
              '"' +
              t
                .replace(/<[^>]+>/g, "")
                .trim()
                .replace(/\"/g, '""') +
              '"'),
            0 < e && (r += ","),
            (r += t);
        }
      }
      return encodeURIComponent(r);
    }
    function se(t) {
      if (void 0 !== window.localStorage)
        return null === window.localStorage.getItem(t)
          ? null
          : JSON.parse(window.localStorage.getItem(t));
    }
    function le(t, e) {
      t = se(t);
      if (void 0 !== t)
        return null === t ? null : void 0 !== t[e] ? t[e] : void 0;
    }
    function de(t, e) {
      void 0 === window.localStorage ||
        window.localStorage.setItem(t, JSON.stringify(e));
    }
    function ce(e, a, n) {
      if (void 0 !== window.localStorage)
        if (null === window.localStorage.getItem(e)) {
          let t = {};
          (t[a] = n), window.localStorage.setItem(e, JSON.stringify(t));
        } else {
          let t = JSON.parse(window.localStorage.getItem(e));
          (t[a] = n), window.localStorage.setItem(e, JSON.stringify(t));
        }
    }
    function pe(t, e) {
      if (
        void 0 !== window.localStorage &&
        null !== window.localStorage.getItem(t)
      ) {
        const a = JSON.parse(window.localStorage.getItem(t));
        void 0 === a[e] ||
          (delete a[e], window.localStorage.setItem(t, JSON.stringify(a)));
      }
    }
    function he(t) {
      void 0 === window.localStorage ||
        null === window.localStorage.getItem(t) ||
        window.localStorage.removeItem(t);
    }
    function ge(i, o) {
      i.click(function () {
        const t = We(this).siblings();
        t.each(function () {
          var t = We(this).text().replace(/[↑↓]/, "");
          We(this).text(t);
        });
        var e = We(this).text().replace(/[↑↓]/, "");
        let a = "",
          n = "";
        (n =
          "TH" == i[0].tagName
            ? ((a = i.parent().siblings()), i.parent().parent())
            : ((a = i.parent().next().children()), i.parent().next())),
          "descend" == We(this).attr("sort")
            ? (a.sort(function (t, e) {
                const a = o(t);
                e = o(e);
                return isNaN(a) ? a.localeCompare(e) : a - e;
              }),
              a.detach().appendTo(n),
              We(this)
                .attr("sort", "ascend")
                .text(e + "↑"))
            : (a.sort(function (t, e) {
                t = o(t);
                const a = o(e);
                return isNaN(t) ? a.localeCompare(t) : a - t;
              }),
              a.detach().appendTo(n),
              We(this)
                .attr("sort", "descend")
                .text(e + "↓"));
      });
    }
    function fe(t, e, a, n, i) {
      return `
<div style="position:relative; top:0; width:100%; height:${
        t - 4
      }px; color:${a}; background-color:${n}; padding:2px 0px; text-align:center;">${i}</div>
<div style="position:relative; top:-${t}px; width:100%; left:${
        e - 100
      }%; height:${t - 4}px; padding:2px 0px; z-index:2; overflow:hidden;">
<div style="position:absolute; top:0; width:100%; left:${100 - e}%; height:${
        t - 4
      }px; color:${n}; background-color:${a}; padding:2px 0px; text-align:center;">${i}</div>
</div>`;
    }
    function ue(t, e) {
      return We(t).on(
        "input keydown keyup mousedown mouseup select contextmenu drop focusout",
        function (t) {
          e(this.value)
            ? (this.oldValue = this.value)
            : this.hasOwnProperty("oldValue")
            ? (this.value = this.oldValue)
            : (this.value = "");
        }
      );
    }
    function be(t, ut, e) {
      let a = `https://api.torn.com/user/${t}?selections=profile,crimes,personalstats,bazaar&key=${x}`;
      console.log(`Request: ${a}`),
        fetch(a)
          .then(
            (t) => (t.ok ? t.json() : void e("Frog detection failed, please refresh and try again")),
            (t) => {
              e("Frog detection failed, the network is abnormal, please refresh and try again");
            }
          )
          .then((h) => {
            if ((console.log(`Response: ${a}`), console.log(h), null != h))
              if (h.hasOwnProperty("error"))
                e(`Frog detection failed：${JSON.stringify(h, null, 4)}`);
              else {
                var g = h.personalstats,
                  f = g.defendslost || 0,
                  u = g.defendsstalemated || 0,
                  b = g.defendswon || 0,
                  m = g.attackswon || 0,
                  x = g.attacksdraw || 0,
                  y = g.attackslost || 0,
                  v = g.cantaken || 0,
                  w = g.exttaken || 0,
                  _ = g.kettaken || 0,
                  k = g.lsdtaken || 0,
                  $ = g.opitaken || 0,
                  I = g.pcptaken || 0,
                  S = g.shrtaken || 0,
                  D = g.spetaken || 0,
                  A = g.victaken || 0,
                  F = g.xantaken || 0,
                  O = h.age || 1,
                  C = g.trainsreceived || 0,
                  M = w + k + F,
                  T = ((h.xan_lsd_ecs = M) / O).toFixed(2);
                h.average_drugs = T;
                var P = g.refills || 0,
                  E = g.statenhancersused || 0,
                  N = g.useractivity || 0,
                  z = g.traveltime || 0,
                  R = (g.logins, g.dumpsearches || 0),
                  j = g.energydrinkused || 0,
                  B = g.boostersused || 0,
                  M = g.revives || 0,
                  T = m + x + y,
                  x = g.daysbeendonator || 0,
                  y = Math.min(
                    O,
                    parseInt((new Date() - new Date("2011/11/22")) / 864e5)
                  );
                const tt = Math.min(x / y, 1);
                h.donator_percent = tt.toFixed(2);
                const et = 480 + 240 * tt;
                const at = 611255 / et;
                console.log(
                  `Statistical DP time ${x}d, up to ${y}d, DP ratio: ${Qt(
                    tt
                  )}, complete energy for one day: ${et.toFixed(
                    2
                  )}, active to achieve CAP: ${at.toFixed(2)} days`
                );
                y = h.last_action.timestamp || 0;
                let t = parseInt(new Date().getTime() / 1e3) - y,
                  e = "";
                86400 < t && ((e += parseInt(t / 86400) + "Day"), (t %= 86400)),
                  3600 < t && ((e += parseInt(t / 3600) + "hour"), (t %= 3600)),
                  60 < t && ((e += parseInt(t / 60) + "minute"), (t %= 60)),
                  (e += t + " Second"),
                  (h.last_action_details = e);
                const nt = h.last_action.relative;
                h.last_action_brief = nt
                  .replace(" minute ago", "m")
                  .replace(" minutes ago", "m")
                  .replace(" hours ago", "h")
                  .replace(" hour ago", "h")
                  .replace(" days ago", "d")
                  .replace(" day ago", "d");
                let a = 0;
                nt.includes("d") &&
                  (a = parseInt(nt.replace(/[^0-9|-]/gi, "")));
                const it = Math.max(1, (21 * (O - a)) / 24);
                console.log(
                  `Age ${O} days, last login ${a} days ago, maximum active days ${it.toFixed(2)}`
                );
                const ot = N / 86400,
                  rt = z / 86400,
                  st = 3 * ot + rt;
                console.log(
                  `ched_active_days: 3*${ot.toFixed(
                    2
                  )}(activity) + ${rt.toFixed(2)}(travel) = ${st.toFixed(2)}`
                );
                const lt =
                  (75 * v +
                    210 * w +
                    52.5 * _ +
                    425 * k +
                    215 * $ +
                    430 * I +
                    209.5 * S +
                    301 * D +
                    300 * A +
                    420 * F) /
                  1440;
                console.log(`drug_active_days: ${lt.toFixed(2)}`);
                (v = h.criminalrecord.other || 0),
                  (w = h.criminalrecord.selling_illegal_products || 0),
                  (_ = h.criminalrecord.theft || 0),
                  ($ = h.criminalrecord.drug_deals || 0),
                  (I = h.criminalrecord.computer_crimes || 0),
                  (S = h.criminalrecord.murder || 0),
                  (D = h.criminalrecord.fraud_crimes || 0),
                  (A = h.criminalrecord.auto_theft || 0);
                let n = 0.11 * _ + 0.5 * I + 0.66 * S + D + 0.66 * A + 0.05 * $;
                n < 0 && (n = 0),
                  (h.estimate_ace = parseInt(n)),
                  12862 < n
                    ? (h.estimate_nnb = 60)
                    : 9171 < n
                    ? (h.estimate_nnb = 55)
                    : 5950 < n
                    ? (h.estimate_nnb = 50)
                    : 4324 < n
                    ? (h.estimate_nnb = 45)
                    : 2750 < n
                    ? (h.estimate_nnb = 40)
                    : 1198 < n
                    ? (h.estimate_nnb = 35)
                    : 450 < n
                    ? (h.estimate_nnb = 30)
                    : 250 < n
                    ? (h.estimate_nnb = 25)
                    : 100 < n
                    ? (h.estimate_nnb = 20)
                    : 50 < n
                    ? (h.estimate_nnb = 15)
                    : (h.estimate_nnb = 10);
                let i =
                  (5 *
                    (2 * v +
                      3 * w +
                      5 * _ +
                      (8 * $) / 0.8 +
                      (9 * I) / 0.75 +
                      (10 * S) / 0.75 +
                      (11 * D) / 0.95 +
                      (12 * A) / 0.7)) /
                  1440;
                i < at &&
                  ((W = Math.min(at / i, 3)),
                  console.log(`Novice crime_active_days compensation factor: ${W}`),
                  (i *= W)),
                  console.log(`crime_active_days: ${i.toFixed(2)}`);
                var W = Math.min(it, Math.max(st, lt, i)).toFixed(2);
                console.log(`Estimated active days: ${W}`), (h.estimate_active_days = W);
                O = parseInt(75 * C + 30 * W + 70 * O);
                console.log(`Estimate WS: ${O}`), (h.estimate_ws = O);
                const dt = parseInt(et * W);
                console.log(`Estimated natural recovery energy: ${dt}`);
                (W = parseInt(150 * P)),
                  (P = 250 * F + 50 * k),
                  (j = 20 * j),
                  (B = 150 * B);
                const ct = W + P + j + B;
                console.log(
                  `Item energy: ${W}(refill) + ${P}(drug) + ${j}(can) + ${B}(FHC) = ${ct}`
                  );
                  (B = 25 * T), (M = 25 * M), (R = 5 * R);
                  const pt = B + M + R;
                  console. log(
                    `Energy consumed: ${B}(attack) + ${M}(revive) + ${R}(dump) = ${pt}`
                  );
                  let o = dt + ct - pt;
                  o < 0 && (o = 0),
                    console. log(
                      `Total workout energy: ${dt}(nature) + ${ct}(item) - ${pt}(consumption) = ${o}`
                  ),
                  (h.total_energy = o.toFixed(0)),
                  (h.nature_energy = dt.toFixed(0)),
                  (h.item_energy = ct.toFixed(0)),
                  (h.expend_energy = pt.toFixed(0));
                let r = 40;
                var L = [
                    2, 2.8, 3.2, 3.2, 3.6, 3.8, 3.7, 4, 4.8, 4.8, 5.2, 5.2, 5.4,
                    5.8, 5.8, 6, 6.4, 6.6, 6.8, 7, 7, 7, 7, 7.3,
                  ],
                  G = [
                    200,
                    500,
                    1e3,
                    2e3,
                    2750,
                    3e3,
                    3500,
                    4e3,
                    6e3,
                    7e3,
                    8e3,
                    11e3,
                    12420,
                    18e3,
                    18100,
                    24140,
                    31260,
                    36610,
                    46640,
                    56520,
                    67775,
                    84535,
                    106305,
                    Number.MAX_SAFE_INTEGER,
                  ];
                let s = 0,
                  l = o,
                  d = G[0];
                for (; 0 < l && r < 2e8; ) {
                  var q = Math.min(G[s], l, d, 1e3),
                    H = L[s];
                  const ht =
                    1.122 *
                    1.02 *
                    H *
                    q *
                    (((348e-9 * Math.log(4750) + 31e-7) * r) / 4 +
                      0.32433 -
                      0.0301431777);
                  (r += ht),
                    (l -= q),
                    (d -= q),
                    l <= 0
                      ? console.log(
                          `The energy has been used up. Recently, I exercised ${q} energy in the gym with coefficient ${H}, attribute +${ht.toFixed(
                            2
                          )} becomes ${r.toFixed(2)}`
                        )
                      : 2e8 <= r
                      ? console. log(
                          `The CAP has been reached, and recently exercised ${q} energy in the gym with a coefficient of ${H}, attribute +${ht.toFixed(
                            2
                          )} becomes ${r.toFixed(2)} with remaining ${l} energy`
                        )
                      : s < L.length - 1 &&
                        d <= 0 &&
                        (console. log(
                          `I'm going to change the gym. Recently, I exercised ${q} energy in the gym with a coefficient of ${H}. The attribute +${ht.toFixed(
                            2
                          )} becomes ${r.toFixed(2)}, leaving ${l} energy`
                        ),
                        ++s,
                        (d = G[s]));
                }
                if (0 < l)
                  if (
                    (console.log(`The energy consumed to achieve CAP: ${o - l}`),
                    F < k && F <= 100)
                  ) {
                    const gt = 3240 * l;
                    (r += gt),
                      console. log(
                        `LSD youth, the remaining energy can be used again +${gt.toFixed(
                          2
                        )} attribute, becomes ${r.toFixed(2)}`
                      );
                  } else {
                    const ft = 2510 * l;
                    (r += ft),
                      console. log(
                        `Ordinary youth, the remaining energy can be used again +${ft.toFixed(
                          2
                        )} attribute, becomes ${r.toFixed(2)}`
                      );
                  }
                else console.log("Failed to reach CAP");
                0 < E &&
                  ((r =
                    0.5 * r +
                    0.5 * r * (1 + 0.9 * (Math.pow(1.01, 0.5 * E) - 1))),
                  console.log(`Then use +${E} SE, the attribute becomes ${r.toFixed(2)}`)),
                  (r = parseInt(r));
                let c = Qt(r);
                console.log(`Estimated bs is：${c}`);
                var X,
                  J = [2, 6, 11, 26, 31, 50, 71, 100],
                  U = [100, 5e3, 1e4, 2e4, 3e4, 5e4],
                  K = [5e6, 5e7, 5e8, 5e9, 5e10],
                  k = [2e3, 2e4, 2e5, 2e6, 2e7, 2e8],
                  F = [2500, 25e3, 25e4, 25e5, 35e6, 25e7],
                  V = {
                    "Absolute beginner": 1,
                    Beginner: 2,
                    Inexperienced: 3,
                    Rookie: 4,
                    Novice: 5,
                    "Below average": 6,
                    Average: 7,
                    Reasonable: 8,
                    "Above average": 9,
                    Competent: 10,
                    "Highly competent": 11,
                    Veteran: 12,
                    Distinguished: 13,
                    "Highly distinguished": 14,
                    Professional: 15,
                    Star: 16,
                    Master: 17,
                    Outstanding: 18,
                    Celebrity: 19,
                    Supreme: 20,
                    Idolised: 21,
                    Champion: 22,
                    Heroic: 23,
                    Legendary: 24,
                    Elite: 25,
                    Invincible: 26,
                  };
                let p = 0;
                for (X in V)
                  if (0 == h.rank.indexOf(X)) {
                    (p = V[X]), (h.rank_value = p), (h.rank_name = X);
                    break;
                  }
                E = h.rank.split(" ");
                if (
                  ((h.rank_title = E[E.length - 1]),
                  console.log(
                    `Rank: value = #${p}, name = ${h.rank_name}, title = ${h.rank_title}, full = ${h.rank}`
                  ),
                  0 < p && r < Number.MAX_SAFE_INTEGER)
                ) {
                  --p;
                  var Y = h.level || 0;
                  for (let t = 0; t < J.length; ++t) Y >= J[t] && --p;
                  console.log(`Rank Subtracting the level trigger leaves ${p}`);
                  var Q = h.criminalrecord.total || 0;
                  for (let t = 0; t < U.length; ++t) Q >= U[t] && --p;
                  console.log(`Rank minus crimes trigger leaves ${p}`);
                  var Z = g.networth || 0;
                  for (let t = 0; t < K.length; ++t) Z >= K[t] && --p;
                  console.log(`Rank minus networth trigger, what remains ${p}`);
                  let t = 0,
                    e = Number.MAX_SAFE_INTEGER;
                  p <= 0
                    ? (e = F[0])
                    : p >= k.length
                    ? (t = k[k.length - 1])
                    : ((t = k[p - 1]), (e = F[p])),
                    console.log(`Calculate the bs interval according to Rank: [${t}, ${e})`),
                    r < t
                      ? ((c = `${c} ~ ${Qt(t)}`),
                        console.log(`Estimated total bs is less than the lower limit calculated by Rank: ${Qt(t)}`))
                      : r > e
                      ? ((c = `${Qt(e)} ~ ${c}`),
                        console.log(`Estimated total bs is higher than the upper limit calculated by Rank: ${Qt(e)}`))
                      : console.log("The estimated total bs conforms to the interval estimated by Rank");
                }
                (h.estimate_bs = r),
                  (h.estimate_bs_display = c),
                  (h.attackWinRatio = m / T),
                  (h.defendWinRatio = (b + u) / (b + u + f)),
                  ut(h);
              }
          });
    }
    function me(t, e, a) {
      let n = `extcenter_${t}`;
      return (
        !window[n] &&
        ((i == Le.PDA ? PDA_evaluateJavascript : eval)(a), (window[n] = !0), !0)
      );
    }
    Je.forEach((t) => {
      try {
        var e;
        t.match && !window.location.href.match(new RegExp(t.match))
          ? console.log(`${t.name} - ${t.version} Not on the specified page `)
          : ((e = le("extcenter-source", t.name)),
            me(t.name, t.version, e)
              ? console.log(`${t.name} - ${t.version} loaded successfully`)
              : console.log(`${t.name} - ${t.version} loaded`));
      } catch (t) {
        console.log(t);
      }
    }),
      console.log("Ice Frog is activated");
    async function xe(t) {
      switch ((console.log(`[cors] get ${t}`), i)) {
        case Le.GM:
          return new Promise((e, a) => {
            GM_xmlhttpRequest({
              method: "get",
              url: t,
              ontimeout: (t) => a(`timeout: ${t}`),
              onload: (t) => e(t.response),
              onerror: (t) => a(`error: ${t}`),
            });
          });
        case Le.PDA:
          return new Promise((e, a) => {
            PDA_httpGet(`${t}`)
              .then((t) => {
                e(t.responseText);
              })
              .catch((t) => {
                a(`error: ${t}`);
              });
          });
        case Le.OTHER:
        default:
          return new Promise((t, e) => {
            e("error：Cors operations are currently not supported");
          });
      }
    }
    async function ye(t, e, a, n) {
      let i = `https://api.torn.com/user/?selections=log&key=${x}`;
      0 < t.length && (i += `&cat=${t.join(",")}`),
        0 < e.length && (i += `&log=${e.join(",")}`),
        a && (i += `&from=${a}`),
        n && (i += `&to=${n}`);
      let o = 3;
      for (;;) {
        let t;
        if (0 < o) {
          const s = new AbortController();
          (t = s.signal), setTimeout(() => s.abort(), 5e3);
        }
        let e;
        try {
          e = await fetch(i, { signal: t });
        } catch (t) {
          if ("AbortError" !== t.name) throw t;
          o--;
          continue;
        }
        if (!e.ok) throw new Error(e.statusText);
        var r = await e.json();
        if ("error" in r) {
          if (17 === r.error.code && 0 < o) {
            o--;
            continue;
          }
          throw new Error(r.error.error);
        }
        return null === r.log
          ? []
          : Object.values(r.log).sort((t, e) => e.timestamp - t.timestamp);
      }
    }
    async function* ve(t, e, a, n, i) {
      for (n = n || Math.floor(new Date().getTime() / 1e3); ; ) {
        i && i(n);
        var o = await ye(t, e, a, n);
        if (0 === o.length) break;
        var r = o[o.length - 1].timestamp;
        if (o[0].timestamp == r) {
          for (const s of o) yield s;
          break;
        }
        for (const l of o) {
          if (l.timestamp <= r) break;
          yield l;
        }
        (n = r + 1), await new Promise((t) => setTimeout(t, 1e3));
      }
    }
    async function we(t, e, a, n, i) {
      const o = [];
      for await (const r of ve(t, e, a, n, i)) o.push(r);
      return o;
    }
    function _e(t) {
      We("#api_result_container").val(
        We("#api_result_container").val() + "\n" + t
      );
    }
    function ke(t) {
      var e = t.split("-")[0].trim();
      const a = t.split("-")[1].replace("TCT", "").trim();
      var n = "20" + a.split("/")[2].trim(),
        i = a.split("/")[1].trim(),
        t = a.split("/")[0].trim();
      const o = new Date(n + "/" + i + "/" + t + " " + e);
      return (
        o.setHours(o.getHours() - new Date().getTimezoneOffset() / 60),
        parseInt(o.getTime() / 1e3)
      );
    }
    function $e(n) {
      const i = le("CHAT_LAST_MESSAGE", n);
      if (i) {
        let t = "";
        t = 0 <= i.indexOf("|||") ? i.split("|||")[0] : i;
        (n = ke(t)), (n = parseInt(new Date().getTime() / 1e3) - n);
        let e = "",
          a = "";
        return (
          n < 3600
            ? ((e = parseInt(n / 60) + "m"), (a = "#5d9525"))
            : 3600 <= n && n < 86400
            ? ((e = parseInt(n / 3600) + "h"), (a = "#DAA520"))
            : 86400 <= n && n < 3024e3
            ? ((e = parseInt(n / 86400) + "d"), (a = "#c0542f"))
            : 3024e3 <= n && ((e = parseInt(n / 86400) + "d"), (a = "#777")),
          [a, e]
        );
      }
    }
    function Ie(t) {
      var e = window.localStorage.getItem("muglog");
      if (e) {
        var e = JSON.parse(e),
          n = Object.entries(e);
        for (let a = n.length - 1; 0 <= a; a--)
          if (n[a][1].victim_id == t) {
            var i = n[a][0],
              o = "$" + Qt(Yt(n[a][1].money_mugged)),
              i = parseInt(new Date().getTime() / 1e3) - i;
            let t = "",
              e = "";
            return (
              i < 3600
                ? ((t = parseInt(i / 60) + "m ago"), (e = "#5d9525"))
                : 3600 <= i && i < 86400
                ? ((t = parseInt(i / 3600) + "h ago"), (e = "#DAA520"))
                : 86400 <= i &&
                  ((t = parseInt(i / 86400) + "d ago"), (e = "#c0542f")),
              e + "," + t + "," + o
            );
          }
      }
    }
    function Se() {
      return We("script[uid]").attr("uid");
    }
    function De() {
      function n() {
        var t = `https://api.torn.com/torn/?selections=companies&key=${x}`;
        fetch(t)
          .then((t) => t.json())
          .then((e) => {
            const a = new Date();
            if ("companies" in e) {
              let t = {};
              for (var n in ((t["last-updated"] = a.toString()),
              (t.companies = {}),
              e.companies))
                t.companies[n] = {
                  name: e.companies[n].name,
                  positions: e.companies[n].positions,
                };
              window.localStorage.setItem(
                "APICache_companies",
                JSON.stringify(t)
              );
            } else
              "error" in e &&
                ce("APICache_companies", "last-updated", a.toString());
          })
          .catch((t) => console.log("fetch error", t));
      }
      !(function () {
        var e = le("APICache_companies", "last-updated");
        if (null != e && null != e) {
          var a = new Date();
          let t = new Date(e);
          t.setDate(t.getDate() + 1), t < a && n();
        } else n();
      })();
    }
    function Ae() {
      const r = {
          186: "sheep",
          187: "Teddy Bear",
          215: "Cat",
          258: "Jaguar",
          261: "Dirk Bear",
          266: "Nessie",
          268: "Red Fox",
          269: "Monkey",
          273: "Chamois",
          274: "Giant Panda",
          281: "Lion",
          384: "Camel",
          618: "Stingray",
          260: "Dahlia",
          263: "Crocus",
          264: "Orchid",
          267: "Broom Heather",
          271: "Kapok",
          272: "Edelweiss",
          276: "Peony",
          277: "Sakura",
          282: "African Viola",
          385: "Tribulus",
          617: "Banana Orchid",
          256: "Tear Gas",
          226: "Smoke Bomb",
          222: "Flashbang",
          616: "Trout",
        },
        t = We(".travel-agency-market ul.users-list li");
      const s = [260, 263, 264, 267, 271, 272, 276, 277, 282, 385, 617]
        .concat([
          186, 187, 215, 258, 261, 266, 268, 269, 273, 274, 281, 384, 618,
        ])
        .concat([206, 616, 222, 226, 256]);
      if (0 < t.length && "filtered" != t.attr("filtered")) {
        let o = parseInt(
          We("div.delimiter div.msg:contains(You have purchased) span.bold")
            .last()
            .text()
        );
        var e = parseInt(
          We(
            We(
              "div.delimiter div.msg:contains(You have purchased) span.bold"
            ).get(-2)
          ).text()
        );
        (o -= e),
          (isNaN(o) || o <= 0) && (o = 1),
          t.each((t, e) => {
            var a = parseInt(We(e).find("div.details").attr("itemid"));
            if (isNaN(a) || !(0 < a)) return !1;
            if (s.indexOf(a) < 0) We(e).addClass("hide");
            else {
              const n = We(e).find("input#item-" + a)[0];
              if (((n.value = o), n.dispatchEvent(new Event("blur")), r[a])) {
                a = r[a];
                const i = We(e).find("span.name");
                i.html(
                  i.html() +
                    "<span style='float:right;padding-right:10px;'>" +
                    a +
                    "</span>"
                );
              }
            }
          }),
          t.attr("filtered", "filtered");
      }
      We("#show_more").length < 1 &&
        (We(".travel-agency-market").after(
          "<div><div id='show_more' type='button' style='cursor:pointer;width:inherit;font-size:24px;margin:auto;padding:10px;border:5px solid gray;background-color:#c0542f;text-align:center;'>Click to show all</div></div>"
        ),
        We("#show_more").click(function () {
          We(this).parent().remove(), t.removeClass("hide");
        }));
    }
    function Fe() {
      const n = {
        YATA: "<a href='https://yata.yt/' target='_blank'>",
        Race: "<a href='/loader.php?sid=racing'>",
        Beer: "<a href='/shops.php?step=bitsnbobs'>",
        flight: "<a href='/travelagency.php'>",
        "In Stock": "<a href='https://yata.yt/bazaar/abroad/' target='_blank'>",
        Market: "<a href='/imarket.php'>",
        Points: "<a href='/pmarket.php'>",
        Stocks: "<a href='/page.php?sid=stocks'>",
        Bazaar: "<a href='/bazaar.php'>",
      };
      setInterval(function () {
        const t = We("ul.menu-items");
        if ("1" != t.attr("hasdone")) {
          if (0 < t.siblings().length)
            for (var e in n)
              t.append('<li class="menu-item-link">' + n[e] + e + "</a></li>");
          else
            for (var a in (t.attr(
              "style",
              "width:295px; margin-top:6px; line-height:16px;"
            ),
            t.children(":last").remove(),
            t.children(":last").remove(),
            t.children(":last").remove(),
            n))
              t.append('<li class="menu-item-link">' + n[a] + a + "</a></li>");
          t.attr("hasdone", "1");
        }
      }, 1e3);
    }
    function Oe() {
      chatTimestamp &&
        setInterval(function () {
          const r = parseInt(new Date().getTime() / 1e3),
            t = We("[class*='chat-active_']")
              .children("[class*='chat-box-content_']")
              .children("[class*='viewport_']")
              .children()
              .children("[class*='message_']");
          t.each(function (t, e) {
            const a = We(this).attr("name");
            var n = a.split("-")[0],
              n = r - n;
            let i = "",
              o = "";
            n < 3600
              ? ((i = parseInt(n / 60) + "m"), (o = "#5d9525"))
              : 3600 <= n && n < 86400
              ? ((i = parseInt(n / 3600) + "h"), (o = "#DAA520"))
              : 86400 <= n &&
                ((i = parseInt(n / 86400) + "d"), (o = "#c0542f")),
              We(this).children(".fac-ts").remove(),
              We(this).prepend(
                '<span class="fac-ts border-round bw-no-select" style="margin-right:2px; padding:1px 4px; color:white; background-color:' +
                  o +
                  '">' +
                  i +
                  "</span>"
              );
          });
        }, 1e3);
      setInterval(function () {
        const t = We("[class*='chat-last-message-label_']");
        t.each(function (t, e) {
          const a = We(this).parent().parent().parent().parent().attr("class");
          if (
            0 <= a.indexOf("_offline_") ||
            0 <= a.indexOf("_online_") ||
            0 <= a.indexOf("_away_")
          ) {
            var n = We(this)
                .parent()
                .parent()
                .parent()
                .siblings("[class*='chat-box-head_']")
                .children()
                .attr("title"),
              i = We(this).children("span").text();
            const o = (function t(e, a, n) {
              return 0 < a
                ? ((n +=
                    "[" +
                    e.children("[class!='fac-ts border-round']").text() +
                    "]"),
                  t(e.prev(), a - 1, n))
                : n;
            })(We(this).prev(), 5, "");
            ce("CHAT_LAST_MESSAGE", n, i + "|||" + o.substring(0, 125));
          }
        });
      }, 1e3);
    }
    function Ce() {
      setInterval(function () {
        const t = We("[class*='chat-active_']")
          .children("[class*='chat-box-content_']")
          .children("[class*='viewport_']")
          .children()
          .children("[class*='message_'][fac-wdcheck!='true']");
        t.each(function (t, e) {
          We(this).attr("fac-wdcheck", "true");
          const a = We(this)
            .text()
            .match(/取.*?([\.0-9]+)([k|m|b]?)/i);
          if (a) {
            var n = a[1],
              i = a[2].toLowerCase();
            let t = 1;
            "k" == i ? (t = 1e3) : "m" == i ? (t = 1e6) : "b" == i && (t = 1e9);
            const o = Vt(parseInt(parseFloat(n) * t)),
              r = parseInt(parseFloat(n) * t),
              s = We(this).children("a").text(),
              l = We(this).children("a").attr("href"),
              d = l.substr(l.indexOf("XID=") + 4),
              c = `${s.substr(0, s.length - 2)} [${d}]`;
            We(this).append(
              `<span class="fac-wd border-round bw-no-select" style="background-color:${Xe.green}; color: white; cursor: pointer; float: right; padding: 0 3px 0 3px">withdraw money</span>`
            ),
              We(this)
                .children("span[class*='fac-wd']")
                .click(function () {
                  console.log(`${c} ${o}`);
                  const t = window.location.href;
                  t.indexOf("#/tab=controls") < 0 ||
                  (0 <= t.indexOf("option") && t.indexOf("giveMoneyTo") < 0)
                    ? ((window.location.href = `https://www.torn.com/factions.php?step=your#/tab=controls&giveMoneyTo=${d}&money=${r}`),
                      0 <= t.indexOf("factions.php") &&
                        setTimeout(() => {
                          location.reload();
                        }, 500))
                    : Me(c, o);
                });
          }
        });
      }, 1e3);
    }
    function Me(t, e) {
      const a = We(".money-wrap").children(".give-block");
      We("input#money-user").val(t).addClass("chosen"),
        a
          .children(".inputs-wrap")
          .children(".input-money-group")
          .addClass("success")
          .children("input")
          .attr("value", e),
        a
          .children(".inputs-wrap")
          .children(".radio-wp")
          .children(".btn-wrap")
          .children(".btn")
          .children()
          .attr("disabled", !1)
          .removeClass("disabled");
    }
    function Te() {
      setInterval(function () {
        if (
          0 <
            We("#profile-mini-root")
              .children()
              .children("[class^=profile-mini-_userImageWrapper]").length &&
          !We("#profile-mini-root")
            .children()
            .children("[class^=profile-mini-_userProfileWrapper]")
            .attr("hasdone")
        ) {
          We("#profile-mini-root")
            .children()
            .children("[class^=profile-mini-_userProfileWrapper]")
            .attr("hasdone", "1");
          const t = We("#profile-mini-root")
              .children()
              .children("[class^=profile-mini-_userImageWrapper]")
              .children("a"),
            e = t ? t.attr("href") : void 0,
            n = e ? e.substr(20) : void 0;
          n &&
            be(n, function (t) {
              var e = We("#profile-mini-root")
                .children()
                .css("background-color");
              We("#profile-mini-root")
                .children()
                .children("[class^=profile-mini-_userProfileWrapper]").append(`
<div id="bingwa-mini-profile" class="border-round" style="overflow: hidden; width:254px; height:26px; position: absolute; right: -6px; top: -2px; z-index: 1; color: #fff ;background-image: linear-gradient(${e},#888 25%,${e}); border: 1px solid #000; margin: 5px; text-align: center;">
<div id="bingwa-mini-profile-bs" style="float: left; width:112px; height:16px; background-color: ${Xe.purple}; border: 1px solid #000; margin: 4px 2px 4px 4px; text-align: center;"></div>
<div id="bingwa-mini-profile-hp" style="float: left; width:104px; height:16px; background-color: #fff; border: 1px solid #000; margin: 4px 2px; text-align: center;"></div>
<div id="bingwa-mini-profile-attack" style="float: left; width:16px; height:16px; background-color: ${Xe.red}; border: 1px solid #000; margin: 4px 4px 4px 2px; text-align: center;"></div>
</div>`);
              e = `/loader.php?sid=attack&user2ID=${n}`;
              We("#bingwa-mini-profile-attack").html(
                `<div style="padding: 2px 0px; text-shadow: none;"><a href="${e}" style="color:#fff;text-decoration: none;">beat</a></div>`
              ),
                ce("battlestats", n, t.estimate_bs),
                We("#bingwa-mini-profile-bs").html(
                  `<div style="padding: 2px 0px;">${t.estimate_bs_display}</div>`
                );
              let a = parseInt((100 * t.life.current) / t.life.maximum);
              100 < a && (a = 100);
              e = t.life.current + "/" + t.life.maximum + " (" + a + "%)";
              a <= 66
                ? We("#bingwa-mini-profile-hp").html(
                    fe(16, a, "#c0542f", "#fff", e)
                  )
                : We("#bingwa-mini-profile-hp").html(
                    fe(16, a, "#5d9525", "#fff", e)
                  ),
                We("#bingwa-mini-profile-last").html(
                  `<div style="padding: 2px 0px;">${t.last_action_details}</div>`
                );
            });
        }
      }, 500);
    }
    function Pe() {
      const r = {
        20465: ["Leader", "Co-leader", "WEIYUAN", "CHANGWEI"],
        36134: ["Leader", "Co-leader", "Paladin", "Minister"],
        16335: [
          "Leader",
          "Co-leader",
          "Karajan",
          "Haydn",
          "Chopin",
          "Schubert",
        ],
        9356: ["Leader", "Co-leader", "Lion", "Tiger", "Wolf"],
        10741: ["Leader", "Co-leader", "General", "Marshal"],
      };
      setInterval(function () {
        const t = We("[class*='type-list_']");
        if (0 < t.length) {
          const e = t.children("li:eq(3)").attr("class");
          if (0 <= e.indexOf("active")) {
            const a = We("[class*='people-list_']");
            "1" != a.attr("hasDone") &&
              (a.attr("hasDone", "1"),
              (function (i) {
                var t = `https://api.torn.com/faction/?selections=basic&key=${x}`;
                fetch(t)
                  .then((t) => t.json())
                  .then((t) => {
                    if ("members" in t) {
                      let o = [];
                      for (const n in t.members) {
                        var e = t.members[n].position,
                          a = t.members[n].status.state;
                        0 <= r[t.ID].indexOf(e) && "Okay" == a && o.push(n);
                      }
                      i.each(function (t, e) {
                        const a = We(this).attr("class"),
                          n = We(this).children("a").attr("href");
                        var i = n ? n.substring(18) : 0;
                        0 <= o.indexOf(i) &&
                          0 <= a.indexOf("online") &&
                          (We(this)
                            .children("a")
                            .append(
                              "<span style='color:white'><b> 可取钱 在城内</b></span>"
                            ),
                          We(this).css("background-color", "Darkseagreen"));
                      });
                    } else "error" in t && console.log(t.error.error);
                  })
                  .catch((t) => console.log("fetch error", t));
              })(a.children("li")));
          }
        }
      }, 3e3);
    }
    function Ee() {
      0 < We("#plane").length &&
        (We("#clouds-1").remove(),
        We("#clouds-2").remove(),
        We("#clouds-3").remove(),
        We("#plane").children().remove());
    }
    function Ne() {
      0 < We(".computer-wrap").length &&
        (We(".computer-navigation").insertBefore(".computer-wrap"),
        We("#computer-content-wrapper").insertBefore(".computer-wrap"),
        We(".computer-wrap").css("visibility", "hidden"),
        We(".computer-navigation").attr(
          "style",
          "position: unset; margin-bottom: 10px;"
        ),
        We("#computer-content-wrapper").removeClass("left"),
        We("#computer-content-wrapper").css("margin", "auto"));
    }
    function ze(t) {
      0 < We("#icon15-sidebar").length &&
        We("#nurse").length < 1 &&
        (We(t).before(`
<div style="margin-bottom:5px;">
<div id='nurse' style='color:#333;width:inherit;margin:auto;padding:10px;border:5px solid gray;background-color:#ccc;text-align:center;'>
<div id='nurse-eff' style='font-size:12px;padding:2px;'></div>
<div id='nurse-cd' style='font-size:24px;padding:2px;'>The little nurse will serve you wholeheartedly</div>
<div id='nurse-item' style='font-size:12px;padding:2px;'></div>
<div id='nurse-suggestion' style='font-size:24px;padding:2px;'></div>
<div id='nurse-item-life' style='font-size:12px;padding:2px;'></div>
<div id='nurse-suggestion-life' style='font-size:24px;padding:2px;'></div>
</div>
</div>`),
        (t = `https://api.torn.com/user/?selections=profile,cooldowns,perks&key=${x}`),
        fetch(t)
          .then(
            (t) =>
              t.ok
                ? t.json()
                : void We("#nurse-cd").text("--- Nurse detection failed ---"),
                (t) => {
                  We("#nurse-cd").text("--- little nurse's network is abnormal ---");
            }
          )
          .then((f) => {
            if (null != f)
              if ("error" in f)
                We("#nurse-cd").text(
                  `--- API error --- code: ${f.error.code} error: ${f.error.error}`
                );
              else if ("basicicons" in f && "icon15" in f.basicicons) {
                function u(t) {
                  let e = parseInt(t / 3600);
                  e = e < 10 ? "0" + e : e;
                  let a = parseInt(t / 60) % 60;
                  a = a < 10 ? "0" + a : a;
                  let n = t % 60;
                  return (n = n < 10 ? "0" + n : n), e + ":" + a + ":" + n;
                }
                var b = f.states.hospital_timestamp,
                  m = b ? b - parseInt(new Date().getTime() / 1e3) : 0,
                  x = u(m),
                  y = parseInt(m / 60),
                  v =
                    100 -
                    ((f.life.current || 0) / (f.life.maximum || 7500)) * 100,
                  w = u(f.cooldowns.medical || 0);
                let a = !1,
                  t = 0,
                  e = 0,
                  n = 0;
                if ("education_perks" in f) {
                  const F = f.education_perks;
                  0 <= F.indexOf("+ Withdraw and deliver blood") && (a = !0),
                    0 <= F.indexOf("+ 20% medical item effectiveness") &&
                      (t = 20),
                    0 <= F.indexOf("+ 10% medical item effectiveness") &&
                      (t = 10);
                }
                if ("faction_perks" in f) {
                  const O = f.faction_perks;
                  O.forEach(function (t) {
                    0 <= t.indexOf("medical item effectiveness") &&
                      (e = t ? parseInt(t.match(/\d+/)[0]) : 0),
                      0 <= t.indexOf("minutes of maximum medical cooldown") &&
                        (n = t ? parseInt(t.match(/\d+/)[0]) : 0);
                  });
                }
                let i = 6 + parseInt(n / 60);
                i = i < 10 ? "0" + i : i;
                let o = n % 60;
                o = o < 10 ? "0" + o : o;
                var _ = i + ":" + o + ":00";
                const A = parseInt(t) + parseInt(e) + 100;
                console.log(A);
                let r = 0,
                  s = 0,
                  l = 0,
                  d = 0;
                console.log(y);
                var k = (function t(e) {
                  return a && e > 0.7 * A
                    ? ((r += 1), t(e - 1.2 * A))
                    : e > 0.4 * A
                    ? ((s += 1), t(e - 0.7 * A))
                    : e > 0.2 * A
                    ? ((l += 1), t(e - 0.4 * A))
                    : 0 < e
                    ? ((d += 1), t(e - 0.2 * A))
                    : e;
                })(y);
                console.log(k);
                var $ = 0 == r ? "" : "Big blood pack*" + r,
                I = 0 == s ? "" : "morphine*" + s,
                S = 0 == l ? "" : "Little blue bag*" + l,
                D = 0 == d ? "" : "Little red envelope*" + d,
                b = 30*r + 20*s + 15*l + 10*d;
              let c = 0,
                p = 0,
                h = 0,
                g = 0;
              m = (function t(e) {
                return a && e > 0.15 * A
                  ? ((c += 1), t(e - 0.3 * A))
                  : e > 0.1 * A
                  ? ((p += 1), t(e - 0.15 * A))
                  : e > 0.05 * A
                  ? ((h += 1), t(e - 0.1 * A))
                  : 0 < e
                  ? ((g += 1), t(e - 0.05 * A))
                  : e;
              })(v);
              console. log(m);
              (f = 0 == c ? "" : "Big blood pack*" + c),
                (y = 0 == p ? "" : "morphine*" + p),
                (k = 0 == h ? "" : "Little blue bag*" + h),
                (v = 0 == g ? "" : "Little red envelope*" + g),
                  (m = 30 * c + 20 * p + 15 * h + 10 * g);
                We("#nurse-cd").text(`hospital stay ${x} medical cooling ${w}/${_}`),
                We("#nurse-eff").text(
                  `Blood Draw: ${a} Education Bonus: +${t}% Clan Bonus: +${e}%`
                ),
                We("#nurse-item").text(
                  `Large blood bag: -${parseInt(1.2 * A)} minutes Morphine: -${parseInt(
                      0.7 * A
                    )}minute blue packet: -${parseInt(
                        0.4*A
                      )}min Small red envelope: -${parseInt(0.2 * A)}min`
                    ),
                    We("#nurse-suggestion").text(
                      `[Discharge Mode] ${$} ${I} ${S} ${D} (Cooldown +${b}min)`
                    ),
                    We("#nurse-item-life").text(
                      `Big blood bag: return blood+${parseInt(0.3 * A)}% Morphine: return blood+${parseInt(
                        0.15*A
                      )}% Small blue bag: blood recovery+${parseInt(
                        0.1*A
                      )}% Little Red Envelope: Blood Recovery+${parseInt(0.05 * A)}%`
                    ),
                    We("#nurse-suggestion-life").text(
                      `【Full blood mode】 ${f} ${y} ${k} ${v} (cooling +${m} minutes)`
                  );
              }
          })
          .catch((t) => We("#nurse-cd").text(t)));
    }
    function Re(t) {
      var e = { day: 86400, hour: 3600, minute: 60, second: 1 };
      let a = 0;
      for (const i of Object.keys(e)) {
        var n = t.match(new RegExp(`(\\d+) *${i}`, "i"));
        n && (a += parseInt(n[1]) * e[i]);
      }
      return a;
    }
    function je() {
      if (this.dataset.confirm) {
        if (!confirm(this.dataset.msg)) return;
      } else alert(this.dataset.msg);
      We(this).hide(), We(this).siblings(".travel-info-btn").show();
    }
    async function Be() {
      try {
        var t = await (
          await fetch(`https://api.torn.com/user/?selections=icons&key=${x}`)
        ).json();
        const e = t.icons.icon85 || t.icons.icon86;
        if (!e) return;
        const [, a, n] = e.split("-").map((t) => t.trim());
        if (a.match(/Blackmail|Kidnapping|Bomb Threat/i)) return;
        const o = Re(n);
        We(".travel-wrap").each(function () {
          if (0 !== We(this).find(".flight-time").length) {
            const a = We(this).find(".flight-time").text().split("-")[1];
            var [t, e] = a.trim().split(":"),
              t = 3600 * parseInt(t) + 60 * parseInt(e),
              e = o - 2 * t;
            if (!(7200 <= e)) {
              const n = We(this).find(".travel-confirm .travel-info-btn");
              t =
                0 < e
                  ? "OC is about to end, please pay attention to the flight time and return in time"
                  : 0 < o
                  ? "OC is coming to an end, take off now and you won't be able to return in time. Do you still want to keep taking off?"
                  : "The OC has ended, it is recommended to communicate with teammates and wait in the city for the completion of the OC. Do you still insist on taking off even if the OC is delayed? ";
              const i =
                We(`<button class="bw-oc-reminder-btn torn-btn btn-dark-bg"
style="border: solid red" data-msg="${t}">注意 OC</button>`);
              e <= 0 && i.attr("data-confirm", !0),
                n.hide(),
                i.insertBefore(n).click(je);
            }
          }
        });
        const i = new MutationObserver(async function (t) {
          for (const e of t)
            We(e.addedNodes).find("button.bw-oc-reminder-btn").click(je);
        });
        i.observe(We(".travel-agency")[0], { childList: !0, subtree: !0 });
      } catch (t) {
        console.trace("Error in rendering OC reminder", t);
      }
    }
  }
}
function getVersion() {
  var e,
    a = {
      "3.1.10": {
        date: "2023.03.19",
        notes: [
          "Fix: Fix the problem that the OC reminder button is invalid when taking off by toby",
          "Changed: Ignore nnb change caused by merit reset in criminal experience by toby",
        ],
      },
      "3.1.9": {
        date: "2023.02.19",
        notes: [
          "Fix: Adapt to PDA 2.9.5 (PDA users are advised to select START in START/END) by toby",
          "Modified: Properly handle Laman's detox record in Addiction Analysis by toby",
          "Modification: No more automatic jump by toby when API Key is not set",
          "Edit: PDA no longer needs to manually modify the @match section by toby",
        ],
      },
      "3.1.8": {
        date: "2023.02.15",
        notes: [
          "New Feature: Addiction Analysis by toby",
          "New feature: Add OC pop-up reminder before takeoff by toby",
          "Fix: Retry when API times out or returns temporary error by toby",
          "Modification: Enemy bs on the wall will use Ice Baby target cache data first by toby",
          "Modification: Delete world situation and recent RW function by toby",
          "Modification: Make the chat window timestamp and quick cash button unselectable by toby",
        ],
      },
      "3.1.7": {
        date: "2022.10.28",
        notes: [
          "New function: The RW weapon skill description is displayed on the right side of the attack page by htys",
          "Fix: Fix the error of the recent attack function, and set it to be disabled by default, you need to manually enable it in the settings by htys",
          "Fix: Fix the error that the English uppercase of the player's name on the attack page is changed to lowercase by htys",
          "Modify: The chat history is saved from 5 seconds to 1 second by htys",
          "Modification: cancel the recent nagging military parade requirements, and can be displayed on the phone by htys",
          "Modification: Modified the color display of some pages to make it more harmonious in dark mode by htys",
        ],
      },
      "3.1.6": {
        date: "2022.10.23",
        notes: [
          "New function: The gang chain page additionally displays more attack records within 5 minutes (reducing missed revenge) by htys",
          "New feature: The gang withdrawal page displays the payee's balance in a more prominent position by htys",
        ],
      },
      "3.1.5": {
        date: "2022.10.22",
        notes: [
          "Fixed: Withdraw money shortcut and gang chat to quickly withdraw money by htys",
          "Fixed: Ice Frog target page can display mini profile by long press by htys",
          "Fix: PDA can use icefrog target (can only import csv format) by htys",
        ],
      },
      "3.1.4": {
        date: "2022.10.20",
        notes: [
          "Fixed: The width of Ice Frog's main page can now adapt to mobile phones by htys",
          "Fixed: attack interface HP percentage, a bug with the same name on both the attack and the defense appears on the phone by htys",
          "Modification: Modify the order of Ice Frog's target columns to be more suitable for output on mobile phones by htys",
        ],
      },
      "3.1.3": {
        date: "2022.10.20",
        notes: [
          "New function: Added an attack button on the mini profile interface by htys",
          "New function: The attack interface shows the percentage of the blood volume of both the enemy and the enemy (may be useful for killing weapon skills) by htys",
          "Fixed: Ice Frog's main interface is on the left side by htys",
          "Modification: Optimize APIKEY selection interface UI by htys in mobile mode",
          "Modification: The attack interface cancels the chain display, and moves the refresh button to the original position where the chain is displayed by htys",
        ],
      },
      "3.1.2": {
        date: "2022.10.11",
        notes: [
          "Fix: The jQuery plugin library is referenced in the script head to solve the problem that the bust menu cannot be used by toby",
        ],
      },
      "3.1.1": {
        date: "2022.10.11",
        notes: [
          "Fix: Update regex of bust perks by toby",
          "Fix: The jQuery library is referenced in the head of the script to solve the problem that the ice frog cannot be used after the oil monkey is updated by htys",
          "Fix: Updated the regular matching of perks to solve the display problem of the little nurse by htys",
          "Modification: Reduced the area displayed by BS on the mini profile interface to avoid blocking important information in mobile phone mode by htys",
        ],
      },
      "3.1.0": {
        date: "2022.09.23",
        notes: [
          "Fix: Fix bust filter not hiding targets with zero probability by toby",
          "Modification: Optimize APIKEY selection interface UI by htys",
          "Modification: Optimize the extra information UI of the mini profile interface by htys",
          "Modification: Display BS on the wall in turf war - can display friendly and third-party BS by htys",
          "Modified: Turf war shows estimated end time by htys",
        ],
      },
      "3.0.9": {
        date: "2022.09.21",
        notes: [
          "Fix: Fix NNB rise and fall time recognition problem in criminal experience calculation by toby",
          "Fix: Match API responses case-insensitively by toby",
          "Fix: Added SMTH - Concord by htys to allies list",
        ],
      },
      "3.0.8": {
        date: "2022.08.11",
        notes: ["Fix: Viewing other people's company pages will output the employee status table whether you are in the city or flying"],
      },
      "3.0.7": {
        date: "2022.08.09",
        notes: ["Fix: Fix Prison Assistant's conflict with the new version of TornPDA by toby"],
      },
      "3.0.6": {
        date: "2022.07.10",
        notes: [
          "Edit: Ice Frog Goal - rewrite some content to improve page lag by htys",
          "Modified: Ice Frog Target - Hospital Time update frequency is once per second by htys",
          "Modified: Ice Frog Target - When there are multiple Ice Frog target pages open, at most one page is allowed to refresh normally by htys",
        ],
      },
      "3.0.5": {
        date: "2022.07.01",
        notes: [
          "NEW FEATURE: Prison bust - completely reworked and added estimated bust success rate by toby",
          "New feature: gym page - fine-tuned the interface and added detection when you can eat SE by htys",
        ],
      },
      "3.0.4": {
        date: "2022.06.23",
        notes: [
          "NEW FEATURE: Ice Frog Target - Added filter function by htys",
          "Modified: Ice Frog Target - Added error message when cdn is not available by htys",
          "Modification: Removed LND from friendly gangs by htys",
        ],
      },
      "3.0.3": {
        date: "2022.06.10",
        notes: [
          "New feature: chat history (replaces robbery history) by htys",
          "New feature: Faction - Added display whether it can be revived (requires military parade) by htys",
          "Modify: Criminal Experience - Corrected crime penalty formula by toby",
          "Modify: Criminal Experience - Remove save data button for criminal experience by toby",
          "Modification: Add support for PDA 2.8.0 by mirror",
          "Modification: Chat timestamp appearance fine-tuning by htys",
          "Fix: Fix the problem that the last chat time is not displayed by microdust",
        ],
      },
      "3.0.2": {
        date: "2022.05.13",
        notes: [
          "New Feature: Plugin Center by mirror",
          "New feature: Query bust penalty by toby",
          "Modification: Criminal Experience - Add an export button to the log page by toby",
          "Modification: Criminal Experience - Added criminal experience data collection instructions by toby",
          "Modification: Icefrog target supports importing csv format files by microdust",
          "Fix: The bonus numbers on the gym page are not displayed by htys",
          "Fixed: home page perks display dislocation problem by htys",
          "Fixed: The market search page sometimes does not display the bazaar problem by htys",
        ],
      },
      "3.0.1": {
        date: "2022.04.29",
        notes: [
          "Modification: Company Efficiency Estimation Formula by microdust",
          "Modification: Chat box withdrawal jump optimization by mirror",
          "Modification: Relax the time requirement for NNB relegation event by toby",
          "Repair: Parade by mirror",
          "Fix: replace null coalescing operator by toby",
        ],
      },
      "3.0.0": { date: "2022.04.07", notes: ["New Feature: Criminal Experience by toby"] },
      "2.9.9": {
        date: "2022.04.05",
        notes: [
          "New feature: Flexible configuration of quick cash withdrawal button by mirror",
          "New feature: Add withdrawal button in chat bar by mirror",
          "Modify: Timing of company data pull by mirror",
          "Fix: Fix the problem that the last chatter is not displayed when the honorbar is opened in the advanced search interface by mirror",
        ],
      },
      "2.9.8": {
        date: "2022.03.31",
        notes: [
          "Modify: Ice Frog target page - add bs prompt",
          "Modification: Friendly gangs add new pta gangs",
          "Fixed: There is a bug with extra spaces when chatting time when converting time zones",
        ],
      },
      "2.9.7": {
        date: "2022.02.27",
        notes: [
          "New function: attack page - display the progress of the chain to prevent the bonus from being missed",
          "Modify: Company Page - Add Efficiency Estimation",
          "Modification: Ice Frog Target Page - If the discharge time is less than 10 minutes, then gradually reduce the transparency of the background color according to the discharge time",
          "Modification: Search page - If there is no chat with the target for more than 35 days, the recent chats will be grayed out",
          "Fix: Unable to parade bug",
        ],
      },
      "2.9.6": {
        date: "2022.02.22",
        notes: ["New feature: profile page and mini profile page display blood bar"],
      },
      "2.9.5": {
        date: "2022.02.15",
        notes: [
          "New feature: Ice Frog Target, an auto-refresh target monitoring tool",
          "New function: Added level and id display for gang details",
          "Fix: Little Nurse adjusts the number of decimal places reserved",
        ],
      },
      "2.9.4": {
        date: "2022.01.24",
        notes: [
          "Fix: Partial top link",
          "Fix: miniBS display position",
          "Fix: PTA withdrawal function",
          "Fixed: The gang page displays military parade, BS, offline time and hospitalization time, and cancels the sorting function",
        ],
      },
      "2.9.3": {
        date: "2022.01.08",
        notes: ["New feature: recent RW shows the server's recent RW records"],
      },
      "2.9.2": {
        date: "2022.01.04",
        notes: [
          "New feature: The gang withdraws money now prompts the balance in a more obvious position, and a new button to withdraw all is added",
          "NEW FEATURE: The sidebar now has an ice frog icon",
          "Fix: Fixed the problem that the company page could not be displayed due to the failure to read its own id when flying",
          "Fix: Added display content (gang icon and rank level) to the gang details page",
        ],
      },
      "2.9.1": {
        date: "2021.12.30",
        notes: [
          "Fix: Fixed the matching format of some APIs, so that the little nurse can run normally",
          "Fix: Updated the attack link on the profile page, now players can read the complete battle page in the hospital",
          "Fix: Add a horizontal drag bar to a part of the table, so that it can display the full content even when it exceeds the width of the mobile phone screen (thanks to Woohoo)",
          "Fix: Fine-tune the profile page BS display related content",
        ],
      },
      "2.9.0": {
        date: "2021.12.28",
        notes: [
          "New function: Little nurses can now provide advice according to [discharge mode] and [full blood mode] respectively",
          "New feature: Added estimated WS on the profile page",
          "New function: Added display of company goods inventory for company bosses",
          "Fix: Fixed the problem of repeated display of estimated bs on mini profile",
          "Fix: Fixed the problem that sometimes the little nurse can't get the hospital time",
          "Fix: Fixed the problem that the gang balance and reserve ratio were displayed incorrectly",
          "Fix: The number of continuous active days of the profile is re-modified as the number of active days of ice frogs",
          "Fix: Modified some color schemes to solve the problem of not being able to see clearly in dark mode",
          "Fixed: Now the function of flying without clouds will no longer display the picture of the plane",
          "Fix: For non-East 8 users, the problem of incorrect chat time display has been modified",
          "Fix: Updated API entries such as key->info and rankedwarreport",
        ],
      },
      "2.8.9": {
        date: "2021.12.09",
        notes: [
          "New function: The Ranked War interface of your own gang will display the enemy's bs (you need to parade the gang in advance), and you can sort by bs",
          "Fix: An error is reported when the little nurse cannot read the API",
          "Fix: error when faction and company redraw cannot read API",
        ],
      },
      "2.8.8": {
        date: "2021.11.24",
        notes: [
            "Fix: Match different urls when using API to redraw faction and company pages",
            "Fix: A magical bug",
          ],
        },
        "2.8.7": {
          date: "2021.11.23",
          notes: [
            "New function: Display the last chat time and the last mug time amount on the personal profile page",
            "New feature: Show last chat time on advanced search page",
          ],
        },
        "2.8.6": {
          date: "2021.11.19",
          notes: [
            "New function: mini profile shows ice frog's estimated combat power",
            "New feature: Quick cash withdrawal button added to gang warehouse",
            "Modification: You can also get the little nurse's advice when you leave the hospital with gang medicine",
          ],
        },
        "2.8.5": {
          date: "2021.11.08",
          notes: [
            "New function: the battle page adds the display of online status of the target",
            "Modification: Ice Frog APIKey read page UI",
            "Modification: military parade can filter targets by bazaar amount, add bazaar link",
            "Modification: You can also view the efficiency table on the company.php page when you are admitted to the hospital or in prison",
        ],
      },
      "2.8.4": {
        date: "2021.11.01",
        notes: [
          "New function: increase the quantitative display of stealth stealth probability on the battle page",
          "New feature: add smart discharge suggestions for small nurses on the item page",
          "New function: In the battle of your own gang, the bs of the enemy on the wall will be displayed (the gang must be paraded in advance)",
          "Fix the bug that PDA will reload icefrog (thanks Woohoo-)",
        ],
      },
      "2.8.3.1": {
        date: "2021.10.25",
        notes: [
          "Added display of this week's sales (real-time data) and last week's profit (cached data) in company management",
          "The company management form is changed to display at the bottom of the company page",
        ],
      },
      "2.8.3": {
        date: "2021.10.23",
        notes: [
          "The takeoff page adds the reminder function of taking medicine cd and oc",
          "The bounty page adds an automatic military parade function, which is disabled by default and needs to be manually enabled in the settings",
          "The ice frog detection on the personal page increases the number of active days and deletes the number of ECS",
          "Increase the bad ratio index on the right side of the number of enemies on the personal page",
          "points market target prompt can now display newcomers and clothing stores",
        ],
      },
      "2.8.2": {
        date: "2021.10.08",
        notes: [
          "Enables a more accurate formula for calculating prison scores and increases the display score to 25000",
          "Fix parade bug",
        ],
      },
      "2.8.1": {
        date: "2021.09.30",
        notes: ["Cancel the Smash function", "Cancel the oc reminder function"],
      },
      "2.8.0": {
        date: "2021.09.11",
        notes: ["New Smash Bros Parade", "Optimized the Smash Bros. interface"],
    },
    "2.7.9": {
      date: "2021.09.09",
      notes: [
        "New API entry",
        "Updated the top shortcut links",
        "Military parade can display the team where the big fight is located",
        "You can also view Smash Bros. overseas",
      ],
    },
    "2.7.8": {
      date: "2021.08.18",
      notes: ["The military parade can display the total value of all items in the target bazaar"],
    },
    "2.7.7": {
      date: "2021.06.20",
      notes: [
        "The company ranking page is now available for company parade",
        "Add a new quick robbery link",
        "No longer show extra bazaars that are sold out",
        "Add your own personal fire prevention reminder when buyingmug",
        "When OC is about to start, you will get a more obvious prompt when entering the flight interface",
        "Hide laptop border",
        "Don't show clouds and planes while flying",
      ],
    },
    "2.7.6": {
      date: "2021.05.29",
      notes: ["You can view my company form even if you are not the boss", "New gang money withdrawal assistant"],
    },
    "2.7.5.2": {
      date: "2021.05.29",
      notes: [
        "Chat box timestamp does not display seconds",
        "Add more buttons to Jail interface",
        "Overseas inventory interface adds a button to display more",
        ],
      },
      "2.7.5.1": { date: "2021.05.27", notes: ["Fix chat box timestamp"] },
      "2.7.5": {
        date: "2021.04.12",
        notes: ["Top link, gym, racing interface UI fine-tuning"],
      },
      "2.7.4": {
        date: "2021.04.01",
        notes: ["Increase the unit price estimate of TV and oil factory on the company page viewed during flight"],
      },
      "2.7.3": { date: "2021.03.30", notes: ["My company page UI fine-tuning"] },
      "2.7.2": {
        date: "2021.03.23",
        notes: ["Add top link and gym switch", "Display stock abbreviation on stock trading market page"],
      },
      "2.7.1": {
        date: "2021.03.10",
        notes: [
          "My company page has newly added the salary of each employee and the real-time data of the current company, and repaired the bug of saving 31 days and displaying 32 days",
          "The gang information page in flight distinguishes between being raided and actively raiding others",
        ],
      },
      "2.7.0": {
        date: "2021.02.14",
        notes: [
          "Modify the imarket search page, increase the display of the total value of all items in the target bazaar",
          "New function Resurrection Assistant",
        ],
      },
      "2.6.9": {
        date: "2021.02.11",
        notes: [
          "Gang comparison function reworked to display more data",
          "Add more setting options",
          "Add a key to display all perks on the index page",
        ],
      },
      "2.6.8": {
        date: "2021.02.02",
        notes: [
          "Added the function of the world situation, showing all ongoing turf wars, colored according to the intensity of the battle situation",
        ],
      },
      "2.6.7": {
        date: "2021.01.24",
        notes: ["On the flight/hospital/prison, you can also view items in your own/others' Bazaar"],
      },
      "2.6.6.3": {
        date: "2021.01.22",
        notes: ["Solve the compatibility issue between the gym page and torntools"],
      },
      "2.6.6.2": {
        date: "2021.01.19",
        notes: [
          "Modify some possible bugs",
          "Gym page provides Hank and Baldr attribute scale reference",
          "You can freely add player IDs to the watchlist, and the monitored targets are highlighted (orange) overseas",
        ],
      },
      "2.6.6.1": {
        date: "2021.01.19",
        notes: ["View the Last action on the personal profile page as x days x hours x minutes x seconds"],
      },
      "2.6.6": {
        date: "2021.01.14",
        notes: [
          "My company and gangs and company functions are Sinicized during the flight.",
          "Look at the gang information during the flight to increase the information of chain, turf warfare, and raid warfare.",
          "Production data supports companies with multiple inventories.",
        ],
      },
      "2.6.5.1": {
        date: "2021.01.13",
        notes: [
            "For those who have used the [My Company] function, they will automatically check and capture the company's operating data from last night when they enter the game every day.",
        ],
      },
      "2.6.5": {
        date: "2021.01.11",
        notes: [
          "Fine-tuning of company efficiency table: increase inactivity, adjust column order",
          "Add company historical data table",
          "You can also view gang and company pages while flying",
        ],
      },
      "2.6.4.1": {
        date: "2021.01.05",
        notes: ["Optimize company efficiency table display, and it can be viewed overseas"],
      },
      "2.6.4": {
        date: "2021.01.04",
        notes: ["Company page displays efficiency table", "Chat box displays timestamp"],
      },
      "2.6.3": {
        date: "2020.12.28",
        notes: [
          "Added a simple navigation bar at the top and updated the API entry from api.torn.com",
          "Optimize the military parade function, add pause and continue buttons",
          "Optimize the gang comparison function, increase the history and highlight the leader",
          "Add the robbery history function, you can select the target from the history to join the watch list",
        ],
      },
      "2.6.2": {
        date: "2020.11.11",
        notes: [
          "Fix the problem that the top link causes the layout of the page to be messed up",
          "The payday function is only provided to the leader and coleader",
        ],
      },
      "2.6.1": {
        date: "2020.10.22",
        notes: [
          "Beautify typesetting: pmarket, imarket(search), imarket pages no longer affect the original layout when displaying bs",
          "The market shows more than 3 bazaars: the imarket(search) page shows that the number of bazaars is no longer limited to 3",
          "Simple calculator on the bazaar page: You can click to select items, and the total value of the selected items will be displayed at the top of the page",
        ],
      },
      "2.6.0": {
        date: "2020.09.28",
        notes: [
          "Add 3 mug related scripts to the itemmarket/pointmarket/bazaar interface (thanks to Mirror), use mugoo=true to open",
          "revivehelper is renamed to facPageEnhanced, the display content is optimized, use foo=true to open",
          "The military parade module is optimized, and the content option of the military parade is added. All military parade related functions are enabled with foo=true",
          "Prison pinned to the top of the flag to help members, regardless of the score",
          "Overseas people interface uses colors to mark members of friendly gangs and enemy gangs",
        ],
      },
      "2.5.9": { date: "2020.09.16", notes: ["Fix the bug that the Feihua enhancement function fails"] },
      "2.5.8": {
        date: "2020.11.11",
        notes: [
          "Roll back the first article of the previous version, because the networth will change, and the rank will be triggered after 7 days",
          "Frog and Frog Probe shows that the total exercise energy in more pages is replaced by the number of Boosters",
        ],
      },
      "2.5.7": {
        date: "2020.08.14",
        notes: [
          "When the bs upper limit of rank inversion is lower than the estimated value, ignore the estimated value and use the upper and lower limits of rank inversion",
          "Fixed Frog Detection to display more page layout issues",
          "The revive enhancement function of the gang page is disabled by default. If necessary, please set the reviveHelper in the code header to true to enable it manually",
        ],
      },
      "2.5.6": {
        date: "2020.08.01",
        notes: [
          "You can also easily check the status of gang members during the flight, and support up to 3 gang horizontal comparisons including your own gang",
        ],
      },
      "2.5.5.1": {
        date: "2020.07.30",
        notes: [
          "Fix some withdrawal bugs. When withdrawing money for yourself, input . or ? (English punctuation) can be automatically replaced with your own name, reducing input time",
        ],
      },
      "2.5.5": {
        date: "2020.07.30",
        notes: ["Shield the full withdrawal button, and display the target amount when selecting the withdrawal target"],
      },
      "2.5.4": {
        date: "2020.07.27",
        notes: [
          "Add a series of functions to the gang member interface: military parade, display bs, last login time, travel status and hospitalization time, highlight hospitalized members, sort, etc.",
        ],
      },
      "2.5.3": {
        date: "2020.07.07",
        notes: ["Add anti-heavy function, switch noAssisting = true"],
      },
      "2.5.2": {
        date: "2020.06.17",
        notes: ["Fix the problem that the top link causes the layout of the page to be messed up"],
      },
      "2.5.1": {
        date: "2020.06.15",
        notes: ["Fix the problem that some columns are sometimes lost when the military parade is converted to csv"],
      },
      "2.5.0": {
        date: "2020.06.05",
        notes: [
          "Optimization of search and overseas user list parade function: filter below 5b, display mugged, rehabcost, rank, job",
        ],
      },
      "2.4.9": {
        date: "2020.06.05",
        notes: [
          "You can also easily check the status of gang members during the flight, and support horizontal comparison of up to 3 gangs including your own gang",
        ],
      },
      "2.4.8": {
        date: "2020.06.04",
        notes: [
          "Jailview is sorted by jailscore and optimizes the experience",
          "Update the link to see the inventory",
          "A military parade function is added to the user search page",
        ],
      },
      "2.4.7": {
        date: "2020.04.26",
        notes: [
          "Add a common link in the upper left menu: Market",
          "Jailview page enhancement: display the minutes*level of each target; filter more than 10,000; bust does not need a second confirmation (similar to the quick bust function of DN)",
        ],
      },
      "2.4.6": {
        date: "2020.04.26",
        notes: ["New frequently used links in the upper left menu: racing/beer/flight/inventory"],
      },
    };
  let n = "",
    i = 0,
    o = "",
    r = 0;
  for (e in a)
    if (r < 10) {
      o += a[e].date + " --v" + e + "\n";
      for (let t = 0; t < a[e].notes.length; t++)
        o += "    " + a[e].notes[t] + "\n";
      o += "\n";
      let t = e.split(".");
      t.splice(1, 0, "."), t.join("");
      var s = parseFloat(t);
      s > i && ((i = s), (n = e)), r++;
    }
  return [n, o];
}
"loading" === document.readyState
  ? document.addEventListener("readystatechange", () => {
      "interactive" === document.readyState && bingwaMain();
    })
  : bingwaMain();
