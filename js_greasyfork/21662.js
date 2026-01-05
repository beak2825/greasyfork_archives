// ==UserScript==
// @name         Industrial Grade Cat Remover
// @version      0.2.10
// @description  Hide cat posts from SA's Star Citizen thread
// @match        *://forums.somethingawful.com/*
// @grant        none
// @namespace    http://github.com/Chunjee
// @author       Chunjee
// @downloadURL https://update.greasyfork.org/scripts/21662/Industrial%20Grade%20Cat%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/21662/Industrial%20Grade%20Cat%20Remover.meta.js
// ==/UserScript==

//change this to true if you want cat posts hidden in all threads, not just Star Citizen ones
var HideCatsAllSA = false;

$(document).ready((function() {
    'use strict';
    //Check the forum title
    var SubForum = $(".up:contains('Citizen')");
    var ThreadTitle = $(".bclast:contains('Citizen')");

    //If this is a Star Citizen thread OR HideCatsAllSA is set to true
    if (SubForum.length > 0 || ThreadTitle.length > 0 || HideCatsAllSA) {
        //build an array of words we do not want displayed
        var blacklist_array = ['cat','cattax','cat tax','catte','edit: tax','e: tax','e:tax','taxxe','cutte','catgifpage','dogge','puppy','pupper','bunbun','bunnie','paid tax'];
        //append any one-offs to the array
        blacklist_array.push('cattepic');
        //each blacklist item
        for (var i = blacklist_array.length - 1; i >= 0; i--) {
            var iterate = blacklist_array[i];
            var regex = new RegExp("(" + iterate + "[\\W])|(" + iterate + "[s ]+)", "gi");
            //hide any post that matches the blacklisted item regex
            $(".postbody").each( function() {
                //console.log(this.innerHTML);
                var ignore_bool = regex.test(this.innerHTML);
                if (ignore_bool === true) {
                    $(this).closest('table').hide();
                }
            });
        }
        //unhide any post that may have been caught in the crossfire; gfycat.com images could have a funny gif of commando t-posing
        $(".postbody:contains('gfycat')").closest('table').show(); //catastrophic
        //log after completed
        console.log( GM_info.script.name + " - v" + GM_info.script.version + ": Finished hiding cat posts");
    } else {
        //Do nothing
    }
}));