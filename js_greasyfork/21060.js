// ==UserScript==
// @name         Penny Arcade Forums - Spoil EVERYTHING
// @namespace    http://forums.penny-arcade.com/
// @version      1.2
// @description  Adds a 'Show All Spoilers' toggle button. Setting is saved per thread. 
// @author       RhalloTonny
// @match        http://forums.penny-arcade.com
// @match        https://forums.penny-arcade.com
// @include      http://forums.penny-arcade.com/*
// @include      https://forums.penny-arcade.com/*
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/21060/Penny%20Arcade%20Forums%20-%20Spoil%20EVERYTHING.user.js
// @updateURL https://update.greasyfork.org/scripts/21060/Penny%20Arcade%20Forums%20-%20Spoil%20EVERYTHING.meta.js
// ==/UserScript==

// Thanks to Delmain for the sig and https additions!

(function() {
// add in the CSS for the default white theme
GM_addStyle('.btn-show-spoilers-active{border: 1px solid rgb(152, 75, 16);border-radius: 2px;margin-top: -1px;height: 18px;width: 18px;display: block;float: right;font-weight: bold;font-size: 19px;line-height: 0.9;text-align: center;cursor: pointer;color: white;text-shadow: 1px 1px 1px #984b10;background: rgb(235, 127, 10);text-decoration: none !important;}');
GM_addStyle('.btn-show-spoilers-inactive{border: 1px solid rgb(34, 176, 225);border-radius: 2px;margin-top: -1px;height: 18px;width: 18px;display: block;float: right;font-weight: bold;font-size: 19px;line-height: 0.9;text-align: center;cursor: pointer;color: #22b0e1;text-shadow: 1px 1px 1px #001d3c;background: rgba(235, 127, 10, 0);text-decoration: none !important;}');

//Util Functions
function getCurrentThread(){
    /*
    So far I've found at least 4 different possibilities for thread URLs with Vanilla.
    1. http://domain/discussion/205590/game-of-thrones-book-and-show-season-finale-is-here#latest
    2. http://domain/discussion/205590/game-of-thrones-book-and-show-season-finale-is-here
    3. http://domain/discussion/205590/game-of-thrones-book-and-show-season-finale-is-here/p43
    4. http://domain/discussion/205590
    
    Given this, I think it makes sense to work with the string front to back, rather than back to front. 
    The thread UID seems to be right after the discussion section and who knows if there are other URL schemas I just haven't encountered. 
    @todo - verify this later with other forums just to make sure, especially if I end up abstracting this.
    */

    //get the current URL
    url = window.location.href;
    
    // hack it in half based on the UID pattern
    var threadUid = url.match(/[0-9]+\//);
    var splitUrl = url.split(/[0-9]+\//);
    splitUrl = splitUrl[0];

    // finally recombine it
    var url = splitUrl + threadUid;
    return url;
}
function saveThreadStatus(status){
    GM_setValue(thread, status);
}
function loadThreadStatus(){
    //Things are a little goofy with GM_getValue, so we have to accommodate its quirks
    var returnValue = GM_getValue(thread, "");
    if(returnValue){
        return returnValue;
    }
    else{
        return '';
    }
}
function toggleState(){
    // We're toggling, so do the opposite
    if(loadThreadStatus() === '' || loadThreadStatus() === 'hide'){
        saveThreadStatus('show');
    }
    else if(loadThreadStatus() === 'show'){
        saveThreadStatus('hide');
    }
}

function updatePage(){
    if(loadThreadStatus() === 'show'){
        //reflect changes in ui
        btn.removeClass('btn-show-spoilers-inactive');
        btn.addClass('btn-show-spoilers-active');
        //reflect changes in page
        $('.SpoilerToggle').filter(getSignatureFilter).val('hide');
        $('.SpoilerText').filter(getSignatureFilter).css('display','block');
    }
    else if(loadThreadStatus() === 'hide'){
        //reflect changes in ui
        btn.removeClass('btn-show-spoilers-active');
        btn.addClass('btn-show-spoilers-inactive');
        //reflect changes in page
        $('.SpoilerToggle').filter(getSignatureFilter).val('show');        
        $('.SpoilerText').filter(getSignatureFilter).css('display','none');

    }
}

function getSignatureFilter(i, e) { 
    return $(e).parents('.Signature').length < 1; 
}

function addButton(){
    $('.PageTitle .Options').append('<a class="btn-show-spoilers-inactive" id="show-spoiler-btn">!</a>');
    btn = $('#show-spoiler-btn');
    btn.on('click',function(){
        toggleState();
        updatePage();
    });
}

// Setup variables
var thread = getCurrentThread();
var btn = '';

// Basic init
addButton();
updatePage();

})();