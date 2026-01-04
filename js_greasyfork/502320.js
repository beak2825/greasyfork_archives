// ==UserScript==
// @name         2024-暑期教师研修
// @namespace
// @version      1.0
// @description  进入课程页面后，自动播放视频，静音，倍速（2倍）。PS：初学，自用
// @author       sndcyp
// @match        https://basic.smartedu.cn/*
// @icon
// @grant        none
// @namespace https://greasyfork.org/users/781530
// @downloadURL https://update.greasyfork.org/scripts/502320/2024-%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/502320/2024-%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE.meta.js
// ==/UserScript==
var KC_url = [
    // 大力弘扬教育家精神
    "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0de67197-af6f-43ab-8d89-59a75aab289e&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
    // 强化国家安全与文化自信
    "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=4eb65b2f-0b53-4d3f-8027-81d69dca7f18&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
    // 数字素养与技能提升
    "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=c6ac438b-9c68-45ee-aa1f-a3754cdd5c89&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
    // 科学素养提升
    "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=bc6232ef-1a1c-4da6-b53e-a929f9427e8a&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
    // 心理健康教育能力提升
    "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0bbcd4e7-f227-47f8-b4f2-2fb339ac1edc&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
    // 综合育人能力提升
    "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=f78d68fb-0386-4a26-aeb9-d0835b35bde2&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
    // 幼儿社会情感学习
    "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=fa649a38-6284-4ee4-b4de-b9a77c5e5faa&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
    // 中小学实验教学基本目录理念与实践培训
    "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=6add8346-d463-4ee9-8aae-e8d84bc0b43b&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
    // 高中作业设计与研究
    "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=c83105a9-e6ea-48bc-bb6a-622416577fee&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
    // 特殊教育拓展融合
    "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=12010fd9-8eea-473a-afcd-3c8a932e7553&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
    // 2022年版义务教育课程方案和课程标准国家级示范培训
    "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=6add8346-d463-4ee9-8aae-e8d84bc0b43b&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
]
var KC_sl = [7, 2, 3, 1, 4, 4, 0, 6, 0, 0, 0];//课程学习视频数量
var log = console.log;

window.onload = function () {
    setInterval(() => {
        if (document.URL.search("training/5d7cf98c-3a42-4b13-8e5f-56f40ce08b1d") > 1) {
            goKCXXYM();
        }
        if (document.URL.search("training/2024sqpx") > 1) {
            goKCXXYM();
        }
        if (document.URL.search("teacherTraining/courseDetail") > 1) {
            goBFSP();
        }
    }, 2e3)
}

function goBFSP() {
    //点击“我知道了”
    var zz = document.querySelector(".fish-modal-body");
    if(zz){
        zz.querySelector("button").click();
    }
    //展开所有视频列表
    var a_1 = document.getElementsByClassName("fish-collapse-header");
    for (var j=0;j<a_1.length;j++){
        a_1[j].click();
    }
    //自动做题
    var lx=document.querySelectorAll('.size');
    var xyt=document.querySelectorAll('button');
    if(lx.length>0){
        lx[0].click();
        xyt[xyt.length-1].click();
    }
    //自动播放视频
    var href = window.location.href;//获取当前网址
    var index = KC_url.indexOf(href);//课程链接中的第几个，0开始
    var zt = document.querySelectorAll('div.status-icon > i');//视频状态
    for (var i = 0; i < zt.length; i++ ) {
        if (zt[i].title != "已学完") {
            if(i < KC_sl[index]){
                zt[i].click();
                play();
                break;
            }
            if(i > KC_sl[index]){
                window.location.href = "https://basic.smartedu.cn/training/2024sqpx";
                break;
            }
        }
    }
}

function play() {
    var v = document.getElementsByTagName("video")[0];
    if(v.paused){
        //v.dispatchEvent(new Event("ended"));//秒看
        v.muted = true;//静音
        v.playbackRate = 2;//倍速
        v.play();//播放
        //setTimeout( function(){}, 1000 );
        //v.pause();//暂停
        //v.currentTime = v.duration;//当前播放位置=视频总时长
        //setTimeout( function(){}, 1000 );
        //v.play();//播放

    }

}

function goKCXXYM() {
    var hq_1 = document.querySelectorAll('.index-module_box_tpPEe');//所有课程名称
    for (var i=0;i<hq_1.length;i++){
        if (KC_sl[i]>0){
            if(i<6){
                if(hq_1[i].innerText.search("已认定")>-1){
                    var yrd =Number( hq_1[i].querySelectorAll("span")[2].innerText);//已认定学时
                    var rd =Number( hq_1[i].querySelectorAll("span")[3].innerText);//认定学时
                    //log(yrd,rd);
                    if(yrd<rd){
                        window.location.href = KC_url[i];
                        break;
                    }
                }
            }
            if(i>5){//学科教学能力提升进度
                var tt = document.querySelector('.index-module_phase_main_v27u1');
                var te =Skg( tt.innerText);
                var yrd_ =Number(tt.querySelector('span').innerText);//已认定学时
                var rd_ =Number( te.substring(te.indexOf('/认定')+3,te.indexOf('学时')));//认定学时
                if(yrd_<rd_){
                    window.location.href = KC_url[i];
                    break;
                }
            }
        }
    }
}

function Skg(str) {//删除字符串中的所有空格
    return str.replace(/\s+/g, '');
}
function Szf(str,text) {//删除字符串中的指定字符
    return str.replace(new RegExp(text, 'g'), "");
}