// ==UserScript==
// @name         brat_add_baidu
// @namespace    http://tampermonkey.net/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version      0.1
// @description  learn to add a button for baidu on the brat.
// @author       LiuXun
// @match        http://121.12.85.245:1344/brat*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382961/brat_add_baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/382961/brat_add_baidu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    window.onload=function(){
        var element = document.querySelector("body > div:nth-child(22)");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type == "attributes") {
//                     console.log('mm', new Date().getTime())
//                     console.log("attributes changed", mutation.attributeName)
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
    //(function init(){var counter = document.querySelector("body > div:nth-child(22)");if (counter) {
        /* do something with counter element */
        //(function myfun(){var display = document.querySelector("body > div:nth-child(22)").style.display;if (display=='block') {
        //    /* do something with counter element */
        //    console.log('brat_add_baidu:' + document.querySelector("body > div:nth-child(22)").style.display)
        //    $('#span_Wikipedia').after(',<a target="_blank" id="span_baidu" href="http://www.baidu.com/s?wd=' + $('#span_selected').text() + '">Baidu</a>')
        //   //document.querySelector("body > div:nth-child(22)").style.display
        //    } else { setTimeout(myfun, 0);}})();
    //} else { setTimeout(init, 0);}})();
})();