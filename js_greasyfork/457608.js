// ==UserScript==
// @name         人民网-观点-朗读器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击阅读 人民网-观点频道 的文章
// @author       Song JinYang
// @match        http://opinion.people.com.cn/n1/*
// @icon         http://politics.people.com.cn/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457608/%E4%BA%BA%E6%B0%91%E7%BD%91-%E8%A7%82%E7%82%B9-%E6%9C%97%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/457608/%E4%BA%BA%E6%B0%91%E7%BD%91-%E8%A7%82%E7%82%B9-%E6%9C%97%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 支持win10自带Microsoft Edge浏览器，谷歌浏览器，需安装Tampermonkey插件
    // 非 Microsoft Edge浏览器 可能不支持 Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)，建议使用 Microsoft Edge浏览器
    // 目前脚本为避免bug，只支持 人民网-观点频道，即 http://opinion.people.com.cn

    // 脚本支持：1. 点击标题阅读全文
    //                 2. 点击段落阅读段落，正在朗读的段落显示为红色
    //                 3. 点击正在朗读的红色段落可以暂停或继续
    //                 4. 当鼠标指针置于标题或段落上方时，显示黄色背景

    // 使用方法：1. 打开Microsoft Edge浏览器
    //                 2. 访问 https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd?hl=zh-CN
    //                 3. 安装加载项
    //                 4. 打开tampermonkey插件，点击“添加新脚本”，删除所有内容并将本文复制粘贴进去
    //                 5. 访问 http://opinion.people.com.cn
    //                 6. 选择一篇文章，点击标题或段落（置于可朗读的标题或段落上方时，会显示黄色背景），开始朗读

    const synth = window.speechSynthesis;

    synth.isSpeaking = false;
    synth.isPaused = false;

    var favor = "Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)";
    var speakVoice;

    var currentSentence;

    synth.addEventListener("voiceschanged", () => {
        const voices = synth.getVoices();

        console.log("voices ", voices);

        for (let voice of voices) {
            if(voice.name == favor) {
                speakVoice = voice;
                break;
            }
        }
    });

    function sepak(sentence) {
        let utterance = new SpeechSynthesisUtterance();

        utterance.text = sentence.innerText;

        utterance.volume = 1;
        utterance.rate = 1;
        utterance.voice = speakVoice;

        utterance.onstart = (event) => {
            sentence.style.color = "#f44336";
            sentence.style.cursor = "progress";
            synth.isSpeaking = true;
            synth.isPaused = false;

            currentSentence = sentence;
        }
        utterance.onend = (event) => {
            sentence.style.color = "#000000";
            sentence.style.cursor = "text";
            synth.isSpeaking = false;
            synth.isPaused = false;
        }

        synth.speak(utterance);
    }

    var article = document.getElementsByClassName("rm_txt")[0].getElementsByClassName("col-1")[0];
    article.getElementsByClassName("rm_download")[0].remove();
    article.getElementsByClassName("edit")[0].remove();
    article.getElementsByClassName("paper_num")[0].remove();

    var tagH1 = article.getElementsByTagName("h1")[0];
    var tagP = article.getElementsByTagName("p");


    window.addEventListener("storage", (e) => {
        if(e.key && e.key == "articleTitle" && e.newValue !== tagH1.innerText){
            console.log("切换 " + e.newValue);
            synth.cancel();
        }
    })

    for(let [index, p] of Object.entries(tagP)) {

        p.onmouseover = function () {
            this.style.backgroundColor = "#ffff006b";
        };
        p.onmouseout = function () {
            this.style.backgroundColor = "";
        };

        p.onclick = function() {
            if(currentSentence == this && synth.isSpeaking) {
                if(synth.isPaused) {
                    synth.resume();
                    synth.isPaused = false;
                } else {
                    synth.pause();
                    synth.isPaused = true;
                }
            } else {
                synth.cancel();

                localStorage.setItem("articleTitle", tagH1.innerText);

                setTimeout(function(sent){
                    sepak(sent);
                }, 1000, this);
            }
        }
    }

    tagH1.onmouseover = function () {
        article.style.backgroundColor = "#ffff006b";
    };
    tagH1.onmouseout = function () {
        article.style.backgroundColor = "";
    };

    tagH1.onclick = function(){
        localStorage.setItem("articleTitle", tagH1.innerText);

        synth.cancel();

        setTimeout(function(){
            sepak(tagH1);
            for(let [index, p] of Object.entries(tagP)) {
                sepak(p);
            }
        }, 1000);
    }
})();