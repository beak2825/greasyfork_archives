// ==UserScript==
// @name         Unraid Custom Tab自适应窗体大小
// @namespace    https://github.com/dixtdf/Unraid-Custom-Tab-Adaptive-Window-Size
// @version      1.1
// @description  窗体宽高随意设置即可
// @author       dixtdf
// @match        http*://*/*
// @icon         https://upload.forums.unraid.net/live/monthly_2017_05/customlarge.png.e0cb690d73cea725de6927fc0abce6a7.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477567/Unraid%20Custom%20Tab%E8%87%AA%E9%80%82%E5%BA%94%E7%AA%97%E4%BD%93%E5%A4%A7%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/477567/Unraid%20Custom%20Tab%E8%87%AA%E9%80%82%E5%BA%94%E7%AA%97%E4%BD%93%E5%A4%A7%E5%B0%8F.meta.js
// ==/UserScript==

(function() {
    function onWindowResize() {
        let elementsByClassName = window.document.getElementsByClassName("content shift");
        if (elementsByClassName.length>0){
            let computedStyle = window.getComputedStyle(elementsByClassName[0].querySelector(".title"));
            if (computedStyle){
                let height = window.innerHeight-(
                    window.document.getElementById("header").offsetHeight
                    +window.document.getElementById("menu").offsetHeight
                    +(window.document.getElementById("footer")!=null?window.document.getElementById("footer").offsetHeight:26)
                    +parseInt(computedStyle.getPropertyValue("height").replace("px",""), 10)
                    +parseInt(computedStyle.getPropertyValue("padding-top").replace("px",""), 10)
                    +parseInt(computedStyle.getPropertyValue("padding-bottom").replace("px",""), 10)
                    +parseInt(computedStyle.getPropertyValue("margin-top").replace("px",""), 10)
                    +parseInt(computedStyle.getPropertyValue("margin-bottom").replace("px",""), 10)
                    +30
                )

                let width=parseInt(computedStyle.getPropertyValue("width").replace("px",""), 10)
                    +parseInt(computedStyle.getPropertyValue("padding-left").replace("px",""), 10)
                    +parseInt(computedStyle.getPropertyValue("padding-right").replace("px",""), 10)

                let iframeElement = window.document.querySelector(".content.shift iframe");
                iframeElement.style.width = width+"px";
                iframeElement.style.height = height+"px";
                iframeElement.style.border = "0px";
            }
        }
    }

    window.addEventListener("resize", function() {
        clearTimeout(window.resizedFinished);
        window.resizedFinished = setTimeout(onWindowResize, 200);
    });

    onWindowResize();
})();