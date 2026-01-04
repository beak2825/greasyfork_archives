// ==UserScript==

// @name          	Speedify
// @description    	Tweak your music’s playback speed to your liking, with pitch control and custom ranges. Redesigned fork of ‘Spotify Playback Speed’ by Rnikko, 2022
// @version      	v411.21b
// @author      	Neuvalence, JayeVisual.com
// @license    	 	MIT

// @namespace		www.JayeVisual.com
// @match       	https://open.spotify.com/*
// @icon        	https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @run-at      	document-start

// @downloadURL https://update.greasyfork.org/scripts/518422/Speedify.user.js
// @updateURL https://update.greasyfork.org/scripts/518422/Speedify.meta.js
// ==/UserScript==


(() => {
	const spdify = document.createElement;
	let nvs__PybkOptions,
		nvs__DefaultPitchVal,
		nvs__RegPitchCtrl,
		nvs__Pitch_Off,
		nvs__Pitch_On,
		nvs__SliderInput,
		nvs__SlideSpeedMin,
		nvs__SliderSpeedMax,
		nvs__SliderReset,
		nvs__SettingsButton,
		nvs__SettingClose,
		nvs__forRegis005,
		nvs__forRegis002,
		nvs__SliderLESSinput,
		nvs__SliderMAXinput,
		nvs__MnxReset,
		nvs__MnxSave,
		nvs__SpvMain,
		nvs__MainContent,
		nvs__EditStyles,
		nvs__SpvVectImage,
		nvs__SpvVectorText1,
		nvs__SpvVectorText2;
	document.createElement = function (nvs__CtrlDecider) {
		var nvs__CtrlArgs = spdify.apply(this, arguments);
		return (
			("video" !== nvs__CtrlDecider && "audio" !== nvs__CtrlDecider) ||
				nvs__PybkOptions ||
				(nvs__PybkOptions = nvs__CtrlArgs),
			nvs__CtrlArgs
		);
	};

	const nvs__MnxOpt1 = () => {
		const spv_SpeedMultiValue = Number(nvs__SliderInput.value);
		var nvs__MinDispText = nvs__SliderLESSinput.value,
			nvs__MaxDispText = nvs__SliderMAXinput.value,
			isPitchKept = nvs__DefaultPitchVal.checked;
		(nvs__SpvVectorText1.innerHTML = spv_SpeedMultiValue.toFixed(2) + "×"),
		(nvs__SpvVectorText2.innerHTML = spv_SpeedMultiValue.toFixed(2) + "×"),
			(nvs__SliderInput.style.backgroundSize =
				(100 * (spv_SpeedMultiValue - nvs__MinDispText)) / (nvs__MaxDispText - nvs__MinDispText) + "% 100%"),
			isPitchKept
				? (nvs__RegPitchCtrl.classList.add("spvGreenActive"),
					nvs__RegPitchCtrl.classList.remove("spvPaperHover"),
					(nvs__Pitch_Off.style.display = "none"),
					(nvs__Pitch_On.style.display = "block"))
				: (nvs__RegPitchCtrl.classList.remove("spvGreenActive"),
					nvs__RegPitchCtrl.classList.add("spvPaperHover"),
					(nvs__Pitch_Off.style.display = "block"),
					(nvs__Pitch_On.style.display = "none")),
			localStorage.setItem("spvSpedVal", spv_SpeedMultiValue),
			localStorage.setItem("spvPitchin", isPitchKept),
			localStorage.setItem("spvSlider__LESS", nvs__MinDispText),
			localStorage.setItem("spvSlider__MAX", nvs__MaxDispText),
			(nvs__PybkOptions.playbackRate = {
				source: "speedify",
				value: spv_SpeedMultiValue,
			}),
			(nvs__PybkOptions.preservesPitch = isPitchKept);
	};


	let nvs__BarIcoCtrl = !1,
		nvs__BarIcoAlt = !1;
	const nvs__DisplaySettingsPanel = () => {
			(nvs__BarIcoCtrl = !nvs__BarIcoCtrl)
				? ((nvs__MainContent.style.display = "none"), (nvs__EditStyles.style.display = "block"))
				: ((nvs__MainContent.style.display = "block"), (nvs__EditStyles.style.display = "none"));
		},
		nvs__SvgDis = () => {
			(nvs__BarIcoAlt = !nvs__BarIcoAlt)
				? (nvs__SpvMain.style.display = "block")
				: (nvs__SpvMain.style.display = "none"),
				document.querySelector("#spvIcos").classList.toggle("spvGreenActive"),
				nvs__BarIcoCtrl && nvs__DisplaySettingsPanel();
		},
		nvs__MnxSetReset = () => {
			(nvs__SliderLESSinput.value = 0.95), (nvs__SliderMAXinput.value = 1.16);
		},
		nvs__MnxSetSave = () => {
			(nvs__SliderInput.min = "0" !== nvs__SliderLESSinput.value && nvs__SliderLESSinput.value ? nvs__SliderLESSinput.value : "0.95"),
				(nvs__SliderInput.max = "0" !== nvs__SliderMAXinput.value && nvs__SliderMAXinput.value ? nvs__SliderMAXinput.value : "1.16"),
				localStorage.setItem("spvSlider__LESS", nvs__SliderLESSinput.value),
				localStorage.setItem("spvSlider__MAX", nvs__SliderMAXinput.value),
				(nvs__SlideSpeedMin.innerHTML = +Number(nvs__SliderLESSinput.value) + "×"),
				(nvs__SliderSpeedMax.innerHTML = +Number(nvs__SliderMAXinput.value) + "×"),
				nvs__MnxOpt1(),
				nvs__DisplaySettingsPanel();
		};

	let nvs__defPb = 0;
	const nvs__pbLocal = () => {
		var nvs__pbSpeed, nvs__pbPrePitch, nvs__glcPitch;
		(nvs__pbSpeed = localStorage.getItem("pb-settings-speed")),
			(nvs__pbPrePitch = localStorage.getItem("pb-settings-prepitch")),
			nvs__pbSpeed && (localStorage.setItem("spvSpedVal", Number(nvs__pbSpeed) / 100), localStorage.removeItem("pb-settings-speed")),
			nvs__pbPrePitch && (localStorage.setItem("spvPitchin", nvs__pbPrePitch), localStorage.removeItem("pb-settings-prepitch"));
		{
			const nvs__StylesGENERAL = document.createElement("style");
			(nvs__StylesGENERAL.textContent =
	`
	#speedify {
		user-select: none;
		border-width: 0 !important;
		border-style: solid !important;
		#spvMainWrapper {
			border-right: 0;
			bottom: calc(72px + 25px);
			right: 18px !important;
			position: absolute;
			z-index: 60 !important;
			background-color: #010101e6;
			backdrop-filter: blur(8px);
			-webkit-backdrop-filter: blur(8px);
			border-radius: 8px !important;
			padding: 1.4rem;
		}
		#spvControl, #spvEditWrapper {
			width: 368px !important;
		}
		section.spvSection {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 0.8rem;
		}
		.spvRow {
			height: 2rem !important;
		}
		.spvHeader {
			color: #f0f0f0;
			font-size: 1.2rem;
			font-weight: 600;
			line-height: 1;
		}
		.spvFlex {
			display: inline-flex !important;
			flex-wrap: nowrap !important;
			align-items: center;
			width: 100%;
			column-gap: 0.7rem !important;
		}
		button {
			border-width: 0 !important;
			border-style: none !important;
			border-color: unset !important;
			font-weight: 600;
			font-size: 0.95rem;
			margin: 0 !important;
			user-select: none;
			background-color: unset;

			&.spvTxtButton {
				background-color: var(--background-elevated-base) !important;
				color: #EEeeEE;
				border-radius: 3rem;
				padding: 0.3rem 1rem 0.4rem !important;
					&:hover {
						background-color: #1e1e1e;
						cursor: pointer;
					}
					&:disabled {
						cursor: not-allowed;
					}

			}
			&#spvMnMxSave {
				color: var(--background-base, #ffffff) !important;
				background-color: var(--text-base, #000000) !important;
			}
			&#spvPitchin {
				background-color: transparent;
				display: flex;
				flex-wrap: nowrap;
				gap: 0.6rem !important;
				align-items: center;
			}
			svg path {
				fill: currentcolor !important;
				stroke: none !important;
			}
		}
		.spvGreenActive,
		.spvGreenActive:hover {
			color: #2edb64 !important;
		}
		.spvPaperHover:hover {
			color: #FFF;
		}
		#spvIcos {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
				svg {
					display: none !important;
				}
				#spvMultText1, #spvMultText2 {
					font-size: 0.9em !important;
					font-weight: 800 !important;
					padding-inline: 0.3rem !important;
				}
		}
		.spvEditBODY {
			width: 100%;
			.left, .right {
				width: 100%;
				background: #4b4b4be5;
				border: 1px solid transparent;
				border-radius: 4px;
			}
			span {
				text-transform: uppercase;
				font-weight: 800 !important;
				letter-spacing: 1.2px !important;
				font-size: 0.8rem !important;
				text-align: center;
				font-size: .875rem;
				padding-inline: 7px;
				margin: 0 !important;
			}
			column-gap: 1rem;
			input[type=number] {
				background: none !important;
				border: 1px solid transparent;
				color: #EEeeEE;
				font-size: 1rem;
				height: 100%;
				padding: 7px;
				resize: none;
				width: 100%;
				-moz-appearance: textfield;
			}
				input::-webkit-outer-spin-button,
				input::-webkit-inner-spin-button {
					-webkit-appearance: none;
					margin: 0;
				}
				input[type=number] {
				}
				input[type=number]:focus {
					outline: 0;
				}
		}
		input[type=range] {
			-webkit-appearance: none;
			width: 100%;
			height: 6px;
			background: #494949;
			border-radius: .375rem;
			background-size: 70% 100%;
			background-repeat: no-repeat;
			background-image: linear-gradient(#2edb64, #2edb64);
		}
			input[type=range]:hover {
				background-image: linear-gradient(#2edb64, #2edb64);
			}
			input[type=range]::-webkit-slider-thumb {
				-webkit-appearance: none;
			}
			input[type=range]::-webkit-slider-runnable-track {
				width: calc(100%);
				height: 6px;
				padding: 8px 0;
				background: transparent;
			}
			input[type=range]:hover::-webkit-slider-runnable-track {
				cursor: ew-resize;
			}
			input[type=range]:hover::-webkit-slider-thumb {
				display: block;
				cursor: ew-resize;
			}
			input[type=range]::-webkit-slider-thumb {
				display: none;
				-webkit-appearance: none;
				border-radius: 50%;
				height: 14px;
				width: 14px;
				background: white;
				margin-top: -7px;
			}
			.spvBlock {
				display: block !important;
				width: 100% !important;
			}
			.spvRangeWrapper {
				display: flex !important;
				position: relative !important;
				width: 100% !important;
					.spvSliderTooltip {
						display: none !important;
						position: absolute !important;
						width: 4rem !important;
						left: 0px;
						right: 0px;
						bottom: 8px;
						width: 9rem;
						max-width: calc( 100vw - 8px * 2 );
						margin-inline: auto;
						text-align: center !important;
						bottom: 1rem !important;
						padding: 0.3rem 0.5rem !important;
						font-weight: bold !important;
						border-radius: 0.3rem !important;
						color: #010101 !important;
						background: #2edb64 !important;
					}
					&:hover {
						.spvSliderTooltip { display: block !important }
					}
			}
			.spvTickerNums {
					display: none !important;
					width: 100% !important;
					justify-content: space-between;
					flex-wrap: wrap !important;
					padding-inline: 5px !important;
					margin-top: -6px !important;
				}
				.spvTickerNums span {
					display: none !important;
					justify-content: center;
					width: 1px;
					height: 10px !important;
					background: #d3d3d3;
					line-height: 10px !important;
				}
			.spvMX {
				justify-content: space-between !important;
			}
	}
	html:has(.gQoa8JTSpjSmYyABcag2),
	html:has(.T3hkVxXuSbCYOD2GIeQd)
		{
			#speedify #spvMainWrapper {
				bottom: calc(  25px + (72px + 25px)  ) !important;
			}
	}
	`),
document.head.append(nvs__StylesGENERAL);
}
try {
if (((nvs__defPb += 1), console.log("spfyScript➕"), null === document.querySelector("#main"))) throw "Main container element not found";
{
const nvs__getSpdfy = document.querySelector("#speedify"),
nvs__UiAppend =
(nvs__getSpdfy && nvs__getSpdfy.remove(),
((nvs__MainContent = document.createElement("div")).id = "spvControl"),
(nvs__MainContent.style.display = "block"),
(nvs__MainContent.innerHTML =
	`<section class="spvSection">
	<div id="spv__BASEHEADER" class="spvFlex spvRow">
		<span class="spvHeader">Speed</span>
		<div style="flex-grow: 1;"></div>
		<button id="spvEditButton" class="spvSymbButton">
			<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.0048 5.54018H13.9948C14.0607 5.54018 14.1239 5.56637 14.1706 5.61299C14.2172 5.65961 14.2434 5.72284 14.2434 5.78877C14.2434 8.036 16.677 9.44175 18.6235 8.3169C18.6803 8.28478 18.7474 8.27629 18.8105 8.29326C18.8735 8.31024 18.9273 8.35132 18.9603 8.40763L19.9571 10.1328C19.9896 10.1898 19.9984 10.2572 19.9814 10.3205C19.9644 10.3839 19.923 10.4379 19.8664 10.4709C17.92 11.5945 17.92 14.4035 19.8664 15.5284C19.9227 15.5614 19.9638 15.6152 19.9808 15.6782C19.9977 15.7413 19.9893 15.8084 19.9571 15.8652L18.9603 17.5904C18.9273 17.6467 18.8735 17.6878 18.8105 17.7048C18.7474 17.7218 18.6803 17.7133 18.6235 17.6812C16.677 16.5563 14.2434 17.9608 14.2434 20.2068C14.2434 20.2725 14.2173 20.3356 14.171 20.3821C14.1246 20.4287 14.0617 20.4551 13.996 20.4554H12.0061C11.9402 20.4554 11.8769 20.4292 11.8303 20.3826C11.7837 20.336 11.7575 20.2727 11.7575 20.2068C11.7575 17.9596 9.32383 16.5551 7.3774 17.6787C7.32047 17.7112 7.253 17.7199 7.18968 17.7029C7.12636 17.6859 7.07232 17.6446 7.03932 17.5879L6.04497 15.8628C6.01274 15.8061 6.00406 15.739 6.0208 15.676C6.03754 15.613 6.07836 15.5591 6.13446 15.5259C8.0809 14.4011 8.0809 11.592 6.13446 10.4672C6.07848 10.4342 6.03764 10.3806 6.02068 10.3179C6.00372 10.2552 6.01199 10.1883 6.04373 10.1316L7.03932 8.40515C7.07252 8.34871 7.12666 8.30765 7.18996 8.2909C7.25326 8.27414 7.32062 8.28304 7.3774 8.31565C9.32383 9.44051 11.7575 8.03475 11.7575 5.78753C11.7575 5.6508 11.8681 5.54018 12.0048 5.54018ZM9.8931 5.78877C9.8931 4.62041 10.8377 3.67578 12.0048 3.67578H13.9948C15.1631 3.67578 16.1078 4.62041 16.1078 5.78877C16.1081 5.97392 16.1572 6.15573 16.2499 6.31597C16.3427 6.47621 16.4759 6.60926 16.6363 6.70178C16.7967 6.79431 16.9786 6.84306 17.1637 6.84315C17.3489 6.84325 17.5308 6.79469 17.6913 6.70233C18.1763 6.42299 18.7523 6.3475 19.293 6.49245C19.8336 6.63739 20.2946 6.99092 20.5749 7.47543L21.5717 9.20062C22.1546 10.2111 21.8079 11.5013 20.7986 12.0842C20.6381 12.177 20.5048 12.3103 20.4121 12.4709C20.3194 12.6315 20.2706 12.8136 20.2706 12.999C20.2706 13.1844 20.3194 13.3666 20.4121 13.5271C20.5048 13.6877 20.6381 13.8211 20.7986 13.9138C21.2831 14.1941 21.6366 14.6551 21.7816 15.1957C21.9265 15.7364 21.851 16.3124 21.5717 16.7974L20.5749 18.5226C20.2946 19.0071 19.8336 19.3607 19.293 19.5056C18.7523 19.6506 18.1763 19.5751 17.6913 19.2957C17.5308 19.2034 17.3489 19.1548 17.1637 19.1549C16.9786 19.155 16.7967 19.2038 16.6363 19.2963C16.4759 19.3888 16.3427 19.5219 16.2499 19.6821C16.1572 19.8423 16.1081 20.0241 16.1078 20.2093C16.1078 21.3764 15.1631 22.3223 13.996 22.3223H12.0061C11.4459 22.322 10.9088 22.0992 10.5128 21.703C10.1168 21.3067 9.89434 20.7695 9.89434 20.2093C9.89397 20.0241 9.84495 19.8423 9.75218 19.6821C9.65942 19.5219 9.52618 19.3888 9.3658 19.2963C9.20542 19.2038 9.02355 19.155 8.83839 19.1549C8.65324 19.1548 8.47131 19.2034 8.31084 19.2957C7.82581 19.5751 7.24976 19.6506 6.70913 19.5056C6.1685 19.3607 5.70747 19.0071 5.42723 18.5226L4.4304 16.7974C4.15106 16.3124 4.07558 15.7364 4.22052 15.1957C4.36546 14.6551 4.71899 14.1941 5.2035 13.9138C5.36375 13.821 5.49678 13.6877 5.58926 13.5272C5.68174 13.3668 5.73042 13.1848 5.73042 12.9997C5.73042 12.8145 5.68174 12.6325 5.58926 12.4721C5.49678 12.3116 5.36375 12.1783 5.2035 12.0855C4.71899 11.8052 4.36546 11.3442 4.22052 10.8036C4.07558 10.2629 4.15106 9.6869 4.4304 9.20187L5.42599 7.47543C5.70623 6.99092 6.16726 6.63739 6.70789 6.49245C7.24852 6.3475 7.82456 6.42299 8.3096 6.70233C8.47007 6.79469 8.652 6.84325 8.83715 6.84315C9.0223 6.84306 9.20418 6.79431 9.36456 6.70178C9.52493 6.60926 9.65818 6.47621 9.75094 6.31597C9.8437 6.15573 9.89273 5.97392 9.8931 5.78877ZM14.8648 12.9978C14.8648 13.4923 14.6684 13.9665 14.3188 14.3161C13.9691 14.6658 13.4949 14.8622 13.0004 14.8622C12.506 14.8622 12.0317 14.6658 11.6821 14.3161C11.3325 13.9665 11.136 13.4923 11.136 12.9978C11.136 12.5033 11.3325 12.0291 11.6821 11.6795C12.0317 11.3298 12.506 11.1334 13.0004 11.1334C13.4949 11.1334 13.9691 11.3298 14.3188 11.6795C14.6684 12.0291 14.8648 12.5033 14.8648 12.9978ZM16.7292 12.9978C16.7292 13.9867 16.3364 14.9352 15.6371 15.6345C14.9378 16.3337 13.9894 16.7266 13.0004 16.7266C12.0115 16.7266 11.0631 16.3337 10.3638 15.6345C9.66448 14.9352 9.27163 13.9867 9.27163 12.9978C9.27163 12.0088 9.66448 11.0604 10.3638 10.3611C11.0631 9.66184 12.0115 9.26899 13.0004 9.26899C13.9894 9.26899 14.9378 9.66184 15.6371 10.3611C16.3364 11.0604 16.7292 12.0088 16.7292 12.9978Z" fill="black"/>
			</svg>
		</button>
	</div>
	<div id="spv__BASESLIDER" class="spvFlex spvRow">
		<span id="spvSlider__LESS" style="line-height: 32px;">0.95×</span>
		<div class="spvRangeWrapper">
			<input id="spvSliderIdentify" name="spvSliderName" type="range" min="0.95" max="1.16" step="0.01" style="background-size: 71.4286% 100%;">
			<span class="spvSliderTooltip" id="spvMultText2">1.10×</span>
		</div>

		<div class="spvTickerNums">
			<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
		</div>
		<span id="spvSlider__MAX" style="line-height: 32px;">1.16×</span>
	</div>
	<div id="spv__BASEPITCH" class="spvFlex spvRow">
		<button id="spvPitchin" class="spvGreenActive">
			<input name="spvPitchin" type="checkbox" style="display: none">
			<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.27rem" height="1.125rem" preserveAspectRatio="xMidYMid meet" viewBox="0 0 576 512">
				<path class="spvPitchOFF" fill="currentColor" d="M384 64H192C85.961 64 0 149.961 0 256s85.961 192 192 192h192c106.039 0 192-85.961 192-192S490.039 64 384 64zM64 256c0-70.741 57.249-128 128-128c70.741 0 128 57.249 128 128c0 70.741-57.249 128-128 128c-70.741 0-128-57.249-128-128zm320 128h-48.905c65.217-72.858 65.236-183.12 0-256H384c70.741 0 128 57.249 128 128c0 70.74-57.249 128-128 128z" style="display: none;"></path>
				<path class="spvPitchACTIVE" fill="currentColor" d="M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128c0-70.8 57.3-128 128-128c70.8 0 128 57.3 128 128c0 70.8-57.3 128-128 128z" style="display: none"></path>
			</svg>
			<span style="line-height: 1;">Keep Pitch</span>
		</button>
		<div style="flex-grow: 1;"></div>
		<button id="spvEditResetButton" class="spvTxtButton">1x</button>
	</div>
</section>`),
((nvs__EditStyles = document.createElement("div")).id = "spvEditWrapper"),
(nvs__EditStyles.style.display = "none"),
(nvs__EditStyles.innerHTML =
`<section class="spvSection">
	<div id="spv__EDITHEADER" class="spvFlex spvRow">
		<span class="spvHeader">Settings</span>
		<div style="flex-grow: 1;"></div>
		<button id="spvEditBack" class="spvSymbButton">
			<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0335 6.5318L8.5335 12.0318H21.1799V13.9716H8.5335L14.0335 19.4716L12.6618 20.8432L4.82031 13.0017L12.6618 5.16016L14.0335 6.5318Z" fill="black"/>
			</svg>
		</button>
	</div>
	<div class="spvEditBODY spvFlex spvRow">
		<div class="left spvFlex">
			<span class="spvLXsigNal">
				Min:
			</span>
			<input type="number" name="spvLessin" min="0.8" max="1.15" step="0.1">
		</div>
		<div class="right spvFlex">
			<span class="spvLXsigNal">
				Max:
			</span>
			<input type="number" name="spvMaxin" min="1" max="1.85" step="0.1">
		</div>
	</div>
	<div id="spv__EDITFOOTER" class="spvFlex spvRow">
		<div style="flex-grow: 1;"></div>
		<button id="spvMnMxReset" class="spvTxtButton">Reset</button>
		<button id="spvMnMxSave" class="spvTxtButton" style="margin-left: 0.5rem;">Save</button>
	</div>
</section>
`),
((nvs__SpvMain = document.createElement("div")).id = "spvMainWrapper"),
(nvs__SpvMain.style.display = "none"),
nvs__SpvMain.appendChild(nvs__MainContent),
nvs__SpvMain.appendChild(nvs__EditStyles),
document.createElement("div")),
nvs__sIcon =
	((nvs__UiAppend.id = "spvIcos"),
	nvs__UiAppend.setAttribute("class", "spvPaperHover"),
	(nvs__UiAppend.innerHTML =
		`
		<section class="spvDispButton">
		<div id="spv__DISPLAY">
			<svg preserveAspectRatio="xMidYMid meet" width="2rem" height="2rem" viewBox="0 0 24 24" fill="currentColor" style="padding: 0.375rem;"><path d="M13 2.05v2c4.39.54 7.5 4.53 6.96 8.92c-.46 3.64-3.32 6.53-6.96 6.96v2c5.5-.55 9.5-5.43 8.95-10.93c-.45-4.75-4.22-8.5-8.95-8.97v.02M5.67 19.74A9.994 9.994 0 0 0 11 22v-2a8.002 8.002 0 0 1-3.9-1.63l-1.43 1.37m1.43-14c1.12-.9 2.47-1.48 3.9-1.68v-2c-1.95.19-3.81.94-5.33 2.2L7.1 5.74M5.69 7.1L4.26 5.67A9.885 9.885 0 0 0 2.05 11h2c.19-1.42.75-2.77 1.64-3.9M4.06 13h-2c.2 1.96.97 3.81 2.21 5.33l1.42-1.43A8.002 8.002 0 0 1 4.06 13M10 16.5l6-4.5l-6-4.5v9z" fill="currentColor"></path></svg>
			<span id="spvMultText1">1.10×</span>
		</div>
		</section>
		`
	),
	document.createElement("div"));
	(nvs__sIcon.id = "speedify"),
	nvs__sIcon.appendChild(nvs__SpvMain),
	nvs__sIcon.appendChild(nvs__UiAppend);
	const nvs__Thinker = document.querySelector('button[aria-describedby="volume-icon"]').parentNode.parentNode;
	nvs__Thinker.insertBefore(nvs__sIcon, nvs__Thinker.firstChild);
}
{
	(nvs__DefaultPitchVal = document.querySelector('input[name="spvPitchin"]')),
		(nvs__RegPitchCtrl = document.querySelector("button#spvPitchin")),
		(nvs__Pitch_Off = document.querySelector("path.spvPitchOFF")),
		(nvs__Pitch_On = document.querySelector("path.spvPitchACTIVE")),
		(nvs__SliderInput = document.querySelector('input[name="spvSliderName"]')),
		(nvs__SlideSpeedMin = document.querySelector("span#spvSlider__LESS")),
		(nvs__SliderSpeedMax = document.querySelector("span#spvSlider__MAX")),
		(nvs__SliderReset = document.querySelector("button#spvEditResetButton")),
		(nvs__SettingsButton = document.querySelector("#spvEditButton")),
		(nvs__SettingClose = document.querySelector("#spvEditBack")),
		(nvs__SliderLESSinput = document.querySelector('input[name="spvLessin"]')),
		(nvs__SliderMAXinput = document.querySelector('input[name="spvMaxin"]')),
		(nvs__MnxReset = document.querySelector("button#spvMnMxReset")),
		(nvs__MnxSave = document.querySelector("button#spvMnMxSave")),
		(nvs__SpvMain = document.querySelector("#spvMainWrapper")),
		(nvs__MainContent = document.querySelector("#spvControl")),
		(nvs__EditStyles = document.querySelector("#spvEditWrapper")),
		(nvs__SpvVectImage = document.querySelector("#spvIcos")),
		(nvs__SpvVectorText1 = document.querySelector("#spvMultText1"));
		(nvs__SpvVectorText2 = document.querySelector("#spvMultText2"));
	let nvs__lclGetSpeed = 1,
		nvs__rg000 = !0,
		nvs__rg005 = 0.95,
		nvs__rg002 = 1.16;
	if (
		(localStorage.getItem("spvSpedVal") &&
			((nvs__lclGetSpeed = Number(localStorage.getItem("spvSpedVal")) || nvs__lclGetSpeed),
			(nvs__glcPitch = localStorage.getItem("spvPitchin")),
			(nvs__rg000 = null != nvs__glcPitch ? JSON.parse(nvs__glcPitch) : nvs__rg000),
			(nvs__glcPitch = Number(localStorage.getItem("spvSlider__LESS"))),
			(nvs__rg005 = nvs__glcPitch && 0 !== nvs__glcPitch ? nvs__glcPitch : nvs__rg005),
			(nvs__glcPitch = Number(localStorage.getItem("spvSlider__MAX"))),
			(nvs__rg002 = nvs__glcPitch && 0 !== nvs__glcPitch ? nvs__glcPitch : nvs__rg002)),
		(nvs__forRegis005 = nvs__rg005),
		(nvs__forRegis002 = nvs__rg002),
		(nvs__DefaultPitchVal.checked = nvs__rg000),
		(nvs__SliderInput.value = nvs__lclGetSpeed),
		(nvs__SliderInput.min = nvs__rg005),
		(nvs__SliderInput.max = nvs__rg002),
		(nvs__SliderLESSinput.value = nvs__rg005),
		(nvs__SliderMAXinput.value = nvs__rg002),
		(nvs__SlideSpeedMin.innerHTML = nvs__rg005 + "×"),
		(nvs__SliderSpeedMax.innerHTML = nvs__rg002 + "×"),
		(nvs__SliderInput.oninput = nvs__MnxOpt1),
		(nvs__DefaultPitchVal.oninput = nvs__MnxOpt1),
		(nvs__SliderLESSinput.onchange = (nvs__changeSlider) => {
			let nsvy__newMinValue = Number(nvs__changeSlider.target.value);
			nsvy__newMinValue >= nvs__forRegis002 && ((nsvy__newMinValue = nvs__forRegis002 - 0.01), (nvs__changeSlider.target.value = nsvy__newMinValue)), (nvs__forRegis005 = nsvy__newMinValue);
		}),
		(nvs__SliderMAXinput.onchange = (nvs__changeMax) => {
			let nsvy__newMaxValue = Number(nvs__changeMax.target.value);
			nsvy__newMaxValue < nvs__forRegis005 && ((nsvy__newMaxValue = nvs__forRegis005 + 0.01), (nvs__changeMax.target.value = nsvy__newMaxValue)), (nvs__forRegis002 = nsvy__newMaxValue);
		}),
		(nvs__MnxReset.onclick = nvs__MnxSetReset),
		(nvs__MnxSave.onclick = nvs__MnxSetSave),
		(nvs__SliderReset.onclick = () => {
			nvs__SliderInput.max < 1 &&
				((nvs__SliderInput.max = 1),
				(nvs__SliderMAXinput.value = 1),
				localStorage.setItem("spvSlider__MAX", nvs__SliderMAXinput.value),
				(nvs__SliderSpeedMax.innerHTML = +Number(nvs__SliderMAXinput.value) + "x")),
				1 < nvs__SliderInput.min &&
					((nvs__SliderInput.min = 1),
					(nvs__SliderLESSinput.value = 1),
					localStorage.setItem("spvSlider__LESS", nvs__SliderLESSinput.value),
					(nvs__SlideSpeedMin.innerHTML = +Number(nvs__SliderLESSinput.value) + "x")),
				(nvs__SliderInput.value = 1),
				nvs__MnxOpt1();
		}),
		(nvs__SpvVectImage.onclick = nvs__SvgDis),
		(nvs__SettingsButton.onclick = nvs__DisplaySettingsPanel),
		(nvs__SettingClose.onclick = () => {
			(nvs__SliderLESSinput.value = nvs__SliderInput.min), (nvs__SliderMAXinput.value = nvs__SliderInput.max), nvs__DisplaySettingsPanel();
		}),
		(nvs__RegPitchCtrl.onclick = () => {
			(nvs__DefaultPitchVal.checked = !nvs__DefaultPitchVal.checked), nvs__MnxOpt1();
		}),
		nvs__PybkOptions instanceof HTMLMediaElement)
	) {
		const nsvy__Distort = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "playbackRate");
		Object.defineProperty(HTMLMediaElement.prototype, "playbackRate", {
			set(nsvy__Error) {
				"speedify" !== nsvy__Error.source
					? (console.info("spfyScript prevented unintended playback speed change"), nsvy__Distort.set.call(this, Number(nvs__SliderInput.value)))
					: nsvy__Distort.set.call(this, nsvy__Error.value);
			},
		});
	}
	nvs__MnxOpt1();
}
	console.log("Speedify is up and running!");
	} catch (e) {
		console.log("Speedify is refreshing... " + e), nvs__defPb <= 20 ? setTimeout(nvs__pbLocal, 500) : console.log("Speedify is up and running!");
	}
};
nvs__pbLocal();
})();



