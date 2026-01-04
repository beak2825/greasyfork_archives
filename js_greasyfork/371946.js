// ==UserScript==
// @name         Rotten Tomatoes export CSV button with Reviews
// @namespace
// @version      0.4_R
// @description  Adds a 'Download CSV' button to the personal ratings page in Rotten Tomatoes which downloads a Letterboxd compatible CSV file.
// @author       Guy Hizkiau 
// @Guy who added reviews as an exported field   Lagomorph
// @match        https://www.rottentomatoes.com/user/id/*/ratings
// @grant        none
// @namespace https://greasyfork.org/users/72895
// @downloadURL https://update.greasyfork.org/scripts/371946/Rotten%20Tomatoes%20export%20CSV%20button%20with%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/371946/Rotten%20Tomatoes%20export%20CSV%20button%20with%20Reviews.meta.js
// ==/UserScript==

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var ratingBoxes = document.getElementsByClassName("media bottom_divider");
var ratingsArray = [];

for (var i = ratingBoxes.length - 1; i >= 0; i--) {
	var boxBody = ratingBoxes[i].getElementsByClassName("media-body")[0];
	var boxHeading = boxBody.getElementsByClassName("media-heading")[0];
	var titleA = boxHeading.getElementsByTagName("a")[0];
	var title = titleA.textContent.replaceAll(",", "");

	var yearSpan = boxHeading.getElementsByTagName("span")[0];
	var year = yearSpan.textContent.substring(1,5);

	var ratingDiv = boxBody.getElementsByTagName("div")[2];
	var ratingValueWholes = ratingDiv.childElementCount;
	var ratingValueHalves = ratingDiv.innerText;

    var ratingLog = boxBody.getElementsByClassName("ratingMovieDate")[0].textContent;
    var ratingDateVerbal = ratingLog.substring(0,ratingLog.indexOf("ago")-1).split(" ");

    var ratingDate = new Date();
    var ratingDateFormated;
    var ratingValue
    var reviewRaw = boxBody.children[3].innerText; //grab raw review text
    reviewRaw = reviewRaw.replaceAll("\"", "\"\""); //replace double quotes with double double quotes to prepare for comma sanitziation for CSV format
    var review = '"' + reviewRaw + '"' //append quotes at beginning and end of string to escape all commas for CSV format

    if (ratingDateVerbal[1] == "days") {
        ratingDate.setDate(ratingDate.getDate()-ratingDateVerbal[0]);
        ratingDateFormated = ratingDate.getFullYear() + '-' + (ratingDate.getMonth()+1) + '-' + ratingDate.getDate();
    } else if (ratingDateVerbal[1] == "months") {
        ratingDate.setMonth(ratingDate.getMonth()-ratingDateVerbal[0]);
        ratingDateFormated = ratingDate.getFullYear() + '-' + (ratingDate.getMonth()+1) + '-' + 1;
    } else if (ratingDateVerbal[1] == "years") {
        ratingDate.setFullYear(ratingDate.getFullYear()-ratingDateVerbal[0]);
        ratingDateFormated = ratingDate.getFullYear() + '-' + 1 + '-' + 1;
    }

	if (ratingValueHalves == "½") {
		ratingValue = ratingValueWholes + 0.5;
	}
	else {
		ratingValue = ratingValueWholes;
	}

	ratingsArray.push([title, year, ratingDateFormated, ratingValue, review]);
}

var csvContent = "data:text/csv;charset=utf-8,";

csvContent += "Title,Year,WatchedDate,Rating,Review\n"

ratingsArray.forEach(function(infoArray, index){
   dataString = infoArray.join(",");
   csvContent += index < ratingsArray.length ? dataString + "\n" : dataString;

});

var encodedUri = encodeURI(csvContent);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "rotten_tomatoes_ratings.csv");
document.body.appendChild(link); // Required for FF

var pageBody = document.getElementById("main_container").children[1].children[1];

function download() {
	link.click();
	return;
}

var downloadButton = document.createElement("button");
var buttonText = document.createTextNode("Download CSV");
downloadButton.appendChild(buttonText);
downloadButton.classList.add("panel-heading");
downloadButton.onclick = download;

pageBody.insertBefore(downloadButton, pageBody.children[0]);
