// ==UserScript==
// @name        yahoojp_no_nextvideo
// @namespace   http://catherine.v0cyc1pp.com/yahoojp_no_nextvideo.user.js
// @match       https://videotopics.yahoo.co.jp/*
// @author      greg10
// @run-at      document-end
// @license     GPL 3.0
// @version     1.3
// @grant       none
// @description YahooJAPANの映像トピックスのビデオを再生後に自動的に５秒後に次の動画に勝手に移行されてしまうのを抑制する。
// @downloadURL https://update.greasyfork.org/scripts/34834/yahoojp_no_nextvideo.user.js
// @updateURL https://update.greasyfork.org/scripts/34834/yahoojp_no_nextvideo.meta.js
// ==/UserScript==

document.getElementById("nvideo").remove();


