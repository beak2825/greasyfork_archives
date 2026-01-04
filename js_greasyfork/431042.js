// ==UserScript==
// @name         【老虎优惠券】京东、淘宝、天猫商品优惠券、淘宝礼金、京东礼金、历史价格、历史优惠金额。
// @description  自动获取京东、淘宝、天猫商品优惠券、历史价格、历史优惠金额。不止让您省钱开心购物，更可以告别虚假降价，以最优惠的价格，把宝贝抱回家。持续维护中...
// @namespace    https://tampermonkey.lhynq.cn
// @version      3.1.9
// @author       上山打老虎
// @match        *://item.taobao.com/*
// @match        *://*.detail.tmall.com/*
// @match        *://*.detail.tmall.hk/*
// @match        *://s.taobao.com/*
// @match        *://list.tmall.com/*
// @match        *://search.jd.com/*
// @match        *://search.jd.hk/*
// @match        *://item.jd.com/*
// @match        *://npcitem.jd.hk/*
// @icon         data:image/ico;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIeIgAXIioAESMvABIjLgATJCwAEBsgAA4WGwAQHCUACgwQKgYEB1INFBl5DhYcmRAaIrAQHye+DyApxw0gKsoMHynHDh4nvg8bIrAOFhycDRQZegYFCFEJDBApDxwlAA4XHQAQHCAAEyQrABIjLQASJC8AFyIqACIeIgAAAAAAIh4iABciKgARIy8AEiMuABMlLQAOFhoUCg0RbQ8aIcQeP07qLGR4/zmDn/87mLv/NKHM/zyt2P9Jt+D/Ubvi/1C54P9Jstv/OaPN/y2Ruf8wfp3/LmR5/x5AT+oOGiHFCw0Raw4XGhMTJSwAEiMtABIkLwAXIioAIh4iAAAAAAAiHiIAFyIqABEjLwASIy4jEB4knhcuN+EydIz/SK3P/1TK9/9Z1f3/TMz8/1DJ+P+h5f7/1Pf//+j+///t/v//7f7//+r////X+///re3//13T//9Kzvr/Vsv4/0itzv8xcYr/Fy024REeJJoTJC0gEiQvABciKgAiHiIAAAAAACIeIgAYIikAECEtCxEfJckSK0f/HUtz/0+/7f9Wz/r/UMDr/0a55/9Vv+j/3vL6///////38/H/+/j3//////////////z7//Xx7/////7/5fT7/2DC6v9Fu+n/V8/6/1DB7/8fTHT/EyxH/xIgJsQSIywIGSEpACIeIgAAAAAAIh4jEiAfIwwOHSVyFS1C/xMyXf8JGkD/OIew/1XM+P9Pvej/Pbfn/6be9P///////////4uLjf9RUFP/fHt9/39+gf9ZWFr/c3J2//v7+///////t+T2/zu25f9WzPf/OYu0/wkZP/8SMV3/FCtA/xAfJWwfHyUKIR4jEwAAAAAiHyMXHRYYbxgxPOZKuN3/I1d//y5vlv9VzvP/Vc32/0+/6v89t+b/t+T2////////////7+/v/93d3f93d3n/Xl1f/9zb3P/r6uv////////////D6Pb/P7jo/1XM9/9Vz/X/L3Ka/yNYf/9Ktdn/GC884BwXGW0iHiMbAAAAACIfHw8RFBl+LV5w/02uyP9Vyu//Vc31/ydghv8rapL/U8Xx/z656P+L1PD//////////////////////////////////////////////////////6Hd9f89vu7/LGqS/yhhiP9Wzvb/Vcvw/02txf8sWWr/ERQadiEeIwgAAAAAIR4gXxMXHc1Hq73/T7ja/1DA5/8YPmT/Cx5D/wseQv9GqNL/Tsby/0286P/m9fv/////////////////trW3/6qqq//////////////////x+f3/W8v0/zyjz/8LHUP/Cx1C/xk/Zv9QwOj/Trfa/0aou/8RFR3AIR4hYAAAAAAcHiQXFyoz1yFBXf8eQGL/UcXo/zeFqv8RKlD/IlR8/1C/6v9Wzvv/Qsj8/3PT9//6/f7///38/4SEhf8IBwr/AgIE/21tb//9+vn///7//4jZ+P9Cy///VMz4/yFUev8QKlD/N4ar/1DE6P8dQmT/IT9Z/xclLdsdHyIhAAAAACAeIE8YJi/lEiI+/wgVOf8ye6T/Wtj//0y34v9Rw+7/VtH+/0aevf86dIz/NajV/5Dt//+foqT/BAAA/xkTF/8dFxr/AAAA/5GQj/+d8P//N67b/zp1kP9Fmbb/VtH3/0244/9a2f//Mnmj/wkVOP8SIj3/FyYv5iAeIU0AAAAAGR4mDBMlL8QtbI3/Hkx0/0Cbxf9TxvL/UcPv/1TN+v9Bj63/HA8R/wcAAP8PFh3/Q7PY/0Kqzv8pQU3/IiQq/yIlK/8oPEb/Pp+9/0TA5f8kKDH/EAAA/wIAAP88fJX/V9b//1PF8P9AmcL/H012/y1ri/8SJC3GGh4mCwAAAAAQIy0ACxQanUamwv9Y1f//UsPw/0+96P9PwOv/VM77/yg8Sf8NAAD/jI6R/3tnY/8mWW//Vtz//1PK+P9Pvuf/Tr7m/1TK+f9V2v//PoOd/woAAP9NUFT/lImG/yQtNf9NxPH/T77q/1HE7/9Y1v//RKG8/wsSGKARJCwAAAAAAAwSFwAJCxBzNXuV/1bQ/v9Pvej/T77p/0++6f9Uzvz/NnGI/wUAAP+onJn/nYyJ/zCEo/9Syvn/T77q/1HE8P9RxfD/UL/q/1LI9P9Jqcv/CgkL/1xSUf+4oZv/MFps/07K9/9Pvej/T73o/1bQ/f8zdpH/CQ0RdwwUGgAAAAAAEiAlAA4WGTsiS13/Vs75/0+/6/9Pvun/T77p/0/A6/9SyfT/OXSL/xoxPf8yfZn/Vc75/0+96P9Pvun/T77p/0++6f9Pvun/Tr3o/1PM+v9Elrf/Ij1M/yNUaP9Qwu3/UcPv/0++6P9PwOv/Vs/4/yFHWP8NFR5BER8rAAAAAAAQHiQADhYcChIgKdVNuuD/Usby/0++6f9Pvun/T73o/0+/6/9V0P3/V9r//1bW//9TyPT/T7/q/0+96P9Pvun/T77p/0+96P9RxvH/U8n0/1fX//9V0vv/Us75/1HC7v9PvOf/T77p/1LF8v9Nud7/EiEr2Q4VIAwQHSgAAAAAABEeKAARHyoADBIYfDR6lf5W0fv/Trzo/0++6f9Pvun/UMDr/0++6f9Bk7z/MmeQ/zJokf9Ou+b/UcLt/0+96P9Pvej/U8n0/zyHsP8uXIT/Poiy/0686P9Rwe3/T73o/0++6f9Ou+f/VtH9/zBuh/8KDBKNEiEtABEgKwAAAAAAEyQuABQlLwAKDRNhFis3/VLG8v9Rwu7/T73o/0+/6v9QwOv/Q5zG/0KXwf9FoMr/P5C6/0665f9QwOv/T73o/0++6P9RxfD/RJvF/z6Ks/8+jLb/PYix/0665f9Qwez/Trvn/1LH8/9Z1///PpOy/w4WHM8QHSYfFSgyAAAAAAASJTAADhUbVhcwOvFJrcz/WNX7/1PK9P9Pven/T77p/0++6f9PwOv/Usfz/1LI8/9TyfT/T77p/1DA6/9TxvH/T77p/0+96P9RxfH/U8n1/1PJ9f9Pv+r/Trrl/0686P9Tyvb/RKLH/0Gbvv9e5f//PIyn/wwRGLMTJC0EAAAAAA8aIxwTJC7nU8jk/1PI5P8iRWH/LWKB/1jU//9Pvun/T77o/0+/6v9Pvun/T73o/0++6f9Qv+r/T7/q/0u03v9Sw+//T73o/0+96P9Pvej/T77p/1DA6/9Pvej/U8bx/1XM8f8aM0j/DRAg/0enzv9d5P//I0xc/QwTGlAAAAAACxAYdjiDnP9Z2PX/FiZB/w0KHv8ODyP/OYSm/1na//9Pv+v/T73o/0++6f9Ovun/VMr1/1zc//8wdZz/BxU6/z6WwP9Y1P3/VMr2/0++6f9Pvun/Tr3n/1PJ8/9W0PP/JUtm/xATKf8RFiz/Gi5G/1jW9/9BnL3/DRUbpQAAAAAQHSW4UMHk/z6QtP8ODyP/FSE4/xAVKf8MCRz/N36f/1fS+v9QwOr/T77o/1HE8P8zfab/OYqw/0Gdxf8LHEP/OIet/0u02P81gKr/UcPu/0+96f9RxPH/Tbje/yNJYv8LBhv/EBQq/xIZLv8PESb/P5S4/1TK7f8SIivWAAAAABQoNNNX0vD/OIGj/w8RJP8cM0z/Jk1p/yJFYP8SHDH/Iklh/1HD8P9W0f3/Usju/w0kSv8EDTL/Qp3H/1XL8f9QwOr/EStR/wcTOv9Pv+b/Wtr//0+96v8XLED/DQ4f/y5khP84fqD/L2eF/wwJHf81d5j/V9Tx/xUoNOAAAAAAFCgz01XO8v9Fosn/CwYZ/yRHZP8+lrf/I0Zi/x88Vf9GqMX/Wdf9/0mt1P9LsdP/PJS//zJ8qP9Rw+z/XNz//1fS/v82hbH/OIq1/0qw0/9CnLv/V9P9/0674P8oVXP/EyMz/yZQbP8iRl//CwYa/0WjyP9RxOj/ER8pzwAAAAARHSa9TLbc/1bS+P8fPVf/BwAO/wwVIv8zdY7/XeP//0271f8jUGT/EBsk0REeJ8IjS1n3L2l9/y9rg/8ua4X/LWd//y1me/8jTl37EiAoxQoNEsUrYXX/WNb4/17l//9DnsP/HjpT/wsKGv8pWXj/XOD//zyOrP8MExqXAAAAAA0VGoU6iaj/Wdb//0qw2/84gqD/U8bp/1jT8P8rYXX/DRUe1AkKDmAMEhoRDRYeCgwSGSYOFRtIDBQaYg0VGmYNFBpjDRYbTgwSFykOFBoLEyMtCwoMEoAZMj/3RKHC/13h//9Z1///S7Db/1PJ9f9X0vj/HD1L+Q4WHD0AAAAADhUZPiNLXPpY1v//WNX//1/m//8+kqz/EiIs9QkLEYESISsLDxohAA0UGwAOFx8AEB4nABMjLQAQHiYAEB0kABEeJgATJSwAER8mAA4VGwAUJjAAEBokAAwSGUAMExnGKVxy/0uz1f9Z2P//Wtz//y5qfv8KDhOaEiUtAQAAAAAPHi0FDhgfvj2Qqv9Gp8f/IERV/wsQFrsLEhgyESEsABIjLgAPGSAADRQbAA4XHwAQHSYAEyIsABAeJgAQHSQAER4mABMkKwARHiUADhUbABQlLwAPGSIAEyIsAA4ZHwkKDhNoEBskzSJMXfYjS1v7DhceshAdJg0TJS4AAAAAABIjMQARISwpDhgguQ0XHbkLEhhaEiMtAA4ZIgAQHykAEiMuAA8ZIAANFBsADhcfABAdJgATIiwAEB4mABAdJAARHiYAEyQrABEeJQAOFRsAFCUvAA8ZIgASISoADxsiAA4YIAAPGSAGBwgMOQcGCz8TIy4FFCgwABQmLwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////gAD//AAAH/AAAAfgAAADgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAMAAAAHAAAABwAAAAcAAAAHgAAAD4AAAAcAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgD/+AID//wHD///D//////////8=
// @require      https://cdn.jsdelivr.net/npm/react@16/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@16/umd/react-dom.production.min.js
// @require      https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/@material-ui/core@4.12.3/umd/material-ui.production.min.js
// @require      https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js
// @require      https://cdn.jsdelivr.net/npm/md5@2.3.0/dist/md5.min.js
// @require      https://cdn.jsdelivr.net/npm/uuid@8.3.2/dist/umd/uuid.min.js
// @antifeature  referral-link 【应GreasyFork代码规范要求：含有优惠券查询功能的脚本必须添加此提示！在此感谢大家的理解...】
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/431042/%E3%80%90%E8%80%81%E8%99%8E%E4%BC%98%E6%83%A0%E5%88%B8%E3%80%91%E4%BA%AC%E4%B8%9C%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E5%95%86%E5%93%81%E4%BC%98%E6%83%A0%E5%88%B8%E3%80%81%E6%B7%98%E5%AE%9D%E7%A4%BC%E9%87%91%E3%80%81%E4%BA%AC%E4%B8%9C%E7%A4%BC%E9%87%91%E3%80%81%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E3%80%81%E5%8E%86%E5%8F%B2%E4%BC%98%E6%83%A0%E9%87%91%E9%A2%9D%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/431042/%E3%80%90%E8%80%81%E8%99%8E%E4%BC%98%E6%83%A0%E5%88%B8%E3%80%91%E4%BA%AC%E4%B8%9C%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E5%95%86%E5%93%81%E4%BC%98%E6%83%A0%E5%88%B8%E3%80%81%E6%B7%98%E5%AE%9D%E7%A4%BC%E9%87%91%E3%80%81%E4%BA%AC%E4%B8%9C%E7%A4%BC%E9%87%91%E3%80%81%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E3%80%81%E5%8E%86%E5%8F%B2%E4%BC%98%E6%83%A0%E9%87%91%E9%A2%9D%E3%80%82.meta.js
// ==/UserScript==
/******/ (() => {
	// webpackBootstrap
	/******/ "use strict";
	/******/ var __webpack_modules__ = {
		/***/ 395: /***/ (module, __webpack_exports__, __webpack_require__) => {
			/* harmony export */ __webpack_require__.d(__webpack_exports__, {
				/* harmony export */ Z: () => __WEBPACK_DEFAULT_EXPORT__,
				/* harmony export */
			});
			/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(613);
			/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default =
				/*#__PURE__*/ __webpack_require__.n(
					_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__
				);
			// Imports

			var ___CSS_LOADER_EXPORT___ =
				_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function (i) {
					return i[1];
				});
			// Module
			___CSS_LOADER_EXPORT___.push([
				module.id,
				".x-lhq-hover-9527{display:inline-block;margin-left:5px}.x-lhq-hover-9527__show{display:none;position:absolute;left:0;right:0;top:30px;background-color:#f4f4f4;z-index:99999999}.x-lhq-hover-9527:hover .x-lhq-hover-9527__show{display:block}.jd-item-9951{display:block;margin:0;background-color:#fff;text-decoration:none;color:#333;overflow:hidden}.jd-item-9951:hover{box-shadow:1px 1px 4px rgba(0,0,0,0.2)}.jd-item-9951__img{text-align:center;display:block;cursor:pointer}.jd-item-9951__img img{border:0}.jd-item-9951__price{display:block;color:#e4393c;margin-top:10px}.jd-item-9951__price i{font-style:normal;font-size:22px;margin:0 3px}.jd-item-9951__price em{font-size:14px;font-weight:400;font-family:Verdana;font-style:normal}.jd-item-9951__price strong{font-family:Verdana;font-weight:400;font-style:normal;font-size:12px}.jd-item-9951__tag{background-color:#c81623;color:#fff;display:inline-block;padding:0px 3px;font-size:12px;border-radius:3px;font-style:normal;line-height:20px;margin-right:3px}.jd-item-9951__tag--0{background-color:#ff5000}.jd-item-9951__h3{cursor:pointer;margin:5px 0 0 0;padding:0;font-style:normal;font-size:14px;font-weight:400;line-height:22px;max-height:44px;overflow:hidden;color:#666;word-wrap:break-word;display:block;text-decoration:none}.jd-item-9951__h3:hover{color:red}.jd-item-9951__comments{font-size:12px;color:#999;margin:5px 0 0 0}.jd-item-9951__comments strong{color:#646fb0;font-family:verdana;font-weight:700}.jd-item-9951__shop{margin:5px 0 0 0;font-size:12px;color:#999}.jd-item-9951__icons{margin:5px 0 0 0;font-size:12px;display:flex;flex-wrap:wrap;justify-content:flex-start}.jd-item-9951__icons a,.jd-item-9951__icons i{font-style:normal;color:#df3033;border:1px solid #df3033;background-color:#ffdedf;display:inline-block;padding:0 4px;text-decoration:none;margin:0 3px 3px 0}.pagination-9784{margin-top:20px;text-align:center}.pagination-9784 li{display:inline-block;padding:4px;text-align:center;min-width:22px;min-height:22px;line-height:22px;font-size:15px;margin-right:4px}.pagination-9784__text{display:inline-block;background-color:#f3f3f3;border-radius:4px;width:160px;height:42px;line-height:42px;font-size:16px;color:#333;text-align:center;cursor:pointer}.pagination-9784__text:hover{background-color:#eee}.jd-coupon-list-9527{width:100%}.jd-coupon-list-9527 td{border-bottom:1px #aaa solid;padding:0 5px}.jd-coupon-list-9527 thead td{padding-top:8px;padding-bottom:8px;font-weight:700;font-size:15px}.jd-coupon-list-9527 tbody td{font-size:14px}.jd-coupon-list-9527 tbody td:first-child{color:#ec407a}\n",
				"",
			]);
			// Exports
			/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;

			/***/
		},

		/***/ 768: /***/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
			__webpack_require__.r(__webpack_exports__);
			/* harmony export */ __webpack_require__.d(__webpack_exports__, {
				/* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
				/* harmony export */
			});
			/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(379);
			/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default =
				/*#__PURE__*/ __webpack_require__.n(
					_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__
				);
			/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ =
				__webpack_require__(795);
			/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default =
				/*#__PURE__*/ __webpack_require__.n(
					_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__
				);
			/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ =
				__webpack_require__(569);
			/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default =
				/*#__PURE__*/ __webpack_require__.n(
					_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__
				);
			/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ =
				__webpack_require__(565);
			/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default =
				/*#__PURE__*/ __webpack_require__.n(
					_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__
				);
			/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ =
				__webpack_require__(216);
			/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default =
				/*#__PURE__*/ __webpack_require__.n(
					_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__
				);
			/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ =
				__webpack_require__(589);
			/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default =
				/*#__PURE__*/ __webpack_require__.n(
					_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__
				);
			/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_components_scss__WEBPACK_IMPORTED_MODULE_6__ =
				__webpack_require__(395);

			var options = {};

			options.styleTagTransform =
				_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default();
			options.setAttributes =
				_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default();

			options.insert =
				_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(
					null,
					"head"
				);

			options.domAPI =
				_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default();
			options.insertStyleElement =
				_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default();

			var update =
				_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(
					_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_components_scss__WEBPACK_IMPORTED_MODULE_6__ /* .default */.Z,
					options
				);

			/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ =
				_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_components_scss__WEBPACK_IMPORTED_MODULE_6__ /* .default */.Z &&
				_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_components_scss__WEBPACK_IMPORTED_MODULE_6__ /* .default.locals */
					.Z.locals
					? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_components_scss__WEBPACK_IMPORTED_MODULE_6__ /* .default.locals */
							.Z.locals
					: undefined;

			/***/
		},

		/***/ 379: /***/ (module) => {
			var stylesInDom = [];

			function getIndexByIdentifier(identifier) {
				var result = -1;

				for (var i = 0; i < stylesInDom.length; i++) {
					if (stylesInDom[i].identifier === identifier) {
						result = i;
						break;
					}
				}

				return result;
			}

			function modulesToDom(list, options) {
				var idCountMap = {};
				var identifiers = [];

				for (var i = 0; i < list.length; i++) {
					var item = list[i];
					var id = options.base ? item[0] + options.base : item[0];
					var count = idCountMap[id] || 0;
					var identifier = "".concat(id, " ").concat(count);
					idCountMap[id] = count + 1;
					var index = getIndexByIdentifier(identifier);
					var obj = {
						css: item[1],
						media: item[2],
						sourceMap: item[3],
					};

					if (index !== -1) {
						stylesInDom[index].references++;
						stylesInDom[index].updater(obj);
					} else {
						stylesInDom.push({
							identifier: identifier,
							updater: addStyle(obj, options),
							references: 1,
						});
					}

					identifiers.push(identifier);
				}

				return identifiers;
			}

			function addStyle(obj, options) {
				var api = options.domAPI(options);
				api.update(obj);
				return function updateStyle(newObj) {
					if (newObj) {
						if (
							newObj.css === obj.css &&
							newObj.media === obj.media &&
							newObj.sourceMap === obj.sourceMap
						) {
							return;
						}

						api.update((obj = newObj));
					} else {
						api.remove();
					}
				};
			}

			module.exports = function (list, options) {
				options = options || {};
				list = list || [];
				var lastIdentifiers = modulesToDom(list, options);
				return function update(newList) {
					newList = newList || [];

					for (var i = 0; i < lastIdentifiers.length; i++) {
						var identifier = lastIdentifiers[i];
						var index = getIndexByIdentifier(identifier);
						stylesInDom[index].references--;
					}

					var newLastIdentifiers = modulesToDom(newList, options);

					for (var _i = 0; _i < lastIdentifiers.length; _i++) {
						var _identifier = lastIdentifiers[_i];

						var _index = getIndexByIdentifier(_identifier);

						if (stylesInDom[_index].references === 0) {
							stylesInDom[_index].updater();

							stylesInDom.splice(_index, 1);
						}
					}

					lastIdentifiers = newLastIdentifiers;
				};
			};

			/***/
		},

		/***/ 569: /***/ (module) => {
			var memo = {};
			/* istanbul ignore next  */

			function getTarget(target) {
				if (typeof memo[target] === "undefined") {
					var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

					if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
						try {
							// This will throw an exception if access to iframe is blocked
							// due to cross-origin restrictions
							styleTarget = styleTarget.contentDocument.head;
						} catch (e) {
							// istanbul ignore next
							styleTarget = null;
						}
					}

					memo[target] = styleTarget;
				}

				return memo[target];
			}
			/* istanbul ignore next  */

			function insertBySelector(insert, style) {
				var target = getTarget(insert);

				if (!target) {
					throw new Error(
						"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid."
					);
				}

				target.appendChild(style);
			}

			module.exports = insertBySelector;

			/***/
		},

		/***/ 216: /***/ (module) => {
			/* istanbul ignore next  */
			function insertStyleElement(options) {
				var style = document.createElement("style");
				options.setAttributes(style, options.attributes);
				options.insert(style);
				return style;
			}

			module.exports = insertStyleElement;

			/***/
		},

		/***/ 565: /***/ (module, __unused_webpack_exports, __webpack_require__) => {
			/* istanbul ignore next  */
			function setAttributesWithoutAttributes(style) {
				var nonce = true ? __webpack_require__.nc : 0;

				if (nonce) {
					style.setAttribute("nonce", nonce);
				}
			}

			module.exports = setAttributesWithoutAttributes;

			/***/
		},

		/***/ 795: /***/ (module) => {
			/* istanbul ignore next  */
			function apply(style, options, obj) {
				var css = obj.css;
				var media = obj.media;
				var sourceMap = obj.sourceMap;

				if (media) {
					style.setAttribute("media", media);
				} else {
					style.removeAttribute("media");
				}

				if (sourceMap && typeof btoa !== "undefined") {
					css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(
						btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))),
						" */"
					);
				} // For old IE

				/* istanbul ignore if  */

				options.styleTagTransform(css, style);
			}

			function removeStyleElement(style) {
				// istanbul ignore if
				if (style.parentNode === null) {
					return false;
				}

				style.parentNode.removeChild(style);
			}
			/* istanbul ignore next  */

			function domAPI(options) {
				var style = options.insertStyleElement(options);
				return {
					update: function update(obj) {
						apply(style, options, obj);
					},
					remove: function remove() {
						removeStyleElement(style);
					},
				};
			}

			module.exports = domAPI;

			/***/
		},

		/***/ 589: /***/ (module) => {
			/* istanbul ignore next  */
			function styleTagTransform(css, style) {
				if (style.styleSheet) {
					style.styleSheet.cssText = css;
				} else {
					while (style.firstChild) {
						style.removeChild(style.firstChild);
					}

					style.appendChild(document.createTextNode(css));
				}
			}

			module.exports = styleTagTransform;

			/***/
		},

		/***/ 613: /***/ (module) => {
			module.exports = function (cssWithMappingToString) {
				var list = [];
				list.toString = function toString() {
					return this.map(function (item) {
						var content = cssWithMappingToString(item);
						if (item[2]) {
							return "@media ".concat(item[2], " {").concat(content, "}");
						}
						return content;
					}).join("");
				};
				list.i = function (modules, mediaQuery, dedupe) {
					if (typeof modules === "string") {
						modules = [[null, modules, ""]];
					}
					var alreadyImportedModules = {};
					if (dedupe) {
						for (var i = 0; i < this.length; i++) {
							var id = this[i][0];
							if (id != null) {
								alreadyImportedModules[id] = true;
							}
						}
					}
					for (var _i = 0; _i < modules.length; _i++) {
						var item = [].concat(modules[_i]);
						if (dedupe && alreadyImportedModules[item[0]]) {
							continue;
						}
						if (mediaQuery) {
							if (!item[2]) {
								item[2] = mediaQuery;
							} else {
								item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
							}
						}
						list.push(item);
					}
				};
				return list;
			};

			/***/
		},

		/***/ 665: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __createBinding =
				(this && this.__createBinding) ||
				(Object.create
					? function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							Object.defineProperty(o, k2, {
								enumerable: true,
								get: function () {
									return m[k];
								},
							});
					  }
					: function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							o[k2] = m[k];
					  });
			var __setModuleDefault =
				(this && this.__setModuleDefault) ||
				(Object.create
					? function (o, v) {
							Object.defineProperty(o, "default", { enumerable: true, value: v });
					  }
					: function (o, v) {
							o["default"] = v;
					  });
			var __importStar =
				(this && this.__importStar) ||
				function (mod) {
					if (mod && mod.__esModule) return mod;
					var result = {};
					if (mod != null)
						for (var k in mod)
							if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
								__createBinding(result, mod, k);
					__setModuleDefault(result, mod);
					return result;
				};
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importStar(__webpack_require__(804));
			const union_link_1 = __importDefault(__webpack_require__(176));
			const config_1 = __webpack_require__(913);
			const button_styles_1 = __webpack_require__(288);
			const JDHttpRequest_1 = __importDefault(__webpack_require__(948));
			const TBHttpRequest_1 = __importDefault(__webpack_require__(259));
			const useGetRequest = (url, config) => {
				const [data, setData] = react_1.useState();
				const request = async (url, config) => {
					try {
						let http = TBHttpRequest_1.default;
						if (config.params?.type == "jd") {
							http = JDHttpRequest_1.default;
						}
						const result = await http.get(url, config);
						return result.data;
					} catch (e) {
						console.log(e);
					}
				};
				react_1.useEffect(() => {
					request(url, config).then((result) => setData(result));
				}, []);
				return data;
			};
			const Component = (props) => {
				const result = useGetRequest("push", { params: { type: props.type } });
				if (result?.success) {
					return react_1.default.createElement(
						union_link_1.default,
						{
							show: config_1.is_360,
							union: props.type == "jd" ? "京东联盟" : "淘宝客",
							target: "_blank",
							href: result.result.url,
						},
						react_1.default.createElement(
							button_styles_1.GreenColorButton,
							{ variant: "contained", size: "small" },
							result.result.text
						)
					);
				}
				return null;
			};
			exports.default = Component;

			/***/
		},

		/***/ 288: /***/ (__unused_webpack_module, exports, __webpack_require__) => {
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.TealColorButton =
				exports.BlueColorButton =
				exports.PinkColorButton =
				exports.GreenColorButton =
					void 0;
			const core_1 = __webpack_require__(657);
			exports.GreenColorButton = core_1.withStyles(() => ({
				root: {
					color: "#fff",
					backgroundColor: "#07c160",
					boxShadow: "none",
					borderRadius: "2px",
					"&:active": {
						boxShadow: "none",
					},
					"&:focus": {
						boxShadow: "none",
					},
					"&:hover": {
						boxShadow: "none",
						backgroundColor: "#03b352",
					},
				},
			}))(core_1.Button);
			exports.PinkColorButton = core_1.withStyles(() => ({
				root: {
					color: "#fff",
					backgroundColor: "#ec407a",
					boxShadow: "none",
					borderRadius: "2px",
					"&:active": {
						boxShadow: "none",
					},
					"&:focus": {
						boxShadow: "none",
					},
					"&:hover": {
						boxShadow: "none",
						backgroundColor: "#d81b60",
					},
				},
			}))(core_1.Button);
			exports.BlueColorButton = core_1.withStyles(() => ({
				root: {
					color: "#fff",
					backgroundColor: "#1e88e5",
					boxShadow: "none",
					borderRadius: "2px",
					"&:active": {
						boxShadow: "none",
					},
					"&:focus": {
						boxShadow: "none",
					},
					"&:hover": {
						boxShadow: "none",
						backgroundColor: "#1565c0",
					},
				},
			}))(core_1.Button);
			exports.TealColorButton = core_1.withStyles(() => ({
				root: {
					color: "#fff",
					backgroundColor: "#07c160",
					boxShadow: "none",
					borderRadius: "2px",
					"&:active": {
						boxShadow: "none",
					},
					"&:focus": {
						boxShadow: "none",
					},
					"&:hover": {
						boxShadow: "none",
						backgroundColor: "#03b352",
					},
				},
			}))(core_1.Button);

			/***/
		},

		/***/ 836: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __createBinding =
				(this && this.__createBinding) ||
				(Object.create
					? function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							Object.defineProperty(o, k2, {
								enumerable: true,
								get: function () {
									return m[k];
								},
							});
					  }
					: function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							o[k2] = m[k];
					  });
			var __setModuleDefault =
				(this && this.__setModuleDefault) ||
				(Object.create
					? function (o, v) {
							Object.defineProperty(o, "default", { enumerable: true, value: v });
					  }
					: function (o, v) {
							o["default"] = v;
					  });
			var __importStar =
				(this && this.__importStar) ||
				function (mod) {
					if (mod && mod.__esModule) return mod;
					var result = {};
					if (mod != null)
						for (var k in mod)
							if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
								__createBinding(result, mod, k);
					__setModuleDefault(result, mod);
					return result;
				};
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importStar(__webpack_require__(804));
			const button_styles_1 = __webpack_require__(288);
			const core_1 = __webpack_require__(657);
			const jd_1 = __webpack_require__(181);
			const config_1 = __webpack_require__(913);
			const functions_1 = __webpack_require__(877);
			const union_link_1 = __importDefault(__webpack_require__(176));
			const redirect = (params) => {
				let result = new Array();
				for (let k in params) {
					result.push(`${k}=${encodeURIComponent(params[k])}`);
				}
				return window.open(config_1.baseUrl.jd + "/jd.goods.redirect?" + result.join("&"), "_blank");
			};
			const useGetCoupon = (skuid) => {
				const [coupon, setCoupon] = react_1.useState();
				const getItem = (skuid) => {
					return jd_1.JdGoodsCouponStore.getItem(skuid);
				};
				react_1.useEffect(() => {
					getItem(skuid).then((r) => setCoupon(r));
				}, []);
				return coupon;
			};
			const Component = (props) => {
				const couponList = useGetCoupon(props.skuid);
				const [random, setRandom] = react_1.useState(0);
				react_1.useEffect(() => {
					let timerid = 0;
					if (couponList && couponList.length) {
						if (timerid) return;
						timerid = window.setInterval(() => {
							setRandom(functions_1.randomInt(0, couponList.length));
							timerid = 0;
							window.clearTimeout(timerid);
						}, 1000 * 7);
					}
					return () => {
						window.clearTimeout(timerid);
					};
				}, [couponList]);
				if (couponList?.length) {
					return react_1.default.createElement(
						"div",
						{ className: "x-lhq-hover-9527" },
						react_1.default.createElement(
							button_styles_1.PinkColorButton,
							{
								style: { cursor: "default" },
								title: "\u63D0\u793A\uFF1A\u5148\u9886\u53D6\u4F18\u60E0\u5238\u5728\u8D2D\u7269",
								variant: "contained",
								size: "small",
							},
							"\u6EE1",
							couponList[random]["quota"],
							"\u51CF",
							couponList[random]["discount"],
							"\u4F18\u60E0\u5238"
						),
						react_1.default.createElement(
							"div",
							{ className: "x-lhq-hover-9527__show", style: { width: props.width } },
							react_1.default.createElement(
								"table",
								{ cellSpacing: "0", cellPadding: "0", className: "jd-coupon-list-9527" },
								react_1.default.createElement(
									"thead",
									null,
									react_1.default.createElement(
										"tr",
										{ key: "header" },
										react_1.default.createElement("td", null, "\u4F18\u60E0\u5238\u4FE1\u606F"),
										react_1.default.createElement("td", null, "\u6709\u6548\u671F"),
										react_1.default.createElement("td", null)
									)
								),
								react_1.default.createElement(
									"tbody",
									null,
									couponList.map((v, i) => {
										return react_1.default.createElement(
											"tr",
											{ key: i },
											react_1.default.createElement(
												"td",
												{ width: "25%" },
												"\u6EE1",
												v.quota,
												"\u51CF",
												v.discount
											),
											react_1.default.createElement(
												"td",
												{ width: "45%" },
												new Date(v.getStartTime).toLocaleDateString(),
												"\u81F3",
												new Date(v.getEndTime).toLocaleDateString()
											),
											react_1.default.createElement(
												"td",
												{ width: "30%" },
												react_1.default.createElement(
													core_1.Button,
													{ color: "primary", disabled: v.price < v.quota, size: "small" },
													react_1.default.createElement(
														union_link_1.default,
														{
															union: "\u4EAC\u4E1C\u8054\u76DF",
															show: config_1.is_360,
															style: { color: "inherit" },
															onClick: () =>
																redirect({
																	secret: config_1.JD_AES_SECRET_KEY,
																	siteId: config_1.jd_site_id,
																	positionId: config_1.jd_position_id,
																	materialId: `https://item.jd.com/${props.skuid}.html`,
																	couponUrl: v.link,
																}),
														},
														v.price < v.quota ? "商品价格过低，无法领取" : "领取优惠券"
													)
												)
											)
										);
									})
								)
							)
						)
					);
				}
				return null;
			};
			exports.default = Component;

			/***/
		},

		/***/ 687: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importDefault(__webpack_require__(804));
			const react_2 = __webpack_require__(804);
			const button_styles_1 = __webpack_require__(288);
			const config_1 = __webpack_require__(913);
			const JDHttpRequest_1 = __importDefault(__webpack_require__(948));
			const union_link_1 = __importDefault(__webpack_require__(176));
			const create_url = (materialUrl) => {
				return /https?:\/\//.test(materialUrl) ? materialUrl : "https://" + materialUrl;
			};
			const Component = (props) => {
				const [open, setOpen] = react_2.useState(props.open);
				const redirect = async () => {
					const wind = window.open("about:blank", "_blank");
					const res = await JDHttpRequest_1.default.get("jd.goods.lijin", {
						params: {
							materialId: create_url(props.materialUrl),
							siteId: config_1.jd_site_id,
							lhq_secret: props.lhq_secret,
							positionId: config_1.jd_position_id,
						},
					});
					if (!res.data.success) {
						wind.close();
						alert("错误" + res.data.message);
						setOpen(false);
					}
					const title = encodeURIComponent("手机打开京东APP扫码领取");
					const clickURL = encodeURIComponent(res.data.data.clickURL);
					wind.location.href = `${config_1.baseUrl.jd}/qrcode?title=${title}&url=${clickURL}`;
				};
				if (!(open && props.lhq_lijin && props.lhq_secret)) return null;
				return react_1.default.createElement(
					union_link_1.default,
					{ union: "\u4EAC\u4E1C\u8054\u76DF", show: config_1.is_360, onClick: () => redirect() },
					react_1.default.createElement(
						button_styles_1.PinkColorButton,
						{
							title: "\u63D0\u793A\uFF1A\u793C\u91D1\u6709\u9650\uFF0C\u6CA1\u4E86\u5C31\u4F1A\u6D88\u5931\u6389\u6216\u6253\u5F00\u7A7A\u767D\u7F51\u9875",
							variant: "contained",
							size: "small",
						},
						"\u9886\u53D6",
						react_1.default.createElement("b", null, props.lhq_lijin),
						"\u5143\u793C\u91D1"
					)
				);
			};
			exports.default = Component;

			/***/
		},

		/***/ 344: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importDefault(__webpack_require__(804));
			const button_styles_1 = __webpack_require__(288);
			const price_trend_chart_1 = __importDefault(__webpack_require__(228));
			const JDHttpRequest_1 = __webpack_require__(948);
			__webpack_require__(768);
			const Component = (props) => {
				const result = JDHttpRequest_1.useGetRequest("jd.goods.history.info", {
					params: props,
				});
				if (result && result.result) {
					return react_1.default.createElement(
						"div",
						{ className: "x-lhq-hover-9527" },
						react_1.default.createElement(
							button_styles_1.BlueColorButton,
							{ style: { cursor: "default" }, variant: "contained", size: "small" },
							"\u67E5\u770B\u5386\u53F2\u4EF7\u683C"
						),
						react_1.default.createElement(
							"div",
							{ className: "x-lhq-hover-9527__show", style: { width: props.width } },
							react_1.default.createElement(price_trend_chart_1.default, {
								width: props.width,
								height: props.width / 2,
								text: result?.result?.title,
								data: { price: result?.result?.data ?? [] },
								length: props.length,
							})
						)
					);
				}
				return null;
			};
			exports.default = Component;

			/***/
		},

		/***/ 412: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __createBinding =
				(this && this.__createBinding) ||
				(Object.create
					? function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							Object.defineProperty(o, k2, {
								enumerable: true,
								get: function () {
									return m[k];
								},
							});
					  }
					: function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							o[k2] = m[k];
					  });
			var __setModuleDefault =
				(this && this.__setModuleDefault) ||
				(Object.create
					? function (o, v) {
							Object.defineProperty(o, "default", { enumerable: true, value: v });
					  }
					: function (o, v) {
							o["default"] = v;
					  });
			var __importStar =
				(this && this.__importStar) ||
				function (mod) {
					if (mod && mod.__esModule) return mod;
					var result = {};
					if (mod != null)
						for (var k in mod)
							if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
								__createBinding(result, mod, k);
					__setModuleDefault(result, mod);
					return result;
				};
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importStar(__webpack_require__(804));
			const jd_1 = __webpack_require__(181);
			const config_1 = __webpack_require__(913);
			const union_link_1 = __importDefault(__webpack_require__(176));
			__webpack_require__(768);
			const redirect = (params) => {
				let result = new Array();
				for (let k in params) {
					result.push(`${k}=${encodeURIComponent(params[k])}`);
				}
				return window.open(config_1.baseUrl.jd + "/jd.goods.redirect?" + result.join("&"), "_blank");
			};
			const getCouponList = (props) => {
				const map = new Map();
				if (props.couponInfo.couponList.length) {
					for (let i = 0; i < props.couponInfo.couponList.length; i++) {
						const data = Object.assign({}, props.couponInfo.couponList[i], {
							price: props.priceInfo.price,
						});
						map.set(data.discount, data);
					}
				}
				return map.size ? Array.from(map.values()) : [];
			};
			const storeCoupon = (skuId, price, couponList) => {
				const result = new Array();
				for (let i = 0; i < couponList.length; i++) {
					const data = Object.assign({ price }, couponList[i]);
					result.push(data);
				}
				jd_1.JdGoodsCouponStore.setItem(skuId, ...result);
			};
			const Item = (props) => {
				const url = /^https?:\/\//gi.test(props.materialUrl)
					? props.materialUrl
					: "https://" + props.materialUrl;
				const couponList = getCouponList(props);
				react_1.useEffect(() => {
					if (couponList.length) {
						storeCoupon(props.skuId, props.priceInfo.price, props.couponInfo.couponList);
					}
				}, []);
				return react_1.default.createElement(
					"div",
					{ className: "jd-item-9951" },
					react_1.default.createElement(
						union_link_1.default,
						{
							className: "jd-item-9951__img",
							union: "\u4EAC\u4E1C\u8054\u76DF",
							show: config_1.is_360,
							onClick: () =>
								redirect({
									secret: config_1.JD_AES_SECRET_KEY,
									siteId: config_1.jd_site_id,
									positionId: config_1.jd_position_id,
									materialId: url,
								}),
						},
						react_1.default.createElement("img", {
							width: "240",
							height: "240",
							src: props.imageInfo.imageList[0]["url"],
						})
					),
					react_1.default.createElement(
						"div",
						{ className: "jd-item-9951__price" },
						react_1.default.createElement("em", null, "\uFFE5"),
						react_1.default.createElement("i", null, props.priceInfo.lowestCouponPrice),
						react_1.default.createElement("strong", null, "\u5238\u540E\u4EF7")
					),
					react_1.default.createElement(
						union_link_1.default,
						{
							union: "\u4EAC\u4E1C\u8054\u76DF",
							show: config_1.is_360,
							className: "jd-item-9951__h3",
							onClick: () =>
								redirect({
									secret: config_1.JD_AES_SECRET_KEY,
									siteId: config_1.jd_site_id,
									positionId: config_1.jd_position_id,
									materialId: url,
								}),
						},
						props.owner === "g"
							? react_1.default.createElement(
									"em",
									{ className: "jd-item-9951__tag" },
									"\u4EAC\u4E1C\u81EA\u8425"
							  )
							: null,
						props.skuName
					),
					react_1.default.createElement(
						"div",
						{ className: "jd-item-9951__comments" },
						react_1.default.createElement("strong", null, props.comments, " "),
						"\u6761\u8BC4\u4EF7"
					),
					react_1.default.createElement(
						"div",
						{ className: "jd-item-9951__shop" },
						react_1.default.createElement("span", null, props.shopInfo.shopName)
					),
					react_1.default.createElement(
						"div",
						{ className: "jd-item-9951__icons" },
						props.lhq_lijin
							? react_1.default.createElement(
									"i",
									{
										title: "\u63D0\u793A\uFF1A\u793C\u91D1\u6709\u9650\uFF0C\u6CA1\u4E86\u5C31\u4F1A\u6D88\u606F\u6389\u6216\u6253\u5F00\u7A7A\u767D\u7F51\u9875",
									},
									props.lhq_lijin.toFixed(2),
									" \u5143\u793C\u91D1"
							  )
							: null,
						couponList.map((v, i) =>
							react_1.default.createElement(
								"i",
								{ title: `满${v.quota}元可用${v.discount}元券,请先点击领取优惠券`, key: i },
								"\u6EE1",
								v.quota,
								"\u51CF",
								v.discount
							)
						)
					)
				);
			};
			const ListItem = (props) => {
				if (props.data?.length) {
					return react_1.default.createElement(
						"div",
						{
							style: {
								display: "grid",
								width: "100%",
								gridTemplateColumns: "repeat(4,240px)",
								justifyContent: "space-around",
								rowGap: "15px",
							},
						},
						props.data.map((v, i) => react_1.default.createElement(Item, { key: i, ...v }))
					);
				}
				return react_1.default.createElement(react_1.default.Fragment, null, "\u6682\u65E0\u6570\u636E");
			};
			exports.default = ListItem;

			/***/
		},

		/***/ 111: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __createBinding =
				(this && this.__createBinding) ||
				(Object.create
					? function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							Object.defineProperty(o, k2, {
								enumerable: true,
								get: function () {
									return m[k];
								},
							});
					  }
					: function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							o[k2] = m[k];
					  });
			var __setModuleDefault =
				(this && this.__setModuleDefault) ||
				(Object.create
					? function (o, v) {
							Object.defineProperty(o, "default", { enumerable: true, value: v });
					  }
					: function (o, v) {
							o["default"] = v;
					  });
			var __importStar =
				(this && this.__importStar) ||
				function (mod) {
					if (mod && mod.__esModule) return mod;
					var result = {};
					if (mod != null)
						for (var k in mod)
							if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
								__createBinding(result, mod, k);
					__setModuleDefault(result, mod);
					return result;
				};
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importStar(__webpack_require__(804));
			const JDHttpRequest_1 = __importDefault(__webpack_require__(948));
			const modal_tabs_goods_push_1 = __importDefault(__webpack_require__(128));
			const jd_item_goods_1 = __importDefault(__webpack_require__(412));
			const pagination_1 = __importDefault(__webpack_require__(503));
			const Component = ({ tabs, autoToggleTitle }) => {
				const [tabIndex, setTabIndex] = react_1.useState(0);
				const [items, setItems] = react_1.useState(
					tabs.map((v) => {
						return {
							pageIndex: v.params.pageIndex,
							maxPageIndex: 40,
							data: new Array(),
							state: "undone",
						};
					})
				);
				const [current, setCurrent] = react_1.useState();
				const request = async (index, params) => {
					try {
						const [tab, item] = [tabs[index], items[index]];
						item.state = "loading";
						setCurrent(item);
						const res = await JDHttpRequest_1.default.get(tab.url, {
							params: Object.assign(tab.params, params),
						});
						if (res.data && res.data.success && res.data.data?.length) {
							item.data.push(...res.data.data);
							item.state = "undone";
							if (item.pageIndex >= item.maxPageIndex) {
								item.state = "done";
							}
							setItems(items);
							return { ...item };
						}
						item.state = "done";
						return { ...item };
					} catch (e) {
						console.log(e);
					}
				};
				const onChangeTab = (index) => {
					const target = items[index];
					if (!target.data.length) {
						request(index, { pageIndex: target.pageIndex }).then((result) => {
							setCurrent(result);
						});
					} else {
						setCurrent(target);
					}
					setTabIndex(index);
				};
				const onChangePage = () => {
					items[tabIndex]["pageIndex"] += 1;
					request(tabIndex, { pageIndex: items[tabIndex]["pageIndex"] }).then((result) => {
						setCurrent(result);
					});
				};
				return react_1.default.createElement(
					modal_tabs_goods_push_1.default,
					{
						autoToggleTitle: autoToggleTitle,
						tabs: tabs.map((v) => v.label),
						onLoading: (i) => onChangeTab(i),
						onChange: (i) => onChangeTab(i),
					},
					react_1.default.createElement(jd_item_goods_1.default, { data: current?.data }),
					!current || current.state == "done"
						? null
						: react_1.default.createElement(pagination_1.default, {
								loading: current.state == "loading",
								onClick: () => onChangePage(),
						  })
				);
			};
			exports.default = Component;

			/***/
		},

		/***/ 128: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __createBinding =
				(this && this.__createBinding) ||
				(Object.create
					? function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							Object.defineProperty(o, k2, {
								enumerable: true,
								get: function () {
									return m[k];
								},
							});
					  }
					: function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							o[k2] = m[k];
					  });
			var __setModuleDefault =
				(this && this.__setModuleDefault) ||
				(Object.create
					? function (o, v) {
							Object.defineProperty(o, "default", { enumerable: true, value: v });
					  }
					: function (o, v) {
							o["default"] = v;
					  });
			var __importStar =
				(this && this.__importStar) ||
				function (mod) {
					if (mod && mod.__esModule) return mod;
					var result = {};
					if (mod != null)
						for (var k in mod)
							if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
								__createBinding(result, mod, k);
					__setModuleDefault(result, mod);
					return result;
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importStar(__webpack_require__(804));
			const button_styles_1 = __webpack_require__(288);
			const core_1 = __webpack_require__(657);
			const functions_1 = __webpack_require__(877);
			const useStyles = core_1.makeStyles((theme) => ({
				modal: {
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				},
				bar: {
					boxShadow: "none",
				},
				tab: {
					minWidth: "100px",
				},
				paper: {
					backgroundColor: theme.palette.background.paper,
					width: 1050,
					position: "relative",
				},
			}));
			function a11yProps(index) {
				return {
					id: `scrollable-auto-tab-${index}`,
				};
			}
			const Component = (props) => {
				const random = props.autoToggleTitle ? functions_1.randomInt(0, props.tabs.length) : 0;
				const classes = useStyles();
				const [open, setOpen] = react_1.useState(false);
				const [tabIndex, setTabIndex] = react_1.useState(random);
				const [tabDefaultIndexItem, setTabDefaultIndexItem] = react_1.useState(random);
				const onChangeTab = (value) => {
					setTabDefaultIndexItem(value);
					props.onChange && props.onChange(value);
				};
				const onOpenModal = (value) => {
					setTabDefaultIndexItem(value);
					props.onLoading && props.onLoading(value);
					setOpen(true);
				};
				const onCloseModal = () => setOpen(false);
				react_1.useEffect(() => {
					let timerid = 0;
					if (props.autoToggleTitle) {
						if (!timerid) {
							timerid = window.setInterval(() => {
								setTabIndex(functions_1.randomInt(0, props.tabs.length));
								timerid = 0;
								window.clearTimeout(timerid);
							}, 1000 * 5);
						}
					}
					return () => {
						window.clearTimeout(timerid);
					};
				}, []);
				return react_1.default.createElement(
					"div",
					{ style: { display: "inline-block" } },
					react_1.default.createElement(
						button_styles_1.TealColorButton,
						{
							variant: "contained",
							title: "\u5185\u7F6E\u5546\u54C1\u4F18\u60E0\u5238",
							size: "small",
							onClick: () => onOpenModal(tabIndex),
						},
						props.tabs[tabIndex]
					),
					react_1.default.createElement(
						core_1.Modal,
						{
							open: open,
							style: { zIndex: 99999999 },
							onClose: () => setOpen(false),
							className: classes.modal,
						},
						react_1.default.createElement(
							"div",
							{ className: classes.paper },
							react_1.default.createElement(
								core_1.AppBar,
								{ position: "static", color: "default", className: classes.bar },
								react_1.default.createElement(
									core_1.Tabs,
									{
										value: tabDefaultIndexItem,
										onChange: (e, value) => onChangeTab(value),
										indicatorColor: "primary",
										textColor: "primary",
										variant: "scrollable",
										scrollButtons: "auto",
									},
									props.tabs.map((value, index) => {
										return react_1.default.createElement(core_1.Tab, {
											className: classes.tab,
											key: index,
											value: index,
											label: value,
											...a11yProps(index),
										});
									})
								)
							),
							react_1.default.createElement(
								"div",
								{ style: { padding: "15px 5px", maxHeight: 700, height: "75vh", overflowY: "scroll" } },
								props.children
							),
							react_1.default.createElement(
								core_1.Fab,
								{
									style: { position: "absolute", bottom: "20px", right: "30px" },
									size: "medium",
									title: "\u70B9\u51FB\u5916\u90E8\u6697\u8272\u533A\u57DF\u4E5F\u53EF\u5173\u95ED",
									onClick: () => onCloseModal(),
								},
								"\u5173\u95ED"
							)
						)
					)
				);
			};
			exports.default = Component;

			/***/
		},

		/***/ 503: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importDefault(__webpack_require__(804));
			__webpack_require__(768);
			const Pagination = (props) => {
				return react_1.default.createElement(
					"div",
					{ className: "pagination-9784" },
					react_1.default.createElement(
						"div",
						{ className: "pagination-9784__text", onClick: () => props.loading || props.onClick() },
						props.loading ? "加载中..." : props.text ?? "点击加载更多内容"
					)
				);
			};
			exports.default = Pagination;

			/***/
		},

		/***/ 228: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __createBinding =
				(this && this.__createBinding) ||
				(Object.create
					? function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							Object.defineProperty(o, k2, {
								enumerable: true,
								get: function () {
									return m[k];
								},
							});
					  }
					: function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							o[k2] = m[k];
					  });
			var __setModuleDefault =
				(this && this.__setModuleDefault) ||
				(Object.create
					? function (o, v) {
							Object.defineProperty(o, "default", { enumerable: true, value: v });
					  }
					: function (o, v) {
							o["default"] = v;
					  });
			var __importStar =
				(this && this.__importStar) ||
				function (mod) {
					if (mod && mod.__esModule) return mod;
					var result = {};
					if (mod != null)
						for (var k in mod)
							if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
								__createBinding(result, mod, k);
					__setModuleDefault(result, mod);
					return result;
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importStar(__webpack_require__(804));
			const echarts = __importStar(__webpack_require__(83));
			const options = {
				title: {
					textStyle: {
						fontSize: 13,
						width: 250,
						overflow: "break",
						lineHeight: 18,
					},
				},
				tooltip: {
					trigger: "axis",
					label: {
						precision: 2,
					},
				},
				legend: {
					data: ["历史价格"],
					right: "20px",
				},
				xAxis: {
					type: "time",
					boundaryGap: false,
					data: new Array(),
				},
				yAxis: {
					type: "value",
					axisLabel: {
						formatter: "{value} 元",
					},
				},
				series: [
					{
						name: "历史价格",
						type: "line",
						data: new Array(),
						markPoint: {
							data: [
								{ type: "max", name: "最大值" },
								{ type: "min", name: "最小值" },
							],
						},
						markLine: {
							data: [{ type: "average", name: "平均值" }],
						},
					},
				],
			};
			const serieCoupon = {
				name: "历史优惠券",
				type: "line",
				data: new Array(),
				markPoint: {
					data: [{ type: "max", name: "最大值" }],
				},
				markLine: {
					data: [{ type: "average", name: "平均值" }],
				},
			};
			const format = (length, data) => {
				const time = fill(length);
				const result = new Array();
				for (let i = 0; i < length; i++) {
					if (data[i]) result.push([time[i], data[i]]);
				}
				return result;
			};
			const fill = (length) => {
				const result = new Array();
				const dayTimestamp = 1000 * 60 * 60 * 24;
				let start = new Date(Date.now() - dayTimestamp * length);
				for (let i = 0; i < length; i++) {
					start = new Date(start.getTime() + dayTimestamp);
					const year = start.getFullYear();
					const month = start.getMonth() + 1;
					const day = start.getDate();
					result.push(`${year}-${month}-${day}`);
				}
				return result;
			};
			const component = (props) => {
				const myecharts = react_1.useRef();
				const chartRef = react_1.useRef(null);
				const reset = () => {
					options.xAxis.data = fill(props.length);
					options.series[0].data = format(props.length, props.data.price);
					options.title = Object.assign(options.title, { text: props.text, subtext: props.subtext });
					if (typeof props.width != "undefined") {
						options.title.textStyle.width =
							typeof props.width == "string" ? Number.parseInt(props.width) * 0.65 : props.width * 0.65;
					}
					if (props.data.coupon?.length) {
						const legend = new Set([...options.legend.data, "历史优惠券"]);
						options.legend.data = Array.from(legend);
						options.series[1] = serieCoupon;
						options.series[1].data = format(props.length, props.data.coupon);
					}
					myecharts.current?.setOption(options);
				};
				react_1.useEffect(() => {
					if (chartRef.current) {
						myecharts.current = echarts.init(chartRef.current);
						reset();
					}
				}, [myecharts.current]);
				if (chartRef.current) reset();
				return react_1.default.createElement("div", {
					style: { width: props.width ?? "500px", height: props.height ?? "340px" },
					ref: chartRef,
				});
			};
			exports.default = component;

			/***/
		},

		/***/ 783: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __createBinding =
				(this && this.__createBinding) ||
				(Object.create
					? function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							Object.defineProperty(o, k2, {
								enumerable: true,
								get: function () {
									return m[k];
								},
							});
					  }
					: function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							o[k2] = m[k];
					  });
			var __setModuleDefault =
				(this && this.__setModuleDefault) ||
				(Object.create
					? function (o, v) {
							Object.defineProperty(o, "default", { enumerable: true, value: v });
					  }
					: function (o, v) {
							o["default"] = v;
					  });
			var __importStar =
				(this && this.__importStar) ||
				function (mod) {
					if (mod && mod.__esModule) return mod;
					var result = {};
					if (mod != null)
						for (var k in mod)
							if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
								__createBinding(result, mod, k);
					__setModuleDefault(result, mod);
					return result;
				};
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importStar(__webpack_require__(804));
			const button_styles_1 = __webpack_require__(288);
			const tb_1 = __webpack_require__(609);
			const TBHttpRequest_1 = __importDefault(__webpack_require__(259));
			const config_1 = __webpack_require__(913);
			const tb_goods_lijin_1 = __importDefault(__webpack_require__(890));
			const union_link_1 = __importDefault(__webpack_require__(176));
			const create_url = (coupon_share_url) => {
				const url = "https:" + coupon_share_url;
				return config_1.baseUrl.tb + "/redirect?url=" + encodeURI(url);
			};
			const useGetRequest = (item_id, title) => {
				const [coupon, setCoupon] = react_1.useState();
				const request = async () => {
					const item = await tb_1.TbGoodsCouponStore.getItem(item_id);
					if (!item) {
						try {
							const res = await TBHttpRequest_1.default.get("taobao.tbk.goods.find.one", {
								params: {
									item_id: item_id,
									title: title,
									adzone_id: config_1.ADZONE_ID,
								},
							});
							if (
								res.data &&
								res.data.success &&
								res.data.result_list &&
								res.data.result_list.map_data?.length
							) {
								tb_1.TbGoodsCouponStore.setItem(item_id, res.data.result_list.map_data[0]);
								return res.data.result_list.map_data[0];
							}
						} catch (e) {}
						return null;
					}
					return item;
				};
				react_1.useEffect(() => {
					request().then((result) => result && setCoupon(result));
				}, []);
				return coupon;
			};
			const component = (props) => {
				const item = useGetRequest(props.item_id, props.title);
				if (!item) return null;
				let coupon = null;
				if (item?.coupon_share_url && item?.coupon_amount) {
					const coupon_share_url = create_url(item.coupon_share_url);
					coupon = react_1.default.createElement(
						union_link_1.default,
						{ union: "\u6DD8\u5B9D\u5BA2", show: config_1.is_360, target: "_self", href: coupon_share_url },
						react_1.default.createElement(
							button_styles_1.PinkColorButton,
							{
								title: "\u63D0\u793A\uFF1A\u5148\u9886\u53D6\u4F18\u60E0\u5238\u5728\u8D2D\u7269",
								variant: "contained",
								size: "small",
							},
							"\u9886\u53D6",
							react_1.default.createElement("b", null, item.coupon_amount),
							"\u5143\u4F18\u60E0\u5238"
						)
					);
				}
				return react_1.default.createElement(
					react_1.default.Fragment,
					null,
					react_1.default.createElement(tb_goods_lijin_1.default, {
						open: props.lijin,
						item_id: item.item_id,
						lhq_lijin: item.lhq_lijin,
						lhq_secret: item.lhq_secret,
					}),
					coupon
				);
			};
			exports.default = component;

			/***/
		},

		/***/ 890: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importDefault(__webpack_require__(804));
			const react_2 = __webpack_require__(804);
			const button_styles_1 = __webpack_require__(288);
			const config_1 = __webpack_require__(913);
			const TBHttpRequest_1 = __importDefault(__webpack_require__(259));
			const union_link_1 = __importDefault(__webpack_require__(176));
			const Component = (props) => {
				const [open, setOpen] = react_2.useState(props.open);
				const redirect = async (lhq_secret) => {
					try {
						const wind = window.open("about:blank", "_blank");
						const res = await TBHttpRequest_1.default.get("taotao.tbk.goods.lijin", {
							params: { lhq_secret, adzone_id: config_1.ADZONE_ID },
						});
						if (res.data.success && res.data.result) {
							const title = encodeURIComponent("手机打开淘宝APP扫码领取");
							const clickURL = encodeURIComponent(res.data.result.clickURL);
							wind.location.href = `${config_1.baseUrl.tb}/qrcode?title=${title}&url=${clickURL}`;
						} else {
							wind.close();
							setOpen(false);
							alert("错误" + res.data.msg);
						}
					} catch (e) {
						alert("礼金创建异常-网络请求出错");
					}
				};
				if (!(open && props.lhq_lijin && props.lhq_secret)) return null;
				return react_1.default.createElement(
					union_link_1.default,
					{
						union: "\u6DD8\u5B9D\u5BA2",
						show: config_1.is_360,
						onClick: () => props.lhq_secret && redirect(props.lhq_secret),
					},
					react_1.default.createElement(
						button_styles_1.PinkColorButton,
						{
							title: "\u63D0\u793A\uFF1A\u793C\u91D1\u6709\u9650\uFF0C\u6CA1\u4E86\u5C31\u4F1A\u6D88\u5931\u6389\u6216\u6253\u5F00\u7A7A\u767D\u7F51\u9875",
							variant: "contained",
							size: "small",
						},
						"\u9886\u53D6",
						react_1.default.createElement("b", null, props.lhq_lijin),
						"\u5143\u6DD8\u793C\u91D1"
					)
				);
			};
			exports.default = Component;

			/***/
		},

		/***/ 447: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importDefault(__webpack_require__(804));
			const TBHttpRequest_1 = __webpack_require__(259);
			const button_styles_1 = __webpack_require__(288);
			const price_trend_chart_1 = __importDefault(__webpack_require__(228));
			__webpack_require__(768);
			const component = ({ num_iid, length, width }) => {
				const result_price = TBHttpRequest_1.useGetRequest("taobao.tbk.goods.history.info/price", {
					params: {
						item_id: num_iid,
						length: length,
					},
				});
				const result_coupon = TBHttpRequest_1.useGetRequest("taobao.tbk.goods.history.info/coupon", {
					params: {
						item_id: num_iid,
						length: length,
					},
				});
				return result_price?.result || result_coupon?.result
					? react_1.default.createElement(
							"div",
							{ className: "x-lhq-hover-9527" },
							react_1.default.createElement(
								button_styles_1.BlueColorButton,
								{ style: { cursor: "default" }, variant: "contained", size: "small" },
								"\u67E5\u770B\u5386\u53F2\u4EF7\u683C"
							),
							react_1.default.createElement(
								"div",
								{ className: "x-lhq-hover-9527__show", style: { width } },
								react_1.default.createElement(price_trend_chart_1.default, {
									text: result_price?.result?.title ?? result_coupon?.result?.title,
									data: {
										price: result_price?.result?.data ?? [],
										coupon: result_coupon?.result?.data ?? [],
									},
									length: length,
									width: width,
									height: width / 2,
								})
							)
					  )
					: null;
			};
			exports.default = component;

			/***/
		},

		/***/ 23: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importDefault(__webpack_require__(804));
			const tb_1 = __webpack_require__(609);
			const config_1 = __webpack_require__(913);
			const union_link_1 = __importDefault(__webpack_require__(176));
			__webpack_require__(768);
			const create_url = (props) => {
				let url = "https://item.taobao.com/item.htm?id=" + props.item_id;
				if (props.click_url) url = "https:" + props.click_url;
				if (props.coupon_share_url) url = "https:" + props.coupon_share_url;
				return config_1.baseUrl.tb + "/redirect?url=" + encodeURI(url);
			};
			const lowestCouponPrice = (zk_price, coupon_amount) => {
				let price1 = Number.parseFloat(zk_price);
				let price2 = coupon_amount ? Number.parseFloat(coupon_amount) : 0;
				return (price1 - price2).toFixed(2);
			};
			const Item = (props) => {
				const user_type = ["淘宝", "天猫", "", "特价版"];
				tb_1.TbGoodsCouponStore.setItem(props.item_id, props);
				return react_1.default.createElement(
					"div",
					{ className: "jd-item-9951" },
					react_1.default.createElement(
						union_link_1.default,
						{
							className: "jd-item-9951__img",
							show: config_1.is_360,
							union: "\u6DD8\u5B9D\u5BA2",
							target: "_blank",
							href: create_url(props),
						},
						react_1.default.createElement("img", {
							width: "240",
							height: "240",
							src: props.pict_url + "_250x250",
						})
					),
					react_1.default.createElement(
						"div",
						{ className: "jd-item-9951__price" },
						react_1.default.createElement("em", null, "\uFFE5"),
						react_1.default.createElement(
							"i",
							null,
							lowestCouponPrice(props.zk_final_price, props.coupon_amount)
						),
						react_1.default.createElement("strong", null, "\u5238\u540E\u4EF7")
					),
					react_1.default.createElement(
						union_link_1.default,
						{
							className: "jd-item-9951__h3",
							show: config_1.is_360,
							target: "_blank",
							union: "\u6DD8\u5B9D\u5BA2",
							href: create_url(props),
						},
						react_1.default.createElement(
							"em",
							{ className: `jd-item-9951__tag jd-item-9951__tag--${props.user_type}` },
							user_type[props.user_type]
						),
						props.title
					),
					react_1.default.createElement(
						"div",
						{ className: "jd-item-9951__comments" },
						react_1.default.createElement("strong", null, props.volume, " "),
						" \u6708\u9500\u91CF"
					),
					react_1.default.createElement(
						"div",
						{ className: "jd-item-9951__shop" },
						react_1.default.createElement("span", null, props.shop_title)
					),
					react_1.default.createElement(
						"div",
						{ className: "jd-item-9951__icons" },
						!props.lhq_lijin
							? null
							: react_1.default.createElement(
									"i",
									{
										title: "\u63D0\u793A\uFF1A\u793C\u91D1\u6709\u9650\uFF0C\u6CA1\u4E86\u5C31\u4F1A\u6D88\u606F\u6389\u6216\u6253\u5F00\u7A7A\u767D\u7F51\u9875",
									},
									props.lhq_lijin.toFixed(2),
									" \u5143\u6DD8\u793C\u91D1"
							  ),
						!props.coupon_amount
							? null
							: react_1.default.createElement(
									"i",
									{
										title: `满${props.coupon_start_fee}减${props.coupon_amount}券,请先点击领取优惠券`,
									},
									props.coupon_start_fee?.length
										? `满${props.coupon_start_fee}减${props.coupon_amount}`
										: `${props.coupon_amount}元优惠券`
							  )
					)
				);
			};
			const ListItem = (props) => {
				if (props.data?.length) {
					return react_1.default.createElement(
						"div",
						{
							style: {
								display: "grid",
								width: "100%",
								gridTemplateColumns: "repeat(4,240px)",
								justifyContent: "space-around",
								rowGap: "15px",
							},
						},
						props.data.map((v, i) => react_1.default.createElement(Item, { key: i, ...v }))
					);
				}
				return react_1.default.createElement(react_1.default.Fragment, null, "\u6682\u65E0\u6570\u636E");
			};
			exports.default = ListItem;

			/***/
		},

		/***/ 807: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __createBinding =
				(this && this.__createBinding) ||
				(Object.create
					? function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							Object.defineProperty(o, k2, {
								enumerable: true,
								get: function () {
									return m[k];
								},
							});
					  }
					: function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							o[k2] = m[k];
					  });
			var __setModuleDefault =
				(this && this.__setModuleDefault) ||
				(Object.create
					? function (o, v) {
							Object.defineProperty(o, "default", { enumerable: true, value: v });
					  }
					: function (o, v) {
							o["default"] = v;
					  });
			var __importStar =
				(this && this.__importStar) ||
				function (mod) {
					if (mod && mod.__esModule) return mod;
					var result = {};
					if (mod != null)
						for (var k in mod)
							if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
								__createBinding(result, mod, k);
					__setModuleDefault(result, mod);
					return result;
				};
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importStar(__webpack_require__(804));
			const TBHttpRequest_1 = __importDefault(__webpack_require__(259));
			const modal_tabs_goods_push_1 = __importDefault(__webpack_require__(128));
			const tb_item_goods_1 = __importDefault(__webpack_require__(23));
			const pagination_1 = __importDefault(__webpack_require__(503));
			const config_1 = __webpack_require__(913);
			const Component = ({ tabs, autoToggleTitle }) => {
				const [tabIndex, setTabIndex] = react_1.useState(0);
				const [items, setItems] = react_1.useState(
					tabs.map((v) => {
						return {
							page_no: v.params.page_no,
							maxPageIndex: 40,
							data: new Array(),
							state: "undone",
						};
					})
				);
				const [current, setCurrent] = react_1.useState();
				const request = async (index, params) => {
					try {
						const [tab, item] = [tabs[index], items[index]];
						item.state = "loading";
						setCurrent(item);
						const res = await TBHttpRequest_1.default.get(tab.url, {
							params: Object.assign({ adzone_id: config_1.ADZONE_ID }, tab.params, params),
						});
						if (
							res.data &&
							res.data.success &&
							res.data.result_list &&
							res.data.result_list.map_data?.length
						) {
							item.data.push(...res.data.result_list.map_data);
							item.state = "undone";
							if (item.page_no >= item.maxPageIndex) {
								item.state = "done";
							}
							setItems(items);
							return { ...item };
						}
						item.state = "done";
						return { ...item };
					} catch (e) {
						console.log(e);
					}
				};
				const onChangeTab = (index) => {
					const target = items[index];
					if (target.data?.length) {
						setCurrent(target);
					} else {
						request(index, { page_no: target.page_no }).then((result) => {
							setCurrent(result);
						});
					}
					setTabIndex(index);
				};
				const onChangePage = () => {
					items[tabIndex]["page_no"] += 1;
					request(tabIndex, { page_no: items[tabIndex]["page_no"] }).then((result) => {
						setCurrent(result);
					});
				};
				return react_1.default.createElement(
					modal_tabs_goods_push_1.default,
					{
						autoToggleTitle: autoToggleTitle,
						tabs: tabs.map((v) => v.label),
						onLoading: (i) => onChangeTab(i),
						onChange: (i) => onChangeTab(i),
					},
					react_1.default.createElement(tb_item_goods_1.default, { data: current?.data }),
					!current || current.state == "done"
						? null
						: react_1.default.createElement(pagination_1.default, {
								loading: current.state == "loading",
								onClick: () => onChangePage(),
						  })
				);
			};
			exports.default = Component;

			/***/
		},

		/***/ 176: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __createBinding =
				(this && this.__createBinding) ||
				(Object.create
					? function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							Object.defineProperty(o, k2, {
								enumerable: true,
								get: function () {
									return m[k];
								},
							});
					  }
					: function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							o[k2] = m[k];
					  });
			var __setModuleDefault =
				(this && this.__setModuleDefault) ||
				(Object.create
					? function (o, v) {
							Object.defineProperty(o, "default", { enumerable: true, value: v });
					  }
					: function (o, v) {
							o["default"] = v;
					  });
			var __importStar =
				(this && this.__importStar) ||
				function (mod) {
					if (mod && mod.__esModule) return mod;
					var result = {};
					if (mod != null)
						for (var k in mod)
							if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
								__createBinding(result, mod, k);
					__setModuleDefault(result, mod);
					return result;
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importStar(__webpack_require__(804));
			const core_1 = __webpack_require__(657);
			function getItem() {
				const result = window.localStorage.getItem("protocol");
				return result ? JSON.parse(result) : false;
			}
			function setItem(value) {
				try {
					window.localStorage.setItem("protocol", JSON.stringify(value));
				} catch (e) {
					window.localStorage.clear();
					window.localStorage.setItem("protocol", JSON.stringify(value));
				}
			}
			const Component = (props) => {
				const [open, setOpen] = react_1.useState(false);
				const [checked, setChecked] = react_1.useState(true);
				const handleClose = () => {
					setOpen(false);
				};
				const handleClick = (event) => {
					const protocol = getItem();
					if (!props.show || protocol) {
						if (props.href) {
							return window.open(props.href, props.target);
						}
						return props.onClick && props.onClick(event);
					}
					setOpen(true);
				};
				const handleAgree = (event) => {
					setItem(checked);
					setOpen(false);
					if (props.href) {
						return window.open(props.href, props.target);
					}
					return props.onClick && props.onClick(event);
				};
				const handleChange = (event) => {
					setChecked(event.target.checked);
				};
				return react_1.default.createElement(
					react_1.default.Fragment,
					null,
					react_1.default.createElement(
						"a",
						{
							className: props.className,
							rel: "noopener noreferrer",
							onClick: handleClick,
							style: Object.assign({ cursor: "pointer", textDecoration: "none" }, props.style),
						},
						props.children
					),
					react_1.default.createElement(
						core_1.Dialog,
						{ style: { zIndex: 99999999 + 1 }, open: open, onClose: handleClose, maxWidth: "sm" },
						react_1.default.createElement(
							core_1.DialogContent,
							null,
							react_1.default.createElement(
								core_1.DialogContentText,
								{ id: "alert-dialog-description" },
								"\u5F53\u524D\u70B9\u51FB\u5C06\u8DF3\u8F6C\u81F3",
								props.union,
								"\u94FE\u63A5\uFF0C\u6211\u4EEC\u627F\u8BFA\u8BE5\u8DF3\u8F6C\u5BF9\u8D2D\u7269\u6CA1\u6709\u4EFB\u4F55\u5F71\u54CD\u3002\u60A8\u662F\u5426\u540C\u610F\uFF1F",
								react_1.default.createElement("br", null)
							)
						),
						react_1.default.createElement(
							core_1.DialogActions,
							null,
							react_1.default.createElement(
								"div",
								{ style: { display: "flex", flex: "1", alignItems: "center" } },
								react_1.default.createElement(
									"div",
									{ style: { color: "rgba(0, 0, 0, 0.54)" } },
									react_1.default.createElement(core_1.Checkbox, {
										checked: checked,
										color: "primary",
										inputProps: { "aria-label": "indeterminate checkbox" },
										onChange: handleChange,
									}),
									"\u4E0B\u6B21\u662F\u5426\u76F4\u63A5\u8BBF\u95EE,\u4E0D\u5728\u5F39\u51FA\u63D0\u793A\uFF1F"
								),
								react_1.default.createElement(
									"div",
									{ style: { marginLeft: "auto" } },
									react_1.default.createElement(
										core_1.Button,
										{
											variant: "contained",
											style: { marginRight: "20px" },
											onClick: handleAgree,
											autoFocus: true,
											color: "primary",
										},
										"\u540C\u610F"
									),
									react_1.default.createElement(
										core_1.Button,
										{ variant: "outlined", onClick: handleClose },
										"\u53D6\u6D88"
									)
								)
							)
						)
					)
				);
			};
			exports.default = Component;

			/***/
		},

		/***/ 913: /***/ (__unused_webpack_module, exports) => {
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.jd_pid =
				exports.jd_position_id =
				exports.jd_site_id =
				exports.JD_AES_SECRET_KEY =
				exports.TB_AES_SECRET_KEY =
				exports.ADZONE_ID =
				exports.is_360 =
				exports.iframeName =
				exports.KEY_SECRET =
				exports.iframeURL =
				exports.wwwroot =
				exports.version =
				exports.baseUrl =
					void 0;
			exports.baseUrl = {
				jd: "https://www.zhuamimi.cn/v3",
				tb: "https://www.24tao.net/v3",
			};
			exports.version = "3.1.9";
			exports.wwwroot = "https://www.24tao.net";
			exports.iframeURL = `https://tampermonkey.lhyhq.cn/iframe.html`;
			exports.KEY_SECRET = "api.lhyhq.cn";
			exports.iframeName = "iframe-name-9527";
			exports.is_360 = false;
			exports.ADZONE_ID = "111397100201";
			exports.TB_AES_SECRET_KEY =
				"U2FsdGVkX19Hq18uEcZ9DZS3brf6hiISppL5kOdkwRZnV4tZg232Xnmlp32J8IORQxitf67ialO/he8zGKgrU59hRPf9qzf4I9qbzQieLg53g6eWJC5rnl9eMchYZ2ONdWx0MAf6PBLfJ+iRG6gxfka0gwEDe5lxsZqIh5EDvvq9hexxME677Uzo99XNhj0E";
			exports.JD_AES_SECRET_KEY =
				"U2FsdGVkX18E952dfysVPf9MUfCcTO2NI1AJ04YIxcMqsn/5nv/Te2BJ+x6uq+UuMwtkzcJZSeXrl5dx9q2g4yLqKCd8LvKC3k26nfbX/bbDlRugwzc6QRdiLhMGQDJMMox5ksqG3OGi/5K72AWEvXNTJ/537pChD2LMzY1YmGcvD4VTbdOI//ZSy8ikpgCuHfrG8Djq4FOLcp+EqNWK5g==";
			exports.jd_site_id = "4000207880";
			exports.jd_position_id = "3002582676";
			exports.jd_pid = "1002977806_4000207880_3002582676";

			/***/
		},

		/***/ 249: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importDefault(__webpack_require__(804));
			const jd_hover_history_price_1 = __importDefault(__webpack_require__(344));
			const core_1 = __webpack_require__(657);
			const jd_modal_goods_push_1 = __importDefault(__webpack_require__(111));
			const jd_goods_coupon_1 = __importDefault(__webpack_require__(836));
			const JDHttpRequest_1 = __webpack_require__(948);
			const jd_goods_lijin_1 = __importDefault(__webpack_require__(687));
			const activity_push_1 = __importDefault(__webpack_require__(665));
			const useStyles = core_1.makeStyles((theme) =>
				core_1.createStyles({
					root: {
						display: "flex",
						flexWrap: "wrap",
						position: "relative",
						"& > *": {
							margin: "0 5px 5px 0",
							"&:last-child": {
								marginRight: "0",
							},
						},
					},
				})
			);
			const App = (props) => {
				const classes = useStyles();
				const servercfg = JDHttpRequest_1.useGetRequest("server");
				const columns = JDHttpRequest_1.useGetColumns("static/jd_push_column.json");
				const goods = JDHttpRequest_1.useGetRequest("jd.goods.promotiongoodsinfo.query", {
					params: {
						skuIds: props.skuid,
					},
				});
				return react_1.default.createElement(
					"div",
					{ className: classes.root },
					react_1.default.createElement(jd_goods_coupon_1.default, {
						width: props.width,
						skuid: props.skuid,
					}),
					servercfg && goods && goods.data?.length
						? react_1.default.createElement(jd_goods_lijin_1.default, {
								open: servercfg.jd_linji_state,
								lhq_lijin: goods.data[0].lhq_lijin,
								lhq_secret: goods.data[0].lhq_secret,
								materialUrl: goods.data[0].materialUrl,
						  })
						: null,
					goods
						? react_1.default.createElement(jd_hover_history_price_1.default, {
								width: props.width,
								length: props.histroy,
								item_id: props.skuid,
						  })
						: null,
					columns.length
						? react_1.default.createElement(jd_modal_goods_push_1.default, {
								tabs: columns,
								autoToggleTitle: true,
						  })
						: null,
					react_1.default.createElement(activity_push_1.default, { type: "jd" })
				);
			};
			exports.default = App;

			/***/
		},

		/***/ 814: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importDefault(__webpack_require__(804));
			const core_1 = __webpack_require__(657);
			const activity_push_1 = __importDefault(__webpack_require__(665));
			const TBHttpRequest_1 = __webpack_require__(259);
			const tb_modal_goods_push_1 = __importDefault(__webpack_require__(807));
			const tb_goods_coupon_1 = __importDefault(__webpack_require__(783));
			const tb_hover_history_price_1 = __importDefault(__webpack_require__(447));
			const useStyles = core_1.makeStyles((theme) =>
				core_1.createStyles({
					root: {
						display: "flex",
						flexWrap: "wrap",
						position: "relative",
						"& > *": {
							margin: "0 5px 5px 0",
							"&:last-child": {
								marginRight: "0",
							},
						},
					},
				})
			);
			const App = (props) => {
				const classes = useStyles();
				const columns = TBHttpRequest_1.useGetColumns("static/tb_push_column.json");
				const servercfg = TBHttpRequest_1.useGetRequest("server");
				return react_1.default.createElement(
					"div",
					{ className: classes.root },
					servercfg
						? react_1.default.createElement(tb_goods_coupon_1.default, {
								lijin: servercfg.tb_lijin_state,
								item_id: props.num_iid,
								title: props.title,
						  })
						: null,
					react_1.default.createElement(tb_hover_history_price_1.default, {
						length: props.histroy,
						num_iid: props.num_iid,
						width: props.width,
					}),
					columns.length
						? react_1.default.createElement(tb_modal_goods_push_1.default, {
								tabs: columns.map((v) => {
									if (v.params.material_id == "13256") {
										v.params.item_id = props.num_iid;
									}
									return v;
								}),
								autoToggleTitle: true,
						  })
						: null,
					react_1.default.createElement(activity_push_1.default, { type: "tb" })
				);
			};
			exports.default = App;

			/***/
		},

		/***/ 154: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			const react_1 = __importDefault(__webpack_require__(804));
			const core_1 = __webpack_require__(657);
			const TBHttpRequest_1 = __webpack_require__(259);
			const tb_modal_goods_push_1 = __importDefault(__webpack_require__(807));
			const tb_goods_coupon_1 = __importDefault(__webpack_require__(783));
			const useStyles = core_1.makeStyles((theme) =>
				core_1.createStyles({
					root: {
						display: "inline-flex",
						flexDirection: "column",
						"& > *": {
							margin: "5px 0 0 5px",
						},
					},
				})
			);
			const App = (props) => {
				const classes = useStyles();
				const columns = TBHttpRequest_1.useGetColumns("static/tb_push_column.json");
				const servercfg = TBHttpRequest_1.useGetRequest("server");
				return react_1.default.createElement(
					"div",
					{ className: classes.root },
					servercfg
						? react_1.default.createElement(tb_goods_coupon_1.default, {
								lijin: servercfg.tb_lijin_state,
								item_id: props.num_iid,
								title: props.title,
						  })
						: null,
					columns.length
						? react_1.default.createElement(tb_modal_goods_push_1.default, {
								tabs: columns.map((v) => {
									if (v.params.material_id == "13256") {
										v.params.item_id = props.num_iid;
									}
									return v;
								}),
								autoToggleTitle: false,
						  })
						: null
				);
			};
			exports.default = App;

			/***/
		},

		/***/ 948: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.useGetColumns = exports.useGetRequest = void 0;
			const axios_1 = __importDefault(__webpack_require__(376));
			const react_1 = __webpack_require__(804);
			const config_1 = __webpack_require__(913);
			const functions_1 = __webpack_require__(877);
			const http = axios_1.default.create({
				timeout: 1000 * 30,
				baseURL: config_1.baseUrl.jd,
				params: {
					secret: config_1.JD_AES_SECRET_KEY,
				},
			});
			const retry = (s, config) => {
				return new Promise((resolve, reject) => {
					if (!config.params.retry || config.params.retry < 3) {
						config.params.retry = config.params.retry ? config.params.retry + 1 : 1;
						setTimeout(() => resolve(http.request(config)), s);
					} else {
						reject("请求失败");
					}
				});
			};
			http.interceptors.request.use(async (config) => {
				if (!config.params) config.params = {};
				const userID = await functions_1.uuid();
				const timestamp = Date.now();
				config.params["__v"] = config_1.version;
				config.params["x-me-sign"] = functions_1.sign(config.params, timestamp, userID);
				config.params["x-me-time"] = timestamp;
				config.params["x-me-uuid"] = userID;
				return config;
			});
			http.interceptors.response.use(undefined, (error) => {
				if (!error.response) {
					console.log("没有 response 对象");
					console.log(error);
					return retry(500, error.config);
				}
				return Promise.reject(error);
			});
			const useGetRequest = (url, config) => {
				const [data, setData] = react_1.useState();
				const request = async (url, config) => {
					try {
						const result = await http.get(url, config);
						return result.data;
					} catch (e) {
						console.log(e);
					}
				};
				react_1.useEffect(() => {
					request(url, config).then((result) => setData(result));
				}, []);
				return data;
			};
			exports.useGetRequest = useGetRequest;
			const useGetColumns = (url) => {
				const [columns, setColumns] = react_1.useState([]);
				const request = async (url) => {
					try {
						const item = sessionStorage.getItem("jd_push_column");
						if (item) {
							const parse_item = JSON.parse(item);
							if (Array.isArray(parse_item) && parse_item.length) {
								return parse_item;
							}
						}
						const res = await http.get(url);
						const data = res.data;
						sessionStorage.setItem("jd_push_column", JSON.stringify(data));
						return data;
					} catch (e) {
						sessionStorage.clear();
						console.log(e);
					}
					return [];
				};
				react_1.useEffect(() => {
					request(url).then((r) => setColumns(r));
				}, []);
				return columns;
			};
			exports.useGetColumns = useGetColumns;
			exports.default = http;

			/***/
		},

		/***/ 259: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.useGetColumns = exports.useGetRequest = void 0;
			const axios_1 = __importDefault(__webpack_require__(376));
			const config_1 = __webpack_require__(913);
			const react_1 = __webpack_require__(804);
			const functions_1 = __webpack_require__(877);
			const http = axios_1.default.create({
				timeout: 1000 * 30,
				baseURL: config_1.baseUrl.tb,
				params: {
					secret: config_1.TB_AES_SECRET_KEY,
				},
			});
			const retry = (s, config) => {
				return new Promise((resolve, reject) => {
					if (!config.params.retry || config.params.retry < 3) {
						config.params.retry = config.params.retry ? config.params.retry + 1 : 1;
						setTimeout(() => resolve(http.request(config)), s);
					} else {
						reject("请求失败");
					}
				});
			};
			http.interceptors.request.use(async (config) => {
				if (!config.params) config.params = {};
				const userID = await functions_1.uuid();
				const timestamp = Date.now();
				config.params["__v"] = config_1.version;
				config.params["x-me-sign"] = functions_1.sign(config.params, timestamp, userID);
				config.params["x-me-time"] = timestamp;
				config.params["x-me-uuid"] = userID;
				return config;
			});
			http.interceptors.response.use(
				(res) => {
					if (res.data.code == 15) {
						return retry(500, res.config);
					}
					return res;
				},
				(error) => {
					if (!error.response) {
						console.log("没有 response 对象");
						console.log(error);
						return retry(500, error.config);
					}
					return Promise.reject(error);
				}
			);
			const useGetRequest = (url, config) => {
				const [data, setData] = react_1.useState();
				const request = async (url, config) => {
					try {
						const result = await http.get(url, config);
						return result.data;
					} catch (e) {
						console.log(e);
					}
				};
				react_1.useEffect(() => {
					request(url, config).then((result) => setData(result));
				}, []);
				return data;
			};
			exports.useGetRequest = useGetRequest;
			const useGetColumns = (url) => {
				const [columns, setColumns] = react_1.useState([]);
				const request = async (url) => {
					try {
						const item = sessionStorage.getItem("tb_push_column");
						if (item) {
							const parse_item = JSON.parse(item);
							if (Array.isArray(parse_item) && parse_item.length) {
								return parse_item;
							}
						}
						const res = await http.get(url);
						const data = res.data;
						sessionStorage.setItem("tb_push_column", JSON.stringify(data));
						return data;
					} catch (e) {
						sessionStorage.clear();
						console.log(e);
					}
					return [];
				};
				react_1.useEffect(() => {
					request(url).then((r) => setColumns(r));
				}, []);
				return columns;
			};
			exports.useGetColumns = useGetColumns;
			exports.default = http;

			/***/
		},

		/***/ 963: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.JD_ContextItemPage = void 0;
			const react_1 = __importDefault(__webpack_require__(804));
			const react_dom_1 = __importDefault(__webpack_require__(196));
			const item_jd_com_1 = __importDefault(__webpack_require__(249));
			const functions_1 = __webpack_require__(877);
			function getSkuid(url) {
				const result = /(\d+)\.html/gi.exec(url);
				if (result?.length && result.length > 1) {
					return result[1];
				}
			}
			const JD_ContextItemPage = (href) => {
				const skuid = getSkuid(href);
				const selector = ".itemInfo-wrap .p-choose-wrap";
				const current = document.querySelector(selector);
				const parent = current?.parentElement;
				if (skuid && current && parent) {
					functions_1.appendIframeElement(() => {
						const { width } = current.getBoundingClientRect();
						const custom = document.createElement("div");
						custom.style.margin = "5px 0 10px 0";
						custom.style.position = "relative";
						parent.insertBefore(custom, current);
						react_dom_1.default.render(
							react_1.default.createElement(item_jd_com_1.default, {
								histroy: 180,
								skuid: skuid,
								width: width,
							}),
							custom
						);
					});
				}
			};
			exports.JD_ContextItemPage = JD_ContextItemPage;

			/***/
		},

		/***/ 872: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.TB_ContextItemPage = void 0;
			const react_1 = __importDefault(__webpack_require__(804));
			const react_dom_1 = __importDefault(__webpack_require__(196));
			const item_tb_com_1 = __importDefault(__webpack_require__(814));
			const functions_1 = __webpack_require__(877);
			const insertDom = (num_iid, selectors) => {
				const els = document.querySelectorAll(selectors);
				if (els.length) {
					functions_1.appendIframeElement(() => {
						const container = document.createElement("div");
						container.style.margin = "5px 0 0 0";
						els[0].parentElement?.insertBefore(container, els[0]);
						react_dom_1.default.render(
							react_1.default.createElement(item_tb_com_1.default, {
								histroy: 180,
								width: width(els[0]),
								num_iid: num_iid,
							}),
							container
						);
					});
				}
			};
			const width = (el) => {
				const { width } = el.getBoundingClientRect();
				return width;
			};
			const TB_ContextItemPage = (href) => {
				const url = new URL(href);
				const num_iid = url.searchParams.get("id");
				const selectors = "#J_logistic,#J_DetailMeta .tb-property .tb-meta";
				if (num_iid) insertDom(num_iid, selectors);
			};
			exports.TB_ContextItemPage = TB_ContextItemPage;

			/***/
		},

		/***/ 386: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.JD_ContextSearchPage = void 0;
			const JDHttpRequest_1 = __importDefault(__webpack_require__(948));
			const JD_ContextSearchPage = () => {
				let timerid = 0;
				window.addEventListener("scroll", (e) => {
					if (timerid) return;
					timerid = window.setTimeout(() => {
						const goods = document.querySelectorAll(
							"#J_goodsList .gl-warp .gl-item, #plist .gl-warp .gl-item .item"
						);
						const skuIds = new Array();
						for (let i = 0; i < goods.length; i++) {
							if (!goods[i].getAttribute("data-lhy")) {
								let skuid = goods[i].getAttribute("data-sku");
								if (!skuid) {
									skuid = goods[i].getAttribute("skuid");
									if (skuid) skuid = skuid.replace(/^J_/, "");
								}
								skuid && skuIds.push(skuid);
								goods[i].setAttribute("data-lhy", "1");
							}
						}
						if (skuIds.length) {
							JDHttpRequest_1.default.get("jd.goods.promotiongoodsinfo.query", {
								params: {
									skuIds: skuIds.join(","),
								},
							});
						}
						window.clearTimeout(timerid);
						timerid = 0;
					}, 200);
				});
			};
			exports.JD_ContextSearchPage = JD_ContextSearchPage;

			/***/
		},

		/***/ 281: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.TB_ContextSearchPage = void 0;
			const react_1 = __importDefault(__webpack_require__(804));
			const react_dom_1 = __importDefault(__webpack_require__(196));
			const scroll_watch_1 = __importDefault(__webpack_require__(187));
			const search_tb_com_1 = __importDefault(__webpack_require__(154));
			const functions_1 = __webpack_require__(877);
			function insertElement() {
				const items = document.querySelectorAll("#mainsrp-itemlist .items .item");
				const scroll = new scroll_watch_1.default(items);
				scroll.listener(async (event, el) => {
					const current = el.querySelector(".pic-box-inner a.pic-link");
					if (current) {
						const num_iid = current.getAttribute("data-nid");
						const title = current.querySelector("img")?.getAttribute("alt");
						if (num_iid && title) {
							el.style.position = "relative";
							const container = document.createElement("div");
							container.style.position = "absolute";
							container.style.top = "0px";
							container.style.left = "0px";
							el.appendChild(container);
							react_dom_1.default.render(
								react_1.default.createElement(search_tb_com_1.default, {
									num_iid: num_iid,
									title: title,
								}),
								container
							);
						}
					}
				});
			}
			const watchElement = (root) => {
				const main = document.querySelector(root) ?? document.body;
				const mutation = new MutationObserver((mutations) => {
					for (let i = 0; i < mutations.length; i++) {
						const target = mutations[i].target;
						if (target instanceof HTMLElement && target.id.indexOf("mainsrp-itemlist") != -1) {
							insertElement();
						}
					}
				});
				mutation.observe(main, { subtree: true, childList: true, attributes: true });
			};
			const TB_ContextSearchPage = () => {
				watchElement("#main");
				functions_1.appendIframeElement(() => insertElement());
			};
			exports.TB_ContextSearchPage = TB_ContextSearchPage;

			/***/
		},

		/***/ 402: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.TM_ContextSearchPage = void 0;
			const react_1 = __importDefault(__webpack_require__(804));
			const react_dom_1 = __importDefault(__webpack_require__(196));
			const scroll_watch_1 = __importDefault(__webpack_require__(187));
			const search_tb_com_1 = __importDefault(__webpack_require__(154));
			const functions_1 = __webpack_require__(877);
			function insertElement() {
				const items = document.querySelectorAll("#J_ItemList .product");
				const scroll = new scroll_watch_1.default(items);
				scroll.listener(async (event, el) => {
					const current = el.querySelector(".productTitle a");
					if (current) {
						const num_iid = el.getAttribute("data-id");
						const title = current.getAttribute("title");
						if (num_iid && title) {
							el.style.position = "relative";
							const container = document.createElement("div");
							container.style.position = "absolute";
							container.style.top = "0px";
							container.style.left = "0px";
							el.appendChild(container);
							react_dom_1.default.render(
								react_1.default.createElement(search_tb_com_1.default, {
									num_iid: num_iid,
									title: title,
								}),
								container
							);
						}
					}
				});
			}
			const TM_ContextSearchPage = () => {
				functions_1.appendIframeElement(() => insertElement());
			};
			exports.TM_ContextSearchPage = TM_ContextSearchPage;

			/***/
		},

		/***/ 499: /***/ (__unused_webpack_module, exports, __webpack_require__) => {
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.iframeName = void 0;
			const config_1 = __webpack_require__(913);
			Object.defineProperty(exports, "iframeName", {
				enumerable: true,
				get: function () {
					return config_1.iframeName;
				},
			});
			class CrossIframeStore {
				sendGetItem(item_id, type) {
					const iframe = this.iframe;
					iframe?.contentWindow?.postMessage(
						{
							name: config_1.iframeName,
							type: type,
							action: "get",
							item_id: item_id,
						},
						config_1.iframeURL
					);
				}
				sendSetItem(item_id, type, data) {
					const iframe = this.iframe;
					iframe?.contentWindow?.postMessage(
						{
							name: config_1.iframeName,
							type: type,
							action: "set",
							item_id: item_id,
							data,
						},
						config_1.iframeURL
					);
				}
				get iframe() {
					return document.querySelector(`iframe[name=${config_1.iframeName}]`);
				}
			}
			exports.default = new CrossIframeStore();

			/***/
		},

		/***/ 877: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __importDefault =
				(this && this.__importDefault) ||
				function (mod) {
					return mod && mod.__esModule ? mod : { default: mod };
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.appendIframeElement =
				exports.randomInt =
				exports.params_stringify_sign =
				exports.sign =
				exports.uuid =
					void 0;
			const uuid_1 = __webpack_require__(231);
			const config_1 = __webpack_require__(913);
			const md5_1 = __importDefault(__webpack_require__(420));
			const uuid = () => {
				let result = localStorage.getItem("lhyhquuid");
				if (!result) {
					result = uuid_1.v4();
					localStorage.setItem("lhyhquuid", result);
				}
				return result;
			};
			exports.uuid = uuid;
			const sign = (params, timestamp, uuid) => {
				const arr = [config_1.KEY_SECRET];
				for (let key in params) {
					params[key] && arr.push(key, params[key]);
				}
				arr.sort();
				return md5_1.default(md5_1.default(arr.join("-") + md5_1.default(timestamp + "")) + uuid);
			};
			exports.sign = sign;
			const params_stringify_sign = async (o) => {
				const user_id = await exports.uuid();
				const timestamp = Date.now();
				const params = Object.assign({}, o, {
					"x-me-sign": exports.sign(o, timestamp, user_id),
					"x-me-time": timestamp,
					"x-me-uuid": user_id,
				});
				let result = new Array();
				for (let [key, value] of Object.entries(params)) {
					result.push(`${key}=${value}`);
				}
				return result.join("&");
			};
			exports.params_stringify_sign = params_stringify_sign;
			function randomInt(min, max) {
				min = Math.ceil(min);
				max = Math.floor(max);
				return Math.floor(Math.random() * (max - min)) + min;
			}
			exports.randomInt = randomInt;
			const appendIframeElement = (callback) => {
				const iframe = document.createElement("iframe");
				iframe.src = config_1.iframeURL;
				iframe.name = config_1.iframeName;
				iframe.title = "stroe";
				iframe.style.display = "none";
				iframe.style.position = "absolute";
				iframe.style.top = "-9999px";
				iframe.style.left = "-9999px";
				iframe.onload = (e) => {
					if (typeof callback == "function") {
						callback(e);
					}
				};
				document.body.appendChild(iframe);
			};
			exports.appendIframeElement = appendIframeElement;

			/***/
		},

		/***/ 181: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __createBinding =
				(this && this.__createBinding) ||
				(Object.create
					? function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							Object.defineProperty(o, k2, {
								enumerable: true,
								get: function () {
									return m[k];
								},
							});
					  }
					: function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							o[k2] = m[k];
					  });
			var __setModuleDefault =
				(this && this.__setModuleDefault) ||
				(Object.create
					? function (o, v) {
							Object.defineProperty(o, "default", { enumerable: true, value: v });
					  }
					: function (o, v) {
							o["default"] = v;
					  });
			var __importStar =
				(this && this.__importStar) ||
				function (mod) {
					if (mod && mod.__esModule) return mod;
					var result = {};
					if (mod != null)
						for (var k in mod)
							if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
								__createBinding(result, mod, k);
					__setModuleDefault(result, mod);
					return result;
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.JdGoodsCouponStore = void 0;
			const CrossIframeStore_1 = __importStar(__webpack_require__(499));
			class JdGoodsCouponStore {
				static async getItem(skuid) {
					return new Promise((resolve, reject) => {
						window.addEventListener("message", message);
						CrossIframeStore_1.default.sendGetItem(skuid, "jd");
						function message(e) {
							const data = e.data;
							if (data["name"] == CrossIframeStore_1.iframeName && data["type"] == "jd") {
								resolve(data["data"]);
								window.removeEventListener("message", message);
							}
						}
					});
				}
				static setItem(skuid, ...coupon) {
					CrossIframeStore_1.default.sendSetItem(skuid, "jd", coupon);
				}
			}
			exports.JdGoodsCouponStore = JdGoodsCouponStore;

			/***/
		},

		/***/ 187: /***/ (__unused_webpack_module, exports) => {
			Object.defineProperty(exports, "__esModule", { value: true });
			class ScrollWatch {
				els;
				doc = window.document.documentElement;
				offsetBottom = 100;
				constructor(els) {
					this.els = Array.from(els);
				}
				listener(callback) {
					let interout = null;
					window.addEventListener("scroll", (event) => {
						if (!interout) {
							interout = setTimeout(() => {
								this.els.forEach((v, i) => {
									const top = v.getBoundingClientRect().top;
									if (top - this.doc.clientHeight <= 0) {
										callback(event, v);
										this.els.splice(i, 1);
									}
								});
								interout = clearTimeout(interout);
								interout = 0;
							}, 300);
						}
					});
				}
			}
			exports.default = ScrollWatch;

			/***/
		},

		/***/ 609: /***/ function (__unused_webpack_module, exports, __webpack_require__) {
			var __createBinding =
				(this && this.__createBinding) ||
				(Object.create
					? function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							Object.defineProperty(o, k2, {
								enumerable: true,
								get: function () {
									return m[k];
								},
							});
					  }
					: function (o, m, k, k2) {
							if (k2 === undefined) k2 = k;
							o[k2] = m[k];
					  });
			var __setModuleDefault =
				(this && this.__setModuleDefault) ||
				(Object.create
					? function (o, v) {
							Object.defineProperty(o, "default", { enumerable: true, value: v });
					  }
					: function (o, v) {
							o["default"] = v;
					  });
			var __importStar =
				(this && this.__importStar) ||
				function (mod) {
					if (mod && mod.__esModule) return mod;
					var result = {};
					if (mod != null)
						for (var k in mod)
							if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
								__createBinding(result, mod, k);
					__setModuleDefault(result, mod);
					return result;
				};
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.TbGoodsCouponStore = void 0;
			const CrossIframeStore_1 = __importStar(__webpack_require__(499));
			class TbGoodsCouponStore {
				static async getItem(item_id) {
					return new Promise((resolve, reject) => {
						window.addEventListener("message", message);
						CrossIframeStore_1.default.sendGetItem(item_id, "tb");
						function message(e) {
							const data = e.data;
							if (data["name"] == CrossIframeStore_1.iframeName && data["type"] == "tb") {
								resolve(data["data"]);
								window.removeEventListener("message", message);
							}
						}
					});
				}
				static setItem(item_id, coupon) {
					CrossIframeStore_1.default.sendSetItem(item_id, "tb", coupon);
				}
			}
			exports.TbGoodsCouponStore = TbGoodsCouponStore;

			/***/
		},

		/***/ 420: /***/ (module) => {
			module.exports = MD5;

			/***/
		},

		/***/ 657: /***/ (module) => {
			module.exports = MaterialUI;

			/***/
		},

		/***/ 804: /***/ (module) => {
			module.exports = React;

			/***/
		},

		/***/ 196: /***/ (module) => {
			module.exports = ReactDOM;

			/***/
		},

		/***/ 376: /***/ (module) => {
			module.exports = axios;

			/***/
		},

		/***/ 83: /***/ (module) => {
			module.exports = echarts;

			/***/
		},

		/***/ 231: /***/ (module) => {
			module.exports = uuid;

			/***/
		},

		/******/
	};
	/************************************************************************/
	/******/ // The module cache
	/******/ var __webpack_module_cache__ = {};
	/******/
	/******/ // The require function
	/******/ function __webpack_require__(moduleId) {
		/******/ // Check if module is in cache
		/******/ var cachedModule = __webpack_module_cache__[moduleId];
		/******/ if (cachedModule !== undefined) {
			/******/ return cachedModule.exports;
			/******/
		}
		/******/ // Create a new module (and put it into the cache)
		/******/ var module = (__webpack_module_cache__[moduleId] = {
			/******/ id: moduleId,
			/******/ // no module.loaded needed
			/******/ exports: {},
			/******/
		});
		/******/
		/******/ // Execute the module function
		/******/ __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		/******/
		/******/ // Return the exports of the module
		/******/ return module.exports;
		/******/
	}
	/******/
	/************************************************************************/
	/******/ /* webpack/runtime/compat get default export */
	/******/ (() => {
		/******/ // getDefaultExport function for compatibility with non-harmony modules
		/******/ __webpack_require__.n = (module) => {
			/******/ var getter =
				module && module.__esModule ? /******/ () => module["default"] : /******/ () => module;
			/******/ __webpack_require__.d(getter, { a: getter });
			/******/ return getter;
			/******/
		};
		/******/
	})();
	/******/
	/******/ /* webpack/runtime/define property getters */
	/******/ (() => {
		/******/ // define getter functions for harmony exports
		/******/ __webpack_require__.d = (exports, definition) => {
			/******/ for (var key in definition) {
				/******/ if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
					/******/ Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
					/******/
				}
				/******/
			}
			/******/
		};
		/******/
	})();
	/******/
	/******/ /* webpack/runtime/hasOwnProperty shorthand */
	/******/ (() => {
		/******/ __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
		/******/
	})();
	/******/
	/******/ /* webpack/runtime/make namespace object */
	/******/ (() => {
		/******/ // define __esModule on exports
		/******/ __webpack_require__.r = (exports) => {
			/******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
				/******/ Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
				/******/
			}
			/******/ Object.defineProperty(exports, "__esModule", { value: true });
			/******/
		};
		/******/
	})();
	/******/
	/************************************************************************/
	var __webpack_exports__ = {};
	// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
	(() => {
		var exports = __webpack_exports__;
		var __webpack_unused_export__;

		__webpack_unused_export__ = { value: true };
		const item_jd_com_1 = __webpack_require__(963);
		const item_tb_com_1 = __webpack_require__(872);
		const search_jd_com_1 = __webpack_require__(386);
		const search_tb_com_1 = __webpack_require__(281);
		const search_tm_com_1 = __webpack_require__(402);
		(() => {
			"use strict";
			const content_scripts = [
				{
					matches: ["item.taobao.com", "detail.tmall.com", "detail.tmall.hk"],
					execute: item_tb_com_1.TB_ContextItemPage,
				},
				{
					matches: ["s.taobao.com"],
					execute: search_tb_com_1.TB_ContextSearchPage,
				},
				{
					matches: ["list.tmall.com"],
					execute: search_tm_com_1.TM_ContextSearchPage,
				},
				{
					matches: ["search.jd.com", "search.jd.hk"],
					execute: search_jd_com_1.JD_ContextSearchPage,
				},
				{
					matches: ["item.jd.com", "npcitem.jd.hk"],
					execute: item_jd_com_1.JD_ContextItemPage,
				},
			];
			const url = window.location.href;
			for (let i = 0; i < content_scripts.length; i++) {
				if (validate(url, ...content_scripts[i]["matches"])) {
					content_scripts[i]["execute"](url);
				}
			}
			function validate(href, ...matches) {
				const url = new URL(href);
				for (let i = 0; i < matches.length; i++) {
					const r = new RegExp(matches[i], "i");
					if (r.test(url.hostname)) return true;
				}
				return false;
			}
		})();
	})();

	/******/
})();
