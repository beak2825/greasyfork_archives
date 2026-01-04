/** @format */
// ==UserScript==
// @name         Mxo New Bot
// @name:tr      Mxo Yeni Bot
// @namespace    mxo
// @version      1.0
// @license      GPLv3
// @description  Mxo Bot New
// @description:tr  Mxo Bot Yeni
// @author       https://github.com/bababoyy
// @match        https://pixelplace.io/*
// @exclude      https://pixelplace.io/forums*
// @exclude      https://pixelplace.io/blog*
// @exclude      https://pixelplace.io/api*
// @exclude      https://pixelplace.io/gold-chart.php
// @icon         https://r.resimlink.com/UVvSJWxFPc9.png
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @require      https://greasyfork.org/scripts/465115-mxo-new-bot-librarys-depencens/code/Mxo%20New%20Bot%20LibrarysDepencens.js
// @require      https://greasyfork.org/scripts/461221-mxobot-hacktimer-js-by-turuslan/code/MxoBot%20HackTimerjs%20By%20Turuslan.js
// @require      https://greasyfork.org/scripts/465113-mxo-new-bot-librarys/code/Mxo%20New%20Bot%20Librarys.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474874/Mxo%20New%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/474874/Mxo%20New%20Bot.meta.js
// ==/UserScript==

/* globals $, toastr */

Object.defineProperty(window.console, 'log', {
    value: console.log,
    writable: false,
  });
  var j = $;
  const query = document.querySelector.bind(document);
  function create(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
  }
  function drag(selector) {
    j(selector).draggable();
  }
  Object.defineProperty(window, 'WebSocket', {
    value: class extends WebSocket {
      constructor(url, header) {
        super(url, header);
        toastr.success('loaded ws');
        MxobotWS.loadWS(this);
      }
    },
    writable: false,
  });
  const MxobotWS = {
    canvas_context: undefined,
    trusted_code: undefined,
    $callbacks: [],
    BBY_on_message_send: () => true,
    original_send: undefined,
    loadWS: function (ws) {
      this.ws = ws;
      this.original_send = this.ws.send;
      this.ws.send = (...args) => {
        if (!this.BBY_on_message_send(...args)) {
          return;
        }
        return this.original_send.apply(this.ws, args);
      };
      this.ws.addEventListener('message', (message) => {
        if (message.data.indexOf('42') == -1) {
          return;
        }
        let json = JSON.parse(message.data.replace('42', ''));
        let code = json[0];
        let content = json[1];
        if (this.$callbacks[code]) {
          for (const callback of this.$callbacks[code]) {
            callback(content);
          }
        }
      });
    },
    // these numbers represent HEX codes to pixelplace's color palette.
    hashes: [
      0xFFFFFF,0xC4C4C4,0x888888,0x555555,0x222222,0x000000,0x006600,0x22B14C,0x02BE01,0x51E119,0x94E044,0xFBFF5B,0xE5D900,0xE6BE0C,0xE59500,0xA06A42,0x99530D,0x633C1F,0x6B0000,0x9F0000,0xE50000,0xFF3904,0xBB4F00,0xFF755F,0xFFC49F,0xFFDFCC,0xFFA7D1,0xCF6EE4,0xEC08EC,0x820080,0x5100FF,0x020763,0x0000EA,0x044BFF,0x6583CF,0x36BAFF,0x0083C7,0x00D3DD,0x45FFC8,0x003638,0x477050,0x98FB98,0xFF7000,0xCE2939,0xFF416A,0x7D26CD,0x330077,0x005BA1,0xB5E8EE,0x1B7400,
    ],
    BBY_get_pixel: function (x, y) {
      if (this.canvas_context == undefined) {
        this.canvas_context = document.getElementById('canvas').getContext('2d');
      }
      const [r, g, b, a] = this.canvas_context.getImageData(x, y, 1, 1).data;
      const hash = (r << 16) + (g << 8) + b;
      return this.hashes.findIndex((color) => hash == color);
    },
    ws: undefined,
    BBY_emit(msg, props) {
      if (!this.ws || this.ws.readyState != this.ws.OPEN) {
        return;
      }
      this.trusted_code = '42' + JSON.stringify([msg, props]);
      this.ws.send(this.trusted_code);
    },

    BBY_put_pixel: function (x, y, color) {
      this.BBY_emit('p', [x, y, color, 1]);
    },
    BBY_send_chat: function (msg, full) {
      let packet = {
        text: msg,
        mention: '',
        type: 'global',
        target: '',
        color: 11,
      };

      packet = { ...packet, ...full };

      this.BBY_emit('chat.message', packet);
    },
  };
  window.MxobotWS = MxobotWS;

  const IMAGE_CONVERTER_URL =
    'https://greasyfork.org/scripts/465117-mxo-new-bot-librarys-depencens-image-converter/code/Mxo%20New%20Bot%20LibrarysDepencens%20-%20Image%20Converter.js';
  const TASK_PROCESSOR_URL =
    'https://greasyfork.org/scripts/465120-mxo-new-bot-librarys-depencens-task-processor/code/Mxo%20New%20Bot%20LibrarysDepencens%20-%20Task%20Processor.js';
  const MXOBOT_CSS_URL =
    'https://raw.githubusercontent.com/hewsgm123/mxonewbot/main/mxobot.css';
  const DAILY_LOOT_URL = 'https://pixelplace.io/api/post-dailyloot.php';

  function createWorker(code) {
    return new Worker(
      URL.createObjectURL(new Blob([code], { type: 'text/javascript' }))
    );
  }

  async function $import(url) {
    let css = await fetch(url).then((x) => x.text());
    let elem = create(`<style>${css}</style>`);
    query('head').append(elem);
  }
  $import(MXOBOT_CSS_URL);
  fetch(DAILY_LOOT_URL, {
    body: 'spin=true',
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  })
    .then((x) => x.json())
    .then((data) => toastr.info(data.label))
    .catch(() => void 0);
  window.state = JSON.stringify(document.readyState);
  if (localStorage.firstTime == undefined) {
    localStorage.firstTime = true;
    toastr.warning(
      'Welcome to Mxo New bot, Made by 1mamii & mamii',
      { timeOut: 10000 }
    );
  }
  class MxobotFactory {
    constructor() {
      localStorage.timeout = localStorage.timeout || 40;
      this.extensions = [];
      this.Tasker = this.newTasker();
      this.reader = new FileReader();
      this.reader.onloadend = this.EVENT_reader_loadend.bind(this);
      this.worker_iprocess = undefined;
      this.intervalCode = undefined;
      this.counter = 0;
      this.Menu = {};
      this.restartTasker();
      this.handleUI().then(() => {
        window.onMxobotLoaded.forEach((a) => a());
        this.loadExtensions();
        this.EVENT_on_size_change();
      });
      setTimeout(this.wsGrantedCheck, 5000);
    }
    pixelColorCheck({ x, y, color }) {
      const coord_pixel_color = window.MxobotWS.BBY_get_pixel(x, y);
      return coord_pixel_color != -1 && coord_pixel_color != color;
    }
    GUIPostPixelSend() {
      /** @TODO */
    }
    prepareTasks(tasks) {
      return tasks.filter(this.Tasker.onTaskAction).filter(this.pixelColorCheck);
    }
    newTasker() {
      return {
        _tasks: [],
        onImageTaskReorganize: (a) => a,
        onTaskAction: (a) => true,
      };
    }
    restartTasker() {
      clearInterval(this.intervalCode);
      let context = this;
      this.intervalCode = setInterval(
        function () {
          if (this.Tasker._tasks.length == 0) {
            this.Tasker.onTaskAction();
            return;
          }
          let task = this.Tasker._tasks.shift();
          MxobotWS.BBY_put_pixel(task.x, task.y, task.color);
          this.GUIPostPixelSend(task);
          this.counter += 1;
        }.bind(this),
        localStorage.timeout
      );
    }
    killTasker() {
      clearInterval(this.intervalCode);
      this.intervalCode = undefined;
    }
    async createMenuHTML() {
      var url = 'https://raw.githubusercontent.com/1mamii/ppiomxonewbot/main/';
      if (window.navigator.language.includes('tr')) {
        url += 'turkish.html';
      } else {
        url += 'english.html';
      }
      var html_text = await (await fetch(url)).text();
      document.body.insertAdjacentHTML('beforeend', html_text);
    }
    createMxobotText() {
      document
        .getElementById('container')
        .insertAdjacentHTML(
          'beforeend',
          '<a target="_blank" href="https://discord.gg/hKz8NN9fvE" style="display: block; position: absolute; width: auto; bottom: 11px; right: 305px; color: rgb(255, 255, 255); text-shadow: rgb(0, 0, 0) 1px 1px 1px; font-size: 0.9em;">Mxo Discord</a>'
        );
      document
        .getElementById('container')
        .insertAdjacentHTML(
          'beforeend',
          '<a target="_blank" href="https://www.guilded.gg/mxo" style="display: block; position: absolute; width: auto; bottom: 11px; right: 250px; color: rgb(255, 255, 255); text-shadow: rgb(0, 0, 0) 1px 1px 1px; font-size: 0.9em;">Guilded</a>'
        );
    }
    createBotIcon() {
      let elem = $(
        '<a href="#" title="Bot Menu" class="grey margin-top-button"><img src="https://r.resimlink.com/UVvSJWxFPc9.png" alt="icon"></a>'
      );
      elem.on('click', function () {
        $('#menu').fadeToggle('fast');
      });
      elem.appendTo('#menu-buttons');
    }
    async handleUI() {
      await this.createMenuHTML();
      this.Menu = {
        canvas: create('<canvas></canvas>'),
        canvas_display: query('#Mxobot_canvas'),
        x: $('#Mxobot_x'),
        y: $('#Mxobot_y'),
        width: $('#Mxobot_width'),
        height: $('#Mxobot_height'),
        file: $('#Mxobot_file'),
        start: $('#Mxobot_start'),
        stop: $('#Mxobot_stop'),
        extensions_list: $('#Mxobot_select'),
        extension_run: $('#Mxobot_run'),
        dither_list: $('#Mxobot_dither'),
        dither_run: $('#Mxobot_dither_run'),
        original: $('#Mxobot_original'),
        img: new Image(),
        pixif: undefined,
      };
      this.handleEventListeners();
      this.Menu.width.val(100);
      this.Menu.height.val(100);
      this.createMxobotText();
      this.createBotIcon();
      drag('#menu');
      this.onKeyPress();
    }
    handleImageTaskReorganize(width, height, x, y) {
      if (this.Tasker.onImageTaskReorganize) {
        this.Tasker._tasks = this.Tasker.onImageTaskReorganize(
          this.Tasker._tasks,
          width,
          height,
          x,
          y
        );
      }
    }
    async drawImage(coords, image) {
      if (this.Tasker._tasks.length != 0) {
        return;
      }
      var tasks = [];
      let context = this;
      /** @TODO add TASK_PROCESSOR_URL into Mxobot class */
      var worker_tasks = createWorker(`importScripts("${TASK_PROCESSOR_URL}")`);
      console.log(worker_tasks);
      worker_tasks.onmessage = function (tasks_raw) {
        console.log(tasks_raw);
        var tasks = tasks_raw.data;
        this.Tasker._tasks = this.prepareTasks(tasks);
        this.handleImageTaskReorganize(image[0].length, image.length, ...coords);
        const orig = this.Tasker.onTaskAction;
        this.Tasker.onTaskAction = function (task) {
          if (task == undefined) {
            this.Tasker._tasks = this.prepareTasks(tasks);
            this.handleImageTaskReorganize(
              image[0].length,
              image.length,
              ...coords
            );
            return false;
          }
          return orig(task);
        }.bind(this);
        worker_tasks.terminate();
      }.bind(this);
      worker_tasks.postMessage({ coords: coords, image: image });
    }
    drawTasksIntoCanvas() {
      const context = document.getElementById('canvas').getContext('2d');
      const children = query('#palette-buttons').children;
      for (let task of this.Tasker._tasks) {
        var color = children[task.color].title + '7F';
        context.fillStyle = color;
        context.fillRect(task.x, task.y, 1, 1);
      }
    }
    putPixels(subpxArr) {
      var can = this.Menu.canvas;
      var ctx = can.getContext('2d'),
        imgd = ctx.createImageData(can.width, can.height);
      imgd.data.set(subpxArr);
      ctx.putImageData(imgd, 0, 0);
      this.Menu.canvas_display
        .getContext('2d')
        .drawImage(
          this.Menu.canvas,
          0,
          0,
          this.Menu.canvas.width,
          this.Menu.canvas.height,
          0,
          0,
          this.Menu.canvas_display.width,
          this.Menu.canvas_display.height
        );
    }
    generateImageWorker() {
      this.worker_iprocess = createWorker(
        `importScripts("${IMAGE_CONVERTER_URL}")`
      );
      this.worker_iprocess.onmessage = (pkg) => {
        var data = pkg.data;
        var i = this.Menu.canvas;
        var c = i.getContext('2d');
        this.putPixels(data[0]);
        this.Menu.pixif = data[1];
      };
    }
    process() {
      console.log(this);
      var i = this.Menu.canvas;
      var c = i.getContext('2d');
      var data = c.getImageData(
        0,
        0,
        this.Menu.original_width,
        this.Menu.original_height
      );
      this.generateImageWorker();
      this.worker_iprocess.postMessage({
        img: data,
        usetransparent: localStorage.usetransparent,
        kernel: localStorage.kernel,
      });
    }
    async EVENT_start_click() {
      if (this.Menu.pixif == undefined) {
        toastr.info('NO_IMAGE');
        return;
      }
      const coords = [this.Menu.x.val(), this.Menu.y.val()].map(Number);
      if (coords.map(isNaN).includes(true)) {
        toastr.error('NO_COORDS');
        return;
      }
      this.Menu.coords = coords;
      await this.drawImage(coords, this.Menu.pixif);
      if (this.intervalCode == undefined) {
        this.drawTasksIntoCanvas();
      }
    }

    EVENT_stop_click() {
      this.Tasker.onTaskAction = () => true;
      this.Tasker._tasks = [];
    }
    EVENT_img_load() {
      const ctx = this.Menu.canvas.getContext('2d');
      const { width, height } = this.Menu.img;
      const { original_width, original_height } = this.Menu;
      this.Menu.original.text(
        `Original size: ${original_width}px to ${original_height}px`
      );
      ctx.fillStyle = '#MXOB0';
      ctx.fillRect(0, 0, original_width, original_height);
      ctx.drawImage(this.Menu.img, 0, 0, original_width, original_height);
      this.process();
    }
    EVENT_reader_loadend() {
      this.Menu.img.src = this.reader.result.toString();
      this.Menu.img.onload = this.EVENT_img_load.bind(this);
    }
    EVENT_file_change() {
      let file = this.Menu.file[0].files[0];
      if (!file) {
        return;
      }
      this.reader.readAsDataURL(file);
    }
    EVENT_on_paste(event) {
      if ($('#menu').css('display') == 'none') {
        return;
      }
      var item = (event.clipboardData || event.originalEvent.clipboardData)
        .items[0];
      if (item.kind != 'file' && item.kind != 'paste') {
        return;
      }
      const blob = item.getAsFile();
      this.reader.readAsDataURL(blob);
    }
    EVENT_on_size_change() {
      const [width, height] = [this.Menu.width.val(), this.Menu.height.val()].map(
        Number
      );
      const context = this.Menu.canvas.getContext('2d');
      if (!width || !height) {
        toastr.error('WIDTH OR HEIGHT ERROR');
        return -1;
      }
      const [rWidth, rHeight] = this.ratioImageSize(width, height);
      this.Menu.canvas.width = width;
      this.Menu.canvas.height = height;
      this.Menu.canvas_display.width = rWidth;
      this.Menu.canvas_display.height = rHeight;
      this.Menu.original_width = width;
      this.Menu.original_height = height;
      context.fillStyle = '#MXOB0';
      context.fillRect(0, 0, width, height);
      context.drawImage(this.Menu.img, 0, 0, width, height);
      this.process();
    }
    EVENT_on_keypress(event) {
      if (document.activeElement == query('#chat > form > input[type=text')) {
        return;
      }
      switch (event.key) {
        case 'p':
          var [cx, cy] = this.getCoordinates();
          this.Menu.x.val(cx);
          this.Menu.y.val(cy);
          break;
      }
    }
    EVENT_dither_run_click() {
      localStorage.kernel = this.Menu.dither_list.val();
      this.EVENT_on_size_change();
    }
    handleEventListeners() {
      let context = this;
      this.Menu.start.on('click', this.EVENT_start_click.bind(this));
      this.Menu.stop.on('click', this.EVENT_stop_click.bind(this));
      this.Menu.file.on('change', this.EVENT_file_change.bind(this));
      this.Menu.width.on('change', this.EVENT_on_size_change.bind(this));
      this.Menu.height.on('change', this.EVENT_on_size_change.bind(this));
      document.addEventListener('paste', this.EVENT_on_paste.bind(this));
      this.Menu.dither_run.on('click', this.EVENT_dither_run_click.bind(this));
      this.Menu.dither_list.val(localStorage.kernel);
    }

    ratioImageSize(width, height) {
      const fit_in = 100;
      const biggest = Math.max(width, height);
      const smallest = Math.min(width, height);
      if (fit_in >= width && fit_in >= height) {
        return [width, height];
      }
      if (biggest == width) {
        return [fit_in, (height / width) * fit_in];
      } else {
        return [(width / height) * fit_in, fit_in];
      }
    }

    loadExtensions() {
      for (let extension of this.extensions) {
        const option = create(`<option>${extension[1]}</option>`);
        this.Menu.extensions_list.append(option);
      }
      this.Menu.extension_run.on('click', () => {
        const extension = this.extensions.find(
          (a) => a[1] == this.Menu.extensions_list.val()
        );
        extension[0]();
      });
    }
    getColors() {
      return Array.from(query('#palette-buttons').children);
    }
    getSelectedColor() {
      const colors = this.getColors();
      const selected_color = colors.find((x) => x.classList.contains('selected'));
      return parseInt(selected_color.getAttribute('data-id'));
    }
    getCoordinates() {
      return query('#coordinates').textContent.split(',').map(Number);
    }
    wsGrantedCheck() {
      if (MxobotWS.ws == undefined) {
        toastr.error('WS not hooked, Try Refeshing (This is not important but bot can be work lowest)');
      } else {
        toastr.success('WS hooked');
      }
    }
    onKeyPress() {
      document.body.addEventListener(
        'keypress',
        this.EVENT_on_keypress.bind(this)
      );
    }
  }
  function main() {
    const Mxobot = new MxobotFactory();
    window.Mxobot = Mxobot;
    if (localStorage.timeout < 40) {
      var l = create(
        '<marquee behavior="alternate" style="position: absolute; pointer-events: none;">WARNING: Your timeout is real low. Try having timeout of 40+</marquee>'
      );
      query('body').append(l);
    }
  }
  if (document.readyState == 'complete' || document.readyState == 'interactive') {
    main();
  } else {
    window.addEventListener('DOMContentLoaded', main, false);
  }