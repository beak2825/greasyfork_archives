// ==UserScript==
// @name        MyAnimeList(MAL) - Anime/Manga Lists in the Panel
// @description Re-adds the list links into the panel.
// @author      Zeando
// @include     *myanimelist.net/
// @include     *myanimelist.net/panel.php*
// @version     1.0.5.1
// @grant       none
// @namespace https://greasyfork.org/users/29190
// @downloadURL https://update.greasyfork.org/scripts/16775/MyAnimeList%28MAL%29%20-%20AnimeManga%20Lists%20in%20the%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/16775/MyAnimeList%28MAL%29%20-%20AnimeManga%20Lists%20in%20the%20Panel.meta.js
// ==/UserScript==

//checks if you're logged in (or it can't get your username for the list links)
if ($('.btn-signup').length === 0) {
  //fetches the user name from the panel page
  var user = document.getElementsByClassName('header-profile-link') [0].textContent;
  
  //fetches the position where to add the new lines
  var content = document.getElementsByClassName('left-column') [0];
  //creates the container where the new lines will be added
  var listlinks = document.createElement('div');
  //inserts the new container into the desired position 
  content.insertBefore(listlinks, content.firstChild); //content.firstChild, null=at the end
  
  //code of the lines to add
  string = '<div style="margin: 0px 0px 10px; padding:2px; background-color: #F6F6F6; border: 1px solid #EBEBEB;">'; // style="padding-top:8px;""
  string += '<a href="http://myanimelist.net/editprofile.php">Edit My Profile</a> - ';
  string += '<a href="http://myanimelist.net/animelist/' + user + '">My Anime List</a> - ';
  string += '<a href="http://myanimelist.net/mangalist/' + user + '">My Manga List</a>';
  string += '</div>';
  
  listlinks.outerHTML = string;
}
