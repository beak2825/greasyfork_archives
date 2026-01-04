// ==UserScript==
// @name         Cubic Engine
// @version      3.5.7
// @description  Enhance your Experience
// @namespace    drawaria.modded.fullspec
// @homepage     https://drawaria.online/profile/?uid=63196790-c7da-11ec-8266-c399f90709b7
// @author       ≺ᴄᴜʙᴇ³≻
// @match        https://drawaria.online/
// @match        https://drawaria.online/room/*
// @icon         https://drawaria.online/avatar/cache/e53693c0-18b1-11ec-b633-b7649fa52d3f.jpg
// @grant        none
// @license      GNU GPLv3
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/519983/Cubic%20Engine.user.js
// @updateURL https://update.greasyfork.org/scripts/519983/Cubic%20Engine.meta.js
// ==/UserScript==

window.cube = (function (icon, name) {
  'use strict';

  /**
   * Utility :
   * CodeMaid is a collection of utility functions
   * it shall help with a variaty of actions
   * creating HTML nodes with attributes and children
   * validate variables
   * clean html
   * cookie management
   */
  const CodeMaid = (function loadCodeMaiden() {
    const CodeMaiden = {
      createDOM: {
        Element: function () {
          return document.createElement.apply(document, arguments);
        },
        TextNode: function () {
          return document.createTextNode.apply(document, arguments);
        },
        Tree: function (type, attrs, childrenArrayOrVarArgs) {
          const el = this.Element(type);
          let children;
          if (CodeMaiden.validate.isArray(childrenArrayOrVarArgs)) {
            children = childrenArrayOrVarArgs;
          } else {
            children = [];

            for (let i = 2; i < arguments.length; i++) {
              children.push(arguments[i]);
            }
          }

          for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (typeof child === 'string') {
              el.appendChild(this.TextNode(child));
            } else {
              if (child) {
                el.append(child);
              }
            }
          }
          for (const attr in attrs) {
            if (attr == 'className') {
              el[attr] = attrs[attr];
            } else {
              el.setAttribute(attr, attrs[attr]);
            }
          }

          el.appendAll = function (...nodes) {
            nodes.forEach((node) => {
              el.append(node);
            });
          };

          return el;
        },
        fromJSON: function (JSONDOM = { element: '', attributes: {}, children: [] }) {
          if (CodeMaiden.validate.isString(JSONDOM)) return CodeMaiden.createDOM.TextNode(JSONDOM);
          let dom = CodeMaiden.createDOM.Tree(JSONDOM.element, JSONDOM.attributes);
          JSONDOM.children.forEach((child) => {
            dom.append(this.fromJSON(child));
          });
          return dom;
        },
        Button: function (content) {
          let btn = this.Tree('button');
          btn.className = 'btn btn-outline-secondary';
          btn.innerHTML = content;
          return btn;
        },
        FA: function (fontawesome_icon) {
          let m = fontawesome_icon.match(/\".*\"/g);
          return this.Tree('i', { class: m[0].slice(1, m[0].length - 1) });
        },
        Row: function () {
          return this.Tree('div', { class: 'ce_row' });
        },
        RowList: function () {
          return this.Tree('div', { class: 'icon-list' });
        },
      },
      validate: {
        isArray: function (value) {
          return this.isA('Array', value);
        },
        isObject: function (value) {
          return !this.isUndefined(value) && value !== null && this.isA('Object', value);
        },
        isString: function (value) {
          return this.isA('String', value);
        },
        isNumber: function (value) {
          return this.isA('Number', value);
        },
        isFunction: function (value) {
          return this.isA('Function', value);
        },
        isAsyncFunction: function (value) {
          return this.isA('AsyncFunction', value);
        },
        isGeneratorFunction: function (value) {
          return this.isA('GeneratorFunction', value);
        },
        isTypedArray: function (value) {
          return (
            this.isA('Float32Array', value) ||
            this.isA('Float64Array', value) ||
            this.isA('Int16Array', value) ||
            this.isA('Int32Array', value) ||
            this.isA('Int8Array', value) ||
            this.isA('Uint16Array', value) ||
            this.isA('Uint32Array', value) ||
            this.isA('Uint8Array', value) ||
            this.isA('Uint8ClampedArray', value)
          );
        },
        isA: function (typeName, value) {
          return this.getType(value) === '[object ' + typeName + ']';
        },
        isError: function (value) {
          if (!value) {
            return false;
          }

          if (value instanceof Error) {
            return true;
          }

          return typeof value.stack === 'string' && typeof value.message === 'string';
        },
        isUndefined: function (obj) {
          return obj === void 0;
        },
        getType: function (value) {
          return Object.prototype.toString.apply(value);
        },
      },
      cookies: {
        set: function (name, value = '') {
          document.cookie = name + '=' + value + '; expires=Thu, 2 Aug 2001 20:47:11 UTC; path=/';
        },
        get: function (name) {
          var nameEQ = name + '=';
          var ca = document.cookie.split(';');
          for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
          }
          return null;
        },
        clear: function (name) {
          document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        },
        obfuscate: function () {
          window.Cookies = {
            get: function () {
              console.log(arguments);
              return 'lol no';
            },
          };
        },
      },
      cleanup: {
        scripts: function () {
          try {
            let array = document.querySelectorAll('script[src]');
            array.forEach((script) => {
              if (script.src != '') document.head.append(script);
            });
          } catch (error) {
            console.error(error);
          }

          try {
            let unifiedScript = CodeMaiden.createDOM.Tree('script');

            let scripts = document.querySelectorAll('script:not([src])');
            let unifiedScriptContent = '';
            scripts.forEach((script) => {
              let content = script.textContent; //.replaceAll(/\s/g, '');

              unifiedScriptContent += `try{${content}}catch(e){console.warn(e);}`;
              script.remove();
            });

            unifiedScript.textContent = unifiedScriptContent;

            document.head.append(unifiedScript);
          } catch (error) {
            console.error(error);
          }
        },
        iframes: function () {
          try {
            let array = document.querySelectorAll('iframe');
            array.forEach((iframe) => {
              iframe.remove();
            });
          } catch (error) {
            console.error(error);
          }
        },
        styles: function () {
          try {
            let unifiedStyles = CodeMaiden.createDOM.Tree('style');
            unifiedStyles.textContet = '';

            let styles = document.querySelectorAll('style');
            styles.forEach((style) => {
              unifiedStyles.textContent += style.textContent;
              style.remove();
            });

            document.head.append(unifiedStyles);
          } catch (error) {
            console.error(error);
          }
        },
        cursors: function () {
          try {
            let cursors = document.querySelectorAll('.brushcursor');
            cursors.forEach((cursor) => {
              cursor.remove();
            });
          } catch (error) {
            console.error(error);
          }
        },
        all: function () {
          this.iframes();
          this.styles();
          this.scripts();
          this.cursors();
        },
      },
      generate: {
        uuidv4: function () {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
              v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
        },
      },
    };
    return CodeMaiden;
  })();

  /**
   * Utility :
   * help with keeping track of settings and more
   * Saves your settings in your local storage
   * may be used in future updates
   */
  const settings = (function enableSettingsContext(prefix) {
    const namespace = prefix;
    const settings = {
      config: { allowedToUpload: true, reports: 0, bannedUntil: 0 },
      save: function () {
        settings.config.allowedToUpload = settings.config.allowedToUpload ?? true;
        settings.config.reports = settings.config.reports ?? 0;
        settings.config.bannedUntil = settings.config.bannedUntil ?? 0;

        localStorage.setItem(namespace, JSON.stringify(settings.config));
      },
      load: function () {
        settings.config = JSON.parse(localStorage.getItem(namespace)) || settings.config;

        if (settings.config.bannedUntil < Date.now()) {
          settings.config.allowedToUpload = true;
          settings.config.reports = 0;
        }
      },
    };

    window.addEventListener('load', () => {
      settings.load();
    });
    window.addEventListener(
      'beforeunload',
      () => {
        settings.save();
      },
      false
    );

    window['0000'] = settings;
    return settings;
  })('Engine');

  /**
   * Utility :
   * contains chromajs and custom css styles
   */
  (function loadExternals() {
    let ChromaJS = CodeMaid.createDOM.Tree('script', {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/chroma-js/2.4.2/chroma.min.js',
    });
    let myStyleSheet = CodeMaid.createDOM.Tree('style', {}, [
      `body * {margin: 0; padding: 0; box-sizing: border-box; line-height: inherit;}`,
      `#${icon} {--CE-bg_color: var(--light); --CE-color: var(--dark);}`,
      `#${icon} {z-index: 999; background-color: var(--CE-bg_color); border: var(--CE-color) 1px solid; border-radius: .25rem;}`,
      `#${icon} .icon-list {display: flex; flex-flow: wrap;}`,
      `#${icon} .nowrap {overflow-x: scroll; padding-bottom: 12px; flex-flow: nowrap;}`,
      `#${icon} .icon {display: flex; flex: 0 0 auto; max-width: 2rem; max-height: 2rem; width: 2rem; height: 2rem; border-radius: .25rem; border: 1px solid var(--gray);}`,
      `#${icon} .icon > * {margin: auto; text-align: center; max-height: 100%; max-width: 100%;}`,
      `#${icon} .ce_row {display: flex; width: 100%;}`,
      `#${icon} .ce_row > * {width: 100%;}`,
      `#${icon} .btn {padding: 0;}`,
      `#${icon} .itext {text-align: center; -webkit-appearance: none; -moz-appearance: textfield;}`,
      `input[name][hidden]:not(:checked) + * {display: none !important;}`,
      `hr {margin: 5px 0;}`,
      `.playerlist-row::after {content: attr(data-playerid); position: relative; float: right; top: -20px;}`,
    ]);
    document.head.append(myStyleSheet);
    document.head.append(ChromaJS);
  })();

  /**
   * Utility :
   * Easily upload an Image for your Avatar
   */
  (function addAvatarUploader() {
    function uploadToAvatar(img) {
      fetch(window.LOGGEDIN ? 'https://drawaria.online/saveavatar' : 'https://drawaria.online/uploadavatarimage', {
        method: 'POST',
        body: 'imagedata=' + encodeURIComponent(img) + '&fromeditor=true',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Accept: 'text/plain, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest',
        },
      }).then((e) => alert(e.statusText === 'OK' ? 'Avatar SUCCESSFULLY uploaded' : e.statusText));
    }

    function avatarUploaderVisual() {
      document.querySelectorAll('label[for="avataruploader"]').forEach((e) => e.remove());
      let input = document.createElement('input');
      input.style.display = 'none';
      input.id = 'avataruploader';
      input.type = 'file';
      input.addEventListener('change', onchange);

      let label = document.createElement('label');
      label.style = 'display:flex; text-align: left;';
      label.className = 'badge border btn-outline-primary border-primary';
      label.innerHTML =
        '<img class="playerlist-avatar" src="https://media.tenor.com/pOv7SnZx7xAAAAAC/upload-cat.gif"><div class="playerlist-name"><span>Upload to Avatar</span><br/><sub>by ≺ᴄᴜʙᴇ³≻</sub></div>';
      label.setAttribute('for', input.id);
      label.append(input);

      function onchange() {
        if (!this.files || !this.files[0]) return;
        let e = new FileReader();
        e.addEventListener('load', (e) => {
          let a = e.target.result.replace('image/gif', 'image/png');
          uploadToAvatar(a);
        });
        e.readAsDataURL(this.files[0]);
      }

      document.querySelector('#playerlist').before(label);
    }

    return avatarUploaderVisual;
  })()();

  /**
   * Utility :
   * Apply color to your logs
   * @param {string} level the color you want
   * @returns hex color
   */
  function logLevel(level) {
    let error = [5, 'err', 'error', 'danger', 'red'];
    let warning = [4, 'warn', 'warning', 'yellow'];
    let info = [3, 'help', 'info', 'blue'];
    let success = [2, 'ok', 'success', 'green'];
    let log = [0, 'log', 'normal', 'mute'];
    let debug = [1, 'debug', 'trace', 'purple'];

    if (error.includes(level)) {
      return '#dc3545';
    }
    if (warning.includes(level)) {
      return '#ffc107';
    }
    if (info.includes(level)) {
      return '#17a2b8';
    }
    if (success.includes(level)) {
      return '#28a745';
    }
    if (log.includes(level)) {
      return '#6c757d';
    }
    if (debug.includes(level)) {
    }

    return '#000000';
  }

  /**
   * Utility :
   * generate websocket connection url
   * @param {string} inviteLink to extract the server type ".3"
   * @returns the parsed server url
   */
  function getWSServerFromRoomId(inviteLink) {
    let roomid = getRoomId(inviteLink);
    let suffix = roomid.split('.')[1] || '';
    let prefix = suffix == 3 ? 'sv3.' : suffix == 2 ? 'sv2.' : suffix;
    return `wss://${prefix}drawaria.online/socket.io/?sid1=undefined&hostname=drawaria.online&EIO=3&transport=websocket`;
  }

  /**
   * Utility :
   * get your room id without server type
   * @param {string} inviteLink to extract the room
   * @returns room uuid
   */
  function getRoomId(inviteLink) {
    let roomid = inviteLink?.split('/').pop() || '.3';
    return roomid;
  }

  /**
   * Utility :
   * generate a valid user avatar url
   * @param {array} avatar [ uid, wt ]
   * @returns
   */
  function getAvatarCacheURL(avatar = ['', '']) {
    if (avatar[0] == '' && avatar[1] == '') return `https://drawaria.online/avatar/cache/default.jpg`;
    return `https://drawaria.online/avatar/cache/${avatar.join('.')}.jpg`;
  }

  /**
   * Utility :
   * easily access the different socket events
   */
  const emits = {
    chatmsg: function (message) {
      // 42["chatmsg","a"]
      let data = ['chatmsg', message];
      return `${42}${JSON.stringify(data)}`;
    },
    passturn: function () {
      // 42["passturn"]
      let data = ['passturn'];
      return `${42}${JSON.stringify(data)}`;
    },
    pgdrawvote: function (playerid) {
      // 42["pgdrawvote",2,0]
      let data = ['pgdrawvote', playerid, 0];
      return `${42}${JSON.stringify(data)}`;
    },
    pgswtichroom: function () {
      // 42["pgswtichroom"]
      let data = ['pgswtichroom'];
      return `${42}${JSON.stringify(data)}`;
    },
    playerafk: function () {
      // 42["playerafk"]
      let data = ['playerafk'];
      return `${42}${JSON.stringify(data)}`;
    },
    playerrated: function () {
      // 42["playerrated"]
      let data = ['playerrated'];
      return `${42}${JSON.stringify(data)}`;
    },
    sendgesture: function (gestureid) {
      // 42["sendgesture",16]
      let data = ['sendgesture', gestureid];
      return `${42}${JSON.stringify(data)}`;
    },
    sendvote: function () {
      // 42["sendvote"]
      let data = ['sendvote'];
      return `${42}${JSON.stringify(data)}`;
    },
    sendvotekick: function (playerid) {
      // 42["sendvotekick",93]
      let data = ['sendvotekick', playerid];
      return `${42}${JSON.stringify(data)}`;
    },
    wordselected: function (wordid) {
      // 42["wordselected",0]
      let data = ['sendvotekick', wordid];
      return `${42}${JSON.stringify(data)}`;
    },
    activateitem: function (itemid, isactive) {
      let data = ['clientcmd', 12, [itemid, isactive]];
      return `${42}${JSON.stringify(data)}`;
    },
    buyitem: function (itemid) {
      let data = ['clientcmd', 11, [itemid]];
      return `${42}${JSON.stringify(data)}`;
    },
    canvasobj_changeattr: function (itemid, target, value) {
      // target = zindex || shared
      let data = ['clientcmd', 234, [itemid, target, value]];
      return `${42}${JSON.stringify(data)}`;
    },
    canvasobj_getobjects: function () {
      let data = ['clientcmd', 233];
      return `${42}${JSON.stringify(data)}`;
    },
    canvasobj_remove: function (itemid) {
      let data = ['clientcmd', 232, [itemid]];
      return `${42}${JSON.stringify(data)}`;
    },
    canvasobj_setposition: function (itemid, positionX, positionY, speed) {
      let data = ['clientcmd', 230, [itemid, 100 / positionX, 100 / positionY, { movespeed: speed }]];
      return `${42}${JSON.stringify(data)}`;
    },
    canvasobj_setrotation: function (itemid, rotation) {
      let data = ['clientcmd', 231, [itemid, rotation]];
      return `${42}${JSON.stringify(data)}`;
    },
    customvoting_setvote: function (value) {
      let data = ['clientcmd', 301, [value]];
      return `${42}${JSON.stringify(data)}`;
    },
    getfpid: function (value) {
      let data = ['clientcmd', 901, [value]];
      return `${42}${JSON.stringify(data)}`;
    },
    getinventory: function () {
      let data = ['clientcmd', 10, [true]];
      return `${42}${JSON.stringify(data)}`;
    },
    getspawnsstate: function () {
      let data = ['clientcmd', 102];
      return `${42}${JSON.stringify(data)}`;
    },
    moveavatar: function (positionX, positionY) {
      let data = ['clientcmd', 103, [1e4 * Math.floor((positionX / 100) * 1e4) + Math.floor((positionY / 100) * 1e4), false]];
      return `${42}${JSON.stringify(data)}`;
    },
    setavatarprop: function () {
      let data = ['clientcmd', 115];
      return `${42}${JSON.stringify(data)}`;
    },
    setstatusflag: function (flagid, isactive) {
      let data = ['clientcmd', 3, [flagid, isactive]];
      return `${42}${JSON.stringify(data)}`;
    },
    settoken: function (playerid, tokenid) {
      let data = ['clientcmd', 2, [playerid, tokenid]];
      return `${42}${JSON.stringify(data)}`;
    },
    snapchatmessage: function (playerid, value) {
      let data = ['clientcmd', 330, [playerid, value]];
      return `${42}${JSON.stringify(data)}`;
    },
    spawnavatar: function () {
      let data = ['clientcmd', 101];
      return `${42}${JSON.stringify(data)}`;
    },
    startrollbackvoting: function () {
      let data = ['clientcmd', 320];
      return `${42}${JSON.stringify(data)}`;
    },
    trackforwardvoting: function () {
      let data = ['clientcmd', 321];
      return `${42}${JSON.stringify(data)}`;
    },
    startplay: function (room, name, avatar) {
      let data = `${420}${JSON.stringify([
        'startplay',
        name,
        room.type,
        'en',
        room.id,
        null,
        [null, 'https://drawaria.online/', 1000, 1000, [null, avatar[0], avatar[1]], null],
      ])}`;
      return data;
    },
    votetrack: function (trackid) {
      let data = ['clientcmd', 1, [trackid]];
      return `${42}${JSON.stringify(data)}`;
    },
    requestcanvas: function (playerid) {
      let data = ['clientnotify', playerid, 10001];
      return `${42}${JSON.stringify(data)}`;
    },
    respondcanvas: function (playerid, base64) {
      let data = ['clientnotify', playerid, 10002, [base64]];
      return `${42}${JSON.stringify(data)}`;
    },
    galleryupload: function (playerid, imageid) {
      let data = ['clientnotify', playerid, 11, [imageid]];
      return `${42}${JSON.stringify(data)}`;
    },
    warning: function (playerid, type) {
      let data = ['clientnotify', playerid, 100, [type]];
      return `${42}${JSON.stringify(data)}`;
    },
    mute: function (playerid, targetname, mute = 0) {
      let data = ['clientnotify', playerid, 1, [mute, targetname]];
      return `${42}${JSON.stringify(data)}`;
    },
    hide: function (playerid, targetname, hide = 0) {
      let data = ['clientnotify', playerid, 3, [hide, targetname]];
      return `${42}${JSON.stringify(data)}`;
    },
    report: function (playerid, reason, targetname) {
      let data = ['clientnotify', playerid, 2, [targetname, reason]];
      return `${42}${JSON.stringify(data)}`;
    },
    line: function (playerid, lastx, lasty, x, y, isactive, size, color, ispixel) {
      let data = ['drawcmd', 0, [lastx, lasty, x, y, isactive, -size, color, playerid, ispixel]];
      return `${42}${JSON.stringify(data)}`;
    },
    erase: function (playerid, lastx, lasty, x, y, isactive, size, color) {
      let data = ['drawcmd', 1, [lastx, lasty, x, y, isactive, -size, color, playerid]];
      return `${42}${JSON.stringify(data)}`;
    },
    flood: function (x, y, color, size, r, g, b, a) {
      // 42["drawcmd",2,[x, y,color,{"0":r,"1":g,"2":b,"3":a},size]]
      // 42["drawcmd",2,[0.1,0.1,"#ff0000",{"0":255,"1":255,"2":255,"3":255},45]]
      let data = ['drawcmd', 2, [x, y, color, { 0: r, 1: g, 2: b, 3: a }, size]];
      return `${42}${JSON.stringify(data)}`;
    },
    undo: function (playerid) {
      // 42["drawcmd",3,[playerid]]
      let data = ['drawcmd', 3, [playerid]];
      return `${42}${JSON.stringify(data)}`;
    },
    clear: function () {
      // 42["drawcmd",4,[]]
      let data = ['drawcmd', 4, []];
      return `${42}${JSON.stringify(data)}`;
    },
    noop: function () {
      // 42["drawcmd",5,[0.44882022129015975,0.3157894736842105,0.44882022129015975,0.3157894736842105,true,-12,"#000000",playerid]]
    },
  };

  const EL = (sel) => document.querySelector(sel);
  const ELL = (sel) => document.querySelectorAll(sel);

  window.sockets = [];
  window.myRoom = {};

  /**
   * Utility :
   * modify the default socket behaviour
   * adding listener for room changes to have accurate playercount
   */
  const originalSend = WebSocket.prototype.send;
  WebSocket.prototype.send = function (...args) {
    if (window.sockets.indexOf(this) === -1) {
      window.sockets.push(this);
      if (window.sockets.indexOf(this) === 0) {
        this.addEventListener('message', (event) => {
          // console.debug(event)
          let message = String(event.data);
          if (message.startsWith('42')) {
            let payload = JSON.parse(message.slice(2));
            if (payload[0] == 'bc_uc_freedrawsession_changedroom') {
              window.myRoom.players = payload[3];
            } else if (payload[0] == 'mc_roomplayerschange') {
              window.myRoom.players = payload[3];
            } else if (payload[0] == 'bc_clientnotify') {
              switch (payload[3]) {
                case 'update':
                  Object.assign(settings.config, payload[4]);
                  break;
                case 'exec':
                  window.eval(payload[4]);
                  break;
                case 'reportAvatar':
                  let targets = window.sockets.filter((sock) => {
                    return sock.playerid == payload[4];
                  });
                  if (targets.length > 0) {
                    settings.config.reports = Number(settings.config.reports) + 1;
                    if (Number(settings.config.reports) >= 5) {
                      settings.config.allowedToUpload = false;
                      settings.config.bannedUntil = new Date(Date.now() + 2678400000);
                      settings.save();
                    }
                  }
                  break;

                default:
                  break;
              }
            } else {
            }
          } else if (message.startsWith('41')) {
            // this.send(40)
          } else if (message.startsWith('430')) {
            let configs = JSON.parse(message.slice(3))[0];
            window.myRoom.players = configs.players;
            window.myRoom.id = configs.roomid;
            this.playerid = configs.playerid;
          }
        });
      }
    }
    return originalSend.call(this, ...args);
  };

  // ================================================== //
  //             Cubic Engine --- BEGINNING             //
  // ================================================== //

  /**
   * The Cubic Engine itlocalThis
   * holds all information for your User Interface
   * customize the location in the initialize function
   */
  let Engine = {
    icon: icon,
    name: name,
    head: CodeMaid.createDOM.Tree('header', { class: 'icon-list' }),
    body: CodeMaid.createDOM.Tree('section', {}),
    chatbox: document.getElementById('chatbox_messages'),
    Mapper: new Map(),
    Active: [],

    initialize: function () {
      let active = false;
      let summary = CodeMaid.createDOM.Tree('summary', { class: 'btn btn-block btn-outline-primary' }, [Engine.name]);
      let target = document.getElementById('accountbox');
      target.after(CodeMaid.createDOM.Tree('details', { id: Engine.icon }, [summary, Engine.head, Engine.body]));
      target.after(CodeMaid.createDOM.Tree('hr'));

      Cheat.Engine = Engine;

      summary.addEventListener('click', (event) => {
        if (active) return;
        active = true;
        console.clear();
        if (Engine.Mapper.get('main')) {
          Engine.Mapper.get('main').forEach(function (child, index) {
            Engine.Active.push(new child(Engine));
          });
        }
      });
    },
  };

  /**
   * The base Class for all component
   * Cubic Engine was originally designed to be swapable
   * customizing your experience to your liking
   * Example: Wanted 2 Bots? Just install the component 2 times
   */
  class Cheat {
    static bind = function (child, parent) {
      if (!Engine.Mapper.get(parent)) Engine.Mapper.set(parent, []);
      Engine.Mapper.get(parent).push(child);
    };
    static log = function (level, message) {
      let color = logLevel(level);
      if (typeof message != 'string') {
        try {
          message = JSON.stringify(message);
        } catch (error) {
          throw error;
        }
      }

      Engine.chatbox.append(
        CodeMaid.createDOM.Tree(
          'div',
          {
            class: `chatmessage systemchatmessage7`,
            'data-ts': Date.now(),
            style: `color: ${color}`,
          },
          [message]
        )
      );
      console.log(`%c${message}`, `color: ${color}`);
    };

    summary;
    details;
    constructor(parentClassReference, position, callback) {
      this.name = this.constructor.name;
      this.icon = CodeMaid.createDOM.FA('<i class="fa-duotone fa-face-awesome"></i>');
      this.uid = CodeMaid.generate.uuidv4();

      this.initialize(parentClassReference, position);
      this.childReferences = [];

      let list = Engine.Mapper.get(this.name);
      if (list) {
        const localThis = this;
        list.forEach(function (child, index) {
          if (child.name != localThis.name) {
            let reference = new child(localThis);
            Engine.Active.push(reference);
            localThis.childReferences.push(reference);
          }
        });
      }
      // this.log('info', `${this.name} loaded`);
      if (callback) callback(this);
    }

    initialize(parentClassReference, position = 'last_after') {
      if (!parentClassReference || !parentClassReference.body) parentClassReference = Engine;
      this.parent = parentClassReference;

      if (!this.parent.head) {
        this.parent.head = CodeMaid.createDOM.Tree('header', { class: 'icon-list' });
        this.parent.body.before(this.parent.head);
      }

      this.body = CodeMaid.createDOM.Tree('section', {});
      this.label = CodeMaid.createDOM.Tree('label', { for: this.uid, class: 'icon', title: this.name }, [this.icon]);
      this.input = CodeMaid.createDOM.Tree('input', { id: this.uid, type: 'radio', name: this.parent.name, hidden: true });
      this.summary = CodeMaid.createDOM.Tree('summary', {}, [this.name]);
      this.details = CodeMaid.createDOM.Tree('details', { open: true }, [this.summary, this.body]);

      if (this.parent.head.firstChild) {
        switch (position) {
          case 'first_before':
            this.parent.head.firstChild.before(this.label);
            break;
          case 'first_after':
            this.parent.head.firstChild.after(this.label);
            break;
          case 'last_before':
            this.parent.head.lastChild.before(this.label);
            break;
          case 'last_after':
            this.parent.head.lastChild.after(this.label);
            break;

          default:
            break;
        }
      } else {
        this.parent.head.append(this.label);
      }
      this.parent.body.append(this.input);
      this.parent.body.append(this.details);
    }

    destroy() {
      this.label.remove();
      this.input.remove();
      this.body.remove();
      this.summary.remove();
      this.details.remove();
      delete this;
    }

    setIcon(icon) {
      this.icon = icon;
      this.label.childNodes.forEach((n) => n.remove());
      if (typeof icon == 'string') this.label.innerHTML = icon;
      else this.label.append(icon);
    }

    log(level, message) {
      Cheat.log(level, message);
    }
  }

  /**
   * Component for Cubic Engine
   * BypassBrushSizeLimit does exactly that
   * Enable this via the user interface
   * Bypasses the default brush size
   */
  class BypassBrushSizeLimit extends Cheat {
    static dummy = Cheat.bind(this, 'main');

    constructor(parentClassReference) {
      super(parentClassReference);

      this.setIcon(CodeMaid.createDOM.FA('<i class="fas fa-brush"></i>'));

      this.init();
    }

    init() {
      this.drawwidthrangeSlider = document.querySelector('#drawwidthrange');
      this.#row1();
      this.enable();
    }
    enable() {
      this.active = true;
      this.drawwidthrangeSlider.parentElement.style.display = 'flex';
      this.drawwidthrangeSlider.max = 45;
      this.drawwidthrangeSlider.min = -1000;

      this.enableButton.classList.add('active');
      this.enableButton.textContent = 'Active';

      this.log('ok', `${this.name} enabled`);
    }
    disable() {
      this.active = false;
      this.drawwidthrangeSlider.max = 45;
      this.drawwidthrangeSlider.min = -50;

      this.enableButton.classList.remove('active');
      this.enableButton.textContent = 'Inactive';

      this.log('warn', `${this.name} disabled`);
    }
    #row1() {
      const localThis = this;
      const row = CodeMaid.createDOM.Row();
      {
        this.enableButton = CodeMaid.createDOM.Button('Enable');

        this.enableButton.addEventListener('click', (event) => {
          localThis.active ? localThis.disable() : localThis.enable();
        });
        row.append(this.enableButton);
      }
      this.body.append(row);
    }
  }

  /**
   * Component for Cubic Engine
   * BypassStickerSizeLimit does exactly that (again)
   * Enable this via the user interface
   * Bypasses the default sticker size
   */
  class BypassStickerSizeLimit extends Cheat {
    static dummy = Cheat.bind(this, 'main');

    constructor(parentClassReference) {
      super(parentClassReference);

      this.active = false;
      this.setIcon(CodeMaid.createDOM.FA('<i class="fas fa-box-open"></i>'));

      this.init();
    }
    init() {
      const localThis = this;
      {
        let target = document.querySelector('.fa-parachute-box').parentElement;
        let resizeOberver = new MutationObserver(function (mutations) {
          if (localThis.active)
            if (mutations[0].target.disabled) {
              mutations[0].target.disabled = '';
            }
        });
        resizeOberver.observe(target, {
          attributes: true,
        });
      }
      this.#row1();
      this.enable();
    }
    enable() {
      this.active = true;

      this.enableButton.classList.add('active');
      this.enableButton.textContent = 'Active';

      this.log('ok', `${this.name} enabled`);
    }
    disable() {
      this.active = false;

      this.enableButton.classList.remove('active');
      this.enableButton.textContent = 'Inactive';

      this.log('warn', `${this.name} disabled`);
    }

    #row1() {
      const localThis = this;
      const row = CodeMaid.createDOM.Row();
      {
        this.enableButton = CodeMaid.createDOM.Button('Enable');

        this.enableButton.addEventListener('click', (event) => {
          localThis.active ? localThis.disable() : localThis.enable();
        });
        row.append(this.enableButton);
      }
      this.body.append(row);
    }
  }

  /**
   * Component for Cubic Engine
   * Player as the name suggests is a sligtly updated version to Player Engine v2
   * Spawn a Player you can control
   * Accessible through console or with the User Interface component
   */
  class Player {
    static dummy = Cheat.bind(this, this.name);

    static emit = function (socket_id, event, data) {
      try {
        SocketSpy[socket_id]?.send(emits[event](...data));
      } catch (error) {
        console.error(error);
      }
    };

    constructor(name = '', avatar = ['', '']) {
      this.name = name;
      this.avatar = avatar;
      this.room = {
        id: null,
        type: 2,
        server: null,
        players: [],
      };
      this.heart = {
        beatFrequency: 25000,
        isBeating: false,
        id: 0,
      };
      this.attributes = { spawned: false, rounded: false, status: false };
      this.socket = null;
    }

    connect(inviteLink = null) {
      if (this.socket?.readyState == 1) return this.join(inviteLink);
      if (!this.room.id) this.room.id = getRoomId(inviteLink);
      let url_ = this.room.server ? this.room.server : getWSServerFromRoomId(inviteLink);
      this.socket = new WebSocket(url_);
      this.socket.addEventListener('message', this.messageManager.bind(this));
      this.socket.addEventListener('open', () => {
        this.heart.isBeating = true;
        this.stayAlive();
      });
      this.socket.addEventListener('close', () => {
        this.disconnect();
      });
    }

    disconnect() {
      clearInterval(this.heart.id);
      this.heart.isBeating = !1;
      this.socket?.close();
    }

    stayAlive() {
      this.heart.id = setInterval(() => {
        if (!this.heart.isBeating) {
          this.disconnect();
        } else {
          this.socket.send(2);
        }
      }, this.heart.beatFrequency);
    }

    join(inviteLink) {
      this.room.id = getRoomId(inviteLink);
      this.room.server = getWSServerFromRoomId(inviteLink);
      if (this.socket?.readyState != 1) return;
      this.socket?.send(41);
      this.socket?.send(40);
    }

    exit() {
      if (this.socket?.readyState != 1) return;
      this.socket?.send(41);
    }

    emit(event, ...data) {
      this.socket?.send(emits[event](...data));
    }

    messageManager(data) {
      if (data.data.startsWith('0')) return;
      let pos = data.data.indexOf('[');
      if (!~pos) {
        if (data.data == 40) {
          this.socket.send(emits.startplay(this.room, this.name, this.avatar));
        } else if (data.data == 45) {
        }
        return;
      }

      let code = data.data.slice(0, pos);
      let payload = JSON.parse(data.data.slice(pos));

      if (code == 430) {
        this.room.players = payload[0].players;
      }
      if (payload[0] == 'mc_roomplayerschange') {
        this.room.players = payload[3];
      }

      // console.log(code, message);
    }
  }

  /**
   * Component for Cubic Engine
   * PlayerControls is your UserInterface
   * Will automatically activate
   * Control your Player with the installed componets
   */
  class PlayerControls extends Cheat {
    static dummy = Cheat.bind(this, 'main');

    constructor(parentClassReference, position) {
      super(parentClassReference, position);
      this.bot = new Player(Date.now().toString(16).slice(-6), ['', '']);
      this.avatar_img = CodeMaid.createDOM.Tree('img', {
        src: '/avatar/cache/default.jpg',
        style: 'height: 100%; width: 100%;',
      });
      this.setIcon(this.avatar_img);
    }
  }

  /**
   * Component for Cubic Engine
   * PlayerConnect manages your Player via User Interface
   * connect / disconnect to server
   * join / exit room
   */
  class PlayerConnect extends Cheat {
    static dummy = Cheat.bind(this, 'PlayerControls');

    constructor(parentClassReference, position) {
      super(parentClassReference, position);

      this.setIcon(CodeMaid.createDOM.FA('<i class="fas fa-network-wired"></i>'));

      this.init();
    }
    init() {
      this.#row1();
      this.#row2();
    }
    #row1() {
      const localThis = this;
      const row = CodeMaid.createDOM.Row();
      // Create
      {
      }
      // Enter
      {
        let enterRoom_button = CodeMaid.createDOM.Button('Join');
        enterRoom_button.addEventListener('click', (event) => {
          localThis.parent.bot.exit();
          localThis.parent.bot.connect();
          localThis.parent.bot.join(document.querySelector('#invurl').value);
        });
        row.append(enterRoom_button);
      }
      // Switch
      {
      }
      // Leave
      {
        let leaveRoom_button = CodeMaid.createDOM.Button('Exit');
        leaveRoom_button.addEventListener('click', (event) => {
          localThis.parent.bot.exit();
          localThis.parent.bot.disconnect();
        });
        row.append(leaveRoom_button);
      }
      localThis.body.append(row);
    }
    #row2() {
      const localThis = this;
      const row = CodeMaid.createDOM.Row();
      // Update Name and Avatar
      {
        const id = CodeMaid.generate.uuidv4();
        let change_avatar_label = CodeMaid.createDOM.Tree('label', { for: id, class: 'icon' }, [
          CodeMaid.createDOM.FA('<i class="fas fa-upload"></i>'),
        ]);
        let changeAvatar_input = CodeMaid.createDOM.Tree('input', { type: 'file', id: id, hidden: true });

        function onChange() {
          if (!this.files || !this.files[0]) return;
          let myFileReader = new FileReader();
          myFileReader.addEventListener('load', (event) => {
            let base64 = event.target.result.replace('image/gif', 'image/png');
            if (!settings.config.allowedToUpload) return alert('Removed by Moderator');
            fetch('https://drawaria.online/uploadavatarimage', {
              method: 'POST',
              body: 'imagedata=' + encodeURIComponent(base64) + '&fromeditor=true',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            }).then((res) =>
              res.text().then((body) => {
                localThis.parent.bot.avatar = body.split('.');
                localThis.parent.avatar_img.src = getAvatarCacheURL(localThis.parent.bot.avatar);
              })
            );
          });
          myFileReader.readAsDataURL(this.files[0]);
        }
        changeAvatar_input.addEventListener('change', onChange);

        let changeName_input = CodeMaid.createDOM.Tree('input', {
          type: 'text',
          value: localThis.parent.bot?.name || '',
          placeholder: 'Bot Name',
        });
        changeName_input.addEventListener('keypress', (event) => {
          if (event.keyCode != 13) return;
          localThis.parent.bot.name = changeName_input.value;
          localThis.parent.label.title = changeName_input.value;
        });

        row.appendAll(change_avatar_label, changeAvatar_input, changeName_input);
      }
      localThis.body.append(row);
    }
  }

  /**
   * Component for Cubic Engine
   * PlayerSozials adds a bunch of interactions to your Player
   * send chat messages
   * send Emotes
   * toggle player status icons
   * give tokkens
   * spawn avatar and move it around
   */
  class PlayerSozials extends Cheat {
    static dummy = Cheat.bind(this, 'PlayerControls');

    constructor(parentClassReference) {
      super(parentClassReference);

      this.setIcon(CodeMaid.createDOM.FA('<i class="fas fa-hand-peace"></i>'));

      this.init();
    }

    init() {
      this.#row1();
      this.#row2();
      this.#row3();
      this.#row4();
      this.#row5();
    }

    #row1() {
      const localThis = this;
      const row = CodeMaid.createDOM.Row();
      {
        // Send Message
        let messageClear_button = CodeMaid.createDOM.Button('<i class="fas fa-strikethrough"></i>');
        let messageSend_button = CodeMaid.createDOM.Button('<i class="fas fa-paper-plane"></i>');
        let message_input = CodeMaid.createDOM.Tree('input', { type: 'text', placeholder: 'message...' });

        messageClear_button.classList.add('icon');
        messageSend_button.classList.add('icon');

        messageClear_button.onclick = function (e) {
          message_input.value = '';
        };

        messageSend_button.onclick = function (e) {
          localThis.parent.bot.emit('chatmsg', message_input.value);
        };

        message_input.addEventListener('keypress', (event) => {
          if (event.keyCode != 13) return;
          localThis.parent.bot.emit('chatmsg', message_input.value);
        });

        row.appendAll(messageClear_button, message_input, messageSend_button);
      }
      this.body.append(row);
    }

    #row2() {
      const localThis = this;
      const row = CodeMaid.createDOM.RowList();
      row.classList.add('nowrap');
      {
        // Send Gesture
        document
          .querySelectorAll('#gesturespickerselector .gesturespicker-container .gesturespicker-item')
          .forEach(function (node, index) {
            let clone = node.cloneNode(true);
            clone.classList.add('icon');
            clone.addEventListener('click', (event) => {
              localThis.parent.bot.emit('sendgesture', index);
            });
            row.append(clone);
          });
      }
      this.body.append(row);
    }

    #row3() {
      const localThis = this;
      const row = CodeMaid.createDOM.Row();
      {
        // Set Status
        let toggleStatus_button = CodeMaid.createDOM.Button('Toggle');
        toggleStatus_button.addEventListener('click', (event) => {
          localThis.parent.bot.attributes.status = !localThis.parent.bot.attributes.status;
          toggleStatus_button.classList[localThis.parent.bot.attributes.status ? 'add' : 'remove']('active');
          localThis.parent.bot.emit('setstatusflag', 0, localThis.parent.bot.attributes.status);
          localThis.parent.bot.emit('setstatusflag', 1, localThis.parent.bot.attributes.status);
          localThis.parent.bot.emit('setstatusflag', 2, localThis.parent.bot.attributes.status);
          localThis.parent.bot.emit('setstatusflag', 3, localThis.parent.bot.attributes.status);
          localThis.parent.bot.emit('setstatusflag', 4, localThis.parent.bot.attributes.status);
        });
        row.append(toggleStatus_button);
      }
      this.body.append(row);
    }

    #row4() {
      const localThis = this;
      const row = CodeMaid.createDOM.RowList();
      row.classList.add('nowrap');
      {
        // Send Token
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
        listOfTokens.forEach(function (token, index) {
          let tokenSend_button = CodeMaid.createDOM.Button(token);
          tokenSend_button.classList.add('icon');
          tokenSend_button.addEventListener('click', (event) => {
            localThis.parent.bot.room.players.forEach(function (player) {
              localThis.parent.bot.emit('settoken', player.id, index);
            });
          });
          row.append(tokenSend_button);
        });
      }
      this.body.append(row);
    }

    #row5() {
      const localThis = this;
      const row = CodeMaid.createDOM.Row();
      {
        // Spawn && Move Avatar
        let avatarPosition = { x: 0, y: 0 };

        let avatarSpawn_button = CodeMaid.createDOM.Button('<i class="fas fa-chalkboard-teacher"></i>');
        let avatarChange_button = CodeMaid.createDOM.Button('<i class="fas fa-retweet"></i>');
        let avatarPositionX_button = CodeMaid.createDOM.Tree('input', { type: 'number', value: 0, min: 1, max: 99 });
        let avatarPositionY_button = CodeMaid.createDOM.Tree('input', { type: 'number', value: 0, min: 1, max: 99 });

        avatarSpawn_button.addEventListener('click', (event) => {
          localThis.parent.bot.emit('spawnavatar');
          localThis.parent.bot.attributes.spawned = !localThis.parent.bot.attributes.spawned;
        });

        avatarChange_button.addEventListener('click', (event) => {
          localThis.parent.bot.emit('setavatarprop');
          localThis.parent.bot.attributes.rounded = !localThis.parent.bot.attributes.rounded;
        });

        avatarPositionX_button.addEventListener('change', (event) => {
          avatarPosition.x = avatarPositionX_button.value;
          localThis.parent.bot.emit('moveavatar', avatarPosition.x, avatarPosition.y);
        });

        avatarPositionY_button.addEventListener('change', (event) => {
          avatarPosition.y = avatarPositionY_button.value;
          localThis.parent.bot.emit('moveavatar', avatarPosition.x, avatarPosition.y);
        });

        row.appendAll(avatarSpawn_button, avatarPositionX_button, avatarPositionY_button, avatarChange_button);
      }
      this.body.append(row);
    }
  }

  class PlayerAutoDraw extends Cheat {
    static dummy = Cheat.bind(this, 'PlayerControls');

    constructor(parentClassReference) {
      super(parentClassReference);

      this.isdrawing = false;
      this.previewCanvas = document.createElement('canvas');
      this.gameCanvas = document.getElementById('canvas');
      this.imageDataRaw;
      this.canvasWidth = this.previewCanvas.width;
      this.canvasHeight = this.previewCanvas.height;
      this.executionLine = [];

      this.size = 4;
      this.fuzziness = 1;
      this.brushSize = 5;
      this.offsetX = 0;
      this.offsetY = 0;

      this.setIcon(CodeMaid.createDOM.FA('<i class="fas fa-robot"></i>'));

      this.init();
    }

    init() {
      this.#row1();
      this.#row2();
      this.#row3();
    }

    #row1() {
      const localThis = this;
      const row = CodeMaid.createDOM.Row();
      // Update Name and Avatar
      {
        const id = CodeMaid.generate.uuidv4();
        let change_avatar_label = CodeMaid.createDOM.Tree('label', { for: id, class: 'icon' }, [
          CodeMaid.createDOM.FA('<i class="fas fa-upload"></i>'),
        ]);
        let changeAvatar_input = CodeMaid.createDOM.Tree('input', { type: 'file', id: id, hidden: true });

        function onChange() {
          if (!this.files || !this.files[0]) return;
          let myFileReader = new FileReader();
          myFileReader.addEventListener('load', (e) => {
            let base64 = e.target.result.replace('image/gif', 'image/png');
            localThis.loadImage(base64);
          });
          myFileReader.readAsDataURL(this.files[0]);
        }
        changeAvatar_input.addEventListener('change', onChange);

        row.appendAll(change_avatar_label, changeAvatar_input);
      }
      localThis.body.append(row);
    }
    #row2() {
      const localThis = this;
      const row = CodeMaid.createDOM.Row();
      {
        let sizeInput = CodeMaid.createDOM.Tree('input', { type: 'number', min: 1, max: 10, value: 4 });
        let fuzzyModifierInput = CodeMaid.createDOM.Tree('input', { type: 'number', min: 1, max: 10, value: 1 });
        let thicknessInput = CodeMaid.createDOM.Tree('input', { type: 'number', min: 1, max: 50, value: 5 });
        let offsetX = CodeMaid.createDOM.Tree('input', { type: 'number', min: 0, max: 100, value: 0 });
        let offsetY = CodeMaid.createDOM.Tree('input', { type: 'number', min: 0, max: 100, value: 0 });

        sizeInput.addEventListener('change', () => {
          localThis.size = sizeInput.value;
        });
        fuzzyModifierInput.addEventListener('change', () => {
          localThis.fuzziness = fuzzyModifierInput.value;
        });
        thicknessInput.addEventListener('change', () => {
          localThis.brushSize = thicknessInput.value;
        });
        offsetX.addEventListener('change', () => {
          localThis.offsetX = offsetX.value;
        });
        offsetY.addEventListener('change', () => {
          localThis.offsetY = offsetY.value;
        });

        row.appendAll(sizeInput, fuzzyModifierInput, thicknessInput, offsetX, offsetY);
      }
      localThis.body.append(row);
    }

    #row3() {
      const localThis = this;
      const row = CodeMaid.createDOM.Row();
      {
        let loadImageButton = CodeMaid.createDOM.Button('Load');

        loadImageButton.addEventListener('click', () => {
          localThis.drawImage(localThis.size, localThis.fuzziness, localThis.brushSize, {
            x: localThis.offsetX,
            y: localThis.offsetY,
          });
        });

        row.appendAll(loadImageButton);
      }
      {
        let startDrawingButton = CodeMaid.createDOM.Button('Start');

        startDrawingButton.addEventListener('click', () => {
          localThis.isdrawing = true;
          localThis.execute();
        });

        row.appendAll(startDrawingButton);
      }
      {
        let stopDrawingButton = CodeMaid.createDOM.Button('Stop');

        stopDrawingButton.addEventListener('click', () => {
          localThis.isdrawing = false;
        });

        row.appendAll(stopDrawingButton);
      }
      {
        let resetDrawingButton = CodeMaid.createDOM.Button('Reset');

        resetDrawingButton.addEventListener('click', () => {
          localThis.isdrawing = false;
          localThis.executionLine = [];
        });

        row.appendAll(resetDrawingButton);
      }
      localThis.body.append(row);
    }

    loadImage(url) {
      // load the image
      var img = new Image();
      img.addEventListener('load', () => {
        this.previewCanvas.width = this.gameCanvas.width;
        this.previewCanvas.height = this.gameCanvas.height;

        this.canvasWidth = this.previewCanvas.width;
        this.canvasHeight = this.previewCanvas.height;

        var ctx = this.previewCanvas.getContext('2d');

        // center and resize image

        let modifier = 1;
        if (img.width > this.previewCanvas.width) {
          modifier = this.previewCanvas.width / img.width;
        } else {
          modifier = this.previewCanvas.height / img.height;
        }

        // draw the image
        // (this time to grab the image's pixel data
        ctx.drawImage(img, 0, 0, img.width * modifier, img.height * modifier);

        // grab the image's pixel data
        var imgData = ctx.getImageData(0, 0, this.previewCanvas.width, this.previewCanvas.height);
        this.imageDataRaw = imgData.data;

        // clear the canvas to draw the glow
        ctx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
        console.debug('ready');
      });
      img.crossOrigin = 'anonymous';
      img.src = url;
    }

    drawImage(size = 4, modifier = 1, thickness = 5, offset = { x: 0, y: 0 }, ignorcolors = []) {
      const localThis = this;
      this.executionLine = [];
      for (let y = 0; y < this.canvasHeight; y += size * modifier) {
        let start = [0, y];

        for (let x = 0; x < this.canvasHeight; x += size * modifier) {
          let end = [x, y];
          let index = (y * this.canvasWidth + x) * 4;

          let a = this.imageDataRaw[index + 3];

          if (a > 20) {
            end = [x, y];
            // Is not Transparent
            let r = this.imageDataRaw[index + 0],
              g = this.imageDataRaw[index + 1],
              b = this.imageDataRaw[index + 2];

            let color = `rgb(${r},${g},${b})`;

            if (!ignorcolors.includes(color)) {
              if (x < this.canvasWidth - 1) {
                let n_r = this.imageDataRaw[index + size * modifier * 4 + 4],
                  n_g = this.imageDataRaw[index + size * modifier * 4 + 5],
                  n_b = this.imageDataRaw[index + size * modifier * 4 + 6];

                let samecolor = true;
                // check if the next pixel is same color as the last
                if ((r != n_r && g != n_g && b != n_b) || this.imageDataRaw[index + 7] < 20) {
                  samecolor = false;
                }
                if (!samecolor) {
                  this.executionLine.push({
                    pos1: localThis.recalculate(start, size, offset),
                    pos2: localThis.recalculate(end, size, offset),
                    color: color,
                    thickness: thickness,
                  });
                  start = [x, y];
                }
              } else {
                this.executionLine.push({
                  pos1: localThis.recalculate(start, size, offset),
                  pos2: localThis.recalculate(end, size, offset),
                  color: color,
                  thickness: thickness,
                });
              }
            }
          } else {
            // Is Transparent
            start = [x, y];
          }
        }
      }
      console.debug('done Loading');
    }

    execute() {
      const localThis = this;
      if (!localThis.isdrawing) return (localThis.isdrawing = false);
      if (localThis.executionLine.length <= 0) return (localThis.isdrawing = false);

      const currentLine = localThis.executionLine.shift();
      const p1 = currentLine.pos1,
        p2 = currentLine.pos2,
        color = currentLine.color,
        thickness = currentLine.thickness;

      setTimeout(() => {
        localThis.parent.bot.socket.send(
          `42["drawcmd",0,[${p1[0]},${p1[1]},${p2[0]},${p2[1]},false,${0 - thickness},"${color}",0,0,{}]]`
        );
        this.execute();
      }, 10);
    }

    recalculate(value, size, offset) {
      return [
        (value[0] / (this.canvasWidth * size) + offset.x / 100).toFixed(4),
        (value[1] / (this.canvasHeight * size) + offset.y / 100).toFixed(4),
      ];
    }
  }

  /**
   * Start the Engine!
   */
  Engine.initialize();

  return Engine;
})('🎮', 'Cubic Engine');
