// ==UserScript==
// @name TOKYOMotionサムネ改善
// @version      1.5.2
// @description tokyomotion.netのサムネをホバーで早送り巻き戻しできるようにする。
// @author       SWIU
// @match        https://www.tokyomotion.net/*
// @namespace https://greasyfork.org/users/1196626
// @downloadURL https://update.greasyfork.org/scripts/477472/TOKYOMotion%E3%82%B5%E3%83%A0%E3%83%8D%E6%94%B9%E5%96%84.user.js
// @updateURL https://update.greasyfork.org/scripts/477472/TOKYOMotion%E3%82%B5%E3%83%A0%E3%83%8D%E6%94%B9%E5%96%84.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function updateThumbnailImage(ev) {
        function loadImages(elm) {
            elm.dataset.imageLoaded = true;
            for (let i = 1; i <= 20; i++) {
                const img = new Image();
                img.src = `${elm.dataset.baseurl}${i}.jpg`;
            }
        }
        if (!this.dataset.imageLoaded) loadImages(this);
        const width = this.offsetWidth;
        const mouseX = ev.offsetX;
        const percent = Math.floor((mouseX / width) * 100);
        const imageNumber = Math.max(1, Math.ceil(percent / 5));
        const newThumbURL = `${this.dataset.baseurl}${imageNumber}.jpg`;
        if (this.src !== newThumbURL) this.src = newThumbURL;
    }
    const styleTagText = `<style>.img-private{-webkit-filter:unset !important;}.duration,.label-private{pointer-events:none;}#flash{max-height:80vh}</style>`;
    document.head.insertAdjacentHTML(`beforeend`, styleTagText);
    const thumbs = [...document.querySelectorAll(`img[src*="https://cdn.tokyo-motion.net/media/videos/"]`)];
    for (const thumb of thumbs) {
        thumb.dataset.baseurl = thumb.src.match(/.+\//)[0];
        thumb.removeAttribute(`id`);//デフォルトの画像切り替えの無効化
        thumb.addEventListener('mousemove', updateThumbnailImage, false);
    }
})();
