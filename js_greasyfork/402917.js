// ==UserScript==
// @name     BrightSpace Grade View
// @namespace   cengique@users.sf.net
// @description Improve speed and accessibility of BrightSpace (Desire2Learn) gradebook interface
// @include     https://*.view.usg.edu/d2l/lms/grades/admin/enter/grade_category_edit.d2l*
// @include 	https://*.view.usg.edu/d2l/lms/grades/admin/enter/grade_item_edit.d2l*
// @require 	https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @version  1.2
// @grant    none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/402917/BrightSpace%20Grade%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/402917/BrightSpace%20Grade%20View.meta.js
// ==/UserScript==

// remove padding in grade enter matrix
addGlobalStyle('.daylight .d2l-grid[type="data"] > :only-child > tr > td { padding: 0px; }');
addGlobalStyle('.daylight .d2l-grid[type="data"] > :only-child > tr[header] > th { padding: 0px; }');

// make text boxes narrower (style hardcoded in elements :/ )
//addGlobalStyle('input.d_edt { max-width: 3rem; }');

removeScheme();
shrinkCols();

// Remove scheme and submission columns
function removeScheme() {
  Array.prototype.forEach.call(document.getElementsByClassName("d_hch"), function (e) {
    if ( e.colSpan == 3 ) {
        e.colSpan = 2;
    } else if ( e.colSpan == 4 ) {
        e.colSpan = 3;
    } } );
    var elements = document.getElementsByClassName("d_gc");
    console.log("deleting th scheme:");
    var td_th =
        Array.prototype.filter.call(elements, function(e) {
            var isDelete = ( !Array.prototype.includes.call(e.classList, "d_gn")
                          && ( !Array.prototype.includes.call(e.classList, "d_hch") || e.innerHTML.includes("Scheme") || e.innerHTML.includes("Submission") ) )
            && ( e.nodeName === "TD" || e.nodeName === "TH" );
            if (isDelete)
                console.log(e);
            return isDelete;
        } );
    console.log(td_th);
    // remove them
    td_th.forEach(function (e) { e.outerHTML = ''; } );
    console.log("deleting td Scheme:");
    var td_scheme = Array.prototype.filter.call(document.querySelector("td.d_gc"), function(e) {
        return false;
        var isDelete = ( !Array.prototype.includes.call(e.classList, "d_gc")
                      && Array.prototype.includes.call(e.classList, "d_gn")
                      && ( !Array.prototype.includes.call(e.classList, "d_hch") || e.innerHTML.includes("Submission") ) ) // || e.innerHTML.includes("Scheme")
        && ( e.nodeName === "TD" || e.nodeName === "TH" );
        if (isDelete)
            console.log(e);
        return isDelete;
      } );
    td_scheme.forEach(function (e) { e.outerHTML = ''; } );
}

// shrink input box columns
function shrinkCols() {
  var elements = document.getElementsByClassName("d_edt");
  Array.prototype.forEach.call(elements, function (e) { 
    if ( e.nodeName === "INPUT") {
      // remove all styling (width and max-width)
      e.style.cssText = "max-width: 2rem;";
      //console.log(e);
    }
  });

    Array.prototype.forEach.call(document.getElementsByTagName('d2l-input-number'), function (e) {
        e.setAttribute('input-width', '3rem');
        e.style.cssText = "max-width: 3rem;";
        //console.log(e);
    });
}

// Global style doesn't work when inline styles override them
function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}