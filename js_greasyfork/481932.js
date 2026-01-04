// ==UserScript==
// @name         zentao4HAT
// @namespace    http://www.akuvox.com/
// @version      1.27
// @description  take on the world!
// @author       andy.wang
// @match        http://192.168.10.17/zentao/bug-browse*.html*
// @match        http://192.168.10.17/zentao/project-bug-*.html*
// @match        http://192.168.10.17/zentao/bug-view-*.html*
// @match        http://192.168.10.17/zentao/story-view-*.html*
// @match        http://192.168.10.17/zentao/build-view-*.html*
// @match        http://192.168.10.17/zentao/testtask-create*.html*
// @match        http://192.168.10.17/zentao/testtask-edit*.html*

// @match        http://zentao.akuvox.local/zentao/bug-browse*.html*
// @match        http://zentao.akuvox.local/zentao/bug-view-*.html*
// @match        http://zentao.akuvox.local/zentao/story-view-*.html*
// @match        http://zentao.akuvox.local/zentao/build-view-*.html*
// @match        http://zentao.akuvox.local/zentao/testtask-create*.html*
// @match        http://zentao.akuvox.local/zentao/testtask-edit*.html*

// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/481932/zentao4HAT.user.js
// @updateURL https://update.greasyfork.org/scripts/481932/zentao4HAT.meta.js
// ==/UserScript==
(function() {
    'use strict';

    zentaoTable()
    zentaoTask()
    versionTest()

})();

async function zentaoTable() {
    if(window.location.href.includes('bug-browse')||window.location.href.includes('bug-view')||window.location.href.includes('project-bug')){
        const userName = document.getElementById('userMenu').children[0].text.trim()

        const post = (bugid,username,operator)=>{
            fetch('http://192.168.10.51:63183/postzentao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bugid,
                    username,
                    operator
                })
            })
        }

        const get = (bugid)=>{
            return new Promise(async (resolve)=>{
                const result = await fetch('http://192.168.10.51:63183/getzentao?bugid='+bugid, {
                    method: 'GET',
                })
                try {
                    const res = await result.json()
                    resolve(res)
                } catch (e) {

                    resolve({username:''})
                }
            })
        }

        const header = document.getElementsByTagName("tr")[0].children

        let index

        Array.from(header).forEach((item,i)=>{
            const text = item.querySelector('a')?item.querySelector('a').text.trim():''
            if(text==='ID'){
                index = i
            }
        })

        const table = document.getElementsByTagName("tr")

        Array.from(table).forEach(async(item,i)=>{
            const th = Array.from(item.children)

            if(i===0){
                let newNode
                newNode = document.createElement("th");
                newNode['data-flex'] = false;
                newNode['data-width'] = "140px";
                newNode.style = "width:140px";
                newNode.class = "w-actions {sorter:false}";
                newNode.innerHTML = "归属人名"
                item.insertBefore(newNode,th[th.length-1])
            }else if(i!==table.length-1){
                if(th[index]){
                    let newNode
                    const id = th[index].querySelector('a')?th[index].querySelector('a').text.trim():''
                    const result = await get(id)
                    newNode = document.createElement("td");
                    newNode.innerHTML = result.username
                    item.insertBefore(newNode,th[th.length-1])

                    Array.from(item.children).forEach(td=>{
                        td.style="background: initial;"
                    })
                    if(result.username===userName){
                        item.style = "background: #8bbff3;"
                    }else if(result.username){
                        item.style = "background: #fea;"
                    }


                    const handle = th[th.length-1].children
                    handle[handle.length-1].innerHTML="我"
                    handle[handle.length-1].href="javascript:;"
                    handle[handle.length-1].addEventListener("click", function(){
                        newNode.innerHTML=userName
                        const msg = `确认当前bug归属到${userName}？`;
                        if (confirm(msg)==true){
                            post(id,userName)
                            item.style = "background: #8bbff3;"
                        }

                    });
                }
            }
        })
        // zentaoDetail...
        if( document.getElementById('modulemenu')){
            const id = document.getElementById('titlebar').querySelector('strong').textContent
            const element = document.getElementById('modulemenu').children[0];
            const name = document.createElement("li");
            const distribute = document.createElement("li");
            const result = await get(id)
            name.style="float: right;margin-right:15px"
            name.innerHTML = '<a href="javascript:;" id="distributeName">'+result.username+'</a>'
            distribute.style="float: right;"
            distribute.innerHTML = '<a href="javascript:;" >分配我</a>'
            element.appendChild(distribute)

            const memberRes = await fetch('http://192.168.10.51:51081/api/task/getTerminalMember', {
                method: 'GET',
            })
            const member = await memberRes.json()

            const assignSelect = document.createElement("li");
            assignSelect.style="float: right;"
            const assignHandle = document.createElement("li");
            assignHandle.style="float: right;margin-right: 10px"
            assignHandle.innerHTML = '<a href="javascript:;" >分配</a>'

            let shtml= '<select id="select" class="bug-select">'

            shtml += member.result.filter(item=>{
                if(['产品','测试'].includes(item.t_group)) return false
                // if(item.account.includes('group'))return
                // if(nameMap[userName]==='')return true
                // return item.t_group === nameMap[userName]
                return true
            }).map(item=>`<option value="${item.username}">${item.username}</option>`).join('')

            shtml += '</select>'

            assignSelect.innerHTML = shtml

            const select = assignSelect.querySelector('#select')

            assignHandle.addEventListener("click", function(){
                const selectDom = document.querySelector('#aku-skills')
                const index = selectDom.selectedIndex;
                const title = selectDom.options[index].text;
                const titleBoolean = ['测试:上个版本已存在','无特殊原因'].includes(title)
                if(titleBoolean && select.value === '外部') {
                    return alert('BUG原因是测试:上个版本已存在或无特殊原因时，不能分配给外部')
                }
                post(id,select.value,userName)
                document.getElementById('distributeName').innerHTML = select.value
            });
            element.appendChild(assignHandle)
            element.appendChild(assignSelect)
            console.log(name)
            element.appendChild(name)
            distribute.addEventListener("click", function(){
                post(id,userName,'')
                document.getElementById('distributeName').innerHTML = userName
            });
        }
    }

}

async function zentaoTask(){
    style()

    if(window.location.href.includes('testtask-create-')||window.location.href.includes('testtask-edit-')){
        let userChange = ()=>{}

        const testReocrdInit =async ()=>{
            const get = ()=>{
                return new Promise(async (resolve)=>{
                    const result = await fetch(`http://192.168.10.51:63183/getversionreview`, {
                        method: 'GET',
                    })

                    try {
                        let res = await result.text()
                        res = res?JSON.parse(res):{}
                        const resTable = Array.isArray(res)?res:[res]

                        resolve(resTable)
                    } catch (e) {
                        resolve([])
                    }
                })
            }

            const getType = ()=>{
                const vValue = document.getElementById('buildBox')?document.getElementById('buildBox').getElementsByClassName('chosen-single')[0].children[0].innerText:''
                return new Promise(async (resolve)=>{
                    const sql = `SELECT * FROM 提测评审要素表记录 WHERE version = '${vValue}'`
                    const result = await fetch(`http://192.168.10.51:63183/sqlversionreviewrecord`, {
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
                        res = res?JSON.parse(res):false
                        resolve(res)
                    } catch (e) {
                        resolve(false)
                    }
                })
            }

            const getEmpty = ()=>{
                return new Promise(async (resolve)=>{
                    const vValue = document.getElementById('buildBox')?document.getElementById('buildBox').getElementsByClassName('chosen-single')[0].children[0].innerText:''
                    if(vValue){
                        resolve(false)
                        return
                    }
                    const sql = `SELECT * FROM 提测评审要素表记录 WHERE version = 'longlongago'`
                    const result = await fetch(`http://192.168.10.51:63183/sqlversionreviewrecord`, {
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
                        resolve(!!res)
                    } catch (e) {
                        resolve(false)
                    }
                })
            }

            const add = ()=>{
                const record = result.map((item,i)=>{
                    return {
                        ...item,
                        resultValue:resultValue[i]
                    }
                })
                let num=0
                const list = record.map((item)=>{
                    if(item.resultValue==='通过')num++
                    return {
                        keyname:item['要素名称'],
                        value:item.resultValue
                    }
                })
                const vValue = document.getElementById('buildBox')?document.getElementById('buildBox').getElementsByClassName('chosen-single')[0].children[0].innerText:''
                const developTime = document.querySelector('input#developTime').value
                rebot(num,list,developTime)

                fetch('http://192.168.10.51:63183/postversionreviewrecord', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        version:vValue||'longlongago',
                        developTime,
                        record:JSON.stringify(record).replace(/"/g, "&#34;"),
                    })
                })
            }

            const edit = ()=>{
                const record = result.map((item,i)=>{
                    return {
                        ...item,
                        resultValue:resultValue[i]
                    }
                })
                let num=0
                const list = record.map((item)=>{
                    if(item.resultValue==='通过')num++
                    return {
                        keyname:item['要素名称'],
                        value:item.resultValue
                    }
                })

                const developTime = document.querySelector('input#developTime').value

                rebot(num,list,developTime)
                return new Promise(async (resolve)=>{
                    const vValue = document.getElementById('buildBox')?document.getElementById('buildBox').getElementsByClassName('chosen-single')[0].children[0].innerText:''

                    const sql = `UPDATE 提测评审要素表记录 SET record = '${JSON.stringify(record).replace(/"/g, "&#34;")}',developTime='${developTime}' WHERE version = '${vValue||'longlongago'}'`
                    const result = await fetch(`http://192.168.10.51:63183/sqlversionreviewrecord`, {
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
                        res = res?JSON.parse(res):false
                        resolve(res)
                    } catch (e) {
                        resolve(false)
                    }
                })
            }

            const rebot = (num,list,developTime)=>{
                const userName = document.getElementById('userMenu').children[0].text.trim()
                const vValue = document.getElementById('buildBox')?document.getElementById('buildBox').getElementsByClassName('chosen-single')[0].children[0].innerText:''
                const product = document.querySelector('.chosen-single span')?.textContent || ''
                fetch('http://192.168.10.51:63183/robot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        num,
                        list,
                        userName,
                        developTime,
                        product,
                        version:vValue
                    })
                })
            }

            const getMember = ()=>{
                return new Promise(async (resolve)=>{
                    const result = await fetch(`http://192.168.10.51:51081/api/task/getTerminalMember`, {
                        method: 'GET',
                    })

                    try {
                        let res = await result.json()
                        resolve(res?.result||[])
                    } catch (e) {
                        resolve([])
                    }
                })
            }

            const version = document.getElementById('buildBox')?document.getElementById('buildBox').getElementsByClassName('chosen-single')[0].children[0].innerText:''

            const username = document.getElementById('userMenu')?document.getElementById('userMenu').children[0].text.trim():''

            const button = document.getElementById('submit')

            const editTable = await getType()

            button&&button.addEventListener('click', async function(e) {
                tbody.removeChild(newTr)
                const Empty = await getEmpty()
                if(editTable||Empty){
                    edit()
                }else{
                    add()
                }
            });

            const tbody = document.querySelector('tbody')
            const lastChild = tbody?tbody.lastElementChild:document.createElement('div');

            const newTr = document.createElement('tr');
            newTr.innerHTML ='<th>评审要素表</th>'
            const newTd = document.createElement('td');

            newTd.setAttribute('colspan', '2')

            newTr.appendChild(newTd)

            const table = document.createElement('table');
            const thead = document.createElement('thead');

            table.classList.add('taskTable')

            thead.innerHTML =
                '<tr>'+
                '<th class="taskTh">内容</th>'+
                '<th class="taskTh">通过选项</th>'+
                '<th class="taskTh" width="200px">是否通过</th>'+
                '</tr>'

            const taskTbody = document.createElement('tbody');

            const originRes = await get()

            let checkRes = editTable?JSON.parse(editTable.record.replace(/&#34;/g, "\"")):[]

            checkRes = checkRes.filter(item=>item.resultValue === "通过").map(item=>item['要素名称'])

            const result = originRes.map(item=>{
                if(checkRes.includes(item['要素名称'])){
                    item.resultValue = "通过"
                }
                return item
            })

            const resultValue = []

            const user = await getMember()

            const memberName = document.getElementById('userMenu')?.children?.[0]?.text?.trim?.()

            let group
            let position

            const groupMap = {
                '长发':'android',
                '嵌入式':'linux',
                'Python':'python',
                'andy':'Web',
            }

            if(memberName&&user?.length){
                group = user.find(item=>item.username===memberName)
                position =group? groupMap[group.t_group]:''
            }
            result.forEach((item,i)=>{
                const taskTr = document.createElement('tr');

                const taskTd1 = document.createElement('td');
                taskTd1.textContent = item['要素名称']
                const taskTd2 = document.createElement('td');
                taskTd2.textContent =item['说明']
                const taskTd3 = document.createElement('td');
                taskTd3.innerHTML =
                    `<label><input type="radio" name="Row${i}" value="通过" ${item.resultValue==='通过'?'checked':''}/><span>通过</span></label>`+
                    (item?.must&&item?.must?.includes?.(position) ? '' : `<label><input type="radio" name="Row${i}" value="NA" ${item.resultValue==='NA'?'checked':''}/><span>NA</span></label>`)

                resultValue[i] = item.resultValue||''

                if(resultValue[i]===''){
                    button&&(button.disabled = true);
                }

                let radio = taskTd3.querySelectorAll("input[type='radio']")

                const clickEvent = (index)=>{
                    radio[index].addEventListener("change", function (e) {
                        resultValue[i] = e.target.value
                        const resultIndex = resultValue.findIndex(item=>item==='')

                        const hasUser = document.getElementById('mailto_chosen').querySelector('.search-choice')

                        if(~resultIndex||!hasUser){
                            button&&(button.disabled = true);
                        }else{
                            button&&(button.disabled = false);
                        }

                        userChange = ()=>{
                            const hasUser = document.getElementById('mailto_chosen').querySelector('.search-choice')
                            if(~resultIndex||!hasUser){
                                button&&(button.disabled = true);
                            }else{
                                button&&(button.disabled = false);
                            }
                        }
                    });
                }



                for (let index = 0; index < radio.length; index++) {
                    clickEvent(index)
                }

                taskTr.appendChild(taskTd1)
                taskTr.appendChild(taskTd2)
                taskTr.appendChild(taskTd3)
                taskTbody.appendChild(taskTr)
            })

            const chosen = document.getElementById('mailtoGroup')

            let once = false
            chosen&&chosen.addEventListener('click', function() {
                if(once){
                    once = true
                    return
                }
                const resultIndex = resultValue.findIndex(item=>item===''||item==='不通过')
                const user = document.getElementsByClassName('active-result')

                Array.from(user).forEach(item=>{
                    item.addEventListener('click', function() {
                        const resultIndex = resultValue.findIndex(item=>item===''||item==='不通过')

                        const hasUser = document.getElementById('mailto_chosen').querySelector('.search-choice')

                        const close = document.getElementsByClassName('search-choice-close')

                        Array.from(close).forEach(item=>{
                            item.addEventListener('click', function() {
                                const resultIndex = resultValue.findIndex(item=>item===''||item==='不通过')

                                const hasUser = document.getElementById('mailto_chosen').querySelector('.search-choice')

                                const close = document.getElementsByClassName('search-choice-close')

                                if(~resultIndex||!hasUser){
                                    button&&(button.disabled = true);
                                }else{
                                    button&&(button.disabled = false);
                                }
                            });
                        })

                        if(~resultIndex||!hasUser){
                            button&&(button.disabled = true);
                        }else{
                            button&&(button.disabled = false);
                        }
                    });
                })
            });

            table.appendChild(thead)
            table.appendChild(taskTbody)

            newTr.id = "testRecord"

            const testRecordDiv = tbody.querySelector('#testRecord')

            if(testRecordDiv){
                testRecordDiv.remove()
            }

            newTd.appendChild(table)
            tbody&&tbody.insertBefore(newTr, lastChild);
        }

        const product = document.querySelector('#project_chosen')?.querySelector?.('a')?.textContent?.trim?.()||''

        if(product==='底盒项目')return

        testReocrdInit()

        const targetDiv = document.getElementById('build_chosen');

        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(async(mutation) => {
                if (mutation.type === 'childList') {
                    testReocrdInit()
                }
            });
        });
        const config = {
            childList: true,
            attributes: true,
            subtree: true
        };
        observer.observe(targetDiv, config);

        const mailtoChosenDiv = document.getElementById('mailto_chosen');

        const userObserver = new MutationObserver((mutationsList) => {
            mutationsList.forEach(async(mutation) => {
                if (mutation.type === 'childList') {
                    userChange()
                }
            });
        });

        userObserver.observe(mailtoChosenDiv, config);

    }

    if(window.location.href.includes('build-view-')){

        const version = document.getElementById('titlebar').querySelectorAll('strong')[1].textContent
        const get = async()=>{
            const sql = `SELECT * FROM 提测评审要素表记录 WHERE version = '${version}'`
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

        const modelTable = document.getElementsByClassName('table-borderless')[0]

        const modelTr = modelTable.getElementsByTagName('tr')

        const navTabs = document.getElementsByClassName('nav-tabs')[0]
        const tabsLi = document.createElement('li');
        tabsLi.innerHTML ='<a href="#review" data-toggle="tab"><i class="icon-lightbulb red"></i>评审要素表</a>'
        navTabs.appendChild(tabsLi);

        const tabContent = document.getElementsByClassName('tab-content')[0]
        const tabPane = document.createElement('div');
        tabPane.classList.add('tab-pane')
        tabPane.id = 'review'

        const table = document.createElement('table');
        table.classList.add('table','table-hover','table-condensed','table-striped','tablesorter','table-fixed','taskTable')

        const thead = document.createElement('thead');
        thead.innerHTML =
            '<th>要素名称</th>'+
            '<th>说明</th>'+
            '<th>是否通过</th></tr>'

        const tbody = document.createElement('tbody');

        const result = await get()

        let tbodyhtml = ''
        const list = result.record?JSON.parse(result.record.replace(/&#34;/g, "\"")):[]
        list.forEach(item=>{
            tbodyhtml +=
                `<td>${item['要素名称']}</td>`+
                `<td>${item['说明']}</td>`+
                `<td>${item.resultValue}</td></tr>`
        })

        tbody.innerHTML = tbodyhtml

        table.appendChild(thead);
        table.appendChild(tbody);
        tabPane.appendChild(table);
        tabContent.appendChild(tabPane);
    }

    function style(){
        const modalStyle = `
        .taskTable{
          border: 1px solid #ddd;
          width:100%
        }

        .taskTh{
          background-color: #f1f1f1;
          border-bottom: 1px solid #ddd;
        }

        .taskTable td{
          text-align: center;
        }

        label {
          margin:0
        }

        label input{
          margin-right:4px
        }

        label span{
          position:relative;
          top:-2px;
          margin-left:3px
        }

        label+label{
          margin-left:10px
        }
   `;

        const styleBlock = document.createElement('style');
        styleBlock.textContent = modalStyle;
        document.head.appendChild(styleBlock);
    }

}

async function versionTest (){

    let inAndroid = false

    try {
        const memberRes = await fetch('http://192.168.10.51:51081/api/task/getTerminalMember', {
            method: 'GET',
        })
        const {result} = await memberRes.json()
        const userName = document.getElementById('userMenu').children[0].text.trim()
        //const userName = "张明耀"

        const user = result.filter(item=>item.username===userName)
        if(!user.length)return
        const position = user[0].position
        if(position==='安卓'){
            inAndroid = true
        }
    } catch (e) {

    }

    const getTest = async(version)=>{
        if(!version)return Promise.resolve()
        return new Promise(async (resolve)=>{
            const result = await fetch(`http://192.168.10.51:51081/api/zentao/${inAndroid?'versionTest':'versionTestSimple'}?name=${version}`, {
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

    function showToast(message, duration = 20000) {
        // 创建一个div元素用于显示Toast
        const toast = document.createElement('div');

        // 创建一个关闭按钮
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '0';
        closeButton.style.right = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '20px';
        closeButton.style.color = '#fff';

        // 设置Toast的样式
        toast.style.visibility = 'hidden';
        toast.style.minWidth = '250px';
        toast.style.marginLeft = '-125px';
        toast.style.backgroundColor = '#333';
        toast.style.color = 'white'; // Changed to white for better contrast
        toast.style.textAlign = 'center';
        toast.style.borderRadius = '2px';
        toast.style.padding = '16px';
        toast.style.position = 'fixed';
        toast.style.zIndex = '1';
        toast.style.right = '30px';
        toast.style.top = '80px';
        toast.style.minHeight = '60px';
        toast.style.fontSize = '17px';
        toast.style.transition = 'opacity 0.5s ease';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.justifyContent = 'center';
        toast.style.paddingRight = '40px'; // To make space for the close button
        toast.style.maxWidth = '400px'
        toast.style.wordBreak = 'break-all';

        // 设置Toast的文本
        toast.innerText = message;

        // 将关闭按钮添加到Toast
        toast.appendChild(closeButton);

        // 将Toast添加到文档中
        document.body.appendChild(toast);

        // 触发显示动画
        setTimeout(() => {
            toast.style.visibility = 'visible';
            toast.style.opacity = '1';
        }, 100);

        // 在指定时间后隐藏并移除Toast
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 1000);
        }, 10000);

        // 点击关闭按钮时立即隐藏并移除Toast
        closeButton.addEventListener('click', () => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 500);
        });
    }

    const targetDiv = document.getElementById('build_chosen');

    let hasError = false

    const button = document.getElementById('submit');

    (async ()=>{
        const {result} = await getTest(targetDiv.querySelector('.chosen-single').text||'')

        if(!result.status){
            hasError = true
            setTimeout(()=>{
                hasError = false
            },1000)
            // 使用方法示例
            showToast(result.message, 3000);
            button.style.pointerEvents = 'none';
            button.style.background= 'gray';
        }
        if(result.status){
            button.style.pointerEvents = 'unset';
            button.style.background='#1a4f85'
        }
    })()

    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(async(mutation) => {
            if (mutation.type === 'childList') {
                const {result} = await getTest(targetDiv.querySelector('.chosen-single').text||'')
                if(!result.status&&!hasError){
                    hasError = true
                    setTimeout(()=>{
                        hasError = false
                    },1000)
                    // 使用方法示例
                    showToast(result.message, 3000);
                    button.style.pointerEvents = 'none';
                    button.style.background= 'gray';
                }
                if(result.status){
                    button.style.pointerEvents = 'unset';
                    button.style.background='#1a4f85'
                }
            }
        });
    });
    const config = {
        childList: true,
        attributes: true,
        subtree: true
    };
    observer.observe(targetDiv, config);

}











