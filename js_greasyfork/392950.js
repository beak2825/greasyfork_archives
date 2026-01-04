// ==UserScript==
// @name         Expand or Shrink All Posts with a Key on Old Reddit (Navigation & voting extras)
// @namespace    https://twitter.com/ufuksarp
// @version      1.5
// @description  Expands all posts on Reddit utilizing its ".expando-button" button (C key is the default. You can change it to your preference by modifying the value "67". Search for "keycodes" on web. Also Q for upvote, E for downvote, W for previous post, S for next post, A for previous page, D for next page.)
// @author       Ufuk Sarp Selçok
// @include      /^https://www\.reddit\.com/r/*
// @exclude      /^https://www\.reddit\.com/r/.*/comments/*

// @downloadURL https://update.greasyfork.org/scripts/392950/Expand%20or%20Shrink%20All%20Posts%20with%20a%20Key%20on%20Old%20Reddit%20%28Navigation%20%20voting%20extras%29.user.js
// @updateURL https://update.greasyfork.org/scripts/392950/Expand%20or%20Shrink%20All%20Posts%20with%20a%20Key%20on%20Old%20Reddit%20%28Navigation%20%20voting%20extras%29.meta.js
// ==/UserScript==
(function() {
    //Jquery animations
    $.easing.jswing = $.easing.swing;

    $.extend($.easing,
             {
        def: 'easeOutQuad',
        swing: function (x, t, b, c, d) {
            return $.easing[$.easing.def](x, t, b, c, d);
        },
        easeInOutSine: function (x, t, b, c, d) {
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        }
    });

    // Get Expand State from Cache Once
    var expandState = localStorage.getItem("State");

    //Define and Call the Function for Checking 10 Times Per Second if Expand Buttons are Loaded
    function waitForElement(classname, callback) {
        var poops = setInterval(function() {
            if (document.getElementsByClassName(classname)) {
                clearInterval(poops);
                callback();
            }
        }, 100);
    }

    waitForElement("expando-button", function() {
        if (expandState == "open") {
            ExpandShrinkAll();
        }
        document.onkeydown = checkKey;
    });

    //Remove Promoted Element, Preventing Video Autoplay
    var promoted = document.querySelector(".promoted");
    if (promoted) {
        promoted.remove();
    }

    //Get All the Expand, Previous, Next, Arrow Up, Arrow Down Buttons
    $things = $("#siteTable .thing");
    $arrowUps = $("#siteTable .thing > .midcol > .arrow.up, #siteTable .thing > .midcol > .arrow.upmod");
    $arrowDowns = $("#siteTable .thing > .midcol > .arrow.down, #siteTable .thing > .midcol > .arrow.downmod");
    var tLen = $things.length;
    var current = -1;

    var expandButtons = document.getElementsByClassName("expando-button");
    var nextButton = document.getElementsByClassName("next-button")[0].firstChild;
    var prevButton = document.getElementsByClassName("prev-button")[0].firstChild;

    //Check Key
    function checkKey(e) {
        if(e.repeat)return;
        if(document.activeElement.tagName.toLowerCase() !== ("input" || "select")){
            switch (e.keyCode) {
                case 83: //key S - Next Post
                    current++;
                    if(current>=tLen){nextButton.click();}
                    else{$('html, body').stop().animate({scrollTop: $things.eq(current).offset().top+10}, 200, "easeInOutSine");}
                    break;
                case 69: //key E - Upvote
                    $arrowUps.eq(current).click();
                    break;
                case 81: //key Q - Downvote
                    $arrowDowns.eq(current).click();
                    break;
                case 67: //key C - Toggle
                    ExpandShrinkAll();
                    if (expandState == "open") {
                        localStorage.setItem("State", "closed");
                    } else {
                        localStorage.setItem("State", "open");
                    }
                    break;
                case 68: //key D - Next Page
                    nextButton.click();
                    break;
                case 87: //key W - Previous Post
                    current--;
                    if(current<0){prevButton.click();}
                    else{$('html, body').stop().animate({scrollTop: $things.eq(current).offset().top}, 200, "easeInOutSine");}
                    break;
                case 65: //key A - Previous Page
                    prevButton.click();
                    break;
            }
        }
    }

    //Define ExpandShrinkAll Function
    function ExpandShrinkAll() {

        //Check If an Input or Textarea is Focused
        for (var i = 0, len = expandButtons.length; i < len; i++) {
            expandButtons[i].click();
        }
    }
})();