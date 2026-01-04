// ==UserScript==
// @name         Fiction.Live Tag Blacklist
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Hides stories with tags in the blacklist
// @author       You
// @match        http*://fiction.live/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/395947/FictionLive%20Tag%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/395947/FictionLive%20Tag%20Blacklist.meta.js
// ==/UserScript==


function myCode()
 {
    'use strict';
    //Blacklisted tag list
    var Blacklist = ["ADD","TAGS","LIKE","THIS"
                    ]
    //Delays the code by one second
    setTimeout(function(){

    var delayInMilliseconds = 0;
    var html = document.querySelector("html")

    var storiesAll=document.querySelectorAll('[class="column information"]'), storyCount=0, currentStory;
    var count = 0
    while (currentStory = storiesAll[storyCount++])
    {
        count++
        console.log(count)
        var tags = currentStory.querySelector('[class="tags"]');

        Blacklist.forEach(hideBlacklist);
    }

    function hideBlacklist(value) {
        //console.log(`"WHATS GOING ON ${value}"`);
        //Sets the var to current tag
        var tagCheck = currentStory.querySelector(`[href="/${value}"]`);
        //console.log(tags)
        //If the tag was applied
        if (tagCheck){
            console.log("yes",currentStory)
            //Hides any list items that have a blacklisted tag
            currentStory.parentNode.parentNode.parentNode.style.display = "none";
            }
        }

    //console.log("Should be 10")
    }, 1000);

    //console.log('Tags Blacklist Done')
};

var loadDelay = 5000; //5 seconds
var reloadDelay = 50000; //50 seconds
var count=0;
setTimeout(myCode, loadDelay);
while (count < 10){
    setInterval(myCode, reloadDelay);
    count=count+1;
}