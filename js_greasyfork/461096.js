// ==UserScript==
// @name         BetterEKW
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  仅供个人学习使用。
// @author       Lyxin
// @include      /^https?://www\.ekwing.com/.*$/
// @grant        none
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/461096/BetterEKW.user.js
// @updateURL https://update.greasyfork.org/scripts/461096/BetterEKW.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("oosso")
    window.ffadfa=0;
    function handleData(data){
        data=JSON.parse(data)
        window.data=data;
        if(window.ffadfa==1) return;
        try{
            $('.ek_pop_inner').append(`捕获到分数：${data.data.score} ヾ(≧▽≦*)o`.big());
            $(".test_vip_pop").clone().find(".promptBox .stronge").html(" " + data.data.score + "ヾ(≧▽≦*)o ").end().show();
            $(".logo").html(`捕获到分数：${data.data.score} ヾ(≧▽≦*)o`.big());
            window.ffadfa=1;
        }catch(r){
            console.log(data);
            console.log("not submit");
            $(".logo").html(`not a submition${Date()}`);
        }
    }
    XMLHttpRequest.prototype.Send=XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.send=function(s){
        try{
            console.log(JSON.parse(decodeURIComponent(s.split('&')[3].substr(5))).sendP[0].scoreArr.reverse()[0].score);
            $(".look-score-btn").html(`${JSON.parse(decodeURIComponent(s.split('&')[3].substr(5))).sendP[0].scoreArr.reverse()[0].score} ヾ(≧▽≦*)o`);
        }catch(e){
            console.log(e)}

        return this.Send(s)
    }
    $.kkk=$.ajax;
    $.ajax=(sth)=>$.kkk(sth?(()=>{let f=sth.success;sth.success=(data)=>{f(data);handleData(data)};return sth})():{})
    // Your code here...
})();