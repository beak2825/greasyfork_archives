// ==UserScript==
// @name         Youtube shorts remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes shorts from your history by simulating clicking the remove buttons
// @author       You
// @match        https://www.youtube.com/playlist*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471153/Youtube%20shorts%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/471153/Youtube%20shorts%20remover.meta.js
// ==/UserScript==

var clickedVids = [];
var scrollLength = 30000;
var vidMaxLength = 62;
(function() {
    'use strict';
    console.log("Active");
    ReadVideoDurations();
    setInterval(function(){ ReadVideoDurations();}, 105);
})();

function ReadVideoDurations(){
    console.log("starting");
    window.scrollBy(0, scrollLength);
    //let videos = document.getElementsByClassName("style-scope ytd-thumbnail-overlay-time-status-renderer");
    let videos = document.getElementsByClassName("style-scope ytd-playlist-video-list-renderer");
    //console.log(videos.length);
    if(videos.length > 0){
        for (let i = 0; i < videos.length; i++) {
            //let times = videos[i].getElementsByClassName("style-scope ytd-thumbnail-overlay-time-status-renderer");
            let times = videos[i].querySelector("#text");
            if(times!=null){
                //console.log(times.className);
                if(times.className == "style-scope ytd-thumbnail-overlay-time-status-renderer"){
                    let totalTime = 0;
                    let label = times.ariaLabel;
                    let amountOfNumbers = label.toString().match(/\d+/g);
                    //console.log(amountOfNumbers);
                    //console.log(label + " " + parseInt(amountOfNumbers[0]));
                    let format = "";
                    if(label.includes("hour")){format+= "1"} else {format+="0"}
                    if(label.includes("minute")){format+= "1"} else {format+="0"}
                    if(label.includes("second")){format+= "1"} else {format+="0"}
                    switch(format) {
                        case "001":
                            totalTime = parseInt(amountOfNumbers[0]);
                            break;
                        case "010":
                            totalTime = parseInt(amountOfNumbers[0])*60;
                            break;
                        case "011":
                            totalTime = (parseInt(amountOfNumbers[0])*60) + parseInt(amountOfNumbers[1]);
                            break;
                        case "100":
                            totalTime = (parseInt(amountOfNumbers[0])*3600);
                            break;
                        case "101":
                            totalTime = (parseInt(amountOfNumbers[0])*3600) + parseInt(amountOfNumbers[1]);
                            break;
                        case "110":
                            totalTime = (parseInt(amountOfNumbers[0])*3600) + (parseInt(amountOfNumbers[1])*60);
                            break;
                        case "111":
                            totalTime = (parseInt(amountOfNumbers[0])*3600) + (parseInt(amountOfNumbers[1])*60)+ parseInt(amountOfNumbers[2]);
                            break;
                        default:
                            console.log("ruh-roh!");
                    }

                    if(amountOfNumbers.length == 0){console.log("number count error! no numbers!");}
                    if(amountOfNumbers.length >= 4){console.log("number count error! too many numbers!");}
                    //console.log("total time: "+ totalTime);

                    if(totalTime <= vidMaxLength){
                        let dottedButton = videos[i].querySelector("#button");
                        //console.log(dottedButton);
                        if(dottedButton.className == "dropdown-trigger style-scope ytd-menu-renderer"){
                            if(clickedVids.includes(dottedButton) == false){
                                dottedButton.click();
                                console.log("clicked");
                                setTimeout(function(){ clickRemoveButton(); }, 500);
                                clickedVids.push(dottedButton);
                                return;
                            }

                        }
                    }
                }
            }
        }
    }
}

function clickRemoveButton(){
    console.log("triggered");
    window.scrollBy(0, scrollLength);
    var aTags = document.getElementsByClassName("style-scope ytd-menu-service-item-renderer");
    if(aTags.length == 0){
        setTimeout(function(){ clickRemoveButton(); }, 40);
        return false;}
    //console.log("starting");
    /*
                            while(aTags.length == 0){
                                aTags = document.getElementsByClassName("style-scope ytd-menu-service-item-renderer");

                            }*/
    //console.log(aTags.length);
    var searchText = "Remove from Liked videos";
    var found;

    for (var j = 0; j < aTags.length; j++) {
        //console.log(aTags[j].textContent);
        if (aTags[j].textContent == searchText) {
            found = aTags[j];
            break;
        }
    }
   // console.log(found);
    found.click();
    return true;

}
