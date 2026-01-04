// ==UserScript==
// @name     SimplySwimFontSize
// @description Font Resizer for Simply Swim
// @version  1.5
// @grant    unsafewindow
// @run-at   document-end
// @match https://*.simplyswim.net.au/*
// @require https://code.jquery.com/jquery-3.5.0.js
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/1088091
// @downloadURL https://update.greasyfork.org/scripts/470172/SimplySwimFontSize.user.js
// @updateURL https://update.greasyfork.org/scripts/470172/SimplySwimFontSize.meta.js
// ==/UserScript==
//--- The @grant directive is used to restore the proper sandbox.


var fontSelectors = ['.first td','.first a', '.forms input', '.forms a', '.forms select','span','.table_wrapper_inner td','.table_wrapper_inner a','.table_wrapper_inner select','.table_wrapper_inner input','.row','.dhx_body','.dhx_title'];
	var scalar = 0.5
  var toggleState = false;


(function() {
  'use strict';

  // Define a helper function to add CSS styles dynamically
  function addStyles(styles) {
    var styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }

  // CSS styles for the large font size
  var largeFontStyles = `
    .large-font {
      font-size: 18px !important;
    }
  `;

  // Add the large font styles to the document
  addStyles(largeFontStyles);

  // Create a button element
  var toggleButton = document.createElement('button');
  toggleButton.textContent = 'Toggle Font Size';

  var targetElement = document.querySelector('#main_menu > ul:nth-child(1) > li:nth-child(12)');
  
  // Add the button to the document body
  targetElement.insertAdjacentElement('afterend', toggleButton);


  //array of selectors
  

  // Add event listener to the button
  function handleToggleClick() {
  doubleElementHeight('.dhx_cal_data');
  fontSelectors.forEach(function(selector) {
    var elements = document.querySelectorAll(selector);

    // Toggle the font size class for elements
    elements.forEach(function(element) {
      if (toggleState) {
        element.classList.remove('large-font');
      } else {
        element.classList.add('large-font');
      }
    });

  });
  
	replaceCommas();  
  toggleState = !toggleState;
    
}
  
window.addEventListener('DOMContentLoaded', function() {
  //handleToggleClick(); // Apply the font size class on page load
});
  
  // Create a new MutationObserver instance
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    replaceCommas();
    var isActiveUnitTab = document.querySelector('.active[name="unit_tab"]');

if (isActiveUnitTab) {
    // Get the width from any element with class 'scale_bar'
var scaleCalElements = document.querySelector('.dhx_cal_header');
var width = (scaleCalElements.offsetWidth+10)/10;
var scaleBarElements = document.querySelectorAll('.dhx_scale_bar');
var scaleholderElements = document.querySelectorAll('.dhx_scale_holder');
    scaleBarElements.forEach(function(element){
     	element.style.width = width +'px'; 
    });
    scaleholderElements.forEach(function(element){
     	element.style.width = width +'px'; 
    });
    scaleBarElements[6].style.width='10px';
    scaleBarElements[7].style.display = 'none';
    scaleBarElements[8].style.display = 'none';
    scaleBarElements[9].style.display = 'none';
    scaleBarElements[14].style.display = 'none';
    scaleholderElements[6].style.width='10px';
    scaleholderElements[7].style.display = 'none';
    scaleholderElements[8].style.display = 'none';
    scaleholderElements[9].style.display = 'none';
    scaleholderElements[14].style.display = 'none';
  	scaleholderElements[15].style.width='50px';
  	scaleBarElements[1].style.left = (parseInt(scaleBarElements[0].style.left) + width) + 'px';
  	scaleBarElements[2].style.left = (parseInt(scaleBarElements[1].style.left) + width) + 'px';
  	scaleBarElements[3].style.left = (parseInt(scaleBarElements[2].style.left) + width) + 'px';
  	scaleBarElements[4].style.left = (parseInt(scaleBarElements[3].style.left) + width) + 'px';
  	scaleBarElements[5].style.left = (parseInt(scaleBarElements[4].style.left) + width) + 'px';
  	scaleBarElements[6].style.left = (parseInt(scaleBarElements[5].style.left) + width) + 'px';
    scaleBarElements[10].style.left = (parseInt(scaleBarElements[6].style.left) + 10) + 'px';
    scaleBarElements[11].style.left = (parseInt(scaleBarElements[10].style.left) + width) + 'px';
    scaleBarElements[12].style.left = (parseInt(scaleBarElements[11].style.left) + width) + 'px';
    scaleBarElements[13].style.left = (parseInt(scaleBarElements[12].style.left) + width) + 'px';
  	scaleholderElements[1].style.left = (parseInt(scaleholderElements[0].style.left) + width) + 'px';
  	scaleholderElements[2].style.left = (parseInt(scaleholderElements[1].style.left) + width) + 'px';
  	scaleholderElements[3].style.left = (parseInt(scaleholderElements[2].style.left) + width) + 'px';
  	scaleholderElements[4].style.left = (parseInt(scaleholderElements[3].style.left) + width) + 'px';
  	scaleholderElements[5].style.left = (parseInt(scaleholderElements[4].style.left) + width) + 'px';
  	scaleholderElements[6].style.left = (parseInt(scaleholderElements[5].style.left) + width) + 'px';
  	scaleholderElements[10].style.left = (parseInt(scaleholderElements[6].style.left) + 10) + 'px';
    scaleholderElements[11].style.left = (parseInt(scaleholderElements[10].style.left) + width) + 'px';
    scaleholderElements[12].style.left = (parseInt(scaleholderElements[11].style.left) + width) + 'px';
    scaleholderElements[13].style.left = (parseInt(scaleholderElements[12].style.left) + width) + 'px';


// Set new widths for the elements
var dhxCalEventElements = document.querySelectorAll('.dhx_cal_event');
var dhxHeaderElements = document.querySelectorAll('.dhx_header');
var dhxTitleElements = document.querySelectorAll('.dhx_title');
var dhxBodyElements = document.querySelectorAll('.dhx_body');
var dhxFooterElements = document.querySelectorAll('.dhx_footer');

// Iterate over the elements and apply the new widths
dhxCalEventElements.forEach(function(element) {
  element.style.width = width + 'px';
  element.style.left = '0px';
});

dhxHeaderElements.forEach(function(element) {
  element.style.width = (width - 4) + 'px';
});

dhxTitleElements.forEach(function(element) {
  element.style.width = (width - 2) + 'px';
});

dhxBodyElements.forEach(function(element) {
  element.style.width = (width - 12) + 'px';
});

dhxFooterElements.forEach(function(element) {
  element.style.width = (width - 6) + 'px';
});
}
    // Check if the mutation is on an element with the .dhx_cal_tab class
    if (mutation.target.classList.contains('dhx_cal_tab') && mutation.target.classList.contains('active') && toggleState) {
      handleToggleClick();
    }
  });
});

// Target elements to observe (replace with the actual target elements)
var targetElements = document.querySelectorAll('.dhx_cal_tab');

// Start observing the target elements for mutations
targetElements.forEach(function(element) {
  observer.observe(element, { attributes: true });
});


function waitingForLoad() {
  var dhxScaleTest = document.querySelector('.dhx_cal_event');
  if (dhxScaleTest === null) {
    setTimeout(waitingForLoad, 100);
  } else {
    //element found, do something
    replaceCommas();
    //handleToggleClick();
  }
}

waitingForLoad();

  
  
  
  
toggleButton.addEventListener('click', handleToggleClick);
})();


function doubleElementHeight(selector) {
  var elements = document.querySelectorAll(selector);
  elements.forEach(function(element) {
    var dhxScaleHour = document.querySelector('div.dhx_scale_hour:nth-child(1)');
    
		if (dhxScaleHour.style.height === '199px') {
      if(!toggleState){
  			scalar = 2;
      }else{
        toggleState = !toggleState
        scalar = 2;
      }
		} 
    if(dhxScaleHour.style.height === '398px') {
      scalar = 0.5;
		}
    
    doubleHeightRecursively(element);
    scalar = 1/scalar
    var height = window.getComputedStyle(element).height;
    var newHeight = parseFloat(height) * scalar;
    element.style.height = newHeight + 'px';
    var top = window.getComputedStyle(element).top;
  	var newTop = parseFloat(top) * scalar;
  	element.style.top = newTop + 'px';
  });
}

function doubleHeightRecursively(element) {
  var height = window.getComputedStyle(element).height;
  var newHeight = parseFloat(height) * scalar;
  element.style.height = newHeight + 'px';
  var top = window.getComputedStyle(element).top;
  var newTop = parseFloat(top) * scalar;
  element.style.top = newTop + 'px';

  var childElements = element.children;
  for (var i = 0; i < childElements.length; i++) {
    doubleHeightRecursively(childElements[i]);
  }
}

function replaceCommas(){
  var dhxBodyElements = document.querySelectorAll('.dhx_body');
dhxBodyElements.forEach(function(element) {
  element.innerHTML = element.innerHTML.replace(/,/g, '<br>');
});
}
  