// ==UserScript==
// @name         xiatou平台插件
// @namespace    xiatou Script
// @description  xiatou平台增强插件
// @author       czq
// @version      1.1.2
// @match        http://mark.xiatou.com/*
// @match        https://mark.xiatou.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_info
// @grant		 GM_getValue
// @grant		 GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/521973/xiatou%E5%B9%B3%E5%8F%B0%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/521973/xiatou%E5%B9%B3%E5%8F%B0%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==/////

(function () {
    'use strict';
     const http_url = window.location.href.startsWith('https') ? "https://mark.xiatou.com" : "http://mark.xiatou.com";
     let XHR = XMLHttpRequest.prototype;
     let open = XHR.open;
     let send = XHR.send;

     XHR.open = function (method, url) {
         this._method = method;
         this._url = url;
         return open.apply(this, arguments);
     };
     XHR.send = function (postData) {
         if (this._method.toLowerCase() === 'post') {
             if (this._url.indexOf('api/markResult/temporary/save') > -1) {
                saveCheck()
             }
         }
         return send.apply(this, arguments);
     };
     let originFetch = fetch;
     window.unsafeWindow.fetch = async function (...args) {
         const response = await originFetch(...args);
         if(args[0].url.startsWith('https://mark.xiatou.com/api/markResult/temporary/save')) {
            saveCheck();
         }
         return response;
     }
    function addCheckTips() {
        const checkMark = document.getElementById('check-mark');
        if (!checkMark) {
            const parentNode = document.getElementsByClassName('ant-spin-container');
            const editorNode = parentNode[0].childNodes[1].childNodes[1];
            const formNode = editorNode.childNodes[0];
            let titleNode = document.createElement('div');
            titleNode.setAttribute('class','TextRewriteEditor_label__3x5zu');
            let title = '检查结果';
            title += '<span style="background-color:pink;">(非英文字符)</span>';
            title += '<span style="background-color:yellow;">(标点后无空格)</span>';
            title += '<span style="background-color:orange;">(首字母未大写)</span>';
            titleNode.innerHTML = title;
            formNode.appendChild(titleNode);
            let textNode = document.createElement('div');
            textNode.setAttribute('id','check-mark');
            textNode.setAttribute('class','ant-form-item-control-input-content');
            textNode.setAttribute('style','height:238px;overflow-y:auto;');
            textNode.innerText = '无';
            formNode.appendChild(textNode);
        }
    }
    function saveCheck() {
        addCheckTips();
        try {
            const checkMark = document.getElementById('check-mark');
            const textarea = document.getElementById('mark');
            const text = textarea.value;
            let tips = '';
            let letterPositions = [],letterErrors = checkPunctuation(text);
            if (letterErrors.length > 0) {
                for(let i in letterErrors) letterPositions.push(letterErrors[i].index);
                tips += '"'+letterErrors.join(',') + '"->存在非英文的特殊字符\r\n';
            }
            let punctuationPositions = [],punctuationErrors = checkPunctuationSpace(text);
            if (punctuationErrors.length > 0) {
                for(let i in punctuationErrors) punctuationPositions.push(punctuationErrors[i].index);
                tips += '"'+punctuationErrors.join(',') + '"->存在标点后无空格情况\r\n';
            }
            let capitalPositions = [],capitalErrors = checkInitialCapitalization(text);
            if (capitalErrors.length > 0) {
                for(let i in capitalErrors) capitalPositions.push(capitalErrors[i].index);
                tips += '"'+capitalErrors.join(',') + '"->存在首字母未大写情况\r\n';
            }
            if (tips == '') return true;
            alert(tips);
            let words = text.split('');
            let html_content = '';
            for(let i = 0;i< words.length;i++) {
                if (letterPositions.includes(i)) {
                    html_content += '<span style="background-color:pink;">'+words[i]+'</span>';
                    continue;
                }
                if (punctuationPositions.includes(i)) {
                    html_content += '<span style="background-color:yellow;">'+words[i]+'</span>';
                    continue;
                }
                if (capitalPositions.includes(i)) {
                    html_content += '<span style="background-color:orange;">'+words[i]+'</span>';
                    continue;
                }
                html_content += words[i]
            }
            checkMark.innerHTML = html_content;
            return false;
        } catch(e) {
            alert("出现检查异常，请联系项目负责人");
            return false;
        }
    }
     function checkPunctuation(text) {
        const myRules = /[^0-9a-zA-Z\-\s'",.?!:;@]+/g
        return [...text.matchAll(myRules)];
     }
     function checkPunctuationSpace(text) {
        const myRules = /[^a-zA-Z\'\-\s@]+[a-zA-Z]+/g
        return [...text.matchAll(myRules)];
     }
     function checkInitialCapitalization(text) {
        const myRules = /[".!?:]+\s*[a-z]+/g
        return [...text.matchAll(myRules)];
     }
 
 })();