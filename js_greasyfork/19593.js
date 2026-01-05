// ==UserScript==
// @name        Enhanced Ticker: Autoupdate threads
// @namespace   MrBrax
// @description	Updates threads automatically if the ticker is open. Requires "Enhanced Ticker" 3.32 or upwards.
// @include     https://facepunch.com/showthread.php?*
// @include     https://facepunch.com/subscription.php*
// @include     https://facepunch.com/usercp.php*
// @version     0.15
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/19593/Enhanced%20Ticker%3A%20Autoupdate%20threads.user.js
// @updateURL https://update.greasyfork.org/scripts/19593/Enhanced%20Ticker%3A%20Autoupdate%20threads.meta.js
// ==/UserScript==

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " Year" + ( interval != 1 ? "s" : "");
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " Month" + ( interval != 1 ? "s" : "");
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " Day" + ( interval != 1 ? "s" : "");
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " Hour" + ( interval != 1 ? "s" : "");
    }
    interval = Math.floor(seconds / 60);
    if (interval > 0) {
        return interval + " Minute" + ( interval != 1 ? "s" : "");
    }
    return Math.floor(seconds) + " second" + ( seconds != 1 ? "s" : "");
}

GM_addStyle(".au_bar { background: #cce; border: 1px solid #777; border-bottom-width: 0; clear: both; display: block; font: 12px Tahoma; padding: 4px; width: 100%; box-sizing: border-box; }");

var thread = location.href.match(/\?t=([0-9]+)/);

if( thread ){

	var paginator = document.getElementById("yui-gen1");
	var plist = document.getElementById("posts");

	if( paginator ){
		var s = paginator.innerHTML.trim().match(/Page ([0-9]+) of ([0-9]+)/);
		if(s[1] != s[2]){
			var au_info = document.createElement("div");
			au_info.className = "au_bar";
			au_info.innerHTML = "<strong>Auto updater not running, go to the last page.</strong>";
			plist.appendChild(au_info);
			return;
		}
	}

	var title = document.title;
	var newposts = 0;

	var unseenPosts = {};

	document.title = "[" + newposts + "] " + title;

	var au_info = document.createElement("div");
	au_info.className = "au_bar";
	au_info.innerHTML = "<strong>New posts will appear below if ticker is open</strong>";
	plist.appendChild(au_info);

	function updateTime(a){
		var t = document.querySelectorAll(".date");
		for(i in t){
			var d = new Date( t[i].title );
			t[i].innerHTML = timeSince( d.getTime() ) + " Ago";
		}
		if(!a) setTimeout( updateTime, 10000 );
	}

	updateTime();

	var storageHandler = function (e) {

		var is_new = e.key == "ETicker_LastPost";
		var is_updated = e.key == "ETicker_UpdatePost"

		if( is_new || is_updated ){
			var d = e.newValue.split(".");
			if(d[0] == thread[1]){

				var post_exist = document.getElementById("post_" + d[1] );

				if( post_exist && e.key == "ETicker_LastPost" ){
					console.log("Post already exists: " + d[1] );
					return;
				}

				var url = "https://facepunch.com/showthread.php?t=" + d[0] + "&p=" + d[1];

				console.log("Update thread", thread[1], url);

				var xhr = new XMLHttpRequest();
				xhr.open("GET", url, true);
				xhr.responseType = "document";
				xhr.onreadystatechange = function (){
					if (xhr.readyState == 4 && xhr.status == 200){

						var data = xhr.responseXML;
						var newp = data.getElementById("post_" + d[1]);

						if(newp){
							// new page notifier
							if(newp.parentNode.childNodes[1] == newp){
								var page = data.getElementById("yui-gen1").match(/Page ([0-9]+)/)[1];
								var s = document.createElement("div");
								s.className = "au_bar";
								s.innerHTML = "<strong><a href='https://facepunch.com/showthread.php?t=" + d[0] + "&page=" + page + "'>Page " + page + "</a></strong>";
								plist.appendChild(s);
								console.log("new page");
							}

							// add new post
							if( is_new ){
								newp.className = newp.className.replace("postbitold", "postbitnew");
								plist.appendChild(newp);
							}else{
								post_exist.innerHTML = newp.innerHTML;
							}
						}

						// update title
						if( is_new ){
							unseenPosts[ d[1] ] = true;
							document.title = "[" + ( Object.keys(unseenPosts).length ) + "] " + title;
						}

						// update ratings
						var ratings = data.querySelectorAll(".rating_results");
						for(i in ratings){
							document.getElementById( ratings[i].id ).innerHTML = ratings[i].innerHTML;
						}

						updateTime(true);
					}
				};
				xhr.send();
			}
		}
	};

	var scrollHandler = function (e) {
		for(i in unseenPosts){
			var element = document.getElementById("post_" + i);
			if( !element ){ console.log("no element for post " + i); continue; }
			//console.log( i, element.getBoundingClientRect().top );
	  		if( element.getBoundingClientRect().top < 0 ) {
	  			console.log("Post now seen: " + i);
				delete unseenPosts[ i ];
				element.className = element.className.replace("postbitnew", "postbitold");
				document.title = "[" + ( Object.keys(unseenPosts).length ) + "] " + title;
			}
		}
	}

	window.addEventListener("storage", storageHandler, false);
	window.addEventListener('scroll', scrollHandler, false);

}