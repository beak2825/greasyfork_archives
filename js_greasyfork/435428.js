// ==UserScript==
// @name         bili翻译
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  翻译繁体字幕 目前仅支持繁体字幕
// @author       Hudy
// @match        https://*.bilibili.com/bangumi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435428/bili%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/435428/bili%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==
var oldxhr=window.XMLHttpRequest
function newobj(){}
window.XMLHttpRequest=function(){
    let tagetobk=new newobj();
    tagetobk.oldxhr=new oldxhr();
    let handle={
        get: function(target, prop, receiver) {
            if(prop==='oldxhr'){
                return Reflect.get(target,prop);
            }
            if(typeof Reflect.get(target.oldxhr,prop)==='function')
            {
                if(Reflect.get(target.oldxhr,prop+'proxy')===undefined)
                {
                    target.oldxhr[prop+'proxy']=(...funcargs)=> {
                        let result = target.oldxhr[prop].call(target.oldxhr,...funcargs)
                        return result;
                    }


                }
                return Reflect.get(target.oldxhr,prop+'proxy')
            }
            if(prop.indexOf('response')!==-1)
            {
                let url = tagetobk.oldxhr.responseURL;
                if (url.startsWith("https://i0.hdslb.com/")){
                    let pathnames = window.location.pathname.split("/")
                    return getSimpleChinese(url,pathnames[pathnames.length-1])
                }
                return Reflect.get(target.oldxhr,prop);
            }
            return Reflect.get(target.oldxhr,prop);
        },
        set(target, prop, value) {
            return Reflect.set(target.oldxhr, prop, value);
        },
        has(target, key) {
            return Reflect.has(target.oldxhr,key);
        }
    }

    let ret = new Proxy(tagetobk, handle);
    return ret;
}
function getSimpleChinese(url,id) {
    let xhr = new XMLHttpRequest()
    let result;
    xhr.onreadystatechange = function() {
        if (this.status == 200) {
            result = this.responseText;
        }
    }
    xhr.open("GET","https://www.hudybili.top:8082/system/subtitle/subTitleInfo?url="+url+"&bId="+id,false)
    xhr.send()
    return result;
}
