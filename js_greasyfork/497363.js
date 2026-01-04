// ==UserScript==
// @name         BGA Ark Nova Helper
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  可以自动进行BGA上方舟动物园匹配也可以随机休息或者卡牌的摆烂操作，期间会自动进行弃牌收获等操作（暂不支持需要进行行动的收获操作），当游戏进度超过50后自动投降，更新了UI添加了弃牌选项,更新了自动识别卡牌和赞助商。
// @author       HQ163
// @match        *://boardgamearena.com/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/497363/BGA%20Ark%20Nova%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/497363/BGA%20Ark%20Nova%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
    .small-button {
        padding: 5px 10px;
        font-size: 12px;
        background-color: green;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        flex: 1 1 22%; /* 每行容纳四个按钮 */
        margin: 2px; /* 控制按钮之间的间距 */
        box-sizing: border-box; /* 确保按钮尺寸包括内边距和边框 */
    }
    .small-button-confirm{
            padding: 5px 10px;
        font-size: 12px;
        background-color: green;
        border: none;
        border-radius: 3px;
        cursor: pointer;
                margin: 2px; /* 控制按钮之间的间距 */
        box-sizing: border-box; /* 确保按钮尺寸包括内边距和边框 */
    }
    .small-input {
        padding: 5px;
        font-size: 12px;
        border: 1px solid #ccc;
        border-radius: 3px;
        box-sizing: border-box; /* 确保输入框尺寸包括内边距和边框 */
        flex: 1; /* 输入框占据可用空间 */
    }
    #dynamicButtons {
        display: flex;
        flex-wrap: wrap; /* 自动换行 */
    }
`;
    document.head.appendChild(style);



    // 创建悬浮窗
    let floatingWindow = document.createElement('div');
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.bottom = '10px';
    floatingWindow.style.right = '10px';
    floatingWindow.style.zIndex = '1000';
    floatingWindow.style.backgroundColor = 'white';
    floatingWindow.style.border = '1px solid black';
    floatingWindow.style.padding = '10px';
    floatingWindow.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
    floatingWindow.style.width = '300px';
    floatingWindow.style.maxHeight = '400px';
    floatingWindow.style.overflowY = 'auto';
    floatingWindow.style.cursor = 'move';
    floatingWindow.innerHTML = `
        <div id="floatingHeader" style="cursor: move; background-color: #f0f0f0; padding: 5px; text-align: center;">
            Ark Nova Helper
        </div>
        <div id="buttonContainer" style="display: flex; justify-content: space-around; margin-top: 10px;">
            <button id="startButton" class="small-button">开始摆烂</button>
            <button id="matchButton" class="small-button">开始匹配</button>
            <button id="guaButton" class="small-button">卡弃牌挂</button>
        </div>
        <div id="inputRow" style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
        <input type="number" id="progressInput" class="small-input" min="50" max="99" placeholder="请输入游戏进度投降阈值（默认为50）" style="flex: 1; margin-right: 5px;">
        <button id="confirmButton" class="small-button-confirm" style="width: 60px; flex-shrink: 0;">确定</button>
        </div>
        <div id="dynamicButtons" style="margin-top: 10px;"></div>
        <div id="logArea" style="margin-top: 10px; max-height: 150px; overflow-y: auto; border: 1px solid black; padding: 5px; background-color: #f0f0f0;"></div>
    `;

    document.body.appendChild(floatingWindow);
    // 实现拖动功能
    dragElement(floatingWindow);

    function arraysEqualIgnoreOrder(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }

        const sortedArr1 = arr1.slice().sort();
        const sortedArr2 = arr2.slice().sort();

        for (let i = 0; i < sortedArr1.length; i++) {
            if (sortedArr1[i] !== sortedArr2[i]) {
                return false;
            }
        }

        return true;
    }

    function getcardname(inputString){
        const lines = inputString.split('\n');

        // 匹配中文字符的正则表达式
        const chineseRegex = /[\u4e00-\u9fa5]/;

        // 找到第一个包含中文字符的子字符串
        const firstChineseLine = lines.find(line => chineseRegex.test(line.trim()));
        return firstChineseLine;
    };

    function dragElement(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById('floatingHeader');
        if (header) {
            header.onmousedown = dragMouseDown;
        } else {
            element.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    let isRunning = false;
    let isMatching = false;
    let intervalId = null;
    let matchIntervalId = null;
    let playerendpercent=50;
    let clickedButtons = [];
    let textContentArray = [];
    document.getElementById('confirmButton').addEventListener('click', function() {
        const input = document.getElementById('progressInput');
        const value = input.value;
        if (value >= 50 && value <= 99) {
            console.log(`投降阈值设定为: ${value}`);
            // 在这里调用你专门的函数
            playerendpercent=value;
            // yourFunction(value);
        } else {
            alert('请输入50到99之间的数字');
        }
    });
    function extractNumberFromString(str) {
        // 使用正则表达式匹配字符串中的数字部分
        let result = str.match(/\d+/);
        if (result) {
            // 将匹配到的字符串转换为数字
            return parseInt(result[0], 10);
        } else {
            // 如果没有匹配到数字，则返回 NaN
            return NaN;
        }
    }
    function sendmessage(message){
        // 获取类别为 chatinput 的 textarea
        let chatInput = document.querySelector('textarea.chatinput');
        simulateClick(chatInput);
        if (chatInput) {
            // 设置输入框的值
            chatInput.value = message;

            // 创建一个输入事件
            let inputEvent = new Event('input', { bubbles: true });

            // 触发输入事件
            //chatInput.dispatchEvent(inputEvent);

            // 创建一个键盘事件用于按下回车键
            let keyboardEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                charCode: 13
            });

            // 触发键盘事件
            chatInput.dispatchEvent(keyboardEvent);
            console.log('已经发送摆烂通知');
        } else {
            console.log('Chat input not found.');
        }

    }
    const originalConsoleLog = console.log;
    console.log = function(message) {
        originalConsoleLog.apply(console, arguments);
        const logArea = document.getElementById('logArea');
        logArea.innerHTML += `<div>${message}</div>`;
        logArea.scrollTop = logArea.scrollHeight; // 自动滚动到最新的消息
    };


    function joinbutton(buttonNames){


        // 假设这是你的字符串数组
        //const buttonNames = ['Button 1', 'Button 2', 'Button 3', 'Button 4', 'Button 5'];

        // 已点击按钮的索引数组

        // 获取存放动态按钮的容器
        const dynamicButtonsContainer = document.getElementById('dynamicButtons');
        dynamicButtonsContainer.innerHTML = '';
        // 创建并添加按钮到容器
        buttonNames.forEach((name, index) => {
            const button = document.createElement('button');
            button.textContent = name;
            button.style.backgroundColor = 'green';
            button.classList.add('small-button'); // 应用通用样式类
            button.dataset.index = index; // 存储按钮对应的索引
            button.addEventListener('click', function() {
                const buttonIndex = parseInt(this.dataset.index, 10);
                const buttonName = this.textContent;
                if (clickedButtons.some(btn => btn.index === buttonIndex)) {
                    // 从已点击按钮数组中移除s
                    clickedButtons = clickedButtons.filter(btn => btn.index !== buttonIndex);
                    this.style.backgroundColor = 'green';
                } else {
                    // 添加到已点击按钮数组中
                    clickedButtons.push({ index: buttonIndex, name: buttonName });
                    this.style.backgroundColor = 'gray';
                }
                // 在控制台打印当前的 clickedButtons 数组
                console.log('已选择的卡片:'+clickedButtons.map(btn => `${btn.name} (${btn.index})`).join(', '));
            });
            dynamicButtonsContainer.appendChild(button);
        });
    }
    document.getElementById('startButton').addEventListener('click', function() {
        isRunning = !isRunning;
        if (isRunning) {
            this.textContent = '停止摆烂';
            startMonitoring();
        } else {
            this.textContent = '开始摆烂';
            stopMonitoring();
        }
    });


    document.getElementById('matchButton').addEventListener('click', function() {
        isMatching = !isMatching;
        if (isMatching) {
            this.textContent = '停止匹配';
            startMatching();
        } else {
            this.textContent = '开始匹配';
            stopMatching();
        }
    });
    document.getElementById('guaButton').addEventListener('click', function() {
        console.log('开始卡不弃牌bug');
        let gametext=document.getElementById('pagemaintitletext');
        let carddom=document.getElementById('floating-hand').childNodes;
        let cards=carddom[0].childNodes;
        let finalcards=carddom[1].childNodes;
        if((gametext.innerText.indexOf("你必须弃除") !== -1||gametext.innerText.indexOf("你必须选择你想保留的") !== -1)&&gametext.innerText.indexOf("终局计分卡") == -1){
            let num=extractNumberFromString(gametext.innerText);
            console.log('需要弃除或保留'+num+'张牌');
            if(clickedButtons.length==num){
                clickedButtons.map(btn=>{
                    simulateClick(cards[btn.index])
                });
                console.log('已经选择'+num+'张牌');
                let conformchoice=document.getElementById('btnConfirmChoice');
                console.log('已经确认弃除或保留'+num+'张牌');
                clickedButtons.map(btn=>{
                    simulateClick(cards[btn.index])
                });

                simulateClick(conformchoice);
                console.log('已经重新选择'+num+'张牌');

            }else{
                for(let i=0;i<num;i++){
                    simulateClick(cards[i]);
                }
                console.log('已经选择'+num+'张牌');
                let conformchoice=document.getElementById('btnConfirmChoice');
                console.log('已经确认弃除或保留'+num+'张牌');
                for(let i=0;i<num;i++){
                    simulateClick(cards[i]);
                }
                simulateClick(conformchoice);
                console.log('已经重新选择'+num+'张牌');}
        }
        if((gametext.innerText.indexOf("你必须保留") !== -1&&gametext.innerText.indexOf("终局计分卡") !== -1)){
            console.log('需要弃除一张终局计分卡');
            let cardarea=document.getElementById('floating-hand-wrapper');
            cardarea.setAttribute('data-open','scoringHand');
            simulateClick(finalcards[1]);
            console.log('已经选择一张终局计分卡');
            let conformchoice=document.getElementById('btnConfirmChoice');
            simulateClick(finalcards[1]);
            console.log('已经重新选择一张终局计分卡');
            simulateClick(conformchoice);
            console.log('已经确认弃除一张终局计分卡');

        }
    });

    setInterval(function(){
        let carddom=document.getElementById('floating-hand').childNodes;
        let cards=carddom[0].childNodes;
        // 用于存储目标文字内容的数组
        let newtextContentArray=[];
        // 遍历 domArray 并获取目标文字内容
        cards.forEach(dom => {
            // 确保 DOM 结构存在且正确
            //let dom1=dom.childNodes[0].childNodes[1].childNodes[1].childNodes[0].innerText;
            let text=getcardname(dom.innerText);
            newtextContentArray.push(text);
        });
        if(!arraysEqualIgnoreOrder(newtextContentArray,textContentArray)){
            console.log(newtextContentArray);
            textContentArray=newtextContentArray;
            joinbutton(textContentArray);
        }else{

        }
    },5000);

    function startMonitoring() {
        console.log("开始检测");
        //sendmessage("Hello!");//发送消息测试中
        //sendmessage("欸摆烂了！I am giving up. I will keep passing my turns and will concede when the game reaches 50%.");
        intervalId = setInterval(function() {
            console.log("3s检测");
            // 检测是否轮到我的回合
            if (isMyTurn()) {
                // 执行休息行动
                performRestAction();
            }
        }, 3000); // 每3秒检测一次
    }

    function stopMonitoring() {
        clearInterval(intervalId);
    }


    function startMatching() {
        console.log("开始匹配");
        matchIntervalId = setInterval(function() {
            let startButton = document.getElementsByClassName('bgabutton bgabutton_blue bga-button-inner flex-1 truncate svelte-eirkpo bgabutton_huge'); // 假设“开始”按钮的ID为 startGameButton
            if (startButton.length) {
                simulateClick(startButton[0]);
                console.log('已点击开始匹配');
            }
            let querenButton = document.getElementsByClassName('bgabutton bgabutton_always_big bgabutton_blue'); // 假设“开始”按钮的ID为 startGameButton
            if (querenButton.length) {
                simulateClick(querenButton[0]);
                console.log('已确认游戏开始');
            }

        }, 3000); // 每3秒检测一次
    }

    function stopMatching() {
        let stpobutton=document.getElementsByClassName('bgabutton bgabutton_red bga-button-inner flex-1 truncate svelte-eirkpo bgabutton_huge');
        if(stpobutton.length){
            simulateClick(stpobutton[0]);
            console.log('已点击取消匹配');
        }
        clearInterval(matchIntervalId);
    }
    function isMyTurn() {
        // 这里假设游戏界面上存在一个特定元素或标识符来表示轮到玩家的回合
        // 你需要根据实际情况修改选择器
        return 1;
    }

    function performRestAction() {
        // 选择赞助商卡牌
        let gamepercent=Number(document.getElementById('pr_gameprogression').innerText);
        let dianle=document.getElementById('ingame_menu_concede');
        let sponsorCard = false;
        let drawcaard=false;
        // 获取id为customActions的元素
        const customActionsElement = document.getElementById('customActions');

        // 查找customActionsElement的所有子元素A
        const childElementsA = customActionsElement.querySelectorAll('a');

        // 遍历每个子元素A
        childElementsA.forEach(childA => {
            // 查找每个子元素A的子元素B中含有class为arknova-icon icon-action-sponsors的元素
            const sponsorIcons = childA.querySelectorAll('.icon-container.icon-container-action-sponsors');
            const cardIcons = childA.querySelectorAll('.icon-container.icon-container-action-cards');
            // 如果找到符合条件的元素，执行操作
            if (sponsorIcons.length > 0) {
                // 在这里可以对找到的元素进行操作
                sponsorCard=childA;
            }
            if(cardIcons.length>0){
                drawcaard=childA;
            }
        });




        let restButton = document.getElementById('btnPickMoney');
        let confirmButton = document.getElementById('btnConfirmTurn');
        let getallCard=document.getElementById('btnAnytimeAction0');
        let btchoice=document.getElementById('btnChoice0');
        let conformchoice=document.getElementById('btnConfirmChoice');
        let drawallcard=document.getElementById('btnDrawAllFromDeck');
        let allbluebutton=document.getElementsByClassName('bgabutton bgabutton_blue');
        let allgrewbutton=document.getElementsByClassName('action-button bgabutton bgabutton_gray withbonus');
        let btnPassAction=document.getElementById('btnPassAction');
        let drawonfirm=false;
        let pickup=false
        let pickupbutton=false;
        for(let k=0;k<allbluebutton.length;k++){
            if(allbluebutton[k].innerText.indexOf("确认") !== -1){
                drawonfirm=allbluebutton[k];
            }
        };
        for(let k=0;k<allgrewbutton.length;k++){
            if(allgrewbutton[k].innerText.indexOf("精选至多") !== -1){
                pickupbutton=allgrewbutton[k];
            }
        }
        //let finalcards=document.getElementsByClassName('ark-card zoo-card scoring-card tooltipable selectable');
        let gametext=document.getElementById('pagemaintitletext');
        let carddom=document.getElementById('floating-hand').childNodes;
        let cards=carddom[0].childNodes;
        let finalcards=carddom[1].childNodes
        if(gametext.innerText.indexOf("游戏结束") !== -1&&gametext.innerText.indexOf("触发游戏结束") == -1){
            let endbutton=document.getElementById('startButton');
            simulateClick(endbutton);
            console.log('游戏结束！停止摆烂！')
            return;
        }
        if(gamepercent>playerendpercent&&!drawonfirm){
            simulateClick(dianle);
            console.log('游戏进度超过50%，点了！')
        }
        if((gametext.innerText.indexOf("你必须弃除") !== -1||gametext.innerText.indexOf("你必须选择你想保留的") !== -1)&&!conformchoice&&gametext.innerText.indexOf("终局计分卡") == -1){
            let num=extractNumberFromString(gametext.innerText);
            console.log('需要弃除或保留'+num+'张牌');
            for(let i=0;i<num;i++){
                simulateClick(cards[i]);
            }
            console.log('已经选择'+num+'张牌');
            simulateClick(conformchoice);
            console.log('已经确认弃除或保留'+num+'张牌');
        }
        if((gametext.innerText.indexOf("你必须弃除") !== -1&&gametext.innerText.indexOf("终局计分卡") !== -1)&&!conformchoice){
            console.log('需要弃除一张终局计分卡');
            let cardarea=document.getElementById('floating-hand-wrapper');
            cardarea.setAttribute('data-open','scoringHand');
            simulateClick(finalcards[0]);
            console.log('已经选择一张终局计分卡');
            simulateClick(conformchoice);
            console.log('已经确认弃除一张终局计分卡');
        }
        if(gametext.innerText.indexOf("可以精选一张卡牌（剩余1次） (地图奖励格)") !== -1){
            console.log('正在精选卡牌');
            let cardarea=document.getElementById('pool-6');
            let pickcard=cardarea.childNodes[0];
            simulateClick(pickcard);
            for(let k=0;k<allbluebutton.length;k++){
                if(allbluebutton[k].innerText.indexOf("精选") !== -1){
                    pickup=allbluebutton[k];
                }
            }
            if(pickup){
                console.log("找到精选按钮")
            }
            simulateClick(pickup);
            console.log("已经完成对第六张卡牌的精选")
        }
        if(drawcaard&&sponsorCard){
            let mathrandom=Math.random();
            console.log(mathrandom);
            if(mathrandom>0.5){
                console.log("找到抽牌卡牌");
                simulateClick(drawcaard);
            }else{
                console.log("找到赞助商卡牌");
                let plus=document.getElementById('xtoken-modifier-plus');
                for(let j=0;j<5;j++){
                    simulateClick(plus);
                }
                simulateClick(sponsorCard);
            }
        }
        if(drawcaard&&!sponsorCard){
            console.log("找到抽牌卡牌");
            simulateClick(drawcaard);
        }
        if (sponsorCard&&!drawcaard) {
            console.log("找到赞助商卡牌");
            let plus=document.getElementById('xtoken-modifier-plus');
            for(let j=0;j<5;j++){
                simulateClick(plus);
            }
            simulateClick(sponsorCard);
        }
        else if( restButton ){
            console.log("找到休息卡牌");
            simulateClick(restButton);
        }
        else if( confirmButton ){
            console.log("找到确定卡牌");
            simulateClick(confirmButton);
        }
        else if( getallCard ){
            console.log("找到收获所有卡牌");
            simulateClick(getallCard);
        }
        else if( btchoice ){
            console.log("找到收获第一个选择卡牌");
            simulateClick(btchoice);
        }
        else if( conformchoice ){
            console.log("找到选择确认卡牌");
            simulateClick(conformchoice);
        }
        else if( drawonfirm ){
            console.log("找到确认抽取卡牌");
            simulateClick(drawonfirm);
        }
        else if( drawallcard &&!drawonfirm){
            console.log("找到抽取所有卡牌");
            simulateClick(drawallcard);
        }
        else if(btnPassAction){
            console.log("找到抽取跳过按钮");
            simulateClick(btnPassAction);
        }
        else if(pickupbutton){
            console.log("选择精选按钮");
            simulateClick(pickupbutton);
        }
        pickupbutton=false;
        pickup=false;
        drawonfirm=false;
    }

    function simulateClick(element) {
        let event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    }
})();
