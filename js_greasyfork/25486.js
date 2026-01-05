// ==UserScript==
// @name         Regular Strength Cat Remover
// @version      0.0.1
// @description  Hide cat pictures and pet talk from SA's Star Citizen thread
// @match        *://forums.somethingawful.com/*
// @grant        none
// @namespace    http://github.com/Chunjee
// @author       Chunjee
// @downloadURL https://update.greasyfork.org/scripts/25486/Regular%20Strength%20Cat%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/25486/Regular%20Strength%20Cat%20Remover.meta.js
// ==/UserScript==

//Setup
//change this to true if you want cat posts hidden in all threads, not just Star Citizen ones
var hideCatsAllSA = false;
var hideSensitivity = 1; //1 hide images if suspicison of cat picture is detected
var hideCompletelySensitivity = 4; //hide entire post if this threshold is met
var debugToggle = true;

//build an array of words that are suspicious
var blacklist_array = ['cat','cattax','cat tax','catte','tax','edit: tax','e: tax','e:tax','taxxe','cutte','catgif','dog','dogge','puppy','pupper','bunny','bunbun','bunnie','paid tax','kayak'];
//append any one-offs to the array
blacklist_array.push('cattepic');

//MAIN
$(document).ready((function() {
    'use strict';
    //Check the forum title
    var SubForum = $(".up:contains('Citizen')");
    var ThreadTitle = $(".bclast:contains('Citizen')");

    //If this is a Star Citizen thread OR HideCatsAllSA is set to true
    if (SubForum.length > 0 || ThreadTitle.length > 0 || hideCatsAllSA) {
        //Go through each post
        $(".postbody").each( function () {
            //grab the quoted poster's name
            //var poster = /([ \.a-z0-9]+)\sposted:/gi.exec(this.innerHTML);
            //does the post contain an image?
            if(fn_InStr(this.innerHTML,"<img")||fn_InStr(this.innerHTML,"<timg")) {
                //compare this post to our list of suspicious words
                var suspicionCount = 0;
                for (var i = blacklist_array.length - 1; i >= 0; i--) {
                    var iterate = blacklist_array[i];
                    var regex = new RegExp("(" + iterate + "[\\W])|(" + iterate + "[s ]+)", "gi");
                    var ignore_bool = regex.test(this.innerHTML);
                        if (ignore_bool === true) {
                            suspicionCount++;
                        }
                }
                //Hide all pictures in this post if suspicion is too high
                var thispost_nonsmilieimages = false;
                if(suspicionCount >= hideSensitivity) {
                    //hide pictures that aren't SA smilies
                    $("img", this).each( function () {
                        if (!fn_InStr(this.outerHTML,"somethingawful")) {
                            thispost_nonsmilieimages = true;
                            $(this).addClass("suspectPic").hide();
                        }
                    });
                    if (thispost_nonsmilieimages) {
                        //Add text and toggle to the post
                        $(this).append('<br><div style="display:flex; align-items: center;"><span style="color:gray" class="toggletext">Contains Suspected Cat Picture (Click to show) &nbsp;</span></div> ');
                        $(this).on("click",Sb_HideToggle);
                    }
                }
                //Hide the entire post if hideCompletelySensitivity is exceeded
                if(suspicionCount >= hideCompletelySensitivity) {
                    $(this).text('(POST WAS HIDDEN FOR TOO MUCH PET TALK)').css("color", "gray").css("font-weight", "bolder");
                }
            }
        });
        //log after completed
        console.log( GM_info.script.name + " - v" + GM_info.script.version + ": Finished hiding cat images");
    } else {
        //Do nothing
    }
}));


////Functions
function fn_InStr(para_String, para_needle) {
	var Output = para_String.indexOf(para_needle);
	if (Output === -1) {
		return false;
	} else {
		return true;
	}
}

function Sb_HideToggle() {
    $(".suspectPic",this).toggle("slow").next().toggle("slow");
}