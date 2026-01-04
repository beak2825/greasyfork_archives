// ==UserScript==
// @name         图集岛图片换源、图集页面显示小图修改匹配地址--lc自用
// @author       原作者请搜索：Ninkror
// @namespace    Ninkror
// @version      1.1.2
// @description  图集岛图片换源，图集页面显示小图
// @match   https://www.sqmuying.com/*
// @include https://www.sqmuying.com/*
// @match   *.sqmuying.com/*
// @include *.sqmuying.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://greasyfork.org/scripts/463455-nelementgetter/code/NElementGetter.js?version=1172110
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/476371/%E5%9B%BE%E9%9B%86%E5%B2%9B%E5%9B%BE%E7%89%87%E6%8D%A2%E6%BA%90%E3%80%81%E5%9B%BE%E9%9B%86%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E5%B0%8F%E5%9B%BE%E4%BF%AE%E6%94%B9%E5%8C%B9%E9%85%8D%E5%9C%B0%E5%9D%80--lc%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/476371/%E5%9B%BE%E9%9B%86%E5%B2%9B%E5%9B%BE%E7%89%87%E6%8D%A2%E6%BA%90%E3%80%81%E5%9B%BE%E9%9B%86%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E5%B0%8F%E5%9B%BE%E4%BF%AE%E6%94%B9%E5%8C%B9%E9%85%8D%E5%9C%B0%E5%9D%80--lc%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==
GM_addStyle(`
    #kbox {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        align-content: space-between;
    }
    #kbox > img {
            max-width: 15% !important;
        margin-bottom: 25px;
    }
`);

const srcList = [
    'pic.sqmuying.com',
    'tjg.sqmuying.com',
    'pic.gzhuibei.com',
    'tjg.gzhuibei.com',
    'picew6d4ew.82pic.com',
    'tjgew6d4ew.82pic.com'
];

const nowSrc = GM_getValue('src');
new ElementGetter().each('img', document, (img) => {
    img.src = img.src.replace(/https:\/\/[^/]+/, 'https://' + nowSrc)
});

srcList.forEach((item) => {
    GM_registerMenuCommand(`----${item == nowSrc ? '✅' : '❌'}${item}`, function () {
        GM_setValue('src', item);
        window.location.reload();
    });
});