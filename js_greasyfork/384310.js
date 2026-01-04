// ==UserScript==
// @name         必应搜索双栏显示
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  双栏显示必应搜索结果
// @include      *://*.bing.com/search?*
// @author       Mr.NullNull
// @downloadURL https://update.greasyfork.org/scripts/384310/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%8F%8C%E6%A0%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/384310/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%8F%8C%E6%A0%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    Main();
    function Main() {
        document.querySelector("#b_results").setAttribute("class", "listOld");
        document.querySelector("div#b_content > main").innerHTML += '<ol id="b_results" class="listA"></ol><ol id="b_results" class="listB"></ol><ol id="b_results" class="listC"></ol>';
        document.querySelector("head").innerHTML += `
        <style>
            ool>li{ outline: 1px solid #ccc; }
            #b_content {
                width: 1280px;
            }
            .listOld {
                display: none !important;
                width: 100% !important;
            }
            #b_results {
                width: 50%;
                float: left;
            }
            .listC {
                width: 100% !important;
            }
            #b_context {
                width: 100%;
                margin: 5px 0;
                padding: 0 20px;
                background-color: initial;
            }
            #b_context > .b_ans {
                background-color: initial;
            }
            .b_vList>li {
                float: left;
                width: 20%;
                height: 1.5em;
            }
            
        </style>
        <style>
            body {
                background-color: #f1f2f3 !important;
            }
            #b_results>.b_algo, #b_results>.b_ans {
                margin: 7px 5px !important;
                padding: 10px 20px !important;
                display: block !important;
                background-color: #fff !important;
                box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .1), 0 0 0 1px rgba(0, 0, 0, .05);
                overflow: hidden !important;
            }
        </style>
        `;

        let list = document.querySelectorAll("#b_results > .b_algo, #b_results > .b_ans");

        var listA = document.querySelector(".listA");
        var listB = document.querySelector(".listB");
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            console.log(element.innerHTML);
            if (element.querySelector(".b_rs") == null && element.innerHTML != "") {
                if (parseInt(listA.offsetHeight) <= parseInt(listB.offsetHeight)) {
                    listA.appendChild(element);
                } else {
                    listB.appendChild(element);
                }
            }
        }


        //移动页码
        document.querySelector("#b_content > main").appendChild(document.querySelector("#b_results > .b_pag"));
        
    }
})();