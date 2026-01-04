// ==UserScript==
// @name         一网畅学优化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  修正了部分我觉得不好用的功能
// @author       IceBurger
// @match        https://1906.usst.edu.cn/*
// @require      https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js
// @downloadURL https://update.greasyfork.org/scripts/451637/%E4%B8%80%E7%BD%91%E7%95%85%E5%AD%A6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/451637/%E4%B8%80%E7%BD%91%E7%95%85%E5%AD%A6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

let helper_added=false//判断是否已经向页面添加了帮助框
let helper_open=false//判断帮助框是否已打开


function addStyleSheet(){
    //以下是脚本本身所需的css样式，统一以c-开头，防止与原生样式产生冲突
    let style=`<style>
    .c-helper-box{
        /*定位*/
        height: 30vh;
        width: 20vw;

        position: absolute;
        z-index: 100;
        top:7vh;
        left: 1vw;
        /*界面*/
        border: 1px solid gray;
        border-radius: 5px;
        background-color: #f5f5f5;
    }
    .c-helper-item{
        margin: 10px;
        padding: 5px;
        border: 1px solid black;
        border-radius: 5px;
    }
    .c-title{
        margin-left: 10px;
        margin-top: 5px;
        margin-bottom: 0;
    }
    </style>`
    $($("link")[0]).before(style)
    //以下是引用的外部toastify-js所需的css
    let toastify=`<link rel="stylesheet"
    type="text/css"
    href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">`
    $($("link")[0]).before(toastify)
}
//章节内容在新标签页中打开
function startListenItemsReplace(){
    if (!loadSetting()["课程项目重定向"])
        return
    let reg=new RegExp("https://1906.usst.edu.cn/course/[0-9]+/content")
    if (reg.exec(location.href)==null)
        return
    console.log("开始监听重定向")
    let observer=new MutationObserver(redirectCallback)
    observer.observe(document.documentElement, {
        attributes: false,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false
    })
}
function redirectCallback(m,observer){
    console.log("尝试修正重定向")
    let checkpoint
    try{
        checkpoint=$(".learning-activity")[0].innerText
        redirectChapterItems()
        console.log("重定向修正完成")
        observer.disconnect()
        Toastify({
            text: "重定向修正完成",
            position: "right",
          }).showToast();
    }
    catch(error){
        return
    }
}
function redirectChapterItems(){
    let items=$(".learning-activity")//所有课程内容item，即章节下的条目
    let course_id=location.pathname.split("/")[2]
    for (let i=0;i<items.length;i++){
        let now=items[i]//当前item
        let id=now.getAttribute("id").split("-")[2]//item的活动id
        let del=$(">div",now)//要删除的节点，class为clickable-area
        let mig=$(">div",del)//要迁移的节点
        $(del).before(`<div class="c-new-item-box" style="padding: 15px 15px 15px 40px;"></div>`)//在要删除的节点前添加空节点，将迁移节点移入来实现保持除了点击后在当前转跳以外的功能
        let new_item=$(".c-new-item-box")
        new_item=new_item[new_item.length-1]
        new_item.appendChild(mig[0])//节点迁移
        new_item.appendChild(mig[1])
        del.remove()//删除不再需要的节点
        $(new_item).click({item_id:id},function(e){
            window.open('https://1906.usst.edu.cn/course/'+course_id+'/learning-activity/full-screen#/'+e.data.item_id,'_blank')
        })//重新绑定事件，使点击的行为变为在新标签页中打开
    }
}

//加载课程列表
function loadCourses(){//加载课程，须在我的课程页面
    let data=$("span.course-name>a")//当前页面的课程
    let courses=localStorage.getItem("SavedCourses")
    courses=courses==null?[]:JSON.parse(courses)//加载已保存的课程
    let ExistCheck=new Set()//用于查重
    for (let i=0;i<courses.length;i++){
        ExistCheck.add(courses[i].name)
    }
    for (let i=0;i<data.length;i++){
        let name=data[i].innerText.split(/\(\d{4}-\d{4}-\d{1}/)[0]
        if (ExistCheck.has(name))
            continue
        courses.push({
            name:name,
            url:data[i].href
        })
    }
    localStorage.setItem("SavedCourses",JSON.stringify(courses))//保存新增的课程
    console.log("本页课程加载完成")
    Toastify({
        text: "本页课程加载完成",
        position: "right",
      }).showToast();
}
function clearCourses(){//清除所有课程
    localStorage.removeItem("SavedCourses")
    Toastify({
        text: "已清空保存课程",
        position: "right",
      }).showToast();
}
//替换课程列表
function replaceCallback(m,observer){
    try{
        let origin_course=$('div.visited-course')//原始课程列表
        $(origin_course[0]).before("<div id='replaced_courses' style='display: flex;flex-direction: column;'></div>")
        for (let i=0;i<origin_course.length;i++){
            $(origin_course[i]).remove()//删除原始课程列表
        }
        observer.disconnect()//断开防止重复添加
        let courses=JSON.parse(localStorage.getItem("SavedCourses"))//加载保存的课程
        for (let i=0;i<courses.length;i++){
            let node=`<a href="${courses[i].url}" target="_blank" style="border-bottom: 1px solid gray;font-size:16px;">${courses[i].name}</a>`
            $('#replaced_courses').prepend(node)//添加保存的课程
        }
        console.log("课程列表替换完成")
        Toastify({
            text: "课程列表替换完成",
            position: "right",
          }).showToast();
    }
    catch(error){
        return
    }
}
function startListenCoursesReplace(){
    if (!loadSetting()["课程列表替换"])
        return
    if (location.href.indexOf("index")==-1)
        return
    console.log("开始监听课程替换")
    let observer=new MutationObserver(replaceCallback)
    observer.observe(document.documentElement, {
        attributes: false,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false
    })
}
//基础部分
function addHelperButton(){//添加增强按钮
    if (location.href.indexOf("full")!=-1)
        return
    let button=`<li class="shared-resource autocollapse-item" id="i-helper"><a class="header-item">增强</a></li>`
    $($("div.layout-row")[0]).append(button)
    $("#i-helper").click(function(){
        viewHelperPanel()
    })
}
function viewHelperPanel(){
    if (!helper_added){
        //以下是帮助框template
        let template=`<div class="c-helper-box" id="c-helper-box">
        <p class="c-title">替换课程列表</p>
        <div class="c-helper-item">
            <button id="加载课程">加载课程</button>
            <button id="清空课程">清空课程</button>
        </div>
        <p class="c-title">设置</p>
        <div class="c-helper-item">
            <input id="replace" type="checkbox" value="替换课程">替换课程
            <br>
            <input id="redirect" type="checkbox" value="重定向">重定向
            <br>
            <button id="setting_save">保存</button>
        </div>
    </div>`
        $($("div.header")[0]).after(template)
        $("#加载课程").click(()=>{loadCourses()})
        $("#清空课程").click(()=>{clearCourses()})
        helper_added=true
        $("#setting_save").click(function(){
            let setting=loadSetting()
            setting["课程列表替换"]=$("#replace").prop("checked")
            setting["课程项目重定向"]=$("#redirect").prop("checked")
            localStorage.setItem("辅助设置",JSON.stringify(setting))
        })
        setCheckStatus(loadSetting())

    }
    if (!helper_open){
        $("#c-helper-box").removeAttr("hidden")
        helper_open=!helper_open
    }
    else{
        $("#c-helper-box").attr("hidden","")
        helper_open=!helper_open
    }
}
function loadSetting(){
    let setting=localStorage.getItem("辅助设置")
    if (setting==null){
        setting={//这里是默认设置，不要动
            "课程列表替换":true,
            "课程项目重定向":true
        }
    }
    else{
        setting=JSON.parse(setting)
    }
    return setting
}
function setCheckStatus(setting){
    if (setting["课程列表替换"]){
        $("#replace").attr("checked",true)
    }
    if (setting["课程项目重定向"]){
        $("#redirect").attr("checked",true)
    }
}
window.onload=(function() {
    'use strict';
    //下列函数在不在对应的网页时应停止运行
    addStyleSheet()//添加自定义样式表
    addHelperButton()//添加辅助按钮
    startListenCoursesReplace()//开始监听替换课程列表
    startListenItemsReplace()//开始监听修正章节项目
})();