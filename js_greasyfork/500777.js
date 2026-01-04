// ==UserScript==
// @name         Webos辅助插件
// @namespace    https://gitee.com/fs185085781
// @version      1.0.7
// @description  Webos辅助插件,用于对webos网页版的增强
// @author       阿范🎈
// @include      *
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAArtJREFUOE+tlE9IVFEUxr9z33vz3ozpzNSQpaOhKRG6qDZFtChoE7UyA5FwES6qVdFiICKxIsiCAv/AUAtbFEKbNkEQQZsgAlu0ihBlRp10hFQ0ne597954d5wZRaM/+uDAu/fB733nnO8cAoCmYamkIP+1+EhPwRNePriEu+q9cO9yCSk8/U1KAzJRQ7R5mNQ/NQQQlA5o/wel/l9ZCeZwA7Zga4H/luZ6mLMauBWwosLfwSJM4UtLZE2zrAfpYs0KafrKfFiQG6B976XyXL+T67s50x5F+Mk0dDddibdnYzhabaN5YAKpjNSQAszhDEFhgBreCbWRNXxYfHAK80u+dSQ8V0G5HniiDuU30kWYxSVCnOCrdTwbVPcmp1b77FzcQu+RkE5zR38KXCgIARhKYfhCHMf6voGWGXpboojYDCKn0J1chC1MOMIE1b5aUgXTTrWGNejAUBbJ42Ec3mWjoucrfroGctf3Ymd3GjNdtbjyfBavP+ZgLTPYvjrXhM1NWB6Bql4u6JQll8i2RxFJToJcT8fTUzGcbixH5PYIRq/V4+DdSaTu1KD56gRONJahNhxA4nwZTrYtwHQJJghU+WJOp8xcD9MdMWzvG8PnjjiCFoNJQIVjoPLmKLK36uFKBZMRDl3O4NNAlc5mbl6hrXMRpmIwiECxZ9+VFC78mO3cjW0PxyC4xMilPbAZ0NSThslN2MJA0CWEOIPFGRpiJrJpE0wQDABMebCYA4oOzig94NxDmClMXqxe47s/Hc60/tDKDPjBQBWPp1Rpa+THKSQJZV5+Ngtec4QBm5fOAel3mFZgbAVIoFB/Jq/Q99rK1thoAkoGNnQ3TeRr5qvKq8vfkfNoXG0VTDfFvJ/StvH32WaUFepI7N64YjmxJbAAI+i9X96VUYFlrzjo/tb425oVlAUMQnKI0S+ZC2NKOJYdzwAAAABJRU5ErkJggg==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_removeValueChangeListener
// @grant        GM_addValueChangeListener
// @grant        window.close
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500777/Webos%E8%BE%85%E5%8A%A9%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/500777/Webos%E8%BE%85%E5%8A%A9%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let timeData = setInterval(function(){
        try{
            webos.addPanTokenGet = function(pName){
                return new Promise(function(success){
                    GM_setValue("setGetWebosToken","1");
                    GM_setValue(pName,"");
                    GM_removeValueChangeListener(pName);
                    GM_addValueChangeListener(pName,(name,oldValue,newValue,remote)=>{
                        success(newValue);
                    });
                });
            }
            clearInterval(timeData);
        }catch(e){
        }
    },100);
    setTimeout(function(){
        clearInterval(timeData);
    },30000);
    function addLog(text){
        var log = document.querySelector("#webos-log");
        if(log){
            log.innerHTML = text;
        }else{
            log = document.createElement("div");
            log.innerHTML = text;
            log.id = "webos-log";
            log.style.position = "fixed";
            log.style.top = "0px";
            log.style.left = "calc(50vw - 80px)";
            log.style.zIndex = "999999";
            log.style.color = "#fff";
            log.style.fontSize = "15px";
            log.style.background = "red";
            log.style.padding = "5px";
            document.body.appendChild(log);
        }
    }
    let hasProxy = false;
    if(window.location.host.includes("pan.xunlei.com")){
        if(GM_getValue("setGetWebosToken") == "1"){
            setTimeout(function(){
                GM_setValue("setGetWebosToken","");
            },60000);
            hasProxy = true;
            let timeId = setInterval(function(){
                for(let i=0;i<localStorage.length;i++){
                    let key = localStorage.key(i);
                    if(key.startsWith("credentials_")){
                        let str = localStorage.getItem(key);
                        let json = JSON.parse(str);
                        let refresh_token = json.refresh_token;
                        if(refresh_token){
                            GM_setValue("xunlei",refresh_token);
                            clearInterval(timeId);
                            setTimeout(function(){
                                top.close();
                            },1000);
                        }
                    }
                }
            },1000);
        }
    }
    if(window.location.host.includes("mypikpak.com")){
        if(!document.cookie.includes("pp_access_to_visit=true")){
            document.cookie = "pp_access_to_visit=true"
        }
        if(GM_getValue("setGetWebosToken") == "1"){
            setTimeout(function(){
                GM_setValue("setGetWebosToken","");
            },60000);
            let lastCache = {};
            let oldFetch = fetch;
            hasProxy = true;
            addLog("Webos开始拦截PikPak加密数据(60秒未登录PikPak网盘将自动取消拦截)");
            unsafeWindow.fetch = function(...args){
                try{
                    if(args[0].includes("/v1/shield/captcha/init")){
                        addLog("Webos成功拦截到PikPak加密数据");
                        let b = JSON.parse(args[1].body);
                        if(b.client_id && b.device_id && b.meta.captcha_sign && b.meta.timestamp){
                            lastCache.client_id = b.client_id;
                            lastCache.device_id = b.device_id;
                            lastCache.captcha_sign = b.meta.captcha_sign;
                            lastCache.sign_timestamp = b.meta.timestamp;
                        }
                    }
                }catch(e){
                }
                return oldFetch.apply(this,...args);
            };
            (async function(){
                while(true){
                    if(lastCache.captcha_sign){
                        addLog("Webos开始拦截PikPak Token");
                        for (let i = 0; i < localStorage.length; i++) {
                            const key = localStorage.key(i);
                            if (key.includes("credentials_")) {
                                addLog("Webos成功拦截到PikPak Token");
                                GM_setValue("setGetWebosToken","");
                                let param = JSON.parse(localStorage.getItem(key));
                                param.client_id = lastCache.client_id;
                                param.device_id = lastCache.device_id;
                                param.captcha_sign = lastCache.captcha_sign;
                                param.sign_timestamp = lastCache.sign_timestamp;
                                GM_setValue("pikpak",JSON.stringify(param));
                                lastCache = {};
                                setTimeout(function(){
                                    top.close();
                                },1000);
                            }
                        }
                    }
                    await new Promise(function(success){
                        setTimeout(function(){
                            success();
                        },100);
                    });
                }
            })();
        }
    }
    if(!hasProxy && GM_getValue("setGetWebosToken") == "1"){
        setTimeout(function(){
            GM_setValue("setGetWebosToken","");
        },60000);
        addLog("Webos即将开始拦截Token或者Cookie(60秒未登录对应网盘将自动取消拦截)");
        var setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function (...args){
            if(args[0] == "Authorization"){
                this.auth = args[1].split(" ")[1];
            }
            return setRequestHeader.apply(this,args);
        }
        var open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (...args){
            var that = this;
            let need = false;
            let data = {
                pan139:"yun.139.com/hcy/file/list",
                pan1392:"/orchestration/personalCloud/catalog/v1.0/getDisk",
                weiyun:"weiyunQdisk/DiskDirBatchList",
                lanzou:"doupload.php?uid",
                pan115:"files?aid="
            };
            for(let key in data){
                if(args[1].includes(data[key])){
                    need = true;
                    that.authKey = key;
                    if(that.authKey == "pan139" || that.authKey == "pan1392"){
                        that.isOld = false;
                        if(that.authKey == "pan1392"){
                            that.authKey = "pan139";
                            that.isOld = true;
                        }
                    }
                    break;
                }
            }
            if(need){
                if(that.authKey == "pan139"){
                    addLog("Webos开始拦截移动云盘的Token");
                }
                if(that.authKey == "weiyun"){
                    addLog("Webos开始拦截微云的Cookie");
                }
                if(that.authKey == "lanzou"){
                    addLog("Webos开始拦截蓝奏云的Cookie");
                }
                let time = setInterval(function(){
                    if(that.readyState == 4){
                        clearInterval(time);
                        if(that.status == 200){
                            let token = null;
                            if(that.authKey == "pan139"){
                                var tmpData = {token:that.auth,isOld:that.isOld};
                                var sz = document.cookie.split(";");
                                for (let i = 0; i < sz.length; i++) {
                                    if(sz[i].includes("ud_id=")){
                                        tmpData.domainId = sz[i].split("=")[1].trim();
                                    }
                                };
                                token = JSON.stringify(tmpData);
                            }else if(that.authKey == "weiyun" || that.authKey == "lanzou" || that.authKey == "pan115"){
                                token = document.cookie;
                            }
                            if(token){
                                if(that.authKey == "pan139"){
                                    addLog("Webos成功拦截到移动云盘的Token");
                                }
                                if(that.authKey == "weiyun"){
                                    addLog("Webos成功拦截到微云的Cookie");
                                }
                                if(that.authKey == "lanzou"){
                                    addLog("Webos成功拦截到蓝奏云的Cookie");
                                }
                                GM_setValue("setGetWebosToken","");
                                GM_setValue(that.authKey,token);
                                setTimeout(function(){
                                    top.close();
                                },1000);
                            }

                        }
                    }
                },100);
            }
            return open.apply(this,args);
        };
    }
})();