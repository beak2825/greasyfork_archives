// ==UserScript==
// @name               Outlook Calendar Scroll
// @namespace          https://github.com/Linho1219
// @version            1.6.0
// @description        Scroll to switch calendar months in Outlook PWA
// @author             Linho1219
// @match              https://outlook.live.com/*
// @match              https://outlook.office.com/*
// @match              https://outlook.office365.com/*
// @grant              none
// @run-at             document-end
// @name:zh-CN         Outlook 日历滚动增强脚本
// @description:zh-CN  通过滚动切换 Outlook PWA 中的日历月份
// @homepage           https://github.com/Linho1219/OutlookCalendarScroll
// @supportURL         https://github.com/Linho1219/OutlookCalendarScroll/issues
// @icon               https://outlook.live.com/favicon.ico
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/544953/Outlook%20Calendar%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/544953/Outlook%20Calendar%20Scroll.meta.js
// ==/UserScript==

(function() {
  "use strict";
  function hookHistoryMethod(type) {
    const orig = history[type];
    history[type] = function(...args) {
      const result = orig.apply(this, args);
      window.dispatchEvent(new Event(type));
      return result;
    };
  }
  function compareStates(a, b) {
    if (!a.isCalendar && !b.isCalendar) return true;
    if (a.isCalendar && b.isCalendar) return a.view === b.view;
    return false;
  }
  function watch(callback) {
    hookHistoryMethod("pushState");
    hookHistoryMethod("replaceState");
    function getState() {
      const pathname = location.pathname;
      if (!pathname.startsWith("/calendar")) return { isCalendar: false };
      if (pathname.includes("/view/")) {
        if (pathname.includes("view/day"))
          return { isCalendar: true, view: "day" };
        if (pathname.includes("view/workweek"))
          return { isCalendar: true, view: "workweek" };
        if (pathname.includes("view/week"))
          return { isCalendar: true, view: "week" };
        if (pathname.includes("view/month"))
          return { isCalendar: true, view: "month" };
        console.warn("Unknown calendar view:", pathname);
      } else console.log("Not view path:", pathname);
      return null;
    }
    let currentState = getState() || { isCalendar: false };
    function listener() {
      const newState = getState();
      if (newState && !compareStates(currentState, newState)) {
        currentState = newState;
        callback(currentState);
      }
    }
    window.addEventListener("popstate", listener);
    window.addEventListener("pushState", listener);
    window.addEventListener("replaceState", listener);
    callback(currentState);
  }
  function getCalendarDOMs() {
    const surface = document.querySelector(
      '[data-app-section="CalendarModuleSurface"]'
    );
    const [_, prevBtn, nextBtn] = document.querySelectorAll(
      '[role="toolbar"] button'
    );
    if (!surface || !prevBtn || !nextBtn)
      throw new Error("Calendar DOM elements not found");
    const prev = () => prevBtn.click();
    const next = () => nextBtn.click();
    return { surface, prevBtn, nextBtn, prev, next };
  }
  async function tryGetCalendarDOMs() {
    const interval = 300;
    return new Promise((resolve) => {
      const intervalHandle = setInterval(() => {
        try {
          const doms = getCalendarDOMs();
          clearInterval(intervalHandle);
          resolve(doms);
        } catch (e) {
          console.log("Waiting for calendar DOM elements...");
        }
      }, interval);
    });
  }
  async function mount(dir) {
    const { surface, prev, next } = await tryGetCalendarDOMs();
    return mountScrollIndicator(surface, dir, { next, prev });
  }
  function interpretAccumulated(accumulated, TRIGGER_DISTANCE) {
    const positive = accumulated > 0;
    const abs = Math.abs(accumulated);
    if (abs < TRIGGER_DISTANCE) return { value: accumulated, triggered: false };
    const value = (2 - TRIGGER_DISTANCE / abs) * TRIGGER_DISTANCE;
    return { value: positive ? value : -value, triggered: true };
  }
  function mountScrollIndicator(surface, dir, { next, prev }) {
    const INDICATOR_SIZE = 50;
    const TRIGGER_DISTANCE = 400;
    const DISPLAY_DISTANCE_RATIO = 0.2;
    const TRIGGER_TIMEOUT = 200;
    const NORMAL_BG = "var(--neutralTertiary)";
    const NORMAL_COLOR = "var(--black)";
    const TRIGGERED_BG = "var(--themePrimary)";
    const TRIGGERED_COLOR = "var(--white)";
    let accumulated = 0;
    let timeout;
    const indicator = document.createElement("div");
    indicator.className = "ocs-scroll-indicator";
    Object.assign(indicator.style, {
      position: "absolute",
      width: `${INDICATOR_SIZE}px`,
      height: `${INDICATOR_SIZE}px`,
      borderRadius: "50%",
      fontSize: "20px",
      backgroundColor: NORMAL_BG,
      color: NORMAL_COLOR,
      fontFamily: "FluentSystemIcons",
      zIndex: "9999",
      transition: "transform 0.06s, background-color 0.1s, color 0.1s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none"
    });
    indicator.innerText = "";
    if (dir === "vertical") {
      indicator.style.left = "50%";
      surface.style.overflowY = "hidden";
    } else {
      indicator.style.top = "50%";
      surface.style.overflowX = "hidden";
    }
    surface.style.position = "relative";
    function setColor(triggered) {
      if (triggered) {
        indicator.classList.add("triggered");
        indicator.style.backgroundColor = TRIGGERED_BG;
        indicator.style.color = TRIGGERED_COLOR;
      } else {
        indicator.classList.remove("triggered");
        indicator.style.backgroundColor = NORMAL_BG;
        indicator.style.color = NORMAL_COLOR;
      }
    }
    setColor(false);
    function setPosition(value, positive = value > 0) {
      const translate = -value * DISPLAY_DISTANCE_RATIO;
      if (dir === "vertical") {
        if (positive) {
          indicator.style.bottom = `-${INDICATOR_SIZE}px`;
          indicator.style.top = "auto";
        } else {
          indicator.style.top = `-${INDICATOR_SIZE}px`;
          indicator.style.bottom = "auto";
        }
        indicator.style.transform = `translateX(-50%) translateY(${translate}px)`;
      } else {
        if (positive) {
          indicator.style.right = `-${INDICATOR_SIZE}px`;
          indicator.style.left = "auto";
        } else {
          indicator.style.left = `-${INDICATOR_SIZE}px`;
          indicator.style.right = "auto";
        }
        indicator.style.transform = `translateY(-50%) translateX(${translate}px)`;
      }
    }
    setPosition(0);
    function reset(value) {
      accumulated = 0;
      setPosition(0, value > 0);
      setColor(false);
    }
    function trigger(value) {
      if (value < 0) prev();
      else next();
      reset(value);
    }
    surface.appendChild(indicator);
    function onWheel(e) {
      if (e.ctrlKey) return;
      let delta;
      if (dir === "vertical") {
        if (e.shiftKey) return;
        delta = e.deltaY;
      } else {
        delta = e.deltaX !== 0 ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      }
      if (!delta) return;
      accumulated += delta;
      const { triggered, value } = interpretAccumulated(
        accumulated,
        TRIGGER_DISTANCE
      );
      setColor(triggered);
      setPosition(value);
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        if (Math.abs(accumulated) >= TRIGGER_DISTANCE) {
          trigger(value);
        } else {
          reset(value);
        }
      }, TRIGGER_TIMEOUT);
    }
    surface.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      surface.removeEventListener("wheel", onWheel);
      indicator.remove();
    };
  }
  const dirMap = {
    day: "horizontal",
    workweek: "horizontal",
    week: "horizontal",
    month: "vertical"
  };
  let lastDir;
  let canceler;
  async function handler(state) {
    if (state.isCalendar) {
      console.log(`Calendar view: ${state.view}`);
      if (lastDir !== dirMap[state.view]) {
        canceler?.();
        lastDir = dirMap[state.view];
        canceler = await mount(dirMap[state.view]);
      }
    } else {
      console.log("Quit calendar view");
      canceler?.();
      lastDir = void 0;
      canceler = void 0;
    }
  }
  window.onload = () => watch(handler);
})();
