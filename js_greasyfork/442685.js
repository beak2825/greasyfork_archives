// ==UserScript==
// @name         youtube buffer enhence 缓冲增加
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  youtube buffer enhence
// @author       You
// @match        https://www.youtube.com/watch?v*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pastebin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442685/youtube%20buffer%20enhence%20%E7%BC%93%E5%86%B2%E5%A2%9E%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/442685/youtube%20buffer%20enhence%20%E7%BC%93%E5%86%B2%E5%A2%9E%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Youtube for peoples with extremely slow connexion. Like me.
// All hacks like media.mediasource.enabled, media.cache_readhead_limit, etc. don't work ?
// This is a manual JS way to force it.
/*
What it does :
It pauses your youtube video. When video stop buffering it manually move the seeker to force the download.
When the download is finished, it place the cursor back to it's original position. You are then ready to play a fully buffered video.
*/

/*
How to use :
Paste this script in the console of your browser (F12 > Console). Tested on Firefox Linux.
*/

// Note : Maximize your "browser.cache.disk.capacity" (type "about:config" in Firefox) if you are loading long videos

// Youtube for peoples with extremely slow connexion. Like me.
// All hacks like media.mediasource.enabled, media.cache_readhead_limit, etc. don't work ?
// This is a manual JS way to force it.

/*
What it does :
It pauses your youtube video. When video stop buffering it manually move the seeker to force the download.
When the download is finished, it place the cursor back to it's original position. You are then ready to play a fully buffered video.
*/

/*
How to use :
Paste this script in the console of your browser (F12 > Console). Tested on Firefox Linux.
*/

// Note : Maximize your "browser.cache.disk.capacity" (type "about:config" in Firefox) if you are loading long videos

const success = [
 'background: rgba(0,204,0,0.2)',
 'color: yellow',
 'display: block',
 'text-align: left'
].join(';');

const failure = [
 'background: rgba(255,0,0,0.2)',
 'color: yellow',
 'display: block',
 'text-align: left'
].join(';');

const warning = [
 'background: rgba(55, 102, 0,0.2)',
 'color: orange',
 'display: block',
 'text-align: left'
].join(';');

console.info('%c Youtubeforce ftw!', success);
var current_download = 0;
var previous_download = 0;
var loop_since_download = 0;
var loop = 1;
var player = document.getElementById('movie_player');
var duration = player.getDuration();
var first_chunk_loaded =  Math.round((player.getVideoBytesLoaded() / player.getVideoBytesTotal())*100);
var last_chunk_loaded = 0;
var first_buffer_time = false;
var waiter = 0;
var total_restart_buffer = 0;
//var v_title =document.querySelector("#container > h1").children[0].innerHTML;
var v_title = document.querySelector("title").innerHTML;
function update_current_chunk_loaded(current_chunk_loaded){
    //get id loaded_progress
    // select #container > h1 as h1
    var h1 = document.querySelector("#container > h1");

    var loaded_progress = document.getElementById('loaded_progress');
    //add loaded_progress after h1
    h1.children[0].innerHTML = v_title + " - "+current_chunk_loaded+"%";

}
if(player){
	var inter = setInterval(function(){
		var d = new Date();
		current_download = player.getVideoBytesLoaded();
		if(waiter > 0) waiter--;
		if(waiter <= 0){
			if(player.getVideoBytesLoaded() != "NaN"){
				// Try to buffer if buffer is not at the end
				if(player.getVideoBytesLoaded() < (player.getVideoBytesTotal() - 0.09)){
					// Video is not loading anymore...
					if(current_download == previous_download){
						// Video buffer is stop. wait a bit.
						loop_since_download++;
						if(loop_since_download > 10){
							if(loop_since_download > 30){
								console.log("%c Slow connexion..., pause for 20 loops "+d, error);
								waiter = 20;
							}
							if(!first_buffer_time){
								first_buffer_time = player.getCurrentTime();
							}
							console.log("%c Restart buffer (10 loops since last download), and pause for 10 loops... (already restarted "+total_restart_buffer+" times "+d, warning);
							// sectotal * byteLoaded / byteTotal = sec loaded
							var current_time_loaded = player.getDuration() * (player.getVideoBytesLoaded() / player.getVideoBytesTotal());
							player.seekTo(current_time_loaded - 2); // - 2sec
							player.pauseVideo();
							waiter = 10;
							total_restart_buffer++;
						}
					// Video is still loading...
					}else{
						previous_download = player.getVideoBytesLoaded();
						loop_since_download = 0;
						var current_chunk_loaded =  Math.round((player.getVideoBytesLoaded() / player.getVideoBytesTotal()) * 100);
						console.info("%c Video is buffering properly ("+current_chunk_loaded+"%). "+loop+" loops, and "+loop_since_download+" iteration since last chunk, wait 10 loops "+d, success);
						waiter = 10;
                        update_current_chunk_loaded(current_chunk_loaded);
					}
					loop++;
				}else{
					last_chunk_loaded =  Math.round((player.getVideoBytesLoaded() / player.getVideoBytesTotal())*100);
					console.log("%c Everything is loaded or the tab is inactive... Wait 50sec. Total number of buffer restart : "+total_restart_buffer+" and Total buffered : "+last_chunk_loaded+"%. Buffered on launch : "+first_chunk_loaded, success);
					waiter = 50;
					// restarting to first buffer and play
					if(first_buffer_time){
						player.seekTo(first_buffer_time);
						first_buffer_time = false;
					}
				}
			}else{
				console.log("%c Error getting stream. Waiting..., wait 10 loops", error);
				waiter = 10;
			}
		}else{
				//console.log("We are waiting...");
			}
	},1000);
}
        document.addEventListener('DOMContentLoaded', function() {
        //get container > h1 innerHTML
        var h1 = document.querySelector("#container > h1");
        var v_title = h1.children[0].innerHTML;
    });
    // Your code here...
})();