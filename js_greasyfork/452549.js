// ==UserScript==
// @name         小说搜索
// @namespace    ythong
// @version      0.1
// @description  根据书源信息搜索小说
// @author       ythong
// @match        http://*/*
// @match        https://*/*
// @require      https://greasyfork.org/scripts/427726-gbk-url-js/code/GBK_URLjs.js?version=953098
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_addStyle
// @resource     bookSources file:///D:/360极速浏览器X下载/书源列表.json
// @noframes
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/452549/%E5%B0%8F%E8%AF%B4%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/452549/%E5%B0%8F%E8%AF%B4%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var root;
    var MaxThread = 10; // 同时下载数量
    var bookSources;
    function absolutizeURI(base, href) {
        // RFC 3986

        function parseURI(url) {
            var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
            // authority = '//' + user + ':' + pass '@' + hostname + ':' port
            return (m ? {
                href: m[0] || '',
                protocol: m[1] || '',
                authority: m[2] || '',
                host: m[3] || '',
                hostname: m[4] || '',
                port: m[5] || '',
                pathname: m[6] || '',
                search: m[7] || '',
                hash: m[8] || ''
            } : null);
        }
        function removeDotSegments(input) {
            var output = [];
            input.replace(/^(\.\.?(\/|$))+/, '').replace(/\/(\.(\/|$))+/g, '/').replace(/\/\.\.$/, '/../').replace(/\/?[^\/]*/g, function(p) {
                if (p === '/..') {
                    output.pop();
                } else {
                    output.push(p);
                }
            });
            return output.join('').replace(/^\//, input.charAt(0) === '/' ? '/' : '');
        }

        href = parseURI(href || '');
        base = parseURI(base || '');

        return !href || !base ? null : (href.protocol || base.protocol) + (href.protocol || href.authority ? href.authority : base.authority) + removeDotSegments(href.protocol || href.authority || href.pathname.charAt(0) === '/' ? href.pathname : (href.pathname ? ((base.authority && !base.pathname ? '/' : '') + base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + href.pathname) : base.pathname)) + (href.protocol || href.authority || href.pathname ? href.search : (href.search || base.search)) + href.hash;
    }
    function search(name){
        var bookSource;
        for(var i=2;i<bookSources.length;i++){
            bookSource=bookSources[i];
            if(bookSource.searchUrl && bookSource.ruleSearch) break;
        }
        console.log(bookSource.bookSourceUrl,bookSource.searchUrl ,bookSource.ruleSearch);
        var url=absolutizeURI(bookSource.bookSourceUrl,bookSource.searchUrl);
        url=url.replace("{{key}}",name).replace("{{page}}",1);
        console.log(url);
        download(url,i,getBook);
    }
    function getElements(doc,rule){
        var [s1,]=rule.split('@');

    }
    function getBook(doc,index){
        var ruleSearch=bookSources[index].ruleSearch;
        var name=ruleSearch.name;
        alert(name);

    }
    function download(href, index, callback) {
        function getDoc(str) {
            var doc = null;
            try {
                doc = document.implementation.createHTMLDocument('');
                doc.documentElement.innerHTML = str;
            }
            catch (e) {
                console.log('parse error');
            }
            return doc;
        } //getDoc
        if (typeof index == 'undefined') return;
        if (index < 0 || index >= bookSources.length) return;
        var ii=href.indexOf(',');
        if(ii!=-1){
            var url=href.slice(0,ii);
            var options=href.slice(ii+1);
        }else url=href;
        let requestBody = {
            method: 'GET',
            url: url,
            headers: {
                referer: url,
            },
            timeout: 15000,
            onload: function (result) {
                try{
                    var json=JSON.parse(result.responseText);
                    callback(json,index);
                }
                catch{
                    var doc = getDoc(result.responseText);
                    doc.href = url; //记下当前页面的网址，自己生成的没有网址。
                    callback(doc, index);
                }
            },
            onerror: function () {
                console.warn("error:", url);
                callback(null, index);
            },
            ontimeout: function () {
                console.warn("timeout: ", url);
                callback(null, index);
            }
        };
        if(options){
            options=JSON.parse(options);
            requestBody.method=options.method||'GET';
            requestBody.data=options.body||'';
            requestBody.headers=options.headers||requestBody.headers;
            var charset=options.charset;
        }
        GM_xmlhttpRequest(requestBody);
    } //getDocByHref

    function addDiv() {
        GM_addStyle(`
        #ythPanel{
          position:fixed;
          right:0px;
          z-index: 99999999999;
          background-color: #ccc;
          top: 0;
        }
        `);
        var shadowCss = `
<style>
button:hover{
    background-color: rgb(93 187 93);
}
.capsule{
    width: fit-content;
    border-radius: 10px;
    color: #000;
    padding: 0px 7px 2px 7px;
    border-width: 1px;
    border-style: solid;
}
#container{
    display: flex;
    flex-flow: column;
    align-content: space-between;
    padding: 5px;
	font-size: 10px;
    font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
    line-height: normal;
    text-align: left;
}
</style>`;
        var div = document.createElement("div");
        div.id = "ythPanel";
        root = div.attachShadow({ mode: 'open' });
        var html = shadowCss;
        html += `
<div id="container">
    <input id="bookname" value="天下">
    <button id="search" class="capsule">搜索</button>
</div>
`;
        root.innerHTML = html;
        document.documentElement.appendChild(div)
        bookSources = JSON.parse(GM_getResourceText('bookSources'));
        //        bookSources = GM_getValue('bookSources');
        if (!bookSources) bookSources = [];
        root.querySelector("#search").addEventListener("click", (e) => {
            search(root.querySelector("#bookname").value);
        });
    };
    GM_registerMenuCommand("搜索", addDiv);
})();