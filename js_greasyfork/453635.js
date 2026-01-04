// ==UserScript==
// @name         问卷网定制比例模板(自动填写)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  2022最新版，刷问卷前需要改代码，自定义每个选项比例概率，目前模板支持单选,多选,填空，有其它高级题型可进群定制脚本。个人网站自动刷问卷星，问卷网，腾讯问卷，见数：http://101.42.30.185:6699/login  不懂的可以加QQ群交流，QQ群：1027881795 本群提供定制脚本刷问卷服务，服务快捷，价格优惠。https://www.wenjuan.com/s/UZBZJvwFQz/ 是测试脚本问卷。
// @author       阿龙
// @license     at
// @include     https://www.wenjuan.com/*
// @downloadURL https://update.greasyfork.org/scripts/453635/%E9%97%AE%E5%8D%B7%E7%BD%91%E5%AE%9A%E5%88%B6%E6%AF%94%E4%BE%8B%E6%A8%A1%E6%9D%BF%28%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%29.user.js
// @updateURL https://update.greasyfork.org/scripts/453635/%E9%97%AE%E5%8D%B7%E7%BD%91%E5%AE%9A%E5%88%B6%E6%AF%94%E4%BE%8B%E6%A8%A1%E6%9D%BF%28%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    clearCookie();
    //===========================开始==============================
 
    // 精确匹配某一个地址
    if(window.location.href !== 'https://www.wenjuan.com/s/UZBZJvwFQz/'){
        return;
    }
    setTimeout( function(){
        if (!!document.querySelector("body > div > div.content-wrapper > div > div.link-btn-wrapper > div:nth-child(2)")){
            document.querySelector("body > div > div.content-wrapper > div > div.link-btn-wrapper > div:nth-child(2)").click()
            console.log(1)
        }
    }, 1 * 1000 )
 
    //滚动到末尾
    window.scrollTo(0,document.body.scrollHeight)
 
    //获取题块列表
    var lists=document.querySelectorAll('.question-box')
    var layoutTime = 2;//设置多少秒自动提交
    var number=0;
    var ops;
    var ratio;
    var temp_flag;
    var tiankong_list;
 
 
    //1
    ops = lists[number].querySelectorAll("span input")
    number+=1
    ratio = [25,25,25,25];
    ops[danxuan(ratio)].click()
    //2
    ops = lists[number].querySelectorAll("span input")
    number+=1
    ratio = [50,50];
    ops[danxuan(ratio)].click()
    //3
    ops = lists[number].querySelectorAll("span input")
    number+=1
    ratio = [15,20,20,15,15,15];
    ops[danxuan(ratio)].click()
    //4
    ops = lists[number].querySelectorAll('span input')
    number+=1
    ratio = [50,50,50,50,50,50];
    temp_flag = false
    while(!temp_flag){
        for(let count = 0;count<ratio.length;count++){
            if(duoxuan(ratio[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }
    //5
    ops = lists[number].querySelectorAll('span input')
    number+=1
    ratio = [50,50,50,50,50];
    temp_flag = false
    while(!temp_flag){
        for(let count = 0;count<ratio.length;count++){
            if(duoxuan(ratio[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }
    //6
    ops = lists[number].querySelectorAll("span input")
    number+=1
    ratio = [50,50];
    ops[danxuan(ratio)].click()
 
    //7
    tiankong_list = ['苹果','香蕉','葡萄','红龙果'];
    ratio = [25,25,25,25];
    textareaValue(lists[number].querySelector('textarea'),tiankong_list[danxuan(ratio)]);
 
    //提交函数
    setTimeout( function(){
        document.querySelector("#answer-submit-btn").click()
        setTimeout(() =>{
            clearCookie()
            history.go(0);
            if (!!document.querySelector("body > div > div.content-wrapper > div > div.link-btn-wrapper > div:nth-child(2)")){
                document.querySelector("body > div > div.content-wrapper > div > div.link-btn-wrapper > div:nth-child(2)").click()
 
            }
 
        },1*1000)
    }, layoutTime * 1000 )
 
    /*
    //---------------------------------------------------------------------------------------------------
 
    //单选题模板
    ops = lists[number].querySelectorAll("span input")
    number+=1
    ratio = [];
    ops[danxuan(ratio)].click()
 
    //---------------------------------------------------------------------------------------------------
 
    //多选题模板（至少选一个选项）
     ops = lists[number].querySelectorAll('span input')
    number+=1
    ratio = [50,50,50,50,50,50];
    temp_flag = false
    while(!temp_flag){
        for(let count = 0;count<ratio.length;count++){
            if(duoxuan(ratio[count])){
                ops[count].click();
                temp_flag = true;
            }
        }
    }
    //填空题模板（多个答案，可定制比例）
    tiankong_list = ['王翠花','小明','小红'];
    ratio = [33,33,34];
    lists[number].querySelector('textarea').value=tiankong_list[danxuan(ratio)]
    number+=1;
 
    //---------------------------------------------------------------------------------------------------
 
    //单选的量表题模板
    ops = lists[number].querySelectorAll('.op_circle')
    number+=1
    ratio = [0,20,30,0,50];
    ops[danxuan(ratio)].click()
 
    //---------------------------------------------------------------------------------------------------
 
*/
    //===========================结束==============================
    //返回随机比例参数为随机个数
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
    //判断num是否在指定区间内
    function isInRange(num,start,end){
        if(num>=start && num<=end){
            return true;
        }else{
            return false;
        }
    }
    //单选题执行函数
    function danxuan(ratio){
        var pp = randomNum(1,100)
        for(var i=1;i<=ratio.length;i++){
            var start = 0;
            if(i!=1){
                start = leijia(ratio,i-1)
            }
            var end = leijia(ratio,i);
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
    //填空执行函数
    function textareaValue(inputDom,newText){
        inputDom.value = newText
        inputDom.dispatchEvent(new Event('input'))
        inputDom.dispatchEvent(new Event('click'))
        inputDom.dispatchEvent(new Event('blur'))
        inputDom.dispatchEvent(new Event('focus'))
    }
 
})();