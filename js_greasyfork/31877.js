// ==UserScript==
// @name         TTG过滤 - BlueRay,MiniVideo,iPad视频
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  将TTG资源列表中的BlueRay,MiniVideo,iPad视频,以及电视剧的分集视频给过滤掉.
// @author       You
// @match        *://totheglory.im/*
// @grant        none
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/31877/TTG%E8%BF%87%E6%BB%A4%20-%20BlueRay%2CMiniVideo%2CiPad%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/31877/TTG%E8%BF%87%E6%BB%A4%20-%20BlueRay%2CMiniVideo%2CiPad%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    
    $('#torrent_table tr').each(function (i){
     
        var _this = $(this);
        
        //过滤BluRay原盘
        if($(this).find('img[alt = "BluRay原盘"]').length !== 0){
           $(this).remove();
           return true; //continue
        }

        //过滤纪录片BluRay原盘
        if($(this).find('img[alt = "纪录片BluRay原盘"]').length !== 0){
           $(this).remove();
           return true; //continue
        }
        
        //过滤MiniVideo
        if($(this).find('img[alt = "MiniVideo"]').length !== 0){
           $(this).remove();
           return true; //continue
        }
        
         //过滤iPhone/iPad视频
        if($(this).find('img[alt = "iPhone/iPad视频"]').length !== 0){
           $(this).remove();
           return true; //continue
        }
        
        
        //过滤第n集
        var content = $(this).find(".name_left span").text();
        var reg=/.*[第, ]{1}[0-9,\-,一,二,三,四,五,六,七,八,九,十]*[集,话,話,回]{1}.*/;
        if(reg.test(content)){
            //alert(content);
            $(this).remove();
            return true; //continue
        }

        
    });
    
   // $('img[alt = "BluRay原盘"]').parent().parent().parent().remove();
})();