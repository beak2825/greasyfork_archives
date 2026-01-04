// ==UserScript==
// @name         网络学院学习助手
// @namespace    api.0576.dev
// @version      1.0.0
// @description  网络学院0576地区辅助学习|更快地学习党政知识
// @author       老板
// @match        https://*.0576study.gov.cn/gwy/html/specialdetail.html*
// @match        https://*.0576study.gov.cn/gwy/html/specialdetail.html*
// @match        https://*.0576study.gov.cn/gwy/html/videodetail*
// @match        https://*.0576study.gov.cn/gwy/html/course.html
// @match        https://*.0576study.gov.cn/gwy/html/coursedetail.html*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.0.0/jquery.js
// @icon         http://www.zjtz.gov.cn/picture/0/ico.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436574/%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/436574/%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function()
 {
    'use strict';
    var intvl=30*1000
    console.log('It\'s runing Now');
    setTimeout(intvl)
    var href = window.location.href
    if(false){
        GM_setValue("bad_urls", "")
        GM_setValue("previous","")
    }

    GM_setValue("LearnStatus", "")
    GM_setValue("finished_special","")
    if(href.indexOf("coursedetail")>-1){
        setTimeout(() => {coursedetail()}, intvl)
    }
    else if(href.indexOf("course")>-1){
        setInterval(() => {course()}, intvl)
    }
    else if (href.indexOf("specialdetail")>-1){
        setTimeout(() => {specialdetail()}, intvl)
    }
    else if (href.indexOf("special")>-1){
        setInterval(() => {special()}, intvl)
    }
    else{
        setInterval(() => {video()}, intvl)
        setInterval(() => {window.location.reload()}, 10*1000*60)
    }
})();
function video(){
    var vplay=document.getElementById("vplay")
    var wins=document.getElementsByClassName("messager-window")
    var pophuman=false
    var previous=GM_getValue("previous","")
    if(wins.length>0){
        if(wins[0].childNodes[1].textContent.indexOf("学完")>-1){
            //          wins[0].childNodes[2].childNodes[1].click()
            if(previous!=""){
                window.open(previous,"_self")
                return
            }
            window.open(document.referrer,"_self")
        }
        else{
            pophuman=true
            wins[0].childNodes[2].childNodes[0].click()
        }
    }
    if(vplay.error!=null){
        var bad_urls = GM_getValue("bad_urls","")
        bad_urls = bad_urls+";\r\n"+window.location.href
        GM_setValue('bad_urls', bad_urls)
        if(previous!=""){
            window.open(previous,"_self")
            return
        }
        window.open(document.referrer,"_self")
    }
    var ls=GM_getValue("LearnStatus", "")
    if(ls=="3"){
        if(previous!=""){
            debugger
            window.open(previous,"_self")
        }
    }
    if(vplay.paused==true){
        checkfinished()
        var tm4=setTimeout(() => {vplay.play()}, 10*1000)
        }
}
function special(){
    debugger
    var lessons=document.getElementsByClassName("list_zt")[0].childNodes[0].childNodes
    console.log(lessons.item(0))
    var l=lessons.length
    for(var i=0; i<l; i++){
        if(lessons.item(i).nodeName!="LI"){
            continue
        }
        var myurl=lessons[i].children[1].children[0].href
        var sat=lessons[i].children[1].children[0].innerText
        debugger
        if(sat.indexOf("临海")>-1) continue
        if(GM_getValue("finished_special","").indexOf(myurl)>-1) continue
        window.open(myurl,"_self")
        break
    }
}
function specialdetail(){
    debugger
    var lessons=document.getElementsByClassName("list_zt01")[0].childNodes[0].childNodes
    console.log(lessons.item(0))
    var l=lessons.length
    var arr=new Array()
    var done=0, doing=0, todo=0
    var bad_urls = GM_getValue("bad_urls","")
    for(var i=0; i<l; i++){
        var myurl=lessons.item(i).childNodes[2].firstElementChild.firstElementChild.href
        var sat=lessons.item(i).lastChild.textContent.substr(-6,6).replace(/\s+/g,"")
        if(bad_urls.indexOf(myurl)>-1){
            sat="已学习"
        }
        if(sat=="已学习"){
            done=done+1
        }
        else if(sat=="学习中"){
            doing=doing+1
        }
        else{
            todo=todo+1
        }
        arr.push({node:lessons.item(i).childNodes[2],myurl:myurl,sat:sat})
    }
    if(done==l){
        var finished_special=GM_getValue("finished_special","")
        finished_special=finished_special+"\r\n"+window.location.href
        GM_setValue("finished_special",finished_special)
        window.open("https://api.0576study.gov.cn/gwy/html/special.html","_self")
        return
    }
    console.log("本专题共有"+l+"节课。已学习"+done+"课，学习中"+doing+"课，未学"+todo+"课。")
    for(i=0; i<l; i++){
        if(arr[i].sat=="学习中"){
            GM_setValue("previous",window.location.href)
            window.open(arr[i].myurl,"_self")
            return
        }
        if(arr[i].sat=="未学"){
            GM_setValue("previous",window.location.href)
            window.open(arr[i].myurl,"_self")
            return
        }
    }
}
function course(){
    var lessons=document.getElementsByClassName("list_search")[0].childNodes[0].childNodes
    if(lessons==null) {
        window.location.reload(true)
        return
    }
    console.log(lessons.item(0))
    var l=lessons.length
    var arr=new Array()
    var done=0, doing=0, todo=0
    for(var i=0; i<l; i++){
        if(lessons.item(i).nodeName!="LI"){
            continue
        }
        var myurl=lessons.item(i).childNodes[2].firstElementChild.firstElementChild.href
        var sat=lessons.item(i).lastChild.textContent.replace(/\s+/g,"").substr(-2,2)
        arr.push({node:lessons.item(i).childNodes[2],myurl:myurl,sat:sat})
        if(sat=="已学"){
            done=done+1
        }
        else if(sat=="在学"){
            doing=doing+1
        }
        else{
            todo=todo+1
        }
    }
    l=done+doing+todo
    console.log("本页共有"+l+"节课。已学习"+done+"课，学习中"+doing+"课，未学"+todo+"课。")
    debugger
    for(i=0; i<l; i++){
        if(arr[i].sat=="在学"){
            var bad_urls = GM_getValue("bad_urls","")
            console.log(bad_urls)
            if(bad_urls.indexOf(arr[i].myurl)==-1){
                window.open(arr[i].myurl,"_self")
                return
            }
        }
        if(arr[i].sat=="未学"){
            window.open(arr[i].myurl,"_self")
            return
        }
    }
    var page_on=document.getElementsByClassName("page_on")
    var last_item=page_on.item(0)
    for(i=0;i<page_on.length;i++){
        last_item=page_on.item(i)
    }
    var next_item=last_item.parentElement.nextElementSibling
    next_item.click()
}
function coursedetail(){
    var tbody=document.querySelector("#content > div.con_box_left_gwy > table.table_02 > tbody")
    if(tbody==null) {
        window.location.reload(true)
        return
    }
    var l=tbody.children.length
    var nextcourse=""
    for(var i=1;i<l;i++){
        var href=tbody.children[i].children[0].children[0].href
        var sat = tbody.children[i].children[2].innerText
        if(sat=="已学习") continue
        var bad_urls = GM_getValue("bad_urls","")
        if(bad_urls.indexOf(href)==-1){
            nextcourse=href
        }
        else{
            bad_urls = bad_urls+";\r\n"+window.location.href
            GM_setValue("bad_urls", bad_urls)
        }
    }
    if(nextcourse==""){
        window.open("https://api.0576study.gov.cn/gwy/html/course.html","_self")
    }
    else{
        GM_setValue("previous",window.location.href)
        window.open(nextcourse,"_self")
    }
}
function checkfinished(){
    const regex=/[^v]id=[0-9]+/g;
    const found=window.location.href.match(regex);
    if(found==null) return
    var vid=parseInt(found[0].substr(4))
    GM_xmlhttpRequest({
        method: 'POST',
        url: "https://api.0576study.gov.cn/gwy/gwy/web/api!studyDetail.action",
        data: "id="+vid,
        headers:{
            "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
            "Accept":"application/json, text/javascript, */*; q=0.01",
            "X-Requested-With":"XMLHttpRequest",
            "Origin":"https://api.0576study.gov.cn",
            "Sec-Fetch-Site":"same-origin",
            "Referer":window.location.href
        },
        onload: res=>parsefinished(res),
        onerror: e=>{
            console.error(e,"加载视频学习状态页发生错误");
        }
    })
}
function parsefinished(res){
    const regex=/vid=[0-9]+/g;
    const found=window.location.href.match(regex);
    var vid=parseInt(found[0].substr(4))
    var redata=JSON.parse(res.responseText)
    if(redata.success==true){
        var data=redata.data
        var video_rows=data.data.rows
        for(var i=0; i<video_rows.length; i++){
            if(video_rows[i].ID==vid){
                if(video_rows[i].LearnStatus==3){
                    GM_setValue("LearnStatus", "3")
                    return
                }
            }
        }
    }
    GM_setValue("LearnStatus", "")
}
