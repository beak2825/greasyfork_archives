// ==UserScript==
// @name         Clickable Elements Highlighter
// @namespace    http://your-namespace-here
// @version      1.0.7
// @description  Highlights clickable elements on web pages.
// @match        http*://*/*
// @downloadURL https://update.greasyfork.org/scripts/467380/Clickable%20Elements%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/467380/Clickable%20Elements%20Highlighter.meta.js
// ==/UserScript==


// main.js

(function() {
  let effectEnabled = false;

  const clickableElements = document.querySelectorAll("a, button, input, select, textarea, [role=button], [role=link], [role=checkbox], [role=radio], [role=menuitem], [contenteditable=true]");
  clickableElements.forEach(element => {
    element.addEventListener("click", function(event) {
      this.style.border = "";
      event.stopPropagation();
    });
    element.addEventListener("mousedown", function(event) {
      if (event.which === 2) {
        this.style.border = "";
        event.stopPropagation();
      }
    });
  });

  // Call function to mark clickable elements in other JavaScript files


  // Toggle button for turning on/off the effect
  const toggleButton = document.createElement("button");
  toggleButton.textContent = "开启效果";
  toggleButton.style.position = "fixed";
  toggleButton.style.top = "10px";
  toggleButton.style.right = "-50px";
  toggleButton.style.padding = "10px";
  toggleButton.style.background = "white";
  toggleButton.style.border = "1px solid black";
  toggleButton.style.zIndex = "9999";
  toggleButton.style.borderRadius = "20px";


 

  toggleButton.addEventListener("click", function() {
    effectEnabled = !effectEnabled;

    if (effectEnabled) {
      toggleButton.textContent = "关闭效果";
      clickableElements.forEach(element => {
        element.style.border = "1px solid red";
      });
    } else {
      toggleButton.textContent = "开启效果";
      clickableElements.forEach(element => {
        element.style.border = "";
      });
    }
  });

    toggleButton.style.transition = "right 0.3s";

    toggleButton.addEventListener("mouseover", function() {
    toggleButton.style.right = "10px";
    toggleButton.style.display = "block";
});

toggleButton.addEventListener("mouseout", function() {
    toggleButton.style.right = "-50px";
    toggleButton.style.display = "block";
});

  document.body.appendChild(toggleButton);


})();
