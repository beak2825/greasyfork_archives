// ==UserScript==
// @name         Twitch Stripper
// @namespace    https://greasyfork.org/en/scripts/462239-twitch-stripper
// @version      0.2.1
// @description  Remove un-needed stuff from the twitch.tv website
// @author       Occultism Cat
// @match        http*://*.twitch.tv/*
// @icon         https://cdn.discordapp.com/attachments/1084074710897266728/1084074754111197194/twitch_icon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462239/Twitch%20Stripper.user.js
// @updateURL https://update.greasyfork.org/scripts/462239/Twitch%20Stripper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getElementByXpath(path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function start(){
        if (document.readyState != 'complete'){
            setTimeout(start, 500)
        }
        console.log('TS | STARTING!');
        twitch_stripper();
    }

    function twitch_stripper(){
        var recommeneded_channels = document.querySelector('[class="Layout-sc-1xcs6mc-0 bbPHvU side-nav side-nav--collapsed"]');
        recommeneded_channels.remove();
        var video_player = document.getElementsByClassName("InjectLayout-sc-1i43xsx-0 persistent-player")[0];
        video_player.remove();
        var video_player2 = document.getElementsByClassName("channel-root__player channel-root__player--with-chat")[0];
        video_player2.remove();
        var signup_message = document.querySelector('[id="twilight-sticky-footer-root"]');
        signup_message.remove();
        var search_bar = document.getElementsByClassName("InjectLayout-sc-1i43xsx-0 ghHeNF top-nav")[0];
        search_bar.remove();
        var about = document.getElementsByClassName("Layout-sc-1xcs6mc-0 iYgXhH")[0];
        about.remove();
        var buttons = document.getElementsByClassName("Layout-sc-1xcs6mc-0 cKyclM")[0];
        buttons.remove();
        var ffz_buttons = document.getElementsByClassName("Layout-sc-1xcs6mc-0 csRagt")[0];
        ffz_buttons.remove();
        var profile_picture = document.getElementsByClassName("Layout-sc-1xcs6mc-0 elZcx")[0];
        profile_picture.setAttribute('style', 'transform: translateX(57px) translateY(317px) scale(3.4);');
        //profile_picture.remove();
        var username = getElementByXpath('/html/body/div[1]/div/div[2]/div/main/div/div[3]/div/div/div/div[1]/div/div/section/div/div/div/div/div/div[1]/div/a/h1');
        username.setAttribute('style', 'transform: scaleX(1.87) scaleY(2.2) translateX(-24px) translateY(-5px);background-color: var(--color-background-accent-alt-2);');
        var invis_header_bar = getElementByXpath('/html/body/div[1]/div/div[2]/div/main/div[1]/div[3]/div/div/div/div[1]/div/div/section/div/div/div/div/div/div[2]/div[1]');
        var viewer_count = getElementByXpath('/html/body/div[1]/div/div[2]/div/main/div/div[3]/div/div/div/div[1]/div/div/section/div/div/div/div/div/div[2]/div/div/div[2]/div[1]/div[1]/div')
        //viewer_count.setAttribute('style', '')
        invis_header_bar.remove();
        var chat_input = document.getElementsByClassName("Layout-sc-1xcs6mc-0 bGyiZe chat-input")[0];
        chat_input.remove();
        var chat_header = document.getElementsByClassName("Layout-sc-1xcs6mc-0 jBYVfx stream-chat-header")[0];
        chat_header.remove();
        var share_button = document.getElementsByClassName("ScCoreButton-sc-ocjdkq-0 ibtYyW ScButtonIcon-sc-9yap0r-0 iqxxop")[0];
        share_button.setAttribute('style', 'color: var(--color-fill-live);')
        //share_button.remove();
        var options_button = getElementByXpath("/html/body/div[1]/div/div[2]/div/main/div/div[3]/div/div/div/div[1]/div/div/section/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/button");
        options_button.setAttribute('style', 'color: var(--color-fill-live);');
        //options_button.remove();
        //var video_player3 = document.getElementsByClassName("Layout-sc-1xcs6mc-0 kfOuIF tw-root--theme-dark tw-root--hover")[0];
        //video_player3.remove();
        var chat_leaderboard = getElementByXpath('//*[@id="live-page-chat"]/div/div/div/div/div/section/div/div[1]');
        chat_leaderboard.remove();
        var welcome_message = getElementByXpath('//*[@id="live-page-chat"]/div/div/div/div/div/section/div/div[3]/div[2]/div[2]/div[3]/div/div/div[1]');
        welcome_message.remove();
        var close_chat_button = getElementByXpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div[2]');
        close_chat_button.remove();
        var channel_root_with_chat = document.querySelector('[class="channel-root__info channel-root__info--with-chat"]');
        channel_root_with_chat.setAttribute('style', '');
        var invis_video_player = getElementByXpath('//*[@id="root"]/div/div[2]/div/main/div[1]/div[3]/div/div/div/div[1]/div/div/div');
        invis_video_player.remove();
        var invis_snackbar = getElementByXpath('/html/body/div/div/div[2]/div/main/div[2]');
        invis_snackbar.remove();
        var chatbox = getElementByXpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/aside/div');
        chatbox.setAttribute('style', 'align-items: center;text-align: -webkit-center;opacity: 1;transform: translateX(-500px) scaleX(1.96) scaleY(1.0);text-rendering: optimizeSpeed;-webkit-text-stroke-width: thin;font-family: monospace;border-right: solid;color-rendering: optimizeSpeed;place-items: flex-end;');
        var chatbox_log = getElementByXpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/aside/div/div/div/div/div/section/div/div[3]/div[2]/div[2]/div[3]/div/div');
        chatbox_log.setAttribute('style', 'color: snow;outline-style: auto;outline-color: var(--color-accent);background-color: var(--color-background-accent-alt-2);');
        var new_buttons = getElementByXpath('/html/body/div[1]/div/div[2]/div/main/div/div[3]/div/div/div/div[1]/div/div/section/div/div/div/div/div/div[2]/div/div/div[2]');
        new_buttons.setAttribute('style', 'transform: translateY(10px) translateX(-111px) scaleX(1.2) scaleY(1.8);background-color: var(--color-accent);color: var(--color-background-live);');
        var page_background = getElementByXpath('/html/body/div[1]/div/div[2]/div/main/div/div[3]/div/div');
        page_background.setAttribute('style', 'background-color: var(--color-background-alt-2);');
        var view_count_number = getElementByXpath('/html/body/div[1]/div/div[2]/div/main/div/div[3]/div/div/div/div[1]/div/div/section/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div[1]/div/p/span');
        view_count_number.setAttribute('style', 'color: var(--color-background-live);');
    }
    window.addEventListener("load", () => {
        start();
    });
})();