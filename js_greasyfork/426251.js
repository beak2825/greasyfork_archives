// ==UserScript==
// @name        贵州大学继续教育学院视频播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  实现贵州大学继续教育学院视频播放
// @author       陈孤岛
// @match        https://gzdx.student.smartchutou.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426251/%E8%B4%B5%E5%B7%9E%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/426251/%E8%B4%B5%E5%B7%9E%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
   setTimeout(function(){
       let videodom=document.querySelector('video')






       document.querySelector('.pv-playpause ').click()
     setInterval(function() {
        if(videodom!==null){

        if(videodom.ended==true){
            document.querySelector('.anticon ').click()
                               function getlist(){
 let list=document.querySelectorAll('.player_catalog_view___ccGwy .ant-row');
 let ret=[];
 for(let index=0;index<list.length;index++){
     console.log(list[index]);
 if(list[index].innerHTML.indexOf('anticon anticon-check-circle looked___2OJgH')===-1)
 {ret.push(list[index])}
                                           };
 return ret;
}

            getlist()
            getlist()[0].click()


        }
    }

},5000)




    ; }, 10000);

})();