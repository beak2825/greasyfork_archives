// ==UserScript==
// @name         问卷星自动化填写---入门教材（测试问卷001）
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  定制每个选项比例概率，刷问卷前需要一题一题改代码，当前模板教程仅支持单选,多选，供学习者入门使用，后续推出填空,量表，下拉框题，等一系列题型，如有其它高级题型和高手可进群定制脚本技术讨论，使用需要一定js知识，
// @description  不懂的可以加QQ1群(满)：[865248256] QQ2群（满）：[487872111]，QQ3群讨论交流： [ 530327843 ]; 获取更多资料可关注公众号 ：[ AUTOSTARS ] ，测试脚本问卷：  https://www.wjx.cn/vj/epPbAAE.aspx
// @author       ZYY
// @include     https://**/*
// @downloadURL https://update.greasyfork.org/scripts/472764/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%8C%96%E5%A1%AB%E5%86%99---%E5%85%A5%E9%97%A8%E6%95%99%E6%9D%90%EF%BC%88%E6%B5%8B%E8%AF%95%E9%97%AE%E5%8D%B7001%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/472764/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%8C%96%E5%A1%AB%E5%86%99---%E5%85%A5%E9%97%A8%E6%95%99%E6%9D%90%EF%BC%88%E6%B5%8B%E8%AF%95%E9%97%AE%E5%8D%B7001%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //===========================开始==============================




    var wenjuan_url = 'https://www.wjx.cn/vj/epPbAAE.aspx';

    //------------------------------下边的网址不要改！！！！！！！！！！！！！！！！！！！！
    if(window.location.href.indexOf('https://www.wjx.cn/wjx/join/complete.aspx')!=-1){
        window.location.href=wenjuan_url;
    }else if(window.location.href==wenjuan_url){
    }else{
        return
    }

    //滚动到末尾
    window.scrollTo(0,document.body.scrollHeight)

    //获取题块列表
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

    //1
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [50,50];
    ops[danxuan(bili)].click()

    //2
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [20,20,20,20,20];
    ops[danxuan(bili)].click()

    //3
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [25,25,25,25];
    ops[danxuan(bili)].click()

    //4
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [25,25,25,25];
    ops[danxuan(bili)].click()

    //5
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [25,25,25,25];
    ops[danxuan(bili)].click()

    //6
    ops = lists[ccc].querySelectorAll('li');
    ccc+=1;
    bili = [20,20,20,20,20];
    temp_flag = false;
    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }
    //7
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [50,50];
    ops[danxuan(bili)].click()



    let count = 0
    //提交函数
    setTimeout( function(){
        document.querySelector('#submit_button').click()
        setTimeout( function(){
            document.querySelector('#SM_BTN_1').click()
            setInterval( function(){
                try{
                    //点击刷新验证框
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

/*
    //---------------------------------------------------------------------------------------------------

    //单选题模板
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [];
    ops[danxuan(bili)].click()

    //---------------------------------------------------------------------------------------------------

    //多选题模板（至少选一个选项）
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [];
    temp_flag = false

    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }

    //---------------------------------------------------------------------------------------------------

    //多选题模板（可自定义至少选一个选项）
    ops = lists[ccc].querySelectorAll('li');
    ccc+=1;
    bili = [];
    min_options = 3  //设置最少选择的项数
    temp_flag = 0;
    while(temp_flag<min_options){
        let temp_answer = []
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                temp_answer.push(count)
                temp_flag+=1
            }
            if(count==bili.length-1){
                if(temp_flag<min_options){
                    temp_flag = 0
                }
                else{
                    for(let count = 0;count<temp_answer.length;count++){
                        ops[temp_answer[count]].click();
                    }
                }
            }
        }
    }

    //---------------------------------------------------------------------------------------------------

    //填空题模板（固定答案）
    document.querySelector('#q题号').value='自定义答案'

    //---------------------------------------------------------------------------------------------------

    //填空题模板（多个答案，可定制比例）
    tiankong_list = ['王翠花','小明','小红'];
    bili = [33,33,34];
    document.querySelector('#q题号').value=tiankong_list[danxuan(bili)]

    //---------------------------------------------------------------------------------------------------

    //单选的量表题模板
    liangbiao_lists = document.querySelectorAll('#div题号 tbody tr')
    liangbiao_index=0
    //题号-1
    ops = liangbiao_lists[liangbiao_index].querySelectorAll('td')
    liangbiao_index+=1
    bili = [20,20,20,20,20];
    ops[danxuan(bili)].click()

    //---------------------------------------------------------------------------------------------------

    //多选的量表题模板
    liangbiao_lists = document.querySelectorAll('#div题号 tbody tr')
    liangbiao_index=0
    //题号-1
    ops = liangbiao_lists[liangbiao_index].querySelectorAll('td')
    liangbiao_index+=1
    bili = [50,50,50,50];
    temp_flag = false
    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }

    //---------------------------------------------------------------------------------------------------

    //下拉框题模板
    xiala_click(document.querySelectorAll('.select2-selection.select2-selection--single')[xiala_index])
    xiala_index+=1
    ops = document.querySelectorAll('#select2-q题号-results li')
    ops = Array.prototype.slice.call(ops); //非ie浏览器正常
    ops = ops.slice(1,ops.length);
    bili = randomBili(ops.length-1);//默认所有选项平均分配
    xialaElement_click(ops[danxuan(bili)])

    //---------------------------------------------------------------------------------------------------

    /*
    //点击提交按钮
    setTimeout( function(){
        //document.querySelector('#submit_button').click()
        var ev = document.createEvent('HTMLEvents');
        ev.clientX = 20
        ev.clientY = 20
        ev.initEvent('click', false, true);
        document.querySelector('#submit_button').dispatchEvent(ev)
    }, 3 * 1000 );
*/
    //===========================结束==============================
    //返回随机bili 参数为随机个数
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

    //点击下拉框方法
    function xiala_click(e){
        let fireOnThis = e
        let evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent( 'mousedown', true, true, this, 1, 12, 345, 7, 220, false, false, true, false, 0, null );
        fireOnThis.dispatchEvent(evObj);

    }

    //点击下拉框中的选项方法
    function xialaElement_click(e){
        let fireOnThis = e
        let evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent( 'mouseup', true, true, this, 1, 12, 345, 7, 220, false, false, true, false, 0, null );
        fireOnThis.dispatchEvent(evObj);
    }
})();