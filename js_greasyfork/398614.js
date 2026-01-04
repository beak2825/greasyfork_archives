// ==UserScript==
// @version      4.0.0
// @author       聖冰如焰
// @description  自動點擊50獎勵
// @description:en   Auto get 50 reward.
// @license      BY-NC-SA 3.0 TW
// @name         Twitch 自動點擊獎勵
// @name:en      Twitch auto get bonus
// @match        https://www.twitch.tv/*
// @namespace    http://tampermonkey.net/
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/398614/Twitch%20%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E7%8D%8E%E5%8B%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/398614/Twitch%20%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E7%8D%8E%E5%8B%B5.meta.js
// ==/UserScript==
'user strict'

GM_addStyle(`
#gift-count__button{
    padding : 0 15px 0 15px;
    display: inline-flex;
    position: relative;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    vertical-align: middle;
    text-decoration: none;
    white-space: nowrap;
    user-select: none;
    font-weight: var(--font-weight-semibold);
    border-radius: var(--border-radius-medium);
    font-size: var(--button-text-default);
    height: var(--button-size-default);
    background-color: var(--color-background-button-text-default);
    color: var(--color-text-alt-2);
}

#gift-count__button:hover{
    background-color: var(--color-background-button-text-hover);
}

#gift-count__button:active {
    background-color: var(--color-background-button-text-active);
}

#gift-count__button::before{
    content: '';
}

#gift-count__button:hover::before{
    content: '自動領取獎勵數';
    user-select: none;
    background-color: #040109;
    border-radius: 4px;
    color: #fff;
    font-size: 1.2rem;
    font-weight: 600;
    right: 0;
    line-height: 1.2;
    padding: 3px 6px;
    padding-top: 3px;
    padding-right: 6px;
    padding-bottom: 3px;
    padding-left: 6px;
    pointer-events: none;
    position: absolute;
    text-align: left;
    user-select: none;
    white-space: nowrap;
    z-index: 2000;
    top: 50%;
    transform: translate(110%,-50%);
}`);

let Gift = 0;
let TimeOut = 50;
let Container;
let GiftCountButton = $('<button id="gift-count__button">0</button>');

let ContainerCheck = () => {
    if (!$("#gift-count__button").length) {
        Gift = GM_getValue(location.href, 0);
        Container = $('.chat-input__buttons-container div:eq(0)');
        GiftCountButton.text((Gift).toLocaleString())
        Container.after(GiftCountButton);
    }
    requestAnimationFrame(ContainerCheck);
};

window.onload = function () {
    requestAnimationFrame(ContainerCheck);
    (function Get_coins() {
        TimeOut = 50;
        let Bonus = $('.claimable-bonus__icon');
        if (Bonus.length !== 0) {
            Bonus.click();
            GM_setValue(location.href, Gift + 50);
            GiftCountButton.text((Gift += 50).toLocaleString())
            TimeOut = 6000;
            console.log(new Date, Gift);
        }
        setTimeout(Get_coins, TimeOut);
    })();
};
