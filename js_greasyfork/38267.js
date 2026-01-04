// ==UserScript==
// @name         Rotten Tomatoes export CSV button
// @namespace
// @version      0.4
// @description  Adds a 'Download CSV' button to the personal ratings page in Rotten Tomatoes which downloads a Letterboxd compatible CSV file.
// @author       Guy Hizkiau
// @match        https://www.rottentomatoes.com/user/id/*/wts
// @grant        none
// @namespace https://greasyfork.org/users/72895
// @downloadURL https://update.greasyfork.org/scripts/38267/Rotten%20Tomatoes%20export%20CSV%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/38267/Rotten%20Tomatoes%20export%20CSV%20button.meta.js
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

    if (ratingDateVerbal[1] == "days") {
        ratingDate.setDate(ratingDate.getDate()-ratingDateVerbal[0]);
        var ratingDateFormated = ratingDate.getFullYear() +  '-' + (ratingDate.getMonth()+1) + '-' + ratingDate.getDate();
    } else if (ratingDateVerbal[1] == "months") {
        ratingDate.setMonth(ratingDate.getMonth()-ratingDateVerbal[0]);
        var ratingDateFormated = ratingDate.getFullYear() +  '-' + (ratingDate.getMonth()+1) + '-' + 1;
    } else if (ratingDateVerbal[1] == "years") {
        ratingDate.setFullYear(ratingDate.getFullYear()-ratingDateVerbal[0]);
        var ratingDateFormated = ratingDate.getFullYear() +  '-' + 1 + '-' + 1;
    }

	if (ratingValueHalves == "½") {
		var ratingValue = ratingValueWholes + 0.5;
	}
	else {
		var ratingValue = ratingValueWholes;
	}

	ratingsArray.push([title, year, ratingDateFormated, ratingValue]);
}

var csvContent = "data:text/csv;charset=utf-8,";

csvContent += "Title,Year,WatchedDate,Rating\n"

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