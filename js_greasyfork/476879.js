// ==UserScript==
// @name         OnshapeCapture
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  a simple script
// @author       You
// @match        https://cad.onshape.com/documents/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onshape.com
// @grant        GM_addStyle
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/476879/OnshapeCapture.user.js
// @updateURL https://update.greasyfork.org/scripts/476879/OnshapeCapture.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var module,
    window,
    define,
    renderjson = (function () {
      var themetext = function (/* [class, text]+ */) {
        var spans = [];
        while (arguments.length)
          spans.push(
            append(
              span(Array.prototype.shift.call(arguments)),
              text(Array.prototype.shift.call(arguments))
            )
          );
        return spans;
      };
      var append = function (/* el, ... */) {
        var el = Array.prototype.shift.call(arguments);
        for (var a = 0; a < arguments.length; a++)
          if (arguments[a].constructor == Array)
            append.apply(this, [el].concat(arguments[a]));
          else el.appendChild(arguments[a]);
        return el;
      };
      var prepend = function (el, child) {
        el.insertBefore(child, el.firstChild);
        return el;
      };
      var isempty = function (obj, pl) {
        var keys = pl || Object.keys(obj);
        for (var i in keys)
          if (Object.hasOwnProperty.call(obj, keys[i])) return false;
        return true;
      };
      var text = function (txt) {
        return document.createTextNode(txt);
      };
      var div = function () {
        return document.createElement("div");
      };
      var span = function (classname) {
        var s = document.createElement("span");
        if (classname) s.className = classname;
        return s;
      };
      var A = function A(txt, classname, callback) {
        var a = document.createElement("a");
        if (classname) a.className = classname;
        a.appendChild(text(txt));
        a.href = "#";
        a.onclick = function (e) {
          callback();
          if (e) e.stopPropagation();
          return false;
        };
        return a;
      };

      function _renderjson(json, indent, dont_indent, show_level, options) {
        var my_indent = dont_indent ? "" : indent;

        var disclosure = function (open, placeholder, close, type, builder) {
          var content;
          var empty = span(type);
          var show = function () {
            if (!content)
              append(
                empty.parentNode,
                (content = prepend(
                  builder(),
                  A(options.hide, "disclosure", function () {
                    content.style.display = "none";
                    empty.style.display = "inline";
                  })
                ))
              );
            content.style.display = "inline";
            empty.style.display = "none";
          };
          append(
            empty,
            A(options.show, "disclosure", show),
            themetext(type + " syntax", open),
            A(placeholder, null, show),
            themetext(type + " syntax", close)
          );

          var el = append(span(), text(my_indent.slice(0, -1)), empty);
          if (show_level > 0 && type != "string") show();
          return el;
        };

        if (json === null) return themetext(null, my_indent, "keyword", "null");
        if (json === void 0)
          return themetext(null, my_indent, "keyword", "undefined");

        if (typeof json == "string" && json.length > options.max_string_length)
          return disclosure(
            '"',
            json.substr(0, options.max_string_length) + " ...",
            '"',
            "string",
            function () {
              return append(
                span("string"),
                themetext(null, my_indent, "string", JSON.stringify(json))
              );
            }
          );

        if (
          typeof json != "object" ||
          [Number, String, Boolean, Date].indexOf(json.constructor) >= 0 // Strings, numbers and bools
        )
          return themetext(null, my_indent, typeof json, JSON.stringify(json));

        if (json.constructor == Array) {
          if (json.length == 0)
            return themetext(null, my_indent, "array syntax", "[]");

          return disclosure(
            "[",
            options.collapse_msg(json.length),
            "]",
            "array",
            function () {
              var as = append(
                span("array"),
                themetext("array syntax", "[", null, "\n")
              );
              for (var i = 0; i < json.length; i++)
                append(
                  as,
                  _renderjson(
                    options.replacer.call(json, i, json[i]),
                    indent + "    ",
                    false,
                    show_level - 1,
                    options
                  ),
                  i != json.length - 1 ? themetext("syntax", ",") : [],
                  text("\n")
                );
              append(as, themetext(null, indent, "array syntax", "]"));
              return as;
            }
          );
        }

        // object
        if (isempty(json, options.property_list))
          return themetext(null, my_indent, "object syntax", "{}");

        return disclosure(
          "{",
          options.collapse_msg(Object.keys(json).length),
          "}",
          "object",
          function () {
            var os = append(
              span("object"),
              themetext("object syntax", "{", null, "\n")
            );
            for (var k in json) var last = k;
            var keys = options.property_list || Object.keys(json);
            if (options.sort_objects) keys = keys.sort();
            for (var i in keys) {
              var k = keys[i];
              if (!(k in json)) continue;
              append(
                os,
                themetext(
                  null,
                  indent + "    ",
                  "key",
                  '"' + k + '"',
                  "object syntax",
                  ": "
                ),
                _renderjson(
                  options.replacer.call(json, k, json[k]),
                  indent + "    ",
                  true,
                  show_level - 1,
                  options
                ),
                k != last ? themetext("syntax", ",") : [],
                text("\n")
              );
            }
            append(os, themetext(null, indent, "object syntax", "}"));
            return os;
          }
        );
      }

      var renderjson = function renderjson(json) {
        var options = new Object(renderjson.options);
        options.replacer =
          typeof options.replacer == "function"
            ? options.replacer
            : function (k, v) {
              return v;
            };
        var pre = append(
          document.createElement("pre"),
          _renderjson(json, "", false, options.show_to_level, options)
        );
        pre.className = "renderjson";
        return pre;
      };
      renderjson.set_icons = function (show, hide) {
        renderjson.options.show = show;
        renderjson.options.hide = hide;
        return renderjson;
      };
      renderjson.set_show_to_level = function (level) {
        renderjson.options.show_to_level =
          typeof level == "string" && level.toLowerCase() === "all"
            ? Number.MAX_VALUE
            : level;
        return renderjson;
      };
      renderjson.set_max_string_length = function (length) {
        renderjson.options.max_string_length =
          typeof length == "string" && length.toLowerCase() === "none"
            ? Number.MAX_VALUE
            : length;
        return renderjson;
      };
      renderjson.set_sort_objects = function (sort_bool) {
        renderjson.options.sort_objects = sort_bool;
        return renderjson;
      };
      renderjson.set_replacer = function (replacer) {
        renderjson.options.replacer = replacer;
        return renderjson;
      };
      renderjson.set_collapse_msg = function (collapse_msg) {
        renderjson.options.collapse_msg = collapse_msg;
        return renderjson;
      };
      renderjson.set_property_list = function (prop_list) {
        renderjson.options.property_list = prop_list;
        return renderjson;
      };
      // Backwards compatiblity. Use set_show_to_level() for new code.
      renderjson.set_show_by_default = function (show) {
        renderjson.options.show_to_level = show ? Number.MAX_VALUE : 0;
        return renderjson;
      };
      renderjson.options = {};
      renderjson.set_icons("⊕", "⊖");
      renderjson.set_show_by_default(false);
      renderjson.set_sort_objects(false);
      renderjson.set_max_string_length("none");
      renderjson.set_replacer(void 0);
      renderjson.set_property_list(void 0);
      renderjson.set_collapse_msg(function (len) {
        return len + " item" + (len == 1 ? "" : "s");
      });
      return renderjson;
    })();
  console.log("renderjson", renderjson);
  // 添加样式
  GM_addStyle(`
        .toolcontainer {
            position: absolute;
            top: 50px;
            left: 50px;
            border: 1px solid #ccc;
        }

        .popup-div {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            width: 700px;
            height: 600px;
            background-color: #333333;
            resize: both; /* 允许改变大小 */
            overflow: auto; /* 允许滚动 */
        }

        .button-div {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 20px;
        }

        .button-div button, .popup-div button {
            padding: 4px;
            margin: 4px;
            background-color: #007bff;
            color: #fff;
            border: none;
            cursor: pointer;
        }

        .popup-title {
            padding: 2px;
            background-color: #909399;
            color: #fff;
            cursor: move;
            position: sticky;
            top: 0;
            z-index: 1;
        }

        .list-container {
            padding: 10px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #007bff #f7f7f7;
            height: 500px;
            dispaly: flex;
            flex-direction: column;
        }
        .item-title{
            padding: 4px;
            margin-bottom:0;
            cursor: pointer;
        }
        .list-item {
           border-bottom: 1px solid #333;
           display: flex;
           flex-direction: column;
           height: auto;
        }
        .item-content {
            display: none;
            padding: 10px;
            background-color: #f7f7f7;
        }
        .title-button {
            padding: 4px;
            margin-right: 2px;
        }

        .renderjson a              { text-decoration: none; color:mediumvioletred;}
        .renderjson .disclosure    { color: crimson;
                                    font-size: 150%; }
        .renderjson .syntax        { color: grey; }
        .renderjson .string        { color: #6cc877; }
        .renderjson .number        { color: #d9d9d9; }
        .renderjson .boolean       { color: plum; }
        .renderjson .key           { color: #f8c555; }
        .renderjson .keyword       { color: lightgoldenrodyellow; }
        .renderjson .object.syntax { color: lightseagreen; }
        .renderjson .array.syntax  { color: lightsalmon; }

    `);

  renderjson.set_icons(' ', ' ');
  renderjson.set_show_to_level(1);

  // 创建父容器
  const container = document.createElement("div");
  container.id = "toolcontainer";
  container.className = "toolcontainer";
  document.body.appendChild(container);

  // 创建第一个子div（按钮）
  const buttonDiv = document.createElement("div");
  buttonDiv.className = "button-div";
  container.appendChild(buttonDiv);

  // 创建按钮并添加点击事件
  const toggleButton = document.createElement("button");
  toggleButton.textContent = "消息日志";
  buttonDiv.appendChild(toggleButton);

  // 创建第二个子div（浮窗）
  const popupDiv = document.createElement("div");
  popupDiv.className = "popup-div";
  popupDiv.style.display = "none";
  container.appendChild(popupDiv);

  // 创建标题栏
  const popupTitle = document.createElement("div");
  popupTitle.className = "popup-title";
  popupDiv.appendChild(popupTitle);

  // 创建返回按钮并添加点击事件
  const backButton = document.createElement("button");
  backButton.textContent = "返回";
  backButton.classList.add("title-button");
  //   backButton.style.background = "#E6A23C";

  popupTitle.appendChild(backButton);
  // 添加返回按钮点击事件
  backButton.addEventListener("click", () => {
    buttonDiv.style.display = "block";
    popupDiv.style.display = "none";
  });

  const startButton = document.createElement("button");
  startButton.textContent = "开始";
  startButton.isStart = false;
  startButton.classList.add("title-button");
  //   startButton.style.backgroundColor = "#67C23A";
  popupTitle.appendChild(startButton);
  // 添加开始按钮点击事件
  startButton.addEventListener("click", () => {
    if (!startButton.isStart) {
      start();
      startButton.textContent = "停止";
      startButton.style.backgroundColor = "#F56C6C";
    } else {
      stop();
      startButton.textContent = "开始";
      startButton.style.backgroundColor = "#67C23A";
    }

    startButton.isStart = !startButton.isStart;
  });

  const clearButton = document.createElement("button");
  clearButton.textContent = "清空";
  clearButton.classList.add("title-button");
  popupTitle.appendChild(clearButton);
  clearButton.addEventListener("click", () => {
    listContainer.innerHTML = "";
  });

  const pingButton = document.createElement("button");
  pingButton.textContent = "屏蔽心跳消息";
  pingButton.classList.add("title-button");
  popupTitle.appendChild(pingButton);
  pingButton.addEventListener("click", () => {
    changePingStatus();
    if (logger.showPingMessages) {
      pingButton.textContent = "屏蔽心跳消息";
    } else {
      pingButton.textContent = "显示心跳消息";
    }


  });

  // 创建列表容器
  //const listContainer = document.createElement('div');
  const listContainer = document.createElement("ul");
  listContainer.className = "list-container";
  listContainer.id = "tool-list-container";
  popupDiv.appendChild(listContainer);

  // 添加拖动功能
  let isDragging = false;
  let offsetX, offsetY;
  let preparingDrag = false;
  let clickBtn = 0;

  popupTitle.addEventListener("mousedown", e => {
    isDragging = false;
    offsetX = e.clientX;
    offsetY = e.clientY;
    preparingDrag = true;
    clickBtn = 0;
  });
  toggleButton.addEventListener('mousedown', e => {
    isDragging = false;
    offsetX = e.clientX;
    offsetY = e.clientY;
    preparingDrag = true;
    clickBtn = 1;
  });

  document.addEventListener('mousemove', e => {
    if (!preparingDrag)
      return;
    const dX = e.clientX - offsetX;
    const dY = e.clientY - offsetY;
    //  console.log("dXdY",dX,dY);
    if (Math.abs(dX) > 5 || Math.abs(dY) > 5) {
      container.style.left = dX + container.getBoundingClientRect().left + "px";
      container.style.top = dY + container.getBoundingClientRect().top + "px";
      isDragging = true;
      offsetX = e.clientX;
      offsetY = e.clientY;
    }
  });

  document.addEventListener('mouseup', e => {
    // console.log("mouseup");
    if (!isDragging && clickBtn==1) {
      buttonDiv.style.display = "none";
      popupDiv.style.display = "block";
    }
    isDragging = false;
    preparingDrag = false;
  });

  class MyLogger {
    constructor(e, t, n, s, r, o, renderjson) {
      (this.debugMessagesVerbose = e), (this.showPingMessages = s), (this.hideIncomingMessages = r), (this.hideOutgoingMessages = o), (this.debugMessagesSpace = t
        ? 2
        : void 0), (this.startTimeInMilliseconds = Date.now());
      this.renderjson = renderjson;
    }
    getName() {
      return "BTMessageConnection.hook.Logger";
    }
    getPrettyTimeSpan() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      return "[" + hours + ":" + minutes + ":" + seconds + "] ";
    }
    messageReceived(e) {
      // console.log("messageReceived", e);
      const shouldHideIncomingMessages = this.hideIncomingMessages;
      const shouldIgnoreMessage = this.getShouldMessageBeIgnoredBasedOnType(
        e.getMessageNameForDebugging()
      );

      if (!shouldHideIncomingMessages && !shouldIgnoreMessage) {
        let title = "--> " + this.getPrettyTimeSpan() + e.getMessageNameForDebugging();
        this.addItem(title, e, "#F56C6C");
      }
      //this.hideIncomingMessages || this.getShouldMessageBeIgnoredBasedOnType(e.getMessageNameForDebugging()) || console.log("\x1b[36m--> " + this.getPrettyTimeSpan() + this.messageDebugString(e))
    }
    messageSent(e) {
      if (
        !this.hideOutgoingMessages &&
        !this.getShouldMessageBeIgnoredBasedOnType(
          e.getMessageNameForDebugging()
        )
      ) {
        // console.log("\x1b[34m<-- " + this.getPrettyTimeSpan() + this.messageDebugString(e));
        // console.log("messageSent", n);
        let title = "<-- " + this.getPrettyTimeSpan() + e.getMessageNameForDebugging();
        this.addItem(title, e, "#E6A23C");
        // this.addItem("messageSent", n);
      }
    }
    responseReceived(e) {
      const t = e.getMessageNameForDebugging();
      if (
        this.hideIncomingMessages ||
        this.getShouldMessageBeIgnoredBasedOnType(t)
      )
        return;

      // console.log(n, m);
      let title = "--> " + this.getPrettyTimeSpan() + t;

      this.addItem(title, e, "#409EFF");
    }
    callSent(e) {
      const t = e.getMessageNameForDebugging();
      if (
        this.hideOutgoingMessages ||
        this.getShouldMessageBeIgnoredBasedOnType(t)
      )
        return;

      // console.log(n, m);
      let title = "<-- " + this.getPrettyTimeSpan() + t;
      //   let content = JSON.stringify(e, null, this.debugMessagesSpace);
      this.addItem(title, e, "#67C23A");
    }
    getShouldMessageBeIgnoredBasedOnType(e) {
      return !(
        this.showPingMessages || !/(BTPingResponse|BTPingCall)$/.test(e)
      );
    }
    messageDebugString(e) {
      let t = e.getMessageNameForDebugging();
      return this.debugMessagesVerbose &&
        (t +=
          "\x1b[0m\n" + JSON.stringify(e, null, this.debugMessagesSpace)), t;
    }
    copyToClipboard(text) {
      var input = document.createElement('input');
      input.style.position = 'fixed';
      input.style.opacity = 0;
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
  }
    addItem(title_t, e, color) {
      // 创建列表项元素
      const listContainer = document.getElementById("tool-list-container");
      if (!listContainer) {
        console.log("Failed to find listContainer");
        return;
      }
      var listItem = document.createElement("div");
      listItem.classList.add("list-item");

      // 创建标题元素
      var title = document.createElement("pre");
      title.classList.add("item-title");
      title.style.color = color;
      title.textContent = title_t;

      // 创建内容元素
      var content = this.renderjson(e);
      // console.log(content);

      content.style.display = "none";
      // 将标题和内容添加到列表项中
      listItem.appendChild(title);
      listItem.appendChild(content);
      // 添加点击事件监听器
      title.addEventListener("click", function (event) {
        // 判断点击的元素是否为列表项
        // console.log("click listItem", event);

        // 切换内容元素的显示状态
        if (content.style.display === "none") {
          content.style.display = "block";
        } else {
          content.style.display = "none";
        }
      });
      title.addEventListener("contextmenu", (event)=>{
        event.stopPropagation();
        const s = JSON.stringify(e);
        console.log("contextmenu",s);
        this.copyToClipboard(s);
      });
      listContainer.appendChild(listItem);
    }
  }

  const logger = new MyLogger(true, true, true, true, false, false, renderjson);

  BTMessageConnection.currentConnections["bt.model.main"].addConnectionHook(
    logger
  );

  function start() {
    BTMessageConnection.currentConnections["bt.model.main"].addConnectionHook(
      logger
    );
  }

  function stop() {
    BTMessageConnection.currentConnections[
      "bt.model.main"
    ].removeConnectionHook(logger.getName());
  }

  function changePingStatus() {
    logger.showPingMessages = !logger.showPingMessages;
  }
})();