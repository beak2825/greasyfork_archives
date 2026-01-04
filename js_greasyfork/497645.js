// ==UserScript==
// @name         www.szgx.suzhou.gov.cn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  test
// @author       You
// @match        https://www.szgx.suzhou.gov.cn/frontend/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=suzhou.gov.cn
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497645/wwwszgxsuzhougovcn.user.js
// @updateURL https://update.greasyfork.org/scripts/497645/wwwszgxsuzhougovcn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


function check_openpop(){
var target = window.location.hash.substr(1).trim().split("/");

if (target[1] == "courseDetail"){
console.clear();
console.log(target);
var courseId = target[2];
var result = [];



               $.ajax({
                type: "GET",
                url: "/app/course/myCourse?pageSize=1000&pageNum=1",
                contentType: "application/json; charset=UTF-8",
                data: '',
                dataType: "json",
                success: function (data) {
                    if (data.code == 200) {
                        console.log("课程编号"+courseId+"学习开始");

                        for (let item of data.data.records){
                         if (item.id == courseId && item.courseStatus !==3){
                             result.push(item);
                             var learnDuration = result[0].duration;
                             console.log("课程时长",learnDuration);

                             for( var i = 60; i <= learnDuration ; i += 60 ){
                             saveLearningRecord(i);
                             }
                             alert('学习完了');

                         }
                        }
                        console.log("课程编号"+courseId+"学习结束");
                        window.location.href="https://www.szgx.suzhou.gov.cn/frontend/index.html#/studentArea";

                    }
                }
            });







        function saveLearningRecord(learnDuration) {
            $.ajax({
                type: "POST",
                url: "/app/course/saveCourseLearnRecord",
                contentType: "application/json; charset=UTF-8",
                //data: "{ courseId: 78, learnDuration: "+ learnDuration +" }",
                data: '{"data":{"courseId":'+ courseId +',"learnDuration":'+ learnDuration +'}}',
                dataType: "json",
                success: function (data) {
                    if (data.code == 200) {
                        //$("#shop").val(data.item.id);
                        //$("[name=shop_name]").val(data.item.name);
                    }
                }
            });
        }



}else{
//alert('请进入诸如/frontend/index.html#/courseDetail/的地址后刷新开始自动学习');
console.log("尚未到达指定网页");
//$('.tab')[1].click();
}
};
setInterval(check_openpop,1000);





})();