// ==UserScript==
// @name         玩客猴PC版
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  玩客猴PC端
// @author       You
// @require      https://cdn.bootcss.com/jquery/2.1.3/jquery.min.js
// @match        http://h.miguan.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37017/%E7%8E%A9%E5%AE%A2%E7%8C%B4PC%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/37017/%E7%8E%A9%E5%AE%A2%E7%8C%B4PC%E7%89%88.meta.js
// ==/UserScript==

(function() {
    var init = function(){
        $('#app').css('max-width','100%');
        var appendScript = function(path){
            return new Promise((resolve)=>{
                let script = document.createElement('script');
                script.type='text/javascript';
                script.src = path;
                script.onload = resolve;
                document.head.appendChild(script);
            });
        },
            appendStyle = function(path){
                return new Promise(resolve=>{
                    let link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = path;
                    link.onload = resolve;
                    link.setAttribute('data-mark','monkey-pc');
                    document.head.appendChild(link);
                });
            };
        var css = ['http://monkey.zhangliang.cc/static/css/app.ca1c370dcc7b314503cc4b53782d7474.css'],
            js = ['http://monkey.zhangliang.cc/list.js',
                  'http://monkey.zhangliang.cc/static/js/manifest.56be19eabbbdb2d845fe.js',
                  'http://monkey.zhangliang.cc/static/js/vendor.96f9a20b36df2c27e76c.js',
                  'http://monkey.zhangliang.cc/static/js/app.5ef638b219dcf2569a70.js'];
        appendStyle(css[0]).then(()=>{
            appendScript(js[0]).then(()=>{
                appendScript(js[1]).then(()=>{
                    appendScript(js[2]).then(()=>{
                        appendScript(js[3]);
                    });
                });
            });
        });
    };
    init();
})();