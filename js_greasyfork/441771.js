// ==UserScript==
// @name         Skip Jump Page
// @description  Skip Jump Page.
// @version      0.6
// @namespace    https://github.com/to
// @author       to
// @license      MIT
//
// @match        https://songwhip.com/*
// @match        https://linkco.re/*
// @match        https://*.lnk.to/*
// @match        https://big-up.style/*
// @match        https://orcd.co/*
// @match        https://nex-tone.link/*
// @match        https://*.landr.com/*
// @match        https://song.link/*
// @match        https://ffm.to/*
// @match        https://fanlink.to/*
// @match        https://*.studio.site/*
// @match        https://*.ffm.to/*
// @match        https://owlpop.co/*
// @match        https://album.link/*
// @match        https://linkcloud.mu/*
// @match        https://linkk.la/*
// @match        https://linktr.ee/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @downloadURL https://update.greasyfork.org/scripts/441771/Skip%20Jump%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/441771/Skip%20Jump%20Page.meta.js
// ==/UserScript==

const SERVICE = 'spotify';
// const SERVICE = 'apple';

function jump(){
    [
        '//a[contains(@href, "' + SERVICE + '")]',
        '//img[contains(@src, "' + SERVICE + '")]/ancestor::a',
    ].forEach(path => {
        let elm = $x(path);

        console.log(elm);
        // 予約ページを避ける
        if(elm && !/accounts\.spotify/.test(elm.href)){
            // 適切なリンクが存在しないリンクの場合 クリックする
            elm.href?
                location.href = elm.href :
            elm.click();
        }
    });
}

// 遅延されて生成される要素も考慮する
jump();
setTimeout(jump, 300);

function $x(path){
    return document.evaluate(
        path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
