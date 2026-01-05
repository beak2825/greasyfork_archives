// ==UserScript==
// @name        Redacted.CH :: Artist Focus & HTML5 Upload Form Validation
// @description	Type directly the artist you are looking for without clicking on "artist" field in the header
// @include	    http*://*redacted.ch/*
// @version	    1.6
// @icon        https://redacted.ch/favicon.ico
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant       GM_getValue
// @namespace https://greasyfork.org/users/2290
// @downloadURL https://update.greasyfork.org/scripts/25712/RedactedCH%20%3A%3A%20Artist%20Focus%20%20HTML5%20Upload%20Form%20Validation.user.js
// @updateURL https://update.greasyfork.org/scripts/25712/RedactedCH%20%3A%3A%20Artist%20Focus%20%20HTML5%20Upload%20Form%20Validation.meta.js
// ==/UserScript==


// Get Document URL
var url = document.URL;
    
// Get the PHP page
var elem = url.split('/');
var page = elem[3];

var page_detect = false;

var pageid = page.split("?")[0];
var page = pageid;

// Upload Page
if(page == "upload.php"){
    page_detect = true;
    $("#artist").focus();
    
    // Add HTML5 Form validation
    $('#file').prop('required',true);
    $('#artist').prop('required',true);
    $('#title').prop('required',true);
    $('#year').prop('required',true);
    $('#releasetype').prop('required',true);
    $("#releasetype").val('0');
    $('#format').prop('required',true);
    $('#bitrate').prop('required',true);
    $('#media').prop('required',true);
    $('#tags').prop('required',true);
    $('#album_desc').prop('required',true);
}

// Top 10 Page
if(page == "top10.php"){
    page_detect = true;
    if(url.indexOf("#") != -1){
    
    }
    // No achor, we focus the artist field
else {
    $("#tags").focus();
}
}

// Torrents Page
if(page == "torrents.php"){
    page_detect = true;
    if(url.indexOf("#") != -1){
    
    }
    // No achor, we focus the artist field
else {
    $("#torrentssearch").focus();
}
}

// Requests Page
if(page == "requests.php"){
    page_detect = true;
    if(url.indexOf("#") != -1){
    
    }
    // No achor, we focus the artist field
else {
    $("#requestssearch").focus();
}
}

// Forums Page
if(page == "forums.php" || page == "userhistory.php"){
    page_detect = true;
    if(url.indexOf("#") != -1){
    
    }
    // No achor, we focus the artist field
else {
    $("#forumssearch").focus();
}
}

if(page == "log.php"){
    page_detect = true;
    if(url.indexOf("#") != -1){
    
    }
    // No achor, we focus the artist field
else {
    $("#logsearch").focus();
}
}

// Friends Page
if(page == "friends.php"){
    page_detect = true;
    if(url.indexOf("#") != -1){
    
    }
    // No achor, we focus the artist field
else {
    $("#userssearch").focus();
}
}

// Logchecker Page
if(page == "logchecker.php"){
    page_detect = true;
    if(url.indexOf("#") != -1){
    
    }
    // No achor, we focus the artist field
else {
    $("#log_contents").focus();
}
}

// Focus to the artist search field (by default)
if(page_detect == false){
    if(url.indexOf("#") != -1){
    
    }
    // No achor, we focus the artist field
else {
    $("#artistsearch").focus();
    
}
    
}