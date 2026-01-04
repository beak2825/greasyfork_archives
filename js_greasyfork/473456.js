// ==UserScript==
// @name        Twitter Discreet Blocking
// @namespace   Violentmonkey Scripts
// @match       https://twitter.com/home
// @grant       none
// @version     1.1
// @author      CarlosMarques
// @description Blocks twitter users only locally
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473456/Twitter%20Discreet%20Blocking.user.js
// @updateURL https://update.greasyfork.org/scripts/473456/Twitter%20Discreet%20Blocking.meta.js
// ==/UserScript==
 
//TODO: User interface to add blocked users
 
(function(){
	let blockedAccounts = ["elonmusk"]
	let mObserver = new MutationObserver(function(mutations){
		for(tweet of document.querySelectorAll('[data-testid="cellInnerDiv"]')){
			let tweetAuthor = tweet.querySelector('[data-testid="User-Name"]')?.querySelector('[role="link"]').href.split("/").slice(-1)[0]
			let tweetReposter = tweet.querySelector('[data-testid="socialContext"]')?.parentElement.href.split("/").slice(-1)[0]
			if(blockedAccounts.includes(tweetAuthor) || blockedAccounts.includes(tweetReposter)){
				tweet.innerHTML = ""
				tweet.style = ""
			}
		}
	})
	mObserver.observe(document.body, {subtree: true, childList: true, characterData: true});
})()
