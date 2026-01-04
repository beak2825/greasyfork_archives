// ==UserScript==
// @name         河南理工大学刷课
// @namespace    http://addi.ren/
// @version      0.1
// @description  没什么好说明的!
// @author       Null  QQ:50711698
// @match        https://online.enetedu.com/hpu/SchoolCourse/Process?course_id=*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/393210/%E6%B2%B3%E5%8D%97%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/393210/%E6%B2%B3%E5%8D%97%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('click', function(event) {
        console.log(event.target.innerText);
       if (event.target.innerText=="帮助中心"){
           function mp(course_id,courseware_id,student_id,sTime){
               GM.xmlHttpRequest({
                   method: "GET",
                   url: "https://online.enetedu.com/hpu/VideoPlay/IndexNew?0&"+course_id+"&"+courseware_id+"&"+is_elective+"&"+student_id+"&timestamp="+sTime,
                   onload: function(response) {
                       //console.log("https://online.enetedu.com/hpu/VideoPlay/IndexNew?0&"+course_id+"&"+courseware_id+"&"+is_elective+"&"+student_id+"&timestamp="+sTime);
                       var iid=response.responseText.match(/iid='.*?'/)[0].replace(/'/g,'').replace(/iid=/,'');
                       GM.xmlHttpRequest({
                           method: "GET",
                           url: "http://hapi.enetedu.com/hep/list/"+iid+"?dl_link",
                           onload: function(response) {
                               var nUrl=response.responseText.match(/http.*?record\.xml/g)[0];
                               nUrl = nUrl.replace(/record\.xml/g,"hi/record.xml")
                               GM.xmlHttpRequest({
                                   method: "GET",
                                   url: nUrl,
                                   onload: function(response) {
                                       var duration=response.responseText.match(/duration="\d+\./g)[0].replace(/"/g,'').replace(/\./g,'').replace(/duration=/,'');
                                       var Purl="https://online.enetedu.com/hpu/VideoPlay/StudyRecode?"+student_id+"&"+course_id+"&"+courseware_id+"&"+is_elective+"&timestamp="+sTime+"&end="+duration+"&start=0"
                                       //console.log(Purl);
                                       GM.xmlHttpRequest({
                                           method: "GET",
                                           url: Purl,
                                           headers: {
                                               "Host":"online.enetedu.com",
                                               "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36",
                                               "Referer":window.location.url,
                                               "X-Requested-With": "ShockwaveFlash/29.0.0.171"
                                           },
                                           onload: function(response) {
                                               console.log(response.status);
                                               if (response.status == 200) {
                                                   console.log(courseware_id+" 刷课完成.");
                                               } else {
                                                   alert(courseware_id+" 网络错误,刷课失败.");
                                               }
                                           }
                                       });
                                   }
                               });
                           }
                       });
                   }
               });
           };
           var html=document.documentElement.outerHTML;
           var student_id,course_id,courseware_id,is_elective,sTime;
           student_id = html.match(/student_id=\d+/g)[0];
           course_id=html.match(/course_id=\d+/g)[0];
           courseware_id=html.match(/courseware_id=\d+/g);
           is_elective=html.match(/is_elective=\d+/g)[0];
           for (var i=1;i<courseware_id.length;i++){
               sTime=Math.round(new Date());
               //var url ="https://online.enetedu.com/hpu/VideoPlay/IndexNew?0&"+course_id+"&"+courseware_id[i]+"&"+is_elective+"&"+student_id+"&timestamp="+sTime
               mp(course_id,courseware_id[i],student_id,sTime);
           };
           alert("本页所有课程刷课完成,请刷新后查看课程进度.");
           event.stopPropagation();
           event.preventDefault();
       };
    }, true);

})();
