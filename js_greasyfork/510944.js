// ==UserScript==
// @name		Filtera
// @namespace	https://greasyfork.org/en/scripts/510944-filtera
// @version		2024-09-30|v0.1.0-1
// @description	Filter effects for videos and more (CSS brightness, saturation, contrast etc...)
// @author		V.H.
// @copyright	V.H.
// @match		*://*/*
// @grant		unsafeWindow
// @grant		GM_log
// @grant		GM_registerMenuCommand
// @grant		GM_unregisterMenuCommand
// @grant		GM_addStyle
// @grant		GM_getValue
// @grant		GM_setValue
// @run-at		document-body
// @tag			accessibility
// @supportURL	https://greasyfork.org/en/scripts/510944-filtera/feedback
// @license		MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/510944/Filtera.user.js
// @updateURL https://update.greasyfork.org/scripts/510944/Filtera.meta.js
// ==/UserScript==

"use strict";

const	cfg				= {
			name:			"Filtera",
			prefix:			"gm_vh_fltr_",
			commands:		{
				panel:			{
					name:			"Panel",
					options:		{
						title:			"Panel",
						accessKey:		"P",
						autoClose:		true,
						id:				null,
					},
				},
			},
		},
		style		= `
			#${cfg.prefix}panel {
				--default-radius: 5px;
				--default-margin: 5px;
				--default-padding: 5px;
				--default-gap: 5px;
				
				position: fixed !important;
				z-index: 9999 !important;
				display: flex !important;
				flex-flow: column nowrap !important;
				justify-content: space-between !important;
				align-items: space-around !important;
				align-content: stretch !important;
				gap: var(--default-gap) !important;
				top: 1vh !important;
				left: 1vw !important;
				min-width: 10vw !important;
				width: 30vw !important;
				max-width: 60vw !important;
				min-height: 15vh !important;
				height: 45vh !important;
				max-height: 85vh !important;
				resize: both !important;
				overflow: auto !important;
				overscroll-behavior: contain !important;
				user-select: contain !important;
				background: radial-gradient(circle closest-corner at center, rgba(250, 250, 250, .9) 10%, rgba(100, 100, 100, .7) 90%) !important;
				border-radius: var(--default-radius) !important;
				font-family: helvetica, sans-serif !important;
				color: rgb(20, 20, 20) !important;
			}
			#${cfg.prefix}panel *[disabled] {
				cursor: not-allowed !important;
			}
			#${cfg.prefix}panel * {
				text-align: center !important;
			}
			#${cfg.prefix}panel > * {
				margin: var(--default-margin) !important;
				pointer-events: auto;
			}
			#${cfg.prefix}panel label {
				width: 30% !important;
			}
			#${cfg.prefix}panel label::after {
				content: ": " !important;
			}
			#${cfg.prefix}panel :where(h1, h2, h3) {
				margin: var(--default-margin) !important;
				text-decoration: underline wavy !important;
			}
			#${cfg.prefix}panel :where(input, select, textarea, button) {
				margin: var(--default-margin) !important;
				padding: var(--default-padding) !important;
				box-shadow: 1px 1px 1px 1px black !important;
				border-radius: var(--default-radius) !important;
				transition: all 200ms !important;
				backdrop-filter: brightness(80%) !important;
			}
			#${cfg.prefix}panel :where(input, select, textarea, button):hover {
				box-shadow: 1px 1px 2px 2px black !important;
				border-radius: calc(var(--default-radius) - 1px) !important;
				filter: brightness(80%) !important;
			}
			#${cfg.prefix}panel :where(input, select, textarea, button):active {
				box-shadow: 1px 1px 1px 1px black !important;
				border-radius: var(--default-radius) !important;
				filter: brightness(60%) !important;
			}
			#${cfg.prefix}panel :where(input, select) {
				width: 50% !important;
			}
			#${cfg.prefix}panel :where(button, input[type="checkbox"]) {
				cursor: pointer !important;
			}
			
			#${cfg.prefix}panel_close {
				position: sticky !important;
				top: 1px !important;
				z-index: 10000 !important;
				opacity: .9 !important;
			}
		`,
		panelform	= `
			<dialog id="${cfg.prefix}panel" open>
				<h3>Filtera</h3>
				<button id="${cfg.prefix}panel_close">Close</button>
				<span title="Brightness Filter (percent)">
					<label for="${cfg.prefix}panel_brightness">Brightness</label>
					<input id="${cfg.prefix}panel_brightness" name="brightness" type="number" placeholder="100%" value="100" min="0" step="1" size="10" />
				</span>
				<span title="Contrast Filter (percent)">
					<label for="${cfg.prefix}panel_contrast">Contrast</label>
					<input id="${cfg.prefix}panel_contrast" name="contrast" type="number" placeholder="100%" value="100" min="0" step="1" size="10" />
				</span>
				<span title="Saturation Filter (percent)">
					<label for="${cfg.prefix}panel_saturation">Saturation</label>
					<input id="${cfg.prefix}panel_saturation" name="saturation" type="number" placeholder="100%" value="100" step="1" size="10" />
				</span>
				<span title="Invert Filter (percent)">
					<label for="${cfg.prefix}panel_invert">Invert</label>
					<input id="${cfg.prefix}panel_invert" name="invert" type="number" placeholder="0%" value="0" min="0" max="100" step="1" size="10" />
				</span>
				<span title="Hue-Rotate Filter (degrees)">
					<label for="${cfg.prefix}panel_hue">Hue-Rotate</label>
					<input id="${cfg.prefix}panel_hue" name="hue" type="number" placeholder="0deg" value="0" min="0" max="360" step="1" size="10" />
				</span>
				<span title="Blur Filter (pixels)">
					<label for="${cfg.prefix}panel_blur">Blur</label>
					<input id="${cfg.prefix}panel_blur" name="blur" type="number" placeholder="0px" value="0" step="1" size="10" />
				</span>
				<span title="Opacity Filter (percent)">
					<label for="${cfg.prefix}panel_opacity">Opacity</label>
					<input id="${cfg.prefix}panel_opacity" name="opacity" type="number" placeholder="100%" value="100" min="0" max="100" step="1" size="10" />
				</span>
				<span title="Grayscale Filter (percent)">
					<label for="${cfg.prefix}panel_grayscale">Grayscale</label>
					<input id="${cfg.prefix}panel_grayscale" name="grayscale" type="number" placeholder="0%" value="0" min="0" max="0" step="1" size="10" />
				</span>
				<span title="Sepia Filter (percent)">
					<label for="${cfg.prefix}panel_sepia">Sepia</label>
					<input id="${cfg.prefix}panel_sepia" name="sepia" type="number" placeholder="0%" value="0" min="0" max="100" step="1" size="10" />
				</span>
				<span title="CSS Rule (video, img, svg, ...)">
					<label for="${cfg.prefix}panel_rule">Rule</label>
					<input id="${cfg.prefix}panel_rule" name="rule" type="text" placeholder="video" value="video" size="30" />
				</span>
				<button id="${cfg.prefix}panel_reset">Reset</button>
			</dialog>
		`;
let		css			= null,
		filter		= null,
		data		= {
			rule:		"video",
			brightness:	100,
			contrast:	100,
			saturation:	100,
			invert:		0,
			hue:		0,
			blur:		0,
			opacity:	100,
			grayscale:	0,
			sepia:		0,
		};

function start() {
	data							= Object.assign(data, GM_getValue(`${cfg.prefix}settings`, data));
	
	cfg.commands.panel.options.id	= GM_registerMenuCommand(cfg.commands.panel.name, panel, cfg.commands.panel.options);
	css								= GM_addStyle(style);
	
	update();
	
	GM_log(`--- '${cfg.name}' started ---`);
} //start
function stop() {
	GM_unregisterMenuCommand(cfg.commands.panel.options.id);
} //stop

function panel() {
	const	doc			= Document.parseHTMLUnsafe(panelform),
			form		= doc.getElementById(`${cfg.prefix}panel`),
			close		= doc.getElementById(`${cfg.prefix}panel_close`),
			brightness	= doc.getElementById(`${cfg.prefix}panel_brightness`),
			contrast	= doc.getElementById(`${cfg.prefix}panel_contrast`),
			saturation	= doc.getElementById(`${cfg.prefix}panel_saturation`),
			invert		= doc.getElementById(`${cfg.prefix}panel_invert`),
			hue			= doc.getElementById(`${cfg.prefix}panel_hue`),
			blur		= doc.getElementById(`${cfg.prefix}panel_blur`),
			opacity		= doc.getElementById(`${cfg.prefix}panel_opacity`),
			grayscale	= doc.getElementById(`${cfg.prefix}panel_grayscale`),
			sepia		= doc.getElementById(`${cfg.prefix}panel_sepia`),
			rule		= doc.getElementById(`${cfg.prefix}panel_rule`),
			reset		= doc.getElementById(`${cfg.prefix}panel_reset`);
	
	close.onclick		= () => form.remove();
	reset.onclick		= () => {
		data		= {
			rule:		"video",
			brightness:	100,
			contrast:	100,
			saturation:	100,
			invert:		0,
			hue:		0,
			blur:		0,
			opacity:	100,
			grayscale:	0,
			sepia:		0,
		};
		update();
	};
	brightness.value	= data.brightness;
	brightness.onchange	= () => {
		data.brightness	= Math.round(brightness.value);
		update();
	};
	contrast.value		= data.contrast;
	contrast.onchange	= () => {
		data.contrast	= Math.round(contrast.value);
		update();
	};
	saturation.value	= data.saturation;
	saturation.onchange	= () => {
		data.saturation	= Math.round(saturation.value);
		update();
	};
	invert.value		= data.invert;
	invert.onchange		= () => {
		data.invert		= Math.round(invert.value);
		update();
	};
	hue.value			= data.hue;
	hue.onchange		= () => {
		data.hue		= Math.round(hue.value);
		update();
	};
	blur.value			= data.blur;
	blur.onchange		= () => {
		data.blur		= Math.round(blur.value);
		update();
	};
	opacity.value		= data.opacity;
	opacity.onchange	= () => {
		data.opacity	= Math.round(opacity.value);
		update();
	};
	grayscale.value		= data.grayscale;
	grayscale.onchange	= () => {
		data.grayscale	= Math.round(grayscale.value);
		update();
	};
	sepia.value			= data.sepia;
	sepia.onchange		= () => {
		data.sepia		= Math.round(sepia.value);
		update();
	};
	rule.onchange		= () => {
		data.rule		= rule.value.trim();
		update();
	};
	
	document.body.appendChild(document.adoptNode(form));
	form.show();
} //panel

start();

function update() {
	GM_setValue(`${cfg.prefix}settings`, data);
	
	if (filter)	filter.remove();
	
	filter		= GM_addStyle(`
		${data.rule} {
			filter: brightness(${data.brightness}%) contrast(${data.contrast}%) saturate(${data.saturation}%) invert(${data.invert}%) hue-rotate(${data.hue}deg) blur(${data.blur}px) opacity(${data.opacity}%) grayscale(${data.grayscale}%) sepia(${data.sepia}%) !important;
		}
	`);
} //update
