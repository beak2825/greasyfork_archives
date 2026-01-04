// ==UserScript==
// @name        thefretboard forums ignore script
// @namespace   https://userscripts-mirror.org
// @description Blocks posts, quotes and reactions from specified users on thefretboard forums
// @include     http://www.thefretboard.co.uk/*
// @match 		http://www.thefretboard.co.uk/*
// @version     4
// @grant       none
// @run-at      document-ready
// @downloadURL https://update.greasyfork.org/scripts/40632/thefretboard%20forums%20ignore%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/40632/thefretboard%20forums%20ignore%20script.meta.js
// ==/UserScript==

//add a person to this list, enclosing their name with "" and ending with ,
var userlist = [
"Sporky",
];

var postsToDelete = document.querySelectorAll(".Author");
var reactionsToDelete = document.querySelectorAll(".UserReactionWrap");
var quotesToHide = document.querySelectorAll(".QuoteAuthor");
var onlineUsersToHide = document.querySelectorAll(".OnlineUserName");

for (var i=0; i < postsToDelete.length; i++)
{
    if (userlist.indexOf(postsToDelete[i].querySelector(".Username").innerHTML) > -1)
    {
        postsToDelete[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none';
    }
}

for (var i=0; i < reactionsToDelete.length; i++)
{
    if (userlist.indexOf(reactionsToDelete[i].querySelector(".ProfilePhoto").getAttribute("alt")) > -1)
    {
        reactionsToDelete[i].style.display = 'none';
    }
}

for (var i=0; i < quotesToHide.length; i++)
{
    if (userlist.indexOf(quotesToHide[i].firstChild.innerHTML) > -1)
    {
        quotesToHide[i].parentNode.style.display = 'none';
    }
}

for (var i=0; i < onlineUsersToHide.length; i++)
{
    if (userlist.indexOf(onlineUsersToHide[i].innerHTML) > -1)
    {
        onlineUsersToHide[i].parentNode.style.display = 'none';
        document.querySelector(".Count").innerHTML -= 1;
    }
}