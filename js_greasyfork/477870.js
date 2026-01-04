// ==UserScript==
// @name         21tb自用
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  21tb的自动挂机，未实现全自动学习。手动选择课程后，课程内的每小节会自动下一节学习。注意：1、域名的主机名要注意是否相同，账号不同，对应的页面不同，不能保证所有通用，注意URL的路径匹配，自行修改，目前我接触的有两种学习界面；2、因为21tb的视频使用了iframe，所以将脚本设置“仅在顶层页面（框架）运行”选择“是”，以免重复启用。
// @author       You
// @match        https://*.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=21tb.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477870/21tb%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/477870/21tb%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var interval=30 //间隔时间，秒，必须正整数
    var watchVideo //视频任务
    var studyUrl='/els/html/courseStudyItem/courseStudyItem.learn.do' //url，自行修改

    console.log("已启动")

    //时间设置有误，默认为30秒
    if(!(Number.isInteger(interval)&&interval>0))
    {
        interval=30
    }

    var newA=document.createElement("span")
    newA.style.cursor='pointer'
    newA.innerHTML='正在加载，10秒后开启挂机'
    newA.style.color='red'
    if(document.querySelector('#courseItemId'))
    {

        document.querySelector('.cl-container').appendChild(newA)
    }
    else if(document.querySelector('#aliPlayerFrame'))
    {
        document.querySelector('.study-rate-title').appendChild(newA)
    }
    var domain=document.domain
    var url=window.location.pathname

    //此处学习地址不同，可自行修改
    if(url==studyUrl)
    {
        setTimeout(function(){
            if(document.querySelector('#courseItemId'))
            {
                console.log("1号方案")
                newA.innerHTML='已开启挂机--1'
                checkVideo()
               watchVideo=setInterval(checkVideo,interval*1000)
            }
            else if(document.querySelector('#aliPlayerFrame'))
            {
                console.log("2号方案")
                newA.innerHTML='已开启挂机--2'
                checkVideo2()
                watchVideo=setInterval(checkVideo2,interval*1000)
            }
        },10000);
    }


function checkVideo2()
    {
        console.log("正在检测视频——2")
        //Iframe的document
        var frameDocument=document.querySelector('#aliPlayerFrame').contentDocument
        //检测未完成的课程
        newA.innerHTML='已开启挂机-2-还剩'+ frameDocument.querySelectorAll('.section-item:not(.finish)').length +"节课"

        //判断是否有正在学习的节点
        if(frameDocument.querySelector('.first-line.active'))
        {
            //如果有，判断该节点是否是已完成
            if(frameDocument.querySelector('.first-line.active').parentNode.classList.contains('finish'))
            {
                //有找到未完成的课程
                if(frameDocument.querySelector('.section-item:not(.finish)'))
                {
                    frameDocument.querySelector('.section-item:not(.finish)').click()
                    return
                }
                else//没有找到未完成的课程
                {
                    //关闭定时器
                    clearInterval(watchVideo)
                    return
                }

            }
            else{//未完成，判断视频是否暂停状态
                console.log('检测视频是否暂停状态--2--暂停',frameDocument.querySelector('video').paused)

                if(frameDocument.querySelector('video').paused)
                {
                   frameDocument.querySelector('video').play()
                }
                return
            }
        } else//如果没有正在学习的节点
        {
                //有找到未完成的课程
                if(frameDocument.querySelector('.section-item:not(.finish)'))
                {
                    frameDocument.querySelector('.section-item:not(.finish)').click()
                    return
                }
                else//没有找到未完成的课程
                {
                    //关闭定时器
                    clearInterval(watchVideo)
                    return
                }
        }



    }

        function checkVideo(){
            console.log("正在检测视频——1")

            newA.innerHTML='已开启挂机--1--还剩'+ document.querySelectorAll('a.item-no').length +"节课"
            //检测是否有正在播放的视频
            if(document.querySelector('a.cl-catalog-playing'))
            {
                //已完成
                if(document.querySelector('a.cl-catalog-playing').classList.contains('item-done'))
                {
                    //如果存在未完成的视频
                    if(document.querySelector('a.item-no'))
                    {
                        //点击第一个未完成的视频
                        document.querySelector('a.item-no').click()
                        console.log('正在播放“'+document.querySelector('a.item-no').title+"”")
                        return
                    }
                    //如果不存在未完成的视频，说明视频已经播放完毕。结束计时器
                    clearInterval(watchVideo)
                }
                else{//未播放完成
                    if(document.querySelector('iframe#iframe_aliplayer').contentDocument.querySelector('video').paused)
                    {
                        document.querySelector('iframe#iframe_aliplayer').contentDocument.querySelector('video').play()
                    }
                    return
                }
            }else{//没有正在播放的视频
                //如果存在未完成的视频
                if(document.querySelector('a.item-no'))
                {
                    //点击第一个未完成的视频
                    document.querySelector('a.item-no').click()
                     console.log('正在播放“'+document.querySelector('a.item-no').title+"”")
                    return
                }
                //如果不存在未完成的视频，说明视频已经播放完毕。结束计时器
                clearInterval(watchVideo)
            }
        }

    // Your code here...
})();