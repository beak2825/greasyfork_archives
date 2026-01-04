// ==UserScript==
// @name         云学堂
// @namespace    https://greasyfork.org/zh-CN/users/41249-tantiancai
// @version      0.31
// @description  云学堂自动挂机学习
// @author       Tantiancai
// @match        http://edu.linkstec.com/package/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34107/%E4%BA%91%E5%AD%A6%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/34107/%E4%BA%91%E5%AD%A6%E5%A0%82.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function getUnsafeWindow() {
        if (this) {
            console.log(this);
            if (typeof(this.unsafeWindow) !== "undefined") { //Greasemonkey, Scriptish, Tampermonkey, etc.
                return this.unsafeWindow;
            } else if (typeof(unsafeWindow) !== "undefined" && this === window && unsafeWindow === window) { //Google Chrome natively
                var node = document.createElement("div");
                node.setAttribute("onclick", "return window;");
                return node.onclick();
            } else {}
        } else { //Opera, IE7Pro, etc.
            return window;
        }
    }

    function GotoNextPage(){
        //存在左侧大纲
        if($('#divCourseTree').length >0){
            var link = $('#divCourseTree').find('.selectednode').parent().next().find('a');
            if(link.length > 0){
                link[0].click();
                return;
            }
        }


        if ($('dd.active').next().find('a').length>0) {
            $('dd.active').next().find('a')[0].click();
        }
        else{
            console.log('学习完成！');
            GoBack();
        }
    }

    function TimeProcess() {

        if(typeof(existsUserKnowledge) == 'undefined'){
            clearInterval(processTimer);
            GotoNextPage();
            return;
        }

        if(typeof(GetCurSchedule) != 'undefined'){

            console.log('实际学习时间：'+actualStudyHours + 's 共需学习时间：' +standardStudyHours +'s');
            var actualSchedule = GetCurSchedule();
            if (actualSchedule >= 100) {
                clearInterval(processTimer);
                GotoNextPage();
                return;
            }
        }else{
            clearInterval(processTimer);
            GotoNextPage();
            return;
        }

        if(blFirst){
            if (typeof(timecheck) != 'undefined') {
                clearInterval(timecheck);
            }

            if (typeof(myPlayer) != 'undefined' && typeof(actualStudyHours) != 'undefined' ) {
                if(actualStudyHours>0){
                    myPlayer.stop();
                    blFirst = false;
                }
            }
        }
    }

    var myUnsafeWindow = getUnsafeWindow();
    var processTimer = null;
    var blFirst = true;

    $(myUnsafeWindow.document).ready(function() {
        console.log('云学堂挂机脚本准备就绪。');
        processTimer = setInterval(TimeProcess, 5000);
    });

})();