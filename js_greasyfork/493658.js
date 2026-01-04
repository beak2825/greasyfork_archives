// ==UserScript==
// @name         宠物语翻译器2.0（点按钮翻译）
// @namespace    http://tampermonkey.net/
// @version      2024-04-30_7
// @description  把人语翻译成宠物语
// @author       maso

// @include      /^https:\/\/(www\.)?bondageprojects\.elementfx\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @include      /^https:\/\/(www\.)?bondage-europe\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @match        https://nsfw-games.vercel.app/puppy-lang

// @license MIT
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/493658/%E5%AE%A0%E7%89%A9%E8%AF%AD%E7%BF%BB%E8%AF%91%E5%99%A820%EF%BC%88%E7%82%B9%E6%8C%89%E9%92%AE%E7%BF%BB%E8%AF%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/493658/%E5%AE%A0%E7%89%A9%E8%AF%AD%E7%BF%BB%E8%AF%91%E5%99%A820%EF%BC%88%E7%82%B9%E6%8C%89%E9%92%AE%E7%BF%BB%E8%AF%91%EF%BC%89.meta.js
// ==/UserScript==


// 按下TAB执行翻译为宠物语 243行 event.keyCode === 9
// 按下alt执行翻译为人语 250行 event.altKey
(function() {
    'use strict';

    // 叫声
    var call = '喵';











    //////////////////////////////////用于检测聊天框的出现///////////////////////////////////////////

    // 创建 MutationObserver 实例
    let observerInputChat = new MutationObserver(function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for(let node of mutation.addedNodes) {
                    if (node.id === 'InputChat') {
                        getInputChat(node);
                        observerInputChat.disconnect(); // 停止观察
                        break;
                    }
                }
            }
        }
    });

    // 开始观察 document.body 的子节点变化
    observerInputChat.observe(document.body, { childList: true, subtree: true });
    /////////////////////////////////////////////////////////////////////////////////////////////

    // 获取聊天框
    function getInputChat(InputChat) {

        // 绿鲤鱼的宠物语翻译器
        if(window === window.top) {
            var iframe = document.createElement('iframe');
            iframe.id = 'iframeFY';
            iframe.src = 'https://nsfw-games.vercel.app/puppy-lang';
            iframe.style.width = 0;
            iframe.style.height = 0;


            //显示翻译器
            /*
            iframe.style.position = 'fixed';
            iframe.style.top = '50px';
            iframe.style.left = '50px';
            iframe.style.width = '30%';
            iframe.style.height = '50%';
            iframe.style.border = '1px solid black';
            iframe.style.backgroundColor = 'white';
            iframe.style.zIndex = '9999';
            */

            // 用这个的话左上角不会有白色小点但是翻译会有延迟
            // iframe.display = 'none';

            document.body.appendChild(iframe);
        }

        // 更新按钮和输入框位置的函数
        function updateElementPosition() {
            // 获取文本区域的位置信息
            let rect = InputChat.getBoundingClientRect();
            let rectTextArea = document.getElementById("TextAreaChatLog").getBoundingClientRect();

            // 更新翻译成人语的按钮的位置
            hmBtn.style.width = (rectTextArea.width / 16) + 'px';
            hmBtn.style.height = (rect.height / 2) + 'px';
            hmBtn.style.left = (rectTextArea.right - rectTextArea.width / 16) + 'px';
            hmBtn.style.bottom = (window.innerHeight - rectTextArea.bottom) + 'px';

            // 更新翻译成宠物语的按钮的位置
            petBtn.style.width = hmBtn.style.width;
            petBtn.style.height = hmBtn.style.height;
            petBtn.style.left = hmBtn.style.left;
            petBtn.style.top = rectTextArea.bottom - rect.height + 'px';

            // 更新输入框的位置
            inputCall.style.width = (rect.width / 30) + 'px';
            inputCall.style.height = rect.height - 5 + 'px';
            inputCall.style.left = (rectTextArea.right - rectTextArea.width / 16 - rectTextArea.width / 30) + 'px';
            inputCall.style.bottom = (window.innerHeight - rectTextArea.bottom) + 'px';
        }

        // 初始化按钮和输入框
        let petBtn = document.createElement('button');
        let hmBtn = document.createElement('button');
        let inputCall = document.createElement('input');

        // 设置按钮和输入框内容
        petBtn.innerHTML = '宠物';
        hmBtn.innerHTML = '人类';
        inputCall.value = call;

        // 设置按钮和输入框定位方式
        petBtn.style.position = 'absolute';
        hmBtn.style.position = 'absolute';
        inputCall.style.position = 'absolute';

        // 添加按钮和输入框到 body 元素
        document.body.appendChild(petBtn);
        document.body.appendChild(hmBtn);
        document.body.appendChild(inputCall);

        // 监听 window 对象的 resize 事件，在窗口大小变化时更新按钮和输入框位置
        window.addEventListener('resize', updateElementPosition);

        // 在 InputChat 元素变化时更新按钮位置
        let observerUpdate = new MutationObserver(updateElementPosition);
        observerUpdate.observe(InputChat, { attributes: true, childList: true, subtree: true });

        // 在 InputChat 元素被移除时自动删除按钮和输入框
        let observerDelete = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    // 检查是否有 InputChat 元素被移除
                    let removedNodes = Array.from(mutation.removedNodes);
                    let isInputChatRemoved = removedNodes.some(function(node) {
                        return node === InputChat;
                    });

                    // 如果移除了 InputChat 元素并且按钮不再在 InputChat 中，移除按钮和输入框
                    if (isInputChatRemoved && !document.body.contains(petBtn)) {
                        petBtn.remove();
                        hmBtn.remove();
                        inputCall.remove();
                    }
                }
            });
        });

        // 开始观察 InputChat 元素的父节点的变化
        observerDelete.observe(document.body, { childList: true, subtree: true });

        // 页面加载完成后首次更新按钮和输入框位置
        updateElementPosition();

        // 用于防止多次翻译
        let output = null;
        // 按钮绑定翻译成宠物语事件
        petBtn.addEventListener('click', function() {

            // 把父页面聊天框中的输入的人语发送给翻译器
            // output !== InputChat.value用于防止多次翻译
            if (output !== InputChat.value && InputChat.value !== null) {
                iframe.contentWindow.postMessage({
                    Msg: {
                        command: 'sendHumanText',
                        call: inputCall.value,
                        input: InputChat.value
                    }
                }, '*');
            }

            // 在父页面接收翻译完的宠物语
            window.addEventListener('message', e => {
                if (e.data.Msg.command === 'getPetText') {
                    InputChat.value = e.data.Msg.output;
                    output = e.data.Msg.output;
                }
            });

            bandBtn(petBtn);
            bandBtn(hmBtn);
        });

        // 按钮绑定翻译成人语事件
        hmBtn.addEventListener('click', function() {

            // 获取聊天室中所有消息
            let TextAreaChat = document.getElementsByClassName("ChatMessage ChatMessageChat");
            let TextArray = [];

            // 获取每一条消息中第一个 : 之后的内容
            for (let i = 0; i < TextAreaChat.length; i++) {
                let colonIndex = TextAreaChat[i].innerText.indexOf(":");
                if (colonIndex !== -1) {
                    TextArray[i] = TextAreaChat[i].innerText.slice(colonIndex + 1).trim();
                    // 确保发送给翻译器的是宠物语
                    // 宠物语本质是将输入字符用多个不可见字符（​）按照一定顺序进行编码
                    if(!TextArray[i].includes("​")) {
                        TextArray[i] = "";
                    }
                }
            }

            // 把父页面聊天框中的宠物语发送给翻译器
            iframe.contentWindow.postMessage({
                Msg: {
                    command: 'sendPetText',
                    inputArray: TextArray
                }
            }, '*');

            let outputArray = [];
            // 在父页面接收翻译完的人语
            window.addEventListener('message', e => {
                if (e.data.Msg.command === 'getHumanText') {
                    outputArray = e.data.Msg.outputArray;

                    for(let j = 0; j < TextAreaChat.length; j++) {
                        // 检查 outputArray[j] 是否有值
                        // 检查 TextAreaChat[j].innerText 是否已经包含了 outputArray[j] 的值
                        if(outputArray[j] != null && !TextAreaChat[j].innerText.includes(` (${outputArray[j]})`)) {
                            // 创建一个包含 outputArray[j] 的新文本节点
                            let newText = document.createTextNode(` (${outputArray[j]})`);

                            // 将新文本节点插入到 TextAreaChat[j] 元素的最后一个子节点之后
                            TextAreaChat[j].appendChild(newText);
                        }
                    }
                }
            });

            bandBtn(hmBtn);
            bandBtn(petBtn);

        });

        // 在文本框中按键执行
        InputChat.addEventListener('keydown', function(event) {
            // 按下TAB执行翻译为宠物语
            if (event.keyCode === 9) {
                petBtn.click();
            }
        });

        document.addEventListener('keydown', function(event) {
            // 按下alt执行翻译为人语
            if (event.altKey) {
                hmBtn.click();
            }
        });
    }
    function bandBtn(Btn){
        // 禁用按钮
        Btn.disabled = true;
        // 模拟按钮点击后一段时间后重新启用按钮
        setTimeout(() => {
            Btn.disabled = false;
        }, 1000); // 1秒后重新启用按钮
    }


    // 在子页面进行操作
    if(window != window.top) {

        // 把人话翻译成宠物语
        window.addEventListener('message', e => {
            if (e.data.Msg && e.data.Msg.command === 'sendHumanText') {

                // 点击翻译为宠物语按钮
                document.getElementById("dog").click();

                // 设定叫声
                setText(document.getElementById("calls"), e.data.Msg.call);

                // 处理收到的消息，将其放入翻译框
                setText(document.getElementById('inputText'), e.data.Msg.input);

                // 点击页面唯一的翻译按钮
                document.querySelector('button').click();

                // 等10毫秒翻译结果出来后，将翻译出的宠物语发送给父页面
                setTimeout(function() {
                    window.top.postMessage({
                        Msg: {
                            command: 'getPetText',
                            output: document.getElementById("outputText").value
                        }
                    }, '*');
                }, 10);

            }
        });

        // 把宠物语翻译成人话
        window.addEventListener('message', e => {
            if (e.data.Msg && e.data.Msg.command === 'sendPetText') {

                // 选择翻译为人语
                document.getElementById("human").click();

                let inputArray = [];
                for(let i = 0; i < e.data.Msg.inputArray.length; i++) {
                    inputArray[i] = e.data.Msg.inputArray[i];
                }

                let outputArray = [];
                for (let j = 0; j < inputArray.length ; j++) {
                    (function(index) {
                        setTimeout(function() {
                            // 处理收到的消息，将其放入翻译框
                            setText(document.getElementById('inputText'), inputArray[index]);

                            // 点击页面唯一的翻译按钮
                            document.querySelector('button').click();

                            // 在点击后等待一段时间后获取翻译结果
                            setTimeout(function() {
                                // 将翻译结果放入数组中对应的位置
                                if (document.getElementById("outputText") != null && document.getElementById('inputText').value !== "") {
                                    outputArray[index] = document.getElementById("outputText").value;
                                }else{
                                    outputArray[index] = null;
                                }
                                // 当所有翻译结果准备好时，发送消息给父页面
                                if (outputArray.length === inputArray.length) {
                                    window.top.postMessage({
                                        Msg: {
                                            command: 'getHumanText',
                                            outputArray: outputArray
                                        }
                                    }, '*');
                                }
                            }, 10);
                        }, 20 * index); // 这里可以适当增加延迟时间，以便区分每个 setTimeout 的执行
                    })(j);
                }
            }
        });

    }

    // 用于把文本输入到翻译框
    function setText(input,msg) {

        // 清空当前文本框中文本
        input.value = null;

        // 将光标移动到文本框中
        input.setSelectionRange(0,0);

        // 输入文本
        input.setRangeText(msg);

        // 创建输入事件
        let inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true
        });

        // 分派输入事件到文本框并执行
        input.dispatchEvent(inputEvent);
    }

})();