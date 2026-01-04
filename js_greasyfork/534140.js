// ==UserScript==
// @name         QQ链接自动跳转
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  自动检测从QQ打开的链接并跳转到正确页面。
// @author       JMRY
// @match        https://c.pc.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534140/QQ%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/534140/QQ%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

/*
1.0 2050427
- 实现基本功能。
*/

(function() {
    'use strict';
    function urlMatch(url){
        if(window.location.href.includes(url)){
            return true;
        }else{
            return false;
        }
    }
    function getParams(name){
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function getUrl(){
        return decodeURIComponent(getParams(`pfurl`) || getParams(`url`));
    }
    function main(){
        let url=getUrl();
        console.log(url);
        if(url && url!=`undefined`){
            window.location.href=url;
        }
    }
    main();
})();