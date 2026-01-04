// ==UserScript==
// @name         Twitterデフォルトで高画質で画像読み込み
// @namespace    https://twitter.com/yosshi9990
// @version      1.2
// @description  タイムライン等のツイートをデフォルトで高画質で画像を読み込みます
// @author       元祖のヨッシー
// @match        *://x.com/*
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
// @downloadURL https://update.greasyfork.org/scripts/493612/Twitter%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%81%A7%E9%AB%98%E7%94%BB%E8%B3%AA%E3%81%A7%E7%94%BB%E5%83%8F%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/493612/Twitter%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%81%A7%E9%AB%98%E7%94%BB%E8%B3%AA%E3%81%A7%E7%94%BB%E5%83%8F%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF.meta.js
// ==/UserScript==

(function() {
       window.setInterval(function(){
        let basea=document.querySelectorAll('[data-testid="tweetPhoto"]');
        basea.forEach(function (vaka, inde) {
            if(vaka.getAttribute("aria-label")==="画像"&&vaka.getAttribute("Changed")===null){
                let str=vaka.getElementsByClassName("css-175oi2r r-1niwhzg r-vvn4in r-u6sd8q r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw r-4gszlv")[0]
                .getAttribute("style");
                let ans='background-image: url("';
                for(let i=0;;++i){
                    if(str[i++]==='"'){
                        while(str[i]!=="&"){
                            ans+=str[i];
                            ++i;
                        }
                        break;
                    }
                }
                ans+='&name=large");';
                vaka.getElementsByClassName("css-175oi2r r-1niwhzg r-vvn4in r-u6sd8q r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw r-4gszlv")[0]
                    .setAttribute("style",ans);
                vaka.setAttribute("Changed",true);
                console.log(vaka);
            }
        });
           /*
           let aree=document.querySelectorAll('[class="css-175oi2r r-1mlwlqe r-1udh08x r-417010"]');
        aree.forEach(function (vaka, inde) {
            let val=vaka.getElementsByClassName("css-175oi2r r-1niwhzg r-vvn4in r-u6sd8q r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw r-4gszlv");
            if(val.length!=0&val[0].getAttribute("style").substr(0,16)==="background-image"&&val[0].getAttribute("Changed")===null){
                let str=val[0].getAttribute("style");
                let ans='background-image: url("';
                for(let i=0;;++i){
                    if(str[i++]==='"'){
                        while(str[i]!=="&"){
                            ans+=str[i];
                            ++i;
                        }
                        break;
                    }
                }
                ans+='&name=large");';
                val[0].setAttribute("style",ans);
                val[0].setAttribute("Changed",true);
                console.log(vaka);
            }
        });*/
    }, 500);
})();