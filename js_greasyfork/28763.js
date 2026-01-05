// ==UserScript==
// @name        AnimeJpnSub links extractor3 (videojs)
// @namespace   nelemnaru
// @description Shows multiple subtitles on animejpnsub.blogspot.jp videos
// @include     http*://animejpnsub.blogspot.jp/p/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28763/AnimeJpnSub%20links%20extractor3%20%28videojs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/28763/AnimeJpnSub%20links%20extractor3%20%28videojs%29.meta.js
// ==/UserScript==

/* Old JWPlayer
var jw = jwplayer("videoPlayer");

jw.on('ready', function() {
	var subtitles = jw.getPlaylistItem().tracks
	var video_file = jw.getPlaylistItem().file
	//console.log(video_file, subtitles[0].file, subtitles[1].file);
	$("body").html($("h2").eq(0).html()+$(".content").eq(0).html()+"<textarea id='txtbox' readonly rows='4' style='width:100%'></textarea>");
	$("#txtbox").val(video_file+'\t'+subtitles[0].file+'\t'+subtitles[1].file);
	$("#txtbox").click(function(){$("#txtbox").select();});
	$("#txtbox").select();
});
/*

/* My JWPlayer */
//$("body").html($("h2").eq(0).text()+$(".content").eq(0).html()+"<textarea id='txtbox' readonly rows='4' style='width:100%; height:600px;'></textarea>");
$("body").html($("h2").eq(0).text()+$("b").eq(0).html()+"<textarea id='txtbox' readonly rows='4' style='width:100%; height:600px;'></textarea>");

var larr = [];
Object.keys(jlinks).forEach(function(key){
	larr.push(jlinks[key].name + "\t" + jlinks[key].video + "\t" + jlinks[key].subtitles["Japanese"] + "\t" + jlinks[key].subtitles["English"] + "\t" + jlinks[key].subtitles["Vietnamese"]);
});

$("#txtbox").val(larr.join("\n"));
//$("#txtbox").click(function(){$("#txtbox").select();});
$("#txtbox").one("click",function(){$("#txtbox").select();});
$("#txtbox").select();
