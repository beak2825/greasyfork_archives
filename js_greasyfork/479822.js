// ==UserScript==
// @name         JiraSplitPlugin
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  jira 提单自动填充父需求属性
// @author       郑潇锐
// @license MIT
// @match        https://lingjuninvest.atlassian.net/jira/software/c/projects/*/boards/*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479822/JiraSplitPlugin.user.js
// @updateURL https://update.greasyfork.org/scripts/479822/JiraSplitPlugin.meta.js
// ==/UserScript==
// 时序方面值得继续优化

var _curPriorityName = "Medium" // 当前选择的优先级
var _cardList = [] // Project面板上的每个待办
var _curSelectKey = "" // 当前选择的
var isListenner = false
//根据Issue Key获取对应Issue的数据
async function getIssueFields(){
    try{
        const res = await axios.get(`https://lingjuninvest.atlassian.net/rest/api/2/issue/${_curSelectKey}`)
        return res.data.fields
    }catch(err){
        return err
    }
}

function getDomOfPriorityDOM(){
    return $("#priority-field").closest("div").parent().parent()
}

function getDomOfPriorityOptionList(jqueryDOM){
    return jqueryDOM.next().children(":first").children(":first")
}

function getDomOfSelectLink(){
    return $("#issuelinks-container").children(":first").children(":eq(1)").children(":first").children(":eq(1)").children(":first").children(":first").children(":eq(2)")
}

function getDomOfSelectLinkList(){
    return $("#issuelinks-container").children(":first").children(":eq(1)").children(":first").children(":eq(1)").children(":first").children(":first").children(":eq(3)").children(":first").children(":first").children(":first").children(":eq(1)").children()
}

function getProject(){
    return $("#issue-create-modal-dropzone-container").children(":first").children(":eq(1)").children(":first").children(":eq(1)").children(":eq(2)").children(":first").children(":first").children(":first").children(":eq(1)").children(":first")[0]
}

function getIssueType(){
    return $('#issue-create-modal-dropzone-container').children(":first").children(":eq(2)").children(":first").children(":eq(1)").children(":eq(2)").children(":first").children(":first").children(":first").children(":eq(1)").children(":first")[0]
}

function setPriority(list,priority){
    if(priority.name === _curPriorityName)return
    const priorityList = ['vip-highest','vip-high','vip','Highest','High','Low','Lowest']
    const index = priorityList.findIndex((name) => name === priority.name)
    _curPriorityName = priority.name
    list.children(`:eq(${index})`).trigger("click")
}

// 面板上添加 “拆分” 按钮
function setCreateIssueButton(){
    //获取当前页面的待办
    _cardList = $('[id^="card-REQC-"]');
    _cardList.each((index,item) => {
        // 任务不可继续拆分，故跳过
        if($(item).find( 'img[alt="任务"]').length)return
        // 截取出Issue的Key，例如：REQC-1234
        const key = item.id.slice(5)

        var button = document.createElement("button");
        button.innerHTML = "拆分";
        button.style.position = "absolute";
        button.style.top = "45px";
        button.style.right = "10px";

        var parentElement = document.getElementById(`card-${key}`);
        button.addEventListener("click", (event) => {
            splitIssue(event,key)
        });
        parentElement.appendChild(button);
    })
}

// 拆分Issue
function splitIssue(event,key) {
    //设置当前选择的Key
    _curSelectKey = key

    //打断事件，防止触发别的回调
    event.stopImmediatePropagation()
    event.stopPropagation()

    // 调用创建Issue的回调
    $('#createGlobalItem').trigger("click")

    // 打开创建Issue面板 默认Priority为Medium
    _curPriorityName = "Medium"
    const interval = setInterval(() => {
        // 监听关闭按钮
        const closeBtn = $('[data-testid="minimizable-modal.ui.modal-container.modal-header.close-button"]')[0]
        closeBtn.addEventListener("click",() => {
            console.log("clear")
            _curSelectKey = ""
            clearInterval(interval)
        })

        const project = getProject()
        const IssueType = getIssueType()

        // 提示：Project为对接服务时，不可继续拆分为任务
        if(project && project.innerText && project.innerText.includes("对接服务") && IssueType.innerText.includes("任务")){
            if($("#alarm-tag").length)return
            const tag = document.createElement("span")
            tag.innerHTML = "Project为对接服务时，不可继续拆分为任务"
            tag.style.color = "red"
            tag.id = "alarm-tag"
            $(".ak-renderer-document")[0].appendChild(tag)
            return
        }

        // 如果已经添加了一键填充按钮，则直接返回
        if($("#autofill").length)return

        // 新增一键填充
        const div = document.createElement("div")
        div.style.marginTop = "10px"
        div.id = "autofill"
        //summary-container
        const hr = document.createElement("hr")
        const div1 = document.createElement("div")
        div1.style.marginTop = "20px"
        $("#summary-container")[0].after(div)
        $("#summary-container")[0].after(hr)
        $("#summary-container")[0].after(div1)


        const btn = document.createElement("div")
        btn.innerHTML = "一键填充"
        // 设置div的样式
        btn.style.padding = '5px';
        btn.style.border = '1px solid black';
        btn.style.backgroundColor = 'rgb(12,102,228)';
        btn.style.color = 'white'
        btn.style.cursor = 'pointer';
        btn.style.display = 'inline-block'
        btn.onclick = createIssue

        const tag1 = document.createElement("span")
        tag1.innerHTML = `   点击按钮或`

        const tag2 = document.createElement("span")
        tag2.innerHTML = "快捷键Ctrl+Z"

        tag2.style.color = "red"
        const tag3 = document.createElement("span")

        tag3.innerHTML = "继承父需求中的属性"
        div.appendChild(btn)
        div.appendChild(tag1)
        div.appendChild(tag2)
        div.appendChild(tag3)
    },1000)
    }

function autofillEpic(parent){
    if(!parent || !parent.key)return
    const key = parent.key
    const dom = $('#parent-container').find('[id$="live-region"]').first().next().next()
    dispatchMouseDownEvent(dom[0])
    setTimeout(() => {
        $('#parent-container').find('[id$="option-0"]').parent().children().each((index,element) => {
            const curDom = $(element).children(":first").children(":first").children(":first").children(":first").children(":first").children(":eq(2)")[0]
            if(curDom.innerHTML === key){
                $(element).trigger("click")
                return false
            }
        })
    },900)
}

function autofillLabels(labels){
    if(!Array.isArray(labels) || !labels.length)return
    const dom = $('#labels-container').find('[id$="live-region"]').first().next().next()
    dispatchMouseDownEvent(dom[0])

    function cycle(index){
        if(index >= labels.length)return
        runReactOnChange($("#labels-field")[0],labels[index])
        setTimeout(() => {
            $('#labels-container').find('[id$="option-1-0"]').parent().children().each((_index,element) => {
                if(element.innerText === labels[index]){
                    $(element).trigger("click")
                }
            })
        },1000)
        setTimeout(() => {cycle(index+1)},1100)
    }
    setTimeout(() => {
        cycle(0)
    },100)
}

function autofillAssignee(){
    $('[data-testid="issue-create-commons.ui.assignee-field.assing-to-me-button"]').trigger("click")
}

function autofillPriority(priority){
    const dom = getDomOfPriorityDOM()
    dispatchMouseDownEvent(dom[0])
    setTimeout(() => {
        const list = getDomOfPriorityOptionList(dom)
        setPriority(list,priority)
    },200)
}

// 自动填充当前的Active Sprint
function autofillSprints(){
    const dom = $('#customfield_10020-container').find('[id$="live-region"]').first().next().next()
    dispatchMouseDownEvent(dom[0])
    setTimeout(() => {
        $('#customfield_10020-container').find('[id$="option-0-0"]').first().trigger("click")
    },1000)
}

// 自动block对应的Issue
function autofillBlocks(){
    const dom = getDomOfSelectLink()
    dispatchMouseDownEvent(dom[0])
    setTimeout(() => {
        runReactOnChange($('#issuelinks-field-label').parent().find("input:eq(1)")[0],_curSelectKey)
    },100)
    setTimeout(() => {
        const list = getDomOfSelectLinkList()
        list.each((_index,element) => {
            const text = $(element).children(":first").children(":eq(1)")[0].innerText
            if(text.includes(_curSelectKey)){
                element.click()
                return false
            }
        })
    },1000)
}

// 触发Dom的mousedown事件
function dispatchMouseDownEvent(dom){
    const e = document.createEvent("MouseEvents");
    e.initEvent("mousedown", true, false);
    dom.dispatchEvent(e)
}

// 调用React组件绑定的OnChange函数
function runReactOnChange(ele,value){
    Object.keys(ele).forEach(function(key){
        if(/^__reactInternalInstance/.test(key)){
            ele[key].memoizedProps.onChange({currentTarget: {value: value}})
        }
    })
}

function createIssue(){
    console.log("stop")
    event.stopImmediatePropagation()
    event.stopPropagation()
    const project = getProject()
    const IssueType = getIssueType()

    getIssueFields().then((res) => {
        autofillAssignee()
        autofillBlocks()
        setTimeout(() => {
            autofillPriority(res.priority)
        },1000)
        setTimeout(() => {
            if(IssueType && IssueType.innerText && (IssueType.innerText.includes("需求") || IssueType.innerText.includes("缺陷")))autofillEpic(res.parent)
        },2000)
        setTimeout(() => {
            autofillSprints()
        },3200)
        setTimeout(() => {
            if(project && project.innerText && project.innerText.includes("对接服务"))autofillLabels(res.labels)
        },4500)
    })
}

function selectPriority(priority){
    const dom = getDomOfPriorityDOM()
    const e = document.createEvent("MouseEvents");
    e.initEvent("mousedown", true, false);
    dom[0].dispatchEvent(e)
    setTimeout(() => {
        const list = getDomOfPriorityOptionList(dom)
        setPriority(list,priority)
    },200)
}

(function () {
    // 定义一个变量来存储定时器的ID
    let timeoutId;

    // 定义一个函数来处理滚动事件
    function handleScroll() {
        // 如果已经有定时器在运行，则清除它
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null
        }

        // 设置一个新的定时器，在指定的时间间隔后执行函数
        timeoutId = setTimeout(function() {
            setCreateIssueButton()
        }, 500); // 可以根据需要调整时间间隔
    }
    // 监听浏览器滚动事件，并调用节流函数处理
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'z') {
            createIssue()
        }
    })
    setTimeout(() => {
        setCreateIssueButton()
        $('[data-testid="platform-board-kit.ui.board.scroll.board-scroll"]')[0].addEventListener("scroll", handleScroll)
    },3000)

})();