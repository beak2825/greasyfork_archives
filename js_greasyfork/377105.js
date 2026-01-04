// ==UserScript==
// @name         baidu minus baidu
// @home-url     https://greasyfork.org/en/scripts/377105-baidu-minus-baidu
// @namespace    https://github.com/XXXDDD/monkey/edit/master/baidu_minus_baidu.js
// @version      0.2
// @description  Use baidu without baidu trash
// @author       XD
// @include      http://www.baidu.com/*
// @include      https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377105/baidu%20minus%20baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/377105/baidu%20minus%20baidu.meta.js
// ==/UserScript==

var ignored_url_arr = [
    'jingyan.baidu',
    'tieba.baidu',
    'baijiahao.baidu',
    'baike.baidu',
    'zhidao.baidu',
    'wenku.baidu',
    'b2b.baidu',
    'map.baidu',
    'image.baidu',
    'xueshu.baidu',
    'muzhi.baidu'
];

function checkText(text, arr) {
    var flag = false;
    arr.forEach(function (value, i) {
        if (text && text.indexOf(value) > -1) {
            flag = true;
        }
    })
    return flag;
};

(function () {
    'use strict';

    $(document).on('DOMSubtreeModified', process);

    function process() {

        var results = document.getElementById('content_left');

        if (!results) return;

        for (var i = 0; i < results.children.length; i++) {
            // Remove baidu news
            //
            var mu = results.children[i].attributes.mu;
            if (mu && mu.value.indexOf("https://www.baidu.com/s?tn=news") >= 0) {
                results.children[i].parentNode.removeChild(results.children[i]);
                continue;
            }

            // Remove baidu results with trash sub urls
            //
            var links = results.children[i].getElementsByClassName('c-showurl');
            if (links && links.length > 0) {
                var link = links[0],
                    text = link.innerText,
                    h = link.href,
                    flag = false;

                if (checkText(text, ignored_url_arr) || checkText(h, ignored_url_arr)) {
                    flag = true;
                }

                if (flag) {
                    results.children[i].parentNode.removeChild(results.children[i]);
                }
            }
        }

    }
})();