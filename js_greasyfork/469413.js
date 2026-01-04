// ==UserScript==
// @name         Twitterアフィカス(TwitterBlue)ブロッカー
// @namespace    https://twitter.com/yosshi9990
// @version      0.31
// @description  公式マークをブロックします
// @author       元祖のヨッシー
// @match        *://twitter.com/*
// @grant        none
// @compatible   vivaldi
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @icon https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png
// @supportURL   https://twitter.com/messages/compose?recipient_id=1183000451714703361
// @contributionURL　https://www.youtube.com/@gansonoyoshi?sub_confirmation=1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469413/Twitter%E3%82%A2%E3%83%95%E3%82%A3%E3%82%AB%E3%82%B9%28TwitterBlue%29%E3%83%96%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/469413/Twitter%E3%82%A2%E3%83%95%E3%82%A3%E3%82%AB%E3%82%B9%28TwitterBlue%29%E3%83%96%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BC.meta.js
// ==/UserScript==
(function() {
    window.setInterval(function(){
        let list=document.querySelectorAll('[aria-label="認証済みアカウント"]');
        list.forEach(function (value, index) {
            let par=value.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            if(par.getAttribute('style')!==null){
                if(par.getAttribute('style').substr(0,7)!="bottom:"&&par.getAttribute('style').substr(0,4)!="top:"&&par.getAttribute('style').substr(0,11)!="min-height:"){
                    if(value.getAttribute("class").substr(0,8)=="r-1cvl2h"){
                        par.style="display:none; !important";
                    }
                    else if(value.getAttribute("class").substr(0,8)=="r-4qtqp9"){
                        //↓この行のコードをコメントアウトすると企業向けTwitterBlueのブロックを解除できます。
                        par.style="display:none; !important";

                    }
                }
            }else if(par.getAttribute('role')!="region"&&par.getAttribute('class')=="css-1dbjc4n r-16y2uox r-1wbh5a2 r-1ny4l3l"){
                //↓この行のコードは引用リツイートをブロックします。
                par.style="display:none; !important";
            }
            let prof=value.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            if(prof.getAttribute('data-testid')=="cellInnerDiv"&&prof.getAttribute('style').substr(0,9)=="transform"){
                //↓アカウント欄での非表示
                prof.style="display:none; !important";
            }
        });
    }, 200);
//上の200の値を短くすると更にブロックが早くなりますが、重くなる可能性があります。
})();