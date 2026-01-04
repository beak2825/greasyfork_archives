// ==UserScript==
// @name         自动部署辅助脚本
// @namespace    wisen-autoDeployScript
// @version      1.2.0
// @description  用于一键化自动部署项目的辅助脚本
// @author       wisen
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @connect      test-console.cloud.oppoer.me
// @include      *://test-console.cloud.oppoer.me/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/433768/%E8%87%AA%E5%8A%A8%E9%83%A8%E7%BD%B2%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/433768/%E8%87%AA%E5%8A%A8%E9%83%A8%E7%BD%B2%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

window.onload = async () => {
    generateScriptBtn()
    async function start(btn) {
        // step 1 生成
        btn.click();
        await delay(3000)

        // step 2 点击确定按钮
        const confirmBtn = [...document.querySelectorAll('.el-dialog__footer button')].find(item=>item.innerText === '确定');
        confirmBtn && confirmBtn.click();

        await delay(3000);
        const allBtnFn = [()=>[...document.querySelectorAll('span.c-blue.cp')].find(item=>item.innerText === '流转下一阶段'), ()=>[...document.querySelectorAll('span.c-blue.cp')].find(item=>item.innerText === '提测'), ()=>[...document.querySelectorAll('span.c-blue.cp')].find(item=>item.innerText === '流转下一阶段'), ()=>[...document.querySelectorAll('span.c-blue.cp')].find(item=>item.innerText === '测试通过'), ()=>document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--mini.el-button--primary"), ()=>document.querySelector("#appVersionPipeline > div.el-dialog__wrapper.el-dialog-1300w > div > div.el-dialog__header > button")];

        let step = 0;
        // 异步迭代器
        // for await(const [step,text] of allBtnFn.map((fn,i)=>handleStep(fn,i))) {
        //   console.log(`第${step}步执行完成, 执行操作：${text}`)
        // }
        for (const fn of allBtnFn) {
            await handleStep(fn, step++);
        }
        // 跳转到部署页
        console.log('跳转到部署页');
        // location.pathname = '/deploy/deployment/deployChange';
        document.querySelector("#menusidbar > div:nth-child(4) > div:nth-child(1) > div:nth-child(2)").click();

        await delay(5000);

        await handleStep(()=>document.querySelector("#app > section > section > aside > div > div.el-scrollbar > div.scrollbar-wrapper.el-scrollbar__wrap > div > div > ul > li:nth-child(3) > div"))

        await delay(10000);

        await handleStep(()=>document.querySelector('tbody .cell label'))
        await delay(3000);

        console.log('勾选');
        document.querySelector("#deployChangeButton").click();

        await delay(10000);

        await handleStep(()=>document.querySelector("#confirmButton"));

        await delay(5000);

        document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--small.el-button--primary").click()

    }

    function delay(time) {
        return new Promise((reslove,reject)=>{
            setTimeout(()=>reslove('ready'), time)
        }
        )
    }

    function handleStep(getBtn, step) {
        console.log(getBtn.toString(), step)
        return new Promise((reslove,reject)=>{
            const timer = setInterval(()=>{
                const stepBtn = getBtn();
                if (stepBtn) {
                    stepBtn.click();
                    reslove([step, stepBtn.innerText])
                    clearInterval(timer);
                }
            }
            , 1000)
        }
        )
    }
    function generateScriptBtn(){
        const timer = setInterval(() => {
             const btns = [...document.querySelectorAll('button')].filter(item=>item.innerText === '生成版本');
            if(btns.length){
                btns.forEach(item => {
                    const btnEl = document.createElement('button');
                    btnEl.setAttribute('class', btns[0].getAttribute('class'));
                    btnEl.onclick = ()=>start(item)
                    btnEl.innerHTML = '<span>脚本生成</span>';
                    item.parentNode.appendChild(btnEl);
                })
               clearInterval(timer);
            }
        }, 5000)
    }
}