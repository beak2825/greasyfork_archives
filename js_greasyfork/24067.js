// ==UserScript==
// @name        TexTelegram
// @namespace   https://ncordon.github.io/
// @description Activa MathJax en la ventana de mensajes de telegram
// @version     1
// @include     https://web.telegram.org/*
// @grant       none
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/24067/TexTelegram.user.js
// @updateURL https://update.greasyfork.org/scripts/24067/TexTelegram.meta.js
// ==/UserScript==


(function(){
    var toRender = document.getElementsByClassName("im_history_scrollable_wrap nano-content")

    if(window.MathJax===undefined){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML";
        var config = 'MathJax.Hub.Config({' + 'extensions: ["tex2jax.js"],' + 
            'tex2jax: { inlineMath: [["$","$"]], displayMath: [["$$","$$"]], processEscapes: true },' +
            'jax: ["input/TeX","output/HTML-CSS"]' + '});' +
            'MathJax.Hub.Startup.onload();';
        
        if (window.opera) {
            script.innerHTML = config
        }
        else {
            script.text = config
        }

        document.getElementsByTagName("head")[0].appendChild(script);

        (doTexTelegram=function(){
            window.setTimeout(doTexTelegram,1000);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, toRender]);
        })();
    }
    else{
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, toRender]);
    }
})();