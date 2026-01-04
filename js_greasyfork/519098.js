// ==UserScript==
// @name        Jupiter's Discord Chat Saver
// @description A free, full-featured chat saver for Discord.
// @namespace   Violentmonkey Scripts
// @match       https://discord.com/channels/*
// @grant       none
// @version     1.4
// @author      Jupiter Liar
// @description 01/04/2024, 11:40 AM
// @license     CC BY-SA
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.9/beautify-html.min.js
// @downloadURL https://update.greasyfork.org/scripts/519098/Jupiter%27s%20Discord%20Chat%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/519098/Jupiter%27s%20Discord%20Chat%20Saver.meta.js
// ==/UserScript==

(function () {
		'use strict';

		const logInitial = 'Here is a record of the download process.\n' +
				'Certain kinds of errors cannot be overcome, or be detected by this script.\n' +
				'Files which failed to download can be downloaded manually.\n';
		let outputLog = logInitial;



		function resetLog() {
				outputLog = logInitial;
		}

		let showMinorLogs = false;
		let showMajorLogs = true;


		// Declare variables for settings
		let attachmentsEnabled = true;
		let audioEnabled = true;
		let fetchFullSize = true;
		let buttonGenerationLocation = 'show-button-corner'; // Default to 'show-button-corner'
		let stopScrollingVar = false;

		// Load settings from localStorage and apply them
		const loadSettings = () => {
				const savedSettings = JSON.parse(localStorage.getItem('chatCopySettings'));
				console.log(savedSettings);

				if (savedSettings) {
						// Apply saved settings to variables
						attachmentsEnabled = savedSettings.enableAttachments;
						audioEnabled = savedSettings.enableAudio;
						fetchFullSize = savedSettings.enableFullSizeImages;
						buttonGenerationLocation = savedSettings.buttonLocation;
						showMinorLogs = savedSettings.enableLogMinor;
				} else {
						// Set default settings if no saved data exists
						attachmentsEnabled = true;
						audioEnabled = true;
						fetchFullSize = true;
						buttonGenerationLocation = 'show-button-corner';
						showMinorLogs = false;
				}
		};

		// Call loadSettings to initialize values when the script loads
		loadSettings();


		const instructions = `
    <h1><span>How does this thing work?</span></h1>

    <p>This may be a little different from other chat savers out there, so pay attention.</p>

    <p>By now you've clicked the blue <strong>Copy Chat</strong> button, and have opened the <strong>Copy</strong> popup. This popup can be dragged and resized like a normal window. At the bottom, you'll notice it says "Recording...". It will always say this. Because as long as the popup is open, it will record what is in the current chat.</p>

    <p>But it can only record one chat at a time. If you navigate away, the popup will close, and the copy process will end.</p>

    <h2>How much of the chat will I save?</h2>

    <p>As much as you load. Simply scroll through the chat, allowing each portion to load as you go. Every time a portion loads, the <strong>Copy</strong> popup will record it. Discord unloads portions of the chat as you go, but the <strong>Copy</strong> popup keeps them.</p>

    <p>When you've loaded all the portions of the chat that you want to save, then you can press the Save button. The script will go through the chat that it has copied, fetching resources as it goes.</p>

    <p><strong>NOTE: Some resources cannot be fetched. Do an internet search for "CORS", and you will understand why.</strong></p>

    <p>Once everything that can be fetched has been fetched, your browser will download the chat as a ZIP. The zip will contain:</p>

																																																																  <ul>
    <li>an HTML file</li>
    <li>the images in the chat, including any animations</li>
    <li>audio (if enabled)</li>
    <li>the full-size versions of images (if enabled)</li>
    <li>the styles that determine how the chat looks</li>
    <li>attachments (if enabled)</li>
    <li>a log of the download process</li>
																																																																  </ul>

    <p>As said above, some files may not download, for various reasons. After downloading, check to make sure you got everything you wanted.</p>

    <p>Clicking the <strong>Settings</strong> gear will give you the options to enable or disable downloading certain kinds of media, as well as an option to turn on extra logs in the dev console.</p>

								<h2>How does <strong>Autoscroll</strong> work?</h2>

								<p><strong>Autoscroll</strong> scrolls the chat so you don't have to. It can scroll until it gets to a specific date, or if you'd prefer to just get everything, it can scroll until it can't go any further.</p>

								<p>To use it, first click the <strong>Autoscroll</strong> button to open up its options. Click <strong>Return</strong> at any time to leave the options. If <strong>First/Last</strong> is selected, the chat will scroll until it can't go any further. If <strong>Date</strong> is selected, it will scroll until it reaches a given date.</p>

								<p>To begin scrolling, press one of the two <strong>arrows</strong>, and the chat will scroll in the arrow's direction. Press <strong>Stop</strong> to stop, naturally. Pressing <strong>Return</strong> will also stop the scrolling process.</p>

								<p><strong>Note:</strong> If you set a date, and the arrow you click would take you further from that date, nothing will happen.</p>

    <p><strong>Further note:</strong> Due to different time zones, the date feature may be imprecise. Check the <strong>Copy<strong> popup to make sure you have captured everything you want.</p>

    <h2>How many messages can I save for free?</h2>

    <p><strong>All</strong> of them.</p>

    <h2>Is there a premium version with more features?</h2>

    <p>No. All the features I could make, I included in this version, for free.</p>

    <h2>Can I support your work with a donation?</h2>

    <p>You can reach my Buy Me a Coffee page through my <a href="https://linktr.ee/jupiterliar">Linktree.</a></p>
  `;

		function logMinor(message) {
				if (showMinorLogs) {
						console.log(message); // No need to record these.
				}
		}

		function logMajor(message) {
				if (showMajorLogs) {
						console.log(message);
						outputLog += `\n${message}`;
						onScreenLogging('log', message);
				}
		}

		function logError(message) {
				const errorMessage = 'ERROR: ' + message;
				console.error(errorMessage);
				outputLog += `\n\n${errorMessage}\n`;
				onScreenLogging('error', errorMessage);
		}

		// Add styles
		const style = document.createElement('style');
		style.id = "discord-chat-saver-styles";
		style.textContent = `
        :root {
            --dcs-box-shadow: .1em .1em .2em inset hsla(0, 0%, 100%, .35),
            -.1em -.1em .2em inset hsla(0, 0%, 0%, .5);
            --dcs-opposite-box-shadow: .1em .1em .1em inset hsla(0, 0%, 0%, .25),
            -.1em -.1em .1em inset hsla(0, 0%, 100%, .175);
            /* --dcs-blue: hsl(235, 85%, 65%); */
            --dcs-hs: 235, 100%;
            --dcs-blue: hsl(var(--dcs-hs), 60%);
            --dcs-drop-shadow: drop-shadow(.1em .1em .1em black);
            --dcs-yellow: hsl(60, 100%, 35%);
            --dcs-box-shadow-2: .2em .2em .4em inset hsla(0, 0%, 100%, .35),
            -.2em -.2em .4em inset hsla(0, 0%, 0%, .5);
            --scale-factor: 1;
        }

        @media (max-height: 600px) {
            :root {
                --scale-factor: 0.75;
            }
        }

        #copy-button-outer {
            margin: .5em 1.5em auto auto;
            position: sticky;
            width: fit-content;
            height: 0;
            z-index: 1;
            font-weight: 700;
        }

        #copy-button-inner {
            padding: 1em;
            background: var(--dcs-blue);
            border-radius: 50%;
            position: sticky;
            color: white;
            filter: var(--dcs-drop-shadow);
            box-shadow: var(--dcs-box-shadow);
            cursor: pointer;
            aspect-ratio: 1;
            display: flex;
            align-items: center;
        }

        #copy-button-inner span {
            filter: inherit;
            display: block;
            text-align: center;
        }

        #chat-copy-outer {
            position: fixed;
            z-index: 101;
            background: var(--bg-overlay-chat, var(--background-primary));
            border-radius: 1.5em;
            width: 33.3vw;
            max-height: calc(100vh - 8em);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: var(--dcs-box-shadow);
            background: #DDD;
            filter: var(--dcs-drop-shadow);
            font-weight: 500;
            color: var(--text-normal);
            min-height: 17em;
        }

        #chat-copy-outer .drag-bar {
            cursor: move;
            background: var(--dcs-blue);
            padding: 0.5em;
            border-radius: 1em 1em 0 0;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: var(--dcs-box-shadow);
        }

        #chat-copy-outer .drag-bar span {
            font-size: 16px;
            font-weight: bold;
            color: white;
            z-index: 1; /* Ensure the text is on top of the bars */
            display: flex;
            align-items: center;
            width: 100%;
            filter: var(--dcs-drop-shadow);
            font-family: Arial;
        }

        /* Left and right bars before and after the text using pseudo-elements */
        #chat-copy-outer .drag-bar span::before,
        #chat-copy-outer .drag-bar span::after {
          content: '';
          flex-grow: 1;
          background-color: #DDD;
          margin: 0 0.5em;
          min-height: 1px;
          box-shadow: 0 .25em #DDD, 0 -.25em #DDD;
        }

        /* Left bar (before the text) */
        #chat-copy-outer .drag-bar span::before {
          flex-basis: 1em;
        }

        /* Right bar (after the text) */
        #chat-copy-outer .drag-bar span::after {
          margin-right: 2em;
        }

        #chat-copy-outer .close-box {
            position: absolute;
            /* top: 0.5em; */
            right: 0.5em;
            cursor: pointer;
            /* color: red; */
            font-weight: bold;
            z-index: 5;
            font-size: 2em;
        }

        #chat-copy-inner {
            flex: 1;
            overflow: auto;
            padding: 1em;
            /* border: 1px solid rgba(255, 255, 255, 0.2); */
            margin: 0 .2em;
            background: var(--bg-overlay-chat, var(--background-primary));
            box-shadow: var(--dcs-opposite-box-shadow);
        }

        #chat-copy-outer .resize-handle {
            width: 1.5em;
            height: 1.5em;
            position: absolute;
            right: 0;
            bottom: 0;
            cursor: se-resize;
            background: var(--dcs-blue);
            border-radius: 0 0 1em 0;
            z-index: 1;
            box-shadow: var(--dcs-box-shadow);
            overflow: hidden;
        }

        #chat-copy-outer .resize-handle::before {
            z-index: 1;
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            box-shadow: var(--dcs-box-shadow), inset 2px 2px var(--dcs-blue),
            inset -3px -3px var(--dcs-blue);
        }

        /* Add diagonal lines to the resize handle */
        #chat-copy-outer .resize-handle::after {
            content: '';
            flex-grow: 1;
            background-color: #DDD;
            min-height: 1px;
            box-shadow: 0 .3em #DDD, 0 -.3em #DDD;
            width: 200%;
            position: absolute;
            transform: rotate(-45deg);
            filter: var(--dcs-drop-shadow);
            left: -50%;
            top: 20%;
        }

        #chat-copy-inner li::marker {
            content: '';
        }

        /* Recording bar styling */
        .recording-bar {
            background-color: #444;
            color: #fff;
            text-align: center;
            padding: 5px;
            font-size: 14px;
            font-family: Arial, sans-serif;
            position: relative;
            padding-right: calc(5px + 1em);
            box-shadow: var(--dcs-box-shadow);
        }

        .recording-bar span::after {
            content: '...';
            position: absolute;
            animation: recording-dots 1.5s steps(4, end) infinite;
        }

        /* Animation for the dots */
        @keyframes recording-dots {
            0% {
                content: '';
            }
            33% {
                content: '.';
            }
            66% {
                content: '..';
            }
            100% {
                content: '...';
            }
        }

        .chat-copy-big-button {
            position: absolute;
            border-radius: 50%;
            z-index: 1;
            color: white;
            padding: 0.8em;
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: var(--dcs-box-shadow);
            filter: drop-shadow(1px 1px 1px black);
            cursor: pointer;
            scale: var(--scale-factor);
        }

        .chat-copy-big-button span {
            filter: var(--dcs-drop-shadow);
            font-weight: 700;
        }

        #chat-copy-save-button {

            background: hsl(150, 100%, 35%);

            right: calc(2em * var(--scale-factor));
            bottom: calc(2em * var(--scale-factor));
            font-family: Arial;

        }

        #chat-copy-config-button {
            top: calc(3em * var(--scale-factor));
            left: calc(1em * var(--scale-factor));
            background: hsl(00, 100%, 50%);
        }

        #chat-copy-config-button span:not(.save-size-span) {
            font-size: 2.5em;
            position: absolute;
        }

        #chat-copy-instruction-button {
            top: calc(3em * var(--scale-factor));
            right: calc(2em * var(--scale-factor));
            background: hsl(330, 100%, 50%);
        }

        #chat-copy-instruction-button span:not(.save-size-span) {
            font-size: 1.75em;
            position: absolute;
        }


        #chat-copy-instruction-button span {
            filter: brightness(8) var(--dcs-drop-shadow);
        }

        .save-size-span {
            opacity: 0;
        }

        div#progress-log-overlay {
            pointer-events: none;
            height: 32em;
            max-height: 32em;
            width: 100%;
            position: absolute;
            z-index: 9;
            margin-bottom: 8em;
            bottom: 0;
            padding: 1em 2em;
            box-sizing: border-box;
            mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0) 100%);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            filter: drop-shadow(.5em 0 0 white) drop-shadow(-.5em 0 0 white);
        }

        div#progress-log-overlay span.line-outer {
            text-align: center;
            line-height: normal;
            font-size: .95em;
        }

        div#progress-log-overlay span.line-inner {
            background: white;
            color: black;
            animation: fadeOut 10s forwards;
            word-break: break-word;
            font-size: inherit;
        }

        div#progress-log-overlay span.line-inner.error {
            color: red;
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          25% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        #chat-copy-settings-outer, #chat-copy-instruction-outer {
          background: var(--bg-overlay-chat, var(--background-primary));
          box-shadow: var(--dcs-opposite-box-shadow);
          margin: 0 .2em;
          padding: 1em;
          overflow: auto;
          flex: 1;
          max-height: calc(100vh - 16em);
          z-index: 2;
          min-height: 12em;
          display: flex;
        }

        #chat-copy-settings {



            /* border: 1px solid rgba(255, 255, 255, 0.2); */


            width: fit-content;
            margin: auto;
        }

        #chat-copy-settings .wrapper {
          margin-left: 1em;
        }

        #chat-copy-settings .wrapper .wrapper-inner {
            display: inline;
        }

        #chat-copy-settings .wrapper .wrapper-inner * {
            line-height: normal;
        }

        #chat-copy-settings h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 0.65em;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        #chat-copy-settings h2 span {
            margin-right: auto;
            filter: var(--dcs-drop-shadow);
        }

        #chat-copy-settings h2::before {
            content: "";
            position: absolute;
            background: linear-gradient(to right, hsl(00, 100%, 40%), transparent);
            z-index: -1;
            width: 100%;
            height: 100%;
            --bottom-extra: 0.1em;
            padding: .25em 0.5em calc(0.25em + var(--bottom-extra));
            margin-top: var(--bottom-extra);
        }

        #chat-copy-settings h3 {
            margin-bottom: .5em;
            font-weight: 600;
            font-size: 1.1em;
        }

        #chat-copy-settings p {
            margin: .5em 0;
            max-width: 20em;
        }

        #chat-copy-settings .divider {
            height: 1px;
            background: black;
            margin: 1em 0;
        }

        #chat-copy-settings #close-config-button {
            display: block;
            margin-top: 1em;
            margin-left: auto;
            font-size: 1rem;
            font-weight: 600;
            padding: .5em 1em;
            background: var(--dcs-blue);
            color: white;
            box-shadow: var(--dcs-box-shadow);
            border-radius: 1em;
        }

        #chat-copy-settings #close-config-button span {
            filter: var(--dcs-drop-shadow);
        }

        #clear-settings-button {
            display: none;
        }

        #direct-messages-SBB, #servers-footer-SBB, #settings-SBB {
            background: var(--dcs-blue);
            color: white;
            text-align: center;
            box-shadow: var(--dcs-box-shadow);

        }

        #direct-messages-SBB span, #servers-footer-SBB span, #settings-SBB span {
            filter: var(--dcs-drop-shadow);

        }

        #direct-messages-SBB {
            width: fit-content;
            line-height: normal;
            padding: .5em 1em;
            box-shadow: var(--dcs-box-shadow-2);
            margin-top: .25em;
            border-radius: 2em;
        }

        #servers-footer-SBB {
            /* margin-left: 12px; */
            padding: .5em;
            border-radius: 1em;
            margin-right: 1px;
            margin-bottom: .33em;
            box-shadow: var(--dcs-box-shadow-2);
        }

        #servers-footer-SBB span {

        }

        #settings-SBB {
            line-height: normal;
            width: fit-content;
            padding: .5em 1em;
            border-radius: 2em;
            translate: -.5em 0;

        }


        @keyframes moveAndFadeOut {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
         25% {
            opacity: 0.5;
          }
          50% {
            opacity: 0;
          }
          100% {
            transform: translate(-100vw, 100vh); /* Moving to bottom left off-screen */
            opacity: 0;
            visibility: hidden; /* Hides the element completely after animation */
          }
        }

        #copy-button-outer.move-fade-out {
          animation: moveAndFadeOut 2s ease-out forwards; /* Adjust duration as needed */
        }

        #chat-copy-instruction {
            margin-bottom: 1em;
            height: fit-content;
        }

        #chat-copy-instruction h1 {
            font-size: 1.5em;
            font-weight: bold;
            line-height: 1.15;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            color: white;
            margin-bottom: 0.65em;
        }

        #chat-copy-instruction h1::before {
            content: '';
            z-index: -1;
            width: 100%;
            height: 100%;
            --bottom-extra: 0.1em;
            padding: .25em 0.5em calc(0.25em + var(--bottom-extra));
            margin-top: var(--bottom-extra);
            background: linear-gradient(to right, hsl(330, 100%, 40%), hsla(330, 100%, 40%, 0.5));
            position: absolute;
        }

        #chat-copy-instruction h1 span {
            margin-right: auto;
            filter: var(--dcs-drop-shadow);
        }

        #chat-copy-instruction h2 {
            font-size: 1.2em;
            font-weight: bold;
        }

        #chat-copy-instruction ul {
            list-style-type: disc;  /* Ensures bullets are shown */
            padding-left: 20px;     /* Optional: Adds indentation to the list */
        }

        #chat-copy-instruction p {
            line-height: 1.15em;
        }

        #chat-copy-instruction #close-instruction-button {
            position: absolute;
            display: block;
            margin-top: 1em;
            margin-left: auto;
            font-size: 1rem;
            font-weight: 600;
            padding: .5em 1em;
            background: var(--dcs-blue);
            color: white;
            box-shadow: var(--dcs-box-shadow);
            border-radius: 1em;
            bottom: 2em;
            right: 2em;
        }

        #chat-copy-instruction #close-instruction-button span {
            filter: var(--dcs-drop-shadow);
        }

        #chat-copy-instruction strong {
            font-weight: bold;
        }

        #chat-copy-instruction a {
            font-weight: bold;
        }

        #autoscroll-button {
            aspect-ratio: unset;
            background: var(--dcs-yellow);
        }

        #autoscroll-div {
            position: absolute;
            bottom: 0;
            right: calc(2em * var(--scale-factor));
            margin-bottom: calc(5em * var(--scale-factor) + 24px);
            scale: var(--scale-factor);
            transform-origin: bottom center;
        }

        #autoscroll-div > * {
            position: relative;
        }

        #autoscroll-option-now radio, #autoscroll-option-date radio {
            margin-left: 0;
        }

        #autoscroll-option-now, #autoscroll-option-date,
        #autoscroll-stop-button, #autoscroll-return-button {
            background: var(--dcs-yellow);
            padding: .25em 0.5em;
            border-radius: .5em;
            box-shadow: var(--dcs-box-shadow);
        }

        #autoscroll-control {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        #autoscroll-control .arrow, #autoscroll-option-date, #autoscroll-option-now,
        #autoscroll-option-date *, #autoscroll-option-now *,
        #autoscroll-stop-button, #autoscroll-return-button {
            cursor: pointer;
            color: black;
        }

        #autoscroll-option-now, #autoscroll-option-date {
                        gap: .33em;
                        display: flex;
                        align-items: center;
        }

        #date-div {
            color: black;
        }

        #autoscroll-option-now, #autoscroll-option-now label {
            display: flex;
        }

        #autoscroll-option-date input, #autoscroll-option-now input {
            margin: 0;
        }

        #autoscroll-control .arrow {
            filter: var(--dcs-drop-shadow);
            height: 4em;
            width: 3em;
        }

        #autoscroll-control .arrow * {
            background: var(--dcs-yellow);
            height: 100%;
            width: 100%;
            position: absolute;
        }

        #up-arrow-level-2 {
            clip-path: polygon(50% 12.5%, 16.667% 50%, 33.333% 50%, 33.333% 87.5%, 50% 87.5%, 66.667% 87.5%, 66.667% 50%, 83.333% 50%, 50% 12.5%);
        }

        #up-arrow-level-4A, #up-arrow-level-4A-copy {
            clip-path: polygon(0 0, 50% 0, 50% 12.5%, 16.667% 50%, 33.333% 50%, 33.333% 87.5%, 50% 87.5%, 50% 100%, 0 100%, 0 0);
        }

        #up-arrow-level-4B, #up-arrow-level-4B-copy {
            clip-path: polygon(100% 100%, 50% 100%, 50% 87.5%, 66.667% 87.5%, 66.667% 50%, 83.333% 50%, 50% 12.5%, 50% 0, 100% 0, 100% 100%);
        }

        #down-arrow-level-2 {
            clip-path: polygon(50% 87.5%, 16.667% 50%, 33.333% 50%, 33.333% 12.5%, 50% 12.5%, 66.667% 12.5%, 66.667% 50%, 83.333% 50%, 50% 87.5%);
        }

        #down-arrow-level-2, #up-arrow-level-2 {
            --numberval: .1em;
            --negnum: calc(var(--numberval) * -1);
            --dubnum: calc(var(--numberval)* 2);
            --factor: 1.5;
            --hilight: calc(0.35 * var(--factor));
            --shadow: calc(0.25 * var(--factor));
        }

        #down-arrow-level-4A, #down-arrow-level-4A-copy {
            clip-path: polygon(0 100%, 50% 100%, 50% 87.5%, 16.667% 50%, 33.333% 50%, 33.333% 12.5%, 50% 12.5%, 50% 0, 0 0, 0 100%);
        }

        #down-arrow-level-4B, #down-arrow-level-4B-copy {
            clip-path: polygon(100% 0, 50% 0, 50% 12.5%, 66.667% 12.5%, 66.667% 50%, 83.333% 50%, 50% 87.5%, 50% 100%, 100% 100%, 100% 0);
        }

        #up-arrow-level-3, #down-arrow-level-3 {
            background: none !important;
            filter: drop-shadow(var(--numberval) var(--numberval) var(--numberval) hsla(0, 0%, 100%, var(--hilight)));
        }

        #up-arrow-level-3-copy, #down-arrow-level-3-copy {
            background: none !important;

            filter: drop-shadow(var(--negnum) var(--negnum) var(--numberval) hsla(0, 0%, 0%, var(--shadow)));
        }

        #date-div {
            display: grid;
            grid-template-columns: auto auto auto;
            grid-template-rows: auto auto;
            gap: 0.25em;
            background: white;
        }

        #date-div * {
            text-align: center;
            font-size: 0.75em;
            max-width: 9.5em;
        }

        #date-div span {
            text-align: center;
            width: fit-content;
            margin: auto;
        }

        #date-div input {
            width: 2.5em;
        }

        #date-div input:first-of-type {
            width: 4em;
        }

        #date-div #time-zone-warning {
            grid-column: span 3;
        }

        #autoscroll-stop-button {

        }

        @keyframes blink {
            0% {
                background-color: var(--dcs-yellow);
            }
            50% {
                background-color: yellow; /* Change this to your desired color */
            }
            100% {
                background-color: var(--dcs-yellow);
            }
        }

        .blinking-arrow-button {
            animation: blink 1s infinite; /* 1s duration and infinite loop */
        }

        #current-date {
            font-size: 0.8em;
            display: flex;
            flex-direction: column;
            background: white;
            padding: 0.5em;
            text-align: center;
        }

        #time-zone-warning {
            max-width: 9.5em;
        }

    `;
		document.head.appendChild(style);

		// Variables
		const foundChats = new WeakSet();
		let debounceTimeout;

		// Drag-and-Drop Functionality
		function makeDraggable(element) {
				const dragBar = element.querySelector('.drag-bar');
				let isDragging = false,
						offsetX, offsetY;

				dragBar.addEventListener('mousedown', (e) => {
						isDragging = true;
						offsetX = e.clientX - element.offsetLeft;
						offsetY = e.clientY - element.offsetTop;
						document.addEventListener('mousemove', onDrag);
						document.addEventListener('mouseup', stopDrag);
				});

				function onDrag(e) {
						if (!isDragging) return;

						// Calculate new position
						let newX = e.clientX - offsetX;
						let newY = e.clientY - offsetY;

						// Constrain position to prevent going out of bounds
						newX = Math.max(0, Math.min(newX, window.innerWidth - element.offsetWidth));
						newY = Math.max(0, Math.min(newY, window.innerHeight - element.offsetHeight));

						element.style.left = `${newX}px`;
						element.style.top = `${newY}px`;
				}

				function stopDrag() {
						isDragging = false;
						document.removeEventListener('mousemove', onDrag);
						document.removeEventListener('mouseup', stopDrag);
				}

				// Adjust position if the viewport size changes
				window.addEventListener('resize', () => {
						const currentLeft = parseInt(element.style.left, 10) || 0;
						const currentTop = parseInt(element.style.top, 10) || 0;

						// Constrain position based on new viewport dimensions
						const newLeft = Math.min(currentLeft, window.innerWidth - element.offsetWidth);
						const newTop = Math.min(currentTop, window.innerHeight - element.offsetHeight);

						element.style.left = `${Math.max(0, newLeft)}px`;
						element.style.top = `${Math.max(0, newTop)}px`;
				});
		}

		// Add Resizable Functionality
		function makeResizable(element) {
				const resizeHandle = element.querySelector('.resize-handle');
				let isResizing = false,
						startWidth, startHeight, startX, startY;

				resizeHandle.addEventListener('mousedown', (e) => {
						isResizing = true;
						startWidth = element.offsetWidth;
						startHeight = element.offsetHeight;
						startX = e.clientX;
						startY = e.clientY;
						document.addEventListener('mousemove', onResize);
						document.addEventListener('mouseup', stopResize);
				});

				function onResize(e) {
						if (!isResizing) return;
						element.style.width = `${startWidth + (e.clientX - startX)}px`;
						element.style.height = `${startHeight + (e.clientY - startY)}px`;
				}

				function stopResize() {
						isResizing = false;
						document.removeEventListener('mousemove', onResize);
						document.removeEventListener('mouseup', stopResize);
				}
		}

		// Handle Button Click
		function createChatCopyUI(chatElement) {
				logMinor('Creating chat copy div...');

				let main = document.querySelector('main[class*="chatContent"]') ||
						document.querySelector('section[class*="chatContent"]');

				// Check if the UI already exists
				if (main.querySelector('#chat-copy-outer')) return;

				// Create outer container
				const outerDiv = document.createElement('div');
				outerDiv.id = 'chat-copy-outer';

				// Create drag bar
				const dragBar = document.createElement('div');
				dragBar.className = 'drag-bar';
				const dragBarSpan = document.createElement('span');
				dragBarSpan.textContent = 'Copy';
				dragBar.appendChild(dragBarSpan);

				// Create close box
				const closeBox = document.createElement('div');
				closeBox.className = 'close-box';
				closeBox.textContent = '×';
				closeBox.addEventListener('click', () => {
						// stopScrolling();
						outerDiv.remove();
						stopScrollingVar = true;
						if (chatObserver) {
								chatObserver.disconnect();
								logMinor('Observer disconnected.');
						}
				});

				// Create resizable handle
				const resizeHandle = document.createElement('div');
				resizeHandle.className = 'resize-handle';

				// Create inner content area
				const innerDiv = document.createElement('div');
				innerDiv.id = 'chat-copy-inner';

				logMinor('Reached append stage.');

				// Append elements
				outerDiv.appendChild(dragBar);
				outerDiv.appendChild(closeBox);
				outerDiv.appendChild(innerDiv);
				outerDiv.appendChild(resizeHandle);
				main.appendChild(outerDiv);

				const copyButton = document.getElementById('copy-button-inner');
				const rect = copyButton.getBoundingClientRect();

				outerDiv.style.top = `${rect.top}px`; // Align with the top of the button
				outerDiv.style.right = `${window.innerWidth - rect.right - 0.2 * parseFloat(getComputedStyle(document.documentElement).fontSize)}px`; // Align with the right of the button, adding 0.2em

				// Create recording bar
				const recordingBar = document.createElement('div');
				recordingBar.className = 'recording-bar';
				const recordingBarSpan = document.createElement('span');

				recordingBarSpan.textContent = 'Recording';

				// Append the recording bar to the outerDiv
				outerDiv.appendChild(recordingBar);
				recordingBar.appendChild(recordingBarSpan);

				// Make it draggable and resizable
				makeDraggable(outerDiv);
				makeResizable(outerDiv);

				copyChatMessages(chatElement);

				const saveButton = document.createElement('div');
				saveButton.id = "chat-copy-save-button";
				saveButton.classList.add('chat-copy-big-button');
				const saveButtonSpan = document.createElement('span');
				saveButtonSpan.textContent = "Save";

				const configButton = document.createElement('div');
				configButton.id = "chat-copy-config-button";
				configButton.classList.add('chat-copy-big-button');
				const configButtonSpan = document.createElement('span');
				configButtonSpan.textContent = "⚙";

				const instructionButton = document.createElement('div');
				instructionButton.id = "chat-copy-instruction-button";
				instructionButton.classList.add('chat-copy-big-button');
				const instructionButtonSpan = document.createElement('span');
				instructionButtonSpan.textContent = "❓";

				const saveSizeSpan = document.createElement('span');
				saveSizeSpan.textContent = "Save";
				saveSizeSpan.classList.add('save-size-span');
				const saveSizeSpan2 = saveSizeSpan.cloneNode(true);



				saveButton.appendChild(saveButtonSpan);
				outerDiv.appendChild(saveButton);

				configButton.appendChild(configButtonSpan);
				configButton.appendChild(saveSizeSpan);
				outerDiv.appendChild(configButton);

				instructionButton.appendChild(instructionButtonSpan);
				instructionButton.appendChild(saveSizeSpan2);
				outerDiv.appendChild(instructionButton);

				saveButton.addEventListener('click', () => {
						saveChatContent(innerDiv);
				});

				configButton.addEventListener('click', () => {
						openconfig(innerDiv);
				});

				instructionButton.addEventListener('click', () => {
						openInstructions(innerDiv);
				});

				// Create autoscroll button
				const autoscrollDiv = document.createElement('div');
				autoscrollDiv.id = 'autoscroll-div';
				const autoscrollButton = document.createElement('div');
				autoscrollButton.id = "autoscroll-button";
				autoscrollButton.classList.add('chat-copy-big-button');
				const autoscrollSpan = document.createElement('span');
				autoscrollSpan.textContent = "Autoscroll...";
				autoscrollButton.appendChild(autoscrollSpan);
				autoscrollDiv.appendChild(autoscrollButton);
				outerDiv.appendChild(autoscrollDiv);

				autoscrollButton.addEventListener('click', () => {
						openAutoscrollControl(autoscrollDiv, autoscrollButton);
				});

		}

		let date = false;
		let dateStored = false;
		let autoscrollStage = 1;

		function resetDate() {
				date = false;
				logMinor('Date has been reset.');
		}



		function openAutoscrollControl(autoscrollDiv, autoscrollButton) {
				autoscrollStage = 2;
				resetDate();
				// Hide the autoscroll button
				autoscrollButton.style.display = 'none';

				// Create autoscroll control container
				const autoscrollControl = document.createElement('div');
				autoscrollControl.id = "autoscroll-control";
				// autoscrollControl.style.display = 'flex';
				// autoscrollControl.style.flexDirection = 'column';
				// autoscrollControl.style.alignItems = 'center';
				// autoscrollControl.style.gap = '10px';

				// Create up arrow
				const upArrow = document.createElement('div');
				upArrow.id = 'up-arrow';
				upArrow.className = 'arrow';
				// upArrow.innerHTML = `
				// <svg width="36" height="48" viewBox="10 4 4 12" xmlns="http://www.w3.org/2000/svg">
				//     <path d="M 14 16 L 10 16 L 10 10 L 8 10 L 12 4 L 16 10 L 14 10 Z" fill="currentColor"></path>
				// </svg>`;
				const upArrowL2 = document.createElement('div');
				upArrowL2.id = 'up-arrow-level-2';
				const upArrowL3 = document.createElement('div');
				upArrowL3.id = 'up-arrow-level-3';
				const upArrowL3copy = document.createElement('div');
				upArrowL3copy.id = 'up-arrow-level-3-copy';
				const upArrowL4A = document.createElement('div');
				upArrowL4A.id = 'up-arrow-level-4A';
				const upArrowL4Acopy = document.createElement('div');
				upArrowL4Acopy.id = 'up-arrow-level-4A-copy';
				const upArrowL4B = document.createElement('div');
				upArrowL4B.id = 'up-arrow-level-4B';
				const upArrowL4Bcopy = document.createElement('div');
				upArrowL4Bcopy.id = 'up-arrow-level-4B-copy';

				upArrow.appendChild(upArrowL2);
				upArrowL2.appendChild(upArrowL3);
				upArrowL2.appendChild(upArrowL3copy);
				upArrowL3.appendChild(upArrowL4A);
				upArrowL3.appendChild(upArrowL4B);
				upArrowL3copy.appendChild(upArrowL4Acopy);
				upArrowL3copy.appendChild(upArrowL4Bcopy);

				// Create radio group
				const radioGroupNow = document.createElement('div');
				radioGroupNow.id = 'autoscroll-option-now';
				const radioGroupDate = document.createElement('div');
				radioGroupDate.id = 'autoscroll-option-date';

				// First radio: "Now"
				const nowRadio = document.createElement('input');
				nowRadio.type = 'radio';
				nowRadio.name = 'autoscroll';
				nowRadio.id = 'autoscroll-now';
				nowRadio.checked = true;

				const nowLabel = document.createElement('label');
				nowLabel.htmlFor = 'autoscroll-now';
				nowLabel.innerHTML = 'First/<br>Last';

				// Second radio: "Date"
				const dateRadio = document.createElement('input');
				dateRadio.type = 'radio';
				dateRadio.name = 'autoscroll';
				dateRadio.id = 'autoscroll-date';

				const dateLabel = document.createElement('label');
				dateLabel.htmlFor = 'autoscroll-date';
				dateLabel.textContent = 'Date';

				// Append radios and labels
				radioGroupNow.appendChild(nowRadio);
				radioGroupNow.appendChild(nowLabel);
				radioGroupDate.appendChild(dateRadio);
				radioGroupDate.appendChild(dateLabel);

				// Create down arrow
				const downArrow = document.createElement('div');
				downArrow.id = 'down-arrow';
				downArrow.className = 'arrow';
				// downArrow.innerHTML = `
				// <svg width="36" height="48" viewBox="10 8 4 12" xmlns="http://www.w3.org/2000/svg">
				//     <path d="M 10 8 L 14 8 L 14 14 L 16 14 L 12 20 L 8 14 L 10 14 Z" fill="currentColor"></path>
				// </svg>`;
				const downArrowL2 = document.createElement('div');
				downArrowL2.id = 'down-arrow-level-2';
				const downArrowL3 = document.createElement('div');
				downArrowL3.id = 'down-arrow-level-3';
				const downArrowL3copy = document.createElement('div');
				downArrowL3copy.id = 'down-arrow-level-3-copy';
				const downArrowL4A = document.createElement('div');
				downArrowL4A.id = 'down-arrow-level-4A';
				const downArrowL4Acopy = document.createElement('div');
				downArrowL4Acopy.id = 'down-arrow-level-4A-copy';
				const downArrowL4B = document.createElement('div');
				downArrowL4B.id = 'down-arrow-level-4B';
				const downArrowL4Bcopy = document.createElement('div');
				downArrowL4Bcopy.id = 'down-arrow-level-4B-copy';

				downArrow.appendChild(downArrowL2);
				downArrowL2.appendChild(downArrowL3);
				downArrowL2.appendChild(downArrowL3copy);
				downArrowL3.appendChild(downArrowL4A);
				downArrowL3.appendChild(downArrowL4B);
				downArrowL3copy.appendChild(downArrowL4Acopy);
				downArrowL3copy.appendChild(downArrowL4Bcopy);

				// Add Return button
				const returnButtonDiv = document.createElement('div');
				returnButtonDiv.id = 'autoscroll-return-button';
				const returnButtonSpan = document.createElement('span');
				returnButtonSpan.textContent = 'Return';
				returnButtonDiv.appendChild(returnButtonSpan);



				// Append all elements to autoscroll control
				autoscrollControl.appendChild(upArrow);
				autoscrollControl.appendChild(radioGroupNow);
				autoscrollControl.appendChild(radioGroupDate);
				autoscrollControl.appendChild(returnButtonDiv);
				autoscrollControl.appendChild(downArrow);

				// Append autoscroll control to the div
				autoscrollDiv.appendChild(autoscrollControl);

				// Add listeners for upArrow and downArrow
				upArrow.addEventListener('click', () => autoscroll('up', upArrowL2, downArrowL2));
				downArrow.addEventListener('click', () => autoscroll('down', upArrowL2, downArrowL2));

				// Add listeners for radio groups
				radioGroupNow.addEventListener('change', () => displayDate('remove'));
				radioGroupDate.addEventListener('change', () => displayDate('show', radioGroupDate));

				// Add event listener for the return button
				returnButtonDiv.addEventListener('click', () => autoscrollReturn(autoscrollControl, autoscrollButton));
		}




		let activeScroll = null; // Declare the autoscroll interval globally

		function autoscrollReturn(autoscrollControl, autoscrollButton) {
				// Remove autoscroll control
				autoscrollControl.remove();

				// Show the autoscroll button again
				autoscrollButton.style.removeProperty('display');

				// Stop any active autoscroll
				if (activeScroll) {
						clearInterval(activeScroll);
						activeScroll = null;
				}
				resetDate();

				if (autoscrollStage === 3) {
						const autoscrollDiv = document.querySelector('#chat-copy-outer #autoscroll-div');
						openAutoscrollControl(autoscrollDiv, autoscrollButton)
						autoscrollStage = 2;
				} else {
						autoscrollStage = 1;
				}
		}


		function autoscroll(direction, upArrow, downArrow) {
				stopScrollingVar = false;
				autoscrollStage = 3;
				// Find the chat container element using the provided selectors
				const chatElement = document.querySelector('main[class*="chatContent"] [class*="scrollerBase"], section[class*="chatContent"] [class*="scrollerBase"]');

				if (!chatElement) {
						console.error('Chat element not found!');
						return;
				} else {
						logMinor(chatElement);
				}

				if (direction === 'up') {
						upArrow.classList.add('blinking-arrow-button'); // Add blinking class to upArrow
						downArrow.classList.remove('blinking-arrow-button'); // Remove blinking class from downArrow
				} else if (direction === 'down') {
						downArrow.classList.add('blinking-arrow-button'); // Add blinking class to downArrow
						upArrow.classList.remove('blinking-arrow-button'); // Remove blinking class from upArrow
				}

				const timeZoneWarning = document.querySelector('#date-div #time-zone-warning');
				if (timeZoneWarning) {
						timeZoneWarning.remove();
				}

				// Check if a stop button already exists
				let stopButtonDiv = document.querySelector('#autoscroll-stop-button');
				if (stopButtonDiv) {
						// If the button exists, clear the existing scroll to allow a new one to start
						clearInterval(window.activeScroll);
						window.activeScroll = null;
						clearInterval(activeScroll);
						activeScroll = null;
				} else {
						// If the stop button does not exist, create it
						stopButtonDiv = document.createElement('div');
						stopButtonDiv.id = 'autoscroll-stop-button'; // Add ID for styling
						const stopButtonSpan = document.createElement('span');
						stopButtonSpan.textContent = 'Stop';
						stopButtonDiv.appendChild(stopButtonSpan);

						// Insert Stop button between the arrows
						const autoscrollControl = document.getElementById('autoscroll-control'); // Assuming this is the container for the arrows and the stop button
						const downArrow = document.getElementById('down-arrow'); // Assuming IDs for upArrow and downArrow
						autoscrollControl.insertBefore(stopButtonDiv, downArrow);
				}

				// Remove #autoscroll-option-now and #autoscroll-option-date if present
				const nowOption = document.getElementById('autoscroll-option-now');
				const dateOption = document.getElementById('autoscroll-option-date');
				if (nowOption) nowOption.remove();
				if (!date) {
						if (dateOption) dateOption.remove();
				} else {
						// Create the #current-date div if it doesn't exist
						let currentDateDiv = document.querySelector('#current-date');
						if (!currentDateDiv) {
								currentDateDiv = document.createElement('div');
								currentDateDiv.id = 'current-date';

								const currentDateLabel = document.createElement('span');
								currentDateLabel.textContent = 'Current date:';

								const currentDateSpan = document.createElement('span');
								currentDateSpan.id = 'current-date-span';
								currentDateSpan.textContent = '...'; // Placeholder content

								currentDateDiv.appendChild(currentDateLabel);
								currentDateDiv.appendChild(currentDateSpan);

								const dateDiv = document.getElementById('date-div'); // Assuming this is where the new div should be inserted
								// Append currentDateDiv after dateDiv
								dateDiv.parentNode.insertBefore(currentDateDiv, dateDiv.nextSibling);
						}
				}

				let dateTime;

				// Function to update the #current-date-span with the current date
				function updateCurrentDateSpan(currentMessage) {

						if (currentMessage) {

								const timeElement = currentMessage.querySelector('time');
								if (timeElement && timeElement.hasAttribute('datetime')) {

										// Get the datetime attribute and hack off the 'T' and everything after it
										dateTime = timeElement.getAttribute('datetime').split('T')[0]; // Take only the date part
										const currentDateSpan = document.getElementById('current-date-span');
										// logMinor('Extracting date from current message: ' + datetime);
										if (currentDateSpan) {
												currentDateSpan.textContent = dateTime; // Update the span content with the date
										}
								} else {
										// logMinor('timeElement: ' + timeElement.outerHTML + '\ntimeElement.datetime: ' + timeElement.datetime);
								}
						}
				}

				// Scroll setup
				const scrollSpeed = 100; // Pixels per scroll interval
				const interval = 50; // Interval in milliseconds
				const timeoutDuration = 5000; // 2.5 seconds of inactivity

				// Check and clear any active scroll to avoid stacking
				if (activeScroll) {
						clearInterval(activeScroll);
						activeScroll = null;
				}

				let lastMessage = null;
				let lastMessagePosition = 0;
				// let lastChangeTime = Date.now(); // Initialize with the current time
				let timeoutIntervals = timeoutDuration / interval;
				let currentInterval = 0;
				let lastChangeInterval = 0;
				let dateReached = false;

				// Start the autoscroll routine
				activeScroll = setInterval(() => {
						if (stopScrollingVar) {
								stopScrolling();
						}

						let currentMessage = null;
						let currentMessagePosition = 0;
						currentInterval += 1;

						if (direction === 'up') {
								chatElement.scrollBy(0, -scrollSpeed); // Scroll up
								currentMessage = chatElement.querySelector('li[id^="chat-messages"]');
								if (currentMessage) {
										currentMessagePosition = currentMessage.getBoundingClientRect().top;
								}
						} else if (direction === 'down') {
								chatElement.scrollBy(0, scrollSpeed); // Scroll down
								const messages = chatElement.querySelectorAll('li[id^="chat-messages"]');
								currentMessage = messages[messages.length - 1];
								if (currentMessage) {
										currentMessagePosition = currentMessage.getBoundingClientRect().bottom;
								}
						}

						if (date) {
								// Update current date span
								updateCurrentDateSpan(currentMessage); // Call the function to update the current date
						} else {
								// logMinor('No date.');
						}

						// Check if the message has changed or if the position has changed
						if (currentMessage !== lastMessage || currentMessagePosition !== lastMessagePosition) {
								lastMessage = currentMessage;
								lastMessagePosition = currentMessagePosition;
								lastChangeInterval = currentInterval;
								// lastChangeTime = Date.now(); // Reset the timeout when the message or position changes
						}

						// Stop scrolling after 2.5 seconds of no change
						// if (Date.now() - lastChangeTime >= timeoutDuration) {
						//     stopScrolling();
						//     logMinor('Autoscroll stopped due to inactivity.');
						// }
						if (currentInterval - lastChangeInterval >= timeoutIntervals) {
								stopScrolling();
								logMinor('Autoscroll stopped due to inactivity.');
						}

						if (date) {
								const [year, month, day] = dateTime.split('-'); // Destructure the split result
								const dateMap = {
										year: parseInt(year, 10),
										month: parseInt(month, 10),
										day: parseInt(day, 10)
								};

								logMinor('date: ' + JSON.stringify(date) + '; dateMap: ' + JSON.stringify(dateMap));

								if (direction === 'up') {
										if (dateMap.year < date.year) {
												dateReached = true;
										} else if (dateMap.year === date.year && dateMap.month < date.month) {
												dateReached = true;
										} else if (
												dateMap.year === date.year &&
												dateMap.month === date.month &&
												dateMap.day < date.day
										) {
												dateReached = true;
										}
								} else if (direction === 'down') {
										if (dateMap.year > date.year) {
												dateReached = true;
										} else if (dateMap.year === date.year && dateMap.month > date.month) {
												dateReached = true;
										} else if (
												dateMap.year === date.year &&
												dateMap.month === date.month &&
												dateMap.day > date.day
										) {
												dateReached = true;
										}
								}
						}

						if (dateReached) {
								stopScrolling();
								logMinor('Target date has been included.');
						}

				}, interval);

				// Add listener to stop button
				stopButtonDiv.addEventListener('click', () => {
						stopScrolling();
						// Remove the stop button
				});

				function stopScrolling() {
						clearInterval(activeScroll); // Stop the autoscroll
						activeScroll = null; // Clear the activeScroll variable to ensure no active autoscroll routine is left
						downArrow.classList.remove('blinking-arrow-button');
						upArrow.classList.remove('blinking-arrow-button');
						let currentInterval = 0;
						let lastChangeInterval = 0;
						if (stopButtonDiv) {
								stopButtonDiv.remove();
						}
						dateReached = false;
						stopScrollingVar = false;

				}

		}


		function displayDate(argument, radioGroupDate) {
				logMinor('Creating date div...');
				const existingDateDiv = document.getElementById('date-div');
				if (argument === 'show') {
						if (existingDateDiv) {
								return;
						}

						// Create the date div
						const dateDiv = document.createElement('div');
						dateDiv.id = 'date-div';

						// Create the first row (YYYY, MM, DD)
						const labels = ['YYYY', 'MM', 'DD'];
						labels.forEach(label => {
								const span = document.createElement('span');
								span.textContent = label;
								dateDiv.appendChild(span);
						});

						let values;
						date = {
								year: null,
								month: null,
								day: null
						};

						// If dateStored exists, use those values; otherwise, use the current date
						if (dateStored) {
								values = [
                dateStored.year, // Use stored year
                String(dateStored.month).padStart(2, '0'), // Use stored month
                String(dateStored.day).padStart(2, '0') // Use stored day
            ];
								date = {
										year: parseInt(dateStored.year, 10), // Use stored year
										month: parseInt(dateStored.month, 10), // Use stored month (formatted as 2 digits)
										day: parseInt(dateStored.day, 10) // Use stored day (formatted as 2 digits)
								};
						} else {
								const currentDate = new Date();
								values = [
                currentDate.getFullYear(), // Current year
                String(currentDate.getMonth() + 1).padStart(2, '0'), // Current month
                String(currentDate.getDate()).padStart(2, '0') // Current day
            ];
								date = {
										year: currentDate.getFullYear(), // Current year
										month: currentDate.getMonth() + 1, // Current month
										day: currentDate.getDate() // Current day
								};
						}

						// logMinor(`Date updated to: ${date.year}-${date.month}-${date.day}`);
						logMinor('Date updated to: ' + JSON.stringify(date));

						values.forEach((value, index) => {
								const input = document.createElement('input');
								input.type = 'number';
								input.value = value;

								// Configure input box sizes
								if (index === 0) input.maxLength = 4; // YYYY
								else input.maxLength = 2; // MM or DD

								// Prevent decimals
								input.step = '1';
								if (index === 0) {
										input.min = 1000; // Min for year is 1000
										input.max = 9999; // Max for year is 9999
								} else if (index === 1) {
										input.min = 1; // Min for month is 1
										input.max = 12; // Max for month is 12
								} else if (index === 2) {
										input.min = 1; // Min for day is 1
										input.max = 31; // Max for day is 31
								}



								input.addEventListener('input', () => {
										// Update the date object whenever an input value changes
										date.year = parseInt(document.querySelector('#date-div input:nth-of-type(1)').value, 10);
										date.month = parseInt(document.querySelector('#date-div input:nth-of-type(2)').value, 10);
										date.day = parseInt(document.querySelector('#date-div input:nth-of-type(3)').value, 10);

										// Update dateStored with the new date
										dateStored = date;
										// logMinor(`Date updated to: ${date.year}-${date.month}-${date.day}`);
										logMinor('Date updated to: ' + JSON.stringify(date));
								});

								dateDiv.appendChild(input);
						});

						const timeZoneWarning = document.createElement('span');
						timeZoneWarning.id = 'time-zone-warning';
						timeZoneWarning.textContent = 'Note: Due to different time zones, date may be imprecise.';

						dateDiv.appendChild(timeZoneWarning);

						logMinor('Inserting date div...');

						// Insert the date div immediately after the radioGroupDate
						radioGroupDate.parentNode.insertBefore(dateDiv, radioGroupDate.nextSibling);

				}

				if (argument === 'remove') {
						if (existingDateDiv) {
								existingDateDiv.remove();
						}
						resetDate();
				}
		}




		// Open the instructions
		function openInstructions(innerDiv) {
				const instructionDiv = document.createElement('div');
				instructionDiv.id = "chat-copy-instruction";
				const instructionOuter = document.createElement('div');
				instructionOuter.id = "chat-copy-instruction-outer";
				instructionDiv.innerHTML = instructions;

				instructionOuter.appendChild(instructionDiv);

				if (innerDiv) {
						innerDiv.style.display = "none";
						innerDiv.insertAdjacentElement('afterend', instructionOuter);
				}

				// Close button
				const closeButton = document.createElement('button');
				const closeButtonSpan = document.createElement('span');
				closeButtonSpan.textContent = "Close";
				closeButton.appendChild(closeButtonSpan);
				closeButton.id = 'close-instruction-button';
				closeButton.addEventListener('click', () => {
						instructionOuter.remove();
						if (innerDiv) {
								innerDiv.style.display = "block";
						}
				});
				instructionDiv.appendChild(closeButton);

		}

		// Open the config options
		function openconfig(innerDiv) {
				const configDiv = document.createElement('div');
				configDiv.id = "chat-copy-settings";
				const configOuter = document.createElement('div');
				configOuter.id = "chat-copy-settings-outer";

				configOuter.appendChild(configDiv);

				if (innerDiv) {
						innerDiv.style.display = "none";
						innerDiv.insertAdjacentElement('afterend', configOuter);
				}

				// Heading
				const heading = document.createElement('h2');
				const headingSpan = document.createElement('span');
				headingSpan.textContent = "Options";
				heading.appendChild(headingSpan);
				configDiv.appendChild(heading);

				// Enable checkboxes section
				const enableText = document.createElement('h3');
				enableText.textContent = "Check these boxes to enable:";
				configDiv.appendChild(enableText);

				const createCheckbox = (id, labelText) => {
						const wrapper = document.createElement('div');
						wrapper.classList.add('wrapper');
						const wrapperInner = document.createElement('div');
						wrapperInner.classList.add('wrapper-inner');
						const checkbox = document.createElement('input');
						checkbox.type = "checkbox";
						checkbox.id = id;

						const label = document.createElement('label');
						label.htmlFor = id;
						label.textContent = labelText;

						wrapperInner.appendChild(checkbox);
						wrapperInner.appendChild(label);
						wrapper.appendChild(wrapperInner);
						return wrapper;
				};

				// Create checkboxes and assign them to constants
				const enableAttachments = createCheckbox("enable-attachments", "Attachments");
				const enableAudio = createCheckbox("enable-audio", "Audio");
				const enableFullSizeImages = createCheckbox("enable-full-size-images", "Full-Size Images");

				// Create checkboxes and assign them to constants
				const enableAttachmentsCheckbox = enableAttachments.querySelector('input');
				const enableAudioCheckbox = enableAudio.querySelector('input');
				const enableFullSizeImagesCheckbox = enableFullSizeImages.querySelector('input');

				// Append the checkboxes to the configDiv
				configDiv.appendChild(enableFullSizeImages);
				configDiv.appendChild(enableAudio);
				configDiv.appendChild(enableAttachments);

				function divide() {
						const divider = document.createElement('div');
						divider.classList.add('divider');
						configDiv.appendChild(divider);
				}

				divide();

				// Button visibility section
				const notUsingText = document.createElement('h3');
				notUsingText.textContent = "When not using the chat saver:";
				configDiv.appendChild(notUsingText);
				const orHideText = document.createElement('p');
				orHideText.textContent = "Or hide the button and open it from:";


				const createRadio = (id, name, labelText) => {
						const wrapper = document.createElement('div');
						wrapper.classList.add('wrapper');
						const wrapperInner = document.createElement('div');
						wrapperInner.classList.add('wrapper-inner');
						const radio = document.createElement('input');
						radio.type = "radio";
						radio.id = id;
						radio.name = name;

						const label = document.createElement('label');
						label.htmlFor = id;
						label.textContent = labelText;

						wrapperInner.appendChild(radio);
						wrapperInner.appendChild(label);
						wrapper.appendChild(wrapperInner);
						return wrapper;

				};

				// Create radio buttons and assign them to constants
				const showButtonCornerRadio = createRadio("show-button-corner", "button-location", "Show the button in the corner");
				const hideButtonDMRadio = createRadio("hide-button-dm", "button-location", "Direct Messages list");
				const hideButtonServersRadio = createRadio("hide-button-servers", "button-location", "Bottom of Servers sidebar");
				const hideButtonSettingsRadio = createRadio("hide-button-settings", "button-location", "Settings page");

				// Append the radio buttons and text to the configDiv
				configDiv.appendChild(showButtonCornerRadio);
				configDiv.appendChild(orHideText);
				configDiv.appendChild(hideButtonDMRadio);
				configDiv.appendChild(hideButtonServersRadio);
				configDiv.appendChild(hideButtonSettingsRadio);

				const hideNote = document.createElement('p');
				hideNote.textContent = 'Note: When you open the button, it will stay in the corner until you hide it again.';

				configDiv.appendChild(hideNote);

				divide();

				const enableLogMinor = createCheckbox("enable-log-minor", "Enable extra logs in the dev console");
				const enableLogMinorCheckbox = enableLogMinor.querySelector('input');

				configDiv.appendChild(enableLogMinor);

				// Close button
				const closeButton = document.createElement('button');
				const closeButtonSpan = document.createElement('span');
				closeButtonSpan.textContent = "Close config";
				closeButton.id = 'close-config-button';
				closeButton.addEventListener('click', () => {
						configOuter.remove();
						if (innerDiv) {
								innerDiv.style.display = "block";
						}
				});

				closeButton.appendChild(closeButtonSpan);
				configDiv.appendChild(closeButton);

				// Save the settings to localStorage
				const saveSettings = () => {
						const settings = {
								enableAttachments: enableAttachmentsCheckbox.checked,
								enableAudio: enableAudioCheckbox.checked,
								enableFullSizeImages: enableFullSizeImagesCheckbox.checked,
								buttonLocation: document.querySelector('input[name="button-location"]:checked')?.id || 'show-button-corner', // default to 'showButtonCorner' if no radio selected
								enableLogMinor: enableLogMinorCheckbox.checked, // Save the new option
						};

						// Update the new variables with the current settings
						attachmentsEnabled = settings.enableAttachments;
						audioEnabled = settings.enableAudio;
						fetchFullSize = settings.enableFullSizeImages;
						buttonGenerationLocation = settings.buttonLocation;
						showMinorLogs = settings.enableLogMinor; // Update the variable

						console.log(settings);

						localStorage.setItem('chatCopySettings', JSON.stringify(settings));

						if (buttonGenerationLocation == 'show-button-corner') {
								handleChatFound();
								buttonPlacer();
								buttonCleanup();
						} else {
								const copyButtonOuter = document.getElementById('copy-button-outer');

								if (copyButtonOuter) {
										// Add the class that triggers the animation
										copyButtonOuter.classList.add('move-fade-out');

										// Optionally, remove the element after the animation ends
										copyButtonOuter.addEventListener('animationend', () => {
												copyButtonOuter.remove(); // Remove the element once the animation is done
												buttonPlacer();
												buttonCleanup();
										});
								} else {
										buttonPlacer();
										buttonCleanup();
								}
						}
				};

				// Add event listeners to checkboxes and radio buttons
				enableAttachmentsCheckbox.addEventListener('change', saveSettings);
				enableAudioCheckbox.addEventListener('change', saveSettings);
				enableFullSizeImagesCheckbox.addEventListener('change', saveSettings);
				document.querySelectorAll('input[name="button-location"]').forEach(radio => {
						radio.addEventListener('change', saveSettings);
				});
				enableLogMinorCheckbox.addEventListener('change', saveSettings);

				// Load settings from localStorage and apply them
				const loadSettings = () => {
						const savedSettings = JSON.parse(localStorage.getItem('chatCopySettings'));
						console.log(savedSettings);

						if (savedSettings) {
								enableAttachmentsCheckbox.checked = savedSettings.enableAttachments;
								enableAudioCheckbox.checked = savedSettings.enableAudio;
								enableFullSizeImagesCheckbox.checked = savedSettings.enableFullSizeImages;
								enableLogMinorCheckbox.checked = savedSettings.enableLogMinor;

								// Set the selected radio button based on saved settings
								const radio = document.getElementById(savedSettings.buttonLocation);
								if (radio) {
										radio.checked = true;
								}
						} else {
								// Set default settings if no saved data exists
								enableAttachmentsCheckbox.checked = true;
								enableAudioCheckbox.checked = true;
								enableFullSizeImagesCheckbox.checked = true;
								document.querySelector('input[name="button-location"][id="show-button-corner"]').checked = true;
								enableLogMinorCheckbox.checked = false;
						}
				};

				// Call loadSettings when the config page is loaded
				loadSettings();

				// Create a button to clear saved settings
				const clearSettingsButton = document.createElement('button');
				clearSettingsButton.id = 'clear-settings-button';
				clearSettingsButton.textContent = "Clear Saved Settings";
				clearSettingsButton.setAttribute('disabled', '');


				// Add an event listener to clear settings on click
				clearSettingsButton.addEventListener('click', () => {
						// Remove settings from localStorage
						localStorage.removeItem('chatCopySettings');
						console.log('Settings have been cleared');

						// Optionally, reload the settings (to reset the UI)
						loadSettings(); // You can call your loadSettings function here to reset UI to defaults
				});

				// Append the button to the configDiv or wherever you'd like to display it
				configDiv.appendChild(clearSettingsButton);

		}






		// Declare the observer variable globally so it can be referenced later
		let chatObserver;

		function copyChatMessages(chatElement) {
				logMinor('Copying chat messages...');
				const innerDiv = document.querySelector('#chat-copy-inner');
				if (!innerDiv) return;

				// Clear existing content
				innerDiv.innerHTML = '';

				// Find all chat messages
				const messages = chatElement.querySelectorAll('li[id^="chat-messages"]');
				if (!messages.length) {
						innerDiv.textContent = 'No messages found.';
						return;
				}

				// Add messages to the innerDiv in order
				const seenMessages = new Set();
				messages.forEach(message => {
						seenMessages.add(message.id);
						const clonedMessage = message.cloneNode(true);
						innerDiv.appendChild(clonedMessage);
				});

				logMinor(`${messages.length} messages copied.`);



				let processTimeout = null; // Timeout for batching updates

				// Function to process all messages in the container
				const processAllMessages = () => {
						const messageNodes = Array.from(document.querySelectorAll('li[id^="chat-messages"]')); // Select all message nodes

						messageNodes.forEach(node => {
								if (!seenMessages.has(node.id)) {
										// New message: Add it
										const clonedMessage = node.cloneNode(true);
										const messageIDs = Array.from(innerDiv.children).map(child => child.id);

										// // Find the correct position based on IDs
										// const index = messageIDs.findIndex(id => id > node.id);

                    const messageTimes = Array.from(innerDiv.children).map(child => {
                        const timeElement = child.querySelector('time');
                        return timeElement ? timeElement.getAttribute('datetime') : null;
                    });

                    const newMessageTime = node.querySelector('time')?.getAttribute('datetime') || '';

                    // Find the correct position based on datetime
                    const index = messageTimes.findIndex(existingTime => existingTime && existingTime > newMessageTime);

										if (index === -1) {
												innerDiv.appendChild(clonedMessage); // Append at the end
										} else {
												innerDiv.insertBefore(clonedMessage, innerDiv.children[index]); // Insert at the correct position
										}

										seenMessages.add(node.id);
										logMinor(`New message added: ${node.id}`);
								} else {
										// Existing message: Update it if content differs
										const existingMessage = innerDiv.querySelector(`#${node.id}`);
										if (existingMessage && existingMessage.innerHTML !== node.innerHTML) {
												existingMessage.innerHTML = node.innerHTML;
												logMinor(`Message updated: ${node.id}`);
										}
								}
						});

						processTimeout = null; // Reset timeout
				};

				// Function to handle mutations
				const onNewMessages = (mutations) => {
						mutations.forEach(mutation => {
								if (mutation.type === 'childList') {
										// Set a timeout to process all messages (if not already set)
										if (!processTimeout) {
												processTimeout = setTimeout(processAllMessages, 1000); // Process after 1 second
										}
								}
						});
				};





				// Set up the observer
				if (chatObserver) chatObserver.disconnect(); // Disconnect existing observer if any
				chatObserver = new MutationObserver(onNewMessages);
				chatObserver.observe(chatElement, {
						childList: true,
						subtree: true
				});
		}






		// Ensure JSZip is available
		let jszipAvailable = typeof JSZip !== "undefined";

		// Function to clean the image URL (remove query parameters like ?size=80)
		function cleanUrl(url) {
				return url.split('?')[0]; // Remove anything after '?' in the URL
		}



		// Function to fetch and return the full-size image URL (removing size, width, height, and format parameters)
		function getFullSizeImageUrl(imageUrl) {
				const cleanedUrl = imageUrl.replace(/[?&](size|width|height|format)=[^&]*/g, "");
				return cleanedUrl.replace(/\?$/, ""); // Remove the '?' if it's left hanging after removing parameters
		}


		// Function to extract the image URL from the outerHTML
		function extractImageUrlFromOuterHTML(image) {
				logMinor('image outer html: ' + image.outerHTML);
				const regex = /src=["']([^"']+)["']/; // Matches both " and ' around the URL
				const match = image.outerHTML.match(regex); // Extract the URL

				if (match) {
						return match[1]; // Return the first captured group (the URL)
				} else {
						logError('Image source URL not found in outerHTML.');
						return null;
				}
		}


		// Function to fetch and add images to the ZIP file
		function addImagesToZip(innerDiv, zip, imageMap, htmlContent) {
				logMajor('Fetching and adding images to ZIP...')
				let images;
				if (audioEnabled) {
						images = innerDiv.querySelectorAll('img, video, audio source');
				} else {
						images = innerDiv.querySelectorAll('img, video');
						logMajor('Audio fetching disabled. Skipping.');
				}

				const imagePromises = []; // Track all fetch promises to ensure we wait for them
				let imageIndex = 0;

				images.forEach((image, index) => {
						const imageUrl = image.src; // Use the original image URL without cleaning
						// const imageUrlRaw = image.getAttribute('src');
						let imageUrlRaw = extractImageUrlFromOuterHTML(image);

						// If extraction fails, fallback to image.src
						if (!imageUrlRaw) {
								imageUrlRaw = imageUrl; // Fallback to image.src if extraction fails
						}

						logMinor("Image HTML:", image.outerHTML);
						logMinor('imageUrl: ' + imageUrl + '; imageUrlRaw: ' + imageUrlRaw);

						if (imageUrl && imageUrl.startsWith("http")) { // Ensure valid HTTP/HTTPS link
								if (!imageMap.has(imageUrlRaw)) { // If this image has not been processed
										logMajor(`Downloading image: ${imageUrl}`);

										imageIndex += 1;

										// Remove query parameters, but keep the size parameter
										const urlWithoutParams = imageUrl.split('?')[0]; // Base URL without query parameters

										// Match the "size", "width", and "height" parameters from the URL
										const sizeParamMatch = imageUrl.match(/[?&]size=([^&]+)/);
										const widthParamMatch = imageUrl.match(/[?&]width=([^&]+)/);
										const heightParamMatch = imageUrl.match(/[?&]height=([^&]+)/);

										// Extract the actual file name (e.g., image.jpg) without query params
										const actualFileName = urlWithoutParams.split('/').pop();

										// If the "size", "width", or "height" parameters exist, format them for the file name
										const sizeParam = sizeParamMatch ? `_${sizeParamMatch[1]}` : '';
										const widthParam = widthParamMatch ? `_${widthParamMatch[1]}` : '';
										const heightParam = heightParamMatch ? `_${heightParamMatch[1]}` : '';

										// Get the file extension (default to .jpg if not found)
										const fileExtension = actualFileName.slice(actualFileName.lastIndexOf('.')) || '.jpg';

										// Build the base name without the extension, or fallback to image + index if not found
										const baseName = urlWithoutParams.split('/').pop().split('?')[0].split('.').slice(0, -1).join('.') || `image${index + 1}`;

										// Construct the final file name
										// const fileName = `images_and_media/${baseName}${sizeParam}${widthParam}${heightParam}${fileExtension || '.jpg'}`;

										// imageMap.set(imageUrlRaw, fileName); // Map the URL to the file name

										let fileName = `images_and_media/${baseName}${sizeParam}${widthParam}${heightParam}${fileExtension || ''}`;
										const uniqueFileNameFound = getUniqueFileName(fileName);

										// Check if the file path already exists as a value in the map
										function getUniqueFileName(fileName) {
												let uniqueFileName = fileName;
												let counter = 1;

												// Check if the file name exists as a value in the map
												let filePathExists = false;
												imageMap.forEach((value) => {
														if (value === uniqueFileName) {
																filePathExists = true;
														}
												});

												// If the file path already exists, append a counter to make it unique
												while (filePathExists) {
														uniqueFileName = fileName.replace(/(\.\w+)$/, `_${counter}$1`);
														counter++;

														// Recheck the map with the new uniqueFileName
														filePathExists = false;
														imageMap.forEach((value) => {
																if (value === uniqueFileName) {
																		filePathExists = true;
																}
														});
												}

												// Return the unique file name
												return uniqueFileName;
										}

										// Now that we have a unique file name, add it to the map
										imageMap.set(imageUrlRaw, uniqueFileNameFound);

										let firstImageRetriesLeft = 3; // Set retry limit for this image

										const fetchWithRetry = async () => {
												try {
														const response = await fetch(imageUrl);
														if (!response.ok) {
																throw new Error(`HTTP error! Status: ${response.status}`);
														}
														const blob = await response.blob();
														logMajor(`Adding image to ZIP: ${uniqueFileNameFound}`);
														zip.file(uniqueFileNameFound, blob); // Add the image to the ZIP
												} catch (err) {
														if (firstImageRetriesLeft > 0) {
																firstImageRetriesLeft--; // Decrease retry count
																logMajor(`Retrying fetch for ${imageUrl}... (${firstImageRetriesLeft} attempts left)`);
																await new Promise(resolve => setTimeout(resolve, 2500)); // Wait 2.5 seconds
																return fetchWithRetry(); // Retry
														} else {
																logError(`Failed to fetch image ${imageUrl}:`, err);
														}
												}
										};

										// Start the fetch process with retry
										const imagePromise = fetchWithRetry();

										imagePromises.push(imagePromise); // Add the promise to the tracker

										// Now, check if we should fetch the full-size image
										if (fetchFullSize) {
												const fullSizeUrl = getFullSizeImageUrl(imageUrl);

												if (fullSizeUrl !== imageUrl) { // If the full-size URL is different from the original
														const fullSizeBaseName = fullSizeUrl.split('/').pop().split('?')[0];
														const fullSizeFileName = `fullsize_images/${fullSizeBaseName}`;

														logMajor(`Downloading full-size image: ${fullSizeUrl}`);

														let fullImageRetriesLeft = 3; // Set retry limit for this image

														const fetchWithRetry = () => {
																return fetch(fullSizeUrl)
																		.then(response => {
																				if (!response.ok) {
																						logError(`HTTP error! Status: ${response.status}`);
																						return; // Exit the current function or promise chain to prevent further action
																				}
																				return response.blob();
																		})
																		.then(blob => {
																				logMajor(`Adding full-size image to ZIP: ${fullSizeFileName}`);
																				zip.file(fullSizeFileName, blob); // Add the full-size image to the ZIP

																				// Update HTML to point to the full-size file path
																				const imageSrcRegex = new RegExp(imageUrl.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&"), 'g');
																				// htmlContent = htmlContent.replace(imageSrcRegex, fullSizeFileName);
																		})
																		.catch(err => {
																				if (fullImageRetriesLeft > 0) {
																						fullImageRetriesLeft--; // Decrease retry count
																						logMajor(`Retrying fetch for ${fullSizeUrl}... (${fullImageRetriesLeft} attempts left)`);
																						return new Promise(resolve => setTimeout(resolve, 2500)) // Wait 5 seconds before retry
																								.then(fetchWithRetry);
																				} else {
																						logError(`Failed to fetch full-size image ${fullSizeUrl}:`, err);
																				}
																		});
														};

														const fullSizeImagePromise = fetchWithRetry(); // Start the fetch process with retry

														imagePromises.push(fullSizeImagePromise); // Add the promise to the tracker
												}
										} else {
												logMajor('Full-size image fetching disabled. Skipping.');
										}

								} else {
										// If already processed, retrieve the stored filename
										// const fileName = imageMap.get(imageUrl);

										// Update HTML to point to the existing file path
										// const imageSrcRegex = new RegExp(imageUrl.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&"), 'g');
										// htmlContent = htmlContent.replace(imageSrcRegex, fileName);
										// htmlContent = htmlContent.replace(imageUrl, fileName);
								}
						}
				});

				logMinor(imageMap);

				// Wait for all image fetches to complete and return the modified HTML
				return Promise.all(imagePromises).then(() => {
						logMinor('All images processed. Returning modified HTML content.');
						imageMap.forEach((fileName, originalUrl) => {
								// Escape any special characters in the original URL for the regex
								const escapedUrl = originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
								const urlRegex = new RegExp(escapedUrl, 'g'); // Create a global regex for the URL
								logMinor('originalUrl: ' + originalUrl + '; escapedUrl: ' + escapedUrl);
								htmlContent = htmlContent.replace(urlRegex, fileName);
								logMinor('Replaced all instances of ' + originalUrl + ' with ' + fileName + '.');
						});

						return htmlContent;
				});
		}





		// Function to add styles to the ZIP file
		function addStylesToZip(innerDiv, zip) {
				const pageTitle = document.title;
				let cssFiles = []; // Array to hold file names for linking in HTML
				logMajor('Adding styles to zip...');

				// Fetch all external CSS files (from <link> tags in the document)
				const linkStyles = document.querySelectorAll('link[rel="stylesheet"]');
				linkStyles.forEach((link, index) => {
						const href = link.href;
						if (href && href.startsWith("http")) { // Make sure it's a valid URL
								let styleRetriesLeft = 3; // Set retry limit for each link

								const fetchWithRetry = () => {
										logMinor(`Fetching external CSS from: ${href}`);
										return fetch(href)
												.then(response => response.text())
												.then(cssContent => {
														const fileName = `styles/style${index + 1}.css`;
														logMajor(`Adding CSS file to ZIP: ${fileName}`);
														zip.file(fileName, cssContent);
														cssFiles.push(fileName); // Keep track of this file for later
												})
												.catch(err => {
														if (styleRetriesLeft > 0) {
																styleRetriesLeft--; // Decrease retry count
																logMajor(`Retrying fetch for ${href}... (${styleRetriesLeft} attempts left)`);
																return new Promise(resolve => setTimeout(resolve, 2500)) // Wait 5 seconds before retry
																		.then(fetchWithRetry);
														} else {
																logError("Failed to fetch external CSS:", err);
														}
												});
								};

								fetchWithRetry(); // Start the fetch process with retry
						}
				});

				// Handle inline <style> tags inside the innerDiv
				const inlineStyles = innerDiv.querySelectorAll('style');
				inlineStyles.forEach((style, index) => {
						const cssContent = style.innerHTML;
						const fileName = `inline-style${index + 1}.css`;
						logMinor(`Adding inline CSS to ZIP: ${fileName}`);
						zip.file(fileName, cssContent);
						cssFiles.push(fileName);
						style.innerHTML = ''; // Clear the original inline style tag
						const linkTag = document.createElement('link');
						linkTag.rel = "stylesheet";
						linkTag.href = fileName;
						style.parentNode.insertBefore(linkTag, style);
						logMinor(`Replaced <style> with <link> referencing ${fileName}`);
				});

				logMinor(`Added styles: ${cssFiles.join(', ')}`);
				return cssFiles;
		}

		// Function to add the necessary body style
		function addBodyStyle(htmlContent) {
				const bodyStyle = `
  <style>

    body {
      overflow: unset !important;
    }

    li::marker {
      content: "" !important;
    }

  [class*="messageListItem"]:hover [class*="timestampVisibleOnHover"] {
    opacity: 1;
  }

  [class*="spoilerMarkdownContent"][class*="hidden"] {
    background: hsl(0, 0%, 50%);
    border: 1px solid hsl(0, 0%, 25%);
  }

  </style>
`;

				return bodyStyle + htmlContent;
		}

  function addUTFTag(htmlContent) {
    const UTFTag = `<meta charset="UTF-8">
`;
    return UTFTag + htmlContent;
  }



		function addAttachmentsToZip(innerDiv, zip, attachmentMap) {
				if (!attachmentsEnabled) {
						logMajor("Attachment fetching disabled. Skipping.");
						return;
				}
				logMajor("Fetching and adding miscellaneous attachments to ZIP...");

				// Select attachment links
				const attachmentLinks = innerDiv.querySelectorAll('[class*="attachmentInner"] a[class*="fileNameLink"], a[class*="downloadSection"]');
				const fetchPromises = [];

				// Reuse the unique file name generator
				function getUniqueFileName(fileName, fileMap, folder) {
						let uniqueFileName = fileName;
						let counter = 1;

						while (Array.from(fileMap.values()).includes(`${folder}/${uniqueFileName}`)) {
								uniqueFileName = fileName.replace(/(\.\w+)$/, `_${counter}$1`); // Add counter before extension
								counter++;
						}

						return uniqueFileName;
				}

				attachmentLinks.forEach(link => {
						let fileUrl = link.href;
						let baseFileName = fileUrl.split('/').pop().split('?')[0]; // Strip arguments
						let uniqueFileName = getUniqueFileName(baseFileName, attachmentMap, "attachments");

						let fileRetriesLeft = 3; // Set retry limit

						// Add fetch promise for each attachment with retry
						fetchPromises.push(
								(function fetchWithRetry() {
										return fetch(fileUrl)
												.then(response => {
														if (!response.ok) {
																logError(`Failed to fetch ${fileUrl}: ${response.statusText}`);
																return; // Exit the current function or promise chain to prevent further action
														}
														return response.blob();
												})
												.then(blob => {
														const filePath = `attachments/${uniqueFileName}`;
														zip.file(filePath, blob); // Add file to ZIP
														attachmentMap.set(fileUrl, filePath); // Map file URL to unique path
														logMajor(`Attachment added: ${filePath}`);
												})
												.catch(err => {
														// Check if the error is related to CORS

														if (fileRetriesLeft > 0) {
																fileRetriesLeft--; // Decrease retry count
																logMajor(`Retrying fetch for ${fileUrl}... (${fileRetriesLeft} attempts left)`);
																return new Promise(resolve => setTimeout(resolve, 2500)) // Wait 2.5 seconds before retry
																		.then(fetchWithRetry);
														} else {
																logError(`Failed to fetch attachment ${fileUrl} after multiple attempts.`, err);
														}
												});
								})() // Immediately invoke the fetch function
						);
				});

				return Promise.all(fetchPromises);
		}

		let removeOnScreenLog;

		// Function to display logging info on screen
		function onScreenLogging(argument1, message) {
				const progressLogOverlay = document.getElementById('progress-log-overlay');

				// Case 1: 'create' - Create the log overlay div and set the remove flag
				if (argument1 === 'create') {
						if (!progressLogOverlay) {
								const newOverlay = document.createElement('div');
								newOverlay.id = 'progress-log-overlay';
								document.getElementById('chat-copy-outer').appendChild(newOverlay); // Add it inside #chat-copy-outer
						}
						removeOnScreenLog = false;
				}

				// Case 2: 'remove' - Remove the overlay div after a delay if conditions are met
				if (argument1 === 'remove') {
						removeOnScreenLog = true;
						setTimeout(() => {
								if (removeOnScreenLog) {
										const overlay = document.getElementById('progress-log-overlay');
										if (overlay) {
												overlay.remove(); // Remove the progress log overlay
										}
								}
						}, 16000); // 16-second delay
				}

				// Case 3: 'log' or 'error' - Add a log message inside the #progress-log-overlay
				if ((argument1 === 'log' || argument1 === 'error') && progressLogOverlay) {
						const lineOuter = document.createElement('span');
						lineOuter.classList.add('line-outer');

						const lineInner = document.createElement('span');
						lineInner.classList.add('line-inner');

						// If it's an error, add the .error class to the inner span
						if (argument1 === 'error') {
								lineInner.classList.add('error');
						}

						// Add the message to the line-inner span
						lineInner.textContent = message;

						// Append the line-inner to line-outer, and line-outer to the progress log
						lineOuter.appendChild(lineInner);
						progressLogOverlay.appendChild(lineOuter);
				}
		}


		// Function to save the chat content
		function saveChatContent(innerDiv) {
				resetLog();
				onScreenLogging('create');
				const pageTitle = document.title;
				const zip = new JSZip(); // Initialize a new JSZip instance
				const imageMap = new Map(); // Map to store image URLs and their corresponding file names
				const attachmentMap = new Map();
				logMajor('Initializing ZIP file creation...');

				innerDiv.querySelectorAll('video').forEach(video => {
						video.setAttribute('autoplay', '');
						video.setAttribute('muted', '');
						video.setAttribute('loop', '');
				});

				// Add HTML file to the ZIP
				let htmlContent = innerDiv.innerHTML;
				// console.log('Adding HTML content to ZIP...');

				const cssFiles = addStylesToZip(innerDiv, zip); // Add styles and get CSS file names

				// Handle images and other assets (if any)
				// logMajor('Fetching and adding images and attachments to ZIP...');
				addImagesToZip(innerDiv, zip, imageMap, htmlContent).then(modifiedHtmlContent => {
						logMajor('All images added to ZIP.');


						// Fetch and add attachments
						addAttachmentsToZip(innerDiv, zip, attachmentMap).then(() => {
								logMajor("All attachments added to ZIP.");

								// Modify HTML content to link to the CSS files in the ZIP
								let htmlWithStyles = modifiedHtmlContent;
								cssFiles.forEach((cssFile) => {
										const linkTag = `<link rel="stylesheet" href="${cssFile}">`;
										htmlWithStyles = linkTag + htmlWithStyles; // Prepend <link> tags to the HTML content
								});

								// Add the body style and prepare the final HTML content
								htmlWithStyles = addBodyStyle(htmlWithStyles);

                htmlWithStyles = addUTFTag(htmlWithStyles);



                // Create and embed the JavaScript file
                const scriptContent = `
                    document.querySelectorAll('[class*="spoilerContent"]').forEach(spoiler => {
                      const clickHandler = function () {
                        // Log the clicked element for debugging
                        console.log("Spoiler clicked:", spoiler);

                        // Remove all classes from the clicked item that start with "hidden"
                        Array.from(spoiler.classList)
                          .filter(className => className.startsWith("hidden"))
                          .forEach(hiddenClass => spoiler.classList.remove(hiddenClass));

                        // Check if the clicked item has children
                        if (spoiler.children.length > 0) {
                          Array.from(spoiler.querySelectorAll('[class*="spoilerWarning"]')).forEach(child => {
                            // Remove elements with a class matching [class*="spoilerWarning"]
                            child.remove();
                          });

                          Array.from(spoiler.querySelectorAll('[class*="hidden"]')).forEach(child => {
                            // Remove "hidden" classes from all matching descendants
                            Array.from(child.classList)
                              .filter(className => className.startsWith("hidden"))
                              .forEach(hiddenClass => child.classList.remove(hiddenClass));
                          });

                        }

                        // Remove the event listener to prevent repeated triggering
                        spoiler.removeEventListener("click", clickHandler);
                      };

                      // Attach the click event listener to the spoiler element
                      spoiler.addEventListener("click", clickHandler);
                    });
                `;

                // Specify the folder path in the ZIP
                zip.file("scripts/spoilerListener.js", scriptContent);

                // Add <script> tag pointing to the folder
                htmlWithStyles += `<script src="scripts/spoilerListener.js"></script>`;



								// Beautify the content (assuming it's HTML or text-based inside the ZIP)
								const beautifiedContent = html_beautify(htmlWithStyles, {
										indent_size: 2
								});

								// Save modified HTML to ZIP
								logMajor('Saving modified HTML to ZIP...');
								const modifiedFileName = `${pageTitle.replace(/^[•\s]+/, '').replace(/[\\\/:*?"<>|]/g, '_')}`; // Remove bullet and invalid chars
								zip.file(modifiedFileName + ".html", beautifiedContent); // Save the page content as an HTML file

								logMinor(outputLog);
								logMajor('Saving log to ZIP...');
								zip.file("log.txt", outputLog);
								logMinor('Logs have been added to zip.');

								// Generate the zip file and trigger download
								logMajor('Generating ZIP file...');
								zip.generateAsync({
												type: "blob"
										})
										.then(content => {
												logMajor('ZIP file created successfully.');
												logMinor(outputLog);




												const link = document.createElement("a");
												link.href = URL.createObjectURL(content);
												link.download = `${modifiedFileName}.zip`; // Set the modified filename
												link.click(); // Trigger the download
												resetLog();
												onScreenLogging('remove');
										})
										.catch(err => {
												logError("Error creating ZIP file:", err);
										});
						}).catch(err => {
								logError("Error adding attachments to ZIP:", err);
						});
				}).catch(err => {
						logError("Error adding images to ZIP:", err);
				});
		}




		function buttonPlacer() {
				// 1. Detect chats
				const chats = document.querySelectorAll(
						'main[class*="chatContent"] ol[class*="scrollerInner"], section[class*="chatContent"] ol[class*="scrollerInner"]'
				);

				if (buttonGenerationLocation == 'show-button-corner') {
						chats.forEach(chat => {
								if (!foundChats.has(chat)) {
										foundChats.add(chat);

										handleChatFound(chat);

								} else {
										logMinor('Already found chat.');
								}
						});
				}

				// 2. Detect private channels
				const privateChannels = document.querySelectorAll('nav[class*="privateChannels"]');
				if (buttonGenerationLocation == 'hide-button-dm') {
						privateChannels.forEach(nav => handlePrivateChannelsFound(nav));
				}

				// 3. Detect footer
				const footers = document.querySelectorAll('nav ul [class*="footer"]');
				if (buttonGenerationLocation == 'hide-button-servers') {
						footers.forEach(footer => handleFooterFound(footer));
				}

				// 4. Detect sidebar region
				const sidebars = document.querySelectorAll('[class*="sidebarRegion"] nav[class*="sidebar"]');
				if (buttonGenerationLocation == 'hide-button-settings') {
						sidebars.forEach(sidebar => handleSidebarFound(sidebar));
				}
		}



		// Debounced mutation observer callback
		const mutationCallback = (mutations) => {
				if (debounceTimeout) clearTimeout(debounceTimeout);

				debounceTimeout = setTimeout(() => {
						buttonPlacer();

				}, 100);
		};



		// Function to handle chat detection
		function handleChatFound(chat) {
				const presentChat = document.querySelector(
						'main[class*="chatContent"] ol[class*="scrollerInner"], section[class*="chatContent"] ol[class*="scrollerInner"]'
				);
				if (!presentChat) {
						logMinor('No chat found.');
						return;
				} else if (!chat) {
						chat = presentChat;
				}

				logMinor('New chat found:', chat);

				const messagesWrapper = chat.closest('div[class*="messagesWrapper"]');
				if (messagesWrapper && !messagesWrapper.querySelector('#copy-button-outer')) {
						const outerDiv = document.createElement('div');
						outerDiv.id = 'copy-button-outer';

						const innerDiv = document.createElement('div');
						innerDiv.id = 'copy-button-inner';

						const span = document.createElement('span');
						span.innerHTML = 'Copy<br>Chat';

						innerDiv.appendChild(span);
						outerDiv.appendChild(innerDiv);
						messagesWrapper.appendChild(outerDiv);

						// Add click listener to copy button
						innerDiv.addEventListener('click', () => createChatCopyUI(chat));

						logMinor('Copy button added to:', messagesWrapper);
				}
				buttonCleanup();
		}

		// Function to handle private channels detection
		function handlePrivateChannelsFound(nav) {
				logMinor('Private channel found:', nav);
				const privateChannelsHeader = nav.querySelector('[class*="privateChannelsHeaderContainer"]');
				const showButtonButton = document.createElement('div');
				showButtonButton.id = 'direct-messages-SBB';
				const sBBSpan = document.createElement('span');
				sBBSpan.textContent = 'Show Copy button';
				showButtonButton.appendChild(sBBSpan);
				const existingButton = nav.querySelector('[id="direct-messages-SBB"]');
				if (!existingButton) {
						if (privateChannelsHeader) {
								privateChannelsHeader.parentNode.insertBefore(showButtonButton, privateChannelsHeader);
								attachShowButtonListener(showButtonButton);
								adjustButtonMargin(showButtonButton);
						} else {
								nav.prepend(showButtonButton);
								showButtonButton.classList.add('fallback-position');
								attachShowButtonListener(showButtonButton);
								adjustButtonMargin(showButtonButton);
						}
				} else if (existingButton.classList.contains('fallback-position')) {
						if (privateChannelsHeader) {
								existingButton.remove();
								privateChannelsHeader.parentNode.insertBefore(showButtonButton, privateChannelsHeader);
								attachShowButtonListener(showButtonButton);
								adjustButtonMargin(showButtonButton);
						}
				} else {
						// Check if the button is immediately before the privateChannelsHeader
						if (privateChannelsHeader && existingButton.nextElementSibling !== privateChannelsHeader) {
								privateChannelsHeader.parentNode.insertBefore(existingButton, privateChannelsHeader);
								adjustButtonMargin(existingButton);
						}
				}

				// Function to adjust button margin based on left padding of privateChannelsHeader
				function adjustButtonMargin(button) {
						const paddingLeft = window.getComputedStyle(privateChannelsHeader).getPropertyValue('padding-left');
						button.style.marginLeft = paddingLeft; // Apply paddingLeft as margin-left for button
				}

				buttonCleanup();
		}

		// Function to handle footer detection
		function handleFooterFound(footer) {
				logMinor('Footer found:', footer);
				const showButtonButton = document.createElement('div');
				showButtonButton.id = 'servers-footer-SBB';
				const sBBSpan = document.createElement('span');
				sBBSpan.textContent = 'Show Copy button';
				showButtonButton.appendChild(sBBSpan);
				const existingButton = footer.querySelector('[id="servers-footer-SBB"]');
				if (!existingButton) {
						const listItemWrapper = footer.querySelector('[class*="listItemWrapper"]');

						if (listItemWrapper) {
								// Get the left position of the listItemWrapper relative to the viewport
								// const listItemWrapperPosition = listItemWrapper.getBoundingClientRect().left;

								// Get the width of the window
								// const windowWidth = window.innerWidth;

								// Calculate the marginLeft by subtracting the element's left position from the window's width
								// const marginLeft = windowWidth - listItemWrapperPosition - listItemWrapper.offsetWidth; // Subtract element width to get the remaining space

								// Apply this marginLeft value to align the button correctly
								// showButtonButton.style.marginLeft = `${marginLeft}px`;
						}

						footer.prepend(showButtonButton);
						attachShowButtonListener(showButtonButton);
				}
				buttonCleanup();
		}

		// Function to handle sidebar region detection
		function handleSidebarFound(sidebar) {
				logMinor('Sidebar found:', sidebar);
				const firstSeparator = sidebar.querySelector('[class*="separator"]');
				const showButtonButton = document.createElement('div');
				showButtonButton.id = 'settings-SBB';
				const sBBSpan = document.createElement('span');
				sBBSpan.textContent = 'Show Copy button';
				showButtonButton.appendChild(sBBSpan);
				const existingButton = sidebar.querySelector('[id="settings-SBB"]');
				if (!existingButton) {
						if (firstSeparator) {
								firstSeparator.parentNode.insertBefore(showButtonButton, firstSeparator);
								const marginLeft = window.getComputedStyle(firstSeparator).getPropertyValue('margin-left');
								showButtonButton.style.marginLeft = marginLeft;
								attachShowButtonListener(showButtonButton);
						} else {
								sidebar.prepend(showButtonButton);
								showButtonButton.classList.add('fallback-position');
								attachShowButtonListener(showButtonButton);
						}
				} else if (existingButton.classList.contains('fallback-position')) {
						if (firstSeparator) {
								existingButton.remove();
								firstSeparator.parentNode.insertBefore(showButtonButton, firstSeparator);
								const marginLeft = window.getComputedStyle(firstSeparator).getPropertyValue('margin-left');
								showButtonButton.style.marginLeft = marginLeft;
								attachShowButtonListener(showButtonButton);
						}
				}
				buttonCleanup();
		}

		// Function to attach click listener to the button
		function attachShowButtonListener(showButtonButton) {
				showButtonButton.addEventListener('click', () => {
						buttonGenerationLocation = 'show-button-corner';
						saveButtonLocation(buttonGenerationLocation);
						handleChatFound(); // Call the handleChatFound function when the button is clicked
						showButtonButton.remove();
				});
		}

		// Function declaration to save only the buttonLocation
		function saveButtonLocation(argument) {
				const savedSettings = JSON.parse(localStorage.getItem('chatCopySettings')) || {}; // Get existing settings or default to an empty object
				const settings = {
						...savedSettings, // Keep the previous settings
						buttonLocation: argument, // Set new buttonLocation
				};

				console.log(settings); // Log updated settings
				localStorage.setItem('chatCopySettings', JSON.stringify(settings)); // Save to localStorage
		}

		function buttonCleanup() {
				logMinor('Button cleanup...');
				const dmButton = document.querySelector('#direct-messages-SBB');
				const serverFooterButton = document.querySelector('#servers-footer-SBB');
				const settingsButton = document.querySelector('#settings-SBB');
				// if(buttonGenerationLocation != 'show-button-corner') {

				// }

				if ((buttonGenerationLocation != 'hide-button-dm') && dmButton) {
						dmButton.remove();
				}

				if ((buttonGenerationLocation != 'hide-button-servers') && serverFooterButton) {
						serverFooterButton.remove();
				}

				if ((buttonGenerationLocation != 'hide-button-settings') && settingsButton) {
						settingsButton.remove();
				}
		}

		// Start observing
		const observer = new MutationObserver(mutationCallback);
		observer.observe(document.body, {
				childList: true,
				subtree: true
		});
})();
