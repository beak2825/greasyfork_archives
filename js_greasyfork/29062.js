// ==UserScript==
// @name         Fellowshipone Profile Page: Add View Duplicates Link
// @namespace    data@chapel.org
// @version      0.2
// @description  Checks to see if duplicates exist for individual and adds link to duplicates page on profile page if a potential duplicate is found. Link text changes based on likeliness of duplicate.
// @author       Tony Visconti
// @match        https://portal.fellowshipone.com/people/Individual/Index.aspx?id=*
// @match        https://portal.staging.fellowshipone.com/people/Individual/Index.aspx?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29062/Fellowshipone%20Profile%20Page%3A%20Add%20View%20Duplicates%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/29062/Fellowshipone%20Profile%20Page%3A%20Add%20View%20Duplicates%20Link.meta.js
// ==/UserScript==

function getUrlParameter(sParam) {
  let searchParams = new URLSearchParams(document.location.search.substring(1));
  return searchParams.get(sParam); 
}

//basic javascript ajax was used here instead of jquery because I couldn't get it to work with F1's version of jquery. When I loaded my own I also ran into issues.
function SetDuplicateInfo() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      // check for this image with 5 dots and 4 dots https://screencast.com/t/SEd1zFMjP7 which only shows up when there is a potential match
      var highRank = this.responseText.search(/highRank.gif/i);
      //window.alert(highRank);
      var mediumhighRank = this.responseText.search(/images\/mediumHighRank/i);

      var noDuplicates = this.responseText.search(/No potential duplicates found/i);
      //window.alert(mediumhighRank);
      //window.alert(noDuplicates);

      if (highRank > 0 || mediumhighRank > 0) {
        document.getElementById("viewDuplicates").innerHTML = '<a id="viewDuplicates" href="/people/householdGeneral/DuplicateFinderResults.aspx?ind_id=' + id + '" class="icon_view">Likely Duplicates Found</a>';
      } else if (noDuplicates > 0) {
        document.getElementById("viewDuplicates").innerHTML = 'No Potential Duplicates Found';
      } else {
        document.getElementById("viewDuplicates").innerHTML = '<a id="viewDuplicates" href="/people/householdGeneral/DuplicateFinderResults.aspx?ind_id=' + id + '" class="icon_view">Potential Duplicates Found</a>';
      }
    }
  };
  xhttp.open("GET", "/people/householdGeneral/DuplicateFinderResults.aspx?ind_id=" + id, true);
  xhttp.send();
}

var id = getUrlParameter('id');
var appendhtml = '<li id=viewDuplicates></li>';
appendElement = document.getElementsByClassName("aside")[0].children[1];

appendElement.innerHTML += appendhtml;
SetDuplicateInfo();
