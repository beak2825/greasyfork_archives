// ==UserScript==
// @name        Anime Planet v4 Cleanup
// @namespace   http://localhost
// @include     http://www.anime-planet.com/users/*/anime*
// @version     3
// @grant       none
// @description Some tweaks for Anime Planet v4 site layout, including a new-episode alert.
// @downloadURL https://update.greasyfork.org/scripts/3401/Anime%20Planet%20v4%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/3401/Anime%20Planet%20v4%20Cleanup.meta.js
// ==/UserScript==

//////////////////////////////////////////////
//This script offers some tweaks intended for customizing your 'anime' page at AP. 
//I reserve no rights. Do what you want.
//////////////////////////////////////////////
// <[Select the features you want with these settings:]>

//removes the big banner at the top
var removeBanner = true;
//if this is enabled then you can mouse-over your avatar without 
//the annoying 'Edit Avatar' thingy coming up.
var disableEditAvatarOnMouseover = true;
//I fucking hate forced social shit like this. Fuck you. Stop following me.
var removeFollwersDisplay = true;
//I don't even know what the hell this thing is for, but it annoyed me. It's
//the little person icon with the ?/? next to it, just after the "joined on" date.
var removeUserStatusDisplay = true;
//Nothing really useful in the footer. Navigation stuff is all at the top.
var removeFooter = true;
//This is the main feature. The 'Avg' column is annoying as hell. (More
//forced social crap when I just want to store my stats...)
//This feature will replace the 'Avg' column with the 'New' column.
//Any entry marked as 'Watching' or 'Want to Watch' will be flagged in this
//column if there are unwatched eps available.
//In other words, if you've watched 3 eps and ep 4 comes out, the column
//will say "NEW!" for that show. (Or whatever you specify here.)
var replaceAvgColumnWithNewColumn = true;
var htmlForNoNewEps = ""; //shows when no new eps are available
var htmlForNewEps = "<center><font color=#56004F><b>NEW</b><i class=\"fa fa-chevron-right\" /></font></center>";
/////////////////////////////////////////////

var siteContainer = document.body.children[3];
var loggedInUserName = document.body.children[2].children[0].children[3].children[1].children[0].children[1].text.trim();
var viewedUserName = siteContainer.children[2].children[0].children[2].children[1].text;
var footerObj = document.body.children[4];
var bgImage = siteContainer.children[1];
var editAvatar = siteContainer.children[2].children[0].children[0].children[0];
var followers = siteContainer.children[2].children[1];
var userStatus = siteContainer.children[2].children[0].children[3].children[1];
var table = siteContainer.children[7];
var avgColHeadA = table.children[0].children[0].children[3];
var entries = table.children[1];

if(loggedInUserName == viewedUserName) {
  if(removeBanner) {bgImage.parentNode.removeChild(bgImage);}
  if(disableEditAvatarOnMouseover) {editAvatar.parentNode.removeChild(editAvatar);}
  if(removeFollwersDisplay) {followers.parentNode.removeChild(followers);}
  if(removeUserStatusDisplay) {userStatus.parentNode.removeChild(userStatus);}
  if(removeFooter) {footerObj.parentNode.removeChild(footerObj);}
  
  if(replaceAvgColumnWithNewColumn) {
    avgColHeadA.innerHTML = "<a>New</a>";
    for(var i = 0; i < entries.children.length; i++) {
      var entry = entries.children[i];
      var avgCell = entry.children[3];
      avgCell.innerHTML = htmlForNoNewEps;
        
      var clusterFuck = entry.children[4].children[0];
      var statusList = clusterFuck.children[2];
      var status = statusList.options[statusList.selectedIndex].text;
      if(status == "Watching") {
        var epList = clusterFuck.children[3];
        var maxEp = epList.length - 1;
        var curEp = epList.selectedIndex;
        if(curEp != maxEp) {
          avgCell.innerHTML = htmlForNewEps;
        }
      }
      else if(status == "Want to Watch") {
        if(statusList.options[1].text.charAt(2) == "t") {
          avgCell.innerHTML = htmlForNewEps;
        }
      }
    }
  }
}    
