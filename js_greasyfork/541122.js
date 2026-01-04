// ==UserScript==
// @name         Unicode码表 - 字符查询
// @namespace    https://martingrocery.top/
// @version      0.1
// @description  在unicode.org/charts界面添加使用字符查询的表单
// @author       Martin的杂货铺
// @match        https://www.unicode.org/charts/
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unicode.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541122/Unicode%E7%A0%81%E8%A1%A8%20-%20%E5%AD%97%E7%AC%A6%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/541122/Unicode%E7%A0%81%E8%A1%A8%20-%20%E5%AD%97%E7%AC%A6%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const formContainer = document.createElement('p');

    formContainer.className = 'map';
    formContainer.style.cssText = 'padding-bottom: 0; text-align:center;';

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/cgi-bin/Code2Chart';
    form.enctype = 'application/x-www-form-urlencoded';
    form.style.cssText = 'display: flex; flex-direction: row; justify-content: center; align-items: center';

    const title = document.createElement('strong');
    title.innerHTML = '通过字符查询：';
    form.appendChild(title);

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.name = 'charInput';
    inputField.size = '1';
    inputField.maxlength = '1';
    inputField.style.cssText = 'height: 1.5em;';
    form.appendChild(inputField);
    form.appendChild(document.createTextNode('\u00A0'));

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = '查询';
    form.appendChild(submitButton);

    form.appendChild(document.createTextNode('\u00A0'));

    const subText = document.createElement('span');
    subText.innerHTML = '<sub>added by Martin的杂货铺</sub>';
    subText.style.cssText = 'color: #00000066';
    form.appendChild(subText);

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const charValue = inputField.value;
        if (!charValue) {
            alert('请输入一个字符！');
            return;
        }

        const firstChar = [...charValue][0];
        const hexCode = firstChar.codePointAt(0).toString(16).toUpperCase();

        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'HexCode';
        hiddenInput.value = hexCode;
        form.appendChild(hiddenInput);

        form.submit();
    });

    formContainer.appendChild(form);

    const addPoint = document.querySelector('.body p:nth-child(3)');
    if (addPoint) {
        addPoint.after(formContainer);
    } else {
        console.error('failed to insert');
    }
})();