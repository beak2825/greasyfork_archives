// ==UserScript==
// @name              Tumblr Savior
// @namespace         bjornstar
// @description       Saves you from ever having to see another post about certain things ever again (idea by bjornstar, rewritten by Vindicar).
// @version           3.1.4
// @require 	      https://greasyfork.org/scripts/1884-gm-config/code/GM_config.js?version=4836
// @run-at            document-start
// @grant             unsafeWindow
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @grant             GM_addStyle
// @include           http://www.tumblr.com/*
// @include           https://www.tumblr.com/*
// @downloadURL https://update.greasyfork.org/scripts/2498/Tumblr%20Savior.user.js
// @updateURL https://update.greasyfork.org/scripts/2498/Tumblr%20Savior.meta.js
// ==/UserScript==

(function(){
	'use strict';
	//preparing the config file
	//If we have no access to Greasemonkey methods, we will need dummy replacements
	if (typeof GM_getValue !== 'function') GM_getValue = function (target, deflt) { return deflt; };
	// >>> YOU CAN SPECIFY DEFAULT VALUES BELOW <<<
	var cfg = {
		//posts matching black list will be hidden completely
		blacklist : parseList(GM_getValue('blacklist', '')),
		//posts matching gray list will be hidden under spoiler and can be revealed with a single click
		graylist  : parseList(GM_getValue('graylist', '')),
		//posts matching white list will never be affected by black or gray lists.
		whitelist : parseList(GM_getValue('whitelist', '')),
		//which action to take against sponsored posts
		sponsored_action : GM_getValue('sponsored', '0'),
		//which action to take against recommended posts
		recommended_action : GM_getValue('recommended', '0'),
		//if set to true, black and white lists will affect notifications and post notes as well.
		process_notifications_and_notes : GM_getValue('notes', false),
		//if true, script will search post HTML for triggerwords instead of it's visible text content
		search_html : GM_getValue('inhtml', false),
		// settings below this point are internal and have no GUI
		//if post removal should simply hide it
		soft_removal : true,
		post_selector : 'li.post_container:not(#new_post_buttons)',
		notification_selector : 'li.notification',
		note_selector : '.notes li.note',
		post_body_selector : '.post_body',
		//constants for the sake of code simplicity
		actions : {
			PROCESS		: '0',
			WHITELIST	: '1',
			HIDE		: '2',
			SPOILER		: '3',
			REMOVE		: '4',
		},
	};
	//=======================================================================
	//Main Tumblr Saviour object (maybe it's a god-object antipattern, I don't care)
	//=======================================================================
	var TumblrSaviour = { 
		config : cfg, //configuration object from above
		//helper function that looks up keywords from supplied array in a string and returns array of found keywords
		findKeywords : function (data, list) {
			var result = [];
			for (var i = 0; i < list.length; i++)
				if (data.indexOf(list[i]) >= 0)
					result.push(list[i]);
			return result;
		},
		//helper function that strips specified attributes from the root element and all its descendants
		stripAttrs : function (root, attrs) {
			//make sure we got an array
			if (typeof attrs == 'undefined')
				attrs = [];
			else if (typeof attrs == 'string')
				attrs = [attrs];
			for (var a=0; a<attrs.length; a++) {
				//stripping the node itself
				if (root.hasAttribute(attrs[a]))
					root.removeAttribute(attrs[a]);
				//finding all descendants that have this attribute
				var nodes = root.querySelectorAll('*['+attrs[a]+']');
				//and stripping them all
				for (var i=0; i<nodes.length; i++)
					nodes[i].removeAttribute(attrs[a]);
			}
		},
		//helper function that removes all matching descendants of the root element
		stripNodes : function (root, items) {
			if (typeof items == 'string')
				items = [items];
			for (var i=0; i<items.length; i++) {
				var nodes = root.querySelectorAll(items[i]);
				for (var j=0; j<nodes.length; j++)
					nodes[j].parentNode.removeChild(nodes[j]);
			}
		},
		//converts a post element into string for keyword lookup
		extractPostData : function (post) {
			var data = '';
			var clone = post.cloneNode(true);
			this.stripNodes(clone, ['script', '.post_footer']);
			if (this.config.search_html) {
				//these attributes may have fragments of text from blog description, which can lead to false positives
				this.stripAttrs(clone, ['data-tumblelog-popover', 'data-json']);
				data = clone.innerHTML;
			} else {
				recoursiveWalk(clone, function(el) {
					if (el.nodeType == el.TEXT_NODE)
						data += ' '+el.nodeValue;
				});
			}
			data = data.toLowerCase();
			return data;
		},
		//converts a notification element into string for keyword lookup
		extractNotificationData : function (notification) {
			return this.extractPostData(notification);
		},
		//converts a note element into string for keyword lookup
		extractNoteData : function (note) {
			return this.extractPostData(note);
		},
		//post and notification processing routines - they do actual work of hiding/removing posts
		//returns a previous non-blacklisted post element or null
		getPreviousPost : function (post) {
			var prev = post.previousSibling;
			while ( (prev !== null) && ( (prev.nodeType != 1) || (prev.querySelector('.post:not(.new_post)') === null) ) )
				prev = prev.previousSibling;
			return prev;
		},
		//returns post author name or empty string
		getPostAuthor : function (post) {
			if (post === null) return '';
			var actual_post = post.querySelector('.post');
			if (actual_post !== null)
				return actual_post.getAttribute('data-tumblelog');
			else
				return '';
		},
		//if there are several posts from the same author in a row, all but first will have "same_user_as_last" class applied.
		//back in the day such posts had their author icon hidden
		//currently it seems to be unused, but we will adjust the class nonetheless
		adjustPost : function (post) {
			var actual_post = post.querySelector('.post');
			if (actual_post === null) return; //is it even a post?
			var prev = this.getPreviousPost(post); //look up the previous one
			if (prev === null) {
				//we're dealing with the first visible post on dashboard - just make sure it has no "same user" class applied
				actual_post.className = actual_post.className.replace(/\bsame_user_as_last\b/, '');
			} else {
				//there is a previous post - let's check the authors
				if (this.getPostAuthor(post) == this.getPostAuthor(prev))
					//same author - setting the class
					actual_post.className += ' same_user_as_last'; 
				else
					//different authors - removing the class
					actual_post.className = actual_post.className.replace(/\bsame_user_as_last\b/, '');
			}
		},
		//for those who didn't trigger any list
		ignorePost : function (post, reason) {
			post.setAttribute('data-tumblr-saviour-status', 'unaffected');
			post.setAttribute('data-tumblr-saviour-reason', reason);
			this.adjustPost(post);
		},
		ignoreNotification : function (notification, reason) {
			notification.setAttribute('data-tumblr-saviour-status', 'unaffected');
			notification.setAttribute('data-tumblr-saviour-reason', reason);
		},
		//for those that triggered whitelist
		whiteListPost : function (post, reason) {
			post.setAttribute('data-tumblr-saviour-status', 'whitelisted');
			post.setAttribute('data-tumblr-saviour-reason', reason);
			this.adjustPost(post);
		},
		whiteListNotification : function (notification, reason) {
			notification.setAttribute('data-tumblr-saviour-status', 'whitelisted');
			notification.setAttribute('data-tumblr-saviour-reason', reason);
		},
		whiteListNote : function (note, reason) {
			note.setAttribute('data-tumblr-saviour-status', 'whitelisted');
			note.setAttribute('data-tumblr-saviour-reason', reason);
		},
		//for those that triggered graylist
		hidePostSpoiler : function (post, reason) {
			post.setAttribute('data-tumblr-saviour-status', 'graylisted');
			post.setAttribute('data-tumblr-saviour-reason', reason);			
			var content = post.querySelector('.post_content_inner');
			var contentstyle = content.style.display;
			content.style.display = 'none';
			if (!content) return;
			var placeholder = document.createElement('div');
			placeholder.className = 'tumblr_saviour_placeholder';
			placeholder.innerHTML = '<span>You have been saved from this post because of: '+reason+'. </span>';
			var trigger = document.createElement('span');
			trigger.innerHTML = '[<span class="tumblr_saviour_trigger">Show</span>]';
			placeholder.appendChild(trigger);
			content.parentNode.insertBefore(placeholder, content);
			trigger.addEventListener('click', function(e) {
				e.preventDefault();
				content.style.display = contentstyle;
				placeholder.style.display = 'none';
				placeholder.parentNode.removeChild(placeholder);
			});
			this.adjustPost(post);
		},
		//for those that triggered blacklist
		hidePost : function (post, reason) {
			//soft removal - just hiding the post
			post.setAttribute('data-tumblr-saviour-status', 'blacklisted');
			post.setAttribute('data-tumblr-saviour-reason', reason);			
			post.style.display = 'none';
			//we have to strip it of "post" class to ensure that keyboard navigation won't see it
			var actual_post = post.querySelector('.post');
			if (actual_post !== null)
				actual_post.className = actual_post.className.replace(/\bpost\b/, '');
			//we should tell Tumblr to update it's keyboard navigation, if possible
			checkIfExists('Tumblr.KeyCommands.update_post_positions', function (update_post_positions) {
				try {
					update_post_positions();
				} catch (e) {
					//we ignore any errors that might have happened
				}
			});
		},
		removePost : function (post, reason) {
			post.parentNode.removeChild(post);
			//we should tell Tumblr to update it's keyboard navigation, if possible
			checkIfExists('Tumblr.KeyCommands.update_post_positions', function (update_post_positions) {
				try {
					update_post_positions();
				} catch (e) {
					//we ignore any errors that might have happened
				}
			});
		},
		hideNotification : function (notification, reason) {
			notification.setAttribute('data-tumblr-saviour-status', 'blacklisted');
			notification.setAttribute('data-tumblr-saviour-reason', reason);			
			notification.style.display = 'none';
		},
		removeNotification : function (notification, reason) {
			notification.parentNode.removeChild(notification);
		},
		removeNote : function (note, reason) {
			if (this.config.soft_removal) {
				note.setAttribute('data-tumblr-saviour-status', 'blacklisted');
				note.setAttribute('data-tumblr-saviour-reason', reason);
				note.style.display = 'none';
			} else {
				note.parentNode.removeChild(note);
			}			
		},
		//post and notification analysis routines - in case Tumblr changes something
		isMyPost : function (post) {
			return (post.querySelector('.not_mine') === null);
		},
		isSponsoredPost : function (post) {
			return (post.querySelector('.sponsored_post') !== null);
		},	
		isSponsoredNotification : function (notification) {
			return (notification.querySelector('.sponsor') !== null);
		},
		isRecommendedPost : function (post) {
			return (post.querySelector('.is_recommended') !== null) || (post.querySelector('.recommendation-reason-footer') !== null);
		},
		isRecommendedNotification : function (notification) {
			return checkSelectorMatch(notification,'.takeover-container');
		},
		//main post analysis routine
		analyzePost : function (post) {
			if (this.isMyPost(post)) {
				//user's own posts are always whitelisted
				this.whiteListPost(post, 'my post');
				return;
			}
			//check if it's a sponsored post
			if (this.isSponsoredPost(post))
				switch (this.config.sponsored_action){
					case this.config.actions.WHITELIST: {
						this.whiteListPost(post,'sponsored post');
						return;
					}; break;
					case this.config.actions.HIDE: {
						this.hidePost(post,'sponsored post');
						return;
					}; break;
					case this.config.actions.REMOVE: {
						this.removePost(post,'sponsored post');
						return;
					}; break;
					case this.config.actions.SPOILER: {
						this.hidePostSpoiler(post,'sponsored post');
						return;
					}; break;
					default: break;
				}
			//check if it's a recommended post
			if (this.isRecommendedPost(post))
				switch (this.config.recommended_action){
					case this.config.actions.WHITELIST: {
						this.whiteListPost(post,'recommended post');
						return;
					}; break;
					case this.config.actions.HIDE: {
						this.hidePost(post,'recommended post');
						return;
					}; break;
					case this.config.actions.REMOVE: {
						this.removePost(post,'recommended post');
						return;
					}; break;
					case this.config.actions.SPOILER: {
						this.hidePostSpoiler(post,'recommended post');
						return;
					}; break;
					default: break;
				}
			//white list takes priority
			var data = this.extractPostData(post);
			var keywords;
			keywords = this.findKeywords(data, this.config.whitelist);
			if (keywords.length) {
				this.whiteListPost(post, keywords.join(';'));
				return;
			}
			//black list
			keywords = this.findKeywords(data, this.config.blacklist);
			if (keywords.length) {
				this.hidePost(post, keywords.join(';'));
				return;
			}
			//check the gray list
			keywords = this.findKeywords(data, this.config.graylist);
			if (keywords.length) {
				this.hidePostSpoiler(post, keywords.join(';'));
				return;
			}
			//if nothing triggered, we mark post as such
			this.ignorePost(post, '');
		},
		//main notification analysis routine
		analyzeNotification : function (notification) {
			if (this.config.process_notifications_and_notes) {
				var data = this.extractNotificationData(notification);
				var keywords;
				keywords = this.findKeywords(data, this.config.whitelist);
				if (keywords.length) {
					this.whiteListNotification(notification, keywords.join(';'));
					return;
				}
				keywords = this.findKeywords(data, this.config.blacklist);
				if (keywords.length) {
					this.hideNotification(notification, keywords.join(';'));
					return;
				}
				if (this.isSponsoredNotification(notification))
					switch (this.config.sponsored_action){
						case this.config.actions.WHITELIST: {
							this.whiteListNotification(notification,'sponsored notification');
							return;
						}; break;
						case this.config.actions.SPOILER:
						case this.config.actions.HIDE: {
							this.hideNotification(notification,'sponsored notification');
							return;
						}; break;
						case this.config.actions.REMOVE: {
							this.removeNotification(notification,'sponsored notification');
							return;
						}; break;
						default: break;
					}
				if (this.isRecommendedNotification(notification))
					switch (this.config.recommended_action){
						case this.config.actions.WHITELIST: {
							this.whiteListNotification(notification,'recommended notification');
							return;
						}; break;
						case this.config.actions.SPOILER:
						case this.config.actions.HIDE: {
							this.hideNotification(notification,'recommended notification');
							return;
						}; break;
						case this.config.actions.REMOVE: {
							this.removeNotification(notification,'recommended notification');
							return;
						}; break;
						default: break;
					}
			}
			this.ignoreNotification(notification,'');
		},
		//main note analysis routine
		analyzeNote : function (note) {
			if (this.config.process_notifications_and_notes) {
				var data = this.extractNoteData(note);
				var keywords;
				keywords = this.findKeywords(data, this.config.whitelist);
				if (keywords.length) {
					this.whiteListNote(note, keywords.join(';'));
					return;
				}
				keywords = this.findKeywords(data, this.config.blacklist);
				if (keywords.length) {
					this.removeNote(note, keywords.join(';'));
					return;
				}
			}
		},
	};
	//=======================================================================
	//Function definitions (don't worry, JS will lift them to the beginning of the block)
	//=======================================================================
	//iterate through the node's descendants
	function recoursiveWalk(element, fn) {
		if (!fn(element) && (element.nodeType == element.ELEMENT_NODE))
			for (var i=0; i<element.childNodes.length; i++)
				recoursiveWalk(element.childNodes[i], fn);
	}
	//parsing semicolon-separated lists into sorted arrays
	function parseList(list) {
		var lst = list.split(';');
		var res = [];
		for (var i=lst.length-1;i>=0;i--) {
			if (lst[i].trim().length>0)
				res.push(lst[i].toLowerCase());
		}
		res.sort();
		return res;
	}
	//helper function that checks if specified object hierarchy exists in the page scope and returns boolean flag/runs a callback if it does.
	function checkIfExists(objects, callback) {
		if (typeof objects === 'string')
			objects = objects.split('.');
		var obj = unsafeWindow;
		for (var index = 0; index<objects.length; index++) {
			if (typeof obj[objects[index]] === 'undefined') 
				return false;
			else
				obj = obj[objects[index]];
		}
		if (typeof callback !== 'undefined')
			callback(obj);
		return true;
	}
	//helper function to determine if specified node matches specified selector
	function checkSelectorMatch(node, selector) {
		if (typeof node[checkSelectorMatch.method] == 'function') //not all nodes have required methods
			return node[checkSelectorMatch.method](selector);
		else //in that case, we simply assume it doesn't match
			return false;
	}
	//determining matching method supported by the browser
	checkSelectorMatch.method = (function(){ 
		var methods = ['matches', 'matchesSelector', 'mozMatchesSelector', 'webkitMatchesSelector'];
		for (var i=0; i<methods.length; i++)
			if (typeof Element.prototype[methods[i]] == 'function')
				return methods[i]; //match found, remember it for future use
		throw "No way to match selector found."; //no match - we have to fail miserably.
	})();
	
	//waits for a node specified by selector to appear/disappear
	function waitForSelector(selector, must_exist, callback, root) { 
		if (typeof root == 'undefined') //we search the whole document unless told otherwise
			root = document;
		//we check if the node has been added/removed already
		var prequery = root.querySelector(selector);
		if ( (prequery !== null) == must_exist ) {
			callback(prequery);
			return;
		}
		//it hasn't - we set up MutationObserver on root element to find it
		var mutation_callback = function(mutations) {
			//checking the list of mutations
			for (var i=0; i<mutations.length; i++) {
				//make sure the event is of correct type
				if (mutations[i].type == 'childList')
					if (must_exist) { //we're waiting for the node to appear, so we look for added nodes that match our selector
						for (var j=0; j<mutations[i].addedNodes.length; j++)
							if (checkSelectorMatch(mutations[i].addedNodes[j], selector)) 
								try {
									callback(mutations[i].addedNodes[j]);
								} 
								finally {
									mutation_callback.docobserver.disconnect();
									delete mutation_callback.docobserver;
									return;
								}
					} else { //we're waiting for the node to disappear, so we look for removed nodes that match our selector
						for (var j=0; j<mutations[i].removedNodes.length; j++)
							if (checkSelectorMatch(mutations[i].removedNodes[j], selector)) 
								try {
									callback(mutations[i].removedNodes[j]);
								} 
								finally {
									mutation_callback.docobserver.disconnect();
									delete mutation_callback.docobserver;
									return;
								}
					}
			}
		};
		mutation_callback.docobserver = new MutationObserver(mutation_callback);
		mutation_callback.docobserver.observe(root, { 
			attributes: false, 
			childList: true, 
			characterData: false, 
			subtree: true,
		});
	}

	//=======================================================================
	//Main script
	//=======================================================================
	//we prepare the DOM observers
	//observer for any new posts coming up
	var new_post_observer = new MutationObserver(function(mutations){
		for (var i=0; i<mutations.length; i++) { //looking through mutations list
			if (mutations[i].type == 'childList') 
				for (var j = 0; j<mutations[i].addedNodes.length; j++) { //only checking additions
					//is it a post?
					if (checkSelectorMatch(mutations[i].addedNodes[j], TumblrSaviour.config.post_selector)) {
						TumblrSaviour.analyzePost.call(TumblrSaviour, mutations[i].addedNodes[j]);
						post_update_observer.observe(mutations[i].addedNodes[j], post_update_observer_config);
					}
					//is it a notification?
					else if (checkSelectorMatch(mutations[i].addedNodes[j], TumblrSaviour.config.notification_selector))
						TumblrSaviour.analyzeNotification.call(TumblrSaviour, mutations[i].addedNodes[j]);
				}
		}
	});
	//configuration: interested only in immediates descendants being added/removed 
	var new_post_observer_config = {
		attributes: false, 
		childList: true, 
		characterData: false, 
		subtree: false,
	};
	//some post don't have post body initially - we have to schedule a check later.
	var post_update_observer = new MutationObserver(function(mutations){
		for (var i=0; i<mutations.length; i++) //looking through mutations list
			for (var j=0; j<mutations[i].addedNodes.length; j++)
				if (checkSelectorMatch(mutations[i].addedNodes[j], TumblrSaviour.config.post_body_selector)) {
					//looking for post node containing this body
					var node = mutations[i].addedNodes[j];
					while ((node !== null) && !checkSelectorMatch(node, TumblrSaviour.config.post_selector))
						node = node.parentNode;
					if (node !== null) //post node found
						TumblrSaviour.analyzePost.call(TumblrSaviour, node);
				}
	});
	//configuration: interested in any changes to DOM tree
	var post_update_observer_config = {
		attributes: false,
		childList: true, 
		characterData: false, 
		subtree: true,
	};
	//we wait for #posts to appear in the DOM tree
	waitForSelector('#posts', true, function(posts){
		//we immediately set an observer on it, so we can catch not-yet-loaded posts, as well as ones added dynamically by the paginator
		new_post_observer.observe(posts, new_post_observer_config);		
		//then we check for items already loaded
		var notifylist = posts.querySelectorAll(TumblrSaviour.config.notification_selector);
		for (var i=0; i<notifylist.length; i++)
			TumblrSaviour.analyzeNotification.call(TumblrSaviour, notifylist[i]);
		var postlist = posts.querySelectorAll(TumblrSaviour.config.post_selector);
		for (var i=0; i<postlist.length; i++)
			//some posts don't initially have a body
			if (postlist[i].querySelector(TumblrSaviour.config.post_body_selector) !== null)
				//if they do, we check them immediately
				TumblrSaviour.analyzePost.call(TumblrSaviour, postlist[i]);
			else
				//if they don't, we observe them so they will get checked once it appears
				post_update_observer.observe(postlist[i], post_update_observer_config);
	});
	//if we want to filter post notes, we will have to get our hands dirty
	if (TumblrSaviour.config.process_notifications_and_notes) {
		//once document is loaded and Tumblr scripts have been set up, we set a hook to catch the moment post notes are being loaded.
		window.addEventListener("load", function() {
			//we remember old function that handles notes loading 
			var old_load_notes = unsafeWindow.Tumblr.Notes.prototype.load_notes;
			//and replace it with ours
			unsafeWindow.Tumblr.Notes.prototype.load_notes = exportFunction(function($post,options,fn){
				//the idea is to allow Tumblr engine to load notes...
				old_load_notes.call(this, $post, options, exportFunction(function(data){
					//...and render those notes...
					var res = fn(data);
					//...but also to filter them immediately afterwards
					var notes = $post[0].querySelectorAll(TumblrSaviour.config.note_selector);
					for (var i=0; i<notes.length; i++)
						TumblrSaviour.analyzeNote.call(TumblrSaviour, notes[i]);
					return res;
				}, unsafeWindow));
			}, unsafeWindow);
		});
	}
	//we set up the configuration panel if possible
	if ( (typeof GM_config !== 'undefined') && (typeof GM_setValue === 'function') && (typeof GM_registerMenuCommand === 'function') ) {
		var fields = {
			"blacklist" : {
				"label" : "Blacklisted words",
				"title" : "Semicolon-separated list of words that will cause the post to disappear.",
				"type" : "text",
				"default" : GM_getValue('blacklist', ''),
			},
			"graylist" : {
				"label" : "Graylisted words",
				"title" : "Semicolon-separated list of words that will cause the post content to be hidden under spoiler.",
				"type" : "text",
				"default" : GM_getValue('graylist', ''),
			},
			"whitelist" : {
				"label" : "Whitelisted words",
				"title" : "Semicolon-separated list of words that will prevent post from being hidden for any reason. Your own posts are always whitelisted.",
				"type" : "text",
				"default" : GM_getValue('whitelist', ''),
			},
			"sponsored" : {
				"label" : "Action for sponsored posts",
				"title" : "If set to anything but 'process like any other post', this setting overrides the effect of lists above.",
				"type" : "select",
				"options" : {
					"0" : "process like any other post",
					"1" : "whitelist post",
					"2" : "blacklist post",
					"3" : "hide post under spoiler",
					"4" : "remove from the page",
				},
				"default" : GM_getValue('sponsored', '0'),
			},
			"recommended" : {
				"label" : "Action for recommended posts",
				"title" : "If set to anything but 'process like any other post', this setting overrides the effect of lists above.",
				"type" : "select",
				"options" : {
					"0" : "process like any other post",
					"1" : "whitelist post",
					"2" : "blacklist post",
					"3" : "hide post under spoiler",
					"4" : "remove from the page",
				},
				"default" : GM_getValue('recommended', '0'),
			},
			"notes" : {
				"label" : "Process notifications and notes as well",
				"type" : "checkbox",
				"default" : !!GM_getValue('notes', 0),
			},
			"inhtml" : {
				"label" : "Check HTML code of the post instead of its text",
				"type" : "checkbox",
				"default" : !!GM_getValue('inhtml', 0),
			},
			save: function() {
				GM_config.values['blacklist'] = parseList(GM_config.values['blacklist']).join(";");
				GM_config.values['graylist'] = parseList(GM_config.values['graylist']).join(";");
				GM_config.values['whitelist'] = parseList(GM_config.values['whitelist']).join(";");
				for (var key in GM_config.values)
					GM_setValue(key,GM_config.values[key]);
			},
		};
		var CSS = [
			'.section_header,.reset_holder { display: none !important; }',
			'body {background-color: #FFF;}',
			'* {font-family: "Helvetica Neue","HelveticaNeue",Helvetica,Arial,sans-serif; color: #444;}',
			'#header {border-bottom: 2px solid #E5E5E5; font-size: 24px; font-weight: normal; line-height: 1; margin: 0px; padding-bottom: 28px;}',
			'.config_var {padding: 2px 0px 2px 200px;}',
			'.config_var>* {vertical-align:middle;}',
			'.config_var .field_label {font-size: 14px !important;line-height: 1.2; display:inline-block; width:200px; margin: 0 0 0 -200px;}',
			'#field_blacklist,#field_graylist,#field_whitelist {width: 100%}',
			'button {padding: 4px 7px 5px; font-weight: 700; border-width: 1px; border-style: solid; text-decoration: none; border-radius: 2px; cursor: pointer; display: inline-block; height: 30px; line-height: 20px;}',
			'#saveBtn {color: #FFF; border-color: #529ECC; background: #529ECC none repeat scroll 0% 0%;}',
			'#cancelBtn {color: #FFF; border-color: #9DA6AF; background: #9DA6AF none repeat scroll 0% 0%;}',
			""].join("\n");
		GM_addStyle([
			'#GM_config {border-radius: 3px !important; border: 0px none !important;}',
			'.tumblr_saviour_placeholder { display: block; padding: 20px;}',
			'.tumblr_saviour_trigger { cursor: pointer !important; text-decoration: underline !important; }',
		""].join("\n"));
		GM_config.init("Tumblr Saviour Settings", fields, CSS);
		GM_registerMenuCommand("Tumblr Saviour Settings", function() {GM_config.open();});
	}

})();