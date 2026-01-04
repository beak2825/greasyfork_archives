// ==UserScript==
// @name         webgame
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  获取页面结果
// @author       Marble
// @grant        GM_info
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @include      *//*.mtt.xyz/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/516631/webgame.user.js
// @updateURL https://update.greasyfork.org/scripts/516631/webgame.meta.js
// ==/UserScript==

const Globals = {
    tourney: false,
    competition: false,
    game: false
};

const triggerSelector = '.board-mini';
const modalSelector = '.board-modal-wrap.modal-com__wrap';
const avgChipsSelector = '.bottom-item:nth-child(2) .count';
const remainingSelector = '.part-right .li-level:nth-child(2) .count';

let gameInterval = 0

let hasInitialResult = false; // 初始获取标志
let hasFinalResult = false;

// 解析平均筹码字符串为整数
function parseAverageChips(value) {
    value = value.replace(/,/g, '').trim();
    return value.endsWith('K') ? Math.floor(Number(value.slice(0, -1)) * 1000) : Math.floor(Number(value));
}

// 解析剩余人数文本为数字
function parseRemainingText(text) {
    const cleanedText = text.replace(/[^0-9/]/g, '').trim();
    const [remaining, total] = cleanedText.split('/').map(Number);
    return [remaining, total];
}

function getMatchKeyFromUrl() {
    const url = window.location.href;
    const urlObj = new URL(url);
    const matchKey = urlObj.searchParams.get("matchKey");
    return matchKey;
}

// 执行内容获取及关闭操作
function getContentAndClose() {
    const triggerElement = document.querySelector(triggerSelector);
    if (triggerElement) {
        triggerElement.click();
        setTimeout(() => {
            const modalElement = document.querySelector(modalSelector);
            if (modalElement) {
                const avgChipsElement = modalElement.querySelector(avgChipsSelector);
                if (avgChipsElement) {
                    const averageChips = parseAverageChips(avgChipsElement.textContent.trim());
                    const remainingElement = modalElement.querySelector(remainingSelector);
                    if (remainingElement) {
                        const remainingText = remainingElement.textContent.trim();
                        const [remaining, total] = parseRemainingText(remainingText);
                        const ratio = (remaining / total).toFixed(2);
                        const finalResult = Math.floor(ratio * averageChips);
                        const matchKey = getMatchKeyFromUrl();
                        console.log("最终结果:", finalResult, 'match:', matchKey);

                        document.title = `MTT:${finalResult},match:${matchKey},type:game`;
                        if (finalResult > 0) {
                            hasFinalResult = true;
                            hasInitialResult = true;
                        }
                    } else {
                        console.log("未找到 比例");
                    }
                } else {
                    console.log("未找到 平均筹码");
                }
                triggerElement.click();
            } else {
                console.log("未找到 弹出框");
            }
        }, 500);
    } else {
        console.log("未找到 .board-mini 元素");
    }
}

function clickbutton(buttonname){
    const spanText = Array.from(document.querySelectorAll('span.text'))
    .find(span => span.textContent.trim() === buttonname);

    // 如果找到该 <span> 元素，点击其父级 <button>
    if (spanText) {
        const parentButton = spanText.closest('button');
        if (parentButton) {
            console.log('clickbutton',buttonname, spanText);
            parentButton.click();
            return true;
        } else {
            console.log('未找到', spanText);
        }
    }
    return false;
}
function exittable() {
    if (clickbutton("Exit Table")) {
        return;
    }
    if (clickbutton("Okay")) {
        return;
    }
    if (clickbutton("Decide Later")) {
        return;
    }
    if (clickbutton("Check Prize Pool")) {
        return;
    }
    if (clickbutton("Back to Lobby")) {
        return;
    }

    //打开了completed的桌子 不是span.text
    const exitTableSpancompleted = Array.from(document.querySelectorAll('span'))
    .find(span => span.textContent.trim() === 'Exit Table');

    if (exitTableSpancompleted) {
        const parentButton = exitTableSpancompleted.closest('button');
        if (parentButton) {
            parentButton.click();
            console.log('completed按钮已点击：Exit Table');
        } else {
            console.log('completed未找到Exit Table1按钮');
        }
    }
}

//正常退出桌子
function exittableNormal() {
    // 点击弹出抽屉
    document.querySelector('.game-more-info__menu').click();

    // 延迟 1 秒后点击第二个元素
    setTimeout(() => {
        const game_more__conten = document.querySelectorAll('.game-more__content');
        if (game_more__conten.length > 1){
            game_more__conten[1].click()
            console.log('game_more__conten');
            // 再次延迟 1 秒，确保抽屉内容加载完成
            setTimeout(() => {
                clickbutton("Okay");
            }, 1000); // 等待 1 秒确保内容加载完成
        }
    }, 1000); // 等待 1 秒点击第二个元素
}

function checkForReEntryButton() {
    const buttons = document.querySelectorAll('button');
    const spectating = document.querySelector('.game-observing__title');

    // 遍历按钮并检查文本
    const foundReEntry = Array.from(buttons).some(button => button.textContent.includes('Re-Entry'));

    // 如果找到 "Re-Entry" 按钮或观察标题存在，则执行操作
    if (foundReEntry || spectating) {
        if (foundReEntry) {
            console.log('Re-Entry', foundReEntry);
        }
        if (spectating) {
            console.log('Spectating', spectating);
        }
        exittableNormal(); // 执行操作
    }

    //document.querySelector('.ant-notification-notice-message')
    //document.querySelector('.ant-notification-notice-close').click()
    const notice = document.querySelector('.ant-notification-notice-close');
    if (notice){
        console.log('notice-close',notice)
        notice.click()
    }

    const closeButton = document.querySelector('[class*="close-btn"]');
    if (closeButton) {
        closeButton.click(); // 点击Congratulations的关闭按钮
    }
}

// 监测 Fold/Check 状态变化
function monitorFoldCheck() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('https://sports.mtt.xyz/game')) {
        /*
        const checkFoldElement = document.querySelector('.game-operation-button__text.main.isCheckbox');
        const foldElement = Array.from(document.querySelectorAll('.game-operation-button__text.main')).find(el => el.textContent === 'Fold');

        if (!foldElement && checkFoldElement && !hasFinalResult) {
            //console.log("Fold消失且Check/Fold出现，获取结果");
            getContentAndClose();
        }

        if (foldElement) {
            hasFinalResult = false;
        } else if (!hasInitialResult && !hasFinalResult) {
            getContentAndClose();
        }
        */
        exittable()
        checkForReEntryButton()
        console.log("monitorFoldCheck");
    } else {
        if (gameInterval != 0){
            clearInterval(gameInterval);
            gameInterval = 0
        }
    }
}

// 等待 .board-mini 元素加载完毕并启动监测
function waitForElementAndStartInterval() {
    exittable()
    const triggerElement = document.querySelector(triggerSelector);
    if (triggerElement ) {
        if(gameInterval==0){
            console.log(".board-mini 元素已加载，开始监测 Fold/Check 状态");
            gameInterval = setInterval(monitorFoldCheck, 1000); // 每秒执行一次监测
        }
    } else {
        setTimeout(waitForElementAndStartInterval, 1000); // 每秒检查一次
    }
}

/////////////////////////////////////


// 帮助函数：查找包含特定文本的元素
function findElementWithText(startElement, textToFind) {
    if (startElement.textContent.includes(textToFind)) {
        return startElement;
    }

    const children = startElement.children;
    for (let i = 0; i < children.length; i++) {
        const found = findElementWithText(children[i], textToFind);
        if (found) {
            return found;
        }
    }

    return null;
}

function checkgameSlicks(){
    const gameSlicks = document.querySelectorAll('.gameSlick');

    gameSlicks.forEach((gameSlick, index) => {
        // 获取当前 gameSlick 的主标题
        const slickTop = gameSlick.querySelector('[class*="slick-top"]');
        //let mainTitle = slickTop?.querySelector('.d13_GameSlick_index_top-title')?.textContent.trim();
        const mainTitle = slickTop?.querySelector('b')?.textContent.trim();

        if (mainTitle && (mainTitle === "Mining" )) {
            //|| mainTitle === "Amateur"
            // 输出分割线和主标题
            console.log(`\n========= 比赛类别：${mainTitle || '未知'} =========`);

            // 找到 `game-cord-scroll-wrap`，并在其中找到 `game-cord-list`
            const gameCordScrollWrap = gameSlick.querySelector('.game-cord-scroll-wrap');
            const gameCordList = gameCordScrollWrap?.querySelector('.game-cord-list');

            if (gameCordList) {
                // 遍历 `game-cord-list` 中的每个项目
                let found = false
                gameCordList.querySelectorAll('.game-card-item-wrap').forEach(item => {
                    const it = item.querySelector('.game-card media-game-card');
                    const time = item.querySelector('.time')?.textContent.trim();
                    const register = item.querySelector('.register')?.textContent.trim();
                    const gameTitle = item.querySelector('.title.title-external span')?.textContent.trim(); // 获取每个比赛的标题

                    // 从 `infoRows` 的第一个 span 获取 Buy-In 信息，第二个 span 获取 Joined 信息
                    const infoRows = item.querySelectorAll('.info-row');
                    const buyIn = infoRows[1]?.querySelector('span:first-child .match-reward')?.textContent.trim();
                    const joinedText = infoRows[1]?.querySelector('span:last-child .match-reward')?.textContent.trim();

                    // 清理 Joined 文本，去除 "Joined"
                    const joined = joinedText?.replace('Joined', '').trim();

                    console.log('标题:', gameTitle, '时间:', time, '注册状态:', register, 'Buy-In条件:', buyIn, 'Joined人数:', joined);

                    // 检查时间是否以 "Join Now" 开头，并提取时间
                    if (time.startsWith("Join Now")) {
                        const timeParts = time.split(" ")[2]; // 获取时间部分，例如 "00:01:18"
                        const timeArray = timeParts.split(":").map(Number); // 转换为数字数组
                        // 计算总秒数
                        const totalSeconds = timeArray[0] * 60 * 60 + timeArray[1] * 60 + (timeArray[2] || 0);
                        if (register !== 'Registered' && totalSeconds <= 300 && !found) {
                            console.log('点击符合条件(5分钟内)的item:', gameTitle, time, joined, timeParts, timeArray, totalSeconds);
                            infoRows[0].click(); // 点击项目
                            found = true;
                            return true; // 结束当前循环
                        }
                    }

                    // 检查点击条件：`register` 不是 'Registered' 且 `time` 不是 'In Play'
                    /*if (register !== 'Registered' && time !== 'In Play' && !found) {
                        console.log('点击符合条件的item:', gameTitle, time, joined);
                        //infoRows[0].click(); // 点击项目
                        found = true
                        return true
                    }*/
                });
            }

            // 输出分割线结束
            console.log(`========= 结束：${mainTitle || '未知'} =========\n`);
        }
    });
}

function getStartTime() {
    const startTimeElement = Array.from(document.querySelectorAll('div'))
    .find(div => div.textContent.trim() === 'Start Time');

    if (startTimeElement) {
        const timeElement = startTimeElement.nextElementSibling;
        if (timeElement && timeElement.classList.contains('cyan')) {
            return timeElement.textContent.trim(); // 返回时间
        }
    }
    return null; // 如果未找到，返回 null
}

function isRegistrationTime(startTimeStr) {
    const [datePart, timePart] = startTimeStr.split(' ');
    const [month, day] = datePart.split('/').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    const now = new Date();
    const startTime = new Date(now.getFullYear(), month - 1, day, hours, minutes);

    // 注册时间为开始时间前 1 小时
    const registrationTime = new Date(startTime.getTime() - 60 * 60 * 1000);

    // 如果开始时间在当前时间之前，返回 true
    return now >= registrationTime && now < startTime; // 判断当前时间是否在注册时间范围内
}

function isFiveMinutesOfStart(startTimeStr) {
    const [datePart, timePart] = startTimeStr.split(' ');
    const [month, day] = datePart.split('/').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    const now = new Date();
    const startTime = new Date(now.getFullYear(), month - 1, day, hours, minutes);

    // 开始时间后 5分钟
    const joinTime = new Date(startTime.getTime() + 5 * 60 * 1000);

    // 判断当前时间是否是开始5分钟后，返回 true
    return now >= joinTime;
}

function getLateRegistrationTime() {
    const startDiv = document.querySelector('.start');

    if (startDiv) {
        const textContent = startDiv.textContent.trim();

        // 检查是否包含 "Late reg."
        if (textContent.startsWith("Late reg.")) {
            const timeSpan = startDiv.querySelector('span');
            const timeUnit = startDiv.querySelectorAll('span')[1].textContent.trim(); // 获取时间单位

            if (timeSpan) {
                const timeValue = parseInt(timeSpan.textContent.trim(), 10);
                let totalSeconds = 0;
                if (timeUnit === "Min(s)" && timeValue >= 1) {
                    totalSeconds = timeValue * 60; // 转换为秒
                } else if (timeUnit === "Sec(s)" && timeValue < 60) {
                    totalSeconds = timeValue; // 使用秒
                }

                return totalSeconds; // 返回总秒数
            }
        }
    }
    return 0; // 默认返回 0，如果未找到或不符合条件
}

function topay() {
    if (clickbutton("Pay")) {
        return true;
    }
}

function delayedJoin() {
    const verify = Array.from(document.querySelectorAll('span.text')).find(span => span.textContent.trim() === "Verify");
    if (verify){
        /*
        const matchKey = getMatchKeyFromUrl();
        let ul = `https://sports.mtt.xyz/game?groupKey=&matchKey=${matchKey}&matchType=2`;
        console.log('ul',ul);
        window.location.href = `https://sports.mtt.xyz/game?groupKey=&matchKey=${matchKey}&matchType=2`;
        */
        return true;
    }
    const passcode = document.querySelector('.adm-passcode-input');
    if (passcode){
        console.log('準備輸入密碼...');
        return true;
    }
    if(topay()){
        console.log('點擊Pay...');
        return true
    }
    const joinButton = document.querySelector('.regist.red');
    const registerButton = document.querySelector('.regist');
    const startTime = getStartTime();
    /*
    if (startTime && isFiveMinutesOfStart(startTime)) {
        console.log('延迟5分钟已到，正在点击Join...');
        if (joinButton) {
            joinButton.click();
            setTimeout(topay, 10000);
            return true
        } else {
            console.log('未找到 Join 按钮');
            if (!registerButton){
                //icon iconfont icon-navi-previous reminder-back 返回按钮
                const back = document.querySelector('.reminder-back');
                if (back) {
                    console.log('找到 back 按钮, 正在点击...');
                    back.click();
                }
            }
            return false
        }
    }
    else{
        console.log('延迟5分钟时间未到, 等待中...',startTime);
    }
    */
    const startDiv = document.querySelector('.start');
    const lateTimeInSeconds = getLateRegistrationTime();

    if (startDiv) {
        const textContent = startDiv.textContent.trim();

        // 检查是否包含 "Running" 或 "Completed"
        if (textContent.includes("Running") || textContent.includes("Completed")) {
            const back = document.querySelector('.reminder-back');
            if (back) {
                console.log('找到 back 按钮, 正在点击...');
                back.click();
            }
        }
        // 检查 "Late reg." 的情况
        else if (textContent.startsWith("Late reg.") && lateTimeInSeconds > 0 && lateTimeInSeconds <= 300) {
            if (joinButton) {
                joinButton.click();
                //setTimeout(topay, 10000);
                return true
            }
        }
        else {
            console.log('最後的5分钟时间未到, 等待中...',startTime);
        }
    }

}
function RegisterandJoin(){
    const registerdisable = document.querySelector('.regist.disable');
    const registerButton = document.querySelector('.regist');
    const verify = Array.from(document.querySelectorAll('span.text')).find(span => span.textContent.trim() === "Verify");
    if (verify){
        /*
        const matchKey = getMatchKeyFromUrl();
        let ul = `https://sports.mtt.xyz/game?groupKey=&matchKey=${matchKey}&matchType=2`;
        console.log('ul',ul);
        window.location.href = `https://sports.mtt.xyz/game?groupKey=&matchKey=${matchKey}&matchType=2`;
        */
        return true;
    }
    if (registerdisable) {
        const startTime = getStartTime();
        if (startTime && isRegistrationTime(startTime)) {
            console.log('注册时间已到，刷新页面...');
            window.location.href = window.location.href; // 刷新页面
        }
        else{
            console.log('找到 Register Disable,报名时间未到, 等待中...',startTime);
        }
    }
    else{
        if (registerButton) {
            console.log('找到 Register 按钮, 正在点击...');
            registerButton.click();

            // 等待 3 秒后查找并点击 Join 按钮
            setTimeout(clickJoinButton, 10000);
        } else {
            console.log('未找到 Register 按钮');
            if (!clickJoinButton()){
                //icon iconfont icon-navi-previous reminder-back 返回按钮
                const back = document.querySelector('.reminder-back');
                if (back) {
                    console.log('找到 back 按钮, 正在点击...');
                    back.click();
                }
            }
        }
    }
}

function clickJoinButton() {
    const joinButton = document.querySelector('.regist.red');
    if (joinButton) {
        console.log('找到 Join 按钮, 正在点击...');
        joinButton.click();
        return true
    } else {
        console.log('未找到 Join 按钮');
        return false
    }
}
function updateTitle() {
    const matchKey = getMatchKeyFromUrl();
    // 获取当前文档标题
    let currentTitle = document.title;

    // 检查当前标题是否为 "MTT SPORTS"
    if (currentTitle === "MTT SPORTS") {
        // 更新为 "MTT:0,match:${matchKey}"
        document.title = `MTT:0,match:${matchKey},type:game`;
    } else {
        // 使用正则表达式提取当前 MTT 值
        const mttMatch = currentTitle.match(/(MTT:\d+)/);
        let mttValue = mttMatch ? mttMatch[1] : 'MTT:0'; // 如果没有找到，默认为 MTT:0

        // 更新文档标题
        document.title = `${mttValue},match:${matchKey},type:game`;
    }
}

function tourney() {
    document.title = `MTT:0,match:0,type:tourney`;
    checkgameSlicks()
    Globals.tourney = false;
}

function competition() {
    const matchKey = getMatchKeyFromUrl();
    document.title = `MTT:0,match:${matchKey},type:competition`;
    //RegisterandJoin()
    delayedJoin()
    Globals.competition = false;
}

function game() {
    updateTitle()
    waitForElementAndStartInterval()
    Globals.game = false;
}

//////////////////////////////////////////////////////////////////


(function() {
    'use strict';

    window.addEventListener('load', function() {
        console.log('===============MTT启动中===============');
        setTimeout(() => {
            //checkgameSlicks()

        }, 10000); // 延迟1秒
    });


    setInterval(() => {
        const currentUrl = window.location.href;

        console.log(currentUrl, Globals);
        const notice = document.querySelector('.ant-notification-notice-close');
        if (notice){
            console.log('notice-close',notice)
            notice.click()
        }

        // 检查是否为指定的路径并判断任务锁状态
        if (currentUrl === 'https://sports.mtt.xyz/home/tourney' && !Globals.tourney) {
            // 执行第一个操作
            if (typeof tourney === 'function') {
                Globals.tourney = true;
                tourney(); // 调用 tourney 函数
                /*
                tourney().finally(() => {
                    Globals.tourney = false;
                });
                */
            } else {
                console.log('tourney 函数未定义');
            }
        } else if (currentUrl.includes('https://sports.mtt.xyz/home/competition') && !Globals.competition) {
            Globals.competition = true;
            competition()
        } else if (currentUrl.includes('https://sports.mtt.xyz/game') && !Globals.game) {
            Globals.game = true;
            game()
        } else {
            if (
                !currentUrl.includes('https://sports.mtt.xyz/game') &&
                !currentUrl.includes('https://sports.mtt.xyz/home/competition') &&
                currentUrl !== 'https://sports.mtt.xyz/home/tourney'
            ) {
                console.log('跑到了其他网页要回tourney');
                window.location.href = "https://sports.mtt.xyz/home/tourney";
            }
        }
    }
                , 6000);


})();
