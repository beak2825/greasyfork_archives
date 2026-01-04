// ==UserScript==
// @name     shanbay单词快捷键
// @namespace  https://github/webhugo
// @version    4.2.4
// @description shanbay单词快捷键rcug
// @author     hugo
// require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js

// @noframes
// @match    *://*.shanbay.com/*   

// @grant    GM.getValue
// @grant    GM.setValue
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM.xmlHttpRequest
// @grant    GM_openInTab
// @grant    GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/39973/shanbay%E5%8D%95%E8%AF%8D%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/39973/shanbay%E5%8D%95%E8%AF%8D%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==
// 
(function () {
    'use strict';
    var jQuery = $ || window.$;
    var item;
    try {
        document.onkeydown = (event) => {
            let key = event.key;
            if (key == 'g') {
                item = jQuery(".known.span10")
                if (item) {
                    item.click();
                    console.log("know");
                    item = null;
                }
                item = jQuery(".continue.continue-button")
                if (item) {
                    item.click();
                    console.log("continue");
                    item = null;
                }
              event.preventDefault()

            }
            if (key == 'u') {
                item = jQuery(".unknown.span10");
                if (item) {
                    item.click();
                    console.log("unkown");
                    item = null;
                }
              event.preventDefault()
            }
            if (key == 'r') {
                item = jQuery(".speaker-icon");
                if (item) {
                    item.click();
                    console.log("read");
                    item = null;
                }
              event.preventDefault()
            }


            if(key == 'c'){
                let word = $(".span10.offset1>h1").text();
                $(".span10.offset1>h1").text()
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://cn.bing.com/dict/search?q=${word}`,
                    onload: function (response) {
                       
                        //let html = jQuery(".lf_area",jQuery(response.responseText)).html();
                        //lf_area
                        jQuery("#answer").append(response.responseText);
                    }
                });
              event.preventDefault()
            }
            

        }

    } catch (e) {
        console.log(e);
    }
})();