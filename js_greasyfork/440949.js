// ==UserScript==
// @name         New2 Userscript
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @license MIT
// @description  try to take over the world!
// @author       You
// @match        https://maoming.xueanquan.com/MainPage.html
// @match       https://maoming.xueanquan.com/MainPage.html#1
// @match       https://maoming.xueanquan.com/MainPage.html#
// @match        
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xueanquan.com

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440949/New2%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/440949/New2%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function demo (timeout,cb){
        setTimeout(function(){  
            cb?cb():null;
        },timeout);
    }//supop logint;
    var p;


    demo(1000,function(){
        let pont1;

        pont1=document.querySelector("#YSIndex > a:nth-child(1)");
        if( pont1!=null){
            pont1.click();
        }

        demo(1000,function(){
            let pont1a;
            pont1a=document.querySelector("#YSlide > p:nth-child(3) > a > img");
            if(pont1a!=null)
            {
                pont1a.click();
            }
            demo(5000,function(){
                setTimeout(function(){
                    if(document.querySelector("#div_userInfo > a:nth-child(7)")!=null)
                    {document.querySelector("#div_userInfo > a:nth-child(7)").click();}
                },27000);

                demo(1000,null);
            });
        });
    });
})();