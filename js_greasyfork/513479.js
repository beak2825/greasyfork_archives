// ==UserScript==
// @name         必应自动随机搜索
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  必应随机搜索
// @author       Haze
// @match        https://cn.bing.com/*
// @match        https://www.bing.com/*
// @exclude      https://cn.bing.com/rewards/*
// @exclude      https://www.bing.com/rewards/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513479/%E5%BF%85%E5%BA%94%E8%87%AA%E5%8A%A8%E9%9A%8F%E6%9C%BA%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/513479/%E5%BF%85%E5%BA%94%E8%87%AA%E5%8A%A8%E9%9A%8F%E6%9C%BA%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let messageBox = null;
    let searchInput = null;
    let suggestionItem = null;
    let width = document.body.clientWidth < 900 ? "95vw" : "40vw";
    const progressBar = {
        element: null,
        timer: 0,
        end: 100,
        cor: null
    };
    function createElement() {
        let div = document.createElement('div');
        Object.assign(div.style, {
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            width: width,
            minHeight: '100px',
            background: 'rgba(0, 0, 0, 0.5)',
            textAlign: 'center',
            lineHeight: '100px',
            color: 'white',
            fontSize: '24px',
            top: '35%',
            zIndex: '999'
        });
        document.body.append(div);
        messageBox = div;

        // 创建进度条容器
        let progressBarContainer = document.createElement('div');
        Object.assign(progressBarContainer.style, {
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            width: width,
            height: '10px',
            top: 'calc(35% + 100px)', // 将进度条放在消息框下方
            background: '#ccc',
            zIndex: 9999
        });
        document.body.append(progressBarContainer);

        // 创建进度条填充元素
        progressBar.element = document.createElement('div');
        Object.assign(progressBar.element.style, {
            width: '0%', // 初始宽度为0%
            height: '100%',
            background: 'yellow'
        });
        progressBarContainer.append(progressBar.element);

        // 这里可以添加代码来更新进度条的宽度

        showMessage('自动搜索已就绪...等待执行中');
    }
    function showMessage(text) {
        messageBox.innerHTML = '<span>' + text + '</span>';
    }
    const waitClickMessageCor = {
        count: 0,
        cor: null,
        text: '等待自动点击搜索',
        start: function () {
            this.cor = setInterval(() => {
                if (this.count >= 8) {
                    this.text = "等待自动点击搜索";
                    this.count = 0;
                }
                this.text += "."
                showMessage(this.text)
                this.count++;
            }, 100);
        },
        stop: function () {
            clearInterval(this.cor);
        }
    }
    const updateProgressBarCor = () => {
        if (progressBar.element == null) {
            return;
        }
        if (progressBar.end == 0) {
            return;
        }
        if (progressBar.timer >= progressBar.end) {
            return;
        }
        progressBar.timer += 50;
        const rate = progressBar.timer / progressBar.end;
        progressBar.element.style.width = (rate * 100) + '%';
    }
    const setProgressBarTimer = (val) => {
        progressBar.timer = 0;
        progressBar.end = val;
    }
    const randomScroll = async () => {
        await new Promise(resolve => setTimeout(resolve, (Math.random() * 3000) + 5000));
        var element = document.body;
        if (element != null) {
            element.scrollTo(Math.floor(Math.random() * 1000) + 1000, 0);
            randomScroll();
        }
    }
    const reset = () => {
        searchInput = document.getElementById('sb_form_q');
        if (searchInput == null) {
            errorAndReset('输入框未找到');
            return;
        }
        const item = functionArr[Math.floor(Math.random() * functionArr.length)];
        item();
        let searchTimer = Math.floor(Math.random() * 31000) + 11000;
        setProgressBarTimer(searchTimer);
        setTimeout(doSearch, searchTimer);
    }
    const getRandomSentence = async () => {
        showMessage('获取随机网络句子...');
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1500) + 1500));
        await fetch('https://v1.hitokoto.cn/', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                const texts = [data.hitokoto, data.from, data.from_who, data.creator];
                const item = texts[Math.floor(Math.random() * texts.length)];
                searchInput.value = item;
                waitClickMessageCor.start();
            })
            .catch(error => () => {
                errorAndReset();
            });
    }
    const getRandomWord = async () => {
        showMessage('获取随机成语，热搜词条等...');
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1500) + 1500));
        await fetch('https://site.gxyunyun.com/word-v1/web', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                if (data.rs) {
                    searchInput.value = data.data;
                    waitClickMessageCor.start();
                }
                throw new error('xxx');
            })
            .catch(error => () => {
                errorAndReset();
            });
    }
    const clickRandomSuggestion = async () => {
        let temp = document.getElementsByClassName('richrsrailsuggestion');
        for (const item of temp) {
            const a_item = item.children[0];
            a_item.setAttribute('target', '_self');
        }
        showMessage('随机点击更多搜索项...');
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1500) + 1500));
        try {
            suggestionItem = temp[Math.floor(Math.random() * temp.length)].children[0];
            waitClickMessageCor.start();
        } catch (e) {
            errorAndReset();
            await new Promise(resolve => setTimeout(resolve, 1000));
            reset();
        }
    }
    const errorAndReset = async (msg) => {
        if (msg == null || msg == undefined) {
            msg = '出错了';
        }
        showMessage(`${msg}...即将重置`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        reset();
    }
    const doSearch = async () => {
        if (suggestionItem != null) {
            suggestionItem.click();
            return;
        }
        try {
            let searchBtn = document.getElementById('sb_form_go');
            if (searchBtn == null) {
                clear();
                showMessage('没找到点击按钮！1秒后自动刷新页面！');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                return;
            }
            if (searchInput.value == null || searchInput.value.length == 0) {
                clear();
                showMessage('搜索输入框内容是空的！1秒后重新获取内容');
                setTimeout(reset, 1000);
                return;
            }
            clear();
            searchBtn.click();
            let timer = Math.floor(Math.random() * 5000) + 5000;
            showMessage('已执行搜索！即将重置');
            setProgressBarTimer(timer);
            setTimeout(reset, timer);
        } catch (e) {
            console.error(e);
            clear();
            showMessage('不知道为什么出错了！请打开控制台看错误日志！然后手动刷新页面');
        }
    }
    const clear = () => {
        waitClickMessageCor.stop();
    }
    createElement();
    setTimeout(reset, Math.floor(Math.random() * 1000) + 3000);
    //randomScroll();
    progressBar.cor = setInterval(updateProgressBarCor, 50);

    const functionArr = [getRandomSentence, getRandomWord]
})();