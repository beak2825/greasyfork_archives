// ==UserScript==
// @name         湖南人才市场公共教育网（定制版）
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  私人定制，仅凭链接访问!
// @author       西瓜要大的
// @license      MIT
// @match        *://ua.peixunyun.cn/*
// @icon         https://www.hnpxw.org/favicon.ico
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/471415/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91%EF%BC%88%E5%AE%9A%E5%88%B6%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/471415/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91%EF%BC%88%E5%AE%9A%E5%88%B6%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //存放视频id
    var vd;

    //存放播放器组件
    var elevideo;

    //----解决重复监听start----
    //视频开始的公共方法
    var vdplay = null;
    //视频正在播放的公共方法
    var vdplaying = null;
    //视频暂停的公共方法
    var vdpause = null;
    //视频结束的公共方法
    var vdended = null;
    //----解决重复监听end----


    //单节长度
    //document.getElementsByClassName("page-list")[0].getElementsByClassName("page-item").length;

    //运行提示
    console.log("启动成功");

    //------检查播放进度start-----
    function begin(){
        if(document.getElementsByTagName("video")[1] == null){
            console.log("yjc：等待视频加载！");
        }else{
            var vdo = document.getElementsByTagName("video");
            console.log("yjc:",vdo);
            //获取当前视频进度
            var a = parseInt(document.getElementsByClassName("water")[0].getAttribute("style").substring(8));
            if(a < 100){
                console.log("当前进度："+a+"%");
                //首次点击播放
                setTimeout(function(){
                    document.getElementsByClassName("mejs__overlay-button")[0].click();
                },3000);
                //关闭计时器
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
                    if(document.getElementsByTagName("video")[1] == null){
                        //首次进入习题页，试探一次
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
    //------检查播放进度end-----


    //------脚本主程序start------
    function execute(){
        //当前页面类型
        if(document.getElementsByTagName("video")[1] == null){
            console.log("yjc：当前不在视频页！");
        }else{
            //获取视频id
            vd = document.getElementsByTagName("video")[0].id;
            //打印当前视频id
            console.log("yjc:",vd);
            //获取播放器组件
            elevideo = document.getElementById(vd);


            //-----如果全局变量不为空，需要移除start---
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
            //-----如果全局变量不为空，需要移除end---


            //-----为对应公共方法重新赋值start------
            vdplay = function(){
                console.log("yjc:开始播放");
            };
            vdplaying = function(){
                console.log("yjc:正在播放");
            };
            vdpause = function(){
                console.log("yjc:暂停播放");
                //判断是否为挂机提醒
                if(document.getElementsByClassName("btn-submit")[0] != null){
                    setTimeout(function (){
                        console.log("等待响应挂机监测");
                        document.getElementsByClassName("btn-submit")[0].click();
                        //睡眠结束后继续学习
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
                //执行定时器跳转下一个视频
                setTimeout(function (){
                    document.getElementsByClassName("operating-area active")[0].getElementsByClassName("next-page-btn cursor")[0].click();
                    //睡眠后播放
                    setTimeout(function (){
                        if(document.getElementsByTagName("video")[1] == null){
                            //首次进入习题页，试探一次
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
                                        }, 5000);
                                    }else{
                                        //进入下一节，继续播放
                                        setTimeout(function (){
                                            console.log("yjc：进入下一节，继续播放");
                                            document.getElementsByClassName("mejs__overlay-button")[0].click();
                                        }, 5000);
                                    }
                                }, 6000);
                            }, 3000);
                        }else{
                            //继续播放
                            document.getElementsByClassName("mejs__overlay-button")[0].click();
                        }
                    }, 5000);
                }, 3000);
            };
            //-----为对应公共方法重新赋值end------


            //-----添加监听start-----
            elevideo.addEventListener('play',vdplay);
            elevideo.addEventListener('playing',vdplaying);
            elevideo.addEventListener('pause',vdpause);
            elevideo.addEventListener('ended',vdended);
            //-----添加监听end-----
        }
    }
    var timer2 = setInterval(execute,5000);
    //------脚本主程序end------
})();