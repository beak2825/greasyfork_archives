// ==UserScript==
// @name         虎扑论坛界面优化
// @namespace    KDX Group
// @version      最终版
// @description  这么大个詹姆斯动图要吓死人啊？重改！
// @author       AceKadoce
// @match        https://bbs.hupu.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hupu.com
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472316/%E8%99%8E%E6%89%91%E8%AE%BA%E5%9D%9B%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/472316/%E8%99%8E%E6%89%91%E8%AE%BA%E5%9D%9B%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    $(() => {
        $("div[class^=index_bbs-post-web-body-right]").remove();
        $("div[class^=index_bbs-post-web-body-left]").css("flex", "1");
    })

    let resizeImg = () => {
        let imgBean = $(".post-reply-list .thread-img");
        imgBean.css('max-width', '100px');
        imgBean.css('max-height', '100px');
    }

    resizeImg();
    $(document).scroll(() => {
        resizeImg();
    })
})();