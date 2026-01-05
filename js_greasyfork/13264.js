// ==UserScript==
// @name         KAT - Add SGs
// @namespace    ADD_SGs
// @version      1.02
// @description  Adds dropdown with list of social groups you're a member of to the 'Social Groups' button
// @match        https://kat.cr/community/*
// @downloadURL https://update.greasyfork.org/scripts/13264/KAT%20-%20Add%20SGs.user.js
// @updateURL https://update.greasyfork.org/scripts/13264/KAT%20-%20Add%20SGs.meta.js
// ==/UserScript==

$.ajax(
{
    url: "https://kat.cr/community/socialgroups/user/?json=1",
    method: "GET",
    dataType: "json",
    success: function (data) 
    {
        $('<ul class="dp-right dropdown" id="sgList"></ul>').appendTo(".tabNavigation li:eq(1)");
        json = jQuery.parseJSON(data.html).html;
        var groups = $.map(json, function (el) 
        {
            $('<li><a href="' + el.link + '">' + el.title + '</a></li>').appendTo("#sgList");
        });

        var maxLength = 0;

        $(".tabNavigation li .dropdown li a").each(function()
        {
            var thisLength = $(this).text().length;
            if (thisLength > maxLength) maxLength = thisLength;
        });

        var newWidth = Math.round(maxLength * 9);

        if ((window.location.href.split("/").length == 6 && window.location.href.split("/")[4] != "socialgroups") || (window.location.href.split[4] = "user")) 
        { 
            if ($("#hidesidebar").is(":visible")) { $(".tabNavigation li .dp-right ").css("right", "256px"); }
            else { $(".tabNavigation li .dp-right ").css("right", "10px"); }
            $("#hidesidebar").click(function(){ $(".tabNavigation li .dp-right ").css("right", "10px"); });
            $("#showsidebar").click(function(){ $(".tabNavigation li .dp-right ").css("right", "256px"); });
        }
        else { $(".tabNavigation li .dp-right ").css("right", "0px"); }

        $(".tabNavigation li .dp-right ").css(
            {
                'min-width': '60px',
                'width': newWidth + "px"
            });

        $(".tabNavigation li .dropdown").css(
            {
                'display': 'none',
                'position': 'absolute',
                'transition': '0.1s all',
                'background': '#594c2d',
                'padding': '5px 20px 0 5px',
                'z-index': '200',
                'border-radius': '0 0 3px 3px'
            }); 

        $(".tabNavigation li .dropdown li ").css(
            {
                'float': 'left',
                'margin-bottom': '3px'
            });

        $(".tabNavigation li .dropdown li a").css(
            {
                'min-width': '60px',
                'width': (newWidth + 15) + "px",
                'overflow': 'hidden',
                'height': '34px',
                'line-height': '36px',
                'background': '#594c2d',
                'border-radius': '3px',
                'border-top': 'none',
                'padding': '0 0 0 5px',
                'box-sizing': 'border-box',
                'text-align': 'left',
                'color': '#ffeeb4',
                'text-shadow': '0px 1px 2px rgba(0, 0, 0, 0.6)',
                'font-size': '11px',
                'font-weight': '600'
            });

        $(".tabNavigation li").hover(
            function() 
            {
                $(this).find(".dropdown").show();
            },
            function() 
            {
                $(this).find(".dropdown").hide();
            });

        $(".tabNavigation li .dropdown li a").hover(
            function() 
            {
                $(this).css("background", "#2c240f");
            },
            function() 
            {
                $(this).css("background", "#594c2d");
            });
    },
    error: function () 
    {
        console.log("Could not get social group list");
    }
});