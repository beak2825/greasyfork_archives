// ==UserScript==
// @name         行知学徒自动网课；计算机和办公设备维修人员等
// @namespace    http://ccvxx.cn/
// @version      0.2
// @description  突如其来的计算机和办公设备维修人员等课程
// @author       原创妖火@Past°   @术の語、涼城啥都没干全程观看
// @match        *://www.ixueto.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401706/%E8%A1%8C%E7%9F%A5%E5%AD%A6%E5%BE%92%E8%87%AA%E5%8A%A8%E7%BD%91%E8%AF%BE%EF%BC%9B%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%92%8C%E5%8A%9E%E5%85%AC%E8%AE%BE%E5%A4%87%E7%BB%B4%E4%BF%AE%E4%BA%BA%E5%91%98%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/401706/%E8%A1%8C%E7%9F%A5%E5%AD%A6%E5%BE%92%E8%87%AA%E5%8A%A8%E7%BD%91%E8%AF%BE%EF%BC%9B%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%92%8C%E5%8A%9E%E5%85%AC%E8%AE%BE%E5%A4%87%E7%BB%B4%E4%BF%AE%E4%BA%BA%E5%91%98%E7%AD%89.meta.js
// ==/UserScript==
  
(function() {
    'use strict';
let autoNext = function(){
  
        //获取提示信息
        let timeStr = $("#s_message").html();
  
        //如果已经学完,直接下一集
        if (timeStr == '本课时已学完') {
                fun_nextLesson();
                return;
        }
  
  
        //获取已学习时长
  
        //1.开始位置,结束位置
        let startKey = '已学习：';
        let endKey = '秒';
        let startPos = timeStr.indexOf(startKey)+startKey.length;
        let endPos = timeStr.indexOf(endKey);
        //2.截取时长
        let alreadySeconds = timeStr.substring(startPos,endPos);
  
  
        //获取总学习时长
  
        //1.开始位置,结束位置
        let startKey2 = '总时长：';
        let endKey2 = '秒';
        let startPos2 = timeStr.indexOf(startKey2)+startKey2.length;
        let endPos2 = timeStr.indexOf(endKey2, timeStr.indexOf(endKey2)+1);
        //2.截取时长
        let sumSeconds = timeStr.substring(startPos2,endPos2);
  
  
        //判断两个时长是否相等
        if (alreadySeconds == sumSeconds) {
                //如果相等,那就点击下一课
                //不用点击按钮了,因为直接有个下一级的函数,执行就行
                javascript:fun_nextLesson();
        } else {
                console.log('时间还没到');
                console.log(timeStr);
        }
}
  
  
setInterval(autoNext, 10000); //每10000ms执行一次判断函数
    // Your code here...
})();