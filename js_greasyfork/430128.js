// ==UserScript==
// @name         山东省菏泽市继续教育
// @namespace    http://hzzj.zhenghe.cn
// @version      0.1.3
// @description  秒刷公需课，专业课,【菏泽职业学院】 专技平台2017-2020年补学补考已开放，截止时间为2021年8月31日，逾期关闭补学补考通道，请各位学员合理安排时间，尽快完成继续教育学习。
// @author       星星课
// @match        http://hzzj.zhenghe.cn/course/courseDetails.html?id=*&type=*
// @icon         http://jxjycdn.shunjy.com:91/img/icons/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430128/%E5%B1%B1%E4%B8%9C%E7%9C%81%E8%8F%8F%E6%B3%BD%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/430128/%E5%B1%B1%E4%B8%9C%E7%9C%81%E8%8F%8F%E6%B3%BD%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==
//获取url中的参数

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
(function() {
    'use strict';
    for(var i=0;i<videoList.length;i+=1){
        var video_info=videoList[i];
        var video_id=video_info.baseid;
        var video_duration=video_info.videoduration;
        var course_id=getUrlParam("id");
        var   title=video_info.title;
        var  data={
            videoId:video_id,
            watchedduration:parseInt( video_duration),
            courseId:course_id
        }
        alert("参数提取完毕："+JSON.stringify(data));
    }
    


})();