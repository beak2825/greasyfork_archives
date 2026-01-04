// ==UserScript==
// @name         学习通自动脚本
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  学习通
// @author       shoko
// @match        *://*.chaoxing.com/*
// @connect      cx.icodef.com
// @connect      s.jiaoyu139.com
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @require      https://lib.baomitu.com/jquery/2.0.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464992/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/464992/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var i=localStorage.getItem('i')||0;
var classes =document.getElementsByClassName('posCatalog_name');
var v,v_done = 0;
var videoNum,timer,frameObj
let lastExecutionTime = 0;
const cooldownPeriod = 3000;
function main() {
    v=undefined
    window.unitCount = $(".ncells h4").index($(".currents")) + 1;
    window.unit = $(".ncells h4").length;

    if (videoNum > 0) {
        var playDoneEvent = new Event("playdone");
        v = frameObj.contents().eq(v_done).find("video#video_html5_api").get(0);
        console.log(v)
        window.a = v;
        v.play();
        v.muted=true;
        v.playbackRate=2
        window.inter = setInterval(() => {
            v = window.a;
            if (v.currentTime >= v.duration) {
                dispatchEvent(playDoneEvent);
                clearInterval(window.inter);
            }
            if (v.paused&&!v.ended) {
                v.play();
                v.playbackRate=2
            }
        }, 1000);
    }
}
function vended(){
    frameObj = $("iframe").eq(0).contents().find("iframe.ans-insertvideo-online");
    videoNum = frameObj.length;
    main()
    timer= setInterval(function (){
        if (v.ended) {
            if(videoNum===1){
                v_done=0
                videoNum=0;
                i=parseInt(i)+1
                console.log(i+'iuiu')
                localStorage.setItem('i',i)
                classes[i].click()
                setTimeout(function (){
                    frameObj = $("iframe").eq(0).contents().find("iframe.ans-insertvideo-online");
                    videoNum = frameObj.length;
                    main()
                    if(!document.getElementById('btn1')){
                        btn()
                    }
                },3000)
            }else if (videoNum>1){
                v_done++
                videoNum--
                main()
            }
        }else if (frameObj.length===0){
           myFunction()
        }
    },500)
}
function myFunction() {
    const now = Date.now();
    if (now - lastExecutionTime > cooldownPeriod) {
        let i = localStorage.getItem('i');
        i = parseInt(i) + 1;
        console.log(i+'iu');
        localStorage.setItem('i', i);
        classes[i].click();
        lastExecutionTime = now;
    }
    setTimeout(() => lastExecutionTime = 0, cooldownPeriod);
}
function btn(){
    var button = document.createElement("button"); //创建一个按钮
    button.id="btn1"
    button.textContent = "点击开始"; //按钮内容
    button.style.width = "90px"; //按钮宽度
    button.style.height = "28px"; //按钮高度
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#e33e33"; //按钮底色
    button.style.border = "1px solid #e33e33"; //边框属性
    button.style.borderRadius = "4px"; //按钮四个角弧度
    button.addEventListener("click", clickBotton) //监听按钮点击事件
    var like_comment = document.getElementsByClassName('prev_title_pos')[0]; //getElementsByClassName 返回的是数组，所以要用[] 下标
    like_comment.appendChild(button);
    function clickBotton(){
        clearInterval(timer)
        vended()
    }
}
function handleClassClick(e){
     for (var k=0;k<classes.length;k++){
            // console.log(e.target.title===classes[k].title,classes[i].children[0].innerHTML===classes[k].children[0].innerHTML,k,e.target.title,)
            if (e.target.title===classes[k].title&&e.target.children[0].innerHTML===classes[k].children[0].innerHTML){
                localStorage.setItem('i',(k).toString())
                i=parseInt(localStorage.getItem('i'))
                console.log(12213)
                console.log(k,e.target.title,classes[k].title,i,e.target.title===classes[k].title,'=+++')
            }
        }
    setTimeout(function (){
        frameObj = $("iframe").eq(0).contents().find("iframe.ans-insertvideo-online");
        videoNum = frameObj.length;
        if (timer)
            clearInterval(timer)
        vended()
        if(!document.getElementById('btn1')){
            btn()
        }
    },2000)
}
(function f(){
        window.addEventListener('click', handleClassClick);
    setTimeout(function (){
        btn()
    },1000)
})()