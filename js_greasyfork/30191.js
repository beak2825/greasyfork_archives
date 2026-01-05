// ==UserScript==
// @name           Download YouTube Audio as MP3 ( - topic)
// @name:en        Download YouTube Audio as MP3 ( - topic)
// @include        http://*youtube.*/*watch*
// @include        https://*youtube.*/*watch*
// @version        3.0
// @description     Adds a button to all YouTube videos that allows the user to download the audio as an mp3 file
// @namespace https://greasyfork.org/users/44041
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/30191/Download%20YouTube%20Audio%20as%20MP3%20%28%20-%20topic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/30191/Download%20YouTube%20Audio%20as%20MP3%20%28%20-%20topic%29.meta.js
// ==/UserScript==

//do_button();

$('#player-ads').remove();

var checkExist = setInterval(function() {
   if ($('.more-button').length) {
      console.log("Exists!");
		  do_button();
		 $('#player-ads').remove();
      clearInterval(checkExist);
   }
}, 1000);

window.setInterval(function(){
	  //console.log('render');
    $('.ytd-video-meta-block *').css('color','#888');
    $('yt-view-count-renderer *').css('color','#888');
}, 1000);

function do_button(){
console.log('asdf');
	var DIV = document.createElement('span');
		DIV.innerHTML = '';
		DIV.style.cssFloat = "";

	//var divp = document.getElementById("watch-headline-title");
	//var divp = document.getElementById("container");
		//divp.appendChild(DIV);
	
	$('h1').append(DIV);

	var urltemp = location.href.split("&")[0];
	var url = urltemp.split("=")[1];

	//console.log(url);
	/*
	console.log($('#owner-name a').text().split(' - Topic')[0]);
	var artist_raw = $('#owner-name a').text();
	var artist = $('#owner-name a').text().split(' - Topic')[0];
	var title = $('#container h1').text().trim();
	console.log(title);
	*/
	
	var video_id = window.location.search.split('v=')[1];
  var ampersandPosition = video_id.indexOf('&');
  if(ampersandPosition != -1) {
		video_id = video_id.substring(0, ampersandPosition);
  }
	///var video_id='VA770wpLX-Q';
	console.log(video_id);

	
	$.getJSON('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v='+video_id+'&format=json',function(data,status,xhr){
			title = data.title;
			artist_raw = data.author_name;
		  artist = artist_raw.split(' - Topic')[0];
			console.log(artist+" - "+title+".mp3");
		  filename = artist+" - "+title+".mp3";
		  var path = "https://ycapi.org/button/?v=" + video_id + "&f=mp3&name=" + encodeURIComponent(filename);
		  $('iframe').attr('src', path);
	});
	/*
	$.getJSON('http://api.youtube6download.top/api/?id='+video_id,function(data,status,xhr){
			iframe = data.data.iframe;
	});
	*/
	console.log(artist_raw.indexOf(' - Topic'));
	if(artist_raw.indexOf(' - Topic') !== -1){
		var name = artist + " - " + title + ".mp3";
	} else {
		var name = title + ".mp3";
	}

	//var name = artist + " - " + title + ".mp3";
	//var path = "https://ycapi.org/button/?v=" + url + "&f=mp3&name=" + encodeURIComponent(name);
	var path = "https://ycapi.org/button/?v=" + video_id + "&f=mp3&name=" + encodeURIComponent(filename);
	//var path = "//www.youtubeinmp3.com/widget/button/?video=" + urltemp + "&name=" + encodeURIComponent(name);
	//var path = "https://www.yt-download.org/api-console/audio/" + url + "&name=" + encodeURIComponent(name);
	
	//var path = "//api.youtube6download.top/fetch/iframe.php?i=" + url + "&r=youtube6&color=c91818&name=" + encodeURIComponent(name);
	
	//console.log(path);

	//var INAU = iframe;
	
	
	var INAU = document.createElement('iframe');
		INAU.style.height = "52px";
		INAU.style.width = "110px";
		INAU.style.float = "right";
		

		//INAU.setAttribute('src',"https://www.youtube2mp3.cc/button-api/#" + url + "|mp3");
		//INAU.setAttribute('src',"https://ycapi.org/button/?v=" + url + "&f=mp3&file=" + name);
		INAU.setAttribute('src',path);
	INAU.setAttribute('id','dl_link');
console.log(INAU);
	//$('h1').css("border","1px solid red")
		$('h1').append(INAU);

}

$('video').ready(function() {
	var video = document.getElementsByTagName("video")[0];
		if(video) {
			video.addEventListener("playing", function() {
				//console.log('ugh');
				var elements = document.getElementsByTagName('iframe');
				while (elements[0]) elements[0].parentNode.removeChild(elements[0])
				//setTimeout(do_button, 1000);
				do_button();
			})
		} else {
			console.error("Video element not found");
	}
});