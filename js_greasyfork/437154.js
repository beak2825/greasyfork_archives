// ==UserScript==
// @name         SJTU-Course Selection Assistant
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  添加一个打开选课社区(course.sjtu.plus)的按钮
// @author       Me
// @match        https://i.sjtu.edu.cn/xsxk/zzxkyzb_cxZzxkYzbIndex.html*
// @connect f002.backblazeb2.com
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @homepageURL https://github.com/dzx-dzx/Course-Selection-Assistant
// @license Apache
// @downloadURL https://update.greasyfork.org/scripts/437154/SJTU-Course%20Selection%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/437154/SJTU-Course%20Selection%20Assistant.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    // Your code here...
    
    //From https://stackoverflow.com/questions/21271997/how-to-overwrite-a-function-using-a-userscript
    function showHideJxb(obj){
        if($(obj).children(".expand_close").attr("class").indexOf("expand1")>0){
            $(obj).children(".expand_close").removeClass('expand1').addClass('close1');
            $(obj).next(".panel-body").slideDown();
        }else{
            $(obj).children(".expand_close").removeClass('close1').addClass('expand1');
            $(obj).next(".panel-body").slideUp();
        }
    }
    addJS_Node (showHideJxb);
    function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
        var D                                   = document;
        var scriptNode                          = D.createElement ('script');
        if (runOnLoad) {
            scriptNode.addEventListener ("load", runOnLoad, false);
        }
        scriptNode.type                         = "text/javascript";
        if (text)       scriptNode.textContent  = text;
        if (s_URL)      scriptNode.src          = s_URL;
        if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

        var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        targ.appendChild (scriptNode);
    }
    
    const courseToIdRaw = (await (async () => {
        const courseListTimestampResponse = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://f002.backblazeb2.com/file/course/course.json",
                headers: { "Range": "bytes=0-0" },
                onload: function (response) { resolve(response) }
            })
        })
        const latestCourseListTimestamp = parseInt(courseListTimestampResponse.responseHeaders.split('\n').filter((i,/*教务系统似乎私自修改了Array的原型*/s) => s.includes("x-bz-info-src_last_modified_millis"))[0].split(":")[1])
        if (GM_getValue('course_list_timestamp') !== latestCourseListTimestamp) {
            const courseListResponse = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://f002.backblazeb2.com/file/course/course.json",
                    onload: function (response) { resolve(response) }
                })
            })
            const courseToIdRaw = JSON.parse(courseListResponse.response)
            GM_setValue("course_list", courseToIdRaw)
            GM_setValue("course_list_timestamp", latestCourseListTimestamp)
            return courseToIdRaw
        }
        else return GM_getValue("course_list")
    })())

    const courseToIdMap = new Map(Object.entries(courseToIdRaw))

    function addButton(tr) {
        const classCodeRaw = tr.querySelector("td.jxbmc").textContent
        const classCode = classCodeRaw.split("-").at(-2)//什么你说兼容性?能吃吗?

        if (!courseToIdMap.has(classCode)) {
            console.warn(`课程${classCode}无法找到,请向开发者联系.`); return;
        }
        const classes = courseToIdMap.get(classCode)

        const teachers = Array.from(tr.querySelector("td.jsxmzc").querySelectorAll("a"), a => a.textContent)

        const id = teachers.reduce((pre, teacher) => {
            if (pre != null) return pre
            const res = classes.find((c) => c.teacher === teacher)
            if (res) return res.id
            else return null
        }, null)

        if (!id) {
            console.warn(`课程${classCode}下教师${teachers}均未找到,请向开发者联系.`); return;
        }

        const button = document.createElement("button")
        button.onclick = function () { window.open(`https://course.sjtu.plus/course/${id}`, "_blank"/*始终新建窗口,改成"course"以覆盖前一窗口*/) }
        button.setAttribute("class", "btn btn-primary btn-sm")
        button.textContent = "跳转到选课社区"
        tr.querySelector("td.jxbmc").append(document.createElement("br"), button)
    }
    document.querySelectorAll("div.panel-body > table > tbody > tr ").forEach((tr => {
        if (tr.querySelector(".kkxymc").textContent !== "") addButton(tr)
    }))

    const observer = new MutationObserver((mutationList) => {
        mutationList.forEach((mutation) => { if (mutation.target.getAttribute("class") === "kkxymc") addButton(mutation.target.parentElement) })
    })
    observer.observe(document.querySelector("#displayBox"), { "childList": true, "subtree": true })
    
    const saveSelectedCourseButton = document.createElement("button")
    saveSelectedCourseButton.onclick = function(){
        function getSelectedCourseCode(){
            return [...document.querySelectorAll("div.right_div > div > ul td> p.jxb").values()].map(p=>p.getAttribute("title").split("-").at(-2))
        }
        let selectedCourseCode=getSelectedCourseCode().join(" ")
        selectedCourseCode=window.prompt("将保存以下课程代号:", selectedCourseCode)
        if(selectedCourseCode) GM_setValue("selected_course_code",selectedCourseCode)
    }
    saveSelectedCourseButton.setAttribute("class", "btn btn-primary btn-sm")
    saveSelectedCourseButton.textContent = "保存已选课到本地"

    const loadPreSelectedCourseButton = document.createElement("button")
    loadPreSelectedCourseButton.onclick = function(){
        let selectedCourseCode=GM_getValue("selected_course_code")
        selectedCourseCode=window.prompt("将加载以下课程代号:", selectedCourseCode)
        if(selectedCourseCode){
            document.querySelector(".form-control.input-sm.filter-input").value=selectedCourseCode
            document.querySelector(".input-group-btn").querySelector(".btn.btn-primary.btn-sm").click()
        }
    }
    loadPreSelectedCourseButton.setAttribute("class", "btn btn-primary btn-sm")
    loadPreSelectedCourseButton.textContent = "加载之前保存的课程"

    document.querySelector("div.col-sm-8.col-md-8.buttons").prepend(saveSelectedCourseButton,loadPreSelectedCourseButton)

})();
