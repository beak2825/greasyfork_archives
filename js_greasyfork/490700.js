// ==UserScript==
// @name         河北北方学院继续教育-视频播放
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  视频自动播放下一个
// @author       xiajie
// @match        https://cjxyol2.hebeinu.edu.cn/online/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hebeinu.edu.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/490700/%E6%B2%B3%E5%8C%97%E5%8C%97%E6%96%B9%E5%AD%A6%E9%99%A2%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/490700/%E6%B2%B3%E5%8C%97%E5%8C%97%E6%96%B9%E5%AD%A6%E9%99%A2%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    if(window.location.pathname == '/online/course/show'){
        console.log('课程详情');

        var link_url = window.location.href;
        var courseId = getParam(link_url,'courseId');
        var courseEnd = courseId+'_isEnd';
        
        playMp4 = function(resId,resName) {
            GM_setValue(courseId,'');
            GM_setValue(courseEnd,false);
            GM_setValue(courseId,resName.trim());

            var url = '/online/course/play/'+resId
            window.open(url, 'scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes');
        }

        var len = $('#resType2List tbody tr').length;
        var courseList = [];
        var nowIndex = 1;
        for(var i=1;i<len;i++){
            courseList[i] = {
                'name':$('#resType2List tbody tr').eq(i).find('td').eq(0).text().trim(),
                'progress':parseInt($('#resType2List tbody tr').eq(i).find('td').eq(3).text()),
            };
        }
        //console.log(courseId);
        //console.log(courseList);

        //播放完成，点击下一节
        setInterval(function(){
            var aa = GM_getValue(courseEnd);
            if(aa == true){
                GM_setValue(courseEnd,false);
                var tmpName = GM_getValue(courseId);
                for(var i=1;i<len;i++){
                    var obj = courseList[i];
                    if(obj.name == tmpName && i<len){
                        $('#resType2List tbody tr').eq(i+1).find('input').click();
                        break;
                    }
                }
            }
        },3000);
    }


    if(window.location.pathname.indexOf('/online/course/play') !== -1){
        console.log('播放视频');
        var courseId = $('#updateResFlag').val();
        var courseEnd = courseId+'_isEnd';
        var check = setInterval(function(){
            if(thePlayer2){
                var playPosition  = thePlayer2.getPosition();
                var mp4Length = thePlayer2.getDuration();
                //console.log(playPosition)
                //console.log(mp4Length)
                if(playPosition > 0 && mp4Length > 0 && mp4Length - playPosition <= 1){
                    console.log('播放完成')
                    GM_setValue(courseEnd,true);
                    clearInterval(check);
                }
            }
        },3000)

    }

    //获取链接中指定参数
    function getParam(url, name) {
        try {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = url.split('?')[1].match(reg);
            if(r != null) {
                return r[2];
            }
            return "";//如果此处只写return;则返回的是undefined
        } catch(e) {
            return "";//如果此处只写return;则返回的是undefined
        }
    };

})();