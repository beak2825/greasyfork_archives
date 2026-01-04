// ==UserScript==
// @name         telegram自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.34
// @description  telegram auto Login
// @include      https://*.web.telegram.org/*
// @include      https://web.telegram.org/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/406602/telegram%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/406602/telegram%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function () {
    window.localStorage.setItem("max_seen_msg", "6473");
    window.localStorage.setItem("dc2_auth_key", "\"1841106187866916eea05870f354e63209291979b626351e6e8a74283a7ef8c8d3e3ba91ef76e4e6d290d91868af885867e99057e0b8b247f9f91535e30bbd40b8417f6f76f63639527315ccedcf15ea9b65cfcd4129775c4631f9d3f895f9c6014016546c9e8b5d2f2d9c921eb7a3c28e55f234b5ad3731db25c0e66973b1509e24ce062e81457dca13eb046a7ab5f46191e3150a5a98e30c96c9d93898cba092e0b14e0b8d1e620fa702f6cfcd3799835994aa7a02109b50638d3a004ce7a006fa1438eb534a52e71eb5d7bdb0e7c51cbdc6b8f29da64c669c27928a2b117db624d7ded758541dc4589d976f03a7c594461ffa8f91d653aaa114282ae429d1\"");
    window.localStorage.setItem("dc5_auth_key", "\"8ea3cee147fa6198347533312ffdbbf948c5db844a9dae91bdab88ab2c5e31ac31f919730c3baa405de165a1807352cae3620c9593a3fb75a7347e7283e88e71688151f15817740a4daf18878484ab3644f9fb8c0cb3b559555679fbd81e230f9ee28f305acfded9ca6e8838d5fcb3857c78938a576afb57e08c4d3ccd020dd32c3763b383077e35ad73f764785a46d4a066a0746ba0e97a6719792830ffb6bd240b31c3e427080c6c2e444533ab0388bf119aa17c85eeb00303303b3cce3892e0a320ee47453d6572c981cf3b302929c5d7d0391327912698aadffdf316904ef7f35eba7a20cdb235756b0c5fbbb345c59c52230e39c3e85f5d31af62988283\"");
    window.localStorage.setItem("tgme_sync", "{\"canRedirect\":true,\"ts\":1594040312}");
    window.localStorage.setItem("server_time_offset", "-1");
    window.localStorage.setItem("dc2_server_salt", "\"278ecd924407c0f0\"");
    window.localStorage.setItem("dc1_auth_key", "\"b87f71766b0218d60f39378f8287efa573c2e91ac39c7ffc6a251fdf784fe6a149bde6621c999f1fe39c8816063f937e892abfe9e3fd2893e502e41243cd1c3bed2e002afda101b9715ffd2e7fc5a0dd8be8a949fbe730f89b0c2b2e3c75637e95c487c83008b648c1b5f5a381ab6a3ca9b689d14f4e9d07e4b26e217ebc32dae523708112d7dcd8a4e3fa6f72d24d1f7d980f8cd3a4b54be126220caf63249f48383d8ef15772ee904faf6c9ed82a6196c2ccfcc3a594f2ad8cf552f60a4a7012fc86abcf08138a5fb38c587336dc9637504f958ca026f94e1aa48720e2df5ca83eeeaf6020287d1f6cc18bbe4a61fa13febf36cdcb18d30e0bc6af4c213590\"");
    window.localStorage.setItem("dc1_server_salt", "\"352cae1ac5c54c26\"");
    window.localStorage.setItem("dc5_server_salt", "\"741af7741a284cd4\"");
    window.localStorage.setItem("notify_nodesktop", "true");
    window.localStorage.setItem("user_auth", "{\"dcID\":\"5\",\"id\":257696618}");
    window.localStorage.setItem("xt_instance", "{\"id\":2638109681,\"idle\":true,\"time\":1594040625479}");
    window.localStorage.setItem("dc", "5");
    window.localStorage.setItem("notify_volume", "0");
})();
