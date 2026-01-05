// ==UserScript==
// @name        KAT - Open Chat
// @namespace   OpenChat
// @version     1.02
// @description Allows you to open a chat by entering in a username.
// @match https://kat.cr/messenger/chat/
// @downloadURL https://update.greasyfork.org/scripts/10950/KAT%20-%20Open%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/10950/KAT%20-%20Open%20Chat.meta.js
// ==/UserScript==

window.setTimeout(function() 
{
    if ($(".barUser").length != 0)
    {
        $("#chat-bar-full").append('<li class="barUser bar-userMobile"><input id="oc_username" placeholder="Enter username here" /></li><li> <input type="button" id="oc_submit" value="Open" /></li>');
    }
    else
    {
        $(".mainpart").append('<input id="oc_username" placeholder="Enter username here" /> <input type="button" id="oc_submit" value="Open" />');
    }    
    
    $("#oc_submit").on("click", function()
    {
        $.get( "/user/" + $("#oc_username").val() + "?ajax=1").success(function( data ) {
            var html = data.html;
            var hashIndex = html.indexOf("bookmarks/add/user/") + 19; 
            if (hashIndex != 18)
            {
                var hash = html.slice(hashIndex, hashIndex + 32);
                console.log(hash);
                $(".mainpart").append('<a class="imessage chat" rel="' +  hash + '" title="open chat"><i class="ka ka16 ka-message" style="display:none"></i></a>');
                $(".ka-message").click();
                location.reload();
            }
        }).error(function(){
                alert('Invalid user');    
        });
    });
    
    $("#oc_username").keyup(function (e) {
    if (e.keyCode == 13)
    {
        $("#oc_submit").trigger("click");
    }
});
    
}, 1000);