// ==UserScript==
// @name        Check new posts in Nico Community
// @name:ja     ニコニコミュニティ掲示板 新着チェック
// @description This script was deleted from Greasy Fork, and due to its negative effects, it has been automatically removed from your browser.
// @description:ja ニコニコミュニティ掲示板をウォッチリストに登録し、最終レス日時を取得します。
// @namespace   https://greasyfork.org/ja/users/137
// @version     2.1.1.1
// @match       https://dic.nicovideo.jp/p/my/watchlist/rev_or_res_created/desc
// @match       https://dic.nicovideo.jp/p/my/watchlist/rev_or_res_created/desc/*
// @match       https://dic.nicovideo.jp/p/my/watchlist/rev_or_res_created/desc?*
// @match       https://dic.nicovideo.jp/p/my/watchlist/rev_or_res_created/desc#*
// @match       https://dic.nicovideo.jp/p/my/watchlist/res_created/desc
// @match       https://dic.nicovideo.jp/p/my/watchlist/res_created/desc/*
// @match       https://dic.nicovideo.jp/p/my/watchlist/res_created/desc?*
// @match       https://dic.nicovideo.jp/p/my/watchlist/res_created/desc#*
// @match       https://com.nicovideo.jp/community/*
// @license     MPL-2.0
// @compatible  Firefox 次のサイトのサードパーティCookieを許可する必要があります / You need to allow third-party cookies from the following sites: https://dic.nicovideo.jp https://com.nicovideo.jp
// @compatible  Opera
// @compatible  Chrome
// @grant       GM.registerMenuCommand
// @grant       GM_registerMenuCommand
// @grant       GM.openInTab
// @grant       GM_openInTab
// @grant       GM.setValue
// @grant       GM_setValue
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.notification
// @grant       GM_notification
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @connect     dic.nicovideo.jp
// @connect     com.nicovideo.jp
// @run-at      document-start
// @author      100の人
// @homepageURL https://greasyfork.org/scripts/22286
// @downloadURL https://update.greasyfork.org/scripts/22286/Check%20new%20posts%20in%20Nico%20Community.user.js
// @updateURL https://update.greasyfork.org/scripts/22286/Check%20new%20posts%20in%20Nico%20Community.meta.js
// ==/UserScript==
