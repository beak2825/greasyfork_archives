// ==UserScript==
// @name         font@Hedes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *
// @exclude      *.seedr.cc*
// @exclude      *console.cloud.google.com/cloudshell*
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/374240/font%40Hedes.user.js
// @updateURL https://update.greasyfork.org/scripts/374240/font%40Hedes.meta.js
// ==/UserScript==

function changeFont(s_font, mode, scale_rate) {
    if (s_font !== "") {
        var element = document.createElement("link");
        switch (mode) {
            case 0:
                element.rel = "stylesheet";
                element.type = "text/css";
                element.href = 'data:text/css,*:not([class*="icon"]):not([class*="fa"]):not([class*="logo"]):not([class*="mi"]):not(i){font-size: '+scale_rate+'rem!important;font-family:' + s_font + ',Arial,stonefont,iknow-qb_share_icons,review-iconfont,mui-act-font,fontAwesome,tm-detail-font,office365icons,MWF-MDL2,global-iconfont,"Bowtie" !important;}';
                document.documentElement.appendChild(element);
                break;
            case 1:
                setTimeout(function () {
                    var modStyle = document.querySelector('#modCSS_font');
                    if (modStyle === null) {
                        modStyle = document.createElement('style');
                        modStyle.id = 'modCSS_font';
                        document.body.appendChild(modStyle);
                    }
                    modStyle.innerHTML = '*:not([class*="icon"]):not([class*="fa"]):not([class*="logo"]):not([class*="mi"]):not(i){font-size: '+scale_rate+'rem!important;font-family:' + s_font + ',Arial,stonefont,iknow-qb_share_icons,review-iconfont,mui-act-font,fontAwesome,tm-detail-font,office365icons,MWF-MDL2,global-iconfont,"Bowtie" !important;';
                }, 300);
                break;
            case 2:

                element.rel = "stylesheet";
                element.type = "text/css";
                element.href = 'data:text/css,*:not([class*="icon"]):not([class*="fa"]):not([class*="logo"]):not([class*="mi"]):not(i){font-size: '+scale_rate+'rem!important;font-family:' + s_font + ',Arial,stonefont,iknow-qb_share_icons,review-iconfont,mui-act-font,fontAwesome,tm-detail-font,office365icons,MWF-MDL2,global-iconfont,"Bowtie" !important;}';
                document.documentElement.appendChild(element);
                setTimeout(function () {
                    var modStyle = document.querySelector('#modCSS_font');
                    if (modStyle === null) {
                        modStyle = document.createElement('style');
                        modStyle.id = 'modCSS_font';
                        document.body.appendChild(modStyle);
                    }
                    modStyle.innerHTML = '*:not([class*="icon"]):not([class*="fa"]):not([class*="logo"]):not([class*="mi"]):not(i){font-size: '+scale_rate+'rem!important;font-family:' + s_font + ',Arial,stonefont,iknow-qb_share_icons,review-iconfont,mui-act-font,fontAwesome,tm-detail-font,office365icons,MWF-MDL2,global-iconfont,"Bowtie" !important;';
                }, 300);
                break;
        }
    }
}

(function() {
	// changeFont("Fira Code",2, 0.92);
    changeFont("Hack Nerd Font",2, 0.92);
    // changeFont("PingFang SC",2, 0.98);
    // changeFont("YaHei Consolas Hybrid",2, 0.95);
})();