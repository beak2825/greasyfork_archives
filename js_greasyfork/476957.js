// ==UserScript==
// @name         九江学院（新版）
// @version      0.0.2
// @description  监控面板，自动播放...
// @author       Xiguayaodade
// @license      MIT
// @match        *://jjxy.web2.superchutou.com/*
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
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/476957/%E4%B9%9D%E6%B1%9F%E5%AD%A6%E9%99%A2%EF%BC%88%E6%96%B0%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/476957/%E4%B9%9D%E6%B1%9F%E5%AD%A6%E9%99%A2%EF%BC%88%E6%96%B0%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    // 检查当前窗口是否为顶层窗口
    if (window.self !== window.top) {
        return; // 如果不是顶层窗口，则不执行脚本
    }

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
    //存储当前课总讲数
    var sectionCount = 0;
    //存储当前课总讲数索引
    var sectionId = 1;
    //存储当前讲资源数
    var teamCount = 0;
    //存储当前讲资源索引
    var teamId = 1;
    //存储课后练习小题数量
    var questionCount = 0;
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

    /**
     *当前页面缓存标记
     *@type {String}
     */
    const NOWPAGE = "nowPage";
    /**
     *存储当前页面href
     *@param href 当前页面地址
     *@returns {*}
     */
    function saveNowPage(href){
        GM_setValue(NOWPAGE,href);
    }
    /**
     *缓存中获取前页面href当前页面地址
     *@returns {String}
     */
    function getNowPage(){
        return GM_getValue(NOWPAGE);
    }

    //-----添加监听start------
    var addLisenner = function(){

        //获取播放器组件
        elevideo = document.getElementsByTagName("video")[0];

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
                if(document.getElementsByClassName("ant-modal-body")[0] != null){
                    console.log("xigua:挂机监测，等待响应");
                    addMessage("xigua:挂机监测，等待响应");
                    setTimeout(function(){
                        document.getElementsByClassName("ant-modal-body")[0].getElementsByTagName("button")[0].click();
                    },2000);
                }
                else{
                    console.log("xigua:手动暂停已禁用");
                    addMessage("xigua:手动暂停已禁用");
                    setTimeout(function(){
                        elevideo.play();
                    },500);
                }
            },1500);
        };
        vdended = function(){
            clearInterval(speedIn);
            console.log("xigua:结束播放");
            addMessage("xigua:结束播放");
            setTimeout(function(){
                sectionId++;
                searchSection();
            },2000);
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
            elevideo.volume = 0;
        },2000);
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

    //-----获取课程名&章节数start-----
    var coursNameAndChapterCount = function(){
        try {
            let coursName = document.getElementsByClassName("Pro-title")[0].innerText;
            chapterCount = document.getElementsByClassName("ant-collapse-item").length;
            addMessage("章节列表 | "+coursName+"：共"+chapterCount+"章。");
        } catch (error) {
            addMessage("发现异常："+error+"|程序已终止运行...");
        }
    }
    //-----获取课程名&章节数end-----

    //------检索章节是否完成start------
    var search = function(){
        try {
            if(chapterId <= chapterCount){
                sectionCount = document.getElementsByClassName("ant-list-items")[chapterId-1].childElementCount
                console.log("xigua:共"+chapterCount+"章,当前第"+chapterId+"章，共"+sectionCount+"讲。");
                addMessage("xigua:共"+chapterCount+"章,当前第"+chapterId+"章，共"+sectionCount+"讲。");
                searchSection();
            }
            else{
                console.log("xigua:当前课程学习完毕，请返回课程列表...");
                addMessage("xigua:当前课程学习完毕，请返回课程列表...");
                setTimeout(function(){
                    // window.open('https://web3.swufe-online.com/user/stu/index.jsp','_blank');
                },2000);
            }
        } catch (error) {
            addMessage("发现异常："+error);
        }
    }
    //------检索章节是否完成end------

    //------检索章节讲是否完成start
    var searchSection = function(){
        try {
            if(sectionId <= sectionCount){
                let iconLength = document.getElementsByClassName("ant-list-items")[chapterId-1].children[sectionId-1].getElementsByClassName("ant-col ant-col-2")[0].children.length;
                if(iconLength > 0){
                    console.log("xigua:当前第"+sectionId+"讲已完成。");
                    addMessage("xigua:当前第"+sectionId+"讲已完成。");
                    sectionId++;
                    setTimeout(function(){
                        searchSection();
                    },100);
                }
                else{
                    console.log("xigua:当前第"+sectionId+"讲，未完成，开始学习,请稍...");
                    addMessage("xigua:当前第"+sectionId+"讲，未完成，开始学习,请稍后...");
                    document.getElementsByClassName("ant-list-items")[chapterId-1].children[sectionId-1].getElementsByTagName("a")[0].click();
                    setTimeout(function(){
                        removeLisenner();
                        addLisenner();
                    },10000);
                }
            }else{
                console.log("xigua:第"+chapterId+"章检索完成。");
                addMessage("xigua:第"+chapterId+"章检索完成。");
                sectionId = 1;
                chapterId++;
                setTimeout(function(){
                    search();
                },100);
            }
        } catch (error) {
            addMessage("发现异常："+error+"|程序已终止运行...");
        }
    }
    //------检索章节讲是否完成end------

    //------检索章节讲资源是否完成start
    var searchTeam = function(){
        try {
            if (teamId <= teamCount) {

            }
            else {
                console.log("xigua:第" + chapterId + "章第" + sectionId + "讲检索完成。");
                addMessage("xigua:第" + chapterId + "章第" + sectionId + "讲检索完成。");
            }
        } catch (error) {
            addMessage("发现异常："+error+"|程序已终止运行...");
        }
    }
    //------检索章节讲资源是否完成end------

    //------多选题答题方法start------
    var moreRe = function(){
        setTimeout(function(){
            let positiveSolution = window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByTagName("input")[2].value;
            let array = positiveSolution.split(' ');
            let str2 = array.join('');
            console.log("xigua:返回数据{"+str2+"}");
            setTimeout(function(){
                for(var j=0;j<str2.length;j++){
                    switch(str2[j])
                    {
                        case 'A':
                            window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-body")[0].getElementsByClassName("test-body-cell col-2")[1].getElementsByTagName("li")[0].click();
                            console.log("点击A");
                            break;
                        case 'B':
                            window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-body")[0].getElementsByClassName("test-body-cell col-2")[1].getElementsByTagName("li")[1].click();
                            console.log("点击B");
                            break;
                        case 'C':
                            window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-body")[0].getElementsByClassName("test-body-cell col-2")[1].getElementsByTagName("li")[2].click();
                            console.log("点击C");
                            break;
                        case 'D':
                            window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-body")[0].getElementsByClassName("test-body-cell col-2")[1].getElementsByTagName("li")[3].click();
                            console.log("点击D");
                            break;
                        case 'E':
                            window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-body")[0].getElementsByClassName("test-body-cell col-2")[1].getElementsByTagName("li")[4].click();
                            console.log("点击E");
                            break;
                        case 'F':
                            window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-body")[0].getElementsByClassName("test-body-cell col-2")[1].getElementsByTagName("li")[5].click();
                            console.log("点击F");
                            break;
                        case 'G':
                            window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-body")[0].getElementsByClassName("test-body-cell col-2")[1].getElementsByTagName("li")[6].click();
                            console.log("点击G");
                            break;
                        default:
                            console.log("当前多选题选项过多，系统需更新！");
                    }
                }
            },1500);
            setTimeout(function(){
                window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-foot")[0].getElementsByClassName("btn btn-solid btn-round")[0].click();
                if(window.frames[0][0].document.getElementsByClassName("popup popup-test")[0] != null){
                    console.log("xigua:回答完毕，继续学习");
                    addMessage("xigua:回答完毕,继续学习");
                    setTimeout(function(){
                        window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-foot")[0].getElementsByClassName("btn btn-solid btn-round")[1].click();
                    },1000);
                }else{
                    console.log("xigua:回答正确");
                    addMessage("xigua:回答正确");
                }
            },3000);
        },1000);
    }
    //------多选题答题方法end------

    //------单选题答题方法start------
    var onlyRe = function(){
        setTimeout(function(){
            let positiveSolution = window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByTagName("input")[2].value;
            let array = positiveSolution.split(' ');
            let str2 = array.join('');
            console.log("xigua:返回数据{"+str2+"}");
            setTimeout(function(){
                switch(str2[0])
                {
                    case 'A':
                        window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-body")[0].getElementsByClassName("test-body-cell col-2")[1].getElementsByTagName("li")[0].click();
                        console.log("点击A");
                        break;
                    case 'B':
                        window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-body")[0].getElementsByClassName("test-body-cell col-2")[1].getElementsByTagName("li")[1].click();
                        console.log("点击B");
                        break;
                    case 'C':
                        window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-body")[0].getElementsByClassName("test-body-cell col-2")[1].getElementsByTagName("li")[2].click();
                        console.log("点击C");
                        break;
                    case 'D':
                        window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-body")[0].getElementsByClassName("test-body-cell col-2")[1].getElementsByTagName("li")[3].click();
                        console.log("点击D");
                        break;
                    case 'E':
                        window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-body")[0].getElementsByClassName("test-body-cell col-2")[1].getElementsByTagName("li")[4].click();
                        console.log("点击E");
                        break;
                    case 'F':
                        window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-body")[0].getElementsByClassName("test-body-cell col-2")[1].getElementsByTagName("li")[5].click();
                        console.log("点击F");
                        break;
                }
            },1500);
            setTimeout(function(){
                window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-foot")[0].getElementsByClassName("btn btn-solid btn-round")[0].click();
                if(window.frames[0][0].document.getElementsByClassName("popup popup-test")[0] != null){
                    console.log("xigua:回答完毕，继续学习");
                    addMessage("xigua:回答完毕,继续学习");
                    setTimeout(function(){
                        window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-foot")[0].getElementsByClassName("btn btn-solid btn-round")[1].click();
                    },1000);
                }else{
                    console.log("xigua:回答正确");
                    addMessage("xigua:回答正确");
                }
            },3000);
        },1000);
    }
    //------单选题答题方法end------

    //------判断题答题方法start------
    var judgRe = function(){
        setTimeout(function(){
            let positiveSolution = window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByTagName("input")[2].value;
            let array = positiveSolution.split(' ');
            let str2 = array.join('');
            console.log("xigua:返回数据{"+str2+"}");
            setTimeout(function(){
                switch(str2[0])
                {
                    case 'A':
                        window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-body")[0].getElementsByClassName("test-body-cell col-2")[1].getElementsByTagName("li")[0].click();
                        console.log("点击A");
                        break;
                    case 'B':
                        window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-body")[0].getElementsByClassName("test-body-cell col-2")[1].getElementsByTagName("li")[1].click();
                        console.log("点击B");
                        break;
                }
            },1500);
            setTimeout(function(){
                window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-foot")[0].getElementsByClassName("btn btn-solid btn-round")[0].click();
                if(window.frames[0][0].document.getElementsByClassName("popup popup-test")[0] != null){
                    console.log("xigua:回答完毕，继续学习");
                    addMessage("xigua:回答完毕,继续学习");
                    setTimeout(function(){
                        window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-foot")[0].getElementsByClassName("btn btn-solid btn-round")[1].click();
                    },1000);
                }else{
                    console.log("xigua:回答正确");
                    addMessage("xigua:回答正确");
                }
            },3000);
        },1000);
    }
    //------判断题答题方法end------

    //------课堂练习start------
    var answer = function(){
        // for(let i=0; i<questionCount; i++){
            let tName = window.frames[0][0].document.getElementsByClassName("popup popup-test")[0].getElementsByClassName("popup-head")[0].innerText;
            if(tName === ' 单选题'){
                console.log("xigua:单选题，开始作答");
                addMessage("xigua:单选题，开始作答");
                onlyRe();
            }
            if(tName === ' 多选题'){
                console.log("xigua:多选题，开始作答");
                addMessage("xigua:多选题，开始作答");
                moreRe();
            }
            if(tName === ' 判断题'){
                console.log("xigua:判断题，开始作答");
                addMessage("xigua:判断题，开始作答");
                judgRe();
            }
        // }
    }
    //------课堂练习end------

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
        var ddds2 = $('<div style="position: absolute;top: 73%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u65ad\u70b9\u500d\u901f\uff1a<button id="switchButton" style="position: absolute;width:88px;right: 180px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">当前：关闭</button><button id="speedxgone" style="position: absolute;width:88px;right: 38px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">清空缓存</button></div>');
        ddds3 = $('<div id="message-container" style="position: absolute;display: grid;align-content: center;justify-content: center;top: 20%;width:94%;height:52%;max-height:62%;overflow-y:auto;padding: 3px;background: #ffffff;border-radius: 5px;"></div>');
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
            ddds3.children().remove();
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
    addMessage("\u002d\u002d\u002d\u002d\u6b63\u5728\u542f\u52a8\uff0c\u8bf7\u7a0d\u540e\u002e\u002e\u002e\u002d\u002d\u002d\u002d");

    //------等待网页加载完成start-----
    var wait = setInterval(function (){
        ddds3.children().first().remove();
        let nowUrl = window.location.href;
        if(nowUrl === 'https://jjxy.web2.superchutou.com/#/'){
            addMessage("学习计划,请进入要学习的课程");
        }
        else if(nowUrl.substring(0,58) === 'https://jjxy.web2.superchutou.com/#/onlineclass/curriculum'){
            coursNameAndChapterCount();
        }
        else if(nowUrl.substring(0,41) === 'https://jjxy.web2.superchutou.com/#/video'){
            addMessage("播放页，加载中请稍后...");
            saveNowPage(nowUrl);
            setTimeout(function(){
                ddds3.children().first().remove();
                chapterCount = document.getElementsByClassName("player_catalog_view___c9n4W")[0].childElementCount;
                search();
            },10000);
            clearInterval(wait);
        }
        else{
            addMessage("请进入课程列表");
            console.log("请进入课程列表");
        }
    }, 500);
    //------等待网页加载完成end-----

})();