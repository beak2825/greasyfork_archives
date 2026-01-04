// ==UserScript==
// @name         问卷星(lcz培育和践行价值观)
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  可定制每个选项比例概率
// @author       zjw
// @include     https://www.wjx.cn/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446644/%E9%97%AE%E5%8D%B7%E6%98%9F%28lcz%E5%9F%B9%E8%82%B2%E5%92%8C%E8%B7%B5%E8%A1%8C%E4%BB%B7%E5%80%BC%E8%A7%82%29.user.js
// @updateURL https://update.greasyfork.org/scripts/446644/%E9%97%AE%E5%8D%B7%E6%98%9F%28lcz%E5%9F%B9%E8%82%B2%E5%92%8C%E8%B7%B5%E8%A1%8C%E4%BB%B7%E5%80%BC%E8%A7%82%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //===========================开始==============================
    clearCookie();var wenjuan_url = 'https://www.wjx.cn/vj/PLlfPrD.aspx';
    if(window.location.href.indexOf('https://www.wjx.cn/wjx/join/complete.aspx')!=-1){
        window.location.href=wenjuan_url;
    }else if
    (window.location.href==wenjuan_url){
    }else
    {return}
    window.scrollTo(0,document.body.scrollHeight)
    //ti
    var lists = document.querySelectorAll('.ulradiocheck')
    var ccc=0;
    var liangbiao_index=0;
    var xiala_index=0;
    var ops;
    var bili;
    var temp_flag;
    var tiankong_list;
    var liangbiao_lists;
    var min_options;
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [60,40];
    ops[danxuan(bili)].click()
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [26,40,26,8];ops[danxuan(bili)].click()
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [25,15,20,10,15,15];ops[danxuan(bili)].click()
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [35,35,15,20];
    ops[danxuan(bili)].click()
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [55,30,15];
    ops[danxuan(bili)].click()
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [50,40,10];ops[danxuan(bili)].click()
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [30,65,5];
    ops[danxuan(bili)].click()
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [3,12,30,55];
    ops[danxuan(bili)].click()
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [5,70,25];
    ops[danxuan(bili)].click()
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [30,55,15,5];ops[danxuan(bili)].click()
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [71,24,5];
    ops[danxuan(bili)].click()
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [80,69,58,50,20];
    temp_flag = false
    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();temp_flag = true;}
        }}
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [58,26,16];ops[danxuan(bili)].click()
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [85.9,68.5,54.5,30];temp_flag = false
    while(!temp_flag){for(let count = 0;count<bili.length;count++)
        {if(duoxuan(bili[count])){ops[count].click();temp_flag = true; 
            }}
 }
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [85.9,68.5,50,70,54.5];
    temp_flag = false
    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){ops[count].click();temp_flag = true;}}
    }
    let count = 0
    //提交
    setTimeout( function(){
        document.querySelector('#submit_button').click()
        setTimeout( function(){
            document.querySelector('#SM_BTN_1').click()
            setInterval( function(){
                try{yanzhen();count+=1;}
            catch(err){if(count>=6){location.reload()}
               }}, 500 );}, 0.1 * 1000 );}, 0.1 * 1000 );


    //===========================结束==============================
    function randomBili(num){
        let a = Math.floor(100/num);
        let yu = 100 - a*num;
        let list = [];
        for(let i=0;i<num;i++){list.push(a)}
        for(let i=0;i<yu;i++){list[i]=list[i]+1}
        return list;}
    function leijia(list,num){
        var sum = 0
        for(var i=0;i<num;i++){sum+=list[i];}
        return sum;}
    function randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);break;
            default:
                return 0;break;}
    }
    //判断num
    function isInRange(num,start,end){
        if(num>=start && num<=end){
            return true;}else{
            return false;}
    }
    //执单
    function danxuan(bili){
        var pp = randomNum(1,100)
        for(var i=1;i<=bili.length;i++){
            var start = 0;
            if(i!=1){start = leijia(bili,i-1)}
            var end = leijia(bili,i);
            if(isInRange(pp,start,end)){return i-1;break;}}
    }
    //执多
    function duoxuan(probability){
        var flag = false;
        var i = randomNum(1,100);
        if(isInRange(i,1,probability)){
            flag = true;}
        return flag;}
    //cookie
    function clearCookie() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) 
        {
            for (var i = keys.length; i--;) {
                document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();
                document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();
                document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString();}
        }
    }
    //验证
    function yanzhen(){
        var event = document.createEvent('MouseEvents');
        event.initEvent('mousedown', true, false);
        document.querySelector("#nc_1_n1z").dispatchEvent(event);
        event = document.createEvent('MouseEvents');
        event.initEvent('mousemove', true, false);
        Object.defineProperty(event,'clientX',{get(){return 260;}})
        document.querySelector("#nc_1_n1z").dispatchEvent(event);}

    function scrollToBottom(){
        (function () {
            var y = document.body.scrollTop;
            var step = 500;
            window.scroll(0, y);
            function f() 
            {
                if (y < document.body.scrollHeight) {y += step;window.scroll(0, y);setTimeout(f, 50);}
                else {window.scroll(0, y);document.title += "scroll-done";}
            }
            setTimeout(f, 1000);})();
    }
    function xiala_click(e){
        let fireOnThis = e
        let evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent( 'mousedown', true, true, this, 1, 12, 345, 7, 220, false, false, true, false, 0, null );
        fireOnThis.dispatchEvent(evObj);}

    function xialaElement_click(e){
        let fireOnThis = e
        let evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent( 'mouseup', true, true, this, 1, 12, 345, 7, 220, false, false, true, false, 0, null );
        fireOnThis.dispatchEvent(evObj);}
  })
();