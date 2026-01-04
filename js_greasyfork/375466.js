// ==UserScript==
// @name         FurAffinity YCH/Comission submission hide and remove
// @namespace    https://greasyfork.org/en/scripts/375466-furaffinity-ych-comission-submission-hide-and-remove
// @version      1.5
// @description  Clear out those fucking useless YCH/AUCTION/REMINDER/ETC submissions
// @author       SomeAnnoyedFAUser
// @match        https://www.furaffinity.net/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/375466/FurAffinity%20YCHComission%20submission%20hide%20and%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/375466/FurAffinity%20YCHComission%20submission%20hide%20and%20remove.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jQuery = window.jQuery;											//Need for Tampermonkey or it raises warnings...

	var url = window.location.href;										//Current page URL. Only used to run the right scripts.

	var keywordsToHide = ["ych","auction","reminder"];			//Blacklisted keywords (Searches Title, Description, Keywords, and Users)
    var noOfKeywordsToCheck = keywordsToHide.length;					//The number of keywords, this is used to loop over so we check every single one...
    var submissionList = jQuery( "figcaption" );						//A list of all the submission titles on the current page
	var descriptionList = jQuery( "figcaption" );						//A list of all the descriptions on the current page
    var noOfSubmissionsToCheck = submissionList.length;					//The number of submissions, this is used to loop over so we check every single one...
    var submissionIterator = 0;											//We start our checks at the zeroeth submissions
    var currText = "";													//Holds text of submission being checked
	var keywordIterator = 0;											//We start our checks at the zeroeth keyword...
	var blacklistedWord = "";											//This holds keyword being searched for...

	var hideOrReplace = "replace";			//Whether or not to "hide", or "replace" uploads.
											//Hide:		This will simply hide it, page layouts might look weird, but it'll just remove it from the page.
											//Replace:	This will replace the upload with the reason that it was removed. IE: Which keyword/username was found.


for (submissionIterator; submissionIterator < noOfSubmissionsToCheck; submissionIterator++)				//Loops over all of the submissions on the page...
{
	currText = submissionList.eq(submissionIterator).text();											//Text of current submission being checked...
	keywordIterator = 0;																				//Restarts at the zeroeth keywords once the previous submission has been checked

	for (keywordIterator; keywordIterator < noOfKeywordsToCheck; keywordIterator++)						//Loops over all of the items in keywordsToHide...
	{
		blacklistedWord = keywordsToHide[keywordIterator];												//Holds current keywords being checked...
		if (currText.toLowerCase().includes(blacklistedWord))											//If the current submission being checked has a blacklisted word
			{
				console.log("The submission "+currText+" contains the blacklisted word "+blacklistedWord);	//Indicate that in the console

				if (url.search("msg/submissions") >= 0)																//If you're on "furaffinity.net/msg/submissions/"
					{
						submissionList.eq(submissionIterator).parent().find(":checkbox").prop('checked', true);		//Ticks the checkbox so when you click "Remove checked" it is removed
					}

				if (hideOrReplace.toLowerCase() == "hide")															//Hides the item entirely
					{
						submissionList.eq(submissionIterator).parent().hide();
					}
				else if (hideOrReplace.toLowerCase() == "replace")													//Blurs the item out, and gives reason for being hidden
					{
						submissionList.eq(submissionIterator).parent().find("b").before("<div style=\"font-weight: bold; color: red\">Hidden due to: "+blacklistedWord+"</div>");	//Notes the reason...
						submissionList.eq(submissionIterator).parent().find("img").css({ "-webkit-filter": "blur(10px)", "filter": "blur(10px)" });									//Blurs the image out
					}

					break;	//Break away from -this- submission, and move onto the next one...
			}
	}//End of keyword loop

}//End of submission loop

})();