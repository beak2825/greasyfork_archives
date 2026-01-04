// ==UserScript==
// @name         Wanikani Forums: Hide Users
// @namespace    Wanikani Forums: Hide Users
// @version      2.0.7.
// @description  Makes it possible to remove people from the forums.
// @author       Kumirei
// @include      https://community.wanikani.com*
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38845/Wanikani%20Forums%3A%20Hide%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/38845/Wanikani%20Forums%3A%20Hide%20Users.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

var userList;

(function() {
		getList();			// Get list of users to hide
		setTriggers();		// Set triggers for when the script should fire
		hideUsers();		// Hide anything which happens to be on the page

		// Do stuff when entering a new thread
		waitForKeyElements('.post-stream', function(){
			makeObserver(observerFunction, "post-stream");	// Set up mutation observer for new posts
			hideUsers();									// Hide users when using slider to jump
		});

		// Hide user in "who liked" dropdown
		waitForKeyElements('.who-liked', hideWhoLiked);

		// Detect embedded replies
		waitForKeyElements('.embedded-posts', hideEmbedded);

		// Add the hide button to usercards
		waitForKeyElements('.card-content .name-username-wrapper', function(){
			var userName = $('.name-username-wrapper')[0].innerText;
			var userID = $('.trigger-user-card[href="/u/'+userName+'"]').closest('article').attr('data-user-id');
			var li = document.createElement('li');
			var btn = document.createElement('button');
			btn.onclick = ()=>{addUser(userName, userID);};
			btn.className = 'btn addUserButton';
			btn.title = 'Hide or unhide everything about this person on the forums';
			btn.innerText = 'Hide User';
			li.appendChild(btn);
			$('.usercard-controls').append(li);
		});

		// Add manage button in menu
		waitForKeyElements('.menu-container-footer-links .menu-links', function(e) {
			var li = document.createElement('li');
			var a = document.createElement('a');
			a.className = 'widget-link WKFhideUsersMenu';
			a.title = 'Manage Hidden Users';
			a.onclick = openMenu;
			var span = document.createElement('span');
			span.class = 'd-label';
			span.innerText = 'Hidden Users';
			a.appendChild(span);
			li.appendChild(a);
			e[0].appendChild(li);
		});

		// Get list of hidden users from storage
		function getList() {
				userList = localStorage.getItem('WKFhideUsersList');
				if (userList === null || userList === "") {
						userList = [];
				}
				else {
						userList = $.parseJSON(userList);
				}
				console.log("Hidden Users: ", userList);
		}

		// Create a new observer
		function makeObserver(func, targetClass) {
				var target = document.getElementsByClassName(targetClass)[0];
				if (target !== undefined) {
						var observer = new MutationObserver(function(mutations) {
								mutations.forEach(function(mutation) {
										func(mutation);
								});
						});
						var config = {childList: true};
						observer.observe(target, config);
				}
		}

		// Call the hideUsers function if there are new nodes of the relevant classes
		function observerFunction(mutation) {
				if ((mutation.addedNodes[0] !== undefined) && (mutation.addedNodes !== undefined)) {
						if (mutation.addedNodes[0].className.includes("topic-post")) {
								hideUsers();
						}
				}
		}

		// Do the magical hiding stuff
		function hideUsers() {
				$(userList).each(function(i, user) {
						hideUser(user);
				});
		}

		// Set the triggers for when the script should fire
		function setTriggers() {
				// Loading the window
				window.addEventListener('load', hideUsers);

				// Using back and forth buttons
				window.addEventListener('popstate', function() {setTimeout(hideUsers, 1000);});

				// Navigating
				(function(history){
						var pushState = history.pushState;
						history.pushState = function(state) {
								hideUsers();
								return pushState.apply(history, arguments);
						};
				})(window.history);

				// Scrolling
				var i = 0;
				window.onscroll = function() {
						if (i % 50 == 0) {
								hideUsers();
						}
						i++;
				};
		}

		// Hide users in who-liked dropdown
		function hideWhoLiked(e) {
				var elem = e[0];
				var likeCountElem = $(elem).siblings('.post-controls').find('.like-count')[0];
				hidePostMeta(elem, 'a', 'a', '', '', likeCountElem, 'width: 64px; height: 30px;', 'this post has been liked by hidden users', likeCountElem);
		}

		// Hide users in embedded replies
		function hideEmbedded(e) {
				var elem = e[0];
				var replyCountElem = $(elem).siblings('.post-menu-area').find('.show-replies')[0];
				hidePostMeta(elem, '.trigger-user-card', 'div .reply', ' Replies', ' Reply', replyCountElem, 'width: 40px; height: 30px;', 'this post has been replied to by hidden users', replyCountElem.children[0]);
				replyCountElem.children[1].style = 'margin-left: 0;';
		}

		// Edit the elements of the above two functions
		function hidePostMeta(elem, target, countTarget, texts, text, countElem, countStyle, countEmptyText, textElem) {
				for (var i = 0; i < userList.length; i++) {
						var e = $(elem).find(target+'[data-user-card="'+userList[i].split(':')[0]+'"]');
						if (e.length) {
								e.closest('.reply').closest('div').remove();
								e.remove();
						}
				}
				var count = $(elem).find(countTarget).length;
				var countText = texts;
				if (count == 1) {countText = text;}
				else if (count == 0) {
						count = '';
						countText = '';
						$(countElem).attr('style', countStyle);
						$(countElem).attr('title', '');
						elem.style = 'border: 0;';
						elem.innerText = countEmptyText;
				}
				textElem.innerText = count + countText;
		}

		// Hide the user's stuffsies
		function hideUser(user, unhide) {
				var userName = user.split(':')[0];
				var userID = user.split(':')[1];
				var display = "display: none;";
				if (unhide) {display = "display: initial;";}

				// Posts
				$("[data-user-id='" + userID + "']").closest($('.topic-post')).attr('style', display);

				// Replies
				$('.reply-to-tab img[title="'+userName+'"]').closest('.reply-to-tab').attr('style', display);

				// Quotes
				$('.quote .title').each(function() {if(this.innerText.includes(userName)) {$(this).closest('.quote').attr('style', display + '!important');}});

				// Css stuff
				hideWithCSS(userName, userID);
		}

		// Hides things with css, which is much easier
		function hideWithCSS(userName, userID) {
				if ($('head .WKFhideUsers[user-id="'+userID+'"]').length == 0) {
						$('head').append(
								'<style class="WKFhideUsers" user-id="'+userID+'">'+
								'	.trigger-user-card[data-user-card="'+userName+'"],'+
								'   a[data-user-card="'+userName+'"] {'+
								'		display: none;'+
								'	}'+
								''+
								'.WKFhideUsersListItem:hover {background-color: #ffffa6;}'+
								'</style>'
						);
				}
		}

		// Adds a user to the userlist or removes a user if it is already on the list
		addUser = function(userName, userID) {
				if (userID === undefined) {alert('No user ID found; try opening the user card from a post instead');}
				else {
						var userStr = userName+':'+userID;
						if (userList.includes(userStr)) {
								userList.splice(userList.indexOf(userStr), 1);
								hideUser(userStr, true);
								$('#WKFhideUsersMenu .WKFhideUsersListItem[user-id="'+userID+'"]').remove();
								$('head .WKFhideUsers[user-id="'+userID+'"]').remove();
								alert('You may have to refresh to unhide some items');
						}
						else {
								userList.push(userStr);
								//hide usercard
								$('#user-card').hide();
								hideUser(userStr);
								alert('You may have to refresh for user to be completely hidden');
						}
						localStorage.setItem("WKFhideUsersList",JSON.stringify(userList));
				}
		};

		// Opens up the menu for managing hidden users
		openMenu = function() {
			var div = $('<div class="menu-panel" id="WKFhideUsersMenu" height="100px !important" width="100px" style="left: 0; bottom: -10px; position: absolute; transform: translate(0, 100%);">'+
						'<div style="border-bottom: 1px solid black;"><span style="padding-left: 0.5em;"><b>Click name to stop hiding</b></span></div><ul>')[0];
			for (var i = 0; i < userList.length; i++) {
					var userInfo = userList[i].split(':');
					var li = document.createElement('li');
					li.className = 'WKFhideUsersListItem';
					li.setAttribute('user-id', userInfo[1]);
					li.onclick = ()=>{addUser(userInfo[0], userInfo[1])};
					var a = document.createElement('a');
					a.className = 'widget-link';
					a.style = "display: inline-block; padding: 0.25em 0.5em;";
					a.innerText = userInfo[0];
					li.appendChild(a);
					div.appendChild(li);
			}
			if (!$('#WKFhideUsersMenu').length) {$('.menu-panel').append(div);}
			else {$('#WKFhideUsersMenu').remove();}
		};
})();
