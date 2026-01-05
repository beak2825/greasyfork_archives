// ==UserScript==
// @name         twitter hearts to favs
// @namespace    rossdoran.com
// @version      5.8
// @description  don't tread on me
// @author       ross doran
// @match        https://twitter.com/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @downloadURL https://update.greasyfork.org/scripts/14014/twitter%20hearts%20to%20favs.user.js
// @updateURL https://update.greasyfork.org/scripts/14014/twitter%20hearts%20to%20favs.meta.js
// ==/UserScript==

// this script uses the waitForKeyElements.js script by BrockA so that tweets loaded by AJAX are still updated. thanks dude

// change "Likes" to "Favorites" on profile pages

waitForKeyElements(".ProfileNav-label", function() {     
    $(".ProfileNav-label").each(function() {
    $(this).html($(this).html().replace("Like","Favorite"))
    })
});

// change "Likes" count to "Favorites" on individual tweet status page

waitForKeyElements(".js-stat-count", function() {     
if (window.location.href.indexOf("status") > -1)
    $(".js-stat-count a").each(function() {        $(this).html($(this).html().replace("Like","Favorite"))                })
});

// change 'Like' tooltip to 'Favorite'

waitForKeyElements("div.js-tooltip", function() {     

    $("div.js-tooltip").each(function() {    
                    
        var origTitle = $(this).attr("title");
        if (origTitle == "Like") // Change tooltip caption "Like" to "Favorite"
        {
           $(this).attr("data-original-title","Favorite")
    $(this).attr("title","Favorite")        
        }
        else if (origTitle == "Undo like") // Change tooltip caption "Undo like" to "Undo favorite"
        {
          $(this).attr("data-original-title","Undo favorite")
    $(this).attr("title","Undo favorite")        
        }
         
    })
});
    
// remove 'liked' heartbadge from interactions    

waitForKeyElements(".Icon--heartBadge", function() { 
    $(".Icon--heartBadge").addClass("Icon--favorited").removeClass("Icon--heartBadge");
});

// change 'liked' to 'favorited'

waitForKeyElements(".stream-item-activity-line", function() { 

    $(".stream-item-activity-line").each(function() {
$(this).html($(this).html().replace("liked","favorited"))                
    });
    
    
});

waitForKeyElements(".view-all-supplements", function() {
     $(".view-all-supplements span").each(function() {
$(this).html($(this).html().replace("like","favorite"))                
    });
});

// change hearts to stars

waitForKeyElements(".HeartAnimationContainer", function() { 

    $(".HeartAnimationContainer").each(function()
{
    var favSpan = document.createElement("span");
    favSpan.setAttribute("class","Icon Icon--favorite");        
    // add .Icon--favorite class        
    addGlobalStyle(".Icon--favorite:before { content: \"\\f147\" !important; }");
    // add .Icon--favorited class        
    addGlobalStyle(".Icon--favorited:before { content: \"\\f001\" !important; color:#ffac33 !important }");
    // change hover color    
    addGlobalStyle(".ProfileTweet-action--favorite .ProfileTweet-actionButton:hover, .ProfileTweet-action--favorite .ProfileTweet-actionButton:focus, .ProfileTweet-action--favorite .ProfileTweet-actionCount:hover, .ProfileTweet-action--favorite .ProfileTweet-actionCount:focus, .favorited .ProfileTweet-action--favorite .Icon--favorite, .favorited .ProfileTweet-action--favorite .ProfileTweet-actionButtonUndo, .favorited .tweet-actions .Icon--favorite { color: #ffac33 !important } ");
    $(this).parent().append(favSpan);
    $(this).remove();    

})
});

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}