// ==UserScript==
// @name         旋转的五分硬币专用排队
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  旋转的五分硬币直播间深渊排队脚本
// @author       Rexze
// @match        *://live.bilibili.com/3140454*
// @match        *://live.bilibili.com/743364*
// @icon         https://i0.hdslb.com/bfs/face/770e517a33a4c23affb0bc9b479d8986f1b6e1d7.jpg@256w_256h_1o.webp
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/436395/%E6%97%8B%E8%BD%AC%E7%9A%84%E4%BA%94%E5%88%86%E7%A1%AC%E5%B8%81%E4%B8%93%E7%94%A8%E6%8E%92%E9%98%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/436395/%E6%97%8B%E8%BD%AC%E7%9A%84%E4%BA%94%E5%88%86%E7%A1%AC%E5%B8%81%E4%B8%93%E7%94%A8%E6%8E%92%E9%98%9F.meta.js
// ==/UserScript==
// 感谢q群某御和剑来提供的技术支持~

(function () {
    'use strict';
    // 监控弹幕列表变化
    var observer = new MutationObserver(function (mutations, observer) {
        getUser();
    });
    var chatItems = document.querySelector('.chat-history-panel .chat-items');
    var options = {
        childList: true,
        attributes: true,
        characterData: true
    };
    observer.observe(chatItems, options);
    setButton();
})();

function getUser() {
    var list = document.querySelectorAll('.chat-history-panel .danmaku-item');
    const content = list.item(list.length - 1).getAttribute('data-danmaku').trim();
    const userName = list.item(list.length - 1).getAttribute('data-uname').trim();
    var endurinQueueDic = {};
    // 排队人员验重后放入dic存入脚本存储空间
    if (content == '排队') {
        var queueDic = GM_getValue('queueDic') ? GM_getValue('queueDic') : {}; // 队列dic
        var queueNumber = GM_getValue('queueNumber') ? GM_getValue('queueNumber') : 1; // 队列序号
        endurinQueueDic = GM_getValue('endurinQueueDic') ? GM_getValue('endurinQueueDic') : {}; // 持久队列dic
        if (queueDic[userName]) {
            speak(userName + '你已经排过队啦');
            return;
        } else {
            queueDic[userName] = queueNumber;
            endurinQueueDic[userName] = queueNumber;
            queueNumber++;
            GM_setValue('queueDic', queueDic);
            GM_setValue('endurinQueueDic', endurinQueueDic);
            GM_setValue('queueNumber', queueNumber);
            speak(userName + '排队成功');
        }
    } else if (content == '排队查询'){
        endurinQueueDic = GM_getValue('endurinQueueDic') ? GM_getValue('endurinQueueDic') : {};
        if (endurinQueueDic[userName]) {
            speak(userName + '你已经排过队啦');
        } else {
            speak(userName + '你还没排队');
        }
        return;
    } else {
        return;
    }
}

function speak(message) {
    var speech = new SpeechSynthesisUtterance();
    // speech.pitch = 1 // 获取并设置话语的音调(值越大越尖锐,越低越低沉)
    // speech.rate  = 5 // 获取并设置说话的速度(值越大语速越快,越小语速越慢)
    // speech.voice = 10 // 获取并设置说话的声音
    // speech.volume = 1 // 获取并设置说话的音量
    // speech.lang = speechSynthesis.getVoices()[0] // 设置播放语言，测试没效果
    // speech.cancel() // 删除队列中所有的语音.如果正在播放,则直接停止
    speech.text = message // 获取并设置说话时的文本
    speechSynthesis.speak(speech);
}

function setButton() {
    var button = document.createElement("button");
    button.textContent = "获取排队列表";
    button.style.width = "100px";
    button.style.height = "20px";
    button.style.align = "center";
    button.style.position = 'fixed';
    button.style.right = '20px';
    button.style.top = '80px';
    button.style.zIndex = '999';
    button.addEventListener("click", clickBotton);

    var button2 = document.createElement("button");
    button2.textContent = "清除队列缓存";
    button2.style.width = "100px";
    button2.style.height = "20px";
    button2.style.align = "center";
    button2.style.position = 'fixed';
    button2.style.right = '20px';
    button2.style.top = '50px';
    button2.style.zIndex = '999';
    button2.addEventListener("click", clickBotton2);

    var button3 = document.createElement("button");
    button3.textContent = "清除查询缓存";
    button3.style.width = "100px";
    button3.style.height = "20px";
    button3.style.align = "center";
    button3.style.position = 'fixed';
    button3.style.right = '20px';
    button3.style.top = '20px';
    button3.style.zIndex = '999';
    button3.addEventListener("click", clickBotton3);

    // 导出按钮
    function clickBotton() {
        var queueDic = GM_getValue('queueDic') ? GM_getValue('queueDic') : { '暂时无人排队': 0 };
        var result = '';
        for (var key in queueDic) {
            // result = result + queueDic[key] + ' ' + key + '\n';
            // 暂时不需要显示序号了
            result = result + key + '\n';
        }
        // 写入剪贴板
        GM_setClipboard(result);
        alert("已复制到剪贴板");
    }
    // 清空按钮
    function clickBotton2() {
        var r = confirm('确定清空全部排队查询数据吗？');
        if (r == true) {
            r = confirm('此操作无法恢复!');
            if (r == true) {
                GM_deleteValue('queueDic');
                GM_deleteValue('queueNumber');
            }
        }
    }

    // 清空查询按钮
    function clickBotton3() {
        var r = confirm('确定清空全部排队数据吗？');
        if (r == true) {
            r = confirm('此操作无法恢复!');
            if (r == true) {
                GM_deleteValue('endurinQqueueDic');
            }
        }
    }

    document.body.appendChild(button);
    document.body.appendChild(button2);
    document.body.appendChild(button3);

    return;
}