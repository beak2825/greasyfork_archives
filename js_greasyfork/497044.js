// ==UserScript==
// @name         强制开启抖音直播弹幕
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  用于强制开启抖音直播弹幕，绕过弹幕屏蔽
// @author       wamess
// @match        *://live.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/497044/%E5%BC%BA%E5%88%B6%E5%BC%80%E5%90%AF%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/497044/%E5%BC%BA%E5%88%B6%E5%BC%80%E5%90%AF%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cooldown = false;

    let enableDanmu = function() {
        if (cooldown) {
            return;
        }
        let playerDOM = document.getElementById('living_room_player_container');
        let propKey = Object.keys(playerDOM).find(key=>{
            return key.startsWith("__reactProps$");
        });
        let propObj = playerDOM[propKey];
        console.log(propObj);
        propObj.children[1].props.children.props.children.props.children.props.isDanmakuFeatureOn = true;
        cooldown = true;
        setTimeout(function() {
            cooldown = false;
        }, 100);
    };

    window.addEventListener('load', setTimeout(function() {
        // $('#living_room_player_container').__reactProps$kcorjoqetdb.children[1].props.children.props.children.props.children.props.isDanmakuFeatureOn = true;
        let playerDOM = document.getElementById('living_room_player_container');
        let chatroomDOM = document.getElementById('chatroom');
        let changeObserver = new MutationObserver(function (mutations,observe) {
            console.log("playerDOM changed");
            enableDanmu();
        });
        enableDanmu();
        changeObserver.observe(playerDOM, { attributes: true });
        changeObserver.observe(chatroomDOM, { attributes: true });
    }, 3000))
})();