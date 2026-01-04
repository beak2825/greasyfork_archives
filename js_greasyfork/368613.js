// ==UserScript==
// @namespace         https://greasyfork.org/zh-CN/users/106222-qxin-i

// @name              网页限制解除(改)
// @name:en           Remove web limits(modified)
// @name:zh           网页限制解除(改)
// @name:zh-CN        网页限制解除(改)
// @name:ja           ウェブの規制緩和(変更)

// @author            Cat73 & iqxin(修改)
// @contributor       iqxin

// @description       通杀大部分网站，可以解除禁止复制、剪切、选择文本、右键菜单的限制。原作者cat73，因为和搜索跳转脚本冲突，遂进行了改动，改为黑名单制。
// @description:en    Pass to kill most of the site, you can lift the restrictions prohibited to copy, cut, select the text, right-click menu.revised version
// @description:zh    通杀大部分网站，可以解除禁止复制、剪切、选择文本、右键菜单的限制。原作者cat73，因为和搜索跳转脚本冲突，遂进行了改动，改为黑名单制。
// @description:zh-CN 通杀大部分网站，可以解除禁止复制、剪切、选择文本、右键菜单的限制。原作者cat73，因为和搜索跳转脚本冲突，遂进行了改动，改为黑名单制。
// @description:zh-TW 通殺大部分網站，可以解除禁止復制、剪切、選擇文本、右鍵菜單的限制。
// @description:ja    サイトのほとんどを殺すために渡し、あなたは、コピー切り取り、テキスト、右クリックメニューを選択することは禁止の制限を解除することができます。

// @description       原作者https://www.github.com/Cat7373/，因为和搜索跳转脚本冲突，遂进行了改动
// @homepageURL       https://cat7373.github.io/remove-web-limits/
// @supportURL        https://greasyfork.org/zh-CN/scripts/28497

// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAABpElEQVR4nO3Vv2uUQRDG8c/ebSMWqay0trATAxrUSi1S2AiWFoJYpNCgoBjURsHWJKeNRfAvsDgFixQqKdPZ2ViEiCJYBOQu8f1hEXO59713j7MUfLZ6d2a/O8vMO0OzDnin9Ku2Mjvuaw07xgSAYEVXe2indMhj92zpKJLnBhF8MDeye9hn6zbN70eRiqCw02Bra3up8BBLu1FEBxsBucXqW4csz0ULe4jorSCMuPU89boRELDMHiI6Y8V65bbCUTccc70RkaOwKLOg0IkyXa9qTjOu2LAs6NZuD86hrdTyxRNTkUqqdhXlHrngGRVEZsMpJwex9DxIZSHYclesIb65LCoHgIs66UJq6btDBZHZrPh8V6YBOX66LbOkTGckBYimBW2FVTNeuOZNyrFJ236Yl4NSy5SbVm1PDvhodqgyMledTdRlAtDzqfL9tfkwUtyaRkv9LwFj9B/w7wPycXOhqlJ0yZHKPChMi5MCiM47XhsopbVJAUHfrYbmN/EToN+02eLPfz9OYyZhFJzW1Jn3lTsxaKQjCkp52jy45r1ZvSbTb9M0d4PBozGZAAAAAElFTkSuQmCC

// @version           3.2.2
// @license           LGPLv3

// @compatible        chrome Chrome_46.0.2490.86 + TamperMonkey + 脚本_1.3 测试通过
// @compatible        firefox Firefox_42.0 + GreaseMonkey + 脚本_1.2.1 测试通过
// @compatible        opera Opera_33.0.1990.115 + TamperMonkey + 脚本_1.1.3 测试通过
// @compatible        safari 未测试

// @match             *://*/*
// @exclude        *www.bilibili.com*
// @exclude        *www.panda.tv*

// @connect     eemm.me
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/368613/%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%28%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/368613/%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%28%E6%94%B9%29.meta.js
// ==/UserScript==

$('.thumbnail img').each(function(){
    // gather info
    var src = this.src,
        regex = /\/images\/(.*)_default/,
        id = src.match(regex)[1],
        b64id = btoa(id),
        link = $(this).closest('a'),
        linkCt = link.closest('.images-rotation-link');
 
    // change link to raw mp4 URL
    link.attr('href', 'https://rec-tube.com/file/' + b64id + '/');
 
    // disable further link rewriting by thumbnail slideshow script
    linkCt.imagesRotationRemove();
 
    // write the video id into the page for reference
    linkCt.append('<div style="word-break: break-word; text-transform: none; letter-spacing: 0;">' + id.split('/').pop()) + '</div>';
});