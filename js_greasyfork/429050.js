// ==UserScript==
// @name         测试市场监管总局学习辅助工具。
// @namespace    http://tampermonkey.net/
// @version      0.80
// @description  本脚本免费使用，长期更新，无需关注、订阅、加入或者额外注册。进入https://www.samrela.com/student/my_course.do?menu=course自动学习项目。如果大家用的还可以，帮忙给个好评，谢谢！
// @author       freeman99sd
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @match        https://*.xuexi.cn/
// @license MIT
// @match        https://www.samrela.com/student/class_offline_course.do?cid=466&elective_type=1&menu=offline_class&tab_index=11&init=init
// @match        https://www.samrela.com/student/my_course.do?searchType=1&menu=course
// @match        https://www.samrela.com/student/my_course.do?menu=course*
// @match        https://www.samrela.com/portal/play.do?id=*
// @match        https://www.samrela.com/student/course_category_index.do?categoryId=*
// @match        https://www.samrela.com/student/course_evaluation.do?userCourseId=*
// @match        https://www.samrela.com/student/course_category_index.do?menu=mall&categoryId=*
// @match        https://www.samrela.com//student/my_course.do?searchType=1&menu=course
// @match        https://www.samrela.com/student/class_myClassList.do?type=1&menu=myclass

// @match        https://www.samrela.com/student/class_myClassList.do?type=1&menu=myclass&init=init
// @run-at       document-idle
// @type        {正则表达式}
// @downloadURL https://update.greasyfork.org/scripts/429050/%E6%B5%8B%E8%AF%95%E5%B8%82%E5%9C%BA%E7%9B%91%E7%AE%A1%E6%80%BB%E5%B1%80%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/429050/%E6%B5%8B%E8%AF%95%E5%B8%82%E5%9C%BA%E7%9B%91%E7%AE%A1%E6%80%BB%E5%B1%80%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7%E3%80%82.meta.js
// ==/UserScript==

(async function() {
// 提取用户名和年份
const userName = document.querySelector('.user_name')?.textContent || 'unknown';
const yearMatch = document.body.textContent.match(/(\d{4})年/);
const year = yearMatch ? yearMatch[1] : new Date().getFullYear().toString();

// 构造本地存储键名
const userYearKey = `${userName}_${year}`;
const numberKey = `${userYearKey}_number`;
const totalCourseScoreKey = `${userYearKey}_totalCourseScore`;
const zongfenKey = `${userYearKey}_zongfen`;

// 先从本地存储读取数据（修正顺序问题）
let number = Number(localStorage.getItem(numberKey));
let totalCourseScore = Number(localStorage.getItem(totalCourseScoreKey));
let zongfen = Number(localStorage.getItem(zongfenKey));

// 初始化数据（读取后检查有效性）
if (isNaN(number) || number === 0) {
    number = 23;
    localStorage.setItem(numberKey, number.toString()); // 显式转为字符串
}
if (isNaN(totalCourseScore) || totalCourseScore === 0) {
    totalCourseScore = 0;
    localStorage.setItem(totalCourseScoreKey, totalCourseScore.toString());
}
if (isNaN(zongfen)) {
    zongfen = 50;
    localStorage.setItem(zongfenKey, zongfen.toString());
}

// 辅助函数：创建按钮
function createButton(text, id, top) {
    const btn = document.createElement("button");
    btn.innerHTML = text;
    btn.id = id;
    btn.style.cssText = `
        position: fixed;
        top: ${top}px;
        right: 0;
        z-index: 9999;
        padding: 10px;
        background: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
        transition: background 0.3s;
    `;
    // 增加hover效果
    btn.addEventListener('mouseover', () => btn.style.background = '#45a049');
    btn.addEventListener('mouseout', () => btn.style.background = '#4CAF50');
    document.body.appendChild(btn);
    return btn;
}

// 创建按钮UI
const button = createButton(
    `分钟/学时≤${number}时则选课`,
    "update-number-button",
    23
);

const button2 = createButton(
    `总分＜${zongfen}时停止学习 (已选总分:${totalCourseScore})`,
    "update-number-button2",
    73 // 与第一个按钮错开位置
);

// 按钮事件监听
button.addEventListener("click", function() {
    const input = prompt(`分钟/学时小于等于多少时则选课（当前：${number}）`, number);
    const newNumber = Number(input);
    if (!isNaN(newNumber)) {
        number = newNumber;
        localStorage.setItem(numberKey, number.toString());
        button.innerHTML = `分钟/学时≤${number}时则选课`;
    }
});

button2.addEventListener("click", function() {
    const input = prompt(`总分小于多少时停止学习（当前：${zongfen}）`, zongfen);
    const newZongfen = Number(input);
    if (!isNaN(newZongfen)) {
        zongfen = newZongfen;
        localStorage.setItem(zongfenKey, zongfen.toString());
        // 修复未定义变量问题，使用已声明的变量
        button2.innerHTML = `总分＜${zongfen}时停止学习 (已选总分:${totalCourseScore})`;
    }
});

    'use strict';
    //location.reload();
    console.log("开始")//开始运行
    if(window.location.href.slice(0,66) ==="https://www.samrela.com/student/course_evaluation.do?userCourseId=" ){
        window.close();}
    var fenshu=document.querySelectorAll(".tip_color");
    var fenshu1 = Array.prototype.slice.call(fenshu);
    //console.log(fenshu1.length)
    var ccc = 1;
    var zongfen1=0

    if(fenshu1.length!=0){
        zongfen1 = Number(fenshu1[2].innerText);
        console.log("当前分数:"+zongfen1)
        console.log("需要分数:"+zongfen)
    }

    if(window.location.href ==="https://www.samrela.com/student/class_myClassList.do?type=1&menu=myclass"){//专题课
        console.log("打开专题课0")
        var buttons4 = [];
        buttons4=document.querySelectorAll("div.join_special_list");
        //console.log(buttons4.length)
        var exams9 = Array.prototype.slice.call(buttons4);
        //console.log(exams9.length)
        if(exams9.length==0){
            console.log("新加专题课1")
            //window.open("https://www.samrela.com/student/class_register.do?cid=327&type=1&url=learn","_self - URL")//2024专题课
            await sleep(5000)
            //window.open("https://www.samrela.com/student/class_register.do?cid=330&type=1&url=learn","_self - URL")//2023专题课
            window.close();



            await sleep(10000)
        }
        if(exams9.length==1){
            console.log("新加专题课2")

            //window.location.href='/student/class_register.do?cid=330&type=1&url=learn'

            await sleep(10000)
        }
        if(exams9.length==2){
            console.log("新加专题课3")
            //window.open("https://www.samrela.com/student/class_detail_course.do?cid=327&elective_type=1&menu=myclass&tab_index=0&init=init","_self - URL")


            await sleep(10000)
        }

    }
    //https://www.samrela.com/student/class_myClassList.do?menu=myclass&type=1
    if(zongfen1<zongfen){//当前实际分数小于50或者小于输入分数
        console.log("当前分数:${zongfen1}")
        console.log(zongfen1)


        //console.log(fenshu1[2].outerText)
        //var ccc=fenshu1[2].outerText
        //for (var ii=0;ii<50;ii++){
        //await xuexi()
        //location.reload();
        // };
        //var zongfen


        if(window.location.href === "https://www.samrela.com/student/my_course.do?searchType=1&menu=course"){//在线自学

            var 分数=document.querySelectorAll("p.hoz_four_info>span")
            console.log("分数:")
            console.log(分数)
            //console.log(分数)

            if (分数.length === 0) {//判断是否有课
                // 处理空的 NodeList 的代码
                console.log("没有课，已学完，但是分数不够，增加分钟/学时的比值");
                number=number+1
              localStorage.setItem(numberkey, number);
                window.location="https://www.samrela.com/student/course_category_index.do?categoryId=0&menu=mall"//跳转选课中心

            } else {
                // NodeList 不为空的情况下执行的代码
                console.log("找到了匹配的元素");
                // 可以使用分数变量进行进一步操作
            }
            for(var pp=0; pp<(分数.length/4);pp++){
                var ewef=parseFloat(分数[pp*4].innerText)//分钟
                var ewef2=parseFloat(分数[pp*4+1].innerText)//学时
                console.log("分钟"+ewef+",学时"+ewef2+",分钟/学时="+ewef/ewef2+"    与"+number+"比较")
                if((ewef/ewef2)<number){//分钟/学时小于等于15则我要选课
                    await sleep(1000)
                    await sleep(1000)
                    //location.reload();
                    //const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))

                    var buttons = [];
                    while (buttons.length == 0) {

                        buttons=document.querySelectorAll("div > input[type]");
                    }
                    console.log(buttons)

                    var exams = Array.prototype.slice.call(buttons);
                    console.log(exams)

                    //window.alert(6 + 7);
                    exams[2].click();

                    //const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))


                    //xuexi2();
                    // window.close();
                    //location.reload();
                    //self.location.href="https://www.samrela.com/student/class_myClassList.do?type=1&menu=myclass"
                    await sleep(5000)
                    window.close();
                }
                else{//分钟/学时大于15则删除课程
                    await sleep(1000)
                    console.log("选课失败，没有需要的课")
                    var quxiao=document.querySelectorAll("div.clearfix>div > a[href]")
                    console.log(quxiao)
                    var quxiao2=quxiao[pp].outerHTML
                    console.log(quxiao2.slice(40))
                    var courseId= parseInt(quxiao2.slice(40))
                    console.log(courseId)
                    $.post("/student/my_course_delete.do",{"menu":"course","id":courseId},function(data=1){
                        if(data!=""&&data!=null){

                            window.location="https://www.samrela.com/student/my_course.do?searchType=1&menu=course";//在线自学
                        }else{
                            alert("参数错误，请刷新后重试");
                        }
                    })
                    await sleep(1000)
                }}


        }else if(window.location.href === "https://www.samrela.com/student/class_offline_course.do?cid=466&elective_type=1&menu=offline_class&tab_index=11&init=init"){//2025需要学习的专题课
        // 等待课程列表加载完成


        // 获取所有课程容器
        const assessmentBoxes = document.querySelectorAll('.assessment_box, ul');

        for (const box of assessmentBoxes) {
            // 检查是否包含"已完成"标识
            const isCompleted = box.querySelector('.is_completed')?.textContent.includes('未完成');

            if (isCompleted) {
                // 查找"我要学习"按钮
                const studyButton = box.querySelector('.mspx_clazz_btn a');

                if (studyButton && studyButton.textContent.includes('我要学习')) {
                    const courseTitle = box.querySelector('h3')?.textContent || '未知课程';
                    console.log(`检测到已完成课程: ${courseTitle}，准备点击学习按钮`);

                    // 点击学习按钮
                    studyButton.click();
                    console.log(`已点击课程: ${courseTitle}`);

                    // 等待5秒让页面加载
                    await sleep(5000);

                    // 关闭当前窗口
                    window.close();

                    // 等待2秒确保关闭操作完成
                    await sleep(2000);
                }else{
                  window.open("https://www.samrela.com/student/my_course.do?searchType=1&menu=course","_blank")//在线自学
                }
            }
        }
    }
        else if(window.location.href.slice(0,77) === "https://www.samrela.com/student/my_course.do?menu=course&searchType=1&year=20"){//删除今年之前的课程

            var 分数=document.querySelectorAll("p.hoz_four_info>span")
            console.log("分数:")
            console.log(分数)
            //console.log(分数)

            if (分数.length === 0) {//判断是否有课
                // 处理空的 NodeList 的代码
                console.log("没有课，已学完，但是分数不够，增加分钟/学时的比值");
                number=number+1


            } else {
                // NodeList 不为空的情况下执行的代码
                console.log("找到了匹配的元素");
                // 可以使用分数变量进行进一步操作
            }
            for(var pp=0; pp<(分数.length/4);pp++){
                var ewef=parseFloat(分数[pp*4].innerText)//分钟
                var ewef2=parseFloat(分数[pp*4+1].innerText)//学时
                console.log("分钟"+ewef+",学时"+ewef2+",分钟/学时="+ewef/ewef2+"    与"+number+"比较")

                    await sleep(1000)
                    console.log("选课失败，没有需要的课")
                    var quxiao=document.querySelectorAll("div.clearfix>div > a[href]")
                    console.log(quxiao)
                    var quxiao2=quxiao[pp].outerHTML
                    console.log(quxiao2.slice(40))
                    var courseId= parseInt(quxiao2.slice(40))
                    console.log(courseId)
                    $.post("/student/my_course_delete.do",{"menu":"course","id":courseId},function(data=1){
                        if(data!=""&&data!=null){
                          window.location=window.location.href

                        }else{
                            alert("参数错误，请刷新后重试");
                        }
                    })
                    await sleep(100)
                }


        }
        //function xuexi2(){
        //location.reload();
        else if(window.location.href.slice(0,42) === "https://www.samrela.com/portal/play.do?id="){//播放视频
            console.log('正在观看视频0')
            const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))
            delay(3000)
            var buttons2 = [];
            buttons2=document.querySelectorAll(".mask");
            console.log("移除确认按钮")
            await delay(1000)
            var exams2 = Array.prototype.slice.call(buttons2);
            //console.log(exams2)

            $("#mask").remove();//移除确认按钮
            $(".continue").remove();//移除确认按钮
            await sleep(10000)
            player.continuePlay();//播放视频
            //delay(10000)
            //buttons2[0].remove();

            //window.alert(6 + 8);
            //console.log(exams2[0])
            var buttons3 = [];
            buttons3=document.querySelectorAll(".first_title");
            delay(10000)
            var exams3 = Array.prototype.slice.call(buttons3);
            console.log(exams3)
            for (var i=0;i<exams3.length;i++){
                //exams3[i].click();
                console.log("视频名称"+buttons3[i].innerHTML)
                console.log("第${i+1}个视频");
                exams3[i].click();
                var elevideo1=document.getElementById("course_player");
                await sleep(10000)
                //player.continuePlay();
                await elevideo1.addEventListener('loadedmetadata',function(){//加载数据
                    //视频的总长度
                    console.log(elevideo1.duration); })
                await sleep(elevideo1.duration*1000)
                await sleep(1000)
                //console.log("sleep(1)")

            }console.log("即将跳转在线自学")
            await sleep(5000)
            window.open("https://www.samrela.com/student/my_course.do?searchType=1&menu=course","_blank")//视频播放完毕，跳转在线自学
            window.close();
            //self.location.href="https://www.samrela.com/student/class_myClassList.do?type=1&menu=myclass"

            //location.reload();
        }



        else if(window.location.href === "https://www.samrela.com/student/course_category_index.do?categoryId=0&menu=mall"){//选课中心界面
            var 左目录 = document.querySelectorAll("ul.menu2>li>a[href]")

            console.log(左目录[1].href)
            var hh
            for(hh=2;hh<左目录.length+2;hh++){
                window.open("https://www.samrela.com/student/course_category_index.do?menu=mall&categoryId="+hh," _blank")
                await sleep(100000)
            }// await sleep(200000)

            window.open("https://www.samrela.com/student/my_course.do?searchType=1&menu=course","_self - URL")

            //     }else if(window.location.href === "https://www.samrela.com/student/course_category_index.do?menu=mall&categoryId=2"||"https://www.samrela.com/student/course_category_index.do?menu=mall&categoryId=3"||"https://www.samrela.com/student/course_category_index.do?menu=mall&categoryId=4"||"https://www.samrela.com/student/course_category_index.do?menu=mall&categoryId=5"){
            //        await sleep(10000)
            //         await cj()

        }else if(window.location.href=== "https://www.samrela.com/student/course_category_index.do?menu=mall&categoryId=2"||
                 window.location.href=== "https://www.samrela.com/student/course_category_index.do?menu=mall&categoryId=3"||
                 window.location.href=== "https://www.samrela.com/student/course_category_index.do?menu=mall&categoryId=4"||
                 window.location.href=== "https://www.samrela.com/student/course_category_index.do?menu=mall&categoryId=5"||
                 window.location.href=== "https://www.samrela.com/student/course_category_index.do?menu=mall&categoryId=6"){

            await sleep(1000)
            console.log("打开了新网页3")
            var 初级展开 = document.querySelectorAll("div.zt-list-item>div[onclick]")
            console.log("初级展开")
            console.log(初级展开)

            for(var io=0;io< 初级展开.length;io++){


                var ss=初级展开[io].id.slice(6)
                console.log("网页后缀名")

                console.log(初级展开[io].innerText+"ii="+io+"ss="+ss)

                window.open(window.location.href+"&subjectId="+ss+"#second"+ss,)
                await sleep(10000)



            } window.close();

        }else if(window.location.href.slice(0, 78) === "https://www.samrela.com/student/course_category_index.do?menu=mall&categoryId=" || (window.location.href.length > 98 && window.location.href !== "https://www.samrela.com/student/class_detail_course.do?cid=330&elective_type=1&menu=myclass&tab_index=0&init=init" && window.location.href !== "https://www.samrela.com/student/class_detail_course.do?cid=327&elective_type=1&menu=myclass&tab_index=0&init=init")) {
            await sleep(1000)
            var 次级展开 = document.querySelectorAll("a[onclick]")
            var ii
            var ti
            //window.次级展开=次级展开
            console.log("次级展开")
            console.log(次级展开)
            console.log(次级展开.length)
            await sleep(1000)
            for(ii=0;ii< 次级展开.length;ii++ ){
                console.log("点击次级展开"+ii)
                次级展开[ii].onclick()
                await sleep(1000)
                var 页码 = document.querySelectorAll("li[page-rel=itempage]")
                //console.log(页码)

                //console.log("点击页码")
                console.log('一共几页'+(页码.length-1))
                console.log(页码.length)
                for (var x=0;x < 页码.length;x++){
                    await sleep(100)
                    console.log("正在点击")
                    await sleep(100)
                    //await 页码[x].click()
                    document.querySelectorAll("li[page-rel=nextpage]")[0].click()
                    console.log(页码[x])
                    await sleep(100)
                    //var xuanke =document.getElementById('hoz_btn_select')
                    var xuanke = document.querySelectorAll("div.hoz_course_row")
                    console.log("查找选课")
                    console.log(xuanke)
                    for( var tii=0;tii< xuanke.length;tii++){
                        const timeElement = xuanke[tii].querySelector('.hoz_four_info span:first-child');
                        const minutesMatch = timeElement.textContent.match(/(\d+)\s*分钟/);
                        const minutes = minutesMatch ? parseFloat(minutesMatch[1]) : 0;
                        const creditElement = xuanke[tii].querySelector('.hoz_four_info span:nth-child(2)');
                        const creditMatch = creditElement.textContent.match(/(\d+\.\d+|\d+)\s*学时/);
                        const credits = creditMatch ? parseFloat(creditMatch[1]) : 0;
                        const ratio = minutes / credits;
                        var xuanke1=xuanke[tii].lastChild.lastChild.lastChild
                        var xuanke0=xuanke[tii].lastChild.lastChild
                        //console.log(xuanke0)
                        await sleep(200)
                        if(xuanke1.type!='button'&& xuanke1.innerText!="课程测验"&&(minutes / credits)<number){
                            await sleep(100)
                            await xuanke1.onclick()
                          totalCourseScore=totalCourseScore+credits
                          localStorage.setItem(totalCourseScorekey, totalCourseScore);
                          console.log("已选课程为")
                          console.log(xuanke[tii])
                          console.log("选课成功")
                            //
                        }//console.log("选课失败+")

                    }//console.log("选课结束")

                    await sleep(100)
                }

            }
            await sleep(10000)
            window.close();
        }


        function cj () {
            //console.log("sleep");
            var 展开 = document.querySelectorAll("ul.menu2>li>a[href]")
            console.log(展开)
            var 初级展开 = document.querySelectorAll("div.zt-list-item>div[onclick]")
            console.log("初级展开")
            console.log(初级展开)
            for(var jjj=2 ;jjj< 4;jjj++){
                for(ii=0;ii< 初级展开.length;ii++){
                    console.log()

                    var ss=初级展开[ii].id.slice(6)
                    console.log("ii="+ii+"ss="+ss)

                    window.open("https://www.samrela.com/student/course_category_index.do?menu=mall&categoryId="+jjj+"&subjectId="+ss+"#second"+ss,)

                }

            }}







        function sleep (time) {
            //console.log("sleep");
            return new Promise((resolve) => setTimeout(resolve, time));

        }


    }
    else{//当50学时学完后学习专题课
        if(window.location.href === "https://www.samrela.com/student/my_course.do?searchType=1&menu=course"){//在线自学

            var 分数 =document.querySelectorAll("p.hoz_four_info>span")
            console.log("分数")
            console.log(分数)
            //console.log(分数)

            if (分数.length === 0) {
                // 处理空的 NodeList 的代码
                console.log("没有课，已学完，跳转专题课");
                await sleep(3000)
                window.open("https://www.samrela.com/student/class_myClassList.do?type=1&menu=myclass&init=init",'_self - URL')
                window.close()

            } else {
                // NodeList 不为空的情况下执行的代码
                console.log("有课，但是已学完50学时，跳转2025专题课");
                await sleep(3000)
                window.open("https://www.samrela.com/student/class_offline_course.do?cid=466&elective_type=1&menu=offline_class&tab_index=11&init=init",'_self - URL')
                window.close()
                // 可以使用分数变量进行进一步操作
            }
        }else if(window.location.href ==="https://www.samrela.com/student/class_myClassList.do?type=1&menu=myclass&init=init"){//专题课
            console.log("https://www.samrela.com/student/class_myClassList.do?type=1&menu=myclass&init=init")
            await sleep(6000)
            window.open("https://www.samrela.com/student/class_detail_course.do?cid=327&elective_type=1&menu=myclass&tab_index=0&init=init",'_self - URL')

        }else if(window.location.href.slice(0,42) === "https://www.samrela.com/portal/play.do?id="){
            console.log("专题课")
            const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))
            await delay(10000)
            var buttons29 = [];
            buttons29=document.querySelectorAll(".mask");
            console.log(buttons29)
            delay(10000)
            var exams29 = Array.prototype.slice.call(buttons29);
            console.log(exams29)
            await delay(3000)
            $("#mask").remove();
            $(".continue").remove();
            await sleep(5000)
            player.continuePlay();
            //delay(10000)
            //buttons2[0].remove();

            //window.alert(6 + 8);
            //console.log(exams2[0])


            var buttons39 = [];
            buttons39=document.querySelectorAll(".first_title");
            console.log(buttons39)
            delay(10000)
            var exams39 = Array.prototype.slice.call(buttons39);
            console.log(exams39)
            for (var iii=0;iii<exams39.length;iii++){
                //exams3[i].click();
                console.log(iii);
                exams3[iii].click();
                var elevideo19 = document.getElementById("course_player");
                await sleep(10000)

                await elevideo19.addEventListener('loadedmetadata',function(){//加载数据
                    //视频的总长度
                    console.log(elevideo19.duration); })
                await sleep(elevideo19.duration*1000)
                await sleep(1000)
                //console.log("sleep(1)")

            }
            //window.close();
            //self.location.href="https://www.samrela.com/student/class_myClassList.do?type=1&menu=myclass"
            window.open("https://www.samrela.com/student/class_detail_course.do?cid=327&elective_type=1&menu=myclass&tab_index=0&init=init",'_self - URL')
            //location.reload();

        }else if(window.location.href ==="https://www.samrela.com/student/class_detail_course.do?cid=327&elective_type=1&menu=myclass&tab_index=0&init=init"){
            //327专题课
            var 分数1=document.querySelectorAll("p.hoz_four_info>span")
            console.log("专题课学习")
            console.log(分数1)

            var buttons1 = [];
            var buttons17 = [];
            while (buttons1.length == 0) {

                buttons1=document.querySelectorAll("div.hoz_accordion>div>div.clearfix>div>a");
            }
            console.log(buttons1)
            while (buttons17.length == 0) {

                buttons17=document.querySelectorAll("div.hoz_course_row>div.clearfix>div>span");
            }
            console.log(buttons17)
            var exams1 = Array.prototype.slice.call(buttons1);
            var exams15 = Array.prototype.slice.call(buttons17);
            console.log(exams1)

            //window.alert(6 + 7);
            for (var iiii=0;iiii<exams1.length;iiii++){
                if(exams1[iiii].innerText=="我要学习" && exams15[iiii].innerText=="100.0%"){
                    window.open("https://www.samrela.com/student/class_detail_course.do?cid=330&elective_type=1&menu=myclass&tab_index=0&init=init",'_self - URL')


                }else{



                    await sleep(6000)
                    console.log(exams1[iiii])
                    exams1[iiii].click();
                }


                //const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))


                //xuexi2();
                // window.close();
                //location.reload();
                //self.location.href="https://www.samrela.com/student/class_myClassList.do?type=1&menu=myclass"
                await sleep(10000)
                window.close();
            }
        }else if(window.location.href ==="https://www.samrela.com/student/class_detail_course.do?cid=330&elective_type=1&menu=myclass&tab_index=0&init=init"){
            var 分数1=document.querySelectorAll("p.hoz_four_info>span")
            console.log("专题课学习")
            console.log(分数1)

            var buttons1 = [];
            var buttons17 = [];
            while (buttons1.length == 0) {

                buttons1=document.querySelectorAll("div.hoz_accordion>div>div.clearfix>div>a");
            }
            console.log(buttons1)
            while (buttons17.length == 0) {

                buttons17=document.querySelectorAll("div.hoz_course_row>div.clearfix>div>span");
            }
            console.log(buttons17)
            var exams1 = Array.prototype.slice.call(buttons1);
            var exams15 = Array.prototype.slice.call(buttons17);
            console.log(exams1)

            //window.alert(6 + 7);
            for (var iiii=0;iiii<exams1.length;iiii++){
                if(exams1[iiii].innerText=="我要学习" && exams15[iiii].innerText=="100.0%"){

                    alert("完成学习");

                }else{



                    await sleep(6000)
                    console.log(exams1[iiii])
                    exams1[iiii].click();
                }


                //const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))


                //xuexi2();
                // window.close();
                //location.reload();
                //self.location.href="https://www.samrela.com/student/class_myClassList.do?type=1&menu=myclass"
                await sleep(10000)
                window.close();
            }}

        else{
            await sleep(1000)
            console.log("选课失败，没有需要的课")
            var quxiao1=document.querySelectorAll("div.clearfix>div > a[href]")
            console.log(quxiao)
            var quxiao21=quxiao1[pp].outerHTML
            console.log(quxiao21.slice(40))
            var courseId1= parseInt(quxiao21.slice(40))
            console.log(courseId1)
            $.post("/student/my_course_delete.do",{"menu":"course","id":courseId1},function(data=1){
                if(data!=""&&data!=null){
                    window.location="https://www.samrela.com/student/my_course.do?searchType=1&menu=course";
                }else{
                    alert("参数错误，请刷新后重试");
                }
            })
            await sleep(1000)
        }}
    function sleep (time) {
        //console.log("sleep");
        return new Promise((resolve) => setTimeout(resolve, time));

    }

}

)();
