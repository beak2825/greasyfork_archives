// ==UserScript==
// @name         Gab.ai User Info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Pop-up of user info on hover of mention or username link
// @author       You
// @match        https://gab.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26863/Gabai%20User%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/26863/Gabai%20User%20Info.meta.js
// ==/UserScript==

itvout = -1;

$(document).ready(function()
{
    setInterval(setupLinks, 500);
});
    

function setupLinks()
{
    if($("a.inner-post-mention, a.post__meta__name__username").not(".hover-info").length > 0)
    {
        $("a.inner-post-mention, a.post__meta__name__username").not(".hover-info").each(function(){
            $(this).on("mouseleave", function(){
               $("#badge").remove();
               $("a.hover-info").removeClass("hover-info");
            });
            $(this).on("mouseenter", function(){
                if($("#badge").length > 0)
                    return;

                $("#badge").remove();
                var div = document.createElement("div");
                div.id = "badge";
                $(div).css("position", "absolute");
                $(div).css("left", $(this).offset().left + "px");
                $(div).css("top", $(this).offset().top - (150 + 10) + "px");
                $(div).css("width", "450px");
                $(div).css("height", "152px");
                $(div).css("padding", "0");
                $(div).css("background-color", "white");
                $(div).css("box-shadow", "2px 2px 3px rgba(0,0,0,.5)");
                $(div).html("Loading...");
                $(document.body).append(div);
                $.getJSON("https://gab.ai/users/" + $(this).text().substr(1), function(data){
                    var html = "";
                    html += "<div style='background-image:url(" + data.cover_url + "); background-size:cover;background-position:center;height:60px;padding:5px'>";
                    html += "<img align='left' style='border-radius:40px;height:40px;width:40px;margin-right:7px;margin-left:5px;margin-top:5px;border:3px solid white' src='" + data.picture_url + "'/>";
                    html += "<h2 style='text-shadow:1px 1px 0px black; color:#ff5d9f;'>" + data.name + "</h2>";
                    html += "</div>";
                    html += "<div style='font-size:12px; font-family:Arial;'>";
                    html += "    <div style='padding:6px;overflow:hidden;height:52px;'>" + data.bio + "</div>";
                    html += "    <div style='border-top:1px dotted #ccc; background-color:#F8F8F8;font-size:11px;height:16px;padding-top:2px'>";
                    //html += "<span style='margin-right:5px'>? " + data.score + "</span>";
                    html += "        <span style='margin-left:5px; margin-right:5px'>" + data.post_count + " posts</span>";
                    html += "        <span style='margin-right:5px'>" + data.follower_count + " followers</span>";
                    html += "        <span style='margin-right:5px'>" + data.following_count + " following</span>";
                    if(data.following && data.followed)
                        html+= "<span>&rlarr; you follow each other</span>";
                    else if(data.following)
                        html+= "<span>&rarr; you follow " + data.username + "</span>";
                    else if(data.followed)
                        html+= "<span>&larr; " + data.username + " follows you</span>";
                    html += "    </div>";
                    html += "</div>";
                    $("#badge").html(html);
                });
                $(this).addClass("hover-info");
             });
        });
    }
}