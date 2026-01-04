// ==UserScript==
// @name Print All Panopto Captions
// @locale Eng
// @description Adds a button to download all captions on the left pane when viewing a panopto video.
// @version  1.0
// @grant    none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @match https://*.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=*
// @namespace https://greasyfork.org/users/170988
// @downloadURL https://update.greasyfork.org/scripts/422355/Print%20All%20Panopto%20Captions.user.js
// @updateURL https://update.greasyfork.org/scripts/422355/Print%20All%20Panopto%20Captions.meta.js
// ==/UserScript==

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

let button = '<div id="downloadCaptionsTabHeader" class="event-tab-header"><span class="text">Download Captions</span></div>';

$('#transcriptTabHeader').after(button);

$('#downloadCaptionsTabHeader').click(function() {
  
  let allText = "";
  
  for (element of document.getElementsByClassName('index-event')) {
    allText += element.children[1].children[0].children[0].innerHTML + "\n";
  }
  
  //console.log(document.getElementsByClassName('index-event')[0].children[1].children[0].children[0].innerHTML);
  
	download("captions-for_"+$(document).find("title").text().replaceAll(" ", "-")+'.txt', allText.replaceAll("<br>", " "));
});
