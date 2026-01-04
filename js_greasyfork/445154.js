// ==UserScript==
// @name         youtube upload
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  upload youtube video
// @author       You
// @match        https://studio.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.1.2/jquery.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/crypto-js.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445154/youtube%20upload.user.js
// @updateURL https://update.greasyfork.org/scripts/445154/youtube%20upload.meta.js
// ==/UserScript==


(function() {
    window.onload = function(){
        console.log('upload')
        function function_2(){

            setTimeout(function () { //设置获利
                $("#text-container > div").click();
            },5000);
            console.log('设置获利');
            setTimeout(function () { //开启获利
                $("#offRadio").click();
                console.log('开启获利');
            },5000*2);
            setTimeout(function () { //保存获利
                $("#save-button").click();
                console.log('保存获利');
            },5000*3);
            setTimeout(function () { //下一步
                $("#next-button > div").click();
                console.log('进入广告评价页面');
            },5000*4);
            setTimeout(function () { //广告自我平均
                $("#scrollable-content > ytcp-uploads-content-ratings > ytpp-self-certification-questionnaire > div.main.style-scope.ytpp-self-certification-questionnaire > div > ytcp-checkbox-lit").click();
                console.log('设置广告自我评价');
            },5000*5);
            setTimeout(function () { //提交自我平均
                $("#submit-questionnaire-button").click();
                console.log('提交广告自我评价');
            },5000*6);
            setTimeout(function () { //下一步
                $("#next-button > div").click();
                console.log('进入视频元素设置页面');
            },5000*9);

            setTimeout(function () { //下一步
                $("#endscreens-button > div").click();
                console.log('设置片尾视频');
            },5000*10);

            setTimeout(function () { //下一步
                $("#cards-row > div:nth-child(4) > div.template-preview.style-scope.ytve-endscreen-template-picker > div").click();
                console.log('选择片尾视频');
            },5000*12);

            setTimeout(function () { //下一步
                $("#save-button > div").click();
                console.log('保存片尾视频');
            },5000*14);


            setTimeout(function () { //下一步
                $("#next-button > div").click();
                console.log('进入检查页面');
            },5000*16);
            setTimeout(function () { //下一步
                $("#next-button > div").click();
                console.log('进入公开范围页面');
            },5000*17);
            setTimeout(function () { //下一步
                $("#done-button").click();
                console.log('提交视频');
            },5000*18);


        }
        function function_1(){
            console.log('启动自动程序')
            $("#next-button").one('click',function(){
                console.log('开始自动设置');
                function_2();
            });};
        function function_translations(){

            setTimeout(function () { //选择语言
                console.log('选择语言')
                $("#add-translations-button > div").click();},1000);

            setTimeout(function () { //设置英语
                console.log('设置英语')
                $("#text-item-206 > ytcp-ve > div > div > yt-formatted-string").click();
            },2000);

            setTimeout(function () { //添加英语字幕
                console.log('添加英语字幕')
                $("#add-translation > div").click();
            },3000);

            setTimeout(function () { //添加英语字幕
                console.log('选择上传视频文件')
                $("#choose-upload-file").click();
            },4000);

            setTimeout(function () { //添加英语字幕
                console.log('启动自动翻译')
                var title = document.querySelector("#entity-name").textContent;
                var q = title.replace(/\s+/g,"")
                youdao(q);
            },5000);


        };


        function youdao(q){
            var appKey = '';
            var key = '';//注意：暴露appSecret，有被盗用造成损失的风险
            var salt = (new Date).getTime();
            var curtime = Math.round(new Date().getTime() / 1000);
            var query = q;
            // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
            var from = 'zh-CHS';
            var to = 'en';
            var str1 = appKey + truncate(query) + salt + curtime + key;
            var vocabId = 'D782AD7B6FE74AEF9B211B39D83DE371';
            console.log('---',str1);

            var sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);

            $.ajax({
                url: 'https://openapi.youdao.com/api',
                type: 'post',
                dataType: 'jsonp',
                data: {
                    q: query,
                    appKey: appKey,
                    salt: salt,
                    from: from,
                    to: to,
                    sign: sign,
                    signType: "v3",
                    curtime: curtime,
                    vocabId: vocabId,
                },
                success: function (data) {
                    //console.log(data);
                    console.log(data['translation']);
                    var result = data['translation'][0].substring(0,99);
                    document.querySelector("#translated-title > div > textarea").value = result

                }

            });

        }

        function truncate(q){
            var len = q.length;
            if(len<=20) return q;
            return q.substring(0, 10) + len + q.substring(len-10, len);
        }
        waitForKeyElements (
            "#next-button",
            function_1
        );


        waitForKeyElements (
            "#add-translations-button",
            function_translations);



    }
})();