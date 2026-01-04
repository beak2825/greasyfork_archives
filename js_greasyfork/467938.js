// ==UserScript==
// @name         Location Select
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  for XM inner mall!
// @author       cxh
// @match        https://mall.asset.mioffice.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mioffice.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467938/Location%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/467938/Location%20Select.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...");

    if (document.title == "内购商城") {
        var selectLoc = function(){
            var sele = document.getElementById("loc_select");
            var lists = document.getElementsByClassName("product-card");
            if (sele.value != "all") {
                var text = sele.selectedOptions[0].label;
                for (var i = 0; i < lists.length;i++) {
                    var loc = lists[i].lastChild.lastChild;
                    if (text != loc.innerText) {
                        lists[i].style.display = "none";
                    } else {
                        lists[i].style.display = "";
                    }
                }
            }else {
                for (var i = 0; i < lists.length;i++) {
                        lists[i].style.display = "";
                }
            }
        }
        document.addEventListener("DOMSubtreeModified", function(e) {
            var content = e.target;
            if (content) {
                selectLoc();
            }
        });
        setTimeout(function(){
            var v = document.getElementsByClassName("tab__text")[0];
            var locs = document.createElement("select");
            locs.setAttribute("id","loc_select");
            locs.style.border = "none";

            locs.options.add(new Option("全部地区","all"));
            locs.options.add(new Option("北京","bj"));
            locs.options.add(new Option("上海","sh"));
            locs.options.add(new Option("南京","nj"));
            locs.options.add(new Option("深圳","sz"));
            locs.options.add(new Option("西安","xa"));
            v.appendChild(locs);

            locs.addEventListener("change", function(e) {
                selectLoc();
            });

            /**
            browser.webRequest.onHeadersReceived = function() {
                alert("hello");
            }*/
        }, 300);
    }
})();