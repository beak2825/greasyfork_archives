// ==UserScript==
// @name         Marketplace Ban
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button that gives out 3 day marketplace ban
// @author       Saad K
// @match        *hackforums.net/showthread.php*
// @grant        none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/18195/Marketplace%20Ban.user.js
// @updateURL https://update.greasyfork.org/scripts/18195/Marketplace%20Ban.meta.js
// ==/UserScript==


$(document).ready(function() {
    injectjs();
    addThreadButtons();
});

/**
 * Props to adam for the intial code. I was a bit [s]lazy[/s] busy to do it myself.
**/
function addThreadButtons() {
	var menu, uid;
	menu = $('div.author_buttons');
	posts = $("#posts").find("td[class='post_author']");
  authorInfo = $("#posts").find("td[class='smalltext post_author_info']");
  if(authorInfo.length != menu.length){
    alert("authorInfo.length != menu.length WTF?");
  }


  for (i = 0; i < menu.length; i++) {
		if (menu[i].innerHTML.indexOf('href="private.php?action=send&amp;uid=') != -1) {
      var username = $(posts[i]).find(".largetext")[0].innerText;

      console.log(username);
			uid = menu[i].innerHTML.split('href="private.php?action=send&amp;uid=')[1].split('" class')[0];
			$(menu[i]).append('<a href="javascript:void(0)" class="bitButton" title="Marketplace Ban" onclick="if(confirm(\'Are you sure you want to ban \' + username + \' for 3 days?\')) { banUser(\''+username+'\'); }">3 Day ban</a>');
		}
	}
}
/**
action:do_banuser
my_post_key:
uid:
username:Shimoli1964
banreason:You cannot buy, sell, trade, or offer services outside the Marketplace. Violation earns an automatic 3-day ban. Read the Help Documents upon return.  
usergroup:7
liftafter:3-0-0
updateban:Ban
**/

function injectjs() {
    $('<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js" />"<script type="text/javascript">'+ 'function banUser(username){    console.log(username);     $.ajax({          type: "POST",        async: false,          url: "modcp.php",          data: {              action:"do_banuser",              uid: "",              username: username,              banreason:"You cannot buy, sell, trade, or offer services outside the Marketplace. Violation earns an automatic 3-day ban. Read the Help Documents upon return.",               usergroup:"7",              liftafter: "3-0-0",              updateban:"Ban",              my_post_key:document.documentElement.innerHTML.split(\'my_post_key = "\')[1].split(\'";\')[0]          }}          ).done(function( data ) {            console.log(data);location.reload();           });  return;}' +'</script>').appendTo($('head')); 
}
