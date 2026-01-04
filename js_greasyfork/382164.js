// ==UserScript==
// @name         CSDN 移除 APP 打开
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  自动展开内容，移除讨厌的 APP 内打开
// @author       sl00p
// @match        https://blog.csdn.net/*
// @match        https://www.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382164/CSDN%20%E7%A7%BB%E9%99%A4%20APP%20%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/382164/CSDN%20%E7%A7%BB%E9%99%A4%20APP%20%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Skill main page
    var mainInter = setInterval(function() {
        var enter = document.getElementById("guid-btn-enter");
        if(enter && enter !== undefined) {
            enter.click();
            clearInterval(mainInter);
        }
    }, 50);
    var interval = setInterval(function() {
        var listNodes = document.getElementsByClassName("container-fluid container-blog app-open-box");
        for(var idx = 0; idx < listNodes.length; ++idx) {
            listNodes[idx].className = "container-fluid bdinsert"
        }
        if(listNodes.length === 0) {
            clearInterval(interval);
        }
    }, 50);
    // Remove all app download url.
    var removeInter = setInterval(function() {
        var removeNodes = ["flag col-md-4", "btn_app_link"];
        for(var idx = 0; idx < removeNodes.length; ++idx) {
            var nodes = document.getElementsByClassName(removeNodes[idx]);
            for(var jdx = 0; jdx < nodes.length; ++jdx) {
                if(nodes[jdx] !== undefined) {
                    nodes[jdx].remove();
                }
            }
        }
        if(removeNodes.length === 0) {
            clearInterval(removeInter);
        }
    }, 50);
    // Use real img url.
    setTimeout(function() {
        var imgNodes = document.getElementsByClassName("has");
        for(var idx = 0; idx < imgNodes.length; ++idx) {
            imgNodes[idx].setAttribute.src = imgNodes[idx].attributes["data-src"];
        }
        document.getElementsByClassName("read_more_btn")[0].click();
    }, 50);
    // If has pop windows, click cancel.
    // FixMe if has better choice.
    setInterval(function() {
        var popNodes = document.getElementsByClassName("read_more_btn_app_prompt_btn_cancel");
        for(var idx = 0; idx < popNodes.length; ++idx) {
           popNodes[idx].click();
        }
    }, 10);
})();