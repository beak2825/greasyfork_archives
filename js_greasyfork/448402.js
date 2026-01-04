// ==UserScript==
// @name         在浙学自动刷课
// @namespace    Vikrant
// @version      1.2.1
// @description  可以快速地（默认16倍速）自动看完在浙学上一门科目的所有视频和文档。
// @author       Vikrant
// @match        https://www.zjooc.cn/ucenter/student/course/study/*/plan/detail/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://www.zjooc.cn/favicon.ico
// @license      GNU GPLv3
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448402/%E5%9C%A8%E6%B5%99%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/448402/%E5%9C%A8%E6%B5%99%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let videoRate = 16                          //倍速播放视频的倍数，最大为16倍，默认为16倍，网速慢的话可以调小一些，防止卡顿
    let delay = 2000                            //某些环节等待加载的延迟，如果网络卡顿可以调大一些（单位ms）

    let win = unsafeWindow
    let winDoc = unsafeWindow.document

    let labelList = []
    //let buttonList = []
    let dirList = []

    let labelNow = null
    //let buttonNow = null
    let dirNow = null

    let dirIndex = 0
    //let buttonIndex = 0
    let labelIndex = 0

    if (videoRate < 0 || videoRate > 16) {                      //防小天才
        videoRate = 16
        console.log('视频倍速不得大于16倍或小于0！')
    }
    if (delay < 0) {
        delay = 2000
        console.log('delay不得小于0！')
    }

    let nullFunction = function () { }                          //空函数
    let find = {                                                //查找类函数的集合
        _dir: "#pane-Chapter>div>ul>li.el-submenu>ul>li>span",
        dir: function () {                                      //获取每一个小章节存入数组
            let list = winDoc.querySelectorAll(
                "#pane-Chapter>div>ul>li.el-submenu>ul>li>span"
            )
            return list
        },

        _videoLabel: "div>span.label>i.icon-shipin:not(.complete)+span",
        videoLabel: function () {                               //获取每一个小章节里上方内容是视频(未看)的标签存入数组
            let list = winDoc.querySelectorAll(
                "div>span.label>i.icon-shipin:not(.complete)+span"
            )
            return list
        },

        _docLabel: "div>span.label>i:not(.icon-shipin):not(.complete)+span",
        docLabel: function () {                                 //获取每一个小章节里上方内容是文档(未看)的标签存入数组
            let list = winDoc.querySelectorAll(
                "div>span.label>i:not(.icon-shipin):not(.complete)+span"
            )
            return list
        },

        label: function () {                                    //获取小章节上所有标签（先所有视频，再所有文档）
            let videoLabel = find.videoLabel()
            let docLabel = find.docLabel()
            let list = new Array(videoLabel.length + docLabel.length)
            for (let i = 0; i < videoLabel.length; ++i) {
                list[i] = videoLabel[i]
            }
            for (let i = 0; i < docLabel.length; ++i) {
                list[videoLabel.length + i] = docLabel[i]
            }
            return list
        },

        _button: "div>div>div.contain-bottom>button",
        button: function () {                                   //获取当前文档的“完成学习”按钮并返回
            let btn = winDoc.querySelector(
                "div>div>div.contain-bottom>button"
            )
            return btn
        }
    }

    function doAfterLoad(selector, event, interval = 1000) { //当元素加载后执行特定函数
        let scan = setInterval(() => {
            let load = winDoc.querySelector(selector)
            if (load) {
                stop(scan)
                event()
            }
        }, interval)
        function stop(obj) {                              //函数内定义的stop()，方便在setInterval内部停止自身
            clearInterval(obj)
        }
    }

    function nextDir() {                                  //跳转至下一个小章节
        if (++dirIndex > dirList.length - 1) {
            end()
        } else {
            dirList[dirIndex].click()
            dirNow = dirList[dirIndex]
            setTimeout(() => {
                labelList = find.label()             //初始化labelList相关的值
                labelIndex = 0
                labelNow = labelList[0]
                //buttonList = find.button()           //初始化buttonList相关的值
                //buttonIndex = 0
                //buttonNow = buttonList[0]
                if (labelList.length == 0) {
                    nextDir()
                } else {
                    labelNow.click()
                    setTimeout(() => {
                        if (winDoc.querySelector("video")) {
                            videoPlay(nextLabel)
                        } else {
                            //buttonNow.click()
                            find.button().click()
                            setTimeout(() => {
                                nextLabel()
                            }, delay);
                        }
                    }, delay)
                }
            }, delay)
        }
    }

    function nextLabel() {                                //点击下一个未观看的视频标签
        if (++labelIndex > labelList.length - 1) {
            nextDir()
        } else {
            labelList[labelIndex].click()
            labelNow = labelList[labelIndex]
            setTimeout(() => {
                if (winDoc.querySelector("video")) {
                    videoPlay(nextLabel)
                } else {
                    //buttonList = find.button()             //不知道为什么要重新初始化一遍buttonList才能正确点击
                    //buttonNow = buttonList[++buttonIndex]
                    //buttonNow.click()
                    find.button().click()
                    setTimeout(() => {
                        nextLabel()
                    }, delay);
                }
            }, delay)
        }
    }

    function videoPlay(afterEvent = nullFunction) {       //播放当前页面的视频并指定播放完之后执行的函数
        doAfterLoad("video", () => {
            let video = winDoc.querySelector("video")
            video.muted = true                            //静音
            video.playbackRate = videoRate                //调倍速
            video.play()                                  //开始播放视频
            video.addEventListener('ended', () => {       //监听视频是否播放完毕
                afterEvent()
            })
        })
    }
    /*
        function docPass() {                                   //点击“完成学习”按钮
            doAfterLoad(find._button, () => {
                let button = find.button()
                for (let i = 0; i < button.length; i++) {
                    button[i].click()
                }
            })
        }
    */
    function end() {                                        //结束函数
        winDoc.querySelector("#passButton").innerHTML = "完成！"
        GM_addStyle(`
                #passButton{
                    background-color:#e67e22
                }
            `)
    }

    function main() {                                       //主函数
        setTimeout(() => {
            dirList = find.dir()                            //初始化dirList以及相关的值
            dirIndex = 0
            dirNow = dirList[0]
            dirList[0].click()
            setTimeout(() => {
                labelList = find.label()
                labelIndex = 0
                labelNow = labelList[0]
                //buttonList = find.button()
                //buttonIndex = 0
                //buttonNow = buttonList[0]
                if (labelList.length == 0) {
                    nextDir()
                } else {
                    labelNow.click()
                    setTimeout(() => {
                        if (winDoc.querySelector("video")) {
                            videoPlay(nextLabel)
                        } else {
                            //buttonNow.click()
                            find.button().click()
                            setTimeout(() => {
                                nextLabel()
                            }, delay);
                        }
                    }, delay);
                }
            }, delay);
        }, delay);
    }

    let passButton = winDoc.createElement('button')            //创建按钮
    passButton.id = 'passButton'
    passButton.innerHTML = '开始刷课'
    win.onload = () => {                                       //在页面加载时添加按钮
        let header = winDoc.querySelector("#app>div>section>section>header")
        header.appendChild(passButton)
        passButton.onclick = () => {                           //指定按钮点击事件
            main()
            passButton.innerHTML = '刷课中…'
            GM_addStyle(`
                #passButton{
                    background-color:#53555e
                }
            `)
            passButton.onclick = nullFunction              //按钮点击后移除点击事件
        }
    }                                                      //定义按钮样式
    GM_addStyle(`                                          
        #passButton{
            background-color: #1192ff;
            color: white;
            text-align: center;
            padding: 0px 32px;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
        }
    `)
})();

/*
 .o8                   
"888                   
 888oooo.  oooo    ooo 
 d88' `88b  `88.  .8'  
 888   888   `88..8'   
 888   888    `888'    
 `Y8bod8P'     .8'     
           .o..P'      
           `Y8P'       
                       
oooooo     oooo  o8o  oooo                                           .   
 `888.     .8'   `"'  `888                                         .o8   
  `888.   .8'   oooo   888  oooo  oooo d8b  .oooo.   ooo. .oo.   .o888oo 
   `888. .8'    `888   888 .8P'   `888""8P `P  )88b  `888P"Y88b    888   
    `888.8'      888   888888.     888      .oP"888   888   888    888   
     `888'       888   888 `88b.   888     d8(  888   888   888    888 . 
      `8'       o888o o888o o888o d888b    `Y888""8o o888o o888o   "888" 
*/