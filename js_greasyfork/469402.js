// ==UserScript==
// @name         极客时间自动阅读器
// @namespace    http://.net/
// @version      0.2
// @description  极客时间自动阅读器1.0
// @author       Time
// @match        https://time.geekbang.org/column/article/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geekbang.org
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-simulate/1.1.1/jquery.simulate.min.js
// @license      Time
// @downloadURL https://update.greasyfork.org/scripts/469402/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/469402/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    var timeoutID = -1;
    var timeLenID = -1;
    var onLoad  = function(){
        clearTimeout(timeoutID);
        console.info("按钮加载完毕");

        var popId = "tipCentent";

        var element = document.getElementById(popId);
        if (typeof(element) != 'undefined' && element != null)
        {
            console.log('元素存在');
        }
        else
        {
            var div = document.createElement('div');
            div.id = popId;
            div.style.cssText = 'border:1px solid red; width:200px; z-index:100; height:20px;';
            document.body.appendChild(div);
        }


        setTimeout(() => {
                let btn = document.querySelector('.AudioPlayerPC_btn_1fyhP');
                btn.dispatchEvent(new Event('click'));

                let speedDiv = document.querySelector('.AudioPlayerPC_rate_2dkV9');
                speedDiv.dispatchEvent(new Event('click'));
                setTimeout(() => {
                    let twoSpeed = document.querySelector(".AudioPlayerPC_main_1QFlQ > ul > li:nth-child(5)");
                    twoSpeed.dispatchEvent(new Event('click'));

                 timeLenID = setInterval(() => {
                        var val = document.querySelector('.AudioPlayerPC_tooltip_2G5BB').innerHTML;
                        var lenval = document.querySelector('.AudioPlayerPC_audioInfo_29xRN > span:nth-child(3)').innerText;

                        if(val == "00:00")
                        {
                            speedDiv.dispatchEvent(new Event('click'));
                        }
                        if(lenval.indexOf(val) > 0)
                        {
                            console.info("下一集！");
                            var next = document.querySelector(".Toolbar_toolbar_3rYXr > div:nth-child(2) > div:nth-child(2)");
                            next.dispatchEvent(new Event('click'));
                            clearTimeout(timeLenID);
                            onLoad();
                        }
                        else
                        {
                            console.info("还没到！")
                        }
                    },3000);
            },1500)
        },5000);
    }
    timeoutID = setInterval(()=>{
        var selector = $(".AudioPlayerPC_btn_1fyhP");
        console.info(selector);
        if(selector.length > 0){
            onLoad();
        }
    },500);
})();