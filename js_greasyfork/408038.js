// ==UserScript==
// @name        Thread Media Viewer
// @description Comfy media browser and viewer for various discussion boards.
// @version     2.8.1
// @namespace   qimasho
// @source      https://github.com/qimasho/thread-media-viewer
// @supportURL  https://github.com/qimasho/thread-media-viewer/issues
// @match       https://boards.4chan.org/*
// @match       https://boards.4channel.org/*
// @match       https://thebarchive.com/*
// @require     https://cdn.jsdelivr.net/npm/preact@10.4.6/dist/preact.min.js
// @require     https://cdn.jsdelivr.net/npm/preact@10.4.6/hooks/dist/hooks.umd.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addValueChangeListener
// @grant       GM_removeValueChangeListener
// @grant       GM_addStyle
// @grant       GM_openInTab
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/408038/Thread%20Media%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/408038/Thread%20Media%20Viewer.meta.js
// ==/UserScript==

(() => {
  // src/lib/utils.ts
  function isOfType(value, condition) {
    return condition;
  }
  var ns = (name) => `_tmv_${name}`;
  function clamp(min5, value, max5) {
    return Math.max(min5, Math.min(max5, value));
  }
  function withValue(callback) {
    return (event) => {
      const target = event.target;
      if (isOfType(target, target && (target.nodeName === "INPUT" || target.nodeName === "BUTTON"))) {
        callback(target.value);
      }
    };
  }
  function getBoundingDocumentRect(element) {
    const {width, height, top, left, bottom, right} = element.getBoundingClientRect();
    return {
      width,
      height,
      top: window.scrollY + top,
      left: window.scrollX + left,
      bottom: window.scrollY + bottom,
      right: window.scrollX + right
    };
  }
  function scrollToView(element, {
    block = "start",
    behavior = "auto",
    container: forcedContainer
  } = {}) {
    if (!document.body.contains(element))
      return;
    let container;
    if (forcedContainer) {
      if (!isScrollableY(forcedContainer))
        return;
      container = forcedContainer;
    } else {
      container = element.parentElement;
      while (container) {
        if (isScrollableY(container))
          break;
        else
          container = container.parentElement;
      }
      if (!container)
        return;
    }
    const containerRect = getBoundingDocumentRect(container);
    const elementRect = getBoundingDocumentRect(element);
    const topOffset = elementRect.top - containerRect.top + (container === document.scrollingElement ? 0 : container.scrollTop);
    let requestedOffset;
    if (block === "start")
      requestedOffset = topOffset;
    else if (block === "center")
      requestedOffset = topOffset - container.clientHeight / 2 + element.offsetHeight / 2;
    else if (block === "end")
      requestedOffset = topOffset - container.clientHeight + element.offsetHeight;
    else
      requestedOffset = topOffset - block;
    container.scrollTo({top: requestedOffset, behavior});
  }
  function isScrollableY(element) {
    if (element.scrollHeight === element.clientHeight)
      return false;
    if (getComputedStyle(element).overflowY === "hidden")
      return false;
    if (element.scrollTop > 0)
      return true;
    element.scrollTop = 1;
    if (element.scrollTop > 0) {
      element.scrollTop = 0;
      return true;
    }
    return false;
  }
  function formatSeconds(seconds) {
    let minutes = Math.floor(seconds / 60);
    let leftover = Math.round(seconds - minutes * 60);
    return `${String(minutes).padStart(2, "0")}:${String(leftover).padStart(2, "0")}`;
  }
  function throttle(fn, timeout = 100, noTrailing = false) {
    let timeoutID;
    let args;
    let context;
    let last = 0;
    function call() {
      fn.apply(context, args);
      last = Date.now();
      timeoutID = context = args = null;
    }
    function throttled() {
      let delta = Date.now() - last;
      context = this;
      args = arguments;
      if (delta >= timeout) {
        throttled.cancel();
        call();
      } else if (!noTrailing && timeoutID == null) {
        timeoutID = setTimeout(call, timeout - delta);
      }
    }
    throttled.cancel = () => {
      if (timeoutID !== null) {
        clearTimeout(timeoutID);
        timeoutID = null;
      }
    };
    throttled.flush = () => {
      if (timeoutID !== null) {
        clearTimeout(timeoutID);
        timeoutID = null;
        call();
      }
    };
    return throttled;
  }
  function keyEventId(event) {
    let key = String(event.key);
    const keyAsNumber = Number(event.key);
    const isNumpadKey = event.code.indexOf("Numpad") === 0;
    const isNumpadNumber = keyAsNumber >= 0 && keyAsNumber <= 9 && isNumpadKey;
    if (key === " " || isNumpadNumber)
      key = event.code;
    let id = "";
    if (event.altKey)
      id += "Alt";
    if (event.ctrlKey)
      id += id.length > 0 ? "+Ctrl" : "Ctrl";
    if (event.shiftKey && (key.length > 1 || isNumpadKey))
      id += id.length > 0 ? "+Shift" : "Shift";
    if (key !== "Alt" && key !== "Ctrl" && key !== "Shift")
      id += (id.length > 0 ? "+" : "") + key;
    return id;
  }
  function prevented(callback) {
    return function(event) {
      event.preventDefault();
      event.stopPropagation();
      callback(event);
    };
  }

  // src/lib/syncedSettings.ts
  var localStorageDriver = {
    subscribersMap: new Map(),
    get: (name) => {
      try {
        return JSON.parse(localStorage.getItem(name));
      } catch {
        return void 0;
      }
    },
    set: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
    subscribe: (name, callback) => {
      const listener = () => callback(name, void 0, localStorage.getItem(name));
      localStorageDriver.subscribersMap.set(callback, listener);
      window.addEventListener("storage", listener);
      return () => localStorageDriver.unsubscribe(callback);
    },
    unsubscribe: (callback) => {
      const listener = localStorageDriver.subscribersMap.get(callback);
      if (listener) {
        window.removeEventListener("storage", listener);
        localStorageDriver.subscribersMap.delete(callback);
      }
    }
  };
  var greaseMonkeyDriver = {
    subscribersMap: new Map(),
    get: (name) => GM_getValue(name),
    set: (name, value) => GM_setValue(name, value),
    subscribe: (name, callback) => {
      const id = GM_addValueChangeListener(name, callback);
      greaseMonkeyDriver.subscribersMap.set(callback, id);
      return () => greaseMonkeyDriver.unsubscribe(callback);
    },
    unsubscribe: (callback) => {
      const id = localStorageDriver.subscribersMap.get(callback);
      if (id) {
        GM_removeValueChangeListener(id);
        greaseMonkeyDriver.subscribersMap.delete(callback);
      }
    }
  };
  function syncedSettings(storageKey, defaults, driver = greaseMonkeyDriver) {
    const listeners = new Set();
    let savingPromise = null;
    let settings = load();
    function triggerListeners() {
      for (let callback of listeners)
        callback(settings);
    }
    function load() {
      let data = driver.get(storageKey);
      return typeof data === "object" ? {...defaults, ...data} : {...defaults};
    }
    function save() {
      if (savingPromise)
        return savingPromise;
      savingPromise = new Promise((resolve) => setTimeout(() => {
        driver.set(storageKey, settings);
        savingPromise = null;
        resolve();
      }, 10));
      return savingPromise;
    }
    driver.subscribe(storageKey, throttle(() => {
      let newData = load();
      let hasChanges = false;
      for (let key in newData) {
        if (newData[key] !== settings[key]) {
          hasChanges = true;
          settings[key] = newData[key];
        }
      }
      if (hasChanges)
        triggerListeners();
    }, 500));
    const control = {
      _assign(obj) {
        Object.assign(settings, obj);
        save();
        triggerListeners();
      },
      _reset() {
        control._assign(defaults);
      },
      _subscribe(callback) {
        listeners.add(callback);
        return () => listeners.delete(callback);
      },
      _unsubscribe(callback) {
        listeners.delete(callback);
      },
      get _defaults() {
        return defaults;
      }
    };
    return new Proxy(settings, {
      get(_, prop) {
        if (isOfType(prop, prop in control))
          return control[prop];
        if (isOfType(prop, prop in settings))
          return settings[prop];
        throw new Error(`SyncedStorage: property "${String(prop)}" does not exist in "${storageKey}".`);
      },
      set(_, prop, value) {
        if (isOfType(prop, prop in settings)) {
          settings[prop] = value;
          save();
          triggerListeners();
          return true;
        }
        throw new Error(`Trying to set an unknown "${storageKey}" property "${String(prop)}"`);
      }
    });
  }

  // src/serializers.ts
  var SERIALIZERS = [
    {
      urlMatches: /^boards\.4chan(nel)?.org/i,
      threadSerializer: {
        selector: ".board .thread",
        serializer: fortunePostSerializer
      },
      catalogSerializer: {
        selector: "#threads",
        serializer: (thread) => thread.querySelector("a")?.href
      }
    },
    {
      urlMatches: /^thebarchive\.com/i,
      threadSerializer: {
        selector: ".thread .posts",
        serializer: theBArchivePostSerializer
      },
      catalogSerializer: {
        selector: "#thread_o_matic",
        serializer: (thread) => thread.querySelector("a.thread_image_link")?.href
      }
    }
  ];
  function fortunePostSerializer(post) {
    const titleAnchor = post.querySelector(".fileText a");
    const url = post.querySelector("a.fileThumb")?.href;
    const thumbnailUrl = post.querySelector("a.fileThumb img")?.src;
    const meta = post.querySelector(".fileText")?.textContent?.match(/\(([^\(\)]+ *, *\d+x\d+)\)/)?.[1];
    const [size, dimensions] = meta?.split(",").map((str) => str.trim()) || [];
    const [width, height] = dimensions?.split("x").map((str) => parseInt(str, 10) || void 0) || [];
    const filename = titleAnchor?.title || titleAnchor?.textContent || url?.match(/\/([^\/]+)$/)?.[1];
    if (!url || !thumbnailUrl || !filename)
      return null;
    const id = url.split("/").pop();
    if (!id)
      return null;
    return {
      media: [{id, url, thumbnailUrl, filename, size, width, height}],
      replies: post.querySelectorAll(".postInfo .backlink a.quotelink")?.length ?? 0
    };
  }
  function theBArchivePostSerializer(post) {
    const titleElement = post.querySelector(".post_file_filename");
    const url = post.querySelector("a.thread_image_link")?.href;
    const thumbnailUrl = post.querySelector("img.post_image")?.src;
    const meta = post.querySelector(".post_file_metadata")?.textContent;
    const [size, dimensions] = meta?.split(",").map((str) => str.trim()) || [];
    const [width, height] = dimensions?.split("x").map((str) => parseInt(str, 10) || void 0) || [];
    const filename = titleElement?.title || titleElement?.textContent || url?.match(/\/([^\/]+)$/)?.[1];
    if (!url || !thumbnailUrl || !filename)
      return null;
    const id = url.split("/").pop();
    if (!id)
      return null;
    return {
      media: [{id, url, size, width, height, thumbnailUrl, filename}],
      replies: post.querySelectorAll(".backlink_list a.backlink")?.length ?? 0
    };
  }

  // src/lib/preact.ts
  var h = preact.h;
  var render = preact.render;
  var createContext = preact.createContext;
  var useState = preactHooks.useState;
  var useEffect = preactHooks.useEffect;
  var useLayoutEffect = preactHooks.useLayoutEffect;
  var useRef = preactHooks.useRef;
  var useMemo = preactHooks.useMemo;
  var useCallback = preactHooks.useCallback;
  var useContext = preactHooks.useContext;

  // src/settings.ts
  var defaultSettings = {
    lastAcknowledgedVersion: "2.8.0",
    mediaListWidth: 640,
    mediaListHeight: 0.5,
    mediaListItemsPerRow: 3,
    thumbnailFit: "contain",
    volume: 0.5,
    fastForwardActivation: "hold",
    fastForwardRate: 5,
    adjustVolumeBy: 0.125,
    adjustSpeedBy: 0.5,
    seekBy: 5,
    tinySeekBy: 0.033,
    endTimeFormat: "total",
    fpmVideoUpscaleThreshold: 0.5,
    fpmVideoUpscaleLimit: 2,
    fpmImageUpscaleThreshold: 0,
    fpmImageUpscaleLimit: 2,
    catalogNavigator: true,
    holdTimeThreshold: 200,
    keyToggleUI: "`",
    keyNavLeft: "a",
    keyNavRight: "d",
    keyNavUp: "w",
    keyNavDown: "s",
    keyNavPageBack: "PageUp",
    keyNavPageForward: "PageDown",
    keyNavStart: "Home",
    keyNavEnd: "End",
    keyListViewToggle: "f",
    keyListViewLeft: "A",
    keyListViewRight: "D",
    keyListViewUp: "W",
    keyListViewDown: "S",
    keyViewClose: "F",
    keyViewFullPage: "Tab",
    keyViewPause: "Space",
    keyViewFastForward: "Shift+Space",
    keyViewVolumeDown: "Q",
    keyViewVolumeUp: "E",
    keyViewSpeedDown: "Alt+q",
    keyViewSpeedUp: "Alt+e",
    keyViewSpeedReset: "Alt+w",
    keyViewSeekBack: "q",
    keyViewSeekForward: "e",
    keyViewTinySeekBack: "Alt+a",
    keyViewTinySeekForward: "Alt+d",
    keyViewSeekTo0: "0",
    keyViewSeekTo10: "1",
    keyViewSeekTo20: "2",
    keyViewSeekTo30: "3",
    keyViewSeekTo40: "4",
    keyViewSeekTo50: "5",
    keyViewSeekTo60: "6",
    keyViewSeekTo70: "7",
    keyViewSeekTo80: "8",
    keyViewSeekTo90: "9",
    keyCatalogOpenThread: "f",
    keyCatalogOpenThreadInNewTab: "Ctrl+F",
    keyCatalogOpenThreadInBackgroundTab: "F"
  };
  var SettingsContext = createContext(null);
  function useSettings() {
    const syncedSettings2 = useContext(SettingsContext);
    if (!syncedSettings2)
      throw new Error();
    const [_, update] = useState(NaN);
    useEffect(() => {
      return syncedSettings2._subscribe(() => update(NaN));
    }, []);
    return syncedSettings2;
  }
  var SettingsProvider = SettingsContext.Provider;

  // src/lib/mediaWatcher.ts
  var MediaWatcher = class {
    constructor(serializer2) {
      this.listeners = new Set();
      this.mediaByID = new Map();
      this.media = [];
      this.destroy = () => {
        this.listeners.clear();
        this.observer.disconnect();
      };
      this.serialize = () => {
        let addedMedia = [];
        let hasNewMedia = false;
        let hasChanges = false;
        for (let child of this.container.children) {
          const postContainer = child;
          const serializedPost = this.serializer.serializer(postContainer);
          if (serializedPost == null)
            continue;
          for (let serializedMedia of serializedPost.media) {
            const extension = String(serializedMedia.url.match(/\.([^.]+)$/)?.[1] || "").toLowerCase();
            const mediaItem = {
              ...serializedMedia,
              extension,
              isVideo: !!extension.match(/webm?|mp4/),
              isGif: extension === "gif",
              postContainer,
              replies: serializedPost.replies
            };
            let existingItem = this.mediaByID.get(mediaItem.id);
            if (existingItem) {
              if (JSON.stringify(existingItem) !== JSON.stringify(mediaItem)) {
                Object.assign(existingItem, mediaItem);
                hasChanges = true;
              }
              continue;
            }
            this.mediaByID.set(mediaItem.id, mediaItem);
            addedMedia.push(mediaItem);
            hasNewMedia = true;
          }
        }
        if (hasNewMedia)
          this.media = this.media.concat(addedMedia);
        if (hasNewMedia || hasChanges) {
          for (let listener of this.listeners)
            listener(addedMedia, this.media);
        }
      };
      this.subscribe = (callback) => {
        this.listeners.add(callback);
        return () => this.unsubscribe(callback);
      };
      this.unsubscribe = (callback) => {
        this.listeners.delete(callback);
      };
      this.serializer = serializer2;
      const container = document.querySelector(serializer2.selector);
      if (!container)
        throw new Error(`No elements matched by threadSelector: ${serializer2.selector}`);
      this.container = container;
      this.serialize();
      this.observer = new MutationObserver(this.serialize);
      this.observer.observe(container, {childList: true, subtree: true, attributeFilter: ["href", "src"]});
    }
  };

  // src/lib/catalogWatcher.ts
  var CatalogWatcher = class {
    constructor(serializer2) {
      this.listeners = new Set();
      this.threads = [];
      this.destroy = () => {
        this.listeners.clear();
        this.observer.disconnect();
      };
      this.serialize = () => {
        let newThreads = [];
        let hasChanges = false;
        for (let i = 0; i < this.container.children.length; i++) {
          const container = this.container.children[i];
          const url = this.serializer.serializer(container);
          if (url) {
            newThreads.push({url, container});
            if (this.threads[i]?.url !== url)
              hasChanges = true;
          }
        }
        if (hasChanges) {
          this.threads = newThreads;
          for (let listener of this.listeners)
            listener(this.threads);
        }
      };
      this.subscribe = (callback) => {
        this.listeners.add(callback);
        return () => this.unsubscribe(callback);
      };
      this.unsubscribe = (callback) => {
        this.listeners.delete(callback);
      };
      this.serializer = serializer2;
      const container = document.querySelector(serializer2.selector);
      if (!container)
        throw new Error(`No elements matched by threadSelector: ${serializer2.selector}`);
      this.container = container;
      this.serialize();
      this.observer = new MutationObserver(this.serialize);
      this.observer.observe(container, {childList: true, subtree: true});
    }
  };

  // src/lib/elementSize.ts
  var commitId = null;
  var changedElements = new Set();
  var elementObservers = new Map();
  function requestCommit(element) {
    changedElements.add(element);
    if (commitId === null)
      commitId = setTimeout(commit, 34);
  }
  function commit() {
    commitId = null;
    const changes = [];
    for (const element of changedElements) {
      changes.push({
        element,
        offset: [element.offsetWidth, element.offsetHeight],
        client: [element.clientWidth, element.clientHeight]
      });
    }
    changedElements.clear();
    for (const change of changes) {
      const callbacks = elementObservers.get(change.element);
      if (callbacks)
        for (const callback of callbacks)
          callback(change);
    }
  }
  function observeElementSize(element, callback, options = {}) {
    const borderBox = options.box !== "padding-box";
    const observer = borderBox ? (change) => callback(change.offset) : (change) => callback(change.client);
    const triggerChange = () => requestCommit(element);
    let observers = elementObservers.get(element) || new Set();
    if (!elementObservers.has(element))
      elementObservers.set(element, observers);
    observers.add(observer);
    const resizeObserver = new ResizeObserver(triggerChange);
    resizeObserver.observe(element);
    if (options.precheck)
      triggerChange();
    return () => {
      resizeObserver.disconnect();
      observers.delete(observer);
      if (observers.size === 0)
        elementObservers.delete(element);
    };
  }

  // src/lib/hooks.ts
  function useForceUpdate() {
    const [_, setState] = useState(NaN);
    return () => setState(NaN);
  }
  var _useKey = (() => {
    const INTERACTIVE = {INPUT: true, TEXTAREA: true, SELECT: true};
    let handlersByShortcut = {
      keydown: new Map(),
      keyup: new Map()
    };
    function triggerHandlers(event) {
      if (INTERACTIVE[event.target.nodeName])
        return;
      const eventType = event.type;
      let handlers = handlersByShortcut[eventType]?.get(keyEventId(event));
      if (handlers && handlers.length > 0) {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        handlers[handlers.length - 1](event);
      }
    }
    window.addEventListener("keydown", triggerHandlers);
    window.addEventListener("keyup", triggerHandlers);
    return function _useKey2(event, shortcut, handler) {
      useEffect(() => {
        if (!shortcut)
          return;
        let handlers = handlersByShortcut[event].get(shortcut);
        if (!handlers) {
          handlers = [];
          handlersByShortcut[event].set(shortcut, handlers);
        }
        handlers.push(handler);
        const nonNullHandlers = handlers;
        return () => {
          let indexOfHandler = nonNullHandlers.indexOf(handler);
          if (indexOfHandler >= 0)
            nonNullHandlers.splice(indexOfHandler, 1);
        };
      }, [shortcut, handler]);
    };
  })();
  function useKey(shortcut, handler) {
    _useKey("keydown", shortcut, handler);
  }
  function useWindowDimensions() {
    let [dimensions, setDimensions] = useState([window.innerWidth, window.innerHeight]);
    useEffect(() => {
      let handleResize = throttle(() => setDimensions([window.innerWidth, window.innerHeight]), 100);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return dimensions;
  }
  function useElementSize(ref, box = "border-box") {
    const [sizes, setSizes] = useState([null, null]);
    useLayoutEffect(() => {
      if (!ref.current)
        throw new Error();
      return observeElementSize(ref.current, setSizes, {box, precheck: true});
    }, [box]);
    return sizes;
  }
  function useItemsPerRow(ref, throttle2 = false) {
    const [itemsPerRow, setItemsPerRow] = useState(0);
    useLayoutEffect(() => {
      const container = ref.current;
      if (!container)
        throw new Error();
      const checker = () => {
        let currentTop = null;
        for (let i = 0; i < container.children.length; i++) {
          const item = container.children[i];
          const rect = item.getBoundingClientRect();
          if (currentTop != null && currentTop !== rect.top) {
            setItemsPerRow(i);
            return;
          }
          currentTop = rect.top;
        }
        setItemsPerRow(container.children.length);
      };
      const check = throttle2 !== false ? throttle(checker, throttle2) : checker;
      const resizeObserver = new ResizeObserver(check);
      resizeObserver.observe(container);
      const childrenObserver = new MutationObserver(check);
      childrenObserver.observe(container, {childList: true});
      return () => {
        resizeObserver.disconnect();
        childrenObserver.disconnect();
      };
    }, []);
    return itemsPerRow;
  }
  var useGesture = (() => {
    let callbacksByGesture = new Map();
    function startGesture({button, x, y}) {
      if (button !== 2)
        return;
      const gestureStart = {x, y};
      window.addEventListener("mouseup", endGesture);
      function endGesture({button: button2, x: x2, y: y2}) {
        window.removeEventListener("mouseup", endGesture);
        if (button2 !== 2)
          return;
        const dragDistance = Math.hypot(x2 - gestureStart.x, y2 - gestureStart.y);
        if (dragDistance < 30)
          return;
        let gesture;
        if (Math.abs(gestureStart.x - x2) < dragDistance / 2) {
          gesture = gestureStart.y < y2 ? "down" : "up";
        } else if (Math.abs(gestureStart.y - y2) < dragDistance / 2) {
          gesture = gestureStart.x < x2 ? "right" : "left";
        }
        if (gesture) {
          let callbacks = callbacksByGesture.get(gesture);
          if (callbacks && callbacks.length > 0)
            callbacks[callbacks.length - 1]();
          const preventContext = (event) => event.preventDefault();
          window.addEventListener("contextmenu", preventContext, {once: true});
          setTimeout(() => window.removeEventListener("contextmenu", preventContext), 10);
        }
      }
    }
    window.addEventListener("mousedown", startGesture);
    return function useGesture2(gesture, callback) {
      useEffect(() => {
        if (!gesture)
          return;
        let callbacks = callbacksByGesture.get(gesture);
        if (!callbacks) {
          callbacks = [];
          callbacksByGesture.set(gesture, callbacks);
        }
        callbacks.push(callback);
        const nonNullHandlers = callbacks;
        return () => {
          let callbackIndex = nonNullHandlers.indexOf(callback);
          if (callbackIndex >= 0)
            nonNullHandlers.splice(callbackIndex, 1);
        };
      }, [gesture, callback]);
    };
  })();

  // src/components/SideView.ts
  function SideView({onClose, children}) {
    return h("div", {class: ns("SideView")}, [h("button", {class: ns("close"), onClick: onClose}, "\xD7"), children]);
  }
  SideView.styles = `
/* Scrollbars in chrome since it doesn't support scrollbar-width */
.${ns("SideView")}::-webkit-scrollbar {
	width: 10px;
	background-color: transparent;
}
.${ns("SideView")}::-webkit-scrollbar-track {
	border: 0;
	background-color: transparent;
}
.${ns("SideView")}::-webkit-scrollbar-thumb {
	border: 0;
	background-color: #6f6f70;
}

.${ns("SideView")} {
	position: fixed;
	bottom: 0;
	left: 0;
	width: var(--media-list-width);
	height: calc(100vh - var(--media-list-height));
	padding: 1em 1.5em;
	color: #aaa;
	background: #161616;
	box-shadow: 0px 6px 0 3px #0003;
	overflow-x: hidden;
	overflow-y: auto;
	scrollbar-width: thin;
}
.${ns("SideView")} .${ns("close")} {
	position: sticky;
	top: 0;
	float: right;
	width: 1em;
	height: 1em;
	margin: 0 -.5em 0 0;
	padding: 0;
	background: transparent;
	border: 0;
	color: #eee;
	font-size: 2em !important;
	line-height: 1;
}
.${ns("SideView")} > *:last-child { padding-bottom: 1em; }
.${ns("SideView")} fieldset {
	border: 0;
	margin: 1em 0;
	padding: 0;
}
.${ns("SideView")} fieldset + fieldset { margin-top: 2em; }
.${ns("SideView")} fieldset > legend {
	margin: 0
	padding: 0;
	width: 100%;
}
.${ns("SideView")} fieldset > legend > .${ns("title")} {
	display: inline-block;
	font-size: 1.1em;
	color: #fff;
	min-width: 38%;
	text-align: right;
	font-weight: bold;
	vertical-align: middle;
}
.${ns("SideView")} fieldset > legend > .${ns("actions")} { display: inline-block; margin-left: 1em; }
.${ns("SideView")} fieldset > legend > .${ns("actions")} > button { height: 2em; margin-right: .3em; }
.${ns("SideView")} fieldset > article {
	display: flex;
	align-items: center;
	grid-gap: .5em 1em;
}
.${ns("SideView")} fieldset > * + article { margin-top: .8em; }
.${ns("SideView")} fieldset > article > header {
	flex: 0 0 38%;
	text-align: right;
	color: #fff;
}
.${ns("SideView")} fieldset > article > section { flex: 1 1 0; }

.${ns("SideView")} fieldset.${ns("-value-heavy")} > article > header { flex: 0 0 20%; }
.${ns("SideView")} fieldset.${ns("-compact")} > article { flex-wrap: wrap; }
.${ns("SideView")} fieldset.${ns("-compact")} legend { text-align: left; }
.${ns("SideView")} fieldset.${ns("-compact")} article > header {
	flex: 1 1 100%;
	margin-left: 1.5em;
	text-align: left;
}
.${ns("SideView")} fieldset.${ns("-compact")} article > section {
	flex: 1 1 100%;
	margin-left: 3em;
}
`;

  // src/components/Settings.ts
  var {round} = Math;
  function Settings() {
    const settings = useSettings();
    const containerRef = useRef(null);
    const [containerWidth] = useElementSize(containerRef, "padding-box");
    function handleShortcutsKeyDown(event) {
      const target = event.target;
      if (!isOfType(target, target?.nodeName === "INPUT"))
        return;
      if (target.name.indexOf("key") !== 0)
        return;
      if (event.key === "Shift")
        return;
      event.preventDefault();
      event.stopPropagation();
      settings[target.name] = keyEventId(event);
    }
    function handleShortcutsMouseDown(event) {
      if (event.button !== 0)
        return;
      const target = event.target;
      if (!isOfType(target, target?.nodeName === "BUTTON"))
        return;
      const name = target.name;
      if (!isOfType(name, name in settings) || name.indexOf("key") !== 0)
        return;
      if (target.value === "unbind")
        settings[name] = null;
      else if (target.value === "reset")
        settings[name] = defaultSettings[name];
    }
    function shortcutsFieldset(title, shortcuts) {
      function all(action) {
        settings._assign(shortcuts.reduce((acc, [name, title2, flag]) => {
          if ((action !== "unbind" || flag !== "required") && name.indexOf("key") === 0) {
            acc[name] = action === "reset" ? defaultSettings[name] : null;
          }
          return acc;
        }, {}));
      }
      return h("fieldset", {...compactPropsS, onKeyDown: handleShortcutsKeyDown, onMouseDown: handleShortcutsMouseDown}, [
        h("legend", null, [
          h("span", {class: ns("title")}, title),
          h("span", {class: ns("actions")}, [
            h("button", {class: ns("reset"), title: "Reset category", onClick: () => all("reset")}, "\u21BB reset"),
            h("button", {class: ns("unbind"), title: "Unbind category", onClick: () => all("unbind")}, "\u29B8 unbind")
          ])
        ]),
        shortcuts.map(([name, title2, flag]) => shortcutItem(name, title2, flag))
      ]);
    }
    function shortcutItem(name, title, flag) {
      const isDefault = settings[name] === defaultSettings[name];
      return h("article", null, [
        h("header", null, title),
        h("section", null, [
          h("input", {
            type: "text",
            name,
            value: settings[name] || "",
            placeholder: !settings[name] ? "unbound" : void 0
          }),
          h("button", {
            class: ns("reset"),
            name,
            value: "reset",
            title: isDefault ? "Default value" : "Reset to default",
            disabled: isDefault
          }, isDefault ? "\u29BF" : "\u21BB"),
          flag === "required" ? h("button", {class: ns("unbind"), title: `Required, can't unbind`, disabled: true}, "\u26A0") : settings[name] !== null && h("button", {class: ns("unbind"), name, value: "unbind", title: "Unbind"}, "\u29B8")
        ])
      ]);
    }
    const compactPropsM = containerWidth && containerWidth < 450 ? {class: ns("-compact")} : null;
    const compactPropsS = containerWidth && containerWidth < 340 ? compactPropsM : null;
    return h("div", {class: ns("Settings"), ref: containerRef}, [
      h("h1", null, ["Settings "]),
      h("button", {class: ns("defaults"), onClick: settings._reset, title: "Reset all settings to default values."}, "\u21BB defaults"),
      h("fieldset", compactPropsM, [
        h("article", null, [
          h("header", null, "Media list width \xD7 height"),
          h("section", null, h("code", null, [
            `${settings.mediaListWidth}px \xD7 ${round(settings.mediaListHeight * 100)}%`,
            " ",
            h("small", null, "(drag edges)")
          ]))
        ]),
        h("article", null, [
          h("header", null, "Items per row"),
          h("section", null, [
            h("input", {
              type: "range",
              min: 2,
              max: 6,
              step: 1,
              name: "mediaListItemsPerRow",
              value: settings.mediaListItemsPerRow,
              onInput: withValue((value) => {
                const defaultValue = settings._defaults.mediaListItemsPerRow;
                settings.mediaListItemsPerRow = parseInt(value, 10) || defaultValue;
              })
            }),
            " ",
            h("code", null, settings.mediaListItemsPerRow)
          ])
        ]),
        h("article", null, [
          h("header", null, "Thumbnail fit"),
          h("section", null, [
            h("label", null, [
              h("input", {
                type: "radio",
                name: "thumbnailFit",
                value: "contain",
                checked: settings.thumbnailFit === "contain",
                onInput: () => settings.thumbnailFit = "contain"
              }),
              " contain"
            ]),
            h("label", null, [
              h("input", {
                type: "radio",
                name: "thumbnailFit",
                value: "cover",
                checked: settings.thumbnailFit === "cover",
                onInput: () => settings.thumbnailFit = "cover"
              }),
              " cover"
            ])
          ])
        ])
      ]),
      h("fieldset", compactPropsM, [
        h("legend", null, h("span", {class: ns("title")}, "Full page mode")),
        h("article", null, [
          h("section", null, [
            "Activated with ",
            h("small", {class: ns("-muted")}, [
              "key: ",
              h("kbd", {title: "Rebind below."}, `${settings.keyViewFullPage}`)
            ])
          ])
        ]),
        h("article", null, [
          h("header", {
            title: `Upscale only videos that cover less than ${round(round(settings.fpmVideoUpscaleThreshold * 100))}% of the available dimensions (width<threshold and height<threshold).
Set to 100% to always upscale if video is smaller than available area.
Set to 0% to never upscale.`
          }, "Video upscale threshold"),
          h("section", null, [
            h("input", {
              type: "range",
              min: 0,
              max: 1,
              step: 0.05,
              name: "fpmVideoUpscaleThreshold",
              value: settings.fpmVideoUpscaleThreshold,
              onInput: withValue((value) => settings.fpmVideoUpscaleThreshold = parseFloat(value) || 0)
            }),
            " ",
            h("code", null, settings.fpmVideoUpscaleThreshold === 0 ? "\u29B8" : `${round(settings.fpmVideoUpscaleThreshold * 100)}%`)
          ])
        ]),
        h("article", null, [
          h("header", {
            title: `Don't upscale videos more than ${settings.fpmVideoUpscaleLimit}x of their original size.`
          }, "Video upscale limit"),
          h("section", null, [
            h("input", {
              type: "range",
              min: 1,
              max: 10,
              step: 0.5,
              name: "fpmVideoUpscaleLimit",
              value: settings.fpmVideoUpscaleLimit,
              onInput: withValue((value) => settings.fpmVideoUpscaleLimit = parseInt(value, 10) || 0.025)
            }),
            " ",
            h("code", null, settings.fpmVideoUpscaleLimit === 1 ? "\u29B8" : `${settings.fpmVideoUpscaleLimit}x`)
          ])
        ]),
        h("article", null, [
          h("header", {
            class: ns("title"),
            title: `Upscale only images that cover less than ${round(round(settings.fpmImageUpscaleThreshold * 100))}% of the available dimensions (width<threshold and height<threshold).
Set to 100% to always upscale if image is smaller than available area.
Set to 0% to never upscale.`
          }, "Image upscale threshold"),
          h("section", null, [
            h("input", {
              type: "range",
              min: 0,
              max: 1,
              step: 0.05,
              name: "fpmImageUpscaleThreshold",
              value: settings.fpmImageUpscaleThreshold,
              onInput: withValue((value) => settings.fpmImageUpscaleThreshold = parseFloat(value) || 0)
            }),
            " ",
            h("code", null, settings.fpmImageUpscaleThreshold === 0 ? "\u29B8" : `${round(settings.fpmImageUpscaleThreshold * 100)}%`)
          ])
        ]),
        h("article", null, [
          h("header", {
            title: `Don't upscale images more than ${settings.fpmImageUpscaleLimit}x of their original size.`
          }, "Image upscale limit"),
          h("section", null, [
            h("input", {
              type: "range",
              min: 1,
              max: 10,
              step: 0.5,
              name: "fpmImageUpscaleLimit",
              value: settings.fpmImageUpscaleLimit,
              onInput: withValue((value) => settings.fpmImageUpscaleLimit = parseInt(value, 10) || 0.025)
            }),
            " ",
            h("code", null, settings.fpmImageUpscaleLimit === 1 ? "\u29B8" : `${settings.fpmImageUpscaleLimit}x`)
          ])
        ])
      ]),
      h("fieldset", compactPropsM, [
        h("legend", null, h("span", {class: ns("title")}, "Video player")),
        h("article", null, [
          h("header", null, "Volume"),
          h("section", null, [
            h("input", {
              type: "range",
              min: 0,
              max: 1,
              step: settings.adjustVolumeBy,
              name: "volume",
              value: settings.volume,
              onInput: withValue((value) => settings.volume = parseFloat(value) || 0.025)
            }),
            " ",
            h("code", null, `${(settings.volume * 100).toFixed(1)}%`)
          ])
        ]),
        h("article", null, [
          h("header", null, "Adjust volume by"),
          h("section", null, [
            h("input", {
              type: "range",
              min: 0.025,
              max: 0.5,
              step: 0.025,
              name: "adjustVolumeBy",
              value: settings.adjustVolumeBy,
              onInput: withValue((value) => settings.adjustVolumeBy = parseFloat(value) || 0.025)
            }),
            " ",
            h("code", null, `${(settings.adjustVolumeBy * 100).toFixed(1)}%`)
          ])
        ]),
        h("article", null, [
          h("header", null, "Adjust speed by"),
          h("section", null, [
            h("input", {
              type: "range",
              min: 0.05,
              max: 1,
              step: 0.05,
              name: "adjustSpeedBy",
              value: settings.adjustSpeedBy,
              onInput: withValue((value) => settings.adjustSpeedBy = parseFloat(value) || 0.025)
            }),
            " ",
            h("code", null, `${(settings.adjustSpeedBy * 100).toFixed(1)}%`)
          ])
        ]),
        h("article", null, [
          h("header", null, "Seek by"),
          h("section", null, [
            h("input", {
              type: "range",
              min: 1,
              max: 60,
              step: 1,
              name: "seekBy",
              value: settings.seekBy,
              onInput: withValue((value) => settings.seekBy = parseInt(value, 10) || 0.025)
            }),
            " ",
            h("code", null, `${settings.seekBy} seconds`)
          ])
        ]),
        h("article", null, [
          h("header", null, "Tiny seek by"),
          h("section", null, [
            h("input", {
              type: "range",
              min: 1e-3,
              max: 1,
              step: 1e-3,
              name: "tinySeekBy",
              value: settings.tinySeekBy,
              onInput: withValue((value) => settings.tinySeekBy = parseFloat(value) || 0.03)
            }),
            " ",
            h("code", null, `${round(settings.tinySeekBy * 1e3)}ms`)
          ])
        ]),
        h("article", null, [
          h("header", null, "End time format"),
          h("section", null, [
            h("label", null, [
              h("input", {
                type: "radio",
                name: "endTimeFormat",
                value: "total",
                checked: settings.endTimeFormat === "total",
                onInput: () => settings.endTimeFormat = "total"
              }),
              " total"
            ]),
            h("label", null, [
              h("input", {
                type: "radio",
                name: "endTimeFormat",
                value: "remaining",
                checked: settings.endTimeFormat === "remaining",
                onInput: () => settings.endTimeFormat = "remaining"
              }),
              " remaining"
            ])
          ])
        ]),
        h("article", null, [
          h("header", null, [
            "Fast forward activation",
            " ",
            h("small", {class: ns("-muted"), style: "white-space: nowrap"}, [
              "key: ",
              h("kbd", {title: "Rebind below."}, `${settings.keyViewFastForward}`)
            ])
          ]),
          h("section", null, [
            h("label", null, [
              h("input", {
                type: "radio",
                name: "fastForwardActivation",
                value: "hold",
                checked: settings.fastForwardActivation === "hold",
                onInput: () => settings.fastForwardActivation = "hold"
              }),
              " hold"
            ]),
            h("label", null, [
              h("input", {
                type: "radio",
                name: "fastForwardActivation",
                value: "toggle",
                checked: settings.fastForwardActivation === "toggle",
                onInput: () => settings.fastForwardActivation = "toggle"
              }),
              " toggle"
            ])
          ])
        ]),
        h("article", null, [
          h("header", null, "Fast forward rate"),
          h("section", null, [
            h("input", {
              type: "range",
              min: 1.5,
              max: 10,
              step: 0.5,
              name: "fastForwardRate",
              value: settings.fastForwardRate,
              onInput: withValue((value) => settings.fastForwardRate = Math.max(1, parseFloat(value) || 2))
            }),
            " ",
            h("code", null, `${settings.fastForwardRate.toFixed(1)}x`)
          ])
        ])
      ]),
      h("fieldset", null, [
        h("legend", null, h("span", {class: ns("title")}, "Other")),
        h("article", null, [
          h("header", {title: `Enables keyboard navigation in catalog`}, "Catalog navigator"),
          h("section", null, [
            h("input", {
              type: "checkbox",
              name: "catalogNavigator",
              value: "toggle",
              checked: settings.catalogNavigator,
              onInput: (event) => settings.catalogNavigator = event.target?.checked
            })
          ])
        ]),
        h("article", null, [
          h("header", {
            title: `Some keys lead to different actions when pressed rather than held down (full page toggle, click/hold to zoom, ...).
This value is the max time for the key press to still be recognized as a click.`
          }, "Hold time threshold"),
          h("section", null, [
            h("input", {
              type: "range",
              min: 40,
              max: 500,
              step: 20,
              name: "holdTimeThreshold",
              value: settings.holdTimeThreshold,
              onInput: withValue((value) => settings.holdTimeThreshold = parseInt(value, 10) || 0.025)
            }),
            " ",
            h("code", null, `${settings.holdTimeThreshold}ms`)
          ])
        ])
      ]),
      shortcutsFieldset("Navigation shortcuts", [
        ["keyToggleUI", "Toggle UI", "required"],
        ["keyNavLeft", "Select left"],
        ["keyNavRight", "Select right"],
        ["keyNavUp", "Select up"],
        ["keyNavDown", "Select down"],
        ["keyNavPageBack", "Page back"],
        ["keyNavPageForward", "Page forward"],
        ["keyNavStart", "To start"],
        ["keyNavEnd", "To end"]
      ]),
      shortcutsFieldset("Media list shortcuts", [
        ["keyListViewToggle", "View selected"],
        ["keyListViewLeft", "Select left & view"],
        ["keyListViewRight", "Select right & view"],
        ["keyListViewUp", "Select up & view"],
        ["keyListViewDown", "Select down & view"]
      ]),
      shortcutsFieldset("Media view shortcuts", [
        ["keyViewClose", "Close view"],
        ["keyViewFullPage", "Full page mode"],
        ["keyViewPause", "Pause"],
        ["keyViewFastForward", "Fast forward"],
        ["keyViewVolumeDown", "Volume down"],
        ["keyViewVolumeUp", "Volume up"],
        ["keyViewSpeedDown", "Speed down"],
        ["keyViewSpeedUp", "Speed up"],
        ["keyViewSpeedReset", "Speed reset"],
        ["keyViewSeekBack", "Seek back"],
        ["keyViewSeekForward", "Seek forward"],
        ["keyViewTinySeekBack", "Tiny seek back"],
        ["keyViewTinySeekForward", "Tiny seek forward"],
        ["keyViewSeekTo0", "Seek to 0%"],
        ["keyViewSeekTo10", "Seek to 10%"],
        ["keyViewSeekTo20", "Seek to 20%"],
        ["keyViewSeekTo30", "Seek to 30%"],
        ["keyViewSeekTo40", "Seek to 40%"],
        ["keyViewSeekTo50", "Seek to 50%"],
        ["keyViewSeekTo60", "Seek to 60%"],
        ["keyViewSeekTo70", "Seek to 70%"],
        ["keyViewSeekTo80", "Seek to 80%"],
        ["keyViewSeekTo90", "Seek to 90%"]
      ]),
      shortcutsFieldset("Catalog shortcuts", [
        ["keyCatalogOpenThread", "Open"],
        ["keyCatalogOpenThreadInNewTab", "Open in new tab"],
        ["keyCatalogOpenThreadInBackgroundTab", "Open in background tab"]
      ])
    ]);
  }
  Settings.styles = `
.${ns("Settings")} .${ns("defaults")} {
	position: absolute;
	top: 1em; right: 4em;
	height: 2em;
}
.${ns("Settings")} label {
	margin-right: .5em;
	background: #fff1;
	padding: .3em;
	border-radius: 2px;
}
.${ns("Settings")} input::placeholder {
	font-style: italic;
	color: #000a;
	font-size: .9em;
}
.${ns("Settings")} button.${ns("reset")}:not(:disabled):hover {
	color: #fff;
	border-color: #1196bf;
	background: #1196bf;
}
.${ns("Settings")} button.${ns("unbind")}:not(:disabled):hover {
	color: #fff;
	border-color: #f44;
	background: #f44;
}
.${ns("CONTAINER")} article > header[title]::before {
	content: '?';
	display: inline-block;
	vertical-align: middle;
	margin-right: .4em;
	background: #333;
	color: #aaa;
	border-radius: 50%;
	width: 1.3em;
	height: 1.3em;
	text-align: center;
	font-size: .8em;
	line-height: 1.3;
}
.${ns("Settings")} article button.${ns("reset")},
.${ns("Settings")} article button.${ns("unbind")} { margin-left: 0.3em; }
`;

  // src/components/Help.ts
  function Help() {
    const s = useSettings();
    return h("div", {class: ns("Help")}, [
      h("h1", null, "Help"),
      h("fieldset", {class: ns("-value-heavy")}, [
        h("article", null, [
          h("header", null, "Registry"),
          h("section", null, h("a", {href: "https://greasyfork.org/en/scripts/408038-thread-media-viewer"}, "greasyfork.org/en/scripts/408038"))
        ]),
        h("article", null, [
          h("header", null, "Repository"),
          h("section", null, h("a", {href: "https://github.com/qimasho/thread-media-viewer"}, "github.com/qimasho/thread-media-viewer"))
        ]),
        h("article", null, [
          h("header", null, "Issues"),
          h("section", null, h("a", {href: "https://github.com/qimasho/thread-media-viewer/issues"}, "github.com/qimasho/thread-media-viewer/issues"))
        ])
      ]),
      h("h2", null, "Mouse controls"),
      h("ul", {class: ns("-clean")}, [
        h("li", null, ["Right button gesture ", h("kbd", null, "\u2191"), " to toggle media list."]),
        h("li", null, ["Right button gesture ", h("kbd", null, "\u2193"), " to close media view."]),
        h("li", null, [h("kbd", null, "click"), " on thumbnail (thread or list) to open media viewer."]),
        h("li", null, [
          h("kbd", null, "click"),
          " on text portion of thumbnail (thread media list) or thread title/snippet (catalog) to move cursor to that item."
        ]),
        h("li", null, [h("kbd", null, "shift+click"), " on thumbnail (thread) to open both media view and list."]),
        h("li", null, [h("kbd", null, "double-click"), " to toggle fullscreen."]),
        h("li", null, [h("kbd", null, "mouse wheel"), " on video to change audio volume."]),
        h("li", null, [h("kbd", null, "mouse wheel"), " on timeline to seek video."]),
        h("li", null, [h("kbd", null, "mouse down"), " on image for 1:1 zoom and pan."])
      ]),
      h("h2", null, "FAQ"),
      h("dl", null, [
        h("dt", null, "Why does the page scroll when I'm navigating items?"),
        h("dd", null, "It scrolls to place the associated post right below the media list box."),
        h("dt", null, "What are the small squares at the bottom of thumbnails?"),
        h("dd", null, "Visualization of the number of replies the post has.")
      ])
    ]);
  }

  // src/components/Changelog.ts
  var TITLE = (version, date) => h("h2", null, h("code", null, [version, h("span", {class: ns("-muted")}, " \u2B29 "), h("small", null, date)]));
  function Changelog() {
    const settings = useSettings();
    if (settings.lastAcknowledgedVersion !== defaultSettings.lastAcknowledgedVersion) {
      settings.lastAcknowledgedVersion = defaultSettings.lastAcknowledgedVersion;
    }
    return h("div", {class: ns("Changelog")}, [
      h("h1", null, "Changelog"),
      TITLE("2.8.1", "2022.12.23"),
      h("ul", null, [
        h("li", null, `Fixed serializer recognizing some videos as images.`)
      ]),
      TITLE("2.8.0", "2022.10.14"),
      h("ul", null, [
        h("li", null, `Clicking image now toggles full page mode. Dragging in full page mode zooms & pans.`),
        h("li", null, `Removed fullscreen shortcut and double click to fullscreen. You can fullscreen with F11, and double click was just annoying.`),
        h("li", null, `Fixed clicking on thread thumbnails sometimes not being intercepted.`)
      ]),
      TITLE("2.7.0", "2021.11.29"),
      h("ul", null, [
        h("li", null, [
          `Implemented smart toggle vs peak zooming.`,
          h("br", null),
          `Applies to both full page mode (${settings.keyViewFullPage}), and zooming images with left mouse button.`,
          h("br", null),
          `If you want to quickly glance, just hold the button, and the zoom will be canceled upon release. If you want to toggle zoom until the next time the button is pressed, do a short press instead.`
        ]),
        h("li", null, `New option Hold time threshold, which controls the max length of a click to toggle zoom.`)
      ]),
      TITLE("2.6.4", "2021.05.06"),
      h("ul", null, [h("li", null, `Fixed thread watcher box hovering above UI.`)]),
      TITLE("2.6.3", "2021.04.25"),
      h("ul", null, [
        h("li", null, `Fixed shortcut to open a thread in new background tab focusing the new tab in violentmonkey.`)
      ]),
      TITLE("2.6.2", "2021.03.17"),
      h("ul", null, [
        h("li", null, `Fixed glitchy scrolling to the end of the page when navigating down from the last item.`)
      ]),
      TITLE("2.6.0", "2021.02.12"),
      h("ul", null, [
        h("li", null, `Clicking on media in a thread will no longer scroll the media list box when it's open. I don't recall a single time this behavior was useful, but almost always annoying, making me loose scroll position in the list box, so... removed.`)
      ]),
      TITLE("2.5.0", "2021.01.13"),
      h("ul", null, [
        h("li", null, `Re-arranged media view control buttons.`),
        h("li", null, `Added a button to close media view for people that miss the existence of the mouse gesture and shortcut.`),
        h("li", null, `Some styling and UX tweaks/improvements.`)
      ]),
      TITLE("2.4.0", "2020.11.05"),
      h("ul", null, [
        h("li", null, [
          `Settings are now saved in script's greasemonkey storage instead of website's localStorage. This makes settings persist between all websites the script runs on.`,
          h("br", {}),
          `Your old settings should migrate automatically, in a weird case they don't - sorry for the inconvenience.`
        ])
      ]),
      TITLE("2.3.0", "2020.10.26"),
      h("ul", null, [h("li", null, "Added viewer control buttons (fullpage toggle and speed).")]),
      TITLE("2.2.1", "2020.09.26"),
      h("ul", null, [h("li", null, "Fixed dragging timeline sometimes not resuming video properly.")]),
      TITLE("2.2.0", "2020.09.15"),
      h("ul", null, [
        h("li", null, "Added shortcuts to adjust video speed and setting for the adjustment amount."),
        h("li", null, `Added shortcuts for tiny video seeking by configurable amount of milliseconds. This is a poor man's frame step in an environment where we don't know video framerate.`)
      ]),
      TITLE("2.1.2", "2020.09.14"),
      h("ul", null, [
        h("li", null, "Style tweaks."),
        h("li", null, "Added an option to click on the text portion of the thumbnail (media list) or thread title/snippet (catalog) to move cursor to that item.")
      ]),
      TITLE("2.1.1", "2020.09.13"),
      h("ul", null, [
        h("li", null, 'Added "Thumbnail fit" setting.'),
        h("li", null, "Catalog cursor now pre-selects the item that is closest to the center of the screen instead of always the 1st one."),
        h("li", null, "Added new version indicator (changelog button turns green until clicked)"),
        h("li", null, "Fixed video pausing when clicked with other then primary mouse buttons.")
      ]),
      TITLE("2.0.0", "2020.09.12"),
      h("ul", null, [
        h("li", null, "Complete rewrite in TypeScript and restructure into a proper code base (", h("a", {href: "https://github.com/qimasho/thread-media-viewer"}, "github"), ")."),
        h("li", null, "Added catalog navigation to use same shortcuts to browse and open threads in catalogs."),
        h("li", null, "Added settings with knobs for pretty much everything."),
        h("li", null, "Added changelog (hi)."),
        h("li", null, `Further optimized all media viewing features and interactions so they are more robust, stable, and responsive (except enter/exit fullscreen, all glitchiness and slow transitions there are browser's fault and I can't do anything about it T.T).`)
      ])
    ]);
  }

  // src/components/SideNav.ts
  function SideNav({active, onActive}) {
    const settings = useSettings();
    const isNewVersion = settings.lastAcknowledgedVersion !== defaultSettings.lastAcknowledgedVersion;
    function button(name, title, className) {
      let classNames = "";
      if (active === name)
        classNames += ` ${ns("-active")}`;
      if (className)
        classNames += ` ${className}`;
      return h("button", {class: classNames, onClick: () => onActive(name)}, title);
    }
    return h("div", {class: ns("SideNav")}, [
      button("settings", "\u2699 settings"),
      button("help", "? help"),
      button("changelog", "\u2632 changelog", isNewVersion ? ns("-success") : void 0)
    ]);
  }
  SideNav.styles = `
.${ns("SideNav")} { display: flex; min-width: 0; }
.${ns("SideNav")} > button,
.${ns("SideNav")} > button:active {
	color: #eee;
	background: #1c1c1c;
	border: 0;
	outline: 0;
	border-radius: 2px;
	font-size: .911em;
	line-height: 1;
	height: 20px;
	padding: 0 .5em;
	white-space: nowrap;
	overflow: hidden;
}
.${ns("SideNav")} > button:hover {
	color: #fff;
	background: #333;
}
.${ns("SideNav")} > button + button {
	margin-left: 2px;
}
.${ns("SideNav")} > button.${ns("-active")} {
	color: #222;
	background: #ccc;
}
.${ns("SideNav")} > button.${ns("-success")} {
	color: #fff;
	background: #4b663f;
}
.${ns("SideNav")} > button.${ns("-success")}:hover {
	background: #b6eaa0;
}
`;

  // src/components/MediaList.ts
  var {max, min, round: round2} = Math;
  function MediaList({media, activeId, sideView, onActivation, onOpenSideView}) {
    const settings = useSettings();
    const containerRef = useRef(null);
    const listRef = useRef(null);
    const activeIndex = media.findIndex(({id}) => id === activeId);
    let [selectedIndex, setSelectedIndex] = useState(activeIndex >= 0 ? activeIndex : -1);
    const [isDragged, setIsDragged] = useState(false);
    const itemsPerRow = settings.mediaListItemsPerRow;
    if (selectedIndex == -1) {
      const centerOffset = window.innerHeight / 2;
      let lastProximity = Infinity;
      for (let i = 0; i < media.length; i++) {
        const rect = media[i].postContainer.getBoundingClientRect();
        let proximity = Math.abs(centerOffset - rect.top);
        if (rect.top > centerOffset) {
          selectedIndex = lastProximity < proximity ? i - 1 : i;
          break;
        }
        lastProximity = proximity;
      }
      if (selectedIndex == -1 && media.length > 0)
        selectedIndex = 0;
      if (selectedIndex != -1 && selectedIndex >= 0 && selectedIndex < media.length)
        setSelectedIndex(selectedIndex);
    }
    function scrollToItem(index, behavior = "smooth") {
      const targetChild = listRef.current?.children[index];
      if (isOfType(targetChild, targetChild != null)) {
        scrollToView(targetChild, {block: "center", behavior, container: listRef.current});
      }
    }
    function selectAndScrollTo(index) {
      if (media.length > 0 && index >= 0 && index < media.length) {
        setSelectedIndex(index);
        scrollToItem(index);
      }
    }
    function moveBy(delta, activate = false) {
      const newIndex = media.length > 0 ? max(0, min(media.length - 1, selectedIndex + delta)) : -1;
      if (newIndex !== selectedIndex) {
        selectAndScrollTo(newIndex);
        if (activate)
          onActivation(media[newIndex]?.id || null);
      }
    }
    function initiateResize(event) {
      const target = event.target;
      const direction = target?.dataset.direction;
      if (event.detail === 2 || event.button !== 0 || !direction)
        return;
      event.preventDefault();
      event.stopPropagation();
      const initialDocumentCursor = document.documentElement.style.cursor;
      const resizeX = direction === "ew" || direction === "nwse";
      const resizeY = direction === "ns" || direction === "nwse";
      const initialCursorToRightEdgeDelta = containerRef.current ? event.clientX - containerRef.current.offsetWidth : 0;
      function handleMouseMove(event2) {
        const clampedListWidth = clamp(300, event2.clientX - initialCursorToRightEdgeDelta, window.innerWidth - 300);
        if (resizeX)
          settings.mediaListWidth = clampedListWidth;
        const clampedListHeight = clamp(200 / window.innerHeight, event2.clientY / window.innerHeight, 1 - 200 / window.innerHeight);
        if (resizeY)
          settings.mediaListHeight = clampedListHeight;
      }
      function handleMouseUp() {
        settings.mediaListWidth = round2(settings.mediaListWidth / 10) * 10;
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("mousemove", handleMouseMove);
        document.documentElement.style.cursor = initialDocumentCursor;
        setIsDragged(false);
      }
      document.documentElement.style.cursor = `${direction}-resize`;
      setIsDragged(true);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
    }
    useEffect(() => {
      if (selectedIndex != -1)
        scrollToItem(selectedIndex, "auto");
    }, []);
    useEffect(() => {
      if (selectedIndex != -1 && media?.[selectedIndex]?.postContainer && containerRef.current) {
        let offset = getBoundingDocumentRect(containerRef.current).height;
        scrollToView(media[selectedIndex].postContainer, {block: round2(offset), behavior: "smooth"});
      }
    }, [selectedIndex]);
    const selectUp = () => moveBy(-itemsPerRow);
    const selectDown = () => {
      if (selectedIndex === media.length - 1) {
        document.scrollingElement?.scrollTo({
          top: document.scrollingElement.scrollHeight,
          behavior: "smooth"
        });
      } else {
        moveBy(itemsPerRow);
      }
    };
    const selectPrev = () => moveBy(-1);
    const selectNext = () => moveBy(1);
    const selectPageBack = () => moveBy(-itemsPerRow * 3);
    const selectPageForward = () => moveBy(itemsPerRow * 3);
    const selectFirst = () => selectAndScrollTo(0);
    const selectLast = () => selectAndScrollTo(media.length - 1);
    const selectAndViewPrev = () => moveBy(-1, true);
    const selectAndViewNext = () => moveBy(1, true);
    const selectAndViewUp = () => moveBy(-itemsPerRow, true);
    const selectAndViewDown = () => moveBy(itemsPerRow, true);
    const toggleViewSelectedItem = () => onActivation(activeIndex === selectedIndex ? null : media[selectedIndex]?.id || null);
    useKey(settings.keyNavLeft, selectPrev);
    useKey(settings.keyNavRight, selectNext);
    useKey(settings.keyNavUp, selectUp);
    useKey(settings.keyNavDown, selectDown);
    useKey(settings.keyListViewUp, selectAndViewUp);
    useKey(settings.keyListViewDown, selectAndViewDown);
    useKey(settings.keyListViewLeft, selectAndViewPrev);
    useKey(settings.keyListViewRight, selectAndViewNext);
    useKey(settings.keyListViewToggle, toggleViewSelectedItem);
    useKey(settings.keyNavPageBack, selectPageBack);
    useKey(settings.keyNavPageForward, selectPageForward);
    useKey(settings.keyNavStart, selectFirst);
    useKey(settings.keyNavEnd, selectLast);
    function mediaItem({id, url, thumbnailUrl, extension, isVideo, isGif, replies, size, width, height}, index) {
      let classNames2 = ns("item");
      if (selectedIndex === index)
        classNames2 += ` ${ns("-selected")}`;
      if (activeId === id)
        classNames2 += ` ${ns("-active")}`;
      function onClick(event) {
        event.preventDefault();
        setSelectedIndex(index);
        onActivation(media[index]?.id || null);
      }
      let metaStr = size;
      if (width && height) {
        const widthAndHeight = `${width}\xD7${height}`;
        metaStr = size ? `${size}, ${widthAndHeight}` : widthAndHeight;
      }
      return h("div", {key: url, class: classNames2}, [
        h("a", {href: url, onClick}, h("img", {src: thumbnailUrl})),
        metaStr && h("span", {class: ns("meta"), onClick: () => setSelectedIndex(index)}, metaStr),
        (isVideo || isGif) && h("span", {class: ns("video-type")}, null, extension),
        replies != null && replies > 0 && h("span", {class: ns("replies")}, null, Array(replies).fill(h("span", null)))
      ]);
    }
    let classNames = ns("MediaList");
    if (settings.thumbnailFit === "cover")
      classNames += ` ${ns("-thumbnail-fit-cover")}`;
    return h("div", {class: classNames, ref: containerRef}, [
      h("div", {class: ns("list"), ref: listRef}, media.map(mediaItem)),
      h("div", {class: ns("status-bar")}, [
        h(SideNav, {active: sideView, onActive: onOpenSideView}),
        h("div", {class: ns("position")}, [
          h("span", {class: ns("current")}, selectedIndex ? selectedIndex + 1 : 0),
          h("span", {class: ns("separator")}, "/"),
          h("span", {class: ns("total")}, media.length)
        ])
      ]),
      !isDragged && h("div", {class: ns("dragger-x"), ["data-direction"]: "ew", onMouseDown: initiateResize}),
      !isDragged && h("div", {class: ns("dragger-y"), ["data-direction"]: "ns", onMouseDown: initiateResize}),
      !isDragged && h("div", {class: ns("dragger-xy"), ["data-direction"]: "nwse", onMouseDown: initiateResize})
    ]);
  }
  MediaList.styles = `
/* Scrollbars in chrome since it doesn't support scrollbar-width */
.${ns("MediaList")} > .${ns("list")}::-webkit-scrollbar {
	width: 10px;
	background-color: transparent;
}
.${ns("MediaList")} > .${ns("list")}::-webkit-scrollbar-track {
	border: 0;
	background-color: transparent;6F6F70
}
.${ns("MediaList")} > .${ns("list")}::-webkit-scrollbar-thumb {
	border: 0;
	background-color: #6f6f70;
}

.${ns("MediaList")} {
	--item-border-size: 2px;
	--item-meta-height: 18px;
	--list-meta-height: 24px;
	--active-color: #fff;
	--thumbnail-fit: contain;
	position: absolute;
	top: 0;
	left: 0;
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 1fr var(--list-meta-height);
	width: var(--media-list-width);
	height: var(--media-list-height);
	background: #111;
	box-shadow: 0px 0px 0 3px #0003;
}
.${ns("MediaList")}.${ns("-thumbnail-fit-cover")} { --thumbnail-fit: cover; }
.${ns("MediaList")} > .${ns("dragger-x")} {
	position: absolute;
	left: 100%; top: 0;
	width: 12px; height: 100%;
	cursor: ew-resize;
	z-index: 2;
}
.${ns("MediaList")} > .${ns("dragger-y")} {
	position: absolute;
	top: 100%; left: 0;
	width: 100%; height: 12px;
	cursor: ns-resize;
	z-index: 2;
}
.${ns("MediaList")} > .${ns("dragger-xy")} {
	position: absolute;
	bottom: -10px; right: -10px;
	width: 20px; height: 20px;
	cursor: nwse-resize;
	z-index: 2;
}
.${ns("MediaList")} > .${ns("list")} {
	display: grid;
	grid-template-columns: repeat(var(--media-list-items-per-row), 1fr);
	grid-auto-rows: var(--media-list-item-height);
	overflow-y: scroll;
	overflow-x: hidden;
	scrollbar-width: thin;
}
.${ns("MediaList")} > .${ns("list")} > .${ns("item")} {
	position: relative;
	background: none;
	border: var(--item-border-size) solid transparent;
	padding: 0;
	background-color: #222;
	background-clip: padding-box;
	outline: none;
}
.${ns("MediaList")} > .${ns("list")} > .${ns("item")}.${ns("-selected")} {
	border-color: var(--active-color);
}
.${ns("MediaList")} > .${ns("list")} > .${ns("item")}.${ns("-active")} {
	background-color: var(--active-color);
}
.${ns("MediaList")} > .${ns("list")} > .${ns("item")}.${ns("-selected")}:after {
	content: '';
	display: block;
	position: absolute;
	top: 0; left: 0;
	width: 100%;
	height: 100%;
	border: 2px solid #222a;
	pointer-events: none;
}
.${ns("MediaList")} > .${ns("list")} > .${ns("item")} img {
	display: block;
	width: 100%;
	height: calc(var(--media-list-item-height) - var(--item-meta-height) - (var(--item-border-size) * 2));
	background-clip: padding-box;
	object-fit: var(--thumbnail-fit);
}
.${ns("MediaList")} > .${ns("list")} > .${ns("item")}.${ns("-active")} img {
	border: 1px solid transparent;
	border-bottom: 0;
}
.${ns("MediaList")} > .${ns("list")} > .${ns("item")} > .${ns("meta")} {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: var(--item-meta-height);
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: calc(var(--item-meta-height) * 0.71);
	line-height: 1;
	background: #0003;
	text-shadow: 1px 1px #0003, -1px -1px #0003, 1px -1px #0003, -1px 1px #0003,
		0px 1px #0003, 0px -1px #0003, 1px 0px #0003, -1px 0px #0003;
	white-space: nowrap;
	overflow: hidden;
}
.${ns("MediaList")} > .${ns("list")} > .${ns("item")}.${ns("-active")} > .${ns("meta")} {
	color: #222;
	text-shadow: none;
	background: #0001;
}
.${ns("MediaList")} > .${ns("list")} > .${ns("item")} > .${ns("video-type")} {
	display: block;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: .5em .5em;
	font-size: 12px !important;
	text-transform: uppercase;
	font-weight: bold;
	line-height: 1;
	color: #222;
	background: #eeeeee88;
	border-radius: 2px;
	border: 1px solid #0000002e;
	background-clip: padding-box;
	pointer-events: none;
}
.${ns("MediaList")} > .${ns("list")} > .${ns("item")} > .${ns("replies")} {
	display: block;
	position: absolute;
	bottom: calc(var(--item-meta-height) + 2px);
	left: 0;
	width: 100%;
	display: flex;
	justify-content: center;
	flex-wrap: wrap-reverse;
	pointer-events: none;
}
.${ns("MediaList")} > .${ns("list")} > .${ns("item")} > .${ns("replies")} > span {
	display: block;
	width: 6px;
	height: 6px;
	margin: 1px;
	background: var(--active-color);
	background-clip: padding-box;
	border: 1px solid #0008;
}
.${ns("MediaList")} > .${ns("status-bar")} {
	display: grid;
	grid-template-columns: 1fr auto;
	grid-template-rows: 1fr;
	margin: 0 2px;
	font-size: calc(var(--list-meta-height) * 0.64);
}
.${ns("MediaList")} > .${ns("status-bar")} > * {
	display: flex;
	align-items: center;
}
.${ns("MediaList")} > .${ns("status-bar")} > .${ns("position")} {
	margin: 0 .4em;
}
.${ns("MediaList")} > .${ns("status-bar")} > .${ns("position")} > .${ns("current")} {
	font-weight: bold;
}
.${ns("MediaList")} > .${ns("status-bar")} > .${ns("position")} > .${ns("separator")} {
	font-size: 1.05em;
	margin: 0 0.15em;
}
`;

  // src/components/ErrorBox.ts
  function ErrorBox({error, message}) {
    const code = error?.code;
    const msg = error?.message || message;
    return h("div", {class: ns("ErrorBox")}, [
      code != null && h("h1", null, `Error code: ${code}`),
      h("pre", null, h("code", null, `${msg ?? "Unknown error"}`))
    ]);
  }
  ErrorBox.styles = `
.${ns("ErrorBox")} {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2em 2.5em;
	background: #a34;
	color: #fff;
}
.${ns("ErrorBox")} > h1 { font-size: 1.2em; margin: 0 0 1em; }
.${ns("ErrorBox")} > pre { margin: 0; }
`;

  // src/components/Spinner.ts
  function Spinner() {
    return h("div", {class: ns("Spinner")});
  }
  Spinner.styles = `
.${ns("Spinner")} {
	width: 1.6em;
	height: 1.6em;
}
.${ns("Spinner")}::after {
	content: '';
	display: block;
	width: 100%;
	height: 100%;
	animation: Spinner-rotate 500ms infinite linear;
	border: 0.1em solid #fffa;
	border-right-color: #1d1f21aa;
	border-left-color: #1d1f21aa;
	border-radius: 50%;
}

@keyframes Spinner-rotate {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
`;

  // src/components/MediaImage.ts
  var {min: min2, max: max2, round: round3} = Math;
  function MediaImage({
    url,
    expand = false,
    upscaleThreshold = 0,
    upscaleLimit = 2,
    onExpandChange
  }) {
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [zoomPan, setZoomPan] = useState(false);
    const [containerWidth, containerHeight] = useElementSize(containerRef);
    useLayoutEffect(() => {
      const image = imageRef.current;
      if (error || !image)
        return;
      let checkId = null;
      const check = () => {
        if (image.naturalWidth > 0)
          setIsLoading(false);
        else
          checkId = setTimeout(check, 50);
      };
      setError(null);
      setIsLoading(true);
      check();
      return () => checkId != null && clearTimeout(checkId);
    }, [url, error]);
    useLayoutEffect(() => {
      const image = imageRef.current;
      if (!expand || isLoading || !image || !containerWidth || !containerHeight)
        return;
      const naturalWidth = image.naturalWidth;
      const naturalHeight = image.naturalHeight;
      if (naturalWidth < containerWidth * upscaleThreshold && naturalHeight < containerHeight * upscaleThreshold) {
        const windowAspectRatio = containerWidth / containerHeight;
        const videoAspectRatio = naturalWidth / naturalHeight;
        let newHeight, newWidth;
        if (windowAspectRatio > videoAspectRatio) {
          newHeight = min2(naturalHeight * upscaleLimit, containerHeight);
          newWidth = round3(naturalWidth * (newHeight / naturalHeight));
        } else {
          newWidth = min2(naturalWidth * upscaleLimit, containerWidth);
          newHeight = round3(naturalHeight * (newWidth / naturalWidth));
        }
        image.setAttribute("width", `${newWidth}`);
        image.setAttribute("height", `${newHeight}`);
      }
      return () => {
        image.removeAttribute("width");
        image.removeAttribute("height");
      };
    }, [isLoading, url, expand, upscaleThreshold, upscaleLimit, containerWidth, containerHeight]);
    useLayoutEffect(() => {
      const container = containerRef.current;
      const image = imageRef.current;
      if (!image || !container)
        return;
      const handleMouseDown = (event) => {
        if (event.button !== 0)
          return;
        if (!expand) {
          onExpandChange?.(true);
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        let pointerInit = null;
        let left = 0;
        let top = 0;
        const previewRect = image.getBoundingClientRect();
        const zoomFactor = image.naturalWidth / previewRect.width;
        const cursorAnchorX = previewRect.left + previewRect.width / 2;
        const cursorAnchorY = previewRect.top + previewRect.height / 2;
        const availableWidth = container.clientWidth;
        const availableHeight = container.clientHeight;
        const dragWidth = max2((previewRect.width - availableWidth / zoomFactor) / 2, 0);
        const dragHeight = max2((previewRect.height - availableHeight / zoomFactor) / 2, 0);
        const zoomMargin = 10;
        const translateWidth = max2((image.naturalWidth - availableWidth) / 2, 0);
        const translateHeight = max2((image.naturalHeight - availableHeight) / 2, 0);
        const minLeft = -translateWidth - zoomMargin;
        const maxLeft = translateWidth + zoomMargin;
        const minTop = -translateHeight - zoomMargin;
        const maxTop = translateHeight + zoomMargin;
        Object.assign(image.style, {
          maxWidth: "none",
          maxHeight: "none",
          width: "auto",
          height: "auto",
          position: "fixed",
          top: "50%",
          left: "50%"
        });
        const applyPosition = (newLeft, newTop) => {
          left = round3(min2(max2(newLeft, minLeft), maxLeft));
          top = round3(min2(max2(newTop, minTop), maxTop));
          image.style.transform = `translate(-50%, -50%) translate(${left}px, ${top}px)`;
        };
        const handleMouseMove = (event2) => {
          event2.preventDefault();
          event2.stopPropagation();
          if (pointerInit?.click && Math.hypot(event2.x - pointerInit.x, event2.y - pointerInit.y) > 5) {
            pointerInit.click = false;
          }
          panTo(event2);
        };
        const panTo = ({x, y}) => {
          const dragFactorX = dragWidth > 0 ? -((x - cursorAnchorX) / dragWidth) : 0;
          const dragFactorY = dragHeight > 0 ? -((y - cursorAnchorY) / dragHeight) : 0;
          applyPosition(dragFactorX * translateWidth, dragFactorY * translateHeight);
        };
        const handleMouseUp = () => {
          if (!pointerInit)
            return;
          image.style.cssText = "";
          window.removeEventListener("mouseup", handleMouseUp);
          window.removeEventListener("mousemove", handleMouseMove);
          setZoomPan(false);
          if (pointerInit?.click)
            onExpandChange?.(!expand);
        };
        pointerInit = {time: Date.now(), x: event.x, y: event.y, click: true};
        const _pointerInit = pointerInit;
        setTimeout(() => _pointerInit.click = false, 160);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);
        setZoomPan(true);
        panTo(pointerInit);
      };
      container.addEventListener("mousedown", handleMouseDown);
      return () => {
        container.removeEventListener("mousedown", handleMouseDown);
      };
    }, [expand]);
    if (error)
      return h(ErrorBox, {error});
    let classNames = ns("MediaImage");
    if (isLoading)
      classNames += ` ${ns("-loading")}`;
    if (zoomPan)
      classNames += ` ${ns("-zoom-pan")}`;
    return h("div", {class: classNames, ref: containerRef}, isLoading && h(Spinner, null), h("img", {
      ref: imageRef,
      onError: () => setError(new Error("Image failed to load")),
      src: url
    }));
  }
  MediaImage.styles = `
.${ns("MediaImage")} {
	display: flex;
	align-items: center;
	justify-content: center;
	background: #000d;
}
.${ns("MediaImage")}.${ns("-zoom-pan")} {
	position: fixed;
	top: 0; left: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
}
.${ns("MediaImage")} > .${ns("Spinner")} {
	position: absolute;
	top: 50%; left: 50%;
	transform: translate(-50%, -50%);
	font-size: 2em;
}
.${ns("MediaImage")} > img {
	display: block;
	max-width: 100%;
	max-height: 100vh;
}
.${ns("MediaImage")}.${ns("-loading")} > img {
	min-width: 200px;
	min-height: 200px;
	opacity: 0;
}
`;

  // src/components/MediaVideo.ts
  var {min: min3, max: max3, round: round4} = Math;
  function MediaVideo({
    url,
    expand = false,
    upscaleThreshold = 0.5,
    upscaleLimit = 2
  }) {
    const settings = useSettings();
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const volumeRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasAudio, setHasAudio] = useState(false);
    const [isFastForward, setIsFastForward] = useState(false);
    const [error, setError] = useState(null);
    const [containerWidth, containerHeight] = useElementSize(containerRef);
    const [speed, setSpeed] = useState(1);
    useLayoutEffect(() => {
      const video = videoRef.current;
      if (error || !video)
        return;
      let checkId = null;
      const check = () => {
        if (video?.videoHeight > 0) {
          setHasAudio(video.audioTracks?.length > 0 || video.mozHasAudio);
          setIsLoading(false);
        } else {
          checkId = setTimeout(check, 50);
        }
      };
      setError(null);
      setIsLoading(true);
      setHasAudio(false);
      setIsFastForward(false);
      check();
      return () => checkId != null && clearTimeout(checkId);
    }, [url, error]);
    useLayoutEffect(() => {
      const container = containerRef.current;
      const video = videoRef.current;
      if (!expand || isLoading || !video || !container || !containerWidth || !containerHeight)
        return;
      const naturalWidth = video.videoWidth;
      const naturalHeight = video.videoHeight;
      if (naturalWidth < containerWidth * upscaleThreshold && naturalHeight < containerHeight * upscaleThreshold) {
        const windowAspectRatio = containerWidth / containerHeight;
        const videoAspectRatio = naturalWidth / naturalHeight;
        let newHeight, newWidth;
        if (windowAspectRatio > videoAspectRatio) {
          newHeight = min3(naturalHeight * upscaleLimit, containerHeight);
          newWidth = round4(naturalWidth * (newHeight / naturalHeight));
        } else {
          newWidth = min3(naturalWidth * upscaleLimit, containerWidth);
          newHeight = round4(naturalHeight * (newWidth / naturalWidth));
        }
        video.style.cssText = `width:${newWidth}px;height:${newHeight}px`;
      }
      return () => {
        video.style.cssText = "";
      };
    }, [isLoading, url, expand, upscaleThreshold, upscaleLimit, containerWidth, containerHeight]);
    function initializeVolumeDragging(event) {
      const volume = volumeRef.current;
      if (event.button !== 0 || !volume)
        return;
      event.preventDefault();
      event.stopPropagation();
      const pointerTimelineSeek = throttle((moveEvent) => {
        let {top, height} = getBoundingDocumentRect(volume);
        let pos = min3(max3(1 - (moveEvent.pageY - top) / height, 0), 1);
        settings.volume = round4(pos / settings.adjustVolumeBy) * settings.adjustVolumeBy;
      }, 100);
      function unbind() {
        window.removeEventListener("mousemove", pointerTimelineSeek);
        window.removeEventListener("mouseup", unbind);
      }
      window.addEventListener("mousemove", pointerTimelineSeek);
      window.addEventListener("mouseup", unbind);
      pointerTimelineSeek(event);
    }
    function handleContainerWheel(event) {
      event.preventDefault();
      event.stopPropagation();
      settings.volume = min3(max3(settings.volume + settings.adjustVolumeBy * (event.deltaY > 0 ? -1 : 1), 0), 1);
    }
    const playPause = () => {
      const video = videoRef.current;
      if (video) {
        if (video.paused || video.ended)
          video.play();
        else
          video.pause();
      }
    };
    const flashVolume = useMemo(() => {
      let timeoutId = null;
      return () => {
        const volume = volumeRef.current;
        if (timeoutId)
          clearTimeout(timeoutId);
        if (volume)
          volume.style.opacity = "1";
        timeoutId = setTimeout(() => {
          if (volume)
            volume.style.cssText = "";
        }, 400);
      };
    }, []);
    useKey(settings.keyViewPause, playPause);
    useKey(settings.keyViewSeekBack, () => {
      const video = videoRef.current;
      if (video)
        video.currentTime = max3(video.currentTime - settings.seekBy, 0);
    });
    useKey(settings.keyViewSeekForward, () => {
      const video = videoRef.current;
      if (video)
        video.currentTime = min3(video.currentTime + settings.seekBy, video.duration);
    });
    useKey(settings.keyViewTinySeekBack, () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = max3(video.currentTime - settings.tinySeekBy, 0);
      }
    });
    useKey(settings.keyViewTinySeekForward, () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = min3(video.currentTime + settings.tinySeekBy, video.duration);
      }
    });
    useKey(settings.keyViewVolumeDown, () => {
      settings.volume = max3(settings.volume - settings.adjustVolumeBy, 0);
      flashVolume();
    });
    useKey(settings.keyViewVolumeUp, () => {
      settings.volume = min3(settings.volume + settings.adjustVolumeBy, 1);
      flashVolume();
    });
    useKey(settings.keyViewSpeedDown, () => setSpeed((speed2) => Math.max(settings.adjustSpeedBy, speed2 - settings.adjustSpeedBy)));
    useKey(settings.keyViewSpeedUp, () => setSpeed((speed2) => speed2 + settings.adjustSpeedBy));
    useKey(settings.keyViewSpeedReset, () => setSpeed(1));
    useKey(settings.keyViewFastForward, (event) => {
      if (event.repeat)
        return;
      if (settings.fastForwardActivation === "hold") {
        setIsFastForward(true);
        window.addEventListener("keyup", () => setIsFastForward(false), {once: true});
      } else {
        setIsFastForward((value) => !value);
      }
    });
    for (let index of [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]) {
      useKey(settings[`keyViewSeekTo${index * 10}`], () => {
        const video = videoRef.current;
        if (video) {
          if (video.duration > 0)
            video.currentTime = video.duration * (index / 10);
        }
      });
    }
    if (error)
      return h(ErrorBox, {error});
    let classNames = ns("MediaVideo");
    if (isLoading)
      classNames += ` ${ns("-loading")}`;
    return h("div", {
      class: classNames,
      ref: containerRef,
      onMouseDown: ({button}) => button === 0 && playPause(),
      onWheel: handleContainerWheel
    }, [
      isLoading && h(Spinner, null),
      h("video", {
        ref: videoRef,
        autoplay: true,
        preload: false,
        controls: false,
        loop: true,
        volume: settings.volume,
        playbackRate: isFastForward ? settings.fastForwardRate : speed,
        onError: () => setError(new Error("Video failed to load")),
        src: url
      }),
      h(VideoTimeline, {videoRef}),
      h("div", {class: `${ns("controls")} ${ns("-bottom-center")}`}, [
        h("button", {
          onMouseDown: prevented((event) => event.button === 0 && setSpeed(1)),
          class: speed === 1 ? ns("active") : void 0
        }, "1x"),
        h("button", {
          onMouseDown: prevented((event) => event.button === 0 && setSpeed(1.5)),
          class: speed === 1.5 ? ns("active") : void 0
        }, "1.5x"),
        h("button", {
          onMouseDown: prevented((event) => event.button === 0 && setSpeed(2)),
          class: speed === 2 ? ns("active") : void 0
        }, "2x")
      ]),
      h("div", {
        class: ns("volume"),
        ref: volumeRef,
        onMouseDown: initializeVolumeDragging,
        style: hasAudio ? "display: hidden" : ""
      }, h("div", {
        class: ns("bar"),
        style: `height: ${Number(settings.volume) * 100}%`
      })),
      speed !== 1 && h("div", {class: ns("speed")}, `${speed.toFixed(2)}x`)
    ]);
  }
  function VideoTimeline({videoRef}) {
    const settings = useSettings();
    const [state, setState] = useState({progress: 0, elapsed: 0, remaining: 0, duration: 0});
    const [bufferedRanges, setBufferedRanges] = useState([]);
    const timelineRef = useRef(null);
    useEffect(() => {
      const video = videoRef.current;
      const timeline = timelineRef.current;
      if (!video || !timeline)
        return;
      const handleTimeupdate = () => {
        setState({
          progress: video.currentTime / video.duration,
          elapsed: video.currentTime,
          remaining: video.duration - video.currentTime,
          duration: video.duration
        });
      };
      const handleMouseDown = (event) => {
        if (event.button !== 0)
          return;
        event.preventDefault();
        event.stopPropagation();
        const wasPaused = video.paused;
        const pointerTimelineSeek = throttle((mouseEvent) => {
          video.pause();
          let {left, width} = getBoundingDocumentRect(timeline);
          let pos = min3(max3((mouseEvent.pageX - left) / width, 0), 1);
          video.currentTime = pos * video.duration;
        }, 100);
        const unbind = () => {
          window.removeEventListener("mousemove", pointerTimelineSeek);
          window.removeEventListener("mouseup", unbind);
          pointerTimelineSeek.flush();
          if (!wasPaused)
            video.play();
        };
        window.addEventListener("mousemove", pointerTimelineSeek);
        window.addEventListener("mouseup", unbind);
        pointerTimelineSeek(event);
      };
      const handleWheel = (event) => {
        event.preventDefault();
        event.stopPropagation();
        video.currentTime = video.currentTime + 5 * (event.deltaY > 0 ? 1 : -1);
      };
      const handleProgress = () => {
        const buffer = video.buffered;
        const duration = video.duration;
        const ranges = [];
        for (let i = 0; i < buffer.length; i++) {
          ranges.push({
            start: buffer.start(i) / duration,
            end: buffer.end(i) / duration
          });
        }
        setBufferedRanges(ranges);
      };
      const progressInterval = setInterval(() => {
        handleProgress();
        if (video.buffered.length > 0 && video.buffered.end(video.buffered.length - 1) == video.duration) {
          clearInterval(progressInterval);
        }
      }, 200);
      video.addEventListener("timeupdate", handleTimeupdate);
      timeline.addEventListener("wheel", handleWheel);
      timeline.addEventListener("mousedown", handleMouseDown);
      return () => {
        video.removeEventListener("timeupdate", handleTimeupdate);
        timeline.removeEventListener("wheel", handleWheel);
        timeline.removeEventListener("mousedown", handleMouseDown);
      };
    }, []);
    const elapsedTime = formatSeconds(state.elapsed);
    const totalTime = settings.endTimeFormat === "total" ? formatSeconds(state.duration) : `-${formatSeconds(state.remaining)}`;
    return h("div", {class: ns("timeline"), ref: timelineRef}, [
      ...bufferedRanges.map(({start, end}) => h("div", {
        class: ns("buffered-range"),
        style: {
          left: `${start * 100}%`,
          right: `${100 - end * 100}%`
        }
      })),
      h("div", {class: ns("elapsed")}, elapsedTime),
      h("div", {class: ns("total")}, totalTime),
      h("div", {class: ns("progress"), style: `width: ${state.progress * 100}%`}, [
        h("div", {class: ns("elapsed")}, elapsedTime),
        h("div", {class: ns("total")}, totalTime)
      ])
    ]);
  }
  MediaVideo.styles = `
.${ns("MediaVideo")} {
	--timeline-max-size: 40px;
	--timeline-min-size: 20px;
	position: relative;
	display: flex;
	max-width: 100%;
	max-height: 100vh;
	align-items: center;
	justify-content: center;
	background: #000d;
}
.${ns("MediaVideo")} > .${ns("Spinner")} {
	position: absolute;
	top: 50%; left: 50%;
	transform: translate(-50%, -50%);
	font-size: 2em;
}
.${ns("MediaVideo")} > video {
	display: block;
	max-width: 100%;
	max-height: calc(100vh - var(--timeline-min-size));
	margin: 0 auto var(--timeline-min-size);
	outline: none;
	background: #000d;
}
.${ns("MediaVideo")}.${ns("-loading")} > video {
	min-width: 200px;
	min-height: 200px;
	opacity: 0;
}
.${ns("MediaView")} .${ns("MediaVideo")} > .${ns("controls")}.${ns("-bottom-center")} {
	bottom: var(--timeline-max-size);
}
.${ns("MediaVideo")} > .${ns("timeline")} {
	position: absolute;
	left: 0; bottom: 0;
	width: 100%;
	height: var(--timeline-max-size);
	font-size: 14px !important;
	line-height: 1;
	color: #eee;
	background: #111c;
	border: 1px solid #111c;
	transition: height 100ms ease-out;
	user-select: none;
}
.${ns("MediaVideo")}:not(:hover) > .${ns("timeline")} {
	height: var(--timeline-min-size);
}
.${ns("MediaVideo")} > .${ns("timeline")} > .${ns("buffered-range")} {
	position: absolute;
	bottom: 0;
	height: 100%;
	background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAFUlEQVQImWNgQAL/////TyqHgYEBAB5CD/FVFp/QAAAAAElFTkSuQmCC') left bottom repeat;
	opacity: .17;
	transition: right 200ms ease-out;
}
.${ns("MediaVideo")} > .${ns("timeline")} > .${ns("progress")} {
	height: 100%;
	background: #eee;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
.${ns("MediaVideo")} > .${ns("timeline")} .${ns("elapsed")},
.${ns("MediaVideo")} > .${ns("timeline")} .${ns("total")} {
	position: absolute;
	top: 0;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 .2em;
	text-shadow: 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000, 0px 1px #000, 0px -1px #000, 1px 0px #000, -1px 0px #000;
	pointer-events: none;
}
.${ns("MediaVideo")} > .${ns("timeline")} .${ns("elapsed")} {left: 0;}
.${ns("MediaVideo")} > .${ns("timeline")} .${ns("total")} {right: 0;}
.${ns("MediaVideo")} > .${ns("timeline")} > .${ns("progress")} .${ns("elapsed")},
.${ns("MediaVideo")} > .${ns("timeline")} > .${ns("progress")} .${ns("total")} {
	color: #111;
	text-shadow: none;
}

.${ns("MediaVideo")} > .${ns("volume")} {
	position: absolute;
	right: 10px;
	top: calc(25% - var(--timeline-min-size));
	width: 30px;
	height: 50%;
	background: #111c;
	border: 1px solid #111c;
	transition: opacity 100ms linear;
}
.${ns("MediaVideo")}:not(:hover) > .${ns("volume")} {opacity: 0;}
.${ns("MediaVideo")} > .${ns("volume")} > .${ns("bar")} {
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	background: #eee;
}
.${ns("MediaVideo")} > .${ns("speed")} {
	position: absolute;
	left: 10px;
	top: 10px;
	padding: .5em .7em;
	font-size: 0.9em;
	font-family: "Lucida Console", Monaco, monospace;
	color: #fff;
	text-shadow: 1px 1px 0 #000a, -1px -1px 0 #000a, -1px 1px 0 #000a, 1px -1px 0 #000a, 0 1px 0 #000a, 1px 0 0 #000a;
}
`;

  // src/components/MediaView.ts
  function MediaView({media: {url, isVideo}, onClose}) {
    const settings = useSettings();
    const containerRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);
    useKey(settings.keyViewClose, onClose);
    useKey(settings.keyViewFullPage, (event) => {
      event.preventDefault();
      if (event.repeat)
        return;
      if (isExpanded) {
        setIsExpanded(false);
        return;
      }
      const initTime = Date.now();
      setIsExpanded(true);
      window.addEventListener("keyup", () => Date.now() - initTime > settings.holdTimeThreshold && setIsExpanded(false), {once: true});
    });
    let classNames = ns("MediaView");
    if (isExpanded)
      classNames += ` ${ns("-expanded")}`;
    return h("div", {class: classNames, ref: containerRef}, [
      isVideo ? h(MediaVideo, {
        key: url,
        url,
        expand: isExpanded,
        upscaleThreshold: settings.fpmVideoUpscaleThreshold,
        upscaleLimit: settings.fpmVideoUpscaleLimit
      }) : h(MediaImage, {
        key: url,
        url,
        expand: isExpanded,
        onExpandChange: setIsExpanded,
        upscaleThreshold: settings.fpmImageUpscaleThreshold,
        upscaleLimit: settings.fpmImageUpscaleLimit
      }),
      h("div", {class: `${ns("controls")} ${ns("-top-right")}`}, [
        h("button", {
          onMouseDown: prevented((event) => event.button === 0 && setIsExpanded((isExpanded2) => !isExpanded2)),
          class: isExpanded ? ns("active") : void 0,
          title: "Toggle full page mode"
        }, "\u26F6"),
        h("button", {
          onMouseDown: prevented((event) => event.button === 0 && onClose()),
          title: `Close (mouse gesture down, or ${settings.keyViewClose})`
        }, "\u2715")
      ])
    ]);
  }
  MediaView.styles = `
.${ns("MediaView")} {
	position: absolute;
	top: 0; right: 0;
	max-width: calc(100% - var(--media-list-width));
	max-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	align-content: center;
	justify-content: center;
}
.${ns("MediaView")} > * {
	width: 100%;
	height: 100%;
	max-width: 100%;
	max-height: 100vh;
}
.${ns("MediaView")}.${ns("-expanded")} {
	max-width: 100%;
	width: 100vw;
	height: 100vh;
	z-index: 1000;
}
.${ns("MediaView")} > .${ns("ErrorBox")} { min-height: 200px; }
.${ns("MediaView")} .${ns("controls")} {
	display: flex;
	gap: 2px;
	position: absolute;
	width: auto;
	height: auto;
	transition: all 100ms linear;
}
.${ns("MediaView")}:not(:hover) .${ns("controls")} {
	opacity: 0;
}
.${ns("MediaView")} .${ns("controls")}.${ns("-bottom-center")} {
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	margin-bottom: 5px;
}
.${ns("MediaView")} .${ns("controls")}.${ns("-top-right")} {
	top: 0;
	right: 0;
	margin: 5px 5px 0 0;
}
.${ns("MediaView")} .${ns("controls")} > button {
	display: table-cell;
	height: 24px;
	margin: 0;
	padding: 0 6px;
	border: 0;
	vertical-align: middle;
	text-align: center;
	flex: 0 0 auto;
	color: #fff;
	background: #222b;
	border-radius: 2px;
	font-size: 14px;
	text-shadow: 1px 1px 0 #000d, -1px -1px 0 #000d, -1px 1px 0 #000d, 1px -1px 0 #000d;
}
.${ns("MediaView")} .${ns("controls")} > button:hover {
	color: #fff;
	background: #666b;
}
.${ns("MediaView")} .${ns("controls")} > button.${ns("active")} {
	color: #111;
	background: #eee;
	text-shadow: none;
}
`;

  // src/components/ThreadMediaViewer.ts
  var {round: round5} = Math;
  function ThreadMediaViewer({settings, watcher, onOpen}) {
    const containerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [sideView, setSideView] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const [windowWidth] = useWindowDimensions();
    const forceUpdate = useForceUpdate();
    useEffect(() => {
      return watcher.subscribe(forceUpdate);
    }, [watcher]);
    useEffect(() => {
      return settings._subscribe(forceUpdate);
    }, [settings]);
    useEffect(() => {
      const container = containerRef.current;
      if (container) {
        const cappedListWidth = clamp(300, settings.mediaListWidth, window.innerWidth - 300);
        container.style.setProperty("--media-list-width", `${cappedListWidth}px`);
        const itemHeight = round5((cappedListWidth - 10) / settings.mediaListItemsPerRow);
        container.style.setProperty("--media-list-item-height", `${itemHeight}px`);
        const cappedListHeight = clamp(200 / window.innerHeight, settings.mediaListHeight, 1 - 200 / window.innerHeight);
        container.style.setProperty("--media-list-height", `${cappedListHeight * 100}vh`);
        container.style.setProperty("--media-list-items-per-row", `${settings.mediaListItemsPerRow}`);
      }
    }, [windowWidth, settings.mediaListWidth, settings.mediaListHeight, settings.mediaListItemsPerRow]);
    useEffect(() => {
      function handleClick(event) {
        const target = event.target;
        if (!isOfType(target, !!target && "closest" in target))
          return;
        const url = target?.closest("a")?.href;
        if (!url)
          return;
        const item = watcher.media.find((media) => media.url === url);
        if (item) {
          event.stopPropagation();
          event.preventDefault();
          setActiveId(item.id);
          if (event.shiftKey)
            setIsOpen(true);
        }
      }
      watcher.container.addEventListener("click", handleClick);
      return () => {
        watcher.container.removeEventListener("click", handleClick);
      };
    }, []);
    const closeSideView = () => setSideView(null);
    const closeMediaView = () => setActiveId(null);
    function toggleList() {
      let newIsOpen = !isOpen;
      setSideView(null);
      setIsOpen(newIsOpen);
      if (newIsOpen)
        onOpen?.();
    }
    function onOpenSideView(newView) {
      setSideView((view) => view === newView ? null : newView);
    }
    useKey(settings.keyToggleUI, toggleList);
    useGesture("up", toggleList);
    useGesture("down", closeMediaView);
    let SideViewContent;
    if (sideView === "help")
      SideViewContent = Help;
    if (sideView === "settings")
      SideViewContent = Settings;
    if (sideView === "changelog")
      SideViewContent = Changelog;
    const activeItem = activeId ? watcher.mediaByID.get(activeId) : null;
    return h(SettingsProvider, {value: settings}, h("div", {class: `${ns("ThreadMediaViewer")} ${isOpen ? ns("-is-open") : ""}`, ref: containerRef}, [
      isOpen && h(MediaList, {
        media: watcher.media,
        activeId,
        sideView,
        onActivation: setActiveId,
        onOpenSideView
      }),
      SideViewContent != null && h(SideView, {key: sideView, onClose: closeSideView}, h(SideViewContent, null)),
      activeItem && h(MediaView, {media: activeItem, onClose: closeMediaView})
    ]));
  }
  ThreadMediaViewer.styles = `
.${ns("ThreadMediaViewer")} {
	--media-list-width: 640px;
	--media-list-height: 50vh;
	--media-list-items-per-row: 3;
	--media-list-item-height: 160px;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 0;
}
`;

  // src/components/CatalogNavigator.ts
  var {min: min4, max: max4, sqrt, pow} = Math;
  var get2DDistance = (ax, ay, bx, by) => sqrt(pow(ax - bx, 2) + pow(ay - by, 2));
  function CatalogNavigator({settings, watcher}) {
    const catalogContainerRef = useRef(watcher.container);
    const itemsPerRow = useItemsPerRow(catalogContainerRef);
    const cursorRef = useRef(null);
    const [sideView, setSideView] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const forceUpdate = useForceUpdate();
    const [windowWidth, windowHeight] = useWindowDimensions();
    const selectedThread = selectedIndex != null ? watcher.threads[selectedIndex] : void 0;
    const enabled = settings.catalogNavigator;
    useEffect(() => watcher.subscribe(forceUpdate), [watcher]);
    useEffect(() => settings._subscribe(forceUpdate), [settings]);
    useEffect(() => {
      if (selectedThread && !enabled) {
        setSelectedIndex(null);
        return;
      }
      if (enabled && !selectedThread && watcher.threads.length > 0) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        let closest = {distance: Infinity, index: null};
        for (let i = 0; i < watcher.threads.length; i++) {
          const rect = watcher.threads[i].container.getBoundingClientRect();
          const distance = get2DDistance(rect.left + rect.width / 2, rect.top + rect.height / 2, centerX, centerY);
          if (distance < closest.distance) {
            closest.distance = distance;
            closest.index = i;
          }
        }
        if (closest.index != null)
          setSelectedIndex(closest.index);
      }
    }, [selectedThread, watcher.threads, enabled]);
    useEffect(() => {
      const cursor = cursorRef.current;
      if (!cursor || !selectedThread || !enabled)
        return;
      const rect = getBoundingDocumentRect(selectedThread.container);
      Object.assign(cursor.style, {
        left: `${rect.left - 4}px`,
        top: `${rect.top - 4}px`,
        width: `${rect.width + 8}px`,
        height: `${rect.height + 8}px`
      });
    }, [selectedThread, watcher.threads, windowWidth, itemsPerRow, enabled]);
    useEffect(() => {
      function handleCLick(event) {
        const target = event.target;
        if (!isOfType(target, !!target && "closest" in target))
          return;
        const threadContainer = target.closest(`${watcher.serializer.selector} > *`);
        if (threadContainer) {
          const index = watcher.threads.findIndex((thread) => thread.container === threadContainer);
          if (index != null)
            setSelectedIndex(index);
        }
      }
      watcher.container.addEventListener("click", handleCLick);
      return () => watcher.container.removeEventListener("click", handleCLick);
    }, [watcher.container]);
    const navToIndex = (index) => {
      const clampedIndex = max4(0, min4(watcher.threads.length - 1, index));
      const selectedThreadContainer = watcher.threads[clampedIndex].container;
      if (selectedThreadContainer) {
        setSelectedIndex(clampedIndex);
        scrollToView(selectedThreadContainer, {block: window.innerHeight / 2 - 200, behavior: "smooth"});
      }
    };
    const navBy = (amount) => selectedIndex != null && navToIndex(selectedIndex + amount);
    const toggleSettings = () => setSideView(sideView ? null : "settings");
    useKey(settings.keyToggleUI, toggleSettings);
    useKey(enabled && settings.keyNavLeft, () => navBy(-1));
    useKey(enabled && settings.keyNavRight, () => navBy(1));
    useKey(enabled && settings.keyNavUp, () => navBy(-itemsPerRow));
    useKey(enabled && settings.keyNavDown, () => navBy(+itemsPerRow));
    useKey(enabled && settings.keyNavPageBack, () => navBy(-itemsPerRow * 3));
    useKey(enabled && settings.keyNavPageForward, () => navBy(+itemsPerRow * 3));
    useKey(enabled && settings.keyNavStart, () => navToIndex(0));
    useKey(enabled && settings.keyNavEnd, () => navToIndex(Infinity));
    useKey(enabled && settings.keyCatalogOpenThread, () => selectedThread && (location.href = selectedThread.url));
    useKey(enabled && settings.keyCatalogOpenThreadInNewTab, () => {
      if (selectedThread)
        GM_openInTab(selectedThread.url, {active: true});
    });
    useKey(settings.keyCatalogOpenThreadInBackgroundTab, () => selectedThread && GM_openInTab(selectedThread.url, {active: false}));
    useGesture("up", toggleSettings);
    let SideViewContent;
    if (sideView === "help")
      SideViewContent = Help;
    if (sideView === "settings")
      SideViewContent = Settings;
    if (sideView === "changelog")
      SideViewContent = Changelog;
    let classNames = ns("CatalogNavigator");
    if (sideView)
      classNames += ` ${ns("-is-open")}`;
    return h(SettingsProvider, {value: settings}, [
      enabled && selectedThread && h("div", {class: ns("CatalogCursor"), ref: cursorRef}),
      SideViewContent && h("div", {class: classNames}, [
        h(SideView, {key: sideView, onClose: () => setSideView(null)}, h(SideViewContent, null)),
        h(SideNav, {active: sideView, onActive: setSideView})
      ])
    ]);
  }
  CatalogNavigator.styles = `
.${ns("CatalogCursor")} {
	position: absolute;
	border: 2px dashed #fff8;
	border-radius: 2px;
	transition: all 66ms cubic-bezier(0.25, 1, 0.5, 1);
	pointer-events: none;
}
.${ns("CatalogCursor")}:before {
	content: '';
	display: block;
	width: 100%;
	height: 100%;
	border: 2px dashed #0006;
	border-radius: 2;
}
.${ns("CatalogNavigator")} {
	--media-list-width: 640px;
	--media-list-height: 50vh;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 0;
}
.${ns("CatalogNavigator")} > .${ns("SideNav")} {
	position: fixed;
	left: 2px;
	bottom: calc(var(--media-list-height) - 0.2em);
	padding: 2px;
	border-radius: 3px;
	background: #161616;
}

`;

  // src/styles.ts
  var componentStyles = [
    ThreadMediaViewer,
    CatalogNavigator,
    ErrorBox,
    MediaImage,
    MediaList,
    MediaVideo,
    MediaView,
    Settings,
    SideNav,
    SideView,
    Spinner
  ].map(({styles}) => styles).join("\n");
  var baseStyles = `
.${ns("CONTAINER")},
.${ns("CONTAINER")} *,
.${ns("CONTAINER")} *:before,
.${ns("CONTAINER")} *:after {
	box-sizing: border-box;
	font-family: inherit;
	line-height: 1.4;
}
.${ns("CONTAINER")} {
	font-family: arial, helvetica, sans-serif;
	font-size: 16px;
	color: #aaa;
}

.${ns("CONTAINER")} a { color: #c4b256 !important; }
.${ns("CONTAINER")} a:hover { color: #fde981 !important; }
.${ns("CONTAINER")} a:active { color: #000 !important; }

.${ns("CONTAINER")} input,
.${ns("CONTAINER")} button {
	box-sizing: border-box;
	display: inline-block;
	vertical-align: middle;
	margin: 0;
	padding: 0 0.3em;
	height: 1.6em;
	font-size: inherit;
	border-radius: 2px;
	filter: none;
}
.${ns("CONTAINER")} input:focus { box-shadow: 0 0 0 3px #fff2; }
.${ns("CONTAINER")} input[type=text] {
	border: 0 !important;
	width: 8em;
	font-family: "Lucida Console", Monaco, monospace;
	color: #222;
	background: #ddd;
}
.${ns("CONTAINER")} input[type=text].small { width: 4em; }
.${ns("CONTAINER")} input[type=text].large { width: 12em; }
.${ns("CONTAINER")} input[type=range] { width: 10em; }
.${ns("CONTAINER")} input[type=radio],
.${ns("CONTAINER")} input[type=range],

.${ns("CONTAINER")} input[type=checkbox] { padding: 0; }
.${ns("CONTAINER")} button {
	color: #fff;
	background: transparent;
	border: 1px solid #333;
}
.${ns("CONTAINER")} button:not(:disabled):hover {
	color: #222;
	background: #fff;
	border-color: #fff;
}
.${ns("CONTAINER")} button:disabled { opacity: .5; border-color: transparent; }

.${ns("CONTAINER")} h1,
.${ns("CONTAINER")} h2,
.${ns("CONTAINER")} h3 { margin: 0; font-weight: normal; color: #fff; }
.${ns("CONTAINER")} * + h1,
.${ns("CONTAINER")} * + h2,
.${ns("CONTAINER")} * + h3 { margin-top: 1em; }
.${ns("CONTAINER")} h1 { font-size: 1.5em !important; }
.${ns("CONTAINER")} h2 { font-size: 1.2em !important; }
.${ns("CONTAINER")} h3 { font-size: 1em !important; font-weight: bold; }

.${ns("CONTAINER")} ul { list-style: square; padding-left: 1em; margin: 1em 0; }
.${ns("CONTAINER")} ul.${ns("-clean")} { list-style: none; }
.${ns("CONTAINER")} li { padding: 0.3em 0; list-style: inherit; }
.${ns("CONTAINER")} code {
	font-family: "Lucida Console", Monaco, monospace;
	padding: 0;
	background-color: transparent;
	color: inherit;
}

.${ns("CONTAINER")} pre { white-space: pre-wrap; }
.${ns("CONTAINER")} kbd {
	padding: .17em .2em;
	font-family: "Lucida Console", Monaco, monospace;
	color: #fff;
	font-size: .95em;
	border-radius: 2px;
	background: #363f44;
	text-shadow: -1px -1px #0006;
	border: 0;
	box-shadow: none;
	line-height: inherit;
}

.${ns("CONTAINER")} dl { margin: 1em 0; }
.${ns("CONTAINER")} dt { font-weight: bold; }
.${ns("CONTAINER")} dd { margin: .1em 0 .8em; color: #888; }
.${ns("CONTAINER")} [title] { cursor: help; }
.${ns("CONTAINER")} .${ns("-muted")} { opacity: .5; }
`;
  GM_addStyle(baseStyles + componentStyles);

  // src/index.ts
  var serializer = SERIALIZERS.find((serializer2) => serializer2.urlMatches.exec(location.host + location.pathname));
  if (serializer) {
    let migratedDefaultSettings;
    try {
      migratedDefaultSettings = {...defaultSettings, ...JSON.parse(localStorage.getItem(ns("settings")))};
    } catch {
      migratedDefaultSettings = defaultSettings;
    }
    const {threadSerializer, catalogSerializer} = serializer;
    const settings = syncedSettings("settings", migratedDefaultSettings);
    let mediaWatcher = null;
    let catalogWatcher = null;
    const container = Object.assign(document.createElement("div"), {className: ns("CONTAINER")});
    document.body.appendChild(container);
    const remountContainer = () => {
      document.body.appendChild(container);
    };
    const refreshMounts = throttle(() => {
      if (mediaWatcher && !document.body.contains(mediaWatcher.container)) {
        render(null, container);
        mediaWatcher.destroy();
        mediaWatcher = null;
      }
      if (catalogWatcher && !document.body.contains(catalogWatcher.container)) {
        render(null, container);
        catalogWatcher.destroy();
        catalogWatcher = null;
      }
      if (!mediaWatcher && !catalogWatcher) {
        if (threadSerializer) {
          try {
            mediaWatcher = new MediaWatcher(threadSerializer);
            render(h(ThreadMediaViewer, {settings, watcher: mediaWatcher, onOpen: remountContainer}), container);
          } catch (error) {
          }
        }
        if (catalogSerializer) {
          try {
            catalogWatcher = new CatalogWatcher(catalogSerializer);
            render(h(CatalogNavigator, {settings, watcher: catalogWatcher}), container);
          } catch (error) {
          }
        }
      }
    }, 100);
    new MutationObserver(refreshMounts).observe(document.body, {childList: true, subtree: true});
    refreshMounts();
  }
})();
