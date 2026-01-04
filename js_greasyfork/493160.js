// ==UserScript==
// @name        BVLA Invoice Links
// @namespace   BVLA Invoice Links
// @description Fixes BVLA Invoice Links
// @license     MIT
// @author      joeltron
// @version     0.03
// @grant       none
// gettimley
// @include     *://*bvla.*
// @match       *://portal.bvla.com/JobHistory.aspx*
 
// @downloadURL https://update.greasyfork.org/scripts/493160/BVLA%20Invoice%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/493160/BVLA%20Invoice%20Links.meta.js
// ==/UserScript==

// Fix links
function bvlaFixLinks() {
    // get all elements
    elems=document.getElementsByClassName('InvoiceReportLink');

    // variables
    var reportType = null;
    var invoiceId = null;
     
    // cycle through elements
    for (var i = 0; i < elems.length; i++) {
        // invoice-id
        if(elems.item(i).hasAttribute('invoice-id')) {
            reportType="INVOICERPT";
            invoiceId = elems.item(i).getAttribute('invoice-id');
        }

        // job-id
        if(elems.item(i).hasAttribute('job-id')) {
            reportType="JOBINVOICERPT";
            invoiceId = elems.item(i).getAttribute('job-id');
        }

        // insert link
        elems.item(i).innerHTML = '<a target="_BLANK" href="https://portal.bvla.com/Handlers/ShowReport.ashx?ReportType='+reportType+'&EntityID='+invoiceId+'">💾&nbsp;'+elems.item(i).innerText+'</a>';
     
        // remove click action
        $(elems.item(i)).off()
    }

    // all done
    console.log("bvlaFixLinks complete");
}

// Observe function
var observeDOM = (function(){
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function( obj, callback ){
    if( !obj || obj.nodeType !== 1 ) return; 

    if( MutationObserver ){
      // define a new observer
      var mutationObserver = new MutationObserver(callback)

      // have the observer observe for changes in children
      mutationObserver.observe( obj, { childList:true, subtree:false })
      return mutationObserver
    }
  }
})()

// Observe DOM element:
var listElm = document.getElementById('ContentPlaceHolder1_UpdatePnl');
var currentlyFixing = false; // global
observeDOM( listElm, function(m){ bvlaFixLinks(); } );

// Page loaded
bvlaFixLinks();
//window.document.onload = function(e){ bvlaFixLinks(); };