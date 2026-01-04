// ==UserScript==
// @name         Miao SayoBot Download
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://osu.ppy.sh/beatmapsets/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419323/Miao%20SayoBot%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/419323/Miao%20SayoBot%20Download.meta.js
// ==/UserScript==
    console.log("start");
    $(document).ready(function(){
        var url = window.location.href;
        var part = url.split("/");
        var bid = part[part.length-2].split("#")[0];
        console.log(bid);
        $("button.btn-osu-big").after("<a href=\""+"https://dl.sayobot.cn/beatmaps/download/full/"+bid+"\" data-turbolinks=\"false\" class=\"btn-osu-big btn-osu-big--beatmapset-header\"><span class=\"btn-osu-big__content \"><span class=\"btn-osu-big__left\"><span class=\"btn-osu-big__text-top\">SayoBot下载(完整)</span></span><span class=\"btn-osu-big__icon\"><span class=\"fa-fw\"><i class=\"fas fa-download\"></i></span></span></span></a>");
        $("button.btn-osu-big").after("<a href=\""+"https://dl.sayobot.cn/beatmaps/download/novideo/"+bid+"\" data-turbolinks=\"false\" class=\"btn-osu-big btn-osu-big--beatmapset-header\"><span class=\"btn-osu-big__content \"><span class=\"btn-osu-big__left\"><span class=\"btn-osu-big__text-top\">SayoBot下载(无视频)</span></span><span class=\"btn-osu-big__icon\"><span class=\"fa-fw\"><i class=\"fas fa-download\"></i></span></span></span></a>");
        $("button.btn-osu-big").after("<a href=\""+"https://dl.sayobot.cn/beatmaps/download/mini/"+bid+"\" data-turbolinks=\"false\" class=\"btn-osu-big btn-osu-big--beatmapset-header\"><span class=\"btn-osu-big__content \"><span class=\"btn-osu-big__left\"><span class=\"btn-osu-big__text-top\">SayoBot下载(mini)</span></span><span class=\"btn-osu-big__icon\"><span class=\"fa-fw\"><i class=\"fas fa-download\"></i></span></span></span></a>");
   
    });


