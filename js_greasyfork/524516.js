// ==UserScript==
// @name         WA Grade Viewer
// @namespace    http://tampermonkey.net/
// @version      2025-01-22.4
// @description  View your grades after the censorship.
// @author       You
// @match        https://worcesteracademy.myschoolapp.com/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPr8zPrePOyPNU1NFDvockbyWMETYLvD-WVw&s
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524516/WA%20Grade%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/524516/WA%20Grade%20Viewer.meta.js
// ==/UserScript==


setTimeout((function() {


    const wa_red = "rgb(145,5,51)";

function toggleButton(color, state1, state2, defaultState, listener) {
    const activeColor = color || "#007BFF";
    // Create the toggle container
    const toggleContainer = document.createElement("div");
    toggleContainer.state = defaultState;
    toggleContainer.style.display = "inline-flex";
    toggleContainer.style.border = "1px solid #ccc";
    toggleContainer.style.borderRadius = "5px";
    toggleContainer.style.overflow = "hidden";
    toggleContainer.style.cursor = "pointer";

    // Create the two buttons
    const buttonLeft = document.createElement("div");
    buttonLeft.textContent = state1;
    buttonLeft.style.padding = "10px 70px";
    buttonLeft.style.backgroundColor = activeColor;
    buttonLeft.style.color = "white";
    buttonLeft.style.flex = "1";
    buttonLeft.style.textAlign = "center";
    buttonLeft.style.userSelect = 'none';

    const buttonRight = document.createElement("div");
    buttonRight.textContent = state2;
    buttonRight.style.padding = "10px 70px";
    buttonRight.style.backgroundColor = "#f1f1f1";
    buttonRight.style.color = "#333";
    buttonRight.style.flex = "1";
    buttonRight.style.textAlign = "center";
    buttonRight.style.whiteSpace = "noWrap";
    buttonRight.style.userSelect = 'none';

    // Add click event to toggle between buttons
    toggleContainer.addEventListener("click", () => {
      if (toggleContainer.state == state1) {
        // Switch to state 2
        buttonLeft.style.backgroundColor = "#f1f1f1";
        buttonLeft.style.color = "#333";
        buttonRight.style.backgroundColor = activeColor;
        buttonRight.style.color = "white";

        toggleContainer.state = state2;
	listener(toggleContainer.state);
      } else {
        // Switch to state 1
        buttonLeft.style.backgroundColor = activeColor;
        buttonLeft.style.color = "white";
        buttonRight.style.backgroundColor = "#f1f1f1";
        buttonRight.style.color = "#333";
        toggleContainer.state = state1;
	listener(toggleContainer.state);
      }
    });

    // Append buttons to the container
    toggleContainer.appendChild(buttonLeft);
    toggleContainer.appendChild(buttonRight);
    return toggleContainer;
}

function createButton(text, textColor, backgroundColor) {
    const button = document.createElement("button");
    button.textContent = text;
    button.style.margin = "5px";
    button.style.padding = "10px 15px";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.backgroundColor = backgroundColor || "#007BFF";
    button.style.color = textColor || "white";
    button.style.fontSize = "14px";
    return button;
}
function configButton(button, lambda) {
    button.onclick = lambda;
    return button;
}

function createText(text, fontSize, color) {
    const message = document.createElement("p");
    message.textContent = text;
    message.style.fontSize = fontSize || "12px";
    message.style.color = color || "black";
    return message;
}

function addCloseButton(menu, toClose) {
    const closeButton = createButton("Close", "red", "white");
    closeButton.style.border = "2px solid red"
    configButton(closeButton, () => {
      document.body.removeChild(toClose); // Remove the popup
    });
    menu.appendChild(closeButton);
    return closeButton;
}

// Function to create a custom popup
function initializeMenu(studentId, s1Courses, s2Courses) {

  // Create the popup container
  const menu = document.createElement("div");
  menu.style.position = "fixed";
  menu.style.bottom = "0%";
  menu.style.right = "0%";
  menu.style.backgroundColor = "white";
  menu.style.padding = "20px";
  menu.style.boxShadow = "0 0px 12px rgba(0, 0, 0, 0.35)";
  menu.style.borderRadius = "8px";
  menu.style.textAlign = "center";
  menu.style.zIndex = "1000";
  menu.style.display = "flex";
  menu.style.flexDirection = "column";

  const header = createText("WA Grade Checker", "20px", null);
  header.style.marginBottom = "5px";
  header.style.marginTop = "5px";
  menu.appendChild(header);

  // Add a message to the popup
  const message = createText("Click on a course to view grade details.", "15px", "#777");
  message.style.marginBottom = "15px";
  message.style.marginTop = "5px";
  menu.appendChild(message);

  const s1CourseButtons = generateCourseButtons(s1Courses, 17605, studentId);
  const s2CourseButtons = generateCourseButtons(s2Courses, 17606, studentId);

  const courseButtonsContainer = document.createElement("div");

  const toggle = toggleButton("rgb(145,5,51)", "Semester 1", "Semester 2", "Semester 1", (state) => {displayCourseButtons(state, courseButtonsContainer, s1CourseButtons, s2CourseButtons)});
  toggle.style.marginBottom = "10px";
  menu.appendChild(toggle);


  menu.appendChild(courseButtonsContainer);
  if (toggle.state == "Semester 1") {
    courseButtonsContainer.appendChild(s1CourseButtons);
  } else {
    courseButtonsContainer.appendChild(s2CourseButtons);
  }


  const closeButton = addCloseButton(menu, menu);
  closeButton.style.marginTop = "25px";

  // Append the popup to the document body
  document.body.appendChild(menu);
}

function generateCourseButtons(courses, markingPeriod, studentId) {
  const courseButtons = document.createElement("div");
  courseButtons.style.display = "flex";
  courseButtons.style.flexDirection = "column";
  courseButtons.style.justifyContents = "center";
  courseButtons.style.alignItems = "center";

  courses.forEach(course => {
    const courseDiv = document.createElement("div");
    courseDiv.style.display = "flex";
    courseDiv.style.flexDirection = "row";
    courseDiv.style.justifyContents = "center";
    courseDiv.style.alignItems = "center";
    courseDiv.style.width = "100%";
    const button = createButton(course.courseName, "white", "rgb(145,5,51)");
    button.style.width = "80%";

    // Handle button click
    button.onclick = () => {
//      alert(`You selected: ${course.courseName + course.courseId}`);
console.log(course.courseId, markingPeriod, studentId, course.courseName);
      requestAssignments(course.courseId, markingPeriod, studentId).then(res => {
        generateScrollableAssignmentsOverlay(res, course.courseName);


      });
    };
    requestAssignments(course.courseId, markingPeriod, studentId).then(res => {

        const cumulativeText = createText(res.cumulativeGrade + "%", "16px", "black");
        cumulativeText.style.margin = "0 0 0 0";
        const bold = document.createElement("strong"); bold.appendChild(cumulativeText);
        courseDiv.appendChild(button);
        courseDiv.appendChild(cumulativeText);


      }
    );


    courseButtons.appendChild(courseDiv);
  });
  return courseButtons;
}

function displayCourseButtons(semester, courseButtonsContainer, s1, s2) {
  courseButtonsContainer.removeChild(courseButtonsContainer.firstChild);
  if (semester == "Semester 1") {
    courseButtonsContainer.appendChild(s1);
  } else {
    courseButtonsContainer.appendChild(s2);
  }
}

async function initializeUser() {
  // Get the studentId using split and indexOf as before
  const sessionData = sessionStorage["p3.session"].split(/[:,{}]/);
  const studentId = sessionData[sessionData.indexOf('\"mainbulletin_user\"') + 1];

  // Fetch the courses asynchronously using await
  const semester1Courses = await fetchCourses(studentId, 159072);
  const semester2Courses = await fetchCourses(studentId, 159073);

  matchCoursesAndUpdate(semester1Courses, semester2Courses);

  return [studentId, semester1Courses, semester2Courses];
}

async function fetchCourses(userId, durationList) {
  const url = `https://worcesteracademy.myschoolapp.com/api/datadirect/ParentStudentUserClassesGet?userId=${userId}&schoolYearLabel=2024%20-%202025&memberLevel=3&persona=2&durationList=${durationList}&markingPeriodId=&viewCid=view104&parentViewCid=view54&changeSchoolYearCount=1`;

  try {
    // Wait for the fetch call to resolve
    const response = await fetch(url);

    // Parse the response as JSON
    const data = await response.json();

    // Map the data to the required format
    const extractedData = data.map(obj => ({
      courseId: obj.sectionid,
      courseName: obj.sectionidentifier,
    }));

    return extractedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array on error
  }
}

async function matchCoursesAndUpdate(semester1Courses, semester2Courses) {
  // Loop through all courses in semester2Courses
  for (let semester2Course of semester2Courses) {
    // Check if there's a matching course in semester1Courses
    for (let semester1Course of semester1Courses) {
      if (semester1Course.courseName === semester2Course.courseName) {
        // If names match, update the id of semester2Course with semester1's id
        semester2Course.courseId = semester1Course.courseId;
        break; // Exit the loop once the match is found
      }
    }
  }
}


initializeUser()
  .then((userData) => {
    initializeMenu(userData[0], userData[1], userData[2]);
  })
  .catch(error => {
    console.error("Error in initializeUser:", error);
  });
















function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function removeHTMLTags(html) {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}

async function requestAssignments(classID, semesterCode, studentCode) {
  try {
    const res = await fetch(`https://worcesteracademy.myschoolapp.com/api/gradebook/hydrategradebook?sectionId=${classID}&markingPeriodId=${semesterCode}&sortAssignmentId=null&sortSkillPk=null&sortDesc=null&sortCumulative=null&studentUserId=${studentCode}&fromProgress=true`);
    const data = await res.json();

    const assignments = data?.Assignments || [];
    const roster = data?.Roster?.[0] || {};
    const grades = roster?.AssignmentGrades || [];

    let totalPointsEarned = 0;
    let totalMaxPoints = 0;
    const assignmentTypeData = {};

    assignments.forEach((assignment) => {
      const grade = grades.find(g => g.AssignmentId === assignment.AssignmentId) || {};
      const pointsEarned = grade?.PointsEarned;
      const maxPoints = grade?.MaxPoints;
      const isExempt = grade?.Exempt === true;
      const isDropped = grade?.Dropped === true;
      const incCumGrade = assignment?.IncCumGrade === 1;
      const assignmentType = assignment?.AssignmentType || "Unknown Type";
      const factor = !assignment?.Factor && assignment?.Factor != 0 ? 1 : assignment?.Factor;

      if (!isExempt && !isDropped && incCumGrade && pointsEarned != null && pointsEarned !== "N/A" && maxPoints != null && maxPoints !== "N/A") {
        totalPointsEarned += pointsEarned * factor;
        totalMaxPoints += maxPoints * factor;

        if (!assignmentTypeData[assignmentType]) {
          assignmentTypeData[assignmentType] = { pointsEarned: 0, pointsPossible: 0 };
        }

        assignmentTypeData[assignmentType].pointsEarned += pointsEarned;
        assignmentTypeData[assignmentType].pointsPossible += maxPoints;
      }
    });

    const cumulativeGrade = totalMaxPoints > 0 ? (totalPointsEarned / totalMaxPoints) * 100 : "N/A";
    const roundedTotalPointsEarned = totalPointsEarned.toFixed(2);
    const roundedTotalMaxPoints = totalMaxPoints.toFixed(2);

    // Log the cumulative grade
    console.log(`Cumulative Grade: ${cumulativeGrade === "N/A" ? "N/A" : cumulativeGrade.toFixed(2)}% (${roundedTotalPointsEarned} out of ${roundedTotalMaxPoints})`);

    // Log assignment type grades
    Object.keys(assignmentTypeData).forEach(assignmentType => {
      const { pointsEarned, pointsPossible } = assignmentTypeData[assignmentType];
      const typeGrade = pointsPossible > 0 ? ((pointsEarned / pointsPossible) * 100).toFixed(2) : "N/A";
      console.log(`${assignmentType} - Grade: ${typeGrade}% (${pointsEarned} out of ${pointsPossible})`);
    });

    // Prepare the result object
    const result = {
      cumulativeGrade: cumulativeGrade === "N/A" ? "N/A" : cumulativeGrade.toFixed(2),
      totalPointsEarned: roundedTotalPointsEarned,
      totalMaxPoints: roundedTotalMaxPoints,
      assignmentTypeData: [],
      assignments: []
    };

    result.assignmentTypeData = Object.keys(assignmentTypeData).map(assignmentType => {
      const { pointsEarned, pointsPossible } = assignmentTypeData[assignmentType];
      const typeGrade = pointsPossible > 0 ? ((pointsEarned / pointsPossible) * 100).toFixed(2) : "N/A";
      return {
        assignmentType,
        typeGrade,
        pointsEarned,
        pointsPossible
      };
    });

    // Log each assignment
    if (assignments.length > 0) {
      assignments.forEach((assignment, index) => {
        const nameAbbr = decodeHTML(removeHTMLTags(assignment?.AssignShort || "Unknown Assignment"));
        const description = decodeHTML(removeHTMLTags(assignment?.AbbrDescription || "No Description"));
        const dueDate = assignment?.DateDue || "No Due Date";
        const grade = grades.find(g => g.AssignmentId === assignment.AssignmentId) || {};
        const pointsEarned = grade?.PointsEarned ?? "N/A";
        const maxPoints = grade?.MaxPoints ?? "N/A";
        const assignmentType = assignment?.AssignmentType || "No Assignment Type";
        const isLate = grade?.Late === true;
        const isIncomplete = grade?.Incomplete === true;
        const isMissing = grade?.Missing === true;
        const isExempt = grade?.Exempt === true;
        const isDropped = grade?.Dropped === true;
        const incCumGrade = assignment?.IncCumGrade === 1;
        const assignmentComment = decodeHTML(removeHTMLTags(grade?.Comment || "N/A"));
        let status = "";

        if (!incCumGrade) status = "Excluded ";
        if (isLate) status += "Late ";
        if (isIncomplete) status += "Incomplete ";
        if (isMissing) status += "Missing ";
        if (isExempt) status += "Exempt ";
        if (isDropped) status += "Dropped ";
        if (status === "") status = "No issues";

        const percentage = (pointsEarned !== "N/A" && maxPoints !== "N/A") ? `${((pointsEarned / maxPoints) * 100).toFixed(2)}%` : "N/A";

        // Log individual assignment details
        console.log(`#${index + 1} - ${nameAbbr} (${description})\nType: ${assignmentType}\nDue ${dueDate} | ${pointsEarned} out of ${maxPoints} | ${percentage} | Status: ${status}\nComment: ${assignmentComment}`);

        // Add assignment data to result object
        result.assignments.push({
          index: index + 1,
          nameAbbr,
          description,
          dueDate,
          pointsEarned,
          maxPoints,
          percentage,
          assignmentType,
          status,
          assignmentComment
        });
      });
    } else {
      console.log("No assignment data found.");
    }

    return result;

  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}


function generateScrollableAssignmentsOverlay(assignmentsData, courseName) {
  if (!assignmentsData) {
    console.error("No assignment data to display.");
    return null;
  }

  // Create overlay background
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  overlay.style.zIndex = '1000';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'start';
  overlay.style.justifyContent = 'center';
  overlay.style.paddingTop = "10vh";

  // Create modal container
  const container = document.createElement('div');
  container.style.width = '80%';
  container.style.overflow = 'hidden'; // Prevent the entire modal from scrolling
  container.style.border = '1px solid #ccc';
  container.style.padding = '20px';
  container.style.backgroundColor = '#fff';
  container.style.borderRadius = '10px';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)';
  container.style.position = 'relative';

  // Create header section (Course name, Cumulative grade, etc.)
  const header = document.createElement('div');
  header.style.paddingBottom = '10px';
  header.style.borderBottom = `2px solid ${wa_red}`;
  header.style.marginBottom = '20px';

  // Add Course Name
  const courseNameElement = document.createElement('div');
  courseNameElement.innerHTML = `<h2 style="margin-top: 5px">${courseName}</h2>`;
  header.appendChild(courseNameElement);

  // Add Cumulative Grade
  const cumulativeGradeElement = document.createElement('div');
  cumulativeGradeElement.innerHTML = `
    <h3 style="font-size: 25px;">${assignmentsData.cumulativeGrade === "N/A" ? "N/A" : assignmentsData.cumulativeGrade}%</h3>
    <div>Points: ${assignmentsData.totalPointsEarned} / ${assignmentsData.totalMaxPoints}</div>
  `;
  header.appendChild(cumulativeGradeElement);

  // Add the header to the container
  container.appendChild(header);

  // Create a scrollable div for assignments
  const assignmentsScrollContainer = document.createElement('div');
  assignmentsScrollContainer.style.maxHeight = '55vh'; // Restrict the scrollable area
  assignmentsScrollContainer.style.overflowY = 'auto';

  // Use the provided assignmentTypeData directly
  const groupedAssignments = {};

  assignmentsData.assignments.forEach(assignment => {
    const assignmentType = assignment.assignmentType || "Unknown Type";
    if (!groupedAssignments[assignmentType]) {
      groupedAssignments[assignmentType] = [];
    }
    groupedAssignments[assignmentType].push(assignment);
  });

  // Iterate over the grouped assignments and add them to the modal
  Object.keys(groupedAssignments).forEach(assignmentType => {
    const assignmentsByType = groupedAssignments[assignmentType];
    const assignmentTypeInfo = assignmentsData.assignmentTypeData.find(data => data.assignmentType === assignmentType);

    // Use the type grade from the result
    const typeGrade = assignmentTypeInfo ? assignmentTypeInfo.typeGrade : "N/A";
    const typePointsEarned = assignmentTypeInfo ? assignmentTypeInfo.pointsEarned : 0;
    const typeMaxPoints = assignmentTypeInfo ? assignmentTypeInfo.pointsPossible : 0;

    // Create a header for the assignment type with a toggle button
    const typeGradeElement = document.createElement('div');
    typeGradeElement.innerHTML = `
      <h4 style="font-size: 16px; cursor: pointer; margin: 10px 0; color: black; display: inline">
        <span class="toggle-icon">+</span> ${assignmentType}</h4><p style="display: inline;"> - ${typeGrade}% (${typePointsEarned} / ${typeMaxPoints})
      </p>
    `;
    typeGradeElement.style.marginTop = "10px";
    typeGradeElement.style.marginBottom = "10px";

    // Create the container for the assignments of this type
    const assignmentsContainer = document.createElement('div');
    assignmentsContainer.style.display = 'none'; // Initially hidden
    assignmentsByType.forEach((assignment, index) => {
      const assignmentElement = document.createElement('div');
      assignmentElement.style.marginBottom = '15px';
      assignmentElement.style.padding = '10px';
      assignmentElement.style.border = '1px solid #ddd';
      assignmentElement.style.borderRadius = '5px';
      assignmentElement.style.backgroundColor = '#fff';

      const status = assignment.status || "No issues";
      const percentage = assignment.percentage || "N/A";

      assignmentElement.innerHTML = `
        <div><strong>#${index + 1} - ${assignment.nameAbbr}</strong> (${assignment.description})</div>
        <div><strong>Type:</strong> ${assignment.assignmentType}</div>
        <div><strong>Due:</strong> ${assignment.dueDate}</div>
        <div><strong>Grade:</strong> ${assignment.pointsEarned} out of ${assignment.maxPoints} | ${percentage}</div>
        <div><strong>Status:</strong> ${status}</div>
        <div><strong>Comment:</strong> ${assignment.assignmentComment}</div>
      `;
      assignmentsContainer.appendChild(assignmentElement);
    });

    // Add the toggle functionality for the header
    typeGradeElement.querySelector('h4').addEventListener('click', () => {
      const isHidden = assignmentsContainer.style.display === 'none';
      assignmentsContainer.style.display = isHidden ? 'block' : 'none';
      const icon = typeGradeElement.querySelector('.toggle-icon');
      icon.textContent = isHidden ? '-' : '+'; // Toggle + / - icon
    });

    // Append the header and the assignment container
    assignmentsScrollContainer.appendChild(typeGradeElement);
    assignmentsScrollContainer.appendChild(assignmentsContainer);
  });

  // Append the scrollable assignments container to the main container
  container.appendChild(assignmentsScrollContainer);

  // Add Close Button using the provided function
  const closeButton = addCloseButton(container, overlay);
  closeButton.style.width = "100%";
  closeButton.style.marginTop = "25px";

  // Append modal to the overlay
  overlay.appendChild(container);

  // Append overlay to the body
  document.body.appendChild(overlay);
}

}), 0);