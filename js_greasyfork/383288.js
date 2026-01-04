// ==UserScript==
// @name         brat_add_other_search_button
// @namespace    http://tampermonkey.net/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version      0.1
// @description  add a button for baidu on the brat.
// @author       LiuXun
// @match        http://121.12.85.245:1344/brat*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383288/brat_add_other_search_button.user.js
// @updateURL https://update.greasyfork.org/scripts/383288/brat_add_other_search_button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    window.onload=function(){
        var element = document.querySelector("body > div:nth-child(22)");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type == "attributes") {
                    console.log('brat_add_baidu: display changed:' + document.querySelector("body > div:nth-child(22)").style.display)
                    if ($('#span_baidu')[0]){
                        $('#span_baidu')[0].href='http://www.baidu.com/s?wd=' + $('#span_selected').text()
                    }
                    else {
                    $('#span_Wikipedia').after(',<a target="_blank" id="span_baidu" href="http://www.baidu.com/s?wd=' + $('#span_selected').text() + '">Baidu</a>')
                    }
                }
            });
        });
        observer.observe(element, {
            attributes: true //configure it to listen to attribute changes
        });
    }
})();