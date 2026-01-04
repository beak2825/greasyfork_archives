// ==UserScript==
// @version 2.0
// @name           Brightspace Grade Append
// @include        https://ggc.view.usg.edu/d2l/home/*
// @description    The Grade Append userscript is used to add the student's current grade to the navigation wrapper.
// @description    This allows the student to keep track of their grade at all times without having to access the grade section of D2L.
// @namespace https://greasyfork.org/users/411524
// @downloadURL https://update.greasyfork.org/scripts/393216/Brightspace%20Grade%20Append.user.js
// @updateURL https://update.greasyfork.org/scripts/393216/Brightspace%20Grade%20Append.meta.js
// ==/UserScript==

var href = jQuery("a").attr("href");
var classID = href.replace('/d2l/home/', '');
console.log(classID);
appendGrade(classID);
function appendGrade(classID) {
    var newDiv = document.createElement("div");
    newDiv.setAttribute("id", "test");
    var currentDiv = document.getElementById("div1");
    var br = document.createElement("br");
    jQuery(document.getElementsByClassName("d2l-navigation-s-main-wrapper")[0].teclassIDtContent == "Grades").append(newDiv)
    var newContent = document.createTextNode("Grade: ");
    jQuery.each(jQuery('.d2l-navigation-s-main-wrapper div.d2l-navigation-s-item'), function(ind) {
        jQuery(this).attr('id', 'id-' + parseInt(ind + 1));
        jQuery(".d2l-navigation-s-main-wrapper").append(newContent,br,newDiv)
    });
    jQuery("#test").load( "/d2l/lms/grades/index.d2l?ou='" + classID + "' #z_i" );

}
