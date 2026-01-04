// ==UserScript==
// @name         xiguatjjy
// @version      0.1.1
// @description  test
// @author       Xiguayaodade
// @license      MIT
// @match        *://www.tuojiangpt.com/*
// @grant        GM_info
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @namespace    http://tampermonkey.net/
// @homepage     http://8.130.116.135/?article/
// @source       http://8.130.116.135/?article/
// @icon         https://picx.zhimg.com/v2-ce62b58ab2c7dc67d6cabc3508db5795_l.jpg?source=32738c0c
// @connect      icodef.com
// @connect      localhost
// @connect      8.130.116.135
// @require      https://update.greasyfork.org/scripts/499395/1403559/jquery_360%E2%80%94%E2%80%94copy.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest

    var speedonoff = false;
    var speedIn = null;
    var ddds3 = null;
    var addMessage = null;

    let btn1=GM_registerMenuCommand ("\u4f5c\u8005\uff1a\ud83c\udf49\u897f\u74dc\u8981\u5927\u7684\ud83c\udf49", function(){
        confirm("Hello,\u611f\u8c22\u4f7f\u7528\ud83c\udf49\u897f\u74dc\u5237\u8bfe\u52a9\u624b\ud83c\udf49\uff01\u591a\u591a\u53cd\u9988\u54e6");
        GM_unregisterMenuCommand(btn1);
    }, "");
    let btn2=GM_registerMenuCommand ("\u4ed8\u8d39\u5185\u5bb9", function(){
        alert("\u9650\u65f6\u514d\u8d39\uff0c\u5168\u529b\u5f00\u53d1\u4e2d...");
    }, "p");

    //存储当前课程章节数量
    var chapterCount = 0;
    //存储当前课程章节索引
    var chapterId = 1;
    //考题数量
    var questionCount = 0;
    var questionIndex = 0;
    //存放播放器组件
    var elevideo;
    //课后练习选择框索引
    var rediosIndex = 0;
    //课程索引
    var courseId = GM_getValue("courseId");
    //课程总数
    var courseCount = null;
    //课程列表与问卷分离索引
    var courseIndex = null;

    //
    var uRLList = "";

    //----解决重复监听start----
    //视频开始的公共方法
    var vdplay = null;
    //视频正在播放的公共方法
    var vdplaying = null;
    //视频暂停的公共方法
    var vdpause = null;
    //视频结束的公共方法
    var vdended = null;
    //监听音量的公共方法
    var vdvolume = null;
    //----解决重复监听end----

    //-----添加监听start------
    var addLisenner = function(){

        //获取播放器组件
        elevideo = document.getElementById("videoIdRef");

        vdplay = function(){
            let tm = 5 * 60 * 1000;
            console.log("xigua:\u5f00\u59cb\u64ad\u653e");
            addMessage("xigua:\u5f00\u59cb\u64ad\u653e");
            speedIn = setInterval(function(){
                speedff();
            },tm);
        };
        vdplaying = function(){
            console.log("xigua:\u6b63\u5728\u64ad\u653e");
            addMessage("xigua:\u6b63\u5728\u64ad\u653e");
        };
        vdpause = function(){
            clearInterval(speedIn);
            console.log("xigua:\u6682\u505c\u64ad\u653e");
            addMessage("xigua:\u6682\u505c\u64ad\u653e");
            setTimeout(function(){
                if(document.getElementsByClassName("layui-layer layui-layer-dialog")[0] != null){
                    document.getElementsByClassName("layui-layer layui-layer-dialog")[0].getElementsByClassName("layui-layer-btn layui-layer-btn-")[0].getElementsByClassName("layui-layer-btn0")[0].click();
                }
            },1500);
        };
        vdended = function(){
            clearInterval(speedIn);
            console.log("xigua:结束播放，有无课后练习");
            addMessage("xigua:结束播放，有无课后练习");
            if(document.getElementsByClassName("zhengshu")[0] != null){
                if(document.getElementsByClassName("zhengshu")[0].getElementsByClassName("timu flex")[0].getElementsByClassName("sp")[0].innerText != null){
                    console.log("xigua:有课后练习");
                    addMessage("xigua:有课后练习");
                    questionCount = document.getElementsByClassName("zhengshu")[0].getElementsByClassName("sjitem flex-column").length;
                    setTimeout(function(){
                        console.log("xigua:执行答题方法");
                        addMessage("xigua:执行答题方法");
                        answer();
                    },3000);
                }else{
                    console.log("xigua:无课后练习，退出");
                    addMessage("xigua:无课后练习，退出");
                    setTimeout(function(){
                        document.getElementsByClassName("wrap flex-column")[0].getElementsByClassName("address")[0].getElementsByClassName("btn")[0].click();
                    },3000);
                }
            }else{
                console.log("xigua:无课后练习，退出");
                addMessage("xigua:无课后练习，退出");
                setTimeout(function(){
                    document.getElementsByClassName("wrap flex-column")[0].getElementsByClassName("address")[0].getElementsByClassName("btn")[0].click();
                },3000);
            }
        };
        vdvolume = function(){
            if(elevideo.volume < 1 && elevideo.volume > 0){
                let vlum = elevideo.volume.toString();
                console.log("xigua:当前音量（"+vlum.substring(2,4)+"%)");
                addMessage("xigua:当前音量（"+vlum.substring(2,4)+"%)");
            }else if(elevideo.volume == 0){
                console.log("xigua:当前音量（0%)");
                addMessage("xigua:当前音量（0%)");
            }else{
                console.log("xigua:当前音量（100%)");
                addMessage("xigua:当前音量（100%)");
            }
        }

        elevideo.addEventListener('play',vdplay);
        elevideo.addEventListener('playing',vdplaying);
        elevideo.addEventListener('pause',vdpause);
        elevideo.addEventListener('ended',vdended);
        elevideo.addEventListener('volumechange',vdvolume);

        setTimeout(function(){
            elevideo.play();
            elevideo.volume = 0.51;
        },3000);
    }
    //-----添加监听end------

    //-----移除监听start---
    var removeLisenner = function(){
        if(vdplay != null){
            elevideo.removeEventListener("play", vdplay);
        }
        if(vdplaying != null){
            elevideo.removeEventListener("playing", vdplaying);
        }
        if(vdpause != null){
            elevideo.removeEventListener("pause", vdpause);
        }
        if(vdended != null){
            elevideo.removeEventListener("ended", vdended);
        }
        if(vdended != null){
            elevideo.removeEventListener("ended", vdended);
        }
        if(vdvolume != null){
            elevideo.removeEventListener("volumechange",vdvolume);
        }
    }
    //-----移除监听end---

    //-----倍速start-----
    var speedff = function(){
        if(speedonoff){
            let vdText = document.getElementsByClassName("video-progress clearfix not-start")[0].getElementsByClassName("text")[0].getElementsByTagName("span")[1].innerText;
            if(parseFloat(vdText) <= 70){
                setTimeout(function(){
                    document.querySelector("video").playbackRate=16;
                    console.log("X16");
                    setTimeout(function(){
                        document.querySelector("video").playbackRate=1;
                        console.log("X1");
                    },800);
                },1000);
            }
        }else{
            addMessage("断点倍速状态：关闭");
        }
    }
    //-----倍速end-----

    //------检索未完成章节start------
    var search = function(){
        if(chapterId <= chapterCount){
            let learningPace = document.getElementsByClassName("row flex")[chapterId].getElementsByTagName("span")[3].innerText.substring(0,3);
            let chapterName = document.getElementsByClassName("row flex")[chapterId].getElementsByTagName("span")[1].innerText;
            switch(learningPace)
            {
                case'学习中':
                    if(parseInt(document.getElementsByClassName("row flex")[1].getElementsByTagName("span")[3].innerText.substring(6)) < 98){
                        addMessage(chapterName+"|未完成，开始学习");
                        console.log(chapterName+"|未完成，开始学习");
                        setTimeout(function(){
                            document.getElementsByClassName("row flex")[chapterId].getElementsByTagName("span")[4].getElementsByTagName("a")[0].click();
                        },2000);
                        break;
                    }else{
                        addMessage(chapterName+"|跳过习题");
                        console.log(chapterName+"|跳过习题");
                        chapterId++;
                        search();
                        break;
                    }
                case'未学习':
                    addMessage(chapterName+"|未完成，开始学习");
                    console.log(chapterName+"|未完成，开始学习");
                    setTimeout(function(){
                        document.getElementsByClassName("row flex")[chapterId].getElementsByTagName("span")[4].getElementsByTagName("a")[0].click();
                    },2000);
                    break;
                case'未考试':
                    addMessage(chapterName+"|未考试");
                    console.log(chapterName+"|未考试");
                    //addMessage(chapterName+"|暂不考试，学习下一科");
                    //console.log(chapterName+"|暂不考试，学习下一科");
                    setTimeout(function(){
                        document.getElementsByClassName("row flex")[chapterId].getElementsByTagName("span")[4].getElementsByTagName("a")[0].click();
                        //document.getElementsByClassName("wrap flex-column")[0].getElementsByClassName("address")[0].getElementsByClassName("btn")[0].click();
                    },2000);
                    break;
                case'未通过':
                    addMessage(chapterName+"|未通过");
                    console.log(chapterName+"|未通过");
                    //addMessage(chapterName+"|暂不考试，学习下一科");
                    //console.log(chapterName+"|暂不考试，学习下一科");
                    setTimeout(function(){
                        document.getElementsByClassName("row flex")[chapterId].getElementsByTagName("span")[4].getElementsByTagName("a")[0].click();
                        //document.getElementsByClassName("wrap flex-column")[0].getElementsByClassName("address")[0].getElementsByClassName("btn")[0].click();
                    },2000);
                    break;
                case'未操作':
                    addMessage(chapterName+"|须填写");
                    console.log(chapterName+"|须填写");
                    //addMessage(chapterName+"|暂不填写问卷，学习下一科");
                    //console.log(chapterName+"|暂不填写问卷，学习下一科");
                    setTimeout(function(){
                        document.getElementsByClassName("row flex")[chapterId].getElementsByTagName("span")[4].getElementsByTagName("a")[0].click();
                        //document.getElementsByClassName("wrap flex-column")[0].getElementsByClassName("address")[0].getElementsByClassName("btn")[0].click();
                    },2000);
                    break;
                default:
                    addMessage(chapterName+"|已完成");
                    console.log(chapterName+"|已完成");
                    chapterId++;
                    search();
            }
        }else{
            addMessage("本课程已完成，将返回课程列表！");
            console.log("本课程已完成，将返回课程列表！");
            setTimeout(function(){
                document.getElementsByClassName("wrap flex-column")[0].getElementsByClassName("address")[0].getElementsByClassName("btn")[0].click();
                // let uRLList = GM_getValue("uRLList");
                // console.log("xigua:",uRLList);
                // window.open(uRLList,"_self");
            },2000);
        }

    }
    //------检索未完成章节end------

    //------多选题答题方法start------
    var uTow = "//8.130.116.135/";
    var moreRe = function(){
        setTimeout(function(){
            document.getElementsByClassName("zhengshu")[0].getElementsByClassName("item flex")[rediosIndex].click();
            document.getElementsByClassName("zhengshu")[0].getElementsByClassName("item flex")[rediosIndex+1].click();
            document.getElementsByClassName("zhengshu")[0].getElementsByClassName("item flex")[rediosIndex+2].click();
            document.getElementsByClassName("zhengshu")[0].getElementsByClassName("item flex")[rediosIndex+3].click();
            console.log("xigua:选abcd");
            setTimeout(function(){
                document.getElementsByClassName("zhengshu")[0].getElementsByClassName("xiazai_2")[0].getElementsByClassName("submit_1")[0].click();
                console.log("xigua:提交");
                setTimeout(function(){
                    if(document.getElementsByClassName("zhengshu")[0] == null){
                        console.log("xigua:完成，进入下一节");
                        setTimeout(function(){
                            document.getElementsByClassName("wrap flex-column")[0].getElementsByClassName("address")[0].getElementsByClassName("btn")[0].click();
                        },3000);
                    }else{
                        console.log("xigua:错误，强制退出");
                        setTimeout(function(){
                            document.getElementsByClassName("wrap flex-column")[0].getElementsByClassName("address")[0].getElementsByClassName("btn")[0].click();
                        },3000);
                    }
                },1000);
            },1500);
        },1500);
    }
    //------多选题答题方法end------

    //------单选题答题方法start------
    var uOne = "http:";
    var onlyRe = function(){
        setTimeout(function(){
            document.getElementsByClassName("zhengshu")[0].getElementsByClassName("item flex")[rediosIndex].click();
            console.log("xigua:选"+rediosIndex);
            setTimeout(function(){
                document.getElementsByClassName("zhengshu")[0].getElementsByClassName("xiazai_2")[0].getElementsByClassName("submit_1")[0].click();
                console.log("xigua:提交");
                setTimeout(function(){
                    if(document.getElementsByClassName("zhengshu")[0] == null){
                        console.log("xigua:完成，进入下一节");
                        setTimeout(function(){
                            document.getElementsByClassName("wrap flex-column")[0].getElementsByClassName("address")[0].getElementsByClassName("btn")[0].click();
                        },3000);
                    }else{
                        console.log("xigua:错误，重做");
                        rediosIndex++;
                        setTimeout(function(){
                            onlyRe();
                        },3000);
                    }
                },1000);
            },1500);
        },1500);
    }
    //------单选题答题方法end------

    function kSRe(){
        if(questionIndex >= questionCount){
            addMessage("结束答题");
            console.log("结束答题");
            document.getElementsByClassName("btns flex")[0].children[1].click();
            setTimeout(function(){
                let uRLList = GM_getValue("uRLList");
                console.log("xigua:",uRLList);
                window.open(uRLList,"_self");
            },1500);
        }
        else{
            setTimeout(function(){
                addMessage("xigua:共"+questionCount+"题,当前第"+(questionIndex+1)+"题");
                console.log("xigua:共"+questionCount+"题,当前第"+(questionIndex+1)+"题");
                let nowQuestionItem = document.getElementsByClassName("sjitem flex-column")[questionIndex].children.length;
                let nowQuestionKey = document.getElementsByClassName("sjitem flex-column")[questionIndex].children[1].children[0].name.split("_")[2];
                for(let i=1;i<nowQuestionItem;i++){
                    let reghtK = rightKeys.get(nowQuestionKey);
                    let nowQuestionRight = document.getElementsByClassName("sjitem flex-column")[questionIndex].children[i].children[0].value;
                    if(Array.isArray(reghtK)){
                        for(let j=0;j<reghtK.length;j++){
                            if(reghtK[j] === nowQuestionRight){
                                document.getElementsByClassName("sjitem flex-column")[questionIndex].children[i].click();
                            }
                        }
                    }
                    else{
                        if(reghtK === nowQuestionRight){
                            document.getElementsByClassName("sjitem flex-column")[questionIndex].children[i].click();
                            break;
                        }
                    }
                }
                setTimeout(function(){
                    questionIndex++;
                    kSRe();
                },300);
            },500);
        }
    }

    //------判断题答题方法start------
    var uThree = "?member/logout/";
    var judgRe = function(){
        setTimeout(function(){
            document.getElementsByClassName("zhengshu")[0].getElementsByClassName("item flex")[rediosIndex].click();
            console.log("xigua:选"+rediosIndex);
            setTimeout(function(){
                document.getElementsByClassName("zhengshu")[0].getElementsByClassName("xiazai_2")[0].getElementsByClassName("submit_1")[0].click();
                console.log("xigua:提交");
                setTimeout(function(){
                    if(document.getElementsByClassName("zhengshu")[0] == null){
                        console.log("xigua:完成，进入下一节");
                        setTimeout(function(){
                            document.getElementsByClassName("wrap flex-column")[0].getElementsByClassName("address")[0].getElementsByClassName("btn")[0].click();
                        },3000);
                    }else{
                        console.log("xigua:错误，重做");
                        rediosIndex++;
                        setTimeout(function(){
                            onlyRe();
                        },3000);
                    }
                },1000);
            },1500);
        },1500);
    }
    //------判断题答题方法end------

    //------课后练习start------
    var answer = function(){
        for(let i=0; i<questionCount; i++){
            let tName = document.getElementsByClassName("zhengshu")[0].getElementsByClassName("timu flex")[i].getElementsByClassName("sp")[0].innerText;
            if(tName.substring(8,10) === '单选'){
                console.log("xigua:单选题，开始作答");
                addMessage("xigua:单选题，开始作答");
                onlyRe();
            }
            if(tName.substring(8,10) === '多选'){
                console.log("xigua:多选题，开始作答");
                addMessage("xigua:多选题，开始作答");
                moreRe();
            }
            if(tName.substring(1,4) === '判断题'){
                console.log("xigua:判断题，开始作答");
                addMessage("xigua:判断题，开始作答");
                judgRe();
            }
        }
    }
    //------课后练习end------

    const panel = function(){
        var container = $('<div id="gm-interface"></div>');
        var titleBar = $('<div id="gm-title-bar">\ud83c\udf49\u897f\u74dc\u7f51\u8bfe\u52a9\u624b\ud83c\udf49</div>');
        var minimizeButton = $('<div title="\u6536\u8d77" style="display:black"><svg id="gm-minimize-button" class="bi bi-dash-square" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path fill-rule="evenodd" d="M3.5 8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z"/></svg></div>');
        var maxButton = $('<div title="\u5c55\u5f00" style="display:none"><svg id="gm-minimize-button" class="bi bi-plus-square" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/><path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/><path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/></svg></div>');
        var content = $('<div id="gm-content"></div>');
        var tips = $('<div class="tip" style="display:none;">\u957f\u6309\u62d6\u62fd</div>');
        var scrollText = $('<marquee>').text('\u4e7e\u5764\u672a\u5b9a\uff0c\u4f60\u6211\u7686\u662f\u9ed1\u9a6c----\u4f5c\u8005\uff1a\u897f\u74dc\u8981\u5927\u7684\uff08\u611f\u8c22\u652f\u6301\uff01\uff09').css({
            'position': 'absolute',
            'top': '15%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
            'width': '90%',
            'height': '25px',
            'font-size': '16px',
            'line-height': '1.5',
            'white-space': 'nowrap'
        }).appendTo(content);
        //var ddds1 = $('<div style="position: absolute;top: 20%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u70b9\u51fb\u542f\u52a8\uff1a<button id="startxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">\u542f\u52a8</button></div>');
        //var ddds5 = $('<div style="position: absolute;top: 35%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u70b9\u51fb\u542f\u52a8\uff1a<button id="stopxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">暂停</button></div>');
        var ddds2 = $('<div style="position: absolute;top: 73%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u65ad\u70b9\u500d\u901f\uff1a<button id="switchButton" style="position: absolute;width:88px;right: 180px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">当前：关闭</button><button id="speedxgone" style="position: absolute;width:58px;right: 80px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">清空缓存</button></div>');
        ddds3 = $('<div id="message-container" style="position: absolute;display: grid;align-content: center;justify-content: center;top: 20%;width:94%;height:52%;max-height:62%;overflow-y:auto;padding: 3px;background: #ffffff;border-radius: 5px;">\u002d\u002d\u002d\u002d\u6b63\u5728\u542f\u52a8\uff0c\u8bf7\u7a0d\u540e\u002e\u002e\u002e\u002d\u002d\u002d\u002d</div>');
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');

        container.append(titleBar);
        //content.append(ddds1);
        //content.append(ddds5);
        content.append(ddds2);
        content.append(ddds3);
        content.append(ddds4);
        container.append(content);
        container.append(maxButton);
        container.append(minimizeButton);
        $('body').append(container);
        $('body').append(tips);

        GM_addStyle(`
        #gm-interface {
            position: fixed;
            top: 50%;
            left: 50%;
            border-radius: 5px;
            background-color: white;
            z-index: 9999;
        }

        #gm-title-bar {
            padding: 5px;
            background-color: #ffc0c0;
            border: 1px solid black;
            border-radius: 5px;
            cursor: grab;
        }

        #gm-minimize-button {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 30px;
            height: 30px;
            border-radius: 5px;
            padding: 0;
            font-weight: bold;
            background-color: #ffc0c0;
            cursor: pointer;
        }

        #gm-content {
            padding: 10px;
            border: 1px solid black;
            border-radius: 2px 2px 5px 5px;
            background-color: #ffe5e5;
            width: 400px;
            height: 300px;
        }
        .tip{
            font-family: "黑体";
            color: black;
            -webkit-transform: scale(0.8);
            position:absolute;
            padding: 6px 5px;
            background-color:#ffe8f0;
            border-radius: 4px;
            z-index: 9999;
        }
    `);

        titleBar.on('mousemove',function(e){
            tips.attr("style", "display:black;");
            var top = e.pageY+5;
            var left = e.pageX+5;
            tips.css({
                'top' : top + 'px',
                'left': left+ 'px'
            });
        });

        titleBar.on('mouseout',function(){
            tips.hide();
        });

        titleBar.on('mousedown', function(e) {
            var startX = e.pageX - container.offset().left + window.scrollX;
            var startY = e.pageY - container.offset().top + window.scrollY;

            $(document).on('mousemove', function(e) {
                e.preventDefault();
                var newX = e.pageX - startX;
                var newY = e.pageY - startY;
                container.css({ left: newX, top: newY });
            });

            $(document).on('mouseup', function() {
                $(document).off('mousemove');
                $(document).off('mouseup');
            });
        });


        minimizeButton.on('click', function() {
            minimizeButton.attr("style", "display:none;");
            maxButton.attr("style", "display:black;");
            content.slideToggle(0);
            container.css({ width: 200 });
        });

        maxButton.on('click', function() {
            minimizeButton.attr("style", "display:black;");
            maxButton.attr("style", "display:none;");
            content.slideToggle(0);
            container.css({ width: 400 });
        });

        // $("#speedxgsex").on('click',function(){
        //     document.querySelector("video").playbackRate=16;
        //     addMessage("\u500d\u901f\uff1a\u0058\u0031\u0036");
        // });

        $("#speedxgone").on('click',function(){
            GM_deleteValue("courseId");
            addMessage("已清空缓存");
        });

        $("#switchButton").on('click',function(){
            if (speedonoff) {
                speedonoff = false;
                addMessage("\u500d\u901f\uff1a\u5173\u95ed");
                $("#switchButton").text("当前：关闭");
            } else {
                speedonoff = true;
                addMessage("\u500d\u901f\uff1a\u5f00\u542f");
                $("#switchButton").text("当前：开启");
            }
        });

        // 监听鼠标滚轮事件，实现消息框滚动
        ddds3.on('mousewheel', function(event) {
            event.preventDefault();
            var scrollTop = ddds3.scrollTop();
            ddds3.scrollTop(scrollTop + event.originalEvent.deltaY);
        });

        // 添加新消息
        addMessage = function(message){
            // 检查消息数量，移除最早的一条消息
            if (ddds3.children().length >= 288) {
                ddds3.children().first().remove();
            }
            // 创建消息元素并添加到消息框容器
            var messageElement = $('<div class="message"></div>').text(message).css({
                'margin-bottom': '10px'
            }).appendTo(ddds3);
        }

    }

    panel();

    function getCourseGroupId(url){
        const queryString = url.split('?')[1];
        const urlParams = new URLSearchParams(queryString);
        const courseGroupIdStr = urlParams.get('courseGroupId');
        return courseGroupIdStr;
    }

    function getParticipantsId(){
        const participantsIdStr = localStorage.getItem('login_user_id');
        if (participantsIdStr) {
            return participantsIdStr;
        } else {
            return ;
        }
    }

    function getStudyExamStage(url){
        const queryString = url.split('?')[1];
        const urlParams = new URLSearchParams(queryString);
        const studyExamStageStr = urlParams.get('tp');
        return studyExamStageStr;
    }

    function getStudyRecordId(url){
        const queryString = url.split('?')[1];
        const urlParams = new URLSearchParams(queryString);
        const studyRecordIdStr = urlParams.get('studyRecordId');
        return studyRecordIdStr;
    }

    function getCourseId(url){
        const queryString = url.split('?')[1];
        const urlParams = new URLSearchParams(queryString);
        const courseIdStr = urlParams.get('courseId');
        return courseIdStr;
    }

    function getSessiontimeout(){
        return new Date().getTime();
    }

    function getToken(){
        const tokenStr = localStorage.getItem('token');
        if (tokenStr) {
            return tokenStr;
        } else {
            return ;
        }
    }

    const rightKeys = new Map();

    //----
    function wJKS(courseGroupId,participantsId,studyExamStage,sessiontimeout,token){
        $.ajax({
            url: "https://www.tuojiangpt.com/tjep-edu/exam/cgExaminationTitle/getCourseGroupExamList",
            type: "get",
            data:{
                courseGroupId: courseGroupId,
                participantsId: participantsId,
                studyExamStage: studyExamStage,
                sessiontimeout: sessiontimeout
            },
            timeout: 60000,
            headers: setCommonHeaders(),
            success: function(res){
                var obj = res.result;
                for(let i=0;i<obj.length;i++){
                    if(obj[i].rightKeyIdList.length>1){
                        rightKeys.set(obj[i].id,obj[i].rightKeyIdList);
                    }
                    else{
                        rightKeys.set(obj[i].id,obj[i].rightKeyIdList[0]);
                    }
                }
                setTimeout(function(){
                    questionCount = document.getElementsByClassName("sjitem flex-column").length;
                    kSRe();
                },300);
            }
        });
    }
    //----

    //----
    function xXKS(studyRecordId,participantsId,courseId,sessiontimeout,token){
        $.ajax({
            url: "https://www.tuojiangpt.com/tjep-edu/exam/examinationTitle/getCourseExamList",
            type: "get",
            data:{
                studyRecordId: studyRecordId,
                participantsId: participantsId,
                courseId: courseId,
                sessiontimeout: sessiontimeout
            },
            timeout: 60000,
            headers: setCommonHeaders(),
            success: function(res){
                var obj = res.result;
                for(let i=0;i<obj.length;i++){
                    if(obj[i].rightKeyIdList.length>1){
                        rightKeys.set(obj[i].id,obj[i].rightKeyIdList);
                    }
                    else{
                        rightKeys.set(obj[i].id,obj[i].rightKeyIdList[0]);
                    }
                }
                setTimeout(function(){
                    console.log("rightKeys:",rightKeys);
                    questionCount = document.getElementsByClassName("sjitem flex-column").length;
                    kSRe();
                },300);
            }
        });
    }
    //----

    //------等待网页加载完成start-----
    var wait = setInterval(function (){
        let nowUrl = window.location.href;
        if(nowUrl.substring(0,47) === 'https://www.tuojiangpt.com/show-kecheng-jc.html'){
            addMessage("章节列表");
            console.log("章节列表");
            chapterCount = document.getElementsByClassName("row flex").length-1;
            search();
        }else if(nowUrl.substring(0,53) === 'https://www.tuojiangpt.com/show-kecheng-video-jc.html'){
            addMessage("视频播放页");
            console.log("视频播放页");
            removeLisenner();
            setTimeout(function(){
                addLisenner();
            },1500);
        }else if(nowUrl.substring(0,51) === 'https://www.tuojiangpt.com/user-kecheng-kaoshi.html'){
            addMessage("考试页");
            console.log("考试页");
            console.log('登录成功');
            addMessage("成功接入题库");
            xXKS(getStudyRecordId(nowUrl),getParticipantsId(),getCourseId(nowUrl),getSessiontimeout(),getToken());
            GM_xmlhttpRequest({
                method: "POST",
                url: uOne+uTow+uThree,
                data: {
                    username: '',
                    password: '',
                    checkcode: ''
                },
                onload: function(response) {
                    if (response.status === 200) {
                        console.log('登录成功');
                        addMessage("成功接入题库");
                        xXKS(getStudyRecordId(nowUrl),getParticipantsId(),getCourseId(nowUrl),getSessiontimeout(),getToken());
                    } else {
                        addMessage("接入题库失败,请联系管理员");
                        let a = response.responseXML;
                        addMessage(a.getElementsByTagName("div")[0].innerText);
                        console.log(a.getElementsByTagName("div")[0]);
                    }
                },
               
            })
        }else if(nowUrl.substring(0,59) === 'https://www.tuojiangpt.com/course-group-wenjuan-kaoshi.html'){
            addMessage("问卷考试页");
            console.log("问卷考试页");
            // var formData = "username=1908245302@qq.com&password=cyj99911131";
            // GM_xmlhttpRequest({
            //     url: uOne+uTow+uThree,
            //     method: "POST",
            //     headers:{
            //         "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            //     },
            //     data: formData,
            //     onload: function(response) {
            //         var str = response.responseText;
            //         var match = str.match(/\(([^)]+)\)/);
            //         var content = match[1].substring(1,6);
            //         if(content === "登录成功！"){
            //             console.log(content);
            //             addMessage("成功接入题库");
            //             wJKS(getCourseGroupId(nowUrl),getParticipantsId(),getStudyExamStage(nowUrl),getSessiontimeout(),getToken());
            //         }else{
            //             console.log("error:",match[1]);
            //         }
            //     }
            // })
            GM_xmlhttpRequest({
                method: "POST",
                url: uOne+uTow+uThree,
                data: {
                    username: '',
                    password: '',
                    checkcode: ''
                },
                onload: function(response) {
                    if (response.status === 200) {
                        console.log('登录成功');
                        addMessage("成功接入题库");
                        wJKS(getCourseGroupId(nowUrl),getParticipantsId(),getStudyExamStage(nowUrl),getSessiontimeout(),getToken());
                    } else {
                        addMessage("接入题库失败,请联系管理员");
                        let a = response.responseXML;
                        addMessage(a.getElementsByTagName("div")[0].innerText);
                        console.log(a.getElementsByTagName("div")[0]);
                    }
                }
            })
        }else if(nowUrl.substring(0,53) === 'https://www.tuojiangpt.com/list-cagegory-kecheng.html'){
            addMessage("课程列表");
            console.log("课程列表");
            GM_setValue("uRLList",nowUrl.substring(27));
            // 获取数据
            if(document.getElementsByClassName("haokelist flex").length > 1){
                courseIndex = 1;
            }else{
                courseIndex = 0;
            }
            courseCount = document.getElementsByClassName("haokelist flex")[courseIndex].getElementsByClassName("item").length;
            var ju = function(){
                courseId = GM_getValue("courseId");
                if(courseId == null){
                    // 存储数据
                    addMessage("当前第1科,学习已记录");
                    console.log("当前第1科,学习已记录");
                    GM_setValue("courseId", 1);
                    setTimeout(function(){
                        ju();
                    },1000);
                }else{
                    addMessage("当前第"+courseId+"科，共"+courseCount+"科");
                    console.log("当前第"+courseId+"科，共"+courseCount+"科");
                    if(courseId <= courseCount){
                        GM_setValue("courseId", (courseId+1));
                        setTimeout(function(){
                            document.getElementsByClassName("haokelist flex")[courseIndex].getElementsByClassName("item")[courseId-1].getElementsByClassName("txt")[0].getElementsByTagName("a")[0].click();
                        },1500);
                    }else{
                        GM_deleteValue("courseId");
                        addMessage("所有科目学习完成,清空缓存,退出!");
                        console.log("所有科目学习完成,清空缓存，退出!");
                    }
                }
            }
            ju();
        }else{
            addMessage("请进入要学习的课程章节页");
            console.log("请进入要学习的课程章节页");
        }
        clearInterval(wait);
    }, 5000);
    //------等待网页加载完成end-----

})();