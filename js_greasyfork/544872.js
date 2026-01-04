// ==UserScript==
// @name         zentao4HAT-2
// @namespace    http://www.akuvox.com/
// @version      1.37
// @description  take on the world!
// @author       andy.wang
// @match        http://192.168.10.17/zentao/bug-browse*.html*
// @match        http://192.168.10.17/zentao/bug-view-*.html*
// @match        http://192.168.10.17/zentao/bug-edit-*.html*
// @match        http://192.168.10.17/zentao/story-view-*.html*
// @match        http://192.168.10.17/zentao/build-view-*.html*
// @match        http://192.168.10.17/zentao/testtask-create*.html*
// @match        http://192.168.10.17/zentao/testtask-edit*.html*

// @match        http://zentao.akuvox.local/zentao/bug-browse*.html*
// @match        http://zentao.akuvox.local/zentao/bug-view-*.html*
// @match        http://zentao.akuvox.local/zentao/bug-edit-*.html*
// @match        http://zentao.akuvox.local/zentao/story-view-*.html*
// @match        http://zentao.akuvox.local/zentao/build-view-*.html*
// @match        http://zentao.akuvox.local/zentao/testtask-create*.html*
// @match        http://zentao.akuvox.local/zentao/testtask-edit*.html*

// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/544872/zentao4HAT-2.user.js
// @updateURL https://update.greasyfork.org/scripts/544872/zentao4HAT-2.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    if (!window.location.href.includes('bug-edit-')) {
        await zentaoAssociate().then(async () => {
            await zentaoScore()
        })
    }
    zentaoScoreDialog()
    if (window.location.href.includes('bug-edit-')) {
        createWriteButton()
    }

})();
async function zentaoAssociate(){
    style()


    if(window.location.href.includes('bug-view-')||window.location.href.includes('story-view-')){
        const bugid = document.getElementById('titlebar').querySelector('strong').textContent
        const post = ()=>{
            const needModels = []
            const resovedModels = []
            const assignedto = userInput.value
            const title = document.getElementById('titlebar').querySelectorAll('strong')[1].textContent
            for(let key in result.allcheck){
                if(result.allcheck[key]){
                    needModels.push(key)
                }
            }
            for(let key in result.solved){
                if(result.solved[key]&&result.allcheck[key]){
                    resovedModels.push(key)
                }
            }
            fetch('http://192.168.10.51:63183/postbugctrl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bugid,
                    title,
                    url:window.location.href,
                    needModels:needModels.join(','),
                    resovedModels:resovedModels.join(','),
                    assignedto,
                    finish:arraysEqual(needModels,resovedModels)
                })
            })
        }

        const get = async()=>{
            const sql = `SELECT * FROM modelctrl WHERE bugid = '${bugid}'`
            return new Promise(async (resolve)=>{
                const result = await fetch(`http://192.168.10.51:63183/getbugctrl`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sql
                    })
                })

                try {
                    let res = await result.text()
                    res = res?JSON.parse(res):{}
                    resolve(res)
                } catch (e) {
                    resolve([])
                }
            })
        }

        const change = async()=>{
            const needModels = []
            const resovedModels = []
            const assignedto = userInput.value
            for(let key in result.allcheck){
                if(result.allcheck[key]){
                    needModels.push(key)
                }
            }
            for(let key in result.solved){
                if(result.solved[key]&&result.allcheck[key]){
                    resovedModels.push(key)
                }
            }
            const sql = `UPDATE modelctrl SET  needModels='${needModels.join(',')}',resovedModels='${resovedModels.join(',')}',assignedto='${assignedto}',finish='${arraysEqual(needModels,resovedModels)}' WHERE bugid = '${bugid}'`
            return new Promise(async (resolve)=>{
                const result = await fetch(`http://192.168.10.51:63183/getbugctrl`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sql
                    })
                })

                try {
                    let res = await result.text()
                    res = res?JSON.parse(res):{}
                    resolve(res)
                } catch (e) {
                    resolve([])
                }
            })
        }

        const deviceListy = ['无需','HA','31','41','42','51','251','52','53','61','161','71','81','1001','933','119']

        const container = document.getElementsByClassName('main-side')[0]
        const tabs = document.createElement('div');

        const table = document.createElement('table');

        const tr1 = document.createElement('tr');
        const td11 = document.createElement('th');
        const td12 = document.createElement('td');

        td11.textContent = '需管控机型'
        td11.width="80px"
        let deviceDom = ''
        deviceListy.forEach(item=>{
            deviceDom+=`<label class="device"><input type="checkbox" name="devices" value="${item}"/><span>${item}</span></label>`
        })
        td12.innerHTML = deviceDom

        let checkboxs = td12.querySelectorAll("input[name='devices']")
        let solvedCheckboxs = []
        let userInput

        const sqlresult = await get()

        let isEdit = !!sqlresult.bugid

        let result = {
            allcheck:{},
            solved:{},
        }

        if(sqlresult.needModels){
            const needModelsArray = sqlresult.needModels.split(',')
            deviceListy.forEach(key=>{
                result.allcheck[key] = needModelsArray.includes(key)
            })
            if(sqlresult.resovedModels){
                const resovedModelsArray = sqlresult.resovedModels.split(',')
                needModelsArray.forEach(key=>{
                    result.solved[key] = resovedModelsArray.includes(key)
                })
            }
        }

        let oldReult

        const clickEvent = (index)=>{
            if(result.allcheck[checkboxs[index].value]){
                checkboxs[index].parentNode.style=""
                checkboxs[index].style="display:none"
                checkboxs[index].disabled = true
            }else{
                checkboxs[index].parentNode.style="display:none"
            }

            checkboxs[index].addEventListener('click', function(e) {
                result.allcheck[e.target.value] = e.target.checked
                let solvedDom = ''
                deviceListy.forEach(key=>{
                    if(result.allcheck[key]){
                        solvedDom += `<label class="device"><input type="checkbox" name="solved" value="${key}" ${result.solved[key]?'checked="false"':''}/><span>${key}</span></label>`
                    }
                })

                td22.innerHTML = solvedDom

                solvedCheckboxs = td22.querySelectorAll("input[name='solved']")

                const solvedClickEvent = (sIndex)=>{
                    solvedCheckboxs[sIndex].addEventListener('click', function(se) {
                        result.solved[se.target.value] = se.target.checked
                    })
                }

                for (let i = 0; i < solvedCheckboxs.length; i++) {
                    solvedClickEvent(i)
                }
            });
        }

        for (let i = 0; i < checkboxs.length; i++) {
            clickEvent(i)
        }

        tr1.appendChild(td11);
        tr1.appendChild(td12);
        table.appendChild(tr1)

        const tr2 = document.createElement('tr');
        const td21 = document.createElement('th');
        const td22 = document.createElement('td');

        let solvedDom = ''
        deviceListy.forEach(key=>{
            if(result.allcheck[key]){
                solvedDom += `<label class="device" style="${result.solved[key]?'':'display:none'}"><input type="checkbox" name="solved" value="${key}" style="display:none" disabled="true"/><span>${key}</span></label>`
            }
        })

        td22.innerHTML = solvedDom
        solvedCheckboxs = td22.querySelectorAll("input[name='solved']")

        const solvedClickEvent = (sIndex)=>{
            solvedCheckboxs[sIndex].addEventListener('click', function(se) {
                result.solved[se.target.value] = se.target.checked
            })
        }

        for (let i = 0; i < solvedCheckboxs.length; i++) {
            solvedClickEvent(i)
        }

        td21.textContent = '已解决机型'
        td21.width="80px"

        tr2.appendChild(td21);
        tr2.appendChild(td22);
        table.appendChild(tr2)

        const tr3 = document.createElement('tr');
        const td31 = document.createElement('th');
        const td32 = document.createElement('td');

        td32.innerHTML = `<label class="user"><input type="text" name="user"/></label>`

        userInput = td32.querySelector("input[name='user']")
        userInput.disabled = true

        userInput.value = sqlresult.assignedto||''

        tr3.appendChild(td31);
        tr3.appendChild(td32);
        table.appendChild(tr3)

        //td31.textContent = '负责人'
        //td31.width="80px"

        const button = document.createElement('div');
        const editButton = document.createElement('span');
        const submitButton = document.createElement('span');
        const cancelButton = document.createElement('span');

        submitButton.style="display:none"
        cancelButton.style="display:none"

        button.classList.add('button')

        editButton.textContent = "编辑"
        submitButton.textContent = "提交"
        cancelButton.textContent = "取消"

        editButton.addEventListener('click', function(e) {
            editButton.style="display:none"
            submitButton.style=""
            cancelButton.style=""
            userInput.disabled = true

            oldReult = JSON.parse(JSON.stringify(result))

            for (let i = 0; i < checkboxs.length; i++) {
                checkboxs[i].disabled = false
                checkboxs[i].parentNode.style=""
                checkboxs[i].style=""
                checkboxs[i].checked = result.allcheck[checkboxs[i].value]
            }
            for (let i = 0; i < solvedCheckboxs.length; i++) {
                solvedCheckboxs[i].disabled = false
                solvedCheckboxs[i].parentNode.style=""
                solvedCheckboxs[i].style=""
                solvedCheckboxs[i].checked = result.solved[solvedCheckboxs[i].value]
            }
        })
        submitButton.addEventListener('click', function(e) {
            editButton.style=""
            submitButton.style="display:none"
            cancelButton.style="display:none"
            userInput.disabled = true

            if(isEdit){
                change()
            }else{
                post()
                isEdit = true
            }

            for (let i = 0; i < checkboxs.length; i++) {
                checkboxs[i].disabled = true
                if(result.allcheck[checkboxs[i].value]){
                    checkboxs[i].parentNode.style=""
                    checkboxs[i].style="display:none"
                }else{
                    checkboxs[i].parentNode.style="display:none"
                }
            }
            for (let i = 0; i < solvedCheckboxs.length; i++) {
                solvedCheckboxs[i].disabled = true
                if(result.solved[solvedCheckboxs[i].value]){
                    solvedCheckboxs[i].parentNode.style=""
                    solvedCheckboxs[i].style="display:none"
                }else{
                    solvedCheckboxs[i].parentNode.style="display:none"
                }
            }
        })
        cancelButton.addEventListener('click', function(e) {
            editButton.style=""
            submitButton.style="display:none"
            cancelButton.style="display:none"
            userInput.disabled = true

            result = JSON.parse(JSON.stringify(oldReult))

            for (let i = 0; i < checkboxs.length; i++) {
                checkboxs[i].disabled = true
                if(result.allcheck[checkboxs[i].value]){
                    checkboxs[i].parentNode.style=""
                    checkboxs[i].style="display:none"
                }else{
                    checkboxs[i].parentNode.style="display:none"
                }
            }
            for (let i = 0; i < solvedCheckboxs.length; i++) {
                solvedCheckboxs[i].disabled = true
                if(result.solved[solvedCheckboxs[i].value]){
                    solvedCheckboxs[i].parentNode.style=""
                    solvedCheckboxs[i].style="display:none"
                }else{
                    solvedCheckboxs[i].parentNode.style="display:none"
                }
            }
        })

        button.appendChild(editButton)
        button.appendChild(submitButton)
        button.appendChild(cancelButton)

        tabs.appendChild(button)
        tabs.appendChild(table)

        tabs.classList.add("tabs");
        tabs.classList.add("associate");
        container.appendChild(tabs);
    }else{

        const get = async()=>{
            const sql = `SELECT * FROM modelctrl WHERE finish='false' AND ${modelName==='所有机型'?'1=1':`needModels like '%${modelName}%'`}`
            return new Promise(async (resolve)=>{
                const result = await fetch(`http://192.168.10.51:63183/getbugctrl`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sql
                    })
                })

                try {
                    let res = await result.text()
                    res = res?JSON.parse(res):[]
                    const resTable = Array.isArray(res)?res:[res]
                    resolve(resTable)
                } catch (e) {
                    resolve([])
                }
            })
        }

        const modelTable = document.getElementsByClassName('table-borderless')[0]

        const modelTr = modelTable?modelTable.getElementsByTagName('tr'):[]

        let modelName = ''

        for(let i in modelTr){
            const item = modelTr[i]
            if(item.innerText&&item.innerText.includes('所属机型')){
                modelName=item.children[1].textContent
            }
        }

        const navTabs = document.getElementsByClassName('nav-tabs')[0]
        const tabsLi = document.createElement('li');
        tabsLi.innerHTML ='<a href="#legacyBugs" data-toggle="tab"><i class="icon-bug red"></i>机型遗留问题</a>'
        navTabs&&navTabs.appendChild(tabsLi);

        const tabContent = document.getElementsByClassName('tab-content')[0]
        const tabPane = document.createElement('div');
        tabPane.classList.add('tab-pane')
        tabPane.id = 'legacyBugs'

        const table = document.createElement('table');
        table.classList.add('table','table-hover','table-condensed','table-striped','tablesorter','table-fixed')

        const thead = document.createElement('thead');
        thead.innerHTML =
            '<tr><th class="w-id">ID</th>'+
            '<th>标题</th>'+
            '<th class="w-100px">创建日期</th>'+
            '<th class="w-100px">管控机型</th>'+
            '<th class="w-100px">已解决机型</th></tr>'

        const tbody = document.createElement('tbody');

        const result = await get()
        let tbodyhtml = ''
        result.forEach(item=>{
            tbodyhtml +=
                '<tr class="text-center">'+
                `<td>${item.bugid}</td>`+
                `<td><a href="${item.url}">${item.title}</a></td>`+
                `<td>${item.tdate.split('T')[0]}</td>`+
                `<td>${item.needModels}</td>`+
                `<td>${item.resovedModels}</td></tr>`
        })

        tbody.innerHTML = tbodyhtml

        table.appendChild(thead);
        table.appendChild(tbody);
        tabPane.appendChild(table);
        tabContent&&tabContent.appendChild(tabPane);

    }

    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }

        const set1 = new Set(arr1);
        const set2 = new Set(arr2);

        for (const item of set1) {
            if (!set2.has(item)) {
                return false;
            }
        }

        return true;
    }

    function style(){
        const modalStyle = `
        .associate{
           border: 1px solid #ddd;
           padding: 10px 10px;
        }

        .associate th{
           font-weight: normal;
           color: #444;
           padding: 3px 8px 3px 0;
           vertical-align: top;
        }

        .device{
           margin:0 10px 5px 0
        }

        .device span{
           margin-left:5px;
           display: inline-block;
           width: 40px;
        }

        .user input{
           border: none;
           border-bottom: 1px solid #cfcfcf;
           padding: 0;
           width: 200px;
           max-width: 100%;
           outline-color: #00000000;
        }
        .button{
           text-align: right;
           color: #036;
        }
        .button span{
           cursor: pointer;
        }
        .button span:active{
           opacity: .7;
        }
        .button span+span{
           margin-left:5px;
        }
        input:disabled {
           background: #fff;
           border: none;
           color: #141414;
           font-weight: 700;
           padding-left: 5px;
           font-size: 14px;
        }
        input[type=checkbox]{
           margin-top: 0;
           position: relative;
           top: 2px;
        }
   `;

        const styleBlock = document.createElement('style');
        styleBlock.textContent = modalStyle;
        document.head.appendChild(styleBlock);
    }
}

async function zentaoScoreDialog(){

    const resolve = document.getElementsByClassName('icon-bug-resolve')

    let isSubmit = false

    resolve&&resolve.length&&Array.from(resolve).forEach(item=>{
        item.parentNode.addEventListener('click', function() {
            isSubmit = true
        });
    })

    // 配置观察器以监视弹窗的添加，然后操作
    var observer = new MutationObserver(function(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var addedNode of mutation.addedNodes) {
                    if (addedNode.id === "ajaxModal") {
                        observer.disconnect();
                        iframeInit()
                        break;
                    }
                }
            }
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });


    function iframeInit(){
        document.getElementById("modalIframe").addEventListener("load", function() {
            const iframe = document.getElementById("modalIframe").contentWindow.document
            style(iframe)
            // 配置观察器以监视子节点button的添加，然后操作
            var observer = new MutationObserver(function(mutationsList) {
                for (var mutation of mutationsList) {
                    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                        const button = iframe.getElementById("submit")
                        if (button&&isSubmit) {
                            isSubmit = false
                            setIframe()
                            observer.disconnect();
                        }
                        break;
                    }
                }
            });

            observer.observe(iframe, { childList: true, subtree: true });
        });

    }

    function setIframe(){
        const iframe = document.getElementById("modalIframe").contentWindow.document
        const commentTr = iframe.getElementById("comment").parentNode.parentNode
        const nextSibling = commentTr.nextSibling;
        const parent = commentTr.parentNode

        const buttonElement = document.createElement("tr");

        const buttonThElement = document.createElement("th");
        buttonThElement.textContent = "自动关联git链接";

        const buttonTdElement = document.createElement("td");
        const gitButton = document.createElement("button");

        gitButton.textContent = "关联";
        gitButton.classList.add("btn");
        gitButton.classList.add("btn-primary");

        gitButton.addEventListener('click', async(event)=>{
            event.preventDefault()
            const gitUrl = await getGitUrl()
            if(gitUrl?.result?.length){
                const iframe = document.getElementById("modalIframe").contentWindow.document
                const iframeDocument = iframe.querySelector('.ke-edit').childNodes[0].contentWindow.document
                const iframDom = iframeDocument.querySelector('body').innerHTML
                const gitText = gitUrl.result.map(item=>`<p><a href="${item}">${item}</a></p>`).join('')
                iframeDocument.querySelector('body').innerHTML = iframDom.replace('<p>请在此处描述该bug修复时提交&amp;合并的分支及revision号</p>',gitText)
            }else{
                alert('id未查询到git合并记录！')
            }
        })

        buttonTdElement.appendChild(gitButton);

        buttonElement.appendChild(buttonThElement);
        buttonElement.appendChild(buttonTdElement);

        if (nextSibling) {
            parent.insertBefore(buttonElement, nextSibling);
        } else {
            parent.appendChild(buttonElement);
        }

        const submitButton = iframe.getElementById("submit")

        submitButton&&submitButton.addEventListener('click', function() {
            const titlebarElement = document.getElementById("titlebar");

            //const inputElement = iframe.getElementById("bugTime");
            const repair_time = 0;

            const valueElement = titlebarElement.querySelector(".prefix strong");

            const radioElements = iframe.getElementsByName("bug")

            let bugid = valueElement.innerText
            let type = ''
            let title = ''
            let score = ''

            parent.removeChild(buttonElement)
        });
    }

    const posturl = async(bugid, type, title, score, repair_time)=>{
        return new Promise(async (resolve)=>{
            const result = await fetch(`http://192.168.10.51:63183/postscoreurl`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bugid,
                    type,
                    title,
                    score,
                    repair_time
                })
            })
            })
    }

    const getGitUrl = async()=>{
        return new Promise(async (resolve)=>{
            const id = document.querySelector('#titlebar .heading .prefix strong').textContent
            const result = await fetch(`http://192.168.10.51:51081/api/gitlab/getGitUrl?id=${id}`, {
                method: 'GET',
            })

            try {
                let res = await result.json()
                resolve(res)
            } catch (e) {
                resolve('')
            }
        })
    }

    function style(iframeDocument){
        const modalStyle = `
        .bug-label {
          margin-left:15px
        }
        .bug-label input {
          margin-right:5px;
          position:relative;
          top:2px
        }
        .bug-list {
          margin-top:10px
        }
        .bug-select {
          width:100px
        }
        .bug-time{
          margin:10px
        }
   `;

        const styleBlock = iframeDocument.createElement('style');
        styleBlock.textContent = modalStyle;
        iframeDocument.head.appendChild(styleBlock);
    }
}

async function zentaoScore(){
    const titlebarElement = document.getElementById("titlebar");
    const valueElement = titlebarElement.querySelector(".prefix strong");
    const bugid = valueElement.innerText

    const get = ()=>{
        return new Promise(async (resolve)=>{
            const result = await fetch(`http://192.168.10.51:63183/getscoreurl?bugid=${bugid}`, {
                method: 'GET',
            })

            try {
                let res = await result.text()
                res = res?JSON.parse(res):{type:0,repair_time:''}
                const resTable = Array.isArray(res)?res:[res]
                resolve(resTable.length?resTable:[{type:0,repair_time:''}])
            } catch (e) {
                resolve([{type:0,repair_time:''}])
            }
        })
    }

    const result = await get()

    const tabs = document.createElement('div');
    const container = document.getElementsByClassName('main-side')[0]
    style()
    /*
    tabs.style="border:1px solid #ddd;padding:10px"
    tabs.innerHTML=`
        <div style="text-align: right;color: #036;"><span class="scoreButton" style="cursor: pointer;" id="bugSubmit">提交</span></div>
        <div>
        BUG原因:<br>
         <label class="bug-label" for="bug1"><input id="bug1" type="radio" name="bug" value="0" ${result[0].type===0 ? "checked='checked'" : "" } />无特殊原因</label><br>
        <label class="bug-label" for="bug2"><input id="bug2" type="radio" name="bug" value="1" ${result[0].type===1 ? "checked='checked'" : "" } />需求设计问题</label><br>
        <label class="bug-label" for="bug3"><input id="bug3" type="radio" name="bug" value="2" ${result[0].type===2 ? "checked='checked'" : "" } />上个版本已存在</label><br>
        <label class="bug-label" for="bug4"><input id="bug4" type="radio" name="bug" value="3" ${result[0].type===3 ? "checked='checked'" : "" } />无自测条件</label><br>
        <label class="bug-label" for="bug5"><input id="bug5" type="radio" name="bug" value="4" ${result[0].type===4 ? "checked='checked'" : "" } />外部因素</label><br>
        <label class="bug-label" for="bug6"><input id="bug6" type="radio" name="bug" value="5" ${result[0].type===5 ? "checked='checked'" : "" } />无测试用例</label><br>
        <label class="bug-label" for="bug7"><input id="bug7" type="radio" name="bug" value="6" ${result[0].type===6 ? "checked='checked'" : "" } />已知技术风险点</label><br>
        <label class="bug-label" for="bug8"><input id="bug8" type="radio" name="bug" value="7" ${result[0].type===7 ? "checked='checked'" : "" } />重复bug</label>

        </div>
        <div id="list1" class="bug-list">
        BUG系数:
        <select id="select1" class="bug-select">
            <option value="0">0</option>
    <option value="0.1">0.1</option>
    <option value="0.2">0.2</option>
    <option value="0.3">0.3</option>
    <option value="0.4">0.4</option>
    <option value="0.5">0.5</option>
    </select>
    </div>
    `

    container.appendChild(tabs);

    //const inputElement = document.getElementById("bugTime");
    //inputElement.value = result[0].repair_time

    const bug1 = document.querySelector('#bug1')
    const bug2 = document.querySelector('#bug2')
    const bug3 = document.querySelector('#bug3')
    const bug4 = document.querySelector('#bug4')
    const bug5 = document.querySelector('#bug5')
    const bug6 = document.querySelector('#bug6')
    const bug7 = document.querySelector('#bug7')
    const bug8 = document.querySelector('#bug8')
    const list1 = document.querySelector('#list1')
    const select1 = document.querySelector('#select1')

    switch(result[0].type){
        case 0:
            list1.style="display:none"
            break
        default:
            list1.style=""
            select1.selectedIndex = result[0].score*10
            break

    }

    bug1.addEventListener('click', function() {
        list1.style="display:none"
    });
    bug2.addEventListener('click', function() {
        list1.style=""
        select1.selectedIndex = 0
    });
    bug3.addEventListener('click', function() {
        list1.style=""
        select1.selectedIndex = 0
    });
    bug4.addEventListener('click', function() {
        list1.style=""
        select1.selectedIndex = 0
    });
    bug5.addEventListener('click', function() {
        list1.style=""
        select1.selectedIndex = 0
    });
    bug6.addEventListener('click', function() {
        list1.style=""
        select1.selectedIndex = 0
    });
    bug7.addEventListener('click', function() {
        list1.style=""
        select1.selectedIndex = 0
    });
    bug8.addEventListener('click', function() {
        list1.style=""
        select1.selectedIndex = 0
    });

    const submitButton = document.getElementById("bugSubmit")


    submitButton&&submitButton.addEventListener('click', function() {


        const radioElements = document.getElementsByName("bug")

        //const inputElement = document.getElementById("bugTime");
        const repair_time = 0;

        let type = ''
        let title = ''
        let score = ''

        for (var i = 0; i < radioElements.length; i++) {
            if (radioElements[i].checked) {
                type = radioElements[i].value;
                switch(type){
                    case '0':
                        title='无特殊原因'
                        score=1
                        break
                    case '1':
                        title='需求设计问题'
                        score=select1.value
                        break
                    case '2':
                        title='上个版本已存在'
                        score=select1.value
                        break
                    case '3':
                        title='无自测条件'
                        score=select1.value
                        break
                    case '4':
                        title='外部因素'
                        score=select1.value
                        break
                    case '5':
                        title='无测试用例'
                        score=select1.value
                        break
                    case '6':
                        title='已知技术风险点'
                        score=select1.value
                        break
                    case '7':
                        title='重复bug'
                        score=select1.value
                        break
                    default:

                }

            }
        }

        posturl(bugid, type, title, score, repair_time)
    });
*/
    const button = document.createElement('div');

    const posturl = async(bugid, type, title, score, repair_time)=>{
        return new Promise(async (resolve)=>{
            const result = await fetch(`http://192.168.10.51:63183/postscoreurl`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bugid,
                    type,
                    title,
                    score,
                    repair_time
                })
            })
             const operator = document.getElementById('userMenu').children[0].text.trim()
             fetch('http://192.168.10.51:63183/postzentao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bugid,
                    username: '外部',
                    operator
                })
            })
            document.getElementById('distributeName').innerHTML = '外部'
            alert('提交成功')
        })
    }
    function style(){
        const modalStyle = `
        .bug-label {
          margin-left:15px
        }
        .bug-label input {
          margin-right:5px;
          position:relative;
          top:2px
        }
        .bug-list {
          margin-top:10px
        }
        .bug-select {
          width:100px
        }
        .scoreButton:active{
          opacity: 0.7;
        }
        .bug-time{
          margin:10px
        }
   `;

        const styleBlock = document.createElement('style');
        styleBlock.textContent = modalStyle;
        document.head.appendChild(styleBlock);
    }


}
/**
 * 创建快捷备注
 */
async function createWriteButton() {
    let nowDom = {}
    const fileArray = document.getElementsByTagName('fieldset')
    Object.keys(fileArray).forEach(v => {
        if (fileArray[v].innerText.includes('备注') && fileArray[v].getElementsByClassName('form-group').length) {
            nowDom = fileArray[v]
        }
    })
    const container = document.getElementsByClassName('main-side')[0]
    const div3 = document.createElement("div")
    div3.style = "border:1px solid #ccc;padding:10px;width: 340px;margin-top: 10px;"
    container.appendChild(div3);
    const button1 = document.createElement("div")
    button1.innerHTML = `
    <span id="aku-button-write" style="padding: 5px;border: 1px solid;cursor: pointer;background: aliceblue;">非研发问题</span> <span id="aku-some-write" style="padding: 5px;border: 1px solid;cursor: pointer;background: aliceblue;">重复bug</span>`
    div3.appendChild(button1);
    // 给予点击按钮事件
    const akuButtonWrite = document.getElementById('aku-button-write')
    const akuSomeWrite = document.getElementById('aku-some-write')
    akuButtonWrite.addEventListener('click', function (e) {
        nowDom.getElementsByClassName('ke-edit-iframe')[0].contentDocument.body.nextSibling.innerHTML = ''
        nowDom.getElementsByClassName('ke-edit-iframe')[0].contentDocument.activeElement.innerHTML = '非研发问题，严重等级降为P2'
    })
    akuSomeWrite.addEventListener('click', function (e) {
        nowDom.getElementsByClassName('ke-edit-iframe')[0].contentDocument.body.nextSibling.innerHTML = ''
        nowDom.getElementsByClassName('ke-edit-iframe')[0].contentDocument.activeElement.innerHTML = '重复bug，严重程度降为P2'
   })
}

