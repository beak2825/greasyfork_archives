// ==UserScript==
// @name         Netease News AD Remover
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description:en-us  It's able to remove Netease news(news.163.com) ads. Maybe not all of them.
// @description:zh-cn  网易新闻移除装置
// @author       Sherry
// @license      MIT
// @match        https://news.163.com/
// @grant        none
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @description 网易新闻移除装置
// @downloadURL https://update.greasyfork.org/scripts/413997/Netease%20News%20AD%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/413997/Netease%20News%20AD%20Remover.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function remover(){
        // Your code here...
        $("#iSlider-wrapper").parent().remove();
        $("#tcldivtf1").remove();
        $("#tcldivtf2").remove();
        $(".common_ad_item").remove();
        $(".index_top_ad").remove();
        $("[adtype]").remove();
        $(".mod_ad_toutu").remove();
        $(".mod_ad_r").remove();
        $(".mod_ad_l").remove();
        $("#xtMainDiv").remove();
/*
        $("div[style]").each(function(){
            if($(this).css("position")=='fixed' || $(this).css("position")=='absolute'){
                $(this).remove();
            }
        });
        */
    }

    var targetNode = document.querySelector("body");
    var config = { attributes: false, childList: true, subtree: true };

    var callback = function(mutationsList) {
        for (var mutation of mutationsList) {


            if (mutation.type == "childList" || mutation.type=='subtree') {
             // console.log(mutation);
                for (var node of mutation.addedNodes) { //   console.log("A child node has been added or removed.");
                    if(node.id=='tcldivtf1b')
                    {
                        console.log(node);
                    }
                    if(node.id=='js_N_login_wrap')
                    {
                      console.log('login pane %o',node);
                        continue;
                    }

                    if(typeof node.tagName !=='undefined' && node.tagName!='BODY' && node.tagName!='SCRIPT'  && node.tagName!='HEAD'  && node.tagName!='META'  && node.tagName!='LINK')                    {
                        if($(node).css("position")=='fixed' || $(node).css("position")=='absolute')
                        {
                            $(node).remove();
                            // console.log('tag '+node.id);
     }
                    }
                }
            } else if (mutation.type == "attributes") {
                //console.log(              "The " + mutation.attributeName + " attribute was modified."        );
            }

        }
        remover();
    };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();