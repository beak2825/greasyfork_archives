// ==UserScript==
// @name         B站直播分区按看过排序
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  B站直播分区按看过排序，两种模式
// @author       MianJu
// @match        https://live.bilibili.com/p/eden/area-tags?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440796/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%88%86%E5%8C%BA%E6%8C%89%E7%9C%8B%E8%BF%87%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/440796/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%88%86%E5%8C%BA%E6%8C%89%E7%9C%8B%E8%BF%87%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function order() {
        function sleep (time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }
        try {
            var vue = document.querySelector('#area-tag-list').__vue__
            var data = vue.listData
            data.sort((a,b)=>{return b.watchedShow.num - a.watchedShow.num})
        } catch(e) {
            sleep(100).then(order)
        }
    }
    function button() {
        var btn = document.createElement('button')
        btn.style = 'width:50px;position:fixed;top:300px;left:0px;z-index:114514;opacity:0.4'
        btn.innerHTML = "排序";
        btn.onclick = order
        document.body.appendChild(btn)
    }
    function hook() {
        const xhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            const xhr = this;
            if (arguments[1].indexOf('api.live.bilibili.com/xlive/web-interface/v1/second/getList') > -1) {
                const getter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response').get;
                Object.defineProperty(xhr, 'responseText', {
                    get: () => {
                        let result = getter.call(xhr);
                        let data = JSON.parse(result)
                        data.data.list.sort((a,b)=>{return b.watched_show.num - a.watched_show.num})
                        result = JSON.stringify(data)
                        return result;
                    }
                });
            }
            return xhrOpen.apply(xhr, arguments);
        };
    }
    hook()
    button()
    order()
})();