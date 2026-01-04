// ==UserScript==
// @name         Mxobot Library
// @namespace    http://tampermonkey.net/<3nevin
// @version      2.1
// @description  Library for Mxobot
// @author       @ngixl
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @grant        unsafeWindow
// @require      https://update.greasyfork.org/scripts/461063/1371348/Library%20For%20MxoBot.js

/* globals unsafeWindow*/
/*jshint esversion: 11 */

Object.defineProperty(unsafeWindow, "console", {
  value: console,
  writable: false,
});

class NevinLoggerFactory {
  static TEMPLATE = "%c[NevinCore] %s: %s";
  static CSS_INFO = "color:green";
  static CSS_WARNING = "color:yellow;";
  static CSS_ERROR = "color:red;font-weight: bold;";
  static TEMPLATE_INFO = "INFO";
  static TEMPLATE_WARNING = "WARNING";
  static TEMPLATE_ERROR = "ERROR";
  static LEVEL_INFO = 0;
  static LEVEL_WARNING = 1;
  static LEVEL_ERROR = 2;
  LEVEL = NevinLoggerFactory.LEVEL_INFO;
  constructor() {
    this.listeners = [];
    this.listeners.push(function (template, css, level, msg) {
      console.log(template, css, level, msg);
    });
  }
  dispatch(template, css, level, msg) {
    this.listeners.forEach((listener) => {
      listener(template, css, level, msg);
    });
  }
  info(msg) {
    if (this.LEVEL <= NevinLoggerFactory.LEVEL_INFO) {
      this.dispatch(
        NevinLoggerFactory.TEMPLATE,
        NevinLoggerFactory.CSS_INFO,
        NevinLoggerFactory.TEMPLATE_INFO,
        msg
      );
    }
  }
  warning(msg) {
    if (this.LEVEL <= NevinLoggerFactory.LEVEL_WARNING) {
      this.dispatch(
        NevinLoggerFactory.TEMPLATE,
        NevinLoggerFactory.CSS_WARNING,
        NevinLoggerFactory.TEMPLATE_WARNING,
        msg
      );
    }
  }
  error(msg) {
    if (this.LEVEL <= NevinLoggerFactory.LEVEL_ERROR) {
      this.dispatch(
        NevinLoggerFactory.TEMPLATE,
        NevinLoggerFactory.CSS_ERROR,
        NevinLoggerFactory.TEMPLATE_ERROR,
        msg
      );
      throw Error(msg);
    }
  }
}

class NevinImageConverter {
    static getClosestColor(r, g, b, palette) {
        let closestColor = null;
        let closestDistance = Number.MAX_VALUE;
        let closestIndex = -1;

        for (let i = 0; i < palette.colors.length; i++) {
            let bigint = palette.colors[i];
            let p_r = (bigint >> 16) & 255;
            let p_g = (bigint >> 8) & 255;
            let p_b = bigint & 255;

            // Calculate Euclidean distance
            let distance = Math.sqrt(
                Math.pow(r - p_r, 2) +
                Math.pow(g - p_g, 2) +
                Math.pow(b - p_b, 2)
            );

            if (distance < closestDistance) {
                closestDistance = distance;
                closestColor = {r: p_r, g: p_g, b: p_b};
                closestIndex = palette.indexes[i];
            }
        }
        return {color: closestColor, index: closestIndex};
    }

    static simpleDither(img_data, w, h, palette) {
        if (unsafeWindow.BOT_DO_NOT_DITHER === true) {
            return img_data;
        }

        const dithered = new Uint8ClampedArray(img_data.data.length);

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const idx = (y * w + x) * 4;
                const r = img_data.data[idx];
                const g = img_data.data[idx + 1];
                const b = img_data.data[idx + 2];
                const a = img_data.data[idx + 3];

                // Copy alpha channel
                dithered[idx + 3] = a;

                // Skip transparent pixels
                if (a < 128) {
                    dithered[idx] = 0;
                    dithered[idx + 1] = 0;
                    dithered[idx + 2] = 0;
                    continue;
                }

                // Find closest color
                const closest = NevinImageConverter.getClosestColor(r, g, b, palette);

                if (closest.color && closest.index !== -1) {
                    dithered[idx] = closest.color.r;
                    dithered[idx + 1] = closest.color.g;
                    dithered[idx + 2] = closest.color.b;
                } else {
                    // Fallback to original color if no match found
                    dithered[idx] = r;
                    dithered[idx + 1] = g;
                    dithered[idx + 2] = b;
                }
            }
        }

        return new ImageData(dithered, w, h);
    }
}

const NevinLogger = new NevinLoggerFactory();

class NevinPalette {
  static PALETTE_LOAD_STATIC = 0;
  static PALETTE_LOAD_DYNAMIC = 1;
  static hexStrToHex(hex_str) {
    return parseInt(hex_str.slice(1), 16);
  }
  static STATIC_COLORS = [
    16777215, 12895428, 8947848, 5592405, 2236962, 0, 13880, 26112, 1799168,
    4681808, 2273612, 179713, 5366041, 9756740, 10025880, 16514907, 15063296,
    15121932, 15045888, 16740352, 16726276, 15007744, 13510969, 16728426,
    10420224, 7012352, 16741727, 10512962, 6503455, 10048269, 12275456,
    16762015, 16768972, 16754641, 13594340, 8201933, 15468780, 8519808, 3342455,
    132963, 5308671, 234, 281599, 23457, 6652879, 3586815, 33735, 54237,
    4587464, 11921646, 10921638, 7303023, 3815994, 3470187, 7722665, 13315248,
    16763904, 12690658, 5048364, 4457492, 16744507, 12262892, 5840017,
  ];
  static STATIC_INDEX = [
    0, 1, 2, 3, 4, 5, 39, 6, 49, 40, 7, 8, 9, 10, 41, 11, 12, 13, 14, 42, 21,
    20, 43, 44, 19, 18, 23, 15, 17, 16, 22, 24, 25, 26, 27, 45, 28, 29, 46, 31,
    30, 32, 33, 47, 34, 35, 36, 37, 38, 48, 50, 51, 52, 53, 54, 55, 56, 57, 58,
    59, 60, 61, 62,
  ];

  initalizePalette(type) {
    if (type == undefined) {
      type = NevinPalette.PALETTE_LOAD_STATIC;
      NevinLogger.warning(
        "NevinPalette invoked without specifying the loading type."
      );
    }
    NevinLogger.info(
      "NevinPalette loading with type: " +
        (type == NevinPalette.PALETTE_LOAD_DYNAMIC ? "DYNAMIC" : "STATIC")
    );
    if (type == NevinPalette.PALETTE_LOAD_DYNAMIC) {
      const palette = document.getElementById("palette-buttons");
      if (!palette) {
        NevinLogger.error(
          "Palette requested to be loaded dynamically but HTML is not loaded yet."
        );
      }
      this.colors = [];
      this.indexes = [];
      const palette_buttons = Array.from(palette.children);
      NevinLogger.info("Dynamic loading found these DOM elements:");
      console.log(palette_buttons);
      for (const palette_button of palette_buttons) {
        const color = {
          hex: palette_button.getAttribute("title"),
          index: palette_button.getAttribute("data-id"),
        };

        this.colors.push(NevinPalette.hexStrToHex(color.hex));
        this.indexes.push(parseInt(color.index));
      }
    } else {
      this.colors = NevinPalette.STATIC_COLORS;
      this.indexes = NevinPalette.STATIC_INDEX;
    }
  }
  getIndex(x) {
    if (x instanceof Array) {
      const [r, g, b] = x;
      const hex = (r << 16) | (g << 8) | b;
      const index = this.colors.indexOf(hex);
      return index !== -1 ? this.indexes[index] : -1;
    } else if (typeof x == "number") {
      const index = this.colors.indexOf(x);
      return index !== -1 ? this.indexes[index] : -1;
    } else {
      NevinLogger.error("Argument is neither type of Array nor a number");
    }
  }

  getColorByIndex(index) {
    const colorIndex = this.indexes.indexOf(index);
    return colorIndex !== -1 ? this.colors[colorIndex] : null;
  }

  constructor(type) {
    this.colors = undefined;
    this.indexes = undefined;
    this.initalizePalette(type);
  }
}

class NevinOriginalWebSocket extends WebSocket {}

class NevinWS {
  constructor(nevinPalette, webSocket) {
    if (webSocket) {
      this.ws = webSocket;
      if (nevinPalette) {
        this.nevinMapCache = new NevinMapCache(nevinPalette, this.ws);
        this.nevinMapCache.addPixelChangeListener(this);
      }
    } else {
      this.ws = undefined;
      var proxy = this;
      this.hook = class extends WebSocket {
        constructor(a, b) {
          super(a, b);
          NevinLogger.info("NevinWS has hooked the game WebSocket connection.");
          proxy.ws = this;
          proxy.nevinMapCache.addPixelChangeListener(proxy);
        }
      };
      if (typeof unsafeWindow !== undefined) {
        if (unsafeWindow.WebSocket != NevinWS) {
          unsafeWindow.WebSocket = this.hook;
        }
      }
      this.nevinMapCache = new NevinMapCache(nevinPalette, this);
    }
  }
}

var map_cache;
class NevinMapCache {
  init(nevinPalette, nevinWS) {
    var canvas_id = parseInt(location.pathname.replace("/", "").split("-")[0]);
    var url = `https://pixelplace.io/canvas/${canvas_id}.png?a=${
      Math.floor(Math.random() * 1e9) + 1e9
    }`;
    var canvas_image = new Image();
    var spare_canvas = document.createElement("canvas");
    this.before_poll = [];
    this.cache = map_cache;
    if (this.cache) return;
    spare_canvas.ctx = spare_canvas.getContext("2d");
    canvas_image.onload = () => {
      NevinLogger.info("Map loaded");
      this.map_width = canvas_image.naturalWidth;
      this.map_height = canvas_image.naturalHeight;
      spare_canvas.width = this.map_width;
      spare_canvas.height = this.map_height;
      spare_canvas.ctx.drawImage(
        canvas_image,
        0,
        0,
        this.map_width,
        this.map_height
      );
      var data = spare_canvas.ctx.getImageData(
        0,
        0,
        this.map_width,
        this.map_height
      ).data;
      this.cache = new Int8Array(this.map_width * this.map_height);
      for (let i = 0; i < data.length; i += 4) {
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];
        const i_color = nevinPalette.getIndex([r, g, b]);
        this.cache[i >> 2] = i_color;
      }
      for (let packet of this.before_poll) {
        this.cache[packet[0]] = packet[1];
      }
      this.before_poll = undefined;
    };
    canvas_image.src = url;
  }
  constructor(nevinPalette, nevinWS) {
    this.init(nevinPalette, nevinWS);
  }
  getPixel(x, y) {
    var i = y * this.map_width + x;
    return this.cache[i];
  }
  addPixelChangeListener(nevinWS) {
    nevinWS.ws.addEventListener("message", (e) => {
      var data = e.data;
      if (!data.startsWith('42["p",')) {
        return;
      }
      var packets = JSON.parse(data.replace("42", ""))[1];
      for (let packet of packets) {
        var [x, y, color] = packet;
        var i = this.map_width * y + x;
        if (this.cache) {
          this.cache[i] = color;
        } else {
          this.before_poll.push([i, color]);
        }
      }
    });
  }
}

class NevinImagePicker {
  static requestImageFromFileDialog(NevinPalette) {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();
      input.addEventListener("change", function () {
        const reader = new FileReader();
        reader.onload = function (e) {
          NevinLogger.info("Image loaded");
          resolve(new NevinImage(e.target.result, NevinPalette));
        };
        if (input.files && input.files[0]) {
          reader.readAsDataURL(input.files[0]);
        }
      });
    });
  }
  static addClipboardListener(NevinPalette, callback) {
    document.addEventListener("paste", function (paste_e) {
      var items = (paste_e.clipboardData || paste_e.originalEvent.clipboardData)
        .items;
      NevinLogger.info(
        "Recieved data from clipboard: " + JSON.stringify(items)
      );
      var blob = null;
      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") === 0) {
          blob = items[i].getAsFile();
        }
      }
      if (blob !== null) {
        var reader = new FileReader();
        reader.onload = function (e) {
          NevinLogger.info("Readed image from clipboard!");
          callback(new NevinImage(e.target.result, NevinPalette));
        };
        reader.readAsDataURL(blob);
      }
    });
  }
}

function NevinWaitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

function NevinCreateWorker(code) {
  var blob = new Blob([code], { type: "text/javascript" });

  var url = URL.createObjectURL(blob);

  var worker = new Worker(url);
  return worker;
}

class NevinImage {
  constructor(x, palette) {
    this.NevinPalette = palette;
    this.image = undefined;
    this.image_canvas = document.createElement("canvas");
    this.image_context = this.image_canvas.getContext("2d");
    if (x instanceof Image) {
      this.image = x;
    } else if (typeof x == "string") {
      this.image = new Image();
      this.image.src = x;
    }
    if (this.image == undefined) {
      NevinLogger.error("Argument is neither type of Image nor a string");
    }
    this.image_context.mozImageSmoothingEnabled = false;
    this.image.onload = () => {
      this.image_canvas.width = this.image.width;
      this.image_canvas.height = this.image.height;
      this.image_context.drawImage(this.image, 0, 0);
      this.image_data = this.image_context.getImageData(
        0,
        0,
        this.image_canvas.width,
        this.image_canvas.height
      );
      NevinLogger.info('Converting image to palette colors...');
      this.image_data = NevinImageConverter.simpleDither(
        this.image_data,
        this.image.width,
        this.image.height,
        palette
      );
    };
  }
  convertToTasks(sx, sy, nevinWS) {
    if (typeof sx != "number" || typeof sy != "number") {
      NevinLogger.error(
        "Tried to convert an image to tasks yet the starting coordinates are not a number."
      );
    }
    if (!(nevinWS instanceof NevinWS)) {
      NevinLogger.error(
        "NevinImage.convertToTasks requires an NevinWS in new versions. Please update your code."
      );
    }

    // Wait for image to load and be processed
    if (!this.image_data) {
      NevinLogger.warning("Image not loaded yet, waiting...");
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.image_data) {
            clearInterval(checkInterval);
            resolve(this._convertToTasksInternal(sx, sy, nevinWS));
          }
        }, 100);
      });
    }

    return this._convertToTasksInternal(sx, sy, nevinWS);
  }

  _convertToTasksInternal(sx, sy, nevinWS) {
    var _tasks = [];

    for (let y = 0; y < this.image_data.height; y++) {
      for (let x = 0; x < this.image_data.width; x++) {
        const idx = (y * this.image_data.width + x) * 4;
        const r = this.image_data.data[idx];
        const g = this.image_data.data[idx + 1];
        const b = this.image_data.data[idx + 2];
        const a = this.image_data.data[idx + 3];

        // Skip transparent or semi-transparent pixels
        if (a < 128) {
          continue;
        }

        const colorIndex = this.NevinPalette.getIndex([r, g, b]);
        if (colorIndex === -1) {
          continue;
        }

        const canvasX = sx + x;
        const canvasY = sy + y;
        const currentColor = nevinWS.nevinMapCache.getPixel(canvasX, canvasY);

        if (currentColor !== colorIndex) {
          _tasks.push([canvasX, canvasY, colorIndex]);
        }
      }
    }

    NevinLogger.info(`Generated ${_tasks.length} tasks from image`);
    return _tasks;
  }
}

class NevinEngine {
  static convertToTask(x, y, colorIndex, packetType) {
    if (packetType == undefined) {
      packetType = 1;
    }
    return `42["p",${JSON.stringify([x, y, colorIndex, packetType])}]`;
  }
  putPixel(x, y, colorIndex) {
    this.tasks.push([x, y, colorIndex]);
  }
  putPixelWithPriority(x, y, colorIndex) {
    this.tasks.unshift([x, y, colorIndex]);
  }
  constructor(NevinWS, timeout) {
    if (!NevinWS || !timeout) {
      return;
    }
    this.tasks = [];
    this.NevinWS = NevinWS;
    this.intervalID = setInterval(() => {
      const task = this.tasks.shift();
      if (!task) {
        return;
      }
      if (this.NevinWS.nevinMapCache.getPixel(task[0], task[1]) == task[2]) {
        return;
      }
      this.NevinWS.ws.send(NevinEngine.convertToTask(...task));
    }, timeout);
  }
}

class NevinEngineMultiBot extends NevinEngine {
  static getAccountDetailsFromCookie(cookie) {
    const dict = cookie
      .split("; ")
      .map((a) => a.split("="))
      .reduce(function (b, a) {
        if (!["authKey", "authToken", "authId"].includes(a[0])) return b;
        b[a[0]] = a[1];
        return b;
      }, {});
    return [dict.authId, dict.authToken, dict.authKey];
  }
  addAccountFromCookies(authId, authToken, authKey) {
    if (!authId || !authToken || !authKey) {
      NevinLogger.warning(
        "Auth informations are not defined. (Maybe not logged in?)"
      );
      return;
    }
    const boardId = parseInt(location.pathname.replace("/", "").split("-")[0]);
    const socket = new NevinOriginalWebSocket(
      "wss://pixelplace.io/socket.io/?EIO=3&transport=websocket"
    );
    socket.headless = true;
    socket.onmessage = ({ data }) => {
      const [code, msg] = data.split(/(?<=^\d+)(?=[^\d])/);
      if (code == "40") {
        socket.send(
          "42" +
            JSON.stringify(["init", { authKey, authToken, authId, boardId }])
        );
      }

      const message = JSON.parse(msg || "[]");
      if (message.pingInterval)
        socket.ping = setInterval(() => socket.send("2"), message.pingInterval);

      if (!message.length) return arguments;
      const [event, json] = message;
      if (event == "throw.error") {
        socket.close();
        NevinLogger.error(json);
      }
    };
    socket.onclose = () => {
      NevinLogger.info("User Disconnected");
    };
    const nevinWS = new NevinWS(undefined, socket);
    this.sockets.push(nevinWS);
  }
  addAccountFromNevinWS(nevinWS) {
    this.sockets.push(nevinWS);
  }
  constructor(timeout, nevinPalette) {
    super();
    this.tasks = [];
    this.sockets = [];
    this.counter = 0;
    function interval() {
      if (this.sockets.length == 0) {
        setTimeout(interval, 100);
        return;
      }
      const task = this.tasks.shift();
      if (!task) {
        setTimeout(interval, timeout / this.sockets.length);
        return;
      }
      this.counter = (this.counter + 1) % this.sockets.length;
      this.sockets[this.counter]?.ws?.send(NevinEngine.convertToTask(...task));
      setTimeout(this.interval, timeout / this.sockets.length);
    }
    interval = interval.bind(this);
    interval();
    this.interval = interval;
  }
}
class NevinProtect {
  constructor(core) {
    NevinLogger.info("NevinProtect has been opened.");
    this.core = core;
    this.nimage = undefined;
    this.coordinates = undefined;
    this.working = false;
    this.core.nevinWS.ws.addEventListener(
      "message",
      function (e) {
        if (!this.working) return;
        if (!this.nimage) return;
        if (!this.coordinates) return;
        var data = e.data;
        if (!data.startsWith('42["p",')) {
          return;
        }
        var packets = JSON.parse(data.replace("42", ""))[1];
        for (let packet of packets) {
          var [x, y, color] = packet;
          var image_width = this.nimage.image.width;
          var image_height = this.nimage.image.height;
          var image_x = this.coordinates[0];
          var image_y = this.coordinates[1];
          var image_xmax = image_width + image_x;
          var image_ymax = image_height + image_y;
          if (!this.nimage) {
            continue;
          }
          if (
            x < image_x ||
            x >= image_xmax ||
            y < image_y ||
            y >= image_ymax
          ) {
            continue;
          }
          var img_data_index = 4 * (x - image_x + image_width * (y - image_y));
          var [r, g, b, a] = this.nimage.image_data.data.slice(
            img_data_index,
            img_data_index + 4
          );
          if (a < 128) continue;
          var image_color_i = this.core.palette.getIndex([r, g, b]);
          if (image_color_i == -1) {
            continue;
          }
          if (image_color_i != color) {
            this.core.engine.putPixelWithPriority(x, y, image_color_i);
          }
        }
      }.bind(this)
    );
  }
  start() {
    this.working = true;
  }
  stop() {
    this.working = false;
  }
  load(nimage, coordinates) {
    this.nimage = nimage;
    this.coordinates = coordinates;
  }
}

class NevinCore {
  async testAccountValidation() {
    const req = await fetch(
      "https://pixelplace.io/api/get-painting.php?id=7&connected=1"
    );
    const json = await req.json();
    if (json.user.name == "Guest") {
      NevinLogger.warning("User is not logged in!");
    } else {
      NevinLogger.info("Logged in as " + json.user.name);
    }
  }
  constructor(options) {
    this.testAccountValidation();
    this.palette = new NevinPalette(NevinPalette.PALETTE_LOAD_STATIC);
    this.nevinWS = new NevinWS(this.palette);
    if (options.multibot) {
      this.engine = new NevinEngineMultiBot(options.timeout);
      localStorage.nevinAccounts = localStorage.nevinAccounts || "[]";
      const nevinAccounts = JSON.parse(localStorage.nevinAccounts);
      unsafeWindow.addThisAccount = function () {
        const session_account = NevinEngineMultiBot.getAccountDetailsFromCookie(
          document.cookie
        ).join("_AND_");
        if (session_account[0] && !nevinAccounts.includes(session_account)) {
          nevinAccounts.push(session_account);
        }
        localStorage.nevinAccounts = JSON.stringify(nevinAccounts);
      };
      for (let account of nevinAccounts) {
        const [authId, authToken, authKey] = account.split("_AND_");
        if (!authId || !authToken || !authKey) {
          console.error(account);
          NevinLogger.error("Local account is corrupted");
        }
        this.engine.addAccountFromCookies(authId, authToken, authKey);
      }
    } else {
      this.engine = new NevinEngine(this.nevinWS, options.timeout);
    }
    this.picker = NevinImagePicker;
    this.logger = NevinLogger;
  }
}