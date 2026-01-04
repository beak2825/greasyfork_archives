// ==UserScript==
// @name         新版云学堂自动刷视频
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  新版云学堂自动刷视频。进入视频列表页点开始学习，一直刷。
// @author       piaopiao
// @match        https://*.yunxuetang.cn/kng/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477658/%E6%96%B0%E7%89%88%E4%BA%91%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/477658/%E6%96%B0%E7%89%88%E4%BA%91%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==



var url = window.location.href //网页url
var host = window.location.origin //域名www.xxx.com
var videoList //视频列表
var hangUptimer //接收检查挂机计时器
var originCall //存放原始call
var layOut //检查页面布局，0为左右结构，1为上下结构
var i = 999; //定义i作为第几个视频计数，初始赋值999，防止其他操作导致url变化,导致脚本开始

(function() {
    'use strict';
//添加按钮两个按钮
let startButton = document.createElement("button")
startButton.setAttribute("id", "startButton")
startButton.className = "startbutton"
startButton.style.cssText = "cursor:pointer;border-radius:8px;background-color:#F5F5F5;border-style:none;width:90px;height:45px;position:fixed;font-Size:20px;color:red;left:90px;top:100px;z-index:9999"
startButton.innerText = "开始学习"

let pageChangeButton = document.createElement("button")
pageChangeButton.setAttribute("id", "pageChangeButton")
pageChangeButton.className = "pageChangeButton"
pageChangeButton.style.cssText = "cursor:pointer;border-radius:8px;background-color:#F5F5F5;border-style:none;width:110px;height:45px;position:fixed;font-Size:20px;color:red;left:190px;top:100px;z-index:9999"
pageChangeButton.innerText = "翻至指定页"

document.body.append(startButton)
document.body.append(pageChangeButton)
//开始学习点击事件
startButton.addEventListener("click", function(){
    if(startButton.innerText == "开始学习"){
        alert("开始从当前页开始，一直学习，点击停止按钮可结束学习。\n自动设置2倍速，\n自动点击挂机窗口，\n自动跳过积分兑换视频,\nhook删除后台暂停函数，后台不暂停。\n2秒后将开始学习，期间不要刷新网页。")
        i = 0
        originCall = Function.prototype.call //保存hook前原始call函数
        if(document.querySelector(".drop-menu.yxtf-dropdown").id){
            layOut = 1
        }else{
            layOut = 0
        }
        getVideoid()
    }else{
        i=999
        window.open(host+"/main/#/index","_self")
    }
})
startButton.addEventListener("mouseover", function(event){
   startButton.style.backgroundColor="#436BFF"
})
startButton.addEventListener("mouseout", function(event){
   startButton.style.backgroundColor="#F5F5F5"
})
//翻页点击事件
pageChangeButton.addEventListener("click", function() {
    var page = prompt("请输入页数：", "1") //弹出输入框
	if (page != null && page != "") {
		page = parseInt(page)
		if (page > 0) {
			page = page
		} else {
			page = 1
		}
	} else {
		page = 1
	}
    document.querySelector(".yxtf-pager").__vue__.$emit("change", page) //翻页

})
pageChangeButton.addEventListener("mouseover", function(event){
   pageChangeButton.style.backgroundColor="#436BFF"
})
pageChangeButton.addEventListener("mouseout", function(event){
   pageChangeButton.style.backgroundColor="#F5F5F5"
})

//获取视频id
function getVideoid(){
    if(url.match("&type=2")){
        if(layOut){
            if(document.getElementsByClassName("kng-list").length != 0){
                videoList = document.querySelector(".kng-list").__vue__.kngListData
            }
            }else{
                if(document.getElementsByClassName("kng-list-new").length != 0){
                    videoList = document.querySelector(".kng-list-new").__vue__.kngListData
                }
            }
        //第一次按钮点击开始或者翻页后，在视频列表页检查完成情况，从未完成、不需要积分兑换的开始
        for(;i < 16;i++)
        {
            if(videoList[i].status != 2 && videoList[i].price == 0){
                break
            }
        }
        if(i < 16){
            openVideo() //打开视频播放页
        }else if(i == 999){
            console.log("其他操作导致url变化，无操作") //未点击开始按钮，url变化不开始
        }else{
            //下一页
            console.log("下一页")
            i = 0
            if(layOut){
                setTimeout(function(){document.querySelector(".mt16.pull-right.knglist.yxtf-pagination.yxtf-pagination--normal").__vue__.next()}, 500)
            }else{
                setTimeout(function(){document.querySelector(".pull-right.yxtf-pagination.yxtf-pagination--normal").__vue__.next()}, 500)
            }
            setTimeout(function(){getVideoid()}, 1500) //页数变化后重新获取视频id
        }
    }
}


//监测网页url变化循环播放
window.addEventListener("hashchange", function(){
    url = window.location.href //取当前网页地址
    if(url.match("/video/play")){
        //判断进入视频播放页
        startButton.innerText = "结束学习" //视频播放页按钮名称结束学习
                   playVideo()
                   //设置定时器检查进度和挂机窗口，进入视频列表页后删除定时器
                    hangUptimer = window.setInterval(function() {
            		    checkSchedule() //检查进度
            		    checkHangup() //检查挂机窗口
            	   }, 10000)
    }
    if(url.match("&type=2")){
        //判断进入视频列表页
        startButton.innerText = "开始学习"
        clearInterval(hangUptimer) //到列表页清除进度和挂机窗口检查定时器
        //每个视频播放完后，在视频列表页检查完成情况，不进入视频播放页，跳过已完成、积分兑换视频
        for(;i < 16;i++)
        {
            if(videoList[i].status != 2 && videoList[i].price == 0){
                break
            }
        }
        if(i < 16){
            Function.prototype.call = originCall //恢复原始call，防止手动后退过快出错
            openVideo() //打开视频播放页
        }else if(i == 999){
            console.log("其他操作导致url变化，无操作") //未点击开始按钮，url变化不开始
        }else{
            Function.prototype.call = originCall //恢复原始call，防止手动后退过快出错
            //下一页
            console.log("下一页")
            i = 0
            if(layOut){
                setTimeout(function(){document.querySelector(".mt16.pull-right.knglist.yxtf-pagination.yxtf-pagination--normal").__vue__.next()}, 500)
            }else{
                setTimeout(function(){document.querySelector(".pull-right.yxtf-pagination.yxtf-pagination--normal").__vue__.next()}, 500)
            }
            setTimeout(function(){getVideoid()}, 1500) //页数变化后重新获取视频id
        }
    }
})

//打开视频播放页
function openVideo(){
    var j = i
    i++
    setTimeout(function(){
        var Kngid_url=host + "/kng/#/video/play?kngId="+videoList[j].id+"&projectId=&btid=&gwnlUrl=&rate=2"
        window.open(Kngid_url, "_self")
    }, 1500)


}
//检查课程完成度
function checkSchedule(){
    if(document.getElementsByClassName("yxtulcdsdk-fullsize").length != 0){
        if(document.querySelector(".yxtulcdsdk-fullsize").__vue__.kngDetail.schedule == 100){
            window.history.go(-1)
        }
    }
}


//播放视频
function playVideo(){
        var playTimer=window.setInterval(function () {
            //设置定时器检查VUE是否加载
            if(document.getElementsByClassName("yxtulcdsdk-flex-center yxtulcdsdk-flex-vertical max-w-560 ulcdsdk-break-word").length != 0){
                //播放视频并清除定时器
                clearInterval(playTimer)
                enableWebpackHook()
                document.querySelector(".yxtulcdsdk-flex-center.yxtulcdsdk-flex-vertical.max-w-560.ulcdsdk-break-word").__vue__.play()
            }
        },1000)
}
//设置2倍速（没用到）
function setRate(){
        var setPlaybackRateTimer=window.setInterval(function () {
        //设置定时器检查VUE是否加载
        if(document.getElementsByClassName("jw-controlbar jw-background-color jw-reset").length != 0){
            //播放视频后设置2倍速
            console.log("播放视频后设置2倍速")
            document.querySelector(".yxtulcdsdk-fullsize").__vue__.$refs.player.getPlayer().setPlaybackRate(2)
            clearInterval(setPlaybackRateTimer)
        }
    },3000)
}

//检查挂机窗口
function checkHangup(){
    if(document.getElementsByClassName("yxtf-button--large").length != 0)
    {
        console.log("点击一次挂机提示窗口")
        document.getElementsByClassName("yxtf-button--large")[0].click()
    }
}
//hook webpack删除后台暂停函数
function enableWebpackHook() {
    //let originCall = Function.prototype.call
    Function.prototype.call = function (...args) {
        const result = originCall.apply(this, args)
        //console.log(args[0])
        if(args[1]?.id==39 ){
            //console.log(args[1]?.id)
            let fucText = args[3].m[126].toString()
            //console.log(fucText)
            //replace去头+slice去尾
            fucText = fucText.replace("function(a,b,c){", "").slice(0, -1)
            //删除暂停函数
            fucText = fucText.replace("&&oa.setState(f.PAUSED)", "")
            args[3].m[126] = new Function("a, b, c", fucText)
            //console.log(args[3].m[126])
            Function.prototype.call = originCall
            console.log("已hook，后台不暂停")
        }
        return result
    }
}

//获取cookies
function getCookie(cname)
{
  var name = cname + "="
  var ca = document.cookie.split(";")
  for(var i=0; i<ca.length; i++)
  {
    var c = ca[i].trim()
    if (c.indexOf(name)==0) return c.substring(name.length,c.length)
  }
  return ""
}

 //设置cookies
function setCookie(cname,cvalue)
{
	document.cookie = cname+"="+cvalue+";path=/;"
}


    // Your code here...


})();