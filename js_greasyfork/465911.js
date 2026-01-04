// ==UserScript==
// @name         安琪拉自动化程序
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  可定制每个选项比例概率，刷问卷前需要改代码。
// @author       ZYY
// @include     https://www.wjx.cn/*
// @license ZYY
// @downloadURL https://update.greasyfork.org/scripts/465911/%E5%AE%89%E7%90%AA%E6%8B%89%E8%87%AA%E5%8A%A8%E5%8C%96%E7%A8%8B%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/465911/%E5%AE%89%E7%90%AA%E6%8B%89%E8%87%AA%E5%8A%A8%E5%8C%96%E7%A8%8B%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //===========================开始==============================


    //*************************************************************************************************************************************************************************************



    //*************************************************************************************************************************************************************************************

    //填写刷问卷的网址  注意，如果问卷中的网址中间是vj,一定要改成vm!!!,像这样 https://www.wjx.cn/vm/QvfxoEU.aspx
    var wenjuan_url = 'https://www.wjx.cn/vm/QvfxoEU.aspx';

    //------------------------------下边的网址不要改！！！！！！！！！！！！！！！！！！！！
    if(window.location.href.indexOf('https://www.wjx.cn/wjx/join/completemobile2.aspx?')!=-1){
        window.location.href=wenjuan_url;
    }else if(window.location.href==wenjuan_url){
    }else{
        return
    }
    //start...

    clearCookie();

    //滚动到末尾
    // window.scrollTo(0,document.body.scrollHeight)

    //获取题块列表
    var lists = document.querySelectorAll('.fieldset>div[class="field ui-field-contain"]')
    var ccc=0;
    var liangbiao_index=0;
    var xiala_index=0;
    var ops;
    var bili;
    var temp_flag;
    var tiankong_list;
    var liangbiao_lists;
    var min_options;
    var array;

    //1
    ops = lists[ccc].querySelectorAll('.ui-radio')
    ccc+=1
    bili = [35,65];
    ops[danxuan(bili)].click()
    //2
    ops = lists[ccc].querySelectorAll('.ui-radio')
    ccc+=1
    bili = [100,0];
    ops[danxuan(bili)].click()
    //3
    ops = lists[ccc].querySelectorAll('.ui-radio')
    ccc+=1
    bili = [85,15,0,0];
    ops[danxuan(bili)].click()
    //4
    ops = lists[ccc].querySelectorAll('.ui-radio')
    ccc+=1
    bili = [0,10,90];
    ops[danxuan(bili)].click()
    //5
    ops = lists[ccc].querySelectorAll('.ui-radio')
    ccc+=1
    bili = [95,5,0,0];
    ops[danxuan(bili)].click()
    //6
    ops = lists[ccc].querySelectorAll('.ui-radio')
    ccc+=1
    bili = [50,50];
    ops[danxuan(bili)].click()
    //7
    //多选题模板（至少选一个选项）
    ops = lists[ccc].querySelectorAll('.ui-checkbox')
    ccc+=1
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

    //8
    //多选题模板（至少选一个选项）
    ops = lists[ccc].querySelectorAll('.ui-checkbox')
    ccc+=1
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
    //9

    //填空题模板（固定答案）
    document.querySelector('#q9').value='自定义答案'
    ccc+=1

   










    /*
    //---------------------------------------------------------------------------------------------------

    //单选题模板
    ops = lists[ccc].querySelectorAll('.ui-radio')
    ccc+=1
    bili = [];
    ops[danxuan(bili)].click()

    //---------------------------------------------------------------------------------------------------

    //多选题模板（至少选一个选项）
    ops = lists[ccc].querySelectorAll('.ui-checkbox')
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
    ops = lists[ccc].querySelectorAll('.ui-checkbox');
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
    ccc+=1

    //---------------------------------------------------------------------------------------------------

    //填空题模板（多个答案，可定制比例）
    tiankong_list = ['王翠花','小明','小红'];
    ccc+=1
    bili = [33,33,34];
    document.querySelector('#q题号').value=tiankong_list[danxuan(bili)]

    //---------------------------------------------------------------------------------------------------

    //单选的量表题模板
    liangbiao_lists = document.querySelectorAll('#div题号 tbody tr[tp="d"]')
    ccc+=1
    liangbiao_index=0
    //题号-1
    ops = liangbiao_lists[liangbiao_index].querySelectorAll('td a')
    liangbiao_index+=1
    bili = [20,20,20,20,20];
    ops[danxuan(bili)].click()

    //---------------------------------------------------------------------------------------------------

    //多选的量表题模板
    liangbiao_lists = document.querySelectorAll('#div题号 tbody tr[tp="d"]')
    liangbiao_index=0
    //题号-1
    ops = liangbiao_lists[liangbiao_index].querySelectorAll('td a')
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
    ccc+=1
    ops = document.querySelectorAll('#select2-q题号-results li')
    ops = Array.prototype.slice.call(ops); //非ie浏览器正常
    ops = ops.slice(1,ops.length);
    bili = randomBili(ops.length-1);//默认所有选项平均分配
    xialaElement_click(ops[danxuan(bili)])

    //---------------------------------------------------------------------------------------------------

*/
    //===========================结束==============================
    //获取cookie
    function getCookie(objName) {//获取指定名称的cookie的值
        var arrStr = document.cookie.split("; ");
        for (var i = 0; i < arrStr.length; i++) {
            var temp = arrStr[i].split("=");
            if (temp[0] == objName) return unescape(temp[1]);  //解码
        }
        return "";
    }
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

    //end...

})();