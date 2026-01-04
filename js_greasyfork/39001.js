// ==UserScript==
// @name         Fellowshipone Profile Page: Check For Assignments and Attendance
// @namespace    data@chapel.org
// @version      0.1
// @description  Updates assignments and attendance link to indicate if any exist
// @author       Tony Visconti
// @match        https://portal.fellowshipone.com/people/Individual/Index.aspx?id=*
// @match        https://portal.staging.fellowshipone.com/people/Individual/Index.aspx?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39001/Fellowshipone%20Profile%20Page%3A%20Check%20For%20Assignments%20and%20Attendance.user.js
// @updateURL https://update.greasyfork.org/scripts/39001/Fellowshipone%20Profile%20Page%3A%20Check%20For%20Assignments%20and%20Attendance.meta.js
// ==/UserScript==

function getUrlParameter(sParam) {
  let searchParams = new URLSearchParams(document.location.search.substring(1));
  return searchParams.get(sParam);
}

//basic javascript ajax was used here instead of jquery because I couldn't get it to work with F1's version of jquery. When I loaded my own I also ran into issues.
function CheckForTextOnPage(url, searchText, func) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200)
    {
        var regExp = new RegExp(searchText, "i");
        var textFound = this.responseText.search(regExp);
        if(textFound >=0)
        {
            func();
        }


    }
  };
  xhttp.open("GET", url , true);
  xhttp.send();
}

function SetElementText(selector,text)
{
    document.querySelector(selector).text = text;
}

function SetNoAssignments()
{
    var assignmentLinkSelector ='#main_content > div.grid_11 > div.section > div:nth-child(4) > div.widget_footer > div.float_left > a:nth-child(3)';
    SetElementText(assignmentLinkSelector,"No Assignments Found");
    console.log("Changing Assignments Link Text");
}

function SetNoAttendance()
{
    var attendanceLinkSelector ='#main_content > div.grid_11 > div.section > div:nth-child(4) > div.widget_footer > div.float_left > a:nth-child(2)';
    SetElementText(attendanceLinkSelector,"No Attendance Found");
    console.log("Changing Attendance Link Text");
}

var id = getUrlParameter('id');

CheckForTextOnPage("/people/Individual/Assignment.aspx?ID=" + id,"no assignments were found",SetNoAssignments);
var hsd = document.getElementById("tab_back").href.match(/=[0-9]*/)[0].split('=')[1];
CheckForTextOnPage("/people/Individual/Attendance.aspx?ID=" + id + "&hsd=" + hsd,"no attendance was found",SetNoAttendance);





