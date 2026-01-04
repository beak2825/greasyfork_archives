// ==UserScript==
// @name         无锡市人才培训-继续教育
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  无锡专业技术人员继续教育，自动播放下一个
// @author       You
// @match        https://rs.hrss.wuxi.gov.cn:8031/rcrs/lxStuWeb.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wuxi.gov.cn
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/460901/%E6%97%A0%E9%94%A1%E5%B8%82%E4%BA%BA%E6%89%8D%E5%9F%B9%E8%AE%AD-%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/460901/%E6%97%A0%E9%94%A1%E5%B8%82%E4%BA%BA%E6%89%8D%E5%9F%B9%E8%AE%AD-%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var vueBox = null;
    var checkVueBox = setInterval(function(){
        if(document.querySelector('#app')){
            vueBox = document.querySelector('#app').__vue__;
            clearInterval(checkVueBox);
            init();
        }
    },500);
    var checkPlay = null;

    function init(){
        console.log('初始化成功');
        let path = vueBox.$route.path;
        switchPath(path);

        vueBox.$router.afterHooks.push(()=>{
            let tmpPath = vueBox.$route.path;
            console.log('路由发生改变===>',tmpPath);
            switchPath(tmpPath);
        });
    }

    function switchPath(path){
        clearHandler();
        switch(path){
            case '/playVideo':
                playVideoHandler();
                break;
            default:
                break;
        }
    }

    function playVideoHandler(){
        addhtml();
        let currentTime = 0
        checkPlay = setInterval(function(){
            let len = $('.childSection').length;
            console.log("检测是否完成")
            for(let i=0;i<len;i++){
                let text = $('.childSection').eq(i).find('.isFinsh').text();
                if($('.childSection').eq(i).hasClass('active') && text == '已完成'){
                    let next = i+1;
                    if(next < len){
                        $('.childSection').eq(next).click();
                        break;
                    }
                }
            }
            //当前播放时间
            let now = $('#myVideo')[0].currentTime;
            //console.log("时间",currentTime,now);
            //停止播放，重新播放
            if(currentTime == now){
                $('.childSection.active').click();
            }else{
                currentTime = now;
            }
        },1000*5);
        function addhtml(){
            var css = "'position:fixed;z-index:99999;top:0;left:0;right:0;margin:0 auto;width:120px;height:40px;text-align:center;line-height:40px;background:red;color:#fff;cursor:pointer;border:2px solid #fff;box-shadow:0 0 10px #999'";
            var html = "<div id='playText' style="+css+">生效中</div>"
            $('body').append(html);
        }
    }

    function clearHandler(){
        console.log('清除所有方法');
        $('#playText').remove();
        clearInterval(checkPlay);

    }
})();