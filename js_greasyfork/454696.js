// ==UserScript==
// @name         YouTube Defaulter
// @namespace    https://greasyfork.org/ru/users/901750-gooseob
// @version      1.14.0
// @description  Set default speed, quality, subtitles and volume globally or per channel
// @author       GooseOb
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/454696/YouTube%20Defaulter.user.js
// @updateURL https://update.greasyfork.org/scripts/454696/YouTube%20Defaulter.meta.js
// ==/UserScript==

(function(){// src/config/update.ts
var update = (cfg) => {
  let isUpdated = true;
  switch (cfg._v) {
    case 4:
      if ("shortsToUsual" in cfg.flags) {
        cfg.flags.shortsToRegular = cfg.flags.shortsToUsual;
        delete cfg.flags.shortsToUsual;
      } else {
        isUpdated = false;
      }
      break;
    case 2:
      cfg.flags.standardMusicSpeed = false;
      cfg._v = 3;
    case 3:
      cfg.global.quality = cfg.global.qualityMax;
      delete cfg.global.qualityMax;
      for (const key in cfg.channels) {
        const currCfg = cfg.channels[key];
        currCfg.quality = currCfg.qualityMax;
        delete currCfg.qualityMax;
      }
      cfg._v = 4;
  }
  return isUpdated;
};
// src/config/value.ts
var cfgLocalStorage = localStorage.YTDefaulter;
var value = cfgLocalStorage ? JSON.parse(cfgLocalStorage) : {
  _v: 4,
  global: {},
  channels: {},
  flags: {
    shortsToRegular: false,
    newTab: false,
    copySubs: false,
    standardMusicSpeed: false,
    enhancedBitrate: false
  }
};

// src/config/save.ts
var saveLS = (newCfg) => {
  saveLSRaw(JSON.stringify(newCfg));
};
var saveLSRaw = (raw) => {
  localStorage.YTDefaulter = raw;
};
var save = (raw) => {
  const newCfg = JSON.parse(raw);
  if (typeof newCfg !== "object" || !newCfg._v) {
    throw new Error("Invalid data");
  }
  if (update(newCfg)) {
    saveLS(newCfg);
  } else {
    saveLSRaw(raw);
  }
  Object.assign(value, newCfg);
};
// src/config/prune.ts
var prune = () => {
  outer:
    for (const key in value.channels) {
      const channelCfg = value.channels[key];
      if (channelCfg.subtitles)
        continue;
      for (const cfgKey in channelCfg) {
        if (cfgKey !== "subtitles")
          continue outer;
      }
      delete value.channels[key];
    }
};
// src/utils/ref.ts
var ref = (val) => ({ val });

// src/config/current-channel.ts
var username = ref("");
var channel = () => value.channels[username.val] ||= {};
// src/listeners/click.ts
var onClick = (e) => {
  const { shortsToRegular, newTab } = value.flags;
  if (shortsToRegular || newTab) {
    let el = e.target;
    if (el.tagName !== "A") {
      el = el.closest("a");
    }
    if (el) {
      const isShorts = el.href.includes("/shorts/");
      if (shortsToRegular && isShorts) {
        el.href = el.href.replace("shorts/", "watch?v=");
      }
      const isNormal = el.href.includes("/watch?v=");
      if (newTab && (isShorts || isNormal)) {
        el.target = "_blank";
        e.stopPropagation();
      }
    }
  }
};
// src/icon-ds.ts
var SPEED2 = [
  "M10,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z            M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z            M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z            M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z            M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1 C18.2,21.5,22,17.2,22,12z",
  "M12 1c1.44 0 2.87.28 4.21.83a11 11 0 0 1 3.45 2.27l-1.81 1.05A9 9 0 0 0 3 12a9 9 0 0 0 18-.00l-.01-.44a8.99 8.99 0 0 0-.14-1.20l1.81-1.05A11.00 11.00 0 0 1 10.51 22.9 11 11 0 0 1 12 1Zm7.08 6.25-7.96 3.25a1.74 1.74 0 1 0 1.73 2.99l6.8-5.26a.57.57 0 0 0-.56-.98Z"
];
var QUALITY2 = [
  "M15,17h6v1h-6V17z M11,17H3v1h8v2h1v-2v-1v-2h-1V17z M14,8h1V6V5V3h-1v2H3v1h11V8z            M18,5v1h3V5H18z M6,14h1v-2v-1V9H6v2H3v1 h3V14z M10,12h11v-1H10V12z",
  "M9 3C8.11 2.99 7.25 3.29 6.54 3.83C5.84 4.38 5.34 5.14 5.12 6H3C2.73 6 2.48 6.10 2.29 6.29C2.10 6.48 2 6.73 2 7C2 7.26 2.10 7.51 2.29 7.70C2.48 7.89 2.73 8 3 8H5.12C5.34 8.85 5.84 9.61 6.55 10.16C7.25 10.70 8.11 10.99 9 10.99C9.88 10.99 10.74 10.70 11.44 10.16C12.15 9.61 12.65 8.85 12.87 8H21C21.26 8 21.51 7.89 21.70 7.70C21.89 7.51 22 7.26 22 7C22 6.73 21.89 6.48 21.70 6.29C21.51 6.10 21.26 6 21 6H12.87C12.65 5.14 12.15 4.38 11.45 3.83C10.74 3.29 9.88 2.99 9 3ZM9 5C9.53 5 10.03 5.21 10.41 5.58C10.78 5.96 11 6.46 11 7C11 7.53 10.78 8.03 10.41 8.41C10.03 8.78 9.53 9 9 9C8.46 9 7.96 8.78 7.58 8.41C7.21 8.03 7 7.53 7 7C7 6.46 7.21 5.96 7.58 5.58C7.96 5.21 8.46 5 9 5ZM15 13C14.11 12.99 13.25 13.29 12.54 13.83C11.84 14.38 11.34 15.14 11.12 16H3C2.73 16 2.48 16.10 2.29 16.29C2.10 16.48 2 16.73 2 17C2 17.26 2.10 17.51 2.29 17.70C2.48 17.89 2.73 18 3 18H11.12C11.34 18.85 11.84 19.61 12.55 20.16C13.25 20.70 14.11 20.99 15 20.99C15.88 20.99 16.74 20.70 17.44 20.16C18.15 19.61 18.65 18.85 18.87 18H21C21.26 18 21.51 17.89 21.70 17.70C21.89 17.51 22 17.26 22 17C22 16.73 21.89 16.48 21.70 16.29C21.51 16.10 21.26 16 21 16H18.87C18.65 15.14 18.15 14.38 17.45 13.83C16.74 13.29 15.88 12.99 15 13ZM15 15C15.53 15 16.03 15.21 16.41 15.58C16.78 15.96 17 16.46 17 17C17 17.53 16.78 18.03 16.41 18.41C16.03 18.78 15.53 19 15 19C14.46 19 13.96 18.78 13.58 18.41C13.21 18.03 13 17.53 13 17C13 16.46 13.21 15.96 13.58 15.58C13.96 15.21 14.46 15 15 15Z"
];

// src/utils/$.ts
var $ = (id) => document.getElementById(id);
// src/utils/debounce.ts
var debounce = (callback, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
// src/utils/is-descendant-or-the-same.ts
var isDescendantOrTheSame = (child, parents) => {
  while (child !== null) {
    if (parents.includes(child))
      return true;
    child = child.parentNode;
  }
  return false;
};
// src/utils/restore-focus-after.ts
var restoreFocusAfter = (cb) => {
  const el = document.activeElement;
  cb();
  el.focus();
};
// src/utils/until.ts
var until = (getItem, check, timeout = 1e4, interval = 20) => new Promise((res, rej) => {
  let item = getItem();
  if (check(item))
    return res(item);
  const limit = timeout / interval;
  let i = 0;
  const id = setInterval(() => {
    item = getItem();
    if (check(item)) {
      clearInterval(id);
      res(item);
    } else if (++i > limit) {
      clearInterval(id);
      rej(new Error(`Timeout: item ${getItem.name} wasn't found`));
    }
  }, interval);
});
var untilAppear = (getItem, msToWait) => until(getItem, Boolean, msToWait);
// src/utils/find-in-node-list.ts
var findInNodeList = (list, predicate) => {
  for (const item of list) {
    if (predicate(item))
      return item;
  }
  return null;
};
// src/utils/get-el-creator.ts
var getElCreator = (tag) => (props) => Object.assign(document.createElement(tag), props);
// src/utils/delay.ts
var delay = (ms) => new Promise((res) => setTimeout(res, ms));
// src/element-getters.ts
var plr = () => $("movie_player");
var aboveTheFold = () => $("above-the-fold");
var actionsBar = () => $("actions")?.querySelector("ytd-menu-renderer");
var getPlrGetter = (plr2) => (selector) => () => plr2.querySelector(selector);
var plrGetters = (plr2) => {
  const get = getPlrGetter(plr2);
  return {
    ad: get(".ytp-ad-player-overlay"),
    video: get(".html5-main-video"),
    subtitlesBtn: get(".ytp-subtitles-button"),
    muteBtn: get(".ytp-mute-button"),
    menu: {
      element: get(".ytp-settings-menu"),
      btn: get(".ytp-settings-button")
    }
  };
};
var MENU_ITEM_SELECTOR = '.ytp-menuitem[role="menuitem"]';
var plrMenuItemsGetter = (menu) => () => menu.querySelectorAll(MENU_ITEM_SELECTOR);
var menuSubItems = (item) => item.querySelectorAll(".ytp-menuitem-label");
var channelUsernameElementGetter = (aboveTheFold2) => () => aboveTheFold2.querySelector(".ytd-channel-name > a");
var genre = () => document.querySelector('meta[itemprop="genre"]');
var videoPlr = () => document.querySelector(".html5-video-player");
var videoPlrCaptions = (plr2) => plr2.querySelectorAll(".captions-text > span");
var popupContainer = () => document.querySelector("ytd-popup-container");
var getIconItemFinder = (ds) => (menu) => menu.querySelector(ds.map((d) => `${MENU_ITEM_SELECTOR}:has(path[d="${d}"])`).join(","));
var speedIconItem = getIconItemFinder(SPEED2);
var qualityIconItem = getIconItemFinder(QUALITY2);

// src/player/menu.ts
var set = (getEl) => {
  element ||= getEl.menu.element();
  btn ||= getEl.menu.btn();
};
var element = null;
var btn = null;
var clickBtn = () => {
  btn.click();
};
var isOpen = () => element.style.display !== "none";
var setOpen = (bool) => {
  if (bool !== isOpen())
    btn.click();
};
var openItem = (item) => {
  setOpen(true);
  item.click();
  return menuSubItems(element);
};
var settingItems = {
  speed: null,
  quality: null
};
var setSettingItems = (menu) => {
  settingItems.speed = speedIconItem(menu);
  settingItems.quality = qualityIconItem(menu);
};
var findInItem = (name) => untilAppear(() => settingItems[name]).then((item) => (predicate) => {
  const oldSubItems = new Set(menuSubItems(element));
  return findInNodeList(openItem(item), (subItem) => !oldSubItems.has(subItem) && predicate(subItem));
});

// src/player/plr.ts
var setPlr = async (el) => {
  const getEl = plrGetters(el);
  await delay(1000);
  await until(getEl.ad, (ad) => !ad, 200000);
  video ||= getEl.video();
  subtitlesBtn ||= getEl.subtitlesBtn();
  muteBtn ||= getEl.muteBtn();
  set(getEl);
  restoreFocusAfter(clickBtn);
  await delay(50);
  restoreFocusAfter(clickBtn);
  await until(plrMenuItemsGetter(element), (arr) => !!arr.length);
  setSettingItems(element);
  if (!speedNormal)
    findInItem("speed").then((findInSpeed) => {
      restoreFocusAfter(() => {
        speedNormal = findInSpeed((btn2) => !+btn2.textContent && !btn2.parentElement.querySelector(".ytp-speed-slider-menu-footer")).textContent;
      });
    });
};
var isSpeed = (value3) => video.playbackRate === value3;
var speedNormal = "";
var video = null;
var subtitlesBtn = null;
var muteBtn = null;
// src/logger.ts
var err = (...msgs) => {
  console.error("[YT-Defaulter]", ...msgs);
};
var outOfRange = (what) => {
  err(what, "value is out of range");
};

// src/player/value-setters.ts
var comparators = {
  quality: (target, current) => +target >= Number.parseInt(current) && (value.flags.enhancedBitrate || !current.toLowerCase().includes("premium")),
  speed: (target, current) => target === current
};
var setYT = (settingName) => async (value3) => {
  const isOpen2 = isOpen();
  const compare = comparators[settingName];
  const btn2 = (await findInItem(settingName))((btn3) => compare(value3, btn3.textContent));
  if (btn2) {
    btn2.click();
  }
  setOpen(isOpen2);
};
var valueSetters = {
  speed: (value3) => {
    setYT("speed")(isSpeed(+value3) ? speedNormal : value3);
  },
  customSpeed: (value3) => {
    try {
      video.playbackRate = isSpeed(+value3) ? 1 : +value3;
    } catch {
      outOfRange("Custom speed");
    }
  },
  subtitles: (value3) => {
    if (subtitlesBtn.ariaPressed !== value3.toString())
      subtitlesBtn.click();
  },
  volume: (value3) => {
    const num = +value3;
    const isMuted = muteBtn.dataset.titleNoTooltip !== "Mute";
    if (num === 0) {
      if (!isMuted)
        muteBtn.click();
    } else {
      if (isMuted)
        muteBtn.click();
      try {
        video.volume = num / 100;
      } catch {
        outOfRange("Volume");
      }
    }
  },
  quality: setYT("quality")
};
// src/player/apply-settings.ts
var applySettings = (settings) => {
  if (!Number.isNaN(+settings.customSpeed)) {
    valueSetters.customSpeed(settings.customSpeed);
  }
  delete settings.customSpeed;
  restoreFocusAfter(() => {
    for (const setting in settings) {
      valueSetters[setting](settings[setting]);
    }
    setOpen(false);
  });
};
// src/compute-settings.ts
var computeSettings = (doUseNormalSpeed) => {
  const channel2 = channel();
  const settings = {
    ...value.global,
    ...channel2
  };
  if (doUseNormalSpeed) {
    settings.speed = speedNormal;
    delete settings.customSpeed;
  } else if ("customSpeed" in channel2) {
    delete settings.speed;
  } else if ("speed" in channel2) {
    delete settings.customSpeed;
  } else if ("customSpeed" in settings) {
    delete settings.speed;
  }
  return settings;
};

// src/listeners/keyup.ts
var onKeyup = (e) => {
  if (e.code === "Enter") {
    onClick(e);
  } else if (e.ctrlKey && !e.shiftKey) {
    if (value.flags.copySubs && e.code === "KeyC") {
      const plr3 = videoPlr();
      if (plr3?.classList.contains("ytp-fullscreen")) {
        const text = Array.from(videoPlrCaptions(plr3), (line) => line.textContent).join(" ");
        navigator.clipboard.writeText(text);
      }
    } else if (e.code === "Space") {
      e.stopPropagation();
      e.preventDefault();
      const settings = computeSettings(false);
      if (settings.speed) {
        restoreFocusAfter(() => {
          valueSetters.speed(settings.speed);
        });
      } else if (settings.customSpeed) {
        valueSetters.customSpeed(settings.customSpeed);
      }
    }
  }
};
// src/text.ts
var translations = {
  "be-BY": {
    OPEN_SETTINGS: "Адкрыць дадатковыя налады",
    SUBTITLES: "Субтытры",
    SPEED: "Хуткасьць",
    CUSTOM_SPEED: "Свая Хуткасьць",
    CUSTOM_SPEED_HINT: 'Калі вызначана, будзе выкарыстоўвацца замест "Хуткасьць"',
    QUALITY: "Якасьць",
    VOLUME: "Гучнасьць, %",
    GLOBAL: "Глябальна",
    LOCAL: "Гэты Канал",
    SHORTS: "Адкрываць shorts як звычайныя",
    NEW_TAB: "Адкрываць відэа ў новай картцы",
    COPY_SUBS: "Капіяваць субтытры ў поўнаэкранным, Ctrl+C",
    STANDARD_MUSIC_SPEED: "Звычайная хуткасьць на музычных відэа",
    ENHANCED_BITRATE: "Палепшаны бітрэйт (для карыстальнікаў Premium)",
    SAVE: "Захаваць",
    EXPORT: "Экспарт",
    IMPORT: "Імпарт"
  }
};
var text = {
  OPEN_SETTINGS: "Open additional settings",
  SUBTITLES: "Subtitles",
  SPEED: "Speed",
  CUSTOM_SPEED: "Custom Speed",
  CUSTOM_SPEED_HINT: 'If defined, will be used instead of "Speed"',
  QUALITY: "Quality",
  VOLUME: "Volume, %",
  GLOBAL: "Global",
  LOCAL: "This Channel",
  SHORTS: "Open shorts as regular videos",
  NEW_TAB: "Open videos in new tab",
  COPY_SUBS: "Copy subtitles by Ctrl+C in fullscreen mode",
  STANDARD_MUSIC_SPEED: "Normal speed on music videos",
  ENHANCED_BITRATE: "Quality: Enhanced bitrate (for Premium users)",
  SAVE: "Save",
  DEFAULT: "-",
  EXPORT: "Export",
  IMPORT: "Import"
};

// src/menu/controls.ts
var updateValuesIn = (controls, cfgPart) => {
  controls.speed.value = cfgPart.speed || text.DEFAULT;
  controls.customSpeed.value = cfgPart.customSpeed || "";
  controls.quality.value = cfgPart.quality || text.DEFAULT;
  controls.volume.value = cfgPart.volume || "";
  controls.subtitles.checked = cfgPart.subtitles || false;
};
var channelControls = () => ({
  speed: null,
  customSpeed: null,
  quality: null,
  volume: null,
  subtitles: null
});
var sections = {
  global: channelControls(),
  thisChannel: channelControls()
};
var flags = {
  shortsToRegular: {
    elem: null,
    id: "shorts",
    text: text.SHORTS
  },
  newTab: {
    elem: null,
    id: "new-tab",
    text: text.NEW_TAB
  },
  copySubs: {
    elem: null,
    id: "copy-subs",
    text: text.COPY_SUBS
  },
  standardMusicSpeed: {
    elem: null,
    id: "standard-music-speed",
    text: text.STANDARD_MUSIC_SPEED
  },
  enhancedBitrate: {
    elem: null,
    id: "enhanced-bitrate",
    text: text.ENHANCED_BITRATE
  }
};
var updateThisChannel = () => {
  updateValuesIn(sections.thisChannel, channel());
};
var updateValues = (cfg) => {
  updateValuesIn(sections.global, cfg.global);
  updateThisChannel();
  for (const key in cfg.flags) {
    const flag = flags[key];
    if (flag) {
      flag.elem.checked = cfg.flags[key];
    } else {
      err("Unknown flag:", key);
    }
  }
};
// src/utils/with.ts
var withHint = (hint, getItem) => [getItem(hint).item, hint.element];
var withOnClick = (elem, listener) => {
  elem.addEventListener("click", listener);
  return elem;
};
var withListeners = (elem, listeners) => {
  for (const key in listeners) {
    elem.addEventListener(key, listeners[key]);
  }
  return elem;
};
var controlWith = (withFn) => (obj, ...args) => {
  withFn(obj.elem, ...args);
  return obj;
};
var withControlListeners = controlWith(withListeners);

// src/utils/element-creators.ts
var div = getElCreator("div");
var input = getElCreator("input");
var checkbox = (props) => input({ type: "checkbox", ...props });
var option = getElCreator("option");
var _label = getElCreator("label");
var labelEl = (forId, props) => {
  const elem = _label(props);
  elem.setAttribute("for", forId);
  return elem;
};
var selectEl = getElCreator("select");
var btnClass = "yt-spec-button-shape-next";
var btnClassFocused = btnClass + "--focused";
var _button = getElCreator("button");
var button = (textContent, props) => withListeners(_button({
  textContent,
  className: `${btnClass} ${btnClass}--tonal ${btnClass}--mono ${btnClass}--size-m`,
  ...props
}), {
  focus() {
    this.classList.add(btnClassFocused);
  },
  blur() {
    this.classList.remove(btnClassFocused);
  }
});

// src/hint.ts
class Hint {
  constructor(prefix) {
    this.element = div();
    this.element.className ||= "YTDef-setting-hint";
    this.prefix = prefix;
    this.hide();
  }
  hide() {
    this.element.style.display = "none";
  }
  show(msg) {
    this.element.style.display = "block";
    this.element.textContent = this.prefix + msg;
  }
  prefix;
  element;
}

// src/menu/get-controls-creators.ts
var getControlCreators = (getCreator) => ({
  numericInput: getCreator((props) => input({ type: "number", ...props }), (elem) => ({
    get: () => elem.value,
    set: (value3) => {
      elem.value = value3;
    },
    default: ""
  })),
  checkbox: getCreator(checkbox, (elem) => ({
    get: () => elem.checked.toString(),
    set: (value3) => {
      elem.checked = value3 === "true";
    },
    default: text.DEFAULT
  })),
  select: getCreator(({
    values,
    getText
  }) => {
    const elem = selectEl({ value: text.DEFAULT });
    elem.append(option({
      value: text.DEFAULT,
      textContent: text.DEFAULT
    }), ...values.map((value3) => option({
      value: value3,
      textContent: getText(value3)
    })));
    return elem;
  }, (elem) => ({
    get: () => elem.value,
    set: (value3) => {
      elem.value = value3;
    },
    default: "false"
  }))
});

// src/menu/validate-volume.ts
var validateVolume = (value3) => {
  const num = +value3;
  return num < 0 || num > 100 ? "out of range" : Number.isNaN(num) ? "not a number" : null;
};

// src/menu/close.ts
var close = () => {
  element2.style.visibility = "hidden";
  stopListening();
};
var listenForClose = () => {
  document.addEventListener("click", onClick2);
  document.addEventListener("keyup", onKeyUp);
};
var stopListening = () => {
  document.removeEventListener("click", onClick2);
  document.removeEventListener("keyup", onKeyUp);
};
var onClick2 = (e) => {
  const el = e.target;
  if (!isDescendantOrTheSame(el, [element2, btn2]))
    close();
};
var onKeyUp = (e) => {
  if (e.code === "Escape") {
    close();
    btn2.focus();
  }
};

// src/menu/value.ts
var set2 = (el, btnEl) => {
  element2 = el;
  btn2 = btnEl;
};
var element2 = null;
var btn2 = null;
var isOpen2 = false;
var menuWidth = 0;
var adjustWidth = () => {
  menuWidth = element2.getBoundingClientRect().width;
};
var firstFocusable = ref(null);
var toggle = debounce(() => {
  isOpen2 = !isOpen2;
  if (isOpen2) {
    fixPosition();
    element2.style.visibility = "visible";
    listenForClose();
    firstFocusable.val.focus();
  } else {
    close();
  }
}, 100);
var fixPosition = () => {
  const { y, height, width, left } = btn2.getBoundingClientRect();
  element2.style.top = y + height + 8 + "px";
  element2.style.left = left + width - menuWidth + "px";
};

// src/menu/section.ts
var section = (sectionId, title, sectionCfg) => {
  const control = getControlCreators((createElement, initVal) => (name, label, props) => {
    const item = div();
    const id = "YTDef-" + name + "-" + sectionId;
    const elem = Object.assign(createElement(props), props, {
      id,
      name
    });
    elem.addEventListener("change", () => {
      const value3 = val.get();
      if (value3 === val.default) {
        delete sectionCfg[name];
      } else {
        sectionCfg[name] = value3;
      }
    });
    const val = initVal(elem);
    const cfgValue = sectionCfg[name];
    if (cfgValue) {
      setTimeout(() => {
        val.set(cfgValue.toString());
      });
    }
    item.append(labelEl(id, { textContent: label }), elem);
    sections[sectionId][name] = elem;
    return { item, elem };
  });
  const speedSelect = control.select("speed", text.SPEED, {
    values: ["2", "1.75", "1.5", "1.25", speedNormal, "0.75", "0.5", "0.25"],
    getText: (val) => val
  });
  if (sectionId === "global")
    firstFocusable.val = speedSelect.elem;
  const sectionElement = div({ role: "group" });
  sectionElement.setAttribute("aria-labelledby", sectionId);
  sectionElement.append(getElCreator("span")({ textContent: title, id: sectionId }), speedSelect.item, ...withHint(new Hint(""), (hint) => withControlListeners(control.numericInput("customSpeed", text.CUSTOM_SPEED), {
    blur: () => {
      hint.hide();
    },
    focus: () => {
      hint.show(text.CUSTOM_SPEED_HINT);
    }
  })), control.select("quality", text.QUALITY, {
    values: [
      "144",
      "240",
      "360",
      "480",
      "720",
      "1080",
      "1440",
      "2160",
      "4320"
    ],
    getText: (val) => val + "p"
  }).item, ...withHint(new Hint("Warning: "), (hint) => withControlListeners(control.numericInput("volume", text.VOLUME, {
    min: "0",
    max: "100"
  }), {
    blur() {
      const warning = validateVolume(this.value);
      if (warning) {
        hint.show(warning);
      } else {
        hint.hide();
      }
    }
  })), control.checkbox("subtitles", text.SUBTITLES, checkbox()).item);
  return sectionElement;
};

// src/menu/settings-icon.ts
var settingsIcon = () => {
  const element3 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  for (const [prop, value3] of [
    ["viewBox", "0 0 24 24"],
    ["width", "24"],
    ["height", "24"],
    ["fill", "var(--yt-spec-text-primary)"]
  ]) {
    element3.setAttribute(prop, value3);
  }
  element3.append($("settings"));
  return element3;
};

// src/menu/init.ts
var init = () => {
  const sections2 = div({ className: "YTDef-" + "sections" });
  sections2.append(section("global", text.GLOBAL, value.global), section("thisChannel", text.LOCAL, channel()));
  const controlStatus = div();
  const updateControlStatus = (content) => {
    controlStatus.textContent = `[${new Date().toLocaleTimeString()}] ${content}`;
  };
  const controlDiv = div({ className: "control-cont" });
  controlDiv.append(withOnClick(button(text.SAVE), () => {
    prune();
    saveLS(value);
    updateControlStatus(text.SAVE);
  }), withOnClick(button(text.EXPORT), () => {
    navigator.clipboard.writeText(localStorage.YTDefaulter).then(() => {
      updateControlStatus(text.EXPORT);
    });
  }), withOnClick(button(text.IMPORT), () => {
    navigator.clipboard.readText().then((raw) => {
      save(raw);
      updateValues(value);
      return text.IMPORT;
    }).catch((e) => text.IMPORT + ": " + e.message).then(updateControlStatus);
  }));
  set2(div({
    id: "YTDef-menu"
  }), withOnClick(button("", {
    id: "YTDef-btn",
    ariaLabel: text.OPEN_SETTINGS,
    tabIndex: 0
  }), toggle));
  btn2.setAttribute("aria-controls", "YTDef-menu");
  btn2.classList.add(btnClass + "--icon-button");
  btn2.append(settingsIcon());
  element2.append(sections2, ...Object.entries(flags).map(([flagName, flag]) => {
    const cont = div({ className: "check-cont" });
    const id = "YTDef-" + flag.id;
    const elem = withOnClick(checkbox({
      id,
      checked: value.flags[flagName]
    }), function() {
      value.flags[flagName] = this.checked;
    });
    flag.elem = elem;
    cont.append(labelEl(id, { textContent: flag.text }), elem);
    return cont;
  }), controlDiv, controlStatus);
  element2.addEventListener("keyup", (e) => {
    const el = e.target;
    if (e.code === "Enter" && el.type === "checkbox")
      el.checked = !el.checked;
  });
  untilAppear(actionsBar).then((actionsBar2) => {
    actionsBar2.insertBefore(btn2, actionsBar2.lastChild);
    popupContainer().append(element2);
    adjustWidth();
    sections2.style.maxWidth = sections2.offsetWidth + "px";
  });
  const listener = () => {
    if (isOpen2)
      fixPosition();
  };
  window.addEventListener("scroll", listener);
  window.addEventListener("resize", listener);
};
// src/listeners/video-page.ts
var onVideoPage = () => {
  const usernameSettingPromise = untilAppear(aboveTheFold).then(channelUsernameElementGetter).then(untilAppear).then(({ href }) => {
    username.val = href || "";
  });
  untilAppear(plr).then(setPlr).then(() => usernameSettingPromise).then(() => {
    const doNotChangeSpeed = value.flags.standardMusicSpeed && genre()?.content === "Music";
    applySettings(computeSettings(doNotChangeSpeed));
    if (!element2) {
      init();
    }
  });
  if (element2) {
    updateThisChannel();
  }
};
// src/style.ts
var m = "#" + "YTDef-menu";
var d = " div";
var i = " input";
var s = " select";
var bg = "var(--yt-spec-menu-background)";
var underline = "border-bottom: 2px solid var(--yt-spec-text-primary);";
var style = getElCreator("style")({
  textContent: `
#${"YTDef-btn"} {position: relative; margin-left: 8px}
${m} {
display: flex;
visibility: hidden;
color: var(--yt-spec-text-primary);
font-size: 14px;
flex-direction: column;
position: fixed;
background: ${bg};
border-radius: 2rem;
padding: 1rem;
text-align: center;
box-shadow: 0px 4px 32px 0px var(--yt-spec-static-overlay-background-light);
z-index: 2202
}
.control-cont > button {margin: .2rem}
${m + d} {display: flex; margin-bottom: 1rem}
${m + d + d} {
flex-direction: column;
margin: 0 2rem
}
${m + d + d + d} {
flex-direction: row;
margin: 1rem 0
}
${m + s}, ${m + i} {
text-align: center;
background: ${bg};
border: none;
${underline}
color: inherit;
width: 5rem;
padding: 0;
margin-left: auto
}
${m} .${"YTDef-setting-hint"} {margin: 0; text-align: end}
${m + i} {outline: none}
${m + d + d + d}:focus-within > label, ${m} .check-cont:focus-within > label {${underline}}
${m} .check-cont {padding: 0 1rem}
${m + s} {appearance: none; outline: none}
${m} label {margin-right: 1.5rem; white-space: nowrap}
${m + i}::-webkit-outer-spin-button,
${m + i}::-webkit-inner-spin-button {-webkit-appearance: none; margin: 0}
${m + i}[type=number] {-moz-appearance: textfield}
${m + s}::-ms-expand {display: none}`
});

// src/index.ts
Object.assign(text, translations[document.documentElement.lang]);
if (update(value)) {
  saveLS(value);
}
window.addEventListener("yt-navigate-finish", ({ detail: { pageType } }) => {
  if (pageType === "watch" || pageType === "live") {
    setTimeout(onVideoPage, 1000);
  }
});
document.addEventListener("click", onClick, { capture: true });
document.addEventListener("keyup", onKeyup, { capture: true });
document.head.append(style);
})()