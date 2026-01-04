// ==UserScript==
// @name         Topic and Post remover
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Removes posts and topics if user ID of author/post author is in bannedUsers. You add more users by using this format = ["id","id","id"] etc.
// @author       Ehmmkay
// @include   https://forums.d2jsp.org/topic.php?t=*&f=*
// @include	  https://forums.d2jsp.org/topic.php?t=*
// @include	  https://forums.d2jsp.org/post.php
// @include	  https://forums.d2jsp.org/forum.php?f=104
// @icon      https://www.google.com/s2/favicons?domain=d2jsp.org
// @require https://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432811/Topic%20and%20Post%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/432811/Topic%20and%20Post%20remover.meta.js
// ==/UserScript==
 
var bannedUsers = [""];
 
function parsePosts(){
    $('dl').each(function(){
        if (typeof $('dt a', this).attr('href') !== 'undefined' && ~$('dt > a', this).attr('href').indexOf('user.php?i=')) {
            var userId = $('dt > a', this).attr('href').split("=")[1];
            if(bannedUsers.indexOf(userId) !== -1){
                 this.remove()
            }
        }
    });
    }
 
function parseTopics(){
    $('tr').each(function(){
        if (typeof $('td:nth-child(3) a', this).attr('href') !== 'undefined' && ~$('td:nth-child(3) a', this).attr('href').indexOf('user.php?i=')){
            var userId = $('td:nth-child(3) a', this).attr('href').split("=")[1];
            if(bannedUsers.indexOf(userId) !== -1){
                 this.remove()
            }
        }
    });
}
 
parsePosts();
parseTopics();