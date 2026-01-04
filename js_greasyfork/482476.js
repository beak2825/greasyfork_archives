// ==UserScript==
// @name         河南理工大学教务系统抢课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动抢课
// @author       respect-H
// @include      https://zhjw.hpu.edu.cn/*
// @icon         https://h5.cyol.com/special/daxuexi/ck6hfr2g0y/images/loading.gif
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482476/%E6%B2%B3%E5%8D%97%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/482476/%E6%B2%B3%E5%8D%97%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==
// 喜欢就点个赞吧，QQ：2140463102

(function() {
    'use strict';
 setTimeout(()=>{
    document.querySelector('a[href="/eams/stdElectCourse.action"]').click();
      },3000)   //延时可自行调整，尽量不要太小，因为教务系统卡
 setTimeout(()=>{
   document.querySelector('a[target="elect_page"]').click();
      },6000)   //延时可自行调整，尽量不要太小，因为教务系统卡
// 课程列表
var courseList = ["大学英语听说译", "高分子材料的环境影响与循环利用","空气调节与净化", "其他课程1", /* 添加更多课程 */];    //此处填写你想选择的课程名称，不要写错!!!


function findTdElementByText(text) {
    var tdElements = document.querySelectorAll('td');
    for (var i = 0; i < tdElements.length; i++) {
        if (tdElements[i].innerText.includes(text)) {
            return tdElements[i];
        }
    }
    return null;
}


function findSelectCourseLink() {
    var targetText = "选课";
    var tdElement = findTdElementByText(targetText);
    if (tdElement) {
        return tdElement.querySelector('a[operator="ELECTION"]');
    }
    return null;
}


function clickSelectCourse() {
    var selectCourseLink = findSelectCourseLink();
    if (selectCourseLink) {
        
        var originalConfirm = window.confirm;

        
        window.confirm = function () {
            return true;
        };

        
        courseList.forEach(function (course, index) {
            
            selectCourseLink.click();
            console.log("选择课程：" + course);

            
            setTimeout(function () {
                location.reload();
            }, (index + 1) * 3000); // 设置延时，当前设置为每3秒刷新一次，你可以根据实际情况调整,太快会被提示，但是其实没啥影响！

        });

        
        window.confirm = originalConfirm;
    } else {
        console.error("未找到对应的课程名称，请重新填写！！");
    }
}

clickSelectCourse();
})();