// ==UserScript==
// @name         UCAS OJ Tester
// @namespace    http://tampermonkey.net/
// @version      114.514.1919.810
// @description  zh-cn
// @match        http://42.192.84.166/problem?page=4
// @match        http://42.192.84.166/problem?page=3
// @match        http://42.192.84.166/problem?page=2
// @match        http://42.192.84.166/problem?page=1
// @match        http://42.192.84.166/problem
// @icon         https://www.google.com/s2/favicons?sz=64&domain=84.166
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469661/UCAS%20OJ%20Tester.user.js
// @updateURL https://update.greasyfork.org/scripts/469661/UCAS%20OJ%20Tester.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function test(){
        window.alert("若无反应，请刷新页面\n请保证表格最左侧一栏有√或-符号\n本程序仅供调试使用，请勿挪作他用\n点击确认代表您同意以上表述");
        var lst = document.getElementsByClassName("ivu-table-row");
        var blist = document.getElementsByClassName("ivu-page")[0];
        setTimeout(() => {
            setInterval(() => {
                for(let i=0; i<lst.length; i++){
                    let e = lst[i].children[0].children[0];
                    if(e.children.length==0 || e.children[0].classList.contains("ivu-icon-minus-round")){
                        e.innerHTML = "<i class=\"ivu-icon ivu-icon-checkmark-round\" style=\"font-size: 16px; color: rgb(25, 190, 107);\"></i>";
                    }
                }
            }, 1000);
        }, 1000);
    }

    test();

})();