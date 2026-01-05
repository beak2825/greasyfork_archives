// ==UserScript==
// @name         Twitter giveaway bot
// @version      0.1
// @description  neni potřeba
// @author       I
// @match        https://twitter.com/*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @run-at		 document-start
// @grant        none
// @namespace https://greasyfork.org/users/20071
// @downloadURL https://update.greasyfork.org/scripts/26741/Twitter%20giveaway%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/26741/Twitter%20giveaway%20bot.meta.js
// ==/UserScript==

(function ($, undefined) {
	$(function () {
		goodCount = 0;
		badCount = 0;
		onloadFired = false;
		log = console.log;
		bubbleHTML = '<div id="info" style="    position: fixed;    top:  10px;    right:  20px;    min-width: 100px;    min-height: 100px;    background-color: red;    z-index: 100000;    border-radius: 10px;"><textarea id="info-area" style="    margin: 10px;"></textarea><p id="stats"></p></div>';
		//$("body:first").slice(0,1).append(bubbleHTML);
		/*
		if ($("#doc")[0]) {
			$("#doc")[0].outerHTML += bubbleHTML;
		}
		*/
		regexGiveaway = new RegExp(/giveaway/, 'i');
		regexRetweet = "";
		regexFollow = "";
		regexFav = "";

		function info(data) {
			$("#info-area").append(data+"<br />------------------");
		}

		function processTweets(tweets) {
			/*tweets = $(".tweet");*/
			temp = [];
			$.each(tweets,function(index, item) {
				log("checking");
				temp.push($(item));
				item = $(item);				
				if (item.data("checked")) {
					log("doublecheck");					
				} else {
					text = $(".tweet-text",item).html();
					subtweet = $(".QuoteTweet-innerContainer",item);
					if (subtweet) {
						subtext = $(".tweet-text",subtweet).html();
					}
					//regex match
					if (text) {
						if (regexGiveaway.test(text) && text.toLowerCase().indexOf("giveaway")!=-1) {
							item.css("background-color","lightgreen");
							item.data("checked", true);
							log("green");
							goodCount++;
						} else {
							item.css("background-color","pink");
							item.data("checked", true);
							log("red");
							badCount++;
						}
					}
					/*if (subtext && regexGiveaway.test(subtext)) {
						subtweet.css("background-color","lightgreen");
						goodCount++;
					}*/
					$("#stats").html('good: '+goodCount+' bad: '+badCount);
				}



			});
		}

		window.onload = function() {
			if (!onloadFired) {				
				onloadFired = true;				
				$(document.body).append(bubbleHTML);

				processTweets($(".tweet"));
				observedObject = $(".stream")[0];			
				newtweets = [];
				observer = new MutationObserver(function(mutations) {								
					$.each(mutations, function(index, item) {					
						added = item.addedNodes;						
						//aby se neřešily nějaký bordely, co jsou v addedNodes, ale nejsou reálnej element
						if (added.length > 5) {
							log(item.type);
							$.each(added, function(index2, item2) {
								log(item2);
								temp_i = item2;
								if ($(item2).hasClass('stream-item')) {
									log(item2);
									newtweets.push(item2);
								}
							});
						}						
					});
					processTweets(newtweets);
				});
				config = { attributes: false, childList: true, characterData: false, subtree: true };
				observer.observe(observedObject, config);
			}
		};
	});
})(window.jQuery.noConflict(true));
