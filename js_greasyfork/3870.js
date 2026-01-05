// ==UserScript==
// @name        xfaqs Rotating Sigs
// @version 	1.0.0
// @author      Kraust
// @namespace   Kraust
// @description Rotating Sigs
// @include     http://*.gamefaqs.com/*
// @grant		none
// @require 	//cdnjs.cloudflare.com/ajax/libs/jquery-csv/0.71/jquery.csv-0.71.min.js
// @downloadURL https://update.greasyfork.org/scripts/3870/xfaqs%20Rotating%20Sigs.user.js
// @updateURL https://update.greasyfork.org/scripts/3870/xfaqs%20Rotating%20Sigs.meta.js
// ==/UserScript==


/*
	This is a mirror of the rotating sig code used in xfaqs
	created by Kraust/Judgmenl
	If there are any problems please let me know. I only partially looked this over.
	I would not use it with xfaqs as xfaqs already has it present.
*/


/*
	This uses localStorage to keep Sigs in JSON data
*/

if(	localStorage.getItem("sigList") != null ) {
	var sigList = JSON.parse(localStorage.getItem("sigList"));

} else {
 

	var sigList =
	{ 	
		"signatures": [
				
		]
	};
	
	localStorage.setItem("sigList", JSON.stringify(sigList));


}


/*
	There are two callback functions needed for the dynamic click handlers
*/

function sigClickCallback(i) {
	return function() {
		var sigText = $("#signature-" + i).val();
		var sigLines = (sigText.match(/\n/g)||[]).length;
		var sigCharacters = sigText.length + sigLines;
	
		if((sigLines <= 1) && (sigCharacters <= 160)) { 

			$(".btn").attr("disabled", "disabled");
			
			sigList.signatures.splice((i-1), 1);	
			
			var boardNameArray = $.csv.toArray($("#boards-" + i).val());
			var accountNameArray = $.csv.toArray($("#accounts-" + i).val());
				
			sigList.signatures.push( 
				{
					"boards": boardNameArray,
					"accounts": accountNameArray,
					"signature": $("#signature-" + i).val()
				});


			localStorage.setItem("sigList", JSON.stringify(sigList));
			document.location = "/boards/user.php?settings=1#tabs-5";
			location.reload(true);
		} else {
			alert("Signature is too long. " + sigLines + " breaks and " + sigCharacters + " characters.");
		}
	}
}

function sigDeleteCallback(i) {
	return function() {
		$("#sigTable-" + i).remove();
		$(".btn").attr("disabled", "disabled");
		
		sigList.signatures.splice((i-1), 1);
		localStorage.setItem("sigList", JSON.stringify(sigList));

		
		document.location = "/boards/user.php?settings=1#tabs-5";
		location.reload(true);

	}
}


/*
	This renders the options page
*/

var sigBody = "<span style='float:right;'><input type='file' class='btn' id='importSigFiles' name='files[]'> <button class='btn' id='importSigs' disabled>Import</button> <button class='btn' id='exportSigs'>Export</button></span><p>1 line break and 160 characters allowed. Just like with regular sigs.<br> If you want a signature to apply to all boards or accounts leave the field blank.<br>Multiple boards and accounts are separated by commas.</p>";
var sigNumber = 0;

for( sigNumber; sigNumber < sigList.signatures.length; sigNumber++) {

	sigBody +=	"<table id='sigTable-" + (sigNumber + 1) + "'>" +
							"<tr><th colspan='2'>Signature " + (sigNumber + 1) + " <input type='submit' class='btn' id='sigBtn-" + (sigNumber + 1) + "' style='float:right; margin-left:10px;' value='Update'><input type='submit' class='btn' id='sigDeleteBtn-" + (sigNumber + 1) + "' style='float:right' value='Delete'></th></tr>" +
							"<tr><td>Board Names</td><td><input id='boards-" + (sigNumber + 1) + "' style='width:100%' value=\"" + sigList.signatures[sigNumber].boards + "\"></td></tr>" +
							"<tr><td>Accounts</td><td><input id='accounts-" + (sigNumber + 1) + "' style='width:100%' value=\"" + sigList.signatures[sigNumber].accounts + "\"></td></tr>" +
							"<tr><td>Signature</td><td><textarea id='signature-" + (sigNumber + 1) + "' style='width:100%'>" + sigList.signatures[sigNumber].signature + "</textarea></td></tr>" +
						"</table>";

}

sigBody +=	"<table id='sigTable-'" + (sigNumber + 1) + ">" +
						"<tr><th colspan='2'> New Signature <input type='submit' class='btn' id='sigBtn-" + (sigNumber + 1) + "' style='float:right' value='Add'></th></tr>" +
						"<tr><td>Board Names</td><td><input id='boards-" + (sigNumber + 1) + "' style='width:100%' value=\"" + "" + "\"></td></tr>" +
						"<tr><td>Accounts</td><td><input id='accounts-" + (sigNumber + 1) + "' style='width:100%' value=\"" + "" + "\"></td></tr>" +
						"<tr><td>Signature</td><td><textarea id='signature-" + (sigNumber + 1) + "' style='width:100%' value=\"" + "" + "\"></textarea></td></tr>" +
					"</table>";


$(".masthead_user").prepend("<span class='masthead_mygames_drop'><a href='/boards/user.php?rotatingsigs=1'>Rotating Signatures <i class='icon icon-cog'></i></a></span> ");


//Renders the menu
if((decodeURIComponent((new RegExp('[?|&]' + "rotatingsigs" + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')) == "1") && (location.pathname == "/boards/user.php")) {

	var user = $("html.js body.wf-active div.wrapper div#mantle_skin div#content.container div.main_content div.span8 div.body table.board tbody tr td").eq(0).text();
	$(".span4").remove();
	$(".span8").css("width", "100%");
	
	// GameWeasel Fix
	if( user == "") {
		var user = $("#content > div > div > div.body > table > tbody > tr:nth-child(1) > td").text();
	}	
	
	var upload_user = user + " ";

	$(".page-title").html("Rotating Signatures");
	$(".userinfo").css("border", "none");
	$(".title").remove();
	$(".head").remove();
	
	// Preparing for the UI
	$("tbody").empty();    
		
	// Renders the Upload UI	
	if( user ) {
			$("tbody").append(
				"<div id='rs-div'>" +
				sigBody +
				"</div>"
			
			);
	}

		for(var i = 0; i < sigNumber; i++) {
				
			$("#sigBtn-" + (i + 1)).button();
			$("#sigBtn-" + (i + 1)).click(sigClickCallback(i + 1));

			$("#sigDeleteBtn-" + (i + 1)).button();
			$("#sigDeleteBtn-" + (i + 1)).click(sigDeleteCallback(i + 1));

		
		}
		
		$("#sigBtn-" + (sigNumber + 1)).button();
		$("#sigBtn-" + (sigNumber + 1)).click(function() {
			var sigText = $("#signature-" + (sigNumber + 1)).val();
			var sigLines = (sigText.match(/\n/g)||[]).length;
			var sigCharacters = sigText.length + sigLines;
		
			if((sigLines <= 1) && (sigCharacters <= 160)) { 
				$(".btn").attr("disabled", "disabled");
				
				var boardNameArray = $.csv.toArray($("#boards-" + (sigNumber + 1)).val());
				var accountNameArray = $.csv.toArray($("#accounts-" + (sigNumber + 1)).val());
				
				sigList.signatures.push( 
					{
						"boards": boardNameArray,
						"accounts": accountNameArray,
						"signature": sigText
					});
					
				localStorage.setItem("sigList", JSON.stringify(sigList));
				
				document.location = "/boards/user.php?settings=1#tabs-5";
				location.reload(true);
			} else {
				alert("Signature is too long. " + sigLines + " breaks and " + sigCharacters + " characters.");
			}
		});

		
		$("#exportSigs").click(function() {
			var oMyBlob = new Blob([localStorage.sigList], {type : 'application/octet-stream'});
			var url = URL.createObjectURL(oMyBlob);
			
			window.open(url, '_blank');
		});
		
		
		// This is off of SO: http://stackoverflow.com/questions/11046919/how-do-i-read-a-text-file-on-my-local-disk-into-a-variable-in-javascript
		function handleFileSelect(evt) {
			var files = evt.target.files; // FileList object

			// Loop through the FileList
			for (var i = 0, f; f = files[i]; i++) {

			var reader = new FileReader();

			// Closure to capture the file information.
			reader.onload = (function(theFile) {
				return function(e) {
					importSigList = e.target.result;
					$("#importSigs").removeAttr("disabled");
				};
			})(f);

			// Read in the file
			//reader.readAsDataText(f,UTF-8);
			//reader.readAsDataURL(f);

			reader.readAsText(f);
			}
		}
		document.getElementById('importSigFiles').addEventListener('change', handleFileSelect, false);
		
		// This is off of SO
		
		$("#importSigs").click(function() {
			localStorage.setItem("sigList", importSigList);
			document.location = "/boards/user.php?settings=1#tabs-5";
			location.reload(true);
		});



}


/*
	This uses handles rendering the sigs.
*/

var sigListLength = sigList.signatures.length;
var randomSig = Math.floor(Math.random() * sigListLength - 1) + 1;
var board = $(".page-title").text();
var randomSignature = sigList.signatures[randomSig].signature;
var validSig = false;
var randomCounter = 0;

while(validSig != true) {
	randomSig = Math.floor(Math.random() * sigListLength - 1) + 1;
	randomSignature = sigList.signatures[randomSig].signature;
	for(var j = 1; j <= sigList.signatures[randomSig].accounts.length; j++) {
		if((sigList.signatures[randomSig].accounts[0] == "") || (sigList.signatures[randomSig].accounts[j-1] == $(".welcome").text().slice(0, - 1))) {
			for(var i = 1; i <=  sigList.signatures[randomSig].boards.length; i++) {
				if(sigList.signatures[randomSig].boards[0] === "") {
					$("input[name='custom_sig']").after("<div class='head'><h2 class='title'>Custom Signature</h2></div>" + 
														"<textarea name='custom_sig' rows='2' cols='100' style='width:100%;'></textarea>");
					$("input[name='custom_sig']").remove();
					$("textarea[name='custom_sig']").val(randomSignature);
					validSig = true;
					break;
				} else if(board.toLowerCase() === sigList.signatures[randomSig].boards[i-1].toLowerCase()) {
					$("input[name='custom_sig']").after("<div class='head'><h2 class='title'>Custom Signature</h2></div>" + 
														"<textarea name='custom_sig' rows='2' cols='100'></textarea>");
					$("input[name='custom_sig']").remove();
					$("textarea[name='custom_sig']").val(randomSignature);
					validSig = true;
					break;
				}
			}
		}
	}
	
	randomCounter++;
	if(randomCounter > 100) {
		$("input[name='custom_sig']").after("<div class='head'><h2 class='title'>Custom Signature</h2></div>" + 
											"<textarea name='custom_sig' rows='2' cols='100'></textarea>");
		$("input[name='custom_sig']").remove();
		$("textarea[name='custom_sig']").val();
		validSig = true;
		break;
	}
}