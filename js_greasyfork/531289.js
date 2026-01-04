// ==UserScript==
// @name         Tellonym Answer Revealer
// @namespace    https://spin.rip/
// @match        https://tellonym.me/*
// @grant        none
// @version      1.1
// @author       Spinfal
// @description  Reveals the answers on a Tellonym user's page without logging in.
// @license      AGPL-3.0 License
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531289/Tellonym%20Answer%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/531289/Tellonym%20Answer%20Revealer.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// ✅ create status window
	const statusDiv = document.createElement("div");
	statusDiv.style.display = "block";
	statusDiv.style.position = "fixed";
	statusDiv.style.bottom = "10px";
	statusDiv.style.right = "10px";
	statusDiv.style.backgroundColor = "#1c1c1e";
	statusDiv.style.color = "#fff";
	statusDiv.style.padding = "10px";
	statusDiv.style.borderRadius = "10px";
	statusDiv.style.fontSize = "12px";
	statusDiv.style.fontFamily = "monospace";
	statusDiv.style.zIndex = "9999";
	statusDiv.innerText = "🔎 waiting for profile data...";
	document.documentElement.appendChild(statusDiv);

	let mainDiv;
	const targetSelector = "#root > div > div > div.css-1dbjc4n.r-150rngu.r-eqz5dr.r-16y2uox.r-1wbh5a2.r-11yh6sk.r-1rnoaur > div > div";

	// 👀 setup mutation observer to detect when mainDiv becomes available
	const observer = new MutationObserver(() => {
		const foundDiv = document.querySelector(targetSelector);
		if (foundDiv) {
			mainDiv = foundDiv;
			console.log("✅ mainDiv found");
			observer.disconnect();
		}
	});

	observer.observe(document.documentElement, { childList: true, subtree: true });

	const originalFetch = window.fetch;
	let capturedUserId = null;

	window.fetch = async function(input, init = {}) {
		const urlStr = typeof input === "string" ? input : input.url;
		const method = init?.method?.toUpperCase() || "GET";

		let urlObj;
		try {
			// handle relative urls like /api/profiles/name/...
			urlObj = new URL(urlStr, location.origin);
		} catch {
			return originalFetch.call(this, input, init);
		}

		const pathname = urlObj.pathname || "";

		const isProfileEndpoint =
			pathname.startsWith("/api/profiles/name/");

		const isFollowingsEndpoint =
			pathname.startsWith("/api/followings/id/");

		if (isProfileEndpoint && method === "GET" && !location.href.includes("/followings")) {
			updateStatus("📡 intercepted profile fetch");
			const response = await originalFetch.call(this, input, init);

			try {
				const cloned = response.clone();
				const json = await cloned.json();

				if (json?.id) {
					capturedUserId = json.id;
					updateStatus(`🧐 captured userId: ${capturedUserId}`);
				}

				if (json && typeof json === "object") {
					json.isAbleToComment = true;
					json.isTellsOnlyFromRegistered = false;
					json.followingCount === 0 ? json.followingCount = 1 : json.followingCount++;
					localStorage.setItem("reduxPersist:user", JSON.stringify({ hasLoggedIn: true }));
					updateStatus("✅ modified values");
				}

				if (json.answers) {
					updateStatus("⌛ waiting for tellonym to finish DOM changes...");

					setTimeout(() => {
						const freshMainDiv = document.querySelector(targetSelector);

						if (freshMainDiv) {
							const cNodes = Array.from(freshMainDiv.childNodes).slice(1);
							cNodes.forEach(i => i.remove());

							json.answers.forEach(ans => {
								const newTellDiv = document.createElement("div");
								newTellDiv.classList.add("css-1dbjc4n");
								newTellDiv.innerHTML = `
									<div data-radium="true" style="display: flex; flex-direction: column;">
										<div class="rmq-3ca56ea3" data-radium="true" style="padding: 16px; display: flex; flex-direction: column; margin-bottom: 8px; background-color: rgb(255, 255, 255);">
											<div data-radium="true" style="display: flex; flex-direction: row; justify-content: space-between;">
												<div data-radium="true" style="display: flex; flex-direction: row; align-items: center;">
													<div data-radium="true" style="cursor: pointer; color: rgb(20, 23, 26); display: flex; flex-direction: column; border-radius: 8px; overflow: hidden; background-color: rgb(255, 255, 255);">
														<div data-radium="true" style="display: flex; flex-direction: column; position: relative;">
															<img alt="" src="https://userimg.tellonym.me/xs-v2/${json.avatarFileName}" resizemode="stretch" data-radium="true" style="justify-content: center; align-items: center; height: 38px; width: 29px;">
														</div>
													</div>
													<div data-radium="true" style="display: flex; flex-direction: column; margin-left: 12px;">
														<div data-radium="true" style="cursor: pointer; color: rgb(20, 23, 26); display: flex; flex-direction: row; max-width: 200px; margin-bottom: 2px;">
															<div italic="false" data-radium="true" style="color: rgb(20, 23, 26); font-size: 14px; font-weight: bold; overflow-wrap: break-word; white-space: pre-wrap; word-break: break-word;">${json.username}</div>
														</div>
														<div data-radium="true" style="color: rgb(175, 175, 179); font-size: 12px; overflow-wrap: break-word; white-space: pre-wrap; word-break: break-word;">${timeAgo(ans.createdAt)}</div>
													</div>
												</div>
											</div>
											<div data-radium="true" style="display: ${ans.type === 1 ? "none;" : "flex; flex-direction: column; margin-top: 12px;"}">
												<div data-radium="true" style="display: flex; flex-direction: row; border-left: 3px solid rgb(136, 137, 143); padding-left: 12px;">
													<div data-radium="true" style="display: flex; flex-direction: column;">
														<div data-radium="true" style="color: rgb(20, 23, 26); font-size: 16px; white-space: pre-wrap; word-break: break-word;">${ans.tell}</div>
													</div>
												</div>
											</div>
											<div data-radium="true" style="margin-top: 12px;">
												<div data-radium="true" style="font-size: 16px; color: rgb(20, 23, 26); white-space: pre-wrap; word-break: break-word;">${ans.answer}</div>
											</div>
											<div data-radium="true" style="margin-top: 6px; font-size: 12px; color: #5264af; opacity: 0.5;">
												<p>${ans.type === 1 ? "no tell available for this one" : 'answers revealed by <a href="https://out.spin.rip/home" target="_blank">spin.rip</a>'}</p>
											</div>
										</div>
									</div>
								`.trim();

								freshMainDiv.appendChild(newTellDiv);
							});

							updateStatus("✅ tells inserted!");
						} else {
							updateStatus("⚠️ mainDiv not found");
						}
					}, 3000);
				}

				return new Response(JSON.stringify(json), {
					status: response.status,
					statusText: response.statusText,
					headers: response.headers
				});
			} catch (err) {
				console.warn("❌ error parsing profile JSON:", err);
				updateStatus("❌ error while handling profile data");
				return response;
			}
		}

		if (isFollowingsEndpoint && method === "GET") {
			const response = await originalFetch.call(this, input, init);

			try {
				const cloned = response.clone();
				const json = await cloned.json();

				if (json && Array.isArray(json.followings)) {
					const spinEntry = {
						type: 0,
						id: 113589800,
						avatarFileName: "113589800_cukoc7ico5u4ro3gveqzwf8cgbdbagei.jpg",
						displayName: "spin.rip",
						username: "spin.rip",
						isFollowingAnonymous: false,
						aboutMe: "revealed by spin // i see all",
						isVerified: true,
						isBlocked: false,
						isBlockedBy: false,
						isFollowed: true,
						isFollowedBy: true,
						isActive: true
					};

					json.followings.unshift(spinEntry);
					console.log("🧪 injected spin.rip into followings");
				}

				return new Response(JSON.stringify(json), {
					status: response.status,
					statusText: response.statusText,
					headers: response.headers
				});
			} catch (err) {
				console.warn("❌ error modifying followings JSON:", err);
				return response;
			}
		}

		return originalFetch.call(this, input, init);
	};

	function updateStatus(msg) {
		if (msg === "CLEAR") statusDiv.style.display = "none";
		statusDiv.innerText = msg;
	}

	function timeAgo(isoString) {
		const now = new Date();
		const then = new Date(isoString);
		const seconds = Math.floor((now - then) / 1000);

		if (seconds < 60) return "just now";
		if (seconds < 3600) return `${Math.floor(seconds / 60)} minute(s) ago`;
		if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour(s) ago`;
		if (seconds < 604800) return `${Math.floor(seconds / 86400)} day(s) ago`;

		return then.toLocaleDateString();
	}
})();