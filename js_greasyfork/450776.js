// ==UserScript==
// @name         shitech门户
// @version      1.8.8
// @namespace    eip.teamshub.com
// @description  shitech高效办公：1、门户首页显示考勤，2、op评审自动填写意见和分数，3、大学课程一键进度100%，4、考试增加默认选中，5、查看已完成考试答案
// @author       jjjjj
// @license      MIT

// @match        *://eip.teamshub.com/*
// @match        *://auto.si-tech.com.cn/*
// @match        *://training.si-tech.com.cn/*
// @grant        GM_xmlhttpRequest
// @connect      hrs.si-tech.com.cn
// @connect      yiyunapp.teamshub.com
// @connect      training.si-tech.com.cn
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/450776/shitech%E9%97%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/450776/shitech%E9%97%A8%E6%88%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_log('shitech-tool is running.');

    var style = `
    table.gridtable {font-family: verdana,arial,sans-serif;
        color:#333333;
        border-width: 1px;
        border-color: #fff;
        border-collapse: collapse;}
    table.gridtable th {
        border-width: 1px;
        border-style: solid;
        border-color: #d8dad9;
        background-color: #dedede;}
    table.gridtable td {
        border-width: 1px;
        border-style: solid;
        border-color: #d8dad9;
        background-color: #ffffff;}
    .mybtn {
        width: 200px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        cursor: pointer;
        user-select: none;
        letter-spacing: 1rem;
        text-indent: 1rem;
        border-radius: 20px;
        box-sizing: border-box;
    }
    .mybtn-2 {
        height: 42px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        cursor: pointer;
        user-select: none;
        border-radius: 20px;
        box-sizing: border-box;
    }
    .boom {
        background-color: #16a085;
        color: #fff;
        position: relative;
        z-index: 1;
    }

    .boom::before {
        content: "";
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border: 2px solid #16a085;
        border-radius: 20px;
        transform-origin: center;
    }

    .boom:hover::before {
        transform: scale(1.25);
        transition: all ease-out .5s;
        border: 1px solid #96f3e0;
        opacity: 0;
    }
    .time{
        font-size: 24px !important;
        color: #f56c6c;
        font-weight: 700;
        background-color: #fff4d6;
    }
    `
    GM_addStyle(style) //添加样式

    const divClassName = 'dynamic-list';
    var StudyLessonList = []
    var _myExamList = []
    var _examImgSrc = "data:image/png;base64,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"

    var website$1 = {
        regexp: new RegExp("eip.teamshub.com/home"),
        init: function ($) {
            console.log('进入门户')
            add_blankToA();
            showAttendance()
        },
    };

    var website$2 = { // op审批
        regexp: new RegExp("devasm_reviewEasy_revHead.html"),
        init: function ($) {
            console.log('进入待审批')
            setTimeout(function(){
                var revop = document.getElementById("revOpinion");
                //revop.innerHTML = "通过";
                revop.value="通过"
                document.getElementById("totalPoint").value=random(75,80)
            },700)
        },
    };

    var website$3 = { // 大学学习进度
        regexp: new RegExp("uni/study"),
        init: function ($) {
            console.log('进入大学学习')
            setTimeout(function(){
                var processingBtn = document.getElementById("tab-0")
                // 给进行中按钮添加点击事件
                processingBtn.addEventListener('click', function(){
                    setTimeout(function(){
                        showCompleteQuickly()
                    },1000)
                })
                showCompleteQuickly()
            },2000)
        },
    };

    var website$4 = {
        regexp: new RegExp("training.si-tech.com.cn/exam/portal/examPage.html"),
        init: function ($) {
            console.log('批量选a')
            setTimeout(function(){
                if (confirm("确定要全部默认选中吗？")){
					let input = prompt('输入默认全选的选项：1、2、3、4...');
                    if( input!=null && input!="" ){
                        var allselector = document.querySelectorAll('div.ui-controlgroup > div:nth-child('+input+') > span > input[type=radio]');
                        console.log(allselector)
                        allselector.forEach(el => {
                            el.checked=true;
                        });
                    }
				}
            },2500)
        },
    }

    var website$5 = { // 查看考试答案
        regexp: new RegExp("uni/exam"),
        init: function ($) {
            console.log('进入考试列表')
            setTimeout(function(){
                var areaDiv = document.getElementsByClassName("filterDate")
                // 给进行中按钮添加点击事件
                createButton('showannswer','查看问卷答案',function(){
                    showExamAnswer();
                }, areaDiv[0], 'mybtn-2 boom')
            },1000)
        },
    };

    var websites = [
        website$1,
        // website$2,
        website$3,
        website$4,
        website$5
    ];

    initWebsite(); //启动

    function initWebsite() {
        var mather = function (regex, website) {
            if (regex.test(window.location.href)) {
                website.init();
                return true;
            }
            return false;
        };
        websites.some(function (website) { return mather(website.regexp, website); });
    };

    /**
     * 显示考勤
     */
    function showAttendance() {
        var request = new Object();
        request = GetRequest();
        var ticket = request['ticket'];
        if( isEmpty(ticket)){
            ticket = GM_getValue('shitech-ticket');
        }else{
            GM_setValue('shitech-ticket', ticket);
        }
        GM_log("shitech-ticket: "+ticket)
        if( !isEmpty(ticket) ){
            getBaogongInfo(ticket)
        }
    }

    function add_blankToA(){
        let timeid = setTimeout(function(){
            var allselector = document.querySelectorAll(".quick-notice")[0].children;
            if (allselector != null && allselector.length > 0) {
                for (var k = 0; k < allselector.length; k++) {
                    var anchor_item = allselector[k];
                    if(anchor_item.nodeName === "A"){
                        anchor_item.target = "_blank";
                    }
                }
            }

            var dayMenus = document.querySelector("body > div.menuContent > div:nth-child(2) > ul").children;
            if(dayMenus != null && dayMenus.length > 0){
                for (var i = 0; i < dayMenus.length; i++) {
                    var li = dayMenus[i];
                    if(li.nodeName.toLowerCase() === "li"){
                        li.children[0].target = "_blank";
                    }
                }
            }
        },1500)
    }

    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    function showExamAnswer(){
        getMyExamList().then(function(){
            let pane = document.getElementById("pane-1");
            let children = pane.children;
            let firstChild = children[0];
            pane.innerHTML = "";
            pane.appendChild(firstChild);
            
            for(let j=0; j<_myExamList.length; j++){
                let html = `
                <div  class="pd-20 total_course">
                    <div  class="flex items-center">
                        <div  class="left_intro left_exam">
                        <img  src="${_examImgSrc}" alt="" class="img_bk">
                        </div>
                        <div  class="right_infor">
                        <div  class="course_title">
                            <span  class="title_span">${_myExamList[j].examName}</span>
                        </div>
                        <div  class="bottom_infor">
                            <div  class="clearfix every_infor">
                            <div >
                                <label >及格分数：</label>
                                <span >${_myExamList[j].passScore}</span>
                            </div>
                            </div>
                            <div  class="clearfix every_infor">
                            <div>
                                <label >考试分数：</label>
                                <span >${_myExamList[j].score}</span>
                            </div>
                            <div>
                                <a class="mybtn-2 boom" href="http://training.si-tech.com.cn/exam/portal/myExamScore.html?windowId=myExamScore&resultId=${_myExamList[j].resultId}" target="_blank">查看答案</a>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                `;
                document.getElementById("pane-1").insertAdjacentHTML('beforeend', html);
            }
        })
    }

    function getBaogongInfo(ticket){
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://hrs.si-tech.com.cn/gotoOneselfSignInOff.action?ticket="+ticket,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
            },
            onload: function (res) {
                // console.log('get res', res.responseText);
                var bgHtml = res.responseText;
                var doc = new DOMParser().parseFromString(bgHtml, 'text/html');
                var titleTr = doc.querySelector('#oneselfSignInOffList table.blue-table thead tr');
                var firstRow = doc.querySelector('#oneselfSignInOffList table.blue-table tbody tr:nth-child(1)');
                var row2 = doc.querySelector('#oneselfSignInOffList table.blue-table tbody tr:nth-child(3)');
                removeSomeCell(titleTr)
                removeSomeCell(firstRow)
                removeSomeCell(row2)
                var table = document.createElement('table');
                var thead = document.createElement('thead');
                var tbody = document.createElement('tbody');
                thead.appendChild(titleTr)
                tbody.appendChild(firstRow)
                tbody.appendChild(row2)
                table.appendChild(thead);
                table.appendChild(tbody);
                table.className = 'gridtable'
                document.getElementsByClassName(divClassName)[0].appendChild(table);
            }
        });
    }

    function removeSomeCell(element){
        element.deleteCell(23);
        element.deleteCell(22);
        element.deleteCell(21);
        element.deleteCell(20);
        element.deleteCell(19);
        element.deleteCell(18);
        element.deleteCell(17);
        element.deleteCell(1);
    }

    /**
     * 课程进度一键100%
     */
    function showCompleteQuickly(){
        var parentElement = document.getElementById('pane-0');
        var courses = parentElement.children;
        console.log('total_course len==========='+courses.length)
        var courseNum = courses.length-2;

        getMyStudyLesson().then(function(){
            for(var i=1; i<=courseNum; i++){
                let titleSpan = document.querySelector("#pane-0 > div:nth-child("+i+") > div > div.right_infor > div.course_title > span.title_span");
                let title = titleSpan.innerHTML
                let lesson = StudyLessonList.filter(function(items){
                    return items.lessonName == title;
                })
                console.log(lesson)
                let lessonId = lesson[0].trainingLessonId
                let lessonGenre = lesson[0].lessonGenre
                let lessonDuration = lesson[0].lessonDuration
                let endTime = lesson[0].endTime
                console.log(title+'---------------------'+lessonId)
                console.log(title+'---------------------'+lessonGenre)
                let btndiv = document.querySelector("#pane-0 > div:nth-child("+i+") > div > div.right_infor > div.bottom_btn.mgt-10");
                createButton(lessonId,'一键进度100%',function(){
                    if(lessonGenre == "视频类"){
                        saveVideoLearningProgress(lessonId, lessonDuration);
                    }else if(lessonGenre == "文档类"){
                        saveVideoLearningProgress(lessonId, lessonDuration);
                    }else{
                        saveLearningProgress(lessonId)
                    }
                }, btndiv)

                let timeDive = document.createElement('span');
                timeDive.className = 'time';
                timeDive.textContent = endTime;
                document.querySelector("#pane-0 > div:nth-child("+i+") > div > div.right_infor > div.course_title").appendChild(timeDive);
            }
        })

    }

    function getMyStudyLesson(){
        return new Promise(function(resolve, reject){
            var cookie = document.cookie;
            console.log(cookie)
            var time = new Date().getTime()
            var param = {
                "pageSize":1000,
                "currentPage":1,
                "studyStatus":"0",
                "lessonName":"",
                "tagObjId":"",
                "myAdded":null
            }
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://training.si-tech.com.cn/kmd_job_training/myStudy/myStudyLesson?cb="+time,
                cookie: cookie,
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                data: JSON.stringify(param),
                onload: function (res) {
                    let resData = JSON.parse(res.responseText);
                    if(resData.code && resData.code == 0 ){
                        StudyLessonList = resData.data.list
                        resolve()
                    }
                    reject()
                }
            });
        })
    }

    function saveVideoLearningProgress(LessonId,lessonDuration){
        console.log('修改视频类课程进度：'+LessonId)
        var cookie = document.cookie;
        console.log(cookie)
        var duration = parseFloat(lessonDuration)
        let len = 0;
        if(duration > 5){
            duration = duration - 4
        }
        len = len * 59 * 1000 + 0.78971;
        var time = new Date().getTime()
        var param = {
            "progress":"100.00",
            "playtimes":len,
            "lessonId":LessonId,
            "resId":"",
            "type":"2",
            "startTime":"2022-11-25 13:42:55",
            "endTime":"2022-11-25 13:43:02"
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://training.si-tech.com.cn/kmd_job_training/myStudy/saveLearningProgress?cb="+time,
	        cookie: cookie,
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            data: JSON.stringify(param),
            onload: function (res) {
                console.log('课程 res: ', res.responseText);
                let resData = JSON.parse(res.responseText);
                if(resData.code && resData.code == 0 ){
                    alert('课程进度修改成功！')
                }
            }
        });
    }

    function saveLearningProgress(LessonId){
        console.log('修改课程进度：'+LessonId)
        var cookie = document.cookie;
        console.log(cookie)
        var time = new Date().getTime()
        var param = {"progress":100,"trainingLessonId":LessonId,"type":"3"}
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://training.si-tech.com.cn/kmd_job_training/myStudy/saveLearningProgress?cb="+time,
	        cookie: cookie,
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            data: JSON.stringify(param),
            onload: function (res) {
                console.log('课程 res: ', res.responseText);
                let resData = JSON.parse(res.responseText);
                if(resData.code && resData.code == 0 ){
                    alert('课程进度修改成功！')
                }
            }
        });
    }

    function getlessonResRel(LessonId){
        return new Promise(function(resolve, reject){
            var cookie = document.cookie;
            var time = new Date().getTime()
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://training.si-tech.com.cn/kmd_job_training/lessonStudyInfo/getlessonResRel?cb="+time+"&lessonId="+LessonId,
                cookie: cookie,
                headers: {
                    "accept":"application/json, text/plain, */*"
                },
                onload: function (res) {
                    let resData = JSON.parse(res.responseText);
                    if(resData.code && resData.code == 0 ){
                        resolve(resData.lessonResRelList)
                    }
                    reject()
                }
            });
        })
    }

    function getMyExamList(){
        return new Promise(function(resolve, reject){
            var cookie = document.cookie;
            console.log(cookie)
            var time = new Date().getTime()
            var param = {"pageSize":50,"currentPage":1,"examStatus":"1","beginDate":"","endDate":"","tagType":1,"tagObjId":"","examName":"","menuId":""}
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://training.si-tech.com.cn/kmd_job_training/myExam/myExamList?cb="+time,
                cookie: cookie,
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                data: JSON.stringify(param),
                onload: function (res) {
                    let resData = JSON.parse(res.responseText);
                    if(resData.code && resData.code == '0' ){
                        _myExamList = resData.myExamList
                        resolve()
                    }
                    reject()
                }
            });
        })
    }

    function createButton(id,name,eventFun,div,className){
        let button = document.createElement("button"); //创建一个input对象（提示框按钮）
        button.id = id;
        button.textContent = name;
        button.className = className ? className : "mybtn boom";
        // button.addEventListener("click", eventFun)
        button.onclick = function () {
            if (eventFun)
                eventFun();
        }
        div.appendChild(button);
    }

    function random(a,b){
        return Math.round(Math.random() * (b-a)) + a;
    }

    function isEmpty(obj) {
        if (typeof obj === 'undefined' || obj == null || obj === '') {
            return true;
        } else {
            return false;
        }
    }

})();
