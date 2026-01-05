// ==UserScript==
// @name         SIM Undergrad Student Timetable iCal Generator
// @version      1.2
// @namespace    https://simconnect.simge.edu.sg/
// @namespace    https://simconnect1.simge.edu.sg/
// @description  Adds a "Download iCalendar .ics" button to SIMConnect timetable list view.
// @include      https://simconnect1.simge.edu.sg:444/psc/csprd*/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_LIST.GBL*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/23052/SIM%20Undergrad%20Student%20Timetable%20iCal%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/23052/SIM%20Undergrad%20Student%20Timetable%20iCal%20Generator.meta.js
// ==/UserScript==
/*=====================================================
  Thanks
======================================================

  Travis Krause - ics.js
  Kyle Hornberg - ics.js
  Eli Grey - FileSaver.js, Blob.js

=======================================================
  Script
======================================================*/
(function () {
  "use strict";

  //Takes in a date (type:string) of the format DD/MM/YYYY, returns the date in the format MM/DD/YYYY.
  function convertDateFormat(dateString) {
    var splitArr = dateString.split("/");
    return splitArr[1] + "/" + splitArr[0] + "/" + splitArr[2];
  }

  //Takes in a range (type:string) and splits at the hyphen, returns an array of both split sides.
  function splitRange(inputRange) {
    var splitArr = inputRange.split(" - ");
    return splitArr;
  }

  function iCalGen() {
    observer.disconnect();
    //Parse Tables and Assign Events into iCal variable
    var cal = ics();
    var moduleNameArr = document.getElementsByClassName("PAGROUPDIVIDER"); //Module Name Element
    for (i = 0; i < moduleNameArr.length; i++) {
      var moduleName = (moduleNameArr[i].innerText);
      var classDescription = "";
      var moduleClassTable = document.getElementById("CLASS_MTG_VW$scroll$" + i); //Table Element Containing Class Listings
      var moduleClassRows = moduleClassTable.getElementsByTagName("tr");
      for (j = 1; j < moduleClassRows.length; j++) {
        var moduleClassColumns = moduleClassRows[j].children;
        //Checks for component header (Lecture/Tutorial) and refreshes description.
        if (moduleClassColumns[0].firstElementChild.firstElementChild.innerHTML != "&nbsp;") {
          classDescription = moduleClassColumns[1].firstElementChild.firstElementChild.innerText + " " + moduleClassColumns[2].firstElementChild.firstElementChild.innerText;
        }
        //Parses for and formats rest of required variables.
        var timeRange = moduleClassColumns[3].firstElementChild.firstElementChild.innerText.slice(3);
        timeRange = timeRange.replace(new RegExp("AM", 'g'), " AM"); //Formatting for ics.js
        timeRange = timeRange.replace(new RegExp("PM", 'g'), " PM"); //Formatting for ics.js
        timeRange = splitRange(timeRange);
        var startTime = timeRange[0];
        var endTime = timeRange[1];
        var dateRange = moduleClassColumns[6].firstElementChild.firstElementChild.innerText;
        dateRange = splitRange(dateRange);
        var startDate = convertDateFormat(dateRange[0]);
        var endDate = convertDateFormat(dateRange[1]);
        var location = moduleClassColumns[4].firstElementChild.firstElementChild.innerText;
        //Adds events into calendar object.
        cal.addEvent(moduleName, classDescription, location, startDate + " " + startTime, endDate + " " + endTime);
      }
    }

    //Gets Footer Section
    var footerId = document.URL.match(/csprd_(\d+)/);
    if (footerId !== null) {
      footerId = "win" + footerId[1] + "divDERIVED_SSTSNAV_SSS_SUBFOOT_LINKS";
    }
    else {
      footerId = "win0divDERIVED_SSTSNAV_SSS_SUBFOOT_LINKS";
    }
    var footerDiv = document.getElementById(footerId);
    var footerRow = footerDiv.getElementsByTagName("tr");

    //Create Separator Cell
    var footerSep = document.createElement('td');
    footerSep.innerHTML = "&nbsp;";
    var footerSep2 = footerSep.cloneNode(true);
    var footerSep3 = footerSep.cloneNode(true);

    //Create Download Link Cell
    var downloadIcs = document.createElement('a');
    downloadIcs.onclick = function () {
      cal.download('Timetable');
    };
    downloadIcs.id = "downloadIcs";
    downloadIcs.href = "javascript:;";
    downloadIcs.className = "SSSFOOTERLINK";
    downloadIcs.appendChild(document.createTextNode('Download iCalendar .ics'));
    var downloadIcsCell = document.createElement('td');
    downloadIcsCell.appendChild(downloadIcs);

    //Appends New Cells
    footerRow[0].appendChild(footerSep);
    footerRow[0].appendChild(downloadIcsCell);
    footerRow[0].appendChild(footerSep2);
    footerRow[0].appendChild(footerSep3);
    observer.observe(targetNode, config);
  }

  var targetNode = document.documentElement;
  var config = {
    attributes: false,
    childList: true,
    subtree: true
  };
  var observer = new MutationObserver(
    function (mutationsList, observer) {
      if (document.getElementById("ACE_STDNT_ENRL_SSV2$0") != null && document.getElementById("downloadIcs") == null) {
        iCalGen();
      }
    }
  );
  iCalGen();
})();