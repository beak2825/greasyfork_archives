// ==UserScript==
// @name         dyurachaJSbot　Allowed encip Ultimate 常時オン
// @namespace    https://greasyfork.org/ja/users/735907-cauliflower-carrot
// @version      2.1
// @description  デュラチャで使えるかもしれないbot
// @author       aoi
// @match        *://drrrkari.com/room/*
// @icon         https://www.google.com/s2/favicons?domain=drrrkari.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505113/dyurachaJSbot%E3%80%80Allowed%20encip%20Ultimate%20%E5%B8%B8%E6%99%82%E3%82%AA%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/505113/dyurachaJSbot%E3%80%80Allowed%20encip%20Ultimate%20%E5%B8%B8%E6%99%82%E3%82%AA%E3%83%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ボタンを作成して追加
    const button = document.createElement("button");
    button.innerHTML = "ON"; // 初期状態をONに設定
    button.style.position = "absolute";
    button.style.zIndex = "1000";
    button.style.backgroundColor = "green"; // ONのときの色
    button.style.color = "black";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.fontSize = "16px";
    button.style.left = localStorage.getItem('buttonLeft') || "10px";
    button.style.top = localStorage.getItem('buttonTop') || "10px";
    button.style.width = localStorage.getItem('buttonWidth') || "80px";
    button.style.height = localStorage.getItem('buttonHeight') || "30px"; // 縦幅を狭くする

    // サイズ変更用のハンドルを作成
    const resizeHandle = document.createElement("div");
    resizeHandle.style.position = "absolute";
    resizeHandle.style.width = "10px";
    resizeHandle.style.height = "10px";
    resizeHandle.style.backgroundColor = "gray";
    resizeHandle.style.bottom = "0";
    resizeHandle.style.right = "0";
    resizeHandle.style.cursor = "nwse-resize";

    button.appendChild(resizeHandle);

    // UI表示・非表示ボタンを作成
    const toggleVisibilityButton = document.createElement("button");
    toggleVisibilityButton.innerHTML = "UI表示";
    toggleVisibilityButton.style.position = "absolute";
    toggleVisibilityButton.style.zIndex = "1002";
    toggleVisibilityButton.style.backgroundColor = "#87CEEB"; // 薄い青色
    toggleVisibilityButton.style.color = "black";
    toggleVisibilityButton.style.border = "none";
    toggleVisibilityButton.style.borderRadius = "5px";
    toggleVisibilityButton.style.cursor = "pointer";
    toggleVisibilityButton.style.fontSize = "16px";
    toggleVisibilityButton.style.left = localStorage.getItem('toggleButtonLeft') || "100px";
    toggleVisibilityButton.style.top = localStorage.getItem('toggleButtonTop') || "10px";
    toggleVisibilityButton.style.width = "80px";
    toggleVisibilityButton.style.height = "30px"; // 縦幅を狭くする

    // IP管理用インターフェース
    const ipManagementDiv = document.createElement("div");
    ipManagementDiv.innerHTML = `
        <h3 style="text-align: right; margin: 0 0 10px 0;">Allowed IP 管理</h3>
        <input type="text" id="ipInput" placeholder="IPアドレスを入力" style="width: 100%; box-sizing: border-box; padding: 5px;">
        <button id="addIpButton" style="width: 100%; margin-top: 5px; padding: 5px; background-color: green; color: white; border: none; border-radius: 5px; cursor: pointer;">追加</button>
        <ul id="ipList" style="list-style: none; padding: 0; margin: 0;"></ul>
    `;
    ipManagementDiv.style.position = "absolute";
    ipManagementDiv.style.left = localStorage.getItem('ipManagementLeft') || "10px";
    ipManagementDiv.style.top = localStorage.getItem('ipManagementTop') || "60px";
    ipManagementDiv.style.zIndex = "1001";
    ipManagementDiv.style.backgroundColor = "#f0f0f0";
    ipManagementDiv.style.padding = "15px";
    ipManagementDiv.style.border = "1px solid #ccc";
    ipManagementDiv.style.borderRadius = "5px";

    // ドラッグ機能を追加
    let isDragging = false;
    let isResizing = false;
    let offsetX, offsetY;

    function startDragging(e, element) {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        document.addEventListener('mousemove', moveElement);
        document.addEventListener('mouseup', stopDragging);
    }

    function moveElement(e) {
        if (isDragging) {
            const element = e.target.closest('.draggable');
            if (element) {
                element.style.left = (e.clientX - offsetX) + 'px';
                element.style.top = (e.clientY - offsetY) + 'px';
                localStorage.setItem('buttonLeft', button.style.left);
                localStorage.setItem('buttonTop', button.style.top);
                localStorage.setItem('ipManagementLeft', ipManagementDiv.style.left);
                localStorage.setItem('ipManagementTop', ipManagementDiv.style.top);
                localStorage.setItem('toggleButtonLeft', toggleVisibilityButton.style.left);
                localStorage.setItem('toggleButtonTop', toggleVisibilityButton.style.top);
            }
        }
    }

    function stopDragging() {
        isDragging = false;
        document.removeEventListener('mousemove', moveElement);
        document.removeEventListener('mouseup', stopDragging);
    }

    // サイズ変更機能を追加
    function startResizing(e) {
        isResizing = true;
        document.addEventListener('mousemove', resizeElement);
        document.addEventListener('mouseup', stopResizing);
    }

    function resizeElement(e) {
        if (isResizing) {
            button.style.width = (e.clientX - button.getBoundingClientRect().left) + 'px';
            button.style.height = (e.clientY - button.getBoundingClientRect().top) + 'px';
            localStorage.setItem('buttonWidth', button.style.width);
            localStorage.setItem('buttonHeight', button.style.height);
        }
    }

    function stopResizing() {
        isResizing = false;
        document.removeEventListener('mousemove', resizeElement);
        document.removeEventListener('mouseup', stopResizing);
    }

    // ボタンとIP管理UIをドラッグ可能にするクラスを追加
    button.classList.add('draggable');
    ipManagementDiv.classList.add('draggable');
    toggleVisibilityButton.classList.add('draggable');

    button.addEventListener('mousedown', function(e) {
        if (e.target === resizeHandle) {
            startResizing(e);
        } else {
            startDragging(e, button);
        }
    });

    ipManagementDiv.addEventListener('mousedown', function(e) {
        startDragging(e, ipManagementDiv);
    });

    toggleVisibilityButton.addEventListener('mousedown', function(e) {
        startDragging(e, toggleVisibilityButton);
    });

    // UI表示・非表示ボタンのクリックイベント
    toggleVisibilityButton.addEventListener("click", function() {
        if (ipManagementDiv.style.display === "none") {
            ipManagementDiv.style.display = "block";
            toggleVisibilityButton.innerHTML = "UI非表示";
        } else {
            ipManagementDiv.style.display = "none";
            toggleVisibilityButton.innerHTML = "UI表示";
        }
    });

    // message_box_inner にボタンとIP管理用インターフェースを追加
    const messageBoxInner = document.querySelector('html body div#body div.message_box div.message_box_inner');
    if (messageBoxInner) {
        messageBoxInner.appendChild(button);
        messageBoxInner.appendChild(ipManagementDiv);
        messageBoxInner.appendChild(toggleVisibilityButton);
    } else {
        console.warn('message_box_inner element not found');
    }

    // スクリプトの初期設定
    let mainSwitch = 1;  // 初期状態をONに設定
    let allowedIp = JSON.parse(localStorage.getItem('allowedIp')) || [];
    const siteUrl = 'http://drrrkari.com';
    const botstart = new Date().getTime();

    // ボタンの初期スタイルとテキストを更新
    button.style.backgroundColor = "green";
    button.innerHTML = "ON";

    // ボタンのクリックイベント
    button.addEventListener("click", function() {
        mainSwitch = 1 - mainSwitch;
        if (mainSwitch === 1) {
            button.style.backgroundColor = "green";
            button.innerHTML = "ON";
        } else {
            button.style.backgroundColor = "#ADD8E6"; // 薄い青色
            button.innerHTML = "OFF";
        }
    });

    function log(msg) {
        console.log(msg);
    }

    function checkhelper(input) {
        // Assuming data.textProcess is defined somewhere in the real context
        if (typeof data === 'undefined' || !data.textProcess) return input;
        for (let i = 0; i < data.textProcess.input.length; i++) {
            input = input.replaceAll(data.textProcess.input[i], data.textProcess.output[i]);
        }
        return input;
    }

    // Fetch data from chat server
    let roomDataObj, talks, users;
    function getdata() {
        try {
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        const resp = xmlhttp.responseText.replaceAll('\'', '\'').replaceAll('\'', '\'');
                        roomDataObj = JSON.parse(resp);
                        talks = roomDataObj.talks;
                        users = roomDataObj.users;
                        talks[talks.length - 1].message = checkhelper(talks[talks.length - 1].message);
                    } catch (error) {
                        console.warn('Failed to parse response JSON', error);
                    }
                }
            };
            xmlhttp.open('POST', siteUrl + '/ajax.php', true);
            xmlhttp.send();
        } catch (error) {
            console.warn('Unable to fetch data from server', error);
        }
    }

    // Send HTTP request for host actions
    function kickMember(name) {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', siteUrl + '/room/', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        console.log('Kick request sent successfully for user:', name);
                    } else {
                        console.warn('Failed to kick member:', name, 'Status:', xhr.status);
                    }
                }
            };
            xhr.send('ban_user=' + encodeURIComponent(name));
        } catch (error) {
            console.warn('Failed to kick member:', name, 'Error:', error);
        }
    }

    // Check for allowed users
    function checkMembers() {
        let kkd = 0;
        if (!users) return kkd;

        for (let i = 0; i < users.length; i++) {
            let allowed = false;
            // デバッグ用ログ: ユーザーのIPアドレスを確認
            console.log('Checking user:', users[i].name, 'IP:', users[i].encip);

            // IPアドレスが取得できない場合
            if (!users[i].encip) {
                console.warn('No IP address found for user:', users[i].name);
                continue;
            }

            for (let j = 0; j < allowedIp.length; j++) {
                try {
                    if (users[i].encip.includes(allowedIp[j])) {
                        allowed = true;
                        break;
                    }
                } catch (e) {
                    console.warn('Error checking IP for user:', users[i].name, 'Error:', e);
                    break;
                }
            }

            // IPが許可されていない場合はキック
            if (!allowed) {
                try {
                    console.log('Attempting to kick user:', users[i].name);
                    kickMember(users[i].id);
                    log(users[i].name + ' is kicked\nreason: unregistered IP');
                    kkd = 1;
                } catch (e) {
                    console.warn('Error kicking user:', users[i].name, 'Error:', e);
                    break;
                }
            }
        }
        return kkd;
    }

    // IPリストの表示を更新
    function updateIpList() {
        const ipList = document.getElementById('ipList');
        ipList.innerHTML = '';
        allowedIp.forEach((ip) => {
            const li = document.createElement('li');
            li.style.display = "flex";
            li.style.alignItems = "center";
            li.style.justifyContent = "space-between";
            li.style.marginBottom = "5px";
            li.textContent = ip;
            const removeButton = document.createElement('button');
            removeButton.textContent = '削除';
            removeButton.style.marginLeft = "10px";
            removeButton.addEventListener('click', function() {
                allowedIp = allowedIp.filter(item => item !== ip);
                localStorage.setItem('allowedIp', JSON.stringify(allowedIp));
                updateIpList();
            });
            li.appendChild(removeButton);
            ipList.appendChild(li);
        });
    }

    // IPアドレスを追加
    document.getElementById('addIpButton').addEventListener('click', function() {
        const ipInput = document.getElementById('ipInput');
        const newIp = ipInput.value.trim();
        if (newIp && !allowedIp.includes(newIp)) {
            allowedIp.push(newIp);
            localStorage.setItem('allowedIp', JSON.stringify(allowedIp));
            ipInput.value = '';
            updateIpList();
        } else if (allowedIp.includes(newIp)) {
            alert('このIPアドレスは既にリストに存在します。');
        } else {
            alert('IPアドレスを入力してください。');
        }
    });

    // 初期状態でIPリストを更新
    updateIpList();

    function main() {
        setTimeout(main, 300);
        getdata();

        if (mainSwitch == 1) {
            // 常にチェックを行う
            checkMembers();
        }
    }

    // 初期状態でUIを非表示にする
    ipManagementDiv.style.display = "none";
    toggleVisibilityButton.innerHTML = "UI表示";

    main();
})();
