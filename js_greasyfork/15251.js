// ==UserScript==
// @name         BestSubscriber
// @namespace    https://greasyfork.org/es/scripts/15251-bestsubscriber
// @version      0.2
// @description  Organiza tus suscripciones por juego y da like automáticamente a los vídeos que veas
// @author       DonNadie
// @match        https://*.youtube.com/feed/subscriptions
// @match        https://*.youtube.com/*
// @match        https://*.youtube.com/watch?v=*
// @grant        none
// @require 	 https://code.jquery.com/jquery-latest.js
// @require 	 https://cdn.jsdelivr.net/sortable/1.4.2/Sortable.min.js
// @require 	 https://greasyfork.org/scripts/15246-micro-templating/code/Micro%20templating.js?version=95830
// @require 	 https://greasyfork.org/scripts/1003-wait-for-key-elements/code/Wait%20for%20key%20elements.js?
version=49342
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/15251/BestSubscriber.user.js
// @updateURL https://update.greasyfork.org/scripts/15251/BestSubscriber.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var BestSubscriber = function ()
{
	var gameList,
		debugMode = false,
		skipWords = [
			'gameplay',
			'episode',
			'episodio',
			'ps4',
			'xbox 360',
			'xbox one',
			'xbox',
			'directo',
		];

	String.prototype.capitalizeFirstLetter = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};
	String.prototype.friendly = function () {
		var str = this;
		if (typeof max == "undefined") max = 32;
		var a_chars = new Array(
			new Array("a",/[áàâãªÁÀÂÃ]/g),
			new Array("e",/[éèêÉÈÊ]/g),
			new Array("i",/[íìîÍÌÎ]/g),
			new Array("o",/[òóôõºÓÒÔÕ]/g),
			new Array("u",/[úùûÚÙÛ]/g),
			new Array("c",/[çÇ]/g),
			new Array("n",/[Ññ]/g)
		);
		// Replace vowel with accent without them
		for(var i=0;i<a_chars.length;i++)
		str = str.replace(a_chars[i][1],a_chars[i][0]);
		// first replace whitespace by -, second remove repeated - by just one, third turn in low case the chars,
		// fourth delete all chars which are not between a-z or 0-9, fifth trim the string and
		// the last step truncate the string to 32 chars
		return str.replace(/\s+/g,'-').toLowerCase().replace(/[^a-z0-9\-]/g, '').replace(/\-{2,}/g,'-').replace(/(^\s*)|(\s*$)/g, '').substr(0, max);
	};

	var init = function ()
	{
		var k,
			game;

		gameList = getConfig();
		setupPanel();

		// detect AJAX navigation
		var observer = new MutationObserver(function(mutations) {
			// We observe the title, so our key elements in body may not be loaded yet
			setTimeout(function () {
				firePageActions();
			}, 100);
		});

		observer.observe(document.querySelector('title'), { childList: true});

		firePageActions();
	}

	var firePageActions = function ()
	{
		if (location.pathname.indexOf("feed/subscriptions") !== -1 && $('.best-subscriber-section').length == 0) {
			setupSubscriptionFeed();
		}
		else if (location.pathname.indexOf("watch") !== -1)
		{
			log("Inside a video");
			if ($(".video-stream.html5-main-video").length == 0) {
				waitForKeyElements (".video-stream.html5-main-video", function () {
					setTimeout(autoLike, 750);
				});
			} else {
				setTimeout(autoLike, 750);
			}
		}
	}

	var getConfig = function ()
	{
		var config = localStorage.bestSubscriber;

		if (config === undefined) {
			// default config
			return [{
				name: 'gta',
				display: false,
			},
			{
				name: 'hurtworld',
				display: true,
			},
			{
				name: 'h1z1',
				display: true,
			},
			{
				name: 'rust',
				display: true,
			}];
		}

		return JSON.parse(config);
	}

	var setConfig = function (config)
	{
		if (config === undefined || !Array.isArray(config)) {
			return;
		}

		localStorage.bestSubscriber = JSON.stringify(config);
	}

	var updateGame = function (name, key, val)
	{
		var k,
			list = getConfig();

		for (k in list) {
			if (list[k].name.friendly() == name) {
				list[k][key] = val;
				setConfig(list);
				break;
			}
		}
	}

	var setupPanel = function ()
	{
		$('#yt-masthead-user').append('<button class="yt-uix-button yt-uix-button-default" data-action="toggle-config-panel" style="margin-left: 20px">BestSubcriber</button>');

		$('#masthead-positioner').prepend(parseTemplate(function () {/*
			<div id="best-subscriber-config">
				<h3>Orden:</h3>
				<ul>
					<%for (var i=0; i<list.length; i++){ %>
						<li><span data-name><%=list[i].name%></span> <span class="bs-delete-button" data-action="delete-game" title="Quitar de la lista">x</span></li>
					<% } %>
				</ul>
				<div>
					<label>
						<input type="text" name="new-game-name" placeholder="GTA 5">
					</label>
					<button data-action="add-game" class="add-button" title="Añadir a la lista">+</button>
				</div>
				<button data-action="save-config" class="yt-uix-button yt-uix-button-default bs-save-button">Guardar cambios</button>
			</div>
			<style>
				#best-subscriber-config {
					display: none;
					position: fixed;
					background: white;
					padding: 10px;
					border: 1px solid;
					left: 89%;
					top: 44%;
					z-index: 1999999999; // set by Youtube..
				}
				#best-subscriber-config li {
					cursor: all-scroll;
					border: 1px dashed;
					padding: 5px;
				}
				#best-subscriber-config li:hover {
					background: #F8F8F8;
				}
				#best-subscriber-config .bs-save-button {
					margin-top: 10px;
					float: right;
				}
				#best-subscriber-config .bs-delete-button {
					font-weight: bold;
					float: right;
					cursor: pointer;
					color: red;
				}
				#best-subscriber-config input {
					margin-top: 5px;
				}
				#best-subscriber-config .add-button {
					color: green;
					font-weight: bold;
					cursor: pointer;
				}
			</style>
		*/}, {list: gameList.slice().reverse()})); // revert the arary to display it in the right order in config panel

		 //$("#best-subscriber-config ul").sortable();
		 Sortable.create($("#best-subscriber-config ul")[0]);

		 $('[data-action="toggle-config-panel"]').on("click", function () {
			 $("#best-subscriber-config").toggle();
		 });

		 $('input[name="new-game-name"]').on("keydown", function(e) {
 			if (e.keyCode == 13) {
 			    e.preventDefault();

 				addGame();
 			}
 		});

 		$('[data-action="add-game"]').on("click", addGame);

 		$('[data-action="delete-game"]').on("click", function () {
 			var game = $(this).closest("[data-name]").text();

 			deleteGame(game);
 			$(this).closest("li").remove();
 		});

 		$('[data-action="save-config"]').on("click", function () {
 			var k,
 				list = [],
 				tmpList = {},
 				oldList = getConfig();

 			for (k in oldList) {
 				tmpList[oldList[k].name] = oldList[k];
 			}

 			$('#best-subscriber-config li span[data-name]').each(function () {
 				var name = $(this).text();
 				list.push(tmpList[name]);
 			});
 			list.reverse();

 			setConfig(list);
 			location.reload();
 		});
	}
	var setupSubscriptionFeed = function () {
		// create the categories (games)
		for (k in gameList)
		{
			game = gameList[k];
			$('#browse-items-primary ol.section-list').prepend(parseTemplate(function () {
				/*
				<li id="game-<%=game.name.friendly() %>" class="best-subscriber-section">
					<ol class="item-section">
						<li>
							<div class="feed-item-container browse-list-item-container yt-section-hover-container compact-shelf shelf-item branded-page-box clearfix">
								<div class="feed-item-dismissable">
									<div class="shelf-title-table">
										<div class="shelf-title-row">
											<h2 class="branded-page-module-title shelf-title-cell"><span class="branded-page-module-title-text"><%=game.name.capitalizeFirstLetter()%></span></h2>
											<div class="menu-container shelf-title-cell">
												<div class="yt-uix-menu-container feed-item-action-menu">
													<ul class="yt-uix-menu-top-level-button-container">
														<li class="yt-uix-menu-top-level-button yt-uix-menu-top-level-flow-button">
															<button data-action="toggle" data-game="<%=game.name.friendly()%>" class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-empty yt-uix-button-has-icon yt-uix-tooltip" onclick=";return false;" title="Mostrar/Ocultar">
																<span class="yt-uix-button-icon-wrapper">
																  <span class="yt-uix-button-icon yt-sprite yt-uix-expander-arrow" <% if (game.display){ %>style="transform: rotate(180deg);"<% } %>>
																	</span>
																</span>
															</button>
														</li>
													</ul>
												</div>
											</div>
										</div>
									</div>
									<div class="multirow-shelf">
										<ul class="shelf-content" data-section="videos" <% if (!game.display){ %>style="display:none"<% } %>>

										</ul>
									</div>
								</div>
								<div class="feed-item-dismissal-notices"></div>
							</div>
						</li>
					</ol>
				</li>
			*/}, { game : game }));
		}


		// move the videos
		$('.yt-shelf-grid-item').each(function () {
				var regex,
					title = $(".yt-lockup-title a", this).text();

			for (k in gameList)
			{
				game = gameList[k];
				regex = new RegExp(game.name, "i");


				if (title.search(regex) !== -1) {
					$('#game-' + game.name.friendly() + ' [data-section="videos"]').append($(this));
				}
			}
		});

		// show/hide categories
		$('[data-action="toggle"]').on("click", function () {
			var game = $(this).data("game"),
				isVisible = false,
				list = getConfig(),
				$videosContainer = $('#game-' + game + ' [data-section="videos"]');

			$videosContainer.toggle();
			isVisible = $videosContainer.is(":visible")

			if (isVisible) {
				$('.yt-uix-expander-arrow', this).css("transform", "rotate(180deg)");
			} else {
				$('.yt-uix-expander-arrow', this).css("transform", "");
			}

			updateGame(game, "display", isVisible);
		});
	}

    var autoLike = function ()
	{
		log("Liking");
		var $likeButton = $('.like-button-renderer-like-button-unclicked'),
			eventObject;

		// is already liked or user is not subscribed
		if (!$likeButton.is(":visible") || !$('.yt-uix-button-subscribed-branded').is(":visible")) {
			log("not clicking");
			return;
		}

        eventObject = document.createEvent('MouseEvents');

        eventObject.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        $likeButton[0].dispatchEvent(eventObject);
    }

	var deleteGame = function (name)
	{
		var k,
			list = getConfig();

		for (k in list) {
			if (list[k].name == name) {
				list = list.splice(k, 1);
				break;
			}
		}
		setConfig(list);
	}

	var addGame = function ()
	{
		var game = $('input[name="new-game-name"]').val(),
			list = getConfig();

		if (game.length < 2) {
			return;
		}

		$('input[name="new-game-name"]').val("");
		$('#best-subscriber-config ul').append('<li><span data-name>' + game + '</span> <span class="bs-delete-button" data-action="delete-game" title="Quitar de la lista">x</span></li>');

		list.push({
			name: game,
			display: true
		});

		setConfig(list);
	}

	var parseTemplate = function(f, data)
	{
		var html = f.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '');

		if (typeof data != 'undefined') {
			return _tmpl(html, data);
		} else {
			return html;
		}
	}

	// Not finished, suggests game names for the list for the first time
	var suggestGameNames = function ()
	{
		$('.yt-shelf-grid-item').each(function () {
				var title = $(".yt-lockup-title a", this).text(),
					publisher = $(".yt-lockup-byline a", this).text();

			console.log(title.replace(publisher, ''));
		});
	}

	var log = function () {
		if (debugMode) {
			console.log.apply(console, arguments);
		}
	}

	return {
		init : init,
	};
}();


$(document).ready(function() {
	BestSubscriber.init();
});
