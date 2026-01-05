// ==UserScript==
// @name        Noobroom Bookmarker
// @namespace   Kon
// @description Lets you save videos for easy viewing later and adds the video name in the title
// @include     http://noobroom7.com/*
// @include     http://noobroom5.com/*
// @version     1.1
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_getResourceURL
// @resource StarOn16 http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/16/Actions-rating-icon.png
// @resource StarOff16 http://icons.iconarchive.com/icons/icojam/onebit/16/star-0-icon.png
// @downloadURL https://update.greasyfork.org/scripts/1210/Noobroom%20Bookmarker.user.js
// @updateURL https://update.greasyfork.org/scripts/1210/Noobroom%20Bookmarker.meta.js
// ==/UserScript==
var $ = unsafeWindow.jQuery;
function gmGet(name, def){
	var theValue = GM_getValue(name, def);
	return theValue;
}
function gmSet(name, valuee){
	GM_setValue(name, valuee);
}
var videos = JSON.parse(GM_getValue("videos", '{"videos":[]}'));
var video_id = $("form#subform").attr("action").split("?")[1];
var video_name_div = $("div[style='position:absolute; left:20px; bottom:6px']");
video_name_div.text($.trim(video_name_div.text()));
var video_name = video_name_div.text();

//Add movie name to title
document.title = "Noobroom - "+video_name;

//Change favicon
var link = document.createElement('link');
link.type = 'image/x-icon';
link.rel = 'shortcut icon';
link.href = 'http://107.6.170.83/~nooboard/2img/'+video_id+'.jpg';
document.getElementsByTagName('head')[0].appendChild(link);

var is_watch_later = isWatchLater(video_id);
if(is_watch_later == -1){
	video_name_div.prepend('<img id="watch_later" src="'+GM_getResourceURL("StarOff16")+'" style="cursor: pointer"/>');
}else{
	video_name_div.prepend('<img id="watch_later" src="'+GM_getResourceURL("StarOn16")+'" style="cursor: pointer"/>');
}
var right_area = $("td[style='width:50%; border-left: 0px solid #ffffff']").css("vertical-align","top");;
right_area.prepend('<div id="saved_videos" style="border-bottom: 1px solid #fff;border-right: 1px solid #fff;background-color:#000;overflow:hidden;min-height:600px;color:#FF7142;text-align:center;"><u>Watch Later</u><br/></div>');
var saved_videos = $("div#saved_videos");
var count = videos.videos.length;
if(count == 0){
	saved_videos.append('<br/>None!<br/>Click the star next to a video\'s name');
}
for(var i = 0; i < count; i++){
	saved_videos.append('<a href="/?'+videos.videos[i].id+'" style="color:#FFFFFF;text-decoration:none;">'+videos.videos[i].name+'</a><br/>');
}
$("img#watch_later").click(function(){
	setTimeout(function(){
		videos = JSON.parse(GM_getValue("videos", '{"videos":[]}'));
		count = videos.videos.length;
		if(is_watch_later == -1){
			videos.videos[count] = {};
			videos.videos[count].id = video_id;
			videos.videos[count].name = video_name;
			setTimeout(function(){$("img#watch_later").attr("src", GM_getResourceURL("StarOn16"))},0);
		}else{
			videos.videos.splice(is_watch_later,1);
			setTimeout(function(){$("img#watch_later").attr("src", GM_getResourceURL("StarOff16"))},0);
		}
		is_watch_later = isWatchLater(video_id);
		var serialized_videos = JSON.stringify(videos);
		setTimeout(function(){GM_setValue("videos", serialized_videos)},0);
	},0);
});
function isWatchLater(id){
	var count = videos.videos.length;
	for(var i = 0; i < count; i++){
		if(id == parseInt(videos.videos[i].id)) return i;
	}
	return -1;
}