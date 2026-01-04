// ==UserScript==
// @name claudeTokenLogin
// @namespace https://fk.oeatv.com/
// @version 1.1.4
// @description 使用 token 登录 claude
// @author fk.oeatv.com
// @match https://claude.ai/*
// @match https://www.atvai.com/*
// @grant none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/489697/claudeTokenLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/489697/claudeTokenLogin.meta.js
// ==/UserScript==

(function() {
var tokenInput = document.createElement('input');
tokenInput.type = 'text';
tokenInput.placeholder = '请输入sessionKey';
tokenInput.style.marginRight = '10px';

var saveButton = document.createElement('button');
saveButton.innerText = '保存并应用';

var cookieDisplay = document.createElement('div');
cookieDisplay.style.marginTop = '10px';
cookieDisplay.style.wordBreak = 'break-all';

var container = document.createElement('div');
container.style.position = 'fixed';
container.style.top = '10px';
container.style.right = '10px';
container.style.zIndex = '9999';
container.style.backgroundColor = 'white';
container.style.padding = '10px';
container.style.borderRadius = '5px';
container.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';

container.appendChild(tokenInput);
container.appendChild(saveButton);
container.appendChild(cookieDisplay);

document.body.appendChild(container);

saveButton.addEventListener('click', function() {
    var token = tokenInput.value;
    var cookieValue = 'sessionKey=' + token + '; path=/';
    document.cookie = cookieValue;
    location.reload();
});

})();