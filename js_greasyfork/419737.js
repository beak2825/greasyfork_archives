// ==UserScript==
// @name         Canvas All Info
// @namespace    https://theusaf.github.io
// @version      1.4.0
// @icon         https://canvas.instructure.com/favicon.ico
// @copyright    2020-2021, Daniel Lau
// @license      MIT
// @description  Place all information on a single page (https://canvas.example.com/all or https://example.instructure.com/all)
// @author       theusaf
// @include      /^https:\/\/canvas\.[a-z0-9]*?\.[a-z]*?\/all\/?(\?.*)?$/
// @include      /^https:\/\/[a-z0-9]*?\.instructure\.com\/all\/?(\?.*)?$/
// @inject-into  page
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419737/Canvas%20All%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/419737/Canvas%20All%20Info.meta.js
// ==/UserScript==

/*
  Note:
  - This userscript uses public APIs accessed by canvas
    - Gets class information
    - Gets assignments
    - Gets basic teacher information
  - This userscript does not store or upload any information gathered by the script
  - This userscript overwrites /all in canvas
  - This userscript was originally developed for Oregon State University
*/

/* Useful Links (for use later?)
/api/v1/conversations?scope=inbox&filter_mode=and&include_private_conversation_enrollments=false
- Canvas mail
/api/v1/conversations/(mailbox_id)?include_participant_contexts=false&include_private_conversation_enrollments=false
- Specific mail
/courses/(class_id)/modules/items/assignment_info
- Module items
*/

/**
 * log - logs info to console
 * @param {*} str
 * @param  {...any} data
 */
const log = (str, ...data) => {
  if (data.length > 0) {
    console.log(`[CANVAS-ALL] ${str}`, data);
  }
  console.log(`[CANVAS-ALL] ${str}`);
};

/**
 * load - Loads everything
 */
async function load() {
  document.title = "Dashboard - All";

  /**
   * mainElement - the main application div
   * iFrameLoader - The div for loading iframes for getting data
   * styles - A style element
   */
  const mainElement = document.getElementById("main"),
    iFrameLoader = document.createElement("div");
  mainElement.innerHTML = `<style>
    #canvas-all-iframe-loader{
      visibility: hidden;
      position: fixed;
      width: 100%;
      height: 100%;
      pointer-events: none;
      left: 0;
    }
    #canvas-all-iframe-loader > iframe{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    #main{
      display: flex;
      flex-flow: column;
      padding: 1rem;
    }
    #main>span{
      flex: 0;
      margin-bottom: 1rem;
    }
    #main>div{
      flex: 1;
    }
    #canvasall_main_wrapper{
      display: flex;
    }
    #canvasall_main_wrapper>div{
      flex: 75%;
    }
    #canvasall_class_grades{
      display: flex;
      flex-flow: column;
      background: #fff5e0;
      padding: 0.5rem;
      border-radius: 0.5rem;
    }
    #canvasall_assignments_wrapper{
      padding: 0.5rem;
      background: #fff5e0;
      border-radius: 0.5rem;
    }
    #canvasall_main_wrapper>#canvasall_announcement_wrapper{
      flex: 25%;
      padding: 0.5rem;
    }
    #canvasall_assignment_filter_list_chosen{
      display: inline-block;
    }
    #canvasall_assignment_filter_list_chosen>option{
      display: inline-block;
      background: grey;
      color: white;
      padding: 0.25rem;
      margin: 0.25rem;
      cursor: pointer;
    }
    #canvasall_assignment_filter_list_chosen>option::before{
      content: "x ";
    }
    .canvasall_announcement_wrapper{
      margin-bottom: 0.5rem;
      padding: 0.5rem;
      border-radius: 0.5rem;
    }
    .canvasall_announcement_wrapper:nth-child(2n+1){
      background: #fff5e0;
    }
    .canvasall_announcement_wrapper:nth-child(2n){
      background: #ddd;
    }
    .canvasall_announcement_title{
      font-size: 1.25rem;
      font-weight: bold;
    }
    .canvasall_announcement_class,
    .canvasall_announcement_when{
      font-size: 0.75rem;
    }
    .canvasall_announcement_class>a{
      color: grey;
    }
    .canvasall_class_grade_wrapper:nth-child(2n+1){
      background: white;
    }
    .canvasall_class_grade_wrapper:nth-child(2n){
      background: #eee;
    }
    .canvasall_class_grade_wrapper{
      flex: 1;
      display: flex;
      border-radius: 0.5rem;
    }
    .canvasall_class_grade_wrapper>div{
      flex: 1;
      padding: 0.5rem;
      word-break: break-all;
    }
    .canvasall_assignment_wrapper:nth-child(2n+1){
      background: rgba(255,255,255,0.8);
    }
    .canvasall_assignment_wrapper:nth-child(2n){
      background: rgba(255,255,255,0.4);
    }
    .canvasall_assignment_wrapper{
      display: flex;
      padding: 0.5rem;
      border-radius: 0.5rem;
    }
    .canvasall_assignment_wrapper>div{
      flex: 1;
      padding-right: 0.25rem;
      padding-left: 0.25rem;
    }
    .canvasall_assignment_title{
      display: flex;
      align-items: center;
    }
    .canvasall_assignment_title>img{
      height: 1.5rem;
      width: 1.5rem;
      margin-right: 0.5rem;
    }
    .canvasall_assignment_icon {
      min-height: 1.5rem;
      min-width: 1.5rem;
      margin-right: 0.5rem;
    }
    .canvasall_assignment_type_assignment:before {
      content: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDI4MCAyNTkiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI4MCAyNTkiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGQ9Ik03My4zMSwxOThjLTExLjkzLDAtMjIuMjIsOC0yNCwxOC43M2EyNi42NywyNi42NywwLDAsMC0uMywzLjYzdi4zYTIyLDIyLDAsMCwwLDUuNDQsMTQuNjUsMjIuNDcsMjIuNDcsMCwwLDAsMTcuMjIsOEgyMDBWMjI4LjE5aC0xMzRWMjEzLjA4SDIwMFYxOThabTIxLTEwNS43NGg5MC42NFY2Mkg5NC4zWk03OS4xOSwxMDcuMzRWNDYuOTJIMjAwdjYwLjQyWm03LjU1LDMwLjIxVjEyMi40NUgxOTIuNDl2MTUuMTFaTTcxLjY1LDE2LjcxQTIyLjcyLDIyLjcyLDAsMCwwLDQ5LDM5LjM2VjE5MC44OGE0MS4xMiw0MS4xMiwwLDAsMSwyNC4zMi04aDE1N1YxNi43MVpNMzMuODgsMzkuMzZBMzcuNzgsMzcuNzgsMCwwLDEsNzEuNjUsMS42SDI0NS4zNlYxOThIMjE1LjE1djQ1LjMyaDIyLjY2VjI1OC40SDcxLjY1YTM3Ljg1LDM3Ljg1LDAsMCwxLTM3Ljc2LTM3Ljc2WiI+PC9wYXRoPjwvc3ZnPgo=");
    }
    .canvasall_assignment_type_quiz:before {
      content: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDI4MCAyODAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI4MCAyODAiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGQ9Ik05MS43MiwxMjAuNzVoOTYuNTZWMTA0LjY1SDkxLjcyWm0wLDQ4LjI4aDgwLjQ3VjE1Mi45NEg5MS43MlptMC05Ni41Nmg4MC40N1Y1Ni4zN0g5MS43MlptMTYwLjk0LDM0Ljg4SDIyOC41MlYxMC43OGgtMTc3djk2LjU2SDI3LjM0QTI0LjE3LDI0LjE3LDAsMCwwLDMuMiwxMzEuNDhWMjQ0LjE0YTI0LjE3LDI0LjE3LDAsMCwwLDI0LjE0LDI0LjE0SDI1Mi42NmEyNC4xNywyNC4xNywwLDAsMCwyNC4xNC0yNC4xNFYxMzEuNDhBMjQuMTcsMjQuMTcsMCwwLDAsMjUyLjY2LDEwNy4zNFptMCwxNi4wOWE4LjA2LDguMDYsMCwwLDEsOCw4djUxLjc3bC0zMi4xOSwxOS4zMVYxMjMuNDRaTTY3LjU4LDIwMy45MXYtMTc3SDIxMi40MnYxNzdaTTI3LjM0LDEyMy40NEg1MS40OHY3OS4xM0wxOS4yOSwxODMuMjZWMTMxLjQ4QTguMDYsOC4wNiwwLDAsMSwyNy4zNCwxMjMuNDRaTTI1Mi42NiwyNTIuMTlIMjcuMzRhOC4wNiw4LjA2LDAsMCwxLTgtOFYyMDJsMzAsMThIMjMwLjc1bDMwLTE4djQyLjEyQTguMDYsOC4wNiwwLDAsMSwyNTIuNjYsMjUyLjE5WiI+PC9wYXRoPjwvc3ZnPgo=");
    }
    .canvasall_assignment_type_discussion_topic:before {
      content: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMWVtIiBoZWlnaHQ9IjFlbSIgcm90YXRlPSIwIiBzdHlsZT0iaGVpZ2h0OjFlbTt3aWR0aDoxZW0iIHZpZXdCb3g9IjAgMCAxOTIwIDE5MjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnPgo8cGF0aCBkPSJtNjc3LjY1IDE2djMzOC45NGgxMTIuOTR2LTIyNS44OGgxMDE2LjV2NzkwLjQ4aC0yMjZ2MjU5Ljc2bC0yNTkuNjUtMjU5Ljc2aC03OS4xNzJ2LTQ1MS42NWgtNTY0LjU5LTY3Ny42NXYxMDE2LjVoMzM4LjcxdjQxOC45bDQxOC00MTguOWg0ODUuNTN2LTQ1MS44OGgzMi43NTNsNDE5LjEyIDQxOS4xMnYtNDE5LjEyaDIyNS44OHYtMTAxNi41aC0xMjQyLjR6bS0zMzguODYgOTAzLjU2aDU2NC43MXYtMTEyLjk0aC01NjQuNzF2MTEyLjk0em0wIDIyNS44OGgzMzguOTR2LTExMy4wNWgtMzM4Ljk0djExMy4wNXptLTIyNS44NS01NjQuNzRoMTAxNi41djc5MC43aC00MTkuMDFsLTI1OC43NSAyNTkuNjV2LTI1OS42NWgtMzM4Ljcxdi03OTAuN3oiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8L2c+Cjwvc3ZnPgo=")
    }
    .canvasall_status_submit,
    .canvasall_status_submit a{
      color: green;
    }
    .canvasall_status_done{
      text-decoration: line-through;
    }
    .canvasall_status_late{
      background: orange !important;
      color: white;
    }
    .canvasall_status_late a{
      color: white;
    }
    .canvasall_status_missing{
      background: red !important;
      color: white;
    }
    .canvasall_status_missing a{
      color: white;
    }
    .canvasall_status_feedback>.canvasall_assignment_title::after{
      content: " (Feedback available)"
    }
  </style>
  <span id="canvasall_fetching_information">Fetching information... please wait...</span>
  <div id="canvasall_main_wrapper">
    <div>
      <div id="canvasall_class_wrapper">
        <!-- Courses, Grades, etc. -->
        <h3>Courses</h3>
        <div id="canvasall_class_grades">
          <div id="canvasall_class_grade_header" class="canvasall_class_grade_wrapper">
            <div><span>Class</span></div>
            <div><span>Grade</span></div>
            <div><span>Professor</span></div>
          </div>
        </div>
      </div>
      <h3>Current Assignments</h3>
      <div>
        <span>Filters:</span>
        <select id="canvasall_assignment_filter_status">
          <option value="">Select</option>
          <option value="submit">Hide Submitted</option>
          <option value="done">Hide Graded</option>
          <option value="late">Hide Late</option>
          <option value="missing">Hide Missing</option>
          <option value="quiz">Hide Quiz</option>
          <option value="assignment">Hide Assignment</option>
        </select>
        <div id="canvasall_assignment_filter_list_chosen">
        </div>
      </div>
      <div id="canvasall_assignments_wrapper">
        <div class="canvasall_assignment_wrapper">
          <div>
            <span>Assignment Name</span>
          </div>
          <div>
            <span>Class</span>
          </div>
          <div>
            <span>Due Date</span>
          </div>
        </div>
      </div>
    </div>
    <div id="canvasall_announcement_wrapper">
      <h3>Announcements</h3>
    </div>
  </div>`;
  iFrameLoader.id = "canvas-all-iframe-loader";
  mainElement.append(iFrameLoader);

  /**
   * courses - Class information
   * classAssignments - Assignments for courses
   * mainFrame - The main iframe
   * ENV - Global variables with useful data
   * currentUserID - The current user id
   */
  log("Getting courses");
  const courses = await getCourses(),
    courseAssignments = [],
    courseGrades = {},
    { ENV } = window,
    { currentUserID } = ENV,
    courseGradeDiv = mainElement.querySelector("#canvasall_class_grades"),
    assignmentsDiv = mainElement.querySelector("#canvasall_assignments_wrapper"),
    announcementsDiv = mainElement.querySelector(
      "#canvasall_announcement_wrapper"
    ),
    statusFilter = mainElement.querySelector(
      "#canvasall_assignment_filter_status"
    ),
    statusFilterList = mainElement.querySelector(
      "#canvasall_assignment_filter_list_chosen"
    ),
    localStorageConfigStr = localStorage.canvasAllConfig ?? "{}",
    localStorageConfig = JSON.parse(localStorageConfigStr);

  function hideType(value) {
    console.log(`Hiding '${value}'`);
    if (value === "") {
      // ignore reset to empty value
      console.log("Ignoring empty value");
      return;
    }
    const elem = statusFilter.querySelector(
        `option[value="${value}"]`
      ),
      temp = document.createElement("template"),
      now = `${Math.random()}`.substring(2);
    if (!elem) {
      console.error("Could not find element");
      return;
    }
    temp.innerHTML = `<style id="canvasall_filter_${now}">
      .canvasall_status_${value}{
        display: none;
      }
    </style>`;
    localStorageConfig[value] = true;
    localStorage.canvasAllConfig = JSON.stringify(localStorageConfig);
    setTimeout(() => {
      document.body.append(temp.content.cloneNode(true));
      statusFilterList.append(elem);
      elem.addEventListener("click", click);
      statusFilter.value = "";
    });
    function click() {
      localStorageConfig[value] = false;
      localStorage.canvasAllConfig = JSON.stringify(localStorageConfig);
      // remove style
      document.querySelector(`#canvasall_filter_${now}`).remove();
      elem.removeEventListener("click", click);
      setTimeout(() => {
        statusFilter.append(elem);
        statusFilter.value = "";
      });
    }
  }

  // Filters
  statusFilter.addEventListener("change", () => {
    hideType(statusFilter.value);
  });

  // Begin writing class information
  for (const [i, course] of Object.entries(courses)) {
    const template = document.createElement("template");
    template.innerHTML = `<div class="canvasall_class_grade_wrapper" canvasall-class-id="${
      course.id
    }">
      <div class="canvasall_class_grade_name">
        <span>${+i + 1}. <a href="/courses/${course.id}">${
      course.name
    }</a></span>
      </div>
      <div class="canvasall_class_grade_score">
        <span>(Loading scores...)</span>
      </div>
      <div class="canvasall_class_grade_instructor">
        <span>(Loading instructors...)</span>
      </div>
    </div>`;
    courseGradeDiv.append(template.content.cloneNode(true));
  }

  log("Getting course assignments and grades");
  let courseCount = 0,
    finishedCollections = 0;
  for (const course of courses) {
    courseCount++;
    getCourseAssignments(course.id, currentUserID).then(assignments => {
      courseAssignments.push.apply(
        courseAssignments,
        assignments
      );
      finishedCollections++;
      if (finishedCollections === courseCount) {
        // Write assignments
        courseAssignments.sort((a, b) => {
          // sort by "due date"
          // also places non-due-date at end. (+1 week)
          const dueA = new Date(
              a.plannable.due_at || b.plannable.created_at || Date.now() + 604800e3
            ),
            dueB = new Date(
              b.plannable.due_at || b.plannable.created_at || Date.now() + 604800e3
            );
          return dueA.getTime() - dueB.getTime();
        });

        log("Compiling assignments");
        for (const assignment of courseAssignments) {
          const template = document.createElement("template");
          if (assignment.plannable_type === "announcement") {
            // Put in announcement thing
            template.innerHTML = `<div class="canvasall_announcement_wrapper">
                <div class="canvasall_announcement_title">
                  <a href="${assignment.html_url}">${assignment.plannable.title}</a>
                </div>
                <div class="canvasall_announcement_class">
                  <a href="/courses/${assignment.course_id}">${
              assignment.context_name
            }</a>
                </div>
                <div class="canvasall_announcement_when">
                  <span>${new Date(assignment.plannable.created_at)
                    .toString()
                    .split(" ")
                    .slice(0, 5)
                    .join(" ")
                    .replace(/:\d{2}$/, "")
                    .replace(/\s(?=\w{3}\s\d{2})/, ", ")
                    .replace(/\d{4}/, "at")}</span>
                </div>
              </div>`;
            announcementsDiv.append(template.content.cloneNode(true));
            continue;
          }
          const divClasses = [],
            { submissions } = assignment;
          if (submissions) {
            const { excused, graded, has_feedback, late, missing, submitted } =
              submissions;
            if (excused || graded) {
              divClasses.push("canvasall_status_done");
            }
            if (submitted) {
              divClasses.push("canvasall_status_submit");
            }
            if (late) {
              divClasses.push("canvasall_status_late");
            }
            if (missing) {
              divClasses.push("canvasall_status_missing");
            }
            if (has_feedback) {
              divClasses.push("canvasall_status_feedback");
            }
          }

          divClasses.push("canvasall_status_" + assignment.plannable_type);
          template.innerHTML = `<div class="canvasall_assignment_wrapper ${divClasses.join(
            " "
          )}" class-id="${assignment.course_id}">
            <div class="canvasall_assignment_title">
              <div class="canvasall_assignment_icon canvasall_assignment_type_${
                assignment.plannable_type
              }"></div>
              <a href="${assignment.html_url}">${assignment.plannable.title}</a>
            </div>
            <div class="canvasall_assignment_class">
              <a href="/courses/${assignment.course_id}">${
            assignment.context_name
          }</a>
            </div>
            <div class="canvasall_assignment_due">
              <span>${
                assignment.plannable.due_at
                  ? new Date(assignment.plannable.due_at)
                      .toString()
                      .split(" ")
                      .slice(0, 5)
                      .join(" ")
                      .replace(/:\d{2}$/, "")
                      .replace(/\s(?=\w{3}\s\d{2})/, ", ")
                      .replace(/\d{4}/, "at")
                  : "No due date"
              }</span>
            </div>
          </div>`;
          assignmentsDiv.append(template.content.cloneNode(true));
        }

        // Restore hide
        for (const [key, value] of Object.entries(localStorageConfig)) {
          if (value && key !== "") {
            hideType(key);
          }
        }

        courseAssignments.splice(0); // Free up memory
        document.querySelector("#canvasall_fetching_information").outerHTML = "";
      }
    });
    // Get grades
    loadFrame(iFrameLoader, `/courses/${course.id}/grades`).then(
      (ClassGradeFrame) => {
        const { document: d, window: w, frame } = ClassGradeFrame;
        let overallGrade = d
            .querySelector(
              "#student-grades-right-content .student_assignment.final_grade > .grade"
            )
            ?.textContent?.replace(/%|\s/g, ""),
          titles = d.querySelectorAll(".title"),
          possiblePoints = d.querySelectorAll(".points_possible"),
          dueDates = d.querySelectorAll(".due");
        courseGrades[course.id] = {
          Grades: overallGrade + "%",
          Titles: titles,
          PossiblePoints: possiblePoints,
          DueDates: dueDates,
        };
        // Write grades
        const gradeDiv = courseGradeDiv.querySelector(
            `[canvasall-class-id="${course.id}"] > .canvasall_class_grade_score`
          ),
          { ENV } = w,
          { grading_scheme } = ENV,
          [letter] =
            (grading_scheme ?? ["N/A", 0]).find((scheme) => {
              try {
                return +overallGrade / 100 >= scheme[1];
              } catch (e) {
                console.error(e);
              }
            }) ?? ["?"];
        gradeDiv.innerHTML =
          overallGrade !== "N/A" && overallGrade
            ? `<span>${letter} (${overallGrade}%)</span>`
            : `<span>N/A</span>`;
        // Done using data from iframe, attempt to clean up memory usage
        overallGrade = titles = possiblePoints = dueDates = null;
        for (const i in courseGrades) {
          delete courseGrades[i];
        }
        w.location = "about:blank";
        setTimeout(() => {
          frame.remove();
        }, 500);
      }
    );
    // Get instructors
    getCourseTeacher(course.id)
      .then((teacher) => {
        const teacherDiv = courseGradeDiv.querySelector(
          `[canvasall-class-id="${course.id}"] > .canvasall_class_grade_instructor`
        );
        teacherDiv.innerHTML = `<span>${teacher.name}</span>`;
      })
      .catch(() => {
        // no teacher, or failed to get teacher
        const teacherDiv = courseGradeDiv.querySelector(
          `[canvasall-class-id="${course.id}"] > .canvasall_class_grade_instructor`
        );
        teacherDiv.innerHTML = "<span>No instructor found.</span>";
      });
  }
}

// /api/v1/users/:user_id/communication_channels
/**
 * getCourses - Gets all the classes of the user
 *
 * @returns {Promise<Array>} A list of class information
 */
function getCourses() {
  return new Promise((res, rej) => {
    const x = new XMLHttpRequest();
    x.open(
      "GET",
      "/api/v1/users/self/favorites/courses?include[]=term&exclude[]=enrollments&sort=nickname"
    );
    x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    x.setRequestHeader(
      "accept",
      "application/json, text/javascript, application/json+canvas-string-ids, */*; q=0.01"
    );
    x.onload = () => {
      res(JSON.parse(x.responseText));
    };
    x.onerror = () => {
      rej();
    };
    x.send();
  });
}

/**
 * GetClassAssignments - Gets the class assignments
 *
 * @param  {String} courseID The class id
 * @param  {String} userID The user id
 * @returns {Promise<Array>} The list of assignments
 */
function getCourseAssignments(courseID, userID) {
  const x = new XMLHttpRequest(),
    now = new Date(),
    offset = now.getTimezoneOffset() / 60,
    nextUrlRegex = /[^<>]*(?=>; rel="next")/;
  now.addDays(-14); // To get assignments from 2 weeks ago
  now.setHours(8 - offset);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);

  function makeHttpRequest(url) {
    return new Promise((res, rej) => {
      x.open("GET", url);
      x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      x.setRequestHeader(
        "accept",
        "application/json+canvas-string-ids, application/json+canvas-string-ids, application/json, text/plain, */*"
      );
      x.onerror = () => {rej();}
      x.onload = () => {
        res(x);
      }
      x.send();
    });
  }

  async function gatherRecursiveRequests(url, list = []) {
    const response = await makeHttpRequest(url),
      data = JSON.parse(response.responseText),
      linkHeader = response.getResponseHeader("link");
    list.push(...data);
    if (linkHeader) {
      const lastLink = linkHeader.match(nextUrlRegex);
      if (lastLink) {
        return gatherRecursiveRequests(lastLink[0], list);
      } else {
        return list;
      }
    } else {
      return list;
    }
  }

  return gatherRecursiveRequests(`/api/v1/planner/items?start_date=${now.toISOString()}&order=asc&context_codes[]=course_${courseID}`) //&context_codes[]=user_${userID}
    .catch(() => []);
}

/**
 * getCourseTeacher - Gets the teacher of the course
 *
 * @param  {String} courseID The class id
 * @returns {Object} The teacher
 */
function getCourseTeacher(courseID) {
  return new Promise((res, rej) => {
    const x = new XMLHttpRequest();
    x.open(
      "GET",
      `/api/v1/search/recipients?search=&per_page=20&permissions[]=send_messages_all&messageable_only=true&synthetic_contexts=true&context=course_${courseID}_teachers`
    );
    x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    x.setRequestHeader(
      "Accept",
      "application/json, text/javascript, application/json+canvas-string-ids, */*; q=0.01"
    );
    x.onload = () => {
      res(JSON.parse(x.responseText)[0]);
    };
    x.onerror = () => {
      rej();
    };
    x.send();
  });
}

/**
 * loadFrame - Loads an iframe
 *
 * @param  {HTMLElement} iFrameLoader The element to append iframes to
 * @param  {String} src The iframe url to load
 * @returns {Promise<Object>} returns an object with the "window" and "document" of the iframe
 */
function loadFrame(iFrameLoader, src) {
  return new Promise((res) => {
    const mainFrame = document.createElement("iframe");
    mainFrame.src = src || "/";
    iFrameLoader.append(mainFrame);
    mainFrame.addEventListener("load", () => {
      const frameContext = {
        document: mainFrame.contentDocument,
        window: mainFrame.contentWindow,
        frame: mainFrame
      };
      res(frameContext);
    });
  });
}

load();
