// ==UserScript==
// @name          PupilPath Plus
// @namespace     https://github.com/DeathHackz/PupilPathPlus
// @version       4.0.2
// @description   Calculate Your PupilPath Cumulative Average & More
// @match         https://*.pupilpath.skedula.com/*
// @author        DeathHackz
// @copyright     2019 DeathHackz
// @license       MIT
// @homepageURL   https://deathhackz.github.io/PupilPathPlus
// @supportURL    https://github.com/DeathHackz/PupilPathPlus/issues
// @icon          https://github.com/DeathHackz/PupilPathPlus/raw/master/icon.png
// @run-at        document-body
// @grant         GM_registerMenuCommand
/* global jQuery */
// @downloadURL https://update.greasyfork.org/scripts/368390/PupilPath%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/368390/PupilPath%20Plus.meta.js
// ==/UserScript==

/*
=================================================================================================================================
PupilPath, and all related icons/images/assets, and names belong to IO Education
I am NOT affiliated with PupilPath or IO Education by no means, neither is this script
=================================================================================================================================
MIT License

Copyright (c) 2019 DeathHackz

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
=================================================================================================================================
Supported Userscript Extensions:
* Tampermonkey (recommended)
* Violentmonkey
=================================================================================================================================
PupilPath Default Libraries
* jQuery v1.5.1
* jQuery-UI v1.8.11 CUSTOM
* jQuery FaceBox v1.2
* jQuery Timepicker Addon v0.9.3
=================================================================================================================================
*/

// Make Entire Script Run In Strict Mode
"use strict";

// Script Version
const scriptVersion = "4.0.2";

// Add Menu Items To UserScript Manager
GM_registerMenuCommand("Visit Homepage", () => {
  window.open("https://deathhackz.github.io/PupilPathPlus");
});
GM_registerMenuCommand("Check For Updates", () => {
  window.open("https://raw.githubusercontent.com/DeathHackz/PupilPathPlus/master/src/PupilPathPlus.user.js");
});

// Console Warning Message
// SetTimeout Is Used To Remove The Source Link
setTimeout(
  console.warn.bind(
    // Styling Is Used Within The Console Message
    console,
    `%c \n %c You Are Using PupilPath Plus%cv${scriptVersion} %c \n %c    Follow %c@DeathHackz%con GitHub    `,
    "",
    "background: #383b3e; color: #bada55; padding: 4px; padding-left: 0px; border-top-left-radius: 2px;",
    "background: #383b3e; color: #C8FF19; padding: 4px; padding-right: 0px; border-top-right-radius: 2px;",
    "",
    "background: #383b3e; color: #bada55; padding: 4px; padding-left: 2.8px; border-bottom-left-radius: 2px;",
    "background: #383b3e; color: #C8FF19; padding-top: 4px; padding-bottom: 4px;",
    "background: #383b3e; color: #bada55; padding: 4px; padding-right: 0px; padding-left: 8px; border-bottom-right-radius: 2px;",
    "\nDeathHackz: https://github.com/DeathHackz",
    "\nHomepage:   https://deathhackz.github.io/PupilPathPlus",
    "\nGitHub:     https://github.com/DeathHackz/PupilPathPlus",
    "\nSupport:    https://github.com/DeathHackz/PupilPathPlus/issues\n ",
  )
);

// Define All Functions Before Conditional Statement

// Function Accepts An Array And Returns The Average
function calculateAverage(grades) {
  // Adds Up All The Values From The Array
  const gradesTotal = grades.reduce((a, b) => a + b);
  const totalGrades = grades.length;
  const average = gradesTotal / totalGrades;
  return average;
}

// Function To See If Two Array's Are Identical (Have The Same Values)
function compareArrays(a, b) {
  // Check If Array's Have The Same Length
  if (a.length !== b.length) {
    return false;
  }
  // Check To See If All The Values Are The Same
  for (let i = a.length; i--;) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

// Function To See If All Values In An Array Are Between 0 - 110
function isValidGrades(array) {
  if (array >= 0 && array <= 110) {
    return true;
  } else {
    return false;
  }
}

// Function To Change Grade View
function setGradeView(view) {
  // Define All Needed DOM Elements
  const numberGrades = document.querySelectorAll("span.numberGrade");
  const letterGrades = document.querySelectorAll("span.letterGrade");
  const gpaGrades = document.querySelectorAll("span.gpaGrade");
  const numAverage = document.querySelector("span#totalAverage.numberGrade");
  const letterAverage = document.querySelector("span#totalAverage.letterGrade");
  const gpaAverage = document.querySelector("span#totalAverage.gpaGrade");
  // Use Conditionals To Show Selected Grade Type & Hide The Others
  if (view === "number") {
    localStorage.setItem("DefaultGradeView", "number");
    numAverage.style.display = "initial";
    letterAverage.style.display = "none";
    gpaAverage.style.display = "none";
    numberGrades.forEach(e => {
      e.style.display = "initial";
    });
    letterGrades.forEach(e => {
      e.style.display = "none";
    });
    gpaGrades.forEach(e => {
      e.style.display = "none";
    });
  }
  if (view === "letter") {
    localStorage.setItem("DefaultGradeView", "letter");
    numAverage.style.display = "none";
    letterAverage.style.display = "initial";
    gpaAverage.style.display = "none";
    numberGrades.forEach(e => {
      e.style.display = "none";
    });
    letterGrades.forEach(e => {
      e.style.display = "initial";
    });
    gpaGrades.forEach(e => {
      e.style.display = "none";
    });
  }
  if (view === "gpa") {
    localStorage.setItem("DefaultGradeView", "gpa");
    numAverage.style.display = "none";
    letterAverage.style.display = "none";
    gpaAverage.style.display = "initial";
    numberGrades.forEach(e => {
      e.style.display = "none";
    });
    letterGrades.forEach(e => {
      e.style.display = "none";
    });
    gpaGrades.forEach(e => {
      e.style.display = "initial";
    });
  }
}

// Puts The Inputted Grades Array Through Series Of Conditionals And Returns Appropriate Data For Each Grade
function convertGrades(grade) {
  // All The Data For Each Grade Is Pushed Into This Array
  const finalData = [];
  // Loops Through Entire Inputted Array
  grade.forEach(a => {
    // This Must Be A Whole Number Or An Error May Occur If The Decimal Is In Between The Ranges Defined Below
    const e = Math.floor(a);
    // Defining All Necessary Variables
    let letterGrade;
    let gpaGrade;
    let gradeIcon;
    let gradeColor;
    let gradeType;
    // Conditionals To Find Appropriate Values Based On Grade
    if (e > 100) {
      letterGrade = "A++";
      gpaGrade = 4.0;
      gradeIcon = "/img/ico/star.png";
      gradeColor = "#0087FF";
      gradeType = "Honors";
    }
    if (e >= 97 && e <= 100) {
      letterGrade = "A+";
      gpaGrade = 4.0;
      gradeIcon = "/img/ico/star.png";
      gradeColor = "#0087FF";
      gradeType = "Honors";
    }
    if (e >= 93 && e <= 96) {
      letterGrade = "A";
      gpaGrade = 4.0;
      gradeIcon = "/img/ico/star.png";
      gradeColor = "#0087FF";
      gradeType = "Honors";
    }
    if (e >= 90 && e <= 92) {
      letterGrade = "A-";
      gpaGrade = 3.67;
      gradeIcon = "/img/ico/star.png";
      gradeColor = "#0087FF";
      gradeType = "Honors";
    }
    if (e >= 87 && e <= 89) {
      letterGrade = "B+";
      gpaGrade = 3.33;
      gradeIcon = "/img/ico/tick.png";
      gradeColor = "#1FBA24";
      gradeType = "Passing";
    }
    if (e >= 83 && e <= 86) {
      letterGrade = "B";
      gpaGrade = 3.00;
      gradeIcon = "/img/ico/tick.png";
      gradeColor = "#1FBA24";
      gradeType = "Passing";
    }
    if (e >= 80 && e <= 82) {
      letterGrade = "B-";
      gpaGrade = 2.67;
      gradeIcon = "/img/ico/tick.png";
      gradeColor = "#1FBA24";
      gradeType = "Passing";
    }
    if (e >= 77 && e <= 79) {
      letterGrade = "C+";
      gpaGrade = 2.33;
      gradeIcon = "/img/ico/error.png";
      gradeColor = "#AA9901";
      gradeType = "Borderline";
    }
    if (e >= 73 && e <= 76) {
      letterGrade = "C";
      gpaGrade = 2.00;
      gradeIcon = "/img/ico/error.png";
      gradeColor = "#AA9901";
      gradeType = "Borderline";
    }
    if (e >= 70 && e <= 72) {
      letterGrade = "C-";
      gpaGrade = 1.67;
      gradeIcon = "/img/ico/error.png";
      gradeColor = "#AA9901";
      gradeType = "Borderline";
    }
    if (e >= 67 && e <= 69) {
      letterGrade = "D+";
      gpaGrade = 1.33;
      gradeIcon = "/img/ico/error.png";
      gradeColor = "#AA9901";
      gradeType = "Borderline";
    }
    if (e >= 63 && e <= 66) {
      letterGrade = "D";
      gpaGrade = 1.00;
      gradeIcon = "/img/ico/exclamation.png";
      gradeColor = "#CF1920";
      gradeType = "Failing";
    }
    if (e >= 60 && e <= 62) {
      letterGrade = "D-";
      gpaGrade = 0.67;
      gradeIcon = "/img/ico/exclamation.png";
      gradeColor = "#CF1920";
      gradeType = "Failing";
    }
    if (e < 60) {
      letterGrade = "F";
      gpaGrade = 0.00;
      gradeIcon = "/img/ico/exclamation.png";
      gradeColor = "#CF1920";
      gradeType = "Failing";
    }
    // Combines All Data Per Grade Into An Object
    const gradeData = {
      "Number_Grade": a,
      "Letter_Grade": letterGrade,
      "GPA_Grade": gpaGrade,
      "Grade_Icon": gradeIcon,
      "Grade_Color": gradeColor,
      "Grade_Type": gradeType
    };
    // Pushes Object Into FinalData Array
    finalData.push(gradeData);
  });
  return finalData;
}

// Sets The Value For The Average Element
// Icon, Color, & Type Can Be Automatically Set
function setAverage(average, custom) {
  // Get Average Data By Passing Average As An Array Through ConvertGrades Function
  const gradeData = convertGrades([average]);
  // Define All Necessary Items From GradeData
  const gradeColor = gradeData[0].Grade_Color;
  const gradeType = gradeData[0].Grade_Type;
  const gradeIcon = gradeData[0].Grade_Icon;
  const letterGrade = gradeData[0].Letter_Grade;
  const gpaGrade = gradeData[0].GPA_Grade;
  // Get Default Grade View
  const gradeView = localStorage.getItem("DefaultGradeView");
  // Only Show Grade View Which Is Default
  let numView = "none";
  let letterView = "none";
  let gpaView = "none";
  if (gradeView === "number") {
    numView = "initial";
  }
  if (gradeView === "letter") {
    letterView = "initial";
  }
  if (gradeView === "gpa") {
    gpaView = "initial";
  }
  // If Custom Is True Create New Element For Custom Average
  if (custom === true) {
    // Remove Custom Average HTML If It Exists To Replace With New HTML
    if (document.getElementById("customAverageParent") !== null) {
      document.getElementById("customAverageParent").remove();
    }
    // Select Average Container
    const averageContainer = document.querySelector("span#averageContainer");
    // Hide Original Average Element
    document.getElementById("averageParent").style.display = "none";
    // Add In Custom Average HTML
    averageContainer.insertAdjacentHTML("beforeend", `
    <a id="customAverageParent" style="display: initial; color: #585b66; position: static; float: right; padding-top: 10px; padding-right: 10px; cursor: pointer">
      Total Average:
      <img id="customAverageIcon" src="${gradeIcon}" />
      <span style="display: ${numView}; color: ${gradeColor};" data-gtype="${gradeType}" class="numberGrade" id="customTotalAverage">${average}%</span>
      <span style="display: ${letterView}; color: ${gradeColor};" data-gtype="${gradeType}" class="letterGrade" id="customTotalAverage">${letterGrade}</span>
      <span style="display: ${gpaView}; color: ${gradeColor};" data-gtype="${gradeType}" class="gpaGrade" id="customTotalAverage">${gpaGrade}</span>
    </a>
    `);
  } else {
    // Set All New Data
    document.querySelectorAll("span#totalAverage").forEach(e => {
        e.style.color = gradeColor;
        e.dataset.gtype = gradeType;
      });
    document.getElementById("averageIcon").src = gradeIcon;
    document.querySelector("span#totalAverage.numberGrade").innerText = `${average}%`;
    document.querySelector("span#totalAverage.letterGrade").innerText = letterGrade;
    document.querySelector("span#totalAverage.gpaGrade").innerText = gpaGrade;
  }
}

// Function To Load Saved Grades
function loadSavedGrades() {
  // Parse The Saved Grades So It Can Be Read As An Array
  const savedGrades = JSON.parse(localStorage.getItem("CustomGrades"));
  // Selects All The Grade Container Elements
  const gradeSpan = document.querySelectorAll("table#progress-card > tbody > tr > td > span");
  // All Grades Custom Included
  let allGrades = [];
  for (let i = 0; i < savedGrades.length; i++) {
    if (savedGrades[i] !== null) {
      // Hide Original Grade
      gradeSpan[i].style.display = "none";
      // Get Data On Custom Grade
      const gradeData = convertGrades([savedGrades[i]]);
      // Define All Necessary Items From GradeData
      const customNumberGrade = gradeData[0].Number_Grade;
      const customLetterGrade = gradeData[0].Letter_Grade;
      const customGpaGrade = gradeData[0].GPA_Grade;
      const customGradeType = gradeData[0].Grade_Type;
      const customGradeIcon = gradeData[0].Grade_Icon;
      const customGradeColor = gradeData[0].Grade_Color;
      // Get Default Grade View
      const gradeView = localStorage.getItem("DefaultGradeView");
      // Only Show Grade View Which Is Default
      let numView = "none";
      let letterView = "none";
      let gpaView = "none";
      if (gradeView === "number") {
        numView = "initial";
      }
      if (gradeView === "letter") {
        letterView = "initial";
      }
      if (gradeView === "gpa") {
        gpaView = "initial";
      }
      // Add Custom Grade Span Below Original Grade Span
      // Set All Custom Grades HTML
      gradeSpan[i].insertAdjacentHTML("beforebegin", `
      <span class="customGrade" style="display: initial">
        <span class="numberGrade" style="display: ${numView}; color: ${customGradeColor};" data-numbergrade="${customNumberGrade}" data-lettergrade="${customLetterGrade}" data-gpagrade="${customGpaGrade}" data-gtype="${customGradeType}">
          <img src="${customGradeIcon}"> ${customNumberGrade}
        </span>
        <span class="letterGrade" style="display: ${letterView}; color: ${customGradeColor}" data-numbergrade="${customNumberGrade}" data-lettergrade="${customLetterGrade}" data-gpagrade="${customGpaGrade}" data-gtype="${customGradeType}">
          <img src="${customGradeIcon}"> ${customLetterGrade}
        </span>
        <span class="gpaGrade" style="display: ${gpaView}; color: ${customGradeColor}" data-numbergrade="${customNumberGrade}" data-lettergrade="${customLetterGrade}" data-gpagrade="${customGpaGrade}" data-gtype="${customGradeType}">
          <img src="${customGradeIcon}"> ${customGpaGrade}
        </span>
      </span>
      `);
    }
  }
  // Selects All Visible Grade Spans
  const visibleGradeSpans = document.querySelectorAll("table#progress-card > tbody > tr > td > span[style='display: initial'] > span.numberGrade");
  visibleGradeSpans.forEach(e => {
    const grade = parseFloat(e.dataset.numbergrade);
    allGrades.push(grade);
  });
  // Calculate Custom Average
  let customGradeAverage = calculateAverage(allGrades);
  // Round Custom Average
  customGradeAverage = Math.round(customGradeAverage * 100) / 100;
  // Set Custom Average
  setAverage(customGradeAverage, true);
}

// Add Menu Item To UserScript Manager
// Grade Changer Function
GM_registerMenuCommand("Change Grades", () => {
  // Only Run If Progress Card Exists
  if (document.getElementById("progress-card") !== null) {
    // NOTE FACEBOX IS A DEFAULT LIBRARY PUPILPATH USES
    // Setting Up Grade Changer Modal HTML
    jQuery.facebox(`
    <div id="gradeChanger">
      <h2 style="text-align: center;">Grade Changer</h2>
      <b>
        <h5 id="gradesNotChanged" class="customError" style="display: none; text-align: center; padding: 5px; background-color: #f08080; border-radius: 5px;">Error: You Have Not Made Any Changes!</h5>
        <h5 id="gradesTooHigh" class="customError" style="display: none; text-align: center; padding: 5px; background-color: #f08080; border-radius: 5px;">Error: Grades Must Be Between 0 - 110!</h5>
        <h5 id="changedGrades" class="customWarning" style="display: none; text-align: center; padding: 5px; background-color: #f0eb80; border-radius: 5px;">Warning: Grades Have Been Changed!</h5>
      </b>
      <form>
        <a class="btn btn-danger" id="resetButton" style="margin-right: 5px; margin-top: 5px;" title="Reset all grades back to original grades">Reset</a>
        <a class="btn btn-warning" id="clearButton" style="margin-right: 5px; margin-top: 5px;" title="Clear all grades from inputs">Clear</a>
        <a class="btn btn-success" id="setButton" style="margin-right: 50px; margin-top: 5px;" title="Set all custom grades">Set</a>
        <a class="btn btn-danger" id="saveButton" style="float: right; margin-top: 5px;" title="Save/Delete all custom grades (survives reload)">Save</a>
      </form>
    </div>
    `);
    // Set Save Button Name To Delete If Custom Grades Exist
    if (localStorage.getItem("CustomGrades") !== null) {
      document.getElementById("saveButton").innerText = "Delete";
    }
    // Gets All Class Name's And Grades Then Adds Them Into The Grade Changer Modal
    const gradeSpan = document.querySelectorAll("table#progress-card > tbody > tr > td > span.originalGrade > span.numberGrade");
    // Convert NodeList To Array To Reverse Order Of Elements So They Will Be In Correct Order When The HTML Is Inserted Below
    const reversedGradeSpan = Array.from(gradeSpan).reverse();
    // Adding The Class Name's And Grade Input HTML To The Grade Changer Modal
    reversedGradeSpan.forEach(e => {
      const origGrade = parseFloat(e.innerText);
      const className = e.parentElement.parentElement.parentElement.childNodes[1].innerText.toUpperCase();
      document.querySelector("div#gradeChanger > form").insertAdjacentHTML("afterbegin", `
      <span>
        <b>${className}</b>
        <input style="margin: 5px;" class="classGrades" type="number" step="0.01" data-originalgrade="${origGrade}" value="" min="0" max="110">
        <img class="isError" style="display: none;" src="/img/ico/exclamation.png" title="Grade Must Be Between 0-110"/>
        <img class="isEdit" style="display: none;" src="/img/ico/pencil.png" title="This Grade Has Been Changed"/>
      </span>
      <br />
      `);
    });
    // Selects All Inputs
    const inputs = document.querySelectorAll("div#gradeChanger > form > span > input");
    // Select All Visible Grades
    const visibleGrades = document.querySelectorAll("table#progress-card > tbody > tr > td > span[style='display: initial'] > span.numberGrade");
    for (let i = 0; i < inputs.length; i++) {
      // Visible Grade
      const grade = visibleGrades[i].dataset.numbergrade;
      // Changed Grade Warning
      const changedGrades = document.getElementById("changedGrades");
      // If Grade Was Changed Do This
      if (grade != inputs[i].dataset.originalgrade) {
        // Show Edited Icon If Grade Was Changed
        inputs[i].parentElement.lastElementChild.style.display = "initial";
        // Show Grade Changed Warning
        changedGrades.style.display = "block";
      }
      // Sets The Current Visible Grade To Fill Input
      inputs[i].value = grade;
    }
    // Add CSS To Document HEAD To Remove Arrows From Number Input
    document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", `
    <style>
      input[type='number'] {
        -moz-appearance:textfield;
      }
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
    </style>
    `);
    // This Is To Remove The Default 600px Width On FaceBox Element
    document.getElementById("gradeChanger").parentElement.parentElement.style = "width: auto";

    // Button Functions For Grade Changer

    // Reset Button
    document.getElementById("resetButton").addEventListener("click", () => {
        // Define Necessary Variables
        const inputs = document.querySelectorAll("div#gradeChanger > form > span > input");
        const customGradeSpan = document.querySelectorAll("span.customGrade");
        const originalGradeSpan = document.querySelectorAll("span.originalGrade");
        const changedGrades = document.getElementById("changedGrades");
        const customAverage = document.getElementById("customAverageParent");
        const originalAverage = document.getElementById("averageParent");
        // Remove Custom Average Element If It Exists
        if (customAverage !== null) {
          customAverage.remove();
        }
        // Show Original Average Element
        originalAverage.style.display = "initial";
        // Hide Grade Changed Warning
        changedGrades.style.display = "none";
        // Remove All Changed Grades Spans
        customGradeSpan.forEach(e => {
          e.remove();
        });
        // Show All Original Grades
        originalGradeSpan.forEach(e => {
          e.style.display = "initial";
        });
        // Set Each Input To Its Original Value
        inputs.forEach(e => {
          const origGrade = e.dataset.originalgrade;
          e.value = origGrade;
          // Hide Edited Icon
          e.parentElement.lastElementChild.style.display = "none";
          // Hide Error Icon
          e.parentElement.children[2].style.display = "none";
        });
    });

    // Clear Button
    document.getElementById("clearButton").addEventListener("click", () => {
        const inputs = document.querySelectorAll("div#gradeChanger > form > span> input");
        inputs.forEach(e => {
          // Set Each Input To Nothing
          e.value = "";
          // Hide Edited Icon
          e.parentElement.lastElementChild.style.display = "none";
          // Hide Error Icon
          e.parentElement.children[2].style.display = "none";
        });
    });

    // Set Button
    document.getElementById("setButton").addEventListener("click", () => {
      // Selects All The Grade Container Elements
      const gradeSpan = document.querySelectorAll("table#progress-card > tbody > tr > td > span.originalGrade > span.numberGrade");
      // All The Original Grades Are Pushed Into This Array
      const allOriginalGrades = [];
      // All Grade Changer Inputs
      const inputs = document.querySelectorAll("div#gradeChanger > form > span> input");
      // All Custom Grades Are Pushed Into This Array
      const customGrades = [];
      // Push All Original Grades Into Above Array
      gradeSpan.forEach(e => {
        // Make Sure To Use ParseFloat NOT ParseInt B/C ParseFloat Leaves Decimals Intact
        allOriginalGrades.push(parseFloat(e.innerText));
      });
      // Get All Custom Grades From Inputs And Push To Array
      inputs.forEach(e => {
        const grade = parseFloat(e.value);
        // Only Push Numbers To Array
        if (isNaN(grade) === false) {
          customGrades.push(grade);
        } else {
          customGrades.push(null);
        }
      });
      // Only Continue If The Custom Grades Are Different Than The Original Grades
      if (compareArrays(allOriginalGrades, customGrades) === false) {
        // Check If Every Value Of CustomGrades Is Between 0 - 110 Using isValidGrades Function
        if (customGrades.every(isValidGrades) === true) {
          // All Of The Final Custom Grades Will Be Pushed Into This
          const finalCustomGrades = [];
          // Loop Through The Original & Custom Grades
          for (let i = 0; i < allOriginalGrades.length; i++) {
            let grade;
            // If The Grades Are The Same Or Null Push Null
            if (allOriginalGrades[i] === customGrades[i] || customGrades[i] === null) {
              grade = null;
            }
            // If Grades Are Different Push The Custom Grade
            if (allOriginalGrades[i] !== customGrades[i]) {
              grade = customGrades[i];
            }
            // Push Grades To Array
            finalCustomGrades.push(grade);
          }
          // Loop Through The Final Custom Grades
          for (let i = 0; i < finalCustomGrades.length; i++) {
            // If The Value Is Null Hide Edited Icon
            // Else Show The Edited Icon
            if (finalCustomGrades[i] !== null) {
              inputs[i].parentElement.lastElementChild.style.display = "initial";
            } else {
              inputs[i].parentElement.lastElementChild.style.display = "none";
            }
            // Hide Error Icon
            inputs[i].parentElement.children[2].style.display = "none";
          }
          // Selects All Original Grade Container Spans
          const originalGradeSpan = document.querySelectorAll("span.originalGrade");
          // Loop Through All Custom Grade Spans
          for (let i = 0; i < finalCustomGrades.length; i++) {
            const firstGradeChild = originalGradeSpan[i].parentElement.firstElementChild;
            // Only Run On Classes With A Custom Grade
            if (finalCustomGrades[i] !== null) {
              const changedGrades = document.getElementById("changedGrades");
              // Show Grade Changed Warning
              changedGrades.style.display = "block";
              // Remove Custom Grade Span If It Exists
              if (firstGradeChild.className === "customGrade") {
                firstGradeChild.remove();
              }
              // Hide Original Grade
              firstGradeChild.style.display = "none";
              // Get Data On Custom Grade
              const gradeData = convertGrades([finalCustomGrades[i]]);
              // Define All Necessary Items From GradeData
              const customNumberGrade = gradeData[0].Number_Grade;
              const customLetterGrade = gradeData[0].Letter_Grade;
              const customGpaGrade = gradeData[0].GPA_Grade;
              const customGradeType = gradeData[0].Grade_Type;
              const customGradeIcon = gradeData[0].Grade_Icon;
              const customGradeColor = gradeData[0].Grade_Color;
              // Get Default Grade View
              const gradeView = localStorage.getItem("DefaultGradeView");
              // Only Show Grade View Which Is Default
              let numView = "none";
              let letterView = "none";
              let gpaView = "none";
              if (gradeView === "number") {
                numView = "initial";
              }
              if (gradeView === "letter") {
                letterView = "initial";
              }
              if (gradeView === "gpa") {
                gpaView = "initial";
              }
              // Add Custom Grade Span Below Original Grade Span
              // Set All Custom Grades HTML
              originalGradeSpan[i].insertAdjacentHTML("beforebegin", `
                <span class="customGrade" style="display: initial">
                  <span class="numberGrade" style="display: ${numView}; color: ${customGradeColor};" data-numbergrade="${customNumberGrade}" data-lettergrade="${customLetterGrade}" data-gpagrade="${customGpaGrade}" data-gtype="${customGradeType}">
                    <img src="${customGradeIcon}"> ${customNumberGrade}
                  </span>
                  <span class="letterGrade" style="display: ${letterView}; color: ${customGradeColor}" data-numbergrade="${customNumberGrade}" data-lettergrade="${customLetterGrade}" data-gpagrade="${customGpaGrade}" data-gtype="${customGradeType}">
                    <img src="${customGradeIcon}"> ${customLetterGrade}
                  </span>
                  <span class="gpaGrade" style="display: ${gpaView}; color: ${customGradeColor}" data-numbergrade="${customNumberGrade}" data-lettergrade="${customLetterGrade}" data-gpagrade="${customGpaGrade}" data-gtype="${customGradeType}">
                    <img src="${customGradeIcon}"> ${customGpaGrade}
                  </span>
                </span>
                `);
              // Select All Visible Grades
              const allVisibleGradesSpans = document.querySelectorAll("span[style='display: initial'] > span.numberGrade");
              // Array To Hold All Visible Grades
              const allVisibleGrades = [];
              allVisibleGradesSpans.forEach(e => {
                const grade = parseFloat(e.innerText);
                // Push All Visible Grades To Array
                allVisibleGrades.push(grade);
              });
              let customGradeAverage = calculateAverage(allVisibleGrades);
              customGradeAverage = Math.round(customGradeAverage * 100) / 100;
              setAverage(customGradeAverage, true);
            }
          }
        } else {
          inputs.forEach(e => {
            if (e.value > 110 || e.value < 0) {
              e.parentElement.children[2].style.display = "initial";
            }
          });
          // Select Grades Too High Error
          const gradesTooHigh = document.getElementById("gradesTooHigh");
          // Show Error
          gradesTooHigh.style.display = "block";
          // Hide Error After 5 Seconds
          setTimeout(() => {
            gradesTooHigh.style.display = "none";
          }, 5000);
        }
      } else {
        // Selects Changed Grades Warning
        const changedGrades = document.getElementById("changedGrades");
        // Hide Grade Changed Warning
        changedGrades.style.display = "none";
        // Selects All Grade Edited Icons
        const editedGradeIcon = document.querySelectorAll("img.isEdit");
        // Hides All Grade Edited Icons
        editedGradeIcon.forEach(e => {
          e.style.display = "none";
        });
        // Selects Grades Not Changed Error
        const gradesNotChanged = document.getElementById("gradesNotChanged");
        // Show Error
        gradesNotChanged.style.display = "block";
        // Hide Error After 5 Seconds
        setTimeout(() => {
          gradesNotChanged.style.display = "none";
        }, 5000);
      }
    });

    // Save Button
    document.getElementById("saveButton").addEventListener("click", () => {
      // Selects All The Grade Container Elements
      const gradeSpan = document.querySelectorAll("table#progress-card > tbody > tr > td > span.originalGrade > span.numberGrade");
      // All The Original Grades Are Pushed Into This Array
      const allOriginalGrades = [];
      // Push All Original Grades Into Above Array
      gradeSpan.forEach(e => {
        // Make Sure To Use ParseFloat NOT ParseInt B/C ParseFloat Leaves Decimals Intact
        allOriginalGrades.push(parseFloat(e.innerText));
      });
      // Do Correct Action Based On Button Name
      if (document.getElementById("saveButton").innerText === "Save") {
        // Change Button Name After Click
        document.getElementById("saveButton").innerText = "Delete";
        // Selects All Grade Changer Inputs
        const inputs = document.querySelectorAll("div#gradeChanger > form > span> input");
        // All Custom Grades Will Be Pushed Into This
        const customGrades = [];
        // Put All Custom Grades In An Array
        inputs.forEach(e => {
          customGrades.push(parseFloat(e.value));
        });
        // Do This If Grades Have Changed
        if (compareArrays(allOriginalGrades, customGrades) === false) {
          // All Final Custom Grades Will Be Pushed Into This
          const finalCustomGrades = [];
          // Loop Over All Grades
          for (let i = 0; i < allOriginalGrades.length; i++) {
            let grade;
            // If Grade Is Not Changed Push Null
            if (allOriginalGrades[i] === customGrades[i]) {
              grade = null;
            }
            // If Grade Is Different Push Custom Grade
            if (allOriginalGrades[i] !== customGrades[i]) {
              grade = customGrades[i];
            }
            // Push Grades To Array
            finalCustomGrades.push(grade);
          }
          // NOTE THE ARRAY MUST BE A STRING TO SAVE TO LOCALSTORAGE THUS THE ARRAY IS CONVERTED TO A STRING WITH JSON.STRINGIFY
          localStorage.setItem("CustomGrades", JSON.stringify(finalCustomGrades));
        } else {
          // Select Grades Not Changed Error
          const gradesNotChanged = document.getElementById("gradesNotChanged");
          // Show Error
          gradesNotChanged.style.display = "block";
          // Hide Error After 5 Seconds
          setTimeout(() => {
            gradesNotChanged.style.display = "none";
          }, 5000);
          // Change Button Name Back To "Save" B/C No Grades Have Changed
          document.getElementById("saveButton").innerText = "Save";
        }
      } else if (document.getElementById("saveButton").innerText === "Delete") {
        // Remove Custom Grades
        localStorage.removeItem("CustomGrades");
        // Change Button Name To "Save" After Click
        document.getElementById("saveButton").innerText = "Save";
      }
    });
  }
});

// Only Run If The Progress Card Exists
if (document.getElementById("progress-card") !== null) {
  // Creating The Average Container HTML
  document.getElementsByClassName("notification information")[0].insertAdjacentHTML("afterbegin", `
  <span id="averageContainer" title="Click For More Info">
    <a id="averageParent" style="display: initial; color: #585b66; position: static; float: right; padding-top: 10px; padding-right: 10px; cursor: pointer">
      Total Average:
      <img id="averageIcon" />
      <span style="display: initial;" class="numberGrade" id="totalAverage"></span>
      <span style="display: none;" class="letterGrade" id="totalAverage"></span>
      <span style="display: none;" class="gpaGrade" id="totalAverage"></span>
    </a>
  </span>
  `);
  // Selects All The Grade Container Elements
  const gradeSpan = document.querySelectorAll("table#progress-card > tbody > tr > td > span");
  // All The Original Grades Are Pushed Into This Array
  const allOriginalGrades = [];
  // Push All Original Grades Into Above Array
  gradeSpan.forEach(e => {
    // Make Sure To Use ParseFloat NOT ParseInt B/C ParseFloat Leaves Decimals Intact
    allOriginalGrades.push(parseFloat(e.innerText));
  });
  // Returns The Average Of All The Original Grades, In Some Cases As A Float
  const rawAverage = calculateAverage(allOriginalGrades);
  // Rounds The RawAverage In Case It Is A Float To The Hundredths Place (2 After Decimal)
  // NOTE DO NOT USE ParseFloat WITH ToFixed AS IT WILL LEAVE TRAILING ZEROS IF A WHOLE NUMBER IS PASSED
  const average = Math.round(rawAverage * 100) / 100;
  // Call SetAverage Function To Set The Average, With Automatic Data (Colors, Icons, etc..)
  setAverage(average);
  // Create Alternate Elements For Each Class Grade With Different Grading Standards
  gradeSpan.forEach(e => {
    // Original Grade
    const grade = parseFloat(e.innerText);
    // Get Data On Original Grade
    const gradeData = convertGrades([grade]);
    // Define All Necessary Items From GradeData
    const gradeColor = gradeData[0].Grade_Color;
    const numGrade = gradeData[0].Number_Grade;
    const letterGrade = gradeData[0].Letter_Grade;
    const gpaGrade = gradeData[0].GPA_Grade;
    const gradeType = gradeData[0].Grade_Type;
    const gradeIcon = gradeData[0].Grade_Icon;
    // Create The HTML For The Alternate Elements With Correct Data
    const numberGradeHTML = `
    <span class="numberGrade" style="color: ${gradeColor}; display: initial;" data-numbergrade="${numGrade}" data-lettergrade="${letterGrade}" data-gpagrade="${gpaGrade}" data-gtype="${gradeType}">
    <img src="${gradeIcon}"> ${numGrade}</span>
    `;
    const letterGradeHTML = `
    <span class="letterGrade" style="display: none; color: ${gradeColor}" data-numbergrade="${numGrade}" data-lettergrade="${letterGrade}" data-gpagrade="${gpaGrade}" data-gtype="${gradeType}">
    <img src="${gradeIcon}"> ${letterGrade}</span>
    `;
    const gpaGradeHTML = `
    <span class="gpaGrade" style="display: none; color: ${gradeColor}" data-numbergrade="${numGrade}" data-lettergrade="${letterGrade}" data-gpagrade="${gpaGrade}" data-gtype="${gradeType}">
    <img src="${gradeIcon}"> ${gpaGrade}</span>
    `;
    // Append The HTML Before The Original Grade Element
    e.insertAdjacentHTML("beforebegin", `<span style="display: initial" class="originalGrade">${numberGradeHTML}${letterGradeHTML}${gpaGradeHTML}</span>`);
    // Set The Original Grade HTML To Nothing To Remove It
    e.outerHTML = ``;
  });
  // If Custom Grades Are Avaliable Run LoadSavedGrades Function
  if (localStorage.getItem("CustomGrades") !== null) {
    loadSavedGrades();
  }
  // Set Default Grade View If It Does Not Exist
  if (localStorage.getItem("DefaultGradeView") === null) {
    localStorage.setItem("DefaultGradeView", "number");
  }
  // Default Grade View
  const gradeView = localStorage.getItem("DefaultGradeView");
  // Change Current View To Default Grade View
  setGradeView(gradeView);

  // Detailed Average Info On Average Container Click
  document.getElementById("averageContainer").addEventListener("click", () => {
    // Select The Average Anchor Element
    const averageAnchor = document.querySelectorAll("span#averageContainer > a");
    // The Current Average
    let visibleAverage = [];
    averageAnchor.forEach(e => {
      // If Element Is Visible Get Average Value
      if (e.style.display == "initial") {
        const average = parseFloat(e.childNodes[3].innerText.replace(/[^0-9.]/g, ""));
        // Push Average To Array
        visibleAverage.push(average);
      }
    });
    // Get Data On Visible Average
    const gradeData = convertGrades(visibleAverage);
    // Define All Necessary Items From GradeData
    const numGrade = gradeData[0].Number_Grade;
    const letterGrade = gradeData[0].Letter_Grade;
    const gpaGrade = gradeData[0].GPA_Grade;
    // NOTE FACEBOX IS A DEFAULT LIBRARY PUPILPATH USES
    // Setting Up Average Detail's Modal
    jQuery.facebox(`
      <div id="averageInfo">
        <h2>Average Conversion</h2>
        <h4>Percent Grade: ${numGrade}%</h4>
        <h4>Letter Grade: ${letterGrade}</h4>
        <h4>GPA: ${gpaGrade}</h4>
        <form>
          <label for="numberView" style="display: initial;" title="Show all grades as numbers">
            <input id="numberView" type="radio" name="gradeType" value="number">
            Number Grades
          </label>
          <label for="letterView" style="display: initial;" title="Show all grades as letters">
            <input id="letterView" type="radio" name="gradeType" value="letter">
            Letter Grades
          </label>
          <label for="gpaView" style="display: initial;"  title="Show all grades as gpa's">
            <input id="gpaView" type="radio" name="gradeType" value="gpa">
            GPA Grades
          </label>
        </form>
      </div>
      `);
    // Selects Default Grade View LocalStorage Item
    const gradeView = localStorage.getItem("DefaultGradeView");
    // Select All Necessary Elements Through Variables
    const numberViewRadio = document.getElementById("numberView");
    const letterViewRadio = document.getElementById("letterView");
    const gpaViewRadio = document.getElementById("gpaView");
    // Enable The Radio Button With The Currently Active Grade View
    if (gradeView === "number") {
      numberViewRadio.checked = true;
    }
    if (gradeView === "letter") {
      letterViewRadio.checked = true;
    }
    if (gradeView === "gpa") {
      gpaViewRadio.checked = true;
    }
    // This Is To Remove The Default 600px Width On FaceBox Element
    document.getElementById("averageInfo").parentElement.parentElement.style = "width: auto";

    // Change Grade View Type On Click
    document.querySelector("div#averageInfo > form").addEventListener("click", () => {
      // Select Form Element
      const form = document.querySelector("div#averageInfo > form");
      // Get User Selection From Form
      const data = new FormData(form);
      let choice;
      // Loop Through Form Data To Find User Choice
      for (const entry of data) {
        choice = entry[1];
      }
      setGradeView(choice);
    });
  });
}
