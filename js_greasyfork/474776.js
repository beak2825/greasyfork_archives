// ==UserScript==
// @name         金十快讯语音播报
// @namespace   https://www.jin10.com/
// @version      1.12
// @description  抓取金十页面市场快讯，并进行语音播报（官方语音播报是收费功能）
// @author       robaggio
// @match        https://www.jin10.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jin10.com
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474776/%E9%87%91%E5%8D%81%E5%BF%AB%E8%AE%AF%E8%AF%AD%E9%9F%B3%E6%92%AD%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/474776/%E9%87%91%E5%8D%81%E5%BF%AB%E8%AE%AF%E8%AF%AD%E9%9F%B3%E6%92%AD%E6%8A%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // setup speech settings
    const synth = window.speechSynthesis;
    var voice = null;

    // 获取可用的语音列表
    function loadVoices() {
        //console.log("loadvoices");
        const voices = synth.getVoices();
        //console.log("voices",voices);
        for (let i = 0; i < voices.length; i++) {
            //console.log("voices name:",voices[i].name);
            if (voices[i].lang == "zh-CN" && voices[i].localService == false) {
                voice = voices[i];
                break;
            }
        }
    }

    // 语音列表可能需要异步加载
    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
    }

    // 语音播报开关
    var switchOn = false;
    var switchReadContent = false;
    let soundSwitchDiv = document.querySelector('.el-popover__reference').parentNode
    soundSwitchDiv.innerHTML = '语音播报 '
    let soundSwitch = document.createElement("input");
    soundSwitch.type = 'checkbox';
    soundSwitch.checked = false;
    soundSwitchDiv.appendChild(soundSwitch);
    soundSwitch.addEventListener("change", (event) => {
        switchOn = event.target.checked
        if (!switchOn) {
            // 暂停当前的读音
            synth.cancel();
        }
    });
    // 是否阅读正文开关
    let newContent = document.createTextNode("正文 ");
    soundSwitchDiv.appendChild(newContent);
    let soundSwitch2 = document.createElement("input");
    soundSwitch2.type = 'checkbox';
    soundSwitch2.checked = false
    soundSwitchDiv.appendChild(soundSwitch2);
    soundSwitch2.addEventListener("change", (event) => {
        switchReadContent = event.target.checked
    });

    // 最后一条消息id
    var lastMessageId = null;
    let observer = new MutationObserver(mutations => {
        //console.log(mutations)
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                // 只获取addnodes里的.jin-flash-item-container变化
                if (node.className?.indexOf('jin-flash-item-container')>=0){
                    // id可以用来判定消息的先后
                    let id = node.id;
                    if (lastMessageId == null){
                        lastMessageId = id;
                        return;
                    } else {
                        if (id<=lastMessageId)return;
                        lastMessageId = id;
                    }
                    // 标题， 不一定有
                    var title = node.querySelector('.right-common-title')?.innerText;
                    // 正文，肯定有
                    var content = node.querySelector('.collapse-content')?.innerText;
                    if (content == null)return;
                    // 处理vip解锁文字
                    content = content.replaceAll('解锁VIP快讯','')
                    // 判断是否有图片
                    var hasPic = node.querySelector('.right-pic') != null;
                    // 判断是否是重要
                    var isImportant = node.querySelector('.is-important') != null;

                    var readContent = '';
                    // 如果有标题，那么内容是否读要看 switchReadContent, 如果没有标题，就一定读内容
                    if (title == null) {
                        readContent += content;
                        // 如果有图再提示一下
                        if (hasPic){
                            readContent += '，查看图片';
                        }
                    } else {
                        readContent += title;
                        if (switchReadContent){
                            readContent += ('\n' + content);
                            // 如果有图再提示一下
                            if (hasPic){
                                readContent += '，查看图片';
                            }
                        } else {
                            readContent += '，阅读详情';
                        }
                    }

                    // 阅读文字处理去掉 「高盛(GS.N)涨2.6%」里的「(GS.N)」
                    readContent = readContent.replaceAll(/\(.*?\..*?\)/gm,'')
                    // 加上前缀，更方便定位内容
                    // 如果是要闻，也加上前缀
                    readContent = (isImportant?'金十要闻：':'金十快讯：') + readContent;
                    console.log('content',readContent);
                    if (!switchOn){
                        return;
                    }
                    console.log("select voice:",voice);
                    var utterThis = new SpeechSynthesisUtterance(readContent);
                    utterThis.lang = 'zh-CN';
                    utterThis.voice = voice;
                    utterThis.pitch = 1;// pitch may not feel something in Chinese?
                    utterThis.volume = 0.2;
                    utterThis.rate = 1.2; // speak a little quickly
                    synth.speak(utterThis);
                }
            });
        });
    });
    let box = document.querySelector('#jin_flash_list');
    observer.observe(box,{childList:true,subtree:true});

    //clear some vip ui
    setTimeout(function() {
        document.querySelector('.vip-exclusive')?.remove();
        document.querySelector('.top-ad_list')?.remove();
        document.querySelector('.toplink-entrance')?.remove();
        document.querySelector('.lazy-component_container')?.remove();
        document.querySelector('.pc-pic')?.remove();
        document.querySelector('.desktop-entrance')?.remove();

    }, 500);
})();