// ==UserScript==
// @name         Kibana Decoder
// @namespace    Q
// @version      0.3
// @description  Decode
// @author       You
// @include      https://*monitor-*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mercedes-benz.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441943/Kibana%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/441943/Kibana%20Decoder.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var decoder = function () {
        var txt = document.createElement("textarea");
        return function (html) {
            txt.innerHTML = html;
            return txt.value;
        }
    }();

    function decodeElement(ele) {
        ele.textContent = decoder(ele.textContent);
    }


    function decodeList() {
        document.querySelectorAll("div[class='truncate-by-height']").forEach(decodeElement);
    }



    function setHook() {

        var id, length;

        try {
            length = document.querySelectorAll('.kbn-table.table tbody').length;
        } catch (e) {
            length = 0
        }

        if (length === 0) {
            setTimeout(setHook, 500);
            return;
        }

        document.querySelector(".kbn-table.table > tbody").addEventListener('DOMSubtreeModified', function () {
            if (id === undefined) {
                id = setTimeout(function() {
                    decodeList();
                    id = undefined;
                }, 1000);
            }
        });

        setInterval(function () {
            document.querySelectorAll("div[class='truncate-by-height']").forEach(decodeElement);
        }, 1000);
    }

    var onload = document.body.onload

    document.body.onload = function () {
        console.log('onload')
        if (onload) {
            onload();
        }

        setHook();
    }

    // Your code here...
})();