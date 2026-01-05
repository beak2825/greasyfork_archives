// ==UserScript==
// @name Naruto-Boards Test Skin
// @namespace https://greasyfork.org/en/users/14328-charaoh
// @description Changes NB layout
// @include http://www.naruto-boards.com*
// @include http://naruto-boards.com*
// @version 0.0.1.20150816033904
// @downloadURL https://update.greasyfork.org/scripts/11741/Naruto-Boards%20Test%20Skin.user.js
// @updateURL https://update.greasyfork.org/scripts/11741/Naruto-Boards%20Test%20Skin.meta.js
// ==/UserScript==
GM_addStyle(" \
body { \
	width: auto; \
	color: #ffffff; \
	background-color: #0d1419; \
	margin: 0px 0px; \
	background-image: url(\"http://www.naruto-boards.com/images/forum/backgroundpattern_3.gif\"); \
	background-repeat: repeat-y; \
	background-position: center; \ !important \
} \
#layout { \
	width: 775px; \
	color: #000000; \
	background-color: #0d1419; \
	margin: 10px auto; !important \
} \
#top { \
	height: 246px; \
	cursor: pointer; \
	background-image: url(\"http://www.naruto-boards.com/images/layout/top.jpg\"); !important \
} \
#controlpanel_top { \
	background-image: url(\"http://www.naruto-boards.com/images/layout/topbox_controlpanel.jpg\"); !important \
} \
#forumactivity_top { \
	background-image: url(\"http://www.naruto-boards.com/images/layout/topbox_forumactivity.jpg\"); !important \
} \
#newtopics_top { \
	background-image: url(\"http://www.naruto-boards.com/images/layout/topbox_newtopics.jpg\"); !important \
} \
div.boxleft { \
	width: 247px; \
	height: 136px; \
	margin-bottom: 10px; \
	background-image: url(\"http://www.naruto-boards.com/images/layout/topbox_left.jpg\"); !important \
} \
div.boxright { \
	width: 0; \
	background-image: none; \
	display: none; !important \
} \
div.contenttop { \
	height: auto; \
	padding-top: 4px;\
	background-image: url(\"http://www.naruto-boards.com/images/layout/content_top.jpg\"); !important \
} \
table.controlpanel td span { \
	background-repeat: repeat-x; !important \
} \
div.contentmiddle { \
	background-image: url(\"http://www.naruto-boards.com/images/layout/background.gif\"); \
	padding: 5px 10px 10px 10px; !important \
} \
div.contentbottom { \
	background-image: none; !important \
} \
div.inlineheader, table.controlpanel td span, div.header { \
	background-image: url(\"http://www.naruto-boards.com/images/forum/backgroundpattern_3.gif\"); !important \
} \
div.header { \
	border: none; !important \
} \
input.border, textarea.border { \
	background-color: #1C1919; \
} \
#help { \
	color: #ffffff; \
	background-image: none; \
	background-color: #0D1419; !important \
} \
#footer { \
	background-image: url(\"http://www.naruto-boards.com/images/layout/footer.jpg\"); !important \
} \
a.bbcode_url { \
	font: bold 11px Arial,Verdana,Helvetica,sans-serif; !important \
} \
div.contentmiddle div center div.nothing { \
	color: #000000; !important \
} \
table.navigation td a, table.navigation td.curr b { \
	width: 20px; !important \
} \
#replyf input[value=\"Post Reply\"], input[value=\"Post Topic\"], input[value=\"Edit Reply\"], input[value=\"Send Pm\"], input[value=\"Edit Topic\"] { \
	font: 12px Verdana,Arial,Helvetica,sans-serif; \
	height: 22px; \
	width: 10%; \
	left: 50px; !important \
} \
#replyf input[value=\"Empty Reply\"], input[value=\"Reset Fields\"],  input[value=\"Reset Form\"] { \
	display: none; !important \
} \
");

var z = document.getElementsByTagName('td');
for (var i=0; i<z.length; i++) {
	if ((z[i].className == 'post_userinfo') && (z[i].getElementsByTagName('img').length == 1)) {
		// removing rank text
		var textnodes = z[i].childNodes;
		var count=0;
		var textnode;
		for (var q=0; q<z[i].childNodes.length; q++) {
			textnode=textnodes[q].nodeName;
			if(textnode == 'BR') { count++; }
			if(textnode == 'IMG') {	
			k = z[i].getElementsByTagName('br')[1];
				k.parentNode.removeChild(k);
				break;
			}
			k = textnodes[q];
			k.parentNode.removeChild(k);
		}
		//end of removing
				
		var ranktag = new Image(); // width, height 
		var userrank = z[i].getElementsByTagName('a')[0].className;
				
		if(userrank == 'topicuser_member') {
			ranktag.src = 'member.png';
		}
		else if(userrank == 'topicuser_global moderator') { 
			ranktag.src = 'global-moderator.png';
		}
		else if(userrank == 'topicuser_moderator') {
			ranktag.src = 'moderator.png';
		}
		else if(userrank == 'topicuser_admin') {
			ranktag.src = 'admin.png';
		}
		else if(userrank == 'topicuser_webmaster') {
			ranktag.src = 'webmaster.png';
		}

		var avatar=z[i].getElementsByTagName('br')[1]; //use 2 if text rank is not removed
		avatar.parentNode.insertBefore(ranktag,avatar);
				
		if(userrank != 'topicuser_member') {
			z[i].getElementsByTagName("img")[0].style.padding = '5px 0px 0px';
			z[i].getElementsByTagName("img")[1].style.padding = '0px';
		}
	} else
	if (z[i].className=="title_icon") {
		var iconimage = z[i].getElementsByTagName("img")[0].src;
		if((iconimage=="http://www.naruto-boards.com/images/forum/board_fresh.gif")
		||(iconimage=="http://www.naruto-boards.com/images/forum/board_fresh.gif"))
			z[i].getElementsByTagName("img")[0].src='http://www.naruto-boards.com/images/forum/board_link.gif';
		if((iconimage=="http://www.naruto-boards.com/images/forum/board_old.gif")
		||(iconimage=="http://www.naruto-boards.com/images/forum/board_old.gif"))
			z[i].getElementsByTagName("img")[0].src='http://www.naruto-boards.com/images/forum/board_link.gif';
		if((iconimage=="http://http://www.naruto-boards.com/images/forum/board_link.gif")
		||(iconimage=="http://www.naruto-boards.com/images/forum/board_link.gif"))
			z[i].getElementsByTagName("img")[0].src='http://www.naruto-boards.com/images/forum/board_link.gif';
	} else
	if (z[i].className=="icon") {
		var iconimage = z[i].getElementsByTagName("img")[0].src;
		if((iconimage=="http://www.naruto-boards.com/images/forum/legend_new.gif")
		||(iconimage=="http://www.naruto-boards.com/images/forum/legend_old.gif"))
			z[i].getElementsByTagName("img")[0].src='http://www.naruto-boards.com/images/forum/board_link.gif';
		if((iconimage=="http://www.naruto-boards.com/images/forum/legend_old.gif")
		||(iconimage=="http://www.naruto-boards.com/images/forum/legend_old.gif"))
			z[i].getElementsByTagName("img")[0].src='http://www.naruto-boards.com/images/forum/board_link.gif';
	}
}

// Replace the navigation buttons
var topnav = document.getElementById('topnav'); 
var navlinks = topnav.getElementsByTagName('a'); 
for (var i = navlinks.length - 1; i >= 0; i--) {
	var navbuttons = navlinks[i].getElementsByTagName('img'); 
	if(navbuttons.length > 0) {
		var linktitle = navlinks[i].getAttribute('title'); 
		if(linktitle == 'Homepage') {
			navbuttons[0].src = 'http://www.naruto-boards.com/images/content/187/navigation.gif'; 
		}
		else if(linktitle == 'Register') {
			navbuttons[0].src = 'http://www.naruto-boards.com/images/content/188/navigation.gif'; 
		}
		else if(linktitle == 'Forum rules') {
			navbuttons[0].src = 'http://www.naruto-boards.com/images/content/14/navigation.gif'; 
		}
		else if(linktitle == 'Lost Password') {
			navbuttons[0].src = 'http://www.naruto-boards.com/images/content/186/navigation.gif'; 
		}
		else if(linktitle == 'FAQ') {
			navbuttons[0].src = 'http://www.naruto-boards.com/images/content/189/navigation.gif'; 
		}
		else if(linktitle == 'Sitemap') {
			navbuttons[0].src = 'http://www.naruto-boards.com/images/content/23/navigation.gif'; 
		}
	}
}

// Replace the 'View Todays Replies/Topics' icons
var boxrightArray = document.getElementsByClassName('bottomlink');
for (var i = boxrightArray.length - 1; i >= 0; i--) {
	var topinfoicons = boxrightArray[i].getElementsByTagName('img'); 
	if(topinfoicons.length > 0) {
		topinfoicons[0].src = 'http://www.naruto-boards.com/images/forum/topinfo_icon.gif'; 
	}
}

// Replace the breadcrumb icons
var breadcrumbs = document.getElementsByClassName('breadcrumb');
for (var i = breadcrumbs.length - 1; i >= 0; i--) {
	var breadcrumbicons = breadcrumbs[i].getElementsByTagName('img'); 
	for (var j = breadcrumbicons.length - 1; j >= 0; j--) {
		breadcrumbicons[j].src = 'http://www.naruto-boards.com/images/forum/topinfo_list.gif'; 
	}
}

// Replace the 'New Topic' button
var maxTable = document.getElementsByClassName('max'); 
for (var i = maxTable.length - 1; i >= 0; i--) {
	var maxImages = maxTable[i].getElementsByTagName('img'); 
	for (var j = maxImages.length - 1; j >= 0; j--) {
		var imageSrc = maxImages[i].src; 
		imageSrc = imageSrc.substring(imageSrc.length-19); 
		if(imageSrc == 'button_newtopic.gif') {
			maxImages[i].src = 'http://www.naruto-boards.com/images/forum/button_newtopic.gif'; 
		}
	}
}

// Replace the 'Quote, 'PM', 'Edit', 'Delete' and 'Move' buttons
var replyHeader = document.getElementsByClassName('replyheader'); 
for (var i = replyHeader.length - 1; i >= 0; i--) {
	var replyImages = replyHeader[i].getElementsByTagName('img'); 
	for (var j = replyImages.length - 1; j >= 0; j--) {
		var imageSrc = replyImages[j].src; 
		if(imageSrc.substring(imageSrc.length-14) == 'post_quote.gif') {
			replyImages[j].src = 'http://www.naruto-boards.com/images/forum/post_quote.gif'; 
		}
		else if(imageSrc.substring(imageSrc.length-11) == 'post_pm.gif') {
			replyImages[j].src = 'http://www.naruto-boards.com/images/forum/post_pm.gif'; 
		}
		else if(imageSrc.substring(imageSrc.length-13) == 'post_edit.gif') {
			replyImages[j].src = 'http://www.naruto-boards.com/images/forum/post_edit.gif'; 
		}
		else if(imageSrc.substring(imageSrc.length-15) == 'post_delete.gif') {
			replyImages[j].src = 'http://www.naruto-boards.com/images/forum/post_delete.gif'; 
		}
		else if(imageSrc.substring(imageSrc.length-14) == 'topic_move.gif') {
			replyImages[j].src = 'http://www.naruto-boards.com/images/forum/post_move.gif'; 
		}
	}
}

// Replace the buddy delete icon with the one having a transparent background
var bdtd = document.getElementsByTagName("img");
for (var i=0; i<bdtd.length; i++) {
	if ((bdtd[i].src=="http://www.naruto-boards.com/images/buddylist/buddy_delete.gif")||(bdtd[i].src=="http://www.naruto-boards.com/images/buddylist/buddy_delete.gif")) {
		bdtd[i].src='http://www.naruto-boards.com/images/buddylist/buddy_delete.gif';
	}
}

// Top banner link to index
if (document.getElementById("top")) {
	document.getElementById("top").setAttribute('onclick', 'window.open("http://www.naruto-boards.com","_self")');
}