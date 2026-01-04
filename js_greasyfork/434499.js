// ==UserScript==
// @name         pingcodeHelper
// @namespace    http://tampermonkey.net/
// @version      3.25
// @description  hack pingcode
// @author       Amos
// @match        https://onetoken.pingcode.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant      GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/434499/pingcodeHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/434499/pingcodeHelper.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
function showArchiveList(toArchive,agileDetail=null){
    let popupWin = document.querySelector('#pingcode-archive-table')
    if(popupWin){
        document.body.removeChild(popupWin)
    }
    popupWin = document.createElement('div')
    popupWin.style = "background-color:gray;position: absolute;top: 100px;left: 300px;right:200px;z-index:10000;height:500px; overflow:auto;padding:10px;width:850px"
    let titleEl = document.createElement('h4')
    titleEl.innerText=`确定归档以下${toArchive.length}个任务?`
    popupWin.appendChild(titleEl)
    let notifyRoot = document.createElement('div')
    popupWin.appendChild(notifyRoot)
    notifyRoot.style="height:400px; overflow:auto;"
    let table = document.createElement('table')
    table.id = 'pingcode-archive-table'
    table.style='border:1px'
    table.cellspacing="0"
    table.cellpadding="1"
    table.border="1"
    let headerEl = document.createElement('tr')
    let idHeadEl = document.createElement('td')
    idHeadEl.innerText = '编号'
    idHeadEl.style="width:100px"
    headerEl.appendChild(idHeadEl)
    let titleHeadEl = document.createElement('td')
    titleHeadEl.innerText = '标题'
    titleHeadEl.style='width:500px'
    headerEl.appendChild(titleHeadEl)
    let stateHeadEl = document.createElement('td')
    stateHeadEl.innerText = '状态'
    headerEl.appendChild(stateHeadEl)
    let lastUpdatedHeadEl = document.createElement('td')
    lastUpdatedHeadEl.innerText = '最后更新'
    lastUpdatedHeadEl.style="width:120px"
    headerEl.appendChild(lastUpdatedHeadEl)
    table.appendChild(headerEl)
    notifyRoot.appendChild(table)
    document.body.appendChild(popupWin)
    let btnDiv = document.createElement('div')
    btnDiv.style='margin-top:10px;'
    popupWin.appendChild(btnDiv)
    let confirmBtn = document.createElement('button')
    confirmBtn.innerText='确定'
    let cancelBtn = document.createElement('button')
    cancelBtn.style='margin-left:15px;'
    cancelBtn.innerText='取消'
    btnDiv.appendChild(confirmBtn)
    btnDiv.appendChild(cancelBtn)
    cancelBtn.addEventListener('click',()=>{
        document.body.removeChild(popupWin)
    })
    confirmBtn.addEventListener('click',()=>{
        archiveItems(toArchive).then(()=>{
            alert(`成功归档${toArchive.length}个任务`)
        }).catch(size=>{
            alert(`成功归档${size}个任务，失败${toArchive.length-size}个`)
        }).finally(()=>{
            if(agileDetail){
                let archiveBtn = agileDetail.querySelector('#archiveBtn')
                if(archiveBtn){
                    agileDetail.removeChild(archiveBtn)
                }
            }
        })
        // console.log(archiveItems)
        document.body.removeChild(popupWin)
    })
    toArchive.forEach(item=>{
        let trEl = document.createElement('tr')
        table.appendChild(trEl)
        let identifierEl = document.createElement('td')
        identifierEl.innerText = item.whole_identifier
        trEl.appendChild(identifierEl)
        let titleEl = document.createElement('td')
        titleEl.innerText = item.title
        trEl.appendChild(titleEl)
        let stateEl = document.createElement('td')
        let state = item.state_name?item.state_name:(item.hasOwnProperty('state_type')?([3,4].includes(item.state_type)?'已完成':'未完成'):'未知')
        stateEl.innerText = state
        trEl.appendChild(stateEl)
        let lastUpdatedEl = document.createElement('td')
        lastUpdatedEl.innerText = dateFormat('YYYY-mm-dd HH:MM',new Date(item.updated_at*1000))
        trEl.appendChild(lastUpdatedEl)
    })
    console.log(toArchive)
}
GM_registerMenuCommand('Archive tasks done before 2 months', function() { 
    get_work_items().then(items=>{
        let longSetTasks=[]
        for(let item of items){
            if(item.state_type===3||item.state_type===4){
                // console.log('checking',(Date.now()-item.updated_at*1000)/24/3600000,item)
                if(Date.now()-item.updated_at*1000>24*60*3600*1000){
                    longSetTasks.push(item)
                }
            }
        }
        showArchiveList(longSetTasks)
    })
}, 'r');
function get_work_items(pageSize=1000,pageIndex=0){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url: 'https://onetoken.pingcode.com/api/agile/work-items',
            dataType: "json",
            data: {ps:pageSize,pi:pageIndex},
            async: true,
            cache: false,
            timeout: 30000,
            success:  (res)=> {
                if(res.code===200){
                    let data=res.data
                    let dataList=data.value
                    if(data.page_index<data.page_count-1){
                        get_work_items(pageSize,pageIndex+1).then(items=>{
                            let concatList=dataList.concat(items)
                            resolve(concatList)
                        })
                    } else {
                        resolve(dataList)
                    }
                } else{
                    reject()
                }
            },
            error: (request, status, error)=> {
                reject(error)
            },
            type: "GET"
        });
    })
}
function archiveItems(items,index=0){
    return new Promise((resolve,reject)=>{
        if(items.length===0){
            resolve()
            return
        }
        let item=items[index]
        $.ajax({
            url: `https://onetoken.pingcode.com/api/agile/work-items/${item._id}/archive`,
            dataType: "json",
            data: {},
            async: true,
            cache: false,
            timeout: 10000,
            success: function (data) {
                if(index<items.length-1){
                    archiveItems(items,index+1).then(res=>{
                        resolve()
                    })
                } else {
                    resolve()
                }
            },
            error: function (request, status, error) {
                reject(index)
            },
            type: "PUT"
        });
    })
    
}
 
 
// $.ajax({
//     url: 'https://onetoken.pingcode.com/api/agile/work-items/60e29290793b014b8ffbdeba/archive',
//     dataType: "json",
//     data: {},
//     async: true,
//     cache: false,
//     timeout: 30000,
//     success: function (data) {
//         // my success stuff
//     },
//     error: function (request, status, error) {
//         // my error stuff
//     },
//     type: "PUT"
// });
 
var pageURLCheckTimer = setInterval(
    function () {
        if (this.lastPathStr !== location.pathname ||
            this.lastQueryStr !== location.search ||
            this.lastPathStr === null ||
            this.lastQueryStr === null
        ) {
            this.lastPathStr = location.pathname;
            this.lastQueryStr = location.search;
            gmMain();
        }
    }, 222
);
 
function gmMain() {
    setTimeout(function () {
        let x = document.querySelector("#app-host-container > app-agile-root > app-agile-actual-root > agile-global > agile-global-query-detail > thy-header > div.layout-header-content > div > thy-nav > a.styx-secondary-nav-link.nav-link > span")
        if(x){
            console.log(x);
            console.log(x.textContent.trim());
            document.title = x.textContent.trim();
        }
        
    }, 3000);
}
function refreshUnread(){
    let authorization = localStorage.getItem('authorization')
    if(authorization){
        fetch('https://iris.pingcode.com/api/iris/notifications/n-unreads?t=1636023609632',{headers:{authorization: authorization}})
          .then(res => res.json())
          .then(res=>{
            if(res.code===200){
                let unreadSize=res.data.value
                let currentTitle=document.head.querySelector('title').textContent
                if(currentTitle.startsWith('(')){
                    let endIndex = currentTitle.indexOf(')')
                    if(endIndex>=0){
                        let newTitle=`(${unreadSize})${currentTitle.substring(endIndex+1)}`
                        document.head.querySelector('title').textContent=newTitle
                    }
                    
                }
            }
          })
    }
}
function hideYearJump(){
    let prevYear=document.querySelector(".thy-calendar-prev-year-btn")
    let nextYear=document.querySelector(".thy-calendar-next-year-btn")
    if(prevYear){
        prevYear.style.display='none'
    }
    if(nextYear){
        nextYear.style.display='none'
    }
}
 
function bestEffortUUID() {
  let ts = new Date().getTime()
  let hexDigits = '0123456789abcdef'
  let uuid = ts + '-'
  for (let i = 0; i < 8; i++) {
    uuid += hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  return uuid
}
let currentOrder = 'original'

function initBtn(){
    let btnHead = document.querySelector('.layout-header-operation')
    if(btnHead){
        let exitsBtn = btnHead.querySelector('#notifications-order')
        if(!exitsBtn){
            let btn = document.createElement('span')
            btn.textContent = currentOrder
            btn.style = 'color:#4598e6;cursor:pointer;padding-left:10px;padding-right:5px'
            btn.id = 'notifications-order'
            btn.addEventListener('click',()=>{
                toggleOrder()
            })
            btnHead.insertBefore(btn,btnHead.firstChild)
        }
    }
}

function toggleOrder(){
    currentOrder = currentOrder==='original' ? 'group by task':'original'
    let orderBtn = document.querySelector('#notifications-order')
    if(orderBtn){
        orderBtn.textContent = currentOrder
    }
    setChildrenByOrder()
}

function groupChildNodeById(childrenNodes){
    let nodesMap = {}
    childrenNodes.forEach(child=>{
        let id = getId(child)
        if(!(id in nodesMap)){
            nodesMap[id] = {nodes:[child],lastNode:child}
        } else {
            nodesMap[id].nodes.push(child)
        }
    })
    let groupedNodes = []
    for(let id in nodesMap) {
        groupedNodes.push({...nodesMap[id]})
    }
    groupedNodes.sort((group1,group2)=>{
        let time1 = group1.lastNode.querySelector('.notice-card-pilot').textContent
        let time2 = group2.lastNode.querySelector('.notice-card-pilot').textContent
        return -compareTime(time1,time2)
    })
    let sortedNodes=[]
    groupedNodes.forEach(groupedNode=>{
        groupedNode.nodes.forEach(node=>{
            sortedNodes.push(node)
        })
    })
    return sortedNodes
}

function setChildrenByOrder(){
    let parent = document.querySelector('app-notice-entire-list')?.querySelector('.thy-card-content')
    if(!parent) {
        return
    }
    let cardNodes = parent.querySelectorAll('app-notice-card')
    let childrenNodes = []
    for(let child of cardNodes){
        childrenNodes.push(child)
    }
    let sortedChildren
    if(currentOrder==='original'){
        sortedChildren = getChildrenByTime(childrenNodes)
    } else{
        sortedChildren = groupChildNodeById(childrenNodes)
    }
    sortedChildren.forEach(child=>{
        parent.removeChild(child)
    }) 
    let childrenLen = sortedChildren.length
    while(childrenLen--){
        parent.insertBefore(sortedChildren[childrenLen],parent.firstChild)
    }
}

function getChildrenByTime(children){
    children.sort((child1,child2)=>{
        let time1 = child1.querySelector('.notice-card-pilot').textContent
        let time2 = child2.querySelector('.notice-card-pilot').textContent
        return -compareTime(time1,time2)
    })
    return children
}

function compareTime(time1,time2) {
    let monthParts1 = time1.split('月')
    let monthParts2 = time2.split('月')
    if(monthParts1.length===1&&monthParts2.length===1){
        let hour1 = Number(time1.split('小时')[0])
        let hour2 = Number(time2.split('小时')[0])
        if(hour1>hour2){
            return -1
        }
        if(hour1<hour2){
            return 1
        }
        return 0
    }
    if(monthParts1.length>monthParts2.length){
        return -1
    }
    if(monthParts1.length<monthParts2.length){
        return 1
    }
    let [month1,leftDay1] = time1.split('月')
    let [month2,leftDay2] = time2.split('月')
    month1=parseInt(month1)
    month2=parseInt(month2)
    if(month1<month2){
        return -1
    }
    if(month1>month2){
        return 1
    }
    let [day1,leftTime1] = leftDay1.split('日')
    let [day2,leftTime2] = leftDay2.split('日')
    day1=parseInt(day1)
    day2=parseInt(day2)
    if(day1<day2){
        return -1
    }
    if(day1>day2){
        return 1
    }
    time1 = leftTime1.split(' ')[1]
    time2 = leftTime2.split(' ')[1]
    return time1.localeCompare(time2)
}

function getId(node){
    let cardObj = node.querySelector('.notice-card-object')
    if(cardObj){
        let idNode = cardObj.querySelector('.text-muted')
        if(idNode){
            return idNode.textContent
        }
    }
    return ''
}
 
(function() {
    'use strict';
    // let showFinished=true
    //let btn=null
    
    let cnt=0
    changePriorityWidth()
    setInterval(()=>{
        shortcutContainerAdjustment()
        addHideChildrenLogic()
        cnt++
        
        if(cnt%60===0){
            refreshUnread()
        }
        addArchiveChildrenLogic()
        hideYearJump()
        addCreateChildrenLogic()
        initBtn()
    },1000)
// type 4 -task
// https://onetoken.pingcode.com/api/agile/work-item POST
// due: {date: 1647964799, with_time: 0}
function createSubTask(parentId,projectId,title,type,due){
    let data = {parent_id:parentId,project_id:projectId,title,due,type}
    $.ajax({
        url: `https://onetoken.pingcode.com/api/agile/work-item`,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data:JSON.stringify(data),
        async: true,
        cache: false,
        timeout: 30000,
        success:  (res)=> {
        },
        error: (request, status, error)=> {
            console.log(error)
        },
        type: "POST"
    });
}
function addCreateBtn(agileDetail,id){
    if(agileDetail){
        let itemListParent = agileDetail.querySelector('.sub-work-item-list')
        if(itemListParent){
            if(agileDetail.querySelector('#createChildrenBtn')===null){
                let obj={btn:null,showFinished:true}
                obj.btn = document.createElement('div')
                obj.btn.textContent='批量创建子任务'
                obj.btn.id='createChildrenBtn'
                obj.btn.style='color:#aaa;cursor:pointer;width:120px;'
                agileDetail.insertBefore(obj.btn, agileDetail.firstChild)
                obj.btn.addEventListener('click',()=>{
                    showConfirm('确定批量创建子任务？',()=>{
                        $.ajax({
                            url: `https://onetoken.pingcode.com/api/agile/work-items/${id}`,
                            dataType: "json",
                            async: true,
                            cache: false,
                            timeout: 30000,
                            success:  (res)=> {
                                if(res.code===200){
                                    let data=res.data
                                    let itemData=data.value
                                    createSubTask(id,itemData.project_id,'产品方案',4,itemData.due)
                                    createSubTask(id,itemData.project_id,'前端开发',4,itemData.due)
                                    createSubTask(id,itemData.project_id,'后端开发',4,itemData.due)
                                    createSubTask(id,itemData.project_id,'测试',4,itemData.due)
                                    createSubTask(id,itemData.project_id,'产品验收',4,itemData.due)
                                    alert('已批量生成子任务，请刷新后查看')
                                } else{
                                    console.log('code is not 200, but',res.code)
                                }
                            },
                            error: (request, status, error)=> {
                                console.log(error)
                            },
                            type: "GET"
                        });
                    })
                })
            }
            
        }
    }
}
function getAgileDetail(){
    let allAgileDetails = document.querySelectorAll('.agile-work-item-detail-work-item')
    let agileDetail=null
    if(allAgileDetails.length>0){
        agileDetail=allAgileDetails[allAgileDetails.length-1]
    }
    else{
        let allAgileDetailChildren = document.querySelectorAll('.agile-work-item-detail-children')
        if(allAgileDetailChildren.length>0){
            agileDetail=allAgileDetailChildren[allAgileDetailChildren.length-1]
        }
    }
    return agileDetail
}
function getAgileLastChild(){
    let allAgileDetailChildren = document.querySelectorAll('.agile-work-item-detail-children')
    if(allAgileDetailChildren.length>0){
        return allAgileDetailChildren[allAgileDetailChildren.length-1]
    }
    return null
}
function addCreateChildrenLogic(){
    let agileDetail=getAgileLastChild()
    if(agileDetail===null||agileDetail.querySelector('#createChildrenBtn')!==null){
        return
    }
    let containers = document.querySelectorAll('.thy-dialog-container')
    if(containers.length>0){
        let currentContainer = containers[containers.length-1]
        let statusEl = currentContainer.querySelector('.thy-label-emboss-status')
        if(statusEl){
            let taskType=statusEl
            .querySelector('.font-size-sm')?.innerHTML
            if(taskType!=='用户故事'){
                return
            }
            if(!currentContainer.querySelector('thy-list-item')){
                let currentId = currentContainer.id.split('-')[0]
                addCreateBtn(agileDetail,currentId)
                
            }
        }
        
    }
}
function addArchiveChildrenLogic(){
    let agileDetail=getAgileDetail()
    if(agileDetail===null||agileDetail.querySelector('#archiveBtn')!==null){
        return
    }
    let containers = document.querySelectorAll('.thy-dialog-container')
    if(containers.length>0){
        let currentContainer = containers[containers.length-1]
        let currentId = currentContainer.id.split('-')[0]
        $.ajax({
            url: `https://onetoken.pingcode.com/api/agile/work-items/${currentId}`,
            dataType: "json",
            async: true,
            cache: false,
            timeout: 30000,
            success:  (res)=> {
                if(res.code===200){
                    let data=res.data
                    let itemData=data.value
                        addArchiveBtn(itemData.child_ids,agileDetail,2)
                        addArchiveBtn(itemData.child_ids,agileDetail,10)
                        addArchiveBtn(itemData.child_ids,agileDetail,30)
                } else{
                    console.log('code is not 200, but',res.code)
                }
            },
            error: (request, status, error)=> {
                console.log(error)
            },
            type: "GET"
        });
    }
}
function addArchiveBtn(idList,agileDetail,cutoffDays){
    if(!agileDetail){
        return
    }
    let itemListParent = agileDetail.querySelector('.sub-work-item-list')
    if(!itemListParent){
        return
    }
    let itemList = itemListParent.querySelectorAll('.work-items-list-item')
    if(itemList.length ==0){
        return
    }
    if(agileDetail.querySelector(`#archiveBtn${cutoffDays}`)===null){
        let obj={btn:null,showFinished:true}
        obj.btn = document.createElement('button')
        obj.btn.textContent=`归档${cutoffDays}天前的子任务`
        obj.btn.id=`archiveBtn${cutoffDays}`
        obj.btn.style='color:#aaa;cursor:pointer'
        agileDetail.insertBefore(obj.btn, agileDetail.firstChild)
        obj.btn.addEventListener('click',()=>{
            getItemList(idList).then(workItems=>{
                let toArchive = []
                let cutoffTime = Date.now()-cutoffDays*24*3600*1000
                workItems.forEach(item=>{
                    let isWorkEnd = item.state_type===3||item.state_type===4
                    let itemLastUpdated = item.updated_at*1000
                    if(isWorkEnd&&itemLastUpdated<cutoffTime){
                        toArchive.push(item)
                    }
                })
                if(toArchive.length>0){
                    showArchiveList(toArchive,agileDetail)
                } else {
                    alert('无可归档任务')
                }
            })
        })
    }
}
let confirmObj= {callback:()=>{}}
function showConfirm(message,callback){
    let popupWin = document.querySelector('#pingcode-confirm-window')
    if(!popupWin){
        popupWin = document.createElement('div')
        popupWin.id='pingcode-confirm-window'
        popupWin.style = "background-color:gray;border-radius: 5px;word-wrap: break-word;position: absolute;top: 100px;max-width:400px;left: 40%;z-index:10000;height:auto; overflow:auto;padding:10px;"
        let titleEl = document.createElement('h4')
        titleEl.innerText=message
        popupWin.appendChild(titleEl)
        let btnDiv = document.createElement('div')
        btnDiv.style='margin-top:10px;'
        popupWin.appendChild(btnDiv)
        let confirmBtn = document.createElement('button')
        confirmBtn.innerText='确定'
        confirmBtn.style="cursor:pointer;border-radius: 3px;"
        let cancelBtn = document.createElement('button')
        cancelBtn.style='margin-left:15px;cursor:pointer;border-radius: 3px;'
        cancelBtn.innerText='取消'
        btnDiv.appendChild(confirmBtn)
        btnDiv.appendChild(cancelBtn)
        cancelBtn.addEventListener('click',()=>{
            popupWin.style.display='none'
        })
        confirmBtn.addEventListener('click',()=>{
            confirmObj.callback()
            popupWin.style.display='none'
        })
        document.body.appendChild(popupWin)
    }
    popupWin.style.display=''
    popupWin.querySelector('h4').innerText=message
    confirmObj.callback = callback
}
function getItemList(idList){
    let promises = []
    idList.forEach(id=>{
        promises.push(getWorkItem(id))
    })
    return Promise.all(promises)
}
function getWorkItem(id){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url: `https://onetoken.pingcode.com/api/agile/work-items/${id}`,
            dataType: "json",
            async: true,
            cache: false,
            timeout: 30000,
            success:  (res)=> {
                if(res.code===200){
                    let data=res.data
                    let itemData=data.value
                    itemData.state_name = data.references.lookups.states[0].name
                    resolve(itemData)
                } else{
                    reject()
                }
            },
            error: (request, status, error)=> {
                reject(error)
            },
            type: "GET"
        });
    })
}
 
function checkIfArchive(id,cutoffDays){
    let cutoffTime = Date.now()-cutoffDays*24*3600*1000
    $.ajax({
        url: `https://onetoken.pingcode.com/api/agile/work-items/${id}`,
        dataType: "json",
        async: true,
        cache: false,
        timeout: 30000,
        success:  (res)=> {
            if(res.code===200){
                let data=res.data
                let itemData=data.value
                let isWorkEnd = itemData.state_type===3||itemData.state_type===4
                let itemLastUpdated = itemData.updated_at*1000
                if(isWorkEnd&&itemLastUpdated<cutoffTime){
                    $.ajax({
                        url: `https://onetoken.pingcode.com/api/agile/work-items/${id}/archive`,
                        dataType: "json",
                        data: {},
                        async: true,
                        cache: false,
                        timeout: 10000,
                        success: function (data) {
                        },
                        error: function (request, status, error) {
                            console.log(error)
                        },
                        type: "PUT"
                    });
                } else {
                    console.log('skip',id)
                }
            } else{
                console.log(res.code)
            }
        },
        error: (request, status, error)=> {
            console.log(error)
        },
        type: "GET"
    });
}
function addHideChildrenLogic(){
    let agileDetail = getAgileDetail()
    if(agileDetail){
        let itemListParent = agileDetail.querySelector('.sub-work-item-list')
        if(itemListParent){
            let itemList = itemListParent.querySelectorAll('.work-items-list-item')
            if(itemList.length>0){
                if(agileDetail.querySelector('#displayBtn')===null){
                    let obj={btn:null,showFinished:true}
                    obj.btn = document.createElement('span')
                    obj.btn.textContent=obj.showFinished?'隐藏已完成':'显示已完成'
                    obj.btn.id='displayBtn'
                    obj.btn.style='color:#aaa;cursor:pointer'
                    agileDetail.insertBefore(obj.btn, agileDetail.firstChild)
                    obj.btn.addEventListener('click',()=>{
                        toggleShowFinished(agileDetail,obj)
                    })
                }
            }
        }
    }
}
function changePriorityWidth(){
    var sheet = document.createElement('style')
    sheet.innerHTML = ".agile .agile-work-items-list-item-container .work-item-priority {width: 8px;}";
    document.body.appendChild(sheet);
}
 
function isEnd(workItem){
    let status=workItem.querySelector('.flexible-text-container').textContent
    return status==='关闭'||status==='已完成'
}
function shortcutContainerAdjustment(){
    let shortcutContainer=document.querySelector('.shortcut-container')
    if(shortcutContainer){
        let tableContent = document.querySelector('.styx-table-content')
        if(tableContent){
            if(shortcutContainer.offsetHeight>0){
                tableContent.style='margin-bottom:28px'
            }
            else{
                tableContent.style='margin-bottom:0px'
            }
        }
    }
}
 
 
function toggleShowFinished(agileDetail,obj){
    obj.showFinished=!obj.showFinished
    obj.btn.textContent=obj.showFinished?'隐藏已完成':'显示已完成'
    if(obj.showFinished){
        let workItems=agileDetail.querySelectorAll('.work-item-info')
        for(let item of workItems){
            item.parentElement.parentElement.style='display:block'
        }
        
    } else {           
        let workItems=agileDetail.querySelectorAll('.work-item-info')
        for(let item of workItems){
            let status=item.querySelector('.flexible-text-container').textContent
            if(status==='关闭'||status==='已完成'||status==='已修复'||status==='已拒绝'){
                item.parentElement.parentElement.style='display:none'
            }
        }
    }
}
    // Your code here...
    
})();
