// ==UserScript==
// @name:zh-tw   Cocos 滿版錯誤訊息屏蔽器
// @name         Cocos Fullscreen Error Blocker
// @namespace       com.sherryyue.cocoscreatorpreviewtool
// @version         0.7
// @description:zh-tw 此腳本在 Cocos 遊戲引擎的瀏覽器預覽模板中添加了一個按鈕，用於關閉錯誤訊息覆蓋層。當發生滿版的嚴重錯誤彈出時，只需點擊按鈕即可關閉覆蓋層，讓您能夠繼續使用遊戲而不受干擾。
// @description  This script adds a button to close the error message overlay in the Cocos game engine's browser preview template. When a fullscreen fatal error hint pops, the overlay can be closed with a single click, allowing you to continue using the game without interruption.
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @include           http://*:7456/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/437028/Cocos%20Fullscreen%20Error%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/437028/Cocos%20Fullscreen%20Error%20Blocker.meta.js
// ==/UserScript==
(function () {
    let injectPanel = () => {
        let el = document.body, html = `
<div class="toolkit">
  <button class="hideError">Hide error</button>
</div>
<style>
.toolkit {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 99999;
}
.toolkit .hideError{
  display: none;
  opacity: 0.4;
  padding: .5rem;
  border: 2px aliceblue solid;
  color: aliceblue;
  background: darkgray;
  border-radius: .5rem;
}
#error {
    background: blue;
    border-radius: .5rem;
    max-height: 100vh;
    padding: 1rem;
    opacity: 0.6;
    pointer-events: none;
}
#error .error-main {
    word-break: break-word;
    max-height: 70vh;
}
</style>
      `;
        // Internet Explorer, Opera, Chrome, Firefox 8+ and Safari
        if (el.insertAdjacentHTML)
            el.insertAdjacentHTML("beforebegin", html);
        else {
            let range = document.createRange();
            let frag = range.createContextualFragment(html);
            el.parentNode.insertBefore(frag, el);
        }
        bindEvent();
    };
    let errorOccur = () => {
        let $hideErrorBtn = document.querySelector('.hideError');
        $hideErrorBtn.style.display = "block";
        $hideErrorBtn.style.opacity = '1';
    };
    let hideErrorBlock = () => {
        let $hideErrorBtn = document.querySelector('.hideError');
        $hideErrorBtn.style.display = 'block';
        $hideErrorBtn.style.opacity = '0.4';
        let $errorBlock = document.getElementById('error');
        $errorBlock.style.display = "none";
    };
    let showErrorBlock = () => {
        let $hideErrorBtn = document.querySelector('.hideError');
        $hideErrorBtn.style.display = 'block';
        $hideErrorBtn.style.opacity = '1';
        let $errorBlock = document.getElementById('error');
        $errorBlock.style.display = "block";
    };
    let showErrorBtn = () => {
        let $hideErrorBtn = document.querySelector('.hideError');
        $hideErrorBtn.style.display = "block";
    };
    let hideErrorBtn = () => {
        let $hideErrorBtn = document.querySelector('.hideError');
        $hideErrorBtn.style.display = "none";
    };
    let toggleHideErrorBlock = () => {
        let $hideErrorBtn = document.querySelector('.hideError');
        if ($hideErrorBtn.style.opacity == '1')
            hideErrorBlock();
        else
            showErrorBlock();
    };
    let bindEvent = () => {
        let $hideErrorBtn = document.querySelector('.hideError');
        $hideErrorBtn.addEventListener("click", () => {
            toggleHideErrorBlock();
        });
    };
    let errorBlockObserver = new MutationObserver((mutations, obs) => {
        const $errorContent = document.querySelector('.error .error-main');
        if ($errorContent && $errorContent.innerHTML != "") {
            errorOccur();
            return;
        }
        else {
            hideErrorBtn();
            return;
        }
    });
    errorBlockObserver.observe(document.getElementById("GameDiv"), {
        childList: true,
        subtree: true
    });
    injectPanel();
})();
