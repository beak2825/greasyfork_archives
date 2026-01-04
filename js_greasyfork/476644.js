// ==UserScript==
// @name         Blackboard To-Do List
// @namespace    http://yourwebsite.com
// @version      1.1
// @license MIT
// @description  Create a To-Do List for Blackboard that shows upcoming assignments, grades, submitted status
// @author       Your Name
// @match        https://ccccblackboard.blackboard.com/ultra/course*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476644/Blackboard%20To-Do%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/476644/Blackboard%20To-Do%20List.meta.js
// ==/UserScript==

console.log('%cLoaded Brad\'s To Do List!', 'color: yellow; font-weight: bold;font-size:400%;');
function createMenu() {
    const toDoList = document.getElementById('toDoList');
    if (!toDoList) {
        const courseColumnsCurrent = document.getElementById('course-columns-current');
        courseColumnsCurrent.style.width = '75%';

        // Create a new 'toDoList' div
        const newToDoList = document.createElement('div');
        newToDoList.id = 'toDoList';
        courseColumnsCurrent.insertBefore(newToDoList, courseColumnsCurrent.firstChild);
    }

    const tdl = document.getElementById('toDoList');
    tdl.style.cssText = 'position:absolute;left:79%;top:20%;background:white;border-radius:4px;border:1px solid #cdcdcd;width:4%;height:70%;padding: 5px;overflow-y:scroll;overflow-x:hidden;';
}

async function fetchAssignments() {
    const startSearchDate = new Date().toISOString();
    const endSearchDate = new Date();
    endSearchDate.setDate(endSearchDate.getDate() + 7);
    const endSearchDateISO = endSearchDate.toISOString();

    const response = await fetch(`https://ccccblackboard.blackboard.com/learn/api/v1/calendars/calendarItems?since=${startSearchDate}&until=${endSearchDateISO}`);
    const json = await response.json();
    return json.results.map(e => ({
        class: {
            id: e.calendarId,
            name: e.calendarNameLocalizable.rawValue,
            link: `https://ccccblackboard.blackboard.com/ultra/courses/${e.calendarId}/cl/outline`
        },
        assignmentName: e.title,
        assignmentId: e.itemSourceId,
        assignmentLink: `https://ccccblackboard.blackboard.com/ultra/courses/${e.calendarId}/cl/outline?legacyUrl=~2Fwebapps~2Fcalendar~2Flaunch~2Fattempt~2F_blackboard.platform.gradebook2.GradableItem-${e.itemSourceId}`,
        assignmnetCategoryId: e.dynamicCalendarItemProps.categoryId,
        dueDate: new Date(e.endDate),
        assignedDate: new Date(e.startDate)
    }));
}

async function renderToDoList(assignments) {
    const tdl = document.getElementById('toDoList');
    tdl.innerHTML = `<h1 style='font-family: Open Sans,sans-serif;text-align:center;font-weight:600;'>To Do List</h1>`;


    tdl.innerHTML += "<img id='reloadTDL' style='cursor:pointer;position:absolute;top:3%;' src='https://learn.content.blackboardcdn.com/3900.74.0-rel.32+80961aa/images/ci/ng/small_refresh.gif'/>"

    if(localStorage.completedAssignments?.length==0) {
        localStorage.completedAssignments=JSON.stringify([]);
    }
    tdl.innerHTML+=`<h4>Complete Now</h4>`

    let addedTomorrowSpacer = false;
    for(const assignment of assignments) {
      const className = assignment.class.name.split("_")[0];
      const assName = assignment.assignmentName;
      const linkToClass = assignment.assignmentLink;
      let checked = localStorage.completedAssignments.includes(assName)
      const dueTommorrow = (assignment.dueDate - new Date()) / 1000 / 60 / 60 > 24;
      const grade = await getAssignmentGrade(assignment.class.id, assignment.assignmentId);
      const submitted = grade.toString().includes("Submitted");
      if(!checked && submitted) {
        checked = true;
      }

      if (!addedTomorrowSpacer && dueTommorrow) {
          const tomorrowSpacer = document.createElement('h4');
          tomorrowSpacer.textContent = 'Start Today, Complete Tomorrow';
          tdl.appendChild(tomorrowSpacer);
          addedTomorrowSpacer = true;
      }


      const assignmentBox = document.createElement('div');
      assignmentBox.classList.add('assignmentBox');
      assignmentBox.style.outline = '1px solid #cdcdcd';
      assignmentBox.style.width='98%'
      assignmentBox.style.margin = '8px';
      assignmentBox.style.borderRadius = '3px';
      assignmentBox.style.padding = '3px';
      assignmentBox.style.background="rgb(250,250,250)";

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = assName;
      checkbox.value = 'test';
      assignmentBox.appendChild(checkbox);

      const label = document.createElement('label');
      label.htmlFor = assName;
      label.style.maxWidth='90%'

      const anchor = document.createElement('a');
      anchor.href = linkToClass;
      anchor.textContent = assName;

      label.appendChild(anchor);
      assignmentBox.appendChild(label);

      const detailsSpan = document.createElement('span');
      detailsSpan.style.color = 'gray';
      detailsSpan.style.fontSize = '90%';
      detailsSpan.innerHTML = `<br>Due ${formatDateTime(assignment.dueDate)} | ${className} ${grade}`;
      assignmentBox.appendChild(detailsSpan);

      tdl.appendChild(assignmentBox);

      checkbox.checked = checked;
      checkbox.oninput = () => {
          let completed = JSON.parse(localStorage.completedAssignments);

          if (checkbox.checked) {
              completed.push(assName)
          } else {
              completed.splice(completed.indexOf(assName), 1)
          }

          localStorage.completedAssignments = JSON.stringify(completed);
      }
      document.getElementById('reloadTDL').onclick = ()=>{
        main();
      }
  }
}

function formatDateTime(date) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const hours = date.getHours()%12;
    const minutes = date.getMinutes();

    let formattedDate;

    if (date.toDateString() === now.toDateString()) {
        formattedDate = "";
    } else if (date.toDateString() === tomorrow.toDateString()) {
        formattedDate = "tmrw";
    } else {
        const options = { month: "long", day: "numeric" };
        formattedDate = date.toLocaleDateString(undefined, options);
    }

    const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${formattedDate} at <span style='font-weight:600;'>${formattedTime} ${ampm}</span>   ${calculateTimeDifference(now,date)}`;
}

function calculateTimeDifference(startDate, endDate) {
    const timeDifferenceMs = endDate - startDate;
    const hoursDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
    const minutesDifference = Math.floor((timeDifferenceMs / 60000) % 60);

    return hoursDifference >= 8 ? '' : `(${hoursDifference || minutesDifference} ${hoursDifference ? 'hrs' : 'min'})`;
}
const badgeCss = 'position:absolute;right:2%;display: inline-block;width:74px;text-align:center;border-radius:5px;padding:2px;font-size:90%;'
async function getAssignmentGrade(classId, assId) {
    let ungraded = `<span style='${badgeCss}background:#d1d1d1;color:#555;'>Incomplete</span>`;
    let submittedText = `<span style='${badgeCss}background:#95deb0;color:black;'>Submitted</span>`;

    try {
        const response = await fetch(`https://ccccblackboard.blackboard.com/learn/api/v1/courses/${classId}/gradebook/grades?limit=100&userId=${window.__initialContext.user.id}`);
        const content = await response.json();
        const result = content.results.find(a => a.columnId === assId);
        return result ? doColorGrade(result.displayGrade.score) : ungraded;
    } catch (e) {
        try{
          const response = await fetch(`https://ccccblackboard.blackboard.com/webapps/calendar/launch/attempt/_blackboard.platform.gradebook2.GradableItem-${assId}`);
          const content = await response.text();
          const submitted = content.includes("Review Submission History");
          return submitted ? submittedText : ungraded;
        } catch(a) {
          return ungraded;
        }
    }
}
function doColorGrade(grade) {
  let color = "#ff3b30";
  if(grade>=90) color="#39e379";
  else if(grade>=80) color="#cdee4b";
  else if(grade>=70) color='#ffe300';
  else if(grade>=60) color='#ff9600';

  return `<span style='${badgeCss}background:${color};color:#000;'>${grade.toFixed(2)+"%"}</span>`;
}
let loadedMenu = false;
setInterval(()=>{
  if(document.getElementsByClassName('element-details summary').length<1 || location.href!="https://ccccblackboard.blackboard.com/ultra/course") {
    loadedMenu = false;
    return;
  }

  if(location.href=="https://ccccblackboard.blackboard.com/ultra/course" && !loadedMenu) {
    loadedMenu = true;
    main();
  }
},100)

async function main() {
    createMenu();
    const assignments = await fetchAssignments();

    const sortedAssignments = assignments.filter(assignment => {
        const hours = (assignment.dueDate - new Date()) / 1000 / 60 / 60;
        return hours < 48 && hours > 0;
    }).sort((a, b) => (a.dueDate - b.dueDate) / 1000 / 60 / 60);

    renderToDoList(sortedAssignments);
}
