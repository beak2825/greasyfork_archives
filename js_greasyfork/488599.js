// ==UserScript==
// @name        pocitanie salda
// @namespace   Violentmonkey Scripts
// @match       https://klient.humanet.sk/*
// @grant       none
// @version     1.3
// @author      Pysta
// @license MIT
// @description 2/29/2024, 7:50:11 AM
// @downloadURL https://update.greasyfork.org/scripts/488599/pocitanie%20salda.user.js
// @updateURL https://update.greasyfork.org/scripts/488599/pocitanie%20salda.meta.js
// ==/UserScript==
// script was 99% created by chatGPT
window.onload = function() {
    var counter = 0;

    // Get the table
    var table = document.getElementById("darE_roleAttendCalendarE_bcwe_workShifts_cmpData_Tbl");

    // Check if the table exists
    if (table) {
        // Get all rows of the table
        var rows = table.getElementsByTagName("tr");

        // Loop through each row starting from the second row
        for (var i = 1; i < rows.length; i++) {
            var row = rows[i];

            // Get the third cell
            var thirdCell = row.getElementsByTagName("td")[2];

            // Check if the third cell contains an anchor element with text
            if (thirdCell.querySelector("a").textContent.trim() !== "") {
                // Get the twelfth cell
                var twelfthCell = row.getElementsByTagName("td")[11];

                // Extract the text inside the span element
                var spanText = twelfthCell.querySelector("a > span").textContent.trim();

                // Get the ninth cell
                var ninthCell = row.getElementsByTagName("td")[8];

                // Extract the time in HH:MM format
                var time = ninthCell.querySelector("a").textContent.trim();
                var timeArray = time.split(":");
                var hours = parseInt(timeArray[0], 10);
                var minutes = parseInt(timeArray[1], 10);
                if (hours && minutes){
                  // Calculate the total minutes
                  var totalMinutes = hours * 60 + minutes;

                  // Compare with 4 hours for rows with "HO-i" text inside the span element
                  var threshold = (spanText === "HO-i") ? 4 * 60 : 7 * 60 + 30;

                  // Compare with the threshold
                  var difference = totalMinutes - threshold;
                  if (difference !== 0) {
                      // Append the difference to the existing text content of the span in the ninth cell
                      var existingText = ninthCell.textContent;
                      var sign = (difference > 0) ? "+" : "-";
                      ninthCell.textContent = existingText + " " + sign + Math.abs(difference) + 'm';
                  }

                  // Adjust the counter
                  if (difference > 0) {
                      ninthCell.style.color = "green";
                      counter += difference;
                  } else if (difference < 0) {
                      ninthCell.style.color = "red";
                      counter += difference;
                  }
                }


            }
        }
    }

    // Create a span element
    var span = document.createElement("span");
    span.textContent = counter + " minút rozdiel";

    // Check counter value and apply styles accordingly
    if (counter === 0) {
        span.style.color = "inherit"; // No color
    } else if (counter > 0) {
        span.style.color = "green";
    } else {
        span.style.color = "red";
    }

    // Get the target element
    var targetElement = document.getElementById("darE_roleAttendCalendarE_bcwe_workShifts_cmpData_title");

    // Append the span element to the target element
    if (targetElement) {
        targetElement.appendChild(span);
    }
};