// ==UserScript==
// @name         Stand隐藏Key和id
// @description  在stand.gg上隐藏账户ID和激活秘钥
// @version      0.1
// @author       Karendes
// @match        *://*.stand.gg/*
// @grant        none
// @namespace https://greasyfork.org/users/913927
// @downloadURL https://update.greasyfork.org/scripts/483176/Stand%E9%9A%90%E8%97%8FKey%E5%92%8Cid.user.js
// @updateURL https://update.greasyfork.org/scripts/483176/Stand%E9%9A%90%E8%97%8FKey%E5%92%8Cid.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.documentElement.style.display = 'none';
    window.addEventListener('load', function() {
        document.documentElement.style.display = 'block';
    });

    var currentURL = window.location.href;

if (currentURL.startsWith("https://stand.gg") || currentURL.startsWith("http://stand.gg"))
    {

        var accountIdElement = document.getElementById('account-id');

        if (accountIdElement) {
            accountIdElement.textContent = "不要想着偷看";

            var revealButton = document.getElementById('reveal-account-id');
            if (revealButton) {
                revealButton.parentNode.removeChild(revealButton);
            }
        }



        var activationKeyElement = document.getElementById('activation-key');

        if (activationKeyElement)
        {
            activationKeyElement.style.display = 'none';

            var cardTitleElements = document.getElementsByClassName('card-title');
            for (var i = 0; i < cardTitleElements.length; i++) {
                if (cardTitleElements[i].textContent === 'Activation Key') {
                    cardTitleElements[i].textContent = '输入123解锁查看秘钥';
                    break;
                }
            }


    // 添加输入框和确认按钮
    var inputBox = document.createElement('input');
    inputBox.setAttribute('type', 'text');
    inputBox.style.margin = '10px';
    inputBox.style.border = '1px solid #ccc';
    inputBox.style.borderRadius = '5px';

    var confirmButton = document.createElement('button');
    confirmButton.textContent = '确认';
    confirmButton.style.margin = '10px';
    confirmButton.style.border = '1px solid #ccc';
    confirmButton.style.borderRadius = '5px';
    confirmButton.style.cursor = 'pointer';

    confirmButton.addEventListener('click', function() {
        var inputText = inputBox.value;
        if (inputText === '123') {
            for (var i = 0; i < cardTitleElements.length; i++) {
                if (cardTitleElements[i].textContent === '输入123解锁查看秘钥') {
                    cardTitleElements[i].textContent = 'Activation Key';
                    break;
                }
            }
            activationKeyElement.style.display = 'block';
            inputBox.style.display = 'none';
            confirmButton.style.display = 'none';
        }
    });

    var container = document.createElement('div');
    container.style.display = 'inline-block';
    container.style.marginTop = '10px';
    container.appendChild(inputBox);
    container.appendChild(confirmButton);
    activationKeyElement.parentNode.insertBefore(container, activationKeyElement.nextSibling);
        }
}
})();
