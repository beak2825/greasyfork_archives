// ==UserScript==
// @name                页面滚动条美化
// @description         页面窗口侧边栏美化
//
// @author              xiao
// @license             GPLv3.0
// @namespace           https://github.com/xiaoboost
// @supportURL          https://github.com/xiaoboost/scripts/issues
// @homepageURL         https://github.com/xiaoboost/scripts/tree/master/packages/scrollbar
//
// @grant               GM_addStyle
// @grant               unsafeWindow
// @run-at              document-start
// @include             *
//
// @date                2023/10/14
// @modified            2023/10/14
// @version             1.0.1
// @downloadURL https://update.greasyfork.org/scripts/477395/%E9%A1%B5%E9%9D%A2%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/477395/%E9%A1%B5%E9%9D%A2%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(() => {
  // ../../node_modules/.pnpm/registry.npmmirror.com+@xiao-ai+utils@1.5.1/node_modules/@xiao-ai/utils/dist/esm/web/env.js
  var inBrowser = typeof window !== "undefined";
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf("msie 9.0") > 0;
  var isEdge = UA && UA.indexOf("edge/") > 0;
  var isAndroid = UA && UA.indexOf("android") > 0;
  var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
  var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
  var supportsPassive = false;
  var supportsOnce = false;
  if (inBrowser) {
    try {
      document.body.addEventListener("test", null, Object.defineProperty({}, "passive", {
        get() {
          supportsPassive = true;
        }
      }));
    } catch (e) {
    }
    try {
      document.body.addEventListener("test", null, Object.defineProperty({}, "once", {
        get() {
          supportsOnce = true;
        }
      }));
    } catch (e) {
    }
  }

  // ../../node_modules/.pnpm/registry.npmmirror.com+@xiao-ai+utils@1.5.1/node_modules/@xiao-ai/utils/dist/esm/web/event.js
  var MouseButtons;
  (function(MouseButtons2) {
    MouseButtons2[MouseButtons2["Left"] = 0] = "Left";
    MouseButtons2[MouseButtons2["Middle"] = 1] = "Middle";
    MouseButtons2[MouseButtons2["Right"] = 2] = "Right";
    MouseButtons2[MouseButtons2["Back"] = 3] = "Back";
    MouseButtons2[MouseButtons2["Forward"] = 4] = "Forward";
  })(MouseButtons || (MouseButtons = {}));

  // ../../node_modules/.pnpm/registry.npmmirror.com+@xiao-ai+utils@1.5.1/node_modules/@xiao-ai/utils/dist/esm/web/class-name.js
  function addClassName(el, className) {
    var _a;
    const classNameTrim = className.trim();
    const oldClassNames = ((_a = el.getAttribute("class")) !== null && _a !== void 0 ? _a : "").split(/\s+/);
    if (oldClassNames.includes(classNameTrim)) {
      return;
    }
    const newCLassNames = oldClassNames.concat(className.trim()).join(" ");
    el.setAttribute("class", newCLassNames);
  }
  function removeClassName(el, className) {
    var _a;
    const classNameTrim = className.trim();
    const oldClassNames = ((_a = el.getAttribute("class")) !== null && _a !== void 0 ? _a : "").split(/\s+/);
    if (!oldClassNames.includes(classNameTrim)) {
      return;
    }
    const newCLassNames = oldClassNames.filter((name) => name !== classNameTrim).join(" ");
    el.setAttribute("class", newCLassNames);
  }

  // ../utils/src/style.ts
  var codes = [];
  var timer = -1;
  function addStyle(code) {
    codes.push(code);
    if (timer !== -1) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      GM_addStyle(codes.join("\n"));
      if (false) {
        log("\u6837\u5F0F\u5143\u7D20\u52A0\u8F7D\u6210\u529F");
        timer = -1;
        codes.length = 0;
      }
    });
  }

  // ../utils/src/web.ts
  function onLoadStart(cb) {
    if (document.readyState === "interactive") {
      cb();
    }
    document.addEventListener("DOMContentLoaded", cb);
  }

  // ../../node_modules/.pnpm/registry.npmmirror.com+current-device@0.10.2/node_modules/current-device/es/index.js
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };
  var previousDevice = window.device;
  var device = {};
  var changeOrientationList = [];
  window.device = device;
  var documentElement = window.document.documentElement;
  var userAgent = window.navigator.userAgent.toLowerCase();
  var television = ["googletv", "viera", "smarttv", "internet.tv", "netcast", "nettv", "appletv", "boxee", "kylo", "roku", "dlnadoc", "pov_tv", "hbbtv", "ce-html"];
  device.macos = function() {
    return find("mac");
  };
  device.ios = function() {
    return device.iphone() || device.ipod() || device.ipad();
  };
  device.iphone = function() {
    return !device.windows() && find("iphone");
  };
  device.ipod = function() {
    return find("ipod");
  };
  device.ipad = function() {
    var iPadOS13Up = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    return find("ipad") || iPadOS13Up;
  };
  device.android = function() {
    return !device.windows() && find("android");
  };
  device.androidPhone = function() {
    return device.android() && find("mobile");
  };
  device.androidTablet = function() {
    return device.android() && !find("mobile");
  };
  device.blackberry = function() {
    return find("blackberry") || find("bb10");
  };
  device.blackberryPhone = function() {
    return device.blackberry() && !find("tablet");
  };
  device.blackberryTablet = function() {
    return device.blackberry() && find("tablet");
  };
  device.windows = function() {
    return find("windows");
  };
  device.windowsPhone = function() {
    return device.windows() && find("phone");
  };
  device.windowsTablet = function() {
    return device.windows() && find("touch") && !device.windowsPhone();
  };
  device.fxos = function() {
    return (find("(mobile") || find("(tablet")) && find(" rv:");
  };
  device.fxosPhone = function() {
    return device.fxos() && find("mobile");
  };
  device.fxosTablet = function() {
    return device.fxos() && find("tablet");
  };
  device.meego = function() {
    return find("meego");
  };
  device.cordova = function() {
    return window.cordova && location.protocol === "file:";
  };
  device.nodeWebkit = function() {
    return _typeof(window.process) === "object";
  };
  device.mobile = function() {
    return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego();
  };
  device.tablet = function() {
    return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();
  };
  device.desktop = function() {
    return !device.tablet() && !device.mobile();
  };
  device.television = function() {
    var i = 0;
    while (i < television.length) {
      if (find(television[i])) {
        return true;
      }
      i++;
    }
    return false;
  };
  device.portrait = function() {
    if (screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange")) {
      return includes(screen.orientation.type, "portrait");
    }
    if (device.ios() && Object.prototype.hasOwnProperty.call(window, "orientation")) {
      return Math.abs(window.orientation) !== 90;
    }
    return window.innerHeight / window.innerWidth > 1;
  };
  device.landscape = function() {
    if (screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange")) {
      return includes(screen.orientation.type, "landscape");
    }
    if (device.ios() && Object.prototype.hasOwnProperty.call(window, "orientation")) {
      return Math.abs(window.orientation) === 90;
    }
    return window.innerHeight / window.innerWidth < 1;
  };
  device.noConflict = function() {
    window.device = previousDevice;
    return this;
  };
  function includes(haystack, needle) {
    return haystack.indexOf(needle) !== -1;
  }
  function find(needle) {
    return includes(userAgent, needle);
  }
  function hasClass(className) {
    return documentElement.className.match(new RegExp(className, "i"));
  }
  function addClass(className) {
    var currentClassNames = null;
    if (!hasClass(className)) {
      currentClassNames = documentElement.className.replace(/^\s+|\s+$/g, "");
      documentElement.className = currentClassNames + " " + className;
    }
  }
  function removeClass(className) {
    if (hasClass(className)) {
      documentElement.className = documentElement.className.replace(" " + className, "");
    }
  }
  if (device.ios()) {
    if (device.ipad()) {
      addClass("ios ipad tablet");
    } else if (device.iphone()) {
      addClass("ios iphone mobile");
    } else if (device.ipod()) {
      addClass("ios ipod mobile");
    }
  } else if (device.macos()) {
    addClass("macos desktop");
  } else if (device.android()) {
    if (device.androidTablet()) {
      addClass("android tablet");
    } else {
      addClass("android mobile");
    }
  } else if (device.blackberry()) {
    if (device.blackberryTablet()) {
      addClass("blackberry tablet");
    } else {
      addClass("blackberry mobile");
    }
  } else if (device.windows()) {
    if (device.windowsTablet()) {
      addClass("windows tablet");
    } else if (device.windowsPhone()) {
      addClass("windows mobile");
    } else {
      addClass("windows desktop");
    }
  } else if (device.fxos()) {
    if (device.fxosTablet()) {
      addClass("fxos tablet");
    } else {
      addClass("fxos mobile");
    }
  } else if (device.meego()) {
    addClass("meego mobile");
  } else if (device.nodeWebkit()) {
    addClass("node-webkit");
  } else if (device.television()) {
    addClass("television");
  } else if (device.desktop()) {
    addClass("desktop");
  }
  if (device.cordova()) {
    addClass("cordova");
  }
  function handleOrientation() {
    if (device.landscape()) {
      removeClass("portrait");
      addClass("landscape");
      walkOnChangeOrientationList("landscape");
    } else {
      removeClass("landscape");
      addClass("portrait");
      walkOnChangeOrientationList("portrait");
    }
    setOrientationCache();
  }
  function walkOnChangeOrientationList(newOrientation) {
    for (var index = 0; index < changeOrientationList.length; index++) {
      changeOrientationList[index](newOrientation);
    }
  }
  device.onChangeOrientation = function(cb) {
    if (typeof cb == "function") {
      changeOrientationList.push(cb);
    }
  };
  var orientationEvent = "resize";
  if (Object.prototype.hasOwnProperty.call(window, "onorientationchange")) {
    orientationEvent = "orientationchange";
  }
  if (window.addEventListener) {
    window.addEventListener(orientationEvent, handleOrientation, false);
  } else if (window.attachEvent) {
    window.attachEvent(orientationEvent, handleOrientation);
  } else {
    window[orientationEvent] = handleOrientation;
  }
  handleOrientation();
  function findMatch(arr) {
    for (var i = 0; i < arr.length; i++) {
      if (device[arr[i]]()) {
        return arr[i];
      }
    }
    return "unknown";
  }
  device.type = findMatch(["mobile", "tablet", "desktop"]);
  device.os = findMatch(["ios", "iphone", "ipad", "ipod", "android", "blackberry", "macos", "windows", "fxos", "meego", "television"]);
  function setOrientationCache() {
    device.orientation = findMatch(["portrait", "landscape"]);
  }
  setOrientationCache();
  var es_default = device;

  // src/style.jss.ts
  var style_jss_default = {
    classes: {
      "scrollbarInvisible": "script-scrollbar-invisible-0",
      "scrollbarVisible": "script-scrollbar-visible-0",
      "scrollbarSlider": "script-scrollbar-slider-0",
      "scrollbarDisable": "script-scrollbar-disable-0",
      "scrollbarContainer": "script-scrollbar-container-0"
    },
    toString: function() {
      return `.script-scrollbar-container-0 {
  top: 0;
  right: 0;
  z-index: 999;
  position: absolute;
  background: transparent;
}
.script-scrollbar-container-0.script-scrollbar-invisible-0 {
  opacity: 0;
  transition: opacity .5s linear;
}
.script-scrollbar-container-0.script-scrollbar-visible-0 {
  opacity: 1;
  transition: opacity .2s linear;
}
.script-scrollbar-container-0.script-scrollbar-disable-0 {
  display: none;
  pointer-events: none;
}
.script-scrollbar-container-0 .script-scrollbar-slider-0 {
  left: 0;
  contain: strict;
  position: absolute;
  transform: translate3d(0px, 0px, 0px);
  background: rgba(100, 100, 100, 0.5);
}
body::-webkit-scrollbar {
  width: 0 !important;
  display: none;
}
body::-webkit-scrollbar-track {
  display: none;
}
body::-webkit-scrollbar-thumb {
  display: none;
}`;
    }
  };

  // src/scrollbar.ts
  var { classes: cla } = style_jss_default;
  var ScrollBar = class {
    scrollbar;
    slider;
    width = 10;
    hideScrollTimer = -1;
    mouse = {
      isMoving: false,
      isOver: false,
      offset: -1,
      lastOffset: -1
    };
    constructor() {
      if (document.querySelector(".cla.scrollbarContainer")) {
        return;
      }
      this.scrollbar = document.createElement("div");
      this.slider = document.createElement("div");
      this.scrollbar.appendChild(this.slider);
      this.scrollbar.setAttribute("class", `${cla.scrollbarContainer} ${cla.scrollbarInvisible}`);
      this.slider.setAttribute("class", cla.scrollbarSlider);
      document.body.appendChild(this.scrollbar);
      this.init();
    }
    get clientLength() {
      return this.container.clientHeight;
    }
    get scrollLength() {
      return this.container.scrollHeight;
    }
    get container() {
      return document.documentElement;
    }
    init() {
      const {
        container,
        scrollbar,
        slider,
        scrollLength,
        clientLength,
        width,
        mouse
      } = this;
      if (!es_default.desktop()) {
        addClassName(scrollbar, cla.scrollbarDisable);
        return;
      }
      addStyle(style_jss_default.toString());
      if (scrollLength <= clientLength) {
        scrollbar.style.display = "none";
        return;
      }
      scrollbar.style.height = "100%";
      scrollbar.style.width = `${width}px`;
      slider.style.width = `${width}px`;
      this.setSliderPositionFromContainer();
      const options = !supportsPassive ? false : {
        passive: true,
        capture: false
      };
      const triggerTrue = () => {
        mouse.isOver = true;
        this.triggerClass(true);
      };
      const triggerFalse = () => {
        mouse.isOver = false;
        this.delaySetScrollInvisible();
      };
      const startMouseMove = (ev) => {
        if (!mouse.isMoving && ev.button === MouseButtons.Left) {
          mouse.isMoving = true;
          container.style.userSelect = "none";
          container.style.cursor = "s-resize";
        }
      };
      const stopMouseMove = () => {
        const { mouse: mouse2, container: container2 } = this;
        if (mouse2.isMoving) {
          mouse2.offset = -1;
          mouse2.lastOffset = -1;
          mouse2.isMoving = false;
          container2.style.userSelect = "";
          container2.style.cursor = "";
        }
        this.delaySetScrollInvisible();
      };
      scrollbar.style.position = "fixed";
      scrollbar.addEventListener("mouseenter", triggerTrue, options);
      scrollbar.addEventListener("mouseleave", triggerFalse, options);
      slider.addEventListener("mousedown", startMouseMove, options);
      window.addEventListener("mouseup", stopMouseMove, options);
      window.addEventListener("mousemove", this.setSliderPositionFromMouse, options);
      window.addEventListener("resize", this.setSliderPositionFromContainer, options);
      window.addEventListener("scroll", this.setSliderPositionFromContainer, options);
      container.addEventListener("scroll", this.setSliderPositionFromContainer, options);
      this.disable = () => {
        stopMouseMove();
        scrollbar.removeEventListener("mouseenter", triggerTrue, options);
        scrollbar.removeEventListener("mouseleave", triggerFalse, options);
        slider.removeEventListener("mousedown", startMouseMove, options);
        window.removeEventListener("mouseup", stopMouseMove, options);
        window.removeEventListener("mousemove", this.setSliderPositionFromMouse, options);
        window.removeEventListener("resize", this.setSliderPositionFromContainer, options);
        window.removeEventListener("scroll", this.setSliderPositionFromContainer, options);
        container.removeEventListener("scroll", this.setSliderPositionFromContainer, options);
      };
    }
    disable = () => void 0;
    setSliderPositionFromContainer = () => {
      const { mouse } = this;
      if (mouse.isMoving) {
        return;
      }
      const {
        clientLength: client,
        scrollLength: scroll,
        container: parent,
        slider
      } = this;
      const scrollbarLen = client / scroll * client;
      const scrollOffset = parent.scrollTop / scroll * client;
      mouse.offset = scrollOffset;
      this.triggerClass(true);
      this.delaySetScrollInvisible();
      slider.style.height = `${scrollbarLen}px`;
      slider.style.top = `${scrollOffset}px`;
    };
    setSliderPositionFromMouse = (ev) => {
      const { mouse } = this;
      if (!mouse.isMoving) {
        return;
      }
      const { clientLength: client, scrollLength: scroll, slider } = this;
      const currentOffset = ev.clientY;
      if (mouse.offset === -1) {
        mouse.offset = Number.parseFloat(slider.style.top);
      }
      if (mouse.lastOffset === -1) {
        mouse.lastOffset = currentOffset;
        return;
      }
      const offsetY = currentOffset - mouse.lastOffset;
      const scrollbarLen = client / scroll * client;
      mouse.lastOffset = currentOffset;
      mouse.offset += offsetY;
      let realOffset = mouse.offset;
      if (realOffset < 0) {
        realOffset = 0;
      }
      if (realOffset > client - scrollbarLen) {
        realOffset = client - scrollbarLen;
      }
      slider.style.top = `${realOffset}px`;
      window.scrollTo({
        top: realOffset / client * scroll,
        behavior: "auto"
      });
    };
    delaySetScrollInvisible = () => {
      if (this.hideScrollTimer !== -1) {
        clearTimeout(this.hideScrollTimer);
      }
      this.hideScrollTimer = window.setTimeout(() => {
        if (this.mouse.isOver || this.mouse.isMoving) {
          return;
        }
        this.triggerClass(false);
      }, 300);
    };
    triggerClass = (visible) => {
      removeClassName(this.scrollbar, visible ? cla.scrollbarInvisible : cla.scrollbarVisible);
      addClassName(this.scrollbar, visible ? cla.scrollbarVisible : cla.scrollbarInvisible);
    };
  };

  // src/index.ts
  onLoadStart(() => new ScrollBar());
})();
