// ==UserScript==
// @name           Neptun PowerUp!
// @namespace      http://example.org
// @description    Felturbózza a Neptun-odat
// @version        2.2.1
// @include        https://*neptun*/*hallgato*/*
// @include        https://*neptun*/*Hallgatoi*/*
// @include        https://*neptun*/*oktato*/*
// @include        https://*hallgato*.*neptun*/*
// @include        https://*oktato*.*neptun*/*
// @include        https://netw*.nnet.sze.hu/hallgato/*
// @include        https://nappw.dfad.duf.hu/hallgato/*
// @include        https://host.sdakft.hu/*
// @include        https://neptun.ejf.hu/ejfhw/*
// @grant          GM.xmlHttpRequest
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.info
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5256/Neptun%20PowerUp%21.user.js
// @updateURL https://update.greasyfork.org/scripts/5256/Neptun%20PowerUp%21.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 616:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const utils = __webpack_require__(555);

// Enhance advance list style
function fixAdvanceList() {
  utils.injectCss(`
    #h_advance_gridSubjects_bodytable tr:not(.gridrow_blue):not(.gridrow_green) td,
    #h_advance_NonCurrTemp_bodytable tr:not(.gridrow_blue):not(.gridrow_green) td {
      background-color: #F8EFB1 !important;
      font-weight: bold;
      color: #525659;
    }
    #h_advance_gridSubjects_bodytable tr.gridrow_green td,
    #h_advance_NonCurrTemp_bodytable tr.gridrow_green td {
      background-color: #D5EFBA !important;
      font-weight: bold;
      color: #525659;
    }
    #h_advance_gridSubjects_bodytable tr.gridrow_blue td,
    #h_advance_NonCurrTemp_bodytable tr.gridrow_blue td {
      background-color: none !important;
      color: #525659;
    }
  `);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0222", "h_advance"),
  initialize: () => {
    fixAdvanceList();
  },
};


/***/ }),

/***/ 318:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);
const storage = __webpack_require__(75);

// Returns users with stored credentials
function getLoginUsers() {
  const users = [];
  const list = storage.get("users", utils.getDomain());
  if (!list) {
    return users;
  }
  Object.keys(list).forEach(user => {
    if (typeof list[user].password === "string" && list[user].password !== "") {
      users.push(user);
    }
  });
  return users;
}

function initUserSelect() {
  const users = getLoginUsers();

  $(".login_left_side .login_input").css("text-align", "left");

  const selectField = $('<select id="user_sel" class="bevitelimezo" name="user_sel"></select>').hide();
  users.forEach(user => {
    $('<option class="neptun_kod"></option>').attr("id", user).attr("value", user).text(user).appendTo(selectField);
  });
  selectField.append('<option disabled="disabled" class="user_separator">&nbsp;</option>');
  selectField.append('<option id="other_user" value="__OTHER__">Más felhasználó...</option>');
  selectField.append('<option id="edit_list" value="__DELETE__">Tárolt kód törlése...</option>');

  $("td", selectField).css("position", "relative");
  selectField
    .css("font-weight", "bold")
    .css("font-family", "consolas, courier new, courier, monospace")
    .css("font-size", "1.5em");
  $("option[class!=neptun_kod]", selectField)
    .css("font-size", "0.8em")
    .css("font-family", "tahoma")
    .css("font-weight", "normal")
    .css("color", "#666")
    .css("font-style", "italic");
  $("option.user_separator", selectField).css("font-size", "0.5em");

  selectField.bind("mousedown focus change", function () {
    abortLogin();
  });
  $("#pwd, #Submit, #btnSubmit").bind("mousedown focus change", function () {
    abortLogin();
  });

  selectField.bind("change", function () {
    clearLogin();

    if ($(this).val() === "__OTHER__") {
      hideSelect();
      return false;
    }

    if ($(this).val() === "__DELETE__") {
      $("#user_sel").val(users[0]).trigger("change");
      const itemToDelete = unsafeWindow.prompt(
        "Írd be a törlendő neptun kódot. Az összes törléséhez írd be: MINDEGYIKET",
        ["mindegyiket", ...users].join("   /   ")
      );
      if (!itemToDelete) {
        return false;
      }

      let deleted = false;
      users.forEach(user => {
        if (user === itemToDelete.toUpperCase() || itemToDelete.toUpperCase() === "MINDEGYIKET") {
          storage.set("users", utils.getDomain(), user, "password", null);
          deleted = true;
        }
      });

      if (!deleted) {
        if (confirm("A megadott neptun kód nincs benne a tárolt listában. Megpróbálod újra?")) {
          $("#user_sel").val("__DELETE__").trigger("change");
        }
        return false;
      }

      if (itemToDelete.toUpperCase() === "MINDEGYIKET") {
        alert("Az összes tárolt neptun kód törölve lett a bejelentkezési listából.");
        window.location.reload();
        return false;
      }

      alert(`A(z) ${itemToDelete} felhasználó törölve lett a bejelentkezési listából.`);
      window.location.reload();
      return false;
    }

    $("#user").val(users[$(this).get(0).selectedIndex]);
    $("#pwd").val(atob(storage.get("users", utils.getDomain(), users[$(this).get(0).selectedIndex], "password")));
  });

  $("input[type=button].login_button")
    .attr("onclick", "")
    .bind("click", function (e) {
      e.preventDefault();

      if ($("#user_sel").val() === "__OTHER__") {
        if ($("#user").val().trim() === "" || $("#pwd").val().trim() === "") {
          return;
        }

        const foundUser = users.find(user => user === $("#user").val().toUpperCase());
        if (!foundUser) {
          if (
            confirm(
              "Szeretnéd menteni a beírt adatokat, hogy később egy kattintással be tudj lépni erről a számítógépről?"
            )
          ) {
            storage.set("users", utils.getDomain(), $("#user").val().toUpperCase(), "password", btoa($("#pwd").val()));
          }
          submitLogin();
          return;
        } else {
          $("#user_sel").val(foundUser);
        }
      }

      if ($("#user_sel").val() === "__DELETE__") {
        return;
      }

      if (
        $("#pwd").val() !==
        atob(storage.get("users", utils.getDomain(), users[$("#user_sel").get(0).selectedIndex], "password"))
      ) {
        if (
          confirm(
            `Szeretnéd megváltoztatni a(z) ${$("#user")
              .val()
              .toUpperCase()} felhasználó tárolt jelszavát a most beírt jelszóra?`
          )
        ) {
          storage.set(
            "users",
            utils.getDomain(),
            users[$("#user_sel").get(0).selectedIndex],
            "password",
            btoa($("#pwd").val())
          );
        }
      }

      submitLogin();
      return;
    });

  $("#user").parent().append(selectField);
  showSelect();
  selectField.trigger("change");
}

let loginTimer;
let loginButtonText;

function initAutoLogin() {
  const users = getLoginUsers();

  if (users.length < 1) {
    return;
  }

  const submit = $("#Submit, #btnSubmit");

  let loginCount = 3;
  loginButtonText = submit.attr("value");
  submit.attr("value", `${loginButtonText} (${loginCount})`);

  $(".login_button_td").append(
    '<div id="abortLogin" style="text-align: center; margin: 23px 0 0 128px"><a href="#" class="abort_login">Megszakít</a></div>'
  );
  $(".login_button_td a.abort_login").click(function (e) {
    e.preventDefault();
    abortLogin();
  });

  loginTimer = window.setInterval(() => {
    loginCount--;
    submit.attr("value", `${loginButtonText} (${loginCount})`);

    if (loginCount <= 0) {
      submitLogin();
      abortLogin();
      submit.attr("value", `${loginButtonText}...`);
    }
  }, 1000);
}

// Abort the auto login countdown
function abortLogin() {
  window.clearInterval(loginTimer);
  $("#Submit, #btnSubmit").attr("value", loginButtonText);
  $("#abortLogin").remove();
}

// Clears the login form
function clearLogin() {
  $("#user").val("");
  $("#pwd").val("");
}

// Display user select field
function showSelect() {
  $("#user").hide();
  $("#user_sel").show().focus();
  utils.runEval(' Page_Validators[0].controltovalidate = "user_sel" ');
}

// Hide user select field and display original textbox
function hideSelect() {
  $("#user_sel").hide();
  $("#user").show().focus();
  utils.runEval(' Page_Validators[0].controltovalidate = "user" ');
}

// Submit the login form
function submitLogin() {
  unsafeWindow.docheck();
}

module.exports = {
  shouldActivate: () => utils.isLoginPage(),
  initialize: () => {
    initUserSelect();
    initAutoLogin();
  },
};


/***/ }),

/***/ 374:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);

// Automatically press submit button on course list page
function initCourseAutoList() {
  utils.runEval(function () {
    const manager = window.Sys.WebForms.PageRequestManager.getInstance();
    let courseListLoading = false;
    manager.add_beginRequest(function () {
      courseListLoading = true;
    });
    manager.add_endRequest(function () {
      courseListLoading = false;
    });
    window.setInterval(() => {
      if (!courseListLoading && $("#h_addsubjects_gridSubjects_gridmaindiv").size() === 0) {
        $("#upFilter_expandedsearchbutton").click();
      }
    }, 250);
  });

  const updateTable = function () {
    $("#upFunction_h_addsubjects_upGrid").html("");
  };

  $("body").on("change", "#upFilter_chkFilterCourses", updateTable);
  $("body").on("change", "#upFilter_rbtnSubjectType input[type=radio]", updateTable);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0303", "h_addsubjects"),
  initialize: () => {
    initCourseAutoList();
  },
};


/***/ }),

/***/ 977:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);

// Enhance course list style and functionality
function fixCourseList() {
  utils.injectCss(`
    #h_addsubjects_gridSubjects_bodytable tr.Row1_Bold td,
    #Addsubject_course1_gridCourses_bodytable tr.Row1_sel td,
    #Addsubject_course1_gridCourses_grid_body_div tr.Row1_sel td,
    #Addsubject_course1_gridCourses_bodytable tr.Row1_Bold_sel td,
    #Addsubject_course1_gridCourses_grid_body_div tr.Row1_Bold_sel td,
    #h_addsubjects_gridSubjects_bodytable tr.context_selectedrow td {
      background-color: #F8EFB1 !important;
      font-weight: bold; color: #525659;
    }
    #h_addsubjects_gridSubjects_bodytable tr,
    #Addsubject_course1_gridCourses_bodytable tr,
    #Addsubject_course1_gridCourses_grid_body_div tr {
      cursor: pointer;
    }
    #h_addsubjects_gridSubjects_bodytable tr.npu_completed td,
    #h_addsubjects_gridSubjects_bodytable tr.context_selectedrow[data-completed] td {
      background-color: #D5EFBA !important;
      font-weight: bold;
      color: #525659;
    }
    #h_addsubjects_gridSubjects_bodytable tr.context_selectedrow {
      border: 0 none !important;
      border-bottom: 1px solid #D3D3D3 !important;
    }
  `);

  $("body").on(
    "click",
    "#Addsubject_course1_gridCourses_bodytable tbody td, #Addsubject_course1_gridCourses_grid_body_div tbody td",
    function (e) {
      if ($(e.target).closest("input[type=checkbox]").size() === 0 && $(e.target).closest("td[onclick]").size() === 0) {
        const checkbox = $("input[type=checkbox]", $(this).closest("tr")).get(0);
        checkbox.checked = !checkbox.checked;
        if (utils.getAjaxInstance(this)) {
          utils.getAjaxInstance(this).Cv($("input[type=checkbox]", $(this).closest("tr")).get(0), "1");
        }
        e.preventDefault();
        return false;
      }
    }
  );

  $("body").on("click", "#h_addsubjects_gridSubjects_bodytable tbody td", function (e) {
    if (
      $(e.target).closest("td[onclick], span.link").size() === 0 &&
      $(e.target).closest("td.contextcell_sel, td.contextcell").size() === 0
    ) {
      utils.runEval($("td span.link", $(this).closest("tr")).attr("onclick"));
      e.preventDefault();
      return false;
    }
  });

  window.setInterval(() => {
    const table = $("#h_addsubjects_gridSubjects_bodytable");
    if (table.attr("data-painted") !== "1") {
      table.attr("data-painted", "1");
      $("tbody tr", table).each(function () {
        if ($('td[n="Completed"] img', this).size() !== 0) {
          $(this).addClass("npu_completed").attr("data-completed", "1");
        }
      });
    }
  }, 250);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0303", "h_addsubjects"),
  initialize: () => {
    fixCourseList();
  },
};


/***/ }),

/***/ 104:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);
const storage = __webpack_require__(75);

let courses;

function loadCourses() {
  courses = {
    ...storage.getForUser("courses", "_legacy"),
    ...storage.getForUser("courses", utils.getTraining()),
  };
}

function refreshScreen() {
  $("#h_addsubjects_gridSubjects_bodytable").attr("data-choices-displayed", "0");
  $("#Addsubject_course1_gridCourses_bodytable").attr("data-inner-choices-displayed", "0");
  $("#Addsubject_course1_gridCourses_grid_body_div").attr("data-inner-choices-displayed", "0");
}

// Initialize course choice storage and mark subject and course lines with stored course choices
function initCourseStore() {
  utils.injectCss(`
    #h_addsubjects_gridSubjects_bodytable tr td.npu_choice_mark,
    #Addsubject_course1_gridCourses_bodytable tr td.npu_choice_mark,
    #Addsubject_course1_gridCourses_grid_body_div tr td.npu_choice_mark {
      background: #C00 !important;
    }
  `);

  loadCourses();

  window.setInterval(() => {
    const table = $("#h_addsubjects_gridSubjects_bodytable");
    if (table.size() > 0 && table.attr("data-choices-displayed") !== "1") {
      table.attr("data-choices-displayed", "1");
      const filterEnabled = storage.getForUser("filterCourses");
      $("tbody tr", table).each(function () {
        const subjectCode = $("td:nth-child(3)", this).text().trim().toUpperCase();
        const choices = courses[subjectCode.trim().toUpperCase()];
        if (typeof choices !== "undefined" && choices !== null && choices.length > 0) {
          $("td:first-child", this).addClass("npu_choice_mark");
          $(this).css("display", "table-row");
        } else {
          $("td:first-child", this).removeClass("npu_choice_mark");
          $(this).css("display", filterEnabled ? "none" : "table-row");
        }
      });

      if ($("#h_addsubjects_gridSubjects_gridmaindiv .grid_pagertable .grid_pagerpanel").size() === 0) {
        $('<td class="grid_pagerpanel"><table align="right"><tbody><tr></tr></tbody></table></td>').insertBefore(
          "#h_addsubjects_gridSubjects_gridmaindiv .grid_pagertable .grid_pagerrow_right"
        );
      }

      const pager = $("#h_addsubjects_gridSubjects_gridmaindiv .grid_pagertable .grid_pagerpanel table tr");
      if ($("#npu_clear_courses").size() === 0) {
        const clearAll = $(
          '<td id="npu_clear_courses"><a style="color: #C00; line-height: 17px; margin-right: 30px" href="">Tárolt kurzusok törlése</a></td>'
        );
        $("a", clearAll).click(function (e) {
          e.preventDefault();
          if (
            confirm(
              `${utils.getNeptunCode()} felhasználó összes tárolt kurzusa törölve lesz ezen a képzésen. Valóban ezt szeretnéd?`
            )
          ) {
            storage.setForUser("courses", utils.getTraining(), {});
            storage.setForUser("courses", "_legacy", {});
            storage.setForUser("filterCourses", false);
            loadCourses();
            refreshScreen();
          }
        });
        pager.prepend(clearAll);
      }
      if ($("#npu_filter_courses").size() === 0) {
        const filterCell = $(
          `<td id="npu_filter_courses" style="padding-right: 30px; line-height: 17px">` +
            `<input type="checkbox" id="npu_filter_field" style="vertical-align: middle" />&nbsp;&nbsp;` +
            `<label for="npu_filter_field">Csak a tárolt kurzusok megjelenítése</label>` +
            `</td>`
        );
        $("input", filterCell).change(function () {
          storage.setForUser("filterCourses", $(this).get(0).checked);
          refreshScreen();
        });
        pager.prepend(filterCell);
      }
      $("#npu_filter_field").get(0).checked = filterEnabled;
    }

    const innerTable = $(
      "#Addsubject_course1_gridCourses_bodytable:visible, #Addsubject_course1_gridCourses_grid_body_div:visible"
    ).first();
    if (innerTable.size() > 0 && innerTable.attr("data-inner-choices-displayed") !== "1") {
      innerTable.attr("data-inner-choices-displayed", "1");
      if ($("th.headerWithCheckbox", innerTable).size() === 0) {
        const objName = utils.getAjaxInstanceId(this);
        $(
          `<th id="head_chk" class="headerWithCheckbox headerDisabled" colname="chk" title="Válasszon ki legalább egyet!" align="center">` +
            `<label class="hiddenforlabel" for="Addsubject_course1_gridCourses_bodytable_chk_chkall">Összes kijelölése</label>` +
            `<span></span>` +
            `<input aria-disabled="false" role="checkbox" id="Addsubject_course1_gridCourses_bodytable_chk_chkall" ` +
            `onclick="${objName}.AllCheckBox(this.checked,'chk',true,1,this)" type="checkbox">` +
            `<span></span>` +
            `</th>`
        ).appendTo("#Addsubject_course1_gridCourses_headerrow");
        $("tbody tr", innerTable).each(function () {
          const id = $(this).attr("id").substring(4);
          const text = $("td:nth-child(2)", this).text().trim();
          $(
            `<td t="chks" n="chk" class="aligncenter">` +
              `<label class="hiddenforlabel" for="chk${id}">${text}</label>` +
              `<input id="chk${id}" aria-disabled="false" role="checkbox" onclick="${objName}.Cv(this,'1');" type="checkbox">` +
              `</td>`
          ).appendTo(this);
        });
      }
      $("tbody tr", innerTable).each(function () {
        $("input[type=checkbox]", this).removeAttr("disabled");
      });
      const subjectText = $("#Subject_data_for_schedule_ctl00:visible > div > div > h2").html();
      if (subjectText !== null) {
        const part = subjectText.split("<br>")[0];
        const subjectCode = utils.parseSubjectCode(part);
        if (subjectCode) {
          const choices = courses[subjectCode.trim().toUpperCase()];
          const hasChoices = choices && choices.length > 0;
          if (hasChoices) {
            $("tbody tr", innerTable).each(function () {
              const courseCode = $("td:nth-child(2)", this).text().trim().toUpperCase();
              if (choices.includes(courseCode)) {
                $("td:first-child", this).addClass("npu_choice_mark");
              } else {
                $("td:first-child", this).removeClass("npu_choice_mark");
              }
            });
          } else {
            $("tbody tr td:first-child", innerTable).removeClass("npu_choice_mark");
          }
          if ($(".npu_course_choice_actions").size() === 0) {
            let header = $("#Addsubject_course1_gridCourses_gridmaindiv .grid_functiontable_top .functionitem");
            let footer = $("#Addsubject_course1_gridCourses_tablebottom .grid_functiontable_bottom .functionitem");
            const canSave = header.size() > 0;
            if (header.size() === 0) {
              $(
                `<table class="grid_functiontable_top" align="left"><tbody><tr>` +
                  `<td class="functionitem" nowrap=""></td>` +
                  `</tr></tbody></table>`
              ).appendTo("#Addsubject_course1_gridCourses_gridmaindiv .grid_topfunctionpanel");
              header = $(header.selector);
            }
            if (footer.size() === 0) {
              $(
                `<table class="grid_functiontable_bottom" align="right"><tbody><tr>` +
                  `<td class="functionitem" nowrap=""></td>` +
                  `</tr></tbody></table>`
              ).appendTo("#Addsubject_course1_gridCourses_tablebottom .grid_bottomfunctionpanel");
              footer = $(footer.selector);
            }
            const loadAndSaveHtml = canSave
              ? '<input type="button" value="Betöltés és Mentés" class="gridbutton npu_course_choice_apply" style="display: none">'
              : "";
            const buttonBarExtensions = $(
              `<span class="npu_course_choice_actions" style="margin: 0 20px">` +
                `<span class="FunctionCommandTitle">Tárolt kurzusok:</span>` +
                `<input type="button" value="Tárolás" class="gridbutton npu_course_choice_save">` +
                `<input type="button" value="Betöltés" class="gridbutton npu_course_choice_load" style="display: none">` +
                `${loadAndSaveHtml}` +
                `<input type="button" value="Törlés" class="gridbutton npu_course_choice_delete" style="display: none"></span>`
            );
            header.append(buttonBarExtensions);
            footer.prepend(buttonBarExtensions.clone());
            $(".npu_course_choice_actions .npu_course_choice_save").click(function () {
              const selectedCourses = [];
              $("tbody tr", innerTable).each(function () {
                const courseCode = $("td:nth-child(2)", this).text().trim().toUpperCase();
                const checkbox = $("input[type=checkbox]", this).get(0);
                if (checkbox.checked) {
                  selectedCourses.push(courseCode);
                }
              });
              if (selectedCourses.length === 0) {
                alert("A tároláshoz előbb válaszd ki a tárolandó kurzusokat.");
              } else {
                storage.setForUser("courses", utils.getTraining(), subjectCode.trim().toUpperCase(), selectedCourses);
                loadCourses();
                refreshScreen();
              }
            });
            $(".npu_course_choice_actions .npu_course_choice_load").click(function () {
              $("tbody tr", innerTable).each(function () {
                const courseCode = $("td:nth-child(2)", this).text().trim().toUpperCase();
                const checkbox = $("input[type=checkbox]", this).get(0);
                checkbox.checked = courses[subjectCode.trim().toUpperCase()].includes(courseCode);
                if (utils.getAjaxInstance(this)) {
                  utils.getAjaxInstance(this).Cv(checkbox, "1");
                }
              });
            });
            $(".npu_course_choice_actions .npu_course_choice_apply").click(function () {
              utils.runEval(function () {
                $(".npu_course_choice_actions .npu_course_choice_load").trigger("click");
              });
              if (utils.getAjaxInstance(this)) {
                utils.getAjaxInstance(this).SelectFunction("update");
              }
            });
            $(".npu_course_choice_actions .npu_course_choice_delete").click(function () {
              if (confirm("Valóban törölni szeretnéd a tárolt kurzusokat?")) {
                storage.setForUser("courses", utils.getTraining(), subjectCode.trim().toUpperCase(), null);
                storage.setForUser("courses", "_legacy", subjectCode.trim().toUpperCase(), null);
                loadCourses();
                refreshScreen();
              }
            });
          }
          $(
            ".npu_course_choice_load, .npu_course_choice_apply, .npu_course_choice_delete",
            $(".npu_course_choice_actions")
          ).css("display", hasChoices ? "inline" : "none");
        }
      }
    }
  }, 500);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0303", "h_addsubjects"),
  initialize: () => {
    initCourseStore();
  },
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);
const storage = __webpack_require__(75);

let examListTerm;
let examListSubject;
let examListSubjectValue;
let examSubjectFilterCache;

// Enhance exam list style and functionality
function fixExamList() {
  utils.injectCss(`
    #h_exams_gridExamList_bodytable tr.gridrow_blue td {
      background-color: #F8EFB1 !important;
      font-weight: bold;
      color: #525659 !important;
    }
    #h_exams_gridExamList_bodytable tr.npu_completed td {
      background-color: #D5EFBA !important;
    }
    #h_exams_gridExamList_bodytable tr.npu_failed td {
      background-color: #F2A49F !important;
      color: #3A3C3E !important;
    }
    #h_exams_gridExamList_bodytable tr.npu_hidden {
      display: none;
    }
    #h_exams_gridExamList_bodytable tr {
      cursor: pointer;
    }
    #upFilter_cmbSubjects option[value="0"] {
      font-size: 13px;
      font-weight: bold;
      text-decoration: underline;
    }
    #upFilter_cmbSubjects option.npu_hidden {
      display: none;
    }
    #upFilter_cmbSubjects option.npu_subscribed {
      background-color: #F8EFB1 !important;
      font-weight: bold;
    }
    #upFilter_cmbSubjects option.npu_completed {
      background-color: #D5EFBA !important;
    }
    #upFilter_cmbSubjects option.npu_failed {
      background-color: #F2A49F !important;
      color: #3A3C3E !important;
    }
  `);

  $("body").on("click", "#h_exams_gridExamList_bodytable tbody td", function (e) {
    if ($(e.target).closest("td[onclick], td.contextcell_sel, td.contextcell").size() === 0) {
      utils.runEval(() => {
        $("td.contextcell, td.contextcell_sel", $(this).closest("tr")).trigger("click");
      });
      e.preventDefault();
      return false;
    }
  });

  // Exam classes listed from most important to least important
  const classPrecedence = ["npu_subscribed", "npu_failed", "npu_completed", "npu_regular"].reverse();

  // Selects the class with the higher precedence from the two provided classes
  const selectImportantClass = function (one, two) {
    // Invalid classes have an index of -1 so they are never selected in favor of a valid one
    return classPrecedence.indexOf(one) > classPrecedence.indexOf(two) ? one : two;
  };

  window.setInterval(() => {
    const table = $("#h_exams_gridExamList_bodytable");
    const filterEnabled = storage.getForUser("filterExams");

    if (table.attr("data-processed") !== "1") {
      table.attr("data-processed", "1");

      $("tbody tr[id*=tr__]", table).each(function () {
        const row = $(this);
        const courseCode = $("td:nth-child(3)", row).clone().children().remove().end().text();
        const rowId = row.attr("id").replace(/^tr__/, "");
        const subRow = $(`#trs__${rowId}`, row.closest("tbody"));
        const markRows = $(".subtable > tbody > tr", subRow);

        row.add(markRows).removeClass(classPrecedence.join(" "));

        markRows.each(function () {
          const grade = $("td:nth-child(4)", this).text().trim();
          if (utils.isPassingGrade(grade)) {
            $(this).addClass("npu_completed");
          }
          if (utils.isFailingGrade(grade)) {
            $(this).addClass("npu_failed");
          }
        });

        let rowClass = row.hasClass("gridrow_blue") ? "npu_subscribed" : "npu_regular";

        if (markRows.size() > 0) {
          const lastMark = markRows.last();
          const grade = $("td:nth-child(4)", lastMark).text().trim();
          // The class 'npu_subscribed' has a higher precedence than these, so it will not get overwritten
          rowClass = selectImportantClass(rowClass, utils.isPassingGrade(grade) && "npu_completed");
          rowClass = selectImportantClass(rowClass, utils.isFailingGrade(grade) && "npu_failed");

          if (rowClass === "npu_completed") {
            row.add(subRow)[filterEnabled ? "addClass" : "removeClass"]("npu_hidden");
          }
        }

        row.addClass(rowClass);

        if (!$("#upFilter_cmbSubjects").val() || $("#upFilter_cmbSubjects").val() === "0") {
          examSubjectFilterCache = examSubjectFilterCache || {};
          // Only overwrite the class if it has a higher precedence than the previous one
          examSubjectFilterCache[courseCode] = selectImportantClass(examSubjectFilterCache[courseCode], rowClass);
        }
      });

      if (examSubjectFilterCache) {
        $("#upFilter_cmbSubjects > option").each(function () {
          $(this).removeClass(`npu_hidden ${classPrecedence.join(" ")}`);
          const subjectCode = utils.parseSubjectCode($(this).text().trim());
          const rowClass = examSubjectFilterCache[subjectCode];
          const enabled = storage.getForUser("filterExams");
          if (subjectCode) {
            $(this).addClass(rowClass || "npu_hidden");
          }
          if (enabled && rowClass === "npu_completed") {
            $(this).addClass("npu_hidden");
          }
        });
      }
    }
  }, 250);

  window.setInterval(() => {
    const filterEnabled = storage.getForUser("filterExams");
    const pager = $("#h_exams_gridExamList_gridmaindiv .grid_pagertable .grid_pagerpanel table tr");
    if ($("#npu_filter_exams").size() === 0) {
      const filterCell = $(
        `<td id="npu_filter_exams" style="padding-right: 30px; line-height: 17px">` +
          `<input type="checkbox" id="npu_filter_field" style="vertical-align: middle" />&nbsp;&nbsp;` +
          `<label for="npu_filter_field">Teljesített tárgyak elrejtése</label>` +
          `</td>`
      );
      $("input", filterCell).change(function () {
        storage.setForUser("filterExams", $(this).get(0).checked);
        utils.runEval(function () {
          $("#upFilter_expandedsearchbutton").click();
        });
      });
      pager.prepend(filterCell);
    }
    $("#npu_filter_field").get(0).checked = filterEnabled;
  }, 500);
}

// Automatically list exams on page load and subject change
function initExamAutoList() {
  utils.injectCss(`
    #upFilter_bodytable tr.nostyle {
      display: none;
    }
  `);
  $("body").on("change", "#upFilter_cmbSubjects", function () {
    examListSubjectValue = $(this).val();
  });
  window.setInterval(() => {
    const panel = $("#upFilter_panFilter table.searchpanel");
    const termChanged = examListTerm !== $("#upFilter_cmbTerms option[selected]").attr("value");
    const subjectChanged = examListSubject !== examListSubjectValue;

    if (panel.attr("data-listing") !== "1" && (termChanged || subjectChanged)) {
      panel.attr("data-listing", "1");
      if (termChanged) {
        examSubjectFilterCache = null;
      }
      examListTerm = $("#upFilter_cmbTerms option[selected]").attr("value");
      examListSubject = examListSubjectValue;
      utils.runEval(function () {
        $("#upFilter_expandedsearchbutton").click();
      });
    }
  }, 100);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0401", "h_exams"),
  initialize: () => {
    fixExamList();
    initExamAutoList();
  },
};


/***/ }),

/***/ 340:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);

// Hide page header to save vertical space
function hideHeader() {
  $("#panHeader, #panCloseHeader").hide();
  $("table.top_menu_wrapper").css("margin-top", "5px").css("margin-bottom", "8px");
  $("#form1 > fieldset").css("border", "0 none");
  $("#span_changeproject").parent().hide();
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    hideHeader();
  },
};


/***/ }),

/***/ 232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);

// Hide popup notifying the user about unfilled surveys on every login
function hideSurveyPopup() {
  $(".ui-dialog:has(#startupPopup_lblOpinion) .ui-dialog-titlebar-close").click();
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    hideSurveyPopup();
  },
};


/***/ }),

/***/ 371:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);

// Hide countdown and send requests to the server to keep the session alive
function initKeepSession() {
  const cdt = $("#hfCountDownTime");
  let timeout = 120;
  if (cdt.size() > 0) {
    const cdto = parseInt(cdt.val(), 10);
    if (cdto > 60) {
      timeout = cdto;
    }
  }
  const keepAlive = function () {
    window.setTimeout(() => {
      const pages = ["inbox", "0303", "0401", "0203", "0206"];
      const page = pages[Math.floor(Math.random() * pages.length)];
      $.ajax({
        url: `main.aspx?ismenuclick=true&ctrl=${page}`,
      });
      keepAlive();
    }, timeout * 1000 - 30000 - Math.floor(Math.random() * 30000));
  };
  keepAlive();

  window.setInterval(() => {
    utils.runEval(() => {
      window.ShowModal = function () {};
      clearTimeout(window.timerID);
      clearTimeout(window.timerID2);
      window.sessionEndDate = null;
    });
    if ($("#npuStatus").size() === 0) {
      $("#upTraining_lblRemainingTime").html(
        `<span id="npuStatus" style="font-weight: normal">` +
          `<a href="https://github.com/solymosi/npu" target="_blank">Neptun PowerUp!</a> ` +
          `v${GM.info.script.version}` +
          `</span>`
      );
    }
  }, 1000);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    initKeepSession();
  },
};


/***/ }),

/***/ 516:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);

// Use custom loading indicator for async requests
function initProgressIndicator() {
  const color = $("#lbtnQuit").css("color");
  utils.injectCss(`
    #npu_loading { 
      position: fixed;
      width: 150px;
      margin-left: -75px;
      left: 50%;
      top: 0;
      background: ${color};
      color: white;
      font-size: 1.2em;
      font-weight: bold;
      padding: 8px 10px;
      text-align: center;
      z-index: 1000;
      display: none;
      -webkit-border-bottom-right-radius: 5px;
      -webkit-border-bottom-left-radius: 5px;
      -moz-border-radius-bottomright: 5px;
      -moz-border-radius-bottomleft: 5px;
      border-bottom-right-radius: 5px;
      border-bottom-left-radius: 5px;
      -webkit-box-shadow: 0px 0px 3px 0px black;
      -moz-box-shadow: 0px 0px 3px 0px black;
      box-shadow: 0px 0px 3px 0px black;
    }
  `);

  $("#progress, #customtextprogress").css("visibility", "hidden");
  $('<div id="npu_loading">Kis türelmet...</div>').appendTo("body");

  utils.runEval(() => {
    const manager = window.Sys.WebForms.PageRequestManager.getInstance();
    manager.add_beginRequest(() => {
      $("#npu_loading").show();
    });
    manager.add_endRequest(() => {
      $("#npu_loading").hide();
    });
  });
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    initProgressIndicator();
  },
};


/***/ }),

/***/ 245:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const utils = __webpack_require__(555);

// Reconfigure server full wait dialog parameters
function fixWaitDialog() {
  unsafeWindow.maxtrynumber = 1e6;
  // Export the patched starttimer function into the security context of the page in order to avoid an "access denied" error on Firefox.
  // Details: https://blog.mozilla.org/addons/2014/04/10/changes-to-unsafewindow-for-the-add-on-sdk
  const timerFunction = () => {
    unsafeWindow.login_wait_timer = unsafeWindow.setInterval(unsafeWindow.docheck, 5000);
  };
  exportFunction(timerFunction, unsafeWindow, { defineAs: "npu_starttimer" });
  unsafeWindow.starttimer = unsafeWindow.npu_starttimer;
}

module.exports = {
  shouldActivate: () => utils.isLoginPage(),
  initialize: () => {
    fixWaitDialog();
  },
};


/***/ }),

/***/ 974:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);

// Fix opening in new tab and add shortcuts
function fixMenu() {
  const color = $("#lbtnQuit").css("color");
  utils.injectCss(`
    ul.menubar, .top_menu_wrapper {
      cursor: default !important; 
    }
    #mb1 li.menu-parent {
      color: #525659 !important;
    }
    #mb1 li.menu-parent.has-target {
      color: ${color} !important;
    }
    #mb1 li.menu-parent.has-target:hover {
      color: #000 !important;
    }
  `);

  $("#mb1_Tanulmanyok")
    .attr("targeturl", "main.aspx?ctrl=0206&ismenuclick=true")
    .attr("hoverid", "#mb1_Tanulmanyok_Leckekonyv");
  $("#mb1_Targyak")
    .attr("targeturl", "main.aspx?ctrl=0303&ismenuclick=true")
    .attr("hoverid", "#mb1_Targyak_Targyfelvetel");
  $("#mb1_Vizsgak")
    .attr("targeturl", "main.aspx?ctrl=0401&ismenuclick=true")
    .attr("hoverid", "#mb1_Vizsgak_Vizsgajelentkezes");

  const orarend = $(`
    <li aria-haspopup="false" tabindex="0" role="menuitem"
      class="menu-parent has-target"
      id="mb1_Orarend"
      targeturl="main.aspx?ctrl=0203&amp;ismenuclick=true">
      Órarend
    </li>
  `);
  $("#mb1_Targyak").before(orarend);
  $("#mb1_Tanulmanyok_Órarend").remove();

  if (!$("#upChooser_chooser_kollab").hasClass("KollabChooserSelected")) {
    $(`
      <li aria-haspopup="false" tabindex="0" role="menuitem"
        class="menu-parent has-target"
        id="mb1_MeetStreet"
        targeturl="javascript:__doPostBack('upChooser$btnKollab','')">
        Meet Street
      </li>
    `).appendTo("#mb1");
  }
  if (!$("#upChooser_chooser_neptun").hasClass("NeptunChooserSelected")) {
    $(`
      <li aria-haspopup="false" tabindex="0" role="menuitem"
        class="menu-parent has-target"
        id="mb1_TanulmanyiRendszer"
        targeturl="javascript:__doPostBack('upChooser$btnNeptun','')">
        Neptun
      </li>
    `).appendTo("#mb1");
  }

  $("#mb1 li[targeturl]")
    .css("position", "relative")
    .each(function () {
      $(this).addClass("has-target");
      const target = $(this).attr("targeturl");
      const a = $(`
        <a href="${target}" style="display: block; position: absolute; left: 0; top: 0; width: 100%; height: 100%"></a>
      `);
      a.click(function (e) {
        $("ul.menu").css("visibility", "hidden");
        e.stopPropagation();
      });
      const hoverid = $(this).attr("hoverid");
      if (hoverid) {
        a.hover(
          () => {
            $(hoverid).addClass("menu-hover");
          },
          () => {
            $(hoverid).removeClass("menu-hover");
          }
        );
      }
      $(this).append(a);
    });
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    fixMenu();
  },
};


/***/ }),

/***/ 73:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const utils = __webpack_require__(555);

// Enhance mark list style
function fixMarkList() {
  utils.injectCss(`
    #h_markbook_gridIndexEntry_bodytable tr.SubjectCompletedRow td {
      background-color: #D5EFBA !important;
    }
  `);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0206", "h_markbook"),
  initialize: () => {
    fixMarkList();
  },
};


/***/ }),

/***/ 802:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);

// Allow user to dismiss the 'you have an official message' popup
function fixOfficialMessagePopup() {
  const dismiss = () => {
    const e = $("[aria-describedby=upRequiredMessageReader_upmodal_RequiredMessageReader_divpopup] .ui-dialog-content");
    e.dialog("close");
  };

  window.setInterval(() => {
    const popup = $("#upRequiredMessageReader_upmodal_RequiredMessageReader_divpopup:visible").closest(".ui-dialog");
    if (popup.size() > 0 && $("#upFunction_c_messages_upMain_upGrid").size() === 0) {
      utils.runEval(dismiss);
    }
    if (popup.size() > 0 && popup.is(":not([data-npu-enhanced])")) {
      popup.attr("data-npu-enhanced", "true");
      $("input[commandname=Tovabb]", popup).val("Elolvasom");
      const dismissBtn = $(
        '<input value="Most nem érdekel" class="npu_dismiss ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" type="button">'
      );
      dismissBtn.click(function () {
        utils.runEval(dismiss);
      });
      $(".ui-dialog-footerbar > div", popup).append(dismissBtn);
    }
  }, 200);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    fixOfficialMessagePopup();
  },
};


/***/ }),

/***/ 674:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);

// Add current page name to the window title
function fixTitle() {
  const originalTitle = document.title;
  window.setInterval(() => {
    const pageTitle = $("#upMenuCaption_menucaption").text().toString();
    if (document.title === originalTitle) {
      document.title = (pageTitle === "" ? "" : `${pageTitle} – `) + originalTitle;
    }
  }, 1000);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    fixTitle();
  },
};


/***/ }),

/***/ 564:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);

// Set all paginators to 500 items per page
function fixPagination() {
  window.setInterval(() => {
    const pageSelect = $(".grid_pagerpanel select");
    pageSelect.each(function () {
      const e = $(this);
      e.hide();
      $(".link_pagesize", e.closest("tr")).html("");
      if (e.attr("data-listing") !== "1" && e.val() !== "500") {
        e.attr("data-listing", "1").val("500");
        const onChange = this.getAttributeNode("onchange");
        if (onChange) {
          utils.runEval(onChange.value);
        }
      }
    });
  }, 100);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    fixPagination();
  },
};


/***/ }),

/***/ 893:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);

// Enhance signed exam list style and functionality
function fixSignedExamList() {
  utils.injectCss(`
    #h_signedexams_gridExamList_bodytable tr.npu_missed td {
      background-color: #F8EFB1 !important;
      color: #525659 !important;
    }
    #h_signedexams_gridExamList_bodytable tr.npu_completed td {
      background-color: #D5EFBA !important;
    }
    #h_signedexams_gridExamList_bodytable tr.npu_failed td {
      background-color: #F2A49F !important;
      color: #3A3C3E !important;
    }
  `);

  window.setInterval(() => {
    const table = $("#h_signedexams_gridExamList_bodytable");

    if (table.attr("data-processed") !== "1") {
      table.attr("data-processed", "1");

      $("tbody tr:not(.NoMatch)", table).each(function () {
        const row = $(this);
        row.removeClass("npu_completed npu_failed npu_missed");
        const cells = row.children("td").length;
        let attended = $("td[n=Attended]", row)[0].attributes.checked.value === "true";

        let grade;
        if (cells <= 15) grade = $("td:nth-child(13)", row).text().trim();
        else {
          // Neptun build 454 introduced an extra column to show justified absence.
          // In this case, consider such exams "attended". Because of no grade,
          // they won't be coloured.
          attended = attended || $("td[n=JustifiedMissing]", row)[0].attributes.checked.value === "true";

          if (cells <= 16) {
            grade = $("td:nth-child(14)", row).text().trim();
          } else {
            // Neptun build 456 introduced ANOTHER extra column, now the signed exams
            // are listed with rows: "counts as exam", "attended", "justified absence".
            grade = $("td:nth-child(15)", row).text().trim();
          }
        }

        if (attended) {
          if (utils.isPassingGrade(grade)) {
            row.addClass("npu_completed");
          }
          if (utils.isFailingGrade(grade)) {
            row.addClass("npu_failed");
          }
        } else {
          row.addClass("npu_missed");
        }
      });
    }
  }, 250);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0402", "h_signedexams"),
  initialize: () => {
    fixSignedExamList();
  },
};


/***/ }),

/***/ 654:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);
const storage = __webpack_require__(75);

// Replace term drop-down list with buttons
function fixTermSelect() {
  utils.injectCss(`
    .termSelect {
      list-style: none;
      padding: 0;
    }
    .termSelect li {
      display: inline-block;
      vertical-align: middle;
      margin: 0 15px 0 0;
      line-height: 250%;
    }
    .termSelect li a {
      padding: 5px;
    }
    .termSelect li a.button {
      color: #FFF;
      box-shadow: none;
      text-decoration: none;
      cursor: default;
    }
  `);
  const findTermSelect = () => {
    return $(
      [
        "#upFilter_cmbTerms",
        "#upFilter_cmb_m_cmb",
        "#cmbTermsNormal",
        "#upFilter_cmbTerms_m_cmb",
        "#cmb_cmb",
        "#c_common_timetable_cmbTermsNormal",
        "#cmbTerms_cmb",
      ].join(", ")
    ).first();
  };
  const blanklist = [
    "0303",
    "h_addsubjects",
    "0401",
    "h_exams",
    "0503",
    "h_transactionlist",
    "1406",
    "h_grading_request",
  ];
  const clickExecuteButton = () => {
    if (blanklist.includes(utils.getPageId())) {
      return;
    }
    utils.runEval(() => {
      $("#upFilter_expandedsearchbutton").click();
    });
  };
  const selectTerm = term => {
    const termSelect = findTermSelect();
    const el = $(`.termSelect a[data-value=${term}]`);
    if (el.size() === 0 || el.hasClass("button")) {
      return false;
    }
    termSelect.val(el.attr("data-value"));
    $(".termSelect .button").removeClass("button");
    el.addClass("button");
    const onChange = termSelect[0].getAttributeNode("onchange");
    if (onChange) {
      utils.runAsync(() => {
        utils.runEval(onChange.value);
      });
    }
    return true;
  };

  window.setInterval(() => {
    const termSelect = findTermSelect();
    if (termSelect.is(":disabled")) {
      return;
    }
    if (termSelect.is(":visible")) {
      $(".termSelect").remove();
      const select = $('<ul class="termSelect"></ul>');
      let stored = storage.getForUser("termSelect", utils.getPageId());
      let found = false;
      const match = $("#lblTrainingName")
        .text()
        .match(/:(\d{4}\/\d{2}\/\d)\[.*?\]\)/);
      const admissionSemester = match && String(match[1]);

      $("option", termSelect).each(function () {
        if ($(this).attr("value") === "-1") {
          return;
        }
        if (admissionSemester && $(this).text() < admissionSemester) {
          return;
        }
        const value = $(this).attr("value");
        const klass = termSelect.val() === $(this).attr("value") ? "button" : "";
        const label = $(this).html();
        const item = $(`<li><a href="#" data-value="${value}" class="${klass}">${label}</a></li>`);
        if (stored && $(this).attr("value") === stored) {
          found = true;
        }
        $("a", item).bind("click", function (e) {
          e.preventDefault();
          const term = $(this).attr("data-value");
          if (selectTerm(term)) {
            if (stored !== term) {
              stored = term;
              storage.setForUser("termSelect", utils.getPageId(), term);
            }
            clickExecuteButton();
          }
        });
        select.append(item);
      });
      termSelect.parent().append(select);
      termSelect.hide();
      if (!termSelect.data("initialized")) {
        termSelect.data("initialized", true);
        if (found && termSelect.val() !== stored) {
          selectTerm(stored);
          clickExecuteButton();
        } else if ($(".grid_pagertable").size() === 0) {
          clickExecuteButton();
        }
      }
    }
  }, 500);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    fixTermSelect();
  },
};


/***/ }),

/***/ 46:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const $ = window.jQuery;
const utils = __webpack_require__(555);

// Enhance timetable functionality
function fixTimetable() {
  window.setInterval(() => {
    if ($("#gridcontainer").attr("data-bound") !== "1") {
      utils.runEval(function () {
        const options = $("#gridcontainer").BcalGetOp();
        if (options) {
          $("#gridcontainer").attr("data-bound", "1");
          const callback = options.onAfterRequestData;
          options.onAfterRequestData = function (n) {
            if ($("#gridcontainer").attr("data-called") !== "1") {
              $("#gridcontainer").attr("data-called", "1");
              $("#upFunction_c_common_timetable_upTimeTable .showtoday").trigger("click");
            }
            callback(n);
          };
        }
      });
    }
  }, 100);
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn() && utils.isPageId("0203", "c_common_timetable"),
  initialize: () => {
    fixTimetable();
  },
};


/***/ }),

/***/ 75:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const utils = __webpack_require__(555);

// Stored data
let data = {};

// Load all data from local storage
async function initialize() {
  try {
    data = JSON.parse(await GM.getValue("data")) || {};
  } catch (e) {}
  await upgradeSchema();
}

// Save all data to local storage
function save() {
  return GM.setValue("data", JSON.stringify(data));
}

// Gets the value at the specified key path
function get(...keys) {
  return utils.deepGetProp(data, keys);
}

// Sets the value at the specified key path
function set(...keysAndValue) {
  const value = keysAndValue.pop();
  const keys = keysAndValue;
  utils.deepSetProp(data, keys, value);
  save();
}

// Gets the specified property or all data of the current user
function getForUser(...keys) {
  return get("users", utils.getDomain(), utils.getNeptunCode(), "data", ...keys);
}

// Sets the specified property of the current user
function setForUser(...keysAndValue) {
  return set("users", utils.getDomain(), utils.getNeptunCode(), "data", ...keysAndValue);
}

// Upgrade the data schema to the latest version
async function upgradeSchema() {
  const ver = typeof data.version !== "undefined" ? data.version : 0;

  // < 1.3
  if (ver < 1) {
    let users;
    try {
      users = JSON.parse(await GM.getValue("neptun.users"));
    } catch (e) {}
    if (Array.isArray(users)) {
      users.forEach(user => {
        set("users", utils.getDomain(), user[0].toUpperCase(), "password", btoa(user[1]));
      });
    }
    let courses;
    try {
      courses = JSON.parse(await GM.getValue("neptun.courses"));
    } catch (e) {}
    if (typeof courses === "object") {
      Object.keys(courses).forEach(user => {
        Object.keys(courses[user]).forEach(subject => {
          set("users", utils.getDomain(), user, "courses", "_legacy", subject, courses[user][subject]);
        });
      });
    }
    data.version = 1;
  }

  save();
}

module.exports = {
  initialize,
  get,
  set,
  getForUser,
  setForUser,
};


/***/ }),

/***/ 555:
/***/ ((module) => {

const $ = window.jQuery;

// Verify that we are indeed on a Neptun page
function isNeptunPage() {
  return document.title.indexOf("Neptun.Net") !== -1;
}

// Returns whether we are on the login page
function isLoginPage() {
  return $("td.login_left_side").size() > 0;
}

// Returns whether we are authenticated
function isLoggedIn() {
  return !!getNeptunCode();
}

// Parses and returns the Neptun code of the current user
function getNeptunCode() {
  if ($("#upTraining_topname").size() > 0) {
    const input = $("#upTraining_topname").text();
    return input.substring(input.indexOf(" - ") + 3).toUpperCase();
  }
}

// Parses and returns the first-level domain of the site
function getDomain() {
  const host = location.host.split(".");
  const tlds = "at co com edu eu gov hu hr info int mil net org ro rs sk si ua uk".split(" ");
  let domain = "";
  for (let i = host.length - 1; i >= 0; i--) {
    domain = `${host[i]}.${domain}`;
    if (!tlds.includes(host[i])) {
      return domain.substr(0, domain.length - 1);
    }
  }
}

// Parses and returns the sanitized name of the current training
function getTraining() {
  if ($("#lblTrainingName").size() > 0) {
    return $("#lblTrainingName")
      .text()
      .replace(/[^a-zA-Z0-9]/g, "");
  }
}

// Returns the ID of the current page
function getPageId() {
  const result = /ctrl=([a-zA-Z0-9_]+)/g.exec(window.location.href);
  return result ? result[1] : null;
}

// Returns whether the specified ID is the current page
function isPageId(...ctrls) {
  return ctrls.includes(getPageId());
}

// Get the current AJAX grid instance
function getAjaxInstance(element) {
  const instanceId = getAjaxInstanceId(element);
  return instanceId && unsafeWindow[getAjaxInstanceId(element)];
}

function getAjaxInstanceId(element) {
  const ajaxGrid = $(element).closest("div[type=ajaxgrid]");
  return ajaxGrid.size() > 0 && ajaxGrid.first().attr("instanceid");
}

// Runs a function asynchronously to fix problems in certain cases
function runAsync(func) {
  window.setTimeout(func, 0);
}

// Evaluates code in the page context
function runEval(source) {
  const value = typeof source === "function" ? `(${source})();` : source;
  const script = document.createElement("script");
  script.setAttribute("type", "application/javascript");
  script.textContent = value;
  document.body.appendChild(script);
  document.body.removeChild(script);
}

// Reads the value at the provided path in a deeply nested object
function deepGetProp(o, s) {
  let c = o;
  while (s.length) {
    const n = s.shift();
    if (!(c instanceof Object && n in c)) {
      return;
    }
    c = c[n];
  }
  return c;
}

// Sets a value at the provided path in a deeply nested object
function deepSetProp(o, s, v) {
  let c = o;
  while (s.length) {
    const n = s.shift();
    if (s.length === 0) {
      if (v === null) {
        delete c[n];
      } else {
        c[n] = v;
      }
      return;
    }
    if (!(typeof c === "object" && n in c)) {
      c[n] = new Object();
    }
    c = c[n];
  }
}

// Injects a style tag into the page
function injectCss(css) {
  $("<style></style>").html(css).appendTo("head");
}

// Parses a subject code that is in parentheses at the end of a string
function parseSubjectCode(source) {
  const str = source.trim();
  if (str.charAt(str.length - 1) === ")") {
    let depth = 0;
    for (let i = str.length - 2; i >= 0; i--) {
      const c = str.charAt(i);
      if (depth === 0 && c === "(") {
        return str.substring(i + 1, str.length - 1);
      }
      depth = c === ")" ? depth + 1 : depth;
      depth = c === "(" && depth > 0 ? depth - 1 : depth;
    }
  }
  return null;
}

// Returns if the given string stands for a passing grade
function isPassingGrade(str) {
  return [
    "jeles",
    "excellent",
    "jó",
    "good",
    "közepes",
    "satisfactory",
    "elégséges",
    "pass",
    "kiválóan megfelelt",
    "excellent",
    "megfelelt",
    "average",
  ].some(function (item) {
    return str.toLowerCase().indexOf(item) !== -1;
  });
}

// Returns if the given string stands for a failing grade
function isFailingGrade(str) {
  return [
    "elégtelen",
    "fail",
    "nem felelt meg",
    "unsatisfactory",
    "nem jelent meg",
    "did not attend",
    "nem vizsgázott",
    "did not attend",
  ].some(function (item) {
    return str.toLowerCase().indexOf(item) !== -1;
  });
}

module.exports = {
  isNeptunPage,
  isLoginPage,
  isLoggedIn,
  getNeptunCode,
  getDomain,
  getTraining,
  getPageId,
  isPageId,
  getAjaxInstance,
  getAjaxInstanceId,
  runAsync,
  runEval,
  deepGetProp,
  deepSetProp,
  injectCss,
  parseSubjectCode,
  isPassingGrade,
  isFailingGrade,
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
(() => {
const utils = __webpack_require__(555);
const storage = __webpack_require__(75);

const modules = [
  // Login page
  __webpack_require__(318),
  __webpack_require__(245),

  // All authenticated pages
  __webpack_require__(340),
  __webpack_require__(674),
  __webpack_require__(974),
  __webpack_require__(654),
  __webpack_require__(564),
  __webpack_require__(802),
  __webpack_require__(232),
  __webpack_require__(371),
  __webpack_require__(516),

  // Timetable page
  __webpack_require__(46),

  // Markbook page
  __webpack_require__(73),

  // Advance page
  __webpack_require__(616),

  // Course signup page
  __webpack_require__(977),
  __webpack_require__(374),
  __webpack_require__(104),

  // Exams page
  __webpack_require__(230),

  // Signed exams page
  __webpack_require__(893),
];

(async () => {
  await storage.initialize();

  modules.forEach(module => {
    if (module.shouldActivate() && (utils.isNeptunPage() || module.runOutsideNeptun)) {
      module.initialize();
    }
  });
})();

})();

/******/ })()
;