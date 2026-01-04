// ==UserScript==
// @name     Font Size Controller
// @description   Control the font size of any webpage with a slider.
// @version  1.1.3
// @namespace https://github.com/amazing-fish
// @grant    GM_setValue
// @grant    GM_getValue
// @license  MIT
// @include  *
// @downloadURL https://update.greasyfork.org/scripts/479156/Font%20Size%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/479156/Font%20Size%20Controller.meta.js
// ==/UserScript==



window.addEventListener('load', function() {
  var isControllerEnabled = GM_getValue("isControllerEnabled", false);

  // Function to create a button
  function createButton(id, text, left, onclick, display = 'none') {
    var button = document.createElement('button');
    button.textContent = text;
    button.style = `position: fixed; top: 3px; background: rgba(0, 0, 0, 0.2); color: #fff; padding: 0px; font-size: 12px; left: ${left}px; z-index: 9999; display: ${display}; border: none`;
    button.id = id;
    button.onclick = onclick;
    return button;
  }

  // Create slider element
  var slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '10';
  slider.max = '32';
  slider.value = GM_getValue("fontSize", '16');
  slider.id = 'fontSlider';
  slider.style = 'position: fixed; top: 0; left: 0; z-index: 9999; display: none';

  // Create font size display element
  var fontSizeDisplay = document.createElement('div');
  fontSizeDisplay.id = 'fontSizeDisplay';
  fontSizeDisplay.textContent = 'Font Size: ' + slider.value + 'px';
  fontSizeDisplay.style = 'position: fixed; top: 3px; left: 140px; z-index: 9999; font-size: 10px; display: none';

  // Append slider and display to body
  document.body.appendChild(slider);
  document.body.appendChild(fontSizeDisplay);

  // Function to update font sizes
  function updateFontSizes() {
    var all = document.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) {
      // Exclude the control buttons
      if (!(all[i].id === 'fontSizeDisplay' || all[i].id === 'fontSlider' || all[i].id === 'enableButton' || all[i].id === 'disableButton' || all[i].id === 'expandButton' || all[i].id === 'hideButton')) {
        all[i].style.fontSize = slider.value + "px";
      }
    }
  }

  // Create tooltip element
  var tooltip = document.createElement('div');
  tooltip.id = 'sliderTooltip';
  tooltip.style = 'position: fixed; top: 25px; left: 0; z-index: 10000; background: rgba(0, 0, 0, 0.5); color: #fff; padding: 1px; font-size: 5px; display: none';
  document.body.appendChild(tooltip);

  // Event listener for slider
  slider.onmousemove = function(event) {
    fontSizeDisplay.textContent = 'Font Size: ' + this.value + 'px';
    tooltip.textContent = this.value;
    tooltip.style.left = event.pageX + 'px';
    tooltip.style.display = 'block';
    if (isControllerEnabled) {
      updateFontSizes();
      GM_setValue("fontSize", this.value);
    }
    tooltip.style.fontSize = '10px'

  }

  slider.onchange = function() {
    if (isControllerEnabled) {
      updateFontSizes();
      GM_setValue("fontSize", this.value);
    }
  }

  // Hide tooltip when mouse is not over the slider
  slider.onmouseout = function() {
    tooltip.style.display = 'none';
  }

  // Create buttons
  var expandButton = createButton('expandButton', '展开', 3, function() {
    ['fontSlider', 'fontSizeDisplay', 'hideButton'].forEach(function(id) {
      var element = document.getElementById(id);
      if(element) element.style.display = 'block';
    });

    if (isControllerEnabled) {
      document.getElementById('disableButton').style.display = 'block';
    } else {
      document.getElementById('enableButton').style.display = 'block';
    }

    this.style.display = 'none';
  }, 'block');

  var hideButton = createButton('hideButton', '收起', 250, function() {
    ['fontSlider', 'fontSizeDisplay', 'hideButton', 'disableButton', 'enableButton'].forEach(function(id) {
      var element = document.getElementById(id);
      if(element) element.style.display = 'none';
    });
    document.getElementById('expandButton').style.display = 'block';
  });

  var enableButton = createButton('enableButton', '开启', 220, function() {
    isControllerEnabled = true;
    GM_setValue("isControllerEnabled", isControllerEnabled);
    updateFontSizes();
    this.style.display = 'none';
    document.getElementById('disableButton').style.display = 'block';
  });

  var disableButton = createButton('disableButton', '关闭', 220, function() {
    isControllerEnabled = false;
    GM_setValue("isControllerEnabled", isControllerEnabled);
    this.style.display = 'none';
    document.getElementById('enableButton').style.display = 'block';
  });

  // Append buttons to body
  [expandButton, hideButton, enableButton, disableButton].forEach(function(button) {
    document.body.appendChild(button);
  });

  // Initial states
  if (isControllerEnabled) updateFontSizes();
});