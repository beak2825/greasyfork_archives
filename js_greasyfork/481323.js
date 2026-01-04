// ==UserScript==
// @name               ESJ Zone: Notifications on Mobile
// @name:zh-TW         ESJ Zone：流動版通知
// @name:zh-CN         ESJ Zone：移动版通知
// @description        Enable notification dot on mobile UI.
// @description:zh-TW  在流動版界面顯示通知徽章。
// @description:zh-CN  在移动版界面显示通知标志。
// @icon               https://icons.duckduckgo.com/ip3/www.esjzone.cc.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.2.0
// @license            MIT
// @match              https://www.esjzone.cc/*
// @match              https://www.esjzone.me/*
// @match              https://www.esjzone.one/*
// @run-at             document-end
// @grant              none
// @require            https://update.greasyfork.org/scripts/483122/1304475/style-shims.js
// @supportURL         https://greasyfork.org/scripts/481323/feedback
// @downloadURL https://update.greasyfork.org/scripts/481323/ESJ%20Zone%3A%20Notifications%20on%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/481323/ESJ%20Zone%3A%20Notifications%20on%20Mobile.meta.js
// ==/UserScript==

GM.addStyle(`
    @media (max-width: 991px)
    {
        .site-branding .account-msg::after
        {
            display: block;
            position: absolute;
            top: 10px;
            left: 54px;
            border-width: 1px;
            border-radius: 50%;
            width: 10px;
            height: 10px;
            content: " ";
            background: #fd3995;
        }
    }

    @media (max-width: 576px)
    {
        .site-branding .account-msg::after
        {
            left: 41px;
        }
    }

    #mobile-menu .account-msg::after
    {
        display: block;
        position: absolute;
        top: 5px;
        left: 45px;
        border-width: 1px;
        border-radius: 50%;
        width: 10px;
        height: 10px;
        content: " ";
        background: #fd3995;
    }
`);

const accountButton = document.querySelector(".tools .account");
if (accountButton.classList.contains("account-msg"))
{
    const menuToggle = document.querySelector(".site-branding .menu-toggle");
    menuToggle.classList.add("account-msg");

    const memberMenuToggle = document.querySelector("#mobile-menu .menu li:nth-child(2) .sub-menu-toggle");
    memberMenuToggle.classList.add("account-msg");
}
