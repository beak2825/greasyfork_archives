// ==UserScript==
// @name         mymooc
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://www.icourse163.org/course/*
// @match        *://www.icourse163.org/learn/*
// @match        *://www.icourse163.org/spoc/course/*
// @match        *://www.icourse163.org/spoc/learn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398735/mymooc.user.js
// @updateURL https://update.greasyfork.org/scripts/398735/mymooc.meta.js
// ==/UserScript==
///////////////////////////////////////////登陆部分没做完，需要先登陆///////////////////////////////////////////


function first_page(){  //https://www.icourse163.org/course/SWJTU-1002894001
    let keci = document.querySelector("#course-enroll-info > div > div.course-enroll-info_course-info > div.course-enroll-info_course-info_term-select > div > div.ux-dropdown_bd > ul")
    if(keci){
        keci = keci.children.length
    }
    else{
        keci = 0
    }
    if(keci>1){//有过往课程
        //报名上次课
        //展开
        document.querySelector("#course-enroll-info > div > div.course-enroll-info_course-info > div.course-enroll-info_course-info_term-select > div > div.ux-dropdown_bd").style = ''
        document.querySelector("#course-enroll-info > div > div.course-enroll-info_course-info > div.course-enroll-info_course-info_term-select > div > div.ux-dropdown_bd > ul > li:nth-child("+String(keci-1)+")").click()
    }else{
        alert('无过往课程')
    }
}
function login(){
    let login_ = setTimeout(function(){
        //爱课程登陆
        document.querySelector("div.ux-urs-login-urs-tabs > div.ux-tabs-underline > ul > li:nth-child(3)").click()
        //账号密码
        let user= 's_sharing@126.com'
        let passwd = '123456'
        document.querySelector("div.login-set-panel-login > div > div.ux-urs-login-urs-tabs > div.ux-urs-login-urs-tabs_ui-box > div.icourse-login-form > div.account-field > label > input").value = user
        document.querySelector("div.login-set-panel-login > div > div.ux-urs-login-urs-tabs > div.ux-urs-login-urs-tabs_ui-box > div.icourse-login-form > div.password-field > label > input").value = passwd
        //登陆

    },1000)
    setTimeout(function(){
        document.querySelector("div.login-set-panel-login > div > div.ux-urs-login-urs-tabs > div.ux-urs-login-urs-tabs_ui-box > div.icourse-login-form > div.button-field > span").click()
    },2000)
}





(function() {
    'use strict';
    //获取开课次数
    let clicked = 0
    let first = setTimeout(first_page,2000)
    if(window.location.href.split('?')[1].slice(0,3) == 'tid'){//成功切换页面到tid
        clearTimeout(first)
        let time_ = setTimeout(function(){
            document.querySelector("#course-enroll-info > div > div.course-enroll-info_course-enroll > div.course-enroll-info_course-enroll_buttons > div.course-enroll-info_course-enroll_buttons_enroll-btn > span").click()
            clicked = true
        },2000)
        time_ = setInterval(function(){
            try{
                if(clicked){
                    login()
                    clearInterval(time_)
                }}
            catch(err){}
        },2000)


    }
    if(window.location.href.split('#')[1]){//成功进入学习页
        let time_ = setTimeout(function(){
            document.getElementsByClassName('f-thide f-fc3')[3].click()
        },2000)
        }
})();