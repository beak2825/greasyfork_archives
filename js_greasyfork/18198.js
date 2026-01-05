// ==UserScript==
// @name         KAT - Put In Process
// @namespace    PutInProcess
// @version      1.01
// @description  Add a button to put a user in process in on tier1 / tier2
// @match        https://*kat.cr/moderator/verify/*
// @downloadURL https://update.greasyfork.org/scripts/18198/KAT%20-%20Put%20In%20Process.user.js
// @updateURL https://update.greasyfork.org/scripts/18198/KAT%20-%20Put%20In%20Process.meta.js
// ==/UserScript==

$('<a title="Put user in process" class="processAjax" style="margin-right:4px" ><i class="ka ka16 ka-lock"></i></a>').insertBefore('.lasttd > a:first-child[title="Accept"]');

$('.processAjax').click(putInProcess);

var messageContent = "[center][img]https://kat.cr/content/images/logos/kickasstorrents_128x128.png[/img] <br> - [url=https://kat.cr/rules][b][color=blue]Kickass Site Rules[/color][/b][/url] -<br><br>[img]http://i.imgur.com/8Cuqp2n.png[/img]<br><br>[url=https://kat.cr/community/show/so-you-want-be-verified-uploader-v3/][color=blue][b]Want to be a VUL? [/b][/color][/url]<br><br>[img]http://i.imgur.com/8Cuqp2n.png[/img]<br> <br>Hello,<br><br>[b]Just To inform you:<br>[/b]<br>[b][color=blue]I am about to start your Verified Uploader Application![/color]<br><br>[color=Purple]This Process can take upto[/color] [color=red][u]7 Days[/u][/color][color=Purple] to Complete![/color][/b]<br><br>Please Ensure you Seed all your Torrents!<br><br>[b]Be Patient:[/b]<br>While i Work on your Request,<br>have a Read of the Threads Linked at the top of this message!<br><br>[b]Good Luck[/b]<br><br>i will be in Touch as Soon as i am Done!<br><br>[img]http://i.imgur.com/8Cuqp2n.png[/img]<br><br>[rules]<br><br>[img]http://i.imgur.com/8Cuqp2n.png[/img]<br><br>[img]https://yuq.me/users/27/170/foXGz26y1M.png[/img][/center]";

function putInProcess()
{
    var id = $(this).parent().find('a[href^="/moderator/eventlog/user/"]').attr("href").split("/")[4];
    var el = $(this);
    
    $.ajax(
    {
        url: "/moderator/process/user/?id=" + id,
        beforeSend: function()
        {
            $('<img class="ajaxLoad-' + id + '" src="//kastatic.com/images/indicator.gif" style="margin-right:4px; position:relative; top:2px;" alt="loading"/>').insertBefore(el);
            $(el).hide();
        }
    }).done(function()
    {
        if (window.location.pathname != "/moderator/verify/tier1/")
        {
            var user = $(el).parent().parent().find('a[href^="/user/"]').attr("href").split("/")[2];
            $('<a rel="nofollow" href="/messenger/create/' + user + '/?text=' + messageContent + '" title="send VUL application message" class="ajaxLink imessage" style="margin-right:4px" target="_blank"><i class="ka ka16 ka-message"></i></a>').insertBefore(el);
            $(el).remove();
        }
        else
        {
            $(el).children().addClass("ka-disabled");
            $(el).children().attr("title", "In process by " + katUser.nickname);
            $(el).off("click");
        }
    })
    .always(function()
    {
        $('.ajaxLoad-' + id).remove();
        $(el).show();  
    });
}