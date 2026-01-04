// ==UserScript==
// @name         ImgurComment500Limit
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Brings the 500 character limit comments to non "beta" imgur users
// @author       SleepProgger
// @match        https://imgur.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463287/ImgurComment500Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/463287/ImgurComment500Limit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function _injectME(){
        function _func(){
            Imgur.Caption.Reply.defaultProps.maxLength = 500;
            var __hook_ajax = $.ajax; $.ajax = function(x){
                // The only way i found to circumvent the character limit is to use the "new" API.
                // There probably is some nicer way, but meh this works
                if(!x.url || ! x.url.startsWith("/gallery/action/caption/")){
                    return __hook_ajax(x);
                }
                // Rewrite request to the "new" API format
                var nData = {};
                var s = x.url.split("/"); // JS Are you kidding me ? WHY NO RSPLIT ?
                nData.post_id = s[s.length - 1];
                nData.comment = x.data.caption;
                nData.platform = "api";
                nData.parent_id = x.data.parent_id;
                nData.has_admin_badge = false;
                x.data = JSON.stringify(nData);
                x.url = "https://api.imgur.com/comment/v1/comments?client_id=" + imgur._.apiClientId;
                x.xhrFields = { withCredentials:true };
                x.headers = {'Content-Type': 'application/vnd.imgur.v1+json'};
                // We also have to rewrite the response now which sucks
                x.dataFilter = function (r, type) {
                    r = JSON.parse(r);
                    var ret = {
                        success: true,
                        data: {
                            caption: {
                                id: r.id,
                                hash: r.post.id,
                                caption: r.comment,
                                author: r.account.username,
                                author_id: r.account_id,
                                ups: r.upvote_count,
                                downs: r.downvote_count,
                                best_score: 0.2, // No clue where to get this, so lets just fake it
                                points: r.point_count,
                                datetime: r.created_at.replace("T", " ").replace("Z", ""), // Do i suck at JS; or does JS suck ?
                                parent_id: r.parent_id,
                                deleted: r.deleted_at != null,
                                on_album: r.post.is_album,
                                album_cover: r.post.cover_id, // Not sure this is correct
                                title: "", // No clue. Post title this reply is on ?
                                platform: "yoMomma",
                                has_admin_badge: false, // Naw, don't have that
                            }
                        }
                    };
                    return JSON.stringify(ret);
                }
                return __hook_ajax(x);
            };
        };
        function _waitForImgur(){
            if(window.Imgur && Imgur.Caption){
                console.log("Imgur is ready");
                _func();
                return;
            }
            console.log("Waiting for imgur");
            setTimeout(_waitForImgur, 250); // This is pretty ugly, should use some observer instead, but i am lazy.
        }
        _waitForImgur();
    }
    var s = document.createElement('script');
    s.textContent = '(' + _injectME + ')()';
    console.log("Inject into", document.location, ":", s.textContent);
    document.head.appendChild(s);

})();
