// ==UserScript==
// @name         超星学习通自动签到
// @namespace    http://tampermonkey.net/
// @version      0.40
// @description  自用！
// @author       ZJ
// @include      *://mobilelearn.chaoxing.com/*
// @include      *://i.mooc.chaoxing.com/space/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396969/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/396969/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    var window_url = window.location.href;
    var website_host = window.location.host;
    var arr = ['https://mobilelearn.chaoxing.com/widget/pcpick/stu/index?courseId=208609399&jclassId=17308991&s=','https://mobilelearn.chaoxing.com/widget/pcpick/stu/index?courseId=206140349&jclassId=12254225&s='];
    function op1() {
        nw1.location = arr[0];
        setTimeout(op1, 60000*15);
    }
    function op2() {
        nw2.location = arr[1];
        setTimeout(op2, 60000*15);
    }
    if(window_url.indexOf('i.mooc.chaoxing.com')!=-1 || website_host=='i.mooc.chaoxing.com'){
        var nw2 = window.open();
        var nw1 = window.open(); 
        op1();
        op2();
    }
    if(window_url.indexOf('mobilelearn.chaoxing.com')!=-1 || website_host=='mobilelearn.chaoxing.com'){
        var c = document.getElementsByClassName('green');
        if(c.length!==0){
            for(var i=0;i<c.length;i++){
                c[i].parentNode.parentNode.parentNode.onclick();
            }
        }
    }
})();