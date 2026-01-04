// ==UserScript==
// @name        肇庆网络学院刷课 
// @namespace   Violentmonkey Scripts
// @match       https://gbpx.gd.gov.cn/zq/*
// @description 此脚本适用于广东省干部培训网络学院（gbpx.gd.gov.cn）肇庆专区的专题课程学习，在专题课程页面会自动运行，如页面没有反应，可以尝试F5刷新。
// @grant       none
// @version     1.1.1
// @author      沉睡森林
// @description 2021/8/26 下午9:01:59
// @downloadURL https://update.greasyfork.org/scripts/431693/%E8%82%87%E5%BA%86%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/431693/%E8%82%87%E5%BA%86%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==



//挂机学习间隔时间
var atime = 1000 * 60 * 10;

//刷课函数：查找页面“未完成”，进行点击
function shuake() {
    var i;
    //第一行是表头，所以从第二行开始找
    for (i = 0; i < document.getElementsByClassName("details_main").length; i++) {
        var jindu = document.getElementsByClassName("details_main")[i].getElementsByTagName("span")[4].innerText;
        //console.log(jindu);   
        if (jindu.indexOf("未完成") != -1) {
            document.getElementsByClassName("details_main")[i].getElementsByTagName("span")[0].click();
            console.log("进入未完成课程");
            return;
        }
    }
    console.log("已完成全部课程！");
    return;
}

//等待函数
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

sleep(1000).then(() => {
    //列表页面
    if (window.location.href.indexOf("classList/details?") != -1) {
        console.log("课程列表");
        shuake();
    }
})

sleep(2000).then(() => {
    //视频页面
    if (window.location.href.indexOf("classList/live?") != -1) {
        console.log("视频页面");
        var tishi = document.getElementsByClassName("el-drawer rtl")[0].getElementsByTagName("span")[2].innerText;
        //console.log(tishi);
        if (tishi.indexOf("好的") != -1) {
            document.getElementsByClassName("el-drawer rtl")[0].getElementsByTagName("span")[2].click();
        }
    }
})

sleep(10000).then(() => {
    if (document.getElementsByClassName("vcp-bigplay")[0] != null) {
        console.log("暂停播放");
        document.getElementsByClassName("vcp-bigplay")[0].click();
    }
})

sleep(atime).then(() => {
    if (document.getElementsByClassName("el-button instructions-close el-button--default")[0] != null) {
        console.log("关闭视频");
        document.getElementsByClassName("el-button instructions-close el-button--default")[0].click();
    }
})

sleep(atime + 2000).then(() => {
    console.log("重新加载执行");
    window.location.reload();
})



