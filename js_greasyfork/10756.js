// ==UserScript==
// @name Add User to Watch
// @description Adds a user to the "User to Watch" thread.
// @version 1.1
// @include http://myanimelist.net/profile/*
// @author Ghost
// @namespace https://greasyfork.org/users/10763
// @downloadURL https://update.greasyfork.org/scripts/10756/Add%20User%20to%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/10756/Add%20User%20to%20Watch.meta.js
// ==/UserScript==

//Gets the profile url
var profilelink = document.URL;
var userurl = profilelink;
var addUserToWatch = function() {

    var linksub = profilelink.match(/profile\/.+\//g);

    if (linksub !== null) {
        var profilelinksub = linksub.toString().replace(/\/$/g,'');
        this.userurl = profilelink.replace(/profile\/.+/g, profilelinksub);
    }

    // Gets the user nick.
    var username = userurl.replace(/(http:\/\/myanimelist.net\/profile\/)|(\/.+)/g, '');

    // Gets the user ID.
    var useridurl = document.getElementById("profileRows").getElementsByTagName("a")[3].getAttribute("href");
    var userid = useridurl.replace(/\S+id=/, '');

    // Adds the "User to Watch" anchor to the list below the display picture.
    $('#profileRows').append('<a id="utwprompt">Add to Users to Watch</a>');

    // Creates an EventListener on the "User to Watch" anchor with a prompt that contains the text to copy.
    //document.getElementById("utwprompt").onclick = function() {prompt("Copy", "[b][url=" + userurl + "]" + username.replace(/\/\w+$/m, '') + "[/url][/b] id = " + userid + "\n\n[spoiler][/spoiler]");};
    //
    
    var bla = "[b][url=" + userurl + "]" + username.replace(/\/\w+$/m, '') + "[/url][/b] id = " + userid + "\n\n[spoiler][/spoiler]";
    $('#profileRows').append('<div id="box" style="display: none; position: fixed; border: thin solid black; background-color: #e1e7f5; top: 45%; left: 30%; height: 140px; width: 600px; overflow: auto; overflow-y:hidden; overflow-x:hidden;"><textarea name="name" row="4" col="450" style="height: 100px; width: 580px; margin: 7px 7px 2px 7px !important;"></textarea><input type="button" name="close" value="Close" style=" position: relative; left: 542px;"></div>');
    $('textarea[name="name"]').val(bla);
    
    
    $('#utwprompt , input[name="close"]').click(function(){
        $('#box').toggle('display'); 
    });
    
    /*var jqajax = $.ajax({
        method: "POST",
        url: 'http://myanimelist.net/forum/?action=message&topic_id=900959',
        contentType: 'application/x-www-form-urlencoded',
        data: "msg_text=test&submit=Post+Message+&board_id=900959"
    });
    jqajax.done(function( msg ) {
        alert( "Data Saved: " + msg );
    });*/
    //var xh = new XMLHttpRequest();
    //xh.open("POST", "http://myanimelist.net/includes/ajax.inc.php?t=82" , true);
    //xh.send();
    
};

if (document.readyState==="complete") addUserToWatch();
else if (document.readyState==="loading") {
	if (window.addEventListener) window.addEventListener("DOMContentLoaded",addUserToWatch,false);
	else if (window.attachEvent) window.attachEvent("onload",addUserToWatch);
} else {
	if (window.addEventListener) window.addEventListener("load",addUserToWatch,false);
	else if (window.attachEvent) window.attachEvent("onload",addUserToWatch);
}