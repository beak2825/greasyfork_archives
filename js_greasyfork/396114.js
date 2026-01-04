// ==UserScript==
// @name  Auto Next Video Living Room
// @namespace  PvP Nguyen Phat
// @description  Tự động Next Video buổi xem chung.
// @version  1.0.2
// @author  PvP Nguyen Phat
// @match  https://www.facebook.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @run-at  document-idle
// @downloadURL https://update.greasyfork.org/scripts/396114/Auto%20Next%20Video%20Living%20Room.user.js
// @updateURL https://update.greasyfork.org/scripts/396114/Auto%20Next%20Video%20Living%20Room.meta.js
// ==/UserScript==

async function auto_next_video_living_room(vid) {
    function wait(ms) { return new Promise(r => setTimeout(r, ms)); } // Chờ đợi.
    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    async function aaa(vid) {
        await $('._271k._1qjd._7tvm._7tv2._7tv4')[$('._271k._1qjd._7tvm._7tv2._7tv4').length - 1].click(); // Click mở phần thêm video.
        await wait(1500);
        var uid = await readCookie('c_user'), lrid = window.location.href.match(/wp\/([0-9]+)/gmi)[0].replace('wp/', ''), fb_dtsg = document.querySelector('[name="fb_dtsg"]').value;
        await fetch("https://www.facebook.com/api/graphql/", {
            "credentials": "include", "headers": {
                "accept": "*/*", "content-type": "application/x-www-form-urlencoded", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin",
            }, "referrerPolicy": "origin-when-cross-origin",
            "body": `av=${uid}&__user=${uid}&__a=1&fb_dtsg=${fb_dtsg}&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=LivingRoomContentQueueAppendMutation&variables=${encodeURIComponent(`{"input":{"client_mutation_id":"11","actor_id":"${uid}","action_id":"fcf118d0681d2c","creator_actor_id":"${uid}","living_room_id":"${lrid}","video_id":"${vid}","message_actor_id":"${uid}","video_event":"ADDED_VIDEO"}}`)}
        &doc_id=1770229446351434`, "method": "POST", "mode": "cors"
        }); // Add video vào queue.
        await wait(1500);
        await $('a.img._8o._8r')[0].click(); // Click để trở về phần trước.
        await wait(1500);
        await $('._50z2._-op')[0].click(); // Click để kéo sang video tiếp.
        await wait(1500);
        await $('._3el8.clearfix .clearfix')[1].click(); // Click mở menu để play video.
        await wait(1500);
        await $('.uiContextualLayerBelowRight ._54nq._558b._2n_z li._54ni a._54nc')[0].click(); // Click dòng play video.
        await wait(1500);
        return 'hoho';
    }
    for (; ;) { var a = await aaa(vid); await wait(3000); }
}

var jquery_ = document.createElement('script');
jquery_.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';
(document.body || document.head || document.documentElement).appendChild(jquery_);
var script = document.createElement('script');
script.appendChild(document.createTextNode(auto_next_video_living_room));
(document.body || document.head || document.documentElement).appendChild(script);