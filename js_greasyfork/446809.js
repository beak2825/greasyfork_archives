// ==UserScript==
// @name     set alge license expire date
// @name:de set alge license expire date
// @description this script will add an addtional button to setup expire date 2 weeks ahead
// @description:de can't be blank
// @version  1
// @namespace   https://*.orangehrm.com/
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @match *
// @grant    *
// @downloadURL https://update.greasyfork.org/scripts/446809/set%20alge%20license%20expire%20date.user.js
// @updateURL https://update.greasyfork.org/scripts/446809/set%20alge%20license%20expire%20date.meta.js
// ==/UserScript==



$(document).ready(function() {
	$('label[for="expireOn"]').parent().append('<button class="btn btn-info" id="set2wbtn" >Set 2 weeks\n                    </button>'), $("form").on("click", "#set2wbtn", function(e) {
		e.preventDefault();
		var t = (new Date).getTime() + 11232e5,
			n = new Date(t).toISOString().split("T")[0];
		$("#expireOn").val(n)
	})
});