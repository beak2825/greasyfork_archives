// ==UserScript==
// @name         Add Tooltip for ShowStudyHistory in NX
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        http://www.naixuejiaoyu.com/*
// @include     *://www.naixuejiaoyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400696/Add%20Tooltip%20for%20ShowStudyHistory%20in%20NX.user.js
// @updateURL https://update.greasyfork.org/scripts/400696/Add%20Tooltip%20for%20ShowStudyHistory%20in%20NX.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("custome script is running!");
    let customScriptLoaded = false;
    function initTitle(){
        let nodes = document.querySelectorAll(".record-list .record-item span.course-title");
        let interval = setInterval(()=>{
            nodes = document.querySelectorAll(".record-list .record-item span.course-title");
            if(nodes.length != 0){
                document.querySelectorAll(".record-list .record-item span.course-title").forEach((span, index) => {
                    let text = span.outerText;
                    span.setAttribute("title",text);
                });
                clearInterval(interval);
            }
        },500);
    }

    function adjustListStyle(){
        let styleTag = document.createElement("style");
       styleTag.innerHTML = `
       .record-list{display:flex;flex-wrap:wrap;}
.record-list .record-item{width: 50%;}
.record-list .record-item .record-item{display: flex !important;width: 100%;flex-direction: row;height: initial; padding-bottom: 10px;}
.record-list .record-item .record-item .course-info .course-title{white-space: initial !important;width:100% !important;}
.record-list .record-item .record-item .course-info .progress-stick{margin-bottom: 16px;width: 100%;padding-right: 10px;}
`
       document.body.append(styleTag);
    }

    document.addEventListener('readystatechange', event => {
        if (event.target.readyState === 'complete') {
            initTitle();
            adjustListStyle();
            customScriptLoaded = true;
        }

        if (event.target.readyState === 'interactive') {
            console.log("readystate===interactive");
        }
    });
})();