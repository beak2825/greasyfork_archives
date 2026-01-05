// ==UserScript==
// @name        /r/reddcoin Upvote Assistant
// @description  Easy upvote assistant for /r/reddcoin
// @include     http://www.reddit.com/r/reddcoin/*
// @author 	lionzeye
// @version     1.0
// @grant	none
// @namespace https://greasyfork.org/users/2704
// @downloadURL https://update.greasyfork.org/scripts/2315/rreddcoin%20Upvote%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/2315/rreddcoin%20Upvote%20Assistant.meta.js
// ==/UserScript==

// REDDIT

// Variables
redditHtml = '<button class="massupvote" type="button"><div class="arrow upmod login-required" role="button" aria-label="upvote" tabindex="0"></div></button>';

// Functions
function redditAddMassUpvote ()
{
    // What happens when the user clicks the tip button
    $('.massupvote').click(function(){
        
   var q = [];
    $('.up').each(function () {
        var that = this;
        var f = function (index) {
            $(that).trigger('click');
            $(that).trigger('mousedown');
            setTimeout(function () {
                if (q[index]) {
                    q[index](index + 1);
                }
            }, 500);
        };
        q.push(f);
    });
    var downVoteTimer = window.setTimeout(function () {
        q[0](1);
    }, 100);
    });
}

function redditAddButtons ()
{  
    $('.tabmenu li:first-child').before(redditHtml);
    
    redditAddMassUpvote ();
}

function redditInitialize ()
{
    redditAddButtons();
}

// Initialize
if (document.domain == 'www.reddit.com' || document.domain == 'reddit.com')
{
    // Initialize Reddit
    redditInitialize ();
}
