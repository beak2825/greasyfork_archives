// ==UserScript==
// @name        1337X - Upload page improved
// @namespace   NotNeo
// @author      NotNeo
// @description Improves the upload page. Let's you set up default descriptions for categories and other defaults like title, tags etc. and more
// @include     http*://1337x.to/upload
// @include     http*://1337x.st/upload
// @include     http*://1337x.ws/upload
// @include     http*://1337x.eu/upload
// @include     http*://1337x.se/upload
// @include     http*://1337x.is/upload
// @include     http*://1337x.gd/upload
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require  	https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @version     2.1.6
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/29853/1337X%20-%20Upload%20page%20improved.user.js
// @updateURL https://update.greasyfork.org/scripts/29853/1337X%20-%20Upload%20page%20improved.meta.js
// ==/UserScript==

//============================//
//============================//
// YOU SHOULD NO LONGER TOUCH //
// ANYTHING INSIDE THE SCRIPT //
//    ALL SETTINGS ARE NOW    //
//   AVAILABLE ON THE PAGE!   //
//============================//
//============================//


//setting defaults
var dName = "";
var dLanguage = "English";
var dDesc = "";
var dTags = "";
var showOnlyUpload = true;
var descHeight = "400";
var reminder = true;
var catDelay = 2;



(async function() { // Getting the runtime variables from local storage
	if( (await GM.getValue("reminder")) != null ) {
		reminder = await GM.getValue("reminder");
	}
	if( (await GM.getValue("dDesc")) != null ) {
		dDesc = await GM.getValue("dDesc");
	}
	if( (await GM.getValue("dName")) != null ) {
		dName = await GM.getValue("dName");
	}
	if( (await GM.getValue("dLanguage")) != null ) {
		dLanguage = await GM.getValue("dLanguage");
	}
	if( (await GM.getValue("dTags")) != null ) {
		dTags = await GM.getValue("dTags");
	}
	if( (await GM.getValue("showOnlyUpload")) != null ) {
		showOnlyUpload = await GM.getValue("showOnlyUpload");
	}
	if( (await GM.getValue("descHeight")) != null ) {
		descHeight = await GM.getValue("descHeight");
	}
	if( (await GM.getValue("catDelay")) != null ) {
		catDelay = await GM.getValue("catDelay");
	}

	var savCatNamArr = [];
	var savCatDescArr = [];


	if( (await GM.getValue("savCatNamArrStr")) != null ) {
		var savCatNamArrStr = GM.getValue("savCatNamArrStr"); //get array from storage as string
		if(savCatNamArrStr) { savCatNamArr = JSON.parse(savCatNamArrStr); } //parse the string to an array
	}
	if( (await GM.getValue("savCatDescArrStr")) != null ) {
		var savCatDescArrStr = GM.getValue("savCatDescArrStr"); //get array from storage as string
		if(savCatDescArrStr) { savCatDescArr = JSON.parse(savCatDescArrStr); } //parse the string to an array
	}
	
	mainScript();
})();


function checkForAndLoadSavedCatDesc() {
    var currentCat = $("#category").parent().find(".trigger").text();
    var currentSubCat = $("#type").parent().find(".trigger").text();
    //alert(currentCat + ": " + currentSubCat);

    for (i = 0; i < savCatNamArr.length; i++) {
        if(savCatNamArr[i][0] == currentCat) { //if saved description for current main cat is found...
			for (j = 1; j < savCatNamArr[i].length; j++) {
				if(savCatNamArr[i][j] == currentSubCat) { //if saved description for current main SubCat is found...
                    //alert(savCatDescArr[i][j-1]);
					$(".sceditor-toolbar").next("iframe").next("textarea").val(savCatDescArr[i][j-1]);
				}
			}
		}
    }
}

function alertDesc(cat, subCat) {
	for(i = 0; i < savCatNamArr.length; i++) {
        if(savCatNamArr[i][0] == cat) {
            for(j = 1; j < savCatNamArr[i].length; j++) {
                if(savCatNamArr[i][j] == subCat) {
                    alert("Description:\n\n" + savCatDescArr[i][j-1] + "\n\nAdded for " + savCatNamArr[i][0] + ": " + savCatNamArr[i][j]);
                }
            }
        }
    }
}

function saveArrays() {
    savCatNamArrStr = JSON.stringify(savCatNamArr); //turn array into a single string
    GM.setValue("savCatNamArrStr", savCatNamArrStr); //save that string to local storage
    savCatDescArrStr = JSON.stringify(savCatDescArr); //turn array into a single string
    GM.setValue("savCatDescArrStr", savCatDescArrStr); //save that string to local storage
    alert(savCatNamArrStr + "\n\n" + savCatDescArrStr);
}

function addToArrays(cat, subCat, desc) {
    for(i = 0; i < savCatNamArr.length; i++) {
        if(savCatNamArr[i][0] == cat) {
            for(j = 1; j < savCatNamArr[i].length; j++) {
                if(savCatNamArr[i][j] == subCat) { //if already exists, replace
                    savCatDescArr[i][j] = desc;
                    saveArrays();
					return;
                }
            }
			//main cat exist, but subCat doesn't
			savCatNamArr[i].push(subCat);
			savCatDescArr[i].push(desc);
            saveArrays();
            return;
        }
    }
	//sub nor main cat exists
	var newCats = [ cat, subCat ];
	savCatNamArr.push(newCats);
	var newDescForNewCats = [ desc ];
	savCatDescArr.push(newDescForNewCats);
    saveArrays();
    return;

	/* Remember!!!
		descriptions are stored in an index one lower than their descName counterparts!
		i.e.
		if Other -> Ebooks is in savCatNamArr[3][2], then it's description is in savCatDescArr[3][1]
		because the first item in each sub-array within the savCatNamArr is the name of the main category.
		i.e.
		if Other -> Ebooks is in savCatNamArr[3][2] then savCatNamArr[3][0] is "Other", while savCatDescArr[3][0] would be the description for savCatNamArr[3][1]
	*/
}

function mainScript() {
	$(".box-info-heading.bordered").append(' <div style="float: right;"><label for="showUpCheckB">Show only upload</label><input type="checkbox" id="showUpCheckB"></div> '); //showOnlyUpload setting UI
	$("#category").parent().before(' <a href="#" id="reminderOp" style="float: right; font-size: 10px; margin-top: 10px;">Reminder?</a> '); //reminder option UI
	$("#type").parent().before(' <a href="#" id="delayOp" style="float: right; font-size: 10px; margin-top: 10px;">Delay?</a> '); //delay option UI

	$("#delayOp").click(function(e) {
		e.preventDefault();
		var catDelayTemp = prompt("When you change the main category, there is a delay before the subcategory loads.\nFor some reason this delay can be suprisingly long.\n" +
								  "The script will check if the current main + sub category has a saved description. Here you can set the delay before that check.\n" +
								  "i.e. if the subcategory delay is around 2 seconds, then set this to 2.5 for example.\nThis is not a problem when changing the subcategory. The delay is only used when you change the main category." +
								 "\nCurrent delay is " + catDelay);
		if(catDelayTemp != null && catDelayTemp != "" && !(isNaN(catDelayTemp))) {
			catDelay = catDelayTemp;
			GM.setValue("catDelay", catDelay);
		}
	});

	if (reminder) {
		$("#category").parent().before("<span id='theReminder' style='color:red; font-size: 15px; margin-left: 5px;'>Choose before editing the description!</span>"); //setting reminder, if true
	}

	$("#reminderOp").click(function(e) { //reminder option changer
		e.preventDefault();
		var reminderTemp = confirm("Remind me to choose the category before editing the description?\n(Red text next to category)\nWhy? \nBecause changing the category causes the description to change to the saved description for the category you choose.\nMeaning you'll lose any changes you made to the description prior.\n\nPress \"OK\" to show it, \"Cancel\" to not.");
		if(!reminderTemp) {
			reminder = false;
			$("#theReminder").remove();
		} else {
			reminder = true;
			$("#theReminder").remove();
			$("#category").parent().before("<span id='theReminder' style='color:red; font-size: 15px; margin-left: 5px;'>Choose before editing the description!</span>");
		}
		GM.setValue("reminder", reminder);
	});

	if (showOnlyUpload) { //hiding stuff if showOnlyUpload is true
		$("h1:contains(' Want to upload a torrent? No problem! Please use the announce URLs: ')").parent().parent().hide();
		$("h1:contains('New upload categories')").parent().parent().hide();
		$(".upload-info").parent().hide();
		$("#showUpCheckB").attr("checked", true);
	}

	$("#showUpCheckB").change(function() { //showOnlyUpload option changer
		$("h1:contains(' Want to upload a torrent? No problem! Please use the announce URLs: ')").parent().parent().toggle();
		$("h1:contains('New upload categories')").parent().parent().toggle();
		$(".upload-info").parent().toggle();
		$("#showUpCheckB").attr("checked", !($("#showUpCheckB").attr("checked")));
		showOnlyUpload = !showOnlyUpload;
		GM.setValue("showOnlyUpload", showOnlyUpload);
	});

	$(document).ready(function() {
		$("[name='title']").val(dName); //set default title
		$("[name='tags']").val(dTags); //set default tags

		//description saver UI
		$("[name='upload']").parent().append('<input id="savDescDef" style="float: right; margin: 0px 5px;" value="Save Desc (Default)" title="Saves the current description as the global default. (Loaded with the page. Overriden by category specific descriptions.)" class="btn btn-green" type="submit">');
		$("[name='upload']").parent().append('<input id="savDescCat" style="float: right;" value="Save Desc (for category)" title="Saves the current description as the default for the currently selected category." class="btn btn-green" type="submit">');

		//default title, language and tags UI
		$("[name='title']").before(' <a href="#" id="savDefTit" style="float: right; margin-top: 10px; font-size: 10px;">Save as default Title</a> ');
		$("#language").parent().before(' <a href="#" id="savDefLan" style="float: right; margin-top: 10px; font-size: 10px;">Save as default Language</a> ');
		$("[name='tags']").before(' <a href="#" id="savDefTags" style="float: right; margin-top: 10px; font-size: 10px;">Save as default Tags</a> ');

		$("#savDefTit").click(function(e){
			e.preventDefault();
			dName = $("[name='title']").val();
			GM.setValue("dName", dName);
			alert("New default Title saved:\n\n" + dName);
		});
		$("#savDefLan").click(function(e){
			e.preventDefault();
			dLanguage = $("#language").parent().find(".trigger").text();
			GM.setValue("dLanguage", dLanguage);
			alert("New default Language saved:\n\n" + dLanguage);
		});
		$("#savDefTags").click(function(e){
			e.preventDefault();
			dTags = $("[name='tags']").val();
			GM.setValue("dTags", dTags);
			alert("New default Tags saved:\n\n" + dTags);
		});

		setTimeout(function(){ //everything below is done with a delay of 1s, to allow the description iframe to load

			//$(".sceditor-toolbar").next("iframe").hide();
			$(".sceditor-toolbar").next("iframe").next("textarea").attr("style", "width: 100%; height: " + descHeight + "px;"); //setting custom height for text box
			$(".sceditor-toolbar").next("iframe").next("textarea").val(dDesc); //setting default description

			$("[name='description']").before(' <a href="#" id="setDescH" style="float: right; margin-top: 5px; font-size: 10px;">Set description box height</a> ');

			$("#setDescH").click(function(e) {
				e.preventDefault();
				var descHeightTemp = prompt("Give a new height for the description box. (in pixels)\nThe current height is: "+descHeight);
				if(descHeightTemp != null && descHeightTemp != "") {
					descHeight = descHeightTemp;
					GM.setValue("descHeight", descHeight);
					$(".sceditor-toolbar").next("iframe").next("textarea").attr("style", "width: 100%; height: " + descHeight + "px;");
				}
			});

			//setting default Language ---------------------------------------------------
			$("#language").parent().find(".options").find("li").each(function() {
				$(this).removeAttr("class");
			});
			$("#language").parent().find(".trigger").text(dLanguage);
			$("#language").parent().find(".options").find("li:contains('" + dLanguage + "')").attr("class", "selected");
			//----------------------------------------------------------------------------

			$("#savDescDef").click(function(e) {
				e.preventDefault();
				//dDesc = $(".sceditor-toolbar").next("iframe").contents().find("body").html();
				dDesc = $(".sceditor-toolbar").next("iframe").next("textarea").val();
				GM.setValue("dDesc", dDesc);
				alert("Description:\n\n"+dDesc+"\n\nSaved as the global default description.");
			});
			$("#savDescCat").click(function(e) {
				e.preventDefault();
				var currCat = $("#category").parent().find(".trigger").text();
				var currSubCat = $("#type").parent().find(".trigger").text();
				var currDesc = $(".sceditor-toolbar").next("iframe").next("textarea").val();
				//alert(currCat + ", " + currSubCat + ", \n" + currDesc);
				addToArrays(currCat, currSubCat, currDesc);
				//alertDesc(currCat, currSubCat);
			});
			$(".scroll-top").click(function() {
				//alert("click");

			});

			$("#category").parent().find(".options").click(function() {
				setTimeout(checkForAndLoadSavedCatDesc, catDelay*1000); // loading the subcategory after changing main categories takes a while so have to use a delay here.
			});

			$("#type").parent().find(".options").click(checkForAndLoadSavedCatDesc);

		}, 1000);
	});
}
//var isFirefox = typeof InstallTrigger !== 'undefined';

