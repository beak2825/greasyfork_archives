// ==UserScript==
// @name         白鸽网院
// @namespace    https://www.baidu.com/
// @version      1.2.6
// @description  学到老，活到老
// @author       莫语
// @match        https://gzwy.gov.cn/*
// @icon         https://gzwy.gov.cn/dsfa/gzgb.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481169/%E7%99%BD%E9%B8%BD%E7%BD%91%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/481169/%E7%99%BD%E9%B8%BD%E7%BD%91%E9%99%A2.meta.js
// ==/UserScript==

let list=null
let timess  = 0
let t2=0

function Study(){
    ////打开控制条
    setTimeout(()=>{
        setInterval(()=>{
            let video = document.querySelector('video');
            if(video !=undefined){
                video.muted = true;
                video.loop = true;
                if(video.paused){
                    video.play();
                    let oldadd = EventTarget.prototype.addEventListener
                    EventTarget.prototype.addEventListener = function (...args) {
                        if (window.onblur !== null) {
                            window.onblur = null;
                        }
                        oldadd.call(this, ...args)
                    }
                }}

            video = document.querySelector('video');
            let curclass=""
            if(video !=undefined){
                t2=0
                let chapterWarp = document.getElementsByClassName('chapter-content');
                let progressList= chapterWarp[0].getElementsByClassName('tab-content-desc')
                for(var j=0 ;j<progressList.length;j++){

                    let progress= progressList[j].getElementsByClassName('el-progress progress-circle el-progress--circle')
                    let name= progressList[j].getElementsByClassName('con-title ellipsis')
                    if(progress[0].attributes.getNamedItem('aria-valuenow').value!="100"){
                        if(localStorage.getItem("it")!=name[0].innerHTML){
                            progressList[j].click()
                            localStorage.setItem("it",name[0].innerHTML)
                        }
                        console.log("进度"+progress[0].attributes.getNamedItem('aria-valuenow').value)
                        return
                    }else{
                        t2++
                        if(t2>=progressList.length){
                            location.href="https://gzwy.gov.cn/ncIndex.html#/pc/nc/pagecourse/courseList"
                        }
                    }
                }
            }},1000)

    },1500)
}

function getpage(){

    timess= GM_getValue("timess", 0)
    var thimes2=timess/list.length
    var thimes3=timess%list.length
    for(var j=0 ;j<thimes2;j++){
        let btn = document.getElementsByClassName('btn-next')
        btn[0].click()
    }
  setTimeout(()=>{
    if(thimes3< list.length){
        const t = list[thimes3].getElementsByClassName('ds-nc-card-course')
        t[0].click()
        timess++
        GM_setValue("timess",timess)
        window.close()
    }
       },1500)

}


(function() {


    setTimeout(()=>{
        //
        list  = document.getElementsByClassName('ds-platform-card-item')

        let curUrl = document.URL;
        if(curUrl.indexOf("courseList")!=-1){
            getpage()
        }

        //课程播放页面
        if(curUrl.indexOf("coursePlayer")!=-1){
            localStorage.setItem('it',"");
            Study();
        }
    },1500);

})();