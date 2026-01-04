// ==UserScript==
// @name         FellowshipOne Edit Person Page: Run Macro
// @namespace    data@chapel.org
// @version      0.2
// @description  Reads macro function name from URL and runs
// @author       Tony Visconti
// @match        https://portal.fellowshipone.com/People/Individual/Edit.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39000/FellowshipOne%20Edit%20Person%20Page%3A%20Run%20Macro.user.js
// @updateURL https://update.greasyfork.org/scripts/39000/FellowshipOne%20Edit%20Person%20Page%3A%20Run%20Macro.meta.js
// ==/UserScript==

function getUrlParameter(sParam) {
  let searchParams = new URLSearchParams(document.location.search.substring(1));
  return searchParams.get(sParam); 
}

var customAction = getUrlParameter("customAction");

if(customAction == "TagCommentNeedParentInfo")
{
    var TagCommentElement = document.getElementById("ctl00_ctl00_MainContent_content_ctlIndividualFull_txtTagComment");
    if( TagCommentElement.value !== "")
    {
        window.alert("Tag Comment Already Exists: " + TagCommentElement.value);
    }
    else
    {
        TagCommentElement.value = "Need Parent Contact Info /tv";
        document.getElementById("ctl00_ctl00_MainContent_content_btnSave").click();
    }
}