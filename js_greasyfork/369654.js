// ==UserScript==
// @name Script4WA
// @namespace Script4WA
// @match *://webadmin.mango.local:8088/wa/#p=sswa-module-sip-sessions-cluster
// @grant none
// @version 0.0.1.20180620102230
// @description доработка для WA
// @downloadURL https://update.greasyfork.org/scripts/369654/Script4WA.user.js
// @updateURL https://update.greasyfork.org/scripts/369654/Script4WA.meta.js
// ==/UserScript==

function gogo() {
  console.log('started gogo');
  $("#ext-gen221").click(function(){
var a = $('#f-name').val();
	if (a.indexOf('@') > 0) {
		var spl = a.split('@');
		document.getElementById('f-name').value = spl[0];
		document.getElementById('f-domain').value = spl[1];
	}
});
}

document.body.onload = function(){console.log('started'); setTimeout(gogo, 2000);};

