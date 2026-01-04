// ==UserScript==
// @name         Cube Engine
// @version      5.0.2
// @description  Enhance your Experience
// @namespace    drawaria.modded.fullspec
// @homepage     https://drawaria.online/profile/?uid=63196790-c7da-11ec-8266-c399f90709b7
// @author       ≺ᴄᴜʙᴇ³≻
// @match        https://drawaria.online/
// @match        https://drawaria.online/test
// @match        https://drawaria.online/room/*
// @icon         https://drawaria.online/avatar/cache/e53693c0-18b1-11ec-b633-b7649fa52d3f.jpg
// @grant        none
// @license      GNU GPLv3
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/474381/Cube%20Engine.user.js
// @updateURL https://update.greasyfork.org/scripts/474381/Cube%20Engine.meta.js
// ==/UserScript==

(function () {
  (function CodeMaid(callback) {
    class TypeChecker {
      constructor() {}
      isArray(value) {
        return this.isA("Array", value);
      }
      isObject(value) {
        return !this.isUndefined(value) && value !== null && this.isA("Object", value);
      }
      isString(value) {
        return this.isA("String", value);
      }
      isNumber(value) {
        return this.isA("Number", value);
      }
      isFunction(value) {
        return this.isA("Function", value);
      }
      isAsyncFunction(value) {
        return this.isA("AsyncFunction", value);
      }
      isGeneratorFunction(value) {
        return this.isA("GeneratorFunction", value);
      }
      isTypedArray(value) {
        return (
          this.isA("Float32Array", value) ||
          this.isA("Float64Array", value) ||
          this.isA("Int16Array", value) ||
          this.isA("Int32Array", value) ||
          this.isA("Int8Array", value) ||
          this.isA("Uint16Array", value) ||
          this.isA("Uint32Array", value) ||
          this.isA("Uint8Array", value) ||
          this.isA("Uint8ClampedArray", value)
        );
      }
      isA(typeName, value) {
        return this.getType(value) === "[object " + typeName + "]";
      }
      isError(value) {
        if (!value) {
          return false;
        }

        if (value instanceof Error) {
          return true;
        }

        return typeof value.stack === "string" && typeof value.message === "string";
      }
      isUndefined(obj) {
        return obj === void 0;
      }
      getType(value) {
        return Object.prototype.toString.apply(value);
      }
    }

    class DOMCreate {
      #validate;
      constructor() {
        this.#validate = new TypeChecker();
      }
      exportNodeTree(node = document.createElement("div")) {
        let referenceTolocalThis = this;

        let json = {
          nodeName: node.nodeName,
          attributes: {},
          children: [],
        };

        Array.from(node.attributes).forEach(function (attribute) {
          json.attributes[attribute.name] = attribute.value;
        });

        if (node.children.length <= 0) {
          json.children.push(node.textContent.replaceAll("\t", ""));
          return json;
        }

        Array.from(node.children).forEach(function (childNode) {
          json.children.push(referenceTolocalThis.exportNodeTree(childNode));
        });

        return json;
      }

      importNodeTree(json = { nodeName: "", attributes: {}, children: [] }) {
        let referenceTolocalThis = this;

        if (referenceTolocalThis.#validate.isString(json)) {
          return this.TextNode(json);
        }

        let node = this.Tree(json.nodeName, json.attributes);

        json.children.forEach(function (child) {
          node.appendChild(referenceTolocalThis.importNodeTree(child));
        });

        return node;
      }

      Element() {
        return document.createElement.apply(document, arguments);
      }
      TextNode() {
        return document.createTextNode.apply(document, arguments);
      }
      Tree(type, attrs, childrenArrayOrVarArgs) {
        const el = this.Element(type);
        let children;
        if (this.#validate.isArray(childrenArrayOrVarArgs)) {
          children = childrenArrayOrVarArgs;
        } else {
          children = [];

          for (let i = 2; i < arguments.length; i++) {
            children.push(arguments[i]);
          }
        }

        for (let i = 0; i < children.length; i++) {
          const child = children[i];

          if (typeof child === "string") {
            el.appendChild(this.TextNode(child));
          } else {
            if (child) {
              el.appendChild(child);
            }
          }
        }
        for (const attr in attrs) {
          if (attr == "className") {
            el[attr] = attrs[attr];
          } else {
            el.setAttribute(attr, attrs[attr]);
          }
        }

        el.appendAll = function (...nodes) {
          nodes.forEach((node) => {
            el.appendChild(node);
          });
        };

        return el;
      }
    }

    class CookieManager {
      constructor() {}
      set(name, value = "") {
        document.cookie =
          name + "=" + value + "; expires=" + new Date("01/01/2024").toUTCString().replace("GMT", "UTC") + "; path=/";
      }
      get(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == " ") c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
      }
      clear(name) {
        document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      }
    }

    class DocumentCleaner {
      document;
      constructor() {
        this.document = new DOMCreate();
      }
      scripts(remove = true) {
        try {
          let array = document.querySelectorAll('script[src]:not([data-codemaid="ignore"])');
          array.forEach((script) => {
            if (script.src != "") document.head.appendChild(script);
          });
        } catch (error) {
          console.error(error);
        }

        try {
          let unifiedScript = this.document.Tree("script");

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
      }
      styles(remove = false) {
        try {
          let unifiedStyles = this.document.Tree("style");
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
      }
      embeds() {
        try {
          let array = document.querySelectorAll("iframe");
          array.forEach((iframe) => {
            iframe.remove();
          });
        } catch (error) {
          console.error(error);
        }
      }
    }

    class CustomGenerator {
      constructor() {}
      uuidv4() {
        return crypto.randomUUID();
      }
    }

    globalThis.typecheck = new TypeChecker();
    globalThis.cookies = new CookieManager();
    globalThis.domMake = new DOMCreate();
    globalThis.domClear = new DocumentCleaner();
    globalThis.generate = new CustomGenerator();

    if (window.location.pathname === "/") window.location.assign("/test");
  })();

  (function CubicEngine() {
    domMake.Button = function (content) {
      let btn = domMake.Tree("button", { class: "btn btn-outline-secondary" });
      btn.innerHTML = content;
      return btn;
    };
    domMake.Row = function () {
      return domMake.Tree("div", { class: "_row" });
    };
    domMake.IconList = function () {
      return domMake.Tree("div", { class: "icon-list" });
    };

    const sockets = [];
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
      let socket = this;
      if (sockets.indexOf(socket) === -1) {
        sockets.push(socket);
      }
      socket.addEventListener("close", function () {
        const pos = sockets.indexOf(socket);
        if (~pos) sockets.splice(pos, 1);
      });
      return originalSend.call(socket, ...args);
    };

    const identifier = "🧊";

    class Stylizer {
      constructor() {
        this.element = domMake.Tree("style", { "data-codemaid": "ignore" }, []);
        document.head.appendChild(this.element);
        this.initialize();
      }

      initialize() {
        this.addRules([
          `body * {margin: 0; padding: 0; box-sizing: border-box; line-height: normal;}`,
          `#${identifier} {--CE-bg_color: var(--light); --CE-color: var(--dark); line-height: 2rem; font-size: 1rem;}`,
          `#${identifier}>details {position:relative; overflow:visible; z-index: 999; background-color: var(--CE-bg_color); border: var(--CE-color) 1px solid; border-radius: .25rem;}`,
          `#${identifier} details>summary::marker {content:"📘";}`,
          `#${identifier} details[open]>summary::marker {content:"📖";}`,
          `#${identifier} details details {margin: 1px 0; border-top: var(--CE-color) 1px solid;}`,
          `#${identifier} input.toggle[name][hidden]:not(:checked) + * {display: none !important;}`,
          `#${identifier} header>.icon {margin: 1px;}`,
          `#${identifier} header>.icon.active {color: var(--success);}`,
          `#${identifier} header>.icon:not(.active) {color:var(--danger); opacity:.6;}`,
          `#${identifier} header:not(:has([title='Unselect'] + *)) > [title='Unselect'] {display:none;}`,
          `#${identifier} .btn {padding: 0;}`,
          `#${identifier} .icon-list {display: flex; flex-flow: wrap;}`,
          `#${identifier} .nowrap {overflow-x: scroll; padding-bottom: 12px; flex-flow: nowrap;}`,
          `#${identifier} .icon {display: flex; flex: 0 0 auto; max-width: 1.6rem; min-width: 1.6rem; height: 1.6rem; border-radius: .25rem; border: 1px solid var(--CE-color); aspect-ratio: 1/1;}`,
          `#${identifier} .icon > * {margin: auto; text-align: center; max-height: 100%; max-width: 100%;}`,
          `#${identifier} .itext {text-align: center; -webkit-appearance: none; -moz-appearance: textfield;}`,
          `#${identifier} ._row {display: flex; width: 100%;}`,
          `#${identifier} ._row > * {width: 100%;}`,
          `hr {margin: 5px 0;}`,
          `.playerlist-row::after {content: attr(data-playerid); position: relative; float: right; top: -20px;}`,
          `[hidden] {display: none !important;}`,
          `.noselect {-webkit-touch-callout: none; -webkit-user-select: none; -moz-user-select: none; user-select: none;}`,
        ]);
      }

      addRules(rules = []) {
        let reference = this;
        rules.forEach(function (rule) {
          reference.addRule(rule);
        });
      }
      addRule(rule) {
        let TextNode = domMake.TextNode(rule);
        this.element.appendChild(TextNode);
      }
    }

    class ModBase {
      static globalListOfExtensions = [];
      static localListOfExtensions = [];
      static Styles = new Stylizer();

      static register = function (extension) {
        extension.localListOfExtensions = [];
        ModBase.globalListOfExtensions.push(extension);
        return ModBase;
      };
      static bind = function (extension, target) {
        let parent;
        if (typecheck.isFunction(target)) parent = target;
        else if (typecheck.isString(target))
          parent = ModBase.globalListOfExtensions.find((entry) => entry.name === target);
        else if (typecheck.isObject(target)) parent = target.constructor;
        else {
          console.log(typecheck.getType(target));
        }
        if (!parent) return new Error(`${parent}`);

        parent.localListOfExtensions.push(extension);
        parent.autostart = true;

        return parent;
      };
      static findGlobal = function (extensionName) {
        return ModBase.globalListOfExtensions.find((entry) => entry.name === extensionName);
      };

      #id;
      #name;
      #icon;

      htmlElements;
      children;
      parent;

      constructor(name, icon) {
        this.#id = generate.uuidv4();
        this.#name = this.constructor.name;
        this.#icon = "📦";
        this.children = [];
        this.htmlElements = {};

        this.#onStartup();

        this.setName(name || this.#name);
        this.setIcon(icon || this.#icon);
      }

      #onStartup() {
        this.#loadInterface();

        if (this.constructor.autostart)
          this.constructor.localListOfExtensions.forEach((extension) => {
            this.loadExtension(extension);
          });
      }

      #loadInterface() {
        this.htmlElements.details = domMake.Tree("details", {
          class: "noselect",
          open: true,
          "data-reference": this.constructor.name,
        });
        this.htmlElements.summary = domMake.Tree("summary");
        this.htmlElements.header = domMake.Tree("header", { class: "icon-list" });
        this.htmlElements.section = domMake.Tree("section");
        this.htmlElements.children = domMake.Tree("section");

        this.htmlElements.details.appendChild(this.htmlElements.summary);
        this.htmlElements.details.appendChild(this.htmlElements.header);
        this.htmlElements.details.appendChild(this.htmlElements.section);
        this.htmlElements.details.appendChild(this.htmlElements.children);

        this.htmlElements.input = domMake.Tree(
          "input",
          { type: "radio", id: this.#id, name: "QBit", class: "toggle", hidden: true, title: this.#name },
          [this.#name]
        );
        this.htmlElements.label = domMake.Tree("label", { for: this.#id, class: "icon" });

        {
          const input = this.htmlElements.input;
          const label = this.htmlElements.label;

          input.addEventListener("change", (event) => {
            this.parent?.children.forEach((child) => {
              child.htmlElements.label.classList.remove("active");
            });

            label.classList[input.checked ? "add" : "remove"]("active");
          });

          label.classList[input.checked ? "add" : "remove"]("active");
        }
        {
          const resetImageSelectionLabel = domMake.Tree("div", { class: "icon", title: "Unselect" }, [
            domMake.Tree("i", { class: "fas fa-chevron-left" }),
          ]);
          resetImageSelectionLabel.addEventListener("click", () => {
            this.children.forEach((child) => {
              child.htmlElements.label.classList.remove("active");
              child.htmlElements.input.checked = !1;
            });
          });
          this.htmlElements.header.appendChild(resetImageSelectionLabel);
        }
      }

      loadExtension(extension, referenceHandler) {
        let activeExtension = new extension();
        activeExtension.parent = this;

        activeExtension.htmlElements.input.name = this.getName();

        if (referenceHandler) referenceHandler(activeExtension);
        else this.children.push(activeExtension);

        if (!extension.siblings) extension.siblings = [];
        extension.siblings.push(activeExtension);

        if (extension.isFavorite) {
          activeExtension.htmlElements.input.click();
          if (activeExtension.enable) activeExtension.enable();
        }

        this.htmlElements.header.appendChild(activeExtension.htmlElements.label);
        this.htmlElements.children.appendChild(activeExtension.htmlElements.input);
        this.htmlElements.children.appendChild(activeExtension.htmlElements.details);

        return activeExtension;
      }

      notify(level, message) {
        if (typeof message != "string") {
          try {
            message = JSON.stringify(message);
          } catch (error) {
            throw error;
          }
        }

        let color = "";
        if ([5, "error"].includes(level)) {
          color = "#dc3545";
        } else if ([4, "warning"].includes(level)) {
          color = "#ffc107";
        } else if ([3, "info"].includes(level)) {
          color = "#17a2b8";
        } else if ([2, "success"].includes(level)) {
          color = "#28a745";
        } else if ([1, "log"].includes(level)) {
          color = "#6c757d";
        } else if ([0, "debug"].includes(level)) {
          color = "purple";
        }

        console.log(`%c${this.#name}: ${message}`, `color: ${color}`);
        let chatmessage = domMake.Tree(
          "div",
          { class: `chatmessage systemchatmessage5`, "data-ts": Date.now(), style: `color: ${color}` },
          [`${this.#name}: ${message}`]
        );

        let loggingContainer = document.getElementById("chatbox_messages");
        if (!loggingContainer) loggingContainer = document.body;
        loggingContainer.appendChild(chatmessage);
      }

      findGlobal(extensionName) {
        return this.referenceToBase.findGlobal(extensionName);
      }

      findLocal(extensionName) {
        return this.children.filter((child) => child.constructor.name === extensionName);
      }

      setName(name) {
        if (!name) return;

        this.#name = name;
        this.htmlElements.label.title = name;

        this.htmlElements.summary.childNodes.forEach((child) => child.remove());

        if (typecheck.isString(name)) {
          if (name.startsWith("<")) return (this.htmlElements.summary.innerHTML = name);
          name = domMake.TextNode(name);
        }

        this.htmlElements.summary.appendChild(name);
      }

      getName() {
        return this.#name;
      }

      setIcon(icon) {
        if (!icon) return;

        this.#icon = icon;

        this.htmlElements.label.childNodes.forEach((child) => child.remove());

        if (typecheck.isString(icon)) {
          if (icon.startsWith("<")) return (this.htmlElements.label.innerHTML = icon);
          icon = domMake.TextNode(icon);
        }

        this.htmlElements.label.appendChild(icon);
      }

      getIcon() {
        return this.#icon;
      }

      get referenceToBase() {
        return this.constructor.dummy1;
      }
      get referenceToMaster() {
        return this.constructor.dummy2;
      }

      _EXP_destroy(youSure = false) {
        if (!youSure) return;

        this.children.forEach((child) => {
          child._EXP_destroy(youSure);
          delete [child];
        });
        this.children = null;

        let pos = this.parent.children.indexOf(this);
        if (~pos) {
          this.parent.children.splice(pos, 1);
        }

        this.htmlElements.children.remove();
        this.htmlElements.section.remove();
        this.htmlElements.header.remove();
        this.htmlElements.summary.remove();
        this.htmlElements.details.remove();
        this.htmlElements.input.remove();
        this.htmlElements.label.remove();

        this.htmlElements = null;

        let pos2 = this.constructor.siblings.indexOf(this);
        if (~pos2) {
          this.constructor.siblings.splice(pos2, 1);
        }
      }
    }

    class CubeEngine extends ModBase {
      static dummy1 = ModBase.register(this);

      constructor() {
        super("CubeEngine");
      }
    }

    class Await {
      static dummy1 = ModBase.register(this);

      #interval;
      #handler;
      #callback;
      constructor(callback, interval) {
        this.#interval = interval;
        this.#callback = callback;
      }

      call() {
        const localThis = this;
        clearTimeout(this.#handler);

        this.#handler = setTimeout(function () {
          localThis.#callback();
        }, this.#interval);
      }
    }

    globalThis[arguments[0]] = ModBase;

    return function (when = "load") {
      setTimeout(() => {
        const ModMenu = new CubeEngine();
        // ModMenu.htmlElements.details.open = false;

        const target = document.getElementById("accountbox");
        const container = domMake.Tree("div", { id: identifier, style: "height: 1.6rem; flex: 0 0 auto;" });
        container.appendChild(ModMenu.htmlElements.details);
        target.after(container);
        target.after(domMake.Tree("hr"));

        globalThis["CubeEngine"] = ModMenu;
        globalThis["sockets"] = sockets;

        domClear.embeds();
        domClear.scripts();
        domClear.styles();
        console.clear();
      }, 200);
    };
  })("QBit")();

  (function BotClient() {
    const QBit = globalThis[arguments[0]];

    function parseServerUrl(any) {
      var prefix = String(any).length == 1 ? `sv${any}.` : "";
      return `wss://${prefix}drawaria.online/socket.io/?sid1=undefined&hostname=drawaria.online&EIO=3&transport=websocket`;
    }

    function parseRoomId(any) {
      return String(any).match(/([a-f0-9.-]+?)$/gi)[0];
    }

    function parseSocketIOEvent(prefix_length, event_data) {
      try {
        return JSON.parse(event_data.slice(prefix_length));
      } catch (error) {}
    }

    function parseAvatarURL(arr = []) {
      return `https://drawaria.online/avatar/cache/${arr.length > 0 ? arr.join(".") : "default"}.jpg`;
    }

    // class BotClient extends QBit {
    class BotClient {
      static dummy1 = QBit.register(this);

      // constructor(name = '', avatar = []) {
      constructor(name = "JavaScript", avatar = ["cf19b8f0-cf31-11ed-9ece-d584b24f60dc", "1680377222354"]) {
        // super(name, `<img src="${parseAvatarURL(avatar)}">`);

        this.name = name;
        this.avatar = avatar;
        this.attributes = { spawned: false, rounded: false, status: false };

        this.url = "";
        this.socket = null;
        this.interval_id = 0;
        this.interval_ms = 25000;

        this.room = {
          id: null,
          config: null,
          type: 2,
          players: [],
        };

        this.customObservers = [
          {
            event: "mc_roomplayerschange",
            callback: (data) => {
              this.room.players = data[2];
            },
          },
        ];
      }

      getReadyState() {
        const localThis = this;
        if (!localThis.socket) return false;
        return localThis.socket.readyState == localThis.socket.OPEN;
      }

      connect(url) {
        const localThis = this;
        // if (localThis.getReadyState()) localThis.disconnect();
        if (localThis.getReadyState()) return;

        if (!url) return localThis.enterRoom(document.querySelector("#invurl").value);
        localThis.socket = new WebSocket(parseServerUrl(url));

        localThis.socket.addEventListener("open", function (event) {
          localThis.interval_id = setInterval(function () {
            if (!localThis.getReadyState()) return clearInterval(localThis.interval_id);
            localThis.send(2);
          }, localThis.interval_ms);
        });

        localThis.socket.addEventListener("message", function (message_event) {
          var prefix = String(message_event.data).match(/(^\d+)/gi)[0] || "";
          if (prefix == "40") {
            localThis.send(emits.startplay(localThis.room, localThis.name, localThis.avatar));
          }

          var data = parseSocketIOEvent(prefix.length, message_event.data) || [];
          if (data && data.length == 1) {
            if (data[0].players) localThis.room.players = data[0].players;
          }
          if (data && data.length > 1) {
            var event = data.shift();

            localThis.customObservers.forEach((listener) => {
              if (listener.event === event) if (listener.callback) listener.callback(data);
            });
          }
        });
      }

      disconnect() {
        if (!this.getReadyState()) return;
        this.socket.close();
      }

      reconnect() {
        this.send(41);
        this.send(40);
      }

      enterRoom(roomid) {
        this.room.id = parseRoomId(roomid);
        if (!this.getReadyState()) this.connect(this.room.id.includes(".") ? this.room.id.slice(-1) : "");
        this.reconnect();
      }

      leaveRoom() {
        this.send(41);
      }

      switchRoom() {
        this.emit("pgswtichroom");
        // this.send(emits['pgswtichroom']());
      }

      addEventListener(eventname, callback) {
        this.customObservers.push({ event: eventname, callback });
      }

      send(data) {
        if (!this.getReadyState()) return /*console.warn(data)*/;
        this.socket.send(data);
      }

      emit(event, ...data) {
        // data = data.length > 0 ? data : null;
        var emitter = emits[event];
        if (emitter) this.send(emitter(...data));
      }
    }

    const emits = {
      chatmsg: function (message) {
        // 42["chatmsg","a"]
        let data = ["chatmsg", message];
        return `${42}${JSON.stringify(data)}`;
      },
      passturn: function () {
        // 42["passturn"]
        let data = ["passturn"];
        return `${42}${JSON.stringify(data)}`;
      },
      pgdrawvote: function (playerid) {
        // 42["pgdrawvote",2,0]
        let data = ["pgdrawvote", playerid, 0];
        return `${42}${JSON.stringify(data)}`;
      },
      pgswtichroom: function () {
        // 42["pgswtichroom"]
        let data = ["pgswtichroom"];
        return `${42}${JSON.stringify(data)}`;
      },
      playerafk: function () {
        // 42["playerafk"]
        let data = ["playerafk"];
        return `${42}${JSON.stringify(data)}`;
      },
      playerrated: function () {
        // 42["playerrated"]
        let data = ["playerrated"];
        return `${42}${JSON.stringify(data)}`;
      },
      sendgesture: function (gestureid) {
        // 42["sendgesture",16]
        let data = ["sendgesture", gestureid];
        return `${42}${JSON.stringify(data)}`;
      },
      sendvote: function () {
        // 42["sendvote"]
        let data = ["sendvote"];
        return `${42}${JSON.stringify(data)}`;
      },
      sendvotekick: function (playerid) {
        // 42["sendvotekick",93]
        let data = ["sendvotekick", playerid];
        return `${42}${JSON.stringify(data)}`;
      },
      wordselected: function (wordid) {
        // 42["wordselected",0]
        let data = ["sendvotekick", wordid];
        return `${42}${JSON.stringify(data)}`;
      },
      activateitem: function (itemid, isactive) {
        let data = ["clientcmd", 12, [itemid, isactive]];
        return `${42}${JSON.stringify(data)}`;
      },
      buyitem: function (itemid) {
        let data = ["clientcmd", 11, [itemid]];
        return `${42}${JSON.stringify(data)}`;
      },
      canvasobj_changeattr: function (itemid, target, value) {
        // target = zindex || shared
        let data = ["clientcmd", 234, [itemid, target, value]];
        return `${42}${JSON.stringify(data)}`;
      },
      canvasobj_getobjects: function () {
        let data = ["clientcmd", 233];
        return `${42}${JSON.stringify(data)}`;
      },
      canvasobj_remove: function (itemid) {
        let data = ["clientcmd", 232, [itemid]];
        return `${42}${JSON.stringify(data)}`;
      },
      canvasobj_setposition: function (itemid, positionX, positionY, speed) {
        let data = ["clientcmd", 230, [itemid, 100 / positionX, 100 / positionY, { movespeed: speed }]];
        return `${42}${JSON.stringify(data)}`;
      },
      canvasobj_setrotation: function (itemid, rotation) {
        let data = ["clientcmd", 231, [itemid, rotation]];
        return `${42}${JSON.stringify(data)}`;
      },
      customvoting_setvote: function (value) {
        let data = ["clientcmd", 301, [value]];
        return `${42}${JSON.stringify(data)}`;
      },
      getfpid: function (value) {
        let data = ["clientcmd", 901, [value]];
        return `${42}${JSON.stringify(data)}`;
      },
      getinventory: function () {
        let data = ["clientcmd", 10, [true]];
        return `${42}${JSON.stringify(data)}`;
      },
      getspawnsstate: function () {
        let data = ["clientcmd", 102];
        return `${42}${JSON.stringify(data)}`;
      },
      moveavatar: function (positionX, positionY) {
        let data = [
          "clientcmd",
          103,
          [1e4 * Math.floor((positionX / 100) * 1e4) + Math.floor((positionY / 100) * 1e4), false],
        ];
        return `${42}${JSON.stringify(data)}`;
      },
      setavatarprop: function () {
        let data = ["clientcmd", 115];
        return `${42}${JSON.stringify(data)}`;
      },
      setstatusflag: function (flagid, isactive) {
        let data = ["clientcmd", 3, [flagid, isactive]];
        return `${42}${JSON.stringify(data)}`;
      },
      settoken: function (playerid, tokenid) {
        let data = ["clientcmd", 2, [playerid, tokenid]];
        return `${42}${JSON.stringify(data)}`;
      },
      snapchatmessage: function (playerid, value) {
        let data = ["clientcmd", 330, [playerid, value]];
        return `${42}${JSON.stringify(data)}`;
      },
      spawnavatar: function () {
        let data = ["clientcmd", 101];
        return `${42}${JSON.stringify(data)}`;
      },
      startrollbackvoting: function () {
        let data = ["clientcmd", 320];
        return `${42}${JSON.stringify(data)}`;
      },
      trackforwardvoting: function () {
        let data = ["clientcmd", 321];
        return `${42}${JSON.stringify(data)}`;
      },
      startplay: function (room, name, avatar) {
        let data = `${420}${JSON.stringify([
          "startplay",
          name,
          room.type,
          "en",
          room.id,
          null,
          [null, "https://drawaria.online/", 1000, 1000, [null, avatar[0], avatar[1]], null],
        ])}`;
        return data;
      },
      votetrack: function (trackid) {
        let data = ["clientcmd", 1, [trackid]];
        return `${42}${JSON.stringify(data)}`;
      },
      requestcanvas: function (playerid) {
        let data = ["clientnotify", playerid, 10001];
        return `${42}${JSON.stringify(data)}`;
      },
      respondcanvas: function (playerid, base64) {
        let data = ["clientnotify", playerid, 10002, [base64]];
        return `${42}${JSON.stringify(data)}`;
      },
      galleryupload: function (playerid, imageid) {
        let data = ["clientnotify", playerid, 11, [imageid]];
        return `${42}${JSON.stringify(data)}`;
      },
      warning: function (playerid, type) {
        let data = ["clientnotify", playerid, 100, [type]];
        return `${42}${JSON.stringify(data)}`;
      },
      mute: function (playerid, targetname, mute = 0) {
        let data = ["clientnotify", playerid, 1, [mute, targetname]];
        return `${42}${JSON.stringify(data)}`;
      },
      hide: function (playerid, targetname, hide = 0) {
        let data = ["clientnotify", playerid, 3, [hide, targetname]];
        return `${42}${JSON.stringify(data)}`;
      },
      report: function (playerid, reason, targetname) {
        let data = ["clientnotify", playerid, 2, [targetname, reason]];
        return `${42}${JSON.stringify(data)}`;
      },
      line: function (playerid, lastx, lasty, x, y, isactive, size, color, ispixel) {
        let data = [
          "drawcmd",
          0,
          [lastx / 100, lasty / 100, x / 100, y / 100, isactive, -size, color, playerid, ispixel],
        ];
        return `${42}${JSON.stringify(data)}`;
      },
      erase: function (playerid, lastx, lasty, x, y, isactive, size, color) {
        let data = ["drawcmd", 1, [lastx / 100, lasty / 100, x / 100, y / 100, isactive, -size, color, playerid]];
        return `${42}${JSON.stringify(data)}`;
      },
      flood: function (x, y, color, size, r, g, b, a) {
        // 42["drawcmd",2,[x, y,color,{"0":r,"1":g,"2":b,"3":a},size]]
        let data = ["drawcmd", 2, [x / 100, y / 100, color, { 0: r, 1: g, 2: b, 3: a }, size]];
        return `${42}${JSON.stringify(data)}`;
      },
      undo: function (playerid) {
        // 42["drawcmd",3,[playerid]]
        let data = ["drawcmd", 3, [playerid]];
        return `${42}${JSON.stringify(data)}`;
      },
      clear: function () {
        // 42["drawcmd",4,[]]
        let data = ["drawcmd", 4, []];
        return `${42}${JSON.stringify(data)}`;
      },
      noop: function () {
        // 42["drawcmd",5,[0.44882022129015975,0.3157894736842105,0.44882022129015975,0.3157894736842105,true,-12,"#000000",playerid]]
      },
    };
    const events = {
      bc_announcement: function (data) {
        //
      },
      bc_chatmessage: function (data) {
        // 42["bc_chatmessage",3,"playername","a"]
      },
      bc_clearcanvasobj: function (data) {
        //
      },
      bc_clientnotify: function (data) {
        // 42["bc_clientnotify",playerid,"playername",code,null]
      },
      bc_createcanvasobj: function (data) {
        // 42["bc_createcanvasobj","1",[3,63001,0.5,0.5,0,1,null,"1",true]]
      },
      bc_customvoting_abort: function (data) {
        //
      },
      bc_customvoting_error: function (data) {
        // 42["bc_customvoting_error","rollbackcanvas"]
      },
      bc_customvoting_results: function (data) {
        // 42["bc_customvoting_results",[2],true,0]
      },
      bc_customvoting_start: function (data) {
        // 42["bc_customvoting_start",{"type":321,"secs":20,"acceptratios":[0.51],"pgdrawallow":true,"voteoptions":["YES","NO"]},1]
      },
      bc_customvoting_vote: function (data) {
        // 42["bc_customvoting_vote",1,0,[2,1,[1]]]
      },
      bc_exp: function (data) {
        // 42["bc_exp",29,4357]
      },
      bc_extannouncement: function (data) {
        //
      },
      bc_freedrawsession_reset: function (data) {
        // 42["bc_freedrawsession_reset",-1,{"votingtype":2,"currentvotes":0,"neededvotes":2,"votingtimeout":null}null]
      },
      bc_gesture: function (data) {
        // 42["bc_gesture",3,31]
      },
      bc_musicbox_play: function (data) {
        // 42["bc_musicbox_play",[30394,1,"37678185",252386,1661295694733,"Sony Masterworks - Smooth Criminal","2cellos/smooth-criminal"]]
      },
      bc_musicbox_vote: function (data) {
        // 42["bc_musicbox_vote",[[30394,1]],3,30394]
      },
      bc_pgdrawallow_results: function (data) {
        // 42["bc_pgdrawallow_results",2,true,true]
      },
      bc_pgdrawallow_startvoting: function (data) {
        // 42["bc_pgdrawallow_startvoting",2,1,false]
      },
      bc_pgdrawallow_vote: function (data) {
        // 42["bc_pgdrawallow_vote",2,1,0,false,[1,0]]
      },
      bc_playerafk: function (data) {
        // 42["bc_playerafk",28,"Jinx"]
      },
      bc_playerrated: function (data) {
        // 42["bc_playerrated",1,29,"lil cute girl",28,"Jinx",[1]]
      },
      bc_removecanvasobj: function (data) {
        // 42["bc_removecanvasobj",3,"1",null]
      },
      bc_resetplayername: function (data) {
        //
      },
      bc_round_results: function (data) {
        // 42["bc_round_results",[[5,"Jinx",15,61937,3,"63196790-c7da-11ec-8266-c399f90709b7",0],[4,"ãâ¡thick mojo â¡ã",15,65464,3,"018cdc20-47a4-11ec-b5b5-6bdacecdd51e",1]]]
      },
      bc_setavatarprop: function (data) {
        // 42["bc_setavatarprop",3]
      },
      bc_setobjattr: function (data) {
        // 42["bc_setobjattr","1","shared",false]
      },
      bc_setstatusflag: function (data) {
        // 42["bc_setstatusflag",3,3,true]
      },
      bc_spawnavatar: function (data) {
        // 42["bc_spawnavatar",3,true]
      },
      bc_startinground: function (data) {
        // 42["bc_startinground",200000,[],{"votingtype":0,"currentvotes":0,"neededvotes":2,"votingtimeout":null}]
      },
      bc_token: function (data) {
        // 42["bc_token",1,3,0]
      },
      bc_turn_abort: function (data) {
        // 42["bc_turn_abort","pass","lil cute girl","2c276aa0-dc5e-11ec-9fd3-c3a00b129da4","hammer",null]
      },
      bc_turn_fastout: function (data) {
        // 42["bc_turn_fastout",15000]
      },
      bc_turn_results: function (data) {
        // 42["bc_turn_results",[[1,"Jinx",2,2,"63196790-c7da-11ec-8266-c399f90709b7",0,0],[2,"vale",3,3,"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.xxxxxxxxxxxxx",9248]],"cavern"]
      },
      bc_turn_waitplayers: function (data) {
        // 42["bc_turn_waitplayers",true,-1,6]
      },
      bc_uc_freedrawsession_changedroom: function (data) {
        // console.log(data[2], data[3])
        // 42["bc_uc_freedrawsession_changedroom",[list of drawlines not !important]]
      },
      bc_uc_freedrawsession_start: function (data) {
        //
      },
      bc_votekick: function (data) {
        // 42["bc_votekick","Jinx",22,true]
      },
      bc_votingtimeout: function (data) {
        // 42["bc_votingtimeout",{"votingtype":2,"currentvotes":0,"neededvotes":2,"votingtimeout":null}]
      },
      bcmc_playervote: function (data) {
        // 42["bcmc_playervote","playername",{"votingtype":3,"currentvotes":1,"neededvotes":2,"votingtimeout":1661296731309}]
      },
      bcuc_getfpid: function (data) {
        // 42["bcuc_getfpid"]
        // 42["clientcmd",901,[{"visitorId":"a8923f0870050d4a4e771cd26679ab6e"}]]
      },
      bcuc_itemactivated: function (data) {
        // 42["bcuc_itemactivated",3,63001,[2,[0.5,0.5],0,1,null],1]
      },
      bcuc_itemactivationabort: function (data) {
        //
      },
      bcuc_moderatormsg: function (data) {
        // 42["bcuc_moderatormsg","Kick Player",true]
      },
      bcuc_snapchatmessage: function (data) {
        // 42["uc_snapshot","1671740010120.1.28028"]
        // https://drawaria.online/snapshot/save
      },
      mc_drawcommand: function (data) {
        // 42["mc_drawcommand",0,[0.2958167330677291,0.24970131421744324,0.2958167330677291,0.24970131421744324,true,-12,"#000000",3]]
      },
      mc_moveavatar: function (data) {
        // 42["mc_moveavatar",3,36081456,true]
      },
      mc_moveobj: function (data) {
        // 42["mc_moveobj","1",0.8266237186146181,0.24248391556470414,3,{"movespeed":500}]
      },
      mc_roomplayerschange: function (data) {
        // console.log(data[2])
        // 42["mc_roomplayerschange","join","playername",[{"id":1,"name":"á´®á´±á´ºá´µá´¹á´¬á´¿áµ","turnscore":0,"roundscore":0,"roundguesstime":0,"avatarid":"81253f20-ff93-11ec-9fd3-c3a00b129da4.1661276848726","account_stats":null,"from":"TR","medals":0,"turnstarcount":0,"statusflags":[]}{"id":3,"name":"playername","turnscore":0,"roundscore":0,"roundguesstime":0,"avatarid":"81253f20-ff93-11ec-9fd3-c3a00b129da4.1661276848726","account_stats":null,"from":"GB","medals":0,"turnstarcount":0,"statusflags":[]}],{"votingtype":2,"currentvotes":0,"neededvotes":0,"votingtimeout":null}false,3]
      },
      mc_rotateobj: function (data) {
        // 42["mc_rotateobj","1",0.2617993877991494,3]
      },
      mc_turn_guessdraw: function (data) {
        // 42["mc_turn_guessdraw",90000,[],"ÆÌµÍÍÍÍÍÍEÌµÌÍÍÍÌ Ì¼",{"votingtype":1,"currentvotes":0,"neededvotes":2,"votingtimeout":null}false]
      },
      mc_turn_tip: function (data) {
        // 42["mc_turn_tip","_a_m__"]
      },
      mc_turn_waitselectword: function (data) {
        // 42["mc_turn_waitselectword",11000,"ÆÌµÍÍÍÍÍÍEÌµÌÍÍÍÌ Ì¼",6,"c46de8f0-f493-11ec-9fd3-c3a00b129da4",2,5,false]
      },
      mc_turn_wordguessed: function (data) {
        // 42["mc_turn_wordguessed","vale",[[2,3,3,9248],[1,2,2,0]]]
      },
      uc_avatarspawninfo: function (data) {
        // 42["uc_avatarspawninfo","9a2ab5b2-b81e-4690-9af7-475d870d6e20",[[38,75059625,0]]]
      },
      uc_buyitemerror: function (data) {
        //
      },
      uc_canvasobjs: function (data) {
        // 42["uc_canvasobjs","9a2ab5b2-b81e-4690-9af7-475d870d6e20",{}]
      },
      uc_chatmuted: function (data) {
        // 42["uc_chatmuted"]
      },
      uc_coins: function (data) {
        // 42["uc_coins",-50,43]
      },
      uc_inventoryitems: function (data) {
        // 42["uc_inventoryitems",[[100,99,null],[63000,null,null],[86000,null,null]],false,false] list
      },
      uc_resetavatar: function (data) {
        //
      },
      uc_serverserstart: function (data) {
        //
      },
      uc_snapshot: function (data) {
        //
      },
      uc_tokenerror: function (data) {
        // 42["uc_tokenerror",2]
      },
      uc_turn_begindraw: function (data) {
        // 42["uc_turn_begindraw",90000,"arrow"]
      },
      uc_turn_selectword: function (data) {
        // 42["uc_turn_selectword",11000,["vase","cellar","rain"],1,7,false]
      },
      uc_turn_selectword_refreshlist: function (data) {
        // 42["uc_turn_selectword_refreshlist",["crayons","trade","team"]]
      },
      uc_turn_wordguessedlocalThis: function (data) {
        // 42["uc_turn_wordguessedlocalThis","stage",3,[[2,3,3,53938],[1,2,2,0]]]
      },
    };

    globalThis["_io"] = { events, emits };
  })("QBit");

  (function BiggerBrush() {
    const QBit = globalThis[arguments[0]];

    class BiggerBrush extends QBit {
      static dummy1 = QBit.register(this);
      static dummy2 = QBit.bind(this, "CubeEngine");

      active;
      constructor() {
        super("BiggerBrush", '<i class="fas fa-brush"></i>');
        this.active = false;
        this.#onStartup();
      }

      #onStartup() {
        this.#loadInterface();
        this.drawwidthrangeSlider = document.querySelector("#drawwidthrange");
        // this.enable();
      }

      #loadInterface() {
        this.#row1();
      }

      #row1() {
        const row = domMake.Row();
        {
          const enableButton = domMake.Button("Enable");

          enableButton.addEventListener("click", (event) => {
            this.active ? this.disable() : this.enable();
          });
          row.appendChild(enableButton);
          this.htmlElements.toggleStatusButton = enableButton;
        }
        this.htmlElements.section.appendChild(row);
      }

      enable() {
        document.querySelectorAll(".drawcontrols-button").forEach((n) => {
          n.classList.remove("drawcontrols-disabled");
        });
        this.active = true;

        this.htmlElements.toggleStatusButton.classList.add("active");
        this.htmlElements.toggleStatusButton.textContent = "Active";

        this.drawwidthrangeSlider.parentElement.previousElementSibling.lastElementChild.click();
        this.drawwidthrangeSlider.parentElement.style.display = "flex";
        this.drawwidthrangeSlider.max = 48;
        this.drawwidthrangeSlider.min = -2000;

        this.notify("success", `enabled`);
      }

      disable() {
        this.active = false;

        this.htmlElements.toggleStatusButton.classList.remove("active");
        this.htmlElements.toggleStatusButton.textContent = "Inactive";

        this.drawwidthrangeSlider.max = 45;
        this.drawwidthrangeSlider.min = -100;

        this.notify("warning", `disabled`);
      }
    }
  })("QBit");

  (function BetterBrush() {
    const QBit = globalThis[arguments[0]];

    class BetterBrush extends QBit {
      static dummy1 = QBit.register(this);
      static dummy2 = QBit.bind(this, "CubeEngine");

      constructor() {
        super("BetterBrush", '<i class="fas fa-magic"></i>');
        this.#onStartup();
      }

      #onStartup() {
        this.#loadInterface();

        {
          const target = document.querySelector(".drawcontrols-popuplist");

          const visibilityOvserver = new MutationObserver((mutations) => {
            if (this.active)
              if (mutations[0].target.style != "display:none") {
                mutations[0].target.querySelectorAll("div").forEach((n) => {
                  n.removeAttribute("style");
                });
              }
          });

          visibilityOvserver.observe(target, {
            attributes: true,
          });
        }
      }

      #loadInterface() {
        this.#row1();
      }

      #row1() {
        const row = domMake.Row();
        {
          const enableButton = domMake.Button("Enable");

          enableButton.addEventListener("click", (event) => {
            this.active ? this.disable() : this.enable();
          });

          row.appendChild(enableButton);
          this.htmlElements.toggleStatusButton = enableButton;
        }
        this.htmlElements.section.appendChild(row);
      }

      enable() {
        this.active = true;

        this.htmlElements.toggleStatusButton.classList.add("active");
        this.htmlElements.toggleStatusButton.textContent = "Active";

        this.notify("success", `enabled`);
      }

      disable() {
        this.active = false;

        this.htmlElements.toggleStatusButton.classList.remove("active");
        this.htmlElements.toggleStatusButton.textContent = "Inactive";

        this.notify("warning", `disabled`);
      }
    }
  })("QBit");

  (function BiggerStencil() {
    const QBit = globalThis[arguments[0]];

    class BiggerStencil extends QBit {
      static dummy1 = QBit.register(this);
      static dummy2 = QBit.bind(this, "CubeEngine");

      active;

      constructor() {
        super("BiggerStencil", '<i class="fas fa-parachute-box"></i>');
        this.active = false;
        this.#onStartup();
      }

      #onStartup() {
        this.#loadInterface();

        {
          const target = document.querySelector(".fa-parachute-box").parentElement;
          const accessabilityObserver = new MutationObserver((mutations) => {
            if (this.active)
              if (mutations[0].target.disabled) {
                mutations[0].target.disabled = "";
              }
          });

          accessabilityObserver.observe(target, {
            attributes: true,
          });
        }
      }

      #loadInterface() {
        this.#row1();
      }

      #row1() {
        const row = domMake.Row();
        {
          const enableButton = domMake.Button("Enable");

          enableButton.addEventListener("click", (event) => {
            this.active ? this.disable() : this.enable();
          });
          row.appendChild(enableButton);
          this.htmlElements.toggleStatusButton = enableButton;
        }
        this.htmlElements.section.appendChild(row);
      }

      enable() {
        this.active = true;

        this.htmlElements.toggleStatusButton.classList.add("active");
        this.htmlElements.toggleStatusButton.textContent = "Active";

        this.notify("success", `enabled`);
      }

      disable() {
        this.active = false;

        this.htmlElements.toggleStatusButton.classList.remove("active");
        this.htmlElements.toggleStatusButton.textContent = "Inactive";

        this.notify("warning", `disabled`);
      }
    }
  })("QBit");

  (function GhostCanvas() {
    const QBit = globalThis[arguments[0]];
    const Await = QBit.findGlobal("Await");

    QBit.Styles.addRule(
      ".ghostimage { position:fixed; top:50%; left:50%; opacity:.6; box-shadow: 0 0 1px 1px cornflowerblue inset; }"
    );

    function getBoundingClientRect(htmlElement) {
      let { top, right, bottom, left, width, height, x, y } = htmlElement.getBoundingClientRect();

      top = Number(top).toFixed();
      right = Number(right).toFixed();
      bottom = Number(bottom).toFixed();
      left = Number(left).toFixed();
      width = Number(width).toFixed();
      height = Number(height).toFixed();
      x = Number(x).toFixed();
      y = Number(y).toFixed();

      return { top, right, bottom, left, width, height, x, y };
    }

    function makeDragable(draggableElement, update) {
      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      draggableElement.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        draggableElement.style.top = Number(draggableElement.offsetTop - pos2).toFixed() + "px";
        draggableElement.style.left = Number(draggableElement.offsetLeft - pos1).toFixed() + "px";
        update();
      }

      function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }

    const radios = [];

    class GhostCanvas extends QBit {
      static dummy1 = QBit.register(this);
      static dummy2 = QBit.bind(this, "CubeEngine");
      static isFavorite = true;

      GameCanvas;
      DrawCanvas;
      DrawCanvasContext;
      DrawCanvasRect;
      loadedImages;
      drawingManager;

      constructor() {
        super("GhostCanvas", '<i class="fas fa-images"></i>');
        this.GameCanvas = document.body.querySelector("canvas#canvas");
        this.DrawCanvas = document.createElement("canvas");
        this.DrawCanvasRect = {};
        this.loadedImages = [];
        this.DrawCanvasContext = this.DrawCanvas.getContext("2d");
        this.drawingManager = new TaskManager(this);

        this.#onStartup();
        this.resetAllSettings();
      }

      #onStartup() {
        this.#loadInterface();
        this.DrawCanvas.width = this.GameCanvas.width;
        this.DrawCanvas.height = this.GameCanvas.height;
        this.DrawCanvas.style =
          "position:fixed; opacity:.6; box-shadow: 0 0 1px 1px firebrick inset; pointer-events: none;";

        const onResize = new Await(this.alignDrawCanvas.bind(this), 500);
        window.addEventListener("resize", (event) => {
          onResize.call();
        });

        this.htmlElements.input.addEventListener("change", (event) => {
          if (this.htmlElements.input.checked) this.alignDrawCanvas();
        });
      }

      #loadInterface() {
        this.#row1();
        this.#row2();
        this.#row3();
        this.#row4();
        this.#row5();
      }

      #row1() {
        const row = domMake.Row();
        {
          const resetSettingsButton = domMake.Button("Reset");
          const showCanvasInput = domMake.Tree("input", { type: "checkbox", title: "Toggle Canvas", class: "icon" });
          const clearCanvasButton = domMake.Button("Clear");

          resetSettingsButton.title = "Reset Settings";
          clearCanvasButton.title = "Clear GameCanvas";

          resetSettingsButton.addEventListener("click", (event) => {
            this.resetAllSettings();
          });

          showCanvasInput.addEventListener("change", () => {
            this.DrawCanvas.style.display = showCanvasInput.checked ? "block" : "none";
          });

          clearCanvasButton.addEventListener("click", (event) => {
            let data = ["drawcmd", 0, [0.5, 0.5, 0.5, 0.5, !0, -2000, "#FFFFFF", -1, !1]];
            this.findGlobal("BotClientInterface").siblings[0].bot.send(`${42}${JSON.stringify(data)}`);
          });

          document.body.appendChild(this.DrawCanvas);
          row.appendAll(resetSettingsButton, showCanvasInput, clearCanvasButton);
        }
        this.htmlElements.section.appendChild(row);
      }

      #row2() {
        const row = domMake.Row();
        {
          const loadPixelDataButton = domMake.Button("Load");
          const pixelsLeftToDraw = domMake.Tree("input", {
            type: "text",
            readonly: true,
            style: "text-align: center;",
            value: "0",
          });
          const clearPixelListButton = domMake.Button("Clear");

          this.htmlElements.pixelsLeftToDraw = pixelsLeftToDraw;
          loadPixelDataButton.title = "Load Pixels to draw";
          clearPixelListButton.title = "Clear Pixels to draw";

          loadPixelDataButton.addEventListener("click", (event) => {
            this.saveCanvas();
          });

          clearPixelListButton.addEventListener("click", (event) => {
            this.setPixelList([]);
          });

          row.appendAll(loadPixelDataButton, pixelsLeftToDraw, clearPixelListButton);
        }
        this.htmlElements.section.appendChild(row);
      }

      #row3() {
        const row = domMake.Row();
        {
          const startDrawingButton = domMake.Button("Start");
          const stopDrawingButton = domMake.Button("Stop");

          startDrawingButton.addEventListener("click", (event) => {
            this.drawingManager.startDrawing();
          });
          stopDrawingButton.addEventListener("click", (event) => {
            this.drawingManager.stopDrawing();
          });

          row.appendAll(startDrawingButton, stopDrawingButton);
        }
        this.htmlElements.section.appendChild(row);
      }

      #row4() {
        const row = domMake.Row();
        {
          const brushSizeInput = domMake.Tree("input", { type: "number", min: 2, value: 2, max: 200, step: 1 });
          const singleColorModeInput = domMake.Tree("input", { type: "checkbox", class: "icon" });
          const brushColorInput = domMake.Tree("input", { type: "text", value: "blue" });

          brushSizeInput.addEventListener("change", (event) => {
            this.drawingManager.brushSize = Number(brushSizeInput.value);
          });
          singleColorModeInput.addEventListener("change", (event) => {
            this.drawingManager.singleColor = Boolean(singleColorModeInput.checked);
          });
          brushColorInput.addEventListener("change", (event) => {
            this.drawingManager.brushColor = brushColorInput;
          });

          row.appendAll(brushSizeInput, singleColorModeInput, brushColorInput);
        }
        this.htmlElements.section.appendChild(row);
      }

      #row5() {
        const row = domMake.IconList();
        {
          const id = generate.uuidv4();
          const chooseGhostlyImageInput = domMake.Tree("input", { type: "file", id: id, hidden: true });
          const chooseGhostlyImageLabel = domMake.Tree("label", { for: id, class: "icon", title: "Add Image" }, [
            domMake.Tree("i", { class: "fas fa-plus" }),
          ]);

          const localThis = this;
          function onChange() {
            if (!this.files || !this.files[0]) return;
            const myFileReader = new FileReader();
            myFileReader.addEventListener("load", (event) => {
              const base64 = event.target.result.replace("image/gif", "image/png");
              localThis.createGhostImage(base64, row);
            });
            myFileReader.readAsDataURL(this.files[0]);
          }
          chooseGhostlyImageInput.addEventListener("change", onChange);

          row.appendAll(chooseGhostlyImageLabel, chooseGhostlyImageInput);
        }
        {
          const resetImageSelectionLabel = domMake.Tree("div", { class: "icon", title: "Unselect" }, [
            domMake.Tree("i", { class: "fas fa-chevron-left" }),
          ]);
          resetImageSelectionLabel.addEventListener("click", () => {
            document.body.querySelectorAll('input[name="ghostimage"]').forEach((node) => {
              node.checked = false;
            });
          });
          row.appendChild(resetImageSelectionLabel);
        }
        this.htmlElements.section.appendChild(row);
      }

      createGhostImage(imageSource, row) {
        this.alignDrawCanvas();
        const image = this.loadExtension(GhostImage, (reference) => {
          this.loadedImages.push(reference);
        });
        row.appendChild(image.htmlElements.label);
        image.setImageSource(imageSource);
      }

      clearCanvas() {
        this.DrawCanvasContext.clearRect(0, 0, this.DrawCanvas.width, this.DrawCanvas.height);
      }

      saveCanvas() {
        this.getAllPixels();
      }

      resetAllSettings() {
        this.clearCanvas();
        this.loadedImages.forEach((image, index) => {
          setTimeout(() => {
            image.reduceToAtoms();
          }, 10 * index);
        });
        this.drawingManager.stopDrawing();
        this.setPixelList([]);
        this.alignDrawCanvas(true);
      }

      alignDrawCanvas() {
        if (arguments[0]) {
          this.DrawCanvas.width = this.GameCanvas.width;
          this.DrawCanvas.height = this.GameCanvas.height;
        }

        const GameCanvasRect = getBoundingClientRect(this.GameCanvas);

        this.DrawCanvas.style.top = `${GameCanvasRect.top}px`;
        this.DrawCanvas.style.left = `${GameCanvasRect.left}px`;
        this.DrawCanvas.style.width = `${GameCanvasRect.width}px`;
        this.DrawCanvas.style.height = `${GameCanvasRect.height}px`;

        const DrawCanvasRect = getBoundingClientRect(this.DrawCanvas);

        if (DrawCanvasRect.width <= 0 || DrawCanvasRect.height <= 0)
          return Object.assign(this.DrawCanvasRect, DrawCanvasRect);
        // DrawCanvasRect.alignModifierX = Number(this.DrawCanvas.width / DrawCanvasRect.width).toFixed(2);
        // DrawCanvasRect.alignModifierY = Number(this.DrawCanvas.height / DrawCanvasRect.height).toFixed(2);

        DrawCanvasRect.drawModifierX = 100 / DrawCanvasRect.width;
        DrawCanvasRect.drawModifierY = 100 / DrawCanvasRect.height;
        Object.assign(this.DrawCanvasRect, DrawCanvasRect);
      }

      getAllPixels() {
        const image = this.DrawCanvasContext.getImageData(
          0,
          0,
          this.DrawCanvasContext.canvas.width,
          this.DrawCanvasContext.canvas.height
        );
        const pixels = [];

        for (let index = 0; index < image.data.length; index += 4) {
          // const x = (index * 0.25) % image.width;
          // const y = Math.floor((index * 0.25) / image.width);
          const x = (index * 0.25) % image.width;
          const y = Math.floor((index * 0.25) / image.width);

          const r = image.data[index + 0];
          const g = image.data[index + 1];
          const b = image.data[index + 2];
          const a = image.data[index + 3];
          // const color = rgbaArrayToHex([r, g, b, a]);
          const color = [r, g, b, a];
          pixels.push({ x1: x, y1: y, x2: x, y2: y, color });
        }

        this.setPixelList(pixels);
      }

      getNoneTransparentPixels() {
        this.getAllPixels();

        const newPixelArray = this.drawingManager.pixelList.filter((pixel) => {
          return pixel.color !== "#000000";
          // return /^#0[0-8]0[0-8]0[0-8]$/g.test(pixel.color);
        });

        this.setPixelList(newPixelArray);
      }

      setPixelList(pixelArray) {
        this.drawingManager.pixelList = pixelArray;
        this.htmlElements.pixelsLeftToDraw.value = pixelArray.length;
      }
    }

    class GhostImage extends QBit {
      image;
      rect;

      constructor() {
        super("GhostImage", '<i class="fas fa-image-polaroid"></i>');
        this.#onStartup();
      }

      #onStartup() {
        this.#loadInterface();

        this.image = domMake.Tree("img", { class: "ghostimage" });
        this.image.addEventListener("mousedown", (event) => {
          this.htmlElements.label.click();
        });

        this.htmlElements.input.type = "radio";
        this.htmlElements.input.name = "ghostimage";

        radios.push(this.htmlElements.input);
        this.htmlElements.input.addEventListener("change", (event) => {
          radios.forEach(function (radio) {
            document.body.querySelector(`label[for="${radio.id}"]`).classList.remove("active");
          });
          this.htmlElements.label.classList.add("active");
        });

        document.body.appendChild(this.image);
        makeDragable(this.image, this.updatePosition.bind(this));
        this.updatePosition();
      }

      #loadInterface() {
        this.#row1();
        this.#row2();
      }

      #row1() {
        const row = domMake.Row();
        {
          const paintCanvasButton = domMake.Button("Place");

          paintCanvasButton.addEventListener("click", (event) => {
            this.drawImage();
          });

          row.appendAll(paintCanvasButton);
        }
        {
          const enableButton = domMake.Button("Delete");

          enableButton.addEventListener("click", (event) => {
            this.reduceToAtoms();
          });
          row.appendChild(enableButton);
          this.htmlElements.toggleStatusButton = enableButton;
        }
        this.htmlElements.section.appendChild(row);
      }

      #row2() {
        const row = domMake.Row();
        {
          const scaleInput = domMake.Tree("input", {
            type: "number",
            title: "rotation",
            min: 0.1,
            max: 10,
            value: 1,
            step: 0.02,
          });

          scaleInput.addEventListener("change", () => {
            this.image.style.scale = scaleInput.value;
          });

          this.htmlElements.scaleInput = scaleInput;

          row.appendAll(scaleInput);
        }
        {
          const rotationInput = domMake.Tree("input", { type: "number", title: "rotation", value: 0, step: 1 });

          rotationInput.addEventListener("change", () => {
            this.image.style.rotate = `${rotationInput.value}deg`;
          });

          this.htmlElements.rotationInput = rotationInput;

          row.appendChild(rotationInput);
        }
        this.htmlElements.section.appendChild(row);
      }

      drawImage() {
        this.updatePosition();
        const ctx = this.parent.DrawCanvasContext;

        const offsetTop = Number(this.rect.top) - Number(this.parent.DrawCanvasRect.top);
        const offsetLeft = Number(this.rect.left) - Number(this.parent.DrawCanvasRect.left);

        // const multiX = Number(this.parent.DrawCanvasRect.alignModifierX);
        // const multiY = Number(this.parent.DrawCanvasRect.alignModifierY);

        const angle = (Math.PI / 180) * Number(this.htmlElements.rotationInput.value);
        const scale = Number(this.htmlElements.scaleInput.value);

        const imageWidth = this.image.width * scale;
        const imageHeight = this.image.height * scale;
        const imgHalfWidth = imageWidth * 0.5;
        const imgHalfHeight = imageHeight * 0.5;

        ctx.save();
        ctx.translate(offsetLeft + imgHalfWidth, offsetTop + imgHalfHeight);
        ctx.rotate(angle);
        ctx.translate(-imgHalfWidth, -imgHalfHeight);
        ctx.drawImage(this.image, 0, 0, imageWidth, imageHeight);
        ctx.restore();
      }

      setImageSource(imageSource) {
        this.image.src = imageSource;
        this.setIcon(`<img src="${this.image.src}">`);
      }

      updatePosition() {
        this.rect = getBoundingClientRect(this.image);
      }

      reduceToAtoms() {
        this.image.remove();
        const pos = radios.indexOf(this.htmlElements.input);
        if (~pos) radios.splice(pos, 1);

        let pos2 = this.parent.loadedImages.indexOf(this);
        if (~pos2) {
          this.parent.loadedImages.splice(pos2, 1);
        }
        this._EXP_destroy(!0);
      }
    }

    class TaskManager {
      isRunning;
      pixelList;
      parent;
      BotClientManager;
      singleColor;
      brushColor;
      brushSize;

      constructor(parent) {
        this.pixelList = [];
        this.singleColor = !1;
        this.brushColor = "blue";
        this.brushSize = 2;
        this.parent = parent;
      }

      startDrawing() {
        this.BotClientManager = this.parent.findGlobal("BotClientManager")?.siblings[0];
        this.isRunning = true;
        this.doTasks();
        this.parent.notify("info", "Started");
      }

      stopDrawing() {
        this.isRunning = false;
      }

      doTasks() {
        if (!this.BotClientManager || this.BotClientManager.children.length <= 0) this.stopDrawing();
        if (!this.isRunning) return this.parent.notify("info", "Stopped");

        this.BotClientManager.children.forEach((botClientInterface, index) => {
          this.parseAndSendPixel(botClientInterface, index);
        });

        setTimeout(() => {
          this.doTasks();
        }, 1);
      }

      parseAndSendPixel(botClientInterface, index) {
        if (this.pixelList.length <= 0) return this.stopDrawing();
        if (!botClientInterface.bot || !botClientInterface.bot.getReadyState()) return;

        const task = index % 2 == 0 ? this.pixelList.shift() : this.pixelList.pop();
        botClientInterface.bot.send(this.convertTasks(task));
        this.parent.htmlElements.pixelsLeftToDraw.value = this.pixelList.length;
      }

      convertTasks(pixel) {
        const playerid = -1;
        const lastx = pixel.x1 * this.parent.DrawCanvasRect.drawModifierX;
        const lasty = pixel.y1 * this.parent.DrawCanvasRect.drawModifierY;
        const x = pixel.x2 * this.parent.DrawCanvasRect.drawModifierX;
        const y = pixel.y2 * this.parent.DrawCanvasRect.drawModifierY;
        const isactive = !0;
        const size = pixel.size ?? this.brushSize;
        const pxColor = pixel.color;
        const color = this.singleColor
          ? this.brushColor
          : `rgba(${pxColor[0]},${pxColor[1]},${pxColor[2]},${parseFloat(pxColor[3] * 0.390625).toFixed(2)})`;
        const ispixel = !1;

        let data = [
          "drawcmd",
          0,
          [lastx * 0.01, lasty * 0.01, x * 0.01, y * 0.01, isactive, -size, color, playerid, ispixel],
        ];

        return `${42}${JSON.stringify(data)}`;
      }
    }
  })("QBit");

  (function GhostCanvasAlgorithms() {
    const QBit = globalThis[arguments[0]];

    function sortByColor(pixel1, pixel2) {
      const color1 = rgbaArrayToHex(pixel1.color);
      const color2 = rgbaArrayToHex(pixel2.color);
      if (color1 < color2) {
        return -1;
      }
      if (color1 > color2) {
        return 1;
      }
      return 0;
    }

    function intToHex(number) {
      return number.toString(16).padStart(2, "0");
    }

    function rgbaArrayToHex(rgbaArray) {
      const r = intToHex(rgbaArray[0]);
      const g = intToHex(rgbaArray[1]);
      const b = intToHex(rgbaArray[2]);
      const a = intToHex(rgbaArray[3]);
      return "#" + r + g + b + a;
    }

    function areSameColor(colorArray1, colorArray2, allowedDifference = 8) {
      var red = colorArray1[0] - colorArray2[0];
      var green = colorArray1[1] - colorArray2[1];
      var blue = colorArray1[2] - colorArray2[2];

      if (red < 0) red = red * -1;
      if (green < 0) green = green * -1;
      if (blue < 0) blue = blue * -1;

      if (red > allowedDifference || green > allowedDifference || blue > allowedDifference) return false;
      return true;
    }

    class GhostCanvasMinify extends QBit {
      static dummy1 = QBit.register(this);
      static dummy2 = QBit.bind(this, "GhostCanvas");

      constructor() {
        super("Minify", '<i class="fas fa-compress-arrows-alt"></i>');
        this.minOpacity = 20;
        this.maxFuzzyness = 32;
        this.#onStartup();
      }

      #onStartup() {
        this.#loadInterface();
      }

      #loadInterface() {
        this.#row1();
        this.#row2();
        this.#row3();
        this.#row4();
      }

      #row1() {
        const row = domMake.Row();
        {
          const fuzzynessInput = domMake.Tree("input", {
            type: "number",
            title: "Fuzzyness",
            step: 1,
            min: 0,
            max: 255,
            value: 10,
          });
          const opacityInput = domMake.Tree("input", {
            type: "number",
            title: "Opacity",
            step: 1,
            min: 0,
            max: 255,
            value: 30,
          });

          fuzzynessInput.addEventListener("change", () => {
            this.maxFuzzyness = Number(fuzzynessInput.value);
          });

          opacityInput.addEventListener("change", () => {
            this.minOpacity = Number(opacityInput.value);
          });

          row.appendAll(fuzzynessInput, opacityInput);
        }
        this.htmlElements.section.appendChild(row);
      }
      #row2() {
        const row = domMake.Row();
        {
          const minifyPixelsArrayButton = domMake.Button("Minify");

          minifyPixelsArrayButton.addEventListener("click", (event) => {
            this.minifyPixelsArray();
          });

          row.appendAll(minifyPixelsArrayButton);
        }
        this.htmlElements.section.appendChild(row);
      }
      #row3() {}
      #row4() {}

      minifyPixelsArray() {
        const pixelArray = this.parent.drawingManager.pixelList;
        const newPixelArray = [];

        let currentPixel = pixelArray[0];
        let lastPixel = currentPixel;
        let currentLine = currentPixel;

        for (let index = 0; index < pixelArray.length; index++) {
          currentPixel = pixelArray[index];

          if (lastPixel.color[3] < 10 && currentPixel.color[3] >= 10) {
            // From Transparent To Solid

            currentLine = currentPixel;
          } else if (lastPixel.color[3] >= 10 && currentPixel.color[3] < 10) {
            // From Solid To Transparent

            currentLine.x2 = lastPixel.x2;
            newPixelArray.push(currentLine);
            currentLine = currentPixel;
          } else if (currentPixel.color[3] >= 10 && lastPixel.color[3] >= 10) {
            // From Solid To Solid

            if (
              currentLine.y1 !== currentPixel.y1 ||
              lastPixel.x2 !== currentPixel.x1 - 1 ||
              !areSameColor(lastPixel.color, currentPixel.color, this.maxFuzzyness)
            ) {
              currentLine.x2 = lastPixel.x2;
              newPixelArray.push(currentLine);
              currentLine = currentPixel;
            }
          } else {
            // From Transparent To Transparent
          }

          lastPixel = currentPixel;
        }
        // if (currentLine.color[3] >= 10) newPixelArray.push(currentLine);

        this.parent.setPixelList(newPixelArray);
      }

      minifyPixelsArray_alt() {
        const pixelArray = this.parent.drawingManager.pixelList;
        const newPixelArray = [];
        var lastPixel = pixelArray[0];
        var currentLine = lastPixel;
        const stepsize = this.parent.stepsize ?? 1;

        for (let i = 0; i < pixelArray.length; i += stepsize) {
          const currentPixel = pixelArray[i];

          if (currentPixel.y1 !== currentLine.y1 || currentPixel.color !== lastPixel.color) {
            currentLine.x2 = lastPixel.x2;
            if (!/^#[0-9a-fA-F]{6}[0-4]{2}$/.test(lastPixel.color)) newPixelArray.push(currentLine);
            currentLine = currentPixel;
          }

          lastPixel = currentPixel;
        }
        newPixelArray.push(currentLine);

        this.parent.setPixelList(newPixelArray);
      }
    }

    class GhostCanvasSort extends QBit {
      static dummy1 = QBit.register(this);
      static dummy2 = QBit.bind(this, "GhostCanvas");

      constructor() {
        super("Sort", '<i class="fas fa-sort-numeric-down"></i>');
        this.#onStartup();
      }

      #onStartup() {
        this.#loadInterface();
      }

      #loadInterface() {
        this.#row1();
        this.#row2();
        this.#row3();
        this.#row4();
      }

      #row1() {
        const row = domMake.Row();
        {
          const sortPixelsArrayButton = domMake.Button("Sort");

          sortPixelsArrayButton.addEventListener("click", (event) => {
            this.sortPixelsArray();
          });

          row.appendAll(sortPixelsArrayButton);
        }
        this.htmlElements.section.appendChild(row);
      }
      #row2() {}
      #row3() {}
      #row4() {}

      sortPixelsArray() {
        const pixelArray = this.parent.drawingManager.pixelList;

        const newPixelArray = [...pixelArray].sort(sortByColor);

        this.parent.setPixelList(newPixelArray);
      }
    }
  })("QBit");

  (function BotClientInterface() {
    const QBit = globalThis[arguments[0]];
    const BotClient = QBit.findGlobal("BotClient");

    let botcount = 0;
    const radios = [];

    function getMasterId() {
      return document.querySelector(".playerlist-name-self")?.parentElement.dataset.playerid || 0;
    }

    function parseAvatarURL(arr = []) {
      return `https://drawaria.online/avatar/cache/${arr.length > 0 ? arr.join(".") : "default"}.jpg`;
    }

    class BotClientManager extends QBit {
      static dummy1 = QBit.register(this);
      static dummy2 = QBit.bind(this, "CubeEngine");

      constructor() {
        super(`BotClientManager`, '<i class="fas fa-robot"></i>');
        this.#onStartup();
      }

      #onStartup() {
        this.#loadInterface();
      }

      #loadInterface() {
        this.#row1();
      }

      #row1() {
        const row = domMake.IconList();
        {
          const id = generate.uuidv4();
          const createBotClientInterfaceInput = domMake.Tree("input", { type: "button", id: id, hidden: true });
          const createBotClientInterfaceLabel = domMake.Tree("label", { for: id, class: "icon", title: "Add Image" }, [
            domMake.Tree("i", { class: "fas fa-plus" }),
          ]);

          createBotClientInterfaceInput.addEventListener("click", () => {
            this.createBotClientInterface();
          });

          row.appendAll(createBotClientInterfaceLabel);
          row.appendAll(createBotClientInterfaceInput);
        }
        {
          const id = generate.uuidv4();
          const removeBotClientInterfaceInput = domMake.Tree("input", { type: "button", id: id, hidden: true });
          const removeBotClientInterfaceLabel = domMake.Tree("label", { for: id, class: "icon", title: "Add Image" }, [
            domMake.Tree("i", { class: "fas fa-minus" }),
          ]);

          removeBotClientInterfaceInput.addEventListener("click", () => {
            this.deleteBotClientInterface();
          });

          row.appendAll(removeBotClientInterfaceLabel);
          row.appendAll(removeBotClientInterfaceInput);
        }
        this.htmlElements.header.before(row);
      }

      createBotClientInterface() {
        const instance = this.loadExtension(BotClientInterface);
        instance.htmlElements.input.type = "radio";
        instance.htmlElements.input.name = "botClient";

        radios.push(instance.htmlElements.input);
        instance.htmlElements.input.addEventListener("change", (event) => {
          radios.forEach(function (radio) {
            document.body.querySelector(`label[for="${radio.id}"]`).classList.remove("active");
          });
          instance.htmlElements.label.classList.add("active");
        });

        return instance;
      }

      deleteBotClientInterface() {
        const input = document.body.querySelector(`input[name="botClient"]:checked`);

        const matches = this.children.filter((child) => {
          return child.htmlElements.input === input;
        });
        if (matches.length <= 0) return;

        const instance = matches[0];

        instance.bot.disconnect();

        const labelPos = radios.indexOf(instance.htmlElements.input);
        if (~labelPos) radios.splice(labelPos, 1);

        instance._EXP_destroy(!0);
      }
    }

    class BotClientInterface extends QBit {
      static dummy1 = QBit.register(this);
      // static dummy2 = QBit.bind(this, 'CubeEngine');
      // static dummy3 = QBit.bind(this, 'CubeEngine');

      constructor() {
        super(`Bot${botcount}`, '<i class="fas fa-robot"></i>');
        this.bot = new BotClient();
        this.#onStartup();
      }

      #onStartup() {
        this.#loadInterface();
        this.setClientName(this.bot.name);
        this.setClientIcon(this.bot.avatar);
      }

      #loadInterface() {
        this.#row1();
      }

      #row1() {
        const row = domMake.Row();
        {
          let join_button = domMake.Button("Enter");
          let leave_button = domMake.Button("Leave");

          join_button.addEventListener("click", (event) => {
            this.bot.enterRoom(document.querySelector("#invurl").value);
          });

          leave_button.addEventListener("click", (event) => {
            this.bot.disconnect();
          });

          row.appendAll(join_button, leave_button);
        }
        this.htmlElements.section.appendChild(row);
      }

      setClientName(name) {
        this.setName(name);
        this.bot.name = name;
      }

      setClientIcon(icon) {
        this.setIcon(`<img src="${parseAvatarURL(this.bot.avatar)}">`);
        this.bot.avatar = icon;
      }
    }
  })("QBit");

  (function BotClientInteractions() {
    const QBit = globalThis[arguments[0]];

    class BotPersonality extends QBit {
      static dummy1 = QBit.register(this);
      static dummy2 = QBit.bind(this, "BotClientInterface");

      constructor() {
        super("Personality", '<i class="fas fa-user-cog"></i>');
        this.#onStartup();
      }

      #onStartup() {
        this.#loadInterface();
      }

      #loadInterface() {
        this.#row1();
        this.#row2();
      }

      #row1() {
        const row = domMake.Row();
        {
          let botName = domMake.Tree("input", { type: "text", placeholder: "Your Bots name" });
          let botNameAccept = domMake.Tree("button", { class: "icon" }, [domMake.Tree("i", { class: "fas fa-check" })]);

          botNameAccept.addEventListener("click", (event) => {
            this.parent.setClientName(botName.value);
          });

          row.appendAll(botName, botNameAccept);
        }
        this.htmlElements.section.appendChild(row);
      }

      #row2() {
        let id = generate.uuidv4();
        const row = domMake.Row();
        {
          let botAvatarUpload = domMake.Tree("input", { type: "file", id: id, hidden: true });
          let botAvatarAccept = domMake.Tree("label", { for: id, class: "btn btn-outline-secondary" }, [
            "Upload BotAvatar",
          ]);

          const localThis = this;
          function onChange() {
            if (!this.files || !this.files[0]) return;
            let myFileReader = new FileReader();
            myFileReader.addEventListener("load", (e) => {
              let a = e.target.result.replace("image/gif", "image/png");
              fetch("https://drawaria.online/uploadavatarimage", {
                method: "POST",
                body: "imagedata=" + encodeURIComponent(a) + "&fromeditor=true",
                headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
              }).then((res) =>
                res.text().then((body) => {
                  localThis.parent.setClientIcon(body.split("."));
                })
              );
            });
            myFileReader.readAsDataURL(this.files[0]);
          }
          botAvatarUpload.addEventListener("change", onChange);

          row.appendAll(botAvatarUpload, botAvatarAccept);
        }
        this.htmlElements.section.appendChild(row);
      }
    }

    class BotSozials extends QBit {
      static dummy1 = QBit.register(this);
      static dummy2 = QBit.bind(this, "BotClientInterface");

      constructor() {
        super("Socialize", '<i class="fas fa-comment-dots"></i>');
        this.#onStartup();
      }

      #onStartup() {
        this.#loadInterface();
      }

      #loadInterface() {
        this.#row1();
        this.#row2();
      }

      #row1() {
        const row = domMake.Row();
        {
          let messageClear_button = domMake.Button('<i class="fas fa-strikethrough"></i>');
          let messageSend_button = domMake.Button('<i class="fas fa-paper-plane"></i>');
          let message_input = domMake.Tree("input", { type: "text", placeholder: "message..." });

          messageClear_button.classList.add("icon");
          messageSend_button.classList.add("icon");

          messageClear_button.addEventListener("click", (event) => {
            message_input.value = "";
          });

          messageSend_button.addEventListener("click", (event) => {
            this.parent.bot.emit("chatmsg", message_input.value);
          });

          message_input.addEventListener("keypress", (event) => {
            if (event.keyCode != 13) return;
            this.parent.bot.emit("chatmsg", message_input.value);
          });

          row.appendAll(messageClear_button, message_input, messageSend_button);
        }
        this.htmlElements.section.appendChild(row);
      }

      #row2() {
        const row = domMake.IconList();
        // row.classList.add('nowrap');
        {
          document
            .querySelectorAll("#gesturespickerselector .gesturespicker-container .gesturespicker-item")
            .forEach((node, index) => {
              let clone = node.cloneNode(true);
              clone.classList.add("icon");
              clone.addEventListener("click", (event) => {
                this.parent.bot.emit("sendgesture", index);
              });
              row.appendChild(clone);
            });
        }
        this.htmlElements.section.appendChild(row);
      }
    }

    class BotTokenGiver extends QBit {
      static dummy1 = QBit.register(this);
      static dummy2 = QBit.bind(this, "BotClientInterface");

      constructor() {
        super("Tokken", '<i class="fas fa-thumbs-up"></i>');
        this.#onStartup();
      }

      #onStartup() {
        this.#loadInterface();
      }

      #loadInterface() {
        this.#row1();
        this.#row2();
      }

      #row1() {
        const row = domMake.IconList();
        // row.classList.add('nowrap');
        {
          let listOfTokens = [
            '<i class="fas fa-thumbs-up"></i>',
            '<i class="fas fa-heart"></i>',
            '<i class="fas fa-paint-brush"></i>',
            '<i class="fas fa-cocktail"></i>',
            '<i class="fas fa-hand-peace"></i>',
            '<i class="fas fa-feather-alt"></i>',
            '<i class="fas fa-trophy"></i>',
            '<i class="fas fa-mug-hot"></i>',
            '<i class="fas fa-gift"></i>',
          ];
          listOfTokens.forEach((token, index) => {
            let tokenSend_button = domMake.Button(token);
            tokenSend_button.classList.add("icon");
            tokenSend_button.addEventListener("click", () => {
              this.parent.bot.room.players.forEach((player) => {
                this.parent.bot.emit("settoken", player.id, index);
              });
            });
            row.appendChild(tokenSend_button);
          });
        }
        this.htmlElements.section.appendChild(row);
      }

      #row2() {
        const row = domMake.Row();
        {
          let toggleStatus_button = domMake.Button("Toggle Status");
          toggleStatus_button.addEventListener("click", () => {
            this.parent.bot.attributes.status = !this.parent.bot.attributes.status;
            let status = this.parent.bot.attributes.status;
            toggleStatus_button.classList[status ? "add" : "remove"]("active");
            this.parent.bot.emit("setstatusflag", 0, status);
            this.parent.bot.emit("setstatusflag", 1, status);
            this.parent.bot.emit("setstatusflag", 2, status);
            this.parent.bot.emit("setstatusflag", 3, status);
            this.parent.bot.emit("setstatusflag", 4, status);
          });
          row.appendChild(toggleStatus_button);
        }
        this.htmlElements.section.appendChild(row);
      }
    }

    class BotCanvasAvatar extends QBit {
      static dummy1 = QBit.register(this);
      static dummy2 = QBit.bind(this, "BotClientInterface");

      constructor() {
        super("SpawnAvatar", '<i class="fas fa-user-circle"></i>');
        this.#onStartup();
      }

      #onStartup() {
        this.#loadInterface();
      }

      #loadInterface() {
        this.#row1();
      }

      #row1() {
        const row = domMake.Row();
        {
          // Spawn && Move Avatar
          let avatarPosition = { x: 0, y: 0 };

          let avatarSpawn_button = domMake.Button('<i class="fas fa-exchange-alt"></i>');
          let avatarChange_button = domMake.Button('<i class="fas fa-retweet"></i>');
          let avatarPositionX_button = domMake.Tree("input", {
            type: "number",
            value: 2,
            min: 2,
            max: 98,
            title: "Left",
          });
          let avatarPositionY_button = domMake.Tree("input", {
            type: "number",
            value: 2,
            min: 2,
            max: 98,
            title: "Top",
          });

          avatarSpawn_button.addEventListener("click", (event) => {
            this.parent.bot.emit("spawnavatar");
            this.parent.bot.attributes.spawned = !this.parent.bot.attributes.spawned;
          });

          avatarChange_button.addEventListener("click", (event) => {
            this.parent.bot.emit("setavatarprop");
            this.parent.bot.attributes.rounded = !this.parent.bot.attributes.rounded;
          });

          avatarPositionX_button.addEventListener("change", (event) => {
            avatarPosition.x = avatarPositionX_button.value;
            this.parent.bot.emit("moveavatar", avatarPosition.x, avatarPosition.y);
          });

          avatarPositionY_button.addEventListener("change", (event) => {
            avatarPosition.y = avatarPositionY_button.value;
            this.parent.bot.emit("moveavatar", avatarPosition.x, avatarPosition.y);
          });

          avatarSpawn_button.title = "Spawn Avatar";
          avatarChange_button.title = "Toggle Round Avatar";

          row.appendAll(avatarSpawn_button, avatarPositionX_button, avatarPositionY_button, avatarChange_button);
        }
        this.htmlElements.section.appendChild(row);
      }
    }

    function getMyId() {
      return document.querySelector(".playerlist-name-this")?.parentElement.dataset.playerid || 0;
    }

    function parseAvatarURL(arr = []) {
      return `https://drawaria.online/avatar/cache/${arr.length > 0 ? arr.join(".") : "default"}.jpg`;
    }
  })("QBit");

  (function AutoTranslate() {
    const QBit = globalThis[arguments[0]];

    const unicodeLanguagePatterns = new Map();
    unicodeLanguagePatterns.set("Common", /\p{Script=Common}+/u); // CommonPattern
    unicodeLanguagePatterns.set("Arabic", /\p{Script=Arabic}+/u); // ArabicPattern
    unicodeLanguagePatterns.set("Armenian", /\p{Script=Armenian}+/u); // ArmenianPattern
    unicodeLanguagePatterns.set("Bengali", /\p{Script=Bengali}+/u); // BengaliPattern
    unicodeLanguagePatterns.set("Bopomofo", /\p{Script=Bopomofo}+/u); // BopomofoPattern
    unicodeLanguagePatterns.set("Braille", /\p{Script=Braille}+/u); // BraillePattern
    unicodeLanguagePatterns.set("Buhid", /\p{Script=Buhid}+/u); // BuhidPattern
    unicodeLanguagePatterns.set("Canadian_Aboriginal", /\p{Script=Canadian_Aboriginal}+/u); // Canadian_AboriginalPattern
    unicodeLanguagePatterns.set("Cherokee", /\p{Script=Cherokee}+/u); // CherokeePattern
    unicodeLanguagePatterns.set("Cyrillic", /\p{Script=Cyrillic}+/u); // CyrillicPattern
    unicodeLanguagePatterns.set("Devanagari", /\p{Script=Devanagari}+/u); // DevanagariPattern
    unicodeLanguagePatterns.set("Ethiopic", /\p{Script=Ethiopic}+/u); // EthiopicPattern
    unicodeLanguagePatterns.set("Georgian", /\p{Script=Georgian}+/u); // GeorgianPattern
    unicodeLanguagePatterns.set("Greek", /\p{Script=Greek}+/u); // GreekPattern
    unicodeLanguagePatterns.set("Gujarati", /\p{Script=Gujarati}+/u); // GujaratiPattern
    unicodeLanguagePatterns.set("Gurmukhi", /\p{Script=Gurmukhi}+/u); // GurmukhiPattern
    unicodeLanguagePatterns.set("Han", /\p{Script=Han}+/u); // HanPattern
    unicodeLanguagePatterns.set("Hangul", /\p{Script=Hangul}+/u); // HangulPattern
    unicodeLanguagePatterns.set("Hanunoo", /\p{Script=Hanunoo}+/u); // HanunooPattern
    unicodeLanguagePatterns.set("Hebrew", /\p{Script=Hebrew}+/u); // HebrewPattern
    unicodeLanguagePatterns.set("Hiragana", /\p{Script=Hiragana}+/u); // HiraganaPattern
    unicodeLanguagePatterns.set("Inherited", /\p{Script=Inherited}+/u); // InheritedPattern
    unicodeLanguagePatterns.set("Kannada", /\p{Script=Kannada}+/u); // KannadaPattern
    unicodeLanguagePatterns.set("Katakana", /\p{Script=Katakana}+/u); // KatakanaPattern
    unicodeLanguagePatterns.set("Khmer", /\p{Script=Khmer}+/u); // KhmerPattern
    unicodeLanguagePatterns.set("Lao", /\p{Script=Lao}+/u); // LaoPattern
    unicodeLanguagePatterns.set("Latin", /\p{Script=Latin}+/u); // LatinPattern
    unicodeLanguagePatterns.set("Limbu", /\p{Script=Limbu}+/u); // LimbuPattern
    unicodeLanguagePatterns.set("Malayalam", /\p{Script=Malayalam}+/u); // MalayalamPattern
    unicodeLanguagePatterns.set("Mongolian", /\p{Script=Mongolian}+/u); // MongolianPattern
    unicodeLanguagePatterns.set("Myanmar", /\p{Script=Myanmar}+/u); // MyanmarPattern
    unicodeLanguagePatterns.set("Ogham", /\p{Script=Ogham}+/u); // OghamPattern
    unicodeLanguagePatterns.set("Oriya", /\p{Script=Oriya}+/u); // OriyaPattern
    unicodeLanguagePatterns.set("Runic", /\p{Script=Runic}+/u); // RunicPattern
    unicodeLanguagePatterns.set("Sinhala", /\p{Script=Sinhala}+/u); // SinhalaPattern
    unicodeLanguagePatterns.set("Syriac", /\p{Script=Syriac}+/u); // SyriacPattern
    unicodeLanguagePatterns.set("Tagalog", /\p{Script=Tagalog}+/u); // TagalogPattern
    unicodeLanguagePatterns.set("Tagbanwa", /\p{Script=Tagbanwa}+/u); // TagbanwaPattern
    unicodeLanguagePatterns.set("Tamil", /\p{Script=Tamil}+/u); // TamilPattern
    unicodeLanguagePatterns.set("Telugu", /\p{Script=Telugu}+/u); // TeluguPattern
    unicodeLanguagePatterns.set("Thaana", /\p{Script=Thaana}+/u); // ThaanaPattern
    unicodeLanguagePatterns.set("Thai", /\p{Script=Thai}+/u); // ThaiPattern
    unicodeLanguagePatterns.set("Tibetan", /\p{Script=Tibetan}+/u); // TibetanPattern
    unicodeLanguagePatterns.set("Yi", /\p{Script=Yi}+/u); // YiPattern

    const observeDOM = (function () {
      const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
      /**
       * @param {HTMLElement} nodeToObserve
       * @param {Function} callback
       */
      return function (nodeToObserve, callback) {
        if (!nodeToObserve || nodeToObserve.nodeType !== 1) return;

        if (MutationObserver) {
          // define a new observer
          var mutationObserver = new MutationObserver(callback);

          // have the observer observe for changes in children
          mutationObserver.observe(nodeToObserve, { childList: true, subtree: !1 });
          return mutationObserver;
        }

        // browser support fallback
        else if (window.addEventListener) {
          nodeToObserve.addEventListener("DOMNodeInserted", callback, false);
          nodeToObserve.addEventListener("DOMNodeRemoved", callback, false);
        }
      };
    })();

    class AutoTranslate extends QBit {
      static dummy1 = QBit.register(this);
      static dummy2 = QBit.bind(this, "CubeEngine");

      active;

      constructor() {
        super("AutoTranslate", '<i class="fas fa-language"></i>');
        this.#onStartup();
      }

      #onStartup() {
        this.#loadInterface();

        this.active = false;

        const observable = document.querySelector("#chatbox_messages");

        observeDOM(observable, (mutation) => {
          if (!this.active) return;

          const addedNodes = [];
          const removedNodes = [];

          mutation.forEach((record) => record.addedNodes.length & addedNodes.push(...record.addedNodes));
          mutation.forEach((record) => record.removedNodes.length & removedNodes.push(...record.removedNodes));

          // console.log('Added:', addedNodes, 'Removed:', removedNodes);

          addedNodes.forEach((node) => {
            if (node.classList.contains("systemchatmessage5")) return;
            if (node.querySelector(".playerchatmessage-selfname")) return;
            if (!node.querySelector(".playerchatmessage-text")) return;

            // console.log(node);
            const message = node.querySelector(".playerchatmessage-text");
            const text = message.textContent;
            const language = this.detectLanguage(text);

            if (language)
              this.translate(text, language, "en", (translation) => {
                applyTitleToChatMessage(translation, message);
              });
          });

          function applyTitleToChatMessage(text, node) {
            node.title = text;
          }
        });
      }

      #loadInterface() {
        this.#row1();
        this.#row2();
      }

      #row1() {
        const row = domMake.Row();
        {
          const enableButton = domMake.Button("Enable");

          enableButton.addEventListener("click", (event) => {
            this.active ? this.disable() : this.enable();
          });
          row.appendChild(enableButton);
          this.htmlElements.toggleStatusButton = enableButton;
        }
        this.htmlElements.section.appendChild(row);
      }

      #row2() {}

      enable() {
        this.active = true;

        this.htmlElements.toggleStatusButton.classList.add("active");
        this.htmlElements.toggleStatusButton.textContent = "Active";

        this.notify("success", `enabled`);
      }

      disable() {
        this.active = false;

        this.htmlElements.toggleStatusButton.classList.remove("active");
        this.htmlElements.toggleStatusButton.textContent = "Inactive";

        this.notify("warning", `disabled`);
      }

      detectLanguage(text) {
        if (unicodeLanguagePatterns.get("Cyrillic").test(text)) return "ru";
        if (unicodeLanguagePatterns.get("Arabic").test(text)) return "ar";
        if (unicodeLanguagePatterns.get("Greek").test(text)) return "el";
      }

      translate(textToTranslate, from = "ru", to = "en", callback) {
        const sourceText = textToTranslate;
        const sourceLang = from;
        const targetLang = to;

        const url =
          "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
          sourceLang +
          "&tl=" +
          targetLang +
          "&dt=t&q=" +
          encodeURI(sourceText);

        xhrGetJson(url, log);

        function log(data) {
          callback(data[0][0][0]);
        }
      }
    }

    function xhrGetJson(url, callback) {
      const req = new XMLHttpRequest();

      req.onload = (e) => {
        const response = req.response; // not responseText
        if (!callback) return;
        try {
          callback(JSON.parse(response));
        } catch (error) {
          console.log(error);
        }
      };
      req.open("GET", url);
      req.send();
    }
  })("QBit");
})();
