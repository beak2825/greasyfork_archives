// ==UserScript==
// @name         Emne-hjelper
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Viser statistikk om NTNU-emner
// @author       RandomNoobster
// @match        https://www.ntnu.no/studier/emner/*
// @icon         https://www.ntnu.no/o/ntnu-theme/images/logoicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492784/Emne-hjelper.user.js
// @updateURL https://update.greasyfork.org/scripts/492784/Emne-hjelper.meta.js
// ==/UserScript==
 
(async function () {
  "use strict";
 
  // Hent emnekode fra URL
  const url = window.location.href;
  const start = url.indexOf("/emner/") + 7;
  const end = url.indexOf("/", start);
  const end2 = url.indexOf("#", start);
  const emnekode = end === -1 ? url.substring(start, end2) : url.substring(start, end);

  // Hent data fra API
  console.log(emnekode);
  const emnrResponse = await fetch(`https://api.emnr.no/course/${emnekode}/`);
  const emnrData = await emnrResponse.json();

  makePopUp(emnrData);
})();
 
function makePopUp(data) {
  // Create a div element for the popup
  const popup = document.createElement("div");
  popup.className = "popup";
 
  // Create a text element with the message
  const message = document.createElement("p");
  message.style.marginBottom = "0px";
 
  // Create link
  const emnrLink = document.createElement("a");
  emnrLink.style.display = "block";
  emnrLink.href = `https://emnr.no/course/${data.course_code}`;
  emnrLink.textContent = `Emnr: ${data.course_code}`;
  popup.appendChild(emnrLink);
 
  const karakterLink = document.createElement("a");
  karakterLink.style.display = "block";
  karakterLink.href = `https://www.karakterweb.no/ntnu/${data.course_code}`;
  karakterLink.textContent = `Karakterweb: ${data.course_code}`;
  popup.appendChild(karakterLink);
 
  const karakternetLink = document.createElement("a");
  karakternetLink.style.display = "block";
  karakternetLink.href = `https://karakterer.net/course/${data.course_code}`;
  karakternetLink.textContent = `Karakterer.net: ${data.course_code}`;
  popup.appendChild(karakternetLink);
 
  message.textContent += `
  Statistikk fra emnr.no:
  Beståttprosent: ${data.pass_rate.toFixed(2)}%
  Karakter/arbeid: ${(data.average_grade / data.average_workload).toFixed(2)}
  Antall reviews: ${data.review_count}
  `;
 
  // Append the elements to the popup
  popup.appendChild(message);
 
  // Create a slider for Arbeidsmengde
  const workloadSlider = document.createElement("input");
  workloadSlider.type = "range";
  workloadSlider.min = "0";
  workloadSlider.max = "2";
  workloadSlider.step = "0.01";
  workloadSlider.value = data.average_workload.toFixed(2);
  workloadSlider.style.width = "100%";
  workloadSlider.disabled = true;
 
  // Create a label for the workload slider
  const workloadLabel = document.createElement("p");
  workloadLabel.style.marginBottom = "0px";
  workloadLabel.textContent = `Arbeidsmengde: ${data.average_workload.toFixed(
    2
  )}`;
 
  // Append the workload slider and label to the message
  message.appendChild(workloadLabel);
  message.appendChild(workloadSlider);
 
  // Create a slider for Gjennomsnittskarakter
  const gradeSlider = document.createElement("input");
  gradeSlider.type = "range";
  gradeSlider.min = "0";
  gradeSlider.max = "5";
  gradeSlider.step = "0.01";
  gradeSlider.value = data.average_grade.toFixed(2);
  gradeSlider.style.width = "100%";
  gradeSlider.disabled = true;
 
  // Create a label for the grade slider
  const gradeLabel = document.createElement("p");
  gradeLabel.style.marginBottom = "0px";
  gradeLabel.textContent = `Gjennomsnittskarakter: ${data.average_grade.toFixed(
    2
  )} (${data.average_grade_letter})`;
 
  // Append the grade slider and label to the message
  message.appendChild(gradeLabel);
  message.appendChild(gradeSlider);
 
  // Add some CSS styles to style the popup
  popup.style.position = "fixed";
  popup.style.top = "10px";
  popup.style.right = "10px";
  popup.style.backgroundColor = "white";
  popup.style.padding = "15px";
  popup.style.border = "2px solid #003d99";
  popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
  popup.style.fontFamily = "Arial, sans-serif";
  popup.style.borderRadius = "10px";
  popup.style.zIndex = "999999";
  popup.style.cursor = "move"; // Set cursor style to indicate draggable
 
  // Style the message
  message.style.color = "#333"; // Dark gray text color
  message.style.whiteSpace = "pre-line"; // Allow for line breaks in the text
 
  let isDragging = false;
  let initialX, initialY, offsetX, offsetY;
 
  // Function to handle mouse down event
  function handleMouseDown(event) {
    isDragging = true;
    initialX = event.clientX;
    initialY = event.clientY;
    offsetX = popup.getBoundingClientRect().left;
    offsetY = popup.getBoundingClientRect().top;
  }
 
  // Function to handle mouse move event
  function handleMouseMove(event) {
    if (isDragging) {
      const dx = event.clientX - initialX;
      const dy = event.clientY - initialY;
      popup.style.left = offsetX + dx + "px";
      popup.style.top = offsetY + dy + "px";
      popup.style.right = null;
    }
  }
 
  // Function to handle mouse up event
  function handleMouseUp() {
    isDragging = false;
  }
 
  // Add event listeners for mouse events
  popup.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
 
  // Append the popup to the body of the page
  document.body.appendChild(popup);
}