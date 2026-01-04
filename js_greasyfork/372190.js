// ==UserScript==
// @name            dispo tls2
// @namespace       https://fr.tlscontact.com
// @version         0.0.1
// @description     dispo tls
// @author          nid
// @include         https://fr.tlscontact.com/dz/ORN/myapp.php*
// @include         https://fr.tlscontact.com/ma/CAS/myapp.php*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/372190/dispo%20tls2.user.js
// @updateURL https://update.greasyfork.org/scripts/372190/dispo%20tls2.meta.js
// ==/UserScript==
// ==UserScript==
// @name            dispo tls
// @namespace       https://fr.tlscontact.com
// @version         0.0.1
// @description     dispo tls
// @author          nid
// @include         https://fr.tlscontact.com/dz/ORN/myapp.php*
// @include         https://fr.tlscontact.com/ma/CAS/myapp.php*
// @grant           none
// ==/UserScript==

var click = document.getElementsByClassName("dispo").length
if (click > 0) {
var L = 0;
var j = 1;
var i;
var oldHTML = document.getElementById("branding");

for (i = 1; i <= click; i++){
var newHTML = document.createElement("div");
	newHTML.innerHTML = '<div style="font-size:90%; float:left;text-align:center;background:##e6ffff; margin-top:5px; padding:3px 1px 2px 5px; border:1px solid #000"> \n'
		+ '<form method="post" action="https://fr.tlscontact.com/ORN/action.php" name="ajax_confirm_action" id="ajax_confirm_action" onsubmit="ajaxPostForm(this, &quot;multiconfirm&quot;, true); return false;"> \n'
	    + '<input name="f_id" id="f_id" value="" class="" type="hidden"> \n'
        + '<input name="fg_id" id="fg_id" value="13380" class="" type="hidden"> \n'
        + '<input name="what" id="what" value="book_appointment" class="" type="hidden"> \n'
        + '<input name="result" id="result" value="2018-09-02  11:00" class="" type="hidden"> \n'
        + '<input name="as_u_id" id="as_u_id" value="" class="" type="hidden"> \n'
        + '<input name="_sid" id="_sid" value="c988de251126b8d0e1f9f050f893f170" class="" type="hidden">  \n'
        + '<input id="ajax_main_loading" style="position: fixed; text-align: center; width: 100%; display: none;">\n'
        + '<center style=" margin-top:15px;">\n'
        + '<input id="ajaxConfirmCall_submit" value="Confirmer" style=" font-weight:bold " class="" type="submit"> \n'
	    + '<input name = "value="Cancel" onclick="Control.Modal.close()" style="font-weight:bold" class="" type=""button" > \n'
        + '</center> \n'
        + '</form> \n'
        + '</div>'
			;
		oldHTML.parentNode.insertBefore(newHTML, oldHTML);
	document.getElementById('f_id').id = 'f_id' +j;
    document.getElementById('fg_id').id = 'fg_id' +j;
    document.getElementById('what').id = 'what' +j;
	document.getElementById('result').id = 'result' +j;
    document.getElementById('as_u_id').id = 'as_u_id' +j;
	document.getElementById('ajax_main_loading').id = 'ajax_main_loading' +j
    document.getElementById('ajaxConfirmCall_submit').id = 'ajaxConfirmCall_submit' +j
	function getVariable(variable) {
	var dispo = document.getElementsByClassName("dispo")[L].onclick;
	var Vars = dispo.toString().split("&");
       for (var i=0;i<Vars.length;i++) {
               var pair = Vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
	}
	var sp = getVariable("result")
	var nsp = sp.replace("+", " ");
	var nsp2 = nsp.replace("%3A", ":");
	document.getElementById('result' + j).value = nsp2;
	document.getElementById('ajaxConfirmCall_submit' + j).value = nsp2;
	var fg_id = getVariable("fg_id")
	document.getElementById('fg_id' + j).value = fg_id;
	L++;
	j++;
	}
    var audio = new Audio('https://www.soundjay.com/misc/bell-ringing-01.mp3');
    audio.play();
	}
