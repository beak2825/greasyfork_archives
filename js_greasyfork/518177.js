// ==UserScript==
// @name          YouTuBe LIVE lottery
// @namespace     https://space.bilibili.com/50001745
// @version       0.0.11
// @description  For AK
// @author       fwz233
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @match        *://*.youtube.com/*
// @grant        GM_addElement
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518177/YouTuBe%20LIVE%20lottery.user.js
// @updateURL https://update.greasyfork.org/scripts/518177/YouTuBe%20LIVE%20lottery.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // 全局变量，用于存储倒计时状态
    let countdownInterval = null;
    let remainingTime = 0;
    let countdownActive = false;


    // 定义一个函数，用于创建并插入按钮
    function insertLotteryButton() {
        // 检查按钮是否已经存在，避免重复添加
        if (document.getElementById('lottery-button')) {
            //console.log('按钮已存在。');
            
        }else{
        var targetButton = document.querySelector('yt-dropdown-menu.style-scope.yt-sort-filter-sub-menu-renderer.has-items');
        if (targetButton) {


            // 创建新的“抽奖”按钮
            var newButton = document.createElement('button');
            newButton.textContent = countdownActive ? '倒计时 ' + remainingTime + ' 秒' : '抽奖';
            newButton.id = 'lottery-button'; // 给按钮添加ID，便于样式控制

            // 设置按钮的初始样式
            newButton.style.marginLeft = '10px'; // 调整按钮间距
            newButton.style.border = 'none'; // 去除边框
            newButton.style.background = 'none'; // 去除背景
            newButton.style.padding = '0'; // 去除内边距
            newButton.style.cursor = 'pointer'; // 鼠标悬停时显示手型指针
            newButton.style.color = 'inherit'; // 继承父元素的字体颜色
            newButton.style.fontSize = 'inherit'; // 继承字体大小

            // 添加点击事件监听器
            newButton.addEventListener('click', function() {
                if (countdownActive) {
                    // 倒计时进行中，弹出终止对话框
                    showTerminateDialog();
                } else {
                    // 未在倒计时，显示自定义对话框
                    showCustomDialog();
                }
            });

            // 将新按钮插入到目标按钮的右侧
            targetButton.parentNode.insertBefore(newButton, targetButton.nextSibling);
                    // 查找目标按钮（根据aria-label属性）



        }
        }

        if (document.querySelector('.lottery-button-info')) {
            //console.log('按钮已存在。');
            
        }else{
            //More options
        var targetButton1 = document.querySelector('.style-scope yt-live-chat-header-renderer');
        if (targetButton1) {
        var newMessage = document.createElement('yt-live-chat-text-message-renderer');
        newMessage.className = 'lottery-button-info';

        // 创建一个新的 div 容器
        var containerDiv = document.createElement('div');
        containerDiv.style.display = 'inline-block'; // 设置样式，根据需要调整
        containerDiv.style.marginLeft = '10px'; // 设置左边距，根据需要调整

        // 将 newMessage 放入 div 容器中
        containerDiv.appendChild(newMessage);

        // 将 div 容器插入到目标按钮的右边
        targetButton1.parentNode.insertBefore(containerDiv, targetButton1.nextSibling);

        // 调用系统消息函数
        addSystemMessage('', '', '');
        }
        }
        

    }

    // 创建并显示自定义对话框
    function showCustomDialog() {
        // 创建遮罩层
        var overlay = document.createElement('div');
        overlay.id = 'custom-dialog-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9999';

        // 创建对话框容器
        var dialog = document.createElement('div');
        dialog.id = 'custom-dialog';
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = '#fff';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        dialog.style.zIndex = '10000';
        dialog.style.maxWidth = '300px';
        dialog.style.width = '80%';

        // 创建第一个选项：会员类型
        var memberLabel = document.createElement('label');
        memberLabel.textContent = '选择会员类型：';
        memberLabel.style.display = 'block';
        memberLabel.style.marginBottom = '5px';

        var memberSelect = document.createElement('select');
        var optionAll = document.createElement('option');
        optionAll.value = 'all';
        optionAll.textContent = '所有会员';

        var optionPremium = document.createElement('option');
        optionPremium.value = 'premium';
        optionPremium.textContent = '仅完全体会员';

        memberSelect.appendChild(optionAll);
        memberSelect.appendChild(optionPremium);
        memberSelect.style.width = '100%';
        memberSelect.style.marginBottom = '15px';

        // 创建第二个选项：时间
        var timeLabel = document.createElement('label');
        timeLabel.textContent = '选择时间：';
        timeLabel.style.display = 'block';
        timeLabel.style.marginBottom = '5px';

        var timeSelect = document.createElement('select');
        var option1Min = document.createElement('option');
        option1Min.value = '1';
        option1Min.textContent = '1分钟';

        // var option5Min = document.createElement('option');
        // option5Min.value = '5';
        // option5Min.textContent = '5分钟';

        var optionCustom = document.createElement('option');
        optionCustom.value = 'custom';
        optionCustom.textContent = '自定义（秒）';

        timeSelect.appendChild(option1Min);
        // timeSelect.appendChild(option5Min);
        timeSelect.appendChild(optionCustom);
        timeSelect.style.width = '100%';
        timeSelect.style.marginBottom = '15px';

        // 创建自定义时间输入框
        var customTimeInput = document.createElement('input');
        customTimeInput.type = 'number';
        customTimeInput.placeholder = '请输入秒数';
        customTimeInput.style.width = '36%';
        customTimeInput.style.marginBottom = '15px';
        customTimeInput.style.display = 'none'; // 初始状态隐藏

        // 当选择“自定义（秒）”时，显示输入框
        timeSelect.addEventListener('change', function() {
            if (timeSelect.value === 'custom') {
                customTimeInput.style.display = 'block';
            } else {
                customTimeInput.style.display = 'none';
            }
        });

        // 创建确认和取消按钮
        var buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '20px';
        buttonContainer.style.textAlign = 'right';

        var confirmButton = document.createElement('button');
        confirmButton.textContent = '确定';
        confirmButton.style.marginRight = '10px';

        var cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';

        // 添加事件监听器
        confirmButton.addEventListener('click', function() {
            var memberType = memberSelect.value;
            var timeDuration = timeSelect.value;

            if (timeDuration === 'custom') {
                // 自定义时间（秒）
                var seconds = parseInt(customTimeInput.value, 10);
                if (isNaN(seconds) || seconds <= 0) {
                    alert('请输入有效的秒数！');
                    return;
                }
                timeDuration = seconds;
            } else {
                // 将分钟转换为秒
                timeDuration = parseInt(timeDuration, 10) * 60;
            }

            // 在这里执行您的逻辑，例如发送请求或更新页面
            var memberText = memberType === 'all' ? '所有会员' : '仅完全体会员';
            console.log('您选择了：' + memberText + '，时间：' + timeDuration + '秒');

            //getMemberMessages(timeDuration*60);

            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
            // 开始倒计时
            startCountdown(timeDuration, memberType);
        });

        cancelButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        // 组装对话框内容
        dialog.appendChild(memberLabel);
        dialog.appendChild(memberSelect);
        dialog.appendChild(timeLabel);
        dialog.appendChild(timeSelect);
        dialog.appendChild(customTimeInput);
        dialog.appendChild(buttonContainer);

        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);

        // 将遮罩层和对话框添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }
    // 显示终止倒计时的对话框
    function showTerminateDialog() {
        // 创建遮罩层
        var overlay = document.createElement('div');
        overlay.id = 'terminate-dialog-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9999';

        // 创建对话框容器
        var dialog = document.createElement('div');
        dialog.id = 'terminate-dialog';
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = '#fff';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        dialog.style.zIndex = '10000';
        dialog.style.maxWidth = '300px';
        dialog.style.width = '80%';
        dialog.style.textAlign = 'center';

        // 显示提示信息
        var messageText = document.createElement('p');
        messageText.textContent = '倒计时进行中，是否终止？';
        dialog.appendChild(messageText);

        // 创建确认和取消按钮
        var buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '20px';
        buttonContainer.style.textAlign = 'center';

        var confirmButton = document.createElement('button');
        confirmButton.textContent = '终止';
        confirmButton.style.marginRight = '10px';

        var cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';

        // 添加事件监听器
        confirmButton.addEventListener('click', function() {
            // 终止倒计时
            clearInterval(countdownInterval);
            countdownActive = false;
            remainingTime = 0;

            // 重置按钮文本
            var button = document.getElementById('lottery-button');
            if (button) {
                button.textContent = '抽奖';
            }
            addSystemMessage('','','')

            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        cancelButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);
        dialog.appendChild(buttonContainer);

        // 将遮罩层和对话框添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }


    /**
     * 发送一条自定义的聊天消息到聊天列表。
     * @param {string} avatarUrl - 头像图片的URL。
     * @param {string} authorName - 消息发送者的名称。
     * @param {string} messageContent - 消息的内容。
     */
    function addSystemMessage(avatarUrl, authorName, messageContent) {

            var infoButton = document.querySelector('.lottery-button-info');
            
            //infoButton.style.height = '25px';

            const messageSpan = infoButton.querySelector('span#message');
                if (messageSpan) {
                    // 设置你想要的新文本内容
                    messageSpan.textContent = messageContent;
                    // 如果需要，可以在这里添加更多逻辑，例如更改样式等
                    messageSpan.style.whiteSpace = 'nowrap';
                    // 处理文本溢出，例如添加省略号
                    messageSpan.style.overflow = 'hidden';
                    messageSpan.style.textOverflow = 'ellipsis';
                    messageSpan.style.fontSize = '12px';
                   // messageSpan.style.maxWidth = '300px';
                }
            // 修改作者名称
            const authorNameSpan = infoButton.querySelector('span#author-name');
                if (authorNameSpan) {
                    // 设置你想要的新作者名称
                    authorNameSpan.textContent = authorName;
                    authorNameSpan.style.fontSize = '15px';
                    // 你可以根据需要进一步修改样式或添加其他逻辑
                }
            const imgElement = infoButton.querySelector('img#img');
                if (imgElement) {
                    // 设置你想要的新头像URL
                    imgElement.src = avatarUrl;
                    //infoButton.style.height = '20px';

                }



    }





// 计算字符串的 CRC32 值并以十六进制形式返回
function crc32(str) {
    // 预生成 CRC 表
    const crcTable = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      crcTable[i] = c;
    }
  
    let crc = 0 ^ (-1);
    for (let i = 0; i < str.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }
  
    crc = crc ^ (-1);
    // 返回十六进制字符串（也可以返回十进制，根据实际需求决定）
    return (crc >>> 0).toString(16).toUpperCase();
  }
  unsafeWindow.crc32 = crc32;
  
  // 在 showResultInChat 函数中，计算 userKey 的 CRC32
  function showResultInChat(totalMessages, totalUsers, randomUserInfo) {

      // 对 userKey 进行 CRC32 运算
      const userKeyCRC32 = crc32(randomUserInfo.avatar);
  
      // 构建中奖消息
      var resultMessage = `恭喜这个B获得本次抽奖！请在会员群中私聊@fwz233兑奖。防伪验证:`+userKeyCRC32;
  
      // 在聊天列表中添加中奖消息
      addSystemMessage(
          randomUserInfo.avatar,
          randomUserInfo.username,
          resultMessage
      );
  
      // 如果需要显示更多信息，可以取消注释以下内容
      /*
      addSystemMessage(
          'https://yt3.googleusercontent.com/TsQ7k_W0ZBiYUxilCjRfdGTXZXdyttFcUTtu7DQ25LF5SrXGyixlZLK5Z9fjroZgJBQxqoWF=s160-c-k-c0x00ffffff-no-rj',
          '233',
          `总消息数：${totalMessages}，参与人数：${totalUsers}`
      );
      */
  }
  

    // 创建并显示没有找到消息的提示（在聊天列表中）
    function showNoMessagesInChat() {
        addSystemMessage('https://yt3.googleusercontent.com/TsQ7k_W0ZBiYUxilCjRfdGTXZXdyttFcUTtu7DQ25LF5SrXGyixlZLK5Z9fjroZgJBQxqoWF=s160-c-k-c0x00ffffff-no-rj','AK‘s Tech Studio',
            '这段时间内没有会员发言');
    }


    // 创建并显示抽奖结果对话框
    function showResultDialog(totalMessages, totalUsers, randomUserInfo) {
        // 创建遮罩层
        var overlay = document.createElement('div');
        overlay.id = 'result-dialog-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9999';

        // 创建对话框容器
        var dialog = document.createElement('div');
        dialog.id = 'result-dialog';
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = '#fff';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        dialog.style.zIndex = '10000';
        dialog.style.maxWidth = '456px';
        dialog.style.width = '80%';
        dialog.style.textAlign = 'center';

        // 显示总消息数和聊天人数
        var infoText = document.createElement('p');
        infoText.textContent = `总消息数：${totalMessages}\n聊天人数：${totalUsers}`;
        infoText.style.whiteSpace = 'pre-wrap'; // 保留换行
        dialog.appendChild(infoText);

        // 显示幸运用户的头像
        var avatarImg = document.createElement('img');
        avatarImg.src = randomUserInfo.avatar;
        avatarImg.alt = randomUserInfo.username;
        avatarImg.style.width = '80px';
        avatarImg.style.height = '80px';
        avatarImg.style.borderRadius = '50%';
        avatarImg.style.marginTop = '10px';
        dialog.appendChild(avatarImg);

        const regex = /com\/([^=]+)=/;

        // 使用match方法进行匹配
        const match = randomUserInfo.avatar.match(regex);
        let userKey
        // 检查是否匹配成功，并输出结果
        if (match && match[1]) {
        console.log('提取到的字符串是:', match[1]);
        userKey=match[1]
        } else {
        console.log('未找到匹配的字符串。');
        userKey='出错了，请重新抽奖。'
        }

        // 获取当前时间并格式化为文件名
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const filename = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}.txt`;



        // 显示幸运用户的用户名
        var usernameText = document.createElement('p');
        usernameText.textContent = userKey;
        usernameText.style.fontWeight = 'bold';
        usernameText.style.marginTop = '10px';
        dialog.appendChild(usernameText);

        // 创建关闭按钮
        var closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.marginTop = '20px';

        closeButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        dialog.appendChild(closeButton);

        // 将遮罩层和对话框添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // 创建并显示没有找到消息的对话框
    function showNoMessagesDialog() {
        // 创建遮罩层
        var overlay = document.createElement('div');
        overlay.id = 'no-messages-dialog-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9999';

        // 创建对话框容器
        var dialog = document.createElement('div');
        dialog.id = 'no-messages-dialog';
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = '#fff';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        dialog.style.zIndex = '10000';
        dialog.style.maxWidth = '300px';
        dialog.style.width = '80%';
        dialog.style.textAlign = 'center';

        // 显示提示信息
        var messageText = document.createElement('p');
        messageText.textContent = '在指定的时间范围内没有找到会员消息。';
        dialog.appendChild(messageText);

        // 创建关闭按钮
        var closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.marginTop = '20px';

        closeButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        dialog.appendChild(closeButton);

        // 将遮罩层和对话框添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }


    // 开始倒计时函数
function startCountdown(duration, memberType) {
    var button = document.getElementById('lottery-button');

    if (!button) return;

    remainingTime = duration;
    countdownActive = true;

    let processedMessages = new Set(); // 存储已处理过的消息=====================================================================

    // 更新按钮文本
    button.textContent = '倒计时 ' + remainingTime + ' 秒';

    // 在聊天列表中添加“抽奖开始”消息
    addSystemMessage('https://yt3.googleusercontent.com/TsQ7k_W0ZBiYUxilCjRfdGTXZXdyttFcUTtu7DQ25LF5SrXGyixlZLK5Z9fjroZgJBQxqoWF=s160-c-k-c0x00ffffff-no-rj','AK‘s Tech Studio',
        '🎉 抽奖开始！会员朋友们在接下来的 ' + duration + ' 秒内发送消息即可参与抽奖。');

    const idStart=getLastMessageId();// 调用函数获取最后一条消息的 ID

    // 每秒获取新增消息
    countdownInterval = setInterval(function() {
        button = document.getElementById('lottery-button');
        remainingTime--;

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            countdownActive = false;
            button.textContent = '抽奖';

            // 调用抽奖函数，传入所有新增消息
            getMemberMessages(processedMessages,idStart);

        } else {
            button.textContent = '倒计时 ' + remainingTime + ' 秒';

            // 每秒获取新增消息
            captureNewMessages(processedMessages,idStart);
        }
    }, 1000);
}

function getLastMessageId() {
    // 获取所有会员类型的消息
    let messages = document.querySelectorAll('yt-live-chat-text-message-renderer[author-type="member"]');

    // 检查是否有消息
    if (messages.length === 0) {
        console.log('没有消息');
        return null; // 如果没有消息，返回 null
    }

    // 获取最后一条消息
    let lastMessage = messages[messages.length - 1];

    // 获取最后一条消息的 ID
    let lastMessageId = lastMessage.getAttribute('id');

    console.log('目前最后一条消息的 ID:', lastMessageId);

    return lastMessageId;
}



// 获取新增消息函数，从指定id开始
function captureNewMessages(processedMessages, startId) {

    // moderator是管理员
//     Aiden Yu    9-45
// Member (2 months)
// Welcome to 完全体电丸!

    // 选择所有成员发的聊天消息
    let messages = document.querySelectorAll('yt-live-chat-text-message-renderer[author-type="member"]');

    let startProcessing = startId ? false : true; // 如果没有指定startId，则从头开始处理

    messages.forEach(msg => {
        let messageId = msg.getAttribute('id'); // 获取消息的唯一ID

        if (!startProcessing) {
            // 如果还没有开始处理，检查当前消息是否是startId
            if (messageId === startId) {
                startProcessing = true; // 找到startId，开始处理后续消息
            }
            return; // 跳过当前消息
        }

        if (!processedMessages.has(messageId)) {
            // 处理新增消息
            processedMessages.add(messageId);

            // 获取头像
            let avatarUrl = msg.querySelector('#author-photo #img')?.getAttribute('src');

            // 获取用户名
            let username = msg.querySelector('#author-name')?.textContent.trim();

            // 获取内容
            let content = msg.querySelector('#message')?.textContent.trim();

            // 获取会员时长
            let badge = msg.querySelector('yt-live-chat-author-badge-renderer');
            let duration = 0; // 默认会员时长为 0
            if (badge) {
                let ariaLabel = badge.getAttribute('aria-label');
                if (ariaLabel) {
                    // 从 aria-label 中解析会员时长
                    duration = parseMembershipDuration(ariaLabel);
                }
            }

            console.log(`新增消息: 用户名: ${username}, 内容: ${content}, 头像: ${avatarUrl}, 会员时长: ${duration}`);
        }
    });
}

// 抽奖函数
window.getMemberMessages = function(processedMessages) {
    let results = Array.from(processedMessages).map(msgId => {
        let msg = document.querySelector(`yt-live-chat-text-message-renderer[id="${msgId}"]`);

        if(msg){
            // 获取消息的详细信息
            let avatarUrl = msg.querySelector('#author-photo #img')?.getAttribute('src');
            let username = msg.querySelector('#author-name')?.textContent.trim();
            let content = msg.querySelector('#message')?.textContent.trim();
            let badge = msg.querySelector('yt-live-chat-author-badge-renderer');
            let duration = 0;
            if (badge) {
                let ariaLabel = badge.getAttribute('aria-label');
                if (ariaLabel) {
                    duration = parseMembershipDuration(ariaLabel);
                }
            }

            return {
                avatar: avatarUrl,
                username: username,
                content: content,
                membershipDuration: duration
            };
        }else{
            return {
                avatar: 'https://yt3.googleusercontent.com/TsQ7k_W0ZBiYUxilCjRfdGTXZXdyttFcUTtu7DQ25LF5SrXGyixlZLK5Z9fjroZgJBQxqoWF=s160-c-k-c0x00ffffff-no-rj',
                username: '内容已丢失',
                content: '内容已丢失',
                membershipDuration: 0
            };
        }
        
    });

    if (results.length === 0) {
        showNoMessagesInChat();
        return;
    }

    // 将结果组装成文本并在控制台输出
    let output = results.map(res => {
        return `头像: ${res.avatar}\n用户名: ${res.username}\n内容: ${res.content}\n会员时长: ${res.membershipDuration}\n`;
    }).join('\n');
    console.log(output);

    // 显示总消息数
    let totalMessages = results.length;

    // 获取唯一用户名列表
    let uniqueUsers = [...new Set(results.map(res => res.username))];
    let totalUsers = uniqueUsers.length;

    // 在控制台显示用户名列表
    //console.log('参与聊天的用户名：', uniqueUsers);

    // 从用户名列表中随机抽取一个用户
    let randomUser = uniqueUsers[Math.floor(Math.random() * uniqueUsers.length)];
    let randomUserInfo = results.find(res => res.username === randomUser);

    // 显示自定义对话框
    showResultDialog(totalMessages, totalUsers, randomUserInfo);
    showResultInChat(totalMessages, totalUsers, randomUserInfo);
};


    function parseMembershipDuration(ariaLabel) {
        // 处理中文和英文的会员时长
        let duration = 0;

        if (/新会员|New member/i.test(ariaLabel)) {
            duration = 0;
        } else {
            let match = ariaLabel.match(/(\d+)\s*(个月|月|years?|year|年)/i);
            if (match) {
                let number = parseInt(match[1], 10);
                let unit = match[2];
                if (/月|个月|month/i.test(unit)) {
                    duration = number;
                } else if (/年|year/i.test(unit)) {
                    duration = number * 12;
                }
            }
        }

        return duration;
    }

    // 您可以在控制台中调用该函数，并传入所需的秒数
    // 例如，要获取过去 60 秒的消息：
    // getMemberMessages(60);

    // 初次加载页面时插入按钮
    insertLotteryButton();

    // 创建一个MutationObserver来监视DOM变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 当DOM发生变化时，尝试重新插入按钮
            insertLotteryButton();
        });
    });

    // 配置MutationObserver，监听子节点的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();