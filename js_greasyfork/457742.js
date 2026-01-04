// ==UserScript==
// @name         地大网络教育-自动刷视频
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  用自己的学号和密码登录 http://jiaoxue.cugbonline.cn
// @author       cgj
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @match        http://jiaoxue.cugbonline.cn/meol/index.do
// @match        http://jiaoxue.cugbonline.cn/meol/personal.do?menuId=*
// @match        http://jiaoxue.cugbonline.cn/meol/lesson/blen.student.lesson.list.jsp
// @match        http://jiaoxue.cugbonline.cn/meol/jpk/course/layout/newpage/index.jsp?courseId=*
// @match        http://jiaoxue.cugbonline.cn/meol/jpk/course/layout/newpage_dz/index.jsp?courseId=*
// @match        http://jiaoxue.cugbonline.cn/meol/microlessonunit/previewListCourseStructure.do?courseId=*
// @match        http://jiaoxue.cugbonline.cn/meol/microlessonunit/viewMicroLessnMulti.do?courseId=*
// @match        http://jiaoxue.cugbonline.cn/meol/*
// @icon         http://tampermonkey.net/favicon.ico
// @grant        none
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @grant window.onurlchange
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/457742/%E5%9C%B0%E5%A4%A7%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2-%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/457742/%E5%9C%B0%E5%A4%A7%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2-%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.onload = function () {
        var currentUrl = window.location.href;
        console.info(currentUrl);
        
        //重写alert
        var _alert =window.alert;
        window.alert = function () {
            console.log(arguments);
            console.info("alert : " + currentUrl);
            // _alert(arguments);
        };
        
        if (currentUrl.indexOf('meol/index.do') > -1) {
            //看看是否登录
            let loginbtn = $('#loginbtn');
            if (!loginbtn || loginbtn.length === 0) {
                loginbtn.click();
            } else {
                window.open('http://jiaoxue.cugbonline.cn/meol/personal.do?menuId=0','_self');
            }



        } else if (currentUrl.indexOf('meol/personal.do') > -1) {
            window.open('http://jiaoxue.cugbonline.cn/meol/lesson/blen.student.lesson.list.jsp','_self');
        } else if (currentUrl.indexOf('meol/lesson/blen.student.lesson.list.jsp') > -1 ) {
            var courseList = $('#table2 > tbody > tr > td:nth-child(2) > a');
            if (courseList && courseList.length > 0) {
                for (let i = 0; i < courseList.length; i++) {
                    courseList[i].click();
                }
            }
        } else if (currentUrl.indexOf('meol/jpk/course/layout/newpage_dz/index.jsp') > -1) {
            // $('a[title="播课单元"]');
            var courseId = currentUrl.split('courseId=')[1];
            window.open(
                'http://jiaoxue.cugbonline.cn/meol/microlessonunit/previewListCourseStructure.do?courseId=' + courseId,
                '_self');
        } else if (currentUrl.indexOf('meol/microlessonunit/previewListCourseStructure.do') > -1) {
            //某一科目视频章节列表
            // $('a[title="播课单元"]');
            var alist = $('body > div > form > table > tbody > tr > td.align_c > a');
            if (alist && alist.length > 0) {
                for (let i = 0; i < alist.length; i++) {
                    //测了一下，播放视频页面只能同时打开播放6个，之后新开的页面会加载不出视频
                    if (i < 6) {
                        alist[i].click();
                    } else {
                        //30分钟之后，再打开剩余的课程视频页面
                        setTimeout(function () {
                            alist[i].click();
                        }, 30 * 60 * 1000);
                    }
                }
            }
        } else if (currentUrl.indexOf('meol/microlessonunit/viewMicroLessnMulti.do') > -1) {
            //最终视频合集，有选项卡的
            var tabs = $('#descrip > li > a');
            if (tabs && tabs.length > 0) {

                recursionPlayVideo(arrayToList(tabs));
                
                /*
                for (let i = 0; i < tabs.length; i++) {
                    tabs[i].click();
                    var videoJq = $('#video > div > video');
                    if (videoJq) {
                        videoJq.click();
                        var videoEle = videoJq[0];
                        var videoTime = videoEle.duration;

                        videoEle.addEventListener('loadedmetadata',  () => { 
                            //视频的总长度    
                            console.log(video.duration);  
                        })
                        $('#video > div > video')[0].addEventListener('loadedmetadata',  () => { 
                            //视频的总长度    
                            debugger;
                            console.log(arguments);  
                        })
                        
                        
                        videoEle.volume = 0.1;
                        waiting(videoTime + 10);
                    }
                }
                */
            }
        } else if (currentUrl.indexOf('meol/microlessonunit/LessonUnitSingle.do') > -1) {
            let currentNo = $('#descrip > li > a', parent.document).length - 2;
            var tabs = $('#descrips > li:gt(' + currentNo + ')')
            if (tabs && tabs.length > 0) {
                recursionPlayVideo(arrayToList(tabs));
            }
            
        } else {
            console.warn('脚本没有匹配上');
        }

    };


/*
    function showResAct(index) {
        if (index > 0 && index < resActIds.length) {
            _currentResActId = resActIds[index];
            $("#descrip").val(index);
            window.parent.showResAct(resActIds[index], forumIds[index],index,threadIds[index]);
        }
        _index = index;
    }
    function changeblock(obj) {
        showResAct(obj);
        parent.jq.fancybox.close();
    }
    
			内部函数
			发送播放器加载成功的消息
    playerLoad: function() {
        var thisTemp = this;
        if (this.isFirst) {
            this.isFirst = false;
            setTimeout(function() {
                thisTemp.loadedHandler();
            },1);
        }
    },
			下面为监听事件
			内部函数
			监听元数据已加载
    loadedHandler: function() {
        this.loaded = true;
        if (this.vars['loaded'] != '') {
            try {
                eval(this.vars['loaded'] + '(\''+this.vars['variable']+'\')');
            } catch(event) {
                this.log(event);
            }
        }
    },
    
    
			共用函数
			计时器,该函数模拟as3中的timer原理
			time:计时时间,单位:毫秒
			fun:接受函数
			number:运行次数,不设置则无限运行
    timer: function(time, fun, number) {
        var thisTemp = this;
        this.time = 10; //运行间隔
        this.fun = null; //监听函数
        this.timeObj = null; //setInterval对象
        this.number = 0; //已运行次数
        this.numberTotal = null; //总至需要次数
        this.runing = false; //当前状态
        this.startFun = function() {
            thisTemp.number++;
            thisTemp.fun();
            if (thisTemp.numberTotal != null && thisTemp.number >= thisTemp.numberTotal) {
                thisTemp.stop();
            }
        };
        this.start = function() {
            if (!thisTemp.runing) {
                thisTemp.runing = true;
                thisTemp.timeObj = window.setInterval(thisTemp.startFun, time);
            }
        };
        this.stop = function() {
            if (thisTemp.runing) {
                thisTemp.runing = false;
                window.clearInterval(thisTemp.timeObj);
                thisTemp.timeObj = null;
            }
        };
        if (time) {
            this.time = time;
        }
        if (fun) {
            this.fun = fun;
        }
        if (number) {
            this.numberTotal = number;
        }
        this.start();
    },
    
    
			内部函数
			监听是否是缓冲状态
    bufferEdHandler: function() {
        if (!this.conBarShow || this.playerType == 'flashplayer') {
            return;
        }
        var thisTemp = this;
        var clearTimerBuffer = function() {
            if (thisTemp.timerBuffer != null) {
                if (thisTemp.timerBuffer.runing) {
                    thisTemp.sendJS('buffer', 100);
                    thisTemp.timerBuffer.stop();
                }
                thisTemp.timerBuffer = null;
            }
        };
        clearTimerBuffer();
        var bufferFun = function() {
            if (!thisTemp.isUndefined(thisTemp.V) && thisTemp.V.buffered.length > 0) {
                var duration = thisTemp.V.duration;
                var len = thisTemp.V.buffered.length;
                var bufferStart = thisTemp.V.buffered.start(len - 1);
                var bufferEnd = thisTemp.V.buffered.end(len - 1);
                var loadTime = bufferStart + bufferEnd;
                var loadProgressBgW = thisTemp.CB['timeProgressBg'].offsetWidth;
                var timeButtonW = thisTemp.CB['timeButton'].offsetWidth;
                var loadW = parseInt((loadTime * loadProgressBgW / duration) + timeButtonW);
                if (loadW >= loadProgressBgW) {
                    loadW = loadProgressBgW;
                    clearTimerBuffer();
                }
                thisTemp.changeLoad(loadTime);
            }
        };
        this.timerBuffer = new this.timer(200, bufferFun);
    },
    
    http://jiaoxue.cugbonline.cn/meol/microlessonunit/viewMicroLessnMulti.do?courseId=12919&mluId=91173&ustats=unit&tagbug=
    
    */

    // Your code here...
})();

//递归同步播放视频
function recursionPlayVideo(tabEle) {
    //eval(tabEle.val.getAttribute("onclick"));
    //尝试先获取video元素 试试
    let videoJq = $('#video > div > video');
    videoJq = videoJq.length > 0 ? videoJq : $('#video > div > video', window.top.document); 
    tabEle.val.click();
    // this.addListenerInside('mousemove', cdMove, thisTemp.CD);
    // let videoJq = $('#video > div > video');
    // if(typeof player!="undefined"){
    if (videoJq && videoJq.length > 0) {
        /*
        player.addListener('buffer', function (buffer) {
            console.info("buffer - " + buffer);
            setTimeout(function () {
                player.changeVolume(0.1);
                // $('video').attr("muted","muted");
                $('video').prop("muted","muted");
                player.changeControlBarShow(true);
                player.videoPlay();
            }, 5000);
        }); 
        */
        player.addListener('loadedmetadata', function () {
            var metaData = player.getMetaDate();
            console.info('loadedmetadata - ', metaData);
            // $('video').attr("muted","muted");
            // player.changeVolume(0.1);
            // player.videoPlay();

            setTimeout(function () {
                player.changeVolume(0.1);
                // $('video').attr("muted","muted");
                $('video').prop("muted","muted");
                player.changeControlBarShow(true);
                player.videoPlay();
            }, 5000);
            
            
        });
        player.addListener('ended', function(){
            console.info('ended - ');
            let n = "";
            if (n = tabEle.next) {
                console.info('ended - next');
                recursionPlayVideo(n);
            } else {
                //最后一个选项卡视频播放完成之后关闭当前页面
                window.opener = null;
                window.open('', '_self');
                window.close();
            }
        });
        
        /*
        var videoEle = videoJq[0];
        videoEle.addEventListener('canplay',  () => {
            var videoTime = videoEle.duration;
            videoJq.click();
            videoEle.volume = 0.1;
            waiting(videoTime + 10);
            let n = "";
            if (n = tabEle.next) {
                recursionPlayVideo(n);
            }
        })
        */
    }
}

function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
}


function arrayToList(arr) {
    if (arr.length === 0) {
        return null;
    }
    const head = new ListNode(arr[0])
    let p = head
    for (let i = 1; i < arr.length; i++) {
        p = p.next = new ListNode(arr[i]);
    }
    return head;
}



async function waiting(t) {
    await waitSomeTime(t);
}


// 等待timeSpan毫秒后执行resolve方法，且不会阻塞js执行线程
async function waitSomeTime(timeSpan = 600) {
    return new Promise(resolve => {
        setTimeout(resolve, timeSpan);
    })
}

function randomClickMenu() {
    var study = $('a[title="课程学习"]');
    if (study && study.length > 0) {
        study.click();
        var ulEle = $('#menu > ul');
        if (ulEle && ulEle.length > 0) {
            var aEles = $(ulEle[0]).children().find('a');
            var aLen = aEles.length;

            console.info(aEles);
            console.info(aEles.length);
            console.info(aEles[2]);

            /*
        for (var i = 0; i < aLen; i++) {
            console.info(parseInt(aLen * Math.random()));
        }
        */

            setInterval(function(){
                aEles[(parseInt(aLen * Math.random()))].click();
            }, (10 + parseInt(5 * Math.random())) * 1000);


        }
    }

}


/*

let Chain=function (fn){
    this.fn=fn;
    this.successor=null;
};
// 指定在链中的下一个节点
Chain.prototype.setNextSuccessor=function (successor){
    return this.successor=successor;
};
//传递请求给某个节点
Chain.prototype.passRequest=function (){
    let ret=this.fn.apply(this,arguments);
    if (ret==="nextSuccessor"){
        return this.successor&&this.successor.passRequest.apply(this.successor,arguments);
    }
    return ret;
};

//把3个订单函数分别包装成责任链的节点
let chainOrder_500=new Chain(order_500);
let chainOrder_200=new Chain(order_200);
let chainOrder_Normal=new Chain(order_Normal);

//指定节点在责任链中的顺序
chainOrder_500.setNextSuccessor(chainOrder_200);
chainOrder_200.setNextSuccessor(chainOrder_Normal);

*/
