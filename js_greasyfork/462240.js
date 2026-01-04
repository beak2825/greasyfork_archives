// ==UserScript==
// @name       BlackboardBb 增强 | Blackboard Enhanced
// @namespace  npm/vite-plugin-monkey
// @version    2.0.4
// @author     sitdownkevin
// @license    MIT
// @match      https://pibb.scu.edu.cn/*
// @require    https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require    https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @grant      GM_addStyle
// @grant      GM_getValue
// @grant      GM_setValue
// @description 2023/4/3 10:27:00
// @downloadURL https://update.greasyfork.org/scripts/462240/BlackboardBb%20%E5%A2%9E%E5%BC%BA%20%7C%20Blackboard%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/462240/BlackboardBb%20%E5%A2%9E%E5%BC%BA%20%7C%20Blackboard%20Enhanced.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(' .calendar-container{position:fixed;z-index:10000;width:280px;opacity:.8}.calendar-list{width:100%;height:80%;overflow-y:scroll;pointer-events:auto;border-radius:20px;max-height:300px}.calendar-list ::-webkit-scrollbar{width:0;background:transparent}.calendar-item{width:95%;height:auto;margin-top:8px;border-radius:18px;margin-left:5px;pointer-events:auto;display:flex;flex-direction:column;align-items:left;cursor:move;-webkit-user-select:none;user-select:none}.calendar-item .assignment{margin-top:10px;margin-left:12px;margin-right:12px;font-size:17px;font-weight:700;color:#f5f5f6}.calendar-item .course-name{display:inline;margin-top:5px;margin-left:12px;margin-right:8px;font-weight:700;font-size:10px;color:#e0e0ef;cursor:pointer}.calendar-item .count-down{margin-left:12px;margin-bottom:10px;font-weight:700;font-size:22px;color:#e0e0ce}.memo-container{width:100%;height:auto;background-color:#dff0f4}.memo-container .memo-box{width:100%;height:288px;display:flex;flex-direction:column;align-items:center}.memo-container .memo-box .memo-list{border:1px solid #ccc;margin-top:20px;width:calc(100% - 32px);height:100%;overflow-y:scroll;pointer-events:auto}.memo-container .memo-box .memo-list .memo-input{height:300%;width:calc(100% - 10px);background-color:#fff;padding:5px;outline:none}.memo-container .memo-box .btn-box{margin-top:10px;width:100%;height:47.6px;position:relative}.memo-container .memo-box .btn-box .btn-save{background-color:#dadada;border:0 solid;width:46px;height:27.6px;position:absolute;right:70px;display:flex;justify-content:center;align-items:center;cursor:pointer}.memo-container .memo-box .btn-box .btn-save:hover{background-color:#fff}.memo-container .memo-box .btn-box .btn-clear{background-color:#333;border:0 solid;width:46px;height:27.6px;position:absolute;right:16px;display:flex;justify-content:center;align-items:center;color:#fff;cursor:pointer}#currentAttempt_gradeDataPanel{display:""!important} ');

(function (require$$0, require$$0$1) {
  'use strict';

  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a)
      m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps)
      for (b in a = c.defaultProps, a)
        void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  async function courseInfoCatch() {
    try {
      var orig_course_info = await get_course_id();
      var course_db = store_course_id(orig_course_info);
      console.log("fetchCourse.js Success");
      return course_db;
    } catch (err) {
      console.log("fetchCourse.js Error: ", err);
    }
  }
  async function get_course_id() {
    const url = "/webapps/portal/execute/tabs/tabAction?action=refreshAjaxModule&modId=_2_1&tabId=_1_1&tab_tab_group_id=_1_1";
    return await fetch(url, {
      method: "POST"
    }).then((res) => res.text()).then((data) => {
      return data;
    }).catch(console.log);
  }
  function store_course_id(_orig_course_info) {
    var _course_db = {};
    const pattern = /<li>[\s\S]*?<\/li>/g;
    const regArr = _orig_course_info.match(pattern);
    for (let i = 0; i < regArr.length; i++) {
      const pattern2 = {
        "course_name": /<a.*?>(.*?)<\/a>/,
        // 课程名称
        "course_id": /id=(_\d+_\d+)/i,
        // 课程ID
        "course_href": /href=['"](.*?)['"]/
        // 课程主页链接
      };
      const course_name = regArr[i].match(pattern2["course_name"])[1];
      const course_id = regArr[i].match(pattern2["course_id"])[1];
      const course_href = regArr[i].match(pattern2["course_href"])[1];
      _course_db[course_name] = {
        "id": course_id,
        "href": course_href
      };
    }
    return _course_db;
  }
  async function calendarInfoCatch() {
    try {
      var orig_todo_items = await get_calendar();
      var todo_items = await extractItems(orig_todo_items);
      todo_items = await setColor(todo_items);
      console.log("fetchCalendar.js Success");
      return todo_items;
    } catch (err) {
      console.log("fetchCalendar.js Error: ", err);
    }
  }
  async function get_calendar() {
    const url = "/webapps/calendar/calendarData/selectedCalendarEvents";
    const start_date = /* @__PURE__ */ new Date();
    const end_date = /* @__PURE__ */ new Date();
    end_date.setDate(end_date.getDate() + 28);
    const params = "?start=" + start_date.getTime() + "&end=" + end_date.getTime() + "&course_id=&mode=personal";
    return fetch(url + params, {
      method: "GET"
    }).then((res) => res.json()).then((data) => {
      return data;
    }).catch(console.log);
  }
  async function extractItems(_orig_todo_items) {
    let course_db;
    try {
      course_db = await courseInfoCatch();
    } catch (err) {
    }
    var _todo_items = [];
    for (let i = 0; i < _orig_todo_items.length; i++) {
      _todo_items.push({
        "id": i,
        "course": _orig_todo_items[i]["calendarName"],
        "todoItem": _orig_todo_items[i]["title"],
        "deadline": _orig_todo_items[i]["end"],
        "href": course_db[_orig_todo_items[i]["calendarName"]] ? course_db[_orig_todo_items[i]["calendarName"]]["href"] : "#"
      });
    }
    if (_todo_items.length === 0) {
      _todo_items.push({
        "id": 0,
        "course": "No DDL Currently",
        "todoItem": "HAVE A NICE DAY",
        // "deadline": _tmp_ddl,
        "href": "#"
      });
    } else {
      _todo_items.sort((a, b) => {
        return Date.parse(a.deadline) - Date.parse(b.deadline);
      });
    }
    console.log(_todo_items);
    return _todo_items;
  }
  async function setColor(_todo_items) {
    const generateGradientColors = (color1, color2, steps) => {
      const rgb1 = hexToRgb(color1);
      const rgb2 = hexToRgb(color2);
      const colors = [];
      for (let i = 0; i <= steps; i++) {
        const r = interpolate(rgb1.r, rgb2.r, i, steps);
        const g = interpolate(rgb1.g, rgb2.g, i, steps);
        const b = interpolate(rgb1.b, rgb2.b, i, steps);
        const hex = rgbToHex(r, g, b);
        colors.push(hex);
      }
      return colors;
    };
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };
    const rgbToHex = (r, g, b) => {
      const hex = (r << 16 | g << 8 | b).toString(16);
      return "#" + hex.padStart(6, "0");
    };
    const interpolate = (start, end, step, totalSteps) => {
      return start + (end - start) * step / totalSteps;
    };
    const colorChoices = [
      ["#ff4e4f", "#ff9d81"],
      ["#032e71", "#b8e9fc"],
      ["#ff2121", "#d14631"]
    ];
    const colorArr = generateGradientColors(colorChoices[1][0], colorChoices[1][1], _todo_items.length);
    for (let i = 0; i < _todo_items.length; i++) {
      _todo_items[i]["color"] = colorArr[i];
    }
    return _todo_items;
  }
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const formatDuration = (ms) => {
    const second = 1e3;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(ms / day);
    const hours = Math.floor(ms % day / hour);
    const minutes = Math.floor(ms % hour / minute);
    const seconds = Math.floor(ms % minute / second);
    let result = "";
    if (days > 0) {
      result += days + "天";
    }
    if (hours > 0) {
      result += hours + "小时";
    }
    if (minutes > 0) {
      result += minutes + "分钟";
    }
    if (seconds > 0) {
      result += seconds + "秒";
    }
    return result;
  };
  function Calendar(props) {
    const [dragging, setDragging] = require$$0.useState(false);
    const [dragOffset, setDragOffset] = require$$0.useState([0, 0]);
    const [loc, setLoc] = require$$0.useState(_GM_getValue("loc", [150, 150]));
    const handleMouseDown = (e) => {
      setDragging(true);
      setDragOffset([e.clientX - loc[0], e.clientY - loc[1]]);
    };
    const handleMouseMove = (e) => {
      if (dragging) {
        setLoc([e.clientX - dragOffset[0], e.clientY - dragOffset[1]]);
        _GM_setValue("loc", [e.clientX - dragOffset[0], e.clientY - dragOffset[1]]);
      }
    };
    const handleMouseUp = () => {
      setDragging(false);
    };
    const TodoItems = props.todo_items.map((todo) => {
      const [cnt, setCnt] = require$$0.useState(formatDuration(Date.parse(todo["deadline"]) - Date.now()));
      require$$0.useEffect(() => {
        const it = setInterval(() => {
          setCnt(formatDuration(Date.parse(todo["deadline"]) - Date.now()));
        }, 1e3);
        return () => {
          clearInterval(it);
        };
      }, []);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "calendar-item",
          style: { backgroundColor: todo["color"] },
          onMouseDown: handleMouseDown,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "assignment", children: todo["todoItem"] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "course-name", href: todo["href"], children: todo["course"] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "count-down", children: cnt })
          ]
        },
        todo.id
      );
    });
    require$$0.useEffect(() => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [dragging]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "calendar-container",
        style: { top: loc[1], left: loc[0] },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "calendar-list", children: TodoItems })
      }
    ) });
  }
  var client = {};
  var m = require$$0$1;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  function Memo({ props }) {
    const handleSave = () => {
      props.setEnv({
        ...props.env,
        assignment: {
          ...props.env.assignment,
          memo: document.querySelector(".memo-input").innerText
        }
      });
    };
    const handleClear = () => {
      props.setEnv({
        ...props.env,
        assignment: {
          ...props.env.assignment,
          memo: ""
        }
      });
      document.querySelector(".memo-input").innerText = "";
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "memo-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "memo-box", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "memo-list", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "memo-input", contentEditable: true, children: props.env.assignment.memo }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "btn-box", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-save", onClick: handleSave, children: "Save" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-clear", onClick: handleClear, children: "Clear" })
      ] })
    ] }) }) });
  }
  class PrettierPage {
    constructor() {
      this.expand;
      this.fb;
      this.checkDOMReady();
    }
    checkDOMReady() {
      try {
        const checkInterval = setInterval(() => {
          this.expand = document.querySelector("#currentAttempt_gradeDataPanel");
          this.fb = document.querySelector("#feedbacktext_tbl > tbody > tr > td > span");
          if (this.expand && this.fb) {
            this.expand.style.display = "";
            this.fb.remove();
            clearInterval(checkInterval);
          }
        }, 500);
      } catch (err) {
      }
    }
  }
  class AutoCalculator {
    constructor() {
      this.textArea;
      this.fillSpace;
      this.totolGrade;
      this.lastGrade;
      this.checkDOMReady();
    }
    checkDOMReady() {
      const checkInterval = setInterval(() => {
        try {
          this.textArea = this.return_textArea();
          this.fillSpace = this.return_fillSpace();
          this.totolGrade = this.return_totalGrade();
          this.lastGrade = this.return_lastGrade();
          if (this.textArea && this.fillSpace && this.totolGrade && this.lastGrade) {
            clearInterval(checkInterval);
            this.setupEventListeners();
          }
        } catch (err) {
        }
      }, 500);
    }
    setupEventListeners() {
      this.textArea.addEventListener("input", this.handleInput.bind(this));
      if (this.lastGrade != "-") {
        this.fillSpace.value = this.lastGrade;
      } else {
        this.fillSpace.value = this.totolGrade;
      }
    }
    return_textArea() {
      return document.querySelector("#feedbacktext_ifr").contentDocument.documentElement.querySelector("body");
    }
    return_fillSpace() {
      return document.querySelector("#currentAttempt_grade");
    }
    return_totalGrade() {
      return parseFloat(document.querySelector("#currentAttempt_pointsPossible").innerHTML.split("/")[1]);
    }
    return_lastGrade() {
      return document.querySelector("#aggregateGrade").value;
    }
    handleInput(e) {
      const numsArr = e.target.innerHTML.match(/-\d+(\.\d+)?/g);
      if (!numsArr) {
        this.fillSpace.value = this.totolGrade;
      } else {
        let grade = this.totolGrade;
        numsArr.forEach((num) => {
          grade += parseFloat(num);
        });
        this.fillSpace.value = grade;
      }
    }
    remove() {
      if (this.textArea) {
        this.textArea.removeEventListener("input", this.handleInput);
      }
    }
  }
  function GradeAssignment(props) {
    require$$0.useEffect(() => {
      new PrettierPage();
      const AC = new AutoCalculator();
      const bro = document.querySelector("#currentAttempt_submission");
      const app = document.createElement("div");
      bro.parentNode.style.height = "auto";
      bro.parentNode.insertBefore(app, bro);
      const root = client.createRoot(app);
      root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(Memo, { props }));
      return () => {
        if (root) {
          root.unmount();
        }
        AC.remove();
      };
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {});
  }
  function App() {
    const [env, setEnv] = require$$0.useState(
      _GM_getValue("env", {
        calendar: {
          display: true
        },
        assignment: {
          display: true,
          memo: ""
        }
      })
    );
    const [todoItems, setTodoItems] = require$$0.useState(null);
    require$$0.useEffect(() => {
      const fetchTodoItems = async () => {
        const items = await calendarInfoCatch();
        setTodoItems(items);
      };
      fetchTodoItems();
    }, []);
    require$$0.useEffect(() => {
      _GM_setValue("env", env);
      console.log("Setting Saved");
    }, [env]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      window.location.href.startsWith("https://pibb.scu.edu.cn/webapps/portal") && todoItems && env.calendar.display ? /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { todo_items: todoItems }) : null,
      window.location.href.startsWith("https://pibb.scu.edu.cn/webapps/assignment") && env.assignment.display ? /* @__PURE__ */ jsxRuntimeExports.jsx(GradeAssignment, { env, setEnv }) : null
    ] });
  }
  client.createRoot(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  ).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(require$$0.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) })
  );

})(React, ReactDOM);