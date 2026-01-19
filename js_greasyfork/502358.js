// ==UserScript==
// @name         fc ticketshop tools
// @namespace    http://tampermonkey.net/
// @version      2.1.1-BETA
// @description  provides various utilities for the fc ticket shop
// @author       Hendrik Steinmetz
// @match        https://www.ticket-onlineshop.com/ols/fckoeln/de/maenner/*
// @match        https://www.ticket-onlineshop.com/ols/fckoeln/de/maenner
// @match        https://www.ticket-onlineshop.com/ols/fckoeln/de/maenner/channel/shop/areaplan/venue/event/*
// @match        https://www.fc-tickets.de*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        GM.xmlHttpRequest
// @grant        GM_getResourceText
// @grant        GM_addElement
// @resource ui  https://pastebin.com/raw/srZb2rMK
// @resource script https://pastebin.com/raw/w9pJPge4
// @downloadURL https://update.greasyfork.org/scripts/502358/fc%20ticketshop%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/502358/fc%20ticketshop%20tools.meta.js
// ==/UserScript==

console.log("Ticketshop detected");

// --------------------------------------------------------------------------------------------
// SELECTORS AND GENERAL CONFIG
// --------------------------------------------------------------------------------------------

const telemetry = false;

const LOG_LEVEL = Object.freeze({
  DEFAULT: Symbol("default"),
  INFO: Symbol("info"),
  WARN: Symbol("warn"),
  ERROR: Symbol("error"),
  DEBUG: Symbol("debug"),
});

const MY_ACCOUNT_BTN = "li.fc-meta-item:nth-child(2)";
const HOME_TEXT =
  "body > div.wrapper.home-wrapper > main > section:nth-child(1)";
const CHOOSE_SEAT_BTN = "#choose-seat-button";
const EVENT_CARDS = ".event-card";
const EVENT_CARD_BTN = "div.event-card__button > a";
const ADD_TO_CART_BTN = "#add-to-cart";
const SEAT_CARDS = ".seat-card";
const INCREASE_NUM_SEATS_STEPPER = "#stepper-plus";
const GET_SEATS_RECOMMENDATION = "#get-seats-recommendation";
const MODAL_NOTIFICATION = "#modal-notification";
const AREA_SELECT = "#select-area";
const LOADING_OVERLAY = "#animation-overlay";
const SEAT_CANVAS = "canvas.leaflet-zoom-animated";
const PRICE_SLIDER = ".js-range-slider";
const BLOCK_SELECT = "#select-subarea";

const blockData = {
  s1: {
    blockId: 5008078,
    priceId: 468867,
    name: "S 1",
    tribune: "Hans+Sch&auml;fer+S&uuml;dkurve",
  },
  s2: {
    blockId: 5008084,
    priceId: 468867,
    name: "S 2",
    tribune: "Hans+Sch&auml;fer+S&uuml;dkurve",
  },
  s3: {
    blockId: 5008090,
    priceId: 468867,
    name: "S 3",
    tribune: "Hans+Sch&auml;fer+S&uuml;dkurve",
  },
  s4: {
    blockId: 5008105,
    priceId: 468867,
    name: "S 4",
    tribune: "Hans+Sch&auml;fer+S&uuml;dkurve",
  },
  s5: {
    blockId: 5008072,
    priceId: 468867,
    name: "S 5",
    tribune: "Hans+Sch&auml;fer+S&uuml;dkurve",
  },
  s6: {
    blockId: 5008096,
    priceId: 468867,
    name: "S 6",
    tribune: "Hans+Sch&auml;fer+S&uuml;dkurve",
  },
  dauerkarte: {
    blockId: 643567,
    priceId: 99830,
    name: "Wartelistenplatz-",
    tribune: "Warteliste",
    testing: true,
  },
};

let config = {};

let checkAddToCartIntervalId = null;
let mouseMovementIntervalId = setInterval(() => {
  let event = new MouseEvent("mousemove", {
    clientX: Math.random() * window.innerWidth,
    clientY: Math.random() * window.innerHeight,
    bubbles: true,
    cancelable: true,
  });
  document.dispatchEvent(event);
}, 300);

const isMobile = window.innerWidth <= 768;

function loadLocalStorage() {
  sendTelemetry(true);
  const defaultConfig = {
    gameIndex: 1,
    state: "STOP",
    numSeats: 1,
    disabled: false,
    selectStanding: true,
    throttle: 0,
    pushbulletApiToken: null,
  };
  info("Loading config from local storage...");
  if (localStorage.getItem("tools-config")) {
    Object.assign(config, defaultConfig, readConfig());
  } else {
    config = defaultConfig;
    writeConfig();
  }
}

// save config on doc unload
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    writeConfig();
  }
});

function cloak() {
  const originalFetch = window.fetch;

  window.fetch = async function (url, options) {
    try {
      let newUrl = url;

      if (typeof url === "string") {
        let urlObj = new URL(url, location.origin);
        let timestampParam = "timestamp";

        if (urlObj.searchParams.has(timestampParam)) {
          urlObj.searchParams.set(timestampParam, Date.now().toString());
          newUrl = urlObj.toString();
          console.log(`Updated URL: ${newUrl}`);
        }
      }

      return originalFetch.apply(this, [newUrl, options]);
    } catch (error) {
      console.error("Fetch hook error:", error);
      return originalFetch.apply(this, arguments);
    }
  };
  Object.defineProperty(window, "fetch", {
    configurable: false,
    writable: false,
    value: window.fetch,
  });

  let userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  ];

  window.RTCPeerConnection = function () {
    return {
      createDataChannel: () => {},
      createOffer: () => new Promise((resolve) => resolve({})),
    };
  };
  HTMLCanvasElement.prototype.getContext = function (type, attrs) {
    if (type === "webgl" || type === "webgl2") {
      return {};
    }
    return HTMLCanvasElement.prototype.getContext.apply(this, arguments);
  };
  Object.defineProperty(navigator, "userAgent", {
    get: () => userAgents[Math.floor(Math.random() * userAgents.length)],
  });
  Object.defineProperty(navigator, "doNotTrack", { get: () => "1" });
  Object.defineProperty(navigator, "webdriver", { get: () => false });
  Object.defineProperty(navigator, "languages", { get: () => ["en-US", "en"] });
  Object.defineProperty(navigator, "platform", { get: () => "Win32" });
  Object.defineProperty(navigator, "hardwareConcurrency", { value: 4 });
  Object.defineProperty(navigator, "plugins", { value: [] });
  Object.defineProperty(navigator, "mimeTypes", { value: [] });
  Object.defineProperty(AudioContext.prototype, "sampleRate", {
    get: () => 44100,
  });
  Object.defineProperty(window.screen, "width", { get: () => 1920 });
  Object.defineProperty(window.screen, "height", { get: () => 1080 });
  Object.defineProperty(window, "innerWidth", { value: 1920 });
  Object.defineProperty(window, "innerHeight", { value: 1080 });
  Date.prototype.getTimezoneOffset = function () {
    return -240;
  };
  window.performance = {
    now: () => Math.random() * 1000,
    timing: { navigationStart: Date.now() - Math.random() * 5000 },
  };
  window.Sentry = {
    init: function () {},
    captureException: function () {},
    captureMessage: function () {},
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === "SCRIPT" && node.src.includes("sentry")) {
          node.remove();
          console.log("Blocked Sentry:", node.src);
        }
      });
    });
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

// --------------------------------------------------------------------------------------------

function checkLoggedIn() {
  const myAccountBtn = document.querySelector(MY_ACCOUNT_BTN);

  return myAccountBtn && hasClass(myAccountBtn, "--is-active");
}

function hideHomeText() {
  const textContainer = document.querySelector(HOME_TEXT);

  if (textContainer) {
    debug("Hiding home text...");
    textContainer.style.display = "none";
  }
}

function clickGameCard() {
  if (config.state === "STOP" || document.querySelector(CHOOSE_SEAT_BTN)) {
    return;
  }
  const cards = document.querySelectorAll(EVENT_CARDS);

  if (config.gameIndex - 1 > cards.length) {
    error("Game with index " + config.gameIndex + " not found");
    config.state = stop;
    writeConfig();
    return;
  }

  const ticketButton =
    cards[config.gameIndex - 1].querySelector(EVENT_CARD_BTN);
  if (ticketButton) {
    ticketButton.click();
  } else {
    error("Ticket button not found for game index: " + config.gameIndex);
    location.reload();
  }
}

function openSeatMap() {
  const chooseSeatButton = document.querySelector(CHOOSE_SEAT_BTN);

  if (chooseSeatButton) {
    chooseSeatButton.click();
  }
}

function handleIncreaseSeats(reload = false) {
  if (config.numSeats === 1) return;
  for (let i = 0; i < config.numSeats - 2; i++) {
    const increaseBtn = document.querySelector(INCREASE_NUM_SEATS_STEPPER);
    if (increaseBtn && !hasClass(increaseBtn, "is-disabled")) {
      increaseBtn.click();
    } else {
      if (reload) {
        location.reload();
      }

      return;
    }
  }
}

async function handleSelectArea() {
  if (!config.selectStanding) return;

  return new Promise((resolve) =>
    setThrottledTimeout(async () => {
      const available = await checkAvailableAreas();
      debug(available);

      if (available.length === 0) {
        resolve(false);
      } else {
        let success = await checkSeatSelected();
        let counter = 0;
        while(!success && counter < available.length) {
          await selectArea(available[counter].id);
          success = await checkSeatSelected();
          counter++;
        }
        if (success) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    }, 400)
  );
}

function checkAvailableAreas() {
  return new Promise((resolve) => {
    let areas = Array.from(
      document.querySelectorAll("#general-admissions > .block")
    );

    const available = areas
      .map((area) => area.firstChild)
      .filter((area) => area && hasClass(area, "has-hover"));

    resolve(available);
  });
}

function selectArea(area) {
  return new Promise((resolve) => {
    setThrottledTimeout(() => {
      sms.selectById(area);
      resolve();
    }, 0);
  });
}

function checkSeatSelected() {
  return new Promise((resolve) => {
    setThrottledTimeout(() => {
      const seatCards = document.querySelectorAll(".clubsale");
      const modalElem = document.querySelector(MODAL_NOTIFICATION);
      if (document.body.innerHTML.includes("Ich bin ein Mensch")) {
        // bot detected
        setThrottle(getThrottle() + 25);
        writeConfig();
        sendPushbulletPush(
          "Bot detected",
          `Increasing throttle to: ${getThrottle()}ms`
        );
        location.reload();
        resolve(false);
      } else if (
        seatCards.length === 0 ||
        (modalElem && !hasClass(modalElem, "is-closed"))
      ) {
        // ticket missed
        if (getThrottle() > 0) {
          if (getThrottle() <= 25) {
            setThrottle(0);
          } else {
            setThrottle(getThrottle() - 25);
          }
          writeConfig();
          sendPushbulletPush(
            "Missed",
            `Decreased throttle to: ${getThrottle()}ms`
          );
        } else {
          sendPushbulletPush("Missed", "Throttle is at minimum");
        }
        setThrottledTimeout(() => {
          document.querySelector("#modal-notification-close").click();
          document.querySelector("#throttleInput").value = getThrottle();
          //location.reload();
          sendTelemetry(false);
          debug("add to cart fail");
          resolve(false);
        }, 100);
      } else {
        resolve(true);
      }
    }, 2000);
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sendTelemetry(success) {
  if (!telemetry) return;

  fetch("https://67d43f70d2c7857431ed0089.mockapi.io/api/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timestamp: Date.now(),
      success: success,
    }),
  });
}

async function automateBookSeat() {
  const btn = document.querySelector(ADD_TO_CART_BTN);

  if (btn && config.state === "RUN") {
    if (config.selectStanding) {
      let areaSelected = await handleSelectArea();
      setThrottledInterval(async () => {
        sms.refreshAvailability(); // refresh seatmap availability
        areaSelected = await handleSelectArea();
        //handleIncreaseSeats(true);

        if (!areaSelected && config.selectStanding) {
          debug("no tickets found in south stand");
        } else {
          return;
        }
      }, 500);
    } else {
      document.querySelector(GET_SEATS_RECOMMENDATION).click();
      // TODO: not relevant for now
    }

    return;
  }
}

function automateShoppingCartClick() {
  const btn = document.querySelector(ADD_TO_CART_BTN);

  if (btn) {
    debug("Injecting auto add to shopping cart interval");
    checkAddToCartIntervalId = setThrottledInterval(() => {
      const seatCards = document.querySelectorAll(SEAT_CARDS);
      if (seatCards.length > 0) {
        btn.click();
        clearInterval(checkAddToCartIntervalId);
      }
    }, 200);
  }
}

// --------------------------------------------------------------------------------------------
// TOOLBAR
// --------------------------------------------------------------------------------------------

function injectToolbar() {
  info("Building and injecting toolbar...");

  const ui = GM_getResourceText("ui");
  const script = GM_getResourceText("script");
  document.body.insertAdjacentHTML("beforeend", ui);
  GM_addElement("script", { textContent: script });
  return;
  createToggleButton();
  if (config.state === "RUN") {
    createMobileStopButton();
  }

  document.body.appendChild(toolbar);
}

function createMobileStopButton() {
  const stopBtn = document.createElement("button");
  stopBtn.id = "fc-tools-stop";
  stopBtn.textContent = "Stop";
  stopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 10000;
    font-size: 20px;
    background-color: #ff0000;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 20px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;

  stopBtn.addEventListener("click", function () {
    config.state = "STOP";
    writeConfig();
    location.reload();
  });

  document.body.appendChild(stopBtn);
}

setThrottledTimeout(() => {
  //cloak();
  loadLocalStorage();

  if (document.body.innerHTML.includes("Access Denied")) {
    console.log("Access denied. Reloading in 3 seconds");
    sendPushbulletPush("Access denied");
    injectToolbar();
    if (config.state === "RUN") {
      setTimeout(() => location.reload(), 3000);
    }
  }

  if (!checkLoggedIn()) {
    warn("Not logged in. Aborting.");
    return;
  }

  injectToolbar();

  if (config.disabled) {
    info("Tools are deactivated");
    return;
  }

  if (document.getElementById("timer-info")) {
    sendPushbulletPush("Ticket found");
    return;
  }

  hideHomeText();
  automateShoppingCartClick();
  setThrottledTimeout(automateBookSeat, 300);
  //setThrottledTimeout(sendSeatRequests, 300);
  setThrottledTimeout(openSeatMap(), 200);
  setThrottledTimeout(clickGameCard, 500);
}, 300);

// --------------------------------------------------------------------------------------------
// UTILITY FUNCTIONS
// --------------------------------------------------------------------------------------------

function writeConfig() {
  localStorage.setItem("tools-config", JSON.stringify(config));
  loadLocalStorage();
}

function readConfig() {
  return JSON.parse(localStorage.getItem("tools-config"));
}

function sendPushbulletPush(title, msg = null) {
  GM.xmlHttpRequest({
    method: "POST",
    headers: {
      "Access-Token": config.pushbulletApiToken,
      "Content-Type": "application/json",
    },
    url: "https://api.pushbullet.com/v2/pushes",
    data: `{"body": "${msg ? msg : title}", "title":"${title}", "type":"note"}`,
    onload: function (response) {
      log(response.responseText);
    },
  });
}

function getThrottle() {
  return parseInt(config.throttle);
}

/**
 *
 * @param {Number} amount
 */
function setThrottle(amount) {
  document.getElementById("throttleInput").value = amount;
  document.getElementById("throttleInput").dispatchEvent(new Event("change"));
  writeConfig();
}

function hasClass(elem, className) {
  return Array.from(elem.classList).includes(className);
}

/**
 * @param {HTMLSelectElement} selectElem - the select element to return options from
 * @returns {Array<{text: string, value: string}>} an array of objects with the options' text and value fields
 */
function getOptionsAsArray(selectElem) {
  if (!selectElem || !selectElem.options) return [];

  return Array.from(selectElem.options).map((option) => ({
    value: option.value,
    text: option.text,
  }));
}

/**
 * Creates and sets a timeout that executes a callback function after a specified delay.
 * The delay is adjusted by adding the throttle delay from the configuration and an additional
 * random delay between 0-50ms.
 *
 * @param {Function} callback - The function to be executed after the delay.
 * @param {number} delayMs - The delay in milliseconds.
 * @returns {number} - The ID of the created timeout.
 */
function setThrottledTimeout(callback, delayMs) {
  const random = Math.floor(Math.random() * 50);
  return setTimeout(callback, random + delayMs + parseInt(config.throttle));
}

/**
 *
 * @param {Function} callback
 * @param {number} maxTimeout
 */
function setRandomThrottledTimeout(callback, min, max) {
  return setTimeout(
    callback,
    Math.floor(Math.random() * (max - min + 1) + min) +
      parseInt(config.throttle)
  );
}

/**
 * Creates and returns a new interval that executes the provided callback function at a specified interval.
 * The interval is adjusted by adding the throttle delay from the configuration.
 *
 * @param {Function} callback - The function to be executed at each interval.
 * @param {number} delayMs - The interval delay in milliseconds.
 * @returns {number} - The ID of the created interval.
 */
function setThrottledInterval(callback, delayMs) {
  return setInterval(callback, delayMs + parseInt(config.throttle));
}

function debug(msg) {
  log(msg, LOG_LEVEL.DEBUG);
}
function info(msg) {
  log(msg, LOG_LEVEL.INFO);
}
function error(msg) {
  log(msg, LOG_LEVEL.ERROR);
}
function warn(msg) {
  log(msg, LOG_LEVEL.WARN);
}

function log(msg, level = LOG_LEVEL.DEFAULT) {
  const prefix = `[TICKETSHOP UTILITIES ${new Date().toISOString()}] `;

  switch (level) {
    case LOG_LEVEL.ERROR:
      console.error(prefix, msg);
      break;
    case LOG_LEVEL.WARN:
      console.warn(prefix, msg);
      break;
    case LOG_LEVEL.INFO:
      console.info(prefix, msg);
      break;
    case LOG_LEVEL.DEBUG:
      console.debug(prefix, msg);
      break;
    default:
      console.log(prefix, msg);
      break;
  }
}