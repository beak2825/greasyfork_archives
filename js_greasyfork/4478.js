// ==UserScript==
// @name Download Blu-ray.com Front Covers
// @namespace https://openuserjs.org/users/Morath86
// @description Adds a link below the small movie cover for the full size image
// @version 1.0
// @date 2014-05-13
// @author Morath86
// @include http://www.blu-ray.com/movies/*
// @history 1.0 Initial Release
// @downloadURL https://update.greasyfork.org/scripts/4478/Download%20Blu-raycom%20Front%20Covers.user.js
// @updateURL https://update.greasyfork.org/scripts/4478/Download%20Blu-raycom%20Front%20Covers.meta.js
// ==/UserScript==

// Gets the current movie ID from the URL
var movieID = document.URL.split('/')[5];

// Create a new Link element [downloadLink] and then get the element ID for the Front Cover
var downloadLink = document.createElement("a");
var frontLink = document.getElementById("largefrontimage_overlay");

// Set the new [downloadLink] ID, Style, HREF & Target attributes
downloadLink.setAttribute("id", "fullsize");
downloadLink.setAttribute("style", "padding-right: 5px");
downloadLink.href = "http://images2.static-bluray.com/movies/covers/" + movieID + "_front.jpg";
downloadLink.target = "_blank";

// Populate the [downloadLink] and insert it before the Front Cover link.
downloadLink.innerHTML = "Download";
frontLink.parentNode.insertBefore(downloadLink, frontLink);