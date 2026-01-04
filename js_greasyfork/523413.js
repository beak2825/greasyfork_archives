// ==UserScript==
// @name        YouTube Viewfinding
// @version     0.37
// @description Zoom, rotate & crop YouTube videos
// @author      Callum Latham
// @namespace   https://greasyfork.org/users/696211-ctl2
// @license     GNU GPLv3
// @compatible  chrome
// @compatible  edge
// @compatible  firefox Video dimensions affect page scrolling
// @compatible  opera Video dimensions affect page scrolling
// @match       *://www.youtube.com/*
// @match       *://youtube.com/*
// @require     https://update.greasyfork.org/scripts/446506/1683593/%24Config.js
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/523413/YouTube%20Viewfinding.user.js
// @updateURL https://update.greasyfork.org/scripts/523413/YouTube%20Viewfinding.meta.js
// ==/UserScript==

/* global $Config */

(() => {
const isEmbed = window.location.pathname.split('/')[1] === 'embed';

// Don't run in non-embed frames (e.g. stream chat frame)
if (window.parent !== window && !isEmbed) {
	return;
}

const VAR_ZOOM = '--viewfind-zoom';
const LIMITS = {none: 'None', static: 'Static', fit: 'Fit'};

const $config = new $Config(
	'VIEWFIND_TREE',
	(() => {
		const isCSSRule = (() => {
			const wrapper = document.createElement('style');
			const regex = /\s/g;
			
			return (property, text) => {
				const ruleText = `${property}:${text};`;
				
				document.head.appendChild(wrapper);
				wrapper.sheet.insertRule(`:not(*){${ruleText}}`);
				
				const [{style: {cssText}}] = wrapper.sheet.cssRules;
				
				wrapper.remove();
				
				return cssText.replaceAll(regex, '') === ruleText.replaceAll(regex, '') || `Must be a valid CSS ${property} rule`;
			};
		})();
		
		const getHideId = (() => {
			let id = -1;
			
			return () => ++id;
		})();
		
		const glowHideId = getHideId();
		
		return {
			get: (_, configs) => Object.assign(...configs),
			children: [
				{
					label: 'Controls',
					children: [
						{
							label: 'Keybinds',
							descendantPredicate: ([actions, reset, configure]) => {
								const keybinds = [...actions.children.slice(1), reset, configure].map(({children}) => children.filter(({value}) => value !== '').map(({value}) => value));
								
								for (let i = 0; i < keybinds.length - 1; ++i) {
									for (let j = i + 1; j < keybinds.length; ++j) {
										if (keybinds[i].length === keybinds[j].length && keybinds[i].every((keyA) => keybinds[j].some((keyB) => keyA === keyB))) {
											return 'Another action has this keybind';
										}
									}
								}
								
								return true;
							},
							get: (_, configs) => ({keys: Object.assign(...configs)}),
							children: (() => {
								const seed = {
									value: '',
									listeners: {
										keydown: (event) => {
											switch (event.key) {
											case 'Enter':
											case 'Escape':
												return;
											}
											
											event.preventDefault();
											
											event.target.value = event.code;
											
											event.target.dispatchEvent(new InputEvent('input'));
										},
									},
								};
								
								const getKeys = (children) => new Set(children.filter(({value}) => value !== '').map(({value}) => value));
								
								const getNode = (label, keys, get) => ({
									label,
									seed,
									children: keys.map((value) => ({...seed, value})),
									get,
								});
								
								return [
									{
										label: 'Actions',
										get: (_, [toggle, ...controls]) => Object.assign(...controls.map(({id, keys}) => ({
											[id]: {
												toggle,
												keys,
											},
										}))),
										children: [
											{
												label: 'Toggle?',
												value: false,
												get: ({value}) => value,
											},
											...[
												['Pan / Zoom', ['KeyZ'], 'pan'],
												['Rotate', ['IntlBackslash'], 'rotate'],
												['Crop', ['KeyZ', 'IntlBackslash'], 'crop'],
											].map(([label, keys, id]) => getNode(label, keys, ({children}) => ({id, keys: getKeys(children)}))),
										],
									},
									getNode('Reset', ['KeyX'], ({children}) => ({reset: {keys: getKeys(children)}})),
									getNode('Configure', ['AltLeft', 'KeyX'], ({children}) => ({config: {keys: getKeys(children)}})),
								];
							})(),
						},
						{
							label: 'Scroll Speeds',
							get: (_, configs) => ({speeds: Object.assign(...configs)}),
							children: [
								{
									label: 'Zoom',
									value: -100,
									get: ({value}) => ({zoom: value / 150000}),
								},
								{
									label: 'Rotate',
									value: -100,
									// 150000 * (5 - 0.8) / 2π ≈ 100000
									get: ({value}) => ({rotate: value / 100000}),
								},
								{
									label: 'Crop',
									value: -100,
									get: ({value}) => ({crop: value / 300000}),
								},
							],
						},
						{
							label: 'Drag Inversions',
							get: (_, configs) => ({multipliers: Object.assign(...configs)}),
							children: [
								['Pan', 'pan'],
								['Rotate', 'rotate'],
								['Crop', 'crop'],
							].map(([label, key, value = false]) => ({
								label,
								value,
								get: ({value}) => ({[key]: value ? -1 : 1}),
							})),
						},
						{
							label: 'Click Movement Allowance (px)',
							value: 2,
							predicate: (value) => value >= 0 || 'Allowance must be positive',
							inputAttributes: {min: 0},
							get: ({value: clickCutoff}) => ({clickCutoff}),
						},
					],
				},
				{
					label: 'Behaviour',
					children: [
						...(() => {
							const typeNode = {
								label: 'Type',
								get: ({value}) => ({type: value}),
							};
							
							const hiddenNodes = {
								[LIMITS.static]: {
									label: 'Value (%)',
									predicate: (value) => value >= 0 || 'Limit must be positive',
									inputAttributes: {min: 0},
									get: ({value}) => ({custom: value / 100}),
								},
								[LIMITS.fit]: {
									label: 'Glow Allowance (%)',
									predicate: (value) => value >= 0 || 'Allowance must be positive',
									inputAttributes: {min: 0},
									get: ({value}) => ({frame: value / 100}),
								},
							};
							
							const getNode = (label, key, value, options, ...hidden) => {
								const hideIds = {};
								const children = [{...typeNode, value, options}];
								
								for (const {id, value} of hidden) {
									const node = {...hiddenNodes[id], value, hideId: getHideId()};
									
									hideIds[node.hideId] = id;
									
									children.push(node);
								}
								
								if (hidden.length > 0) {
									children[0].onUpdate = (value) => {
										const hide = {};
										
										for (const [id, type] of Object.entries(hideIds)) {
											hide[id] = value !== type;
										}
										
										return {hide};
									};
								}
								
								return {
									label,
									get: (_, configs) => ({[key]: Object.assign(...configs)}),
									children,
								};
							};
							
							return [
								getNode(
									'Zoom In Limit',
									'zoomInLimit',
									LIMITS.static,
									[LIMITS.none, LIMITS.static, LIMITS.fit],
									{id: LIMITS.static, value: 500},
									{id: LIMITS.fit, value: 0},
								),
								getNode(
									'Zoom Out Limit',
									'zoomOutLimit',
									LIMITS.static,
									[LIMITS.none, LIMITS.static, LIMITS.fit],
									{id: LIMITS.static, value: 80},
									{id: LIMITS.fit, value: 300},
								),
								getNode(
									'Pan Limit',
									'panLimit',
									LIMITS.static,
									[LIMITS.none, LIMITS.static, LIMITS.fit],
									{id: LIMITS.static, value: 50},
								),
								getNode(
									'Snap Pan Limit',
									'snapPanLimit',
									LIMITS.fit,
									[LIMITS.none, LIMITS.fit],
								),
							];
						})(),
						{
							label: 'While Viewfinding',
							get: (_, configs) => {
								const {overlayKill, overlayHide, ...config} = Object.assign(...configs);
								
								return {
									active: {
										overlayRule: overlayKill && [overlayHide ? 'display' : 'pointer-events', 'none'],
										...config,
									},
								};
							},
							children: [
								{
									label: 'Pause Video?',
									value: false,
									get: ({value: pause}) => ({pause}),
								},
								{
									label: 'Hide Glow?',
									value: false,
									get: ({value: hideGlow}) => ({hideGlow}),
									hideId: glowHideId,
								},
								...((hideId) => [
									{
										label: 'Disable Overlay?',
										value: true,
										get: ({value: overlayKill}, configs) => Object.assign({overlayKill}, ...configs),
										onUpdate: (value) => ({hide: {[hideId]: !value}}),
										children: [
											{
												label: 'Hide Overlay?',
												value: false,
												get: ({value: overlayHide}) => ({overlayHide}),
												hideId,
											},
										],
									},
								])(getHideId()),
							],
						},
						
					],
				},
				{
					label: 'Glow',
					value: true,
					onUpdate: (value) => ({hide: {[glowHideId]: !value}}),
					get: ({value: on}, configs) => {
						if (!on) {
							return {};
						}
						
						const {turnover, ...config} = Object.assign(...configs);
						const sampleCount = Math.floor(config.fps * turnover);
						
						// avoid taking more samples than there's space for
						if (sampleCount > config.size) {
							const fps = config.size / turnover;
							
							return {
								glow: {
									...config,
									sampleCount: config.size,
									interval: 1000 / fps,
									fps,
								},
							};
						}
						
						return {
							glow: {
								...config,
								interval: 1000 / config.fps,
								sampleCount,
							},
						};
					},
					children: [
						(() => {
							const [seed, getChild] = (() => {
								const options = ['blur', 'brightness', 'contrast', 'drop-shadow', 'grayscale', 'hue-rotate', 'invert', 'opacity', 'saturate', 'sepia'];
								const ids = {};
								const hide = {};
								
								for (const option of options) {
									ids[option] = getHideId();
									
									hide[ids[option]] = true;
								}
								
								const min0Amount = {
									label: 'Amount (%)',
									value: 100,
									predicate: (value) => value >= 0 || 'Amount must be positive',
									inputAttributes: {min: 0},
								};
								
								const max100Amount = {
									label: 'Amount (%)',
									value: 0,
									predicate: (value) => {
										if (value < 0) {
											return 'Amount must be positive';
										}
										
										return value <= 100 || 'Amount may not exceed 100%';
									},
									inputAttributes: {min: 0, max: 100},
								};
								
								const getScaled = (value) => `calc(${value}px/var(${VAR_ZOOM}))`;
								
								const root = {
									label: 'Function',
									options,
									value: options[0],
									get: ({value}, configs) => {
										const config = Object.assign(...configs);
										
										switch (value) {
										case options[0]:
											return {
												filter: config.blurScale ? `blur(${config.blur}px)` : `blur(${getScaled(config.blur)})`,
												blur: {
													x: config.blur,
													y: config.blur,
													scale: config.blurScale,
												},
											};
										
										case options[3]:
											return {
												filter: config.shadowScale ?
													`drop-shadow(${config.shadow} ${config.shadowX}px ${config.shadowY}px ${config.shadowSpread}px)` :
													`drop-shadow(${config.shadow} ${getScaled(config.shadowX)} ${getScaled(config.shadowY)} ${getScaled(config.shadowSpread)})`,
												blur: {
													x: config.shadowSpread + Math.abs(config.shadowX),
													y: config.shadowSpread + Math.abs(config.shadowY),
													scale: config.shadowScale,
												},
											};
										
										case options[5]:
											return {filter: `hue-rotate(${config.hueRotate}deg)`};
										}
										
										return {filter: `${value}(${config[value]}%)`};
									},
									onUpdate: (value) => ({hide: {...hide, [ids[value]]: false}}),
								};
								
								const children = {
									'blur': [
										{
											label: 'Distance (px)',
											value: 0,
											get: ({value}) => ({blur: value}),
											predicate: (value) => value >= 0 || 'Distance must be positive',
											inputAttributes: {min: 0},
											hideId: ids.blur,
										},
										{
											label: 'Scale?',
											value: false,
											get: ({value}) => ({blurScale: value}),
											hideId: ids.blur,
										},
									],
									'brightness': [
										{
											...min0Amount,
											hideId: ids.brightness,
											get: ({value}) => ({brightness: value}),
										},
									],
									'contrast': [
										{
											...min0Amount,
											hideId: ids.contrast,
											get: ({value}) => ({contrast: value}),
										},
									],
									'drop-shadow': [
										{
											label: 'Colour',
											input: 'color',
											value: '#FFFFFF',
											get: ({value}) => ({shadow: value}),
											hideId: ids['drop-shadow'],
										},
										{
											label: 'Horizontal Offset (px)',
											value: 0,
											get: ({value}) => ({shadowX: value}),
											hideId: ids['drop-shadow'],
										},
										{
											label: 'Vertical Offset (px)',
											value: 0,
											get: ({value}) => ({shadowY: value}),
											hideId: ids['drop-shadow'],
										},
										{
											label: 'Spread (px)',
											value: 0,
											predicate: (value) => value >= 0 || 'Spread must be positive',
											inputAttributes: {min: 0},
											get: ({value}) => ({shadowSpread: value}),
											hideId: ids['drop-shadow'],
										},
										{
											label: 'Scale?',
											value: true,
											get: ({value}) => ({shadowScale: value}),
											hideId: ids['drop-shadow'],
										},
									],
									'grayscale': [
										{
											...max100Amount,
											hideId: ids.grayscale,
											get: ({value}) => ({grayscale: value}),
										},
									],
									'hue-rotate': [
										{
											label: 'Angle (deg)',
											value: 0,
											get: ({value}) => ({hueRotate: value}),
											hideId: ids['hue-rotate'],
										},
									],
									'invert': [
										{
											...max100Amount,
											hideId: ids.invert,
											get: ({value}) => ({invert: value}),
										},
									],
									'opacity': [
										{
											...max100Amount,
											value: 100,
											hideId: ids.opacity,
											get: ({value}) => ({opacity: value}),
										},
									],
									'saturate': [
										{
											...min0Amount,
											hideId: ids.saturate,
											get: ({value}) => ({saturate: value}),
										},
									],
									'sepia': [
										{
											...max100Amount,
											hideId: ids.sepia,
											get: ({value}) => ({sepia: value}),
										},
									],
								};
								
								return [
									{...root, children: Object.values(children).flat()}, (id, ...values) => {
										const replacements = [];
										
										for (const [i, child] of children[id].entries()) {
											replacements.push({...child, value: values[i]});
										}
										
										return {
											...root,
											value: id,
											children: Object.values({...children, [id]: replacements}).flat(),
										};
									},
								];
							})();
							
							return {
								label: 'Filter',
								get: (_, configs) => {
									const scaled = {x: 0, y: 0};
									const unscaled = {x: 0, y: 0};
									
									let filter = '';
									
									for (const config of configs) {
										filter += config.filter;
										
										if ('blur' in config) {
											const target = config.blur.scale ? scaled : unscaled;
											
											target.x = Math.max(target.x, config.blur.x);
											target.y = Math.max(target.y, config.blur.y);
										}
									}
									
									return {filter, blur: {scaled, unscaled}};
								},
								children: [
									getChild('saturate', 150),
									getChild('brightness', 150),
									getChild('blur', 25, false),
								],
								seed,
							};
						})(),
						{
							label: 'Update',
							childPredicate: ([{value: fps}, {value: turnover}]) => fps * turnover >= 1 || `${turnover} second turnover cannot be achieved at ${fps} hertz`,
							children: [
								{
									label: 'Frequency (Hz)',
									value: 15,
									predicate: (value) => {
										if (value > 144) {
											return 'Update frequency may not be above 144 hertz';
										}
										
										return value >= 0 || 'Update frequency must be positive';
									},
									inputAttributes: {min: 0, max: 144},
									get: ({value: fps}) => ({fps}),
								},
								{
									label: 'Turnover Time (s)',
									value: 3,
									predicate: (value) => value >= 0 || 'Turnover time must be positive',
									inputAttributes: {min: 0},
									get: ({value: turnover}) => ({turnover}),
								},
								{
									label: 'Reverse?',
									value: false,
									get: ({value: doFlip}) => ({doFlip}),
								},
							],
						},
						{
							label: 'Size (px)',
							value: 50,
							predicate: (value) => value >= 0 || 'Size must be positive',
							inputAttributes: {min: 0},
							get: ({value}) => ({size: value}),
						},
						{
							label: 'End Point (%)',
							value: 103,
							predicate: (value) => value >= 0 || 'End point must be positive',
							inputAttributes: {min: 0},
							get: ({value}) => ({end: value / 100}),
						},
					].map((node) => ({...node, hideId: glowHideId})),
				},
				{
					label: 'Interfaces',
					children: [
						{
							label: 'Crop',
							get: (_, configs) => ({crop: Object.assign(...configs)}),
							children: [
								{
									label: 'Colours',
									get: (_, configs) => ({colour: Object.assign(...configs)}),
									children: [
										{
											label: 'Fill',
											get: (_, [colour, opacity]) => ({fill: `${colour}${opacity}`}),
											children: [
												{
													label: 'Colour',
													value: '#808080',
													input: 'color',
													get: ({value}) => value,
												},
												{
													label: 'Opacity (%)',
													value: 40,
													predicate: (value) => {
														if (value < 0) {
															return 'Opacity must be positive';
														}
														
														return value <= 100 || 'Opacity may not exceed 100%';
													},
													inputAttributes: {min: 0, max: 100},
													get: ({value}) => Math.round(255 * value / 100).toString(16),
												},
											],
										},
										{
											label: 'Shadow',
											value: '#000000',
											input: 'color',
											get: ({value: shadow}) => ({shadow}),
										},
										{
											label: 'Border',
											value: '#ffffff',
											input: 'color',
											get: ({value: border}) => ({border}),
										},
									],
								},
								{
									label: 'Handle Size (%)',
									value: 6,
									predicate: (value) => {
										if (value < 0) {
											return 'Size must be positive';
										}
										
										return value <= 50 || 'Size may not exceed 50%';
									},
									inputAttributes: {min: 0, max: 50},
									get: ({value}) => ({handle: value / 100}),
								},
							],
						},
						{
							label: 'Crosshair',
							get: (value, configs) => ({crosshair: Object.assign(...configs)}),
							children: [
								{
									label: 'Show Pan Limits?',
									value: true,
									get: ({value: showFrame}) => ({showFrame}),
								},
								{
									label: 'Outer Thickness (px)',
									value: 3,
									predicate: (value) => value >= 0 || 'Thickness must be positive',
									inputAttributes: {min: 0},
									get: ({value: outer}) => ({outer}),
								},
								{
									label: 'Inner Thickness (px)',
									value: 1,
									predicate: (value) => value >= 0 || 'Thickness must be positive',
									inputAttributes: {min: 0},
									get: ({value: inner}) => ({inner}),
								},
								{
									label: 'Inner Diameter (px)',
									value: 157,
									predicate: (value) => value >= 0 || 'Diameter must be positive',
									inputAttributes: {min: 0},
									get: ({value: gap}) => ({gap}),
								},
								((hideId) => ({
									label: 'Text',
									value: true,
									onUpdate: (value) => ({hide: {[hideId]: !value}}),
									get: ({value}, configs) => {
										if (!value) {
											return {};
										}
										
										const {translateX, translateY, ...config} = Object.assign(...configs);
										
										return {
											text: {
												translate: {
													x: translateX,
													y: translateY,
												},
												...config,
											},
										};
									},
									children: [
										{
											label: 'Font',
											value: '30px "Harlow Solid", cursive',
											predicate: isCSSRule.bind(null, 'font'),
											get: ({value: font}) => ({font}),
										},
										{
											label: 'Position (%)',
											get: (_, configs) => ({position: Object.assign(...configs)}),
											children: ['x', 'y'].map((label) => ({
												label,
												value: 0,
												predicate: (value) => Math.abs(value) <= 50 || 'Position must be on-screen',
												inputAttributes: {min: -50, max: 50},
												get: ({value}) => ({[label]: value + 50}),
											})),
										},
										{
											label: 'Offset (px)',
											get: (_, configs) => ({offset: Object.assign(...configs)}),
											children: [
												{
													label: 'x',
													value: -6,
													get: ({value: x}) => ({x}),
												},
												{
													label: 'y',
													value: -25,
													get: ({value: y}) => ({y}),
												},
											],
										},
										(() => {
											const options = ['Left', 'Center', 'Right'];
											
											return {
												label: 'Alignment',
												value: options[2],
												options,
												get: ({value}) => ({align: value.toLowerCase(), translateX: options.indexOf(value) * -50}),
											};
										})(),
										(() => {
											const options = ['Top', 'Middle', 'Bottom'];
											
											return {
												label: 'Baseline',
												value: options[0],
												options,
												get: ({value}) => ({translateY: options.indexOf(value) * -50}),
											};
										})(),
										{
											label: 'Line height (%)',
											value: 90,
											predicate: (value) => value >= 0 || 'Height must be positive',
											inputAttributes: {min: 0},
											get: ({value}) => ({height: value / 100}),
										},
									].map((node) => ({...node, hideId})),
								}))(getHideId()),
								{
									label: 'Colours',
									get: (_, configs) => ({colour: Object.assign(...configs)}),
									children: [
										{
											label: 'Fill',
											value: '#ffffff',
											input: 'color',
											get: ({value: fill}) => ({fill}),
										},
										{
											label: 'Shadow',
											value: '#000000',
											input: 'color',
											get: ({value: shadow}) => ({shadow}),
										},
									],
								},
							],
						},
					],
				},
			],
		};
	})(),
	{
		defaultStyle: {
			headBase: '#c80000',
			headButtonExit: '#000000',
			borderHead: '#ffffff',
			borderTooltip: '#c80000',
			width: Math.min(90, screen.width / 16),
			height: 90,
		},
		outerStyle: {
			zIndex: 10000,
			scrollbarColor: 'initial',
		},
		patches: [
			// removing "Glow Allowance" from pan limits
			({children: [, {children}]}) => {
				// pan
				children[2].children.splice(2, 1);
				// snap pan
				children[3].children.splice(1, 1);
			},
			({children: [,,,{children: [,{children}]}]}) => {
				children.splice(0, 0, {
					label: 'Show Pan Limits?',
					value: true,
				});
			},
		],
	},
);

const CLASS_VIEWFINDER = 'viewfind-element';
const DEGREES = {
	45: Math.PI / 4,
	90: Math.PI / 2,
	180: Math.PI,
	270: Math.PI / 2 * 3,
	360: Math.PI * 2,
};
const SELECTOR_VIDEO = '#movie_player video.html5-main-video';

// STATE

// elements
let video;
let altTarget;
let viewport;
let cinematics;

// derived values
let viewportTheta;
let videoTheta;
let videoHypotenuse;
let isThin;
let viewportRatio;
let viewportRatioInverse;
const halfDimensions = {video: {}, viewport: {}};

// other
let stopped = true;
let stopDrag;

const handleVideoChange = () => {
	DimensionCache.id++;
	
	halfDimensions.video.width = video.clientWidth / 2;
	halfDimensions.video.height = video.clientHeight / 2;
	
	videoTheta = getTheta(0, 0, video.clientWidth, video.clientHeight);
	videoHypotenuse = Math.sqrt(halfDimensions.video.width * halfDimensions.video.width + halfDimensions.video.height * halfDimensions.video.height);
};

const handleViewportChange = () => {
	DimensionCache.id++;
	
	isThin = getTheta(0, 0, viewport.clientWidth, viewport.clientHeight) < videoTheta;
	
	halfDimensions.viewport.width = viewport.clientWidth / 2;
	halfDimensions.viewport.height = viewport.clientHeight / 2;
	
	viewportTheta = getTheta(0, 0, viewport.clientWidth, viewport.clientHeight);
	
	viewportRatio = viewport.clientWidth / viewport.clientHeight;
	viewportRatioInverse = 1 / viewportRatio;
	
	position.constrain();
	
	glow.handleViewChange(true);
};

// ROTATION HELPERS

const getTheta = (fromX, fromY, toX, toY) => Math.atan2(toY - fromY, toX - fromX);

const getRotatedCorners = (radius, theta) => {
	const angle0 = DEGREES[90] - theta + rotation.value;
	const angle1 = theta + rotation.value - DEGREES[90];
	
	return [
		{
			x: Math.abs(radius * Math.cos(angle0)),
			y: Math.abs(radius * Math.sin(angle0)),
		},
		{
			x: Math.abs(radius * Math.cos(angle1)),
			y: Math.abs(radius * Math.sin(angle1)),
		},
	];
};

// CSS HELPER

const css = new function () {
	this.has = (name) => document.body.classList.contains(name);
	this.tag = (name, doAdd = true) => document.body.classList[doAdd ? 'add' : 'remove'](name);
	
	this.getSelector = (...classes) => `body.${classes.join('.')}`;
	
	const getSheet = () => {
		const element = document.createElement('style');
		
		document.head.appendChild(element);
		
		return element.sheet;
	};
	
	const getRuleString = (selector, ...declarations) => `${selector}{${declarations.map(([property, value]) => `${property}:${value};`).join('')}}`;
	
	this.add = function (...rule) {
		this.insertRule(getRuleString(...rule));
	}.bind(getSheet());
	
	this.Toggleable = class {
		static sheet = getSheet();
		
		static active = [];
		
		static id = 0;
		
		static add(rule, id) {
			this.sheet.insertRule(rule, this.active.length);
			
			this.active.push(id);
		}
		
		static remove(id) {
			let index = this.active.indexOf(id);
			
			while (index >= 0) {
				this.sheet.deleteRule(index);
				
				this.active.splice(index, 1);
				
				index = this.active.indexOf(id);
			}
		}
		
		id = this.constructor.id++;
		
		add(...rule) {
			this.constructor.add(getRuleString(...rule), this.id);
		}
		
		remove() {
			this.constructor.remove(this.id);
		}
	};
}();

// ACTION MANAGER

const enabler = new function () {
	this.CLASS_ABLE = 'viewfind-action-able';
	this.CLASS_DRAGGING = 'viewfind-action-dragging';
	
	this.keys = new Set();
	
	this.didPause = false;
	this.isHidingGlow = false;
	
	this.setActive = (action) => {
		const {active, keys} = $config.get();
		
		if (active.hideGlow && Boolean(action) !== this.isHidingGlow) {
			if (action) {
				this.isHidingGlow = true;
				
				glow.hide();
			} else if (this.isHidingGlow) {
				this.isHidingGlow = false;
				
				glow.show();
			}
		}
		
		this.activeAction?.onInactive?.();
		
		if (action) {
			this.activeAction = action;
			this.toggled = keys[action.CODE].toggle;
			
			action.onActive?.();
			
			if (active.pause && !video.paused) {
				video.pause();
				
				this.didPause = true;
			}
			
			return;
		}
		
		if (this.didPause) {
			video.play();
			
			this.didPause = false;
		}
		
		this.activeAction = this.toggled = undefined;
	};
	
	this.handleChange = () => {
		if (stopped || stopDrag || video.ended) {
			return;
		}
		
		const {keys} = $config.get();
		
		let activeAction;
		
		for (const action of Object.values(actions)) {
			if (
				keys[action.CODE].keys.size === 0 || !this.keys.isSupersetOf(keys[action.CODE].keys) || activeAction && ('toggle' in keys[action.CODE] ?
					!('toggle' in keys[activeAction.CODE]) || keys[activeAction.CODE].keys.size >= keys[action.CODE].keys.size :
					!('toggle' in keys[activeAction.CODE]) && keys[activeAction.CODE].keys.size >= keys[action.CODE].keys.size)
			) {
				if ('CLASS_ABLE' in action) {
					css.tag(action.CLASS_ABLE, false);
				}
				
				continue;
			}
			
			if (activeAction && 'CLASS_ABLE' in activeAction) {
				css.tag(activeAction.CLASS_ABLE, false);
			}
			
			activeAction = action;
		}
		
		if (activeAction === this.activeAction) {
			return;
		}
		
		if (activeAction) {
			if ('CLASS_ABLE' in activeAction) {
				css.tag(activeAction.CLASS_ABLE);
				
				css.tag(this.CLASS_ABLE);
				
				this.setActive(activeAction);
				
				return;
			}
			
			this.activeAction?.onInactive?.();
			
			activeAction.onActive();
			
			this.activeAction = activeAction;
		}
		
		css.tag(this.CLASS_ABLE, false);
		
		this.setActive(false);
	};
	
	this.stop = () => {
		css.tag(this.CLASS_ABLE, false);
		
		for (const action of Object.values(actions)) {
			if ('CLASS_ABLE' in action) {
				css.tag(action.CLASS_ABLE, false);
			}
		}
		
		this.setActive(false);
	};
	
	this.updateConfig = (() => {
		const rule = new css.Toggleable();
		const selector = `${css.getSelector(this.CLASS_ABLE)} #contentContainer.tp-yt-app-drawer[swipe-open]::after`
			+ `,${css.getSelector(this.CLASS_ABLE)} #movie_player > .html5-video-container ~ :not(.${CLASS_VIEWFINDER})`;
		
		return () => {
			const {overlayRule} = $config.get().active;
			
			rule.remove();
			
			if (overlayRule) {
				rule.add(selector, overlayRule);
			}
		};
	})();
	
	// insertion order decides priority
	css.add(`${css.getSelector(this.CLASS_DRAGGING)} #movie_player`, ['cursor', 'grabbing']);
	css.add(`${css.getSelector(this.CLASS_ABLE)} #movie_player`, ['cursor', 'grab']);
}();

// ELEMENT CONTAINER SETUP

const containers = new function () {
	for (const name of ['background', 'foreground', 'tracker']) {
		this[name] = document.createElement('div');
		
		this[name].classList.add(CLASS_VIEWFINDER);
	}
	
	// make an outline of the uncropped video
	css.add(`${css.getSelector(enabler.CLASS_ABLE)} #${this.foreground.id = 'viewfind-outlined'}`, ['outline', '1px solid white']);
	
	this.background.style.position = this.foreground.style.position = 'absolute';
	this.background.style.pointerEvents = this.foreground.style.pointerEvents = this.tracker.style.pointerEvents = 'none';
	this.tracker.style.height = this.tracker.style.width = '100%';
}();

// CACHE

class Cache {
	targets = [];
	
	constructor(...targets) {
		for (const source of targets) {
			this.targets.push({source});
		}
	}
	
	update(target) {
		return target.value !== (target.value = target.source.value);
	}
	
	isStale() {
		return this.targets.reduce((value, target) => value || this.update(target), false);
	}
}

class ConfigCache extends Cache {
	static id = 0;
	
	id = this.constructor.id;
	
	constructor(...targets) {
		super(...targets);
	}
	
	isStale() {
		if (this.id === (this.id = this.constructor.id)) {
			return super.isStale();
		}
		
		for (const target of this.targets) {
			target.value = target.source.value;
		}
		
		return true;
	}
}

class DimensionCache extends ConfigCache {
	static id = 0;
}

// RESIZE OBSERVER WRAPPER

class FixedResizeObserver {
	#observer;
	#doSkip;
	
	constructor(callback) {
		this.#observer = new ResizeObserver(() => {
			if (!this.#doSkip) {
				callback();
			}
			
			this.#doSkip = false;
		});
	}
	
	observe(target) {
		this.#doSkip = true;
		
		this.#observer.observe(target);
	}
	
	disconnect() {
		this.#observer.disconnect();
	}
}

// MODIFIERS

const rotation = new function () {
	this.value = DEGREES[90];
	
	this.reset = () => {
		this.value = DEGREES[90];
		
		video.style.removeProperty('rotate');
	};
	
	this.apply = () => {
		// Conversion from anticlockwise rotation from the x-axis to clockwise rotation from the y-axis
		video.style.setProperty('rotate', `${DEGREES[90] - this.value}rad`);
		
		delete actions.reset.restore;
	};
	
	// dissimilar from other constrain functions in that no effective limit is applied
	// -1.5π < rotation <= 0.5π
	// 0 <= 0.5π - rotation < 2π
	this.constrain = () => {
		this.value %= DEGREES[360];
		
		if (this.value > DEGREES[90]) {
			this.value -= DEGREES[360];
		} else if (this.value <= -DEGREES[270]) {
			this.value += DEGREES[360];
		}
		
		this.apply();
	};
}();

const zoom = new function () {
	this.value = 1;
	
	const scaleRule = new css.Toggleable();
	
	this.reset = () => {
		this.value = 1;
		
		video.style.removeProperty('scale');
		
		scaleRule.remove();
		scaleRule.add(':root', [VAR_ZOOM, '1']);
	};
	
	this.apply = () => {
		video.style.setProperty('scale', `${this.value}`);
		
		scaleRule.remove();
		scaleRule.add(':root', [VAR_ZOOM, `${this.value}`]);
		
		delete actions.reset.restore;
	};
	
	const getFit = (corner0, corner1, doSplit = false) => {
		const x = Math.max(corner0.x, corner1.x) / viewport.clientWidth;
		const y = Math.max(corner0.y, corner1.y) / viewport.clientHeight;
		
		return doSplit ? [0.5 / x, 0.5 / y] : 0.5 / Math.max(x, y);
	};
	
	this.getFit = (width, height) => getFit(...getRotatedCorners(Math.sqrt(width * width + height * height), getTheta(0, 0, width, height)));
	this.getVideoFit = (doSplit) => getFit(...getRotatedCorners(videoHypotenuse, videoTheta), doSplit);
	
	this.constrain = (() => {
		const limitGetters = {
			[LIMITS.static]: [({custom}) => custom, ({custom}) => custom],
			[LIMITS.fit]: (() => {
				const getGetter = () => {
					const zoomCache = new Cache(this);
					const rotationCache = new DimensionCache(rotation);
					const configCache = new ConfigCache();
					
					let updateOnZoom;
					
					let value;
					
					return ({frame}, glow) => {
						let fallthrough = rotationCache.isStale();
						
						if (configCache.isStale()) {
							if (glow) {
								const {scaled} = glow.blur;
								
								updateOnZoom = frame > 0 && (scaled.x > 0 || scaled.y > 0);
							} else {
								updateOnZoom = false;
							}
							
							fallthrough = true;
						}
						
						if (zoomCache.isStale() && updateOnZoom || fallthrough) {
							if (glow) {
								const base = glow.end - 1;
								const {scaled, unscaled} = glow.blur;
								
								value = this.getFit(
									halfDimensions.video.width + Math.max(0, base * halfDimensions.video.width + Math.max(unscaled.x, scaled.x * this.value)) * frame,
									halfDimensions.video.height + Math.max(0, base * halfDimensions.video.height + Math.max(unscaled.y, scaled.y * this.value)) * frame,
								);
							} else {
								value = this.getVideoFit();
							}
						}
						
						return value;
					};
				};
				
				return [getGetter(), getGetter()];
			})(),
		};
		
		return () => {
			const {zoomOutLimit, zoomInLimit, glow} = $config.get();
			
			if (zoomOutLimit.type !== 'None') {
				this.value = Math.max(limitGetters[zoomOutLimit.type][0](zoomOutLimit, glow), this.value);
			}
			
			if (zoomInLimit.type !== 'None') {
				this.value = Math.min(limitGetters[zoomInLimit.type][1](zoomInLimit, glow, 1), this.value);
			}
			
			this.apply();
		};
	})();
}();

const position = new function () {
	this.x = this.y = 0;
	
	this.getValues = () => ({x: this.x, y: this.y});
	
	this.reset = () => {
		this.x = this.y = 0;
		
		video.style.removeProperty('translate');
	};
	
	this.apply = () => {
		video.style.setProperty('transform-origin', `${(0.5 + this.x) * 100}% ${(0.5 - this.y) * 100}%`);
		video.style.setProperty('translate', `${-this.x * 100}% ${this.y * 100}%`);
		
		delete actions.reset.restore;
	};
	
	const frame = new function () {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		
		Object.defineProperty(this, 'hide', (() => {
			let hide = true;
			
			return {
				get: () => hide,
				set: (value) => {
					if (value) {
						canvas.style.setProperty('display', 'none');
					} else {
						canvas.style.removeProperty('display');
					}
					
					hide = value;
				},
			};
		})());
		
		canvas.id = 'viewfind-frame-canvas';
		
		// lazy code
		window.setTimeout(() => {
			css.add(`#${canvas.id}:not(${css.getSelector(actions.pan.CLASS_ABLE)} *):not(${css.getSelector(actions.rotate.CLASS_ABLE)} *)`, ['display', 'none']);
		}, 0);
		
		canvas.style.position = 'absolute';
		
		containers.foreground.append(canvas);
		
		const to = (x, y, move = false) => {
			ctx[`${move ? 'move' : 'line'}To`]((x + 0.5) * video.clientWidth, (0.5 - y) * video.clientHeight);
		};
		
		this.draw = (points) => {
			canvas.width = video.clientWidth;
			canvas.height = video.clientHeight;
			
			if (this.hide || !points) {
				return;
			}
			
			ctx.save();
			
			ctx.beginPath();
			
			ctx.moveTo(0, 0);
			ctx.lineTo(canvas.width, 0);
			ctx.lineTo(canvas.width, canvas.height);
			ctx.lineTo(0, canvas.height);
			ctx.closePath();
			
			let doMove = true;
			
			for (const {x, y} of points) {
				to(x, y, doMove);
				doMove = false;
			}
			
			ctx.closePath();
			
			ctx.clip('evenodd');
			
			ctx.fillStyle = 'black';
			ctx.globalAlpha = 0.6;
			
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			ctx.restore();
			
			ctx.beginPath();
			
			if (points.length !== 2) {
				return;
			}
			
			ctx.strokeStyle = 'white';
			ctx.lineWidth = 1;
			ctx.globalAlpha = 1;
			
			doMove = true;
			
			for (const {x, y} of points) {
				to(x, y, doMove);
				doMove = false;
			}
			
			ctx.stroke();
		};
	}();
	
	this.updateFrameOnReset = () => {
		const {panLimit, crosshair: {showFrame}} = $config.get();
		
		if (showFrame && panLimit.type === LIMITS.fit) {
			this.constrain();
		}
	};
	
	this.updateFrame = () => {
		const {panLimit, crosshair: {showFrame}} = $config.get();
		
		frame.hide = !showFrame;
		
		if (frame.hide) {
			return;
		}
		
		switch (panLimit.type) {
		case LIMITS.fit:
			return;
		
		case LIMITS.static:
			if (panLimit.custom < 0.5) {
				frame.draw([
					{x: panLimit.custom, y: panLimit.custom},
					{x: panLimit.custom, y: -panLimit.custom},
					{x: -panLimit.custom, y: -panLimit.custom},
					{x: -panLimit.custom, y: panLimit.custom},
				]);
				
				return;
			}
		}
		
		frame.draw();
	};
	
	this.constrain = (() => {
		// logarithmic progress from "low" to infinity
		const getProgress = (low, target) => 1 - low / target;
		
		const getProgressed = ({x: fromX, y: fromY, z: lowZ}, {x: toX, y: toY}, targetZ) => {
			const p = getProgress(lowZ, targetZ);
			
			return {x: p * (toX - fromX) + fromX, y: p * (toY - fromY) + fromY};
		};
		
		const perfectSlopes = [Infinity, -Infinity, 0];
		
		const getLineY = ({m, c, y}, x = this.x) => perfectSlopes.includes(m) ? y : m * x + c; // y = mx + c
		const getLineX = ({m, c, x}, y = this.y) => perfectSlopes.includes(m) ? x : (y - c) / m; // x = (y - c) / m
		
		const isAbove = (line, {x, y} = this) => y > getLineY(line, x);
		const isRight = (line, {x, y} = this) => x > getLineX(line, y);
		
		const getM = (from, to) => (to.y - from.y) / (to.x - from.x);
		const getLine = (m, {x, y} = this) => ({c: y - m * x, m, x, y});
		const getFlipped = ({x, y}) => ({x: -x, y: -y});
		
		const constrain2D = (() => {
			const isBetween = (() => {
				const isBetweenBase = ({low, high}) => {
					return isRight(low) && !isRight(high);
				};
				
				const isBetweenSide = ({low, high}) => {
					return isAbove(low) && !isAbove(high);
				};
				
				return (line, tangent) => {
					if (tangent.isSide) {
						return isBetweenSide(tangent) && (tangent.isHigh ? isRight(line) : !isRight(line));
					}
					
					return isBetweenBase(tangent) && (tangent.isHigh ? isAbove(line) : !isAbove(line));
				};
			})();
			
			const setTangentIntersect = (() => {
				const setTangentIntersectX = (line, m, diff) => {
					if (line.m === 0) {
						this.y = line.y;
						
						return;
					}
					
					const tangent = getLine(m);
					
					this.x = (tangent.c - line.c) / diff;
					this.y = getLineY(line);
				};
				
				const setTangentIntersectY = (line, m, diff) => {
					if (m === 0) {
						this.x = line.x;
						
						return;
					}
					
					const tangent = getLine(m);
					
					this.y = (m * line.c - line.m * tangent.c) / -diff;
					this.x = getLineX(line);
				};
				
				return (line, {isSide}, m, diff) => {
					if (isSide) {
						setTangentIntersectY(line, m, diff);
					} else {
						setTangentIntersectX(line, m, diff);
					}
				};
			})();
			
			const isOutside = (tangent, property) => {
				if (tangent.isSide) {
					return tangent[property].isHigh ? isAbove(tangent.high) : !isAbove(tangent.low);
				}
				
				return tangent[property].isHigh ? isRight(tangent.high) : !isRight(tangent.low);
			};
			
			return (points, lines, tangents) => {
				if (isBetween(lines.top, tangents.top)) {
					setTangentIntersect(lines.top, tangents.top, tangents.base, tangents.baseDiff);
				} else if (isBetween(lines.bottom, tangents.bottom)) {
					setTangentIntersect(lines.bottom, tangents.bottom, tangents.base, tangents.baseDiff);
				} else if (isBetween(lines.right, tangents.right)) {
					setTangentIntersect(lines.right, tangents.right, tangents.side, tangents.sideDiff);
				} else if (isBetween(lines.left, tangents.left)) {
					setTangentIntersect(lines.left, tangents.left, tangents.side, tangents.sideDiff);
				} else if (isOutside(tangents.top, 'right') && isOutside(tangents.right, 'top')) {
					this.x = points.topRight.x;
					this.y = points.topRight.y;
				} else if (isOutside(tangents.bottom, 'right') && isOutside(tangents.right, 'bottom')) {
					this.x = points.bottomRight.x;
					this.y = points.bottomRight.y;
				} else if (isOutside(tangents.top, 'left') && isOutside(tangents.left, 'top')) {
					this.x = points.topLeft.x;
					this.y = points.topLeft.y;
				} else if (isOutside(tangents.bottom, 'left') && isOutside(tangents.left, 'bottom')) {
					this.x = points.bottomLeft.x;
					this.y = points.bottomLeft.y;
				}
			};
		})();
		
		const get1DConstrainer = (point) => {
			const line = {
				...point,
				m: point.y / point.x,
				c: 0,
			};
			
			frame.draw([point, getFlipped(point)]);
			
			if (!isFinite(line.m)) {
				return () => {
					this.y = Math.max(-point.y, Math.min(point.y, this.y));
					this.x = 0;
				};
			}
			
			if (line.x < 0) {
				line.x = -line.x;
				line.y = -line.y;
			}
			
			if (line.m === 0) {
				return () => {
					this.x = Math.max(-line.x, Math.min(line.x, this.x));
					this.y = 0;
				};
			}
			
			const tangentM = -1 / line.m;
			const mDiff = line.m - tangentM;
			
			return () => {
				this.x = Math.max(-line.x, Math.min(line.x, getLine(tangentM).c / mDiff));
				this.y = getLineY(line, this.x);
			};
		};
		
		const getBoundApplyFrame = (() => {
			const getBound = (first, second, isTopLeft) => {
				if (zoom.value <= first.z) {
					return false;
				}
				
				if (zoom.value >= second.z) {
					const progress = zoom.value / second.z;
					
					const x = isTopLeft ?
						-0.5 - (-0.5 - second.x) / progress :
						0.5 - (0.5 - second.x) / progress;
					
					return {
						x,
						y: 0.5 - (0.5 - second.y) / progress,
					};
				}
				
				return {
					...getProgressed(first, second.vpEnd, zoom.value),
					axis: second.vpEnd.axis,
					m: second.y / second.x,
					c: 0,
				};
			};
			
			const swap = (array, i0, i1) => {
				const temp = array[i0];
				
				array[i0] = array[i1];
				array[i1] = temp;
			};
			
			const setHighTangent = (tangent, low, high) => {
				tangent.low = tangent[low];
				tangent.high = tangent[high];
				
				tangent[low].isHigh = false;
				tangent[high].isHigh = true;
			};
			
			const getFrame = (point0, point1) => {
				const flipped0 = getFlipped(point0);
				const flipped1 = getFlipped(point1);
				
				const m0 = getM(point0, point1);
				const m1 = getM(flipped0, point1);
				
				const tangentM0 = -1 / m0;
				const tangentM1 = -1 / m1;
				
				const lines = {
					top: getLine(m0, point0),
					bottom: getLine(m0, flipped0),
					
					left: getLine(m1, point0),
					right: getLine(m1, flipped0),
				};
				
				const points = {
					topLeft: point0,
					topRight: point1,
					bottomRight: flipped0,
					bottomLeft: flipped1,
				};
				
				const tangents = {
					top: {
						right: getLine(tangentM0, points.topRight),
						left: getLine(tangentM0, points.topLeft),
					},
					right: {
						top: getLine(tangentM1, points.topRight),
						bottom: getLine(tangentM1, points.bottomRight),
					},
					bottom: {
						right: getLine(tangentM0, points.bottomRight),
						left: getLine(tangentM0, points.bottomLeft),
					},
					left: {
						top: getLine(tangentM1, points.topLeft),
						bottom: getLine(tangentM1, points.bottomLeft),
					},
					baseDiff: m0 - tangentM0,
					sideDiff: m1 - tangentM1,
					base: tangentM0,
					side: tangentM1,
				};
				
				if (video.clientWidth < video.clientHeight) {
					if (getLineX(lines.right, 0) < getLineX(lines.left, 0)) {
						swap(lines, 'right', 'left');
						
						swap(points, 'bottomLeft', 'bottomRight');
						swap(points, 'topLeft', 'topRight');
						
						swap(tangents, 'right', 'left');
						swap(tangents.top, 'right', 'left');
						swap(tangents.bottom, 'right', 'left');
					}
				} else {
					if (lines.top.c < lines.bottom.c) {
						swap(lines, 'top', 'bottom');
						
						swap(points, 'topLeft', 'bottomLeft');
						swap(points, 'topRight', 'bottomRight');
						
						swap(tangents, 'top', 'bottom');
						swap(tangents.left, 'top', 'bottom');
						swap(tangents.right, 'top', 'bottom');
					}
				}
				
				tangents.top.isSide = tangents.bottom.isSide = Math.abs(m0) > 1;
				tangents.top.isHigh = !tangents.top.isSide || lines.top.c < 0 === m0 > 0;
				tangents.bottom.isHigh = !tangents.top.isHigh;
				
				if (tangents.top.isSide && tangents.top.isHigh) {
					setHighTangent(tangents.top, 'right', 'left');
					setHighTangent(tangents.bottom, 'right', 'left');
				} else {
					setHighTangent(tangents.top, 'left', 'right');
					setHighTangent(tangents.bottom, 'left', 'right');
				}
				
				tangents.right.isSide = tangents.left.isSide = Math.abs(m1) > 1;
				tangents.right.isHigh = tangents.right.isSide || lines.right.c > 0;
				tangents.left.isHigh = !tangents.right.isHigh;
				
				if (!tangents.right.isSide && tangents.right.isHigh) {
					setHighTangent(tangents.right, 'top', 'bottom');
					setHighTangent(tangents.left, 'top', 'bottom');
				} else {
					setHighTangent(tangents.right, 'bottom', 'top');
					setHighTangent(tangents.left, 'bottom', 'top');
				}
				
				frame.draw(Object.values(points));
				
				return [points, lines, tangents];
			};
			
			return (first0, second0, first1, second1) => {
				const point0 = getBound(first0, second0, true);
				const point1 = getBound(first1, second1, false);
				
				if (point0 && point1) {
					return constrain2D.bind(null, ...getFrame(point0, point1));
				}
				
				if (point0 || point1) {
					return get1DConstrainer(point0 || point1);
				}
				
				frame.draw([]);
				
				return () => {
					this.x = this.y = 0;
				};
			};
		})();
		
		const snapZoom = (() => {
			const getDirected = (first, second, flip, cornerX) => {
				const get = flip ? (position) => getFlipped(position) : ({x, y}) => ({x, y});
				
				return [[first, get(second.vpEnd)], [{...get(second), z: second.z}, get({x: cornerX, y: 0.5})]];
			};
			
			// https://math.stackexchange.com/questions/2223691/intersect-2-lines-at-the-same-ratio-through-a-point
			const getIntersectProgress = ([{x: g, y: e}, {x: f, y: d}], [{x: k, y: i}, {x: j, y: h}], doFlip) => {
				const {x, y} = this;
				
				const a = d * j - d * k - j * e + e * k - h * f + h * g + i * f - i * g;
				const b = d * k - d * x - e * k + e * x + j * e - k * e - j * y + k * y - h * g + h * x + i * g - i * x - f * i + g * i + f * y - g * y;
				const c = k * e - e * x - k * y - g * i + i * x + g * y;
				
				return (doFlip ? -b - Math.sqrt(b * b - 4 * a * c) : -b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
			};
			
			// line with progressed start point
			const getProgressedLine = (line, {z}) => [getProgressed(...line, z), line[1]];
			
			const isValidZoom = (zoom) => zoom !== null && !isNaN(zoom);
			
			const getZoom = (pair0, pair1, pair2, doFlip) => getZoomPairSecond(pair2, doFlip)
				|| getZoomPairSecond(pair1, doFlip, getProgress(pair1[0], pair2[0]))
				|| getZoomPairSecond(pair0, doFlip, getProgress(pair0[0], pair1[0]));
			
			const getZoomPairSecond = ([z, ...pair], doFlip, maxP = 1) => {
				if (maxP >= 0) {
					const p = getIntersectProgress(...pair, doFlip);
					
					if (p >= 0 && p <= maxP) {
					// I don't think the >= 1 check is necessary but best be safe
						return p >= 1 ? Number.MAX_SAFE_INTEGER : z / (1 - p);
					}
				}
				
				return null;
			};
			
			return (first0, second0, first1, second1) => {
				const getPairings = (flip0, flip1) => {
					const [lineFirst0, lineSecond0] = getDirected(first0, second0, flip0, -0.5);
					const [lineFirst1, lineSecond1] = getDirected(first1, second1, flip1, 0.5);
					
					// array structure is:
					// start zoom for both lines
					// 0 line start and its infinite zoom point
					// 1 line start and its infinite zoom point
					
					return [
						first0.z >= first1.z ?
							[first0.z, lineFirst0, getProgressedLine(lineFirst1, first0)] :
							[first1.z, getProgressedLine(lineFirst0, first1), lineFirst1],
						
						...second0.z >= second1.z ?
							[
								[second1.z, getProgressedLine(lineFirst0, second1), lineSecond1],
								[second0.z, lineSecond0, getProgressedLine(lineSecond1, second0)],
							] :
							[
								[second0.z, lineSecond0, getProgressedLine(lineFirst1, second0)],
								[second1.z, getProgressedLine(lineSecond0, second1), lineSecond1],
							],
					];
				};
				
				zoom.value = Math.max(...[
					getZoom(...getPairings(false, false)),
					getZoom(...getPairings(false, true), true),
					getZoom(...getPairings(true, false), true),
					getZoom(...getPairings(true, true)),
				].filter(isValidZoom));
			};
		})();
		
		const getZoomPoints = (() => {
			const getPoints = (fitZoom, doFlip) => {
				const getGenericRotated = (x, y, angle) => {
					const radius = Math.sqrt(x * x + y * y);
					const pointTheta = getTheta(0, 0, x, y) + angle;
					
					return {
						x: radius * Math.cos(pointTheta),
						y: radius * Math.sin(pointTheta),
					};
				};
				
				const getRotated = (xRaw, yRaw) => {
					// Multiplying by video dimensions to have the axes' scales match the video's
					// Using midPoint's raw values would only work if points moved elliptically around the centre of rotation
					const rotated = getGenericRotated(xRaw * video.clientWidth, yRaw * video.clientHeight, (DEGREES[90] - rotation.value) % DEGREES[180]);
					
					rotated.x /= video.clientWidth;
					rotated.y /= video.clientHeight;
					
					return rotated;
				};
				
				return [
					{...getRotated(halfDimensions.viewport.width / video.clientWidth / fitZoom[0], 0), axis: doFlip ? 'y' : 'x'},
					{...getRotated(0, halfDimensions.viewport.height / video.clientHeight / fitZoom[1]), axis: doFlip ? 'x' : 'y'},
				];
			};
			
			const getIntersection = (line, corner, middle) => {
				const getIntersection = (line0, line1) => {
					const a0 = line0[0].y - line0[1].y;
					const b0 = line0[1].x - line0[0].x;
					const c0 = line0[1].x * line0[0].y - line0[0].x * line0[1].y;
					
					const a1 = line1[0].y - line1[1].y;
					const b1 = line1[1].x - line1[0].x;
					const c1 = line1[1].x * line1[0].y - line1[0].x * line1[1].y;
					
					const d = a0 * b1 - b0 * a1;
					
					return {
						x: (c0 * b1 - b0 * c1) / d,
						y: (a0 * c1 - c0 * a1) / d,
					};
				};
				
				const {x, y} = getIntersection([{x: 0, y: 0}, middle], [line, corner]);
				const progress = isThin ? (y - line.y) / (corner.y - line.y) : (x - line.x) / (corner.x - line.x);
				
				return {x, y, z: line.z / (1 - progress), c: line.y};
			};
			
			const getIntersect = (yIntersect, corner, right, top) => {
				const point0 = getIntersection(yIntersect, corner, right);
				const point1 = getIntersection(yIntersect, corner, top);
				
				const [point, vpEnd] = point0.z > point1.z ? [point0, {...right}] : [point1, {...top}];
				
				if (Math.sign(point[vpEnd.axis]) !== Math.sign(vpEnd[vpEnd.axis])) {
					vpEnd.x = -vpEnd.x;
					vpEnd.y = -vpEnd.y;
				}
				
				return {...point, vpEnd};
			};
			
			// the angle from 0,0 to the center of the video edge angled towards the viewport's upper-right corner
			const getQuadrantAngle = (isEvenQuadrant) => {
				const angle = (rotation.value + DEGREES[360]) % DEGREES[90];
				
				return isEvenQuadrant ? angle : DEGREES[90] - angle;
			};
			
			return () => {
				const isEvenQuadrant = (Math.floor(rotation.value / DEGREES[90]) + 3) % 2 === 0;
				const quadrantAngle = getQuadrantAngle(isEvenQuadrant);
				
				const progress = quadrantAngle / DEGREES[90] * -2 + 1;
				const progressAngles = {
					base: Math.atan(progress * viewportRatio),
					side: Math.atan(progress * viewportRatioInverse),
				};
				const progressCosines = {
					base: Math.cos(progressAngles.base),
					side: Math.cos(progressAngles.side),
				};
				
				const fitZoom = zoom.getVideoFit(true);
				const points = getPoints(fitZoom, quadrantAngle >= DEGREES[45]);
				
				const sideIntersection = getIntersect(
					((cornerAngle) => ({
						x: 0,
						y: (halfDimensions.video.height - halfDimensions.video.width * Math.tan(cornerAngle)) / video.clientHeight,
						z: halfDimensions.viewport.width / (progressCosines.side * Math.abs(halfDimensions.video.width / Math.cos(cornerAngle))),
					}))(quadrantAngle + progressAngles.side),
					isEvenQuadrant ? {x: -0.5, y: 0.5} : {x: 0.5, y: 0.5},
					...points,
				);
				
				const baseIntersection = getIntersect(
					((cornerAngle) => ({
						x: 0,
						y: (halfDimensions.video.height - halfDimensions.video.width * Math.tan(cornerAngle)) / video.clientHeight,
						z: halfDimensions.viewport.height / (progressCosines.base * Math.abs(halfDimensions.video.width / Math.cos(cornerAngle))),
					}))(DEGREES[90] - quadrantAngle - progressAngles.base),
					isEvenQuadrant ? {x: 0.5, y: 0.5} : {x: -0.5, y: 0.5},
					...points,
				);
				
				const [originSide, originBase] = fitZoom.map((z) => ({x: 0, y: 0, z}));
				
				return isEvenQuadrant ?
					[...[originSide, sideIntersection], ...[originBase, baseIntersection]] :
					[...[originBase, baseIntersection], ...[originSide, sideIntersection]];
			};
		})();
		
		let zoomPoints;
		
		const getEnsureZoomPoints = (() => {
			const updateLog = [];
			let count = 0;
			
			return (isConfigBound = false) => {
				const zoomPointCache = new DimensionCache(rotation);
				// ConfigCache specifically to update frame
				const callbackCache = new (isConfigBound ? ConfigCache : Cache)(zoom);
				const id = count++;
				
				return () => {
					if (zoomPointCache.isStale()) {
						updateLog.length = 0;
						
						zoomPoints = getZoomPoints();
					}
					
					if (callbackCache.isStale() || !updateLog[id]) {
						updateLog[id] = true;
						
						return true;
					}
					
					return false;
				};
			};
		})();
		
		const handlers = {
			[LIMITS.static]: ({custom: ratio}) => {
				const bound = 0.5 + (ratio - 0.5);
				
				this.x = Math.max(-bound, Math.min(bound, this.x));
				this.y = Math.max(-bound, Math.min(bound, this.y));
			},
			[LIMITS.fit]: (() => {
				let boundApplyFrame;
				
				const ensure = getEnsureZoomPoints(true);
				
				return () => {
					if (ensure()) {
						boundApplyFrame = getBoundApplyFrame(...zoomPoints);
					}
					
					boundApplyFrame();
				};
			})(),
		};
		
		const snapHandlers = {
			[LIMITS.fit]: (() => {
				const ensure = getEnsureZoomPoints();
				
				return () => {
					ensure();
					
					snapZoom(...zoomPoints);
					
					zoom.constrain();
				};
			})(),
		};
		
		return (doZoom = false) => {
			const {panLimit, snapPanLimit} = $config.get();
			
			if (doZoom) {
				snapHandlers[snapPanLimit.type]?.();
			}
			
			handlers[panLimit.type]?.(panLimit);
			
			this.apply();
		};
	})();
}();

const crop = new function () {
	this.top = this.right = this.bottom = this.left = 0;
	
	this.getValues = () => ({top: this.top, right: this.right, bottom: this.bottom, left: this.left});
	
	this.reveal = () => {
		this.top = this.right = this.bottom = this.left = 0;
		
		rule.remove();
	};
	
	this.reset = () => {
		this.reveal();
		
		actions.crop.reset();
	};
	
	const rule = new css.Toggleable();
	
	this.apply = () => {
		rule.remove();
		rule.add(
			`${SELECTOR_VIDEO}:not(.${this.CLASS_ABLE} *)`,
			['clip-path', `inset(${this.top * 100}% ${this.right * 100}% ${this.bottom * 100}% ${this.left * 100}%)`],
		);
		
		delete actions.reset.restore;
		
		glow.handleViewChange();
		glow.reset();
	};
	
	this.getDimensions = (width = video.clientWidth, height = video.clientHeight) => [
		width * (1 - this.left - this.right),
		height * (1 - this.top - this.bottom),
	];
}();

// FUNCTIONALITY

const glow = (() => {
	const videoCanvas = new OffscreenCanvas(0, 0);
	const videoCtx = videoCanvas.getContext('2d', {alpha: false});
	
	const glowCanvas = document.createElement('canvas');
	const glowCtx = glowCanvas.getContext('2d', {alpha: false});
	
	glowCanvas.style.setProperty('position', 'absolute');
	
	class Sector {
		canvas = new OffscreenCanvas(0, 0);
		ctx = this.canvas.getContext('2d', {alpha: false});
		
		update(doFill) {
			if (doFill) {
				this.fill();
			} else {
				this.shift();
				this.take();
			}
			
			this.giveEdge();
			
			if (this.hasCorners) {
				this.giveCorners();
			}
		}
	}
	
	class Side extends Sector {
		setDimensions(doShiftRight, sWidth, sHeight, sx, sy, dx, dy, dWidth, dHeight) {
			this.canvas.width = sWidth;
			this.canvas.height = sHeight;
			
			this.shift = this.ctx.drawImage.bind(this.ctx, this.canvas, doShiftRight ? 1 : -1, 0);
			
			this.fill = this.ctx.drawImage.bind(this.ctx, videoCanvas, sx, sy, 1, sHeight, 0, 0, sWidth, sHeight);
			this.take = this.ctx.drawImage.bind(this.ctx, videoCanvas, sx, sy, 1, sHeight, doShiftRight ? 0 : sWidth - 1, 0, 1, sHeight);
			
			this.giveEdge = glowCtx.drawImage.bind(glowCtx, this.canvas, 0, 0, sWidth, sHeight, dx, dy, dWidth, dHeight);
			
			if (dy === 0) {
				this.hasCorners = false;
				
				return;
			}
			
			this.hasCorners = true;
			
			const giveCorner0 = glowCtx.drawImage.bind(glowCtx, this.canvas, 0, 0, sWidth, 1, dx, 0, dWidth, dy);
			const giveCorner1 = glowCtx.drawImage.bind(glowCtx, this.canvas, 0, sHeight - 1, sWidth, 1, dx, dy + dHeight, dWidth, dy);
			
			this.giveCorners = () => {
				giveCorner0();
				giveCorner1();
			};
		}
	}
	
	class Base extends Sector {
		setDimensions(doShiftDown, sWidth, sHeight, sx, sy, dx, dy, dWidth, dHeight) {
			this.canvas.width = sWidth;
			this.canvas.height = sHeight;
			
			this.shift = this.ctx.drawImage.bind(this.ctx, this.canvas, 0, doShiftDown ? 1 : -1);
			
			this.fill = this.ctx.drawImage.bind(this.ctx, videoCanvas, sx, sy, sWidth, 1, 0, 0, sWidth, sHeight);
			this.take = this.ctx.drawImage.bind(this.ctx, videoCanvas, sx, sy, sWidth, 1, 0, doShiftDown ? 0 : sHeight - 1, sWidth, 1);
			
			this.giveEdge = glowCtx.drawImage.bind(glowCtx, this.canvas, 0, 0, sWidth, sHeight, dx, dy, dWidth, dHeight);
			
			if (dx === 0) {
				this.hasCorners = false;
				
				return;
			}
			
			this.hasCorners = true;
			
			const giveCorner0 = glowCtx.drawImage.bind(glowCtx, this.canvas, 0, 0, 1, sHeight, 0, dy, dx, dHeight);
			const giveCorner1 = glowCtx.drawImage.bind(glowCtx, this.canvas, sWidth - 1, 0, 1, sHeight, dx + dWidth, dy, dx, dHeight);
			
			this.giveCorners = () => {
				giveCorner0();
				giveCorner1();
			};
		}
		
		setClipPath(points) {
			this.clipPath = new Path2D();
			
			this.clipPath.moveTo(...points[0]);
			this.clipPath.lineTo(...points[1]);
			this.clipPath.lineTo(...points[2]);
			this.clipPath.closePath();
		}
		
		update(doFill) {
			glowCtx.save();
			
			glowCtx.clip(this.clipPath);
			
			super.update(doFill);
			
			glowCtx.restore();
		}
	}
	
	const components = {
		left: new Side(),
		right: new Side(),
		top: new Base(),
		bottom: new Base(),
	};
	
	const setComponentDimensions = (sampleCount, size, isInset, doFlip) => {
		const [croppedWidth, croppedHeight] = crop.getDimensions();
		const halfCanvas = {x: Math.ceil(glowCanvas.width / 2), y: Math.ceil(glowCanvas.height / 2)};
		const halfVideo = {x: croppedWidth / 2, y: croppedHeight / 2};
		const dWidth = Math.ceil(Math.min(halfVideo.x, size));
		const dHeight = Math.ceil(Math.min(halfVideo.y, size));
		const [dWidthScale, dHeightScale, sideWidth, sideHeight] = isInset ?
			[0, 0, videoCanvas.width / croppedWidth * glowCanvas.width, videoCanvas.height / croppedHeight * glowCanvas.height] :
			[halfCanvas.x - halfVideo.x, halfCanvas.y - halfVideo.y, croppedWidth, croppedHeight];
		
		components.left.setDimensions(!doFlip, sampleCount, videoCanvas.height, 0, 0, 0, dHeightScale, dWidth, sideHeight);
		
		components.right.setDimensions(doFlip, sampleCount, videoCanvas.height, videoCanvas.width - 1, 0, glowCanvas.width - dWidth, dHeightScale, dWidth, sideHeight);
		
		components.top.setDimensions(!doFlip, videoCanvas.width, sampleCount, 0, 0, dWidthScale, 0, sideWidth, dHeight);
		components.top.setClipPath([[0, 0], [halfCanvas.x, halfCanvas.y], [glowCanvas.width, 0]]);
		
		components.bottom.setDimensions(doFlip, videoCanvas.width, sampleCount, 0, videoCanvas.height - 1, dWidthScale, glowCanvas.height - dHeight, sideWidth, dHeight);
		components.bottom.setClipPath([[0, glowCanvas.height], [halfCanvas.x, halfCanvas.y], [glowCanvas.width, glowCanvas.height]]);
	};
	
	class Instance {
		constructor({filter, sampleCount, size, end, doFlip}) {
			// Setup canvases
			
			glowCanvas.style.setProperty('filter', filter);
			
			[glowCanvas.width, glowCanvas.height] = crop.getDimensions().map((dimension) => dimension * end);
			
			glowCanvas.style.setProperty('left', `${crop.left * 100 + (1 - end) * (1 - crop.left - crop.right) * 50}%`);
			glowCanvas.style.setProperty('top', `${crop.top * 100 + (1 - end) * (1 - crop.top - crop.bottom) * 50}%`);
			
			[videoCanvas.width, videoCanvas.height] = crop.getDimensions(video.videoWidth, video.videoHeight);
			
			setComponentDimensions(sampleCount, size, end <= 1, doFlip);
			
			this.update(true);
		}
		
		update(doFill = false) {
			videoCtx.drawImage(
				video,
				crop.left * video.videoWidth,
				crop.top * video.videoHeight,
				video.videoWidth * (1 - crop.left - crop.right),
				video.videoHeight * (1 - crop.top - crop.bottom),
				0,
				0,
				videoCanvas.width,
				videoCanvas.height,
			);
			
			components.left.update(doFill);
			components.right.update(doFill);
			components.top.update(doFill);
			components.bottom.update(doFill);
		}
	}
	
	return new function () {
		const container = document.createElement('div');
		
		container.style.display = 'none';
		
		container.appendChild(glowCanvas);
		containers.background.appendChild(container);
		
		this.isHidden = false;
		
		let instance, startCopyLoop, stopCopyLoop;
		
		const play = () => {
			if (!video.paused && !this.isHidden && !enabler.isHidingGlow) {
				startCopyLoop?.();
			}
		};
		
		const fill = () => {
			if (!this.isHidden) {
				instance.update(true);
			}
		};
		
		const handleVisibilityChange = () => {
			if (document.hidden) {
				stopCopyLoop();
			} else {
				play();
			}
		};
		
		this.handleSizeChange = () => {
			const config = $config.get().glow;
			
			if (config) {
				instance = new Instance(config);
			}
		};
		
		// set up pausing if glow isn't visible
		this.handleViewChange = (() => {
			const cache = new Cache(rotation, zoom);
			
			let corners;
			
			return (doForce = false) => {
				if (doForce || cache.isStale()) {
					const width = halfDimensions.viewport.width / zoom.value;
					const height = halfDimensions.viewport.height / zoom.value;
					const radius = Math.sqrt(width * width + height * height);
					
					corners = getRotatedCorners(radius, viewportTheta);
				}
				
				const videoX = position.x * video.clientWidth;
				const videoY = position.y * video.clientHeight;
				
				for (const corner of corners) {
					if (
						// unpause if the viewport extends more than 1 pixel beyond a video edge
						videoX + corner.x > (0.5 - crop.right) * video.clientWidth + 1
						|| videoX - corner.x < (crop.left - 0.5) * video.clientWidth - 1
						|| videoY + corner.y > (0.5 - crop.top) * video.clientHeight + 1
						|| videoY - corner.y < (crop.bottom - 0.5) * video.clientHeight - 1
					) {
						// fill if newly visible
						if (this.isHidden) {
							instance?.update(true);
						}
						
						this.isHidden = false;
						
						glowCanvas.style.removeProperty('visibility');
						
						play();
						
						return;
					}
				}
				
				this.isHidden = true;
				
				glowCanvas.style.visibility = 'hidden';
				
				stopCopyLoop?.();
			};
		})();
		
		const loop = {};
		
		this.start = () => {
			const config = $config.get().glow;
			
			if (!config) {
				return;
			}
			
			if (!enabler.isHidingGlow) {
				container.style.removeProperty('display');
			}
			
			// todo handle this?
			if (crop.left + crop.right >= 1 || crop.top + crop.bottom >= 1) {
				return;
			}
			
			let loopId = -1;
			
			if (loop.interval !== config.interval || loop.fps !== config.fps) {
				loop.interval = config.interval;
				loop.fps = config.fps;
				loop.wasSlow = false;
				loop.throttleCount = 0;
			}
			
			stopCopyLoop = () => ++loopId;
			
			instance = new Instance(config);
			
			startCopyLoop = async () => {
				const id = ++loopId;
				
				await new Promise((resolve) => {
					window.setTimeout(resolve, config.interval);
				});
				
				while (id === loopId) {
					const startTime = Date.now();
					
					instance.update();
					
					const delay = loop.interval - (Date.now() - startTime);
					
					if (delay <= 0) {
						if (loop.wasSlow) {
							loop.interval = 1000 / (loop.fps - ++loop.throttleCount);
						}
						
						loop.wasSlow = !loop.wasSlow;
						
						continue;
					}
					
					if (delay > 2 && loop.throttleCount > 0) {
						console.warn(`[${GM.info.script.name}] Glow update frequency reduced from ${loop.fps} hertz to ${loop.fps - loop.throttleCount} hertz due to poor performance.`);
						
						loop.fps -= loop.throttleCount;
						
						loop.throttleCount = 0;
					}
					
					loop.wasSlow = false;
					
					await new Promise((resolve) => {
						window.setTimeout(resolve, delay);
					});
				}
			};
			
			play();
			
			video.addEventListener('pause', stopCopyLoop);
			video.addEventListener('play', play);
			video.addEventListener('seeked', fill);
			
			document.addEventListener('visibilitychange', handleVisibilityChange);
		};
		
		const priorCrop = {};
		
		this.hide = () => {
			Object.assign(priorCrop, crop);
			
			stopCopyLoop?.();
			
			container.style.display = 'none';
		};
		
		this.show = () => {
			if (Object.entries(priorCrop).some(([edge, value]) => crop[edge] !== value)) {
				this.reset();
			} else {
				play();
			}
			
			container.style.removeProperty('display');
		};
		
		this.stop = () => {
			this.hide();
			
			video.removeEventListener('pause', stopCopyLoop);
			video.removeEventListener('play', play);
			video.removeEventListener('seeked', fill);
			
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			
			startCopyLoop = undefined;
			stopCopyLoop = undefined;
		};
		
		this.reset = () => {
			this.stop();
			
			this.start();
		};
	}();
})();

const peek = (stop = false) => {
	const prior = {
		zoom: zoom.value,
		rotation: rotation.value,
		crop: crop.getValues(),
		position: position.getValues(),
	};
	
	position.reset();
	rotation.reset();
	zoom.reset();
	crop.reset();
	
	glow[stop ? 'stop' : 'reset']();
	
	return () => {
		zoom.value = prior.zoom;
		rotation.value = prior.rotation;
		Object.assign(position, prior.position);
		Object.assign(crop, prior.crop);
		
		actions.crop.set(prior.crop);
		
		position.apply();
		rotation.apply();
		zoom.apply();
		crop.apply();
	};
};

const actions = (() => {
	const drag = (event, clickCallback, moveCallback, target = video) => new Promise((resolve) => {
		event.stopImmediatePropagation();
		event.preventDefault();
		
		// window blur events don't fire if devtools is open
		stopDrag?.();
		
		target.setPointerCapture(event.pointerId);
		
		css.tag(enabler.CLASS_DRAGGING);
		
		const cancel = (event) => {
			event.stopImmediatePropagation();
			event.preventDefault();
		};
		
		document.addEventListener('click', cancel, true);
		document.addEventListener('dblclick', cancel, true);
		
		const clickDisallowListener = ({clientX, clientY}) => {
			const {clickCutoff} = $config.get();
			const distance = Math.abs(event.clientX - clientX) + Math.abs(event.clientY - clientY);
			
			if (distance >= clickCutoff) {
				target.removeEventListener('pointermove', clickDisallowListener);
				target.removeEventListener('pointerup', clickCallback);
			}
		};
		
		if (clickCallback) {
			target.addEventListener('pointermove', clickDisallowListener);
			target.addEventListener('pointerup', clickCallback, {once: true});
		}
		
		target.addEventListener('pointermove', moveCallback);
		
		stopDrag = () => {
			css.tag(enabler.CLASS_DRAGGING, false);
			
			target.removeEventListener('pointermove', moveCallback);
			
			if (clickCallback) {
				target.removeEventListener('pointermove', clickDisallowListener);
				target.removeEventListener('pointerup', clickCallback);
			}
			
			// delay removing listeners for events that happen after pointerup
			window.setTimeout(() => {
				document.removeEventListener('dblclick', cancel, true);
				document.removeEventListener('click', cancel, true);
			}, 0);
			
			window.removeEventListener('blur', stopDrag);
			target.removeEventListener('pointerup', stopDrag);
			
			target.releasePointerCapture(event.pointerId);
			
			stopDrag = undefined;
			
			enabler.handleChange();
			
			resolve();
		};
		
		window.addEventListener('blur', stopDrag);
		target.addEventListener('pointerup', stopDrag);
	});
	
	const getOnScroll = (() => {
		// https://stackoverflow.com/a/30134826
		const multipliers = [1, 40, 800];
		
		return (callback) => (event) => {
			event.stopImmediatePropagation();
			event.preventDefault();
			
			if (event.deltaY !== 0) {
				callback(event.deltaY * multipliers[event.deltaMode]);
			}
		};
	})();
	
	const addListeners = ({onMouseDown, onRightClick, onScroll}, doAdd = true) => {
		const property = `${doAdd ? 'add' : 'remove'}EventListener`;
		
		altTarget[property]('pointerdown', onMouseDown);
		altTarget[property]('contextmenu', onRightClick, true);
		altTarget[property]('wheel', onScroll, true);
	};
	
	return {
		crop: new function () {
			let top = 0, right = 0, bottom = 0, left = 0, handle;
			
			const values = {};
			
			Object.defineProperty(values, 'top', {get: () => top, set: (value) => top = value});
			Object.defineProperty(values, 'right', {get: () => right, set: (value) => right = value});
			Object.defineProperty(values, 'bottom', {get: () => bottom, set: (value) => bottom = value});
			Object.defineProperty(values, 'left', {get: () => left, set: (value) => left = value});
			
			class Button {
				// allowance for rounding errors
				static ALLOWANCE_HANDLE = 0.0001;
				
				static CLASS_HANDLE = 'viewfind-crop-handle';
				static CLASS_EDGES = {
					left: 'viewfind-crop-left',
					top: 'viewfind-crop-top',
					right: 'viewfind-crop-right',
					bottom: 'viewfind-crop-bottom',
				};
				
				static OPPOSITES = {
					left: 'right',
					right: 'left',
					
					top: 'bottom',
					bottom: 'top',
				};
				
				callbacks = [];
				
				element = document.createElement('div');
				
				constructor(...edges) {
					this.edges = edges;
					
					this.isHandle = true;
					
					this.element.style.position = 'absolute';
					this.element.style.pointerEvents = 'all';
					
					for (const edge of edges) {
						this.element.style[edge] = '0';
						
						this.element.classList.add(Button.CLASS_EDGES[edge]);
						
						this.element.style.setProperty(`border-${Button.OPPOSITES[edge]}-width`, '1px');
					}
					
					this.element.addEventListener('contextmenu', (event) => {
						event.stopPropagation();
						event.preventDefault();
						
						this.reset(false);
					});
					
					this.element.addEventListener('pointerdown', (() => {
						const clickListener = ({offsetX, offsetY, target}) => {
							this.set({
								width: (this.edges.includes('left') ? offsetX : target.clientWidth - offsetX) / video.clientWidth,
								height: (this.edges.includes('top') ? offsetY : target.clientHeight - offsetY) / video.clientHeight,
							}, false);
						};
						
						const getDragListener = (event, target) => {
							const getWidth = (() => {
								if (this.edges.includes('left')) {
									const position = this.element.clientWidth - event.offsetX;
									
									return ({offsetX}) => offsetX + position;
								}
								
								const position = target.offsetWidth + event.offsetX;
								
								return ({offsetX}) => position - offsetX;
							})();
							
							const getHeight = (() => {
								if (this.edges.includes('top')) {
									const position = this.element.clientHeight - event.offsetY;
									
									return ({offsetY}) => offsetY + position;
								}
								
								const position = target.offsetHeight + event.offsetY;
								
								return ({offsetY}) => position - offsetY;
							})();
							
							return (event) => {
								this.set({
									width: getWidth(event) / video.clientWidth,
									height: getHeight(event) / video.clientHeight,
								});
							};
						};
						
						return async (event) => {
							if (event.buttons === 1) {
								const target = this.element.parentElement;
								
								if (this.isHandle) {
									this.setPanel();
								}
								
								await drag(event, clickListener, getDragListener(event, target), target);
								
								this.updateCounterpart();
							}
						};
					})());
				}
				
				notify() {
					for (const callback of this.callbacks) {
						callback();
					}
				}
				
				set isHandle(value) {
					this._isHandle = value;
					
					this.element.classList[value ? 'add' : 'remove'](Button.CLASS_HANDLE);
				}
				
				get isHandle() {
					return this._isHandle;
				}
				
				reset() {
					this.isHandle = true;
					
					for (const edge of this.edges) {
						values[edge] = 0;
					}
				}
			}
			
			class EdgeButton extends Button {
				constructor(edge) {
					super(edge);
					
					this.edge = edge;
				}
				
				updateCounterpart() {
					if (this.counterpart.isHandle) {
						this.counterpart.setHandle();
					}
				}
				
				setCrop(value = 0) {
					values[this.edge] = value;
				}
				
				setPanel() {
					this.isHandle = false;
					
					this.setCrop(handle);
					
					this.setHandle();
				}
			}
			
			class SideButton extends EdgeButton {
				flow() {
					let size = 1;
					
					if (top <= Button.ALLOWANCE_HANDLE) {
						size -= handle;
						
						this.element.style.top = `${handle * 100}%`;
					} else {
						size -= top;
						
						this.element.style.top = `${top * 100}%`;
					}
					
					if (bottom <= Button.ALLOWANCE_HANDLE) {
						size -= handle;
					} else {
						size -= bottom;
					}
					
					this.element.style.height = `${Math.max(0, size * 100)}%`;
				}
				
				setBounds(counterpart, components) {
					this.counterpart = components[counterpart];
					
					components.top.callbacks.push(() => {
						this.flow();
					});
					
					components.bottom.callbacks.push(() => {
						this.flow();
					});
				}
				
				setHandle(doNotify = true) {
					this.element.style.width = `${Math.min(1 - values[this.counterpart.edge], handle) * 100}%`;
					
					if (doNotify) {
						this.notify();
					}
				}
				
				set({width}, doUpdateCounterpart = true) {
					if (this.isHandle !== (this.isHandle = width <= Button.ALLOWANCE_HANDLE)) {
						this.flow();
					}
					
					if (doUpdateCounterpart) {
						this.updateCounterpart();
					}
					
					if (this.isHandle) {
						this.setCrop();
						
						this.setHandle();
						
						return;
					}
					
					const size = Math.min(1 - values[this.counterpart.edge], width);
					
					this.setCrop(size);
					
					this.element.style.width = `${size * 100}%`;
					
					this.notify();
				}
				
				reset(isGeneral = true) {
					super.reset();
					
					if (isGeneral) {
						this.element.style.top = `${handle * 100}%`;
						this.element.style.height = `${(0.5 - handle) * 200}%`;
						this.element.style.width = `${handle * 100}%`;
						
						return;
					}
					
					this.flow();
					
					this.setHandle();
					
					this.updateCounterpart();
				}
			}
			
			class BaseButton extends EdgeButton {
				flow() {
					let size = 1;
					
					if (left <= Button.ALLOWANCE_HANDLE) {
						size -= handle;
						
						this.element.style.left = `${handle * 100}%`;
					} else {
						size -= left;
						
						this.element.style.left = `${left * 100}%`;
					}
					
					if (right <= Button.ALLOWANCE_HANDLE) {
						size -= handle;
					} else {
						size -= right;
					}
					
					this.element.style.width = `${Math.max(0, size) * 100}%`;
				}
				
				setBounds(counterpart, components) {
					this.counterpart = components[counterpart];
					
					components.left.callbacks.push(() => {
						this.flow();
					});
					
					components.right.callbacks.push(() => {
						this.flow();
					});
				}
				
				setHandle(doNotify = true) {
					this.element.style.height = `${Math.min(1 - values[this.counterpart.edge], handle) * 100}%`;
					
					if (doNotify) {
						this.notify();
					}
				}
				
				set({height}, doUpdateCounterpart = false) {
					if (this.isHandle !== (this.isHandle = height <= Button.ALLOWANCE_HANDLE)) {
						this.flow();
					}
					
					if (doUpdateCounterpart) {
						this.updateCounterpart();
					}
					
					if (this.isHandle) {
						this.setCrop();
						
						this.setHandle();
						
						return;
					}
					
					const size = Math.min(1 - values[this.counterpart.edge], height);
					
					this.setCrop(size);
					
					this.element.style.height = `${size * 100}%`;
					
					this.notify();
				}
				
				reset(isGeneral = true) {
					super.reset();
					
					if (isGeneral) {
						this.element.style.left = `${handle * 100}%`;
						this.element.style.width = `${(0.5 - handle) * 200}%`;
						this.element.style.height = `${handle * 100}%`;
						
						return;
					}
					
					this.flow();
					
					this.setHandle();
					
					this.updateCounterpart();
				}
			}
			
			class CornerButton extends Button {
				static CLASS_NAME = 'viewfind-crop-corner';
				
				constructor(sectors, ...edges) {
					super(...edges);
					
					this.element.classList.add(CornerButton.CLASS_NAME);
					
					this.sectors = sectors;
					
					for (const sector of sectors) {
						sector.callbacks.push(this.flow.bind(this));
					}
				}
				
				flow() {
					let isHandle = true;
					
					if (this.sectors[0].isHandle) {
						this.element.style.width = `${Math.min(1 - values[this.sectors[0].counterpart.edge], handle) * 100}%`;
					} else {
						this.element.style.width = `${values[this.edges[0]] * 100}%`;
						
						isHandle = false;
					}
					
					if (this.sectors[1].isHandle) {
						this.element.style.height = `${Math.min(1 - values[this.sectors[1].counterpart.edge], handle) * 100}%`;
					} else {
						this.element.style.height = `${values[this.edges[1]] * 100}%`;
						
						isHandle = false;
					}
					
					this.isHandle = isHandle;
				}
				
				updateCounterpart() {
					for (const sector of this.sectors) {
						sector.updateCounterpart();
					}
				}
				
				set(size) {
					for (const sector of this.sectors) {
						sector.set(size);
					}
				}
				
				reset(isGeneral = true) {
					this.isHandle = true;
					
					this.element.style.width = `${handle * 100}%`;
					this.element.style.height = `${handle * 100}%`;
					
					if (isGeneral) {
						return;
					}
					
					for (const sector of this.sectors) {
						sector.reset(false);
					}
				}
				
				setPanel() {
					for (const sector of this.sectors) {
						sector.setPanel();
					}
				}
			}
			
			this.CODE = 'crop';
			
			this.CLASS_ABLE = 'viewfind-action-able-crop';
			
			const container = document.createElement('div');
			
			// todo ditch the containers object
			container.style.width = container.style.height = 'inherit';
			
			containers.foreground.append(container);
			
			this.reset = () => {
				for (const component of Object.values(this.components)) {
					component.reset(true);
				}
			};
			
			this.onRightClick = (event) => {
				if (event.target.parentElement.id === container.id) {
					return;
				}
				
				event.stopPropagation();
				event.preventDefault();
				
				if (stopDrag) {
					return;
				}
				
				this.reset();
			};
			
			this.onScroll = getOnScroll((distance) => {
				const increment = distance * $config.get().speeds.crop / zoom.value;
				
				this.components.top.set({height: top + Math.min((1 - top - bottom) / 2, increment)});
				this.components.left.set({width: left + Math.min((1 - left - right) / 2, increment)});
				
				this.components.bottom.set({height: bottom + increment});
				this.components.right.set({width: right + increment});
			});
			
			this.onMouseDown = (() => {
				const getDragListener = () => {
					const multiplier = $config.get().multipliers.crop;
					
					const setX = ((right, left, change) => {
						const clamped = Math.max(-left, Math.min(right, change * multiplier / video.clientWidth));
						
						this.components.left.set({width: left + clamped});
						this.components.right.set({width: right - clamped});
					}).bind(undefined, right, left);
					
					const setY = ((top, bottom, change) => {
						const clamped = Math.max(-top, Math.min(bottom, change * multiplier / video.clientHeight));
						
						this.components.top.set({height: top + clamped});
						
						this.components.bottom.set({height: bottom - clamped});
					}).bind(undefined, top, bottom);
					
					let priorEvent;
					
					return ({offsetX, offsetY}) => {
						if (!priorEvent) {
							priorEvent = {offsetX, offsetY};
							
							return;
						}
						
						setX(offsetX - priorEvent.offsetX);
						setY(offsetY - priorEvent.offsetY);
					};
				};
				
				const clickListener = () => {
					zoom.value = zoom.getFit((1 - left - right) * halfDimensions.video.width, (1 - top - bottom) * halfDimensions.video.height);
					
					zoom.constrain();
					
					position.x = (left - right) / 2;
					position.y = (bottom - top) / 2;
					
					position.constrain();
				};
				
				return (event) => {
					if (event.buttons === 1) {
						drag(event, clickListener, getDragListener(), container);
					}
				};
			})();
			
			this.components = {
				top: new BaseButton('top'),
				right: new SideButton('right'),
				bottom: new BaseButton('bottom'),
				left: new SideButton('left'),
			};
			
			this.components.top.setBounds('bottom', this.components);
			this.components.right.setBounds('left', this.components);
			this.components.bottom.setBounds('top', this.components);
			this.components.left.setBounds('right', this.components);
			
			this.components.topLeft = new CornerButton([this.components.left, this.components.top], 'left', 'top');
			this.components.topRight = new CornerButton([this.components.right, this.components.top], 'right', 'top');
			this.components.bottomLeft = new CornerButton([this.components.left, this.components.bottom], 'left', 'bottom');
			this.components.bottomRight = new CornerButton([this.components.right, this.components.bottom], 'right', 'bottom');
			
			container.append(...Object.values(this.components).map(({element}) => element));
			
			this.set = ({top, right, bottom, left}) => {
				this.components.top.set({height: top});
				this.components.right.set({width: right});
				this.components.bottom.set({height: bottom});
				this.components.left.set({width: left});
			};
			
			this.onInactive = () => {
				addListeners(this, false);
				
				if (crop.left === left && crop.top === top && crop.right === right && crop.bottom === bottom) {
					return;
				}
				
				crop.left = left;
				crop.top = top;
				crop.right = right;
				crop.bottom = bottom;
				
				crop.apply();
			};
			
			this.onActive = () => {
				const config = $config.get().crop;
				
				handle = config.handle / Math.max(zoom.value, 1);
				
				for (const component of [this.components.top, this.components.bottom, this.components.left, this.components.right]) {
					if (component.isHandle) {
						component.setHandle();
					}
				}
				
				crop.reveal();
				
				addListeners(this);
				
				if (!enabler.isHidingGlow) {
					glow.handleViewChange();
					
					glow.reset();
				}
			};
			
			const draggingSelector = css.getSelector(enabler.CLASS_DRAGGING);
			
			this.updateConfig = (() => {
				const rule = new css.Toggleable();
				
				return () => {
					// set handle size
					for (const button of [this.components.left, this.components.top, this.components.right, this.components.bottom]) {
						if (button.isHandle) {
							button.setHandle();
						}
					}
					
					rule.remove();
					
					const {colour} = $config.get().crop;
					const {id} = container;
					
					rule.add(`#${id}>:hover.${Button.CLASS_HANDLE},#${id}>:not(.${Button.CLASS_HANDLE})`, ['background-color', colour.fill]);
					rule.add(`#${id}>*`, ['border-color', colour.border]);
					rule.add(`#${id}:not(${draggingSelector} *)>:not(:hover)`, ['filter', `drop-shadow(${colour.shadow} 0 0 1px)`]);
				};
			})();
			
			container.id = 'viewfind-crop-container';
			
			(() => {
				const {id} = container;
				
				css.add(`${css.getSelector(enabler.CLASS_DRAGGING)} #${id}`, ['cursor', 'grabbing']);
				css.add(`${css.getSelector(enabler.CLASS_ABLE)} #${id}`, ['cursor', 'grab']);
				css.add(`#${id}>:not(${draggingSelector} .${Button.CLASS_HANDLE})`, ['border-style', 'solid']);
				css.add(`${draggingSelector} #${id}>.${Button.CLASS_HANDLE}`, ['filter', 'none']);
				
				for (const [side, sideClass] of Object.entries(Button.CLASS_EDGES)) {
					css.add(
						`${draggingSelector} #${id}>.${sideClass}.${Button.CLASS_HANDLE}~.${sideClass}.${CornerButton.CLASS_NAME}`,
						[`border-${CornerButton.OPPOSITES[side]}-style`, 'none'],
						['filter', 'none'],
					);
					
					// in fullscreen, 16:9 videos get an offsetLeft of 1px on my 16:9 monitor
					// I'm extending buttons by 1px so that they reach the edge of screens like mine at default zoom
					css.add(`#${id}>.${sideClass}`, [`margin-${side}`, '-1px'], [`padding-${side}`, '1px']);
				}
				
				css.add(`#${id}:not(.${this.CLASS_ABLE} *)`, ['display', 'none']);
			})();
		}(),
		
		pan: new function () {
			this.CODE = 'pan';
			
			this.CLASS_ABLE = 'viewfind-action-able-pan';
			
			this.onActive = () => {
				this.updateCrosshair();
				
				addListeners(this);
			};
			
			this.onInactive = () => {
				addListeners(this, false);
			};
			
			this.updateCrosshair = (() => {
				const getRoundedString = (number, decimal = 2) => {
					const raised = `${Math.round(number * Math.pow(10, decimal))}`.padStart(decimal + 1, '0');
					
					return `${raised.substr(0, raised.length - decimal)}.${raised.substr(raised.length - decimal)}`;
				};
				
				const getSigned = (ratio) => {
					const percent = Math.round(ratio * 100);
					
					if (percent <= 0) {
						return `${percent}`;
					}
					
					return `+${percent}`;
				};
				
				return () => {
					crosshair.text.innerText = `${getRoundedString(zoom.value)}×\n${getSigned(position.x)}%\n${getSigned(position.y)}%`;
				};
			})();
			
			this.onScroll = getOnScroll((distance) => {
				const increment = distance * $config.get().speeds.zoom;
				
				if (increment > 0) {
					zoom.value *= 1 + increment;
				} else {
					zoom.value /= 1 - increment;
				}
				
				zoom.constrain();
				
				position.constrain();
				
				this.updateCrosshair();
			});
			
			this.onRightClick = (event) => {
				event.stopImmediatePropagation();
				event.preventDefault();
				
				if (stopDrag) {
					return;
				}
				
				position.x = position.y = 0;
				zoom.value = 1;
				
				position.apply();
				
				position.updateFrameOnReset();
				
				zoom.constrain();
				
				this.updateCrosshair();
			};
			
			this.onMouseDown = (() => {
				const getDragListener = () => {
					const {multipliers} = $config.get();
					
					let priorEvent;
					
					const change = {x: 0, y: 0};
					
					return ({offsetX, offsetY}) => {
						if (priorEvent) {
							change.x = (priorEvent.offsetX + change.x - offsetX) * multipliers.pan;
							change.y = (priorEvent.offsetY - change.y - offsetY) * -multipliers.pan;
							
							position.x += change.x / video.clientWidth;
							position.y += change.y / video.clientHeight;
							
							position.constrain();
							
							this.updateCrosshair();
						}
						
						// events in firefox seem to lose their data after finishing propagation
						// so assigning the whole event doesn't work
						priorEvent = {offsetX, offsetY};
					};
				};
				
				const clickListener = (event) => {
					position.x = event.offsetX / video.clientWidth - 0.5;
					// Y increases moving down the page
					// I flip that to make trigonometry easier
					position.y = -event.offsetY / video.clientHeight + 0.5;
					
					position.constrain(true);
					
					this.updateCrosshair();
				};
				
				return (event) => {
					if (event.buttons === 1) {
						drag(event, clickListener, getDragListener());
					}
				};
			})();
		}(),
		
		rotate: new function () {
			this.CODE = 'rotate';
			
			this.CLASS_ABLE = 'viewfind-action-able-rotate';
			
			this.onActive = () => {
				this.updateCrosshair();
				
				addListeners(this);
			};
			
			this.onInactive = () => {
				addListeners(this, false);
			};
			
			this.updateCrosshair = () => {
				const angle = DEGREES[90] - rotation.value;
				
				crosshair.text.innerText = `${Math.floor((DEGREES[90] - rotation.value) / Math.PI * 180)}°\n≈${Math.round(angle / DEGREES[90]) % 4 * 90}°`;
			};
			
			this.onScroll = getOnScroll((distance) => {
				rotation.value += distance * $config.get().speeds.rotate;
				
				rotation.constrain();
				
				zoom.constrain();
				position.constrain();
				
				this.updateCrosshair();
			});
			
			this.onRightClick = (event) => {
				event.stopImmediatePropagation();
				event.preventDefault();
				
				if (stopDrag) {
					return;
				}
				
				rotation.value = DEGREES[90];
				
				rotation.apply();
				
				zoom.constrain();
				position.constrain();
				
				this.updateCrosshair();
			};
			
			this.onMouseDown = (() => {
				const getDragListener = () => {
					const {multipliers} = $config.get();
					const middleX = containers.tracker.clientWidth / 2;
					const middleY = containers.tracker.clientHeight / 2;
					
					const priorPosition = position.getValues();
					const priorZoom = zoom.value;
					
					let priorMouseTheta;
					
					return (event) => {
						const mouseTheta = getTheta(middleX, middleY, event.offsetX, event.offsetY);
						
						if (priorMouseTheta === undefined) {
							priorMouseTheta = mouseTheta;
							
							return;
						}
						
						position.x = priorPosition.x;
						position.y = priorPosition.y;
						zoom.value = priorZoom;
						
						rotation.value += (priorMouseTheta - mouseTheta) * multipliers.rotate;
						
						rotation.constrain();
						
						zoom.constrain();
						position.constrain();
						
						this.updateCrosshair();
						
						priorMouseTheta = mouseTheta;
					};
				};
				
				const clickListener = () => {
					rotation.value = Math.round(rotation.value / DEGREES[90]) * DEGREES[90];
					
					rotation.constrain();
					
					zoom.constrain();
					position.constrain();
					
					this.updateCrosshair();
				};
				
				return (event) => {
					if (event.buttons === 1) {
						drag(event, clickListener, getDragListener(), containers.tracker);
					}
				};
			})();
		}(),
		
		configure: new function () {
			this.CODE = 'config';
			
			const updateConfigs = () => {
				ConfigCache.id++;
				
				position.updateFrame();
				
				enabler.updateConfig();
				actions.crop.updateConfig();
				crosshair.updateConfig();
			};
			
			this.onActive = async () => {
				await $config.edit();
				
				updateConfigs();
				
				viewport.focus();
				
				glow.reset();
				
				position.constrain();
				zoom.constrain();
			};
		}(),
		
		reset: new function () {
			this.CODE = 'reset';
			
			this.onActive = () => {
				if (this.restore) {
					this.restore();
				} else {
					this.restore = peek();
				}
				
				const {restore} = this;
				
				position.updateFrameOnReset();
				
				this.restore = restore;
			};
		}(),
	};
})();

const crosshair = new function () {
	this.container = document.createElement('div');
	
	this.lines = {
		horizontal: document.createElement('div'),
		vertical: document.createElement('div'),
	};
	
	this.text = document.createElement('div');
	
	const id = 'viewfind-crosshair';
	
	this.container.id = id;
	this.container.classList.add(CLASS_VIEWFINDER);
	
	css.add(`#${id}:not(${css.getSelector(actions.pan.CLASS_ABLE)} *):not(${css.getSelector(actions.rotate.CLASS_ABLE)} *)`, ['display', 'none']);
	
	this.lines.horizontal.style.position = this.lines.vertical.style.position = this.text.style.position = this.container.style.position = 'absolute';
	
	this.lines.horizontal.style.top = '50%';
	this.lines.horizontal.style.width = '100%';
	
	this.lines.vertical.style.left = '50%';
	this.lines.vertical.style.height = '100%';
	
	this.text.style.userSelect = 'none';
	
	this.container.style.top = '0';
	this.container.style.width = '100%';
	this.container.style.height = '100%';
	this.container.style.pointerEvents = 'none';
	
	this.container.append(this.lines.horizontal, this.lines.vertical);
	
	this.clip = () => {
		const {outer, inner, gap} = $config.get().crosshair;
		
		const thickness = Math.max(inner, outer);
		
		const {width, height} = halfDimensions.viewport;
		const halfGap = gap / 2;
		
		const startInner = (thickness - inner) / 2;
		const startOuter = (thickness - outer) / 2;
		
		const endInner = thickness - startInner;
		const endOuter = thickness - startOuter;
		
		this.lines.horizontal.style.clipPath = 'path(\''
			+ `M0 ${startOuter}L${width - halfGap} ${startOuter}L${width - halfGap} ${startInner}L${width + halfGap} ${startInner}L${width + halfGap} ${startOuter}L${viewport.clientWidth} ${startOuter}`
			+ `L${viewport.clientWidth} ${endOuter}L${width + halfGap} ${endOuter}L${width + halfGap} ${endInner}L${width - halfGap} ${endInner}L${width - halfGap} ${endOuter}L0 ${endOuter}`
			+ 'Z\')';
		
		this.lines.vertical.style.clipPath = 'path(\''
			+ `M${startOuter} 0L${startOuter} ${height - halfGap}L${startInner} ${height - halfGap}L${startInner} ${height + halfGap}L${startOuter} ${height + halfGap}L${startOuter} ${viewport.clientHeight}`
			+ `L${endOuter} ${viewport.clientHeight}L${endOuter} ${height + halfGap}L${endInner} ${height + halfGap}L${endInner} ${height - halfGap}L${endOuter} ${height - halfGap}L${endOuter} 0`
			+ 'Z\')';
	};
	
	this.updateConfig = (doClip = true) => {
		const {colour, outer, inner, text} = $config.get().crosshair;
		const thickness = Math.max(inner, outer);
		
		this.container.style.filter = `drop-shadow(${colour.shadow} 0 0 1px)`;
		
		this.lines.horizontal.style.translate = `0 -${thickness / 2}px`;
		this.lines.vertical.style.translate = `-${thickness / 2}px 0`;
		
		this.lines.horizontal.style.height = this.lines.vertical.style.width = `${thickness}px`;
		
		this.lines.horizontal.style.backgroundColor = this.lines.vertical.style.backgroundColor = colour.fill;
		
		if (text) {
			this.text.style.color = colour.fill;
			
			this.text.style.font = text.font;
			this.text.style.left = `${text.position.x}%`;
			this.text.style.top = `${text.position.y}%`;
			this.text.style.transform = `translate(${text.translate.x}%,${text.translate.y}%) translate(${text.offset.x}px,${text.offset.y}px)`;
			this.text.style.textAlign = text.align;
			this.text.style.lineHeight = text.height;
			
			this.container.append(this.text);
		} else {
			this.text.remove();
		}
		
		if (doClip) {
			this.clip();
		}
	};
}();

// ELEMENT CHANGE LISTENERS

const observer = new function () {
	const onResolutionChange = () => {
		glow.handleSizeChange?.();
	};
	
	const styleObserver = new MutationObserver((() => {
		const properties = ['top', 'left', 'width', 'height', 'scale', 'rotate', 'translate', 'transform-origin'];
		
		let priorStyle;
		
		return () => {
			// mousemove events on video with ctrlKey=true trigger this but have no effect
			if (video.style.cssText === priorStyle) {
				return;
			}
			
			priorStyle = video.style.cssText;
			
			for (const property of properties) {
				containers.background.style[property] = video.style[property];
				containers.foreground.style[property] = video.style[property];
				
				// cinematics doesn't exist for embedded vids
				if (cinematics) {
					cinematics.style[property] = video.style[property];
				}
			}
			
			glow.handleViewChange();
		};
	})());
	
	const videoObserver = new FixedResizeObserver(() => {
		handleVideoChange();
		
		glow.handleSizeChange?.();
		
		position.updateFrame();
	});
	
	const viewportObserver = new FixedResizeObserver(() => {
		handleViewportChange();
		
		crosshair.clip();
	});
	
	this.start = () => {
		video.addEventListener('resize', onResolutionChange);
		
		styleObserver.observe(video, {attributes: true, attributeFilter: ['style']});
		videoObserver.observe(video);
		viewportObserver.observe(viewport);
		
		glow.handleViewChange();
	};
	
	this.stop = () => {
		video.removeEventListener('resize', onResolutionChange);
		
		styleObserver.disconnect();
		viewportObserver.disconnect();
		videoObserver.disconnect();
	};
}();

// NAVIGATION LISTENERS

const stop = () => {
	if (stopped) {
		return;
	}
	
	stopped = true;
	
	enabler.stop();
	
	stopDrag?.();
	
	observer.stop();
	
	containers.background.remove();
	containers.foreground.remove();
	containers.tracker.remove();
	crosshair.container.remove();
	
	return peek(true);
};

const start = () => {
	if (!stopped || viewport.classList.contains('ad-showing')) {
		return;
	}
	
	stopped = false;
	
	observer.start();
	
	glow.start();
	
	viewport.append(containers.background, containers.foreground, containers.tracker, crosshair.container);
	
	// User may have a static minimum zoom greater than 1
	zoom.constrain();
	
	enabler.handleChange();
};

// LISTENER ASSIGNMENTS

// load & navigation
(() => {
	const getNode = (node, selector, ...selectors) => new Promise((resolve) => {
		for (const child of node.children) {
			if (child.matches(selector)) {
				resolve(selectors.length === 0 ? child : getNode(child, ...selectors));
				
				return;
			}
		}
		
		new MutationObserver((changes, observer) => {
			for (const {addedNodes} of changes) {
				for (const child of addedNodes) {
					if (child.matches(selector)) {
						resolve(selectors.length === 0 ? child : getNode(child, ...selectors));
						
						observer.disconnect();
						
						return;
					}
				}
			}
		}).observe(node, {childList: true});
	});
	
	const setupConfigFailsafe = (parent) => {
		new MutationObserver((changes) => {
			for (const {addedNodes} of changes) {
				for (const node of addedNodes) {
					if (!node.classList.contains('ytp-contextmenu')) {
						continue;
					}
					
					const container = node.querySelector('.ytp-panel-menu');
					const option = container.lastElementChild.cloneNode(true);
					
					option.children[0].style.visibility = 'hidden';
					option.children[1].innerText = 'Configure Viewfinding';
					
					option.addEventListener('click', ({button}) => {
						if (button === 0) {
							actions.configure.onActive();
						}
					});
					
					container.appendChild(option);
					
					new FixedResizeObserver((_, observer) => {
						if (container.clientWidth === 0) {
							option.remove();
							
							observer.disconnect();
						}
					}).observe(container);
				}
			}
		}).observe(parent, {childList: true});
	};
	
	const init = async () => {
		if (unsafeWindow.ytplayer?.bootstrapPlayerContainer?.childElementCount > 0) {
			// wait for the video to be moved to ytd-app
			await new Promise((resolve) => {
				new MutationObserver((changes, observer) => {
					resolve();
					
					observer.disconnect();
				}).observe(unsafeWindow.ytplayer.bootstrapPlayerContainer, {childList: true});
			});
		}
		
		try {
			await $config.ready;
		} catch (error) {
			if (!$config.reset || !window.confirm(`${error.message}\n\nWould you like to erase your data?`)) {
				console.error(error);
				
				return;
			}
			
			await $config.reset();
		}
		
		if (isEmbed) {
			video = document.body.querySelector(SELECTOR_VIDEO);
		} else {
			const pageManager = await getNode(document.body, 'ytd-app', '#content', 'ytd-page-manager');
			
			const page = pageManager.getCurrentPage() ?? await new Promise((resolve) => {
				new MutationObserver(([{addedNodes: [page]}], observer) => {
					if (page) {
						resolve(page);
						
						observer.disconnect();
					}
				}).observe(pageManager, {childList: true});
			});
			
			await page.playerEl.getPlayerPromise();
			
			video = page.playerEl.querySelector(SELECTOR_VIDEO);
			cinematics = page.querySelector('#cinematics');
			
			// navigation to a new video
			new MutationObserver(() => {
				video.removeEventListener('play', startIfReady);
				
				power.off();
				
				// this callback can occur after metadata loads
				startIfReady();
			}).observe(page, {attributes: true, attributeFilter: ['video-id']});
			
			// navigation to a non-video page
			new MutationObserver(() => {
				if (video.src === '') {
					video.removeEventListener('play', startIfReady);
					
					power.off();
				}
			}).observe(video, {attributes: true, attributeFilter: ['src']});
		}
		
		viewport = video.parentElement.parentElement;
		altTarget = viewport.parentElement;
		
		position.updateFrame();
		
		handleVideoChange();
		handleViewportChange();
		
		enabler.updateConfig();
		actions.crop.updateConfig();
		crosshair.updateConfig();
		
		containers.foreground.style.zIndex = crosshair.container.style.zIndex = video.parentElement.computedStyleMap?.().get('z-index').value ?? 10;
		
		setupConfigFailsafe(document.body);
		setupConfigFailsafe(viewport);
		
		const startIfReady = () => {
			if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
				start();
			}
		};
		
		const power = new function () {
			this.off = () => {
				delete this.wake;
				
				stop();
			};
			
			this.sleep = () => {
				this.wake ??= stop();
			};
		}();
		
		new MutationObserver((() => {
			return () => {
				// video end
				if (viewport.classList.contains('ended-mode')) {
					power.off();
					
					video.addEventListener('play', startIfReady, {once: true});
				// ad start
				} else if (viewport.classList.contains('ad-showing')) {
					power.sleep();
				}
			};
		})()).observe(viewport, {attributes: true, attributeFilter: ['class']});
		
		// glow initialisation requires video dimensions
		startIfReady();
		
		video.addEventListener('loadedmetadata', () => {
			if (viewport.classList.contains('ad-showing')) {
				return;
			}
			
			start();
			
			if (power.wake) {
				power.wake();
				
				delete power.wake;
			}
		});
	};
	
	if (!('ytPageType' in unsafeWindow) || unsafeWindow.ytPageType === 'watch') {
		init();
		
		return;
	}
	
	const initListener = ({detail: {newPageType}}) => {
		if (newPageType === 'ytd-watch-flexy') {
			init();
			
			document.body.removeEventListener('yt-page-type-changed', initListener);
		}
	};
	
	document.body.addEventListener('yt-page-type-changed', initListener);
})();

// keyboard state change

document.addEventListener('keydown', ({code}) => {
	if (enabler.toggled) {
		enabler.keys[enabler.keys.has(code) ? 'delete' : 'add'](code);
		
		enabler.handleChange();
	} else if (!enabler.keys.has(code)) {
		enabler.keys.add(code);
		
		enabler.handleChange();
	}
});

document.addEventListener('keyup', ({code}) => {
	if (enabler.toggled) {
		return;
	}
	
	if (enabler.keys.has(code)) {
		enabler.keys.delete(code);
		
		enabler.handleChange();
	}
});

window.addEventListener('blur', () => {
	if (enabler.toggled) {
		stopDrag?.();
	} else {
		enabler.keys.clear();
		
		enabler.handleChange();
	}
});
})();
