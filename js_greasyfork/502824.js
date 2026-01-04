// ==UserScript==
// @name              YouTube Bỏ qua quảng cáo video tự động
// @name:en           YouTube Auto Ad Skipper
// @name:vi           YouTube Bỏ qua quảng cáo video tự động
// @name:zh-cn        YouTube 自动跳过广告
// @name:zh-tw        YouTube 自動跳過廣告
// @name:ja           YouTube 広告自動スキップ
// @name:ko           YouTube 자동 광고 건너뛰기
// @name:es           YouTube Saltar anuncios automáticamente
// @name:ru           YouTube Автоматический пропуск рекламы
// @name:id           YouTube Lewati Iklan Otomatis
// @name:hi           YouTube स्वचालित विज्ञापन स्किपर
// @namespace         http://tampermonkey.net/
// @version           2025.27.3.1
// @description       Tự động bỏ qua quảng cáo trên YouTube
// @description:en    Automatically skip ads on YouTube videos
// @description:vi    Tự động bỏ qua quảng cáo trên YouTube
// @description:zh-cn 自动跳过 YouTube 视频广告
// @description:zh-tw 自動跳過 YouTube 影片廣告
// @description:ja    YouTube動画の広告を自動的にスキップ
// @description:ko    YouTube 동영상의 광고를 자동으로 건너뛰기
// @description:es    Salta automáticamente los anuncios en videos de YouTube
// @description:ru    Автоматически пропускает рекламу в видео на YouTube
// @description:id    Otomatis melewati iklan di video YouTube
// @description:hi    YouTube वीडियो में विज्ञापनों को स्वचालित रूप से छोड़ें
// @author            RenjiYuusei
// @license           MIT
// @icon              https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match             https://*.youtube.com/*
// @grant            GM_addStyle
// @grant            GM_getValue
// @grant            GM_setValue
// @run-at           document-start
// @compatible chrome
// @compatible firefox
// @compatible edge
// @compatible safari
// @downloadURL https://update.greasyfork.org/scripts/502824/YouTube%20B%E1%BB%8F%20qua%20qu%E1%BA%A3ng%20c%C3%A1o%20video%20t%E1%BB%B1%20%C4%91%E1%BB%99ng.user.js
// @updateURL https://update.greasyfork.org/scripts/502824/YouTube%20B%E1%BB%8F%20qua%20qu%E1%BA%A3ng%20c%C3%A1o%20video%20t%E1%BB%B1%20%C4%91%E1%BB%99ng.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const DEFAULT_CONFIG = {
		allowedReloadPage: true,
		dontReloadWhileBusy: true,
		maxScrollThreshold: 200,
		adSkipDelay: 250,
		maxPlaybackRate: 16,
		maxSkipAttempts: 20,
		autoMuteAds: true,
		hideAllAds: true,
		checkInterval: 300,
		minSkipInterval: 30,
		useAggressiveSkipping: true,
	};

	class YouTubeAdSkipper {
		constructor() {
			this.video = null;
			this.currentVideoTime = 0;
			this.isTabBlurred = false;
			this.skipAttempts = 0;
			this.maxSkipAttempts = DEFAULT_CONFIG.maxSkipAttempts;
			this.lastSkipTime = 0;
			this.config = DEFAULT_CONFIG;
			this.errorCount = 0;
			this.maxErrors = 3;
			this.debounceTimeout = null;
			this.recoveryAttempts = 0;
			this.maxRecoveryAttempts = 3;
			this.recoveryTimeout = null;
			this.isAdPlaying = false;
			this.userPaused = false;
			this.lastAdCheckTime = 0;
			this.lastVerifiedAdTime = 0;
			this.lastVideoUrl = '';
			this.init();
		}

		init() {
			try {
				this.loadConfig();
				this.setupEventListeners();
				this.setupMutationObserver();

				if (this.config.hideAllAds) {
					this.addCSSHideAds();
				}

				this.skipAd();
				this.startAdCheckInterval();
			} catch (error) {
				// Bỏ qua lỗi trong quá trình khởi tạo
			}
		}

		loadConfig() {
			try {
				const savedConfig = GM_getValue('adSkipperConfig');
				if (savedConfig) {
					this.config = { ...DEFAULT_CONFIG, ...savedConfig };
				}
			} catch (error) {
				this.config = DEFAULT_CONFIG;
				this.saveConfig();
			}
		}

		saveConfig() {
			try {
				GM_setValue('adSkipperConfig', this.config);
			} catch (error) {
				// Bỏ qua lỗi khi lưu cấu hình
			}
		}

		setupEventListeners() {
			window.addEventListener('blur', () => (this.isTabBlurred = true));
			window.addEventListener('focus', () => {
				this.isTabBlurred = false;
				this.skipAd();
			});

			document.addEventListener('timeupdate', this.handleTimeUpdate.bind(this), true);

			document.addEventListener('yt-navigate-finish', () => {
				this.skipAttempts = 0;
				this.resetAdState();
				this.skipAd();
			});

			document.addEventListener('loadstart', (e) => {
				if (e.target.matches('video.html5-main-video')) {
					this.skipAttempts = 0;
					this.resetAdState();
					
					const currentUrl = window.location.href;
					if (this.lastVideoUrl !== currentUrl) {
						this.lastVideoUrl = currentUrl;
					}
					
					setTimeout(() => this.skipAd(), 100);
				}
			}, true);

			document.addEventListener(
				'pause',
				(e) => {
					if (e.target === this.video) {
						const player = document.querySelector('#movie_player');
						const isAd = this.isAdCurrentlyPlaying(player) && this.isConfirmedAd();
						
						if (isAd && this.video.paused) {
							setTimeout(() => {
								this.video.play().catch(() => {});
							}, 500);
						} else {
							this.userPaused = true;
						}
					}
				},
				true
			);
			
			document.addEventListener(
				'play',
				(e) => {
					if (e.target === this.video) {
						this.userPaused = false;
					}
				},
				true
			);
		}

		isConfirmedAd() {
			const adInfo = document.querySelector('.ytp-ad-info-dialog-container');
			const adText = document.querySelector('.ytp-ad-text');
			const adSkipButton = document.querySelector('.ytp-ad-skip-button-container, .ytp-ad-skip-button-modern');
			const adPreview = document.querySelector('.ytp-ad-preview-container');
			const adByLine = document.querySelector('.ytp-ad-byline-container');
			const videoAdUiText = document.querySelector('.videoAdUiSkipButton');
			const adPlayerOverlay = document.querySelector('.ytp-ad-player-overlay');
			
			let confirmationCount = 0;
			if (adInfo) confirmationCount++;
			if (adText) confirmationCount++;
			if (adSkipButton) confirmationCount++;
			if (adPreview) confirmationCount++;
			if (adByLine) confirmationCount++;
			if (videoAdUiText) confirmationCount++;
			if (adPlayerOverlay) confirmationCount++;
			
			const player = document.querySelector('#movie_player');
			if (player && player.classList.contains('ad-showing')) {
				confirmationCount += 2;
			}
			
			return confirmationCount >= 2;
		}

		resetAdState() {
			this.isAdPlaying = false;
			this.skipAttempts = 0;
			this.lastAdCheckTime = 0;
			this.lastVerifiedAdTime = 0;
		}

		handleTimeUpdate(e) {
			if (e.target.matches('video.html5-main-video')) {
				const player = document.querySelector('#movie_player');
				
				const isAd = player && this.isAdCurrentlyPlaying(player) && this.isConfirmedAd();
				
				if (!isAd) {
					this.currentVideoTime = e.target.currentTime;
				} else if (this.config.useAggressiveSkipping) {
					const now = Date.now();
					if (now - this.lastAdCheckTime > 1000) {
						this.lastAdCheckTime = now;
						this.skipAd();
					}
				}
			}
		}

		setupMutationObserver() {
			const observer = new MutationObserver((mutations) => {
				if (this.isTabBlurred) return;

				const adRelatedChange = mutations.some(mutation => {
					if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
						return mutation.target.classList.contains('ad-showing') || 
							mutation.target.classList.contains('ytp-ad-player-overlay');
					}
					
					if (mutation.type === 'childList' && mutation.addedNodes.length) {
						for (const node of mutation.addedNodes) {
							if (node.nodeType === 1) {
								if (node.classList && (
									node.classList.contains('ad-showing') || 
									node.classList.contains('ytp-ad-player-overlay') ||
									node.querySelector('.ad-showing, .ytp-ad-player-overlay')
								)) {
									return true;
								}
							}
						}
					}
					
					return false;
				});

				if (adRelatedChange) {
					this.skipAd();
				} else {
					clearTimeout(this.debounceTimeout);
					this.debounceTimeout = setTimeout(() => {
						this.skipAd();
					}, 100);
				}
			});

			const observeBody = () => {
				if (document.body) {
					observer.observe(document.body, {
						attributes: true,
						attributeFilter: ['class', 'src', 'style'],
						childList: true,
						subtree: true,
					});
				} else {
					setTimeout(observeBody, 50);
				}
			};

			observeBody();
		}

		startAdCheckInterval() {
			setInterval(() => {
				if (!this.isTabBlurred) {
					this.skipAd();
				}
			}, this.config.checkInterval);
		}

		async skipAd() {
			try {
				if (window.location.pathname.startsWith('/shorts/')) return;

				const player = document.querySelector('#movie_player');
				if (!player) return;

				const hasAd = this.isAdCurrentlyPlaying(player);
				const isConfirmedAd = hasAd && this.isConfirmedAd();
				
				this.isAdPlaying = isConfirmedAd;

				this.video = player.querySelector('video.html5-main-video');

				if (isConfirmedAd && this.video && !this.userPaused) {
					this.lastVerifiedAdTime = Date.now();
					await this.handleVideoAd();
					this.handlePrerollAds();
				} else if (!hasAd) {
					this.skipAttempts = 0;
					this.isAdPlaying = false;
				}

				this.removeAdBlockerWarnings();
				this.removeShortVideoAds();
				this.removeOverlayAds();
				this.handleSponsoredItems();
			} catch (error) {
				this.errorCount++;
				if (this.errorCount >= this.maxErrors) {
					await this.attemptRecovery();
				}
			}
		}

		isAdCurrentlyPlaying(player) {
			if (!player) return false;
			
			if (player.classList.contains('ad-showing')) return true;
			
			const adSelectors = [
				'.ytp-ad-player-overlay',
				'.ad-showing',
				'.ytp-ad-skip-button-slot',
				'.ytp-ad-preview-container',
				'.ytp-ad-skip-button-modern',
				'.ytp-ad-text-overlay',
				'.ytp-ad-feedback-dialog-container',
				'[id^="ad-placeholder"]'
			];
			
			return adSelectors.some(selector => document.querySelector(selector) !== null);
		}

		async handleVideoAd() {
			const now = Date.now();
			if (now - this.lastSkipTime < this.config.minSkipInterval) return;
			this.lastSkipTime = now;

			this.clickSkipButtons();

			if (this.isAdPlaying && this.video && this.video.src && 
				now - this.lastVerifiedAdTime < 3000) {
				this.video.currentTime = this.video.duration || 9999;
				this.video.playbackRate = this.config.maxPlaybackRate;
				
				if (this.config.autoMuteAds) {
					this.video.muted = true;
					this.video.volume = 0;
				}
				
				if (this.config.useAggressiveSkipping) {
					const adElement = document.querySelector('.html5-video-container');
					if (adElement && this.isConfirmedAd()) {
						adElement.style.visibility = 'hidden';
					}
				}
			}

			if (this.skipAttempts < this.maxSkipAttempts && this.isAdPlaying) {
				this.skipAttempts++;
				await new Promise(resolve => setTimeout(resolve, this.config.adSkipDelay));
				this.skipAd();
			}
		}

		clickSkipButtons() {
			const skipButtonSelectors = [
				'.ytp-skip-ad-button', 
				'.ytp-ad-skip-button', 
				'.ytp-ad-skip-button-modern', 
				'.ytp-ad-survey-answer-button', 
				'.ytp-ad-skip-button-container button', 
				'[class*="skip-button"]', 
				'[class*="skipButton"]', 
				'.videoAdUiSkipButton', 
				'.ytp-ad-preview-container button',
				'.ytp-ad-skip-button-container',
				'.ytp-ad-skip-button-modern-container',
				'button[class*="skip"]',
				'[data-tooltip-content="Skip Ad"]',
				'[aria-label*="Skip Ad"]',
				'[aria-label*="Skip Ads"]',
				'[data-title-no-tooltip*="Skip Ad"]'
			];

			skipButtonSelectors.forEach(selector => {
				const buttons = document.querySelectorAll(selector);
				buttons.forEach(button => {
					if (button && button.offsetParent !== null) {
						button.click();
					}
				});
			});
			
			const adContainers = document.querySelectorAll('.ytp-ad-module, .ytp-ad-action-interstitial');
			adContainers.forEach(container => {
				if (container) {
					const allButtons = container.querySelectorAll('button');
					allButtons.forEach(button => {
						if (button && button.offsetParent !== null) {
							button.click();
						}
					});
				}
			});
		}

		removeAdBlockerWarnings() {
			const warningSelectors = [
				'tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model)', 
				'.yt-playability-error-supported-renderers:has(.ytd-enforcement-message-view-model)', 
				'ytd-enforcement-message-view-model', 
				'.ytd-popup-container',
				'tp-yt-paper-dialog.ytd-popup-container',
				'ytd-enforcement-message-view-model',
				'ytd-watch-flexy[player-unavailable]',
				'div#error-screen',
				'div.ytd-player-error-message-renderer',
				'div.ytp-error'
			];

			warningSelectors.forEach(selector => {
				const warning = document.querySelector(selector);
				if (warning) {
					if (selector.includes('playability-error') && this.checkCanReloadPage()) {
						this.reloadPage();
					}
					warning.remove();
				}
			});
		}

		removeShortVideoAds() {
			const shortAdSelectors = [
				'ytd-reel-video-renderer:has(.ytd-ad-slot-renderer)', 
				'ytd-in-feed-ad-layout-renderer', 
				'ytd-promoted-video-renderer',
				'ytd-compact-promoted-video-renderer',
				'ytd-display-ad-renderer',
				'ytd-brand-video-singleton-renderer',
				'ytd-brand-video-shelf-renderer',
				'ytd-statement-banner-renderer',
				'ytd-video-masthead-ad-v3-renderer',
				'ytd-ad-badge-renderer',
				'ytd-promoted-sparkles-web-renderer',
				'ytd-banner-promo-renderer',
				'ytd-promoted-rising-renderer',
				'ytd-carousel-ad-renderer',
				'ytd-shopping-companion-ad-renderer',
				'div#masthead-ad',
				'#player-ads',
				'div.ytd-mealbar-promo-renderer',
				'ytm-promoted-video-renderer'
			].join(',');

			document.querySelectorAll(shortAdSelectors).forEach(ad => ad.remove());
		}

		removeOverlayAds() {
			const overlayAdSelectors = [
				'.ytp-ad-overlay-container', 
				'.ytp-ad-text-overlay', 
				'.ytp-ad-overlay-slot', 
				'div[id^="ad-overlay"]', 
				'.video-ads', 
				'.ytp-ad-overlay-image', 
				'.ytp-ad-text-overlay-container',
				'.ytp-ad-overlay-ad-info-button-container',
				'.ytp-ad-overlay-close-container',
				'.ytp-ad-overlay-slot',
				'.yt-mealbar-promo-renderer',
				'.yt-tooltip-renderer', 
				'.iv-promo',
				'#companion',
				'#player-overlay:has(.ytp-ad-overlay-container)',
				'#offer-module'
			].join(',');

			document.querySelectorAll(overlayAdSelectors).forEach(ad => {
				if (ad) {
					ad.style.display = 'none';
					ad.remove();
				}
			});
		}

		handleSponsoredItems() {
			const sponsoredSelectors = [
				'ytd-item-section-renderer:has(span:contains("Sponsored"))',
				'ytd-item-section-renderer:has(span:contains("Quảng cáo"))',
				'ytd-item-section-renderer:has(span:contains("広告"))',
				'ytd-item-section-renderer:has(span:contains("广告"))',
				'ytd-rich-item-renderer:has([id="ad-badge"])',
				'ytd-compact-promoted-item-renderer',
				'ytd-search ytd-video-renderer:has(div#badge)',
				'ytd-browse ytd-rich-item-renderer:has(ytd-display-ad-renderer)',
				'ytd-browse ytd-rich-item-renderer:has(ytd-ad-slot-renderer)'
			];
			
			sponsoredSelectors.forEach(selector => {
				try {
					document.querySelectorAll(selector).forEach(item => item.remove());
				} catch (e) {
					// Bỏ qua lỗi selector không hợp lệ
				}
			});
		}

		checkCanReloadPage() {
			if (!this.config.allowedReloadPage) return false;
			if (!this.config.dontReloadWhileBusy) return true;
			if (document.activeElement?.matches('input, textarea, select')) return false;
			if (document.documentElement.scrollTop > this.config.maxScrollThreshold) return false;
			if (this.isTabBlurred) return false;
			return true;
		}

		reloadPage() {
			const params = new URLSearchParams(location.search);
			if (this.currentVideoTime > 0) {
				params.set('t', Math.floor(this.currentVideoTime) + 's');
			}
			location.replace(`${location.origin}${location.pathname}?${params.toString()}`);
		}

		addCSSHideAds() {
			const styles = `
                #player-ads,
                #masthead-ad,
                ytd-ad-slot-renderer,
                ytd-rich-item-renderer:has(.ytd-ad-slot-renderer),
                ytd-rich-section-renderer:has(.ytd-statement-banner-renderer),
                ytd-reel-video-renderer:has(.ytd-ad-slot-renderer),
                tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model),
                tp-yt-paper-dialog:has(> ytd-checkbox-survey-renderer),
                .ytp-suggested-action,
                .yt-mealbar-promo-renderer,
                ytmusic-mealbar-promo-renderer,
                ytmusic-statement-banner-renderer,
                .ytd-display-ad-renderer,
                .ytd-statement-banner-renderer,
                .ytd-in-feed-ad-layout-renderer,
                .ytp-ad-overlay-container,
                .ytp-ad-text-overlay,
                ytd-promoted-sparkles-web-renderer,
                ytd-promoted-video-renderer,
                .ytd-banner-promo-renderer,
                .ytd-video-masthead-ad-v3-renderer,
                .ytd-primetime-promo-renderer,
                .ytp-ad-skip-button-slot,
                .ytp-ad-preview-slot,
                .ytp-ad-message-slot,
                .ytp-ad-overlay-ad-info-button-container,
                .ytp-ad-survey-interstitial,
                ytd-in-feed-ad-layout-renderer,
                ytd-ad-slot-renderer,
                ytd-brand-video-singleton-renderer,
                ytd-compact-promoted-video-renderer,
                ytd-display-ad-renderer,
                ytd-banner-promo-renderer,
                ytd-statement-banner-renderer,
                ytd-brand-video-shelf-renderer,
                ytd-promoted-sparkles-web-renderer,
                ytd-ad-feedback-dialog-renderer,
                [class*="ytd-ad-badge-renderer"],
                ytd-ad-badge-renderer,
                div.ytp-ad-overlay-container,
                div.ytp-ad-text-overlay,
                div.ytp-ad-button-overlay,
                div#masthead-ad,
                div#offer-module,
                div#player-ads,
                ytd-item-section-renderer:has(ytd-ad-slot-renderer),
                .ytd-companion-slot-renderer,
                .ytd-action-companion-ad-renderer,
                .ytd-watch-next-secondary-results-renderer.ytd-item-section-renderer:has(.ytd-ad-slot-renderer),
                ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"],
                #related #items ytd-compact-promoted-video-renderer,
                .ytd-carousel-ad-renderer {
                    display: none !important;
                }
                
                .html5-video-player.ad-showing .video-stream[src*="blob"] {
                    visibility: hidden !important;
                }
                
                .html5-video-player:not(.ad-showing) .video-stream {
                    visibility: visible !important;
                }
            `;
			GM_addStyle(styles);
		}

		handlePrerollAds() {
			const prerollContainer = document.querySelector('.ytp-ad-preview-container');
			if (prerollContainer && this.isAdPlaying && this.isConfirmedAd()) {
				this.video.currentTime = this.video.duration || 9999;
				this.video.playbackRate = this.config.maxPlaybackRate;
			}
		}

		async attemptRecovery() {
			if (this.recoveryAttempts >= this.maxRecoveryAttempts) return;

			this.recoveryAttempts++;

			clearTimeout(this.recoveryTimeout);
			this.recoveryTimeout = setTimeout(() => {
				this.errorCount = 0;
				this.skipAttempts = 0;
				this.resetAdState();
				this.init();
				this.recoveryAttempts = 0;
			}, 5000 * this.recoveryAttempts);
		}
	}

	new YouTubeAdSkipper();
})();
