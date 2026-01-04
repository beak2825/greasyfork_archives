// ==UserScript==
// @name         twitter jpg_large2jpg and download image in origin size 修改推特的jpg_large为jpg并下载原图
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  change the src of pics on twitter form jpg:large/jfif/png:large to jpg/png WITHOUT quality losing 
// @author       azuse
// @match        https://twitter.com*
// @match        https://twitter.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/393058/twitter%20jpg_large2jpg%20and%20download%20image%20in%20origin%20size%20%E4%BF%AE%E6%94%B9%E6%8E%A8%E7%89%B9%E7%9A%84jpg_large%E4%B8%BAjpg%E5%B9%B6%E4%B8%8B%E8%BD%BD%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/393058/twitter%20jpg_large2jpg%20and%20download%20image%20in%20origin%20size%20%E4%BF%AE%E6%94%B9%E6%8E%A8%E7%89%B9%E7%9A%84jpg_large%E4%B8%BAjpg%E5%B9%B6%E4%B8%8B%E8%BD%BD%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    // Select the node that will be observed for mutations
    var targetNode = $("body")[0];

    // Options for the observer (which mutations to observe)
    var config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList) {


        var b=$("img[src*='png:large']");
        b.each(function(){
            $(this).attr( "src",String($(this).attr("src")).replace(/\.png:large/,"?format=png&name=orig"));
        });
        var c=$("img[src*='jpg:large']");
        c.each(function(){
            $(this).attr( "src",String($(this).attr("src")).replace(/\.jpg:large/,"?format=jpg&name=orig"));
        });
        var d=$("img[src*='jfif']");
        d.each(function(){
            $(this).attr( "src",String($(this).attr("src")).replace(/\.jpg:large/,"?format=jpg&name=orig"));
        });
        var e=$("img[src*='format=jpg&name=']");
        e.each(function(){
            $(this).attr( "src",String($(this).attr("src")).replace(/format=jpg&name=/,"format=png&name="));
        });
        //alert("");
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();