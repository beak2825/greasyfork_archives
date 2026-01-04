// ==UserScript==
// @name         UIUC Banner Registration → Export ICS
// @namespace    https://yingzifan.me/
// @version      1.1.0
// @description  Export UIUC course schedule from Registration History to an .ics calendar file.
// @author       you
// @match        https://banner.apps.uillinois.edu/StudentRegistrationSSB/ssb/registrationHistory/registrationHistory
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547175/UIUC%20Banner%20Registration%20%E2%86%92%20Export%20ICS.user.js
// @updateURL https://update.greasyfork.org/scripts/547175/UIUC%20Banner%20Registration%20%E2%86%92%20Export%20ICS.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // -------------------- Constants --------------------
  const TZID = "America/Chicago"; // UIUC timezone
  const DAY_MAP = {
    Sunday: "SU",
    Monday: "MO",
    Tuesday: "TU",
    Wednesday: "WE",
    Thursday: "TH",
    Friday: "FR",
    Saturday: "SA",
  };
  const NAME_TO_NUM = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  // -------------------- Helpers --------------------
  const pad = (n) => String(n).padStart(2, "0");

  function parseMDY(s) {
    // "08/25/2025" -> Date (local)
    const m = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (!m) return null;
    const [_, mm, dd, yyyy] = m;
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  }

  function parseTimeRange(text) {
    // "09:30 AM - 10:45 AM" -> {start:{h,m}, end:{h,m}}
    const m = text.match(
      /(\d{1,2})\s*:\s*(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2})\s*:\s*(\d{2})\s*(AM|PM)/i
    );
    if (!m) return null;
    const to24 = (h12, ampm) => {
      let h = Number(h12) % 12;
      if (/PM/i.test(ampm)) h += 12;
      return h;
    };
    return {
      start: { h: to24(m[1], m[3]), m: Number(m[2]) },
      end: { h: to24(m[4], m[6]), m: Number(m[5]) },
    };
  }

  function formatICSDateLocal(dateObj, h, m) {
    // Local time (no trailing Z), used with TZID
    const dt = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      h,
      m,
      0
    );
    return (
      dt.getFullYear().toString() +
      pad(dt.getMonth() + 1) +
      pad(dt.getDate()) +
      "T" +
      pad(dt.getHours()) +
      pad(dt.getMinutes()) +
      "00"
    );
  }

  function lastDateWithTimeLocal(dateObj) {
    // 23:59:59 local — used for RRULE UNTIL
    const dt = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      23,
      59,
      59
    );
    return (
      dt.getFullYear().toString() +
      pad(dt.getMonth() + 1) +
      pad(dt.getDate()) +
      "T" +
      pad(dt.getHours()) +
      pad(dt.getMinutes()) +
      pad(dt.getSeconds())
    );
  }

  function escapeICS(text) {
    if (!text) return "";
    return text
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }

  function foldLine(s) {
    // Simple 74-char folding
    const out = [];
    for (let i = 0; i < s.length; i += 74) {
      out.push(i === 0 ? s.slice(i, i + 74) : " " + s.slice(i, i + 74));
    }
    return out.join("\r\n");
  }

  function download(filename, text) {
    const blob = new Blob([text], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 0);
  }

  function firstOccurrenceOnOrAfter(startDate, allowedWeekdayNums) {
    // Return the first date >= startDate whose weekday is in allowedWeekdayNums
    const d = new Date(startDate.getTime());
    for (let i = 0; i < 7; i++) {
      if (allowedWeekdayNums.has(d.getDay())) return d;
      d.setDate(d.getDate() + 1);
    }
    return startDate; // fallback (shouldn't happen)
  }

  // -------------------- Parse one course block --------------------
  function parseCourse(wrapper) {
    try {
      const titleA = wrapper.querySelector(
        ".list-view-course-title a.section-details-link"
      );
      const title = titleA
        ? titleA.textContent.trim()
        : (wrapper.querySelector(".list-view-course-title")?.textContent || "")
            .trim();

      const subjSec = (
        wrapper.querySelector(".list-view-subj-course-section")?.textContent ||
        ""
      ).trim();

      // Dates
      const dateSpan = wrapper.querySelector(
        ".listViewMeetingInformation .meetingTimes"
      );
      const dateText = dateSpan ? dateSpan.textContent.trim() : "";
      const [startStr, endStr] = dateText
        .split("--")
        .map((s) => s && s.trim());
      const termStart = parseMDY(startStr || "");
      const termEnd = parseMDY(endStr || "");

      // Days of week
      const dayLis = wrapper.querySelectorAll(
        ".ui-pillbox ul li[aria-checked='true']"
      );
      const bydayList = Array.from(dayLis)
        .map((li) => li.getAttribute("data-name"))
        .filter(Boolean);
      const bydayICS = bydayList
        .map((name) => DAY_MAP[name] || "")
        .filter(Boolean)
        .join(",");

      const bydayNums = new Set(
        bydayList.map((name) => NAME_TO_NUM[name]).filter((x) => x != null)
      );

      // Time range
      const meet = wrapper.querySelector(".listViewMeetingInformation");
      const timeMatch = parseTimeRange(meet ? meet.textContent : "");
      if (!timeMatch) return null;

      // Location (Campus / Building / Room)
      const raw = meet ? meet.textContent : "";
      const locMatch = raw.match(
        /Location:\s*([^\|]+?)\s*Building:\s*([^\|]+?)\s*Room:\s*([^\|\n]+)\b/i
      );
      const campusLoc = locMatch ? locMatch[1].trim() : "";
      const building = locMatch ? locMatch[2].trim() : "";
      const room = locMatch ? locMatch[3].trim() : "";
      const location = [campusLoc, building, room].filter(Boolean).join(", ");

      // Instructor & CRN
      const instructor = (
        wrapper.querySelector(".listViewInstructorInformation a.email")
          ?.textContent || ""
      ).trim();
      const crn = (
        wrapper.querySelector(
          ".listViewInstructorInformation .list-view-crn-schedule"
        )?.textContent || ""
      ).trim();

      // --- IMPORTANT BUG FIX ---
      // DTSTART must be the actual first meeting date (matching BYDAY),
      // not the term start date. Otherwise, some calendar apps will add
      // an extra occurrence on the term start date (e.g., Monday).
      const firstDate = firstOccurrenceOnOrAfter(termStart, bydayNums);

      const dtstartLocal = formatICSDateLocal(
        firstDate,
        timeMatch.start.h,
        timeMatch.start.m
      );
      const dtendLocal = formatICSDateLocal(
        firstDate,
        timeMatch.end.h,
        timeMatch.end.m
      );
      const untilLocal = lastDateWithTimeLocal(termEnd); // local UNTIL

      const titleFull = subjSec ? `${title} | ${subjSec}` : title;
      const description = `CRN: ${crn}\nInstructor: ${instructor}\nFrom ${startStr} to ${endStr}\nGenerated by UIUC Banner exporter`;

      return {
        SUMMARY: titleFull,
        DESCRIPTION: description,
        LOCATION: location,
        DTSTART: dtstartLocal,
        DTEND: dtendLocal,
        BYDAY: bydayICS,
        UNTIL: untilLocal,
      };
    } catch (e) {
      console.warn("parseCourse error", e);
      return null;
    }
  }

  // -------------------- Build ICS --------------------
  function buildICS(events) {
    const lines = [];
    lines.push("BEGIN:VCALENDAR");
    lines.push("PRODID:-//UIUC Banner Exporter//EN");
    lines.push("VERSION:2.0");
    lines.push("CALSCALE:GREGORIAN");
    lines.push("METHOD:PUBLISH");
    lines.push(`X-WR-CALNAME:UIUC Courses`);
    lines.push(`X-WR-TIMEZONE:${TZID}`);
    // Not embedding VTIMEZONE. Most clients understand common TZIDs.

    const stamp = new Date();
    const dtstamp =
      stamp.getUTCFullYear().toString() +
      pad(stamp.getUTCMonth() + 1) +
      pad(stamp.getUTCDate()) +
      "T" +
      pad(stamp.getUTCHours()) +
      pad(stamp.getUTCMinutes()) +
      pad(stamp.getUTCSeconds()) +
      "Z";

    for (const e of events) {
      const uid = `${Math.random().toString(36).slice(2)}-${Date.now()}@uiuc-banner`;
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${uid}`);
      lines.push(`DTSTAMP:${dtstamp}`);
      lines.push(`SUMMARY:${escapeICS(e.SUMMARY)}`);
      if (e.DESCRIPTION)
        lines.push(...foldLine(`DESCRIPTION:${escapeICS(e.DESCRIPTION)}`).split("\r\n"));
      if (e.LOCATION) lines.push(`LOCATION:${escapeICS(e.LOCATION)}`);
      lines.push(`DTSTART;TZID=${TZID}:${e.DTSTART}`);
      lines.push(`DTEND;TZID=${TZID}:${e.DTEND}`);
      if (e.BYDAY) {
        lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${e.BYDAY};UNTIL=${e.UNTIL}`);
      }
      lines.push("END:VEVENT");
    }

    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }

  // -------------------- UI --------------------
  function commonBtnStyle() {
    return {
      font: "12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      padding: "6px 10px",
      border: "1px solid #357edd",
      background: "#4f8ef7",
      color: "#fff",
      borderRadius: "6px",
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
    };
  }

  function insertButtons() {
    const bar = document.createElement("div");
    bar.style.position = "fixed";
    bar.style.top = "12px";
    bar.style.right = "12px";
    bar.style.zIndex = "99999";
    bar.style.display = "flex";
    bar.style.gap = "8px";

    const btnExport = document.createElement("button");
    btnExport.textContent = "Export .ics (All)";
    Object.assign(btnExport.style, commonBtnStyle());

    const btnHelp = document.createElement("button");
    btnHelp.textContent = "ℹ︎";
    Object.assign(btnHelp.style, commonBtnStyle());
    btnHelp.title = "Export all parsed courses on this page into a single .ics file.";

    bar.appendChild(btnExport);
    bar.appendChild(btnHelp);
    document.body.appendChild(bar);

    btnExport.addEventListener("click", onExportICS);
  }

  // -------------------- Actions --------------------
  function collectAllCourses() {
    const wrappers = document.querySelectorAll(
      "#scheduleListView .listViewWrapper"
    );
    const events = [];
    wrappers.forEach((w) => {
      const evt = parseCourse(w);
      if (evt) events.push(evt);
    });
    return events;
  }

  function onExportICS() {
    const events = collectAllCourses();
    if (!events.length) {
      alert(
        "No courses were parsed. Make sure you are on the Registration History page and the list has loaded."
      );
      return;
    }
    const ics = buildICS(events);
    download("UIUC_Courses.ics", ics);
  }

  // -------------------- Init --------------------
  function ready(fn) {
    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      setTimeout(fn, 0);
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(() => {
    const tryInit = () => {
      const root = document.querySelector("#scheduleListView");
      if (
        root &&
        document.querySelectorAll("#scheduleListView .listViewWrapper").length
      ) {
        insertButtons();
      } else {
        setTimeout(tryInit, 700);
      }
    };
    tryInit();
  });
})();