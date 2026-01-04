// ==UserScript==
// @name			Youtube Automation
// @namespace		https://greasyfork.org/scripts?set=439787
// @homepage		https://greasyfork.org/scripts/419583-youtube-automation
// @version			2.2.4
// @description		Automatically cancels dialogs and removes Ads, making YouTube friendlier and lightweight.
// @author			V. H.
// @defaulticon		https://www.google.com/s2/favicons?domain=youtube.com
// @include			/^.{3,5}:\/\/(.+?\.)?youtu\.?be(.com)?(?=\/)/
// @grant			GM_log
// @grant			GM_addStyle
// @grant			unsafeWindow
// @grant			onurlchange
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			GM_deleteValue
// @grant			GM_addElement
// @grant			GM_download
// @grant			GM_registerMenuCommand
// @require			https://greasyfork.org/scripts/419588-uniq/code/UniQ.js
// @require			https://greasyfork.org/scripts/423445-ytdc/code/YTDC.js
// @connect			self
// @run-at			document-body
// @compatible		Chrome
// @license			AFL-3.0
// @noframes		
// @downloadURL https://update.greasyfork.org/scripts/494195/Youtube%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/494195/Youtube%20Automation.meta.js
// ==/UserScript==

/**
 * Trigger the Panel from Tampermonkey menu to access the Utilities.
 * 
 * Disable the CSS if you use white theme.
 * 
 * This is an AdBlock filter to turn off profile pictures in live chat, and thus, reduce network usage and cpu:
 * 	||yt4.ggpht.com/ytc$image,media,other,object,xmlhttprequest
 * 
 * This is an AdBlock rule to turn off livechat completely:
 * 	||youtube.com/live*$script,websocket,other,media,object,xmlhttprequest,ping,font,stylesheet,image
 * 
 * Cookies to Block:
 * [*.]doubleclick.net - Ads & Tracking of Google
 * 
 * 
 * YouTube itag: https://gist.github.com/sidneys/7095afe4da4ae58694d128b1034e01e2
 */

 void async function _script() {
	"use strict";
	
	var _clean, _redir, loc = new URL(location.href);
	
	unsafeWindow.google_ad_status = unsafeWindow.ytautoconf_count = 0;
	unsafeWindow._time = -1;
	
	GM_registerMenuCommand("Panel", panel, "P");
	
	GM_log("YT Automation loaded.");
	
	//Get embedded player
	unsafeWindow._getPlayer = function _getPlayer() {
		let p;
		
		if (unsafeWindow.videoPlayer && !unsafeWindow.videoPlayer.setPlaybackQuality) {
			for (const i in unsafeWindow.videoPlayer) {
				if (unsafeWindow.videoPlayer[i] && unsafeWindow.videoPlayer[i].setPlaybackQuality) {
					p = unsafeWindow.videoPlayer[i];
					break;
				}
			}
		} else {
			p = document.querySelector("#movie_player, #movie_player-flash, #movie_player-html5, #movie_player-html5-flash") ||
				document.getElementsByClassName("html5-video-player")[0];
		}
		
		return ((unsafeWindow.videoPlayer = unsafeWindow.videoPlayer || p), p);
	}; //_getPlayer
	
	await sleep(500);
	
	//Skin - Disable on white theme
	GM_addStyle(`
	/* V. H. ~ Youtube Automation */
	::-webkit-scrollbar {
		min-width: 10px;
		width: 15px;
		max-width: 20px;
		opacity: .8;
		position: sticky;
		right: 0;
		transition: width 1s, opacity 1s;
		z-index: 999;
	}
	::-webkit-scrollbar:hover, ::-webkit-scrollbar:focus {
		opacity: 1;
	}
	::-webkit-scrollbar-track {
		box-shadow: inset 0 0 3px grey;
		border-radius: 5px;
	}
	::-webkit-scrollbar-thumb {
		background-color: rgba(150, 150, 150, .8);
		border-radius: 5px;
		box-shadow: inset 0 0 2px 1px lightgray;
	}
	::-webkit-scrollbar-button {
		background-color: rgba(120, 120, 120, .8);
	}
	::-webkit-resizer, ::-webkit-scrollbar-corner {
		background-color: rgba(160, 160, 160, .7);
		border-radius: 5px;
	}
	::-webkit-input-placeholder {
		color: rgba(100, 100, 200, .9);
	}
	::selection {
		background-color: rgba(50, 50, 200, .8);
		color: rgb(200, 200, 50);
	}
	
	:paused {
		border: 2px dotted rgba(50, 200, 50, .8);
	}
	video {
		cursor: cell;
	}
	img, video, svg, paper-button, tp-yt-paper-button {
		border-radius: calc(2px + 2vmin);
		filter: drop-shadow(1px 1px 1px rgba(200, 100, 100, .3));
	}
	paper-button, tp-yt-paper-button {
		transition: box-shadow 1s;
	}
	yt-icon-button, paper-button, tp-yt-paper-button {
		box-shadow: 0 0 1px 1px rgba(120, 120, 120, .2);
		padding: 2px;
	}
	paper-button:hover, yt-icon-button:hover {
		box-shadow: 0 0 2px 2px rgba(130, 130, 130, .4);
	}
	#country-code::after {
		content: " - Modded";
	}
	#input, #search, #contenteditable-textarea, input, textarea {
		caret-color: aquamarine;
	}
	#movie_player {
		resize: both;
	}
	#columns, #primary, #secondary, #contents {
		background-image: radial-gradient(circle closest-side at center, #303030 10%, #101010 110%);
		background-attachment: fixed;
		background-repeat: no-repeat;
		background-blend-mode: color-dodge;
		background-position: center;
		background-size: cover;
		padding: 5px 10px 0 10px;
		margin: 5px;
	}
	ytd-watch-next-secondary-results-renderer > #contents, ytd-watch-next-secondary-results-renderer > #items, .ytd-comments #contents {
		overflow-y: auto;
		max-height: 76vh;
		border: 2px groove rgba(150, 150, 150, .4);
		resize: both;
		border-radius: 10px;
		scrollbar-gutter: stable;
		overscroll-behavior: contain;
		scrollbar-width: thin;
	}
	yt-formatted-string, span, p {
		color: #CCCCCC;
		text-shadow: -1px -1px 1px rgba(130, 130, 130, .3) !important;
		padding: auto;
	}
	
	#_YTA_Top {
		bottom: 3vmin;
		right: 3vmin;
	}
	#_YTA_Tool {
		top: 1vmin;
		left: 40vmin;
	}
	#_YTA_Tool, #_YTA_Top {
		position: fixed;
		min-width: 20px;
		width: 3vmax;
		max-width: 50px;
		min-height: 20px;
		height: 3vmax;
		max-height: 50px;
		border-radius: 50%;
		box-shadow: 1px 1px 1px 1px rgba(150, 150, 150, .5);
		transition: all 500ms;
		opacity: .5;
		z-index: 9999;
		box-sizing: border-box;
		background-image: radial-gradient(circle closest-side at center, rgba(200, 200, 200, .85), rgba(50, 50, 50, .7));
		background-position: center;
		background-size: 100%;
		color: rgb(100, 100, 50);
		text-shadow: 1px 1px 1px rgba(100, 100, 50, .9);
		text-align: center;
		vertical-align: middle;
		line-height: 100%;
		padding: 1px;
		cursor: pointer;
	}
	#_YTA_Panel {
		position: fixed;
		top: 50px;
		border-radius: 2vmin;
		background-image: radial-gradient(circle farthest-side at center, rgba(220, 220, 220, .8), rgba(100, 100, 100, .6));
		background-position: center;
		background-size: 100%;
		background-repeat: no-repeat;
		text-align: center;
		vertical-align: middle;
		margin: 0;
		padding: auto;
		resize: both;
		overflow: auto;
		overscroll-behavior: contain;
		scrollbar-width: thin;
		scrollbar-gutter: stable;
		z-index: 9999;
		opacity: .6;
		box-sizing: border-box;
		transition: 500ms opacity;
		cursor: pointer;
		color: rgb(15, 15, 15);
		display: block flex;
		flex-flow: column wrap;
		max-height: 60vh;
		max-width: 90vw;
	}
	#_YTA_Panel:hover {
		opacity: .85;
		box-shadow: 1px 1px 1px lightgray;
	}
	#_YTA_Panel fieldset {
		margin: 3px;
		padding: 1px;
		height: auto;
		width: auto;
		display: block flex;
		flex-flow: column wrap;
		align-items: baseline;
		align-content: center;
		justify-content: space-around;
		border: 1px ridge black;
		font-size: 1.05em;
		cursor: default;
		overflow: auto;
	}
	#_YTA_Panel form * {
		margin: auto;
		padding: 1px;
		border-radius: 1vmin;
		text-shadow: -1px 0 rgba(100, 100, 100, .5);
	}
	#_YTA_Panel form *:hover {
		border-radius: 1vmin;
		text-shadow: -1px 0 gray;
		box-shadow: 1px 1px 1px rgba(100, 100, 100, .7);
	}
	#_YTA_Panel label {
		user-select: none;
	}
	#_YTA_Panel legend {
		user-select: none;
		touch-callout: none;
		pointer-events: none;
	}
	#_YTA_Panel label::after {
		content: ": ";
	}
	#_YTA_Top:hover, #_YTA_Tool:hover {
		box-shadow: 0 0 2px 2px rgba(150, 150, 150, .7);
		opacity: .8;
		border-radius: 35%;
		text-shadow: 1px 1px 2px rgba(110, 110, 60, .8);
	}
	#_YTA_Top:active, #_YTA_Tool:active {
		opacity: .9;
		border-radius: 40%;
		background-image: radial-gradient(circle closest-side at center, rgba(230, 230, 230, .9), rgba(80, 80, 80, .7));
	}
	._YTA_hidden {
		visibility: hidden !important;
		display: none !important;
		width: 0 !important;
		height: 0 !important;
		opacity: 0 !important;
		pointer-events: none !important;
		user-select: none !important;
	}
	/* */
	`);
	
	await unsafeWindow.try_max(() => document.readyState === "complete" && document.body, 4, 500);
	
	const banlist = [ "Video paused. Continue watching?", "Keep your music and videos playing with YouTube Premium." ],
		p = await unsafeWindow.try_max(_setup, 4, 500),
		hide = () => unsafeWindow.do_if(document.querySelectorAll("paper-button#button, tp-yt-paper-button#button"), btns => {
			for (const btn of btns) {
				if (btn.innerText.includes("HIDE CHAT")) {
					setTimeout(() => {
						btn.click();
						
						GM_log("Chat hidden.");
					}, 2000);
					
					return true;
				} else if (/NO,? THANKS/i.test(btn.innerText)) {
					btn.click();
					
					GM_log("Dismissed.");
				}
			}
			
			return false;
		}),
		makepanel = () => unsafeWindow.do_if(!document.getElementById("_YTA_Panel") && unsafeWindow.videoPlayer, p => {
			const ppanel = document.createElement("form"), //input wrapper, under root
				diag = document.createElement("dialog"), //root
				hidepanel = document.createElement("button"), //hide
				rreload = document.createElement("button"), //reload
				ssave = document.createElement("button"), //download
				volume = document.createElement("input"), //volume text
				volume2 = document.createElement("input"), //volume range
				volumel = document.createElement("label"), //volume label
				filtereset = document.createElement("button"), //reset filters
				field = document.createElement("fieldset"), //utils
				fieldl = document.createElement("legend"), //utils label
				filter = document.createElement("fieldset"), //filters
				filterl = document.createElement("legend"), //filters label
				blur = document.createElement("input"), //blur text
				blurl = document.createElement("label"), //blur label
				bright = document.createElement("input"), //brightness text
				brightl = document.createElement("label"), //brightness label
				contra = document.createElement("input"), //contrast text
				contral = document.createElement("label"), //contrast label
				grays = document.createElement("input"), //contrast text
				grays2 = document.createElement("input"), //contrast range
				graysl = document.createElement("label"), //contrast label
				hue = document.createElement("input"), //hue-rotate text
				hue2 = document.createElement("input"), //hue-rotate range
				huel = document.createElement("label"), //hue-rotate label
				invert = document.createElement("input"), //invert text
				invert2 = document.createElement("input"), //invert range
				invertl = document.createElement("label"), //invert label
				opacity = document.createElement("input"), //opacity text
				opacity2 = document.createElement("input"), //opacity range
				opacityl = document.createElement("label"), //opacity label
				saturate = document.createElement("input"), //saturate text
				saturatel = document.createElement("label"), //saturate label
				sepia = document.createElement("input"), //sepia text
				sepia2 = document.createElement("input"), //sepia text
				sepial = document.createElement("label"), //sepia label
				speed = document.createElement("input"), //speed text
				speedl = document.createElement("label"), //speed label
				nullish = document.createElement("img"); //drag shadow
			let x = 0, y = 0, drg = false,
				filterstr = GM_getValue("filter", `blur(0px) brightness(100%) contrast(100%) grayscale(0%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`);
			
			(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr;
			
			ssave.innerText = "Download";
			ssave.id = "_YTA_Down";
			ssave.onclick = c => {
				try {
					const ytdd = unsafeWindow.ytInitialPlayerResponse ? unsafeWindow.ytInitialPlayerResponse.streamingData.formats : null;
					
					if (ytdd && ytdd.length && ytdd[ytdd.length - 1].url) {
						open(ytdd[ytdd.length - 1].url, document.title + " - DOWNLOAD")
						.alert("Press the 3 vertical dots or right-click and select 'download'");
						GM_download({
							url: ytdd[ytdd.length - 1].url,
							name: document.title + " - DOWNLOAD",
							saveAs: true,
						});
					} else if (ytdd && ytdd.length && ytdd[ytdd.length - 1].signatureCipher) {
						open(unsafeWindow._ytd.process(), document.title + " - DOWNLOAD")
						.alert("Press the 3 vertical dots or right-click and select 'download'");
						GM_download({
							url: unsafeWindow._ytd.process(),
							name: document.title + " - DOWNLOAD",
							saveAs: true,
						});
					} else throw "Force - rel";
					
					GM_log("Download triggered");
				} catch(e) {
					console.error(e);
					GM_log("Attempting download relog...");
					alert("Retry after Reload (doesn't work [well] on livestreams)");
					
					timerel();
				}
			};
			
			field.onmousedown = m => { m.stopImmediatePropagation(); drg = false; diag.draggable = false; };
			fieldl.innerText = "YTA Panel";
			filterl.innerText = "Player Filters";
			ppanel.novalidate = true;
			ppanel.onsubmit = e => { e.preventDefault(); e.stopImmediatePropagation(); return false; };
			
			diag.id = "_YTA_Panel";
			diag.draggable = false;
			diag.classList.toggle("_YTA_hidden");
			diag.onmousedown = diag.ondragstart = m => {
				if (m.offsetX >= m.target.offsetWidth * .95) return;
				
				if (m.dataTransfer) {
					m.dataTransfer.effectAllowed = m.dataTransfer.dropEffect = "move";
					m.dataTransfer.setDragImage(nullish, diag.offsetWidth / 2, diag.offsetHeight / 2);
				}
				
				x = m.offsetX;
				y = m.offsetY;
				
				drg = true;
			};
			document.body.addEventListener("mousemove", diag.ondragend = diag.ondrag = diag.onmousemove = m => {
				if (!(drg && !m.button)) return;
				
				m.preventDefault();
				
				if (m.dataTransfer) {
					m.dataTransfer.effectAllowed = m.dataTransfer.dropEffect = "move";
					m.dataTransfer.setDragImage(nullish, diag.offsetWidth / 2, diag.offsetHeight / 2);
				}
				
				diag.style.left = `${m.clientX - x}px`;
				diag.style.top = `${m.clientY - y}px`;
				
				if (m.type === "dragend") {
					drg = false;
					x = y = 0;
				}
			}, true);
			addEventListener("mouseup", document.body.onmouseup = diag.onmouseup = m => { drg = false; x = y = 0; }, true);
			
			hidepanel.innerText = "Hide Panel";
			hidepanel.onclick = e => panel();
			rreload.innerText = "Reload (maintain time)";
			rreload.onclick = e => timerel();
			filtereset.innerText = "Reset Filters";
			filtereset.onclick = e => {
				if (unsafeWindow.videoPlayer) {
					let targ = unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer;
					
					targ.style.filter = filterstr = `blur(0px) brightness(100%) contrast(100%) grayscale(0%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`;
					
					if (targ.setPlaybackRate) targ.setPlaybackRate(1);
					else targ.playbackRate = 1;
				}
				
				sepia.value = sepia2.value = blur.value = grays.value = grays2.value = hue.value = hue2.value = invert.value = invert2.value = 0;
				speed.value = 1;
				saturate.value = bright.value = contra.value = opacity.value = opacity2.value = 100;
			};
			//-----
			speed.type = sepia.type = saturate.type = opacity.type = invert.type = hue.type = grays.type = contra.type = bright.type = blur.type = volume.type = "number";
			sepia2.type = opacity2.type = invert2.type = hue2.type = grays2.type = volume2.type = "range";
			speed.pattern = saturate.pattern = contra.pattern = bright.pattern = blur.pattern = /\d*/i;
			hue.pattern = hue2.pattern = /^((1|2)\d{2}|3[0-5]\d|\d{1,2})$/i;
			sepia2.pattern = sepia.pattern = opacity2.pattern = opacity.pattern = invert2.pattern = invert.pattern = grays2.pattern = grays.pattern = volume.pattern = volume2.pattern = /^((100)|\d{1,2})$/i;
			volume2.onwheel = volume.onwheel = m => {
				m.preventDefault();
				m.stopPropagation();
				
				if (m.target.value - Math.sign(m.deltaY) * m.target.step >= m.target.min && m.target.value - Math.sign(m.deltaY) * m.target.step <= m.target.max) {
					volume2.value = volume.value -= Math.sign(m.deltaY) * m.target.step;
					
					if (unsafeWindow.videoPlayer) unsafeWindow.videoPlayer.setVolume(m.target.value);
				}
				
				return false;
			};
			grays2.onwheel = grays.onwheel = m => {
				m.preventDefault();
				m.stopPropagation();
				
				if (m.target.value - Math.sign(m.deltaY) * m.target.step >= m.target.min && m.target.value - Math.sign(m.deltaY) * m.target.step <= m.target.max) {
					grays2.value = grays.value -= Math.sign(m.deltaY) * m.target.step;
					
					if (unsafeWindow.videoPlayer)
						(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=grayscale\()(\d{0,3}?)(?=%\))/gi, m.target.value);
				}
				
				return false;
			};
			sepia2.onwheel = sepia.onwheel = m => {
				m.preventDefault();
				m.stopPropagation();
				
				if (m.target.value - Math.sign(m.deltaY) * m.target.step >= m.target.min && m.target.value - Math.sign(m.deltaY) * m.target.step <= m.target.max) {
					sepia2.value = sepia.value -= Math.sign(m.deltaY) * m.target.step;
					
					if (unsafeWindow.videoPlayer)
						(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=sepia\()(\d{0,3}?)(?=%\))/gi, m.target.value);
				}
				
				return false;
			};
			hue2.onwheel = hue.onwheel = m => {
				m.preventDefault();
				m.stopPropagation();
				
				if (m.target.value - Math.sign(m.deltaY) * m.target.step >= m.target.min && m.target.value - Math.sign(m.deltaY) * m.target.step <= m.target.max) {
					hue2.value = hue.value -= Math.sign(m.deltaY) * m.target.step;
					
					if (unsafeWindow.videoPlayer)
						(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=hue-rotate\()(\d{0,3}?)(?=deg\))/gi, m.target.value);
				}
				
				return false;
			};
			invert2.onwheel = invert.onwheel = m => {
				m.preventDefault();
				m.stopPropagation();
				
				if (m.target.value - Math.sign(m.deltaY) * m.target.step >= m.target.min && m.target.value - Math.sign(m.deltaY) * m.target.step <= m.target.max) {
					invert2.value = invert.value -= Math.sign(m.deltaY) * m.target.step;
					
					if (unsafeWindow.videoPlayer)
						(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=invert\()(\d{0,3}?)(?=%\))/gi, m.target.value);
				}
				
				return false;
			};
			opacity2.onwheel = opacity.onwheel = m => {
				m.preventDefault();
				m.stopPropagation();
				
				if (m.target.value - Math.sign(m.deltaY) * m.target.step >= m.target.min && m.target.value - Math.sign(m.deltaY) * m.target.step <= m.target.max) {
					opacity2.value = opacity.value -= Math.sign(m.deltaY) * m.target.step;
					
					if (unsafeWindow.videoPlayer)
						(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=opacity\()(\d{0,3}?)(?=%\))/gi, m.target.value);
				}
				
				return false;
			};
			blur.onwheel = m => {
				m.preventDefault();
				m.stopPropagation();
				
				if (m.target.value - Math.sign(m.deltaY) * m.target.step >= m.target.min) {
					m.target.value -= Math.sign(m.deltaY) * m.target.step;
					
					if (unsafeWindow.videoPlayer)
						(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=blur\()(\d*?)(?=px\))/gi, m.target.value);
				}
				
				return false;
			};
			speed.onwheel = m => {
				m.preventDefault();
				m.stopPropagation();
				
				if (m.target.value - Math.sign(m.deltaY) * m.target.step >= m.target.min && m.target.value - Math.sign(m.deltaY) * m.target.step <= m.target.max) {
					m.target.value -= Math.sign(m.deltaY) * m.target.step;
					
					if (unsafeWindow.videoPlayer) {
						let targ = unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer;
						
						if (targ.setPlaybackRate) targ.setPlaybackRate(m.target.value);
						else targ.playbackRate = m.target.value;
					}
				}
				
				return false;
			};
			saturate.onwheel = m => {
				m.preventDefault();
				m.stopPropagation();
				
				if (m.target.value - Math.sign(m.deltaY) * m.target.step >= m.target.min) {
					m.target.value -= Math.sign(m.deltaY) * m.target.step;
					
					if (unsafeWindow.videoPlayer)
						(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=saturate\()(\d*?)(?=%\))/gi, m.target.value);
				}
				
				return false;
			};
			bright.onwheel = m => {
				m.preventDefault();
				m.stopPropagation();
				
				if (m.target.value - Math.sign(m.deltaY) * m.target.step >= m.target.min) {
					m.target.value -= Math.sign(m.deltaY) * m.target.step;
					
					if (unsafeWindow.videoPlayer)
						(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=brightness\()(\d*?)(?=%\))/gi, m.target.value);
				}
				
				return false;
			};
			contra.onwheel = m => {
				m.preventDefault();
				m.stopPropagation();
				
				if (m.target.value - Math.sign(m.deltaY) * m.target.step >= m.target.min) {
					m.target.value -= Math.sign(m.deltaY) * m.target.step;
					
					if (unsafeWindow.videoPlayer)
						(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=contrast\()(\d*?)(?=%\))/gi, m.target.value);
				}
				
				return false;
			};
			speed.min = sepia.min = sepia2.min = saturate.min = opacity2.min = opacity.min = invert2.min = invert.min = hue2.min = hue.min = grays2.min = grays.min = contra.min = bright.min = blur.min = volume2.min = volume.min = 0;
			hue2.max = hue.max = 359;
			sepia.max = sepia2.max = opacity2.max = opacity.max = invert2.max = invert.max = grays2.max = grays.max = volume2.max = volume.max = 100;
			speed.max = 3.9;
			speed.step = 0.1;
			sepia.step = sepia2.step = saturate.step = opacity2.step = opacity.step = invert2.step = invert.step = hue2.step = hue.step = grays2.step = grays.step = contra.step = bright.step = blur.step = volume2.step = volume.step = 1;
			speed.maxlength = sepia.maxlength = sepia2.maxlength = saturate.maxlength = opacity2.maxlength = opacity.maxlength = invert2.maxlength = invert.maxlength = hue2.maxlength = hue.maxlength = grays2.maxlength = grays.maxlength = contra.maxlength = bright.maxlength = blur.maxlength = volume2.maxlength = volume.maxlength = 7;
			speed.minlength = sepia.minlength = sepia2.minlength = saturate.minlength = opacity2.minlength = opacity.minlength = invert2.minlength = invert.minlength = hue2.minlength = hue.minlength = grays2.minlength = grays.minlength = contra.minlength = bright.minlength = blur.minlength = volume2.minlength = volume.minlength = 1;
			speed.placeholder = "Speed";
			sepia.placeholder = sepia2.placeholder = "Sepia";
			saturate.placeholder = "Saturate";
			opacity2.placeholder = opacity.placeholder = "Opacity";
			invert2.placeholder = invert.placeholder = "Invert";
			grays2.placeholder = grays.placeholder = "Grayscale";
			hue2.placeholder = hue.placeholder = "Hue Rotation";
			contra.placeholder = "Contrast";
			bright.placeholder = "Brightness";
			blur.placeholder = "Blur";
			volume2.placeholder = volume.placeholder = "Volume";
			speed.value = 1;
			sepia2.value = sepia.value = invert2.value = invert.value = hue2.value = hue.value = grays2.value = grays.value = blur.value = 0;
			saturate.value = opacity2.value = opacity.value = contra.value = bright.value = 100;
			volume2.value = volume.value = unsafeWindow.videoPlayer ? unsafeWindow.videoPlayer.getVolume ? unsafeWindow.videoPlayer.getVolume() : 100 : 100;
			volume2.oninput = volume2.onchange = volume.oninput = volume.onchange = e => {
				e.preventDefault();
				e.stopImmediatePropagation();
				
				if (e.target.value < 0 || e.target.value > 100) return false;
				if (unsafeWindow.videoPlayer) unsafeWindow.videoPlayer.setVolume(e.target.value);
				
				volume.value = volume2.value = e.target.value;
			};
			blur.onchange = e => {
				e.preventDefault();
				e.stopImmediatePropagation();
				
				if (e.target.value < 0) return false;
				
				if (unsafeWindow.videoPlayer)
					(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=blur\()(\d*?)(?=px\))/gi, e.target.value);
			};
			bright.onchange = e => {
				e.preventDefault();
				e.stopImmediatePropagation();
				
				if (e.target.value < 0) return false;
				
				if (unsafeWindow.videoPlayer)
					(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=brightness\()(\d*?)(?=%\))/gi, e.target.value);
			};
			contra.onchange = e => {
				e.preventDefault();
				e.stopImmediatePropagation();
				
				if (e.target.value < 0) return false;
				
				if (unsafeWindow.videoPlayer)
					(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=contrast\()(\d*?)(?=%\))/gi, e.target.value);
			};
			saturate.onchange = e => {
				e.preventDefault();
				e.stopImmediatePropagation();
				
				if (e.target.value < 0) return false;
				
				if (unsafeWindow.videoPlayer)
					(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=saturate\()(\d*?)(?=%\))/gi, e.target.value);
			};
			speed.onchange = e => {
				e.preventDefault();
				e.stopImmediatePropagation();
				
				if (e.target.value < 0) return false;
				
				if (unsafeWindow.videoPlayer) {
					let targ = unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer;
					
					if (targ.setPlaybackRate) targ.setPlaybackRate(e.target.value);
					else targ.playbackRate = e.target.value;
				}
			};
			grays2.oninput = grays.oninput = grays2.onchange = grays.onchange = e => {
				e.preventDefault();
				e.stopImmediatePropagation();
				
				if (e.target.value < 0 || e.target.value > 100) return false;
				
				if (unsafeWindow.videoPlayer)
				(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=grayscale\()(\d{0,3}?)(?=%\))/gi, e.target.value);
				
				grays.value = grays2.value = e.target.value;
			};
			sepia2.oninput = sepia.oninput = sepia2.onchange = sepia.onchange = e => {
				e.preventDefault();
				e.stopImmediatePropagation();
				
				if (e.target.value < 0 || e.target.value > 100) return false;
				
				if (unsafeWindow.videoPlayer)
				(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=sepia\()(\d{0,3}?)(?=%\))/gi, e.target.value);
				
				sepia2.value = sepia.value = e.target.value;
			};
			hue2.oninput = hue.oninput = hue2.onchange = hue.onchange = e => {
				e.preventDefault();
				e.stopImmediatePropagation();
				
				if (e.target.value < 0 || e.target.value > 359) return false;
				
				if (unsafeWindow.videoPlayer)
					(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=hue-rotate\()(\d{0,3}?)(?=deg\))/gi, e.target.value);
				
				hue.value = hue2.value = e.target.value;
			};
			invert2.oninput = invert.oninput = invert2.onchange = invert.onchange = e => {
				if (unsafeWindow.videoPlayer)
					(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=invert\()(\d{0,3}?)(?=%\))/gi, e.target.value);
				
				invert2.value = invert.value = e.target.value;
				
				e.preventDefault();
				e.stopImmediatePropagation();
			};
			opacity2.oninput = opacity.oninput = opacity2.onchange = opacity.onchange = e => {
				if (unsafeWindow.videoPlayer)
					(unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter = filterstr = filterstr.replace(/(?<=opacity\()(\d{0,3}?)(?=%\))/gi, e.target.value);
				
				opacity2.value = opacity.value = e.target.value;
				
				e.preventDefault();
				e.stopImmediatePropagation();
			};
			volume.id = "_YTA_Panel_volume"; volume2.id = "_YTA_Panel_volume2"; volumel.for = "_YTA_Panel_volume"; volumel.innerText = "Volume";
			blur.id = "_YTA_Panel_blur"; blurl.for = "_YTA_Panel_blur"; blurl.innerText = "Blur";
			bright.id = "_YTA_Panel_bright"; brightl.for = "_YTA_Panel_bright"; brightl.innerText = "Brightness";
			contra.id = "_YTA_Panel_contra"; contral.for = "_YTA_Panel_contra"; contral.innerText = "Contrast";
			grays.id = "_YTA_Panel_grays"; graysl.for = "_YTA_Panel_grays"; graysl.innerText = "Grayscale";
			hue.id = "_YTA_Panel_hue"; huel.for = "_YTA_Panel_hue"; huel.innerText = "Hue Rotate";
			invert.id = "_YTA_Panel_invert"; invertl.for = "_YTA_Panel_invert"; invertl.innerText = "Invert";
			opacity.id = "_YTA_Panel_opacity"; opacityl.for = "_YTA_Panel_opacity"; opacityl.innerText = "Opacity";
			saturate.id = "_YTA_Panel_saturate"; saturatel.for = "_YTA_Panel_saturate"; saturatel.innerText = "Saturate";
			sepia.id = "_YTA_Panel_sepia"; sepial.for = "_YTA_Panel_sepia"; sepial.innerText = "Sepia";
			speed.id = "_YTA_Panel_speed"; speedl.for = "_YTA_Panel_speed"; speedl.innerText = "Speed";
			
			
			filter.appendChild(filterl); field.appendChild(fieldl);
			field.appendChild(hidepanel); field.appendChild(rreload); field.appendChild(filtereset);
			field.appendChild(document.createElement("br"));
			field.appendChild(volumel); field.appendChild(volume); field.appendChild(volume2);
			field.appendChild(document.createElement("br"));
			field.appendChild(speedl); field.appendChild(speed);
			field.appendChild(document.createElement("br"));
			field.appendChild(ssave);
			field.appendChild(document.createElement("hr"));
			
			filter.appendChild(opacityl); filter.appendChild(opacity); filter.appendChild(opacity2);
			filter.appendChild(document.createElement("br"));
			filter.appendChild(brightl); filter.appendChild(bright);
			filter.appendChild(document.createElement("br"));
			filter.appendChild(contral); filter.appendChild(contra);
			filter.appendChild(document.createElement("br"));
			filter.appendChild(saturatel); filter.appendChild(saturate);
			filter.appendChild(document.createElement("br"));
			filter.appendChild(huel); filter.appendChild(hue); filter.appendChild(hue2);
			filter.appendChild(document.createElement("br"));
			filter.appendChild(invertl); filter.appendChild(invert); filter.appendChild(invert2);
			filter.appendChild(document.createElement("br"));
			filter.appendChild(sepial); filter.appendChild(sepia); filter.appendChild(sepia2);
			filter.appendChild(document.createElement("br"));
			filter.appendChild(graysl); filter.appendChild(grays); filter.appendChild(grays2);
			filter.appendChild(document.createElement("br"));
			filter.appendChild(blurl); filter.appendChild(blur);
			
			field.appendChild(filter); ppanel.appendChild(field); diag.appendChild(ppanel);
			document.body.appendChild(diag);
			
			GM_log("_YTA_Panel created.");
			
			if (GM_getValue("sticky1", false)) {
				GM_deleteValue("sticky1");
				panel();
			}
		}),
		makebtn = () => unsafeWindow.do_if(!document.getElementById("_YTA_Top") && document.body, e => {
			const btn = document.createElement("button"),
				p = document.createElement("button");
			
			p.innerText = "Tool";
			p.id = "_YTA_Tool";
			p.onclick = c => panel();
			btn.innerText = "Top";
			btn.id = "_YTA_Top";
			btn.onclick = c => {
				document.querySelectorAll("ytd-watch-next-secondary-results-renderer > #contents, ytd-watch-next-secondary-results-renderer > #items, .ytd-comments #contents").forEach(q => (q.scrollTop = 0));
				scrollTo(0, 0);
				
				GM_log("Scrolled to Top");
				
				return true;
			};
			
			document.body.appendChild(p);
			document.body.appendChild(btn);
			
			GM_log("_YTA_Top/Tool created.");
		});
	
	await unsafeWindow._ytd.init();
	
	delete unsafeWindow.ytads;
	if (unsafeWindow.yt) {
		delete unsafeWindow.yt.ads;
		delete unsafeWindow.yt.ads_;
	}
	if (unsafeWindow.ytInitialPlayerResponse) {
		delete unsafeWindow.ytInitialPlayerResponse.adPlacements;
		delete unsafeWindow.ytInitialPlayerResponse.playerAds;
	}
	
	const i = setInterval(_clean = async () => {
		unsafeWindow.try_once(hide);
		unsafeWindow.try_once(makebtn);
		unsafeWindow.try_once(makepanel);
		
		if ((unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter) GM_setValue("filter", (unsafeWindow.videoPlayer._p || unsafeWindow.videoPlayer).style.filter);
		
		if (GM_getValue("down", false)) {
			GM_deleteValue("down");
			document.getElementById("_YTA_Down").click();
		}
		
		if (unsafeWindow.ytInitialPlayerResponse) delete unsafeWindow.ytInitialPlayerResponse.playerAds;
		if (unsafeWindow.yt) {
			delete unsafeWindow.yt.ads;
			delete unsafeWindow.yt.ads_;
			
			if (unsafeWindow.yt.www) delete unsafeWindow.yt.www.ads;
		}
		
		delete unsafeWindow.ytads;
		
		//Ad&Pause
		unsafeWindow.do_if(document.querySelectorAll("tp-yt-iron-overlay-backdrop.opened"), ally => {
			for (const al of ally) {
				GM_log("Closed Ally");
				
				al.remove();
			}
			
			if (ally.length && unsafeWindow.videoPlayer && unsafeWindow.videoPlayer.playVideo) unsafeWindow.videoPlayer.playVideo();
			
			return ally.length;
		});
		
		//Reload
		if (document.querySelector("a[href^='//support.google.com/youtube/?p=player_error']") || document.getElementsByClassName("ytp-ad-player-overlay-instream-info").length) {
			GM_log(`Reloading... ${unsafeWindow._time}`);
			
			timerel();
		}
		
		//Box Ad
		document.getElementsByClassName("ytp-ad-overlay-close-button").forEach(ad => {
			unsafeWindow.ytautoconf_count++;
			GM_log("Removed an Ad box.");
			ad.click();
		});
		
		//Home screen Ad box
		document.getElementsByTagName("ytd-display-ad-renderer").forEach(ad => {
			unsafeWindow.ytautoconf_count++;
			GM_log("Removed home Ad.");
			ad.parentNode.parentNode.remove();
		});
		
		//Ad elements
		document.getElementsByClassName("ytp-ad-module, #toast, #masthead-ad, #player-ads").forEach(ad => {
			unsafeWindow.ytautoconf_count++;
			GM_log("Removed Ad / toast.");
			ad.remove();
		});
		
		//AFK
		document.getElementsByClassName("yt-confirm-dialog-renderer").forEach(diag => {
			if (diag.innerText && banlist.includes(diag.innerText)) {
				if (diag.innerText === banlist[0]) diag.parentNode.parentNode.parentNode.querySelector("#confirm-button").click();
				else diag.parentNode.parentNode.parentNode.querySelector("#cancel-button").click();
				
				if (diag.parentNode.parentNode.parentNode) diag.parentNode.parentNode.parentNode.remove();
				else if (diag.parentNode.parentNode) diag.parentNode.parentNode.remove();
				
				unsafeWindow.ytautoconf_count++;
				GM_log(`Skipped a dialog. (${diag.innerText})`);
			}
		});
	}, 600);
	
	sleep(500).then(_clean);
	
	document.addEventListener("fullscreenchange", f => {
		unsafeWindow.do_if(document.getElementById("_YTA_Top"), t => t.classList.toggle("_YTA_hidden"));
		unsafeWindow.do_if(document.getElementById("_YTA_Tool"), t => t.classList.toggle("_YTA_hidden"));
		
		GM_log("Fullscreen toggle.");
	});
	
	addEventListener("urlchange", _redir = async u => {
		unsafeWindow.try_once.remove(hide);
		
		if (await _setup() && u.url.includes("/watch")) {
			if (unsafeWindow.ytInitialPlayerResponse && unsafeWindow.ytInitialPlayerResponse.streamingData && unsafeWindow.ytInitialPlayerResponse.streamingData.formats)
				unsafeWindow.ytInitialPlayerResponse = null;
		}
		
		unsafeWindow._time = -1;
		
		GM_log("YTRedir:  " + u.url);
	});
	
	//Video Quality
	async function _setup() {
		localStorage.setItem("yt-player-quality", JSON.stringify({ "data": "hd720" }));
		localStorage.setItem("yt-player-av1-pref", "720");
		localStorage.setItem("yt-html5-player-modules::subtitlesModuleData::module-enabled", true);
		localStorage.setItem("ytaq_ytgaming", true); localStorage.setItem("ytaq_gaming", true);
		sessionStorage.setItem("yt-player-quality", JSON.stringify({ "data": "hd720" }));
		sessionStorage.setItem("yt-player-av1-pref", "720");
		sessionStorage.setItem("yt-html5-player-modules::subtitlesModuleData::module-enabled", true);
		sessionStorage.setItem("ytaq_ytgaming", true); sessionStorage.setItem("ytaq_gaming", true);
		
		const player = await unsafeWindow.try_max(unsafeWindow._getPlayer, 4, 500);
		
		if (player) {
			const p = player.getElementsByTagName("video")[0];
			
			if (player.setPlaybackQualityRange) player.setPlaybackQualityRange("large", "hd720");
			if (player.setPlaybackQuality) player.setPlaybackQuality("hd720");
			if (p.setPlaybackQualityRange) p.setPlaybackQualityRange("large", "hd720");
			if (p.setPlaybackQuality) p.setPlaybackQuality("hd720");
			
			if (p) {
				player._p = p;
				
				p.preload = "auto";
				if (p.controlslist) p.controlslist.remove("nodownload");
				
				player.ontimeupdate = p.ontimeupdate = e => {
					unsafeWindow._time = ~~(player.getCurrentTime() || p.currentTime);
					
					if (player && p && GM_getValue("seek", -1) > 0) {
						player.seekTo(GM_getValue("seek", unsafeWindow._time));
						GM_deleteValue("seek");
						
						GM_log("Seeked to:", GM_getValue("seek", unsafeWindow._time));
					}
				};
				p.onvolumechange = player.onvolumechange = e => {
					const vol = document.getElementById("_YTA_Panel_volume"), vol2 = document.getElementById("_YTA_Panel_volume2");
					
					if (vol) vol.value = (player.getVolume || p.getVolume)();
					if (vol2) vol2.value = (player.getVolume || p.getVolume)();
				};
			}
			
			GM_log("Quality Adjusted, Event hooks set up.");
		}
		
		return player;
	} //_setup
	
	function panel() {
		unsafeWindow.do_if(document.getElementById("_YTA_Panel"), pan => {
			pan.classList.toggle("_YTA_hidden");
			pan.toggleAttribute("open");
		});
		
		GM_log("Panel triggered.");
	} //panel
	
	//Reload
	async function timerel(a = true, c = false) {
		GM_setValue("sticky1", a);
		if (c) GM_setValue("down", c);
		
		if (unsafeWindow._time >= 0) {
			GM_log("Seek to:", unsafeWindow._time);
			GM_setValue("seek", unsafeWindow._time);
		}
		
		GM_log("Reloading...");
		
		return location.reload();
	} //timerel
	unsafeWindow._timerel = timerel;
}();