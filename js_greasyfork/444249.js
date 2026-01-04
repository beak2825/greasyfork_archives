// ==UserScript==
// @name         Redirect from Mobile to PC version for Wikipedia
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Redirect from Mobile to PC version automation
// @author       Tonino
// @match        https://*.m.wikipedia.org/*
// @match        https://wuu.wikipedia.org/*
// @match        https://m.sohu.com/*
// @icon         https://www.wikipedia.org/static/favicon/wikipedia.ico
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/444249/Redirect%20from%20Mobile%20to%20PC%20version%20for%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/444249/Redirect%20from%20Mobile%20to%20PC%20version%20for%20Wikipedia.meta.js
// ==/UserScript==

(function() {
     var originUrl=document.location.toString();
     if(originUrl.includes("zh.m.wikipedia")){
// //         var arrUrl = document.location.toString().split(".m.");
// //         window.location.replace((arrUrl[0]+"."+arrUrl[1])
// //                                 .replace("\/zh-mo\/","\/zh-cn\/")
// //                                 .replace("\/zh-hans\/","\/zh-cn\/")
// //                                 .replace("\/zh\/","\/zh-cn\/"));
//         //window.location.replace(originUrl.replace("\/zh.m\/","\/www\/"));
//         location.assign(originUrl.replace("zh.m.wikipedia","zh.wikipedia"));
//        // alert(originUrl.replace("zh.m","www"));
// //         var arrURl5=document.location.toString().replace("\/zh-hant\/","\/zh-cn\/");
// //         window.location .replace(arrURl5);
         location.assign(originUrl.replace("zh.m.wikipedia","zh.wikipedia"));
     }
    else if(originUrl.includes("wuu.wikipedia")){
         location.assign(originUrl.replace("wuu.wikipedia","zh.wikipedia"));
    }

    else if(originUrl.includes("m.sohu")){
//         var arrURl1=document.location.toString().replace("m.sohu","www.sohu");
//         console.log(arrURl1);
//         window.location.replace(arrURl1);
//     }
//     else if(originUrl.includes("yahoo") && !originUrl.includes("tw.news.yahoo")){
//         var arrURl2=document.location.toString()
//                                 .replace("news.yahoo","tw.news.yahoo")
//                                 .replace("www.yahoo.com\/entertainment","tw.news.yahoo.com\/entertainment");
//         console.log(arrURl2);
//         window.location.replace(arrURl2);
         location.assign(originUrl.replace("m.sohu","www.sohu"));
     }
})();
