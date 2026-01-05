// ==UserScript==
// @name        FURSTREAM stream mod
// @namespace   furstre.am
// @description Make the stream player take all available width
// @include     https://furstre.am/stream/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2893/FURSTREAM%20stream%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/2893/FURSTREAM%20stream%20mod.meta.js
// ==/UserScript==

var ratio = {x:16,y:9}

$(window).load(function(){
	$(window).resize()
	var select = $(document.createElement("select")).addClass("btn btn-default pull-right")
	$(select).append($(document.createElement("option")).attr("value", '{"x":16,"y":9}').html("16:9 ratio"))
	$(select).append($(document.createElement("option")).attr("value", '{"x":16,"y":10}').html("16:10 ratio"))
	$(select).append($(document.createElement("option")).attr("value", '{"x":16,"y":12}').html("4:3 ratio"))
	$(select).append($(document.createElement("option")).attr("value", '{"x":15,"y":12}').html("5:4 ratio"))
	$(select).change(function(e){
		var o = $(".center .row select").get(0);
		ratio = $.parseJSON(o.value);
		$(window).resize();
	})
	$("#follow-stream, #anonfollow-stream").after(select)
})

$(window).resize(function(e){
	var streamwidth = $("body").width() - $("#flex__1").width() - $("#chat").width();
	$(".center").css({ "margin-right" : "0", "margin-left" : "0" , "width" : streamwidth+"px" })
	var factor = Math.floor((streamwidth - 26) / ratio.x)
	$("div.player-wrap").css({ "width" : (factor * ratio.x)+"px", "height" : (factor * ratio.y)+"px"})
	$("div#player").css({ "width" : (factor * ratio.x)+"px", "height" : (factor * ratio.y)+"px"})
})

