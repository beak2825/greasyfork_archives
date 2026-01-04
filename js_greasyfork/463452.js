// ==UserScript==
// @name         手机浏览器console控制台加载
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  能让手机浏览器的像电脑脑F12一样调试代码，查看console控制台信息，查看网页源码，js调试等。
// @description:en  load the web page console to debug or get some information etc.
// @author       夜雨
// @match        http://*/*
// @match        https://*/*
// @grant      GM_registerMenuCommand
// @license        MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/463452/%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8console%E6%8E%A7%E5%88%B6%E5%8F%B0%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/463452/%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8console%E6%8E%A7%E5%88%B6%E5%8F%B0%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const JSURL = 'https://s4.zstatic.net/ajax/libs/eruda/3.2.1/eruda.min.js'
    function loadScript(url, callback) {
        if(document.querySelector("#eruda")){
            callback();
            return
        }
        const script = document.createElement('script');
        script.setAttribute("id","eruda")
        script.type = 'text/javascript';

        script.onload = function() {
            callback();
        };

        script.src = url;
        document.head.appendChild(script);
    }

    let show = false;

    try {
        GM_registerMenuCommand("打开/关闭", function (event) {
            if(!show){
                loadScript(JSURL, () =>{
                    eruda.init({
                        useShadowDom:true,
                        autoScale:true,
                        defaults:{
                            displaySize: 40,
                            transparency: 0.9
                        }
                    });
                });
            }else {
                eruda && eruda.destroy();
            }
            show = !show;
        }, "openEruda");
    }catch (ex){
        loadScript(JSURL, () =>{
            eruda.init({
                useShadowDom:true,
                autoScale:true,
                defaults:{
                    displaySize: 40,
                    transparency: 0.9
                }
            });
        });
    }

})();