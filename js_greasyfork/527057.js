// ==UserScript==
// @name         飞天狙想要努力变胖，自动发送木柜子，略略略表情（自用）
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  发送木柜子大头驱逐略略略，发送略略略驱逐木柜子大头。检测弹幕关键词，发送表情，可以针对特定关键词指定表情包范围，随机发送。发送表情方式为模拟点击表情包图标再点击相应表情包，请确保表情名称正确并且自己拥有该表情！借助chatgpt写的，能用就行。
// @author       Explosion1016
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527057/%E9%A3%9E%E5%A4%A9%E7%8B%99%E6%83%B3%E8%A6%81%E5%8A%AA%E5%8A%9B%E5%8F%98%E8%83%96%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E6%9C%A8%E6%9F%9C%E5%AD%90%EF%BC%8C%E7%95%A5%E7%95%A5%E7%95%A5%E8%A1%A8%E6%83%85%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/527057/%E9%A3%9E%E5%A4%A9%E7%8B%99%E6%83%B3%E8%A6%81%E5%8A%AA%E5%8A%9B%E5%8F%98%E8%83%96%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E6%9C%A8%E6%9F%9C%E5%AD%90%EF%BC%8C%E7%95%A5%E7%95%A5%E7%95%A5%E8%A1%A8%E6%83%85%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==


(function() {
    'use strict';



    // ↓↓↓可以自定义的数据↓↓↓
    const chatLimit = 10 //聊天区聊天数量最大值
    const color1 = "yellow"; // 匹配到关键词的聊天的背景颜色
    const color2 = "#00D7F3";//自己发送的匹配到关键词的聊天的背景颜色
    const uid = "35308822"; //自己的uid
    const mygo = ['害羞','生气','发送消息','抹茶芭菲','请点单','不要吵架','Love','让我看看','溜了溜了','那我呢？','创作中','探头','为什么！','刚睡醒','哈？','忧郁','不会吧？','大哭','有趣的女人','Block!']
    const ftj = ["亲亲","惊讶","测温","略略略"]
    const senrenbanka = ['芳乃Ciallo','丛雨Ciallo','茉子Ciallo','蕾娜Ciallo']
    const popipa = ['啊？','你是？','诶？','出击','拜托了','嗯？','恐惧','微笑','呵','这样','呜呜','无语','好吃','嫌弃','冲鸭','哦？','哎呀','汗','困惑','机智','讨厌','冲','啊啊？','干嘛','生气']
    const mujica = ['挺好','再等一下','震惊','比叉叉','开心','哼','怎么突然','诶','一次买够','难道？','睡觉','我要告你','赌气','记得微笑','委屈','不行','美味','我有话说','害怕','愉快']
    const pp = ["修哇修哇","好耶！","哇啊！","哭哭","真的吗","记下了","好吧","吃土","打咩","冲啊","抱大腿","诶？","星星眼","呃","无语了","我不听","汗","可以！","哦？","啊啊啊","不要哇","唔","啊？","害羞"]

    const keywords = ["木柜子",'mygo','ciallo','略略略',"Mygo","千恋万花","BanGDream","柚子厨"]; //关键词
    const emotionkeywords = ["FTJ","千恋万花","Mygo","略略略","测温","惊讶","亲亲","良辰共此曲","BanGDream","Ave Mujica","Poppin Party","Pastel Palettes"] //表情包关键词
    const callInterval = 6000; // 发送最短间隔
    const setmaxTime = 60000// 发送最长间隔（触发自动发送）
    let maxTime = 99999999
    let is_work = false
    if(window.location.href.includes("https://live.bilibili.com/23197314")){
        maxTime = setmaxTime
        is_work = true
        //console.log("飞天狙直播间")
    }else{
        setmaxTime = maxTime;
        callInterval = maxTime;

    }//超时自动发送表情的直播间
    const emotionsList = senrenbanka.concat(mygo).concat(ftj).concat(popipa).concat(mujica).concat(pp);//所有表情列表
    const emoticonDict = {
       'mygo':mygo.concat(popipa).concat(mujica).concat(pp),
        'Mygo':mygo.concat(popipa).concat(mujica).concat(pp),
        'ciallo':senrenbanka,
        '千恋万花':senrenbanka,
        "略略略":senrenbanka.concat(mygo).concat(popipa).concat(mujica).concat(pp),
        "FTJ":["测温","探头","让我看看","芳乃Ciallo","丛雨Ciallo","惊讶"],
        "木柜子":senrenbanka.concat(mygo).concat(popipa).concat(mujica).concat(pp),
        "Ave Mujica":mygo.concat(popipa).concat(mujica).concat(pp),
        "Poppin Party":mygo.concat(popipa).concat(mujica).concat(pp),
        "Pastel Palettes":mygo.concat(popipa).concat(mujica).concat(pp),
    }//匹配表情包，设定关键词对应的表情
    mujica.forEach(keyword => {
    emoticonDict[keyword] = mujica;
});
    popipa.forEach(keyword => {
    emoticonDict[keyword] = popipa;
});
    pp.forEach(keyword => {
    emoticonDict[keyword] = popipa;
});

    //↑↑↑可以自定义的数据↑↑↑

    let timeString = "";
    let idleTimer;
    let countdownTimer;
    let sum = localStorage.getItem('count') || 0;
    let sum_match_chat = localStorage.getItem('count_match_chat') || 0;
    let sum_match_emotion = localStorage.getItem('count_match_emotion') || 0;
    sum = Number(sum) || 0 //发送表情数
    sum_match_chat = Number(sum_match_chat) || 0 //匹配弹幕数
    sum_match_emotion = Number(sum_match_emotion) || 0 //匹配表情数
    let observer = null;
    let lastSendTime = Date.now();
    let nowemotionList = [];
    let nextTime = Date.now() + maxTime
    //let remainingTime = maxTime

async function sendEmotion(keyword){
        const currentTime = Date.now();
        if (currentTime - lastSendTime >= callInterval) {
            // 更新上次调用时间
            lastSendTime = currentTime;
            // 先找到并点击表情包面板，确保表情显示
            const panelTrigger = document.evaluate('//*[@id="control-panel-ctnr-box"]/div[1]/div[2]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (panelTrigger) {
                const panel = document.evaluate('//*[@id="control-panel-ctnr-box"]/div[1]/div[2]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                setTimeout(() => {}, 1000);
                // 判断元素的 classList 是否包含 'active'
                if (panel && panel.classList.contains('active')) {
                    //console.log('已打开表情面板');
                } else {
                    panelTrigger.click(); // 触发打开表情面板
                    //console.log('未打开表情面板');
                }
                     // 检查字典中是否有该关键字
                    if (emoticonDict.hasOwnProperty(keyword)) {
                        // 如果字典中存在该关键字，则使用该关键字对应的表情包列表
                         nowemotionList = emoticonDict[keyword];
                    }else{
                        nowemotionList = emotionsList;
                    }
                await new Promise(resolve => setTimeout(resolve, 2000));

                    //  随机选择一个表情包
                    const randomIndex = Math.floor(Math.random() * nowemotionList.length);
                    const randomEmoticonTitle = nowemotionList[randomIndex]; // 随机选中的表情包名称
                    //  选择目标表情元素
                    const elements = [...document.querySelectorAll(`[title="${randomEmoticonTitle}"]`)];
                const emoticonElement = elements.length >= 2 ? elements[Math.floor(Math.random() * elements.length)] : elements[0] || null;
                //console.log("发送表情:"+ randomEmoticonTitle)


                    if (emoticonElement) {
                        // 触发点击事件，发送表情
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        sum = sum + 1;
                        localStorage.setItem('count', sum);
                        emoticonElement.dispatchEvent(clickEvent);
                        if(keyword == ""){
                           // console.log('自动发送表情: '+ randomEmoticonTitle);
                            maxTime = Math.min(maxTime * 1.5,7200000);//当自动发送表情包后，下一次自动发送的间隔变为当前的1.5倍，防止发送过于频繁。
                            nextTime = Date.now() + maxTime;
                        }else{
                           // console.log('已发送表情: '+ randomEmoticonTitle);
                            maxTime = Math.max(setmaxTime, maxTime / 3);
                            nextTime = Date.now() + maxTime;
                        }
                        dataShow();
                    } else {
                        //console.log('未找到目标表情'+randomEmoticonTitle);
                    }
            } else {
                //console.log('未找到表情');
            }
        } else{
            //console.log("频率限制，未发送")
        }
    }

function handleDanmaku(danmakuElement) {
    const danmakuText = danmakuElement.getAttribute('data-danmaku') || '';
    const danmakuuid = danmakuElement.getAttribute('data-uid') || '';
    //console.log(danmakuText);
    const outerClass = danmakuElement.classList;
    if (outerClass.contains('chat-emoticon')) {
        // 查找第一个匹配的关键词
        const matchedEmotionKeyword = emotionkeywords.find(keyword => danmakuText.includes(keyword));
        if (matchedEmotionKeyword) {
            if(danmakuuid == uid){
                danmakuElement.style.backgroundColor = color2;
            }else{
                //console.log('匹配表情:', danmakuText);
                danmakuElement.style.backgroundColor = color1;
                sum_match_emotion = sum_match_emotion +1;
                localStorage.setItem('count_match_emotion', sum_match_emotion);
                dataShow();
                // 调用 sendEmotion 函数，并传递第一个匹配的关键词
                sendEmotion(matchedEmotionKeyword);
            }
        }
//         else{
//             let nowTime = Date.now();
//             if(nowTime - lastSendTime >= maxTime){
//                 sendEmotion("");

//             }
//         }
    } else {
        // 查找第一个匹配的关键词
        const matchedKeyword = keywords.find(keyword => danmakuText.includes(keyword));
        if (matchedKeyword) {
            if(danmakuuid == uid){
                danmakuElement.style.backgroundColor = color2;
            }else{
               // console.log('匹配弹幕:', danmakuText);
                danmakuElement.style.backgroundColor = color1;
                sum_match_chat = sum_match_chat + 1;
                localStorage.setItem('count_match_chat', sum_match_chat);
                dataShow();
                // 调用 sendEmotion 函数，并传递第一个匹配的关键词
                sendEmotion(matchedKeyword);
            }
        }
//         else{
//             let nowTime = Date.now();
//             if(nowTime - lastSendTime >= maxTime){
//                 sendEmotion("");

//             }
//         }
    }
}

//     function resetIdleTimer() {
//         // 每次操作时，重置计时器
//         remainingTime = maxTime; // 重置冷却时间
//         if (countdownTimer) clearInterval(countdownTimer);
//         startIdleTimer();
//     }

    function startIdleTimer() {
        // 显示冷却时间
        countdownTimer = setInterval(() => {
            dataShow();
            if (nextTime - Date.now() <= 0) {
                sendEmotion("");
            }
        }, 1000);
    }

    function startObserving(chatContainer) {
        if (observer) observer.disconnect();
        observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node && node.classList && node.classList.contains('chat-item')) {
                        if(is_work){
                            handleDanmaku(node);
                        }
                        
                    }

                });
            });
        });
        observer.observe(chatContainer, { childList: true, subtree: true });
        dataShow();
        //console.log('弹幕监控已启动');
        startIdleTimer(); // 启动计时器
        // 定义一个定时器，定期检查并删除超出最大数量的记录
        setInterval(function() {
            // 获取所有的聊天记录 div 元素
            let chatItems = document.querySelectorAll('.chat-item');

            // 如果聊天记录数量超过了设定的最大值
            if (chatItems.length > chatLimit) {
                // 删除超出部分的聊天记录
                const excessItems = Array.from(chatItems).slice(0, chatItems.length - chatLimit);
                excessItems.forEach(item => item.remove());
            }
        }, 1000);// 每秒检查一次
    }

    function waitForChatContainer() {
        const checkInterval = setInterval(() => {
            const chatContainer = document.querySelector('.chat-history-panel.new');
            if (chatContainer) {
                clearInterval(checkInterval);
                startObserving(chatContainer);
            }
        }, 1000);
    }

    function formatMilliseconds(ms) {
        const hours = Math.floor(ms / 3600000); // 获取小时数
        const minutes = Math.floor((ms % 3600000) / 60000); // 获取分钟数
        const seconds = Math.floor((ms % 60000) / 1000); // 获取秒数
        if(ms<=0){
            timeString = "(发送中)"
        }else{
        timeString = '(';
        if (hours > 0) {
            timeString += `${hours}小时`;
        }
        if (minutes > 0) { // 如果有小时或分钟大于0才显示分钟
            timeString += `${minutes}分钟`;
        }
        if(seconds >= 0){
            timeString += `${seconds}秒`;
        }
           timeString +=")";
        }
        return timeString.trim(); // 去掉末尾多余的空格
    }

    function dataShow(){
        // 使用 XPath 查找元素
        let textarea = document.evaluate('//*[@id="control-panel-ctnr-box"]/div[2]/div[2]/textarea', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let newtext = "已发送" + sum + "次表情包"+formatMilliseconds(nextTime - Date.now())+"\n共匹配"+ sum_match_chat +"条弹幕,"+sum_match_emotion+"个表情";
        // 修改占位符
        if (textarea) {
            textarea.setAttribute('placeholder', newtext);
        }
    }

    window.addEventListener('load', () => {
        waitForChatContainer();
    });
})();

