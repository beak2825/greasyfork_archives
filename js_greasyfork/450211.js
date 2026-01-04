/* eslint-disable no-multi-spaces */
/* eslint-disable no-implicit-globals */
/* eslint-disable userscripts/no-invalid-headers */
/* eslint-disable userscripts/no-invalid-grant */

// ==UserScript==
// @name               beautifier
// @displayname        页面美化
// @namespace          Wenku8++
// @version            0.3.1
// @description        自定义页面背景图，布局优化
// @author             PY-DNG
// @license            GPL-v3
// @regurl             https?://www\.wenku8\.net/.*
// @require            https://greasyfork.org/scripts/449412-basic-functions/code/Basic%20Functions.js?version=1085783
// @require            https://greasyfork.org/scripts/449583-configmanager/code/ConfigManager.js?version=1085902
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_listValues
// @grant              GM_deleteValue
// ==/UserScript==

(function __MAIN__() {
	const ASSETS = require('assets');
	const alertify = require('alertify');
	const settings = require('settings');
	const SettingPanel = require('SettingPanel');

	const CONST = {
		Text: {
			CommonBeautify: '通用页面美化',
			NovelBeautify: '阅读页面美化',
			ReviewBeautify: '书评页面美化',
			DefaultBeautify: '默认页面美化图片',
			Enable: '启用',
			BackgroundImage: '背景图片',
			AlertTitle: '页面美化设置',
			InvalidImageUrl: '图片链接格式错误</br>仅仅接受http/https/data链接',
			textScale: '文字大小缩放'
		},
		ClassName: {
			BgImage: 'plus_cbty_image',
			BgCover: 'plus_cbty_cover',
			CSS: 'plus_beautifier'
		},
		CSS: {
			Common: '.plus_cbty_image {position: fixed;top: 0;left: 0;z-index: -2;}.plus_cbty_cover {position: fixed;top: 0;left: calc((100vw - 960px) / 2);z-Index: -1;background-color: rgba(255,255,255,0.7);width: 960px;height: 100vh;}body {overflow: auto;}body>.main {position: relative;margin-left: 0;margin-right: 0;left: calc((100vw - 960px) / 2);}body.plus_cbty table.grid td, body.plus_cbty .odd, body.plus_cbty .even, body.plus_cbty .blockcontent {background-color: rgba(255,255,255,0) !important;}.textarea, .text {background-color: rgba(255,255,255,0.9);}#headlink{background-color: rgba(255,255,255,0.7);}',
			Novel: 'html{background-image: url({BGI});}body {width: 100vw;height: 100vh;overflow: overlay;margin: 0px;background-color: rgba(255,255,255,0.7);}#contentmain {overflow-y: auto;height: calc(100vh - {H});max-width: 100%;min-width: 0px;max-width: 100vw;}#adv1, #adtop, #headlink, #footlink, #adbottom {overflow: overlay;min-width: 0px;max-width: 100vw;}#adv900, #adv5 {max-width: 100vw;}',
			Review: 'body {overflow: auto;background-image: url({BGI});}#content > table > tbody > tr > td, tr td.odd, tr td.even {background-color: rgba(255,255,255,0.7) !important;overflow: auto;}body.plus_cbty #content > table > tbody > tr > td {background-color: rgba(255,255,255,0) !important;overflow: auto;}#content {height: 100vh;overflow: auto;}.m_top, .m_head, .main.nav, .m_foot {display: none;}.main {margin-top: 0px;}#content table div[style*="width:100%"], #content table div[style*="width:60%"] strong{font-size: calc(1em * {S}/ 100);line-height: calc(120% * {S}/ 100);}.jieqiQuote, .jieqiCode, .jieqiNote {font-size: inherit;}'
		},
		Config_Ruleset: {
			'version-key': 'config-version',
			'ignores': ["LOCAL-CDN"],
			'defaultValues': {
				//'config-key': {},
				common: {
					enable: false,
					image: null
				},
				novel: {
					enable: false,
					image: null
				},
				review: {
					enable: false,
					image: null,
					textScale: 100
				},
				image: null
			},
			'updaters': {
				/*'config-key': [
					function() {
						// This function contains updater for config['config-key'] from v0 to v1
					},
					function() {
						// This function contains updater for config['config-key'] from v1 to v2
					}
				]*/
			}
		}
	};

	// Config
	const CM = new ConfigManager(CONST.Config_Ruleset);
	const CONFIG = CM.Config;
	CM.setDefaults();

	// Settings
	settings.registerSettings(MODULE_IDENTIFIER, setter);

	// Beautifier pages
	const API = getAPI();
	if (API[0] === 'novel' && [...API].pop() !== 'index.htm') {
		CONFIG.novel.enable && novel();
	} else if (API.join('/') === 'modules/article/reviewshow.php') {
		CONFIG.review.enable && review();
	} else {
		CONFIG.common.enable && common();
	}

	exports = {
		//
	};

    // Beautifier for all wenku pages
	function common() {
		const src = CONFIG.common.image || CONFIG.image;

		const img = $CrE('img');
		img.src = src;
		img.classList.add(CONST.ClassName.BgImage);
		document.body.appendChild(img);

		const cover = $CrE('div');
		cover.classList.add(CONST.ClassName.BgCover);
		document.body.appendChild(cover);

		document.body.classList.add('plus_cbty');
		addStyle(CONST.CSS.Common, CONST.ClassName.CSS);
		return true;
	}

	// Novel reading page
	function novel() {
		const src = CONFIG.novel.image || CONFIG.image;
		const usedHeight = getRestHeight();

		addStyle(CONST.CSS.Novel
				 .replaceAll('{BGI}', src)
				 .replaceAll('{H}', usedHeight), CONST.ClassName.CSS
				);

		unsafeWindow.scrolling = beautiful_scrolling;

		// Get rest height without #contentmain
		function getRestHeight() {
			let usedHeight = 0;
			['adv1', 'adtop', 'headlink', 'footlink', 'adbottom'].forEach((id) => {
				const node = $('#'+id);
				if (node instanceof Element && node.id !== 'contentmain') {
					const cs = getComputedStyle(node);
					['height', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'borderTop', 'borderBottom'].forEach((style) => {
						const reg = cs[style].match(/([\.\d]+)px/);
						reg && (usedHeight += Number(reg[1]));
					});
				};
			});
			usedHeight = usedHeight.toString() + 'px';
			return usedHeight;
		}

		// Mouse dblclick scroll with beautifier applied
		function beautiful_scrolling() {
			var contentmain = pageResource.elements.contentmain;
			var currentpos = contentmain.scrollTop || 0;
			contentmain.scrollTo(0, ++currentpos);
			var nowpos = contentmain.scrollTop || 0;
			if(currentpos != nowpos) unsafeWindow.clearInterval(timer);
		}
	}

	// Review reading page
	function review() {
		const src = CONFIG.review.image || CONFIG.image;
		const textScale = CONFIG.review.textScale;
		const main = $('#content');
		addStyle(CONST.CSS.Review
				 .replaceAll('{BGI}', src)
				 .replaceAll('{S}', textScale.toString())
				 , CONST.ClassName.CSS);
		scaleimgs();
		hookPosition();

		function scaleimgs() {
			const w = main.clientWidth * 0.8 - 3; // td.width = "80%", .even {padding: 3px;}
			Array.from($All('.divimage>img')).forEach((img) => {
				img.width = img.width < w ? img.width : w;
			});
		}

		function hookPosition() {
			if (typeof UBBEditor !== 'object') {
				hookPosition.wait = hookPosition.wait ? hookPosition.wait : 0;
				if (++hookPosition.wait > 50) {return false;}
				hookPosition.wait % 10 === 0 && DoLog('hookPosition: UBBEditor not loaded, waiting...');
				setTimeout(hookPosition, ASSETS.Number.Interval);
				return false;
			}
			UBBEditor.GetPosition = function (obj) {
				var r = new Array();
				r.x = obj.offsetLeft;
				r.y = obj.offsetTop;
				while (obj = obj.offsetParent) {
					if (unsafeWindow.$(obj).getStyle('position') == 'absolute' || unsafeWindow.$(obj).getStyle('position') == 'relative') break;
					r.x += obj.offsetLeft;
					r.y += obj.offsetTop;
				}
				r.x -= main.scrollLeft;
				r.y -= main.scrollTop;
				return r;
			}
		}
	}

	// Settings
	function setter() {
		const storage = {
			GM_getValue: GM_getValue,
			GM_setValue: GM_setValue,
			GM_listValues: GM_listValues,
			GM_deleteValue: GM_deleteValue
		};
		const Panel = SettingPanel.SettingPanel;
		const SetPanel = new Panel({
			buttons: 'saver',
			header: CONST.Text.AlertTitle,
			tables: [{
				rows: [{
					blocks: [{
						isHeader: true,
						colSpan: 2,
						innerText: CONST.Text.CommonBeautify
					}]
				},{
					blocks: [{
						innerText: CONST.Text.Enable
					},{
						options: [{
							path: 'common/enable',
							type: 'boolean'
						}]
					}]
				},{
					blocks: [{
						innerText: CONST.Text.BackgroundImage
					},{
						options: [{
							path: 'common/image',
							type: ['image', 'string'],
							checker: imageUrlChecker,
						}]
					}]
				}]
			},{
				rows: [{
					blocks: [{
						isHeader: true,
						colSpan: 2,
						innerText: CONST.Text.NovelBeautify
					}]
				},{
					blocks: [{
						innerText: CONST.Text.Enable
					},{
						options: [{
							path: 'novel/enable',
							type: 'boolean'
						}]
					}]
				},{
					blocks: [{
						innerText: CONST.Text.BackgroundImage
					},{
						options: [{
							path: 'novel/image',
							type: ['image', 'string'],
							checker: imageUrlChecker,
						}]
					}]
				}]
			},{
				rows: [{
					blocks: [{
						isHeader: true,
						colSpan: 2,
						innerText: CONST.Text.ReviewBeautify
					}]
				},{
					blocks: [{
						innerText: CONST.Text.Enable
					},{
						options: [{
							path: 'review/enable',
							type: 'boolean'
						}]
					}]
				},{
					blocks: [{
						innerText: CONST.Text.BackgroundImage
					},{
						options: [{
							path: 'review/image',
							type: ['image', 'string'],
							checker: imageUrlChecker,
						}]
					}]
				},{
					blocks: [{
						innerText: CONST.Text.textScale
					},{
						options: [{
							path: 'review/textScale',
							type: 'number'
						}],
						children: [(() => {
							const span = $CrE('span');
							span.innerText = '%';
							return span;
						}) ()]
					}]
				}]
			},{
				rows: [{
					blocks: [{
						isHeader: true,
						colSpan: 2,
						innerText: CONST.Text.DefaultBeautify
					}]
				},{
					blocks: [{
						innerText: CONST.Text.BackgroundImage
					},{
						options: [{
							path: 'image',
							type: ['image', 'string'],
							checker: imageUrlChecker,
						}]
					}]
				}]
			}]
		}, storage);

		function imageUrlChecker(e, value) {
			if (!value.match(/.+:/)) {
				alertify.alert(CONST.Text.AlertTitle, CONST.Text.InvalidImageUrl);
				return false;
			}
			e.target.value = value || null;
			return true;
		}
	}
})();