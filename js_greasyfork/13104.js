// ==UserScript==
// @name         Turkprime Demographics Auto-Fill (MTurk)
// @description	 Automatically fills in demographics questions on Turkprime HITs.
// @version      3
// @author       Broen7 -- (c)2015 - All Rights Reserved
// @namespace 	 https://greasyfork.org/users/18095
// @match        https://workers.turkprimeprojects.com/*
// @require		 https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant		 -
// @downloadURL https://update.greasyfork.org/scripts/13104/Turkprime%20Demographics%20Auto-Fill%20%28MTurk%29.user.js
// @updateURL https://update.greasyfork.org/scripts/13104/Turkprime%20Demographics%20Auto-Fill%20%28MTurk%29.meta.js
// ==/UserScript==
$(function(){var gender,ethnicity,birthYear,maritalStatus,politicalView;
// -- DO NOT EDIT ABOVE THIS LINE --

/*
			INSTRUCTIONS:
				Remove the two leading slashes from the options that apply to you. Edit birthYear. Make sure that all unused options have two leading slashes.

				Example for a political liberal:
					// politicalView = "Very conservative";
					// politicalView = "Conservative";
					// politicalView = "Moderate";
					   politicalView = "Liberal";
					// politicalView = "Very liberal";

				Don't change the options' text, except for birthYear. (ie. changing "Male" to "Sith Lord" won't work.)
			END INSTRUCTIONS.
*/


// gender = "Male";
// gender = "Female";

// ethnicity = "Asian";
// ethnicity = "Black/African American";
// ethnicity = "Hispanic/Latino";
// ethnicity = "White/Caucasian";
// ethnicity = "Other";

// birthYear = "1930"; // <- Use a number between 1930 and 2015. Don't delete the quotes or semicolon.

// maritalStatus = "Now married";
// maritalStatus = "Widowed";
// maritalStatus = "Divorced";
// maritalStatus = "Separated";
// maritalStatus = "Never married";

// politicalView = "Very conservative";
// politicalView = "Conservative";
// politicalView = "Moderate";
// politicalView = "Liberal";
// politicalView = "Very liberal";


// -- DO NOT EDIT BELOW THIS LINE --
$("input[value='"+gender+"']").prop("checked",!0);
$("input[value='"+ethnicity+"']").prop("checked",!0);
$("select.questionanswer[name='[3].Text']").val(birthYear);
$("input[value='"+maritalStatus+"']").prop("checked",!0);
$("input[value='"+politicalView+"']").prop("checked",!0);});