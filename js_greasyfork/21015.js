'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==UserScript==
// @name         Cleaner Weibo
// @name:zh-CN   去皮微博
// @name:zh-TW   去皮微博
// @namespace    NB-Kevin
// @version      0.1.2
// @description  Make weibo cleaner.
// @description:zh-CN 讓微博更乾淨。
// @description:zh-TW 讓微博更乾淨。
// @author       Nb/Kevin
// @match        http://weibo.com/*
// @match        http://www.weibo.com/*
// @match        http://d.weibo.com/*
// @match        http://s.weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21015/%E5%8E%BB%E7%9A%AE%E5%BE%AE%E5%8D%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/21015/%E5%8E%BB%E7%9A%AE%E5%BE%AE%E5%8D%9A.meta.js
// ==/UserScript==

// Transpiled by Babel from ES6 to ES5.
// Edited with WebStorm.

/**
 * Convert a node list to array.
 * @returns {Array.<HTMLElement>}
 */
NodeList.prototype.toArray = function () {
    var that = this;
    return Array.prototype.slice.call(that);
};

/**
 * Hide an HTML element.
 */
HTMLElement.prototype.hide = function () {
    if (this.className.indexOf('_CWHide') == -1) this.className += ' _CWHide';
};

/**
 * Create an element from HTML string.
 * @return {HTMLElement} The element.
 */
String.prototype.toHTMLElement = function () {
    var templateElement = document.createElement('template');
    templateElement.innerHTML = this;
    return templateElement.content.firstChild;
};

/**
 * Log to console.
 * @param {string} message Message.
 */
var log = function log(message) {}
// uncomment this line to enable logging
// console.log(`CleanerWeibo |> ${message}`)


/**
 * Root.
 */
;var CleanerWeibo = {
    Resources: {
        Elements: {
            get HomeFeed() {
                var candidate = document.querySelector('[node-type="homefeed"]');
                if (candidate == null || candidate == undefined) candidate = document.querySelector('[node-type="feedconfig"]');
                return candidate;
            }
        },

        Styles: '<style>\n                    ._CWRightUserName {\n                        max-width: 175px !important;\n                    }\n                    ._CWFeedSendBox {\n                        padding-bottom: 0 !important;\n                    }\n                    ._CWGeneralNavNameIcon {\n                        max-width: 200px !important;\n                    }\n                    ._CWHide {\n                        display: none !important;\n                    }\n                    ._CWNoBackgroundImage {\n                        background-image: none !important;\n                    }\n                </style>'.toHTMLElement(),

        Selectors: {
            RightWildcard: '[id^="v6_pl_rightmod_"]',
            RightVIP: '#v6_trustPagelet_recom_member',
            FeedInputTitle: '.title_area',
            RightSetSkin: '#v6_pl_content_setskin',
            RightWBLevelIcon: '.W_icon_level',
            RightWBLevelText: '.icon_member_dis',
            GeneralNewIcon: '.W_new, .W_new_count, .W_new_ani',
            GeneralWebIM: '#WB_webim',
            GeneralPlayer: '.PCD_mplayer',
            GeneralSearchPlaceHolder: '.placeholder',
            GeneralFooter: '.WB_footer',
            FeedTips: '.W_tips',
            GeneralNavIcon: '[nm="game"], [nm="find"]',
            FeedSendBox: '.send_weibo',
            RightUserName: '.name',
            GeneralNavNameIcon: '[nm="name"]',
            LeftHotWeibo: '[suda-uatrack$="left_hotweibo"]',
            GeneralSinaLogo: '[node-type="logolink"]',
            FeedTopAd: '#v6_pl_content_biztips',
            SingleRightPanel: '[id^="Pl_Core_RecommendList"]',
            SingleStarCover: '.WB_starcover',
            UserPageSkinUseCount: '.pf_use_num',
            UserPageSkinUseForMeAsWell: '.pf_copy_icon',
            UserPageFollowerInterest: '[id^="Pl_Core_Ut1UserList"]',
            DiscoverLogo: '.logo_box',
            SearchTrend: '#pl_weibo_hotband',
            SearchLogo: '.search_logo',
            SearchFooter: '.search_footer',
            FeedVipCover: '.WB_vipcover',
            FeedDetail: '.WB_feed_detail',
            FeedBottomAdvertisement: '#v6_pl_ad_bottomtip',
            GeneralVipIcon: '[href*="vipicon"]',
            GeneralLevelIcon: '[class*="icon_member"]',
            GeneralClubIcon: '.icon_club',
            DiscoverRightPanelAdvertisement: '[id*="Pl_Core_ThirdHtmlData__"]',
            SearchRightPanelRecommendProduct: '#pl_common_ali',

            /**
             * Direct selectors.
             * @return {string}
             */
            get DirectSelectors() {
                return [this.RightVIP, this.FeedInputTitle, this.RightSetSkin, this.RightWBLevelIcon, this.RightWBLevelText, this.GeneralNewIcon, this.GeneralWebIM, this.GeneralPlayer, this.GeneralSearchPlaceHolder, this.GeneralFooter, this.FeedTips, this.GeneralNavIcon, this.LeftHotWeibo, this.GeneralSinaLogo, this.FeedTopAd, this.SingleRightPanel, this.SingleStarCover, this.UserPageSkinUseCount, this.UserPageSkinUseForMeAsWell, this.UserPageFollowerInterest, this.DiscoverLogo, this.SearchTrend, this.SearchLogo, this.SearchFooter, this.FeedVipCover, this.FeedBottomAdvertisement, this.GeneralVipIcon, this.GeneralLevelIcon, this.GeneralClubIcon, this.DiscoverRightPanelAdvertisement, this.SearchRightPanelRecommendProduct].join(',');
            }
        },

        StylePatcher: [{
            get selector() {
                return CleanerWeibo.Resources.Selectors.FeedSendBox;
            },
            patcher: function patcher(element) {
                if (element.className.indexOf('_CWFeedSendBox') == -1) element.className += ' _CWFeedSendBox';
            }
        }, {
            get selector() {
                return CleanerWeibo.Resources.Selectors.RightUserName;
            },
            patcher: function patcher(element) {
                if (element.className.indexOf('_CWRightUserName') == -1) element.className += ' _CWRightUserName';
            }
        }, {
            get selector() {
                return CleanerWeibo.Resources.Selectors.FeedDetail;
            },
            patcher: function patcher(element) {
                if (element.className.indexOf('_CWNoBackgroundImage') == -1) element.className += ' _CWNoBackgroundImage';
            }
        }, {
            get selector() {
                return CleanerWeibo.Resources.Selectors.GeneralNavNameIcon;
            },
            patcher: function patcher(element) {
                var actualContainer = element.childNodes.toArray()[1];
                if (actualContainer.className.indexOf('_CWGeneralNavNameIcon') == -1) actualContainer.className += ' _CWGeneralNavNameIcon';
            }
        }],

        /**
         * Elements selected by wildcard selectors.
         * @returns {Array.<HTMLElement>}
         */
        get WildcardElements() {
            return document.querySelectorAll(this.Selectors.RightWildcard).toArray().filter(function (e) {
                return !e.id.endsWith('myinfo');
            });
        },

        /**
         * Elements selected by direct selectors.
         * @returns {Array.<HTMLElement>}
         */
        get DirectElements() {
            return document.querySelectorAll(this.Selectors.DirectSelectors).toArray();
        },

        /**
         * All elements to be hidden.
         * @returns {Array.<HTMLElement>}
         */
        get AllElementsToBeHidden() {
            return this.WildcardElements.concat(this.DirectElements);
        }
    },

    Actions: {
        /**
         * Begin processing the page.
         */
        Process: function Process() {
            log('begin processing...');
            if (this.IsProcessing) return;
            this.IsProcessing = true;
            CleanerWeibo.Resources.AllElementsToBeHidden.forEach(function (element) {
                log('hiding element ' + element);
                element.hide();
            });
            this.IsProcessing = false;
        },

        IsProcessing: false,

        /**
         * Patch style.
         */
        PatchStyle: function PatchStyle() {
            CleanerWeibo.Resources.StylePatcher.forEach(function (patcher) {
                new CleanerWeibo.StylePatcher(patcher.selector, patcher.patcher).patch();
            });
        },

        /**
         * Feed observer.
         */
        FeedObserver: new MutationObserver(function (mutations) {
            CleanerWeibo.Actions.Process();
        }),

        /**
         * General observer.
         */
        GeneralObserver: new MutationObserver(function (mutations) {
            CleanerWeibo.Actions.Process();
            CleanerWeibo.Actions.PatchStyle();
        }),

        /**
         * The timer ID of the interval callback.
         */
        TimerID: 0,

        /**
         * Monitor home feed.
         */
        MonitorHomeFeed: function MonitorHomeFeed() {
            if (CleanerWeibo.Resources.Elements.HomeFeed !== undefined) {
                // home feed has been loaded
                if (CleanerWeibo.Resources.Elements.HomeFeed != undefined && CleanerWeibo.Resources.Elements.HomeFeed != null) CleanerWeibo.Actions.FeedObserver.observe(CleanerWeibo.Resources.Elements.HomeFeed, { childList: true });
                clearInterval(CleanerWeibo.Actions.TimerID);
            }
        }
    },

    StylePatcher: function () {
        /**
         * Create a style patcher.
         * @param selector {string} Selector.
         * @param patcher {Function} Patcher.
         */

        function StylePatcher(selector, patcher) {
            _classCallCheck(this, StylePatcher);

            this.selector = selector;
            this.patcher = patcher;
        }

        /**
         * Patch the style.
         */


        _createClass(StylePatcher, [{
            key: 'patch',
            value: function patch() {
                var that = this;
                document.querySelectorAll(that.selector).toArray().forEach(function (e) {
                    return that.patcher(e);
                });
            }
        }]);

        return StylePatcher;
    }()
};

// register stylesheet
document.body.appendChild(CleanerWeibo.Resources.Styles);

// register interval
CleanerWeibo.Actions.TimerID = setInterval(CleanerWeibo.Actions.MonitorHomeFeed, 1500);

// register general observer
CleanerWeibo.Actions.GeneralObserver.observe(document.body, { childList: true, attributes: true });

// debug entry point
window.cw = CleanerWeibo;