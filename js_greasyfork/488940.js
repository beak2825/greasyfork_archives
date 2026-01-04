// ==UserScript==
// @name         gitQuickOperation
// @namespace    http://tampermonkey.net/
// @version      2024.04.26
// @description  try to take over the world!
// @author       You
// @match        http://gitlab.fz.akubela.local/*/-/merge_requests*
// @match        http://gitlab.xm.akubela.local/*/-/merge_requests*
// @match        http://192.168.201.140/*/-/merge_requests*
// @match        http://192.168.13.5/*/-/merge_requests*
// @match        http://192.168.13.20/*/-/merge_requests*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=akubela.local
// @grant        none
// @license none
// @downloadURL https://update.greasyfork.org/scripts/488940/gitQuickOperation.user.js
// @updateURL https://update.greasyfork.org/scripts/488940/gitQuickOperation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const regex = /merge_requests.*merge_request|merge_request.*merge_requests/;

    if (!regex.test(window.location.href)||window.location.href.includes('change_branches')) {
        chooseBranch()
    } else {
        messageBranch()
    }

    // Your code here...
})();

function chooseBranch(){
    (function(){
        const modalStyle = `
        .branch-button {
          width: 105px;
          position: fixed;
          top: 30vh;
          right: 10px;
          background: #f0f0f0;
          border-radius: 8px;
          padding: 10px;
          font-weight:700;
          z-index: 500;
          transition: all 0.5s;
            li {
              list-style:none;
            }
            li + li {
              margin-top:10px;
            }
            button{
              width:100%;
              border:none;
              border-radius: 4px;
              background: #1f75cb;
              color:#fff;
              height:30px;
              line-height:30px;
            }
            button:focus{
              outline:none
            }
            button:active{
              opacity: .7
            }
        }

        .branch-setting {
          width: 300px;
          position: fixed;
          top: 30vh;
          right: -310px;
          background: #f0f0f0;
          border-radius: 8px;
          padding: 10px;
          font-weight:700;
          z-index: 500;
          transition: all 0.5s;
            li {
              list-style:none;
            }
            li + li {
              margin-top:10px;
            }
            input{
              width:100%;
              border:1px solid #1f75cb;
              padding:0 10px;
              height:30px;
              line-height:30px;
            }
            button{
              width:80px;
              border:none;
              border-radius: 4px;
              background: #1f75cb;
              color:#fff;
              height:30px;
              line-height:30px;
            }
            button:focus{
              outline:none
            }
            button:active{
              opacity: .7
            }
            button+button{
              margin-left:10px;
              background:#7d7d7d;
            }
        }
   `;
        const styleBlock = document.createElement('style');
        styleBlock.textContent = modalStyle;
        document.head.appendChild(styleBlock);
    })()

    const newButtonNode = document.createElement("div");
    newButtonNode.classList.add("branch-button")
    document.body.appendChild(newButtonNode)

    const newSettingNode = document.createElement("div");
    newSettingNode.classList.add("branch-setting")
    document.body.appendChild(newSettingNode)

    const project = [
        {
            label:'快速选择-1',
            id:'branch-handle-1'
        },{
            label:'快速选择-2',
            id:'branch-handle-2'
        },{
            label:'设置',
            id:'branch-setting'
        }
    ]

    project.forEach(item=>{
        const newLi = document.createElement("li")
        newLi.innerHTML = `<button id="${item.id}">${item.label}</button>`
        newButtonNode.appendChild(newLi)
    })

    const settingLi1 = document.createElement("li")
    settingLi1.innerHTML = `<input placeholder="Source branch-1" id="source-branch-1"/>`
    newSettingNode.appendChild(settingLi1)

    const settingLi2 = document.createElement("li")
    settingLi2.innerHTML = `<input placeholder="Target branch-1" id="target-branch-1"/>`
    newSettingNode.appendChild(settingLi2)

    const settingLi3 = document.createElement("li")
    settingLi3.innerHTML = `<input placeholder="Source branch-2" id="source-branch-2"/>`
    newSettingNode.appendChild(settingLi3)

    const settingLi4 = document.createElement("li")
    settingLi4.innerHTML = `<input placeholder="Target branch-2" id="target-branch-2"/>`
    newSettingNode.appendChild(settingLi4)

    const settingLi5 = document.createElement("li")
    settingLi5.innerHTML = `<button id="setting-submit">确认</button><button id="setting-cancle">取消</button>`
    newSettingNode.appendChild(settingLi5)

    document.getElementById('source-branch-1').value = localStorage.getItem('source-branch-1') || ''
    document.getElementById('target-branch-1').value = localStorage.getItem('target-branch-1') || ''

    document.getElementById('source-branch-2').value = localStorage.getItem('source-branch-2') || ''
    document.getElementById('target-branch-2').value = localStorage.getItem('target-branch-2') || ''

    document.getElementById('branch-handle-1').addEventListener('click',async ()=>{
        await delay(()=>{
            const originV = document.querySelector('[data-field-name="merge_request[source_branch]"]').textContent
            if(originV!==document.getElementById('source-branch-1').value){
                document.querySelector('.js-source-branch').click()
            }
        }, 0)
        await delay(()=>{
            const originV = document.querySelector('[data-field-name="merge_request[source_branch]"]').textContent
            const aDom = document.querySelectorAll(`a[data-ref="${document.getElementById('source-branch-1').value}"]`)?.[0]
            if(aDom && originV!==document.getElementById('source-branch-1').value){
                aDom.click()
            }
        }, 300)
        await delay(()=>{
            const originV = document.querySelector('[data-field-name="merge_request[target_branch]"]').textContent
            if(originV!==document.getElementById('target-branch-1').value){
                document.querySelector('.js-target-branch').click()
            }
        }, 300)
        await delay(()=>{
            const originV = document.querySelector('[data-field-name="merge_request[target_branch]"]').textContent
            const aDom = document.querySelectorAll(`a[data-ref="${document.getElementById('target-branch-1').value}"]`)?.[1] || document.querySelectorAll(`a[data-ref="${document.getElementById('target-branch-1').value}"]`)?.[0]
            if(aDom && originV!==document.getElementById('target-branch-1').value){
                aDom.click()
            }
        }, 300)
    })

    document.getElementById('branch-handle-2').addEventListener('click',async ()=>{
        await delay(()=>{
            const originV = document.querySelector('[data-field-name="merge_request[source_branch]"]').textContent
            if(originV!==document.getElementById('source-branch-2').value){
                document.querySelector('.js-source-branch').click()
            }
        }, 0)
        await delay(()=>{
            const originV = document.querySelector('[data-field-name="merge_request[source_branch]"]').textContent
            const aDom = document.querySelectorAll(`a[data-ref="${document.getElementById('source-branch-2').value}"]`)?.[0]
            if(aDom && originV!==document.getElementById('source-branch-2').value){
                aDom.click()
            }
        }, 200)
        await delay(()=>{
            const originV = document.querySelector('[data-field-name="merge_request[target_branch]"]').textContent
            if(originV!==document.getElementById('target-branch-2').value){
                document.querySelector('.js-target-branch').click()
            }
        }, 200)
        await delay(()=>{
            const originV = document.querySelector('[data-field-name="merge_request[target_branch]"]').textContent
            const aDom = document.querySelectorAll(`a[data-ref="${document.getElementById('target-branch-2').value}"]`)?.[1] || document.querySelectorAll(`a[data-ref="${document.getElementById('target-branch-2').value}"]`)?.[0]
            if(aDom && originV!==document.getElementById('target-branch-2').value){
                aDom.click()
            }
        }, 200)
    })

    document.getElementById('branch-setting').addEventListener('click',()=>{
        newButtonNode.style.right = '-115px'
        newSettingNode.style.right = '10px'
    })
    document.getElementById('setting-submit').addEventListener('click',()=>{
        newButtonNode.style = ''
        newSettingNode.style = ''
        localStorage.setItem('source-branch-1',document.getElementById('source-branch-1').value)
        localStorage.setItem('target-branch-1',document.getElementById('target-branch-1').value)

        localStorage.setItem('source-branch-2',document.getElementById('source-branch-2').value)
        localStorage.setItem('target-branch-2',document.getElementById('target-branch-2').value)
    })
    document.getElementById('setting-cancle').addEventListener('click',()=>{
        newButtonNode.style = ''
        newSettingNode.style = ''
    })
}

function messageBranch(){
    (function(){
        const modalStyle = `
        .mes-button {
          width: 95px;
          position: fixed;
          top: 30vh;
          right: 10px;
          background: #f0f0f0;
          border-radius: 8px;
          padding: 10px;
          font-weight:700;
          z-index: 500;
          transition: all 0.5s;
            li {
              list-style:none;
            }
            li + li {
              margin-top:10px;
            }
            button{
              width:100%;
              border:none;
              border-radius: 4px;
              background: #1f75cb;
              color:#fff;
              height:30px;
              line-height:30px;
            }
            button:focus{
              outline:none
            }
            button:active{
              opacity: .7
            }
        }

        .mes-setting {
          width: 300px;
          position: fixed;
          top: 30vh;
          right: -310px;
          background: #f0f0f0;
          border-radius: 8px;
          padding: 10px;
          font-weight:700;
          z-index: 500;
          transition: all 0.5s;
            li {
              list-style:none;
            }
            li + li {
              margin-top:10px;
            }
            input{
              width:100%;
              border:1px solid #1f75cb;
              padding:0 10px;
              height:30px;
              line-height:30px;
            }
            button{
              width:80px;
              border:none;
              border-radius: 4px;
              background: #1f75cb;
              color:#fff;
              height:30px;
              line-height:30px;
            }
            button:focus{
              outline:none
            }
            button:active{
              opacity: .7
            }
            button+button{
              margin-left:10px;
              background:#7d7d7d;
            }
        }
   `;
        const styleBlock = document.createElement('style');
        styleBlock.textContent = modalStyle;
        document.head.appendChild(styleBlock);
    })()

    const newButtonNode = document.createElement("div");
    newButtonNode.classList.add("mes-button")
    document.body.appendChild(newButtonNode)

    const newSettingNode = document.createElement("div");
    newSettingNode.classList.add("mes-setting")
    document.body.appendChild(newSettingNode)

    const project = [
        {
            label:'快速操作',
            id:'mes-handle'
        },{
            label:'设置',
            id:'mes-setting'
        }
    ]

    project.forEach(item=>{
        const newLi = document.createElement("li")
        newLi.innerHTML = `<button id="${item.id}">${item.label}</button>`
        newButtonNode.appendChild(newLi)
    })

    const settingLi0 = document.createElement("li")
    settingLi0.innerHTML = `<input placeholder="Rule" id="Rule"/>`
    newSettingNode.appendChild(settingLi0)

    const settingLi1 = document.createElement("li")
    settingLi1.innerHTML = `<input placeholder="Assignee" id="Assignee"/>`
    newSettingNode.appendChild(settingLi1)

    const settingLi2 = document.createElement("li")
    settingLi2.innerHTML = `<input placeholder="Reviewer" id="Reviewer"/>`
    newSettingNode.appendChild(settingLi2)

    const settingLi3 = document.createElement("li")
    settingLi3.innerHTML = `<button id="setting-submit">确认</button><button id="setting-cancle">取消</button>`
    newSettingNode.appendChild(settingLi3)

    document.getElementById('Rule').value = localStorage.getItem('Rule') || ''
    document.getElementById('Assignee').value = localStorage.getItem('Assignee') || ''
    document.getElementById('Reviewer').value = localStorage.getItem('Reviewer') || ''

    document.getElementById('mes-handle').addEventListener('click',async ()=>{
        let length
        await delay(()=>{
            const rule = document.getElementById('Rule').value
            if(rule){
                const ruleList = rule.split(';')
                const textlist = Array.from(document.querySelectorAll('a.commit-row-message.item-title.js-onboarding-commit-item')||[]).map(item=>item.text)
                const textRes = []
                const titleRes = []
                let bugRes = []
                const regex = /\b\d{5}\b/g
                textlist.forEach(text=>{
                    if(ruleList.some(r=>text.includes(r))){
                        textRes.push(text)
                    }
                    const matches = text.match(regex);
                    if (matches) {
                        bugRes = [...bugRes,...matches]
                    }
                    const t = ruleList.find(r=>text.includes(r))
                    if(t&&!titleRes.includes(t)){
                        titleRes.push(t)
                    }
                })
                document.querySelector('textarea').value = textRes.join('\n')
                document.querySelector('#merge_request_title').value = titleRes.join(';') + (bugRes.length ? `(bug:${bugRes.join(';')})` : '')
            }
        }, 0)
        await delay(()=>{
            if(document.getElementById('Assignee').value){
                document.querySelector('.js-assignee-search').click()
            }
        }, 200)
        await delay(()=>{
            const text = document.getElementById('Assignee').value
            let item
            length = document.querySelectorAll('strong.dropdown-menu-user-full-name.gl-font-weight-bold')?.length
            Array.from(document.querySelectorAll('strong.dropdown-menu-user-full-name.gl-font-weight-bold')).forEach(node=>{
                if (node.textContent.includes(text)) {
                    item = node
                }
            })
            if(item){
                item.click()
            }
        }, 200)
        await delay(()=>{
            if(document.getElementById('Reviewer').value){
                document.querySelector('.js-reviewer-search').click()
            }
        }, 200)
        await delay(()=>{
            const text = document.getElementById('Reviewer').value
            let item
            Array.from(document.querySelectorAll('strong.dropdown-menu-user-full-name.gl-font-weight-bold')).forEach((node,index)=>{
                if (node.textContent.includes(text) && index >= length) {
                    item = node
                }
            })
            if(item){
                item.click()
            }
        }, 200)
        await delay(()=>{
            if(document.querySelector('#merge_request_force_remove_source_branch')){
                document.querySelector('#merge_request_force_remove_source_branch').click()
            }
        }, 200)

    })
    document.getElementById('mes-setting').addEventListener('click',()=>{
        newButtonNode.style.right = '-105px'
        newSettingNode.style.right = '10px'
    })
    document.getElementById('setting-submit').addEventListener('click',()=>{
        newButtonNode.style = ''
        newSettingNode.style = ''
        localStorage.setItem('Rule',document.getElementById('Rule').value)
        localStorage.setItem('Assignee',document.getElementById('Assignee').value)
        localStorage.setItem('Reviewer',document.getElementById('Reviewer').value)
    })
    document.getElementById('setting-cancle').addEventListener('click',()=>{
        newButtonNode.style = ''
        newSettingNode.style = ''
    })
}

function delay(fn, ms) {
    return new Promise(async resolve => {
        await new Promise(resolve => setTimeout(resolve, ms));
        resolve(fn());
    });
}
