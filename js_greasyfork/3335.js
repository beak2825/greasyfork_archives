// ==UserScript==
// @name RaaW
// @version 3.2.1
// @namespace RaaW
// @run-at document-end
// @description Reddit as a Weapon script. Parts and idea by /u/noeatnosleep, enhanced by /u/enim, /u/creesch, /u/skeeto, and /u/djimbob. RaaW adds links for page-wide voting and reporting. It adds a 'report to /r/spam' link, an 'analyze user submission domains' link, and a 'report to /r/botwatchman' link to userpages. RaaW disables the np. domain. RaaW Adds a 'show source' button for comments.  DISCLIAMER: Use this at your own risk. If the report button is misued, you could be shadowbanned.
// @include http://www.reddit.com/user/*
// @include http://www.reddit.com/r/*
// @include http://*reddit.com/*
// @include https://www.reddit.com/user/*
// @include https://www.reddit.com/r/*
// @include https://*reddit.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/3335/RaaW.user.js
// @updateURL https://update.greasyfork.org/scripts/3335/RaaW.meta.js
// ==/UserScript==

this.jQuery = jQuery.noConflict(true);

// define a basic object that we can extend with our functions so we do not accidentally
// override other stuff
var RaaW = {
	// ////////////////////////////////////////////////////////////////////////
	// constants
	// ////////////////////////////////////////////////////////////////////////

	// some css properties for the links in the toolbox
	LINK_CSS: {
		'color': '#000',
	},

	// ////////////////////////////////////////////////////////////////////////
	// instance variables
	// ////////////////////////////////////////////////////////////////////////

	// true if we are moderator on the current page (by checking if .moderator is present)
	// in <body class="...">
	isModerator: false,

	currentPage: 'user',

	// ////////////////////////////////////////////////////////////////////////
	// various helper functions
	// ////////////////////////////////////////////////////////////////////////

	/**
	 * Function grabs the username of the current viewed profile.
	 *
	 * Returns:
	 *  (string) username or undefined if not found
	 */
	 _getUsername: function() {
	 	return jQuery(document).find('.pagename.selected').text();
	 },

	 _getModhash: function() {
	 	return unsafeWindow.reddit.modhash;
	 },

	// ////////////////////////////////////////////////////////////////////////
	// initialization
	// ////////////////////////////////////////////////////////////////////////

	/**
	* Initialize RaaW. Will fetch some values like current page and after
	* that initialize the toolbar.
	*/
	init: function() {
		// first gather all the information needed
		this._loadEnvironment();

		// now add some elements we will need
		this._injectElements();

		// add the toolbar
		this._generateToolbar();

		// after we created everything connect it
		this._registerListener();
	},

	/**
	 * Load environment values like current page.
	 */
	 _loadEnvironment: function() {
		// set current page
		this.currentPage = document.URL.split('reddit.com')[1].split('/')[1];

		// check if we are moderator
		this.isModerator = jQuery('body').hasClass('moderator');
	},

	/**
	 * Adds/modifies needed elements to the reddit page (e.g. 'toggle source' links).
	 */
	 _injectElements: function() {
		// add links 'toogle source' to comments
		var toggleSourceCodeEl = jQuery('<li><a class="raawToggleSourceCode" href="#">view source</a></li>');
		jQuery('.entry .flat-list').append(toggleSourceCodeEl);

		//disable .np
		if (document.documentElement.lang === 'np') {
			document.documentElement.lang = 'en-us';
		}

		// add subscriber class to body tag
		jQuery('body').addClass('subscriber');

		// replace links on the page
		Array.forEach( document.links, function(a) {
			a.href = a.href.replace( "https://i.imgur.com", "http://imgur.com");
			a.href = a.href.replace( "https://imgur.com", "http://imgur.com");
		});

		// set checkbox 'limit my search to /r/...' checked
		jQuery('form#search input[name="restrict_sr"]').prop('checked', true);

		// add mod only stuff
		if(this.isModerator === true) {
			this._injectSaveAsMod();
			this._injectNuke();
		}
	},

	/**
	 * Register all click listener for the RaaW toolbar links. We do not distingish if we
	 * are on /user or something else. There should be no noticeable impact on performance
	 * and we save some maintenance effort.
	 */
	 _registerListener: function() {
		// we don't want js to bind 'this' to the global object. therefore we use a trick.
		// whenever you need a 'this' reference inside one of the functions pointing to
		// the RaaW object use 'that'
		var that = this;

		// register click handler for the user toolbar links
		jQuery('#raawReportComment').click(function(e) {
			that.reportAll(e);
		});
		jQuery('#raawBotwatchmanSend').click(function(e) {
			that.botwatchmanSend(e);
		});
		jQuery('#raawAnalyzeSend').click(function(e) {
			that.analyzeSend(e);
		});
		jQuery('#raawReportUserToSpam').click(function(e) {
			that.reportUserToSpam(e);
		});
		jQuery('#raawAdminSend').click(function(e) {
			that.adminSend(e);
		});

		// register handler for the other toolbar links
		jQuery('#raawDownvoteComment').click(function(e) {
			that.voteAll(e, -1);
		});
		jQuery('#raawUpvoteComment').click(function(e) {
			that.voteAll(e, 1);
		});
		jQuery('#raawComposeNew').click(function(e) {
			that.composeNew(e);
		});

		jQuery('.raawToggleSourceCode').click(function(e) {
			that.toggleSourceCode(e);
		});
	},

	// ////////////////////////////////////////////////////////////////////////
	// toolbar stuff
	// ////////////////////////////////////////////////////////////////////////

	/**
	* Helper function used to create an a-element.
	*
	* Parameters:
	*  id (string) - id attribute value
	*  href (string) - href attribute value
	*  text (string) - elements text
	*
	* Returns:
	*  jQuery element instance
	*/
	_generateToolbarLink: function(id, href, text) {
		var link = jQuery('<a id="' + id + '" href="' + href + '">' + text + '</a>');
		jQuery(link).css(this.LINK_CSS);
		return link;
	},

	/**
	 * Generate the toolbar on top of the page.
	 */
	 _generateToolbar: function() {
		// create a wrapper div
		var raawToolbarWrapper = jQuery('<div id="raawToolbarWrapper"><a href="#" id="raawToggleToolbar">RaaW</a></div>');
		jQuery('body .side').append(raawToolbarWrapper);

		jQuery(raawToolbarWrapper).css({
			'position': 'fixed'
			, 'top': '300px'
			, 'right': '-140px'
			, 'width': '180px'
			, 'font-size': '10px'
			, 'z-index': '100000'
		});

		// style the tab and bind the hover event
		jQuery('a#raawToggleToolbar').css({
			'display': 'block'
			, 'background': '#333'
			, 'padding': '0.3em'
			, 'color': '#fff'
			, 'font-weight': 'bold'
		});

		jQuery('a#raawToggleToolbar').click(function(e) {
			e.preventDefault();
		});

		jQuery('a#raawToggleToolbar').mouseenter(function(e) {
			console.log('enter');
			e.stopImmediatePropagation();
			jQuery('#raawToolbarWrapper').animate({'right': '-4px'}, 750);
		});

		jQuery('#raawToolbarWrapper').mouseleave(function(e) {
			e.stopImmediatePropagation();
			jQuery('#raawToolbarWrapper').animate({'right': '-140px'}, 750);
		});

		// create the new raaw toolbar and insert into body
		var raawToolbar = jQuery('<div id="raawToolbar"></div>');
		jQuery(raawToolbarWrapper).append(raawToolbar);

		// apply style to the new toolbar
		jQuery(raawToolbar).css({
			'border': '1px solid #aaa'
			, 'background': '#f0f0f0'
			, 'padding': '0.5em 30px 0.5em 0.5em'
			, 'margin-left': '4em'
		});

		// fill toolbar with content depending on parsed page
		var toolbarLinks = new Array();
		if(this.currentPage === 'user') {
			toolbarLinks.push(this._generateToolbarLink('raawReportComment', '#', 'REPORT ALL'));
			toolbarLinks.push(this._generateToolbarLink('raawBotwatchmanSend', '#', '/R/BOTWATCHMAN'));
			toolbarLinks.push(this._generateToolbarLink('raawAnalyzeSend', '#', 'ANALYZE'));
			toolbarLinks.push(this._generateToolbarLink('raawReportUserToSpam', '#', '/R/SPAM'));
			toolbarLinks.push(this._generateToolbarLink('raawAdminSend', '#', 'ADMIN'));
		} else {
			toolbarLinks.push(this._generateToolbarLink('raawUpvoteComment', '#', 'UPVOTE'));
			toolbarLinks.push(this._generateToolbarLink('raawDownvoteComment', '#', 'DOWNVOTE'));
			toolbarLinks.push(this._generateToolbarLink('raawComposeNew', '#', 'COMPOSE'));
		}

		for(i = 0; i < toolbarLinks.length; i++) {
			jQuery(raawToolbar).append(toolbarLinks[i]);
		}

		// add some css to the new links
		jQuery('#raawToolbar a').css({
			'display': 'block'
			, 'margin': '0.3em 0'
		});
	},

	// ////////////////////////////////////////////////////////////////////////
	// functions for user toolbar
	// ////////////////////////////////////////////////////////////////////////

	/**
	 * Report a given item using the reddit api.
	 *
	 * Parameters:
	 *  fullname (string) - fullname of item to report
	 *  el (jQuery el) - element to report (just for easier coding)
	 *	timeout (int) - timeout before request
	 */
	 _reportItem: function(fullname, el, timeout) {
	 	var that = this;
	 	setTimeout(function() {
	 		var data= {
	 			'api_type': 'json'
	 			, 'thing_id': fullname
	 			, 'uh': that._getModhash()
	 		};

	 		jQuery.post('http://www.reddit.com/api/report', data).done(function(response) {
	 			jQuery(el).hide(1000);
	 		}).error(function(response) {
	 			console.log(response);
	 		});
	 	}, timeout);
	 },

	/**
	 * Report all items on the page.
	 *
	 * Parameters:
	 *  click (jQuery click event) - the jQuery click event.
	 */
	 reportAll: function(click) {
	 	click.preventDefault();

	 	var isConfirmed = confirm("This will report all items on the page.");
	 	if (isConfirmed === true) {
			// load all fullname of the comments on the page
			var i = 0;
			var that = this;
			jQuery('div#siteTable .thing').each(function(index, el) {
				var fullname = jQuery(el).attr('data-fullname');
				that._reportItem(fullname, el, (400 * i) + 100);
				i++;
			});

			// not accurate but will do
			alert('All items on this page were reported.');
		} else {
			alert('Report canceled');
		}
	},

	/**
	 * Open a new window to submit a user to /r/botwatchman.
	 *
	 * Parameters:
	 *  click (jQuery click event) - the jQuery click event.
	 */
	 botwatchmanSend: function(click) {
	 	click.preventDefault();
	 	var username = this._getUsername();
	 	window.open('http://www.reddit.com/r/botwatchman/submit?title=overview for ' + username + '&url=http://www.reddit.com/user/' + username);
	 },

	/**
	 * Send a new message to /u/analyzereddit with subject 'analyze' and a username
	 * as message.
	 *
	 * Parameters:
	 *  click (jQuery click event) - the jQuery click event.
	 */
	 analyzeSend: function(click) {
	 	click.preventDefault();
	 	var username = this._getUsername();
	 	window.open('http://www.reddit.com/message/compose/?to=analyzereddit&subject=analyze&message=' + username);
	 },


	/**
	 * Open a new window to report a user to /r/spam.
	 *
	 * Parameters:
	 *  click (jQuery click event) - the jQuery click event.
	 */
	 reportUserToSpam: function(click) {
	 	click.preventDefault();
	 	var username = this._getUsername();
	 	window.open('http://www.reddit.com/r/spam/submit?title=overview for '+ username + '&resubmit=true&url=http://www.reddit.com/user/' + username);
	 },

	/**
	 * Open a new window to send a new message to /r/reddit.com.
	 */
	 adminSend: function(click){
	 	click.preventDefault();
	 	var username = this._getUsername();
	 	window.open('http://www.reddit.com/message/compose/?to=/r/reddit.com&subject=spammer&message=/u/'+ username);
	 },

	// ////////////////////////////////////////////////////////////////////////
	// functions for default toolbar
	// ////////////////////////////////////////////////////////////////////////

	/**
		 * Makes an asynch ajax call to the reddit API after waiting for the given amount
		 * of time.
		 *
		 * Parameters:
		 *  data (object) - data to send (dir, uh, id)
		 *  thing (jQuery el) - element the vote belongs to
		 *  timeout (int) - time to wait in miliseconds
		 */
		 _voteCallAPI: function(data, thing, timeout, callback) {
		 	setTimeout(function() {
		 		jQuery.post('/api/vote', data).done(function(response) {
		 			callback(data, thing);
		 		}).error(function(response) {
		 			console.log('Error voting on item!');
		 			console.log(response);
		 		});
		 	}, timeout);
		 },

		/**
		 * Up- or downvote all comment on a page.
		 *
		 * Parameters:
		 *  event (jQuery click event)
		 *  dir (int) - 1 upvote, -1 downvote, 0 none
		 */
		 voteAll: function(event, dir) {
		 	event.preventDefault();
		 	var things = jQuery('div.sitetable div.thing');

			// gather the required fullnames to call the API
			for(i = 0; i < things.length; i++) {
				var thing = things[i];
				var fullname = jQuery(thing).attr('data-fullname');
				if(typeof fullname !== 'undefined') {
					// send request to the api
					var data= {
						'dir': dir,
						'id': fullname,
						'uh': this._getModhash()
					};

					this._voteCallAPI(data, thing, 100+(i*400), function(data, thing) {
						var upArrow = jQuery(thing).find('div.arrow[aria-label="upvote"]');
						var downArrow = jQuery(thing).find('div.arrow[aria-label="downvote"]');
						var midcol = jQuery(thing).find('div.midcol');

						// not the fanciest way but prevents unexpected behaivour
						if(data.dir === 1) {
							jQuery(upArrow).addClass('upmod');
							jQuery(upArrow).removeClass('up');

							jQuery(downArrow).addClass('down')
							jQuery(downArrow).removeClass('downmod');

							jQuery(midcol).removeClass('dislikes');
							jQuery(midcol).addClass('likes');
						} else if(data.dir === -1) {
							jQuery(upArrow).addClass('up');
							jQuery(upArrow).removeClass('upmod');

							jQuery(downArrow).removeClass('down');
							jQuery(downArrow).addClass('downmod');

							jQuery(midcol).addClass('dislikes');
							jQuery(midcol).removeClass('likes');
						}
					});
				}
			}
		},

	/**
	 * Open a new window to compose a new message.
	 *
	 * Parameters:
	 *  click (jQuery click event) - the jQuery click event.
	 */
	 composeNew: function(click) {
	 	click.preventDefault();
	 	window.open('http://www.reddit.com/message/compose/');
	 },

	// ////////////////////////////////////////////////////////////////////////
	// 'view source' related functions
	// ////////////////////////////////////////////////////////////////////////

	/**
	 * Helper function to fetch the sourcecode of comments/links/messages using the
	 * reddit api.
	 *
	 * Parameters:
	 *  url (string) - because of the diversity of the api provide a url with the needed attributes
	 *  fullname (string) - fullname needed to search if loading messages
	 *  callback (function(source)) - callback function to call when api call is done
	 */
	 _fetchSourceCode: function(url, fullname, callback) {
	 	jQuery.getJSON(url).done(function(response) {
			// check what type of posting we're looking at (check api for more information)
			var postingType = response.data.children[0].kind;

			// unfortunately the returned json object has no unified structure so
			// we need a bit more logic here
			var source;
			if(postingType === 't1') { // comment
				source = response.data.children[0].data.body;
			} else if(postingType === 't3') { // link (post); will be empty for videos or similiar
				source = response.data.children[0].data.selftext;
			} else if(postingType === 't4') { // message
					// the current api url loads a message thread so we need to find the
					// desired message
					rawData = response.data.children[0].data;
					if(rawData.name === fullname) {
						source = rawData.body;
					} else {
						// search through replies
						var replies = rawData.replies.data.children;
						for(var i = 0; i < replies.length; i++) {
							var replyRaw = replies[i].data;
							if(replyRaw.name === fullname) {
								source = replyRaw.body;
								break;
							}
						}
					}
				}
				callback(source);
			});
},

	/**
	 * Create a textarea to display source code
	 *
	 * Parameters:
	 *  source (string) - source code to display
	 *  fullname (string) - fullname of link/comment/message so we can later identify if we already loaded the source
	 *  prependTo (jQuery element) - element to prepend the textarea to
	 */
	 _createSourceCodeTextarea: function(source, fullname, prependTo) {
		// create a textarea to display source and add it to the dom
		var textAreaEl = jQuery('<textarea class="'+fullname+'">'+source+'</textarea>');
		jQuery(textAreaEl).css({
			'display': 'block'
			, 'width': '90%'
			, 'height': '100px'
		});

		// insert textarea
		jQuery(prependTo).prepend(textAreaEl);
	},

	/**
	 * Toggle source code.
	 *
	 * Parameters:
	 *  click (jQuery click event) - the jQuery click event.
	 */
	 toggleSourceCode: function(click) {
	 	click.preventDefault();

			// grab the clicked link element
			var linkEl = jQuery(click.target);

			// get the data-fullname attribute to provide an id to 'throw at the api'
			var dataFullname = jQuery(linkEl).closest('.thing').attr('data-fullname');

			var isTextAreaPresent = jQuery('textarea.'+dataFullname);
			if(isTextAreaPresent.length == 1) {
				jQuery(isTextAreaPresent).toggle();
			} else {
				// figure out the element where we're going to insert the textarea
				var prependTo = jQuery(linkEl).parent().parent();

				// do an ajax request to fetch the data from the api
				// because we cannot fetch a message and a link/comment with the same api call
				// we need to figure out, if we are on a message site
				var apiURL;
				if(this.currentPage === 'message') {
						// cut off t4_ for filtering
						messageId =  dataFullname.slice(3, dataFullname.length);
						apiURL = '/message/messages/.json?mid='+messageId+'&count=1';
					} else {
						apiURL = '/api/info.json?id=' + dataFullname;
					}

					var that = this;
					this._fetchSourceCode(apiURL, dataFullname, function(source) {
						that._createSourceCodeTextarea(source, dataFullname, prependTo);
					});
				}
			},

	// ////////////////////////////////////////////////////////////////////////
	// 'save as mod' related stuff
	// ////////////////////////////////////////////////////////////////////////

	/**
	 * Place a 'save as mod' in the comment forms.
	 *
	 * Parameters:
	 *  el (jQuery element) - form element to place the button in; leave out to inject into all
	 */
	 _injectSaveAsMod: function(el) {
	 	var that = this;
	 	if(typeof el === 'undefined') {
	 		el = false;
	 	}

		// no element given -> inject into all forms
		var injectHere = new Array();
		if(el === false) {
			injectHere = jQuery('.usertext-buttons');
		} else {
			injectHere.push(jQuery(el).find('.usertext-buttons')[0]);
		}

		// inject between save and cancel
		for(i = 0; i < injectHere.length; i++) {
			// element where the buttons life in
			var divEl = injectHere[i];

			// button to inject; register click function...
			var buttonEl = jQuery('<button type="button" class="raawSaveAsMod">save as mod</button>');
			jQuery(buttonEl).click(function(e) {
				that.saveAsMod(e);
			});

			// find save button and add save as mod after that
			jQuery(divEl).find('button[type="submit"]').after(buttonEl);
		}

		// remove the buttons from the edit form
		jQuery('div.entry .usertext-buttons button.raawSaveAsMod').remove();

		// find all  reply links
		var replyButtons = jQuery('ul.flat-list li a').filter(function(index, el) {
			return jQuery(el).text() === 'reply';
		});

		for(i = 0; i < replyButtons.length; i++) {
			var button = replyButtons[i];
			jQuery(button).click(function(e) {
				setTimeout(function() {
					var allButtons = jQuery('button.raawSaveAsMod');
					for(i = 0; i < allButtons.length; i++) {
						var button = allButtons[i];
						jQuery(button).off('click');
						jQuery(button).click(function(e) {
							that.saveAsMod(e);
						});
					}
				}, 500);
			});
		}
	},

	/**
	 * Method will prevent a comment form to submit in the first place. Will fetch the
	 * thing id to use it for distinguishing. After that will submit the form and when the
	 * submit is finished distinguish the comment itself.
	 *
	 * Parameters:
	 *  click (jQuery click event)
	 */
	 saveAsMod: function(click) {
	 	click.preventDefault();
	 	var form = jQuery(click.target).closest('form.usertext');

		// get parent
		var hiddenInput = jQuery(form).children('input[name="thing_id"]')[0];
		var parent = jQuery(hiddenInput).val();

		// get comment text
		var textarea = jQuery(form).find('textarea')[0];
		var commentText = jQuery(textarea).val();

		var modhash = this._getModhash();
		// post comment
		data = {
			'api_type': 'json'
			, 'text': commentText
			, 'thing_id': parent
			, 'uh': modhash
		};
		jQuery.post('/api/comment', data).done(function(response) {
			if(response.json.errors.length > 0) {
				console.log('Error while posting comment:');
				console.log(response.json.errors);
				alert('Error while posting comment. Please check the console for more information!');
				return;
			}

			// distinguish
			var commentData = response.json.data.things[0].data;
			var data = {
				'id': commentData.id
				, 'api_type': 'json'
				, 'how': 'yes'
				, 'uh': modhash
			};
			jQuery.post('/api/distinguish', data).done(function(response) {
				if(response.json.errors.length > 0) {
					console.log('Error while posting comment:');
					console.log(response.json.errors);
					alert('Error while posting comment. Please check the console for more information!');
					return;
				}

				location.reload();
			});
		});
	},

	// ////////////////////////////////////////////////////////////////////////
	// nuke functions
	// ////////////////////////////////////////////////////////////////////////

	/**
	 * Find the a comment with the given id in a response object.
	 *
	 * Parameters:
	 *	commentId (string) - something like t1_abc
	 *	response (object) - response object returned by a API call
	 *
	 * Returns:
	 *	(object) or undefined
	 */
	 _findCommentInResponse: function(commentId, response) {
	 	var searchedComment;

		// build a search queue to go through
		var search = new Array();
		for(var i = 0; i < response.length; i++) {
			var listing = response[i].data.children;
			for(var n = 0; n < listing.length; n++) {
				var content = listing[n];

				// if data is something else than a comment skip
				if(content.kind !== 't1') {
					continue;
				} else {
					// the comment is the one we search
					if(content.data.id === commentId) {
						return content;
					} else {
						// comment is not what we search but maybe one of his replies?
						// add replies to search queue
						if(typeof content.data.replies !== 'undefined' && content.data.replies !== '') {
							search = search.concat(content.data.replies.data.children);
						}
					}
				}
			}
		}

		while(search.length > 0) {
			var currentObj = search.pop();

			// check if this is the right comment
			if(currentObj.data.id === commentId) {
				return currentObj;
			}

			// add all the replies of this comment to the search array
			if(currentObj.data.replies !== '') {
				search = search.concat(currentObj.data.replies.data.children);
			}
		}

		return searchedComment;
	},

	/**
	 * Will find all replies to the given comment.
	 *
	 * Parameters:
	 *	obj (object) - thing object returned by a API call
	 *
	 * Returns:
	 *	(Array) Maybe an empty array if no replies where found. Array holds the ids as a
	 *		string. E.g. '1234', 'a23pav', ...
	 */
	 _findAllReplies: function(obj) {
	 	var replies = new Array();

		// check if there are replies
		if(obj.data.replies === '') {
			return replies;
		}

		var search = new Array();
		for(var i = 0; i < obj.data.replies.data.children.length; i++) {
			var reply = obj.data.replies.data.children[i];
			replies.push(reply.data.id);
			if(typeof reply.data.replies !== 'undefined' && reply.data.replies !== '') {
				search = search.concat(reply.data.replies.data.children);
			}
		}

		while(search.length > 0) {
			var currentObj = search.pop();

			// 'more' occures if there are more than 10 entries
			if(currentObj.kind === 'more') {
				continue;
			}

			// add the id of the current reply
			replies.push(currentObj.data.id);

			// add all replies to the reply to the search
			if(currentObj.data.replies !== '') {
				search = search.concat(currentObj.data.replies.data.children);
			}
		}

		return replies;
	},

	/**
	 * As found on https://github.com/agentlame/Reddit-Mod-Nuke-Userscript/blob/master/modnuke.user.js
	 *
	 * Only reversed the iteration order and fading out the elements.
	 */
	_nukeComment: function(thread_root) {
		var elmnts = document.getElementsByClassName('id-'+thread_root)[0].querySelectorAll('form input[value="removed"]~span.option.error a.yes,a[onclick^="return big_mod_action($(this), -1)"]');
		for(var i=elmnts.length-1; i >= 0; i--) {
		setTimeout(
			(function(_elmnt) {
			return function() {
				jQuery(_elmnt).closest('.thing').hide(750);
				var event = document.createEvent('UIEvents');
				event.initUIEvent('click', true, true, window, 1);
				_elmnt.dispatchEvent(event);
			}}
			)(elmnts[i]), 1500*(elmnts.length-i)); // 1.5s timeout prevents overloading reddit.
		};
	 },

	/**
	 * Inject the nuke function as found on
	 * https://github.com/agentlame/Reddit-Mod-Nuke-Userscript/blob/master/modnuke.user.js
	 */
	_injectNuke: function() {
		var that = this;
		var nuke_button = new Array();
		var divels = document.querySelectorAll('div.noncollapsed');
		var comment_ids = new Array();
		var use_image = false;
		// create img DOM element to clone
		if(use_image) {
			try {
				var img_element =  document.createElement('img');
				img_element.setAttribute('alt', 'Nuke!');
				img_element.setAttribute('src', chrome.extension.getURL('nuke.png'));
			} catch(e) {
				use_image = false;
			}
		}
		for (var i = 0; i < divels.length; i++) {
			var author_link = divels[i].querySelector('p.tagline>a.author,p.tagline>span.author,p.tagline>em');
		// p.tagline>a.author is normal comment;
		// some author deleted comments seem to have either
		// p.tagline>span.author or p.tagline>em

		comment_ids[i] = divels[i].getAttribute('data-fullname');
		// console.log(i + ':' + comment_ids);
		if(author_link) {
			// create link DOM element with img inside link
			nuke_button[i] = document.createElement('a')
			nuke_button[i].setAttribute('href', 'javascript:void(0)');
			nuke_button[i].setAttribute('title', 'Nuke!');
			nuke_button[i].setAttribute('id', 'nuke_'+i);
			if(use_image) {
				nuke_button[i].appendChild(img_element.cloneNode(true));
			} else {
				nuke_button[i].innerHTML= "[Nuke]";
			}
			// append after the author's name
			author_link.parentNode.insertBefore(nuke_button[i], author_link.nextSibling);

			// Add listener for click; using IIFE to function with _i as value of i when created; not when click
			nuke_button[i].addEventListener('click',
				(function(_i) {
					return function() {
						var continue_thread = divels[_i].querySelectorAll('span.morecomments>a');
						var comment_str = " comments?";
						if(continue_thread.length > 0) {
							comment_str = "+ comments (more after expanding collapsed threads; there will be a pause before the first deletion to retrieve more comments)?";
						}
						var delete_button = divels[_i].querySelectorAll('form input[value="removed"]~span.option.error a.yes,a[onclick^="return big_mod_action($(this), -1)"]');
						// form input[value="removed"]~span.option.error a.yes -- finds the yes for normal deleting comments.
						// a.pretty-button.neutral finds the 'remove' button for flagged comments
						if (confirm("Are you sure you want to nuke the following " + delete_button.length + comment_str)) {
							for (var indx=0; indx < continue_thread.length; indx++) {
								var elmnt = continue_thread[indx];
								setTimeout(
									function() {
										var event = document.createEvent('UIEvents');
										event.initUIEvent('click', true, true, window, 1);
										elmnt.dispatchEvent(event);
								}, 2000*indx); // wait two seconds before each ajax call before clicking each "load more comments"
							}
							if(indx > 0) {
								setTimeout(function() {that._nukeComment(comment_ids[_i])},
									2000*(indx + 2)); // wait 4s after last ajax "load more comments"
							} else {
								that._nukeComment(comment_ids[_i]); // call immediately if not "load more comments"
							}
						}
					}
				}
				)(i)); // end of IIFE (immediately invoked function expression)
			}
		}
	}
};

// initialize when document loaded
jQuery(document).ready(function() {
	RaaW.init();
});