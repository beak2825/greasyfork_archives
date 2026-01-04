// ==UserScript==
// @name         得物图片获取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  得物图片快捷下载
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @author       烟花小神
// @license      MIT
// @match        https://m.poizon.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poizon.com
// @downloadURL https://update.greasyfork.org/scripts/441690/%E5%BE%97%E7%89%A9%E5%9B%BE%E7%89%87%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/441690/%E5%BE%97%E7%89%A9%E5%9B%BE%E7%89%87%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $('.UserInfoCard_follow-btn__IhvwM').html("下载");
    $('.UserInfoCard_follow-btn__IhvwM')[0].onclick = function () {
        setTimeout(function () {
            $('.QrcodeModal_box__2CQ3_').css({ "width": "auto", "padding-left": "8px" })
            $('.QrcodeModal_qrcode__3Yh2z').remove();
            $(".QrcodeModal_desc__2X55Q").html("");
            var h = '<div class="swiper-wrapper" style="transform: translate3d(0px, 0px, 0px);">'
            $(".PhotoSwiper_sub-swiper__2DawT .img-box-inner").each(function () {
                var srcImg = $(this).attr("src");
                srcImg = srcImg.replace(/w_.*/, 'w_1080');
                h += `<div style="margin-right: 8px;"><a target="_blank" href="${srcImg}"><img draggable="false" src="${srcImg}" style="opacity: 1;width: 60px;height: 60px;"></a></div>`
            });
            $(".QrcodeModal_desc__2X55Q").html(h + '</div>');
        }, 10)
    }
})();