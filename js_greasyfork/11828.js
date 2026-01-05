// ==UserScript==
// @name		Tumblr Dashboard Tracker
// @namespace	the.vindicar.scripts
// @description	Checks what's going on on your dashboard, loads new posts and plays a sound if something interesting happens.
// @version	    1.1.1
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @require 	https://greasyfork.org/scripts/1884-gm-config/code/GM_config.js?version=4836
// @include	    http://www.tumblr.com/dashboard
// @include	    https://www.tumblr.com/dashboard
// @downloadURL https://update.greasyfork.org/scripts/11828/Tumblr%20Dashboard%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/11828/Tumblr%20Dashboard%20Tracker.meta.js
// ==/UserScript==

(function(){
	'use strict';
	// ====================================== Configuration ======================================	
	//If we have no access to Greasemonkey methods, we will need dummy replacements
	if (typeof GM_getValue !== 'function') GM_getValue = function (target, deflt) { return deflt; };
	//configuration
	var cfg = {
		track_inbox : !!GM_getValue("track_inbox", true),
		track_answers : !!GM_getValue("track_answers", true),
		track_replies : !!GM_getValue("track_replies", true),
		track_mentions : !!GM_getValue("track_mentions", true),
		track_messages : !!GM_getValue("track_messages", true),
		track_reblogs_followed : !!GM_getValue("track_reblogs_followed", true),
		track_reblogs_other : !!GM_getValue("track_reblogs_other", false),
		track_everything : !!GM_getValue("track_everything", false),
		notify_mode_default : GM_getValue("notify_mode_default", "last"),
		notify_mode : GM_getValue("notify_mode", "auto"),
		notify_sound : !!GM_getValue("notify_sound", false),
		notify_soundurl : GM_getValue("notify_soundurl", ""),
		update_autoload : !!GM_getValue("update_autoload", true),
		update_stopafter : parseInt(GM_getValue("update_stopafter", "100"),10),
		update_unread_style : GM_getValue("update_unread_style", "border: 3px solid #529ECC;"),
		update_unmark_delay : 100,
	};
	//we set up the configuration panel if possible
	if ( (typeof GM_config !== 'undefined') && (typeof GM_setValue === 'function') && (typeof GM_registerMenuCommand === 'function') ) {
		//this function is called when user presses "play" button in the configuration panel
		var playclick = function () {
			var doc = this.ownerDocument.documentElement; //since we're inside iframe, we have to access it's document element this way
			try {
				var sound = new Audio(doc.querySelector("#field_notify_soundurl").value);
				sound.play();
			} catch (e) {
				alert("Couldn't play the sound.");
			}
		};
		//configuration input fields
		var fields = {
			"track_inbox" : {
				"label" : "Inbox messages",
				"title" : "Receive notification if there are new unread messages in your inbox.",
				"section" : ["Tracking"],
				"type" : "checkbox",
				"default" : cfg.track_inbox,
			},
			"track_answers" : {
				"label" : "Answers to your asks",
				"title" : "Receive notification every time someone answers an ask you sent.",
				"type" : "checkbox",
				"default" : cfg.track_answers,
			},
			"track_replies" : {
				"label" : "Replies to your posts",
				"title" : "Receive notification every time someone replies to your post.",
				"type" : "checkbox",
				"default" : cfg.track_replies,
			},
			"track_mentions" : {
				"label" : "Mentions",
				"title" : "Receive notification every time someone mentions you in their post.",
				"type" : "checkbox",
				"default" : cfg.track_mentions,
			},
			"track_messages" : {
				"label" : "Messages",
				"title" : "Receive notification every time someone messages you via IM system.",
				"type" : "checkbox",
				"default" : cfg.track_messages,
			},
			"track_reblogs_followed" : {
				"label" : "Reblogs by blogs you follow",
				"title" : "Receive notification every time a blog you follow reblogs your post.",
				"type" : "checkbox",
				"default" : cfg.track_reblogs_followed,
			},
			"track_reblogs_other" : {
				"label" : "Reblogs by other blogs",
				"title" : "Receive notification every time some other blog reblogs your post.",
				"type" : "checkbox",
				"default" : cfg.track_reblogs_any,
			},
			"track_everything" : {
				"label" : "Any posts",
				"title" : "Receive notification every time there are new posts on your dashboard. Are you sure?",
				"type" : "checkbox",
				"default" : cfg.track_everything,
			},
			"notify_mode_default" : {
				"label" : "By default notifications are",
				"title" : "Default state of notifications when reloading the page.\nYou can change the current state with control next to the Tumblr logo.",
				"section" : ["Notifications"],
				"type" : "select",
				"options" : {
					"last" : "in the same state as before",
					"on" : "always enabled",
					"auto" : "enabled when not viewed",
					"off" : "always disabled",
				},
				"default" : cfg.notify_mode_default,
			},
			"notify_sound" : {
				"label" : "Play sound",
				"title" : "Play a sound every time you receive a notification.",
				"type" : "checkbox",
				"default" : cfg.notify_sound,
			},
			"notify_soundurl" : {
				"label" : "Sound file URI",
				"title" : "This sound will play every time you receive a notification.\nHint: you can save a sound file right here if you convert it into a 'data:' URI.",
				"type" : "text",
				"default" : cfg.notify_soundurl,
			},
			"notify_sound_play" : {
				"label" : "Play",
				"title" : "Press to play the sound above.",
				"type" : "button",
				"script" : "("+playclick.toString()+").call(this)",
			},
			"update_autoload" : {
				"label" : "Load unread posts",
				"title" : "Unread posts will be loaded and added onto the top of the dashboard.",
				"section" : ["Autoupdate"],
				"type" : "checkbox",
				"default" : cfg.update_autoload,
			},
			"update_stopafter" : {
				"label" : "Post autoloading limit",
				"title" : "How many posts should be loaded before disabling autoloading feature.",
				"type" : "text",
				"size" : "5",
				"default" : cfg.update_stopafter,
			},
			"update_unread_style" : {
				"label" : "Unread posts style",
				"title" : "These CSS definitions will be applied to any unread posts that have been loaded. Example:\nborder: solid 1px #99F;",
				"type" : "text",
				"default" : cfg.update_unread_style,
			},
			save: function() {
				var donotsave = ["notify_sound_play"];
				for (var key in GM_config.values) {
					if (donotsave.indexOf(key) == -1)
						GM_setValue(key,GM_config.values[key]);
				}
			},
		};
		//styles for configuration form controls
		var configFormCSS = [
			'.reset_holder { display: none !important; }',
			'body {background-color: #FFF;}',
			'* {font-family: "Helvetica Neue","HelveticaNeue",Helvetica,Arial,sans-serif; color: #444;}',
			'#header {border-bottom: 2px solid #E5E5E5; font-size: 24px; font-weight: normal; line-height: 1; margin: 0px; padding-bottom: 28px;}',
			'.section_header {border: 0px none; margin: 16px 0px 16px 0px; padding: 0px; font-size: 20px; font-weight: normal; line-height: 1;  background-color: transparent; color: inherit; text-decoration: none;}',
			'.config_var {padding: 2px 0px 2px 200px;}',
			'.config_var>* {vertical-align:middle;}',
			'.config_var .field_label {font-size: 14px !important;line-height: 1.2; display:inline-block; width:200px; margin: 0 0 0 -200px;}',
			'#field_notify_soundurl,#field_update_unread_style {width: 100%}', 
			'button {padding: 4px 7px 5px; font-weight: 700; border-width: 1px; border-style: solid; text-decoration: none; border-radius: 2px; cursor: pointer; display: inline-block; height: 30px; line-height: 20px;}',
			'#saveBtn {color: #FFF; border-color: #529ECC; background: #529ECC none repeat scroll 0% 0%;}',
			'#cancelBtn {color: #FFF; border-color: #9DA6AF; background: #9DA6AF none repeat scroll 0% 0%;}',
			""].join("\n");
		//style for the configuration form window. Since it's an iframe element inside the main window, we have to add this style to the main page
		GM_addStyle('#GM_config {border-radius: 3px !important; border: 0px none !important;}');
		//style for unread posts, if autoloading is enabled
		if (cfg.update_autoload && (cfg.update_unread_style.indexOf("}") == -1))
			GM_addStyle('.tracker-unread-post .post {'+cfg.update_unread_style+'}');
		GM_config.init("Tumblr Dashboard Tracker Settings", fields, configFormCSS);
		GM_registerMenuCommand("Tumblr Dashboard Tracker Settings", function() {GM_config.open();});		
	}
	//global styles for notification mode switch
	var globalCSS = [
		'#tumblr-dashboard-tracker-mode {width: 12px; height: 24px; background: transparent; overflow: hidden; padding: 0; margin: 3px 16px 0px 16px; display:inline-block; border-radius: 6px;}',
		'#tumblr-dashboard-tracker-mode > span { border : 0 none; border-radius: 6px; width: 12px; height: 12px; display:inline-block; position: relative; }',
		'#tumblr-dashboard-tracker-mode[data-state="on"] {border: 1px solid #FFFFFF;}',
		'#tumblr-dashboard-tracker-mode[data-state="auto"] {border: 1px solid #529ECC;}',
		'#tumblr-dashboard-tracker-mode[data-state="off"] {border: 1px solid #A1A1A1;}',
		'#tumblr-dashboard-tracker-mode[data-state="on"] > span {background-color: #FFFFFF; top: -4px;}',
		'#tumblr-dashboard-tracker-mode[data-state="auto"] > span {background-color: #529ECC; top: 3px;}',
		'#tumblr-dashboard-tracker-mode[data-state="off"] > span {background-color: #A1A1A1; top: 10px;}'
	].join("\n");
	GM_addStyle(globalCSS);

	// ====================================== Dashboard Tracker ======================================
	function Tracker(cfg)
	{
		this.config = cfg;
		this.original = {};
		this.loadcounter = 0;
		this.knownitems = {};
		this.unread_interval_id = null;
		this.page_visible = true;
		this.sound = null;
		this.unreadcount = 0;
		this.inboxcount = 0;
		this.unreadmessagescount = 0;
	}
	//Tumblr.Thoth is a Tumblr module that updates unread posts & inbox messages counters.
	//we replace some of the methods there with our own, letting Tumblr handle the rest.
	//It's also easier to hook up to couple of Tumblr events than to track them ourselves.
	Tracker.prototype.install = function () {
		//we make sure event handlers are called in correct context (with correct 'this' value).
		var that = this;
		if (this.track_everything || this.config.track_reblogs_followed || this.config.update_autoload) {
			//we have to parse incoming posts to do any of these!
			this.original['parse_unread'] = unsafeWindow.Tumblr.Thoth.__proto__.parse_unread;
			unsafeWindow.Tumblr.Thoth.__proto__.parse_unread = exportFunction(function(heartbeat){
				return that.parse_unread.call(that, heartbeat);
				//we completely replace the old function
				//return that.original.parse_unread.call(this, heartbeat);
			}, unsafeWindow);
			//we calculate hashes for all items currently displayed on the Dashboard.
			//it will allow us to find out if we have reached the items already displayed when dynamically updating the Dashboard.
			//Note: hashes for the items on the next pages are not needed. Probably.
			var dashboard = document.querySelectorAll('#posts>li');
			for (var i=0; i<dashboard.length; i++)
				this.knownitems[this.get_item_hash(dashboard[i])] = true;
		}
		if (this.config.track_reblogs_other || this.config.track_mentions || this.config.track_replies) {
			//these can be taken from incoming notifications
			this.original['parse_notifications'] = unsafeWindow.Tumblr.Thoth.__proto__.parse_notifications;
			unsafeWindow.Tumblr.Thoth.__proto__.parse_notifications = exportFunction(function(heartbeat){
				that.parse_notifications.call(that, heartbeat);
				return that.original.parse_notifications.call(this, heartbeat);
			}, unsafeWindow);
		}
		if (this.config.track_inbox) {
			//Inbox is handled by this method
			this.original['parse_inbox'] = unsafeWindow.Tumblr.Thoth.__proto__.parse_inbox;
			unsafeWindow.Tumblr.Thoth.__proto__.parse_inbox = exportFunction(function(heartbeat){
				that.parse_inbox.call(that, heartbeat);
				return that.original.parse_inbox.call(this, heartbeat);
			}, unsafeWindow);
		}
		if (this.config.track_messages) {
			//Instant messaging is handled by this event.
			unsafeWindow.Tumblr.Events.listenTo(unsafeWindow.Tumblr.Events, 'toaster:updateMessagingUnreadCounts', 
				exportFunction(function(heartbeat){
					that.parse_messages.call(that, heartbeat);
				}, unsafeWindow));
			//unsafeWindow.Tumblr.Events.listenTo(unsafeWindow.Tumblr.Events, 'toaster:updateMessagingUnreadCounts', handler);
		}
		//if we will be autoloading posts, we will need an event handler to mark the posts as read
		if (this.config.update_autoload) {
			var handler = function(){that.unmark_unread_posts.call(that);};
			//set event handler that will trigger when window is scrolled
			window.addEventListener("scroll", function(){
				if (that.unread_interval_id !== null)
					clearTimeout(that.unread_interval_id);
				that.unread_interval_id = setTimeout(handler,that.config.update_unmark_delay);
			});
		}
		//we install an event handler that tracks page visibility state
		setVisibilityHandler(function(visible){that.page_visible = visible;}, true);
		//prepare the notification sound player
		if (this.config.notify_sound)
			try {
				this.sound = new Audio(this.config.notify_soundurl);
			} catch (e) {
				this.config.notify_sound = false;
			}
		//select initial notification mode
		switch (this.config.notify_mode_default) {
			case "on" : this.config.notify_mode = "on"; break;
			case "off" : this.config.notify_mode = "off"; break;
			case "auto" : this.config.notify_mode = "auto"; break;
			case "last" : ; break;
			default : ; break;
		}
		//create and place notification mode switch
		this.createModeSwitch(this.config.notify_mode);
	};
	//Creates and places notification mode switch
	Tracker.prototype.createModeSwitch = function (state) {
		if (typeof state == 'undefined') state = 'auto';
		var outer = document.createElement('span');
		outer.setAttribute('id','tumblr-dashboard-tracker-mode');
		var inner = document.createElement('span');
		outer.appendChild(inner);
		var that = this;
		outer.addEventListener('click', function() {return that.onModeChange.apply(that, arguments);}, true);
		var target = document.querySelector('#user_tools');
		target.appendChild(outer);
		this.setMode(state, outer);
	};
	//Changes notification mode, both internally and in UI (yeah, yeah, I know it's bad practice).
	Tracker.prototype.setMode = function (newstate, control) {
		//we can accept the control that was given, or find it ourselves
		if (!control) control = document.querySelector('#tumblr-dashboard-tracker-mode');
		var titles = {
			on : 'Notify always',
			auto : 'Notify if page is not visible',
			off : 'Disable notifications',
		};
		this.config.notify_mode = newstate;
		control.setAttribute('data-state', newstate);
		control.setAttribute('title', titles[newstate]);
		//immediately remember the new mode
		GM_setValue('notify_mode', newstate);
	};
	//This method is triggered when notification mode switch is clicked
	Tracker.prototype.onModeChange = function (event) {
		event = event || window.event;
		var control = event.target; //we find the actual control containing the clicked element
		while (control && (control.getAttribute('id') != 'tumblr-dashboard-tracker-mode'))
			control = control.parentNode;
		if (!control) return;
		var newstate;
		//logic that determines the new notification mode
		switch (control.getAttribute('data-state')) {
			case "on":  newstate = 'off'; break;
			case "off": newstate = 'auto'; break;
			case "auto": newstate = 'on'; break;
			default : newstate = 'auto'; break;
		}
		this.setMode(newstate, control);
		event.stopPropagation();
		return false;
	};
	//This method handles any dashboard 'event' we have detected
	Tracker.prototype.event = function (event) {
		//we do nothing if notifications are disabled, or auto-enabled but page is being viewed
		if ((this.config.notify_mode == "off") || ((this.config.notify_mode == "auto") && this.page_visible))
			return;
		if (this.config.notify_sound && this.sound)
			this.sound.play();
	};
	//Parse incoming notifications for the Tumblr.Toaster
	Tracker.prototype.parse_notifications = function (heartbeat) {
		if (typeof heartbeat.notifications !== 'object') return;
		var notifs = heartbeat.notifications;
		for (var i=0; i<notifs.length; i++)
			switch (notifs[i].type) {
				case "reblog":
					if (this.config.track_reblogs_other) 
						this.event({type:'reblog'}); 
					break;
				case "user_mention":
					if (this.config.track_mentions) 
						this.event({type:'mention'});
					break;
				case "answer":
				case "ask_answer":
					if (this.config.track_answers)
						this.event({type:'answer'});
				case "reply":
				case "photo_reply":	
					if (this.config.track_replies) 
						this.event({type:'reply'});
					break;
			}
	};
	//Parse unread inbox messages.
	Tracker.prototype.parse_inbox = function (heartbeat) {
		if (typeof heartbeat.inbox !== "number") return;
		//if number of unread messages in the inbox have increased since last time, we send another notification
		if (heartbeat.inbox > this.inboxcount) {
			this.event({type:'inbox'});
		}
		//we update the counters if necessary
		if (heartbeat.inbox != this.inboxcount) {
			this.inboxcount = heartbeat.inbox;
			this.update_counters();
		}
	};
	//Parse unread conversations.
	Tracker.prototype.parse_messages = function (heartbeat) {
		if (typeof heartbeat.unread_messages !== "object") return;
		var val = document.querySelector('#messaging_button .tab_notice_value');
		var unread = (val && val.innerHTML) ? parseInt(val.innerHTML, 10) : 0;
		//if number of unread messages have increased since last time, we send another notification
		if (unread > this.unreadmessagescount) {
			this.event({type:'IM'});
		}
		//we update the counters if necessary
		if (unread != this.unreadmessagescount) {
			this.unreadmessagescount = unread;
			this.update_counters();
		}
	};
	//Parse unread posts. This function completely takes over original Tumblr.Thoth method.
	Tracker.prototype.parse_unread = function (heartbeat) {
		if ((typeof heartbeat.unread !== "number")&&(typeof heartbeat.abacus !== "number")) return;
		if (this.unreadcount >= this.config.update_stopafter) {
			//we tell Tumblr to stop polling if too many unread posts have accumulated
			unsafeWindow.Tumblr.Thoth.options.check_posts = false;
		}
		var unread = unsafeWindow.Tumblr.Thoth.use_new_abacus ? heartbeat.abacus : heartbeat.unread;
		if (unread > 0)
			this.load_page(1, this.get_first_post_id());
		return unread;
	};
	//this function loads specified page of dashboard using Tumblr service URL.
	//Callback it uses can query next page if necessary
	Tracker.prototype.load_page = function (page, id) {
		var request = new XMLHttpRequest();
		request.open('GET', 'https://www.tumblr.com/svc/dashboard/'+page+'/'+id);
		var that = this;
		request.onreadystatechange = function() {
			if ((request.readyState != 4) || (request.status != 200)) return;
			var data;
			try { data = JSON.parse(request.responseText); } catch (e) { data = {}; }
			if ((typeof data.meta !== 'object') || data.meta.status != 200) return;
			var postdata = data.response.DashboardPosts.body;
			if (postdata.indexOf("<!-- START POSTS -->") !== -1)
				postdata = postdata.split("<!-- START POSTS -->")[1].split("<!-- END POSTS -->")[0];
			that.parse_unread_success.call(that, postdata, page);
		};
		request.send();
	};
	//parses the posts we have loaded, checks them for events of interest and attaches them to the top of the Dashboard
	Tracker.prototype.parse_unread_success = function (html, page) {
		//posts container
		var posts_container = document.querySelector('#posts');
		//first seen element on the dashboard (aside from new post buttons)
		var first_seen = posts.querySelector('li:not(#new_post_buttons)');
		//remember position of the first seen element
		var offset = first_seen.offsetTop;
		//position at which we will be adding new items
		var insertion_mark = first_seen.previousSibling;
		//flag indicating if we had met an item we already saw - in case we have more than one page of new posts
		var known_item_found = false;
		//last added post id
		var last_id;
		//load items into a DOM container
		var container = document.createElement('body');
		container.innerHTML = html;
		//amount of posts that were loaded but not displayed (we should count them as unread)
		var not_diplayed_unread_count = 0;
		//look for posts
		var items = container.querySelectorAll('body>li');
		//we process items in the order they appear - reverse chronological
		for (var i=0; i<items.length; i++) {
			//get item hash
			var hash = this.get_item_hash(items[i]);
			//if we ran into an item we saw before then there is no need to process the rest
			if (this.knownitems[hash]) {
				known_item_found = true;
				break;
			}
			var post = items[i].querySelector('.post');
			if (post) {
				last_id = post.getAttribute('id').slice(5);
				//if we have a reblogged post and actually want to see if it was reblogged from us by someone we follow
				if (this.config.track_reblogs_followed && /\bis_reblog\b/.test(post.className)) {
					//parse data attribute thoughtfully provided by Tumblr
					var json_data = JSON.parse(post.getAttribute('data-json'));
					//if original post was ours, and we follow the blog
					if ((typeof json_data['tumblelog-parent-data'] === 'object') && 
						(typeof json_data['tumblelog-data'] === 'object') && 
						json_data['tumblelog-parent-data']['is_you'] &&
						json_data['tumblelog-data']["following"]) { 
						//we send notification
						this.event({type:'reblog'});
						}
					}
			} else if (/\bnotification\b/.test(items[i].className)) { //it's a notification
				if (this.config.track_answers && /\bnotification_ask_answer\b/.test(items[i].className))
					this.event({type:'answer'});
				else if (this.config.track_reblogs_other && /\bnotification_reblog\b/.test(items[i].className))
					this.event({type:'reblog'});
				else if (this.config.track_mentions && /\bnotification_user_mention\b/.test(items[i].className))
					this.event({type:'mention'});
			}
			//if user wants it, we should now display the item at the Dashboard
			if (this.config.update_autoload && (this.loadcounter < this.config.update_stopafter)) {
				//add the node to the main DOM tree
				insertion_mark = posts_container.insertBefore(items[i],insertion_mark.nextSibling);
				//remember the node as seen
				this.knownitems[hash] = true;
				if (post) {
					//mark post as unread
					items[i].className += ' tracker-unread-post';
					//added posts counter
					this.loadcounter++;
				}
			}
			else //otherwise we remember that it's an unread post
				not_diplayed_unread_count++;
		}
		if (this.config.update_autoload) {
			if (!known_item_found) {
				//we didn't find a known item - we might have more than one page of new posts incoming
				//if we saw no posts at all, we have to use the first post id we can get our hands on
				if (!last_id) last_id = this.get_first_post_id();
				//we query another page, that will, in turn, use this function as callback. Yay, recursion!
				this.load_page(page+1, last_id);
			}
			//meanwhile we take care of the posts we know about
			//we scroll the down in such a way that relative position of the first visible element won't change
			window.scrollBy(0, first_seen.offsetTop - offset);
			//we should tell Tumblr to update it's keyboard navigation, if possible
			unsafeWindow.Tumblr.KeyCommands.update_post_positions();
			//if we're autoloading posts, then the unread post count can be calculated as sum of numbers of loaded and not loaded unread posts
			this.unreadcount = document.querySelectorAll("#posts>.tracker-unread-post").length + not_diplayed_unread_count;
		}
		else //otherwise, all unread posts are not loaded
			this.unreadcount = not_diplayed_unread_count;
		this.update_counters();
	};
	Tracker.prototype.get_first_post_id = function () {
		var post = document.querySelector('#posts .post');
		if (post !== null)
			return post.getAttribute('data-id');
		else
			throw "get_first_post_id(): No posts found at all!";
	};
	//computes simple hash of a dashboard item. 
	//It's necessary for us to find which posts and notifications we have seen already, so we won't duplicate them.
	Tracker.prototype.get_item_hash = function (li) {
		if (/\bpost_container\b/.test(li.className)) {
			return 'POST:'+li.getAttribute('data-pageable');
		} else if (/\bnotification\b/.test(li.className)) {
			return 'NOTIFICATION:'+li.querySelector('.notification_sentence').innerHTML;
		} else
			return 'UNKNOWN:'+li.innerHTML;
	};
	//This methods updates unread posts counter. Unlike it's Tumblr prototype, it can remove the counter if it's reduced to zero.
	Tracker.prototype.update_counters = function () {
		//any place that show unread post counter
		var fields = document.querySelectorAll(".new_post_notice_container");
		for (var i=0;i<fields.length;i++) {
				//actual element to display the number in
				fields[i].querySelector(".tab_notice_value").innerHTML = this.unreadcount.toString(10);
				if (this.unreadcount>0) //if there are unread posts
					fields[i].className += ' tab-notice--active';
				else //if there are none
					fields[i].className = fields[i].className.replace(/\s*\btab-notice--active\b/, '');
			}
		//remove post counter in the title (if any)
		var title = document.title.replace(/^(\{[0-9+]+\})?\s*(\([0-9+]\))?\s*(\[[0-9+]+\])?/,''); 
		//if there are unread posts, we display it in the title too
		if (this.unreadmessagescount>0)
			title = '{'+this.unreadmessagescount.toString(10)+'}'+title;
		if (this.inboxcount>0)
			title = '['+this.inboxcount.toString(10)+']'+title;
		if (this.unreadcount>0)
			title = '('+this.unreadcount.toString(10)+')'+title;
		document.title = title;
	};
	//This method gets called after user has been scrolling.
	//It checks if any posts got scrolled by (their top is not hidden above the viewport) and removes unread mark from them.
	Tracker.prototype.unmark_unread_posts = function () {
		//find all unread posts
		var unread = document.querySelectorAll("#posts>.tracker-unread-post");
		//we check them in reverse order, from bottom to top. 
		//it's important, because we can stop the moment we find one that's still hidden
		var changed = false;
		for (var i=unread.length-1;i>=0;i--) {
			var rect = unread[i].getBoundingClientRect();
			if (rect.top<0) //if top of the post is above the window border
				break; //we consider it invisible, as well as all posts above it
			changed = true;
			//mark it as read
			unread[i].className = unread[i].className.replace(/\s*\btracker-unread-post\b/, '');
		}
		if (changed) {//if anything has changed, we correct the numbers
			//the unread post count
			this.unreadcount = document.querySelectorAll("#posts>.tracker-unread-post").length;
			this.update_counters();
		}
	};
	// ====================================== Helpers ======================================
	//Calls func() every time page visibility changes, with one boolean parameter keeping current visibility state
	function setVisibilityHandler(func, invoke_now) {
		//Page Visibility API
		var method;
		var methods = { 'hidden':'visibilitychange', 'mozHidden':'mozvisibilitychange', 'webkitHidden':'webkitvisibilitychange', 'msHidden':'msvisibilitychange', 'oHidden':'ovisibilitychange' };
		var handler = function(event) {
			event = event || window.event;
			if ((event.type == "focus") || (event.type == "focusin"))
				func(true);
			else if ((event.type == "blur") || (event.type == "focusout"))
				func(false);
			else
				func(!document[method]);
		};
		window.addEventListener('blur', handler, false);
		window.addEventListener('focus', handler, false);
		for (method in methods)
			if (methods.hasOwnProperty(method) && (method in document)) {
				document.addEventListener(methods[method], handler, false);
				if (invoke_now) func(!document[method]);
				return;
			}
	};
	// ====================================== Main ======================================
	var tracker = new Tracker(cfg);
	tracker.install();
	/*
	unsafeWindow.Tumblr.Prima.Events.listenTo(unsafeWindow.Tumblr.Prima.Events, 'all',
			exportFunction(function(){
				console.log(arguments);
			}, unsafeWindow));
	*/
})();