// ==UserScript==
// @name         Acfun屏蔽计划
// @namespace    http://tampermonkey.net/
// @version      3.005
// @author       人文情怀
// @exclude      https://www.acfun.cn/login/*
// @exclude      http://www.acfun.cn/login/*
// @match        http://www.acfun.cn/a/ac*
// @match        http://www.acfun.cn/v/list63
// @match        https://www.acfun.cn/a/ac*
// @match        http://www.acfun.cn/*
// @match        https://www.acfun.cn/*
// @match        https://www.acfun.cn/v/list*
// @match        http://www.acfun.cn/a/ac*
// @match        https://www.acfun.cn/a/ac*
// @match        http://www.acfun.cn/v/ac*
// @match        https://www.acfun.cn/v/ac*
// @match        https://www.acfun.cn/v/as*
// @match        http://www.acfun.cn/v/as*
// @connect      greasyfork.org
// @connect      localhost
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @run-at      document-start
// @description 帮助你屏蔽不想看的UP主
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/381476/Acfun%E5%B1%8F%E8%94%BD%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/381476/Acfun%E5%B1%8F%E8%94%BD%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==

//  添加上面的exclude两行表示这个脚本不会在登陆页面出现
//这只是个代码下载器，用来下载正式的代码，具体想了解代码的人可以自己去看看。
// 开源代码： https://greasyfork.org/zh-CN/scripts/387296-acfunblock%E5%BC%80%E6%BA%90%E4%BB%A3%E7%A0%81
(function(){

    let dev = false;

    let empty = (a) => {
        return typeof a === "undefined" ? () => {
            console.log("EmptyFunction Called");
            console.trace();
        } : a;
    };
    let GM_set = typeof GM_setValue === "undefined" ?
        function (key, value, callback, failcallback) {
            let p = GM.setValue(key, value);
            p.then(empty(callback), empty(failcallback));


        }
    : function (key, value, callback) {
        let res = GM_setValue(key, value);
        callback();
    };


    let GM_get = typeof GM_getValue === "undefined" ?
        function (key, value, callback) {
            let p = GM.getValue(key, value);
            p.then((debug) => {
                empty(callback)(debug);
            }, () => {
                callback(value);
            });
            //console.log("empty", empty(callback));
        }
    : function (key, value, callback, failcallback) {
        let res = GM_getValue(key, value);
        callback(res);
    };

    let xhttp = typeof GM_xmlhttpRequest !== "undefined" ? GM_xmlhttpRequest : GM.xmlHttpRequest;

    //下载代码并运行
    function downloadScript(callback, i=0){

        //debug url
        let debugUrl = "http://localhost:8080/acfunBlock-opensource.user.js?time="+(+new Date());

        let urls = [
            "https://greasyfork.org/scripts/387296-acfunblock%E5%BC%80%E6%BA%90%E4%BB%A3%E7%A0%81/code/AcfunBlock%E5%BC%80%E6%BA%90%E4%BB%A3%E7%A0%81.user.js", //开源地址
            "https://github.com/baldhumanity/AcfunComplement/raw/master/acfunBlock-opensource.user.js",//备用开源地址
        ]

        if (i>=urls.length){
            console.log("DEBUG 插件下载失败！");
            return;
        }
        // via Cache-Control header:
        xhttp({
            nocache:true,
            headers:{
              "Cache-Control": "no-cache, no-store, max-age=0",
              "Pragma": "no-cache"
            },
            method: "GET",
            url:dev ? debugUrl : urls[i],
            onload: function (response) {
                let text = response.responseText;
                callback(text);
            },
            onerror(evt) {
                console.log("DEBUG use fallback url.")
                downloadScript(callback, i+1);

            }
        });
    }

    function getVersion(s){
        try{
            if (typeof s === "undefined" || s==null || s==="undefined" || s==="") return 0;
            let p = /@version +(\d+\.\d+)/;
            let arr = p.exec(s);
            let latest = arr[1];
            return parseFloat(latest);
        }catch(e){
            return 0;
        }
    }


    function Initialise(){
        //Check if script is downloaded;
        GM_get("ACFUN_BLOCK_CODE","", (s)=>{
            let currentVersion = getVersion(s);
            console.log("Current Version = "+currentVersion);
            //如果已经有可用版本，先使用
            if (currentVersion>0 && !dev){
                   var code = s;

                   setTimeout(()=>{
                                eval(code);
                   })
            }
            //检查更新
            downloadScript(
                (s)=>{
                    if (typeof s === "undefined" || s==null || s==="undefined") {
                        console.log("ACFUN屏蔽计划载入失败，请不要联系A站插件作者：人文情怀。")
                    }
                    let onlineVersion = getVersion(s);
                    console.log("online Version = "+onlineVersion);
                    //如果有更新
                    if (onlineVersion> currentVersion || dev){
                        //Update code
                        GM_set("ACFUN_BLOCK_CODE", s, ()=>{
                            //Updated, if this is the firsttime running:
                            if (currentVersion==0 || dev){
                                //如果没有可用版本，直接运行
                                console.log("直接运行");
                               setTimeout(()=>{
                                eval(s);
                              })
                            }
                        }, ()=>{
                            console.log("ACFUN屏蔽计划缓存代码失败。请不要联系作者。");
                        })
                    }
                })
        })
    }
    function reset(){
         GM_set("ACFUN_BLOCK_CODE", "", ()=>{})
    }



    if (unsafeWindow){
        unsafeWindow.reset = reset;
    }
    if (window){
        window.reset = reset;
    }
    //debug();
    Initialise();
})();