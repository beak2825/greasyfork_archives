// ==UserScript==
// @name         自动抢课2
// @namespace    https://osu.ppy.sh/u/376831
// @version      0.1
// @description  自动抢课21
// @author       wcx19911123
// @match        http://192.168.240.168/xuanke/edu_main.asp?xq=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28054/%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%AF%BE2.user.js
// @updateURL https://update.greasyfork.org/scripts/28054/%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%AF%BE2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!==null)return  unescape(r[2]); return null;
    }
    var course_no = GetQueryString("course_no");
    var isBixiu = GetQueryString("bx");
    var input;
    var eventId = setInterval(function(){
        input = parent.window.frames.button.document.getElementsByName("kch");
        if(input !== null && input.length > 0){
            clearInterval(eventId);
            input = input[0];
            if(course_no){
                input.value = course_no;
                input = parent.window.frames.button.document.getElementsByName("action1")[0];
                input.click();
                eventId =  setInterval(function(){
                    input = parent.window.frames.course.document.getElementsByTagName("input");
                    if(input !== null && input.length > 0){
                        clearInterval(eventId);
                        input = input[(isBixiu == 1 ? 0 : 1)];
                        input.checked = true;
                        parent.window.frames.button.document.getElementsByName("action5")[0].click();
                        eventId =  setInterval(function(){
                            input = parent.window.frames.result.document.getElementsByName("GetCode");
                            if(input !== null && input.length > 0){
                                clearInterval(eventId);
                                input = input[0];
                                input.focus();
                            }
                        }, 200);
                    }
                }, 200);
            }
        }
    }, 200);
})();