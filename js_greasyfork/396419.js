// ==UserScript==
// @name         Query Reformulation for Stack Overflow
// @namespace    QueryReformulation
// @version      1.1
// @description  This is a script for you to enable query reformulation on Stack Overflow by using SEQUER, a software specific query reformulation approach.
// @author       kbcao
// @match        https://*.stackoverflow.com/*
// @grant        GM_xmlhttpRequest
// @connect      sequer-tpznovfjxa-uc.a.run.app
// @downloadURL https://update.greasyfork.org/scripts/403083/Query%20Reformulation%20for%20Stack%20Overflow.user.js
// @updateURL https://update.greasyfork.org/scripts/403083/Query%20Reformulation%20for%20Stack%20Overflow.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var inputBoxTop = document.getElementsByClassName('s-input s-input__search js-search-field ')[0];
    var inputBoxResult = document.getElementsByClassName('grid--cell fl1 s-input')[0];


    function callapi(query, hintBox) {
        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://sequer-tpznovfjxa-uc.a.run.app/?query=' + query,
            onload: function (response) {
                var lastDisplay = document.getElementsByName('queryreformulation');
                if (lastDisplay !== null) {
                    for (var i = 0, len = lastDisplay.length; i < len; i++) {
                        lastDisplay[0].parentNode.removeChild(lastDisplay[0]);
                    }
                }
                var predictions = JSON.parse(response.response).predictions;
                if (predictions.length > 0) {
                    var reform_hint_html = '<div class="sm:mb12" name="queryreformulation"> <span class="ff-mono fc-dark"> ----------------------<br> </span> <span class="ff-mono fc-dark"> <font size="3">Reformulations:</font> </span> </div>';
                    hintBox.children[0].innerHTML += reform_hint_html;
                }
                predictions.forEach(function (item, index, array) {
                    var reform_html = '<div class="sm:mb12" name="queryreformulation" onclick="document.getElementsByClassName(\'s-input s-input__search js-search-field \')[0].value=this.children[0].innerText"> <span class="ff-mono fc-dark"><font size="2">' + item + '</font></span></div>';
                    hintBox.children[0].innerHTML += reform_html;
                });
            }
        });
    }

    $(document).keydown(function (e) {
        if (e.ctrlKey && e.keyCode == 81) {
            var hintboxAppear = document.getElementsByClassName('s-popover p0 wmx100 wmn4 sm:wmn-initial js-top-search-popover s-popover--arrow__tl is-visible')[0];
            var hintBox;
            var query;
            if (hintboxAppear == null) {
                hintBox = document.getElementsByClassName('nav-links')[0];
            } else {
                hintBox = hintboxAppear.children[3].children[0];
            }
            if (inputBoxTop.value.length != 0) {
                query = inputBoxTop.value;
            } else {
                query = inputBoxResult.value;
            }
            callapi(query, hintBox);
        }
    })
})();
