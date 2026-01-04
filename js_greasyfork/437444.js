// ==UserScript==
// @name 4chan X Thread Playback
// @namespace VSJPlus
// @license GNU GPLv3
// @description Plays back threads on 4chan X
// @version 1.0.3
// @match *://boards.4chan.org/*/*/*
// @match *://boards.4channel.org/*/*/*
// @run-at document-start
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @grant GM.info
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMjHxIGmVAAAAkUlEQVQ4T6WQAQ6AMAgD9yf/5Gv906QYSBGGRk1OXFuaxbEf2y/0Necc8uCl4FxRZa4WEWQ6HPDgIhNuUAUePRFSwIDeeV6gH02YsRx2QoELTQkvel6MIKhYlFTL4NUNoDEhzwUw78vAdJ6poFqGZtiZvbbAAuxVmVTAsyswP/0DngbOXMB+KFiBBSZ4KPjONk6FWw9BoS3PSwAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/437444/4chan%20X%20Thread%20Playback.user.js
// @updateURL https://update.greasyfork.org/scripts/437444/4chan%20X%20Thread%20Playback.meta.js
// ==/UserScript==
console.log('4chan X Playback');

(async function() {
	let isChanX;
	let fourChanXInitFinished = new Promise(res => {
		document.addEventListener(
			"4chanXInitFinished",
			function (event) {
				if (
					document.documentElement.classList.contains("fourchan-x") &&
					document.documentElement.classList.contains("sw-yotsuba")
				) {
					isChanX = true;
					res();
				}
			}
		);
	});

	async function appendStyle() {
		var head = document.head;

		if(!head) {
			head = await new Promise(res => {
				let obs = new MutationObserver(mutations => {
					for(let mutation of mutations) {
						if(!mutation.addedNodes || !mutation.addedNodes.length)
							continue;
						for(let node of mutation.addedNodes) {
							if(node.matches('head')) {
								obs.disconnect();
								res(node);
							}
						}
					}
				});
				obs.observe(document.documentElement, {childList: true});
			});
		}
		let link = document.createElement('link');
		link.rel = 'stylesheet';
		link.style = 'text/css';
		link.href = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css';
		head.appendChild(link);

		var style = document.createElement('style');
		style.type = 'text/css';
		style.id = 'playbackStyle';

		style.innerHTML = `
			#playbackUI {
			    position: absolute;
			    top: 100%;
			    margin: 0 auto;
			    width: 90%;
			    max-width: 1080px;
			    box-sizing: border-box;
			    background-color: #282a2e;
			    opacity: 0.9;
			    transition: opacity 100ms;
			    display: none;
			    z-index: 1;
			    box-shadow: 0 0 10px #0008;
			    padding: 10px;
			    left: 0;
			    right: 0;
			}

			#playbackSlider {
			    background: #bbb;
			    border-color: #999;
			    cursor: pointer;
			    position: relative;
			}

			#playbackSlider:hover {
			    background: #c4c4c4;
			}

			#playbackSlider #timestampPreview {
				position: absolute;
				width: 0;
				height: 0;
			}

			#playbackSlider #timestampPreview:after,
			#playbackSlider .ui-slider-handle.ui-state-active:after {
				top: unset !important;
				bottom: 100%;
				margin-top: unset !important;
				margin-bottom: 5px;
				opacity: 0;
				transition: opacity 100ms;
			}

			#playbackSlider .ui-slider-handle.ui-state-active:after {
				margin-bottom: 2px;
			}

			#playbackSlider:hover #timestampPreview:after,
			#playbackSlider .ui-slider-handle.ui-state-active:after {
				animation: none !important;
				opacity: 1;
			}

			#playbackSlider .ui-slider-handle:not(.ui-state-active):after,
			#playbackSlider.ui-state-active #timestampPreview {
				display: none !important;
			}


			#playbackUI:hover, #playbackUI:focus {
			    opacity: 1;
			}

			.playbackEnabled #playbackUI {
			    display: flex;
			    flex-direction: row;
			    align-items: center;
			}
			.playbackEnabled #playbackUI #playbackTimeContainer {
			    flex-shrink: 1;
			}

			.playbackEnabled #playbackUI #playbackSlider {
			    flex-grow: 1;
			    margin: 10px
			}

			#playbackInputContainer input {
			    width: 15px;
			    padding: 0;
			    margin: 0;
			    border: 0;
			    font-size: 12px;
			    font-weight: bold;
			}

			input#playbackInputYear {
			    width: 30px;
			}

			#playbackTimeContainer {
			    font-weight: bold;
			}

			#playbackDisplay > * > * {
			    cursor: pointer;
			}

			#playbackDisplay > * > *:hover {
			    color: #fff;
			}

			#playbackPauseResume {
			    width: 20px;
			    height: 27px;
			    text-align: center;
			    display: inline-block;
			    cursor: pointer;
			    position: relative;
			    color: #ccc;
			    transition: color 100ms;
			    vertical-align: center;
			}

			#playbackPauseResume:hover {
			    color: #fff;
			}

			#playbackPauseResume:before {
			    font-size: 20px;
			    display: block;
			    position: absolute;
			    user-select: none;
			    text-align: center;
			    top: -1.5px;
			}

			#playbackPauseResume:not(.pause):before {
			    content: 'II';
			    left: 2.5px;
			    font-weight: 900;
			}

			#playbackPauseResume.pause:before {
			    content: '';
			    width: 13px;
			    height: 15px;
			    background-color: #ccc;
			    left: 5px;
			    top: 6px;
			    clip-path: polygon(0 0, 13px 50%, 0 100%);
			}

			#playbackSkipBack,
			#playbackSkipAhead {
			    cursor: pointer;
			    position: relative;
			    top: -0.5px;
			    width: 18px;
			    height: 20px;
			    transition: transform 100ms;
			    transform-origin: 10px 12px;
			}

			@keyframes skipBack {
				0% { transform: rotate(0deg); }
				25% { transform: rotate(-35deg); }
				50% { transform: rotate(-20deg); }
				100% { transform: rotate(-25deg); }
			}

			#playbackSkipBack:active {
			    transform: rotate(-25deg);
			    animation: skipBack 50ms;
			}

			@keyframes skipAhead {
				0% { transform: rotate(0deg); }
				25% { transform: rotate(35deg); }
				50% { transform: rotate(20deg); }
				100% { transform: rotate(25deg); }
			}

			#playbackSkipAhead:active {
			    transform: rotate(25deg);
			    animation: skipAhead 50ms;
			}

			#playbackSkipBackContainer {
			    margin-left: 5px;
			}

			#playbackSkipBack .skipPath,
			#playbackSkipAhead .skipPath {
			    fill: #ccc;
			    transition: fill 100ms;
			}

			#playbackSkipBack:hover .skipPath,
			#playbackSkipAhead:hover .skipPath {
			    fill: #fff;
			}

			#playbackSpeedDisplay {
			    margin-left: 2px;
			    font-weight: bold;
			    cursor: pointer;
			}

			#playbackSpeedDisplay:hover {
			    color: #fff;
			}

			#playbackSpeedInput {
			    width: 35px;
			    padding: 0;
			    margin: 0;
			    border: 0;
			    text-align: right;
			    font-weight: bold;
			    font-size: 12px;
			}

			#playbackSpeedInput:after {
			    content: 'x';
			}

			.playbackEnabled .playbackHidden {
			        display: none !important;
			}

			.playbackEnabled .backlink.playbackHidden + .hashlink {
			        display: none !important;
			}

			#playbackUI .ui-slider-handle {
			    border-radius: 10px;
			    background: #ccc !important;
			    cursor: pointer;
			}

			#playbackUI .ui-slider-handle.ui-state-hover,
			#playbackUI .ui-slider-handle.ui-state-active {
			    background: #fff !important;
			}

			#playbackDisplay > * > * {
			    display: inline-block;
			}

			@media only screen and (max-width: 316px) {
			    #playbackUI {
			        width: 100%;
			        margin: 0;
			    }
			}

			.adc-resp-bg {
			    display: none;
			}

			[tooltip] {
			    position: relative;
			}

			[tooltip]:after {
			    opacity: 0;
			    content: attr(tooltip);
			    position: absolute;
			    background: #000;
			    padding: 3px;
			    top: 100%;
			    margin-top: 10px;
			    left: 50%;
			    transform: translateX(-50%);
			    border: 0.5px solid #ccc;
			    border-radius: 3px;
			    font-family: arial, helvetica, sans-serif;
			    font-weight: normal;
			    font-size: 10px;
			    text-align: center;
			    z-index: 1;
			    pointer-events: none;
			    color: #ccc;
			}

			[tooltip]:hover:after {
			    animation: tooltipFade 800ms;
			    opacity: 1;
			}

			@keyframes tooltipFade {
			    0% { opacity: 0; }
			    80% { opacity: 0; }
			    100% { opacity: 1; }
			}

			#playbackPauseResume.pause:hover:after {
			    content: 'Play';
			}

			#playbackToggle.loading {
			    opacity: 0.4;
			    cursor: wait;
			}
		`;

		head.appendChild(style);
	}

	let slider, scrubbing = false, seeking = false, playing = true, startUnix, currentUnix, maxUnix;

	const delay = ms => new Promise(r => setTimeout(r, ms));
	const isArchived = () => document.querySelector('#update-status').innerText == 'Archived';
	const $q = s => document.querySelector(s);
	const $qa = s => document.querySelectorAll(s);
	const $id = id => document.getElementById(id);
	const aF = () => new Promise(r => window.requestAnimationFrame(r));

	function updatePlaybackSub(interval) {
		maxUnix = isArchived() ? parseInt(Object.values(posts).map(p => p.timestamp).sort((a,b) => b-a)[0]):moment().unix();
		let increment = 1000/playbackSpeed;
		if(playing) currentUnix += interval/increment;
		currentUnix = Math.min(currentUnix, maxUnix);
		slider.slider('option', 'max', maxUnix);
		slider.slider('option', 'value', currentUnix);
	}

	let lastUpdate, playbackSpeed = 1, correction = 0;
	const getIntervals = () => {
		let now = Date.now(), increment = 1000/playbackSpeed;
		if(!lastUpdate) lastUpdate = now - increment;
		let realInterval = now - lastUpdate;
		correction = increment - (now - lastUpdate - correction);
		lastUpdate = now;
		return [realInterval, increment + correction];
	}
	async function updatePlayback() {
		await delay(1000 - Date.now()%1000);
		while(true) {
			let [realInterval, adjustedInterval] = getIntervals();
			if(!scrubbing) updatePlaybackSub(realInterval);
			await delay(adjustedInterval);
		}
	}

	function splitArray(array, limit) {
		let arrays = [];
		for(let i = 0; i < array.length; i += limit) {
			arrays.push(array.slice(i, i + limit));
		}
		return arrays;
	}

	const playbackHiddenPosts = [document.createElement('style')];
	let lastHiddenPosts;
	async function updatePostVisibility() {
		let selectors = Object.values(posts).filter(p => p.timestamp > currentUnix).map(p => p.selectors),
		newPosts = lastHiddenPosts != selectors.length;
		if(!newPosts) return;
		lastHiddenPosts = selectors.length;
		let scrollToBottom = false, docEl = document.documentElement;
		if(newPosts && autoScroll && (docEl.offsetHeight - (docEl.scrollTop + window.innerHeight)) < 100) {
			scrollToBottom = true;
		}
		let css = splitArray(selectors, 500)
				  .map(s => s.join(',')+'{display:none !important;}');
		while(playbackHiddenPosts.length < css.length) {
			let style = document.createElement('style');
			style.id = 'playbackHiddenPosts-'+playbackHiddenPosts.length;
			document.head.appendChild(style);
			playbackHiddenPosts.push(style);
		}
		for(let [k,v] of Object.entries(playbackHiddenPosts)) {
			playbackHiddenPosts[k].innerHTML = css[k] || '';
		}
		if(scrollToBottom) {
			await aF();
			docEl.scrollTop = docEl.offsetHeight - window.innerHeight;
		}
	}

	function updateDateTimeDisplay(unix) {
		let m = moment.unix(unix);
		[...$qa('#playbackDisplay [data-unit]')].forEach(e => (e.innerHTML = m.format(e.dataset.unit)));
	}

	const posts = {}, nextInput = {
		playbackInputYear: 'playbackInputMonth',
		playbackInputMonth: 'playbackInputDay',
		playbackInputDay: 'playbackInputHours',
		playbackInputHours: 'playbackInputMinutes',
		playbackInputMinutes: 'playbackInputSeconds'
	}

	function getPostData(id) {
		if(!id) return null;
		let selectors = [
			`.postContainer[data-full-i-d="${id}"]`,
			`.backlink[href="#p${id.split('.')[1]}"]`
		];
		let postContainer = $q(selectors[0]);
		selectors.push(`${selectors[1]} + .hashlink`)
		return {
			selectors: selectors.map(s => 'html.playbackEnabled '+s).join(', '),
			timestamp: parseInt(postContainer.querySelector('.dateTime').dataset.utc)
		}
	}

	let autoScroll = false;

	function togglePlay(newPlaying) {
		if(newPlaying === undefined)
			newPlaying = !playing;
		playing = newPlaying;
		if(playing) $('#playbackPauseResume').removeClass('pause');
		else $('#playbackPauseResume').addClass('pause');
	}

	async function setupPlaybackToggle() {
		let threadingControl = document.querySelector('#threadingControl');
		if(!threadingControl) return;
		let autoScrollCheckbox = $q('input[name="Auto Scroll"]');
		autoScroll = autoScrollCheckbox.checked;
		$(autoScrollCheckbox).change(e => (autoScroll = autoScrollCheckbox.checked));
		threadingControl.parentNode
		.insertAdjacentHTML('afterend', '<label id="playbackToggle" class="entry"><input id="playbackToggleCheckbox" type="checkbox"> Playback</label>');
		let checkbox = document.querySelector('#playbackToggleCheckbox');
		checkbox.checked = document.documentElement.matches('.playbackEnabled');

		let toggle = $('#playbackToggle').hover(e => $(e.target).addClass('focused').siblings().removeClass('focused'));
		if(!isChanX) {
			toggle.addClass('loading');
			checkbox.setAttribute('disabled', '');
			await fourChanXInitFinished;
		}

		$(checkbox).click(() => {
			let checked = document.querySelector('#playbackToggleCheckbox').checked;
			$(document.documentElement).toggleClass('playbackEnabled');
			togglePlay(checked);
		});

		toggle.removeClass('loading');
		checkbox.removeAttribute('disabled');
	}

	function setupPlaybackUI() {
		$q('#header-bar').insertAdjacentHTML('beforeend', `
			<div id="playbackUI">
				<div id="playbackTimeContainer">
					<div id="playbackInputContainer" class="playbackHidden">
						<div id="playbackInputDate">
							<input type="text" id="playbackInputYear" maxlength="4" data-unit="yyyy" tooltip="Change Year">/<input type="text" id="playbackInputMonth" maxlength="2" data-unit="MM" tooltip="Change Month">/<input type="text" id="playbackInputDay" maxlength="2" data-unit="DD" tooltip="Change Day">
						</div>
						<div id="playbackInputTime">
							<input type="text" id="playbackInputHours" maxlength="2" data-unit="HH" tooltip="Change Hour">:<input type="text" id="playbackInputMinutes" maxlength="2" data-unit="mm" tooltip="Change Minutes">:<input type="text" id="playbackInputSeconds" maxlength="2" data-unit="ss" tooltip="Change Seconds">
						</div>
					</div>
					<div id="playbackDisplay">
						<div id="playbackDisplayDate">
							<div id="playbackDisplayYear" data-unit="yyyy" tooltip="Change Year">----</div>/<div id="playbackDisplayMonth" data-unit="MM" tooltip="Change Month">--</div>/<div id="playbackDisplayDay" data-unit="DD" tooltip="Change Day">--</div>
						</div>
						<div id="playbackDisplayTime">
							<div id="playbackDisplayHours" data-unit="HH" tooltip="Change Hour">----</div>:<div id="playbackDisplayMinutes" data-unit="mm" tooltip="Change Minutes">--</div>:<div id="playbackDisplaySeconds" data-unit="ss" tooltip="Change Seconds">--</div>
						</div>
					</div>
				</div>
				<div id="playbackSlider"></div>
				<input id="playbackSpeedInput" class="playbackHidden" type="text" tooltip="Playback Speed">
				<div id="playbackSpeedDisplay" type="text" tooltip="Playback Speed">1x</div>
				<div id="playbackSkipBackContainer" tooltip="Back 5s"><svg id="playbackSkipBack" tooltip="Back 5s" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="19.090909090909093" height="24.204545454545457"><path class="skipPath" d="M9.55 7.23L9.55 7.23L9.55 4.83Q11.06 4.83 12.38 5.39Q13.69 5.96 14.69 6.96Q15.69 7.96 16.25 9.28Q16.82 10.60 16.82 12.10L16.82 12.10Q16.82 13.61 16.26 14.93Q15.70 16.24 14.69 17.24Q13.69 18.25 12.38 18.81Q11.06 19.38 9.55 19.38L9.55 19.38Q8.04 19.38 6.72 18.81Q5.40 18.25 4.40 17.24Q3.40 16.24 2.84 14.93Q2.27 13.61 2.27 12.10L2.27 12.10L4.67 12.11Q4.67 13.12 5.05 14.00Q5.42 14.88 6.09 15.55Q6.77 16.22 7.65 16.60Q8.54 16.97 9.55 16.97L9.55 16.97Q10.55 16.97 11.44 16.60Q12.33 16.22 13.00 15.55Q13.67 14.88 14.04 14.00Q14.42 13.12 14.42 12.11L14.42 12.11Q14.42 11.09 14.04 10.21Q13.66 9.33 12.99 8.65Q12.32 7.98 11.44 7.61Q10.55 7.23 9.55 7.23ZM9.87 1.32L9.87 10.95L4.96 6.14L9.87 1.32Z"/></svg></div>
				<div id="playbackPauseResume" tooltip="Pause"></div>
				<div id="playbackSkipAheadContainer" tooltip="Skip 5s"><svg id="playbackSkipAhead" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="19.090909090909093" height="24.204545454545457"><path class="skipPath" d="M9.55 19.38L9.55 19.38Q8.03 19.38 6.72 18.81Q5.40 18.25 4.40 17.24Q3.39 16.24 2.83 14.93Q2.27 13.61 2.27 12.10L2.27 12.10Q2.27 10.60 2.84 9.28Q3.40 7.96 4.40 6.96Q5.40 5.96 6.72 5.39Q8.03 4.83 9.55 4.83L9.55 4.83L9.55 7.23Q8.54 7.23 7.65 7.61Q6.77 7.98 6.10 8.65Q5.43 9.33 5.05 10.21Q4.67 11.09 4.67 12.10L4.67 12.10Q4.67 13.12 5.05 14.00Q5.42 14.88 6.09 15.55Q6.76 16.22 7.65 16.60Q8.53 16.97 9.55 16.97L9.55 16.97Q10.55 16.97 11.44 16.60Q12.32 16.22 12.99 15.55Q13.66 14.88 14.04 14.00Q14.42 13.11 14.42 12.10L14.42 12.10L16.82 12.10Q16.82 13.61 16.25 14.93Q15.69 16.24 14.69 17.24Q13.69 18.25 12.37 18.81Q11.05 19.38 9.55 19.38ZM14.13 6.14L9.23 10.95L9.23 1.32L14.13 6.14Z"/></svg></div>
			</div>
		`);
	}

	function updateCurrentTime(t) {
		currentUnix = Math.max(startUnix, Math.min(t, maxUnix));
		slider.slider('option', 'value', currentUnix);
	}

	async function waitForSelector(selector) {
		let result;
		do {
			if(result = document.querySelector(selector))
				return result;
			await delay(100);
		} while(1);
	}


	const debounce = (() => {
		const debounceList = {};

		async function debounceSub(name, interval) {
			while(true) {
				if(debounceList[name]) {
					debounceList[name]();
					delete debounceList[name];
				} else return;
				await delay(interval);
			}
		}

		return (name, method, interval) => {
			const runSub = !debounceList[name];
			debounceList[name] = method;
			if(runSub) debounceSub(name, interval);
		}
	})();

	async function doInit() {
		console.log('Playback Init');
		let obs = new MutationObserver(e => {
			if(e[0].addedNodes.length) {
				setupPlaybackToggle();
			}
		});
		obs.observe(await waitForSelector('#shortcut-menu'), {childList: true});
		setupPlaybackToggle();

		playbackHiddenPosts[0].id = 'playbackHiddenPosts-0';
		document.head.appendChild(playbackHiddenPosts[0]);
		appendStyle();

		await fourChanXInitFinished;

		[...$qa('.postContainer')].forEach(pc => {
			posts[pc.dataset.fullID] = getPostData(pc.dataset.fullID);
		});

		document.addEventListener('ThreadUpdate', e => {
			if(e.detail && e.detail.newPosts && e.detail.newPosts.length) {
				for(let postID of e.detail.newPosts) {
					posts[postID] = getPostData(postID);
				}
				updatePostVisibility();
			}
		});

		setupPlaybackUI();

		startUnix = parseInt($('.opContainer .dateTime').attr('data-utc'));
		currentUnix = isArchived() ? parseInt(Object.values(posts).map(p => p.timestamp).sort((a,b) => b-a)[0]):moment().unix();
		maxUnix = currentUnix;

		console.log('start', startUnix, 'current', currentUnix, 'max', maxUnix);

		function renderPlayback(e, ui) {
			currentUnix = ui.value;
			debounce('renderPlaybackTimestamp', () => {
				let hoverTimestamp = moment.unix(currentUnix)
								 	 .format('yyyy/MM/DD HH:mm:ss');
				handle.attr('tooltip', hoverTimestamp);
			}, 16);
			debounce('renderPlayback', () => {
				updateDateTimeDisplay(currentUnix);
				updatePostVisibility();
			}, 250);
		}

		let updatePreviewSub;
		async function updatePreview() {
			while(true) {
				if(updatePreviewSub) {
					updatePreviewSub();
				} else return;
				await delay(16);
			}
		}


		slider = $('#playbackSlider').slider({
			min: startUnix,
			value: currentUnix,
			max: maxUnix,
			start: (e, ui) => {
				scrubbing = true;
				slider.addClass('ui-state-active');
			},
			stop: (e, ui) => {
				scrubbing = false;
				slider.removeClass('ui-state-active');
			},
			animate: 0,
			change: renderPlayback,
			slide: renderPlayback
		}).on('mousemove', e => {
			/*let runUpdatePreview = !updatePreviewSub;
			updatePreviewSub =*/ 
			debounce('updatePreview', () => {
				let rect = slider[0].getBoundingClientRect(),
					fraction = (e.clientX - rect.left)/rect.width,
					hoverTimestamp = Math.round(fraction*(maxUnix - startUnix)) + startUnix;
				hoverTimestamp = Math.max(Math.min(hoverTimestamp, maxUnix), startUnix);
				hoverTimestamp = moment.unix(hoverTimestamp)
								 .format('yyyy/MM/DD HH:mm:ss');
				preview.attr('tooltip', hoverTimestamp);

				let style = `left: ${e.clientX - rect.left}px`;
				preview[0].style = style;
				//updatePreviewSub = null;
			}, 16);
			//if(runUpdatePreview) updatePreview();
		});

		let handle = $('#playbackUI .ui-slider-handle');

		slider.append('<div id="timestampPreview"></div>');
		let preview = $('#timestampPreview');

		updatePlayback();

		$('#playbackPauseResume').click(e => {
			$(e.target).toggleClass('pause');
			playing = !playing;
		});

		let playbackInputContainer = $('#playbackInputContainer');
		let playbackDisplay = $('#playbackDisplay').click(e => {
			let unit = e.target.dataset.unit;
			let m = moment.unix(currentUnix);
			[...$qa('#playbackInputContainer input')].forEach(e => (e.value = m.format(e.dataset.unit)));
			swapTimeDisplayAndInput();
			let focusElement;
			if(unit) focusElement = $q('#playbackInputContainer [data-unit="'+unit+'"]');
			else focusElement = $q('#playbackInputYear');
			focusElement.focus();
			focusElement.setSelectionRange(0, focusElement.maxLength);
		});

		function swapTimeDisplayAndInput() {
			playbackInputContainer.toggleClass('playbackHidden');
			playbackDisplay.toggleClass('playbackHidden');
			seeking = !seeking;
		}

		function submitInput() {
			let date = [...$qa('#playbackInputDate input')].map(e => e.value.padStart(e.maxLength, '0')).join('/'),
				time = [...$qa('#playbackInputTime input')].map(e => e.value.padStart(e.maxLength, '0')).join(':'),
				m = moment(date + ' ' + time, 'yyyy/MM/DD HH:mm:ss');
			updateCurrentTime(m.unix());
			swapTimeDisplayAndInput();
		}

		function updatePlaybackSpeedDisplay() {
			let n = (Math.round(playbackSpeed*100)/100)+'x';
			playbackSpeedDisplay.html(n);
		}

		let playbackSpeedInput = $('#playbackSpeedInput').on('keyup', e => {
			let isNumber = /^[\d.]$/.test(e.key);
			if(/^[^\d\.]$/.test(e.key) && !e.ctrlKey) {
				e.preventDefault();
			}
			if(e.key == 'Escape') swapSpeedDisplayAndInput();
			if(e.key == 'Enter') {
				let newSpeed;
				try {
					newSpeed = parseFloat(playbackSpeedInput[0].value);
				} catch(e) { newSpeed = 1; }
				playbackSpeed = newSpeed;
				console.log('newSpeed', playbackSpeed);
				updatePlaybackSpeedDisplay();
				swapSpeedDisplayAndInput();
			}
		});

		let playbackSpeedDisplay = $('#playbackSpeedDisplay').click(e => {
			playbackSpeedInput[0].value = playbackSpeed; 
			swapSpeedDisplayAndInput();
			playbackSpeedInput.focus();
			playbackSpeedInput[0].setSelectionRange(0, playbackSpeedInput[0].value.length);
		});

		function swapSpeedDisplayAndInput() {
			playbackSpeedDisplay.toggleClass('playbackHidden');
			playbackSpeedInput.toggleClass('playbackHidden');
		}

		$('#playbackSkipBack').click(e => {
			updateCurrentTime(currentUnix - 5);
		});

		$('#playbackSkipAhead').click(e => {
			updateCurrentTime(currentUnix + 5);
		});

		let keydownElement;
		$('#playbackInputContainer input').on('keydown keyup', e => {
			if(e.type == 'keydown') {
				keydownElement = e.target;
				return;
			}
			if(e.target != keydownElement) {
				return;
			}
			let isNumber = /^\d$/.test(e.key);
			if(/^[^\d]$/.test(e.key) && !e.ctrlKey) {
				e.preventDefault();
			}
			if(isNumber && e.target.value.length == e.target.maxLength) {
				if(nextInput[e.target.id]) {
					let next = $id(nextInput[e.target.id]);
					next.focus();
					next.setSelectionRange(0, next.value.length);
				} else submitInput();
			}
			if(e.key == 'Enter') submitInput();
			if(e.key == 'Escape') swapTimeDisplayAndInput();
		});

		console.log('Playback Init complete');
	}
	doInit();
})();