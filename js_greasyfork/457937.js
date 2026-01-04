// ==UserScript==
// @name         Toggle for Practice-It
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Toggles only the completed assignments on Practice-It
// @author       Chi_BC#1828
// @match        https://practiceit.cs.washington.edu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457937/Toggle%20for%20Practice-It.user.js
// @updateURL https://update.greasyfork.org/scripts/457937/Toggle%20for%20Practice-It.meta.js
// ==/UserScript==

(function () {
  const html = `
<div class="ui_overlay">
    <label class="switch" for="result_toggle">
        <input type="checkbox" id="result_toggle" checked />
        <span class="slider" title="TOGGLE ME" ></span>
    </label>
</div>
`;
  const toggleStyles = `
a.problemlink {
    display: none;
}
li.solvedproblem a {
    display: block;
}
.ui_overlay {
    position: fixed;
    display: block;
    top: 4rem;
    right: 2rem;
}
.slider {
    color: green;
}
.switch input
{
  display: none;
}
.switch
{
  display: inline-block;
  position: relative;
  width: 60px;
  height: 30px;
}
.slider
{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 999px;
  box-shadow: 0 0 0 2px #777, 0 0 4px #777;
  cursor: pointer;
  border: 4px solid transparent;
  overflow: hidden;
  transition: 0.2s;
}
.slider:before
{
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  background-color: #777;
  border-radius: 999px;
  transform: translateX(-30px); /*translateX(-(w-h))*/
  transition: 0.2s;
}
input:checked + .slider:before
{
  transform: translateX(30px); /*translateX(w-h)*/
  background-color: limeGreen;
}
input:checked + .slider
{
  box-shadow: 0 0 0 2px limeGreen, 0 0 4px limeGreen;
}
`;
  const div = document.createElement("div");
  const injectStyle = document.createElement("style");
  div.innerHTML = html;
  injectStyle.textContent = toggleStyles;
  document.body.appendChild(div);
  document.head.appendChild(injectStyle);

  const toggleCheckBox = document.getElementById("result_toggle");
  toggleCheckBox.addEventListener("change", () => {
    if (toggleCheckBox.checked) {
      document.querySelector(".slider").style.color = "green";
      document.styleSheets[
        document.styleSheets.length - 1
      ].cssRules[0].style.display = "none";
      console.log("ONLY SHOW SOLVED PROBLEMS");
    } else {
      document.styleSheets[
        document.styleSheets.length - 1
      ].cssRules[0].style.display = "block";
      console.log("SHOW EVERYTHING");
      document.querySelector(".slider").style.color = "#305066";
    }
  });
})();