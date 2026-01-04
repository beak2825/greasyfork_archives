// ==UserScript==
// @name         人卫慕课播放助手
// @namespace    https://qinlili.bid
// @version      0.1.2
// @description  自动升级到720P+预取Key减少缓冲
// @author       琴梨梨
// @match        *://www.pmphmooc.com/*
// @icon         https://www.pmphmooc.com/static/favicon.ico
// @require      https://lib.baomitu.com/m3u8-parser/4.7.0/m3u8-parser.min.js#sha512-k+LQLfQIGmuQTgjCfnE/iU3jdv+J9sdykVF5SgKtc+aMiKWPZqGjs60Bp3lug6rh9DVhcSZefpetyVXwUny48w==
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/440564/%E4%BA%BA%E5%8D%AB%E6%85%95%E8%AF%BE%E6%92%AD%E6%94%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/440564/%E4%BA%BA%E5%8D%AB%E6%85%95%E8%AF%BE%E6%92%AD%E6%94%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (function(appendChild) {
        Node.prototype.appendChild = function(ele,loc) {
            if(ele.src&&ele.src.startsWith("http://")>0){
                console.log(ele)
                ele.src=ele.src.replace("http://","https://")
            }
            return appendChild.call(this, ele,loc);
        };

    })(Node.prototype.appendChild);
    //https://stackoverflow.com/a/52171480
    const cyrb53 = function(str, seed = 0) {
        let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
        for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
        h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
        return 4294967296 * (2097151 & h2) + (h1>>>0);
    };
    //https://stackoverflow.com/a/61226119
    const blobToBase64 = blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise(resolve => {
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    };
    let cacheKey={}
    const makeCache=async(url,hashKey)=>{
        let cache=await blobToBase64(await (await fetch(url)).blob())
        cacheKey[hashKey]=cache
        document.getElementsByClassName("videoTitle")[0].innerText+="[缓冲加速已开启]"
    }
    const m3u8Prefetch=async(m3u8)=>{
        console.log("Begin prefetch, getting m3u8 info...-Qinlili")
        const m3u8Text=await (await fetch(m3u8)).text();
        const parser = new m3u8Parser.Parser();
        parser.push(m3u8Text);
        const segments=parser.manifest.segments;
        console.log("Success fetch m3u8 info. -Qinlili")
        console.log(segments);
        segments.forEach(async part=>{
            const controller = new AbortController();
            const signal = controller.signal;
            await fetch(part.uri.replace("http://","https://"),{
                method:"GET",
                signal:signal
            })
            controller.abort();
        })
        console.log("Prefetch done. -Qinlili")
    }
    (open=> {
        XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
            if(url.startsWith("http://")){
                url=url.replace("http://","https://")
            }
            if (url.indexOf("index.m3u8")>0) {
                console.log("Get m3u8 link: " + url + " -Qinlili");
                url = url.replace("480P","720P");
                m3u8Prefetch(url);
            }
            if (url.indexOf("/api/m3u8/getUri")>0) {
                let hashKey=cyrb53(url)
                if(cacheKey[hashKey]){
                    console.log("Use local cache key-Qinlili")
                    url=cacheKey[hashKey]
                }else{
                    console.log("No key cache, use async fetch: " + url + " -Qinlili")
                    makeCache(url,hashKey)
                }
            }
            return open.call(this, method, url, async, user, pass);
        };
    })(XMLHttpRequest.prototype.open);
})();