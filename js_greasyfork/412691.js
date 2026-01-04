// ==UserScript==
// @name           Comments Editor (DW)
// @description    HTML helper for comments on dreamwidth.org
// @match          *://*.dreamwidth.org/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant          GM_addStyle
// @version        1.3
// @namespace https://greasyfork.org/users/150898
// @downloadURL https://update.greasyfork.org/scripts/412691/Comments%20Editor%20%28DW%29.user.js
// @updateURL https://update.greasyfork.org/scripts/412691/Comments%20Editor%20%28DW%29.meta.js
// ==/UserScript==

$.noConflict();
jQuery(document).ready(function($) {

    $("textarea").each(function(id, obj) {
        if ($(obj).attr("name") == "body") {
            var outfield = "<div id='comment-preview'><div id='output'></div></div>";


            if ($(obj).hasClass("b-updateform-textarea")) {
                if ($(obj).hasClass("b-spelling-textarea")) {
                    $(".b-spelling").after(outfield);
                    add_buttons($(".b-updateform-buttons-firstsection"), "short");
                } else {
                    $(obj).after(outfield); //
                    add_buttons(obj, "full");
                }
            } else {
                $(obj).after(outfield); //
                add_buttons(obj, "full");
            }
            $(obj).keydown(update).keyup(update).mousedown(update).mouseup(update).mousemove(update);
        }

    })



    function add_buttons(obj, type) {
        var enable_buttons = true;

        $("form").each(function(id, obj) {
            if ($(obj).attr("name") == "supportForm") {
                enable_buttons = false;
            }
        });

        var elem_tag = "span"; // button
        var str = "<div id='mybuttons' class='buttonsSet'>";
        str += "<button place='&lt;b&gt;^^&lt;/b&gt;'><b>B</b></button> ";
        str += "<button place='&lt;i&gt;^^&lt;/i&gt;'><i>I</i></button> ";
        str += "<button place='&lt;s&gt;^^&lt;/s&gt;'><s>&nbsp;S&nbsp;</s></button> "
        str += "<button place='&lt;code&gt;^^&lt;/code&gt;'>&nbsp;&lt;code&gt;&nbsp;</button> "
        str += "<button place='&lt;i&gt;&gt; ^^&lt;/i&gt;'>quote</button> ";
        str += "<button place='&lt;img src=\"^^\"&gt;'>img</button> ";
        str += "<button place='&lt;a href=\"\"&gt;^^&lt;/a&gt;'><u>link</u></button> ";
        str += "</div>";

        var str_short = "<li class='b-updateform-buttons-item custom-item'><span place='<i><font color=#336699>> ^^</font></i>'><b style='font-size: 13px; cursor: pointer'>Quote</b></span> </li>";
        str_short += "<li class='b-updateform-buttons-item custom-item'><span place='<lj-spoiler>^^</lj-spoiler>'><b style='font-size: 13px; cursor: pointer'>[Spoiler]</b></span></li>";

        if (enable_buttons == true) {
            if (type == "short") {
                str = str_short;
                $(obj).append(str);
            } else {
                $(obj).before(str);
            }
        }

        $('.custom-item span,.buttonsSet button').click(function() { ///.buttonsSet button,
            test_replace($(this).attr('place'));
            return false;
        });
    }


    function test_replace(patt) {
        var elem = $("textarea#body,textarea#commenttext,textarea.textbox");
        var elem_value = $(elem).val();
        var text_lenght = $(elem)[0].selectionEnd - $(elem)[0].selectionStart;

        var text_start = elem_value.substr(0, $(elem)[0].selectionStart);
        var text_end = elem_value.substr($(elem)[0].selectionEnd, $(elem).val().length);

        var text_src = elem_value.substr($(elem)[0].selectionStart, text_lenght);
        var text_replace = patt.replace("^^", text_src);
        var text_result = text_start + text_replace + text_end;

        $(elem).val(text_result);
        return false;
    }
});