// ==UserScript==
// @name         Auto Picture-in-Picture
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Automatically enables picture-in-picture mode for YouTube and Bilibili with improved Edge and Brave support
// @author       hong-tm
// @license      MIT
// @icon         https://raw.githubusercontent.com/hong-tm/blog-image/main/picture-in-picture.svg
// @match        https://www.youtube.com/*
// @match        https://www.bilibili.com/*
// @grant        GM_log
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/516762/Auto%20Picture-in-Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/516762/Auto%20Picture-in-Picture.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const DEBUG = false;
	const PERFORMANCE_MONITORING = false;

	class Logger {
		static #queue = [];
		static #batchTimeout = null;
		static #BATCH_DELAY = 100;

		static #processBatch() {
			if (this.#queue.length === 0) return;
			const messages = this.#queue.splice(0);
			if (DEBUG) {
				console.log("[PiP Debug]", ...messages);
				try {
					GM_log(...messages);
				} catch (e) {}
			}
		}

		static log(...args) {
			if (!DEBUG) return;
			this.#queue.push(...args);
			if (!this.#batchTimeout) {
				this.#batchTimeout = setTimeout(() => {
					this.#batchTimeout = null;
					this.#processBatch();
				}, this.#BATCH_DELAY);
			}
		}

		static error(...args) {
			console.error("[PiP Error]", ...args);
			try {
				GM_log("ERROR:", ...args);
			} catch (e) {}
		}
	}

	class PerformanceMonitor {
		static #metrics = new Map();
		static #enabled = PERFORMANCE_MONITORING;
		static #observer = null;

		static start(operation) {
			if (!this.#enabled) return;
			this.#metrics.set(operation, performance.now());

			// Create performance mark
			performance.mark(`${operation}-start`);
		}

		static end(operation) {
			if (!this.#enabled) return;
			const startTime = this.#metrics.get(operation);
			if (startTime) {
				const duration = performance.now() - startTime;
				Logger.log(`Performance [${operation}]: ${duration.toFixed(2)}ms`);
				this.#metrics.delete(operation);

				// Create performance measure
				performance.mark(`${operation}-end`);
				performance.measure(
					operation,
					`${operation}-start`,
					`${operation}-end`
				);
			}
		}

		static initPerformanceObserver() {
			if (!this.#enabled || this.#observer) return;

			try {
				this.#observer = new PerformanceObserver((list) => {
					list.getEntries().forEach((entry) => {
						if (entry.entryType === "measure") {
							Logger.log(
								`Performance Measure [${entry.name}]: ${entry.duration.toFixed(
									2
								)}ms`
							);
						}
					});
				});

				this.#observer.observe({ entryTypes: ["measure", "mark"] });
			} catch (e) {
				Logger.error("PerformanceObserver not supported:", e);
			}
		}

		static cleanup() {
			if (this.#observer) {
				this.#observer.disconnect();
				this.#observer = null;
			}
		}
	}

	class MediaCapabilitiesHelper {
		static async checkVideoCapabilities(video) {
			if (!("mediaCapabilities" in navigator)) return true;

			try {
				const mediaConfig = {
					type: "file",
					video: {
						contentType:
							video.videoWidth > 1920
								? 'video/webm; codecs="vp9"'
								: 'video/webm; codecs="vp8"',
						width: video.videoWidth,
						height: video.videoHeight,
						bitrate: 2000000,
						framerate: 30,
					},
				};

				const result = await navigator.mediaCapabilities.decodingInfo(
					mediaConfig
				);
				return result.supported && result.smooth && result.powerEfficient;
			} catch (e) {
				Logger.error("Media Capabilities check failed:", e);
				return true;
			}
		}
	}

	class BrowserDetector {
		static #cachedResults = new Map();
		static #browserInfo = null;

		static #initBrowserInfo() {
			if (this.#browserInfo) return;
			const ua = navigator.userAgent;
			this.#browserInfo = {
				isEdge: ua.includes("Edg/"),
				isBrave:
					window.navigator.brave?.isBrave ||
					ua.includes("Brave") ||
					document.documentElement.dataset.browserType === "brave",
				isFirefox: ua.includes("Firefox"),
				supportsDocumentPiP: "documentPictureInPicture" in window,
			};
			this.#browserInfo.isChrome =
				ua.includes("Chrome") &&
				!this.#browserInfo.isEdge &&
				!this.#browserInfo.isBrave;
			this.#browserInfo.isChromiumBased =
				this.#browserInfo.isChrome ||
				this.#browserInfo.isEdge ||
				this.#browserInfo.isBrave;
		}

		static #getCachedValue(key, computeValue) {
			if (!this.#cachedResults.has(key)) {
				this.#cachedResults.set(key, computeValue());
			}
			return this.#cachedResults.get(key);
		}

		static get isEdge() {
			this.#initBrowserInfo();
			return this.#browserInfo.isEdge;
		}

		static get isBrave() {
			this.#initBrowserInfo();
			return this.#browserInfo.isBrave;
		}

		static get isChrome() {
			this.#initBrowserInfo();
			return this.#browserInfo.isChrome;
		}

		static get isFirefox() {
			this.#initBrowserInfo();
			return this.#browserInfo.isFirefox;
		}

		static get isChromiumBased() {
			this.#initBrowserInfo();
			return this.#browserInfo.isChromiumBased;
		}

		static get supportsPictureInPicture() {
			return this.#getCachedValue(
				"supportsPictureInPicture",
				() =>
					document.pictureInPictureEnabled ||
					document.documentElement.webkitSupportsPresentationMode?.(
						"picture-in-picture"
					)
			);
		}

		static get supportsDocumentPiP() {
			this.#initBrowserInfo();
			return this.#browserInfo.supportsDocumentPiP;
		}
	}

	class VideoController {
		#isTabActive = !document.hidden;
		#isPiPRequested = false;
		#pipInitiatedFromOtherTab = false;
		#pipAttempts = 0;
		#lastVideoElement = null;
		#videoObserver = null;
		#eventListeners = new Set();
		#debounceTimers = new Map();
		#hasUserGesture = false;

		static MAX_PIP_ATTEMPTS = 3;
		static PIP_RETRY_DELAY = 500;
		static VIDEO_SELECTORS = {
			"youtube.com": [
				".html5-main-video",
				"video.video-stream",
				"#movie_player video",
			],
			"bilibili.com": [
				".bilibili-player-video video",
				"#bilibili-player video",
				"video",
			],
		};

		constructor() {
			this.#setupVideoObserver();
		}

		#debounce(fn, delay) {
			return (...args) => {
				const key = fn.toString();
				if (this.#debounceTimers.has(key)) {
					clearTimeout(this.#debounceTimers.get(key));
				}
				this.#debounceTimers.set(
					key,
					setTimeout(() => {
						this.#debounceTimers.delete(key);
						fn.apply(this, args);
					}, delay)
				);
			};
		}

		#setupVideoObserver() {
			this.#videoObserver = new MutationObserver(
				this.#debounce(() => {
					if (!this.#lastVideoElement?.isConnected) {
						this.getVideoElement().then((video) => {
							if (video && !this.#isTabActive && this.isVideoPlaying(video)) {
								this.enablePiP(true);
							}
						});
					}
				}, 200)
			);

			this.#videoObserver.observe(document.documentElement, {
				childList: true,
				subtree: true,
			});
		}

		async getVideoElement(retryCount = 0, maxRetries = 5) {
			PerformanceMonitor.start("getVideoElement");

			if (this.#lastVideoElement?.isConnected) {
				PerformanceMonitor.end("getVideoElement");
				return this.#lastVideoElement;
			}

			const domain = Object.keys(VideoController.VIDEO_SELECTORS).find((d) =>
				window.location.hostname.includes(d)
			);
			if (!domain) {
				PerformanceMonitor.end("getVideoElement");
				return null;
			}

			let video = null;
			for (const selector of VideoController.VIDEO_SELECTORS[domain]) {
				video = document.querySelector(selector);
				if (video) {
					this.#lastVideoElement = video;
					break;
				}
			}

			if (!video && retryCount < maxRetries) {
				Logger.log(
					`Video element not found, retrying... (${
						retryCount + 1
					}/${maxRetries})`
				);
				await new Promise((resolve) =>
					setTimeout(resolve, Math.min(200 * (retryCount + 1), 1000))
				);
				PerformanceMonitor.end("getVideoElement");
				return this.getVideoElement(retryCount + 1, maxRetries);
			}

			Logger.log(
				video
					? "Video element found!"
					: "Failed to find video element after retries."
			);
			PerformanceMonitor.end("getVideoElement");
			return video;
		}

		isVideoPlaying(video) {
			if (!video) return false;
			return (
				!video.paused &&
				!video.ended &&
				video.readyState > 2 &&
				video.currentTime > 0
			);
		}

		async requestPictureInPicture(video) {
			if (!video) return false;
			PerformanceMonitor.start("requestPictureInPicture");

			try {
				// Check media capabilities first
				const isCapable = await MediaCapabilitiesHelper.checkVideoCapabilities(
					video
				);
				if (!isCapable) {
					Logger.log("Video playback might not be smooth or power efficient");
				}

				// Setup media session for automatic PiP
				if ("mediaSession" in navigator) {
					try {
						navigator.mediaSession.setActionHandler(
							"enterpictureinpicture",
							async () => {
								await video.requestPictureInPicture().catch(() => {});
							}
						);

						if ("setAutoplayPolicy" in navigator.mediaSession) {
							navigator.mediaSession.setAutoplayPolicy("allowed");
						}

						// Set media session metadata for better system integration
						navigator.mediaSession.metadata = new MediaMetadata({
							title: document.title,
							artwork: [
								{
									src: document.querySelector('link[rel="icon"]')?.href || "",
									sizes: "96x96",
									type: "image/png",
								},
							],
						});
					} catch (e) {
						Logger.log("Some media session features not supported");
					}
				}

				// Handle browser-specific cases
				if (BrowserDetector.isBrave || BrowserDetector.isEdge) {
					video.focus();
					await new Promise((resolve) => setTimeout(resolve, 200));
					if (video.paused) {
						await video.play().catch(() => {});
					}
				}

				// Try to enter PiP mode
				if (document.pictureInPictureEnabled) {
					try {
						await video.requestPictureInPicture();
						Logger.log("PiP activated successfully!");
						this.#pipAttempts = 0;
						PerformanceMonitor.end("requestPictureInPicture");
						return true;
					} catch (e) {
						// If direct PiP request fails, try using media session
						if ("mediaSession" in navigator) {
							navigator.mediaSession.metadata = new MediaMetadata({
								title: document.title,
							});
							Logger.log("Attempting automatic PiP via media session");
							// Force a visibility change to trigger PiP
							this.#handleVisibilityChange();
							return true;
						}
						throw e;
					}
				} else if (video.webkitSetPresentationMode) {
					await video.webkitSetPresentationMode("picture-in-picture");
					Logger.log("Safari PiP activated successfully!");
					this.#pipAttempts = 0;
					PerformanceMonitor.end("requestPictureInPicture");
					return true;
				}
				throw new Error("PiP not supported");
			} catch (error) {
				Logger.error("PiP request failed:", error.message);
				this.#pipAttempts++;

				if (this.#pipAttempts < VideoController.MAX_PIP_ATTEMPTS) {
					Logger.log(`Retrying PiP (attempt ${this.#pipAttempts})...`);
					await new Promise((resolve) =>
						setTimeout(
							resolve,
							VideoController.PIP_RETRY_DELAY * Math.pow(1.5, this.#pipAttempts)
						)
					);
					PerformanceMonitor.end("requestPictureInPicture");
					return this.requestPictureInPicture(video);
				}
				Logger.error("Max PiP attempts reached");
				PerformanceMonitor.end("requestPictureInPicture");
				return false;
			}
		}

		async enablePiP(forceEnable = false) {
			PerformanceMonitor.start("enablePiP");
			try {
				const video = await this.getVideoElement();
				if (!video || (!forceEnable && !this.isVideoPlaying(video))) {
					Logger.log("Video not ready for PiP");
					PerformanceMonitor.end("enablePiP");
					return;
				}

				if (!document.pictureInPictureElement && !this.#isPiPRequested) {
					// Set initial state
					this.#hasUserGesture = true;
					const success = await this.requestPictureInPicture(video);
					if (success) {
						this.#isPiPRequested = true;
						this.#pipInitiatedFromOtherTab = !this.#isTabActive;
					}
					// Reset user gesture flag after attempt
					this.#hasUserGesture = false;
				}
			} catch (error) {
				Logger.error("Enable PiP error:", error);
			}
			PerformanceMonitor.end("enablePiP");
		}

		async disablePiP() {
			if (document.pictureInPictureElement && !this.#pipInitiatedFromOtherTab) {
				try {
					await document.exitPictureInPicture();
					Logger.log("PiP mode exited");
					this.#isPiPRequested = false;
					this.#pipAttempts = 0;
				} catch (error) {
					Logger.error("Exit PiP error:", error);
				}
			}
		}

		#handleVisibilityChange = this.#debounce(async () => {
			const previousState = this.#isTabActive;
			this.#isTabActive = !document.hidden;
			Logger.log(
				`Tab visibility changed: ${this.#isTabActive ? "visible" : "hidden"}`
			);

			if (previousState !== this.#isTabActive) {
				if (this.#isTabActive) {
					if (!this.#pipInitiatedFromOtherTab) {
						await this.disablePiP();
					}
				} else {
					const video = await this.getVideoElement();
					if (video && this.isVideoPlaying(video)) {
						const delay = BrowserDetector.isChromiumBased ? 200 : 0;
						setTimeout(() => this.enablePiP(true), delay);
					}
					this.#pipInitiatedFromOtherTab = false;
				}
			}
		}, 100);

		setupMediaSession() {
			if ("mediaSession" in navigator) {
				try {
					navigator.mediaSession.setActionHandler(
						"enterpictureinpicture",
						async () => {
							if (!this.#isTabActive) {
								await this.enablePiP(true);
							}
						}
					);

					if ("setAutoplayPolicy" in navigator.mediaSession) {
						navigator.mediaSession.setAutoplayPolicy("allowed");
					}

					["play", "pause", "seekbackward", "seekforward"].forEach((action) => {
						try {
							navigator.mediaSession.setActionHandler(action, null);
						} catch (e) {
							Logger.log(`${action} handler not supported`);
						}
					});

					Logger.log("Media session handlers set up");
				} catch (error) {
					Logger.log("Some media session features not supported");
				}
			}
		}

		#addEventListeners() {
			const addListener = (
				target,
				event,
				handler,
				options = { passive: true }
			) => {
				target.addEventListener(event, handler, options);
				this.#eventListeners.add({ target, event, handler });
			};

			// Track user interactions to detect user gestures
			["mousedown", "keydown", "touchstart"].forEach((eventType) => {
				addListener(document, eventType, () => {
					this.#hasUserGesture = true;
					// Reset after a short delay
					setTimeout(() => {
						this.#hasUserGesture = false;
					}, 1000);
				});
			});

			addListener(document, "visibilitychange", this.#handleVisibilityChange);

			const pipEvents = [
				[
					"enterpictureinpicture",
					() => {
						this.#pipInitiatedFromOtherTab = !this.#isTabActive;
						this.#isPiPRequested = true;
						this.#pipAttempts = 0;
						Logger.log("Entered PiP mode");
					},
				],
				[
					"leavepictureinpicture",
					() => {
						this.#isPiPRequested = false;
						this.#pipInitiatedFromOtherTab = false;
						this.#pipAttempts = 0;
						Logger.log("Left PiP mode");
					},
				],
			];

			pipEvents.forEach(([event, handler]) => {
				addListener(document, event, handler);
			});

			if (window.location.hostname.includes("youtube.com")) {
				addListener(
					window,
					"yt-navigate-finish",
					this.#debounce(async () => {
						if (!this.#isTabActive) {
							const video = await this.getVideoElement();
							if (video && this.isVideoPlaying(video)) {
								await this.enablePiP();
							}
						}
					}, 1000)
				);
			}
		}

		cleanup() {
			this.#eventListeners.forEach(({ target, event, handler }) => {
				target.removeEventListener(event, handler);
			});
			this.#eventListeners.clear();

			if (this.#videoObserver) {
				this.#videoObserver.disconnect();
				this.#videoObserver = null;
			}

			this.#debounceTimers.forEach((timer) => clearTimeout(timer));
			this.#debounceTimers.clear();

			PerformanceMonitor.cleanup();
		}

		initialize() {
			Logger.log("Initializing PiP controller...");
			PerformanceMonitor.initPerformanceObserver();
			this.#addEventListeners();
			this.setupMediaSession();

			// Force immediate visibility check and PiP attempt
			setTimeout(() => {
				this.#isTabActive = !document.hidden;
				if (!this.#isTabActive) {
					this.getVideoElement().then((video) => {
						if (video && this.isVideoPlaying(video)) {
							this.enablePiP(true);
						}
					});
				}
			}, 500);

			Logger.log("Initialization complete");
		}
	}

	// Initialize the controller
	const pipController = new VideoController();
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () =>
			pipController.initialize()
		);
	} else {
		pipController.initialize();
	}

	// Cleanup on unload
	window.addEventListener(
		"unload",
		() => {
			pipController.cleanup();
		},
		{ passive: true }
	);
})();
