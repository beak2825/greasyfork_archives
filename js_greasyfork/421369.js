// ==UserScript==
// @name         hipda-Like
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  来自D板带着爱，喜欢他就悄悄点赞他！
// @author       nowheremanx
// @match        https://www.hi-pda.com/forum/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/421369/hipda-Like.user.js
// @updateURL https://update.greasyfork.org/scripts/421369/hipda-Like.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var tid = location.href.match(/tid=(\d+)/) ? location.href.match(/tid=(\d+)/)[1] : -999;
    var uid = $("cite > a").attr("href").split("uid=")[1];
    var postIds = [];
    // hp-like client
    class HpLike {
        constructor(hostAddr) {
            this.hostAddr = hostAddr;
//             GM_xmlhttpRequest({
//                 method: "GET",
//                 url: this.hostAddr + '/hpping',
//                 headers: {"Access-Control-Allow-Headers": "*"},
//                 onload : (res) => {console.log(res.responseText)}
//             });
        }

        getLikeCountsFromServer(tid, uid, postIds) {
            if (postIds.length === 0) {
                return;
            }
            let url = this.hostAddr + "/hplike?uid=" + uid + "&postIds=" + postIds.join(",");
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {"Access-Control-Allow-Headers": "*"},
                onload : (res) => {
                    let data = JSON.parse(res.responseText);
                    let totalLikes = data.totalLikes;
                    let totalDislikes = data.totalDislikes;
                    let userLikes = data.userLikes;
                    let userDislikes = data.userDislikes;
                    Object.keys(totalLikes).forEach((postId) => {
                        $(`#${postId}_like_count`).text(totalLikes[postId] - totalDislikes[postId]);
                        $(`#${postId}_like_count`).removeClass();
                        if (userLikes.indexOf(postId) != -1) {
                            $(`#${postId}_like_count`).addClass("user-liked");
                        }
                        if (userDislikes.indexOf(postId) != -1) {
                            $(`#${postId}_like_count`).addClass("user-disliked");
                        }
                    });
                }
            });
        }

        toggleLikeRequest(tid, uid, postId) {
            let url = this.hostAddr + "/hplike";
            let data = `uid=${uid}&postId=${postId}&action=toggleLike`;
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {"Access-Control-Allow-Headers": "*", "Content-type": "application/x-www-form-urlencoded"},
                data: data,
                onload : (res) => {
                    let data = JSON.parse(res.responseText);
                    this.updateUserLike(data);
                }
            });
        }

        toggleDislikeRequest(tid, uid, postId) {
            let url = this.hostAddr + "/hplike";
            let data = `uid=${uid}&postId=${postId}&action=toggleDislike`;
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {"Access-Control-Allow-Headers": "*", "Content-type": "application/x-www-form-urlencoded"},
                data: data,
                onload : (res) => {
                    let data = JSON.parse(res.responseText);
                    this.updateUserLike(data);
                }
            });
        }

        updateUserLike(data) {
            let postId = data.postId;
            // -1: dislike, 0: normal, 1: like
            let userOldVal = data.userOldVal;
            let userNewVal = data.userNewVal;
            let oldVal = parseInt($(`#${postId}_like_count`).text());
            $(`#${postId}_like_count`).text(oldVal - userOldVal + userNewVal);
            $(`#${postId}_like_count`).removeClass();
            if (userNewVal === 1) {
                $(`#${postId}_like_count`).addClass("user-liked");
            } else if (userNewVal === -1) {
                $(`#${postId}_like_count`).addClass("user-disliked");
            }
        }
    }

    // change ip to any HpLike server
    var hplike = new HpLike("http://47.96.137.82:8000");
    // initialize likeComponent
    $("#postlist > div > table").each((index, element) => {
        let postId = element.id;
        postIds.push(postId);

        $(`#${postId}`).find(".postcontent:first").append(`<div id="${postId}_like" class="like-component"></div>`);
        // LIKE
        $(`#${postId}_like`).append(`<div id="${postId}_like_icon" style="width: 30px; height:30px; object-fit: contain;"><div class="arrow-up"></div></div>`)
        // click thumbsup action
        $(`#${postId}_like_icon`).click(()=>{
            // pure css animation
            $(`#${postId}_like_icon`).addClass("jump");
            setTimeout(() => {
                $(`#${postId}_like_icon`).removeClass("jump");
            }, 1000);
            // process like / cancel_like
            hplike.toggleLikeRequest(tid, uid, postId);
        });
        // COUNTER BOARD
        $(`#${postId}_like`).append(`<div id="${postId}_like_count" style="font-weight: bold; text-align: center;">...<div/>`)

        // DISLIKE
        $(`#${postId}_like`).append(`<div id="${postId}_dislike_icon" style="width: 30px; height:30px; object-fit: contain;"><div class="arrow-down"></div></div>`)
        // click thumbsdown action
        $(`#${postId}_dislike_icon`).click(()=>{
            // pure css animation
            $(`#${postId}_dislike_icon`).addClass("down");
            setTimeout(() => {
                $(`#${postId}_dislike_icon`).removeClass("down");
            }, 1000);
            // process dislike / cancel_dislike
            hplike.toggleDislikeRequest(tid, uid, postId);
        });
    });
    // button styles
    GM_addStyle(".arrow-up {width: 0; height: 0; border-left: 16px solid transparent;border-right: 16px solid transparent; border-bottom: 20px solid grey;}");
    GM_addStyle(".arrow-down {width: 0; height: 0; border-left: 16px solid transparent; border-right: 16px solid transparent; border-top: 20px solid grey;}");
    GM_addStyle(".like-component{float:right}.user-liked{color:green}.user-disliked{color:red}.jump{-webkit-animation:jump 1.5s ease 0s infinite normal;animation:jump 1.5s ease 0s 1 normal}@-webkit-keyframes jump{0%{-webkit-transform:translateY(0);transform:translateY(0)}20%{-webkit-transform:translateY(0);transform:translateY(0)}40%{-webkit-transform:translateY(-30px);transform:translateY(-30px)}50%{-webkit-transform:translateY(0);transform:translateY(0)}60%{-webkit-transform:translateY(-15px);transform:translateY(-15px)}80%{-webkit-transform:translateY(0);transform:translateY(0)}100%{-webkit-transform:translateY(0);transform:translateY(0)}}.down{-webkit-animation:down 1.5s ease 0s infinite normal;animation:down 1.5s ease 0s 1 normal}@-webkit-keyframes down{0%{-webkit-transform:translateY(0);transform:translateY(0)}20%{-webkit-transform:translateY(0);transform:translateY(0)}40%{-webkit-transform:translateY(30px);transform:translateY(30px)}50%{-webkit-transform:translateY(0);transform:translateY(0)}60%{-webkit-transform:translateY(15px);transform:translateY(15px)}80%{-webkit-transform:translateY(0);transform:translateY(0)}100%{-webkit-transform:translateY(0);transform:translateY(0)}}");
    hplike.getLikeCountsFromServer(tid, uid, postIds);
})();