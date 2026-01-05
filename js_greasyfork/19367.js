// ==UserScript==
// @name   	Cat all right
// @version	0.5
// @description  enter something useful
// @updateurl  http://userscripts.org/scripts/source/453289.user.js
// @match  	https://s3.amazonaws.com/mturk_bulk/hits*
// @match  	https://www.mturkcontent.com/dynamic/hit*
// @copyright  2014+, Tjololo
// @namespace https://greasyfork.org/users/4114
// @downloadURL https://update.greasyfork.org/scripts/19367/Cat%20all%20right.user.js
// @updateURL https://update.greasyfork.org/scripts/19367/Cat%20all%20right.meta.js
// ==/UserScript==
 

 
document.onkeydown = showkeycode;
function showkeycode(evt){
	var keycode = evt.keyCode;
  	 switch (keycode) {
        	case 97: //1
       		 if (document.getElementById("Yes"))
                	document.getElementById("Yes").click();
       		 else
           		 document.getElementById("Yes").click();
       		 document.getElementById("mturk_form").submit();
            	break;
        	case 98: //2
            	if (document.getElementById("No"))
                	document.getElementById("No").click();
      			 else
           		 document.getElementById("No").click();
       		 document.getElementById("mturk_form").submit();
            	break;
        	case 99: //3
            	if (document.getElementById("Unsure"))
                	document.getElementById("Unsure").click();
            	else
                	document.getElementById("Unsure").click();
       		 document.getElementById("mturk_form").submit();
            	break;
        	case 52: //4
            	if (document.getElementById("Completely NOT Shaded"))
                	document.getElementById("Completely NOT Shaded").click();
            	else
                	document.getElementById("R").click();
       		 document.getElementById("mturk_form").submit();
            	break;
        	case 53: //5
            	if (document.getElementById("House Not Visible"))
                	document.getElementById("House Not Visible").click();
       		 else
                	document.getElementById("House Not Visible").click();
       		 document.getElementById("mturk_form").submit();
            	break;
             case 54: //`
            	if (document.getElementById("Y"))
                	document.getElementById("Y").click();
       		 else
                	document.getElementById("Y").click();
       		 document.getElementById("mturk_form").submit();
            	break;
        	case 97: //1
            	if (document.getElementById("A - For Children"))
                	document.getElementById("A - For Children").click();
       		 else1
           		 document.getElementById("Completely Shaded").click();
       		 document.getElementById("mturk_form").submit();
        	case 98: //2
            	if (document.getElementById("B - OK for solar"))
                	document.getElementById("B - OK for solar").click();
      			 else
           		 document.getElementById("Mostly Shaded").click();
       		 document.getElementById("mturk_form").submit();
            	break;
        	case 99: //3
            	if (document.getElementById("C - Not so good for solar"))
                	document.getElementById("C - Not so good for solar").click();
            	else
                	document.getElementById("Mostly Not Shaded").click();
       		 document.getElementById("mturk_form").submit();
            	break;
        	case 100: //4
            	if (document.getElementById("D - Bad for solar"))
                	document.getElementById("D - Bad for solar").click();
            	else
                	document.getElementById("Completely NOT Shaded").click();
       		 document.getElementById("mturk_form").submit();
            	break;
        	case 101: //5
            	if (document.getElementById("E - Cannot find the roof"))
                	document.getElementById("E - Cannot find the roof").click();
       		 else
                	document.getElementById("House Not Visible").click();
       		 document.getElementById("mturk_form").submit();
            	break;
        	case 13: //enter
            	document.getElementById("submit_button").click();
            	document.getElementById("mturk_form").submit();
            	break;
	}
}
