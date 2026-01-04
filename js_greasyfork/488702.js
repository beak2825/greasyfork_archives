// ==UserScript==
// @name         乐子剧助手
// @namespace    http://tampermonkey.net/
// @version      2024-03-01
// @description  解除登录限制，解除VIP限制
// @author       ydm
// @match        https://leziju.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leziju.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488702/%E4%B9%90%E5%AD%90%E5%89%A7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/488702/%E4%B9%90%E5%AD%90%E5%89%A7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let cache_obj = {};

    let oldxhr = window.XMLHttpRequest;
    function newobj() { }

    window.XMLHttpRequest = function () {
        let tagetobk = new newobj();
        tagetobk.oldxhr = new oldxhr();
        let handle = {
            get: function (target, prop, receiver) {
                if (prop === 'oldxhr') {
                    return Reflect.get(target, prop);
                }
                if (typeof Reflect.get(target.oldxhr, prop) === 'function') {
                    if (Reflect.get(target.oldxhr, prop + 'proxy') === undefined) {
                        target.oldxhr[prop + 'proxy'] = new Proxy(Reflect.get(target.oldxhr, prop), {
                            apply: function (target, thisArg, argumentsList) {
                                return Reflect.apply(target, thisArg.oldxhr, argumentsList);
                            }
                        });

                    }
                    return Reflect.get(target.oldxhr, prop + 'proxy')
                }
                let oldValue = Reflect.get(target.oldxhr, prop);
                if (prop.indexOf('response') !== -1) {
                    let url = target.oldxhr.responseURL;
                    //获取m3u8链接并缓存
                    if (url.includes('/api/front/episodes/set_list')) {
                        let newValue = JSON.parse(oldValue);
                        newValue.result.free_limit = 999;
                        newValue.result.login_limit = 999;
                        let list = newValue.result.list;
                        for (let i = 0; i < list.length; i++) {
                            const itme = list[i];
                            cache_obj[itme.play_src] = `https://122.228.19.15/user/data/${itme.date_dir}/_id_${itme.ep_id}/${itme.sn}/${itme.sn}.m3u8`
                        }
                        oldValue = JSON.stringify(newValue);
                        return oldValue;
                    }

                    //判断后缀是否m3u8
                    if (url.endsWith('.m3u8')) {
                        // 从URL中提取路径部分
                        let path = new URL(url).pathname;
                        let newUrl = cache_obj[path];
                        if (newUrl) {
                            var xhr = new XMLHttpRequest();
                            xhr.open('GET', newUrl, false);
                            xhr.send();
                            if (xhr.status === 200) {
                                let m3u8String = xhr.responseText;
                                if (m3u8String) {
                                    var lastIndex = newUrl.lastIndexOf('/');
                                    if (lastIndex !== -1) {
                                        newUrl = newUrl.substring(0, lastIndex + 1);
                                        m3u8String = m3u8String.replace(/(\d{3}\.ts)/g, newUrl + '$1');
                                        return m3u8String;
                                    }
                                }
                            } else {
                                console.error('Request failed. Status: ' + xhr.status);
                            }
                        }

                    }

                    //播放检查
                    if(url.includes('/episodes/play_check')){
                        return `{\"code\":0,\"message\":\"OK\",\"result\":{\"err\":\"\"}}`;
                    }

                    return oldValue
                }
                return oldValue;
            },
            set(target, prop, value) {
                return Reflect.set(target.oldxhr, prop, value);
            },
            has(target, key) {
                return Reflect.has(target.oldxhr, key);
            }
        }

        let ret = new Proxy(tagetobk, handle);

        return ret;
    }
})();