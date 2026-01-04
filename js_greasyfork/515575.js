// ==UserScript==
// @name         jira task
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  take over the world!
// @author       You
// @match        http://work.xm.akubela.local/secure/PortfolioPlanView*
// @match        http://192.168.13.6/secure/PortfolioPlanView*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=akubela.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/515575/jira%20task.user.js
// @updateURL https://update.greasyfork.org/scripts/515575/jira%20task.meta.js
// ==/UserScript==

(function() {
    'use strict';

    chooseBranch()
    overTime()
})();

async function chooseBranch(){
    (function(){
        const modalStyle = `
        .branch-button {
          width: 200px;
          position: fixed;
          top: 30vh;
          right: 10px;
          background: #f0f0f0;
          border-radius: 8px;
          padding: 20px;
          font-weight:700;
          z-index: 9999999;
          user-select: none;
            li {
              list-style:none;
            }
            li + li {
              margin-top:20px;
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
            select{
              width: 100%;
              height: 30px;
              border-radius: 4px;
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

    const get = ()=>{
        return new Promise(async (resolve)=>{
            const result = await fetch('http://192.168.10.51:51081/api/jira/jiraTaskAbnormalSetting', {
                method: 'GET',
            })
            try {
                const res = await result.json()
                resolve(res)
            } catch (e) {
                resolve({result:[]})
            }
        })
    }

    const post = (data)=>{
        fetch('http://192.168.10.51:51081/api/jira/jiraTaskAbnormal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }

    const getMember = async()=>{
        const memberRes = await fetch('http://192.168.10.51:51081/api/task/getTerminalMember', {
            method: 'GET',
        })
        const member = await memberRes.json()

        return member.result
    }

    const webhook = (data)=>{
        fetch('http://192.168.10.51:51081/api/task/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }

    const newButtonNode = document.createElement("div");
    newButtonNode.classList.add("branch-button")
    newButtonNode.id = 'draggable'
    document.body.appendChild(newButtonNode)

    makeDraggable('draggable');

    const newSettingNode = document.createElement("div");
    newSettingNode.classList.add("branch-setting")
    document.body.appendChild(newSettingNode)

    const selectHtml = document.createElement("li")

    const { result } = await get()

    const settingmap = {}

    result.forEach(item=>{
        settingmap[item.abnormal_key] = item.label
    })

    const members = await getMember()

    selectHtml.innerHTML = `
      <select id="mySelect">
        ${result.map(item=>`<option value="${item.abnormal_key}">${item.label}</option>`).join('')}
      </select>
    `

    newButtonNode.appendChild(selectHtml)

    const newLi = document.createElement("li")
    newLi.innerHTML = `<button id="submit">提交</button><br><button id="date" style="margin-top:10px">日期同步</button>`
    newButtonNode.appendChild(newLi)

    document.getElementById('submit').addEventListener('click',()=>{
        const msg = `确认提交？`;
        if (confirm(msg)==true){
            let selectBox = document.getElementById('mySelect');
            const text = document.querySelector('[aria-label="计划标题"]').textContent
            const regex = /(.+?)的计划/;
            const match = text.match(regex);
            if (match) {
                const name = match[1]; // 提取的名称
                members.forEach(item=>{
                    if(item.username.includes(name)){
                        settingmap[selectBox]
                        post({
                            user:item.username,
                            abnormal_type:selectBox.value||''
                        })
                        webhook({
                            content:settingmap[selectBox.value],
                            robot:item.robot
                        })
                    }
                })
            }
        }
    })

    document.getElementById('date').addEventListener('click',()=>{
        const timer = 10

        const t = setInterval(async ()=>{
            if(document.querySelector('[data-name="section-Target start"]')){
                clearInterval(t)
                const list = document.querySelector('[data-name="section-Target end"]').querySelector('[role="rowgroup"]')
                let child = Array.from(list.childNodes)
                child = child.map(item=>item.outerText)

                const handle = document.querySelector('[data-name="section-Due date"]').querySelector('[role="rowgroup"]')
                let handleChild = Array.from(handle.childNodes)

                for (let index = 0; index < handleChild.length; index++) {
                    const item = handleChild[index];
                    if(child[index]){

                        const diff = getMonthDifference(child[index],item.outerText);

                        const day = getDayFromDate(child[index])

                        item.querySelector('input').click()
                        await delay(()=>{},timer)
                        const button = document.querySelector('[aria-label="calendar"]').querySelectorAll('button')
                        if(diff>0){
                            for (const element of new Array(Math.abs(diff))) {
                                button[0].click()
                                await delay(()=>{},timer)
                            }

                        }else if(diff<0){
                            for (const element of new Array(Math.abs(diff))) {
                                button[0].click()
                                await delay(()=>{},timer)
                            }
                        }
                        const td = document.querySelector('[aria-label="calendar"]').querySelectorAll('td')

                        let handletaTag = false

                        for(let i of Array.from(td)){
                            console.log(i.outerText)
                            if(i.outerText==='1'){
                                handletaTag = true
                            }
                            if(handletaTag&&+i.outerText&&+day===+i.outerText){
                                i.click()
                                handletaTag = false
                            }

                        }
                        //await delay(()=>{},5000)
                        //item.querySelector('input').value = child[index]

                        console.log(item,item.querySelector('input').value)

                    }

                }
            }



        },300)
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

function getMonthDifference(date1Str, date2Str = '') {
    // 将日期字符串解析为 Date 对象
    const parseDate = (dateStr) => {
        const [day, monthStr, year] = dateStr.split('/');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames.indexOf(monthStr);
        return new Date(`20${year}`, month, day); // 假设年份格式是 'YY'，需要转换为 '20YY'
    };

    const date1 = parseDate(date1Str);
    const date2 = date2Str ? parseDate(date2Str) : new Date(); // 如果 date2Str 为空，使用当前日期

    // 计算年份和月份的差值
    const yearDiff = date2.getFullYear() - date1.getFullYear();
    const monthDiff = date2.getMonth() - date1.getMonth();

    // 返回总的月份差的绝对值
    return yearDiff * 12 + monthDiff
}

function getDayFromDate(dateStr = '') {
    // 如果没有传入 dateStr，返回当前日期的日部分
    if (!dateStr) {
        return new Date().getDate(); // 获取当前日期的日
    }

    // 解析 'DD/Mon/YY' 格式的字符串
    const [day, monthStr, year] = dateStr.split('/');
    return parseInt(day, 10); // 返回日部分（整数）
}

function delay(fn, ms) {
    return new Promise(async resolve => {
        await new Promise(resolve => setTimeout(resolve, ms));
        resolve(fn());
    });
}

async function overTime(){
    const getData = async () => {
        return new Promise(async (resolve) => {
            const result = await fetch(`http://192.168.10.51:51081/api/jira/getJiraPlan`, {
                method: 'GET',
            })

            try {
                let res = await result.json()
                if(res.code===500){
                    resolve({result:false})
                    return
                }
                resolve(res)

            } catch (e) {
                resolve('')
            }
        })
    }

    const {result=[]} = await getData()

    if(!result)return

    const timeMap = {}

    result.forEach(item=>{
        timeMap[item.issuseid] = item.duedate
    })

    const t = setInterval(async ()=>{
        if(document.querySelector('[data-name="section-Due date"]')){
            clearInterval(t)

            const list = document.querySelector('[data-name="ScopeList"]').querySelector('[role="rowgroup"]')

            let child = Array.from(list.childNodes)
            child = child.map(item=>item.querySelector('a')?.textContent||'')

            child = child.map(item=>item.split('-').pop())

            const handle = document.querySelector('[data-name="section-Due date"]').querySelector('[role="rowgroup"]')
            let handleChild = Array.from(handle.childNodes)

            for (let index = 0; index < handleChild.length; index++) {
                const item = handleChild[index]
                const time = item.querySelector('input')?.value
                if(!time) continue
                const timeNum = new Date(time).getTime()
                const oldTtime = timeMap[child[index]]

                if(!oldTtime)continue
                const oldTimeNum = new Date(oldTtime).getTime()

                item.title = '原计划时间'+oldTtime

                if(timeNum>oldTimeNum){
                    item.children[0].style.background='red'
                }

            }
        }
    },300)

    }






















