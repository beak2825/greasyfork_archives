// ==UserScript==
// @name         Youtube Recommendation Blacklist
// @namespace    https://greasyfork.org/en/users/76021
// @version      1.1
// @description  Make your own blacklist, remove the pesky youtube channels you don't want to see from the recommendation list
// @author       DaLimCodes
// @icon         https://www.youtube.com/yts/img/favicon_144-vflWmzoXw.png
// @match        https://www.youtube.com/watch?v=*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/29605/Youtube%20Recommendation%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/29605/Youtube%20Recommendation%20Blacklist.meta.js
// ==/UserScript==

var blacklist = GM_getValue("blacklist", "").split(",");
emptySpace = blacklist.indexOf(""); //stops empty line from showing up in blacklist
console.log(emptySpace);
if (emptySpace>-1){
    blacklist.splice(emptySpace,1);
}
var recommendationList;
var currentlyHoveredChannelName = "";
var timeoutFunction;

var floatDivHTML;
var floatDivDOM;
var blacklistManager = {};

var hidden;

var extraCSS = document.createElement("style");
extraCSS.textContent = `
#floatDiv {
position:absolute;
background:Salmon;
height:45px; width:160px;
border:2px solid Maroon;
z-index:2;
cursor:pointer
}

#floatDivButton {
position: absolute;
top: 50%; left: 50%;
transform: translate(-50%, -50%);
color:DarkRed;
font-weight:bold;
cursor:pointer;
}

.menuOption {color:White;cursor:pointer;border:2px solid Maroon;background:Salmon; padding: 2px 5px}
.managerMenuCloseOption {color:White;position:absolute;top:20px;right:20px; font-size:200%; cursor:pointer;text-align:center;}
.managerMenuOption {color:White;cursor:pointer;border:1px solid white; font-size:110%}

#menu_blacklistToggle{position: relative; float:right; }
#menu_blacklistManager{position: relative; float:right; }

#blacklistManager{
color:White;
position:fixed;
top: 50%;left: 50%;
transform: translate(-50%, -50%);
height:300px;width:500px;
background:rgba(0,0,0,0.5);
padding: 20px;
z-index:10
}

#blacklistManagerContent{
position: relative;
top: 50%;
transform: translate(-5%, -50%);
width: 600px;
margin: 0 auto;
text-align: center;
}

#blacklistSelector {width:300px;}
`;
document.head.appendChild(extraCSS);

$(document).ready(function(){

    recommendationList = $(".video-list-item");
    floatDivHTML = '<div id="floatDiv"><button type="button" id="floatDivButton">Remove this channel from recommendation</button></div>'; //maybe use image instead of text
    $('#body-container').append(floatDivHTML);
    floatDivDOM = $('#floatDiv');
    floatDivDOM.hide();
    floatDivDOM.click(floatDivClickHandler);

    blacklistManager.HTML = `
<div id="blacklistManager">
<div class="managerMenuCloseOption">&#10005;</div>
<div id="blacklistManagerContent">Add to blacklist:
<input type="text" name="blacklistEntry" id="blacklistEntry" placeholder="Press Enter to add">
<br>
<br>
Current blacklisted channel
<br>
<select name="BL" id="blacklistSelector" size="10" multiple></select>
<br>
<br>
<button type="button" class="managerMenuOption" id="blacklistRemove">Remove From Blacklist</button>
</div>
</div>
`;
    $("body").append(blacklistManager.HTML);
    blacklistManager.DOM = $("#blacklistManager");
    blacklistManager.DOM.hide();
    $("#blacklistRemove").click(function(){
        var listToRemove = $("#blacklistSelector").val();
        removeFromBlacklist(listToRemove);
    });

    $(".managerMenuCloseOption").click(toggleBlacklistManager);
    $("#blacklistEntry").keypress(function(e){
        if(e.keyCode == 13){
            addToBlacklist($(this).val());
            $(this).val('');
        }
    });

    $(floatDivDOM).hover(function(){
        clearTimeout(timeoutFunction);
    },function(){
        timeoutFunction = setTimeout(function(){
            floatDivDOM.hide();
        }, 1000);
    });

    // Hide blacklisted items from the recommendation list
    filterRec(true);
    for (i=0; i<recommendationList.length; i++){
        $(recommendationList[i]).hover(function(){
            // Hover on
            clearTimeout(timeoutFunction);
            currentlyHoveredChannelName = getTitleFromLi(this);

            var x = getOffset(this).left + 400;
            var y = getOffset(this).top;
            floatDivDOM.css({ // customize the left and top location
                'left': x+'px',
                'top': y+'px',
            });
            floatDivDOM.show();
            $("#floatDivButton").click(floatDivClickHandler);
        },function(){
            // Hover off
            timeoutFunction = setTimeout(function(){
                floatDivDOM.hide();
            }, 1000);
        });
    }

    appendToggleHidden();
    blacklistManagerAttach();

});

function floatDivClickHandler(){
    addToBlacklist(currentlyHoveredChannelName);
    timeoutFunction = setTimeout(function(){
        floatDivDOM.hide();
    }, 100);
}

function appendToggleHidden(){
    // Add option to toggle the hidden channels
    toggleHiddenButtonHTML = '<button type="button" class="menuOption" id="menu_blacklistToggle">Toggle hidden channels</button>'; //maybe use image instead of text
    $('#watch-headline-title').append(toggleHiddenButtonHTML);
    toggleHiddenButtonDOM = $('#menu_blacklistToggle');
    toggleHiddenButtonDOM.click(function(){
        if (hidden){
            filterRec(false);
        } else {
            filterRec(true);
        }
    });
}

function blacklistManagerAttach(){
    // Add option to manage blacklisted channels
    blacklistManager.buttonHTML = '<button type="button" class="menuOption" id="menu_blacklistManager">Manage Blacklist</button>'; //maybe use image instead of text
    $('#watch-headline-title').append(blacklistManager.buttonHTML);

    blacklistManager.buttonDOM = $("#menu_blacklistManager");
    blacklistManager.hidden = true;
    blacklistManager.buttonDOM.click(function(){
        toggleBlacklistManager();
    });
}

function toggleBlacklistManager(){
    if (blacklistManager.hidden){
        populateSelectionTable();
        blacklistManager.DOM.show();
        blacklistManager.hidden = false;
    } else {
        blacklistManager.DOM.hide();
        blacklistManager.hidden = true;
    }
}

function populateSelectionTable(){
    $("#blacklistSelector").empty();
    var options = "";
    for (i=0;i<blacklist.length;i++){
        var item = blacklist[i];
        options += '<option value="'+ item +'">'+item;
    }
    $("#blacklistSelector").append(options);
}

function filterRec(bool_hide){
    if (bool_hide){
        hidden = true;
    } else {
        hidden = false;
    }
    for (i=0; i<recommendationList.length; i++){
        if(bool_hide){
            var nameToCheck = getTitleFromLi(recommendationList[i]);
            if (nameToCheck!=="" && blacklist.indexOf(nameToCheck) > -1){
                $(recommendationList[i]).hide();
            }
        } else {
            $(recommendationList[i]).show();
        }
    }
}

function filterUser(bool_hide, username){
    for (i=0; i<recommendationList.length; i++){
        var nameToCheck = getTitleFromLi(recommendationList[i]);
        if (nameToCheck!=="" && username === nameToCheck){
            if(bool_hide){
                $(recommendationList[i]).hide();
            } else {
                $(recommendationList[i]).show();
            }
        }
    }
}

function getTitleFromLi(liItem){
    var title = $(liItem).children(".content-wrapper").children("a").children(".stat.attribution").text();
    if (title === ""){
        title = $(liItem).children(".related-item-dismissable").children(".content-wrapper").children("a").children(".stat.attribution").text();
    }
    return title;
}

function arrayStringtoLine(array){
    var returnThis = "";
    for (i=0;i<array.length;i++){
        if(returnThis === ""){
            returnThis = returnThis + array[i];
        } else {
            returnThis = returnThis +","+ array[i];
        }
    }
    return returnThis;
}

function removeFromBlacklist(usernameArray){
    for (j=0;j<usernameArray.length;j++){
        console.log(j);
        var index = blacklist.indexOf(usernameArray[j]);
        blacklist.splice(index,1);
        filterUser(false, usernameArray[j]);
    }
    GM_setValue("blacklist", arrayStringtoLine(blacklist));
    populateSelectionTable();
}

function addToBlacklist(username){
    var index = blacklist.indexOf(username);
    if(index === -1 && username!==""){
        blacklist.push(username);
        GM_setValue("blacklist", arrayStringtoLine(blacklist));
        filterRec(true);
        populateSelectionTable();
    }
}

// Credit to Adam Grant: http://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
function getOffset(el) {
    el = el.getBoundingClientRect();
    return {
        left: el.left + window.scrollX,
        top: el.top + window.scrollY
    };
}