// ==UserScript==
// @name           Get Courses Grades
// @version        2.0
// @description    This Tool Get The Courses Grades
// @include			https://info.braude.ac.il/yedion/fireflyweb.aspx
// @namespace       https://greasyfork.org/users/18768
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421953/Get%20Courses%20Grades.user.js
// @updateURL https://update.greasyfork.org/scripts/421953/Get%20Courses%20Grades.meta.js
// ==/UserScript==

var myParent = document.body;

var input_course = document.createElement("input");
input_course.id = "input_course";
myParent.appendChild(input_course);
input_course.style = "margin-right: 30%;margin-bottom: 20%; width: 15%";

var years = BuildYearsArray();

var selectListYear = document.createElement("select");
selectListYear.id = "mySelect_year";
myParent.appendChild(selectListYear);

//Create and append the options
for (var j = 0; j < years.length; j++) {
  var option_2 = document.createElement("option");
  option_2.value = years[j];
  option_2.text = years[j];
  selectListYear.appendChild(option_2);
}

selectListYear.style = "margin-right: 2%;margin-bottom: 20%; height:30px;";

var semster = ["1", "2", "3"];

var selectListSemster = document.createElement("select");
selectListSemster.id = "mySelect_Semster";
myParent.appendChild(selectListSemster);

selectDefultSemster();

//Create and append the options
for (var k = 0; k < semster.length; k++) {
  var option_3 = document.createElement("option");
  option_3.value = semster[k];
  option_3.text = semster[k];
  selectListSemster.appendChild(option_3);
}

selectListSemster.style = "margin-right: 2%;margin-bottom: 20%;height:30px;";

var Moads = ["1", "2", "3"];

var selectListMoad = document.createElement("select");
selectListMoad.id = "mySelect_moad";
myParent.appendChild(selectListMoad);

//Create and append the options
for (var z = 0; z < Moads.length; z++) {
  var option_4 = document.createElement("option");
  option_4.value = Moads[z];
  option_4.text = Moads[z];
  selectListMoad.appendChild(option_4);
}

selectListMoad.style = "margin-right: 2%;margin-bottom: 20%;height:30px;";

function getCourseArgByYear_Semster(value) {
  let tempDom = $("<output>").append($.parseHTML(value));
  let appContainer = $('input[value="פרטים נוספים"]', tempDom);
  if (appContainer.length > 0) {
    data = appContainer[0].onclick.toString().split("'");
    data = data.find((a) => a.includes(corse_code));
  } else {
    data = "Course Not Found";
  }
  return data;
}

function getYearPromise(year) {
  return $.ajax({
    url: "https://info.braude.ac.il/yedion/fireflyweb.aspx",
    type: "POST",
    data: {
      PRGNAME: "Enter_Search",
      ARGUMENTS: "-A,,-A,R1C39",
      R1C39: year,
    },
    error: function (xhr, error) {
      console.log(error);
    },
    complete: function (xhr) {},
  });
}

function getSemsterPromise(semster) {
  return $.ajax({
    url: "https://info.braude.ac.il/yedion/fireflyweb.aspx",
    type: "POST",
    data: {
      PRGNAME: "Enter_Search",
      ARGUMENTS: "-A,R1C19,-AT",
      R1C19: semster,
    },
    error: function (xhr, error) {
      console.log(error);
    },
    complete: function (xhr) {},
  });
}

function getCoursePromise(course) {
  return $.ajax({
    url: "https://info.braude.ac.il/yedion/fireflyweb.aspx",
    type: "POST",
    data: {
      PRGNAME: "S_LOOK_FOR_NOSE",
      ARGUMENTS: "SubjectCode",
      SubjectCode: course,
    },
    error: function (xhr, error) {
      console.log(error);
    },
    complete: function (xhr) {},
  });
}

function BuildDataString(data) {
  data = data.split(",");
  data.splice(1, 1);
  return data.join(",");
}

function BuildYearsArray() {
  let array = [];
  let year = new Date().getFullYear();
  let month = new Date().getMonth();
  if (month >= 10 && month <= 12) {
    year = year + 1;
  }
  for (year = year; year > 2013; year--) {
    array.push(year);
  }
  return array;
}

function selectDefultSemster() {
  let month = new Date().getMonth();
  if (month >= 10 || month <= 3) {
    document.getElementById("mySelect_Semster").value = "1";
  }
  if (month >= 4 && month <= 9) {
    document.getElementById("mySelect_Semster").value = "2";
  }
}

var btn2 = document.createElement("BUTTON"); // Create a <button> element
btn2.id = "Grades";
btn2.style = "margin-right: 10%;margin-bottom: 20%;";
btn2.innerHTML = "<p><b>התפלגות</b></p>";

document.body.appendChild(btn2);

$("#Grades").on("click", function () {
  array_args = [];
  tz = $("input[name=TZ]")[0];
  tz = tz.value;
  uniq = $("input[name=UNIQ]")[0];
  uniq = uniq.value;
  year = $("#mySelect_year").val();
  semster = $("#mySelect_Semster").val();
  corse_code = $("#input_course").val();
  moad = $("#mySelect_moad").val();
  app = "Grade_AVR";
  trg = "_blank";
  tz_str = "".concat("-N", tz);
  uniq_str = "".concat("-N", uniq);
  ASA = "-AS,-A";
  year_str = "".concat("-N", year);
  semster_str = "".concat("-N  ", semster);
  moad_str = "".concat("-N", moad);

  getYearPromise(year).then((value) => {
    getSemsterPromise(semster).then((value) => {
      getCoursePromise(corse_code).then((value) => {
        Course_Arg = getCourseArgByYear_Semster(value);
        if (Course_Arg != "Course Not Found") {
          course_str = BuildDataString(Course_Arg);
          array_args.push(tz_str);
          array_args.push(uniq_str);
          array_args.push(ASA);
          array_args.push(year_str);
          array_args.push(semster_str);
          array_args.push(course_str);
          array_args.push(moad_str);
          arg = array_args.join(",");
          send_form(app, arg, trg);
        } else {
          alert(Course_Arg);
        }
      });
    });
  });
});
