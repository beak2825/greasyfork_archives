// ==UserScript==
// @name         Youtube - Fix channel links in sidebar recommendations
// @namespace    1N07
// @version      1.0.1
// @description  Fixes the channel links for the "Up next" and recommended videos below it on youtube.
// @author       1N07
// @license      Unlicense
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @match        https://www.youtube.com/*
// @require      https://update.greasyfork.org/scripts/12036/70722/Mutation%20Summary.js
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @incompatible firefox v1.0/1.0.1 broken on Firefox currently (LibreWolf works)
// @compatible   chrome v1.0 tested on Chrome v139.0.7258.128 using Tampermonkey v5.3.3
// @compatible   opera Opera untested, but likely works with at least Tampermonkey
// @compatible   edge Edge untested, but likely works with at least Tampermonkey
// @compatible   safari Safari untested, but likely works with at least Tampermonkey
// @downloadURL https://update.greasyfork.org/scripts/376510/Youtube%20-%20Fix%20channel%20links%20in%20sidebar%20recommendations.user.js
// @updateURL https://update.greasyfork.org/scripts/376510/Youtube%20-%20Fix%20channel%20links%20in%20sidebar%20recommendations.meta.js
// ==/UserScript==
//v1.0 tested on LibreWolf v136.0-2 using Tampermonkey v5.3.3

(() => {
	console.log("%cSCRIPT START", "color: green;");
	let videoSectionOption;
	let videoSection = GM_getValue("videoSection", true);
	SetVidSecOption();

	GM_addStyle(`
		.ytd-watch-next-secondary-results-renderer .channel-link-blocker:hover ~ span {
			text-decoration: underline;
		}
		.channel-link-blocker-parent
		{
			position: relative;
		}
		.channel-link-blocker
		{
			display: inline-block;
			position: absolute;
			width: 100%;
			height: 25px;
			background-color: rgba(255, 25, 25, 0);
			top: 32px;
			left: 0;
			z-index: 2019;
		}
	`);

	//"Block Youtube Users" compatibility
	let byuBlockerStyleAdjustment;
	let byuObserver = new MutationSummary({
		callback: (summary) => {
			console.log(
				"%cBlock Youtube Users detected, applying compatibility feature",
				"color: green;",
			);
			summary[0].added[0].addEventListener("click", () => {
				setTimeout(() => {
					for (const blocker of document.getElementsByClassName("channel-link-blocker")) {
						UpdateBlockerSizeAndPositioning(blocker);
					}
				}, 200);
			});
			if (byuObserver) {
				byuObserver.disconnect();
				byuObserver = null;
			}
		},
		queries: [{ element: "#byu-icon" }],
	});
	setTimeout(() => {
		if (byuObserver) {
			//console.log("%cBlock Youtube Users not detected", "color: green;");
			byuObserver.disconnect();
			byuObserver = null;
		}
	}, 10000);

	const perVideoObservers = [];
	const dataSearchIntervalMap = new Map();
	let perVideoObserverIndexTally = 0;
	const containerObserver = new MutationSummary({
		callback: (containerSummary) => {
			// console.log(
			// 	`%cContainer Observer triggered - Added: ${containerSummary[0].added.length}, Removed: ${containerSummary[0].removed.length}, Reparented: ${containerSummary[0].reparented.length}`,
			// 	"color: green",
			// );

			// On video added
			for (const vid of containerSummary[0].added) {
				//console.log(vid);
				// Add blocker element
				const blockerParent = vid.querySelector(".yt-lockup-metadata-view-model-wiz__metadata .yt-content-metadata-view-model-wiz__metadata-row:first-child");
				//console.log(blockerParent);
				blockerParent.classList.add("channel-link-blocker-parent");

				const blockerElem = document.createElement("a");
				blockerElem.className = "channel-link-blocker";
				blockerElem.href = "#";
				blockerParent.prepend(blockerElem);

				const channelLink = blockerParent.querySelector(
					".channel-link-blocker",
				);

				UpdateBlockerSizeAndPositioning(channelLink);
				UpdateUrl(vid, channelLink, true);

				const thisVideoObserverIndex = perVideoObserverIndexTally;

				// Add observer id to element so we can clean up the right observer when the element is later removed
				vid.setAttribute("data-active-observer-id", thisVideoObserverIndex);

				/* dev note for later:
					Seems like PolymerController is no longer used. Also, data isn't populated when href is, so have to do even more complicated stuff. i.e. Checking for data on an interval until we get proper url, since we can't MutationObserve for data. 
					The new setup is way too messy. Should see if I can figure out a way to more reliably detect when data is available to be read.
					Seems like the href change mutationObserver detects a bunch of changes, not just one. Maybe one of those corresponds with data population?
				*/

				// Add per-video observer for when the video href changes, so we can update the channel link accordingly. Doing this because apparently these days YT just swaps the data in the elements without swapping the elements themselves.
				// Also put the observer in an array with an access key for later access
				perVideoObservers.push({
					key: thisVideoObserverIndex,
					observer: new MutationSummary({
						callback: (vidSummary) => {
							//console.log("%cPer Video Observer triggered: href changed - added: " + vidSummary[0].added.length + ", changed: " + vidSummary[0].valueChanged.length, "color: green");

							UpdateBlockerSizeAndPositioning(channelLink);

							//Since latest YT update, the href being updated doesn't guarantee that the video yet has valid data, so at least for now, we just try to get the data periodically with an interval until we get it, or we timeout
							//If there is already a interval for this video, clear it
							if (dataSearchIntervalMap.has(thisVideoObserverIndex))
								clearInterval(dataSearchIntervalMap.get(thisVideoObserverIndex));

							//create new interval for this video with a timeout
							let timeoutTracker = 0;
							dataSearchIntervalMap.set(thisVideoObserverIndex, setInterval(() => {
								//if the url is updated succesfully, we clear the interval
								if (UpdateUrl(vid, channelLink)) {
									clearInterval(dataSearchIntervalMap.get(thisVideoObserverIndex));
									dataSearchIntervalMap.delete(thisVideoObserverIndex);
								}
								//track time, if time > 10s, give up and clear interval
								timeoutTracker += 200;
								if (timeoutTracker >= 10000) {
									clearInterval(dataSearchIntervalMap.get(thisVideoObserverIndex));
									dataSearchIntervalMap.delete(thisVideoObserverIndex);
								}
							}, 200));
						},
						rootNode: blockerParent.querySelector("a[href^='/watch']"),
						queries: [{ attribute: "href" }],
					}),
				});
				perVideoObserverIndexTally++;
			}

			// On removed
			for (const vid of containerSummary[0].removed) {
				// Get the observer id/key we stored in the element previously
				const id = vid.dataset.activeObserverId;
				// console.log("%cAttempting to remove observer: " + id, "color: red");
				if (id !== undefined) {
					// console.log("id valid");
					// Get the observer from the observer array with the key
					const index = perVideoObservers.findIndex((o) => o.key === id);
					if (index > -1) {
						// console.log("observer found");
						// Disconnect the observer and remove it from the array
						perVideoObservers[index].observer.disconnect();
						perVideoObservers.splice(index, 1);
						// console.log("%cRemoved observer: " + id, "color: red");
					}
				}
			}

			//console.log("%cObservers alive: ", "color: yellow");
			//console.log(perVideoObservers.map(x => x.key));
		},
		rootNode: document.querySelector("ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer > #contents"),
		queries: [
			{
				element: "yt-lockup-view-model.ytd-item-section-renderer",
			},
		],
	});

	function UpdateBlockerSizeAndPositioning(blocker, withDelayedRetry = true) {
		const parentRect = blocker.parentElement.getBoundingClientRect();
		const targetRect = blocker.parentElement.querySelector("span.yt-content-metadata-view-model-wiz__metadata-text").getBoundingClientRect();

		// Calculate the blocker's position relative to the parent
		// targetRect position is viewport-relative, parentRect is too.
		// Subtract parent's top/left from target's top/left
		const blockerTop = targetRect.top - parentRect.top;
		const blockerLeft = targetRect.left - parentRect.left;

		// Apply size and position to the blocker
		blocker.style.width = `${targetRect.width}px`;
		blocker.style.height = `${targetRect.height}px`;
		blocker.style.top = `${blockerTop}px`;
		blocker.style.left = `${blockerLeft}px`;

		//Not sure if below is needed anymore. Leaving it here for now, but commented out. Will remove later if he issue donesn't return.
		//Adjustment appears to rarely and randomly fail. Attempted fix by additionally reapplying adjustment with a delay, as perhaps the height hasn't been computed yet or something?
		// if (withDelayedRetry) {
		// 	setTimeout(() => {
		// 		UpdateBlockerPositioning(blocker, false);
		// 	}, 1000);
		// }
	}

	function UpdateUrl(fromElem, toElem, initial = false) {
		//Used to get data from element. Newest source used by YT is .polymerController, but older sources that may still be in use if certain flags are in place include .inst or just the element itself
		//Seems like polymerController is no longer used, but leaving it her for now as an option I guess - Though if polymerController does appear back, the data structure is likely different, so UpdateUrl will break.
		const getVideoData = (o) => o?.polymerController?.data || o?.inst?.data || o?.data || null;

		if (initial) {
			toElem.addEventListener("click", (e) => {
				if (e.target.href.endsWith("#")) {
					e.preventDefault();
					e.stopPropagation();
					alert("Don't have the channel link for this yet. Try again in a second. If the problem persists, report it as an issue on greasyfork.");
				}
			});
		}

		const data = getVideoData(fromElem.firstElementChild);
		//console.log("data:");
		//console.log(data);
		const channelHandle = data?.metadata?.lockupMetadataViewModel?.image?.decoratedAvatarViewModel?.rendererContext?.commandContext?.onTap?.innertubeCommand?.browseEndpoint?.canonicalBaseUrl;
		//console.log("channelHandle:");
		//console.log(channelHandle);

		if (channelHandle?.length) {
			toElem.setAttribute(
				"href",
				channelHandle + (videoSection ? "/videos" : ""),
			);
			return true;
		} else {
			//console.log("Failed to get channel url");
			return false;
		}
	}

	function SetVidSecOption() {
		GM_unregisterMenuCommand(videoSectionOption);
		videoSectionOption = GM_registerMenuCommand(
			`Fix channel links- videos section (${videoSection ? "yes" : "no"}) -click to change-`,
			() => {
				videoSection = !videoSection;
				GM_setValue("videoSection", videoSection);
				SetVidSecOption();
			},
		);
	}
})();
