// ==UserScript==
// @name            Xhamster - No related Video links (Remove their "#mlrelated" part in address bar) v.0.36
// @version 0.36
// @description	    Remove "#mlrelated" part in address bar (when you open a related video from the Video page)
//
// @namespace https://greasyfork.org/users/7434
// @author janvier57

// @include https://*xhamster.com/movies/*
// @include https://xhamster.com/videos/*

// @include      https://*.xhamster.com/movies/*
// @include      https://*.xhamster.com/videos/*

// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @autor Phlegomatic  / janvier56
// FROM:  https://greasyfork.org/forum/discussion/comment/54300/#Comment_54300
// @grant none
// @run-at document-start

// @downloadURL https://update.greasyfork.org/scripts/30343/Xhamster%20-%20No%20related%20Video%20links%20%28Remove%20their%20%22mlrelated%22%20part%20in%20address%20bar%29%20v036.user.js
// @updateURL https://update.greasyfork.org/scripts/30343/Xhamster%20-%20No%20related%20Video%20links%20%28Remove%20their%20%22mlrelated%22%20part%20in%20address%20bar%29%20v036.meta.js
// ==/UserScript==

var Check = "#mlrelated"; // what you removed
var currentLocation = window.location.href; // get current URL

if(currentLocation.includes(Check)){ // check if contains
var URL = currentLocation.replace(Check, ""); // replace
window.location = URL; // goto adjusted URL
}