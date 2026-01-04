// ==UserScript==
// @name         ss/ssr百度助手
// @namespace    http://tampermonkey.net/
// @version      0.54
// @description  ss节点免费分享，在百度网站上展示ss节点；需登录百度。
// @author       wyb
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390204/ssssr%E7%99%BE%E5%BA%A6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/390204/ssssr%E7%99%BE%E5%BA%A6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==



(function() {
    'use strict';
    if (test_url()) {
        baidu();
    };
})();

function test_url(host_url) {
    var host=location.host;
    var regExp = new RegExp('^.*baidu.com$', 'i');
    return regExp.test(host);
}

function baidu(host_url){
    if(test_url("baidu.com")) {
        //var ssdata = "<p id='max-flip' style='padding:5px;border:solid 1px #c3c3c3;margin-top:0px;text-align:center;background:#e5eecc;'>获取SS账号  点击显示/隐藏</p><div id='max-panel' style='z-index:999；opacity:1;height:120;display:none;border:solid 1px #c3c3c3;padding:5px;text-align:center;background:#e5eecc;'><p>账号 ：       端口 ：  密码 ：   加密方式 aes-256-cfb ：     国家</p>    <p>159.203.199.177	13479	ss8.pm-03723632 US</p> <p>172.105.199.95 : 47880 : iSRhOab3GC3o : JP</p><p>23.239.20.120 : 8097 : eIW0Dnk69454e6nSwuspv9DmS201tQ0D : US</p></div>";

        var head = "<p id='max-flip' style='padding:5px;border:solid 1px #c3c3c3;margin-top:0px;text-align:center;background:#e5eecc;'>获取SS账号  点击显示/隐藏</p><div id='max-panel' style='z-index:999；opacity:1;height:120;display:none;border:solid 1px #c3c3c3;padding:5px;text-align:center;background:#e5eecc;'><p>ss账号 ：       端口 ：  密码 ：   加密方式 aes-256-cfb ：     国家</p>";
        var ss1 = "<p>    165.22.133.55	19939	ssx.re-58481108	aes-256-cfb	US   </p>";
        var ss2 = "<p>    68.183.229.253	15655	ssx.re-56186455	aes-256-cfb	SG   </p>";
        var ss3 = "<p>    159.203.193.202	10024	ssx.re-87132286	aes-256-cfb	US    </p>";
        var tail = "</div>";

        var ssrTitle = "<hr><p>ss/ssr账号 ：       端口 ：  密码 ：   加密方式 aes-256-cfb ：     协议(SSR)  混淆(SSR)</p>";
        var ssrImg = "<p><a href="+"https://raw.githubusercontent.com/gfw-breaker/ssr-accounts/master/resources/ip.png"+">点击查看ip</a>";
        var ssrOther = "/23459/dongtaiwang.com/aes-256-cfb/origin/plain    </p>";
        var ssrStr = ssrTitle + ssrImg + ssrOther;
        var ssdata = head + ss1 + ss2 + ss3 + ssrStr + tail;

        $('#s_top_wrap').append(ssdata);
        $('#max-flip').click(function() {
            $("#max-panel").slideToggle("fast");
        });
	}
}

