// ==UserScript==
// @name           Get Courses Status - V1.0
// @version        1.0
// @description    This Tool Get The Courses Registration Status - Full / Empty
// @author         Omer Ben Yosef
// @include			https://info.braude.ac.il/yedion/fireflyweb.aspx
// @namespace       https://greasyfork.org/users/18768
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js

// @downloadURL https://update.greasyfork.org/scripts/439955/Get%20Courses%20Status%20-%20V10.user.js
// @updateURL https://update.greasyfork.org/scripts/439955/Get%20Courses%20Status%20-%20V10.meta.js
// ==/UserScript==

const Courses_Ids = []; // Set The Courses Ids

const Courses_Map = new Map();
let Courses_data = [];
let Courses_Promises_Name = [];
let Courses_Promises_Data = [];


let form_box_main = document.createElement('div');
form_box_main.className = "form-horizontal";


let form_box_table = document.createElement('div');
form_box_table.className = "card g-brd-primary rounded-0 FakeTable";

let form_box_not_in_use = document.createElement('div');
form_box_not_in_use.className = "NotInUse";

let form_box_header = document.createElement('h2');
form_box_header.className = "card-header g-bg-primary g-brd-transparent g-font-size-22  rounded-0 mb-0 card-label fw-bolder fs-3 mb-1 pt-5";
form_box_header.innerText = "סטטוס רישום לקורסים - מצב הזמנה"

form_box_not_in_use.appendChild(form_box_header);


//////// Form Group - Year//
let form_group_year = document.createElement('div');
form_group_year.className = "form-group";

let form_group_year_label = document.createElement('label');
form_group_year_label.className = "col-md-3 dir-rtl";
form_group_year_label.innerText = "שנה מבוקשת"

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

let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
if (month >= 8 && month <= 12) {
  year = year + 1;
}
//form_group_year_select.val(year);
form_group_year_select.value = year;


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

let form_group_excel_input = document.createElement('div');
form_group_excel_input.className = "form-group";

let form_group_excel_input_label = document.createElement('label');
form_group_excel_input_label.className = "col-md-3 dir-rtl";
form_group_excel_input_label.innerText = "קובץ אקסל - קלט"

let form_group_excel_input_container = document.createElement('div');
form_group_excel_input_container.className = "col-md-9 dir-rtl";

let form_group_excel_inputFile = document.createElement('input');
form_group_excel_inputFile.type = "file";
form_group_excel_inputFile.innerText = "טען קובץ"

form_group_excel_input_container.append(form_group_excel_inputFile);


form_group_excel_input.appendChild(form_group_excel_input_label)
form_group_excel_input.appendChild(form_group_excel_input_container)


//// append kids //

form_box_table.appendChild(form_box_not_in_use)
form_box_table.appendChild(form_group_year)
form_box_table.appendChild(form_group_semester)
form_box_table.appendChild(form_group_excel_input)

/////////

let br1 = document.createElement('br');
let br2 = document.createElement('br');

let button_container = document.createElement('div');
button_container.className = "text TextCenter";

let button = document.createElement('a');
button.className = "btn btn-md u-btn-primary btn-primary rounded g-mb-12";
button.innerText = "שלוף סטטוס רישום לקורסים"
button.id = "GetRegStatus";

button_container.append(button);

// Append All //

form_box_main.appendChild(form_box_table)
form_box_main.appendChild(br1)
form_box_main.appendChild(br2)
form_box_main.appendChild(button_container)



let table_main_main = (document.getElementsByClassName("table-responsive"))[0]
table_main_main.appendChild(form_box_main)

selectDefultSemster();

//////// Build Result Table /////////////

// Header //
let result_box_main = document.createElement('div');
result_box_main.className = "form-horizontal";

let result_box_table_main = document.createElement('div');
result_box_table_main.className = "card g-brd-primary rounded-0";
result_box_table_main.style = 'margin-top: 20px;'

let result_box_not_in_use = document.createElement('div');
result_box_not_in_use.className = "NotInUse";

let result_box_header = document.createElement('h2');
result_box_header.className = "card-header g-bg-primary g-brd-transparent g-font-size-22  rounded-0 mb-0 card-label fw-bolder fs-3 mb-1 pt-5";
result_box_header.innerText = "סטטוס רישום לקורסים"

result_box_not_in_use.appendChild(result_box_header);

/// Header ///

/// Data Table //

let result_table_box = document.createElement('div');
result_table_box.className = "dataTables_wrapper dt-bootstrap4 no-footer";

let result_table_header = document.createElement('div');
result_table_header.className = "row";

let result_table_header_col = document.createElement('div');
result_table_header_col.className = "col-sm-12";

let result_table_main = document.createElement('table');
result_table_main.className = "table table-striped table-bordered TableDefault SortMe dataTable no-footer";

let table_thead = document.createElement('thead');

let table_thead_tr = document.createElement('tr');

let table_thead_tr_th_course = document.createElement('th');
table_thead_tr_th_course.style = "width: 159.533px; cursor: pointer;";
table_thead_tr_th_course.innerText = "קורס";

let table_thead_tr_th_type = document.createElement('th');
table_thead_tr_th_type.style = "width: 135.4px; cursor: pointer;";
table_thead_tr_th_type.innerText = "סוג";

let table_thead_tr_th_week_day = document.createElement('th');
table_thead_tr_th_week_day.style = "width: 174.183px; cursor: pointer;";
table_thead_tr_th_week_day.innerText = "יום בשבוע";

let table_thead_tr_th_start_hour = document.createElement('th');
table_thead_tr_th_start_hour.style = "width: 212.85px; cursor: pointer;";
table_thead_tr_th_start_hour.innerText = "שעת התחלה";

let table_thead_tr_th_end_hour = document.createElement('th');
table_thead_tr_th_end_hour.style = "width: 170.9px; cursor: pointer;";
table_thead_tr_th_end_hour.innerText = "שעת סיום";

let table_thead_tr_th_lecturer = document.createElement('th');
table_thead_tr_th_lecturer.style = "width: 300.283px; cursor: pointer;";
table_thead_tr_th_lecturer.innerText = "מרצה";

let table_thead_tr_th_status = document.createElement('th');
table_thead_tr_th_status.style = "width: 224.517px; cursor: pointer;";
table_thead_tr_th_status.innerText = "סטטוס";


table_thead_tr.appendChild(table_thead_tr_th_course);
table_thead_tr.appendChild(table_thead_tr_th_type);
table_thead_tr.appendChild(table_thead_tr_th_week_day);
table_thead_tr.appendChild(table_thead_tr_th_start_hour);
table_thead_tr.appendChild(table_thead_tr_th_end_hour);
table_thead_tr.appendChild(table_thead_tr_th_lecturer);
table_thead_tr.appendChild(table_thead_tr_th_status);



table_thead.appendChild(table_thead_tr);

let table_tbody = document.createElement('tbody');

result_table_main.appendChild(table_thead);
result_table_main.appendChild(table_tbody);

result_table_header_col.appendChild(result_table_main);
result_table_header.appendChild(result_table_header_col);

result_table_box.appendChild(result_table_header);




/////



//// append kids //

result_box_table_main.appendChild(result_box_not_in_use)
result_box_table_main.appendChild(result_table_box)

result_box_main.appendChild(result_box_table_main)

table_main_main.appendChild(result_box_main)





const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
  v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
)(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
  const table = th.closest('table');
  const tbody = table.querySelector('tbody');
  Array.from(tbody.querySelectorAll('tr'))
    .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
    .forEach(tr => tbody.appendChild(tr));
})));

function createRow(row_data) {
  let tr = document.createElement('tr');
  tr.class = "TextAlignRight odd";

  let td_course = document.createElement('td');
  td_course.innerText = row_data.course;

  let td_type = document.createElement('td');
  td_type.innerText = row_data.type;

  let td_week_day = document.createElement('td');
  td_week_day.innerText = row_data.week_day;

  let td_start_hour = document.createElement('td');
  td_start_hour.innerText = row_data.start_hour;

  let td_end_hour = document.createElement('td');
  td_end_hour.innerText = row_data.end_hour;

  let td_lecturer = document.createElement('td');
  td_lecturer.innerText = row_data.lecturer;

  let td_status = document.createElement('td');
  td_status.innerText = row_data.status;

  if (row_data.status.indexOf("מלא") != -1) {
    td_status.style = "color: #BC243C; font-weight: bold;"
  }

  else {
    td_status.style = "color: #008000; font-weight: bold;"
  }

  tr.appendChild(td_course)
  tr.appendChild(td_type)
  tr.appendChild(td_week_day)
  tr.appendChild(td_start_hour)
  tr.appendChild(td_end_hour)
  tr.appendChild(td_lecturer)
  tr.appendChild(td_status)

  return tr;
}

const parseExcel = (filename) => {
  const excelData = XLSX.readFile(filename);
  return Object.keys(excelData.Sheets).map(name => ({
    name,
    data: XLSX.utils.sheet_to_json(excelData.Sheets[name], { header: 1 }),
  }));
};


const handleFileAsync = async function (e) {
  const file = e.target.files[0];
  const data = await file.arrayBuffer();
  const result = parseExcel(data);
  const courseData = result[0].data;
  empty(Courses_Ids)
  for (let i = 0; i < courseData.length; i++) {
    for (let j = 0; j < courseData[i].length; j++) {
      if (typeof (courseData[i][j]) === 'number') {
        if (Courses_Ids.indexOf(courseData[i][j]) === -1) {
          Courses_Ids.push(courseData[i][j]);
        }
      }
    }
  }
}
const empty = arr => arr.length = 0;



form_group_excel_input.addEventListener("change", handleFileAsync, false);


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

function getCourseName(course) {
  return $.ajax({
    url: "https://info.braude.ac.il/yedion/fireflyweb.aspx",
    type: "POST",
    data: {
      PRGNAME: "PublicData",
      ARGUMENTS: "subject_code",
      subject_code: course,
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
  let year = new Date().getFullYear() + 1;

  for (year = year; year > 2013; year--) {
    array.push(year);
  }
  return array;
}

function selectDefultSemster() {
  let month = new Date().getMonth() + 1;
  if (month >= 8 || month <= 10) {
    document.getElementById("mySelect_Semster").value = "1";
    document.getElementById("mySelect_Semster").text = "חורף";

  }
  if (month >= 2 && month <= 3) {
    document.getElementById("mySelect_Semster").value = "2";
    document.getElementById("mySelect_Semster").text = "אביב";

  }
}


function makePromisesArray(Promises, array, func) {
  for (var i = 0; i < array.length; i++) {
    Promises.push(func(array[i]));
  }
}

function GetCourseData(Course_Name, Course_Data) {

  let tempDom = $("<output>").append(Course_Data);

  let courseTable = $(".card.g-brd-primary.rounded-0", tempDom);
  courseTable = (Array.from(courseTable))

  courseTable = courseTable.filter(card => {
    return card.innerText.includes("מערכת שעות")
  })
  const courseTrs = courseTable.map(elem => {
    return $(elem).find('tr.TextAlignRight')
  });


  let courseList = $(".text.TextAlignRight", tempDom);
  for (let i = 0; i < courseList.length - 1; i++) {
    let Course_Type = courseList[i].firstChild.textContent.trim();
    let Course_Status = "";
    Course_Type = (Course_Type.split(" "))[2]

    if (courseList[i].innerHTML.indexOf("מלא") != -1) {
      Course_Status = "מלא";
    }
    else {
      Course_Status = "פנוי";
    }

    if (courseList[i].innerHTML.indexOf("המתנה") != -1) {
      Course_Status = "מלא - רשימת המתנה";
    }

    for (let j = 0; j < courseTrs[i].length; j++) {
      let Course_Obj = BuildCourseObj(courseTrs[i][j].children, Course_Name, Course_Type, Course_Status);
      Courses_data.push(Course_Obj);
    }
  }
}

function BuildCourseObj(Course_TR, Course_Name, Course_Type, Course_Status) {
  let Course_Obj = { course: Course_Name, type: Course_Type, week_day: Course_TR[1].innerText, start_hour: Course_TR[2].innerText, end_hour: Course_TR[3].innerText, lecturer: Course_TR[4].innerText, status: Course_Status }
  return Course_Obj;
}


$("#GetRegStatus").on("click", function () {
  year = $("#mySelect_year").val();
  semster = $("#mySelect_Semster").val();

  Courses_data = [];
  Courses_Promises_Name = [];
  Courses_Promises_Data = [];

  getYearPromise(year).then(() => {
    getSemsterPromise(semster).then(() => {
      makePromisesArray(Courses_Promises_Name, Courses_Ids, getCourseName);
      Promise.all(Courses_Promises_Name).then((values) => {
        for (let i = 0; i < Courses_Ids.length; i++) {
          Courses_Map.set(Courses_Ids[i], (JSON.parse(values[i])).val);
        }

        makePromisesArray(Courses_Promises_Data, Courses_Ids, getCoursePromise);
        Promise.all(Courses_Promises_Data).then((values) => {
          for (let i = 0; i < Courses_Ids.length; i++) {
            let Course_Name = Courses_Map.get(Courses_Ids[i]);
            let Course_Data_HTML = $.parseHTML(values[i]);
            GetCourseData(Course_Name, Course_Data_HTML);
          }
          let rows = [];
          for (let i = 0; i < Courses_data.length; i++) {
            rows.push(createRow(Courses_data[i]));
          }

          table_tbody.innerHTML = '';
          for (let i = 0; i < rows.length; i++) {
            table_tbody.append(rows[i]);
          }
        });
      });
      /////
    });
  });
});
