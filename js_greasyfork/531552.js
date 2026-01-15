// ==UserScript==
// @name        EzyBot - Eventpop
// @namespace   EzyBot - Eventpop
// @version      1.5
// @description  Pop the Event!
// @author       EzyBot - อีซี่บอท
// @match        https://*.eventpop.me/*
// @match        https://eventpop.queue-it.net/*
// @icon         https://ezyisezy.github.io/easy/epop.png
// @resource     customCSS https://p-a.popcdn.net/assets/application-c9d1296d3579ead82d296ef5425d773bf2ca02f9e79e54b1e52fa8b0cdda5d66.css
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/531552/EzyBot%20-%20Eventpop.user.js
// @updateURL https://update.greasyfork.org/scripts/531552/EzyBot%20-%20Eventpop.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ตั้งค่่าผ่านเมนู "ตั้งค่าโปรแกรม" ได้เลย ไม่ต้องแก้ไขโค้ดในนี้

  const defaults = {
    numTickets: 1,
    ticketShowtime: 1,
    ticketType: 1,
    ticketZones: "A1, Auto",
    selectMode: "random",
    selectAdjacent: !1,
    autoClick: !0,
    autoRefresh: !0,
    startUrl: "https://www.eventpop.me",
    startTime: null,
    isRunning: !1,
  };
  function normalizeZoneName(name) {
    if (!name) return "";
    return name
      .trim()
      .replace(/\s+/g, "") // ลบช่องว่างทั้งหมด
      .replace(/-/g, "") // ลบขีดทั้งหมด
      .toLowerCase();
  }
  let numTickets = GM_getValue("numTickets", defaults.numTickets),
    ticketShowtime = GM_getValue("ticketShowtime", defaults.ticketShowtime),
    ticketType = GM_getValue("ticketType", defaults.ticketType),
    ticketZones = GM_getValue("ticketZones", defaults.ticketZones),
    selectMode = GM_getValue("selectMode", defaults.selectMode),
    selectAdjacent = GM_getValue("selectAdjacent", defaults.selectAdjacent),
    autoClick = GM_getValue("autoClick", defaults.autoClick),
    autoRefresh = GM_getValue("autoRefresh", defaults.autoRefresh),
    startUrl = GM_getValue("startUrl", defaults.startUrl),
    startTime = GM_getValue("startTime", defaults.startTime),
    isRunning = GM_getValue("isRunning", defaults.isRunning),
    settingsModalOpen = !1;
  function showSettingsModal() {
    if (settingsModalOpen) return;
    settingsModalOpen = !0;
    const e = new Date()
      .toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" })
      .replace(" ", "T")
      .slice(0, 19),
      t = `<div id="settings-modal-wrapper">
  <div class="modal fade setstart-form binded-html-validation" id="settings-modal" data-showing="settings"
    style="display: block; padding-right: 15px;">
    <div class="modal-dialog">
      <div class="modal-content setstart-body px-2">
        <div class="modal-header"><button class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>
          <h2 class="modal-title">ตั้งค่าโปรแกรม</h2>
        </div>
        <div class="modal-body py-0">
          <div class="form-ezy">
            <form class="simple_form" id="settings-form" accept-charset="UTF-8" method="post">
              <div class="form-inputs">
                <div class="row">
                  <div class="col-md-12 form-group required starturl"><label class="control-label required"
                      for="settings-startUrl"><abbr title="จำเป็น">*</abbr>URL หน้าเว็บกดบัตร</label><input
                      class="form-control string required" required="required" aria-required="true"
                      placeholder="https://www.eventpop.me/e/xxxxx" type="url" name="startUrl" id="settings-startUrl"
                      value="${startUrl}" /></div>
                  <div class="col-md-12 form-group required starttime"><label class="control-label required"
                      for="settings-startTime"><abbr title="จำเป็น">*</abbr>เวลาเริ่ม</label><input
                      class="form-control required" required="required" aria-required="true"
                      placeholder="dd/mm/yyyy hh:mm:ss" type="datetime-local" step="1" name="startTime"
                      id="settings-startTime" value="${startTime || e
        }" max="2099-12-31T23:59:59" /></div>
                </div>
                <div class="row">
                  <div class="col-md-12 form-group required showtime"><label class="control-label required"
                      for="settings-ticketShowtime"><abbr title="จำเป็น">*</abbr>รอบแสดง</label><input
                      class="form-control required" required="required" aria-required="true" placeholder="เช่น 1"
                      type="number" min="1" name="ticketShowtime" id="settings-ticketShowtime"
                      value="${ticketShowtime}" /></div>
                </div>
                <div class="row">
                  <div class="col-md-12 form-group required num-tickets"><label class="control-label required"
                      for="settings-numTickets"><abbr title="จำเป็น">*</abbr>จำนวนบัตร</label><input
                      class="form-control string required" autofocus="autofocus" required="required"
                      aria-required="true" placeholder="เช่น 1" type="number" min="1" name="numTickets"
                      id="settings-numTickets" value="${numTickets}" /></div>                  
                </div>
                <h4 class="mb-2" style="color:var(--brand-primary)">เฉพาะบัตรยืน</h4>
                <div class="row">
                  <div class="col-md-12 form-group required ticket-type"><label class="control-label required"
                      for="settings-ticketType"><abbr title="จำเป็น">*</abbr>ลำดับแถวราคาบัตร <small style="font-weight:300;color:var(--gray-dark)">(นับเฉพาะที่แสดงราคาหรือ "ฟรี")</small></label><input
                      class="form-control string required" required="required" aria-required="true" placeholder="เช่น 1"
                      type="number" min="1" name="ticketType" id="settings-ticketType" value="${ticketType}" /></div>
                </div>
                <h4 class="mb-2" style="color:var(--brand-primary)">เฉพาะบัตรนั่ง</h4>
                <div class="row">
                  <div class="col-md-12 form-group required zones"><label class="control-label required"
                      for="settings-ticketZones"><abbr title="จำเป็น">*</abbr>ชื่อโซน</label><input
                      class="form-control string required" required="required" aria-required="true"
                      placeholder="เช่น A1, Auto (คั่นด้วยลูกน้ำ)" type="text" name="ticketZones"
                      id="settings-ticketZones" value="${ticketZones}" /></div>                  
                </div>
                <div class="row">
                  <div class="col-md-12 form-group required select-mode"><label class="control-label required"
                      for="settings-selectMode"><abbr title="จำเป็น">*</abbr>เลือกที่นั่ง</label><select
                      class="form-control required" required="required" aria-required="true" name="selectMode"
                      id="settings-selectMode">
                      <option value="random" ${"random" === selectMode ? "selected" : ""
        }>สุ่มที่นั่ง</option>
                      <option value="first" ${"first" === selectMode ? "selected" : ""
        }>จากแถวหน้าสุด</option>
                      <option value="last" ${"last" === selectMode ? "selected" : ""
        }>จากแถวหลังสุด</option>
                    </select></div>
                </div>
                <div class="row col-md-12 mb-3">
                  <div class="col-md-12 form-group checkbox adjacent"><input class="boolean jcheck" type="checkbox"
                      name="selectAdjacent" id="settings-selectAdjacent" ${selectAdjacent ? "checked" : ""
        } /><label
                      class="control-label" for="settings-selectAdjacent">เลือกที่นั่งติดกันเท่านั้น</label></div>
                  <div class="col-md-12 form-group checkbox auto-click"><input class="boolean jcheck" type="checkbox"
                      name="autoClick" id="settings-autoClick" ${autoClick ? "checked" : ""
        } /><label
                      class="control-label" for="settings-autoClick">ซูมผังและคลิกที่นั่งอัตโนมัติ</label></div>
                  <div class="col-md-12 form-group checkbox auto-refresh"><input class="boolean jcheck" type="checkbox"
                      name="autoRefresh" id="settings-autoRefresh" ${autoRefresh ? "checked" : ""
        } /><label
                      class="control-label" for="settings-autoRefresh">รีเฟรชอัตโนมัติ</label></div>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-6"><button type="submit" class="btn btn-primary btn-block">บันทึก</button></div>
                <div class="col-xs-6"><button id="resetBtn" class="btn btn-default btn-block">รีเซ็ต</button></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade"></div>`;
    let css = GM_getResourceText("customCSS");
    const base = "https://p-a.popcdn.net";
    (css = css.replace(
      /url\((['"]?)(?!https?:|data:|blob:)([^'")]+)\1\)/gi,
      (s, e, t) => {
        const c = t.replace(/^\.?\/*/, "");
        return `url(${base}/${c})`;
      }
    )),
      GM_addStyle(css);
    GM_addStyle(
      '\nsvg text{-webkit-user-select:none !important;user-select:none !important}\n@keyframes slideDown {\nfrom { transform: translateY(-20%); }\nto { transform: translateY(0); }\n}\n@keyframes slideUp {\nfrom { transform: translateY(0); }\nto { transform: translateY(-20%); }\n}\n.setstart-body {\npadding-top: 24px;\npadding-bottom: 32px;\n}\n.setstart-form button.close {\nposition: absolute;\ntop: 10px;\nright: 15px;\n}\n.modal-dialog {\nanimation: slideDown 0.3s ease-out;\n}\n.modal-dialog.closing {\nanimation: slideUp 0.3s ease-out;\n}\n.form-ezy .form-group {\nmargin-bottom: 1.5rem !important;\n}\n.form-group.checkbox {\nmargin-bottom: 1rem;\n}\n.form-group.checkbox input[type="checkbox"] {\nmargin-left: 0.5rem;\ntransform: scale(1.2);\nposition: relative;\n}\nh3 {\nmargin-top: 1.5rem;\nmargin-bottom: 1rem;\ncolor: #333;\nborder-bottom: 1px solid #ddd;\npadding-bottom: 0.5rem;\n}\n.form-group .col-md-12,\n.form-group .col-md-12 {\npadding: 0 15px 15px 0;\n}\n'
    );
    const n = (() => {
      const e = document.createElement("div");
      (e.style.visibility = "hidden"),
        (e.style.overflow = "scroll"),
        (e.style.msOverflowStyle = "scrollbar"),
        document.body.appendChild(e);
      const t = document.createElement("div");
      e.appendChild(t);
      const n = e.offsetWidth - t.offsetWidth;
      return e.parentNode.removeChild(e), n;
    })();
    document.body.classList.add("modal-open"),
      (document.body.style.paddingRight = `${n}px`),
      document.body.insertAdjacentHTML("beforeend", t);
    const o = document.getElementById("settings-modal-wrapper"),
      s = document.querySelector(".modal-backdrop"),
      r = document.getElementById("settings-modal"),
      l = document.getElementById("settings-form"),
      c = o.querySelector(".close[data-dismiss='modal']"),
      i = o.querySelector("#resetBtn");
    setTimeout(() => {
      r.classList.add("in"), s.classList.add("in");
    }, 0);
    const a = () => {
      r.classList.remove("in"),
        s.classList.remove("in"),
        o.querySelector(".modal-dialog").classList.add("closing"),
        setTimeout(() => {
          o.remove(),
            s.remove(),
            document.body.classList.remove("modal-open"),
            (document.body.style.paddingRight = ""),
            (settingsModalOpen = !1);
        }, 300);
    };
    c.addEventListener("click", a);
    let u = !1;
    o.addEventListener("mousedown", (e) => {
      e.target.closest(".modal-dialog") || (u = !0);
    }),
      o.addEventListener("mouseup", (e) => {
        u && !e.target.closest(".modal-dialog") && a(), (u = !1);
      }),
      o.addEventListener("click", (e) => {
        e.target.closest(".modal-dialog") || e.stopPropagation();
      }),
      i.addEventListener("click", (e) => {
        if (
          (e.preventDefault(),
            confirm("รีเซ็ตการตั้งค่าเป็นค่าเริ่มต้นหรือไม่?"))
        ) {
          const e = new Date()
            .toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" })
            .replace(" ", "T")
            .slice(0, 19);
          Object.keys(defaults).forEach((e) => {
            GM_setValue(e, defaults[e]);
          }),
            (document.getElementById("settings-numTickets").value =
              defaults.numTickets),
            (document.getElementById("settings-ticketShowtime").value =
              defaults.ticketShowtime),
            (document.getElementById("settings-ticketType").value =
              defaults.ticketType),
            (document.getElementById("settings-ticketZones").value =
              defaults.ticketZones),
            (document.getElementById("settings-selectMode").value =
              defaults.selectMode),
            (document.getElementById("settings-selectAdjacent").checked =
              defaults.selectAdjacent),
            (document.getElementById("settings-autoClick").checked =
              defaults.autoClick),
            (document.getElementById("settings-autoRefresh").checked =
              defaults.autoRefresh),
            (document.getElementById("settings-startUrl").value =
              defaults.startUrl),
            (document.getElementById("settings-startTime").value = e),
            (numTickets = defaults.numTickets),
            (ticketShowtime = defaults.ticketShowtime),
            (ticketType = defaults.ticketType),
            (ticketZones = defaults.ticketZones),
            (selectMode = defaults.selectMode),
            (selectAdjacent = defaults.selectAdjacent),
            (autoClick = defaults.autoClick),
            (autoRefresh = defaults.autoRefresh),
            (startUrl = defaults.startUrl),
            (startTime = null),
            (isRunning = defaults.isRunning);
        }
      }),
      l.addEventListener("submit", (e) => {
        e.preventDefault();
        const t = parseInt(
          document.getElementById("settings-numTickets").value
        ),
          n = parseInt(
            document.getElementById("settings-ticketShowtime").value
          ),
          o = parseInt(document.getElementById("settings-ticketType").value),
          s = document.getElementById("settings-ticketZones").value.trim(),
          r = document.getElementById("settings-selectMode").value,
          c = document.getElementById("settings-selectAdjacent").checked,
          i = document.getElementById("settings-autoClick").checked,
          u = document.getElementById("settings-autoRefresh").checked,
          d = document.getElementById("settings-startUrl").value.trim(),
          m = document.getElementById("settings-startTime").value;
        let f = !0;
        if (
          ([...l.querySelectorAll(".text-red")].forEach((e) => e.remove()),
            isNaN(t) || t < 1)
        ) {
          l
            .querySelector(".num-tickets")
            .insertAdjacentHTML(
              "beforeend",
              '<span class="text-red">ต้องเป็นตัวเลขมากกว่า 0</span>'
            ),
            (f = !1);
        }
        if (isNaN(n) || n < 1) {
          l
            .querySelector(".showtime")
            .insertAdjacentHTML(
              "beforeend",
              '<span class="text-red">ต้องเป็นตัวเลขมากกว่า 0</span>'
            ),
            (f = !1);
        }
        if (isNaN(o) || o < 1) {
          l
            .querySelector(".ticket-type")
            .insertAdjacentHTML(
              "beforeend",
              '<span class="text-red">ต้องเป็นตัวเลขมากกว่า 0</span>'
            ),
            (f = !1);
        }
        if (!s) {
          l
            .querySelector(".zones")
            .insertAdjacentHTML(
              "beforeend",
              '<span class="text-red">ต้องระบุชื่อโซน</span>'
            ),
            (f = !1);
        }
        const g = l.querySelector(".form-group.starturl");
        isValidUrl(d) ||
          (g.insertAdjacentHTML(
            "beforeend",
            '<span class="text-red">รูปแบบ URL ไม่ถูกต้อง (ต้องเริ่มต้นด้วย http:// หรือ https://)</span>'
          ),
            (f = !1));
        const b = l.querySelector(".form-group.starttime");
        m ||
          (b.insertAdjacentHTML(
            "beforeend",
            '<span class="text-red">รูปแบบเวลาไม่ถูกต้อง</span>'
          ),
            (f = !1)),
          f &&
          (GM_setValue("numTickets", t),
            GM_setValue("ticketShowtime", n),
            GM_setValue("ticketType", o),
            GM_setValue("ticketZones", s),
            GM_setValue("selectMode", r),
            GM_setValue("selectAdjacent", c),
            GM_setValue("autoClick", i),
            GM_setValue("autoRefresh", u),
            GM_setValue("startUrl", d),
            GM_setValue("startTime", m),
            (numTickets = t),
            (ticketShowtime = n),
            (ticketType = o),
            (ticketZones = s),
            (selectMode = r),
            (selectAdjacent = c),
            (autoClick = i),
            (autoRefresh = u),
            (startUrl = d),
            (startTime = m),
            a(),
            /^https:\/\/www\.eventpop\.me(\/)?(#.*|\?.*)?$/.test(
              window.location.href
            ) && handleHomepageRedirection());
      });
  }
  function initRunningGuard() {
    const e = () => {
      if (!startTime)
        return (isRunning = !0), void GM_setValue("isRunning", isRunning);
      const e = new Date(startTime),
        t = new Date(),
        n = isRunning;
      (isRunning = t >= e),
        GM_setValue("isRunning", isRunning),
        isRunning && !n && runBotLogic();
    };
    e(), setInterval(e, 1e3);
  }
  function runBotLogic() {
    if (window.location.href.includes("/seating")) {
      processZones(), autoClickDanger();
      new MutationObserver(() => {
        const e = document.querySelector("#alert-modal.modal-danger");
        e &&
          "none" !== e.style.display &&
          setTimeout(() => {
            const t = e.querySelector('[data-dismiss="modal"]');
            if (t) {
              t.click();
              const e = document.querySelector(".deselect-all");
              if ((e && e.click(), (submitClicked = !1), autoClick)) {
                const e = document.querySelector(".btn-refresh");
                e && e.click();
              }
            }
          }, 1e3);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0 }),
        setInterval(autoClickSubmitSeat, 100);
    }
    if (
      (window.location.href.startsWith("https://www.eventpop.me/e/") &&
        (handleEventPage(), handleShowtime(ticketShowtime)),
        window.location.href.includes("/showtime"))
    ) {
      observerQuantity(numTickets);
      const e = document.querySelector("#event-tickets");
      e &&
        setTimeout(() => {
          e.scrollIntoView({ behavior: "auto", block: "start" });
        }, 350);
    }
  }
  function handleHomepageRedirection() {
    if (!startUrl || !startTime) return;
    const e = new Date(startTime);
    new Date() < e
      ? (window.waitInterval && clearInterval(window.waitInterval),
        (window.waitInterval = setInterval(() => {
          new Date() >= e &&
            (clearInterval(window.waitInterval),
              (isRunning = !0),
              GM_setValue("isRunning", !0),
              (window.location.href = startUrl));
        }, 1e3)))
      : isRunning ||
      ((isRunning = !0), GM_setValue("isRunning", !0), runBotLogic());
  }
  function isValidUrl(e) {
    return /^(ftp|http|https):\/\/[^ "]+$/.test(e);
  }
  function simulateClick(e) {
    var t = new MouseEvent("click", { bubbles: !0, cancelable: !1 });
    e.dispatchEvent(t);
  }
  function handlePrequeuePage() {
    const targetNode = document.getElementById("action");
    if (!targetNode) {
      console.error("Target node #action not found!");
      return;
    }

    let button = targetNode.querySelector(".action-button");
    if (button && !button.classList.contains("disabled")) {
      button.click();
      console.log("Button clicked!");
    } else {
      const observer = new MutationObserver(() => {
        button = targetNode.querySelector(".action-button");
        if (button && !button.classList.contains("disabled")) {
          button.click();
          console.log("Button clicked!");
          observer.disconnect();
        }
      });
      observer.observe(targetNode, { childList: true, subtree: true });
    }
  }
  function handleEventPage() {
    const e = new MutationObserver(() => {
      const t = document.querySelector("#event-showtimes-section"),
        n = document.querySelector("#event-tickets");
      t
        ? (window.location.hash.includes("#event-showtimes-section") ||
          window.location.hash.includes("#event-tickets") ||
          (window.location.href += "#event-showtimes-section"),
          t.scrollIntoView({ behavior: "smooth" }),
          e.disconnect())
        : n &&
        (window.location.hash.includes("#event-showtimes-section") ||
          window.location.hash.includes("#event-tickets") ||
          (window.location.href += "#event-tickets"),
          n.scrollIntoView({ behavior: "smooth" }),
          e.disconnect());
    });
    e.observe(document.body, { childList: !0, subtree: !0 });
    const t = new MutationObserver(() => {
      const e = document.querySelector(".seating-action .select-seat");
      let n;
      if (e) {
        if (e.hasAttribute("disabled")) {
          if (autoRefresh) {
            console.log(
              "[EzyBot] ปุ่มเลือกที่นั่ง disabled + autoRefresh = true → รีเฟรชใน 1.5 วินาที"
            );
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            console.log(
              "[EzyBot] ปุ่มเลือกที่นั่ง disabled แต่ autoRefresh = false → ไม่รีเฟรช"
            );
          }
          return void t.disconnect();
        }
        if (
          document.querySelectorAll(
            'evp-react-island[component*="HCaptchaGate"], evp-react-island[component*="hcaptchagate"]'
          ).length > 0
        ) {
          e.scrollIntoView({ behavior: "auto", block: "center" });
          const n = new MutationObserver(() => {
            document.querySelector(".text-success") &&
              (e.click(), n.disconnect(), t.disconnect());
          });
          return (
            n.observe(document.body, {
              childList: !0,
              subtree: !0,
              attributes: !0,
            }),
            void setTimeout(() => {
              document.querySelector(".text-success") &&
                (e.click(), n.disconnect(), t.disconnect());
            }, 1e3)
          );
        }
        return e.click(), void t.disconnect();
      }
      setTimeout(() => {
        n = document.querySelector('[data-testid="Increase quantity button"]');
        const submitBtn = document.querySelector("#submit-order");

        if (!n && submitBtn) {
          if (autoRefresh) {
            console.log(
              "[EzyBot] ไม่พบปุ่มเพิ่มจำนวน แต่มี submit-order + autoRefresh = true → รีเฟรชใน 1 วินาที"
            );
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            console.log(
              "[EzyBot] ไม่พบปุ่มเพิ่มจำนวน แต่มี submit-order แต่ autoRefresh = false → ไม่รีเฟรช"
            );
          }
        }

        t.disconnect();
      }, 500);
    });
    t.observe(document.body, { childList: !0, subtree: !0 });
  }
  function autoClickDanger() {
    !(async function () {
      for (; !document.querySelector("#floor-plan-svg");)
        await new Promise((e) => setTimeout(e, 100));
      new MutationObserver((e) => {
        let t = !1;
        e.forEach((e) => {
          "childList" === e.type &&
            e.addedNodes.forEach((e) => {
              e.nodeType === Node.ELEMENT_NODE &&
                (e.matches && e.matches(".btn-danger") && (t = !0),
                  (e.querySelectorAll ? e.querySelectorAll(".btn-danger") : [])
                    .length > 0 && (t = !0));
            });
        }),
          t &&
          document
            .querySelectorAll('.btn-danger:not([data-clicked="true"])')
            .forEach((e) => {
              e.click(), e.setAttribute("data-clicked", "true");
            });
      }).observe(document.body, { childList: !0, subtree: !0 });
    })();
  }
  GM_registerMenuCommand("ตั้งค่าโปรแกรม (Settings)", showSettingsModal);
  GM_registerMenuCommand("ปิดรีเฟรชอัตโนมัติ (Disable Auto Refresh)", () => {
    GM_setValue("autoRefresh", false); // บันทึกถาวร
    autoRefresh = false; // อัปเดตตัวแปรปัจจุบันทันที
    console.log("[EzyBot] Auto Refresh ถูกปิดเรียบร้อยแล้ว (จากเมนู)");
  });
  var zones = ticketZones.split(",").map((e) => e.trim());
  async function checkAvailabilityAndProceed(zoneInput) {
    console.log(`[EzyBot] กำลังตรวจโซน: "${zoneInput}"`);
    const normalizedInput = normalizeZoneName(zoneInput);

    const allSectorElements = document.querySelectorAll(
      "rect[data-sector-name], path[data-sector-name], circle[data-sector-name], ellipse[data-sector-name], line[data-sector-name], polyline[data-sector-name], polygon[data-sector-name]"
    );
    let candidates = [];

    for (let el of allSectorElements) {
      const sectorName = el.getAttribute("data-sector-name") || "";
      const normalizedSector = normalizeZoneName(sectorName);

      let match = false;
      if (normalizedSector === normalizedInput) {
        match = true;
      } else if (
        !candidates.some(c => c.exact) &&  // partial match ได้ ถ้ายังไม่มี exact match
        !zoneInput.includes("-") &&
        !zoneInput.includes(" ")
      ) {
        if (
          sectorName.toLowerCase().startsWith(zoneInput.toLowerCase() + "-") ||
          sectorName.toLowerCase().startsWith(zoneInput.toLowerCase() + " ")
        ) {
          match = true;
        }
      }

      if (!match) continue;

      // หา outer g ที่มี class หรือ id (รองรับ g ซ้อนเปล่า)
      let outerG = el.parentElement;
      while (outerG && outerG.tagName === "g") {
        // หยุดทันทีถ้าเจอ g ที่มี id หรือ class (ไม่เว้นว่าง)
        if (outerG.id || (outerG.className && outerG.className.trim() !== "")) {
          break;
        }
        // ถ้า g นี้เป็น "เปล่า" (ไม่มี id และ class ว่าง) → ขึ้นไปชั้นบน
        outerG = outerG.parentElement;
      }

      // ตรวจสอบว่าพบ outerG ที่ถูกต้องหรือไม่
      if (
        !outerG ||
        outerG.tagName !== "g" ||
        (!outerG.id && (!outerG.className || outerG.className.trim() === ""))
      ) {
        console.log(
          `[EzyBot] ข้าม ${sectorName} - ไม่พบ outer <g> ที่มี class หรือ id ที่สมเหตุสมผล`
        );
        continue;
      }
      candidates.push({
        g: outerG,
        el,
        exact: normalizedSector === normalizedInput,
        sectorName,
      });
    }

    // เรียงตาม DOM order
    candidates.sort((a, b) => {
      const idxA = Array.from(allSectorElements).indexOf(a.el);
      const idxB = Array.from(allSectorElements).indexOf(b.el);
      return idxA - idxB;
    });

    const processedZones = new Set();  // เพิ่ม Set สำหรับ track sectorName ที่เคย log ข้าม

    for (let { g, el, exact, sectorName } of candidates) {

      if (processedZones.has(sectorName)) continue;  // ข้ามถ้าเคย log โซนนี้แล้ว
    processedZones.add(sectorName);

      const isActive = g.classList.contains("active");
      const isDisabled = g.classList.contains("disabled");

      if (!isActive || isDisabled) {
        console.log(
          `[EzyBot] ข้ามโซน "${sectorName}" (active: ${isActive}, disabled: ${isDisabled})`
        );
        continue;
      }

      console.log(
        `[EzyBot] พบโซนใช้งานได้: "${sectorName}" ${exact ? "(exact)" : "(partial)"
        } → ลองคลิก`
      );

      if (await processZone(el)) {
        return true;
      }
    }

    console.log(`[EzyBot] ไม่พบโซน "${zoneInput}" ที่ใช้งานได้`);
    return false;
  }
  async function processZone(element) {
    if (!element) return false;

    // หา outer g เหมือนด้านบน
    let outerG = element.parentElement;
    while (outerG && outerG.tagName === "g") {
      if (outerG.id || (outerG.className && outerG.className.trim() !== "")) {
        break;
      }
      outerG = outerG.parentElement;
    }

    if (
      !outerG ||
      outerG.tagName !== "g" ||
      (!outerG.id && (!outerG.className || outerG.className.trim() === ""))
    ) {
      console.log(`[EzyBot] ไม่พบ outer <g> ที่มี class/id สำหรับ element นี้`);
      return false;
    }

    const sectorName = element.getAttribute("data-sector-name") || "unknown";

    if (outerG.classList.contains("disabled")) {
      console.log(`[EzyBot] ข้าม ${sectorName} เพราะ outer <g> disabled`);
      return false;
    }

    if (!outerG.classList.contains("active")) {
      console.log(`[EzyBot] ข้าม ${sectorName} เพราะ outer <g> ไม่ active`);
      return false;
    }

    console.log(`[EzyBot] คลิกเข้าโซน: ${sectorName} (outer g active)`);
    simulateClick(element);

    // ส่วนที่เหลือเหมือนเดิม...
    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (document.querySelectorAll(".seat-g").length > 0) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    const available = document.querySelectorAll(".seat-g.available");
    const enough = available.length >= numTickets && available.length > 0;

    console.log(
      `[EzyBot] โซน ${sectorName} → ว่าง ${available.length}/${numTickets} → ${enough ? "พอ" : "ไม่พอ"
      }`
    );

    return enough;
  }
  function shuffleArray(e) {
    for (let t = e.length - 1; t > 0; t--) {
      const n = Math.floor(Math.random() * (t + 1));
      [e[t], e[n]] = [e[n], e[t]];
    }
    return e;
  }
  function checkAllZonesDisabled() {
    const hasAuto = zones.some((z) => z.toLowerCase() === "auto");
    const specificZones = zones.filter((z) => z.toLowerCase() !== "auto");

    console.log(
      "[EzyBot] checkAllZonesDisabled: hasAuto =",
      hasAuto,
      "specificZones =",
      specificZones
    );

    if (hasAuto) {
      const activeGs = document.querySelectorAll("g.active[id]");
      const allDisabled = Array.from(activeGs).every((g) =>
        g.classList.contains("disabled")
      );
      console.log(
        "[EzyBot] Auto mode: พบ g.active ทั้งหมด",
        activeGs.length,
        "ตัว, disabled หมด?",
        allDisabled
      );
      return allDisabled;
    }

    // โหมดระบุโซนเฉพาะ: ต้องเช็คทุกโซนว่าหายไปหรือ disabled ทั้งหมด
    if (specificZones.length === 0) return true;

    return specificZones.every((zoneName) => {
      const normalizedInput = normalizeZoneName(zoneName);
      console.log(
        "[EzyBot] เช็คโซน:",
        zoneName,
        "(normalized:",
        normalizedInput,
        ")"
      );

      const sectorEls = document.querySelectorAll("[data-sector-name]");
      let foundAny = false;
      let allDisabledForThisZone = true;
      const processed = new Set();  // เพิ่มตรงนี้

      for (let el of sectorEls) {
        const sectorName = el.getAttribute("data-sector-name") || "";

        if (processed.has(sectorName)) continue;
        processed.add(sectorName);


        const normalizedSector = normalizeZoneName(sectorName);

        let isMatch = normalizedSector === normalizedInput;

        // partial match สำหรับเคสแบบ "SM"
        if (!isMatch && !zoneName.includes("-") && !zoneName.includes(" ")) {
          const lowerSector = sectorName.toLowerCase();
          const lowerInput = zoneName.toLowerCase();
          isMatch =
            lowerSector.startsWith(lowerInput + "-") ||
            lowerSector.startsWith(lowerInput + " ");
        }

        if (isMatch) {
          foundAny = true;
          let outerG = el.parentElement;
          while (outerG && outerG.tagName === "g") {
            if (
              outerG.id ||
              (outerG.className && outerG.className.trim() !== "")
            ) {
              break;
            }
            outerG = outerG.parentElement;
          }

          if (
            outerG &&
            outerG.tagName === "g" &&
            (outerG.id || (outerG.className && outerG.className.trim() !== ""))
          ) {
            const isDisabled = outerG.classList.contains("disabled");
            console.log(
              `[EzyBot] พบ ${sectorName} (outerG: ${outerG.id || outerG.className.trim()
              }) → disabled? ${isDisabled}`
            );

            if (!isDisabled) {
              allDisabledForThisZone = false;
              // ไม่ break เพราะอยาก log ทุกตัว แต่จริง ๆ ถ้าเจอตัวไม่ disabled ก็ถือว่าไม่ disabled หมดแล้ว
            }
          }
        }
      }

      if (!foundAny) {
        console.log(
          `[EzyBot] ไม่พบโซนใด ๆ ที่ match "${zoneName}" → ถือว่า disabled/ยังไม่เปิด`
        );
        return true; // ไม่พบ = ถือว่า "disabled" หรือยังไม่พร้อม → ช่วยให้ refresh
      }

      console.log(
        `[EzyBot] โซน "${zoneName}" disabled ทั้งหมด? ${allDisabledForThisZone}`
      );
      return allDisabledForThisZone;
    });
  }
  async function processZones() {
    for (; !document.querySelector("#floor-plan-svg");)
      await new Promise((e) => setTimeout(e, 100));
    const e = Array.from(
      document.querySelectorAll(
        "g.active:not(.disabled):not(.not-applicable) [data-sector-name]"
      )
    );
    if (0 === e.length)
      return void setTimeout(() => {
        location.reload();
      }, 1500);
    const t = async () => {
      await new Promise((e) => setTimeout(e, 10)),
        autoClick && autoClickZoom(),
        document.querySelector("#ticket-quantity") && processStanding();
    };
    e.forEach((e) => {
      e.addEventListener("click", t);
    });
    const n = zones.some((e) => "auto" === e.toLowerCase()),
      o = zones.filter((e) => "auto" !== e.toLowerCase());
    if (n) {
      const t = shuffleArray([...e]);
      for (let e = 0; e < t.length; e++) {
        const n = t[e],
          o = n.closest("g");
        if (
          o &&
          o.classList.contains("active") &&
          !o.classList.contains("not-applicable") &&
          (await processZone(n))
        )
          return;
      }
    }
    if (o.length > 0)
      for (let e = 0; e < o.length; e++) {
        const t = o[e];
        if (await checkAvailabilityAndProceed(t)) return;
      }
    if (autoRefresh) {
      if (checkAllZonesDisabled()) {
        console.log(
          "[EzyBot] ทุกโซนที่ระบุ disabled หรือไม่พบ → รีเฟรชหน้าใน 1.5 วินาที"
        );
        setTimeout(() => location.reload(), 1500);
      } else {
        console.log("[EzyBot] ยังมีโซนที่ใช้งานได้อยู่ → ไม่รีเฟรช");
      }
    }
    return () => {
      e.forEach((e) => {
        e.removeEventListener("click", t);
      });
    };
  }
  let submitClicked = !1,
    refreshInterval = null;
  function processStanding() {
    let e = document.getElementById("ticket-quantity");
    if (!e) return;
    let t = Math.max(...Array.from(e.options).map((e) => parseInt(e.value)));
    e.value = Math.min(numTickets, t);
    let n = new Event("change", { bubbles: !0 });
    e.dispatchEvent(n);
    const o = document.querySelector("button.submit-seat");
    o && !submitClicked && (o.click(), (submitClicked = !0));
  }
  function autoClickZoom() {
    let e = !1;
    const t = new MutationObserver((o) => {
      const s = document.querySelector(".seat-zoom-view-control .btn.zoom");
      if (s) {
        setTimeout(() => {
          s.classList.contains("zoomed")
            ? ((e = !0), n(s))
            : e || (s.click(), (e = !0), n(s));
        }, 1e3),
          t.disconnect(),
          s.addEventListener("click", () => {
            (e = !0), n(s);
          });
        const o = document.querySelector(".btn.btn-refresh");
        o &&
          o.addEventListener("click", () => {
            setTimeout(() => {
              e && n(s);
            }, 200);
          });
      }
    });
    function n(t) {
      const n = document.querySelector(".loading-plan");
      if (!e) return;
      if (
        (!n || n.classList.contains("hidden")) &&
        t.classList.contains("zoomed")
      )
        return void o();
      const s = new MutationObserver((e) => {
        n.classList.contains("hidden") &&
          t.classList.contains("zoomed") &&
          (s.disconnect(), o());
      });
      s.observe(n, { attributes: !0, attributeFilter: ["class"] });
    }
    function o() {
      const e = document.querySelector("#seat-selection");
      let t;
      if (e) {
        const n = e.querySelector(".text-primary");
        if (n) {
          const e = n.textContent.match(/(\d+)\/(\d+)/);
          e && e[2] && (t = parseInt(e[2]));
        }
      }
      void 0 !== t && (numTickets = Math.min(numTickets, t)),
        autoSelectSeats(numTickets, selectAdjacent);
    }
    t.observe(document.body, { attributes: !0, childList: !0, subtree: !0 });
  }
  function getRowLabel(e) {
    const t = e + 2;
    let n = [];
    return (
      Array.from(document.querySelectorAll("text")).forEach((e) => {
        if ("start" !== e.getAttribute("text-anchor")) return;
        const o = parseFloat(e.getAttribute("y"));
        if (o <= t) {
          const s = e.textContent.trim();
          if (s.match(/^[A-Z]{1,2}$/) || s.match(/^\d+$/)) {
            const e = t - o;
            e <= 30 && n.push({ ty: o, label: s, dist: e });
          }
        }
      }),
      0 === n.length ? null : (n.sort((e, t) => e.dist - t.dist), n[0].label)
    );
  }
  function getRowOrder(e) {
    if (!e) return 1 / 0;
    const t = parseInt(e.replace(/\D/g, ""));
    if (!isNaN(t)) return t;
    let n = 0;
    for (let t of e.toUpperCase())
      n = 26 * n + (t.charCodeAt(0) - "A".charCodeAt(0) + 1);
    return n;
  }
  function findPossibleStarts(e, t) {
    const n = [];
    if (!e || e.length < t) return n;
    for (let o = 0; o <= e.length - t; o++) {
      let s = !0;
      for (let n = 1; n < t; n++) {
        if (
          parseFloat(e[o + n].getAttribute("cx")) -
          parseFloat(e[o + n - 1].getAttribute("cx")) >
          25
        ) {
          s = !1;
          break;
        }
      }
      s && n.push(o);
    }
    return n;
  }
  function autoSelectSeats(e, t) {
    const n = document.querySelectorAll(".seat-g.available circle"),
      o = document.querySelectorAll(".seat-g.selected circle");
    if (0 === n.length) {
      if (autoClick && !refreshInterval) {
        const e = document.querySelector(".btn-refresh");
        e && e.click(),
          (refreshInterval = setInterval(() => {
            if (
              document.querySelectorAll(".seat-g.available circle").length > 0
            )
              clearInterval(refreshInterval),
                (refreshInterval = null),
                autoSelectSeats(numTickets, t);
            else {
              const e = document.querySelector(".btn-refresh");
              e && e.click();
            }
          }, 2e3));
      }
      return;
    }
    refreshInterval &&
      (clearInterval(refreshInterval), (refreshInterval = null));
    const s = o.length,
      r = e - s;
    if (r <= 0) return;
    const l = Array.from(n).filter(
      (e) => !e.parentElement.classList.contains("selected")
    ),
      c = t && e > 1;
    function i(e, t, n, o, s = !1) {
      e.getBoundingClientRect();
      const r = parseFloat(e.getAttribute("cx")),
        l = parseFloat(e.getAttribute("cy")),
        c = [
          new PointerEvent("pointerdown", {
            bubbles: !0,
            cancelable: !1,
            clientX: r,
            clientY: l,
            pointerId: 1,
            button: 0,
          }),
          new MouseEvent("click", {
            bubbles: !0,
            cancelable: !1,
            clientX: r,
            clientY: l,
            button: 0,
          }),
          new PointerEvent("pointerup", {
            bubbles: !0,
            cancelable: !1,
            clientX: r,
            clientY: l,
            pointerId: 1,
            button: 0,
          }),
        ];
      c.forEach((e, n) => {
        if ((t.dispatchEvent(e), n === c.length - 1)) {
          t.querySelector("text").textContent, getRowLabel(l);
          o();
        }
      });
    }
    const a = {};
    Array.from(n).forEach((e) => {
      const t = parseFloat(e.getAttribute("cy"));
      a[t] || (a[t] = []), a[t].push(e);
    }),
      Object.keys(a).forEach((e) => {
        a[e].sort(
          (e, t) =>
            parseFloat(e.getAttribute("cx")) - parseFloat(t.getAttribute("cx"))
        );
      });
    let u = [];
    function d(e, t, n, o) {
      if (n >= t) return void o();
      const s = e[n],
        r = s.parentElement;
      r &&
        r.classList.contains("selected") &&
        i(
          s,
          r,
          0,
          () => {
            n++, d(e, t, n, o);
          },
          !0
        );
    }
    const m = {};
    o.forEach((e) => {
      const t = parseFloat(e.getAttribute("cy"));
      m[t] || (m[t] = []), m[t].push(parseFloat(e.getAttribute("cx")));
    });
    let f = !1,
      g = !1;
    if (s > 0 && c) {
      if (1 === Object.keys(m).length) {
        const t = Object.keys(m)[0],
          n = a[t] || [];
        if (!n || 0 === n.length) return;
        const o = m[t];
        o.sort((e, t) => e - t);
        const s = n.findIndex((e) => parseFloat(e.getAttribute("cx")) === o[0]),
          r = n.findIndex(
            (e) => parseFloat(e.getAttribute("cx")) === o[o.length - 1]
          );
        let l = Math.max(0, s - (e - 1));
        Math.min(n.length, r + e);
        for (let t = l; t <= s && t + e - 1 <= n.length; t++) {
          let s = [],
            r = t;
          for (
            ;
            r < n.length &&
            s.length < e &&
            (r === t ||
              parseFloat(n[r].getAttribute("cx")) -
              parseFloat(n[r - 1].getAttribute("cx")) <=
              25);

          )
            s.push(n[r]), r++;
          const l = o.every((e) =>
            s.some((t) => parseFloat(t.getAttribute("cx")) === e)
          );
          if (s.length >= e && l) {
            (f = !0),
              (u = s.filter(
                (e) => !e.parentElement.classList.contains("selected")
              )),
              (g = !0);
            break;
          }
        }
      } else {
        let n = 0,
          s = null,
          r = 0,
          l = [];
        const c = Object.keys(m).sort((e, t) => e - t);
        for (let t of c) {
          const o = a[t] || [];
          if (!o || 0 === o.length) continue;
          const c = m[t];
          c.sort((e, t) => e - t);
          const i = o.findIndex(
            (e) => parseFloat(e.getAttribute("cx")) === c[0]
          ),
            u = o.findIndex(
              (e) => parseFloat(e.getAttribute("cx")) === c[c.length - 1]
            );
          let d = Math.max(0, i - (e - 1));
          Math.min(o.length, u + e);
          for (let a = d; a <= i && a + e - 1 <= o.length; a++) {
            let i = [],
              u = a;
            for (
              ;
              u < o.length &&
              i.length < e &&
              (u === a ||
                parseFloat(o[u].getAttribute("cx")) -
                parseFloat(o[u - 1].getAttribute("cx")) <=
                25);

            )
              i.push(o[u]), u++;
            const d = c.every((e) =>
              i.some((t) => parseFloat(t.getAttribute("cx")) === e)
            );
            i.length >= e &&
              d &&
              c.length > n &&
              ((n = c.length), (s = t), (r = a), (l = i));
          }
        }
        if (s) {
          const n = s;
          let r = 0;
          const c = Array.from(o).filter(
            (e) => parseFloat(e.getAttribute("cy")) !== parseFloat(n)
          ),
            i = c.length;
          if (i > 0)
            return void d(c, i, r, () => {
              const s = a[n] || [],
                r = findPossibleStarts(s, e);
              let l = [];
              if (r.length > 0) {
                const t = r[Math.floor(Math.random() * r.length)];
                l = s
                  .slice(t, t + e)
                  .filter(
                    (e) => !e.parentElement.classList.contains("selected")
                  );
              }
              l.length > 0
                ? ((u = l), (f = !0), (g = !0))
                : d(Array.from(o), o.length, 0, () => autoSelectSeats(e, t));
            });
          {
            f = !0;
            const t = findPossibleStarts(a[s], e);
            if (t.length > 0) {
              const n = t[Math.floor(Math.random() * t.length)];
              u = l
                .slice(n, n + e)
                .filter((e) => !e.parentElement.classList.contains("selected"));
            }
            g = !0;
          }
        }
      }
      if (!f) {
        let n = 0;
        const s = o.length;
        return void d(o, s, n, () => {
          autoSelectSeats(e, t);
        });
      }
    }
    if (!g)
      if (c) {
        let n = Object.keys(a);
        "first" === selectMode
          ? (n = n.sort((e, t) => {
            const n = getRowLabel(parseFloat(e)),
              o = getRowLabel(parseFloat(t));
            return getRowOrder(n) - getRowOrder(o);
          }))
          : "last" === selectMode
            ? (n = n.sort((e, t) => {
              const n = getRowLabel(parseFloat(e));
              return getRowOrder(getRowLabel(parseFloat(t))) - getRowOrder(n);
            }))
            : shuffleArray(n);
        let o = !1;
        for (let t of n) {
          const n = a[t];
          if (!n || 0 === n.length) continue;
          const s = findPossibleStarts(n, e);
          if (s.length > 0) {
            const t = s[Math.floor(Math.random() * s.length)];
            (u = n.slice(t, t + e)), (o = !0);
            break;
          }
        }
        if (!o) {
          if (autoClick && !refreshInterval) {
            const n = document.querySelector(".btn-refresh");
            n && n.click(),
              (refreshInterval = setInterval(() => {
                const n = document.querySelectorAll(".seat-g.available circle");
                if (0 === n.length) {
                  const e = document.querySelector(".btn-refresh");
                  return void (e && e.click());
                }
                const o = {};
                n.forEach((e) => {
                  const t = parseFloat(e.getAttribute("cy"));
                  o[t] || (o[t] = []), o[t].push(e);
                }),
                  Object.keys(o).forEach((e) => {
                    o[e].sort(
                      (e, t) =>
                        parseFloat(e.getAttribute("cx")) -
                        parseFloat(t.getAttribute("cx"))
                    );
                  });
                let s = !1;
                for (let t of Object.keys(o)) {
                  if (findPossibleStarts(o[t], e).length > 0) {
                    s = !0;
                    break;
                  }
                }
                if (s)
                  clearInterval(refreshInterval),
                    (refreshInterval = null),
                    autoSelectSeats(e, t);
                else {
                  const e = document.querySelector(".btn-refresh");
                  e && e.click();
                }
              }, 2e3));
          }
          return;
        }
      } else {
        let e = [];
        if ("first" === selectMode || "last" === selectMode) {
          let t = Object.keys(a).sort((e, t) => {
            const n = getRowLabel(parseFloat(e)),
              o = getRowLabel(parseFloat(t)),
              s = getRowOrder(n),
              r = getRowOrder(o);
            return "first" === selectMode ? s - r : r - s;
          }),
            n = [];
          for (let e of t) {
            const t = a[e] || [];
            if (((n = n.concat(t)), n.length >= r)) break;
          }
          shuffleArray(n), (e = n.slice(0, r));
        } else (e = l), shuffleArray(e);
        if (e.length < r) {
          if (autoClick && !refreshInterval) {
            const e = document.querySelector(".btn-refresh");
            e && e.click(),
              (refreshInterval = setInterval(() => {
                const e = document.querySelectorAll(".seat-g.available circle");
                if (
                  Array.from(e).filter(
                    (e) => !e.parentElement.classList.contains("selected")
                  ).length >= r
                )
                  clearInterval(refreshInterval),
                    (refreshInterval = null),
                    autoSelectSeats(numTickets, t);
                else {
                  const e = document.querySelector(".btn-refresh");
                  e && e.click();
                }
              }, 2e3));
          }
          return;
        }
        u = e;
      }
    let b = 0;
    !(function e() {
      if (b >= r || b >= u.length) return;
      const t = u[b];
      if (!t) return;
      const n = t.parentElement;
      n &&
        !n.classList.contains("selected") &&
        i(t, n, 0, () => {
          b++, e();
        });
    })();
  }
  function autoSelectSeats(e, t) {
    const n = document.querySelectorAll(".seat-g.available circle"),
      o = document.querySelectorAll(".seat-g.selected circle");
    if (0 === n.length) {
      if (autoClick && !refreshInterval) {
        const e = document.querySelector(".btn-refresh");
        e && e.click(),
          (refreshInterval = setInterval(() => {
            if (
              document.querySelectorAll(".seat-g.available circle").length > 0
            )
              clearInterval(refreshInterval),
                (refreshInterval = null),
                autoSelectSeats(numTickets, t);
            else {
              const e = document.querySelector(".btn-refresh");
              e && e.click();
            }
          }, 2e3));
      }
      return;
    }
    refreshInterval &&
      (clearInterval(refreshInterval), (refreshInterval = null));
    const s = o.length,
      r = e - s;
    if (r <= 0) return;
    const l = Array.from(n).filter(
      (e) => !e.parentElement.classList.contains("selected")
    ),
      c = t && e > 1;
    function i(e, t, n, o, s = !1) {
      e.getBoundingClientRect();
      const r = parseFloat(e.getAttribute("cx")),
        l = parseFloat(e.getAttribute("cy")),
        c = [
          new PointerEvent("pointerdown", {
            bubbles: !0,
            cancelable: !1,
            clientX: r,
            clientY: l,
            pointerId: 1,
            button: 0,
          }),
          new MouseEvent("click", {
            bubbles: !0,
            cancelable: !1,
            clientX: r,
            clientY: l,
            button: 0,
          }),
          new PointerEvent("pointerup", {
            bubbles: !0,
            cancelable: !1,
            clientX: r,
            clientY: l,
            pointerId: 1,
            button: 0,
          }),
        ];
      c.forEach((e, n) => {
        if ((t.dispatchEvent(e), n === c.length - 1)) {
          t.querySelector("text").textContent, getRowLabel(l);
          o();
        }
      });
    }
    const a = {};
    Array.from(n).forEach((e) => {
      const t = parseFloat(e.getAttribute("cy"));
      a[t] || (a[t] = []), a[t].push(e);
    }),
      Object.keys(a).forEach((e) => {
        a[e].sort(
          (e, t) =>
            parseFloat(e.getAttribute("cx")) - parseFloat(t.getAttribute("cx"))
        );
      });
    let u = [];
    function d(e, t, n, o) {
      if (n >= t) return void o();
      const s = e[n],
        r = s.parentElement;
      r &&
        r.classList.contains("selected") &&
        i(
          s,
          r,
          0,
          () => {
            n++, d(e, t, n, o);
          },
          !0
        );
    }
    const m = {};
    o.forEach((e) => {
      const t = parseFloat(e.getAttribute("cy"));
      m[t] || (m[t] = []), m[t].push(parseFloat(e.getAttribute("cx")));
    });
    let f = !1,
      g = !1;
    if (s > 0 && c) {
      if (1 === Object.keys(m).length) {
        const t = Object.keys(m)[0],
          n = a[t] || [];
        if (!n || 0 === n.length) return;
        const o = m[t];
        o.sort((e, t) => e - t);
        const s = n.findIndex((e) => parseFloat(e.getAttribute("cx")) === o[0]),
          r = n.findIndex(
            (e) => parseFloat(e.getAttribute("cx")) === o[o.length - 1]
          );
        let l = Math.max(0, s - (e - 1));
        Math.min(n.length, r + e);
        for (let t = l; t <= s && t + e - 1 <= n.length; t++) {
          let s = [],
            r = t;
          for (
            ;
            r < n.length &&
            s.length < e &&
            (r === t ||
              parseFloat(n[r].getAttribute("cx")) -
              parseFloat(n[r - 1].getAttribute("cx")) <=
              25);

          )
            s.push(n[r]), r++;
          const l = o.every((e) =>
            s.some((t) => parseFloat(t.getAttribute("cx")) === e)
          );
          if (s.length >= e && l) {
            (f = !0),
              (u = s.filter(
                (e) => !e.parentElement.classList.contains("selected")
              )),
              (g = !0);
            break;
          }
        }
      } else {
        let n = 0,
          s = null,
          r = 0,
          l = [];
        const c = Object.keys(m).sort((e, t) => e - t);
        for (let t of c) {
          const o = a[t] || [];
          if (!o || 0 === o.length) continue;
          const c = m[t];
          c.sort((e, t) => e - t);
          const i = o.findIndex(
            (e) => parseFloat(e.getAttribute("cx")) === c[0]
          ),
            u = o.findIndex(
              (e) => parseFloat(e.getAttribute("cx")) === c[c.length - 1]
            );
          let d = Math.max(0, i - (e - 1));
          Math.min(o.length, u + e);
          for (let a = d; a <= i && a + e - 1 <= o.length; a++) {
            let i = [],
              u = a;
            for (
              ;
              u < o.length &&
              i.length < e &&
              (u === a ||
                parseFloat(o[u].getAttribute("cx")) -
                parseFloat(o[u - 1].getAttribute("cx")) <=
                25);

            )
              i.push(o[u]), u++;
            const d = c.every((e) =>
              i.some((t) => parseFloat(t.getAttribute("cx")) === e)
            );
            i.length >= e &&
              d &&
              c.length > n &&
              ((n = c.length), (s = t), (r = a), (l = i));
          }
        }
        if (s) {
          const n = s;
          let r = 0;
          const c = Array.from(o).filter(
            (e) => parseFloat(e.getAttribute("cy")) !== parseFloat(n)
          ),
            i = c.length;
          if (i > 0)
            return void d(c, i, r, () => {
              const s = a[n] || [],
                r = findPossibleStarts(s, e);
              let l = [];
              if (r.length > 0) {
                const t = r[Math.floor(Math.random() * r.length)];
                l = s
                  .slice(t, t + e)
                  .filter(
                    (e) => !e.parentElement.classList.contains("selected")
                  );
              }
              l.length > 0
                ? ((u = l), (f = !0), (g = !0))
                : d(Array.from(o), o.length, 0, () => autoSelectSeats(e, t));
            });
          {
            f = !0;
            const t = findPossibleStarts(a[s], e);
            if (t.length > 0) {
              const n = t[Math.floor(Math.random() * t.length)];
              u = l
                .slice(n, n + e)
                .filter((e) => !e.parentElement.classList.contains("selected"));
            }
            g = !0;
          }
        }
      }
      if (!f) {
        let n = 0;
        const s = o.length;
        return void d(o, s, n, () => {
          autoSelectSeats(e, t);
        });
      }
    }
    if (!g)
      if (c) {
        let n = Object.keys(a);
        "first" === selectMode
          ? (n = n.sort((e, t) => {
            const n = getRowLabel(parseFloat(e)),
              o = getRowLabel(parseFloat(t));
            return getRowOrder(n) - getRowOrder(o);
          }))
          : "last" === selectMode
            ? (n = n.sort((e, t) => {
              const n = getRowLabel(parseFloat(e));
              return getRowOrder(getRowLabel(parseFloat(t))) - getRowOrder(n);
            }))
            : shuffleArray(n);
        let o = !1;
        for (let t of n) {
          const n = a[t];
          if (!n || 0 === n.length) continue;
          const s = findPossibleStarts(n, e);
          if (s.length > 0) {
            const t = s[Math.floor(Math.random() * s.length)];
            (u = n.slice(t, t + e)), (o = !0);
            break;
          }
        }
        if (!o) {
          if (autoClick && !refreshInterval) {
            const n = document.querySelector(".btn-refresh");
            n && n.click(),
              (refreshInterval = setInterval(() => {
                const n = document.querySelectorAll(".seat-g.available circle");
                if (0 === n.length) {
                  const e = document.querySelector(".btn-refresh");
                  return void (e && e.click());
                }
                const o = {};
                n.forEach((e) => {
                  const t = parseFloat(e.getAttribute("cy"));
                  o[t] || (o[t] = []), o[t].push(e);
                }),
                  Object.keys(o).forEach((e) => {
                    o[e].sort(
                      (e, t) =>
                        parseFloat(e.getAttribute("cx")) -
                        parseFloat(t.getAttribute("cx"))
                    );
                  });
                let s = !1;
                for (let t of Object.keys(o)) {
                  if (findPossibleStarts(o[t], e).length > 0) {
                    s = !0;
                    break;
                  }
                }
                if (s)
                  clearInterval(refreshInterval),
                    (refreshInterval = null),
                    autoSelectSeats(e, t);
                else {
                  const e = document.querySelector(".btn-refresh");
                  e && e.click();
                }
              }, 2e3));
          }
          return;
        }
      } else {
        let e = [];
        if ("first" === selectMode || "last" === selectMode) {
          let t = Object.keys(a).sort((e, t) => {
            const n = getRowLabel(parseFloat(e)),
              o = getRowLabel(parseFloat(t)),
              s = getRowOrder(n),
              r = getRowOrder(o);
            return "first" === selectMode ? s - r : r - s;
          }),
            n = [];
          for (let e of t) {
            const t = a[e] || [];
            if (((n = n.concat(t)), n.length >= r)) break;
          }
          shuffleArray(n), (e = n.slice(0, r));
        } else (e = l), shuffleArray(e);
        if (e.length < r) {
          if (autoClick && !refreshInterval) {
            const e = document.querySelector(".btn-refresh");
            e && e.click(),
              (refreshInterval = setInterval(() => {
                const e = document.querySelectorAll(".seat-g.available circle");
                if (
                  Array.from(e).filter(
                    (e) => !e.parentElement.classList.contains("selected")
                  ).length >= r
                )
                  clearInterval(refreshInterval),
                    (refreshInterval = null),
                    autoSelectSeats(numTickets, t);
                else {
                  const e = document.querySelector(".btn-refresh");
                  e && e.click();
                }
              }, 2e3));
          }
          return;
        }
        u = e;
      }
    let b = 0;
    !(function e() {
      if (b >= r || b >= u.length) return;
      const t = u[b];
      if (!t) return;
      const n = t.parentElement;
      n &&
        !n.classList.contains("selected") &&
        i(t, n, 0, () => {
          b++, e();
        });
    })();
  }
  function autoClickSubmitSeat() {
    const e = document.querySelectorAll(".seat-g.selected"),
      t = document.querySelector("button.submit-seat"),
      n = e.length,
      o = document.querySelector("#seat-selection");
    let s;
    if (o) {
      const e = o.querySelector(".text-primary");
      if (e) {
        const t = e.textContent.match(/(\d+)\/(\d+)/);
        t && t[2] && (s = parseInt(t[2]));
      }
    }
    return (
      void 0 !== s && (numTickets = Math.min(numTickets, s)),
      !!t &&
      (n >= numTickets && t && !submitClicked
        ? (t.click(), (submitClicked = !0), !0)
        : (n < numTickets && (submitClicked = !1), !1))
    );
  }
  function autoClickSubmitOrder() {
    const e = document.getElementById("submit-order");
    e && e.click();
  }
  function handleShowtime(e) {
    const t = document.querySelectorAll(".ticket-row");
    if (!t.length) return void observerQuantity(numTickets);
    e < 1 && (e = 1);
    const n = Array.from(t).map((e) => ({
      button: e.querySelector(".choose-showtime"),
      isSoldOut: e.classList.contains("sold-out"),
    }));
    let o = e - 1;
    o >= n.length && (o = n.length - 1);
    const s = n[o];
    if (s.isSoldOut || !s.button) return;
    s.button.click();
    n.some((e) => !!e.button) || observerQuantity(numTickets);
  }
  function observerQuantity(e) {
    const t = new MutationObserver((n) => {
      document.querySelector('[data-testid="Increase quantity button"]') &&
        (t.disconnect(), selectTicketType(e));
    });
    t.observe(document.body, { childList: !0, subtree: !0 });
  }
  function selectTicketType(e) {
    document.querySelectorAll('div[id^="ticket-group-"]').forEach((e) => {
      Array.from(e.classList).forEach((t) => {
        if (t.includes("_isCollapsed_")) {
          const t = e.querySelector(":scope > button");
          t && simulateClick(t);
        }
      });
    });
    const t = Array.from(
      document.querySelectorAll('div[id^="ticket_types_"]')
    ).filter(
      (e) =>
        e.querySelector('[data-testid="Increase quantity button"]') ||
        e.querySelector(".sold-out-text")
    );
    if (1 === t.length) ticketType = 1;
    else if (0 === t.length) return;
    if (
      (ticketType > t.length && (ticketType = t.length), ticketType <= t.length)
    ) {
      const n = t[ticketType - 1].querySelector(
        '[data-testid="Increase quantity button"]'
      );
      n && handleQuantity(n, e);
    }
  }
  function handleQuantity(e, t) {
    const n = e.closest(".d-flex.align-items-center").querySelector("select");
    if (!n) return;
    let o = parseInt(n.value, 10);
    for (let s = 0; s < t; s++)
      if (!e.disabled) {
        e.click(), o++, (n.value = o);
        const t = new Event("change", { bubbles: !0 });
        n.dispatchEvent(t);
      }
    e.scrollIntoView({ behavior: "auto", block: "center" }),
      autoClickSubmitOrder();
  }
  function autoclickQueueConfirm() {
    const e = document.body;
    new MutationObserver(function (e, t) {
      for (let n of e)
        if ("childList" === n.type) {
          const e = document.getElementById("buttonConfirmRedirect");
          if (e) {
            e.click(), t.disconnect();
            break;
          }
        }
    }).observe(e, { childList: !0, subtree: !0 });
  }
  initRunningGuard(),
    isRunning && runBotLogic(),
    window.location.href.startsWith("https://queue.eventpop.me/prequeue/") &&
    handlePrequeuePage(),
    window.location.href.startsWith("https://eventpop.queue-it.net/") &&
    autoclickQueueConfirm(),
    /^https:\/\/www\.eventpop\.me(\/)?(#.*|\?.*)?$/.test(
      window.location.href
    ) && handleHomepageRedirection();
})();
