// ==UserScript==
// @name         天职大校园网自动登陆工具
// @version      1.1.0
// @description  在天职大校园范围内实现校园网自动登陆。
// @author       Interpret
// @match        *://172.21.36.1/*
// @grant        none
// @namespace    tjtclogin
// @license      MIT
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @downloadURL https://update.greasyfork.org/scripts/435690/%E5%A4%A9%E8%81%8C%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/435690/%E5%A4%A9%E8%81%8C%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function (){
    'use strict';
    //用户自定义
   var user="这里填写学号"
    var pwd="这里填写密码"
    var yys="1" //1为登录电信互联网，0为登录职大校园网。默认登录电信互联网
    var run="0" //1为启用自动登陆；0为自动填充账号密码，不会自动登录。
    var time="3" //延迟登录秒数，默认延迟三秒后登录


    //代码部分，如不了解请勿随意修改！
    function fristAlert(){
        let timerInterval
        const Toast = Swal.mixin({
            //toast: true,
            position: 'center',
            timer: 5000,
            timerProgressBar: true,
            showCancelButton: true,
            onBeforeOpen: () => {
                //Swal.showLoading()
                timerInterval = setInterval(() => {
                    const content = Swal.getContent()
                    if (content) {
                        const b = content.querySelector('b')
                        if (b) {
                            b.textContent = Swal.getTimerLeft()
                        }
                    }
                }, 100)
            },
            onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            },
            onClose: () => {
                clearInterval(timerInterval)
            }
        })
        Toast.fire({
            icon: 'info',
            title: '欢迎使用本插件',
            html: '<p><font size="3" face="arial" color="#FF7F50">点击确定按钮后跳转到使用手册，或者</br>点击其他位置取消跳转</font></p> ',
            cancelButtonText:"关闭弹窗",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '确定'
            //width: 400,
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer')
                window.open("https://greasyfork.org/zh-CN/scripts/435690-%E5%A4%A9%E8%81%8C%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86%E5%B7%A5%E5%85%B7","_blank");
            }else{
                if (result.value){
                    console.log('确定')
                    window.open("https://greasyfork.org/zh-CN/scripts/435690-%E5%A4%A9%E8%81%8C%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86%E5%B7%A5%E5%85%B7","_blank");
                    window.localStorage.tjtclogin="1"
                }else{
                    Swal.fire({
                        toast: true,
                        icon: 'error',
                        title: '自动跳转失败',
                        text: '用户手动取消',
                        showConfirmButton: false,
                        background: '#FFE4E1',
                        timer:3000,
                        timerProgressBar: true,
                        onOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        },
                        //footer: '<a href>Why do I have this issue?</a>'
                    })
                }
            }
        })
    }
    window.onload = function() {
        if(!window.localStorage.getItem("tjtclogin")){
            fristAlert()
        }
        if(document.getElementsByClassName('edit_lobo_cell')[0].value=="登录") {
            document.getElementsByClassName("edit_lobo_cell")[1].value=user
            document.getElementsByClassName("edit_lobo_cell")[2].value=pwd
            if (yys==1) {
                document.getElementsByClassName("edit_lobo_cell")[5].value="@tjtc"
            } else {
                document.getElementsByClassName("edit_lobo_cell")[5].value=""
            }
            if (run==1) {
                setTimeout("document.getElementsByClassName('edit_lobo_cell')[0].click()", time*1000)
            }
        }
    }
})();