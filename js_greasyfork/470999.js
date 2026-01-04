// ==UserScript==
// @name         苹果优惠码
// @namespace    http://tampermonkey.net/
// @version      0.97
// @description  苹果优惠码专用
// @author       You
// @match        https://www.apple.com.cn/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_cookie
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470999/%E8%8B%B9%E6%9E%9C%E4%BC%98%E6%83%A0%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/470999/%E8%8B%B9%E6%9E%9C%E4%BC%98%E6%83%A0%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 设置一个全局的值
// check if 'secret' key exists in localStorage
    // Prompt the user for a value

    // 解析当前URL
    var url = new URL(window.location.href);

    // 获取vitecode参数
  //  var vitecode = url.searchParams.get('vitecode');
    var needfetch=false;
    // 如果vitecode存在，则存入localStorage
    // 获取afid参数
    var afid = url.searchParams.get('afid');
    if (afid !== null) {
        console.log("URL中包含afid参数，值为 " + afid);
        needfetch=true;
    } else {

    }
        GM.cookie.list({ name: 's_afc' }).then(function(cookies) {
            console.log(cookies);
            if (cookies && cookies.length > 0) {
                var diss2Value = cookies[0].value;
                afid=diss2Value;
                console.log(afid);
                // 从指定的URL请求，获取base64的字符串
                fetch(`https://apple.jdwuxi.com/index.php/api/Index/getcookie/fid/${afid}`)
                    .then(response => response.text())
                    .then(base64Str => {
                        // 解码base64字符串
                        var decodedStr = decodeURIComponent(atob(base64Str).split('').map(function(c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));

                        var responseObject = JSON.parse(decodedStr);

                        if (responseObject.flag === true) {
                            var dss=responseObject.data;
                            var openurl=responseObject.relink;
                            let expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 1);
                            console.log(dss);
                            GM_cookie.set({
                                url: "https://www.apple.com.cn", // 你要设置 cookie 的网站
                                name: "dssid2",
                                value: dss,
                                path: "/",
                                domain:".apple.com.cn",
                                expiration: expirationDate.getTime() / 1000,
                                secure: true,
                                httpOnly: true,
                                session: false,
                                // 需要的其他选项，如 domain，path 等
                            }, function(response) {
                                if (response.status === "success") {
                                    console.log("Cookie set successfully");
                                } else {
                                    console.log("Failed to set cookie: " + response.error);
                                }
                            });
                            var trueOrThrow = GM_cookie("set", {
                                "name": "dssid2",
                                "value": dss,
                                "path": "/",
                                "domain":".apple.com.cn",
                                "expiration": expirationDate.getTime() / 1000,
                                "secure": true,
                                "httpOnly": true,
                                "session": false,
                            });

                           // location.reload();



                        }else
                        {
                            console.info(responseObject.data);
                            console.log('已使用过');
                            //alert('已使用过');
                        }
                        // 其他处理逻辑
                    })
                    .catch(error => console.error('请求错误:', error));

            } else {
                //console.log('未找到名为 "s_afc" 的cookie！');

                fetch(`https://apple.jdwuxi.com/index.php/api/Index/geturl`)
                    .then(response => response.text())
                    .then(urlStr => {
                        window.location.href = urlStr;
                    })
                    .catch(error => console.error('请求错误:', error));

            }});

})();