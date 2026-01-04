// ==UserScript==
// @name         学习公社刷课专用
// @version      0.2
// @description  刷课专用
// @author       chengfx
// @match        https://www.ttcdw.cn/p/course/v/v_*?itemId=*&segId=*&projectId=*&orgId=*&type=*
// @match        https://www.ttcdw.cn/p/uc/projectCenter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ttcdw.cn
// @grant        none
// @license      MIT
// @namespace chengfx
// @downloadURL https://update.greasyfork.org/scripts/487783/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E5%88%B7%E8%AF%BE%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/487783/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E5%88%B7%E8%AF%BE%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

let run_state = true;
const refresh_page_time = 1000 * 60 * 30;
const createBroadcastChannel=(cb)=> {
    const broadcastChannel = new BroadcastChannel('chengfx');
    broadcastChannel.onmessage = cb;
    return broadcastChannel;
}

const autoContinue = ()=>{
    const modal = document.querySelector("#layui-layer1") || document.querySelector("#layui-layer3");
    if(!modal || modal.style.display === 'none'){
        return;
    }
    const btn = document.querySelector("#comfirmClock");
    btn.click();
}



const autoPlayCourse = ()=>{
    const videos = document.querySelectorAll('video');
    videos.forEach(v=>{
        v.muted=true;
        v.play()
    })
}

const findUnfinishCourseItem = ()=>{
    const allCourseItems = [...document.querySelectorAll(".course-info")];
    const unfinishCourseItem = allCourseItems.find(course=>course.querySelector('.four').innerText !== '100%');
    return unfinishCourseItem;
}

const autoJumpCourse = (unfinishCourseItem)=>{
    if(!unfinishCourseItem){
        console.info("allFinish")
        return false;
    }else{
        unfinishCourseItem.children[0]?.click();
        setTimeout(autoPlayCourse,1000)
        return true;
    }
}

const nextCourse = ()=>{
    const allCourses = [...document.querySelectorAll(".li-item")];
    const activeIndex = allCourses.findIndex(c=>c.style['background-image'].includes('current_seg'));
    if(activeIndex === allCourses.length -1 || activeIndex === -1){
        run_state = false;
        return;
    }
    console.log(activeIndex,allCourses[activeIndex+1])
    allCourses[activeIndex+1]?.click();
}

const nextModule = ()=>{
    const allModules = [...document.querySelectorAll(".item-col")];
    const activeIndex = allModules.findIndex(m=>!!m.querySelector('.is-active'));
    if(activeIndex === allModules.length - 1){
        nextCourse()
    }else{
        allModules[activeIndex+1]?.querySelector('.el-collapse-item__header')?.click();
    }
}

const openUnfinishCourse = ()=>{
    const unfinishCourse = [...document.querySelectorAll(".el-table__row")].find((e)=>e.querySelector(".course_num").innerText !== "课程：100%");
    if(!unfinishCourse){
        return false;
    }
    const learnBtn = unfinishCourse.querySelector(".to-study");
    learnBtn.click();
    return true;
}

const webWorkerScript = new Blob([`
  setInterval(()=>{
    self.postMessage('autoContinue');
    self.postMessage('autoNext');
    self.postMessage('heartBeat');
  },1000);
`], { type: 'application/javascript' });

(function() {
    'use strict';
    const init = async ()=>{
        console.info("success")
        const isPlayPage = location.href.startsWith("https://www.ttcdw.cn/p/course");
        if(isPlayPage){
            console.log("im play page");
            setTimeout(location.reload,refresh_page_time);
            const bc = createBroadcastChannel((msg)=>{
                console.log(msg);
            });
            const workerUrl = URL.createObjectURL(webWorkerScript);
            const worker = new Worker(workerUrl);
            worker.onmessage = (e)=>{
                switch(e.data){
                    case 'autoContinue':{
                        autoContinue();
                        break;
                    }
                    case 'autoNext':{
                        const course = findUnfinishCourseItem();
                        if(!course){
                            bc.postMessage({cmd:"next"});
                            window.close();
                            return;
                        }
                        if(lastCourse === course){
                            return;
                        }
                        autoJumpCourse(course);
                        lastCourse = course;
                        break;
                    }
                    case 'heartBeat':{
                        console.log('heartBeat');
                        break;
                    }
                }
            }
            let lastCourse = null;

        }else{
            console.log("im not play page");
            while(!openUnfinishCourse()){
                if(!run_state){
                    break;
                }
                nextModule()
                await new Promise((res,rej)=>{setTimeout(res,1000)});
            }
            const bc = createBroadcastChannel((msg)=>{
                switch(msg.data.cmd){
                    case 'next':{
                        console.log("next");
                        location.reload();
                        break;
                    }
                }
            });
            bc.postMessage({a:1})
        }

    }
    setTimeout(init,2000)
})();