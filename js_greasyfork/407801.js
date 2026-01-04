// ==UserScript==
// @name         fix Google image popup
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  show images in popup instead of opening the source
// @author       You
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @include      https://www.google.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407801/fix%20Google%20image%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/407801/fix%20Google%20image%20popup.meta.js
// ==/UserScript==

function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyle") || (function() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "GM_addStyle";
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}
GM_addStyle('.fixmodal {position:fixed;background-color:rgba(0, 0, 0, 0.5);height:100%;width:100%;top:0;left:0;display:none; z-index: 1000;}');
GM_addStyle('#fixPopup {padding:5px;text-align:center;}');
GM_addStyle('.fixmodalWrap {margin:5% auto; position:relative;width: fit-content;} ');

(function() {
    'use strict';
    var test = window.screen.height - 400;
GM_addStyle('#fixPopup img {max-height:'+test+'px;max-width:100%}');
    var callbackRoot = function(mutationsList, observer) {
        for(var mutation of mutationsList) {
            mutation.addedNodes.forEach(function(node) {
                if ($(node).find(".v4dQwb")){
                    var imageNode = $(node).find(".v4dQwb");
                    if (imageNode.hasClass("fixAttached") == false){
                        imageNode.addClass("fixAttached");
                        imageNode.click(function(e){
                            var thisImgSrc = $(this).find("img").attr("src");
                            e.stopPropagation();
                            $(".fixmodal").fadeIn("fast");
                            $("#fixPopup img").remove();
                            $('<img src="'+thisImgSrc+'" alt="image3" />').appendTo("#fixPopup");
                            e.preventDefault();
                        });
                    }
                }
            });
        }
    };
    function attachObserver(){
        var obs = $('.T1diZc');
        var isReady = obs.length > 0;
        if (!isReady) {
            setTimeout(obs, 300);
            return;
        }
        $("body").append('<div class="fixmodal"> <div class="fixmodalWrap"><div id="fixPopup"></div> </div></div>');
        $(document).on("click", function () {
            $(".fixmodal").fadeOut("fast");
        });
        $(".modalWrap").on("click", function (e) {
            e.stopPropagation();
        });
        console.log("attaching");
        var config = { attributes: false, childList: true, subtree: true };
        var targetNodeRoot = $(obs).first().get(0);
        var observerroot = new MutationObserver(callbackRoot);
        observerroot.observe(targetNodeRoot, config);
    }
    attachObserver();
})();