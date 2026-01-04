// ==UserScript==
// @name        Workflow Move Time Sheets
// @namespace   http://geosolve.co.nz
// @description Order the job drop in workflowmax.com timesheet moving tool by job number instead of client
// @include     https://my.workflowmax.com/common/option.aspx?*pagetype=240*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/371228/Workflow%20Move%20Time%20Sheets.user.js
// @updateURL https://update.greasyfork.org/scripts/371228/Workflow%20Move%20Time%20Sheets.meta.js
// ==/UserScript==

Greasemonkey_main();


function Greasemonkey_main () {
  var jobDropbox = document.getElementById('ctl00_PageContent_ctlxlayoutTo');
  var jobDrop = jobDropbox.children;
  var innerJob;
  var arrDrop = new Array(1);
	for (i = 0; i < jobDrop.length; i++) {
		innerDrop = jobDrop[i].innerHTML.split(" - ");
    if (innerDrop[2]) {
      tempHold = innerDrop[2]; 
      innerDrop[2] = innerDrop[0];
      innerDrop[0] = tempHold;
      jobDrop[i].innerHTML = innerDrop.join(" - ");
      arrDrop.push(i);
      arrDrop[i] = jobDrop[i];
    } 
	}
  arrDrop.sort(dropsort);
        for (i = arrDrop.length-1; i > -1 ; i--) {
            if (arrDrop[i+1]) {
               
                try {jobDropbox.insertBefore(arrDrop[i],arrDrop[i+1]);} catch(err) {console.log(err.message);}
            }
        }
  
  console.log("looks like no errors");
}

function dropsort(a,b) {
	return a.innerHTML.localeCompare(b.innerHTML);
}