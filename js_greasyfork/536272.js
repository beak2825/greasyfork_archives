// ==UserScript==
// @name         兰大自动评教
// @namespace    https://github.com/LaLa-HaHa-Hei/
// @version      1.1.3
// @description  自动完成兰州大学评教任务，从“个人工作台”->“听评课" 中进入
// @author       代码见三
// @license      GPL-3.0-or-later
// @match        *://jwqe.lzu.edu.cn:8080/*
// @downloadURL https://update.greasyfork.org/scripts/536272/%E5%85%B0%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/536272/%E5%85%B0%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

    main()

    async function main() {
        if (await isEvaluatePage()) {
            let buttonElement = injectButton()
            buttonElement.addEventListener('click', autoEvaluate)
        }
    }

    // 用是否有uni-view.xspj元素判断是否是评教页面
    async function isEvaluatePage() {
        let xspjElement = null
        for (let i = 0; i < 20 && xspjElement === null; i++) {
            await sleep(500)
            xspjElement = document.querySelector('uni-view.xspj')
        }
        return xspjElement !== null
    }

    // 注入按钮
    function injectButton() {
        const buttonElement = document.createElement('button')
        buttonElement.id = 'autoEvaluateButton'
        buttonElement.textContent = '自动评教（请先打开某个评教项目）'
        buttonElement.style.cssText = `
            position: absolute;
            top: 2px;
            right: 10px;
            z-index: 9999;
            height: 40px;
            width: 280px;
            line-height: 40px;
            background-color: #FF8F2B;
            color: #fff;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
        `;
        document.body.appendChild(buttonElement)
        return buttonElement
    }

    // 自动评教
    async function autoEvaluate() {
        // 由于每次评价完上次页面DOM会被消毁，所以需要每次都获取allList，而不能用for去遍历allList！！！
        while (true) {
            const wpList = document.querySelectorAll('uni-view.wp') // 未评
            const wwcList = document.querySelectorAll('uni-view.wwc') // 未完成
            const allList = [...wpList, ...wwcList]
            if (allList.length === 0) {
                alert('已完成评教')
                return
            }
            const firstClassElement = allList[0].parentElement.parentElement.parentElement
            // console.log(firstClassElement)
            // 课程评教
            const kcpj = firstClassElement.querySelector('uni-view.box-hjjs-footer-kcpj')
            if (kcpj) {
                kcpj.click()
                await sleep(2000)
                if (document.querySelector('.box3-1')) {
                    await evaluate()
                }
                else {
                    document.querySelector('.header_left_back').click()
                }
                await sleep(1000)
            }
            // 教师评教
            const jspj = firstClassElement.querySelector('uni-view.box-hjjs-footer-jspj')
            if (jspj) {
                jspj.click()
                await sleep(500)
                document.evaluate("//uni-view[text()='评价']", document).iterateNext().click()
                await sleep(2000)
                await evaluate()
                await sleep(1000)
            }
            console.log("完成")
            await sleep(1500)
        }


        async function evaluate() {
            // .box2-1列表
            const box2List = document.querySelectorAll('uni-view.box2-1');

            // .box2中倒数两个是输入，前面的全是选择
            for (let i = 0; i < box2List.length - 3; i++) {
                const uniListCellList = box2List[i].querySelectorAll('.uni-list-cell');
                uniListCellList[0].click()
            }
            // 不能全选“完全符合”，最后一个选“符合”，也就是第二个选项
            {
                const uniListCellList = box2List[box2List.length - 3].querySelectorAll('.uni-list-cell');
                uniListCellList[1].click()
            }

            //给最后两个输入 “课堂氛围很好，老师很认真” 和 “无”
            {
                const textareaElement = box2List[box2List.length - 2].querySelector('textarea.uni-textarea-textarea');
                const event = new InputEvent('input');
                textareaElement.value = "课堂氛围很好，老师很认真";
                textareaElement.dispatchEvent(event);
            }
            {
                const textareaElement = box2List[box2List.length - 1].querySelector('textarea.uni-textarea-textarea');
                const event = new InputEvent('input');
                textareaElement.value = "无";
                textareaElement.dispatchEvent(event);
            }

            // 提交
            document.querySelector('.box3-1').click()
            await sleep(1000)
            document.querySelector(".confirm.btn").click();
        }
    }
})();
