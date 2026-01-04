/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
// ==UserScript==
// @name         UBC course solver
// @namespace    https://courses.students.ubc.ca/
// @version      1.0
// @description  opitimise choosing your courses
// @author       kemkemG0
// @match        https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=sectsearch*
// @match        https://courses.students.ubc.ca/cs/courseschedule
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448014/UBC%20course%20solver.user.js
// @updateURL https://update.greasyfork.org/scripts/448014/UBC%20course%20solver.meta.js
// ==/UserScript==

const GROUPED_DATA_KEY = 'groupedData';
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const G_results = [];
let G_mxNum = 0;
let errorMsg = '';

const getAddedCoursesRow = () => {
  const rows = $('table.section-summary tbody tr');
  return [...Array(rows.length)]
    .map((_, ind) => {
      const row = rows.eq(ind).children();
      return {
        groupName: row.find("input[type='text']").val(),
        courseName: row.eq(2).text(),
        term: Number(row.eq(4).text()),
        days: [0, 1, 2, 3, 4, 5, 6].filter((__, i) => row.eq(7).text().includes(WEEK_DAYS[i])),
        start: row.eq(8).text().split(':').join(''),
        end: row.eq(9).text().split(':').join(''),
      };
    })
    .filter((val) => val.groupName !== '');
};

const getItem = () => {
  const item = localStorage.getItem(GROUPED_DATA_KEY);
  if (item === null || item === '') return {};
  const data = JSON.parse(item);
  Object.keys(data).forEach((group) => {
    data[group].forEach((course, ind) => {
      const {
        start, end, term, ...others
      } = course;
      data[group][ind] = {
        ...others, term: parseInt(term, 10), start: parseInt(start, 10), end: parseInt(end, 10),
      };
    });
  });
  return data;
};

const setItem = (data) => {
  const copied = { ...data };
  Object.keys(data).forEach((groupName) => {
    if (data[groupName].length === 0) delete copied[groupName];
  });
  localStorage.setItem(GROUPED_DATA_KEY, JSON.stringify(copied));
};

const deleteCourse = (id) => {
  // delete this from localstorage and rerender "Chosen Courses"
  const newId = id.replace('delete-', 'selected-');
  const groupName = $(`#${newId}`).parents('div')[0].id.replace('group-', '');
  const storedData = getItem();
  storedData[groupName] = storedData[groupName].filter((course) => course.courseName.replaceAll(' ', '') !== id.replace('delete-', ''));
  setItem(storedData);
  renderChosenCourses();
};

const onUpdate = () => {
  const savedData = getItem();
  // note: courseName is unique
  getAddedCoursesRow().forEach((newCourse) => {
    Object.keys(savedData).forEach((savedGroupName) => {
      savedData[savedGroupName] = savedData[savedGroupName].filter((savedCourse) => savedCourse.courseName !== newCourse.courseName);
    });
    if (savedData[newCourse.groupName] === undefined) savedData[newCourse.groupName] = [];
    const { groupName, ...others } = newCourse;
    savedData[groupName].push(others);
  });
  Object.keys(savedData).forEach((groupName) => {
    if (savedData[groupName].length === 0) delete savedData[groupName];
  });
  setItem(savedData);
  renderChosenCourses();
};

const onClear = () => {
  setItem({});
  render();
};

const onCreate = () => {
  // time is from 00:00 to 24:00
  // 0000 to 2460
  // ready array timetable[3][5][2460]:=[term][day][time]
  const test = [0, 1, 2].map(() => [...Array(5)].map(() => []));
  const savedData = getItem();
  const groupNameList = Object.keys(savedData);
  const tempSelected = {};
  let depth = 0;

  const canChoose = (lists, startEnd) => {
    const s = startEnd[0];
    const e = startEnd[1];
    let res = true;
    // (s,e,x,x) or (x,x,s,e) is ok
    // otherwise no
    lists.forEach((t) => {
      if (!((e <= t[0]) || (t[1] <= s))) { res = false; }
    });
    return res;
  };
  const dfs = (currentGroupInd = 0) => {
    depth += 1;
    if (currentGroupInd === groupNameList.length) {
      const res = Object.keys(tempSelected).map((key) => tempSelected[key]);
      G_mxNum = Math.max(G_mxNum, res.length);
      if (G_mxNum <= res.length)G_results.push(res);
      return;
    }

    if (depth >= 1000000) return;
    savedData[groupNameList[currentGroupInd]].forEach((course) => {
      const {
        start, end, term, courseName, days,
      } = course;
      // WITH using "course"
      // deciede which course to use
      // Euler Tour(modify => recursion => fix)
      // for stop dfs if not possible
      let isContinue = true;
      days.forEach((day) => {
        if (!canChoose(test[term][day], [start, end])) isContinue = false;
        if (!isContinue) return;
        test[term][day].push([start, end]);
      });
      if (!isContinue) return;

      tempSelected[courseName] = { ...course };
      dfs(currentGroupInd + 1);
      delete tempSelected[courseName];
      days.forEach((day) => {
        test[term][day].forEach((_, index) => {
          if (test[term][day][index][0] === start && test[term][day][index][1] === end) { test[term][day].splice(index, 1); }
        });
      });
      // WITHOUT using "course"
      dfs(currentGroupInd + 1);
    });
  };
  G_results.length = 0;
  dfs();
  const maxSelected = G_results.reduce((sum, e) => Math.max(sum, e.length), 0);
  const temp = [...G_results.filter((e) => e.length === maxSelected)];
  G_results.length = 0;
  G_results.push(...temp);

  if (G_results.length !== 0 && G_results[0].length !== groupNameList.length) errorMsg = 'Combination that allows you to take all types of classes was not found.<br>The combinations with the maximum number of classes will be displayed on the timetable.';
  else errorMsg = '';

  renderTable();
  renderScheduledCourses();
};

const getTimeTableNumber = () => parseInt($('#suggest-timetable').attr('data-combi'), 10);

const buttonsOnClickListener = () => {
  document.getElementById('group-name-update').addEventListener('click', onUpdate);
  document.getElementById('create-timetable').addEventListener('click', onCreate);
  document.getElementById('clear-chosen-courses').addEventListener('click', onClear);
  $('body').on('click', '.course-accordion-delete-button', (e) => { deleteCourse(e.target.id); });
  document.getElementById('prev-table').addEventListener('click', () => {
    const current = getTimeTableNumber();
    $('#suggest-timetable').attr('data-combi', Math.max(0, current - 1));

    renderTable();
    renderScheduledCourses();
  });
  document.getElementById('next-table').addEventListener('click', () => {
    const current = getTimeTableNumber();
    $('#suggest-timetable').attr('data-combi', Math.min(G_results.length - 1, current + 1));

    renderTable();
    renderScheduledCourses();
  });
};

/*
 * It goes : TERM-TIMESLOT-DAY (e.g. t1-2-0 ,t1-3-0, t1-2-2, t1-3-2, t1-2-4, t1-3-4 where
 * t1-2-0 would be be term 1 - 8:00  (0 is 700, 1 is 730) - Monday (0 is Monday, 1 is Tuesday, etc))
*/
const TIME_SLOT_LIST = [700, 730, 800, 830, 900, 930, 1000, 1030, 1100, 1130, 1200, 1230, 1300, 1330, 1400, 1430, 1500, 1530, 1600, 1630, 1700, 1730, 1800, 1830, 1900, 1930, 2000, 2030];
const time2timeSlot = (time) => TIME_SLOT_LIST.indexOf(time);

const createBaseTable = (term) => {
  let html = `<table><tbody">
    <tr>
      <td class="tt-header-mini">&nbsp;</td>
      <td class="tt-header-mini">Mon</td>
      <td class="tt-header-mini">Tue</td>
      <td class="tt-header-mini">Wed</td>
      <td class="tt-header-mini">Thu</td>
      <td class="tt-header-mini">Fri&nbsp;&nbsp;</td>
    </tr><tr></tr>`;
  TIME_SLOT_LIST.forEach((time, timeSlot) => {
    html += `<tr><td align="center" class="tt-header-mini">${time}</td>`;
    [0, 1, 2, 3, 4].forEach((day) => { html += `<td class="tt-notime-mini" id="new-t${term}-${timeSlot}-${day}">&nbsp;</td>`; });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
};

const clearTimeTable = () => {
  $('#comb-not-found').empty();
  $('#comb-not-found').append('');
  // change every class to notime
  TIME_SLOT_LIST.forEach((time, timeSlot) => {
    [1, 2].forEach((term) => {
      [0, 1, 2, 3, 4].forEach((day) => {
        const id = `new-t${term}-${timeSlot}-${day}`;
        $(`#${id}`).attr('class', 'tt-notime-mini');
      });
    });
  });
};

const editTimeTable = () => {
  const tableNum = getTimeTableNumber();
  const dynamicText = G_results.length !== 0 ? `${tableNum + 1}/${G_results.length}` : '';
  $('#time-table-title').text(`TimeTable  ${dynamicText}`);
  $('#comb-not-found').empty();
  $('#comb-not-found').append(errorMsg);
  const bgColors = ['jp-orange', 'jp-blue', 'jp-green', 'jp-pink', 'jp-purple', 'jp-gold'];
  G_results[tableNum]?.forEach((course, cind) => {
    course.days.forEach((day) => {
      TIME_SLOT_LIST.forEach((time) => {
        if (course.start <= time && time < course.end) {
          const id = `new-t${course.term}-${time2timeSlot(time)}-${day}`;
          $(`#${id}`).attr('class', `${bgColors[cind % 6]} selected-course-on-table`);
          $(`#${id}`).attr('data-hover', course.courseName);
        }
      });
    });
  });
};

const renderTable = () => {
  clearTimeTable();
  editTimeTable();
};

const renderScheduledCourses = () => {
  let html = '';
  $('#time-schedule-list').empty();
  if (G_results.length === 0) return;
  html += '<h4>Selected Courses</h4>';
  html += '<table class="table table-striped"><tbody>';
  G_results[getTimeTableNumber()]?.forEach((course, ind) => {
    html += `<tr class="section${(ind % 2) + 1}"><td>${course.courseName}<td></tr>`;
  });
  html += '</tbody></table>';
  $('#time-schedule-list').append(html);
};

const renderChosenCourses = () => {
  $('#chosen-courses').empty();
  const savedData = getItem();
  if (JSON.stringify(savedData) === '{}') return;
  Object.keys(savedData).forEach((groupName) => {
    const courseList = savedData[groupName];
    const createAccordion = () => {
      let res = `<details><summary><strong>${groupName} :      ${courseList.length} selected</strong></summary>`;
      res += '<ul>';
      courseList.forEach((course) => {
        res += `<li id="selected-${course.courseName.replaceAll(' ', '')}">${course.courseName} <input type="button" value="delete" class="course-accordion-delete-button btn-danger" id="delete-${course.courseName.replaceAll(' ', '')}" ></li>`;
      });
      res += '</ul>';
      res += '</details>';
      return res;
    };
    $('#chosen-courses').append(`
    <div id="group-${groupName}">
        ${createAccordion()}
        </details>
    </div>
`);
  });
};

const render = () => {
  renderChosenCourses();
  renderTable();
};

const addGlobalCSS = () => {
  const res = `
  <style>
  div #suggest-timetable table tr td table{
    font-size: 10px;
    line-height: 100%;
    border-collapse: separate !important;
    border-spacing: 2px !important;
    margin: 0;
    padding: 0;
  }
  #suggest-timetable h6, #chosen-courses-area h3 {
    margin: 0;
    padding: 0;
}

  .selected-course-on-table:before{
    content: attr(data-hover);
    visibility: hidden;
    opacity: 0;
    width: 140px;
    background-color: midnightblue;
    color: white;
    text-align: center;
    font-size:14px;
    padding: 2px 0;
    transition: opacity 0.3s ease-in-out;
    transform:translate(20px,-20px);
    position: absolute;
    z-index: 10;
  }
  .selected-course-on-table:hover:before {
    opacity: 1;
    visibility: visible;
  }
  
  .jp-orange{background:#ee827c}
  .jp-blue{background:#44617b}
  .jp-green{background:#00a497}
  .jp-pink{background:#bc64a4}
  .jp-purple{background:#745399}
  .jp-gold{background:#e6b422}

  </style>
  `;
  $('head').prepend(res);
};

const createElements = () => {
  addGlobalCSS();
  const INPUT_AREA = '<input type="text" style="max-width:80px; max-height:10px;"></input>';
  $('thead tr').prepend(`
      <th>
          <div><button type="button" class="btn btn-warning" id="group-name-update">&nbsp;&nbsp;Add&nbsp;&nbsp;</button></div>
          Group Name
      </th>`);
  $('table.section-summary tbody tr').prepend(`<td>${INPUT_AREA}</td>`);
  // create #chosen-courses-area
  $('form[name="sect_srch_criteria_simp_search"]').after(
    `
    <hr />
    <h3>Course Solver</h3>
    <div id="comb-not-found" style="color:red;margin:10px;"></div>
    <div style="display: flex; justify-content: center">
      <div style="margin: auto 0" id="chosen-courses-area">
        <h4 style="margin: 1px">Added Courses</h4>
        <div id="chosen-courses"></div>
        <div id="create-clear-buttons">
          <button type="button" class="btn btn-success" id="create-timetable">
            CREATE
          </button>
          <button type="button" class="btn btn-danger" id="clear-chosen-courses">
            CLEAR
          </button>
        </div>
      </div>
      <div id="suggest-timetable" style="display:flex" data-combi=0>
      <a style="display:block; font-size:20px; margin:20px;text-decoration: none;" href="javascript:void(0)" id="prev-table"><<</a>
        <table cellspacing="0" cellpadding="0" border="1">
          <tbody>
            <tr>
              <td class="tt-legend"><h6 id="time-table-title">Timetable</h6></td>
            </tr>
            <tr>
              <td>
                <table cellpadding="0" border="0" cellspacing="2">
                  <tbody>
                    <tr>
                      <td align="center"><h6>Term 1</h6></td>
                      <td align="center"><h6>Term 2</h6></td>
                    </tr>
                    <tr>
                      <td valign="top">
                        ${createBaseTable(1)}
                        <!---->
                      </td>
                      <td valign="top">
                        ${createBaseTable(2)}
                        <!---->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <a style="display:block; font-size:20px; margin:20px;text-decoration: none;" href="javascript:void(0)" id="next-table">>></a>
      </div>
      <div id="time-schedule-list" style="margin:auto 0"></div>
    </div>
    <hr />
      `,
  );
};

const main = async () => {
  createElements();
  render();
  buttonsOnClickListener();
};

main();
