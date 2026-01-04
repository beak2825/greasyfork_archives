// ==UserScript==
// @name         Twitter Download Button
// @namespace    https://github.com/deegdumdoodilly
// @version      2024-11-19
// @description  Download images from twitter feeds
// @author       Jessica Sherer
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518128/Twitter%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/518128/Twitter%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Checks if all necessary fields for a download button are in the tweetData object
var tweetDataComplete = function(tweetData){
	return tweetData.imageSource && tweetData.author && tweetData.timestamp && !tweetData.video;
}

// Converts a tweetData object to a string
var tweetToString = function(tweetData){
	return "author=" + tweetData.author + ", imageSource=" + !(!tweetData.imageSource) + ", timestamp:" + tweetData.timestamp;
}

var checkForImage = function(el, tweetData){
	// Recursively search through the element to find out if it's a tweet of an image.
	// If it is, then we also retrieve the necessary data to create a download button

	// "data-testid" is the most useful attribute we can check while searching.
	// A value of "tweetPhoto" indicates an image, but it could also be the thumbnail for
	// a video. These are distinguished by having a subelement with
	// data-testid="videoPlayer", so we have to check to verify that those don't exist

	// Return the tweetData object once we've acquired everything we need
	if(el.hasAttribute("data-testid")){
		let attributeValue = el.getAttribute("data-testid");
		if(attributeValue === "tweetPhoto"){
			// Might still contain a video player, so we search deeper
			// The only thing we need from this part of the tweet is the image src. Locate and terminate this branch
			try{
				if(el.children[0].children[0].children[1].children[0].children[0].getAttribute("data-testid") === "videoPlayer"){
					tweetData.video = true;
					return false;
				}
			}catch (error){

			}
			if(el.getElementsByTagName("img").length > 0){
				tweetData.imageSource += el.getElementsByTagName("img")[0].src + " ";
			}
		}else if(attributeValue === "tweetText"){
			// This part of the tweet is not useful to us, terminate this branch
			return true;
		}else if(attributeValue === "videoPlayer" ){
			// If there is an image, it's only a video thumbnail. Bail out.
			tweetData.video = true;
			return false;
		}else if(attributeValue === "User-Name"){
			// Contains both the username and the timestamp. Username is located here
			tweetData.author = el.children[1].children[0].children[0].children[0].children[0].children[0].innerHTML.substring(1);
			//tweetData.timestamp =  el.children[1].children[0].children[2].children[0].children[0].getAttribute("datetime");
		}
	}

	// Check all children as well
	for (let j = 0; j < el.childElementCount; j++){
		// Returns false if we learn this is a video player, in which case abort the search.
		if(!checkForImage(el.children[j], tweetData)){
			tweetData.video = true;
			break;
		}
	}
	// "true" here indicates that we have not found a reason to stop searching
	return true;
}

// Retrieves the author and timesteamp of a given tweet (lowest DOM element that contains both) and puts them in tweetdata
var getAuthorAndTimestamp = function(el, tweetData){
	tweetData.author = el.children[0].children[0].children[0].children[0].innerHTML.substring(1);
	tweetData.timestamp = el.children[2].children[0].children[0].getAttribute("datetime").replace(".000Z","");
}

// Converts a series of URLs into data blobs and downloads them (taken from https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript)
function toDataURL(event) {
	let downloadButton = this;
	let url = null; // Will either be defined by recursion or initial invocation
	let urls = []; // Used if there are multiple images to download
	let extraID = "_"; // Appended between author and timestamp. Set to an index indicator if there are multiple images
	if(!downloadButton.hasAttribute("remainingURLs")){ //  Click was invoked naturally
		// Itemize the images (might be only one)
		urls = downloadButton.getAttribute("sourceURLs").split(" ");
		// If there were multiple, make sure we are naming them correctly
		if(urls.length > 1){
			extraID = "-" + urls.length + "-";
		}
	}else{ // Recursive click
		// Use the images in remainingImages
		urls = downloadButton.getAttribute("remainingURLs").split(" ");
		if(urls[0] == ""){
			// Base case has been reached
			downloadButton.removeAttribute("remainingURLs");
			return;
		}
		// Name this one appropriately even if it's the last one
		extraID = "-" + urls.length + "-";
  	}
	console.log(urls.length);
	url = urls.pop();
	// If any images remain in urls, store them in the button to be handled recursively
	downloadButton.setAttribute("remainingURLs", urls.join(" "));

	// Set up the file read
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		var reader = new FileReader();
		reader.onloadend = function() {
			// This will read the image from the url we provide.
			downloadButton.href = reader.result;
			// Set the filename
			downloadButton.download = downloadButton.getAttribute("author") + extraID + downloadButton.getAttribute("timestamp");
			// Artificially click the button a second time to trigger the real download. This has two effects, one is
			// to trigger the download, the other is to begin the recursive event to see if images remain.
			var clickEvent = new MouseEvent("click", {
				"view": window,
				"bubbles": true,
				"cancelable": false
			});
			downloadButton.dispatchEvent(clickEvent);
		}
		reader.readAsDataURL(xhr.response);
	};
	// Run and send
	xhr.open('GET', url);
	xhr.responseType = 'blob';
	xhr.send();
}

let addButton = function(tweetData, rootTweet){
	// Identify the "name=[size]" portion and replace it
	let sizeParameterIndex = tweetData.imageSource.lastIndexOf("&name=");
	if(sizeParameterIndex > 0){
		tweetData.imageSource = tweetData.imageSource.substring(0,sizeParameterIndex);
	}
	let sourceURL = tweetData.imageSource.substring(0,sizeParameterIndex) + "&name=orig";

	// First check if the button already exists
	if(rootTweet.getElementsByClassName("download-button").length > 0){
		// If so, we instead append the source URL to its current list of sources
		downloadButton = rootTweet.getElementsByClassName("download-button")[0];
		downloadButton.setAttribute("sourceURLs",downloadButton.getAttribute("sourceURLs") + " " + sourceURL);
		return;
	}


	// Create the download button.
	var downloadButton = document.createElement("a");
	downloadButton.id = "download_button";
	downloadButton.classList.add("download-button");

	// Store information in the attributes to be retrieved when the button is pressed
	downloadButton.setAttribute("sourceURLs", sourceURL);
	downloadButton.setAttribute("author", tweetData.author);
	downloadButton.setAttribute("timestamp", tweetData.timestamp.replace(":", "-").replace(".000Z",""));

	downloadButton.innerHTML = "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><g><path style=\"fill: rgb(213, 218, 223);\" d=\"M 11.99 15.975 L 17.5 10.961 L 16 9.461 L 13 12.461 L 13 3 L 11 3 L 11 12.461 L 8 9.461 L 6.5 10.961 L 12 15.961 L 11.99 15.975 Z M 21 15 L 20.98 18.51 C 20.98 19.89 19.86 21 18.48 21 L 5.5 21 C 4.11 21 3 19.88 3 18.5 L 3 15 L 5 15 L 5 18.5 C 5 18.78 5.22 19 5.5 19 L 18.48 19 C 18.76 19 18.98 18.78 18.98 18.5 L 19 15 L 21 15 Z\"/></g></svg>";
	downloadButton.style.cssText = "width: 1.25em; max-width: 100%; psoition: relative; height: 1.25em; display: inline-block; line-height: 27.95px; font-size: 15px; font-weight:400px; margin: 0px 10px;"
	downloadButton.addEventListener("click", toDataURL);

	// Find the share button and put it right next to there
	let buttons = rootTweet.getElementsByTagName("button");

	for (let j = buttons.length - 1; j >= 0; j--){
		if(buttons[j].hasAttribute("aria-label") && buttons[j].getAttribute("aria-label") === "Share post"){
			buttons[j].parentElement.parentElement.parentElement.insertBefore(downloadButton,buttons[j].parentElement.parentElement);
			console.log("Adding button to tweet: " + tweetToString(tweetData));
			return;
		}
	}
}

// One-time function to attach download buttons to all valid, currently loaded tweets
let addInitialDownloadButtons = function(){
	// All tweets are contained in an 'article' tag, so we iterate through those
	let tweets = document.getElementsByTagName("main")[0].getElementsByTagName("article");

	for (let i = 0; i < tweets.length; i++){
		// Object to store what we know about the given tweet
		let tweetData = {
			author: "",
			imageSource: "",
			timestamp: "",
			video: false
		};
		// So much of this is just reliant on twitter using consistent hierarchies in its DOM objects
		let rootTweet = tweets[i].children[0].children[0];
		if(rootTweet.getElementsByClassName("download-button").length > 0){
			// Already has a button
			console.log("Tweet already has button: " + rootTweet.getAttribute("tweetData"));
			continue;
		}

		// Search through the child tree for an image and an author
		checkForImage(rootTweet, tweetData);
		tweetData.imageSource.trimEnd();

		// Search through the child tree for a timestamp
		tweetData.timestamp = rootTweet.getElementsByTagName("time")[0].getAttribute("datetime");

		// If there's enough info for a download button, add it
		if(tweetDataComplete(tweetData)){
			addButton(tweetData, rootTweet);
		}
	}
}

// Callback function whenever a new element gets added to the document.
let addDownloadButtons = function(mutRecords){
	// Object to store what we know about the given tweet
	let tweetData = {
		author: "",
		imageSource: "",
		timestamp: "",
		video: false
	};
	// Go through each record, and within each record, check each added object
	for(let i = 0; i < mutRecords.length; i++){
		for(let j = 0; j < mutRecords[i].addedNodes.length; j++){
			let newNode = mutRecords[i].addedNodes[j];
			// Check to see if it meets all the qualifications (it is an image loaded under a tweetPhoto)
			if(newNode.tagName == "IMG" && newNode.parentElement.hasAttribute("data-testid") && newNode.parentElement.getAttribute("data-testid") == "tweetPhoto"){
				tweetData.imageSource = newNode.getAttribute("src");
				let rootTweet = newNode.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
				// So much of this is just reliant on twitter using consistent hierarchies in its DOM objects
				// In this case we know roughly where to look for the object that contains all the information we need
				if(rootTweet.childElementCount < 4){
					rootTweet = rootTweet.parentElement.parentElement;
					while(rootTweet.childElementCount < 4){
						rootTweet = rootTweet.parentElement;
					}
				}

				// Travel down to the object that holds the author and timestamp, and parse it into tweetData
				let authorAndTime = rootTweet.children[0].children[0].children[0].children[0].children[0].children[1].children[0];
				getAuthorAndTimestamp(authorAndTime, tweetData);

				// Store this in the tweet in case it's ever needed
				rootTweet.setAttribute("tweetData", tweetToString(tweetData));
				// Add the download button
				addButton(tweetData, rootTweet);
			}
		}
	}
}

// Updates whenever new items are added to the feed
const observer = new MutationObserver(addDownloadButtons);
observer.observe(document.getElementsByTagName("main")[0], {childList: true, subtree: true});

addInitialDownloadButtons();
})();