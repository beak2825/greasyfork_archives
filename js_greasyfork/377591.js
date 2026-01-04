// ==UserScript==
// @name        twitter_mute_words
// @namespace   https://catherine.v0cyc1pp.com/twitter_mute_words.user.js
// @include     https://twitter.com/*
// @exclude     https://twitter.com/i/cards/*
// @author      greg10
// @run-at      document-idle
// @license     GPL 3.0
// @version     0.1
// @grant       none
// @description Hide tweets (muteワードを含むツイートを非表示にする)
// @downloadURL https://update.greasyfork.org/scripts/377591/twitter_mute_words.user.js
// @updateURL https://update.greasyfork.org/scripts/377591/twitter_mute_words.meta.js
// ==/UserScript==



//================================
// Configurations
//   - muteワードを指定してください。
var g_nglist = [
	"fuck",
	"#セフレ",
	"#オフパコ",
];
//================================



//console.log("twitter_mute_words start");

function main() {
	//console.log("twitter_mute_words: main() start!");
	document.querySelectorAll(".stream-item").forEach(function(obj) {
		var myproc = obj.getAttribute("myproc");
		//console.log("myproc="+myproc);
		if ( myproc != null ) {
			return;
		}
		obj.setAttribute("myproc", "done");

		var text = obj.innerText;
		for ( var i = 0; i < g_nglist.length; i++) {
			var ngword = g_nglist[i];
			var regobj = new RegExp( ngword, "i");
			var index = text.search( regobj );
			if ( index !== -1 ) {
				//console.log("NG! text="+text);
				obj.style.display="none";
			}
		}
	});
}

main();

var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe( document, config);
});

var config = { attributes: false, childList: true, characterData: false, subtree:true };

observer.observe( document, config);
