// ==UserScript==
// @name         自动登录并获取VIP
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  auto login
// @author       You
// @match        *://*.kmkk102.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478228/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%B9%B6%E8%8E%B7%E5%8F%96VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/478228/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%B9%B6%E8%8E%B7%E5%8F%96VIP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        const vm = document.querySelector("#app").__vue__;
        const store = vm.$store;
        store.commit('changeLoginStatus', true);
        store.commit('userInfoSave', {
            "inviteId": 0,
            "nickname": null,
            "userName": "ABC",
            "headIco": 3,
            "email": "ABC",
            "phone": null,
            "point": 10000,
            "isAgent": 1,
            "agtLevelId": 5,
            "videoCount": 1000,
            "cacheCount": 0,
            "inviteCount": 0,
            "userId": 1024,
            "useVideoCount": 0,
            "exp": 0,
            "isNewAccount": 0,
            "isBindEmail": 0,
            "isBindPhone": 0,
            "change": 0,
            "isTourist": 0,
            "vipMinutes": 60000,
            "endVipTime": null,
            "accMinutes": 0,
            "isVip": 1,
            "token": store.state.userInfo?.token,
        });
    }, 1000)
})();