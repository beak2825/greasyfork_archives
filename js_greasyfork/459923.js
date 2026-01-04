// ==UserScript==
// @name         Spotify Waveform
// @namespace    https://greasyfork.org/en/users/943407-webchantment
// @version      1.2
// @description  Display Waveforms for Tracks on Spotify
// @author       Webchantment
// @match        https://open.spotify.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/459923/Spotify%20Waveform.user.js
// @updateURL https://update.greasyfork.org/scripts/459923/Spotify%20Waveform.meta.js
// ==/UserScript==

(async () => {

	//*********************SETTINGS***************************//
	const clientID = "myClientID";
	const clientSecret = "myClientSecret";

	let height = 36;
	let color = "lightgrey";
	//********************************************************//

	let playObserver;
	let nowPlayingLink;
	let progressDiv;
	let firstLoad = true;

	let adObserver;
	let adDeteted = false;

	const nowPlayingDiv = "footer > div > div > div";

	init();

	function init()
	{
		playObserver = new MutationObserver(() =>
		{
			if (firstLoad)
			{
				nowPlayingLink = document.querySelector(nowPlayingDiv + " > div > div > a");
				progressDiv = document.querySelector(nowPlayingDiv + " > div.playback-bar > div > div");
			}

			if (nowPlayingLink && progressDiv)
			{
				playObserver.disconnect();
				firstLoad = false;

				//check for API key
				if (clientID === "myClientID" || clientSecret === "myClientSecret")
				{
					alert("Spotify Waveform: Please enter clientID and clientSecret");
					return;
				}

				progressDiv.style.backgroundImage = "";
				console.log("loading waveform...");
				loadWaveform();

				playObserver.observe(nowPlayingLink, { attributeFilter: ["href"] });

				if (!adObserver)
				{
					adObserver = new MutationObserver(() =>
					{
						const adDiv = document.querySelector(nowPlayingDiv + "[aria-label='Advertisement']");

						if (adDiv && !adDeteted)
						{
							adDeteted = true;
							console.log("ads started.");

							playObserver.disconnect();
							firstLoad = true;

							progressDiv.style.backgroundImage = "";
						}
						else if (!adDiv && adDeteted)
						{
							adDeteted = false;
							console.log("ads finished.");

							init();
						}
					});
					adObserver.observe(document.querySelector(nowPlayingDiv), { attributeFilter: ["aria-label"] });
				}
			}
		});
		playObserver.observe(document.body, { childList: true, subtree: true });
	}

	async function loadWaveform()
	{
		const trackId = getTrackId();
		const spotifyTrackAnalysis = await getSpotifyTrackAnalysis(await getSpotifyToken(), trackId);
		const waveform = createWaveform(spotifyTrackAnalysis);
		drawWaveform(waveform);
	}

	function getTrackId()
	{
		let nowPlayingURL = nowPlayingLink.href;
		let trackId = nowPlayingURL.substring(nowPlayingURL.lastIndexOf("%3A") + 3, nowPlayingURL.length);

		return trackId;
	}

	async function getSpotifyToken()
	{
		let token = await GM_getValue("spotifyToken");

		if (token && (Date.now() - token.date < 3600000)) //lasts for 1 hour
			return token.value;

		let myHeaders = new Headers();
		myHeaders.append("Authorization", "Basic " + btoa(clientID + ":" + clientSecret));
		myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

		var urlencoded = new URLSearchParams();
		urlencoded.append("grant_type", "client_credentials");

		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: urlencoded,
			redirect: 'follow'
		}

		let res = await fetch("https://accounts.spotify.com/api/token", requestOptions);
		res = await res.json();

		//save token to storage
		GM_setValue("spotifyToken", { value: res.access_token, date: Date.now() });

		//console.log(res);
		return res.access_token;
	}

	async function getSpotifyTrackAnalysis(spotifyToken, trackId)
	{
		const trackAnalysisURL = `https://api.spotify.com/v1/audio-analysis/${trackId}`;

		let myHeaders = new Headers();
		myHeaders.append("Authorization", `Bearer ${spotifyToken}`);

		const requestOptions = {
			method: 'GET',
			headers: myHeaders
		}

		let res = await fetch(trackAnalysisURL, requestOptions);

		if (res.status === 500)
		{
			console.log("Error fetching spotify track analysis, retrying...");
			res = await fetch(trackAnalysisURL, requestOptions);
		}

		res = await res.json();

		//console.log(res);
		return res;
	}

	function createWaveform(data)
	{
		let duration = data.track.duration;

		let segments = data.segments.map(segment =>
		{
			return {
				start: segment.start / duration,
				duration: segment.duration / duration,
				loudness: 1 - (Math.min(Math.max(segment.loudness_max, -17), 0) / -17)
			};
		});

		let min = Math.min(...segments.map(s => s.loudness));
		let max = Math.max(...segments.map(s => s.loudness));

		let levels = [];
		for (let i = 0.000; i < 1; i += 0.001)
		{
			let s = segments.find(segment =>
			{
				return i <= segment.start + segment.duration;
			});

			let loudness = Math.round((s.loudness / max) * 100) / 100;

			levels.push(loudness);
		}

		//console.log(levels);
		return levels;
	}

	function drawWaveform(waveform)
	{
		let canvas = document.createElement("canvas");

		let width = progressDiv.clientWidth;

		canvas.width = width;
		canvas.height = height;

		let context = canvas.getContext("2d");

		for (let x = 0; x < width; x++)
		{
			let i = Math.ceil(waveform.length * (x / width));

			let h = Math.round(waveform[i] * height) / 2;

			context.fillStyle = color;

			context.fillRect(x, (height / 2) - h, 1, h);
			context.fillRect(x, (height / 2), 1, h);
		}

		progressDiv.style.height = height + "px";
		progressDiv.style["margin-top"] = "-12px";
		progressDiv.style.backgroundImage = "url(" + canvas.toDataURL() + ")";
	}

})();