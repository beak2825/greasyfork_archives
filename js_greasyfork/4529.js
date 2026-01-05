// ==UserScript==
// @name 		   BSCF : sdgardne AR selections.
// @namespace	   http://supportforums.blackberry.com/t5/
// @description	version 0.9d
// @include		http://supportforums.blackberry.com/t5/notifications/notifymoderatorpage/message-uid/*
// @version 0.0.1.20161201164808
// @downloadURL https://update.greasyfork.org/scripts/4529/BSCF%20%3A%20sdgardne%20AR%20selections.user.js
// @updateURL https://update.greasyfork.org/scripts/4529/BSCF%20%3A%20sdgardne%20AR%20selections.meta.js
// ==/UserScript==


var MyMacros = [
  "Personal information is displayed"
, "This is spam , or potentially harmful warez"
, "Please lock this thread as it is a duplicate (I have posted a link to the primary thread)."
, "Please:\n1) extract this message into a new discussion\n2) rename it to: XXXXXX\n3) move it to the YYYYYY board.\n4) please move my reply with it"
, "---"
, "Please move this discussion to the appropriate 'Developer' board"
, "Please move this discussion to the BB/Android Device board"
, "Please move this discussion to the BB/Android Hub+ board"
, "---"
, "Please move this discussion to the BB10 smartphone ‘Leap’ board"
, "Please move this discussion to the BB10 smartphone ‘Classic’ board"
, "Please move this discussion to the BB10 smartphone ‘Passport’ board"
, "Please move this discussion to the BB10 smartphone ‘Z30’ board"
, "Please move this discussion to the BB10 smartphone 'Z10’ board"
, "Please move this discussion to the BB10 smartphone 'Z3’ board"
, "Please move this discussion to the BB10 smartphone 'Q10' board"
, "Please move this discussion to the BB10 smartphone 'Q5' board"
, "---"
, "Please move this discussion to the BB10 smartphone ‘Functions and Features’ board"
, "Please move this discussion to the BB10 smartphone ’Desktop Software' board"
, "Please move this discussion to the BB10 smartphone ’Downloaded Applications' board"
, "---"
, "Please move this discussion to the ‘BBM' board"
, "Please move this discussion to the Legacy ’BB OS Smartphones' board"
, "Please move this discussion to the Legacy ’BB PlayBook' board"
];

function insertMacro (i) {
	if (i<= MyMacros.length-1) {
		document.evaluate( "//textarea[@name='additionalInformation']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null ).snapshotItem(0).value = MyMacros[i];
	}
	document.evaluate( "//select[@name='xandrexReportContent']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null ).snapshotItem(0).selectedIndex = 0;
}

var mySelect = document.createElement('select');
	mySelect.setAttribute('name','xandrexReportContent');
	mySelect.addEventListener('click', function(){ insertMacro(this.options[this.selectedIndex].value) } , false);
var OPT = document.createElement('option');
	OPT.setAttribute('value','');
	OPT.appendChild(document.createTextNode('Select...'));
	OPT.setAttribute('selected','selected');
mySelect.appendChild(OPT);
for ( var i = 0 ; i< MyMacros.length ; i++) {
	var OPT = document.createElement('option');
		OPT.value = i;
		OPT.appendChild(document.createTextNode(MyMacros[i]));
	mySelect.appendChild(OPT);
}
document.getElementsByTagName('fieldset')[0].appendChild(mySelect);