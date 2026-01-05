// ==UserScript==
// @name         MyHentaiComics Downloader
// @namespace    ElectricHum/H/
// @version      0.2.1
// @description  Downloads all the pages of a specific comic
// @author       ElectricHum
// @match        http://myhentaicomics.com/index.php/*
// @exclude      http://myhentaicomics.com/index.php/*/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.0.min.js
// @compatible   chrome Must allow multiple downloads
// @downloadURL https://update.greasyfork.org/scripts/17274/MyHentaiComics%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/17274/MyHentaiComics%20Downloader.meta.js
// ==/UserScript==

/*
Changelog:
    0.2:
        + Delay (adjustable) after each download
        + Stop button
        ~ Visual: Added a slight tint background tint
        ~ Button now toggles debugging as previously only enabled it
        ~ Technical: replaced all 'this' with 'myDL'
    0.1:
        ! First working version
        + Changelog
        + Download button
        + Debugging mode & button
*/

/* Allows for functions created here to still be used after script finishes  e.g. when button is pressed */
var myDL = window.myDL = {};

/* When debug is set to one, more useful text -for debugging- will appear */
myDL.debug = 0;

/* The page which is currently being downloaded */
myDL.curDL = 0;

myDL.getPagesNumber = function()
{
    // Returns the amount of pages the comic has
    var pgNumber = parseInt($("#g-content .g-info").text().split(" of ")[1]);
    if (myDL.debug)
        console.log("[DEBUG]> Pages=" + pgNumber);
    return pgNumber;
};

myDL.getFirst = function()
{
    // Returns the starting page
    var thumbnailsrc = $(".g-thumbnail:first").attr("src").split("/");
    thumbnailsrc = thumbnailsrc[thumbnailsrc.length - 1];
    thumbnailsrc = thumbnailsrc.split("/")[0].split(".");
    var start = parseInt(thumbnailsrc[0]);
    if (myDL.debug)
        console.log("[DEBUG]> Start = " + start);
    return start;
};

myDL.getFormat = function()
{
    // Returns the extension of the pictures
    var thumbnailsrc = $(".g-thumbnail:first").attr("src").split("/");
    thumbnailsrc = thumbnailsrc[thumbnailsrc.length - 1];
    thumbnailsrc = thumbnailsrc.split("/");
    var format = thumbnailsrc[thumbnailsrc.length -1].split(".")[1];
    if (myDL.debug)
        console.log("[DEBUG]> Extension="+format);
    return format;
};

myDL.getTitle = function()
{
    // Returns the Title of the comic
    var title = $("#g-header .g-active").text().trim();
    if (myDL.debug)
        console.log("[DEBUG]> Title="+title);
    return title;
};

myDL.downloadImg = function(url)
{
    // Downloads image from url
    if (myDL.debug)
        console.log("Downloaded: " + url);
    $("body").append('<a class="myDL_tmp" style="display:none;" download href="' + url + '">Temp</a>');
    var anchor = document.getElementsByClassName("myDL_tmp")[0];
    anchor.click();
    anchor.remove();
};

myDL.DownloadAllImgs = function()
{
    // Gets delay from input, if invalid defaults to 1
    myDL.delay = parseFloat($("#myDL_box input").val());
    if(isNaN(myDL.delay))
        myDL.delay = 1;
    if(myDL.debug)
        console.log("[DEBUG]> Delay=" + myDL.delay);
    myDL.first = myDL.getFirst();
    myDL.last = myDL.getPagesNumber();
    /* The domain name + the title of the comic */
    myDL.baseUrl = "http://myhentaicomics.com/var/resizes/" + encodeURIComponent(myDL.getTitle()) + "/";
    myDL.stopDownloading();
    myDL.Interval = setInterval(myDL.getImage, myDL.delay * 1000);
};

myDL.getImage = function()
{
    // Check if should download 
    if (myDL.curDL >= myDL.last)
    {
        myDL.stopDownloading();
        console.log("Finished Downloading");
    }
    else
    {
        var fileNumber = myDL.curDL + myDL.first;
        if (myDL.debug)
            console.log("Downloading "+ String(fileNumber));
        // Adds the starting 0's the site uses as a file structure before the number and extension
        var dlUrl = myDL.baseUrl;
        if(fileNumber < 10)
            dlUrl += "00";
        else if(fileNumber < 100)
            dlUrl += "0";
        dlUrl += String(fileNumber) + "." + myDL.getFormat();
        myDL.downloadImg(dlUrl);
        myDL.curDL++;
    }
};

myDL.stopDownloading = function()
{
    // Stops current (if any) downloading
    if(typeof myDL.Interval == "undefined")
    {
        if(myDL.debug)
            console.log("Not currently downloading");
    }
    else
    {
        // Stops the Timer
        window.clearInterval(myDL.Interval);
        if(myDL.debug)
            console.log("Stopped downloading");
    }
    //Resets counter
    myDL.curDL = 0;
};

myDL.toggleDebug = function()
{
    // Enabled console messages which MAY or may not help with debugging
    myDL.debug = !myDL.debug;
    if(myDL.debug)
        console.log("[DEBUG]> Enabled");
    else
        console.log("[DEBUG]> Disabled");
};

myDL.init = function()
{
    // Creates container for buttons
    $("#g-header").after('<div id="myDL_box" style="background-color:rgba(32,29,49,0.3);"></div>');
    // Creates a button to initialise the downloading
    $("#myDL_box").append('<button onclick="myDL.DownloadAllImgs()">Download all</button>');
    // Creates a button to stop downloading
    $("#myDL_box").append('<button style="margin:10px" onclick="myDL.stopDownloading()">Stop</button>');
    // Drop down menu to select delay after each download
    $("#myDL_box").append('Delay (seconds):<input style="display:inline;width:30px" type="text" value="1">');
    // Button that toggles debugging
    $("#myDL_box").append('<span style="color:white;padding:1px;float:right;background-color:#878787" onclick="myDL.toggleDebug()">Toggle Debug</span><br>');
};

$("document").ready(function () {
    // When the page loads, the magic happens
    myDL.init();
});