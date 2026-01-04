// ==UserScript==
// @name         问卷星自动填写(可修改比例)2024最新
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  可以定制每个选项比例概率，刷问卷前需要改比例，或者直接使用网站自动刷问卷星，问卷网，腾讯问卷，见数：http://101.42.30.185:6699/login 并且解除问卷星对选中和右键的限制，不懂的可以加QQ群交流，QQ群：1027881795 ，本群有一键填写问卷星的软件（非脚本）需要做大量填写问卷的可以咨询，服务快捷，价格优惠。
// @author       阿龙
// @license    	 MIT
// @match        https://www.wjx.cn/*
// @downloadURL https://update.greasyfork.org/scripts/478661/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%28%E5%8F%AF%E4%BF%AE%E6%94%B9%E6%AF%94%E4%BE%8B%292024%E6%9C%80%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/478661/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%28%E5%8F%AF%E4%BF%AE%E6%94%B9%E6%AF%94%E4%BE%8B%292024%E6%9C%80%E6%96%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //此脚本无法更改ip，仅供刷少量问卷使用，如有大量需求请进入qq群：1027881795咨询一键填写问卷星软件
    //下面链接替换为自己的链接
    var wenjuan_url = 'https://www.wjx.cn/vj/tkP2UWw.aspx'//此链接为测试连接
    //下面为提交时间（秒）
    var time=10
    //以下为比例请根据自己的问卷进行修改
    let answerProportion = [
        [50,50],//第1题单选
        ['12','13','14','16','17','18','19','20','21'],//第2题填空
        [20, 30, 30, 20],//第3题单选
        [50,50],//第4题单选
        [33, 34, 33],//第5题单选
        [50,50,50,50],//第6题多选
        [50,50,50,50],//第7题多选
        [50,50],//第8题单选
        [50,50],//第9题单选
        [50,50],//第10题单选
        [[20,20,20,20,20],[20,20,20,20,20],[20,20,20,20,20],[20,20,20,20,20],[20,20,20,20,20],[20,20,20,20,20]],//第11题量表题
        ['没有意见','非常牛','非常棒'],//第12题填空
    ]





    //只改上面比例     注意格式（用英文输入法）
    //下面的代码不要动
    let currentUrl = window.location.href;
    wenjuan_url = wenjuan_url.replace(/\/vm\//g, "/vj/").split('#')[0];
    if (!currentUrl.includes("/vj/")) {
        window.location.href = currentUrl.replace("/vm/", "/vj/").split('#')[0];
    }
    if(window.location.href.indexOf('https://www.wjx.cn/wjx/join/complete.aspx')!=-1){
        window.location.href=wenjuan_url;
    }else if(window.location.href==wenjuan_url){
    }else{
        return
    }
    function randint(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    function radio(bili) {
        const pp = Math.floor(Math.random() * 100) + 1;
        let end = 0;
        for (let i = 0; i < bili.length; i++) {
            end += bili[i];
            if (pp <= end) {
                return i;
            }
        }
    }
    function multiselect(probability) {
        return Math.random() * 100 < probability;
    }

    function judgeType(answerProportion) {
        var q = document.getElementsByClassName("div_question");
        for (var i = 0; i < q.length; i++) {
            if ((q[i].querySelectorAll(".ulradiocheck")[0]) && (q[i].querySelectorAll("input")[0])) {
                var input = q[i].querySelectorAll("input");
                if (input[0].type == 'radio') {
                    var list = q[i].querySelectorAll("li");
                    list[radio(answerProportion[i])].click();

                } else if (input[0].type == 'checkbox') {
                    var li = q[i].querySelectorAll("li");
                    let temp_flag = false
                    while(!temp_flag){
                        for(let count = 0;count<answerProportion[i].length;count++){
                            if(multiselect(answerProportion[i][count])){
                                li[count].click();
                                temp_flag = true;
                            }
                        }
                    }
                }

            } else if (q[i].querySelectorAll("table")[0]) {
                if (q[i].querySelectorAll("input")[0]) {
                    input = q[i].querySelectorAll("input");
                    if (input[0].type == 'radio') {

                        var tr = q[i].querySelectorAll("tbody > tr");
                        for (var ai = 0; ai < tr.length; ai++) {
                            var td = tr[ai].querySelectorAll("td");
                            td[radio(answerProportion[i][ai])].click();
                        }

                    }
                }
            } else if (q[i].querySelectorAll("textarea")[0]) {
                q[i].querySelector("textarea").value=answerProportion[i][randint(0,answerProportion[i].length - 1)]
            }
        }
    }
    judgeType(answerProportion);

    //提交函数
    let count = 0
    setTimeout( function(){
        document.querySelector('#submit_button').click()
        setTimeout( function(){
            document.querySelector('#SM_BTN_1').click()
            setInterval( function(){
                try{yanzhen();count+=1;}
                catch(err){if(count>=6){location.reload()}
                          }
            }, 500 );
        }, 0.1 * 1000 );
    }, time * 1000 );
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
    //滚动到提交按钮处
    window.onload = function() {

        try {
            var scrollvalue = document.getElementById("submit_button").offsetParent.offsetParent.offsetTop;
            window.scrollTo({
                top: scrollvalue,
                behavior: "smooth"
            });
        } catch (error) {
            console.log("error", error);
        }}
    document.oncontextmenu = function () {
        return true;
    };
    document.onselectstart = function () {
        return true;
    };
    $("body").css("user-select", "text");
})();
