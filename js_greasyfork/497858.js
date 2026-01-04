// ==UserScript==
// @name         terminal-tool
// @namespace    http://tampermonkey.net/
// @version      2024-06-11
// @description  终端工具脚本
// @author       You
// @match        http://zentao.akuvox.local/zentao/bug-view-*.html
// @match        http://192.168.10.17/zentao/bug-view-*.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=akuvox.local
// @grant        none
// @license none
// @downloadURL https://update.greasyfork.org/scripts/497858/terminal-tool.user.js
// @updateURL https://update.greasyfork.org/scripts/497858/terminal-tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    chooseBranch()
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
          z-index: 9999999;
          user-select: none;
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
    newButtonNode.id = 'draggable'
    document.body.appendChild(newButtonNode)

    makeDraggable('draggable');

    const newSettingNode = document.createElement("div");
    newSettingNode.classList.add("branch-setting")
    document.body.appendChild(newSettingNode)

    const project = [
        {
            label:'快速关联',
            id:'branch-handle-1'
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
    settingLi1.innerHTML = `<input placeholder="项目ID" id="projectId"/>`
    newSettingNode.appendChild(settingLi1)

    const settingLi2 = document.createElement("li")
    settingLi2.innerHTML = `<input placeholder="分支" id="ref"/>`
    newSettingNode.appendChild(settingLi2)


    const settingLi5 = document.createElement("li")
    settingLi5.innerHTML = `<button id="setting-submit">确认</button><button id="setting-cancle">取消</button>`
    newSettingNode.appendChild(settingLi5)

    document.getElementById('projectId').value = localStorage.getItem('projectId') || ''
    document.getElementById('ref').value = localStorage.getItem('ref') || ''


    document.getElementById('branch-handle-1').addEventListener('click',async ()=>{
        const id = document.querySelector('#titlebar .heading .prefix strong')?.textContent||''
        const result = await fetch(`http://192.168.10.51:51081/api/gitlab/getGitUrlForCommit?id=${id}&projectId=${document.getElementById('projectId').value}&ref=${document.getElementById('ref').value}`, {
            method: 'GET',
        })
        const res = await result.json()
        if(res.result){
            const iframe = document.getElementById("modalIframe").contentWindow.document
            const iframeDocument = iframe.querySelector('.ke-edit').childNodes[0].contentWindow.document
            const iframDom = iframeDocument.querySelector('body').innerHTML
            const gitText = `<p><a href="${res.result}">${res.result}</a></p>`
            iframeDocument.querySelector('body').innerHTML = iframDom.replace('<p>请在此处描述该bug修复时提交&amp;合并的分支及revision号</p>',gitText)
        }else{
            alert('id未查询到git合并记录！')
        }

    })


    document.getElementById('branch-setting').addEventListener('click',()=>{
        newButtonNode.style.right = '-115px'
        newButtonNode.style.left = 'unset'
        newSettingNode.style.right = '10px'
    })
    document.getElementById('setting-submit').addEventListener('click',()=>{
        const savedPosition = JSON.parse(localStorage.getItem(`draggablePosition_draggable`))
        if (savedPosition) {
            newButtonNode.style.left = `${savedPosition.left}px`;
            newButtonNode.style.top = `${savedPosition.top}px`;
        }
        newSettingNode.style = ''
        localStorage.setItem('projectId',document.getElementById('projectId').value)
        localStorage.setItem('ref',document.getElementById('ref').value)

    })
    document.getElementById('setting-cancle').addEventListener('click',()=>{
        const savedPosition = JSON.parse(localStorage.getItem(`draggablePosition_draggable`))
        if (savedPosition) {
            newButtonNode.style.left = `${savedPosition.left}px`;
            newButtonNode.style.top = `${savedPosition.top}px`;
        }
        newSettingNode.style = ''
    })
}

function makeDraggable(id) {
    const draggable = document.getElementById(id);
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    // Load the saved position from localStorage
    const savedPosition = JSON.parse(localStorage.getItem(`draggablePosition_${id}`));
    if (savedPosition) {
        draggable.style.left = `${savedPosition.left}px`;
        draggable.style.top = `${savedPosition.top}px`;
    }

    draggable.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - draggable.offsetLeft;
        offsetY = e.clientY - draggable.offsetTop;
        draggable.style.cursor = 'grabbing';

        const onMouseMove = (e) => {
            if (isDragging) {
                draggable.style.left = `${e.clientX - offsetX}px`;
                draggable.style.top = `${e.clientY - offsetY}px`;
            }
        };

        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                draggable.style.cursor = 'grab';

                // Save the current position to localStorage
                const position = {
                    left: draggable.offsetLeft,
                    top: draggable.offsetTop
                };
                localStorage.setItem(`draggablePosition_${id}`, JSON.stringify(position));

                // Remove the event listeners
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    window.addEventListener("beforeunload", () => {
        if (isDragging) {
            const position = {
                left: draggable.offsetLeft,
                top: draggable.offsetTop
            };
            localStorage.setItem(`draggablePosition_${id}`, JSON.stringify(position));
        }
    });
}

function delay(fn, ms) {
    return new Promise(async resolve => {
        await new Promise(resolve => setTimeout(resolve, ms));
        resolve(fn());
    });
}