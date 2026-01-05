// ==UserScript==
// @name        KAT - Social group requests
// @namespace   SGR
// @version     1.00
// @description Allows you to accept/deny all social group requests with a single click
// @match       https://kat.cr/community/socialgroups/requests/*
// @downloadURL https://update.greasyfork.org/scripts/12321/KAT%20-%20Social%20group%20requests.user.js
// @updateURL https://update.greasyfork.org/scripts/12321/KAT%20-%20Social%20group%20requests.meta.js
// ==/UserScript==


$('<button id="acceptReqs" class="accept icon16 textButton" style="padding:0px 5px; margin-left:10px;"><span></span>Accept all</button>').appendTo(".mainpart table tbody tr td h2");
$('<button id="rejectReqs" class="reject icon16 textButton" style="padding:0px 5px; margin-left:10px;"><span></span>Reject all</button>').appendTo(".mainpart table tbody tr td h2");

function confirmRequests()
{
    $("button[id$='Reqs']").attr("disabled", "disabled");
    $("button[id$='Reqs']").css("background", "grey");
    var action = ($(this).hasClass("accept")) ? "1" : "0";
    var groupID = window.location.href.split("=")[1];
    if (groupID === undefined) { }
    else
    {
        $(".data tbody tr form").each(function()
        { 
            var tr = $(this).parent().parent();
            var id = $(this).children().val();
            $.post( "/community/socialgroups/requests/", { user_id : id, group : groupID, allow: action })
            .done(function( data ) 
            {
                $(tr).fadeOut();
            });
        });
        $("button[id$='Reqs']").removeAttr("disabled");
        $("button[id$='Reqs']").css("background", "#c1ad6a");
    }
}

$("button[id$='Reqs']").click(confirmRequests);