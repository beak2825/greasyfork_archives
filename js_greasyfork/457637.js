// ==UserScript==
// @name        South Plus 视频链接播放器
// @description 自动播放视频链接
// @version     0.5.0.beta.2
// @author      大碗宽面wtw
// @homepage    https://greasyfork.org/zh-CN/scripts/457637
// @supportURL  https://github.com/bigbowl-wtw/south-plus-video-player/issues
// @match       *://*.blue-plus.net/read.php*
// @match       *://*.east-plus.net/read.php*
// @match       *://*.imoutolove.me/read.php*
// @match       *://*.level-plus.net/read.php*
// @match       *://*.north-plus.net/read.php*
// @match       *://*.snow-plus.net/read.php*
// @match       *://*.soul-plus.net/read.php*
// @match       *://*.south-plus.net/read.php*
// @match       *://*.south-plus.org/read.php*
// @match       *://*.spring-plus.net/read.php*
// @match       *://*.summer-plus.net/read.php*
// @match       *://*.white-plus.net/read.php*
// @match       *://blue-plus.net/read.php*
// @match       *://east-plus.net/read.php*
// @match       *://imoutolove.me/read.php*
// @match       *://level-plus.net/read.php*
// @match       *://north-plus.net/read.php*
// @match       *://snow-plus.net/read.php*
// @match       *://soul-plus.net/read.php*
// @match       *://south-plus.net/read.php*
// @match       *://south-plus.org/read.php*
// @match       *://spring-plus.net/read.php*
// @match       *://summer-plus.net/read.php*
// @match       *://white-plus.net/read.php*
// @connect     bilibili.com
// @connect     b23.tv
// @connect     youtube.com
// @connect     youtu.be
// @connect     twitter.com
// @connect     twimg.com
// @connect     91porny.com
// @connect     jiuse.cloud
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_info
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_xmlhttpRequest
// @icon        data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAUFNAA6Oj6AI6O6ABhYd8ANDTWAAcHzQD5+f4AzMz1AEVF2gAYGNEA7Oz7AGVl4ACjo+0AHBzSAMPD8wCWluoAaWnhAA8PzwBcXN4ALy/VAAICzADHx/QA5+f6ALq68QCNjegAMzPWAPj4/gBxceMAFxfRAL6+8gCRkekANzfXAN7e+ACxse8AhITmAO/v/ADCwvMAlZXqAGho4QAODs8A4uL5ALW18ACIiOcAW1veAC4u1QABAcwA8/P9AMbG9ACZmesAbGziAD8/2QC5ufEAX1/fADIy1gAFBc0A2dn3AKys7gBSUtwA6ur7AL298gCQkOkAY2PgADY21wDd3fgAg4PmAJSU6gBnZ+EAOjrYAA0NzwC0tPAAAADMANTU9gBNTdsAuLjxAIuL6AAEBM0Aq6vuAFFR3ADp6fsAvLzyAI+P6QBiYuAANTXXAAgIzgCvr+8AgoLmAKKi7ABISNoAs7PwACws1QDT0/YApqbtAExM2wAfH9IAt7fxAKqq7gBQUNwAIyPTAPf3/QDKyvQAcHDiABYW0ADb2/gArq7vAFRU3QD7+/4AoaHsAHR04wBHR9oAGhrRALKy8ACFhecAWFjeACsr1QD///8AeHjkAEtL2wAeHtIA8vL8AMXF8wCYmOoA9vb9AMnJ9ABvb+IAFRXQANra+AAmJtQAoKDsAHNz4wCTk+kAOTnXAAwMzgBKStsA8fH8AMTE8wCXl+oAamrhABAQzwDV1fcAqKjuAE5O3AAhIdMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaVU+cQIlJnt0BUxyZ1JCckgFRkZ0QEsUEVhYMl1GBR5gLUZGQ0pGNn1vRm8venwsVERxFAlnRogdRm0WRg+AJyKKcitGSXxRP3MZXipFVxEGIXcqRhJWRgspcgRfN0Y1clxbWEZGi38EGHJ1LU9GUmJJiSQ5RkZ0KCAIEWt5GHArBw5lHEYfTwpyNwZ6iwFJTUsiOoNGPGJBiC5CcYwdcmhGRigbEXh2HTgKOnIjGnJqf4ZycnJyclo9N4dThC4VYmMMQGQDdICFWwozF3JVRoAQTF5HCoUTWYE7cjCNRolOZhVuPDSCHEZGDX1GRgBrckwyMgRdbHV+YTFQBHshcgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @license     MIT
// @namespace   com.github.bigbowl-wtw
// @require     https://cdn.jsdelivr.net/npm/hls.js@1.4.4/dist/hls.min.js
// @require     https://greasyfork.org/scripts/470000/code/GM%20Requests.js
// @downloadURL https://update.greasyfork.org/scripts/457637/South%20Plus%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/457637/South%20Plus%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 264:
/***/ ((module) => {

module.exports = "1. 更名为 “South Plus 视频链接播放器”\n2. 修复不能播放 Twitter 视频的问题\n3. 添加了对九色网（91prony 及各种马甲）的支持\n点击“确定”查看更多细节"

/***/ }),

/***/ 382:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sd: () => (/* binding */ defaultEventEmitter),
/* harmony export */   zW: () => (/* binding */ Events)
/* harmony export */ });
/* unused harmony export EventEmitter */
/* eslint-disable @typescript-eslint/no-unused-vars */
var Events;
(function (Events) {
    Events["SHOW_UPDATE_INFORMATION"] = "show-update-infromation";
    Events["TWITTER_VERIFY"] = "twitter-vertify";
    Events["TWITTWR_INVALIDATE"] = "twitter-invalidate";
    Events["TWITTER_REAUTHORIZE"] = "twitter-reauthorize";
    Events["MENU_REGISTER_AUTHORIZATION"] = "menu-register-authorization";
    Events["MENU_REGISTER_CLEARCACHE"] = "menu-register-clearcache";
    Events["VIEW_SHOW_TWITTER_CT0"] = "view-show-twitter-ct0";
    Events["VIEW_SHOW_TWITTER_LOGGEDIN"] = "view-show-twitter-loggedin";
    Events["VIEW_SHOW_TWITTER_GUEST"] = "view-show-twitter-guest";
    Events["VIEW_CLOSE_DIALOG"] = "view-close-dialog";
})(Events || (Events = {}));
/**
 * EventEmitter based on jQuery event
 */
class EventEmitter {
    constructor(element = document) {
        this.emitter = jQuery(element);
    }
    on(event, listener, context = this) {
        this.emitter.on(event, listener.bind(context));
    }
    once(event, listener, context = this) {
        this.emitter.one(event, listener.bind(context));
    }
    /**
     * 如果传入 `listener`，将移除所有已绑定的事件，然后绑定 `listener`
     */
    off(event, listener, context = this) {
        if (!listener)
            this.emitter.off(event);
        else
            this.emitter.off(event, '**', listener.bind(context));
    }
    trigger(event, ...datas) {
        this.emitter.trigger(event, ...datas);
    }
}
let emitter;
function defaultEventEmitter() {
    if (!emitter)
        emitter = new EventEmitter();
    return emitter;
}


/***/ }),

/***/ 537:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Handler {
    /**
     * 注册 handler 类，使代码生效
     *
     * @param handler 待注册的 handler 类
     */
    static registerHandler(handler) {
        if (!Handler.handlers)
            Handler.handlers = [];
        Handler.handlers.push(handler);
    }
    /**
     * TODO: 由于某些 handler 实现的 ``.apply`` 可能为异步方法，在页面上有多个匹配的
     *       URL 时，将产生状态冲突的问题（比如上次产生的 id 与本次冲突，而上次调用还未
     *       完成，不能简单的进行清理，进而影响到本次调用），且比较难以解决，因此采用每
     *       调用生成新实例的方法来避免。更好的方法待探索。
     */
    static process() {
        jQuery('.tpc_content a')
            .filter((_, a) => /^http/.test(a.href))
            .each((_, a) => {
            for (const H of Handler.handlers) {
                const handler = new H();
                if (handler.test(a)) {
                    handler.apply(a);
                    break;
                }
            }
        });
    }
}
/* 实际生效的 handler */
Handler.handlers = [];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Handler);


/***/ }),

/***/ 504:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  I: () => (/* binding */ TwitterAPI)
});

// NAMESPACE OBJECT: ./src/libs/twitter/service/fetch.ts
var fetch_namespaceObject = {};
__webpack_require__.r(fetch_namespaceObject);
__webpack_require__.d(fetch_namespaceObject, {
  FetchService: () => (FetchService),
  requests: () => ((external_requests_default()))
});

// EXTERNAL MODULE: ./src/managers/config.ts
var config = __webpack_require__(137);
;// CONCATENATED MODULE: ./src/libs/twitter/models/data/user.ts
/**
 * The details of a single user.
 *
 * @internal
 */
class User {
    /**
     * @param user The raw user data.
     */
    constructor(user) {
        this.id = user.rest_id;
        this.userName = user.legacy.screen_name;
        this.fullName = user.legacy.name;
        this.createdAt = user.legacy.created_at;
        this.description = user.legacy.description;
        this.isVerified = user.legacy.verified;
        this.favouritesCount = user.legacy.favourites_count;
        this.followersCount = user.legacy.followers_count;
        this.followingsCount = user.legacy.friends_count;
        this.statusesCount = user.legacy.statuses_count;
        this.location = user.legacy.location;
        this.pinnedTweet = user.legacy.pinned_tweet_ids_str[0];
        this.profileBanner = user.legacy.profile_banner_url;
        this.profileImage = user.legacy.profile_image_url_https;
    }
}
class UserFromInitialState {
    constructor(initialState) {
        const entities = initialState.entities.users.entities;
        this.id = Object.keys(entities)[0];
        const user = entities[this.id];
        this.userName = user.screen_name;
        this.fullName = user.name;
        this.createdAt = user.created_at;
        this.description = user.description;
        this.isVerified = user.verified;
        this.favouritesCount = user.favourites_count;
        this.followersCount = user.followers_count;
        this.followingsCount = user.friends_count;
        this.statusesCount = user.statuses_count;
        this.location = user.location;
        this.pinnedTweet = user.pinned_tweet_ids_str[0];
        this.profileBanner = user.profile_banner_url;
        this.profileImage = user.profile_image_url_https;
    }
}

// EXTERNAL MODULE: external "requests"
var external_requests_ = __webpack_require__(173);
var external_requests_default = /*#__PURE__*/__webpack_require__.n(external_requests_);
;// CONCATENATED MODULE: ./src/libs/twitter/service/fetch.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// eslint-disable-next-line import/no-extraneous-dependencies

class FetchService {
    constructor(auth) {
        this.requests = (external_requests_default());
        if (auth)
            this.auth = auth;
    }
    get(url, options) {
        return this.request('GET', url, options);
    }
    post(url, options) {
        return this.request('POST', url, options);
    }
    // eslint-disable-next-line class-methods-use-this
    refreshAuth() {
        this.auth.refresh();
    }
    // eslint-disable-next-line class-methods-use-this
    request(method, url, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const opt = {};
            if (options.json !== false)
                opt.responseType = 'json';
            opt.data = options.data;
            opt.json = options.dataJSON;
            if (options.authenticate !== undefined)
                this.auth.setAuthenticate(options.authenticate);
            opt.auth = this.auth;
            opt.headers = { 'Content-Type': 'application/json' };
            return external_requests_default().session()
                .request(method, url.toString(), opt);
        });
    }
}


;// CONCATENATED MODULE: ./src/libs/twitter/service/account.ts
var account_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class AccountService {
    constructor(auth) {
        this.http = new FetchService(auth);
    }
    verifyLogin() {
        return account_awaiter(this, void 0, void 0, function* () {
            const result = yield this.getSelf();
            return typeof result !== 'string';
        });
    }
    getSelf() {
        return account_awaiter(this, void 0, void 0, function* () {
            if (config/* default */.Z.user_info)
                return config/* default */.Z.user_info;
            const url = 'https://twitter.com/home';
            const html = yield this.http.requests
                .get(url)
                .then(resp => (resp.finalUrl === url ? resp.responseText : null));
            if (!html) {
                console.error('TwitterAPI.account.getSelf', 'can not get response text');
                return { error: true, reason: 'can not get response text' };
            }
            const result = /window.__INITIAL_STATE__=(.*);window.__META_DATA__/.exec(html);
            if (!result) {
                console.error('TwitterAPI.account.getSelf', 'no __INITIAL_STATE__ find');
                return { error: true, reason: 'no __INITIAL_STATE__ find' };
            }
            const initialState = JSON.parse(result[1]);
            const user = new UserFromInitialState(initialState);
            config/* default */.Z.user_info = user;
            return user;
        });
    }
    refreshAuth() {
        this.http.refreshAuth();
    }
    // eslint-disable-next-line class-methods-use-this
    setCSRFToken(ct0) {
        this.http.auth.setCSRFToken(ct0);
    }
}

// EXTERNAL MODULE: ./src/managers/cache.ts
var cache = __webpack_require__(944);
;// CONCATENATED MODULE: ./src/libs/twitter/config.ts
const config_config = {
    twitter_auth_token: 'Bearer AAAAAAAAAAAAAAAAAAAAAPYXBAAAAAAACLXUNDekMxqa8h%2F40K4moUkGsoc%3DTYfbDKbT3jJPCEVnMYqilB28NHfOPqkca3qaAxGfsyKCs0wRbw',
    guest_token_url: 'https://api.twitter.com/1.1/guest/activate.json',
};

;// CONCATENATED MODULE: ./src/libs/twitter/service/auth.ts
var auth_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars



class AuthService {
    // eslint-disable-next-line class-methods-use-this
    get guestTokne() {
        return cache/* default */.Z.get("GUEST_TOKEN" /* Key.GUEST_TOKEN */);
    }
    // eslint-disable-next-line class-methods-use-this
    set guestTokne(token) {
        cache/* default */.Z.set("GUEST_TOKEN" /* Key.GUEST_TOKEN */, token, 10800);
    }
    constructor(ct0) {
        this.authenticate = true;
        this.authToken = config_config.twitter_auth_token;
        this.setCSRFToken(ct0);
    }
    setAuthenticate(authenticate) {
        this.authenticate = authenticate;
        return this;
    }
    setCSRFToken(ct0) {
        this.csrfToken = ct0;
        this.isAuthenticated = !!ct0;
    }
    refresh() {
        return auth_awaiter(this, void 0, void 0, function* () {
            const { guest_token } = yield external_requests_default().post(config_config.guest_token_url, {
                headers: {
                    Authorization: this.authToken,
                },
                responseType: 'json',
            });
            this.guestTokne = guest_token;
        });
    }
    build(header) {
        return auth_awaiter(this, void 0, void 0, function* () {
            // 已经登录，cookie 由浏览器管理
            if (this.authenticate && this.isAuthenticated) {
                header.update({
                    Authorization: this.authToken,
                    'x-csrf-token': this.csrfToken,
                    'x-twitter-auth-type': 'OAuth2Session',
                    'x-twitter-active-user': 'yes',
                    'x-twitter-client-language': 'zh-cn',
                });
            }
            else {
                if (!this.guestTokne) {
                    yield this.refresh();
                }
                header.update({
                    Authorization: this.authToken,
                    'x-guest-token': this.guestTokne,
                });
            }
        });
    }
}

;// CONCATENATED MODULE: ./src/libs/twitter/endpoints.ts
const Endpoint = {
    TweetDetail: {
        queryId: '3XDB26fBve-MmjHaWTUZxA',
        operationName: 'TweetDetail',
        operationType: 'query',
        metadata: {
            featureSwitches: [
                'rweb_lists_timeline_redesign_enabled',
                'responsive_web_graphql_exclude_directive_enabled',
                'verified_phone_label_enabled',
                'creator_subscriptions_tweet_preview_api_enabled',
                'responsive_web_graphql_timeline_navigation_enabled',
                'responsive_web_graphql_skip_user_profile_image_extensions_enabled',
                'tweetypie_unmention_optimization_enabled',
                'responsive_web_edit_tweet_api_enabled',
                'graphql_is_translatable_rweb_tweet_is_translatable_enabled',
                'view_counts_everywhere_api_enabled',
                'longform_notetweets_consumption_enabled',
                'responsive_web_twitter_article_tweet_consumption_enabled',
                'tweet_awards_web_tipping_enabled',
                'freedom_of_speech_not_reach_fetch_enabled',
                'standardized_nudges_misinfo',
                'tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled',
                'longform_notetweets_rich_text_read_enabled',
                'longform_notetweets_inline_media_enabled',
                'responsive_web_media_download_video_enabled',
                'responsive_web_enhance_cards_enabled',
            ],
            fieldToggles: ['withArticleRichContentState'],
        },
        features: {
            rweb_lists_timeline_redesign_enabled: true,
            responsive_web_graphql_exclude_directive_enabled: true,
            verified_phone_label_enabled: false,
            creator_subscriptions_tweet_preview_api_enabled: true,
            responsive_web_graphql_timeline_navigation_enabled: true,
            responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
            tweetypie_unmention_optimization_enabled: true,
            responsive_web_edit_tweet_api_enabled: true,
            graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
            view_counts_everywhere_api_enabled: true,
            longform_notetweets_consumption_enabled: true,
            responsive_web_twitter_article_tweet_consumption_enabled: false,
            tweet_awards_web_tipping_enabled: false,
            freedom_of_speech_not_reach_fetch_enabled: true,
            standardized_nudges_misinfo: true,
            tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
            longform_notetweets_rich_text_read_enabled: true,
            longform_notetweets_inline_media_enabled: true,
            responsive_web_media_download_video_enabled: false,
            responsive_web_enhance_cards_enabled: false,
        },
    },
};
/* harmony default export */ const endpoints = (Endpoint);

;// CONCATENATED MODULE: ./src/libs/twitter/enums/errors.ts
/**
 * Copied from https://github.com/Rishikant181/Rettiwt-API/blob/e2df415c131582d6c534bbbc2976afabd0bbc43e/src/enums/Errors.ts
 */
/**
 * Different type of error messages related to data that are returned by services.
 *
 * @public
 */
var DataErrors;
(function (DataErrors) {
    DataErrors["UserNotFound"] = "An account with given username/id was not found";
    DataErrors["TweetNotFound"] = "A tweet with the given id was not found";
})(DataErrors || (DataErrors = {}));

;// CONCATENATED MODULE: ./src/libs/twitter/helper/parser.ts
/**
 * Copied from https://github.com/Rishikant181/Rettiwt-API/blob/e2df415c131582d6c534bbbc2976afabd0bbc43e/src/services/helper/Parser.ts
 */
/**
 * @returns Whether the given json object is empty or not
 * @param data The input JSON object which needs to be checked
 */
function isJSONEmpty(data) {
    // If the JSON has any keys, it's not empty
    if (Object.keys(data).length === 0) {
        return true;
    }
    // Else, it's empty
    return false;
}
/**
 * @param text The text to be normalized
 * @returns The text after being formatted to remove unnecessary characters
 */
function normalizeText(text) {
    let normalizedText = ''; // To store the normalized text
    // Removing unnecessary full stops, and other characters
    normalizedText = text.replace(/\n/g, '.').replace(/[.]+[\s+.\s+]+/g, '. ');
    // Adding full-stop to the end if does not exist already
    normalizedText = normalizedText.endsWith('.')
        ? normalizedText
        : `${normalizedText}.`;
    return normalizedText;
}

;// CONCATENATED MODULE: ./src/libs/twitter/helper/extractors/tweets.ts
// TYPES

// PARSERS

/**
 * @returns The raw tweet data formatted and sorted into required and additional data
 * @param res The raw response received from TwitterAPI
 * @param tweetId The rest id of the tweet to fetch
 */
function extractTweet(res, tweetId) {
    var _a;
    const required = []; // To store the reqruied raw data
    const cursor = ''; // To store the cursor to next batch
    const users = []; // To store additional user data
    const tweets = []; // To store additional tweet data
    // If tweet does not exist
    if (isJSONEmpty(res.data)) {
        throw new Error(DataErrors.TweetNotFound);
    }
    // Destructuring the received raw data
    (_a = res.data.threaded_conversation_with_injections_v2.instructions
        .filter(item => item.type === 'TimelineAddEntries')[0]
        .entries) === null || _a === void 0 ? void 0 : _a.forEach(entry => {
        var _a, _b, _c;
        // If entry is of type tweet and tweet exists
        if (entry.entryId.indexOf('tweet') !== -1 &&
            ((_b = (_a = entry.content.itemContent) === null || _a === void 0 ? void 0 : _a.tweet_results) === null || _b === void 0 ? void 0 : _b.result.__typename) ===
                'Tweet') {
            // If this is the required tweet
            if (entry.entryId.indexOf(tweetId) !== -1) {
                required.push(entry.content.itemContent.tweet_results.result);
            }
            tweets.push(entry.content.itemContent.tweet_results.result);
            users.push(entry.content.itemContent.tweet_results.result.core
                .user_results.result);
        }
        // If entry if of type conversation
        else if (entry.entryId.indexOf('conversationthread') !== -1) {
            // Iterating over the conversation
            (_c = entry.content.items) === null || _c === void 0 ? void 0 : _c.forEach(item => {
                var _a, _b;
                // If item is of type tweet and tweet exists
                if (item.entryId.indexOf('tweet') !== -1 &&
                    ((_b = (_a = item.item.itemContent.tweet_results) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.__typename) === 'Tweet') {
                    required.push(item.item.itemContent.tweet_results.result);
                    tweets.push(item.item.itemContent.tweet_results.result);
                    users.push(item.item.itemContent.tweet_results.result.core
                        .user_results.result);
                }
            });
        }
    });
    // Returning the data
    return {
        required,
        cursor,
        users,
        tweets,
    };
}

;// CONCATENATED MODULE: ./src/libs/twitter/models/data/tweet.ts
/**
 * Copies from https://github.com/Rishikant181/Rettiwt-API/blob/e2df415c131582d6c534bbbc2976afabd0bbc43e/src/models/data/Tweet.ts
 */

/**
 * The different types parsed entities like urls, media, mentions, hashtags, etc.
 *
 * @internal
 */
class TweetEntities {
    // MEMBER METHODS
    constructor(entities) {
        // MEMBER DATA
        /** The list of hashtags mentioned in the tweet. */
        this.hashtags = [];
        /** The list of urls mentioned in the tweet. */
        this.urls = [];
        /** The list of IDs of users mentioned in the tweet. */
        this.mentionedUsers = [];
        /** The list of urls to various media mentioned in the tweet. */
        this.media = [];
        // Extracting user mentions
        if (entities.user_mentions) {
            for (const user of entities.user_mentions) {
                this.mentionedUsers.push(user.id_str);
            }
        }
        // Extracting urls
        if (entities.urls) {
            for (const url of entities.urls) {
                this.urls.push(url.expanded_url);
            }
        }
        // Extracting hashtags
        if (entities.hashtags) {
            for (const hashtag of entities.hashtags) {
                this.hashtags.push(hashtag.text);
            }
        }
        // Extracting media urls (if any)
        if (entities.media) {
            for (const media of entities.media) {
                this.media.push(media.media_url_https);
            }
        }
    }
}
class TweetMeida {
    constructor(media) {
        this.poster = media.media_url_https;
        this.durationMs = media.video_info.duration_millis;
        const variants = media.video_info.variants
            .map(x => {
            if (x.bitrate === undefined)
                x.bitrate = Infinity;
            return x;
        })
            .sort((a, b) => b.bitrate - a.bitrate);
        this.stream = variants[0].url;
        this.fallback = variants[1].url;
    }
}
class TweetExtendedEntities {
    constructor(extendedEntities) {
        this.media = [];
        extendedEntities.media.forEach(media => {
            this.media.push(new TweetMeida(media));
        });
    }
}
/**
 * The details of a single Tweet.
 *
 * @internal
 */
class Tweet {
    /**
     * @param tweet The raw tweet data.
     */
    constructor(tweet) {
        this.id = tweet.rest_id;
        this.createdAt = tweet.legacy.created_at;
        this.tweetBy = tweet.legacy.user_id_str;
        this.entities = new TweetEntities(tweet.legacy.entities);
        this.extendedEntities = new TweetExtendedEntities(tweet.legacy.extended_entities);
        this.quoted = tweet.legacy.quoted_status_id_str;
        this.fullText = normalizeText(tweet.legacy.full_text);
        this.replyTo = tweet.legacy.in_reply_to_status_id_str;
        this.lang = tweet.legacy.lang;
        this.quoteCount = tweet.legacy.quote_count;
        this.replyCount = tweet.legacy.reply_count;
        this.retweetCount = tweet.legacy.retweet_count;
        this.likeCount = tweet.legacy.favorite_count;
    }
}

;// CONCATENATED MODULE: ./src/libs/twitter/variables.ts
// eslint-disable-next-line no-underscore-dangle
const _Variables = {
    TweetDetail: {
        with_rux_injections: false,
        includePromotedContent: true,
        withCommunity: true,
        withQuickPromoteEligibilityTweetFields: true,
        withBirdwatchNotes: true,
        withVoice: true,
        withV2Timeline: true,
    },
};
class Variables {
    constructor(endpoint, query) {
        this.variables = Object.assign(Object.assign({}, (query !== null && query !== void 0 ? query : {})), _Variables[endpoint.operationName]);
    }
    toString() {
        return JSON.stringify(this.variables);
    }
}
/* harmony default export */ const variables = (Variables);

;// CONCATENATED MODULE: ./src/libs/twitter/url.ts

class Url {
    constructor(endpoint, args) {
        var _a, _b;
        this.baseUrl = 'https://twitter.com/i/api/graphql';
        const url = new URL(`${this.baseUrl}/${endpoint.queryId}/${endpoint.operationName}`);
        url.searchParams.set('variables', new variables(endpoint, { focalTweetId: args.id }).toString());
        url.searchParams.set('features', JSON.stringify(endpoint.features));
        if (((_a = endpoint.metadata) === null || _a === void 0 ? void 0 : _a.fieldToggles.length) > 0)
            url.searchParams.set('fieldToggles', JSON.stringify(Object.fromEntries((_b = endpoint.metadata) === null || _b === void 0 ? void 0 : _b.fieldToggles.map(key => [key, false]))));
        this.url = url;
    }
    toString() {
        return this.url.toString();
    }
}

;// CONCATENATED MODULE: ./src/libs/twitter/service/tweet.ts
var tweet_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






class TweetService {
    constructor(auth) {
        this.http = new FetchService(auth);
    }
    getTweetDetail(id) {
        return tweet_awaiter(this, void 0, void 0, function* () {
            const cachedData = cache/* default */.Z.get(id);
            if (cachedData) {
                return cachedData;
            }
            const url = new Url(endpoints.TweetDetail, { id });
            const ret = yield this.http.get(url);
            // Fetching the raw data
            const data = extractTweet(ret, id);
            // Parsing data
            const tweet = new Tweet(data.required[0]);
            // Caching data
            cache/* default */.Z.set(id, tweet);
            return tweet;
        });
    }
}

;// CONCATENATED MODULE: ./src/libs/twitter/service/user.ts
var user_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class UserService {
    constructor(auth) {
        this.http = fetch_namespaceObject;
        this.auth = auth;
    }
    getSelf() {
        return user_awaiter(this, void 0, void 0, function* () {
            if (config/* default */.Z.user_info)
                return config/* default */.Z.user_info;
            const url = 'https://twitter.com/home';
            const html = yield this.http.requests
                .get(url)
                .then(resp => (resp.finalUrl === url ? resp.responseText : null));
            if (!html)
                return null;
            const result = /window.__INITIAL_STATE__=(.*);window.__META_DATA__/.exec(html);
            if (!result)
                return null;
            const initialState = JSON.parse(result[1]);
            const user = new UserFromInitialState(initialState);
            config/* default */.Z.user_info = user;
            return user;
        });
    }
}

;// CONCATENATED MODULE: ./src/libs/twitter/index.ts




let api;
function TwitterAPI(ct0) {
    if (!api) {
        const auth = new AuthService(ct0);
        api = {
            account: new AccountService(auth),
            user: new UserService(auth),
            tweet: new TweetService(auth),
        };
    }
    else if (ct0 && ct0 !== '') {
        api.account.setCSRFToken(ct0);
    }
    return api;
}


/***/ }),

/***/ 944:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(450);

const MAXTTL = 7 * 24 * 3600;
class Data {
    constructor(value, ttl, timestamp = false) {
        this.value = value;
        const now = Math.floor(Date.now() / 1000);
        this.lastActive = now;
        this.ttl = timestamp ? ttl - now : ttl;
        this.refresh = !timestamp;
    }
    isDead() {
        const now = Math.floor(Date.now() / 1000);
        if (this.refresh)
            this.lastActive = now;
        return now - this.lastActive >= this.ttl;
    }
}
class Cache extends _manager__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z {
    constructor() {
        super("cache" /* Key.CACHE */);
        this.dataSet = oldViersonHandler(this.dataSet);
    }
    get(key) {
        const data = this.dataSet[key];
        if (!data)
            return undefined;
        if (data.isDead()) {
            delete this.dataSet[key];
            data.value = undefined;
        }
        this.dump();
        return data.value;
    }
    set(key, value, expire = MAXTTL, timestamp = false) {
        this.dataSet[key] = new Data(value, expire, timestamp);
        this.dump();
    }
    clean() {
        const dataSet = this.dataSet;
        for (const key of Object.keys(dataSet)) {
            const data = dataSet[key];
            if (data.isDead())
                delete dataSet[key];
        }
        this.dump();
    }
    clear() {
        this.dataSet = {};
        this.dump();
    }
    ttl(key, ttl) {
        if (ttl)
            this.dataSet[key].ttl = ttl;
        return this.dataSet[key].ttl;
    }
}
function oldViersonHandler(dataSet) {
    return Object.fromEntries(Object.entries(dataSet).map(([key, val]) => {
        const { value, timestamp, lastActive } = val;
        const data = new Data(value, MAXTTL);
        data.lastActive = timestamp !== null && timestamp !== void 0 ? timestamp : lastActive;
        return [key, data];
    }));
}
const cache = new Cache();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cache);


/***/ }),

/***/ 137:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(450);

class Config extends _manager__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z {
    constructor() {
        super("config" /* Key.CONFIG */);
    }
    get(key) {
        return this.dataSet[key];
    }
    set(key, value) {
        this.dataSet[key] = value;
        this.dump();
    }
    delete(key) {
        delete this.dataSet[key];
        this.dump();
    }
}
const config = new Proxy(new Config(), {
    get(target, prop) {
        return target.get(prop);
    },
    set(target, prop, value) {
        target.set(prop, value);
        return true;
    },
    deleteProperty(target, property) {
        target.delete(property);
        return true;
    },
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);


/***/ }),

/***/ 450:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ Manager)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(803);

class Manager {
    constructor(name) {
        this.name = name;
        this.dump = _utils_utils__WEBPACK_IMPORTED_MODULE_0__/* .dump */ .$w;
        this.dataSet = GM_getValue(name, {});
    }
}


/***/ }),

/***/ 803:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  $w: () => (/* binding */ dump),
  E8: () => (/* binding */ insertHlsPlayer),
  f4: () => (/* binding */ insertIFrameElement),
  aS: () => (/* binding */ insertVideoElement),
  _C: () => (/* binding */ isUpdated)
});

// UNUSED EXPORTS: debounce

;// CONCATENATED MODULE: external "Hls"
const external_Hls_namespaceObject = Hls;
var external_Hls_default = /*#__PURE__*/__webpack_require__.n(external_Hls_namespaceObject);
;// CONCATENATED MODULE: ./src/view/iframe.html
// Module
var code = "<div style=\"position:relative;padding:30% 45%\"> <iframe class=\"embed lazy\" style=\"position:absolute;width:100%;height:100%;left:0;top:0\" referrerpolicy=\"no-referrer\"></iframe> </div> ";
// Exports
/* harmony default export */ const view_iframe = (code);
;// CONCATENATED MODULE: ./src/view/video.html
// Module
var video_code = "<div style=\"position:relative;padding:30% 45%\"> <video class=\"volume-sync\" style=\"position:absolute;width:100%;height:100%;left:0;top:0\" controls></video> </div> ";
// Exports
/* harmony default export */ const view_video = (video_code);
;// CONCATENATED MODULE: ./src/utils/utils.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/* eslint-disable func-names */
// eslint-disable-next-line import/no-extraneous-dependencies



/**
 * 防抖
 * @param fn 回调
 * @param timeout 间隔
 */
function debounce(fn, timeout) {
    let timer;
    return function (...rest) {
        window.clearTimeout(timer);
        timer = window.setTimeout(fn.bind(this, ...rest), timeout);
    };
}
const dump = debounce(function () {
    GM.setValue(this.name, this.dataSet);
}, 200);
function insertVideoElement(a, attrs) {
    if (typeof attrs === 'string' /* 直接传入 URL */) {
        const src = attrs;
        attrs = { src };
    }
    const $htmlText = jQuery(view_video);
    const $video = jQuery('video', $htmlText);
    $video.attr(attrs);
    $htmlText.insertBefore(a);
    const video = $video[0];
    return { video, attrs };
}
function insertHlsPlayer(a, attributes) {
    const { video, attrs } = insertVideoElement(a, attributes);
    // apple 平台原生支持 hls，无需处理
    if (!/Mac|iPod|iPhone|iPad/.test(navigator.userAgent)) {
        if (external_Hls_default().isSupported()) {
            const hls = new (external_Hls_default())();
            hls.loadSource(attrs.src);
            hls.attachMedia(video);
            hls.on((external_Hls_default()).Events.MANIFEST_PARSED, function (event, data) {
                data.levels.sort((x, y) => y.bitrate - x.bitrate);
                hls.currentLevel = 0;
            });
        }
        else {
            console.log('Hls不支持当前浏览器');
            if (attrs.fallback)
                video.src = attrs.fallback;
        }
    }
}
function bindVolumeSync() {
    return __awaiter(this, void 0, void 0, function* () {
        let volume = yield GM.getValue("lastVolume" /* Key.VOLUME */, 1);
        jQuery('video.volume-sync')
            .on('volume-sync', function (_, volume_) {
            this.volume = volume_;
        })
            .on('mouseover', function () {
            jQuery(this).on('volumechange', debounce(function () {
                volume = this.volume;
                GM.setValue("lastVolume" /* Key.VOLUME */, volume);
                jQuery('video.volume-sync')
                    .not(this)
                    .trigger('volume-sync', volume);
            }, 200));
        })
            .on('mouseout', function () {
            jQuery(this).off('volumechange');
        });
    });
}
// $.on 对未来的元素有效，因此直接执行即可
bindVolumeSync();
const observer = new IntersectionObserver(entries => {
    entries
        .filter(entry => entry.isIntersecting)
        .forEach(entry => {
        console.log('lazyload');
        const e = entry.target;
        e.src = e.dataset.src;
        e.classList.replace('lazy', 'loaded');
        observer.unobserve(e);
    });
}, {
    rootMargin: '0px 0px 640px',
});
function insertIFrameElement(a, attributes) {
    const { src } = attributes, attrs = __rest(attributes, ["src"]);
    attrs['data-src'] = src;
    const $div = jQuery(view_iframe);
    const iframe = jQuery('iframe', $div).attr(attrs)[0];
    observer.observe(iframe);
    $div.insertBefore(a);
}
function toNumber(version) {
    const v = version.replace('alpha', '-2').replace('beta', '-1');
    return v.split('.').map(x => parseInt(x, 10));
}
function shiftDefault(array, default_) {
    const val = array.shift();
    if (val === undefined)
        return default_;
    return val;
}
function laterThan(newer, local) {
    const v1 = toNumber(newer);
    const v2 = toNumber(local);
    let a;
    let b;
    while (v1.length || v2.length) {
        a = shiftDefault(v1, 0);
        b = shiftDefault(v2, 0);
        if (a > b)
            return true;
    }
    return false;
}
function isUpdated(callback) {
    GM.getValue("version" /* Key.VERSION */, '0.0.0').then(localVersion => {
        if (laterThan(GM_info.script.version, localVersion)) {
            callback();
            GM.setValue("version" /* Key.VERSION */, GM_info.script.version);
        }
    });
}


/***/ }),

/***/ 173:
/***/ ((module) => {

"use strict";
module.exports = requests;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var __webpack_exports__ = {};
/* unused harmony export default */
/* harmony import */ var gm_requests__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(173);
/* harmony import */ var gm_requests__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(gm_requests__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _managers_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(944);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(803);
/* harmony import */ var _handler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(537);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// eslint-disable-next-line import/no-extraneous-dependencies




class BilibiliHandler {
    constructor() {
        this.regex = /b23.tv|(?<bvid>BV[a-lm-zA-HJ-NP-Z1-9]{10})/;
    }
    test(a) {
        const result = this.regex.exec(a.href);
        if (result)
            this.bvid = result[1];
        return !!result;
    }
    apply(a) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = a.href;
            if (!this.bvid) {
                // b23.tv
                const cached = _managers_cache__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.get(url);
                if (!cached) {
                    yield this.parseShortURL(url);
                    this.apply(a);
                    return;
                }
                console.log('cached:', url);
                url = cached;
                this.bvid = this.regex.exec(url)[1];
            }
            const result = /p=(?<pid>\d+)/.exec(url);
            const pid = result ? parseInt(result.groups.pid, 10) : 1;
            const cachedInfo = _managers_cache__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.get(this.bvid);
            let aid;
            let cid;
            if (cachedInfo) {
                console.log('cached', a.href);
                ({ aid, cid } = cachedInfo);
                this.insertIframe(a, aid, cid, pid);
                return;
            }
            const ret = yield gm_requests__WEBPACK_IMPORTED_MODULE_0___default().get('https://api.bilibili.com/x/web-interface/view', { bvid: this.bvid }, { responseType: 'json' });
            aid = ret.data.aid;
            cid = ret.data.pages[pid - 1].cid;
            _managers_cache__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.set(ret.data.bvid, { aid, cid });
            this.insertIframe(a, aid, cid, pid);
        });
    }
    parseShortURL(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield gm_requests__WEBPACK_IMPORTED_MODULE_0___default().get(url, null, { anonymous: true });
            _managers_cache__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.set(url, resp.finalUrl);
            const result = this.regex.exec(resp.finalUrl);
            if (result)
                this.bvid = result[1];
        });
    }
    insertIframe(a, aid, cid, pid) {
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__/* .insertIFrameElement */ .f4)(a, {
            src: `https://player.bilibili.com/player.html?aid=${aid}&bvid=${this.bvid}&cid=${cid}&page=${pid}&as_wide=1&high_quality=1&danmaku=0&autoplay=0`,
            frameborder: 'no',
            scrolling: 'no',
            allowfullscreen: true,
        });
    }
}
_handler__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.registerHandler(BilibiliHandler);

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var __webpack_exports__ = {};
/* unused harmony export default */
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(803);
/* harmony import */ var _handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(537);


class BrowserSupportedHandler {
    constructor() {
        this.regex = /(mp4|mov)$/i;
    }
    test(a) {
        return this.regex.test(a.href);
    }
    // eslint-disable-next-line class-methods-use-this
    apply(a) {
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__/* .insertVideoElement */ .aS)(a, { src: a.href });
    }
}
_handler__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.registerHandler(BrowserSupportedHandler);

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var __webpack_exports__ = {};
/* unused harmony export default */
/* harmony import */ var gm_requests__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(173);
/* harmony import */ var gm_requests__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(gm_requests__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _managers_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(944);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(803);
/* harmony import */ var _handler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(537);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// eslint-disable-next-line import/no-extraneous-dependencies




const MAX_EXPIRE_SECOND = 5 * 24 * 3600;
class HlsParser {
    parse(url) {
        return __awaiter(this, void 0, void 0, function* () {
            this.baseUrl = url.substring(0, url.lastIndexOf('/'));
            const ret = yield gm_requests__WEBPACK_IMPORTED_MODULE_0___default().get(url, null, { anonymous: true });
            this.hlsString = ret.response;
            this.addBaseUrl();
            return this.hlsString;
        });
    }
    addBaseUrl() {
        this.hlsString = this.hlsString.replace(/^(?!#)(\S+)/gm, `${this.baseUrl}/$1`);
    }
}
class JiuseHandler {
    constructor() {
        this.regex = /(?:91porny|jiuse|9s\d{3}.xyz|js(?:tv\d?|\d{3}).cc).+\/(\w+)/;
        this.parser = new HlsParser();
    }
    test(a) {
        const result = this.regex.exec(a.href);
        if (result)
            this.id = result[1];
        return !!result;
    }
    apply(a) {
        return __awaiter(this, void 0, void 0, function* () {
            let attrs = this.getCacheData();
            if (!attrs) {
                attrs = yield this.getAttrs();
            }
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__/* .insertHlsPlayer */ .E8)(a, attrs);
        });
    }
    getCacheData() {
        this.key = `jiuse-${this.id}`;
        const cachedInfo = _managers_cache__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.get(this.key);
        if (cachedInfo) {
            console.log('cached:', this.key);
            return {
                src: JiuseHandler.createLevelFileURL(window.atob(cachedInfo.hlsString)),
                poster: cachedInfo.poster,
            };
        }
        return undefined;
    }
    getAttrs() {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield gm_requests__WEBPACK_IMPORTED_MODULE_0___default().get(`https://91porny.com/video/embed/${this.id}`);
            const $video = jQuery(resp.responseText, document.implementation.createHTMLDocument('virtual')).filter('#video-play');
            const url = $video.data('src');
            const poster = $video.data('poster');
            const expireAt = Math.floor(Date.now() / 1000 + MAX_EXPIRE_SECOND);
            const hlsString = yield this.parser.parse(url);
            _managers_cache__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.set(this.key, { hlsString: window.btoa(hlsString), poster }, expireAt);
            return {
                src: JiuseHandler.createLevelFileURL(hlsString),
                poster,
            };
        });
    }
    static createLevelFileURL(hlsString) {
        return URL.createObjectURL(new File([hlsString], 'index.m3u8', {
            type: 'text/plain',
        }));
    }
}
_handler__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.registerHandler(JiuseHandler);

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var __webpack_exports__ = {};
/* unused harmony export default */
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(382);
/* harmony import */ var _libs_twitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(504);
/* harmony import */ var _managers_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(137);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(803);
/* harmony import */ var _handler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(537);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





const PREFER_STREAM_MIN_DURATION = 5 * 60 * 1000; // ms
class TweetVideo {
    constructor(media) {
        this.durationMs = 0;
        this.poster = media.poster;
        this.durationMs = media.durationMs;
        this.isStream = this.durationMs > PREFER_STREAM_MIN_DURATION;
        this.src = this.isStream ? media.stream : media.fallback;
        this.fallback = media.fallback;
    }
    dump() {
        const data = { src: this.src };
        if (this.poster)
            data.poster = this.poster;
        if (this.isStream)
            data.fallback = this.fallback;
        return data;
    }
}
class TwitterHandler {
    constructor() {
        this.regex = /video.twimg.com|twitter.com\/.*\/status\/(?<id>\d+)/;
        this.twitter = (0,_libs_twitter__WEBPACK_IMPORTED_MODULE_1__/* .TwitterAPI */ .I)(_managers_config__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z.ct0);
    }
    test(a) {
        const result = this.regex.exec(a.href);
        if (result)
            this.id = result.groups.id;
        return !!result;
    }
    apply(a) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id === undefined) {
                // twimg.com
                (0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__/* .insertVideoElement */ .aS)(a, a.href);
                return;
            }
            if (!this.checkCT0()) {
                (0,_events__WEBPACK_IMPORTED_MODULE_0__/* .defaultEventEmitter */ .sd)().trigger(_events__WEBPACK_IMPORTED_MODULE_0__/* .Events */ .zW.VIEW_SHOW_TWITTER_GUEST);
                return;
            }
            const tweet = yield this.twitter.tweet
                .getTweetDetail(this.id)
                .catch(e => console.error(e));
            if (!tweet)
                return;
            tweet.extendedEntities.media
                .map(media => new TweetVideo(media))
                .forEach(video => {
                const attrs = video.dump();
                if (video.isStream)
                    (0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__/* .insertHlsPlayer */ .E8)(a, attrs);
                else
                    (0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__/* .insertVideoElement */ .aS)(a, attrs);
            });
        });
    }
    // eslint-disable-next-line class-methods-use-this
    checkCT0() {
        return !!(_managers_config__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z.as_guest || _managers_config__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z.ct0);
    }
}
_handler__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z.registerHandler(TwitterHandler);

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var __webpack_exports__ = {};
/* unused harmony export default */
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(803);
/* harmony import */ var _handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(537);


class YouTubeHandler {
    constructor() {
        this.regex = /(youtu.be\/|youtube.com\/(?:(?:embed|v|shorts)\/|watch\?v=))(?<vid>[\w-]+)/;
    }
    test(a) {
        var _a;
        this.vid = (_a = this.regex.exec(a.href)) === null || _a === void 0 ? void 0 : _a.groups.vid;
        return !!this.vid;
    }
    apply(a) {
        const result = /t|start=(?<t>\d+)s?/.exec(a.href);
        let start;
        if (result)
            start = result[1];
        const url = new URL(this.vid, 'https://www.youtube.com/embed/');
        if (start)
            url.searchParams.set('start', start);
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__/* .insertIFrameElement */ .f4)(a, {
            src: url.toString(),
            allowfullscreen: true,
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        });
    }
}
_handler__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.registerHandler(YouTubeHandler);

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./src/events.ts
var events = __webpack_require__(382);
// EXTERNAL MODULE: ./src/libs/twitter/index.ts + 14 modules
var twitter = __webpack_require__(504);
// EXTERNAL MODULE: ./src/managers/config.ts
var config = __webpack_require__(137);
;// CONCATENATED MODULE: ./src/controllers/twitter.ts
/* eslint-disable import/prefer-default-export */



const emitter = (0,events/* defaultEventEmitter */.sd)();
const TWITTER_LOGIN_URL = 'https://twitter.com/login';
class TwitterDialog {
    constructor() {
        this.registerListeners();
    }
    // eslint-disable-next-line class-methods-use-this
    trigger(event, ...datas) {
        return () => emitter.trigger(event, ...datas);
    }
}
class TwitterCT0Dialog extends TwitterDialog {
    constructor() {
        super(...arguments);
        this.twitter = (0,twitter/* TwitterAPI */.I)();
    }
    registerListeners() {
        emitter.on(events/* Events */.zW.VIEW_SHOW_TWITTER_CT0, this.initView, this);
        emitter.on(events/* Events */.zW.TWITTER_VERIFY, this.verify, this);
    }
    verify() {
        jQuery('#loading-overlay', this.$dialog).fadeIn(200);
        const ct0 = jQuery('#pin').val();
        if (!ct0)
            return;
        config/* default */.Z.as_guest = false;
        config/* default */.Z.ct0 = ct0;
        this.twitter.account.setCSRFToken(ct0);
        this.twitter.account
            .getSelf()
            .then(ret => {
            if (!isError(ret)) {
                emitter.trigger(events/* Events */.zW.VIEW_SHOW_TWITTER_LOGGEDIN);
                emitter.trigger(events/* Events */.zW.MENU_REGISTER_AUTHORIZATION);
                jQuery('.gm-btn-close', this.$dialog).trigger('click');
                return;
            }
            jQuery('#error-msg', this.$dialog).text(ret.reason);
            jQuery('.gm-toggle', this.$dialog).fadeOut(() => jQuery('.error', this.$dialog).fadeIn());
            this.twitter.account.setCSRFToken('');
            config/* default */.Z.ct0 = undefined;
        })
            .finally(() => jQuery('#loading-overlay', this.$dialog).fadeOut());
    }
    initView() {
        this.$dialog = jQuery('#twitter-ct0').fadeIn(200);
        jQuery('#gm-verify-btn', this.$dialog).on('click', this.trigger(events/* Events */.zW.TWITTER_VERIFY));
    }
}
class TwitterLoggedInDialog extends TwitterDialog {
    registerListeners() {
        emitter.on(events/* Events */.zW.VIEW_SHOW_TWITTER_LOGGEDIN, this.initView, this);
    }
    initView() {
        this.$dialog = jQuery('#twitter-logged-in').fadeIn(200);
        if (!config/* default */.Z.user_info) {
            jQuery('#loading-overlay', this.$dialog).fadeIn(200);
            (0,twitter/* TwitterAPI */.I)()
                .account.getSelf()
                .then(ret => {
                if (isError(ret))
                    return;
                this.setUserInfo(ret);
            })
                .finally(() => jQuery('#loading-overlay', this.$dialog).fadeOut());
        }
        this.setUserInfo(config/* default */.Z.user_info);
    }
    setUserInfo(user) {
        jQuery('#user-avatar', this.$dialog).attr('src', user.profileImage);
        jQuery('#user-name', this.$dialog).text(user.fullName);
        jQuery('#user-id', this.$dialog).text(`@${user.userName}`);
    }
}
class TwitterGuestDialog extends TwitterDialog {
    registerListeners() {
        emitter.on(events/* Events */.zW.VIEW_SHOW_TWITTER_GUEST, this.initView, this);
    }
    initView() {
        this.$dialog = jQuery('#twitter-guest').fadeIn(200);
        config/* default */.Z.as_guest = true;
        jQuery('.gm-btn-login', this.$dialog).on('click', () => {
            GM_openInTab(TWITTER_LOGIN_URL, false);
            this.showCT0View();
        });
        jQuery('.gm-btn-logged', this.$dialog).on('click', () => {
            this.showCT0View();
        });
    }
    showCT0View() {
        config/* default */.Z.as_guest = false;
        this.$dialog.fadeOut(this.trigger(events/* Events */.zW.VIEW_SHOW_TWITTER_CT0));
    }
}
emitter.on(events/* Events */.zW.TWITTER_REAUTHORIZE, () => {
    // eslint-disable-next-line no-alert
    alert('Twitter 授权错误或过期，请重新授权！');
    delete config/* default */.Z.access_token;
    emitter.trigger(events/* Events */.zW.VIEW_SHOW_TWITTER_GUEST);
    emitter.trigger(events/* Events */.zW.MENU_REGISTER_AUTHORIZATION);
});
function isError(obj) {
    return obj.error !== undefined;
}

;// CONCATENATED MODULE: ./src/controllers/inedx.ts

const controllers = [
    TwitterCT0Dialog,
    TwitterGuestDialog,
    TwitterLoggedInDialog,
];
function registerControllers() {
    controllers.forEach(Controller => new Controller());
}

// EXTERNAL MODULE: ./src/handlers/handler.ts
var handler = __webpack_require__(537);
;// CONCATENATED MODULE: ./src/handlers/index.ts

/* harmony default export */ const handlers = (handler/* default */.Z);

// EXTERNAL MODULE: ./src/managers/cache.ts
var cache = __webpack_require__(944);
;// CONCATENATED MODULE: ./src/menu/menu.ts



const menu_emitter = (0,events/* defaultEventEmitter */.sd)();
let GM_authorization_menu_id;
const menu = {
    authorization() {
        function isAuthorized() {
            return config/* default */.Z && config/* default */.Z.user_info !== undefined && config/* default */.Z.ct0;
        }
        if (GM_authorization_menu_id !== undefined) {
            GM_unregisterMenuCommand(GM_authorization_menu_id);
        }
        if (isAuthorized()) {
            GM_authorization_menu_id = GM_registerMenuCommand(`✔️登录用户：${config/* default */.Z.user_info.fullName} (@${config/* default */.Z.user_info.userName})`, () => menu_emitter.trigger(events/* Events */.zW.VIEW_SHOW_TWITTER_LOGGEDIN));
        }
        else if (!(config/* default */.Z === null || config/* default */.Z === void 0 ? void 0 : config/* default */.Z.ct0)) {
            GM_authorization_menu_id = GM_registerMenuCommand(`⭕点击输入 ct0`, () => menu_emitter.trigger(events/* Events */.zW.VIEW_SHOW_TWITTER_CT0));
        }
        else {
            GM_authorization_menu_id = GM_registerMenuCommand(`❌未登录，点击登录`, () => menu_emitter.trigger(events/* Events */.zW.VIEW_SHOW_TWITTER_GUEST));
        }
    },
    clearCache() {
        GM_registerMenuCommand('清除脚本缓存（解决莫名其妙的加载问题）', () => {
            cache/* default */.Z.clear();
            const $success = jQuery(`<div class="gm-dialog"><div class="success-box gm-dialog"><p>操作成功！</p></div></div>`);
            $success.hide().appendTo(document.body).fadeIn(200);
            setTimeout(() => $success.fadeOut(() => $success.remove()), 1400);
        });
    },
    reportIssue() {
        GM_registerMenuCommand('报告问题', () => {
            GM_openInTab('https://github.com/bigbowl-wtw/SouthPlusVideoPlayer/issues', true);
        });
    },
};
menu_emitter.on(events/* Events */.zW.MENU_REGISTER_AUTHORIZATION, menu.authorization);
function registerMenuCommand() {
    for (const register of Object.values(menu))
        register();
}

// EXTERNAL MODULE: ./src/utils/utils.ts + 3 modules
var utils = __webpack_require__(803);
// EXTERNAL MODULE: ./src/update-information.txt
var update_information = __webpack_require__(264);
var update_information_default = /*#__PURE__*/__webpack_require__.n(update_information);
;// CONCATENATED MODULE: ./src/view/ct0.html
// Module
var code = "<div class=\"gm-dialog\" id=\"twitter-ct0\"> <h1>Twitter 账户</h1> <div id=\"pin-verifier\" class=\"gm-toggle\"> <p>你已经在 Twitter 登录，请填入你的 ct0 以在本站使用 Twitter API。</p> <p>获取 ct0 的方法请参见 <a href=\"/read.php?tid=1899700#26504410\" target=\"_blank\">这里</a></p> <label for=\"pin\" style=\"font-size:.8em\">ct0：</label> <input class=\"pin\" type=\"text\" placeholder=\"输入 ct0\" id=\"pin\"> <button id=\"gm-verify-btn\" class=\"gm-btn gm-btn-primary\">验证</button> </div> <div class=\"error\" style=\"display:none\"> <p>发生了下面的错误：</p> <p id=\"error-msg\"></p> </div> <p>风险提示：由于使用未经 Twitter 公布的 API，可能会导致 Twitter 账户被封禁，请谨慎考虑。</p> <p>所有数据都保存在本地，脚本不会向任何第三方发送数据。</p> <div class=\"gm-dialog-footer\"> <button class=\"gm-btn gm-btn-danger error\">重新打开</button> <button class=\"gm-btn gm-btn-secondary gm-btn-close\">关闭</button> </div> <div id=\"loading-overlay\" class=\"loading-overlay\" style=\"display:none\"> <div class=\"loading-spinner\"></div> </div> </div>";
// Exports
/* harmony default export */ const ct0 = (code);
;// CONCATENATED MODULE: ./src/view/guest.html
// Module
var guest_code = "<div class=\"gm-dialog\" id=\"twitter-guest\"> <h1>Twitter 账户</h1> <p class=\"gm-toggle\">没有登录 Twitter 账户</p> <p>Twitter API 将使用访客授权，可能会受到 NSFW 内容限制</p> <p>如果你之前已经在 Twitter 登录，点击“已经登录”</p> <button class=\"gm-btn gm-btn-primary gm-btn-login\">去登录</button> <button class=\"gm-btn gm-btn-primary gm-btn-logged\">已经登录</button> <div class=\"gm-dialog-footer\"> <button class=\"gm-btn gm-btn-secondary gm-btn-close\">关闭</button> </div> </div> ";
// Exports
/* harmony default export */ const guest = (guest_code);
;// CONCATENATED MODULE: ./src/view/logged-in.html
// Module
var logged_in_code = "<div class=\"gm-dialog\" id=\"twitter-logged-in\"> <h1>Twitter 账户</h1> <div id=\"user-profile\" class=\"user-profile\"> <label for=\"user-profile\" style=\"margin-right:5px\">登录账户：</label> <div class=\"avatar\"> <img id=\"user-avatar\" src=\"\" alt=\"User Avatar\"/> </div> <div class=\"user-details\"> <div id=\"user-name\"></div> <div id=\"user-id\"></div> </div> </div> <p>风险提示：由于使用为未经 Twitter 公布的 API，可能会导致 Twitter 账户被封禁，请谨慎考虑。</p> <p>要使用访客身份使用本脚本，请在 Twitter 退出登录。</p> <p>所有数据都保存在本地，脚本不会向任何第三方发送数据。</p> <div class=\"gm-dialog-footer\"> <button class=\"gm-btn gm-btn-secondary gm-btn-close\">关闭</button> </div> <div id=\"loading-overlay\" class=\"loading-overlay\" style=\"display:none\"> <div class=\"loading-spinner\"></div> </div> </div>";
// Exports
/* harmony default export */ const logged_in = (logged_in_code);
;// CONCATENATED MODULE: ./src/view/style.css
// Module
var style_code = ".gm-dialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); width: 400px; } .gm-btn { border: 1px solid; padding: 5px 16px; border-radius: 6px; transition: background-color 0.3s ease; line-height: 20px; } .gm-btn:hover { cursor: pointer; } .gm-btn-primary { background-color: #1f883d; color: #fff; margin-left: 10px; } .gm-btn-primary:hover { background-color: #0f672b; } .gm-btn-secondary { background-color: #6c757d; color: #fff; } .gm-btn-secondary:hover { background-color: #5a6268; } .gm-btn-danger { background-color: #dc3545; color: #fff; margin-left: auto; margin-right: 10px; } .gm-btn-danger:hover { background-color: #bd2130; } .gm-dialog-footer { text-align: right; margin-top: 20px; } .pin { font-size: 14px; line-height: 20px; padding: 5px 12px; border: 1px solid #d0d7de; border-radius: 6px; box-shadow: inset 0 1px 0 rgba(208, 215, 222, 0.2); transition: background-color 0.3s ease; transition-property: color, background-color, box-shadow, border-color; } .pin:hover { background-color: #f6f7fa; } .loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 9999; display: flex; justify-content: center; align-items: center; } .loading-spinner { border: 5px solid rgba(255, 255, 255, 0.3); border-top: 5px solid #fff; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .user-profile { display: flex; align-items: center; margin-bottom: 20px; } .avatar { width: 50px; height: 50px; border-radius: 50%; margin-left: 15px; overflow: hidden; } .avatar img { width: 100%; height: 100%; object-fit: cover; } .user-details { height: 50px; display: flex; flex-direction: column; justify-content: center; margin-left: 10px; } .user-name { font-weight: bold; font-size: 16px; } .user-id { font-size: 14px; color: #666; } .success-box { display: flex; justify-content: center; align-items: center; width: 200px; height: 50px; background-color: #4caf50; color: white; font-size: 25px; font-weight: bold; border-radius: 20px; } ";
// Exports
/* harmony default export */ const style = (style_code);
;// CONCATENATED MODULE: ./src/view/update-information.html
// Module
var update_information_code = "<div class=\"gm-dialog\" id=\"update-information\"> <h1>更新信息</h1> {{ content }} <div class=\"gm-dialog-footer\"> <button class=\"gm-btn gm-btn-secondary gm-btn-close\">关闭</button> <button class=\"gm-btn gm-btn-primary gm-btn-open\">打开</button> </div> </div>; ";
// Exports
/* harmony default export */ const view_update_information = (update_information_code);
;// CONCATENATED MODULE: ./src/view/index.ts







// eslint-disable-next-line prettier/prettier
const views = [
    ct0,
    logged_in,
    guest,
    view_update_information.replace('{{ content }}', update_information_default().replace('\r', '')
        .split('\n')
        .map(c => `<p>${c}</p>`)
        .join('')),
];
const INTRO_POST = `${document.location.origin}/read.php?tid=1899700`;
const view_emitter = (0,events/* defaultEventEmitter */.sd)();
function initViews() {
    GM_addStyle(style);
    views.forEach(view => {
        jQuery(view).hide().appendTo(document.body);
    });
    jQuery('#update-information')
        .filter('.gm-btn-open')
        .on('click', () => GM_openInTab(INTRO_POST, false));
    jQuery('.gm-btn-close').on('click', ({ target }) => jQuery(target).parents('.gm-dialog').fadeOut());
    view_emitter.on(events/* Events */.zW.SHOW_UPDATE_INFORMATION, () => {
        jQuery('#update-information').fadeIn();
    });
}

;// CONCATENATED MODULE: ./src/index.ts



// import cache from './managers/cache';
// import config from './managers/config';



const NOTIFY = false;
(0,utils/* isUpdated */._C)(() => {
    if (NOTIFY)
        (0,events/* defaultEventEmitter */.sd)().trigger(events/* Events */.zW.SHOW_UPDATE_INFORMATION);
    // v5.0.0: 更新了 twitter api，采用新的授权方式，清除旧数据
    // delete config.user_info;
    // delete config.access_token;
    // cache.clear();
    // v5.0.0: 检测是否登录
    // defaultEventEmitter().trigger(Events.VIEW_SHOW_TWITTER_GUEST);
});
registerMenuCommand();
initViews();
registerControllers();
handlers.process();

})();

/******/ })()
;