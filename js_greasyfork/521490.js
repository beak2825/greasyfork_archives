// ==UserScript==
// @name         Definable ModMenu
// @namespace    Definable
// @version      0.2.6
// @description  Definable is a modular ModMenu for Drawaria.Online
// @homepage     https://drawaria.online/profile/?uid=63196790-c7da-11ec-8266-c399f90709b7
// @author       ≺ᴄᴜʙᴇ³≻
// @match        https://drawaria.online/
// @match        https://drawaria.online/test
// @match        https://drawaria.online/room/*
// @icon         https://i.ibb.co/8Xb1gXg/Andrew-T-Austin-brightly-lit-tesseract-hypercube.png
// @grant        none
// @license      GNU GPLv3
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/521490/Definable%20ModMenu.user.js
// @updateURL https://update.greasyfork.org/scripts/521490/Definable%20ModMenu.meta.js
// ==/UserScript==

(() => {
  if (window.location.hostname === "drawaria.online" && window.location.pathname === "/") window.location.assign("/test");

  String.prototype.toFunction = function () {
    return new Function("(" + this + ")()");
  };
  String.prototype.__invokeAsFunction = function (...args) {
    new Function("(" + this + ")()")();
  };

  Function.prototype.callAsWorker = function (...args) {
    return new Promise((resolve, reject) => {
      const code = `self.onmessage = e => self.postMessage((${this.toString()}).call(null, ...e.data));`,
        blob = new Blob([code], { type: "text/javascript" }),
        worker = new Worker((window.URL ?? window.webkitURL).createObjectURL(blob));
      worker.onmessage = (e) => (resolve(e.data), worker.terminate());
      worker.onerror = (e) => (reject(e.message), worker.terminate());
      worker.postMessage(args);
    });
  };

  const originalElementPrototypeAppend = Element.prototype.append;
  Element.prototype.append = function (...elements) {
    elements = elements.filter((appendingElement) => {
      if (appendingElement instanceof HTMLElement) return true;
      return false;
    });
    originalElementPrototypeAppend.apply(this, elements);
    return this;
  };

  const sockets = [];
  const originalWebSocketSend = WebSocket.prototype.send;
  WebSocket.prototype.send = function (message) {
    let socket = this;
    if (sockets.indexOf(socket) === -1) {
      sockets.push(socket);
      originalWebSocketSend.call(socket, "2");
    }
    socket.addEventListener("close", function () {
      const pos = sockets.indexOf(socket);
      if (~pos) sockets.splice(pos, 1);
    });
    try {
      const msgObject = JSON.parse(message.replace(/^\d+/, ""));
      if (msgObject[0] === "startplay") {
        const width = msgObject[6][2];
        const height = msgObject[6][3];
        const canvas = document.querySelector("#canvas");
        canvas._width = width;
        canvas._height = height;
      }
    } catch (error) {}
    return originalWebSocketSend.call(socket, message);
  };
  globalThis["sockets"] = sockets;
  // Function.toString().replace(/^\s*\/\/.+$/gm, "").split("\n").filter((s) => s).map((s) => s.trim()).join("");
})();

(async function ($name) {
  "use strict";
  let canvas = document.querySelector("canvas#canvas");
  const cache = {
    storage: await caches.open($name),
    /**
     * @param {string} url
     * @param {string} scriptContent
     */
    saveScript: function (url, scriptContent) {
      this.storage.put(url, new Response(scriptContent, { headers: { "Content-Type": "application/javascript" } }));
    },
    /**
     * @param {string} url
     * @param {object} json
     */
    saveObject: function (url, json) {
      this.storage.put(url, new Response(JSON.stringify(json), { headers: { "Content-Type": "application/json" } }));
    },
    /**
     * @param {string} url
     * @returns {Promise<string>}
     */
    loadScript: async function (url) {
      const response = (await this.storage.match(url)) || (await fetch(url));
      return await response.text();
    },
    /**
     * @param {string} url
     * @returns {Promise<object>}
     */
    loadObject: async function (url) {
      const response = (await this.storage.match(url)) || (await fetch(url));
      return await response.json();
    },
  };
  const UI = {
    /**
     * Returns the first element that is a descendant of node that matches selectors.
     * @param {string} selectors
     * @param {ParentNode} parentElement
     * @returns {Element|null}
     */
    querySelect: (selectors, parentElement = document) => parentElement.querySelector(selectors),
    /**
     * Returns all element descendants of node that match selectors.
     * @param {string} selectors
     * @param {ParentNode} parentElement
     * @returns {NodeListOf<Element>}
     */
    querySelectAll: (selectors, parentElement = document) => parentElement.querySelectorAll(selectors),
    /**
     * Create Element and assign properties to it.
     * @param {string} tagName
     * @param {object} properties
     * @returns {Element}
     */
    createElement: (tagName, properties = {}) => {
      /** @type {Element} */
      const element = Object.assign(document.createElement(tagName), properties);
      if (properties.title) {
        try {
          element.setAttribute("data-toggle", "tooltip");
          element.setAttribute("data-html", "true");
          jQuery(element).tooltip({ boundary: "window" });
        } catch (error) {}
      }
      return element;
    },
    /**
     * Assign attributes to element.
     * @param {Element} element
     * @param {object} attributes
     */
    setAttributes: (element, attributes) => Object.entries(attributes).forEach(([k, v]) => element.setAttribute(k, v)),
    /**
     * Assign styles to element.
     * @param {Element} element
     * @param {object} styles
     */
    setStyles: (element, styles) => Object.assign(element.style, styles),
    /**
     * @param {string} name
     * @returns {HTMLDivElement}
     */
    createContainer: function (name = "div") {
      return this.createElement(name, { className: "container" });
    },
    /**
     * @returns {HTMLDivElement}
     */
    createRow: function () {
      return this.createElement("div", { className: "row" });
    },
    /**
     * @param {string} name
     * @returns {HTMLElement}
     */
    createIcon: function (name) {
      return this.createElement("i", { className: `fas fa-${name}` });
    },
    /**
     * @param {string} type
     * @param {object} properties
     * @returns {HTMLInputElement}
     */
    createInput: function (type, properties = {}) {
      const input = this.createElement("input", { ...{ className: "form-control" }, ...properties, ...{ type: type } });
      if (!input.id) input.id = helpers.uid(8);
      return input;
    },
    /**
     * @param {HTMLInputElement} input
     * @param {object} properties
     * @returns {HTMLLabelElement}
     */
    createLabelFor: function (input, properties = {}) {
      const label = this.createElement("label", { ...{ className: "btn btn-sm btn-outline-secondary" }, ...properties, ...{ htmlFor: input.id } });
      label.appendChild(input);
      input.hidden = true;
      if (input.type === "checkbox" || input.type === "radio") {
        input.addEventListener("input", function () {
          label.classList[input.checked ? "add" : "remove"]("active");
        });
      }
      return label;
    },
    /**
     * @param {string} className
     * @returns {HTMLElement & { show: Function, hide: Function }}
     */
    createSpinner: function (className = "text-secondary") {
      const spinner = this.createElement("div", { className: [className, "spinner-border spinner-border-sm"].join(" ") });
      spinner.show = function () {
        spinner.classList.remove("d-none");
      };
      spinner.hide = function () {
        spinner.classList.add("d-none");
      };
      spinner.hide();
      return spinner;
    },
    /**
     * @param {HTMLInputElement} input
     * @param {HTMLLabelElement|HTMLInputElement|HTMLButtonElement|HTMLElement} addon
     * @returns {HTMLDivElement}
     */
    createGroup: function (input, addon) {
      const group = this.createElement("div", { className: "input-group input-group-sm" });
      const groupAppend = this.createElement("div", { className: "input-group-append" });

      if (!(addon instanceof HTMLInputElement || addon instanceof HTMLButtonElement)) {
        addon.classList.add("input-group-text");
      }
      groupAppend.appendChild(addon);

      group.appendChild(input);
      group.appendChild(groupAppend);

      return group;
    },
    /**
     * @param {Array<HTMLLabelElement|HTMLInputElement|HTMLButtonElement|HTMLElement>} inputs
     * @returns {HTMLDivElement}
     */
    createInputGroup: function (...inputs) {
      const group = this.createElement("div", { className: "input-group input-group-sm" });

      let previousElementSibling = inputs[0];
      let appendGroup = this.createElement("div", { className: "input-group-append" });
      for (let index = 0; index < inputs.length; index++) {
        const input = inputs[index];

        if (input instanceof HTMLInputElement) {
          if (!(previousElementSibling instanceof HTMLInputElement)) {
            group.appendChild(appendGroup);
            appendGroup = this.createElement("div", { className: `input-group-${index > 0 ? "append" : "prepend"}` });
          }
          input.hidden = false;
          group.appendChild(input);
        } else {
          input.classList.add("input-group-text");
          appendGroup.appendChild(input);
          if (index + 1 === inputs.length) {
            group.appendChild(appendGroup);
          }
        }
        previousElementSibling = input;
      }

      return group;
    },
  };
  const DrawariaOnlineMessageTypes = {
    /**
     * @param {string} message
     * @returns {string}
     */
    chatmsg: function (message) {
      // 42["chatmsg","a"]
      const data = ["chatmsg", message];
      return `${42}${JSON.stringify(data)}`;
    },
    /**
     * @returns {string}
     */
    passturn: function () {
      // 42["passturn"]
      const data = ["passturn"];
      return `${42}${JSON.stringify(data)}`;
    },
    /**
     * @param {number|string} playerid
     * @returns {string}
     */
    pgdrawvote: function (playerid) {
      // 42["pgdrawvote",2,0]
      const data = ["pgdrawvote", playerid, 0];
      return `${42}${JSON.stringify(data)}`;
    },
    /**
     * @returns {string}
     */
    pgswtichroom: function () {
      // 42["pgswtichroom"]
      const data = ["pgswtichroom"];
      return `${42}${JSON.stringify(data)}`;
    },
    /**
     * @returns {string}
     */
    playerafk: function () {
      // 42["playerafk"]
      const data = ["playerafk"];
      return `${42}${JSON.stringify(data)}`;
    },
    /**
     * @returns {string}
     */
    playerrated: function () {
      // 42["playerrated"]
      const data = ["playerrated"];
      return `${42}${JSON.stringify(data)}`;
    },
    /**
     * @param {number|string} gestureid
     * @returns {string}
     */
    sendgesture: function (gestureid) {
      // 42["sendgesture",16]
      const data = ["sendgesture", gestureid];
      return `${42}${JSON.stringify(data)}`;
    },
    /**
     * @returns {string}
     */
    sendvote: function () {
      // 42["sendvote"]
      const data = ["sendvote"];
      return `${42}${JSON.stringify(data)}`;
    },
    /**
     * @param {number|string} playerid
     * @returns {string}
     */
    sendvotekick: function (playerid) {
      // 42["sendvotekick",93]
      const data = ["sendvotekick", playerid];
      return `${42}${JSON.stringify(data)}`;
    },
    /**
     * @param {number|string} wordid
     * @returns {string}
     */
    wordselected: function (wordid) {
      // 42["wordselected",0]
      const data = ["sendvotekick", wordid];
      return `${42}${JSON.stringify(data)}`;
    },
    /**
     * @param {string} roomID
     * @param {string} name
     * @param {string} uid
     * @param {string} wt
     * @returns {string}
     */
    startplay: function (roomID, name = undefined, uid = undefined, wt = undefined, width = 1000, height = 1000) {
      const data = `${420}${JSON.stringify(["startplay", name, 2, "en", roomID, null, [null, "https://drawaria.online/", width, height, [null, uid, wt], null]])}`;
      return data;
    },
    clientcmd: {
      /**
       * @param {number|string} itemid
       * @param {boolean} isactive
       * @returns {string}
       */
      activateitem: function (itemid, isactive) {
        const data = ["clientcmd", 12, [itemid, isactive]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} itemid
       * @returns {string}
       */
      buyitem: function (itemid) {
        const data = ["clientcmd", 11, [itemid]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} itemid
       * @param {"zindex"|"shared"} target
       * @param {any} value
       * @returns {string}
       */
      canvasobj_changeattr: function (itemid, target, value) {
        const data = ["clientcmd", 234, [itemid, target, value]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @returns {string}
       */
      canvasobj_getobjects: function () {
        const data = ["clientcmd", 233];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} itemid
       * @returns {string}
       */
      canvasobj_remove: function (itemid) {
        let data = ["clientcmd", 232, [itemid]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} itemid
       * @param {number|string} positionX
       * @param {number|string} positionY
       * @param {number|string} speed
       * @returns {string}
       */
      canvasobj_setposition: function (itemid, positionX, positionY, speed) {
        const data = ["clientcmd", 230, [itemid, 100 / positionX, 100 / positionY, { movespeed: speed }]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} itemid
       * @param {number|string} rotation
       * @returns {string}
       */
      canvasobj_setrotation: function (itemid, rotation) {
        const data = ["clientcmd", 231, [itemid, rotation]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {any} value
       * @returns {string}
       */
      customvoting_setvote: function (value) {
        const data = ["clientcmd", 301, [value]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {any} value
       * @returns {string}
       */
      getfpid: function (value) {
        const data = ["clientcmd", 901, [value]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @returns {string}
       */
      getinventory: function () {
        const data = ["clientcmd", 10, [true]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @returns {string}
       */
      getspawnsstate: function () {
        const data = ["clientcmd", 102];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} positionX
       * @param {number|string} positionY
       * @returns {string}
       */
      moveavatar: function (positionX, positionY) {
        const data = ["clientcmd", 103, [1e4 * Math.floor(positionX * 0.01 * 1e4) + Math.floor(positionY * 0.01 * 1e4), false]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @returns {string}
       */
      setavatarprop: function () {
        const data = ["clientcmd", 115];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} flagid
       * @param {boolean} isactive
       * @returns {string}
       */
      setstatusflag: function (flagid, isactive) {
        const data = ["clientcmd", 3, [flagid, isactive]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} playerid
       * @param {number|string} tokenid
       * @returns {string}
       */
      settoken: function (playerid, tokenid) {
        const data = ["clientcmd", 2, [playerid, tokenid]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} playerid
       * @param {any} value
       * @returns {string}
       */
      snapchatmessage: function (playerid, value) {
        const data = ["clientcmd", 330, [playerid, value]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @returns {string}
       */
      spawnavatar: function () {
        const data = ["clientcmd", 101];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @returns {string}
       */
      startrollbackvoting: function () {
        const data = ["clientcmd", 320];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @returns {string}
       */
      trackforwardvoting: function () {
        const data = ["clientcmd", 321];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} trackid
       * @returns {string}
       */
      votetrack: function (trackid) {
        const data = ["clientcmd", 1, [trackid]];
        return `${42}${JSON.stringify(data)}`;
      },
    },
    clientnotify: {
      /**
       * @param {number|string} playerid
       * @returns {string}
       */
      requestcanvas: function (playerid) {
        const data = ["clientnotify", playerid, 10001];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} playerid
       * @param {string} base64
       * @returns {string}
       */
      respondcanvas: function (playerid, base64) {
        const data = ["clientnotify", playerid, 10002, [base64]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} playerid
       * @param {number|string} imageid
       * @returns {string}
       */
      galleryupload: function (playerid, imageid) {
        const data = ["clientnotify", playerid, 11, [imageid]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} playerid
       * @param {any} type
       * @returns {string}
       */
      warning: function (playerid, type) {
        const data = ["clientnotify", playerid, 100, [type]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} playerid
       * @param {string} targetname
       * @param {boolean} mute
       * @returns {string}
       */
      mute: function (playerid, targetname, mute = false) {
        const data = ["clientnotify", playerid, 1, [mute, targetname]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} playerid
       * @param {string} targetname
       * @param {boolean} hide
       * @returns {string}
       */
      hide: function (playerid, targetname, hide = false) {
        const data = ["clientnotify", playerid, 3, [hide, targetname]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} playerid
       * @param {string} reason
       * @param {string} targetname
       * @returns {string}
       */
      report: function (playerid, reason, targetname) {
        const data = ["clientnotify", playerid, 2, [targetname, reason]];
        return `${42}${JSON.stringify(data)}`;
      },
    },
    drawcmd: {
      /**
       * @param {number|string} playerid
       * @param {number|string} x1
       * @param {number|string} y1
       * @param {number|string} x2
       * @param {number|string} y2
       * @param {number|string} size
       * @param {number|string} color
       * @param {boolean} ispixel
       * @returns {string}
       */
      line: function (x1, y1, x2, y2, color, size = 4, ispixel = true, playerid = 0) {
        const data = ["drawcmd", 0, [x1 * (1 / canvas.width), y1 * (1 / canvas.height), x2 * (1 / canvas.width), y2 * (1 / canvas.height), false, -size, color, playerid, ispixel]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} playerid
       * @param {number|string} x1
       * @param {number|string} y1
       * @param {number|string} x2
       * @param {number|string} y2
       * @param {number|string} size
       * @param {number|string} color
       * @returns {string}
       */
      erase: function (x1, y1, x2, y2, color, size, ispixel = true, playerid = 0) {
        const data = ["drawcmd", 1, [x1 * 0.01, y1 * 0.01, x2 * 0.01, y2 * 0.01, false, -size, color, playerid, ispixel]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} x
       * @param {number|string} y
       * @param {number|string} color
       * @param {number|string} tolerance
       * @param {number|string} r
       * @param {number|string} g
       * @param {number|string} b
       * @param {number|string} a
       * @returns {string}
       */
      flood: function (x, y, color, tolerance, r, g, b, a) {
        // 42["drawcmd",2,[x, y,color,{"0":r,"1":g,"2":b,"3":a},size]]
        const data = ["drawcmd", 2, [x * 0.01, y * 0.01, color, { 0: r, 1: g, 2: b, 3: a }, tolerance]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @param {number|string} playerid
       * @returns {string}
       */
      undo: function (playerid) {
        // 42["drawcmd",3,[playerid]]
        const data = ["drawcmd", 3, [playerid]];
        return `${42}${JSON.stringify(data)}`;
      },
      /**
       * @returns {string}
       */
      clear: function () {
        // 42["drawcmd",4,[]]
        const data = ["drawcmd", 4, []];
        return `${42}${JSON.stringify(data)}`;
      },
    },
  };
  const helpers = {
    /**
     * @param {string} message
     * @param {string} styles
     */
    log: (message, styles = "color:#5090C1", application = undefined) => console.log("%c" + [`[${application ?? $name}]`, message].join(" "), styles),

    /**
     * Generate radnow UID
     * @param {number} size
     * @returns {string}
     */
    uid: (size = 8) => {
      const MASK = 0x3d;
      const LETTERS = "abcdefghijklmnopqrstuvwxyz";
      const NUMBERS = "1234567890";
      const SPECIALS = "-_";
      const charset = `${NUMBERS}${LETTERS}${LETTERS.toUpperCase()}${SPECIALS}`.split("");

      const bytes = new Uint8Array(size);
      crypto.getRandomValues(bytes);

      return bytes.reduce((acc, byte) => `${acc}${charset[byte & MASK]}`, "");
    },

    /**
     * @param {number[]} byteArray
     * @returns {string}
     */
    toHexString: (byteArray) => {
      return byteArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
    },

    /**
     * @param {string} key
     * @param {string} value
     */
    setCookie: (key, value) => {
      if (window.Cookie) Cookies.set(key, value);
      document.cookie = `${key}=${value}; Secure; Path=/; SameSite=None; Partitioned;`;
    },

    /**
     * @returns {Array<*>&{addEventListener:(event:"delete"|"set",handler:(property:string,value:*)=>void))=>}}
     */
    makeObservableArray: () => {
      if (!("Proxy" in window)) {
        console.warn("Your browser doesn't support Proxies.");
        return [];
      }

      const onDeleteCall = [];
      const onSetCall = [];

      // a proxy for our array
      const proxy = new Proxy([], {
        deleteProperty: function (target, property) {
          onDeleteCall.forEach((callback) => callback(property, target[property]));
          delete target[property];
          return true;
        },
        set: function (target, property, value, receiver) {
          target[property] = value;
          onSetCall.forEach((callback) => callback(property, target[property]));
          return true;
        },
      });

      proxy.addEventListener = (event, handler) => {
        switch (event) {
          case "set":
            onSetCall.push(handler);
            return;
          case "delete":
            onDeleteCall.push(handler);
            return;

          default:
            break;
        }
      };

      return proxy;
    },

    /**
     * @param {string} message
     * @returns {Array<any>|object}
     */
    tryParseJSON: (message) => {
      try {
        return JSON.parse(message);
      } catch (error) {
        return [];
      }
    },
  };

  const clearScripts = (remove = true) => {
    try {
      let array = document.querySelectorAll('script[src]:not([data-codemaid="ignore"])');
      array.forEach((script) => {
        if (script.src != "") document.head.appendChild(script);
      });
    } catch (error) {
      console.error(error);
    }

    try {
      let unifiedScript = UI.createElement("script");

      let scripts = document.querySelectorAll('script:not([src]):not([data-codemaid="ignore"])');
      let unifiedScriptContent = "";
      scripts.forEach((script) => {
        let content = script.textContent; //.replaceAll(/\s/g, '');

        unifiedScriptContent += `try{${content}}catch(e){console.warn(e);}`;
        script.remove();
      });

      unifiedScript.textContent = unifiedScriptContent;

      if (!remove) document.head.appendChild(unifiedScript);
    } catch (error) {
      console.error(error);
    }
  };

  const clearStyles = (remove = false) => {
    try {
      let unifiedStyles = UI.createElement("style");
      unifiedStyles.textContet = "";

      let styles = document.querySelectorAll('style:not([data-codemaid="ignore"])');
      styles.forEach((style) => {
        unifiedStyles.textContent += style.textContent;
        style.remove();
      });
      if (!remove) document.head.appendChild(unifiedStyles);
    } catch (error) {
      console.error(error);
    }
  };

  const clearEmbeds = () => {
    try {
      let array = document.querySelectorAll("iframe");
      array.forEach((iframe) => {
        iframe.remove();
      });
    } catch (error) {
      console.error(error);
    }
  };

  const clearAll = () => {
    clearEmbeds();
    clearScripts();
    clearStyles();
    UI.querySelectAll(".extimages").forEach((e) => e.remove());
    UI.querySelectAll(".promlinks").forEach((e) => e.remove());
  };

  class Player {
    /** @type {Array<Player>} */
    static instances = [];
    static get noConflict() {
      return Player.instances[0] ?? new Player(helpers.uid(12));
    }
    /**
     * @param {string|undefined} inviteLink
     * @returns {URL}
     */
    static getSocketServerURL(inviteLink) {
      if (typeof inviteLink === "undefined") return `wss://sv3.drawaria.online/socket.io/?sid1=undefined&hostname=drawaria.online&EIO=3&transport=websocket`;
      const roomID = this.getRoomID(inviteLink);
      const [_voidable, serverPrefix] = roomID.split(".");
      return new URL(`wss://${typeof serverPrefix === "undefined" ? "" : "sv".concat(serverPrefix, ".")}drawaria.online/socket.io/?sid1=undefined&hostname=drawaria.online&EIO=3&transport=websocket`);
    }
    /**
     * @param {string|undefined} inviteLink
     * @returns {string}
     */
    static getRoomID(inviteLink) {
      const inviteURL = new URL(inviteLink);
      return inviteURL.pathname.slice(6);
    }
    /**
     * @param {MessageEvent} messageEvent
     * @returns {[string, string, Array<any>|object]}
     */
    static parseMessageEventData(messageEvent) {
      const rawData = String(messageEvent.data);
      const messageType = (rawData.match(/^\d+/i) ?? [""])[0];
      const messageData = messageType.length === rawData.length ? [] : helpers.tryParseJSON(rawData.slice(messageType.length));
      return [messageType, Array.isArray(messageData) ? messageData.shift() : "", messageData];
    }
    static parseMessage = DrawariaOnlineMessageTypes;

    /** @type {string} */
    name;
    /** @type {string} */
    uid;
    /** @type {string} */
    wt;
    /** @type {string} */
    roomID;

    /** @type {WebSocket} */
    socket;

    /** @type {Map<string, Function[]>} */
    events;

    /**
     * @param {string} name
     */
    constructor(name = undefined) {
      this.name = name;
      this.uid = "_";
      this.wt = undefined;
      this.roomID = undefined;

      this.events = new Map();

      Player.instances.push(this);
    }

    /**
     * @param {string} inviteLink
     */
    connect = (inviteLink) => {
      if (this.isConnected) return;
      this.#createNewConnection(inviteLink);
    };

    disconnect = () => {
      this.send("41");
      if (this.isConnected) this.socket.close();
    };

    reconnect = () => {
      if (!this.isConnected) {
        this.connect(`https://drawaria.online/room/${this.roomID}`);
        return;
      }
      this.send("41");
      this.send("40");
    };

    /**
     * @param {string} inviteLink
     */
    enterRoom = (inviteLink = undefined) => {
      this.roomID = Player.getRoomID(inviteLink ?? document.querySelector("#invurl").value);
      this.reconnect();
    };

    nextRoom = () => {
      this.send(Player.parseMessage.pgswtichroom());
    };

    leaveRoom = () => {
      this.send("41");
    };

    /**
     * @param {string} payload
     */
    send = (payload) => {
      if (this.isConnected) this.socket.send(payload);
      else debug(`send failed! Connection is closed`);
    };

    /**
     * @returns {boolean}
     */
    get isConnected() {
      return typeof this.socket !== "undefined" && this.socket instanceof WebSocket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING);
    }

    #sendHeartbeat = () => {
      if (this.isConnected) this.socket.send(2);
    };

    /**
     * @param {string} inviteLink
     */
    #createNewConnection = (inviteLink) => {
      this.socket = new WebSocket(Player.getSocketServerURL(inviteLink));
      this.roomID = Player.getRoomID(inviteLink);
      this.socket.addEventListener("open", this.#startHeartbeat);
      this.socket.addEventListener("message", this.#handleMessage);
    };

    #startHeartbeat = () => {
      this.heartbeatInterval = setInterval(this.#sendHeartbeat, 25000);
    };

    #handleMessage = (rawMessage) => {
      const [eventType, eventName, eventData] = Player.parseMessageEventData(rawMessage);

      switch (eventType) {
        case "40":
          this.send(Player.parseMessage.startplay(this.roomID, this.name, this.uid, this.wt));
          break;
        case "430":
          break;
        case "42":
          this.__invokeEvent(eventName, eventData);
          break;
        default:
      }
    };

    /**
     * @param {DrawariaOnlineEvents} event
     * @param {Function} callback
     */
    addEventListener = (event, callback, id = undefined) => {
      if (!this.hasEventListener(event)) {
        this.events.set(event, []);
      }
      callback.id = id ?? this.addEventListener.caller.name ?? helpers.uid(8);
      try {
        this.events.get(event).push(callback);
      } catch (error) {
        debug(`addEventListener returned error \"${error}\"`, "color:firebrick");
      }
    };

    /**
     * @param {DrawariaOnlineEvents} event
     * @param {*} data
     */
    __invokeEvent = (event, data) => {
      if (this.hasEventListener(event)) {
        const listeners = this.events.get(event);
        listeners.forEach((listener) => listener(data));
      }
    };

    /**
     * @param {DrawariaOnlineEvents} name
     * @returns {boolean}
     */
    hasEventListener = (name) => {
      return this.events.has(name);
    };
  }

  class DefinableCore {
    static UI = UI;
    static Player = Player;
    static helper = helpers;
    static runtime = [];

    constructor(moduleName, moduleIcon = "code") {
      this.name = moduleName;
      this.__initializeHead(moduleIcon);
      this.__initializeBody();
    }

    __initializeHead(moduleIcon) {
      const input = this.UI.createInput("checkbox");
      this.label = this.UI.createLabelFor(input, { title: this.name });
      const icon = this.UI.createIcon(moduleIcon);
      this.label.appendChild(icon);
    }

    __initializeBody() {
      const submoduleSelectionContainer = this.UI.createElement("nav", { className: "row" });
      const wrapper = this.UI.createElement("div");
      this.wrapper = wrapper;
      this.__contaier = this.UI.createElement("div");
      this.__contaier.appendChild(this.UI.createElement("b", { textContent: this.name }));
      // this.wrapper.appendChild(submoduleSelectionContainer);
      this.__contaier.appendChild(submoduleSelectionContainer);
      this.wrapper.appendChild(this.__contaier);
      const input = this.UI.querySelect("&>input", this.label);
      input.addEventListener("input", function () {
        wrapper.classList[input.checked ? "remove" : "add"]("d-none");
      });
      wrapper.classList.add("d-none");
    }

    createRow() {
      const row = this.UI.createRow();
      this.__contaier.appendChild(row);
      return row;
    }

    /**
     * @param {DefinableCore} submodule
     */
    registerModule(submodule) {
      // const submoduleSelectionContainer = this.UI.querySelect("&>nav", this.wrapper);
      const submoduleSelectionContainer = this.UI.querySelect("&>nav", this.__contaier);
      submoduleSelectionContainer.appendChild(submodule.label);
      this.wrapper.appendChild(submodule.wrapper);
      DefinableCore.runtime.push(submodule);
    }

    get UI() {
      return DefinableCore.UI;
    }
    get Player() {
      return DefinableCore.Player;
    }
  }

  window.addEventListener("definable:core:init", function () {
    const ui = DefinableCore.UI;
    const definable = new DefinableCore("Definable", "code");
    const container = UI.createElement("section", { style: "position: relative" });

    const chatbox = ui.querySelect("#chatbox_messages");
    /** @type {HTMLElement} */
    const devider = chatbox.previousElementSibling;
    devider.before(container);
    container.appendChild(definable.wrapper);
    definable.wrapper.style.position = "absolute";
    container.before(devider.cloneNode(false));

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("definable:init", { detail: { main: definable, core: DefinableCore } }));
      definable.wrapper.classList.remove("d-none");
      definable.wrapper.classList.add("container");
      definable.wrapper.id = "definable";
      definable.wrapper.ModMenu = definable;
    }, 500);

    globalThis["$" + $name] = definable;
  });

  setTimeout(() => {
    window.dispatchEvent(new CustomEvent("definable:core:init"));
    clearEmbeds();
    clearScripts();
    clearStyles();
    document.head.appendChild(
      UI.createElement("style", {
        id: "definableStyles",
        textContent: [
          "#definable { position: relative; isolation: isolate; }",
          "#definable::before { position: absolute; content: ''; inset: 0; background-color: var(--light); z-index: -1; }",
          "#definable .row { gap: 0.125rem; margin-bottom: 0.125rem; }",
          "#definable label { margin: 0; }",
          "#definable .row>label { min-width: 2rem; }",
        ].join("\n"),
      })
    );
    jQuery.getScript("/3rd/lib/moveable.min.js?" + window.VERID, function (data, textStatus, jqxhr) {
      globalThis["transformable"] = initTransformable(Moveable);
    });
    jQuery.getScript("/pageres/stencils.js?" + window.VERID);
    // console.clear();
  }, 500);

  function initTransformable(TransformationController) {
    const transformable = new TransformationController(document.body, {
      target: null,
      container: document.body,
      draggable: true,
      scalable: true,
      rotatable: true,
      snappable: true,
      origin: true,
      keepRatio: true,
    });

    transformable.snapGridWidth = 64;
    transformable.snapGridHeight = 64;

    /* draggable */
    transformable.on("drag", ({ target, transform, left, top, right, bottom, beforeDelta, beforeDist, delta, dist, clientX, clientY }) => {
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;
    });

    /* scalable */
    transformable.on("scale", ({ target, scale, dist, delta, transform, clientX, clientY }) => {
      target.style.transform = transform;
    });

    /* rotatable */
    transformable.on("rotate", ({ target, beforeDelta, delta, dist, transform, clientX, clientY }) => {
      target.style.transform = transform;
    });

    /* Handle Transformable target selection */
    window.addEventListener("mousedown", function (event) {
      /** @type {HTMLElement} */
      const target = event.target;
      if (!target) return;

      if (target.classList.contains("moveable-control-box") || this.document.querySelector(".moveable-control-box").contains(target)) return;

      if (target.classList.contains("transformable")) {
        transformable.target = target;
        return;
      }
      transformable.target = null;
    });

    /* Handle ZIndex changes via keybinds */
    window.addEventListener("keydown", function (event) {
      /** @type {HTMLElement|HTMLImageElement} */
      const target = transformable.target;
      if (!target) return;

      // console.log(event.key);

      const zIndex = Number(target.style.zIndex ?? "0");
      switch (event.key) {
        case "+":
          target.style.zIndex = zIndex + 1;
          event.preventDefault();
          event.stopPropagation();
          break;

        case "-":
          target.style.zIndex = zIndex - 1;
          event.preventDefault();
          event.stopPropagation();
          break;

        case "Delete":
          transformable.target = null;
          target.remove();
          break;

        case "ArrowUp":
          target.style.top = parseFloat(target.style.top) - 1 + "px";
          transformable.updateRect();
          break;

        case "ArrowDown":
          target.style.top = parseFloat(target.style.top) + 1 + "px";
          transformable.updateRect();
          break;

        case "ArrowLeft":
          target.style.left = parseFloat(target.style.left) - 1 + "px";
          transformable.updateRect();
          break;

        case "ArrowRight":
          target.style.left = parseFloat(target.style.left) + 1 + "px";
          transformable.updateRect();
          break;

        default:
          break;
      }
      if (event.ctrlKey && event.key == "d") {
        event.preventDefault();
        event.stopPropagation();

        const duplicate = new Image();
        duplicate.src = target.src;
        duplicate.classList.add("transformable");
        duplicate.style.top = parseFloat(target.style.top) + 20 + "px";
        duplicate.style.left = parseFloat(target.style.left) + 20 + "px";
        transformable.target = duplicate;
        transformable.updateRect();
        document.body.appendChild(duplicate);
      }
    });

    return transformable;
  }

  function launchScriptManager() {
    const ui = DefinableCore.UI;
    const container = ui.createContainer();

    {
      const row = ui.createRow();

      const scriptSourceLinkInput = ui.createInput("text", { className: "form-control" });
      const requestSourceInput = ui.createInput("button");
      const requestSourceLabel = ui.createLabelFor(requestSourceInput);
      const group = ui.createGroup(scriptSourceLinkInput, requestSourceLabel);
      const spinnerIcon = ui.createSpinner("");
      const defaultIcon = ui.createIcon("external-link-alt");

      requestSourceLabel.appendChild(defaultIcon);
      requestSourceLabel.appendChild(spinnerIcon);

      requestSourceInput.addEventListener("click", function () {
        defaultIcon.classList.add("d-none");
        spinnerIcon.show();

        if (!scriptSourceLinkInput.value.startsWith("http")) {
          helpers.log("Not a valid Link: ".concat(scriptSourceLinkInput.value), "color: firebrick;");
          spinnerIcon.hide();
          defaultIcon.classList.remove("d-none");
          return;
        }

        const requestSourceLink = new URL(scriptSourceLinkInput.value);
        helpers.log("Requesting Module: ".concat(requestSourceLink), "color: rebeccapurple;");

        fetch(requestSourceLink).then(async (response) => {
          const copy = response.clone();
          const content = await copy.text();

          if (copy.status === 200 && content) {
            cache.saveScript(requestSourceLink, content);
            helpers.log("Module installed!", "color: forestgreen;");
            spinnerIcon.hide();
            defaultIcon.classList.remove("d-none");
            scriptSourceLinkInput.value = "";
          }
        });
      });

      row.appendChild(group);
      container.appendChild(row);
    }

    DefinableCore.UI.querySelect("#login-leftcol").appendChild(container);
  }
})("definable");
