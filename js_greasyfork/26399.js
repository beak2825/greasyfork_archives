// ==UserScript==
// @name       sgmod - rate all on page
// @namespace  https://www.youtube.com/user/Skyrossm
// @version    1.0
// @description  press link on top right to rate all :)
// @match      http://www.seriousgmod.com/*
// @copyright  2013+, stackoverflow
// @downloadURL https://update.greasyfork.org/scripts/26399/sgmod%20-%20rate%20all%20on%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/26399/sgmod%20-%20rate%20all%20on%20page.meta.js
// ==/UserScript==

var pages = 0;
$(document).ready(function() {
     $('li[data-author="Sir Lemoncakes"]').find('a[href*="rate?rating=13"]').click();
     $('div[class="linkGroup SelectionCountContainer"]').append('<a><select id="selectedrating" style="padding-left: 5px;"><option value="">Choose...</option><option value="like">Like</option><option value="dislike">Dislike</option><option value="agree">Agree</option><option value="disagree">Disagree</option><option value="funny">Funny</option><option value="winner">Winner</option><option value="informative">Informative</option><option value="friendly">Friendly</option><option value="useful">Useful</option><option value="optimistic">Optimistic</option><option value="creative">Creative</option><option value="old">Old</option><option value="badspelling">Bad Spelling</option><option value="dumb">Dumb</option></select></a>');
     $('div[class="linkGroup SelectionCountContainer"]').append('<a href="' + window.location.pathname + '#" class="OverlayTrigger" id="applyrating">Apply</a>');
     $('#applyrating').click(function(){
        $('a[href*="rate?rating=del"]').click(); //unrate all posts
        if($('#selectedrating').val() == "like") {
            $('a[href*="rate?rating=1&"]').click();
        }
        if($('#selectedrating').val() == "dislike") {
            $('a[href*="rate?rating=14"]').click();
        }
         if($('#selectedrating').val() == "agree") {
            $('a[href*="rate?rating=2"]').click();
        }
        if($('#selectedrating').val() == "disagree") {
            $('a[href*="rate?rating=3"]').click();
        }
        if($('#selectedrating').val() == "funny") {
            $('a[href*="rate?rating=4"]').click();
        }
        if($('#selectedrating').val() == "winner") {
            $('a[href*="rate?rating=5"]').click();
        }
        if($('#selectedrating').val() == "informative") {
            $('a[href*="rate?rating=6"]').click();
        }
        if($('#selectedrating').val() == "friendly") {
            $('a[href*="rate?rating=7"]').click();
        }
        if($('#selectedrating').val() == "useful") {
            $('a[href*="rate?rating=8"]').click();
        }
        if($('#selectedrating').val() == "optimistic") {
            $('a[href*="rate?rating=9"]').click();
        }
        if($('#selectedrating').val() == "creative") {
            $('a[href*="rate?rating=10"]').click();
        }
        if($('#selectedrating').val() == "old") {
            $('a[href*="rate?rating=11"]').click();
        }
        if($('#selectedrating').val() == "badspelling") {
            $('a[href*="rate?rating=12"]').click();
        }
        if($('#selectedrating').val() == "dumb") {
            $('a[href*="rate?rating=13"]').click();
        }
     });
     $('div[class="linkGroup SelectionCountContainer"]').append('<a href="' + window.location.pathname + '#" class="OverlayTrigger" id="undoallratings">Remove all ratings</a>');
     $('#undoallratings').click(function(){
        $('a[href*="rate?rating=del"]').click();
     });
  
     $('div[class="followBlock"] > ul').append('<li><a href="' + window.location + '" class="OverlayTrigger" id="likeallprofile">Like All</a>');
     $('#likeallprofile').click(function(){
         $('div[class="publicControls"] > a:contains("Like")').click();
     });
    
     $('div[class="linkGroup SelectionCountContainer"]').append('<a href="' + window.location.pathname + '#" class="OverlayTrigger" id="combthread">Comb Thread</a>');
     $('#combthread').click(function(){
        //Get The pagecount
        pages = $('span[class="pageNavHeader"]').eq(0).text().split(" ").pop();
        //run the script
        runScript();
     });
});
var counter = 1;
var thread = window.location.pathname;
function runScript(){
    if(counter >= pages){
        return;
    }
    var win = window.open("http://seriousgmod.com" + thread + "page-" + counter, '_blank');
    setTimeout( function(){
        win.close();
        runScript();
        counter++;
    }, 2000);
}