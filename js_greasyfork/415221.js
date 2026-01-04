// ==UserScript==
// @name         SCO实验室文章重排
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  SCO实验室文章加宽，点击图片放大
// @author       Mr.NullNull
// @match        https://www.seotest.cn/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415221/SCO%E5%AE%9E%E9%AA%8C%E5%AE%A4%E6%96%87%E7%AB%A0%E9%87%8D%E6%8E%92.user.js
// @updateURL https://update.greasyfork.org/scripts/415221/SCO%E5%AE%9E%E9%AA%8C%E5%AE%A4%E6%96%87%E7%AB%A0%E9%87%8D%E6%8E%92.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function Main() {
        var dom = document.createElement("style");
        dom.innerHTML = `
        .lm_index {
            width: 1440px;
        }
        .lm_left {
            width: 1140px;
        }
        #my_img {
            margin: 0;
            padding: 0;
            outline: 8px solid #aaa;
            background: #aaa;
            
            position: fixed;
            top: 50%;
            left: 50%;
            z-index: 9999;
        }
        `;
        document.body.append(dom);


        dom = document.createElement("div");
        dom.id = "my_img";
        dom.style = "display: none;"
        dom.innerHTML = `<img src="">`;
        document.body.append(dom);

        var domdiv = document.querySelector("#my_img");
        var domimg = document.querySelector("#my_img > img");

        document.addEventListener("click", function (event) {
            var ev = event ? event : window.event;
            var elem = ev.target;

            if (elem.tagName.toLowerCase() == 'img') {
                var w = elem.naturalWidth;
                var h = elem.naturalHeight;
                console.log(w, h);
                console.log(elem.src);

                var styleTxt = `
                    margin-top: -${h/2}px;
                    margin-left:-${w/2}px;
                `;

                domdiv.style = styleTxt;
                domimg.src = elem.src;

            } else {
                dom.style = "display: none;";
            }


        }, true);

        domdiv.onclick = function () {
            dom.style = "display: none;";
        };

    }

    Main();
})();