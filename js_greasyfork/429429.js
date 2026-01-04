// ==UserScript==
// @name         网上学院-学时助手
// @namespace    none
// @version      2.3
// @description  学时刷不完？  使用Edge/Firefox 安装TamperMonkey扩展，使用本插件即可。本插件是按专区刷课的，需要刷其他专区的把shuakeURL 参数改成要刷的专区网址。
// @author       WenYichong
// @license      MIT
// @match        http://wsxy.chinaunicom.cn/learner/*

// @grant        none
// @run-at       document-end
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/429429/%E7%BD%91%E4%B8%8A%E5%AD%A6%E9%99%A2-%E5%AD%A6%E6%97%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/429429/%E7%BD%91%E4%B8%8A%E5%AD%A6%E9%99%A2-%E5%AD%A6%E6%97%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//替换成要刷的专区网址
//let shuakeURL = "http://wsxy.chinaunicom.cn/learner/subject/49659088/detail"; //政企专区
//let shuakeURL = "http://wsxy.chinaunicom.cn/learner/subject/49668818/detail"; //"数字菁英”培训专区
//let shuakeURL = "http://wsxy.chinaunicom.cn/learner/subject/49677863/detail"; //联通云
let shuakeURL = "http://wsxy.chinaunicom.cn/learner/subject/49685873/detail"; //数字政府



/**
 * 课程列表 选择课程
 */
function seleCourse(type) {

    if(type === '未学习'){
        document.getElementsByClassName('right')[1].getElementsByTagName('span')[1].click()//未学习
    }else if(type ==='未完成'){
        document.getElementsByClassName('right')[1].getElementsByTagName('span')[3].click()//未完成
    }

    setTimeout(() => {
        let nums = document.getElementsByClassName('single-course').length
        if(nums === 0){
            seleCourse('未完成')
            return
        }
        let selNum = 0
        if(nums > 1){
            selNum = parseInt(Math.random()*(nums-0+1)+0,10) //随机选择列表课程
        }
        document.getElementsByClassName('single-course')[selNum].getElementsByTagName('a')[0].click() //选择第一个课程进入
    }, 2000)

}

let jindu=0
/*
详情页面操作
*/
function detailOp() {
    setTimeout(() => {
        let jd = document.getElementsByClassName('ant-progress-text')[0].textContent //进度
        jindu = parseInt(jd.replace('%',''))
        //document.getElementsByClassName('course-button')[0].click() //开始学习
        document.getElementsByClassName('course-button ant-btn ant-btn-default')[0].click()//开始学习

    }, 3000)


    setTimeout(() => {

        palylOp();

    }, 6000)
};

/*
播放页面操作
*/
function palylOp() {
    var items = document.getElementsByClassName('title')
    var num = items.length;
    console.log('视频数', num);

    let vdoc = document.getElementsByTagName('iframe')[0].contentDocument //播放器iframe
    let vP = vdoc.getElementsByTagName('video')[0] //播放器
    vP.muted = true //静音
    vP.play() //播放
    vP.currentTime = vP.duration * (jindu/100) //设置视频进度

    let nowTime = 0
    setInterval(() => {
        //vP.playbackRate = 1 //倍速好像无用
        let nowItem = document.getElementsByClassName('course-single clearfix active-s')[0]
        if (nowItem.getElementsByClassName('title')[0].textContent === items[num - 1].textContent) {
            //播放最后一个视频;
            if (vP.ended || vP.duration === vP.currentTime) {
                window.open(shuakeURL, '_self');
            }
        }

        //时间刷完，或者未走动
        if (vP.currentTime === nowTime) {
            window.open(shuakeURL, '_self');
        }
        nowTime = vP.currentTime //记录当前播放时间，如果10秒钟之后没有改变，则视频播放完或者卡死
        console.log('进度:', nowItem.getElementsByClassName('title')[0].textContent, '-->', vP.currentTime / 60, '/', vP.duration)
        document.getElementsByClassName('save-logout-box ant-btn ant-btn-primary')[0].click()//保存学习记录

    }, 20000);


}

(function () {
    window.onload = function () {

        var currentURL = window.location.href; // 获取当前网页地址

        console.log('当前网页', currentURL);
        console.log(new Date())
        if (currentURL.endsWith('learner/home')) {
            console.log('首页');

        }
        else if (currentURL.endsWith('/detail')) {
            console.log('列表');
            setTimeout(() => {
                seleCourse('未学习'); // 选择课程
               // seleCourse('未完成'); // 选择课程


            }, 1000)

        }
        else if (currentURL.endsWith('learner/subject')) {
            console.log('专题栏');

            window.open(shuakeURL, '_self'); //培训专区

        }
        else if (currentURL.indexOf('course/detail') > 0) {
            console.log('详情');

            detailOp();
        }
        else if (currentURL.endsWith('play/course')) {
            console.log('播放');
            palylOp();
        }

    };
    window.setTimeout(() => {


    }, 1500);


})();