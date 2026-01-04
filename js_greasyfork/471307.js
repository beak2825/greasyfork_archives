// ==UserScript==
// @name         gitlab4pr
// @namespace    http://www.akuvox.com/
// @version      1.1
// @description  take on the world!
// @author       andy.wang
// @match        http://gitlab.xm.akubela.local/*/-/merge_requests/*
// @match        http://192.168.13.20/*/-/merge_requests/*
// @match        http://gitlab.fz.akubela.local/*/-/merge_requests/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/471307/gitlab4pr.user.js
// @updateURL https://update.greasyfork.org/scripts/471307/gitlab4pr.meta.js
// ==/UserScript==

(function() {
    'use strict';
    gitReview()

    postGitUrl()
    // Your code here...
})();

async function gitReview(){
    var newRequests = window.location.href;
    var newRequestsRegex = /\/-\/merge_requests\/new(#.*)?(.*change_branches=true.*)?$/;
    var newRequestsRes = newRequestsRegex.test(newRequests);

    if(newRequestsRes)return
    return

    var newHandleRegex = /\/-\/merge_requests\/new/;
    var newRequestsHandle = newHandleRegex.test(newRequests);

    const userList = {
        // 洪国源
        'aiden':'android',
        'guoyuan.hong':'android',
        'hongguoyuan':'android',
        '洪国源':'android',
        // 吴晓洪
        'albert':'android',
        'xiaohong.wu':'android',
        'wuxiaohong':'android',
        '吴晓洪':'android',
        // 蔡灿煌
        'cch':'android',
        'canhuang.cai':'android',
        'caicanhuang':'android',
        '蔡灿煌':'android',
        // 陈阳坤
        'yangkun.chen':'linux',
        'chenyangkun':'linux',
        '陈阳坤':'linux',
        // 黄海翔
        'harrison':'android',
        'haixiang.huang':'android',
        'huanghaixiang':'android',
        '黄海翔':'android',
        // 黄耀鹏
        'yaopeng.huang':'linux',
        'huangyaopeng':'linux',
        '黄耀鹏':'linux',
        // 黄长发
        'changfa.huang':'python',
        'huangchangfa':'python',
        '黄长发':'python',
        // 胡鑫鑫
        'xinxin.hu':'android',
        'huxinxin':'android',
        '胡鑫鑫':'android',
        // 刘紫馨
        'jane':'android',
        'jane.liu':'android',
        'liujane':'android',
        '刘紫馨':'android',
        // 施培基
        'keith':'linux',
        'peiji.shi':'linux',
        'shipeiji':'linux',
        '施培基':'linux',
        // 赖胜昌
        'shengchang.lai':'android',
        'laishengchang':'android',
        '赖胜昌':'android',
        // 乐忠豪
        'zhonghao.le':'android',
        'lezhonghao':'android',
        '乐忠豪':'android',
        // 李楠
        'nan.li':'web',
        'linan':'web',
        '李楠':'web',
        // 刘朝明
        'chaoming.liu':'web',
        'liuchaoming':'web',
        '刘朝明':'web',
        // 罗兴富
        'xingfu.luo':'android',
        'luoxingfu':'android',
        '罗兴富':'android',
        // 陈彧
        'sense':'web',
        'yu.chen':'web',
        'chenyu':'web',
        '陈彧':'web',
        // 张佳达
        'jiada.zhang':'python',
        'zhangjiada':'python',
        '张佳达':'python',
        // 张明耀
        'mingyao.zhang':'android',
        'zhangmingyao':'android',
        '张明耀':'android',
    }

    const user = document.querySelector('[data-testid="user-profile-link"]');
    const username = user.dataset.user

    style()

    if(newRequestsHandle){


        const post = (specialty)=>{

            var url = window.location.pathname;
            var regex = /^.*(?=\/-\/merge_requests\/new)/;
            var module = url.match(regex);

            const tableRes = tableData.map((item,i)=>{
                return {
                    ...item,
                    result:result[i]
                }
            })

            fetch(`http://192.168.10.51:63183/post${specialty}codereviewrecord`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tdate:Date.now(),
                    username,
                    online:onlineResult,
                    module:module?module[0]:'',
                    srcbranch,
                    dstbranch,
                    commitnum,
                    record:JSON.stringify(tableRes).replace(/"/g, "&#34;"),
                    status:false
                })
            })
        }

        const get = (specialty)=>{
            return new Promise(async (resolve)=>{
                const result = await fetch(`http://192.168.10.51:63183/get${specialty}codereview`, {
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



        const result = []
        let onlineResult = ''
        let srcbranch=''
        let dstbranch=''
        let commitnum=''

        const commitDiv = document.getElementsByClassName('gl-tab-counter-badge')
        if(commitDiv.length){
            commitnum = commitDiv[0].innerHTML
        }



        const button = document.querySelector('[type="submit"]')

        window.onload = function() {
            button.disabled = true;
            setTimeout(()=>{
                button.disabled = true;
            },2000)
        };

        const urlParams = new URLSearchParams(window.location.search);

        urlParams.forEach((value, key) => {
            switch(key)
            {
                case 'merge_request[source_branch]':
                    srcbranch = value
                    break;
                case 'merge_request[target_branch]':
                    dstbranch = value
                    break;
                default:
                    break
            }
        });

        const parent = document.getElementById('new_merge_request');
        const target = document.getElementsByClassName('detail-page-description')[0];

        const newElement = document.createElement('div');
        const hr = document.createElement('hr');
        const table = document.createElement('table');

        // 创建表头行和单元格
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['内容','通过选项','是否通过'].forEach(item=>{
            const th = document.createElement('th');
            th.textContent = item;
            if(['内容','通过选项'].includes(item)){
                th.style="width:35%"
            }
            headerRow.appendChild(th);
        })
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tableData = await get(userList[username.toLowerCase()])

        // 创建表格行和单元格
        if(tableData.length){
            for (let i = 0; i < tableData.length; i++) {
                const tr = document.createElement('tr');
                const nameTd = document.createElement('td');
                nameTd.textContent = tableData[i]['要素名称'];
                tr.appendChild(nameTd);

                const illustrateTd = document.createElement('td');
                illustrateTd.textContent = tableData[i]['说明'];
                tr.appendChild(illustrateTd);

                const td = document.createElement('td');
                td.innerHTML =
                    '<label><input type="radio" name="Row'+i+'" value="通过" /><span>通过</span></label>'+
                    '<label><input type="radio" name="Row'+i+'" value="不通过"  /><span>不通过</span></label>'+
                    '<label><input type="radio" name="Row'+i+'" value="NA" /><span>NA</span></label>'
                result[i] = ''

                tr.appendChild(td);
                table.appendChild(tr);
            }
        }


        let radio = table.querySelectorAll("input[type='radio']")


        const clickEvent = (i)=>{
            const index = Math.floor(i / 3)
            radio[i].addEventListener("change", function (e) {
                result[index] = e.target.value
                const resultIndex = result.findIndex(item=>item===''||item==='不通过')

                const onlineValue = document.getElementsByName("online")
                for (var i = 0; i < onlineValue.length; i++) {
                    if (onlineValue[i].checked) {
                        onlineResult = onlineValue[i].value
                        break;
                    }
                }
                if(~resultIndex || onlineResult===''){
                    button.disabled = true;
                }else{
                    button.disabled = false;
                }
            });}

        for (var i = 0; i < radio.length; i++) {
            clickEvent(i)
        }

        button.addEventListener('click', function() {
            post(userList[username.toLowerCase()])
        });

        newElement.appendChild(hr)

        const onlineRadio = document.createElement('div');

        onlineRadio.classList.add("online");

        onlineRadio.innerHTML =
            '<label><input type="radio" name="online" value="true" /><span>在线</span></label>'+
            '<label><input type="radio" name="online" value="false"  /><span>本地</span></label>'
        newElement.appendChild(onlineRadio);

        newElement.appendChild(table)

        const nextSibling = target.nextSibling;
        if (nextSibling) {
            parent.insertBefore(newElement, nextSibling);
        } else {
            parent.appendChild(newElement);
        }

        const onlineValue = document.querySelector("input[name='online']")
        onlineValue.addEventListener("change", function (e) {
            const resultIndex = result.findIndex(item=>item===''||item==='不通过')
            onlineResult= e.target.value
            if(~resultIndex){
                button.disabled = true;
            }else{
                button.disabled = false;
            }
        })
    }else{

        let commits_count = 0
        let source_branch = ''
        let target_branch = ''
        let author = ''
        let tableData

        const result = []

        const get = async()=>{

            const gitJson = await fetch(window.location.href + '/cached_widget.json', {
                method: 'GET',
            })
            const gitResultText = await gitJson.text()
            const gitResultJson = gitResultText?JSON.parse(gitResultText):{}
            commits_count = gitResultJson.commits_count || 0
            source_branch = gitResultJson.source_branch
            target_branch = gitResultJson.target_branch
            author = document.getElementsByClassName('author')[0].innerHTML

            const sql = `SELECT * FROM ${userList[author.toLowerCase()]}代码评审要素表记录 WHERE srcbranch = '${source_branch}' AND dstbranch = '${target_branch}' AND username = '${author}' AND status = 'false'`
            return new Promise(async (resolve)=>{
                const result = await fetch(`http://192.168.10.51:63183/sql${userList[author.toLowerCase()]}codereviewrecord`, {
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

        const set = async(value)=>{
            const sql = `UPDATE ${userList[author.toLowerCase()]}代码评审要素表记录 SET status = '${value}' WHERE srcbranch = '${source_branch}' AND dstbranch = '${target_branch}' AND username = '${author}' AND status = 'false'`
            return new Promise(async (resolve)=>{
                const result = await fetch(`http://192.168.10.51:63183/sql${userList[author.toLowerCase()]}codereviewrecord`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sql
                    })
                })
                })
        }

        const change = async()=>{
            const tableRes = tableData.map((item,i)=>{
                return {
                    ...item,
                    result:result[i]
                }
            })
            const sql = `UPDATE ${userList[author.toLowerCase()]}代码评审要素表记录 SET record = '${JSON.stringify(tableRes).replace(/"/g, "&#34;")}',commitnum = ${commits_count} WHERE srcbranch = '${source_branch}' AND dstbranch = '${target_branch}' AND username = '${author}' AND status = 'false'`
            return new Promise(async (resolve)=>{
                const result = await fetch(`http://192.168.10.51:63183/sql${userList[author.toLowerCase()]}codereviewrecord`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sql
                    })
                })
                })
        }

        window.onload =async function() {

            const tableResult = await get()

            if(!tableResult?.length)return

            const container = document.getElementsByClassName('mr-state-widget')[0]

            const tableDiv = document.createElement('div')

            const table = document.createElement('table');

            const creator = username === author&&`${commits_count}` !== tableResult[0].commitnum

            // 创建表头行和单元格
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            ['内容','通过选项','是否通过'].forEach(item=>{
                const th = document.createElement('th');
                th.textContent = item;
                if(['内容','通过选项'].includes(item)){
                    th.style="width:35%"
                }
                headerRow.appendChild(th);
            })
            thead.appendChild(headerRow);
            table.appendChild(thead);

            tableData = JSON.parse(tableResult[0].record.replace(/&#34;/g, "\""))

            // 创建表格行和单元格
            if(tableData.length){
                for (let i = 0; i < tableData.length; i++) {
                    const tr = document.createElement('tr');
                    const nameTd = document.createElement('td');
                    nameTd.textContent = tableData[i]['要素名称'];
                    tr.appendChild(nameTd);

                    const illustrateTd = document.createElement('td');
                    illustrateTd.textContent = tableData[i]['说明'];
                    tr.appendChild(illustrateTd);

                    if(creator){
                        const td = document.createElement('td');
                        td.innerHTML =
                            '<label><input type="radio" name="Row'+i+'" value="通过" /><span>通过</span></label>'+
                            '<label><input type="radio" name="Row'+i+'" value="不通过"  /><span>不通过</span></label>'+
                            '<label><input type="radio" name="Row'+i+'" value="NA" /><span>NA</span></label>'
                        result[i] = ''
                        tr.appendChild(td);
                    }else{
                        const resultTd = document.createElement('td');
                        resultTd.textContent = tableData[i].result
                        tr.appendChild(resultTd);
                    }

                    table.appendChild(tr);
                }
            }


            tableDiv.classList.add("mr-section-container");
            tableDiv.classList.add("mr-widget-workflow");
            tableDiv.classList.add("mr-table");

            const button = document.createElement('button');
            button.classList.add('btn','mr-3','btn-info','btn-md','gl-button')
            button.innerHTML = '<span class="gl-button-text">完成</span>'
            button.style = "margin-top:10px"
            button.disabled = true;
            button.addEventListener('click', function() {
                change()
            });

            if(!creator){
                if(`${commits_count}` !== tableResult[0].commitnum){
                    const errorDiv = document.createElement('div')
                    errorDiv.innerHTML="pr在创建后仍有新的commit提交，提醒创建人员重新评审！"
                    errorDiv.classList.add("mr-onlie");
                    errorDiv.classList.add("mr-error");
                    tableDiv.appendChild(errorDiv)
                }else{
                    const onlineDiv = document.createElement('div')

                    onlineDiv.innerHTML = tableResult[0].online === 'true'?'在线':'本地'
                    onlineDiv.classList.add("mr-onlie");

                    tableDiv.appendChild(onlineDiv)
                }
            }else{

                let radio = table.querySelectorAll("input[type='radio']")
                const clickEvent = (i)=>{
                    const index = Math.floor(i / 3)
                    radio[i].addEventListener("change", function (e) {
                        result[index] = e.target.value
                        const resultIndex = result.findIndex(item=>item===''||item==='不通过')

                        if(~resultIndex){
                            button.disabled = true;
                        }else{
                            button.disabled = false;
                        }
                    });}

                for (var i = 0; i < radio.length; i++) {
                    clickEvent(i)
                }
            }



            tableDiv.appendChild(table)

            if(creator){
                tableDiv.appendChild(button)
            }
            container.appendChild(tableDiv)

            setTimeout(()=>{
                let mergeButton = document.querySelector('[data-testid="merge-button"]')
                mergeButton&&mergeButton.addEventListener('click', function() {
                    set('true')
                });
            },2000)

            let descriptionButton= document.getElementsByClassName('description')[0]
            let closeButton = descriptionButton.parentNode

            closeButton&&closeButton.addEventListener('mousedown', function() {
                set('close')
            });
        };


    }


    function style(){
        const modalStyle = `
        table {
          border-collapse: collapse;
          width:100%
        }

        th {
          background: #f5f5f5;
        }

        th,td {
          border: 1px solid #dbdbdb;
          padding: 8px;
        }

        label {
          margin:0
        }

        label input{
          margin-right:4px
        }

        label span{
          position:relative;
          top:-2px
        }

        label+label{
          margin-left:10px
        }

        .online{
          text-align: right;
          padding-bottom: 10px;
        }

        .mr-onlie{
          text-align: right;
          margin-bottom: 10px;
          padding-right: 5px;
          font-weight:700
        }

        .mr-table{
          padding: 10px;
        }

        .mr-error{
          color: red
        }

   `;


        const styleBlock = document.createElement('style');
        styleBlock.textContent = modalStyle;
        document.head.appendChild(styleBlock);
    }
}

async function postGitUrl(){
    const posturl = async()=>{
        const title = document.querySelector('[data-qa-selector="title_content"]')&&document.querySelector('[data-qa-selector="title_content"]').innerText || ''
        return new Promise(async (resolve)=>{
            const result = await fetch(`http://192.168.10.51:63183/postgiturl`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    url:window.location.href
                })
            })
            })
    }
    setTimeout(()=>{
        let mergeButton = document.querySelector('[data-testid="merge-button"]')
        mergeButton&&mergeButton.addEventListener('click', function() {
            posturl()
        });
    },2000)
}
