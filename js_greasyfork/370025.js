// ==UserScript==
// @name         HD Quick
// @namespace    HD Quick
// @version      1.0
// @description  Quick Response + Quote Selected
// @author       Boltex
// @match        http://hdbits.org/*
// @match        https://hdbits.org/*
// @require      http://code.jquery.com/jquery-1.11.2.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370025/HD%20Quick.user.js
// @updateURL https://update.greasyfork.org/scripts/370025/HD%20Quick.meta.js
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
    strVar += "      <tbody><tr>";
    strVar += "      <td class=\"embedded\"><input name=\"stripper\" value=\"STRIP ASCII\" onclick=\"strip('body')\" type=\"button\"><\/td>";
    strVar += "      <td class=\"embedded\"><input style=\"font-weight: bold;\" name=\"bold\" value=\"B \" onclick=\"javascript: BBTag('[b]','bold','body','compose')\" type=\"button\"><\/td>";
    strVar += "      <td class=\"embedded\"><input style=\"font-style: italic;\" name=\"italic\" value=\"I \" onclick=\"javascript: BBTag('[i]','italic','body','compose')\" type=\"button\"><\/td>";
    strVar += "      <td class=\"embedded\"><input style=\"text-decoration: underline;\" name=\"underline\" value=\"U \" onclick=\"javascript: BBTag('[u]','underline','body','compose')\" type=\"button\"><\/td>";
    strVar += "      <td class=\"embedded\"><input name=\"li\" value=\"List \" onclick=\"javascript: BBTag('[*]','li','body','compose')\" type=\"button\"><\/td>";
    strVar += "      <td class=\"embedded\"><input name=\"quote\" value=\"QUOTE \" onclick=\"javascript: BBTag('[quote]','quote','body','compose')\" type=\"button\"><\/td>";
    strVar += "      <td class=\"embedded\"><input name=\"url\" value=\"URL \" onclick=\"javascript: BBTag('[url]','url','body','compose')\" type=\"button\"><\/td>";
    strVar += "      <td class=\"embedded\"><input name=\"img\" value=\"IMG \" onclick=\"javascript: BBTag('[img]','img','body','compose')\" type=\"button\"><\/td>";
    strVar += "      <td class=\"embedded\"><input name=\"hide\" value=\"HIDE \" onclick=\"javascript: BBTag('[hide]','hide','body','compose')\" type=\"button\"><\/td>";
    strVar += "      <td class=\"embedded\"><input name=\"spoiler\" value=\"SPOILER \" onclick=\"javascript: BBTag('[spoiler]','spoiler','body','compose')\" type=\"button\"><\/td>";
    strVar += "      <td class=\"embedded\"><input name=\"center\" value=\"Center \" onclick=\"javascript: BBTag('[center]','center','body','compose')\" type=\"button\"><\/td>";
    strVar += "      <td class=\"embedded\">&nbsp;<a href=\"javascript:%20PopMoreTags('compose','body')\">More Tags<\/a><\/td>";
    strVar += "      <\/tr>";
    strVar += "      <\/tbody><\/table>";
    strVar += "      <\/td>";
    strVar += "    <\/tr>";
    strVar += "    <tr>";
    strVar += "      <td class=\"embedded\">";
    strVar += "      <textarea name=\"body\" id=\"body\" rows=\"15\" cols=\"125\"><\/textarea>";
    strVar += "      <div id=\"displayarea\" class=\"previewbox\">";
    strVar += "      <\/div><\/td>";
    strVar += "      <td class=\"embedded\">";
    strVar += "      <table cellspacing=\"1\" cellpadding=\"3\">";
    strVar += "      <tbody><tr>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':-)','compose','body')\"><img src=\"/pic\/smilies\/smile1.gif\" alt=\"smile1.gif\" border=\"0\"><\/a><\/td>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':smile:','compose','body')\"><img src=\"/pic\/smilies\/smile2.gif\" alt=\"smile2.gif\" border=\"0\"><\/a><\/td>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':-D','compose','body')\"><img src=\"/pic\/smilies\/grin.gif\" alt=\"grin.gif\" border=\"0\"><\/a><\/td>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':lol:','compose','body')\"><img src=\"/pic\/smilies\/laugh.gif\" alt=\"laugh.gif\" border=\"0\"><\/a><\/td><\/tr><tr>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':w00t:','compose','body')\"><img src=\"/pic\/smilies\/w00t.gif\" alt=\"w00t.gif\" border=\"0\"><\/a><\/td>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':-P','compose','body')\"><img src=\"/pic\/smilies\/tongue.gif\" alt=\"tongue.gif\" border=\"0\"><\/a><\/td>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(';-)','compose','body')\"><img src=\"/pic\/smilies\/wink.gif\" alt=\"wink.gif\" border=\"0\"><\/a><\/td>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':-|','compose','body')\"><img src=\"/pic\/smilies\/noexpression.gif\" alt=\"noexpression.gif\" border=\"0\"><\/a><\/td><\/tr><tr>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':-\/','compose','body')\"><img src=\"/pic\/smilies\/confused.gif\" alt=\"confused.gif\" border=\"0\"><\/a><\/td>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':-(','compose','body')\"><img src=\"/pic\/smilies\/sad.gif\" alt=\"sad.gif\" border=\"0\"><\/a><\/td>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':\'-(','compose','body')\"><img src=\"/pic\/smilies\/cry.gif\" alt=\"cry.gif\" border=\"0\"><\/a><\/td>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':weep:','compose','body')\"><img src=\"/pic\/smilies\/weep.gif\" alt=\"weep.gif\" border=\"0\"><\/a><\/td><\/tr><tr>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':-O','compose','body')\"><img src=\"/pic\/smilies\/ohmy.gif\" alt=\"ohmy.gif\" border=\"0\"><\/a><\/td>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':o)','compose','body')\"><img src=\"/pic\/smilies\/clown.gif\" alt=\"clown.gif\" border=\"0\"><\/a><\/td>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT('8-)','compose','body')\"><img src=\"/pic\/smilies\/cool1.gif\" alt=\"cool1.gif\" border=\"0\"><\/a><\/td>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':thumb:','compose','body')\"><img src=\"/pic\/smilies\/thanky.png\" alt=\"thanky.png\" border=\"0\"><\/a><\/td><\/tr><tr>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':innocent:','compose','body')\"><img src=\"/pic\/smilies\/innocent.gif\" alt=\"innocent.gif\" border=\"0\"><\/a><\/td>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':whistle:','compose','body')\"><img src=\"/pic\/smilies\/whistle.gif\" alt=\"whistle.gif\" border=\"0\"><\/a><\/td>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':unsure:','compose','body')\"><img src=\"/pic\/smilies\/unsure.gif\" alt=\"unsure.gif\" border=\"0\"><\/a><\/td>";
    strVar += "<td class=\"embedded\" style=\"padding: 3px; margin: 2px\"><a href=\"javascript:%20SmileIT(':closedeyes:','compose','body')\"><img src=\"/pic\/smilies\/closedeyes.gif\" alt=\"closedeyes.gif\" border=\"0\"><\/a><\/td><\/tr>      <\/tbody><\/table>";
    strVar += "      <\/td>";
    strVar += "    <\/tr>";
    strVar += "  <\/tbody><\/table>";
    strVar += "<\/td><\/tr><tr><td><\/td><td><label><input name=\"watchtopic\" value=\"1\" type=\"checkbox\">Watch this topic<\/label><\/td><\/tr><tr><td colspan=\"2\" style=\"padding: 3px\" align=\"center\"><input class=\"btn\" value=\"Submit\" onclick=\"$j(this).css('visibility','hidden');\" type=\"submit\"><\/td><\/tr><\/tbody><\/table>";
    strVar += "<\/form><\/td><\/tr><\/tbody><\/table>";
    strVar += "";
    strVar += "<\/td><\/tr>";

    $(strVar).appendTo('.std-content:first');
});