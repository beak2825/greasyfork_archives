// ==UserScript==
// @name        eLearning Open Links
// @license     MIT
// @version     1
// @author      https://github.com/TwentyPorts
// @namespace   https://greasyfork.org/users/737264
// @include     https://*/webapps/blackboard/content/listContent.jsp?*
// @include     https://elearning.utdallas.edu/webapps/blackboard/execute/content/*
// @require     http://code.jquery.com/jquery-latest.js
// @description Open all links within an eLearning folder
// @downloadURL https://update.greasyfork.org/scripts/423613/eLearning%20Open%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/423613/eLearning%20Open%20Links.meta.js
// ==/UserScript==

// Make sure popups are allowed!

// Only tested with UT Dallas' eLearning

jQuery.noConflict(); // needed to prevent “element.dispatchEvent is not a function” error

jQuery(function ($) {
  $(document).ready(function () {
    // creating button
    $("#pageTitleDiv").append(
      '<input type="button" value="Open All Links" id="CP">'
    );
    $("#CP").css("position", "relative").css("top", 15);

    // handling click event
    $("#CP").click(function () {
      var hrefs = new Array();
      var elements = $("li.liItem >> [id^=anonymous_element_] > a"); // selects all list elements
      elements.each(function () {
        console.log('element loop');
        let link = $(this).attr("href");
        if (!link.includes("webapps/blackboard/content/listContent.jsp?")) // excludes folders
          hrefs.push(link);
      });
      console.log(hrefs.length);
      $.each(hrefs, function (index, value) {
        window.open(value, "_blank");
      });
    });
  });
});
