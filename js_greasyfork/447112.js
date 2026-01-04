// ==UserScript==
// @name         国外静态资源CDN加速访问
// @namespace    辉哥博客
// @version      0.0.9
// @description  将国外的静态资源js和css资源替换成国内的 CDN 地址|CDN赞助商-蓝易云安全：https://www.tsyvps.com/aff/AVEWBVAM
// @author       辉哥博客
// @license      GPL-2.0
// @update       2023/4/20
// @match        *://*/*
// @homepageURL  https://www.haah.net
 
// @downloadURL https://update.greasyfork.org/scripts/447112/%E5%9B%BD%E5%A4%96%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90CDN%E5%8A%A0%E9%80%9F%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/447112/%E5%9B%BD%E5%A4%96%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90CDN%E5%8A%A0%E9%80%9F%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==
/* eslint-disable */
 
!function() {
    "use strict";
    document.querySelectorAll("script").forEach((function(e) {
        if (e.src.indexOf("themes.googleusercontent.com") >= 0 || e.src.indexOf("fonts.gstatic.com") >= 0 || e.src.indexOf("www.google.com/recaptcha/") >= 0 || e.src.indexOf("secure.gravatar.com") >= 0 || e.src.indexOf("ajax.googleapis.com") >= 0 || e.src.indexOf("fonts.googleapis.com") >= 0 || e.src.indexOf("cdnjs.cloudflare.com") >= 0 || e.src.indexOf("cdn.jsdelivr.net") >= 0 || e.src.indexOf("www.gstatic.com") >= 0 || e.src.indexOf("translate.googleapis.com") >= 0) {
            let c = e.src.replace("http://", "https://").replace("themes.googleusercontent.com", "gtheme.cdnjs.ltd").replace("fonts.gstatic.com", "fonts.gstatic.cn").replace("secure.gravatar.com", "gravatar.cdnjs.ltd").replace("ajax.googleapis.com", "gajax.cdnjs.ltd").replace("fonts.googleapis.com", "gfont.cdnjs.ltd").replace("cdnjs.cloudflare.com", "cdnjs.cdnjs.ltd").replace("www.google.com/recaptcha/", "www.recaptcha.net/recaptcha/").replace("cdn.jsdelivr.net", "js.cdnjs.ltd").replace("www.gstatic.com", "www.gstatic.cn").replace("translate.googleapis.com", "gtranslate.cdnjs.ltd");
            e.parentNode.replaceChild(function(e) {
                let c = document.createElement("script");
                return c.src = e, c;
            }(c), e);
        }
    }));
}();
// !function() {
//     "use strict";
//     document.querySelectorAll("script").forEach((function(e) {
//         if (e.src.indexOf("fonts.gstatic.com") >= 0 || e.src.indexOf("www.google.com/recaptcha/") >= 0 || e.src.indexOf("cdn.jsdelivr.net") >= 0 || e.src.indexOf("www.gstatic.com") >= 0 || e.src.indexOf("cdn.jsdelivr.net/npm/") >= 0) {
//             let c = e.src.replace("http://", "https://").replace("fonts.gstatic.com", "fonts.gstatic.cn").replace("www.google.com/recaptcha/", "recaptcha.net/recaptcha/").replace("www.gstatic.com", "www.gstatic.cn").replace("cdn.jsdelivr.net/npm/", "unpkg.zhimg.com/");
//             e.parentNode.replaceChild(function(e) {
//                 let c = document.createElement("script");
//                 return c.src = e, c;
//             }(c), e);
//         }
//     }));
// }();