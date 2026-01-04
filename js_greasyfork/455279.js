// ==UserScript==
// @name         JDbScript
// @namespace    http://598570789@qq.com/
// @version      0.5
// @description  提效gogogo!
// @author       JDb
// @compatible   chrome
// @compatible   firefox
// @match        *://*.shizhuang-inc.com/*
// @match        *://*.shizhuang-inc.net/*
// @match        *://open.feishu.cn/*
// @match        *://home.console.aliyun.com/*
// @match        *://ide2-cn-hangzhou.data.aliyun.com/*
// @include      *://signin.aliyun.com/poizon.onaliyun.com/*
// @license MIT
// @run-at       document-start
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/455279/JDbScript.user.js
// @updateURL https://update.greasyfork.org/scripts/455279/JDbScript.meta.js
// ==/UserScript==
var 测试 = 80;//P
var 评测默认没问题 = 79;//O
// 键盘编码表  https://jingyan.baidu.com/article/fedf073780e16335ac8977a4.html
// console    document.querySelector("video").playbackRate=

//获取所有 class 同时包括 'red' 和 'test' 的元素.
//document.getElementsByClassName('red test');

//在id 为'main'的元素的子节点中，获取所有class为'test'的元素
//document.getElementById('main').getElementsByClassName('test');




//统一登录平台
var poizonLoginAliyunUrl="https://prism.shizhuang-inc.com/account/cloudy/account/my";
//阿里云控制台
var ailiyunConsoleUrl="https://home.console.aliyun.com/home/dashboard/ProductAndService";
//poizon登录 飞书扫码
var poizonLoginUrl="https://sso.shizhuang-inc.com/";
//poizon登录 飞书授权
var poizonLoginUrl2="https://open.feishu.cn/open-apis/authen/v1/user_auth_page_beta";
// dataworks审批
var dataworksReviewUrl="https://ide2-cn-hangzhou.data.aliyun.com/page/review";
var dataworksReviewDetailUrl="https://ide2-cn-hangzhou.data.aliyun.com/page/review/detail";

//资源加载完成事件
(function() {
    'use strict';
    window.onload = ()=>{
        doTask();
    }
})();

//dom加载完成事件
document.addEventListener("DOMContentLoaded", onDomReady);
function onDomReady() {
    closeAliyun();
}

//标签切换事件
document.addEventListener('visibilitychange', () => {
    if(document.visibilityState === 'hidden') {
        // 离开当前tab标签
    }else {
        log("回到当前tab标签")
        //回到sso登录页，关闭
        if("prism.shizhuang-inc.com"===document.domain){
            window.close()
            history.back(1)
            return
        }
        //回到阿里云ram用户登录页，刷新
        if("signin.aliyun.com"===document.domain){
            location.reload()
            return
        }
        //回到datawork审批，刷新
        if(isUrlOrDomainMatch(dataworksReviewUrl)){
            // location.reload()
            // autoReview()
            return
        }
    }
}
                         )
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

//页面加载后执行
async function doTask(){
    // log("domain："+document.domain)
    // log("url："+decodeURIComponent(location.href.split('#')[0]))
    log(window.location.protocol+"//"+window.location.host+""+window.location.pathname)

    await sleep(300);

    //自动登录 阿里云
    autoLoginAliyun()
    //自动登录 poizon
    autoLoginPoizon()
    //自动审批 dataworks任务
    autoReview()

}

async function autoLoginAliyun(){
    if(!isUrlOrDomainMatch("signin.aliyun.com")&&!isUrlMatch(poizonLoginAliyunUrl)&&!isUrlMatch(ailiyunConsoleUrl)){
        return;
    }
    log("是阿里云登录页面")

    //1.打开公司登录页面
    if(hasTag('button','使用企业账号登录') && "signin.aliyun.com"===document.domain ){
        log("autoLoginAliyun.1.打开公司登录页面")
        window.open("https://prism.shizhuang-inc.com/cloud/cloudy",'_blank');
        return
    }
    //2.点开控制台登录
    if("prism.shizhuang-inc.com"===document.domain){
        log("autoLoginAliyun.2.点开控制台登录")
        if(await clickTagPlus('button','控制台登陆',true)){
            sleep(500)
            log("点击控制台登陆成功")
            // window.close()
        }else{
            error("点击控制台登陆失败")
        }
        return
    }
}
function closeAliyun(){
    //1.关闭阿里云控制台
    if("home.console.aliyun.com"===document.domain){
        log("autoLoginAliyun.3.关闭阿里云控制台")
        window.close()
        return
    }
}

function autoLoginPoizon(){
    if(!isUrlOrDomainMatch(poizonLoginUrl)&&!isUrlOrDomainMatch(poizonLoginUrl2)){
        return
    }
    log("是poizon登录页面")

    //1.飞书扫码登录
    if(isUrlOrDomainMatch(poizonLoginUrl)){
        log("autoLoginPoizon.1")
        clickTag('button','飞书扫码登录')
        return
    }
    //2.授权
    if(isUrlOrDomainMatch(poizonLoginUrl2)){
        log("autoLoginPoizon.1")
        clickTag('div','授权',false)
        return
    }
}
async function autoReview(){
    if(!isUrlOrDomainMatch(dataworksReviewUrl)&&!isUrlOrDomainMatch(dataworksReviewDetailUrl)){
        return
    }

    //审批列表
    if(isUrlOrDomainMatch(dataworksReviewUrl)){
        if(await clickTagPlus('button','查看',true)){
            return
        }
    }


    //审批详情
    if(isUrlOrDomainMatch(dataworksReviewDetailUrl)){
        if(hasTag(('button','通过'))){
            if(await clickTagPlus('button','通过',true)){
                // window.close()
                return
            }
        }else{
            window.close()
        }
    }

}


function log(str){
    var d=new Date()
    var s=d.getMinutes()+":" + d.getSeconds() + "  "+ str;
    console.log('%c'+s,'color:green;fontpsize:35px;')
}
function error(str){
    var d=new Date()
    var s=d.getMinutes()+":" + d.getSeconds() + "  "+ str;
    console.error('%c'+s,'color:red;fontpsize:35px;')
}




//域名或完整地址匹配
function isUrlOrDomainMatch(urlOrDamin){
    // log("isUrlOrDomainMatch.urlOrDamin:"+isUrlOrDomainMatch.urlOrDamin)
    return isUrlMatch(urlOrDamin)||isDomainMatch(urlOrDamin)
}
//完整地址匹配
function isUrlMatch(url){
    if(window.location.protocol+"//"+window.location.host+""+window.location.pathname===url){
        log("matchUrlSuccess:"+url)
        return true
    }
    error("matchUrlFail:"+url)
    return false
}
//域名匹配
function isDomainMatch(domain){
    if(domain===document.domain){
        log("domainMatchSuccess:"+domain)
        return true
    }
    error("domainMatchFail:"+domain)
    return false
}



//ark自动审批
async function autoCheckArk(){
    log("autoCheckArk()")
    log(window.location.href)

    var eleArr
    var rs
    if(window.location.href.indexOf("ark.shizhuang-inc.com/approveList?")!=-1
       ||
       window.location.href.indexOf("ark.shizhuang-inc.com/ark/approveList?")!=-1
      ){
        log("进入ark list")
        retry(()=>clickTag('a','详情',true))
        await sleep(1000)

        if(await retry(()=>clickTag('button','审批通过',true))){
            retry(()=>clickTag('button','返回',true))
        }
    }
}

//是否有当前指定标签
async function hasTag(tag,val){
    await sleep(500);
    var eleArr = document.getElementsByTagName(tag);
    var rs=false
    for( var i=0; i<eleArr.length; i++ ){
        // log("value="+eleArr[i].value+" innerText="+eleArr[i].innerText)
        if(val===eleArr[i].innerText||val===eleArr[i].value){
            rs= true
        }
    }
    return rs;
}

//带重试的点击行为
async function clickTagPlus(tag,val,onlyFirst){
    for(var i=0;i<30;i++){
        log("第"+(i+1)+"次点击："+val)
        if(await clickTag(tag,val,onlyFirst)){
            return true;
        }
        await sleep(1000);
    }
    return false;
}

//点击行为
async function clickTag(tag,val,onlyFirst){
    await sleep(500);
    // log("clickTag(" + val + ")")
    var eleArr = document.getElementsByTagName(tag);
    var rs=false
    for( var i=0; i<eleArr.length; i++ ){
        // log("value="+eleArr[i].value+" innerText="+eleArr[i].innerText)
        if(tag==='button'||tag==='input'){
            if(val===eleArr[i].innerText.trim()||val===eleArr[i].value.trim()){
                eleArr[i].click()
                // log("点击"+val)
                rs= true
            }
        }else{
            if(val==eleArr[i].innerText){
                eleArr[i].click()
                // log("点击"+val)
                rs= true
            }
        }
        if(onlyFirst && rs){
            return rs;
        }
    }
    return rs;
}

//重试
async function retry(asyncRequest) {
    var times=2
    log("尝试调用"+asyncRequest)
    while(!await asyncRequest()){
        log("等待500ms 再次尝试")
        await sleep(500)
    }
    return true;
}
//满意度评测默认没问题
function autoCheck(){
    var eleArr = document.getElementsByTagName('input');
    var rs=false
    for( var i=0; i<10; i++ ){
        eleArr[i].click()
    }
    clickTag('input','没问题',false)
}


$(document).ready(function() {
    //调用键盘编码，按了键盘回调keydown里的function(event)函数，event就是你按的那个按键的code码

    // var 测试 = 80;//P
    // var 评测默认没问题 = 79;//O
    $(document).keydown(function(event){
        switch(event.keyCode){
            case 测试:
                // autoCheckArk();
                doTask();
                break;
            case 评测默认没问题:
                autoCheck();
        }
    });
});

