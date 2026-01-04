// ==UserScript==
// @name         Replay recorder - Bonk.io
// @description  Adds a button to record replays from the main menu
// @author       Excigma
// @namespace    https://greasyfork.org/users/416480
// @license      GPL-3.0
// @version      0.0.4
// @match        https://bonk.io/gameframe-release.html
// @require      https://cdn.jsdelivr.net/gh/SMUsamaShah/CanvasRecorder@d4f97159ca53294cc27606144f09a88caaa59065/CanvasRecorder.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/435991/Replay%20recorder%20-%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/435991/Replay%20recorder%20-%20Bonkio.meta.js
// ==/UserScript==

// Uses https://github.com/SMUsamaShah/CanvasRecorder

(async () => {
	while (!document.querySelector("#bgreplay canvas")) await new Promise(r => setTimeout(r, 250));
	
	console.log("[Replay Recorder] Found replay canvas");

	const pretty_top_bar = document.getElementById("pretty_top_bar");
	const pretty_top_replay_text = document.getElementById("pretty_top_replay_text");
	const pretty_top_replay_back = document.getElementById("pretty_top_replay_back");
	const pretty_top_replay_next = document.getElementById("pretty_top_replay_next");
	const pretty_top_replay = document.getElementById("pretty_top_replay");
	const pretty_top_replay_record = document.createElement("div");
	const replay_canvas = document.querySelector("#bgreplay canvas");
	
	// eslint-disable-next-line no-undef
	const recorder = new CanvasRecorder(replay_canvas, 5000000);
	let recording = false;

	pretty_top_replay_record.style.visibility = "hidden";
	pretty_top_replay_record.id = "pretty_top_replay_record";
	pretty_top_replay_record.classList.add("pretty_top_button", "niceborderleft", "niceborderright", "niceborderbottom");
	pretty_top_replay.appendChild(pretty_top_replay_record);

	const stop_recording = () => {
		if (!recording) return;

		try {
			console.log("[Replay Recorder] Ending recording");

			recorder.stop();
			recorder.save(`bonkio-replay-${new Date().toLocaleString().replace(/\\| |:|,/g, "_")}.webm`);

			pretty_top_bar.style.visibility = "";

			recording = false;
		} catch (er) {
			console.log("[Replay Recorder] An error occurred whilst trying to stop recording:");
			console.error(er);

			pretty_top_bar.style.visibility = "";

			recorder.stop();

			recording = false;

			alert("Replay Recorder encountered an error, it is recommend that you reload");
		}
	};
	
	pretty_top_replay_record.addEventListener("click", () => {
		if (recording) return;

		recording = true;
		
		pretty_top_replay_next.click();
		pretty_top_replay_back.click();

		console.log("[Replay Recorder] Started recording");

		pretty_top_bar.style.visibility = "hidden";

		// Start after delay to prevent recording the face in
		setTimeout(recorder.start, 250);
		// Stop recording after 15 seconds
		setTimeout(stop_recording, 15000 - 250);
	});

	// If the replay is less than 15 seconds, then this will catch the 
	// next replay starting, and stop the recording
	unsafeWindow.anime = new Proxy(unsafeWindow.anime, {
		apply(target, thisArg, args) {
			if (recording && args[0]) {
				// Only replays use these specific parameters... for now
				if (args[0].alpha === 1 &&
					args[0].autoplay === true &&
					args[0].delay === 0 &&
					args[0].duration === 200 &&
					args[0].easing === "linear") {
					stop_recording();
				}
			}

			return target.apply(thisArg, args);
		}
	});

	// Show the replay record button when the replay button is hovered
	new MutationObserver(mutationsList => {
		for (const mutation of mutationsList) {
			if (mutation.target.style.visibility === "hidden") pretty_top_replay_record.style.visibility = "hidden";
			else pretty_top_replay_record.style.visibility = "inherit";
			break;
		}
	}).observe(pretty_top_replay_text, {
		attributes: true,
		attributeFilter: ["style"]
	});

	// eslint-disable-next-line no-undef
	GM_addStyle(`
	#pretty_top_replay_record {
		width: 57px;
		height: 34px;
		background-image: url(../graphics/video-wireless-4.png);
		background-repeat: no-repeat;
		background-position: center;
		position: absolute;
		top: 35px;
		right: -116px;
		background-color: #273749c7;
		visibility: inherit;
	}`);
})();