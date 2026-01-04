// ==UserScript==
// @name         What Have I Seen?
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      1.1.8
// @description  Detect Vimeo in shoroftheweek
// @author       scatking
// @match        https://iboy1069.co/forum*
// @match        https://iboy1069.us/forum*
// @match        https://stboy.net/forum*
// @match        https://www.shuaigay2.com/forum*
// @match        https://www.tt1069.com/bbs/forum.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/435287/What%20Have%20I%20Seen.user.js
// @updateURL https://update.greasyfork.org/scripts/435287/What%20Have%20I%20Seen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#subject").after('<a href="javascript:;" id="set_cache" style="color:green">Set</a>')
    $('#set_cache').click(function () { window.localStorage.setItem(THREAD, $('#subject').val()); });
    let THREAD = 'seen'
    let url = window.localStorage.getItem(THREAD);
    let titile_id = /(?<=tid\=)\d+/.exec(url)[0]
    url = "forum.php?mod=viewthread&tid="+titile_id
    console.log(url);
    let last = $("a[href*='"+url+"']");
    console.log(last.val());
    last.attr("style","color: #43ed13");
})();