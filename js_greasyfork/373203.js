// ==UserScript==
// @name         不看广告姬
// @namespace    https://github.com/bangumi/scripts/liaune
// @description   屏蔽无头像用户发表的主题
// @version      1.2
// @author       Liaune
// @include     /^https?://(bgm\.tv|chii\.in|bangumi\.tv)\/.*
// @downloadURL https://update.greasyfork.org/scripts/373203/%E4%B8%8D%E7%9C%8B%E5%B9%BF%E5%91%8A%E5%A7%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/373203/%E4%B8%8D%E7%9C%8B%E5%B9%BF%E5%91%8A%E5%A7%AC.meta.js
// ==/UserScript==

(function() {
    $('.avatarNeue').each(function (index,el){
        if(this.style.backgroundImage.match(/user\/s\/icon/))
            $(this.parentNode.parentNode).hide();
    })
})();