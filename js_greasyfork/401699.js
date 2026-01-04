// ==UserScript==
// @name         订餐问卷一键填写
// @version      0.0.8
// @namespace    ly525
// @description  订餐问卷一键填写, 不要忘记订餐😂
// @author       ly525
// @match        *://*.www.wenjuan.com/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/401699/%E8%AE%A2%E9%A4%90%E9%97%AE%E5%8D%B7%E4%B8%80%E9%94%AE%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/401699/%E8%AE%A2%E9%A4%90%E9%97%AE%E5%8D%B7%E4%B8%80%E9%94%AE%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
  function readSavedConfig() {
    var baseConfig = {
      name: "刘岩",
      breakfast: "公司用餐",
      lunch: "公司盒饭",
      dinner: "公司盒饭",
      location: "舜天",
      department: "TaurusX Group"
    };
    return (
      (localStorage.__config && JSON.parse(localStorage.__config)) || baseConfig
    );
  }

  var config = readSavedConfig();

  function saveConfig() {
    localStorage.__config = textarea.value.replace(/[\r\n]/g, "");
  }

  // ---------
  var textarea = document.createElement("textarea");
  textarea.style.position = "absolute";
  textarea.style["z-index"] = 100;
  textarea.style.right = "10px";
  textarea.style.top = "10px";
  textarea.setAttribute("rows", 10);
  textarea.setAttribute("cols", 40);
  textarea.innerHTML = JSON.stringify(config, undefined, 4);
  textarea.addEventListener("change", function(e) {
    localStorage.__config = e.target.value.replace(/[\r\n]/g, "");
  });
  document.body.appendChild(textarea);

  // ---------------

  var nameLabel = "姓名";
  var locationLabel = "办公地点";
  var breakfastLabel = "早餐";
  var lunchLabel = "午餐";
  var dinnerLabel = "晚餐";
  var departmentLabel = "部门";

  function fillName(el) {
    el.querySelector("input[type=text]").value = config.name;
  }

  function fillOption(el, labelKey) {
    // el.querySelectorAll('input[type=radio]')[1].checked = true
    var cells = [].slice.apply(el.querySelectorAll(".option_cell"));
    cells.forEach(function(cell) {
      if (cell.innerHTML.includes(config[labelKey])) {
        cell.querySelector("input[type=radio]").checked = true;
      }
    });
  }

  function autoFill() {
    var question_boxs = [].slice.apply(
      document.querySelectorAll(".wjques.maxtop.question")
    );
    question_boxs.forEach(function(el) {
      var content = el.innerHTML;
      if (content.includes(nameLabel)) {
        fillName(el);
      } else if (content.includes(locationLabel)) {
        fillOption(el, "location");
      } else if (content.includes(breakfastLabel)) {
        fillOption(el, "breakfast");
      } else if (content.includes(lunchLabel)) {
        fillOption(el, "lunch");
      } else if (content.includes(dinnerLabel)) {
        fillOption(el, "dinner");
      } else if (content.includes(departmentLabel)) {
        fillOption(el, "department");
      }
    });
  }

  function addOneClickBtn() {
    var btn = document.createElement("button");
    btn.classList.add("WJButton");
    btn.innerHTML = "一键订餐";
    btn.style = `position: absolute;
        right: 140px;
        top: 240px;
        width: 120px;
        height: 50px;
        background: rebeccapurple;
        z-index: 1000;`;
    document.body.appendChild(btn);

    btn.addEventListener("click", function() {
      // 点击的时候，始终读取最新的配置
      config = readSavedConfig();
      saveConfig();
      autoFill();
      updateConfigBtnPosition();
    });
  }

  function updateConfigBtnPosition() {
    var confirmBtn = document.querySelector("#next_button");
    confirmBtn.style.position = "absolute";
    confirmBtn.style['z-index'] = 101;
    confirmBtn.style.right = "140px";
    confirmBtn.style.top = "280px";
  }

  var btn = addOneClickBtn();
})();
