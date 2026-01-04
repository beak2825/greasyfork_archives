// ==UserScript==
// @name         seu-library-tutor
// @namespace    https://github.com/qisumi
// @version      1.1.0
// @description  国际交流英语课程小组项目-SEU图书馆交互式教学
// @author       Qisumi
// @license      MIT
// @match        http://lib.seu.edu.cn/*
// @match        http://lib.seu.edu.cn/seu_en/
// @match        https://*.cnki.net/*
// @match        https://kns.cnki.net/kns8s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/driver.js@1.3.0/dist/driver.js.iife.js
// @require      https://unpkg.com/i18next/dist/umd/i18next.min.js
// @resource driverjs_css  https://cdn.jsdelivr.net/npm/driver.js@1.3.0/dist/driver.css
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/478443/seu-library-tutor.user.js
// @updateURL https://update.greasyfork.org/scripts/478443/seu-library-tutor.meta.js
// ==/UserScript==
(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // global-externals:jquery
  var jquery_default = $;

  // src/style/userpanel.css
  var userpanel_default = ".Q-accordion {\n    background-color: #eee;\n    color: #444;\n    cursor: pointer;\n    padding: 8px;\n    width: 100%;\n    text-align: left;\n    border: none;\n    outline: none;\n    transition: 0.4s;\n    text-align: center;\n    font-size: 13px;\n}\n\n.Q-active,\n.Q-accordion:hover {\n    background-color: #ccc;\n}\n\n.Q-panel {\n    padding: 2px;\n    background-color: white;\n    display: none;\n    overflow: hidden;\n}\n\n#Q-floating-panel {\n    position: absolute;\n    z-index: 999;\n    background-color: #f1f1f1;\n    border: 1px solid #d3d3d3;\n    border-radius: 5px;\n    text-align: center;\n    width: 200px;\n}\n\n#Q-floating-panel-header {\n    padding: 10px;\n    cursor: move;\n    z-index: 10;\n    background-color: #2196F3;\n    font-size: 16px;\n    font-weight: 900;\n    color: #fff;\n}\n\n.Q-func {\n    margin: 3px;\n    cursor: pointer;\n    border: 1px solid #d3d3d3;\n    font-size: 12px;\n}\n\n.Q-func:hover {\n    background-color: #11e42a;\n}\n\n/* \u8FD9\u90E8\u5206\u4E3B\u8981\u7528\u4E8E\u5B9E\u73B0\u9F20\u6807\u4E8B\u4EF6\u7A7F\u900F */\n/* .driver-overlay {\n    pointer-events: none;\n} */\n\n#driver-popover-content {\n    color: #fff;\n    background-color: #409eff;\n}\n\n#driver-popover-content:has(img) {\n    max-width: 3000px;\n    padding: 0;\n}\n\n#driver-popover-content .driver-popover-arrow {\n    border: 5px solid #409eff;\n    border-left-color: transparent;\n    border-top-color: transparent;\n    border-right-color: transparent;\n}\n\n#driver-popover-content .driver-popover-prev-btn {\n    background: #fff;\n    color: #2d2d2d;\n    /* border: 1px solid #dcdfe6; */\n    border: none;\n}\n\n#driver-popover-content .driver-popover-next-btn {\n    background: #fff;\n    color: #2d2d2d;\n    /* border: 1px solid #dcdfe6; */\n    border: none;\n}\n\n.driver-popover-footer .driver-popover-progress-text {\n    color: #fff;\n}";

  // src/html/userpanel.html
  var userpanel_default2 = '<div id="Q-floating-panel">\n    <div id="Q-floating-panel-header"></div>\n    <div class="Q-floating-panel-submodule">\n        <button class="Q-accordion" id="Q-panel-5"></button>\n        <div class="Q-panel">\n            <div id="Q-panel-5-func-1" class="Q-func"></div>\n        </div>\n    </div>\n    <div class="Q-floating-panel-submodule">\n        <button class="Q-accordion" id="Q-panel-1"></button>\n        <div class="Q-panel">\n            <div id="Q-panel-1-func-1" class="Q-func"></div>\n            <div id="Q-panel-1-func-2" class="Q-func"></div>\n            <div id="Q-panel-1-func-3" class="Q-func"></div>\n        </div>\n    </div>\n    <div class="Q-floating-panel-submodule">\n        <button class="Q-accordion" id="Q-panel-2"></button>\n        <div class="Q-panel">\n            <div id="Q-panel-2-func-1" class="Q-func"></div>\n            <div id="Q-panel-2-func-2" class="Q-func"></div>\n        </div>\n    </div>\n    <div class="Q-floating-panel-submodule">\n        <button class="Q-accordion" id="Q-panel-3"></button>\n        <div class="Q-panel">\n            <div id="Q-panel-3-func-1" class="Q-func"></div>\n            <div id="Q-panel-3-func-2" class="Q-func"></div>\n        </div>\n    </div>\n    <div class="Q-floating-panel-submodule">\n        <button class="Q-accordion" id="Q-panel-4"></button>\n        <div class="Q-panel">\n            <div id="Q-panel-4-func-1" class="Q-func"></div>\n        </div>\n    </div>\n</div>';

  // global-externals:driver.js
  var driver_default = window.driver.js;

  // src/userpanel.js
  function enablePanelDraggable() {
    let elem = document.querySelector("#Q-floating-panel");
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elem.id + "-header")) {
      document.getElementById(elem.id + "-header").onmousedown = dragMouseDown;
    } else {
      elem.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
    __name(dragMouseDown, "dragMouseDown");
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elem.style.top = elem.offsetTop - pos2 + "px";
      elem.style.left = elem.offsetLeft - pos1 + "px";
    }
    __name(elementDrag, "elementDrag");
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
    __name(closeDragElement, "closeDragElement");
  }
  __name(enablePanelDraggable, "enablePanelDraggable");
  function enablePanelFoldable() {
    let acc = document.getElementsByClassName("Q-accordion");
    let panel_selector;
    for (panel_selector = 0; panel_selector < acc.length; panel_selector++) {
      acc[panel_selector].addEventListener("click", function() {
        this.classList.toggle("Q-active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
    }
    let submodule_hide = false;
    $("#Q-floating-panel-header").on("dblclick", function() {
      if (submodule_hide)
        $(".Q-floating-panel-submodule").show();
      else
        $(".Q-floating-panel-submodule").hide();
      submodule_hide = !submodule_hide;
    });
  }
  __name(enablePanelFoldable, "enablePanelFoldable");
  function bindFunction2Panel(panelIdx, buttonIdx, func, params = []) {
    $("#Q-panel-" + panelIdx + "-func-" + buttonIdx).on("click", function() {
      func(...params);
    });
  }
  __name(bindFunction2Panel, "bindFunction2Panel");
  function refreshPanelWithLang($2, i18next) {
    $2("#Q-floating-panel-header").text(i18next.t("panel.title"));
    $2("#Q-panel-1").text(i18next.t("panel.panel-1"));
    $2("#Q-panel-1-func-1").text(i18next.t("panel.panel-1-func-1"));
    $2("#Q-panel-1-func-2").text(i18next.t("panel.panel-1-func-2"));
    $2("#Q-panel-1-func-3").text(i18next.t("panel.panel-1-func-3"));
    $2("#Q-panel-2").text(i18next.t("panel.panel-2"));
    $2("#Q-panel-2-func-1").text(i18next.t("panel.panel-2-func-1"));
    $2("#Q-panel-2-func-2").text(i18next.t("panel.panel-2-func-2"));
    $2("#Q-panel-3").text(i18next.t("panel.panel-3"));
    $2("#Q-panel-3-func-1").text(i18next.t("panel.panel-3-func-1"));
    $2("#Q-panel-3-func-2").text(i18next.t("panel.panel-3-func-2"));
    $2("#Q-panel-4").text(i18next.t("panel.panel-last"));
    $2("#Q-panel-4-func-1").text(i18next.t("panel.panel-last"));
    $2("#Q-panel-5").text(i18next.t("panel.panel-5"));
    $2("#Q-panel-5-func-1").text(i18next.t("panel.panel-5-func-1"));
  }
  __name(refreshPanelWithLang, "refreshPanelWithLang");

  // src/utils.js
  function waitForElementToDisplay(selector, callback, timeout = 1e3) {
    let el = document.querySelector(selector);
    if (el) {
      setTimeout(() => {
        callback(el);
      }, timeout);
    } else {
      setTimeout(() => {
        waitForElementToDisplay(selector, callback);
      }, 100);
    }
  }
  __name(waitForElementToDisplay, "waitForElementToDisplay");

  // src/plugins/cnki-plugin.js
  var cnkiDriver = {};
  function cnkiTutor(langProvider) {
    if (window.location.href === "http://lib.seu.edu.cn/") {
      GM_setValue("cnkiTutor", true);
      initialCnkiDriver(langProvider);
      cnkiDriver.drive(0);
    } else if (window.location.href === "https://www.cnki.net/" && GM_getValue("cnkiTutor")) {
      initialCnkiDriver(langProvider);
      cnkiDriver.drive(2);
    } else if (window.location.href.startsWith("https://kns.cnki.net/kns8") && GM_getValue("cnkiTutor")) {
      waitForElementToDisplay(".result-table-list", () => {
        initialCnkiDriver(langProvider);
        cnkiDriver.drive(4);
      });
    } else if (GM_getValue("cnkiTutor")) {
      cnkiDriver.highlight({
        popover: {
          description: langProvider.t("cnki.gotoHomepage")
        }
      });
    }
  }
  __name(cnkiTutor, "cnkiTutor");
  function initialCnkiDriver(langProvider) {
    let steps = [
      {
        element: document.querySelectorAll("a.r-tabs-anchor[href='#searchtabs-4']")[0],
        popover: {
          onNextClick: (el, step, opts) => {
            el.click();
            cnkiDriver.moveNext();
          }
        }
      },
      {
        element: document.querySelector("a[href='https://www.cnki.net/']"),
        popover: {
          onNextClick: (el, step, opts) => {
            el.click();
            cnkiDriver.destroy();
          }
        }
      },
      {
        element: document.querySelector("input.search-input"),
        popover: {
          onNextClick: (el, step, opts) => {
            if (el.value === "" || el.value === "\u4E2D\u6587\u6587\u732E\u3001\u5916\u6587\u6587\u732E") {
              return;
            }
            cnkiDriver.moveNext();
          }
        }
      },
      {
        element: document.querySelector("input.search-btn"),
        popover: {
          onNextClick: (el, step, opts) => {
            cnkiDriver.moveNext();
            el.click();
            cnkiDriver.destroy();
          }
        }
      },
      {
        element: document.querySelector(".result-table-list")
      },
      {
        element: document.querySelector("div#divGroup dl:nth-child(1)")
      },
      {
        element: document.querySelector("div#divGroup dl:nth-child(3)")
      },
      {
        element: document.querySelector(".order-group")
      },
      {
        element: document.querySelector("a.fz14")
      },
      {
        element: document.querySelector("a[title='\u4E0B\u8F7D']")
      },
      {
        element: document.querySelector(".result-table-list input.cbItem")
      },
      {
        element: document.querySelector("li.bulkdownload")
      },
      {
        element: document.querySelector("a[title='HTML\u9605\u8BFB']")
      },
      {
        element: document.querySelector("a[title='\u6536\u85CF']")
      },
      {
        element: document.querySelector("a[title='\u5F15\u7528']")
      },
      {
        element: document.querySelector(".btn-result-search")
      },
      {
        element: document.querySelector("i.icon-detail")
      },
      {
        element: document.querySelector("div.foot-top ul.content li:nth-child(2) a")
      },
      {
        popover: {
          description: langProvider.t("cnki.end")
        }
      }
    ];
    steps.forEach((step, idx, arr) => {
      step.popover = step.popover || {};
      step.popover.title = langProvider.t("cnki.title");
      step.popover.align = step.popover.align || "center";
      step.popover.side = step.popover.side || "bottom";
      step.popover.description = step.popover.description || langProvider.t("cnki.steps." + idx);
    });
    steps[4].popover.side = "right";
    steps[5].popover.side = "right";
    steps[6].popover.side = "right";
    steps[12].popover.side = "right";
    steps[steps.length - 1].popover.onNextClick = () => {
      GM_setValue("cnkiTutor", false);
      cnkiDriver.destroy();
    };
    let driverOptions = {
      showProgress: true,
      steps,
      disableButtons: ["previous", "close"],
      allowClose: false,
      nextBtnText: langProvider.t("driver-buttons.next"),
      doneBtnText: langProvider.t("driver-buttons.done"),
      prevBtnText: langProvider.t("driver-buttons.previous")
    };
    cnkiDriver = driver_default.driver(driverOptions);
  }
  __name(initialCnkiDriver, "initialCnkiDriver");

  // global-externals:i18next
  var i18next_default = window.i18next;

  // src/i18n/en-us.json
  var en_us_default = {
    panel: {
      lang: "American English(en-US)",
      title: "Library Assistant",
      "panel-1": "Database usage tutorial",
      "panel-2": "Language Settings",
      "panel-3": "Font-Size Settings",
      "panel-5": "Database introduction",
      "panel-1-func-1": "Searching for Literature Using CNKI Databases",
      "panel-1-func-2": "Searching for Literature Using IEEE Databases",
      "panel-1-func-3": "Searching for Literature Using Nature Databases",
      "panel-2-func-1": "\u7B80\u4F53\u4E2D\u6587(zh-CN)",
      "panel-2-func-2": "American English(en-US)",
      "panel-3-func-1": "Small Fonts",
      "panel-3-func-2": "Large Fonts",
      "panel-5-func-1": "CNKI Database",
      "panel-last": "Features awaiting development..."
    },
    "driver-buttons": {
      next: "next",
      previous: "previous",
      done: "done"
    },
    cnki: {
      gotoHomepage: "Please do so on the library homepage",
      title: "CNKI Database Guidance",
      steps: [
        "To begin, select the database column and follow the provided instructions.",
        "Next, click on 'Jump to CNKI.' No registration is required for the campus network. For off-campus access, use a Southeastern University VPN.",
        "Please enter your search keywords.",
        "Click the search button.",
        "Here is the search results.",
        "You can further filter the search results here.",
        "For instance, if you have a requirement for the timeliness of the paper, you can choose the paper of nearly 1 year.",
        "Different sorting order of the results can be chosen here.",
        "Detailed information of the paper can be found here.",
        "Download the paper here.",
        "Tick papers you want before batch download.",
        "Then click here for bulk downloads.",
        "Click here to preview the paper.",
        "Click here to favorite the papers.",
        "Click here to copy the citation format of the paper.",
        "Enter new keywords here to search within results if necessary.",
        "CNKI Features: Click here to view the summary directly.",
        "Note that CNKI downloads in caj format by default and require this reader to read."
      ],
      end: "Congratulations! You have learnt how to use CNKI database."
    }
  };

  // src/i18n/zh-cn.json
  var zh_cn_default = {
    panel: {
      lang: "\u7B80\u4F53\u4E2D\u6587",
      title: "\u56FE\u4E66\u9986\u5C0F\u52A9\u624B",
      "panel-1": "\u6570\u636E\u5E93\u4F7F\u7528\u6559\u7A0B",
      "panel-2": "\u8BED\u8A00\u8BBE\u7F6E",
      "panel-3": "\u5B57\u4F53\u5927\u5C0F\u8BBE\u7F6E",
      "panel-5": "\u6570\u636E\u5E93\u7B80\u4ECB",
      "panel-1-func-1": "\u4F7F\u7528\u77E5\u7F51\u6570\u636E\u5E93\u68C0\u7D22\u6587\u732E",
      "panel-1-func-2": "\u4F7F\u7528IEEE\u6570\u636E\u5E93\u68C0\u7D22\u6587\u732E",
      "panel-1-func-3": "\u4F7F\u7528Nature\u6570\u636E\u5E93\u68C0\u7D22\u6587\u732E",
      "panel-2-func-1": "\u7B80\u4F53\u4E2D\u6587(zh-CN)",
      "panel-2-func-2": "American English(en-US)",
      "panel-3-func-1": "\u5C0F\u53F7\u5B57\u4F53",
      "panel-3-func-2": "\u5927\u53F7\u5B57\u4F53",
      "panel-last": "\u529F\u80FD\u7B49\u5F85\u5F00\u53D1\u4E2D...",
      "panel-5-func-1": "\u77E5\u7F51\u6570\u636E\u5E93"
    },
    "driver-buttons": {
      next: "\u4E0B\u4E00\u6B65",
      previous: "\u4E0A\u4E00\u6B65",
      done: "\u5B8C\u6210"
    },
    cnki: {
      gotoHomepage: "\u8BF7\u5728\u56FE\u4E66\u9986\u9996\u9875\u8FDB\u884C\u64CD\u4F5C",
      title: "\u77E5\u7F51\u6570\u636E\u5E93\u5F15\u5BFC",
      steps: [
        "\u9996\u5148\uFF0C\u8BF7\u70B9\u51FB\u9009\u62E9\u6570\u636E\u5E93\u680F\u76EE,\u7136\u540E\u8BF7\u6309\u7167\u63D0\u793A\u64CD\u4F5C\u3002",
        "\u63A5\u4E0B\u6765\uFF0C\u70B9\u51FB\u8DF3\u8F6C\u5230\u77E5\u7F51\u3002\u5728\u6821\u56ED\u7F51\u5185\u65E0\u9700\u6CE8\u518C\u3002\u6821\u5916\u8BBF\u95EE\u9700\u8981\u4F7F\u7528\u4E1C\u5357\u5927\u5B66VPN\u3002",
        "\u8BF7\u8F93\u5165\u60A8\u60F3\u8981\u641C\u7D22\u7684\u5173\u952E\u5B57\u3002",
        "\u70B9\u51FB\u641C\u7D22\u6309\u94AE\u3002",
        "\u8FD9\u91CC\u5C55\u793A\u4E86\u68C0\u7D22\u7ED3\u679C\u3002",
        "\u5728\u8FD9\u91CC\uFF0C\u60A8\u53EF\u4EE5\u5BF9\u68C0\u7D22\u7ED3\u679C\u8FDB\u884C\u8FDB\u4E00\u6B65\u7B5B\u9009\u3002",
        "\u4F8B\u5982\uFF0C\u5982\u679C\u60A8\u5BF9\u8BBA\u6587\u7684\u65F6\u6548\u6027\u6709\u8981\u6C42\uFF0C\u53EF\u4EE5\u9009\u62E9\u8FD1\u4E00\u5E74\u7684\u8BBA\u6587\u3002",
        "\u5728\u8FD9\u91CC\uFF0C\u53EF\u4EE5\u9009\u62E9\u68C0\u7D22\u7ED3\u679C\u7684\u6392\u5E8F\u65B9\u5F0F\u3002",
        "\u70B9\u51FB\u8FD9\u91CC\uFF0C\u53EF\u4EE5\u67E5\u770B\u8BBA\u6587\u7684\u8BE6\u7EC6\u4FE1\u606F\u3002",
        "\u70B9\u51FB\u8FD9\u91CC\uFF0C\u53EF\u4EE5\u4E0B\u8F7D\u8BBA\u6587\u3002",
        "\u5982\u679C\u9700\u8981\u6279\u91CF\u4E0B\u8F7D\uFF0C\u53EF\u4EE5\u5148\u5728\u8FD9\u91CC\u52FE\u9009\u9700\u8981\u4E0B\u8F7D\u7684\u8BBA\u6587\u3002",
        "\u7136\u540E\u70B9\u51FB\u8FD9\u91CC\uFF0C\u8FDB\u884C\u6279\u91CF\u4E0B\u8F7D\u3002",
        "\u70B9\u51FB\u8FD9\u91CC\uFF0C\u53EF\u4EE5\u5BF9\u8BBA\u6587\u8FDB\u884C\u9884\u89C8\u3002",
        "\u70B9\u51FB\u8FD9\u91CC\uFF0C\u53EF\u4EE5\u5BF9\u8BBA\u6587\u8FDB\u884C\u6536\u85CF\u3002",
        "\u70B9\u51FB\u8FD9\u91CC\uFF0C\u53EF\u4EE5\u62F7\u8D1D\u8BBA\u6587\u7684\u5F15\u7528\u683C\u5F0F\u3002",
        "\u5982\u679C\u6709\u9700\u8981\uFF0C\u5728\u8FD9\u91CC\u8F93\u5165\u65B0\u7684\u5173\u952E\u8BCD\uFF0C\u53EF\u4EE5\u8FDB\u884C\u4E8C\u6B21\u68C0\u7D22\u3002",
        "\u77E5\u7F51\u7279\u8272\u529F\u80FD\uFF1A\u70B9\u51FB\u8FD9\u91CC\u53EF\u4EE5\u76F4\u63A5\u67E5\u770B\u6982\u8981\u3002",
        "\u6CE8\u610F\uFF0C\u77E5\u7F51\u9ED8\u8BA4\u4E0B\u8F7Dcaj\u683C\u5F0F\u8BBA\u6587\uFF0C\u9700\u8981\u4F7F\u7528\u6B64\u9605\u8BFB\u5668\u9605\u8BFB\u3002"
      ],
      end: "\u606D\u559C\u60A8\uFF0C\u5DF2\u7ECF\u5B8C\u6210\u4E86\u77E5\u7F51\u6570\u636E\u5E93\u7684\u4F7F\u7528\u6559\u7A0B\uFF01"
    }
  };

  // index.js
  jQuery(() => {
    let lang = window.GM_getValue("lang");
    if (lang === void 0) {
      lang = navigator.language;
      GM_setValue("lang", lang);
    } else if (window.location.href === "http://lib.seu.edu.cn/seu_en/") {
      lang = "en-US";
    }
    i18next_default.init({
      lng: lang,
      resources: {
        "en-US": {
          translation: en_us_default
        },
        "zh-CN": {
          translation: zh_cn_default
        }
      }
    });
    GM_addStyle(userpanel_default);
    jquery_default("body").prepend(userpanel_default2);
    enablePanelDraggable();
    enablePanelFoldable();
    refreshPanelWithLang(jquery_default, i18next_default);
    GM_addStyle(GM_getResourceText("driverjs_css"));
    if (window.location.href === "http://lib.seu.edu.cn/") {
      GM_setValue("cnkiTutor", false);
    }
    alertDriver = driver_default.driver();
    initialCnkiDriver(i18next_default);
    bindFunction2Panel(1, 1, cnkiTutor, [i18next_default]);
    bindFunction2Panel(2, 1, () => {
      GM_setValue("lang", "zh-CN");
      i18next_default.changeLanguage("zh-CN");
      refreshPanelWithLang(jquery_default, i18next_default);
      initialCnkiDriver(i18next_default);
    });
    bindFunction2Panel(2, 2, () => {
      GM_setValue("lang", "en-US");
      i18next_default.changeLanguage("en-US");
      refreshPanelWithLang(jquery_default, i18next_default);
      initialCnkiDriver(i18next_default);
    });
    function changeFontSize(Size) {
      const panelHeader = document.getElementById("Q-floating-panel-header");
      const panelAccordion = document.querySelectorAll(".Q-accordion");
      const panelFunc = document.querySelectorAll(".Q-func");
      if (Size === "small") {
        panelHeader.style.fontSize = "16px";
        panelAccordion.forEach((item) => {
          item.style.fontSize = "13px";
        });
        panelFunc.forEach((item) => {
          item.style.fontSize = "12px";
        });
      } else if (Size === "big") {
        panelHeader.style.fontSize = "18px";
        panelAccordion.forEach((item) => {
          item.style.fontSize = "15px";
        });
        panelFunc.forEach((item) => {
          item.style.fontSize = "14px";
        });
      }
    }
    __name(changeFontSize, "changeFontSize");
    bindFunction2Panel(3, 1, () => {
      changeFontSize("small");
    });
    bindFunction2Panel(3, 2, () => {
      changeFontSize("big");
    });
    bindFunction2Panel(4, 1, () => {
      alertDriver.highlight({
        popover: {
          description: "\u524D\u9762\u7684\u533A\u57DF\uFF0C\u8BF7\u4EE5\u540E\u518D\u6765\u63A2\u7D22\u5427"
        }
      });
    });
    bindFunction2Panel(5, 1, () => {
      const picDriver = driver_default.driver();
      picDriver.highlight({
        popover: {
          description: "<img src='https://gitlab.seu.edu.cn/qisumi/seu-library-tutor/-/raw/dev/src/static/databaseIntroduction.png?inline=false' style=' width: 1040px; display:block; ' />"
        }
      });
    });
    if (GM_getValue("cnkiTutor")) {
      cnkiTutor(i18next_default);
    }
  });
})();
