// ==UserScript==
// @name            Hack Forums Add to Group - Brotherhood Mod
// @namespace       Originally Snorlax - Modded by Roger Waters for The Brotherhood
// @description     Adds people to groups
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @include         *hackforums.net/member.php?action=profile&uid=*
// @version         1.3.2
// @downloadURL https://update.greasyfork.org/scripts/5476/Hack%20Forums%20Add%20to%20Group%20-%20Brotherhood%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/5476/Hack%20Forums%20Add%20to%20Group%20-%20Brotherhood%20Mod.meta.js
// ==/UserScript==

var uid = $(location).attr('href').replace(/[^0-9]/g, '')
var name = $("span[class*='group']").text();

if($("img[src*='brotherhood']").length >= 1) {
    $("span[class*='group']").after(' - <button class="remove button">Remove from The Brotherhood</button>');
} else {
    $("span[class*='group']").after(' - <button class="add button">Add to The Brotherhood</button>');
}

$(".add").click(function(){
    $.post("http://www.hackforums.net/managegroup.php",
    {
        "my_post_key": my_post_key,
        "action": "do_add",
        "gid": "54",
        "username": name
    },
        function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        location.reload();
    });
});

$(".remove").click(function(){
    $.post("http://www.hackforums.net/managegroup.php",
    {
        "my_post_key": my_post_key,
        "action": "do_manageusers",
        "gid": "54",
        "removeuser[0]": uid
    },
        function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        location.reload();
    });
});