// ==UserScript==
// @name         问卷星（满意度定制版）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BY https://greasyfork.org/zh-CN/scripts/427090-%E9%97%AE%E5%8D%B7%E6%98%9F-%E5%AE%9A%E5%88%B6%E6%AF%94%E4%BE%8B-%E6%A8%A1%E6%9D%BF-2023%E6%9C%80%E6%96%B0%E7%89%88
// @include     https://www.wjx.cn/jq/56391532.aspx
// @downloadURL https://update.greasyfork.org/scripts/471906/%E9%97%AE%E5%8D%B7%E6%98%9F%EF%BC%88%E6%BB%A1%E6%84%8F%E5%BA%A6%E5%AE%9A%E5%88%B6%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/471906/%E9%97%AE%E5%8D%B7%E6%98%9F%EF%BC%88%E6%BB%A1%E6%84%8F%E5%BA%A6%E5%AE%9A%E5%88%B6%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';


    clearCookie();


    var wenjuan_url = 'https://www.wjx.cn/jq/56391532.aspx';


    if(window.location.href.indexOf('https://www.wjx.cn/wjx/join/complete.aspx')!=-1){
        window.location.href=wenjuan_url;
    }else if(window.location.href==wenjuan_url){
    }else{
        return
    }


    window.scrollTo(0,document.body.scrollHeight)
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
    bili = [0,30,0,0,0,0,10,0,10,10,0,0,0,0,0,20,20];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [95,5,0,0,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [95,5,0,0,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [100,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [95,5,0,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [100,0,0,0,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [100,0,0,0,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [100,0,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [95,5,0,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [100,0,0,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [100,0,0,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [100,0,0,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [50,50];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [100,0,0,0,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [100,0,0,0,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [100,0,0,0,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [100,0,0,0,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [100,0,0,0,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [100,0,0];
    ops[danxuan(bili)].click()

    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [100,0,0,0,0,0];
    ops[danxuan(bili)].click()

    tiankong_list = ['无','没有','都很满意'];
    bili = [33,33,34];
    document.querySelector('#q21').value=tiankong_list[danxuan(bili)]

    let count = 0

    setTimeout( function(){
        document.querySelector('#submit_button').click()
        setTimeout( function(){
            document.querySelector('#SM_BTN_1').click()
            setInterval( function(){
                try{
                    noCaptcha.reset(1)
                    yanzhen();
                    count+=1;
                }
                catch(err){
                    if(count>=6){
                        location.reload()
                    }
                }
            }, 500 );
        }, 0.1 * 1000 );
    }, 0.1 * 1000 );


    function randomBili(num){
        let a = Math.floor(100/num);
        let yu = 100 - a*num;
        let list = [];
        for(let i=0;i<num;i++){
            list.push(a)
        }
        for(let i=0;i<yu;i++){
            list[i]=list[i]+1
        }
        return list;
    }

    function leijia(list,num){
        var sum = 0
        for(var i=0;i<num;i++){
            sum+=list[i];
        }
        return sum;
    }


    function randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
                break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
            default:
                return 0;
                break;
        }
    }

    function isInRange(num,start,end){
        if(num>=start && num<=end){
            return true;
        }else{
            return false;
        }
    }

    function danxuan(bili){
        var pp = randomNum(1,100)
        for(var i=1;i<=bili.length;i++){
            var start = 0;
            if(i!=1){
                start = leijia(bili,i-1)
            }
            var end = leijia(bili,i);
            if(isInRange(pp,start,end)){
                return i-1;
                break;
            }
        }
    }

    function duoxuan(probability){
        var flag = false;
        var i = randomNum(1,100);
        if(isInRange(i,1,probability)){
            flag = true;
        }
        return flag;
    }


    function clearCookie() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;) {
                document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();//清除当前域名下的,例如：m.kevis.com
                document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();//清除当前域名下的，例如 .m.kevis.com
                document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString();//清除一级域名下的或指定的，例如 .kevis.com
            }
        }
    }

    function yanzhen(){
        var event = document.createEvent('MouseEvents');
        event.initEvent('mousedown', true, false);
        document.querySelector("#nc_1_n1z").dispatchEvent(event);
        event = document.createEvent('MouseEvents');
        event.initEvent('mousemove', true, false);
        Object.defineProperty(event,'clientX',{get(){return 260;}})
        document.querySelector("#nc_1_n1z").dispatchEvent(event);
    }


    function scrollToBottom(){
        (function () {
            var y = document.body.scrollTop;
            var step = 500;
            window.scroll(0, y);
            function f() {
                if (y < document.body.scrollHeight) {
                    y += step;
                    window.scroll(0, y);
                    setTimeout(f, 50);
                }
                else {
                    window.scroll(0, y);
                    document.title += "scroll-done";
                }
            }
            setTimeout(f, 1000);
        })();
    }


    function xiala_click(e){
        let fireOnThis = e
        let evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent( 'mousedown', true, true, this, 1, 12, 345, 7, 220, false, false, true, false, 0, null );
        fireOnThis.dispatchEvent(evObj);

    }


    function xialaElement_click(e){
        let fireOnThis = e
        let evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent( 'mouseup', true, true, this, 1, 12, 345, 7, 220, false, false, true, false, 0, null );
        fireOnThis.dispatchEvent(evObj);
    }
})();