// ==UserScript==
// @name         kita
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       ECH
// @match        *://boards.4chan.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35985/kita.user.js
// @updateURL https://update.greasyfork.org/scripts/35985/kita.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('QRDialogCreation', function(e) {
        var textbox = document.getElementById("qr").getElementsByTagName("TEXTAREA")[0];
        setTimeout( function(){textbox.value += "ｷﾀ━━━(ﾟ∀ﾟ)━━━!!\n";}, 50);

        function kita(){
            var links = document.getElementsByTagName("A");
            var len = links.length;
            for(var i = len - 1 ; i >= 0 ; i--){
                if (links[i].getAttribute("kita") === null && ((links[i].getAttribute("title") !== null && links[i].getAttribute("title").indexOf("Reply") !== -1) ||links[i].className === "qr-link" )) {
                    links[i].setAttribute("kita", "!!!");
                    links[i].addEventListener("click", function(e){
                        var textbox = document.getElementById("qr").getElementsByTagName("TEXTAREA")[0];
                        setTimeout( function(){textbox.value += "ｷﾀ━━━(ﾟ∀ﾟ)━━━!!\n";}, 50);
                    });
                }
            }
            if(document.getElementById("togglePostFormLink").childNodes[1].getAttribute("kita") === null){
                document.getElementById("togglePostFormLink").childNodes[1].setAttribute("kita", "!!!");
                document.getElementById("togglePostFormLink").childNodes[1].addEventListener("click", function(){
                    var textbox = document.getElementById("postForm").getElementsByTagName("TEXTAREA")[0];
                    setTimeout( function(){textbox.value += "ｷﾀ━━━(ﾟ∀ﾟ)━━━!!\n";}, 50);
                });
            }
        }
        new MutationObserver(function(mutations){
            mutations.forEach(function(mutation){
                mutation.addedNodes.forEach(kita);
            });
        }).observe(document.body, {childList: true, subtree: true});

    }, false);

    function mainKita(){
        if(document.getElementById("togglePostFormLink").childNodes[1].getAttribute("kita") === null){
            document.getElementById("togglePostFormLink").childNodes[1].setAttribute("kita", "!!!");
            document.getElementById("togglePostFormLink").childNodes[1].addEventListener("click", function(){
                var textbox = document.getElementById("postForm").getElementsByTagName("TEXTAREA")[0];
                setTimeout( function(){textbox.value += "ｷﾀ━━━(ﾟ∀ﾟ)━━━!!\n";}, 50);
            });
        }
    }
            new MutationObserver(function(mutations){
            mutations.forEach(function(mutation){
                mutation.addedNodes.forEach(mainKita);
            });
        }).observe(document.body, {childList: true, subtree: true});

})();