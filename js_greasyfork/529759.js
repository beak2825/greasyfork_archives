// ==UserScript==
// @name        DECIPHER - Highlighter
// @version     1.1
// @description Highlights certain things when in XML view, see description on GreasyFork for full details
// @author      Scott / SSearle
// @include     https://survey*.researchnow.com/apps/lumos/*
// @include     https://survey-*.dynata.com/apps/lumos/*
// @include     https://survey-d.yoursurveynow.com/apps/lumos/*
// @exclude     *:edit
// @grant		unsafeWindow
// @require     http://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/232210
// @downloadURL https://update.greasyfork.org/scripts/529759/DECIPHER%20-%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/529759/DECIPHER%20-%20Highlighter.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var jQuery = unsafeWindow.jQuery; 	//Need for Tampermonkey or it raises warnings.
    var $ = unsafeWindow.jQuery; 		//Need for Tampermonkey or it raises warnings.

	var highlightingDone = 0;			//Flag to indicate whether row has been highlighted or not.
	var highlightingDoneUp = 0;			//Flag to indicate whether row up to start of question has been highlighted or not.
	var highlightingDoneDown = 0;		//Flag to indicate whether row down to end of question has been highlighted or not.
	var lineText = "";					//Will hold the text for a line in the XML view.
	var prevLineText = "";				//Will hold the text for the previous line in the XML view.
	var listOfConds = [];				//Holds all conds that result in question being hidden.
	var listOfSingleLines = [];			//Used in conjunction with listOfConds for lines that can have cond on them.
	var failSafeUp = 0;					//Prevents hangs
	var failSafeDown = 0;				//Prevents hangs
	var tempCounterUp = 0;
	var tempCounterDown = 0;
	var tempText = "";


function highlightFunction() {										//This is the actual highlighter code itself, if you want to highlight something new, add it in here
	console.clear();													//Clear the console before every run for clarity.
    console.log("Function executed!");									//Clarity prints
	console.log("Running");												//

	jQuery(".CodeMirror-code div").not("[class*='CodeMirror']").each(function(index,element){			//For every line of code in the XML

		if ($(element).find("pre").text().length > 1) {														//Ignore empty rows

			lineText = $(element).find("pre").text();															//Get the text of the line
			//console.log("Iteration: " + index);																//Clarity print
			//console.log(lineText);																			//Clarity print










//
//Beginning of COND check for red highlighting
		if (lineText.indexOf('cond="') >= 0) {																//If the line has "cond=" on it

				listOfConds = ['cond="0"','and 0','or 0'];															//List of conds that will trigger the highlight
				listOfSingleLines = ['row','col','choice']															//List of things that can have inline conds

				for (let i = 0; i < listOfConds.length; i++) {														//Cycle over all the items in listOfConds
					if (lineText.indexOf(listOfConds[i]) >= 0) {														//Check to see if the cond text is equal to false

						console.log(lineText);
						console.log("Cond found");
						highlightingDone = 0;																			//Reset these counters/flags
						highlightingDoneUp = 0;																			//
						highlightingDoneDown = 0;																		//
						failSafeUp = 0;																					//
						failSafeDown = 0;																				//

						for (let j = 0; j < listOfSingleLines.length; j++) {												//Cycle over all the items in listOfSingleLines
							if (lineText.indexOf(listOfSingleLines[j]) >= 0) {													//If it is an in-line cond (row/col/choice)
								$(element).css("background-color","rgb(255, 204, 204)");											//Highlight in red
								highlightingDone = 1;																				//Set flag and move onto next line
								console.log("AAA: Single row done!");																//
							}																										//
						}																											//

						if (!highlightingDone) {																			//If flag not set yet, then it's a whole question cond

							$(element).css("background-color","rgb(255, 204, 204)");											//Highlight current cond line in red
							tempCounterUp = 0;																					//Temporarily counts backwards
							tempCounterDown = 0;																				//Temporarily counts forwards
							tempText = ""																						//Temporary text holder
							console.log("BBB: Searching...\n \n");																//

							while(!highlightingDoneUp && failSafeUp < 100) {													//Travel UPWARDS, highlighting as you go, until you reach a chevron "<"

								console.log("EEE: Going up...");																	//
								tempText = $(element).prevAll().eq(tempCounterUp).find("pre").text();								//Text we're checking
								failSafeUp++;																						//Make sure you don't end up in an infinite upwards check
								console.log(tempText);																				//
								console.log("failSafeUp at " + failSafeUp);															//

								if (tempText.indexOf('<') >= 0) {																	//If the text on the current line has a chevron, i.e. <radio, <checkbox, etc
									$(element).prevAll().eq(tempCounterUp).css("background-color","rgb(255, 204, 204)");				//Highlight in red
									highlightingDoneUp = 1;																				//Stop moving up the lines
									console.log("DDD: Finished going up!\n \n");														//
								}
								else {																								//If no chevron found
									$(element).prevAll().eq(tempCounterUp).css("background-color","rgb(255, 204, 204)");				//Highlight in red
									tempCounterUp++;																					//Move up to the next line above
								}
							}//END OF UP WHILE LOOP

							while(!highlightingDoneDown && failSafeDown < 100) {												//Travel DOWNWARDS, highlighting as you go, until you reach a chevron "<"

								console.log("HHH: Going down...");																	//
								tempText = $(element).nextAll().eq(tempCounterDown).find("pre").text();								//Text we're checking
								failSafeDown++;																						//Make sure you don't end up in an infinite downwards check
								console.log(tempText);																				//
								console.log("failSafeDown at " + failSafeDown);														//

																																	//If the text on the current line has a closing tag: </Radio,</Checkbox,</Text,</Textarea,</Number,</Select
								if (tempText.indexOf('</ra') >= 0 || tempText.indexOf('</ch') >= 0 || tempText.indexOf('</te') >= 0 || tempText.indexOf('</n') >= 0 || tempText.indexOf('</se') >= 0) {
									$(element).nextAll().eq(tempCounterDown).css("background-color","rgb(255, 204, 204)");				//Highlight in red
									highlightingDoneDown = 1;																			//Stop moving up the lines
									console.log("GGG: Finished going down!\n \n");														//
								}
								else {																								//If no chevron found
									$(element).nextAll().eq(tempCounterDown).css("background-color","rgb(255, 204, 204)");				//Highlight in red
									tempCounterDown++;																					//Move up to the next line above
								}
							}//END OF DOWN WHILE LOOP
						}//END OF WHOLE QUESTION COND CHECK
					}//END OF listOfConds CHECK
				}//END OF listOfConds FOR LOOP
			}//END of COND check

























//
//Beginning of WHERE check for orange highlighting
		if (lineText.indexOf('where="') >= 0) {																//If the line has "cond=" on it

				//listOfConds = ['cond="0"','and 0','or 0'];															//List of conds that will trigger the highlight
				//listOfSingleLines = ['row','col','choice']															//List of things that can have inline conds

				//for (let i = 0; i < listOfConds.length; i++) {														//Cycle over all the items in listOfConds
					//if (lineText.indexOf(listOfConds[i]) >= 0) {														//Check to see if the cond text is equal to false

						console.log(lineText);
						console.log("Where found");
						highlightingDone = 0;																			//Reset these counters/flags
						highlightingDoneUp = 0;																			//
						highlightingDoneDown = 0;																		//
						failSafeUp = 0;																					//
						failSafeDown = 0;																				//

						//for (let j = 0; j < listOfSingleLines.length; j++) {												//Cycle over all the items in listOfSingleLines
							//if (lineText.indexOf(listOfSingleLines[j]) >= 0) {													//If it is an in-line cond (row/col/choice)
								//$(element).css("background-color","rgb(255, 204, 204)");											//Highlight in red
								//highlightingDone = 1;																				//Set flag and move onto next line
								//console.log("AAA: Single row done!");																//
							//}																										//
						//}																											//

						if (!highlightingDone) {																			//If flag not set yet, then it's a whole question cond

							$(element).css("background-color","rgb(255, 255, 220)");												//Highlight current cond line in red
							tempCounterUp = 0;																					//Temporarily counts backwards
							tempCounterDown = 0;																				//Temporarily counts forwards
							tempText = ""																						//Temporary text holder
							console.log("BBB: Searching...\n \n");																//

							while(!highlightingDoneUp && failSafeUp < 100) {													//Travel UPWARDS, highlighting as you go, until you reach a chevron "<"

								console.log("EEE: Going up...");																	//
								tempText = $(element).prevAll().eq(tempCounterUp).find("pre").text();								//Text we're checking
								failSafeUp++;																						//Make sure you don't end up in an infinite upwards check
								console.log(tempText);																				//
								console.log("failSafeUp at " + failSafeUp);															//

								if (tempText.indexOf('<') >= 0) {																	//If the text on the current line has a chevron, i.e. <radio, <checkbox, etc
									$(element).prevAll().eq(tempCounterUp).css("background-color","rgb(255, 255, 220)");					//Highlight in red
									highlightingDoneUp = 1;																				//Stop moving up the lines
									console.log("DDD: Finished going up!\n \n");														//
								}
								else {																								//If no chevron found
									$(element).prevAll().eq(tempCounterUp).css("background-color","rgb(255, 255, 220)");					//Highlight in red
									tempCounterUp++;																					//Move up to the next line above
								}
							}//END OF UP WHILE LOOP

							while(!highlightingDoneDown && failSafeDown < 100) {												//Travel DOWNWARDS, highlighting as you go, until you reach a chevron "<"

								console.log("HHH: Going down...");																	//
								tempText = $(element).nextAll().eq(tempCounterDown).find("pre").text();								//Text we're checking
								failSafeDown++;																						//Make sure you don't end up in an infinite downwards check
								console.log(tempText);																				//
								console.log("failSafeDown at " + failSafeDown);														//

																																	//If the text on the current line has a closing tag: </Radio,</Checkbox,</Text,</Textarea,</Number,</Select
								if (tempText.indexOf('</ra') >= 0 || tempText.indexOf('</ch') >= 0 || tempText.indexOf('</te') >= 0 || tempText.indexOf('</n') >= 0 || tempText.indexOf('</se') >= 0) {
									$(element).nextAll().eq(tempCounterDown).css("background-color","rgb(255, 255, 220)");				//Highlight in red
									highlightingDoneDown = 1;																			//Stop moving up the lines
									console.log("GGG: Finished going down!\n \n");														//
								}
								else {																								//If no chevron found
									$(element).nextAll().eq(tempCounterDown).css("background-color","rgb(255, 255, 220)");				//Highlight in red
									tempCounterDown++;																					//Move up to the next line above
								}
							}//END OF DOWN WHILE LOOP
						}//END OF WHOLE QUESTION COND CHECK
					//}//END OF listOfConds CHECK
				//}//END OF listOfConds FOR LOOP
			}//END of COND check










		}//END OF IGNORE EMPTY ROWS
	});//END OF .each LOOP
}//END OF MAIN FUNCTION





highlightFunction();												//Runs main function once on page load



//
//Below scripts deal with how to trigger the highlightFunction();
//It's done via scrolling the XML view, either via keys, or the scrollwheel

$(document).on("keydown", function (e) {							//Listens for keypresses to run script/update highlights
	if ([37, 38, 39, 40, 33, 34].includes(e.which))						//Keys: Left Arrow/Up Arrow/Right Arrow/Down Arrow/Page Up/Page Down
		{																	//
			highlightFunction();											//Run the function if any of the above keys are hit
		}																	//
});																	//END

$(document).on("wheel", function () {								//Listens for scrollwheel to run script/update highlights
	highlightFunction();												//Run the function if any of the above keys are hit
});																	//END














})(); 																														//END OF WHOLE SCRIPT