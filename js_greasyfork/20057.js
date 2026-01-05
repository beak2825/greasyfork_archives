// ==UserScript==
// @name          fokse's d2jsp post blocker
// @author        Fokse
// @description   Hides posts from a defined list of users [Update 06/09/2021]
// @namespace	  jsppostblocker
// @include       https://forums.d2jsp.org/topic.php?t=*&f=*
// @include	  https://forums.d2jsp.org/topic.php?t=*
// @include	  https://forums.d2jsp.org/post.php
// @require http://code.jquery.com/jquery-latest.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @version 1.14
// @downloadURL https://update.greasyfork.org/scripts/20057/fokse%27s%20d2jsp%20post%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/20057/fokse%27s%20d2jsp%20post%20blocker.meta.js
// ==/UserScript==

if (!Array.isArray(GM_getValue("fokse_post_blocker_userlist"))) {
    GM_setValue("fokse_post_blocker_userlist", []);
}

function parsePage(){
    console.log('sup');
	var blockedUser = GM_getValue('fokse_post_blocker_userlist')
    $('body > form > dl').each(function() {
        if (typeof $('dt > a', this).attr('href') !== 'undefined' && ~$('dt > a', this).attr('href').indexOf('user.php?i=')) {
			var userId = $('dt > a', this).attr('href').split("=")[1];
			if (~blockedUser.indexOf(userId)){
				$('dd > div > div.bc1.upc > div.desc.cl.rc > div.fR.links', this).prepend(`<b><a href="#" class="blockPost" action="unblock" userId="${userId}">Unblock Posts</a></b>`);
				$('div.bts', this).html('<center><b><span style="color:#d65a5a;">Post from that user are hidden</style></b></center>');
			} else{
				$('dd > div > div.bc1.upc > div.desc.cl.rc > div.fR.links', this).prepend(`<b><a href="#" class="blockPost" action="block" userId="${userId}">Block Posts</a></b>`);
			}
        }
    });

    $('.blockPost').click(function(){
    	var 		blockedUser = GM_getValue('fokse_post_blocker_userlist'),
    				userId		= $(this).attr('userId');

    	if ($(this).attr('action') == "block" && !~blockedUser.indexOf(userId)){
    			blockedUser.push(userId);
    	}
    	else if ($(this).attr('action') == "unblock" && ~blockedUser.indexOf(userId)){
    			blockedUser.splice(blockedUser.indexOf(userId),1);   		
    	}

    	
    	GM_setValue("fokse_post_blocker_userlist", blockedUser);
        location.reload();
    })

}

parsePage();






