// ==UserScript==
// @name         问卷星定制（2023最新版！！！）
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  QQ群：283947109
// @author       海岛奇兵 and ，，，，
// @include     https://www.wjx.cn/*
// @downloadURL https://update.greasyfork.org/scripts/459186/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%AE%9A%E5%88%B6%EF%BC%882023%E6%9C%80%E6%96%B0%E7%89%88%EF%BC%81%EF%BC%81%EF%BC%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/459186/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%AE%9A%E5%88%B6%EF%BC%882023%E6%9C%80%E6%96%B0%E7%89%88%EF%BC%81%EF%BC%81%EF%BC%81%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //===========================开始==============================
    clearCookie();


    //b站教程：https://www.bilibili.com/video/BV1i8411M7Rs/
    var wenjuan_url = 'https://www.wjx.cn/vm/ru9CqON.aspx';

    //------------------------------下边的网址不要改！！！！！！！！！！！！！！！！！！！！
    if(window.location.href.indexOf('https://www.wjx.cn/wjx/join/completemobile2.aspx')!=-1){
        window.location.href=wenjuan_url;
    }else if(window.location.href==wenjuan_url){
    }else{
        return
    }

    //滚动到末尾
    window.scrollTo(0,document.body.scrollHeight)

    //获取题块列表
    var lists = document.querySelectorAll('.ui-controlgroup.column2.two_column')
    var ccc=0
    var lists1 = document.querySelectorAll('.ui-controlgroup.two_column')
    var aaa=0
    var lists2 = document.querySelectorAll('.ui-controlgroup.column4.two_column')
    var ddd=0
    var lists3 = document.querySelectorAll('.ui-controlgroup.column5.two_column')
    var eee=0
    var lists4 = document.querySelectorAll('.ui-controlgroup.column3.two_column')
    var ggg=0
    var lists5 = document.querySelectorAll('.ui-controlgroup.column1')
    var fff=0
    var liangbiao_index=0;
    var xiala_index=0;
    var ops;
    var bili;
    var temp_flag;
    var tiankong_list;
    var liangbiao_lists;
    var min_options;

    setTimeout(function(){
        //1
        ops = lists[ccc].querySelectorAll('.ui-radio')
        ccc+=1
        bili = [0,1,20,25,26,14,14]
        ops[danxuan(bili)].click()

        //2
        ops = lists[ccc].querySelectorAll('.ui-radio')
        ccc+=1
        bili = [90,20]
        ops[danxuan(bili)].click()

        //3
        ops = lists[ccc].querySelectorAll('.ui-radio')
        ccc+=1
        bili = [50,50]
        ops[danxuan(bili)].click()

        //4
        ops = lists[ccc].querySelectorAll('.ui-radio')
        ccc+=1
        bili = [50,50]
        ops[danxuan(bili)].click()

        //5
        aaa=4
        ops = lists1[aaa].querySelectorAll('.ui-radio')
        aaa+=1
        bili = [40,60]
        ops[danxuan(bili)].click()

        //6
        ops = lists2[ddd].querySelectorAll('.ui-radio')
        ddd+=1
        bili = [29,29,28,14]
        ops[danxuan(bili)].click()

        //7
        ops = lists[ccc].querySelectorAll('.ui-radio')
        ccc+=1
        bili = [70,30]
        ops[danxuan(bili)].click()

        //8
        ops = lists3[eee].querySelectorAll('.ui-radio')
        eee+=1
        bili = [20,20,20,20,20]
        ops[danxuan(bili)].click()

        //9
        ops = lists4[ggg].querySelectorAll('.ui-radio')
        ggg+=1
        bili = [20,80,50]
        ops[danxuan(bili)].click()

        //10
        ops = lists4[ggg].querySelectorAll('.ui-radio')
        ggg+=1
        bili = [80,45,26]
        ops[danxuan(bili)].click()

        //11
        ops = lists[ccc].querySelectorAll('.ui-radio')
        ccc+=1
        bili = [40,60]
        ops[danxuan(bili)].click()

        //12
        ops = lists[ccc].querySelectorAll('.ui-radio')
        ccc+=1
        bili = [60,40]
        ops[danxuan(bili)].click()

        //13
        ops = lists[ccc].querySelectorAll('.ui-radio')
        ccc+=1
        bili = [43,57]
        ops[danxuan(bili)].click()

        //14
        ops = lists[ccc].querySelectorAll('.ui-radio')
        ccc+=1
        bili = [40,60]
        ops[danxuan(bili)].click()

        setTimeout(function(){
            //15
            ops = lists4[ggg].querySelectorAll('.ui-radio')
            ggg+=1
            bili = [100,0,0]
            ops[danxuan(bili)].click()

            //16
            ops = lists4[ggg].querySelectorAll('.ui-radio')
            ggg+=1
            bili = [33,33,34]
            ops[danxuan(bili)].click()

            //17
            ops = lists4[ggg].querySelectorAll('.ui-radio')
            ggg+=1
            bili = [33,33,34]
            ops[danxuan(bili)].click()

            //18
            ops = lists4[ggg].querySelectorAll('.ui-radio')
            ggg+=1
            bili = [33,33,34]
            ops[danxuan(bili)].click()

            //19
            ops = lists4[ggg].querySelectorAll('.ui-radio')
            ggg+=1
            bili = [33,33,34]
            ops[danxuan(bili)].click()

            //20
            ops = lists4[ggg].querySelectorAll('.ui-radio')
            ggg+=1
            bili = [33,33,34]
            ops[danxuan(bili)].click()

            //21
            ops = lists4[ggg].querySelectorAll('.ui-radio')
            ggg+=1
            bili = [33,33,34]
            ops[danxuan(bili)].click()

            //22
            ops = lists4[ggg].querySelectorAll('.ui-radio')
            ggg+=1
            bili = [33,33,34]
            ops[danxuan(bili)].click()

            //23
            ops = lists4[ggg].querySelectorAll('.ui-radio')
            ggg+=1
            bili = [33,33,34]
            ops[danxuan(bili)].click()

            //24
            ops = lists4[ggg].querySelectorAll('.ui-radio')
            ggg+=1
            bili = [33,33,34]
            ops[danxuan(bili)].click()

            //25
            ops = lists4[ggg].querySelectorAll('.ui-radio')
            ggg+=1
            bili = [33,33,34]
            ops[danxuan(bili)].click()

            //26
            ops = lists4[ggg].querySelectorAll('.ui-radio')
            ggg+=1
            bili = [33,33,34]
            ops[danxuan(bili)].click()

            setTimeout(function(){
                //27
                ops = lists5[fff].querySelectorAll('.ui-radio')
                fff+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //28
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //29
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //30
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //31
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //32
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //33
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //34
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //35
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //36
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //37
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //38
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //39
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //40
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //41
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //42
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //43
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //44
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //45
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //46
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //47
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //48
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //49
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //50
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //51
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                //52
                ops = lists4[ggg].querySelectorAll('.ui-radio')
                ggg+=1
                bili = [33,33,34]
                ops[danxuan(bili)].click()

                setTimeout(function(){
                    //53
                    ops = lists5[fff].querySelectorAll('.ui-radio')
                    fff+=1
                    bili = [0,0,100,0,0,0]
                    ops[danxuan(bili)].click()

                    //54
                    ops = lists4[ggg].querySelectorAll('.ui-radio')
                    ggg+=1
                    bili = [68,70,20,10,30,20]
                    ops[danxuan(bili)].click()

                    //55
                    ops = lists4[ggg].querySelectorAll('.ui-radio')
                    ggg+=1
                    bili = [68,70,20,10,30,20]
                    ops[danxuan(bili)].click()

                    //56
                    ops = lists4[ggg].querySelectorAll('.ui-radio')
                    ggg+=1
                    bili = [68,70,20,10,30,20]
                    ops[danxuan(bili)].click()

                    //57
                    ops = lists4[ggg].querySelectorAll('.ui-radio')
                    ggg+=1
                    bili = [68,70,20,10,30,20]
                    ops[danxuan(bili)].click()

                    //58
                    ops = lists4[ggg].querySelectorAll('.ui-radio')
                    ggg+=1
                    bili = [68,70,20,10,30,20]
                    ops[danxuan(bili)].click()

                    //59
                    ops = lists4[ggg].querySelectorAll('.ui-radio')
                    ggg+=1
                    bili = [68,70,20,10,30,20]
                    ops[danxuan(bili)].click()

                    //60
                    ops = lists4[ggg].querySelectorAll('.ui-radio')
                    ggg+=1
                    bili = [68,70,20,10,30,20]
                    ops[danxuan(bili)].click()

                    //61
                    ops = lists4[ggg].querySelectorAll('.ui-radio')
                    ggg+=1
                    bili = [68,70,20,10,30,20]
                    ops[danxuan(bili)].click()

                    setTimeout(function(){
                        //62
                        ops = lists5[fff].querySelectorAll('.ui-radio')
                        fff+=1
                        bili = [0,0,100,0,0,0]
                        ops[danxuan(bili)].click()

                        //63
                        ops = lists5[fff].querySelectorAll('.ui-radio')
                        fff+=1
                        bili = [0,0,100,0,0,0]
                        ops[danxuan(bili)].click()

                        //64
                        ops = lists4[ggg].querySelectorAll('.ui-radio')
                        ggg+=1
                        bili = [68,70,20,10,30,20]
                        ops[danxuan(bili)].click()

                        //65
                        ops = lists4[ggg].querySelectorAll('.ui-radio')
                        ggg+=1
                        bili = [68,70,20,10,30,20]
                        ops[danxuan(bili)].click()

                        //66
                        ops = lists4[ggg].querySelectorAll('.ui-radio')
                        ggg+=1
                        bili = [68,70,20,10,30,20]
                        ops[danxuan(bili)].click()

                        //67
                        ops = lists4[ggg].querySelectorAll('.ui-radio')
                        ggg+=1
                        bili = [68,70,20,10,30,20]
                        ops[danxuan(bili)].click()

                        //68
                        ops = lists4[ggg].querySelectorAll('.ui-radio')
                        ggg+=1
                        bili = [68,70,20,10,30,20]
                        ops[danxuan(bili)].click()

                        //69
                        ops = lists4[ggg].querySelectorAll('.ui-radio')
                        ggg+=1
                        bili = [68,70,20,10,30,20]
                        ops[danxuan(bili)].click()

                        setTimeout(function(){
                            //70
                            ops = lists5[fff].querySelectorAll('.ui-radio')
                            fff+=1
                            bili = [0,0,100,0,0,0]
                            ops[danxuan(bili)].click()

                            //71
                            ops = lists4[ggg].querySelectorAll('.ui-radio')
                            ggg+=1
                            bili = [68,70,20,10,30,20]
                            ops[danxuan(bili)].click()

                            //72
                            ops = lists5[fff].querySelectorAll('.ui-radio')
                            fff+=1
                            bili = [0,0,100,0,0,0]
                            ops[danxuan(bili)].click()

                            //73
                            ops = lists4[ggg].querySelectorAll('.ui-radio')
                            ggg+=1
                            bili = [68,70,20,10,30,20]
                            ops[danxuan(bili)].click()

                            //74
                            ops = lists4[ggg].querySelectorAll('.ui-radio')
                            ggg+=1
                            bili = [68,70,20,10,30,20]
                            ops[danxuan(bili)].click()

                            //75
                            ops = lists4[ggg].querySelectorAll('.ui-radio')
                            ggg+=1
                            bili = [68,70,20,10,30,20]
                            ops[danxuan(bili)].click()

                            //76
                            ops = lists4[ggg].querySelectorAll('.ui-radio')
                            ggg+=1
                            bili = [68,70,20,10,30,20]
                            ops[danxuan(bili)].click()

                            //77
                            ops = lists4[ggg].querySelectorAll('.ui-radio')
                            ggg+=1
                            bili = [68,70,20,10,30,20]
                            ops[danxuan(bili)].click()

                            setTimeout(function(){
                                //78
                                ops = lists5[fff].querySelectorAll('.ui-radio')
                                fff+=1
                                bili = [0,0,100,0,0,0]
                                ops[danxuan(bili)].click()

                                //79
                                ops = lists4[ggg].querySelectorAll('.ui-radio')
                                ggg+=1
                                bili = [68,70,20,10,30,20]
                                ops[danxuan(bili)].click()

                                //80
                                ops = lists4[ggg].querySelectorAll('.ui-radio')
                                ggg+=1
                                bili = [68,70,20,10,30,20]
                                ops[danxuan(bili)].click()

                                //81
                                ops = lists4[ggg].querySelectorAll('.ui-radio')
                                ggg+=1
                                bili = [68,70,20,10,30,20]
                                ops[danxuan(bili)].click()

                                //82
                                ops = lists4[ggg].querySelectorAll('.ui-radio')
                                ggg+=1
                                bili = [68,70,20,10,30,20]
                                ops[danxuan(bili)].click()

                                //83
                                ops = lists4[ggg].querySelectorAll('.ui-radio')
                                ggg+=1
                                bili = [68,70,20,10,30,20]
                                ops[danxuan(bili)].click()

                                //84
                                ops = lists4[ggg].querySelectorAll('.ui-radio')
                                ggg+=1
                                bili = [68,70,20,10,30,20]
                                ops[danxuan(bili)].click()

                                //85
                                ops = lists4[ggg].querySelectorAll('.ui-radio')
                                ggg+=1
                                bili = [68,70,20,10,30,20]
                                ops[danxuan(bili)].click()

                                //86
                                ops = lists4[ggg].querySelectorAll('.ui-radio')
                                ggg+=1
                                bili = [68,70,20,10,30,20]
                                ops[danxuan(bili)].click()

                                //87
                                ops = lists4[ggg].querySelectorAll('.ui-radio')
                                ggg+=1
                                bili = [68,70,20,10,30,20]
                                ops[danxuan(bili)].click()

                            }, 2000)

                        }, 1900)

                    }, 1800)

                }, 1700)

            }, 1600)

        }, 1500)

    }, 1400)



    let count = 0
    //提交函数
    setTimeout( function(){
        document.querySelector('#ctlNext').click()
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
                }, 3000 );
            }, 2 * 1000 );
    }, 15000 );

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