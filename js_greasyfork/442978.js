// ==UserScript==
// @name         中分模板
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  可定制每个选项比例概率，刷问卷前需要改代码，目前模板支持单选,多选,填空,量表，下拉框题，如有其它高级题型可进群定制脚本，使用需要一定js知识，不懂的可以加QQ群交流，QQ1群：865248256 QQ2群：487872111，本群也提供定制脚本刷问卷服务，服务快捷，价格优惠。https://www.wjx.cn/vj/QvfxoEU.aspx 是测试脚本问卷。如遇问题可加QQ 835573228
// @author       ZYY
// @include     https://www.wjx.cn/*
// @downloadURL https://update.greasyfork.org/scripts/442978/%E4%B8%AD%E5%88%86%E6%A8%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/442978/%E4%B8%AD%E5%88%86%E6%A8%A1%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //===========================开始==============================
    clearCookie();


    //填写刷问卷的网址  注意，如果问卷中的网址中间是vm,一定要改成vj!!!,像这样 https://www.wjx.cn/vj/QvfxoEU.aspx
    var wenjuan_url = 'https://www.wjx.cn/vj/hynK7Mb.aspx';

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
    bili = [40,30,25,5];
    ops[danxuan(bili)].click()

    //3
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [70,30];
    ops[danxuan(bili)].click()

    //4
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [65,35];
    ops[danxuan(bili)].click()

    //5
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [20,35,35,10];
    ops[danxuan(bili)].click()

    //6
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [10,40,25,25];
    ops[danxuan(bili)].click()

    //7
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [40,40,20];
    ops[danxuan(bili)].click()
    //8
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [60,60,60,70,30];
    temp_flag = false

    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }

    //9
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [50,50];
    ops[danxuan(bili)].click()
    //10
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [60,40];
    ops[danxuan(bili)].click()
    //11
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [10,30,25,25,10];
    ops[danxuan(bili)].click()

    //12
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [20,30,20,20,10];
    ops[danxuan(bili)].click()
    //13
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [40,60,40,60,20];
    temp_flag = false

    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }
    //14
    liangbiao_lists = document.querySelectorAll('#div14 tbody tr')
    liangbiao_index=0
    //题号14-1
    ops = liangbiao_lists[liangbiao_index].querySelectorAll('td')
    liangbiao_index+=1
    bili = [5,10,35,35,15];
    temp_flag = false
    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }
    //14-2
    ops = liangbiao_lists[liangbiao_index].querySelectorAll('td')
    liangbiao_index+=1
    bili = [5,10,35,35,15];
    temp_flag = false
    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }
    //14-3
    ops = liangbiao_lists[liangbiao_index].querySelectorAll('td')
    liangbiao_index+=1
    bili = [5,10,35,35,15];
    temp_flag = false
    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }
    //15
    liangbiao_lists = document.querySelectorAll('#div15 tbody tr')
    liangbiao_index=0
    //15-1
    ops = liangbiao_lists[liangbiao_index].querySelectorAll('td')
    liangbiao_index+=1
    bili = [5,10,35,35,15];
    temp_flag = false
    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }
    //15-2
    ops = liangbiao_lists[liangbiao_index].querySelectorAll('td')
    liangbiao_index+=1
    bili = [5,10,35,35,15];
    temp_flag = false
    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }
    //15-3
    ops = liangbiao_lists[liangbiao_index].querySelectorAll('td')
    liangbiao_index+=1
    bili = [5,10,35,35,15];
    temp_flag = false
    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }
    //16
    liangbiao_lists = document.querySelectorAll('#div16 tbody tr')
    liangbiao_index=0
    //16-1
    ops = liangbiao_lists[liangbiao_index].querySelectorAll('td')
    liangbiao_index+=1
    bili = [5,10,35,35,15];
    temp_flag = false
    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }
    //16-2
    ops = liangbiao_lists[liangbiao_index].querySelectorAll('td')
    liangbiao_index+=1
    bili = [5,10,35,35,15];
    temp_flag = false
    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }
    //16-3
    ops = liangbiao_lists[liangbiao_index].querySelectorAll('td')
    liangbiao_index+=1
    bili = [5,10,35,35,15];
    temp_flag = false
    while(!temp_flag){
        for(let count = 0;count<bili.length;count++){
            if(duoxuan(bili[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }
    //17
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [10,10,40,35,5];
    ops[danxuan(bili)].click()
    //18
    ops = lists[ccc].querySelectorAll('li')
    ccc+=1
    bili = [10,10,40,35,5];
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
                    //noCaptcha.reset(1)
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