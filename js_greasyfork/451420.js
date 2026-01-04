// ==UserScript==
// @name         深藍的背景加狙擊鏡（超酷）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Theme for Shell shockers（dark blue）
// @author       Empty egg god
// @match        https://shellshock.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451420/%E6%B7%B1%E8%97%8D%E7%9A%84%E8%83%8C%E6%99%AF%E5%8A%A0%E7%8B%99%E6%93%8A%E9%8F%A1%EF%BC%88%E8%B6%85%E9%85%B7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/451420/%E6%B7%B1%E8%97%8D%E7%9A%84%E8%83%8C%E6%99%AF%E5%8A%A0%E7%8B%99%E6%93%8A%E9%8F%A1%EF%BC%88%E8%B6%85%E9%85%B7%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    const addScript=()=>{
        document.title = 'Dark Theme';
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://dark-blue.plund1991.repl.co/style.css';
        document.head.appendChild(style);
    }
    if(document.body){
        addScript();
    }else{
        document.addEventListener('DOMContentLoaded', function(e){
            addScript();
        })
    }
})();