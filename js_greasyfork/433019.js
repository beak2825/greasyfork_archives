// ==UserScript==
// @name         广东省2.0学习脚本，每门课程自动完成！
// @namespace    https://greasyfork.org/
// @version      0.2
// @description  广东省2.0学习，进入其中一门课程，并进入学习列表页面后将自动进入学习页面，记录未达到100%的将自动学习！
// @author       You
// @match        https://study.enaea.edu.cn/viewerforccvideo.do*
// @match        https://study.enaea.edu.cn/circleIndexRedirect.do?action=toNewMyClass*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433019/%E5%B9%BF%E4%B8%9C%E7%9C%8120%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%EF%BC%8C%E6%AF%8F%E9%97%A8%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/433019/%E5%B9%BF%E4%B8%9C%E7%9C%8120%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%EF%BC%8C%E6%AF%8F%E9%97%A8%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i=0;
    var is_close_study_url="";
    var my_study_list = new Array();
    var study_n=0;
    window.onload=function(){
       if((window.location.href).substring(0,49)==='https://study.enaea.edu.cn/circleIndexRedirect.do')
        {
          var circleId=getQueryVariable("circleId");
          var syllabusId=getQueryVariable("syllabusId");
          var get_study_json_url="https://study.enaea.edu.cn/circleIndex.do?action=getMyClass&start=0&limit=100&isCompleted=&circleId="+circleId+"&syllabusId="+syllabusId+"&categoryRemark=all&"
          var httpRequest = new XMLHttpRequest();
          httpRequest.open('GET', get_study_json_url, true);
          httpRequest.send();
          httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var json = httpRequest.responseText;
                var arr=JSON.parse(json);
                var j=0;
                for(i=0;i<arr.result.list.length;i++){
                    var studyProgress=arr.result.list[i].studyCenterDTO.studyProgress;//courseId
                    var courseId= arr.result.list[i].studyCenterDTO.courseId;//courseId
                    if(studyProgress!=="100"){
                        var study_url_open="https://study.enaea.edu.cn/viewerforccvideo.do?courseId="+courseId+"&circleId="+circleId
                        //is_close_study_url= window.open(study_url_open);
                        my_study_list[j]=study_url_open;
                        j++;
                    }

                }
            }
            if(my_study_list.length>0){
                is_close_study_url= window.open(my_study_list[0]);
                study_n=0;
            }
        };
        }
　　}
    setInterval(function() {
     if(is_close_study_url.closed){
        study_n++;
        if(my_study_list.length>study_n){
           is_close_study_url= window.open(my_study_list[study_n]);
        }
     }
    },15000);
    setInterval(function() {
        if((window.location.href).substring(0,46)==='https://study.enaea.edu.cn/viewerforccvideo.do')
        {
            var replay= document.getElementById("replaybtn");
            if(replay.style.display==="block"){
                window.opener=null;window.close();//关闭页面
            }
            var go_on_div=document.getElementById("ccH5historyTimeBox");
            var go_on_click= document.getElementById("ccH5jumpInto");
           // if(go_on_div.className==="fade"){
             //   go_on_click.click();
           // }
        }
      }, 5000);
    function getQueryVariable(variable)
    {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    }
})();
