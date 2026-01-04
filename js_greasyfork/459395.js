// ==UserScript==
// @name         Bad Apple for Github
// @namespace    https://xiaohe321.net/
// @version      0.1
// @description  Bad Apple!!!
// @author       XiaoHe321
// @match        https://github.com/*
// @icon         https://oss-back-hk.xiaohe321.net/misc/badappple/BadAppleLogo.jpg
// @grant        GM_xmlhttpRequest
// @connect      oss-back-hk.xiaohe321.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459395/Bad%20Apple%20for%20Github.user.js
// @updateURL https://update.greasyfork.org/scripts/459395/Bad%20Apple%20for%20Github.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Y轴最大值（从0开始）
    const maxY = 6;
    //X轴最大值（从0开始）
    const maxX = 52;

    //睡眠参数，如果FPS不稳定（控制台输出的sleep_jitter过大），可适当增加此值，反之可减少
    const sleep_offset=10;
    //两帧之间的间隔时间（注意：根据js的特性，此值最终导致的休眠时间并不稳定，请具体测试）
    const sleep_time=100;

    console.log("%c[Bad Apple] for [Github]",'color:red; font-weight:bold');
    var img=[]
    var hasStarted=false;
    function initData(){
        console.log("[BadApple]","准备获取帧数据");
        GM_xmlhttpRequest({
            url:"https://oss-back-hk.xiaohe321.net/misc/badappple/badapple.json",
            method :"GET",
            onload:function(xhr){
                console.log("[BadApple]","获取帧数据成功，Bad Apple已装填！！");
                img=eval("("+ xhr.responseText +")");
                getElementByXpath('//*[@id="user-profile-frame"]/div/div[3]/div/div[1]/div[1]/div[1]/div/div[1]/div/div/div[1]').innerHTML +="√"
            }
        });
    }

    function addClass(element, className) {
        let classAtr = element.getAttribute("class");
        let newClass = classAtr.concat(" " + className);
        element.setAttribute("class", newClass);
    }

    function removeClass(element, className) {
        let classAtr = element.getAttribute("class");
        let newClass = classAtr.replace(className, "");
        element.setAttribute("class", newClass);
    }

    function getElementByXpath(xpath) {
        var element = document.evaluate(xpath, document).iterateNext();
        return element;
    }

    async function changeLevel(x, y, level,is_remove_active=false) {
        var elem = document.getElementsByClassName('js-calendar-graph').item(0).children.item(0).children.item(0).children.item(x).children.item(y);
        if (elem == null) {
            return;
        }
        if(is_remove_active){
            removeClass(elem, "active")
        }
        elem.setAttribute("data-level", level)
    }


    function greyToLevel(grey) {
        let val = Math.trunc(grey / 51)
        if (val == 5) {
            val = 4;
        }
        return val;
    }

    function updateButtonAndText() {
        var buttonItem = document.querySelector("contribution-graph-celebration").children.item(0)

        buttonItem.addEventListener('', function () { }, true)
        buttonItem.addEventListener('click', buttonOnClick, true)
        getElementByXpath('//*[@id="user-profile-frame"]/div/div[3]/div/div[1]/div[1]/div[1]/div/div[1]/div/div/div[2]/a').innerHTML = '<a href="#">Let\'s Bad Apple!!</a>'
    }

    async function buttonOnClick(e) {
        if(hasStarted) return;

        e.stopPropagation()
        clearImage();
        document.getElementsByTagName("contribution-graph-celebration")[0].children.item(0).children.item(0).children.item(0).children.item(0).setAttribute("hidden", "")
        document.getElementsByTagName("contribution-graph-celebration")[0].children.item(0).children.item(0).children.item(0).children.item(1).removeAttribute("hidden")
        document.getElementsByTagName("contribution-graph-celebration")[0].children.item(0).children.item(0).children.item(0).children.item(2).innerText = "Happy BadApple !!"

        await DrawImage();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function clearImage() {
        for (var i = 0; i <= maxX; i++) {
            for (var j = 0; j <= maxY; j++) {
                changeLevel(i, j, 0,true)
            }
        }
    }

    async function DrawInner(idx){
        for (var i3 = 0; i3 <= 52; i3++) {
            for (var j3 = 0; j3 <= 9; j3++) {
                changeLevel(i3, j3, greyToLevel(img[idx][j3][i3]))
            }
        }
    }

    async function DrawImage() {
        console.log("[BadApple]","Start drawing!");
        hasStarted=true;
        var startTime=performance.now();

        var last_frame=0;
        var total=0;
        var i=0;

        for(var idx=0;idx<6525;idx+=3){

            last_frame=performance.now()

            //画一帧
            var draw_start=performance.now()
            await DrawInner(idx);
            var draw_end=performance.now()

            var now_fps=(idx/((performance.now()-startTime)/(1000)));

            //帧间休眠
            await sleep(sleep_time-(draw_end-draw_start)-10);

            var real_sleep=performance.now()-last_frame;

            total+=real_sleep;
            var avg_sleep=total/(++i);
            console.log("[BadApple]","draw time=",(draw_end-draw_start).toFixed(2)+"ms","fps=",now_fps.toFixed(2),"\r\nframe id=",idx,"sleep jitter=",(avg_sleep-sleep_time).toFixed(4)+"ms","real sleep=",real_sleep.toFixed(4)+"ms");
        }
    }

    initData();
    updateButtonAndText();

})();