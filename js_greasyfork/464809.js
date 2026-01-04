// ==UserScript==
// @name         Website Rating
// @namespace    https://github.com/InJeCTrL/Website-Rating
// @version      0.5
// @description  Rate any websites and share the score.
// @author       InJeCTrL
// @match        *://*/*
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @connect      gnkoe7p6qgdsawca7yhsqazl5a0tivbw.lambda-url.us-west-2.on.aws
// @connect      h2qmzkyawce5k7q7mjtslwtaxm0chedg.lambda-url.us-west-2.on.aws
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464809/Website%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/464809/Website%20Rating.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (self != top) {
        return;
    }

    var css = `
    #rateBarBox {
        position: fixed;
        display: flex;
        bottom: 0px;
        height: 30px;
        width: 100%;
        line-height: 30px;
        background: black;
        pointer-events: none;
        z-index: 9999999;
        background: rgba(0,0,0,0);
    }
    #rateBarGood {
        background: linear-gradient(rgba(0,0,0,0), rgba(127,255,212,100));
        height: 100%;
        width: 50%;
    }
    #rateBarBad {
        background: linear-gradient(rgba(0,0,0,0), rgba(233,150,122,100));
        height: 100%;
        width: 50%;
    }
    #rateIncr {
        pointer-events: auto;
        border: none;
        background: rgb(127,255,212);
        cursor: pointer;
        font-size: 14px;
    }
    #rateDec {
        pointer-events: auto;
        border: none;
        background: rgb(233,150,122);
        cursor: pointer;
        font-size: 14px;
    }
    #rateView {
        position: absolute;
        pointer-events: auto;
        height: 100%;
        left: 50%;
        transform: translate(-50%, 0px);
        font-size: 13px;
    }
`;

    GM_addElement(document.children[0], 'style', { textContent: css });

    function flashBar(targetBox, rating) {
        var goodCnt = rating['good'];
        var badCnt = rating['bad'];

        if ((goodCnt + badCnt) > 0) {
            var goodPercent = goodCnt * 100 / (goodCnt + badCnt);
            var badPercent = 100 - goodPercent;
            targetBox.children[1].style.width = goodPercent + '%';
            targetBox.children[2].style.width = badPercent + '%';
        }

        targetBox.children[3].innerText = "👍:" + goodCnt + " 👎:" + badCnt;
    }

    function operate(targetBox, operation) {
        var host = window.location.host;

        GM_xmlhttpRequest({
            method: "post",
            url: "https://gnkoe7p6qgdsawca7yhsqazl5a0tivbw.lambda-url.us-west-2.on.aws/",
            headers: {
                "Content-Type": "application/json;"
            },
            data: JSON.stringify({
                'host': host,
                'operation': operation
            }),
            onload: function(response){
                var rating = JSON.parse(response.responseText);
                if ("msg" in rating) {
                    alert(rating['msg']);
                } else {
                    flashBar(targetBox, rating);
                }
            },
            onerror: function(response){
                console.error(response);
            }
        });
    }

    function init(targetBox) {
        var host = window.location.host;

        GM_xmlhttpRequest({
            method: "post",
            url: "https://h2qmzkyawce5k7q7mjtslwtaxm0chedg.lambda-url.us-west-2.on.aws/",
            headers: {
                "Content-Type": "application/json;"
            },
            data: JSON.stringify({
                'host': host
            }),
            onload: function(response){
                var rating = JSON.parse(response.responseText);
                flashBar(targetBox, rating);
            },
            onerror: function(response){
                console.error(response);
            }
        });
    }

    var rateBarBox = document.createElement('div');
    rateBarBox.id = 'rateBarBox';
    rateBarBox = GM_addElement(document.children[0], 'div', { id: 'rateBarBox' });

    var rateBarGood = document.createElement('div');
    rateBarGood.id = 'rateBarGood';

    var rateBarBad = document.createElement('div');
    rateBarBad.id = 'rateBarBad';

    var rateView = document.createElement('div');
    rateView.id = 'rateView';

    var rateIncr = document.createElement('button');
    rateIncr.id = 'rateIncr';
    rateIncr.innerText = '+1';

    document.getElementById('rateBarBox').appendChild(rateIncr);

    document.getElementById('rateBarBox').appendChild(rateBarGood);
    document.getElementById('rateBarBox').appendChild(rateBarBad);
    document.getElementById('rateBarBox').appendChild(rateView);

    var rateDec = document.createElement('button');
    rateDec.id = 'rateDec';
    rateDec.innerText = '-1';

    document.getElementById('rateBarBox').appendChild(rateDec);

    rateIncr.onclick = function(event) {
        operate(event.target.parentElement, '+');
    }

    rateDec.onclick = function(event) {
        operate(event.target.parentElement, '-');
    }

    init(rateBarBox);
})();