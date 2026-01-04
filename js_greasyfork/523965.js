// ==UserScript==
// @name         Uniovi Course Hider
// @namespace    https://github.com/iamkingclutch3/UnioviCourseRemover
// @version      0.1
// @description  Disable elements in a course list based on data-courseid
// @author       kingclutch23
// @match        https://www.campusvirtual.uniovi.es/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/523965/Uniovi%20Course%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/523965/Uniovi%20Course%20Hider.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Add jQuery
  var jq = document.createElement("script");
  jq.src = "https://code.jquery.com/jquery-3.6.4.min.js";
  document.getElementsByTagName("head")[0].appendChild(jq);

  // Wait for jQuery to be ready
  jq.onload = function () {
    // Your script goes here
    main();
  };

  function main() {
    // Add checkboxes and move marked courses to the bottom
    $(".courses.frontpage-course-list-enrolled .coursebox").each(function () {
      var courseId = $(this).data("courseid");

      // Create a div with checkbox for each course element
      var checkboxDiv = $(
        '<div style="display: flex; justify-content: flex-end; align-items: center;"></div>'
      );
      var checkbox = $(
        '<input type="checkbox" class="disable-checkbox" data-courseid="' +
          courseId +
          '" style="margin-left: auto;">'
      );

      // Load saved state
      var savedState = GM_getValue(courseId, false);
      checkbox.prop("checked", savedState);

      // Save state when checkbox is clicked
      checkbox.on("change", function () {
        GM_setValue(courseId, $(this).prop("checked"));
      });

      // Append the checkbox div to the end of the course element and move marked courses to the bottom
      if ($(this).find(".disable-checkbox").length === 0) {
        $(this)
          .css("position", "relative")
          .append(checkboxDiv.append(checkbox));
      }

      // Load the checkbox state from localStorage
      var isChecked = localStorage.getItem("course_" + courseId);
      if (isChecked === "true") {
        checkbox.prop("checked", true);
        disableCourse(courseId);
        moveCourseToBottom(courseId);
      }
    });

    // Add a reset button
    var resetButton = $('<button id="resetButton">Reset Visibility</button>');
    $(".courses.frontpage-course-list-enrolled").prepend(resetButton);

    // Attach event listener to the checkboxes
    $(".disable-checkbox").change(function () {
      var courseId = $(this).data("courseid");

      // Toggle visibility based on checkbox state
      if ($(this).prop("checked")) {
        disableCourse(courseId);
        moveCourseToBottom(courseId);
        // Save the checkbox state to localStorage
        localStorage.setItem("course_" + courseId, "true");
      } else {
        enableCourse(courseId);
        // Remove the checkbox state from localStorage
        localStorage.removeItem("course_" + courseId);
      }
    });

    // Attach event listener to the reset button
    $("#resetButton").click(function () {
      // Reset visibility for all courses
      resetVisibility();
      // Clear all checkbox states from localStorage
      clearLocalStorage();
    });
  }

  function disableCourse(courseId) {
    $(
      '.courses.frontpage-course-list-enrolled .coursebox[data-courseid="' +
        courseId +
        '"]'
    ).css("opacity", "0.5");
    //$('.courses.frontpage-course-list-enrolled .coursebox[data-courseid="' + courseId + '"]').hide();
  }

  function enableCourse(courseId) {
    $(
      '.courses.frontpage-course-list-enrolled .coursebox[data-courseid="' +
        courseId +
        '"]'
    ).css("opacity", "1");
    //$('.courses.frontpage-course-list-enrolled .coursebox[data-courseid="' + courseId + '"]').show();
  }

  function resetVisibility() {
    $(".courses.frontpage-course-list-enrolled .coursebox").css("opacity", "1");
    //$('.courses.frontpage-course-list-enrolled .coursebox').show();
  }

  function moveCourseToBottom(courseId) {
    $(
      '.courses.frontpage-course-list-enrolled .coursebox[data-courseid="' +
        courseId +
        '"]'
    ).appendTo(".courses.frontpage-course-list-enrolled");
  }

  function clearLocalStorage() {
    // Clear all checkbox states from localStorage
    Object.keys(localStorage)
      .filter((key) => key.startsWith("course_"))
      .forEach((key) => localStorage.removeItem(key));
  }
})();
