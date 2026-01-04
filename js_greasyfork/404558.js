// ==UserScript==
// @name         Deviantart better downloaded file names (public version)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Deviantart
// @author       TeshRoa
// @include http://deviantart.com/*
// @include https://deviantart.com/*
// @include http://*.deviantart.com/*
// @include https://*.deviantart.com/*
// @match http://deviantart.com/*
// @match https://deviantart.com/*
// @match http://*.deviantart.com/*
// @match https://*.deviantart.com/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/404558/Deviantart%20better%20downloaded%20file%20names%20%28public%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/404558/Deviantart%20better%20downloaded%20file%20names%20%28public%20version%29.meta.js
// ==/UserScript==

(function() {
    console.log("V1.6");
    var basepath = "" //OPTIONAL base file path for INSIDE THE DOWNLOADS FOLDER!!!!! does not work outside the downloads folder of the browser; for ex "lorem/ipsum/" refers to the folder [browser-download-folder]/lorem/ipsum/
    //var basepath ="Lorem/Ipsum/"
    var path = ""; //blank variable, do not change at this line!

window.addEventListener ("keydown", keyboardHandler, false); //for detecting pressed keys

    function keyboardHandler (zEvent) {
        var bBlockDefaultAction = false;
        if (zEvent.key == "F2") { //pressed key(s)
            bBlockDefaultAction = true; //suppress normal function of pressed key
            console.log("F2 was pressed"); //log key press for debugging
            path = basepath + ""; //OPTIONAL further specification of file path
            saveimage(); //function for saving the img
        }
        else if (zEvent.ctrlKey & zEvent.key == "s") { //same function as previous code block but for other keys
            bBlockDefaultAction = true;
            console.log("ctrl+s was pressed");
            path = basepath + "";
            saveimage();
        }
        if (bBlockDefaultAction) {
            zEvent.preventDefault ();
            zEvent.stopPropagation ();
        }
    }
function saveimage() {
      //retrieve the url
    var artstage = document.querySelectorAll("div[typeof=ImageObject]"); //select correct div based on imageObject attribute
    var url = artstage[0].querySelector("img[src]").getAttribute("src"); //select img element in the found div
    var figure = document.querySelector("figure"); //check if image list post.
    if(!figure) {
        //if not image list do nothing
    }else {
        //if imagelist replace URL by correct one.
        console.log("image list detected")
         url = figure.querySelector("img[src]").getAttribute("src");
    }
    console.log("the url has been retrieved");
    console.log(url);
    //retrieve the desc
    var desc = document.querySelector("h1").textContent; // get description via the h1 element
    var patt1 = /[:|<>?\/*~]/g;
    desc = desc.replace(patt1,"_");//replace illegal file characters
    for (var j = 0; j < desc.length; j++) {
        if (desc[0] == " "){
            desc = desc.substring(1);
            //console.log(desc);
        }
    }
    console.log("the description has been retrieved");
    console.log(desc);

    //retrieve the artist
    var users = document.querySelectorAll("a.user-link"); //all users linked on the page
    var currentUrl = window.location.pathname.split('/'); //get artist name in lowercase based on url path
    var artist = currentUrl[1];
    var artistlowercase = "dummy"; //initiate variable
    for (var i = 0; i < users.length; i++) {
        artistlowercase = users[i].getAttribute("data-username").toLowerCase(); //compare lowercase usernames
        if (artist == artistlowercase) {
            artist = users[i].getAttribute("data-username"); //if equal get username with lower & uppercase letters
        }
    }
    console.log("the artist has been retrieved");
    console.log(artist);
    //saveAs dialog window details
    var arg = {
        url: url,
        name:  path + desc + " By " + artist + ".jpg", //correct file extension is automatically chosen by the saveas dialog for some reason when we specify a single extension
        saveAs: true,
        onerror: function(download) {
					//console.log(name + " > GM_download > onerror.error:", download.error);
					//console.log(name + " > GM_download > onerror.details:", download.details);
					//console.log(name + " > GM_download > onerror.details.current:", download.details);
				},
    };
    var result= GM_download(arg);
    path = ""; //reset path
}
})();