// ==UserScript==
// @name        KAT - Go To Page
// @namespace   GoToPage
// @version     1.03
// @description Allows you to go to any page number
// @match       https://kat.cr/*
// @match       https://sandbox.kat.cr/*
// @downloadURL https://update.greasyfork.org/scripts/12068/KAT%20-%20Go%20To%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/12068/KAT%20-%20Go%20To%20Page.meta.js
// ==/UserScript==

function goToPage()
{
    console.log("skipping");
    $("#skipToPage").focus();
    var url =  $(".pages a:last").attr("href") || window.location.href;
    var page = $("#skipToPage").val();
    if (page < 1 || page > $("#skipToPage").attr("max"))
    {
        alert("Invalid page");
    }
    else
    {
        if (url.search("page=") != -1)
        {
            url = url.replace(/page=\d+/, "page=" + page);
        }
        else if (url.search("\/(\d+\/)?\?") != -1)
        {
            url = url.replace(/\/(\d+\/)?\?/, "/" + page + "/?");
        }
        else
        {
            $("#skipSubmit").css("background", "grey");
            $("#skipSubmit").off("click");
            url = "#";
            console.log("Error: failed to change page");
        }
        console.log(url);
        window.location.assign(url);
    }
}

$( document ).ready(function() 
{
    $('<input id="skipToPage" class="floatleft" type="number" min="1" max="1" value="1" /><a class="siteButton" id="skipSubmit" style="padding:4px 10px; margin:0px 7px 0px 5px;">Go</a></div>').prependTo(".pages[class*='botmarg5px']:first");
    var pageCount = $(".pages:last a:last").text();
    $("#skipToPage").attr("value", $(".pages:last .active").text());
    $("#skipToPage").attr("max", pageCount);    
    $("#skipSubmit").click(goToPage);
    $("#skipToPage").on( 'keydown', function ( evt ) {
        if( evt.keyCode == 13 ) $("#skipSubmit").trigger("click");
        else if (evt.keyCode == 8); // Backspace, allow 
        else if (evt.keyCode < 48 || evt.keyCode > 57) evt.preventDefault();        
    }); 
    $("#skipToPage").change(function()
    { 
        $("#skipToPage").val($(this).val()); 
    });
    // Has only been done this way as jquery created a single object, meaning that if there are two sets of page links, the second has no updated attributes or event 
    if ($(".pages[class*='botmarg5px']").length == 2) 
    {
        $("#skipToPage").clone(true).prependTo(".pages:last");
        $("#skipSubmit").clone(true).prependTo(".pages:last");
    }
});