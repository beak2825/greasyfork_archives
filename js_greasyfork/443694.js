// ==UserScript==
// @name         基础教育教师培训2022
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  油猴挺好用，借此机会，推荐给同行。课程里的视频,都是猴年马月录制的吧?至少我看到的那些都是老的软件的教程.
// @homepage     没有网站
// @supportURL   也不提供支持
// @author       暴躁老铁匠
// @match        https://*.gpa.enetedu.com/MyCourse/MyCurriculum*
// @match        https://*.gpa.enetedu.com/ChooseCourseCenter/CourseInterface*
// @match        https://*.gpa.enetedu.com/Common/RecordPlayBack*

// @resource css https://www.layuicdn.com/layui-v2.5.6/css/layui.css


// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant GM_setValue
// @grant GM_getValue

// @grant GM_addStyle
// @grant GM_getResourceText

// @downloadURL https://update.greasyfork.org/scripts/443694/%E5%9F%BA%E7%A1%80%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD2022.user.js
// @updateURL https://update.greasyfork.org/scripts/443694/%E5%9F%BA%E7%A1%80%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD2022.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // console.log(GM_getResourceURL("css"),GM_getResourceText("css"));//url是一个base64的url
    GM_addStyle(GM_getResourceText("css"));


    let myHost="https://hbt.gpa.enetedu.com";//主页

    var classList="CourseInterface";//地址包含这句，就是课程列表页，注意，iframe里的地址，并没有在地址栏显示
    if(document.URL.indexOf(classList)>-1)//当前页面是课程列表页
    {

        CreateClassListData();
    }
    var myLessonPage= "MyCurriculum";//lesson列表页
    if(document.URL.indexOf(myLessonPage)>-1)
    {
        CreateLessonListData()
        for(let i of document.querySelectorAll("td:nth-child(2) >div>ul.courseName>li>a"))
        {
            i.click();
        }
    }

    let playPage="RecordPlayBack";//播放页,内嵌在MyCurriculum
    if(document.URL.indexOf(playPage)>-1)
    {
        //  window.setTimeout(myRecord, 5000);


        window.setTimeout(myRecord2, 5000);
        console.error("myRecord2已运行");
    }



    //循环lesson列表，获取地址
    function getLessonList()
    {
        var data=[];
        for(let i of document.querySelectorAll("td:nth-child(1) >div>ul.courseName>li"))
        {
            if(i.innerText.indexOf("未开始")>-1 || i.innerText.indexOf("未学完")>-1){

                let v=i.id.toString().split("_")[2];

                data.push(v)//只需要id即可，调用页面自己的courseplay函数
            }
        }
        return data;
    }

    function CreateLessonListData()
    {
        console.log("CreateLessonListData函数"+"\n"+location.href);

        let myLessonListData=[];
        myLessonListData=GM_getValue("lList",[]);
        if(myLessonListData.length==0)
        {         
            myLessonListData  =getLessonList();

            if(myLessonListData.length==0)//读取所有数据还是空，则说明都学了。
            {
                NextClass();
            }
            else
            {
                GM_setValue("lList",myLessonListData);//把这些课，存入列表
            }

        }
        else
        {

        }
        window.setTimeout(NextLesson, 10000);

    }


    function NextClass()
    {
        console.log("nextClass函数"+"\n"+location.href);
        let myClassListData=[];//存储class列表
        myClassListData=GM_getValue("cList",[]);//获取class列表
        if(myClassListData.length==0)//如果class为空白，则认为学完了所有class
        {
            location.href =myHost+"/UserCenter/myOptional";
        }
        else
        {
            let myUrl=myClassListData.pop();
            GM_setValue("cList",myClassListData);


            location.href =myUrl;//转到新的class

            // console.log(myUrl);
        }
    }
    function NextLesson(){

        console.log("nextLesson函数"+"\n"+location.href);


        let myLessonListData=[];//存储lesson列表

        myLessonListData=GM_getValue("lList",[]);
        if(myLessonListData.length==0)//如果Lesson==0，则认为学完了所有Lesson
        {
            NextClass();

        }
        else
        {
            //有时候会出现,不知从哪导航过来,这时候列表的课程不是当前页的,会出错,所以做了个判断而已.
            let myId=myLessonListData.pop();
            var data  =getLessonList();//获取当前课程列表
            if(data.includes(myId))
            {
                GM_setValue("lList",myLessonListData);
                courseplay(myId);//转到新的lesson courseplay是页面自带函数
            }
            else
            {
                myId=data.pop();
                GM_setValue("lList",data);
                courseplay(myId);//转到新的lesson courseplay是页面自带函数
            }
        }



    }

    function CreateClassListData(){
        let myClassListData=[];//存储课程列表

        console.log("CreateClassListData函数"+"\n"+location.href);
        //列表页删一下.
        deleteCookie();

        //循环课程列表，获取地址
        for(let i of document.querySelectorAll("#courseList > tr"))
        {
            if(i.innerText.indexOf("未完成")>-1){
                let v=i.onclick.toString().split("'")[1];
                // console.log(v);
                myClassListData.push(myHost+v);
            }
        }

        //存入cookie，备用
        GM_setValue("cList",myClassListData);
        //只要到了class页面，就需要把之前的lesson数据清空
        GM_setValue("lList",[]);

        //创建一个按钮
        //<button type="button" class="layui-btn layui-btn-lg layui-btn-normal">大型按钮</button>
        var a=document.createElement("button");

        var x=document.createTextNode("点击下面的科目，快速通关");
        a.appendChild(x);
        a.id="mybutton";
        a.className="layui-btn layui-btn-lg layui-btn-normal";
        //a.style="font-size:20px ;";

        var li=document.createElement("li");
        li.appendChild(a);

        //li.style="width: 320px; height: 50px;border: 1px solid gray;background:#003355;";

        document.querySelector("div.item-hd ul").appendChild(li);


    }
    /*    function courseplay(coursewareid) {
        var project_id = $("#project_id").val();
        var course_id = $("#courseID").val();
        var classtopic_id = $("#classtopic_id").val();
        window.location.href =myHost+ "/MyCourse/MyCurriculum?ProcesFlag=true&courseID=" + course_id + "&project_id=" + project_id + "&coursewareid=" + coursewareid + "&classtopic_id=" + classtopic_id;
    }
*/
    function deleteCookie(cName="morenshuju")
    {
        //网站本身有问题,cookies会不断增加.会出错.咱给他删一些没用的.
        let cList=[];

        for (let c in $.cookie())
        {
            if(c.indexOf("enet_studentCourseWareLearn")>=0&&c!=cName)
            {
                cList.push(c);
            }
            else
            {
                //     console.log(c);
            }
        }
        if(cList.length>35)
        {
            for(let c  of cList)//什么时候用of,什么时候用in,真是头大.
            {
                console.log($.removeCookie(c, {path: '/' }));
            }
        }
    }


    //2022年4月20日,这个是新的计时函数,本着好狗转爱啃硬骨头的精神,鼓捣一下.
    //RecordDuration
    function myRecord2()
    {
        var Total_duration = $(".qplayer-totaltime").html(); //获取总时长


        var Total_duration_str = Total_duration.split(":");
        var Total_seconds = parseInt(Total_duration_str[0]) * parseInt(60) + parseInt(Total_duration_str[1]); //总秒数


        var n=Math.floor(Total_seconds/180);//总时长/180的值Math.floor//向下取整
        var video_start_time = (n-1)*180-1;
        var video_end_time = video_start_time+180;

        if (is_getCookie_finished() == "0") {
            $.post("/VideoPlay/StageSurvey", { course_id: $("#course_id").val(), courseware_id: $("#courseware_id").val(),viedo_type:$("#JumpType").val() ,start: video_start_time, end: video_end_time, student_id:  $("#student_id").val(),course_type: $("#course_type").val()},
                   function(data,status) {
                if(data!=null && data !="undefined"){
                    if(data==9){
                        console.error('----系统检测到您可能存在刷课行为，此行为有封号风险，请正确参与学习！');
                    }else if(data == 1){
                        console.error('----学习数据异常，请返回重新学习');
                    }

                    console.error(status);
                }
            });
        }

    }

    //2022年4月20日发现下面的函数对方不用了.换了上面的RecordDuration
    function myRecord() {


        console.log("myRecord函数"+"\n"+location.href);
        var coursewave_percent;
        var IS_FINISHED;
        var zjcourseid;
        var type;
        var COURSE_ID12;
        var DURATION = 0;
        var COURSEWARE_ID12;
        var learn;
        var ID12;
        var classtopic_id;
        var key123;
        var subject_id;
        var iPlaySec = parseInt("0");

        var cName='enet_studentCourseWareLearn'+getQueryStringByName('courseware_id')+'1';
        deleteCookie(cName);
        var enet_studentCourseWareLearn =decodeURIComponent(getCookie(cName)).split("&");
        for (var j = 0; j < enet_studentCourseWareLearn.length; j++) {
            var learnCookie = enet_studentCourseWareLearn[j].split("=");
            if (learnCookie[0] == "coursewave_percent") {
                coursewave_percent = learnCookie[1];
            }
            else if (learnCookie[0] == "course_id") {
                COURSE_ID12 = learnCookie[1];
            }
            else if (learnCookie[0] == "classtopic_id") {
                classtopic_id = learnCookie[1];
            }
            else if (learnCookie[0] == "course_type") {
                type = learnCookie[1];
            }
            else if (learnCookie[0] == "courseware_id") {
                COURSEWARE_ID12 = learnCookie[1];
            }
            else if (learnCookie[0] == "student_id") {
                ID12 = learnCookie[1];
            }
            else if (learnCookie[0] == "key") {
                key123 = learnCookie[1];
            }
            else if (learnCookie[0] == "finished") {
                IS_FINISHED = learnCookie[1];
            }
            else if (learnCookie[0] == "learn") {
                learn = learnCookie[1].split("|");
            }
            else if (learnCookie[0] == "iPlaySec") {
                iPlaySec = parseInt(learnCookie[1]);
            }
            else if (learnCookie[0] == "duration") {
                DURATION = learnCookie[1];
                if(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i.test(navigator.userAgent))
                {

                }
                else if (/(Firefox|Chrome|Opera|Safari)/i.test(navigator.userAgent))
                {
                    var End_time = $(".qplayer-totaltime").html();
                    var End_time_str = End_time.split(":");
                    var End_seconds = parseInt(End_time_str[0]) * parseInt(60) + parseInt(End_time_str[1]); //结束总秒数
                    DURATION = End_seconds;
                }

            }
            else if (learnCookie[0] == "subject_id") {
                subject_id = parseInt(learnCookie[1]);
            }
        }
        if (IS_FINISHED != "1") {
            /*      var iStart = 0;
            var iEnd = 0;
            for (var i = 0; i < learn.length - 1; i++) {
                var study = learn[i].split(",");
                var studyStart = parseInt(study['0']);
                var studyEnd = parseInt(study['1']);
                if (i == 0) {
                    iStart = studyStart;
                    iEnd = studyEnd;
                }
                if (studyStart > iEnd) {
                    iPlaySec = iPlaySec + (iEnd - iStart);
                    iStart = studyStart;
                    iEnd = studyEnd;
                }
                else if (studyEnd > iEnd) {
                    iEnd = studyEnd;
                }
                if (i == learn.length - 2) {
                    iPlaySec = iPlaySec + (iEnd - iStart);
                }
            }
            */
            console.log("准备record,发送...");
            iPlaySec=DURATION;
            if (iPlaySec / DURATION >= coursewave_percent) {
                if (iPlaySec > DURATION) {
                    iPlaySec = DURATION;
                }
                var url = "/VideoPlay/updateStudyStatue";
                $.post(url,
                       {
                    subject_id:subject_id,
                    course_id: COURSE_ID12,
                    courseware_id: COURSEWARE_ID12,
                    student_id: ID12,
                    course_type: type,
                    wordkey: key123,
                    iPlaySec: iPlaySec,
                    playSec: iPlaySec,//iEnd - iStart,
                    classtopic_id:classtopic_id
                },function(data) {

                });
            }
        }
        else
        {
            console.log("本节已学完,不用发送.");
        }
    }
    function getQueryStringByName(name) {
        var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    }


})();