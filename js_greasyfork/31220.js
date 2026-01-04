// ==UserScript==
// @name        斗鱼超级小桀签到领积分
// @namespace   undefined
// @description douyu小桀房间自动发送"#签到"指令,领取积分
// @include     http://www.douyu.com/cave
// @include     https://www.douyu.com/cave
// @include     http://www.douyu.com/74751
// @include     https://www.douyu.com/74751
// @version     1.5
// @author      none
// @icon        http://www.douyu.com/favicon.ico
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31220/%E6%96%97%E9%B1%BC%E8%B6%85%E7%BA%A7%E5%B0%8F%E6%A1%80%E7%AD%BE%E5%88%B0%E9%A2%86%E7%A7%AF%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/31220/%E6%96%97%E9%B1%BC%E8%B6%85%E7%BA%A7%E5%B0%8F%E6%A1%80%E7%AD%BE%E5%88%B0%E9%A2%86%E7%A7%AF%E5%88%86.meta.js
// ==/UserScript==

(function(){
    var test_code=0;    //如果你想要测试一下脚本, 把这里的0改成1
                        //改完之后, 左上角保存一下脚本, 刷新斗鱼的页面, 然后每15秒就会发送一次测试的弹幕
                        //测试成功之后, 要记得改回来哦!!!


//*********************** 签到部分 ****************************

    setInterval(
        function(){
        var date=new Date();
        var m=date.getMinutes();
        if(m===0||m==30){
            qiandao();
        }
    },60000);

    function qiandao(){
        var date=new Date();
        var h=date.getHours();
        var m=date.getMinutes();
        $(".cs-textarea").val("#签到 "+h+":"+m);
        $("div.b-btn[data-type='send']").click();
    }

//*********************** 测试部分 ****************************

    if(test_code===1){
        setInterval(
            function(){
                var date=new Date();
                var h=date.getHours();
                var m=date.getMinutes();
                var s=date.getSeconds();
                $(".cs-textarea").val("#测试 "+h+":"+m+":"+s);
                $("div.b-btn[data-type='send']").click();
            },15000);
    }

})();
