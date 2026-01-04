// ==UserScript==
// @name         Just课表获取
// @namespace    https://github.com/cmys1109
// @version      1.0.3
// @description  Just(江苏科技大学)方正教务系统课表获取.
// @author       cmys1109
// @license      Apache License 2.0
// @require      https://unpkg.com/jquery@3.6.3/dist/jquery.js
// @match        *://jwxt.just.edu.cn/jwglxt/xtgl/index_initMenu.html*
// @match        *://jwxt.just.edu.cn/jwglxt/kbcx/xskbcxZccx_cxXskbcxIndex.html*
// @match        *://client.v.just.edu.cn/*/jwglxt/xtgl/index_initMenu.html*
// @match        *://client.v.just.edu.cn/*/jwglxt/kbcx/xskbcxZccx_cxXskbcxIndex.html*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/461508/Just%E8%AF%BE%E8%A1%A8%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/461508/Just%E8%AF%BE%E8%A1%A8%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

function getDetails() {
    let details = {}

    details.schoolYearSelect = document.getElementById("xnm")
    details.yearSelectedIndex = details.schoolYearSelect.selectedIndex
    details.nowSchoolYear = details.schoolYearSelect.options[details.yearSelectedIndex].text

    details.schoolTermSelect = document.getElementById("xqm")
    details.termSelectedIndex = details.schoolTermSelect.selectedIndex
    details.nowSchoolTerm = details.schoolTermSelect.options[details.termSelectedIndex].text

    details.weekSelect = document.getElementById("zs")
    details.weekSelectedIndex = details.weekSelect.selectedIndex
    details.nowWeek = details.weekSelect.options[details.weekSelectedIndex].text

    details.now = [details.nowSchoolYear.split("-")[0], details.nowSchoolTerm, details.nowWeek].join("-")

    return details
}

function setRemarkCell(cellId) {
    const cell = document.getElementById(cellId);

    // 保证cell中card为当前期限的
    $("#" + cellId + ">div[id]").remove()
    // $("#" + cellId + ">div[class!='" + nowTarget + " not free card']").remove()

    const p = document.createElement("p");
    p.style.color = "#ffffff"
    p.style.fontSize = "x-large"
    p.innerHTML = "不参加排班"

    const Div = document.createElement("div");
    Div.appendChild(p)

    const lessonDiv = document.createElement("div");
    lessonDiv.id = "not free card"
    lessonDiv.appendChild(Div)
    lessonDiv.style = "display: flex;background-color: #f47920;text-align: center;height: 100%;align-items: center;justify-content: center;"

    const p1 = document.createElement("p");
    p1.style.color = "#000000"
    p1.style.fontSize = "x-large"
    p1.innerHTML = "参加排班（空闲）"

    const Div1 = document.createElement("div");
    Div1.appendChild(p1)

    const lessonDiv1 = document.createElement("div");
    lessonDiv1.id = "free card"
    lessonDiv1.appendChild(Div1)
    lessonDiv1.style = "display: flex;text-align: center;height: 100%;align-items: center;justify-content: center;"

    cell.appendChild(lessonDiv)
    cell.appendChild(lessonDiv1)
    cell.setAttribute("rowspan", "2")

    $("#" + cellId + ">div[id='not free card']").toggle()
}

function setCourseRemarkCell(cellId) {
    const cell = document.getElementById(cellId);

    // 保证cell中card为当前期限的
    $("#" + cellId + ">div[id]").remove()
    // $("#" + cellId + ">div[id!='" + nowTarget + "free card']").remove()

    const card = cell.firstElementChild;

    card.id = "not free card"
    // 如果cell背景色为red则修改，防止其与free card颜色相近
    if (card.style.backgroundColor === "red") card.style.backgroundColor = "#007d65"

    const p1 = document.createElement("p");
    p1.style.color = "#ffffff"
    p1.style.fontSize = "x-large"
    p1.innerHTML = "参加排班（有课）"

    const Div1 = document.createElement("div");
    Div1.appendChild(p1)

    const lessonDiv1 = document.createElement("div");
    lessonDiv1.id = "free card"
    lessonDiv1.appendChild(Div1)
    lessonDiv1.style = "display: flex;background-color: red;text-align: center;height: 100%;align-items: center;justify-content: center;"

    cell.appendChild(lessonDiv1)
    $("#" + cellId + ">div[id='free card']").toggle()
}

function classTableDetails(HTMLElement) {
    // :return (bool, string)  (是否有空, 课程信息）
    const rowspan = HTMLElement.getAttribute("rowspan");
    if (rowspan === null) {
        return null
    }else {
        if (rowspan === "2") {
            let child = HTMLElement.firstElementChild;
            if (child.style.display === "none") {
                child = HTMLElement.lastElementChild
            }
            return child.children[0].innerText
        } else if (rowspan === "4") {
            // 四节的长课
            // 进行分割，分割成两个两节的cell
            // 注意点： 需要将下一行自这节长课的列向后的所有cell向右移动一个

            HTMLElement.setAttribute("rowspan", "2")
            HTMLElement.style.height = ""

            const row = HTMLElement.id[5];
            const col = HTMLElement.id[3];

            const nextRow = String(Number(row) + 2);
            let maxCol = Number(col) + 1;

            while (document.getElementById("td_"+String(maxCol+1)+"-"+row)) maxCol++

            for (let c = maxCol; c > Number(col); c--) {
                const E = document.getElementById("td_" + String(c) + "-" + nextRow);
                const lastE = document.getElementById("td_" + String(c - 1) + "-" + nextRow);

                E.innerHTML = lastE.innerHTML
                if (lastE.innerHTML !== "") E.setAttribute("rowspan", "2")
            }

            document.getElementById("td_"+col+"-"+nextRow).innerHTML = HTMLElement.innerHTML
        }
    }
}

function coursesTable() {
    const courseTable = [];
    for (let i = 1; i <= 5; i++) {
        courseTable[i-1] = []
        for (let j = 1; j <= 7; j = j + 2){
            const tableId = "td_" + String(i) + "-" + String(j);
            const tableElement = document.getElementById(tableId);

            const classes = {};
            classes.ID = tableId
            classes.courseInfo = classTableDetails(tableElement)
            classes.free = $("#" + tableId + ">div[id='not free card']")[0].style.display === "none"
            courseTable[i - 1][(j+1)/2 - 1] = classes
        }
    }
    return courseTable
}

function removeAllCourse(){
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= 7; j = j + 2){
            const tableId = "td_" + String(i) + "-" + String(j);
            const tableElement = document.getElementById(tableId);

            tableElement.removeAttribute("rowspan")
            let child = tableElement.lastElementChild;
            while (child) {
                tableElement.removeChild(child)
                child = tableElement.lastElementChild
            }
        }
    }

    $(".lesson").remove()
}

function courseTableInit(){
    // 判断课表是否为空
    let kbListNull = false;
    if (document.getElementById("myTab").style.display === "none") {
        document.getElementById("myTab").style.display = ""
        kbListNull = true
    }
    if (document.getElementsByClassName("sccon")[0].style.display === "none") {
        document.getElementsByClassName("sccon")[0].style.display = ""
        kbListNull = true
    }

    if (kbListNull === true) {
        removeAllCourse()
    }

    const courseTable = [];
    for (let i = 1; i <= 5; i++) {
        courseTable[i-1] = []
        for (let j = 1; j <= 7; j = j + 2){
            const tableId = "td_" + String(i) + "-" + String(j);
            const tableElement = document.getElementById(tableId);

            const classes = {};
            classes.ID = tableId
            classes.courseInfo = classTableDetails(tableElement)
            classes.free = (classes.courseInfo === null || tableElement.firstElementChild.style.display === "none")
            courseTable[i - 1][(j+1)/2 - 1] = classes
        }
    }

    courseTable.forEach(day => {
        day.forEach(classes => {
            document.getElementById(classes.ID).setAttribute("class", "course")
            if (classes.free) {
                setRemarkCell(classes.ID)
            } else {
                setCourseRemarkCell(classes.ID)
            }
        })
    })

    $(".course").unbind('click').bind('click',function(event){
        $("#" + event.currentTarget.id + ">div").toggle()
    })
}

function courseTablePageInit() {
    const START_DETAILS = getDetails()

    // 自动选中下一周
    if (GM_getValue("autoSelectNextWeek", false)) {
        START_DETAILS.weekSelect.options[START_DETAILS.weekSelectedIndex + 1].selected = true
        searchResult()
    }

    UIInit()
    setMenu()
    if ($("i>span")[0] === undefined) {
        courseTableInit()
    }

    UIInit()
    setMenu()
    if ($("i>span")[0] === undefined) {
        courseTableInit()
    }

    // 添加功能按钮
    const getButton = document.createElement("button");
    getButton.innerText = "获取课表"
    getButton.id = "getRemarkButton"
    getButton.setAttribute("class", "btn btn-primary btn-sm")
    document.getElementsByClassName("pull-right")[0].append(getButton)
    // 设置功能按键监听事件
    $("#getRemarkButton").unbind('click').bind('click', function(){
        const courseTable = coursesTable();
        let freeStr = "";

        courseTable.forEach(day => {
            day.forEach(classes => {
                freeStr += classes.free === true ? "1" : "0"
            })
        })

        const user = GM_getValue("nowUser");
        if (user === undefined) {
            alert("无法找到用户信息，请刷新教务系统首页后重新获取！")
        }
        const schList = [getDetails().now, user.ID, user.Name, freeStr];
        handleCopyValue(schList.join("|"))
        alert("排班字符串已经复制到剪切板了！")
    })

    function UIInit() {
        document.getElementsByClassName("kbsec")[0].style.width = "90%"
    }

    function setMenu(){
        GM_registerMenuCommand("自动跳转到下一周",()=>{
            // 对autoSelectNextWeek 进行取非
            GM_setValue("autoSelectNextWeek", !GM_getValue("autoSelectNextWeek", false))
            const status = GM_getValue("autoSelectNextWeek", false) ? "开启" : "关闭";
            alert("已"+ status +" 打开页面自动选择下一周 功能")
        })
    }
}

// 此函数来源于 https://blog.csdn.net/zero77ld/article/details/127967854
function handleCopyValue(text) {
    if (!navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text)
    } else {
        if (!document.execCommand('copy')) return Promise.reject()
        const textArea = document.createElement('textarea')
        textArea.style.position = 'fixed'
        textArea.style.top = textArea.style.left = '-100vh'
        textArea.style.opacity = '0'
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        return new Promise((resolve, reject) => {
            document.execCommand('copy') ? resolve() : reject()
            textArea.remove()
        })
    }
}

function initMenuPageInit() {
    const userID = $("#sessionUserKey")[0].value;

    // 判断用户是否存在
    const userList = GM_getValue("userList", []);
    userList.forEach(user => {
        if (user.ID === userID) {
            GM_setValue("nowUser", user)
            return
        }
    })

    // 如果是新用户，则创建
    const userInfo = $(".media-body")[0].innerText;

    const userName = userInfo.split("\n\n")[0].split("  ")[0];
    const userClass = userInfo.split("\n\n")[1].split(" ")[1];

    const newUser = {
        "Name": userName,
        "Class": userClass,
        "ID": userID
    };

    userList.push(newUser)

    GM_setValue("userList", userList)
    GM_setValue("nowUser", newUser)
}

(function() {
    'use strict';

    const url = window.location.href;
    $(document).ready(function(){
        if (url.indexOf("xskbcxZccx_cxXskbcxIndex") !== -1) {
            $("#to-search").remove()

            courseTablePageInit()
            $("input[name='radio1']").change(function() {
                $("#getRemarkButton").toggle()
            })

            $("select").change(function() {
                searchResult()
                courseTableInit()
            })
        } else if (url.indexOf("index_initMenu") !== -1){
            initMenuPageInit()
        }
    })
})();
