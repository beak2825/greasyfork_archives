// ==UserScript==
// @name        KAT - Close on Confirm
// @namespace   CoC
// @version     1.01
// @description Prompts closing on confirming request submission
// @match       https://kat.cr/request/pending/*
// @match       https://kat.cr/request/show/*
// @match       https://sandbox.kat.cr/request/pending/*
// @match       https://sandbox.kat.cr/request/show/*
// @downloadURL https://update.greasyfork.org/scripts/12325/KAT%20-%20Close%20on%20Confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/12325/KAT%20-%20Close%20on%20Confirm.meta.js
// ==/UserScript==

$(".ka-accept").click(function()
{
    var id = $(this).parent().attr("data-requestid");
    if ($("#request_"+id+" .submitActions").length == 1)
    {
        if (confirm("Close request and prevent new submissals?")) 
        {
            $.post( "/request/confirm/" + id + "/");
        }
    }
    else
    {
        console.log($("#request_"+id+" .submitActions").length);
    }
});