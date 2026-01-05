// ==UserScript==
// @name         NarouRefiner
// @namespace    https://greasyfork.org/ja/users/52455-aosanori8
// @version      0.9
// @description  「小説家になろう」を読みやすく設定
// @author       aosanori8
// @require      https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.js
// @match        http://ncode.syosetu.com/*
// @match        http://novel18.syosetu.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21071/NarouRefiner.user.js
// @updateURL https://update.greasyfork.org/scripts/21071/NarouRefiner.meta.js
// ==/UserScript==


/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="./../typings/index.d.ts" />
	/// <reference path="./NovelView.d.ts" />
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var NovelViewWrapper_1 = __webpack_require__(1);
	var IndexPageWrapper_1 = __webpack_require__(5);
	var InputSize_1 = __webpack_require__(7);
	var InputNumber_1 = __webpack_require__(8);
	var FontSelector_1 = __webpack_require__(9);
	var WordDirectionSelector_1 = __webpack_require__(11);
	var ColorPicker_1 = __webpack_require__(12);
	var ExpandableItem_1 = __webpack_require__(13);
	var SideMenu_1 = __webpack_require__(14);
	var Context_1 = __webpack_require__(15);
	var Constants_1 = __webpack_require__(17);
	var pathParts = location.pathname.split("/").filter(Boolean);
	if (pathParts.length >= 1) {
	    var novelCode = pathParts[0], articleNum = pathParts[1];
	    //////////////////////////////////////////////////////////////////
	    // LocalStorageからグローバル設定、作品設定を読み込む
	    //////////////////////////////////////////////////////////////////
	    var context_1 = new Context_1.default(novelCode, Constants_1.DEFAULT_GLOBAL_SETTINGS, Constants_1.DEFAULT_NOVEL_SETTINGS);
	    // ナビゲーションのスタイルを変更
	    $(".novelview_navi").css({
	        backgroundColor: "#363E44",
	        color: "#EEE"
	    });
	    var Label2 = (function (_super) {
	        __extends(Label2, _super);
	        function Label2() {
	            _super.apply(this, arguments);
	        }
	        Label2.prototype.render = function () {
	            return (React.createElement("div", {style: {
	                padding: "0 5px",
	                fontWeight: "bold",
	                backgroundColor: "#868E94",
	                color: "#E0E0E0",
	                marginBottom: "5px"
	            }}, this.props.children));
	        };
	        return Label2;
	    }(React.Component));
	    var Spacing = (function (_super) {
	        __extends(Spacing, _super);
	        function Spacing() {
	            _super.apply(this, arguments);
	        }
	        Spacing.prototype.render = function () { return (React.createElement("div", {style: { height: this.props.size }})); };
	        return Spacing;
	    }(React.Component));
	    var Spacing1 = (function (_super) {
	        __extends(Spacing1, _super);
	        function Spacing1() {
	            _super.apply(this, arguments);
	        }
	        Spacing1.prototype.render = function () { return (React.createElement(Spacing, {size: "10px"})); };
	        return Spacing1;
	    }(React.Component));
	    var Spacing2 = (function (_super) {
	        __extends(Spacing2, _super);
	        function Spacing2() {
	            _super.apply(this, arguments);
	        }
	        Spacing2.prototype.render = function () { return (React.createElement(Spacing, {size: "5px"})); };
	        return Spacing2;
	    }(React.Component));
	    if ($("#novel_ex").length > 0) {
	        //////////////////////////////////////////////////////////////////
	        // 目次ページ
	        //////////////////////////////////////////////////////////////////
	        var indexBoxWrapper_1 = new IndexPageWrapper_1.default(document.body);
	        // ==== 設定値の読み込み
	        var globalSettings = context_1.getGlobalSettings();
	        var isExpandNaviColor = globalSettings[Constants_1.SETTING_KEY.EXPAND_NAVI.COLOR];
	        var textColor_1 = globalSettings[Constants_1.SETTING_KEY.TEXT_COLOR];
	        var backgroundColor_1 = globalSettings[Constants_1.SETTING_KEY.BACKGROUND_COLOR];
	        // ==== ナビゲーターの構築
	        var customNavi = document.createElement("div");
	        ReactDOM.render(React.createElement(ExpandableItem_1.default, {label: "カラー", expand: isExpandNaviColor, onToggle: function (expand) { return context_1.saveGlobalSetting(Constants_1.SETTING_KEY.EXPAND_NAVI.COLOR, expand); }}, React.createElement(Label2, null, "文字色"), React.createElement(ColorPicker_1.default, {color: textColor_1, onChange: function (color) { return $("#novel_color").css({ "color": color }); }, onChangeComplete: function (color) {
	            indexBoxWrapper_1.changeNovelLayout(color, backgroundColor_1);
	            textColor_1 = color;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.TEXT_COLOR, color);
	        }}), React.createElement(Spacing2, null), React.createElement(Label2, null, "背景色"), React.createElement(ColorPicker_1.default, {color: backgroundColor_1, onChange: function (color) { return $("body").css({ "background-color": color }); }, onChangeComplete: function (color) {
	            indexBoxWrapper_1.changeNovelLayout(textColor_1, color);
	            backgroundColor_1 = color;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.BACKGROUND_COLOR, color);
	        }})), customNavi);
	        $(".novelview_navi").prepend(customNavi);
	        indexBoxWrapper_1.initPage(context_1, textColor_1, backgroundColor_1);
	        indexBoxWrapper_1.changeNovelLayout(textColor_1, backgroundColor_1);
	    }
	    else if ($("#novel_honbun").length > 0) {
	        //////////////////////////////////////////////////////////////////
	        // 本文ページ
	        //////////////////////////////////////////////////////////////////
	        var novelSubtitle = document.querySelector(".novel_subtitle");
	        var novelP = document.querySelector("#novel_p");
	        var novelHonbun = document.querySelector("#novel_honbun");
	        var novelA = document.querySelector("#novel_a");
	        var novelViews_1 = [new NovelViewWrapper_1.default(document.body, novelSubtitle, novelP, novelHonbun, novelA)];
	        // 既読を記録
	        context_1.saveReadSetting(articleNum, new Date().toString());
	        // ==== 設定値の読み込み
	        var globalSettings = context_1.getGlobalSettings();
	        var isExpandNaviColor = globalSettings[Constants_1.SETTING_KEY.EXPAND_NAVI.COLOR];
	        var isExpandNaviLayout = globalSettings[Constants_1.SETTING_KEY.EXPAND_NAVI.LAYOUT];
	        var isExpandNaviFont = globalSettings[Constants_1.SETTING_KEY.EXPAND_NAVI.FONT];
	        var isExpandNaviTypeSetting = globalSettings[Constants_1.SETTING_KEY.EXPAND_NAVI.TYPESETTING];
	        var isExpandNaviProportion = globalSettings[Constants_1.SETTING_KEY.EXPAND_NAVI.PROPORTION];
	        var textColor_2 = globalSettings[Constants_1.SETTING_KEY.TEXT_COLOR];
	        var backgroundColor_2 = globalSettings[Constants_1.SETTING_KEY.BACKGROUND_COLOR];
	        var wordDirection_1 = globalSettings[Constants_1.SETTING_KEY.WORD_DIRECTION];
	        var novelWidth_1 = globalSettings[Constants_1.SETTING_KEY.NOVEL_WIDTH];
	        var novelHeight_1 = globalSettings[Constants_1.SETTING_KEY.NOVEL_HEIGHT];
	        var font_1 = globalSettings[Constants_1.SETTING_KEY.FONT];
	        var fontList = globalSettings[Constants_1.SETTING_KEY.FONT_LIST];
	        var fontSize_1 = globalSettings[Constants_1.SETTING_KEY.FONT_SIZE];
	        var fontWeight_1 = globalSettings[Constants_1.SETTING_KEY.FONT_WEIGHT];
	        var letterSpacing_1 = globalSettings[Constants_1.SETTING_KEY.LETTER_SPACING];
	        var lineHeight_1 = globalSettings[Constants_1.SETTING_KEY.LINE_HEIGHT];
	        // let wordSpacing: string = globalSettings[SETTING_KEY.WORD_SPACING];
	        var kanjiMargin_1 = globalSettings[Constants_1.SETTING_KEY.KANJI_SPACING];
	        var kanjiSize_1 = globalSettings[Constants_1.SETTING_KEY.KANJI_SIZE];
	        var katakanaMargin_1 = globalSettings[Constants_1.SETTING_KEY.KATAKANA_SPACING];
	        var katakanaSize_1 = globalSettings[Constants_1.SETTING_KEY.KATAKANA_SIZE];
	        var serifMargin_1 = globalSettings[Constants_1.SETTING_KEY.SERIF_SPACING];
	        var serifSize_1 = globalSettings[Constants_1.SETTING_KEY.SERIF_SIZE];
	        // サイドメニュー構築
	        var allowedAddresses = ["ncode.syosetu.com", "novel18.syosetu.com"];
	        var sideMenu_1;
	        if (allowedAddresses.indexOf(location.host) >= 0) {
	            var sideAddress = location.protocol + "//" + location.host + "/" + novelCode;
	            sideMenu_1 = new SideMenu_1.default(context_1, sideAddress);
	            document.addEventListener("mousemove", function (event) {
	                if (event.pageX < 10 && !sideMenu_1.isSideMenuOpened) {
	                    sideMenu_1.showSideMenu(textColor_2, backgroundColor_2);
	                }
	                else if (event.pageX > SideMenu_1.default.MENU_SIZE && sideMenu_1.isSideMenuOpened) {
	                    sideMenu_1.closeSideMenu();
	                }
	            });
	        }
	        // ==== ナビゲーターの構築
	        var customRelatedNovelContainer = document.createElement("div");
	        ReactDOM.render(React.createElement("div", null, React.createElement(ExpandableItem_1.default, {label: "カラー", expand: isExpandNaviColor, onToggle: function (expand) { return context_1.saveGlobalSetting(Constants_1.SETTING_KEY.EXPAND_NAVI.COLOR, expand); }}, React.createElement(Label2, null, "文字色"), React.createElement(ColorPicker_1.default, {color: textColor_2, onChange: function (color) {
	            for (var _i = 0, novelViews_2 = novelViews_1; _i < novelViews_2.length; _i++) {
	                var novelView = novelViews_2[_i];
	                novelView.changeNovelLayout(color, backgroundColor_2);
	            }
	        }, onChangeComplete: function (color) {
	            for (var _i = 0, novelViews_3 = novelViews_1; _i < novelViews_3.length; _i++) {
	                var novelView = novelViews_3[_i];
	                novelView.changeNovelLayout(color, backgroundColor_2);
	            }
	            if (sideMenu_1) {
	                sideMenu_1.changeNovelLayout(color, backgroundColor_2);
	            }
	            textColor_2 = color;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.TEXT_COLOR, color);
	        }}), React.createElement(Spacing2, null), React.createElement(Label2, null, "背景色"), React.createElement(ColorPicker_1.default, {color: backgroundColor_2, onChange: function (color) {
	            for (var _i = 0, novelViews_4 = novelViews_1; _i < novelViews_4.length; _i++) {
	                var novelView = novelViews_4[_i];
	                novelView.changeNovelLayout(textColor_2, color);
	            }
	        }, onChangeComplete: function (color) {
	            for (var _i = 0, novelViews_5 = novelViews_1; _i < novelViews_5.length; _i++) {
	                var novelView = novelViews_5[_i];
	                novelView.changeNovelLayout(textColor_2, color);
	            }
	            if (sideMenu_1) {
	                sideMenu_1.changeNovelLayout(color, backgroundColor_2);
	            }
	            backgroundColor_2 = color;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.BACKGROUND_COLOR, color);
	        }})), React.createElement(Spacing1, null), React.createElement(ExpandableItem_1.default, {label: "レイアウト", expand: isExpandNaviLayout, onToggle: function (expand) { return context_1.saveGlobalSetting(Constants_1.SETTING_KEY.EXPAND_NAVI.LAYOUT, expand); }}, React.createElement(Label2, null, "字送り・行送り"), React.createElement(WordDirectionSelector_1.default, {wordDirection: wordDirection_1, onChangeWordDirection: function (_wordDirection) {
	            for (var _i = 0, novelViews_6 = novelViews_1; _i < novelViews_6.length; _i++) {
	                var novelView = novelViews_6[_i];
	                novelView.changeWritingMode(_wordDirection, novelHeight_1);
	            }
	            wordDirection_1 = _wordDirection;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.WORD_DIRECTION, _wordDirection);
	        }}), React.createElement(Spacing2, null), React.createElement(Label2, null, "ページ横幅"), React.createElement(InputSize_1.default, {value: novelWidth_1, onChange: function (sizeValue) {
	            for (var _i = 0, novelViews_7 = novelViews_1; _i < novelViews_7.length; _i++) {
	                var novelView = novelViews_7[_i];
	                novelView.changeWidth(sizeValue);
	            }
	            novelWidth_1 = sizeValue;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.NOVEL_WIDTH, sizeValue);
	        }}), React.createElement(Spacing2, null), React.createElement(Label2, null, "ページ縦幅"), React.createElement(InputSize_1.default, {value: novelHeight_1, onChange: function (sizeValue) {
	            for (var _i = 0, novelViews_8 = novelViews_1; _i < novelViews_8.length; _i++) {
	                var novelView = novelViews_8[_i];
	                if ((wordDirection_1).indexOf("vertical") === 0) {
	                    novelView.changeHeight(sizeValue);
	                }
	                else {
	                    novelView.changeHeight("auto");
	                }
	            }
	            novelHeight_1 = sizeValue;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.NOVEL_HEIGHT, sizeValue);
	        }})), React.createElement(Spacing1, null), React.createElement(ExpandableItem_1.default, {label: "フォント", expand: isExpandNaviFont, onToggle: function (expand) { return context_1.saveGlobalSetting(Constants_1.SETTING_KEY.EXPAND_NAVI.FONT, expand); }}, React.createElement(Label2, null, "書体"), React.createElement(FontSelector_1.default, {font: font_1, fontList: fontList, onChangeFontListener: function (selectedFont) {
	            for (var _i = 0, novelViews_9 = novelViews_1; _i < novelViews_9.length; _i++) {
	                var novelView = novelViews_9[_i];
	                novelView.changeFont(selectedFont);
	            }
	            font_1 = selectedFont;
	            context_1.saveGlobalSetting("font", selectedFont);
	        }, onChangeFontListListener: function (fontList) {
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.FONT_LIST, fontList);
	        }}), React.createElement(Spacing2, null), React.createElement(Label2, null, "文字サイズ"), React.createElement(InputSize_1.default, {value: fontSize_1, onChange: function (sizeValue) {
	            for (var _i = 0, novelViews_10 = novelViews_1; _i < novelViews_10.length; _i++) {
	                var novelView = novelViews_10[_i];
	                novelView.changeFontSize(sizeValue);
	            }
	            fontSize_1 = sizeValue;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.FONT_SIZE, sizeValue);
	        }}), React.createElement(Spacing2, null), React.createElement(Label2, null, "文字ウェイト"), React.createElement(InputNumber_1.default, {min: 100, max: 1000, step: 100, value: fontWeight_1, onChange: function (sizeValue) {
	            for (var _i = 0, novelViews_11 = novelViews_1; _i < novelViews_11.length; _i++) {
	                var novelView = novelViews_11[_i];
	                novelView.changeFontWeight("" + sizeValue);
	            }
	            fontWeight_1 = sizeValue;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.FONT_WEIGHT, sizeValue);
	        }})), React.createElement(Spacing1, null), React.createElement(ExpandableItem_1.default, {label: "文字組み", expand: isExpandNaviTypeSetting, onToggle: function (expand) { return context_1.saveGlobalSetting(Constants_1.SETTING_KEY.EXPAND_NAVI.TYPESETTING, expand); }}, React.createElement(Label2, null, "文字間隔"), React.createElement(InputSize_1.default, {value: letterSpacing_1, onChange: function (sizeValue) {
	            for (var _i = 0, novelViews_12 = novelViews_1; _i < novelViews_12.length; _i++) {
	                var novelView = novelViews_12[_i];
	                novelView.changeLetterSpacing(sizeValue);
	            }
	            letterSpacing_1 = sizeValue;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.LETTER_SPACING, sizeValue);
	        }}), React.createElement(Spacing2, null), React.createElement(Label2, null, "行間隔"), React.createElement(InputSize_1.default, {min: 0, max: 500, step: 1, value: lineHeight_1, onChange: function (sizeValue) {
	            for (var _i = 0, novelViews_13 = novelViews_1; _i < novelViews_13.length; _i++) {
	                var novelView = novelViews_13[_i];
	                novelView.changeLineHeight(sizeValue);
	            }
	            lineHeight_1 = sizeValue;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.LINE_HEIGHT, sizeValue);
	        }})), React.createElement(Spacing1, null), React.createElement(ExpandableItem_1.default, {label: "プロポーション", expand: isExpandNaviProportion, onToggle: function (expand) { return context_1.saveGlobalSetting(Constants_1.SETTING_KEY.EXPAND_NAVI.PROPORTION, expand); }}, React.createElement(Label2, null, "漢字マージン"), React.createElement(InputSize_1.default, {min: 0, max: 200, step: 1, value: kanjiMargin_1, onChange: function (sizeValue) {
	            for (var _i = 0, novelViews_14 = novelViews_1; _i < novelViews_14.length; _i++) {
	                var novelView = novelViews_14[_i];
	                novelView.changeKanjiMargin(sizeValue);
	            }
	            kanjiMargin_1 = sizeValue;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.KANJI_SPACING, sizeValue);
	        }}), React.createElement(Spacing2, null), React.createElement(Label2, null, "漢字サイズ"), React.createElement(InputSize_1.default, {min: 0, max: 200, step: 1, value: kanjiSize_1, onChange: function (sizeValue) {
	            for (var _i = 0, novelViews_15 = novelViews_1; _i < novelViews_15.length; _i++) {
	                var novelView = novelViews_15[_i];
	                novelView.changeKanjiSize(sizeValue);
	            }
	            kanjiSize_1 = sizeValue;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.KANJI_SIZE, sizeValue);
	        }}), React.createElement(Spacing2, null), React.createElement(Label2, null, "カタカナマージン"), React.createElement(InputSize_1.default, {min: 0, max: 200, step: 1, value: katakanaMargin_1, onChange: function (sizeValue) {
	            for (var _i = 0, novelViews_16 = novelViews_1; _i < novelViews_16.length; _i++) {
	                var novelView = novelViews_16[_i];
	                novelView.changeKatakanaMargin(sizeValue);
	            }
	            katakanaMargin_1 = sizeValue;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.KATAKANA_SPACING, sizeValue);
	        }}), React.createElement(Spacing2, null), React.createElement(Label2, null, "カタカナサイズ"), React.createElement(InputSize_1.default, {min: 0, max: 200, step: 1, value: katakanaSize_1, onChange: function (sizeValue) {
	            for (var _i = 0, novelViews_17 = novelViews_1; _i < novelViews_17.length; _i++) {
	                var novelView = novelViews_17[_i];
	                novelView.changeKatakanaSize(sizeValue);
	            }
	            katakanaSize_1 = sizeValue;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.KATAKANA_SIZE, sizeValue);
	        }}), React.createElement(Spacing2, null), React.createElement(Label2, null, "セリフマージン"), React.createElement(InputSize_1.default, {min: 0, max: 200, step: 1, value: serifMargin_1, onChange: function (sizeValue) {
	            for (var _i = 0, novelViews_18 = novelViews_1; _i < novelViews_18.length; _i++) {
	                var novelView = novelViews_18[_i];
	                novelView.changeSerifMargin(sizeValue);
	            }
	            serifMargin_1 = sizeValue;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.SERIF_SPACING, sizeValue);
	        }}), React.createElement(Spacing2, null), React.createElement(Label2, null, "セリフサイズ"), React.createElement(InputSize_1.default, {min: 0, max: 200, step: 1, value: serifSize_1, onChange: function (sizeValue) {
	            for (var _i = 0, novelViews_19 = novelViews_1; _i < novelViews_19.length; _i++) {
	                var novelView = novelViews_19[_i];
	                novelView.changeSerifSize(sizeValue);
	            }
	            serifSize_1 = sizeValue;
	            context_1.saveGlobalSetting(Constants_1.SETTING_KEY.SERIF_SIZE, sizeValue);
	        }}))), customRelatedNovelContainer);
	        $(".novelview_navi").prepend(customRelatedNovelContainer);
	        // ==== 文字詰め
	        // ---- 未実装
	        //////////////////////////////////////////////////////////////////
	        // 画面レイアウトを一括で変更するための関数
	        //////////////////////////////////////////////////////////////////
	        var applyStyle_1 = function (novelView) {
	            novelView.changeWritingMode(wordDirection_1, novelHeight_1);
	            novelView.changeWidth(novelWidth_1);
	            if (wordDirection_1.indexOf("vertical") === 0) {
	                novelView.changeHeight(novelHeight_1);
	            }
	            else {
	                novelView.changeHeight("auto");
	            }
	            novelView.changeFont(font_1);
	            novelView.changeFontSize(fontSize_1);
	            novelView.changeFontWeight("" + fontWeight_1);
	            novelView.changeLetterSpacing(letterSpacing_1);
	            novelView.changeLineHeight(lineHeight_1);
	            novelView.changeKanjiMargin(kanjiMargin_1);
	            novelView.changeKanjiSize(kanjiSize_1);
	            novelView.changeKatakanaMargin(katakanaMargin_1);
	            novelView.changeKatakanaSize(katakanaSize_1);
	            novelView.changeSerifMargin(serifMargin_1);
	            novelView.changeSerifSize(serifSize_1);
	            novelView.changeNovelLayout(textColor_2, backgroundColor_2);
	        };
	        //////////////////////////////////////////////////////////////////
	        // 画面レイアウトを適用
	        //////////////////////////////////////////////////////////////////
	        for (var _i = 0, novelViews_20 = novelViews_1; _i < novelViews_20.length; _i++) {
	            var novelView = novelViews_20[_i];
	            applyStyle_1(novelView);
	        }
	        //////////////////////////////////////////////////////////////////
	        // AutoPagerizeによるページロード時の動作
	        //////////////////////////////////////////////////////////////////
	        /**
	         * AutoPagerizeにより読み込まれるページ
	         *
	         * 1. div.novel_bn                      : 先頭のページ送り
	         * 2. p.novel_subtitle                  : タイトル
	         * 3. div#novel_p.novel_view (optional) : 作者コメント欄
	         * 4. div#novel_honbun.novel_view       : 本文
	         * 5. div#novel_a.novel_view (optional) : 作者コメント欄
	         * 6. div.novel_bn                      : 末尾のページ送り
	         */
	        var parseUrl_1 = function (address) {
	            var urlPaser = document.createElement("a");
	            urlPaser.href = address;
	            return urlPaser;
	        };
	        var loadedPages_1 = {};
	        document.body.addEventListener("AutoPagerize_DOMNodeInserted", function (event) {
	            var targetElement = event.target;
	            var loadedPageAddress = event.newValue;
	            var _a = parseUrl_1(loadedPageAddress).pathname.split("/").filter(Boolean), loadedArticleNum = _a[1];
	            if (!(loadedArticleNum in loadedPages_1)) {
	                loadedPages_1 = {}; // reset
	                loadedPages_1[loadedArticleNum] = {};
	            }
	            var KEY_TITLE = "novel_subtitle";
	            var KEY_COMMENT_PREVIOUS = "novel_p";
	            var KEY_HONBUN = "novel_honbun";
	            var KEY_COMMENT_AFTER = "novel_a";
	            var KEY_FEED_PAGE = "novel_bn";
	            // console.log("Element", event.target, "RequestURL", (event as any).newValue, "ParentNode", (event as any).relatedNode);
	            if (targetElement.id) {
	                switch (targetElement.id) {
	                    case KEY_COMMENT_PREVIOUS:
	                        loadedPages_1[loadedArticleNum][KEY_COMMENT_PREVIOUS] = targetElement;
	                        break;
	                    case KEY_HONBUN:
	                        context_1.saveReadSetting(loadedArticleNum, new Date().toString());
	                        loadedPages_1[loadedArticleNum][KEY_HONBUN] = targetElement;
	                        break;
	                    case KEY_COMMENT_AFTER:
	                        loadedPages_1[loadedArticleNum][KEY_COMMENT_AFTER] = targetElement;
	                        break;
	                }
	            }
	            else if (targetElement.className) {
	                switch (targetElement.className) {
	                    case KEY_TITLE:
	                        loadedPages_1[loadedArticleNum][KEY_TITLE] = targetElement;
	                        break;
	                    case KEY_FEED_PAGE:
	                        var hasLoadedNovelBn = KEY_FEED_PAGE in loadedPages_1[loadedArticleNum];
	                        if (hasLoadedNovelBn) {
	                            var novelSubtitle_1 = loadedPages_1[loadedArticleNum][KEY_TITLE];
	                            var novelP_1 = loadedPages_1[loadedArticleNum][KEY_COMMENT_PREVIOUS];
	                            var novelHonbun_1 = loadedPages_1[loadedArticleNum][KEY_HONBUN];
	                            var novelA_1 = loadedPages_1[loadedArticleNum][KEY_COMMENT_AFTER];
	                            var novelView = new NovelViewWrapper_1.default(document.body, novelSubtitle_1, novelP_1, novelHonbun_1, novelA_1);
	                            novelViews_1.push(novelView);
	                            applyStyle_1(novelView);
	                        }
	                        else {
	                            loadedPages_1[loadedArticleNum][KEY_FEED_PAGE] = targetElement;
	                        }
	                        break;
	                }
	            }
	        }, false);
	    }
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="./../typings/index.d.ts" />
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var NarouPageWrapper_1 = __webpack_require__(2);
	/**
	 * 作品の1話分を包むクラス
	 *
	 * 各種レイアウトの操作を受け持つ
	 */
	var NovelViewWrapper = (function (_super) {
	    __extends(NovelViewWrapper, _super);
	    function NovelViewWrapper(body, novelSubTitle, novelP, novelView, novelA) {
	        _super.call(this, body);
	        this.$novelSubTitle = $(novelSubTitle);
	        this.$novelP = $(novelP);
	        this.$novelView = $(novelView);
	        this.$novelA = $(novelA);
	        this.$novelP.css({ "margin": "0px", "width": "auto" });
	        this.$novelView.css({ "margin": "0px", "width": "auto" });
	        this.$novelA.css({ "margin": "0px", "width": "auto" });
	        this.$oneNovel = $("<div style=\"margin: 30px auto 50px auto\" />");
	        this.$novelSubTitle.before(this.$oneNovel);
	        this.$oneNovel.append(this.$novelSubTitle);
	        if (this.$novelP.length > 0) {
	            this.$oneNovel.append(this.$novelP);
	        }
	        this.$oneNovel.append(this.$novelView);
	        if (this.$novelA.length > 0) {
	            this.$oneNovel.append(this.$novelA);
	        }
	        this.isCreatedKanjiContainers = false;
	        this.isCreatedKatakanaContainers = false;
	        this.isCreatedSerifContainers = false;
	        // ページの横幅を操作しやすいように設定しておく
	        $(body).find("#container")
	            .find("#novel_contents, #novel_p, #novel_color")
	            .css({ "width": "auto" });
	    }
	    NovelViewWrapper.prototype.createStyleSheet = function () {
	        var styleElement = document.createElement("style");
	        document.head.appendChild(styleElement);
	        return styleElement.sheet;
	    };
	    NovelViewWrapper.prototype.setupKanjiContainers = function () {
	        this.isCreatedKanjiContainers = true;
	        var replacedHtml = "";
	        this.$novelView.contents().each(function (index, element) {
	            if (element.nodeName === "#text") {
	                replacedHtml += element.textContent.replace(NovelViewWrapper.KANJI_PATTERN, "<span class=\"kanji\">$1</span>");
	            }
	            else {
	                replacedHtml += element.outerHTML;
	            }
	        });
	        this.$novelView.html(replacedHtml);
	        this.kanjiMarginCss = this.createStyleSheet();
	        this.kanjiSizeCss = this.createStyleSheet();
	    };
	    NovelViewWrapper.prototype.setupKatakanaContainers = function () {
	        this.isCreatedKatakanaContainers = true;
	        var replacedHtml = "";
	        this.$novelView.contents().each(function (index, element) {
	            if (element.nodeName === "#text") {
	                replacedHtml += element.textContent.replace(NovelViewWrapper.KATAKANA_PATTERN, "<span class=\"katakana\">$1</span>");
	            }
	            else {
	                replacedHtml += element.outerHTML;
	            }
	        });
	        this.$novelView.html(replacedHtml);
	        this.katakanaMarginCss = this.createStyleSheet();
	        this.katakanaSizeCss = this.createStyleSheet();
	    };
	    NovelViewWrapper.prototype.setupSerifContainers = function () {
	        this.isCreatedSerifContainers = true;
	        var replacedHtml = "";
	        this.$novelView.contents().each(function (index, element) {
	            if (element.nodeName === "#text") {
	                replacedHtml += element.textContent.replace(NovelViewWrapper.SERIF_PATTERN, "<span class=\"serif\">$1</span>");
	            }
	            else {
	                replacedHtml += element.outerHTML;
	            }
	        });
	        this.$novelView.html(replacedHtml);
	        this.serifMarginCss = this.createStyleSheet();
	        this.serifSizeCss = this.createStyleSheet();
	    };
	    NovelViewWrapper.prototype.changeFont = function (font) {
	        this.$novelSubTitle.css({ "font-family": font });
	        this.$novelView.css({ "font-family": font });
	    };
	    // 文字サイズを変更
	    NovelViewWrapper.prototype.changeFontSize = function (size) {
	        this.$novelSubTitle.css({ "font-size": size });
	        this.$novelP.css({ "font-size": size });
	        this.$novelView.css({ "font-size": size });
	        this.$novelA.css({ "font-size": size });
	    };
	    NovelViewWrapper.prototype.changeFontWeight = function (weight) {
	        this.$novelSubTitle.css({ "font-weight": weight });
	        this.$novelP.css({ "font-weight": weight });
	        this.$novelView.css({ "font-weight": weight });
	        this.$novelA.css({ "font-weight": weight });
	    };
	    // 行間を変更
	    NovelViewWrapper.prototype.changeLineHeight = function (height) {
	        this.$novelSubTitle.css({ "line-height": height });
	        this.$novelP.css({ "line-height": height });
	        this.$novelView.css({ "line-height": height });
	        this.$novelA.css({ "line-height": height });
	    };
	    // 字間を変更
	    NovelViewWrapper.prototype.changeLetterSpacing = function (spacing) {
	        this.$novelSubTitle.css({ "letter-spacing": spacing });
	        this.$novelP.css({ "letter-spacing": spacing });
	        this.$novelView.css({ "letter-spacing": spacing });
	        this.$novelA.css({ "letter-spacing": spacing });
	    };
	    // 単語の間隔を変更
	    NovelViewWrapper.prototype.changeWordSpacing = function (spacing) {
	        this.$novelView.css({ "word-spacing": spacing });
	        this.$novelP.css({ "word-spacing": spacing });
	        this.$novelSubTitle.css({ "word-spacing": spacing });
	        this.$novelA.css({ "word-spacing": spacing });
	    };
	    // 横幅を変更
	    NovelViewWrapper.prototype.changeWidth = function (width) {
	        this.$oneNovel.css({ "width": width });
	    };
	    // 縦幅を変更
	    NovelViewWrapper.prototype.changeHeight = function (height) {
	        this.$oneNovel.css({ "height": height });
	    };
	    NovelViewWrapper.prototype.changeWritingMode = function (wordDirection, novelHeight) {
	        switch (wordDirection) {
	            case "horizontal-tb":
	                {
	                    this.$oneNovel.css({ "writing-mode": wordDirection, "overflow-x": "auto", height: "auto" });
	                    this.$novelP.css({ "writing-mode": wordDirection, "float": "none", "text-align": "bottom", "width": "auto",
	                        "border-bottom": "3px double #999999", "border-right": "none", "border-left": "none" });
	                    this.$novelSubTitle.css({ "writing-mode": wordDirection, "float": "none" });
	                    this.$novelView.css({ "writing-mode": wordDirection, "float": "none" });
	                    this.$novelA.css({ "writing-mode": wordDirection, "float": "none", "text-align": "bottom", "width": "auto",
	                        "border-top": "3px double #999999", "border-right": "none", "border-left": "none" });
	                }
	                break;
	            case "vertical-rl":
	                {
	                    this.$oneNovel.css({ "writing-mode": wordDirection, "overflow-x": "scroll", height: novelHeight });
	                    this.$novelP.css({ "writing-mode": wordDirection, "float": "right", "text-align": "bottom", "width": "auto",
	                        "border-bottom": "none", "border-right": "none", "border-left": "3px double #999999" });
	                    this.$novelSubTitle.css({ "writing-mode": wordDirection, "float": "right", "text-align": "center" });
	                    this.$novelView.css({ "writing-mode": wordDirection, "float": "right" });
	                    this.$novelA.css({ "writing-mode": wordDirection, "float": "right", "text-align": "bottom", "width": "auto",
	                        "border-top": "none", "border-right": "3px double #999999", "border-left": "none" });
	                }
	                break;
	            case "vertical-lr":
	                {
	                    this.$oneNovel.css({ "writing-mode": wordDirection, "overflow-x": "scroll", height: novelHeight });
	                    this.$novelP.css({ "writing-mode": wordDirection, "float": "left", "text-align": "bottom", "width": "auto",
	                        "border-bottom": "none", "border-right": "3px double #999999", "border-left": "none" });
	                    this.$novelSubTitle.css({ "writing-mode": wordDirection, "float": "left", "text-align": "center" });
	                    this.$novelView.css({ "writing-mode": wordDirection, "float": "left" });
	                    this.$novelA.css({ "writing-mode": wordDirection, "float": "left", "text-align": "bottom", "width": "auto",
	                        "border-top": "none", "border-right": "none", "border-left": "3px double #999999" });
	                }
	                break;
	        }
	    };
	    NovelViewWrapper.prototype.changeKanjiMargin = function (size) {
	        if (size !== "0px" && !this.isCreatedKanjiContainers) {
	            this.setupKanjiContainers();
	        }
	        if (this.isCreatedKanjiContainers) {
	            if (this.kanjiMarginCss.rules.length > 0) {
	                this.kanjiMarginCss.removeRule(this.kanjiMarginCss.rules.length - 1);
	            }
	            this.kanjiMarginCss.insertRule(".kanji { margin: " + size + " }", 0);
	        }
	    };
	    NovelViewWrapper.prototype.changeKanjiSize = function (size) {
	        if (size !== "100%" && !this.isCreatedKanjiContainers) {
	            this.setupKanjiContainers();
	        }
	        if (this.isCreatedKanjiContainers) {
	            if (this.kanjiSizeCss.rules.length > 0) {
	                this.kanjiSizeCss.removeRule(this.kanjiSizeCss.rules.length - 1);
	            }
	            this.kanjiSizeCss.insertRule(".kanji { font-size: " + size + " }", 0);
	        }
	    };
	    NovelViewWrapper.prototype.changeKatakanaMargin = function (size) {
	        if (size !== "0px" && !this.isCreatedKatakanaContainers) {
	            this.setupKatakanaContainers();
	        }
	        if (this.isCreatedKatakanaContainers) {
	            if (this.katakanaMarginCss.rules.length > 0) {
	                this.katakanaMarginCss.removeRule(this.katakanaMarginCss.rules.length - 1);
	            }
	            this.katakanaMarginCss.insertRule(".katakana { margin: " + size + " }", 0);
	        }
	    };
	    NovelViewWrapper.prototype.changeKatakanaSize = function (size) {
	        if (size !== "100%" && !this.isCreatedKatakanaContainers) {
	            this.setupKatakanaContainers();
	        }
	        if (this.isCreatedKatakanaContainers) {
	            if (this.katakanaSizeCss.rules.length > 0) {
	                this.katakanaSizeCss.removeRule(this.katakanaSizeCss.rules.length - 1);
	            }
	            this.katakanaSizeCss.insertRule(".katakana { font-size: " + size + " }", 0);
	        }
	    };
	    NovelViewWrapper.prototype.changeSerifMargin = function (size) {
	        if (size !== "0px" && !this.isCreatedSerifContainers) {
	            this.setupSerifContainers();
	        }
	        if (this.isCreatedSerifContainers) {
	            if (this.serifMarginCss.rules.length > 0) {
	                this.serifMarginCss.removeRule(this.serifMarginCss.rules.length - 1);
	            }
	            this.serifMarginCss.insertRule(".serif { margin: " + size + " }", 0);
	        }
	    };
	    NovelViewWrapper.prototype.changeSerifSize = function (size) {
	        if (size !== "100%" && !this.isCreatedSerifContainers) {
	            this.setupSerifContainers();
	        }
	        if (this.isCreatedSerifContainers) {
	            if (this.serifSizeCss.rules.length > 0) {
	                this.serifSizeCss.removeRule(this.serifSizeCss.rules.length - 1);
	            }
	            this.serifSizeCss.insertRule(".serif { font-size: " + size + " }", 0);
	        }
	    };
	    NovelViewWrapper.prototype.changeNovelLayout = function (textColor, backgroundColor) {
	        _super.prototype.changeNovelLayout.call(this, textColor, backgroundColor);
	        $(this.body).find("#novel_color").css({ "color": textColor });
	    };
	    NovelViewWrapper.KANJI_PATTERN = /((?:[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FCC\uF900-\uFA6D\uFA70-\uFAD9]|[\uD840-\uD868][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|[\uD86A-\uD86C][\uDC00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D])+)/g;
	    NovelViewWrapper.SERIF_PATTERN = /(「[^」]{1,1000}」)/g;
	    NovelViewWrapper.KATAKANA_PATTERN = /([ァ-ンヷヸヹヺヵヶ]+)/g;
	    return NovelViewWrapper;
	}(NarouPageWrapper_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = NovelViewWrapper;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Color_1 = __webpack_require__(3);
	var Utils_1 = __webpack_require__(4);
	var NarouPageWrapper = (function () {
	    function NarouPageWrapper(body) {
	        this.body = body;
	        this.removeDefaultStyles();
	    }
	    NarouPageWrapper.prototype.removeDefaultStyles = function () {
	        // 標準で用意された全てのカスタムレイアウトを解除する
	        var $body = $(this.body);
	        var $novelColor = $body.find("#novel_color");
	        var $novelContents = $body.find("#novel_contents");
	        var $novelSubList = $body.find("dl.novel_sublist2");
	        for (var _i = 0, _a = Utils_1.range(1, 8); _i < _a.length; _i++) {
	            var i = _a[_i];
	            var className = "customlayout" + i;
	            if ($body.hasClass(className)) {
	                $body.removeClass(className);
	            }
	            if ($novelColor.hasClass(className)) {
	                $novelColor.removeClass(className);
	            }
	            if ($novelContents.hasClass(className)) {
	                $novelContents.removeClass(className);
	            }
	            if ($novelSubList.hasClass(className)) {
	                $novelSubList.removeClass(className);
	            }
	        }
	    };
	    NarouPageWrapper.prototype.changeNovelLayout = function (textColor, backgroundColor) {
	        var $body = $(this.body);
	        $body.css({ "background-color": backgroundColor });
	        $body.css({ "color": textColor });
	        var hoverColorHSV = Color_1.RGB.fromString(textColor).toHSV().applyContrasts(40);
	        var hoverColor = hoverColorHSV.toRGB().getColorCode();
	        $("a")
	            .css({ color: textColor, textCecoration: "none", outline: "none" })
	            .hover(function (event) { return $(event.target).css({ color: hoverColor, textCecoration: "none" }); }, function (event) { return $(event.target).css({ color: textColor }); });
	    };
	    return NarouPageWrapper;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = NarouPageWrapper;


/***/ },
/* 3 */
/***/ function(module, exports) {

	/// <reference path="./../typings/index.d.ts" />
	"use strict";
	var RGB = (function () {
	    function RGB(red, green, blue) {
	        this.red = red;
	        this.green = green;
	        this.blue = blue;
	    }
	    RGB.prototype.toHSV = function () {
	        var max = Math.max(this.red, this.green, this.blue);
	        var min = Math.min(this.red, this.green, this.blue);
	        var h;
	        if (this.red === this.green && this.green === this.blue) {
	            h = 0;
	        }
	        else if (max === this.red) {
	            h = HSV.H1 * ((this.green - this.blue) / (max - min));
	        }
	        else if (max === this.green) {
	            h = HSV.H1 * ((this.blue - this.red) / (max - min)) + HSV.H2;
	        }
	        else if (max === this.blue) {
	            h = HSV.H1 * ((this.red - this.green) / (max - min)) + HSV.H4;
	        }
	        else {
	            throw new Error("Internal error.");
	        }
	        h %= HSV.H_MAX;
	        if (h < 0) {
	            h += HSV.H_MAX;
	        }
	        return new HSV(h, (max - min) / max * HSV.SV_MAX, max / RGB.MAX * HSV.SV_MAX);
	    };
	    RGB.fromString = function (str) {
	        if (/^#?[a-f\d]{3,8}$/i.exec(str)) {
	            if (str.indexOf("#") === 0) {
	                str = str.substring(1);
	            }
	            switch (str.length) {
	                case 3: {
	                    var r = str.substring(0, 1);
	                    var g = str.substring(1, 2);
	                    var b = str.substring(2, 3);
	                    return new RGB(parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16));
	                }
	                /* falls through */
	                case 6: {
	                    var r = str.substring(0, 2);
	                    var g = str.substring(2, 4);
	                    var b = str.substring(4, 6);
	                    return new RGB(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16));
	                }
	                /* falls through */
	                default:
	                    throw new Error("Not supported color code type.");
	            }
	        }
	        else {
	            return RGB.fromString(RGB.colourNameToHex(str));
	        }
	    };
	    RGB.colourNameToHex = function (colour) {
	        var colours = {
	            "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff", "beige": "#f5f5dc",
	            "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a",
	            "burlywood": "#deb887", "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50",
	            "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff", "darkblue": "#00008b",
	            "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b",
	            "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f", "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000",
	            "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f",
	            "darkturquoise": "#00ced1", "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969",
	            "dodgerblue": "#1e90ff", "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
	            "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000",
	            "greenyellow": "#adff2f", "honeydew": "#f0fff0", "hotpink": "#ff69b4", "indianred ": "#cd5c5c", "indigo": "#4b0082",
	            "ivory": "#fffff0", "khaki": "#f0e68c", "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00",
	            "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
	            "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa",
	            "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de", "lightyellow": "#ffffe0", "lime": "#00ff00",
	            "limegreen": "#32cd32", "linen": "#faf0e6", "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa",
	            "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371",
	            "mediumslateblue": "#7b68ee", "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585",
	            "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5", "navajowhite": "#ffdead",
	            "navy": "#000080", "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500",
	            "orchid": "#da70d6", "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093",
	            "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6",
	            "purple": "#800080", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1", "saddlebrown": "#8b4513", "salmon": "#fa8072",
	            "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb",
	            "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4", "tan": "#d2b48c",
	            "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0", "violet": "#ee82ee", "wheat": "#f5deb3",
	            "white": "#ffffff", "whitesmoke": "#f5f5f5", "yellow": "#ffff00", "yellowgreen": "#9acd32"
	        };
	        if (typeof colours[colour.toLowerCase()] !== undefined) {
	            return colours[colour.toLowerCase()];
	        }
	        return false;
	    };
	    RGB.prototype.getColorCode = function () {
	        var r = Math.round(this.red).toString(16);
	        var g = Math.round(this.green).toString(16);
	        var b = Math.round(this.blue).toString(16);
	        switch (r.length) {
	            case 0:
	                r = "00";
	                break;
	            case 1:
	                r = "0" + r;
	                break;
	            case 2: break;
	            case 3:
	                r = "FF";
	                break;
	            default: throw new Error("Number format error.");
	        }
	        switch (g.length) {
	            case 0:
	                g = "00";
	                break;
	            case 1:
	                g = "0" + g;
	                break;
	            case 2: break;
	            case 3:
	                g = "FF";
	                break;
	            default: throw new Error("Number format error.");
	        }
	        switch (b.length) {
	            case 0:
	                b = "00";
	                break;
	            case 1:
	                b = "0" + b;
	                break;
	            case 2: break;
	            case 3:
	                b = "FF";
	                break;
	            default: throw new Error("Number format error.");
	        }
	        return "#" + r + g + b;
	    };
	    RGB.prototype.toString = function () {
	        return "rgb(" + Math.round(this.red) + ", " + Math.round(this.green) + ", " + Math.round(this.blue) + ")";
	    };
	    RGB.MIN = 0;
	    RGB.MAX = 255;
	    return RGB;
	}());
	exports.RGB = RGB;
	var HSV = (function () {
	    function HSV(hue, saturation, value) {
	        this.hue = hue;
	        this.saturation = saturation;
	        this.value = value;
	    }
	    HSV.prototype.applyContrasts = function (constract) {
	        if (this.saturation > (HSV.SV_MAX / 2)) {
	            this.saturation -= constract;
	        }
	        else {
	            this.saturation += constract;
	        }
	        if (this.value > (HSV.SV_MAX / 2)) {
	            this.value -= constract;
	        }
	        else {
	            this.value += constract;
	        }
	        return this;
	    };
	    HSV.prototype.toRGB = function () {
	        var hue = this.hue;
	        var hue2 = hue / (HSV.H_MAX / 6);
	        var hue3 = Math.floor(hue2);
	        var max = this.value;
	        var min = max - ((this.saturation / HSV.SV_MAX) * max);
	        if (hue3 < 0 || 5 < hue3) {
	            throw new Error();
	        }
	        switch (hue3) {
	            case 0:
	                return new RGB(max, (hue / HSV.H1) * (max - min) + min, min);
	            case 1:
	                return new RGB(((HSV.H2 - hue) / HSV.H1) * (max - min) + min, max, min);
	            case 2:
	                return new RGB(min, max, ((hue - HSV.H2) / HSV.H1) * (max - min) + min);
	            case 3:
	                return new RGB(min, ((HSV.H4 - hue) / HSV.H1) * (max - min) + min, max);
	            case 4:
	                return new RGB(((hue - HSV.H4) / HSV.H1) * (max - min) + min, min, max);
	            case 5:
	                return new RGB(max, min, ((HSV.H6 - hue) / HSV.H1) * (max - min) + min);
	        }
	    };
	    HSV.prototype.toString = function () {
	        return "hsv(" + Math.round(this.hue) + ", " + Math.round(this.saturation) + ", " + Math.round(this.value) + ")";
	    };
	    HSV.H_MAX = 360;
	    /*  60 */ HSV.H1 = HSV.H_MAX / 6;
	    /* 120 */ HSV.H2 = HSV.H1 * 2;
	    /* 240 */ HSV.H4 = HSV.H1 * 4;
	    /* 360 */ HSV.H6 = HSV.H1 * 6;
	    HSV.SV_MAX = 255;
	    return HSV;
	}());
	exports.HSV = HSV;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/// <reference path="./../typings/index.d.ts" />
	"use strict";
	/// Array[]を生成
	function range(from, to, by) {
	    var array = [];
	    switch (arguments.length) {
	        case 1:
	            to = from;
	            from = 0;
	            break;
	        case 2:
	            if (from < to) {
	                by = 1;
	            }
	            else {
	                by = -1;
	            }
	            break;
	    }
	    if (by > 0) {
	        for (var n = from; n < to; n += by) {
	            array.push(n);
	        }
	    }
	    else {
	        for (var n = from; n > to; n += by) {
	            array.push(n);
	        }
	    }
	    return array;
	}
	exports.range = range;
	;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="./../typings/index.d.ts" />
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var NarouPageWrapper_1 = __webpack_require__(2);
	var IndexBoxWrapper_1 = __webpack_require__(6);
	/**
	 * 連載作品のトップページを操作するためのクラス
	 *
	 */
	var IndexPageWrapper = (function (_super) {
	    __extends(IndexPageWrapper, _super);
	    function IndexPageWrapper(body) {
	        _super.call(this, body);
	        this.indexBoxWrapper = new IndexBoxWrapper_1.default(body.querySelector(".index_box"));
	    }
	    IndexPageWrapper.prototype.initPage = function (context, textColor, backgroundColor) {
	        this.indexBoxWrapper.reconstructToExpandable(context);
	        this.indexBoxWrapper.applyAlreadyRead(context, backgroundColor);
	    };
	    IndexPageWrapper.prototype.changeNovelLayout = function (textColor, backgroundColor) {
	        this.indexBoxWrapper.changeNovelLayout(textColor, backgroundColor);
	        $(document.body).find("#novel_color").css({ "color": textColor });
	        $(document.body).css({ "background-color": backgroundColor });
	    };
	    return IndexPageWrapper;
	}(NarouPageWrapper_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = IndexPageWrapper;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="./../typings/index.d.ts" />
	"use strict";
	var Color_1 = __webpack_require__(3);
	/**
	 * 作品のインデックス部分を操作するためのクラス
	 *
	 * ページ構造
	 * ----
	 * div.index_box
	 *  |-- div.chapter_title
	 *  |    |-- #text: (チャプタータイトル)
	 *  |----+ dl.novel_sublist2
	 *  |    |  |-- dd.subtitle
	 *  |    |  |    |-- a
	 *  |    |  |    |    |-- #text: (サブタイトル)
	 *  |    |  |-- dt.long_update
	 *  |    |  |    |-- #text: (投稿日時)
	 *  |    |  |    |-- span
	 *  |    |  |    |    |-- #text: (
	 *  |    |  |    |    |-- u
	 *  |    |  |    |    |    |-- #text: 改
	 *  |    |  |    |    |-- #text: )
	 *  |    |  |    |    |?
	 *  |    |  |+
	 *  |    |+
	 */
	var IndexBoxWrapper = (function () {
	    function IndexBoxWrapper(indexBox) {
	        this.$indexBox = $(indexBox);
	        this.$allChapterTitles = this.$indexBox.find("div.chapter_title");
	        this.$allSubtitleItem = this.$indexBox.find("dl.novel_sublist2");
	        this.$allSubtitleLabel = this.$allSubtitleItem.find("dd.subtitle");
	        this.$allSubtitleDate = this.$allSubtitleItem.find("dt.long_update");
	        // チャプターを折りたためるようするため、チャプターに属するサブタイをそれぞれのコンテナに詰め込む
	        this.$allChapterTitles.each(function (index, titleElement) {
	            var $subTitles = $(titleElement).nextUntil("div");
	            var $createdContainer = $("<div />", { class: "chapter_container" }).insertAfter(titleElement);
	            $subTitles.appendTo($createdContainer);
	        });
	    }
	    /// 作品の投稿日付をDateにパースする関数
	    // static parseDate(dateString: string): Date {
	    //   const ds = dateString.trim();
	    //   const yi = ds.indexOf("年");
	    //   const mi = ds.indexOf("月");
	    //   const di = ds.indexOf("日");
	    //   const year = parseInt(ds.substring(0, yi).trim());
	    //   const month = parseInt(ds.substring(yi + 1, mi).trim()) - 1; // January is zero
	    //   const day = parseInt(ds.substring(mi + 1, di).trim());
	    //   return new Date(year, month, day);
	    // };
	    /// 保存済みの設定からチャプターの折りたたみを適用しつつ、チャプタータイトルに折りたたみ機能を付ける
	    IndexBoxWrapper.prototype.reconstructToExpandable = function (context) {
	        var novelSettings = context.getNovelSettings();
	        this.$allChapterTitles.each(function (index, chapterTitleElement) {
	            $(chapterTitleElement)
	                .click(function (event) {
	                var $container = $(event.target).next();
	                $container.slideToggle(function () {
	                    novelSettings[index] = ($container.css("display") === "block");
	                    context.saveNovelSetting();
	                });
	            });
	            $(chapterTitleElement).next().toggle(novelSettings[index]);
	        });
	    };
	    /// 読んだことのあるサブタイの色を変える
	    IndexBoxWrapper.prototype.applyAlreadyRead = function (context, backgroundColor) {
	        var alreadyReadColorHSV = Color_1.RGB.fromString(backgroundColor).toHSV().applyContrasts(10);
	        var alreadyReadColor = alreadyReadColorHSV.toRGB().getColorCode();
	        this.$allSubtitleItem.css({ border: "none", "margin": "0px" });
	        this.$allSubtitleLabel.css({ padding: "7px 12px 6px 12px", width: "auto" });
	        var readSettings = context.getReadSettings();
	        // const nowDate = Date.now();
	        this.$allSubtitleItem.each(function (index, element) {
	            var $element = $(element);
	            var anchor = $element.find("dd.subtitle > a")[0];
	            var _a = anchor.pathname.split("/").filter(Boolean), articleNum = _a[1];
	            if (articleNum in readSettings) {
	                // const lastReadDateString = readSettings[articleNum];
	                // ---- 最後に読んだ日より後に更新があった時の処理
	                // const articleUpdateDate = parseDate($(element).find("dt.long_update").text());
	                // const recentReadDate = new Date(lastReadDateString);
	                // recentReadDate.setHours(0);
	                // recentReadDate.setMinutes(0);
	                // recentReadDate.setSeconds(0);
	                // recentReadDate.setMilliseconds(0);
	                // if (recentReadDate.getTime() === articleUpdateDate.getTime()) { // 読んだ日と更新日が同じ
	                // } else 
	                // if (recentReadDate.getTime() < articleUpdateDate.getTime()) {
	                // }
	                $element.css({ "background-color": alreadyReadColor });
	            }
	            else {
	                $element.css({ "font-weight": "bold" });
	            }
	        });
	    };
	    IndexBoxWrapper.prototype.changeNovelLayout = function (textColor, backgroundColor) {
	        var chapterTitleColor = Color_1.RGB.fromString(backgroundColor).toHSV().applyContrasts(20).toRGB().getColorCode();
	        var chapterTitleHoverColor = Color_1.RGB.fromString(chapterTitleColor).toHSV().applyContrasts(20).toRGB().getColorCode();
	        // チャプタータイトルにマウスを乗せた際のハイライト色
	        this.$allChapterTitles.css({
	            backgroundColor: chapterTitleColor,
	            cursor: "pointer",
	            margin: "10px 0 5px 0",
	            padding: "18px 13px 13px 13px" });
	        this.$allChapterTitles.hover(function (event) { return $(event.target).css({ backgroundColor: chapterTitleHoverColor }); }, function (event) { return $(event.target).css({ backgroundColor: chapterTitleColor }); });
	        // リンク色を変える
	        var hoverColorHSV = Color_1.RGB.fromString(textColor).toHSV().applyContrasts(40);
	        var hoverColor = hoverColorHSV.toRGB().getColorCode();
	        $("a")
	            .css({ color: textColor, textCecoration: "none", outline: "none" })
	            .hover(function (event) { return $(event.target).css({ color: hoverColor, textCecoration: "none" }); }, function (event) { return $(event.target).css({ color: textColor }); });
	    };
	    /// サイドメニュー表示用にスタイルを変更
	    IndexBoxWrapper.prototype.stretchIndexBoxesForSideMenu = function () {
	        this.$indexBox.css({ width: "auto" });
	        this.$allSubtitleItem.css({ margin: "5px 10px" });
	        this.$allSubtitleLabel.css({ width: "auto" });
	        this.$allSubtitleDate.css({ width: "auto", display: "none" });
	    };
	    return IndexBoxWrapper;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = IndexBoxWrapper;


/***/ },
/* 7 */
/***/ function(module, exports) {

	/// <reference path="./../../typings/index.d.ts" />
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var sizeUnit = ["%", "px", "pt", "in", "mm", "cm", "em", "rem"];
	var InputSize = (function (_super) {
	    __extends(InputSize, _super);
	    function InputSize() {
	        _super.apply(this, arguments);
	        this.defaultProps = {
	            min: 0,
	            max: 200,
	            step: 1,
	            value: "",
	            unit: "px"
	        };
	        this.state = {
	            sizeValueMin: this.props.min || 1,
	            sizeValueMax: this.props.max || 200,
	            sizeValueStep: this.props.step || 1,
	            sizeValue: this.parseSizeValue(this.props.value),
	            sizeUnit: (this.props.unit || this.parseSizeUnit(this.props.value))
	        };
	    }
	    InputSize.prototype.parseSizeValue = function (sizeString) {
	        if (typeof sizeString === "number") {
	            return sizeString;
	        }
	        else if (typeof sizeString === "string") {
	            var numString = sizeString;
	            if (sizeString) {
	                for (var _i = 0, sizeUnit_1 = sizeUnit; _i < sizeUnit_1.length; _i++) {
	                    var unit = sizeUnit_1[_i];
	                    var index = sizeString.lastIndexOf(unit);
	                    if (index >= 0) {
	                        numString = sizeString.substring(0, index);
	                    }
	                }
	            }
	            return parseFloat(numString) || 0;
	        }
	        else {
	            return 0;
	        }
	    };
	    InputSize.prototype.parseSizeUnit = function (sizeString) {
	        if (typeof sizeString === "string") {
	            var numString = null;
	            if (sizeString) {
	                for (var _i = 0, sizeUnit_2 = sizeUnit; _i < sizeUnit_2.length; _i++) {
	                    var unit = sizeUnit_2[_i];
	                    var index = sizeString.lastIndexOf(unit);
	                    if (index >= 0) {
	                        numString = sizeString.substring(index);
	                    }
	                }
	            }
	            return (numString || "px");
	        }
	        else {
	            return "px";
	        }
	    };
	    InputSize.prototype.onChangeValue = function (event) {
	        var value = parseFloat(event.target.value);
	        if (this.props.onChange && value && this.state.sizeUnit) {
	            this.props.onChange("" + value + this.state.sizeUnit);
	        }
	        this.setState({ sizeValue: value });
	    };
	    InputSize.prototype.onChangeUnit = function (event) {
	        var unit = event.target.value;
	        if (this.props.onChange && this.state.sizeValue && unit) {
	            this.props.onChange("" + this.state.sizeValue + unit);
	        }
	        this.setState({ sizeUnit: unit });
	    };
	    InputSize.prototype.createOptionItem = function (unit, index) {
	        return (React.createElement("option", {key: index, value: unit}, unit));
	    };
	    InputSize.prototype.render = function () {
	        return (React.createElement("div", null, React.createElement("div", {style: { display: "flex", flexWrap: "nowrap" }}, React.createElement("div", {style: { flex: 1 }}, React.createElement("input", {type: "number", style: { width: "100%" }, min: this.state.sizeValueMin, max: this.state.sizeValueMax, step: this.state.sizeValueStep, onChange: this.onChangeValue.bind(this), value: this.state.sizeValue})), React.createElement("div", {style: { marginLeft: "5px" }}, React.createElement("select", {defaultValue: this.state.sizeUnit, onChange: this.onChangeUnit.bind(this)}, sizeUnit.map(this.createOptionItem)))), React.createElement("input", {type: "range", style: { width: "100%" }, min: this.state.sizeValueMin, max: "" + this.state.sizeValueMax, step: this.state.sizeValueStep, onChange: this.onChangeValue.bind(this), value: this.state.sizeValue})));
	    };
	    return InputSize;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = InputSize;


/***/ },
/* 8 */
/***/ function(module, exports) {

	/// <reference path="./../../typings/index.d.ts" />
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var InputNumber = (function (_super) {
	    __extends(InputNumber, _super);
	    function InputNumber() {
	        _super.apply(this, arguments);
	        this.defaultProps = {
	            min: 1,
	            max: 200,
	            step: 1,
	            value: ""
	        };
	        this.state = {
	            sizeValueMin: this.props.min,
	            sizeValueMax: this.props.max,
	            sizeValueStep: this.props.step,
	            sizeValue: this.props.value,
	        };
	    }
	    InputNumber.prototype.onChangeValue = function (event) {
	        var value = parseFloat(event.target.value);
	        if (this.props.onChange && value) {
	            this.props.onChange(value);
	        }
	        this.setState({ sizeValue: value });
	    };
	    InputNumber.prototype.render = function () {
	        return (React.createElement("div", null, React.createElement("div", {style: { display: "flex", width: "100%" }}, React.createElement("div", {style: { flex: 1 }}, React.createElement("input", {type: "number", style: { width: "100%" }, min: this.state.sizeValueMin, max: this.state.sizeValueMax, step: this.state.sizeValueStep, onChange: this.onChangeValue.bind(this), value: this.state.sizeValue}))), React.createElement("input", {type: "range", style: { width: "100%" }, min: this.state.sizeValueMin, max: this.state.sizeValueMax, step: this.state.sizeValueStep, onChange: this.onChangeValue.bind(this), value: this.state.sizeValue})));
	    };
	    return InputNumber;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = InputNumber;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="./../../typings/index.d.ts" />
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var FontDetector_1 = __webpack_require__(10);
	var FontSelector = (function (_super) {
	    __extends(FontSelector, _super);
	    function FontSelector(props) {
	        _super.call(this, props);
	        this.state = {
	            inputFont: "",
	            selectedFont: this.props.font,
	            fontList: this.props.fontList
	        };
	        this.fontDetector = new FontDetector_1.default(document.body);
	    }
	    FontSelector.prototype.addFont = function (fontName) {
	        var fontList = (this.state.fontList) ? this.state.fontList.concat(fontName) : [fontName];
	        this.setState({
	            selectedFont: fontName,
	            fontList: fontList
	        });
	        if (this.props.onChangeFontListener) {
	            this.props.onChangeFontListener(fontName);
	        }
	        if (this.props.onChangeFontListListener) {
	            this.props.onChangeFontListListener(fontList);
	        }
	    };
	    FontSelector.prototype.onKeyPress = function (event) {
	        if (event.which === 13 || event.keyCode === 13) {
	            var inputFont = event.target;
	            var font = inputFont.value;
	            if (this.fontDetector.detect(font)) {
	                this.addFont(font);
	                this.setState({ inputFont: "" });
	                inputFont.value = "";
	                return false;
	            }
	            else {
	                return true;
	            }
	        }
	        else {
	            return true;
	        }
	    };
	    FontSelector.prototype.onClickAdd = function (event) {
	        this.addFont(this.state.selectedFont);
	    };
	    FontSelector.prototype.onClickRemove = function (event) {
	        var _this = this;
	        this.setState({
	            selectedFont: "",
	            fontList: this.state.fontList.filter(function (f) { return f !== _this.state.selectedFont; })
	        });
	        if (this.props.onChangeFontListener) {
	            this.props.onChangeFontListener(this.state.selectedFont);
	        }
	        if (this.props.onChangeFontListListener) {
	            this.props.onChangeFontListListener(this.state.fontList);
	        }
	    };
	    FontSelector.prototype.onInput = function (event) {
	        var inputFont = event.target;
	        var font = inputFont.value;
	        this.setState({ inputFont: font });
	        if (this.fontDetector.detect(font)) {
	            if (this.props.onChangeFontListener) {
	                this.props.onChangeFontListener(font);
	            }
	        }
	    };
	    FontSelector.prototype.onChangeSelectFont = function (event) {
	        var option = event.target;
	        var font = option.value;
	        this.setState({ selectedFont: font });
	        if (this.props.onChangeFontListener) {
	            this.props.onChangeFontListener(font);
	        }
	    };
	    FontSelector.prototype.createOptionItem = function (fontName, index) {
	        var isFontEnabled = this.fontDetector.detect(fontName);
	        return (React.createElement("option", {key: index, value: fontName, style: {
	            paddingLeft: "5px",
	            backgroundColor: isFontEnabled ? "#FFD540" : "lightgray",
	            fontFamily: fontName
	        }}, fontName));
	    };
	    FontSelector.prototype.render = function () {
	        var selectedFont = this.state.selectedFont;
	        var isInputFontEnabled = this.fontDetector.detect(this.state.inputFont);
	        var isFontSelected = (this.state.fontList.indexOf(selectedFont) >= 0);
	        var inputStyle = {
	            width: "100%", marginBottom: "3px",
	            backgroundColor: (isInputFontEnabled ? "#FFD540" : "white")
	        };
	        return (React.createElement("div", null, React.createElement("input", {placeholder: this.state.selectedFont, style: inputStyle, onKeyPress: this.onKeyPress.bind(this), onInput: this.onInput.bind(this)}), React.createElement("div", {style: { display: "flex", width: "100%" }}, React.createElement("button", {style: { flex: 1 }, disabled: !isInputFontEnabled, onClick: this.onClickAdd.bind(this)}, "追加"), React.createElement("button", {style: { flex: 1 }, disabled: !isFontSelected, onClick: this.onClickRemove.bind(this)}, "削除")), React.createElement("select", {style: { width: "100%", marginTop: "3px" }, defaultValue: selectedFont, size: "5", onChange: this.onChangeSelectFont.bind(this)}, this.state.fontList.map(this.createOptionItem.bind(this)))));
	    };
	    return FontSelector;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = FontSelector;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	var FontDetector = (function () {
	    function FontDetector(testField) {
	        this.testField = testField;
	        this.container = document.createElement("span");
	        this.container.style.fontSize = FontDetector.testSize;
	        this.container.innerHTML = FontDetector.testString;
	        this.defaultWidth = {};
	        this.defaultHeight = {};
	        for (var _i = 0, _a = FontDetector.baseFonts; _i < _a.length; _i++) {
	            var font = _a[_i];
	            this.container.style.fontFamily = font;
	            this.testField.appendChild(this.container);
	            this.defaultWidth[font] = this.container.offsetWidth;
	            this.defaultHeight[font] = this.container.offsetHeight;
	            this.testField.removeChild(this.container);
	        }
	    }
	    /// フォントが有効か確認する
	    FontDetector.prototype.detect = function (font) {
	        font = font.trim();
	        if (!font) {
	            return false;
	        }
	        var detected = false;
	        for (var _i = 0, _a = FontDetector.baseFonts; _i < _a.length; _i++) {
	            var baseFont = _a[_i];
	            this.container.style.fontFamily = font + "," + baseFont;
	            this.testField.appendChild(this.container);
	            var matched = (this.container.offsetWidth !== this.defaultWidth[baseFont] ||
	                this.container.offsetHeight !== this.defaultHeight[baseFont]);
	            this.testField.removeChild(this.container);
	            detected = detected || matched;
	        }
	        return detected;
	    };
	    FontDetector.baseFonts = ["monospace", "sans-serif", "serif"];
	    FontDetector.testString = "mmmmmmmmmmlli";
	    FontDetector.testSize = "72px";
	    return FontDetector;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = FontDetector;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="./../../typings/index.d.ts" />
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Utils_1 = __webpack_require__(4);
	var HTB = "horizontal-tb";
	var VRL = "vertical-rl";
	var VLR = "vertical-lr";
	var COLOR_SELECTED = "#FFD540";
	var COLOR_HOVERED = "lightgray";
	var COLOR_TRANSPARENT = "rgba(0, 0, 0, 0)";
	var COLOR_NONE = "white";
	var SIZE = 30;
	/// 字送り・行送りを選択するためのコンポーネント
	var WordDirectionSelector = (function (_super) {
	    __extends(WordDirectionSelector, _super);
	    function WordDirectionSelector() {
	        _super.apply(this, arguments);
	        this.state = {
	            wordDirection: this.props.wordDirection,
	            hovered: null
	        };
	    }
	    WordDirectionSelector.prototype.onChangeWordDirection = function (event) {
	        var wordDirection = event.target.value;
	        this.setState({ wordDirection: wordDirection });
	        this.props.onChangeWordDirection(wordDirection);
	    };
	    WordDirectionSelector.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("div", null, React.createElement("input", {id: "htb", ref: "htb", type: "radio", style: { display: "none" }, name: "wordDirection", value: HTB, onClick: this.onChangeWordDirection.bind(this)}), React.createElement("label", {htmlFor: "htb", onMouseEnter: function () { _this.setState({ hovered: HTB }); }, onMouseLeave: function () { _this.setState({ hovered: null }); }}, React.createElement("span", {style: {
	            width: SIZE + "px", height: SIZE + "px", display: "inline-block",
	            backgroundColor: (this.state.wordDirection === HTB) ? COLOR_SELECTED :
	                (this.state.hovered && this.state.hovered === HTB) ? COLOR_HOVERED :
	                    COLOR_NONE
	        }}, React.createElement("svg", {width: SIZE, height: SIZE, viewbox: "0 0 " + SIZE + " " + SIZE}, React.createElement("defs", null, React.createElement("path", {id: "line1", d: "M 3 0 h 24"})), React.createElement("g", {style: { stroke: "black", fill: COLOR_TRANSPARENT }}, React.createElement("rect", {width: SIZE, height: SIZE}), Utils_1.range(5, 29, +4).map(function (i) { return React.createElement("use", {xlinkHref: "#line1", y: i, key: i}); }))))), React.createElement("input", {id: "vrl", ref: "vrl", type: "radio", style: { display: "none" }, name: "wordDirection", value: VRL, onClick: this.onChangeWordDirection.bind(this)}), React.createElement("label", {htmlFor: "vrl", onMouseEnter: function () { _this.setState({ hovered: VRL }); }, onMouseLeave: function () { _this.setState({ hovered: null }); }}, React.createElement("span", {style: {
	            width: SIZE + "px", height: SIZE + "px", display: "inline-block", marginLeft: "5px",
	            backgroundColor: (this.state.wordDirection === VRL) ? COLOR_SELECTED :
	                (this.state.hovered && this.state.hovered === VRL) ? COLOR_HOVERED :
	                    COLOR_NONE
	        }}, React.createElement("svg", {width: SIZE, height: SIZE, viewbox: "0 0 " + SIZE + " " + SIZE}, React.createElement("defs", null, React.createElement("path", {id: "line2", d: "M 0 3 v 17"})), React.createElement("g", {style: { stroke: "black", fill: COLOR_TRANSPARENT }}, React.createElement("rect", {width: SIZE, height: SIZE}), Utils_1.range(5, 29, +4).map(function (i) { return React.createElement("use", {xlinkHref: "#line2", x: i, key: i}); }), React.createElement("path", {d: "M 3 24 l 3 3 v -6 l -3 3 h 24"}))))), React.createElement("input", {id: "vlr", ref: "vlr", type: "radio", style: { display: "none" }, name: "wordDirection", value: VLR, onClick: this.onChangeWordDirection.bind(this)}), React.createElement("label", {htmlFor: "vlr", onMouseEnter: function () { _this.setState({ hovered: VLR }); }, onMouseLeave: function () { _this.setState({ hovered: null }); }}, React.createElement("span", {style: {
	            width: SIZE + "px", height: SIZE + "px", display: "inline-block", marginLeft: "5px",
	            backgroundColor: (this.state.wordDirection === VLR) ? COLOR_SELECTED :
	                (this.state.hovered && this.state.hovered === VLR) ? COLOR_HOVERED :
	                    COLOR_NONE
	        }}, React.createElement("svg", {width: SIZE, height: SIZE, viewbox: "0 0 " + SIZE + " " + SIZE}, React.createElement("defs", null, React.createElement("path", {id: "line3", d: "M 0 3 v 17"})), React.createElement("g", {style: { stroke: "black", fill: COLOR_TRANSPARENT }}, React.createElement("rect", {width: SIZE, height: SIZE}), Utils_1.range(5, 29, +4).map(function (i) { return React.createElement("use", {xlinkHref: "#line3", x: i, key: i}); }), React.createElement("path", {d: "M 27 24 l -3 3 v -6 l 3 3 h -24"})))))));
	    };
	    return WordDirectionSelector;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = WordDirectionSelector;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="./../../typings/index.d.ts" />
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Color_1 = __webpack_require__(3);
	var ColorPicker = (function (_super) {
	    __extends(ColorPicker, _super);
	    function ColorPicker(props) {
	        _super.call(this, props);
	        if (this.props.color) {
	            var rgb = Color_1.RGB.fromString(this.props.color);
	            var hsv = rgb.toHSV();
	            console.log(this.props.color);
	            console.log(rgb.toString());
	            console.log(hsv.toString());
	            this.state = {
	                pressH: false,
	                pressSV: false,
	                color: this.props.color,
	                saturation: hsv.saturation,
	                value: hsv.value,
	                hue: hsv.hue
	            };
	        }
	        else if (this.props.defaultColor) {
	            var rgb = Color_1.RGB.fromString(this.props.defaultColor);
	            var hsv = rgb.toHSV();
	            this.state = {
	                pressH: false,
	                pressSV: false,
	                color: this.props.defaultColor,
	                saturation: hsv.saturation,
	                value: hsv.value,
	                hue: hsv.hue
	            };
	        }
	        else {
	            this.state = {
	                pressH: false,
	                pressSV: false,
	                color: this.props.color,
	                saturation: 0,
	                value: 0,
	                hue: 0
	            };
	        }
	    }
	    // constructor(props) {
	    //   super(props);
	    //   relMouseCoords(event: MouseEvent){
	    //     var totalOffsetX = 0;
	    //     var totalOffsetY = 0;
	    //     var canvasX = 0;
	    //     var canvasY = 0;
	    //     var currentElement = this;
	    //     do{
	    //         totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
	    //         totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
	    //     }
	    //     while(currentElement = currentElement.offsetParent)
	    //     canvasX = event.pageX - totalOffsetX;
	    //     canvasY = event.pageY - totalOffsetY;
	    //     return {x:canvasX, y:canvasY}
	    //   }
	    // }
	    ColorPicker.prototype.onMouseDownH = function (event) {
	        var $div = $(event.target);
	        // const offsetX = $div.offset().left;
	        var offsetY = $div.offset().top;
	        var hue = ((event.pageY - offsetY) / ColorPicker.H_HEIGHT) * Color_1.HSV.H_MAX;
	        if (this.props.onChange) {
	            var hsv = new Color_1.HSV(hue, this.state.saturation, this.state.value);
	            var rgb = hsv.toRGB();
	            var colorCode = rgb.getColorCode();
	            this.props.onChange(colorCode);
	        }
	        this.setState({
	            pressH: true,
	            hue: hue
	        });
	    };
	    ColorPicker.prototype.onMouseMoveH = function (event) {
	        if (this.state.pressH) {
	            var $div = $(event.target);
	            // const offsetX = $div.offset().left;
	            var offsetY = $div.offset().top;
	            var hue = ((event.pageY - offsetY) / ColorPicker.H_HEIGHT) * Color_1.HSV.H_MAX;
	            if (this.props.onChange) {
	                var hsv = new Color_1.HSV(hue, this.state.saturation, this.state.value);
	                var rgb = hsv.toRGB();
	                var colorCode = rgb.getColorCode();
	                this.props.onChange(colorCode);
	            }
	            this.setState({
	                hue: hue
	            });
	        }
	    };
	    ColorPicker.prototype.onMouseUpH = function (event) {
	        var $div = $(event.target);
	        // const offsetX = $div.offset().left;
	        var offsetY = $div.offset().top;
	        var hue = ((event.pageY - offsetY) / ColorPicker.H_HEIGHT) * Color_1.HSV.H_MAX;
	        var hsv = new Color_1.HSV(hue, this.state.saturation, this.state.value);
	        var rgb = hsv.toRGB();
	        var colorCode = rgb.getColorCode();
	        if (this.props.onChange) {
	            this.props.onChange(colorCode);
	        }
	        if (this.props.onChangeComplete) {
	            this.props.onChangeComplete(colorCode);
	        }
	        this.setState({
	            pressH: false,
	            hue: hue
	        });
	    };
	    ColorPicker.prototype.onMouseDownSV = function (event) {
	        var $div = $(event.target);
	        var offsetX = $div.offset().left;
	        var offsetY = $div.offset().top;
	        var saturation = ((event.pageX - offsetX) / ColorPicker.SV_HEIGHT) * Color_1.HSV.SV_MAX;
	        var value = Color_1.HSV.SV_MAX - ((event.pageY - offsetY) / ColorPicker.SV_HEIGHT) * Color_1.HSV.SV_MAX;
	        if (this.props.onChange) {
	            var hsv = new Color_1.HSV(this.state.hue, saturation, value);
	            var rgb = hsv.toRGB();
	            this.props.onChange(rgb.getColorCode());
	        }
	        this.setState({
	            pressSV: true,
	            saturation: saturation,
	            value: value
	        });
	    };
	    ColorPicker.prototype.onMouseMoveSV = function (event) {
	        if (this.state.pressSV) {
	            var $div = $(event.target);
	            var offsetX = $div.offset().left;
	            var offsetY = $div.offset().top;
	            var saturation = ((event.pageX - offsetX) / ColorPicker.SV_HEIGHT) * Color_1.HSV.SV_MAX;
	            var value = Color_1.HSV.SV_MAX - ((event.pageY - offsetY) / ColorPicker.SV_HEIGHT) * Color_1.HSV.SV_MAX;
	            if (this.props.onChange) {
	                var hsv = new Color_1.HSV(this.state.hue, saturation, value);
	                var rgb = hsv.toRGB();
	                this.props.onChange(rgb.getColorCode());
	            }
	            this.setState({
	                saturation: saturation,
	                value: value
	            });
	        }
	    };
	    ColorPicker.prototype.onMouseUpSV = function (event) {
	        var $div = $(event.target);
	        var offsetX = $div.offset().left;
	        var offsetY = $div.offset().top;
	        var saturation = ((event.pageX - offsetX) / ColorPicker.SV_HEIGHT) * Color_1.HSV.SV_MAX;
	        var value = Color_1.HSV.SV_MAX - ((event.pageY - offsetY) / ColorPicker.SV_HEIGHT) * Color_1.HSV.SV_MAX;
	        var hsv = new Color_1.HSV(this.state.hue, saturation, value);
	        var rgb = hsv.toRGB();
	        var colorCode = rgb.getColorCode();
	        if (this.props.onChange) {
	            this.props.onChange(colorCode);
	        }
	        if (this.props.onChangeComplete) {
	            this.props.onChangeComplete(colorCode);
	        }
	        this.setState({
	            pressSV: false,
	            saturation: saturation,
	            value: value
	        });
	    };
	    ColorPicker.prototype.render = function () {
	        var toRightColor = new Color_1.HSV(this.state.hue, Color_1.HSV.SV_MAX, Color_1.HSV.SV_MAX).toRGB().getColorCode();
	        return (React.createElement("div", {style: { height: "150px" }}, React.createElement("div", {ref: "colorSelector", style: {
	            float: "left", position: "relative",
	            width: "" + ColorPicker.SV_WIDTH + "px",
	            height: "" + ColorPicker.H_HEIGHT + "px"
	        }}, React.createElement("div", {style: {
	            position: "absolute",
	            width: "100%", height: "100%",
	            border: "1px solid gray",
	            background: "linear-gradient(to right, #FFF 0%, " + toRightColor + " 100%)"
	        }}, React.createElement("div", {style: {
	            width: "100%", height: "100%",
	            background: "linear-gradient(to top, #000 0%, rgba(255,255,255,0) 100%)"
	        }, onMouseDown: this.onMouseDownSV.bind(this), onMouseUp: this.onMouseUpSV.bind(this), onMouseMove: this.onMouseMoveSV.bind(this)})), React.createElement("div", {style: {
	            pointerEvents: "none",
	            position: "relative",
	            left: "" + ((ColorPicker.SV_HEIGHT * (this.state.saturation / Color_1.HSV.SV_MAX)) - 5) + "px",
	            top: "" + ((ColorPicker.SV_HEIGHT * ((Color_1.HSV.SV_MAX - this.state.value) / Color_1.HSV.SV_MAX)) - 5) + "px"
	        }}, React.createElement("svg", {width: "10", height: "10", viewBox: "0 0 10 10"}, React.createElement("circle", {style: { stroke: "gray", strokeWidth: "2", fill: "rgba(0, 0, 0, 0)" }, cx: "5", cy: "5", r: "3"}), React.createElement("circle", {style: { stroke: "white", strokeWidth: "1", fill: "rgba(0, 0, 0, 0)" }, cx: "5", cy: "5", r: "3"})))), React.createElement("div", {style: {
	            position: "relative",
	            float: "left",
	            marginLeft: "5px",
	            width: "15px",
	            height: ColorPicker.SV_HEIGHT + "px"
	        }, onMouseDown: this.onMouseDownH.bind(this), onMouseUp: this.onMouseUpH.bind(this), onMouseMove: this.onMouseMoveH.bind(this)}, React.createElement("div", {style: {
	            position: "absolute",
	            width: "15px",
	            height: ColorPicker.SV_HEIGHT + "px",
	            background: "linear-gradient(to bottom, #f00 0%, #ff0 17%, #0f0 34%, #0ff 50%, #00f 67%, #f0f 84%, #f00 100%)",
	            border: "1px solid gray"
	        }}), React.createElement("div", {style: {
	            pointerEvents: "none",
	            position: "absolute",
	            backgroundColor: "white",
	            borderBottom: "1px solid #000",
	            left: "0px",
	            top: ((ColorPicker.H_HEIGHT * (this.state.hue / Color_1.HSV.H_MAX)) - 1) + "px",
	            width: "15px",
	            height: "2px"
	        }}))));
	    };
	    ColorPicker.SV_HEIGHT = 150;
	    ColorPicker.SV_WIDTH = 150;
	    ColorPicker.H_HEIGHT = 150;
	    return ColorPicker;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ColorPicker;


/***/ },
/* 13 */
/***/ function(module, exports) {

	/// <reference path="./../../typings/index.d.ts" />
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ExpandableItem = (function (_super) {
	    __extends(ExpandableItem, _super);
	    function ExpandableItem() {
	        _super.apply(this, arguments);
	        this.state = {
	            expand: this.props.expand,
	            containerHeight: this.props.expand ? "auto" : "0px",
	            hover: false
	        };
	    }
	    ExpandableItem.prototype.componentDidUpdate = function (prevProps, prevState) {
	        // 拡縮対象の縦幅をStateへ記憶している
	        // ※ CSS Transition が auto → ?px へのアニメーションに対応していないため
	        // componentDidMount() で計測できないのでラベルにカーソルを合わせたタイミングで計測している
	        // TODO: 正しい位置で計測がしたい
	        if (this.state.hover !== prevState.hover) {
	            var measure = ReactDOM.findDOMNode(this.refs.measure);
	            this.setState({ containerHeight: measure.clientHeight + "px" });
	        }
	    };
	    ExpandableItem.prototype.onClickLabel = function () {
	        var expandNext = !this.state.expand;
	        this.setState({ expand: expandNext });
	        if (this.props.onToggle) {
	            this.props.onToggle(expandNext);
	        }
	    };
	    ExpandableItem.prototype.render = function () {
	        var _this = this;
	        var labelElement = (React.createElement("div", {className: "navi_label1", onClick: this.onClickLabel.bind(this), onMouseEnter: function () { return _this.setState({ hover: true }); }, onMouseLeave: function () { return _this.setState({ hover: false }); }, style: {
	            cursor: "pointer", fontWeight: "bold", padding: "3px 8px",
	            color: "#E0E0E0", backgroundColor: this.state.hover ? "#868E94" : "#666E74"
	        }}, React.createElement("div", {style: {
	            transition: ".3s", float: "left",
	            transform: this.state.expand ? "rotate(0deg)" : "rotate(-91deg)"
	        }}, "▼"), React.createElement("div", {style: { marginLeft: "20px" }}, this.props.label)));
	        var containerElement = (React.createElement("div", {style: {
	            backgroundColor: "#C6CED4",
	            transition: ".3s",
	            overflow: "hidden",
	            height: this.state.expand ? this.state.containerHeight : "0px"
	        }}, React.createElement("div", {ref: "measure", style: { padding: "5px" }}, this.props.children)));
	        return (React.createElement("div", null, labelElement, containerElement));
	    };
	    return ExpandableItem;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ExpandableItem;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="./../typings/index.d.ts" />
	"use strict";
	var IndexBoxWrapper_1 = __webpack_require__(6);
	var Color_1 = __webpack_require__(3);
	var SideMenu = (function () {
	    function SideMenu(context, address) {
	        var _this = this;
	        this.address = address;
	        this.$sideMenu = $("#side_menu");
	        if (this.$sideMenu.length <= 0) {
	            var menuPosition = "position: fixed; top: 0px; left: -" + SideMenu.MENU_SIZE + "px; width: " + SideMenu.MENU_SIZE + "px;";
	            this.$sideMenu = $("\n        <div id=\"side_menu\"\n            style=\"" + menuPosition + " z-index: 5; overflow-y: scroll\">\n        </div>\n      ");
	            var windowHeight = $(window).height();
	            this.$sideMenu.height(windowHeight);
	            $(window).resize(function () {
	                var windowHeight = $(window).height();
	                _this.$sideMenu.height(windowHeight);
	            });
	            $(document.body).append(this.$sideMenu);
	        }
	        this.context = context;
	        this.isSideMenuOpened = false;
	        this.isSidePageLoaded = false;
	    }
	    SideMenu.prototype.loadSidePage = function (context, textColor, backgroundColor) {
	        var _this = this;
	        this.isSidePageLoaded = true;
	        // const targetUrl = location.protocol + "//" + location.host + "/" + novelCode;
	        console.log("Loading menu", this.address);
	        var requestMenu = new XMLHttpRequest();
	        // requestMenu.onreadystatechange
	        requestMenu.addEventListener("load", function (event) {
	            var loadPage = requestMenu.responseXML;
	            var body = loadPage.querySelector("body");
	            var indexBox = body.querySelector(".index_box");
	            _this.$sideMenu.append(indexBox);
	            _this.indexBoxWrapper = new IndexBoxWrapper_1.default(indexBox);
	            _this.indexBoxWrapper.reconstructToExpandable(context);
	            _this.indexBoxWrapper.applyAlreadyRead(context, backgroundColor);
	            _this.indexBoxWrapper.changeNovelLayout(textColor, backgroundColor);
	            _this.indexBoxWrapper.stretchIndexBoxesForSideMenu();
	            var sideMenuBorderColor = Color_1.RGB.fromString(backgroundColor).toHSV().applyContrasts(40).toRGB().getColorCode();
	            _this.$sideMenu.css({ color: textColor, backgroundColor: backgroundColor, borderRight: "2px solid " + sideMenuBorderColor });
	        });
	        requestMenu.open("GET", this.address, true);
	        requestMenu.responseType = "document";
	        requestMenu.send();
	    };
	    SideMenu.prototype.showSideMenu = function (textColor, backgroundColor) {
	        this.isSideMenuOpened = true;
	        if (!this.isSidePageLoaded) {
	            this.loadSidePage(this.context, textColor, backgroundColor);
	        }
	        else {
	            if (this.indexBoxWrapper) {
	                this.indexBoxWrapper.applyAlreadyRead(this.context, backgroundColor);
	                this.indexBoxWrapper.changeNovelLayout(textColor, backgroundColor);
	            }
	        }
	        console.log("Open menu");
	        this.$sideMenu.stop().animate({ left: "0" }, SideMenu.MENU_SPEED).addClass("active");
	    };
	    SideMenu.prototype.closeSideMenu = function () {
	        this.isSideMenuOpened = false;
	        this.$sideMenu.stop().animate({ left: "-" + SideMenu.MENU_SIZE + "px" }, SideMenu.MENU_SPEED).removeClass("active");
	    };
	    SideMenu.prototype.changeNovelLayout = function (textColor, backgroundColor) {
	        if (this.indexBoxWrapper) {
	            this.indexBoxWrapper.applyAlreadyRead(this.context, backgroundColor);
	            this.indexBoxWrapper.changeNovelLayout(textColor, backgroundColor);
	        }
	    };
	    SideMenu.MENU_SIZE = 350;
	    SideMenu.MENU_SPEED = 300;
	    return SideMenu;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = SideMenu;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="./../typings/index.d.ts" />
	"use strict";
	var SettingManager_1 = __webpack_require__(16);
	var Context = (function () {
	    function Context(novelCode, defaultGlobalSettings, defaultNovelSettings) {
	        this.isLoadedGlobalSettings = false;
	        this.isLoadedNovelSettings = false;
	        this.isLoadedReadSettings = false;
	        this.globalSettingManager = new SettingManager_1.default("narou_refiner", defaultGlobalSettings);
	        this.novelSettingManager = new SettingManager_1.default("narou_refiner_" + novelCode, defaultNovelSettings);
	        this.readSettingManager = new SettingManager_1.default("narou_refiner_read_" + novelCode);
	    }
	    Context.prototype.getGlobalSettings = function () {
	        if (!this.isLoadedGlobalSettings) {
	            this.globalSettings = this.globalSettingManager.load();
	        }
	        return this.globalSettings;
	    };
	    Context.prototype.readGlobalSetting = function (key) {
	        if (!this.isLoadedGlobalSettings) {
	            this.globalSettings = this.globalSettingManager.load();
	        }
	        return this.globalSettings[key];
	    };
	    Context.prototype.putGlobalSetting = function (key, value) {
	        if (!this.isLoadedGlobalSettings) {
	            this.globalSettings = this.globalSettingManager.load();
	        }
	        this.globalSettings[key] = value;
	    };
	    Context.prototype.saveGlobalSetting = function (key, value) {
	        if (arguments.length === 2 && (typeof key === "string" || typeof key === "number")) {
	            if (!this.isLoadedGlobalSettings) {
	                this.globalSettings = this.globalSettingManager.load();
	            }
	            this.globalSettings[key] = value;
	            this.globalSettingManager.save(this.globalSettings);
	        }
	        else if (arguments.length === 1 && typeof key === "object") {
	            if (!this.isLoadedGlobalSettings) {
	                this.globalSettings = this.globalSettingManager.load();
	            }
	            this.globalSettings = $.extend(true, this.globalSettings, key);
	            this.globalSettingManager.save(this.globalSettings);
	        }
	        else if (arguments.length === 0) {
	            if (this.globalSettings) {
	                this.globalSettingManager.save(this.globalSettings);
	            }
	        }
	    };
	    Context.prototype.getNovelSettings = function () {
	        if (!this.isLoadedNovelSettings) {
	            this.novelSettings = this.novelSettingManager.load();
	        }
	        return this.novelSettings;
	    };
	    Context.prototype.readNovelSetting = function (key) {
	        if (!this.isLoadedNovelSettings) {
	            this.novelSettings = this.novelSettingManager.load();
	        }
	        return this.novelSettings[key];
	    };
	    Context.prototype.putNovelSetting = function (key, value) {
	        if (!this.isLoadedNovelSettings) {
	            this.novelSettings = this.novelSettingManager.load();
	        }
	        this.novelSettings[key] = value;
	    };
	    Context.prototype.saveNovelSetting = function (key, value) {
	        if (arguments.length === 2 && (typeof key === "string" || typeof key === "number")) {
	            if (!this.isLoadedNovelSettings) {
	                this.novelSettings = this.novelSettingManager.load();
	            }
	            this.novelSettings[key] = value;
	            this.novelSettingManager.save(this.novelSettings);
	        }
	        else if (arguments.length === 1 && typeof key === "object") {
	            if (!this.isLoadedNovelSettings) {
	                this.novelSettings = this.novelSettingManager.load();
	            }
	            this.novelSettings = $.extend(true, this.novelSettings, key);
	            this.novelSettingManager.save(this.novelSettings);
	        }
	        else if (arguments.length === 0) {
	            if (this.novelSettings) {
	                this.novelSettingManager.save(this.novelSettings);
	            }
	        }
	    };
	    Context.prototype.getReadSettings = function () {
	        if (!this.isLoadedReadSettings) {
	            this.readSettings = this.readSettingManager.load();
	        }
	        return this.readSettings;
	    };
	    Context.prototype.readReadSetting = function (key) {
	        if (!this.isLoadedReadSettings) {
	            this.readSettings = this.readSettingManager.load();
	        }
	        return this.readSettings[key];
	    };
	    Context.prototype.putReadSetting = function (key, value) {
	        if (!this.isLoadedReadSettings) {
	            this.readSettings = this.readSettingManager.load();
	        }
	        this.readSettings[key] = value;
	    };
	    Context.prototype.saveReadSetting = function (key, value) {
	        if (arguments.length === 2 && (typeof key === "string" || typeof key === "number")) {
	            if (!this.isLoadedNovelSettings) {
	                this.readSettings = this.readSettingManager.load();
	            }
	            this.readSettings[key] = value;
	            this.readSettingManager.save(this.readSettings);
	        }
	        else if (arguments.length === 1 && typeof key === "object") {
	            if (!this.isLoadedNovelSettings) {
	                this.readSettings = this.readSettingManager.load();
	            }
	            this.readSettings = $.extend(true, this.readSettings, key);
	            this.readSettingManager.save(this.readSettings);
	        }
	        else if (arguments.length === 0) {
	            if (this.readSettings) {
	                this.readSettingManager.save(this.readSettings);
	            }
	        }
	    };
	    return Context;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Context;


/***/ },
/* 16 */
/***/ function(module, exports) {

	/// <reference path="./../typings/index.d.ts" />
	"use strict";
	/// LocalStorage
	var SettingManager = (function () {
	    function SettingManager(key, defaultSettings) {
	        if (defaultSettings === void 0) { defaultSettings = {}; }
	        this.key = key;
	        this.settings = defaultSettings;
	    }
	    SettingManager.prototype.load = function () {
	        return $.extend(true, this.settings, JSON.parse(localStorage.getItem(this.key)));
	    };
	    SettingManager.prototype.save = function (settings) {
	        localStorage.setItem(this.key, JSON.stringify(settings));
	    };
	    return SettingManager;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = SettingManager;


/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
	exports.SETTING_KEY = {
	    /// ナビゲーションの拡縮
	    EXPAND_NAVI: {
	        COLOR: "expandNaviColor",
	        LAYOUT: "expandNaviLayout",
	        FONT: "expandNaviFont",
	        TYPESETTING: "expandNaviTypeSetting",
	        PROPORTION: "expandNaviProportion"
	    },
	    /// 基本文字色
	    TEXT_COLOR: "textColor",
	    /// 基本背景色
	    BACKGROUND_COLOR: "backgroundColor",
	    /// 字送り・行送り
	    WORD_DIRECTION: "wordDirection",
	    /// 作品画面の横幅
	    NOVEL_WIDTH: "novelWidth",
	    /// 作品画面の縦幅
	    NOVEL_HEIGHT: "novelHeight",
	    /// 表示用のフォント
	    FONT: "font",
	    /// 選択可能なフォント一覧
	    FONT_LIST: "fontList",
	    /// フォントサイズ
	    FONT_SIZE: "fontSize",
	    /// フォントウェイト
	    FONT_WEIGHT: "fontWeight",
	    /// 文字間隔
	    LETTER_SPACING: "letterSpacing",
	    /// 行間隔
	    LINE_HEIGHT: "lineHeight",
	    /// 単語間隔
	    WORD_SPACING: "wordSpacing",
	    /// 漢字周辺の余白
	    KANJI_SPACING: "kanjiSpacing",
	    /// 漢字サイズ
	    KANJI_SIZE: "kanjiSize",
	    /// カタカナ周辺の余白
	    KATAKANA_SPACING: "katakanaSpacing",
	    /// カタカナサイズ
	    KATAKANA_SIZE: "katakanaSize",
	    /// セリフ周辺の余白
	    SERIF_SPACING: "serifSpacing",
	    /// セリフサイズ
	    SERIF_SIZE: "serifSize"
	};
	exports.DEFAULT_GLOBAL_SETTINGS = (_a = {},
	    _a[exports.SETTING_KEY.EXPAND_NAVI.COLOR] = true,
	    _a[exports.SETTING_KEY.EXPAND_NAVI.LAYOUT] = true,
	    _a[exports.SETTING_KEY.EXPAND_NAVI.FONT] = true,
	    _a[exports.SETTING_KEY.EXPAND_NAVI.TYPESETTING] = false,
	    _a[exports.SETTING_KEY.EXPAND_NAVI.PROPORTION] = false,
	    _a[exports.SETTING_KEY.TEXT_COLOR] = "#000",
	    _a[exports.SETTING_KEY.BACKGROUND_COLOR] = "#FFF",
	    _a[exports.SETTING_KEY.WORD_DIRECTION] = "horizontal-tb",
	    _a[exports.SETTING_KEY.NOVEL_WIDTH] = "95%",
	    _a[exports.SETTING_KEY.NOVEL_HEIGHT] = "100%",
	    _a[exports.SETTING_KEY.FONT] = null,
	    _a[exports.SETTING_KEY.FONT_LIST] = [],
	    _a[exports.SETTING_KEY.FONT_SIZE] = "12px",
	    _a[exports.SETTING_KEY.FONT_WEIGHT] = 500,
	    _a[exports.SETTING_KEY.LETTER_SPACING] = "",
	    // [SETTING_KEY.WORD_SPACING]: "",
	    _a[exports.SETTING_KEY.LINE_HEIGHT] = "",
	    _a[exports.SETTING_KEY.KANJI_SPACING] = "0px",
	    _a[exports.SETTING_KEY.KANJI_SIZE] = "100%",
	    _a[exports.SETTING_KEY.KATAKANA_SPACING] = "0px",
	    _a[exports.SETTING_KEY.KATAKANA_SIZE] = "100%",
	    _a[exports.SETTING_KEY.SERIF_SPACING] = "0px",
	    _a[exports.SETTING_KEY.SERIF_SIZE] = "100%",
	    _a
	);
	exports.DEFAULT_NOVEL_SETTINGS = {
	    toggles: []
	};
	var _a;


/***/ }
/******/ ]);
//# sourceMappingURL=narouRefiner.js.map