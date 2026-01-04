// ==UserScript==
// @name        たいつべ自己べ表示
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  ・。・
// @author       つべ
// @match        https://typing-tube.net/movie/show*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typing-tube.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452128/%E3%81%9F%E3%81%84%E3%81%A4%E3%81%B9%E8%87%AA%E5%B7%B1%E3%81%B9%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/452128/%E3%81%9F%E3%81%84%E3%81%A4%E3%81%B9%E8%87%AA%E5%B7%B1%E3%81%B9%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    window.addEventListener("load", setTimeout(Hyou(),800));
    function Hyou(){

        if( location.href.match("https://typing-tube.net/movie/show/") ){
        const li0 = document.createElement("li");
        const MSc = document.createElement("span");
        MSc.innerText = "自己ベスト: " + localStorage.getItem(location.href);
        li0.appendChild(MSc);
        document.querySelector("#ranking > ul").insertBefore(li0, document.querySelector("#ranking > ul").firstChild);
    };
        setInterval( function() {
           if(document.querySelector("#result_comment > a")){
               let HYs
               if(document.querySelector("#result_comment > p").innerText == ''){
                   console.log("ランキング非登録");
           const Score = parseFloat(document.querySelector("#score-value").innerText)
           if(Score > localStorage.getItem(location.href)){
               localStorage.setItem(location.href, Score);
           }else{
           };
               }else{
                   const k = document.querySelector("#result_comment > p").innerText.substr(18 ,document.querySelector("#result_comment > p").innerText.length - 27 ).trim();
                   if(!isNaN(k)){
                       HYs = parseFloat(document.querySelector("#result_comment > p").innerText.substr(18 ,document.querySelector("#result_comment > p").innerText.length - 27 ).trim())
                   }else{
                       HYs = parseFloat(document.querySelector("#result_comment > p").innerText.substr(26 ,document.querySelector("#result_comment > p").innerText.length - 29 ) .trim())
                   }
                   if(HYs < document.querySelector("#score-value").innerText){
                       if(document.querySelector("#score-value").innerText > localStorage.getItem(location.href)){
                           localStorage.setItem(location.href, document.querySelector("#score-value").innerText);
                       };
                   }else{
                       if(HYs > localStorage.getItem(location.href)){
                           localStorage.setItem(location.href,HYs);
                           console.log("最高記録:"+HYs);
                       };

                   };

               };
               setTimeout( function() {
                   document.querySelector("#result_comment > a").click();
               },1000);

           }
        }, 1000 );


    };


})();