// ==UserScript==
// @name                    The Login-free GreasyFork
// @name:zh-CN              大人世界的GreasyFork
// @name:zh-TW              大人世界的GreasyFork
// @namespace               https://www.imxiaoanag.com/2024/03/27/%E4%B8%80%E4%B8%AAGreasy-Fork%E6%96%B0%E6%8F%92%E4%BB%B6/
// @version                 1.0.3
// @icon                    data:image/png;base64,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
// @description             Explore the full world of GreasyFork and SleazyFork without logging in!
// @description:zh-CN       无需登录，探索 GreasyFork 和 SleazyFork 的完整世界！
// @description:zh-TW       免登錄，探索 GreasyFork 和 SleazyFork 的完整世界！
// @author                  imxiaoanag
// @match                   http*://greasyfork.org/*
// @match                   http*://www.greasyfork.org/*
// @match                   http*://sleazyfork.org/*
// @match                   http*://www.sleazyfork.org/*
// @grant                   GM_xmlhttpRequest
// @grant                   GM_setValue
// @grant                   GM_getValue
// @grant                   GM_registerMenuCommand
// @grant                   GM_notification
// @grant                   GM.xmlHttpRequest
// @grant                   GM.setValue
// @grant                   GM.getValue
// @grant                   GM.registerMenuCommand
// @grant                   GM.notification
// @connect                 greasyfork.org
// @connect                 sleazyfork.org
// @license                 MIT
// @downloadURL https://update.greasyfork.org/scripts/490629/The%20Login-free%20GreasyFork.user.js
// @updateURL https://update.greasyfork.org/scripts/490629/The%20Login-free%20GreasyFork.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var _GM_xmlhttpRequest,_GM_registerMenuCommand,_GM_notification;
    if(typeof GM_xmlhttpRequest!='undefined'){
        _GM_xmlhttpRequest=GM_xmlhttpRequest;
    }else if(typeof GM!='undefined' && typeof GM.xmlHttpRequest!='undefined'){
        _GM_xmlhttpRequest=GM.xmlHttpRequest;
    }
    if(typeof GM_registerMenuCommand!='undefined'){
        _GM_registerMenuCommand=GM_registerMenuCommand;
    }else if(typeof GM!='undefined' && typeof GM.registerMenuCommand!='undefined'){
        _GM_registerMenuCommand=GM.registerMenuCommand;
    }
    if(typeof GM_notification!='undefined'){
        _GM_notification=GM_notification;
    }else if(typeof GM!='undefined' && typeof GM.notification!='undefined'){
        _GM_notification=GM.notification;
    }

    if(typeof _GM_xmlhttpRequest=='undefined')_GM_xmlhttpRequest=(f)=>{};
    if(typeof _GM_registerMenuCommand=='undefined')_GM_registerMenuCommand=(s,f)=>{};
    if(typeof _GM_notification=='undefined')_GM_notification=(s)=>{};
    var storage={
        supportGM: typeof GM_getValue=='function' && typeof GM_getValue('a','b')!='undefined',
        supportGMPromise: typeof GM!='undefined' && typeof GM.getValue=='function' && typeof GM.getValue('a','b')!='undefined',
        mxAppStorage:(function(){
            try{
                return window.external.mxGetRuntime().storage;
            }catch(e){
            };
        })(),
        operaUJSStorage:(function(){
            try{
                return window.opera.scriptStorage;
            }catch(e){
            };
        })(),
        setItem:function(key,value){
            if(this.operaUJSStorage){
                this.operaUJSStorage.setItem(key,value);
            }else if(this.mxAppStorage){
                this.mxAppStorage.setConfig(key,value);
            }else if(this.supportGM){
                GM_setValue(key,value);
            }else if(this.supportGMPromise){
                GM.setValue(key,value);
            }else if(window.localStorage){
                window.localStorage.setItem(key,value);
            };
        },
        getItem:function(key,cb){
            var value;
            if(this.operaUJSStorage){
                value=this.operaUJSStorage.getItem(key);
            }else if(this.mxAppStorage){
                value=this.mxAppStorage.getConfig(key);
            }else if(this.supportGM){
                value=GM_getValue(key);
            }else if(this.supportGMPromise){
                value=GM.getValue(key).then(v=>{cb(v)});
                return;
            }else if(window.localStorage){
                value=window.localStorage.getItem(key);
            };
            cb(value);
        },
    };
    if(document.querySelector('span.sign-in-link')){
        var otherSite=/greasyfork\.org/.test(location.hostname)?"sleazyfork":"greasyfork";
        if(/scripts\/\d+/.test(location.href)){
            if(!document.querySelector("#script-info") && (otherSite == "greasyfork" || document.querySelector("div.width-constraint>section>p>a").href.indexOf("sign_in")!=-1)){
                location.href=location.href.replace(/\/\/([^\.]+\.)?(greasyfork|sleazyfork)\.org/,"//$1"+otherSite+"\.org");
            }
        }else if(/\/(scripts|users)(\/|.*(\?|&)q=|.*[\?&]set=)/.test(location.href)){
            _GM_xmlhttpRequest({
                method: 'GET',
                url: location.href.replace(/\/\/([^\.]+\.)?(greasyfork|sleazyfork)\.org/,"//$1"+otherSite+"\.org"),
                onload: function(result) {
                    var doc = null;
                    try {
                        doc = document.implementation.createHTMLDocument('');
                        doc.documentElement.innerHTML = result.responseText;
                    }
                    catch (e) {
                        console.log('parse error');
                    }
                    if (!doc) {
                        return;
                    }
                    var l = doc.querySelector('ol.script-list');
                    if (l) {
                        var ml = document.querySelector('ol.script-list');
                        if(!ml){
                            ml=document.createElement("ol");
                            ml.setAttribute("class","script-list");
                            var list=document.querySelector('.sidebarred-main-content');
                            var ps=list.querySelectorAll("p");
                            for(let i=0;i<ps.length;i++){
                                let p=ps[i];
                                list.removeChild(p);
                            }
                            list.appendChild(ml);
                        }
                        var scs=l.querySelectorAll("li");
                        if(scs){
                            for(let i=0;i<scs.length;i++){
                                let sc=scs[i];
                                if(!ml.querySelector("li[data-script-id='"+sc.dataset.scriptId+"']")){
                                    //addScore(sc);
                                    ml.appendChild(sc);
                                }
                            }
                        }
                    }
                },
                onerror: function(e) {
                    console.log(e);
                }
            });
        }
    }
})();