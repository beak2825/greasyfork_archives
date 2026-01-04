// ==UserScript==
// @name                Pixiv-ForceSafeMode
// @name:zh-CN          Pixiv-强制和谐模式
// @name:ja             Pixiv-強制安全モード
// @namespace           https://github.com/TitanRGB
// @version             1.6
// @description         While writing the last Pixiv user script, I realized that the official (Safe/R-18) filter didn't cover all the scenes. So I made this script to filter all bad information with one click.
// @description:zh-CN   开发上一个 Pixiv 插件时，意识到官方的 (全年龄/R-18) 过滤器并不能覆盖所有场景，容易使我的身体吃不消。因此需要更强大的强制过滤插件来一键过滤所有不良信息。
// @description:ja      前回のPixivユーザースクリプトを作成している最中、公式の（セーフ/ R-18）フィルターがすべてのシーンをカバーしていないことに気づきました。 したがって、1つのクリックですべての不適切な情報をフィルタリングするより強力な強制フィルタリングスクリプトが必要です。
// @author              https://github.com/TitanRGB
// @icon                data:image/png;base64,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
// @match               http*://pixiv.net
// @match               http*://pixiv.net/*
// @match               http*://www.pixiv.net
// @match               http*://www.pixiv.net/*
// @license             MPL-2.0
// @license^            Mozilla Public License 2.0
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               unsafeWindow
// @homepageURL         https://github.com/SynRGB/Pixiv-ForceSafeMode
// @contributionURL     https://github.com/SynRGB/Pixiv-ForceSafeMode
// @copyright           Copyright © 2022-PRESENT, TitanRGB (https://github.com/TitanRGB)
// @charset             UTF-8
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/453648/Pixiv-ForceSafeMode.user.js
// @updateURL https://update.greasyfork.org/scripts/453648/Pixiv-ForceSafeMode.meta.js
// ==/UserScript==

if (GM_getValue('pixiv-quick-safemode') === undefined) {
    GM_setValue('pixiv-quick-safemode', false);
}

let last_run_time = new Date().getTime();

let delete_r18 = function () {
    let new_div = document.createElement('div');
    new_div.setAttribute('id', 'Pixiv-QuickSafeMode-Deleted');
    new_div.setAttribute('style', `
        width: 136px;
        height: 136px;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 50px;
        color: #999;
    `);
    new_div.innerText = '🔞';
    if (GM_getValue('pixiv-quick-safemode', false)) {
        let div = document.querySelectorAll('div[type="illust"]');
        for (let i = 0; i < div.length; i++) {
            let divs = div[i].querySelectorAll('div');
            for (let j = 0; j < divs.length; j++) {
                // if contains 'R-18' or 'R-18G' in a div
                if (divs[j].innerText.includes('R-18') || divs[j].innerText.includes('R-18G')) {
                    // let parent3 = div[i].parentNode.parentNode.parentNode;
                    let parent2 = div[i].parentNode.parentNode;
                    if (parent2.querySelectorAll('div[type="illust"]').length === 1 && parent2.tagName === 'LI') {
                        parent2.remove();
                        // console.log('2');
                    } else {
                        new_div.style.width = new_div.style.height = div[i].offsetWidth + 'px';
                        div[i].parentNode.replaceChild(new_div, div[i]);
                        // console.log('1');
                    }
                }
            }
        }
        let li = document.querySelectorAll('li[offset="0"]');
        for (let i = 0; i < li.length; i++) {
            let divs = li[i].querySelectorAll('div');
            for (let j = 0; j < divs.length; j++) {
                // if contains 'R-18' or 'R-18G' in a div
                if (divs[j].innerText.includes('R-18') || divs[j].innerText.includes('R-18G')) {
                    if (li[i].parentNode.tagName === 'UL') {
                        li[i].remove();
                    }
                }
            }
        }
        last_run_time = new Date().getTime();
    }
}

let button = function (style) {
    let div = document.createElement('div');
    div.style.display = 'flex';
    let span = document.createElement('span');
    if (style === 'nav') {
        span.setAttribute('style', `
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            height: 46px;
            padding-left: 24px;
            padding-right: 24px;
            font-weight: bold;
            font-size: 16px;
            line-height: 24px;
            text-decoration: none;
            border-top: 4px solid transparent;
            transition: color 0.2s ease 0s;
            cursor: pointer;
            box-sizing: border-box;
            white-space: nowrap;
            background-color: transparent;
            color: #0096FA;
            cursor: default;
        `);
        div.setAttribute('style', `
            display: flex;
        `);
    } else if (style === 'artwork') {
        span.setAttribute('style', `
            display: flex;
            align-items: center;
            width: -webkit-fill-available;
            display: inline-grid;
            align-items: center;
            -webkit-box-align: center;
            -webkit-box-pack: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            white-space: nowrap;
            font-size: 14px;
            line-height: 22px;
            font-weight: bold;
            padding-right: 16px;
            padding-left: 16px;
            border-radius: 999999px;
            box-sizing: border-box
            transition: color 0.2s ease 0s, background-color 0.2s ease 0s, box-shadow 0.2s ease 0s;
            height: 32px;
            background-color: transparent;
            color: #0096FA;
            position: relative;
            top: -7px;
        `);
        div.setAttribute('style', `
            display: block;
        `);
    }
    span.innerText = 'R-18';
    if (GM_getValue('pixiv-quick-safemode', false)) {
        span.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
        span.style.color = 'rgb(255, 64, 96)';
    }
    span.addEventListener('click', function () {
        if (GM_getValue('pixiv-quick-safemode', false)) {
            GM_setValue('pixiv-quick-safemode', false);
            span.style.backgroundColor = 'transparent';
            span.style.color = '#0096FA';
        } else {
            GM_setValue('pixiv-quick-safemode', true);
            span.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
            span.style.color = 'rgb(255, 64, 96)';
        }
    }, false);
    div.appendChild(span);
    div.setAttribute('class', 'Pixiv-QuickSafeMode');
    return div;
}

let main = function () {
    let nav = document.querySelectorAll('nav');
    let figcaption = document.querySelectorAll('figcaption');
    let section = document.querySelectorAll('section');
    // 确定为作品页面 (作品页面没有顶部 <nav> 菜单栏)
    if (section.length > 4 && figcaption.length === 1 && nav[0].parentNode.childNodes.length === 1) {
        if (section[3].parentNode === section[4].parentNode) {
            section[3].appendChild(button("artwork"));
        }
    }
    // 通过顶部 <nav> 菜单栏定位按钮
    else if (nav.length > 0 && figcaption.length === 0) {
        let div_nav = document.querySelector('nav');
        div_nav.appendChild(button("nav"));
    }
    delete_r18();
    last_run_time = new Date().getTime();
}

let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function () {
        if (new Date().getTime() - last_run_time > 100) {
            // 主函数-添加交互按钮
            if (document.querySelectorAll('div[class="Pixiv-QuickSafeMode"]').length === 0) {
                main();
                delete_r18();
            }
            // 删除R-18
            else {
                delete_r18();
            }
            // console.log('Pixiv-QuickSafeMode: MutationObserver');
        }
    });
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log("JS script Pixiv-ForceSafeMode (Pixiv-强制和谐模式) loaded. See more details at https://github.com/SynRGB/Pixiv-QuickSafeMode");