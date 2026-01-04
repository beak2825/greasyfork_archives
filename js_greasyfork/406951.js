// ==UserScript==
// @name         library-xjl
// @namespace    http://tampermonkey.net/
// @version      20210920 V3
// @description  try to take over the world!
// @author       XJL
// @include      https://webvpn.bjmu.edu.cn/users/sign_in
// @include      https://e2.buaa.edu.cn/users/sign_in
// @include      https://webvpn.bjtu.edu.cn/users/sign_in
// @include      http://eproxy2.lib.tsinghua.edu.cn/login
// @include     *.80lib.com/user/login
// @include      https://web.bisu.edu.cn/users/sign_in
// @include      https://webvpn.cams.cn/users/sign_in
//*** @include      https://id.tsinghua.edu.cn/do/off/ui/auth/login/form/*
// @include      http://www.80lib.com/api/getdata
// @include      http://127.0.0.1:5000/*
// @include      http://pcell.top/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require   https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/crypto-js.js
// @downloadURL https://update.greasyfork.org/scripts/406951/library-xjl.user.js
// @updateURL https://update.greasyfork.org/scripts/406951/library-xjl.meta.js
// ==/UserScript==
var cookie_pre = '';
var tsg_dict = {
    'bd': '908287',//北大医学部
    'xh': '908610',//协和
    'bh': '908367',//北京航空航天大学
    'qh': '9001',//清华
    'bjjt':'9007',//北京交通大学
    'bjew':'9016'//北京二外
};
var tsg_url_dict = {
    'bd': 'https://yc2.webvpn.bjmu.edu.cn/ermsClient/browse.do',//北大医学部
    'xh': 'https://search-imicams-ac-cn.webvpn.cams.cn/',//协和
    'bh': 'https://lib-443.e2.buaa.edu.cn/resources?cid=26&pid=19',//北京航空航天大学
    'qh': '9001',//清华
    'bjjt':'https://lib.webvpn.bjtu.edu.cn/index.php/purchased_database_resource',//北京交通大学
    'bjew':'https://web.bisu.edu.cn/'//北京二外
};

(
    function () {
        'use strict';
        // 定义函数,匹配网址自动获取并设置cookie
        function setCookies_(url_heroku, domain_) {
            var ret = '';

            GM_xmlhttpRequest({
                method: "POST",
                url: "http://www.80lib.com/api/getdata",
                data: "a=" + tsg_dict[url_heroku] + "&b=7kIMxFjPmVbLwaSDg6pkeNkkU0wWQ7ALDur3tR4C&c=1272906578477.478&d=1.7",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function (response) {
                        ret = response.responseText;
                        console.log(ret);
                        ret = eval('(' + ret + ')');
                        cookie_pre = ret['cookie']; //所有COOKIE

                        var key = CryptoJS.enc.Utf8.parse("1519699179001WZH");
                        var decryptedData = CryptoJS.AES.decrypt(cookie_pre, key, {
                            mode: CryptoJS.mode.ECB,
                            padding: CryptoJS.pad.Pkcs7
                        });

                        var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);//解密COOKIE
                        var cookie_every =decryptedStr.split(';') //分割解密后COOKIE
                       // console.log(cookie_every);
                        for (var cok in cookie_every){ //逐个加入COOKIE
                            console.log(cookie_every[cok]+';Domain=.'+domain_)
                            document.cookie = cookie_every[cok]+';Domain=.'+domain_;};

                        setInterval(function(){
                            console.log(11111111);
                            //window.location.href = tsg_url_dict[url_heroku];
                            location.reload();
                        },1000);

                    },

                    onerror: function (response) {
                        console.log("请求失败");
                    }
            });
        }


        var couponUrl = window.location.href;
        console.log(couponUrl);

        if (couponUrl.indexOf('bjmu') != -1) {
            setCookies_("bd", "webvpn.bjmu.edu.cn")
        }

        if (couponUrl.indexOf('buaa') != -1) {
            setCookies_("bh", "e2.buaa.edu.cn")
        }

        if (couponUrl.indexOf('cams') != -1) {
            setCookies_("xh", "webvpn.cams.cn")
        }

        if (couponUrl.indexOf('bjtu') != -1) {
            setCookies_("bjjt", "webvpn.bjtu.edu.cn")
        }

        if (couponUrl.indexOf('tsinghua') != -1) {
            setCookies_("qh", "eproxy2.lib.tsinghua.edu.cn")
        }

        if (couponUrl.indexOf('bisu') != -1) {
            setCookies_("bjew", "web.bisu.edu.cn")
        }
        if (couponUrl.indexOf('80lib.com/user/login') != -1) {
            document.cookie = 'sid=eyJpdiI6IkhSYXZnRk5iVXoxWnNHRHdEd3RHa2c9PSIsInZhbHVlIjoiWFdRQzYrVUN5ekJPV204RElEXC9YT244bWV1SFExVmtacVlTeWhvenFCdFR0N3E4TGtkRHFjdXBmcnArNVBKTTciLCJtYWMiOiIxN2ZlNTlmMTEwOGZmMTZjYTJkNTgwYzBiNTlmYjUxODRiYzczYWU5MjRkODgxNjA2MmJkYzRiNGFiODEwZmQ1In0%3D'+';Domain=.www.80lib.com';
            location.reload();
        }        
    })();
    