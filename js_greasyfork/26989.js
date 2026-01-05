// ==UserScript==
// @name         Respawn All Black list
// @namespace    
// @version      0.1
// @description  Permet de blacklister tous les gens d'un topic
// @author       Craftbukkit
// @require      http://code.jquery.com/jquery-2.2.0.min.js
// @match        http://www.jeuxvideo.com/forums/42-*
// @match        http://www.jeuxvideo.com/forums/1-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26989/Respawn%20All%20Black%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/26989/Respawn%20All%20Black%20list.meta.js
// ==/UserScript==
var listeblacklist = new Array();
var url = document.location.href;
var code = document.body.innerHTML.split('ajax_hash_preference_user" value="')[1].split('"')[0];
var j = 1;

function final() {
    listeblacklist.forEach(function(e) {
        $.get("http://www.jeuxvideo.com/forums/ajax_forum_blacklist.php?id_alias_msg="+e+"&action=add&ajax_hash="+code);
    });
    alert("fini");
}

function addBlacklist(page) {
        var next = page.split('id_topic = ')[1].split(';')[0];
        var newurl = page.split('<link href="//')[1].split('.htm')[0].split(next)[1].split('-')[1];
        if((Number(newurl)+1) == j || j == 1) {
        var liste = page.split('data-id-alias="').length;
        for(var i = 0; i < liste-1; i++) {
            listeblacklist[page.split('data-id-alias="')[i+1].split('"')[0]] = page.split('data-id-alias="')[i+1].split('"')[0];
        }
        var next = page.split('id_topic = ')[1].split(';')[0];
        j++;
        var nexturl = url.split(next)[0]+next+"-"+j+"-0-1-0-ddd.htm";
        $.get(nexturl, function(data){addBlacklist(data);});
    } else {
        final();
    }
}

function letsgo() {
    $.get(url, function(data){addBlacklist(data);});
}

document.getElementsByClassName("group-two")[0].innerHTML += '<a href="#" class="tamere"><span class="btn btn-actu-new-list-forum">Blacklist</span></a>';
document.getElementsByClassName("tamere")[0].addEventListener("click", function() { letsgo(); }, false);