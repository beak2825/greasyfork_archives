// ==UserScript==
// @name 灯塔在线
// @namespace    **************
// @version      1.12
// @match        *.dtdjzx.gov.cn/course/special/*
// @match        *.dtdjzx.gov.cn/*
// @author      lute
// @description 山东党员网络学院在线挂机学习脚本
// @run-at       document-start
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/417745/%E7%81%AF%E5%A1%94%E5%9C%A8%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/417745/%E7%81%AF%E5%A1%94%E5%9C%A8%E7%BA%BF.meta.js
// ==/UserScript==
(function() {
    'use strict';
/*---------------------------------------------------------
描述:   灯塔党员网络学院学习
根据郭的脚本山东gb网络学院视频学习  改写
安装脚本进入课程资源页面后 刷新页面脚本自动执行
----------------------------------------------------------*/
/***********************  公共  ***************************/
/*---------------------------------------------------------
名称:   Env
描述:   环境变量
实现:   通过vue实例 获取数据 ,在调度中update
记录:   2024-5-15 完成编写
----------------------------------------------------------*/
const Env = {
    app: document.querySelector('.resource')?.__vue__||document.querySelector('.main_main')?.__vue__,
    timeTable: undefined,
    handl: null,
    autoExam:true,
    get name() {
        //页面名称,用于识别所在页面,在网址中有出现
        return this.app?.$route?.name;
    },
    get courseCount() {
        //课表的总课数
        return this.fit({
            'course-resources': this.app?.holdList.length
        })
    },
    get courseList() {
        //课表id
        return this.app?.holdList
    },
    get idCardHash() {
        //用户idcardhash
        return this.app?.userInfo?.idCardHash;
    },    
    fit(obj) {
        //根据不用的业务返回值
        var result = obj[this.name];
        this.validate(result);
        return result;
    },
    validate(result) {
        //在验证值为undefined的时候警告,调试用
        if (result == undefined) console.warn("读取值失败,可能本页无该值,页面--", this.name);
    },
    update() {
        //更新vue实例
        this.app = document.querySelector('.resource')?.__vue__||document.querySelector('.main_main')?.__vue__;
        this.timeTable = undefined;
        clearInterval(this?.timerId);
    }
}
/*---------------------------------------------------------
函数名: showMsg
描述:   在右侧栏展示信息，最多5条
记录:
----------------------------------------------------------*/
function showMsg(msg, type = 'msg') {
    if (window.monkeydata == undefined) {
        console.error('alpinejs存在错误');
        return;
    }
    if (type == 'msg') {
        window.monkeydata.message = msg;
    } else {
        window.monkeydata.tip = msg;
    }

}
/***********************  初始化 *****************************/
/*---------------------------------------------------------
函数名: initEnv
描述:   入口:初始化环境
        1.关联【策略】与【路径】
            ** vue改变hash打开新页面,不会重新加载脚本,需监听
        2.改造显示面板
            ** 右侧浮动栏变成显示面板
            ** 使用了Alpinejs
        3.Alpinejs 加载完后执行 策略
记录:
----------------------------------------------------------*/
(function initEnv() {

    //let panelNode = document.querySelector('.right-fixed-wrap');
    let panelNode = document.querySelector('.bottom')||document.querySelector('.title-r');
    console.log('脚本......准备');
    if (!panelNode) {
        console.log('页面还未准备好...1s后再试');
        setTimeout(initEnv, 1000);
        return;
    }

	console.log('脚本......开始');

    //监听页面变化
    //panelNode.__vue__.$router.afterHooks.push(routerHook);
    console.log('路径钩子......ok');

    //改造面板
    panelNode.style.cssText += "width:250px";

    panelNode.outerHTML = `
        <ul x-data="{message:'hh',tip:''}" x-init="window.monkeydata=$data">
        <li x-text="message" style="font-size:14px"></li>
        <li x-text="tip" style="font-size:18px"></li>
        </ul>`;
    //注入Alpinejs
    let scriptNode = document.createElement('script');
    scriptNode.src = "https://unpkg.com/alpinejs@3.10.3/dist/cdn.min.js";
    scriptNode.defer = true;
    document.head.appendChild(scriptNode);
    console.log('信息面板......准备');
    document.addEventListener('alpine:initialized', function () {
        console.log('信息面板......ok');
        showMsg('脚本.....ok');
        routerHook();
    });
})();
/***********************  调度  *****************************/
/*---------------------------------------------------------
函数名: strategies
描述:   策略,根据所处页面做出动作，与路径hash相关
记录:
----------------------------------------------------------*/
function strategies() {
    Env.update();
    console.log(Env.name);
    switch (Env.name) {
        case 'projectDetail':
             break;
        //课程资源目录
        case 'course-resources':
            showMsg('course-resources');
            timeTableHook();
            getCourseList().then(makeTablenew);
            break;
        case 'course-detail':
            //课程页
            xq();
            break;
        default:
            console.log('课程资源目录');
            showMsg('课程资源目录');
    }
}
/*---------------------------------------------------------
函数名: routerHook
描述:   路径变化时调用策略
        需延时等待页面加载完成
记录:
----------------------------------------------------------*/
function routerHook() {
    setTimeout(strategies, 5000);
}
/*---------------------------------------------------------
函数名: timeTableHook
描述:   课表准备好 且 无打开的课程 打开下一课
记录:
----------------------------------------------------------*/
    function timeTableHook() {
        console.log(Env.timeTable);
        Env.timerId = setInterval(() => {
            if (!Env.timeTable) return; //无有效课表
            if (Env.handl?.closed == false) return; //正在播放

            var c = Env.timeTable.next();
            if (c.done) {
                console.log('全学完 点击下一页');
                document.querySelector('.btn-next').click();
                Env.update();
                routerHook();
                return;} //全学完 点击下一页
            Env.handl = window.open(c.value);
        }, 2000);
    }
/***********************  课程  *****************************/
/*---------------------------------------------------------
函数名: getCourseList
描述:   获取全部课程
记录:
----------------------------------------------------------*/
    function getCourseList() {
        console.log('获取课程......');
        showMsg('获取课表......')
        //读取全部课程
        return new Promise((resolve, reject) => {
            try {
                resolve(Env.courseList);
            } catch (error) {
                reject(error);
            }
        });
    }
    /*---------------------------------------------------------
函数名: makeTablenew
描述:   制作课表,挂到window，以便学习
        Env.timeTable.next()是学习下一课
记录:
----------------------------------------------------------*/
function makeTablenew(res) {
    console.log('课表.......ok',res);
    showMsg('课表......ok');
    Env.timeTable = {
        courseList: res,
        //courseLiscoursedetailURL:res.datalist,
        index: 0,
        next() {
            var done = this.index >= this.courseList.length;
            showMsg(`第__${this.index+1}__课...共__${this.courseList.length}__课`,'info');
            if (done) {
                console.warn('没有下一课了');
                return { done: true, value: undefined };
            }
            var course = this.courseList[this.index++];
            console.log('准备......', course.courseName);
            showMsg(course.courseName);
                      //跳过已学习
            if (course.studyStatus==2) { return this.next(); }
            else return { done: false, value: "https://dywlxy.dtdjzx.gov.cn/course-resources/course/course-detail?id="+course.id };
        }
    }
}

/***********************  播放  *****************************/
let sleep = function (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
};

/*---------------------------------------------------------
函数名: xq
描述:   单课学习
----------------------------------------------------------*/
       function xq() {
    console.log('学习中...');
    showMsg('准备学习......');
    //自动播放
    var video = document.querySelector('video');
    //确保成功
    if (!video) {
        setTimeout(xq, 2000);
        return;
    }
    video.muted = true;//自动播放需静音
    video.play();
    showMsg('学习中......');
    setTimeout(video.volume=1, 2000);
    video.muted = false
    console.log('视频音量',video.volume);
    video.addEventListener('pause',function(){
        console.log('视频暂停...');
        video.play();
    })
    video.addEventListener('ended',function(){
        console.log('视频结束...');
        sleep(10000).then(() => {window.close()});
    })
}

})();