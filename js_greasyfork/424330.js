// ==UserScript==
// @name         Kok Egg Touching Gently
// @namespace    kok.eggtouch
// @version      2.0
// @description  Touch your eggs
// @author       kok [2316623]
// @match        https://www.torn.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/424330/Kok%20Egg%20Touching%20Gently.user.js
// @updateURL https://update.greasyfork.org/scripts/424330/Kok%20Egg%20Touching%20Gently.meta.js
// ==/UserScript==

$("#mainContainer").ready(function(){

    var observer = new MutationObserver(function(mutations) {
        if($("div[class$='popup-wrapper']").length){
                var img = new Image();
                img.setAttribute('crossOrigin', 'anonymous');

                img.onload = function () {
                    var canvas = document.createElement("canvas");
                    canvas.width = this.width;
                    canvas.height = this.height;

                    var context = canvas.getContext("2d");
                    context.drawImage(this, 0, 0);

                    var dataURL = canvas.toDataURL("image/png");

                    data = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
                    if(data.length > 500) {
                        GM_addStyle('@keyframes pulse2{0%{opacity:1;box-shadow:0 0 0 0 #ffc107;bottom:171px;right:147px;height:300px;width:300px;opacity:.4}50%{bottom:171px;right:147px;height:300px;width:300px;opacity:1}100%{opacity:.5;box-shadow:0 0 0 1000px transparent;bottom:171px;right:147px;height:300px;width:300px;opacity:.1}}div[class$=popup-wrapper]>div::after{background-image:radial-gradient(rgba(0,0,0,0),#FFEB3B);border-radius:100%;content:"";display:flex;position:relative;bottom:171px;right:147px;height:300px;width:300px;animation:pulse2 3s ease-out;animation-iteration-count:infinite;z-index:-100}');
                    }
                    else {
                        $("div[class$='popup-wrapper']").remove();
                    }
                };

                img.src = $("div[class$='popup-wrapper'] img").attr("src");
        }
    });

    var observerTarget = $("div#mainContainer")[0];
    var observerConfig = { attributes: true, childList: true, characterData: false, subtree: true };
    observer.observe(observerTarget, observerConfig);
});