// ==UserScript==
// @name        Derpibooru - Download All
// @namespace   Selbi
// @include     http*://*derpibooru.org/*
// @version     2.0.1
// @description Adds a download button that lets you download all images from the current search query
// @downloadURL https://update.greasyfork.org/scripts/1837/Derpibooru%20-%20Download%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/1837/Derpibooru%20-%20Download%20All.meta.js
// ==/UserScript==

const states = {
  ready: 0,
  fetching: 1,
  readyForDownload: 2,
  downloading: 3
};
var state = states.ready;

var imageLinks = [];

let randomImageButton = document.querySelector("section.block__header > div:last-child > a:first-child");
let downloadButton = randomImageButton.cloneNode(true);

let dlButtonText = downloadButton.querySelector("span");
let dlButtonClasses = downloadButton.querySelector("i");
downloadButton.onclick = function() {
  if (state === states.ready) {
    let params = new URLSearchParams(window.location.search);
    let page = params.get("page");
    if (page != null && parseInt(page) > 1) {
      alert("Warning: You are not on page 1 of the gallery! Only images starting at this page will be downloaded.")
    }
    
    state = states.fetching;
    dlButtonClasses.classList = "fa fa-spinner fa-spin fa-pulse";
    
    fetchLinksForPage(document);
    
    state = states.readyForDownload;
    dlButtonClasses.classList = "fa fa-check";
    dlButtonText.innerHTML = "Download Ready! (" + imageLinks.length + ")";
  } else if (state === states.fetching) {
    alert("Please wait until all links have been fetched!");
  } else if (state === states.readyForDownload) {
    downloadImages(imageLinks);
  } else if (state === downloading) {
    alert("Download is currently in progress, please wait for its completion!") 
  }
};

downloadButton.href = "#";
downloadButton.title = "Download All Images";
dlButtonClasses.classList = "fa fa-download";
dlButtonText.innerHTML = "Download All";

randomImageButton.before(downloadButton);

var parser = new DOMParser();

function fetchLinksForPage(page) {
  
  // Get images of current page
  let images = page.querySelectorAll(".image-container");
  for (img of images) {    
    let dataUris = img.getAttribute("data-uris");
    let full = JSON.parse(dataUris)["full"];
    let download = full.replace("/view/", "/download/"); // god I hope this never breaks
    imageLinks.push(download);
    dlButtonText.innerHTML = "Fetching Links... (" + imageLinks.length + ")";
  }
  
  // Go to next page, if there is any
  let nextButton = page.querySelector(".js-next");
  if (nextButton != null) {
    let nextPageHref = nextButton.href;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", nextPageHref, false);
    xhr.send();
    let responseText = xhr.responseText;
    let responseDom = parser.parseFromString(responseText, 'text/html');
    
    fetchLinksForPage(responseDom);
  }
}

function downloadImages(links) {
  for (link of links) {
	  window.open(link, '_blank');
  }
  state = states.readyForDownload;
}
