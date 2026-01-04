// ==UserScript==
// @name               自研 - 插画世界 - 添加「返回 Pixiv」按钮
// @name:en_US         Self-made - vilipix - Add a 'Return to Pixiv Site' button
// @description        在行为栏添加前往 Pixiv 对应作品页的按钮。
// @description:en_US  Add a button in the action bar to navigate to the corresponding Pixiv artwork page.
// @version            1.0.2
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://vilipix.com/illust/*
// @match              https://www.vilipix.com/illust/*
// @icon               https://vilipix.oss-cn-beijing.aliyuncs.com/web/logo/ico.png
// @run-at             document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/490490/%E8%87%AA%E7%A0%94%20-%20%E6%8F%92%E7%94%BB%E4%B8%96%E7%95%8C%20-%20%E6%B7%BB%E5%8A%A0%E3%80%8C%E8%BF%94%E5%9B%9E%20Pixiv%E3%80%8D%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/490490/%E8%87%AA%E7%A0%94%20-%20%E6%8F%92%E7%94%BB%E4%B8%96%E7%95%8C%20-%20%E6%B7%BB%E5%8A%A0%E3%80%8C%E8%BF%94%E5%9B%9E%20Pixiv%E3%80%8D%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义「作品编号」变量
    const artworkid = location.href.split('/')[4];

    // 判断「作品编号」是否为 Pixiv 的，如果是就在行为栏添加「返回 Pixiv」按钮。
    if(!/[a-z]+/.test(artworkid)) {
        document.querySelector('.illust-content .actions').insertAdjacentHTML("afterbegin", `<div><a href="https://www.pixiv.net/artworks/${artworkid}" target="_blank" rel="nofollow noopener noreferrer"><i class="icon iconfont wx-icon-faxian"></i></a></div>`);
    }

})();