// ==UserScript==
// @name         block hupu
// @namespace    https://wiyi.org
// @version      0.2
// @description  屏蔽虎扑论坛的主题
// @author       Bigbyto
// @match        https://bbs.hupu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392346/block%20hupu.user.js
// @updateURL https://update.greasyfork.org/scripts/392346/block%20hupu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!shouldEnable()) {return;}

    const blockTopics = [];
    const keywords = getKeywords();
    createSettingUI(keywords);
    // Your code here...
    let allTopics = document.querySelectorAll('.truetit');
    let count = 0;
    const blockInfo = createElement(keywords);
    if (allTopics && allTopics.length > 0) {
        allTopics = Array.from(allTopics);
        allTopics.forEach(topic => process(topic));
        blockInfo.innerText = `屏蔽了 ${count} 个主题`;
    }

    console.log(blockTopics);

    function process(topic) {
        try {
            let title = topic.innerText;
            let keyword = shouldHide(title);
            if (keyword !== null) {
                topic.parentElement.parentElement.style = 'display:none'
                blockTopics.push(topic.parentElement.parentElement);
                console.log('\nremove topic: ' + title, '\nreason: ' + keyword, '\nlink:' + topic.href);
                count += 1;
            }
        } catch(err) {
            console.log(err);
        }
    }

    function shouldHide(text) {
        for (let keyword of keywords) {
            keyword = keyword.toLowerCase();
            if (keyword && text.toLowerCase().includes(keyword)) {
                return keyword;
            }
        }

        return null;
    }

    function createElement(){
        let head = document.querySelector('.bbs_head');
        if (!head) {return null}
        let right = head.querySelector('.right')
        if (!right) {return null}

        const element = document.createElement('div');

        right.insertAdjacentElement('afterbegin',element);
        element.setAttribute('class','block-info-area');

        const span = document.createElement('span');
        span.style = 'padding-right: 10px';
        element.appendChild(span);

        const a = document.createElement('a');
        a.setAttribute('class','open-setting');
        a.innerText = '打开设置';
        a.style = 'color: blue'
        element.appendChild(a);

        a.onclick = () => {
            const e = document.querySelector('.setting-ui');
            e.style.display = 'block';
        }

        return span;
    }

    function createSettingUI() {
        let settingUI = document.createElement('div');
        settingUI.style = 'display:none;position: fixed; top:0; bottom: 0;left:0; right:0;background: rgba(0,0,0,0.3);z-index: 999;'
        settingUI.setAttribute('class','setting-ui');

        let body = document.createElement('div');
        body.style = 'background-color: white;width: 500px;height: 350px;margin: auto;margin-top: 120px;'
        let img = document.createElement('img');
        img.style = 'width: 12px;float: right;padding: 10px;'
        img.src = 'https://image.flaticon.com/icons/png/512/127/127936.png';
        img.onclick = () => { settingUI.style.display = 'none'}

        let field = document.createElement('div');
        field.innerText = "屏蔽关键字(一行一个)";
        field.style = 'margin-left: 20px;padding-top: 30px;font-size: 13px;color: #333;'
        body.appendChild(img);
        body.appendChild(field);

        const area = document.createElement('textarea');
        area.style = 'margin-left: 20px;margin-top: 10px;border-color: #ccc;height: 230px;padding:5px;box-sizing: border-box;'
        area.value = keywords.join('\n');
        body.appendChild(area);

        const buttonDiv = document.createElement('div');
        buttonDiv.style = 'margin-left: 20px;margin-top: 15px;display: inline-block;';

        const btn1 = document.createElement('button');
        btn1.innerText = '保存'
        btn1.style = 'padding: 5px;width: 80px;border-radius: 2px;background-color: rgb(233, 104, 107);color: white;border: none;'
        btn1.onclick = (e) => {
            saveKeywords(area.value);
            location.reload();
        }

        buttonDiv.appendChild(btn1);
        body.append(buttonDiv);
        settingUI.appendChild(body);
        document.body.appendChild(settingUI);
    }

    function getKeywords() {
        const key = `${getNamespace()}_keywords`;
        let keywords = localStorage.getItem(key);
        if (!keywords) { return [] }

        return JSON.parse(keywords);
    }

    function saveKeywords(content) {
        if (!content) {return;}

        const key = `${getNamespace()}_keywords`;
        const arr = content.split('\n');
        localStorage.setItem(key,JSON.stringify(arr));
    }

    function getNamespace() {
        let href = window.location.href;
        const arr = href.split('com/');

        return arr[1].replace(/(-[0-9]*).*/g,'');
    }

    function shouldEnable() {
        let href = window.location.href;
        return !href.includes('.html');
    }
})();