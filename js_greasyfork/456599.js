// ==UserScript==
// @name         GD干部学习[不弹窗]
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  辅助学习工具
// @author       404
// @license MIT

// @match        https://gbpx.gd.gov.cn/*
// @match        https://*.shawcoder.xyz/*
// @grant        unsafeWindow
// @grant        GM_openInTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/456599/GD%E5%B9%B2%E9%83%A8%E5%AD%A6%E4%B9%A0%5B%E4%B8%8D%E5%BC%B9%E7%AA%97%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/456599/GD%E5%B9%B2%E9%83%A8%E5%AD%A6%E4%B9%A0%5B%E4%B8%8D%E5%BC%B9%E7%AA%97%5D.meta.js
// ==/UserScript==


const AUTO_REFRESH_TIME = 300;
var new_window;

'use strict';

//取消alert弹窗
//测试无效。学习页面的alert弹窗为页面自带，无法通过脚本跳过
unsafeWindow.alert = function(){return false};
window.alert = function(){return false};
Window.prototype.alert = function(){return false};

//列表页一级页面
if(window.location.pathname == '/gdceportal/Study/StudyCenter.aspx'){

    let selector_imgAndMessage = "#aspnetForm > div:nth-child(13) > div.imgAndMessage"
    wait_element(selector_imgAndMessage,function(){
        document.querySelector(selector_imgAndMessage).remove()
    })

    let selector_header = "#aspnetForm > div.signup_header2"
    wait_element(selector_header,function(){
        document.querySelector(selector_header).remove()
    })

}

//课程列表页面
if(window.location.pathname == '/gdceportal/Study/LearningCourse.aspx'){
    //console.log('检测到课程列表页面...')
    var selector_course = '#gvList_ctl02_HyperLink2'      //第一个课程的标题

    wait_element(selector_course,function(){
        setTimeout(do_study(selector_course),3000)
    })


    //处理主页面等待刷新时间
    wait_element("#gvList > tbody > tr:nth-child(2)",function(){
        let course_percent = parseFloat(document.querySelector("#gvList > tbody > tr:nth-child(2) > td:nth-child(5) > div > div:nth-child(2)").textContent)*0.01
        let study_time_hour = parseFloat(document.querySelector("#gvList > tbody > tr:nth-child(2) > td:nth-child(2)").textContent)

        //一个学时对应大概42-45min
        let study_time_second = parseInt(study_time_hour/60*45*60*60*(1-course_percent))+1
        let refresh_time_second = AUTO_REFRESH_TIME

        console.log('当前课程剩余：'+study_time_second+'s  当前进度：'+course_percent*100+'%')


        //页面显示刷新倒计时
        let last_time = refresh_time_second
        setInterval(function(){
            document.querySelector("#gvList_ctl02_HyperLink1").innerText = '🚩 '+last_time+'s';
            last_time += -1;
        },1000);

        sleep(refresh_time_second*1000).then(() => {

            new_window.close();
            //console.log('移除iframe')
            //document.querySelector('iframe#auto_gbpx').remove()

            /*
            if(is_almost_done = true){
                selector_course = "#gvList_ctl03_HyperLink2";
                wait_element(selector_course,function(){
                    setTimeout(do_study(selector_course),3000)
                })
            };
            */

            location.reload(true);
        })
    })

}

//打开后课程页面

if(window.location.pathname == '/gdceportal/Study/CourseDetail.aspx'){
    //console.log('准备播放视频...')
    var selector_start_button = '#btnStudy'
    wait_element(selector_start_button,function(){
        document.querySelector(selector_start_button).click()
    })
}


//视频播放页面
if(window.location.host == 'wcs1.shawcoder.xyz' & window.location.pathname == '/gdcecw/play_pc/playmp4_pc.html'){
    window.onload=function(){
        console.log('自动播放视频')
        let is_muted = false;
        const k = 20;
        let j = 0;
        while (!is_muted && j < k) {
            sleep(200)
            j = j + 1
            //console.log(j)
            if (document.querySelector('video')) {
                document.querySelector('video').muted = true;
                is_muted = true;
            }
        };
        wait_element("#my-video > button",function () {
            setTimeout(function(){
                document.querySelector("#my-video_html5_api").play()
            },3000)
        })
    }
}

function do_study(selector){

    let course_link = document.querySelector(selector)
    //第一个课程变色
    document.querySelector("#gvList > tbody > tr:nth-child(2)").style.backgroundColor = "yellow"
    document.querySelector("#gvList > tbody > tr:nth-child(2)").style.color = "red"
    //document.querySelector("#gvList_ctl02_HyperLink1").innerText = '**学习中**'

    //拼接课程视频页面url

    let course_url = 'https://gbpx.gd.gov.cn/gdceportal/Study/'+ course_link.href.slice(14,67)
    //console.log('已打开页面-> '+course_url)

    //拼接跳转后的地址
    //let cid = course_link.href.slice(14+21,67)
    //let course_url = 'https://wcs1.shawcoder.xyz/gdcecw/play_pc/playverif_pc.html?t=2f4fd72bdf4a421f8e83d72060c414f5&courseLabel=wlxy&courseId='+cid

    /*
    //方式1：嵌入iframe
    var body = document.getElementsByTagName("body");
    var div = document.createElement("div");
    div.innerHTML = '<iframe id="auto_gbpx" name="auto_gbpx" src="'+course_url+'" height = "0" width = "0" frameborder="0" scrolling="auto" style = "display:none;visibility:hidden" ></iframe>';
    document.body.appendChild(div);
    */

    //方式2：GM自带方法打开新页面，不被浏览器alert阻塞，可通过close关闭页面
    new_window = GM_openInTab(course_url,'insert')


}


function sleep (time_ms) {
    return new Promise((resolve) => setTimeout(resolve, time_ms));
}

/*
    功能:等待dom加载后执行函数
    dom_selector :选择器参数  待加载的dom = document.querySelector(dom_selector)
    func:待执行函数体，用匿名函数传参
    */
function wait_element(dom_selector, func) {
    let is_DomExist = false;
    let interval = 100;//时间间隔
    var int_checkDom = setInterval(() => {
        if (document.querySelector(dom_selector)) {
            is_DomExist = true;
            func();
        };
        if (is_DomExist) {
            clearInterval(int_checkDom);
        }
    }, interval);
};