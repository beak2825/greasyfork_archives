// ==UserScript==
// @name         教育网挂机
// @namespace    https://www.sx314.com/
// @version      0.11
// @description  挂机
// @author       penrcz
// @match        http://study.teacheredu.cn/proj/studentwork/study.htm*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/404685/%E6%95%99%E8%82%B2%E7%BD%91%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/404685/%E6%95%99%E8%82%B2%E7%BD%91%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';


    //增加按钮
    $('.video_title_time').append('<input type="text" id="hh_time" value="4200"><a href="javascript:void(0);"  id="actionupdate">提交</a>');
    //显示隐藏时间
    $('.video_title_time input').attr('type','text').css("width","50px");

    $('#actionupdate').click(function(){
        var hh_time=$('#hh_time').val();
        var courseId = $('#courseId').val();
        var url="http://study.teacheredu.cn/proj/studentwork/studyAjax/AddStudyTimeExit.json?time=" + hh_time;
            url="http://study.teacheredu.cn/proj/studentwork/studyAjax/AddStudyTime.json";
            url="http://study.teacheredu.cn/proj/studentwork/update_studytime.json?courseId="+courseId+"&studyTime="+hh_time;
        
        //alert('courseId='+courseId);
        jQuery.ajax({ type: "POST", url: url,
                     dataType:"json",
                     data: "courseId="+courseId+"&studyTime=" + hh_time,
                     success: function(msg){
                         //if(msg!=0) {
                             window.location.href = "http://study.teacheredu.cn/proj/studentwork/courseListNew?ptcode=34101&menuRefId=99073";
                             //alert(msg);
                        // } else {
                             //alert( msg);
                         //}
                     }
                });
    });

    function _p(obj){
    	console.log(obj);
    }
})();

