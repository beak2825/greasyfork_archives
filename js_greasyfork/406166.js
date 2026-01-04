// ==UserScript==
// @name         Bilibili Crack
// @namespace    https://shop.jucatyo.com/
// @version      0.2.2
// @description  解锁大会员专享番剧及电影
// @author       Oisslza
// @require      https://unpkg.com/ajax-hook@2.0.2/dist/ajaxhook.min.js
// @include      *//www.bilibili.com/bangumi/play/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/406166/Bilibili%20Crack.user.js
// @updateURL https://update.greasyfork.org/scripts/406166/Bilibili%20Crack.meta.js
// ==/UserScript==

(function() {
    'use strict';
    ah.proxy({
        //请求发起前进入
        onRequest: (config, handler) => {
            //console.log(config.url)
            if(/^[\s\S]*\/\/api.bilibili.com\/pgc\/player\/web\/playurl[\s\S]*/.test(config.url)){
                //console.log(config.url)
                //console.log(config)
                config.headers["Display-ID"] = getCookie("DedeUserID")+"-153214"
                config.url = "https://api.jucatyo.com/playurl"+"?"+config.url.split("?")[1]+"&mobi_app=pc"
                //config.headers["Origin"] = "http://api.bili.best/playurl"
            }
            handler.next(config);
        },
        //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
        onError: (err, handler) => {
            console.log(err.type)
            handler.next(err)
        },
        //请求成功后进入
        onResponse: (response, handler) => {
            //console.log(response.config.url)
            if(/^[\s\S]*\/\/api.jucatyo.com\/playurl[\s\S]*/.test(response.config.url)){
                var path  = "?"+response.config.url.split("?")[1]
                if(response.response=='1' || response.response==1){
                    alert("每日播放次数已用尽！")
                }
            }else if(/[\s\S]*\/\/api.bilibili.com\/x\/web-interface\/nav/.test(response.config.url)){
                //response.response.data.vipStatus = 1
                var json = JSON.parse(response.response)
                json.data.vipType = 2;
                json.data.vipStatus = 1;
                json.data.vipDueDate = 1599536000000;
                json.data.vip_pay_type = 1;
                json.data.vip_theme_type = 1;
                response.response = JSON.stringify(json)
                //console.log(response.response)
            }
            handler.next(response)
        }
    })
    function getCookie(cookie_name) {
        var allcookies = document.cookie;
        //索引长度，开始索引的位置
        var cookie_pos = allcookies.indexOf(cookie_name);

        // 如果找到了索引，就代表cookie存在,否则不存在
        if (cookie_pos != -1) {
            // 把cookie_pos放在值的开始，只要给值加1即可
            //计算取cookie值得开始索引，加的1为“=”
            cookie_pos = cookie_pos + cookie_name.length + 1;
            //计算取cookie值得结束索引
            var cookie_end = allcookies.indexOf(";", cookie_pos);
            if (cookie_end == -1) {
                cookie_end = allcookies.length;

            }
            //得到想要的cookie的值
            var value = unescape(allcookies.substring(cookie_pos, cookie_end));
        }
        return value;
    }
    function modifyGlobalValue(name, modifyFn) {
        const name_origin = `${name}_origin`
            window[name_origin] = window[name]
        let value = undefined
        Object.defineProperty(window, name, {
            configurable: true,
            enumerable: true,
            get: () => {
                return value
            },
            set: (val) => {
                value = modifyFn(val)
            }
        })
        if (window[name_origin]) {
            window[name] = window[name_origin]
        }
    }
    function replaceInitialState() {
        modifyGlobalValue('__INITIAL_STATE__', (value) => {
            for (let ep of [value.epInfo, ...value.epList]) {
                if (ep.epStatus === 13) {
                    ep.epStatus = 2
                }
            }
            return value
        })
    }
    function replaceUserState() {
        modifyGlobalValue('__PGC_USERSTATE__', (value) => {
            if (value) {
                // 区域限制
                // todo      : 调用areaLimit(limit), 保存区域限制状态
                // 2019-08-17: 之前的接口还有用, 这里先不保存~~
                value.area_limit = 0
                // 会员状态
                value.vip_info.status = 1
                value.vip_info.type = 2
            }
            return value
        })
    }
    function replacePlayInfo() {
        window.__playinfo__origin = window.__playinfo__
        let playinfo = undefined
        Object.defineProperty(window, '__playinfo__', {
            configurable: true,
            enumerable: true,
            get: () => {
                return playinfo
            },
            set: (value) => {
                // debugger
                // 原始的playinfo为空, 且页面在loading状态, 说明这是html中对playinfo进行的赋值, 这个值可能是有区域限制的, 不能要
                if (!window.__playinfo__origin && window.document.readyState === 'loading') {
                    window.__playinfo__origin = value
                    return
                }
                playinfo = value
            },
        })
    }
    replaceUserState()
    replaceInitialState()
    if (!document.getElementById('mmmmm')) {
        replacePlayInfo();
        let $script = document.createElement('script')
        $script.id = 'mmmmm'
        document.head.appendChild($script)
    }
})();