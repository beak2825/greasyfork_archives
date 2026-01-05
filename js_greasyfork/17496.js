// ==UserScript==
// @name		FurkThat!
// @namespace	https://furk.net
// @description	Allows users of furk.net to add files to their account from other sites.
// @include		https://kat.cr/*
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js

// @version		1.1
// @grant		none
// @icon		furk.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/17496/FurkThat%21.user.js
// @updateURL https://update.greasyfork.org/scripts/17496/FurkThat%21.meta.js
// ==/UserScript==

// GITHUB PAGE: https://github.com/DjangoDuck/FurkThat

// Retrieves the info hash depending on which site it is.
// Feel free to add any more websites

// CSS, first a method for adding a style tag with the parameters inside
var furk_addStyle = function (css) {
	var head = document.getElementsByTagName('head')[0],
		style = document.createElement('style');
	if (!head) {
		return;
	}
	style.type = 'text/css';
	style.textContent = css;
	head.appendChild(style);
};

// Adds all the ids and classes, so no need for many .css() methods
furk_addStyle("						\
#furkButtonBar {					\
	padding: 10px 0px 10px 0px;		\
	position: fixed;				\
	bottom: 0;						\
	left: 0;						\
	z-index: 100;					\
	background-color: #F8F8F8;		\
	border: 1px solid #E7E7E7;		\
}									\
.furkButton {						\
	text-decoration: none;			\
	font-size: 12px;				\
	padding: 5px;					\
	margin: 0px 2px 0px 2px;		\
	background-color: #337AB7;		\
	color: white;					\
	cursor: pointer;				\
	border-radius: 4px;				\
}									\
.furkMiniButton {					\
	font-size: 10px;				\
	padding: 3px;					\
}									\
.furkAddMini {						\
	text-alight: right;				\
}									\
.furkButton:hover {					\
	color: white;					\
	background-color: #296191;		\
}									\
.furkPlayButton {					\
	background-color: #449D44;		\
}									\
.furkPlayButton:hover {				\
	background-color: #377c37;		\
}									\
.furkNotifButton {					\
	background-color: #F8F8F8;		\
	color: black;					\
	border: 1px solid #E7E7E7;		\
}									\
.furkNotifButton:hover {			\
	background-color: #F8F8F8;		\
	cursor: default;				\
	color: black;					\
}									\
#furkNotification {					\
	font-size: 12px;				\
	text-decoration: none;			\
	position: fixed;				\
	bottom: 40px;					\
	padding:2px;					\
	left: 0px;						\
	z-index: 100;					\
	background-color: #F8F8F8;		\
	border: 1px solid #E7E7E7;		\
}									\
#furkScreenshots {					\
	width: 100%;					\
	position: fixed;				\
	bottom: 0;						\
	left: 0;						\
	z-index: 99;					\
}									\
.furkReady {						\
	color: green;					\
}									\
.furkNotReady {						\
	color: red;						\
}");


// Makes the notification bar, doesnt happen in furkInitHTML because it is used for errors.
$("body").append("<div id='furkNotification'></div>");
$("#furkNotification").hide();

function furkAddMiniClick () {
	var currentAddBtn = $(this);
	$(currentAddBtn).html("...");

	var sentInfoHash = $(currentAddBtn).data("infohash");
	console.log(sentInfoHash);

	$.ajax({
		url: "https://www.furk.net/api/dl/add",
		jsonp: "jsonp",
		dataType: "jsonp",
		data: {
			info_hash: sentInfoHash,
		},
		success: function (response) {
			console.log(response.status);
			if (response.status != "ok") {
				console.log("Bad response");
				return;
			}
			console.log("Good response");

			var html = "Added | Status: ";
			if(response.dl.dl_status != "failed") {
				html += response.dl.dl_status;
			}
			else {
				html += response.dl.dl_status;
			}
			$(currentAddBtn).html(html);
		}
	});
}

function furkAnalyseTable () {
	// Creates an array of info hashes and finds them as well
		var infoHashGroup = []
		$(".data tr a[title='Torrent magnet link']").each(function() {
			infoHashGroup.push($(this).attr('href').slice(20,60));
		});

		$.ajax({
			url: "https://www.furk.net/api/file/info",
			jsonp: "jsonp",
			dataType: "jsonp",
			data: {
				info_hash: infoHashGroup,
			},
			success: function (response) {
				console.log(response);
				if(response.status != "ok") {
					$("#furkNotification").show();
					if (response.error == "access denied") {
						response.error += " (Please login to Furk.net in another window)"
					}
					$("#furkNotification").html("Error: " + response.error).css("bottom", "0px");
					return;
				}


				// REGEX
				var regTest = /btih:([0-9a-fA-F]{40})/;

				$(".data tr[id^='torrent_']").each(function(tr) {

					var currentInfoHash = $(this).find("a[href^='magnet:']").attr("href").match(regTest)[1];
					console.log(currentInfoHash);
					/*var tr = $(".data tr a[href*='" + file.info_hash + "']").closest("tr");
					if (!tr) {
						console.log("No matching tr found");
						return;
					}*/

					var file = response.files.filter(function(e) {
						return e.info_hash === currentInfoHash
					});
					if(!file || !file[0]) {
						console.log("File not found");

						var addedHTML = "<tr><td colspan='6' style='border-right:0px solid black; padding: 0px 0px 25px 0px'>";
						addedHTML += "<a class='furkButton furkMiniButton furkAddMini' href='javascript:' data-infohash='" + currentInfoHash + "'>Add</a>"
						addedHTML += "</td></tr>";

						$(this).after(addedHTML);

						return;
					}
					console.log(file);
					file = file[0];

					console.log(file);

					var addedHTML = "<tr><td colspan='6' style='border-right:0px solid black; padding: 0px 0px 10px 0px'>";
					addedHTML += "<div style='padding: 0px 0px 0px 2px; ";

					if (file.ss_urls_tn_all) {
						addedHTML += "background-image: url(\"" + file.ss_urls_tn_all + "\"); height:" + (file.ss_height/2) + "px'>"
					}
					else {
						addedHTML += "'>";
					}

					addedHTML += "<a class='furkButton furkMiniButton furkAddMini' href='javascript:' data-infohash='" + file.info_hash + "'>Add</a>"

					// Furk page Button
					if(file.url_page) {
						addedHTML += "<a class='furkButton furkMiniButton' href='https://www.furk.net" + file.url_page + "'>Furk</a>";
					}

					// Download Button
					if(file.url_dl) {
						addedHTML += "<a class='furkButton furkMiniButton' href='" + file.url_dl + "'>Download</a>";
					}

					// Play Button
					if(file.url_pls) {
						addedHTML += "<a class='furkButton furkMiniButton furkPlayButton' href='" + file.url_pls + "'>Play</a>";
					}

					// File ready
					addedHTML += "<br><br><a class='furkButton furkMiniButton furkNotifButton' href='#'>";
					if (file.is_ready == 1) {
						addedHTML += "File status: <span class='furkReady'>ready</span>";
					}
					else {
						addedHTML += "File status: <span class='furkNotReady'>not ready</span>";
					}

					addedHTML += "</div>";
					addedHTML += "</td></tr>";
					console.log(this);
					$(this).after(addedHTML);
				});

				$(".furkAddMini").click(furkAddMiniClick);
			}
	});
}

if (location.hostname == "kat.cr") {
	furkAnalyseTable();

	if ($("#mainDetailsTable").length) {
		console.log($(this));
		var infoHash = $('#thnxLink').data('hash');
		furkAnalyseFile();
	}
}
else if (location.hostname == "torrentz.eu") {
	var infoHash = $('.trackers > div:nth-child(1)').html().substring(11);
}

/*// Uses regex to test the info hash, if it doesnt match the conditions, the whole script stops
var regTest = /^[0-9a-fA-F]{40}$/;
if (!regTest.test(infoHash)) {
	console.log("Info hash doesnt match conditions");
	return;
} */

// This creates the HTML when needed (When the ajax call works).
function furkInitHTML() {
	console.log("furkInitHTML called");

	$("body").append("<div id='furkButtonBar'><a class='furkButton' id='furkAddBtn'>Add</a><a class='furkButton' href='javascript:' id='furkFurkBtn'>Furk</a><a class='furkButton' href='javascript:' id='furkDwnBtn'>Download</a></div>");
}

// This makes the "Add" button actually do something, called after furkInitHTML on the button
function furkAddClick() {
	console.log("The Furk button was clicked.");

	$("#furkNotification").html("...");

	$.ajax({
		url: "https://www.furk.net/api/dl/add",
		jsonp: "jsonp",
		dataType: "jsonp",
		data: {
			info_hash: infoHash,
		},
		success: function (response) {
			console.log(response.status);
			if (response.status != "ok") {
				$("#furkNotification").html("Error: " + response.error);
				$("#furkNotification").show();
				return;
			}
			var html = "Added | Status: ";
			if(response.dl.dl_status != "failed") {
				html += "<span class='furkReady'>" + response.dl.dl_status + "</span>";
			}
			else {
				html += "<span class='furkNotReady'>" + response.dl.dl_status + "</span>";
			}

			$("#furkNotification").html(html);
			$("#furkNotification").show();
		}
	});
}

// Gets the basic info for the torrent.
function furkAnalyseFile () {
	$.ajax({
		url: "https://www.furk.net/api/file/info",
		jsonp: "jsonp",
		dataType: "jsonp",
		data: {
			info_hash: infoHash,
		},
		success: function (response) {
			console.log(response.status);

			// Simulates loading
			$("#furkNotification").html("...");

			// When response isnt "ok"
			if(response.status != "ok") {
				$("#furkNotification").show();
				if (response.error == "access denied") {
					response.error += " (Please login to Furk.net in another window)"
				}
				$("#furkNotification").html("Error: " + response.error).css("bottom", "0px");
				return;
			}

			furkInitHTML();
			$("#furkAddBtn").click(furkAddClick);

			// No files found "if"
			if(!response.files[0]) {
				console.log("No files found on furk");
				$('#furkDwnBtn, #furkFurkBtn').css({"background-color": "#8fc4f2", "cursor": "not-allowed"}).attr('title', "No files found");
				$("#furkNotification").html("No files found on furk");
				return;
			}
			console.log(response.files[0]);


			// is ready? on furk
			var html = "File status: ";
			if (response.files[0].is_ready == 1) {
				html += "<span class='furkReady'>ready</span>";
			}
			else {
				html += "<span class='furkNotReady'>not ready</span>";
			}
			$("#furkNotification").html(html);
			$("#furkNotification").show();


			// Screenshots
			if (response.files[0].ss_urls_tn_all) {
				console.log("Screenshot url found.");
				$("body").append("<div id='furkScreenshots'></div>");
				$("#furkScreenshots").css({"background-image": "url(" + response.files[0].ss_urls_tn_all + ")", "height": response.files[0].ss_height/2});

				// This div is to make sure you can still access the bottom of the page
				$("body").append("<div style='height:150px;'></div>");
			}

			// Furk page
			if(response.files[0].url_page) {
				$('#furkFurkBtn').attr('href', 'https://www.furk.net' + response.files[0].url_page);
			}

			// Download link
			if(response.files[0].url_dl) {
				console.log("Url_dl found.");
				$('#furkDwnBtn').attr('href', response.files[0].url_dl);
			}

			// Play url
			if (response.files[0].url_pls) {
				console.log("Url_pls found.");
				$('#furkButtonBar').append("<a class='furkButton furkPlayButton' href='" + response.files[0].url_pls + "'>Play</a>");
			}
		}
	});
}
