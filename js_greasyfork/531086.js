// ==UserScript==
// @name         银河奶牛放置-Fishpi增强
// @namespace    https://github.com/HereIsYui
// @version      0.0.6
// @description  现在，你可以在挤奶的时候在鱼排聊天聊！
// @author       Yui
// @match        https://www.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531086/%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%E6%94%BE%E7%BD%AE-Fishpi%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/531086/%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%E6%94%BE%E7%BD%AE-Fishpi%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var tabMenu;
    var chatContent;
    var preSendBtn;
    var fishpiSendBtn;
    var preInput;
    var fishpiInput;
    var isFishpiPage = false;
    var fishpiWs;
    var fishpiUserInfo;
    var userLiveness = GM_getValue('liveness', '0');
    // 请填写你的鱼排 ApiKey
    var fishpiApiKey = GM_getValue('apiKey', '');
    addFishpiTab();
    GM_addStyle('.fishpi-content p{margin:0} .fishpi-content img{max-width:144px;max-height:144px;object-fit:contain}')
    // 添加鱼排聊天室tab
    function addFishpiTab() {
        log('尝试加载Tab...');
        tabMenu = document.querySelector('.GamePage_chatPanel__mVaVt .MuiTabs-flexContainer');
        chatContent = document.querySelector('.Chat_tabsComponentContainer__3ZoKe .TabsComponent_tabPanelsContainer__26mzo');
        if (!tabMenu) {
            setTimeout(() => {
                addFishpiTab();
            }, 500);
            return;
        }
        log('加载Tab列表成功');
        let fishpiTab = document.createElement('button');
        fishpiTab.innerHTML = '<span class="MuiBadge-root TabsComponent_badge__1Du26 css-1rzb3uu">鱼排<span class="MuiBadge-badge MuiBadge-standard MuiBadge-invisible MuiBadge-anchorOriginTopRight MuiBadge-anchorOriginTopRightRectangular MuiBadge-overlapRectangular MuiBadge-colorInfo css-193k565 fishpi-chat-count">0</span></span><span class="MuiTouchRipple-root css-w0pj6f"></span>';
        fishpiTab.classList.add('MuiButtonBase-root', 'MuiTab-root', 'MuiTab-textColorPrimary', 'css-1q2h7u5', 'fishpi-tab');
        fishpiTab.addEventListener('click', () => {
            changeMenuTabToFish();
        })
        let list = tabMenu.children;
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            item.addEventListener('click', () => {
                changeMenuTabToOther();
                chatContent.children[i].classList.remove('TabPanel_hidden__26UM3');
            })
        }
        // 添加鱼排频道
        let fishpiContent = document.createElement('div');
        fishpiContent.innerHTML = '<div class="Chat_chatChannel__gQ-21"><div class="ChatHistory_chatHistory__1EiG3"></div></div>';
        fishpiContent.classList.add('TabPanel_tabPanel__tXMJF', 'TabPanel_hidden__26UM3', 'fishpi-content');
        tabMenu.appendChild(fishpiTab);
        chatContent.appendChild(fishpiContent);
        window.tabMenu = tabMenu;
        window.fishpiContent = fishpiContent;
        // 添加鱼排专用发送按钮
        preSendBtn = document.querySelector('.Chat_chat__3DQkj .Button_button__1Fe9z.Button_fullWidth__17pVU');
        fishpiSendBtn = document.createElement('button');
        fishpiSendBtn.classList.add('Button_button__1Fe9z', 'Button_fullWidth__17pVU', 'fishpi_send_btn');
        fishpiSendBtn.innerHTML = "发送2";
        fishpiSendBtn.addEventListener('click', () => {
            fishpiSendMsg();
        })
        let btnBox = document.querySelector('.Chat_buttonContainer__1rw8b');
        fishpiSendBtn.style.display = 'none';
        btnBox.appendChild(fishpiSendBtn);
        // 添加鱼排专用输入框
        preInput = document.querySelector('.Chat_chatInput__16dhX');
        fishpiInput = document.createElement('input');
        fishpiInput.classList.add('Chat_chatInput__16dhX', 'fishpi_input');
        fishpiInput.setAttribute('placeholder', '请输入消息...');
        fishpiInput.style.display = 'none';
        btnBox.parentElement.insertBefore(fishpiInput, btnBox);
        log('鱼排注入成功');
        if (fishpiApiKey != "") {
            initFishpiWS();
            getFishpiUserInfo();
        } else {
            addTips('还没有登陆 请输入 /login 你的apiKey');
        }
        window.addEventListener(
            "keydown",
            function (event) {
                if (event.key === "Enter" && isFishpiPage) {
                    // 阻止默认行为
                    event.preventDefault();
                    // 阻止事件冒泡
                    event.stopPropagation();
                    fishpiSendMsg()
                }
            },
            true,
        );
    };


    // 切换到fishpi聊天室
    function changeMenuTabToFish() {
        let list = tabMenu.children;
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            let contentItem = chatContent.children[i];
            item.classList.remove('Mui-selected');
            contentItem.classList.remove('TabPanel_hidden__26UM3');
            contentItem.classList.add('TabPanel_hidden__26UM3');
            if (item.innerHTML.indexOf('鱼排') > 0) {
                item.classList.add('Mui-selected')
                contentItem.classList.remove('TabPanel_hidden__26UM3');
            }
        }
        fishpiSendBtn.style.display = 'block';
        fishpiInput.style.display = 'block';
        preSendBtn.style.display = 'none';
        preInput.style.display = 'none';
        isFishpiPage = true;
        let count = document.querySelector('.fishpi-chat-count');
        count.classList.add('MuiBadge-invisible');
        count.innerHTML = 0;
        autoScrollToBottom(fishpiContent);
    }

    function changeMenuTabToOther() {
        let fishpiTab = document.querySelector('.fishpi-tab');
        if (fishpiTab) {
            fishpiTab.classList.remove('Mui-selected');
        }
        let fishpiContent = document.querySelector('.fishpi-content');
        if (fishpiContent) {
            fishpiContent.classList.add('TabPanel_hidden__26UM3');
        }

        fishpiSendBtn.style.display = 'none';
        fishpiInput.style.display = 'none';
        preSendBtn.style.display = 'block';
        preInput.style.display = 'block';
        isFishpiPage = false;
    }

    // 打印日志
    function log(text) {
        console.log(`%c[Fishpi] %c${text}`, 'color:#e59230;font-weight:bold;', 'color:#333;');
    }

    function autoScrollToBottom(element) {
        // 检查是否已经接近底部（避免不必要的滚动）
        element.scrollTop = element.scrollHeight;
    }


    /**
     * 以下是鱼排api
     */
    function getFishpiApikey(nameOrEmail, userPassword, mfaCode) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://fishpi.cn/api/getKey",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify({
                nameOrEmail: nameOrEmail,
                userPassword: userPassword,
                mfaCode: mfaCode
            }),
            onload: function (res) {
                log(res);
            },
            onerror: function (error) {
                log(error);
            },
            ontimeout: function () {
                log("请求超时");
            }
        });
    }

    function initFishpiWS() {
        fishpiWs = new WebSocket("wss://rhyus-wuan.fishpi.cn:10834?apiKey=" + fishpiApiKey);
        fishpiWs.onopen = function () {
            log("fishpi连接成功");

        };
        fishpiWs.onmessage = function (event) {
            let message = JSON.parse(event.data);
            if (message.type == "msg") {
                log(message.content)
                let msgObj = document.createElement('div');
                msgObj.innerHTML = `<span class="ChatMessage_timestamp__1iRZO">[${message.time}] </span><span style="display: inline-block;"><span><span><span class="ChatMessage_name__1W9tB ChatMessage_clickable__58ej2"><div class="CharacterName_characterName__2FqyZ" translate="no"><div class="CharacterName_name__1amXp" data-name="Kingofntr"><span>${message.userNickname != "" ? message.userNickname : message.userName}</span></div><div class="CharacterName_gameMode__2Pvw8"></div></div></span><span>: </span></span></span></span><span>${message.content}</span>`;
                msgObj.classList.add('ChatMessage_chatMessage__2wev4');
                msgObj.style = 'display:flex;align-items:flex-start;';
                let fishpiContent = document.querySelector('.fishpi-content .ChatHistory_chatHistory__1EiG3');
                let fishpiChatContent = document.querySelector('.fishpi-content .ChatHistory_chatHistory__1EiG3');
                fishpiChatContent.appendChild(msgObj);
                autoScrollToBottom(fishpiContent);
                // 只保留最新的100条消息
                const childCount = fishpiChatContent.childElementCount;
                if (childCount > 100) {
                    fishpiChatContent.removeChild(fishpiChatContent.firstElementChild);
                }
                // 如果不是鱼排页面，显示未读消息
                if (!isFishpiPage) {
                    let count = document.querySelector('.fishpi-chat-count');
                    count.classList.remove('MuiBadge-invisible');
                    count.innerHTML = parseInt(count.innerHTML) + 1;
                    if (parseInt(count.innerHTML) > 99) {
                        count.innerHTML = '99';
                    }
                }
            }
        };
    }

    function fishpiSendMsg() {
        let inputObj = document.querySelector('.fishpi_input');
        let msg = inputObj.value;
        if (msg.indexOf('/login') == 0) {
            let token = msg.split(' ')[1];
            if (token && token != "") {
                GM_setValue('apiKey', token);
                fishpiApiKey = token;
                initFishpiWS();
                inputObj.value = "";
                addTips('应该登陆成功了 可以使用 /logout 退出登陆');
                return;
            }
            return;
        }
        if (msg.indexOf('/logout') == 0) {
            GM_deleteValue('apiKey');
            addTips('应该退出成功了');
            fishpiWs.close();
            inputObj.value = "";
            fishpiApiKey = "";
            return;
        }
        if (fishpiApiKey == "") {
            msg = "";
            addTips('还没有登陆 请输入 /login 你的apiKey');
            return;
        }
        if (msg != "") {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://fishpi.cn/chat-room/send",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    content: msg,
                    apiKey: fishpiApiKey,
                    client: 'IceNet/milk小分队',
                }),
                onload: function (res) {
                    inputObj.value = "";
                    console.log(res)
                },
                onerror: function (error) {
                    console.log(error);
                },
            })
        }
        inputObj.value = "";
    }

    function addTips(tips) {
        let msgObj = document.createElement('div');
        msgObj.innerHTML = `<span class="ChatMessage_timestamp__1iRZO">[${new Date().toLocaleString()}] </span><span style="display: inline-block;"><span><span><span class="ChatMessage_name__1W9tB ChatMessage_clickable__58ej2"><div class="CharacterName_characterName__2FqyZ" translate="no"><div class="CharacterName_name__1amXp" data-name="Kingofntr"><span>YuiNet</span></div><div class="CharacterName_gameMode__2Pvw8"></div></div></span><span>: </span></span></span></span><span style="color:red;font-widget:bold">${tips}</span>`;
        msgObj.classList.add('ChatMessage_chatMessage__2wev4');
        msgObj.style = 'display:flex;align-items:center;';
        let fishpiContent = document.querySelector('.fishpi-content .ChatHistory_chatHistory__1EiG3');
        let fishpiChatContent = document.querySelector('.fishpi-content .ChatHistory_chatHistory__1EiG3');
        fishpiChatContent.appendChild(msgObj);
        autoScrollToBottom(fishpiContent);
    }

    function getFishpiUserInfo() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://fishpi.cn/api/user?apiKey=" + fishpiApiKey,
            headers: {
                "Content-Type": "application/json",
            },
            responseType: "json",
            onload: function (res) {
                if (res.response.code == 0) {
                    fishpiUserInfo = res.response.data;
                    setUserInfoToUI();
                    getFishpiUserLiveness();
                }
            },
            onerror: function (error) {
                console.log(error);
            },
        })
    }

    function setUserInfoToUI() {
        // 将个人信息同步到奶牛
        let avatarObj = document.querySelector('.Header_avatar__2RQgo');
        avatarObj.innerHTML = `<img src="${fishpiUserInfo.userAvatarURL}" style="width:100%;height:100%" alt="">`
        let nicknameObj = document.querySelector('.CharacterName_name__1amXp');
        nicknameObj.innerHTML = `<span>${fishpiUserInfo.userNickname == "" ? fishpiUserInfo.userName : fishpiUserInfo.userNickname}</span>`;
        let infoObj = document.querySelector('.Header_info__26fkk');
        let livenessObj = document.createElement('div');
        livenessObj.innerHTML = `当前活跃: ${userLiveness}`;
        livenessObj.style = "font-size: 13px; font-weight: 500; color: #e59230;";
        livenessObj.classList.add('fishpi-liveness')
        infoObj.appendChild(livenessObj);
    }

    function getFishpiUserLiveness() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://fishpi.cn/user/liveness?apiKey=" + fishpiApiKey,
            headers: {
                "Content-Type": "application/json",
            },
            responseType: "json",
            onload: function (res) {
                console.log(res.response.liveness);
                userLiveness = res.response.liveness;
                GM_setValue('userLiveness', userLiveness);
                document.querySelector('.fishpi-liveness').innerHTML = `当前活跃: ${userLiveness}`;
                setTimeout(() => {
                    getFishpiUserLiveness();
                }, 1000 * 60 * 5);
            },
            onerror: function (error) {
                console.log(error);
            },
        })
    }
})();