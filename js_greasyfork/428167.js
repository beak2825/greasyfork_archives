// ==UserScript==
// @name Remove Ext Limit
// @namespace Violentmonkey Scripts
// @include http://192.168.1.182/inventory/PartFileUpload.asp?*
// @grant none
// @run-at            document-end
// @description     Violentmonkey Scripts
// @version 0.0.1.20210619070934
// @downloadURL https://update.greasyfork.org/scripts/428167/Remove%20Ext%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/428167/Remove%20Ext%20Limit.meta.js
// ==/UserScript==

function AllExt(){
  var laSupportedExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "gif", "jpg", "png", "zip", "rar", "7z", "txt",""];
	var check_error = false;
	for (var i = 0; i < laSupportedExtensions.length; i++)
		if (document.frmSend.attach1.value.toLowerCase().indexOf("." + laSupportedExtensions[i]) > -1){
			check_error = true;
			if(parseInt(document.getElementById("manu_count").value) >= 1)
				ae_prompt( manu_type, 'Please choose its manufacturer:', '');
			else{
				document.frmSend.action= document.URL + "&operation=upload&manutype=0";
				document.frmSend.submit();
			}	
		} else {
     	    check_error = true;
			if(parseInt(document.getElementById("manu_count").value) >= 1)
				ae_prompt( manu_type, 'Please choose its manufacturer:', '');
			else{
				document.frmSend.action= document.URL + "&operation=upload&manutype=0";
				document.frmSend.submit();
			}	
    }
	if(check_error == false){	
		alert("Please press the browse button and pick a supported file.")
		return false;
	}
}

document.querySelectorAll('input[value="Upload"]')[0].onclick=AllExt;