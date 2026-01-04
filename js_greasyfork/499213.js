// ==UserScript==
// @name         missav永远播放+不弹广告
// @name:zh-TW   missav永远播放+不弹广告
// @name:ja      missav永远播放+不弹广告
// @name:ko      missav永远播放+不弹广告
// @name:ru      missav++
// @name:de      missav++
// @name:es      missav++
// @name:fr      missav++
// @name:it      missav++
// @name:en      missav++
// @description:en    Remove lose focus -> stop playing + Remove first click pop-up advert
// @description:zh-TW  missav+++
// @description:ja     フォーカスを失うと再生が停止する問題を解消 + ファーストクリックのポップアップ広告を削除
// @description:ko     초점 잃기 및 재생 중지 제거 + 첫 클릭 팝업 광고 제거
// @description:ru     missav+++
// @description:de     missav+++
// @description:es     missav+++
// @description:fr     missav+++
// @description:it     missav+++

// @namespace    http://chwan.cc/
// @license private 
// @version      2024-06-29-21:20 +8:00 zhengzhou
// @description  missav增强
// @author       chwan
// @match        https://missav.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499213/missav%E6%B0%B8%E8%BF%9C%E6%92%AD%E6%94%BE%2B%E4%B8%8D%E5%BC%B9%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/499213/missav%E6%B0%B8%E8%BF%9C%E6%92%AD%E6%94%BE%2B%E4%B8%8D%E5%BC%B9%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('ready', () => {
         console.log('ready')
          window.open = () => {}
          const pause = window.player.pause
    window.player.pause = () => {
        console.log('pasu')
        if(document.hasFocus()) {
             pause()
        }
    }
    })

    // Your code here...
})();