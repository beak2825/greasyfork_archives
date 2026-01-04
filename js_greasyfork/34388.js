// ==UserScript==
// @name        Space-efficient Youtube
// @namespace   1N07
// @author      1N07
// @icon        https://i.imgur.com/VgEiyi3.png
// @icon64      https://i.imgur.com/VgEiyi3.png
// @description AKA: "Wide Youtube", AKA: "Wide video container" - Uses the page space on youtube more efficiently (especially good for high resolutions)
// @license     unlicense
// @match       https://www.youtube.com/*
// @version     2.4.8
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/34388/Space-efficient%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/34388/Space-efficient%20Youtube.meta.js
// ==/UserScript==

(function() {
    if(true)
    {
        var configCSS = `
			#SEYConfig {
				width: 320px !important;
				height: auto !important;
				max-height: 100% !important;
				border: none !important;
				border-radius: 0 0 0 20px !important;
				box-shadow: black -1px 1px 20px;
				position: fixed !important;
				top: 0 !important;
				right: 0 !important;
				left: unset !important;
				background: #383838 !important;
			}

			#SEYConfig_wrapper
			{
				padding: 10px;
				background-color: #212121;
				color: white;
				background-color: transparent;
			}

			#SEYConfig .config_var
			{
				padding: 1px 20px;
			}

			#SEYConfig input
			{
				background-color: #181818;
				color: white;
				border: none;
				float: left;
				margin-right: 5px;
			}

			#SEYConfig input[type="text"]
			{
				width: 40px;
				text-align: center;
			}

			#SEYConfig input[type="checkbox"]
			{
				filter: invert(90%);
			}

			#SEYConfig .saveclose_buttons
			{
				background-color: #181818;
				color: white;
				border-color: gray;
                margin: 16px 5px 5px;
			}

			#SEYConfig .section_header {
				background: #202020;
				margin-bottom: 5px;
			}

			#SEYConfig .section_header_holder {
				margin-top: 8px;
				background-color: rgba(0,0,0,0.3);
				padding: 0 0 5px 0;
				border-radius: 0 0 10px 10px;
			}

			#SEYConfig_resetLink { color: white !important; }
		`;
    }

    var frame = document.createElement('div');
    frame.id = "SEYConf";
    document.body.appendChild(frame);

	var gmc = new GM_config({
		'id': 'SEYConfig', // The id used for this instance of GM_config
		'title': 'Space-efficient Youtube Config',
		'fields': // Fields object
		{
			'FPPCompOn': // This is the id of the field
			{
				'section': 'Fade++',
				'label': 'Fade++ compatibility mode', // Appears next to field
				'type': 'checkbox', // Makes this setting a text field
				'default': false // Default value if user doesn't change it
			},

			'HomeVideoContainerWidthEnabled':
			{
				'section': 'Home page',
				'label': 'Video container size mod enabled',
				'title': 'Enables the video sizing modification below. This is disabled by default for now, due to a change in how YT renders videos on the home page. Might fix later. Enabling this will cause the video containers to be sized as set below, but the empty space is not properly used.',
				'type': 'checkbox',
				'default': false
			},
			'HomeVideoContainerWidth':
			{
				'label': 'Video container width',
				'title': 'The width of the container which includes both the thumbnail and the title/other info',
				'type': 'unsigned float',
				'default': '360'
			},
			'HideChannelIconNextToVideosOnHomePage':
			{
				'label': 'Hide channel icon in video container',
				'type': 'checkbox',
				'default': false
			},

			'SubVideoContainerWidth':
			{
				'section': 'Subscriptions page',
				'label': 'Video container width',
				'title': 'The width of the container which includes both the thumbnail and the title/other info',
				'type': 'unsigned float',
				'default': '210'
			},

			'TrendingVideoContainerWidth':
			{
				'section': 'Trending page',
				'label': 'Video container width',
				'title': 'The width of the container which includes both the thumbnail and the title/other info',
				'type': 'unsigned float',
				'default': '600'
			},
			'TrendingVideoContainerHeight':
			{
				'label': 'Video container height',
				'title': 'The height of the container. This directly affects thumnail size and how much space is left for the other info',
				'type': 'unsigned float',
				'default': '138'
			},

			'HQTN':
			{
				'section': 'Subscriptions & Trending pages',
				'label': 'Load high quality thumbnails',
				'title': 'The default thumbnail resolution is fitted for the default video container size, so if you use defaults(or smaller) there is no need to enable this.',
				'type': 'checkbox',
				'default': false
			},

			'SearchVideoContainerWidth':
			{
				'section': 'Search results page',
				'label': 'Video container width',
				'title': 'The width of the container which includes both the thumbnail and the title/other info',
				'type': 'unsigned float',
				'default': '600'
			},
			'SearchVideoContainerHeight':
			{
				'label': 'Video container height',
				'title': 'The height of the container. This directly affects thumnail size and how much space is left for the other info',
				'type': 'unsigned float',
				'default': '150'
			},
			'HideSearchVideoBadges':
			{
				'label': 'Hide video badges',
				'title': 'Hides the little badges like New/4K/CC etc. on the video containers leaving more space for the description',
				'type': 'checkbox',
				'default': true
			},

			'VPRecommendedSectionWidth':
			{
				'section': 'Video Page Recommended',
				'label': 'Recommended section width',
				'title': 'The width of the recommended section holding the video containers. [Theater mode only]',
				'type': 'unsigned float',
				'default': '426'
			},
			'VPRecommendedVideoContainerHeight':
			{
				'label': 'Video height',
				'title': 'The height of the container. This directly affects thumnail size and how much space is left for the other info [Theater mode only]',
				'type': 'unsigned float',
				'default': '94'
			},
			'VPRecommendedColumnCount':
			{
				'label': 'Video column count',
				'title': 'How many columns of videos to display. This directly affects the video container width of each video. e.g. 2 = 2 columns where video container width is 50% of the section width [Theater mode only]',
				'type': 'unsigned float',
				'default': '1'
			},

			'AutoExpandChannelVidContainers':
			{
				'section': 'Channel pages',
				'label': 'Auto-expand horizontal video lists',
				'type': 'checkbox',
				'default': false
			}
		},
		'frame': frame,
		'css': configCSS,
		'events': {
            //called after GM_config init has finished
            'init': function() { MainScriptWrapper(); }
        }
	});


	function MainScriptWrapper()
	{
		var refreshAfterSave = false;
		gmc.onOpen = function(doc, win, frame) {
			let saveBtn = frame.querySelector("#SEYConfig_saveBtn");
			let clone = saveBtn.cloneNode();
			clone.id = "SEYConfig_saveRefreshBtn";
			clone.textContent = "Save & Refresh";
			saveBtn.parentNode.insertBefore(clone, saveBtn);
			clone.onclick = function(){
				refreshAfterSave = true;
				saveBtn.click();
			};
		};
		gmc.onSave = function(){
			if(refreshAfterSave)
				location.reload();
		};

		var FPPCompOn = gmc.get('FPPCompOn');
		var HomeVideoContainerWidthEnabled = gmc.get('HomeVideoContainerWidthEnabled');
		var HomeVideoContainerWidth = CleanNumber(gmc.get('HomeVideoContainerWidth'));
		var HideChannelIconNextToVideosOnHomePage = gmc.get('HideChannelIconNextToVideosOnHomePage');
		var SubVideoContainerWidth = CleanNumber(gmc.get("SubVideoContainerWidth"));
		var TrendingVideoContainerWidth = CleanNumber(gmc.get('TrendingVideoContainerWidth'));
		var TrendingVideoContainerHeight = CleanNumber(gmc.get('TrendingVideoContainerHeight'));
		var HQTN = gmc.get('HQTN');
		var SearchVideoContainerWidth = CleanNumber(gmc.get('SearchVideoContainerWidth'));
		var SearchVideoContainerHeight = CleanNumber(gmc.get('SearchVideoContainerHeight'));
		var HideSearchVideoBadges = gmc.get('HideSearchVideoBadges');
		var AutoExpandChannelVidContainers = gmc.get('AutoExpandChannelVidContainers');
		var VPRecommendedSectionWidth = CleanNumber(gmc.get('VPRecommendedSectionWidth'));
		var VPRecommendedVideoContainerHeight = CleanNumber(gmc.get('VPRecommendedVideoContainerHeight'));
		var VPRecommendedColumnCount = CleanNumber(gmc.get('VPRecommendedColumnCount'));


		GM_registerMenuCommand("Settings", () => {
			if(!gmc.isOpen)
				gmc.open();
		});

		const ratioMultiplier = 16 / 9;
		var screenWidth = screen.width;
		if(!!document.getElementById("early-body")) { //if old youtube
			document.getElementById("content").setAttribute("style", "width: 99%;");
		} else { //new youtube
			//Main container width and padding
			if(true) {
				addGlobalStyle(`
					/*search*/
					ytd-search ytd-two-column-search-results-renderer.ytd-search,
					ytd-search ytd-two-column-search-results-renderer.ytd-search #primary,
					/*home*/
					ytd-browse[page-subtype="home"] #contents.ytd-rich-grid-renderer,
					/*video*/
					#content [role="main"][theater-requested_] #columns,
					/*other*/
					ytd-browse > ytd-two-column-browse-results-renderer.ytd-browse
					{
						width: 100% !important;
						max-width: 100% !important;
					}

					ytd-browse > ytd-two-column-browse-results-renderer.ytd-browse > #primary,
					ytd-search,
					#columns
					{
						padding: 0 16px;
					}

					#content [role="main"][theater-requested_] #columns {
						box-sizing: border-box;
					}

					ytd-watch-flexy:not([theater]):not([fullscreen]):not([no-top-margin]) #primary.ytd-watch-flexy, ytd-watch-flexy:not([theater]):not([fullscreen]):not([no-top-margin]) #secondary.ytd-watch-flexy
					{
						padding-top: 5px;
					}

					/*Community page*/
					ytd-browse[page-subtype="channels"] #contents.ytd-section-list-renderer
					{
						margin: 0 auto;
					}
				`);
			}

			//page-manager element tends to sometimes be a few pixels too large for some reason...
			//...so hiding overflow
			if(true) {
				addGlobalStyle(`
					ytd-page-manager#page-manager { overflow: hidden; }
				`);
			}

			//vertical lists to horizontal grid / video container sizing
			if(true) {
				//trending
				if(true) {
					addGlobalStyle(`
						/*container*/
						#grid-container.ytd-expanded-shelf-contents-renderer > .ytd-expanded-shelf-contents-renderer
						{
							display: inline-block;
							width: `+TrendingVideoContainerWidth+`px;
							height: `+TrendingVideoContainerHeight+`px;
						}
						#grid-container.ytd-expanded-shelf-contents-renderer > .ytd-expanded-shelf-contents-renderer > #dismissable
						{
							width: 100%;
							height: 100%;
						}

						/*thumnail container*/
						#grid-container.ytd-expanded-shelf-contents-renderer > ytd-video-renderer:not([use-prominent-thumbs]) ytd-thumbnail.ytd-video-renderer,
						#grid-container.ytd-expanded-shelf-contents-renderer > ytd-video-renderer:not([use-prominent-thumbs]) ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail
						{
							height: 100%;
							width: `+(TrendingVideoContainerHeight * ratioMultiplier)+`px;
						}

						/*thumnail shadow and image*/
						#grid-container.ytd-expanded-shelf-contents-renderer > ytd-video-renderer:not([use-prominent-thumbs]) ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail > img
						{
							height: 100% !important;
							width: 100% !important;
						}
					`);
				}

				//search
				if(true) {
					addGlobalStyle(`
						/*container*/
						ytd-search ytd-video-renderer, ytd-search ytd-channel-renderer, ytd-search ytd-radio-renderer, ytd-search ytd-playlist-renderer
						{
							display: inline-block;
							width: `+SearchVideoContainerWidth+`px;
							height: `+SearchVideoContainerHeight+`px;
							box-sizing: border-box;
						}
						ytd-search ytd-video-renderer > #dismissable
						{
							width: 100%;
							height: 100%;
						}

						/*thumnail container*/
						ytd-search ytd-video-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-video-renderer,
						ytd-search ytd-radio-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-radio-renderer,
						ytd-search ytd-playlist-renderer[use-prominent-thumbs] ytd-playlist-thumbnail.ytd-playlist-renderer
						{
							max-width: none;
							min-width: none;
							height: 100%;
							width: `+(SearchVideoContainerHeight * ratioMultiplier)+`px;
							-ms-flex: none;
							-webkit-flex: none;
							flex: none;
						}
						ytd-search ytd-radio-renderer.ytd-item-section-renderer,
						ytd-search ytd-playlist-renderer.ytd-item-section-renderer
						{
							display: flex;
						}

						/*thumnail shadow and image*/
						ytd-search ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail,
						ytd-search ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail > img
						{
							width: 100%;
							height: 100%;
						}

						/*other*/
						ytd-search #description-text.ytd-video-renderer
						{
							margin-bottom: 2px;
						}
						ytd-search ytd-video-renderer > #dismissable #channel-info
						{
							padding: 2px 0 0 0;
						}
						ytd-search #description-text.ytd-video-renderer
						{
							max-height: none;
						}
						`+(HideSearchVideoBadges ? `ytd-search ytd-badge-supported-renderer { display: none; }` : ``)+`

						/*channel thumnail container*/
						ytd-search #avatar.ytd-channel-renderer,
						ytd-search ytd-channel-renderer[use-prominent-thumbs] #avatar-section.ytd-channel-renderer .channel-link.ytd-channel-renderer,
						ytd-search ytd-channel-renderer[use-prominent-thumbs] #avatar-section.ytd-channel-renderer
						{
							width: min-content;
							width: -moz-min-content;
							flex: none;
							max-width: none;
							min-width: 0;
						}

						ytd-search div.ytd-video-renderer[id="channel-info"] { padding: 3px 0 0 0 !important; }

						yt-showing-results-for-renderer { display: block; }
					`);
				}

				//home
				if(true) {
					if(HomeVideoContainerWidthEnabled) {
						addGlobalStyle(`
							/*container*/
							ytd-browse[page-subtype="home"] ytd-rich-item-renderer
							{
								width: `+HomeVideoContainerWidth+`px;
							}
						`);
					}
					if(HideChannelIconNextToVideosOnHomePage) {
						addGlobalStyle(`ytd-browse[page-subtype="home"] #avatar-link.ytd-rich-grid-media { display: none; }`);
					}
				}

				//subs
				if(true) {
					addGlobalStyle(`
						/*container*/
						ytd-browse[page-subtype="subscriptions"] #items.ytd-grid-renderer > ytd-grid-video-renderer.ytd-grid-renderer
						{
							width: `+SubVideoContainerWidth+`px;
						}

						/*thumnail container*/
						ytd-browse[page-subtype="subscriptions"] ytd-thumbnail.ytd-grid-video-renderer
						{
							width: `+SubVideoContainerWidth+`px;
							height: `+(SubVideoContainerWidth / ratioMultiplier)+`px;
						}

						/*thumnail shadow and image*/
						ytd-browse[page-subtype="subscriptions"] ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail,
						ytd-browse[page-subtype="subscriptions"] ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail > img
						{
							width: 100%;
							height: 100%;
						}

						/*List layout vid container*/
						ytd-browse[page-subtype="subscriptions"] #grid-container.ytd-expanded-shelf-contents-renderer > .ytd-expanded-shelf-contents-renderer
						{ width: 100%; }
						ytd-browse[page-subtype="subscriptions"] #grid-container.ytd-expanded-shelf-contents-renderer > .ytd-expanded-shelf-contents-renderer div.text-wrapper
						{ max-width: none; }
					`);
				}

				//video page
				if(true) {
					addGlobalStyle(`
						/*thumnail container*/
						#content [role="main"][theater-requested_] #columns #secondary #items > ytd-item-section-renderer > #contents > .ytd-item-section-renderer
						{
							display: inline-block;
							width: calc(`+(100 / VPRecommendedColumnCount)+`% - 5px);
							height: `+VPRecommendedVideoContainerHeight+`px;
							margin: 0;
							flex-grow: 1;
							box-sizing: border-box;
						}

						#content [role="main"][theater-requested_] #columns #secondary #items > ytd-item-section-renderer > #contents > .ytd-item-section-renderer > #dismissible
						{
							width: 100%;
							height: 100%;
						}

						/*thumnail container*/
						[role="main"][theater-requested_] .ytd-item-section-renderer ytd-thumbnail,
						[role="main"][theater-requested_] .ytd-item-section-renderer ytd-thumbnail yt-img-shadow.ytd-thumbnail
						{
							height: 100%;
							width: `+(VPRecommendedVideoContainerHeight * ratioMultiplier)+`px;
						}

						/*thumnail shadow and image*/
						[role="main"][theater-requested_] .ytd-item-section-renderer ytd-thumbnail yt-img-shadow.ytd-thumbnail > img
						{
							width: 100%;
							height: 100%;
						}
					`);
				}

				//Community page
				if(false) {
					addGlobalStyle(`
						ytd-browse[page-subtype="channels"] #contents.ytd-section-list-renderer > .ytd-backstage-items
						{
							max-width: unset;
							width: 852px;
						}
					`);
				}

				//multiple
				if(true) {
					addGlobalStyle(`#dismissible.ytd-video-renderer { height: 100%; }`);
				}
			}

			//video container padding/margin
			if(true) {
				//chapter select
				if(true) {
					addGlobalStyle(`
						#expandable-metadata.ytd-video-renderer:not(:empty) {
							margin: 0;
							z-index: 999;
						}
					`);
				}

				//trending
				if(true) {
					addGlobalStyle(`
						#grid-container.ytd-expanded-shelf-contents-renderer > .ytd-expanded-shelf-contents-renderer
						{
							padding: 0 10px 0 0;
						}
						#grid-container.ytd-expanded-shelf-contents-renderer > .ytd-expanded-shelf-contents-renderer:not(:last-child)
						{
							margin: 0 0 10px 0;
						}
					`);
				}

				//search
				if(true) {
					addGlobalStyle(`
						ytd-search ytd-video-renderer.ytd-item-section-renderer,
						ytd-search ytd-channel-renderer.ytd-item-section-renderer,
						ytd-search ytd-radio-renderer.ytd-item-section-renderer,
						ytd-search ytd-playlist-renderer.ytd-item-section-renderer,
						ytd-search #items.ytd-vertical-list-renderer > .ytd-vertical-list-renderer
						{
							padding: 0 10px 0 0;
							margin: 10px 0 0 0;
						}
						ytd-search ytd-shelf-renderer.ytd-item-section-renderer
						{
							margin: 10px 0 0 0;
						}
					`);
				}

				//home
				if(true) {
					addGlobalStyle(`
						ytd-browse[page-subtype="home"] ytd-rich-item-renderer
						{
							margin: 0 5px 20px 5px;
						}
						ytd-browse[page-subtype="home"] ytd-rich-section-renderer
						{
							margin: 0;
						}
					`);
				}

				//subs
				if(true) {
					addGlobalStyle(`
						ytd-browse[page-subtype="subscriptions"] #items.ytd-grid-renderer > ytd-grid-video-renderer.ytd-grid-renderer
						{
							margin: 0 5px 15px 0;
						}
					`);
				}

				//video page
				if(true) {
					addGlobalStyle(`
						#content [role="main"][theater-requested_] #columns > #secondary
						{
							width: `+VPRecommendedSectionWidth+`px;
						}
						#content [role="main"][theater-requested_] #columns > #secondary #items #contents {
							display: flex;
							flex-wrap: wrap;
							gap: 8px 1px;
						}
					`);
				}
			}

			//channel page horizontal list arrow visibility
			if(true) {
				addGlobalStyle(`
					yt-horizontal-list-renderer[at-start] #left-arrow.yt-horizontal-list-renderer .arrow.yt-horizontal-list-renderer,
					yt-horizontal-list-renderer[at-end] #right-arrow.yt-horizontal-list-renderer .arrow.yt-horizontal-list-renderer
					{
						display: block;
						opacity: 1;
					}
					`+(!!window.chrome ? `
					#left-arrow.yt-horizontal-list-renderer { left: 20px; }
					#right-arrow.yt-horizontal-list-renderer { right: 20px; }
					` : `
					#left-arrow.yt-horizontal-list-renderer { left: 0px; }
					#right-arrow.yt-horizontal-list-renderer { right: 40px; }
					`)
				);
			}

			if(HQTN) {
				addGlobalStyle(`
					img.yt-img-shadow:not([src*='?'])
					{
						object-fit: cover;
					}
				`);
			}
			if(FPPCompOn) {
				addGlobalStyle(`
					/*========== Fade++ Compatibility ==========*/
					ytd-app #page-manager > ytd-browse:not([page-subtype="playlist"]) {
						display: block;
					}
					ytd-app[guide-persistent-and-visible] #page-manager > ytd-browse:not([page-subtype="playlist"]) ytd-two-column-browse-results-renderer.ytd-browse
					{
						margin-left: 250px !important;
					}
				`);
				//console.log("Youtube Wide video container Fade++ compatibilty style added to DOM");
			}
		}

		if(AutoExpandChannelVidContainers || HQTN)
		{
			var lastCheckedURL = window.location.href;
			URLChanged(); //for initial page load

			//poll for url changes
			setInterval(function(){
				if(lastCheckedURL != window.location.href)
				{
					lastCheckedURL = window.location.href;
					URLChanged();
				}
			}, 200);
			var waitForArrows, waitForSubsThumbnails;
		}

		//Remove limits on items per row on home page (by moving items outside the rows and removing the rows themselves)
		if(HomeVideoContainerWidthEnabled)
		{
			setInterval(MoveAllVideoItemsOutsideRowsAndRemoveRowsOnHomePage, 100);
		}

		/*============================================================*/

		function MoveAllVideoItemsOutsideRowsAndRemoveRowsOnHomePage()
		{
			//Get all rows
			let rows = document.querySelectorAll("ytd-browse[page-subtype='home'] ytd-rich-grid-renderer > #contents ytd-rich-grid-row.ytd-rich-grid-renderer");
			for(let i = 0; i < rows.length; i++)
			{
				//get the first item in current row, until none can be found
				let curItem;
				while((curItem = rows[i].querySelector("ytd-rich-item-renderer.ytd-rich-grid-row")))
				{
					//move the item outside the row
					rows[i].parentNode.insertBefore(curItem, rows[i]);
				}
				rows[i].remove();
			}
		}

		function AutoExpandContainers()
		{
			clearInterval(waitForArrows);

			//=== clear potential old containers ===//
			let expandedEls = document.getElementsByClassName("expanded-wwc");
			//console.log("expanded els found: " + expandedEls.length);
			let numRemoved = 0;

			//seems to always remove exactly half of them only, for some reason. So I guess do this until all have been removed
			while(expandedEls.length > 0)
			{
				for(let x = 0; x < expandedEls.length; x++)
				{
					if(!!expandedEls[x])
					{
						expandedEls[x].classList.remove("expanded-wwc");
						//console.log(++numRemoved + " cleared");
					}
				}
				expandedEls = document.getElementsByClassName("expanded-wwc");
			}
			//=== old containers cleared ===//

			//=== unmark container arrows marked as clicked ===//
			numRemoved = 0;
			let clickedArrows = document.getElementsByClassName("clicked");
			//console.log("clicked found: " + clickedArrows.length);
			while(clickedArrows.length > 0)
			{
				for(let x = 0; x < clickedArrows.length; x++)
				{
					if(!!clickedArrows[x])
					{
						clickedArrows[x].classList.remove("clicked");
						//console.log(++numRemoved + " cleared");
					}
				}
				clickedArrows = document.getElementsByClassName("clicked");
			}
			//=== all arrows unmarked ===//
			//console.log("-expandedclear-");

			//check that we are on a page that can have containers
			if(lastCheckedURL.includes("/user/") || lastCheckedURL.includes("/channel/") || lastCheckedURL.includes("/c/"))
			{
				//poll for untouched containers
				waitForArrows = setInterval(function(){
					//console.log("-searching...-");
					let arrowsRight = document.querySelectorAll("yt-horizontal-list-renderer:not(.expanded-wwc) > #right-arrow > ytd-button-renderer.arrow");
					let arrowsLeft = document.querySelectorAll("yt-horizontal-list-renderer:not(.expanded-wwc) > #left-arrow > ytd-button-renderer.arrow");
					if(!!arrowsRight && arrowsRight.length > 0 && !!arrowsLeft && arrowsLeft.length > 0)
					{
						//console.log("-found "+arrowsRight.length+"-");
						//do the thing for found untouched containers and mark them
						for(let i = 0; i < arrowsRight.length; i++)
						{
							if(!!arrowsRight[i] && arrowsRight[i].offsetParent !== null && !!arrowsLeft[i] && arrowsLeft[i].offsetParent !== null)
							{
								arrowsRight[i].parentElement.parentElement.classList.add("expanded-wwc");
								arrowsRight[i].click();
								//console.log("simulated click on right arrow");
								arrowsRight[i].classList.add("clicked");
								arrowsLeft[i].click();
								//console.log("simulated click on left arrow");
								arrowsLeft[i].classList.add("clicked");
							}
						}
					}
				}, 250);
			}
		}
	}






    function SwapSubsVidThumbnailsHQ()
    {
        clearInterval(waitForSubsThumbnails);
        if(lastCheckedURL.includes("/subscriptions") || lastCheckedURL.includes("/trending"))
        {
            waitForSubsThumbnails = setInterval(function(){
                let nails = document.querySelectorAll("img.yt-img-shadow[src*='hqdefault.jpg?']");
                //console.log("found " + nails.length + " LQ nails");
                for(let i = 0; i < nails.length; i++)
                    nails[i].src = nails[i].src.split("?")[0];
            }, 200);
        }
    }

    function URLChanged()
    {
        if(AutoExpandChannelVidContainers)
            AutoExpandContainers();

        if(HQTN)
            SwapSubsVidThumbnailsHQ();
    }
    function CleanCSSValue(val)
    {
        val = val.trim();

        //if only numbers...
        if(/^\d+$/.test(val))
            val += "px"; //...add px

        return val;
    }
    function CleanNumber(val)
    {
        val = parseFloat(val);

        return val;
    }

    function addGlobalStyle(css)
    {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

})();