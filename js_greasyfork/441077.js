// ==UserScript==
// @name         哔哩哔哩视频笔记时间进度记录器 Bilibili Video Note Recorder
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  方便PC端观看B站系列视频时，时间进度记录(=￣ω￣=)
// @author       乃木流架
// @match        https://www.bilibili.com/*
// @match        https://member.bilibili.com/platform/upload-manager/*
// @icon         data:image/png;base64,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
// @grant        GM_addStyle
// @run-at       document-start
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/441077/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E7%AC%94%E8%AE%B0%E6%97%B6%E9%97%B4%E8%BF%9B%E5%BA%A6%E8%AE%B0%E5%BD%95%E5%99%A8%20Bilibili%20Video%20Note%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/441077/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E7%AC%94%E8%AE%B0%E6%97%B6%E9%97%B4%E8%BF%9B%E5%BA%A6%E8%AE%B0%E5%BD%95%E5%99%A8%20Bilibili%20Video%20Note%20Recorder.meta.js
// ==/UserScript==

(() => {
  ("use strict");
  
  if (/member.bilibili.com/.test(window.location.href)) {
      GM_addStyle(`
      .ep-section-edit-video-list-item-title .title-text-content {
        display: contents !important;
      }
    `)
    throw new Error('🛑Bilibili Recorder脚本终止执行🛑')
  }
  


  const name = "Bilibili Recorder";
  const logPrefix = [
    "%c" + name,
    `background:#52c41a;border-radius: 0.5em;color: white;padding: 2px 0.5em`,
  ];
  function log(...args) {
    console.log(...logPrefix, ...args);
  }

  const iconUrl = "https://i.jpg.dog/037000721ae61d81533753de8af04d4d.png";
  const icon =
    "data:image/png;base64,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";

  var record = document.createElement("div");

  /**
   * @desc 属性改变监听，属性被set时出发watch的方法，类似vue的watch
   * @author Jason
   * @study https://www.jianshu.com/p/00502d10ea95
   * @data 2018-04-27
   * @constructor
   * @param {object} opts - 构造参数. @default {data:{},watch:{}};
   * @argument {object} data - 要绑定的属性
   * @argument {object} watch - 要监听的属性的回调
   * watch @callback (newVal,oldVal) - 新值与旧值
   */
  class watcher {
    constructor(opts) {
      this.$data = this.getBaseType(opts.data) === "Object" ? opts.data : {};
      this.$watch = this.getBaseType(opts.watch) === "Object" ? opts.watch : {};
      for (let key in opts.data) {
        this.setData(key);
      }
    }

    getBaseType(target) {
      const typeStr = Object.prototype.toString.apply(target);

      return typeStr.slice(8, -1);
    }

    setData(_key) {
      Object.defineProperty(this, _key, {
        get: function () {
          return this.$data[_key];
        },
        set: function (val) {
          const oldVal = this.$data[_key];
          if (oldVal === val) return val;
          this.$data[_key] = val;
          this.$watch[_key] &&
            typeof this.$watch[_key] === "function" &&
            this.$watch[_key].call(this, val, oldVal);
          return val;
        },
      });
    }
  }

  function add0(m) {
    return m < 10 ? "0" + m : m;
  }

  function format(timestamp) {
    //timestamp是整数，否则要parseInt转换
    var time = new Date(timestamp);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return (
      y + "年" + m + "月" + d + "日" + add0(h) + ":" + add0(mm) + ":" + add0(s)
    );
  }

  function iss() {
    var is = document.getElementsByClassName("note-operation")[0];
    var operation = document.getElementsByClassName("note-header drag-el")[0];
    var back_note = document.getElementsByClassName("back-note-list")[0];
    var note_operation = document.getElementsByClassName(
      "list-note-operation"
    )[0];
    if (back_note) {
      back_note.addEventListener("click", function () {
        operation.insertBefore(record, operation.children[1].nextSibling);
      });
    }
    if (note_operation) {
      note_operation.addEventListener("click", function () {
        operation.insertBefore(record, operation.children[1].nextSibling);
      });
    }

    // operation.insertBefore(record, operation.children[1].nextSibling);
    if (is == undefined) {
      // operation.insertBefore(record, operation.children[1].nextSibling);
      record.style.display = "none";
    } else {
      // operation.insertBefore(record, operation.children[1].nextSibling);
      record.style.display = "flex";
    }
  }

  function init() {
    log("init button");

    var operation = document.getElementsByClassName("note-header drag-el")[0];
    var styleMap = {
      position: "relative",
      marginRight: "16px",
      width: "30px",
      height: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "12px",
      lineHeight: "20px",
      border: "1px solid #00aeec",
      color: "#00aeec",
      transition: "0.2s",
      background: "#ffffff",
    };

    record.setAttribute("class", "record");
    record.innerHTML =
      "<img src = " + icon + ' width="20" height="20" align="middle"></img>';

    for (let i in styleMap) {
      record.style[i] = styleMap[i];
    }

    // var noteop = document.getElementsByClassName('note-operation')[0];
    operation.insertBefore(record, operation.children[1].nextSibling);
    // operation.childNodes[1].appendChild(record);

    record.addEventListener("click", function () {
      log("start record");

      var editor = document.getElementsByClassName("ql-editor")[0];
      var now = +new Date();
      var number = 1;

      var lastHTML = editor.innerHTML;
      var lastContent = editor.textContent;
      log("lastHTML: " + lastHTML);
      log("lastContent: " + lastContent);

      var searchParams = new URLSearchParams(window.location.search);
      var end = document.getElementsByClassName("page-num").length;
      var list = document.getElementsByClassName("list-box")[0];

      number = searchParams.get("p");
      var numberP = "";

      if (list) {
        var on = list.getElementsByClassName("on")[0];
        numberP = on.getElementsByClassName("page-num")[0].innerHTML;
      } else {
        numberP = "P1";
      }

      log("numberP: " + numberP);
      log("list: " + list);

      if (number != end && lastContent == "") {
        editor.innerHTML = "<p>" + format(now) + "</p><p>" + numberP + "</p>";
      } else if (number != end && lastContent != "") {
        editor.innerHTML =
          lastHTML +
          "<p><br></p><p>" +
          format(now) +
          "</p><p>" +
          numberP +
          "</p>";
      } else if (number == end && lastContent == "") {
        editor.innerHTML = "<p>" + format(now) + "</p><p>完结撒花！！！</p>";
      } else if (number == end && lastContent != "") {
        editor.innerHTML =
          lastHTML +
          "<p><br></p><p>" +
          format(now) +
          "</p><p>完结撒花！！！</p>";
      }
    });
  }

  function start() {
    log("bilibiliRecorder userscript is running...");

    var noteButton = document.querySelector(".video-note-inner");
    var noteList = document.querySelector(".note-list");
    var noteOper = document.querySelector(".list-note-operation");
    var noteClose = document.querySelector(".close-note");

    log("noteButton: " + noteButton);

    noteButton.addEventListener("click", function () {
      log("noteButton pressed");

      let wm = new watcher({
        data: {
          ne: false,
        },
        watch: {
          ne(newVal) {
            log("noteEditor changed to: " + newVal);
            if (!newVal) {
              log("button no init");
              noteOper.addEventListener("click", function () {
                log("noteOper pressed");
                init();
              });
            } else {
              log("button init");
              init();
            }
          },
        },
      });

      var isss = setInterval(function () {
        iss();

        var noteEditor = document.querySelector(".note-editor") != null;
        wm.ne = noteEditor;
      }, 500);

      if (noteClose) {
        noteClose.onclick = () => {
          log("noteClose pressed");

          clearInterval(isss);

          log("Interval cleared");
        };
      }
    });
  }

  window.onload = function () {
    log("window.onload");
    setTimeout(() => {
      start();
    }, 5000);
  };

  // Your code here...
})();
