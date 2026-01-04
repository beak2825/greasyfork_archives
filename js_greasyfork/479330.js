// ==UserScript==
// @name         Alternative video page layout for Rehike
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Makes Rehike use an alternate universe watch9 layout
// @author       lightbeam24
// @match        *.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479330/Alternative%20video%20page%20layout%20for%20Rehike.user.js
// @updateURL https://update.greasyfork.org/scripts/479330/Alternative%20video%20page%20layout%20for%20Rehike.meta.js
// ==/UserScript==
(function() {
    'use strict';
    /* settings (can be configured by user) */
    const expStickyWatchColumns = false; // default: false
    /* end of settings */

    var canGo = false;

    function timeout(durationMs) {
        return new Promise((resolve, reject) => {
            setTimeout(function() {
                resolve();
            }, durationMs);
        });
    }
    async function waitForElement(elm) {
        while (null == document.querySelector(elm)) {
            await new Promise(r => requestAnimationFrame(r));
        }
        await timeout(50).then(function() {
            canGo = true;
            return document.querySelector(elm);
        });
    }
    everyLoadPrep();
    document.addEventListener("spfdone", everyLoadPrep);

    function everyLoadPrep() {
        if (document.querySelector("#page.watch") != null) {
            var elm = "#watch-header";
            waitForElement(elm).then(function(elm) {
                if (canGo != false) {
                    if (document.querySelector('#alt-watch9-container') == null) {
                        everyLoad();
                    }
                }
            });
        }
    }

    function everyLoad() {
        // grab "experiments"
        if (expStickyWatchColumns == true) {
            document.body.classList.add("exp-sticky-watch-columns");
        }
        // create the watch layout itself
        let container = document.querySelector('#watch-header');
        var altWatch9 = document.createElement("div");
        altWatch9.id = "alt-watch9-container";
        altWatch9.innerHTML = `
<style>
@media screen and (min-width: 1294px) and (min-height: 630px) {
.watch #watch9-slider {
  width: calc(1024px - 614px);
}
.scroller-inner {
  max-width: 214px !important;
}
}
@media screen and (min-width: 1720px) and (min-height: 980px) {
.watch #watch9-slider {
  width: calc(1280px);
}
.scroller-inner {
  max-width: 238px !important;
}
}

.watch9-expand {
  width: 100%;
  margin-top: 10px;
  border-top: 1px solid #ccc;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}
.expand-inner {
  border: 1px solid transparent;
  background: #fff;
  width: fit-content;
  margin: 0 auto;
  margin-top: -10px;
  padding: 3px 12px;
  border-radius: 2px;
}
.expand-inner:hover {
  border: 1px solid #c6c6c6;
  border-left-color: rgb(198, 198, 198);
  background: #f0f0f0;
  box-shadow: 0 1px 0 rgba(0,0,0,0.10);
}
.expand-inner:active {
  border: 1px solid #c6c6c6;
  border-left-color: rgb(198, 198, 198);
  background: #e9e9e9;
  box-shadow: inset 0 1px 0 #ddd;
}
.expand-button {
  width: 100%;
  border-top: 1px solid var(--section-border);
  text-transform: uppercase;
  font-size: 11px;
  color: #767676;
  font-weight: 600;
  letter-spacing: -0.5px;
  cursor: pointer;
  margin-bottom: -15px;
  margin-top: 15px;
}
.expand-button:hover {
  color: #333;
}
.expand-button span {
  margin: 5px 0;
  display: block;
}
#watch9-title {
  font-size: 20px;
  margin-bottom: 15px;
}
#watch9-sidebar {
  max-width: 143px;
  min-width: 143px;
}
.exp-sticky-watch-columns .watch9-sidebar-inner {
  position: sticky;
  top: 53px;
}
.sidebar-item {
  font-size: 12px;
  padding: 7px 8px;
  color: #333;
  width: 83%;
  border-radius: 2px;
  cursor: pointer;
  border: 1px solid transparent;
  margin: 4px 0;
  height: 13px;
  display: block;
}
button.sidebar-item {
  width: 95.5%;
  display: flex;
  text-align: unset;
  height: 28px;
}
.sidebar-item:hover,
.sidebar-item:focus {
  background: #fafafa;
  border: 1px solid #ccc;
}
.sidebar-item.active {
  background: linear-gradient(to top,#b6d7f591,#e3f2ffa3);
  border: 1px solid #90ccf8;
  background: linear-gradient(to top,#f0f0f0 0,#f8f8f8 100%);
  border: 1px solid #c6c6c6;
  font-weight: 600;
  background: #f8f8f8;
  background: linear-gradient(to top,#f0f0f0 0,#f8f8f8 100%);
}
.sidebar-item:hover::before {
  margin-top: 2px;
  border-color: transparent #ccc;
  content: '';
  border-width: 8px 0 8px 8px;
  border-style: solid;
  position: absolute;
  margin-right: -132px;
  margin-left: 126px;
  margin-top: 0px;
}
.sidebar-item:hover::after {
  content: '';
  border-width: 7px 0px 7px 7px;
  border-style: solid;
  border-color: transparent #fafafa;
  position: absolute;
  margin-right: -137.5px;
  margin-left: 126px;
  margin-top: 1px;
}
.sidebar-item.active::before {
  margin-top: 2px;
  border-color: transparent #90ccf8;
  border-color: transparent #c6c6c6;
}
.sidebar-item.active::before {
  content: '';
  border-width: 8px 0 8px 8px;
  border-style: solid;
  position: absolute;
  margin-right: -132px;
  margin-left: 126px;
  margin-top: 0px;
}
.sidebar-item.active::after {
  margin-top: 2px;
}
.sidebar-item.active::after {
  content: '';
  border-width: 7px 0px 7px 7px;
  border-style: solid;
  border-color: transparent #e1effc;
  border-color: transparent #f4f4f4;
  border-color: transparent #f8f8f8;
  border-color: transparent #f4f4f4;
  position: absolute;
  margin-right: -137.5px;
  margin-left: 126px;
  margin-top: 1px;
}
.sidebar-item-inner {
  display: inline;
  position: absolute;
}
#watch9-slider {
  width: calc(854px - 440px);
  border-left: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  margin-right: 15px;
  padding: 0 15px;
  overflow: clip;
}
[show-owner="false"] #watch9-slider {
  width: calc(854px - 420px);
}
.slider-container {
  overflow: clip;
}
.slider-container-inner {
  display: flex;
  transition-duration: 0.3s;
  transform: translateX(0);
}
.slider {
  min-width: 100%;
  margin-right: 0px;
  padding-right: 0px;
}
.slider-inner {
  min-width: 100%;
  margin-right: 0px;
  padding-right: 0px;
}
.toggle-button {
  color: rgb(96,96,96);
  font-size: 11px;
  font-weight: 600;
  padding: 6px 4px;
  padding: 3px 4px;
  cursor: pointer;
}
.toggle-button-inner {
  align-items: center;
}
.toggle-button-icon {
  opacity: 0.6;
  display: block;
  width: 21px;
  height: 21px;
  margin-right: 4px;
}
.watch9:not([scroller-visible="true"]) #watch9-slider:not([state="description"]) #watch9-description {
  max-height: 156px;
}
.watch9:not([scroller-visible="false"]) #watch9-slider:not([state="description"]) #watch9-description {
  max-height: 336px;
}
#watch9-description,
#watch9-description-snippet {
  font-size: 13px;
  line-height: 14px;
  color: #222;
}
#watch9-description-snippet {
  margin-top: 70px;
  margin-top: 44px;
  margin-top: 15px;
}
#watch9-description-snippet .desc-snippet {
  max-height: 58px;
  overflow: hidden;
}
.watch9-category {
  font-size: 11px;
  color: #333;
  margin-top: 14px;
}
.watch9-category .cat-inner {
  font-weight: 600;
  margin-right: 24px;
}
.watch9-header-text {
  font-size: 13px;
  line-height: 14px;
  color: #333;
  font-weight: 600;
}
.author-link {
  color: #333;
}
.slider:hover .author-link {
  color: #167ac6;
  cursor: pointer;
}
.watch9-upload-date .author-link:hover {
  text-decoration: underline;
}
.owner-pfp,
.owner-pfp img {
  width: 48px;
  height: 48px;
  background-size: 48px 48px !important;
  margin-right: 6px;
  cursor: pointer;
}
#watch9-owner {
  width: 250px;
}
.exp-sticky-watch-columns #watch9-owner .owner-inner {
  position: sticky;
  top: 49px;
}
#watch9-sentiment-actions {
  /*position: absolute;*/
  right: 0;
  left: 0;
  margin: 5px 0;
  flex-direction: row-reverse;
  border-bottom: 1px solid #e8e8e8;
}
#watch9-views-info {
  min-width: 160px;
  margin-left: auto;
}
.watch-view-count {
  line-height: 24px;
  max-height: 24px;
  text-align: right;
  font-size: 19px;
  color: #666;
  white-space: nowrap;
  margin-bottom: 2px;
  width: fit-content;
  margin-left: auto;
}
.video-extras-sparkbars {
  height: 2px;
  overflow: hidden;
  min-width: 160px;
  width: fit-content;
}
.video-extras-sparkbar-likes {
  float: left;
  height: 2px;
  background: #167ac6;
}
.video-extras-sparkbar-dislikes {
  float: left;
  height: 2px;
  background: #ccc;
}
.owner-videos-scroller {
  margin-top: 6px;
}
.owner-videos-scroller button {
  margin-right: 8px;
}
[scroller-visible="false"] .scroller-inner {
  display: none;
}
.scroller-inner {
  margin-top: 6px;
  overflow-y: scroll;
  border: 1px solid #ccc;
  padding: 5px;
  max-height: 250px;
}
.super-compact-video {
  cursor: pointer;
  display: block;
}
.super-compact-video:not(:last-of-type) {
  margin-bottom: 6px;
}
.super-compact-video .thumbnail {
  height: 45px;
  width: 80px;
}
.super-compact-video .thumbnail img {
  height: 45px;
  width: 80px;
}
.super-compact-video .meta {
  margin-left: 4px;
  color: #333;
  font-size: 10px;
  color: #767676;
}
.super-compact-video .view-count {
  display: none;
}
.super-compact-video .title {
  color: #126acc;
  font-weight: 600;
  font-size: 11px;
}
.super-compact-video .title:hover {
  text-decoration: underline;
}

[show-owner="false"] #watch9-owner {
  display: none;
}
[show-owner="true"] #creator.sidebar-item {
  display: none;
}
[show-owner="true"] #watch9-owner-slider {
  display: none;
}
[state="video-info"] .slider-container-inner {
  transform: translateX(0%);
}
[state="description"] .slider-container-inner {
  transform: translateX(-100%);
}
[state="add-to"] .slider-container-inner {
  transform: translateX(-200%);
}
[state="share"] .slider-container-inner {
  transform: translateX(-300%);
}
[state="more-actions"] .slider-container-inner {
  transform: translateX(-400%);
}
[show-owner="false"] [state="creator"] .slider-container-inner {
  transform: translateX(0%);
}
[show-owner="false"] [state="video-info"] .slider-container-inner {
  transform: translateX(-100%);
}
[show-owner="false"] [state="description"] .slider-container-inner {
  transform: translateX(-200%);
}
[show-owner="false"] [state="add-to"] .slider-container-inner {
  transform: translateX(-300%);
}
[show-owner="false"] [state="share"] .slider-container-inner {
  transform: translateX(-400%);
}
[show-owner="false"] [state="more-actions"] .slider-container-inner {
  transform: translateX(-500%);
}
.flex {
  display: flex;
}
.none {
  display: none;
}



#watch7-headline, .owner-pfp, .owner-name-and-sub, #watch8-action-buttons, #action-panel-details, #watch-action-panels {
  display: none;
}
#alt-watch9-container {
  padding-bottom: 12px;
}
#watch-header .yt-user-info a {
  white-space: nowrap;
  max-width: 159px;
  overflow: clip;
  text-overflow: ellipsis;
}
#action-panel-share {
  margin-left: 2px;
  max-width: 330px;
  position: absolute;
}
</style>
<div class="section">
	<div class="section-inner">
		<div id="watch9-title">
			<span>Me at the zoo</span>
		</div>
		<div class="section-items watch9" scroller-visible="false" show-owner="true">
			<div class="section-items-inner flex">
				<div id="watch9-sidebar">
					<div class="watch9-sidebar-inner">
                        <div class="sidebar-item" id="creator">
							<div class="sidebar-item-inner">
								<span>Creator</span>
							</div>
						</div>
						<div class="sidebar-item active" id="video-info">
							<div class="sidebar-item-inner">
								<span>Video info</span>
							</div>
						</div>
						<div class="sidebar-item" id="description">
							<div class="sidebar-item-inner">
								<span>Description</span>
							</div>
						</div>
						<div class="sidebar-item" id="add-to">
							<div class="sidebar-item-inner">
								<span>Add to playlist</span>
							</div>
						</div>
						<div class="sidebar-item" id="share">
							<div class="sidebar-item-inner">
								<span>Share this video</span>
							</div>
						</div>
						<div class="sidebar-item" id="more-actions">
							<div class="sidebar-item-inner">
								<span>More actions</span>
							</div>
						</div>
					</div>
				</div>
				<div id="watch9-slider" state="video-info">
					<div class="slider-container">
						<div class="slider-container-inner">
                            <div id="watch9-owner-slider" class="slider">
								<div class="slider-inner">
								</div>
							</div>
							<div id="watch9-stats" class="slider">
								<div class="slider-inner">
									<div id="watch9-sentiment-actions" class="flex">
										<div id="watch9-views-info">
											<div class="watch-view-count">
												???,??? views
											</div>
											<div class="video-extras-sparkbars yt-uix-tooltip">
												<div class="video-extras-sparkbar-likes" style="width: 98.0012039305%">
												</div>
												<div class="video-extras-sparkbar-dislikes" style="width: 1.99879606949%">
												</div>
											</div>
										</div>
										<div id="ltod">
										</div>
									</div>
									<div id="watch9-description-snippet">
										<div class="desc-snippet">
											<div class="watch9-upload-date watch9-header-text">
                                                <span id="first-part">
												    <span>Uploaded by </span>
												    <a class="author-link spf-link">????</a>
												    <span>on </span>
                                                </span>
                                                <span id="second-part">
                                                    <span class="upload-date">??? ??, ????</span>
                                                </span>
                                                <span id="third-part">
                                                    <span>by </span>
												    <a class="author-link spf-link">????</a>
                                                </span>
											</div>
											<div class="description-inner">
											</div>
										</div>
									</div>
									<div class="watch9-expand">
										<div class="expand-inner">
											<span>Show more</span>
										</div>
									</div>
									<div class="watch9-category">
									</div>
								</div>
							</div>
							<div id="watch9-description" class="slider">
								<div class="slider-inner">
									<div class="watch9-header-text">
										<span>Description</span>
									</div>
									<div class="description-inner">
									</div>
									<div class="watch9-expand">
										<div class="expand-inner">
											<span>Show less</span>
										</div>
									</div>
								</div>
							</div>
							<div id="watch9-addto" class="slider">
								<div class="slider-inner">
									<div class="watch9-header-text">
										<span>Add to playlist</span>
									</div>
								</div>
							</div>
							<div id="watch9-share" class="slider">
								<div class="slider-inner">
									<!--div class="watch9-header-text">
										<span>Share this video</span>
									</div-->
								</div>
							</div>
							<div id="watch9-more-actions" class="slider">
								<div class="slider-inner">
									<div class="watch9-header-text">
                                        <span>This feature is unavailable.</span>
                                    </div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="watch9-owner">
					<div class="owner-inner">
						<div class="owner-videos-scroller">
							<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-tooltip">
								<span>Videos</span>
								<span class="yt-uix-button-arrow yt-sprite"></span>
							</button>
                            <a class="yt-uix-tooltip spf-link" data-tooltip-text="See user's videos">
								<span>See all</span>
							</a>
							<div class="scroller-inner">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
`;
        container.insertBefore(altWatch9, container.children[0]);
        var elm = ".watch-time-text";
        waitForElement(elm).then(function(elm) {
            if (canGo != false) {
                applyMetadata();
            }
        });

        function applyMetadata() {
            if (document.querySelector("#eow-title") != null) {
                var videoTitle = document.querySelector("#eow-title").textContent;
                document.querySelector("#watch9-title span").textContent = videoTitle;
            }
            if (document.querySelector(".watch-time-text") != null) {
                var uploadDateRaw = document.querySelector(".watch-time-text").textContent;
                let notNeedNewString = uploadDateRaw.includes("Published");
                if (notNeedNewString == true) {
                    var cutString = uploadDateRaw.split('on ');
                    var uploadDate = cutString[1];
                    document.querySelector("#first-part").style.display = "inline";
                    document.querySelector("#third-part").style.display = "none";
                } else {
                    var uploadDate = uploadDateRaw;
                    document.querySelector("#first-part").style.display = "none";
                    document.querySelector("#third-part").style.display = "inline";
                }
                document.querySelector(".watch9-upload-date .upload-date").textContent = uploadDate;
            }
            if (document.querySelector("#eow-description") != null) {
                var descHTML = document.querySelector("#eow-description").innerHTML;
                document.querySelector(".desc-snippet .description-inner").innerHTML = descHTML;
                document.querySelector("#watch9-description .description-inner").innerHTML = descHTML;
            }
            if (document.querySelector(".yt-user-info") != null) {
                var authorElem = document.querySelector(".yt-user-info a");
                var authorName = authorElem.textContent;
                var authorLink = document.querySelector(".yt-user-photo").getAttribute("href");
                var authorPfp = document.querySelector(".yt-user-photo img").getAttribute("data-thumb");
                document.querySelector(".author-link").textContent = authorName;
                document.querySelector(".author-link").setAttribute("href", authorLink);
                document.querySelector("#third-part .author-link").textContent = authorName;
                document.querySelector("#third-part .author-link").setAttribute("href", authorLink);
                document.querySelector(".owner-videos-scroller a").setAttribute("href", authorLink + "/videos");
                document.querySelector(".owner-videos-scroller a").setAttribute("data-tooltip-text", "View " + authorName + "'s videos");
                authorElem.classList.add("yt-uix-tooltip");
                authorElem.setAttribute("data-tooltip-text", "View " + authorName + "'s channel");
            }
            if (document.querySelector("#watch8-action-buttons") != null) {
                var viewCount = document.querySelector("#watch8-action-buttons .watch-view-count").textContent;
                document.querySelector("#watch9-views-info .watch-view-count").textContent = viewCount;
                var videoLikes = document.querySelector("#watch8-action-buttons .video-extras-sparkbar-likes").getAttribute("style");
                var videoDislikes = document.querySelector("#watch8-action-buttons .video-extras-sparkbar-dislikes").getAttribute("style");
                document.querySelector("#watch9-stats .video-extras-sparkbar-likes").setAttribute("style", videoLikes);
                document.querySelector("#watch9-stats .video-extras-sparkbar-dislikes").setAttribute("style", videoDislikes);
                var ltodBar = document.querySelector("#watch9-stats .video-extras-sparkbars");
                var likesPercent = ltodBar.querySelector("#watch9-stats .video-extras-sparkbar-likes").style.width;
                ltodBar.setAttribute("data-tooltip-text", likesPercent + " of viewers like this video");
                ltodBar.style.display = "block";
                ltodBar.style.padding = "5px 0";
                ltodBar.style.marginBottom = "-5px";
                document.querySelector(".watch-view-count").style.marginBottom = "-3px";
            }
            var theAddToBtn = document.querySelector("[data-menu-content-id='yt-uix-videoactionmenu-menu']");
            var newHome = document.querySelector('#watch9-addto');
            newHome.appendChild(theAddToBtn);
            var theOwner = document.querySelector("#watch7-user-header");
            var newHome2 = document.querySelector('#watch9-owner .owner-inner');
            newHome2.insertBefore(theOwner, newHome2.children[0]);
            var theExtras = document.querySelector("#watch-description-extras");
            var newHome3 = document.querySelector('.watch9-category');
            newHome3.insertBefore(theExtras, newHome3.children[0]);
            var theLtod = document.querySelector(".like-button-renderer");
            var newHome4 = document.querySelector('#ltod');
            newHome4.insertBefore(theLtod, newHome4.children[0]);
            var theSharePanel = document.querySelector("#action-panel-share");
            var newHome5 = document.querySelector('#watch9-share .slider-inner');
            newHome5.insertBefore(theSharePanel, newHome5.children[1]);
            if (document.querySelector("#watch9-owner .owner-inner") != null) {
                var ownerHTML = document.querySelector("#watch9-owner .owner-inner").innerHTML;
                document.querySelector("#watch9-owner-slider .slider-inner").innerHTML = ownerHTML;
            }
            var creator = document.querySelector("#creator.sidebar-item");
            var videoInfo = document.querySelector("#video-info.sidebar-item");
            var description = document.querySelector("#description.sidebar-item");
            var addTo = document.querySelector("#add-to.sidebar-item");
            var share = document.querySelector("#share.sidebar-item");
            var moreActions = document.querySelector("#more-actions.sidebar-item");
            var showMore = document.querySelector("#watch9-stats .watch9-expand");
            var showLess = document.querySelector("#watch9-description .watch9-expand");
            var addToBtn = document.querySelector(".addto-button");
            var showScroller = document.querySelector(".owner-videos-scroller button");
            var showScroller2 = document.querySelector("#watch9-owner .owner-videos-scroller button");
            creator.addEventListener("click", function() {
                creatorClicked();
            });
            videoInfo.addEventListener("click", function() {
                vidInfoClicked();
            });
            description.addEventListener("click", function() {
                descClicked();
            });
            showMore.addEventListener("click", function() {
                descClicked();
            });
            showLess.addEventListener("click", function() {
                vidInfoClicked();
            });

            function creatorClicked() {
                document.querySelector("#watch9-slider").setAttribute("state", "creator");
                document.querySelector(".sidebar-item.active").classList.remove("active");
                document.querySelector("#creator.sidebar-item").classList.add("active");
                setTimeout(checkIfShowOwner, 10);
            }

            function vidInfoClicked() {
                document.querySelector("#watch9-slider").setAttribute("state", "video-info");
                document.querySelector(".sidebar-item.active").classList.remove("active");
                document.querySelector("#video-info.sidebar-item").classList.add("active");
                setTimeout(checkIfShowOwner, 10);
            }

            function descClicked() {
                document.querySelector("#watch9-slider").setAttribute("state", "description");
                document.querySelector(".sidebar-item.active").classList.remove("active");
                document.querySelector("#description.sidebar-item").classList.add("active");
                setTimeout(checkIfShowOwner, 10);
            }
            addTo.addEventListener("click", function() {
                document.querySelector("#watch9-slider").setAttribute("state", "add-to");
                document.querySelector(".sidebar-item.active").classList.remove("active");
                document.querySelector("#add-to.sidebar-item").classList.add("active");
                setTimeout(checkIfShowOwner, 10);
            });
            share.addEventListener("click", function() {
                document.querySelector("#watch9-slider").setAttribute("state", "share");
                document.querySelector(".sidebar-item.active").classList.remove("active");
                document.querySelector("#share.sidebar-item").classList.add("active");
                if (document.querySelector("#watch9-share #action-panel-share.hid") != null) {
                    document.querySelector("#watch8-secondary-actions .action-panel-trigger-share").click();
                }
                setTimeout(checkIfShowOwner, 10);
            });
            moreActions.addEventListener("click", function() {
                document.querySelector("#watch9-slider").setAttribute("state", "more-actions");
                document.querySelector(".sidebar-item.active").classList.remove("active");
                document.querySelector("#more-actions.sidebar-item").classList.add("active");
                setTimeout(checkIfShowOwner, 10);
            });
            showScroller.addEventListener("click", function() {
                if (document.querySelector(".watch9[scroller-visible='false']") != null) {
                    document.querySelector(".watch9").setAttribute("scroller-visible", "true");
                } else {
                    document.querySelector(".watch9").setAttribute("scroller-visible", "false");
                }
            });
            showScroller2.addEventListener("click", function() {
                if (document.querySelector(".watch9[scroller-visible='false']") != null) {
                    document.querySelector(".watch9").setAttribute("scroller-visible", "true");
                } else {
                    document.querySelector(".watch9").setAttribute("scroller-visible", "false");
                }
            });
            setTimeout(checkIfShowOwner, 200);
            window.addEventListener("resize", checkIfShowOwner);

            function checkIfShowOwner() {
                setTimeout(check, 200);

                function check() {
                    var playerHeight = document.querySelector("video").style.height;
                    //console.log(playerHeight);
                    if (playerHeight == "360px") {
                        document.querySelector(".section-items.watch9").setAttribute("show-owner", "false");
                    } else {
                        document.querySelector(".section-items.watch9").setAttribute("show-owner", "true");
                        if (document.querySelector("#creator.sidebar-item.active") != null) {
                            vidInfoClicked();
                        }
                    }
                }
            }
            requestData();

            function requestData() {
                const location = window.location;
                var vidLink = location.href;
                var cutString1 = vidLink.split('v=');
                var vidLink2 = cutString1[1];
                if (vidLink2.includes('&')) {
                    var cutString2 = vidLink2.split('&');
                    var vidId = cutString2[0];
                } else {
                    var vidId = vidLink2;
                }
                //console.log(vidId);
                setTimeout(doData, 1);

                function doData() {
                    fetch("https://www.youtube.com/youtubei/v1/next?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8", {
                        "headers": {
                            "accept": "application/json, text/plain, /",
                            "accept-language": "en-US,en;q=0.9",
                            "Content-type": "application/json",
                            "sec-ch-ua-mobile": "?0",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "x-goog-authuser": "0",
                            "x-origin": "https://www.youtube.com/"
                        },
                        "referrer": "https://www.youtube.com/",
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": JSON.stringify({
                            "context": {
                                "client": {
                                    "clientName": "WEB",
                                    "clientVersion": "2.20230301.00.00",
                                    "hl": "en",
                                    "gl": "US"
                                }
                            },
                            "videoId": vidId
                        }),
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                    }).then(response => response.json()).then(data => {
                        var dataFromAPI = data;
                        //console.log(dataFromAPI);
                        doChannelDataPrep();

                        function doChannelDataPrep() {
                            if (dataFromAPI.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer != null) {
                                var channelUrl = dataFromAPI.contents.twoColumnWatchNextResults.results.results.contents[1].videoSecondaryInfoRenderer.owner.videoOwnerRenderer.navigationEndpoint.browseEndpoint.browseId;
                            } else if (dataFromAPI.contents.twoColumnWatchNextResults.results.results.contents[1].videoPrimaryInfoRenderer != null) {
                                var channelUrl = dataFromAPI.contents.twoColumnWatchNextResults.results.results.contents[2].videoSecondaryInfoRenderer.owner.videoOwnerRenderer.navigationEndpoint.browseEndpoint.browseId;
                            }
                            setTimeout(doChannelData, 1);

                            function doChannelData() {
                                fetch("https://www.youtube.com/youtubei/v1/browse?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8", {
                                    "headers": {
                                        "accept": "application/json, text/plain, /",
                                        "accept-language": "en-US,en;q=0.9",
                                        "Content-type": "application/json",
                                        "sec-ch-ua-mobile": "?0",
                                        "sec-fetch-dest": "empty",
                                        "sec-fetch-mode": "cors",
                                        "sec-fetch-site": "same-origin",
                                        "x-goog-authuser": "0",
                                        "x-origin": "https://www.youtube.com/"
                                    },
                                    "referrer": "https://www.youtube.com/",
                                    "referrerPolicy": "strict-origin-when-cross-origin",
                                    "body": JSON.stringify({
                                        "context": {
                                            "client": {
                                                "clientName": "WEB",
                                                "clientVersion": "2.20230301.00.00",
                                                "hl": "en",
                                                "gl": "US"
                                            }
                                        },
                                        "browseId": channelUrl,
                                        "params": "EgZ2aWRlb3PyBgQKAjoA"
                                    }),
                                    "method": "POST",
                                    "mode": "cors",
                                    "credentials": "include"
                                }).then(response => response.json()).then(data => {
                                    var dataFromAPI2 = data;
                                    //console.log(dataFromAPI2);
                                    if (dataFromAPI2.header != null) {
                                        if (dataFromAPI2.header.c4TabbedHeaderRenderer.videosCountText != null) {
                                            var videoCount = dataFromAPI2.header.c4TabbedHeaderRenderer.videosCountText.runs[0].text;
                                            //console.log(videoCount);
                                            if (dataFromAPI2.header.c4TabbedHeaderRenderer.videosCountText.runs[1] != null) {
                                                var videoCountString = dataFromAPI2.header.c4TabbedHeaderRenderer.videosCountText.runs[1].text;
                                                document.querySelector(".owner-videos-scroller button span").textContent = videoCount + videoCountString;
                                                document.querySelector("#watch9-owner .owner-videos-scroller button span").textContent = videoCount + videoCountString;
                                            } else {
                                                document.querySelector(".owner-videos-scroller button span").textContent = videoCount;
                                                document.querySelector("#watch9-owner .owner-videos-scroller button span").textContent = videoCount;
                                            }
                                            if (document.querySelector(".owner-videos-scroller button[disabled]") != null) {
                                                document.querySelector(".owner-videos-scroller button").removeAttribute("disabled");
                                                document.querySelector("#watch9-owner .owner-videos-scroller button").removeAttribute("disabled");
                                            }
                                        } else {
                                            document.querySelector(".owner-videos-scroller button span").textContent = "No videos";
                                            document.querySelector(".owner-videos-scroller button").setAttribute("disabled", "");
                                            document.querySelector("#watch9-owner .owner-videos-scroller button span").textContent = "No videos";
                                            document.querySelector("#watch9-owner .owner-videos-scroller button").setAttribute("disabled", "");
                                        }
                                        var newChannelLink = dataFromAPI2.header.c4TabbedHeaderRenderer.channelId;
                                        if (dataFromAPI2.contents.twoColumnBrowseResultsRenderer.tabs[1] != null) {
                                            if (dataFromAPI2.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content != null) {
                                                var richGrid = dataFromAPI2.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.richGridRenderer;
                                                var richItemNo = 0;
                                                richGridGet();

                                                function richGridGet() {
                                                    if (richGrid.contents[richItemNo].richItemRenderer != null) {
                                                        var richItem = richGrid.contents[richItemNo].richItemRenderer.content.videoRenderer;
                                                        var itemTitle = richItem.title.runs[0].text;
                                                        var itemThumbnail = richItem.thumbnail.thumbnails[0].url;
                                                        var itemLink = richItem.videoId;
                                                        let container = document.querySelector('.scroller-inner');
                                                        var newElem = document.createElement("a");
                                                        newElem.classList.add("super-compact-video");
                                                        newElem.classList.add("spf-link");
                                                        newElem.innerHTML = `
														<div class="super-compact-video-inner flex">
															<div class="thumbnail">
																<img src=""></img>
															</div>
															<div class="meta">
																<div class="title">
																	<span></span>
																</div>
																<div class="view-count">
																	<span>???,??? views</span>
																</div>
															</div>
														</div>
														`;
                                                        container.insertBefore(newElem, container.children[richItemNo]);
                                                        let container2 = document.querySelector('#watch9-owner .scroller-inner');
                                                        var newElem2 = document.createElement("a");
                                                        newElem2.classList.add("super-compact-video");
                                                        newElem2.classList.add("spf-link");
                                                        newElem2.innerHTML = `
														<div class="super-compact-video-inner flex">
															<div class="thumbnail">
																<img src=""></img>
															</div>
															<div class="meta">
																<div class="title">
																	<span></span>
																</div>
																<div class="view-count">
																	<span>???,??? views</span>
																</div>
															</div>
														</div>
														`;
                                                        container2.insertBefore(newElem2, container2.children[richItemNo]);
                                                        var w9o = document.querySelector("#watch9-owner");
                                                        var w9os = document.querySelector("#watch9-owner-slider");
                                                        var theSCVid = w9o.querySelectorAll(".super-compact-video")[richItemNo];
                                                        theSCVid.querySelector(".title span").textContent = itemTitle;
                                                        theSCVid.querySelector("img").src = itemThumbnail;
                                                        theSCVid.setAttribute("href", "/watch?v=" + itemLink);
                                                        theSCVid = w9os.querySelectorAll(".super-compact-video")[richItemNo];
                                                        theSCVid.querySelector(".title span").textContent = itemTitle;
                                                        theSCVid.querySelector("img").src = itemThumbnail;
                                                        theSCVid.setAttribute("href", "/watch?v=" + itemLink);
                                                        richItemNo++;
                                                        richGridGet();
                                                    } else {
                                                        console.log("All available rich items gotten.");
                                                    }
                                                }
                                            } else {
                                                document.querySelector(".owner-videos-scroller button span").textContent = "No videos";
                                                document.querySelector(".owner-videos-scroller button").setAttribute("disabled", "");
                                                document.querySelector("#watch9-owner .owner-videos-scroller button span").textContent = "No videos";
                                                document.querySelector("#watch9-owner .owner-videos-scroller button").setAttribute("disabled", "");
                                            }
                                        } else {
                                            document.querySelector(".owner-videos-scroller button span").textContent = "No videos";
                                            document.querySelector(".owner-videos-scroller button").setAttribute("disabled", "");
                                            document.querySelector("#watch9-owner .owner-videos-scroller button span").textContent = "No videos";
                                            document.querySelector("#watch9-owner .owner-videos-scroller button").setAttribute("disabled", "");
                                        }
                                    } else {
                                        document.querySelector(".owner-videos-scroller button span").textContent = "No videos";
                                        document.querySelector(".owner-videos-scroller button").setAttribute("disabled", "");
                                        document.querySelector("#watch9-owner .owner-videos-scroller button span").textContent = "No videos";
                                        document.querySelector("#watch9-owner .owner-videos-scroller button").setAttribute("disabled", "");
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    }
})();