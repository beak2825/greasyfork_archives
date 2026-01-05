// ==UserScript==
// @name            Understalker's Custom Add to Group (Echo)
// @namespace       Snorlax
// @description     Adds people to groups
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @include         *hackforums.net/member.php?action=profile&uid=*
// @version         1.2
// @downloadURL https://update.greasyfork.org/scripts/10076/Understalker%27s%20Custom%20Add%20to%20Group%20%28Echo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/10076/Understalker%27s%20Custom%20Add%20to%20Group%20%28Echo%29.meta.js
// ==/UserScript==

var uid = $(location).attr('href').replace(/[^0-9]/g, '')
var name = $("span[class*='group']").text();

if($("img[src*='echo2']").length >= 1) {
    $("span[class*='group']").after(' - <button class="remove button">Remove</button>');
} else {
    $("span[class*='group']").after(' - <button class="add button">Add</button>');
}

$(".add").click(function(){
    $.post("http://www.hackforums.net/managegroup.php",
    {
        "my_post_key": my_post_key,
        "action": "do_add",
        "gid": "21",
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
        "gid": "21",
        "removeuser[0]": uid
    },
        function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        location.reload();
    });
});