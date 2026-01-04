// ==UserScript==
// @name         湖南人才市场公共教育网刷课
// @description  已实现自动播放、答题、课程自动切换，需要请联系vx：xiguayaodade_two qq：1908245302
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @author       Xiguayaodade
// @license      MIT
// @match        *://ua.peixunyun.cn/*
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
// @homepage     http://8.130.116.135/?article/
// @source       http://8.130.116.135/?article/
// @icon         https://picx.zhimg.com/v2-ce62b58ab2c7dc67d6cabc3508db5795_l.jpg?source=32738c0c
// @connect      icodef.com
// @connect      localhost
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/477104/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/477104/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var vd;


    var elevideo;

    var coff = 0;
    var vdplay = null;

    var vdplaying = null;

    var vdpause = null;
    var vdended = null;


    console.log("启动成功");

    function begin(){
        if(document.getElementsByTagName("video")[0] == null){
            console.log("yjc：等待视频加载！");
        }else{
            var vdo = document.getElementsByTagName("video");
            console.log("yjc:",vdo);
            var a = parseInt(document.getElementsByClassName("water")[0].getAttribute("style").substring(8));
            if(a < 100){
                console.log("当前进度："+a+"%");
                setTimeout(function(){
                    document.getElementsByClassName("mejs__overlay-button")[0].click();
                },3000);
                clearInterval(timer);
            }else{
                console.log("当前进度："+a+"%");
                document.getElementsByClassName("operating-area active")[0].getElementsByClassName("next-page-btn cursor")[0].click();
                setTimeout(function(){
                    if(document.getElementsByClassName("btn-hollow")[1] != null){
                        setTimeout(function(){
                            document.getElementsByClassName("btn-hollow")[1].click();
                        },1000);
                        setTimeout(function(){
                            document.getElementsByClassName("back-btn control-btn cursor return-url")[0].click();
                        },1000);
                    }
                    if(document.getElementsByTagName("video")[0] == null){
                        console.log("试探一次");
                        document.getElementsByClassName("operating-area active")[0].getElementsByClassName("next-page-btn cursor")[0].click();
                        setTimeout(function (){
                            console.log("关闭弹窗");
                            document.getElementsByClassName("btn-hollow")[0].click();
                            setTimeout(function (){
                                if(document.getElementsByTagName("video")[1] == null){
                                    //没有下一节
                                    setTimeout(function (){
                                        console.log("yjc：没有下一节,即将返回章节列表");
                                        //返回章节列表
                                        setTimeout(function (){
                                            console.log("yjc：执行返回章节列表");
                                            document.getElementsByClassName("back-btn control-btn cursor return-url")[0].click();
                                        }, 5000);
                                    }, 2000);
                                }
                            }, 1000);
                        }, 1000);
                    }
                },1000)
            }
        }
    }
    var timer = setInterval(begin, 5000);


    function execute(){
        if(document.getElementsByTagName("video")[0] == null){
            console.log("yjc：当前不在视频页！");
        }else{
            vd = document.getElementsByTagName("video")[0].id;
            console.log("yjc:",vd);
            elevideo = document.getElementById(vd);


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


            vdplay = function(){
                console.log("yjc:开始播放");
            };
            vdplaying = function(){
                console.log("yjc:正在播放");
            };
            vdpause = function(){
                if(document.getElementsByClassName("btn-submit")[0] != null){
                    setTimeout(function (){
                        coff++;
                        if(coff > 3){
                            return;
                        }
                        document.getElementsByClassName("btn-submit")[0].click();
                        setTimeout(function (){
                            document.getElementsByClassName("mejs__overlay-button")[0].click();
                        }, 5000);
                    }, 8000);
                }else{
                    console.log("手动暂停，无需操作");
                }
            };
            vdended = function(){
                console.log("yjc:结束播放");
                setTimeout(function (){
                    document.getElementsByClassName("operating-area active")[0].getElementsByClassName("next-page-btn cursor")[0].click();
                    setTimeout(function (){
                        if(document.getElementsByTagName("video")[0] == null){
                            console.log("试探一次");
                            document.getElementsByClassName("operating-area active")[0].getElementsByClassName("next-page-btn cursor")[0].click();
                            setTimeout(function (){
                                console.log("关闭弹窗");
                                document.getElementsByClassName("btn-hollow")[0].click();
                                setTimeout(function (){
                                    if(document.getElementsByTagName("video")[0] == null){
                                        //没有下一节
                                        setTimeout(function (){
                                            console.log("yjc：没有下一节,即将返回章节列表");
                                            //返回章节列表
                                            setTimeout(function (){
                                                console.log("yjc：执行返回章节列表");
                                                document.getElementsByClassName("back-btn control-btn cursor return-url")[0].click();
                                            }, 5000);
                                        }, 5000);
                                    }else{
                                        setTimeout(function (){
                                            console.log("yjc：进入下一节，继续播放");
                                            document.getElementsByClassName("mejs__overlay-button")[0].click();
                                        }, 5000);
                                    }
                                }, 6000);
                            }, 3000);
                        }else{
                            document.getElementsByClassName("mejs__overlay-button")[0].click();
                        }
                    }, 5000);
                }, 3000);
            };


            elevideo.addEventListener('play',vdplay);
            elevideo.addEventListener('playing',vdplaying);
            elevideo.addEventListener('pause',vdpause);
            elevideo.addEventListener('ended',vdended);
        }
    }
    var timer2 = setInterval(execute,5000);
})();