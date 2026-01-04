// ==UserScript==
// @name         江苏2024年教师开学第一课
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  江苏2024年教师开学第一课,连续学习，达到400分钟
// @author       xiajie
// @match        https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jste.net.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/507777/%E6%B1%9F%E8%8B%8F2024%E5%B9%B4%E6%95%99%E5%B8%88%E5%BC%80%E5%AD%A6%E7%AC%AC%E4%B8%80%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/507777/%E6%B1%9F%E8%8B%8F2024%E5%B9%B4%E6%95%99%E5%B8%88%E5%BC%80%E5%AD%A6%E7%AC%AC%E4%B8%80%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var learnUrl = [
        'https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/ff81f61a-2b18-4c03-9c4d-9016aaf1f9580',
        'https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/e3cd2d76-ecd4-4b75-b8e4-82414a588dc10',
        'https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/3f95142b-1bf2-49c2-b658-e90b3056ee050',
        'https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/e3b33bcf-a3e0-4ec1-a587-bcb7d28fa3aa0',
        'https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/3d7b8b8a-3de5-4fa2-b678-20482907c31a0',
        'https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/abb6cb45-d4ad-42e2-b9d6-8a86c6f52d4f0',
        'https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/17abff96-4ac7-494e-816c-8410e9fa5c0c0',
        'https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/17abff96-4ac7-494e-816c-8410e9fa5c0c1',
        'https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/87c0565a-06f4-496b-aae3-6a40f0d59f970',
    ];

    // Your code here...
    function addhtml(){
        let isLearn = GM_getValue('isLearn');
        let str = isLearn == 0 ? '开始学习':'学习中，点击暂停';
        var css = "'position:fixed;z-index:99999;top:5px;right:40%;min-width:120px;height:40px;padding:0 10px; text-align:center;line-height:40px;background:red;color:#fff;cursor:pointer;border:2px solid #fff;box-shadow:0 0 10px #999'";
        var html = "<div id='learnText' style="+css+">"+str+"</div>"
        $('body').append(html);
    }

    $("body").on("click", "#learnText", function(){
        let isLearn = GM_getValue('isLearn');
        let learnIndex = GM_getValue('learnIndex');
        let str = isLearn == 1 ? '开始学习':'学习中，点击暂停';
        let newLearn = isLearn == 1 ? 0:1;
        $('#learnText').text(str);
        GM_setValue('isLearn',newLearn);

        //console.log(learnIndex)
        if(newLearn == 1){
            learnIndex = 0;
            GM_setValue('learnIndex',learnIndex);
            console.log(learnUrl[learnIndex])
            location.href = learnUrl[learnIndex];
        }
    })

    if(location.href.indexOf('folder') !== -1){
        console.log('目录页')
        //GM_setValue('isLearn',0);
        setTimeout(function(){
            addhtml()
        },1500)
    }

    if(location.href.indexOf('item') !== -1){
        console.log('播放页')
        let isLearn = GM_getValue('isLearn');
        let learnIndex = GM_getValue('learnIndex');
        if(isLearn == 1){

            var css = "'position:fixed;z-index:99999;top:5px;right:40%;min-width:120px;height:40px;padding:0 10px; text-align:center;line-height:40px;background:red;color:#fff;cursor:pointer;border:2px solid #fff;box-shadow:0 0 10px #999'";
            var html = "<div style="+css+">学习中</div>"
            $('body').append(html);

            setInterval(function(){
                let recordTip = $('#recordTip').text();
                console.log(recordTip)
                if(recordTip == '本项学习时间已满' || recordTip == '停止计时'){
                    learnIndex ++;
                    GM_setValue('learnIndex',learnIndex);
                    location.href = learnUrl[learnIndex];
                }
            },5000)
        }
    }
})();