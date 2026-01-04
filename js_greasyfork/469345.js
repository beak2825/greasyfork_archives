// ==UserScript==
// @name         蓝天教育基础教育教师培训
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  蓝天 教育 基础教师培训 公需课 刷课 教师
// @author       空山新愚
// @match        https://v3.lt-edu.net/*
// @match        https://jstsgc.gdedu.gov.cn/*
// @match        https://preview.dccloud.com.cn/*
// @grant        none
// @license      MPL
// @downloadURL https://update.greasyfork.org/scripts/469345/%E8%93%9D%E5%A4%A9%E6%95%99%E8%82%B2%E5%9F%BA%E7%A1%80%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/469345/%E8%93%9D%E5%A4%A9%E6%95%99%E8%82%B2%E5%9F%BA%E7%A1%80%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==

window.onload = function(){
    do_see()

    setTimeout(refresh,5000 * 60);
}

function refresh(){
    let hre = location.href;
    if (hre.includes("https://v3.lt-edu.net/student.html#/index/classStudy")) {
        flag_choose_item = false
        location.reload(true);
    }
}

function click_item(){
    console.log("click_item")
    var enter = 'body > div.el-message-box__wrapper > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--small.el-button--primary';
    if(document.querySelector(enter)){
        document.querySelector(enter).click();
    }


}

function watch(){
    let hre = location.href;
    if (hre.includes("https://v3.lt-edu.net/student.html#/index/classStudy")) {
        console.log("watch")
        try {
            document.querySelector("video").play();
            document.querySelector("video").volume = 0;
            document.querySelector("video").playbackRate = 1;
        } catch (error) {setTimeout(watch, 500)}

    }
}

function sleep(delay) {
    for(var t = Date.now(); Date.now() - t <= delay;);
}

var listLen = 0;

function getListCount(){
    let t = 0;
    if(document.getElementsByClassName('mb18 mt18 pr video')[document.getElementsByClassName('mb18 mt18 pr video').length - 1].childNodes[1].firstChild.children[0])
    {
        try{
            t = document.getElementsByClassName('mb18 mt18 pr video')[document.getElementsByClassName('mb18 mt18 pr video').length - 1].childNodes[1].firstChild.children[0].childElementCount;
        }catch(error){setTimeout(listLen = getListCount(), 3000);}
    }
    return t;
}

var flag_choose_item = false;
function choose(){
    console.log("choose")
    try{
        listLen = getListCount();

        for(var i = 0; i < listLen; i++){
            var chooseNum;
            if((chooseNum = document.getElementsByClassName('mb18 mt18 pr video')[document.getElementsByClassName('mb18 mt18 pr video').length - 1].childNodes[1].firstChild.children[0].children[i].firstChild)){
                let videoStatus = chooseNum.children[2].className;
                if(videoStatus != 'video-status success'){
                    if(chooseNum.children[1].className != 'el-icon-video-play el-icon el-icon-video-pause'){
                        if(!flag_choose_item){
                            chooseNum.children[1].click();
                            //click_item();
                            flag_choose_item = true;
                        }
                    }else{
                        flag_choose_item = false;
                    }
                    break;
                }
            }
        }
    }catch (error) {
        setTimeout(choose, 1000);
    }

}

var project_flag = false;
function clickProject(){
    let hre = location.href;
    try{
        if(hre.includes("https://v3.lt-edu.net/student.html#/index/home")){
            if(document.getElementsByClassName('training-projectsButton')[0]){
                project_flag = true;
                document.getElementsByClassName('training-projectsButton')[0].click();

            }
            else{
                setTimeout(clickProject, 1000);
            }
        }
    }catch(error){
        setTimeout(clickProject, 1000);
    }
}

var len;
function getLenCount(){
    let t = 0;
    try{
        t = document.getElementsByClassName('el-tree menuList_warp')[0].childElementCount - 1;
    }catch(error){setTimeout(listLen = getLenCount(), 3000);}
    return t;
}

function close_project(){
    let hre = location.href;
    if (hre.includes("https://v3.lt-edu.net/student.html#/project/index")){
         window.open("about:blank","_self").close()
    }else{
        setTimeout(close_project, 300);
    }
}

function click_study(i){
    if(document.getElementsByClassName('project-courseButton')[i]){
        document.getElementsByClassName('project-courseButton')[i].click();
    }
}

var flag_choose = false;
function choose_study(){
    console.log("choose_study")
    let hre = location.href;

    if (hre.includes("https://v3.lt-edu.net/student.html#/project/index")) {

        try{
            var project_main = document.getElementsByClassName('project-course');
            var project_main_len = project_main.length

            if(project_main.length == 0){
                setTimeout(choose_study, 1000);
                return
            }
            sleep(1)
            let cnt = 0;
            for(var i = 0; i < project_main_len; i++){
                let project = project_main[i]
                let studyLen = project.childElementCount

                for(var j = 0;j < studyLen; j++){
                    let studyProject = project.children[j].children[1].firstChild.children[1]
                    let studyStatus = studyProject.textContent
                    if(studyStatus != '已学习'){
                        if(!flag_choose){
                            click_study(cnt);
                            close_project();
                            flag_choose = true;
                        }
                        break;
                    }
                    cnt++;
                }
                if(flag_choose){
                    break;
                }
            }
        }catch(error){}
    }
}


function readPaper(){
    let hre = location.href;
    if(document.getElementsByClassName('file-box-content')){
        let bookLen = document.getElementsByClassName('file-box-content').length;
        for(var i = 0; i < bookLen; i++){
            let bookNode = document.getElementsByClassName('file-box-content')[i];
            if(bookNode.children[1].textContent != '( 已完成 )'){
                bookNode.lastChild.click();
            }
        }
    }
}

function lop(){
    console.log("lop")
    let hre = location.href;
    if (hre.includes("https://v3.lt-edu.net/student.html#/index/classStudy")) {
        try{
            len = getLenCount();

            for (let i = 0; i < len; i++){
                var treeProject = document.getElementsByClassName('nav_menu')[i];
                let isStudy = treeProject.firstChild.title
                if(isStudy == '已学习' && i == len - 1){
                    flag_choose = false;
                    window.open('https://v3.lt-edu.net/student.html#/project/index', '_self');
                    do_see()
                }
                if(isStudy == '已学习'){
                    continue;
                }
                let nowStudy = treeProject.children[1].className
                if(nowStudy == 'beyondConcealment ellipsis active'){
                    readPaper();
                    break;
                }else{
                    treeProject.click();

                    break;
                }
            }
            choose();
        }catch(error){
            setTimeout(lop, 1000);
        }
    }
}

function do_see() {
    console.log("do_see")
    //视频播放页
    let hre = location.href;
    if(hre.includes("https://v3.lt-edu.net/student.html#/index/home")){
        if(!project_flag){
            clickProject()
        }

    }else if (hre.includes("https://v3.lt-edu.net/student.html#/index/classStudy")) {
        setTimeout(click_item,1500); //300 毫秒
        setTimeout(lop, 3000);
        setTimeout(watch,1000)
    }else if (hre.includes("https://v3.lt-edu.net/student.html#/project/index")) {
        if(!flag_choose){
            choose_study()
        }else{
            return
        }
    }
    setTimeout(do_see, 1000)

}
