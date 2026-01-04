// ==UserScript==
// @name         SignaturePage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script sets the defaults for a signature page.
// @author       NateD
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463365/SignaturePage.user.js
// @updateURL https://update.greasyfork.org/scripts/463365/SignaturePage.meta.js
// ==/UserScript==

var nameSigner = "FName LName";

function funcSignatures() {
	var aa = document.querySelectorAll("input[type=checkbox]");
    var bb = document.querySelectorAll("input[type=text]");
	var varID = 0;
    //LOOP THROUGH ALL CHECKBOXES
    for (var i = 0; i < aa.length; i++){
        //CLIENT NAME
        if (aa[i].id =="chk_ClientName"){
            aa[i].checked = false;
        }
        //SIGNED PERSON
        if (aa[i].id =="chk_SignedPerson"){
            aa[i].checked = true;
        }
        //ACKNOWLEDGED
        if (aa[i].id =="Chk_TimeSheetConfirmation"){
            aa[i].checked = true;
        }
    }

    //SIGNER NAME TYPED
    for (i = 0; i < bb.length; i++){
        if (bb[i].id == "txt_SignedPerson"){
            bb[i].value = nameSigner;
        }
    }
}

//SET DEFAULTS
funcSignatures();
//CLOSE TIMECARD