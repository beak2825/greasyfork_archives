// ==UserScript==
// @name         获取72-mvurl
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://gdtv.cn/tv/*
// @require      https://cdn.bootcss.com/jquery/1.7.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/419113/%E8%8E%B7%E5%8F%9672-mvurl.user.js
// @updateURL https://update.greasyfork.org/scripts/419113/%E8%8E%B7%E5%8F%9672-mvurl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let url = document.location.toString();
    let lock = !0;
    let myVar = setInterval(function(){
        if (lock) {
            lock = !1;
            let src = $('#video_html5_api > source').attr('src');
            if (src) {
                $.ajax({
                    'url': src,
                    'type': 'get',
                    'async': false,
                    'success': function(data) {
                        let param = {
                            'url': url,
                            'mvUrl': src,
                            'mvData': data,
                        };
                        console.info(param);
                        GM_xmlhttpRequest({
                            'method': 'POST',
                            'synchronous': true,
                            'url': "http://chenweiwen.top:57796/tvInfo/updateMvUrl",
                            'headers': {'Content-Type': 'application/json;charset=UTF-8'},
                            'data': JSON.stringify(param),
                            'onload': function(data) {
                                console.info(data.response);
                                clearInterval(myVar);
                                location.href = data.response;
                            }
                        });
                    },
                    'error': function() {
                        GM_xmlhttpRequest({
                            'url': src,
                            'method': 'GET',
                            'synchronous': true,
                            'onload': function(data) {
                                let param = {
                                    'url': url,
                                    'mvUrl': src,
                                    'mvData': data.response,
                                };
                                console.info(param);
                                GM_xmlhttpRequest({
                                    'method': 'POST',
                                    'synchronous': true,
                                    'url': "http://chenweiwen.top:57796/tvInfo/updateMvUrl",
                                    'headers': {'Content-Type': 'application/json;charset=UTF-8'},
                                    'data': JSON.stringify(param),
                                    'onload': function(data) {
                                        console.info(data.response);
                                        clearInterval(myVar);
                                        location.href = data.response;
                                    }
                                });
                            },
                        });
                    }
                });
            }
            lock = !0;
        }
    }, 1000);
})();