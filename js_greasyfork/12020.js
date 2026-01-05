// ==UserScript==
// @name        Wanikani Review Count Analysis
// @namespace   HoovardWKRCA
// @description Reports review counts.
// @include     https://www.wanikani.com/dashboard
// @include     https://www.wanikani.com/
// @version     0.0.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12020/Wanikani%20Review%20Count%20Analysis.user.js
// @updateURL https://update.greasyfork.org/scripts/12020/Wanikani%20Review%20Count%20Analysis.meta.js
// ==/UserScript==

$(document).ready(initReviewCount);

var strAPIKey = "";

var strUserLevelURL = "https://www.wanikani.com/api/user/"+ strAPIKey +"/level-progression";

var strRadURL = "https://www.wanikani.com/api/user/"+ strAPIKey +"/radicals";
var strKanURL = "https://www.wanikani.com/api/user/"+ strAPIKey +"/kanji/";
var strVocURL = "https://www.wanikani.com/api/user/"+ strAPIKey +"/vocabulary/";

const TYPE_RAD = 0;
const TYPE_KAN = 1;
const TYPE_VOC = 2;

// Display helper list
var a_strDataTypeNames = ["Rad", "Kan", "Voc"];

var bDisplayOptionsVisible = false;


var a_iLevelTotals = []; // Array to hold level subtotals

var iUserLevel = 0;

var iCorrectTotal = 0;
var iIncorrectTotal = 0;

function initReviewCount()
{
	// Insert the div and table elements
	var ReviewAnalysisStyles = "";
	var strInitialDiv = "";
	strInitialDiv += "<div id='FloatWrapper' style='text-align: center; width: 100%;'>";
	strInitialDiv += "<div id='MainAnalysisDisplaySectionWrapper' style='width: 1000px; margin-right: auto; margin-left: auto; padding-top: 10px; padding-bottom:10px; margin-bottom: 10px; border: 1px solid #999999;'>";	
	strInitialDiv += "<div id='buttonRegion' style='width: 100%; text-align: center; margin-bottom: 6px;'>";	
	//strInitialDiv += "API Key: <input id='APIkey' style='font-size: 10pt; width: 260px; border: 1px solid #999999; background-color: #ffffff;' type='text' name='APIkey' size='20' maxlength='256' value='' />";
	
	// colour the API Key button to show whether a Key is available
	var strAPIKeyButtonColor;
	if ($.jStorage.get("ReviewAnalysisSavedAPIKey")) {
		strAPIKeyButtonColor = "#42AC48";
	} else {
		strAPIKeyButtonColor = "#E45350";		
	}
	
	strInitialDiv += "<button id='startAnalysis'>Review Count Analysis</button> | <button id='clearResults'>Clear Results</button><button id='toggleExtraOptions'>Show Display Options</button><button style='color: "+ strAPIKeyButtonColor +"' id='enterAPIKey'>Enter API Key</button>";
	strInitialDiv += "</div>";
	// Display options
	strInitialDiv += "<div id='displayOptions' style='width: 100%; text-align: center;'>";
	strInitialDiv += "Accuracy decimal places <input id='accuracyDecimals' style='width: 50px; border: 1px solid #999999;' type='number' min='1' max='8' name='accuracyDecimals' size='4' maxlength='3' value='3' /> | ";
	strInitialDiv += "Meaining + Reading = 1 review <input type='checkbox' id='CombineMeaningReadingCount' name='CombineMeaningReadingCount' value='CombineMeaningReadingCount'>";
	//strInitialDiv += " | Separate Meaning/Reading totals <input type='checkbox' id='SeparateMeaningReadingTotals' name='SeparateMeaningReadingTotals' value='SeparateMeaningReadingTotals'>";
	
	strInitialDiv += "</div>";
	strInitialDiv += "<div id='ReviewAnalysisSection' style='width: 100%; text-align: center;'>";
	strInitialDiv += "</div>";
	strInitialDiv += "</div>";
	strInitialDiv += "</div>";
	
	
	$( "head" ).append( ReviewAnalysisStyles );
	$('section.progression').after(strInitialDiv);
	
	//$('div.navbar-static-top').after(strInitialDiv);
	
	$("#displayOptions").hide();
	bDisplayOptionsVisible = false;
	
	if (strAPIKey != "") {
		$("#APIkey").val(strAPIKey);
	}
	
	$( "button#startAnalysis" ).click(function() {
	  startReviewAnalysis();
	});
	
	$( "button#clearResults" ).click(function() {
	  clearTable();
	});
	
	$( "button#enterAPIKey" ).click(function() {
	  enterNewAPIKey();
	});
	
	$( "button#toggleExtraOptions" ).click(function() {
	  toggelDisplayOptions();
	});
}

function toggelDisplayOptions()
{
	if (bDisplayOptionsVisible) {
		$("#displayOptions").hide();
		bDisplayOptionsVisible = false;
		$("#toggleExtraOptions").html('Show Display Options');
	} else {
		$("#displayOptions").show();
		bDisplayOptionsVisible = true;
		$("#toggleExtraOptions").html('Hide Display Options');
	}
}

function getLevelInformation(iLev)
{
	iUserLevel = iLev;
	console.log("Level: " + iUserLevel);
	
	// get r/k/v info
	
	for (i = 1; i <= iUserLevel; ++i) {
		var iLevelRadSubTotal = 0;
		var iLevelKanSubTotal = 0;
		var iLevelVocSubTotal = 0;		
		
		// Radicals
		$.get( strRadURL + "/" + i, function( data ) {
			var iDataLevel = data['requested_information'][0]['level'];
			var iRadCount = Object.keys(data['requested_information']).length
			
			var iRadCorrectAnswers = 0;
			var iRadIncorrectAnswers = 0;
			
			for (n = 0; n < iRadCount; ++n) {
				
				if (data['requested_information'][n]['user_specific'] != null) {
					var irCorrect = parseInt(data['requested_information'][n]['user_specific']['meaning_correct']);
					var irIncorrect = parseInt(data['requested_information'][n]['user_specific']['meaning_incorrect']);
					
					iRadCorrectAnswers += irCorrect;
					iRadIncorrectAnswers += irIncorrect;
					

				}
			}
            iRadCorrectAnswers -= iRadIncorrectAnswers;
            iCorrectTotal += iRadCorrectAnswers;
            iIncorrectTotal += iRadIncorrectAnswers;
			a_iLevelTotals[iDataLevel-1] += (iRadCorrectAnswers + iRadIncorrectAnswers);
			$( "td#Levtot" + iDataLevel ).html(a_iLevelTotals[iDataLevel-1]);
			$( "td#Rad" + iDataLevel ).html( (iRadCorrectAnswers + iRadIncorrectAnswers) + " [+"+iRadCorrectAnswers+" -"+iRadIncorrectAnswers+"]");
			
		});
		
		// Kanji
		$.get( strKanURL + "/" + i, function( data ) {
			var iDataLevel = data['requested_information'][0]['level'];
			var iKanCount = Object.keys(data['requested_information']).length;			
			var iKanCorrectAnswers = 0;
			var iKanIncorrectAnswers = 0;
			for (n = 0; n < iKanCount; ++n) {
				if (data['requested_information'][n]['user_specific'] != null) {
					var ikCorrectM = parseInt(data['requested_information'][n]['user_specific']['meaning_correct']);
					var ikIncorrectM = parseInt(data['requested_information'][n]['user_specific']['meaning_incorrect']);
					var ikCorrectR = parseInt(data['requested_information'][n]['user_specific']['reading_correct']);
					var ikIncorrectR = parseInt(data['requested_information'][n]['user_specific']['reading_incorrect']);
                    
                    iKanCorrectAnswers += ikCorrectM+ikCorrectR;
                    iKanIncorrectAnswers += ikIncorrectM+ikIncorrectR;
				}
			}
            iKanCorrectAnswers -= iKanIncorrectAnswers;

            if ($("#CombineMeaningReadingCount").prop('checked')) {
                iKanCorrectAnswers = iKanCorrectAnswers/2;
                iKanIncorrectAnswers =iKanIncorrectAnswers/2;
            }
            iCorrectTotal += iKanCorrectAnswers;
            iIncorrectTotal += iKanIncorrectAnswers;

			a_iLevelTotals[iDataLevel-1] += (iKanCorrectAnswers + iKanIncorrectAnswers);
			$( "td#Levtot" + iDataLevel ).html( a_iLevelTotals[iDataLevel-1] );
			$( "td#Kan" + iDataLevel ).html( (iKanCorrectAnswers + iKanIncorrectAnswers) + " [+"+iKanCorrectAnswers+" -"+iKanIncorrectAnswers+"]");
		});
		
		// Vocab
		$.get( strVocURL + "/" + i, function( data ) {
			var iDataLevel = data['requested_information'][0]['level'];
			var iVocCount = Object.keys(data['requested_information']).length;
			var iVocCorrectAnswers = 0;
			var iVocIncorrectAnswers = 0;
			
			for (n = 0; n < iVocCount; ++n) {
				if (data['requested_information'][n]['user_specific'] != null) {
					var ivCorrectM = parseInt(data['requested_information'][n]['user_specific']['meaning_correct']);
					var ivIncorrectM = parseInt(data['requested_information'][n]['user_specific']['meaning_incorrect']);
					var ivCorrectR = parseInt(data['requested_information'][n]['user_specific']['reading_correct']);
					var ivIncorrectR = parseInt(data['requested_information'][n]['user_specific']['reading_incorrect']);
                    
                    iVocCorrectAnswers += ivCorrectM+ivCorrectR;
                    iVocIncorrectAnswers += ivIncorrectM+ivIncorrectR;
				}
			}
            iVocCorrectAnswers -= iVocIncorrectAnswers;
            if ($("#CombineMeaningReadingCount").prop('checked')) {
                iVocCorrectAnswers = iVocCorrectAnswers/2;
                iVocIncorrectAnswers =iVocIncorrectAnswers/2;
            }
            iIncorrectTotal += iVocIncorrectAnswers;
            iCorrectTotal += iVocCorrectAnswers;
			a_iLevelTotals[iDataLevel-1] += (iVocCorrectAnswers + iVocIncorrectAnswers);
			$( "td#Levtot" + iDataLevel ).html( a_iLevelTotals[iDataLevel-1] );	
			$( "td#Voc" + iDataLevel ).html( (iVocCorrectAnswers + iVocIncorrectAnswers) + " [+"+iVocCorrectAnswers+" -"+iVocIncorrectAnswers+"]");
			
			var dPercentage = (iCorrectTotal/(iCorrectTotal+iIncorrectTotal)) * 100;
			$( "td#mainTotal" ).html( "TOTAL REVIEWS: "+ (iCorrectTotal+iIncorrectTotal) +" Accuracy: "+ (dPercentage.toFixed( $( "#accuracyDecimals" ).val()  )) + "%");
		});
	}
}

function clearTable()
{
	$( "div#ReviewAnalysisSection" ).html( "" );
	var a_iLevelTotals = [];

	iUserLevel = 0;

	iCorrectTotal = 0;
	iIncorrectTotal = 0;
}

function startReviewAnalysis()
{
	if (! $.jStorage.get("ReviewAnalysisSavedAPIKey")) {
		alert ("Please enter your API Key");
		return 0;
	} else {
		strAPIKey = $.jStorage.get("ReviewAnalysisSavedAPIKey");
		strUserLevelURL = "https://www.wanikani.com/api/user/"+ strAPIKey +"/level-progression";
		strRadURL = "https://www.wanikani.com/api/user/"+ strAPIKey +"/radicals";
		strKanURL = "https://www.wanikani.com/api/user/"+ strAPIKey +"/kanji/";
		strVocURL = "https://www.wanikani.com/api/user/"+ strAPIKey +"/vocabulary/";
	}
	
	clearTable();
	
	var strBaseTable = "";
	
	strBaseTable = "<table border='1' style='margin-left: auto; margin-right: auto; width: 80%; border 1px solid #000000;' id='ReviewAnalysisTable'><tr><td>Level</td><td>Rad</td><td>Kan</td><td>Voc</td><td>Level Tot.</td></tr></table>";
	
	$( "div#ReviewAnalysisSection" ).append( strBaseTable );	
	
	$.get( strUserLevelURL, function( data ) {
		if (data['user_information'] == null) {
			clearTable();
			alert("No data returned. Something wrong with API key or network.");
			return 0;
		}
		var iCurrentUserLevel = parseInt(data['user_information']['level']);
		a_iLevelTotals = initialiseLevelTotalsArray(iCurrentUserLevel);
		for (n = 0; n < iCurrentUserLevel; ++n) {
			$( "table#ReviewAnalysisTable" ).append( "<tr><td>"+ (n+1) +"</td><td id='Rad"+ (n+1) +"'>0</td><td id='Kan"+ (n+1) +"'>0</td><td id='Voc"+ (n+1) +"'>0</td><td id='Levtot"+ (n+1) +"'>0</td></tr>" );
		}
		$( "table#ReviewAnalysisTable" ).append( "<tr><td style='background-color: #660000; color: #ffffff; font-weight: bold;' id='mainTotal' colspan='5'>0</td></tr>" );
		getLevelInformation(iCurrentUserLevel);
	});	
}

function initialiseLevelTotalsArray(iCt)
{
	var a_iReturn = new Array(iCt);
	for (x = 0; x < iCt; ++x) {
		a_iReturn[x] = 0;
	}
	return a_iReturn;
}

function enterNewAPIKey()
{
	var strExistingAPIKey = "";
	if ($.jStorage.get("ReviewAnalysisSavedAPIKey")) {
		strExistingAPIKey = $.jStorage.get("ReviewAnalysisSavedAPIKey");
	}
	var strNewAPIKey = prompt("Enter API Key", strExistingAPIKey)
	if (strNewAPIKey != null) { $.jStorage.set("ReviewAnalysisSavedAPIKey", strNewAPIKey); }
	setAPIKeyButtonColour();
}

function setAPIKeyButtonColour()
{
	var strAPIKeyButtonColor;
	if ($.jStorage.get("ReviewAnalysisSavedAPIKey")) {
		strAPIKeyButtonColor = "#42AC48";
	} else {
		strAPIKeyButtonColor = "#E45350";		
	}
	$( "#enterAPIKey" ).css('color', strAPIKeyButtonColor);
}
