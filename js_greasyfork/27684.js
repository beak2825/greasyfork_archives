// ==UserScript==
// @name         osu!beatmaps
// @version      1.2
// @description  show new and top osu! maps on profile
// @author       Vingi
// @match        https://osu.ppy.sh/u/*
// @namespace https://greasyfork.org/users/77285
// @downloadURL https://update.greasyfork.org/scripts/27684/osu%21beatmaps.user.js
// @updateURL https://update.greasyfork.org/scripts/27684/osu%21beatmaps.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //create objects
$(".beatmapListing > tbody > tr:nth-child(1)").after("<div id='new' class='loaded' style='opacity: 1; filter: none; display: none;'></div><div style='height: 2px'></div>");
$(".beatmapListing > tbody > tr:nth-child(1)").after("<tr><td id='_new'_new' class='sectionHeading'>New Beatmaps</td></tr>");
$(".beatmapListing > tbody > tr:nth-child(1)").after("<div id='top' class='loaded' style='opacity: 1; filter: none; display: none;'></div><div style='height: 2px'></div>");
$(".beatmapListing > tbody > tr:nth-child(1)").after("<tr><td id='_top' class='sectionHeading'>Top Beatmaps</td></tr>");
//get beatmaps
$.get('https://osu.ppy.sh/p/beatmaplist', null, function(object){
$("#new").prepend($(object).find('.beatmapListing').get(1));
	});
$.get('https://osu.ppy.sh', null, function(object){
$("#top").prepend($(object).find('#most_played').get(0));
	});
//collapse
document.getElementById("_new").onclick = function(){
	if (!($("#new").hasClass("expanded")))
	{
		$("#new").addClass("expanded");
		$("#new").slideDown(500);
	}
	else
	{
		$("#new").slideUp(500);
		$("#new").removeClass("expanded");
	}
};
document.getElementById("_top").onclick = function(){
	if (!($("#top").hasClass("expanded")))
	{
		$("#top").addClass("expanded");
		$("#top").slideDown(500);
	}
	else
	{
		$("#top").slideUp(500);
		$("#top").removeClass("expanded");
	}
};
//permanent onhover
setTimeout(function () {$(".beatmap").find(".initiallyHidden").stop().fadeTo(1,100);
                        $(".beatmap").find(".bmlist-options").clearQueue().stop().delay(500).animate({width:'show'},100);
                        $(".beatmap").click(function(event){return load(this.id,event);});}, 2000);
})();
//fix top maps href
setTimeout(function () {for (i = 2; i < 7; i++) {
    var old_href = $("#most_played > table > tbody > tr:nth-child("+i+") > td:nth-child(2) > a")[0].getAttribute("href");
	var new_href = "https://osu.ppy.sh/"+old_href;
	$("#most_played > table > tbody > tr:nth-child("+i+") > td:nth-child(2) > a")[0].setAttribute("href", new_href);
}}, 2000);
//direct top download
$("#most_played > table > tbody > tr:nth-child(1) > td:nth-child(3)").text("Download");
setTimeout(function () {for (i = 2; i < 7; i++) {
    var old_href = $("#most_played > table > tbody > tr:nth-child("+i+") > td:nth-child(2) > a")[0].getAttribute("href");
	var new_href = "https://osu.ppy.sh/d"+old_href.substring("20");
	$("#most_played > table > tbody > tr:nth-child("+i+") > td:nth-child(3) > a")[0].setAttribute("href", new_href);
	$("#most_played > table > tbody > tr:nth-child("+i+") > td:nth-child(3) > a").text("Download");
}}, 2000);