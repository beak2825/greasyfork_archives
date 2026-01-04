// ==UserScript==
// @name         zentao4HAT-4
// @namespace    http://www.akuvox.com/
// @version      1.10
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
// @downloadURL https://update.greasyfork.org/scripts/495646/zentao4HAT-4.user.js
// @updateURL https://update.greasyfork.org/scripts/495646/zentao4HAT-4.meta.js
// ==/UserScript==

let useDom = '';
let belong = '';
let container = '';
// BUG原因选中填写成外部的id
const externalIdArray = ['2','3','4','5','6','8','9','10','11', '12'];
(async function () {
    'use strict';
    setTimeout(async () => {
        useDom = document.getElementById('userMenu')
        belong = useDom.getElementsByTagName('a')[0].textContent.trim()
        container = document.getElementsByClassName('main-side')[0]
        if (!window.location.href.includes('bug-edit-')) {
            await createBugReason()
            if(['黄长发', '王居辉'].includes(belong)){
                await createReviewSelect()
                await createBugLevel()
                await createUnresolve()
                await createActivationBug()
            }
        }
    }, 1000)

    await bugAssignment()
})();
// 组长权限是否展示
const isShowHight = () => !['黄长发','黄耀鹏', '王居辉'].includes(belong)


async function createBugReason() {
    const titlebarElement = document.getElementById("titlebar");
    const valueElement = titlebarElement.querySelector(".prefix strong");
    const bugid = valueElement.innerText
    const getAllResult = async (url = `http://192.168.10.51:51081/api/zentao/findBugReason`) => {
        return new Promise(async (resolve) => {
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: belong })
            })

            try {
                let res = await result.json()
                resolve(res)
            } catch (e) {
                resolve('')
            }
        })
    }
    const result = await getAllResult()
    const newResult = result.result
    const bugAllType = newResult.bugAllType
    const newType = newResult.newType
    let optionHtml = ''
    newType.forEach((v, i) => {
        let addTtml = ``
        if (!i) {
            addTtml = `<option value="${v.id}">${v.title}</option>`
        } else {
            addTtml = `<option value="${v.id}">${v.title}</option>`
        }

        optionHtml = optionHtml + `<option value="${v.id}">${v.title}</option>`
    })
    const div2 = document.createElement("div");
    div2.style = "border:1px solid #ccc;padding:10px;width: 340px;margin-top: 10px;"
    div2.innerHTML = `
    <div style="text-align: right;color: #036;"><span class="ak-new-scoreButton" style="cursor: pointer;">提交</span></div>
    <div>
    BUG原因:
        <select id="aku-skills" name="skills">${optionHtml}</select>
    </div>
     `
    container.appendChild(div2);
    const noUnresolevButton = document.querySelector('.ak-new-scoreButton')
    noUnresolevButton.addEventListener('click', function (e) {
        // 获取下拉框的值
        const selectDom = document.querySelector('#aku-skills')
        const index = selectDom.selectedIndex;
        const type = selectDom.options[index].value;
        const title = selectDom.options[index].text;
        fetch(`http://192.168.10.51:51081/api/TerminalController/updateScore`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    bugid,
                    type,
                    scopeType: title,
                    score: '1',
                    repair_time: 0
                }
            )
        })
        if(externalIdArray.includes(type)) {
            postBugBelongurl(bugid)
        }
    })
    // 获取bug数据
    const getDetail = async (url = `http://192.168.10.51:51081/api/TerminalController/findZentaobugId`) => {
        return new Promise(async (resolve) => {
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bugid: bugid })
            })

            try {
                let res = await result.json()
                resolve(res)
            } catch (e) {
                resolve('')
            }
        })
    }
    const { result: detailResult } = await getDetail()
    if (detailResult?.id) {
        //首先获得下拉框的节点对象；
        const selectDom = document.querySelector('#aku-skills')
        Object.keys(selectDom).forEach(v => {
            const kObj = selectDom[v]
            if(Number(kObj.value) === detailResult.type) {
                kObj.selected = true
            }
        })
    }
}
// 不予解决bug的列表
async function createUnresolve() {
    // 拦截
    if (isShowHight()) {
        return
    }
    const container = document.getElementsByClassName('main-side')[0]
    const div2 = document.createElement("div");
    div2.style = "border:1px solid #ccc;padding:10px;width: 340px;margin-top: 10px;"
    div2.innerHTML = `
        <div id="no-unresolev-bottom">
            <div>不予解决BUG评审: <button id="no-unresolev-button">打开全部</button></div>
            <div id="no-unresolev-bottom-show"></div>
        </div>`


    container.appendChild(div2);
    const noUnresolevBottom = document.getElementById('no-unresolev-bottom')
    noUnresolevBottom.style.overflow = 'auto'

    const getAllResult = async (url = `http://192.168.10.51:51081/api/zentao/selectBugStatus`) => {
        return new Promise(async (resolve) => {
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type: '不予解决' })
            })

            try {
                let res = await result.json()
                resolve(res)
            } catch (e) {
                resolve('')
            }
        })
    }
    const allArray = await getAllResult()
    const allArr = allArray.result.map(v => {
        return { ...v, id: v.bugid }
    })
    const noUnresolevBottomShow = document.getElementById('no-unresolev-bottom-show')
    const noUnresolevButton = document.getElementById('no-unresolev-button')
    noUnresolevButton.addEventListener('click', function (e) {
        allArr.forEach(v => {
            console.log(v)
            const goUrl = window.location.origin + `/zentao/bug-view-${v.id}.html`
            window.open(goUrl)
        })
    })
    allArr.forEach(v => {
        const spanTe = document.createElement("span");
        spanTe.style = "color: blue;cursor: pointer;"
        spanTe.innerHTML = v.id + ';'
        noUnresolevBottomShow.appendChild(spanTe);
        spanTe.addEventListener('click', function (e) {
            const bugTId = e.srcElement.outerText.slice(0, -1);
            const goUrl = window.location.origin + `/zentao/bug-view-${bugTId}.html`
            window.open(goUrl)
        })
    })
}
// bug等级调整列表
async function createBugLevel() {
    const div3 = document.createElement("div")
    div3.style = "border:1px solid #ccc;padding:10px;width: 340px;margin-top: 10px;"
    div3.innerHTML = `
        <div id="no-level-open-bottom">
            <div>BUG等级需评审: <button id="no-level-open">打开全部</button></div>
            <div id="no-level-open-show"></div>
        </div>`
    container.appendChild(div3);
    const noLevelOpenBottom = document.getElementById('no-level-open-bottom')
    const noLevelOpenShow = document.getElementById('no-level-open-show')
    const nolevelButton = document.getElementById('no-level-open')

    noLevelOpenBottom.style.overflow = 'auto'
    const getSomeBugData = async () => {
        return new Promise(async (resolve) => {
            const result = await fetch(`http://192.168.10.51:51081/api/zentao/selectFindUnClosed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ noSend: true })
            })

            try {
                let res = await result.json()
                resolve(res)
            } catch (e) {
                resolve('')
            }
        })
    }
    const someBugData = await getSomeBugData()
    someBugData.filterArray.forEach(v => {
        const spanTe = document.createElement("span");
        spanTe.style = "color: blue;cursor: pointer;"
        spanTe.innerHTML = v.id + ';'
        noLevelOpenShow.appendChild(spanTe);
        spanTe.addEventListener('click', function (e) {
            const bugTId = e.srcElement.outerText.slice(0, -1);
            const goUrl = window.location.origin + `/zentao/bug-view-${bugTId}.html`
            window.open(goUrl)
        })
    })
    nolevelButton.addEventListener('click', function (e) {
        someBugData.filterArray.forEach(v => {
            const goUrl = window.location.origin + `/zentao/bug-view-${v.id}.html`
            window.open(goUrl)
        })
    })
}


// bug评审列表创建
async function createReviewSelect() {
    // 拦截
    if (isShowHight()) {
        return
    }
    const getData = async () => {
        return new Promise(async (resolve) => {
            const result = await fetch(`http://192.168.10.51:51081/api/zentao/selectedZentaoReason`, {
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
    const res = await getData()
    const reasonArray = res.result.secondData
    // 创建列表
    const container = document.getElementsByClassName('main-side')[0]
    const div = document.createElement("div");
    div.style = "border:1px solid #ccc;padding:10px;width: 340px;margin-top: 10px;"
    div.innerHTML = `
        <div>
            <div style="color: #036;display: flex;justify-content: space-around;">
                <span class="scoreButton" style="color: black;">BUG评审</span>
                <span class="scoreButton" style="cursor: pointer;text-align: right;" id="statusunresolveButton">提交</span>
            </div>
            <div>
                <span>评审状态:</span>
                <input class="aku-status" type="radio" id="bugPass" name="unresolve" value="pass" />
                <label for="huey">通过</label>
                <input class="aku-status" type="radio" id="bugNoPass" name="unresolve" value="nopass" />
                <label for="huey">不通过</label>
            </div>
            <div id="select-reason" style="max-height: 200px;overflow: auto;"></div>
        </div>
        `
    container.appendChild(div);
    const reasonBox = document.getElementById('select-reason')
    reasonArray.forEach(v => {
        reasonBox.innerHTML = reasonBox.innerHTML + `
            <div>
                <div>${v.title}</div>
                <div id="akuOne-${v.id}" style="display: flex;flex-wrap: wrap;"></div>
            </div>
        `
        // 循环插入二级节点
        const getOneDom = document.getElementById(`akuOne-${v.id}`)
        v.children.forEach(k => {
            getOneDom.innerHTML = getOneDom.innerHTML + `
                <div style="margin-left: 5px;">
                    <input type="radio" id="second-${k.title}" name="${k.parentid}" value="${k.id}" class="akuBugReason"/> ${k.title}
                </div>
            `
        })
    })
    // 基础信息获取
    const titlebarElement = document.getElementById("titlebar");
    const valueElement = titlebarElement.querySelector(".prefix strong");
    const bugid = valueElement.innerText
    const passStatus = document.getElementsByClassName('aku-status')
    const akuBugReasonDom = document.getElementsByClassName('akuBugReason')

    const titleDom = document.getElementsByClassName('heading')
    const bugTitle = titleDom[0].innerHTML
    const getIsPass = () => {
        let nowChecked = {}
        Object.keys(passStatus).forEach(v => {
            if (passStatus[v].checked) {
                nowChecked = passStatus[v]
            }
        })
        return nowChecked?.value ?? ''
    }
    const getReasonid = () => {
        let reasonId = ''
        Object.keys(akuBugReasonDom).forEach(v => {
            if (akuBugReasonDom[v].checked) {
                reasonId = reasonId + akuBugReasonDom[v].value + ';'
            }
        })
        return reasonId
    }
    // bug信息初始化 获取数据库信息
    const getBugDetail = async () => {
        return new Promise(async (resolve) => {
            const result = await fetch(`http://192.168.10.51:51081/api/zentao/selectIdBugStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bugid: bugid
                })
            })

            try {
                let res = await result.json()
                resolve(res)
            } catch (e) {
                resolve('')
            }
        })
    }
    const setIsPass = () => {
        Object.keys(passStatus).forEach(v => {
            if (passStatus[v].value === nowDetail.ispass) {
                passStatus[v].checked = true
            }
        })
    }
    const setReasonId = () => {
        if(!nowDetail.reasonid) return
        Object.keys(akuBugReasonDom).forEach(v => {
            if (nowDetail.reasonid.includes(akuBugReasonDom[v].value)) {
                akuBugReasonDom[v].checked = true
            }
        })
    }
    const getResult = await getBugDetail()
    let nowDetail = {}
    const getAllResult = getResult?.result
    if(getAllResult.length) {
        nowDetail = getAllResult[0]
        setIsPass()
        setReasonId()
    }


    // bug提交
    const submitButton = document.getElementById("statusunresolveButton")
    submitButton && submitButton.addEventListener('click', function () {
        const sendObj = {
            bugid: bugid,
            ispass: getIsPass(),
            reasonid: getReasonid(),
            title: bugTitle
        }
        // 点击提交更新数据库
        fetch(`http://192.168.10.51:51081/api/zentao/saveZentaoStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendObj)
        })
    })
}

// 激活bug调整列表
async function createActivationBug(){
    const div4 = document.createElement("div")
    div4.style = "border:1px solid #ccc;padding:10px;width: 340px;margin-top: 10px;"
    div4.innerHTML = `
        <div id="no-level-active-bottom">
            <div>激活BUG需评审: <button id="no-active-open">打开全部</button></div>
            <div id="no-level-active-show"></div>
        </div>`
    container.appendChild(div4);
    const noLevelOpenBottom = document.getElementById('no-level-active-bottom')
    const noLevelOpenShow = document.getElementById('no-level-active-show')
    const nolevelButton = document.getElementById('no-active-open')

    noLevelOpenBottom.style.overflow = 'auto'
    const getSomeBugData = async () => {
        return new Promise(async (resolve) => {
            const result = await fetch(`http://192.168.10.51:51081/api/zentao/notificationActivationBug`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ noSend: true })
            })

            try {
                let res = await result.json()
                resolve(res)
            } catch (e) {
                resolve('')
            }
        })
    }
    const someBugData = await getSomeBugData()
    someBugData.filterArray.forEach(v => {
        const spanTe = document.createElement("span");
        spanTe.style = "color: blue;cursor: pointer;"
        spanTe.innerHTML = v.bugid + ';'
        noLevelOpenShow.appendChild(spanTe);
        spanTe.addEventListener('click', function (e) {
            const bugTId = e.srcElement.outerText.slice(0, -1);
            const goUrl = window.location.origin + `/zentao/bug-view-${bugTId}.html`
            window.open(goUrl)
        })
    })
    nolevelButton.addEventListener('click', function (e) {
        someBugData.result.forEach(v => {
            console.log(v)
            const goUrl = window.location.origin + `/zentao/bug-view-${v.bugid}.html`
            window.open(goUrl)
        })
    })
}


const postBugBelongurl = async(bugid)=>{
    return new Promise(async (resolve)=>{
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
async function bugAssignment(){
    const userName = document.getElementById('userMenu').children[0].text.trim()

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
            if(iframe.URL.includes('assignTo')){
                // 配置观察器以监视子节点button的添加，然后操作
                var observer = new MutationObserver(function(mutationsList) {
                    for (var mutation of mutationsList) {
                        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                            const button = iframe.getElementById("submit")
                            if (button) {
                                setIframe()
                                observer.disconnect();
                            }
                            break;
                        }
                    }
                });

                observer.observe(iframe, { childList: true, subtree: true });
            }
        });
    }

    const getMember = async()=>{
        const memberRes = await fetch('http://192.168.10.51:51081/api/task/getTerminalMember', {
            method: 'GET',
        })
        const member = await memberRes.json()

        const memberMap = {}

        const group = ['andy','嵌入式','长发','Python']

        member.result.forEach(item=>{
            if(group.includes(item.t_group)){
                memberMap[item.username] = {
                    robot:item.robot,
                    position:item.position,
                }
            }
        })

        return memberMap
    }

    const webhook = (robot)=>{
        fetch('http://192.168.10.51:51081/api/task/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content:`有新的bug经过现场分析指派\n[${window.location.href}](${window.location.href})`,
                robot
            })
        })
    }

    async function setIframe(){
        const member = await getMember()

        const currentPosition = member[userName].position

        const iframe = document.getElementById("modalIframe").contentWindow.document

        const checkedTd = iframe.querySelector('tr').querySelectorAll('td')[1]

        // 创建复选框元素
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = '现场分析';

        // 创建文本节点
        const label = document.createElement('label');
        label.htmlFor = '现场分析';
        label.appendChild(document.createTextNode('是否已现场分析'));

        // 将复选框和文本插入到容器中
        checkedTd.appendChild(checkbox);
        checkedTd.appendChild(label);

        checkedTd.style.visibility = 'hidden';

        // 设置label的样式
        label.style.margin = '0';
        label.style.marginLeft = '5px';

        const submitButton = iframe.getElementById("submit")

        const targetDiv = iframe.getElementById('assignedTo_chosen');

        let selectUser = ''

        let robot = ''

        submitButton&&submitButton.addEventListener('click', function() {
            checkbox.remove()
            label.remove()
            if(robot){
              //  webhook(robot)
            }
        });

        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(async(mutation) => {
                if (mutation.type === 'childList') {
                    const text = targetDiv.querySelector('.chosen-single').text||''
                    const assignUser = extractName(text)

                    if(selectUser === assignUser)return

                    const assignPosition = member[assignUser]?.position || ''

                    if(assignPosition&&assignPosition!==currentPosition){

                        checkedTd.style.visibility = '';

                        robot = member[assignUser]?.robot || ''

                        checkbox.checked = false;

                    } else {

                        checkedTd.style.visibility = 'hidden';

                        robot = ''

                        checkbox.checked = false;

                    }
                    selectUser = assignUser
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

    function extractName(str) {
        const match = str.match(/:\s*(.*?)\s*-/);
        return match ? match[1].replace(/\s+/g, '') : null;
    }
}
