// ==UserScript==
// @name         国开学习网教师登陆天数辅助
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202406132354
// @description  国家开放大学,国开学习网教师登陆天数和进入课程辅助工具,请设置浏览器允许弹窗网站(menhu.pt.ouchn.cn)
// @author       流浪的蛊惑
// @match        *://*.ouchn.cn/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/427414/%E5%9B%BD%E5%BC%80%E5%AD%A6%E4%B9%A0%E7%BD%91%E6%95%99%E5%B8%88%E7%99%BB%E9%99%86%E5%A4%A9%E6%95%B0%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/427414/%E5%9B%BD%E5%BC%80%E5%AD%A6%E4%B9%A0%E7%BD%91%E6%95%99%E5%B8%88%E7%99%BB%E9%99%86%E5%A4%A9%E6%95%B0%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
var href = location.href;
function addXMLRequestCallback(callback){//监听请求
    var oldSend, i;
    if(XMLHttpRequest.callbacks) {
        XMLHttpRequest.callbacks.push(callback);
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(){//监听发送
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i](this);
            }
            oldSend.apply(this, arguments);
        }
        XMLHttpRequest.prototype.wrappedSetRequestHeader=XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {//监听自定义主机头
            this.wrappedSetRequestHeader(header, value);
            if(!this.headers) {
                this.headers = {};
            }
            if(!this.headers[header]) {
                this.headers[header] = [];
            }
            this.headers[header].push(value);
        }
    }
}
var listkc=null
function getkclb(){//获取当前课程列表
    GM_xmlhttpRequest({
        method: "post",
        url: "/ouchnapp/wap/course/jskc-pc",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: "tab=&page=1&page_size=200",
        onload: function(res){
            let rec=JSON.parse(res.responseText);
            listkc=rec.d.list;
        }
    });
}
(function() {
    'use strict';
    addXMLRequestCallback( function( xhr ) {
        xhr.addEventListener("load", function(){
            if (xhr.readyState==4 && xhr.status==200) {
                if (xhr.responseURL.includes("/ouchnapp/wap/course/jskc-pc")){//科目获取
                    getkclb();
                }
                if (xhr.responseURL.includes("/modules")){//科目模块
                    let dat=JSON.parse(xhr.responseText);
                    console.log("科目模块获取成功");
                    let fxsy=localStorage.getItem("分析学习首页");
                    if(fxsy!=null){
                        for(let i=0;i<dat.modules.length;i++){
                            setTimeout(()=>{
                                console.log(dat.modules[i].name+"成功");
                                document.getElementById("module-"+dat.modules[i].id).getElementsByTagName("div")[0].click();
                            },5000*(i+1));
                        }
                    }
                }
                if (xhr.responseURL.includes("/all-activities?module_ids")){//模块资源
                    let dat=JSON.parse(xhr.responseText);
                    if(dat.learning_activities.length>0){
                        setTimeout(()=>{
                            let gx=document.getElementsByClassName("clickable-area");
                            if(gx.length>0){
                                console.log("模块资源获取成功");
                                localStorage.removeItem("分析学习首页");
                                gx[0].click();
                            }
                        },3000);
                    }else{
                        console.log("当前模块无资源");
                    }
                }
            }
        });
    });
    let delay=-1,nextjs=-1,dlxs=true,gnb=-1;
    setInterval(function(){
        let dlxx=localStorage.getItem("登陆帐号");
        if(dlxx!=null){
            if(href.includes("/am/UI/Login")){
                if(delay==1){//延时获取验证码
                    let zhjd=parseInt(localStorage.getItem("帐号进度"));
                    let zhs=dlxx.split("\n");
                    if(zhjd<zhs.length){
                        localStorage.setItem("帐号进度",zhjd+1);
                        document.getElementById("loginName").value=zhs[zhjd].split(",")[0];//用户
                        document.getElementById("password").value=zhs[zhjd].split(",")[1];//密码
                        document.getElementById("form_button").click();//登陆
                    }else{
                        dlxs=true;
                        localStorage.clear();
                    }
                }
                delay++;
            }
        }else if(dlxs){
            dlxs=false;
            let dlk=document.getElementById("con");
            if(dlk!=undefined){
                let dlstr="<center><span style=\"color:blue;background-color:#fff;font-size:20pt;\">教师账号{用户名,密码}一行一个</span><br />";
                dlstr+="<textarea id=\"dlxx\" cols=\"100\" rows=\"10\"></textarea><p><input type=\"button\" value=\"开始执行\" ";
                dlstr+="onclick=\"var dlxx=document.getElementById('dlxx').value;localStorage.setItem('登陆帐号',dlxx);localStorage.setItem('帐号进度','0');location.reload();";
                dlstr+="\"></p></center>";
                dlk.innerHTML=dlstr;
            }
        }
        if(href.includes("/site/ouchnPc/index")){
            let kcjd=localStorage.getItem("课程进度");
            if(nextjs==-1){
                localStorage.setItem("是否计时","是");
            }
            let sfjs=localStorage.getItem("是否计时");
            if(kcjd!=null){
                if(sfjs!=null){
                    nextjs++;
                }
                if(nextjs>15){
                    nextjs=0;
                    localStorage.removeItem("是否计时");
                    document.getElementsByClassName("ouchnPc_index_title")[0].getElementsByTagName("a")[0].click();
                    localStorage.setItem("课程进度",parseInt(kcjd)+1);
                }
                if(nextjs==1){
                    if(kcjd<listkc.length){
                        document.getElementsByClassName("ouchnPc_index_title")[0].innerHTML="<a href=\""+listkc[kcjd].url+"\" target=\"_blank\">"+listkc[kcjd].title+"</a>";
                    }else{
                        localStorage.clear();
                        setTimeout(()=>{window.open("https://lms.ouchn.cn/logout");},8000);
                        setTimeout(()=>{document.getElementsByClassName("left_logout")[0].click();},10000);
                    }
                }
            }else{
                localStorage.setItem("课程进度","0");
            }
        }
        if(href.includes("ng?user_no=")){
            let gm=document.getElementsByClassName("blank-message");
            if(gm.length>0){
                if(gm[0].innerText=="该课程还在建设中，请稍候"){
                    setTimeout(()=>{location.href="https://menhu.pt.ouchn.cn/genexy";},3000);
                }
            }
            localStorage.setItem("分析学习首页","是");
        }
        if(href.includes("/learning-activity/full-screen")){
            let gn=document.getElementsByClassName("next-btn ivu-btn ivu-btn-default");
            if(gn.length>0){
                gnb++;
                if(gnb>5){
                    gnb=0;
                    gn[0].click();
                }
            }else{
                if(gnb>-1){
                    setTimeout(()=>{location.href="https://menhu.pt.ouchn.cn/genexy";},8000);
                }
            }
        }
        if(href.includes("/auth/realms/guokai/protocol/cas/login")){
            if((nextjs++)>3){
                window.close();
            }
        }
        if(href.includes("menhu.pt.ouchn.cn/genexy")){
            localStorage.setItem("是否计时","是");
            setTimeout(()=>{window.close()},3000);
        }
    },1000);
})();