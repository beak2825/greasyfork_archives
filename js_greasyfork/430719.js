// ==UserScript==
// @name        Notion.so - App Deeplink Injector
// @name:en     Notion.so - App Deeplink Injector
// @description Add a 'Open in App' button to the sign in page
// @namespace   https://github.com/CDeLeon94/NotionAppLink/
// @match       https://www.notion.so/*
// @run-at      document-start
// @version     0.0.1
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/430719/Notionso%20-%20App%20Deeplink%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/430719/Notionso%20-%20App%20Deeplink%20Injector.meta.js
// ==/UserScript==

function open_app() {
    pageid = window.location.href.match(/https:\/\/www\.notion\.so\/(.*)/)[1];
    window.open("notion:/".concat(pageid));
    window.close()
}

function get_button_root()
{
    return document.querySelector('.notion-login')
}

function button_setup(){
    console.log('button_setup')
    if (get_button_root() == null) {
        window.requestAnimationFrame(button_setup)
    } else {
        newButton = document.createElement("div");
        newButton.innerText = "Open In App";
        newButton.style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; height: 36px; border-radius: 3px; color: white; font-size: 14px; line-height: 1; padding-left: 12px; padding-right: 12px; font-weight: 500; background: rgb(54, 53, 47); border: 1px solid rgb(190, 86, 67); box-shadow: rgba(15, 15, 15, 0.1) 0px 1px 2px; margin-bottom: 14px; width: 100%;";
        newButton.addEventListener('click', open_app);
        get_button_root().insertAdjacentElement('afterbegin', newButton);
    }
}

button_setup()
