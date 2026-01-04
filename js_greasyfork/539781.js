// ==UserScript==
// @name         巴哈姆特 快捷隱藏按鈕
// @version      1.4.1
// @description  快捷黑名單按鈕 隱藏文章按鈕
// @author       thomas2013
// @match        *://forum.gamer.com.tw/B.php?*
// @match        *://forum.gamer.com.tw/Co.php?*
// @match        *://forum.gamer.com.tw/C.php?*
// @match        *://home.gamer.com.tw/homeindex.php?sk-username=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/539781/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20%E5%BF%AB%E6%8D%B7%E9%9A%B1%E8%97%8F%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/539781/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20%E5%BF%AB%E6%8D%B7%E9%9A%B1%E8%97%8F%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const styles = document.createElement('style');
    styles.textContent = `
        .block-sn {
            display: none !important;
        }
    `;
    document.head.appendChild(styles);
    const DEV = false; // true: 開發模式, false: 生產模式

    function waitForResult(username) {
        let timeout = 20000;
        let textContent = '';
        const start = Date.now();
        const interval = setInterval(() => {
            const dialog = document.querySelector('.dialogify__body');
            if (!dialog) {
                return
            }
            const pElement = dialog.querySelector('p');
            if (pElement) {
                textContent = pElement.textContent.trim();
            }

            if (textContent === '已加進黑名單' || textContent === '已經在名單中') {
                clearInterval(interval);
                window.close();
            }
                    
            if (Date.now() - start >= timeout) {
                clearInterval(interval);
                window.close();
                return;
            }

        }, 200);
    }

    if (window.location.pathname.includes('/homeindex.php')) {
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('sk-username') || 'Unknown';
        addBlackList(username, 'home');
        const dialog = document.querySelector('.dialogify__body');
        dialog.insertAdjacentHTML('beforeend', `<p>用戶 ${username}</p>`);
        $('button[type="submit"].btn.btn-insert.btn-primary[autofocus]:contains("確定")').click();
        waitForResult(username);
        return;
    }

    function saveListToLocalStorage(list, bsn) {
        try {
            rawBlackList[bsn] = list;
            localStorage.setItem('snBlackList', JSON.stringify(rawBlackList));
        } catch (error) {
            console.error(`Error saving list to localStorage: ${error}`);
        }
    }

    function getListFromLocalStorage() {
        try {
            const storedList = localStorage.getItem('snBlackList');
            return storedList ? JSON.parse(storedList) : [];
        } catch (error) {
            console.error(`Error reading list from localStorage: ${error}`);
            return [];
        }
    }

    function joinBlackBsn(sn) {
        console.log(`文章ID ${sn} 加入黑名單`);
        snBlackList.push(sn);
        saveListToLocalStorage(snBlackList, bsn);
        const b_list = document.querySelectorAll('.b-list__row');
        b_list.forEach(function (element) {
            const targetSn = getSnFromElement(element);
            if (sn === targetSn) {
                element.classList.add('block-sn');
                return;
            }
        });
        updateBlockerData();
        updateSnListDisplay();
    }

    function getSnFromElement(element) {
            const snElement = element.querySelector('.b-list__main a');
            let sn = snElement ? snElement.getAttribute('href') : 'Unknown';
            const match = sn.match(/snA=([^&]+)/);
            sn = match ? match[1] : 'Unknown';
            return sn;  
    }


    const blockUserButtonBox1 = (id, username) => `
    <div class="sk-block-button-box" style="position: absolute; right: 143px; top: 73px;">
        <button id="${id}" class="sk-block-button" data-username="${username}" style="background-color: rgba(72, 72, 72, 0); color: #208D8D; border-radius: 5px; border: 1px solid #208D8D;" type="button">黑</button>
    </div>
    `;

    const blockUserButtonBox2 = (id, username) => `
    <div class="sk-block-button-box" style="position: absolute; left: 6px; top: 17px;">
        <button id="${id}" class="sk-block-button" data-username="${username}" style="background-color: rgba(72, 72, 72, 0); color: #208D8D; border-radius: 5px; border: 1px solid #208D8D;" type="button">黑</button>
    </div>
    `;

    const blockUserButtonBox3 = (id, username) => `
    <div class="sk-block-button-box" style="position: relative; left: 0px; top: 7px;">
        <button id="${id}" class="sk-block-button" data-username="${username}" style="height: 25px; width: 39px; background-color: rgb(22 162 178);color: #ffffff; border-radius: 5px; bor; border: 1px solid #16a2b2; font-weight: bold; font-size: 15px;" type="button">黑</button>
    </div>
    `;

    const blockSnButtonBox = (index, sn) => `
    <div class="sk-block-button-box" style="position: absolute; left: 35px; top: 73px;">
        <button id="sk-sn-button-${index}" class="sk-block-button" data-sn="${sn}" style="background-color: rgba(72, 72, 72, 0); color: #208D8D; border-radius: 5px; border: 1px solid #208D8D;" type="button">隱藏</button>
    </div>
    `;
    
    const settingPageHtml = `
        <li><a id="sk-blocker-list-setting" href="javascript:void(0);" class="BH-menuE__link">快捷黑名單</a></li>
        <div id="sk-setting-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: transparent; z-index: 999;"></div>
        <div id="sk-setting-page" style="position: absolute; top: 40px; left: 20%; width: 60%; height: 80vh; background-color: #282828; color: white; padding: 10px; display: none; z-index: 1000; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 10px;">
                <button id="sk-list-download" style="padding: 8px 16px; margin-right: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; transition: background-color 0.3s; outline: none;" onmouseover="this.style.backgroundColor='#45a049';" onmouseout="this.style.backgroundColor='#4CAF50';">下載列表</button>
                <div style="display: inline-block; margin: 20px;">
                    <button id="sk-list-upload-btn" style="padding: 8px 16px; margin-right: 10px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; transition: background-color 0.3s; outline: none;" onmouseover="this.style.backgroundColor='#1e88e5';" onmouseout="this.style.backgroundColor='#2196F3';">上傳列表</button>
                    <input type="file" id="sk-list-upload" style="display: none;" accept=".json">
                </div>
                <button id="sk-list-clear" style="padding: 8px 16px; margin-right: 10px; background-color:rgb(217, 56, 56); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; transition: background-color 0.3s; outline: none;">清除列表</button>
            </div>
            <div style="box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; overflow-y: auto; height: 67vh; margin: 0; padding: 10px; border: 1px solid #444; background-color: #333; color: white;">
                <div style="margin-bottom: 10px;"><h2>隱藏文章列表</h2></div>
                <p id="block-counter"></p>
                <div id="sk-sn-list-displayer" box-sizing: border-box;"></div>
            </div>        
        </div>
    `;

    function updateSnListDisplay() {
        removeDataButtons = [];
        const blockCounter = document.getElementById('block-counter');
        blockCounter.textContent = `數量: ${snBlackList.length}`;
        const snListDisplayer = document.getElementById('sk-sn-list-displayer');
        snListDisplayer.innerHTML = '';
        snBlackList.forEach(sn => {
            const p = document.createElement('p');
            p.innerHTML = `<a href="https://forum.gamer.com.tw/C.php?bsn=${bsn}&snA=${sn}" target="_blank">bsn=${bsn}&snA=${sn}</a>`;
            p.innerHTML += ` <button class="sk-sn-remove-button" id="remove-data-${sn}" style="background-color: rgba(72, 72, 72, 0); color: #D9304C; border-radius: 5px; border: 1px solid #D9304C; cursor: pointer; margin-left: 10px;">移除</button>`;
            removeDataButtons.push(`remove-data-${sn}`);
            snListDisplayer.appendChild(p);
        });
        removeDataButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                const sn = this.id.replace('remove-data-', '');
                snBlackList = snBlackList.filter(item => item !== sn);
                saveListToLocalStorage(snBlackList, bsn);
                updateSnListDisplay();
                updateBlockerData();
            });
        });
    }

    function updateBlockerData(){
        bsn = new URLSearchParams(window.location.search).get('bsn') || 'Unknown';
        rawBlackList = getListFromLocalStorage();
        snBlackList = rawBlackList[bsn] || [];
    }
    let removeDataButtons = [];
    let snBlackList = [];
    let bsn = 0;
    let rawBlackList = "";
    updateBlockerData();
    console.log(`隱藏文章數量: ${snBlackList.length}`);
    
    const buttonIds = new Map();
    // let buttonIndex = 0;
    let b_list = [];
    let top_list = [];
    let reply_list = [];
    let more_reply = [];
    const locationUrl = window.location.href;
    if (locationUrl.includes('/B.php')) {
        b_list = document.querySelectorAll('.b-list__row');
        top_list = document.querySelectorAll('.b-list__row--sticky');
    } else if (locationUrl.includes('/C.php')|| locationUrl.includes('/Co.php')) {
        b_list = document.querySelectorAll('.c-user ');
        reply_list = document.querySelectorAll('.c-reply__item');
        more_reply = document.querySelectorAll('.more-reply');
    }

    const top_menu = document.querySelector('.BH-menuE');
    top_menu.insertAdjacentHTML('beforeend', settingPageHtml);

    let buttonUserList = [];
    let buttonSnList = [];
    if (locationUrl.includes('/B.php')) {
        b_list.forEach(function (element, index) {            
            if (index < top_list.length) {
                return;
            }
            const buttonId = `sk-button-username-${index}`;
            const userElement = element.querySelector('.b-list__count__user a');
            const username = userElement ? userElement.textContent.trim() : 'Unknown';
            element.insertAdjacentHTML('beforeend', blockUserButtonBox1(buttonId, username));

            const sn = getSnFromElement(element);
            element.insertAdjacentHTML('beforeend', blockSnButtonBox(index, sn));
            
            if (snBlackList.includes(sn)) {
                element.classList.add('block-sn');
                return;
            }
            buttonUserList.push(buttonId);
            buttonSnList.push(`sk-sn-button-${index}`);
        });
        addFunToButtons();

    } else if (locationUrl.includes('/C.php')|| locationUrl.includes('/Co.php')) {
        b_list.forEach(function (element, index) {           
            const userElement = element.querySelector('.c-user__avatar');
            const username = userElement ? userElement.getAttribute('data-gamercard-userid') : 'Unknown';
            const buttonId = `sk-button-avatar-${index}`;
            element.insertAdjacentHTML('beforeend', blockUserButtonBox3(buttonId, username));
            buttonUserList.push(buttonId);
        });
        createBlockButtonBox_reply();
        addFunToButtons();
    }

    if (more_reply) {
        more_reply.forEach(function (element, index) {
            element.addEventListener('click', function (event) {
                let initialLength = reply_list.length;
                const intervalId = setInterval(() => {
                    reply_list = document.querySelectorAll('.c-reply__item');
                    if (reply_list.length !== initialLength) {
                        clearInterval(intervalId);
                        createBlockButtonBox_reply();
                        addFunToButtons();
                        return;
                    }
                }, 250);
                setTimeout(() => {
                    clearInterval(intervalId);
                }, 10000);
            });
        });
    }

    function removeBlockButtons() {
        const blockButtons = document.querySelectorAll('.sk-block-button-box');
        blockButtons.forEach(buttonBox => {
            buttonBox.remove();
        });
    }
    
    function createBlockButtonBox_reply() {
        const length = buttonUserList.length;
        reply_list.forEach(function (element, index) {
            index = index + length;
            const userElement = element.querySelector('.reply-avatar ');
            if (element.querySelector('.sk-block-button-box')) {
                return;
            }
            let username = userElement.getAttribute('href');
            username = username.split('/').pop();
            const buttonId = `sk-button-reply-${index}`;
            element.insertAdjacentHTML('beforeend', blockUserButtonBox2(buttonId, username));
            buttonUserList.push(buttonId);
        });
    }

    function addFunToButtons() {
        buttonUserList.forEach(function (buttonId) {
            if (buttonIds.has(buttonId)) {
                return;
            }
            const button = document.getElementById(buttonId);
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                const username = this.getAttribute('data-username');
                if (DEV) {
                    alert(`使用者: ${username}`);
                    console.log(`${buttonId}使用者: ${username}`);
                } else {
                    window.open(`https://home.gamer.com.tw/homeindex.php?sk-username=${username}`, '_block', 'width=10,height=10');
                    window.focus();
                }
            });
            buttonIds.set(buttonId, true);
        });
    }

    buttonSnList.forEach(function (buttonId) {
        const button = document.getElementById(buttonId);
        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            const sn = this.getAttribute('data-sn');
            joinBlackBsn(sn);
        });
    });
    updateSnListDisplay();
    
    const skListClear = document.getElementById('sk-list-clear');
    skListClear.addEventListener('click', function () {
        if (confirm('確定要清除 所有 隱藏文章嗎？')) {
            snBlackList = [];
            rawBlackList = {};
            bsn = 0;
            saveListToLocalStorage(snBlackList, bsn);
            updateSnListDisplay();
            updateBlockerData();
        }
    });

    const skListDownload = document.getElementById('sk-list-download');
    skListDownload.addEventListener('click', function () {
        const dataStr = JSON.stringify(rawBlackList, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'snBlackList.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });


    const skListUploadBtn = document.getElementById('sk-list-upload-btn');
    const skListUpload = document.getElementById('sk-list-upload');

    skListUploadBtn.addEventListener('click', () => {
        skListUpload.click();
    });

    skListUpload.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            console.log('已選擇檔案:', file.name);
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);
                    rawBlackList = data;
                    console.log('解析後的資料:', rawBlackList);
                    localStorage.setItem('snBlackList', JSON.stringify(rawBlackList));
                    updateBlockerData();
                    updateSnListDisplay();
                    alert('成功讀取');
                } catch (error) {
                    console.error('解析 JSON 檔案時發生錯誤:', error);
                    alert('無法解析檔案，請確保檔案格式正確。');}
            };
            reader.onerror = function () {
                console.error('讀取檔案時發生錯誤');
                alert('無法讀取檔案，請確保檔案存在且可讀取。');
            };
            reader.readAsText(file);
        } else {
            console.log('未選擇任何檔案');
            alert('請選擇一個檔案。');
        }
    });

    const settingPage = document.getElementById('sk-setting-page');
    const settingOverlay = document.getElementById('sk-setting-overlay');
    document.getElementById('sk-blocker-list-setting').addEventListener('click', function () {
        settingOverlay.style.display = settingOverlay.style.display === 'none' ? 'block' : 'none';
        settingPage.style.display = settingPage.style.display === 'none' ? 'block' : 'none';
    });
    document.getElementById('sk-setting-overlay').addEventListener('click', function () {
        settingOverlay.style.display = 'none';
        settingPage.style.display = 'none';
    });

})();