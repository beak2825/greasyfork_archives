// ==UserScript==
// @name         秀米HTML复制
// @namespace    https://greasyfork.org/zh-CN/scripts/430684
// @version      0.3.1
// @description  try to take over the xiumi html output!
// @author       You
// @match        http*://xiumi.us/studio/*
// @run-at       document-idle
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM.setClipboard
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/430684/%E7%A7%80%E7%B1%B3HTML%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/430684/%E7%A7%80%E7%B1%B3HTML%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

    function check(changes, observer) {
        if(document.querySelector('.tn-op-btn-group')) {
            observer.disconnect();

            var $button = $('<button class="btn-img op-btn copyHTML" style="border:2px solid #ccc; width:40px; height:40px; border-radius:40px; vertical-align: text-bottom;">copy</button>').appendTo('.tn-op-btn-group');

            $button.click(function(){
                if($('.projection').find('section').length){
                    GM.setClipboard($('.projection')[0].outerHTML);
                    alert('已复制');
                }
                else{
                    alert('请先激活页面的复制按钮');
                }
            })
        }
    }

    

})();