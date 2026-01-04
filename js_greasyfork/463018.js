// ==UserScript==
// @name        🐭️ MouseHunt - Location Catches
// @description View your mouse catches in your current location
// @version     2.1.0
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mh-improved/icon-64.png
// @run-at      document-end
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/script-migration@1.1.1
// @downloadURL https://update.greasyfork.org/scripts/463018/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Location%20Catches.user.js
// @updateURL https://update.greasyfork.org/scripts/463018/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Location%20Catches.meta.js
// ==/UserScript==

var mhui = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/modules/location-catch-stats/index.js
  var location_catch_stats_exports = {};
  __export(location_catch_stats_exports, {
    default: () => location_catch_stats_default
  });

  // src/utils/event-registry.js
  var eventsAdded = {};
  var onEvent = (event, callback, remove = false) => {
    if (!eventRegistry) {
      return;
    }
    const id = `${event}-${remove.toString()}-${callback.toString()}`;
    if (eventsAdded[id]) {
      return;
    }
    eventsAdded[id] = true;
    eventRegistry.addEventListener(event, callback, null, remove);
  };

  // src/utils/styles.js
  var addModuleStyles = (styles, identifier = "mh-improved-styles", replace = false) => {
    const existingStyles = document.querySelector(`#${identifier}`);
    styles = Array.isArray(styles) ? styles.join("\n") : styles;
    if (existingStyles) {
      if (replace) {
        existingStyles.innerHTML = styles;
      } else {
        existingStyles.innerHTML += styles;
      }
      return existingStyles;
    }
    const style = document.createElement("style");
    style.id = identifier;
    style.innerHTML = styles;
    document.head.append(style);
    return style;
  };
  var addStyles = (styles, module = false, identifier = "mh-improved-styles") => {
    if (!module) {
      throw new Error("Module ID is required for adding module styles.", module);
    }
    const key = `${identifier}-${module}`;
    let stylesEl = addModuleStyles(styles, key, true);
    onEvent(`mh-improved-settings-changed-${module}`, (enabled) => {
      if (enabled) {
        stylesEl = addModuleStyles(styles, key, true);
      } else if (stylesEl) {
        stylesEl.remove();
      }
    });
  };

  // src/utils/settings.js
  var getSettingDirect = (key = null, defaultValue = null, identifier = "mousehunt-improved-settings") => {
    const settings = JSON.parse(localStorage.getItem(identifier)) || {};
    if (!key) {
      return settings;
    }
    if (!key.includes(".")) {
      if (settings[key] === void 0) {
        return defaultValue;
      }
      return settings[key];
    }
    const groupAndKey = getGroupAndKey(key);
    if (!groupAndKey.group) {
      if (settings[groupAndKey.key] === void 0) {
        return defaultValue;
      }
      return settings[groupAndKey.key];
    }
    const groupSettings = settings[groupAndKey.group] || {};
    if (groupSettings[groupAndKey.key] === void 0) {
      return defaultValue;
    }
    return groupSettings[groupAndKey.key];
  };
  var getGroupAndKey = (key) => {
    const split = key.split(".");
    if (split.length === 1) {
      return {
        group: null,
        key: split[0]
      };
    }
    if (split[0] === "location-huds-enabled") {
      return {
        group: "location-huds-enabled",
        key: split[1]
      };
    }
    return {
      group: `${split[0]}-settings`,
      key: split[1]
    };
  };
  var getSetting = (key, defaultValue = false) => {
    return getSettingDirect(key, defaultValue, "mousehunt-improved-settings");
  };

  // src/utils/global.js
  var getGlobal = (key) => {
    if (window && window.mhui) {
      return window.mhui[key] || false;
    }
    if ("undefined" !== typeof app && app && app.mhui) {
      return app.mhui[key] || false;
    }
    return false;
  };

  // src/utils/debug.js
  var debuglog = (module, message, ...args) => {
    if (getSetting("debug.all", false) || getSetting(`debug.${module}`, false) || getGlobal("mh-improved-updating")) {
      console.log(
        `%cMH Improved %c${module}%c ${message}`,
        "color: #90588c; font-weight: 900",
        "color: #90588c; font-weight: 400",
        "color: inherit; font-weight: inherit",
        ...args
      );
    }
  };

  // src/utils/draggable.js
  var makeElementDraggable = (dragTarget, dragHandle, defaultX = null, defaultY = null, storageKey = null, savePosition = true) => {
    const modal = document.querySelector(dragTarget);
    if (!modal) {
      return;
    }
    const handle = document.querySelector(dragHandle);
    if (!handle) {
      return;
    }
    const keepWithinLimits = (type, value) => {
      if ("top" === type) {
        return value < -20 ? -20 : value;
      }
      if (value < handle.offsetWidth * -1 + 20) {
        return handle.offsetWidth * -1 + 20;
      }
      if (value > document.body.clientWidth - 20) {
        return document.body.clientWidth - 20;
      }
      return value;
    };
    const onMouseDown = (e) => {
      e.preventDefault();
      setTimeout(() => {
        x1 = e.clientX;
        y1 = e.clientY;
        modal.classList.add("mh-is-dragging");
        document.onmousemove = onDrag;
        document.onmouseup = finishDrag;
      }, 50);
    };
    const finishDrag = () => {
      document.onmouseup = null;
      document.onmousemove = null;
      modal.classList.remove("mh-is-dragging");
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify({ x: modal.offsetLeft, y: modal.offsetTop }));
      }
    };
    const onDrag = (e) => {
      e.preventDefault();
      x2 = x1 - e.clientX;
      y2 = y1 - e.clientY;
      x1 = e.clientX;
      y1 = e.clientY;
      const newLeft = keepWithinLimits("left", modal.offsetLeft - x2);
      const newTop = keepWithinLimits("top", modal.offsetTop - y2);
      modal.style.left = `${newLeft}px`;
      modal.style.top = `${newTop}px`;
    };
    let startX = defaultX || 0;
    let startY = defaultY || 0;
    if (!storageKey) {
      storageKey = `mh-draggable-${dragTarget}-${dragHandle}`;
    }
    if (savePosition) {
      const storedPosition = localStorage.getItem(storageKey);
      if (storedPosition) {
        const position = JSON.parse(storedPosition);
        startX = keepWithinLimits("left", position.x);
        startY = keepWithinLimits("top", position.y);
      }
    }
    modal.style.left = `${startX}px`;
    modal.style.top = `${startY}px`;
    let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    handle.onmousedown = onMouseDown;
  };

  // src/utils/page.js
  var getCurrentPage = () => {
    var _a, _b, _c, _d;
    if (!((_b = (_a = hg == null ? void 0 : hg.utils) == null ? void 0 : _a.PageUtil) == null ? void 0 : _b.getCurrentPage)) {
      return null;
    }
    const page = hg.utils.PageUtil.getCurrentPage();
    if (!page) {
      const query = ((_d = (_c = hg == null ? void 0 : hg.utils) == null ? void 0 : _c.PageUtil) == null ? void 0 : _d.getQueryParams()) || {};
      if ((query == null ? void 0 : query.switch_to) && "mobile" === query.switch_to) {
        return "camp";
      }
      return null;
    }
    return page.toLowerCase();
  };

  // src/utils/links.js
  var getCleanSubmenuLabel = (label) => {
    return label.toLowerCase().replaceAll(/[^\da-z]/g, "-");
  };
  var addSubmenuItem = (options) => {
    const settings = Object.assign({}, {
      id: null,
      menu: "kingdom",
      label: "",
      icon: "https://www.mousehuntgame.com/images/ui/hud/menu/special.png",
      href: "",
      class: "",
      callback: null,
      external: false
    }, options);
    const menuTarget = document.querySelector(`.mousehuntHud-menu .${settings.menu}`);
    if (!menuTarget) {
      return;
    }
    if (!menuTarget.classList.contains("hasChildren")) {
      menuTarget.classList.add("hasChildren");
    }
    let hasSubmenu = true;
    let submenu = menuTarget.querySelector("ul");
    if (!submenu) {
      hasSubmenu = false;
      submenu = document.createElement("ul");
    }
    const item = document.createElement("li");
    item.classList.add("custom-submenu-item");
    const label = settings.label.length > 0 ? settings.label : settings.id;
    const cleanLabel = getCleanSubmenuLabel(label);
    const exists = document.querySelector(`#custom-submenu-item-${cleanLabel}`);
    if (exists) {
      exists.remove();
    }
    item.id = settings.id ? `custom-submenu-item-${settings.id}` : `custom-submenu-item-${cleanLabel}`;
    if (settings.class) {
      const classes = settings.class.split(" ");
      item.classList.add(...classes);
    }
    const link = document.createElement("a");
    link.href = settings.href || "#";
    if (settings.callback) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        settings.callback();
      });
    }
    const icon = document.createElement("div");
    icon.classList.add("icon");
    icon.style = `background-image: url(${settings.icon});`;
    const name = document.createElement("div");
    name.classList.add("name");
    name.innerHTML = settings.label;
    link.append(icon);
    link.append(name);
    if (settings.external) {
      const externalLinkIcon = document.createElement("div");
      externalLinkIcon.classList.add("external_icon");
      link.append(externalLinkIcon);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    item.append(link);
    submenu.append(item);
    if (!hasSubmenu) {
      menuTarget.append(submenu);
    }
  };

  // src/utils/messages.js
  hadAddedErrorStyles = false;

  // src/utils/utils.js
  var isLoggedIn = () => {
    return user && user.user_id && "login" !== getCurrentPage();
  };
  var requests = {};
  var doRequest = (_0, ..._1) => __async(void 0, [_0, ..._1], function* (url, formData = {}, skipChecks = false) {
    var _a;
    if (!isLoggedIn()) {
      return;
    }
    if ("undefined" === typeof lastReadJournalEntryId || "undefined" === typeof user) {
      return;
    }
    if (!lastReadJournalEntryId || !user || !(user == null ? void 0 : user.unique_hash)) {
      return;
    }
    const requestKey = Object.keys(formData).length ? `${url}-${JSON.stringify(formData)}` : url;
    const timeRequested = Date.now();
    debuglog("utils-data", `Making request: ${requestKey} at ${timeRequested}`);
    if (requests[requestKey] && !skipChecks) {
      debuglog("utils-data", `Request already in progress: ${requestKey}`);
      if (requests[requestKey].in_progress) {
        return new Promise((resolve) => {
          const timeout = setTimeout(() => __async(void 0, null, function* () {
            debuglog("utils-data", `Request timed out: ${requestKey}, starting new request`);
            clearInterval(interval);
            const newRequest = yield doRequest(url, formData, true);
            resolve(newRequest);
          }), 2500);
          const interval = setInterval(() => {
            debuglog("utils-data", `Checking if request is complete: ${requestKey}`);
            if (!requests[requestKey].in_progress) {
              debuglog("utils-data", `Returning saved response: ${requestKey}`);
              clearInterval(interval);
              clearTimeout(timeout);
              resolve(requests[requestKey].response);
            }
          }, 100);
        });
      } else if (requests[requestKey].time_requested > timeRequested - 350) {
        debuglog("utils-data", `Request already completed: ${requestKey}`);
        return requests[requestKey].response;
      }
    }
    debuglog("utils-data", `Starting request: ${requestKey}`);
    requests[requestKey] = {
      in_progress: true,
      time_requested: timeRequested
    };
    const form = new FormData();
    form.append("sn", "Hitgrab");
    form.append("hg_is_ajax", 1);
    form.append("last_read_journal_entry_id", lastReadJournalEntryId != null ? lastReadJournalEntryId : 0);
    form.append("uh", (_a = user == null ? void 0 : user.unique_hash) != null ? _a : "");
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    const requestBody = new URLSearchParams(form).toString();
    let response;
    let attempts = 0;
    while (!response && attempts < 3) {
      try {
        response = yield fetch(
          callbackurl ? callbackurl + url : "https://www.mousehuntgame.com/" + url,
          {
            method: "POST",
            body: requestBody,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } catch (error) {
        attempts++;
        console.error(`Attempt ${attempts} failed. Retrying...`, error);
      }
    }
    if (attempts >= 3) {
      console.error("Failed to fetch after maximum attempts");
    }
    let data;
    try {
      data = yield response.json();
    } catch (error) {
      console.error(`Error parsing response for ${url}:`, error, url, formData, response);
      return false;
    }
    requests[requestKey] = {
      time_requested: timeRequested,
      response: data
    };
    return data;
  });

  // src/modules/location-catch-stats/styles.css
  var styles_default = "#mh-catch-stats{position:absolute;top:25px;left:25px;z-index:50}@media screen and (prefers-reduced-motion: reduce){.mh-catch-stats-wrapper{transition:none}}.mh-catch-stats-wrapper{width:275px;background:#f6f3eb;border:1px solid #534022;box-shadow:1px 1px 1px #9d917f,1px 3px 5px #6a6969;transition:box-shadow .25s}.mh-is-dragging .mh-catch-stats-wrapper{box-shadow:1px 1px 1px #9d917f,0 7px 9px 2px #6a6969}.mh-catch-stats-header{display:flex;align-items:center;justify-content:space-between;padding:10px;color:#f6f3eb;cursor:grab;background-color:#926944;border-bottom:1px solid #ceb7a6}.mh-catch-stats-header h1{color:#f6f3eb}.mh-catch-stats-close{cursor:pointer}.mh-catch-stats-close:hover,.mh-catch-stats-close:focus{color:#926944;background-color:#eee;border-radius:50%;outline:1px solid #ccc}.mh-catch-stats-body{max-height:90vh;overflow:hidden auto}.mh-catch-stats-wrapper .mh-catch-stats:nth-child(odd){background-color:#e8e3d7}.mh-catch-stats{display:flex;align-items:center;justify-content:space-between;padding:10px;color:#000}.mh-catch-stats:hover,.mh-catch-stats-wrapper .mh-catch-stats:nth-child(odd):hover,.mh-catch-stats:focus,.mh-catch-stats-wrapper .mh-catch-stats:nth-child(odd):focus{color:#665f5f;text-decoration:none;background-color:#eee;outline:1px solid #ccc}.mh-catch-stats-image{position:relative;display:inline-block;width:40px;height:40px;vertical-align:middle;background-repeat:no-repeat;background-size:contain;border-radius:2px;box-shadow:1px 1px 1px #999}.mh-catch-stats-crown{position:absolute;right:-5px;bottom:-5px;width:20px;height:20px;background-color:#fff;background-repeat:no-repeat;background-position:50% 50%;background-size:80%;border:1px solid #333;border-radius:50%}.mh-catch-stats-name{display:inline-block;padding-left:10px;vertical-align:middle}.mh-catch-stats-catches{padding-right:5px}\n";

  // src/modules/location-catch-stats/index.js
  var getMouseStats = () => __async(void 0, null, function* () {
    var _a, _b;
    const data = yield doRequest("managers/ajax/mice/mouse_list.php", {
      action: "get_environment",
      category: user.environment_type,
      user_id: user.user_id,
      display_mode: "stats",
      view: "ViewMouseListEnvironments"
    });
    const mouseData = (_b = (_a = data == null ? void 0 : data.mouse_list_category) == null ? void 0 : _a.subgroups[0]) == null ? void 0 : _b.mice;
    mouseData.sort((a, b) => {
      return b.num_catches - a.num_catches;
    });
    return mouseData != null ? mouseData : [];
  });
  var buildMouseMarkup = (mouseData) => {
    const mouse = Object.assign({}, {
      name: "",
      type: "",
      image: "",
      crown: "none",
      num_catches: 0
    }, mouseData);
    const mouseEl = document.createElement("a");
    mouseEl.classList.add("mh-catch-stats");
    mouseEl.title = mouse.name;
    mouseEl.addEventListener("click", () => {
      var _a, _b;
      if ("undefined" !== ((_b = (_a = hg == null ? void 0 : hg.views) == null ? void 0 : _a.MouseView) == null ? void 0 : _b.show)) {
        hg.views.MouseView.show(mouse.type);
      }
    });
    const image = document.createElement("div");
    image.classList.add("mh-catch-stats-image");
    image.style.backgroundImage = `url('${mouse.image}')`;
    if (mouse.crown && "none" !== mouse.crown) {
      const crown = document.createElement("div");
      crown.classList.add("mh-catch-stats-crown");
      crown.style.backgroundImage = `url('https://www.mousehuntgame.com/images/ui/crowns/crown_${mouse.crown}.png')`;
      image.append(crown);
    }
    const name = document.createElement("div");
    name.classList.add("mh-catch-stats-name");
    name.innerText = mouse.name;
    const imageNameContainer = document.createElement("div");
    imageNameContainer.append(image);
    imageNameContainer.append(name);
    const catches = document.createElement("div");
    catches.classList.add("mh-catch-stats-catches");
    catches.innerText = mouse.num_catches;
    mouseEl.append(imageNameContainer);
    mouseEl.append(catches);
    return mouseEl;
  };
  var showModal = () => __async(void 0, null, function* () {
    const existing = document.querySelector("#mh-catch-stats");
    if (existing) {
      existing.remove();
    }
    const modalWrapper = document.createElement("div");
    modalWrapper.id = "mh-catch-stats";
    const modal = document.createElement("div");
    modal.classList.add("mh-catch-stats-wrapper");
    const header = document.createElement("div");
    header.classList.add("mh-catch-stats-header");
    const title = document.createElement("h1");
    title.innerText = "Location Catch Stats";
    header.append(title);
    const closeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    closeIcon.classList.add("mh-catch-stats-close");
    closeIcon.setAttribute("viewBox", "0 0 24 24");
    closeIcon.setAttribute("width", "18");
    closeIcon.setAttribute("height", "18");
    closeIcon.setAttribute("fill", "none");
    closeIcon.setAttribute("stroke", "currentColor");
    closeIcon.setAttribute("stroke-width", "1.5");
    const closePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    closePath.setAttribute("d", "M18 6L6 18M6 6l12 12");
    closeIcon.append(closePath);
    closeIcon.addEventListener("click", () => {
      modalWrapper.remove();
    });
    header.append(closeIcon);
    modal.append(header);
    const mouseBody = document.createElement("div");
    mouseBody.classList.add("mh-catch-stats-body");
    const mouseStats = yield getMouseStats();
    mouseStats.forEach((mouseData) => {
      mouseBody.append(buildMouseMarkup(mouseData, mouseBody));
    });
    modal.append(mouseBody);
    modalWrapper.append(modal);
    document.body.append(modalWrapper);
    makeElementDraggable("#mh-catch-stats", ".mh-catch-stats-header", 25, 25, "mh-catch-stats-position");
  });
  var init = () => __async(void 0, null, function* () {
    addStyles(styles_default, "location-catch-stats");
    addSubmenuItem({
      menu: "mice",
      label: "Location Catch Stats",
      icon: "https://www.mousehuntgame.com/images/ui/hud/menu/prize_shoppe.png?",
      callback: showModal
    });
  });
  var location_catch_stats_default = {
    id: "location-catch-stats",
    name: "Location Catch Stats",
    type: "feature",
    default: true,
    description: 'Adds a "Location Catch Stats" to the Mice menu to see your catch stats for the current location.',
    load: init
  };
  return __toCommonJS(location_catch_stats_exports);
})();
mhImprovedVersion = "0.0.0-userscript;"
mhImprovedPlatform = "userscript";
mhui.default.load();
migrateUserscript('Location Catches', 'https://greasyfork.org/en/scripts/463018-mousehunt-location-catches');
