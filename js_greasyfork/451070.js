// ==UserScript==
// @name         DCU Timetable Filter
// @name:zh-CN   DCU 课程表过滤器
// @namespace    https://chenhe.me/
// @version      0.2
// @description  Optimize DCU's open timetable to filter selected courses.
// @description:zh-CN  优化 DCU 的课程表，只显示选中的课程。
// @author       Chenhe
// @license      MIT License
// @match        https://mytimetable.dcu.ie/timetables*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/451070/DCU%20Timetable%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/451070/DCU%20Timetable%20Filter.meta.js
// ==/UserScript==

(function () {
    "use strict";
  
    let selectedCourses = [];
    const cellWithEventSelector = "div.e-appointment";
    const toolbarInlineSelector = ".e-toolbar-right";
    const toolbarSelector = "sct-scheduler-toolbar";
  
    GM_config.init({
      id: "main",
      title: "Course Filter Configuration",
      events: {
        init: function () {
          selectedCourses = GM_config.get("Courses").split("\n");
          console.log("Selected courses: " + selectedCourses);
        },
        save: function () {
          selectedCourses = GM_config.get("Courses").split("\n");
          console.log("Selected courses: " + selectedCourses);
  
          $(cellWithEventSelector).each(function () {
            processCell($(this));
          });
          $(toolbarInlineSelector).each(function () {
            addConfigButton($(this));
          });
          $(toolbarSelector).each(function () {
            setWarningMsg($(this));
          });
        },
      },
      fields: {
        Courses: {
          label:
            "The codes of selected courses, one for each line. e.g. CA644.<br>Leave blank to disable filtering.",
          type: "textarea",
        },
        FullyHide: {
          label: "Fully hide unselected courses:",
          type: "checkbox",
          default: false,
        },
        Opacity: {
          label: "Opacity of unselected courses [0,1]:",
          type: "float",
          default: "0.35",
        },
        Button: {
          label: "Chenhe's Github", // Appears on the button
          type: "button", // Makes this setting a button input
          size: 100, // Control the size of the button (default is 25)
          click: function () {
            window.open("https://github.com/ichenhe", "_blank");
          },
        },
      },
    });
  
    /**
     * Judge whether a course has been selected or not.
     * @param {string} lessonName
     */
    function isSelected(lessonName) {
      let _lessonName = lessonName.toUpperCase().trim();
      for (const item of selectedCourses) {
        let a = item.toUpperCase();
        if (a.indexOf(_lessonName) != -1 || _lessonName.indexOf(a) != -1) {
          return true;
        }
      }
      return false;
    }
  
    waitForKeyElements(cellWithEventSelector, processCell);
    waitForKeyElements(toolbarSelector, setWarningMsg);
    waitForKeyElements(toolbarInlineSelector, addConfigButton);
  
    function processCell(jNode) {
      let nameNode = jNode.find('div.scheduler-value--name > showdown > p');
      if (!nameNode) return;
      let lessonName = nameNode.text().split("/")[0];
      
      if (!isSelected(lessonName)) {
        console.log("hide: " + lessonName);
  
        if (GM_config.get("FullyHide")) {
          jNode.css("visibility", "hidden");
        } else {
          jNode.css("visibility", "visible");
          jNode.css("opacity", GM_config.get("Opacity"));
        }
      } else {
        jNode.css("visibility", "visible");
        jNode.css("opacity", "1");
      }
    }
  
    function setWarningMsg(jNode) {
      if (GM_config.get("Courses")) {
        if (!document.getElementById("che-filter-msg")) {
          let message = document.createElement("div");
          message.id = "che-filter-msg";
          message.innerHTML =
            "⚠️ Course filter activated! Please check it manually. The developer is not responsible for the result. Only week view on desktop is suppoted.";
          message.style.color = "#ffffff";
          message.style.background = "#e53935";
          message.style.padding = "12px";
          jNode.append(message);
        }
      } else {
        $("#che-filter-msg").remove();
      }
    }
  
    function addConfigButton(jNode) {
      if (!document.getElementById("che-filter-config-btn")) {
        let button = document.createElement("button");
        button.id = "che-filter-config-btn";
        button.innerHTML = "⚙️ Config Course Filter";
        button.style.backgroundColor = "#37A1BF";
        button.style.border = "none";
        button.style.color = "#ffffff";
        button.style.padding = "8px";
        button.style.marginTop = "8px";
        button.style.cursor = "pointer";
        button.onclick = function () {
          GM_config.open();
        };
        jNode.append(button);
      }
    }
  })();
  