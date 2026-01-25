// ==UserScript==
// @name         FoolFuuka Video Player + External Sounds
// @namespace    kwlNjR37xBCMkr76P5eKA88apmOClCfZ
// @version      0016
// @description  sounds player script for 4chan archive websites
// @author       soundboy_1459944
// @website      https://greasyfork.org/en/scripts/546929
// @match        *://*.b4k.co/*
// @match        *://*.b4k.dev/*
// @match        *://*.desuarchive.org/*
// @match        *://*.palanq.win/*
// @match        *://*.4plebs.org/*
// @match        *://*.archiveofsins.com/*
// @match        *://*.fireden.net/*
// @match        *://*.thebarchive.com/*
// @connect      4chan.org
// @connect      4channel.org
// @connect      a.4cdn.org
// @connect      8chan.moe
// @connect      8chan.se
// @connect      desu-usergeneratedcontent.xyz
// @connect      arch-img.b4k.co
// @connect      archive-media-0.nyafuu.org
// @connect      4cdn.org
// @connect      a.pomf.cat
// @connect      pomf.cat
// @connect      litter.catbox.moe
// @connect      files.catbox.moe
// @connect      catbox.moe
// @connect      share.dmca.gripe
// @connect      z.zz.ht
// @connect      z.zz.fo
// @connect      zz.ht
// @connect      too.lewd.se
// @connect      lewd.se
// @connect      b4k.co
// @connect      b4k.dev
// @connect      arch.b4k.co
// @connect      arch.b4k.dev
// @connect      desuarchive.org
// @connect      palanq.win
// @connect      4plebs.org
// @connect      archiveofsins.com
// @connect      fireden.net
// @connect      thebarchive.com
// @connect      *
// @grant        GM.getValue
// @grant        GM.setValue
// @license      CC0 1.0
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGRlZnM+PHBhdGggaWQ9ImEiIGQ9Ik02LjAzMiA1LjYzNHYxMi43MzJhLjc5Ni43OTYgMCAwIDAgMS4yMTIuNjc5bDEwLjM0Ni02LjM2N2EuNzk2Ljc5NiAwIDAgMCAwLTEuMzU2TDcuMjQ0IDQuOTU2YS43OTUuNzk1IDAgMCAwLTEuMjEyLjY3OFoiLz48L2RlZnM+PHBhdGggZD0iTTE5LjkxLjVIMy45M0EzLjQxIDMuNDEgMCAwIDAgLjUgMy45M3YxNS45OWMwIDEuOSAxLjUyIDMuNDMgMy40MyAzLjQzaDE1Ljk5YzEuOSAwIDMuNDMtMS41MiAzLjQzLTMuNDNWMy45M2MwLTEuOS0xLjUyLTMuNDMtMy40My0zLjQzWiIgc3R5bGU9ImZpbGw6IzBhMWUxZTtzdHJva2U6I2ZmZiIvPjx1c2UgaHJlZj0iI2EiIHN0eWxlPSJmaWxsOiMwYTFlMWU7c3Ryb2tlOiNmZmY7c3Ryb2tlLXdpZHRoOjNweCIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/546929/FoolFuuka%20Video%20Player%20%2B%20External%20Sounds.user.js
// @updateURL https://update.greasyfork.org/scripts/546929/FoolFuuka%20Video%20Player%20%2B%20External%20Sounds.meta.js
// ==/UserScript==

const isFoolFuuka = document.querySelector('meta[name="generator"][content*="FoolFuuka"]');
let counter = 0;
let globalSettingsStorage = null;
const DEFAULT_MEDIA_INITIAL_WIDTH = 350;
const DEFAULT_MEDIA_INITIAL_HEIGHT = 350;
const DEFAULT_SCROLL_INTO_VIEW_BEHAVIOUR = 'instant'; //smooth
const DEFAULT_FLOATING_BUTTONS_LIST_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2h4.5l-3.4 5.3H8.4L11.9 2zM3.5 3.5C4.7 2.2 6.6 2 10 2L6.6 7.3H2.1c.2-1.8.5-3 1.4-3.8"/><path fill="currentColor" fill-rule="evenodd" d="M2 12V8.7h20V12c0 4.7 0 7-1.5 8.5C19.1 22 16.7 22 12 22s-7 0-8.5-1.5C2 19.1 2 16.7 2 12m11 .6c1.3.8 2 1.3 2 1.9s-.7 1-2 2c-1.3.8-2 1.2-2.5.9-.5-.3-.5-1.2-.5-2.9s0-2.6.5-2.9 1.2.1 2.5 1" clip-rule="evenodd"/><path fill="currentColor" d="M21.9 7.3c-.2-1.8-.5-3-1.4-3.8-.6-.6-1.3-1-2.3-1.2l-3.3 5z"/></svg>';
const DEFAULT_FLOATING_BUTTONS_SETTINGS_ICON = '️<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="-0.5 -0.5 9 9"><path fill="currentColor" d="M3.5 0 3 1.2l-.3.1L1.5.8l-.7.7.5 1.2-.1.3-1.2.5v1l1.2.5.1.3-.5 1.2.7.7 1.2-.5.3.1.5 1.2h1L5 6.8l.3-.1 1.2.5.7-.7-.5-1.2.1-.3L8 4.5v-1L6.8 3l-.1-.3.5-1.2-.7-.7-1.2.5-.3-.1L4.5 0zM4 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3"/></svg>';
const DEFAULT_LIST_IMAGE_ICON = '🖼️';
const DEFAULT_LIST_VIDEO_ICON = '🎬';
const DEFAULT_LIST_SOUND_ICON = '🔊';
const DEFAULT_IF_EXTERNAL_SOUND_IS_VIDEO_TREAT_IT_AS_VIDEO = false;
const DEFAULT_DURATION_MATCH_TOLERANCE_FOR_SYNC = 2; // seconds
const DEFAULT_LIST_ITEM_FORMAT = 'icon post-id ▪ post-name';
const SUPPORTED_VIDEO_EXTS = ['.webm', '.mp4'];
const SUPPORTED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif'];
const SUPPORTED_EXTS = SUPPORTED_VIDEO_EXTS.concat(SUPPORTED_IMAGE_EXTS);
const postFileFilenameSelectors = SUPPORTED_EXTS.map(ext =>`.post_file_filename[href$="${ext}"]`).join(', ');
const threadImageLinkSelectors = SUPPORTED_EXTS.map(ext =>`.thread_image_link[href$="${ext}"]`).join(', ');
const videoFileExtRE = /\.(webm|mp4|m4v|ogv|avi|mpeg|mpg|mpe|m1v|m2v|mov|wmv)$/i;
const audioFileExtRE = /\.(mp3|m4a|m4b|flac|ogg|oga|opus|mp2|mpega|wav|aac)$/i;
const loadingStates = new Map();
const mediaErrors = new Map();
window.mainElement;

(function () {
	'use strict';

	// Store all media items for the list
	const mediaItems = [];

	function createElement(html, parent, events = {}) {
		const container = document.createElement('div');
		container.innerHTML = html;
		const el = container.children[0];
		parent && parent.appendChild(el);
		for (let event in events) {
			el.addEventListener(event, events[event]);
		}
		return el;
	};

	// ################################################################################################
	//					STYLE
	// ################################################################################################

	const div = createElement(`<div class="post_wrapper"></div>`, document.body);
	const style_post_wrapper = document.defaultView.getComputedStyle(div);

	const div2 = createElement(`<div id="footer"></div>`, document.body);
	const style_footer = document.defaultView.getComputedStyle(div2);

	// CSS Styles
	const styles = `
	#fvp-floating-buttons-wrapper {
		position: relative;
		position: fixed !important;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	#fvp-media-list-toggle-btn {
		display: flex;
		background-color: ${style_post_wrapper.backgroundColor};
		border: 2px solid ${style_post_wrapper.color};
		color: ${style_post_wrapper.color};
		font-size: 12px;
		text-decoration: none;
		border-radius: 8px;
		padding: 6px 8px 7px 7px;
		align-items: center;
		justify-content: center;
		/*flex-direction: column;*/
		line-height: 1.4;
	}
	#fvp-media-list-toggle-btn:hover {
		background-color: white !important;
		border: 2px solid black !important;
		color: black !important;
		filter: drop-shadow(0 0 0.15rem white);
		cursor: pointer;
	}
	#fvp-settings-btn,
	#fvp-floating-buttons-wrapper[data-position*="top-right"] #fvp-settings-btn,
	#fvp-floating-buttons-wrapper[data-position*="bottom-right"] #fvp-settings-btn {
		background-color: ${style_post_wrapper.backgroundColor};
		border: 2px solid ${style_post_wrapper.color};
		color: ${style_post_wrapper.color};
		position: absolute;
		top: 0;
		right: 0;
		left: auto;
		bottom: auto;
		transform: translate(50%, -50%);
		font-size: 8px;
		text-decoration: none;
		padding: 0 3px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		/*flex-direction: column;*/
		line-height: 2.1;
	}
	#fvp-floating-buttons-wrapper[data-position*="top-left"] #fvp-settings-btn,
	#fvp-floating-buttons-wrapper[data-position*="bottom-left"] #fvp-settings-btn {
		top: 0;
		right: auto;
		left: 0;
		bottom: auto;
		transform: translate(-50%, -50%);
	}
	#fvp-settings-btn:hover {
		background-color: white !important;
		border: 2px solid black !important;
		color: black !important;
		filter: drop-shadow(0 0 0.15rem white);
		cursor: pointer;
	}

	.fvp-draggable-window {
		position: fixed;
		z-index: 1;
		width: 400px;
		min-width: 230px;
		min-height: 150px;
		color: ${style_post_wrapper.color};
		background-color: ${style_post_wrapper.backgroundColor};
		border: 1px solid gray;
		border-radius: 5px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
		overflow: hidden;
		resize: both;
		display: flex;
		flex-direction: column;
		scrollbar-color: ${style_footer.backgroundColor} ${style_post_wrapper.backgroundColor};
	}

	.fvp-draggable-window.fvp-draggable-window-list {
		width: 400px;
		height: 400px;
	}

	.fvp-draggable-window-titlebar {
		padding: 3px 4px 3px 8px;
		background-color: ${style_footer.backgroundColor};
		color: ${style_footer.color};
		cursor: move;
		display: flex;
		justify-content: space-between;
		align-items: center;
		user-select: none;
	}
	.fvp-draggable-window-footer {
		padding: 8px;
		background-color: ${style_footer.backgroundColor};
		/*background: linear-gradient(135deg, ${style_footer.backgroundColor} 0%, ${style_footer.backgroundColor} 94%, ${style_footer.color} 95%);*/
		color: ${style_footer.color};
		cursor: move;
		display: flex;
		justify-content: space-between;
		align-items: center;
		user-select: none;
		font-size: 5px;
	}

	.fvp-draggable-window-title {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 10px;
		font-weight: bold;
		color: ${style_footer.color} !important;
	}
	a.fvp-draggable-window-title:hover {
		padding-right: 3px;
		text-shadow: 0 0 0.5px ${style_post_wrapper.backgroundColor};
		font-style: oblique;
	}

	.fvp-draggable-window-close {
		background: none;
		border: none;
		color: ${style_footer.color} !important;
		cursor: pointer;
		font-size: 16px;
		padding: 0 5px;
		margin-left: 25px;
		text-decoration: none;
	}
	.fvp-draggable-window-close:hover {
		text-shadow: 0 0 1px ${style_footer.color};
		text-decoration: none;
	}

	.fvp-draggable-window-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: hidden;
	}
	.fvp-draggable-window-list .fvp-draggable-window-content {
		flex: 1;
		overflow-y: scroll;
	}

	.fvp-media-container {
		text-align: center;
		justify-items: center;
		justify-content: center;
		position: relative;
		align-items: center;
		object-fit: contain;
		scrollbar-color: ${style_footer.backgroundColor} ${style_post_wrapper.backgroundColor};
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: hidden;
	}
	.fvp-media-container-inline {
		text-align: center;
		justify-content: center;
		position: relative;
		align-items: center;
		margin-top: 5px;
		resize: both;
		object-fit: contain;
		/*width: ${DEFAULT_MEDIA_INITIAL_WIDTH}px;*/
		min-width: 240px;
		min-height: 180px;
		scrollbar-color: ${style_footer.backgroundColor} ${style_post_wrapper.backgroundColor};
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.fvp-media-player {
		align-items: center;
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: hidden;
		position: relative;
		width: 100%;
		height: 100%;
	}
	.fvp-media-player img, .fvp-media-player video {
		display: flex;
		flex: 1 1 auto; /* Grow and shrink as needed */
		width: 100%;
		height: 100%;
		object-fit: contain;
		min-height: 0; /* Important for flex item shrinking */
	}
	.fvp-draggable-window-content .fvp-media-player img, .fvp-media-player video {
		object-fit: contain !important;
	}
	.fvp-media-player audio {
		display: flex;
		width: 100%;
		max-height: 40px;
		flex: 0 0 auto; /* Don't grow or shrink */
		margin-top: auto;
		color-scheme: dark;
	}
	.fvp-media-player audio::-webkit-media-controls-enclosure {
		border-radius: 0;
	}

	.fvp-play-button {
		padding: 0px 4px !important;
		border: 1px solid #cccccc;
		cursor: pointer;
		font-size: 9px !important;
		font-weight: bold;
	}
	.fvp-play-button:hover {
		border: 1px solid ${style_post_wrapper.color};
	}
	.fvp-play-button-draggable {
		padding: 0px 2.5px !important;
		border: 1px solid #cccccc;
		cursor: pointer;
		font-size: 9px !important;
		font-weight: bold;
	}
	.fvp-play-button-draggable:hover {
		border: 1px solid ${style_post_wrapper.color};
	}

	/* Media List Styles */
	.fvp-media-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.fvp-media-list-item:first-child {
		border-top: 1px solid gray;
		margin: 1px 0 0 0;
	}
	.fvp-media-list-item:last-child {
		margin: 0 0 10px 0;
	}
	.fvp-media-list-item {
		padding: 8px 12px;
		border-bottom: 1px solid gray;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		/*flex-direction: column;*/
	}
	.fvp-media-list-item:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
	.fvp-media-list-item-icon {
		width: 34px;
		/*height: 16px;*/
		flex-shrink: 0;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		/*flex-direction: column;*/
	}
	.fvp-media-list-item-text {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 10px;
		display: flex;
		align-items: center;
		/*justify-content: center;*/
		/*flex-direction: column;*/
	}
	.fvp-media-list-count {
		font-size: 11px;
		opacity: 0.8;
	}
	.fvp-media-list-item.selected {
		background-color: rgba(255, 255, 0, 0.2) !important;
	}

	.fvp-media-player .fvp-error-message {
		width: 100%;
		text-align: center;
		padding: 11px;
		color: ${style_footer.color};
		background-color: ${style_footer.backgroundColor};
	}
	.fvp-media-player .fvp-error-message-close {
		cursor: pointer;
		color: ${style_footer.color};
		background-color: ${style_footer.backgroundColor};
	}
	.fvp-media-player .fvp-error-message-close:hover {
		color: ${style_footer.color};
		background-color: ${style_footer.backgroundColor};
		text-shadow: 0 0 5px ${style_footer.color};
	}

	.fvp-media-player .fvp-loading-indicator {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		padding: 11px;
		color: ${style_footer.color};
		background-color: ${style_footer.backgroundColor};
	}

	.fvp-play-button.fvp-loading-state {
		opacity: 0.7;
		cursor: wait !important;
	}

	.fvp-play-button.fvp-error {
		color: ${style_footer.color} !important;
	}

	.fvp-expander {
		position: absolute;
		bottom: 0px;
		right: 0px;
		height: 1.45rem;
		width: 1.45rem;
		background: linear-gradient(to bottom right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 63%, ${style_footer.color} 67%, ${style_footer.color} 100%),
					linear-gradient(to bottom right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 62%, ${style_footer.backgroundColor} 66%, ${style_footer.backgroundColor} 100%);
	}

	.fvp-media-list-thumb {
		position: fixed;
		margin-left: 10px;
		z-index: 1000;
		background: ${style_post_wrapper.backgroundColor};
		border: 1px solid gray;
		border-radius: 3px;
		padding: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		display: none;
		max-width: 125px;
		max-height: 125px;
	}

	.fvp-icon-play::before {
		content: "▶︎" !important;
		font-family: monospace, monospace;
		font-weight: bold;
		font-size-adjust: 0.55;
	}
	.fvp-icon-pause::before {
		content: "❚❚" !important;
		font-family: monospace, monospace;
		font-weight: bold;
		font-size-adjust: 0.55;
	}
	.fvp-icon-remove::before {
		content: "✖" !important;
		font-family: monospace, monospace;
		font-weight: bold;
		font-size-adjust: 0.55;
	}
	.fvp-icon-film::before {
		content: "⎚" !important;
		font-family: monospace, monospace;
		font-weight: bold;
		font-size-adjust: 0.75;
	}

	/* Settings Modal Styles */
	#fvp-settings-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10000;
		scrollbar-color: ${style_footer.backgroundColor} ${style_post_wrapper.backgroundColor};
	}
	.fvp-settings-titlebar {
		padding: 3px 4px 3px 8px;
		background-color: ${style_footer.backgroundColor};
		color: ${style_footer.color};
		display: flex;
		justify-content: space-between;
		align-items: center;
		user-select: none;
	}
	.fvp-settings-title {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 10px;
		font-weight: bold;
		color: ${style_footer.color} !important;
	}
	#fvp-settings-titlebar-close {
		font-size: 22px !important;
		font-weight: bold !important;
		cursor: pointer !important;
		border: unset !important;
		padding: 0 5px !important;
		background: ${style_footer.backgroundColor} !important;
		color: ${style_footer.color} !important;
	}
	#fvp-settings-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: hidden;
		overflow-y: scroll;
		max-height: 350px;
		padding: 14px;
	}
	#fvp-settings-overlay * {
		box-sizing: border-box;
	}
	#fvp-settings-overlay select,
	#fvp-settings-overlay input[type="number"],
	#fvp-settings-overlay input[type="text"] {
		width: 100%;
		height: 28px;
		padding: 5px;
		background: white;
		color: black;
		border: 1px solid gray;
		border-radius: 3px;
		font-family: inherit;
		font-size: 12px;
		cursor: default;
	}
	#fvp-settings-overlay select {
		cursor: pointer;
	}
	#fvp-settings-overlay textarea {
		width: 100%;
		height: 48px;
		padding: 5px;
		background: white;
		color: black;
		border: 1px solid gray;
		border-radius: 3px;
		font-family: inherit;
		font-size: 12px;
		resize: vertical;
		cursor: default;
	}
	#fvp-settings-overlay select option {
		background: white;
		color: black;
	}
	#fvp-settings-overlay button {
		padding: 4px 6px;
		background: ${style_footer.backgroundColor};
		color: ${style_footer.color};
		border: 1px solid gray;
		border-radius: 3px;
		cursor: pointer;
		font-family: inherit;
		font-size: 12px;
	}
	#fvp-settings-overlay b {
		margin-top: 0;
		margin-bottom: 15px;
		font-size: 14px;
		font-weight: bold;
		text-align: center;
		cursor: default;
	}
	#fvp-settings-overlay > #fvp-settings-modal {
		background-color: ${style_post_wrapper.backgroundColor};
		color: ${style_post_wrapper.color};
		border: 1.5px solid ${style_footer.backgroundColor};
		border-radius: 5px;
		width: 450px;
		max-width: 90vw;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
		font-family: inherit;
	}

	/* Grid layout for settings rows */
	.fvp-settings-row {
		display: grid;
		grid-template-columns: 160px 1fr;
		align-items: center;
		gap: 14px;
		margin-bottom: 6px;
	}
	.fvp-settings-row label {
		text-align: left;
		font-size: 12px;
		margin: 0;
		white-space: nowrap;
	}
	.fvp-settings-buttons {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		padding: 10px 20px 10px 20px;
		border-top: 1px solid ${style_footer.backgroundColor};
	}
	.fvp-settings-buttons button {
		flex: 1;
	}
	@keyframes fvpModalFocusPulse {
		0% { transform: scale(1); }
		50% { transform: scale(1.01); }
		100% { transform: scale(1); }
	}
	.fvp-modal-focus-pulse {
		animation: fvpModalFocusPulse 500ms ease-out;
	}
	`;

	// Add styles to the document
	const styleElement = document.createElement('style');
	styleElement.textContent = styles;
	document.head.appendChild(styleElement);

	document.body.removeChild(div);
	document.body.removeChild(div2);

	// ################################################################################################
	//					GENERAL
	// ################################################################################################

	async function extractSoundUrl(title) {
		const match = title.match(/\[sound=([^\]]+)\]/);
		if (!match) return null;

		let soundUrl = match[1];

		// Fix for Firefox filenames
		if (soundUrl.includes('_') && !soundUrl.includes('%')) {
			const hex_pattern = /_(23|24|26|2B|2C|2F|3A|3B|3D|3F|40)/g;
			soundUrl = soundUrl.replace(hex_pattern, '%$1');
		}

		// If there are still underscores after decoding, it's likely invalid
		if (soundUrl.includes('_')) return null;

		try {
			// Decode any percent-encoded characters
			soundUrl = decodeURIComponent(soundUrl);
			// Ensure URL has a protocol
			if (!/^https?:\/\//.test(soundUrl)) {
				// Remove leading slashes if present to avoid double slashes
				soundUrl = soundUrl.replace(/^\/\//, '');
				soundUrl = location.protocol + '//' + soundUrl;
			}
			return soundUrl;
		} catch (error) {
			console.warn('Failed to decode Sound URL:', title, error);
			return null;
		}
	}

	async function extractPostIdFromLink(linkElement) {
		if (!linkElement || !linkElement.href) return 0;

		// Extract the post ID from the URL hash (e.g., #536595752)
		const hashMatch = linkElement.href.match(/#(\d+)$/);
		if (hashMatch && hashMatch[1]) {
			return parseInt(hashMatch[1], 10);
		}

		// Fallback: try to extract from data attributes or other parts of the URL
		const urlMatch = linkElement.href.match(/\/(\d+)\/?$/);
		if (urlMatch && urlMatch[1]) {
			return parseInt(urlMatch[1], 10);
		}

		return 0;
	}

	// ################################################################################################
	//					WINDOWS
	// ################################################################################################

	// One-time event listeners for drag functionality
	let isDraggingGlobal = false;
	let dragElement = null;
	let dragOffsetX = 0;
	let dragOffsetY = 0;

	// Initialize global event listeners once at document start
	function initializeGlobalEventListeners() {
		if (window._fvpGlobalListenersInitialized) return;

		// Global mouse move handler for dragging
		document.addEventListener('mousemove', (e) => {
			//console.log(e.target);
			if (!isDraggingGlobal || !dragElement) return;

			dragElement.style.left = (e.clientX - dragOffsetX) + 'px';
			dragElement.style.top = (e.clientY - dragOffsetY) + 'px';
		});

		// Global mouse up handler for dragging
		document.addEventListener('mouseup', () => {
			if (isDraggingGlobal && dragElement) {
				ensureOnScreen(dragElement);
			}
			isDraggingGlobal = false;
			dragElement = null;
			dragOffsetX = 0;
			dragOffsetY = 0;
		});

		// Global click handler for bringing windows to front (event delegation)
		window.mainElement.addEventListener('mousedown', (e) => {
			if (!e.target.classList.contains('fvp-drag-handle')) return; //chromium fix
			//console.log(e.target);

			// Find the parent media window of the clicked element
			let targetElement = e.target;
			let clickedWindowElement = null;

			while (targetElement && targetElement !== document.body) {
				if (targetElement.id && targetElement.id.startsWith('media-window-')) {
					clickedWindowElement = targetElement;
					break;
				}
				targetElement = targetElement.parentElement;
			}

			if (!clickedWindowElement) return;

			// Set z-index immediately for visual feedback
			const allWindows = document.querySelectorAll('[id^="media-window-"]');
			allWindows.forEach(win => {
				win.style.zIndex = '1';
			});
			clickedWindowElement.style.zIndex = '2';

			// Store references for the mouseup handler
			const parentContainer = clickedWindowElement.parentElement;

			// Wait for mouseup to reorder DOM elements
			const handleMouseUp = () => {
				if (!parentContainer) return;

				// Check if window height exceeds document height and resize if needed
				const windowRect = clickedWindowElement.getBoundingClientRect();
				const documentHeight = document.documentElement.clientHeight;

				if (windowRect.height > documentHeight) {
					// Calculate new height (80% of document height for some padding)
					const newHeight = Math.floor(documentHeight * 0.95);

					// Apply new height to the window element
					clickedWindowElement.style.height = `${newHeight}px`;

					// Also adjust top position if window is off-screen
					if (windowRect.top < 0) {
						clickedWindowElement.style.top = '0px';
					} else if (windowRect.bottom > documentHeight) {
						// Position from bottom with some padding
						clickedWindowElement.style.top = `${documentHeight - newHeight - 10}px`;
					}
				}

				// Re-append all windows in new order
				allWindows.forEach(win => {
					// Check if this window has the fvp-draggable-window-list class
					if (!win.classList.contains('fvp-draggable-window-list')) {
						parentContainer.appendChild(win);
					}
				});

				// Also move the clicked window if it doesn't have the class
				if (!clickedWindowElement.classList.contains('fvp-draggable-window-list')) {
					parentContainer.appendChild(clickedWindowElement);
				}
			};

			document.addEventListener('mouseup', handleMouseUp, { once: true });
		});

		const resizeObserver = new ResizeObserver((entries) => {
			if (window.resizeTimeout) clearTimeout(window.resizeTimeout);

			window.resizeTimeout = setTimeout(() => {
				//console.log('Body size changed ||| height: ' + entries[0].target.clientHeight + ' | width: ' + entries[0].target.clientWidth);
				const allWindows = document.querySelectorAll('[id^="media-window-"]');
				allWindows.forEach(windowElement => {
					ensureOnScreen(windowElement);
				});
			}, 150);
		});

		resizeObserver.observe(document.body);

		window._fvpGlobalListenersInitialized = true;
	}

	async function createDraggableWindow(windowTitle, content, linkToThisPost, title, isMediaList = false) {
		const windowId = 'media-window-' + counter++;
		const windowElement = document.createElement('div');
		windowElement.id = windowId;
		windowElement.className = isMediaList ? 'fvp-draggable-window fvp-draggable-window-list' : 'fvp-draggable-window';

		const mediaWidth = globalSettingsStorage.MEDIA_INITIAL_WIDTH !== undefined ?
				globalSettingsStorage.MEDIA_INITIAL_WIDTH : DEFAULT_MEDIA_INITIAL_WIDTH;
		const mediaHeight = globalSettingsStorage.MEDIA_INITIAL_HEIGHT !== undefined ?
				globalSettingsStorage.MEDIA_INITIAL_HEIGHT : DEFAULT_MEDIA_INITIAL_HEIGHT;

		windowElement.style.width = `${mediaWidth}px`;
		if (isMediaList) windowElement.style.height = `${mediaHeight}px`;

		// Title bar
		const titleBar = document.createElement('div');
		titleBar.className = 'fvp-draggable-window-titlebar fvp-drag-handle';

		const titleText = document.createElement(isMediaList ? 'div' : 'a');
		titleText.className = 'fvp-draggable-window-title';
		titleText.textContent = title;

		if (!isMediaList) {
			titleText.title = "Jump to the post for the current sound";
			titleText.href = linkToThisPost;
		}

		const closeButton = document.createElement('a');
		//closeButton.className = 'fvp-draggable-window-close icon-remove';
		closeButton.className = 'fvp-draggable-window-close';
		closeButton.innerHTML = '×';
		closeButton.style = 'font-size: 22px; font-weight: bold; cursor: pointer; line-height: .7;'

		titleBar.appendChild(titleText);
		titleBar.appendChild(closeButton);

		// Content area
		const contentArea = document.createElement('div');
		contentArea.className = 'fvp-draggable-window-content';
		contentArea.appendChild(content);

		windowElement.appendChild(titleBar);
		windowElement.appendChild(contentArea);

		// Store references to cleanup functions
		windowElement._cleanupFunctions = [];

		if (isMediaList) {
			const footer = document.createElement('div');
			footer.className = 'fvp-draggable-window-footer fvp-drag-handle';
			footer.innerHtml = ' ';
			windowElement.appendChild(footer);

			const footerMouseDownHandler = (e) => {
				if (e.target === closeButton) return;

				isDraggingGlobal = true;
				dragElement = windowElement;
				dragOffsetX = e.clientX - windowElement.getBoundingClientRect().left;
				dragOffsetY = e.clientY - windowElement.getBoundingClientRect().top;

				e.preventDefault();
			};

			footer.addEventListener('mousedown', footerMouseDownHandler);
			windowElement._cleanupFunctions.push(() => {
				footer.removeEventListener('mousedown', footerMouseDownHandler);
			});

			const fvpExpander = document.createElement('div');
			fvpExpander.className = 'fvp-expander';
			footer.appendChild(fvpExpander);
		} else {
			const fvpExpander = document.createElement('div');
			fvpExpander.className = 'fvp-expander';
			windowElement.appendChild(fvpExpander);
		}

		// Position the window initially
		const windowCount = document.querySelectorAll('[id^="media-window-"]').length;
		windowElement.style.left = (20 + (windowCount * 20)) + 'px';
		windowElement.style.top = (20 + (windowCount * 20)) + 'px';

		window.mainElement.appendChild(windowElement);

		// Setup draggable functionality using global listeners
		const titleBarMouseDownHandler = (e) => {
			if (e.target === closeButton) return;

			isDraggingGlobal = true;
			dragElement = windowElement;
			dragOffsetX = e.clientX - windowElement.getBoundingClientRect().left;
			dragOffsetY = e.clientY - windowElement.getBoundingClientRect().top;

			e.preventDefault();
		};

		titleBar.addEventListener('mousedown', titleBarMouseDownHandler);
		windowElement._cleanupFunctions.push(() => {
			titleBar.removeEventListener('mousedown', titleBarMouseDownHandler);
		});

		// Close button
		const closeButtonHandler = async () => {
			await cleanupWindow(windowElement);
			window.mainElement.removeChild(windowElement);
		};

		closeButton.addEventListener('click', closeButtonHandler);
		windowElement._cleanupFunctions.push(() => {
			closeButton.removeEventListener('click', closeButtonHandler);
		});

		// resize observer for the window itself to keep it on screen
		const windowResizeObserver = new ResizeObserver(() => {
			ensureOnScreen(windowElement);
		});
		windowResizeObserver.observe(windowElement);
		windowElement._cleanupFunctions.push(() => {
			windowResizeObserver.disconnect();
		});

		return windowElement;
	}

	async function cleanupWindow(windowElement) {
		// Mark window as being cleaned up to prevent error handlers from running
		windowElement._isBeingCleanedUp = true;

		// Clean up media elements
		const mediaElements = windowElement.querySelectorAll('video, audio');
		mediaElements.forEach(media => {
			// Remove event listeners first to prevent error events
			media.onerror = null;
			media.onload = null;
			media.oncanplaythrough = null;
			media.onloadedmetadata = null;

			// Pause and clean up
			media.pause();
			media.src = '';
			media.load();
		});

		// Execute all cleanup functions
		if (windowElement._cleanupFunctions) {
			windowElement._cleanupFunctions.forEach(cleanupFn => cleanupFn());
			windowElement._cleanupFunctions = [];
		}
	}

	async function createMediaListWindow() {
		if (mediaItems.length === 0) return;

		const listContainer = document.createElement('div');
		let lastSelectedItem = null;

		const format = globalSettingsStorage.LIST_ITEM_FORMAT !== undefined ?
				globalSettingsStorage.LIST_ITEM_FORMAT : DEFAULT_LIST_ITEM_FORMAT;

		// List of media items
		const list = document.createElement('ul');
		list.className = 'fvp-media-list';

		const videoIcon = globalSettingsStorage.LIST_VIDEO_ICON !== undefined ?
				globalSettingsStorage.LIST_VIDEO_ICON : DEFAULT_LIST_VIDEO_ICON;
		const imageIcon = globalSettingsStorage.LIST_IMAGE_ICON !== undefined ?
				globalSettingsStorage.LIST_IMAGE_ICON : DEFAULT_LIST_IMAGE_ICON;
		const soundIcon = globalSettingsStorage.LIST_SOUND_ICON !== undefined ?
				globalSettingsStorage.LIST_SOUND_ICON : DEFAULT_LIST_SOUND_ICON;

		for (const [index, item] of mediaItems.entries()) {
			const listItem = document.createElement('li');
			listItem.className = 'fvp-media-list-item';
			listItem.dataset.index = index;

			// Get post ID
			const postId = await extractPostIdFromLink(item.linkToThisPost);

			// Format the display text according to the template
			let displayText = format;

			// Create icon element if needed
			const iconSpan = document.createElement('span');
			iconSpan.className = 'fvp-media-list-item-icon';
			iconSpan.innerHTML = item.isVideo ? videoIcon : imageIcon;
			iconSpan.innerHTML += (item.soundUrl) ? soundIcon : '';

			// Replace placeholders in the correct order
			if (displayText.includes('icon')) {
				// Icon will be added as a separate element, so we just mark where it goes
				displayText = displayText.replace('icon', '{{ICON}}');
			}

			displayText = displayText.replace('post-id', postId || '');
			displayText = displayText.replace('post-name', item.title || '');

			// Clean up extra spaces and separators
			displayText = displayText.replace(/\s+/g, ' ').trim();
			//displayText = displayText.replace(/▪\s*▪/g, '▪'); // Remove duplicate separators
			//displayText = displayText.replace(/^\s*▪\s*|\s*▪\s*$/g, ''); // Remove separator at start/end

			// If no post ID, remove the separator and any leading/trailing spaces
			//if (!postId) {
			//	displayText = displayText.replace(/▪/g, '').trim();
			//}

			// Fallback if format results in empty string
			if (!displayText) {
				displayText = item.title || 'Untitled';
			}

			// Now build the list item according to the format
			const parts = displayText.split('{{ICON}}');

			// Clear the list item first
			listItem.innerHTML = '';

			// Add parts in order
			if (parts.length === 1) {
				// No icon placeholder, just add text
				const textSpan = document.createElement('span');
				textSpan.className = 'fvp-media-list-item-text';
				textSpan.textContent = parts[0];
				textSpan.title = item.title;
				listItem.appendChild(textSpan);
			} else {
				// We have icon placeholder(s)
				for (let i = 0; i < parts.length; i++) {
					// Add text part if not empty
					if (parts[i].trim()) {
						const textSpan = document.createElement('span');
						textSpan.className = 'fvp-media-list-item-text';
						textSpan.textContent = parts[i];
						textSpan.title = item.title;
						listItem.appendChild(textSpan);
					}

					// Add icon after this part (unless it's the last part)
					if (i < parts.length - 1) {
						listItem.appendChild(iconSpan.cloneNode(true));
					}
				}
			}

			// If the format doesn't contain 'icon' at all, we should still add it at the beginning as default
			//if (!format.includes('icon')) {
			//	listItem.insertBefore(iconSpan, listItem.firstChild);
			//}

			const showThumbnail = (e) => {
				const thumbnailContainer = document.querySelector('img.fvp-media-list-thumb');
				if(!thumbnailContainer) return;

				thumbnailContainer.src = item.thumbSrc;
				thumbnailContainer.style.display = 'block';

				positionThumbnail(e);
			};

			const hideThumbnail = () => {
				const thumbnailContainer = document.querySelector('img.fvp-media-list-thumb');
				if(!thumbnailContainer) return;

				thumbnailContainer.style.display = 'none';
			};

			// Position the thumbnail near the cursor
			const positionThumbnail = (e) => {
				const thumbnailContainer = document.querySelector('img.fvp-media-list-thumb');
				if(!thumbnailContainer) return;

				const {
					width,
					height
				} = thumbnailContainer.getBoundingClientRect();

				const maxX = document.documentElement.clientWidth - width - 25;
				thumbnailContainer.style.left = (Math.min(e.clientX, maxX) + 5) + 'px';
				thumbnailContainer.style.top = (e.clientY - height - 10) + 'px';
			};

			if(item.thumbSrc !== null) {
				listItem.addEventListener('mouseenter', (e) => { showThumbnail(e); });

				listItem.addEventListener('mouseleave', hideThumbnail);
				listItem.addEventListener('click', hideThumbnail);

				listItem.addEventListener('mousemove', (e) => {
					const thumbnailContainer = document.querySelector('img.fvp-media-list-thumb');
					if (thumbnailContainer.style.display === 'block') {
						positionThumbnail(e);
					}
				});
			}

			listItem.addEventListener('click', async () => {
				// Remove selected class from previously selected item
				if (lastSelectedItem) {
					lastSelectedItem.classList.remove('selected');
				}

				// Add selected class to current item
				listItem.classList.add('selected');
				lastSelectedItem = listItem;

				// Scroll to the post
				if (item.linkToThisPost) {
					const scrollBehaviour = globalSettingsStorage.SCROLL_INTO_VIEW_BEHAVIOUR !== undefined ?
							globalSettingsStorage.SCROLL_INTO_VIEW_BEHAVIOUR : DEFAULT_SCROLL_INTO_VIEW_BEHAVIOUR;
					item.linkToThisPost.scrollIntoView({ behavior: scrollBehaviour, block: 'center' });
					// Highlight the post briefly
					const postWrapper = item.linkToThisPost.closest('.post_wrapper');
					if (postWrapper) {
						const originalBackground = postWrapper.style.backgroundColor;
						postWrapper.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
						setTimeout(() => {
							postWrapper.style.backgroundColor = originalBackground;
						}, 2000);
					}
				}
			});

			list.appendChild(listItem);
		}

		listContainer.appendChild(list);

		// Create the draggable window
		await createDraggableWindow('Media List', listContainer, null, `Media List - ${mediaItems.length} items`, true);
	}

	async function addMediaListItem(mediaUrl, soundUrl, linkToThisPost, title, thumbSrc = null) {
		const isVideo = SUPPORTED_VIDEO_EXTS.some(ext => mediaUrl.toLowerCase().endsWith(ext));
		mediaItems.push({
			mediaUrl,
			soundUrl,
			linkToThisPost,
			title,
			thumbSrc,
			isVideo,
			timestamp: Date.now()
		});
	}

	function ensureOnScreen(windowElement) {
		const containerRect = windowElement.getBoundingClientRect();
		const viewportWidth = document.documentElement.clientWidth;
		const viewportHeight = document.documentElement.clientHeight;

		// Check if window is completely offscreen
		const isOffscreen =
			containerRect.right < 0 ||
			containerRect.bottom < 0 ||
			containerRect.left > viewportWidth ||
			containerRect.top > viewportHeight;

		if (isOffscreen) {
			// Move to default position if completely offscreen
			windowElement.style.left = '20px';
			windowElement.style.top = '20px';
		} else {
			// Adjust position if partially offscreen
			let newLeft = parseFloat(windowElement.style.left) || 0;
			let newTop = parseFloat(windowElement.style.top) || 0;

			if (containerRect.left < 0) {
				newLeft = 0;
			} else if (containerRect.right > viewportWidth) {
				newLeft = viewportWidth - containerRect.width;
			}

			if (containerRect.top < 0) {
				newTop = 0;
			} else if (containerRect.bottom > viewportHeight) {
				newTop = viewportHeight - containerRect.height;
			}

			if (newLeft !== (parseFloat(windowElement.style.left) || 0) ||
				newTop !== (parseFloat(windowElement.style.top) || 0)) {
				windowElement.style.left = newLeft + 'px';
				windowElement.style.top = newTop + 'px';
			}
		}
	}

	// ################################################################################################
	//					MEDIA
	// ################################################################################################

	async function createMediaPlayer(mediaUrl, soundUrl, isDraggableWindow = false) {
		const extension = mediaUrl.split('.').pop().toLowerCase();
		const isImage = SUPPORTED_IMAGE_EXTS.some(ext => mediaUrl.toLowerCase().endsWith(ext));
		const externalSourceIsVideo = soundUrl && videoFileExtRE.test(soundUrl);

		const mediaKey = `${mediaUrl}-${soundUrl || 'nosound'}`;
		const wrapper = createMediaWrapper();

		// Set initial loading state
		loadingStates.set(mediaKey, true);
		mediaErrors.delete(mediaKey);

		const treatExternalVideoAsVideo = globalSettingsStorage.IF_EXTERNAL_SOUND_IS_VIDEO_TREAT_IT_AS_VIDEO !== undefined ?
			globalSettingsStorage.IF_EXTERNAL_SOUND_IS_VIDEO_TREAT_IT_AS_VIDEO : DEFAULT_IF_EXTERNAL_SOUND_IS_VIDEO_TREAT_IT_AS_VIDEO;

		if (treatExternalVideoAsVideo && externalSourceIsVideo) {
			await createExternalVideoPlayer(mediaUrl, soundUrl, isImage, mediaKey, wrapper, isDraggableWindow);
		} else if (isImage) {
			await createImagePlayer(mediaUrl, soundUrl, mediaKey, wrapper, isDraggableWindow);
		} else {
			await createVideoPlayer(mediaUrl, soundUrl, mediaKey, wrapper, isDraggableWindow);
		}

		return createMediaContainer(wrapper, isDraggableWindow);
	}

	function createMediaWrapper() {
		const wrapper = document.createElement('div');
		wrapper.className = 'fvp-media-player';

		// Create loading indicator
		const loadingIndicator = document.createElement('div');
		loadingIndicator.className = 'fvp-loading-indicator';
		loadingIndicator.textContent = 'Loading...';
		wrapper.appendChild(loadingIndicator);

		return wrapper;
	}

	function createMediaContainer(wrapper, isDraggableWindow) {
		const container = document.createElement('div');
		container.className = isDraggableWindow ? 'fvp-media-container' : 'fvp-media-container-inline';

		// Load settings for media size
		if (!isDraggableWindow) {
			const mediaWidth = globalSettingsStorage.MEDIA_INITIAL_WIDTH !== undefined ? globalSettingsStorage.MEDIA_INITIAL_WIDTH : DEFAULT_MEDIA_INITIAL_WIDTH;
			//const mediaHeight = globalSettingsStorage.MEDIA_INITIAL_HEIGHT !== undefined ? globalSettingsStorage.MEDIA_INITIAL_HEIGHT : DEFAULT_MEDIA_INITIAL_HEIGHT;

			container.style.width = `${mediaWidth}px`;
			//container.style.minHeight = `${mediaHeight}px`;
		}

		container.appendChild(wrapper);

		if (!isDraggableWindow) {
			const fvpExpander = document.createElement('div');
			fvpExpander.className = 'fvp-expander';
			container.appendChild(fvpExpander);
		}

		return container;
	}

	async function handleMediaError(mediaKey, errorMessage, wrapper, mediaUrl, soundUrl, isDraggableWindow) {
		loadingStates.set(mediaKey, false);
		mediaErrors.set(mediaKey, errorMessage);
		showMediaError(wrapper, mediaUrl, soundUrl, isDraggableWindow);
	}

	function createMediaElement(type, src, options = {}) {
		const element = document.createElement(type);
		element.style.display = 'none';
		element.src = src;

		// Apply common options
		if (options.controls !== undefined) element.controls = options.controls;
		if (options.autoplay !== undefined) element.autoplay = options.autoplay;
		if (options.loop !== undefined) element.loop = options.loop;
		if (options.volume !== undefined) element.volume = options.volume;
		if (options.preload !== undefined) element.preload = options.preload;

		return element;
	}

	async function createExternalVideoPlayer(mediaUrl, soundUrl, isImage, mediaKey, wrapper, isDraggableWindow) {
		const loadingIndicator = wrapper.querySelector('.fvp-loading-indicator');

		// First try the external video
		const externalVideo = createMediaElement('video', soundUrl, {
			controls: true,
			autoplay: false,
			loop: true,
			volume: 0.2,
			preload: 'auto'
		});
		wrapper.appendChild(externalVideo);

		const onVideoError = async () => {
			await handleMediaError(mediaKey, 'Failed to load video', wrapper, mediaUrl, soundUrl, isDraggableWindow);
		};

		const onExternalVideoError = async () => {
			// Check if the window is being closed/cleaned up
			const mediaWindow = externalVideo.closest('[id^="media-window-"]');
			if (mediaWindow && (!mediaWindow.parentNode || mediaWindow._isBeingCleanedUp)) {
				// Window is being cleaned up, don't try to create fallback player
				return;
			}

			wrapper.removeChild(externalVideo);
			await createFallbackPlayer(mediaUrl, soundUrl, isImage, mediaKey, wrapper, isDraggableWindow);
		};

		const onExternalVideoSuccess = async () => {
			try {
				await externalVideo.play();
				externalVideo.muted = false;
			} catch (error) {
				console.error('External video play failed:', error);
				await handleMediaError(mediaKey, 'Failed to play video: ' + error.message, wrapper, mediaUrl, soundUrl, isDraggableWindow);
				return;
			}
			loadingStates.set(mediaKey, false);
			loadingIndicator.style.display = 'none';
			externalVideo.style.removeProperty("display");
			initialMediaSize(externalVideo, isDraggableWindow);
		};

		externalVideo.addEventListener('error', onExternalVideoError);
		//externalVideo.addEventListener('error', onVideoError);
		externalVideo.addEventListener('canplaythrough', async () => {
			if (externalVideo.videoWidth === 0 && externalVideo.videoHeight === 0) {
				await onExternalVideoError(); // If the external video has no Width/Height treat it as Audio
			} else {
				await onExternalVideoSuccess();
			}
		}, { once: true });
	}

	async function createFallbackPlayer(mediaUrl, soundUrl, isImage, mediaKey, wrapper, isDraggableWindow) {
		if (isImage) {
			await createImagePlayer(mediaUrl, soundUrl, mediaKey, wrapper, isDraggableWindow);
		} else {
			await createVideoPlayer(mediaUrl, soundUrl, mediaKey, wrapper, isDraggableWindow);
		}
	}

	async function createImagePlayer(mediaUrl, soundUrl, mediaKey, wrapper, isDraggableWindow) {
		const loadingIndicator = wrapper.querySelector('.fvp-loading-indicator');
		const img = createMediaElement('img', mediaUrl);
		wrapper.appendChild(img);

		const onImageLoad = () => {
			loadingStates.set(mediaKey, false);
			loadingIndicator.style.display = 'none';
			img.style.removeProperty("display");
			initialMediaSize(img, isDraggableWindow);
		};

		const onImageError = async () => {
			await handleMediaError(mediaKey, 'Failed to load image', wrapper, mediaUrl, soundUrl, isDraggableWindow);
		};

		img.addEventListener('load', onImageLoad);
		img.addEventListener('error', onImageError);

		if (soundUrl) {
			await addAudioToImage(img, soundUrl, mediaKey, wrapper, isDraggableWindow);
		}
	}

	async function createVideoPlayer(mediaUrl, soundUrl, mediaKey, wrapper, isDraggableWindow) {
		const loadingIndicator = wrapper.querySelector('.fvp-loading-indicator');
		const video = createMediaElement('video', mediaUrl, {
			controls: true,
			autoplay: false,
			loop: true,
			volume: 0.2,
			preload: 'auto'
		});
		wrapper.appendChild(video);

		const onVideoError = async () => {
			await handleMediaError(mediaKey, 'Failed to load video', wrapper, mediaUrl, soundUrl, isDraggableWindow);
		};

		const onVideoSuccess = () => {
			loadingStates.set(mediaKey, false);
			loadingIndicator.style.display = 'none';
			video.style.removeProperty("display");
			initialMediaSize(video, isDraggableWindow);

			/*if (soundUrl) {
				video.play().catch(async error => {
					console.error('Video play failed:', error);
					await handleMediaError(mediaKey, 'Failed to play video: ' + error.message, wrapper, mediaUrl, soundUrl, isDraggableWindow);
				});
			}*/
		};

		video.addEventListener('error', onVideoError);

		if (soundUrl) {
			video.addEventListener('canplaythrough', onVideoSuccess, { once: true });
			const audio = createAudioElement(soundUrl, false, isDraggableWindow, wrapper, mediaKey);
			await syncMediaElements(video, audio, mediaKey);
			wrapper.appendChild(audio);
		} else {
			video.addEventListener('canplaythrough', async () => {
				try {
					await video.play();
				} catch (error) {
					console.error('Video play failed:', error);
					await handleMediaError(mediaKey, 'Failed to play video: ' + error.message, wrapper, mediaUrl, soundUrl, isDraggableWindow);
					return;
				}
				onVideoSuccess();
			}, { once: true });
		}
	}

	async function addAudioToImage(img, soundUrl, mediaKey, wrapper, isDraggableWindow) {
		const audio = createAudioElement(soundUrl, true, isDraggableWindow, wrapper, mediaKey);
		wrapper.appendChild(audio);

		img.style.cursor = 'pointer';

		const toggleAudio = async () => {
			if (audio.paused) {
				try {
					await audio.play();
				} catch (error) {
					console.error('Audio play failed:', error);
					await handleMediaError(mediaKey, 'Failed to play audio: ' + error.message, wrapper, '', soundUrl, isDraggableWindow);
				}
			} else {
				audio.pause();
			}
		};

		img.addEventListener('click', toggleAudio);

		audio.addEventListener('canplay', async () => {
			audio.style.removeProperty("display");
			try {
				await audio.play();
			} catch (error) {
				console.error('Audio play failed:', error);
				await handleMediaError(mediaKey, 'Failed to play audio: ' + error.message, wrapper, '', soundUrl, isDraggableWindow);
			}
		}, { once: true });
	}

	async function initialMediaSize(element, isDraggableWindow) {
		const mediaHeight = globalSettingsStorage.MEDIA_INITIAL_HEIGHT !== undefined ? globalSettingsStorage.MEDIA_INITIAL_HEIGHT : DEFAULT_MEDIA_INITIAL_HEIGHT;

		//if (!isDraggableWindow) {
			const elementHeight = parseFloat(getComputedStyle(element).height);
			if(elementHeight && elementHeight > mediaHeight) {
				element.style.height = mediaHeight + 'px';
			}
		//}
	}

	function showMediaError(container, mediaUrl, soundUrl, isDraggableWindow) {
		const loadingIndicator = container.querySelector('.fvp-loading-indicator');
		if (loadingIndicator) {
			loadingIndicator.style.display = 'none';
		}

		const mediaKey = `${mediaUrl}-${soundUrl || 'nosound'}`;
		const errorMessage = mediaErrors.get(mediaKey) || 'Failed to load';

		// Remove any existing fvp-error message
		const existingError = container.querySelector('.fvp-error-message');
		if (existingError) {
			container.removeChild(existingError);
		}

		const errorDiv = document.createElement('div');
		errorDiv.className = 'fvp-error-message';
		errorDiv.innerHTML = `
			${errorMessage}&nbsp;&nbsp;<a class="fvp-error-message-close">[×]</a>
		`;

		container.appendChild(errorDiv);

		const fvpErrorMessageClose = errorDiv.querySelector('.fvp-error-message-close');
		if (fvpErrorMessageClose) fvpErrorMessageClose.addEventListener("click", (e) => { e.target.parentNode.style.display = 'none'; });
	}

	function createAudioElement(soundUrl, autoplay, isDraggableWindow = false, container, mediaKey) {
		const audio = document.createElement('audio');
		audio.style.display = 'none'; // Initial display property. It is removed on load.
		audio.src = soundUrl;
		audio.loop = true;
		audio.volume = 0.2;
		audio.autoplay = autoplay;
		audio.preload = 'auto';
		audio.controls = true;

		// Show audio controls when container is hovered
		if (container) {
			audio.style = 'position: absolute; top: 0; left: 0; right: 0; opacity: 0; transition: opacity 0.3s; pointer-events: none;';

			container.addEventListener('mouseenter', () => {
				audio.style.opacity = '1';
				audio.style.pointerEvents = 'auto';
			});

			container.addEventListener('mouseleave', () => {
				audio.style.opacity = '0';
				audio.style.pointerEvents = 'none'; // Prevent interaction when hidden
			});
		}

		audio.addEventListener('loadedmetadata', () => {
			audio.style.removeProperty("display");
		}, { once: true });

		audio.addEventListener('error', async () => {
			loadingStates.set(mediaKey, false);
			mediaErrors.set(mediaKey, 'Failed to load audio');
			if (container) {
				showMediaError(container, '', soundUrl, isDraggableWindow);
			}
		});

		return audio;
	}

	async function syncMediaElements(video, audio, mediaKey) {
		let durationsMatch = false;
		let adequateDuration = false;
		let videoReady = false;
		let audioReady = false;
		let isSeeking = false;

		const tolerance = globalSettingsStorage.DURATION_MATCH_TOLERANCE_FOR_SYNC !== undefined ?
				globalSettingsStorage.DURATION_MATCH_TOLERANCE_FOR_SYNC : DEFAULT_DURATION_MATCH_TOLERANCE_FOR_SYNC;

		const checkDurations = () => {
			if (isFinite(video.duration) && isFinite(audio.duration)) {
				durationsMatch = Math.abs(video.duration - audio.duration) <= tolerance;
				if (!durationsMatch) {
					console.log(`Not syncing audio: duration mismatch (video: ${video.duration.toFixed(2)}s, audio: ${audio.duration.toFixed(2)}s)`);
				}
				return true;
			}
			return false;
		};

		const checkReady = () => {
			if (videoReady && audioReady) {
				const checkInterval = setInterval(() => {
					if (checkDurations()) {
						clearInterval(checkInterval);
						video.play().catch(async error => {
							console.error('Video play failed:', error);
							mediaErrors.set(mediaKey, 'Failed to play video: ' + error.message);
						});
						audio.play().catch(async error => {
							console.error('Audio play failed:', error);
							mediaErrors.set(mediaKey, 'Failed to play audio: ' + error.message);
						});
						adequateDuration = (video.duration <= 3) ? false : true;
					}

					// Sync play/pause
					const syncPlayPause = async (source, target) => {
						if (source.paused) target.pause();
						else {
							try {
								await target.play();
							} catch (error) {
								console.error(error);
							}
						}
					};

					video.addEventListener('play', () => syncPlayPause(video, audio));
					video.addEventListener('pause', () => syncPlayPause(video, audio));
					video.addEventListener('ended', () => durationsMatch && !video.loop && audio.pause());

					audio.addEventListener('play', () => syncPlayPause(audio, video));
					audio.addEventListener('pause', () => syncPlayPause(audio, video));
					audio.addEventListener('ended', () => durationsMatch && !audio.loop && video.pause());

					// Sync volume/mute
					const syncVolume = (source, target) => {
						target.muted = source.muted;
						target.volume = source.volume;
					};

					video.addEventListener('volumechange', () => syncVolume(video, audio));
					audio.addEventListener('volumechange', () => syncVolume(audio, video));

					// Sync seeking
					const syncSeek = (source, target) => {
						if (durationsMatch && !isSeeking) {
							isSeeking = true;
							target.currentTime = source.currentTime;
							setTimeout(() => { isSeeking = false }, 100);
						}
					};

					video.addEventListener('seeked', () => syncSeek(video, audio));
					audio.addEventListener('seeked', () => syncSeek(audio, video));

					// Sync time updates
					const syncTimeUpdate = (source, target) => {
						if (durationsMatch && adequateDuration && !isSeeking && Math.abs(source.currentTime - target.currentTime) > 0.1) {
							target.currentTime = source.currentTime;
						}
					};

					video.addEventListener('timeupdate', () => syncTimeUpdate(video, audio));
					audio.addEventListener('timeupdate', () => syncTimeUpdate(audio, video));

					// Sync playback rate
					const syncRate = (source, target) => {
						if (durationsMatch) target.playbackRate = source.playbackRate;
					};

					video.addEventListener('ratechange', () => syncRate(video, audio));
					audio.addEventListener('ratechange', () => syncRate(audio, video));

					// Sync loop
					const syncLoop = (source, target) => {
						if (durationsMatch) target.loop = source.loop;
					};

					video.addEventListener('change', (e) => e.target === video && e.target.hasAttribute('loop') && syncLoop(video, audio));
					audio.addEventListener('change', (e) => e.target === audio && e.target.hasAttribute('loop') && syncLoop(audio, video));

					// Initial sync
					syncVolume(video, audio);
					syncRate(video, audio);

				}, 100);
			}
		};

		video.addEventListener('loadedmetadata', () => {
			videoReady = true;
			checkReady();
		});

		audio.addEventListener('loadedmetadata', () => {
			audioReady = true;
			checkReady();
		});
	}

	// ################################################################################################
	//					SETTINGS
	// ################################################################################################

	async function openSettingsModal() {
		// Load saved settings or use defaults
		const settings = await loadSettings();

		// Create modal overlay
		const overlay = document.createElement('div');
		overlay.id = 'fvp-settings-overlay';

		// Create modal content
		const modal = document.createElement('div');
		modal.id = 'fvp-settings-modal';

		modal.innerHTML = `
			<div class="fvp-settings-titlebar">
				<div class="fvp-settings-title">Settings</div>
				<button id="fvp-settings-titlebar-close">×</button>
			</div>
			<div id="fvp-settings-content">
				<b>Floating Buttons</b>
				<div class="fvp-settings-row">
					<label for="fvp-position-select">Position:</label>
					<select id="fvp-position-select">
						<option value="top-left">Top Left</option>
						<option value="top-right">Top Right</option>
						<option value="bottom-left">Bottom Left</option>
						<option value="bottom-right" selected="selected">Bottom Right</option>
					</select>
				</div>

				<div id="fvp-top-bottom-container" class="fvp-settings-row">
					<label for="fvp-top-bottom-input" id="fvp-top-bottom-label">Top (px):</label>
					<input type="number" id="fvp-top-bottom-input">
				</div>

				<div id="fvp-left-right-container" class="fvp-settings-row">
					<label for="fvp-left-right-input" id="fvp-left-right-label">Left (px):</label>
					<input type="number" id="fvp-left-right-input">
				</div>

				<div class="fvp-settings-row">
					<label for="fvp-zindex-input">Z-Index:</label>
					<input type="number" id="fvp-zindex-input" value="3">
				</div>

				<b style="margin-top: 20px;">Media Settings</b>
				<div class="fvp-settings-row">
					<label for="media-initial-width">Initial Width (px):</label>
					<input type="number" id="media-initial-width" value="${DEFAULT_MEDIA_INITIAL_WIDTH}">
				</div>

				<div class="fvp-settings-row">
					<label for="media-initial-height">Initial Height (px):</label>
					<input type="number" id="media-initial-height" value="${DEFAULT_MEDIA_INITIAL_HEIGHT}">
				</div>

				<div class="fvp-settings-row">
					<label for="duration-tolerance">Duration Sync Tolerance (s):</label>
					<input type="number" id="duration-tolerance" value="${DEFAULT_DURATION_MATCH_TOLERANCE_FOR_SYNC}" step="0.1">
				</div>

				<div class="fvp-settings-row">
					<label for="external-video-as-video">Treat External Video as Video:</label>
					<select id="external-video-as-video">
						<option value="true">Yes, treat it as video</option>
						<option value="false">No, treat it as sound</option>
					</select>
				</div>

				<b style="margin-top: 20px;">Floating Buttons Icons</b>
				<div class="fvp-settings-row">
					<label for="floating-list-icon">List Icon (innerHTML):</label>
					<textarea id="floating-list-icon"></textarea>
				</div>

				<div class="fvp-settings-row">
					<label for="floating-settings-icon">Settings Icon (innerHTML):</label>
					<textarea id="floating-settings-icon"></textarea>
				</div>

				<b style="margin-top: 20px;">Media List</b>

				<div class="fvp-settings-row">
					<label for="scroll-behaviour">Scroll Behaviour:</label>
					<select id="scroll-behaviour">
						<option value="smooth">Smooth</option>
						<option value="instant">Instant</option>
					</select>
				</div>

				<div class="fvp-settings-row">
					<label for="list-image-icon">Image Icon (innerHTML):</label>
					<textarea id="list-image-icon"></textarea>
				</div>

				<div class="fvp-settings-row">
					<label for="list-video-icon">Video Icon (innerHTML):</label>
					<textarea id="list-video-icon"></textarea>
				</div>

				<div class="fvp-settings-row">
					<label for="list-sound-icon">Sound Icon (innerHTML):</label>
					<textarea id="list-sound-icon"></textarea>
				</div>

				<div class="fvp-settings-row">
					<label for="list-item-format">List Item Format:</label>
					<input type="text" id="list-item-format" value="${DEFAULT_LIST_ITEM_FORMAT}" placeholder="e.g., icon post-id ▪ post-name">
				</div>
			</div>

			<div class="fvp-settings-buttons" style="grid-template-columns: 1fr 1fr 1fr;">
				<button id="fvp-save-settings">Save</button>
				<button id="fvp-close-settings">Cancel</button>
				<button id="fvp-reset-settings">Reset</button>
			</div>
		`;

		overlay.appendChild(modal);
		window.mainElement.appendChild(overlay);

		// Set initial values
		const positionSelect = document.getElementById('fvp-position-select');
		const topBottomContainer = document.getElementById('fvp-top-bottom-container');
		const topBottomLabel = document.getElementById('fvp-top-bottom-label');
		const topBottomInput = document.getElementById('fvp-top-bottom-input');
		const leftRightContainer = document.getElementById('fvp-left-right-container');
		const leftRightLabel = document.getElementById('fvp-left-right-label');
		const leftRightInput = document.getElementById('fvp-left-right-input');
		const zIndexInput = document.getElementById('fvp-zindex-input');
		const mediaInitialWidth = document.getElementById('media-initial-width');
		const mediaInitialHeight = document.getElementById('media-initial-height');
		const durationTolerance = document.getElementById('duration-tolerance');
		const externalVideoAsVideo = document.getElementById('external-video-as-video');
		const scrollBehaviour = document.getElementById('scroll-behaviour');
		const floatingListIcon = document.getElementById('floating-list-icon');
		const floatingSettingsIcon = document.getElementById('floating-settings-icon');
		const listImageIcon = document.getElementById('list-image-icon');
		const listVideoIcon = document.getElementById('list-video-icon');
		const listSoundIcon = document.getElementById('list-sound-icon');
		const listItemFormat = document.getElementById('list-item-format');

		// Set values from settings
		positionSelect.value = settings.position || 'bottom-right';
		zIndexInput.value = settings.zIndex || 3;
		mediaInitialWidth.value = settings.MEDIA_INITIAL_WIDTH || DEFAULT_MEDIA_INITIAL_WIDTH;
		mediaInitialHeight.value = settings.MEDIA_INITIAL_HEIGHT || DEFAULT_MEDIA_INITIAL_HEIGHT;
		durationTolerance.value = settings.DURATION_MATCH_TOLERANCE_FOR_SYNC || DEFAULT_DURATION_MATCH_TOLERANCE_FOR_SYNC;
		externalVideoAsVideo.value = settings.IF_EXTERNAL_SOUND_IS_VIDEO_TREAT_IT_AS_VIDEO !== undefined ?
		settings.IF_EXTERNAL_SOUND_IS_VIDEO_TREAT_IT_AS_VIDEO : DEFAULT_IF_EXTERNAL_SOUND_IS_VIDEO_TREAT_IT_AS_VIDEO;
		scrollBehaviour.value = settings.SCROLL_INTO_VIEW_BEHAVIOUR || DEFAULT_SCROLL_INTO_VIEW_BEHAVIOUR;
		floatingListIcon.value = settings.FLOATING_BUTTONS_LIST_ICON || DEFAULT_FLOATING_BUTTONS_LIST_ICON;
		floatingSettingsIcon.value = settings.FLOATING_BUTTONS_SETTINGS_ICON || DEFAULT_FLOATING_BUTTONS_SETTINGS_ICON;
		listImageIcon.value = settings.LIST_IMAGE_ICON || DEFAULT_LIST_IMAGE_ICON;
		listVideoIcon.value = settings.LIST_VIDEO_ICON || DEFAULT_LIST_VIDEO_ICON;
		listSoundIcon.value = settings.LIST_SOUND_ICON || DEFAULT_LIST_SOUND_ICON;
		listItemFormat.value = settings.LIST_ITEM_FORMAT || DEFAULT_LIST_ITEM_FORMAT;

		// Set min attributes on inputs
		zIndexInput.min = 0;
		zIndexInput.max = 1000000;
		mediaInitialWidth.min = 50;
		mediaInitialWidth.max = 1000;
		mediaInitialHeight.min = 50;
		mediaInitialHeight.max = 1000;
		durationTolerance.min = 0;
		durationTolerance.max = 10;
		durationTolerance.step = 0.1;

		// Parse offset values based on current wrapper style
		const wrapper = document.getElementById('fvp-floating-buttons-wrapper');
		if (wrapper) {
			const computedStyle = getComputedStyle(wrapper);

			// Extract values from inset property or individual properties
			if (computedStyle.inset && computedStyle.inset !== 'auto') {
				const values = computedStyle.inset.split(' ');
				if (values.length === 4) {
					// Parse inset values: top right bottom left
					const top = values[0] === 'auto' ? '0' : values[0];
					const right = values[1] === 'auto' ? '0' : values[1];
					const bottom = values[2] === 'auto' ? '0' : values[2];
					const left = values[3] === 'auto' ? '0' : values[3];

					// Update inputs based on position with min values
					updateOffsetInputs(settings.position, top, right, bottom, left);
				}
			} else {
				// Fallback to individual properties
				const top = computedStyle.top === 'auto' ? '0' : computedStyle.top;
				const right = computedStyle.right === 'auto' ? '0' : computedStyle.right;
				const bottom = computedStyle.bottom === 'auto' ? '0' : computedStyle.bottom;
				const left = computedStyle.left === 'auto' ? '0' : computedStyle.left;

				updateOffsetInputs(settings.position, top, right, bottom, left);
			}
		}

		// Update offset inputs based on position and current style
		function updateOffsetInputs(position, top, right, bottom, left) {
			switch(position) {
				case 'top-left':
					topBottomLabel.textContent = 'Top (px):';
					topBottomInput.value = parseInt(top) || 12;
					topBottomInput.min = 12;
					leftRightLabel.textContent = 'Left (px):';
					leftRightInput.value = parseInt(left) || 2;
					leftRightInput.min = 2;
					break;
				case 'top-right':
					topBottomLabel.textContent = 'Top (px):';
					topBottomInput.value = parseInt(top) || 12;
					topBottomInput.min = 12;
					leftRightLabel.textContent = 'Right (px):';
					leftRightInput.value = parseInt(right) || 12;
					leftRightInput.min = 12;
					break;
				case 'bottom-left':
					topBottomLabel.textContent = 'Bottom (px):';
					topBottomInput.value = parseInt(bottom) || 4;
					topBottomInput.min = 4;
					leftRightLabel.textContent = 'Left (px):';
					leftRightInput.value = parseInt(left) || 2;
					leftRightInput.min = 2;
					break;
				case 'bottom-right':
					topBottomLabel.textContent = 'Bottom (px):';
					topBottomInput.value = parseInt(bottom) || 4;
					topBottomInput.min = 4;
					leftRightLabel.textContent = 'Right (px):';
					leftRightInput.value = parseInt(right) || 12;
					leftRightInput.min = 12;
					break;
			}
		}

		// Position change handler
		positionSelect.addEventListener('change', function() {
			const newPosition = this.value;

			// Update labels based on position
			switch(newPosition) {
				case 'top-left':
					topBottomLabel.textContent = 'Top';
					leftRightLabel.textContent = 'Left';
					break;
				case 'top-right':
					topBottomLabel.textContent = 'Top';
					leftRightLabel.textContent = 'Right';
					break;
				case 'bottom-left':
					topBottomLabel.textContent = 'Bottom';
					leftRightLabel.textContent = 'Left';
					break;
				case 'bottom-right':
					topBottomLabel.textContent = 'Bottom';
					leftRightLabel.textContent = 'Right';
					break;
			}

			// Update min values and current values
			updateOffsetInputs(newPosition,
				topBottomInput.value,
				leftRightInput.value,
				topBottomInput.value,
				leftRightInput.value);
		});

		// Save settings
		document.getElementById('fvp-save-settings').addEventListener('click', async function() {
			// Get position
			const position = positionSelect.value;

			// Get values directly (they will be bounded by applySettings)
			const topBottomValue = parseInt(topBottomInput.value) || (position.includes('top') ? 12 : 4);
			const leftRightValue = parseInt(leftRightInput.value) || (position.includes('right') ? 12 : 2);
			const zIndexValue = parseInt(zIndexInput.value) || 0;
			let MEDIA_INITIAL_WIDTH = parseInt(mediaInitialWidth.value) || DEFAULT_MEDIA_INITIAL_WIDTH;
			MEDIA_INITIAL_WIDTH = Math.max(50, MEDIA_INITIAL_WIDTH);
			MEDIA_INITIAL_WIDTH = Math.min(1000, MEDIA_INITIAL_WIDTH);
			let MEDIA_INITIAL_HEIGHT = parseInt(mediaInitialHeight.value) || DEFAULT_MEDIA_INITIAL_HEIGHT;
			MEDIA_INITIAL_HEIGHT = Math.max(50, MEDIA_INITIAL_HEIGHT);
			MEDIA_INITIAL_HEIGHT = Math.min(1000, MEDIA_INITIAL_HEIGHT);
			let DURATION_MATCH_TOLERANCE_FOR_SYNC = parseFloat(durationTolerance.value) || DEFAULT_DURATION_MATCH_TOLERANCE_FOR_SYNC;
			DURATION_MATCH_TOLERANCE_FOR_SYNC = Math.max(0, DURATION_MATCH_TOLERANCE_FOR_SYNC);
			DURATION_MATCH_TOLERANCE_FOR_SYNC = Math.min(1000, DURATION_MATCH_TOLERANCE_FOR_SYNC);

			const scriptVersion = (typeof GM.setValue !== 'undefined') ? GM_info.script.version : '0016';
			const VERSION = scriptVersion ? scriptVersion : 'Version not found';

			const newSettings = {
				position: position,
				topBottomOffset: topBottomValue,
				leftRightOffset: leftRightValue,
				zIndex: zIndexValue,
				MEDIA_INITIAL_WIDTH: MEDIA_INITIAL_WIDTH,
				MEDIA_INITIAL_HEIGHT: MEDIA_INITIAL_HEIGHT,
				DURATION_MATCH_TOLERANCE_FOR_SYNC: DURATION_MATCH_TOLERANCE_FOR_SYNC,
				IF_EXTERNAL_SOUND_IS_VIDEO_TREAT_IT_AS_VIDEO: externalVideoAsVideo.value === 'false',
				SCROLL_INTO_VIEW_BEHAVIOUR: scrollBehaviour.value,
				FLOATING_BUTTONS_LIST_ICON: floatingListIcon.value,
				FLOATING_BUTTONS_SETTINGS_ICON: floatingSettingsIcon.value,
				LIST_IMAGE_ICON: listImageIcon.value,
				LIST_VIDEO_ICON: listVideoIcon.value,
				LIST_SOUND_ICON: listSoundIcon.value,
				LIST_ITEM_FORMAT: listItemFormat.value || DEFAULT_LIST_ITEM_FORMAT,
				VERSION: VERSION
			};

			await saveSettings(newSettings);
			await applySettings(newSettings);
			globalSettingsStorage = await loadSettings();
			window.mainElement.removeChild(overlay);
		});

		// Close modal
		document.getElementById('fvp-close-settings').addEventListener('click', function() {
			window.mainElement.removeChild(overlay);
		});
		document.getElementById('fvp-settings-titlebar-close').addEventListener('click', function() {
			window.mainElement.removeChild(overlay);
		});

		// Reset to defaults
		document.getElementById('fvp-reset-settings').addEventListener('click', async function() {
			const defaultSettings = getDefaultSettings();
			positionSelect.value = defaultSettings.position;
			zIndexInput.value = defaultSettings.zIndex;
			mediaInitialWidth.value = DEFAULT_MEDIA_INITIAL_WIDTH;
			mediaInitialHeight.value = DEFAULT_MEDIA_INITIAL_HEIGHT;
			durationTolerance.value = DEFAULT_DURATION_MATCH_TOLERANCE_FOR_SYNC;
			externalVideoAsVideo.value = DEFAULT_IF_EXTERNAL_SOUND_IS_VIDEO_TREAT_IT_AS_VIDEO;
			scrollBehaviour.value = DEFAULT_SCROLL_INTO_VIEW_BEHAVIOUR;
			floatingListIcon.value = DEFAULT_FLOATING_BUTTONS_LIST_ICON;
			floatingSettingsIcon.value = DEFAULT_FLOATING_BUTTONS_SETTINGS_ICON;
			listImageIcon.value = DEFAULT_LIST_IMAGE_ICON;
			listVideoIcon.value = DEFAULT_LIST_VIDEO_ICON;
			listSoundIcon.value = DEFAULT_LIST_SOUND_ICON;
			listItemFormat.value = DEFAULT_LIST_ITEM_FORMAT;

			// Reset offset inputs with proper min values
			updateOffsetInputs(defaultSettings.position,
				defaultSettings.position.includes('top') ? defaultSettings.topBottomOffset : '0',
				defaultSettings.position.includes('right') ? defaultSettings.leftRightOffset : '0',
				defaultSettings.position.includes('bottom') ? defaultSettings.topBottomOffset : '0',
				defaultSettings.position.includes('left') ? defaultSettings.leftRightOffset : '0');
		});

		/*overlay.addEventListener('click', function(e) {
			if (e.target === overlay) {
				window.mainElement.removeChild(overlay);
			}
		});*/

		overlay.addEventListener('click', function(e) {
			if (e.target === overlay) {
				// Add shake animation to indicate modal can't be closed this way
				modal.classList.add('fvp-modal-focus-pulse');
				setTimeout(() => {
					modal.classList.remove('fvp-modal-focus-pulse');
				}, 500);
			}
		});

		document.addEventListener('keydown', function handleEscape(e) {
			if (e.key === 'Escape' && document.getElementById('fvp-settings-overlay')) {
				window.mainElement.removeChild(overlay);
			}
		});
	}

	// Storage functions
	async function saveSettings(settings) {
		try {
			if (typeof GM.setValue !== 'undefined') {
				await GM.setValue('fvp_settings', JSON.stringify(settings));
				localStorage.setItem('fvp_settings', JSON.stringify(settings));
			} else {
				localStorage.setItem('fvp_settings', JSON.stringify(settings));
			}
		} catch (error) {
			console.error('Failed to save settings:', error);
		}
	}

	async function loadSettings() {
		try {
			let settings;
			if (typeof GM.getValue !== 'undefined') {
				const saved = await GM.getValue('fvp_settings');
				settings = saved ? JSON.parse(saved) : getDefaultSettings();
			} else {
				const saved = localStorage.getItem('fvp_settings');
				settings = saved ? JSON.parse(saved) : getDefaultSettings();
			}
			return settings;
		} catch (error) {
			console.error('Failed to load settings:', error);
			return getDefaultSettings();
		}
	}

	function getDefaultSettings() {
		return {
			position: 'bottom-right',
			topBottomOffset: 4,
			leftRightOffset: 12,
			zIndex: 3,
			MEDIA_INITIAL_WIDTH: DEFAULT_MEDIA_INITIAL_WIDTH,
			MEDIA_INITIAL_HEIGHT: DEFAULT_MEDIA_INITIAL_HEIGHT,
			DURATION_MATCH_TOLERANCE_FOR_SYNC: DEFAULT_DURATION_MATCH_TOLERANCE_FOR_SYNC,
			IF_EXTERNAL_SOUND_IS_VIDEO_TREAT_IT_AS_VIDEO: DEFAULT_IF_EXTERNAL_SOUND_IS_VIDEO_TREAT_IT_AS_VIDEO,
			SCROLL_INTO_VIEW_BEHAVIOUR: DEFAULT_SCROLL_INTO_VIEW_BEHAVIOUR,
			FLOATING_BUTTONS_LIST_ICON: DEFAULT_FLOATING_BUTTONS_LIST_ICON,
			FLOATING_BUTTONS_SETTINGS_ICON: DEFAULT_FLOATING_BUTTONS_SETTINGS_ICON,
			LIST_IMAGE_ICON: DEFAULT_LIST_IMAGE_ICON,
			LIST_VIDEO_ICON: DEFAULT_LIST_VIDEO_ICON,
			LIST_SOUND_ICON: DEFAULT_LIST_SOUND_ICON,
			LIST_ITEM_FORMAT: DEFAULT_LIST_ITEM_FORMAT
		};
	}

	async function applySettings(settings) {
		const wrapper = document.getElementById('fvp-floating-buttons-wrapper');
		if (!wrapper) return;

		if (settings.position) wrapper.setAttribute('data-position', settings.position);

		// Helper function to ensure button stays on screen with proper bounds
		function floatingButtonsEnsureOnScreen(settings) {
			// Get viewport dimensions
			const viewportWidth = document.documentElement.clientWidth;
			const viewportHeight = document.documentElement.clientHeight;

			// Get wrapper dimensions
			wrapper.style.visibility = 'hidden';
			wrapper.style.display = 'block';

			// Apply position temporarily to measure
			switch(settings.position) {
				case 'top-left':
					wrapper.style.top = '0px';
					wrapper.style.left = '0px';
					break;
				case 'top-right':
					wrapper.style.top = '0px';
					wrapper.style.right = '0px';
					break;
				case 'bottom-left':
					wrapper.style.bottom = '0px';
					wrapper.style.left = '0px';
					break;
				case 'bottom-right':
					wrapper.style.bottom = '0px';
					wrapper.style.right = '0px';
					break;
			}

			// Define minimum padding
			const MIN_TOP = 12;
			const MIN_BOTTOM = 2;
			const MIN_LEFT = 2;
			const MIN_RIGHT = 12;


			const OFFSET_TOP = 44;
			const OFFSET_BOTTOM = 39;
			const OFFSET_LEFT = 39;
			const OFFSET_RIGHT = 39;

			// Calculate bounds for each position
			switch(settings.position) {
				case 'top-left':
					settings.topBottomOffset = Math.max(MIN_TOP, Math.min(settings.topBottomOffset, viewportHeight - OFFSET_BOTTOM));
					settings.leftRightOffset = Math.max(MIN_LEFT, Math.min(settings.leftRightOffset, viewportWidth - OFFSET_RIGHT));
					break;

				case 'top-right':
					settings.topBottomOffset = Math.max(MIN_TOP, Math.min(settings.topBottomOffset, viewportHeight - OFFSET_BOTTOM));
					settings.leftRightOffset = Math.max(MIN_RIGHT, Math.min(settings.leftRightOffset, viewportWidth - OFFSET_LEFT));
					break;

				case 'bottom-left':
					settings.topBottomOffset = Math.max(MIN_BOTTOM, Math.min(settings.topBottomOffset, viewportHeight - OFFSET_TOP));
					settings.leftRightOffset = Math.max(MIN_LEFT, Math.min(settings.leftRightOffset, viewportWidth - OFFSET_RIGHT));
					break;

				case 'bottom-right':
					settings.topBottomOffset = Math.max(MIN_BOTTOM, Math.min(settings.topBottomOffset, viewportHeight - OFFSET_TOP));
					settings.leftRightOffset = Math.max(MIN_RIGHT, Math.min(settings.leftRightOffset, viewportWidth - OFFSET_LEFT));
					break;
			}

			// Ensure z-index is non-negative
			settings.zIndex = Math.max(0, settings.zIndex);

			// Reset wrapper style
			wrapper.style.visibility = '';
			wrapper.style.display = '';
			wrapper.style.top = 'auto';
			wrapper.style.right = 'auto';
			wrapper.style.bottom = 'auto';
			wrapper.style.left = 'auto';

			return settings;
		}

		// Ensure button stays on screen with proper bounds
		settings = floatingButtonsEnsureOnScreen(settings);

		// Reset all positions
		wrapper.style.top = 'auto';
		wrapper.style.right = 'auto';
		wrapper.style.bottom = 'auto';
		wrapper.style.left = 'auto';
		wrapper.style.inset = 'auto';

		// Apply position based on settings
		switch(settings.position) {
			case 'top-left':
				wrapper.style.top = `${settings.topBottomOffset}px`;
				wrapper.style.left = `${settings.leftRightOffset}px`;
				wrapper.style.bottom = 'auto';
				wrapper.style.right = 'auto';
				break;
			case 'top-right':
				wrapper.style.top = `${settings.topBottomOffset}px`;
				wrapper.style.right = `${settings.leftRightOffset}px`;
				wrapper.style.bottom = 'auto';
				wrapper.style.left = 'auto';
				break;
			case 'bottom-left':
				wrapper.style.bottom = `${settings.topBottomOffset}px`;
				wrapper.style.left = `${settings.leftRightOffset}px`;
				wrapper.style.top = 'auto';
				wrapper.style.right = 'auto';
				break;
			case 'bottom-right':
				wrapper.style.bottom = `${settings.topBottomOffset}px`;
				wrapper.style.right = `${settings.leftRightOffset}px`;
				wrapper.style.top = 'auto';
				wrapper.style.left = 'auto';
				break;
		}

		// Apply z-index
		wrapper.style.zIndex = settings.zIndex.toString();

		// Update floating buttons icons if they exist
		const listBtn = document.getElementById('fvp-media-list-toggle-btn');
		const settingsBtn = document.getElementById('fvp-settings-btn');

		if (listBtn && settings.FLOATING_BUTTONS_LIST_ICON) {
			listBtn.innerHTML = settings.FLOATING_BUTTONS_LIST_ICON;
		}
		if (settingsBtn && settings.FLOATING_BUTTONS_SETTINGS_ICON) {
			settingsBtn.innerHTML = settings.FLOATING_BUTTONS_SETTINGS_ICON;
		}

		// Save the adjusted settings
		//await saveSettings(settings);
	}

	// make sure floating buttons don't go offscreen
	function setupWrapperResizeListener() {
		const wrapper = document.getElementById('fvp-floating-buttons-wrapper');
		if (!wrapper) return;

		// Add resize observer to window to reapply bounds checking
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(async () => {
				const settings = await loadSettings();
				await applySettings(settings);
			}, 250);
		});
	}

	// ################################################################################################
	//					HANDLE PAGE
	// ################################################################################################

	async function createPlayInlineButton(mediaUrl, soundUrl, mediaTarget, linkToThisPost, title) {
		const btn = document.createElement('a');
		btn.title = soundUrl ? 'Play inline with sound' : 'Play inline';
		btn.className = 'btnr parent play-file fvp-play-button fvp-icon-play';
		btn.dataset.playButton = 'true';

		const mediaKey = `${mediaUrl}-${soundUrl || 'nosound'}`;

		// Check if this media has previously failed to load
		if (mediaErrors.has(mediaKey)) {
			btn.classList.add('fvp-error');
			btn.title = 'Media failed to load - Click to retry';
		}

		let isProcessing = false; // Prevent multiple simultaneous clicks

		let mediaInserted = false;
		let mediaPlayer = null;
		const threadImageLink = mediaTarget.querySelector('.thread_image_link');

		btn.addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			// Prevent multiple clicks while processing
			if (isProcessing) return;
			isProcessing = true;

			// If previously fvp-errored, remove fvp-error state
			if (btn.classList.contains('fvp-error')) {
				btn.classList.remove('fvp-error');
				mediaErrors.delete(mediaKey);
			}

			if (!mediaInserted) {
				btn.classList.add('fvp-loading-state');
				btn.title = 'Loading...';

				try {
					mediaPlayer = await createMediaPlayer(mediaUrl, soundUrl);
					threadImageLink.after(mediaPlayer);
					threadImageLink.style.display = 'none';
					btn.classList.remove("fvp-icon-play", "fvp-icon-remove");
					btn.classList.add("fvp-icon-remove");
					btn.title = 'Hide';
					mediaInserted = true;
				} catch (error) {
					console.error('Failed to create media player:', error);
					btn.classList.remove('fvp-loading-state');
					btn.classList.add('fvp-error');
					btn.title = 'Failed to load - Click to retry';
					mediaErrors.set(mediaKey, error.message);
				} finally {
					// Always remove loading state
					btn.classList.remove('fvp-loading-state');
					isProcessing = false;
				}
			} else {
				// Toggle off - hide media
				if (mediaPlayer) {
					const video = mediaPlayer.querySelector('video');
					const audio = mediaPlayer.querySelector('audio');
					if (video) {
						video.pause();
						video.src = '';
						video.load();
					}
					if (audio) {
						audio.pause();
						audio.src = '';
						audio.load();
					}

					// Remove the media player from DOM
					if (mediaPlayer.parentNode) {
						mediaPlayer.parentNode.removeChild(mediaPlayer);
					}
				}
				threadImageLink.style.display = "unset";
				btn.classList.remove("fvp-icon-play", "fvp-icon-remove");
				btn.classList.add("fvp-icon-play");
				btn.title = soundUrl ? 'Play with Sound' : 'Play';
				mediaInserted = false;
				mediaPlayer = null;
				isProcessing = false;
			}
		});

		return btn;
	}

	async function createPlayInWindowButton(mediaUrl, soundUrl, mediaTarget, linkToThisPost, title) {
		const btn = document.createElement('a');
		btn.title = soundUrl ? 'Play with sound in a draggable window' : 'Play in a draggable window';
		btn.className = 'btnr parent play-file fvp-play-button-draggable fvp-icon-film';
		btn.dataset.playButton = 'true';

		const mediaKey = `${mediaUrl}-${soundUrl || 'nosound'}`;

		// Check if this media has previously failed to load
		if (mediaErrors.has(mediaKey)) {
			btn.classList.add('fvp-error');
			btn.title = 'Media failed to load - Click to retry';
		}

		let isProcessing = false; // Prevent multiple simultaneous clicks

		btn.addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			// Prevent multiple clicks while processing
			if (isProcessing) return;
			isProcessing = true;

			// If previously fvp-errored, remove fvp-error state
			if (btn.classList.contains('fvp-error')) {
				btn.classList.remove('fvp-error');
				mediaErrors.delete(mediaKey);
			}

			btn.classList.add('fvp-loading-state');
			btn.title = 'Loading...';

			try {
				const mediaPlayer = await createMediaPlayer(mediaUrl, soundUrl, true);
				const windowTitle = mediaUrl.split('/').pop() || (soundUrl ? 'Media with Sound' : 'Media Player');
				await createDraggableWindow(windowTitle, mediaPlayer, linkToThisPost, title);

				// Reset button state
				btn.classList.remove('fvp-loading-state');
				btn.title = soundUrl ? 'Play with sound in a draggable window' : 'Play in a draggable window';
			} catch (error) {
				console.error('Failed to create media player:', error);
				btn.classList.remove('fvp-loading-state');
				btn.classList.add('fvp-error');
				btn.title = 'Failed to load - Click to retry';
				mediaErrors.set(mediaKey, error.message);
			} finally {
				isProcessing = false;
			}
		});

		return btn;
	}

	async function injectMediaButtons() {
		// Process both video and image files with a single function
		await processMediaFiles();
		// Add media list button if we have media items
		await addFloatingMediaListButton();
		await addMediaListButtonToNavbar();
	}

	async function addFloatingMediaListButton() {
		if (mediaItems.length > 0 && !document.querySelector('#fvp-floating-buttons-wrapper')) {
			const wrapper = document.createElement('div');
			wrapper.id = 'fvp-floating-buttons-wrapper';
			window.mainElement.appendChild(wrapper);
			wrapper.style = "inset: auto 12px 12px auto; z-index: 3;";

			const listBtn = document.createElement('a');
			listBtn.id = 'fvp-media-list-toggle-btn';
			listBtn.innerHTML = globalSettingsStorage.FLOATING_BUTTONS_LIST_ICON !== undefined ?
				globalSettingsStorage.FLOATING_BUTTONS_LIST_ICON : DEFAULT_FLOATING_BUTTONS_LIST_ICON;
			listBtn.title = `Show Media List`;

			const settingsBtn = document.createElement('a');
			settingsBtn.id = 'fvp-settings-btn';
			settingsBtn.innerHTML = globalSettingsStorage.FLOATING_BUTTONS_SETTINGS_ICON !== undefined ?
				globalSettingsStorage.FLOATING_BUTTONS_SETTINGS_ICON : DEFAULT_FLOATING_BUTTONS_SETTINGS_ICON;
			settingsBtn.title = `Settings`;

			listBtn.addEventListener('click', createMediaListWindow);
			settingsBtn.addEventListener('click', openSettingsModal);

			wrapper.appendChild(listBtn);
			wrapper.appendChild(settingsBtn);

			await applySettings(globalSettingsStorage); // apply saved wrapper.style

			// Setup resize listener
			setupWrapperResizeListener();
		}
	}

	async function addMediaListButtonToNavbar() {
		if (mediaItems.length > 0 && !document.querySelector('#fvp-media-list-toggle-btn-navbar')) {
			const nav = document.querySelector('.navbar-inner .nav:nth-child(2)');
			if(nav) {
				const li = document.createElement('li');
				li.id = 'fvp-media-list-toggle-btn-navbar';
				li.innerHTML = '<a>Media List</a>';
				li.title = `Show Media List`;
				li.style = 'cursor: pointer; user-select: none;';
				li.children[0].addEventListener('click', createMediaListWindow);
				nav.appendChild(li);
			}
		}
	}

	async function processMediaFiles() {
		const articles = document.querySelectorAll(`article.thread, article.has_image`);

		for (const article of articles) {
			let postWrapper = article.querySelector(".post_wrapper");
			if (article.classList.contains('post_is_op')) postWrapper = article;
			if (!postWrapper) continue;

			const fileControls = postWrapper.querySelector(".post_file_controls");
			if (!fileControls || fileControls.dataset.hasMediaButtons) continue;

			// Find any supported media file
			const link = article.querySelector(threadImageLinkSelectors) || article.querySelector(postFileFilenameSelectors);
			if (!link || !link.href) continue;
			//if (link.href.includes("redirect")) continue;
			const filename = article.querySelector(".post_file_filename");
			if (!filename) continue;

			// Check if it requires sound (true for images, false for videos)
			const requireSound = SUPPORTED_IMAGE_EXTS.some(ext => link.href.toLowerCase().endsWith(ext));

			const soundUrl = await extractSoundUrl(filename.getAttribute("title") || filename.innerHTML || '');

			// Skip images without sound if required
			if (requireSound && !soundUrl) continue;

			const mediaUrl = link.href;
			const linkToThisPost = postWrapper.querySelector('a[data-function="highlight"]');
			const title = filename.getAttribute("title") || filename.innerHTML;
			const thumbBox = postWrapper.querySelector(".thread_image_box");
			const thumbImg = thumbBox && thumbBox.querySelector('img');
			const thumbSrc = thumbImg && (thumbImg.src || thumbImg.getAttribute('data-src'));

			if (!thumbBox) continue;

			// Add to media items list
			await addMediaListItem(mediaUrl, soundUrl, linkToThisPost, title, thumbSrc);

			// Create and insert buttons
			const draggableButton = await createPlayInWindowButton(mediaUrl, soundUrl, thumbBox, linkToThisPost, title);
			const inlineButton = await createPlayInlineButton(mediaUrl, soundUrl, thumbBox, linkToThisPost, title);

			fileControls.insertAdjacentElement('afterend', draggableButton);
			fileControls.insertAdjacentElement('afterend', inlineButton);

			fileControls.dataset.hasMediaButtons = 'true';
		}
		//console.log(mediaItems);
		return true;
	}

	async function init() {
		if(isFoolFuuka) {
			// Initial injection
			window.mainElement = document.createElement('div');
			window.mainElement.id = 'foolfuuka-video-player-script';
			document.body.appendChild(window.mainElement);

			const thumb = document.createElement('img');
			thumb.className = 'fvp-media-list-thumb';
			thumb.style = 'display: none; left: 0px; top: 0px;'
			window.mainElement.appendChild(thumb);

			// Load and apply settings
			globalSettingsStorage = await loadSettings();
			await applySettings(globalSettingsStorage);

			setTimeout(() => {
				injectMediaButtons().catch(console.error);
			}, 2500);

			// Observer for new content
			const observer = new MutationObserver((mutations) => {
				clearTimeout(window.fvpMutationTimeout);
				window.fvpMutationTimeout = setTimeout(() => {
					injectMediaButtons().catch(console.error);
				}, 100);
			});
			observer.observe(document.body, { childList: true, subtree: true });

			initializeGlobalEventListeners();
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', async function() {
			init().catch(console.error);
		});
	} else {
		init().catch(console.error);
	}
})();