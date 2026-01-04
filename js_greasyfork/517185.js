// ==UserScript==
// @name         BGM小组信息加密工具
// @namespace    http://tampermonkey.net/
// @version      1.7
// @author       Sedoruee
// @match        https://bgm.tv/group/topic/*
// @match        https://bangumi.tv/group/topic/*
// @match        https://chii.in/group/topic/*
// @description null
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517185/BGM%E5%B0%8F%E7%BB%84%E4%BF%A1%E6%81%AF%E5%8A%A0%E5%AF%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/517185/BGM%E5%B0%8F%E7%BB%84%E4%BF%A1%E6%81%AF%E5%8A%A0%E5%AF%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Target elements and replacement text
    const elementsToHide = [
        { selector: '.ico_reply.ico', replacement: '解密后不支持回复楼层' },
        { selector: 'div.action:nth-of-type(4)', replacement: '' }
    ];


    function hideElementsAndReplace() {
        elementsToHide.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
            elements.forEach(element => {
                const replacement = document.createElement('span');
                replacement.textContent = item.replacement;
                replacement.style.color = 'red'; // Optional: Style the replacement text
                element.parentNode.replaceChild(replacement, element);
            });
        });
    }


    // Run the function when the page loads and also when the DOM changes
    const observer = new MutationObserver(hideElementsAndReplace);
    observer.observe(document.body, { childList: true, subtree: true });

    //Initial execution for elements already present on load
    hideElementsAndReplace();

})();

(function() {
    'use strict';

    const defaultKeys = {
        "bangumi": "默认密钥",
        "sedoruee": "Sedoruee"
    };

    let keys = GM_getValue('keys', defaultKeys);
    let currentKey = GM_getValue('currentKey', "bangumi");
    let decryptionEnabled = GM_getValue('decryptionEnabled', true); // Track decryption state

    // 加密/解密函数 (使用 AES)
    function encrypt(text, key) { return CryptoJS.AES.encrypt(text, key).toString(); }
    function decrypt(ciphertext, key) {
        try { return CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8); }
        catch (e) { return null; }
    }

    // 自动解密
    function autoDecryptPage() {
        const encryptedRegex = /\[加密\](.*?)\[topic409567\]/g;
        document.body.innerHTML = document.body.innerHTML.replace(encryptedRegex, (match, p1) => {
            if (decryptionEnabled) { // Only decrypt if enabled
                for (const key in keys) {
                    const decryptedText = decrypt(p1, key);
                    if (decryptedText) return decryptedText;
                }
            }
            return match; // 解密失败保留原文
        });
    }

    function createButtons() {
        const submitBtn = document.querySelector('#submitBtnO');
        if (!submitBtn) return;

        // 密钥选择下拉框
        const keySelect = document.createElement('select');
        for (const key in keys) {
            const option = document.createElement('option');
            option.value = key;
            option.text = keys[key];
            if (key === currentKey) option.selected = true;
            keySelect.appendChild(option);
        }
        keySelect.addEventListener('change', () => {
            currentKey = keySelect.value;
            GM_setValue('currentKey', currentKey);
        });

        // 加密按钮
        const encryptBtn = document.createElement('button');
        encryptBtn.innerText = '加密';
        encryptBtn.style.marginLeft = '10px';
        encryptBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const contentTextarea = document.querySelector('#content');
            if (contentTextarea) {
                const encryptedText = '[加密]' + encrypt(contentTextarea.value, currentKey) + '[topic409567]';
                contentTextarea.value = encryptedText;
            }
        });

        // 添加密钥按钮
        const addKeyBtn = document.createElement('button');
        addKeyBtn.innerText = '添加密钥';
        addKeyBtn.style.marginLeft = '10px';
        addKeyBtn.addEventListener('click', () => {
            let newKeyInput = prompt("请输入新的密钥和备注，以|分隔 (例如: mykey|我的密钥):");
            if (newKeyInput) {
                let [newKey, newKeyDesc] = newKeyInput.split("|");
                if (!newKey) return alert("密钥不能为空！");
                newKey = newKey.trim();
                newKeyDesc = (newKeyDesc || newKey).trim();
                keys[newKey] = newKeyDesc;
                GM_setValue('keys', keys);
            }
        });

        // 删除密钥按钮
        const deleteKeyBtn = document.createElement('button');
        deleteKeyBtn.innerText = '删除密钥';
        deleteKeyBtn.style.marginLeft = '10px';
        deleteKeyBtn.addEventListener('click', () => {
            let keyToDelete = prompt("请输入要删除的密钥:", currentKey);
             if (keyToDelete && keys[keyToDelete]) {
                if (confirm(`确定要删除密钥 ${keys[keyToDelete]} (${keyToDelete}) 吗？`)) {
                   delete keys[keyToDelete];
                   GM_setValue('keys', keys);
                   if (keyToDelete === currentKey) { // 如果删除的是当前密钥，则重置为默认密钥
                       currentKey = "bangumi";
                       GM_setValue('currentKey', currentKey);
                   }
                   location.reload(); // 刷新页面
                }
             } else {
                alert("密钥不存在！");
             }
        });


        // 解密切换按钮
        const toggleDecryptBtn = document.createElement('button');
        toggleDecryptBtn.innerText = decryptionEnabled ? '隐藏解密' : '显示解密';
        toggleDecryptBtn.style.marginLeft = '10px';
        toggleDecryptBtn.addEventListener('click', () => {
            decryptionEnabled = !decryptionEnabled;
            GM_setValue('decryptionEnabled', decryptionEnabled);
            toggleDecryptBtn.innerText = decryptionEnabled ? '隐藏解密' : '显示解密';
            autoDecryptPage(); // Redo decryption based on new state
            document.body.classList.toggle('show-replies', decryptionEnabled); // Toggle CSS class
        });

        // 插入按钮
        submitBtn.parentNode.insertBefore(keySelect, submitBtn.nextSibling);
        submitBtn.parentNode.insertBefore(encryptBtn, keySelect.nextSibling);
        submitBtn.parentNode.insertBefore(addKeyBtn, encryptBtn.nextSibling);
        submitBtn.parentNode.insertBefore(deleteKeyBtn, addKeyBtn.nextSibling);
        submitBtn.parentNode.insertBefore(toggleDecryptBtn, deleteKeyBtn.nextSibling);
    }

    // 页面加载时执行
    window.addEventListener('load', () => {
        autoDecryptPage();
        createButtons();

        // Add CSS to hide replies
        const style = document.createElement('style');
        style.textContent = `
            body:not(.show-replies) .ico_reply.ico {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        //Initial state of reply visibility
        document.body.classList.toggle('show-replies', decryptionEnabled);
    });

})();