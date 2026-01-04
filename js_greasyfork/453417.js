// ==UserScript==
// @name                Pixiv-QuickBookmark
// @name:zh-CN          Pixiv-快捷收藏
// @name:ja             Pixiv-クイックブックマーク
// @namespace           https://github.com/Mehver
// @version             2.9
// @description         When press the main area of the image, it will add the bookmark instead of jump to the image page. And add a button to jump to the image page.
// @description:zh-CN   点击图片主区域，会直接收藏图片，而不是跳转到图片页面。并额外添加一个按钮用于跳转到图片页面。
// @description:ja      画像のメインエリアを押すと、ブックマークが追加され、画像ページにジャンプしなくなります。 さらに、画像ページにジャンプするためのボタンを追加します。
// @author              https://github.com/Mehver
// @icon                data:image/png;base64,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
// @match               http*://pixiv.net
// @match               http*://pixiv.net/*
// @match               http*://www.pixiv.net
// @match               http*://www.pixiv.net/*
// @license             MPL-2.0
// @license^            Mozilla Public License 2.0
// @grant               unsafeWindow
// @homepageURL         https://github.com/SynRGB/Pixiv-QuickBookmark
// @contributionURL     https://github.com/SynRGB/Pixiv-QuickBookmark
// @copyright           Copyright © 2022-PRESENT, Mehver (https://github.com/Mehver)
// @charset		        UTF-8
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/453417/Pixiv-QuickBookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/453417/Pixiv-QuickBookmark.meta.js
// ==/UserScript==

let last_run_time = new Date().getTime();

let main = function () {
    // pixiv.net/users/* 页面下特有的顶部精选图片，唯一内部dom结构不同的
    // the top featured images on pixiv.net/users/*, only theses have different internal dom structure
    let userFeatured_Imgs = document.querySelectorAll('div[radius="8"]');
    // 其他所有图片，内部的dom结构都一样
    // all other images, the internal dom structure is the same
    let allOther_Imgs = document.querySelectorAll('div[radius="4"]');
    /////////////////////////////////////////////////////////////////////////////////////////
    // 遍历 userFeatured_Imgs
    for (let i = 0; i < userFeatured_Imgs.length; i++) {
        // let div = userFeatured_Imgs[i].parentNode.parentNode;
        let div = userFeatured_Imgs[i].parentNode.parentNode.parentNode;
        let button = div.querySelector('button');
        // 避免重复添加
        // avoid duplicate modification
        let added_check = div.querySelector('div[class="Pixiv-QuickBookmark"]');
        // filter real img div
        if (button !== null && added_check === null) {
            // get the parent div of the button
            let buttonDiv = button.parentNode;
            // move button to left side
            let divWidth = div.clientWidth;
            buttonDiv.setAttribute('style', `
                position: absolute;
                width: ${divWidth}px;
                bottom: 0;
            `);
            // add the jump page button to right bottom edge
            let divToAdd_newJumpButton = document.createElement('div');
            divToAdd_newJumpButton.setAttribute('class', 'Pixiv-QuickBookmark');
            divToAdd_newJumpButton.setAttribute('style', `
                content: '';
                position: absolute;
                right: 0;
                bottom: 0;
                border: 17px solid #0096FA;
                border-top-color: transparent;
                border-left-color: transparent;
            `);
            divToAdd_newJumpButton.addEventListener('click', function () {
                let a = div.querySelector('a');
                a.click();
            });
            div.appendChild(divToAdd_newJumpButton);
            // modify the jump page area to bookmark button
            div.querySelector('a').childNodes[0].addEventListener('click', function (e) {
                e.preventDefault();
                button.click();
            });
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////
    // 遍历 allOther_Imgs
    for (let i = 0; i < allOther_Imgs.length; i++) {
        let div = allOther_Imgs[i].parentNode.parentNode.parentNode;
        // use for filter real img div
        let button = div.querySelector('button');
        // 避免重复添加
        // avoid duplicate modification
        let added_check = div.querySelector('div[class="Pixiv-QuickBookmark"]');
        // filter real img div
        if (button !== null && added_check === null) {
            // get the parent div of the button
            let buttonInnerDiv = button.parentNode;
            let buttonOuterDiv = button.parentNode.parentNode;
            // move button to left side
            let divWidth = div.clientWidth;
            buttonOuterDiv.setAttribute('style', `
                position: absolute;
                width: ${divWidth}px;
                bottom: 0;
            `);
            buttonInnerDiv.setAttribute('style', `
                position: relative;
                left: -${divWidth - 32}px;
            `);
            // add the jump page button to right bottom edge
            let divToAdd_newJumpButton = document.createElement('div');
            divToAdd_newJumpButton.setAttribute('class', 'Pixiv-QuickBookmark');
            divToAdd_newJumpButton.setAttribute('style', `
                content: '';
                position: absolute;
                right: 0;
                bottom: 0;
                border: 17px solid #0096FA;
                border-top-color: transparent;
                border-left-color: transparent;
            `);
            divToAdd_newJumpButton.addEventListener('click', function () {
                let a = div.querySelector('a');
                a.click();
            });
            div.appendChild(divToAdd_newJumpButton);
            // modify the jump page area to bookmark button
            div.querySelector('a').childNodes[0].addEventListener('click', function (e) {
                e.preventDefault();
                button.click();
            });
        }
    }
    last_run_time = new Date().getTime();
}

// if DOM changed, re-run the script
let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function () {
        // 通过增加时间间隔来避免无限回调
        if (new Date().getTime() - last_run_time > 50) {
            main();
        }
    });
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log("Userscript Pixiv-QuickBookmark (Pixiv-快捷收藏) loaded. See more details at https://github.com/SynRGB/Pixiv-QuickBookmark");
