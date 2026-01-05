// ==UserScript==
// @name        Youtube Subscription List Quick Playlist
// @namespace   https://greasyfork.org/en/users/13981-chk1
// @description Quickly create playlists from your Youtube subscription feed
// @include     https://www.youtube.com/feed/subscriptions*
// @version     1.0.3
// @grant       GM_addStyle
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/19139/Youtube%20Subscription%20List%20Quick%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/19139/Youtube%20Subscription%20List%20Quick%20Playlist.meta.js
// ==/UserScript==

GM_addStyle("#subs2playlistContainer { position:fixed; bottom: 10px; right: 10px; width: 180px; } ");
GM_addStyle("#subs2playlistLink { display: block; clear: both; } ");
GM_addStyle("#subs2playlistClear { float: right; font-size: 12px; padding-top: 5px; padding-bottom: 5px; display: block; color: #bb0000; }");
GM_addStyle("#subs2playlistCopy { float: left; font-size: 12px; padding-top: 5px; padding-bottom: 5px; display: block; color: #000; }");
GM_addStyle("#subs2playlistCopyTemp { width:1px; height:1px; position:fixed; }");
GM_addStyle("#subs2playlistContainer input { font-size: 12px; display:block; color: #767676; clear:both; width: 100%; border: 1px solid #d5d5d5; border-radius: 2px; font-family: monospace }");
GM_addStyle("#subs2playlistContainer span { font-size: 12px; display:block; clear:both; transition: color 0.2s; color: #767676; }");
GM_addStyle("#subs2playlistContainer span.warning { color: #bb0000; }");
GM_addStyle(".subs2playlist.subs2playlist-add span::after { content: 'Add to playlist' }");
GM_addStyle(".subs2playlist.subs2playlist-remove span::after { content: 'Remove from playlist' }");

var videoIds = [];
var playlistElements;

// create DOM nodes
function createPlaylistContainer() {
	var playlistLinkContainer       = document.createElement('div'); 
	playlistLinkContainer.className = "yt-card yt-card-has-padding";
	playlistLinkContainer.id        = "subs2playlistContainer";

	var playlistLinkH3              = document.createElement('h3'); 
	playlistLinkH3.className        = "yt-lockup-title";

	var playlistLink                = document.createElement('a'); 
	playlistLink.href               = "https://www.youtube.com/watch_videos?video_ids=";
	playlistLink.id                 = "subs2playlistLink";

	var playlistLinkText            = document.createTextNode("Your playlist link"); 
	var playlistLinkCount           = document.createElement("span"); 
	playlistLinkCount.innerHTML     = "0 videos"; 
	
	var clearLink                   = document.createElement("a"); 
	clearLink.id                    = "subs2playlistClear";
	clearLink.onclick               = function() { clearPlaylist() };

	var clearText                   = document.createTextNode("Clear"); 
	var copyLink                    = document.createElement("a"); 
	copyLink.id                     = "subs2playlistCopy";

	var copyText = document.createTextNode('Copy IDs'); 
	var copyLinkInput = document.createElement('input'); 
	copyLinkInput.type = "text"; 
	copyLinkInput.placeholder = "video IDs..."; 
	copyLinkInput.className = "yt-uix-form-input-bidi"; 
	copyLink.onclick = function() { 
		html5Copy(copyLinkInput);
	};

	var playlistLinkFunctionContainer = document.createElement('div'); 
	var introText                   = document.createElement("span"); 
	introText.innerHTML             = "Add videos from your subscription box to create a quick playlist."; 

	copyLink.appendChild(copyText);
	clearLink.appendChild(clearText);
	playlistLink.appendChild(playlistLinkText);
	playlistLinkH3.appendChild(playlistLink);
	playlistLinkContainer.appendChild(playlistLinkH3);

	playlistLinkFunctionContainer.appendChild(playlistLinkCount);
	playlistLinkFunctionContainer.appendChild(clearLink);
	playlistLinkFunctionContainer.appendChild(copyLink);
	playlistLinkFunctionContainer.appendChild(copyLinkInput);
	playlistLinkFunctionContainer.style.display = "none";
	
	playlistLinkContainer.appendChild(playlistLinkH3);
	playlistLinkContainer.appendChild(introText);
	playlistLinkContainer.appendChild(playlistLinkFunctionContainer);

	return {
		'container': playlistLinkContainer, 
		'link': playlistLink, 
		'text': playlistLinkText,
		'plain': copyLinkInput,
		'count': playlistLinkCount,
		'intro': introText,
		'functioncontainer': playlistLinkFunctionContainer
	};
}

// copy video IDs to clipboard
function html5Copy(inputnode){
	var node = document.createElement('pre');
	node.className = 'subs2playlistCopyTemp';
    node.textContent = inputnode.value;
	document.body.appendChild(node);

	var selection = getSelection();
	selection.removeAllRanges()
	var range = document.createRange();
	range.selectNodeContents(node);
	console.log(range);
	selection.addRange(range);
	document.execCommand('copy');

	document.body.removeChild(node);
}

// update playlist link, run after adding/removing videos
function updatePlaylistLink() {
	// toggle intro text visibility off
	playlistElements.functioncontainer.style.display = "block";
	playlistElements.intro.style.display = "none";

	// check playlist length for known limits
	if(videoIds.length > 20) {
		playlistElements.count.classList.add("warning");
		playlistElements.count.textContent = ""+videoIds.length+" videos - The playlist link will only play the first 20 videos.";
	} else if(playlistElements.text.textContent.length > 2000){
		playlistElements.count.classList.add("warning");
		playlistElements.count.textContent = ""+videoIds.length+" videos - Too many videos, URL is too long. Some videos in the playlist link may not work.";
	} else {
		playlistElements.count.classList.remove("warning");
		playlistElements.link.href="https://www.youtube.com/watch_videos?video_ids="+videoIds.join(',');
		playlistElements.plain.value=videoIds.join(',');
		playlistElements.count.textContent = ""+videoIds.length+" videos";
	}
}

// clear all video IDs, reset buttons
function clearPlaylist() {
	videoIds = [];
	var buttons = document.querySelectorAll('#browse-items-primary > .section-list .subs2playlist');
	for (var i = 0; i < buttons.length; ++i) {
		buttons[i].classList.remove("subs2playlist-remove");
		//buttons[i].classList.remove("yt-uix-button-subscribed-branded");
		buttons[i].classList.remove("c4-module-editor-delete");
		buttons[i].classList.add("subs2playlist-add");
		buttons[i].classList.add("c4-editor-plus");
	}
	updatePlaylistLink();
}

// only add videos that aren't duplicates
function toggleVideoId(videoId){
	var alreadyIn = videoIds.indexOf(videoId);
	if(alreadyIn === -1){
		videoIds.push(videoId);
		return true;
	} else {
		videoIds.splice(alreadyIn, 1);
		return false;
	}
}

// add a button to a subscription list item
function createPlusButton(videoId){
	var container = document.createElement('button'); 
	container.setAttribute('onclick', 'toggleVideoId(\''+videoId+'\');');
	container.className = "subs2playlist subs2playlist-add yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-has-icon no-icon-markup yt-uix-inlineedit-edit c4-editor-plus";
	container.onclick = function(){ 
		toggleVideoId(videoId);
		container.classList.toggle("c4-module-editor-delete");
		container.classList.toggle("c4-editor-plus");
		container.classList.toggle("subs2playlist-remove");
		container.classList.toggle("subs2playlist-add");
		updatePlaylistLink();
	};
	container.innerHTML = "<span class=\"yt-uix-button-content\"></span>";
	return container;
}

// iterate subscription list items, then add buttons
function appendAllTheThings(node) {
	var videoId = node.getAttribute("data-context-item-id");
	var plusButtonNode = createPlusButton(videoId);
	node.appendChild(plusButtonNode);
}

var observerConfig = { 
  childList: true,
  attributes: true, 
  subtree: false,
  attributeOldValue: false
};

// add buttons to items loaded after clicking "load more" or endless scroll, which are dynamically added 
var listObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.type == "childList" && mutation.addedNodes.length >= 1) {
      console.log(mutation);
      for (var i = 0; i < mutation.addedNodes.length; ++i) {
      	var node = mutation.addedNodes[i];
      	if(node.nodeType === 1){
      		var videoLinkContainer = node.querySelector('.yt-lockup');
      		appendAllTheThings(videoLinkContainer);
      	}
      }
    }
  });    
});
var subListContainer = document.querySelector('#browse-items-primary > .section-list');
listObserver.observe(subListContainer, observerConfig);

// first run: create our container, add buttons to playlist items
function firstRun(){
	var videoLinkNodes = document.querySelectorAll('div.yt-lockup');
	for (var i = 0; i < videoLinkNodes.length; ++i) {
		var node = videoLinkNodes[i];
		appendAllTheThings(node);
	}
	playlistElements = createPlaylistContainer();
	document.body.appendChild(playlistElements.container);
}

firstRun();