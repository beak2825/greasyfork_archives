// ==UserScript==
// @name         Tumblr Tamer
// @namespace    fortytwo
// @homepageURL	 https://greasyfork.org/en/users/14247-fortytwo
// @supportURL	 http://awesomefortytwo.tumblr.com/tagged/tumblr-tamer
// @version      5.3
// @description  Restyles Tumblr's new reblogging template, and makes it look like before. Plus adds some bonus features!
// @author       fortytwo
// @match        https://www.tumblr.com/*
// @noframes
// @require		 https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant		 GM_getValue
// @grant		 GM_setValue
// @compatible	 firefox
// @compatible	 chrome
// @compatible	 opera
// @downloadURL https://update.greasyfork.org/scripts/12178/Tumblr%20Tamer.user.js
// @updateURL https://update.greasyfork.org/scripts/12178/Tumblr%20Tamer.meta.js
// ==/UserScript==

/*
todo

* enlarge images







*/

/***
	NOTICE: YOU ARE AGREEING THAT ANY USE OF THE FOLLOWING SCRIPT IS AT
	YOUR OWN RISK. I DO NOT MAKE ANY GUARANTEES THE SCRIPT WILL WORK, NOR 
	WILL I HOLD MYSELF ACCOUNTABLE FOR DAMAGE TO YOUR DEVICE.
	
	WHILE THE SCRIPT IS UNLIKELY TO CAUSE ANY HARM, AS WITH ALL TECHNICAL
	COMPONENTS, BUGS AND GLITCHES CAN HAPPEN.

	IF THE SCRIPT ISN'T WORKING FOR YOU, FEEL FREE TO SEND ME A MESSAGE: http://awesomefortytwo.tumblr.com/
***/
(function(){
	function inIframe(){
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
		}
	}
	//Catch in case @noframes doesn't work: Don't run in frames
	if(inIframe()){
		return;
	}

	var theme			= GM_getValue('theme', 'tumblrOriginal'),
		colours			= GM_getValue('colours', 'D3D3D3'),
		barwidth		= GM_getValue('barwidth', '4'),
		padding			= GM_getValue('padding', '18'),
		scrollthreshold = GM_getValue('scrollthreshold', '2000'),
		coloursArr		= colours.split(" "),
		peepchange		= null;

	var obs_change = new MutationObserver(function(mutations){
		var peeper = $('.peepr-drawer-container');
		for(var i = 0; i < mutations.length; ++i){
			var mutation = mutations[i];
			for(var j = 0; j < mutation.addedNodes.length; ++j){
				addPostObserver(peeper.find('.posts'), 'peeper');
			}
		}
	});

	/* Add things used on all pages */
	//Allows us to reverse results
	jQuery.fn.reverse = [].reverse;
	createStylesheet();
	observePeeper();

	/* FUNCTIONS */
	function createStylesheet(){
		var stylesheet = document.createElement('style');
		var styles = [
			".tumblrtamer { }",
			//".tumblrtamer .reblog-content > * {margin:0px 0px 5px 0px}",
			".tumblrtamer .reblog-list-item{ border-bottom: none !important; border-left:", barwidth, "px solid #fff; padding:0px ", padding, "px; background:#fff; margin:0px; border-bottom:none; min-width:80px}",
			".tumblrtamer .reblog-header{margin:0px 0px 5px 0px;}",
			".tumblrtamer-container{margin:5px 0px 0px 0px; padding: 0px 0px 0px 20px; background:#fff; overflow: auto; ", (scrollthreshold > 0 ? ("max-height:"+scrollthreshold+"px;") : ''), "}",
			".tumblrtamer .tmblr-full{ margin-left: 0px !important; margin-right: 0px !important;}",
			".tumblrtamer .contributed-content{border:0px none !important; padding:0px ", padding, "px }",
			".tumblrtamer .inactive {font-weight:bold;}",
			".tumblrtamer .inactive .reblog-tumblelog-deactivated-status{display:none; font-weight: none; color:#a2a2a2; }",
			".tumblrtamer .inactive .reblog-tumblelog-deactivated-status:before{content: ' ';}",
			".tumblrtamer .inactive:hover > .reblog-tumblelog-deactivated-status{display:inline;}"
		];
		
		//conditional styling
		if(theme == 'tumblrTamer' || theme == "tumblrTamerNoIcons"){
			styles.push(".tumblrtamer .reblog-header{margin-top: 5px}");
		}
		
		if(theme == 'tumblrTamerNoIcons' || theme == 'tumblrOriginal'){
			styles.push('.tumblrtamer .reblog-header{padding-left:0px !important;}');
		}
		if(theme == 'tumblrOriginal'){
			styles.push('.tumblrtamer .reblog-avatar-image-thumb{ width:25px !important; height: 25px !important }');
			styles.push('.tumblrtamer a.reblog-tumblelog-name.post_info_link {font-weight:normal !important; font-size:15px !important; border-bottom: 1px solid #444; color: #444 !important; text-decoration: none !important; background-size: 1em 2px; padding-bottom: 0.15em;}');
			styles.push('.tumblrtamer a.reblog-tumblelog-name.post_info_link:after{content: ":"}');
		}

		stylesheet.textContent = styles.join('');
		document.body.appendChild(stylesheet);
	};

	//Fetches the next colour index
	function fetchColour(curIndex){
		return (coloursArr[curIndex + 1] == undefined ? 0 : curIndex + 1);
	};

	function loadExternalImage(){
		var div = $(this);
		div.html(div.attr('data-loading-text'));
		div.replaceWith($("<p><img src='"+div.attr('data-src')+"' /></p>"));
	};

	//Function to fix the post
	function fixPost(post){
		var container		= $('<div class="tumblrtamer-container"></div>'),
			contr_container = $('<div class="tumblrtamer-contributed"></div>'),
			chain			= container,
			contributed		= post.find('.contributed-content'),
			content			= post.find(".post_content"),
			colourIndex		= 0;

		//so we can use our styling
		post.addClass('tumblrtamer');

		//Fix the contributed content by adding it outside of our new reblogs
		contributed.find('.reblog-header').remove();
		contributed.appendTo(contr_container);

		//Fix external images
		post.find('.external-image-wrapper').on('click', loadExternalImage);

		//Fetch a list of reblogs and add them inside of each other
		var reblogs	= post.find('.reblog-list-item').reverse();
		
		//Remove icon if we have to
		if(theme === 'tumblrTamerNoIcons' || theme === 'tumblrOriginal'){
			post.find('.reblog-avatar').remove();
		}

		for(var i = 0; i < reblogs.length; i++){
			var li = $(reblogs[i]);
			li.css('border-left-color', "#"+coloursArr[colourIndex]);
			li.prependTo(chain);

			if(theme === 'tumblrOriginal'){
				//need to put the header before the content
				li.find('.reblog-header').prependTo(chain);
			}
			chain = li;
			colourIndex = fetchColour(colourIndex);
		}
		//done, remove the original blog list
		post.find(".reblog-list").remove();

		//Put ours in
		container.insertAfter(content);
		contr_container.insertAfter(container);
	};

	//Observes blog posts
	function addPostObserver($for, type){
		//Fix initial posts
		var clsName = (type === 'peeper' ? 'post' : 'post_container');
		$for.find('.'+clsName).each(function(index, value){
			fixPost($(value));
		});

		//When an ajax call loads more posts
		var observer = new MutationObserver(function(mutations) {
			for(var i = 0; i < mutations.length; ++i){
				var mutation = mutations[i];
				for(var j = 0; j < mutation.addedNodes.length; ++j){
					var element = $(mutation.addedNodes[j]);
					if(element.hasClass(clsName)){
						fixPost(element);
					}
				}
			}
		});

		//Observe the posts list
		observer.observe($for[0], { childList: true });
		
		//For peeper, we want to cache the observer so we can remove it
		//during swaps to avoid memory leaks.
		if(type == 'peeper'){
			peepchange = observer;
		}
	};

	function observePeeper(){
		var obs_peep = new MutationObserver(function(mutations){
			for(var i = 0; i < mutations.length; ++i){
				var mutation = mutations[i];
				for(var j = 0; j < mutation.addedNodes.length; ++j){
					var element = $(mutation.addedNodes[j]);
					//Peeper was added
					if(element.hasClass('peepr-drawer-container')){
						//Clean up in case we've changed blog inline
						cleanUpPeeperObserver();
						
						//Observe the new content
						addPostObserver(element.find('.posts'), 'peeper');
						obs_change.observe(element.find('.peepr-drawer')[0], { childList: true });
						return;
					}
				}
				
				//Peeper is being closed. Clean up.
				for(var j = 0; j < mutation.removedNodes.length; ++j){
					var element = $(mutation.removedNodes[j]);
					//Peeper was added
					if(element.hasClass('peepr-drawer-container')){
						cleanUpPeeperObserver();
						return;
					}
				}
			}
		});
		obs_peep.observe(document.body, { childList: true });
	};

	function cleanUpPeeperObserver(){
		if(peepchange !== null){
			peepchange.disconnect();
			peepchange = null;
		}
	};

	//for testing purposes
	//window.setInterval(function(){ console.log(peepchange); }, 5000);

	/* PAGES AFFECTED */
	//Make sure to accomodate for users with infinite dashboard off
	if(
		window.location.href.indexOf("www.tumblr.com/dashboard") > 0
		|| window.location.href.indexOf("www.tumblr.com/blog/") > 0
		|| window.location.href.indexOf("www.tumblr.com/liked/by/") > 0
		|| window.location.href.indexOf("www.tumblr.com/likes") > 0){

		if(document.getElementById('posts')){
			addPostObserver($('#posts'), 'regular');
		}
	}
	//Search page
	else if(window.location.href.indexOf("www.tumblr.com/search/") > 0){
		if(document.getElementById('search_posts')){
			addPostObserver($('#search_posts'), 'regular');
		}
	}
	//Settings page
	else if(window.location.pathname === "/settings/account"){
		//Function to add options to the themer select
		var makeThemer = function(select){
			var themes =[
				{ value: 'tumblrTamer', name: 'Tumblr Tamer' },
				{ value: 'tumblrOriginal', name: 'Tumblr Original' },
				{ value: 'tumblrTamerNoIcons', name: 'Tumblr Tamer (no icons)'}
			];

			for(var i = 0; i < themes.length; ++i){
				var item = themes[i];
				select.append('<option value="'+item.value+'"'+(theme == item.value ? ' selected="selected"' : '')+'>'+item.name+'</option>');
			}
		};

		//add our new settings
		var html = [
			'<div class="settings_group v_center">',
				'<div class="group_label">',
					'<h3 class="settings_subheading">Tumblr Tamer</h3>',
				'</div>',
				'<div class="group_content">',
					'<div class="select setting">',
						'Display: <select id="tumblrtamer-theme"></select>',
						'<div style="border-top:1px solid lightgrey; margin-top:5px">',
							'<input type="number" min="10" max="50" id="tumblrtamer-padding" value="', padding, '" /><label for="tumblrtamer-padding">Padding (px)</label><br />',
							'<input type="number" min="1" max="10" id="tumblrtamer-barwidth"  value="', barwidth, '" /><label for="tumblrtamer-barwidth">Bar width (px)</label><br />',
							'<input type="number" min="0" id="tumblrtamer-scrollthresh"  value="', scrollthreshold, '" /><label for="tumblrtamer-scrollthresh">Reblog list height threshold (px)</label><br />Put as 0 if you don\'t want any scrollbar',
							'<input type="text" id="tumblrtamer-colour" style="width:100%"  value="', colours, '" /><label for="tumblrtamer-colour">Colour (hex)</label><br />Seperate with a space for alternating colours e.g: D3D3D3 C0FFEE FF0000',
							"<div id='tumblrtamer-errlog' style='color: red; font-weight:bold;'></div>",
						'</div>',
					'</div>',
				'</div>',
			'</div>'
			].join('');
		$(html).insertBefore($('.settings_footer'));
		var select = $('#tumblrtamer-theme');
		makeThemer(select);

		//Set any new settings
		select.on('change', function(){GM_setValue('theme', $.trim(this.options[this.selectedIndex].value)); });
		$('#tumblrtamer-padding').on('change', function(){ GM_setValue('padding', $.trim($(this).val())); });
		$('#tumblrtamer-barwidth').on('change', function(){ GM_setValue('barwidth', $.trim($(this).val())); });
		$('#tumblrtamer-scrollthresh').on('change', function(){ GM_setValue('scrollthreshold', $.trim($(this).val())); });
		$('#tumblrtamer-colour').on('change', function(){
			var errlog = $('#tumblrtamer-errlog'),
				errors	= [],
				regex	= /^[a-z0-9]+$/i,
				colours = $.trim($(this).val()).split(" ");

			//verify
			for(var i = 0; i < colours.length; ++i){
				var colour = colours[i];
				if(!regex.test(colour)){
					errors.push(colour + " (must be alphanumeric)");
				}
				if(colour.length != 6){
					errors.push(colour + " (must be 6 characters)");
				}
			}

			//No problems found
			if(!errors.length){
				GM_setValue('colours', $.trim($(this).val()));
			}
			//Tell user to fix things
			else{
				var html = "Some errors were found. Please look at the following colours: <ul>";
				for(var i = 0; i < errors.length; ++i){
					html += "<li>"+errors[i]+"</li>";
				}
				html += "</ul>";
				errlog.html(html);
			}
		});
	}
})();