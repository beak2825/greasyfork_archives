// ==UserScript==
// @name         mud红包脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  脚本
// @author       髹影凌风
// @match        http://xo.zjmud.cn:210/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413480/mud%E7%BA%A2%E5%8C%85%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/413480/mud%E7%BA%A2%E5%8C%85%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //插入抢红包按钮style
    document.getElementsByTagName('head')[0].innerHTML +=
        '<style type="text/css">' +
        /*悬浮窗口总体DIV Hongbaosqu-side*/
        '#Hongbaosqu-side{width:250px;height:auto;margin:0px;position:fixed;background:red;z-index:999999;overflow:hidden;top:40%;right:-220px;' +
        /*具体负的值根据为*/
        '-webkit-transition: .5s ease-in-out;-moz-transition: .5s ease-in-out;-o-transition: .5s ease-in-out;}' +

        /*悬浮窗口内容DIV Hongbaosqu-sidec*/
        '.Hongbaosqu-sidec{float:right;width:210px;border:2px solid #ccc;box-shadow:0px 5px 5px #565656;-webkit-box-shadow:0px 5px 5px #565656;-moz-box-shadow:0px 5px 5px #565656;-o-box-shadow:0px 5px 5px #565656;}' +
        /*鼠标触发渐显效果*/
        '#Hongbaosqu-side:hover{right:0px;}' +
        '#Hongbaosqu-side:hover .Hongbaosqu-sideb .b{opacity:0;filter:alpha(opacity=0);}' +
        '</style>'

    //制作抢红包悬浮按钮
    var div = document.createElement('div');
    div.innerHTML = '<!--侧栏漂浮开始-->' +
        '<div id="Hongbaosqu-side">' +
        '<div class="Hongbaosqu-sidec">' +
        '<button id="hongbaoLock" >启动脚本</button>' +
        '</div>' +
        '</div>' +
        '<!--侧栏漂浮结束-->';
    document.getElementsByTagName('body')[0].appendChild(div);

    //启动脚本
    //绑定按钮
    document.querySelector('button[id="hongbaoLock"]').onclick = SwitchJS;

    var a;
    var luckymoney;
    var outspan = '';

    function SwitchJS() {

        //开启脚本
        if (document.querySelector('button[id="hongbaoLock"]').innerText == '启动脚本') {
            //改变按钮为关闭按钮
            document.querySelector('button[id="hongbaoLock"]').innerText = '关闭脚本';


            //300ms的定时监视器
            a = setInterval(function () {
                console.log(new Date());
                outspan_loop();//信息窗口

            }, 300);
        }

        //关闭脚本
        else {
            clearInterval(a);

            //改变按钮为启动按钮
            document.querySelector('button[id="hongbaoLock"]').innerText = '启动脚本';

        }
    }

    //处理信息的方法
    function outspan_loop() {
        //获取消息窗口最后一条信息
        let outspannew = document.querySelector("div[id='out']").lastChild.innerText;;
        
        //console.log('"' + outspan + '"');
        //如果获取信息与上一次获取的是重复的，那么不执行
        if (outspannew != outspan) {
            outspan = outspannew;
            console.count(outspan + '出现次数:');
            switch (outspan) {
                case '系统的红包倒计时：2\n':
                    //每200ms的定时点击'打开'按钮抢红包且唯一
                    luckymoney = setInterval(function () {
                        //找到红包并点击
                        document.querySelector("input[value='打开']").click();
                    }, 50);//200毫秒
                    break;

                case '你已经拆过这个红包了！\n':
                        luckymoney = clearInterval(luckymoney);//清除抢红包计时事件
                    break;

                case '现在没有人发红包或者本轮红包已抢光！\n':
                        luckymoney = clearInterval(luckymoney);//清除抢红包计时事件
                    break;
            };
        };
    };

})();