// ==UserScript==
// @name         自动答题提交
// @namespace    http://jiangzhipeng.cn/
// @version      0.1.1
// @description  jxr公司自动答题提交
// @author       Jiang
// @match        http://dtsp.cyitce.com:8088
// @icon         https://foruda.gitee.com/avatar/1676959947996164615/1275123_jzp979654682_1578947912.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512950/%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/512950/%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function sleep(time = 100) {
        return new Promise(res => {
            setTimeout(res, time)
        });
    }

    async function autoWork() {
        let allList = [...document.querySelectorAll('.lo-data .d-one')];
        let indexMap = new Array(26).fill(0).map((item, index) => String.fromCharCode(index + 65));
        let errList = [];
        for (let i = 0; i < allList.length; i++) {
            try {
                allList[i].click();
                await sleep();
                let answerText = document.querySelector('.q-right .r-left .r-bottom>div>span:nth-child(2)').innerText;
                let answers = answerText.split(',');
                let answersIndexs = answers.map(item => indexMap.indexOf(item));
                let label = [...document.querySelectorAll('.t-answer .el-checkbox-group .el-checkbox'), ...document.querySelectorAll('.t-answer .el-radio-group .el-radio')];
                if (label.length) {
                    for (let j = 0; j < label.length; j++) {
                        let item = label[j];
                        if (item.classList.contains('is-checked')) {
                            answersIndexs.indexOf(j) === -1 && item.click();
                        } else {
                            answersIndexs.indexOf(j) !== -1 && item.click();
                        }
                        await sleep();
                    }
                } else {
                    errList.push(i + 1);
                }
            } catch (error) {
                errList.push(i + 1);
                console.log(error);
            }
        }
        if (errList.length) {
            alert(`第 ${errList.join('、')} 题处理失败，需要手动处理`);
        } else {
            alert('完成！');
        }
    }

    function creatSubmitBtn() {
        let paperHeader = document.querySelector('#app');
        let jiangBtnBox = document.querySelector('.jiang-btn-box');
        let submitBtn = document.querySelector('.jiang-btn');
        if (!jiangBtnBox) {
            jiangBtnBox = document.createElement('div');
            jiangBtnBox.classList.add('jiang-btn-box');
            jiangBtnBox.style.position = 'absolute';
            jiangBtnBox.style.right = '0px';
            jiangBtnBox.style.top = '0px';
            paperHeader.append(jiangBtnBox);
        }
        if (!submitBtn) {
            submitBtn = document.createElement('button');
            submitBtn.classList.add('el-button', 'el-button--success', 'el-button--mini', 'jiang-btn');
            submitBtn.innerText = '自动选择';
            submitBtn.style.position = 'absolute';
            submitBtn.style.right = '125px';
            submitBtn.style.top = '20px';
            submitBtn.addEventListener('click', autoWork);
            jiangBtnBox.append(submitBtn);
        }
    }

    var historyPushState = history.pushState;
    function myPushState(state, title, url) {
        historyPushState.call(history, state, title, url);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
    Object.defineProperty(history, 'pushState', {value: myPushState});

    var historyReplaceState = history.replaceState;
    function myReplaceState(state, title, url) {
        historyReplaceState.call(history, state, title, url);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
    Object.defineProperty(history, 'replaceState', {value: myReplaceState});

    window.addEventListener('hashchange', function() {
        if (location.href.indexOf('#/examing') !== -1) {
            creatSubmitBtn();
        } else {
            let jiangBtnBox = document.querySelector('.jiang-btn-box');
            if (jiangBtnBox) {
                jiangBtnBox.innerHTML = '';
            }
        }
    });

})();