// ==UserScript==
// @name           Get Courses Grades - V2.2
// @version        2.2
// @description    This Tool Get The Courses Grades
// @author         Omer Ben Yosef
// @include			https://info.braude.ac.il/yedion/fireflyweb.aspx
// @namespace       https://greasyfork.org/users/18768
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/429704/Get%20Courses%20Grades%20-%20V22.user.js
// @updateURL https://update.greasyfork.org/scripts/429704/Get%20Courses%20Grades%20-%20V22.meta.js
// ==/UserScript==

$(document).ready(function(e) {
    if (progName == "Grade_AVR") {
      let tr = $("td").filter(function () {
        return $(this).text().indexOf("שם") > 0;
      }).closest("tr");
  tr[0].remove();

  }
})


let form_box_main = document.createElement('div');
form_box_main.className = "form-horizontal";


let form_box_table = document.createElement('div');
form_box_table.className = "card g-brd-primary rounded-0 FakeTable";

let form_box_not_in_use = document.createElement('div');
form_box_not_in_use.className = "NotInUse";

let form_box_header = document.createElement('h2');
form_box_header.className = "card-header g-bg-primary g-brd-transparent g-font-size-22  rounded-0 mb-0 card-label fw-bolder fs-3 mb-1 pt-5";
form_box_header.innerText = "התפלגויות ציונים - מסך הזמנה"

form_box_not_in_use.appendChild(form_box_header);


//////// Form Group - Code Course //
let form_group_code = document.createElement('div');
form_group_code.className = "form-group";

let form_group_code_label = document.createElement('label');
form_group_code_label.className = "col-md-3 dir-rtl";
form_group_code_label.innerText = "קוד קורס"

let form_group_code_input_container = document.createElement('div');
form_group_code_input_container.className = "col-md-9 dir-rtl";

let form_group_code_input = document.createElement('input');
form_group_code_input.type = 'text';
form_group_code_input.id = 'input_course';
form_group_code_input.style = 'width: 150px; height: 35px';

form_group_code_input_container.appendChild(form_group_code_input);

form_group_code.appendChild(form_group_code_label)
form_group_code.appendChild(form_group_code_input_container)

//////// Form Group - Year//
let form_group_year = document.createElement('div');
form_group_year.className = "form-group";

let form_group_year_label = document.createElement('label');
form_group_year_label.className = "col-md-3 dir-rtl";
form_group_year_label.innerText = "שנה"

let form_group_year_select_container = document.createElement('div');
form_group_year_select_container.className = "col-md-9 dir-rtl";

let form_group_year_select = document.createElement('select');
form_group_year_select.id = 'mySelect_year';
form_group_year_select.style = 'height: 25px; background-color: #fff ; border: 1px solid #aaa ; border-radius: 4px';
form_group_year_select.className = 'Width150 select2 select2-container select2-container--bootstrap5 select2-container--above'

let years = BuildYearsArray();

//Create and append the options
for (let j = 0; j < years.length; j++) {
  let option_2 = document.createElement("option");
  option_2.value = years[j];
  option_2.text = years[j];
  form_group_year_select.appendChild(option_2);
}

form_group_year_select_container.appendChild(form_group_year_select);

form_group_year.appendChild(form_group_year_label)
form_group_year.appendChild(form_group_year_select_container)

//////// Form Group - Semster //

let form_group_semester = document.createElement('div');
form_group_semester.className = "form-group";

let form_group_semester_label = document.createElement('label');
form_group_semester_label.className = "col-md-3 dir-rtl";
form_group_semester_label.innerText = "סמסטר"

let form_group_semester_select_container = document.createElement('div');
form_group_semester_select_container.className = "col-md-9 dir-rtl";

let form_group_semester_select = document.createElement('select');
form_group_semester_select.id = 'mySelect_Semster';
form_group_semester_select.style = 'height: 25px; background-color: #fff ; border: 1px solid #aaa ; border-radius: 4px';
form_group_semester_select.className = 'Width150 select2 select2-container select2-container--bootstrap5 select2-container--above'

let semster_array = [{ value: "1", text: "חורף" },
{ value: "2", text: "אביב" },
{ value: "3", text: "קיץ" }];


//Create and append the options
for (let k = 0; k < semster_array.length; k++) {
  let option_3 = document.createElement("option");
  option_3.value = semster_array[k].value;
  option_3.text = semster_array[k].text;
  form_group_semester_select.appendChild(option_3);
}


form_group_semester_select_container.appendChild(form_group_semester_select);

form_group_semester.appendChild(form_group_semester_label)
form_group_semester.appendChild(form_group_semester_select_container)


//////// Form Group - Moad //

let form_group_moad = document.createElement('div');
form_group_moad.className = "form-group";

let form_group_moad_label = document.createElement('label');
form_group_moad_label.className = "col-md-3 dir-rtl";
form_group_moad_label.innerText = "מועד"

let form_group_moad_select_container = document.createElement('div');
form_group_moad_select_container.className = "col-md-9 dir-rtl";

let form_group_moad_select = document.createElement('select');
form_group_moad_select.id = 'mySelect_moad';
form_group_moad_select.style = 'height: 25px; background-color: #fff ; border: 1px solid #aaa ; border-radius: 4px';
form_group_moad_select.className = 'Width150 select2 select2-container select2-container--bootstrap5 select2-container--above'

let moads_array = [{ value: "1", text: "א" },
{ value: "2", text: "ב" },
{ value: "3", text: "ג" }];

for (let z = 0; z < moads_array.length; z++) {
  let option_4 = document.createElement("option");
  option_4.value = moads_array[z].value;
  option_4.text = moads_array[z].text;
  form_group_moad_select.appendChild(option_4);
}

form_group_moad_select_container.appendChild(form_group_moad_select);

form_group_moad.appendChild(form_group_moad_label)
form_group_moad.appendChild(form_group_moad_select_container)

//// append kids //

form_box_table.appendChild(form_box_not_in_use)
form_box_table.appendChild(form_group_code)
form_box_table.appendChild(form_group_year)
form_box_table.appendChild(form_group_semester)
form_box_table.appendChild(form_group_moad)

/////////

let br1 = document.createElement('br');
let br2 = document.createElement('br');

let button_container = document.createElement('div');
button_container.className = "text TextCenter";

let button = document.createElement('a');
button.className = "btn btn-md u-btn-primary btn-primary rounded g-mb-12";
button.innerText = "שלוף התפלגות"
button.id = "Grades";

button_container.append(button);

// Append All //

form_box_main.appendChild(form_box_table)
form_box_main.appendChild(br1)
form_box_main.appendChild(br2)
form_box_main.appendChild(button_container)

let table_main_main = (document.getElementsByClassName("table-responsive"))[0]
table_main_main.appendChild(form_box_main)

selectDefultSemster();


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
    complete: function (xhr) { },
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
    complete: function (xhr) { },
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
    complete: function (xhr) { },
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
    document.getElementById("mySelect_Semster").text = "חורף";

  }
  if (month >= 4 && month <= 9) {
    document.getElementById("mySelect_Semster").value = "2";
    document.getElementById("mySelect_Semster").text = "אביב";

  }
}



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
