// ==UserScript==
// @name         Magma Pool time finder
// @namespace    magmapoolfinder
// @version      0.1
// @description  Finds your magma pool times in the background
// @match        http://www.neopets.com/magma/caves.phtml
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35086/Magma%20Pool%20time%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/35086/Magma%20Pool%20time%20finder.meta.js
// ==/UserScript==

var requests = 0;
var timedCheck;

$(document).ready(function(){
  //localStorage.removeItem("magmaTime");
  //return;
  //alert("hi");
  $('form[action="/explore.phtml"]').after('<br/><br/><span id="magmaPoolOutput"></span>');
  if (localStorage.magmaTime) {
    //alert(localStorage.magmaTime);
    $('#magmaPoolOutput').text("Your magma pool time is around: " + localStorage.magmaTime);
  } else {
    $('#magmaPoolOutput').text("Searching for magma pool time..");
    timedCheck = setInterval(function(){getPage();}, 1000*60*2);
    getPage();
  }
  //$('form[action="/explore.phtml"]').after('<br/><br/><button id="getpage">test</button>');
  //$('#getpage').click(function(e){getpage(e);});
});

function getPage() {
  //e.preventDefault();
  requests++;
  jQuery.ajax({
    url: "http://www.neopets.com/magma/pool.phtml",
    headers: {          
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Upgrade-Insecure-Requests": "1",
      "Cache-Control": "max-age=0"
    },
    // 'xhr' option overrides jQuery's default
    // factory for the XMLHttpRequest object.
    // Use either in global settings or individual call as shown here.
    xhr: function() {
      // Get new xhr object using default factory
      var xhr = jQuery.ajaxSettings.xhr();
      // Copy the browser's native setRequestHeader method
      var setRequestHeader = xhr.setRequestHeader;
      // Replace with a wrapper
      xhr.setRequestHeader = function(name, value) {
        // Ignore the X-Requested-With header
        if (name == 'X-Requested-With') return;
        // Otherwise call the native setRequestHeader method
        // Note: setRequestHeader requires its 'this' to be the xhr object,
        // which is what 'this' is here when executed.
        setRequestHeader.call(this, name, value);
      }
      // pass it on to jQuery
      return xhr;
    },

    success: function(data, textStatus, jqXHR) {
      //console.log(data);
      if(data.includes("guard_snoozing.jpg")) {
        var foundTime = $('#nst', data).text().trim();
        clearInterval(timedCheck);
        alert("Magma time found! " + foundTime);
        localStorage.magmaTime = foundTime;
        $('#magmaPoolOutput').text("Your magma pool time is around: " + foundTime);
      } else if(data.includes("guard_rejected.jpg")) {
        $('#magmaPoolOutput').text("Searching for magma pool time.. Attempts: "  + requests);
      }
    }
  });
}