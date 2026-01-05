// ==UserScript==
// @name        AniDB - Personal Tab Line
// @namespace   whut
// @description adds an other tab line to improve the tabs standalone usability
// @include     http://anidb.net/perl-bin/animedb.pl?show=*
// @include     http://anidb.net/perl-bin/animedb.pl?do.update=*
// @version     1.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17849/AniDB%20-%20Personal%20Tab%20Line.user.js
// @updateURL https://update.greasyfork.org/scripts/17849/AniDB%20-%20Personal%20Tab%20Line.meta.js
// ==/UserScript==

//checks if you're logged in 
if ($('#menu-login').length === 0) {
  
  //fetches the position where to add the new lines
  var content = document.getElementById('layout-tabs');
  //var content = document.getElementsByClassName('layout-tabs')[0];
  //creates the container where the new lines will be added
  var tabline = document.createElement('div');
  //inserts the new container into the desired position 
  content.insertBefore(tabline, content.firstChild); //content.firstChild, null=at the end
  
  //code of the lines to add
  string = '<ul class="main-tabs tabs-line1" style="padding-bottom:10px;">'; 
  string += '<li class="myplace"><span><a href="animedb.pl?show=userpage">My Place</a></span></li> ';
  string += '<li class="mylist"><a href="animedb.pl?show=mylist&do.filter=1&uid=687303">My List</a></li> ';
  string += '<li class="mywishlist"><span><a href="animedb.pl?show=mywishlist">My Wishlist</a></span></li> ';
  string += '<li class="myreviews"><span><a href="animedb.pl?show=myreviews">My Reviews</a></span></li> ';
  string += '<li class="myvotes"><span><a href="animedb.pl?show=myvotes">My Votes</a></span></li> ';
  string += '<li class="myhints"><span><a href="animedb.pl?show=myhints">My Hints</a></span></li> ';
  string += '<li class="mymessages"><span><a href="animedb.pl?show=msg">My Messages</a></span></li> ';
  string += '<li class="mynotifies"><span><a href="animedb.pl?show=mynotifies">My Notifies</a></span></li> ';
  string += '<li class="mycreqs"><span><a href="animedb.pl?show=creq&my=1">My Creqs</a></span></li> ';
  string += '<li class="myentries"><span><a href="animedb.pl?show=mydb">My DB Entries</a></span></li> ';
  string += '<li class="myreports"><span><a href="animedb.pl?show=report">My Reports</a></span></li> ';
  //string += '<li class="mysignature"><span><a href="http://sig.anidb.net/">My Signatures</a></span></li> ';
  //string += '<li class="applet"><span><a href="animedb.pl?show=applet">Add To Mylist</a></span></li> ';
  //string += '<li class="ed2kdump"><span><a href="animedb.pl?show=ed2kdump">Ed2k Dump</a></span></li> ';
  string += '</ul>';
  

  tabline.outerHTML = string;
}