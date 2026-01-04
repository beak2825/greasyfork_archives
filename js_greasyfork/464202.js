// ==UserScript==
// @name         Clicker Made {by uzi}
// @match        https://*.tankionline.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tankionline.com
// @version      9.0
// @author       uzi
// @description  ez
// @namespace https://greasyfork.org/users/914747
// @downloadURL https://update.greasyfork.org/scripts/464202/Clicker%20Made%20%7Bby%20uzi%7D.user.js
// @updateURL https://update.greasyfork.org/scripts/464202/Clicker%20Made%20%7Bby%20uzi%7D.meta.js
// ==/UserScript==

(function() {
  var intervalId;
  var isClicking = false;

  function startClicking() {
    if (isClicking) return;

    var ms = document.getElementById("msInput").value;
    var hashKey = document.getElementById("hashKeyInput").value;
    var clickNumber = document.getElementById("clickNumberInput").value;

    if (!clickNumber || isNaN(clickNumber)) {
      alert("Please enter a valid number to start clicking.");
      return;
    }

    isClicking = true;
    var i = 0;
    intervalId = setInterval(function() {
      if (document.hidden) {
        stopClicking();
        return;
      }

      if (document.querySelector('input[name="authenticity_token"]')) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/ajax/hub/keyboard_trust_event/", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("authenticity_token=" + encodeURIComponent(document.querySelector('input[name="authenticity_token"]').value) + "&trust_event=KeyboardInputEvent&hashed_input=" + encodeURIComponent(hashKey));
      }

      i++;
      if (i >= clickNumber) {
        stopClicking();
      }
    }, ms);
  }

  function stopClicking() {
    if (!isClicking) return;

    clearInterval(intervalId);
    isClicking = false;
  }

  // Add HTML elements for the user input
  var container = document.createElement("div");
  container.innerHTML = `
    <label for="msInput">Enter milliseconds between clicks:</label>
    <input type="number" id="msInput" min="0.1" value="1"><br><br>

    <label for="hashKeyInput">Enter hash key:</label>
    <input type="text" id="hashKeyInput"><br><br>

    <label for="clickNumberInput">Enter any number to start clicking:</label>
    <select id="clickNumberInput">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>

    <button onclick="startClicking()">0</button>
    <button onclick="stopClicking()">0</button>
  `;
  
  // Add the HTML elements to the page
  document.body.appendChild(container);
})();
