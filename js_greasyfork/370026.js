// ==UserScript==
// @name         HD Quick Mobile
// @namespace    HD Quick Mobile
// @version      1.0
// @description  Quick Response + Quote Selected
// @author       Boltex
// @match        http://hdbits.org/*
// @match        https://hdbits.org/*
// @require      http://code.jquery.com/jquery-1.11.2.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370026/HD%20Quick%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/370026/HD%20Quick%20Mobile.meta.js
// ==/UserScript==

$(document).ready(function()
{
    //-------------------------- QUOTE SELECTED SCRIPT -------------------------//

    // Add required function
    function getSelectionText() { var text = ""; if (window.getSelection) { text = window.getSelection().toString(); } else if (document.selection && document.selection.type != "Control") { text = document.selection.createRange().text; } return text; }

    // Add "Quote+" link to each post
    $('a').each(function()
    {
        var url = $(this).attr("href");
        if( typeof url != "undefined" && url.indexOf("quotepost") > -1 )
        {
            $('<span>[</span><a class="quotePlus" href="javascript:void()" style="cursor:pointer; text-decoration:underline;" title="Quote Selected Text"><b>Quote+</b></a><span>]</span>').appendTo( $(this).parent() );
        }
    });

    // Add "Quote+ click trigger"
    $('.quotePlus').click(function()
    {
        var txt = getSelectionText();
        var user = $(this).parent().find('a:nth(1)').text();
        var body = $('#body').val();
        $('#body').val( body + '[QUOTE='+user+']' + txt + '[/QUOTE]');
    });


    //-------------------------- RESPONSE SCRIPT -------------------------//

    // Add JS functions from response page (BBCode, emoticons etc.)
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://dl.dropboxusercontent.com/u/51459616/hd_function.js";
    document.getElementsByTagName('head')[0].appendChild(script);

    // Get topicID
    var topicID = $('a.js-watchtopic').attr('data-id');

    // Response Form HTML code
    var strVar="";
    strVar += "<tr><td class=\"embedded\">";
    strVar += "<table width=\"100%\" cellspacing=\"0\" cellpadding=\"10\" border=\"1\"><tbody><tr><td align=\"center\">";
    strVar += "<form name=\"compose\" method=\"post\" action=\"\/forums\/post\"><input name=\"topicid\" value=\""+topicID+"\" type=\"hidden\">";
    strVar += "<table class=\"message\" cellspacing=\"0\">";
    strVar += "<tbody><tr><td class=\"rowhead\" style=\"padding: 3px\">Body<\/td><td style=\"padding: 0px\" align=\"left\">";
    strVar += "";
    strVar += "  <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">";
    strVar += "    <tbody><tr>";
    strVar += "      <td class=\"embedded\" colspan=\"2\">";
    strVar += "      <table cellspacing=\"1\" cellpadding=\"2\">";

    strVar += "      <\/table>";
    strVar += "      <\/td>";
    strVar += "    <\/tr>";
    strVar += "    <tr>";
    strVar += "      <td class=\"embedded\">";
    strVar += "      <textarea name=\"body\" id=\"body\" rows=\"10\" cols=\"34\"><\/textarea>";
    strVar += "      <div id=\"displayarea\" class=\"previewbox\">";
    strVar += "      <\/div><\/td>";

    strVar += "<tr><td colspan=\"2\" style=\"padding: 3px\" align=\"center\"><input class=\"btn\" value=\"Submit\" onclick=\"$j(this).css('visibility','hidden');\" type=\"submit\"><\/td><\/tr><\/tbody><\/table>";
    strVar += "<\/form><\/td><\/tr><\/tbody><\/table>";
    strVar += "";
    strVar += "<\/td><\/tr>";

    $(strVar).appendTo('.std-content:first');
});