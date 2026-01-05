// ==UserScript==
// @name       It's Broke /without math
// @version    3.0
// @description Force submit broken mturk hits.
// @author     Cristo
// @include       *
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/4167/It%27s%20Broke%20without%20math.user.js
// @updateURL https://update.greasyfork.org/scripts/4167/It%27s%20Broke%20without%20math.meta.js
// ==/UserScript==


//Turn on the script, go to the broken hit and hit the ~ key. Solve the math problem and it will submit.
//Should work on most default surveys.
//It's hard to test without ruining my rejection rate so let me know if you find something it doesn't work on and I'll update it.


var form = document.getElementsByTagName("form")[0];

document.addEventListener( "keydown", kas, false);

	function kas(i) {
		if (i.keyCode == 192) { // ~ Key
    		var form = document.getElementsByTagName("form")[0];
				document.getElementById(form.id).submit();
        }

    }