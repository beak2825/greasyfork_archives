// ==UserScript==
// @name         BunnyDownload
// @namespace    http://userscripts.org
// @version      1.9
// @description  Saves images from bunnyfap as you like or favorite them
// @author       Quirkyjoe
// @match        https://bunnyfap.com/*
// @grant        GM_download
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/440277/BunnyDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/440277/BunnyDownload.meta.js
// ==/UserScript==

// User-configurable varibales
let downloadSubDir = "BD"; // Directory to save in (within Downloads)
let useTitleOrFilename = "Title"; // "Title" OR "Filename" -Should downloaded files be named by BF title, or by original filename?
let addTags = false; // false OR true -Should we add tags into the filename? (Not implemented: Add tags one at a time until the full path becomes near max length for windows.)

// Initializing other variables
let mediaURL = "";
let fileName = "";
let mediaTitle = "";
let finalTitle = "";
let extension = "";
let tagString = "";
var result;
var urlAndfileName;
var mediaLocations;
var tagElements;
let tagList = [];

// This switch case defines what functions each keypress performs
// Adapted from: https://tinyurl.com/2nentwp6
// Javascript keycodes found here: http://javascriptkeycode.com/
function doc_keyUp(e) {
  switch(e.keyCode)
  {
  case 87: //W (user clicked Like)
    getMedia("Like")
    break;
  case 38: //↑ (user clicked Like)
    getMedia("Like");
    break;
  case 70: //F (user clicked Fave)
    getMedia("Favorite");
    break;
  case 13: //ENTER (user clicked Fave)
    getMedia("Favorite");
    break;
  default:
    break;
  }
}
document.addEventListener('keyup', doc_keyUp, false);

function getMedia(clickType) {
  // Get the current mediaURL and filename
  urlAndfileName = getURL();
  tagList = getTags();
  mediaTitle = getTitle();
  // Download the media, saving to downloadSubDir
  saveMedia(clickType,urlAndfileName[0],urlAndfileName[1],downloadSubDir,tagList,mediaTitle,useTitleOrFilename);
}

// Compose the args to download the image, then do so
function saveMedia(clickType,mediaURL,fileName,downloadSubDir,tagList,mediaTitle,useTitleOrFilename) {
  // Split out file extension
  extension = fileName.split('.').pop();
  fileName = fileName.substring(0,fileName.length - (extension.length + 1)); // +1 is for the period

  // Choose what to use as finalTitle
  if (useTitleOrFilename == "Title") {
    finalTitle = mediaTitle;
  } else if (useTitleOrFilename == "Filename") {
    finalTitle = fileName;
  }

  // Add tags if the user requested it
  if (addTags == true) {
    tagString = ""
    // Begin tag list with bracket
    tagString = tagString + " ["
    // Loop through tagList and add each tag with a trailing comma
    tagList.forEach(tag => {
      // Only add tag if we are not close to Windows' max path length (260)
      // The length of existing parts are summed, and a ballpark of 24 additional characters are added for "C:\Users\USERX\Downloads"
      // There are twenty characters of further buffer to cover longer usernames and math errors
      if (downloadSubDir.length + finalTitle.length + tagString.length + extension.length + 27 < 240) {
        tagString = tagString + tag + ","
      }
    });
    // Add end bracket and blast off the extra trailing comma, if present
    tagString = tagString + "]";
    finalTitle = finalTitle + " " + tagString.replace(",]","]").replace(/ /g,""); // (I am a schmuck and don't know how to do this more elegantly.)
  }

  console.log("BunnyDownload: Started download of " + downloadSubDir + "/" + clickType + "/" + finalTitle + "." + extension)
  // Build args out of the info we've been provided
  var arg = { url: mediaURL,
    // Default dir is Downloads, this will append the downloadSubDir, the Like/Fave subdir, and the media fileName
    // Also set triggers for download error handling (see onDLcomplete and onDLerror functions)
    name: downloadSubDir + "/" + clickType + "/" + finalTitle + "." + extension,
    saveAs: false,
    onload: function() { onDLcomplete(downloadSubDir + "/" + clickType + "/" + finalTitle + "." + extension) },
    onerror: function(response) { onDLerror(downloadSubDir + "/" + clickType + "/" + finalTitle + "." + extension,response) }
  };
  // Download the media
  GM_download(arg);
}

// This function is called on successful download completion
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onload
function onDLcomplete(fullPath) {
  console.log("BunnyDownload: Successfully completed download of " + fullPath);
}
// This function is called if a download fails
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onerror
function onDLerror(fullPath,response) {
  console.error("BunnyDownload: FAILED to complete download of: " + fullPath + "\nBunnyDownload: GM_Download reported: " + response.error);
}

// Fetch the media title
function getTitle() {
  mediaTitle = document.getElementsByClassName('title font-weight-thin ml-5')[0].textContent;
  // GM_download sanitizes file names, but treats slashes as directory delimiters, so we will remove them from the title here
  mediaTitle = mediaTitle.replace(/\//g, '-');
  mediaTitle = mediaTitle.replace(/\\/g, '-');
  return mediaTitle
}

// Fetch the tags
function getTags() {
  tagList = []
  // Start by grabbing all the elements that are tags
  tagElements = document.getElementsByClassName('tag_link');
  // Iterate through tag elements, pulling the text content out of each and appending it to the tagList array
  tagElements.forEach(tagElement => {
      if (tagElement.style.display != "none") {
        tagList.push(tagElement.textContent)
      }
  });
  return tagList
}

// This function finds the image or video URL in the page
// Thanks to the guys in chat for helping me overcome BF's obfuscation
function getURL() {
  // Start by collecting all possible media instances
  // (This will include a bunch of media BF has pre-loaded, but not made visible)
  mediaLocations = document.getElementsByClassName('v-window-item child');
  // Look at the location for each media item in turn
  mediaLocations.forEach(location => {
    // Ignore media that is not visible (the pre-loaded content)
    if (location.style.display != "none") {
      let imageObj = location.getElementsByClassName('v-image');
      let videoObj = location.getElementsByTagName('video');
      // Save the image URL if a visible one exists
      try {
        // Try to fetch the id from the imageObj
        mediaURL = imageObj[1].id
      } catch (error) {
        try {
          // If we failed to get the id from the imageObj, it's likely a video, fetch it
          mediaURL = videoObj[0].id
        } catch {
          // If we failed to get either an image or video id, default to empty
          mediaURL = ""
        }
      }
    }
  });
  // Alert the user if we failed to find any media
  if (mediaURL == "") {
    alert("Media not found!")
  }
  // Break the mediaURL up to get the portion that constitutes the filename (contains filetype suffix)
  fileName = mediaURL.split('/').pop();
  return [mediaURL, fileName];
}