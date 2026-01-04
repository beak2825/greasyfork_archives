// ==UserScript==
// @name         (リプライのみブロック)Twitterアフィカス(TwitterBlue)ブロッカー
// @namespace    https://twitter.com/yosshi9990
// @version      0.2
// @description  公式マークをブロックします
// @author       元祖のヨッシー
// @match        http*://twitter.com/*
// @grant        none
// @compatible   vivaldi
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @icon https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png
// @supportURL   https://twitter.com/messages/compose?recipient_id=1183000451714703361
// @contributionURL　https://www.youtube.com/@gansonoyoshi?sub_confirmation=1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473798/%28%E3%83%AA%E3%83%97%E3%83%A9%E3%82%A4%E3%81%AE%E3%81%BF%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%29Twitter%E3%82%A2%E3%83%95%E3%82%A3%E3%82%AB%E3%82%B9%28TwitterBlue%29%E3%83%96%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/473798/%28%E3%83%AA%E3%83%97%E3%83%A9%E3%82%A4%E3%81%AE%E3%81%BF%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%29Twitter%E3%82%A2%E3%83%95%E3%82%A3%E3%82%AB%E3%82%B9%28TwitterBlue%29%E3%83%96%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BC.meta.js
// ==/UserScript==
(function() {
    window.setInterval(function(){
        let list=document.querySelectorAll('[aria-label="認証済みアカウント"]');
        list.forEach(function (value, index) {
            let par=value.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            if(/position: absolute; width: 100%; transition:/.test(par.getAttribute('style'))&&/status/.test(location.pathname)&par.getAttribute('style')!="transform: translateY(0px); position: absolute; width: 100%; transition: opacity 0.3s ease-out 0s;"){
                if(par.getAttribute('style').substr(0,7)!="bottom:"&&par.getAttribute('style').substr(0,4)!="top:"&&par.getAttribute('style').substr(0,11)!="min-height:"){
                    if(value.getAttribute("class").substr(0,8)=="r-1cvl2h"){
                        //par.style="display:none; !important";
                        //英語によるブロックのしきい値計算
                        if(value.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("css-901oao r-18jsvk2 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-bnwqim r-qvutc0").length!=0){
                            let tweetdesu=value.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("css-901oao r-18jsvk2 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-bnwqim r-qvutc0")[0].innerText;
                            let nospace='',eigonado=0;
                            for(let i=0;i<tweetdesu.length;++i)if(tweetdesu[i]!=' '&&tweetdesu[i]!='\n')nospace+=tweetdesu[i];
                            for(let i=0;i<nospace.length;++i)if('a'<=nospace[i]&&nospace[i]<='z'||'A'<=nospace[i]&&'Z'>=nospace[i])++eigonado;
                            if(nospace.length*0.8<=eigonado||nospace.length<=10){
                                par.innerHTML = '';
                            }
                        }
                    }
                    else if(value.getAttribute("class").substr(0,8)=="r-4qtqp9"){
                        //↓この行のコードをコメントアウトすると企業向けTwitterBlueのブロックを解除できます。
                        // par.innerHTML = '';

                    }
                }
            }/*
            else if(par.getAttribute('role')!="region"&&par.getAttribute('class')=="css-1dbjc4n r-16y2uox r-1wbh5a2 r-1ny4l3l"){
                //↓この行のコードは引用リツイートをブロックします。
                //par.style="display:none; !important";
            }
            let prof=value.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            if(prof.getAttribute('data-testid')=="cellInnerDiv"&&prof.getAttribute('style').substr(0,9)=="transform"){
                //↓アカウント欄での非表示
                prof.style="display:none; !important";
            }
            */
        });
        let eigolist=document.querySelectorAll('[data-testid="cellInnerDiv"]');
        eigolist.forEach(function (value, index) {
            if(index!=0&&value.getElementsByClassName("css-901oao r-18jsvk2 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-bnwqim r-qvutc0").length!=0){
            let tweetdesu=value.getElementsByClassName("css-901oao r-18jsvk2 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-bnwqim r-qvutc0")[0].innerText;
            let nospace='',eigonado=0;
            for(let i=0;i<tweetdesu.length;++i)if(tweetdesu[i]!=' '&&tweetdesu[i]!='\n')nospace+=tweetdesu[i];
            for(let i=0;i<nospace.length;++i)if('a'<=nospace[i]&&nospace[i]<='z'||'A'<=nospace[i]&&'Z'>=nospace[i])++eigonado;
            if(nospace.length*0.8<=eigonado&&nospace.length<=10){
                value.innerHTML = '';
            }
            }
        });
    }, 100);
//上の200の値を短くすると更にブロックが早くなりますが、重くなる可能性があります。
})();