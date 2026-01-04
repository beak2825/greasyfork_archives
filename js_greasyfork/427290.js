// ==UserScript==
// @name         问卷星(定制比例)vm模板
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  如遇问题可加QQ 835573228
// @author       ZYY
// @match        https://www.wjx.cn/vm/*
// @match        https://www.wjx.cn/vj/*
// @match        https://ks.wjx.top/*
// @match        https://ww.wjx.top/*
// @match        https://w.wjx.top/*
// @match        https://*.wjx.top/*
// @match        https://*.wjx.cn/vm/*
// @match        https://*.wjx.cn/vj/*
// @match        https://*.wjx.com/vm/*
// @match        https://*.wjx.com/vj/*
// @downloadURL https://update.greasyfork.org/scripts/427290/%E9%97%AE%E5%8D%B7%E6%98%9F%28%E5%AE%9A%E5%88%B6%E6%AF%94%E4%BE%8B%29vm%E6%A8%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/427290/%E9%97%AE%E5%8D%B7%E6%98%9F%28%E5%AE%9A%E5%88%B6%E6%AF%94%E4%BE%8B%29vm%E6%A8%A1%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //===========================开始==============================

    //填写刷问卷的网址
    var wenjuan_url = 'https://www.wjx.cn/vm/QvfxoEU.aspx';
    //while(document.querySelector('#SM_TXT_1').innerHTML.indexOf('验证失败')!=-1){
    if(window.location.href.indexOf('https://www.wjx.cn/wjx/join')!=-1){
        window.location.href=wenjuan_url;
    }else if(window.location.href==wenjuan_url){

    }else{
        return
    }


    //获取题块列表
    var lists = document.querySelectorAll('#divQuestion .field.ui-field-contain')

    var ccc=0;
    //1.性别
    var ops = lists[ccc].querySelectorAll('.ui-radio')
    ccc+=1
    var bili = [50,50];
    ops[danxuan(bili)].click()

    //2.年龄
    ops = lists[ccc].querySelectorAll('.ui-radio')
    ccc+=1
    bili = [14,14,14,14,14,14,16];
    ops[danxuan(bili)].click()

    //3.学历
    ops = lists[ccc].querySelectorAll('.ui-radio')
    ccc+=1
    bili = [20,20,20,20,20];
    ops[danxuan(bili)].click()

    //4.满意度
    ops = lists[ccc].querySelectorAll('.ui-radio')
    ccc+=1
    bili = [20,20,20,20,20];
    ops[danxuan(bili)].click()

    //5.认同度
    ops = lists[ccc].querySelectorAll('.ui-radio')
    ccc+=1
    bili = [20,20,20,20,20];
    ops[danxuan(bili)].click()

    //6.帅不帅
    ops = lists[ccc].querySelectorAll('.ui-radio')
    ccc+=1
    bili = [70,30];
    ops[danxuan(bili)].click()

    //7.你喜欢的水果
    ops = lists[ccc].querySelectorAll('.ui-checkbox');
    ccc+=1;
    bili = [5,5,5,5];
    var temp_flag = false;
    while(!temp_flag){
        for(var count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }

    //8.你喜欢的饮料
    ops = lists[ccc].querySelectorAll('.ui-checkbox')
    ccc+=1
    bili = [50,50,50,50];
    temp_flag = false

    while(!temp_flag){
        for( count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }

    //9.你的名字
    document.querySelector('#q9').value='王翠花';

    //滚动到末尾
    scrollToBottom();
/*
    //点击提交按钮
    setTimeout( function(){
        document.querySelector('#ctlNext').click()
    }, 3 * 1000 );

    //点击单机验证按钮
      setTimeout( function(){
          document.querySelector('#SM_BTN_1').click()
    }, 4 * 1000 );

    //滑动验证
    setTimeout( function(){
      yanzhen();
    }, 7 * 1000 );

    //超时刷新处理
    setTimeout( function(){
      location.reload();
    }, 13 * 1000 );
*/
    //===========================结束==============================
    //累加list前num数的和
    function leijia(list,num){
        var sum = 0
        for(var i=0;i<num;i++){
            sum+=list[i];
        }
        return sum;
    }

    //生成从minNum到maxNum的随机数
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
    //判断num是否在指定区间内
    function isInRange(num,start,end){
        if(num>=start && num<=end){
            return true;
        }else{
            return false;
        }
    }
    //单选题执行函数
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
    //多选题执行函数
    function duoxuan(probability){
        var flag = false;
        var i = randomNum(1,100);
        if(isInRange(i,1,probability)){
            flag = true;
         }
        return flag;
    }

    //清楚cookie
    function clearCookie() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;) {
                document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();//清除当前域名下的,例如：m.kevis.com
                document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();//清除当前域名下的，例如 .m.kevis.com
                document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString();//清除一级域名下的或指定的，例如 .kevis.com
            }
        }
        alert('已清除');
    }
    //滑动验证函数
    function yanzhen(){
        var event = document.createEvent('MouseEvents');
        event.initEvent('mousedown', true, false);
        document.querySelector("#nc_1_n1z").dispatchEvent(event);
        event = document.createEvent('MouseEvents');
        event.initEvent('mousemove', true, false);
        Object.defineProperty(event,'clientX',{get(){return 260;}})
        document.querySelector("#nc_1_n1z").dispatchEvent(event);
    }

    //滚动到末尾函数
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


})();