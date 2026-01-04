// ==UserScript==
// @name        巴哈-禁止聊天室自動卷到最下面
// @namespace   巴哈-禁止聊天室自動卷到最下面
// @include     https://haha.gamer.com.tw*
// @version     1.00
// @grant       none
// @description:zh-tw 巴哈-禁止聊天室自動卷到最下面.
// @description 巴哈-禁止聊天室自動卷到最下面.
// @downloadURL https://update.greasyfork.org/scripts/34525/%E5%B7%B4%E5%93%88-%E7%A6%81%E6%AD%A2%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%87%AA%E5%8B%95%E5%8D%B7%E5%88%B0%E6%9C%80%E4%B8%8B%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/34525/%E5%B7%B4%E5%93%88-%E7%A6%81%E6%AD%A2%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%87%AA%E5%8B%95%E5%8D%B7%E5%88%B0%E6%9C%80%E4%B8%8B%E9%9D%A2.meta.js
// ==/UserScript==

/*
 *
 * 說明：禁止巴哈姆特電腦版的哈哈姆特聊天室，有人回覆就自動卷到最下面的現象
 * 作者：hbl917070（深海異音）
 * 最後修改日期：2017-10-25
 * 作者小屋：https://home.gamer.com.tw/homeindex.php?owner=hbl917070
 *
 */



var style_48763 = document.createElement("style");
style_48763.innerHTML=`
.message-scoller{
    overflow-y: initial !important;
    height: initial !important;
}
.message-content{
    overflow-y: auto !important;
}
#message-scoller_forum{
    overflow-y: initial !important;
    height: initial !important;
}
`;
document.body.appendChild(style_48763);

