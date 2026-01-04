// ==UserScript==
// @name         去掉烦人的“外链安全检查”
// @namespace    http://tampermonkey.net/
// @version 2
// @description  如题，点击即达
// @author       raincore
// @match        https://www.vikacg.com/p/*
// @grant        none
// @require https://update.greasyfork.org/scripts/441505/1028182/crypto-js411.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494646/%E5%8E%BB%E6%8E%89%E7%83%A6%E4%BA%BA%E7%9A%84%E2%80%9C%E5%A4%96%E9%93%BE%E5%AE%89%E5%85%A8%E6%A3%80%E6%9F%A5%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/494646/%E5%8E%BB%E6%8E%89%E7%83%A6%E4%BA%BA%E7%9A%84%E2%80%9C%E5%A4%96%E9%93%BE%E5%AE%89%E5%85%A8%E6%A3%80%E6%9F%A5%E2%80%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DEBUG = false;

    function ConsoleLog(e){
        if (!DEBUG){return;}
        console.log(e);
    }
    function DecryptUrl(e){
        const r = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(e));
        const key = CryptoJS.enc.Utf8.parse("7R75R3JZE2PZUTHH");
        const iv = CryptoJS.enc.Utf8.parse("XWO76NCVZM2X1UCU");
        return CryptoJS.AES.decrypt(r, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
    }
    function ReplaceHref(entryContent){
        if (entryContent === undefined){
            return 0;
        }
        const a_list = entryContent.getElementsByTagName('a');
        ConsoleLog(`found a_list:${a_list.length} in entry content`);
        let processCnt = 0;
        for (let a of a_list){
            if(a.href.indexOf('/external?e=') >= 0){
                processCnt++;
                ConsoleLog(`found external a:${a}`);
                const e = new URLSearchParams((new URL(a.href)).search).get('e')
                const url = DecryptUrl(e);
                ConsoleLog(`raw url:${url}`);
                //replace with new "a"
                const new_a = document.createElement("a");
                new_a.innerHTML = a.innerHTML;
                new_a.href = url;
                new_a.target="_blank";
                a.parentNode.replaceChild(new_a, a);
            }
        }
        return processCnt;
    }
    function sleep(time){
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    async function main(){
        //wait for 'content-excerpt' to disappear
        let content_excerpts;
        while(true){
            content_excerpts = document.getElementsByClassName('content-excerpt');
            if (content_excerpts.length == 0) {
                break;
            }
            ConsoleLog("content_excerpts exists");
            await sleep(1);
        }
        ConsoleLog("content_excerpts not exists");
        // wait for 'entry-content' to appear
        let entry_contents;
        while(true){
            entry_contents = document.getElementsByClassName('entry-content');
            if (entry_contents.length > 0){
                break;
            }
            ConsoleLog("entry content not exist");
            await sleep(1);
        }
        ConsoleLog("entry content exist");
        while(true){
            let processCnt = ReplaceHref(entry_contents[0]);
            await sleep(1);
            ConsoleLog(`processCnt:${processCnt}`);
        }
    }
    main();
})();