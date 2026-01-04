// ==UserScript==
// @name        自定义问卷星—测试
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  特定问卷星填写
// @author       YWL
// @include     https://www.wjx.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @match        https://www.wjx.cn/*
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/441508/%E8%87%AA%E5%AE%9A%E4%B9%89%E9%97%AE%E5%8D%B7%E6%98%9F%E2%80%94%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/441508/%E8%87%AA%E5%AE%9A%E4%B9%89%E9%97%AE%E5%8D%B7%E6%98%9F%E2%80%94%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

/* 
  操作教程可以查看我的博文：https://itxiaoye.top/article/10
  如果有什么问题可以一块探讨的，在博文下边给我评论留言就行
*/

(function() {
    'use strict';
    var shua_num = 0; // 当前刷的份数
    var shau_num_total = 500; // 要刷的总份数

    if(!GM_getValue('shua_num_1')){ // 保存全局缓存变量
        GM_setValue('shua_num_1', 1);
    }

    //===========================开始==============================
    clearCookie();

    var wenjuan_url = 'https://www.wjx.cn/vj/Pof3FuQ.aspx'; // 需要刷的问卷网址
    var success_url = 'https://www.wjx.cn/wjx/join/complete.aspx'; // 提交成功后跳转的网址除参数部分

    /*判断当前处于哪个网址*/
    if(window.location.href.indexOf(success_url)!=-1){ // 当前处于提交成功的网址
        if(shua_num < shau_num_total){ // 如果还没有完成需要的份数
            /*刷的份数加一*/
           shua_num = GM_getValue('shua_num_1') +1;
           GM_setValue('shua_num_1', shua_num);

           window.location.href=wenjuan_url; // 跳转到问卷网址
        }
    }else if(window.location.href==wenjuan_url){ // 当前为问卷网址，则接着下边的操作
    }else{ // 当前是其他网址则不进行任何操作
        return
    }

    /*滚动到末尾*/
    window.scrollTo(0,document.body.scrollHeight)

    var lists = document.querySelectorAll('.ulradiocheck') // 题目列表,获取题块列表
    var ccc=0; // 当前题目下标
    var ops; // 当前题目
    var now_select = getIndex([353,941,2118,5412,1176]); // 为了避免题目之间的无关联，先选出主体的选项（以13题作为主体）

    /*根据自定的规则给所有的题目选上选项*/
    for(var i=0;i<=lists.length-1;i++){
        switch(i){
            case 0: // 第一道题
                ops = lists[i].querySelectorAll('li'); //获取题目中的选项列表
                ops[getIndex([3647,6353])].click(); // 点击根据getIndex获取到的选项
                break;
            case 1:
                ops = lists[i].querySelectorAll('li');
                ops[getIndex([1353,1529,2706,4412])].click();
                break;
            case 2:
                ops = lists[i].querySelectorAll('li');
                //由于从3题开始之后所有的题目存在关联关系，需要确保可信度，所以做一些简单的限制
                ops[getSelectIndex([706,1765,3647,3176,706],now_select)].click();
                break;
            case 3:
                ops = lists[i].querySelectorAll('li');
                ops[getSelectIndex([353,941,2118,5412,1176],now_select)].click();
                break;
            case 4:
                ops = lists[i].querySelectorAll('li');
                ops[getSelectIndex([471,1765,4353,2941,471],now_select)].click();
                break;
            case 5:
                ops = lists[i].querySelectorAll('li');
                ops[getSelectIndex([118,1176,1765,5647,1294],now_select)].click();
                break;
            case 6:
                ops = lists[i].querySelectorAll('li');
                ops[getSelectIndex([659,635,1765,6353,588],now_select)].click();
                break;
            case 7:
                ops = lists[i].querySelectorAll('li');
                ops[getSelectIndex([824,941,3529,4353,353],now_select)].click();
                break;
            case 8:
                ops = lists[i].querySelectorAll('li');
                ops[getSelectIndex([235,1176,3765,4353,471],now_select)].click();
                break;
            case 9:
                ops = lists[i].querySelectorAll('li');
                ops[getSelectIndex([235,1647,3059,4588,471],now_select)].click();
                break;
            case 10:
                ops = lists[i].querySelectorAll('li');
                ops[getSelectIndex([588,1176,3176,4588,471],now_select)].click();
                break;
            case 11:
                ops = lists[i].querySelectorAll('li');
                ops[getSelectIndex([235,941,2941,5059,824],now_select)].click();
                break;
            case 12:
                ops = lists[i].querySelectorAll('li');
                ops[getSelectIndex([235,706,3294,4941,824],now_select)].click();
                break;
            case 13:
                ops = lists[i].querySelectorAll('li');
                ops[getSelectIndex([235,1294,3529,4118,824],now_select)].click();
                break;
            case 14:
                ops = lists[i].querySelectorAll('li');
                ops[getSelectIndex([588,1412,3294,4000,706],now_select)].click();
                break;
            case 15:
                ops = lists[i].querySelectorAll('li');
                ops[getSelectIndex([706,1529,3647,3412,706],now_select)].click();
                break;
            case 16:
                ops = lists[i].querySelectorAll('li');
                ops[getSelectIndex([471,2000,4000,2941,588],now_select)].click();
                break;
            case 17:
                ops = lists[i].querySelectorAll('li');
                ops[getSelectIndex([341,1059,3529,3529,941],now_select)].click();
                break;

        }
    }

    /*问卷提交函数*/
    setTimeout( function(){
        document.querySelector('#submit_button').click() // 点击提交按钮
        setTimeout( function(){
            document.querySelector('#SM_BTN_1').click() // 点击智能验证按钮
            setInterval( function(){
                try{
                    yanzhen(); // 滑动滑块
                }
                catch(err){
                    
                }
            }, 500 );
        }, 1000 );
    }, 2000 );

    //===========================结束==============================

    /**
     * 返回单选下标，根据传入的题目每道题的概率数组，返回当前需要选择的题目选项下标
     * @param:round 概率数组
    */
    function getIndex(round){
        var data = Math.floor(Math.random() * 10000) + 1;
        for(let i =0;i<round.length;i++){
            data = data - round[i];
            if(data <= 0){
                console.log(data+","+i)
                return i;
            }
        }
        return round.length - 1;
    }

    /**
     * 返回基于主选的单选下标，根据传入的题目每道题的概率数组以及主选的选项下标，返回当前需要选择的题目选项下标
     * @param:round 概率数组
     * @param:select 当前的主选下标
    */
     function getSelectIndex(round,select){
         var randomMax = 0; // 随机最大
         const randomMin = 1; // 随机最小
         const randomAdd = 10000; //提高的概率数
         var start = 0; // 循环起始下标
         var length = 0; // 循环次数
        if(select == 0){
            start = 0;
            length = 2;
            randomMax = round[0] + round[1];
        }
        else if(select == round.length - 1){
            start = round.length - 2;
            length = 2;
            randomMax = round[round.length - 2] + round[round.length - 1];
        }
        else{
            start = select - 1;
            length = 3;
            randomMax = round[select - 1] + round[select] + round[select+1];
        }
        length = start+ length;
        randomMax = randomAdd+randomMax;



        var data = Math.floor(Math.random() * randomMax) + randomMin;
        for(let i =start;i<length;i++){
            data = data - round[i];
            if(i == select){
                data = data - randomAdd;
            }
            if(data <= 0){
                console.log(data+","+i)
                return i;
            }
        }
        return start + length - 1;
    }

    //清除cookie
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
        Object.defineProperty(event,'clientX',{get(){return 130;}})
        document.querySelector("#nc_1_n1z").dispatchEvent(event);
        event.initEvent('mousemove', true, false);
        Object.defineProperty(event,'clientX',{get(){return 130;}})
        document.querySelector("#nc_1_n1z").dispatchEvent(event);
    }

})();