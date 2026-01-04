// ==UserScript==
// @name     AttendanceOwingHider
// @description stops the dispaly on owing balance on attendance screen
// @version  1
// @grant    unsafewindow
// @run-at   document-end
// @match 	 https://b1101334.simplyswim.net.au/main*
// @require https://code.jquery.com/jquery-3.5.0.js
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/1088091
// @downloadURL https://update.greasyfork.org/scripts/470249/AttendanceOwingHider.user.js
// @updateURL https://update.greasyfork.org/scripts/470249/AttendanceOwingHider.meta.js
// ==/UserScript==
//--- The @grant directive is used to restore the proper sandbox.


// Find all div elements with the class table_wrapper_inner
var tableWrapperInnerDivs = document.querySelectorAll('.table_wrapper_inner');

// Iterate over the div elements
tableWrapperInnerDivs.forEach(function(tableWrapperInner) {
  // Find all b elements within each div
  var bElements = tableWrapperInner.getElementsByTagName('b');

  // Iterate over the b elements
  for (var i = 0; i < bElements.length; i++) {
    var bElement = bElements[i];

    // Find all span elements within each b element
    var spanElements = bElement.getElementsByTagName('span');

    // Remove the span elements
    for (var j = spanElements.length - 1; j >= 0; j--) {
      var spanElement = spanElements[j];
      spanElement.parentNode.removeChild(spanElement);
    }
  }
});
