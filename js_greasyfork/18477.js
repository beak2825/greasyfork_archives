// ==UserScript==
// @name		Robin Enhancement Script
// @namespace	https://www.reddit.com/
// @version		3.3.5
// @description	Highlight mentions, make links clickable, add tabbed channels & automatically remove spam
// @author		Bag, netnerd01
// @match		https://www.reddit.com/robin*
// @grant		none
// @grant		GM_setValue
// @grant		GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/18477/Robin%20Enhancement%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/18477/Robin%20Enhancement%20Script.meta.js
// ==/UserScript==
(function() {

	// Grab users username + play nice with RES
	var robin_user = $("#header-bottom-right .user a").first().text().toLowerCase();
	var ignored_users = {};

	// for spam counter - very important i know :P
	var blocked_spam_el = null;
	var blocked_spam = 0;

	// via RobinEggs
	var messageHistory = [];
	var messageHistoryIndex = -1;
	var _robin_grow_detected = false;

	var colors = [
		'rgba(255,0,0,0.1)',
		'rgba(0,255,0,0.1)',
		'rgba(0,0,255,0.1)',
		'rgba(0,255,255,0.1)',
		'rgba(255,0,255,0.1)',
		'rgba(255,255,0,0.1)',
		'rgba(211,211,211, .1)',
		'rgba(0,100,0, .1)',
		'rgba(255,20,147, .1)',
		'rgba(184,134,11, .1)',
	 ];


	// Play nice with Greasemonkey
	if(typeof GM_getValue === "undefined") GM_getValue = function(){return false;};
	if(typeof GM_setValue === "undefined") GM_setValue = function(){return false;};

	/**
	 * Pull tabber out in to semi-stand alone module
	 * Big thanks to netnerd01 for his pre-work on this
	 *
	 * Basic usage - tabbedChannels.init( dom_node_to_add_tabs_to );
	 * and hook up tabbedChannels.proccessLine(lower_case_text, jquery_of_line_container); to each line detected by the system
	 */
	var tabbedChannels = new function(){
		var _self = this;

		// Default options
		this.channels = ["~","*",".","%","$","#",";","^","<3",":gov","#rpg","@"];
		this.mode = 'single';

		// internals
		this.unread_counts = {};
		this.$el = null;
		this.$opt = null;
		this.defaultRoomClasses = '';
		this.channelMatchingCache = [];

		//channels user is in currently
		this.currentRooms = 0;

		// When channel is clicked, toggle it on or off
		this.toggle_channel = function(e){
			var channel = $(e.target).data("filter");
			if(channel===null)return; // no a channel

			if(!$("#robinChatWindow").hasClass("robin-filter-" + channel)){
				_self.enable_channel(channel);
				$(e.target).addClass("selected");
				// clear unread counter
				$(e.target).find("span").text(0);
				_self.unread_counts[channel] = 0;
			}else{
				_self.disable_channel(channel);
				$(e.target).removeClass("selected");
			}

			// scroll everything correctly
			_scroll_to_bottom();
		};

		// Enable a channel
		this.enable_channel = function(channel_id){

			// if using room type "single", deslect other rooms on change
			if(this.mode == "single"){
				this.disable_all_channels();
			}

			$("#robinChatWindow").addClass("robin-filter robin-filter-" + channel_id);
			$("#robinChatWindow").attr("data-channel-key", this.channels[channel_id]);
			this.currentRooms++;
			// unselect show all 
			_self.$el.find("span.all").removeClass("selected");
		};

		// disable a channel
		this.disable_channel = function(channel_id){	
			$("#robinChatWindow").removeClass("robin-filter-" + channel_id);
			this.currentRooms--;

			// no rooms selcted, run "show all"
			if(this.currentRooms == 0){
				this.disable_all_channels();
			}else{
				// Grab next channel name if u leave a room in multi mode
				$("#robinChatWindow").attr("data-channel-key", $(".robin-filters span.selected").first().data("filter-name"));
			}
		};

		// turn all channels off
		this.disable_all_channels = function(e){
			$("#robinChatWindow").attr("class", _self.defaultRoomClasses).attr("data-channel-key","");
			_self.$el.find(".robin-filters > span").removeClass("selected");
			this.currentRooms = 0;

			_self.$el.find("span.all").addClass("selected");
			_scroll_to_bottom();
		};

		// render tabs
		this.drawTabs = function(){
			html = '';
			for(var i in this.channels){
				if(typeof this.channels[i] === 'undefined') continue;
				html += '<span data-filter="' + i + '" data-filter-name="'+ this.channels[i] +'">' + this.channels[i] + ' (<span>0</span>)</span> '; 
			}
			this.$el.find(".robin-filters").html(html);
		};

		// After creation of a new channel, go find if any content (not matched by a channel already) is relevant
		this.reScanChannels = function(new_channel){
			$("#robinChatWindow").find("div.robin-message").each(function(idx,item){
				var line = $(item).find(".robin-message--message").text().toLowerCase();
				tabbedChannels.proccessLine(line, $(item), true);
			});
		}

		// Add new channel
		this.addChannel = function(new_channel){
			if(this.channels.indexOf(new_channel) === -1){
				this.channels.push(new_channel);
				this.unread_counts[this.channels.length-1] = 0;
				this.updateChannelMatchCache();
				this.saveChannelList();
				this.drawTabs();

				// Populate content for channel
				this.reScanChannels();

				// refresh everything after redraw
				this.disable_all_channels();
			}
		};

		// remove existing channel
		this.removeChannel = function(channel){
			if(confirm("are you sure you wish to remove the " + channel + " channel?")){
				var idx = this.channels.indexOf(channel);
				delete this.channels[idx];
				this.updateChannelMatchCache();
				this.saveChannelList();
				this.drawTabs();

				// sub channels, will fall back to existing channels
				this.reScanChannels();

				// refresh everything after redraw
				this.disable_all_channels();
			}
		};


		// save channel list
		this.saveChannelList = function(){
			// clean array before save
			var channels = this.channels.filter(function (item) { return item != undefined });
			GM_setValue("robin-enhance-channels", channels);
		};

		// Change chat mode
		this.changeChannelMode = function(e){
			_self.mode = $(this).data("type");

			// swicth bolding
			$(this).parent().find("span").css("font-weight","normal");
			$(this).css("font-weight","bold");
			_self.disable_all_channels();

			// Update mode setting
			GM_setValue("robin-enhance-mode", _self.mode);
		};

		this.updateChannelMatchCache = function(){
			var order = this.channels.slice(0);
			order.sort(function(a, b){
			  return b.length - a.length; // ASC -> a - b; DESC -> b - a
			});
			for(var i in order){
				order[i] = this.channels.indexOf(order[i]);
			}
			// sorted array of channel name indexs

			this.channelMatchingCache = order;
		}

		// Procces each chat line to create text
		this.proccessLine = function(text, $element, rescan){
			var i, idx, channel;

			// If rescanning, clear any existing "channel" classes
			if(typeof rescan !== 'undefined' && rescan === true){
				$element.removeClass("in-channel");

				for(i=0; i <= this.channels.length; i++){
					$element.removeClass("robin-filter-" + i);
				}
			}

			// Scann for channel identifiers
			for(i=0; i< this.channelMatchingCache.length; i++){ // sorted so longer get picked out before shorter ones (sub channel matching)
				idx = this.channelMatchingCache[i];
				channel = this.channels[idx];

				if(typeof channel === 'undefined') continue;

				if(text.indexOf(channel) === 0){
					$element.addClass("robin-filter-" + idx +" in-channel");
					this.unread_counts[idx]++;
					return;
				}
			}
		};

		// If in one channel, auto add channel keys
		this.submit_helper = function(){
			if($("#robinChatWindow").hasClass("robin-filter")){
				// auto add channel key
				var channel_key = $("#robinChatWindow").attr("data-channel-key");

				if($(".text-counter-input").val().indexOf("/me") === 0){
					$(".text-counter-input").val("/me " + channel_key + " " + $(".text-counter-input").val().substr(3));
				}else if($(".text-counter-input").val().indexOf("/") !== 0){
					// if its not a "/" command, add channel
					$(".text-counter-input").val(channel_key + " " + $(".text-counter-input").val());
				}
			}
		};

		// Update everuything
		this.tick = function(){
			_self.$el.find(".robin-filters span").each(function(){
				if($(this).hasClass("selected")) return;
				$(this).find("span").text(_self.unread_counts[$(this).data("filter")]);
			});
		};

		// Init tab zone
		this.init = function($el){
			// Load channels
			if(GM_getValue("robin-enhance-channels")){
				this.channels = GM_getValue("robin-enhance-channels");
			}
			if(GM_getValue("robin-enhance-mode")){
				this.mode = GM_getValue("robin-enhance-mode");
			}

			// init counters
			for(var i in this.channels){
				this.unread_counts[i] = 0;
			}

			// update channel cache
			this.updateChannelMatchCache();

			// set up el
			this.$el = $el;

			// Create inital markup
			this.$el.html("<span class='all selected'>Everything</span><span><div class='robin-filters'></div></span><span class='more'>[Options]</span>");
			this.$opt = $("<div class='robin-channel-add' style='display:none'><input name='add-channel'><button>Add channel</button> <span class='channel-mode'>Channel Mode: <span title='View one channel at a time' data-type='single'>Single</span> | <span title='View many channels at once' data-type='multi'>Multi</span></span></div>").insertAfter(this.$el);

			// Attach events
			this.$el.find(".robin-filters").click(this.toggle_channel);
			this.$el.find("span.all").click(this.disable_all_channels);
			this.$el.find("span.more").click(function(){ $(".robin-channel-add").slideToggle(); });
			this.$el.find(".robin-filters").bind("contextmenu", function(e){
				e.preventDefault();
				e.stopPropagation();
				var chan_id = $(e.target).data("filter");
				if(chan_id===null)return; // no a channel
				_self.removeChannel(_self.channels[chan_id]);
			});
			// Form events
			this.$opt.find(".channel-mode span").click(this.changeChannelMode);
			this.$opt.find("button").click(function(){
				var new_chan = _self.$opt.find("input[name='add-channel']").val();
				if(new_chan != '') _self.addChannel(new_chan);
				_self.$opt.find("input[name='add-channel']").val('');
			});
			

			$("#robinSendMessage").submit(this.submit_helper);
			
			// store default room class
			this.defaultRoomClasses = $("#robinChatWindow").attr("class");

			// redraw tabs
			this.drawTabs();

			// start ticker
			setInterval(this.tick, 1000);
		}
	};

	/**
	 * Check if a message is "spam"
	 */
	var is_spam = function(line){
		return (
			// Hide auto vote messages
			(/^voted to (grow|stay|abandon)/.test(line)) ||
			// random unicode?
			(/[\u0080-\uFFFF]/.test(line)) ||
			// hide any auto voter messages
			(/\[.*autovoter.*\]/.test(line)) ||
			// Common bots
			(/^(\[binbot\]|\[robin-grow\])/.test(line)) ||
			// repeating chars in line (more than 5). e.g. aaaaaaa !!!!!!!!
			(/(.)\1{5,}/.test(line)) ||
			// Some common messages
			(/(voting will end in approximately|\[i spam the most used phrase\]|\[message from creator\]|\[.*bot.*\])/.test(line)) ||
			// no spaces = spam if its longer than 25 chars (dont filter links)
			(line.indexOf(" ") === -1 && line.length > 25 && line.indexOf("http") === -1) ||
			// repeating same word
			/(\b\S+\b)\s+\b\1\b/i.test(line)
		);
	};

	/**
	 * Check if a message is from an ignored user
	 *
	 */
	var is_ignored = function($usr, $ele){
		// no user name, go looking for when said it
		if($usr.length === 0){
			while($usr.length === 0){
				$ele = $ele.prev();
				$usr = $ele.find(".robin--username");
			}
		}
		// are they ignored?
		return (ignored_users[$usr.text()]);
	};

	/**
	 * Make links clickable
	 *
	 */
	var auto_link = function($msg){
		var text = $msg.html(); // read as html so stuff stays escaped
		// normal links
		text = text.replace(/\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim, '<a target="blank" href="$&">$&</a>');

		// reddit subreddit links
		text = text.replace(/\s+\/r\/(\w+)\/?/gi, ' <a target="blank" href="https://reddit.com/r/$1">/r/$1</a>');
		text = text.replace(/\s+\/u\/(\w+)\/?/gi, ' <a target="blank" href="https://reddit.com/u/$1">/r/$1</a>');

		// update text
		$msg.html(text);
	};

	/**
	 * Mute a user
	 */
	var _mute_user = function(usr){
		// Add to ignore list
		ignored_users[usr] = true;
		_render_muted_list();
	};

	/**
	 * un-mute a user
	 */
	var _unmute_user = function(usr){
		// Add to ignore list
		delete ignored_users[usr];
		_render_muted_list();
	};

	// Render list of ignored users
	var _render_muted_list = function(){
		var html = "<strong>Ignored users</strong><br>";
		for(var u in ignored_users){
			html += "<div data-usr='"+ u + "'>" + u + " - [unmute]</div>";
		}
		$("#muted_users").html(html);
	};

	// Scroll chat back to bottom
	var _scroll_to_bottom = function(){
		$("#robinChatWindow").scrollTop($("#robinChatMessageList").height());
	};

	// create persistant option
	function createOption(name, click_action, default_state){
		var checked_markup;
		var key = "robin-enhance-" + name.replace(/\W/g, '');
		var state = (typeof default_state !== "undefined") ? default_state : false;

		// try and state if setting is defined
		if(GM_getValue(key)){
			state = (GM_getValue(key) === 'true') ? true : false;
		}
		// markup for state
		checked_markup = (state === true) ? "checked='checked'" : "";
		// render option
		var $option = $("<label><input type='checkbox' "+checked_markup+">"+name+"</label>").click(function(){
			var checked = $(this).find("input").is(':checked');

			// persist state
			if(checked != state){
				GM_setValue(key, checked ? 'true' : 'false'); // true/false stored as strings, to avoid unset matching
				state = checked;
			}

			click_action(checked, $(this));
		});
		// add to dom
		$("#robinDesktopNotifier").append($option);
		// init
		click_action(state, $option)
	};

	// update spam count
	var update_spam_count = function(){
		blocked_spam++;
		blocked_spam_el.innerHTML = blocked_spam;
	};

	// when name is clicked, fill it into the chat box
	var fill_name = function(e){
		e.preventDefault();
		e.stopPropagation();

		// if text area blank, prefill name. if not, stick it on the end
		if($(".text-counter-input").val() === ''){
			$(".text-counter-input").val($(this).text() + ' ').focus();
		}else{
			$(".text-counter-input").val($(".text-counter-input").val() + ' ' + $(this).text()).focus();
		}
	};

	// remove channel key from message
	var remove_channel_key_from_message = function(message){
		if($("#robinChatWindow").attr("data-channel-key")){
			var offset = $("#robinChatWindow").attr("data-channel-key").length;
			if(offset === 0) return message;

			if(message.indexOf("/me") === 0){
				return "/me "+ message.slice(offset+5);
			}else{
				return message.slice(offset+1);
			}
		}
		return message;
	}

	/**
	 * Parse a link and apply changes
	 */
	var parse_line = function($ele){
		var $msg = $ele.find(".robin-message--message");
		var $usr = $ele.find(".robin--username");
		var line = $msg.text().toLowerCase();

		// dont parse system messages
		if($ele.hasClass("robin--user-class--system")){
			if(line.indexOf("ratelimit | you are doing that too much") !== -1){
				$(".text-counter-input").val(messageHistory[messageHistoryIndex-1]);
			}
			return;
		}

		// If user is ignored or message looks like "Spam". hide it
		if (is_ignored($usr, $ele) || is_spam(line)) {
			$ele.addClass("spam-hidden");
			update_spam_count();
		}

		// Highlight mentions
		if(line.indexOf(robin_user) !== -1){
			$ele.addClass("user-mention");
		}

		// Make links clickable
		if(!_robin_grow_detected && (line.indexOf("http") !== -1 || line.indexOf("/r/") !== -1 || line.indexOf("/u/") !== -1)){
			auto_link($msg);
		}

		// Add mute button to users
		if(!$ele.hasClass("robin--user-class--system") && $usr.text().toLowerCase() != robin_user){
			$("<span style='font-size:.8em;cursor:pointer'> [mute] </span>").insertBefore($usr).click(function(){
				_mute_user($usr.text());
			});
		}

		// Track channels
		tabbedChannels.proccessLine(line, $ele);

		// bind click to use (override other click events if we can)
		$usr.bindFirst("click", fill_name);
	};


	// Detect changes, are parse the new message
	$("#robinChatWindow").on('DOMNodeInserted', function(e) {
		if ($(e.target).is('div.robin-message')) {
			// Apply changes to line
			parse_line($(e.target));
		}
	});

	// When everything is ready
	$(document).ready(function(){

		// Set default spam filter type
		$("#robinChatWindow").addClass("hide-spam");

		createOption("Hide spam completely (<span id='spamcount'>0</span> removed)", function(checked, ele){
			if(checked){
				$("#robinChat").removeClass("mute-spam").addClass("hide-spam");
			}else{
				$("#robinChat").removeClass("hide-spam").addClass("mute-spam");
			}
			// correct scroll after spam filter change
			_scroll_to_bottom();
		},true);

		createOption("Use channel colors", function(checked, ele){
			if(checked){
				$("#robinChat").addClass("show-colors");
			}else{
				$("#robinChat").removeClass("show-colors");
			}
			// correct scroll after spam filter change
			_scroll_to_bottom();
		},false);



		blocked_spam_el = $("#spamcount")[0];

		// Add Muted list & hook up unmute logic
		$('<div id="muted_users" class="robin-chat--sidebar-widget robin-chat--notification-widget"><strong>Ignored users</strong></div>').insertAfter($("#robinDesktopNotifier"));
		$('#muted_users').click(function(e){
			var user = $(e.target).data("usr");
			if(user) _unmute_user(user);
		});

		// Init tabbed channels
		tabbedChannels.init($('<div id="filter_tabs"></div>').insertAfter("#robinChatWindow"));

		// store i copy of last message, in case somthing goes wrong (rate limit)
		$("#robinSendMessage").submit(function(){
			var user_last_message = $(".text-counter-input").val();

			// if message history is to long, clear it out
			if(messageHistory.length === 25){
				messageHistory = messageHistory.shift();
			} 
			messageHistory.push(remove_channel_key_from_message(user_last_message));
			messageHistoryIndex = messageHistory.length;
		});

		// up for last message send, down for prev (if moving between em)
		$('input.text-counter-input').on('keydown', function(e) {
			if(e.keyCode == 38) {
				e.preventDefault();
				messageHistoryIndex--;
				if(messageHistoryIndex > -1){
					$(this).val(messageHistory[messageHistoryIndex]);
				} 
			}else if(e.keyCode == 40){
				e.preventDefault();
				if(messageHistoryIndex <= messageHistory.length){
					messageHistoryIndex++;
					$(this).val(messageHistory[messageHistoryIndex]);
				}else{
					$(this).val('');
				}
			}
		});
	});

	// fix by netnerd01
	var stylesheet = document.createElement('style');
	document.head.appendChild(stylesheet);
	stylesheet = stylesheet.sheet;

	// filter for channel
	stylesheet.insertRule("#robinChatWindow.robin-filter div.robin-message { display:none; }", 0);
	stylesheet.insertRule("#robinChatWindow.robin-filter div.robin-message.robin--user-class--system  { display:block; }", 0);
	var color;
	for(var c=0;c<35;c++){
		color = colors[(c % (colors.length))];

		stylesheet.insertRule("#robinChat.show-colors #robinChatWindow div.robin-message.robin-filter-"+c+" { background: "+color+";}", 0);
		stylesheet.insertRule("#robinChatWindow.robin-filter.robin-filter-"+c+" div.robin-message.robin-filter-"+c+" { display:block;}", 0);
	}

	// Styles for filter tabs
	stylesheet.insertRule("#filter_tabs {width:100%; display: table; table-layout: fixed; background:#d7d7d2; border-bottom:1px solid #efefed;}",0);
	stylesheet.insertRule("#filter_tabs > span {width:90%; display: table-cell;}",0);
	stylesheet.insertRule("#filter_tabs > span.all, #filter_tabs > span.more {width:60px; text-align:center; vertical-align:middle; cursor:pointer;}",0);
	stylesheet.insertRule("#filter_tabs > span.all.selected, #filter_tabs > span.all.selected:hover {background: #fff;}", 0);
	stylesheet.insertRule("#filter_tabs .robin-filters { display: table; width:100%;table-layout: fixed; '}", 0);
	stylesheet.insertRule("#filter_tabs .robin-filters > span { padding: 5px 2px;text-align: center; display: table-cell; cursor: pointer;width:2%; vertical-align: middle; font-size: 1.1em;}", 0);
	stylesheet.insertRule("#filter_tabs .robin-filters > span.selected, #filter_tabs .robin-filters > span:hover { background: #fff;}", 0);
	stylesheet.insertRule("#filter_tabs .robin-filters > span > span {pointer-events: none;}", 0);

	stylesheet.insertRule(".robin-channel-add  {padding:5px; display:none;}", 0);
	stylesheet.insertRule(".robin-channel-add input {padding: 2.5px; }", 0);
	stylesheet.insertRule(".robin-channel-add .channel-mode {float:right; font-size:1.2em;padding:5px;}", 0);
	stylesheet.insertRule(".robin-channel-add .channel-mode span {cursor:pointer}", 0);
	//mentions should show even in filter view
	stylesheet.insertRule("#robinChat #robinChatWindow div.robin-message.user-mention { display:block; font-weight:bold; }", 0);

	// Add initial styles for "spam" messages
	stylesheet.insertRule("#robinChat.hide-spam #robinChatWindow div.robin-message.spam-hidden { display:none; }", 0);
	stylesheet.insertRule("#robinChat.mute-spam #robinChatWindow div.robin-message.spam-hidden { opacity:0.3; font-size:1.2em; }", 0);
	stylesheet.insertRule("#robinChat.show-colors #robinChatWindow div.robin-message.spam-hidden { opacity:0.3; font-size:1.2em; }", 0);
	// muted user box
	stylesheet.insertRule("#muted_users { font-size:1.2em; }", 0);
	stylesheet.insertRule("#muted_users div { padding: 2px 0; }", 0);
	stylesheet.insertRule("#muted_users strong { font-weight:bold; }", 0);

	// FIX RES nightmode (ish) [ by Kei ]
	stylesheet.insertRule(".res-nightmode #robinChatWindow div.robin-message { color: #ccc; }", 0);
	stylesheet.insertRule(".res-nightmode .robin-chat--sidebar-widget { background: #222; color: #ccc;}", 0);
	stylesheet.insertRule(".res-nightmode .robin-room-participant { background: #222; color: #999;}", 0);
	stylesheet.insertRule(".res-nightmode #filter_tabs {background: rgb(51, 51, 51);}", 0);
	stylesheet.insertRule(".res-nightmode #filter_tabs  .robin-filters > span.selected,.res-nightmode #filter_tabs .robin-filters > span:hover,.res-nightmode #filter_tabs > span.all.selected,.res-nightmode #filter_tabs > span.all:hover {background: rgb(34, 34, 34)}", 0);
	stylesheet.insertRule(".res-nightmode .robin-chat--input { background: #222 }", 0);
	stylesheet.insertRule(".res-nightmode .robin--presence-class--away .robin--username {color: #999;}", 0);
	stylesheet.insertRule(".res-nightmode .robin--presence-class--present .robin--username {color: #ccc;}", 0);
	stylesheet.insertRule(".res-nightmode #robinChat .robin--user-class--self .robin--username { color: #999; }", 0);
	stylesheet.insertRule(".res-nightmode .robin-chat--vote { background: #777; color: #ccc;}", 0);
	stylesheet.insertRule(".res-nightmode .robin-chat--buttons button.robin-chat--vote.robin--active { background: #ccc; color:#999; }", 0);

	$(document).ready(function(){
		setTimeout(function(){
			// Play nice with robin grow (makes room for tab bar we insert)
			if($(".usercount.robin-chat--vote").length !== 0){
				_robin_grow_detected = true;
				stylesheet.insertRule("#robinChat.robin-chat .robin-chat--body { height: calc(100vh - 150px); }", 0);
			}
		},500);
	});

	// Allow me to sneek functions in front of other libaries - used when working with robin grow >.< sorry guys
	//http://stackoverflow.com/questions/2360655/jquery-event-handlers-always-execute-in-order-they-were-bound-any-way-around-t
	$.fn.bindFirst = function(name, fn) {
		// bind as you normally would
		// don't want to miss out on any jQuery magic
		this.on(name, fn);

		// Thanks to a comment by @Martin, adding support for
		// namespaced events too.
		this.each(function() {
			var handlers = $._data(this, 'events')[name.split('.')[0]];
			// take out the handler we just inserted from the end
			var handler = handlers.pop();
			// move it at the beginning
			handlers.splice(0, 0, handler);
		});
	};

})();