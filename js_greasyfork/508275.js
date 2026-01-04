// ==UserScript==
// @name         链识界自动刷课1.1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  链世界刷课
// @author       You
// @match        https://lianjia.yunxuetang.cn/o2o/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yunxuetang.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508275/%E9%93%BE%E8%AF%86%E7%95%8C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE11.user.js
// @updateURL https://update.greasyfork.org/scripts/508275/%E9%93%BE%E8%AF%86%E7%95%8C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE11.meta.js
// ==/UserScript==

(function() {
    'use strict';0

    setInterval(panduan,5200)

    function panduan(){
        //判断有没有看完-看剩余时间的元素能找到吗
        if(document.querySelector("#app  div.yxtulcdsdk-course-player__countdown.standard-size-12.yxtulcdsdk-flex-center > div > span")){

            console.log("没看完001")
            console.log("当前进度："+document.querySelector("#videocontainer > div.jw-controls.jw-reset > div.jw-controlbar.jw-background-color.jw-reset > div.jw-group.jw-controlbar-left-group.jw-reset > span.jw-text.jw-reset.jw-text-elapsed").textContent + "/" + document.querySelector("#videocontainer > div.jw-controls.jw-reset > div.jw-controlbar.jw-background-color.jw-reset > div.jw-group.jw-controlbar-left-group.jw-reset > span.jw-text.jw-reset.jw-text-duration").textContent)

        }else{

            console.log("看完了，OK了001")
        }

        //判断有没有看完-对比时间
        if(document.querySelector("#app  div.yxtulcdsdk-course-player__countdown.standard-size-12.yxtulcdsdk-flex-center > div > span")){

            console.log("没看完002")
        }else{

            console.log("看完了，OK了002")
            //单击下一个
            document.querySelector(".text-59.font-size-12.mb8.lh20").parentElement.parentElement.parentElement.parentElement.parentElement.nextSibling.getElementsByTagName("div")[4].click()
        }

        //对付挂机验证
        if(document.querySelector("#app > div > main > div > div > div.yxtf-dialog__wrapper > div > div > div > div:nth-child(4) > button")!=null){
            console.log("挂机验证来了！")
            document.querySelector("#app > div > main > div > div > div.yxtf-dialog__wrapper > div > div > div > div:nth-child(4) > button").click()
        }else{
            console.log("未触发挂机验证")
}
        console.log("----------------")
    }



    ```
//0.1倍播放速度（娱乐功能）
document.querySelector("#vjs_video_1_html5_api").playbackRate = 0.1
//单击下一个
//document.querySelector(".text-59.font-size-12.mb8.lh20").parentElement.parentElement.parentElement.parentElement.parentElement.nextSibling.getElementsByTagName("div")[4].click()
//下一个兄弟节点
//sec.nextSibling
//上一个兄弟节点
//sec.previousSibling

//单击下一个节点里的新视频
//document.querySelector(".text-59.font-size-12.mb8.lh20").parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.nextSibling.getElementsByClassName("flex-space-between")[1].click()

//剩余时间
document.querySelector("#app  div.yxtulcdsdk-course-player__countdown.standard-size-12.yxtulcdsdk-flex-center > div > span").textContent

//判断有没有看完
if(document.querySelector("#app  div.yxtulcdsdk-course-player__countdown.standard-size-12.yxtulcdsdk-flex-center > div > span")){console.log("没看完")}else{console.log("看完了，OK了")}



//正在播放
//document.querySelector(".text-59.font-size-12.mb8.lh20")

//正在播放的根
//document.querySelector(".text-59.font-size-12.mb8.lh20").parentElement.parentElement.parentElement.parentElement.parentElement

//下一个兄弟节点
//var sec = document.querySelector(".text-59.font-size-12.mb8.lh20").parentElement.parentElement.parentElement.parentElement.parentElement.nextSibling
//下一个兄弟节点
//sec.nextSibling
//上一个兄弟节点
//sec.previousSibling

//下一个根节点
document.querySelector(".text-59.font-size-12.mb8.lh20").parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.nextSibling


//对比时间一样吗
if(document.querySelector("#videocontainer > div.jw-controls.jw-reset > div.jw-controlbar.jw-background-color.jw-reset > div.jw-group.jw-controlbar-left-group.jw-reset > span.jw-text.jw-reset.jw-text-elapsed").textContent === document.querySelector("#videocontainer > div.jw-controls.jw-reset > div.jw-controlbar.jw-background-color.jw-reset > div.jw-group.jw-controlbar-left-group.jw-reset > span.jw-text.jw-reset.jw-text-duration").textContent){console.log("时间一样")}else{console.log("不一样!!")}
//左边时间
document.querySelector("#videocontainer > div.jw-controls.jw-reset > div.jw-controlbar.jw-background-color.jw-reset > div.jw-group.jw-controlbar-left-group.jw-reset > span.jw-text.jw-reset.jw-text-elapsed").textContent

//右边时间
document.querySelector("#videocontainer > div.jw-controls.jw-reset > div.jw-controlbar.jw-background-color.jw-reset > div.jw-group.jw-controlbar-left-group.jw-reset > span.jw-text.jw-reset.jw-text-duration").textContent

```



})();